import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const EMPIRE_STANDARD_CHARACTERS: Character[] = [
  createCharacter(
    'emperor_palpatine',
    'Emperor Palpatine',
    'Leader / Strategist',
    ['Galactic Empire', 'Sith'],
    'Dark Lord of the Sith and Emperor of the Galactic Empire.',
    [
      makeAbility('palpatine_basic', 'Force Lightning', 'basic', 0, 'Deal Special Damage. 50% chance to inflict Shock (2 turns).', ['damage', 'Shock'], ['offensive']),
      makeAbility('palpatine_special_1', 'Unlimited Power', 'special', 3, 'Deal Special Damage to all enemies. Inflict Shock (2 turns). Shocked enemies lose 5% Turn Meter.', ['damage_aoe', 'turn_meter_reduction_aoe', 'Shock'], ['offensive', 'debuff']),
      makeAbility('palpatine_special_2', 'Crush The Rebellion', 'special', 4, 'Inflict Ability Block (2 turns) on all enemies. Empire allies gain Offense Up (2 turns).', ['debuff_aoe', 'buff_faction', 'Ability Block', 'Offense Up'], ['debuff', 'buff']),
      makeAbility('palpatine_leader', 'Rule Through Fear', 'leader', 0, 'Empire allies gain 20 Speed and 20% Potency. Whenever an enemy gains a debuff: Empire allies gain 2% Turn Meter. Shocked enemies deal 15% less damage.', ['leader', 'turn_meter_gain_passive', 'Shock'], []),
      makeAbility('palpatine_unique', 'Dark Lord Of The Empire', 'unique', 0, 'Whenever an enemy loses Turn Meter: Palpatine gains 3% Turn Meter. Whenever an enemy is defeated: Empire allies recover 5% Protection.', ['passive_gain', 'turn_meter_gain_passive', 'protection_recovery_passive'], [])
    ],
    'Galactic Empire',
    7500,
    'Deals massive damage and controls the battlefield.',
    { speed: 125, hp: 45000, potency: 60 }
  ),
  createCharacter(
    'darth_vader',
    'Darth Vader',
    'Leader / Attacker',
    ['Galactic Empire', 'Sith'],
    'Fearsome enforcer of the Galactic Empire.',
    [
      makeAbility('vader_basic', 'Vader\'s Blade', 'basic', 0, 'Deal Physical Damage. Inflict Defense Down (2 turns).', ['damage', 'Defense Down'], ['offensive']),
      makeAbility('vader_special_1', 'Force Choke', 'special', 3, 'Deal Special Damage. Inflict Ability Block (2 turns) and Speed Down (2 turns).', ['damage', 'Ability Block', 'Speed Down'], ['offensive', 'debuff']),
      makeAbility('vader_special_2', 'Relentless Assault', 'special', 4, 'Deal Physical Damage to all enemies. Gain Offense Up (2 turns).', ['damage_aoe', 'buff_self', 'Offense Up'], ['offensive']),
      makeAbility('vader_leader', 'The Emperor\'s Fist', 'leader', 0, 'Empire allies gain 25% Offense and 15 Speed. Whenever an enemy falls below 50% Health: Empire allies gain 3% Turn Meter.', ['leader', 'turn_meter_gain_passive'], []),
      makeAbility('vader_unique', 'Feared Across The Galaxy', 'unique', 0, 'Whenever Vader defeats an enemy: Gain Offense Up (2 turns) and recover 20% Protection. Whenever Vader attacks a debuffed enemy: Deal 15% additional damage.', ['passive_gain', 'protection_recovery', 'Offense Up'], [])
    ],
    'Galactic Empire',
    8000,
    'Massive damage and debuffs.',
    { speed: 135, offense: 4500, hp: 55000 }
  ),
  createCharacter(
    'general_veers',
    'General Veers',
    'Leader / Strategist',
    ['Galactic Empire', 'Imperial Trooper'],
    'Lead commander of the Imperial Troopers.',
    [
      makeAbility('veers_basic', 'Coordinated Fire', 'basic', 0, 'Deal Physical Damage. Target Imperial Trooper gains 5% Turn Meter.', ['damage', 'turn_meter_gain'], ['offensive']),
      makeAbility('veers_special_1', 'Forward Assault', 'special', 3, 'Call target Imperial Trooper ally to assist. Both attackers gain Offense Up (2 turns).', ['assist', 'Offense Up'], ['offensive']),
      makeAbility('veers_special_2', 'Maximum Pressure', 'special', 4, 'Imperial Trooper allies gain Speed Up (2 turns) and Offense Up (2 turns).', ['buff_faction', 'Speed Up', 'Offense Up'], ['buff']),
      makeAbility('veers_leader', 'Imperial Offensive', 'leader', 0, 'Imperial Trooper allies gain 25 Speed and 20% Offense. Whenever an Imperial Trooper assists: Gain 2% Turn Meter.', ['leader', 'turn_meter_gain_passive'], []),
      makeAbility('veers_unique', 'Battle Of Hoth Veteran', 'unique', 0, 'Whenever an Imperial Trooper gains Turn Meter: Veers gains 2% Turn Meter. Whenever an Imperial Trooper defeats an enemy: Reduce Veers cooldowns by 1.', ['turn_meter_gain_passive'], [])
    ],
    'Galactic Empire',
    6000,
    'Trooper synergy.',
    { speed: 130 }
  ),
  createCharacter(
    'admiral_piett',
    'Admiral Piett',
    'Leader / Strategist',
    ['Galactic Empire', 'Imperial Trooper'],
    'Ambitious commander of the Executor.',
    [
      makeAbility('piett_basic', 'Precision Command', 'basic', 0, 'Deal Physical Damage. Target ally gains 5% Turn Meter.', ['damage', 'turn_meter_gain'], ['offensive']),
      makeAbility('piett_special_1', 'Executor\'s Orders', 'special', 3, 'Target ally gains Offense Up (2 turns), Critical Chance Up (2 turns), and 10% Turn Meter.', ['buff_ally', 'turn_meter_gain_ally', 'Offense Up', 'Critical Chance Up'], ['buff']),
      makeAbility('piett_special_2', 'Fleet Coordination', 'special', 4, 'Call all Imperial Trooper allies to assist dealing 50% reduced damage.', ['assist_all_faction'], ['offensive']),
      makeAbility('piett_leader', 'Perfect Discipline', 'leader', 0, 'Imperial Trooper allies gain 20 Speed and 20% Defense. Whenever an Imperial Trooper uses a Special Ability: Recover 3% Protection. Whenever an Imperial Trooper assists: Gain 2% Turn Meter.', ['leader', 'protection_recovery_passive', 'turn_meter_gain_passive'], []),
      makeAbility('piett_unique', 'The Admiral\'s Approval', 'unique', 0, 'Whenever an ally assists: Piett gains 3% Turn Meter. Whenever an Imperial Trooper falls below 50% Health: Grant Defense Up (1 turn).', ['turn_meter_gain_passive', 'Defense Up'], [])
    ],
    'Galactic Empire',
    6500,
    'Mass assists and buffs.',
    { speed: 138 }
  ),
  createCharacter(
    'royal_guard',
    'Royal Guard',
    'Tank',
    ['Galactic Empire'],
    'Elite protector of the Emperor.',
    [
      makeAbility('rg_basic', 'Force Pike Strike', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Speed Down (2 turns).', ['damage', 'Speed Down'], ['offensive']),
      makeAbility('rg_special_1', 'Protect The Emperor', 'special', 3, 'Gain Taunt (2 turns), Defense Up (2 turns), and Retribution (2 turns).', ['taunt', 'Defense Up', 'Retribution', 'Taunt'], ['defensive']),
      makeAbility('rg_special_2', 'Crushing Guard Stance', 'special', 4, 'Deal Physical Damage. Inflict Offense Down (2 turns). If Emperor Palpatine is an ally: Stun target enemy for 1 turn.', ['damage', 'Offense Down', 'Stun'], ['offensive', 'debuff']),
      makeAbility('rg_unique', 'Unwavering Loyalty', 'unique', 0, 'Whenever Emperor Palpatine falls below 50% Health: Royal Guard gains Taunt (2 turns). Whenever Royal Guard is attacked while Taunting: Recover 3% Protection. Whenever Emperor Palpatine uses a Special Ability: Royal Guard gains Defense Up (1 turn).', ['taunt_passive', 'protection_recovery_passive', 'Defense Up', 'Taunt'], [])
    ],
    'Galactic Empire',
    5500,
    'Sturdy tank.',
    { speed: 110, hp: 60000, protection: 50000, defense: 60 }
  ),
  createCharacter(
    'stormtrooper',
    'Stormtrooper',
    'Tank',
    ['Galactic Empire', 'Imperial Trooper'],
    'Expendable but numerous soldier.',
    [
      makeAbility('storm_basic', 'Disciplined Fire', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Offense Down (1 turn).', ['damage', 'Offense Down'], ['offensive']),
      makeAbility('storm_special_1', 'Defensive Formation', 'special', 3, 'Gain Taunt (2 turns) and Defense Up (2 turns).', ['taunt', 'Defense Up', 'Taunt'], ['defensive']),
      makeAbility('storm_special_2', 'Suppressive Volley', 'special', 4, 'Deal Physical Damage to all enemies. Inflict Speed Down (1 turn).', ['damage_aoe', 'Speed Down'], ['offensive', 'debuff']),
      makeAbility('storm_unique', 'Imperial Discipline', 'unique', 0, 'Whenever an Imperial Trooper ally is attacked: Recover 2% Protection. Whenever Stormtrooper gains Taunt: Gain Tenacity Up (1 turn).', ['protection_recovery_passive', 'Tenacity Up', 'Taunt'], [])
    ],
    'Galactic Empire',
    4000,
    'Basic Imperial Tank.',
    { speed: 105, hp: 45000, protection: 40000 }
  ),
  createCharacter(
    'shore_trooper',
    'Shore Trooper',
    'Tank / Support',
    ['Galactic Empire', 'Imperial Trooper'],
    'Specialized garrison defense trooper.',
    [
      makeAbility('shore_basic', 'Coastal Barrage', 'basic', 0, 'Deal Physical Damage. Target ally recovers 3% Protection.', ['damage', 'protection_recovery_ally'], ['offensive']),
      makeAbility('shore_special_1', 'Forward Outpost', 'special', 3, 'Gain Taunt (2 turns). All Imperial Trooper allies gain Defense Up (2 turns).', ['taunt', 'buff_faction', 'Defense Up', 'Taunt'], ['defensive']),
      makeAbility('shore_special_2', 'Beachhead Defense', 'special', 4, 'All Imperial Trooper allies recover 10% Protection.', ['protection_recovery_aoe_faction'], ['heal']),
      makeAbility('shore_unique', 'Frontline Logistics', 'unique', 0, 'Whenever an Imperial Trooper ally gains a buff: Shore Trooper recovers 3% Protection. Whenever Shore Trooper Taunts: All Imperial Trooper allies gain 2% Turn Meter.', ['protection_recovery_passive', 'turn_meter_gain_passive', 'Taunt'], [])
    ],
    'Galactic Empire',
    5000,
    'Healer Tank.',
    { speed: 110, hp: 50000, protection: 50000 }
  ),
  createCharacter(
    'snowtrooper',
    'Snowtrooper',
    'Attacker',
    ['Galactic Empire', 'Imperial Trooper'],
    'Cold weather assault specialist.',
    [
      makeAbility('snow_basic', 'Hoth Assault', 'basic', 0, 'Deal Physical Damage. Gain Critical Chance Up (1 turn).', ['damage', 'Critical Chance Up'], ['offensive']),
      makeAbility('snow_special_1', 'Blizzard Barrage', 'special', 3, 'Deal Physical Damage to all enemies. Gain Offense Up (2 turns).', ['damage_aoe', 'Offense Up'], ['offensive']),
      makeAbility('snow_special_2', 'Arctic Advance', 'special', 4, 'Attack target enemy. Call another Imperial Trooper ally to assist.', ['damage', 'assist_faction'], ['offensive']),
      makeAbility('snow_unique', 'Frozen Campaign Veteran', 'unique', 0, 'Whenever Snowtrooper critically hits: Gain 5% Turn Meter. Whenever an enemy is defeated: Recover 10% Protection.', ['turn_meter_gain_passive', 'protection_recovery_passive'], [])
    ],
    'Galactic Empire',
    5500,
    'AoE Attacker.',
    { speed: 120, offense: 3500 }
  ),
  createCharacter(
    'magmatrooper',
    'Magmatrooper',
    'Attacker / Saboteur',
    ['Galactic Empire', 'Imperial Trooper'],
    'Heavy weapons trooper.',
    [
      makeAbility('magma_basic', 'Thermal Blast', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Burn (1 turn).', ['damage', 'Burning'], ['offensive']),
      makeAbility('magma_special_1', 'Lava Sweep', 'special', 3, 'Deal Physical Damage to all enemies. Inflict Burn (2 turns).', ['damage_aoe', 'Burning'], ['offensive', 'debuff']),
      makeAbility('magma_special_2', 'Volcanic Pressure', 'special', 4, 'Burning enemies lose 10% Turn Meter.', ['turn_meter_reduction_aoe'], ['debuff']),
      makeAbility('magma_unique', 'Extreme Environment Training', 'unique', 0, 'Whenever an enemy gains Burn: Gain 5% Turn Meter. Whenever Magmatrooper attacks a Burning enemy: Deal 15% additional damage.', ['turn_meter_gain_passive'], [])
    ],
    'Galactic Empire',
    5000,
    'Turn Meter control and Burn.',
    { speed: 115 }
  ),
  createCharacter(
    'sandtrooper',
    'Sandtrooper',
    'Support / Saboteur',
    ['Galactic Empire', 'Imperial Trooper'],
    'Desert tracker.',
    [
      makeAbility('sand_basic', 'Desert Patrol', 'basic', 0, 'Deal Physical Damage. Inflict Speed Down (1 turn).', ['damage', 'Speed Down'], ['offensive']),
      makeAbility('sand_special_1', 'Search The Dunes', 'special', 3, 'Remove 10% Turn Meter from target enemy.', ['turn_meter_reduction'], ['debuff']),
      makeAbility('sand_special_2', 'Sector Sweep', 'special', 4, 'Remove 5% Turn Meter from all enemies. Enemies with Speed Down lose an additional 5%.', ['turn_meter_reduction_aoe'], ['debuff']),
      makeAbility('sand_unique', 'Relentless Tracker', 'unique', 0, 'Whenever an enemy loses Turn Meter: Sandtrooper gains 5% Turn Meter. Whenever Sandtrooper attacks an enemy with Speed Down: Recover 5% Protection.', ['turn_meter_gain_passive', 'protection_recovery_passive'], [])
    ],
    'Galactic Empire',
    4800,
    'Turn Meter suppression.',
    { speed: 120 }
  ),
  createCharacter(
    'scout_trooper',
    'Scout Trooper',
    'Attacker / Saboteur',
    ['Galactic Empire', 'Imperial Trooper'],
    'Recon specialist.',
    [
      makeAbility('scout_basic', 'Recon Shot', 'basic', 0, 'Deal Physical Damage. Gain Stealth (1 turn).', ['damage', 'Stealth'], ['offensive']),
      makeAbility('scout_special_1', 'Ambush Position', 'special', 3, 'Gain Stealth (2 turns) and Critical Damage Up (2 turns).', ['Stealth', 'Critical Damage Up'], ['buff']),
      makeAbility('scout_special_2', 'Precision Ambush', 'special', 4, 'Deal Massive Physical Damage. If Scout Trooper had Stealth: Ignore 25% Defense.', ['damage_heavy'], ['offensive']),
      makeAbility('scout_unique', 'Advance Recon', 'unique', 0, 'Whenever Scout Trooper gains Stealth: Gain 5% Turn Meter. Whenever Scout Trooper critically hits: Gain Offense Up (1 turn).', ['turn_meter_gain_passive', 'Offense Up'], [])
    ],
    'Galactic Empire',
    5200,
    'High damage attacker.',
    { speed: 135, offense: 3800 }
  ),
  createCharacter(
    'tank_trooper',
    'Tank Trooper',
    'Tank / Attacker',
    ['Galactic Empire', 'Imperial Trooper'],
    'Vehicle operator.',
    [
      makeAbility('tanktr_basic', 'Heavy Repeater', 'basic', 0, 'Deal Physical Damage. Inflict Offense Down (1 turn).', ['damage', 'Offense Down'], ['offensive']),
      makeAbility('tanktr_special_1', 'Armored Advance', 'special', 3, 'Gain Taunt (2 turns) and Defense Up (2 turns).', ['taunt', 'Defense Up', 'Taunt'], ['defensive']),
      makeAbility('tanktr_special_2', 'Suppressive Barrage', 'special', 4, 'Deal Physical Damage to all enemies. Inflict Offense Down (2 turns).', ['damage_aoe', 'Offense Down'], ['offensive']),
      makeAbility('tanktr_unique', 'Mobile Fortress', 'unique', 0, 'Whenever Tank Trooper is attacked: Recover 2% Protection. Whenever Tank Trooper gains Taunt: Gain Retribution (1 turn).', ['protection_recovery_passive', 'Retribution', 'Taunt'], [])
    ],
    'Galactic Empire',
    5000,
    'Sturdy tank.',
    { speed: 105, hp: 55000, protection: 45000 }
  ),
  createCharacter(
    'tie_pilot',
    'TIE Pilot',
    'Attacker',
    ['Galactic Empire', 'Imperial Trooper'],
    'Imperial starfighter pilot.',
    [
      makeAbility('tie_basic', 'Precision Burst', 'basic', 0, 'Deal Physical Damage. Gain Critical Chance Up (1 turn).', ['damage', 'Critical Chance Up'], ['offensive']),
      makeAbility('tie_special_1', 'Attack Run', 'special', 3, 'Deal Massive Physical Damage. If TIE Pilot is faster than the target: Deal 25% additional damage.', ['damage_heavy'], ['offensive']),
      makeAbility('tie_special_2', 'Aerial Coordination', 'special', 4, 'Gain Advantage (2 turns) and Offense Up (2 turns). Call another Imperial Trooper ally to assist.', ['buff_self', 'assist_faction', 'Advantage', 'Offense Up'], ['offensive']),
      makeAbility('tie_unique', 'Elite Pilot Training', 'unique', 0, 'Gain 15 Speed. Whenever TIE Pilot critically hits: Gain 5% Turn Meter. Whenever TIE Pilot defeats an enemy: Reset Attack Run.', ['turn_meter_gain_passive', 'Speed'], [])
    ],
    'Galactic Empire',
    5500,
    'Fast attacker.',
    { speed: 145, offense: 4000 }
  ),
  createCharacter(
    'shadow_trooper',
    'Shadow Trooper',
    'Attacker / Saboteur',
    ['Galactic Empire', 'Imperial Trooper'],
    'Special operations commando.',
    [
      makeAbility('shadow_basic', 'Shadow Strike', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Buff Immunity (1 turn).', ['damage', 'Buff Immunity'], ['offensive']),
      makeAbility('shadow_special_1', 'Cloaked Advance', 'special', 3, 'Gain Stealth (2 turns) and Critical Damage Up (2 turns).', ['Stealth', 'Critical Damage Up'], ['buff']),
      makeAbility('shadow_special_2', 'Black Ops Elimination', 'special', 4, 'Deal Massive Physical Damage. If Shadow Trooper had Stealth: Ignore 25% Defense. Inflict Healing Immunity (2 turns).', ['damage_heavy', 'Healing Immunity'], ['offensive']),
      makeAbility('shadow_unique', 'Imperial Black Operations', 'unique', 0, 'Whenever Shadow Trooper gains Stealth: Gain 10% Turn Meter. Whenever an enemy gains a debuff: Gain Offense Up (1 turn). Whenever Shadow Trooper defeats an enemy: Recover 20% Protection.', ['turn_meter_gain_passive', 'protection_recovery_passive', 'Offense Up'], [])
    ],
    'Galactic Empire',
    6000,
    'Stealth attacker.',
    { speed: 140, offense: 4200 }
  ),
  createCharacter(
    'colonel_stark',
    'Colonel Stark',
    'Support / Strategist',
    ['Galactic Empire', 'Imperial Trooper'],
    'Tactical Imperial commander.',
    [
      makeAbility('stark_basic', 'Strategic Fire', 'basic', 0, 'Deal Physical Damage. Target Imperial Trooper ally gains 3% Turn Meter.', ['damage', 'turn_meter_gain_ally'], ['offensive']),
      makeAbility('stark_special_1', 'Battlefield Orders', 'special', 3, 'Target ally gains Offense Up (2 turns), Critical Chance Up (2 turns), and 10% Turn Meter.', ['buff_ally', 'turn_meter_gain_ally', 'Offense Up', 'Critical Chance Up'], ['buff']),
      makeAbility('stark_special_2', 'Calculated Offensive', 'special', 4, 'Call all Imperial Trooper allies to assist dealing 50% reduced damage. All assisting allies gain 5% Turn Meter.', ['assist_all_faction', 'turn_meter_gain_aoe'], ['offensive']),
      makeAbility('stark_unique', 'Imperial Tactician', 'unique', 0, 'Whenever an Imperial Trooper ally gains Turn Meter: Colonel Stark gains 2% Turn Meter. Whenever an Imperial Trooper ally assists: Recover 2% Protection. Whenever an enemy is defeated: Reduce all Imperial Trooper cooldowns by 1.', ['turn_meter_gain_passive', 'protection_recovery_passive'], [])
    ],
    'Galactic Empire',
    5800,
    'Trooper buffer.',
    { speed: 125 }
  )
];
