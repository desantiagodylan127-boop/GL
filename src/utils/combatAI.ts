import { CombatUnit, Ability, CombatState } from '../types';
import { grabValidTargets, getModifiedStats, checkHasTag } from './combatEngine';

/**
 * AI Decision Engine
 */
export function getAIChoice(
  unit: CombatUnit,
  state: CombatState
): { ability: Ability; targetId: string } {
  // 1. Grab matching targets
  const targets = grabValidTargets(unit, state);
  if (targets.length === 0) {
    // Fail-safe targeting
    const fallbackOpponents = (unit.team === 'player' ? state.enemyTeam : state.playerTeam)
      .filter(u => u.activeInBattle && u.hp > 0);
    const fallbackTarget = fallbackOpponents[0] || unit;
    return { ability: unit.abilities[0], targetId: fallbackTarget.id };
  }

  // 2. Filter available abilities that are off cooldown
  const availableAbilities = unit.abilities.filter(ab => {
    const cd = unit.cooldowns[ab.id] || 0;
    const isBlocked = unit.statuses.some(s =>
      s.name === 'Ability Block' ||
      s.name === 'ABILITY BLOCK' ||
      s.name === 'Blocked' ||
      s.name.toUpperCase() === 'ABILITY BLOCK'
    );
    const ultimateNotReady = ab.type === 'ultimate' && (unit.ultimateCharge ?? 0) < 100;
    const isRestricted = isBlocked && (ab.type === 'special' || ab.type === 'ultimate') || ultimateNotReady;
    return cd === 0 && !isRestricted && ab.type !== 'leader' && ab.type !== 'unique';
  });

  // Default fallback is basic
  let bestAbility = unit.abilities.find(a => a.type === 'basic') || unit.abilities[0];

  // Evaluate other skills
  let maxWeight = 0;
  
  availableAbilities.forEach(ab => {
    let weight = 10; // basic level weight

    if (ab.type === 'special') weight = 40;
    if (ab.type === 'ultimate') weight = 100; // prioritize ultimates
    if (ab.type === 'summon') {
      const alreadySummoned = (unit.team === 'player' ? state.playerTeam : state.enemyTeam)
        .some(u => u.isSummon);
      weight = alreadySummoned ? 5 : 80; // only summon if none active
    }

    // Adjust behavior weights based on tags and current context
    const tags = ab.aiTags || [];

    // Cleanse or emergency heal support
    if (tags.includes('cleanse') || tags.includes('heal')) {
      const team = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
      const wounded = team.filter(u => u.activeInBattle && u.hp < u.maxHp * 0.50);
      if (wounded.length > 0) {
        weight += 50; // high weight during danger
      } else {
        weight -= 20; // preserve heal skills
      }
    }

    // Taunts
    if (tags.includes('taunt')) {
      const hasTaunt = (unit.team === 'player' ? state.playerTeam : state.enemyTeam)
        .some(u => u.statuses.some(s => s.name === 'Taunt') && u.id !== unit.id);
      weight = hasTaunt ? 10 : 60; // taunt only if no other ally has it
    }

    if (weight > maxWeight) {
      maxWeight = weight;
      bestAbility = ab;
    }
  });

  // Evaluate Enemy target priorities
  // Checklist: Revive capable, Lowest HP, Taunting, High Threat, Buff-Heavy
  let bestTarget = targets[0];
  let maxTargetWeight = -1000;

  targets.forEach(tar => {
    let tWeight = 100; // baseline targeting weight

    // Target lowest absolute health
    const hpPct = tar.hp / tar.maxHp;
    tWeight += (1 - hpPct) * 150; // heavily prioritize low relative health

    // Prioritize threats or revive leaders (e.g. Master Kenobi, Jabba, Mon Mothma, Grand Inquisitor, Rex)
    const criticalThreats = ['master_kenobi', 'jabba', 'mon_mothma', 'grand_inquisitor', 'captain_rex', 'boba_fett_daimyo'];
    if (criticalThreats.includes(tar.characterId)) {
      tWeight += 60;
    }

    // Taunt target locks
    if (tar.statuses.some(s => s.name === 'Taunt')) {
      tWeight += 80;
    }

    // Buff heavy targets to dispel
    if (tar.statuses.filter(s => !s.isDebuff).length > 3) {
      tWeight += 30;
    }

    // Inquisitorius Purge multipliers
    const purge = tar.statuses.find(s => s.name === 'Purge');
    if (purge) {
      tWeight += (purge.count || 1) * 15;
    }

    if (tWeight > maxTargetWeight) {
      maxTargetWeight = tWeight;
      bestTarget = tar;
    }
  });

  const selectedTargetId = state.selectedTargetId;
  if (selectedTargetId) {
    const selected = targets.find(t => t.id === selectedTargetId);
    if (selected) {
      return { ability: bestAbility, targetId: selected.id };
    }
  }

  return { ability: bestAbility, targetId: bestTarget.id };
}
