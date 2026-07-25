import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const CLONE_CHARACTERS: Character[] = [
  // --- 501st Team ---
  createCharacter(
    'captain_rex',
    'Captain Rex',
    'Leader / Strategist',
    ['Galactic Republic', 'Clone Trooper', '501st'],
    'Veteran clone commander who protects his squad with tactical speed, assists, and defensive protection recovery.',
    [
      makeAbility('rex_basic', 'Jaig Eye Precision', 'basic', 0, 'Deal Physical Damage. Gain Momentum. If Rex has 5 or more Momentum, inflict Defense Down (2 Turns). If Rex has 10 or more Momentum, consume 10 Momentum and attack again for 50% reduced dmg.', ['damage', 'Momentum', 'Defense Down'], ['offensive']),
      makeAbility('rex_special_1', 'Form Up Troopers', 'special', 3, 'All 501st allies gain Speed Up (2 Turns). Rex gains Momentum (2 Stacks). If Rex has 5 or more Momentum, consumes 5 and heals all allies 10% Protection.', ['buff_all', 'Speed Up', 'Momentum', 'protection_recovery'], ['defensive', 'buff']),
      makeAbility('rex_special_2', 'Mark The Objective', 'special', 4, 'Deal Physical Damage. Inflict Defense Down (2 Turns) on target and call all other 501st to Assist dealing 50% reduced dmg. If Rex has 10 or more Momentum, consumes 10 and gains Bonus Turn.', ['damage', 'debuff', 'Defense Down', 'assist_all', 'Momentum', 'bonus_turn'], ['offensive']),
      makeAbility('rex_leader', 'Pathfinder Commander', 'leader', 0, 'At battle start, Rex gains Pathfinder. All other 501st allies gain Momentum (1 Stack). 501st allies gain Momentum (1 Stack) when using Special, and recover 2% Protection when gaining Momentum.', ['buff_faction', 'Pathfinder', 'Momentum', 'protection_recovery'], []),
      makeAbility('rex_unique', 'For The 501st', 'unique', 0, 'Whenever another 501st ally uses a Special, Rex gains 5% TM. When Rex gains Momentum: +1% Crit Damage (Stacking). When Rex recovers from Fatigue: all allies recover 15% Protection.', ['passive_boost', 'turn_meter_gain', 'protection_recovery'], [])
    ],
    '501st',
    8500,
    'High tempo dynamic team setup',
    { speed: 145, hp: 48000, protection: 38000 }
  ),

  createCharacter(
    'jesse',
    'Jesse',
    'Attacker / Saboteur',
    ['Galactic Republic', 'Clone Trooper', '501st'],
    'ARC Trooper who triggers double-tap basic attacks and all-out 501st offensive assists.',
    [
      makeAbility('jesse_basic', 'Republic Crest Volley', 'basic', 0, 'Deal Physical Damage. Gain Momentum. If Jesse has 5 or more Momentum, inflicts Defense Down (2 Turns).', ['damage', 'Momentum', 'Defense Down'], ['offensive']),
      makeAbility('jesse_special_1', 'Frontline Aggression', 'special', 3, 'Deal Physical Damage. Gains Momentum (2 Stacks). If target is below 50% Integrity, deals bonus damage. If Jesse has 5 or more Momentum, consumes 5 and gains Bonus Turn.', ['damage', 'Momentum', 'bonus_turn'], ['offensive']),
      makeAbility('jesse_special_2', 'Victory At Any Cost', 'special', 4, 'Deal Physical Damage. If Jesse has 10 or more Momentum, consumes all Momentum, ignores Protection, and deals 5% bonus damage for each Momentum consumed.', ['damage', 'Momentum', 'penetrate_shield'], ['offensive']),
      makeAbility('jesse_unique', 'Arc Trooper Heritage', 'unique', 0, 'Whenever a 501st ally assists: Jesse gains Momentum. Whenever Jesse defeats an enemy: Gains 3 Momentum. If Jesse has 10 or more Momentum: Gains Critical Damage Up (2 Turns).', ['passive_boost', 'Momentum', 'Critical Damage Up'], [])
    ],
    '501st',
    8300,
    'Pure offense and assist follow-up',
    { speed: 138, offense: 3500 }
  ),

  createCharacter(
    'echo_501st',
    'Echo (501st)',
    'Support / Strategist',
    ['Galactic Republic', 'Clone Trooper', '501st'],
    'Sustains the 501st by shortening cooldowns and supplying substantial turn meter and buffs.',
    [
      makeAbility('echo_basic', 'CT-1409 Combat Analysis', 'basic', 0, 'Deal Physical Damage. Gain Momentum. Target ally gains 5% TM.', ['damage', 'Momentum', 'turn_meter_gain'], ['offensive']),
      makeAbility('echo_special_1', 'Scomp-Link Override', 'special', 3, 'Target ally gains Offense Up (2 Turns) and Speed Up (2 Turns). Echo gains 2 Momentum. If Echo has 5 or more Momentum, consumes 5 and reduces target ally\'s cooldowns by 1.', ['buff_ally', 'Offense Up', 'Speed Up', 'Momentum', 'cooldown_reduction'], ['defensive', 'buff']),
      makeAbility('echo_special_2', 'Tactical Computation Matrix', 'special', 4, 'All allies gain 10% TM. Echo gains 3 Momentum. If Echo has 5 or more Momentum, consumes 5 and all allies recover 15% Protection.', ['buff_all', 'turn_meter_gain', 'Momentum', 'protection_recovery'], ['offensive', 'buff']),
      makeAbility('echo_unique', 'Living Databank', 'unique', 0, 'Whenever 501st ally uses Special, Echo gains Momentum. Whenever Echo gains Momentum, gains +2% Potency (Stacking). If Echo has 10 or more Momentum, allies gain +5% TM from Echo\'s abilities. Whenever a Leader ally recovers from Fatigued: Echo gains Bonus Turn.', ['passive_boost', 'Momentum', 'bonus_turn'], [])
    ],
    '501st',
    8400,
    'Sustained combat support and synchronization',
    { speed: 135 }
  ),

  createCharacter(
    'fives',
    'Fives',
    'Tank / Attacker',
    ['Galactic Republic', 'Clone Trooper', '501st'],
    'High-defense clone tank who counterattacks, taunts, and sacrifices himself to protect squad members.',
    [
      makeAbility('fives_basic', 'Twin DC-17 Barrage', 'basic', 0, 'Attack twice. Gain Momentum. If Fives has 5 or more Momentum, consumes 5 and recovers 5% Protection.', ['damage', 'double_strike', 'Momentum', 'protection_recovery'], ['offensive']),
      makeAbility('fives_special_1', 'Protective Instinct', 'special', 3, 'Gain Taunt (2 Turns), Defense Up (2 Turns), and 2 Momentum. If Fives has 10 or more Momentum, consumes 10 and recovers 20% Protection.', ['taunt', 'Defense Up', 'Momentum', 'protection_recovery'], ['defensive']),
      makeAbility('fives_special_2', 'Hold The Line Brother', 'special', 4, 'All allies gain Defense Up (2 Turns). Fives gains Taunt (2 Turns). If Fives has 5 or more Momentum, consumes 5 and all allies gain Protection Up (20%).', ['buff_all', 'Defense Up', 'taunt', 'Momentum', 'Protection Up'], ['offensive', 'debuff']),
      makeAbility('fives_unique', 'Unbreakable Resolve', 'unique', 0, 'Whenever another 501st ally takes damage: Gain Momentum. Whenever another 501st ally falls below 50% Integrity: Gain Momentum (2 Stacks). If Fives has 10 or more Momentum: Counterattack Chance is increased by 50%. Whenever Fives counterattacks: Recover 3% Protection.', ['passive_boost', 'Momentum', 'protection_recovery'], [])
    ],
    '501st',
    8600,
    'Frontline defensive tank',
    { speed: 124, hp: 55000, protection: 50000, defense: 65 }
  ),

  createCharacter(
    'appo_501st',
    'Appo (501st Lieutenant)',
    'Attacker / Strategist',
    ['Galactic Republic', 'Clone Trooper', '501st'],
    'Coordinates with Anakin Skywalker and advances Clone combat momentum.',
    [
      makeAbility('appo_basic', 'Lieutenant\'s Fire', 'basic', 0, 'Deal Physical Damage. Gain Momentum. Weakest ally recovers 5% Protection.', ['damage', 'Momentum', 'protection_recovery'], ['offensive']),
      makeAbility('appo_special_1', 'Forward Formation', 'special', 3, 'Target ally gains Offense Up (2 Turns), Speed Up (2 Turns). Appo gains 2 Momentum. If Appo has 5 or more Momentum, consumes 5 and target ally gains 15% TM.', ['buff_ally', 'Offense Up', 'Speed Up', 'Momentum', 'turn_meter_gain'], ['assist', 'offensive']),
      makeAbility('appo_special_2', 'Advance Under Cover', 'special', 4, 'All 501st allies gain Defense Up (2 Turns). Appo gains 3 Momentum. If Appo has 10 or more Momentum, consumes 10 and all allies recover 15% Protection.', ['buff_all', 'Defense Up', 'Momentum', 'protection_recovery'], ['offensive', 'debuff']),
      makeAbility('appo_unique', 'Right Hand of the General', 'unique', 0, 'Whenever another 501st ally uses Special, Appo gains Momentum. Whenever Appo gains Momentum: Gains +2% Offense (Stacking). If Leader ally becomes Fatigued: Appo gains Bonus Turn.', ['passive_boost', 'Momentum', 'bonus_turn'], [])
    ],
    '501st',
    8200,
    'Coordinated assist pressure',
    { speed: 132 }
  ),

  createCharacter(
    'general_skywalker',
    'General Skywalker',
    'Leader / Attacker / Strategist',
    ['Galactic Republic', 'Jedi', '501st', 'Journey Character'],
    'Legendary General who commands 501st squads, generating massive assist sweeps and turning defeats into rage-filled retribution.',
    [
      makeAbility('anakin_basic', 'Djem So Assault', 'basic', 0, 'Deal Physical Damage. Gain Momentum. If General Skywalker has 5 or more Momentum, gains Offense Up (1 Turn).', ['damage', 'Momentum', 'Offense Up'], ['offensive']),
      makeAbility('anakin_special_1', 'Hero With No Fear', 'special', 3, 'Deal Physical Damage. Gain Momentum (2 Stacks). If General Skywalker has 5 or more Momentum, consumes 5 and attacks again for 100% damage.', ['damage', 'Momentum'], ['offensive']),
      makeAbility('anakin_special_2', 'The Chosen One\'s Fury', 'special', 4, 'Deal Physical Damage to all enemies. General Skywalker gains 3 Momentum. If General Skywalker has 10 or more Momentum, consumes 10 and inflicts Armor Shred (2 Turns) on all enemies.', ['damage_aoe', 'Momentum', 'Armor Shred'], ['offensive']),
      makeAbility('anakin_leader', 'General Of The 501st', 'leader', 0, 'At start of battle, General Skywalker gains Pathfinder. All other 501st allies gain Momentum (1 Stack). Whenever a 501st ally uses a Special, they gain 1 Momentum. Whenever a 501st ally gains Momentum, they gain 2% TM.', ['buff_faction', 'Pathfinder', 'Momentum', 'turn_meter_gain'], []),
      makeAbility('anakin_unique', 'Hero of the Republic', 'unique', 0, 'Immune to Ability Block. Whenever another 501st ally gains Momentum, General Skywalker gains Momentum. Whenever General Skywalker recovers from Fatigued, gains Offense Up (2 Turns). If General Skywalker has 10 or more Momentum, gains +25% Defense.', ['passive_boost', 'Momentum', 'Defense Up', 'Offense Up'], [])
    ],
    '501st',
    9500,
    'Unstoppable squad momentum and counterattacks',
    { speed: 142, hp: 50000, protection: 40000, offense: 3800 }
  ),

  // --- 212th Faction ---
  createCharacter(
    'commander_cody',
    'Commander Cody',
    'Leader / Strategist / Attacker',
    ['Galactic Republic', 'Clone Trooper', '212th'],
    'Lead strategist and tactical damage-dealer who coordinates devastating 212th combined arms maneuvers.',
    [
      makeAbility('cody_basic', 'Coordinated Volley', 'basic', 0, 'Deal Physical Damage. Call another random 212th ally to Assist.', ['damage', 'assist'], ['offensive']),
      makeAbility('cody_special_1', 'Forward Recon', 'special', 3, 'Target ally gains Offense Up (2 turns) and Speed Up (2 turns). Gain 1 stack of Combined Arms.', ['buff_ally', 'Combined Arms'], ['offensive']),
      makeAbility('cody_special_2', 'Airborne Deployment', 'special', 4, 'All 212th allies gain Defense Up (2 turns) and Tenacity Up (2 turns). Gain 1 stack of Combined Arms.', ['buff_all', 'Combined Arms'], ['defensive']),
      makeAbility('cody_leader', 'Attack Battalion Commander', 'leader', 0, '212th allies gain: 25 Speed, 20% Max Health. Whenever a 212th ally uses a Special Ability: Gain 1 stack of Combined Arms.', ['buff_faction'], []),
      makeAbility('cody_unique', 'Combined Arms Doctrine', 'unique', 0, '212th allies gain access to: Combined Arms Assault. Whenever Combined Arms Assault is used: All 212th allies recover 5% Protection. Whenever a support asset is called: Commander Cody gains 10% Turn Meter.', ['Combined Arms'], []),
      makeAbility('combined_arms_assault_cody', 'Combined Arms Assault', 'special', 2, 'Effects depend on current Combined Arms stacks:\n- 0 Stacks: Coordinated Fire: Call target ally to Assist.\n- 1 Stack: Squad Advance: Call all other 212th allies to Assist dealing 50% reduced damage. Remove 1 Combined Arms stack.\n- 2 Stacks: Artillery Barrage: Deal Special Damage to all enemies. Inflict: Defense Down (2 turns). Remove 2 Combined Arms stacks.\n- 3 Stacks: LAAT Gunship Strike: Deal massive Physical Damage to all enemies. Ignore Taunt. Inflict: Daze (2 turns), Offense Down (2 turns). Remove all Combined Arms stacks.', ['damage_aoe', 'assist', 'Combined Arms'], ['offensive'])
    ],
    '212th',
    8300,
    'Combined arms coordinator and leader',
    { speed: 134, hp: 44000, protection: 36000 }
  ),

  createCharacter(
    'waxer',
    'Waxer',
    'Saboteur / Support',
    ['Galactic Republic', 'Clone Trooper', '212th'],
    'Resourceful skirmisher who dispels debuffs and recovers allied protection under pressure.',
    [
      makeAbility('waxer_basic', 'Covering Fire', 'basic', 0, 'Deal Physical Damage. Target ally recovers 5% Protection.', ['damage', 'protection_recovery'], ['offensive', 'heal']),
      makeAbility('waxer_special_1', 'Civilian Escort', 'special', 3, 'Target ally gains Defense Up (2 turns) and Protection Up (20%). Gain 1 stack of Combined Arms.', ['buff_ally', 'Combined Arms'], ['defensive']),
      makeAbility('waxer_special_2', 'Secure The Position', 'special', 4, 'Dispel all debuffs from target ally. Target ally gains Tenacity Up (2 turns). Gain 1 stack of Combined Arms.', ['cleanse', 'buff_ally', 'Combined Arms'], ['defensive']),
      makeAbility('waxer_unique', 'Looking Out For The Little Guy', 'unique', 0, 'Whenever allies lose Protection: Recover 5% Protection. Whenever Combined Arms Assault is used: Random ally recovers 10% Protection.', [], []),
      makeAbility('combined_arms_assault_waxer', 'Combined Arms Assault', 'special', 2, 'Effects depend on current Combined Arms stacks:\n- 0 Stacks: Coordinated Fire: Call target ally to Assist.\n- 1 Stack: Squad Advance: Call all other 212th allies to Assist dealing 50% reduced damage. Remove 1 Combined Arms stack.\n- 2 Stacks: Artillery Barrage: Deal Special Damage to all enemies. Inflict: Defense Down (2 turns). Remove 2 Combined Arms stacks.\n- 3 Stacks: LAAT Gunship Strike: Deal massive Physical Damage to all enemies. Ignore Taunt. Inflict: Daze (2 turns), Offense Down (2 turns). Remove all Combined Arms stacks.', ['damage_aoe', 'assist', 'Combined Arms'], ['offensive'])
    ],
    '212th',
    8000,
    'Sustained defensive support',
    { speed: 136, offense: 3000 }
  ),

  createCharacter(
    'boiler',
    'Boiler',
    'Attacker / Support',
    ['Galactic Republic', 'Clone Trooper', '212th'],
    'Relentless attacker who advances the line alongside Waxer and gains power from combined assaults.',
    [
      makeAbility('boiler_basic', 'Battalion Rifle', 'basic', 0, 'Deal Physical Damage. Gain Offense Up (1 turn).', ['damage', 'buff_self'], ['offensive']),
      makeAbility('boiler_special_1', 'Forward Push', 'special', 3, 'Deal Physical Damage. Call Waxer to Assist if present. Gain 1 stack of Combined Arms.', ['damage', 'assist', 'Combined Arms'], ['offensive']),
      makeAbility('boiler_special_2', 'Breach The Line', 'special', 4, 'Deal Physical Damage to all enemies. Enemies with debuffs take bonus damage. Gain 1 stack of Combined Arms.', ['damage_aoe', 'Combined Arms'], ['offensive']),
      makeAbility('boiler_unique', 'Brothers In Battle', 'unique', 0, 'Whenever Waxer takes damage: Boiler gains 10% Turn Meter. Whenever Boiler attacks: Waxer recovers 5% Protection. Whenever Combined Arms Assault is used: Gain Offense Up (2 turns).', [], []),
      makeAbility('combined_arms_assault_boiler', 'Combined Arms Assault', 'special', 2, 'Effects depend on current Combined Arms stacks:\n- 0 Stacks: Coordinated Fire: Call target ally to Assist.\n- 1 Stack: Squad Advance: Call all other 212th allies to Assist dealing 50% reduced damage. Remove 1 Combined Arms stack.\n- 2 Stacks: Artillery Barrage: Deal Special Damage to all enemies. Inflict: Defense Down (2 turns). Remove 2 Combined Arms stacks.\n- 3 Stacks: LAAT Gunship Strike: Deal massive Physical Damage to all enemies. Ignore Taunt. Inflict: Daze (2 turns), Offense Down (2 turns). Remove all Combined Arms stacks.', ['damage_aoe', 'assist', 'Combined Arms'], ['offensive'])
    ],
    '212th',
    8000,
    'Self-boosting assistant attacker',
    { speed: 132 }
  ),

  createCharacter(
    'clone_trooper_212th',
    '212th Clone Trooper',
    'Tank',
    ['Galactic Republic', 'Clone Trooper', '212th'],
    'Frontline defensive wall who taunts and shields 212th troopers and General Kenobi.',
    [
      makeAbility('trooper_basic', 'Defensive Position', 'basic', 0, 'Deal Physical Damage. Gain Defense Up (1 turn).', ['damage', 'buff_self', 'Defense Up'], ['defensive']),
      makeAbility('trooper_special_1', 'Hold The Line', 'special', 3, 'Gain Taunt (2 turns) and Defense Up (2 turns). Recover 15% Protection.', ['taunt', 'buff_self', 'protection_recovery'], ['defensive']),
      makeAbility('trooper_special_2', 'Forward Shield Wall', 'special', 4, 'All allies gain Protection Up (20%). Gain 1 stack of Combined Arms.', ['buff_all', 'Combined Arms'], ['defensive']),
      makeAbility('trooper_unique', 'Battalion Bulwark', 'unique', 0, 'Whenever another 212th ally falls below 50% Health: Gain Taunt (1 turn). Whenever General Kenobi has Negotiator: Recover 10% Protection.', [], []),
      makeAbility('combined_arms_assault_trooper', 'Combined Arms Assault', 'special', 2, 'Effects depend on current Combined Arms stacks:\n- 0 Stacks: Coordinated Fire: Call target ally to Assist.\n- 1 Stack: Squad Advance: Call all other 212th allies to Assist dealing 50% reduced damage. Remove 1 Combined Arms stack.\n- 2 Stacks: Artillery Barrage: Deal Special Damage to all enemies. Inflict: Defense Down (2 turns). Remove 2 Combined Arms stacks.\n- 3 Stacks: LAAT Gunship Strike: Deal massive Physical Damage to all enemies. Ignore Taunt. Inflict: Daze (2 turns), Offense Down (2 turns). Remove all Combined Arms stacks.', ['damage_aoe', 'assist', 'Combined Arms'], ['offensive'])
    ],
    '212th',
    8100,
    'Sustained block-tank',
    { hp: 52000, protection: 44000, defense: 60 }
  ),

  createCharacter(
    'aerial_trooper_212th',
    '212th Jet Trooper',
    'Saboteur / Attacker',
    ['Galactic Republic', '212th', 'Clone Trooper'],
    'Highly mobile jetpack skirmisher who flies past Taunt and converts Combined Arms into immediate extra actions.',
    [
      makeAbility('aerial_basic', 'Aerial Assault', 'basic', 0, 'Deal Physical Damage. Ignore Taunt.', ['damage'], ['offensive']),
      makeAbility('aerial_special_1', 'Jetpack Flanking Maneuver', 'special', 3, 'Deal Physical Damage. Ignore Taunt. Inflict Defense Down (2 turns). Gain 25% Turn Meter.', ['damage', 'debuff', 'Defense Down'], ['offensive']),
      makeAbility('aerial_special_2', 'Gunship Drop', 'special', 4, 'Deal Physical Damage to all enemies. Enemies with debuffs take bonus damage. Gain 1 stack of Combined Arms.', ['damage_aoe', 'Combined Arms'], ['offensive']),
      makeAbility('aerial_unique', 'Airborne Specialist', 'unique', 0, 'Whenever an enemy gains Taunt: Gain 15% Turn Meter. Whenever attacking an enemy that did not have Taunt at the start of turn: Deal bonus damage. Whenever Combined Arms Assault is used: Gain Bonus Turn.', [], []),
      makeAbility('combined_arms_assault_aerial', 'Combined Arms Assault', 'special', 2, 'Effects depend on current Combined Arms stacks:\n- 0 Stacks: Coordinated Fire: Call target ally to Assist.\n- 1 Stack: Squad Advance: Call all other 212th allies to Assist dealing 50% reduced damage. Remove 1 Combined Arms stack.\n- 2 Stacks: Artillery Barrage: Deal Special Damage to all enemies. Inflict: Defense Down (2 turns). Remove 2 Combined Arms stacks.\n- 3 Stacks: LAAT Gunship Strike: Deal massive Physical Damage to all enemies. Ignore Taunt. Inflict: Daze (2 turns), Offense Down (2 turns). Remove all Combined Arms stacks.', ['damage_aoe', 'assist', 'Combined Arms'], ['offensive'])
    ],
    '212th',
    8000,
    'High mobility flanker',
    { speed: 140 }
  ),

  // --- Bad Batch Team ---
  createCharacter(
    'hunter',
    'Hunter',
    'Leader / Attacker / Strategist',
    ['Galactic Republic', 'Clone Trooper', 'Bad Batch', '99'],
    'Leader of Clone Force 99 with Hypervigilance Disorder. Tracks targets through stealth, coordinates full squad assists, and gains bonus turns when teammates are critical.',
    [
      makeAbility('hunter_b', 'Tracking Shot', 'basic', 0, 'Deal Physical Damage. Ignore Stealth. If target is debuffed: Call a random Bad Batch ally to Assist.', ['damage', 'ignore_stealth', 'assist'], ['offensive']),
      makeAbility('hunter_s1', 'Eyes Up', 'special', 3, 'All Bad Batch allies gain Critical Chance Up (2 turns) and Tenacity Up (2 turns). Hunter gains Foresight (2 turns).', ['Critical Chance Up', 'Tenacity Up', 'Foresight'], ['defensive']),
      makeAbility('hunter_s2', 'Squad Coordination', 'special', 4, 'Call all Bad Batch allies to Assist dealing 50% reduced damage. Hunter gains Advantage (2 turns).', ['assist_all', 'Advantage'], ['offensive']),
      makeAbility('hunter_l', 'Sergeant Of Clone Force 99', 'leader', 0, 'Bad Batch allies gain +25 Speed, +20% Max Health, and +20% Offense. Whenever a Bad Batch ally uses a Special Ability: All Bad Batch allies recover 3% Health and Protection.', ['leader', 'speed', 'heal_faction', 'protection_recovery'], []),
      makeAbility('hunter_u', 'Enhanced Senses', 'unique', 0, 'At battle start: Gain Hypervigilance Disorder. Whenever Hunter evades an attack: Gain 10% Turn Meter. Whenever a Bad Batch ally falls below 50% Health: Hunter gains Bonus Turn.', ['unique', 'Hypervigilance Disorder', 'turn_meter_gain', 'bonus_turn'], [])
    ],
    'Bad Batch',
    8700,
    'Tactical precision and stealth control',
    { speed: 144, hp: 46000, protection: 37000 }
  ),

  createCharacter(
    'wrecker',
    'Wrecker',
    'Tank / Attacker',
    ['Galactic Republic', 'Clone Trooper', 'Bad Batch'],
    'Living demolition expert whose Impulse Control Disorder boosts Offense and Max Health, taunts, and dazes enemies.',
    [
      makeAbility('wrecker_b', 'Headfirst Assault', 'basic', 0, 'Deal Physical Damage. 20% chance to Stun target for 1 turn.', ['damage', 'Stun'], ['offensive']),
      makeAbility('wrecker_s1', 'Demolition Expert', 'special', 3, 'Deal Physical Damage to all enemies. Inflict Defense Down (2 turns).', ['damage_aoe', 'Defense Down'], ['offensive']),
      makeAbility('wrecker_s2', 'Bring The Wall Down', 'special', 4, 'Gain Taunt (2 turns) and Defense Up (2 turns). Recover 20% Health.', ['taunt', 'Defense Up', 'heal'], ['defensive']),
      makeAbility('wrecker_u', 'I Like Explosions', 'unique', 0, 'At battle start: Gain Impulse Control Disorder. Whenever Wrecker takes damage: Gain 5% Turn Meter. Whenever Wrecker is defeated: All Bad Batch allies gain Offense Up (2 turns).', ['unique', 'Impulse Control Disorder', 'turn_meter_gain', 'buff_on_defeat'], [])
    ],
    'Bad Batch',
    8500,
    'Impulsive heavy linebreaking tank',
    { speed: 118, hp: 60000, protection: 50000, defense: 58 }
  ),

  createCharacter(
    'tech_bb',
    'Tech',
    'Support / Strategist',
    ['Galactic Republic', 'Clone Trooper', 'Bad Batch'],
    'Brilliant analyst with Obsessive Analysis Disorder who dispels buffs, blocks abilities, and facilitates foresight.',
    [
      makeAbility('tech_b', 'Data Driven Assault', 'basic', 0, 'Deal Special Damage. Inflict Vulnerable (1 turn).', ['damage', 'Vulnerable'], ['offensive']),
      makeAbility('tech_s1', 'Combat Calculations', 'special', 3, 'Dispel all buffs from target enemy. Inflict Ability Block (1 turn). Reduce cooldowns of a random Bad Batch ally by 1.', ['dispel', 'Ability Block', 'cooldown_reduction'], ['offensive']),
      makeAbility('tech_s2', 'Predictive Modeling', 'special', 4, 'All Bad Batch allies gain Foresight (2 turns) and Critical Chance Up (2 turns). Tech gains Bonus Turn.', ['Foresight', 'Critical Chance Up', 'bonus_turn'], ['defensive']),
      makeAbility('tech_u', "It's Not Guesswork", 'unique', 0, 'At battle start: Gain Obsessive Analysis Disorder. Whenever a Bad Batch ally attacks out of turn: Tech gains 5% Turn Meter. Whenever an enemy is defeated: Reduce Tech\'s cooldowns by 1.', ['unique', 'Obsessive Analysis Disorder', 'turn_meter_gain', 'cooldown_reduction'], [])
    ],
    'Bad Batch',
    8400,
    'Obsessive analysis and tactical calculations',
    { speed: 139, hp: 44000, protection: 36000 }
  ),

  createCharacter(
    'echo_bb',
    'Echo',
    'Support / Saboteur',
    ['Galactic Republic', 'Clone Trooper', 'Bad Batch', '99'],
    'Scomp-link saboteur with Identity Disorder who dispels all enemy buffs, inflicts Buff Immunity, and shields allies.',
    [
      makeAbility('echo_bb_b', 'Cybernetic Strike', 'basic', 0, 'Deal Physical Damage. Inflict Buff Immunity (1 turn).', ['damage', 'Buff Immunity'], ['offensive']),
      makeAbility('echo_bb_s1', 'Scomp Link Intrusion', 'special', 3, 'Dispel all buffs from all enemies. Inflict Tenacity Down (2 turns).', ['dispel_all', 'Tenacity Down'], ['offensive']),
      makeAbility('echo_bb_s2', 'Republic Network Access', 'special', 4, 'All Bad Batch allies gain Potency Up (2 turns) and Tenacity Up (2 turns). Recover 10% Health and Protection.', ['Potency Up', 'Tenacity Up', 'heal', 'protection_recovery'], ['defensive']),
      makeAbility('echo_bb_u', 'More Machine Than Clone', 'unique', 0, 'At battle start: Gain Identity Disorder. Whenever Echo gains a debuff: Recover 5% Health. Whenever Echo resists a debuff: Gain 5% Turn Meter.', ['unique', 'Identity Disorder', 'heal', 'turn_meter_gain'], [])
    ],
    'Bad Batch',
    8400,
    'Identity-shifted cybernetic disruptor',
    { speed: 137, hp: 45000, protection: 38000 }
  ),

  createCharacter(
    'crosshair_bb',
    'Crosshair',
    'Attacker / Saboteur',
    ['Galactic Republic', 'Clone Trooper', 'Bad Batch', 'Journey Character'],
    'Lethal sniper with Paranoia Disorder who focuses on Marked targets, ignoring Taunt and Protection to deliver devastating stuns.',
    [
      makeAbility('cross_b', 'Deadeye Shot', 'basic', 0, 'Deal Physical Damage. Inflict Marked (2 turns).', ['damage', 'Marked'], ['offensive']),
      makeAbility('cross_s1', 'Find The Weak Point', 'special', 3, 'Deal Physical Damage. Ignore Taunt. If target is Marked: Attack again.', ['damage', 'ignore_taunt', 'double_strike'], ['offensive']),
      makeAbility('cross_s2', 'Imperial Training', 'special', 4, 'Deal Physical Damage to target enemy. Ignore Protection. If target is Marked: Stun (1 turn), Healing Immunity (2 turns).', ['damage', 'ignore_protection', 'Stun', 'Healing Immunity'], ['offensive']),
      makeAbility('cross_l', 'Lone Survivor', 'leader', 0, 'Bad Batch allies gain +30% Critical Damage and +20 Speed. Whenever a Bad Batch ally attacks a Marked enemy: Recover 5% Health. Whenever a Marked enemy is defeated: Bad Batch allies gain 10% Turn Meter.', ['leader', 'Critical Damage Up', 'speed', 'heal_faction', 'turn_meter_gain'], []),
      makeAbility('cross_u', 'Crosshair', 'unique', 0, 'At battle start: Gain Paranoia Disorder. The first enemy damaged by Crosshair each battle gains Marked. Whenever Crosshair attacks a Marked enemy: Gain 5% Offense (stacking). Whenever a Marked enemy is defeated: Gain Bonus Turn. Whenever Crosshair is the last active Bad Batch ally: Gain Critical Chance Up, Critical Damage Up, and Offense Up until the end of battle.', ['unique', 'Paranoia Disorder', 'Marked', 'offense_stacking', 'bonus_turn', 'last_stand'], [])
    ],
    'Bad Batch',
    13500,
    'Paranoid elite sharpshooter',
    { speed: 133, hp: 43000, protection: 35000, offense: 4100, critChance: 0.45 }
  ),

  createCharacter(
    'omega',
    'Omega',
    'Support',
    ['Galactic Republic', 'Clone Trooper', 'Bad Batch'],
    'The heart of Clone Force 99 with Attachment Disorder who heals allies, dispels debuffs, and remains safely untargetable.',
    [
      makeAbility('omega_b', 'Lucky Shot', 'basic', 0, 'Deal Physical Damage. Target ally recovers 5% Health.', ['damage', 'heal'], ['offensive']),
      makeAbility('omega_s1', "Don't Leave Me Behind", 'special', 3, 'Target ally recovers 20% Health and 20% Protection. Dispel all debuffs from target ally.', ['heal', 'protection_recovery', 'dispel'], ['defensive']),
      makeAbility('omega_s2', 'Clone Force 99', 'special', 4, 'All Bad Batch allies gain Offense Up (2 turns) and Speed Up (2 turns). Omega gains Stealth (2 turns).', ['Offense Up', 'Speed Up', 'Stealth'], ['defensive']),
      makeAbility('omega_u', 'The Heart Of The Squad', 'unique', 0, 'At start of battle: Gain Attachment Disorder. Whenever a Bad Batch ally uses a Special Ability: Omega gains 5% Turn Meter. Whenever Omega takes a turn: Random Bad Batch ally recovers 5% Health.', ['unique', 'Attachment Disorder', 'turn_meter_gain', 'heal'], [])
    ],
    'Bad Batch',
    8100,
    'Empathetic attachment healer',
    { speed: 128, hp: 42000, protection: 35000 }
  ),

  createCharacter(
    'batcher',
    'Batcher',
    'Attacker / Support',
    ['Galactic Republic', 'Bad Batch'],
    'Faithful lurca hound companion with No Disorder who assists Omega, taunts to protect the pack, and pounces with dazing strikes.',
    [
      makeAbility('batcher_b', 'Tracking Bite', 'basic', 0, 'Deal Physical Damage. Inflict Vulnerable (1 turn). If target is Marked: Attack again.', ['damage', 'Vulnerable', 'double_strike'], ['offensive']),
      makeAbility('batcher_s1', 'Lurca Pounce', 'special', 3, 'Deal Physical Damage. Ignore Taunt. Inflict Daze (2 turns). Gain 25% Turn Meter.', ['damage', 'ignore_taunt', 'Daze', 'turn_meter_gain'], ['offensive']),
      makeAbility('batcher_s2', 'Protect The Pack', 'special', 4, 'All Bad Batch allies recover 15% Health. Gain Tenacity Up (2 turns). Omega gains Stealth (2 turns). If Omega is present: Batcher gains Taunt (2 turns).', ['heal', 'Tenacity Up', 'Stealth', 'Taunt'], ['defensive']),
      makeAbility('batcher_u', 'Faithful Companion', 'unique', 0, 'At battle start: Gain No Disorder. Whenever Omega uses a Special Ability: Batcher Assists. Whenever a Bad Batch ally falls below 50% Health: Batcher gains Bonus Turn. Whenever Batcher defeats an enemy: All Bad Batch allies recover 10% Health.', ['unique', 'No Disorder', 'assist', 'bonus_turn', 'heal_faction'], [])
    ],
    'Bad Batch',
    8000,
    'Loyal lupine guardian companion',
    { speed: 130, hp: 50000, protection: 40000, defense: 45 }
  )
];