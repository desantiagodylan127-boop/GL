/**
 * Dedicated kit condition trackers: BH Payout, Scum, Traps, Brotherly Love,
 * Endless Legion death-save, Howzer untargetable, Last Hope / Ultimate Charge helpers.
 */
import { CombatState, CombatUnit, Ability } from '../../types';
import { applyStatus, checkHasTag, logBattleEvent, hasStatusFlag, executeCombatAction } from '../combatEngine';

function squadOf(state: CombatState, unit: CombatUnit) {
  return unit.team === 'player' ? state.playerTeam : state.enemyTeam;
}
function living(units: CombatUnit[]) {
  return units.filter(u => u.activeInBattle && u.hp > 0);
}
function ensureDS(u: CombatUnit) {
  if (!u.dynamicState) u.dynamicState = {};
  return u.dynamicState;
}

// ---------- BH / generic Payout ----------
export function hasPayout(unit: CombatUnit) {
  return unit.statuses.some(s => s.name === 'Payout');
}

export function activateBHPayout(state: CombatState, unit: CombatUnit) {
  if (hasPayout(unit)) return;
  applyStatus(state, unit, 'Payout', 99, false, unit);
  const ds = ensureDS(unit);
  ds.payoutActive = true;
  logBattleEvent(state, `🏆 PAYOUT: ${unit.name} completed their Bounty Hunter contract!`, 'buff');

  // Apply payout rewards from unique text patterns (character-specific)
  if (unit.characterId === 'bossk') {
    unit.defense = Math.round(unit.defense * 1.5);
    const bonus = Math.round(unit.maxHp * 0.5);
    unit.maxHp += bonus;
    unit.hp += bonus;
    ds.bosskPayoutHealOnHit = true;
    logBattleEvent(state, `🦎 Bossk Payout: +50% Defense, +50% Max Health, heal on damage!`, 'buff');
  } else if (unit.characterId === 'embo') {
    unit.offense = Math.round(unit.offense * 1.5);
    unit.speed += 20;
    unit.critDamage += 0.2;
    logBattleEvent(state, `👒 Embo Payout: +50% Offense, +20 Speed, +20% Crit Damage!`, 'buff');
  } else if (unit.characterId === 'aurra_sing') {
    unit.speed += 40;
    ds.ignoreDefensePct = Math.max(ds.ignoreDefensePct || 0, 0.3);
    ds.debuffsCannotResist = true;
    logBattleEvent(state, `🔫 Aurra Payout: +40 Speed, ignore 30% Defense, irresistible debuffs!`, 'buff');
  }

  // Bossk leader: BH allies recover 15% prot when any BH gains Payout
  const sq = squadOf(state, unit);
  const bosskLead = sq.find(u => u.characterId === 'bossk' && u.position === 0 && u.activeInBattle && u.hp > 0);
  if (bosskLead) {
    living(sq).filter(u => checkHasTag(u, 'Bounty Hunter') || (u.tags||[]).some(t=>/bounty hunter/i.test(t))).forEach(u => {
      if (!hasStatusFlag(u, 'prevent_prot_recovery')) {
        u.protection = Math.min(u.maxProtection, u.protection + Math.round(u.maxProtection * 0.15));
      }
    });
    logBattleEvent(state, `🦎 Professional Hunters: BH allies recover 15% Protection!`, 'heal');
  }

  // Aurra leader: BH earns Payout → 15% TM
  const aurraLead = sq.find(u => u.characterId === 'aurra_sing' && u.position === 0 && u.activeInBattle && u.hp > 0);
  if (aurraLead && !hasStatusFlag(unit, 'prevent_tm_gain')) {
    unit.turnMeter = Math.min(100, unit.turnMeter + 15);
  }
}

function progressPayout(state: CombatState, unit: CombatUnit, amount = 1, reason = '') {
  if (hasPayout(unit)) return;
  const unique = unit.abilities.find(a => a.type === 'unique' && /Payout Condition/i.test(a.desc));
  if (!unique && !checkHasTag(unit, 'Bounty Hunter') && !(unit.tags||[]).some(t=>/bounty hunter/i.test(t))) return;

  // Determine goal from unique desc
  let goal = 0;
  let kind = '';
  const desc = unique?.desc || '';
  if (/takes damage\s+(\d+)\s+times/i.test(desc)) {
    goal = parseInt(desc.match(/takes damage\s+(\d+)\s+times/i)![1], 10);
    kind = 'damage_taken';
  } else if (/Use .{1,40}\s+(\d+)\s+times/i.test(desc)) {
    goal = parseInt(desc.match(/Use .{1,40}\s+(\d+)\s+times/i)![1], 10);
    kind = 'ability_use';
  } else if (/Inflict debuffs on\s+(\d+)/i.test(desc)) {
    goal = parseInt(desc.match(/Inflict debuffs on\s+(\d+)/i)![1], 10);
    kind = 'debuff_inflict';
  } else if (/progress their Payout/i.test(desc)) {
    // Aurra lead progresses others — handled separately
    return;
  } else {
    // No payout unique — skip unless Aurra lead is progressing generic BH counters
    return;
  }

  const ds = ensureDS(unit);
  if (!ds.payoutProgress) ds.payoutProgress = { kind, current: 0, goal };
  if (!ds.payoutProgress.goal && goal) ds.payoutProgress.goal = goal;
  if (!ds.payoutProgress.kind && kind) ds.payoutProgress.kind = kind;
  if (amount <= 0) return;
  ds.payoutProgress.current = Math.min(ds.payoutProgress.goal || goal, (ds.payoutProgress.current || 0) + amount);
  logBattleEvent(state, `📜 ${unit.name} Payout ${ds.payoutProgress.current}/${ds.payoutProgress.goal}${reason ? ` (${reason})` : ''}`, 'info');
  if (ds.payoutProgress.current >= ds.payoutProgress.goal) activateBHPayout(state, unit);
}

export function onKitDamageTaken(state: CombatState, unit: CombatUnit, damage: number) {
  if (damage <= 0) return;
  // Bossk payout progress
  const bosskU = unit.abilities.find(a => a.id === 'bossk_u');
  if (bosskU) progressPayout(state, unit, 1, 'damage taken');
  // Bossk payout heal-on-hit
  if (unit.dynamicState?.bosskPayoutHealOnHit && hasPayout(unit) && !hasStatusFlag(unit, 'prevent_heal')) {
    unit.hp = Math.min(unit.maxHp, unit.hp + Math.round(unit.maxHp * 0.05));
  }
  // Brotherly Love: Maul takes damage → Savage TM; Savage takes damage → Maul offense
  const sq = squadOf(state, unit);
  if (unit.characterId === 'maul_mandalore') {
    const savage = sq.find(u => u.characterId === 'savage_opress_dw' && u.activeInBattle && u.hp > 0);
    if (savage?.statuses.some(s => s.name === 'Brotherly Love') && !hasStatusFlag(savage, 'prevent_tm_gain')) {
      savage.turnMeter = Math.min(100, savage.turnMeter + 5);
    }
  }
  if (unit.characterId === 'savage_opress_dw') {
    const maul = sq.find(u => u.characterId === 'maul_mandalore' && u.activeInBattle && u.hp > 0);
    if (maul?.statuses.some(s => s.name === 'Brotherly Love')) {
      const ds = ensureDS(maul);
      ds.brotherlyOffenseStacks = Math.min(50, (ds.brotherlyOffenseStacks || 0) + 1);
      maul.offense = Math.round(maul.offense * 1.02);
    }
  }
}

export function onKitAbilityUsed(state: CombatState, unit: CombatUnit, ability: Ability) {
  // Embo Merciless Pursuit uses
  if (ability.id === 'embo_s1' || /Merciless Pursuit/i.test(ability.name)) {
    progressPayout(state, unit, 1, ability.name);
  }
  // Scum / turn counting handled on turn start
}

export function onKitDebuffInflicted(state: CombatState, attacker: CombatUnit | null, target: CombatUnit, statusName: string) {
  if (!attacker) return;
  // Aurra unique payout: inflict debuffs on 15 enemies
  if (attacker.characterId === 'aurra_sing') {
    progressPayout(state, attacker, 1, statusName);
    return; // Lead progress would double-count Aurra's own condition
  }
  // Aurra leader: BH inflicts debuff → progress their payout by 1
  const sq = squadOf(state, attacker);
  const aurraLead = sq.find(u => u.characterId === 'aurra_sing' && u.position === 0 && u.activeInBattle && u.hp > 0);
  if (aurraLead && (checkHasTag(attacker, 'Bounty Hunter') || (attacker.tags||[]).some(t=>/bounty hunter/i.test(t)))) {
    const ds = ensureDS(attacker);
    if (!hasPayout(attacker)) {
      const unique = attacker.abilities.find(a => a.type === 'unique' && /Payout Condition/i.test(a.desc));
      if (unique) {
        if (!ds.payoutProgress) progressPayout(state, attacker, 0, 'init');
        if (ds.payoutProgress) {
          ds.payoutProgress.current = Math.min(ds.payoutProgress.goal, (ds.payoutProgress.current || 0) + 1);
          logBattleEvent(state, `📜 Contract Broker: ${attacker.name} Payout ${ds.payoutProgress.current}/${ds.payoutProgress.goal}`, 'info');
          if (ds.payoutProgress.current >= ds.payoutProgress.goal) activateBHPayout(state, attacker);
        }
      }
    }
  }
}

// ---------- Scum (Salacious) ----------
export function onKitTurnStart(state: CombatState, unit: CombatUnit) {
  if (unit.characterId === 'salacious_crumb' || unit.abilities.some(a => a.id === 'crumb_u')) {
    const ds = ensureDS(unit);
    ds.scumTurns = (ds.scumTurns || 0) + 1;
    if (ds.scumTurns >= 10 && !unit.statuses.some(s => s.name === 'Scum')) {
      applyStatus(state, unit, 'Scum', 99, false, unit);
      unit.speed += 50;
      logBattleEvent(state, `🐒 Scum (Jabba's Pet): Salacious gains +50 Speed!`, 'buff');
    }
    // Jabba ultimate charge
    const jabba = squadOf(state, unit).find(u => (u.characterId.includes('jabba') || u.characterId === 'jabba_the_hutt') && u.activeInBattle && u.hp > 0);
    if (jabba && jabba.ultimateCharge !== undefined) {
      jabba.ultimateCharge = Math.min(100, jabba.ultimateCharge + 2);
      logBattleEvent(state, `🏆 Jabba gains 2% Ultimate Charge from Salacious (${jabba.ultimateCharge}%)`, 'ultimate');
    }
  }
}

// ---------- Brotherly Love / start-of-battle kit flags ----------
export function installKitConditions(state: CombatState) {
  if (!state.dynamicState) state.dynamicState = {};
  if (state.dynamicState.kitConditionsInstalled) return;
  state.dynamicState.kitConditionsInstalled = true;

  const all = [...state.playerTeam, ...state.enemyTeam];
  all.forEach(unit => {
    if (!unit.activeInBattle) return;
    const sq = squadOf(state, unit);

    // Brotherly Love
    if (unit.characterId === 'savage_opress_dw' && sq.some(u => u.characterId === 'maul_mandalore' && u.activeInBattle)) {
      applyStatus(state, unit, 'Brotherly Love', 99, false, unit);
    }
    if (unit.characterId === 'maul_mandalore' && sq.some(u => u.characterId === 'savage_opress_dw' && u.activeInBattle)) {
      applyStatus(state, unit, 'Brotherly Love', 99, false, unit);
      // If Savage active: +25 Speed, ignore 25% defense
      unit.speed += 25;
      ensureDS(unit).ignoreDefensePct = Math.max(ensureDS(unit).ignoreDefensePct || 0, 0.25);
    }

    // Ewok traps armed
    unit.abilities.filter(a => a.type === 'unique' && /Trap begins battle armed/i.test(a.desc)).forEach(a => {
      const ds = ensureDS(unit);
      if (!ds.traps) ds.traps = {};
      ds.traps[a.id] = { armed: true, desc: a.desc };
      logBattleEvent(state, `🪤 Trap armed: ${unit.name} — ${a.name}`, 'info');
    });

    // Endless Legion start stacks from leader/unique text
    unit.abilities.forEach(a => {
      const m = a.desc.match(/[Gg]ain:?\s*(\d+)\s*stacks? of Endless Legion/i)
        || a.desc.match(/gain:?\s*(\d+)\s*stacks? of Endless Legion/i);
      if (m && (a.type === 'unique' || (a.type === 'leader' && unit.position === 0))) {
        // Leader grants to faction at start — handled below for leaders
        if (a.type === 'unique') {
          applyStatus(state, unit, 'Endless Legion', 99, false, unit, parseInt(m[1], 10));
        }
      }
    });

    // Howzer: cannot be targeted while another Clone Trooper ally is active
    if (unit.characterId === 'captain_howzer' || /Howzer cannot be targeted/i.test(unit.abilities.map(a=>a.desc).join(' '))) {
      ensureDS(unit).untargetableWhileCloneAllies = true;
    }

    // Init BH payout trackers from unique text
    const payoutU = unit.abilities.find(a => a.type === 'unique' && /Payout Condition/i.test(a.desc));
    if (payoutU) progressPayout(state, unit, 0, 'armed');
  });

  // Leader grants Endless Legion to Separatist Droids
  ['player', 'enemy'].forEach((team) => {
    const sq = team === 'player' ? state.playerTeam : state.enemyTeam;
    const leader = sq.find(u => u.position === 0 && u.activeInBattle);
    if (!leader) return;
    const leadAb = leader.abilities.find(a => a.type === 'leader');
    if (!leadAb) return;
    const m = leadAb.desc.match(/[Gg]ain:?\s*(\d+)\s*stacks? of Endless Legion/i);
    if (m) {
      const n = parseInt(m[1], 10);
      living(sq).filter(u => {
        const tags = u.tags || [];
        return (checkHasTag(u, 'Separatist') || tags.some(t => /separatist/i.test(t)))
          && (checkHasTag(u, 'Droid') || tags.some(t => /droid/i.test(t)));
      }).forEach(u => {
        applyStatus(state, u, 'Endless Legion', 99, false, leader, n);
      });
      logBattleEvent(state, `🤖 ${leader.name}: Separatist Droids gain ${n} Endless Legion!`, 'buff');
    }
  });
}

// ---------- Endless Legion death save ----------
export function tryEndlessLegionSave(state: CombatState, unit: CombatUnit): boolean {
  const el = unit.statuses.find(s => s.name === 'Endless Legion');
  if (!el || (el.count || 1) < 1) return false;
  if (!/Whenever .{0,40} is defeated: Consume 1 stack of Endless Legion instead/i.test(unit.abilities.map(a=>a.desc).join(' '))
      && !unit.abilities.some(a => /Consume 1 stack of Endless Legion instead/i.test(a.desc))) {
    // Still allow for magnaguard/crab style if they have Endless Legion and the unique mentions it
    if (!unit.abilities.some(a => /Endless Legion instead/i.test(a.desc))) return false;
  }
  const count = (el.count || 1) - 1;
  if (count <= 0) unit.statuses = unit.statuses.filter(s => s.name !== 'Endless Legion');
  else el.count = count;
  unit.hp = Math.max(1, Math.round(unit.maxHp * 0.25));
  unit.activeInBattle = true;
  logBattleEvent(state, `🤖 Endless Legion: ${unit.name} consumes a stack and endures!`, 'heal');
  // Consume triggers
  fireEndlessLegionConsumed(state, unit);
  return true;
}

function fireEndlessLegionConsumed(state: CombatState, unit: CombatUnit) {
  const sq = squadOf(state, unit);
  // GG leader: whenever droid consumes Endless Legion → GG +5% TM
  const gg = sq.find(u => (u.characterId === 'general_grievous' || u.characterId.includes('grievous')) && u.position === 0 && u.activeInBattle && u.hp > 0);
  if (gg && !hasStatusFlag(gg, 'prevent_tm_gain')) {
    gg.turnMeter = Math.min(100, gg.turnMeter + 5);
  }
  // Trench GL: recover 5% health
  const trench = sq.find(u => u.characterId.includes('trench') && u.position === 0 && u.activeInBattle && u.hp > 0);
  if (trench && !hasStatusFlag(unit, 'prevent_heal')) {
    unit.hp = Math.min(unit.maxHp, unit.hp + Math.round(unit.maxHp * 0.05));
  }
  // MagnaGuard consume → recover 25%
  if (unit.characterId.includes('magna') && !hasStatusFlag(unit, 'prevent_heal')) {
    unit.hp = Math.min(unit.maxHp, unit.hp + Math.round(unit.maxHp * 0.25));
  }
  // Crab → Offense Up
  if (unit.characterId.includes('crab')) {
    applyStatus(state, unit, 'Offense Up', 2, false, unit);
  }
}

// ---------- Ewok Traps ----------
export function checkEwokTraps(
  state: CombatState,
  event: 'enemy_below_50' | 'enemy_below_30' | 'ewok_below_40' | 'enemy_taunt' | 'enemy_out_of_turn',
  source: CombatUnit
) {
  if (state.dynamicState?.trapLock) return;
  const all = [...state.playerTeam, ...state.enemyTeam];
  all.forEach(owner => {
    const traps = owner.dynamicState?.traps;
    if (!traps || !owner.activeInBattle || owner.hp <= 0) return;
    Object.keys(traps).forEach(trapId => {
      const trap = traps[trapId];
      if (!trap.armed) return;
      const desc: string = trap.desc || '';

      let fire = false;
      if (event === 'enemy_below_50' && /enemy falls below 50% Health/i.test(desc) && source.team !== owner.team) fire = true;
      if (event === 'enemy_below_30' && /enemy falls below 30% Health/i.test(desc) && source.team !== owner.team) fire = true;
      if (event === 'ewok_below_40' && /Ewok ally falls below 40% Health/i.test(desc) && source.team === owner.team && (checkHasTag(source,'Ewok')||(source.tags||[]).some(t=>/ewok/i.test(t)))) fire = true;
      if (event === 'enemy_taunt' && /enemy gains Taunt/i.test(desc) && source.team !== owner.team) fire = true;
      if (event === 'enemy_out_of_turn' && /enemy attacks out of turn/i.test(desc) && source.team !== owner.team) fire = true;

      if (!fire) return;
      trap.armed = false;
      logBattleEvent(state, `🪤 TRAP SPRUNG (${owner.name}): ${trapId}`, 'ultimate');

      const ewoks = living(squadOf(state, owner)).filter(u => checkHasTag(u,'Ewok')||(u.tags||[]).some(t=>/ewok/i.test(t)));
      const enemyTeam = owner.team === 'player' ? state.enemyTeam : state.playerTeam;

      if (/All Ewoks gain 25% Turn Meter/i.test(desc)) {
        ewoks.forEach(u => { if (!hasStatusFlag(u,'prevent_tm_gain')) u.turnMeter = Math.min(100, u.turnMeter + 25); });
      }
      if (/All Ewoks immediately assist/i.test(desc)) {
        const weakest = [...living(enemyTeam)].sort((a,b)=>a.hp-b.hp)[0];
        if (weakest) {
          logBattleEvent(state, `🪤 Ewoks ambush ${weakest.name}!`, 'info');
          if (!state.dynamicState) state.dynamicState = {};
          state.dynamicState.trapLock = true;
          try {
            ewoks.forEach(u => {
              if (hasStatusFlag(u, 'prevent_assist')) return;
              const basic = u.abilities.find(a => a.type === 'basic');
              if (basic && weakest.activeInBattle && weakest.hp > 0) {
                executeCombatAction(state, u.id, basic, weakest.id, undefined, 1, 0);
              }
            });
          } finally {
            state.dynamicState.trapLock = false;
          }
        }
      }
      if (/Wicket gains Offense Up/i.test(desc) || (owner.characterId === 'wicket' && event === 'enemy_below_30')) {
        applyStatus(state, owner, 'Offense Up', 2, false, owner);
        if (source.activeInBattle && source.hp > 0) {
          const basic = owner.abilities.find(a => a.type === 'basic');
          if (basic) {
            if (!state.dynamicState) state.dynamicState = {};
            state.dynamicState.trapLock = true;
            try {
              executeCombatAction(state, owner.id, basic, source.id, undefined, 1, 0);
              if (source.hp <= 0) {
                const endor = owner.abilities.find(a => /Endor Champion/i.test(a.name));
                if (endor) owner.cooldowns[endor.id] = 0;
              }
            } finally {
              state.dynamicState.trapLock = false;
            }
          }
        }
      }
      if (/recovers 30% Health and Protection/i.test(desc) && event === 'ewok_below_40') {
        source.hp = Math.min(source.maxHp, source.hp + Math.round(source.maxHp * 0.3));
        source.protection = Math.min(source.maxProtection, source.protection + Math.round(source.maxProtection * 0.3));
        source.statuses = source.statuses.filter(s => !s.isDebuff);
        if (/If the ally is Leia/i.test(desc) && /leia/i.test(source.characterId)) {
          applyStatus(state, source, 'Foresight', 1, false, owner);
        }
      }
      if (/Remove Taunt from that enemy/i.test(desc) && event === 'enemy_taunt') {
        source.statuses = source.statuses.filter(s => s.name !== 'Taunt');
        owner.turnMeter = 100;
        const speeder = owner.abilities.find(a => /Stolen Speeder/i.test(a.name) || a.id === 'paploo_s1');
        if (speeder && source.activeInBattle && source.hp > 0) {
          if (!state.dynamicState) state.dynamicState = {};
          state.dynamicState.trapLock = true;
          try {
            executeCombatAction(state, owner.id, speeder, source.id, undefined, 1, 0);
          } finally {
            state.dynamicState.trapLock = false;
          }
        }
      }
      if (/Stun that enemy/i.test(desc) && event === 'enemy_out_of_turn') {
        applyStatus(state, source, 'Stun', 1, true, owner);
        living(enemyTeam).forEach(e => {
          e.turnMeter = Math.max(0, e.turnMeter - 20);
        });
        ewoks.forEach(u => { if (!hasStatusFlag(u,'prevent_tm_gain')) u.turnMeter = Math.min(100, u.turnMeter + 10); });
      }
    });
  });
}

// ---------- Howzer / untargetable filter ----------
export function filterUntargetable(attacker: CombatUnit, state: CombatState, candidates: CombatUnit[]): CombatUnit[] {
  return candidates.filter(u => {
    if (!u.dynamicState?.untargetableWhileCloneAllies) return true;
    const sq = squadOf(state, u);
    const otherClone = living(sq).some(a => a.id !== u.id && (checkHasTag(a, 'Clone Trooper') || (a.tags||[]).some(t=>/clone/i.test(t))));
    return !otherClone;
  });
}

// ---------- Last Hope / Ultimate charge helpers ----------
export function onLastHopeGained(state: CombatState, unit: CombatUnit) {
  const sq = squadOf(state, unit);
  const luke = sq.find(u => u.characterId === 'luke_skywalker_gl' || u.characterId === 'luke_gl' || u.abilities.some(a => a.id === 'luke_gl_u'));
  if (luke && luke.ultimateCharge !== undefined && (checkHasTag(unit, 'Rebel Command') || (unit.tags||[]).some(t=>/rebel command/i.test(t)) || unit.id === luke.id)) {
    luke.ultimateCharge = Math.min(100, luke.ultimateCharge + 3);
    logBattleEvent(state, `✨ Luke gains 3% Ultimate Charge from Last Hope (${luke.ultimateCharge}%)`, 'ultimate');
  }
  const c3po = sq.find(u => u.characterId === 'c3po' && u.activeInBattle && u.hp > 0);
  if (c3po && !hasStatusFlag(c3po, 'prevent_tm_gain')) {
    c3po.turnMeter = Math.min(100, c3po.turnMeter + 5);
  }
}

export function onKitAssistOrOutOfTurn(state: CombatState, unit: CombatUnit) {
  const sq = squadOf(state, unit);
  const luke = sq.find(u => u.abilities.some(a => a.id === 'luke_gl_u') && u.activeInBattle);
  if (luke && luke.ultimateCharge !== undefined) {
    luke.ultimateCharge = Math.min(100, luke.ultimateCharge + 2);
  }
  // Brotherly: Savage out of turn → Maul TM
  if (unit.characterId === 'savage_opress_dw') {
    const maul = sq.find(u => u.characterId === 'maul_mandalore' && u.activeInBattle && u.hp > 0);
    if (maul?.statuses.some(s => s.name === 'Brotherly Love') && !hasStatusFlag(maul, 'prevent_tm_gain')) {
      maul.turnMeter = Math.min(100, maul.turnMeter + 5);
    }
  }
}

/** Apply ignore-defense from payout / brotherly dynamic flags */
export function getKitIgnoreDefensePct(unit: CombatUnit): number {
  return unit.dynamicState?.ignoreDefensePct || 0;
}

export function kitDebuffsCannotResist(unit: CombatUnit): boolean {
  return !!unit.dynamicState?.debuffsCannotResist;
}
