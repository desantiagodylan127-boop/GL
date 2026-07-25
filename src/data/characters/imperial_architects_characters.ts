import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const IMPERIAL_ARCHITECTS_CHARACTERS: Character[] = [
  createCharacter(
    'admiral_piett_final',
    'Admiral Piett (The Final Admiral)',
    'Leader / Strategist',
    ['Galactic Empire', 'Imperial Architects', 'Journey Character'],
    'Commander of the fleet for the Architects.',
    [
      makeAbility('piett_f_basic', 'Fleet Coordination', 'basic', 0, 'Deal Physical Damage. Target ally gains 5% Turn Meter. Gain 1 stack of The Project.', ['damage', 'turn_meter_gain_ally', 'The Project'], ['offensive']),
      makeAbility('piett_f_special_1', 'Executor Formation', 'special', 3, 'All Imperial Architect allies gain Defense Up (2 turns) and Tenacity Up (2 turns). Gain 3 stacks of The Project.', ['buff_faction', 'Defense Up', 'Tenacity Up', 'The Project'], ['buff']),
      makeAbility('piett_f_special_2', 'Orbital Readiness', 'special', 4, 'Call all Imperial Architect allies to assist dealing 50% reduced damage. Gain 5 stacks of The Project.', ['assist_all_faction', 'The Project'], ['offensive']),
      makeAbility('piett_f_leader', 'Final Authorization', 'leader', 0, 'Imperial Architect allies gain 25 Speed and 20% Defense. Whenever an Imperial Architect ally uses a Special Ability: Gain 1 stack of The Project. Whenever an Imperial Architect ally is defeated: Gain 3 stacks of The Project. Whenever The Project reaches 25 stacks: All Imperial Architect allies gain Offense Up and Defense Up (2 turns).', ['leader', 'The Project', 'Offense Up', 'Defense Up'], []),
      makeAbility('piett_f_unique', 'Executor Command Authority', 'unique', 0, 'Whenever The Project gains a stack: Piett gains 2% Turn Meter. When The Project becomes Complete: Unlock Authority By All Means.', ['turn_meter_gain_passive', 'The Project'], []),
      makeAbility('piett_f_special_3', 'Authority By All Means', 'special', 5, 'Unlock Condition: The Project Complete. Select target enemy. The Executor opens fire. Defeat target enemy. This defeat cannot be prevented. This enemy cannot be revived. Consume all stacks of The Project. The Project returns to 0 stacks. This ability can only be used once per battle.', ['instakill', 'The Project'], ['offensive'])
    ],
    'Imperial Architects',
    9000,
    'Accelerates The Project and commands the fleet.',
    { speed: 140, hp: 50000, protection: 50000 }
  ),
  createCharacter(
    'director_krennic_architect',
    'Director Krennic (Architect)',
    'Leader / Strategist',
    ['Galactic Empire', 'Imperial Architects'],
    'Visionary behind the advanced weapons division.',
    [
      makeAbility('krennic_arc_basic', 'Project Oversight', 'basic', 0, 'Deal Physical Damage. Gain 1 stack of The Project.', ['damage', 'The Project'], ['offensive']),
      makeAbility('krennic_arc_special_1', 'Unlimited Resources', 'special', 3, 'Target Imperial Architect ally gains Offense Up (2 turns) and Defense Up (2 turns). Gain 2 stacks of The Project.', ['buff_ally', 'Offense Up', 'Defense Up', 'The Project'], ['buff']),
      makeAbility('krennic_arc_special_2', 'Accelerate Construction', 'special', 4, 'Gain 4 stacks of The Project. All Imperial Architect allies recover 10% Protection.', ['protection_recovery_aoe_faction', 'The Project'], ['heal']),
      makeAbility('krennic_arc_leader', 'Director Of Advanced Weapons', 'leader', 0, 'Imperial Architect allies gain 20 Speed and 20% Max Protection. Whenever an ally gains a buff: Gain 1 stack of The Project. Whenever The Project reaches 10, 15, or 20 stacks: All Imperial Architect allies recover 5% Protection.', ['leader', 'protection_recovery_passive', 'The Project'], []),
      makeAbility('krennic_arc_unique', 'Obsessed Visionary', 'unique', 0, 'Whenever The Project gains a stack: Krennic gains 2% Turn Meter. Whenever Galen Erso uses a Special Ability: Gain 2 additional stacks of The Project. Whenever The Project reaches 25 stacks: Krennic gains Offense Up and Critical Damage Up (3 turns).', ['turn_meter_gain_passive', 'Offense Up', 'Critical Damage Up', 'The Project'], [])
    ],
    'Imperial Architects',
    8000,
    'Generates massive amounts of The Project.',
    { speed: 135 }
  ),
  createCharacter(
    'galen_erso',
    'Galen Erso',
    'Support / Strategist',
    ['Galactic Empire', 'Imperial Architects'],
    'Reluctant genius forced to work for the Empire.',
    [
      makeAbility('galen_basic', 'Reluctant Genius', 'basic', 0, 'Deal Special Damage. Gain 1 stack of The Project.', ['damage', 'The Project'], ['offensive']),
      makeAbility('galen_special_1', 'Compelled Service', 'special', 3, 'Target ally recovers 15% Health and 15% Protection. Gain 2 stacks of The Project.', ['heal_ally', 'The Project'], ['heal']),
      makeAbility('galen_special_2', 'For Jyn', 'special', 5, 'Galen is defeated. All Imperial Architect allies recover 50% Health and Protection. Gain 8 stacks of The Project. Reduce all Imperial Architect cooldowns by 1. This ability can only be used once per battle.', ['sacrifice', 'heal_all_faction', 'The Project'], ['heal']),
      makeAbility('galen_unique', 'The Hostage Scientist', 'unique', 0, 'At the start of battle: Galen gains Hostage Scientist. Hostage Scientist cannot be dispelled. Whenever Galen takes damage: Gain 1 stack of The Project. If Galen is defeated by an enemy: Gain 5 stacks of The Project.', ['passive_gain', 'The Project', 'Hostage Scientist'], [])
    ],
    'Imperial Architects',
    6500,
    'Crucial for The Project but comes with a sacrifice.',
    { speed: 125, hp: 40000, protection: 35000 }
  ),
  createCharacter(
    'imperial_engineer',
    'Imperial Engineer',
    'Support',
    ['Galactic Empire', 'Imperial Architects'],
    'Essential crew for keeping systems operational.',
    [
      makeAbility('imp_eng_basic', 'Maintenance Protocol', 'basic', 0, 'Deal Physical Damage. Lowest Health Imperial Architect ally recovers 5% Protection. Gain 1 stack of The Project.', ['damage', 'protection_recovery_ally', 'The Project'], ['offensive', 'heal']),
      makeAbility('imp_eng_special_1', 'Structural Reinforcement', 'special', 3, 'Target ally gains Defense Up (2 turns) and Tenacity Up (2 turns). Gain 2 stacks of The Project.', ['buff_ally', 'Defense Up', 'Tenacity Up', 'The Project'], ['buff']),
      makeAbility('imp_eng_special_2', 'Assembly Line', 'special', 4, 'All Imperial Architect allies recover 10% Protection. Gain 4 stacks of The Project.', ['protection_recovery_aoe_faction', 'The Project'], ['heal']),
      makeAbility('imp_eng_unique', 'Chief Systems Engineer', 'unique', 0, 'Whenever an Imperial Architect ally uses a Special Ability: Gain 1 stack of The Project. Whenever an Imperial Architect ally gains Defense Up: Recover 3% Protection. Whenever The Project reaches 10, 15, or 20 stacks: Reduce Imperial Engineer cooldowns by 1.', ['protection_recovery_passive', 'The Project'], [])
    ],
    'Imperial Architects',
    5500,
    'Heals and protects.',
    { speed: 130 }
  ),
  createCharacter(
    'bevel_lemelisk',
    'Bevel Lemelisk',
    'Strategist / Saboteur',
    ['Galactic Empire', 'Imperial Architects'],
    'Designer of the Death Star.',
    [
      makeAbility('bevel_basic', 'Weapon Systems Calibration', 'basic', 0, 'Deal Special Damage. Gain 1 stack of The Project.', ['damage', 'The Project'], ['offensive']),
      makeAbility('bevel_special_1', 'Design Revision', 'special', 3, 'Target enemy gains Defense Down (2 turns) and Offense Down (2 turns). Gain 2 stacks of The Project.', ['debuff', 'Defense Down', 'Offense Down', 'The Project'], ['debuff']),
      makeAbility('bevel_special_2', 'Superlaser Optimization', 'special', 5, 'Consume up to 5 stacks of The Project. For each stack consumed: All Imperial Architect allies gain 5% Turn Meter. If 5 stacks were consumed: All Imperial Architect allies gain Offense Up (2 turns).', ['turn_meter_gain_aoe_faction', 'The Project', 'Offense Up'], ['buff']),
      makeAbility('bevel_unique', 'Architect Of Catastrophe', 'unique', 0, 'Whenever The Project gains a stack: Bevel gains 2% Turn Meter. Whenever The Project is consumed: Recover 20% Protection. Whenever an enemy is defeated: Gain 2 stacks of The Project.', ['turn_meter_gain_passive', 'protection_recovery_passive', 'The Project'], [])
    ],
    'Imperial Architects',
    7000,
    'Turn Meter control and acceleration.',
    { speed: 128 }
  ),
  createCharacter(
    'vice_admiral_dodd_rancit',
    'Vice Admiral Dodd Rancit',
    'Tank / Strategist',
    ['Galactic Empire', 'Imperial Architects'],
    'Protector of the Emperor\'s secrets.',
    [
      makeAbility('dodd_basic', 'Command Barge', 'basic', 0, 'Deal Physical Damage. Inflict Offense Down (2 turns).', ['damage', 'Offense Down'], ['offensive']),
      makeAbility('dodd_special_1', 'Protect The Project', 'special', 3, 'Gain Taunt (2 turns), Defense Up (2 turns), and Retribution (2 turns). Gain 2 stacks of The Project.', ['taunt', 'Defense Up', 'Retribution', 'The Project', 'Taunt'], ['defensive']),
      makeAbility('dodd_special_2', 'Fleet Security Measures', 'special', 4, 'All Imperial Architect allies gain Defense Up (2 turns) and Protection Up (20%). Gain 3 stacks of The Project.', ['buff_faction', 'Defense Up', 'Protection Up', 'The Project'], ['buff']),
      makeAbility('dodd_unique', 'Operational Security', 'unique', 0, 'Whenever Dodd Rancit is attacked while Taunting: Gain 1 stack of The Project. Whenever an Imperial Architect ally falls below 50% Health: Dodd gains Taunt (1 turn). Whenever The Project reaches 25 stacks: Dodd gains Defense Up, Retribution, and Tenacity Up (3 turns).', ['taunt_passive', 'Defense Up', 'Retribution', 'Tenacity Up', 'The Project', 'Taunt'], [])
    ],
    'Imperial Architects',
    6000,
    'Tank for the Architects.',
    { speed: 115, hp: 55000, protection: 50000, defense: 55 }
  )
];
