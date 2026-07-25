import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const SEPARATIST_ELITE_CHARACTERS: Character[] = [
  createCharacter(
    'kelhani',
    'Kelani',
    'Leader / Strategist / Support',
    ['Separatist', 'Droid', 'Separatist Elite'],
    'Elite strategic droid analyzing combat to grant Tactical Data to allies.',
    [
      makeAbility('kelhani_basic', 'Combat Assessment', 'basic', 0, 'Deal Special Damage. Gain 1 stack of Tactical Data.', ['damage', 'Tactical Data'], ['offensive']),
      makeAbility('kelhani_special_1', 'Adaptive Calculations', 'special', 3, 'Target Separatist Elite ally gains: 2 stacks of Tactical Data. If target already had Tactical Data: Reduce their cooldowns by 1.', ['Tactical Data', 'cooldown_decrease'], ['buff']),
      makeAbility('kelhani_special_2', 'Probability Matrix', 'special', 4, 'All Separatist Elite allies gain: 1 stack of Tactical Data. Recover 15% Protection.', ['Tactical Data', 'protection_recovery_aoe'], ['buff']),
      makeAbility('kelhani_leader', 'Battlefield Algorithm', 'leader', 0, 'Separatist Elite allies gain: +25 Speed, +20% Potency. Whenever a Separatist Elite ally consumes Tactical Data: Recover 5% Protection and Gain 5% Turn Meter.', ['buff_faction'], []),
      makeAbility('kelhani_unique', 'Superior Processing', 'unique', 0, 'Whenever a Separatist Elite ally gains Tactical Data: Kelani gains 5% Turn Meter. Whenever an ally reaches 3 stacks of Tactical Data: Reduce Kelani\'s cooldowns by 1. Whenever a Separatist Elite ally consumes Tactical Data: Kelani gains Offense Up (1 turn).', ['turn_meter_gain_passive', 'cooldown_decrease', 'Offense Up'], [])
    ],
    'Separatist Elite',
    8900,
    'Fast tactical processor providing critical combat resources',
    { speed: 138, hp: 45000, protection: 40000 }
  ),
  createCharacter(
    'grand_admiral_trench',
    'Admiral Trench',
    'Leader / Strategist / Support / Journey Character',
    ['Separatist', 'Separatist Elite', 'Journey Character'],
    'Cunning Admiral capable of manipulating Tactical Data to terrorize enemies.',
    [
      makeAbility('trench_basic', 'Calculated Response', 'basic', 0, 'Deal Special Damage. Inflict Shock (1 turn). Gain 1 stack of Tactical Data.', ['damage', 'Shock', 'Tactical Data'], ['offensive']),
      makeAbility('trench_special_1', 'Predictive Warfare', 'special', 3, 'All Separatist Elite allies gain: 1 stack of Tactical Data. All enemies lose 20% Turn Meter. If Admiral Trench has Tactical Data: Consume 1 stack. Inflict Fear on target enemy.', ['Tactical Data', 'turn_meter_reduction_aoe', 'Fear'], ['buff', 'debuff']),
      makeAbility('trench_special_2', 'Fear of Ignorance', 'special', 4, 'All Separatist Elite allies gain: 2 stacks of Tactical Data. All enemies gain Speed Down (2 turns) and Offense Down (2 turns). If Admiral Trench has 3 stacks of Tactical Data: Consume all Tactical Data. Reduce all allied cooldowns by 1.', ['Tactical Data', 'Speed Down', 'Offense Down', 'cooldown_decrease_aoe'], ['buff', 'debuff']),
      makeAbility('trench_leader', 'Master Tactician', 'leader', 0, 'Separatist Elite allies gain: +35 Speed, +25% Defense, +20% Max Protection. Whenever a Separatist Elite ally gains Tactical Data: Recover 3% Protection. Whenever a Separatist Elite ally consumes Tactical Data: Gain 5% Turn Meter.', ['buff_faction'], []),
      makeAbility('trench_unique_1', 'The Elusive Admiral', 'unique', 0, 'At the start of battle: Gain Elusive. At the start of Admiral Trench\'s turn: Inflict Fear on a random enemy for 1 turn. Whenever a Separatist Elite ally consumes Tactical Data: Admiral Trench gains 5% Turn Meter. Whenever an allied Separatist Elite unit is defeated: Gain 1 stack of Tactical Data.', ['Elusive', 'Fear', 'turn_meter_gain_passive', 'Tactical Data'], []),
      makeAbility('trench_unique_2', 'Every Outcome Calculated', 'unique', 0, 'Whenever a Separatist Elite ally consumes Tactical Data: Admiral Trench gains 2% Mastery (stacking). Whenever an enemy gains Fear: Recover 5% Protection. Whenever Admiral Trench reaches 3 stacks of Tactical Data: Reduce all allied cooldowns by 1. Admiral Trench cannot lose Elusive while another ally is active.', ['mastery_passive', 'protection_recovery_passive', 'cooldown_decrease_aoe'], [])
    ],
    'Separatist Elite',
    14500,
    'Ultimate battlefield manipulation through fear and calculations',
    { speed: 152, hp: 55000, protection: 65000, potency: 60 }
  ),
  createCharacter(
    'magna_guard_elite',
    'Elite MagnaGuard',
    'Tank / Support',
    ['Separatist', 'Droid', 'Separatist Elite'],
    'Upgraded MagnaGuard focusing heavily on defending Admiral Trench.',
    [
      makeAbility('elite_magna_basic', 'Electrostaff Sweep', 'basic', 0, 'Deal Physical Damage. Gain 1 stack of Tactical Data.', ['damage', 'Tactical Data'], ['offensive']),
      makeAbility('elite_magna_special_1', 'Defensive Formation', 'special', 3, 'Gain Taunt (2 turns) and Defense Up (2 turns). If Elite MagnaGuard has Tactical Data: Consume 1 stack. Recover 20% Protection.', ['Taunt', 'Defense Up', 'protection_recovery'], ['defensive']),
      makeAbility('elite_magna_special_2', 'Guardian Protocol', 'special', 4, 'Target ally gains Defense Up (2 turns) and 1 stack of Tactical Data. If target is Admiral Trench: Gain Taunt (2 turns).', ['Defense Up', 'Tactical Data', 'Taunt'], ['defensive', 'buff']),
      makeAbility('elite_magna_unique', 'Elite Bodyguard', 'unique', 0, 'Whenever Admiral Trench takes damage: Elite MagnaGuard gains Taunt (1 turn). Whenever Elite MagnaGuard consumes Tactical Data: Gain 10% Defense (stacking). Whenever Admiral Trench is active: Elite MagnaGuard gains 25% Max Protection.', ['Taunt', 'defense_passive', 'protection_passive'], [])
    ],
    'Separatist Elite',
    9200,
    'Impassable bodyguard for Trench',
    { speed: 110, hp: 60000, protection: 75000 }
  ),
  createCharacter(
    'bx_commando_droid',
    'BX Commando Droid',
    'Attacker / Saboteur',
    ['Separatist', 'Droid', 'Separatist Elite'],
    'Stealthy assassin droid utilizing Tactical Data for executing critical targets.',
    [
      makeAbility('bx_commando_basic', 'Vibrosword Strike', 'basic', 0, 'Deal Physical Damage. Gain 1 stack of Tactical Data.', ['damage', 'Tactical Data'], ['offensive']),
      makeAbility('bx_commando_special_1', 'Infiltration Protocol', 'special', 3, 'Gain Stealth (2 turns) and Critical Chance Up (2 turns). If BX Commando Droid has Tactical Data: Consume 1 stack. Gain Bonus Turn.', ['Stealth', 'Critical Chance Up', 'bonus_turn'], ['buff']),
      makeAbility('bx_commando_special_2', 'Precision Assassination', 'special', 4, 'Deal Physical Damage. Ignore Taunt. If BX Commando Droid has Tactical Data: Consume all Tactical Data. Deal 25% additional damage for each stack consumed. Inflict Healing Immunity for 2 turns.', ['damage', 'ignore_taunt', 'bonus_damage', 'Healing Immunity'], ['offensive']),
      makeAbility('bx_commando_unique', 'Advanced Commando Programming', 'unique', 0, 'Whenever BX Commando Droid gains Tactical Data: Gain 5% Turn Meter. Whenever BX Commando Droid consumes Tactical Data: Gain Offense Up (2 turns). Whenever an enemy is defeated: Gain 1 stack of Tactical Data.', ['turn_meter_gain_passive', 'Offense Up', 'Tactical Data'], [])
    ],
    'Separatist Elite',
    8700,
    'Stealthy, ignore truant assassin',
    { speed: 155, hp: 45000, protection: 35000, offense: 4200 }
  ),
  createCharacter(
    'dwarf_spider_droid',
    'Dwarf Spider Droid',
    'Tank / Attacker',
    ['Separatist', 'Droid', 'Separatist Elite'],
    'Heavily armored artillery tank built for relentless defensive bombardments.',
    [
      makeAbility('dwarf_spider_basic', 'Repeating Blaster Cannon', 'basic', 0, 'Deal Physical Damage. Gain 1 stack of Tactical Data.', ['damage', 'Tactical Data'], ['offensive']),
      makeAbility('dwarf_spider_special_1', 'Entrenched Position', 'special', 3, 'Gain Taunt (2 turns) and Defense Up (2 turns). If Dwarf Spider Droid has Tactical Data: Consume 1 stack. Recover 20% Protection.', ['Taunt', 'Defense Up', 'protection_recovery'], ['defensive']),
      makeAbility('dwarf_spider_special_2', 'Focused Barrage', 'special', 4, 'Deal Physical Damage to all enemies. If Dwarf Spider Droid has Tactical Data: Consume all Tactical Data. Deal 15% additional damage for each stack consumed. Inflict Offense Down (2 turns).', ['damage_aoe', 'bonus_damage', 'Offense Down'], ['offensive']),
      makeAbility('dwarf_spider_unique', 'Siege Platform', 'unique', 0, 'Whenever Dwarf Spider Droid consumes Tactical Data: Gain 10% Defense (stacking). Whenever a Separatist Elite ally gains Tactical Data: Recover 3% Protection. Whenever Dwarf Spider Droid Taunts: Gain 1 stack of Tactical Data.', ['defense_passive', 'protection_recovery_passive', 'Tactical Data'], [])
    ],
    'Separatist Elite',
    8500,
    'Heavy entrenched artillery tank',
    { speed: 105, hp: 65000, protection: 50000 }
  ),
  createCharacter(
    'droideka',
    'Droideka',
    'Attacker',
    ['Separatist', 'Droid', 'Separatist Elite'],
    'Armored rolling destroyer with shield generators and terrifying damage output.',
    [
      makeAbility('droideka_basic', 'Twin Blaster Cannons', 'basic', 0, 'Deal Physical Damage. Gain 1 stack of Tactical Data.', ['damage', 'Tactical Data'], ['offensive']),
      makeAbility('droideka_special_1', 'Destroyer Configuration', 'special', 3, 'Gain Offense Up (2 turns) and Critical Damage Up (2 turns). If Droideka has Tactical Data: Consume 1 stack. Gain 25% Turn Meter.', ['Offense Up', 'Critical Damage Up', 'turn_meter_gain'], ['buff']),
      makeAbility('droideka_special_2', 'Overwhelming Firepower', 'special', 4, 'Deal massive Physical Damage. If Droideka has Tactical Data: Consume all Tactical Data. Deal 30% additional damage for each stack consumed. This attack ignores Protection.', ['damage_heavy', 'bonus_damage', 'ignore_protection'], ['offensive']),
      makeAbility('droideka_unique', 'Shield Generator', 'unique', 0, 'Whenever Droideka gains Tactical Data: Recover 5% Protection. Whenever Droideka consumes Tactical Data: Gain Critical Chance Up (2 turns). Whenever a Separatist Elite ally consumes Tactical Data: Droideka gains 5% Turn Meter.', ['protection_recovery_passive', 'Critical Chance Up', 'turn_meter_gain_passive'], [])
    ],
    'Separatist Elite',
    8800,
    'High damage piercing cannons',
    { speed: 115, hp: 45000, protection: 60000, offense: 3800 }
  )
];
