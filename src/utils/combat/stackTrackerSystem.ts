/**
 * Raid-exclusive and niche stack trackers: Wrath, Guarded Position, Duelist, Advance, Museum Guardian.
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
function artifactCount(state: CombatState, unit: CombatUnit) {
  return living(squadOf(state, unit)).filter(u => u.statuses.some(s => s.name === 'Artifact')).length;
}

/** Starkiller: damage to Imperial Decree target → Wrath stacks */
export function onWrathDamage(state: CombatState, attacker: CombatUnit, target: CombatUnit) {
  if (attacker.characterId !== 'starkiller') return;
  if (!target.statuses.some(s => s.name === 'Imperial Decree')) return;
  applyStatus(state, attacker, 'Wrath', 99, false, attacker, 2);
  const wrath = attacker.statuses.find(s => s.name === 'Wrath');
  const stacks = wrath?.count || 0;
  if (stacks >= 10) {
    attacker.statuses = attacker.statuses.filter(s => s.name !== 'Wrath');
    applyStatus(state, attacker, 'Offense Up', 2, false, attacker);
    applyStatus(state, attacker, 'Critical Damage Up', 2, false, attacker);
    applyStatus(state, attacker, 'Defense Penetration Up', 2, false, attacker);
    logBattleEvent(state, `⚡ Emperor's Wrath: Starkiller consumes 10 Wrath!`, 'buff');
  }
}

/** Bly: Jedi special → Guarded Position → Veteran Commander */
export function onBlyJediSpecial(state: CombatState, specialUser: CombatUnit) {
  if (!checkHasTag(specialUser, 'Jedi') && !(specialUser.tags || []).includes('Jedi')) return;
  if (!checkHasTag(specialUser, 'Galactic Republic') && !(specialUser.tags || []).some(t => /galactic republic/i.test(t))) return;
  const bly = living(squadOf(state, specialUser)).find(u => u.characterId === 'bly' || u.characterId === 'commander_bly');
  if (!bly) return;
  applyStatus(state, bly, 'Guarded Position', 99, false, bly, 1);
  const gp = bly.statuses.find(s => s.name === 'Guarded Position');
  if ((gp?.count || 0) >= 3) {
    bly.statuses = bly.statuses.filter(s => s.name !== 'Guarded Position');
    applyStatus(state, bly, 'Veteran Commander', 99, false, bly);
    logBattleEvent(state, `🎖️ Bly reaches Veteran Commander!`, 'buff');
  }
}

/** Maul Theed: consecutive hits on same target → Duelist → Master Duelist */
export function onMaulDuelistHit(state: CombatState, attacker: CombatUnit, target: CombatUnit) {
  if (attacker.characterId !== 'maul_theed' && attacker.characterId !== 'darth_maul_theed') return;
  const ds = ensureDS(attacker);
  if (ds.lastDuelistTargetId === target.id) {
    applyStatus(state, attacker, 'Duelist', 99, false, attacker, 1);
    const d = attacker.statuses.find(s => s.name === 'Duelist');
    if ((d?.count || 0) >= 5) {
      attacker.statuses = attacker.statuses.filter(s => s.name !== 'Duelist');
      applyStatus(state, attacker, 'Master Duelist', 99, false, attacker);
      logBattleEvent(state, `🗡️ Maul becomes Master Duelist!`, 'buff');
    }
  } else {
    ds.lastDuelistTargetId = target.id;
  }
}

/** AT-AT: Imperial Trooper special → Advance → Siege Formation */
export function onAtatAdvance(state: CombatState, specialUser: CombatUnit) {
  if (!checkHasTag(specialUser, 'Imperial Trooper') && !(specialUser.tags || []).some(t => /imperial trooper/i.test(t))) return;
  const atat = living(squadOf(state, specialUser)).find(u => u.characterId === 'atat_driver' || u.characterId === 'atat' || u.characterId.includes('atat'));
  if (!atat) return;
  applyStatus(state, atat, 'Advance', 99, false, atat, 1);
  const adv = atat.statuses.find(s => s.name === 'Advance');
  if ((adv?.count || 0) >= 5) {
    atat.statuses = atat.statuses.filter(s => s.name !== 'Advance');
    applyStatus(state, atat, 'Siege Formation', 99, false, atat);
    // Share formation markers to troopers via ignore-defense dynamic flag
    living(squadOf(state, atat)).filter(u => checkHasTag(u, 'Imperial Trooper') || (u.tags || []).some(t => /imperial trooper/i.test(t))).forEach(u => {
      ensureDS(u).siegeFormation = true;
      ensureDS(u).ignoreDefensePct = Math.max(ensureDS(u).ignoreDefensePct || 0, 0.3);
    });
    logBattleEvent(state, `🚶 Siege Formation achieved!`, 'buff');
  }
}

/** IG-90 Museum Guardian when 4 Artifacts active */
export function refreshMuseumGuardian(state: CombatState, unit: CombatUnit) {
  const ig = living([...state.playerTeam, ...state.enemyTeam]).find(u => u.characterId === 'ig90');
  if (!ig) return;
  const arts = artifactCount(state, ig);
  ensureDS(ig).artifactCount = arts;
  if (arts >= 1) ensureDS(ig).museumOffense = 1.2;
  if (arts >= 2) ensureDS(ig).ignoreDefensePct = Math.max(ensureDS(ig).ignoreDefensePct || 0, 0.25);
  if (arts >= 4) {
    if (!ig.statuses.some(s => s.name === 'Museum Guardian')) {
      applyStatus(state, ig, 'Museum Guardian', 99, false, ig);
      ensureDS(ig).ignoreDefensePct = Math.max(ensureDS(ig).ignoreDefensePct || 0, 0.4);
      logBattleEvent(state, `🏛️ IG-90 becomes Museum Guardian!`, 'buff');
    }
  } else if (ig.statuses.some(s => s.name === 'Museum Guardian')) {
    ig.statuses = ig.statuses.filter(s => s.name !== 'Museum Guardian');
  }
}

export function onStackTrackerSpecial(state: CombatState, attacker: CombatUnit, ability: Ability) {
  if (ability.type !== 'special' && ability.type !== 'ultimate') return;
  onBlyJediSpecial(state, attacker);
  onAtatAdvance(state, attacker);
  // IG-90 assist when 3+ artifacts and another RA uses special
  const ig = living(squadOf(state, attacker)).find(u => u.characterId === 'ig90' && u.id !== attacker.id);
  if (ig && (checkHasTag(attacker, 'Rogue Archaeologist') || (attacker.tags || []).some(t => /rogue archaeologist/i.test(t)))) {
    refreshMuseumGuardian(state, ig);
    const arts = ensureDS(ig).artifactCount || 0;
    const ds = ensureDS(ig);
    if (arts >= 3 && !ds.ig90AssistedThisTurn) {
      ds.ig90AssistedThisTurn = true;
      const enemies = living(attacker.team === 'player' ? state.enemyTeam : state.playerTeam);
      if (enemies.length && ig.hp > 0) {
        const basic = ig.abilities.find(a => a.type === 'basic') || ig.abilities[0];
        if (basic) executeCombatAction(state, ig.id, basic, enemies[0].id, undefined, 1, 0);
      }
    }
  }
}

export function onStackTrackerDamage(state: CombatState, attacker: CombatUnit, target: CombatUnit, ability?: Ability) {
  onWrathDamage(state, attacker, target);
  onMaulDuelistHit(state, attacker, target);
  // Siege Formation prot recover vs debuffed
  if (attacker.dynamicState?.siegeFormation || attacker.statuses.some(s => s.name === 'Siege Formation')) {
    const hasDebuff = target.statuses.some(s => s.isDebuff);
    if (hasDebuff && !hasStatusFlag(attacker, 'prevent_prot_recovery')) {
      attacker.protection = Math.min(attacker.maxProtection, attacker.protection + Math.round(attacker.maxProtection * 0.05));
    }
  }
  if (attacker.statuses.some(s => s.name === 'Museum Guardian') || attacker.characterId === 'ig90') {
    refreshMuseumGuardian(state, attacker);
  }
}

export function resetStackTrackerTurnFlags(unit: CombatUnit) {
  if (unit.dynamicState) unit.dynamicState.ig90AssistedThisTurn = false;
}
