import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const SEPARATIST_DROID_CHARACTERS: Character[] = [
  createCharacter(
    'general_grievous_journey',
    'General Grievous',
    'Leader / Attacker / Journey Character',
    ['Separatist', 'Droid', 'Journey Character'],
    'Supreme Commander of the Droid Army who leads endless legions and collects trophies from his victims.',
    [
      makeAbility('gg_basic', 'Four Lightsabers', 'basic', 0, 'Deal Physical Damage. Attack again for each stack of Collector (maximum 2 additional attacks).', ['damage', 'bonus_attack'], ['offensive']),
      makeAbility('gg_special_1', 'Crushing Advance', 'special', 3, 'Deal Physical Damage to all enemies. All allied Separatist Droids gain: 1 stack of Endless Legion.', ['damage_aoe', 'Endless Legion'], ['offensive', 'buff']),
      makeAbility('gg_special_2', 'Jedi Hunter', 'special', 4, 'Deal massive Physical Damage. If target is defeated: Gain Collector. All allied Separatist Droids gain: 1 stack of Endless Legion.', ['damage_heavy', 'Collector', 'Endless Legion'], ['offensive']),
      makeAbility('gg_leader', 'Supreme Commander Of The Droid Army', 'leader', 0, 'Separatist Droid allies gain: 30% Offense, 30% Max Health. At the start of battle: All allied Separatist Droids gain: 2 stacks of Endless Legion. Whenever an allied Separatist Droid consumes Endless Legion: General Grievous gains 5% Turn Meter.', ['buff_faction'], []),
      makeAbility('gg_unique', 'Collector Of Trophies', 'unique', 0, 'Whenever an enemy is defeated: Gain Collector. Whenever General Grievous gains Collector: Recover 10% Health. Whenever an allied Separatist Droid is defeated: All allied Separatist Droids gain 1 stack of Endless Legion.', ['Collector', 'heal_passive', 'Endless Legion'], [])
    ],
    'Separatist Droid',
    14000,
    'Endless legions and heavy multi-attacks',
    { speed: 135, hp: 65000, protection: 40000, offense: 4500 }
  ),
  createCharacter(
    'immortal_admiral_trench',
    'Immortal Admiral Trench',
    'Leader / Strategist / Support / Galactic Legend',
    ['Separatist', 'Galactic Legend', 'Journey Character'],
    'Galactic Legend strategist utilizing Endless Legions as a calculated sacrificial resource.',
    [
      makeAbility('trench_gl_basic', 'Shocking Nick', 'basic', 0, 'Deal Special Damage. Inflict Shock (2 turns). If Impending Doom is active: Deal 10% additional damage per stack.', ['damage', 'Shock', 'bonus_damage'], ['offensive']),
      makeAbility('trench_gl_special_1', 'Acceptable Losses', 'special', 3, 'Consume 1 stack of Endless Legion from all allied Separatist Droids. All allies recover 20% Health and gain 10% Turn Meter. For each stack consumed: Admiral Trench gains 1 stack of Tactical Advantage. If Impending Doom has 2 or more stacks: Inflict Fear on all enemies.', ['heal_aoe', 'turn_meter_gain_aoe', 'Fear'], ['heal', 'buff', 'debuff']),
      makeAbility('trench_gl_special_2', 'Calculated Sacrifice', 'special', 4, 'Target allied Separatist Droid loses all Endless Legion. For each stack removed: Deal true damage to all enemies. If Impending Doom has 1 stack: Inflict Healing Immunity. If Impending Doom has 2 stacks: Inflict Buff Immunity. If Impending Doom has 3 stacks: Inflict Fear.', ['damage_true_aoe', 'Healing Immunity', 'Buff Immunity', 'Fear'], ['offensive']),
      makeAbility('trench_gl_leader', 'The Last Calculation', 'leader', 0, 'Separatist Droid allies gain: 40 Speed, 30% Potency. At the start of battle: All allied Separatist Droids gain: 3 stacks of Endless Legion. Whenever an allied Separatist Droid consumes Endless Legion: Recover 5% Health. Whenever an allied Separatist Droid is defeated: Gain 1 stack of Impending Doom.', ['buff_faction'], []),
      makeAbility('trench_gl_unique', 'The Elusive Admiral', 'unique', 0, 'At the start of battle: Gain Elusive. Whenever an allied Separatist Droid is defeated: Gain 10% Turn Meter. Whenever Impending Doom increases: Gain 5% Offense.', ['Elusive', 'turn_meter_gain_passive', 'offense_passive'], []),
      makeAbility('trench_gl_ultimate', 'Inevitable Conclusion', 'ultimate', 0, '100% Charge. Consume all Endless Legion from allied Separatist Droids. Deal massive true damage to all enemies. For each stack of Endless Legion consumed: Deal additional damage. If Admiral Trench has 1 stack of Impending Doom: Gain Offense Up. 2 stacks: Reduce all enemy cooldowns by 1. 3 stacks: Defeat the weakest enemy.', ['damage_true_aoe', 'Offense Up', 'cooldown_decrease_enemy', 'defeat_enemy'], [])
    ],
    'Separatist',
    25000,
    'Sacrificial strategies and true mastery',
    { speed: 155, hp: 85000, protection: 50000, offense: 6000 }
  ),
  createCharacter(
    'b1_battle_droid',
    'B1 Battle Droid',
    'Support',
    ['Separatist', 'Droid'],
    'Fragile but infinite droid producing Endless Legion for Separatist Droids.',
    [
      makeAbility('b1_basic', 'E-5 Blaster Rifle', 'basic', 0, 'Deal Physical Damage. Gain 1 stack of Endless Legion.', ['damage', 'Endless Legion'], ['offensive']),
      makeAbility('b1_special_1', 'Call Reinforcements', 'special', 3, 'Target allied Separatist Droid gains: 1 stack of Endless Legion. Recover 20% Health.', ['Endless Legion', 'heal'], ['buff', 'heal']),
      makeAbility('b1_special_2', 'Endless Numbers', 'special', 4, 'All allied Separatist Droids gain: 1 stack of Endless Legion.', ['Endless Legion'], ['buff']),
      makeAbility('b1_unique', 'B1 Production Line', 'unique', 0, 'Start Battle with 5 Stacks of Endless Legion. Whenever an allied Separatist Droid consumes Endless Legion: B1 Battle Droid gains 10% Turn Meter. At the start of B1 Battle Droid\'s turn: The weakest allied Separatist Droid gains 1 stack of Endless Legion.', ['turn_meter_gain_passive', 'Endless Legion'], [])
    ],
    'Separatist Droid',
    7500,
    'Swarm production and endless recursion',
    { speed: 145, hp: 1000, protection: 1000 } // Tiny HP, relies on Endless Legion
  ),
  createCharacter(
    'b2_super_battle_droid',
    'B2 Super Battle Droid',
    'Tank / Support',
    ['Separatist', 'Droid'],
    'Heavy hitter that consumes Endless Legion for massive area suppression.',
    [
      makeAbility('b2_basic', 'Wrist Blasters', 'basic', 0, 'Deal Physical Damage. Inflict Offense Down (1 turn).', ['damage', 'Offense Down'], ['offensive']),
      makeAbility('b2_special_1', 'Suppressive Fire', 'special', 3, 'Deal Physical Damage to all enemies. If B2 has Endless Legion: Consume 1 stack. Inflict Offense Down (2 turns).', ['damage_aoe', 'Offense Down'], ['offensive']),
      makeAbility('b2_special_2', 'Missile Volley', 'special', 4, 'Deal Physical Damage to all enemies. If B2 has Endless Legion: Consume all Endless Legion. Deal 15% additional damage for each stack consumed.', ['damage_aoe', 'bonus_damage'], ['offensive']),
      makeAbility('b2_unique', 'Heavy Assault Chassis', 'unique', 0, 'Start Battle with 5 Stacks of Endless Legion. Whenever B2 Super Battle Droid consumes Endless Legion: Gain Defense Up (2 turns). Whenever an allied Separatist Droid gains Endless Legion: Recover 5% Health.', ['Defense Up', 'heal_passive'], [])
    ],
    'Separatist Droid',
    8500,
    'Heavy AoE barrages fueled by Endless Legion',
    { speed: 110, hp: 60000, protection: 40000 }
  ),
  createCharacter(
    'tactical_droid',
    'Tactical Droid',
    'Leader / Strategist / Support',
    ['Separatist', 'Droid'],
    'Cold and calculating commander enabling Endless Legion distributions.',
    [
      makeAbility('tactical_droid_basic', 'Analyze Weakness', 'basic', 0, 'Deal Special Damage. Target enemy gains Vulnerable.', ['damage', 'Vulnerable'], ['offensive']),
      makeAbility('tactical_droid_special_1', 'Redistribute Forces', 'special', 3, 'Move 1 stack of Endless Legion from target allied Separatist Droid to another allied Separatist Droid. Reduce both allies cooldowns by 1.', ['Endless Legion', 'cooldown_decrease'], ['buff']),
      makeAbility('tactical_droid_special_2', 'Battlefield Recalculation', 'special', 4, 'All allied Separatist Droids gain: 1 stack of Endless Legion. Gain 10% Turn Meter.', ['Endless Legion', 'turn_meter_gain_aoe'], ['buff']),
      makeAbility('tactical_droid_leader', 'Probability Of Victory', 'leader', 0, 'Separatist Droid allies gain: 25 Speed, 20% Potency. Whenever an allied Separatist Droid gains Endless Legion: Recover 3% Health.', ['buff_faction'], []),
      makeAbility('tactical_droid_unique', 'Strategic Processor', 'unique', 0, 'Whenever an allied Separatist Droid consumes Endless Legion: Tactical Droid gains 5% Turn Meter. Whenever an allied Separatist Droid is defeated: All remaining allies gain 1 stack of Endless Legion.', ['turn_meter_gain_passive', 'Endless Legion'], [])
    ],
    'Separatist Droid',
    8300,
    'Cooldown reduction and Legion distribution',
    { speed: 125, hp: 45000, protection: 35000 }
  ),
  createCharacter(
    'magnaguard',
    'MagnaGuard',
    'Tank',
    ['Separatist', 'Droid'],
    'Relentless sentinel providing cover for commanders of the Droid Army.',
    [
      makeAbility('magnaguard_basic', 'Electrostaff Assault', 'basic', 0, 'Deal Physical Damage. Gain 1 stack of Endless Legion.', ['damage', 'Endless Legion'], ['offensive']),
      makeAbility('magnaguard_special_1', 'Guardian Protocol', 'special', 3, 'Gain Taunt (2 turns), Defense Up (2 turns), Recover 20% Health.', ['Taunt', 'Defense Up', 'heal'], ['defensive']),
      makeAbility('magnaguard_special_2', 'Protect The General', 'special', 4, 'Target allied Separatist Droid gains 1 stack of Endless Legion. MagnaGuard gains Taunt (2 turns). If General Grievous is active: Assist.', ['Endless Legion', 'Taunt', 'assist'], ['defensive']),
      makeAbility('magnaguard_unique', 'Relentless Sentinel', 'unique', 0, 'At the start of battle: Gain 2 stacks of Endless Legion. Whenever MagnaGuard consumes Endless Legion: Recover 25% Health. Whenever General Grievous takes damage: Gain Taunt (1 turn). Whenever MagnaGuard is defeated: Consume 1 stack of Endless Legion instead.', ['Endless Legion', 'heal_passive', 'Taunt'], [])
    ],
    'Separatist Droid',
    8800,
    'Bulky Taunting machine',
    { speed: 115, hp: 65000, protection: 45000 }
  ),
  createCharacter(
    'crab_droid',
    'Crab Droid',
    'Tank / Attacker',
    ['Separatist', 'Droid'],
    'Planetary assault platform with devastating siege bombardments.',
    [
      makeAbility('crab_droid_basic', 'Heavy Laser Cannon', 'basic', 0, 'Deal Physical Damage. Gain 1 stack of Endless Legion.', ['damage', 'Endless Legion'], ['offensive']),
      makeAbility('crab_droid_special_1', 'Walking Artillery', 'special', 3, 'Deal Physical Damage to all enemies. If Crab Droid has Endless Legion: Consume 1 stack. Inflict Defense Down (2 turns).', ['damage_aoe', 'Defense Down'], ['offensive']),
      makeAbility('crab_droid_special_2', 'Siege Bombardment', 'special', 4, 'Deal massive Physical Damage to all enemies. Consume all Endless Legion. Deal 20% additional damage for each stack consumed.', ['damage_aoe', 'bonus_damage'], ['offensive']),
      makeAbility('crab_droid_unique', 'Planetary Assault Platform', 'unique', 0, 'At the start of battle: Gain 2 stacks of Endless Legion. Whenever Crab Droid consumes Endless Legion: Gain Offense Up (2 turns). Whenever an allied Separatist Droid gains Endless Legion: Recover 5% Health. Whenever Crab Droid is defeated: Consume 1 stack of Endless Legion instead.', ['Endless Legion', 'Offense Up', 'heal_passive'], [])
    ],
    'Separatist Droid',
    8600,
    'Heavy assault platform',
    { speed: 105, hp: 70000, protection: 50000 }
  )
];
