import { CombatState, CombatUnit, Ability } from '../../types';
import { applyStatus, checkHasTag, logBattleEvent, hasStatusFlag } from '../combatEngine';

const PROJECT_COMPLETE_AT = 25;

export function isImperialArchitect(unit: CombatUnit): boolean {
  return checkHasTag(unit, 'Imperial Architects') ||
    (unit.tags || []).some(t => /imperial architect/i.test(t));
}

export function getProjectStacks(state: CombatState, team: 'player' | 'enemy'): number {
  if (!state.dynamicState) state.dynamicState = {};
  if (!state.dynamicState.projectStacks) state.dynamicState.projectStacks = { player: 0, enemy: 0 };
  return state.dynamicState.projectStacks[team] || 0;
}

export function isProjectComplete(state: CombatState, team: 'player' | 'enemy'): boolean {
  return getProjectStacks(state, team) >= PROJECT_COMPLETE_AT;
}

function syncProjectStatus(state: CombatState, team: 'player' | 'enemy') {
  const stacks = getProjectStacks(state, team);
  const squad = team === 'player' ? state.playerTeam : state.enemyTeam;
  squad.forEach(u => {
    if (!u.activeInBattle || u.hp <= 0 || !isImperialArchitect(u)) return;
    u.statuses = u.statuses.filter(s => s.name !== 'The Project' && s.name !== 'The Project Complete');
    if (stacks > 0) applyStatus(state, u, 'The Project', 99, false, u, stacks);
    if (stacks >= PROJECT_COMPLETE_AT) applyStatus(state, u, 'The Project Complete', 99, false, u);
  });
}

export function addProjectStacks(state: CombatState, source: CombatUnit, amount: number, reason = ''): number {
  if (amount <= 0) return getProjectStacks(state, source.team);
  if (!state.dynamicState) state.dynamicState = {};
  if (!state.dynamicState.projectStacks) state.dynamicState.projectStacks = { player: 0, enemy: 0 };
  if (!state.dynamicState.projectThresholdsFired) state.dynamicState.projectThresholdsFired = { player: {}, enemy: {} };

  const team = source.team;
  const before = state.dynamicState.projectStacks[team] || 0;
  const after = Math.min(99, before + amount);
  state.dynamicState.projectStacks[team] = after;
  const squad = team === 'player' ? state.playerTeam : state.enemyTeam;
  const gained = after - before;

  logBattleEvent(state, `🏗️ The Project +${amount} (${after}/${PROJECT_COMPLETE_AT})${reason ? ` — ${reason}` : ''}`, 'buff');

  if (gained > 0) {
    squad.forEach(u => {
      if (!u.activeInBattle || u.hp <= 0) return;
      if (['admiral_piett_final', 'director_krennic_architect', 'bevel_lemelisk'].includes(u.characterId)) {
        if (!hasStatusFlag(u, 'prevent_tm_gain')) {
          u.turnMeter = Math.min(100, u.turnMeter + 2 * gained);
        }
      }
    });
  }

  const fired = state.dynamicState.projectThresholdsFired[team];
  [10, 15, 20, 25].forEach(th => {
    if (!(before < th && after >= th && !fired[th])) return;
    fired[th] = true;
    if (th === 25) {
      squad.filter(u => u.activeInBattle && u.hp > 0 && isImperialArchitect(u)).forEach(u => {
        applyStatus(state, u, 'Offense Up', 2, false, source);
        applyStatus(state, u, 'Defense Up', 2, false, source);
      });
      const krennic = squad.find(u => u.characterId === 'director_krennic_architect' && u.activeInBattle && u.hp > 0);
      if (krennic) {
        applyStatus(state, krennic, 'Offense Up', 3, false, krennic);
        applyStatus(state, krennic, 'Critical Damage Up', 3, false, krennic);
      }
      const dodd = squad.find(u => u.characterId === 'vice_admiral_dodd_rancit' && u.activeInBattle && u.hp > 0);
      if (dodd) {
        applyStatus(state, dodd, 'Defense Up', 3, false, dodd);
        applyStatus(state, dodd, 'Retribution', 3, false, dodd);
        applyStatus(state, dodd, 'Tenacity Up', 3, false, dodd);
      }
      logBattleEvent(state, `☢️ The Project is COMPLETE! Authority By All Means unlocked.`, 'ultimate');
    } else {
      if (squad.some(u => u.characterId === 'director_krennic_architect' && u.position === 0 && u.activeInBattle && u.hp > 0)) {
        squad.filter(u => u.activeInBattle && u.hp > 0 && isImperialArchitect(u)).forEach(u => {
          if (!hasStatusFlag(u, 'prevent_prot_recovery')) {
            u.protection = Math.min(u.maxProtection, u.protection + Math.round(u.maxProtection * 0.05));
          }
        });
        logBattleEvent(state, `🏗️ Project Milestone ${th}: Imperial Architects recover 5% Protection!`, 'heal');
      }
      const eng = squad.find(u => u.characterId === 'imperial_engineer' && u.activeInBattle && u.hp > 0);
      if (eng) {
        Object.keys(eng.cooldowns).forEach(k => {
          if (eng.cooldowns[k] > 0) eng.cooldowns[k] = Math.max(0, eng.cooldowns[k] - 1);
        });
        logBattleEvent(state, `🔧 Milestone ${th}: Imperial Engineer cooldowns -1!`, 'buff');
      }
    }
  });

  syncProjectStatus(state, team);
  return after;
}

export function consumeProjectStacks(state: CombatState, source: CombatUnit, amount: number): number {
  if (!state.dynamicState) state.dynamicState = {};
  if (!state.dynamicState.projectStacks) state.dynamicState.projectStacks = { player: 0, enemy: 0 };
  const team = source.team;
  const current = state.dynamicState.projectStacks[team] || 0;
  const consumed = Math.min(current, amount);
  state.dynamicState.projectStacks[team] = current - consumed;
  if (consumed > 0) {
    logBattleEvent(state, `🏗️ Consumed ${consumed} Project stacks (left ${state.dynamicState.projectStacks[team]})`, 'info');
    const squad = team === 'player' ? state.playerTeam : state.enemyTeam;
    const bevel = squad.find(u => u.characterId === 'bevel_lemelisk' && u.activeInBattle && u.hp > 0);
    if (bevel && !hasStatusFlag(bevel, 'prevent_prot_recovery')) {
      bevel.protection = Math.min(bevel.maxProtection, bevel.protection + Math.round(bevel.maxProtection * 0.20));
      logBattleEvent(state, `💚 Bevel recovers Protection from Project consumption!`, 'heal');
    }
    if (state.dynamicState.projectStacks[team] < PROJECT_COMPLETE_AT && state.dynamicState.projectThresholdsFired?.[team]) {
      state.dynamicState.projectThresholdsFired[team][25] = false;
    }
    syncProjectStatus(state, team);
  }
  return consumed;
}

export function handleProjectAbilityEffects(state: CombatState, attacker: CombatUnit, ability: Ability) {
  const mentions = ability.effects.some(e => e === 'The Project') || /The Project/i.test(ability.desc);
  if (!mentions) return;

  if (ability.id === 'piett_f_special_3') {
    if (!isProjectComplete(state, attacker.team)) {
      logBattleEvent(state, `🚫 Authority By All Means locked — The Project is not Complete!`, 'debuff');
      return;
    }
    if (state.dynamicState?.authorityUsed?.[attacker.team]) {
      logBattleEvent(state, `🚫 Authority By All Means already used this battle!`, 'debuff');
      return;
    }
  }

  const consumeAll = /[Cc]onsume all stacks of The Project/i.test(ability.desc);
  const consumeMatch = ability.desc.match(/[Cc]onsume up to\s+(\d+)\s+stacks?\s+of\s+The Project/i);
  const gainMatch = ability.desc.match(/[Gg]ain\s+(\d+)\s+(?:additional\s+)?stacks?\s+of\s+The Project/i);

  if (consumeAll) {
    consumeProjectStacks(state, attacker, 999);
    if (!state.dynamicState) state.dynamicState = {};
    if (!state.dynamicState.authorityUsed) state.dynamicState.authorityUsed = {};
    state.dynamicState.authorityUsed[attacker.team] = true;
  } else if (consumeMatch) {
    const got = consumeProjectStacks(state, attacker, parseInt(consumeMatch[1], 10));
    if (ability.id === 'bevel_special_2' && got > 0) {
      const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
      squad.filter(u => u.activeInBattle && u.hp > 0 && isImperialArchitect(u)).forEach(u => {
        if (!hasStatusFlag(u, 'prevent_tm_gain')) u.turnMeter = Math.min(100, u.turnMeter + 5 * got);
      });
      if (got >= 5) {
        squad.filter(u => u.activeInBattle && u.hp > 0 && isImperialArchitect(u)).forEach(u => {
          applyStatus(state, u, 'Offense Up', 2, false, attacker);
        });
      }
    }
  }

  if (gainMatch && ability.id !== 'bevel_special_2' && ability.id !== 'piett_f_special_3') {
    addProjectStacks(state, attacker, parseInt(gainMatch[1], 10), ability.name);
  } else if (!gainMatch && !consumeAll && !consumeMatch && ability.effects.includes('The Project') && ability.id !== 'piett_f_special_3') {
    addProjectStacks(state, attacker, 1, ability.name);
  }
}

export function onArchitectSpecialUsed(state: CombatState, unit: CombatUnit) {
  if (!isImperialArchitect(unit)) return;
  const squad = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
  if (squad.some(u => u.characterId === 'admiral_piett_final' && u.position === 0 && u.activeInBattle && u.hp > 0)) {
    addProjectStacks(state, unit, 1, 'Piett Leadership: Special');
  }
  if (squad.some(u => u.characterId === 'imperial_engineer' && u.activeInBattle && u.hp > 0)) {
    addProjectStacks(state, unit, 1, 'Chief Systems Engineer');
  }
  if (unit.characterId === 'galen_erso' && squad.some(u => u.characterId === 'director_krennic_architect' && u.activeInBattle && u.hp > 0)) {
    addProjectStacks(state, unit, 2, 'Obsessed Visionary: Galen special');
  }
}

export function onArchitectAllyDefeated(state: CombatState, defeated: CombatUnit, attacker: CombatUnit | null) {
  const squad = defeated.team === 'player' ? state.playerTeam : state.enemyTeam;
  if (isImperialArchitect(defeated) && squad.some(u => u.characterId === 'admiral_piett_final' && u.position === 0 && u.activeInBattle && u.hp > 0)) {
    const living = squad.find(u => u.activeInBattle && u.hp > 0 && isImperialArchitect(u));
    if (living) addProjectStacks(state, living, 3, 'Piett: Architect defeated');
  }
  if (defeated.characterId === 'galen_erso' && attacker && attacker.team !== defeated.team) {
    const living = squad.find(u => u.activeInBattle && u.hp > 0 && isImperialArchitect(u));
    if (living) addProjectStacks(state, living, 5, 'Hostage Scientist: Galen defeated');
  }
}

export function onArchitectDefeatedEnemy(state: CombatState, defeated: CombatUnit, attacker: CombatUnit | null) {
  if (!attacker || !isImperialArchitect(attacker)) return;
  const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
  if (squad.some(u => u.characterId === 'bevel_lemelisk' && u.activeInBattle && u.hp > 0)) {
    addProjectStacks(state, attacker, 2, 'Bevel: enemy defeated');
  }
}

export function onArchitectDamaged(state: CombatState, unit: CombatUnit, damage: number) {
  if (damage <= 0) return;
  if (unit.characterId === 'galen_erso' && unit.activeInBattle && unit.hp > 0) {
    addProjectStacks(state, unit, 1, 'Hostage Scientist: damaged');
  }
  if (unit.characterId === 'vice_admiral_dodd_rancit' && unit.statuses.some(s => s.name === 'Taunt')) {
    addProjectStacks(state, unit, 1, 'Dodd: Taunt hit');
  }
}

export function onArchitectBuffGained(state: CombatState, unit: CombatUnit, statusName: string) {
  if (statusName === 'The Project' || statusName === 'The Project Complete' || statusName === 'Hostage Scientist') return;
  const squad = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
  if (!squad.some(u => u.characterId === 'director_krennic_architect' && u.position === 0 && u.activeInBattle && u.hp > 0)) return;
  addProjectStacks(state, unit, 1, `Director: ${statusName}`);
}

export function onArchitectGainedDefenseUp(state: CombatState, unit: CombatUnit) {
  if (!isImperialArchitect(unit)) return;
  const squad = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
  const eng = squad.find(u => u.characterId === 'imperial_engineer' && u.activeInBattle && u.hp > 0);
  if (eng && !hasStatusFlag(eng, 'prevent_prot_recovery')) {
    eng.protection = Math.min(eng.maxProtection, eng.protection + Math.round(eng.maxProtection * 0.03));
  }
}

export function ensureHostageScientist(state: CombatState) {
  [...state.playerTeam, ...state.enemyTeam].forEach(u => {
    if (u.characterId === 'galen_erso' && u.activeInBattle && u.hp > 0 && !u.statuses.some(s => s.name === 'Hostage Scientist')) {
      applyStatus(state, u, 'Hostage Scientist', 99, false, u);
    }
  });
}

export function checkDoddLowHealthTaunt(state: CombatState, unit: CombatUnit) {
  if (!isImperialArchitect(unit) || unit.hp <= 0 || unit.hp >= unit.maxHp * 0.5) return;
  const squad = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
  const dodd = squad.find(u => u.characterId === 'vice_admiral_dodd_rancit' && u.activeInBattle && u.hp > 0);
  if (!dodd) return;
  if (!dodd.dynamicState) dodd.dynamicState = {};
  if (!dodd.dynamicState.doddTauntFor) dodd.dynamicState.doddTauntFor = {};
  if (dodd.dynamicState.doddTauntFor[unit.id]) return;
  dodd.dynamicState.doddTauntFor[unit.id] = true;
  applyStatus(state, dodd, 'Taunt', 1, false, dodd);
  logBattleEvent(state, `🛡️ Dodd gains Taunt to protect ${unit.name}!`, 'buff');
}
