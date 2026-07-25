import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const EXPANSION_UNITS: Character[] = [
  // --- Missing Existing Units ---
  createCharacter(
    'yoda',
    'Grand Master Yoda',
    'Support',
    ['Galactic Republic', 'Jedi', 'Jedi High Council'],
    'Powerful Jedi Master.',
    [makeAbility('yoda_basic', 'Ataru Strike', 'basic', 0, 'Deal Physical Damage. Gain Turn Meter.', ['damage'], ['offensive'])],
    'Jedi',
    11000,
    'Spreads buffs',
    { speed: 160, hp: 50000, protection: 45000, defense: 45 }
  ),
  createCharacter(
    'jedi_knight',
    'Jedi Knight',
    'Tank',
    ['Galactic Republic', 'Jedi'],
    'Temple Guardian.',
    [makeAbility('jk_basic', 'Defensive Strike', 'basic', 0, 'Deal Physical Damage. Gain Defense Up.', ['damage', 'Defense Up'], ['offensive'])],
    'Jedi',
    6000,
    'Standard Jedi',
    { speed: 125, hp: 55000, protection: 50000, defense: 55 }
  ),
  createCharacter(
    'asajj_ventress',
    'Asajj Ventress',
    'Attacker',
    ['Separatist', 'Nightsister', 'Sith'],
    'Deadly assassin.',
    [makeAbility('asajj_basic', 'Cruel Strike', 'basic', 0, 'Deal Physical Damage.', ['damage'], ['offensive'])],
    'Separatist',
    8500,
    'Strikes hard',
    { speed: 145, hp: 45000, protection: 40000, defense: 45 }
  ),

  // --- Rogue One Faction ---
  createCharacter(
    'jyn_erso',
    'Jyn Erso',
    'Leader / Attacker',
    ['Rebel', 'Rogue One'],
    'Rallies hopeless fighters into impossible victories.',
    [
      makeAbility('jyn_b', 'Rebel Shot', 'basic', 0, 'Deal Physical Damage.', ['damage'], ['offensive']),
      makeAbility('jyn_s1', 'Inspire Rebellion', 'special', 3, 'Rogue One allies gain Offense Up (2 turns) and Speed Up (2 turns).', ['buff_all', 'Speed Up', 'Offense Up'], ['defensive']),
      makeAbility('jyn_s2', 'Desperate Assault', 'special', 4, 'Attack all enemies. Deal Physical Damage. Deal bonus damage for each defeated ally.', ['damage_aoe'], ['offensive']),
      makeAbility('jyn_l', 'Rebellions Are Built on Hope', 'leader', 0, 'Rogue One allies gain +25 Speed, +20% Critical Damage. Rogue One allies fall below 50% Health -> gain 5% Turn Meter.', ['leader'], []),
      makeAbility('jyn_u', 'Survivor’s Resolve', 'unique', 0, 'Whenever allies are defeated: Jyn gains Offense Up. Rogue One allies critically hit -> Jyn gains 3% Turn Meter.', ['unique', 'Offense Up'], [])
    ],
    'Rogue One',
    9500,
    'Inspires Hope',
    { speed: 155, hp: 50000, protection: 45000, defense: 45 }
  ),
  createCharacter(
    'cassian_andor',
    'Cassian Andor',
    'Strategist / Saboteur',
    ['Rebel', 'Rogue One'],
    'Specializes in covert operations and coordinated strikes.',
    [
      makeAbility('cas_b', 'Precision Fire', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Defense Down.', ['damage', 'Defense Down'], ['offensive']),
      makeAbility('cas_s1', 'Rebel Intel', 'special', 3, 'Rogue One allies gain Critical Chance Up. Reveal all Stealthed enemies.', ['buff_all', 'Stealth', 'Critical Chance Up'], ['defensive']),
      makeAbility('cas_s2', 'Tactical Strike', 'special', 4, 'Cassian and random Rogue One ally attack target enemy.', ['assist'], ['offensive']),
      makeAbility('cas_u', 'Intelligence Operative', 'unique', 0, 'Enemies gain buffs -> gain Turn Meter. Rogue One allies assist -> recover Protection.', ['unique'], [])
    ],
    'Rogue One',
    8500,
    'Intel Operative',
    { speed: 140, hp: 45000, protection: 40000, defense: 40 }
  ),
  createCharacter(
    'k2so',
    'K2-SO',
    'Tank / Support',
    ['Droid', 'Rebel', 'Rogue One'],
    'Reprogrammed Imperial security droid.',
    [
      makeAbility('k2_b', 'Heavy Slam', 'basic', 0, 'Deal Physical Damage. 30% chance to inflict Daze.', ['damage', 'daze', 'Daze'], ['offensive']),
      makeAbility('k2_s1', 'Protective Override', 'special', 3, 'Gain Taunt (2 turns) and Defense Up (2 turns).', ['taunt', 'buff_self', 'Defense Up', 'Taunt'], ['defensive']),
      makeAbility('k2_s2', 'Blunt Force Logic', 'special', 4, 'AoE Physical Damage. Enemies lose 5% Turn Meter.', ['damage_aoe', 'turn_meter_reduction'], ['offensive']),
      makeAbility('k2_u', 'Reprogrammed Loyalty', 'unique', 0, 'Rogue One allies fall below 50% Health -> K2-SO gains Taunt. K2-SO is damaged -> Rogue One allies recover Protection.', ['unique', 'Taunt'], [])
    ],
    'Rogue One',
    9000,
    'Protective Reprogram',
    { speed: 115, hp: 65000, protection: 65000, defense: 65 }
  ),
  createCharacter(
    'chirrut_imwe',
    'Chirrut Îmwe',
    'Support / Strategist',
    ['Rebel', 'Rogue One'],
    'Fights with unwavering faith.',
    [
      makeAbility('chir_b', 'Staff Strike', 'basic', 0, 'Deal Physical Damage.', ['damage'], ['offensive']),
      makeAbility('chir_s1', 'I Am One With the Force', 'special', 3, 'Rogue One allies gain Tenacity Up and Foresight.', ['buff_all', 'Tenacity Up', 'Foresight'], ['defensive']),
      makeAbility('chir_s2', 'Faithful Advance', 'special', 4, 'Rogue One allies recover 15% Health and 10% Protection.', ['heal_all'], ['defensive']),
      makeAbility('chir_u', 'Guardian of the Whills', 'unique', 0, 'Whenever allies evade -> Chirrut gains 5% TM. Rogue One allies gain buffs -> recover Health.', ['unique'], [])
    ],
    'Rogue One',
    8500,
    'Blind Faith',
    { speed: 135, hp: 50000, protection: 40000, defense: 45 }
  ),
  createCharacter(
    'baze_malbus',
    'Baze Malbus',
    'Tank / Attacker',
    ['Rebel', 'Rogue One'],
    'Stubborn resilience.',
    [
      makeAbility('baze_b', 'Heavy Repeater Cannon', 'basic', 0, 'Deal Physical Damage.', ['damage'], ['offensive']),
      makeAbility('baze_s1', 'Covering Fire', 'special', 3, 'AoE Physical Damage. Inflict Offense Down.', ['damage_aoe', 'Offense Down'], ['offensive']),
      makeAbility('baze_s2', 'Hold the Line', 'special', 4, 'Gain Taunt, Defense Up, and Retribution (2 turns).', ['taunt', 'buff_self', 'Defense Up', 'Retribution', 'Taunt'], ['defensive']),
      makeAbility('baze_u', 'Last Defender', 'unique', 0, 'Rogue One allies fall below 50% Health -> Baze gains Offense Up. Allies defeated -> Baze recovers Protection.', ['unique', 'Offense Up'], [])
    ],
    'Rogue One',
    9000,
    'Heavy Firepower',
    { speed: 105, hp: 70000, protection: 50000, defense: 60 }
  ),
  createCharacter(
    'admiral_raddus',
    'Admiral Raddus',
    'Leader / Strategist',
    ['Rebel', 'Rogue One', 'Journey Character'],
    'Commanded the Rebel fleet at Scarif.',
    [
      makeAbility('rad_b', 'Fleet Command', 'basic', 0, 'Deal Special Damage.', ['damage'], ['offensive']),
      makeAbility('rad_s1', 'Scarif Coordination', 'special', 3, 'Rogue One allies gain Critical Damage Up and Defense Up.', ['buff_all', 'Defense Up', 'Critical Damage Up'], ['defensive']),
      makeAbility('rad_s2', 'Rebel Fleet Barrage', 'special', 4, 'AoE Special Damage. Enemies lose 10% Turn Meter.', ['damage_aoe', 'turn_meter_reduction'], ['offensive']),
      makeAbility('rad_l', 'Hope at Scarif', 'leader', 0, 'Rogue One allies gain +30 Speed, +25% Max Protection. Allies attack out of turn -> recover Protection.', ['leader'], []),
      makeAbility('rad_u', 'Fleet Admiral', 'unique', 0, 'Rogue One allies gain buffs -> Raddus gains 5% TM. Enemies fall below 50% Health -> Rogue One allies gain TM.', ['unique'], [])
    ],
    'Rogue One',
    14500,
    'Scarif Commander',
    { speed: 140, hp: 55000, protection: 75000, defense: 50 }
  ),

  // --- Death Watch Faction ---
  createCharacter(
    'pre_vizsla',
    'Pre Vizsla',
    'Leader / Attacker',
    ['Mandalorian', 'Death Watch'],
    'Leader of Death Watch.',
    [
      makeAbility('viz_b', 'Darksaber Strike', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Defense Down.', ['damage', 'Defense Down'], ['offensive']),
      makeAbility('viz_s1', 'Mandalorian Assault', 'special', 3, 'Pre Vizsla and all Death Watch allies attack target enemy.', ['assist_all'], ['offensive']),
      makeAbility('viz_s2', 'Jetpack Ambush', 'special', 4, 'AoE Physical Damage. Inflict Daze.', ['damage_aoe', 'daze', 'Daze'], ['offensive']),
      makeAbility('viz_l', 'Rule Through Strength', 'leader', 0, 'Death Watch allies gain +30% Offense, +20 Speed.', ['leader'], []),
      makeAbility('viz_u', 'Wielder of the Darksaber', 'unique', 0, 'Defeat enemies -> gain Bonus Turn. Death Watch assists -> recover Protection.', ['unique'], [])
    ],
    'Death Watch',
    10000,
    'Aggressive Offense',
    { speed: 155, hp: 50000, protection: 45000, defense: 50 }
  ),
  createCharacter(
    'rook_kast',
    'Rook Kast',
    'Saboteur / Attacker',
    ['Mandalorian', 'Death Watch'],
    'Ruthless Death Watch warrior.',
    [
      makeAbility('rook_b', 'Wrist Blade Slash', 'basic', 0, 'Deal Physical Damage. 30% chance to inflict Healing Immunity.', ['damage', 'Healing Immunity'], ['offensive']),
      makeAbility('rook_s1', 'Flamethrower Sweep', 'special', 3, 'AoE Physical Damage. Inflict Burning.', ['damage_aoe', 'Burning'], ['offensive']),
      makeAbility('rook_s2', 'Ambush Strike', 'special', 4, 'Ignore Taunt. Deal massive Physical Damage.', ['damage', 'ignore_taunt', 'Taunt'], ['offensive']),
      makeAbility('rook_u', 'Ruthless Enforcer', 'unique', 0, 'Enemies defeated -> gain Critical Damage Up and 10% TM.', ['unique', 'Critical Damage Up'], [])
    ],
    'Death Watch',
    9000,
    'Relentless',
    { speed: 145, hp: 45000, protection: 45000, defense: 45 }
  ),
  createCharacter(
    'bo_katan_death_watch',
    'Bo-Katan (Death Watch)',
    'Leader / Strategist',
    ['Mandalorian', 'Death Watch'],
    'Hardened extremist warrior.',
    [
      makeAbility('bo_dw_b', 'Twin Blaster Volley', 'basic', 0, 'Deal Physical Damage. Random DW ally gains Crit Chance Up.', ['damage'], ['offensive']),
      makeAbility('bo_dw_s1', 'Nite Owl Advance', 'special', 3, 'Death Watch allies gain Speed Up and Critical Damage Up.', ['buff_all', 'Speed Up', 'Critical Damage Up'], ['defensive']),
      makeAbility('bo_dw_s2', 'Tactical Jetpack Strike', 'special', 4, 'AoE Physical Damage. Enemies lose 5% TM.', ['damage_aoe'], ['offensive']),
      makeAbility('bo_dw_l', 'Ruthless Discipline', 'leader', 0, 'Death Watch allies gain +25 Speed, +20% Critical Chance.', ['leader'], []),
      makeAbility('bo_dw_u', 'Nite Owl Commander', 'unique', 0, 'Allies crit -> gain TM. Enemies gain buffs -> gain Offense Up.', ['unique', 'Offense Up'], [])
    ],
    'Death Watch',
    9500,
    'Nite Owl Advance',
    { speed: 150, hp: 50000, protection: 50000, defense: 45 }
  ),
  createCharacter(
    'dw_raider',
    'Death Watch',
    'Attacker / Saboteur',
    ['Mandalorian', 'Death Watch'],
    'Brutal close-range combatant.',
    [
      makeAbility('dwr_b', 'Vibroblade Rush', 'basic', 0, 'Deal Physical Damage.', ['damage'], ['offensive']),
      makeAbility('dwr_s1', 'Raider Assault', 'special', 3, 'Massive Physical Damage. Attacks again if target has debuffs.', ['damage'], ['offensive']),
      makeAbility('dwr_s2', 'Jetpack Pursuit', 'special', 4, 'Assist Attack from highest Offense DW ally.', ['assist'], ['offensive']),
      makeAbility('dwr_u', 'Relentless Hunter', 'unique', 0, 'Enemies < 50% HP -> Raider gains Offense Up and TM.', ['unique', 'Offense Up'], [])
    ],
    'Death Watch',
    8000,
    'Raider Offense',
    { speed: 140, hp: 45000, protection: 40000, defense: 40 }
  ),

  // --- Wolfpack Faction ---
  createCharacter(
    'commander_wolffe',
    'Commander Wolffe',
    'Leader / Strategist',
    ['Galactic Republic', 'Clone Trooper', 'Wolfpack'],
    'Veteran clone commander who leads the Wolfpack squad with iron resolve, bonus status gains, and defensive counter-heals.',
    [
      makeAbility('wolf_b', 'Tactical Burst', 'basic', 0, 'Deal Physical Damage. Inflict Critical Chance Down (2 turns). If target is Marked, attack again.', ['damage', 'Critical Chance Down', 'Marked'], ['offensive']),
      makeAbility('wolf_s1', 'Wolfpack Formation', 'special', 3, 'All Wolfpack allies gain Defense Up (2 turns), Speed Up (2 turns), and Tenacity Up (2 turns).', ['buff_all', 'Defense Down', 'Speed Up', 'Tenacity Up'], ['defensive']),
      makeAbility('wolf_s2', 'Coordinated Strike', 'special', 4, 'Deal Physical Damage. Call all other Wolfpack allies to Assist dealing 30% reduced damage. If target is Ambushed, dispel all their buffs first.', ['damage', 'dispel', 'assist_all', 'Ambushed'], ['offensive']),
      makeAbility('wolf_l', 'Elite Recon Unit', 'leader', 0, 'Wolfpack allies gain 30% Max Protection, 20 Speed, and +20% Counter Chance. Whenever a Wolfpack ally counterattacks, they recover 5% Protection. Whenever a Marked enemy is damaged, Wolfpack allies gain 2% Turn Meter.', ['leader', 'protection_recovery', 'Counter', 'turn_meter_gain', 'Marked'], []),
      makeAbility('wolf_u', 'Veteran Commander', 'unique', 0, 'Wolffe is immune to Stun and Ability Block. Whenever a Wolfpack ally falls below 50% Health, Wolffe gains a Bonus Turn. Whenever an enemy attacks out of turn, all Wolfpack allies gain 5% Turn Meter.', ['unique', 'Stun_immunity', 'Ability_Block_immunity', 'bonus_turn', 'turn_meter_gain'], [])
    ],
    'Wolfpack',
    9500,
    'Recon Commander',
    { speed: 145, hp: 55000, protection: 50000, defense: 50 }
  ),
  createCharacter(
    'wp_boost',
    'Boost',
    'Attacker / Strategist',
    ['Galactic Republic', 'Clone Trooper', 'Wolfpack'],
    'Frontline tactical coordinator who exploits marked and amubushed targets, calling Wolfpack assists.',
    [
      makeAbility('boost_b', 'Coordinated Burst', 'basic', 0, 'Deal Physical Damage. If target is Marked: Call a random Wolfpack ally to Assist.', ['damage', 'assist', 'Marked'], ['offensive']),
      makeAbility('boost_s1', 'Flanking Route', 'special', 3, 'Deal Physical Damage. Inflict Marked (2 turns). If target is already Marked: Inflict Ambushed (2 turns).', ['damage', 'Marked', 'Ambushed'], ['offensive']),
      makeAbility('boost_s2', 'Box Them In', 'special', 4, 'Deal Physical Damage. Target gains Marked (2 turns). All Wolfpack allies gain Speed Up (2 turns). If target is Ambushed: Call Comet to Assist if present.', ['damage', 'Marked', 'Speed Up', 'assist', 'Ambushed'], ['offensive']),
      makeAbility('boost_u', 'Adaptive Tactics', 'unique', 0, 'Whenever an enemy gains Marked: Gain 5% Turn Meter. Whenever an enemy gains Ambushed: Gain Offense Up (2 turns). Whenever a Wolfpack ally attacks out of turn: Recover 5% Protection.', ['unique', 'turn_meter_gain', 'Offense Up', 'protection_recovery', 'Marked', 'Ambushed'], [])
    ],
    'Wolfpack',
    8000,
    'Coordinated Burst',
    { speed: 135, hp: 45000, protection: 40000, defense: 45 }
  ),
  createCharacter(
    'wp_sinker',
    'Sinker',
    'Tank / Support',
    ['Galactic Republic', 'Clone Trooper', 'Wolfpack'],
    'Heavy front-line guardian who taunts and provides suppressive cover and massive status protection for his team.',
    [
      makeAbility('sinker_b', 'Defensive Volley', 'basic', 0, 'Deal Physical Damage. If target is Marked, all Wolfpack allies gain Defense Up (1 turn).', ['damage', 'Defense Up', 'Marked'], ['offensive']),
      makeAbility('sinker_s1', 'Hold Position', 'special', 3, 'Gain Taunt (2 turns) and Defense Up (2 turns). Sinker recovers 20% Health, and Wolfpack allies recover 10% Protection.', ['taunt', 'buff_self', 'Defense Up', 'Taunt', 'heal', 'protection_recovery'], ['defensive']),
      makeAbility('sinker_s2', 'Suppressive Cover', 'special', 4, 'Deal Physical Damage to all enemies. Inflict Offense Down (2 turns). Marked enemies gain Daze (2 turns).', ['damage_aoe', 'Offense Down', 'Daze', 'Marked'], ['offensive']),
      makeAbility('sinker_u', 'Wolfpack Protector', 'unique', 0, 'Wolfpack allies gain 15% Critical Chance and 15% Critical Damage. Whenever an ally scores a Critical Hit against a Marked or Ambushed enemy, that ally gains 5% Turn Meter. Sinker gains Taunt (1 turn) whenever a Wolfpack ally falls below 50% health.', ['unique', 'Critical Chance Up', 'Critical Damage Up', 'turn_meter_gain', 'Taunt'], [])
    ],
    'Wolfpack',
    8500,
    'Hold Position',
    { speed: 115, hp: 65000, protection: 50000, defense: 60 }
  ),
  createCharacter(
    'wp_heavy',
    'Wolfpack Heavy',
    'Tank / Support',
    ['Galactic Republic', 'Clone Trooper', 'Wolfpack'],
    'Heavy suppressive clone weapons specialist who locks down sectors and covers Wolfpack advances.',
    [
      makeAbility('wp_heavy_b', 'Suppressive Fire', 'basic', 0, 'Deal Physical Damage. Inflict Offense Down (2 turns).', ['damage', 'Offense Down'], ['offensive']),
      makeAbility('wp_heavy_s1', 'Heavy Repeater Barrage', 'special', 3, 'Deal Physical Damage to all enemies. Enemies suffering Marked take bonus damage.', ['damage_aoe', 'Marked'], ['offensive']),
      makeAbility('wp_heavy_s2', 'Lock The Sector', 'special', 4, 'All Wolfpack allies gain Defense Up (2 turns) and Protection Up (20%). Target enemy gains Marked (2 turns).', ['buff_all', 'Defense Up', 'Protection Up', 'Marked'], ['defensive']),
      makeAbility('wp_heavy_u', 'Covering Position', 'unique', 0, 'Whenever a Wolfpack ally attacks an Ambushed enemy: Recover 5% Protection. Whenever a Marked enemy takes a turn: Wolfpack Heavy gains Taunt (1 turn). Whenever Wolfpack Heavy has Taunt: Wolfpack allies gain 15% Defense.', ['unique', 'protection_recovery', 'Taunt', 'Defense', 'Marked', 'Ambushed'], [])
    ],
    'Wolfpack',
    8200,
    'Suppressive Fire',
    { speed: 110, hp: 55000, protection: 55000, defense: 55 }
  ),
  createCharacter(
    'wp_scout',
    'Comet',
    'Saboteur / Strategist',
    ['Galactic Republic', 'Clone Trooper', 'Wolfpack'],
    'Mobile Wolfpack scout sniper who marks and targets enemy lines to disrupt tactical plans.',
    [
      makeAbility('wp_sct_b', 'Recon Shot', 'basic', 0, 'Deal Physical Damage. Inflict Speed Down (2 turns). If target is Marked, gain 10% Turn Meter.', ['damage', 'Speed Down', 'turn_meter_gain', 'Marked'], ['offensive']),
      makeAbility('wp_sct_s1', 'Recon Sweep', 'special', 3, 'Dispel Stealth from all enemies. All Wolfpack allies gain Critical Chance Up (2 turns) and Foresight (2 turns).', ['dispel', 'Critical Chance Up', 'Foresight', 'Stealth'], ['defensive']),
      makeAbility('wp_sct_s2', 'Weakpoint Targeting', 'special', 4, 'Ignore Taunt. Deal Physical Damage and inflict Marked (2 turns). If target is already Marked, inflict Ambushed (2 turns).', ['damage', 'ignore_taunt', 'Marked', 'Ambushed', 'Taunt'], ['offensive']),
      makeAbility('wp_sct_u', 'Battlefield Recon', 'unique', 0, 'Wolfpack allies gain 20% Potency and 20% Speed. Whenever an enemy gains Stealth, Comet gains a Bonus Turn. Whenever a Wolfpack ally scores a Critical Hit, Comet gains 5% Turn Meter.', ['unique', 'Potency Up', 'Speed Up', 'Stealth', 'bonus_turn', 'turn_meter_gain'], [])
    ],
    'Wolfpack',
    8000,
    'Scout Targeting',
    { speed: 145, hp: 40000, protection: 40000, defense: 45 }
  ),
  createCharacter(
    'plo_koon_journey',
    'Plo Koon',
    'Support / Attacker',
    ['Galactic Republic', 'Jedi', 'Wolfpack', 'Journey Character'],
    'Journey Character. Calm and compassionate general who coordinates the clinical assaults of the Wolfpack.',
    [
      makeAbility('plo_journey_b', 'Force-Guided Strike', 'basic', 0, 'Deal Physical Damage. If target is Marked: Dispel 1 buff. If target is Ambushed: All Wolfpack allies recover 5% Protection.', ['damage', 'dispel', 'protection_recovery', 'Marked', 'Ambushed'], ['offensive']),
      makeAbility('plo_journey_s1', 'Jedi Rescue Operation', 'special', 3, 'Target ally recovers 25% Health and 25% Protection. Dispel all debuffs from target ally. If target is Wolfpack: Gain Defense Up (2 turns).', ['heal', 'protection_recovery', 'cleanse', 'Defense Up'], ['defensive', 'heal']),
      makeAbility('plo_journey_s2', 'Wolfpack Reinforcements', 'special', 4, 'All Wolfpack allies gain Protection Up (25%) and Tenacity Up (2 turns). Target enemy gains Marked (2 turns). If target was already Marked: Inflict Ambushed (2 turns).', ['buff_all', 'Protection Up', 'Tenacity Up', 'Marked', 'Ambushed'], ['defensive']),
      makeAbility('plo_journey_l', 'The Wolf General', 'leader', 0, 'Wolfpack allies gain 30% Max Health, 25 Speed, and 20% Tenacity. Whenever an enemy gains Ambushed: Wolfpack allies recover 5% Protection. Whenever a Marked or Ambushed enemy is defeated: Wolfpack allies gain 10% Turn Meter.', ['buff_faction', 'Marked', 'Ambushed', 'protection_recovery', 'turn_meter_gain'], []),
      makeAbility('plo_journey_u', 'Compassion And Resolve', 'unique', 0, 'At the start of battle: All Wolfpack allies gain Defense Up (2 turns). Whenever a Wolfpack ally falls below 50% Health: Plo Koon gains Bonus Turn. Whenever Plo Koon uses a Special Ability: Random enemy gains Marked (1 turn). Whenever an enemy gains Ambushed: Plo Koon assists dealing 50% reduced damage.', ['unique', 'Defense Up', 'bonus_turn', 'Marked', 'Ambushed', 'assist'], [])
    ],
    'Wolfpack',
    14500,
    'Inspiring Support',
    { speed: 135, hp: 55000, protection: 65000, defense: 55 }
  ),

  // --- Coruscant Guard Faction ---
  createCharacter(
    'commander_fox_riot',
    'Commander Fox (Riot)',
    'Leader / Tank',
    ['Galactic Republic', 'Clone Trooper', 'Coruscant Guard'],
    'Enforces Republic law and leads the Coruscant Guard.',
    [
      makeAbility('fox_b', 'Riot Baton', 'basic', 0, 'Deal Physical Damage. 70% chance to inflict Speed Down (2 turns). If target is Locked Down, recover 5% Protection.', ['damage', 'Speed Down', 'protection_recovery', 'Lockdown'], ['offensive']),
      makeAbility('fox_s1', 'Establish Perimeter', 'special', 3, 'Gain Taunt (2 turns) and Riot Control. Inflict Lockdown (1 turn) on target enemy.', ['taunt', 'Riot Control', 'Lockdown', 'Taunt'], ['defensive', 'buff']),
      makeAbility('fox_s2', 'Coruscant Security Protocol', 'special', 4, 'All Coruscant Guard allies gain Riot Control. All enemies with Lockdown lose 10% Turn Meter.', ['Riot Control', 'turn_meter_reduction'], ['defensive', 'buff']),
      makeAbility('fox_l', 'The Law Is The Law', 'leader', 0, 'Coruscant Guard allies gain 25% Max Health and 20% Defense. Whenever Coruscant Guard allies inflict Lockdown, recover 3% Protection. Whenever enemies lose Lockdown, Fox gains Taunt (1 turn).', ['buff_faction', 'Lockdown', 'protection_recovery', 'Taunt'], []),
      makeAbility('fox_u', 'Riot Commander', 'unique', 0, 'Whenever an enemy gains Lockdown, Fox gains 5% Turn Meter. Whenever Fox is Taunting, Coruscant Guard allies gain 10% Defense.', ['Lockdown', 'turn_meter_gain', 'Defense Up'], [])
    ],
    'Coruscant Guard',
    9500,
    'Riot Control',
    { speed: 135, hp: 60000, protection: 60000, defense: 60 }
  ),
  createCharacter(
    'commander_thorn',
    'Commander Thorn',
    'Attacker / Strategist',
    ['Galactic Republic', 'Clone Trooper', 'Coruscant Guard'],
    'Legendary officer who stands strong under heavy fire.',
    [
      makeAbility('thorn_b', 'Heavy Rotary Fire', 'basic', 0, 'Deal Physical Damage. If target is Locked Down, attack again.', ['damage', 'double_strike', 'Lockdown'], ['offensive']),
      makeAbility('thorn_s1', 'Hold The Avenue', 'special', 3, 'Deal Physical Damage to all enemies. Enemies with Lockdown take bonus damage.', ['damage_aoe', 'Lockdown'], ['offensive']),
      makeAbility('thorn_s2', 'Suppressive Barrage', 'special', 4, 'Inflict Offense Down (2 turns) and Lockdown (1 turn) on target enemy. Gain Riot Control.', ['damage', 'Offense Down', 'Lockdown', 'Riot Control'], ['offensive']),
      makeAbility('thorn_u', 'We Stand Here', 'unique', 0, 'Whenever enemies gain Lockdown, Thorn gains 5% Offense (stacking). Whenever Thorn attacks a Locked Down enemy, ignore 20% Defense.', ['Lockdown', 'buff_self', 'ignore_defense'], [])
    ],
    'Coruscant Guard',
    9000,
    'Heavy Rotary Fire',
    { speed: 125, hp: 55000, protection: 60000, defense: 55 }
  ),
  createCharacter(
    'riot_guard',
    'Riot Guard',
    'Support / Saboteur',
    ['Galactic Republic', 'Clone Trooper', 'Coruscant Guard'],
    'Defensive containment clone trooper.',
    [
      makeAbility('riot_b', 'Shield Strike', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Offense Down (2 turns).', ['damage', 'Offense Down'], ['offensive']),
      makeAbility('riot_guard_s1', 'Crowd Dispersal', 'special', 3, 'Target enemy gains Lockdown (1 turn). Riot Guard gains Riot Control.', ['Lockdown', 'Riot Control'], ['offensive']),
      makeAbility('riot_guard_s2', 'Formation Advance', 'special', 4, 'All Coruscant Guard allies gain Defense Up (2 turns) and Riot Control.', ['Defense Up', 'Riot Control'], ['defensive', 'buff']),
      makeAbility('riot_u', 'Shield Wall', 'unique', 0, 'Whenever allies gain Riot Control, recover 5% Protection. Whenever enemies gain Lockdown, Riot Guard gains 5% Turn Meter.', ['Riot Control', 'protection_recovery', 'Lockdown', 'turn_meter_gain'], [])
    ],
    'Coruscant Guard',
    8000,
    'Shield Wall',
    { speed: 115, hp: 65000, protection: 65000, defense: 65 }
  ),
  createCharacter(
    'coruscant_trooper',
    'Coruscant Trooper',
    'Attacker / Tank',
    ['Galactic Republic', 'Clone Trooper', 'Coruscant Guard'],
    'Urban warfare specialist.',
    [
      makeAbility('ct_b', 'Shock Baton', 'basic', 0, 'Deal Physical Damage. If target has Lockdown, inflict Defense Down (2 turns).', ['damage', 'Lockdown', 'Defense Down'], ['offensive']),
      makeAbility('ct_s1', 'Riot Formation', 'special', 3, 'Gain Defense Up (2 turns) and Riot Control. Recover 15% Protection.', ['Defense Up', 'Riot Control', 'protection_recovery'], ['defensive', 'buff']),
      makeAbility('ct_s2', 'Force Compliance', 'special', 4, 'Deal Physical Damage. Inflict Lockdown (1 turn) on target enemy. If target already has Lockdown, Stun (1 turn).', ['damage', 'Lockdown', 'Stun'], ['offensive']),
      makeAbility('ct_u', 'Front Line Officer', 'unique', 0, 'Whenever Coruscant Guard allies gain Riot Control, gain 5% Turn Meter. Whenever attacking Locked Down enemies, recover 5% Protection.', ['Riot Control', 'turn_meter_gain', 'Lockdown', 'protection_recovery'], [])
    ],
    'Coruscant Guard',
    7500,
    'Shock Enforcement',
    { speed: 130, hp: 45000, protection: 45000, defense: 50 }
  ),
  createCharacter(
    'underworld_police',
    'Underworld Police',
    'Support / Saboteur',
    ['Droid', 'Galactic Republic', 'Coruscant Guard'],
    'Underworld containment droids.',
    [
      makeAbility('up_b', 'Surveillance Scan', 'basic', 0, 'Deal Special Damage. Reveal Stealthed enemies.', ['damage', 'Stealth'], ['offensive']),
      makeAbility('up_s1', 'Criminal Database', 'special', 3, 'Target enemy gains Target Lock (2 turns) and Lockdown (1 turn).', ['Target Lock', 'Lockdown'], ['offensive']),
      makeAbility('up_s2', 'Automated Enforcement', 'special', 4, 'All enemies gain Potency Down (2 turns). Random enemy gains Lockdown (1 turn).', ['Potency Down', 'Lockdown'], ['offensive']),
      makeAbility('up_u', 'Citywide Surveillance', 'unique', 0, 'Whenever enemies gain buffs, 25% chance to inflict Lockdown. Whenever enemies lose Lockdown, CUPD gains 10% Turn Meter.', ['Lockdown', 'turn_meter_gain'], [])
    ],
    'Coruscant Guard',
    7000,
    'Surveillance Droid',
    { speed: 120, hp: 55000, protection: 50000, defense: 55 }
  ),
  createCharacter(
    'chancellor_palpatine_journey',
    'Chancellor Palpatine',
    'Leader / Support / Saboteur',
    ['Galactic Republic', 'Coruscant Guard', 'Journey Character'],
    'Manipulates from the shadows.',
    [
      makeAbility('palp_b', 'Political Influence', 'basic', 0, 'No Damage. Target ally gains Riot Control. Recover 10% Protection.', ['Riot Control', 'protection_recovery'], ['defensive', 'buff']),
      makeAbility('palp_s1', 'Emergency Powers', 'special', 3, 'Target ally gains Bonus Turn and Riot Control. Reduce cooldowns by 1.', ['Riot Control', 'bonus_turn', 'cooldown_reduction'], ['defensive', 'buff']),
      makeAbility('palp_s2', 'Senate Mandate', 'special', 4, 'All enemies gain Lockdown (1 turn). Palpatine gains Stealth (2 turns).', ['Lockdown', 'Stealth'], ['offensive']),
      makeAbility('palp_l', 'Supreme Chancellor', 'leader', 0, 'Coruscant Guard allies gain 20 Speed and 25% Potency. Whenever enemies gain Lockdown, Coruscant Guard allies recover 2% Protection. Whenever allies gain Riot Control, gain 2% Turn Meter.', ['buff_faction', 'Lockdown', 'protection_recovery', 'Riot Control', 'turn_meter_gain'], []),
      makeAbility('palp_u', 'The Man Behind Everything', 'unique', 0, 'Palpatine cannot attack. Palpatine cannot critically hit. Palpatine cannot be targeted while another Coruscant Guard ally is active. Whenever an enemy gains Lockdown, Palpatine gains 5% Turn Meter. If Palpatine is the last surviving ally, Palpatine retreats from battle.', ['Lockdown', 'turn_meter_gain'], [])
    ],
    'Coruscant Guard',
    16000,
    'Shadow Orchestration',
    { speed: 155, hp: 80000, protection: 80000, defense: 60 }
  ),
  createCharacter(
    'gl_tarkin',
    'War Architect Tarkin',
    'Strategist / Attacker / Galactic Legend',
    ['Galactic Republic', 'Coruscant Guard'],
    'Ultimate Galactic Legend who orchestrates complete order through security architecture, lockdowns, and lethal security enforcement.',
    [
      makeAbility('tarkin_b', 'Ruthless Efficiency', 'basic', 0, 'Deal Physical Damage. If target has Lockdown, inflict Expose.', ['damage', 'Lockdown', 'Exposed'], ['offensive']),
      makeAbility('tarkin_s1', 'Strategic Containment', 'special', 3, 'Deal Physical Damage to all enemies. Inflict Speed Down (2 turns). Locked Down enemies take bonus damage.', ['damage_aoe', 'Speed Down', 'Lockdown'], ['offensive']),
      makeAbility('tarkin_s2', 'Total Enforcement', 'special', 4, 'All enemies gain Lockdown (1 turn). All Coruscant Guard allies gain Riot Control.', ['Lockdown', 'Riot Control'], ['offensive', 'buff']),
      makeAbility('tarkin_u', 'Blueprint Of Order', 'unique', 0, 'Whenever an enemy gains Lockdown, Tarkin gains 5% Turn Meter. Whenever a Coruscant Guard ally gains Riot Control, recover 3% Protection. Whenever enemies take a turn while Locked Down, lose 2% Max Health (stacking). Whenever an enemy loses Lockdown, reapply Lockdown for 1 turn (Can only trigger once per enemy every 3 turns).', ['Lockdown', 'turn_meter_gain', 'Riot Control', 'protection_recovery'], []),
      makeAbility('tarkin_ult', 'The Price Of Disorder', 'ultimate', 0, 'Activate at 100% Ultimate Charge. Dispel all buffs from all enemies. All enemies gain Lockdown (2 turns). All Coruscant Guard allies gain Riot Control, Offense Up (2 turns), Defense Up (2 turns), and Speed Up (2 turns). Globally, whenever an enemy gains Lockdown, they lose 5% Max Health. Whenever an enemy takes a turn while Locked Down, Coruscant Guard allies gain 2% Turn Meter. Whenever a Coruscant Guard ally attacks a Locked Down enemy, ignore 50% Defense. Then all Coruscant Guard allies assist.', ['Lockdown', 'Riot Control', 'Offense Up', 'Defense Up', 'Speed Up', 'assist_all'], ['ultimate'], 100)
    ],
    'Coruscant Guard',
    15000,
    'Order Blueprint',
    { speed: 153, hp: 90000, protection: 75000, defense: 60 }
  ),

];