/**
 * Hutt Cartel Contract progress (Bib / Boba / Jabba) + Rotta Scum ecosystem.
 */
import { CombatState, CombatUnit, Ability } from '../../types';
import { applyStatus, checkHasTag, logBattleEvent, hasStatusFlag } from '../combatEngine';

function squadOf(state: CombatState, unit: CombatUnit) {
  return unit.team === 'player' ? state.playerTeam : state.enemyTeam;
}
function living(units: CombatUnit[]) {
  return units.filter(u => u.activeInBattle && u.hp > 0);
}
function isHC(u: CombatUnit) {
  return checkHasTag(u, 'Hutt Cartel') || (u.tags || []).some(t => /hutt cartel/i.test(t));
}
function ensureDS(u: CombatUnit) {
  if (!u.dynamicState) u.dynamicState = {};
  return u.dynamicState;
}
function ensureSide(state: CombatState, team: 'player' | 'enemy') {
  if (!state.dynamicState) state.dynamicState = {};
  if (!state.dynamicState.huttContracts) state.dynamicState.huttContracts = {};
  if (!state.dynamicState.huttContracts[team]) {
    state.dynamicState.huttContracts[team] = {
      bibBribed: 0, bibGoal: 10, bibComplete: false,
      bobaDefeats: 0, bobaGoal: 3, bobaComplete: false,
      jabbaDebuffs: 0, jabbaGoal: 20, jabbaComplete: false,
      rottaAlliesWithScum: [] as string[],
      firstSpecialScumDone: false,
    };
  }
  return state.dynamicState.huttContracts[team];
}

export function hasScum(unit: CombatUnit) {
  return unit.statuses.some(s => s.name === 'Scum');
}

export function installHuttContracts(state: CombatState) {
  if (!state.dynamicState) state.dynamicState = {};
  if (state.dynamicState.huttContractsInstalled) return;
  state.dynamicState.huttContractsInstalled = true;

  ['player', 'enemy'].forEach((team) => {
    const t = team as 'player' | 'enemy';
    const sq = t === 'player' ? state.playerTeam : state.enemyTeam;
    const leader = sq.find(u => u.position === 0 && u.activeInBattle);
    const hc = ensureSide(state, t);

    // Mark which contracts are active for this side (do NOT grant rewards yet)
    if (leader?.characterId === 'bib_fortuna') {
      hc.bibActive = true;
      logBattleEvent(state, `📜 Hutt Contract (Bib): Inflict Bribed 10 times.`, 'info');
    }
    if (leader?.characterId === 'boba_fett_daimyo') {
      hc.bobaActive = true;
      logBattleEvent(state, `📜 Hutt Contract (Boba): Defeat 3 debuffed enemies.`, 'info');
    }
    if (leader?.characterId === 'jabba') {
      hc.jabbaActive = true;
      hc.jabbaFaster = true; // fills 50% faster → count +1.5 effectively as +2 every other, use 1.5 via fractional
      logBattleEvent(state, `📜 Hutt Contract (Jabba): Inflict Bribed/Intimidated 20 times (50% faster).`, 'info');
    }

    // Rotta: untargetable while HC allies live; cannot attack
    living(sq).forEach(u => {
      if (u.characterId === 'rotta_hutt') {
        ensureDS(u).untargetableWhileHCAllies = true;
        ensureDS(u).rottaCannotAct = true;
        ensureDS(u).hcDeathSaveReady = true;
        // Also mark all HC allies for death save
        living(sq).filter(isHC).forEach(a => { ensureDS(a).hcDeathSaveReady = true; });
      }
    });

    // Bribed / Intimidated TM flags from leaders (always-on kit text, not reward-gated)
    if (leader?.characterId === 'bib_fortuna' || leader?.characterId === 'jabba' || leader?.characterId === 'boba_fett_daimyo') {
      ensureDS(leader).huttLeadBribedRules = true;
    }
  });
}

function grantBibReward(state: CombatState, team: 'player' | 'enemy') {
  const sq = team === 'player' ? state.playerTeam : state.enemyTeam;
  living(sq).filter(isHC).forEach(u => {
    u.speed += 20;
  });
  const hc = ensureSide(state, team);
  hc.bibRewardProtOnDebuff = true;
  logBattleEvent(state, `🏆 Bib Contract COMPLETE: Hutt Cartel +20 Speed! Prot recovery on enemy debuffs enabled.`, 'ultimate');
}

function grantBobaReward(state: CombatState, team: 'player' | 'enemy') {
  const sq = team === 'player' ? state.playerTeam : state.enemyTeam;
  living(sq).filter(isHC).forEach(u => {
    u.offense = Math.round(u.offense * 1.25);
    ensureDS(u).bobaBribedBonusDmg = true;
  });
  const hc = ensureSide(state, team);
  hc.bobaRewardBelow50Prot = true;
  hc.bobaBribedBonusDmg = true;
  hc.bobaBribedNoTM = true;
  // Stamp currently Bribed enemies
  const opp = team === 'player' ? state.enemyTeam : state.playerTeam;
  living(opp).forEach(e => {
    if (e.statuses.some(s => s.name === 'Bribed')) ensureDS(e).forcePreventTM = true;
  });
  logBattleEvent(state, `🏆 Boba Contract COMPLETE: Hutt Cartel +25% Offense! Bribed rules + below-50% Prot recovery enabled.`, 'ultimate');
}

function grantJabbaReward(state: CombatState, team: 'player' | 'enemy') {
  const sq = team === 'player' ? state.playerTeam : state.enemyTeam;
  living(sq).filter(isHC).forEach(u => {
    u.speed += 25;
    const bonus = Math.round(u.maxHp * 0.35);
    u.maxHp += bonus;
    u.hp += bonus;
  });
  const hc = ensureSide(state, team);
  hc.jabbaRewardProtOnDebuff = true;
  hc.jabbaIntimidatedNoBonusTM = true;
  logBattleEvent(state, `🏆 Jabba Contract COMPLETE: Hutt Cartel +35% Max Health, +25 Speed!`, 'ultimate');
}

export function onHuttDebuffInflicted(state: CombatState, attacker: CombatUnit | null, target: CombatUnit, statusName: string) {
  if (!attacker) return;
  const team = attacker.team;
  const hc = ensureSide(state, team);

  // Bib / Jabba progress
  if (statusName === 'Bribed') {
    if (hc.bibActive && !hc.bibComplete) {
      hc.bibBribed += 1;
      logBattleEvent(state, `📜 Bib Contract ${hc.bibBribed}/${hc.bibGoal}`, 'info');
      if (hc.bibBribed >= hc.bibGoal) {
        hc.bibComplete = true;
        grantBibReward(state, team);
      }
    }
    if (hc.bobaBribedNoTM) {
      ensureDS(target).forcePreventTM = true;
    }
  }
  if (statusName === 'Bribed' || statusName === 'Intimidated') {
    if (hc.jabbaActive && !hc.jabbaComplete) {
      const amt = hc.jabbaFaster ? 1.5 : 1;
      hc.jabbaDebuffs = Math.min(hc.jabbaGoal, (hc.jabbaDebuffs || 0) + amt);
      logBattleEvent(state, `📜 Jabba Contract ${Math.floor(hc.jabbaDebuffs)}/${hc.jabbaGoal}`, 'info');
      if (hc.jabbaDebuffs >= hc.jabbaGoal) {
        hc.jabbaComplete = true;
        grantJabbaReward(state, team);
      }
    }
  }

  // Reward: HC recover prot when enemies gain debuffs (Bib / Jabba)
  if (target.team !== team) {
    const sq = squadOf(state, attacker);
    if (hc.bibRewardProtOnDebuff) {
      living(sq).filter(isHC).forEach(u => {
        if (!hasStatusFlag(u, 'prevent_prot_recovery')) {
          u.protection = Math.min(u.maxProtection, u.protection + Math.round(u.maxProtection * 0.1));
        }
      });
    }
    if (hc.jabbaRewardProtOnDebuff) {
      living(sq).filter(isHC).forEach(u => {
        if (!hasStatusFlag(u, 'prevent_prot_recovery')) {
          u.protection = Math.min(u.maxProtection, u.protection + Math.round(u.maxProtection * 0.02));
        }
      });
    }
  }
}

export function onHuttEnemyDefeated(state: CombatState, defeated: CombatUnit, attacker: CombatUnit | null) {
  if (!attacker) return;
  const team = attacker.team;
  if (defeated.team === team) return;
  const hc = ensureSide(state, team);

  if (hc.bobaActive && !hc.bobaComplete && (defeated.dynamicState?.hadDebuffOnDeath || defeated.statuses.some(s => s.isDebuff))) {
    hc.bobaDefeats += 1;
    logBattleEvent(state, `📜 Boba Contract ${hc.bobaDefeats}/${hc.bobaGoal}`, 'info');
    if (hc.bobaDefeats >= hc.bobaGoal) {
      hc.bobaComplete = true;
      grantBobaReward(state, team);
    }
  }

  // Boba with Rotta Scum aura: defeats progress allied Scum
  const rotta = living(squadOf(state, attacker)).find(u => u.characterId === 'rotta_hutt' && hasScum(u));
  if (attacker.characterId === 'boba_fett_daimyo' && rotta) {
    living(squadOf(state, attacker)).filter(isHC).forEach(a => {
      if (!hasScum(a) && a.characterId !== 'rotta_hutt') progressAllyScum(state, a, 1, 'Boba defeat');
    });
  }
}

export function markDebuffsOnDeath(unit: CombatUnit) {
  if (unit.statuses.some(s => s.isDebuff)) {
    ensureDS(unit).hadDebuffOnDeath = true;
    ensureDS(unit).diedWithDebuff = true;
  }
}

export function onHuttEnemyBelow50(state: CombatState, enemy: CombatUnit) {
  const opp = enemy.team === 'player' ? state.enemyTeam : state.playerTeam;
  const team = opp[0]?.team as 'player' | 'enemy' | undefined;
  if (!team) return;
  const hc = ensureSide(state, team);
  if (!hc.bobaRewardBelow50Prot) return;
  living(opp).filter(isHC).forEach(u => {
    if (!hasStatusFlag(u, 'prevent_prot_recovery')) {
      u.protection = Math.min(u.maxProtection, u.protection + Math.round(u.maxProtection * 0.1));
    }
  });
}

export function getHuttBribedDamageBonus(attacker: CombatUnit, target: CombatUnit): number {
  if (!target.statuses.some(s => s.name === 'Bribed')) return 1;
  if (attacker.dynamicState?.bobaBribedBonusDmg) return 1.25;
  return 1;
}

export function blockBribedTMGain(unit: CombatUnit, state: CombatState): boolean {
  if (!unit.statuses.some(s => s.name === 'Bribed')) return false;
  const opp = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
  const lead = opp.find(u => u.position === 0);
  if (!lead) return false;
  const hc = ensureSide(state, lead.team);
  return !!hc.bobaBribedNoTM;
}

export function blockIntimidatedBonusTM(unit: CombatUnit, state: CombatState): boolean {
  if (!unit.statuses.some(s => s.name === 'Intimidated')) return false;
  const opp = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
  const lead = opp.find(u => u.position === 0);
  if (!lead) return false;
  const hc = ensureSide(state, lead.team);
  return !!hc.jabbaIntimidatedNoBonusTM;
}

export function onBribedEnemyAttack(state: CombatState, attacker: CombatUnit) {
  if (!attacker.statuses.some(s => s.name === 'Bribed')) return;
  const opp = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
  const jabba = living(opp).find(u => u.characterId === 'jabba');
  if (jabba && !hasStatusFlag(jabba, 'prevent_tm_gain')) {
    jabba.turnMeter = Math.min(100, jabba.turnMeter + 3);
  }
  const bib = living(opp).find(u => u.characterId === 'bib_fortuna');
  if (bib && !hasStatusFlag(bib, 'prevent_tm_gain')) {
    bib.turnMeter = Math.min(100, bib.turnMeter + 5);
  }
}

export function onCartelRecovery(state: CombatState, unit: CombatUnit) {
  if (!isHC(unit)) return;
  const bib = living(squadOf(state, unit)).find(u => u.characterId === 'bib_fortuna');
  if (bib && bib.id !== unit.id) {
    bib.hp = Math.min(bib.maxHp, bib.hp + Math.round(bib.maxHp * 0.02));
  }
}

// ---------- Rotta Scum ----------
export function progressAllyScum(state: CombatState, unit: CombatUnit, amount: number, reason = '') {
  if (hasScum(unit) || unit.characterId === 'rotta_hutt') return;
  if (!isHC(unit)) return;
  const ds = ensureDS(unit);
  // Personal Scum conditions vary — use generic 5 if unknown, Crumb uses 10 turns handled elsewhere
  if (!ds.scumProgress) {
    // Infer from unique
    const unique = unit.abilities.find(a => a.type === 'unique' && /Scum Condition/i.test(a.desc));
    let goal = 5;
    if (unique) {
      const m = unique.desc.match(/Scum Condition:[^.]*?(\d+)/i);
      if (m) goal = parseInt(m[1], 10);
    }
    ds.scumProgress = { current: 0, goal };
  }
  ds.scumProgress.current = Math.min(ds.scumProgress.goal, (ds.scumProgress.current || 0) + amount);
  logBattleEvent(state, `👑 ${unit.name} Scum ${ds.scumProgress.current}/${ds.scumProgress.goal}${reason ? ` (${reason})` : ''}`, 'info');
  if (ds.scumProgress.current >= ds.scumProgress.goal) earnScum(state, unit);
}

export function earnScum(state: CombatState, unit: CombatUnit) {
  if (hasScum(unit)) return;
  applyStatus(state, unit, 'Scum', 99, false, unit);
  if (unit.characterId === 'salacious_crumb') {
    unit.speed += 50;
    logBattleEvent(state, `🐒 Scum (Jabba's Pet): Salacious gains +50 Speed!`, 'buff');
  } else {
    logBattleEvent(state, `👑 ${unit.name} earns Scum!`, 'ultimate');
  }
  onAllyEarnedScum(state, unit);
}

/** Side effects when any ally earns Scum (Rotta / Jabba charge / heals) */
export function onAllyEarnedScum(state: CombatState, unit: CombatUnit) {
  const sq = squadOf(state, unit);
  const hc = ensureSide(state, unit.team);

  // Allies recover 5% HP/Prot
  living(sq).forEach(a => {
    a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.05));
    if (!hasStatusFlag(a, 'prevent_prot_recovery')) {
      a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.05));
    }
  });

  // Jabba Ultimate Charge
  const jabba = living(sq).find(u => u.characterId === 'jabba');
  if (jabba && jabba.ultimateCharge !== undefined) {
    jabba.ultimateCharge = Math.min(100, jabba.ultimateCharge + 5);
    logBattleEvent(state, `🏆 Jabba +5% Ultimate Charge from Scum earn (${jabba.ultimateCharge}%)`, 'ultimate');
  }

  // Rotta Scum aura: Bonus Turn on earn
  const rotta = living(sq).find(u => u.characterId === 'rotta_hutt');
  if (rotta && hasScum(rotta) && unit.characterId !== 'rotta_hutt') {
    if (!state.bonusTurnQueue) state.bonusTurnQueue = [];
    state.bonusTurnQueue.push(unit.id);
    logBattleEvent(state, `👑 Rotta Scum: ${unit.name} gains a Bonus Turn!`, 'buff');
  }

  // Track for Rotta's personal Scum (4 different allies)
  if (rotta && unit.characterId !== 'rotta_hutt') {
    if (!hc.rottaAlliesWithScum.includes(unit.characterId)) {
      hc.rottaAlliesWithScum.push(unit.characterId);
    }
    if (hc.rottaAlliesWithScum.length >= 4 && !hasScum(rotta)) {
      applyStatus(state, rotta, 'Scum', 99, false, rotta);
      logBattleEvent(state, `👑 Rotta earns Scum (Future of the Cartel)!`, 'ultimate');
      if (jabba && hasScum(jabba)) {
        living(sq).filter(a => hasScum(a)).forEach(a => {
          a.speed += 15;
          a.defense = Math.round(a.defense * 1.15);
        });
      }
    }
  }

  if (jabba && hasScum(jabba) && hasScum(unit) && unit.characterId !== 'jabba') {
    unit.speed += 15;
    unit.defense = Math.round(unit.defense * 1.15);
  }
}

export function onHuttAbilityUsed(state: CombatState, unit: CombatUnit, ability: Ability, targetAlly?: CombatUnit) {
  // Rotta specials
  if (unit.characterId === 'rotta_hutt') {
    if (ability.id === 'rotta_special_1' && targetAlly) {
      if (hasScum(targetAlly)) {
        targetAlly.hp = Math.min(targetAlly.maxHp, targetAlly.hp + Math.round(targetAlly.maxHp * 0.25));
        if (!hasStatusFlag(targetAlly, 'prevent_prot_recovery')) {
          targetAlly.protection = Math.min(targetAlly.maxProtection, targetAlly.protection + Math.round(targetAlly.maxProtection * 0.25));
        }
        Object.keys(targetAlly.cooldowns).forEach(k => {
          targetAlly.cooldowns[k] = Math.max(0, (targetAlly.cooldowns[k] || 0) - 1);
        });
      } else {
        progressAllyScum(state, targetAlly, 2, "Father's Favorite");
      }
    }
    if (ability.id === 'rotta_special_3' && targetAlly) {
      ensureDS(targetAlly).rottaTinyCrimeLord = true;
    }
    if (ability.id === 'rotta_special_2') {
      living(squadOf(state, unit)).filter(isHC).forEach(a => {
        if (hasScum(a)) applyStatus(state, a, 'Retribution', 2, false, unit);
      });
      const gam = living(squadOf(state, unit)).find(u => /gamorrean/i.test(u.characterId) || /gamorrean/i.test(u.name));
      if (gam) applyStatus(state, gam, 'Taunt', 2, false, unit);
    }
  }

  // First HC special of battle → +1 Scum progress (Rotta unique 2)
  const rotta = living(squadOf(state, unit)).find(u => u.characterId === 'rotta_hutt');
  if (rotta && ability.type === 'special' && isHC(unit) && unit.characterId !== 'rotta_hutt') {
    const hc = ensureSide(state, unit.team);
    if (!hc.firstSpecialScumDone) {
      hc.firstSpecialScumDone = true;
      progressAllyScum(state, unit, 1, 'first HC special');
    }
  }

  // Tiny Crime Lord: progress Scum on attack
  if (unit.dynamicState?.rottaTinyCrimeLord && ability.type !== 'unique') {
    progressAllyScum(state, unit, 1, 'Tiny Crime Lord');
    if (hasScum(unit) && !hasStatusFlag(unit, 'prevent_prot_recovery')) {
      unit.protection = Math.min(unit.maxProtection, unit.protection + Math.round(unit.maxProtection * 0.05));
    }
  }

  // Rotta Scum: Jabba specials reduce HC CDs by 1
  if (unit.characterId === 'jabba' && ability.type === 'special' && rotta && hasScum(rotta)) {
    living(squadOf(state, unit)).filter(isHC).forEach(a => {
      Object.keys(a.cooldowns).forEach(k => {
        a.cooldowns[k] = Math.max(0, (a.cooldowns[k] || 0) - 1);
      });
    });
  }

  // Bib specials with Rotta Scum: recover 10% HP/Prot
  if (unit.characterId === 'bib_fortuna' && ability.type === 'special' && rotta && hasScum(rotta)) {
    living(squadOf(state, unit)).filter(isHC).forEach(a => {
      a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.1));
      if (!hasStatusFlag(a, 'prevent_prot_recovery')) {
        a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.1));
      }
    });
  }
}

export function tryHuttCartelDeathSave(state: CombatState, unit: CombatUnit): boolean {
  const rotta = living(squadOf(state, unit)).find(u => u.characterId === 'rotta_hutt');
  if (!rotta) return false;
  if (!isHC(unit) || !unit.dynamicState?.hcDeathSaveReady) return false;
  ensureDS(unit).hcDeathSaveReady = false;
  unit.hp = Math.max(1, Math.round(unit.maxHp * 0.01));
  unit.activeInBattle = true;
  unit.statuses = unit.statuses.filter(s => !s.isDebuff);
  applyStatus(state, unit, 'Protection Up', 1, false, rotta);
  // Approximate 50% prot up
  unit.protection = Math.min(unit.maxProtection, unit.protection + Math.round(unit.maxProtection * 0.5));
  logBattleEvent(state, `👑 Protected At All Costs: ${unit.name} survives with 1% Health!`, 'heal');
  return true;
}

export function filterRottaUntargetable(attacker: CombatUnit, state: CombatState, candidates: CombatUnit[]): CombatUnit[] {
  return candidates.filter(u => {
    if (!u.dynamicState?.untargetableWhileHCAllies) return true;
    const sq = squadOf(state, u);
    const otherHC = living(sq).some(a => a.id !== u.id && isHC(a));
    return !otherHC;
  });
}

export function checkRottaLastAllyDefeat(state: CombatState, unit: CombatUnit): boolean {
  if (unit.characterId !== 'rotta_hutt') return false;
  const sq = squadOf(state, unit);
  const others = living(sq).filter(a => a.id !== unit.id);
  if (others.length === 0) {
    unit.hp = 0;
    unit.activeInBattle = false;
    state.ended = true;
    state.winner = unit.team === 'player' ? 'enemy' : 'player';
    logBattleEvent(state, `👑 Rotta retreats — battle lost!`, 'death');
    return true;
  }
  return false;
}
