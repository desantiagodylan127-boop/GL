import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const PIRATE_CORSAIR_CHARACTERS: Character[] = [
  createCharacter(
    'captain_ithano',
    'Captain Ithano',
    'Leader / Attacker / Strategist',
    ['Pirate', 'Corsair'],
    'Crimson Corsair leader coordinating precision raids and managing Payouts.',
    [
      makeAbility('ithano_basic', 'Coordinated Raid', 'basic', 0, 'Attack target enemy. Inflict Expose (1 turn). If Ithano has Payout: Call random Corsair ally to Assist.', ['damage', 'Exposed', 'assist'], ['offensive']),
      makeAbility('ithano_special_1', 'Boarding Action', 'special', 3, 'Attack target enemy. Inflict Defense Down (2 turns). If target already had a debuff: Ithano gains 1 Raid Mark (Max 10).', ['damage', 'Defense Down', 'Raid Mark'], ['offensive']),
      makeAbility('ithano_special_2', 'Crimson Corsair Assault', 'special', 4, 'Attack all enemies. Inflict Expose (1 turn). Enemies with debuffs lose 10% Turn Meter.', ['damage_aoe', 'Exposed', 'turn_meter_reduction_aoe'], ['offensive']),
      makeAbility('ithano_leader', 'Professional Raiders', 'leader', 0, 'Corsair allies gain +25 Speed, +20% Potency. Whenever Corsair allies inflict debuffs: Recover 2% Protection. Whenever Corsair allies complete Payout: All Corsair allies gain 10% Turn Meter.', ['buff_faction'], []),
      makeAbility('ithano_unique', 'Corsair Captain', 'unique', 0, 'Payout Condition: Accumulate 10 Raid Marks. Reward: +40 Speed, +20% Critical Chance. Whenever Corsair allies inflict a debuff: All Corsair allies gain 3% Turn Meter.', ['Payout', 'speed_passive', 'turn_meter_gain_aoe_passive'], [])
    ],
    'Corsair',
    10000,
    'Expose and Raid Marks logic',
    { speed: 155, hp: 50000, protection: 45000, potency: 45 }
  ),
  createCharacter(
    'quiggold',
    'Quiggold',
    'Tank / Support',
    ['Pirate', 'Corsair'],
    'Veteran defensive Corsair protecting the crew during Payouts.',
    [
      makeAbility('quiggold_basic', 'Heavy Blaster', 'basic', 0, 'Attack target enemy. Inflict Target Lock.', ['damage', 'Target Lock'], ['offensive']),
      makeAbility('quiggold_special_1', 'Take Cover', 'special', 3, 'Gain Taunt and Defense Up (2 turns).', ['Taunt', 'Defense Up'], ['defensive']),
      makeAbility('quiggold_unique', 'Veteran Protector', 'unique', 0, 'Payout Condition: While Taunting, prevent 20 attacks from hitting allies. Reward: +60% Defense, Immune to Daze and Ability Block. Whenever Taunt expires, recover 15% Protection.', ['Payout', 'defense_passive', 'immunity', 'protection_recovery_passive'], [])
    ],
    'Corsair',
    9000,
    'Defensive Payout scaling tank',
    { speed: 110, hp: 65000, protection: 65000 }
  ),
  createCharacter(
    'reveth',
    'Reveth',
    'Support / Strategist',
    ['Pirate', 'Corsair'],
    'Navigator moving Turn Meter and empowering ally strikes.',
    [
      makeAbility('reveth_basic', 'Precise Course', 'basic', 0, 'Attack target enemy. Grant target ally 15% Turn Meter.', ['damage', 'turn_meter_gain'], ['offensive']),
      makeAbility('reveth_special_1', 'Flank Speed', 'special', 3, 'Target ally gains Bonus Turn.', ['bonus_turn'], ['buff']),
      makeAbility('reveth_unique', 'Master Navigator', 'unique', 0, 'Payout Condition: Grant 100% total Turn Meter to allies. Reward: +35 Speed. Whenever allies attack out of turn: Gain 5% Turn Meter. Whenever an ally gains Bonus Turn: Recover 5% Protection.', ['Payout', 'speed_passive', 'turn_meter_gain_passive', 'protection_recovery_passive'], [])
    ],
    'Corsair',
    8500,
    'Turn Meter manipulation',
    { speed: 145, hp: 45000, protection: 40000 }
  ),
  createCharacter(
    'navrokk',
    'Na\'vrokk "Squeaky"',
    'Saboteur / Attacker',
    ['Pirate', 'Corsair'],
    'Squeaky steals buffs and thrives off opportunism.',
    [
      makeAbility('navrokk_basic', 'Cheap Shot', 'basic', 0, 'Attack target enemy. Steal 1 random buff.', ['damage', 'steal_buff'], ['offensive']),
      makeAbility('navrokk_special_1', 'Exploit', 'special', 3, 'Attack target enemy. Deal double damage if they have Target Lock.', ['damage'], ['offensive']),
      makeAbility('navrokk_unique', 'Opportunist', 'unique', 0, 'Payout Condition: Steal 15 enemy buffs. Reward: Ignore Stealth and Foresight, Deal +35% bonus damage to debuffed enemies.', ['Payout', 'ignore_stealth', 'ignore_foresight', 'bonus_damage_passive'], [])
    ],
    'Corsair',
    8300,
    'Buff stealing',
    { speed: 135, hp: 42000, protection: 35000 }
  ),
  createCharacter(
    'pendewqell',
    'Pendewqell',
    'Attacker',
    ['Pirate', 'Corsair'],
    'Heavy gunner tearing through enemy lines for high damage Payout.',
    [
      makeAbility('pendewqell_basic', 'Suppressive Fire', 'basic', 0, 'Attack target enemy. Inflict Offense Down.', ['damage', 'Offense Down'], ['offensive']),
      makeAbility('pendewqell_special_1', 'Concentrated Barrage', 'special', 3, 'Attack target enemy three times.', ['damage_multi'], ['offensive']),
      makeAbility('pendewqell_unique', 'Heavy Gunner', 'unique', 0, 'Payout Condition: Defeat 2 enemies OR Deal 150% of Pendewqell\'s Max Health in damage. Reward: +40% Offense, Ignore 35% Defense. Whenever Pendewqell defeats an enemy: Gain Offense Up.', ['Payout', 'offense_passive', 'ignore_defense', 'Offense Up'], [])
    ],
    'Corsair',
    8800,
    'Heavy damage dealer',
    { speed: 125, hp: 45000, protection: 40000, offense: 4500 }
  ),
  createCharacter(
    'kix_conquest',
    'Kix',
    'Support / Strategist',
    ['Pirate', 'Corsair', 'Clone Trooper', '501st'],
    'Survivor and medic bridging Corsair and 501st synergies.',
    [
      makeAbility('kix_basic', 'Covering Fire', 'basic', 0, 'Attack target enemy. Target ally recovers 10% Health.', ['damage', 'heal'], ['offensive']),
      makeAbility('kix_special_1', 'Combat Medic', 'special', 3, 'Allies recover 30% Health and Protection.', ['heal_aoe', 'protection_recovery_aoe'], ['heal']),
      makeAbility('kix_unique_1', 'Survivor\'s Fortune', 'unique', 0, 'Payout Condition: Witness 3 Corsair allies complete Payout OR Restore 150% total Health/Protection. Reward: +25 Speed, +20% Max Health. Whenever a Corsair gains Payout: Recover 10% Health/Protection.', ['Payout', 'speed_passive', 'health_passive', 'heal_passive'], []),
      makeAbility('kix_unique_2', 'Last Medic Standing', 'unique', 0, 'If all allies are Corsairs: Corsairs gain +20% Max Health. If all allies are 501st: 501st gain +20% Max Health/Tenacity. Whenever ally falls below 50% Health: Recover 10% Health (once per turn).', ['buff_faction', 'heal_passive'], [])
    ],
    'Corsair',
    11000,
    'Medic and versatile support',
    { speed: 130, hp: 55000, protection: 45000 }
  )
];
