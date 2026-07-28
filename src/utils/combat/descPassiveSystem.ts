/**
 * Description-driven passive installer for leader/unique kits that lack
 * hand-written characterId hooks. Parses common kit-text patterns and
 * wires them into battle events.
 */
import { CombatState, CombatUnit, Ability } from '../../types';
import { applyStatus, checkHasTag, logBattleEvent, hasStatusFlag } from '../combatEngine';

export type DescPassiveEvent =
  | 'battle_start'
  | 'buff_gained'
  | 'debuff_gained'
  | 'special_used'
  | 'damage_dealt'
  | 'damage_taken'
  | 'crit'
  | 'enemy_defeated'
  | 'ally_defeated'
  | 'ally_below_50'
  | 'assist'
  | 'secrecy_gained'
  | 'secrecy_consumed'
  | 'tm_gained'
  | 'burning_gained'
  | 'turn_start';

export interface DescPassiveRule {
  ownerId: string; // combat unit id
  ownerCharacterId: string;
  abilityId: string;
  requiresLeader?: boolean;
  faction?: string; // aura / filter faction
  event: DescPassiveEvent;
  actions: DescPassiveAction[];
  // Optional filters
  selfOnly?: boolean;
  allyFaction?: string;
  statusName?: string;
}

export type DescPassiveAction =
  | { type: 'tm'; target: 'self' | 'source' | 'faction' | 'allies'; pct: number }
  | { type: 'heal_hp'; target: 'self' | 'source' | 'faction' | 'allies'; pct: number }
  | { type: 'heal_prot'; target: 'self' | 'source' | 'faction' | 'allies'; pct: number }
  | { type: 'status'; target: 'self' | 'source' | 'faction' | 'allies'; name: string; duration: number; isDebuff: boolean }
  | { type: 'bonus_turn'; target: 'self' }
  | { type: 'stat_aura'; speed?: number; offensePct?: number; defensePct?: number; maxHpPct?: number; maxProtPct?: number; critDamage?: number; potency?: number; critChance?: number };

function factionMatch(unit: CombatUnit, faction: string | undefined): boolean {
  if (!faction) return true;
  const f = faction.toLowerCase();
  if (checkHasTag(unit, faction)) return true;
  return (unit.tags || []).some(t => t.toLowerCase().includes(f) || f.includes(t.toLowerCase()));
}

function pickTargets(
  state: CombatState,
  owner: CombatUnit,
  target: 'self' | 'source' | 'faction' | 'allies',
  source: CombatUnit | null,
  faction?: string
): CombatUnit[] {
  const allies = owner.team === 'player' ? state.playerTeam : state.enemyTeam;
  const living = allies.filter(u => u.activeInBattle && u.hp > 0);
  switch (target) {
    case 'self': return owner.activeInBattle && owner.hp > 0 ? [owner] : [];
    case 'source': return source && source.activeInBattle && source.hp > 0 ? [source] : [];
    case 'faction': return living.filter(u => factionMatch(u, faction || owner.tags[0]));
    case 'allies': return living;
    default: return [owner];
  }
}

function applyAction(
  state: CombatState,
  owner: CombatUnit,
  action: DescPassiveAction,
  source: CombatUnit | null,
  faction?: string
) {
  if (action.type === 'stat_aura') return; // applied at battle start via install
  const targets = pickTargets(state, owner, action.target, source, faction);
  targets.forEach(u => {
    if (action.type === 'tm') {
      if (hasStatusFlag(u, 'prevent_tm_gain')) return;
      u.turnMeter = Math.min(100, u.turnMeter + action.pct);
    } else if (action.type === 'heal_hp') {
      if (hasStatusFlag(u, 'prevent_heal')) return;
      u.hp = Math.min(u.maxHp, u.hp + Math.round(u.maxHp * (action.pct / 100)));
    } else if (action.type === 'heal_prot') {
      if (hasStatusFlag(u, 'prevent_prot_recovery')) return;
      u.protection = Math.min(u.maxProtection, u.protection + Math.round(u.maxProtection * (action.pct / 100)));
    } else if (action.type === 'status') {
      applyStatus(state, u, action.name, action.duration, action.isDebuff, owner);
    } else if (action.type === 'bonus_turn') {
      if (!state.bonusTurnQueue.includes(u.id)) state.bonusTurnQueue.push(u.id);
      logBattleEvent(state, `⚡ ${u.name} gains a Bonus Turn!`, 'buff');
    }
  });
}

/** Extract faction name near "allies gain" in leader text */
function extractFaction(desc: string): string | undefined {
  const m = desc.match(/([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*)\s+allies gain/i)
    || desc.match(/While .{1,40} is Leader:\s*([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*)\s+allies/i)
    || desc.match(/([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*)\s+allies\s+\+/i);
  if (!m) return undefined;
  return m[1].trim();
}

function parseStatAura(desc: string): DescPassiveAction | null {
  const speed = desc.match(/\+?\s*(\d+)\s*Speed/i);
  const offense = desc.match(/\+?\s*(\d+)%\s*(?:Offense|Critical Damage|Max Health|Max Protection|Defense|Potency|Critical Chance)/i);
  // Collect all % stats
  const aura: DescPassiveAction = { type: 'stat_aura' };
  let any = false;
  const speedM = desc.match(/(\d+)\s*Speed/i);
  if (speedM) { aura.speed = parseInt(speedM[1], 10); any = true; }
  const off = desc.match(/(\d+)%\s*Offense/i);
  if (off) { aura.offensePct = parseInt(off[1], 10); any = true; }
  const def = desc.match(/(\d+)%\s*Defense(?!\s*Penetration)/i);
  if (def) { aura.defensePct = parseInt(def[1], 10); any = true; }
  const hp = desc.match(/(\d+)%\s*Max Health/i);
  if (hp) { aura.maxHpPct = parseInt(hp[1], 10); any = true; }
  const prot = desc.match(/(\d+)%\s*Max Protection/i);
  if (prot) { aura.maxProtPct = parseInt(prot[1], 10); any = true; }
  const cd = desc.match(/(\d+)%\s*Critical Damage/i);
  if (cd) { aura.critDamage = parseInt(cd[1], 10) / 100; any = true; }
  const pot = desc.match(/(\d+)%\s*Potency/i);
  if (pot) { aura.potency = parseInt(pot[1], 10) / 100; any = true; }
  const cc = desc.match(/(\d+)%\s*Critical Chance/i);
  if (cc) { aura.critChance = parseInt(cc[1], 10) / 100; any = true; }
  return any ? aura : null;
}

function parseRecoverAction(clause: string): DescPassiveAction | null {
  const prot = clause.match(/[Rr]ecover\s+(\d+)%\s*Protection/i);
  if (prot) {
    const who = /allies/i.test(clause) ? 'faction' : (/them|ally/i.test(clause) ? 'source' : 'self');
    return { type: 'heal_prot', target: who as any, pct: parseInt(prot[1], 10) };
  }
  const hp = clause.match(/[Rr]ecover\s+(\d+)%\s*Health/i);
  if (hp) {
    const who = /allies/i.test(clause) ? 'faction' : (/them|ally/i.test(clause) ? 'source' : 'self');
    return { type: 'heal_hp', target: who as any, pct: parseInt(hp[1], 10) };
  }
  return null;
}

function parseTmAction(clause: string): DescPassiveAction | null {
  const m = clause.match(/[Gg]ain\s+(\d+)%\s*Turn Meter/i) || clause.match(/gains?\s+(\d+)%\s*TM/i);
  if (!m) return null;
  const who = /allies/i.test(clause) ? 'faction' : (/them|ally/i.test(clause) && !/gains?\s+\d+%/i.test(clause.split(':').pop()||'') ? 'source' : 'self');
  // "X gains 5% Turn Meter" → self (owner of passive) unless "ally gains"
  let target: 'self' | 'source' | 'faction' = 'self';
  if (/allies gain/i.test(clause)) target = 'faction';
  else if (/ally gains/i.test(clause) || /them/i.test(clause)) target = 'source';
  return { type: 'tm', target, pct: parseInt(m[1], 10) };
}

function parseStatusGain(clause: string): DescPassiveAction | null {
  const statuses = ['Taunt', 'Offense Up', 'Defense Up', 'Speed Up', 'Retribution', 'Foresight', 'Stealth', 'Tenacity Up', 'Critical Damage Up', 'Critical Chance Up', 'Last Hope', 'Advantage', 'Entrenched', 'Evasion Up', 'Critical Avoidance Up', 'Defense Penetration Up', 'Health Up', 'Protection Up', 'Whiteout'];
  for (const s of statuses) {
    if (new RegExp(`gain\\s+${s}`, 'i').test(clause) || new RegExp(`gains\\s+${s}`, 'i').test(clause)) {
      const dur = clause.match(new RegExp(`${s}\\s*\\((\\d+)\\s*turns?\\)`, 'i'));
      return { type: 'status', target: 'self', name: s, duration: dur ? parseInt(dur[1], 10) : 2, isDebuff: false };
    }
  }
  if (/[Bb]onus [Tt]urn/.test(clause)) return { type: 'bonus_turn', target: 'self' };
  return null;
}

function parseWheneverRules(owner: CombatUnit, ability: Ability, requiresLeader: boolean): DescPassiveRule[] {
  const desc = ability.desc;
  const faction = extractFaction(desc) || owner.tags.find(t => !/legendary|galactic|light|dark|attacker|tank|support|leader/i.test(t));
  const rules: DescPassiveRule[] = [];
  // Split on Whenever
  const parts = desc.split(/[Ww]henever\s+/);
  for (let i = 1; i < parts.length; i++) {
    const chunk = parts[i];
    const [condRaw, ...rest] = chunk.split(/:\s*/);
    const effectClause = rest.join(':') || chunk;
    const cond = (condRaw || '').toLowerCase();

    let event: DescPassiveEvent | null = null;
    let statusName: string | undefined;
    let selfOnly = false;

    if (/ally gains secrecy|allies gain secrecy|gains? secrecy/.test(cond)) { event = 'secrecy_gained'; }
    else if (/secrecy is consumed|consumes? secrecy|ally consumes secrecy/.test(cond)) { event = 'secrecy_consumed'; }
    else if (/enemy is defeated|defeats? an enemy|defeat enemies/.test(cond)) { event = 'enemy_defeated'; }
    else if (/ally is defeated|allies? (?:is|are) defeated/.test(cond)) { event = 'ally_defeated'; }
    else if (/critically hits?|critical hit/.test(cond) && !/critically hit\b/.test(cond)) { event = 'crit'; selfOnly = /^(an? )?(ally|allies)/.test(cond) ? false : true; }
    else if (/is critically hit|critically hit/.test(cond)) { event = 'damage_taken'; selfOnly = true; statusName = 'crit_received'; }
    else if (/uses? a special|use(?:s)? a special ability|uses? special/.test(cond)) { event = 'special_used'; }
    else if (/gains? a buff|ally gains? a buff|allies gain (?:a )?buffs?/.test(cond)) { event = 'buff_gained'; }
    else if (/gains? a debuff|enemy gains? a debuff|inflict/.test(cond) && /debuff/.test(cond)) { event = 'debuff_gained'; }
    else if (/falls? below 50%|fall below 50%|below 50% health|below 50% hp/.test(cond)) { event = 'ally_below_50'; }
    else if (/attack(?:s|ing)? out of turn|assist/.test(cond)) { event = 'assist'; }
    else if (/gains? turn meter|gain(?:s)? \d+% turn meter/.test(cond) && /ally|trooper|faction/.test(cond)) { event = 'tm_gained'; }
    else if (/gains? burn|enemy gains burn|gains? burning/.test(cond)) { event = 'burning_gained'; }
    else if (/takes? damage|taken damage|is damaged|damaged/.test(cond)) { event = 'damage_taken'; selfOnly = !/ally/.test(cond); }
    else if (/attacks?|deals? damage/.test(cond)) { event = 'damage_dealt'; selfOnly = true; }
    else if (/loses? taunt|lose taunt/.test(cond)) { event = 'buff_gained'; statusName = 'Taunt_lost'; } // special-cased below
    else if (/burning enemy|attacks? a burning/.test(cond)) { event = 'damage_dealt'; statusName = 'Burning'; selfOnly = true; }

    if (!event) continue;

    const actions: DescPassiveAction[] = [];
    const rec = parseRecoverAction(effectClause);
    if (rec) actions.push(rec);
    const tm = parseTmAction(effectClause);
    if (tm) actions.push(tm);
    const st = parseStatusGain(effectClause);
    if (st) actions.push(st);
    // "Deal X% additional damage" — mark via status Advantage-like; skip numeric dmg for now
    if (!actions.length) continue;

    rules.push({
      ownerId: owner.id,
      ownerCharacterId: owner.characterId,
      abilityId: ability.id,
      requiresLeader,
      faction,
      event,
      actions,
      selfOnly,
      statusName,
    });
  }
  return rules;
}

function ensureStore(state: CombatState) {
  if (!state.dynamicState) state.dynamicState = {};
  if (!state.dynamicState.descPassives) state.dynamicState.descPassives = [] as DescPassiveRule[];
  if (!state.dynamicState.descAuras) state.dynamicState.descAuras = [] as { ownerId: string; faction?: string; aura: Extract<DescPassiveAction, { type: 'stat_aura' }>; requiresLeader: boolean }[];
  if (!state.dynamicState.descPassiveInstalled) state.dynamicState.descPassiveInstalled = false;
}

/** Call once per battle from applySquadPassives */
export function installDescPassives(state: CombatState) {
  ensureStore(state);
  if (state.dynamicState.descPassiveInstalled) return;
  state.dynamicState.descPassiveInstalled = true;
  state.dynamicState.descPassives = [];
  state.dynamicState.descAuras = [];

  const units = [...state.playerTeam, ...state.enemyTeam];
  units.forEach(unit => {
    if (!unit.activeInBattle) return;
    unit.abilities.forEach(ab => {
      if (ab.type !== 'leader' && ab.type !== 'unique') return;
      const requiresLeader = ab.type === 'leader';
      // Stat auras from leaders (and some uniques that buff at start)
      if (ab.type === 'leader' || /at the start of battle/i.test(ab.desc)) {
        const aura = parseStatAura(ab.desc);
        if (aura && aura.type === 'stat_aura') {
          state.dynamicState.descAuras.push({
            ownerId: unit.id,
            faction: extractFaction(ab.desc),
            aura,
            requiresLeader,
          });
        }
        // Start-of-battle status grants: "At the start of battle: X gains Taunt"
        if (/at the start of battle/i.test(ab.desc)) {
          const st = parseStatusGain(ab.desc);
          if (st) {
            applyAction(state, unit, st, unit, extractFaction(ab.desc));
          }
          // Hostage-style already handled elsewhere
        }
      }
      const whenever = parseWheneverRules(unit, ab, requiresLeader);
      state.dynamicState.descPassives.push(...whenever);
    });
  });

  // Apply max HP / protection auras once at install
  state.dynamicState.descAuras.forEach((entry: any) => {
    const owner = units.find(u => u.id === entry.ownerId);
    if (!owner || !owner.activeInBattle) return;
    if (entry.requiresLeader && owner.position !== 0) return;
    const aura = entry.aura as Extract<DescPassiveAction, { type: 'stat_aura' }>;
    const allies = (owner.team === 'player' ? state.playerTeam : state.enemyTeam)
      .filter(u => u.activeInBattle && u.hp > 0 && factionMatch(u, entry.faction));
    allies.forEach(u => {
      if (aura.maxHpPct) {
        const bonus = Math.round(u.maxHp * (aura.maxHpPct / 100));
        u.maxHp += bonus;
        u.hp += bonus;
      }
      if (aura.maxProtPct) {
        const bonus = Math.round(u.maxProtection * (aura.maxProtPct / 100));
        u.maxProtection += bonus;
        u.protection += bonus;
      }
      if (aura.speed) {
        u.speed += aura.speed;
      }
      if (!u.dynamicState) u.dynamicState = {};
      if (!u.dynamicState.descAuraMods) u.dynamicState.descAuraMods = { offensePct: 0, defensePct: 0, critDamage: 0, potency: 0, critChance: 0 };
      if (aura.offensePct) u.dynamicState.descAuraMods.offensePct += aura.offensePct / 100;
      if (aura.defensePct) u.dynamicState.descAuraMods.defensePct += aura.defensePct / 100;
      if (aura.critDamage) u.dynamicState.descAuraMods.critDamage += aura.critDamage;
      if (aura.potency) u.dynamicState.descAuraMods.potency += aura.potency;
      if (aura.critChance) u.dynamicState.descAuraMods.critChance += aura.critChance;
    });
    logBattleEvent(state, `📜 Leader/Unique aura applied from ${owner.name}`, 'buff');
  });
}

function ownerLiving(state: CombatState, rule: DescPassiveRule): CombatUnit | null {
  const u = [...state.playerTeam, ...state.enemyTeam].find(x => x.id === rule.ownerId);
  if (!u || !u.activeInBattle || u.hp <= 0) return null;
  if (rule.requiresLeader && u.position !== 0) return null;
  return u;
}

/** Fire matching description passives */
export function fireDescPassives(
  state: CombatState,
  event: DescPassiveEvent,
  source: CombatUnit | null,
  extras?: { statusName?: string; isCrit?: boolean }
) {
  ensureStore(state);
  const rules: DescPassiveRule[] = state.dynamicState.descPassives || [];
  rules.forEach(rule => {
    if (rule.event !== event) return;
    const owner = ownerLiving(state, rule);
    if (!owner) return;

    if (rule.selfOnly && source && source.id !== owner.id) return;
    if (rule.statusName === 'Burning' && extras?.statusName !== 'Burning' && event === 'damage_dealt') {
      // require target has burning — caller should pass statusName on target
      if (extras?.statusName !== 'Burning') return;
    }
    if (rule.statusName === 'crit_received' && extras?.statusName !== 'crit_received') return;
    if (event === 'secrecy_gained' || event === 'secrecy_consumed') {
      // ok
    }
    if (event === 'buff_gained' && rule.statusName === 'Taunt_lost') return; // not this path

    // Faction filter for ally-sourced events
    if (source && (event === 'buff_gained' || event === 'special_used' || event === 'assist' || event === 'tm_gained' || event === 'ally_below_50' || event === 'crit')) {
      if (source.team !== owner.team) {
        // enemy events handled separately
        if (!['enemy_defeated', 'debuff_gained', 'burning_gained', 'secrecy_consumed'].includes(event)) {
          // ally-facing
        }
      }
      if (['buff_gained', 'special_used', 'assist', 'tm_gained', 'ally_below_50'].includes(event) && source.team !== owner.team) return;
      if (rule.faction && ['buff_gained', 'special_used', 'assist', 'tm_gained', 'crit', 'ally_below_50'].includes(event)) {
        if (source.team === owner.team && !factionMatch(source, rule.faction) && source.id !== owner.id) {
          // allow if not faction-restricted in condition — keep permissive for "ally"
        }
      }
    }

    rule.actions.forEach(action => applyAction(state, owner, action, source, rule.faction));
  });
}

/** Apply desc-aura offense/defense mods inside getModifiedStats */
export function getDescAuraStatMods(unit: CombatUnit): { offense: number; defense: number; critDamage: number; potency: number; critChance: number } {
  const m = unit.dynamicState?.descAuraMods;
  if (!m) return { offense: 1, defense: 1, critDamage: 0, potency: 0, critChance: 0 };
  return {
    offense: 1 + (m.offensePct || 0),
    defense: 1 + (m.defensePct || 0),
    critDamage: m.critDamage || 0,
    potency: m.potency || 0,
    critChance: m.critChance || 0,
  };
}
