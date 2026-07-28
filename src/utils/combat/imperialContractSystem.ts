/**
 * Rebel Hunter — Imperial Contract lifecycle + ability gates.
 */
import { CombatState, CombatUnit, Ability } from '../../types';
import {
  applyStatus, checkHasTag, logBattleEvent, hasStatusFlag,
  executeCombatAction, triggerSummon,
} from '../combatEngine';

function squadOf(state: CombatState, unit: CombatUnit) {
  return unit.team === 'player' ? state.playerTeam : state.enemyTeam;
}
function oppOf(state: CombatState, unit: CombatUnit) {
  return unit.team === 'player' ? state.enemyTeam : state.playerTeam;
}
function living(units: CombatUnit[]) {
  return units.filter(u => u.activeInBattle && u.hp > 0);
}
function isRH(u: CombatUnit) {
  return checkHasTag(u, 'Rebel Hunter') || (u.tags || []).some(t => /rebel hunter/i.test(t));
}
function rhAllies(state: CombatState, hunter: CombatUnit) {
  return living(squadOf(state, hunter)).filter(isRH);
}
function ensureDS(u: CombatUnit) {
  if (!u.dynamicState) u.dynamicState = {};
  return u.dynamicState;
}

export function hasImperialContract(unit: CombatUnit): boolean {
  return unit.statuses.some(s => s.name === 'Imperial Contract');
}

export function applyImperialContract(state: CombatState, target: CombatUnit, source: CombatUnit | null) {
  if (!target.activeInBattle || target.hp <= 0) return;
  if (target.characterId === 'keibu') return; // Cannot gain Imperial Contract
  // Only one Contract on the enemy team
  living(squadOf(state, target)).forEach(u => {
    u.statuses = u.statuses.filter(s => s.name !== 'Imperial Contract');
  });
  applyStatus(state, target, 'Imperial Contract', 99, true, source);
  logBattleEvent(state, `📜 Imperial Contract marked on ${target.name}!`, 'debuff');
}

function onContractTransferred(state: CombatState, hunters: CombatUnit[], newTarget: CombatUnit) {
  hunters.forEach(h => {
    if (!hasStatusFlag(h, 'prevent_tm_gain')) {
      h.turnMeter = Math.min(100, h.turnMeter + 10);
    }
  });
  logBattleEvent(state, `📜 Imperial Contract transfers to ${newTarget.name}! Rebel Hunters gain 10% TM.`, 'buff');

  const embo = hunters.find(u => u.characterId === 'embo_warlord');
  if (embo) {
    applyStatus(state, embo, 'Offense Up', 2, false, embo);
    applyStatus(state, embo, 'Critical Damage Up', 2, false, embo);
  }
  const keibu = hunters.find(u => u.characterId === 'keibu');
  if (keibu) applyStatus(state, keibu, 'Offense Up', 2, false, keibu);
  const storm = hunters.find(u => u.characterId === 'stormtrooper_commando');
  if (storm) applyStatus(state, storm, 'Stealth', 2, false, storm);
  const zuckuss = hunters.find(u => u.characterId === 'zuckuss');
  if (zuckuss) applyStatus(state, zuckuss, 'Foresight', 2, false, zuckuss);
}

export function transferImperialContract(state: CombatState, defeated: CombatUnit) {
  if (!hasImperialContract(defeated)) return;
  defeated.statuses = defeated.statuses.filter(s => s.name !== 'Imperial Contract');

  const hunters = living(oppOf(state, defeated)).filter(isRH);
  if (hunters.length === 0) return;

  const candidates = living(squadOf(state, defeated)).filter(u => u.characterId !== 'keibu');
  if (candidates.length === 0) return;

  // Prefer leader, else highest max HP
  const next = candidates.find(u => u.position === 0)
    || [...candidates].sort((a, b) => b.maxHp - a.maxHp)[0];
  if (!next) return;

  applyImperialContract(state, next, hunters[0]);
  onContractTransferred(state, hunters, next);
}

export function installImperialContract(state: CombatState) {
  if (!state.dynamicState) state.dynamicState = {};
  if (state.dynamicState.imperialContractInstalled) return;
  state.dynamicState.imperialContractInstalled = true;

  ['player', 'enemy'].forEach((team) => {
    const sq = team === 'player' ? state.playerTeam : state.enemyTeam;
    const opp = team === 'player' ? state.enemyTeam : state.playerTeam;
    const leader = sq.find(u => u.position === 0 && u.activeInBattle);
    if (!leader) return;

    // Dengar lead: mark enemy leader
    const leadAb = leader.abilities.find(a => a.type === 'leader');
    if (leadAb && /Enemy Leader gains Imperial Contract/i.test(leadAb.desc)) {
      const enemyLead = opp.find(u => u.position === 0 && u.activeInBattle && u.hp > 0)
        || living(opp)[0];
      if (enemyLead) applyImperialContract(state, enemyLead, leader);
    }

    // Embo Warlord: summon Keibu
    living(sq).forEach(u => {
      if (u.characterId === 'embo_warlord' && !sq.some(x => x.characterId === 'keibu' && x.activeInBattle)) {
        triggerSummon(state, u, 'keibu');
        const keibu = living(sq).find(x => x.characterId === 'keibu');
        if (keibu) {
          // Hunter's Bond while Embo active
          keibu.maxHp = Math.round(keibu.maxHp * 1.5);
          keibu.hp = keibu.maxHp;
          keibu.offense = Math.round(keibu.offense * 1.25);
          keibu.speed += 25;
          logBattleEvent(state, `🐺 Keibu bonds with Embo (+50% HP, +25% Offense, +25 Speed)!`, 'buff');
        }
      }
    });
  });
}

export function onImperialContractDamaged(state: CombatState, target: CombatUnit, damage: number) {
  if (damage <= 0 || !hasImperialContract(target)) return;
  const hunters = living(oppOf(state, target)).filter(isRH);
  hunters.forEach(h => {
    if (!hasStatusFlag(h, 'prevent_prot_recovery')) {
      h.protection = Math.min(h.maxProtection, h.protection + Math.round(h.maxProtection * 0.02));
    }
  });
}

export function onImperialContractBelow50(state: CombatState, target: CombatUnit) {
  if (!hasImperialContract(target)) return;
  const hunters = living(oppOf(state, target)).filter(isRH);
  const dengar = hunters.find(u => u.characterId === 'dengar');
  if (dengar) applyStatus(state, dengar, 'Taunt', 1, false, dengar);
  const ig = hunters.find(u => u.characterId === 'ig_88');
  if (ig) applyStatus(state, ig, 'Offense Up', 2, false, ig);

  const embo = hunters.find(u => u.characterId === 'embo_warlord');
  if (embo) {
    const ds = ensureDS(embo);
    ds.emboOffenseStacks = Math.min(20, (ds.emboOffenseStacks || 0) + 1);
    embo.offense = Math.round(embo.offense * 1.05);
  }
}

export function onImperialContractDefeated(state: CombatState, defeated: CombatUnit, attacker: CombatUnit | null) {
  const had = hasImperialContract(defeated) || !!defeated.dynamicState?.hadImperialContract;
  if (hasImperialContract(defeated)) {
    ensureDS(defeated).hadImperialContract = true;
  }

  const hunters = living(oppOf(state, defeated)).filter(isRH);

  if (had) {
    const dengar = hunters.find(u => u.characterId === 'dengar');
    if (dengar) {
      dengar.hp = Math.min(dengar.maxHp, dengar.hp + Math.round(dengar.maxHp * 0.2));
      if (!hasStatusFlag(dengar, 'prevent_prot_recovery')) {
        dengar.protection = Math.min(dengar.maxProtection, dengar.protection + Math.round(dengar.maxProtection * 0.2));
      }
    }
    const ig = hunters.find(u => u.characterId === 'ig_88');
    if (ig && !hasStatusFlag(ig, 'prevent_prot_recovery')) {
      ig.protection = Math.min(ig.maxProtection, ig.protection + Math.round(ig.maxProtection * 0.2));
    }
    const keibu = hunters.find(u => u.characterId === 'keibu');
    if (keibu) keibu.hp = keibu.maxHp;

    const embo = hunters.find(u => u.characterId === 'embo_warlord');
    if (embo) {
      Object.keys(embo.cooldowns).forEach(k => {
        embo.cooldowns[k] = Math.max(0, (embo.cooldowns[k] || 0) - 1);
      });
      if (!state.bonusTurnQueue) state.bonusTurnQueue = [];
      state.bonusTurnQueue.push(embo.id);
      logBattleEvent(state, `👒 Embo gains a Bonus Turn from Contract kill!`, 'buff');
    }
  }

  // Embo any defeat → 20% prot
  if (attacker?.characterId === 'embo_warlord' && !hasStatusFlag(attacker, 'prevent_prot_recovery')) {
    attacker.protection = Math.min(attacker.maxProtection, attacker.protection + Math.round(attacker.maxProtection * 0.2));
  }
  // IG-88 any defeat → CD -1
  if (attacker?.characterId === 'ig_88') {
    Object.keys(attacker.cooldowns).forEach(k => {
      attacker.cooldowns[k] = Math.max(0, (attacker.cooldowns[k] || 0) - 1);
    });
  }
  // Stormtrooper Commando defeat → 20% prot
  if (attacker?.characterId === 'stormtrooper_commando' && !hasStatusFlag(attacker, 'prevent_prot_recovery')) {
    attacker.protection = Math.min(attacker.maxProtection, attacker.protection + Math.round(attacker.maxProtection * 0.2));
  }

  // Keibu escapes if Embo dies
  if (defeated.characterId === 'embo_warlord') {
    const keibu = living(squadOf(state, defeated)).find(u => u.characterId === 'keibu');
    if (keibu) {
      keibu.hp = 0;
      keibu.activeInBattle = false;
      logBattleEvent(state, `🐺 Keibu escapes after Embo falls!`, 'death');
    }
  }
  // 4-LOM defeated → Zuckuss buffs
  if (defeated.characterId === 'four_lom') {
    const z = living(squadOf(state, defeated)).find(u => u.characterId === 'zuckuss');
    if (z) {
      applyStatus(state, z, 'Offense Up', 3, false, z);
      applyStatus(state, z, 'Critical Damage Up', 3, false, z);
    }
  }

  if (had) transferImperialContract(state, defeated);
}

/** Damage multipliers / ignore-defense from Contract */
export function getImperialContractDamageMods(attacker: CombatUnit, target: CombatUnit, ability: Ability, counterDepth: number) {
  const mods = { dmgMult: 1, ignoreDefensePct: 0, ignoreTaunt: false };
  if (!hasImperialContract(target)) return mods;

  if (attacker.characterId === 'ig_88') mods.dmgMult *= 1.2;
  if (attacker.characterId === 'dengar' && counterDepth > 0) mods.dmgMult *= 1.25;
  if (ability.id === 'embow_special_1' || ability.id === 'ig88_special_2') mods.ignoreDefensePct = Math.max(mods.ignoreDefensePct, 0.3);
  if (ability.id === 'embow_basic' || ability.id === 'storm_com_special_2') mods.ignoreTaunt = true;
  if (ability.id === 'ig88_special_2' && target.hp < target.maxHp * 0.5) mods.dmgMult *= 1.3;
  return mods;
}

export function onImperialContractAttack(state: CombatState, attacker: CombatUnit, target: CombatUnit, ability: Ability, assistDepth: number, counterDepth: number) {
  if (!hasImperialContract(target)) return;
  const allies = squadOf(state, attacker);

  if (isRH(attacker) && !hasStatusFlag(attacker, 'prevent_tm_gain')) {
    if (attacker.characterId === 'embo_warlord') attacker.turnMeter = Math.min(100, attacker.turnMeter + 5);
    if (attacker.characterId === 'stormtrooper_commando') attacker.turnMeter = Math.min(100, attacker.turnMeter + 5);
  }

  // 4-LOM recovers prot when RH attacks Contract
  if (isRH(attacker)) {
    const four = living(allies).find(u => u.characterId === 'four_lom');
    if (four && !hasStatusFlag(four, 'prevent_prot_recovery')) {
      four.protection = Math.min(four.maxProtection, four.protection + Math.round(four.maxProtection * 0.03));
    }
  }

  // Keibu assists when Embo attacks Contract
  if (attacker.characterId === 'embo_warlord' && assistDepth === 0 && counterDepth === 0) {
    const keibu = living(allies).find(u => u.characterId === 'keibu' && !hasStatusFlag(u, 'prevent_assist'));
    if (keibu && target.activeInBattle && target.hp > 0) {
      const basic = keibu.abilities.find(a => a.type === 'basic');
      if (basic) {
        logBattleEvent(state, `🐺 Keibu assists Embo against Contract target!`, 'info');
        executeCombatAction(state, keibu.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
      }
    }
  }

  // 4-LOM assists when Zuckuss attacks Contract
  if (attacker.characterId === 'zuckuss' && assistDepth === 0) {
    const four = living(allies).find(u => u.characterId === 'four_lom' && !hasStatusFlag(u, 'prevent_assist'));
    if (four && target.activeInBattle && target.hp > 0) {
      const basic = four.abilities.find(a => a.type === 'basic');
      if (basic) {
        logBattleEvent(state, `🤖 4-LOM assists Zuckuss against Contract!`, 'info');
        executeCombatAction(state, four.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
      }
    }
  }

  // Keibu hits Contract → Embo TM
  if (attacker.characterId === 'keibu') {
    const embo = living(allies).find(u => u.characterId === 'embo_warlord');
    if (embo && !hasStatusFlag(embo, 'prevent_tm_gain')) {
      embo.turnMeter = Math.min(100, embo.turnMeter + 3);
    }
  }

  // Zuckuss hits → Zuckuss gets TM from 4-LOM attacks handled below; 4-LOM attacks → Zuckuss TM
  if (attacker.characterId === 'four_lom') {
    const z = living(allies).find(u => u.characterId === 'zuckuss');
    if (z && !hasStatusFlag(z, 'prevent_tm_gain')) z.turnMeter = Math.min(100, z.turnMeter + 3);
  }
}

/** Contract-gated ability extras after generic parse */
export function resolveImperialContractAbilityExtras(
  state: CombatState,
  attacker: CombatUnit,
  target: CombatUnit,
  ability: Ability,
  assistDepth: number,
  counterDepth: number
) {
  const contract = hasImperialContract(target);
  const allies = squadOf(state, attacker);
  const enemies = oppOf(state, attacker);

  switch (ability.id) {
    case 'dengar_basic':
      if (contract) applyStatus(state, target, 'Speed Down', 2, true, attacker);
      break;
    case 'dengar_special_1':
      living(enemies).forEach(e => {
        e.statuses = e.statuses.filter(s => s.name !== 'Stealth');
      });
      if (contract && !hasStatusFlag(target, 'prevent_tm_gain')) {
        // TM already may be reduced; ensure Contract holder loses 10%
        target.turnMeter = Math.max(0, target.turnMeter - 10);
      }
      break;
    case 'embow_basic':
      if (contract && assistDepth === 0 && counterDepth === 0 && target.activeInBattle && target.hp > 0) {
        const follow = { ...ability, id: ability.id + '_contract_follow', effects: ['damage'] };
        logBattleEvent(state, `👒 Embo attacks again (Imperial Contract)!`, 'info');
        executeCombatAction(state, attacker.id, follow, target.id, undefined, 1, counterDepth);
      }
      break;
    case 'embow_special_1':
      if (contract) applyStatus(state, target, 'Healing Immunity', 2, true, attacker);
      break;
    case 'embow_special_2': {
      const keibu = living(allies).find(u => u.characterId === 'keibu' && !hasStatusFlag(u, 'prevent_assist'));
      const other = living(allies).find(u => isRH(u) && u.id !== attacker.id && u.characterId !== 'keibu' && !hasStatusFlag(u, 'prevent_assist'));
      [keibu, other].forEach(a => {
        if (!a || !target.activeInBattle) return;
        const basic = a.abilities.find(ab => ab.type === 'basic');
        if (basic) {
          ensureDS(a).contractAssistBonus = contract ? 1.5 : 1;
          executeCombatAction(state, a.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
          delete ensureDS(a).contractAssistBonus;
        }
      });
      break;
    }
    case 'keibu_basic':
      if (contract) applyStatus(state, target, 'Offense Down', 2, true, attacker);
      break;
    case 'keibu_special':
      if (contract) {
        const embo = living(allies).find(u => u.characterId === 'embo_warlord' && !hasStatusFlag(u, 'prevent_assist'));
        if (embo && target.activeInBattle) {
          const basic = embo.abilities.find(a => a.type === 'basic');
          if (basic) {
            ensureDS(embo).contractAssistBonus = 1.25;
            ensureDS(attacker).contractAssistBonus = 1.25;
            executeCombatAction(state, embo.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
            delete ensureDS(embo).contractAssistBonus;
            delete ensureDS(attacker).contractAssistBonus;
          }
        }
      }
      break;
    case '4lom_basic':
      if (contract) applyStatus(state, target, 'Ability Block', 1, true, attacker);
      {
        const z = living(allies).find(u => u.characterId === 'zuckuss');
        if (z && !hasStatusFlag(z, 'prevent_tm_gain')) z.turnMeter = Math.min(100, z.turnMeter + 5);
      }
      break;
    case '4lom_special_1':
      if (contract) target.turnMeter = Math.max(0, target.turnMeter - 10);
      {
        const z = living(allies).find(u => u.characterId === 'zuckuss' && !hasStatusFlag(u, 'prevent_assist'));
        if (z && target.activeInBattle) {
          const basic = z.abilities.find(a => a.type === 'basic');
          if (basic) executeCombatAction(state, z.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
        }
      }
      break;
    case '4lom_special_2': {
      const first = living(allies).find(u => isRH(u) && u.id !== attacker.id && !hasStatusFlag(u, 'prevent_assist'));
      if (first && target.activeInBattle) {
        const basic = first.abilities.find(a => a.type === 'basic');
        if (basic) executeCombatAction(state, first.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
      }
      if (contract) {
        const z = living(allies).find(u => u.characterId === 'zuckuss' && !hasStatusFlag(u, 'prevent_assist'));
        const second = z || living(allies).find(u => isRH(u) && u.id !== attacker.id && u.id !== first?.id && !hasStatusFlag(u, 'prevent_assist'));
        if (second && target.activeInBattle) {
          const basic = second.abilities.find(a => a.type === 'basic');
          if (basic) executeCombatAction(state, second.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
        }
      }
      break;
    }
    case 'zuckuss_basic':
      // Blind duration: 2 if Contract else 1 — re-apply
      applyStatus(state, target, 'Blind', contract ? 2 : 1, true, attacker);
      break;
    case 'zuckuss_special_1':
      if (contract) target.turnMeter = Math.max(0, target.turnMeter - 10);
      {
        const four = living(allies).find(u => u.characterId === 'four_lom');
        if (four && !hasStatusFlag(four, 'prevent_tm_gain')) four.turnMeter = Math.min(100, four.turnMeter + 10);
      }
      break;
    case 'zuckuss_special_2': {
      ensureDS(target).zuckussTracked = true;
      ensureDS(target).zuckussTrackDouble = contract;
      const four = living(allies).find(u => u.characterId === 'four_lom');
      if (four) applyStatus(state, four, 'Stealth', 2, false, attacker);
      break;
    }
    case 'ig88_special_1':
      // bonus_attack effect already fires a second hit; Contract adds a third
      if (contract && assistDepth === 0 && counterDepth === 0 && target.activeInBattle && target.hp > 0) {
        const follow3 = { ...ability, id: ability.id + '_3', effects: ['damage'] };
        executeCombatAction(state, attacker.id, follow3, target.id, undefined, 1, 0);
      }
      break;
    case 'storm_com_special_2':
      if (attacker.statuses.some(s => s.name === 'Stealth') || ensureDS(attacker).hadStealth) {
        applyStatus(state, target, 'Healing Immunity', 2, true, attacker);
      }
      break;
    case 'dengar_special_2':
      ensureDS(attacker).dengarNoEscape = true;
      break;
    default:
      break;
  }
}

/** Gate statuses that are Contract-only so generic parser doesn't always apply them */
export function isImperialContractGatedStatus(ability: Ability, statusName: string): boolean {
  const desc = ability.desc || '';
  const gated = desc.match(new RegExp(`If target has Imperial Contract:[^.]*${statusName}`, 'i'));
  if (!gated) return false;
  // If status also appears before the Contract clause as unconditional, don't gate
  const idx = desc.search(/If target has Imperial Contract:/i);
  if (idx > 0) {
    const before = desc.slice(0, idx);
    if (new RegExp(statusName, 'i').test(before) && !/If target has Imperial Contract/i.test(before)) {
      // e.g. Offense Down before Contract clause — not gated
      return false;
    }
  }
  return true;
}

export function onDengarNoEscapeCounter(state: CombatState, attacker: CombatUnit, targetAlly: CombatUnit) {
  // Whenever an enemy attacks an ally other than Dengar: Dengar counterattacks
  if (attacker.team === targetAlly.team) return;
  const allies = squadOf(state, targetAlly);
  const dengar = living(allies).find(u => u.characterId === 'dengar' && ensureDS(u).dengarNoEscape);
  if (!dengar || targetAlly.id === dengar.id) return;
  if (hasStatusFlag(dengar, 'prevent_counter') || !attacker.activeInBattle) return;
  const basic = dengar.abilities.find(a => a.type === 'basic');
  if (!basic) return;
  logBattleEvent(state, `🔫 No Escape Route: Dengar counterattacks ${attacker.name}!`, 'info');
  executeCombatAction(state, dengar.id, basic, attacker.id, undefined, 0, 1);
  if (hasImperialContract(attacker) && !hasStatusFlag(dengar, 'prevent_prot_recovery')) {
    dengar.protection = Math.min(dengar.maxProtection, dengar.protection + Math.round(dengar.maxProtection * 0.1));
  }
}

export function onContractMiss(state: CombatState, attacker: CombatUnit) {
  if (!hasImperialContract(attacker)) return;
  const hunters = living(oppOf(state, attacker)).filter(isRH);
  hunters.forEach(h => {
    if (!hasStatusFlag(h, 'prevent_tm_gain')) h.turnMeter = Math.min(100, h.turnMeter + 5);
  });
}

/** Zuckuss predictive tracking TM tax */
export function taxZuckussTrackedTM(unit: CombatUnit, amount: number): number {
  if (!unit.dynamicState?.zuckussTracked || amount <= 0) return amount;
  const tax = unit.dynamicState.zuckussTrackDouble ? 10 : 5;
  unit.turnMeter = Math.max(0, unit.turnMeter - tax);
  return amount;
}
