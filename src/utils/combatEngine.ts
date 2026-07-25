import { CombatUnit, CombatStatus, Ability, Character, PlayerCharacterProgress, SaveState } from '../types';
import { INITIAL_CHARACTERS } from '../data/characters';
import { customAbilityHandlers, customSquadPassives, customDefeatHooks, customTurnStartHooks, activateCorsairPayout } from './combat/customKitLogic';

// Anti-Loop Bounds
const MAX_ASSIST_DEPTH = 10;
const MAX_COUNTER_DEPTH = 2;
const MAX_REVIVE_PER_UNIT = 2;
const MAX_CONSECUTIVE_BONUS_TURNS = 2;

export interface CombatEventLog {
  text: string;
  type: 'info' | 'damage' | 'heal' | 'buff' | 'debuff' | 'death' | 'turn' | 'summon' | 'ultimate';
  targetId?: string;
  sourceId?: string;
  amount?: number;
  isCrit?: boolean;
}

export interface CombatState {
  playerTeam: CombatUnit[];
  enemyTeam: CombatUnit[];
  activeUnitId: string | null;
  battleLog: CombatEventLog[];
  turnCount: number;
  battleSpeed: 1 | 2 | 4;
  isAuto: boolean;
  ended: boolean;
  winner: 'player' | 'enemy' | null;
  selectedTargetId: string | null;
  bonusTurnQueue: string[]; // unit IDs waiting for bonus turns
  consecutiveBonusCount: Record<string, number>;
  totalScore: number; // for Raids
  raidPhaseCurrent: number; // for raid pacing
  reviveCounts: Record<string, number>; // unit ID -> times revived
  conquestDataDisks?: string[];
  turnAttackers?: string[];
  dynamicState?: any;
  rewardNodeId?: string | null;
}

// Global Effect Handlers / central Registry description
export function createCombatUnit(
  char: Character,
  team: 'player' | 'enemy',
  pos: number,
  progress?: PlayerCharacterProgress
): CombatUnit {
  const isGl = char.tags.includes('Galactic Legend');
  
  // Base stats initialization
  let hp = char.baseStats.hp;
  let maxProtection = char.baseStats.protection;
  let offense = char.baseStats.offense;
  let defense = char.baseStats.defense;
  let speed = char.baseStats.speed;
  let level = 1;
  let stars = 1;
  let gearTier = 1;
  let relicLevel = 0;

  if (progress) {
    level = progress.level;
    stars = progress.stars;
    gearTier = progress.gearTier;
    relicLevel = progress.relicLevel;

    if (char.releaseState === 'era') {
      const eraLevel = progress.eraLevel || 1;
      if (eraLevel <= 10) { gearTier = 1; relicLevel = 0; }
      else if (eraLevel <= 25) { gearTier = 3; relicLevel = 0; }
      else if (eraLevel <= 50) { gearTier = 5; relicLevel = 0; }
      else if (eraLevel <= 75) { gearTier = 7; relicLevel = 0; }
      else if (eraLevel <= 100) { gearTier = 9; relicLevel = 0; }
      else if (eraLevel <= 125) { gearTier = 13; relicLevel = 1; }
      else if (eraLevel <= 150) { gearTier = 13; relicLevel = 3; }
      else if (eraLevel <= 175) { gearTier = 13; relicLevel = 5; }
      else { gearTier = 13; relicLevel = 7; }
    }

    // Progression scaling factors:
    // Star multiplier: 1★ = 1.0x, 7★ = 3.0x (+0.3 or +0.4 per star)
    const starMult = 1.0 + (stars - 1) * 0.40 + (stars >= 7 ? 0.6 : 0);
    
    // Level multiplier: +2.5% per level above level 1
    const levelMult = 1.0 + (level - 1) * 0.025;

    // Gear multiplier: +30% per gear tier above 1
    const gearMult = 1.0 + (gearTier - 1) * 0.30;

    // Relic multiplier: +50% per relic tier above 0
    const relicMult = 1.0 + relicLevel * 0.50;

    const aggregateMult = starMult * levelMult * gearMult * relicMult;

    hp = Math.round(hp * aggregateMult);
    maxProtection = Math.round(maxProtection * aggregateMult);
    offense = Math.round(offense * aggregateMult);
    // Defense gains from high gear and relics
    defense = Math.round(defense * (1.0 + (gearTier - 1) * 0.30 + relicLevel * 0.50));
    // Speed gains (+0.3 per level, +3 per gear tier, +5 per relic level)
    speed = speed + (level - 1) * 0.3 + (gearTier - 1) * 3.0 + relicLevel * 5.0;
  }

  return {
    id: `${char.id}_${team}_${pos}`,
    characterId: char.id,
    name: char.name,
    team,
    hp,
    maxHp: hp,
    protection: maxProtection,
    maxProtection,
    speed: Math.round(speed),
    turnMeter: 0,
    offense: Math.round(offense),
    defense: Math.round(defense),
    critChance: char.baseStats.critChance,
    critDamage: char.baseStats.critDamage,
    potency: char.baseStats.potency,
    tenacity: char.baseStats.tenacity,
    cooldowns: {},
    statuses: [],
    ultimateCharge: isGl ? 0 : undefined,
    activeInBattle: true,
    tags: [...char.tags],
    abilities: [...char.abilities],
    position: pos,
    level,
    stars,
    gearTier,
    relicLevel
  };
}

// Search for matching tags (e.g. 501st, Jedi, Rebel, Hutt Cartel, Droid, Mandalorian)
export function calculateDisplayStats(char: Character, progress?: PlayerCharacterProgress) {
  let hp = char.baseStats.hp;
  let maxProtection = char.baseStats.protection;
  let offense = char.baseStats.offense;
  let defense = char.baseStats.defense;
  let speed = char.baseStats.speed;
  
  let level = progress ? progress.level : 1;
  let stars = progress ? progress.stars : 1;
  let gearTier = progress ? progress.gearTier : 1;
  let relicLevel = progress ? progress.relicLevel : 0;

  if (progress && char.releaseState === 'era') {
    const eraLevel = progress.eraLevel || 1;
    if (eraLevel <= 10) { gearTier = 1; relicLevel = 0; }
    else if (eraLevel <= 25) { gearTier = 3; relicLevel = 0; }
    else if (eraLevel <= 50) { gearTier = 5; relicLevel = 0; }
    else if (eraLevel <= 75) { gearTier = 7; relicLevel = 0; }
    else if (eraLevel <= 100) { gearTier = 9; relicLevel = 0; }
    else if (eraLevel <= 125) { gearTier = 13; relicLevel = 1; }
    else if (eraLevel <= 150) { gearTier = 13; relicLevel = 3; }
    else if (eraLevel <= 175) { gearTier = 13; relicLevel = 5; }
    else { gearTier = 13; relicLevel = 7; }
  }

  const starMult = 1.0 + (stars - 1) * 0.40 + (stars >= 7 ? 0.6 : 0);
  const levelMult = 1.0 + (level - 1) * 0.025;
  const gearMult = 1.0 + (gearTier - 1) * 0.30;
  const relicMult = 1.0 + relicLevel * 0.50;

  const aggregateMult = starMult * levelMult * gearMult * relicMult;

  hp = Math.round(hp * aggregateMult);
  maxProtection = Math.round(maxProtection * aggregateMult);
  offense = Math.round(offense * aggregateMult);
  defense = Math.round(defense * (1.0 + (gearTier - 1) * 0.30 + relicLevel * 0.50));
  speed = Math.floor(speed + (level - 1) * 0.3 + (gearTier - 1) * 3.0 + relicLevel * 5.0);

  return { hp, maxProtection, offense, defense, speed, critChance: char.baseStats.critChance, critDamage: char.baseStats.critDamage, tenacity: char.baseStats.tenacity, potency: char.baseStats.potency };
}

export function checkHasTag(unit: CombatUnit, tag: string): boolean {
  return unit.tags.some(t => t.toLowerCase() === tag.toLowerCase());
}

import { STATUS_DEFINITIONS } from './statusRegistry';

// --- 501st and Custom Mechanics Helper Hooks ---

export function consumeMomentum(unit: CombatUnit, countToConsume: number) {
  const momentumStatus = unit.statuses.find(s => s.name === 'Momentum');
  if (momentumStatus) {
    const current = momentumStatus.count || 1;
    if (current <= countToConsume) {
       unit.statuses = unit.statuses.filter(s => s.name !== 'Momentum');
    } else {
       momentumStatus.count = current - countToConsume;
    }
  }
}

export function onFearApplied(state: CombatState, target: CombatUnit) {
  const oppSquad = target.team === 'player' ? state.enemyTeam : state.playerTeam;
  
  // 1) Commander Bacara Unique: Whenever an enemy gains Fear, Commander Bacara gains 5% Turn Meter.
  const bacara = oppSquad.find(u => u.characterId === 'commander_bacara' && u.activeInBattle && u.hp > 0);
  if (bacara && !hasStatusFlag(bacara, 'prevent_tm_gain')) {
     bacara.turnMeter = Math.min(100, bacara.turnMeter + 5);
     logBattleEvent(state, `⚔️ Overdisciplined Battalion: Commander Bacara gains 5% Turn Meter from enemy gaining Fear!`, 'buff');
  }

  // 2) Ki-Adi-Mundi Leader: Whenever an enemy gains Fear, Galactic Marine allies gain 5% Turn Meter.
  const kamLeader = oppSquad.find(u => u.characterId === 'ki_adi_mundi_journey' && u.position === 0 && u.activeInBattle && u.hp > 0);
  if (kamLeader) {
     oppSquad.forEach(u => {
        if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Galactic Marines') || checkHasTag(u, 'Galactic Marines')) && !hasStatusFlag(u, 'prevent_tm_gain')) {
           u.turnMeter = Math.min(100, u.turnMeter + 5);
           logBattleEvent(state, `🧠 The Cost Of Victory: ${u.name} gains 5% Turn Meter from enemy gaining Fear!`, 'buff');
        }
     });
  }

  // 3) Neyo Unique: Whenever an enemy gains Fear, all Galactic Marine allies recover 5% Health.
  const neyo = oppSquad.find(u => u.characterId === 'neyo' && u.activeInBattle && u.hp > 0);
  if (neyo) {
     oppSquad.forEach(u => {
        if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Galactic Marines') || checkHasTag(u, 'Galactic Marines'))) {
           const healAmt = Math.round(u.maxHp * 0.05);
           u.hp = Math.min(u.maxHp, u.hp + healAmt);
           logBattleEvent(state, `🛰️ Forward Observer: ${u.name} recovers 5% Health (${healAmt}) from enemy gaining Fear!`, 'heal');
        }
     });
  }
}

export function triggerFearedEnemyTurn(state: CombatState, enemy: CombatUnit) {
  const oppSquad = enemy.team === 'player' ? state.enemyTeam : state.playerTeam;
  const kam = oppSquad.find(u => u.characterId === 'ki_adi_mundi_journey' && u.activeInBattle && u.hp > 0);
  if (kam) {
     const hpLoss = Math.round(enemy.maxHp * 0.05);
     enemy.hp = Math.max(0, enemy.hp - hpLoss);
     logBattleEvent(state, `🧠 Acceptable Losses: Feared enemy ${enemy.name} loses 5% Max Health (${hpLoss}) at turn start!`, 'damage');
     if (enemy.hp === 0) {
        runDefeatHooks(state, enemy);
     }
  }

  const neyo = oppSquad.find(u => u.characterId === 'neyo' && u.activeInBattle && u.hp > 0);
  if (neyo) {
     applyStatus(state, neyo, 'Stealth', 1, false, neyo);
     logBattleEvent(state, `👤 Forward Observer: Neyo gains Stealth (1 turn)!`, 'buff');
  }
}

export function onCouncilGuidanceGained(state: CombatState, target: CombatUnit, countGained: number) {
  const allies = target.team === 'player' ? state.playerTeam : state.enemyTeam;

  // 1. Yoda leader Voice Of The Council: "Whenever an ally gains Council Guidance, they recover 3% Health and Protection."
  const lead = allies.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
  if (lead && lead.characterId === 'yoda') {
     target.hp = Math.min(target.maxHp, target.hp + Math.round(target.maxHp * 0.03 * countGained));
     if (!hasStatusFlag(target, 'prevent_prot_recovery')) {
        target.protection = Math.min(target.maxProtection, target.protection + Math.round(target.maxProtection * 0.03 * countGained));
     }
     logBattleEvent(state, `👑 Voice Of The Council: ${target.name} recovers 3% Health and Protection!`, 'heal');
  }

  // 2. Kenobi leader Last Hope Of The Republic: "Whenever an ally gains Council Guidance, they recover 5% Health and Protection."
  if (lead && lead.characterId === 'master_kenobi') {
     target.hp = Math.min(target.maxHp, target.hp + Math.round(target.maxHp * 0.05 * countGained));
     if (!hasStatusFlag(target, 'prevent_prot_recovery')) {
        target.protection = Math.min(target.maxProtection, target.protection + Math.round(target.maxProtection * 0.05 * countGained));
     }
     logBattleEvent(state, `👑 Last Hope Of The Republic: ${target.name} recovers 5% Health and Protection!`, 'heal');
  }

  // 3. Yoda unique Centuries Of Wisdom: "Whenever an ally gains Council Guidance, Grand Master Yoda gains 5% Turn Meter."
  const yoda = allies.find(u => u.characterId === 'yoda' && u.activeInBattle && u.hp > 0);
  if (yoda && !hasStatusFlag(yoda, 'prevent_tm_gain')) {
     yoda.turnMeter = Math.min(100, yoda.turnMeter + 5 * countGained);
     logBattleEvent(state, `🔮 Centuries Of Wisdom: Grand Master Yoda gains ${5 * countGained}% Turn Meter!`, 'buff');
  }

  // 4. Luminara unique Compassionate Master: "Whenever an ally gains Council Guidance, they recover 5% Health."
  const lumi = allies.find(u => u.characterId === 'luminara_unduli' && u.activeInBattle && u.hp > 0);
  if (lumi) {
     target.hp = Math.min(target.maxHp, target.hp + Math.round(target.maxHp * 0.05 * countGained));
     logBattleEvent(state, `💖 Compassionate Master (Luminara): ${target.name} recovers 5% Health!`, 'heal');
  }

  // 5. Yaddle unique Voice Of Serenity: "Whenever an ally gains Council Guidance, they recover 5% Health."
  const yaddle = allies.find(u => u.characterId === 'yaddle' && u.activeInBattle && u.hp > 0);
  if (yaddle) {
     target.hp = Math.min(target.maxHp, target.hp + Math.round(target.maxHp * 0.05 * countGained));
     logBattleEvent(state, `⏳ Voice Of Serenity (Yaddle): ${target.name} recovers 5% Health!`, 'heal');
  }

  // 6. Oppo unique Master Strategist: "Whenever an ally gains Council Guidance, Oppo gains 5% Turn Meter."
  const oppo = allies.find(u => u.characterId === 'oppo_rancisis' && u.activeInBattle && u.hp > 0);
  if (oppo && !hasStatusFlag(oppo, 'prevent_tm_gain')) {
     oppo.turnMeter = Math.min(100, oppo.turnMeter + 5 * countGained);
     logBattleEvent(state, `🐚 Master Strategist: Oppo Rancisis gains ${5 * countGained}% Turn Meter!`, 'buff');
  }

  // 7. Aayla unique Grace In Motion: "Whenever Aayla gains Council Guidance, gain 10% Turn Meter."
  if (target.characterId === 'aayla_secura' && !hasStatusFlag(target, 'prevent_tm_gain')) {
     target.turnMeter = Math.min(100, target.turnMeter + 10 * countGained);
     logBattleEvent(state, `🤸 Grace In Motion: Aayla Secura gains ${10 * countGained}% Turn Meter!`, 'buff');
  }

  // 8. Adi unique Decisive Action: "Whenever Adi gains Council Guidance, gain 10% Turn Meter."
  if (target.characterId === 'adi_gallia' && !hasStatusFlag(target, 'prevent_tm_gain')) {
     target.turnMeter = Math.min(100, target.turnMeter + 10 * countGained);
     logBattleEvent(state, `🤺 Decisive Action: Adi Gallia gains ${10 * countGained}% Turn Meter!`, 'buff');
  }

  // 9. Coleman unique Reserved Wisdom: "Whenever an ally gains Council Guidance, Coleman Kcaj recovers 3% Health and Protection."
  const coleman = allies.find(u => u.characterId === 'coleman_kcaj' && u.activeInBattle && u.hp > 0);
  if (coleman) {
     coleman.hp = Math.min(coleman.maxHp, coleman.hp + Math.round(coleman.maxHp * 0.03 * countGained));
     if (!hasStatusFlag(coleman, 'prevent_prot_recovery')) {
        coleman.protection = Math.min(coleman.maxProtection, coleman.protection + Math.round(coleman.maxProtection * 0.03 * countGained));
     }
     logBattleEvent(state, `🧠 Reserved Wisdom: Coleman Kcaj recovers 3% Health and Protection!`, 'heal');
  }
}

export function onCouncilGuidanceConsumed(state: CombatState, unit: CombatUnit) {
  const allies = unit.team === 'player' ? state.playerTeam : state.enemyTeam;

  // 1. Yoda unique Centuries Of Wisdom: "Whenever a Jedi High Council ally consumes Council Guidance, Grand Master Yoda gains Foresight (1 turn)."
  if (unit.tags.includes('Jedi High Council') || checkHasTag(unit, 'Jedi High Council')) {
     const yoda = allies.find(u => u.characterId === 'yoda' && u.activeInBattle && u.hp > 0);
     if (yoda) {
        applyStatus(state, yoda, 'Foresight', 1, false, unit);
        logBattleEvent(state, `🔮 Centuries Of Wisdom: Grand Master Yoda gains Foresight!`, 'buff');
     }
  }

  // 2. Kenobi Leader/Unique: "Whenever an ally consumes Council Guidance, Master Kenobi gains 3% Ultimate Charge."
  const kenobi = allies.find(u => u.characterId === 'master_kenobi' && u.activeInBattle && u.hp > 0);
  if (kenobi && kenobi.ultimateCharge !== undefined) {
     kenobi.ultimateCharge = Math.min(100, kenobi.ultimateCharge + 3);
     logBattleEvent(state, `⚔️ Last Hope of the Republic: Master Kenobi gains 3% Ultimate Charge! (${kenobi.ultimateCharge}%)`, 'buff');
  }

  // 3. Kenobi Unique Master of Soresu: "Whenever Master Kenobi consumes Council Guidance, gain 10% Defense (stacking)."
  if (unit.characterId === 'master_kenobi') {
     unit.defense = (unit.defense || 50) + 10;
     logBattleEvent(state, `🛡️ Master of Soresu: Master Kenobi gains +10 Defense! Stacking.`, 'buff');
  }

  // 4. Luminara unique Compassionate Master: "Whenever an ally consumes Council Guidance, they recover 5% Health and Protection."
  const lumi = allies.find(u => u.characterId === 'luminara_unduli' && u.activeInBattle && u.hp > 0);
  if (lumi) {
     unit.hp = Math.min(unit.maxHp, unit.hp + Math.round(unit.maxHp * 0.05));
     if (!hasStatusFlag(unit, 'prevent_prot_recovery')) {
        unit.protection = Math.min(unit.maxProtection, unit.protection + Math.round(unit.maxProtection * 0.05));
     }
     logBattleEvent(state, `💖 Compassionate Master (Luminara): ${unit.name} recovers 5% Health and Protection!`, 'heal');
  }

  // 5. Yaddle unique Voice Of Serenity: "Whenever an ally consumes Council Guidance, Yaddle gains 5% Turn Meter."
  const yaddle = allies.find(u => u.characterId === 'yaddle' && u.activeInBattle && u.hp > 0);
  if (yaddle && !hasStatusFlag(yaddle, 'prevent_tm_gain')) {
     yaddle.turnMeter = Math.min(100, yaddle.turnMeter + 5);
     logBattleEvent(state, `⏳ Voice Of Serenity: Yaddle gains 5% Turn Meter!`, 'buff');
  }

  // 6. Oppo unique Master Strategist: "Whenever an ally consumes Council Guidance, Oppo gains Defense Up (1 turn)."
  const oppo = allies.find(u => u.characterId === 'oppo_rancisis' && u.activeInBattle && u.hp > 0);
  if (oppo) {
     applyStatus(state, oppo, 'Defense Up', 1, false, unit);
  }

  // 7. Aayla unique Grace In Motion: "Whenever Aayla consumes Council Guidance, gain Offense Up (2 turns)."
  if (unit.characterId === 'aayla_secura') {
     applyStatus(state, unit, 'Offense Up', 2, false, unit);
  }

  // 8. Adi unique Decisive Action: "Whenever Adi consumes Council Guidance, gain Critical Chance Up (2 turns)."
  if (unit.characterId === 'adi_gallia') {
     applyStatus(state, unit, 'Critical Chance Up', 2, false, unit);
  }

  // 9. Coleman unique Reserved Wisdom: "Whenever an ally consumes Council Guidance, reduce Coleman Kcaj's cooldowns by 1."
  const coleman = allies.find(u => u.characterId === 'coleman_kcaj' && u.activeInBattle && u.hp > 0);
  if (coleman) {
     Object.keys(coleman.cooldowns).forEach(key => {
        if (coleman.cooldowns[key] > 0) {
           coleman.cooldowns[key]--;
        }
     });
     logBattleEvent(state, `🧠 Reserved Wisdom: Coleman Kcaj's cooldowns reduced by 1!`, 'buff');
  }

  // 10. Coleman unique Future Foretold: "The first time each Jedi High Council ally consumes Council Guidance, they recover 10% Health and Protection."
  if (coleman && (unit.tags.includes('Jedi High Council') || checkHasTag(unit, 'Jedi High Council'))) {
     unit.hp = Math.min(unit.maxHp, unit.hp + Math.round(unit.maxHp * 0.10));
     if (!hasStatusFlag(unit, 'prevent_prot_recovery')) {
        unit.protection = Math.min(unit.maxProtection, unit.protection + Math.round(unit.maxProtection * 0.10));
     }
     logBattleEvent(state, `🔮 Future Foretold: ${unit.name} recovers 10% Health and Protection!`, 'heal');
   }
}

export function onGuardianResolveGained(state: CombatState, target: CombatUnit, countGained: number) {
  const resolveStatus = target.statuses.find(s => s.name === "Guardian's Resolve");
  if (resolveStatus && resolveStatus.count >= 10) {
     // Clear stacks
     target.statuses = target.statuses.filter(s => s.name !== "Guardian's Resolve");
     target.hp = Math.min(target.maxHp, target.hp + Math.round(target.maxHp * 0.20));
     if (!hasStatusFlag(target, 'prevent_prot_recovery')) {
        target.protection = Math.min(target.maxProtection, target.protection + Math.round(target.maxProtection * 0.20));
     }
     logBattleEvent(state, `🛡️ Temple Protector: Guardian's Resolve reaches 10 stacks! ${target.name} recovers 20% Health and Protection and releases all stacks.`, 'heal');
  }
}

export function onInvestigationRemoved(state: CombatState, enemy: CombatUnit, attacker: CombatUnit | null) {
  const allies = enemy.team === 'player' ? state.enemyTeam : state.playerTeam;
  const quinlan = allies.find(u => u.characterId === 'quinlan_vos' && u.activeInBattle && u.hp > 0);
  if (quinlan) {
     logBattleEvent(state, `🕵️ Unorthodox Jedi: Quinlan Vos gains Offense Up (2 turns) from target losing Investigation!`, 'buff');
     applyStatus(state, quinlan, 'Offense Up', 2, false, quinlan);
  }
  const jocasta = allies.find(u => u.characterId === 'jocasta_nu' && u.activeInBattle && u.hp > 0);
  if (jocasta && !hasStatusFlag(jocasta, 'prevent_tm_gain')) {
     jocasta.turnMeter = Math.min(100, jocasta.turnMeter + 10);
     logBattleEvent(state, `📚 Keeper Of The Archives: Jocasta Nu gains 10% Turn Meter from target losing Investigation!`, 'heal');
  }
}

export function triggerImaGunDiHealthLoss(state: CombatState, unit: CombatUnit) {
  if (unit.characterId === 'ima_gun_di' && unit.activeInBattle && unit.hp > 0) {
     if (!unit.dynamicState) unit.dynamicState = {};
     if (unit.hp < unit.maxHp * 0.5 && !unit.dynamicState.hasDroppedBelow50) {
         unit.dynamicState.hasDroppedBelow50 = true;
         const allies = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
         allies.forEach(a => {
            if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Clone Trooper') || checkHasTag(a, 'Clone Trooper'))) {
               if (!hasStatusFlag(a, 'prevent_tm_gain')) {
                  a.turnMeter = 100;
               }
               applyStatus(state, a, 'Offense Up', 2, false, unit);
               logBattleEvent(state, `🛡️ There Is Still Hope: Clone Trooper ally ${a.name} gains 100% TM and Offense Up!`, 'buff');
            }
         });
     }
  }
}

export function checkPathfinderToFatigued(state: CombatState, unit: CombatUnit) {
  if (!unit.activeInBattle || unit.hp <= 0) return;
  if (unit.protection <= 0 && unit.statuses.some(s => s.name === 'Pathfinder')) {
     // Remove Pathfinder
     unit.statuses = unit.statuses.filter(s => s.name !== 'Pathfinder');
     
     // Check if any other active allies remain
     const allies = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
     const otherActiveAllies = allies.filter(a => a.id !== unit.id && a.activeInBattle && a.hp > 0);
     
     if (otherActiveAllies.length === 0) {
        logBattleEvent(state, `💀 Pathfinder fails on ${unit.name} because no other active allies remain!`, 'info');
        unit.hp = 0;
        unit.activeInBattle = false;
        runDefeatHooks(state, unit);
     } else {
        logBattleEvent(state, `😴 Pathfinder triggered! ${unit.name} removes Pathfinder and is now FATIGUED (Incapacitated for 3 turns).`, 'info');
        applyStatus(state, unit, 'Fatigued', 3, true); // duration: 3 turns

        // Appo Unique: "If Leader ally becomes Fatigued: Appo gains Bonus Turn."
        const isLeaderUnit = unit.characterId === 'general_skywalker' || unit.characterId === 'captain_rex';
        if (isLeaderUnit) {
          const appo = allies.find(u => u.characterId === 'appo_501st' && u.activeInBattle && u.hp > 0);
          if (appo) {
            appo.turnMeter = 100;
            logBattleEvent(state, `⚡ Right Hand of the General: Appo gains a Bonus Turn (Leader became Fatigued)!`, 'buff');
          }

          // Ahsoka unique: Whenever General Skywalker becomes Fatigued: Ahsoka gains his Bonus Turn.
          if (unit.characterId === 'general_skywalker') {
            const ahsoka = allies.find(u => u.characterId === 'ahsoka_clone_wars' && u.activeInBattle && u.hp > 0);
            if (ahsoka) {
              ahsoka.turnMeter = 100;
              logBattleEvent(state, `⚡ Snips No Longer: Ahsoka gains a Bonus Turn (GAS became Fatigued)!`, 'buff');
            }
          }
        }
     }
  }
}

export function onMomentumGained(state: CombatState, unit: CombatUnit, countGained: number) {
  if (!unit.activeInBattle || unit.hp <= 0) return;

  // Track dynamic gains
  if (!unit.dynamicState) unit.dynamicState = {};
  unit.dynamicState.momentumGainedCount = (unit.dynamicState.momentumGainedCount || 0) + countGained;

  // Rex Veteran Commander
  if (unit.characterId === 'captain_rex') {
     unit.critDamage += 0.01 * countGained;
     logBattleEvent(state, `📈 For the 501st: Rex gains +${countGained}% Critical Damage!`, 'buff');
  } 
  // Echo living databank
  else if (unit.characterId === 'echo_501st') {
     unit.potency += 0.02 * countGained;
     logBattleEvent(state, `📈 Living Databank: Echo gains +${countGained * 2}% Potency!`, 'buff');
  } 
  // Appo
  else if (unit.characterId === 'appo_501st') {
     unit.offense *= (1 + 0.02 * countGained);
     logBattleEvent(state, `📈 Right Hand of the General: Appo gains +${countGained * 2}% Offense!`, 'buff');
  }

  // Ahsoka unique: recovers 2% protection when gaining momentum
  if (unit.characterId === 'ahsoka_clone_wars') {
     if (!hasStatusFlag(unit, 'prevent_prot_recovery')) {
       const rec = Math.round(unit.maxProtection * 0.02 * countGained);
       unit.protection = Math.min(unit.maxProtection, unit.protection + rec);
       logBattleEvent(state, `💚 Snips No Longer: Ahsoka recovers ${rec} Protection from gaining Momentum`, 'heal');
     }
  }

  const allies = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
  const leader = allies.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);

  // Rex leader trigger
  if (leader && leader.characterId === 'captain_rex' && checkHasTag(unit, '501st')) {
     allies.forEach(a => {
       if (checkHasTag(a, '501st') && a.activeInBattle && a.hp > 0 && !hasStatusFlag(a, 'prevent_prot_recovery')) {
          const rec = Math.round(a.maxProtection * 0.02 * countGained);
          a.protection = Math.min(a.maxProtection, a.protection + rec);
          logBattleEvent(state, `💚 Pathfinder Commander: ${a.name} recovers ${rec} Protection (501st Momentum gain)`, 'heal');
       }
     });
  }

  // General Skywalker leader trigger: 501st ally gains Momentum -> gains 2% Turn Meter
  if (leader && leader.characterId === 'general_skywalker' && checkHasTag(unit, '501st')) {
     allies.forEach(a => {
       if (checkHasTag(a, '501st') && a.activeInBattle && a.hp > 0 && !hasStatusFlag(a, 'prevent_tm_gain')) {
          a.turnMeter = Math.min(100, a.turnMeter + (2 * countGained));
          logBattleEvent(state, `📈 General of the 501st: ${a.name} gains ${2 * countGained}% Turn Meter!`, 'buff');
       }
     });
  }

  // General Skywalker Unique trigger: Whenever another 501st ally gains Momentum, GS gains Momentum.
  if (checkHasTag(unit, '501st') && unit.characterId !== 'general_skywalker') {
     const gas = allies.find(u => u.characterId === 'general_skywalker' && u.activeInBattle && u.hp > 0);
     if (gas) {
        logBattleEvent(state, `⚡ Hero of the Republic: General Skywalker gains Momentum from ${unit.name}'s Momentum gain!`, 'info');
        applyStatus(state, gas, 'Momentum', 99, false, null, countGained);
     }
  }

  // Jesse unique CD Up trigger
  if (unit.characterId === 'jesse') {
     const momentum = unit.statuses.find(s => s.name === 'Momentum');
     const momentumCount = momentum ? (momentum.count || 1) : 0;
     if (momentumCount >= 10) {
        applyStatus(state, unit, 'Critical Damage Up', 2, false);
     }
  }
}

export function onSpecialAbilityUsed(state: CombatState, unit: CombatUnit) {
  const allies = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
  const leader = allies.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);

  if (checkHasTag(unit, 'Knightfall') || unit.tags.includes('Knightfall')) {
      const lv = allies.find(u => u.characterId === 'gl_lord_vader' && u.activeInBattle && u.hp > 0);
      if (lv && !hasStatusFlag(lv, 'prevent_tm_gain')) {
          lv.turnMeter = Math.min(100, lv.turnMeter + 5);
      }
  }
  if (checkHasTag(unit, '501st') || unit.tags.includes('501st')) {
      const appo = allies.find(u => u.characterId === 'appo_501st' && u.activeInBattle && u.hp > 0 && u.id !== unit.id);
      if (appo) applyStatus(state, appo, 'Momentum', 1, false, appo, 1);
  }


  if (unit.tags.includes('Bad Batch') || checkHasTag(unit, 'Bad Batch')) {
     const leader = allies.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
     if (leader && leader.characterId === 'hunter') {
         allies.forEach(a => {
            if ((a.tags.includes('Bad Batch') || checkHasTag(a, 'Bad Batch')) && a.activeInBattle && a.hp > 0) {
                a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.03));
                if (!hasStatusFlag(a, 'prevent_prot_recovery')) {
                    a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.03));
                }
            }
         });
         logBattleEvent(state, `🛡️ Sergeant Of Clone Force 99: Bad Batch allies recover 3% Health and Protection!`, 'heal');
     }
     
  if (unit.characterId === 'omega') {
      const batcher = allies.find(u => u.characterId === 'batcher' && u.activeInBattle && u.hp > 0);
      if (batcher) {
          const enemies = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
          const targetable = enemies.filter(e => e.activeInBattle && e.hp > 0);
          if (targetable.length > 0) {
              const target = targetable.sort((a,b) => a.hp - b.hp)[0]; // target weakest
              logBattleEvent(state, `🐺 Faithful Companion: Batcher assists Omega!`, 'info');
              const basic = batcher.abilities.find(a => a.type === 'basic');
              if (basic) executeCombatAction(state, batcher.id, basic, target.id, undefined, 1, 0);
          }
      }
  }

     const omega = allies.find(u => u.characterId === 'omega' && u.activeInBattle && u.hp > 0);
     if (omega && !hasStatusFlag(omega, 'prevent_tm_gain')) { omega.turnMeter = Math.min(100, omega.turnMeter + 5); }

  }


  // Jedi Guardian / High Council Segment
  if (unit.tags.includes('Jedi Guardian') || unit.tags.includes('Jedi') || checkHasTag(unit, 'Jedi Guardian')) {
     const agen = allies.find(u => u.characterId === 'agen_kolar' && u.activeInBattle && u.hp > 0);
     if (agen && Math.random() < 0.10) {
        const enemies = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
        const targetable = enemies.filter(e => e.activeInBattle && e.hp > 0 && !e.statuses.some(s => s.name === 'Investigation'));
        if (targetable.length > 0) {
           targetable.sort((a, b) => b.hp - a.hp);
           logBattleEvent(state, `🛡️ Guardian of the Chancellor: Agen Kolar's presence triggers! Inflicting Investigation on ${targetable[0].name}`, 'info');
           applyStatus(state, targetable[0], 'Investigation', 2, true, agen);
         }
      }
   }

  // Yoda unique Centuries Of Wisdom: "Whenever Grand Master Yoda uses a Special Ability, a random Jedi High Council ally gains Council Guidance."
  if (unit.characterId === 'yoda') {
     const eligible = allies.filter(a => a.activeInBattle && a.hp > 0 && (a.tags.includes('Jedi High Council') || checkHasTag(a, 'Jedi High Council')));
     if (eligible.length > 0) {
        const chosen = eligible[Math.floor(Math.random() * eligible.length)];
        applyStatus(state, chosen, 'Council Guidance', 99, false, unit);
        logBattleEvent(state, `🔮 Centuries Of Wisdom: Grand Master Yoda grants Council Guidance to ${chosen.name}!`, 'buff');
     }
  }

  // Yaddle unique Voice Of Serenity: "Whenever Yaddle uses a Special Ability, a random ally gains Council Guidance."
  if (unit.characterId === 'yaddle') {
     const eligible = allies.filter(a => a.activeInBattle && a.hp > 0);
     if (eligible.length > 0) {
        const chosen = eligible[Math.floor(Math.random() * eligible.length)];
        applyStatus(state, chosen, 'Council Guidance', 99, false, unit);
        logBattleEvent(state, `⏳ Voice Of Serenity: Yaddle grants Council Guidance to random ally ${chosen.name}!`, 'buff');
     }
  }

  // Coleman Kcaj unique Reserved Wisdom: "Whenever Coleman Kcaj uses a Special Ability, a random Jedi High Council ally gains Council Guidance."
  if (unit.characterId === 'coleman_kcaj') {
     const eligible = allies.filter(a => a.activeInBattle && a.hp > 0 && (a.tags.includes('Jedi High Council') || checkHasTag(a, 'Jedi High Council')));
     if (eligible.length > 0) {
        const chosen = eligible[Math.floor(Math.random() * eligible.length)];
        applyStatus(state, chosen, 'Council Guidance', 99, false, unit);
        logBattleEvent(state, `🧠 Reserved Wisdom: Coleman Kcaj grants Council Guidance to random Jedi High Council ally ${chosen.name}!`, 'buff');
     }
  }

  // Adi Gallia unique: Whenever a High Council ally uses a Special Ability, she gains 5% Turn Meter
  if (unit.tags.includes('High Council') || unit.tags.includes('Jedi High Council') || checkHasTag(unit, 'Jedi High Council')) {
     const adi = allies.find(u => u.characterId === 'adi_gallia' && u.activeInBattle && u.hp > 0);
     if (adi && !hasStatusFlag(adi, 'prevent_tm_gain')) {
        adi.turnMeter = Math.min(100, adi.turnMeter + 5);
        logBattleEvent(state, `👑 Council Authority: Adi Gallia gains 5% Turn Meter from High Council ally using Special!`, 'buff');
     }
  }

  // 1. 212th Segment
  if (checkHasTag(unit, '212th')) {
     logBattleEvent(state, `⚔️ 212th Special: ${unit.name} triggers "Combined Arms" stack gain!`, 'info');
     applyStatus(state, unit, 'Combined Arms', 99, false, null, 1);
  }

  // 2. 501st Segment
  if (checkHasTag(unit, '501st')) {
     // Leader mechanics: Rex or General Skywalker leader grants Momentum when using Special
     if (leader && (leader.characterId === 'captain_rex' || leader.characterId === 'general_skywalker') && leader.activeInBattle && leader.hp > 0) {
        logBattleEvent(state, `👑 Leader Passive: ${unit.name} gains Momentum from using Special!`, 'info');
        applyStatus(state, unit, 'Momentum', 99, false, null, 1);
     }

     // Unique passive triggers for other characters when any ally uses a Special
     allies.forEach(a => {
       if (a.id === unit.id || !a.activeInBattle || a.hp <= 0) return;

       if (a.characterId === 'captain_rex') {
          if (!hasStatusFlag(a, 'prevent_tm_gain')) {
             a.turnMeter = Math.min(100, a.turnMeter + 5);
             logBattleEvent(state, `📈 For the 501st: Rex gains 5% Turn Meter!`, 'buff');
          }
       } else if (a.characterId === 'echo_501st') {
          logBattleEvent(state, `⚡ Living Databank: Echo gains Momentum!`, 'info');
          applyStatus(state, a, 'Momentum', 99, false, null, 1);
       } else if (a.characterId === 'appo_501st') {
          logBattleEvent(state, `⚡ Right Hand of the General: Appo gains Momentum!`, 'info');
          applyStatus(state, a, 'Momentum', 99, false, null, 1);
       } else if (a.characterId === 'ahsoka_clone_wars') {
          logBattleEvent(state, `⚡ Snips No Longer: Ahsoka gains Momentum!`, 'info');
          applyStatus(state, a, 'Momentum', 99, false, null, 1);
       }
     });
  }
}

// Core helper to retrieve Status stats
export function getModifiedStats(unit: CombatUnit, teamUnits?: CombatUnit[]): { speed: number, offense: number, defense: number, critChance: number, critDamage: number, tenacity: number, potency: number } {
  let speed = unit.speed;
  let offense = unit.offense;
  let defense = unit.defense;
  let critChance = unit.critChance;
  let critDamage = unit.critDamage;
  let tenacity = unit.tenacity;
  let potency = unit.potency;

  // Apply status multipliers
  unit.statuses.forEach(status => {
    const def = STATUS_DEFINITIONS[status.name];
    if (def && def.statModifiers) {
      const count = status.count || 1;
      // Some modifiers scale with count (Purge, Frostbite), others do not.
      // Usually only 'purge' and 'frostbite' scale. Let's do it generally:
      if (def.statModifiers.speed) speed *= Math.pow(def.statModifiers.speed, (def.stackLimit > 1 ? count : 1));
      if (def.statModifiers.offense) offense *= Math.pow(def.statModifiers.offense, (def.stackLimit > 1 ? count : 1));
      if (def.statModifiers.defense) defense *= Math.pow(def.statModifiers.defense, (def.stackLimit > 1 ? count : 1));
      
      if (def.statModifiers.speedAdd) speed += def.statModifiers.speedAdd * (def.stackLimit > 1 ? count : 1);
      
      if (def.statModifiers.tenacity) tenacity += def.statModifiers.tenacity * (def.stackLimit > 1 && status.name !== 'Tenacity Down' && status.name !== 'Tenacity Up' ? count : 1);
      if (def.statModifiers.potency) potency += def.statModifiers.potency * (def.stackLimit > 1 ? count : 1);
      
      if (def.statModifiers.critChance) critChance += def.statModifiers.critChance * (def.stackLimit > 1 ? count : 1);
      if (def.statModifiers.critDamage) critDamage += def.statModifiers.critDamage * (def.stackLimit > 1 ? count : 1);
    }
  });

  const order66 = unit.statuses.find(s => s.name === 'Order 66');
  if (order66 && (order66.count || 1) >= 5) {
     tenacity = Math.max(0, tenacity - 0.20);
  }

  if (teamUnits && (unit.tags.includes('Galactic Marines') || checkHasTag(unit, 'Galactic Marines'))) {
     const kam = teamUnits.find(u => u.characterId === 'ki_adi_mundi_journey' && u.activeInBattle && u.hp > 0);
     if (kam) {
        critDamage += 0.20;
     }
  }

  // General Skywalker unique dynamic defense scaling
  if (unit.characterId === 'general_skywalker') {
    const momentum = unit.statuses.find(s => s.name === 'Momentum');
    const momentumCount = momentum ? (momentum.count || 1) : 0;
    if (momentumCount >= 10) {
       defense *= 1.25;
     }
  }

  // Fox unique: Whenever Fox is Taunting, Coruscant Guard allies gain 10% Defense
  if (checkHasTag(unit, 'Coruscant Guard') && teamUnits) {
     const fox = teamUnits.find(u => u.characterId === 'commander_fox_riot' && u.activeInBattle && u.hp > 0 && hasStatusFlag(u, 'Taunt'));
     if (fox) {
        defense *= 1.10;
     }
  }

  // Wolfpack Heavy unique Covering Position: Whenever Wolfpack Heavy has Taunt, Wolfpack allies gain 15% Defense.
  if (checkHasTag(unit, 'Wolfpack') && teamUnits) {
     const heavy = teamUnits.find(u => u.characterId === 'wp_heavy' && u.activeInBattle && u.hp > 0 && hasStatusFlag(u, 'Taunt'));
     if (heavy) {
        defense *= 1.15;
     }
  }

  // ISB Character Passives:
  if (unit.characterId === 'death_trooper' && teamUnits) {
    const isbCount = teamUnits.filter(u => u.activeInBattle && u.hp > 0 && (u.tags.includes('ISB') || checkHasTag(u, 'ISB'))).length;
    offense = Math.round(offense * (1 + 0.20 * isbCount));
  }

  if (unit.characterId === 'death_trooper_reinforcement') {
    offense = Math.round(offense * 1.25);
  }

  if (teamUnits && (unit.tags.includes('ISB') || checkHasTag(unit, 'ISB'))) {
    const yularen = teamUnits.find(u => u.characterId === 'colonel_yularen' && u.activeInBattle && u.hp > 0);
    if (yularen) {
      tenacity += 0.25;
    }
    const dedra = teamUnits.find(u => u.characterId === 'dedra_meero' && u.activeInBattle && u.hp > 0);
    if (dedra) {
      critChance += 0.15;
    }
  }

  // --- PIRATE CORSAIR PAYOUT STATS ---
  const isCorsair = unit.tags.includes('Corsair') || checkHasTag(unit, 'Corsair');
  if (isCorsair && teamUnits) {
     const ithano = teamUnits.find(u => u.characterId === 'captain_ithano' && u.activeInBattle && u.hp > 0);
     if (ithano && ithano.statuses.some(s => s.name === 'Payout')) {
        const corsairCount = teamUnits.filter(u => u.activeInBattle && u.hp > 0 && (u.tags.includes('Corsair') || checkHasTag(u, 'Corsair'))).length;
        offense *= (1 + 0.15 * corsairCount);
     }
  }

  if (unit.characterId === 'captain_ithano' && unit.statuses.some(s => s.name === 'Payout')) {
     speed += 40;
     critChance += 0.20;
  }

  if (unit.characterId === 'reveth' && unit.statuses.some(s => s.name === 'Payout')) {
     speed += 35;
  }

  if (unit.characterId === 'kix_conquest' && unit.statuses.some(s => s.name === 'Payout')) {
     speed += 25;
  }
  // --- END PIRATE CORSAIR PAYOUT STATS ---

  // Ensure stats don't drop below 0
  tenacity = Math.max(0, tenacity);
  potency = Math.max(0, potency);
  speed = Math.max(1, speed);

  return { speed, offense, defense, critChance, critDamage, tenacity, potency };
}

export function hasStatusFlag(unit: CombatUnit, flag: string): boolean {
  if (flag === 'counterattack' && unit.characterId === 'fives') {
    const momentum = unit.statuses.find(s => s.name === 'Momentum');
    const momentumCount = momentum ? (momentum.count || 1) : 0;
    if (momentumCount >= 10 && !unit.statuses.some(s => s.name === 'Fatigued')) {
       return true;
    }
  }

  return unit.statuses.some(s => {
    const def = STATUS_DEFINITIONS[s.name];
    if (def && def.flags && def.flags.includes(flag)) {
      return true;
    }
    return false;
  });
}

// Central helper to trigger status placement under Potency vs Tenacity rolls
export function applyStatus(state: CombatState, target: CombatUnit, name: string, duration: number, isDebuff: boolean, attacker: CombatUnit | null = null, count = 1, isDerived = false) {
  if (!target.activeInBattle || target.hp <= 0) return;
  
  if (name === 'Imperial Decree') {
      const oppSquad = target.team === 'player' ? state.enemyTeam : state.playerTeam;
      const starkiller = oppSquad.find(u => u.characterId === 'starkiller' && u.activeInBattle && u.hp > 0);
      if (starkiller) {
          starkiller.turnMeter = Math.min(100, starkiller.turnMeter + 15);
          logBattleEvent(state, `📈 Emperor's Wrath: Starkiller gains 15% Turn Meter!`, 'buff');
      }
      const mara = oppSquad.find(u => u.characterId === 'mara_jade' && u.activeInBattle && u.hp > 0);
      if (mara) {
          applyStatus(state, mara, 'Stealth', 1, false, attacker);
          applyStatus(state, mara, 'Critical Damage Up', 2, false, attacker);
          logBattleEvent(state, `👤 Emperor's Hand: Mara Jade gains Stealth and Critical Damage Up!`, 'buff');
      }
  }

  if (name === 'Order 66') {
      const oppTeam = target.team === 'player' ? state.enemyTeam : state.playerTeam;
      const kfc = oppTeam.find(u => u.characterId === 'knightfall_commander' && u.activeInBattle && u.hp > 0);
      if (kfc && !hasStatusFlag(kfc, 'prevent_prot_recovery')) {
          kfc.protection = Math.min(kfc.maxProtection, kfc.protection + Math.round(kfc.maxProtection * 0.03));
      }
      const appo = oppTeam.find(u => u.characterId === 'commander_appo' && u.activeInBattle && u.hp > 0 && u.position === 0);
      if (appo) {
          oppTeam.forEach(a => {
              if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Knightfall') || checkHasTag(a, 'Knightfall')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
                  a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.03));
              }
          });
      }
  }

  
  if (name === 'Burning') {
      const oppTeam = target.team === 'player' ? state.enemyTeam : state.playerTeam;
      const scorch = oppTeam.find(u => u.characterId === 'scorch_knightfall' && u.activeInBattle && u.hp > 0);
      if (scorch) {
          applyStatus(state, target, 'Order 66', 1, true, scorch, 1);
      }
  }

  
  if (name === 'Dramatic Entrance') {
      const team = target.team === 'player' ? state.playerTeam : state.enemyTeam;
      const appo = team.find(u => u.characterId === 'commander_appo' && u.activeInBattle && u.hp > 0);
      if (appo && !hasStatusFlag(appo, 'prevent_tm_gain')) {
          appo.turnMeter = Math.min(100, appo.turnMeter + 10);
      }
      const kfc = team.find(u => u.characterId === 'knightfall_commander' && u.activeInBattle && u.hp > 0);
      if (kfc) {
          applyStatus(state, kfc, 'Taunt', 1, false);
      }
      const scorch = team.find(u => u.characterId === 'scorch_knightfall' && u.activeInBattle && u.hp > 0);
      if (scorch) {
          scorch.offense = Math.round(scorch.offense * 1.20);
      }
  }

  
  if (name === 'Entrenched') {
      const teamSquad = target.team === 'player' ? state.playerTeam : state.enemyTeam;
      const voss = teamSquad.find(u => u.position === 0 && u.characterId === 'warlord_drake_voss' && u.activeInBattle && u.hp > 0);
      if (voss && (target.tags.includes('Morvek Survivor') || checkHasTag(target, 'Morvek Survivor'))) {
          target.hp = Math.min(target.maxHp, target.hp + Math.round(target.maxHp * 0.05));
      }
  }
  
  if (name === 'Frostbite') {
      const oppTeam = target.team === 'player' ? state.enemyTeam : state.playerTeam;
      const voren = oppTeam.find(u => u.position === 0 && u.characterId === 'commander_voren' && u.activeInBattle && u.hp > 0);
      if (voren) {
          oppTeam.forEach(a => {
              if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Avalanche Remnant') || checkHasTag(a, 'Avalanche Remnant')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
                  a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.02));
              }
          });
      }
      
      const glaze = oppTeam.find(u => u.characterId === 'glaze' && u.activeInBattle && u.hp > 0);
      if (glaze && !hasStatusFlag(glaze, 'prevent_tm_gain')) {
          glaze.turnMeter = Math.min(100, glaze.turnMeter + 5);
      }
      
      if (attacker && attacker.characterId === 'hail' && !hasStatusFlag(attacker, 'prevent_prot_recovery')) {
          attacker.protection = Math.min(attacker.maxProtection, attacker.protection + Math.round(attacker.maxProtection * 0.05));
      }
  }
  
  if (name === 'Healing Immunity') {
      const oppTeam = target.team === 'player' ? state.enemyTeam : state.playerTeam;
      const frostburn = oppTeam.find(u => u.characterId === 'frostburn' && u.activeInBattle && u.hp > 0);
      if (frostburn) {
          oppTeam.forEach(a => {
              if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Avalanche Remnant') || checkHasTag(a, 'Avalanche Remnant')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
                  a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.02));
              }
          });
      }
  }

  if (name === 'Dossier') {
      const oppTeam = target.team === 'player' ? state.enemyTeam : state.playerTeam;
      const krennicLead = oppTeam.find(u => u.characterId === 'director_krennic' && u.position === 0 && u.activeInBattle && u.hp > 0);
      const partagazLead = oppTeam.find(u => u.characterId === 'partagaz' && u.position === 0 && u.activeInBattle && u.hp > 0);
      if (krennicLead || partagazLead) {
          oppTeam.forEach(a => {
              if (a.activeInBattle && a.hp > 0 && (a.tags.includes('ISB') || checkHasTag(a, 'ISB')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
                  a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.03));
              }
          });
          const leadName = krennicLead ? 'Total Surveillance' : 'Imperial Oversight';
          logBattleEvent(state, `🛡️ ${leadName}: ISB allies recover 3% Protection from Dossier application!`, 'heal');
      }
  }

  if (name === 'Imperial Decree') {
     if (state && !state.dynamicState) {
        state.dynamicState = {};
     }
     
     const allBattleUnits = state ? [...state.playerTeam, ...state.enemyTeam] : [target];
     let removedPrevious = false;
     allBattleUnits.forEach(u => {
        if (u.id !== target.id && u.statuses.some(s => s.name === 'Imperial Decree')) {
           u.statuses = u.statuses.filter(s => s.name !== 'Imperial Decree');
           removedPrevious = true;
           logBattleEvent(state, `👑 Imperial Decree removed from ${u.name} (moved to ${target.name})`, 'info');
        }
     });

     const activeAllies = attacker 
       ? (attacker.team === 'player' ? state.playerTeam : state.enemyTeam)
       : (target.team === 'player' ? state.enemyTeam : state.playerTeam);

     const sidiousLead = activeAllies.find(u => u.characterId === 'gl_darth_sidious' && u.position === 0 && u.activeInBattle && u.hp > 0);
     if (sidiousLead) {
        activeAllies.forEach(u => {
           if (u.activeInBattle && u.hp > 0 && u.tags.includes('Emperors Hand') && !hasStatusFlag(u, 'prevent_tm_gain')) {
              u.turnMeter = Math.min(100, u.turnMeter + 10);
              logBattleEvent(state, `📈 Galactic Sovereign: ${u.name} gains 10% Turn Meter!`, 'buff');
           }
        });
     }
     const tarkinLead = activeAllies.find(u => u.characterId === 'grand_moff_tarkin' && u.position === 0 && u.activeInBattle && u.hp > 0);
     if (tarkinLead) {
        activeAllies.forEach(u => {
           if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Galactic Empire') || u.tags.includes('Empire')) && !hasStatusFlag(u, 'prevent_tm_gain')) {
              u.turnMeter = Math.min(100, u.turnMeter + 5);
              logBattleEvent(state, `📈 Doctrine Of Fear: ${u.name} gains 5% Turn Meter!`, 'buff');
           }
        });
     }
     const officer = activeAllies.find(u => u.characterId === 'imperial_officer' && u.activeInBattle && u.hp > 0);
     if (officer) {
        activeAllies.forEach(u => {
           if (u.activeInBattle && u.hp > 0 && u.tags.includes('Emperors Hand') && !hasStatusFlag(u, 'prevent_tm_gain')) {
              u.turnMeter = Math.min(100, u.turnMeter + 5);
              logBattleEvent(state, `📈 Flawless Coordination: ${u.name} gains 5% Turn Meter!`, 'buff');
           }
        });
     }

     if (state && !state.dynamicState.imperialDecreeGainedFirstTime) {
        state.dynamicState.imperialDecreeGainedFirstTime = true;
        const hasSidious = activeAllies.some(u => u.characterId === 'gl_darth_sidious' && u.activeInBattle && u.hp > 0);
        if (hasSidious) {
           applyStatus(state, target, 'Fear', 1, true, attacker);
           logBattleEvent(state, `😱 First Decree: ${target.name} is struck with Fear!`, 'debuff');
        }
     }
  }

  if (target.statuses.some(s => s.name === 'Overdisciplined')) {
    if (name === 'Fear' || name === 'Protection Up') {
      return;
    }
  }

  if (!isDebuff) {
    if (hasStatusFlag(target, 'prevent_buff') || target.statuses.some(s => s.name === 'Isolation')) {
      return; 
    }
  }

  // Anti-debuff immunities
  if (isDebuff && hasStatusFlag(target, 'tenacity_up') && name !== 'Order 66' && name !== 'Imperial Decree') {
    logBattleEvent(state, `${target.name} Resisted ${name} (Tenacity Up)`, 'info');
    return;
  }

  // Jet unique: While Jet is active, Galactic Republic allies are immune to Burning and Frostbite
  if (['Burning', 'Frostbite'].includes(name) && (target.tags.includes('Galactic Republic') || checkHasTag(target, 'Galactic Republic'))) {
    const allies = target.team === 'player' ? state.playerTeam : state.enemyTeam;
    const jetActive = allies.some(u => u.characterId === 'jet_marine' && u.activeInBattle && u.hp > 0);
    if (jetActive) {
      logBattleEvent(state, `🛡️ Flame Resistance: ${target.name} is immune to ${name} while Jet is active!`, 'info');
      return;
    }
  }

  // Bacara unique: Immune to Fear and Daze
  if (target.characterId === 'commander_bacara' && ['Fear', 'Daze'].includes(name)) {
    logBattleEvent(state, `🛡️ Cold-Hearted Executor: Bacara is immune to ${name}!`, 'info');
    return;
  }

  // Prevent ability block if immune
  if (name === 'Ability Block' && hasStatusFlag(target, 'immune_ability_block')) {
    return;
  }
  
  if (name === 'Stealth' && (hasStatusFlag(target, 'prevent_stealth') || target.statuses.some(s => s.name === 'Dossier'))) {
    logBattleEvent(state, `💨 Stealth BLOCKED: ${target.name} cannot gain Stealth!`, 'info');
    return;
  }

  // Custom immunology per specs
  if (target.characterId === 'master_kenobi') {
    if (['Ability Block', 'Healing Immunity'].includes(name)) return;
  }
  if (target.characterId === 'general_skywalker') {
    if (name === 'Ability Block') return;
  }
  if (target.characterId === 'jabba') {
    if (['Fear', 'Stun'].includes(name)) return;
  }
  if (target.characterId === 'eternal_fire_grievous') {
    if (['Fear', 'Stun', 'Healing Immunity'].includes(name)) return;
  }
  if (target.tags.includes('Boss') && name === 'Marked') {
    return;
  }
  
  if (name === 'Taunt') {
    target.statuses = target.statuses.filter(s => s.name !== 'Stealth');
  } else if (name === 'Stealth') {
    target.statuses = target.statuses.filter(s => s.name !== 'Taunt');
  }

  // LV Leader mechanics
  if (attacker && attacker.team && state) {
     const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
     const leader = squad.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
     if (leader && leader.characterId === 'gl_lord_vader' && !isDerived && checkHasTag(attacker, 'Knightfall')) {
        if (name === 'Order 66') {
           applyStatus(state, target, 'Purge', duration, true, attacker, count, true);
        } else if (name === 'Purge') {
           applyStatus(state, target, 'Order 66', duration, true, attacker, count, true);
        }
     }
     
     const lvAllies = squad.filter(u => u.characterId === 'gl_lord_vader');
     lvAllies.forEach(lv => {
         if (name === 'Order 66') {
             lv.offense *= (1 + (0.02 * count));
         } else if (name === 'Purge') {
             lv.critDamage += (0.02 * count);
         }
     });
  }

  // Potency/Tenacity Roll for Debuffs
  if (isDebuff && attacker && name !== 'Order 66' && name !== 'Imperial Decree') {
    const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
    const tarStats = getModifiedStats(target, target.team === 'player' ? state.playerTeam : state.enemyTeam);
    const resistChance = Math.min(0.85, Math.max(0.15, tarStats.tenacity - attStats.potency));
    if (Math.random() < resistChance) {
      logBattleEvent(state, `${target.name} Resisted ${name} (Resisted purely via Tenacity/Potency roll vs ${attStats.potency})`, 'info');
      
      // Yularen Unique: "Whenever an ISB ally resists a debuff, they gain 10% Turn Meter."
      if (target.tags.includes('ISB') || checkHasTag(target, 'ISB')) {
          const allies = target.team === 'player' ? state.playerTeam : state.enemyTeam;
          const yularen = allies.find(u => u.characterId === 'colonel_yularen' && u.activeInBattle && u.hp > 0);
          if (yularen && !hasStatusFlag(target, 'prevent_tm_gain')) {
              target.turnMeter = Math.min(100, target.turnMeter + 10);
              logBattleEvent(state, `🎖️ Master Coordinator: ${target.name} resisted a debuff! Yularen grants them 10% Turn Meter.`, 'buff');
          }
      }

      // Trigger Grand Inquisitor / Fourth Sister passive triggers
      if (attacker.team === 'player' && attacker.characterId === 'grand_inquisitor') {
        // Appends Purge on resist
        applyStatus(state, target, 'Purge', 3, true, attacker, 1);
      }
      return;
    }
  }

  // Handle evasions (Foresight consumes)
  if (isDebuff && target.statuses.some(s => s.name === 'Foresight')) {
    target.statuses = target.statuses.filter(s => s.name !== 'Foresight');
    logBattleEvent(state, `${target.name} Evaded using Foresight`, 'info');
    return;
  }

  // Stacking Status Rules
  const def = STATUS_DEFINITIONS[name];
  if (def && def.stackLimit > 1) {
    const existing = target.statuses.find(s => s.name === name);
    if (existing) {
      existing.duration = duration; // refresh
      const preCount = existing.count || 1;
      existing.count = Math.min(def.stackLimit, (existing.count || 1) + count);
      const countGained = existing.count - preCount;
      
      logBattleEvent(state, `${target.name} stacked ${name} (x${existing.count})`, isDebuff ? 'debuff' : 'buff');

      if (name === 'Frostbite' && preCount < 3 && existing.count >= 3) {
          const oppSquad = target.team === 'player' ? state.enemyTeam : state.playerTeam;
          const rime = oppSquad.find(u => u.characterId === 'captain_rime' && u.activeInBattle && u.hp > 0);
          if (rime && !hasStatusFlag(rime, 'prevent_tm_gain')) {
              rime.turnMeter = Math.min(100, rime.turnMeter + 10);
              logBattleEvent(state, `⏩ Captain Rime gains 10% TM (Enemy reached 3 Frostbite)!`, 'buff');
          }
      }

      if (name === 'Dossier' && preCount < 5 && existing.count >= 5) {
          onDossierReachedFive(state, target, attacker);
      }



      if (name === 'Momentum' && countGained > 0) {
         onMomentumGained(state, target, countGained);
      }

      if (name === 'Council Guidance' && countGained > 0) {
         onCouncilGuidanceGained(state, target, countGained);
      }

      if (name === "Guardian's Resolve" && countGained > 0) {
         onGuardianResolveGained(state, target, countGained);
      }

      if (name === 'Combined Arms' && countGained > 0 && checkHasTag(target, '212th')) {
         const allies = target.team === 'player' ? state.playerTeam : state.enemyTeam;
         const gk = allies.find(u => u.characterId === 'general_kenobi' && u.activeInBattle && u.hp > 0);
         if (gk) {
            const gkRec = Math.round(gk.maxProtection * 0.03);
            gk.protection = Math.min(gk.maxProtection, gk.protection + gkRec);
            logBattleEvent(state, `🛡️ General of the 212th: General Kenobi recovers ${gkRec} (3%) Protection from Combined Arms!`, 'heal');
         }
      }

      if (name === 'Order 66' && existing.count >= 10) {
         target.statuses = target.statuses.filter(s => s.name !== 'Order 66');
         applyStatus(state, target, 'Healing Immunity', 2, true, attacker, 1);
         applyStatus(state, target, 'Ability Block', 2, true, attacker, 1);
         applyStatus(state, target, 'Marked', 2, true, attacker, 1);
         logBattleEvent(state, `💀 ORDER 66 EXECUTED on ${target.name}!`, 'debuff');
      }
      
      return;
    }
  }

  if (name === 'Stealth' && target.characterId === 'quinlan_vos') {
     target.hp = Math.min(target.maxHp, target.hp + Math.round(target.maxHp * 0.10));
     if (!hasStatusFlag(target, 'prevent_prot_recovery')) {
        target.protection = Math.min(target.maxProtection, target.protection + Math.round(target.maxProtection * 0.10));
     }
     logBattleEvent(state, `🕵️ Master Of Disguises: Quinlan Vos recovers 10% Health and Protection!`, 'heal');
  }

  if (isDebuff) {
     // Ki-Adi-Mundi Unique: Dispel check
     if (target.tags.includes('Galactic Marines') || checkHasTag(target, 'Galactic Marines')) {
        const allies = target.team === 'player' ? state.playerTeam : state.enemyTeam;
        const kam = allies.find(u => u.characterId === 'ki_adi_mundi_journey' && u.activeInBattle && u.hp > 0);
        if (kam && Math.random() < 0.5) {
           logBattleEvent(state, `🧠 Unwavering Resolve: Ki-Adi-Mundi dispelled ${name} from ${target.name}!`, 'info');
           return;
        }
     }
  }

  if (!isDebuff) {
     if (target.tags.includes('Clone Trooper') || checkHasTag(target, 'Clone Trooper')) {
        const allies = target.team === 'player' ? state.playerTeam : state.enemyTeam;
        const leader = allies.find(u => u.position === 0 && u.characterId === 'ima_gun_di' && u.activeInBattle && u.hp > 0);
        if (leader) {
           target.hp = Math.min(target.maxHp, target.hp + Math.round(target.maxHp * 0.05));
           logBattleEvent(state, `🛡️ Last Defense Of Ryloth: ${target.name} recovers 5% Health from gaining a buff!`, 'heal');
        }
     }
  }

  // Deduplicate and Avoid infinite effects
  const existingEff = target.statuses.find(s => s.name === name);
  if (existingEff) {
    existingEff.duration = Math.max(existingEff.duration, duration);
    logBattleEvent(state, `${target.name} refreshed ${name} (${existingEff.duration} turns)`, isDebuff ? 'debuff' : 'buff');
    if (name === 'Fear') onFearApplied(state, target);
    if (isDebuff && attacker && attacker.characterId === 'neyo') {
       if (!hasStatusFlag(attacker, 'prevent_tm_gain')) {
          attacker.turnMeter = Math.min(100, attacker.turnMeter + 5);
          logBattleEvent(state, `🛰️ Forward Observer: Neyo inflicts a debuff! Gains 5% Turn Meter!`, 'buff');
       }
    }
    return;
  }

  // Standard additive status
  target.statuses.push({ name, duration, isDebuff, count });
  logBattleEvent(state, `${target.name} gained ${name} (${duration} turns)`, isDebuff ? 'debuff' : 'buff');
  if (name === 'Fear') onFearApplied(state, target);
  if (isDebuff && attacker && attacker.characterId === 'neyo') {
     if (!hasStatusFlag(attacker, 'prevent_tm_gain')) {
        attacker.turnMeter = Math.min(100, attacker.turnMeter + 5);
        logBattleEvent(state, `🛰️ Forward Observer: Neyo inflicts a debuff! Gains 5% Turn Meter!`, 'buff');
     }
  }

  // Ki-Adi-Mundi Unique: Whenever a Galactic Marines ally suffers a debuff, Ki-Adi-Mundi has a 50% chance to dispel it on them.
  if (isDebuff && (target.tags.includes('Galactic Marines') || checkHasTag(target, 'Galactic Marines'))) {
      const squad = target.team === 'player' ? state.playerTeam : state.enemyTeam;
      const kam = squad.find(u => u.characterId === 'ki_adi_mundi_journey' && u.activeInBattle && u.hp > 0);
      if (kam && Math.random() < 0.50) {
          target.statuses = target.statuses.filter(s => s.name !== name);
          logBattleEvent(state, `👑 Unwavering Resolve: Ki-Adi-Mundi dispelled ${name} from ${target.name}!`, 'heal');
      }
  }

  if (name === 'Dossier' && count >= 5) {
     onDossierReachedFive(state, target, attacker);
  }

  // Chief Chirpa Leader: "Whenever an Ewok gains a buff, gain 2% Turn Meter."
  if (!isDebuff && (checkHasTag(target, 'Ewok') || target.tags.includes('Ewok'))) {
      const squad = target.team === 'player' ? state.playerTeam : state.enemyTeam;
      const leader = squad.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
      if (leader && leader.characterId === 'chief_chirpa') {
          if (!hasStatusFlag(target, 'prevent_tm_gain')) {
              target.turnMeter = Math.min(100, target.turnMeter + 2);
          }
      }
  }

  // Hobbie Unique: "Whenever Marked Target gains a buff: Hobbie gains 10% Turn Meter."
  if (!isDebuff && target.statuses.some(s => s.name === 'Marked Target')) {
      const oppTeam = target.team === 'player' ? state.enemyTeam : state.playerTeam;
      const hobbie = oppTeam.find(u => u.characterId === 'hobbie_klivian' && u.activeInBattle && u.hp > 0);
      if (hobbie && !hasStatusFlag(hobbie, 'prevent_tm_gain')) {
          hobbie.turnMeter = Math.min(100, hobbie.turnMeter + 10);
          logBattleEvent(state, `📈 Melancholy Pilot: Marked Target gained a buff! Hobbie gains 10% Turn Meter.`, 'buff');
      }
  }

  // Hobbie Unique: "Whenever Hobbie inflicts a debuff: Recover 5% Protection."
  if (isDebuff && attacker && attacker.characterId === 'hobbie_klivian' && !hasStatusFlag(attacker, 'prevent_prot_recovery')) {
      const rec = Math.round(attacker.maxProtection * 0.05);
      attacker.protection = Math.min(attacker.maxProtection, attacker.protection + rec);
  }

  // Stealth Unique triggers:
  if (name === 'Stealth') {
      const oppTeam = target.team === 'player' ? state.enemyTeam : state.playerTeam;
      
      // Major Partagaz: "Whenever an enemy gains Stealth, Major Partagaz gains 10% Turn Meter."
      const partagaz = oppTeam.find(u => u.characterId === 'partagaz' && u.activeInBattle && u.hp > 0);
      if (partagaz && !hasStatusFlag(partagaz, 'prevent_tm_gain')) {
          partagaz.turnMeter = Math.min(100, partagaz.turnMeter + 10);
          logBattleEvent(state, `🕵️ Nothing Escapes Notice: Enemy gained Stealth! Major Partagaz gains 10% Turn Meter.`, 'buff');
      }
      
      // Probe Droid: "Whenever an enemy gains Stealth, Probe Droid gains 15% Turn Meter."
      const probe = oppTeam.find(u => u.characterId === 'probe_droid' && u.activeInBattle && u.hp > 0);
      if (probe && !hasStatusFlag(probe, 'prevent_tm_gain')) {
          probe.turnMeter = Math.min(100, probe.turnMeter + 15);
          logBattleEvent(state, `🤖 Constant Observation: Enemy gained Stealth! Probe Droid gains 15% Turn Meter.`, 'buff');
      }
  }

  // Partagaz Unique: "Whenever Major Partagaz inflicts a debuff, all ISB allies gain 2% Turn Meter."
  if (isDebuff && attacker && attacker.characterId === 'partagaz' && attacker.activeInBattle && attacker.hp > 0) {
      const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
      allies.forEach(a => {
          if (a.activeInBattle && a.hp > 0 && (a.tags.includes('ISB') || checkHasTag(a, 'ISB'))) {
              if (!hasStatusFlag(a, 'prevent_tm_gain')) {
                  a.turnMeter = Math.min(100, a.turnMeter + 2);
              }
          }
      });
      logBattleEvent(state, `🕵️ Nothing Escapes Notice: Major Partagaz inflicted a debuff! ISB allies gain 2% Turn Meter.`, 'buff');
  }

  if (name === 'Council Guidance') {
     onCouncilGuidanceGained(state, target, count);
  }

  // Paploo Trap: Tripwire
  if (name === 'Taunt') {
      const oppTeam = target.team === 'player' ? state.enemyTeam : state.playerTeam;
      const paploo = oppTeam.find(u => u.characterId === 'paploo' && u.activeInBattle && u.hp > 0);
      if (paploo && !paploo.dynamicState?.trapTriggered) {
          if (!paploo.dynamicState) paploo.dynamicState = {};
          paploo.dynamicState.trapTriggered = true;
          logBattleEvent(state, `🌳 TRAP SPRUNG: Tripwire! Enemy gained Taunt. Paploo intervenes!`, 'info');
          // Remove Taunt from that enemy
          const tIdx = target.statuses.findIndex(s => s.name === 'Taunt');
          if (tIdx !== -1) target.statuses.splice(tIdx, 1);
          
          if (!hasStatusFlag(paploo, 'prevent_tm_gain')) {
              paploo.turnMeter = 100;
          }
          // Immediately uses Stolen Speeder Bike
          executeCombatAction(state, paploo.id, paploo.abilities.find(a => a.id === 'paploo_s1') || paploo.abilities[0], target.id, undefined, 1, 0);
      }
  }

  if (name === "Guardian's Resolve") {
     onGuardianResolveGained(state, target, count);
  }

  // Jedi Guardian Status gains triggers
  if (name === 'Investigation' && target.team !== attacker?.team) {
     const allies = attacker ? (attacker.team === 'player' ? state.playerTeam : state.enemyTeam) : (target.team === 'player' ? state.enemyTeam : state.playerTeam);
     if (allies.length > 0) {
        // depa_lead (at position 0) / unique
        const depa = allies.find(u => u.characterId === 'depa_billaba' && u.activeInBattle && u.hp > 0);
        if (depa) {
           logBattleEvent(state, `👑 Follow the Winds: Depa Billaba gains 5% Turn Meter from enemy gaining Investigation!`, 'buff');
           if (!hasStatusFlag(depa, 'prevent_tm_gain')) {
              depa.turnMeter = Math.min(100, depa.turnMeter + 5);
           }
           
           if (depa.position === 0) {
              // Heal allies (and also protect recovery)
              allies.forEach(ally => {
                if (ally.activeInBattle && ally.hp > 0 && (ally.tags.includes('Jedi Guardian') || checkHasTag(ally, 'Jedi Guardian'))) {
                   const hRec = Math.round(ally.maxHp * 0.03);
                   const pRec = Math.round(ally.maxProtection * 0.03);
                   ally.hp = Math.min(ally.maxHp, ally.hp + hRec);
                   if (!hasStatusFlag(ally, 'prevent_prot_recovery')) {
                      ally.protection = Math.min(ally.maxProtection, ally.protection + pRec);
                   }
                }
              });
              logBattleEvent(state, `💖 Follow the Winds: Jedi Guardian allies recover 3% Health and Protection!`, 'heal');
           }
        }

        // windu_lead (at position 0) / unique
        const windu = allies.find(u => u.characterId === 'mace_windu' && u.activeInBattle && u.hp > 0);
        if (windu) {
           // Unique: 5% offense stacking
           windu.offense = Math.round(windu.offense * 1.05);
           logBattleEvent(state, `👑 The Senate Will Decide: Mace Windu gains 5% Offense (stacking)!`, 'buff');

           if (windu.position === 0) {
              allies.forEach(ally => {
                 if (ally.activeInBattle && ally.hp > 0 && !hasStatusFlag(ally, 'prevent_tm_gain') && (ally.tags.includes('Jedi Guardian') || checkHasTag(ally, 'Jedi Guardian'))) {
                    ally.turnMeter = Math.min(100, ally.turnMeter + 3);
                 }
              });
              logBattleEvent(state, `👑 Champion Of The Republic: Jedi Guardian allies gain 3% Turn Meter!`, 'buff');
           }
        }

        // kit_unique
        const kit = allies.find(u => u.characterId === 'kit_fisto' && u.activeInBattle && u.hp > 0);
        if (kit && !hasStatusFlag(kit, 'prevent_tm_gain')) {
           kit.turnMeter = Math.min(100, kit.turnMeter + 5);
           logBattleEvent(state, `⚡ Relentless Duelist: Kit Fisto gains 5% Turn Meter from enemy gaining Investigation!`, 'buff');
        }

        // quinlan_unique1: Whenever an enemy gains Investigation, Quinlan gains 5% Turn Meter.
        const quinlan = allies.find(u => u.characterId === 'quinlan_vos' && u.activeInBattle && u.hp > 0);
        if (quinlan && !hasStatusFlag(quinlan, 'prevent_tm_gain')) {
           quinlan.turnMeter = Math.min(100, quinlan.turnMeter + 5);
           logBattleEvent(state, `🕵️ Master Of Disguises: Quinlan Vos gains 5% Turn Meter from enemy gaining Investigation!`, 'buff');
        }
     }
  }

  if (name === 'Arrest Warrant') {
     const oppTeam = target.team === 'player' ? state.enemyTeam : state.playerTeam;
     // agen_unique: Whenever an enemy gains Arrest Warrant: All Jedi Guardian allies gain 5% Turn Meter.
     const agen = oppTeam.find(u => u.characterId === 'agen_kolar' && u.activeInBattle && u.hp > 0);
     if (agen) {
        oppTeam.forEach(ally => {
          if (ally.activeInBattle && ally.hp > 0 && !hasStatusFlag(ally, 'prevent_tm_gain') && (ally.tags.includes('Jedi Guardian') || checkHasTag(ally, 'Jedi Guardian'))) {
             ally.turnMeter = Math.min(100, ally.turnMeter + 5);
          }
        });
        logBattleEvent(state, `🛡️ Guardian of the Chancellor: Jedi Guardian allies gain 5% Turn Meter from Arrest Warrant placement!`, 'buff');
     }

     // windu_lead (at position 0) / unique
     const windu = oppTeam.find(u => u.characterId === 'mace_windu' && u.activeInBattle && u.hp > 0);
     if (windu) {
        // Unique: 5% defense stacking
        windu.defense = Math.round(windu.defense * 1.05);
        logBattleEvent(state, `👑 The Senate Will Decide: Mace Windu gains 5% Defense (stacking)!`, 'buff');

        if (windu.position === 0) {
           oppTeam.forEach(ally => {
             if (ally.activeInBattle && ally.hp > 0 && (ally.tags.includes('Jedi Guardian') || checkHasTag(ally, 'Jedi Guardian'))) {
                const hRec = Math.round(ally.maxHp * 0.05);
                const pRec = Math.round(ally.maxProtection * 0.05);
                ally.hp = Math.min(ally.maxHp, ally.hp + hRec);
                if (!hasStatusFlag(ally, 'prevent_prot_recovery')) {
                   ally.protection = Math.min(ally.maxProtection, ally.protection + pRec);
                }
             }
           });
           logBattleEvent(state, `👑 Champion Of The Republic: Jedi Guardian allies recover 5% Health and Protection!`, 'heal');
        }
     }

     // jocasta_unique: Whenever an enemy gains Arrest Warrant: Jocasta Nu gains Stealth (2 turns).
     const jocasta = oppTeam.find(u => u.characterId === 'jocasta_nu' && u.activeInBattle && u.hp > 0);
     if (jocasta) {
        logBattleEvent(state, `📚 Keeper of the Archives: Jocasta Nu gains Stealth (2 turns) from Arrest Warrant!`, 'buff');
        applyStatus(state, jocasta, 'Stealth', 2, false, jocasta);
     }

     // barriss_unique2 assist: "Whenever an enemy gains Arrest Warrant, Barriss assists dealing 50% reduced damage."
     const barriss = oppTeam.find(u => u.characterId === 'barriss_offee' && u.activeInBattle && u.hp > 0);
     if (barriss && barriss.abilities.length > 0) {
        logBattleEvent(state, `🤐 The Wrong Path: Barriss Offee assists against ${target.name}!`, 'info');
        executeCombatAction(state, barriss.id, barriss.abilities[0], target.id, undefined, 1, 0);
     }

     // barriss_unique1: "Whenever a Jedi Guardian ally inflicts Arrest Warrant: Barriss gains Stealth (2 turns)."
     if (barriss && attacker && attacker.team === barriss.team && (attacker.tags.includes('Jedi Guardian') || checkHasTag(attacker, 'Jedi Guardian'))) {
        logBattleEvent(state, `🤐 Hidden Doubts: Barriss Offee gains Stealth (2 turns) from Jedi Guardian ally!`, 'buff');
        applyStatus(state, barriss, 'Stealth', 2, false, barriss);
     }
  }

  if (name === 'Momentum') {
     onMomentumGained(state, target, count);
  }

  if (name === 'Combined Arms' && checkHasTag(target, '212th')) {
     const allies = target.team === 'player' ? state.playerTeam : state.enemyTeam;
     const gk = allies.find(u => u.characterId === 'general_kenobi' && u.activeInBattle && u.hp > 0);
     if (gk) {
        const gkRec = Math.round(gk.maxProtection * 0.03);
        gk.protection = Math.min(gk.maxProtection, gk.protection + gkRec);
        logBattleEvent(state, `🛡️ General of the 212th: General Kenobi recovers ${gkRec} (3%) Protection from Combined Arms!`, 'heal');
     }
  }

  if (name === 'Lockdown') {
     onLockdownGained(state, target, attacker);
  }

  if (name === 'Riot Control') {
     onRiotControlGained(state, target, attacker);
  }

  if (name === 'Marked') {
     onMarkedGained(state, target, attacker);
  }

  if (name === 'Ambushed') {
     onAmbushedGained(state, target, attacker);
  }

  if (name === 'Taunt' && target.characterId === 'keller') {
     const squad = target.team === 'player' ? state.playerTeam : state.enemyTeam;
     squad.forEach(u => {
        if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Galactic Marines') || checkHasTag(u, 'Galactic Marines'))) {
           u.defense = Math.round(u.defense * 1.10);
           logBattleEvent(state, `🛡️ Veteran Of Mygeeto: ${u.name} gains +10% Defense from Keller Taunting!`, 'buff');
        }
     });
  }

  if (name === 'Overdisciplined') {
     if (target.maxProtection > 0) {
        const conversionHp = target.maxProtection;
        target.maxHp += conversionHp;
        target.hp += conversionHp;
        target.protection = 0;
        target.statuses = target.statuses.filter(s => s.name !== 'Fear');
        logBattleEvent(state, `🛡️ Overdisciplined: ${target.name} converted all Protection to +${conversionHp} Max Health! Fear dispelled!`, 'info');
     }
  }

  if (target.statuses.some(s => s.name === 'Overdisciplined')) {
     target.protection = 0;
  }

  // CUPD Surveillance: Whenever enemies gain buffs, 25% chance to inflict Lockdown
  if (!isDebuff && target.activeInBattle && target.hp > 0) {
     const oppTeam = target.team === 'player' ? state.enemyTeam : state.playerTeam;
     const cupd = oppTeam.find(u => u.characterId === 'underworld_police' && u.activeInBattle && u.hp > 0);
     if (cupd && Math.random() < 0.25) {
        logBattleEvent(state, `🛡️ Citywide Surveillance: CUPD scans detect enemy buff! Attempting Lockdown!`, 'info');
        applyStatus(state, target, 'Lockdown', 1, true, cupd);
     }
  }

  // PIRATE CORSAIR DEBUFF INFLICTION TRIGGER
  if (isDebuff && attacker) {
    if (attacker.tags.includes('Corsair') || checkHasTag(attacker, 'Corsair')) {
       const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
       const leader = allies.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
       if (leader && leader.characterId === 'captain_ithano') {
          allies.forEach(u => {
             if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Corsair') || checkHasTag(u, 'Corsair'))) {
                u.protection = Math.min(u.maxProtection, u.protection + Math.round(u.maxProtection * 0.02));
             }
          });
       }
       const ithano = allies.find(u => u.characterId === 'captain_ithano' && u.activeInBattle && u.hp > 0 && u.statuses.some(s => s.name === 'Payout'));
       if (ithano) {
          allies.forEach(u => {
             if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Corsair') || checkHasTag(u, 'Corsair'))) {
                if (!hasStatusFlag(u, 'prevent_tm_gain')) {
                   u.turnMeter = Math.min(100, u.turnMeter + 3);
                }
             }
          });
       }
    }
  }
}

export function onDossierReachedFive(state: CombatState, target: CombatUnit, attacker: CombatUnit | null) {
  const targetOpponents = target.team === 'player' ? state.enemyTeam : state.playerTeam;
  const krennic = targetOpponents.find(u => u.characterId === 'director_krennic' && u.activeInBattle && u.hp > 0);
  if (krennic) {
      targetOpponents.forEach(u => {
          if (u.activeInBattle && u.hp > 0 && (u.tags.includes('ISB') || checkHasTag(u, 'ISB'))) {
              Object.keys(u.cooldowns).forEach(key => {
                  if (u.cooldowns[key] > 0) u.cooldowns[key]--;
              });
          }
      });
      logBattleEvent(state, `⏳ Internal Security: All ISB cooldowns reduced by 1!`, 'info');

      applyStatus(state, target, 'Fear', 1, true, krennic);
      logBattleEvent(state, `😱 Fear Through Information: ${target.name} reached 5 Dossier and is struck with Fear!`, 'debuff');
  }
}

export function logBattleEvent(state: CombatState, text: string, type: CombatEventLog['type'] = 'info', targetId?: string, sourceId?: string, amount?: number, isCrit?: boolean) {
  state.battleLog.push({ text, type, targetId, sourceId, amount, isCrit });

  if (type === 'damage' && targetId) {
     const allUnits = [...state.playerTeam, ...state.enemyTeam];
     const targetUnit = allUnits.find(u => u.id === targetId);
     const attackerUnit = sourceId ? allUnits.find(u => u.id === sourceId) : null;
     
     if (attackerUnit && attackerUnit.characterId === 'mara_jade' && attackerUnit.statuses.some(s => s.name === 'Stealth') && !hasStatusFlag(attackerUnit, 'prevent_prot_recovery')) {
         const rec = Math.round(attackerUnit.maxProtection * 0.10);
         attackerUnit.protection = Math.min(attackerUnit.maxProtection, attackerUnit.protection + rec);
     }
     
     if (targetUnit) {
        // --- PIRATE CORSAIR HOOKS ---
        if (targetUnit.characterId === 'quiggold' && targetUnit.statuses.some(s => s.name === 'Taunt')) {
           if (!targetUnit.dynamicState) targetUnit.dynamicState = {};
           targetUnit.dynamicState.quiggoldAbsorbed = (targetUnit.dynamicState.quiggoldAbsorbed || 0) + 1;
           logBattleEvent(state, `🛡️ Veteran Protector Progress: Quiggold absorbed/prevented an attack (${targetUnit.dynamicState.quiggoldAbsorbed}/20)!`, 'info');
           if (targetUnit.dynamicState.quiggoldAbsorbed >= 20 && !targetUnit.statuses.some(s => s.name === 'Payout')) {
              activateCorsairPayout(state, targetUnit);
           }
        }

        if (attackerUnit && attackerUnit.characterId === 'pendewqell') {
           if (!attackerUnit.dynamicState) attackerUnit.dynamicState = {};
           attackerUnit.dynamicState.pendewqellHits = (attackerUnit.dynamicState.pendewqellHits || 0) + 1;
           logBattleEvent(state, `💥 Heavy Gunner Progress: Pendewqell dealt damage (${attackerUnit.dynamicState.pendewqellHits}/30 times)!`, 'info');
           if (attackerUnit.dynamicState.pendewqellHits >= 30 && !attackerUnit.statuses.some(s => s.name === 'Payout')) {
              activateCorsairPayout(state, attackerUnit);
           }
        }

        if (targetUnit.hp > 0 && (targetUnit.tags.includes('Corsair') || checkHasTag(targetUnit, 'Corsair'))) {
           const allies = targetUnit.team === 'player' ? state.playerTeam : state.enemyTeam;
           const kix = allies.find(u => u.characterId === 'kix_conquest' && u.activeInBattle && u.hp > 0);
           if (kix && !state.dynamicState?.kixHealedThisTurn) {
              const hpPct = targetUnit.hp / targetUnit.maxHp;
              if (hpPct < 0.50) {
                 if (!state.dynamicState) state.dynamicState = {};
                 state.dynamicState.kixHealedThisTurn = true;
                 
                 const kixHp = Math.round(kix.maxHp * 0.10);
                 const kixProt = Math.round(kix.maxProtection * 0.10);
                 kix.hp = Math.min(kix.maxHp, kix.hp + kixHp);
                 kix.protection = Math.min(kix.maxProtection, kix.protection + kixProt);
                 
                 const allyHp = Math.round(targetUnit.maxHp * 0.10);
                 const allyProt = Math.round(targetUnit.maxProtection * 0.10);
                 targetUnit.hp = Math.min(targetUnit.maxHp, targetUnit.hp + allyHp);
                 targetUnit.protection = Math.min(targetUnit.maxProtection, targetUnit.protection + allyProt);
                 
                 logBattleEvent(state, `🏥 Medical Emergency: Kix healed ${targetUnit.name} and himself for 10% Health & Protection!`, 'heal');
              }
           }
        }
        // --- END PIRATE CORSAIR HOOKS ---

        if (targetUnit.statuses.some(s => s.name === 'Imperial Decree')) {
           const oppSquad = targetUnit.team === 'player' ? state.enemyTeam : state.playerTeam;
           const starkiller = oppSquad.find(u => u.characterId === 'starkiller' && u.activeInBattle && u.hp > 0);
           if (starkiller) {
               if (!starkiller.dynamicState) starkiller.dynamicState = {};
               let w = starkiller.dynamicState.wrathStacks || 0;
               w += 2;
               if (w >= 10) {
                   w = 0;
                   applyStatus(state, starkiller, 'Offense Up', 2, false);
                   applyStatus(state, starkiller, 'Critical Damage Up', 2, false);
                   applyStatus(state, starkiller, 'Defense Penetration Up', 2, false);
               }
               starkiller.dynamicState.wrathStacks = w;
           }

           const mara = oppSquad.find(u => u.characterId === 'mara_jade' && u.activeInBattle && u.hp > 0);
           if (mara) {
               const hpPct = targetUnit.hp / targetUnit.maxHp;
               if (!targetUnit.dynamicState) targetUnit.dynamicState = {};
               const tState = targetUnit.dynamicState;
               let triggerAssist = false;
               if (hpPct <= 0.75 && !tState.maraAssist75) { tState.maraAssist75 = true; triggerAssist = true; }
               else if (hpPct <= 0.50 && !tState.maraAssist50) { tState.maraAssist50 = true; triggerAssist = true; }
               else if (hpPct <= 0.25 && !tState.maraAssist25) { tState.maraAssist25 = true; triggerAssist = true; }
               
               if (triggerAssist && customAbilityHandlers) {
                   const basic = mara.abilities.find(ab => ab.type === 'basic') || mara.abilities[0];
                   if (customAbilityHandlers[basic.id]) {
                       customAbilityHandlers[basic.id](state, mara, targetUnit, basic, Math.random() < mara.critChance, undefined, 1, 0);
                   }
               }
           }
        }
        const teamUnits = targetUnit.team === 'player' ? state.playerTeam : state.enemyTeam;
        const thrawn = teamUnits.find(u => u.characterId === 'thrawn_remnant' && u.activeInBattle && u.hp > 0);
        if (thrawn && thrawn.id !== targetUnit.id) {
           thrawn.turnMeter = Math.min(100, thrawn.turnMeter + 5);
           state.battleLog.push({ text: `📈 Heir to the Empire: ${targetUnit.name} took damage. Grand Admiral Thrawn gains 5% Turn Meter!`, type: 'buff' });
        }
     }
  }
}

export function reduceTurnMeter(state: CombatState, target: CombatUnit, amount: number, attacker: CombatUnit | null = null) {
  if (amount <= 0 || !target.activeInBattle || target.hp <= 0) return;
  if (hasStatusFlag(target, 'prevent_tm_reduction')) {
    logBattleEvent(state, `🛡️ Immune: ${target.name} is immune to Turn Meter reduction!`, 'info');
    return;
  }
  
  const preTM = target.turnMeter;
  target.turnMeter = Math.max(0, target.turnMeter - amount);
  const tmReduced = preTM - target.turnMeter;
  
  if (tmReduced > 0) {

    const team = target.team === 'player' ? state.enemyTeam : state.playerTeam;
    const rime = team.find(u => u.characterId === 'captain_rime' && u.activeInBattle && u.hp > 0);
    if (rime) {
        team.forEach(a => {
            if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Avalanche Remnant') || checkHasTag(a, 'Avalanche Remnant')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
                a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.02));
            }
        });
    }

    logBattleEvent(state, `📉 Turn Meter: ${target.name} lost ${Math.round(tmReduced)}% Turn Meter!`, 'debuff');
    
    if (target.statuses.some(s => s.name === 'Imperial Decree')) {
      const opposingSide = target.team === 'player' ? state.enemyTeam : state.playerTeam;
      
      const sidious = opposingSide.find(u => u.characterId === 'gl_darth_sidious' && u.activeInBattle && u.hp > 0);
      if (sidious && !hasStatusFlag(sidious, 'prevent_tm_gain')) {
        sidious.turnMeter = Math.min(100, sidious.turnMeter + 5);
        logBattleEvent(state, `📈 Master Of The Grand Plan: Darth Sidious gains 5% Turn Meter!`, 'buff');
      }

      const tarkinLead = opposingSide.find(u => u.characterId === 'grand_moff_tarkin' && u.position === 0 && u.activeInBattle && u.hp > 0);
      if (tarkinLead) {
        opposingSide.forEach(u => {
          if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Galactic Empire') || u.tags.includes('Empire')) && !hasStatusFlag(u, 'prevent_prot_recovery')) {
            const rec = Math.round(u.maxProtection * 0.03);
            u.protection = Math.min(u.maxProtection, u.protection + rec);
          }
        });
        logBattleEvent(state, `🛡️ Doctrine of Fear: Empire allies recover 3% Protection from enemy Turn Meter loss!`, 'heal');
      }
    }
  }
}

// Dynamic speed ticks to load Turn Meter values
export function runDefeatHooks(state: CombatState, defeatedUnit: CombatUnit) {
    if (defeatedUnit.characterId === 'death_trooper_reinforcement') {
        const allies = defeatedUnit.team === 'player' ? state.playerTeam : state.enemyTeam;
        const krennic = allies.find(u => u.characterId === 'director_krennic' && u.activeInBattle && u.hp > 0);
        if (krennic) {
            if (!krennic.dynamicState) krennic.dynamicState = {};
            const resummons = krennic.dynamicState.dtrResummons || 0;
            if (resummons < 1) {
                krennic.dynamicState.dtrResummons = resummons + 1;
                logBattleEvent(state, `💀 Expendable Asset: Death Trooper Reinforcement was defeated! Resummoning once!`, 'info');
                triggerSummon(state, krennic, 'death_trooper_reinforcement');
            }
        }
    }

    if (defeatedUnit.tags.some(tag => tag.includes('Summon'))) {
        return; // Summons don't trigger defeat mechanics usually
    }

    const lastEvent = state.battleLog[state.battleLog.length - 1];
    let attackerId = null;
    if (lastEvent && lastEvent.type === 'damage' && lastEvent.targetId === defeatedUnit.id) {
       attackerId = lastEvent.sourceId;
    }
    
    if (attackerId) {
        const attacker = (state.playerTeam.find(u => u.id === attackerId) || state.enemyTeam.find(u => u.id === attackerId))!;
        if (attacker && attacker.characterId === 'mara_jade') {
            attacker.cooldowns['mara_s1'] = 0;
            logBattleEvent(state, `🔄 Elite Assassin: Mara Jade reset Silent Assassination cooldown!`, 'buff');
        }
        if (attacker && attacker.characterId === 'pendewqell') {
            applyStatus(state, attacker, 'Offense Up', 2, false);
            if (!attacker.statuses.some(s => s.name === 'Payout')) {
                if (!attacker.dynamicState) attacker.dynamicState = {};
                attacker.dynamicState.pendewqellDefeats = (attacker.dynamicState.pendewqellDefeats || 0) + 1;
                logBattleEvent(state, `💥 Heavy Gunner Progress: Pendewqell defeated an enemy (${attacker.dynamicState.pendewqellDefeats}/2)!`, 'info');
                if (attacker.dynamicState.pendewqellDefeats >= 2) {
                    activateCorsairPayout(state, attacker);
                }
            }
        }
    }
    
    // Prevent defeat hooks if Ima-Gun Di is going to revive
    if (defeatedUnit.characterId === 'ima_gun_di') {
       if (!defeatedUnit.dynamicState || !defeatedUnit.dynamicState.hasRevivedFromDeath) {
          return; // Wait for checkDefeat to trigger the revive
       }
    }

    if (checkHasTag(defeatedUnit, 'Enemy') || !checkHasTag(defeatedUnit, 'Enemy')) {
        const winningSquad = defeatedUnit.team === 'player' ? state.enemyTeam : state.playerTeam;
        const leader = winningSquad.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
        if (leader && leader.characterId === 'gl_lord_vader') {
            winningSquad.forEach(a => {
                if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Knightfall') || checkHasTag(a, 'Knightfall'))) {
                    a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.20));
                    if (!hasStatusFlag(a, 'prevent_prot_recovery')) {
                        a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.20));
                    }
                }
            });
        }
    }


    const ws = defeatedUnit.team === 'player' ? state.enemyTeam : state.playerTeam;

    // Krennic Unique 1: "Whenever an enemy with Dossier is defeated: All ISB allies gain Offense Up (2 turns)"
    if (defeatedUnit.statuses.some(s => s.name === 'Dossier')) {
        const opposingSquad = defeatedUnit.team === 'player' ? state.enemyTeam : state.playerTeam;
        const krennic = opposingSquad.find(u => u.characterId === 'director_krennic' && u.activeInBattle && u.hp > 0);
        if (krennic) {
            opposingSquad.forEach(u => {
                if (u.activeInBattle && u.hp > 0 && (u.tags.includes('ISB') || checkHasTag(u, 'ISB'))) {
                    applyStatus(state, u, 'Offense Up', 2, false, krennic);
                }
            });
            logBattleEvent(state, `📈 Director Of Internal Security: All ISB allies gain Offense Up (2 turns) from Dossier carrier defeat!`, 'buff');
        }
    }

    // Bacara Unique: Cold-Hearted Executor: Whenever an enemy is defeated, all Galactic Marines allies and Ki-Adi-Mundi recover 20% Protection and gain 15% Turn Meter.
    const bacara = ws.find(u => u.characterId === 'commander_bacara' && u.activeInBattle && u.hp > 0);
    if (bacara) {
        ws.forEach(u => {
            if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Galactic Marines') || checkHasTag(u, 'Galactic Marines') || u.characterId === 'ki_adi_mundi_journey')) {
                if (!hasStatusFlag(u, 'prevent_prot_recovery')) {
                    const rec = Math.round(u.maxProtection * 0.20);
                    u.protection = Math.min(u.maxProtection, u.protection + rec);
                }
                if (!hasStatusFlag(u, 'prevent_tm_gain')) {
                    u.turnMeter = Math.min(100, u.turnMeter + 15);
                }
            }
        });
        logBattleEvent(state, `💀 Cold-Hearted Executor: Enemy defeated! Galactic Marines and Ki-Adi-Mundi recover 20% Protection and gain 15% Turn Meter!`, 'heal');
    }

    // Tech: Reduce cooldowns
    const tech = ws.find(u => u.characterId === 'tech_bb' && u.activeInBattle && u.hp > 0);
    if (tech) {
        Object.keys(tech.cooldowns).forEach(key => {
            if (tech.cooldowns[key] > 0) tech.cooldowns[key]--;
        });
    }

    // Crosshair: Marked enemy defeated
    if (defeatedUnit.statuses.some(s => s.name === 'Marked')) {
        const cross = ws.find(u => u.characterId === 'crosshair_bb' && u.activeInBattle && u.hp > 0);
        if (cross) {
            cross.turnMeter = 100; // Bonus turn
            logBattleEvent(state, `🎯 Crosshair gains a Bonus Turn (Marked enemy defeated)!`, 'buff');
        }
        const leader = ws.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
        if (leader && leader.characterId === 'crosshair_bb') {
            ws.forEach(a => {
                if ((a.tags.includes('Bad Batch') || checkHasTag(a, 'Bad Batch')) && a.activeInBattle && a.hp > 0 && !hasStatusFlag(a, 'prevent_tm_gain')) {
                    a.turnMeter = Math.min(100, a.turnMeter + 10);
                }
            });
        }
    }


    const allies = defeatedUnit.team === 'player' ? state.playerTeam : state.enemyTeam;
    const winningSquad = defeatedUnit.team === 'player' ? state.enemyTeam : state.playerTeam;

    // Biggs Unique: "Whenever Marked Target is defeated: Biggs gains 20% Turn Meter."
    if (defeatedUnit.statuses.some(s => s.name === 'Marked Target')) {
        const biggs = winningSquad.find(u => u.characterId === 'biggs' && u.activeInBattle && u.hp > 0);
        if (biggs && !hasStatusFlag(biggs, 'prevent_tm_gain')) {
            biggs.turnMeter = Math.min(100, biggs.turnMeter + 20);
            logBattleEvent(state, `📈 Built For Action: Marked Target defeated! Biggs gains 20% Turn Meter!`, 'buff');
        }
    }
    
    // Ima-Gun Di Unique 1: "Whenever a Clone Trooper ally is defeated, all remaining Clone Trooper allies gain 100% Health and Offense Up (2 turns)."
    if (defeatedUnit.tags.includes('Clone Trooper') || checkHasTag(defeatedUnit, 'Clone Trooper')) {
       const imaGunDi = allies.find(u => u.characterId === 'ima_gun_di' && u.activeInBattle && u.hp > 0);
       if (imaGunDi) {
          logBattleEvent(state, `🛡️ There Is Still Hope: A Clone Trooper fell! All remaining Clone Troopers recover 100% Health and gain Offense Up (2 turns)!`, 'heal');
          allies.forEach(u => {
             if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Clone Trooper') || checkHasTag(u, 'Clone Trooper'))) {
                u.hp = u.maxHp;
                applyStatus(state, u, 'Offense Up', 2, false, imaGunDi);
             }
          });
       }
    }
    
    // Determine the oppposing team (who defeated them)
    // To trigger their passives
    const leader = ws.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    
    if (leader && leader.characterId === 'gl_lord_vader') {
       const knightfallAllies = winningSquad.filter(u => checkHasTag(u, 'Knightfall') && u.activeInBattle && u.hp > 0);
       logBattleEvent(state, `Lord Vader's Knightfall Protocol triggers: Knightfall allies recover Health & Protection!`, 'heal');
       knightfallAllies.forEach(kf => {
           kf.hp = Math.min(kf.maxHp, kf.hp + (kf.maxHp * 0.20));
           kf.protection = Math.min(kf.maxProtection, kf.protection + (kf.maxProtection * 0.20));
       });
    }

    if (defeatedUnit.characterId === 'ima_gun_di') {
       const squad = defeatedUnit.team === 'player' ? state.playerTeam : state.enemyTeam;
       squad.forEach(u => {
          if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Clone Trooper') || checkHasTag(u, 'Clone Trooper'))) {
             if (!hasStatusFlag(u, 'prevent_tm_gain')) {
                u.turnMeter = Math.min(100, u.turnMeter + 50);
             }
             applyStatus(state, u, 'Offense Up', 3, false);
             applyStatus(state, u, 'Defense Up', 3, false);
             u.hp = u.maxHp;
             logBattleEvent(state, `🛡️ The Last Stand: ${u.name} gains 50% TM, Offense Up, Defense Up, and Max Heal from Ima-Gun Di's defeat!`, 'heal');
          }
       });
    }

    // Imperial Decree Defeat Triggers
    if (defeatedUnit.statuses.some(s => s.name === 'Imperial Decree')) {
        // Starkiller Unique
        const starkiller = winningSquad.find(u => u.characterId === 'starkiller' && u.activeInBattle && u.hp > 0);
        if (starkiller) {
            const hRec = Math.round(starkiller.maxHp * 0.40);
            starkiller.hp = Math.min(starkiller.maxHp, starkiller.hp + hRec);
            if (!hasStatusFlag(starkiller, 'prevent_prot_recovery')) {
                const pRec = Math.round(starkiller.maxProtection * 0.40);
                starkiller.protection = Math.min(starkiller.maxProtection, starkiller.protection + pRec);
            }
            applyStatus(state, starkiller, 'bonus_turn', 1, false);
            logBattleEvent(state, `🔄 Unleashed Power: Starkiller recovers Health/Protection and gains a Bonus Turn!`, 'heal');
        }

        // 1. Tarkin Unique: "Whenever an enemy with Imperial Decree is defeated: All Emperor's Hand allies gain: Offense Up (2 turns), Critical Chance Up (2 turns)."
        const tarkin = winningSquad.find(u => u.characterId === 'grand_moff_tarkin' && u.activeInBattle && u.hp > 0);
        if (tarkin) {
           ws.forEach(u => {
              if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Emperors Hand') || u.tags.includes("Emperor's Hand"))) {
                 applyStatus(state, u, 'Offense Up', 2, false, tarkin);
                 applyStatus(state, u, 'Critical Chance Up', 2, false, tarkin);
              }
           });
           logBattleEvent(state, `💀 Architect of Order: Enemy with Imperial Decree defeated! Emperor's Hand allies gain Offense Up and Critical Chance Up!`, 'buff');
        }

        // 2. Sidious Unique: "Whenever an enemy with Imperial Decree is defeated: Reduce all Emperor's Hand cooldowns by 1."
        const sidious = winningSquad.find(u => u.characterId === 'gl_darth_sidious' && u.activeInBattle && u.hp > 0);
        if (sidious) {
           ws.forEach(u => {
              if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Emperors Hand') || u.tags.includes("Emperor's Hand"))) {
                 Object.keys(u.cooldowns).forEach(abId => {
                    if (u.cooldowns[abId] > 0) {
                       u.cooldowns[abId] = Math.max(0, u.cooldowns[abId] - 1);
                    }
                 });
              }
           });
           logBattleEvent(state, `💀 Master Of The Grand Plan: Enemy with Imperial Decree defeated! Emperor's Hand cooldowns reduced by 1.`, 'buff');
        }

        // 3. Sidious Leader: "Whenever an enemy with Imperial Decree is defeated: Apply Imperial Decree to the healthiest remaining enemy."
        const sidiousLead = winningSquad.find(u => u.characterId === 'gl_darth_sidious' && u.position === 0 && u.activeInBattle && u.hp > 0);
        if (sidiousLead) {
           const opposingTeamRemaining = defeatedUnit.team === 'player' ? state.playerTeam : state.enemyTeam;
           const survivors = opposingTeamRemaining.filter(u => u.id !== defeatedUnit.id && u.activeInBattle && u.hp > 0);
           if (survivors.length > 0) {
              const healthiest = [...survivors].sort((a, b) => b.hp - a.hp)[0];
              applyStatus(state, healthiest, 'Imperial Decree', 99, true, sidiousLead);
              logBattleEvent(state, `👑 Galactic Sovereign: Imperial Decree transferred to the healthiest enemy, ${healthiest.name}!`, 'debuff');
           }
        }
    }

    // Raid-specific Defeat Hooks
    if (state.rewardNodeId && state.rewardNodeId.includes('_complete')) {
      const raidId = state.rewardNodeId.replace('_complete', '');
      const phase = state.raidPhaseCurrent || 1;

      if (!state.dynamicState) state.dynamicState = {};

      if (raidId === 'duel_of_the_fates') {
        if (phase === 1 && defeatedUnit.characterId === 'battle_droid_officer') {
          state.dynamicState.civilianPanic = Math.max(0, (state.dynamicState.civilianPanic || 0) - 50);
          logBattleEvent(state, `🏆 Officer Defeated! Civilian panic reduced by 50%! Current Panic: ${state.dynamicState.civilianPanic}%`, 'heal');
        }
      } else if (raidId === 'battle_of_kamino') {
        if (phase === 3 && defeatedUnit.team === 'enemy' && defeatedUnit.characterId !== 'asajj_ventress') {
          logBattleEvent(state, `🤖 Endless Reinforcements: A Separatist Droid was defeated! A replacement B1 Battle Droid will join next turn.`, 'info');
          if (!state.dynamicState.reinforcementsToSummon) state.dynamicState.reinforcementsToSummon = 0;
          state.dynamicState.reinforcementsToSummon++;
        }
      } else if (raidId === 'rescue_of_rotta') {
        if (phase === 2 && defeatedUnit.characterId === 'nightsister_guardian') {
          state.dynamicState.pillarsDestroyed = true;
          state.dynamicState.pillarsDestroyedTurnsLeft = 3;
          logBattleEvent(state, `🎉 Support Pillars Destroyed! Falling rubble hazard is disabled for 3 turns!`, 'heal');
        }
      } else if (raidId === 'geonosian_coliseum') {
        if (phase === 1 && defeatedUnit.team === 'enemy') {
          state.dynamicState.crowdFavor = Math.min(10, (state.dynamicState.crowdFavor || 0) + 1);
          logBattleEvent(state, `🏟️ Enemy Defeated! The crowd cheers. Crowd Favor: ${state.dynamicState.crowdFavor}/10`, 'buff');
        }
      }
    }
}

export function advanceTurnMeters(state: CombatState) {
  if (state.ended) return;

  const activeUnits = [...state.playerTeam, ...state.enemyTeam].filter(u => u.activeInBattle && u.hp > 0);

  // Tick until someone hits 100 TM or there's a bonus turn
  let safetyCount = 0;
  while (state.bonusTurnQueue.length === 0 && !activeUnits.some(u => u.turnMeter >= 100)) {
    safetyCount++;
    if (safetyCount > 2000) break; // Break lock options safely

    activeUnits.forEach(u => {
      const stats = getModifiedStats(u, u.team === 'player' ? state.playerTeam : state.enemyTeam);
      u.turnMeter += stats.speed * 0.05; // 5% of modified speed per tick
      
      // Passive Ultimate generation
      if (u.ultimateCharge !== undefined) {
        // Slow passive charge per tick
        u.ultimateCharge = Math.min(100, Math.floor(u.ultimateCharge + (stats.speed * 0.005)));
      }
    });
  }

  // Select next unit
  if (state.bonusTurnQueue.length > 0) {
    const bonusId = state.bonusTurnQueue.shift()!;
    const bonusUnit = activeUnits.find(u => u.id === bonusId);
    if (bonusUnit && bonusUnit.activeInBattle && bonusUnit.hp > 0) {
      if (state.dynamicState?.isDuelActive && bonusUnit.characterId !== 'old_ben' && bonusUnit.characterId !== 'darth_vader') {
         logBattleEvent(state, `⏳ Frozen: ${bonusUnit.name} cannot take a bonus turn during the historic duel!`, 'info');
         decrementStatusDurations(state, bonusUnit);
         state.activeUnitId = null;
         advanceTurnMeters(state);
         return;
      }
      // Check if bonus unit is stunned
      if (hasStatusFlag(bonusUnit, 'skip_turn')) {
        logBattleEvent(state, `❄️ ${bonusUnit.name} would take a BONUS turn, but is INCAPACITATED! Skipping bonus action.`, 'debuff');
        
        // Remove Fear if it applies
        if (bonusUnit.statuses.some(s => s.name === 'Fear')) {
          triggerFearedEnemyTurn(state, bonusUnit);
          const fearDmg = Math.round(bonusUnit.maxHp * 0.1);
          logBattleEvent(state, `${bonusUnit.name} takes damage from Fear and loses it!`, 'damage', bonusUnit.id, undefined, fearDmg, false);
          bonusUnit.hp = Math.max(0, bonusUnit.hp - fearDmg);
          bonusUnit.statuses = bonusUnit.statuses.filter(s => s.name !== 'Fear');
        }

        decrementStatusDurations(state, bonusUnit);
        state.activeUnitId = null;
        advanceTurnMeters(state);
        return;
      }
      state.activeUnitId = bonusId;
      logBattleEvent(state, `--- ${bonusUnit.name} takes a BONUS turn! ---`, 'turn');
      return;
    } else {
      // If bonus unit is dead/not active, recursively proceed to find next active turn taker
      advanceTurnMeters(state);
      return;
    }
  }

  // Get healthiest TM above 100
  const eligible = activeUnits.filter(u => u.turnMeter >= 100);
  eligible.sort((a, b) => b.turnMeter - a.turnMeter);
  if (eligible.length > 0) {
    const active = eligible[0];
    
    if (state.dynamicState?.isDuelActive && active.characterId !== 'old_ben' && active.characterId !== 'darth_vader') {
       active.turnMeter = 0;
       logBattleEvent(state, `⏳ Frozen: ${active.name} is frozen in awe as Obi-Wan and Darth Vader duel!`, 'info');
       decrementStatusDurations(state, active);
       state.activeUnitId = null;
       advanceTurnMeters(state);
       return;
    }
    
    // Check if standard turn taker is Stunned
    if (hasStatusFlag(active, 'skip_turn')) {
      active.turnMeter = 0; // consume TM
      logBattleEvent(state, `❄️ ${active.name} is INCAPACITATED! Ticking down duration and skipping action turn.`, 'debuff');
      
      // Remove Fear if it applies
      if (active.statuses.some(s => s.name === 'Fear')) {
        triggerFearedEnemyTurn(state, active);
        const fearDmg = Math.round(active.maxHp * 0.1);
        logBattleEvent(state, `${active.name} takes damage from Fear and loses it!`, 'damage', active.id, undefined, fearDmg, false);
        active.hp = Math.max(0, active.hp - fearDmg);
        active.statuses = active.statuses.filter(s => s.name !== 'Fear');
      }

      decrementStatusDurations(state, active);
      
      // Pass turn selection to the next unit
      state.activeUnitId = null;
      advanceTurnMeters(state);
      return;
    }

    state.activeUnitId = active.id;
    active.turnMeter = 0; // consumed
    logBattleEvent(state, `\n--- ${active.name} (${active.team.toUpperCase()}) turn start ---`, 'turn');
    
    // Cooldown ticks & Status ticks
    processTurnPassivesStart(state, active);
  }
}

function processTurnPassivesStart(state: CombatState, unit: CombatUnit) {
  if (!state.dynamicState) state.dynamicState = {};
  state.dynamicState.kixHealedThisTurn = false;

  if (unit.statuses.some(s => s.name === 'Predicted')) {
     unit.statuses = unit.statuses.filter(s => s.name !== 'Predicted');
     logBattleEvent(state, `🔮 Predicted: ${unit.name} had Predicted removed. Grand Admiral Thrawn gains a BONUS turn!`, 'info');
     const oppTeam = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
     const thrawn = oppTeam.find(u => u.characterId === 'thrawn_remnant' && u.activeInBattle && u.hp > 0);
     if (thrawn) {
        if (!state.bonusTurnQueue) state.bonusTurnQueue = [];
        state.bonusTurnQueue.push(thrawn.id);
     }
  }

  if (customTurnStartHooks[unit.characterId]) {
     customTurnStartHooks[unit.characterId](state, unit);
  }

  // Cooldown decrement
  Object.keys(unit.cooldowns).forEach(key => {
    if (unit.cooldowns[key] > 0) {
      unit.cooldowns[key]--;
    }
  });

  // Wolfpack Heavy Covering Position: "Whenever a Marked enemy takes a turn: Wolfpack Heavy gains Taunt (1 turn)."
  if (unit.statuses.some(s => s.name === 'Marked' || s.name === 'Ambushed')) {
     const oppTeam = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
     const heavy = oppTeam.find(u => u.characterId === 'wp_heavy' && u.activeInBattle && u.hp > 0);
     if (heavy) {
        logBattleEvent(state, `🛡️ Covering Position: Wolfpack Heavy ${heavy.name} gains Taunt from Marked/Ambushed enemy turn start of ${unit.name}!`, 'buff');
        applyStatus(state, heavy, 'Taunt', 1, false, heavy);
     }
  }

  // Agen Kolar unique: Whenever an enemy with Arrest Warrant takes a turn: Agen Kolar recovers 5% Health and Protection.
  if (unit.statuses.some(s => s.name === 'Arrest Warrant')) {
     const oppTeam = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
     const agen = oppTeam.find(u => u.characterId === 'agen_kolar' && u.activeInBattle && u.hp > 0);
     if (agen) {
        const hRec = Math.round(agen.maxHp * 0.05);
        const pRec = Math.round(agen.maxProtection * 0.05);
        agen.hp = Math.min(agen.maxHp, agen.hp + hRec);
        if (!hasStatusFlag(agen, 'prevent_prot_recovery')) {
           agen.protection = Math.min(agen.maxProtection, agen.protection + pRec);
        }
        logBattleEvent(state, `💖 Guardian of the Chancellor: Agen Kolar recovers ${hRec} Health and ${pRec} Protection from Arrest Warrant turn execution of ${unit.name}!`, 'heal');
     }
  }

   // Barriss Offee unique "Hidden Doubts": Whenever an enemy with Investigation takes a turn, they lose 3% Max Health.
   if (unit.statuses.some(s => s.name === 'Investigation')) {
      const oppTeam = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
      const barriss = oppTeam.find(u => u.characterId === 'barriss_offee' && u.activeInBattle && u.hp > 0);
      if (barriss) {
        const healthLoss = Math.round(unit.maxHp * 0.03);
        unit.hp = Math.max(1, unit.hp - healthLoss);
        logBattleEvent(state, `🤐 Hidden Doubts: ${unit.name} loses 3% Max Health (${healthLoss}) from taking a turn while Investigated!`, 'damage');
     }
  }

  // Ima-Gun Di unique: Permanent Taunt enforcement
  if (unit.characterId === 'ima_gun_di' && !unit.statuses.some(s => s.name === 'Taunt')) {
     logBattleEvent(state, `🛡️ There Is Still Hope: Ima-Gun Di's permanent Taunt is restored!`, 'buff');
     applyStatus(state, unit, 'Taunt', 999, false, unit);
  }

  // War Architect Tarkin unique Lockdown trigger on enemy turn start
  if (unit.statuses.some(s => s.name === 'Lockdown')) {
     const oppTeam = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
     const tarkin = oppTeam.find(u => u.characterId === 'gl_tarkin' && u.activeInBattle && u.hp > 0);
     if (tarkin) {
        if (!unit.dynamicState) unit.dynamicState = {};
        const count = (unit.dynamicState.lockedDownTurnsTaken || 0) + 1;
        unit.dynamicState.lockedDownTurnsTaken = count;
        
        const healthLossPct = 0.02 * count;
        const lossAmt = Math.round(unit.maxHp * healthLossPct);
        unit.hp = Math.max(1, unit.hp - lossAmt);
        logBattleEvent(state, `🧐 Blueprint of Order: ${unit.name} loses ${lossAmt} Max Health (stacked ${count}x while Locked Down)`, 'damage');

        logBattleEvent(state, `🧐 Blueprint of Order: Coruscant Guard allies gain 2% Turn Meter!`, 'buff');
        oppTeam.forEach(member => {
           if (checkHasTag(member, 'Coruscant Guard') && member.activeInBattle && member.hp > 0 && !hasStatusFlag(member, 'prevent_tm_gain')) {
              member.turnMeter = Math.min(100, member.turnMeter + 2);
           }
        });
     }
  }

  // Frostbite penalty: losing TM on abilities usage handled elsewhere conventionally, but here it says losing TM
  const frostbite = unit.statuses.find(s => s.name === 'Frostbite');
  if (frostbite) {
    const tmReduction = 3 * (frostbite.count || 1);
    logBattleEvent(state, `${unit.name} loses ${tmReduction}% Turn Meter from Frostbite`, 'debuff');
    unit.turnMeter = Math.max(0, unit.turnMeter - tmReduction);

    if (tmReduction > 0) {
        const team = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
        const rime = team.find(u => u.characterId === 'captain_rime' && u.activeInBattle && u.hp > 0);
        if (rime) {
            team.forEach(a => {
                if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Avalanche Remnant') || checkHasTag(a, 'Avalanche Remnant')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
                    a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.02));
                }
            });
        }
    }

  }

  // Damage Over Time (DOT) / Burning via flags
  const dotStatuses = unit.statuses.filter(s => {
      const def = STATUS_DEFINITIONS[s.name];
      return def && def.flags && (def.flags.includes('damage_on_turn_start') || def.flags.includes('damage_on_turn_start_dot'));
  });

  if (dotStatuses.length > 0) {
    let totalDmg = 0;
    dotStatuses.forEach(dot => {
       
       let dmgPerc = 0.05;
       if (dot.name === 'Burning') dmgPerc = 0.15;
       else if (dot.name === 'Battlefield Corruption') dmgPerc = 0.10;
       
       totalDmg += Math.round(unit.maxHp * dmgPerc * (dot.count || 1));
       
       if (dot.name === 'Battlefield Corruption') {
           const oppTeam = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
           const voss = oppTeam.find(u => u.position === 0 && u.characterId === 'warlord_drake_voss' && u.activeInBattle && u.hp > 0);
           if (voss) {
               oppTeam.forEach(a => {
                   if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Morvek Survivor') || checkHasTag(a, 'Morvek Survivor')) && !hasStatusFlag(a, 'prevent_tm_gain')) {
                       a.turnMeter = Math.min(100, a.turnMeter + 2);
                   }
               });
           }
           const talon = oppTeam.find(u => u.characterId === 'mire_talon' && u.activeInBattle && u.hp > 0);
           if (talon && !hasStatusFlag(talon, 'prevent_tm_gain')) talon.turnMeter = Math.min(100, talon.turnMeter + 5);
           
           const veil = oppTeam.find(u => u.characterId === 'ashen_veil' && u.activeInBattle && u.hp > 0);
           if (veil && !hasStatusFlag(veil, 'prevent_tm_gain')) veil.turnMeter = Math.min(100, veil.turnMeter + 5);
       }

    });
    unit.hp = Math.max(0, unit.hp - totalDmg);
    logBattleEvent(state, `${unit.name} suffers ${totalDmg} damage from Damage Over Time effects!`, 'damage', unit.id, undefined, totalDmg, false);
  }

  // Plague (5% max HP, bypasses protection, spreading mechanics omitted for basic implementation)
  const plagues = unit.statuses.filter(s => s.name === 'Plague');
  if (plagues.length > 0) {
    let plagueDmg = 0;
    plagues.forEach(p => {
      plagueDmg += Math.round(unit.maxHp * 0.05 * (p.count || 1));
    });
    unit.hp = Math.max(0, unit.hp - plagueDmg);
    logBattleEvent(state, `${unit.name} suffers ${plagueDmg} disease damage from Plague!`, 'damage', unit.id, undefined, plagueDmg, false);
  }

  // Heal Over Time
  const hots = unit.statuses.filter(s => hasStatusFlag(unit, 'heal_on_turn_start') || s.name === 'Heal Over Time');
  if (hots.length > 0 && !hasStatusFlag(unit, 'prevent_heal')) {
    let totalHeal = 0;
    hots.forEach(hot => {
      totalHeal += Math.round(unit.maxHp * 0.10 * (hot.count || 1)); // user requested 10%
    });
    unit.hp = Math.min(unit.maxHp, unit.hp + totalHeal);
    logBattleEvent(state, `${unit.name} recovers ${totalHeal} Health from continuous healing!`, 'heal');
  }

  // Protection Over Time
  const pots = unit.statuses.filter(s => s.name === 'Protection Over Time');
  if (pots.length > 0 && !hasStatusFlag(unit, 'prevent_prot_recovery')) {
    let totalProt = 0;
    pots.forEach(pot => {
      totalProt += Math.round(unit.maxProtection * 0.05 * (pot.count || 1));
    });
    unit.protection = Math.min(unit.maxProtection, unit.protection + totalProt);
    logBattleEvent(state, `${unit.name} recovers ${totalProt} Protection from Protection Over Time!`, 'heal');
  }

  // Check defeat after DOTs
  checkDefeat(state, unit, null);

  // Run raid environmental effects & mechanics
  runRaidMechanics(state, unit);
}

export function runRaidMechanics(state: CombatState, unit: CombatUnit) {
  if (state.ended) return;
  const rewardNodeId = state.rewardNodeId;
  if (!rewardNodeId || !rewardNodeId.includes('_complete')) return;

  const raidId = rewardNodeId.replace('_complete', '');
  const phase = state.raidPhaseCurrent || 1;

  if (!state.dynamicState) state.dynamicState = {};

  // Track raid pacing turns taken
  if (!state.dynamicState.raidTurns) state.dynamicState.raidTurns = 0;
  state.dynamicState.raidTurns++;

  // Handle queued endless reinforcements first
  if (state.dynamicState.reinforcementsToSummon && state.dynamicState.reinforcementsToSummon > 0) {
    const count = state.dynamicState.reinforcementsToSummon;
    state.dynamicState.reinforcementsToSummon = 0;
    const boss = state.enemyTeam.find(u => u.hp > 0);
    if (boss) {
      for (let i = 0; i < count; i++) {
        logBattleEvent(state, `🤖 Endless Reinforcements: A new B1 Battle Droid enters the battle!`, 'summon');
        triggerSummon(state, boss, 'b1_battle_droid');
      }
    }
  }

  switch (raidId) {
    case 'duel_of_the_fates': {
      if (phase === 1) {
        // --- Phase 1: Invasion of Theed ---
        if (state.dynamicState.civilianPanic === undefined) state.dynamicState.civilianPanic = 0;
        state.dynamicState.civilianPanic = Math.min(100, state.dynamicState.civilianPanic + 5);
        logBattleEvent(state, `📈 Civilian Panic level: ${state.dynamicState.civilianPanic}% (+5% from turn progression)`, 'info');

        // At maximum Panic: Battle Droids gain Offense Up and Speed Up
        if (state.dynamicState.civilianPanic >= 100) {
          logBattleEvent(state, `🚨 MAX PANIC! Civilian panic has overrun the city. Battle Droids gain Offense Up and Speed Up (2 turns)!`, 'debuff');
          state.enemyTeam.forEach(enemy => {
            if (enemy.activeInBattle && enemy.hp > 0 && (enemy.tags.includes('Droid') || enemy.tags.includes('Separatist Droid'))) {
              applyStatus(state, enemy, 'Offense Up', 2, false, null);
              applyStatus(state, enemy, 'Speed Up', 2, false, null);
            }
          });
          // Reset panic
          state.dynamicState.civilianPanic = 0;
        }
      } else if (phase === 2) {
        // --- Phase 2: The Power Generator (Laser Gates) ---
        if (state.dynamicState.laserGateRotation === undefined) state.dynamicState.laserGateRotation = 0;
        state.dynamicState.laserGateRotation++;

        if (state.dynamicState.laserGateRotation % 4 === 0) {
          state.dynamicState.laserCompartmentSide = state.dynamicState.laserCompartmentSide === 'A' ? 'B' : 'A';
          logBattleEvent(state, `⚡ Laser Gates Rotate! The energy barriers shift! Current compartment split: Side ${state.dynamicState.laserCompartmentSide}`, 'info');
          
          const side = state.dynamicState.laserCompartmentSide;
          const allUnits = [...state.playerTeam, ...state.enemyTeam];
          allUnits.forEach((u, index) => {
            const unitSide = index % 2 === 0 ? 'A' : 'B';
            if (unitSide !== side) {
              applyStatus(state, u, 'Lockdown', 1, true, null);
              logBattleEvent(state, `🔒 ${u.name} is isolated on the other side of the Laser Gates! (Gains Lockdown)`, 'debuff');
            } else {
              // Remove Lockdown isolation
              u.statuses = u.statuses.filter(s => s.name !== 'Lockdown');
            }
          });
        }
      } else if (phase === 3) {
        // --- Phase 3: Darth Maul Duel ---
        const maul = state.enemyTeam.find(u => u.characterId === 'darth_maul_theed');
        if (maul && maul.hp > 0) {
          const hpPct = (maul.hp / maul.maxHp) * 100;
          let stance = 'Hunter';
          if (hpPct <= 33) {
            stance = 'Cornered';
          } else if (hpPct <= 66) {
            stance = 'Aggressor';
          }

          if (state.dynamicState.maulStance !== stance) {
            state.dynamicState.maulStance = stance;
            logBattleEvent(state, `🥋 Darth Maul shifts into ${stance.toUpperCase()} Stance!`, 'ultimate');
            
            maul.statuses = maul.statuses.filter(s => !['Hunter Stance', 'Aggressor Stance', 'Cornered Stance'].includes(s.name));
            if (stance === 'Hunter') {
              applyStatus(state, maul, 'Tactical Advantage', 99, false, maul);
            } else if (stance === 'Aggressor') {
              applyStatus(state, maul, 'Unleashed', 99, false, maul);
            } else if (stance === 'Cornered') {
              applyStatus(state, maul, 'Ultimate Stance', 99, false, maul);
            }
          }

          if (unit.id === maul.id) {
            if (stance === 'Hunter' && Math.random() < 0.25) {
              logBattleEvent(state, `💨 Hunter Stance: Darth Maul gains 100% Turn Meter (Bonus Turn)!`, 'turn');
              if (!state.bonusTurnQueue) state.bonusTurnQueue = [];
              state.bonusTurnQueue.push(maul.id);
            } else if (stance === 'Cornered' && Math.random() < 0.35) {
              logBattleEvent(state, `🔥 Cornered Stance: Darth Maul strikes twice! Gains immediate bonus turn queue.`, 'turn');
              if (!state.bonusTurnQueue) state.bonusTurnQueue = [];
              state.bonusTurnQueue.push(maul.id);
            }
          }
        }
      }
      break;
    }

    case 'battle_of_kamino': {
      if (phase === 1) {
        // --- Phase 1: Tipoca City Defense ---
        if (state.dynamicState.kaminoFlood === undefined) state.dynamicState.kaminoFlood = 0;
        state.dynamicState.kaminoFlood++;

        if (state.dynamicState.kaminoFlood % 3 === 0) {
          logBattleEvent(state, `🌧️ Rising Tide: Torrential storms flood the Kamino platform! All units gain Speed Up, Droids recover 5% Protection, Clone Troopers gain 10% Turn Meter!`, 'info');
          const allUnits = [...state.playerTeam, ...state.enemyTeam];
          allUnits.forEach(u => {
            if (u.activeInBattle && u.hp > 0) {
              applyStatus(state, u, 'Speed Up', 1, false, null);
              if (u.tags.includes('Droid') || u.tags.includes('Separatist Droid')) {
                u.protection = Math.min(u.maxProtection, u.protection + Math.round(u.maxProtection * 0.05));
              }
              if ((u.tags.includes('Clone Trooper') || checkHasTag(u, 'Clone Trooper')) && !hasStatusFlag(u, 'prevent_tm_gain')) {
                u.turnMeter = Math.min(100, u.turnMeter + 10);
              }
            }
          });
        }
      } else if (phase === 2) {
        // --- Phase 2: Hold The Line ---
        const cloneAllies = state.playerTeam.filter(u => u.activeInBattle && u.hp > 0 && (u.tags.includes('Clone Trooper') || checkHasTag(u, 'Clone Trooper')));
        const clonesBelow50 = cloneAllies.filter(u => (u.hp / u.maxHp) < 0.5);
        if (clonesBelow50.length >= 2 && !state.dynamicState.republicReinforcementsTriggered) {
          state.dynamicState.republicReinforcementsTriggered = true;
          logBattleEvent(state, `🛡️ Hold The Line! Republic reinforcements arrive to protect the cloning bays! All allies gain Protection Up (+50% Protection)!`, 'buff');
          state.playerTeam.forEach(u => {
            if (u.activeInBattle && u.hp > 0) {
              applyStatus(state, u, 'Protection Up', 2, false, null);
              u.protection = Math.min(u.maxProtection, u.protection + Math.round(u.maxProtection * 0.5));
            }
          });
        }
      }
      break;
    }

    case 'rescue_of_rotta': {
      if (phase === 1) {
        // --- Phase 1: Protect Rotta ---
        const leader = state.playerTeam[0];
        if (leader && leader.hp > 0) {
          if (!leader.statuses.some(s => s.name === 'Protect the Child')) {
            applyStatus(state, leader, 'Protect the Child', 99, false, null);
          }
          if (leader.protection <= 0 && !state.dynamicState.rottaDebuffApplied) {
            state.dynamicState.rottaDebuffApplied = true;
            logBattleEvent(state, `👶 Rotta is exposed! Team loses 25% Offense due to critical distress!`, 'debuff');
            state.playerTeam.forEach(u => {
              if (u.activeInBattle && u.hp > 0) {
                applyStatus(state, u, 'Offense Down', 3, true, null);
              }
            });
          } else if (leader.protection > 0 && state.dynamicState.rottaDebuffApplied) {
            state.dynamicState.rottaDebuffApplied = false;
            logBattleEvent(state, `💖 Rotta is safe and protected again! Offense restored.`, 'heal');
            state.playerTeam.forEach(u => {
              u.statuses = u.statuses.filter(s => s.name !== 'Offense Down');
            });
          }
        }
      } else if (phase === 2) {
        // --- Phase 2: Steep Climb & Falling Rubble ---
        if (state.dynamicState.rubbleTurns === undefined) state.dynamicState.rubbleTurns = 0;
        state.dynamicState.rubbleTurns++;

        if (!state.dynamicState.pillarsDestroyed || state.dynamicState.pillarsDestroyedTurnsLeft <= 0) {
          const dmgPct = 0.04;
          const allUnits = [...state.playerTeam, ...state.enemyTeam];
          logBattleEvent(state, `🪨 Falling Rubble! Support pillars are buckling, causing rocks to crash down on all active fighters!`, 'damage');
          allUnits.forEach(u => {
            if (u.activeInBattle && u.hp > 0) {
              const dmg = Math.round(u.maxHp * dmgPct);
              u.hp = Math.max(1, u.hp - dmg);
              logBattleEvent(state, `💥 ${u.name} takes ${dmg} environmental crushing damage!`, 'damage', u.id, undefined, dmg);
            }
          });
        } else {
          state.dynamicState.pillarsDestroyedTurnsLeft--;
          if (state.dynamicState.pillarsDestroyedTurnsLeft <= 0) {
            state.dynamicState.pillarsDestroyed = false;
            logBattleEvent(state, `⚠️ Environmental Hazard Active: Supporting pillars have rebuilt. Rubble starts falling again!`, 'info');
          } else {
            logBattleEvent(state, `🛡️ Environmental Hazard Suspended: Pillars are destroyed (${state.dynamicState.pillarsDestroyedTurnsLeft} turns remaining)`, 'info');
          }
        }
      } else if (phase === 3) {
        // --- Phase 3: Boss Ventress & Hostage Seize ---
        const ventress = state.enemyTeam.find(u => u.characterId === 'asajj_ventress');
        if (ventress && ventress.hp > 0) {
          const hpPct = (ventress.hp / ventress.maxHp) * 100;
          const milestones = [80, 60, 40, 20];
          let activeMilestone = null;
          for (const ms of milestones) {
            if (hpPct <= ms && !state.dynamicState[`ventressSeize_${ms}`]) {
              activeMilestone = ms;
              break;
            }
          }

          if (activeMilestone !== null) {
            state.dynamicState[`ventressSeize_${activeMilestone}`] = true;
            state.dynamicState.seizeFocusTurns = 2;
            state.dynamicState.seizeHpTarget = ventress.hp - Math.round(ventress.maxHp * 0.1);
            logBattleEvent(state, `🚨 Ventress attempts to SEIZE Rotta! Break her focus by dealing sufficient damage within 2 turns!`, 'ultimate');
            applyStatus(state, ventress, 'Lockdown', 2, true, null);
          }

          if (state.dynamicState.seizeFocusTurns > 0) {
            state.dynamicState.seizeFocusTurns--;
            if (ventress.hp <= (state.dynamicState.seizeHpTarget || 0)) {
              logBattleEvent(state, `🎉 FOCUS BROKEN! You dealt enough damage and rescued Rotta from Ventress' grasp!`, 'heal');
              state.dynamicState.seizeFocusTurns = 0;
              ventress.statuses = ventress.statuses.filter(s => s.name !== 'Lockdown');
            } else if (state.dynamicState.seizeFocusTurns === 0) {
              logBattleEvent(state, `💔 FAILURE! Ventress successfully seized Rotta! She recovers 20% Health and gains Foresight + Bonus Turn!`, 'debuff');
              ventress.hp = Math.min(ventress.maxHp, ventress.hp + Math.round(ventress.maxHp * 0.2));
              applyStatus(state, ventress, 'Foresight', 2, false, null);
              if (!state.bonusTurnQueue) state.bonusTurnQueue = [];
              state.bonusTurnQueue.push(ventress.id);
            }
          }
        }
      }
      break;
    }

    case 'fortress_inquisitorius_raid': {
      if (phase === 1) {
        // --- Phase 1: Heavy Seas & Slick Platforms ---
        if (state.dynamicState.waveTurns === undefined) state.dynamicState.waveTurns = 0;
        state.dynamicState.waveTurns++;

        if (state.dynamicState.waveTurns % 4 === 0) {
          logBattleEvent(state, `🌊 HEAVY WAVES CRASH! A massive sea surge sweeps across the slick platform!`, 'info');
          const allUnits = [...state.playerTeam, ...state.enemyTeam];
          allUnits.forEach(u => {
            if (u.activeInBattle && u.hp > 0) {
              const isImmune = u.tags.includes('Empire') || u.tags.includes('Inquisitorius') || u.tags.includes('Inquisitor');
              if (!isImmune && Math.random() < 0.6) {
                applyStatus(state, u, 'Daze', 2, true, null);
                logBattleEvent(state, `🚨 ${u.name} is knocked Off Balance by the crashing waves! (Gains Daze)`, 'debuff');
              }
            }
          });
        }
      } else if (phase === 2) {
        // --- Phase 2: Prison Blocks & Captured Allies ---
        if (state.dynamicState.captureTurns === undefined) state.dynamicState.captureTurns = 0;
        state.dynamicState.captureTurns++;

        if (state.dynamicState.captureTurns % 5 === 0) {
          const activeAllies = state.playerTeam.filter(u => u.activeInBattle && u.hp > 0);
          if (activeAllies.length > 1) {
            const victim = activeAllies[Math.floor(Math.random() * activeAllies.length)];
            state.dynamicState.capturedUnitId = victim.id;
            state.dynamicState.capturedTurnsLeft = 3;
            logBattleEvent(state, `⛓️ CAPTURED! ${victim.name} is locked in an automated cell! Destroy the security mainframe to free them!`, 'debuff');
            applyStatus(state, victim, 'Lockdown', 3, true, null);
          }
        }

        if (state.dynamicState.capturedTurnsLeft > 0) {
          state.dynamicState.capturedTurnsLeft--;
          if (state.dynamicState.capturedTurnsLeft === 0) {
            const victim = state.playerTeam.find(u => u.id === state.dynamicState.capturedUnitId);
            if (victim && victim.hp > 0) {
              logBattleEvent(state, `☠️ Cell Lock Complete: ${victim.name} returned from interrogation with Ability Block and Healing Immunity!`, 'debuff');
              applyStatus(state, victim, 'Ability Block', 2, true, null);
              applyStatus(state, victim, 'Healing Immunity', 2, true, null);
              victim.statuses = victim.statuses.filter(s => s.name !== 'Lockdown');
            }
            state.dynamicState.capturedUnitId = null;
          }
        }
      } else if (phase === 3) {
        // --- Phase 3: Grand Inquisitor Hunted ---
        const gi = state.enemyTeam.find(u => u.characterId === 'grand_inquisitor');
        if (gi && gi.hp > 0) {
          const hpPct = (gi.hp / gi.maxHp) * 100;
          const milestones = [75, 50, 25];
          let currentMilestone = null;
          for (const ms of milestones) {
            if (hpPct <= ms && !state.dynamicState[`giHunted_${ms}`]) {
              currentMilestone = ms;
              break;
            }
          }

          if (currentMilestone !== null) {
            state.dynamicState[`giHunted_${currentMilestone}`] = true;
            const activeAllies = state.playerTeam.filter(u => u.activeInBattle && u.hp > 0);
            if (activeAllies.length > 0) {
              activeAllies.sort((a, b) => b.offense - a.offense);
              const target = activeAllies[0];
              logBattleEvent(state, `🎯 THE HUNT IS ON! Grand Inquisitor targets ${target.name} to become HUNTED! (+50% extra damage taken, cannot Stealth)`, 'debuff');
              applyStatus(state, target, 'Marked', 3, true, null);
              applyStatus(state, target, 'Vulnerable', 3, true, null);
            }
          }
        }
      }
      break;
    }

    case 'geonosian_coliseum': {
      if (phase === 1) {
        // --- Phase 1: Arena Favor ---
        if (state.dynamicState.crowdFavor === undefined) state.dynamicState.crowdFavor = 0;
        if (Math.random() < 0.2) {
          state.dynamicState.crowdFavor = Math.min(10, state.dynamicState.crowdFavor + 1);
          logBattleEvent(state, `🏟️ Crowd Excitement increases! Favor level: ${state.dynamicState.crowdFavor}/10`, 'info');
        }

        if (state.dynamicState.crowdFavor >= 10) {
          state.dynamicState.crowdFavor = 0;
          logBattleEvent(state, `🏆 Crowd Favorite! The arena crowd cheers for your performance! All allies recover 30% Health and gain Offense Up (2 Turns)!`, 'buff');
          state.playerTeam.forEach(u => {
            if (u.activeInBattle && u.hp > 0) {
              u.hp = Math.min(u.maxHp, u.hp + Math.round(u.maxHp * 0.3));
              applyStatus(state, u, 'Offense Up', 2, false, null);
            }
          });
        }
      } else if (phase === 2) {
        // --- Phase 2: Droid Assembly Lines ---
        if (state.dynamicState.assemblyTurns === undefined) state.dynamicState.assemblyTurns = 0;
        state.dynamicState.assemblyTurns++;

        if (state.dynamicState.assemblyTurns % 4 === 0) {
          logBattleEvent(state, `🤖 Factory Output: The automated conveyor belt rolls out a brand new B1 Battle Droid support reinforcement!`, 'summon');
          const officer = state.enemyTeam.find(u => u.hp > 0);
          if (officer) {
            triggerSummon(state, officer, 'b1_battle_droid');
          }
        }
      } else if (phase === 3) {
        // --- Phase 3: Hive Network Foundry Core ---
        const poggle = state.enemyTeam.find(u => u.characterId === 'poggle_the_lesser');
        const core = state.enemyTeam.find(u => u.characterId === 'droid_foundry_core');
        if (poggle && poggle.hp > 0 && core && core.hp > 0) {
          if (!core.statuses.some(s => s.name === 'Damage Immunity')) {
            logBattleEvent(state, `🛡️ Foundry Security active: The Foundry Core is immune to damage while Poggle the Lesser is alive!`, 'info');
            applyStatus(state, core, 'Damage Immunity', 99, false, null);
          }
        } else if ((!poggle || poggle.hp <= 0) && core && core.hp > 0) {
          if (core.statuses.some(s => s.name === 'Damage Immunity')) {
            logBattleEvent(state, `🔓 Security Overridden: Poggle has been defeated! The Foundry Core's shields are DOWN!`, 'heal');
            core.statuses = core.statuses.filter(s => s.name !== 'Damage Immunity');
          }
        }
      }
      break;
    }

    case 'battle_of_hoth': {
      if (phase === 1) {
        // --- Phase 1: Blizzard Conditions ---
        if (state.dynamicState.blizzardTurns === undefined) state.dynamicState.blizzardTurns = 0;
        state.dynamicState.blizzardTurns++;

        if (state.dynamicState.blizzardTurns % 2 === 0) {
          logBattleEvent(state, `❄️ Blizzard Conditions: Freezing winds grant random Rebel fighters Foresight!`, 'info');
          state.enemyTeam.forEach(enemy => {
            if (enemy.activeInBattle && enemy.hp > 0 && Math.random() < 0.4) {
              applyStatus(state, enemy, 'Foresight', 1, false, null);
            }
          });
        }
      } else if (phase === 2) {
        // --- Phase 2: Walker Advance ---
        if (state.dynamicState.walkerTurns === undefined) state.dynamicState.walkerTurns = 0;
        state.dynamicState.walkerTurns++;

        logBattleEvent(state, `🤖 AT-AT Walker Advance: Stacking tactical support! All Imperial allies gain +5% Offense!`, 'buff');
        state.playerTeam.forEach(u => {
          if (u.activeInBattle && u.hp > 0) {
            applyStatus(state, u, 'Offense Up', 2, false, null);
          }
        });
      } else if (phase === 3) {
        // --- Phase 3: Air Combat Wing ---
        if (state.dynamicState.harpoonTurns === undefined) state.dynamicState.harpoonTurns = 0;
        state.dynamicState.harpoonTurns++;

        if (state.dynamicState.harpoonTurns % 3 === 0) {
          logBattleEvent(state, `🎯 TOW CABLE HARPOON! Snowspeeders circle a player unit and deploy magnetic harpoon cables!`, 'debuff');
          const activeAllies = state.playerTeam.filter(u => u.activeInBattle && u.hp > 0);
          if (activeAllies.length > 0) {
            const victim = activeAllies[Math.floor(Math.random() * activeAllies.length)];
            applyStatus(state, victim, 'Speed Down', 2, true, null);
            applyStatus(state, victim, 'Daze', 2, true, null);
            logBattleEvent(state, `🚨 ${victim.name} is ensnared and Dazed! Speed dramatically reduced!`, 'debuff');
          }
        }
      }
      break;
    }

    case 'spark_eternal_raid': {
      if (phase === 1) {
        // --- Phase 1: Ancient Technology ---
        if (state.dynamicState.artifactTurns === undefined) state.dynamicState.artifactTurns = 0;
        state.dynamicState.artifactTurns++;

        if (state.dynamicState.artifactTurns % 3 === 0) {
          logBattleEvent(state, `🏺 Ancient Artifact Activating! Pulsing energy fills the vault, granting critical boosts!`, 'buff');
          const allUnits = [...state.playerTeam, ...state.enemyTeam].filter(u => u.activeInBattle && u.hp > 0);
          if (allUnits.length > 0) {
            const lucky = allUnits[Math.floor(Math.random() * allUnits.length)];
            applyStatus(state, lucky, 'Critical Chance Up', 2, false, null);
            applyStatus(state, lucky, 'Critical Damage Up', 2, false, null);
            logBattleEvent(state, `✨ ${lucky.name} absorbs the relic's energy! Gains Critical buffs!`, 'buff');
          }
        }
      } else if (phase === 2) {
        // --- Phase 2: Artifact Control ---
        if (state.dynamicState.controlTurns === undefined) state.dynamicState.controlTurns = 0;
        state.dynamicState.controlTurns++;

        if (state.dynamicState.controlTurns % 4 === 0) {
          logBattleEvent(state, `💎 Relic Recovered! Strategic advantage secured! All player units gain +15% Turn Meter!`, 'buff');
          state.playerTeam.forEach(u => {
            if (u.activeInBattle && u.hp > 0 && !hasStatusFlag(u, 'prevent_tm_gain')) {
              u.turnMeter = Math.min(100, u.turnMeter + 15);
            }
          });
        }
      } else if (phase === 3) {
        // --- Phase 3: Possession Frequency ---
        if (state.dynamicState.possessTurns === undefined) state.dynamicState.possessTurns = 0;
        state.dynamicState.possessTurns++;

        if (state.dynamicState.possessTurns % 4 === 0) {
          logBattleEvent(state, `👾 Spark Eternal Possession! A corrupted digital frequency invades droid interfaces!`, 'debuff');
          const droids = [...state.playerTeam, ...state.enemyTeam].filter(u => u.activeInBattle && u.hp > 0 && u.tags.includes('Droid'));
          if (droids.length > 0) {
            const victim = droids[Math.floor(Math.random() * droids.length)];
            logBattleEvent(state, `☣️ Corrupted Spark Possesses ${victim.name}! They gain massive Offense (+50%) but lose -25% Defense!`, 'ultimate');
            applyStatus(state, victim, 'Offense Up', 2, false, null);
            applyStatus(state, victim, 'Defense Down', 2, true, null);
          }
        }
      }
      break;
    }
  }
}

export function decrementStatusDurations(state: CombatState, unit: CombatUnit) {
  unit.statuses.forEach(s => {
    // Thermal Detonator explosions occur right before they expire
    if (s.name === 'Thermal Detonator' && s.duration === 1) {
      const bombDmg = Math.round(unit.maxHp * 0.20 * (s.count || 1));
      logBattleEvent(state, `💣 Thermal Detonator explodes on ${unit.name} for ${bombDmg} damage!`, 'damage', unit.id, undefined, bombDmg, false);
      
      // Detonators bypass defense but hit protection first
      if (unit.protection > 0) {
        const shieldDmg = Math.min(unit.protection, bombDmg);
        unit.protection -= shieldDmg;
        const remainingDmg = bombDmg - shieldDmg;
        if (remainingDmg > 0) {
          unit.hp = Math.max(0, unit.hp - remainingDmg);
        }
      } else {
        unit.hp = Math.max(0, unit.hp - bombDmg);
      }
      checkDefeat(state, unit, null);
    }
    s.duration--;
  });
  
  // Plagued is only dispelled when healed to full, not strictly by duration, but we'll let it naturally expire or clear here if health is max
  const isFullHealth = unit.hp === unit.maxHp;
  if (isFullHealth) {
    const prePlagueCount = unit.statuses.length;
    unit.statuses = unit.statuses.filter(s => s.name !== 'Plague');
    if (unit.statuses.length < prePlagueCount) {
      logBattleEvent(state, `${unit.name} was healed to full Health! Plague dispelled.`, 'info');
    }
  }

  // Discard expired
  const expired = unit.statuses.filter(s => s.duration <= 0);
  expired.forEach(s => {
    if (s.name !== 'Thermal Detonator') { // already logged the boom
      logBattleEvent(state, `${unit.name} status expired: ${s.name}`, 'info');
    }
  });
  unit.statuses = unit.statuses.filter(s => s.duration > 0);

  // Quiggold Taunt expiration Protection recovery
  if (unit.characterId === 'quiggold' && expired.some(s => s.name === 'Taunt')) {
     const rec = Math.round(unit.maxProtection * 0.15);
     unit.protection = Math.min(unit.maxProtection, unit.protection + rec);
     logBattleEvent(state, `🛡️ Veteran Protector: Taunt expired on Quiggold! Recovering 15% Protection (${rec})!`, 'heal');
  }

  // Check Fatigue expiration recovery
  const fatiguedExpired = expired.some(s => s.name === 'Fatigued');


  // Check Whiteout expiration
  const whiteoutExpired = expired.some(s => s.name === 'Whiteout');
  if (whiteoutExpired) {
      const squad = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
      const rime = squad.find(u => u.characterId === 'captain_rime' && u.activeInBattle && u.hp > 0);
      if (rime && !hasStatusFlag(rime, 'prevent_tm_gain')) {
          rime.turnMeter = Math.min(100, rime.turnMeter + 5);
      }
  }

  // Check Lockdown expiration
  const lockdownExpired = expired.some(s => s.name === 'Lockdown');
  if (lockdownExpired) {
     onLockdownRemoved(state, unit);
  }

  if (fatiguedExpired) {
     unit.hp = unit.maxHp;
     unit.protection = unit.maxProtection;
     logBattleEvent(state, `🌟 Fatigue expired! ${unit.name} recovers 100% HP and Protection and gains Pathfinder!`, 'heal');
     applyStatus(state, unit, 'Pathfinder', 99, false);

     // Rex Veteran Commander recovery bonus
     if (unit.characterId === 'captain_rex') {
        const allies = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
        allies.forEach(a => {
           if (a.activeInBattle && a.hp > 0 && !hasStatusFlag(a, 'prevent_prot_recovery')) {
              const rec = Math.round(a.maxProtection * 0.15);
              a.protection = Math.min(a.maxProtection, a.protection + rec);
              logBattleEvent(state, `💚 Rex veteran leadership: ${a.name} recovers 15% Protection!`, 'heal');
           }
        });
     }

     // Echo Living Databank bonus turn when leader recovers
     const isLeaderWord = unit.characterId === 'general_skywalker' || unit.characterId === 'captain_rex';
     if (isLeaderWord) {
        const allies = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
        const echo = allies.find(u => u.characterId === 'echo_501st' && u.activeInBattle && u.hp > 0);
        if (echo) {
           echo.turnMeter = 100;
           logBattleEvent(state, `⚡ Living Databank: Echo gains a Bonus Turn (Leader recovered from Fatigue)!`, 'buff');
        }
     }

     // General Skywalker unique: gains Offense Up (2 Turns) on Fatigue recovery
     if (unit.characterId === 'general_skywalker') {
        applyStatus(state, unit, 'Offense Up', 2, false);
     }
  }

  // Check Pathfinder to Fatigued transition
  checkPathfinderToFatigued(state, unit);
  
  checkDefeat(state, unit, null);
}

// Find appropriate targets
export function grabValidTargets(unit: CombatUnit, state: CombatState): CombatUnit[] {
  const oppTeam = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
  let alive = oppTeam.filter(u => u.activeInBattle && u.hp > 0);

  // Special Duel override
  if (state.dynamicState?.isDuelActive) {
     if (unit.characterId === 'old_ben') {
        const vader = oppTeam.find(u => u.characterId === 'darth_vader' && u.hp > 0);
        if (vader) return [vader];
     }
     if (unit.characterId === 'darth_vader') {
        const oldBen = oppTeam.find(u => u.characterId === 'old_ben' && u.hp > 0);
        if (oldBen) return [oldBen];
     }
  }

  // Palpatine unique: Cannot be targeted while another Coruscant Guard ally is active
  const hasPalp = alive.some(u => u.characterId === 'chancellor_palpatine_journey');
  if (hasPalp) {
     const hasOtherCG = alive.some(u => u.characterId !== 'chancellor_palpatine_journey' && checkHasTag(u, 'Coruscant Guard'));
     if (hasOtherCG) {
        alive = alive.filter(u => u.characterId !== 'chancellor_palpatine_journey');
     }
  }

  // Check for Taunting or Marked enemies (Marked overrides Stealth, Taunt doesn't technically but Marked acts as forced taunt)
  const forcedTargets = alive.filter(u => hasStatusFlag(u, 'marked'));
  if (forcedTargets.length > 0) return forcedTargets;

  const taunts = alive.filter(u => hasStatusFlag(u, 'taunt'));
  if (taunts.length > 0) {
      let valid = [...taunts];
      if (unit.characterId === 'barriss_offee') {
         const investigated = alive.filter(u => u.statuses.some(s => s.name === 'Investigation'));
         investigated.forEach(inv => {
            if (!valid.find(v => v.id === inv.id)) valid.push(inv);
         });
      }
      return valid;
  }

  // Standard targets (filter out stealth unless all are stealth)
  const isSqueakyPayout = unit.characterId === 'navrokk' && unit.statuses.some(s => s.name === 'Payout');
  if (isSqueakyPayout) {
     return alive;
  }
  const nonStealthes = alive.filter(u => !hasStatusFlag(u, 'stealth'));
  if (nonStealthes.length > 0) return nonStealthes;

  return alive;
}

// Triggers revive loop inside boundaries protecting from loops
export function executeRevive(state: CombatState, unit: CombatUnit, healer: CombatUnit | null = null, hpPct = 0.5) {
  const currentTimes = state.reviveCounts[unit.id] || 0;
  if (currentTimes >= MAX_REVIVE_PER_UNIT) {
    logBattleEvent(state, `${unit.name} has exceeded the revive limit of ${MAX_REVIVE_PER_UNIT} times!`, 'info');
    return;
  }

  state.reviveCounts[unit.id] = currentTimes + 1;
  unit.activeInBattle = true;
  unit.hp = Math.round(unit.maxHp * hpPct);
  unit.protection = Math.round(unit.maxProtection * hpPct);
  unit.statuses = [];
  logBattleEvent(state, `${unit.name} was revived at ${Math.round(hpPct * 100)}% stats!`, 'heal');
}

export function checkDefeat(state: CombatState, target: CombatUnit, attacker: CombatUnit | null) {
  if (target.hp <= 0 && target.activeInBattle) {
    if (customDefeatHooks[target.characterId]) {
      customDefeatHooks[target.characterId](state, target, attacker);
      if (target.hp > 0 || !target.activeInBattle) return; // Prevented defeat
    }

    if (target.characterId === 'ima_gun_di') {
       if (!target.dynamicState) target.dynamicState = {};
       if (!target.dynamicState.hasRevivedFromDeath) {
          target.dynamicState.hasRevivedFromDeath = true;
          target.hp = Math.round(target.maxHp * 0.50);
          logBattleEvent(state, `🛡️ There Is Still Hope: Ima-Gun Di prevents defeat and recovers 50% Health!`, 'heal');
          return;
       }
    }

    target.activeInBattle = false;
    logBattleEvent(state, `💀 ${target.name} has been DEFEATED!`, 'death');

    // Quinlan Vos bonus turn when another Jedi High Council ally is defeated
    if (target.tags.includes('Jedi High Council') || checkHasTag(target, 'Jedi High Council')) {
       const allies = target.team === 'player' ? state.playerTeam : state.enemyTeam;
       const quinlan = allies.find(u => u.characterId === 'quinlan_vos' && u.activeInBattle && u.hp > 0);
       if (quinlan) {
          state.bonusTurnQueue.push(quinlan.id);
          logBattleEvent(state, `🕵️ Master Of Disguises: High Council ally was defeated! Quinlan Vos gains a BONUS turn.`, 'buff');
       }
    }

    // Ima-Gun Di defeat triggers
    if (target.characterId === 'ima_gun_di') {
       const allies = target.team === 'player' ? state.playerTeam : state.enemyTeam;
       allies.forEach(ally => {
          if (ally.activeInBattle && ally.hp > 0 && (ally.tags.includes('Clone Trooper') || checkHasTag(ally, 'Clone Trooper'))) {
             if (!hasStatusFlag(ally, 'prevent_tm_gain')) {
                ally.turnMeter = Math.min(100, ally.turnMeter + 50);
             }
             applyStatus(state, ally, 'Offense Up', 3, false);
             applyStatus(state, ally, 'Defense Up', 3, false);
             ally.hp = ally.maxHp;
             logBattleEvent(state, `🛡️ The Last Stand: Clone Trooper ally ${ally.name} gains 50% TM, Offense Up & Defense Up (3 turns), and recovers Max Health!`, 'heal');
          }
       });
    }

    // Generic Clone Trooper death trigger
    if (target.tags.includes('Clone Trooper') || checkHasTag(target, 'Clone Trooper')) {
       const allies = target.team === 'player' ? state.playerTeam : state.enemyTeam;
       allies.forEach(ally => {
          if (ally.activeInBattle && ally.hp > 0 && (ally.tags.includes('Clone Trooper') || checkHasTag(ally, 'Clone Trooper'))) {
             ally.hp = ally.maxHp;
             applyStatus(state, ally, 'Offense Up', 2, false);
             logBattleEvent(state, `🛡️ Last Defense Of Ryloth: Clone Trooper ally ${ally.name} recovers Max Health and gains Offense Up (2 turns)!`, 'heal');
          }
       });
    }

    // Kenobi unique Master of Soresu: "Whenever Master Kenobi defeats an enemy, all Jedi High Council allies gain Council Guidance."
    if (attacker && attacker.characterId === 'master_kenobi') {
       const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
       allies.forEach(a => {
          if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Jedi High Council') || checkHasTag(a, 'Jedi High Council'))) {
             applyStatus(state, a, 'Council Guidance', 99, false, attacker);
          }
       });
       logBattleEvent(state, `🛡️ Master of Soresu: Master Kenobi defeated an enemy! All Jedi High Council allies gain Council Guidance.`, 'buff');
    }

    // Aayla unique Grace In Motion: "Whenever Aayla defeats an enemy, gain Council Guidance."
    if (attacker && attacker.characterId === 'aayla_secura') {
       applyStatus(state, attacker, 'Council Guidance', 99, false, attacker);
       logBattleEvent(state, `🤸 Grace In Motion: Aayla Secura defeated an enemy and gains Council Guidance!`, 'buff');
    }

    // Adi unique Decisive Action: "Whenever an enemy is defeated, Adi gains Council Guidance."
    if (attacker && target.team !== attacker.team) {
       const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
       const adi = allies.find(u => u.characterId === 'adi_gallia' && u.activeInBattle && u.hp > 0);
       if (adi) {
          applyStatus(state, adi, 'Council Guidance', 99, false, adi);
          logBattleEvent(state, `🤺 Decisive Action: An enemy was defeated! Adi Gallia gains Council Guidance.`, 'buff');
       }
    }

    // Conquest Disk: Ruthless Swiftness
    if (target.team === 'enemy' && state.conquestDataDisks?.includes('dd_ruthless_swiftness')) {
       state.playerTeam.filter(u => u.activeInBattle).forEach(u => {
          u.turnMeter = Math.min(1000, (u.turnMeter || 0) + 500);
       });
       logBattleEvent(state, `Ruthless Swiftness grants all player units 50% Turn Meter!`, 'buff');
    }

    // Plo Koon leader: Whenever a Marked or Ambushed enemy is defeated: Wolfpack allies gain 10% Turn Meter.
    if (target.statuses.some(s => s.name === 'Marked' || s.name === 'Ambushed')) {
       const oppSquad = target.team === 'player' ? state.enemyTeam : state.playerTeam;
       const leader = oppSquad.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
       if (leader && leader.characterId === 'plo_koon_journey') {
          logBattleEvent(state, `👑 Leader Passive: Marked/Ambushed enemy defeated! Wolfpack allies gain 10% Turn Meter.`, 'buff');
          oppSquad.forEach(u => {
             if (checkHasTag(u, 'Wolfpack') && u.activeInBattle && u.hp > 0 && !hasStatusFlag(u, 'prevent_tm_gain')) {
                u.turnMeter = Math.min(100, u.turnMeter + 10);
             }
          });
       }
    }

    // Trigger Fives sacrifice clause
    if (target.team === 'player' && checkHasTag(target, '501st') && target.characterId !== 'fives') {
      const fives = state.playerTeam.find(u => u.characterId === 'fives' && u.activeInBattle);
      if (fives) {
        logBattleEvent(state, `For the Republic! Fives sacrifices himself to save ${target.name}!`, 'info');
        executeRevive(state, target, fives, 0.4);
        fives.hp = Math.max(1, fives.hp - Math.round(fives.maxHp * 0.3));
        target.protection = Math.round(target.maxProtection * 0.25);
        return;
      }
    }

    // Trigger General Kenobi resolve
    if (target.characterId === 'master_kenobi') {
       // already processed or standard death
    }

    if (target.team === 'enemy' && state.totalScore !== undefined) {
      state.totalScore += 2500; // Points for killing an opponent
    }

    // Check game condition
    // Chancellor Palpatine retreat logic: If he is the last surviving non-summon ally, he retreats from battle
    const playerActive = state.playerTeam.filter(u => u.activeInBattle && u.hp > 0 && !checkHasTag(u, 'summon'));
    const enemyActive = state.enemyTeam.filter(u => u.activeInBattle && u.hp > 0 && !checkHasTag(u, 'summon'));

    if (playerActive.length === 1 && playerActive[0].characterId === 'chancellor_palpatine_journey') {
       playerActive[0].hp = 0;
       playerActive[0].activeInBattle = false;
       logBattleEvent(state, `🏛️ Chancellor Palpatine retreats from battle, having no surviving forces to command!`, 'info');
    }
    if (enemyActive.length === 1 && enemyActive[0].characterId === 'chancellor_palpatine_journey') {
       enemyActive[0].hp = 0;
       enemyActive[0].activeInBattle = false;
       logBattleEvent(state, `🏛️ Chancellor Palpatine retreats from battle, having no surviving forces to command!`, 'info');
    }

    const playerAliveNonSummon = state.playerTeam.some(u => u.activeInBattle && u.hp > 0 && !checkHasTag(u, 'summon'));
    const enemyAliveNonSummon = state.enemyTeam.some(u => u.activeInBattle && u.hp > 0 && !checkHasTag(u, 'summon'));

    if (!playerAliveNonSummon) {
      state.ended = true;
      state.winner = 'enemy';
      logBattleEvent(state, '❌ Victory to the Enemy forces!', 'death');
      // Clear out surviving summons
      state.playerTeam.forEach(u => { if (checkHasTag(u, 'summon') && u.activeInBattle) { u.hp = 0; u.activeInBattle = false; }});
    } else if (!enemyAliveNonSummon) {
      state.ended = true;
      state.winner = 'player';
      logBattleEvent(state, '🏆 Squad Defeated! Galactic Victory achieved!', 'death');
      // Clear out surviving summons
      state.enemyTeam.forEach(u => { if (checkHasTag(u, 'summon') && u.activeInBattle) { u.hp = 0; u.activeInBattle = false; }});
    }
  }
}

// Core execution handler of an action
export function executeCombatAction(
  state: CombatState,
  attackerId: string,
  ability: Ability,
  targetId: string,
  targetAllyId?: string,
  assistDepth = 0,
  counterDepth = 0
) {
  if (state.ended) return;

  if (!state.turnAttackers) state.turnAttackers = [];
  if (!state.turnAttackers.includes(attackerId)) {
     state.turnAttackers.push(attackerId);
  }

  const allUnits = [...state.playerTeam, ...state.enemyTeam];
  const attacker = allUnits.find(u => u.id === attackerId);
  let target = allUnits.find(u => u.id === targetId);

  if (!attacker || !target || !attacker.activeInBattle || attacker.hp <= 0) {
    return;
  }

  // Keller Unique: Whenever a Feared enemy attacks: Keller gains 5% Turn Meter.
  if (attacker.statuses.some(s => s.name === 'Fear')) {
     const oppSquad = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
     const keller = oppSquad.find(u => u.characterId === 'keller' && u.activeInBattle && u.hp > 0);
     if (keller && !hasStatusFlag(keller, 'prevent_tm_gain')) {
        keller.turnMeter = Math.min(100, keller.turnMeter + 5);
        logBattleEvent(state, `🛡️ Veteran Of Mygeeto: Keller gains 5% Turn Meter from Feared enemy attacking!`, 'buff');
     }
  }

  // Keller Unique: Keller gains 20% Turn Meter whenever a Galactic Marine ally executes an out-of-turn attack.
  if ((assistDepth > 0 || counterDepth > 0) && (attacker.tags.includes('Galactic Marines') || checkHasTag(attacker, 'Galactic Marines'))) {
     const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
     const keller = allies.find(u => u.characterId === 'keller' && u.activeInBattle && u.hp > 0);
     if (keller && !hasStatusFlag(keller, 'prevent_tm_gain')) {
        keller.turnMeter = Math.min(100, keller.turnMeter + 20);
        logBattleEvent(state, `🛡️ Veteran Of Mygeeto: Keller gains 20% Turn Meter from Galactic Marine out-of-turn attack!`, 'buff');
     }
  }

  // Validate Target (Taunt / Stealth check) only for explicit player actions (depth 0)
  if (assistDepth === 0 && counterDepth === 0) {
     const validTargets = grabValidTargets(attacker, state);
     const isValid = validTargets.some(t => t.id === target?.id);
     if (!isValid && validTargets.length > 0) {
        // Reroute to a valid target (e.g. forced Taunt)
        target = validTargets[0];
     }
  }

  const targetAlly = targetAllyId ? allUnits.find(u => u.id === targetAllyId) : undefined;

  // Backstop safety validations
  if (hasStatusFlag(attacker, 'skip_turn')) {
    logBattleEvent(state, `❄️ Action Blocked: ${attacker.name} is incapacitated and cannot execute actions!`, 'debuff');
    if (attacker.statuses.some(s => s.name === 'Fear')) {
       attacker.statuses = attacker.statuses.filter(s => s.name !== 'Fear');
       attacker.turnMeter = Math.max(0, attacker.turnMeter - 20); // Fear usually drains some TM/skips and clears
    }
    return;
  }

  if (hasStatusFlag(attacker, 'prevent_special') && ability.type !== 'basic') {
    logBattleEvent(state, `🔇 Action Blocked: ${attacker.name} is under ABILITY BLOCK and can only use Basic abilities!`, 'debuff');
    return;
  }

  if (targetAllyId && targetAlly) {
    logBattleEvent(state, `⚡ ${attacker.name} uses ${ability.name} targeting ${targetAlly.name} (acting against ${target.name})`, 'info');
  } else {
    logBattleEvent(state, `⚡ ${attacker.name} uses ${ability.name} on ${target.name}`, 'info');
  }

  // Ki-Adi-Mundi Journey Leader: Whenever a Galactic Marine ally attacks a Feared enemy: Recover 5% Health
  if (target.statuses.some(s => s.name === 'Fear') && (attacker.tags.includes('Galactic Marines') || checkHasTag(attacker, 'Galactic Marines'))) {
     const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
     const kamLeader = squad.find(u => u.characterId === 'ki_adi_mundi_journey' && u.position === 0 && u.activeInBattle && u.hp > 0);
     if (kamLeader) {
        const healAmt = Math.round(attacker.maxHp * 0.05);
        attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmt);
        logBattleEvent(state, `🧠 The Cost Of Victory: ${attacker.name} attacks Feared enemy and recovers 5% Health (${healAmt})!`, 'heal');
     }
  }

  // Set ability cooldown if it is greater than 0
  if (ability.cooldown > 0) {
    attacker.cooldowns[ability.id] = ability.cooldown;
  }

  // Fives Protection Recovery on Counterattack
  if (attacker.characterId === 'fives' && counterDepth > 0 && !hasStatusFlag(attacker, 'prevent_prot_recovery')) {
     const rec = Math.round(attacker.maxProtection * 0.03);
     attacker.protection = Math.min(attacker.maxProtection, attacker.protection + rec);
     logBattleEvent(state, `💚 Unbreakable Resolve: Fives recovers ${rec} Protection from counterattacking!`, 'heal');
  }

  // Reveth out-of-turn attack Turn Meter gain
  if ((assistDepth > 0 || counterDepth > 0) && (attacker.tags.includes('Corsair') || checkHasTag(attacker, 'Corsair'))) {
     const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
     const reveth = allies.find(u => u.characterId === 'reveth' && u.activeInBattle && u.hp > 0);
     if (reveth && !hasStatusFlag(reveth, 'prevent_tm_gain')) {
        reveth.turnMeter = Math.min(100, reveth.turnMeter + 5);
        logBattleEvent(state, `🧭 Master Navigator: Corsair ally attacked out of turn! Reveth gains 5% Turn Meter.`, 'buff');
     }
  }

  // 501st Special Ability Used trigger hook
  if (ability.type === 'special' && assistDepth === 0 && counterDepth === 0) {
     onSpecialAbilityUsed(state, attacker);

     // Thrawn Predicted logic for Spectre special abilities
     const isSpectre = checkHasTag(attacker, 'Spectre') || checkHasTag(attacker, 'Spectre / Rebel') || checkHasTag(attacker, 'Spectres') || ['general_hera', 'chopper', 'sabine_apprentice', 'zeb_nr', 'ezra_exile', 'huyang', 'ahsoka_tano_grey'].includes(attacker.characterId);
     if (isSpectre) {
        const oppTeam = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
        const thrawn = oppTeam.find(u => u.characterId === 'thrawn_remnant' && u.activeInBattle && u.hp > 0);
        if (thrawn) {
           logBattleEvent(state, `🔮 Tactician's Foresight: Grand Admiral Thrawn predicts ${attacker.name}'s maneuvers! Inflicting Predicted (1 turn).`, 'debuff');
           applyStatus(state, attacker, 'Predicted', 1, true, thrawn);
        }
     }
  }
  
  if (ability.type === 'ultimate') {
    attacker.ultimateCharge = 0;
  }
  
  if (ability.type === 'special' && checkHasTag(attacker, 'Knightfall')) {
     const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
     const lvAllies = squad.filter(u => u.characterId === 'gl_lord_vader' && u.activeInBattle && u.hp > 0);
     lvAllies.forEach(lv => {
         lv.turnMeter = Math.min(100, lv.turnMeter + 5);
     });
  }

  const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);

  const isEnemies = (ability.effects.join(' ') + ' ' + ability.desc).toLowerCase().includes('enemies') || 
                    (ability.effects.join(' ') + ' ' + ability.desc).toLowerCase().includes('damage_aoe') || 
                    (ability.effects.join(' ') + ' ' + ability.desc).toLowerCase().includes('debuff_all') ||
                    ability.aiTags.includes('aoe');

  const targetsToDamage = (isEnemies && (ability.desc.toLowerCase().includes('damage') || ability.effects.some(e => e.toLowerCase().includes('damage'))))
    ? (attacker.team === 'player' ? state.enemyTeam : state.playerTeam).filter(e => e.activeInBattle && e.hp > 0)
    : [target];

  // Calculate damage
  let isCrit = false;
  let finalDamage = 0;

  targetsToDamage.forEach(currentTarget => {
    const tarStats = getModifiedStats(currentTarget, currentTarget.team === 'player' ? state.playerTeam : state.enemyTeam);
    let currentCrit = false;
    let currentFinalDamage = 0;

    if (ability.effects.some(e => e.includes('true_damage')) || ability.effects.some(e => e.includes('True Damage'))) {
      // True Damage bypasses defense/protection completely
      currentFinalDamage = Math.round(attStats.offense * 1.5);
      currentTarget.hp = Math.max(0, currentTarget.hp - currentFinalDamage);
      logBattleEvent(state, `${currentTarget.name} suffered ${currentFinalDamage} TRUE DAMAGE!`, 'damage', currentTarget.id, attacker.id, currentFinalDamage, false);
    } else {
      // Normal damage calculation
      let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);

      // Scorch Knightfall: Burning enemies deal 25% less damage
      if (attacker.statuses.some(s => s.name === 'Burning')) {
          const oppSquad = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
          const scorch = oppSquad.find(u => u.characterId === 'scorch_knightfall' && u.activeInBattle && u.hp > 0);
          if (scorch) {
              const lv = oppSquad.find(u => u.characterId === 'gl_lord_vader' && u.activeInBattle && u.hp > 0);
              if (lv) {
                  baseDmg = Math.round(baseDmg * 0.75);
              }
          }
      }

      // Krennic Lead: Enemies with Dossier deal 20% less damage
      if (attacker.statuses.some(s => s.name === 'Dossier')) {
          const oppSquad = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
          const krennicLead = oppSquad.find(u => u.characterId === 'director_krennic' && u.position === 0 && u.activeInBattle && u.hp > 0);
          if (krennicLead) {
              baseDmg = Math.round(baseDmg * 0.80);
          }
      }

      // KX Security Droid Unique 2: Takes 20% less damage from enemies with Dossier
      if (target.characterId === 'kx_security_droid' && attacker.statuses.some(s => s.name === 'Dossier')) {
          baseDmg = Math.round(baseDmg * 0.80);
      }

      if (ability.desc.toLowerCase().includes('no damage') || (!ability.effects.some(e => e.toLowerCase().includes('damage')) && (ability.aiTags.includes('defensive') || ability.aiTags.includes('heal') || ability.aiTags.includes('buff')))) {
         baseDmg = 0;
      }
      
      // Blind: attacks miss
      const isBlind = attacker.statuses.some(s => s.name === 'Blind');
      const isSqueakyPayout = attacker.characterId === 'navrokk' && attacker.statuses.some(s => s.name === 'Payout');
      const hasForesight = isSqueakyPayout ? false : hasStatusFlag(currentTarget, 'evade_next');
      
      if (hasForesight && ability.type !== 'ultimate') {
        logBattleEvent(state, `💨 ${currentTarget.name} used FORESIGHT to evade the attack!`, 'info');
        currentTarget.statuses = currentTarget.statuses.filter(s => s.name !== 'Foresight'); // Technically should filter by flag, but doing so directly is safe here
        baseDmg = 0;
      } else if (isBlind) {
        logBattleEvent(state, `💨 ${attacker.name} is BLIND and missed the attack!`, 'info');
        baseDmg = 0;
      }

      if (baseDmg === 0 && currentTarget.characterId === 'hunter' && !hasStatusFlag(currentTarget, 'prevent_tm_gain')) {
          currentTarget.turnMeter = Math.min(100, currentTarget.turnMeter + 10);
      }


      // Intimidated: reduced damage
      const isIntimidated = attacker.statuses.some(s => s.name === 'Intimidated');
      if (isIntimidated) {
        baseDmg *= 0.5;
      }
      
      if (baseDmg > 0) {
          let critRoll = Math.random();
          
          // Advantage forces crit, then consumes
          const hasAdvantage = hasStatusFlag(attacker, 'guaranteed_crit');
          if (hasAdvantage) {
             critRoll = 0;
             attacker.statuses = attacker.statuses.filter(s => !STATUS_DEFINITIONS[s.name] || !STATUS_DEFINITIONS[s.name].flags.includes('consume_on_attack'));
          }

          // Vulnerable: automatically crits
          if (currentTarget.statuses.some(s => s.name === 'Vulnerable')) {
             critRoll = 0; 
          }

          let currentCritDmg = attStats.critDamage;
          // Biggs Darklighter Lead: Red Squadron allies gain 20% Critical Damage against Marked Target
          if (currentTarget.statuses.some(s => s.name === 'Marked Target') && (checkHasTag(attacker, 'Red Squadron') || attacker.tags.includes('Red Squadron'))) {
             const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
             const leader = squad.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
             if (leader && leader.characterId === 'biggs') {
                 currentCritDmg += 0.20;
             }
          }

          // Keller Unique: +25% Critical Damage
          if (attacker.characterId === 'keller') {
              currentCritDmg += 0.25;
          }

          // Ki-Adi-Mundi Unique: +20% Critical Damage for Galactic Marines
          const kamSquad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
          const isKamActive = kamSquad.some(u => u.characterId === 'ki_adi_mundi_journey' && u.activeInBattle && u.hp > 0);
          if (isKamActive && (attacker.tags.includes('Galactic Marines') || checkHasTag(attacker, 'Galactic Marines'))) {
              currentCritDmg += 0.20;
          }

          if (critRoll < attStats.critChance) {
            currentCrit = true;
            baseDmg *= currentCritDmg;
          }

          // Armor Mitigation
          // tarStats.defense is already modified by Defense Up/Down/Shattered in getModifiedStats
          let targetDefense = tarStats.defense;
          if (attacker.characterId === 'pendewqell' && attacker.statuses.some(s => s.name === 'Payout')) {
             targetDefense *= 0.65; // ignore 35% defense
          }
          if (currentTarget.statuses.some(s => s.name === 'Lockdown')) {
             if (attacker.characterId === 'commander_thorn') {
                targetDefense *= 0.80; // ignore 20% defense
             }
             
             const team = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
             const tarkin = team.find(u => u.characterId === 'gl_tarkin' && u.activeInBattle && u.hp > 0);
             if (tarkin && checkHasTag(attacker, 'Coruscant Guard')) {
                targetDefense *= 0.50; // ignore 50% defense
             }
          }
          const mitigationFactor = Math.max(0.1, 15000 / (15000 + targetDefense));
          currentFinalDamage = Math.round(baseDmg * mitigationFactor);

          // Keller Basic Multiplier: If target is under 50% Health, deal 50% more damage
          if (ability.id.startsWith('keller_b') && currentTarget.hp < currentTarget.maxHp * 0.5) {
              currentFinalDamage = Math.round(currentFinalDamage * 1.5);
          }
          
          // Knightfall Multipliers
          const hasKnightfall = checkHasTag(attacker, 'Knightfall');
          if (hasKnightfall) {
             const purgeStatus = currentTarget.statuses.find(s => s.name === 'Purge');
             if (purgeStatus) {
                 currentFinalDamage = Math.round(currentFinalDamage * 1.25);
             }
          }
          
          const order66Status = currentTarget.statuses.find(s => s.name === 'Order 66');
          if (order66Status) {
              const stacks = order66Status.count || 1;
              currentFinalDamage = Math.round(currentFinalDamage * (1 + (0.02 * stacks)));
          }

          // Conquest Data Disk: Amplified Agony (Debuffed Enemies Take Massive Damage)
          if (state.conquestDataDisks?.includes('dd_amplified_agony')) {
              const hasDebuff = currentTarget.statuses.some(s => s.duration > 0 && ['Damage Over Time', 'Stun', 'Ability Block', 'Vulnerable', 'Healing Immunity'].includes(s.name) || s.name.toLowerCase().includes('down'));
              if (hasDebuff) {
                 currentFinalDamage = Math.round(currentFinalDamage * 2.5);
              }
          }

          // Quinlan Vos damage bonuses and Quinlan/Barriss assist reductions
          if (attacker.characterId === 'quinlan_vos') {
             if (currentTarget.statuses.some(s => s.name === 'Arrest Warrant')) {
                currentFinalDamage = Math.round(currentFinalDamage * 1.25);
             }
          }
          if (attacker.characterId === 'navrokk' && attacker.statuses.some(s => s.name === 'Payout')) {
             const hasDebuff = currentTarget.statuses.some(s => ['Shock', 'Stun', 'Ability Block', 'Expose', 'Target Lock', 'Defense Down', 'Offense Down', 'Speed Down', 'Evasion Down', 'Tenacity Down', 'Potency Down', 'Plague', 'Fear', 'Intimidated', 'Burning', 'Predicted', 'Lockdown', 'Purge', 'Dossier'].includes(s.name) || s.name.toLowerCase().includes('down'));
             if (hasDebuff) {
                currentFinalDamage = Math.round(currentFinalDamage * 1.35);
             }
          }
          if (assistDepth > 0 && (attacker.characterId === 'quinlan_vos' || attacker.characterId === 'barriss_offee')) {
             currentFinalDamage = Math.round(currentFinalDamage * 0.50);
          }
          
          // Damage Immunity check
          if (hasStatusFlag(currentTarget, 'damage_immunity')) {
              currentFinalDamage = 0;
              logBattleEvent(state, `🛡️ ${currentTarget.name} absorbed the attack using DAMAGE IMMUNITY!`, 'info');
          }
      } else {
          currentFinalDamage = 0;
      }

      if (currentFinalDamage > 0) {
        const hpBefore = currentTarget.hp;

        // Riot Control & Lockdown Faction Status interaction
        if (attacker.statuses.some(s => s.name === 'Riot Control') && currentTarget.statuses.some(s => s.name === 'Lockdown')) {
           if (!hasStatusFlag(attacker, 'prevent_prot_recovery')) {
              const protRec = Math.round(attacker.maxProtection * 0.03);
              attacker.protection = Math.min(attacker.maxProtection, attacker.protection + protRec);
              logBattleEvent(state, `🛡️ Riot Control Status: ${attacker.name} recovers ${protRec} Protection by damaging a Locked Down enemy!`, 'heal');
           }
           if (!hasStatusFlag(attacker, 'prevent_tm_gain')) {
              attacker.turnMeter = Math.min(100, attacker.turnMeter + 2);
              logBattleEvent(state, `📈 Riot Control Status: ${attacker.name} gains 2% Turn Meter by damaging a Locked Down enemy!`, 'buff');
           }
        }
        if (attacker.relicLevel && attacker.relicLevel > 0) {
            const lifestealPct = attacker.relicLevel * 0.025; // 2.5% per relic level
            const healAmt = Math.round(currentFinalDamage * lifestealPct);
            if (healAmt > 0 && attacker.hp > 0 && !hasStatusFlag(attacker, 'prevent_heal')) {
               attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmt);
               logBattleEvent(state, `💚 ${attacker.name} stole ${healAmt} Health (Relic Lifesteal)!`, 'heal', attacker.id, undefined, healAmt, false);
            }
        }
        
        // 1. Calculate how much damage would hit protection and how much would hit health
        let healthDamage = 0;
        let protectionDamage = 0;

        if (currentTarget.protection > 0) {
          protectionDamage = Math.min(currentTarget.protection, currentFinalDamage);
          healthDamage = currentFinalDamage - protectionDamage;
        } else {
          healthDamage = currentFinalDamage;
        }

        // Check Negotiator redirection if there's health damage
        const targetAllies = currentTarget.team === 'player' ? state.playerTeam : state.enemyTeam;
        const negotiatorUnit = targetAllies.find(u => u.activeInBattle && u.hp > 0 && u.statuses.some(s => s.name === 'Negotiator') && u.protection > 0);

        if (healthDamage > 0 && negotiatorUnit) {
          // Redirect health damage to negotiatorUnit's protection!
          const redirectedDmg = Math.min(negotiatorUnit.protection, healthDamage);
          
          const preGKProt = negotiatorUnit.protection;
          negotiatorUnit.protection -= redirectedDmg;
          const postGKProt = negotiatorUnit.protection;

          logBattleEvent(state, `🛡️ Negotiator: Redirected ${redirectedDmg} Health damage from ${currentTarget.name} to ${negotiatorUnit.name}'s Protection!`, 'info');
          
          // Reduce the health damage that actually hits the target
          healthDamage -= redirectedDmg;

          // "Whenever General Kenobi loses Protection: Recover 2% Protection." (He is the negotiator unit)
          if (negotiatorUnit.characterId === 'general_kenobi' && preGKProt > postGKProt) {
            const gkRec = Math.round(negotiatorUnit.maxProtection * 0.02);
            negotiatorUnit.protection = Math.min(negotiatorUnit.maxProtection, negotiatorUnit.protection + gkRec);
            logBattleEvent(state, `🛡️ The Negotiator: General Kenobi loses Protection and recovers ${gkRec} (2%) Protection!`, 'heal');
          }

          // Waxer unique "Whenever allies lose Protection: Recover 5% Protection (to Waxer)."
          targetAllies.forEach(a => {
            if (a.characterId === 'waxer' && a.activeInBattle && a.hp > 0) {
              const waxerRec = Math.round(a.maxProtection * 0.05);
              a.protection = Math.min(a.maxProtection, a.protection + waxerRec);
              logBattleEvent(state, `🧒 Looking Out For The Little Guy: Waxer recovers ${waxerRec} (5%) Protection!`, 'heal');
            }
          });
        }

        // Apply the actual protection damage to target if any
        if (protectionDamage > 0) {
          const preProt = currentTarget.protection;
          currentTarget.protection -= protectionDamage;
          const postProt = currentTarget.protection;

          // Waxer unique: Whenever allies lose protection: Recover 5% Protection
          if (preProt > postProt) {
            targetAllies.forEach(a => {
              if (a.characterId === 'waxer' && a.activeInBattle && a.hp > 0) {
                const waxerRec = Math.round(a.maxProtection * 0.05);
                a.protection = Math.min(a.maxProtection, a.protection + waxerRec);
                logBattleEvent(state, `🧒 Looking Out For The Little Guy: Waxer recovers ${waxerRec} (5%) Protection!`, 'heal');
              }
            });
          }

          // General Kenobi unique: Whenever General Kenobi loses Protection: Recover 2%
          if (currentTarget.characterId === 'general_kenobi' && preProt > postProt) {
            const gkRec = Math.round(currentTarget.maxProtection * 0.02);
            currentTarget.protection = Math.min(currentTarget.maxProtection, currentTarget.protection + gkRec);
            logBattleEvent(state, `🛡️ The Negotiator: General Kenobi loses Protection and recovers ${gkRec} (2%) Protection!`, 'heal');
          }
        }

        // Always log the total attack damage if hit
        if (currentFinalDamage > 0) {
            logBattleEvent(state, `${currentTarget.name} took ${currentFinalDamage} damage ${protectionDamage > 0 ? `(${protectionDamage} absorbed by Protection) ` : ''}${currentCrit ? '🔥 CRITICAL HIT!' : ''}`, 'damage', currentTarget.id, attacker.id, currentFinalDamage, currentCrit);
            
            // Keller Unique: Whenever Keller is damaged: Recover 3% Health.
            if (currentTarget.characterId === 'keller') {
                const rec = Math.round(currentTarget.maxHp * 0.03);
                currentTarget.hp = Math.min(currentTarget.maxHp, currentTarget.hp + rec);
                logBattleEvent(state, `🛡️ Veteran Of Mygeeto: Keller takes damage and recovers 3% Health (+${rec})!`, 'heal');
            }

            // Dedra Meero Unique 2: "Whenever an enemy with Dossier takes damage, Dedra Meero gains 5% Turn Meter."
            if (currentTarget.statuses.some(s => s.name === 'Dossier')) {
                const oppSquad = currentTarget.team === 'player' ? state.enemyTeam : state.playerTeam;
                const dedra = oppSquad.find(u => u.characterId === 'dedra_meero' && u.activeInBattle && u.hp > 0);
                if (dedra && !hasStatusFlag(dedra, 'prevent_tm_gain')) {
                    dedra.turnMeter = Math.min(100, dedra.turnMeter + 5);
                    logBattleEvent(state, `📈 Building The Case: Enemy with Dossier took damage! Dedra Meero gains 5% Turn Meter.`, 'buff');
                }
            }

            // Jet Unique: Whenever Jet suffers damage while Taunting, all other Galactic Marines allies recover 3% Max Protection.
            if (currentTarget.characterId === 'jet_marine' && currentTarget.statuses.some(s => s.name === 'Taunt')) {
                targetAllies.forEach(a => {
                    if (a.id !== currentTarget.id && a.activeInBattle && a.hp > 0 && (a.tags.includes('Galactic Marines') || checkHasTag(a, 'Galactic Marines'))) {
                        if (!hasStatusFlag(a, 'prevent_prot_recovery')) {
                            const rec = Math.round(a.maxProtection * 0.03);
                            a.protection = Math.min(a.maxProtection, a.protection + rec);
                            logBattleEvent(state, `🛡️ Flame Resistance: ${a.name} recovers 3% Protection (+${rec}) from Jet being damaged while Taunting!`, 'heal');
                        }
                    }
                });
            }

            if (currentCrit) {
                // Keller Unique: Whenever Keller scores a Critical Hit, he gains Offense Up (1 turn).
                if (attacker.characterId === 'keller') {
                    applyStatus(state, attacker, 'Offense Up', 1, false, attacker);
                    logBattleEvent(state, `🎯 Flanking Tactics: Keller scored a Critical Hit and gains Offense Up (1 turn)!`, 'buff');
                }

                // Death Trooper Unique 2: Whenever Director Krennic is critically hit, Death Trooper gains Taunt (1 turn) and Retribution (1 turn).
                if (currentTarget.characterId === 'director_krennic') {
                    targetAllies.forEach(a => {
                        if (a.characterId === 'death_trooper' && a.activeInBattle && a.hp > 0) {
                            applyStatus(state, a, 'Taunt', 1, false, currentTarget);
                            applyStatus(state, a, 'Retribution', 1, false, currentTarget);
                            logBattleEvent(state, `💀 Final Authorization: Director Krennic was critically hit! Death Trooper gains Taunt and Retribution (1 turn).`, 'buff');
                        }
                    });
                }
                
                // KX Security Droid Unique 1: Whenever another ISB ally is critically hit, KX Security Droid gains Taunt (1 turn).
                if (currentTarget.tags.includes('ISB') || checkHasTag(currentTarget, 'ISB')) {
                    targetAllies.forEach(a => {
                        if (a.characterId === 'kx_security_droid' && a.id !== currentTarget.id && a.activeInBattle && a.hp > 0) {
                            applyStatus(state, a, 'Taunt', 1, false, currentTarget);
                            logBattleEvent(state, `🛡️ Security Override: ISB ally was critically hit! KX Security Droid gains Taunt (1 turn).`, 'buff');
                        }
                    });
                }
            }

            // Ima-Gun Di leader logic: "Whenever Ima-Gun Di takes damage, Clone Trooper allies gain 5% Turn Meter."
            if (currentTarget.characterId === 'ima_gun_di') {
               const leadUnit = targetAllies.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
               if (leadUnit && leadUnit.id === currentTarget.id) {
                  targetAllies.forEach(u => {
                     if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Clone Trooper') || checkHasTag(u, 'Clone Trooper'))) {
                        if (!hasStatusFlag(u, 'prevent_tm_gain')) {
                           u.turnMeter = Math.min(100, u.turnMeter + 5);
                        }
                     }
                  });
                  logBattleEvent(state, `🛡️ Last Stand: Clone Trooper allies gain 5% TM from Ima-Gun Di taking damage!`, 'buff');
               }
            }
        }

        if (currentTarget.protection <= 0 && currentTarget.hp <= 0) {
           // will trigger defeat hooks below
        }

        // Apply the actual health damage to target if any
        if (healthDamage > 0) {
          const preHp = currentTarget.hp;
          currentTarget.hp = Math.max(0, currentTarget.hp - healthDamage);

      if (currentTarget.statuses.some(s => s.name === 'Pursued')) {
          const oppSquad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
          const cross = oppSquad.find(u => u.characterId === 'crosshair_imperial' && u.activeInBattle && u.hp > 0);
          if (cross && !hasStatusFlag(cross, 'prevent_tm_gain')) {
              cross.turnMeter = Math.min(100, cross.turnMeter + 5);
          }
      }


          if (currentTarget.hp === 0 && preHp > 0) {
             runDefeatHooks(state, currentTarget); } 


          if (currentTarget.characterId === 'wrecker' && preHp > currentTarget.hp && !hasStatusFlag(currentTarget, 'prevent_tm_gain')) {
             currentTarget.turnMeter = Math.min(100, currentTarget.turnMeter + 5);
          }
          if (preHp >= currentTarget.maxHp * 0.5 && currentTarget.hp < currentTarget.maxHp * 0.5 && (currentTarget.tags.includes('Bad Batch') || checkHasTag(currentTarget, 'Bad Batch'))) {
              const allies = currentTarget.team === 'player' ? state.playerTeam : state.enemyTeam;
              const hunter = allies.find(u => u.characterId === 'hunter' && u.hp > 0 && u.activeInBattle);
              if (hunter) {
                  hunter.turnMeter = 100;
                  logBattleEvent(state, `🚨 Hunter gains a Bonus Turn (Enhanced Senses)!`, 'buff');
              }
              const batcher = allies.find(u => u.characterId === 'batcher' && u.hp > 0 && u.activeInBattle);
              if (batcher) {
                  batcher.turnMeter = 100;
                  logBattleEvent(state, `🐺 Batcher gains a Bonus Turn (Faithful Companion)!`, 'buff');
              }
          }


          if (currentTarget.characterId === 'ima_gun_di' && preHp > currentTarget.hp) {
             triggerImaGunDiHealthLoss(state, currentTarget);
          }

          if (currentTarget.statuses.some(s => s.name === 'Overdisciplined')) {
            const hpLost = preHp - currentTarget.hp;
            if (hpLost > 0) {
              const pctLost = hpLost / currentTarget.maxHp;
              let tmScale = 50; // 5% TM per 10% HP lost
              const squad = currentTarget.team === 'player' ? state.playerTeam : state.enemyTeam;
              const leader = squad.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
              if (leader && leader.characterId === 'commander_bacara' && currentTarget.tags.includes('Galactic Marines')) {
                tmScale = 100; // 1% TM per 1% HP lost
              }
              const tmGain = Math.round(pctLost * tmScale);
              if (tmGain > 0) {
                currentTarget.turnMeter = Math.min(100, currentTarget.turnMeter + tmGain);
                logBattleEvent(state, `🛡️ Pure Militarism: ${currentTarget.name} lost health and gained ${tmGain}% Turn Meter!`, 'buff');
              }
            }
          }

          if (preHp >= currentTarget.maxHp * 0.5 && currentTarget.hp < currentTarget.maxHp * 0.5) triggerLeiaUltimateCharge(state, currentTarget);
          
          // Kenobi unique/leader taunt trigger: "Whenever an ally falls below 50% Health: General Kenobi gains Taunt (1 turn)."
          if (preHp >= currentTarget.maxHp * 0.5 && currentTarget.hp < currentTarget.maxHp * 0.5) {
             // General Kenobi
             const gk = targetAllies.find(u => u.characterId === 'general_kenobi' && u.activeInBattle && u.hp > 0);
             if (gk) {
                logBattleEvent(state, `⚔️ Courage Under Fire: Ally fell below 50% Health! General Kenobi gains Taunt (1 turn)!`, 'buff');
                applyStatus(state, gk, 'Taunt', 1, false, null);
             }

             // Master Kenobi leader / unique: "Whenever a Jedi High Council ally falls below 50% Health, Master Kenobi gains Council Guidance."
             if (currentTarget.tags.includes('Jedi High Council') || checkHasTag(currentTarget, 'Jedi High Council')) {
                const ken = targetAllies.find(u => u.characterId === 'master_kenobi' && u.activeInBattle && u.hp > 0);
                if (ken) {
                   applyStatus(state, ken, 'Council Guidance', 99, false, ken);
                   logBattleEvent(state, `🛡️ Last Hope Of The Republic: High Council ally fell below 50% Health! Master Kenobi gains Council Guidance.`, 'buff');
                }
             }

             // Coleman Kcaj unique Future Foretold: "Whenever a Jedi High Council ally falls below 50% Health, Coleman Kcaj gains a Bonus Turn."
             if (currentTarget.tags.includes('Jedi High Council') || checkHasTag(currentTarget, 'Jedi High Council')) {
                const coleman = targetAllies.find(u => u.characterId === 'coleman_kcaj' && u.activeInBattle && u.hp > 0);
                if (coleman) {
                   state.bonusTurnQueue.push(coleman.id);
                   logBattleEvent(state, `🔮 Future Foretold: High Council ally fell below 50% Health! Coleman Kcaj gains a BONUS turn.`, 'buff');
                }
             }

             // Luminara Unduli unique Compassionate Master: "Whenever a Jedi High Council ally falls below 50% Health, Luminara Unduli gains a Bonus Turn."
             if (currentTarget.tags.includes('Jedi High Council') || checkHasTag(currentTarget, 'Jedi High Council')) {
                const lumi = targetAllies.find(u => u.characterId === 'luminara_unduli' && u.activeInBattle && u.hp > 0);
                if (lumi) {
                   state.bonusTurnQueue.push(lumi.id);
                   logBattleEvent(state, `💖 Compassionate Master: High Council ally fell below 50% Health! Luminara Unduli gains a BONUS turn.`, 'buff');
                }
             }

             // Adi Gallia unique: "Whenever allies fall below 50% Health, Adi Gallia gains Foresight (1 turn)."
             const adi = targetAllies.find(u => u.characterId === 'adi_gallia' && u.activeInBattle && u.hp > 0);
             if (adi) {
                logBattleEvent(state, `🛡️ Jedi Authority: Ally fell below 50% Health! Adi Gallia gains Foresight (1 turn)!`, 'buff');
                applyStatus(state, adi, 'Foresight', 1, false, adi);
             }

             // Jedi Knight Unique: Whenever a Jedi Guardian ally falls below 50% Health: Gain Taunt for 1 turn and recover 15% Protection.
             if (currentTarget.tags.includes('Jedi Guardian') || checkHasTag(currentTarget, 'Jedi Guardian')) {
                targetAllies.forEach(a => {
                   if (a.characterId === 'jedi_knight' && a.activeInBattle && a.hp > 0) {
                      logBattleEvent(state, `🛡️ Temple Protector: Jedi Guardian ally fell below 50% Health! Jedi Knight gains Taunt (1 turn) and recovers 15% Protection!`, 'buff');
                      applyStatus(state, a, 'Taunt', 1, false, a);
                      if (!hasStatusFlag(a, 'prevent_prot_recovery')) {
                         a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.15));
                      }
                   }
                });
             }
          }

          // clone_trooper_212th: Battalion Bulwark: "Whenever another 212th ally falls below 50% Health: Gain Taunt (1 turn)."
          if (preHp >= currentTarget.maxHp * 0.5 && currentTarget.hp < currentTarget.maxHp * 0.5 && checkHasTag(currentTarget, '212th')) {
             targetAllies.forEach(a => {
                if (a.characterId === 'clone_trooper_212th' && a.id !== currentTarget.id && a.activeInBattle && a.hp > 0) {
                   logBattleEvent(state, `🛡️ Battalion Bulwark: 212th ally fell below 50% Health! 212th Clone Trooper gains Taunt (1 turn)!`, 'buff');
                   applyStatus(state, a, 'Taunt', 1, false, null);
                }
             });
          }

          // Plo Koon Compassion and Resolve: Whenever a Wolfpack ally falls below 50% Health: Plo Koon gains Bonus Turn.
          if (preHp >= currentTarget.maxHp * 0.5 && currentTarget.hp < currentTarget.maxHp * 0.5 && checkHasTag(currentTarget, 'Wolfpack')) {
             targetAllies.forEach(a => {
                if (a.characterId === 'plo_koon_journey' && a.activeInBattle && a.hp > 0) {
                   logBattleEvent(state, `✨ Compassion And Resolve: Plo Koon gains a BONUS turn because Wolfpack ally ${currentTarget.name} fell below 50% Health!`, 'buff');
                   state.bonusTurnQueue.push(a.id);
                }
             });
          }

          // Galactic Marines falling below 50% Health triggers:
          if (preHp >= currentTarget.maxHp * 0.5 && currentTarget.hp < currentTarget.maxHp * 0.5 && (currentTarget.tags.includes('Galactic Marines') || checkHasTag(currentTarget, 'Galactic Marines'))) {
             // 1. Ki-Adi-Mundi Unique: Whenever a Galactic Marine ally falls below 50% Health: Ki-Adi-Mundi gains Bonus Turn.
             const kam = targetAllies.find(u => u.characterId === 'ki_adi_mundi_journey' && u.activeInBattle && u.hp > 0);
             if (kam) {
                if (!state.bonusTurnQueue) state.bonusTurnQueue = [];
                state.bonusTurnQueue.push(kam.id);
                logBattleEvent(state, `🧠 Acceptable Losses: Ki-Adi-Mundi gains a BONUS turn because Galactic Marine ally ${currentTarget.name} fell below 50% Health!`, 'buff');
             }

             // 2. Commander Bacara Unique: Whenever a Galactic Marine ally falls below 50% Health: Commander Bacara gains Offense Up (2 turns).
             const bacara = targetAllies.find(u => u.characterId === 'commander_bacara' && u.activeInBattle && u.hp > 0);
             if (bacara) {
                applyStatus(state, bacara, 'Offense Up', 2, false, bacara);
                logBattleEvent(state, `⚔️ Overdisciplined Battalion: Commander Bacara gains Offense Up (2 turns) because Galactic Marine ally ${currentTarget.name} fell below 50% Health!`, 'buff');
             }

             // 3. Jet Unique: Whenever a Galactic Marine ally falls below 50% Health: Recover 10% Health.
             const jet = targetAllies.find(u => u.characterId === 'jet_marine' && u.activeInBattle && u.hp > 0);
             if (jet) {
                const healAmt = Math.round(currentTarget.maxHp * 0.10);
                currentTarget.hp = Math.min(currentTarget.maxHp, currentTarget.hp + healAmt);
                logBattleEvent(state, `💖 Keep Them Moving: ${currentTarget.name} recovers 10% Health (${healAmt})!`, 'heal');
             }
          }

          if (protectionDamage === 0) {
            logBattleEvent(state, `${currentTarget.name} suffered ${healthDamage} direct damage ${currentCrit ? '🔥 CRITICAL HIT!' : ''}`, 'damage', currentTarget.id, attacker.id, healthDamage, currentCrit);
          } else {
            logBattleEvent(state, `${currentTarget.name} took ${healthDamage} direct damage to Health.`, 'damage', currentTarget.id, attacker.id, healthDamage);
          }
          if (currentTarget.hp === 0) runDefeatHooks(state, currentTarget);
        }

        const hpAfter = currentTarget.hp;

        // Unbreakable Resolve: Fives unique damage tracking triggers
        if (checkHasTag(currentTarget, '501st')) {
           const allies = currentTarget.team === 'player' ? state.playerTeam : state.enemyTeam;
           const fives = allies.find(u => u.characterId === 'fives' && u.id !== currentTarget.id && u.activeInBattle && u.hp > 0);
           if (fives) {
              logBattleEvent(state, `🛡️ Unbreakable Resolve: Fives gains Momentum from 501st ally taking damage!`, 'buff');
              applyStatus(state, fives, 'Momentum', 99, false, null, 1);
              
              if (hpBefore >= currentTarget.maxHp * 0.5 && hpAfter < currentTarget.maxHp * 0.5 && hpAfter > 0) {
                 logBattleEvent(state, `🛡️ Unbreakable Resolve: Fives gains 2 Momentum from 501st ally falling below 50% Integrity!`, 'buff');
                 applyStatus(state, fives, 'Momentum', 99, false, null, 2);
              }
           }
        }

        // Master Kenobi unique Soresu: "Whenever an ally with Council Guidance takes damage, Master Kenobi gains Taunt (1 turn)."
        if (currentTarget.statuses.some(s => s.name === 'Council Guidance')) {
           const ken = targetAllies.find(u => u.characterId === 'master_kenobi' && u.activeInBattle && u.hp > 0);
           if (ken) {
              applyStatus(state, ken, 'Taunt', 1, false, currentTarget);
              logBattleEvent(state, `🛡️ Master of Soresu: Ally with Council Guidance took damage! Master Kenobi gains Taunt (1 turn).`, 'buff');
           }
        }
        
        // Pathfinder to Fatigued transition checklist
        checkPathfinderToFatigued(state, currentTarget);

        // Exposed trigger
        if (currentTarget.statuses.some(s => s.name === 'Exposed' || s.name === 'Expose')) {
          const expDmg = Math.round(currentTarget.maxHp * 0.10);
          currentTarget.hp = Math.max(0, currentTarget.hp - expDmg);
          currentTarget.statuses = currentTarget.statuses.filter(s => s.name !== 'Exposed' && s.name !== 'Expose');
          logBattleEvent(state, `💥 Exposed trigger popped on ${currentTarget.name} dealing ${expDmg} bonus damage!`, 'damage', currentTarget.id, undefined, expDmg, false);
        }
      }

      if (currentTarget.id === target.id) {
         isCrit = currentCrit;
         finalDamage = currentFinalDamage;
      }
    }
  });

  
  if (assistDepth > 0 || counterDepth > 0) {
      if (attacker.tags.includes('Bad Batch') || checkHasTag(attacker, 'Bad Batch')) {
          const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
          const tech = squad.find(u => u.characterId === 'tech_bb' && u.activeInBattle && u.hp > 0);
          if (tech && !hasStatusFlag(tech, 'prevent_tm_gain')) {
              tech.turnMeter = Math.min(100, tech.turnMeter + 5);
          }
      }

      // Neyo coordination protocol: Whenever another Galactic Marines ally attacks out of turn, Neyo attacks as well.
      if (attacker.characterId !== 'neyo' && (attacker.tags.includes('Galactic Marines') || checkHasTag(attacker, 'Galactic Marines'))) {
          const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
          const neyo = squad.find(u => u.characterId === 'neyo' && u.activeInBattle && u.hp > 0);
          if (neyo && !hasStatusFlag(neyo, 'prevent_assist') && assistDepth < 3) {
              const basic = neyo.abilities.find(a => a.type === 'basic');
              if (basic) {
                  logBattleEvent(state, `🛰️ Coordination Protocol: Neyo assists out of turn after ${attacker.name}'s attack!`, 'info');
                  executeCombatAction(state, neyo.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
              }
          }
      }
  }

  // Wolfpack triggers on attacking:
  if (checkHasTag(attacker, 'Wolfpack') && attacker.hp > 0 && attacker.activeInBattle) {
     const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;

     // 1) Boost unique Adaptive Tactics: "Whenever a Wolfpack ally attacks out of turn: Recover 5% Protection."
     if (assistDepth > 0 || counterDepth > 0) {

        if (attacker.tags.includes('Bad Batch') || checkHasTag(attacker, 'Bad Batch')) {
           const tech = allies.find(u => u.characterId === 'tech_bb' && u.activeInBattle && u.hp > 0);
           if (tech && !hasStatusFlag(tech, 'prevent_tm_gain')) {
               tech.turnMeter = Math.min(100, tech.turnMeter + 5);
           }
        }

        const boost = allies.find(u => u.characterId === 'wp_boost' && u.activeInBattle && u.hp > 0);
        if (boost && !hasStatusFlag(attacker, 'prevent_prot_recovery')) {
           logBattleEvent(state, `🛡️ Adaptive Tactics: ${attacker.name} attacks out of turn and recovers 5% Protection!`, 'heal');
           const rec = Math.round(attacker.maxProtection * 0.05);
           attacker.protection = Math.min(attacker.maxProtection, attacker.protection + rec);
        }

        // Teebo Trap: Falling Log
        const oppSquad = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
        const teebo = oppSquad.find(u => u.characterId === 'teebo' && u.activeInBattle && u.hp > 0);
        if (teebo && !teebo.dynamicState?.trapTriggered) {
            if (!teebo.dynamicState) teebo.dynamicState = {};
            teebo.dynamicState.trapTriggered = true;
            logBattleEvent(state, `🌳 TRAP SPRUNG: Falling Log! Enemy attacked out of turn!`, 'info');
            applyStatus(state, attacker, 'Stun', 1, true, teebo);
            allies.forEach(u => {
                if (u.activeInBattle && u.hp > 0) reduceTurnMeter(state, u, 20, teebo);
            });
            oppSquad.forEach(u => {
                if (u.activeInBattle && u.hp > 0 && (checkHasTag(u, 'Ewok') || u.tags.includes('Ewok')) && !hasStatusFlag(u, 'prevent_tm_gain')) {
                    u.turnMeter = Math.min(100, u.turnMeter + 10);
                }
            });
        }

        // Chief Chirpa Leader: "Whenever an Ewok attacks out of turn, recover 2% Health and Protection."
        if (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok')) {
           const leader = allies.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
           if (leader && leader.characterId === 'chief_chirpa') {
               attacker.hp = Math.min(attacker.maxHp, attacker.hp + Math.round(attacker.maxHp * 0.02));
               if (!hasStatusFlag(attacker, 'prevent_prot_recovery')) {
                   attacker.protection = Math.min(attacker.maxProtection, attacker.protection + Math.round(attacker.maxProtection * 0.02));
               }
           }
        }
     }

     // 2) Wolfpack Heavy Covered Position: "Whenever a Wolfpack ally attacks an Ambushed enemy: Recover 5% Protection."
     if (target.statuses.some(s => s.name === 'Ambushed')) {
        const heavy = allies.find(u => u.characterId === 'wp_heavy' && u.activeInBattle && u.hp > 0);
        if (heavy && !hasStatusFlag(attacker, 'prevent_prot_recovery')) {
           logBattleEvent(state, `🛡️ Covered Position: ${attacker.name} attacks Ambushed enemy ${target.name} and recovers 5% Protection!`, 'heal');
           const rec = Math.round(attacker.maxProtection * 0.05);
           attacker.protection = Math.min(attacker.maxProtection, attacker.protection + rec);
        }
     }
  }

  // Accumulate raid score
  if (target.team === 'enemy' && state.totalScore !== undefined) {
    state.totalScore += finalDamage;
  }

  // Trigger Lord Vader charge if Knightfall attacks
  if (checkHasTag(attacker, 'Knightfall')) {
     triggerVaderUltimateCharge(state, attacker, 2);
  }

  // Parse abilities descriptions dynamically to inject effects securely
  parseAndApplyEffects(state, attacker, target, ability, isCrit, targetAlly, assistDepth, counterDepth);
  
  if (isCrit && state.conquestDataDisks?.includes('dd_volatile_accelerator') && attacker.team === 'player' && target.activeInBattle) {
     applyStatus(state, target, 'Damage Over Time', 2, true, attacker, 2);
  }

  checkDefeat(state, target, attacker);

  // Commander Thorn's Rapid Fire double-tap against Locked Down enemies
  if (assistDepth === 0 && counterDepth === 0 && attacker.characterId === 'commander_thorn' && ability.id === 'thorn_b' && target.statuses.some(s => s.name === 'Lockdown') && target.activeInBattle && attacker.hp > 0) {
     logBattleEvent(state, `⚡ Heavy Rotary Fire: Thorn sweeps on Locked Down enemy! Attacking again!`, 'info');
     executeCombatAction(state, attacker.id, ability, target.id, undefined, 1, 0);
  }

  // Kit Fisto's Shii-Cho Flurry double-tap against Investigated enemies
  if (assistDepth === 0 && counterDepth === 0 && attacker.characterId === 'kit_fisto' && (ability.id === 'kit_basic' || ability.id === 'kit_fisto_basic') && target.statuses.some(s => s.name === 'Investigation') && target.activeInBattle && attacker.hp > 0) {
     logBattleEvent(state, `⚔️ Shii-Cho Flurry: Target is under Investigation! Kit Fisto strikes again!`, 'info');
     executeCombatAction(state, attacker.id, ability, target.id, undefined, 1, 0);
  }

  // Kit Fisto Relentless Duelist check
  if (attacker.characterId === 'kit_fisto' && target.statuses.some(s => s.name === 'Investigation') && attacker.hp > 0) {
     logBattleEvent(state, `⚡ Relentless Duelist: Kit Fisto damages an enemy under Investigation and gains Critical Chance Up (1 turn)!`, 'buff');
     applyStatus(state, attacker, 'Critical Chance Up', 1, false, attacker);
  }

  // --- Jedi Guardian / Jedi High Council on-attack triggers ---
  if (target.statuses.some(s => s.name === 'Investigation') && attacker.hp > 0 && attacker.activeInBattle) {
     const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
     if (checkHasTag(attacker, 'Jedi') || checkHasTag(attacker, 'Jedi Guardian') || checkHasTag(attacker, 'Jedi High Council') || attacker.tags.includes('Jedi Guardian')) {
        
        // 1) Depa Billaba: Gains Offense Up (1 turn)
        const depa = allies.find(u => u.characterId === 'depa_billaba' && u.activeInBattle && u.hp > 0);
        if (depa) {
           logBattleEvent(state, `⚔️ Vaapad Apprentice: Depa Billaba gains Offense Up from attacking an investigated enemy!`, 'buff');
           applyStatus(state, depa, 'Offense Up', 1, false, depa);
        }

        // 2) Jocasta Nu: Attacking ally gains 5% TM and recovers 5% HP & Protection
        const jocasta = allies.find(u => u.characterId === 'jocasta_nu' && u.activeInBattle && u.hp > 0);
        if (jocasta) {
           const hRec = Math.round(attacker.maxHp * 0.05);
           const pRec = Math.round(attacker.maxProtection * 0.05);
           attacker.hp = Math.min(attacker.maxHp, attacker.hp + hRec);
           if (!hasStatusFlag(attacker, 'prevent_prot_recovery')) {
              attacker.protection = Math.min(attacker.maxProtection, attacker.protection + pRec);
           }
           if (!hasStatusFlag(attacker, 'prevent_tm_gain')) {
              attacker.turnMeter = Math.min(100, attacker.turnMeter + 5);
           }
           logBattleEvent(state, `📚 Keeper of the Archives: ${attacker.name} gains 5% Turn Meter & recovers 5% Health & Protection!`, 'heal');
        }

        // 3) Saesee Tiin: 50% chance to Assist
        if (assistDepth === 0 && counterDepth === 0) {
           const saesee = allies.find(u => u.characterId === 'saesee_tiin' && u.id !== attacker.id && u.activeInBattle && u.hp > 0);
           if (saesee && Math.random() < 0.50) {
              const saeseeBasic = saesee.abilities.find(ab => ab.type === 'basic') || saesee.abilities[0];
              logBattleEvent(state, `⚔️ Combat Reflexes: Saesee Tiin assists in punishing an investigated target!`, 'info');
              executeCombatAction(state, saesee.id, saeseeBasic, target.id, undefined, assistDepth + 1, counterDepth);
           }
        }

        // 4) Mace Windu: Gains 2% TM when a Jedi Guardian ally attacks an investigated enemy
        if (checkHasTag(attacker, 'Jedi Guardian')) {
           const windu = allies.find(u => u.characterId === 'mace_windu' && u.activeInBattle && u.hp > 0);
           if (windu && !hasStatusFlag(windu, 'prevent_tm_gain')) {
              windu.turnMeter = Math.min(100, windu.turnMeter + 2);
              logBattleEvent(state, `👑 The Senate Will Decide: Mace Windu gains 2% Turn Meter from Jedi Guardian ally's attack!`, 'buff');
           }
        }
     }
  }

  // --- Emperor's Hand / Imperial Decree on-attack triggers ---
  if (target.statuses.some(s => s.name === 'Imperial Decree') && attacker.hp > 0 && attacker.activeInBattle) {
     const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
     
     if (attacker.characterId === 'starkiller') {
         const bonusDmg = Math.round(attacker.offense * 0.35); // Ignore 35% Defense and 30% Protection approximated
         target.hp = Math.max(0, target.hp - bonusDmg);
     }
     
     if (attacker.characterId === 'mara_jade') {
         if (!attacker.dynamicState) attacker.dynamicState = {};
         const currentStacks = attacker.dynamicState.maraOffenseStacks || 0;
         if (currentStacks < 20) {
            attacker.dynamicState.maraOffenseStacks = currentStacks + 1;
            attacker.offense = Math.round(attacker.offense * 1.05);
            logBattleEvent(state, `📈 Elite Assassin: Mara Jade gains +5% Offense (Stack ${currentStacks + 1}/20)!`, 'buff');
         }
     }
     
     // 1. Tarkin Lead: "Whenever an Emperor's Hand ally attacks an enemy with Imperial Decree: Gain 2% Offense (stacking, max 20 stacks)."
     const tarkinLead = allies.find(u => u.characterId === 'grand_moff_tarkin' && u.position === 0 && u.activeInBattle && u.hp > 0);
     if (tarkinLead && (attacker.tags.includes('Emperors Hand') || attacker.tags.includes("Emperor's Hand"))) {
        if (!attacker.dynamicState) attacker.dynamicState = {};
        const currentStacks = attacker.dynamicState.tarkinLeadOffenseStacks || 0;
        if (currentStacks < 20) {
           attacker.dynamicState.tarkinLeadOffenseStacks = currentStacks + 1;
           attacker.offense = Math.round(attacker.offense * 1.02);
           logBattleEvent(state, `📈 Doctrine of Fear: ${attacker.name} gains +2% Offense (Stack ${currentStacks + 1}/20)!`, 'buff');
        }
     }

     // 2. Sidious Lead: "Whenever an Emperor's Hand ally attacks an enemy with Imperial Decree: Recover 5% Protection."
     const sidiousLead = allies.find(u => u.characterId === 'gl_darth_sidious' && u.position === 0 && u.activeInBattle && u.hp > 0);
     if (sidiousLead && (attacker.tags.includes('Emperors Hand') || attacker.tags.includes("Emperor's Hand")) && !hasStatusFlag(attacker, 'prevent_prot_recovery')) {
        const rec = Math.round(attacker.maxProtection * 0.05);
        attacker.protection = Math.min(attacker.maxProtection, attacker.protection + rec);
        logBattleEvent(state, `🛡️ Galactic Sovereign: ${attacker.name} recovers 5% Protection!`, 'heal');
     }
  }

  // Handle unit counters inside limits
  if (hasStatusFlag(target, 'counterattack') && counterDepth < MAX_COUNTER_DEPTH && target.activeInBattle && !hasStatusFlag(target, 'prevent_counter')) {
    logBattleEvent(state, `↩️ ${target.name} counterattacks ${attacker.name}!`, 'info');
    // Basic counterattack action
    const basicAbility = target.abilities.find(a => a.type === 'basic') || target.abilities[0];
    executeCombatAction(state, target.id, basicAbility, attacker.id, undefined, assistDepth, counterDepth + 1);
  }

  // Complete active turn decrement for actual main actions
  if (assistDepth === 0 && counterDepth === 0) {
    decrementStatusDurations(state, attacker);
  }
}

function parseAndApplyEffects(
  state: CombatState,
  attacker: CombatUnit,
  target: CombatUnit,
  ability: Ability,
  isCrit: boolean,
  explicitTargetAlly?: CombatUnit,
  assistDepth = 0,
  counterDepth = 0
) {
  if (customAbilityHandlers[ability.id]) {
     customAbilityHandlers[ability.id](state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth);
     return;
  }

  const effects = ability.effects;
  const allEffectsString = (effects.join(' ') + ' ' + ability.desc).toLowerCase();

  // Evaluate scoping for the entire ability first
  const isAllies = allEffectsString.includes('allies') || allEffectsString.includes('buff_all') || allEffectsString.includes('all_allies');
  let isTargetAlly = allEffectsString.includes('target ally') || allEffectsString.includes('target other ally') || allEffectsString.includes('buff_ally') || allEffectsString.includes('target_ally');
  const isRandomAlly = allEffectsString.includes('random') && (allEffectsString.includes('ally') || allEffectsString.includes('buff_self_random'));
  const isEnemies = allEffectsString.includes('enemies') || allEffectsString.includes('damage_aoe') || allEffectsString.includes('debuff_all');
  
  const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
  const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
  const leader = allies.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
  const attStats = getModifiedStats(attacker, allies);

  let globalTargetAllies = [attacker];
  
  if (isTargetAlly) {
     if (explicitTargetAlly) {
         globalTargetAllies = [explicitTargetAlly];
     } else {
         // AI Fallback or unselected fallback: random valid ally
         const nonSelf = allies.filter(a => a.id !== attacker.id && a.hp > 0 && a.activeInBattle);
         const pool = nonSelf.length > 0 ? nonSelf : allies.filter(a => a.hp > 0 && a.activeInBattle);
         globalTargetAllies = pool.length > 0 ? [pool[Math.floor(Math.random() * pool.length)]] : [attacker];
         // Fallback just sets it
     }
  } else if (isAllies || isRandomAlly) {
    globalTargetAllies = allies.filter(a => a.activeInBattle && a.hp > 0);
    
    const factions = ['501st', '212th', 'jedi', 'separatist', 'rebel', 'empire', 'sith', 'clone trooper', 'droid', 'mandalorian', 'hutt cartel', 'smuggler', 'scoundrel', 'republic', 'galactic republic', 'knightfall', 'bounty hunter', 'resistance', 'first order', 'ewok', 'jawa', 'tusken', 'inquisitorius'];
    factions.forEach(fac => {
       if (allEffectsString.includes(fac) || allEffectsString.includes(fac.replace(' ', '_'))) {
          globalTargetAllies = globalTargetAllies.filter(a => checkHasTag(a, fac));
       }
    });
    
    if (isRandomAlly && globalTargetAllies.length > 0) {
       const nonSelf = globalTargetAllies.filter(a => a.id !== attacker.id);
       const pool = nonSelf.length > 0 ? nonSelf : globalTargetAllies;
       globalTargetAllies = [pool[Math.floor(Math.random() * pool.length)]];
    }
  } // else it remains self

  let globalTargetEnemies = [target];
  if (isEnemies) {
    globalTargetEnemies = enemies.filter(e => e.activeInBattle && e.hp > 0);
    const factions = ['501st', '212th', 'jedi', 'separatist', 'rebel', 'empire', 'sith', 'clone trooper', 'droid', 'mandalorian', 'hutt cartel', 'smuggler', 'scoundrel', 'republic', 'galactic republic', 'knightfall', 'bounty hunter', 'resistance', 'first order', 'ewok', 'jawa', 'tusken', 'inquisitorius'];
    factions.forEach(fac => {
       const hasFactionEnemyMatch = allEffectsString.includes(`${fac} enemies`) || allEffectsString.includes(`${fac.replace(' ', '_')} enemies`);
       if (hasFactionEnemyMatch) {
          globalTargetEnemies = globalTargetEnemies.filter(e => checkHasTag(e, fac));
       }
    });
  }

  effects.forEach(effect => {
    const effectLower = effect.toLowerCase();
    
    // Within this scope, if a token specifically specifies 'self', we override
    let targetAllies = globalTargetAllies;
    if (effectLower.includes('buff_self')) {
        targetAllies = [attacker];
    }
    
    let targetEnemies = globalTargetEnemies;

    // Debuffs
    [
      'Exposed', 'Defense Down', 'Speed Down', 'Offense Down', 'Ability Block',
      'Healing Immunity', 'Stun', 'Frostbite', 'Analyze', 'Purge', 'Bribed', 'Intimidated',
      'Daze', 'Target Lock', 'Vulnerable', 'Burning', 'Blind', 'Damage Over Time', 'Shattered Defense',
      'Plague', 'Thermal Detonator', 'Order 66', 'Isolation', 'Marked', 'Potency Down', 'Shock', 'Buff Immunity', 'Fear', 'Pursued', 'Lockdown'
    ].forEach(db => {
      const dbTag = db.toLowerCase().replace(/ /g, '_');
      if (effect.includes(db) || effect.includes(dbTag)) {
        let count = 1;
        const stackMatch = ability.desc.match(new RegExp(`(\\d+)\\s*stacks?\\s*of\\s*${db}|inflict\\s*(\\d+)\\s*${db}|apply\\s*(\\d+)\\s*${db}`, 'i'));
        if (stackMatch) {
            count = parseInt(stackMatch[1] || stackMatch[2] || stackMatch[3] || '1');
        }
        targetEnemies.forEach(e => applyStatus(state, e, db, db === 'Purge' ? 3 : 2, true, attacker, count));
      }
    });

    // Stealth Other Allies override
    if (effectLower.includes('stealth_other_allies')) {
       const others = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam)
         .filter(u => u.activeInBattle && u.hp > 0 && !targetAllies.some(ta => ta.id === u.id));
       others.forEach(o => applyStatus(state, o, 'Stealth', 2, false, attacker));
    }
    
    // Buffs
    [
      'Defense Up', 'Speed Up', 'Tenacity Up', 'Offense Up', 'Retribution', 
      'Stealth', 'Taunt', 'Foresight', 'Advantage', 'Protection Up', 
      'Critical Chance Up', 'Critical Damage Up', 'Inspired',
      'Heal Over Time', 'Protection Over Time', 'Dramatic Entrance', 'Damage Immunity', 'Potency Up', 'Riot Control'
    ].forEach(bf => {
      const bfTag = bf.toLowerCase().replace(/ /g, '_');
      if (effect.includes(bf) || effect.includes(bfTag)) {
        if (bf === 'Stealth' && effectLower.includes('stealth_other_allies')) {
           return; // Already handled above
        }
        let count = 1;
        const stackMatch = ability.desc.match(new RegExp(`(\\d+)\\s*stacks?\\s*of\\s*${bf}|gain\\s*(\\d+)\\s*${bf}|apply\\s*(\\d+)\\s*${bf}`, 'i'));
        if (stackMatch) {
            count = parseInt(stackMatch[1] || stackMatch[2] || stackMatch[3] || '1');
        }
        targetAllies.forEach(a => applyStatus(state, a, bf, 2, false, attacker, count));
      }
    });

    // Summoning
    if (effect.includes('Summon') && effect.includes('Magna Guard Remnant')) {
      triggerSummon(state, attacker, 'magna_guard_remnant');
    }

    // Standard Healing or Recovery
    if (effectLower.includes('heal') || effectLower.includes('health') && !effectLower.includes('immunity')) {
      let match = effect.match(/(\d+)%/);
      if (!match) match = ability.desc.match(/recover\s*(\d+)%\s*health|heal\s*(\d+)%|(\d+)%\s*health/i);
      const val = match ? (match[1] || match[2] || match[3]) : '15';
      const healPct = parseInt(val) / 100;
      
      let unitsToHeal = targetAllies;
      
      // If the ability has no explicit ally scope but heals, fallback to weakest ally unless it specifically says "Target Ally" or "All Allies" or "Self"
      if (!isAllies && !isTargetAlly && !isRandomAlly && !effectLower.includes('self')) {
        const healingTeam = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
        const aliveAllies = healingTeam.filter(u => u.activeInBattle && u.hp > 0);
        if (aliveAllies.length > 0) {
          aliveAllies.sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp));
          unitsToHeal = [aliveAllies[0]];
        }
      }

      unitsToHeal.forEach(u => {
        if (hasStatusFlag(u, 'prevent_heal')) {
          logBattleEvent(state, `🔇 Heal BLOCKED: ${u.name} cannot be healed!`, 'debuff');
        } else {
          const healAmt = Math.round(u.maxHp * healPct);
          u.hp = Math.min(u.maxHp, u.hp + healAmt);
          logBattleEvent(state, `💚 ${u.name} healed for +${healAmt} Health`, 'heal');
        }
      });
    }

    // Revive
    if (effectLower.includes('revive')) {
      const team = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
      // Find a defeated ally
      const defeatedAllies = team.filter(u => !u.activeInBattle && u.hp <= 0 && !u.isSummon);
      if (defeatedAllies.length > 0) {
        // Can only revive 1 unless specified
        const toRevive = defeatedAllies[0];
        executeRevive(state, toRevive, attacker, 0.5);
      }
    }

    if (effectLower.includes('recover') && effectLower.includes('protection')) {
      let matches = effect.match(/(\d+)%/);
      if (!matches) matches = ability.desc.match(/recover\s*(\d+)%\s*protection|(\d+)%\s*protection/i);
      const val = matches ? (matches[1] || matches[2]) : '15';
      const pct = parseInt(val) / 100;
      
      let unitsToHeal = targetAllies;
      if (!isAllies && !isTargetAlly && !isRandomAlly && !effectLower.includes('self')) {
        const healingTeam = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
        const aliveAllies = healingTeam.filter(u => u.activeInBattle && u.hp > 0);
        if (aliveAllies.length > 0) {
          aliveAllies.sort((a, b) => (a.protection / Math.max(1, a.maxProtection)) - (b.protection / Math.max(1, b.maxProtection)));
          unitsToHeal = [aliveAllies[0]];
        }
      }

      unitsToHeal.forEach(u => {
        if (hasStatusFlag(u, 'prevent_prot_recovery')) {
          logBattleEvent(state, `🔇 Protection Recovery BLOCKED: ${u.name} cannot recover protection!`, 'debuff');
          return;
        }
        const rec = Math.round(u.maxProtection * pct);
        u.protection = Math.min(u.maxProtection, u.protection + rec);
        logBattleEvent(state, `💚 ${u.name} recovered ${rec} Protection`, 'heal');
        triggerJabbaUltimateCharge(state, u);
      });
    }

    // Call Assists
    if (effect.includes('assist') || effect.includes('assist_all')) {
      triggerAssist(state, attacker, target, effect, explicitTargetAlly);
    }

    // Turn Meter Manipulation
    if (effectLower.includes('turn_meter') || effectLower.includes('turn meter')) {
      let matches = effect.match(/(\d+)%/);
      if (!matches) matches = ability.desc.match(/(\d+)%\s*turn meter/i) || ability.desc.match(/turn meter\s*(\d+)%/i);
      const val = matches ? matches[1] : '15';
      const pct = parseInt(val) / 100;

      if (effectLower.includes('reduction') || effectLower.includes('lose') || effectLower.includes('remove')) {
        targetEnemies.forEach(e => {
           e.turnMeter = Math.max(0, e.turnMeter - (100 * pct));
           logBattleEvent(state, `📉 ${e.name} lost ${val}% Turn Meter`, 'debuff');
        });
      } else if (effectLower.includes('gain') || effectLower.includes('grant')) {
        targetAllies.forEach(a => {
           if (hasStatusFlag(a, 'prevent_tm_gain')) {
             logBattleEvent(state, `🔇 TM Gain BLOCKED: ${a.name} is blocked from gaining TM!`, 'debuff');
             return;
           }
           a.turnMeter = Math.min(100, a.turnMeter + (100 * pct));
           logBattleEvent(state, `📈 ${a.name} gained ${val}% Turn Meter`, 'buff');
        });
      }
    }

    // Dispel
    if (effectLower.includes('dispel') || effectLower.includes('cleanse')) {
      if (effectLower.includes('dispel_enemy') || effectLower.includes('dispel_all') || effectLower.includes('buffs')) {
         targetEnemies.forEach(e => {
            e.statuses = e.statuses.filter(s => {
               const def = STATUS_DEFINITIONS[s.name];
               if (!def) return true;
               if (def.type === 'buff' && def.flags && def.flags.includes('prevent_cleanse')) return true;
               return def.type !== 'buff';
            });
            logBattleEvent(state, `✨ All Buffs Dispelled from ${e.name}`, 'info');
         });
      }
      if (effectLower.includes('cleanse_ally') || effectLower.includes('cleanse_all') || effectLower.includes('debuffs')) {
         targetAllies.forEach(a => {
            a.statuses = a.statuses.filter(s => {
               const def = STATUS_DEFINITIONS[s.name];
               if (!def) return true;
               if (def.type === 'debuff' && def.flags && def.flags.includes('prevent_cleanse')) return true;
               return def.type !== 'debuff';
            });
            logBattleEvent(state, `✨ All Debuffs Cleansed from ${a.name}`, 'heal');
         });
      }
    }
  });

  // Handle unique status boosts
  if (attacker.characterId === 'captain_rex' && isCrit) {
    attacker.turnMeter = Math.min(100, attacker.turnMeter + 10);
  }

  // Commander Fox Basic (Riot Baton): Recover 5% Protection if target is Locked Down
  if (attacker.characterId === 'commander_fox_riot' && ability.id === 'fox_b') {
     if (target.statuses.some(s => s.name === 'Lockdown')) {
        const rec = Math.round(attacker.maxProtection * 0.05);
        attacker.protection = Math.min(attacker.maxProtection, attacker.protection + rec);
        logBattleEvent(state, `🦊 Riot Baton: Fox recovers +${rec} Protection by striking a Locked Down target!`, 'heal');
     }
  }

  // Commander Thorn Special 1 (Hold The Avenue): Locked Down enemies take 10% Max Health bonus damage
  if (attacker.characterId === 'commander_thorn' && ability.id === 'thorn_s1') {
     enemies.filter(e => e.activeInBattle && e.hp > 0).forEach(e => {
        if (e.statuses.some(s => s.name === 'Lockdown')) {
           const bonus = Math.round(e.maxHp * 0.10);
           e.hp = Math.max(0, e.hp - bonus);
           logBattleEvent(state, `💥 Hold The Avenue: ${e.name} takes ${bonus} bonus damage from Lockdown!`, 'damage', e.id, attacker.id);
        }
     });
  }

  // --- 212th Rework Combined Arms Assault abilities trigger ---
  if (ability.id.includes('combined_arms_assault')) {
     const caStatus = attacker.statuses.find(s => s.name === 'Combined Arms');
     const caStacks = caStatus ? (caStatus.count || 1) : 0;
     logBattleEvent(state, `⚔️ COMBINED ARMS ASSAULT: ${attacker.name} executes maneuver with ${caStacks} Combined Arms Stacks!`, 'info');

     // Cody unique "Combined Arms Doctrine" check:
     // - "Whenever Combined Arms Assault is used: All 212th allies recover 5% Protection (Cody unique) / General Kenobi lead: recover 5% Protection (GK Lead)."
     const hasCodyDoctrine = allies.some(u => u.characterId === 'commander_cody' && u.activeInBattle && u.hp > 0);
     const hasGKLeader = leader && leader.characterId === 'general_kenobi' && leader.activeInBattle && leader.hp > 0;
     
     if (hasCodyDoctrine || hasGKLeader) {
        allies.forEach(a => {
           if (checkHasTag(a, '212th') && a.activeInBattle && a.hp > 0 && !hasStatusFlag(a, 'prevent_prot_recovery')) {
              let pct = 0;
              if (hasCodyDoctrine) pct += 0.05;
              if (hasGKLeader) pct += 0.05;
              
              const rec = Math.round(a.maxProtection * pct);
              a.protection = Math.min(a.maxProtection, a.protection + rec);
              logBattleEvent(state, `❇️ Combined Arms Recovery: ${a.name} recovers ${rec} (${Math.round(pct * 100)}%) Protection!`, 'heal');
           }
        });
     }

     // Waxer unique "Looking Out For The Little Guy" check:
     // - "Whenever Combined Arms Assault is used: Random ally recovers 10% Protection."
     const activeWaxer = allies.find(u => u.characterId === 'waxer' && u.activeInBattle && u.hp > 0);
     if (activeWaxer) {
        const aliveAllies = allies.filter(u => u.activeInBattle && u.hp > 0);
        if (aliveAllies.length > 0) {
           const randAlly = aliveAllies[Math.floor(Math.random() * aliveAllies.length)];
           if (!hasStatusFlag(randAlly, 'prevent_prot_recovery')) {
              const rec = Math.round(randAlly.maxProtection * 0.10);
              randAlly.protection = Math.min(randAlly.maxProtection, randAlly.protection + rec);
              logBattleEvent(state, `🧒 Looking Out For The Little Guy: Random ally ${randAlly.name} recovers ${rec} (10%) Protection!`, 'heal');
           }
        }
     }

     // Boiler unique "Brothers In Battle" check:
     // - "Whenever Combined Arms Assault is used: Gain Offense Up (2 turns) (for Boiler)."
     const activeBoiler = allies.find(u => u.characterId === 'boiler' && u.activeInBattle && u.hp > 0);
     if (activeBoiler) {
        applyStatus(state, activeBoiler, 'Offense Up', 2, false);
     }

     // Aerial Trooper unique "Airborne Specialist" check:
     // - "Whenever Combined Arms Assault is used: Gain Bonus Turn (for 212th Jet Trooper/aerial_trooper_212th)."
     const activeJet = allies.find(u => u.characterId === 'aerial_trooper_212th' && u.activeInBattle && u.hp > 0);
     if (activeJet) {
        logBattleEvent(state, `🚀 Airborne Specialist: 212th Jet Trooper gains a BONUS TURN!`, 'buff');
        activeJet.turnMeter = 100;
     }

     // execute stack-based effects
     if (caStacks === 0) {
        // --- 0 STACKS ---
        // Coordinated Fire: Call target ally to Assist.
        const assistant = allies.find(a => a.id !== attacker.id && a.activeInBattle && a.hp > 0);
        if (assistant) {
           const basic = assistant.abilities.find(ab => ab.type === 'basic') || assistant.abilities[0];
           logBattleEvent(state, `⚡ Coordinated Fire (0 Stacks): Calling ${assistant.name} to Assist!`, 'info');
           executeCombatAction(state, assistant.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
           
           if (checkHasTag(assistant, '212th')) {
              const cody = allies.find(u => u.characterId === 'commander_cody' && u.activeInBattle && u.hp > 0);
              if (cody) {
                 cody.turnMeter = Math.min(100, cody.turnMeter + 10);
                 logBattleEvent(state, `💂 Combined Arms Doctrine: Cody gains 10% Turn Meter from support asset assist!`, 'buff');
              }
           }
        }
     } else if (caStacks === 1) {
        // --- 1 STACK ---
        // Squad Advance: Call all other 212th allies to Assist dealing 50% reduced damage. Remove 1 stack.
        attacker.statuses = attacker.statuses.map(s => {
           if (s.name === 'Combined Arms') {
              return { ...s, count: (s.count || 1) - 1 };
           }
           return s;
        }).filter(s => s.name !== 'Combined Arms' || (s.count && s.count > 0));

        logBattleEvent(state, `📉 Stack Consumed: ${attacker.name} removed 1 Combined Arms stack.`, 'debuff');

        allies.filter(a => a.id !== attacker.id && checkHasTag(a, '212th') && a.activeInBattle && a.hp > 0).forEach(a => {
           const basic = a.abilities.find(ab => ab.type === 'basic') || a.abilities[0];
           logBattleEvent(state, `⚡ Squad Advance (1 Stack): Calling 212th ally ${a.name} to Assist with 50% reduced offense!`, 'info');
           
           const origOff = a.offense;
           a.offense = Math.round(a.offense * 0.50);
           executeCombatAction(state, a.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
           a.offense = origOff;

           const cody = allies.find(u => u.characterId === 'commander_cody' && u.activeInBattle && u.hp > 0);
           if (cody) {
              cody.turnMeter = Math.min(100, cody.turnMeter + 10);
              logBattleEvent(state, `💂 Combined Arms Doctrine: Cody gains 10% Turn Meter from support asset assist!`, 'buff');
           }
        });
     } else if (caStacks === 2) {
        // --- 2 STACKS ---
        // Artillery Barrage: Deal Special Damage to all enemies. Inflict: Defense Down (2 turns). Remove 2 stacks.
        attacker.statuses = attacker.statuses.map(s => {
           if (s.name === 'Combined Arms') {
              return { ...s, count: (s.count || 1) - 2 };
           }
           return s;
        }).filter(s => s.name !== 'Combined Arms' || (s.count && s.count > 0));

        logBattleEvent(state, `📉 Stack Consumed: ${attacker.name} removed 2 Combined Arms stacks.`, 'debuff');

        const activeEnemies = enemies.filter(e => e.activeInBattle && e.hp > 0);
        activeEnemies.forEach(e => {
           const barDmg = Math.round(attStats.offense * 1.5);
           applyStatus(state, e, 'Defense Down', 2, true, attacker);
           
           let finalBarDmg = barDmg;
           if (hasStatusFlag(e, 'damage_immunity')) {
              finalBarDmg = 0;
           }

           if (finalBarDmg > 0) {
              const preH = e.hp;
              const eStats = getModifiedStats(e, enemies);
              const mitigation = 15000 / (15000 + eStats.defense);
              finalBarDmg = Math.round(finalBarDmg * mitigation);

              if (e.protection > 0) {
                 const shD = Math.min(e.protection, finalBarDmg);
                 e.protection -= shD;
                 const rem = finalBarDmg - shD;
                 if (rem > 0) {
                    e.hp = Math.max(0, e.hp - rem);
                 }
                 logBattleEvent(state, `🔥 Artillery Barrage deals ${shD} Protection and ${Math.max(0, rem)} Health damage to ${e.name}!`, 'damage', e.id);
              } else {
                 e.hp = Math.max(0, e.hp - finalBarDmg);
                 logBattleEvent(state, `🔥 Artillery Barrage deals ${finalBarDmg} direct Health damage to ${e.name}!`, 'damage', e.id);
              }

              if (preH >= e.maxHp * 0.5 && e.hp < e.maxHp * 0.5) triggerLeiaUltimateCharge(state, e);
              if (e.hp === 0) runDefeatHooks(state, e);
           }
        });
     } else if (caStacks >= 3) {
        // --- 3 STACKS ---
        // LAAT Gunship Strike: Deal massive Physical Damage to all enemies. Bypass Taunt. Inflict: Daze (2 turns), Offense Down (2 turns). Remove all.
        attacker.statuses = attacker.statuses.filter(s => s.name !== 'Combined Arms');
        logBattleEvent(state, `📉 Stack Consumed: ${attacker.name} removed ALL Combined Arms stacks!`, 'debuff');

        const activeEnemies = enemies.filter(e => e.activeInBattle && e.hp > 0);
        activeEnemies.forEach(e => {
           const gunDamage = Math.round(attStats.offense * 2.5);
           applyStatus(state, e, 'Daze', 2, true, attacker);
           applyStatus(state, e, 'Offense Down', 2, true, attacker);
           
           let finalGunDmg = gunDamage;
           if (hasStatusFlag(e, 'damage_immunity')) {
              finalGunDmg = 0;
           }

           if (finalGunDmg > 0) {
              const preH = e.hp;
              const eStats = getModifiedStats(e, enemies);
              const mitigation = 15000 / (15000 + eStats.defense);
              finalGunDmg = Math.round(finalGunDmg * mitigation);

              if (e.protection > 0) {
                 const shD = Math.min(e.protection, finalGunDmg);
                 e.protection -= shD;
                 const rem = finalGunDmg - shD;
                 if (rem > 0) {
                    e.hp = Math.max(0, e.hp - rem);
                 }
                 logBattleEvent(state, `🚀 LAAT Gunship Strike deals ${shD} Protection and ${Math.max(0, rem)} Health damage to ${e.name}!`, 'damage', e.id);
              } else {
                 e.hp = Math.max(0, e.hp - finalGunDmg);
                 logBattleEvent(state, `🚀 LAAT Gunship Strike deals ${finalGunDmg} direct Health damage to ${e.name}!`, 'damage', e.id);
              }

              if (preH >= e.maxHp * 0.5 && e.hp < e.maxHp * 0.5) triggerLeiaUltimateCharge(state, e);
              if (e.hp === 0) runDefeatHooks(state, e);
           }
        });
     }
  }

  // War Architect Tarkin Special 1 (Strategic Containment): Locked Down enemies take 15% Max Health bonus damage
  if (attacker.characterId === 'gl_tarkin' && ability.id === 'tarkin_s1') {
     enemies.filter(e => e.activeInBattle && e.hp > 0).forEach(e => {
        if (e.statuses.some(s => s.name === 'Lockdown')) {
           const bonus = Math.round(e.maxHp * 0.15);
           e.hp = Math.max(0, e.hp - bonus);
           logBattleEvent(state, `💥 Strategic Containment: ${e.name} takes ${bonus} bonus damage from Lockdown!`, 'damage', e.id, attacker.id);
        }
     });
  }

  // War Architect Tarkin Ultimate: The Price Of Disorder
  if (attacker.characterId === 'gl_tarkin' && ability.type === 'ultimate') {
     logBattleEvent(state, `🧐 Ultimate: The Price Of Disorder triggers! Ordering massive assist!`, 'ultimate');
     
     // Dispel all buffs from all enemies
     enemies.filter(e => e.activeInBattle && e.hp > 0).forEach(e => {
        e.statuses = e.statuses.filter(s => {
           const def = STATUS_DEFINITIONS[s.name];
           if (!def) return true;
           if (def.type === 'buff' && def.flags && def.flags.includes('prevent_cleanse')) return true; // keep undispellable
           return def.type !== 'buff';
        });
        logBattleEvent(state, `✨ All Buffs Dispelled from ${e.name}`, 'info');
     });

     // All enemies gain Lockdown (2 turns)
     enemies.filter(e => e.activeInBattle && e.hp > 0).forEach(e => {
        applyStatus(state, e, 'Lockdown', 2, true, attacker);
     });

     // Coruscant Guard allies gain Riot Control, Offense Up (2 turns), Defense Up (2 turns), and Speed Up (2 turns)
     allies.filter(a => a.activeInBattle && a.hp > 0).forEach(a => {
        if (checkHasTag(a, 'Coruscant Guard')) {
           applyStatus(state, a, 'Riot Control', 2, false, attacker);
           applyStatus(state, a, 'Offense Up', 2, false, attacker);
           applyStatus(state, a, 'Defense Up', 2, false, attacker);
           applyStatus(state, a, 'Speed Up', 2, false, attacker);
        }
     });

     // Then all Coruscant Guard allies assist
     allies.filter(a => a.activeInBattle && a.hp > 0).forEach(a => {
        if (checkHasTag(a, 'Coruscant Guard') && a.id !== attacker.id) {
           const basic = a.abilities.find(ab => ab.type === 'basic') || a.abilities[0];
           logBattleEvent(state, `⚡ Assist: ${a.name} assists on ${target.name}!`, 'info');
           executeCombatAction(state, a.id, basic, target.id, undefined, 1, 0);
        }
     });
  }

  // Cooldown reduction check for Chancellor Palpatine's Emergency Powers
  const reducesCooldowns = ability.effects.some(e => e.toLowerCase().includes('cooldown_reduction') || e.toLowerCase().includes('reduce cooldowns'));
  if (reducesCooldowns) {
     allies.filter(a => a.activeInBattle && a.hp > 0).forEach(a => {
        Object.keys(a.cooldowns).forEach(key => {
           if (a.cooldowns[key] > 0) {
              a.cooldowns[key] = Math.max(0, a.cooldowns[key] - 1);
           }
        });
     });
     logBattleEvent(state, `⏳ Cooldowns reduced by 1 for all allies!`, 'buff');
  }

  // Bonus Turn check for Chancellor Palpatine's Emergency Powers
  const grantsBonusTurn = ability.effects.some(e => e.toLowerCase().includes('bonus_turn') || e.toLowerCase().includes('bonus turn'));
  if (grantsBonusTurn) {
     allies.filter(a => a.activeInBattle && a.hp > 0).forEach(a => {
        if (a.id !== attacker.id) { // Chancellor Palpatine grants it to other allies
           state.bonusTurnQueue.push(a.id);
           logBattleEvent(state, `⚡ Bonus Turn: ${a.name} is granted a BONUS turn!`, 'buff');
        }
     });
  }

  // --- Plo Koon (Journey) Custom Ability Overrides ---
  if (attacker.characterId === 'plo_koon_journey') {
     // Whenever Plo Koon uses a Special Ability: Random enemy gains Marked (1 turn).
     if (ability.type === 'special') {
        const activeEnemies = enemies.filter(u => u.activeInBattle && u.hp > 0);
        if (activeEnemies.length > 0) {
           const randEnemy = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];
           logBattleEvent(state, `🎯 Compassion And Resolve: Plo Koon uses Special! Inflicting Marked on random enemy: ${randEnemy.name}`, 'debuff');
           applyStatus(state, randEnemy, 'Marked', 1, true, attacker);
        }
     }

     if (ability.id === 'plo_journey_b') {
        if (target.statuses.some(s => s.name === 'Marked' || s.name === 'Ambushed')) {
           // Dispel 1 buff from target
           const buffIndex = target.statuses.findIndex(s => !s.isDebuff);
           if (buffIndex !== -1) {
              const removedBuff = target.statuses.splice(buffIndex, 1)[0];
              logBattleEvent(state, `🛡️ Force-Guided Strike: Plo Koon dispels ${removedBuff.name} from ${target.name}`, 'info');
           }
        }
        if (target.statuses.some(s => s.name === 'Ambushed')) {
           logBattleEvent(state, `🛡️ Force-Guided Strike: All Wolfpack allies recover 5% Protection!`, 'heal');
           allies.forEach(a => {
              if (checkHasTag(a, 'Wolfpack') && a.activeInBattle && a.hp > 0 && !hasStatusFlag(a, 'prevent_prot_recovery')) {
                 const rec = Math.round(a.maxProtection * 0.05);
                 a.protection = Math.min(a.maxProtection, a.protection + rec);
              }
           });
        }
     }

     if (ability.id === 'plo_journey_s1') {
        const chosenAlly = explicitTargetAlly || (allies.length > 0 ? allies[0] : null);
        if (chosenAlly) {
           logBattleEvent(state, `🛡️ Jedi Rescue Operation: Healing and cleansing ${chosenAlly.name}!`, 'heal');
           const hAmt = Math.round(chosenAlly.maxHp * 0.25);
           if (!hasStatusFlag(chosenAlly, 'prevent_heal')) {
              chosenAlly.hp = Math.min(chosenAlly.maxHp, chosenAlly.hp + hAmt);
           }
           const pAmt = Math.round(chosenAlly.maxProtection * 0.25);
           if (!hasStatusFlag(chosenAlly, 'prevent_prot_recovery')) {
              chosenAlly.protection = Math.min(chosenAlly.maxProtection, chosenAlly.protection + pAmt);
           }
           // Dispel ALL debuffs
           const preDebuffs = chosenAlly.statuses.length;
           chosenAlly.statuses = chosenAlly.statuses.filter(s => !s.isDebuff);
           if (chosenAlly.statuses.length < preDebuffs) {
              logBattleEvent(state, `✨ Dispel: Cleansed all debuffs from ${chosenAlly.name}`, 'heal');
           }
           if (checkHasTag(chosenAlly, 'Wolfpack')) {
              applyStatus(state, chosenAlly, 'Defense Up', 2, false, attacker);
           }
        }
     }

     if (ability.id === 'plo_journey_s2') {
        logBattleEvent(state, `🛡️ Wolfpack Reinforcements: Buffing Wolfpack allies and target enemy!`, 'buff');
        allies.forEach(a => {
           if (checkHasTag(a, 'Wolfpack') && a.activeInBattle && a.hp > 0) {
              applyStatus(state, a, 'Protection Up', 2, false, attacker);
              applyStatus(state, a, 'Tenacity Up', 2, false, attacker);
           }
        });
        const hasMarked = target.statuses.some(s => s.name === 'Marked' || s.name === 'Ambushed');
        if (hasMarked) {
           logBattleEvent(state, `🎯 Dual Target: Target is already Marked! Inflicting Ambushed (2 turns).`, 'debuff');
           applyStatus(state, target, 'Ambushed', 2, true, attacker);
        } else {
           applyStatus(state, target, 'Marked', 2, true, attacker);
        }
     }
  }

  // --- Boost Custom Ability Overrides ---
  if (attacker.characterId === 'wp_boost') {
     if (ability.id === 'boost_b') {
        if (target.statuses.some(s => s.name === 'Marked' || s.name === 'Ambushed')) {
           logBattleEvent(state, `🚀 Coordinated Burst: Target is Marked/Ambushed! Calling random Wolfpack ally to Assist!`, 'info');
           const wpAllies = allies.filter(u => u.activeInBattle && u.hp > 0 && u.id !== attacker.id && checkHasTag(u, 'Wolfpack') && !hasStatusFlag(u, 'prevent_assist'));
           if (wpAllies.length > 0) {
              const chosen = wpAllies[Math.floor(Math.random() * wpAllies.length)];
              const basic = chosen.abilities.find(a => a.type === 'basic') || chosen.abilities[0];
              logBattleEvent(state, `➡️ Assist: Wolfpack ally ${chosen.name} assists!`, 'info');
              executeCombatAction(state, chosen.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
           }
        }
     }

     if (ability.id === 'boost_s1') {
        const alreadyMarked = target.statuses.some(s => s.name === 'Marked' || s.name === 'Ambushed');
        if (alreadyMarked) {
           logBattleEvent(state, `🎯 Flanking Route: Target is already Marked! Inflicting Ambushed (2 turns).`, 'debuff');
           applyStatus(state, target, 'Ambushed', 2, true, attacker);
        } else {
           logBattleEvent(state, `🎯 Flanking Route: Inflicting Marked (2 turns).`, 'debuff');
           applyStatus(state, target, 'Marked', 2, true, attacker);
        }
     }

     if (ability.id === 'boost_s2') {
        allies.forEach(a => {
           if (checkHasTag(a, 'Wolfpack') && a.activeInBattle && a.hp > 0) {
              applyStatus(state, a, 'Speed Up', 2, false, attacker);
           }
        });
        const alreadyMarked = target.statuses.some(s => s.name === 'Marked' || s.name === 'Ambushed');
        if (alreadyMarked) {
           logBattleEvent(state, `🎯 Box Them In: Target already Marked/Ambushed! Inflicting Ambushed (2 turns).`, 'debuff');
           applyStatus(state, target, 'Ambushed', 2, true, attacker);
        } else {
           applyStatus(state, target, 'Marked', 2, true, attacker);
        }
        if (target.statuses.some(s => s.name === 'Ambushed')) {
           const comet = allies.find(u => u.characterId === 'wp_scout' && u.activeInBattle && u.hp > 0 && !hasStatusFlag(u, 'prevent_assist'));
           if (comet) {
              logBattleEvent(state, `🚀 Box Them In: Target is Ambushed! Calling Comet to Assist!`, 'info');
              const basic = comet.abilities.find(a => a.type === 'basic') || comet.abilities[0];
              executeCombatAction(state, comet.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
           }
        }
     }
  }

  // --- JEDI HIGH COUNCIL CORE FUNCTIONS ---
  const hasCouncilGuidance = (u: CombatUnit) => u.statuses.some(s => s.name === 'Council Guidance');
  const consumeCouncilGuidance = (u: CombatUnit) => {
     const idx = u.statuses.findIndex(s => s.name === 'Council Guidance');
     if (idx !== -1) {
        u.statuses.splice(idx, 1);
        onCouncilGuidanceConsumed(state, u);
        return true;
     }
     return false;
  };

  // 1. Adi Gallia
  if (ability.id === 'adi_spec1') {
     const hadGuidance = hasCouncilGuidance(attacker);
     applyStatus(state, attacker, 'Council Guidance', 99, false, attacker);
     if (hadGuidance) {
        consumeCouncilGuidance(attacker);
        applyStatus(state, target, 'Stun', 1, true, attacker);
        logBattleEvent(state, `🤺 Swift Intervention Special: Adi consumes Council Guidance to inflict Stun on ${target.name}!`, 'debuff');
     }
  }

  if (ability.id === 'adi_spec2') {
     enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0) {
           applyStatus(state, e, 'Speed Down', 2, true, attacker);
        }
     });
     if (hasCouncilGuidance(attacker)) {
        consumeCouncilGuidance(attacker);
        enemies.forEach(e => {
           if (e.activeInBattle && e.hp > 0 && !hasStatusFlag(e, 'prevent_tm_reduction')) {
              e.turnMeter = Math.max(0, e.turnMeter - 20);
           }
        });
        logBattleEvent(state, `🤺 Battlefield Oversight: Adi consumes Council Guidance to drain 20% TM from all enemies!`, 'debuff');
     }
  }

  // 2. Oppo Rancisis
  if (ability.id === 'oppo_spec1') {
     applyStatus(state, attacker, 'Taunt', 2, false, attacker);
     applyStatus(state, attacker, 'Defense Up', 2, false, attacker);
     applyStatus(state, attacker, 'Council Guidance', 99, false, attacker);
  }

  if (ability.id === 'oppo_spec2') {
     allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Jedi High Council') || checkHasTag(a, 'Jedi High Council'))) {
           applyStatus(state, a, 'Protection Up', 2, false, attacker, 1);
           if (hasCouncilGuidance(a)) {
              a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.10));
              if (!hasStatusFlag(a, 'prevent_prot_recovery')) {
                 a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.10));
              }
              consumeCouncilGuidance(a);
              logBattleEvent(state, `🐚 Predictive Defense: ${a.name} recovers 10% Health and Protection, then consumes Council Guidance.`, 'heal');
           }
        }
     });
  }

  // 3. Coleman Kcaj
  if (ability.id === 'coleman_basic') {
     const tAlly = explicitTargetAlly || target;
     if (tAlly && tAlly.team === attacker.team) {
        tAlly.hp = Math.min(tAlly.maxHp, tAlly.hp + Math.round(tAlly.maxHp * 0.05));
        if (!hasStatusFlag(tAlly, 'prevent_prot_recovery')) {
           tAlly.protection = Math.min(tAlly.maxProtection, tAlly.protection + Math.round(tAlly.maxProtection * 0.05));
        }
        logBattleEvent(state, `🧠 Quiet Counsel: ${tAlly.name} recovers 5% Health and Protection!`, 'heal');
     }
  }

  if (ability.id === 'coleman_spec1') {
     const tAlly = explicitTargetAlly || target;
     if (tAlly && tAlly.team === attacker.team) {
        const hadGuid = hasCouncilGuidance(tAlly);
        applyStatus(state, tAlly, 'Council Guidance', 99, false, attacker);
        applyStatus(state, tAlly, 'Defense Up', 2, false, attacker);
        applyStatus(state, tAlly, 'Tenacity Up', 2, false, attacker);
        if (hadGuid) {
           Object.keys(tAlly.cooldowns).forEach(key => {
              if (tAlly.cooldowns[key] > 0) {
                 tAlly.cooldowns[key]--;
              }
           });
           logBattleEvent(state, `🧠 Voice Of Prudence: ${tAlly.name} already had Council Guidance; Cooldowns reduced by 1!`, 'buff');
        }
     }
  }

  if (ability.id === 'coleman_spec2') {
     allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0) {
           if (a.tags.includes('Jedi High Council') || checkHasTag(a, 'Jedi High Council')) {
              a.statuses = a.statuses.filter(s => !s.isDebuff);
           }
           applyStatus(state, a, 'Protection Up', 2, false, attacker, 1);
           if (!hasCouncilGuidance(a)) {
              applyStatus(state, a, 'Council Guidance', 99, false, attacker);
           }
        }
     });
     logBattleEvent(state, `🧠 Avert Disaster Special: Dispelled and applied Protection Up / Council Guidance to allies!`, 'heal');
  }

  // --- BARRISS OFFEE ACTIVE ABILITIES ---
  if (ability.id === 'barriss_offee_basic') {
     applyStatus(state, target, 'Healing Immunity', 1, true, attacker);
  }

  if (ability.id === 'barriss_offee_spec1') {
     const hadInv = target.statuses.some(s => s.name === 'Investigation');
     applyStatus(state, target, 'Investigation', 2, true, attacker);
     if (hadInv) {
        applyStatus(state, target, 'Ability Block', 1, true, attacker);
     }
  }

  if (ability.id === 'barriss_offee_spec2') {
     const tAlly = explicitTargetAlly || target;
     if (tAlly && tAlly.team === attacker.team) {
        tAlly.hp = Math.min(tAlly.maxHp, tAlly.hp + Math.round(tAlly.maxHp * 0.20));
        tAlly.statuses = tAlly.statuses.filter(s => !s.isDebuff);
        logBattleEvent(state, `🤐 False Reassurance: ${tAlly.name} recovers 20% Health and is cleansed of all debuffs!`, 'heal');
     }
     const activeEnemies = enemies.filter(u => u.activeInBattle && u.hp > 0);
     if (activeEnemies.length > 0) {
        const randEnemy = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];
        applyStatus(state, randEnemy, 'Investigation', 2, true, attacker);
     }
  }

  // --- QUINLAN VOS ACTIVE ABILITIES ---
  if (ability.id === 'quinlan_vos_basic') {
     applyStatus(state, target, 'Investigation', 2, true, attacker);
  }

  if (ability.id === 'quinlan_vos_spec1') {
     applyStatus(state, attacker, 'Stealth', 2, false, attacker);
     applyStatus(state, attacker, 'Critical Chance Up', 2, false, attacker);
     applyStatus(state, target, 'Investigation', 2, true, attacker);
  }

  if (ability.id === 'quinlan_vos_spec2') {
     const hadInv = target.statuses.some(s => s.name === 'Investigation');
     if (hadInv) {
        target.statuses = target.statuses.filter(s => s.name !== 'Investigation');
        onInvestigationRemoved(state, target, attacker);
        applyStatus(state, target, 'Arrest Warrant', 2, true, attacker);
     }
  }

  // --- IMA-GUN DI ACTIVE ABILITIES ---
  if (ability.id === 'ima_gun_di_basic') {
     const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
     const activeSquad = squad.filter(u => u.activeInBattle && u.hp > 0);
     if (activeSquad.length > 0) {
        const randAlly = activeSquad[Math.floor(Math.random() * activeSquad.length)];
        const hHeal = Math.round(randAlly.maxHp * 0.10);
        const pHeal = Math.round(randAlly.maxProtection * 0.10);
        randAlly.hp = Math.min(randAlly.maxHp, randAlly.hp + hHeal);
        if (!hasStatusFlag(randAlly, 'prevent_prot_recovery')) {
           randAlly.protection = Math.min(randAlly.maxProtection, randAlly.protection + pHeal);
        }
        logBattleEvent(state, `🛡️ Stand Together: ${randAlly.name} recovers ${hHeal} Health and ${pHeal} Protection.`, 'heal');
     }
  }

  if (ability.id === 'ima_gun_di_spec1') {
     applyStatus(state, attacker, 'Taunt', 2, false, attacker);
     applyStatus(state, attacker, 'Defense Up', 2, false, attacker);
  }

  if (ability.id === 'ima_gun_di_spec2') {
     const healthLost = Math.round(attacker.maxHp * 0.20);
     attacker.hp = Math.max(1, attacker.hp - healthLost);
     logBattleEvent(state, `🛡️ No Matter The Cost: Ima-Gun Di sacrifices ${healthLost} Health!`, 'damage');
     
     triggerImaGunDiHealthLoss(state, attacker);

     allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Clone Trooper') || checkHasTag(a, 'Clone Trooper'))) {
           a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.20));
           applyStatus(state, a, 'Offense Up', 2, false, attacker);
        }
     });
     logBattleEvent(state, `🛡️ No Matter The Cost: Clone Trooper allies recover 20% Health and gain Offense Up!`, 'heal');
  }

  // 4. Luminara Unduli
  if (ability.id === 'luminara_basic') {
     const tAlly = explicitTargetAlly || target;
     if (tAlly && tAlly.team === attacker.team) {
        let pct = 0.05;
        if (hasCouncilGuidance(tAlly)) {
           pct += 0.05;
        }
        tAlly.hp = Math.min(tAlly.maxHp, tAlly.hp + Math.round(tAlly.maxHp * pct));
        logBattleEvent(state, `🌸 Graceful Strike: ${tAlly.name} recovers ${pct*100}% Health!`, 'heal');
     }
  }

  if (ability.id === 'luminara_spec1') {
     const tAlly = explicitTargetAlly || target;
     if (tAlly && tAlly.team === attacker.team) {
        tAlly.hp = Math.min(tAlly.maxHp, tAlly.hp + Math.round(tAlly.maxHp * 0.25));
        tAlly.statuses = tAlly.statuses.filter(s => !s.isDebuff);
        applyStatus(state, tAlly, 'Council Guidance', 99, false, attacker);
        logBattleEvent(state, `💖 Healing Trance: ${tAlly.name} recovers 25% Health, dispelled debuffs, and gains Council Guidance.`, 'heal');
     }
  }

  if (ability.id === 'luminara_spec2') {
     allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0) {
           a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.15));
           applyStatus(state, a, 'Tenacity Up', 2, false, attacker);
           if (hasCouncilGuidance(a)) {
              applyStatus(state, a, 'Protection Up', 2, false, attacker);
              consumeCouncilGuidance(a);
           }
        }
     });
     logBattleEvent(state, `🌸 Light Of Mirial: Healed all allies and consumed Council Guidance for Protection Up!`, 'heal');
  }

  // 5. Yaddle
  if (ability.id === 'yaddle_basic') {
     const tAlly = explicitTargetAlly || target;
     if (tAlly && tAlly.team === attacker.team) {
        applyStatus(state, tAlly, 'Council Guidance', 99, false, attacker);
     }
  }

  if (ability.id === 'yaddle_spec1') {
     const tAlly = explicitTargetAlly || target;
     if (tAlly && tAlly.team === attacker.team) {
        const hadGuid = hasCouncilGuidance(tAlly);
        applyStatus(state, tAlly, 'Council Guidance', 99, false, attacker);
        tAlly.hp = Math.min(tAlly.maxHp, tAlly.hp + Math.round(tAlly.maxHp * 0.20));
        if (!hasStatusFlag(tAlly, 'prevent_prot_recovery')) {
           tAlly.protection = Math.min(tAlly.maxProtection, tAlly.protection + Math.round(tAlly.maxProtection * 0.20));
        }
        if (hadGuid) {
           Object.keys(tAlly.cooldowns).forEach(key => {
              if (tAlly.cooldowns[key] > 0) {
                 tAlly.cooldowns[key]--;
              }
           });
           logBattleEvent(state, `📚 Ancient Wisdom: Target ${tAlly.name} had Council Guidance; Cooldowns reduced by 1!`, 'buff');
        }
     }
  }

  if (ability.id === 'yaddle_spec2') {
     allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0) {
           if (a.tags.includes('Jedi High Council') || checkHasTag(a, 'Jedi High Council')) {
              applyStatus(state, a, 'Tenacity Up', 2, false, attacker);
              applyStatus(state, a, 'Defense Up', 2, false, attacker);
           }
           if (!hasCouncilGuidance(a)) {
              applyStatus(state, a, 'Council Guidance', 99, false, attacker);
           }
        }
     });
     logBattleEvent(state, `📚 Harmony Through The Force: Applied buffs and Council Guidance!`, 'buff');
  }

  if (ability.id === 'kam_b') {
     const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
     const marines = squad.filter(u => u.activeInBattle && u.hp > 0 && (u.tags.includes('Galactic Marines') || checkHasTag(u, 'Galactic Marines')));
     if (marines.length > 0 && Math.random() < 0.5) {
        const randMarine = marines[Math.floor(Math.random() * marines.length)];
        if (!hasStatusFlag(randMarine, 'prevent_tm_gain')) {
           randMarine.turnMeter = Math.min(100, randMarine.turnMeter + 15);
           logBattleEvent(state, `🧠 Form IV Ataru: Granted 15% TM to ${randMarine.name}!`, 'buff');
        }
     } else {
        applyStatus(state, attacker, 'Council Guidance', 99, false, attacker);
     }
  }

  if (ability.id === 'kam_s1') {
     const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
     squad.forEach(a => {
        if (a.activeInBattle && a.hp > 0) {
           if (a.tags.includes('Galactic Marines') || checkHasTag(a, 'Galactic Marines')) {
              if (a.id !== attacker.id) {
                 const aBasic = a.abilities.find(ab => ab.type === 'basic') || a.abilities[0];
                 executeCombatAction(state, a.id, aBasic, target.id, undefined, assistDepth + 1, counterDepth);
              }
           }
           if (a.tags.includes('Jedi') || checkHasTag(a, 'Jedi')) {
              applyStatus(state, a, 'Foresight', 2, false, attacker);
           }
        }
     });
     logBattleEvent(state, `🧠 Jedi Rush: All Galactic Marines called to assist and Jedi gained Foresight!`, 'buff');
  }

  // 6. Aayla Secura
  if (ability.id === 'aayla_basic') {
     if (hasCouncilGuidance(attacker) && assistDepth < 2) {
        consumeCouncilGuidance(attacker);
        logBattleEvent(state, `🤸 Elegant Assault: Aayla consumes Council Guidance to trigger a bonus attack!`, 'buff');
        executeCombatAction(state, attacker.id, attacker.abilities[0], target.id, undefined, assistDepth + 1, counterDepth);
     }
  }

  if (ability.id === 'aayla_spec1') {
     if (hasCouncilGuidance(attacker) && assistDepth < 2) {
        consumeCouncilGuidance(attacker);
        logBattleEvent(state, `🤸 Twin-Blade Flourish: Aayla consumes Council Guidance to trigger bonus strikes!`, 'buff');
        executeCombatAction(state, attacker.id, attacker.abilities[0], target.id, undefined, assistDepth + 1, counterDepth);
        executeCombatAction(state, attacker.id, attacker.abilities[0], target.id, undefined, assistDepth + 1, counterDepth);
     }
  }

  if (ability.id === 'aayla_spec2') {
     applyStatus(state, attacker, 'Council Guidance', 99, false, attacker);
     applyStatus(state, attacker, 'Critical Chance Up', 2, false, attacker);
     applyStatus(state, attacker, 'Critical Damage Up', 2, false, attacker);
  }

  // --- Jedi Guardian Additional Custom Overrides ---
  if (ability.id === 'kit_spec1') {
     applyStatus(state, target, 'Buff Immunity', 2, true, attacker);
     if (target.statuses.some(s => s.name === 'Investigation')) {
        applyStatus(state, target, 'Healing Immunity', 2, true, attacker);
        logBattleEvent(state, `⚡ Master Of The Mon Cala: Target has Investigation! Inflicted Healing Immunity (2 turns).`, 'debuff');
     }
  }

  if (ability.id === 'kit_spec2') {
     enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0 && e.statuses.some(s => s.name === 'Investigation')) {
           const bonusDmg = Math.round(attacker.offense * 0.5);
           e.hp = Math.max(0, e.hp - bonusDmg);
           logBattleEvent(state, `⚡ Underwater Assault: ${e.name} has Investigation! Taking ${bonusDmg} bonus damage!`, 'damage', e.id, attacker.id, bonusDmg);
           if (e.hp === 0) runDefeatHooks(state, e);
        }
     });
  }

  if (ability.id === 'agen_basic') {
     const tAlly = globalTargetAllies[0];
     if (tAlly && tAlly.team === attacker.team) {
        tAlly.hp = Math.min(tAlly.maxHp, tAlly.hp + Math.round(tAlly.maxHp * 0.05));
        if (!hasStatusFlag(tAlly, 'prevent_prot_recovery')) {
           tAlly.protection = Math.min(tAlly.maxProtection, tAlly.protection + Math.round(tAlly.maxProtection * 0.05));
        }
        logBattleEvent(state, `🛡️ Council Enforcer: ${tAlly.name} recovers 5% Health and Protection!`, 'heal');
     }
  }

  if (ability.id === 'agen_spec1') {
     const tAlly = globalTargetAllies[0];
     if (tAlly && tAlly.team === attacker.team) {
        applyStatus(state, tAlly, 'Offense Up', 2, false, attacker);
        applyStatus(state, tAlly, 'Critical Chance Up', 2, false, attacker);
        const hasInvestigatedEnemy = enemies.some(e => e.activeInBattle && e.hp > 0 && e.statuses.some(s => s.name === 'Investigation'));
        if (hasInvestigatedEnemy && !hasStatusFlag(tAlly, 'prevent_assist') && assistDepth < 2) {
           logBattleEvent(state, `🛡️ Jedi Coordination: An enemy has Investigation! Calling ${tAlly.name} to Assist!`, 'info');
           const allyBasic = tAlly.abilities.find(ab => ab.type === 'basic') || tAlly.abilities[0];
           executeCombatAction(state, tAlly.id, allyBasic, target.id, undefined, assistDepth + 1, counterDepth);
        }
     }
  }

  if (ability.id === 'agen_spec2') {
     const hasInvestigation = target.statuses.some(s => s.name === 'Investigation');
     const hasArrest = target.statuses.some(s => s.name === 'Arrest Warrant');
     if (hasInvestigation) {
        target.statuses = target.statuses.filter(s => s.name !== 'Investigation');
        applyStatus(state, target, 'Arrest Warrant', 2, true, attacker);
        logBattleEvent(state, `🛡️ Execute The Warrant: Removed Investigation and inflicted Arrest Warrant on ${target.name}!`, 'debuff');
     }
     if (hasArrest) {
        allies.forEach(a => {
           if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Jedi Guardian') || checkHasTag(a, 'Jedi Guardian'))) {
              Object.keys(a.cooldowns).forEach(key => {
                 if (a.cooldowns[key] > 0) {
                    a.cooldowns[key]--;
                 }
              });
           }
        });
        logBattleEvent(state, `🛡️ Execute The Warrant: Target already had Arrest Warrant! Cooldowns of all Jedi Guardian allies reduced by 1.`, 'buff');
     }
  }

  if (ability.id === 'depa_basic') {
     if (Math.random() < 0.50) {
        applyStatus(state, target, 'Investigation', 2, true, attacker);
     }
     if (target.statuses.some(s => s.name === 'Investigation')) {
        attacker.hp = Math.min(attacker.maxHp, attacker.hp + Math.round(attacker.maxHp * 0.05));
        logBattleEvent(state, `⚔️ Disciplined Strike: Target has Investigation! Depa Billaba recovers 5% Health.`, 'heal');
     }
  }

  if (ability.id === 'depa_spec1') {
     applyStatus(state, target, 'Investigation', 2, true, attacker);
     allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Jedi Guardian') || checkHasTag(a, 'Jedi Guardian'))) {
           applyStatus(state, a, 'Offense Up', 2, false, attacker);
        }
     });
     logBattleEvent(state, `👑 Council Directive: Applied Investigation to ${target.name} and Offense Up to Jedi Guardian allies!`, 'buff');
  }

  if (ability.id === 'depa_spec2') {
     const tAlly = globalTargetAllies[0];
     if (tAlly && tAlly.team === attacker.team) {
        applyStatus(state, tAlly, 'Defense Up', 2, false, attacker);
        applyStatus(state, tAlly, 'Tenacity Up', 2, false, attacker);
        const hasInvestigatedEnemy = enemies.some(e => e.activeInBattle && e.hp > 0 && e.statuses.some(s => s.name === 'Investigation'));
        if (hasInvestigatedEnemy && !hasStatusFlag(tAlly, 'prevent_assist') && assistDepth < 2) {
           logBattleEvent(state, `🗡️ Master Of Caleb: An enemy has Investigation! Calling ${tAlly.name} to Assist!`, 'info');
           const allyBasic = tAlly.abilities.find(ab => ab.type === 'basic') || tAlly.abilities[0];
           executeCombatAction(state, tAlly.id, allyBasic, target.id, undefined, assistDepth + 1, counterDepth);
        }
     }
  }

  if (ability.id === 'jocasta_basic') {
     applyStatus(state, target, 'Investigation', 2, true, attacker);
  }

  if (ability.id === 'jocasta_spec1') {
     target.statuses = target.statuses.filter(s => s.isDebuff);
     logBattleEvent(state, `📚 Lost Twenty: Dispelled all buffs from ${target.name}!`, 'info');
     const hadInvestigation = target.statuses.some(s => s.name === 'Investigation');
     applyStatus(state, target, 'Investigation', 2, true, attacker);
     if (hadInvestigation && !hasStatusFlag(target, 'prevent_tm_reduction')) {
        target.turnMeter = Math.max(0, target.turnMeter - 25);
        logBattleEvent(state, `📚 Lost Twenty: Target already had Investigation! Reduced Turn Meter by 25%.`, 'debuff');
     }
  }

  if (ability.id === 'jocasta_spec2') {
     allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Jedi Guardian') || checkHasTag(a, 'Jedi Guardian'))) {
           applyStatus(state, a, 'Tenacity Up', 2, false, attacker);
           applyStatus(state, a, 'Potency Up', 2, false, attacker);
        }
     });
     const eligibleEnemies = enemies.filter(e => e.activeInBattle && e.hp > 0 && !e.statuses.some(s => s.name === 'Investigation'));
     if (eligibleEnemies.length > 0) {
        eligibleEnemies.sort((a, b) => b.hp - a.hp);
        applyStatus(state, eligibleEnemies[0], 'Investigation', 2, true, attacker);
        logBattleEvent(state, `📚 Ancient Records: Strongest non-investigated enemy ${eligibleEnemies[0].name} gains Investigation!`, 'debuff');
     }
  }

  if (ability.id === 'saesee_basic') {
     if (target.statuses.some(s => s.name === 'Investigation')) {
        applyStatus(state, attacker, 'Offense Up', 1, false, attacker);
        logBattleEvent(state, `🤺 Precision Slash: Target has Investigation! Saesee Tiin gains Offense Up (1 turn).`, 'buff');
     }
  }

  if (ability.id === 'saesee_spec1') {
     if (target.statuses.some(s => s.name === 'Investigation')) {
        applyStatus(state, target, 'Stun', 1, true, attacker);
        applyStatus(state, target, 'Exposed', 2, true, attacker);
        logBattleEvent(state, `🤺 Aggressive Advance: Target has Investigation! Inflicted Stun and Exposed!`, 'debuff');
     }
  }

  // 7. Grand Master Yoda
  if (ability.id === 'yoda_basic') {
     const tAlly = explicitTargetAlly || target;
     if (tAlly && tAlly.team === attacker.team) {
        applyStatus(state, tAlly, 'Council Guidance', 99, false, attacker);
     }
  }

  if (ability.id === 'yoda_spec1') {
     allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Jedi High Council') || checkHasTag(a, 'Jedi High Council'))) {
           applyStatus(state, a, 'Council Guidance', 99, false, attacker);
        }
     });
     allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0 && hasCouncilGuidance(a)) {
           a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.10));
           if (!hasStatusFlag(a, 'prevent_prot_recovery')) {
              a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.10));
           }
        }
     });
     logBattleEvent(state, `🔮 Grand Master's Wisdom Special: Applied Council Guidance and heals!`, 'heal');
  }

  if (ability.id === 'yoda_spec2') {
     allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Jedi High Council') || checkHasTag(a, 'Jedi High Council'))) {
           applyStatus(state, a, 'Foresight', 2, false, attacker);
           applyStatus(state, a, 'Tenacity Up', 2, false, attacker);
           if (hasCouncilGuidance(a)) {
              Object.keys(a.cooldowns).forEach(key => {
                 if (a.cooldowns[key] > 0) {
                    a.cooldowns[key]--;
                 }
              });
           } else {
              applyStatus(state, a, 'Council Guidance', 99, false, attacker);
           }
        }
     });
     logBattleEvent(state, `🔮 See The Future: Foresight, Tenacity Up, and Guidance spread!`, 'buff');
  }

  // 8. Master Kenobi
  if (ability.id === 'kenobi_basic') {
     const hadGuid = hasCouncilGuidance(attacker);
     applyStatus(state, attacker, 'Council Guidance', 99, false, attacker);
     if (hadGuid && assistDepth < 2) {
        consumeCouncilGuidance(attacker);
        logBattleEvent(state, `🛡️ The Strongest Defense: Master Kenobi consumes Council Guidance for a bonus attack!`, 'buff');
        triggerAssist(state, attacker, target, 'Soresu Bonus strike', undefined);
     }
  }

  if (ability.id === 'kenobi_spec1') {
     applyStatus(state, attacker, 'Taunt', 2, false, attacker);
     applyStatus(state, attacker, 'Defense Up', 2, false, attacker);
     const hadGuid = hasCouncilGuidance(attacker);
     applyStatus(state, attacker, 'Council Guidance', 99, false, attacker);
     if (hadGuid) {
        consumeCouncilGuidance(attacker);
        attacker.hp = Math.min(attacker.maxHp, attacker.hp + Math.round(attacker.maxHp * 0.25));
        if (!hasStatusFlag(attacker, 'prevent_prot_recovery')) {
           attacker.protection = Math.min(attacker.maxProtection, attacker.protection + Math.round(attacker.maxProtection * 0.25));
        }
        attacker.statuses = attacker.statuses.filter(s => !s.isDebuff);
        logBattleEvent(state, `🛡️ Soresu Perfection: Master Kenobi consumes Council Guidance to recover 25% Health/Protection and cleanse!`, 'heal');
     }
  }

  if (ability.id === 'kenobi_spec2') {
     if (hasCouncilGuidance(attacker)) {
        consumeCouncilGuidance(attacker);
        applyStatus(state, target, 'Ability Block', 2, true, attacker);
        const bonusDmg = Math.round(target.hp * 0.30);
        target.hp = Math.max(0, target.hp - bonusDmg);
        logBattleEvent(state, `🛡️ The High Ground: Kenobi consumes Council Guidance to ignore defense and inflict Ability Block!`, 'damage');
     }
  }

  if (ability.id === 'kenobi_ultimate') {
     enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0) {
           e.statuses = e.statuses.filter(s => s.isDebuff);
        }
     });
     applyStatus(state, attacker, 'Damage Immunity', 1, false, attacker);
     applyStatus(state, attacker, 'Offense Up', 3, false, attacker);
     allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0) {
           applyStatus(state, a, 'Council Guidance', 99, false, attacker);
        }
     });
     enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0) {
           e.maxHp = Math.round(e.maxHp * 0.75);
           e.hp = Math.min(e.hp, e.maxHp);
        }
     });
     logBattleEvent(state, `🛡️ ULTIMATE: I WILL DO WHAT I MUST! Kenobi activates maximum defense. Jedi gain Council Guidance, enemies lose Max Health!`, 'ultimate');
  }

  // --- Wolfpack Heavy Custom Ability Overrides ---
  if (attacker.characterId === 'wp_heavy') {
     if (ability.id === 'wp_heavy_s1') {
        const activeEnemies = enemies.filter(u => u.activeInBattle && u.hp > 0);
        activeEnemies.forEach(e => {
           if (e.id !== target.id) {
              const isMarked = e.statuses.some(s => s.name === 'Marked' || s.name === 'Ambushed');
              const basicDamage = Math.round(attacker.offense * (isMarked ? 1.5 : 0.8));
              e.hp = Math.max(0, e.hp - basicDamage);
              logBattleEvent(state, `💥 Heavy Repeater Barrage deals ${basicDamage} damage to ${e.name} ${isMarked ? '(Marked Bonus!)' : ''}`, 'damage', e.id, attacker.id, basicDamage);
              if (e.hp === 0) runDefeatHooks(state, e);
           } else {
              const isMarked = target.statuses.some(s => s.name === 'Marked' || s.name === 'Ambushed');
              if (isMarked) {
                 const bonusDmg = Math.round(attacker.offense * 0.7);
                 target.hp = Math.max(0, target.hp - bonusDmg);
                 logBattleEvent(state, `💥 Heavy Repeater Barrage deals ${bonusDmg} bonus damage to Marked primary target ${target.name}!`, 'damage', target.id, attacker.id, bonusDmg);
                 if (target.hp === 0) runDefeatHooks(state, target);
              }
           }
        });
     }

     if (ability.id === 'wp_heavy_s2') {
        allies.forEach(a => {
           if (checkHasTag(a, 'Wolfpack') && a.activeInBattle && a.hp > 0) {
              applyStatus(state, a, 'Defense Up', 2, false, attacker);
              applyStatus(state, a, 'Protection Up', 2, false, attacker);
           }
        });
        const alreadyMarked = target.statuses.some(s => s.name === 'Marked' || s.name === 'Ambushed');
        if (alreadyMarked) {
           logBattleEvent(state, `🎯 Lock the Sector: Target is already Marked! Inflicting Ambushed (2 turns).`, 'debuff');
           applyStatus(state, target, 'Ambushed', 2, true, attacker);
        } else {
           applyStatus(state, target, 'Marked', 2, true, attacker);
        }
     }
  }
   // Run special scripted mechanics for active Journey Guide nodes
   runJourneyScripting(state);
}

function runJourneyScripting(state: CombatState) {
  if (state.ended) return;

  // Ensure dynamicState is initialized
  if (!state.dynamicState) {
    state.dynamicState = {};
  }

  const nodeID = state.rewardNodeId;
  if (!nodeID) return;

  // 1. Old Ben Phase 3 (j_old_ben_2) Duel Scripting
  if (nodeID === 'journey_phase_j_old_ben_2') {
    const vader = state.enemyTeam.find(u => u.characterId === 'darth_vader' && u.hp > 0);
    const oldBen = state.playerTeam.find(u => u.characterId === 'old_ben' && u.hp > 0);

    if (vader) {
      const hpPct = vader.hp / vader.maxHp;

      if (state.dynamicState.vaderHp75Triggered === undefined) state.dynamicState.vaderHp75Triggered = false;
      if (state.dynamicState.vaderHp50Triggered === undefined) state.dynamicState.vaderHp50Triggered = false;
      if (state.dynamicState.vaderHp25Triggered === undefined) state.dynamicState.vaderHp25Triggered = false;

      // Threshold 1: 75% HP -> Damage Immunity for Obi-Wan
      if (hpPct <= 0.75 && !state.dynamicState.vaderHp75Triggered) {
        state.dynamicState.vaderHp75Triggered = true;
        if (oldBen) {
          logBattleEvent(state, `⚔️ Darth Vader is weakened! Old Ben Kenobi senses an opening and gains Damage Immunity (1 turn)!`, 'buff');
          applyStatus(state, oldBen, 'Damage Immunity', 1, false, oldBen);
        }
      }

      // Threshold 2: 50% HP -> Enter Duel Stance (Freeze all other units)
      if (hpPct <= 0.50 && !state.dynamicState.vaderHp50Triggered) {
        state.dynamicState.vaderHp50Triggered = true;
        state.dynamicState.isDuelActive = true;
        logBattleEvent(state, `⚡ DUEL FORCE UNLEASHED: Obi-Wan and Darth Vader lock blades in a historic duel! All other combatants are frozen and untargetable!`, 'turn');
        if (oldBen) applyStatus(state, oldBen, 'Taunt', 3, false, oldBen);
        applyStatus(state, vader, 'Taunt', 3, false, vader);
      }

      // Threshold 3: 25% HP -> Sacrifice Obi-Wan and trigger ultimate Rebel victory
      if (hpPct <= 0.25 && !state.dynamicState.vaderHp25Triggered) {
        state.dynamicState.vaderHp25Triggered = true;
        state.dynamicState.isDuelActive = false;

        logBattleEvent(state, `🌅 SACRIFICE: "If you strike me down, I shall become more powerful than you can possibly imagine." Old Ben Kenobi sacrifices himself to secure the escape!`, 'death');
        if (oldBen) {
          oldBen.hp = 0;
          oldBen.activeInBattle = false;
          runDefeatHooks(state, oldBen);
        }

        // Grant remaining allies Offense Up and Speed Up
        state.playerTeam.forEach(u => {
          if (u.activeInBattle && u.hp > 0) {
            applyStatus(state, u, 'Offense Up', 2, false, null);
            applyStatus(state, u, 'Speed Up', 2, false, null);
          }
        });

        // Set victory
        state.ended = true;
        state.winner = 'player';
        logBattleEvent(state, '🏆 Galactic Victory achieved via the ultimate sacrifice!', 'death');
      }
    }
  }
}

// Summon unit builders
export function triggerSummon(state: CombatState, owner: CombatUnit, summonId: string) {
  const team = owner.team;
  const list = team === 'player' ? state.playerTeam : state.enemyTeam;
  if (list.length >= 6) {
    logBattleEvent(state, `Summons failed: Arena is full.`, 'info');
    return;
  }

  const baseChar = INITIAL_CHARACTERS.find(c => c.id === summonId);
  if (!baseChar) return;

  const mockProgress: PlayerCharacterProgress = {
    id: summonId,
    unlocked: true,
    level: owner.level || 1,
    stars: owner.stars || 1,
    gearTier: owner.gearTier || 1,
    relicLevel: owner.relicLevel || 0,
    legendLevel: 0,
    gearSlots: [false, false, false, false, false, false],
    abilityLevels: {}
  };

  const summonUnit = createCombatUnit(baseChar, team, list.length, mockProgress);
  summonUnit.isSummon = true;
  // Scaled health points and barrier protection shields relative to the owner
  summonUnit.maxHp = Math.round(owner.maxHp * 0.45);
  summonUnit.hp = summonUnit.maxHp;
  summonUnit.maxProtection = Math.round(owner.maxProtection * 0.35);
  summonUnit.protection = summonUnit.maxProtection;

  list.push(summonUnit);
  logBattleEvent(state, `🤖 ${summonUnit.name} was summoned! (Inherits Level ${owner.level || 1}, Stars ${owner.stars || 1}, G${owner.gearTier || 1}, R${owner.relicLevel || 0})`, 'summon');
}

// Assist chains inside safe recursion boundaries
function triggerAssist(state: CombatState, attacker: CombatUnit, target: CombatUnit, effectText: string, explicitAlly?: CombatUnit) {
  const team = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
  const aliveAllies = team.filter(u => 
    u.activeInBattle && 
    u.hp > 0 && 
    u.id !== attacker.id &&
    !hasStatusFlag(u, 'prevent_assist')
  );

  if (aliveAllies.length === 0) return;

  // Evaluate tags dynamically
  let eligible = [...aliveAllies];
  const effectLower = effectText.toLowerCase();
  
  const factions = ['501st', '212th', 'jedi', 'separatist', 'rebel', 'empire', 'sith', 'clone trooper', 'droid', 'mandalorian', 'hutt cartel', 'smuggler', 'scoundrel', 'republic', 'knightfall'];
  
  let targetedFactions = factions.filter(fac => effectLower.includes(fac) || effectLower.includes(fac.replace(' ', '_')));
  if (targetedFactions.length > 0) {
      eligible = eligible.filter(u => 
         targetedFactions.some(fac => checkHasTag(u, fac))
      );
  }

  if (eligible.length === 0) return;

  if (effectLower.includes('all') || effectLower.includes('assist_all')) {
    // Multi allies assist
    logBattleEvent(state, `📣 Coordinated team assist called!`, 'info');
    eligible.forEach((ally, idx) => {
      if (idx < MAX_ASSIST_DEPTH && target.activeInBattle && target.hp > 0) {
        const basic = ally.abilities.find(a => a.type === 'basic') || ally.abilities[0];
        logBattleEvent(state, `➡️ Assist: ${ally.name} strikes!`, 'info');
        executeCombatAction(state, ally.id, basic, target.id, undefined, idx + 1, 0);
      }
    });
  } else {
    // Single random assist or explicit target ally
    let chosen: CombatUnit;
    if (explicitAlly && eligible.some(a => a.id === explicitAlly.id)) {
        chosen = explicitAlly;
    } else {
        chosen = eligible[Math.floor(Math.random() * eligible.length)];
    }
    const basic = chosen.abilities.find(a => a.type === 'basic') || chosen.abilities[0];
    logBattleEvent(state, `➡️ Assist: ${chosen.name} strikes!`, 'info');
    executeCombatAction(state, chosen.id, basic, target.id, undefined, 1, 0);
  }
}

// Sim Battle Engine resolver (non-rendering, statistical solver)
export function solveSimBattle(
  playerChars: Character[],
  enemyChars: Character[],
  energyCost: number,
  saveState?: SaveState
): { success: boolean; stars: number; logs: string[] } {
  let logs: string[] = ['Initiating orbital hyper-sim resolving...'];
  
  // Calculate scaled player power
  let playerPower = 0;
  playerChars.forEach(c => {
    let basePower = c.powerLevel;
    if (saveState && saveState.characters[c.id]) {
      const prog = saveState.characters[c.id];
      const starMult = 1.0 + (prog.stars - 1) * 0.15;
      const levelMult = 1.0 + (prog.level - 1) * 0.01;
      const gearMult = 1.0 + (prog.gearTier - 1) * 0.15;
      const relicMult = 1.0 + prog.relicLevel * 0.20;
      basePower = Math.round(basePower * starMult * levelMult * gearMult * relicMult);
    } else {
        // Assume minimal if not passed
        basePower = Math.round(basePower * 0.2); 
    }
    playerPower += basePower;
  });

  // Calculate scaled enemy power (assuming enemies are appropriate difficulty)
  let enemyPower = 0;
  enemyChars.forEach(c => {
      // Enemy power scales heavily with node energy cost
      const difficultyMult = 1.0 + Math.max(0, (energyCost - 6) * 0.2);
      enemyPower += Math.round(c.powerLevel * difficultyMult);
  });

  logs.push(`Squad analytical value: ${playerPower} Power vs ${enemyPower} Opponent Defense Power.`);

  if (playerPower * 1.5 < enemyPower) {
    logs.push('WARNING: Defense forces are overwhelming. Hyper-simulation reports tactical failure.');
    return { success: false, stars: 0, logs };
  }

  // Sim success with stars
  let ratio = playerPower / enemyPower;
  let stars = 3;
  if (ratio < 1.1) stars = 1;
  else if (ratio < 1.3) stars = 2;

  logs.push(`Coordinated strike successful! Calculated resolution rating: ${stars} Stars!`);
  return { success: true, stars, logs };
}

export function applySquadPassives(state: CombatState, teamToApply?: 'player' | 'enemy' | 'all') {
  // Expose an extensible layer for custom entire-squad passives
  customSquadPassives.forEach(hook => hook(state));

  const teams: ('player' | 'enemy')[] = teamToApply && teamToApply !== 'all' ? [teamToApply] : ['player', 'enemy'];
  
  teams.forEach(t => {
    const squad = t === 'player' ? state.playerTeam : state.enemyTeam;
    const oppSquad = t === 'player' ? state.enemyTeam : state.playerTeam;
    
    // 1. Leader Ability Application
    const leader = squad.find(u => u.position === 0);
    if (leader) {
      const leaderAbility = leader.abilities.find(a => a.type === 'leader');
      if (leaderAbility) {
        logBattleEvent(state, `👑 LEADER DEPLOYED: [${leader.name}] activates "${leaderAbility.name}"!`, 'info');
        
        squad.forEach(unit => {
          let buffApplied = false;
          // Apply leadership attributes depending on leader characterId
          if (leader.characterId === 'captain_rex') {
            if (unit.tags.includes('501st') || unit.tags.includes('Clone Trooper') || unit.tags.includes('Galactic Republic')) {
              unit.speed += 25;
              buffApplied = true;
            }
          } else if (leader.characterId === 'general_skywalker') {
            if (unit.tags.includes('501st')) {
              unit.speed += 30;
              buffApplied = true;
            }
          } else if (leader.characterId === 'master_kenobi') {
             if (unit.tags.includes('Jedi High Council') || checkHasTag(unit, 'Jedi High Council')) {
                unit.speed += 40;
                unit.maxHp = Math.round(unit.maxHp * 1.40);
                unit.hp = unit.maxHp;
                unit.defense = (unit.defense || 50) + 15;
                buffApplied = true;
             }
          } else if (leader.characterId === 'yoda') {
             if (unit.tags.includes('Jedi High Council') || checkHasTag(unit, 'Jedi High Council')) {
                unit.speed += 25;
                unit.maxHp = Math.round(unit.maxHp * 1.20);
                unit.hp = unit.maxHp;
                buffApplied = true;
             }
          } else if (leader.characterId === 'eternal_fire_grievous') {
            if (unit.tags.includes('Separatist')) {
              unit.speed += 30;
              buffApplied = true;
            }
            if (unit.tags.includes('Droid')) {
              unit.offense *= 1.25;
            }
          } else if (leader.characterId === 'commander_voren') {
            if (unit.tags.includes('Imperial Remnant') || unit.tags.includes('Avalanche Remnant')) {
              unit.defense += 15;
              buffApplied = true;
            }
          } else if (leader.characterId === 'thrawn_remnant') {
            if (unit.tags.includes('Imperial Remnant')) {
              unit.speed += 25;
              unit.defense += 10;
              buffApplied = true;
            }
          } else if (leader.characterId === 'second_sister') {
            if (unit.tags.includes('Inquisitorius')) {
              unit.critDamage += 0.20;
              buffApplied = true;
            }
          } else if (leader.characterId === 'ninth_sister') {
            if (unit.tags.includes('Inquisitorius')) {
              unit.defense += 20;
              buffApplied = true;
            }
          } else if (leader.characterId === 'seventh_sister') {
            if (unit.tags.includes('Inquisitorius')) {
              unit.speed += 20;
              buffApplied = true;
            }
          } else if (leader.characterId === 'reva') {
            if (unit.tags.includes('Inquisitorius')) {
              unit.offense *= 1.25;
              buffApplied = true;
            }
          } else if (leader.characterId === 'grand_inquisitor') {
            if (unit.tags.includes('Inquisitorius')) {
              unit.speed += 30;
              buffApplied = true;
            }
          } else if (leader.characterId === 'bib_fortuna') {
            if (unit.tags.includes('Hutt Cartel')) {
              unit.speed += 20;
              buffApplied = true;
            }
          } else if (leader.characterId === 'boba_fett_daimyo') {
            if (unit.tags.includes('Hutt Cartel')) {
              unit.offense *= 1.25;
              buffApplied = true;
            }
          } else if (leader.characterId === 'jabba') {
            if (unit.tags.includes('Hutt Cartel')) {
              unit.speed += 25;
              unit.maxHp *= 1.35;
              unit.hp = unit.maxHp;
              buffApplied = true;
            }
          } else if (leader.characterId === 'hunter') {
            if (unit.tags.includes('Bad Batch')) {
              unit.speed += 25;
              buffApplied = true;
            }
          } else if (leader.characterId === 'mon_mothma') {
            if (unit.tags.includes('Rebel')) {
              unit.speed += 20;
              buffApplied = true;
            }
          } else if (leader.characterId === 'leia_gl') {
            if (unit.tags.includes('Rebel')) {
              unit.speed += 30;
              unit.maxProtection *= 1.20;
              unit.protection = unit.maxProtection;
              buffApplied = true;
            }
          } else if (leader.characterId === 'commander_cody') {
            if (unit.tags.includes('212th')) {
              unit.speed += 25;
              unit.maxHp = Math.round(unit.maxHp * 1.20);
              unit.hp = unit.maxHp;
              buffApplied = true;
            }
          } else if (leader.characterId === 'general_kenobi') {
            if (unit.tags.includes('212th')) {
              unit.maxHp = Math.round(unit.maxHp * 1.30);
              unit.hp = unit.maxHp;
              unit.defense = Math.round(unit.defense * 1.30);
              buffApplied = true;
            }
            if (unit === leader) {
              // At battle start: Gain Negotiator
              applyStatus(state, leader, 'Negotiator', 99, false, leader);
            }
          } else if (leader.characterId === 'magna_guard_elite') {
            if (unit.tags.includes('Droid') || unit.tags.includes('Separatist')) {
              unit.speed += 20;
              buffApplied = true;
            }
          } else if (leader.characterId === 'darth_vader') {
            if (unit.tags.includes('Empire') || unit.tags.includes('Sith')) {
              unit.offense *= 1.20;
              buffApplied = true;
            }
          } else if (leader.characterId === 'emperor_palpatine') {
            if (unit.tags.includes('Empire') || unit.tags.includes('Sith')) {
              unit.speed += 25;
              buffApplied = true;
            }
          } else if (leader.characterId === 'coordinator_appo' || leader.characterId === 'commander_appo') {
            if (unit.tags.includes('Knightfall')) {
              unit.speed += 25;
              unit.offense *= 1.25;
              buffApplied = true;
            }
          } else if (leader.characterId === 'kit_fisto') {
            if (unit.tags.includes('Jedi') || unit.tags.includes('Jedi Guardian')) {
              unit.speed += 15;
              buffApplied = true;
            }
          } else if (leader.characterId === 'stormtrooper_luke') {
            if (unit.tags.includes('Rebel')) {
              unit.speed += 15;
              buffApplied = true;
            }
          } else if (leader.characterId === 'luke_force_found') {
            if (unit.tags.includes('Rebel') || unit.tags.includes('Jedi')) {
              unit.speed += 20;
              buffApplied = true;
            }
          } else if (leader.characterId === 'din_djarin') {
            if (unit.tags.includes('Mandalorian')) {
              buffApplied = true;
            }
          } else if (leader.characterId === 'commander_wolffe') {
            if (unit.tags.includes('Wolfpack')) {
              unit.speed += 20;
              unit.maxProtection = Math.round(unit.maxProtection * 1.30);
              unit.protection = unit.maxProtection;
              buffApplied = true;
            }
          } else if (leader.characterId === 'commander_bacara') {
            if (unit.tags.includes('Galactic Marines') || checkHasTag(unit, 'Galactic Marines') || unit.tags.includes('Galactic Republic') || checkHasTag(unit, 'Galactic Republic')) {
              unit.maxHp = Math.round(unit.maxHp * 1.30);
              unit.hp = unit.maxHp;
              unit.speed += 20;
              unit.offense = Math.round(unit.offense * 1.25);
              if (unit.tags.includes('Galactic Marines') || checkHasTag(unit, 'Galactic Marines')) {
                applyStatus(state, unit, 'Overdisciplined', 99, false, leader);
              }
              buffApplied = true;
            }
          } else if (leader.characterId === 'ki_adi_mundi_journey') {
            if (unit.tags.includes('Galactic Marines') || checkHasTag(unit, 'Galactic Marines')) {
              unit.maxHp = Math.round(unit.maxHp * 1.50);
              unit.hp = unit.maxHp;
              unit.speed += 25;
              unit.offense = Math.round(unit.offense * 1.30);
              applyStatus(state, unit, 'Overdisciplined', 99, false, leader);
              buffApplied = true;
            }
          } else if (leader.characterId === 'chief_chirpa') {
            if (checkHasTag(unit, 'Ewok') || unit.tags.includes('Ewok')) {
              unit.speed += 25;
              unit.maxHp = Math.round(unit.maxHp * 1.20);
              unit.hp = unit.maxHp;
              buffApplied = true;
            }
          } else if (leader.characterId === 'plo_koon_journey') {
            if (unit.tags.includes('Wolfpack')) {
              unit.maxHp = Math.round(unit.maxHp * 1.30);
              unit.hp = unit.maxHp;
              unit.speed += 25;
              unit.tenacity += 0.20;
              buffApplied = true;
            }
          } else if (leader.characterId === 'mace_windu') {
            if (unit.tags.includes('Jedi Guardian') || checkHasTag(unit, 'Jedi Guardian')) {
              unit.speed += 30;
              unit.maxHp = Math.round(unit.maxHp * 1.30);
              unit.hp = unit.maxHp;
              unit.offense = Math.round(unit.offense * 1.25);
              buffApplied = true;
            }
          } else if (leader.characterId === 'depa_billaba') {
            if (unit.tags.includes('Jedi Guardian') || checkHasTag(unit, 'Jedi Guardian')) {
              unit.speed += 20;
              unit.maxHp = Math.round(unit.maxHp * 1.20);
              unit.hp = unit.maxHp;
              buffApplied = true;
            }
          } else if (leader.characterId === 'adi_gallia') {
            if (unit.tags.includes('High Council') || unit.tags.includes('Jedi High Council') || checkHasTag(unit, 'Jedi High Council')) {
              unit.speed += 25;
              unit.maxHp = Math.round(unit.maxHp * 1.20);
              unit.hp = unit.maxHp;
              buffApplied = true;
            }
          } else if (leader.characterId === 'ima_gun_di') {
             if (unit.tags.includes('Clone Trooper') || checkHasTag(unit, 'Clone Trooper')) {
                unit.maxHp = Math.round(unit.maxHp * 1.20);
                unit.hp = unit.maxHp;
                unit.defense = Math.round(unit.defense * 1.20);
                buffApplied = true;
             }
          } else if (leader.characterId === 'gl_darth_sidious') {
            if (unit.tags.includes('Emperors Hand') || unit.tags.includes("Emperor's Hand")) {
              unit.speed += 30;
              unit.offense = Math.round(unit.offense * 1.30);
              unit.potency += 0.25;
              buffApplied = true;
            }
          } else if (leader.characterId === 'grand_moff_tarkin') {
            if (unit.tags.includes('Galactic Empire') || unit.tags.includes('Empire')) {
              unit.speed += 25;
              unit.potency += 0.20;
              unit.critDamage += 0.20;
              buffApplied = true;
            }
          } else if (leader.characterId === 'biggs') {
            if (unit.tags.includes('Red Squadron') || checkHasTag(unit, 'Red Squadron')) {
              unit.speed += 25;
              unit.maxHp = Math.round(unit.maxHp * 1.20);
              unit.hp = unit.maxHp;
              buffApplied = true;
            }
          } else if (leader.characterId === 'director_krennic') {
            if (unit.tags.includes('ISB') || checkHasTag(unit, 'ISB')) {
              unit.speed += 30;
              unit.potency = (unit.potency || 0) + 0.25;
              buffApplied = true;
            }
          } else if (leader.characterId === 'partagaz') {
            if (unit.tags.includes('ISB') || checkHasTag(unit, 'ISB')) {
              unit.speed += 35;
              unit.potency = (unit.potency || 0) + 0.25;
              buffApplied = true;
            }
          }
          
          if (buffApplied) {
            logBattleEvent(state, `🛡️ Leader stat bonus calibrated for ${unit.name}.`, 'info');
          }
        });
      }
    }
    
    // 2. Unique Passive Ability application (triggered at Battle Start)
    squad.forEach(unit => {
      const uniques = unit.abilities.filter(a => a.type === 'unique');
      uniques.forEach(un => {
        logBattleEvent(state, `⚡ PASSIVE READY: [${unit.name}] - "${un.name}" loaded.`, 'info');
        
        // Custom Battle-Start Unique triggers:
        if (unit.characterId === 'thrawn_remnant') {
          squad.forEach(u => {
            if (u.tags.some(tag => tag.includes('Imperial Remnant'))) {
              applyStatus(state, u, 'Whiteout', 2, false, unit);
            }
          });
        } else if (unit.characterId === 'leia_gl') {
          squad.forEach(u => {
            if (u.tags.some(tag => tag.includes('Rebel'))) {
              applyStatus(state, u, 'Inspired', 2, false, unit);
            }
          });
        } else if (unit.characterId === 'hunter') {
          applyStatus(state, unit, 'Advantage', 2, false, unit);
        } else if (unit.characterId === 'quinlan_vos') {
          applyStatus(state, unit, 'Stealth', 2, false, unit);
        } else if (unit.characterId === 'barriss_offee') {
          applyStatus(state, unit, 'Stealth', 2, false, unit);
        } else if (unit.characterId === 'ima_gun_di') {
          applyStatus(state, unit, 'Taunt', 999, false, unit);
        } else if (unit.characterId === 'ki_adi_mundi_journey') {
          unit.speed += 30;
          unit.maxHp = Math.round(unit.maxHp * 1.30);
          unit.hp = unit.maxHp;
        } else if (unit.characterId === 'lord_vader') {
          applyStatus(state, unit, 'Taunt', 1, false, unit);
          squad.forEach(u => {
            if (u.tags.some(tag => tag.includes('Knightfall'))) {
              applyStatus(state, u, 'Dramatic Entrance', 1, false, unit);
            }
          });
        } else if (unit.characterId === 'smuggler_chewbacca') {
          const hasHan = squad.some(u => u.characterId.includes('han'));
          if (hasHan) {
            applyStatus(state, unit, 'Retribution', 2, false, unit);
          }
        } else if (unit.characterId === 'luke_force_found') {
          const hasBen = squad.some(u => u.characterId === 'old_ben');
          if (hasBen) {
            applyStatus(state, unit, 'Foresight', 2, false, unit);
          }
        } else if (unit.characterId === 'jabba') {
          if (oppSquad.length > 0) {
            const opps = [...oppSquad].sort((a, b) => b.offense - a.offense);
            applyStatus(state, opps[0], 'Intimidated', 2, true, unit);
          }
        } else if (unit.characterId === 'jocasta_nu') {
          if (oppSquad.length > 0) {
            const opps = [...oppSquad].sort((a, b) => b.offense - a.offense || b.hp - a.hp);
            applyStatus(state, opps[0], 'Investigation', 2, true, unit);
            logBattleEvent(state, `📚 Keeper of the Archives: Jocasta Nu scans the battlefield and targets ${opps[0].name} for Investigation!`, 'info');
          }
        } else if (unit.characterId === 'grand_inquisitor') {
          oppSquad.forEach(u => {
            if (u.tags.includes('Jedi')) {
              applyStatus(state, u, 'Purge', 3, true, unit);
            }
          });
        } else if (unit.characterId === 'bib_fortuna') {
          if (oppSquad.length > 0) {
            const opps = [...oppSquad].sort((a, b) => b.offense - a.offense);
            applyStatus(state, opps[0], 'Bribed', 1, true, unit);
          }
        } else if (unit.characterId === 'din_djarin') {
          squad.forEach(u => {
            if (u.tags.includes('Mandalorian')) {
              applyStatus(state, u, 'Defense Up', 3, false, unit);
            }
          });
        } else if (unit.characterId === 'gideon') {
          applyStatus(state, unit, 'Taunt', 99, false, unit);
        } else if (unit.characterId === 'ahsoka_clone_wars') {
          const gas = squad.some(u => u.characterId === 'general_skywalker');
          if (gas) {
            unit.speed += 20;
            logBattleEvent(state, `⚡ Snips Unique: Ahsoka gains +20 Speed because General Skywalker is active!`, 'info');
          }
        } else if (unit.characterId === 'plo_koon_journey') {
          squad.forEach(u => {
            if (u.tags.includes('Wolfpack')) {
              applyStatus(state, u, 'Defense Up', 2, false, unit);
            }
          });
        } else if (unit.characterId === 'master_kenobi') {
          applyStatus(state, unit, 'Council Guidance', 99, false, unit);
        } else if (unit.characterId === 'coleman_kcaj') {
          applyStatus(state, unit, 'Council Guidance', 99, false, unit);
        } else if (unit.characterId === 'gl_darth_sidious') {
          if (oppSquad.length > 0) {
            const oppLeader = oppSquad.find(u => u.position === 0) || oppSquad[0];
            if (oppLeader) {
              applyStatus(state, oppLeader, 'Imperial Decree', 99, true, unit);
              logBattleEvent(state, `👑 Decree: Darth Sidious issues Imperial Decree on the enemy Leader, ${oppLeader.name}!`, 'debuff');
            }
          }
        } else if (unit.characterId === 'grand_moff_tarkin') {
          unit.defense = Math.round(unit.defense * 1.30);
          unit.potency += 0.30;
          logBattleEvent(state, `📈 Architect of Order: Grand Moff Tarkin gains +30% Defense and +30% Potency.`, 'buff');
          if (oppSquad.length > 0) {
            const oppLeader = oppSquad.find(u => u.position === 0) || oppSquad[0];
            if (oppLeader) {
              applyStatus(state, oppLeader, 'Imperial Decree', 99, true, unit);
              logBattleEvent(state, `👑 Decree: Grand Moff Tarkin issues Imperial Decree on the enemy Leader, ${oppLeader.name}!`, 'debuff');
            }
          }
        } else if (unit.characterId === 'director_krennic') {
          if (oppSquad.length > 0) {
            const oppLeader = oppSquad.find(u => u.position === 0) || oppSquad[0];
            if (oppLeader) {
              applyStatus(state, oppLeader, 'Dossier', 99, true, unit, 2);
              logBattleEvent(state, `📁 Director Of Internal Security: The enemy Leader, ${oppLeader.name}, has been flagged with 2 stacks of Dossier!`, 'debuff');
            }
          }
          triggerSummon(state, unit, 'death_trooper_reinforcement');
        } else if (unit.characterId === 'dedra_meero') {
          applyStatus(state, unit, 'Stealth', 1, false, unit);
        }
      });
    });

    // 501st Battle-Start Leader Pathfinder and Momentum setups
    const lead = squad.find(u => u.position === 0);
    if (lead && (lead.characterId === 'captain_rex' || lead.characterId === 'general_skywalker')) {
       applyStatus(state, lead, 'Pathfinder', 99, false);
       squad.forEach(u => {
          if (u.id !== lead.id && checkHasTag(u, '501st')) {
             applyStatus(state, u, 'Momentum', 99, false, null, 1);
          }
       });
    }
  });
}

// GL Ultimate Pasive Triggers
export function triggerLeiaUltimateCharge(state: CombatState, allyTakingDamage: CombatUnit) {
   const team = allyTakingDamage.team === 'player' ? state.playerTeam : state.enemyTeam;
   const glLeia = team.find(u => u.characterId === 'gl_leia' && u.activeInBattle && u.hp > 0);
   if (glLeia && glLeia.ultimateCharge !== undefined) {
      glLeia.ultimateCharge = Math.min(100, glLeia.ultimateCharge + 5);
   }
}

export function triggerJabbaUltimateCharge(state: CombatState, recoveringAlly: CombatUnit) {
   const team = recoveringAlly.team === 'player' ? state.playerTeam : state.enemyTeam;
   const jabba = team.find(u => u.characterId === 'jabba' && u.activeInBattle && u.hp > 0);
   if (jabba && jabba.ultimateCharge !== undefined) {
      jabba.ultimateCharge = Math.min(100, jabba.ultimateCharge + 2);
   }
}

export function triggerVaderUltimateCharge(state: CombatState, vaderTeamUnit: CombatUnit, amount: number) {
   const team = vaderTeamUnit.team === 'player' ? state.playerTeam : state.enemyTeam;
   const vader = team.find(u => u.characterId === 'lord_vader' && u.activeInBattle && u.hp > 0);
   if (vader && vader.ultimateCharge !== undefined) {
      vader.ultimateCharge = Math.min(100, vader.ultimateCharge + amount);
   }
}

export function triggerTarkinUltimateCharge(state: CombatState, unitOnTarkinSide: CombatUnit, amount: number) {
   const team = unitOnTarkinSide.team === 'player' ? state.playerTeam : state.enemyTeam;
   const tarkin = team.find(u => u.characterId === 'gl_tarkin' && u.activeInBattle && u.hp > 0);
   if (tarkin && tarkin.ultimateCharge !== undefined) {
      tarkin.ultimateCharge = Math.min(100, tarkin.ultimateCharge + amount);
      logBattleEvent(state, `🧐 Strategic Blueprint: Tarkin gains ${amount}% Ultimate Charge (${tarkin.ultimateCharge}%)!`, 'ultimate');
   }
}

export function onLockdownGained(state: CombatState, target: CombatUnit, attacker: CombatUnit | null) {
  const oppSquad = target.team === 'player' ? state.enemyTeam : state.playerTeam;

  // Fox leader: Whenever Coruscant Guard allies inflict Lockdown: Recover 3% Protection.
  if (attacker && checkHasTag(attacker, 'Coruscant Guard')) {
     const leader = oppSquad.find(u => u.position === 0 && u.characterId === 'commander_fox_riot' && u.activeInBattle && u.hp > 0);
     if (leader) {
        logBattleEvent(state, `👑 Leader Passive: Fox's Martial Law triggers! Coruscant Guard allies recover 3% Protection.`, 'heal');
        oppSquad.forEach(member => {
           if (checkHasTag(member, 'Coruscant Guard') && member.activeInBattle && member.hp > 0 && !hasStatusFlag(member, 'prevent_prot_recovery')) {
              const prot = Math.round(member.maxProtection * 0.03);
              member.protection = Math.min(member.maxProtection, member.protection + prot);
           }
        });
     }
  }

  // Fox gains 5% Turn Meter (unique)
  const fox = oppSquad.find(u => u.characterId === 'commander_fox_riot' && u.activeInBattle && u.hp > 0);
  if (fox && !hasStatusFlag(fox, 'prevent_tm_gain')) {
     fox.turnMeter = Math.min(100, fox.turnMeter + 5);
     logBattleEvent(state, `🦊 Riot Commander: Fox gains 5% Turn Meter from enemy Lockdown!`, 'buff');
  }

  // Thorn gains 5% Offense (stacking) (unique)
  const thorn = oppSquad.find(u => u.characterId === 'commander_thorn' && u.activeInBattle && u.hp > 0);
  if (thorn) {
     thorn.offense = Math.round(thorn.offense * 1.05);
     logBattleEvent(state, `⚡ We Stand Here: Thorn gains 5% Offense from enemy Lockdown (stacking)!`, 'buff');
  }

  // Riot Guard gains 5% Turn Meter (unique)
  const riotGuard = oppSquad.find(u => u.characterId === 'riot_guard' && u.activeInBattle && u.hp > 0);
  if (riotGuard && !hasStatusFlag(riotGuard, 'prevent_tm_gain')) {
     riotGuard.turnMeter = Math.min(100, riotGuard.turnMeter + 5);
     logBattleEvent(state, `🛡️ Shield Wall: Riot Guard gains 5% Turn Meter from enemy Lockdown!`, 'buff');
  }

  // Palpatine gains 5% Turn Meter (unique)
  const palp = oppSquad.find(u => u.characterId === 'chancellor_palpatine_journey' && u.activeInBattle && u.hp > 0);
  if (palp && !hasStatusFlag(palp, 'prevent_tm_gain')) {
     palp.turnMeter = Math.min(100, palp.turnMeter + 5);
     logBattleEvent(state, `🏛️ Supreme Chancellor: Palpatine gains 5% Turn Meter from enemy Lockdown!`, 'buff');
  }

  // War Architect Tarkin gains 5% Turn Meter and 5% Ultimate Charge
  const tarkin = oppSquad.find(u => u.characterId === 'gl_tarkin' && u.activeInBattle && u.hp > 0);
  if (tarkin) {
     if (!hasStatusFlag(tarkin, 'prevent_tm_gain')) {
        tarkin.turnMeter = Math.min(100, tarkin.turnMeter + 5);
        logBattleEvent(state, `🧐 Blueprint of Order: Tarkin gains 5% Turn Meter from enemy Lockdown!`, 'buff');
     }
     triggerTarkinUltimateCharge(state, tarkin, 5);
     
     // Global Passive (Tarkin Unique): Whenever an enemy gains Lockdown, they lose 5% Max Health.
     const hpLoss = Math.round(target.maxHp * 0.05);
     target.hp = Math.max(1, target.hp - hpLoss);
     logBattleEvent(state, `🧐 Blueprint of Order: ${target.name} suffers 5% Max Health loss from entering Lockdown!`, 'damage');
  }
}

export function onLockdownRemoved(state: CombatState, unit: CombatUnit) {
  const oppSquad = unit.team === 'player' ? state.enemyTeam : state.playerTeam;

  // Fox gains Taunt (1 turn) on opposing team if unit is an enemy
  const fox = oppSquad.find(u => u.characterId === 'commander_fox_riot' && u.activeInBattle && u.hp > 0);
  if (fox) {
     logBattleEvent(state, `🦊 Security Alert: Lockdown removed on ${unit.name}! Fox gains Taunt!`, 'buff');
     applyStatus(state, fox, 'Taunt', 1, false);
  }

  // CUPD gains 10% Turn Meter
  const cupd = oppSquad.find(u => u.characterId === 'underworld_police' && u.activeInBattle && u.hp > 0);
  if (cupd && !hasStatusFlag(cupd, 'prevent_tm_gain')) {
     cupd.turnMeter = Math.min(100, cupd.turnMeter + 10);
     logBattleEvent(state, `👁️ Surveillance Radar: CUPD gains 10% Turn Meter from Lockdown expiration!`, 'buff');
  }

  // War Architect Tarkin: "Whenever an enemy loses Lockdown, reapply Lockdown for 1 turn (Can only trigger once per enemy every 3 turns)."
  const tarkin = oppSquad.find(u => u.characterId === 'gl_tarkin' && u.activeInBattle && u.hp > 0);
  if (tarkin && unit.activeInBattle && unit.hp > 0) {
     if (!unit.dynamicState) unit.dynamicState = {};
     const lastReapplyTurn = unit.dynamicState.lastTarkinLockdownTurn || 0;
     const currentTurnCount = state.turnCount || 0;
     if (!lastReapplyTurn || currentTurnCount - lastReapplyTurn >= 3) {
        unit.dynamicState.lastTarkinLockdownTurn = currentTurnCount;
        logBattleEvent(state, `🧐 Blueprint of Order: War Architect Tarkin reapplies Lockdown on ${unit.name}!`, 'debuff');
        applyStatus(state, unit, 'Lockdown', 1, true, tarkin);
     }
  }
}

export function onRiotControlGained(state: CombatState, target: CombatUnit, attacker: CombatUnit | null) {
  const team = target.team === 'player' ? state.playerTeam : state.enemyTeam;

  // Riot Guard unique: Whenever allies gain Riot Control, recover 5% Protection.
  const riotGuard = team.find(u => u.characterId === 'riot_guard' && u.activeInBattle && u.hp > 0);
  if (riotGuard && !hasStatusFlag(riotGuard, 'prevent_prot_recovery')) {
     riotGuard.protection = Math.min(riotGuard.maxProtection, riotGuard.protection + Math.round(riotGuard.maxProtection * 0.05));
     logBattleEvent(state, `🛡️ Shield Wall: Riot Guard recovers 5% Protection from ally Riot Control!`, 'buff');
  }

  // Coruscant Trooper unique: Whenever Coruscant Guard allies gain Riot Control, gain 5% Turn Meter.
  const ct = team.find(u => u.characterId === 'coruscant_trooper' && u.activeInBattle && u.hp > 0);
  if (ct && checkHasTag(target, 'Coruscant Guard') && !hasStatusFlag(ct, 'prevent_tm_gain')) {
     ct.turnMeter = Math.min(100, ct.turnMeter + 5);
     logBattleEvent(state, `⚡ Front Line Officer: Coruscant Trooper gains 5% Turn Meter!`, 'buff');
  }

  // Palpatine leader: Whenever allies gain Riot Control, gain 2% Turn Meter.
  const leader_palp = team.find(u => u.position === 0 && u.characterId === 'chancellor_palpatine_journey' && u.activeInBattle && u.hp > 0);
  if (leader_palp) {
     logBattleEvent(state, `👑 Leader: Palpatine's Supreme Chancellor triggers! Team gains 2% Turn Meter!`, 'buff');
     team.forEach(member => {
        if (member.activeInBattle && member.hp > 0 && !hasStatusFlag(member, 'prevent_tm_gain')) {
           member.turnMeter = Math.min(100, member.turnMeter + 2);
        }
     });
  }

  // Tarkin ultimate generation
  triggerTarkinUltimateCharge(state, target, 2);
}

export function onMarkedGained(state: CombatState, target: CombatUnit, attacker: CombatUnit | null) {
  const oppSquad = target.team === 'player' ? state.enemyTeam : state.playerTeam;

  // Boost unique: Adaptive Tactics: "Whenever an enemy gains Marked: Gain 5% Turn Meter (Boost gains)."
  const boost = oppSquad.find(u => u.characterId === 'wp_boost' && u.activeInBattle && u.hp > 0);
  if (boost && !hasStatusFlag(boost, 'prevent_tm_gain')) {
     boost.turnMeter = Math.min(100, boost.turnMeter + 5);
     logBattleEvent(state, `🚀 Adaptive Tactics: Boost gains 5% Turn Meter from enemy Marked!`, 'buff');
  }
}

export function onAmbushedGained(state: CombatState, target: CombatUnit, attacker: CombatUnit | null) {
  const oppSquad = target.team === 'player' ? state.enemyTeam : state.playerTeam;

  // Boost unique: "Whenever an enemy gains Ambushed: Gain Offense Up (2 turns) (Boost gains)."
  const boost = oppSquad.find(u => u.characterId === 'wp_boost' && u.activeInBattle && u.hp > 0);
  if (boost) {
     logBattleEvent(state, `🚀 Adaptive Tactics: Boost gains Offense Up from enemy Ambushed!`, 'buff');
     applyStatus(state, boost, 'Offense Up', 2, false, boost);
  }

  // Plo Koon leader: "Whenever an enemy gains Ambushed: Wolfpack allies recover 5% Protection."
  const leaderDef = oppSquad.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
  if (leaderDef && leaderDef.characterId === 'plo_koon_journey') {
     logBattleEvent(state, `👑 Leader Passive: Plo Koon's The Wolf General triggers! Wolfpack allies recover 5% Protection.`, 'heal');
     oppSquad.forEach(member => {
        if (checkHasTag(member, 'Wolfpack') && member.activeInBattle && member.hp > 0 && !hasStatusFlag(member, 'prevent_prot_recovery')) {
           const prot = Math.round(member.maxProtection * 0.05);
           member.protection = Math.min(member.maxProtection, member.protection + prot);
        }
     });
  }

  // Plo Koon unique: "Whenever an enemy gains Ambushed: Plo Koon assists dealing 50% reduced damage."
  const plo = oppSquad.find(u => u.characterId === 'plo_koon_journey' && u.activeInBattle && u.hp > 0);
  if (plo && (!attacker || attacker.id !== plo.id)) {
     logBattleEvent(state, `⚔️ Compassion And Resolve: Plo Koon assists against Ambushed enemy ${target.name}!`, 'info');
     const basic = plo.abilities.find(a => a.type === 'basic') || plo.abilities[0];
     // We execute his basic out-of-turn with 50% reduced damage (handled by assistDepth > 0)
     executeCombatAction(state, plo.id, basic, target.id, undefined, 1, 0);
  }
}

