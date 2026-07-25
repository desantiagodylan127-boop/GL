import { createCharacter, makeAbility } from '../characters_base';
import { Character } from '../../types';

export const JOURNEY_NPC_CHARACTERS: Character[] = [
  createCharacter(
    'tusken_raider',
    'Tusken Raider',
    'Attacker',
    ['Tusken', 'Attacker', 'NPC'],
    'Savage desert raider who uses suppressive physical strikes.',
    [
      makeAbility('tusken_raider_basic', 'Rifle Butt', 'basic', 0, 'Deal Physical Damage. 50% chance to remove 10% Turn Meter.', ['damage_single', 'turn_meter_reduction'], ['offensive']),
      makeAbility('tusken_raider_special_1', 'Desert Ambush', 'special', 3, 'Deal heavy Physical Damage and inflict Damage Over Time (2 turns).', ['damage_single', 'Damage Over Time'], ['offensive'])
    ],
    'Tusken Raiders',
    3000,
    'Deals damage and reduces enemy turn meter',
    { speed: 110, offense: 1500, hp: 15000, protection: 5000, defense: 20 }
  ),
  createCharacter(
    'rebel_pathfinder',
    'Rebel Pathfinder',
    'Tank',
    ['Rebel', 'Tank', 'NPC'],
    'Aggressive Rebel frontline tank who Taunts and guards allies.',
    [
      makeAbility('rebel_pathfinder_basic', 'Blaster Strike', 'basic', 0, 'Deal Physical Damage. If Pathfinder has Taunt, gain 10% Protection Up.', ['damage_single', 'Protection Up'], ['offensive']),
      makeAbility('rebel_pathfinder_special_1', 'Explosive Charges', 'special', 3, 'Gain Taunt (2 turns) and Defense Up (2 turns).', ['Taunt', 'Defense Up'], ['defensive'])
    ],
    'Rebel Alliance',
    3500,
    'Taunts to protect other Rebel units',
    { speed: 120, offense: 1200, hp: 25000, protection: 20000, defense: 45 }
  ),
  createCharacter(
    'rebel_trooper',
    'Rebel Trooper',
    'Attacker',
    ['Rebel', 'Attacker', 'NPC'],
    'Standard Rebel infantry soldier.',
    [
      makeAbility('rebel_trooper_basic', 'Targeted Shot', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('rebel_trooper_special_1', 'Suppressive Fire', 'special', 3, 'Deal Physical Damage and inflict Speed Down (2 turns).', ['damage_single', 'Speed Down'], ['offensive'])
    ],
    'Rebel Alliance',
    3200,
    'Deals basic damage and inflicts Speed Down',
    { speed: 115, offense: 1800, hp: 16000, protection: 10000, defense: 25 }
  ),
  createCharacter(
    'rebel_officer',
    'Rebel Officer',
    'Support',
    ['Rebel', 'Support', 'NPC'],
    'Commanding officer who inspires Rebel forces.',
    [
      makeAbility('rebel_officer_basic', 'Commanding Blaster', 'basic', 0, 'Deal Special Damage. Random Rebel ally gains 10% Turn Meter.', ['damage_single', 'turn_meter_gain'], ['offensive']),
      makeAbility('rebel_officer_special_1', 'Coordinate Strike', 'special', 3, 'All Rebel allies gain Offense Up (2 turns) and 15% Turn Meter.', ['Offense Up', 'turn_meter_gain_aoe'], ['defensive'])
    ],
    'Rebel Alliance',
    3400,
    'Supports allies with buffs and Turn Meter gains',
    { speed: 125, offense: 1400, hp: 18000, protection: 12000, defense: 30 }
  ),
  createCharacter(
    'rebel_commando',
    'Rebel Commando',
    'Attacker',
    ['Rebel', 'Attacker', 'NPC'],
    'Infiltration specialist dealing high critical damage.',
    [
      makeAbility('rebel_commando_basic', 'Precision Laser', 'basic', 0, 'Deal Physical Damage. High critical chance.', ['damage_single'], ['offensive']),
      makeAbility('rebel_commando_special_1', 'Infiltration Strike', 'special', 3, 'Deal heavy Physical Damage and inflict Daze (2 turns).', ['damage_heavy', 'Daze'], ['offensive'])
    ],
    'Rebel Alliance',
    3600,
    'Deals heavy high-crit damage and inflicts Daze',
    { speed: 118, offense: 2200, hp: 14000, protection: 8000, defense: 22 }
  ),
  createCharacter(
    'kanan_jarrus',
    'Kanan Jarrus',
    'Tank',
    ['Jedi', 'Rebel', 'Spectre', 'Tank', 'NPC'],
    'Jedi Knight protector who Taunts and counters.',
    [
      makeAbility('kanan_basic', 'Disarming Strike', 'basic', 0, 'Deal Physical Damage and inflict Offense Down (2 turns).', ['damage_single', 'Offense Down'], ['offensive']),
      makeAbility('kanan_special_1', 'Clear Mind', 'special', 3, 'Gain Taunt (2 turns). Cleanse all debuffs from Kanan and recover 15% Protection.', ['Taunt', 'cleanse_self', 'heal_protection'], ['defensive'])
    ],
    'Phoenix Cell',
    4200,
    'Protects Phoenix allies with Taunt',
    { speed: 105, offense: 1300, hp: 28000, protection: 25000, defense: 40 }
  ),
  createCharacter(
    'ezra_phoenix',
    'Phoenix Ezra Bridger',
    'Attacker',
    ['Jedi', 'Rebel', 'Spectre', 'Attacker', 'NPC'],
    'Nimble Jedi apprentice dealing progressive critical damage.',
    [
      makeAbility('ezra_phoenix_basic', 'Apprentice Strike', 'basic', 0, 'Deal Physical Damage. 40% chance to attack twice.', ['damage_single'], ['offensive']),
      makeAbility('ezra_phoenix_special_1', 'Flourish', 'special', 3, 'Deal heavy Physical Damage. If the target is debuffed, gain 50% Turn Meter.', ['damage_heavy', 'turn_meter_gain'], ['offensive'])
    ],
    'Phoenix Cell',
    4500,
    'Deals high single-target damage',
    { speed: 130, offense: 2400, hp: 15000, protection: 12000, defense: 25 }
  ),
  createCharacter(
    'sabine_wren',
    'Sabine Wren',
    'Attacker',
    ['Mandalorian', 'Rebel', 'Spectre', 'Attacker', 'NPC'],
    'Mandalorian weapons expert who shreds defenses with thermal charges.',
    [
      makeAbility('sabine_basic', 'Dual Blasters', 'basic', 0, 'Deal Physical Damage. Inflict Expose (2 turns) on critical hits.', ['damage_single', 'Exposed'], ['offensive']),
      makeAbility('sabine_special_1', 'Demolitions', 'special', 3, 'Deal Physical Damage to all enemies and inflict Defense Down (2 turns).', ['damage_aoe', 'Defense Down'], ['offensive'])
    ],
    'Phoenix Cell',
    4400,
    'Deals multi-target damage and exposes enemies',
    { speed: 128, offense: 2100, hp: 16000, protection: 14000, defense: 22 }
  ),
  createCharacter(
    'garazeb_orrelios',
    'Garazeb Orrelios',
    'Tank',
    ['Rebel', 'Spectre', 'Tank', 'NPC'],
    'Heavy Lasat brawler who inflicts Daze and Stuns.',
    [
      makeAbility('zeb_basic', 'Bash', 'basic', 0, 'Deal Physical Damage. If target is debuffed, inflict Daze (2 turns).', ['damage_single', 'Daze'], ['offensive']),
      makeAbility('zeb_special_1', 'Honor Guard', 'special', 3, 'Gain Taunt (1 turn) and Retribution (2 turns).', ['Taunt', 'Retribution'], ['defensive'])
    ],
    'Phoenix Cell',
    4100,
    'Stuns and dazes targets',
    { speed: 110, offense: 1600, hp: 26000, protection: 22000, defense: 38 }
  ),
  createCharacter(
    'hera_syndulla',
    'Hera Syndulla',
    'Support',
    ['Rebel', 'Spectre', 'Support', 'NPC'],
    'Spectre Leader who coordinates attacks and grants extra turns.',
    [
      makeAbility('hera_basic', 'Mindful Strike', 'basic', 0, 'Deal Physical Damage and call random Phoenix ally to assist.', ['damage_single', 'assist'], ['offensive']),
      makeAbility('hera_special_1', 'Play To Strength', 'special', 3, 'Target ally gains Offense Up (2 turns) and 40% Turn Meter.', ['Offense Up', 'turn_meter_gain'], ['defensive'])
    ],
    'Phoenix Cell',
    4600,
    'Coordinates team assists and provides Turn Meter',
    { speed: 122, offense: 1400, hp: 20000, protection: 16000, defense: 28 }
  ),

  // --- Boba Fett (Daimyo) NPCs ---
  createCharacter(
    'tusken_warrior',
    'Tusken Warrior',
    'Attacker',
    ['Tusken', 'Attacker', 'NPC'],
    'Fierce Tusken warrior wielding a gaffi stick with lethal precision.',
    [
      makeAbility('tusken_warrior_basic', 'Gaffi Stick Strike', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Damage Over Time.', ['damage_single', 'Damage Over Time'], ['offensive']),
      makeAbility('tusken_warrior_special_1', 'Chieftain\'s Charge', 'special', 3, 'Deal heavy Physical Damage. If Tusken Chieftain is an ally, also gain Offense Up.', ['damage_single', 'Offense Up'], ['offensive'])
    ],
    'Tusken Raiders',
    3100,
    'Deals physical damage and damage over time',
    { speed: 112, offense: 1600, hp: 16000, protection: 6000 }
  ),
  createCharacter(
    'tusken_chieftain',
    'Tusken Chieftain',
    'Leader / Support',
    ['Tusken', 'Leader', 'Support', 'NPC'],
    'Wise elder of the tribe who inspires Tusken allies to rally and strike.',
    [
      makeAbility('tusken_chief_basic', 'Chieftain\'s Staff', 'basic', 0, 'Deal Physical Damage. 50% chance to grant Tusken allies Defense Up.', ['damage_single', 'Defense Up'], ['offensive']),
      makeAbility('tusken_chief_special_1', 'Tribe\'s War Cry', 'special', 4, 'All Tusken allies gain Offense Up and Retribution (2 turns).', ['Offense Up', 'Retribution'], ['defensive']),
      makeAbility('tusken_chief_leader', 'Desert Sovereign', 'leader', 0, 'Tusken allies gain 15% Health and 10% Offense.', [], [])
    ],
    'Tusken Raiders',
    3500,
    'Supports Tusken allies with defensive and offensive buffs',
    { speed: 115, hp: 20000, protection: 12000 }
  ),
  createCharacter(
    'nikto_guard',
    'Nikto Guard',
    'Tank',
    ['Hutt Cartel', 'Tank', 'NPC'],
    'Burly Nikto enforcer guarding Jabba\'s palace with heavy defenses.',
    [
      makeAbility('nikto_guard_basic', 'Force Pike Strike', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Defense Down.', ['damage_single', 'Defense Down'], ['offensive']),
      makeAbility('nikto_guard_special_1', 'Stand Guard', 'special', 3, 'Gain Taunt and Defense Up (2 turns).', ['Taunt', 'Defense Up'], ['defensive'])
    ],
    'Hutt Cartel',
    3200,
    'Taunts and absorbs damage',
    { speed: 108, hp: 22000, protection: 15000 }
  ),
  createCharacter(
    'weequay_pirate',
    'Weequay Pirate',
    'Attacker',
    ['Hutt Cartel', 'Attacker', 'NPC'],
    'Rowdy pirate hired to protect Jabba\'s court with rapid blaster fire.',
    [
      makeAbility('weequay_pirate_basic', 'Blaster Pistol', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('weequay_pirate_special_1', 'Grapple Hook Strike', 'special', 3, 'Deal Physical Damage and remove 15% Turn Meter.', ['damage_single', 'turn_meter_reduction'], ['offensive'])
    ],
    'Hutt Cartel',
    3100,
    'Ranged attacker with TM reduction',
    { speed: 116, offense: 1700, hp: 15000, protection: 8000 }
  ),
  createCharacter(
    'skiff_guard',
    'Skiff Guard',
    'Saboteur',
    ['Hutt Cartel', 'Saboteur', 'NPC'],
    'Agile skiff pilot who throws vibro-axes to disorient opponents.',
    [
      makeAbility('skiff_guard_basic', 'Vibro-Axe Slash', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('skiff_guard_special_1', 'Target Marked', 'special', 3, 'Inflict Marked and Defense Down (2 turns).', ['Marked', 'Defense Down'], ['debuff'])
    ],
    'Hutt Cartel',
    3300,
    'Marks and weakens primary targets',
    { speed: 122, hp: 17000, protection: 10000 }
  ),
  createCharacter(
    'pyke_captain',
    'Pyke Captain',
    'Leader / Support',
    ['Pyke Syndicate', 'Leader', 'Support', 'NPC'],
    'Senior syndicate officer directing operations with high-tech defenses.',
    [
      makeAbility('pyke_captain_basic', 'Syndicate Carbine', 'basic', 0, 'Deal Physical Damage and call a Pyke ally to assist.', ['damage_single', 'assist'], ['offensive']),
      makeAbility('pyke_captain_special_1', 'Bribe Enforcers', 'special', 4, 'Cleanse all debuffs from Pyke allies and grant them Tenacity Up (2 turns).', ['cleanse', 'Tenacity Up'], ['defensive']),
      makeAbility('pyke_captain_leader', 'Syndicate Influence', 'leader', 0, 'Pyke allies gain 20 Speed and 15% Critical Chance.', [], [])
    ],
    'Pyke Syndicate',
    3600,
    'Rallies and cleanses Pyke allies',
    { speed: 120, hp: 24000, protection: 18000 }
  ),
  createCharacter(
    'pyke_soldier',
    'Pyke Soldier',
    'Attacker',
    ['Pyke Syndicate', 'Attacker', 'NPC'],
    'Foot soldier of the Pyke Syndicate dealing steady blaster damage.',
    [
      makeAbility('pyke_soldier_basic', 'Blaster Shot', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('pyke_soldier_special_1', 'Overcharge Blaster', 'special', 3, 'Deal heavy Physical Damage with a 50% chance to attack twice.', ['damage_heavy', 'double_strike'], ['offensive'])
    ],
    'Pyke Syndicate',
    3100,
    'Deals physical blaster damage',
    { speed: 114, offense: 1800, hp: 16000, protection: 8000 }
  ),
  createCharacter(
    'pyke_enforcer',
    'Pyke Enforcer',
    'Tank',
    ['Pyke Syndicate', 'Tank', 'NPC'],
    'Ruthless enforcer who uses stun batons to control targets.',
    [
      makeAbility('pyke_enforcer_basic', 'Syndicate Baton', 'basic', 0, 'Deal Physical Damage. 30% chance to stun.', ['damage_single', 'Stun'], ['offensive']),
      makeAbility('pyke_enforcer_special_1', 'Intimidate', 'special', 3, 'Gain Taunt (2 turns) and inflict Offense Down on the target.', ['Taunt', 'Offense Down'], ['defensive'])
    ],
    'Pyke Syndicate',
    3300,
    'Taunts and has a chance to stun',
    { speed: 110, hp: 25000, protection: 20000 }
  ),
  createCharacter(
    'pyke_heavy',
    'Pyke Heavy',
    'Attacker',
    ['Pyke Syndicate', 'Attacker', 'NPC'],
    'Heavy weapon specialist dealing area-of-effect suppression damage.',
    [
      makeAbility('pyke_heavy_basic', 'Heavy Repeater', 'basic', 0, 'Deal Physical Damage. Gain Offense Up.', ['damage_single', 'Offense Up'], ['offensive']),
      makeAbility('pyke_heavy_special_1', 'Suppression Volley', 'special', 4, 'Deal Physical Damage to all enemies and inflict Speed Down (2 turns).', ['damage_aoe', 'Speed Down'], ['offensive'])
    ],
    'Pyke Syndicate',
    3400,
    'Deals AOE suppression damage',
    { speed: 108, offense: 2000, hp: 18000, protection: 12000 }
  ),

  // --- Grand Inquisitor NPCs ---
  createCharacter(
    'jedi_padawan',
    'Jedi Padawan',
    'Attacker',
    ['Jedi', 'Attacker', 'NPC'],
    'A young Force sensitive trainee defending themselves with a blue lightsaber.',
    [
      makeAbility('padawan_basic', 'Apprentice Strike', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('padawan_special_1', 'Force Leap', 'special', 3, 'Deal heavy Physical Damage and gain Foresight (1 turn).', ['damage_heavy', 'Foresight'], ['offensive'])
    ],
    'Jedi Order',
    3000,
    'Deals damage and gains Foresight',
    { speed: 118, offense: 1500, hp: 14000, protection: 4000 }
  ),
  createCharacter(
    'temple_guard',
    'Jedi Temple Guard',
    'Tank',
    ['Jedi', 'Tank', 'NPC'],
    'Masked defender of the Jedi Temple wielding a yellow double-bladed lightsaber.',
    [
      makeAbility('temple_guard_basic', 'Guard Strike', 'basic', 0, 'Deal Physical Damage. Gain Defense Up.', ['damage_single', 'Defense Up'], ['offensive']),
      makeAbility('temple_guard_special_1', 'Temple Ward', 'special', 3, 'Gain Taunt (2 turns) and Retribution (2 turns).', ['Taunt', 'Retribution'], ['defensive'])
    ],
    'Jedi Order',
    3500,
    'Taunts and counterattacks',
    { speed: 110, hp: 26000, protection: 22000 }
  ),
  createCharacter(
    'quinlan_vos',
    'Quinlan Vos',
    'Attacker / Saboteur',
    ['Jedi', 'Attacker', 'Saboteur', 'NPC'],
    'Maverick Jedi Master with unique psychometric powers and stealth capabilities.',
    [
      makeAbility('vos_basic', 'Maverick Slash', 'basic', 0, 'Deal Physical Damage. Inflict Expose (2 turns).', ['damage_single', 'Exposed'], ['offensive']),
      makeAbility('vos_special_1', 'Shadow Strike', 'special', 3, 'Gain Stealth and Offense Up (2 turns). Attack again if already stealthed.', ['Stealth', 'Offense Up', 'bonus_attack'], ['offensive'])
    ],
    'Jedi Order',
    4200,
    'Deals damage and exposes targets',
    { speed: 126, offense: 2300, hp: 18000, protection: 12000 }
  ),
  createCharacter(
    'jedi_survivor',
    'Jedi Survivor',
    'Support',
    ['Jedi', 'Support', 'NPC'],
    'Resilient Jedi who escaped Order 66, supporting allies with the Force.',
    [
      makeAbility('survivor_basic', 'Lightsaber Slash', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('survivor_special_1', 'Force Healing', 'special', 3, 'Heal all allies for 15% Health and Protection.', ['heal_all'], ['heal'])
    ],
    'Jedi Order',
    3400,
    'Heals and supports Jedi allies',
    { speed: 115, hp: 18000, protection: 14000 }
  ),
  createCharacter(
    'cere_junda',
    'Cere Junda',
    'Leader / Support',
    ['Jedi', 'Leader', 'Support', 'NPC'],
    'Former Jedi Master who acts as a powerful support and beacon of hope.',
    [
      makeAbility('cere_basic', 'Heavy Blaster Shot', 'basic', 0, 'Deal Special Damage. lowest Health ally recovers 5% Protection.', ['damage_single', 'protection_recovery'], ['offensive']),
      makeAbility('cere_special_1', 'United Resolve', 'special', 4, 'All allies gain Offense Up and Tenacity Up (2 turns) and 15% Turn Meter.', ['Offense Up', 'Tenacity Up', 'turn_meter_gain_aoe'], ['defensive'])
    ],
    'Jedi Order',
    4400,
    'Supports team with offensive buffs and healing',
    { speed: 120, hp: 22000, protection: 16000 }
  ),

  // --- General Grievous NPCs ---
  createCharacter(
    'clone_sergeant',
    'Clone Sergeant',
    'Attacker',
    ['Galactic Republic', 'Clone Trooper', 'NPC'],
    'Hardened clone trooper dealing sustained heavy damage.',
    [
      makeAbility('sergeant_basic', 'Z-6 Rotary Cannon', 'basic', 0, 'Deal Physical Damage. Gain 15% Turn Meter on Critical Hit.', ['damage_single', 'turn_meter_gain'], ['offensive']),
      makeAbility('sergeant_special_1', 'Suppressive Fire', 'special', 3, 'Deal Special Damage to all enemies and remove 20% Turn Meter.', ['damage_aoe', 'turn_meter_reduction_aoe'], ['offensive'])
    ],
    'Galactic Republic',
    3200,
    'Deals damage and reduces enemy turn meter',
    { speed: 110, offense: 1900, hp: 16000, protection: 10000 }
  ),
  createCharacter(
    'clone_trooper',
    'Clone Trooper',
    'Attacker',
    ['Galactic Republic', 'Clone Trooper', 'NPC'],
    'Standard Republic clone trooper infantry.',
    [
      makeAbility('ct_basic', 'DC-15A Blaster', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('ct_special_1', 'Coordinated Burst', 'special', 3, 'Deal heavy Physical Damage. 50% chance to call an ally to assist.', ['damage_heavy', 'assist'], ['offensive'])
    ],
    'Galactic Republic',
    3000,
    'Deals blaster damage and triggers assists',
    { speed: 114, offense: 1600, hp: 15000, protection: 8000 }
  ),
  createCharacter(
    'arc_trooper',
    'ARC Trooper',
    'Attacker / Saboteur',
    ['Galactic Republic', 'Clone Trooper', 'NPC'],
    'Elite clone commando with dual blasters and tactical shock charges.',
    [
      makeAbility('arc_basic', 'Dual Blaster Pistols', 'basic', 0, 'Deal Physical Damage twice.', ['damage_single', 'double_strike'], ['offensive']),
      makeAbility('arc_special_1', 'Blaster Turret Summon', 'special', 3, 'Deal Special Damage and inflict Daze (2 turns).', ['damage_single', 'Daze'], ['offensive'])
    ],
    'Galactic Republic',
    3800,
    'Deals dual-blaster strikes and dazes targets',
    { speed: 125, offense: 2200, hp: 17000, protection: 12000 }
  ),
  createCharacter(
    'republic_officer',
    'Republic Officer',
    'Support',
    ['Galactic Republic', 'Support', 'NPC'],
    'Commanding officer coordinating battlefield tactics.',
    [
      makeAbility('rep_officer_basic', 'Officer Blaster', 'basic', 0, 'Deal Special Damage. Grant lowest Turn Meter ally 10% Turn Meter.', ['damage_single', 'turn_meter_gain'], ['offensive']),
      makeAbility('rep_officer_special_1', 'Tactical Strike', 'special', 3, 'All allies gain Critical Chance Up and Offense Up (2 turns).', ['Critical Chance Up', 'Offense Up'], ['defensive'])
    ],
    'Galactic Republic',
    3300,
    'Provides offensive buffs and turn meter',
    { speed: 122, hp: 18000, protection: 12000 }
  ),
  createCharacter(
    'jedi_general',
    'Jedi General',
    'Leader / Attacker',
    ['Galactic Republic', 'Jedi', 'Leader', 'NPC'],
    'Jedi Knight serving as general of the Clone Army.',
    [
      makeAbility('jedi_gen_basic', 'Lightsaber Sweep', 'basic', 0, 'Deal Physical Damage. 50% chance to grant Clone allies Defense Up.', ['damage_single', 'Defense Up'], ['offensive']),
      makeAbility('jedi_gen_special_1', 'Force Push', 'special', 3, 'Deal Special Damage and Stun the target (1 turn).', ['damage_single', 'Stun'], ['offensive']),
      makeAbility('jedi_gen_leader', 'Jedi Command', 'leader', 0, 'Galactic Republic allies gain 15% Health and 10% Offense.', [], [])
    ],
    'Galactic Republic',
    4300,
    'Stuns targets and leads Republic troops',
    { speed: 120, hp: 22000, protection: 16000 }
  ),
  createCharacter(
    'clone_heavy_trooper',
    'Clone Heavy Trooper',
    'Tank',
    ['Galactic Republic', 'Clone Trooper', 'Tank', 'NPC'],
    'Trooper with heavy shields and a Z-6 cannon who guards clone positions.',
    [
      makeAbility('heavy_basic', 'Heavy Blaster Strike', 'basic', 0, 'Deal Physical Damage. Gain Defense Up.', ['damage_single', 'Defense Up'], ['offensive']),
      makeAbility('heavy_special_1', 'Defensive Barrier', 'special', 3, 'Gain Taunt and 20% Protection Up (2 turns).', ['Taunt', 'Protection Up'], ['defensive'])
    ],
    'Galactic Republic',
    3300,
    'Taunts and shields allies',
    { speed: 108, hp: 24000, protection: 20000 }
  ),
  createCharacter(
    'clone_medic',
    'Clone Medic',
    'Support',
    ['Galactic Republic', 'Clone Trooper', 'Support', 'NPC'],
    'Field medic who heals wounded Clone troopers under heavy fire.',
    [
      makeAbility('medic_basic', 'Blaster Pistol', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('medic_special_1', 'Medical Kit', 'special', 3, 'Heal target ally for 30% Health and 15% Protection.', ['heal_single'], ['heal'])
    ],
    'Galactic Republic',
    3100,
    'Heals single allies',
    { speed: 115, hp: 16000, protection: 12000 }
  ),
  createCharacter(
    'republic_commando',
    'Republic Commando',
    'Attacker',
    ['Galactic Republic', 'Clone Trooper', 'NPC'],
    'Elite clone commando dealing heavy critical damage and armor shred.',
    [
      makeAbility('commando_basic', 'Deceive Blaster', 'basic', 0, 'Deal Physical Damage. Ignore 20% Defense.', ['damage_single'], ['offensive']),
      makeAbility('commando_special_1', 'Vibroblade Slash', 'special', 3, 'Deal massive Physical Damage. Inflict Healing Immunity (2 turns).', ['damage_heavy', 'Healing Immunity'], ['offensive'])
    ],
    'Galactic Republic',
    3900,
    'Deals massive armor-penetrating damage',
    { speed: 124, offense: 2400, hp: 17000, protection: 14000 }
  ),
  createCharacter(
    'battle_droid_officer',
    'Battle Droid Officer',
    'Support',
    ['Separatist', 'Droid', 'NPC'],
    'Commanding B1 officer that coordinates droid actions and raises civilian panic.',
    [
      makeAbility('bdo_basic', 'Blaster Pistol', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('bdo_special_1', 'Invasion Orders', 'special', 3, 'All Droid allies gain Offense Up (2 turns) and 15% Turn Meter.', ['Offense Up', 'turn_meter_gain_aoe'], ['defensive'])
    ],
    'Separatists',
    3400,
    'Supports B1 armies and raises offense',
    { speed: 120, offense: 1400, hp: 18000, protection: 12000 }
  ),
  createCharacter(
    'droideka_elite',
    'Elite Droideka',
    'Tank',
    ['Separatist', 'Droid', 'NPC'],
    'Elite rolling destroyer with persistent shields and high single-target counter chance.',
    [
      makeAbility('dde_basic', 'Twin Blaster Cannons', 'basic', 0, 'Deal Physical Damage twice. Inflict Target Lock (2 turns).', ['damage_single'], ['offensive']),
      makeAbility('dde_special_1', 'Reconstruction Barrier', 'special', 3, 'Gain Taunt and 50% Protection Up (2 turns).', ['Taunt', 'Protection Up'], ['defensive'])
    ],
    'Separatists',
    4200,
    'Deploys robust energy barriers and counters',
    { speed: 104, offense: 1800, hp: 28000, protection: 35000 }
  ),
  createCharacter(
    'security_droid',
    'Security Droid',
    'Attacker',
    ['Separatist', 'Droid', 'NPC'],
    'Standard security defense droid.',
    [
      makeAbility('sd_basic', 'Pulse Blaster', 'basic', 0, 'Deal Special Damage.', ['damage_single'], ['offensive']),
      makeAbility('sd_special_1', 'Suppressive Strike', 'special', 3, 'Deal Special Damage and inflict Speed Down.', ['damage_single', 'Speed Down'], ['offensive'])
    ],
    'Separatists',
    3100,
    'Inflicts Speed Down and targets low protection units',
    { speed: 110, offense: 1500, hp: 15000, protection: 8000 }
  ),
  createCharacter(
    'hired_gun_leader',
    'Hired Gun Leader',
    'Attacker',
    ['Hutt Cartel', 'Scoundrel', 'NPC'],
    'Ruthless scoundrel leader paid by Count Dooku to ambush Jedi.',
    [
      makeAbility('hgl_basic', 'Hefty Slugger', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('hgl_special_1', 'Grenade Salvo', 'special', 3, 'Deal Physical Damage to all enemies. Inflict Damage Over Time.', ['damage_aoe'], ['offensive'])
    ],
    'Hutt Cartel',
    3500,
    'Deals damage and inflicts Damage Over Time',
    { speed: 114, offense: 1700, hp: 19000, protection: 14000 }
  ),
  createCharacter(
    'nightsister_guardian',
    'Nightsister Guardian',
    'Tank',
    ['Nightsister', 'NPC'],
    'Defensive witch of Dathomir using dark magick to guard allies.',
    [
      makeAbility('nsg_basic', 'Corrupted Glaive', 'basic', 0, 'Deal Physical Damage. 50% chance to Daze.', ['damage_single'], ['offensive']),
      makeAbility('nsg_special_1', 'Magick Guard', 'special', 3, 'Gain Taunt and Defense Up. Nightsister allies recover 10% Health.', ['Taunt', 'Defense Up'], ['defensive'])
    ],
    'Nightsisters',
    3800,
    'Shields Nightsisters and heals with dark magick',
    { speed: 108, offense: 1300, hp: 30000, protection: 18000 }
  ),
  createCharacter(
    'nightsister_zombie',
    'Nightsister Zombie',
    'Tank',
    ['Nightsister', 'NPC'],
    'Mindless undead nightsister who continuously revives and Taunts.',
    [
      makeAbility('nsz_basic', 'Rotting Claw', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('nsz_special_1', 'Undead Hunger', 'special', 3, 'Gain Taunt (1 turn). Recover 20% Health.', ['Taunt'], ['defensive'])
    ],
    'Nightsisters',
    3400,
    'Undead tank that revives and draws enemy focus',
    { speed: 112, offense: 1100, hp: 26000, protection: 5000 }
  ),
  createCharacter(
    'nightsister_acolyte',
    'Nightsister Acolyte',
    'Attacker',
    ['Nightsister', 'NPC'],
    'Stealthy bowman who recovers Health on critical hits.',
    [
      makeAbility('nsa_basic', 'Vampiric Arrow', 'basic', 0, 'Deal Physical Damage. Gain Stealth (2 turns) on Crit.', ['damage_single'], ['offensive']),
      makeAbility('nsa_special_1', 'Draining Shot', 'special', 3, 'Deal Special Damage. All Nightsister allies gain 15% Turn Meter.', ['damage_single'], ['offensive'])
    ],
    'Nightsisters',
    3600,
    'Stealth attacker who heals on critical strikes',
    { speed: 122, offense: 2100, hp: 14000, protection: 8000 }
  ),
  createCharacter(
    'assassin_droid',
    'Assassin Droid',
    'Attacker',
    ['Scoundrel', 'Droid', 'NPC'],
    'Lethal automated killer reprogrammed for target termination.',
    [
      makeAbility('ad_basic', 'Assault Rifle', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('ad_special_1', 'Assassinate', 'special', 4, 'Deal heavy Physical Damage. High critical strike chance.', ['damage_heavy'], ['offensive'])
    ],
    'Bounty Hunters',
    3300,
    'Deals massive single-target critical damage',
    { speed: 118, offense: 2000, hp: 15000, protection: 10000 }
  ),
  createCharacter(
    'ig86_assassin_droid',
    'IG-86 Assassin Droid',
    'Attacker',
    ['Scoundrel', 'Droid', 'NPC'],
    'Calculated Droid attacker who calls allies to assist.',
    [
      makeAbility('ig86_basic', 'Precision Laser', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('ig86_special_1', 'Dual Laser Strike', 'special', 3, 'Deal Physical Damage and call an ally to assist.', ['damage_single'], ['offensive'])
    ],
    'Bounty Hunters',
    3400,
    'Assists and executes high-damage shots',
    { speed: 116, offense: 1900, hp: 16000, protection: 12000 }
  ),
  createCharacter(
    'durge',
    'Durge',
    'Attacker / Tank',
    ['Bounty Hunter', 'Scoundrel', 'NPC'],
    'Legendary Gen\'Dai bounty hunter with incredible cellular regeneration.',
    [
      makeAbility('durge_basic', 'Heavy Blaster Pistols', 'basic', 0, 'Deal Physical Damage twice. Inflict Healing Immunity (1 turn).', ['damage_single'], ['offensive']),
      makeAbility('durge_special_1', 'Gen\'Dai Rage', 'special', 3, 'Gain Taunt and 30% Protection Up. Dispel all debuffs on self.', ['Taunt', 'Protection Up'], ['defensive'])
    ],
    'Bounty Hunters',
    4800,
    'Indestructible regenerative warrior with heavy fire power',
    { speed: 110, offense: 2200, hp: 35000, protection: 25000 }
  ),
  createCharacter(
    'purge_trooper',
    'Purge Trooper',
    'Attacker',
    ['Galactic Empire', 'Inquisitorius', 'NPC'],
    'Specialist imperial soldier trained specifically to hunt Jedi.',
    [
      makeAbility('pt_basic', 'Electrostaff Sweep', 'basic', 0, 'Deal Physical Damage. Inflict 1 stack of Purge.', ['damage_single'], ['offensive']),
      makeAbility('pt_special_1', 'Jedi Suppression', 'special', 3, 'Deal heavy Physical Damage. If target is Jedi: Inflict Ability Block (1 turn).', ['damage_heavy'], ['offensive'])
    ],
    'Galactic Empire',
    3600,
    'Applies Purge and locks down Jedi enemies',
    { speed: 122, offense: 1900, hp: 18000, protection: 15000 }
  ),
  createCharacter(
    'fifth_brother',
    'Fifth Brother',
    'Attacker / Tank',
    ['Galactic Empire', 'Inquisitorius', 'NPC'],
    'Aggressive, bulky Inquisitor who uses brute physical strength to batter opponents.',
    [
      makeAbility('fb_basic', 'Saber Smash', 'basic', 0, 'Deal Physical Damage. Inflict Purge.', ['damage_single'], ['offensive']),
      makeAbility('fb_special_1', 'Force Shove', 'special', 3, 'Deal Physical Damage to all enemies. Inflict Speed Down (2 turns).', ['damage_aoe'], ['offensive'])
    ],
    'Inquisitorius',
    4200,
    'Aggressive tank that sweeps enemies and applies Purge',
    { speed: 114, offense: 1600, hp: 26000, protection: 20000 }
  ),
  createCharacter(
    'seventh_sister',
    'Seventh Sister',
    'Support / Saboteur',
    ['Galactic Empire', 'Inquisitorius', 'NPC'],
    'Agile Inquisitor who deploys ID9 seeker droids to track and disrupt targets.',
    [
      makeAbility('ss_basic', 'Acrobatic Strike', 'basic', 0, 'Deal Special Damage. Inflict Purge.', ['damage_single'], ['offensive']),
      makeAbility('ss_special_1', 'ID9 Seeker Probe', 'special', 3, 'Inflict Ability Block and Buff Immunity (2 turns). Recover 10% Protection.', ['debuff'], ['debuff'])
    ],
    'Inquisitorius',
    4000,
    'Disrupts enemy actions and blocks buffs',
    { speed: 128, offense: 1500, hp: 20000, protection: 18000 }
  ),
  createCharacter(
    'eighth_brother',
    'Eighth Brother',
    'Attacker',
    ['Galactic Empire', 'Inquisitorius', 'NPC'],
    'Nimble saber-copter dual-attacker specializing in high critical outputs.',
    [
      makeAbility('eb_basic', 'Saber Helispin', 'basic', 0, 'Deal Physical Damage twice. Inflict Purge.', ['damage_single'], ['offensive']),
      makeAbility('eb_special_1', 'Inquisitorial Flurry', 'special', 4, 'Deal heavy Physical Damage. Gain Stealth (2 turns) on Crit.', ['damage_heavy'], ['offensive'])
    ],
    'Inquisitorius',
    4100,
    'High-speed, dual-striking stealth assassin',
    { speed: 130, offense: 2200, hp: 17000, protection: 14000 }
  ),
  createCharacter(
    'ninth_sister',
    'Ninth Sister',
    'Tank',
    ['Galactic Empire', 'Inquisitorius', 'NPC'],
    'Colossal Dowutin Inquisitor with immense defensive resilience and crowd control.',
    [
      makeAbility('ns9_basic', 'Ground Slam', 'basic', 0, 'Deal Physical Damage. Inflict Purge on target.', ['damage_single'], ['offensive']),
      makeAbility('ns9_special_1', 'Unstoppable Bulk', 'special', 3, 'Gain Taunt (2 turns) and Defense Up. Inflict Offense Down on all enemies.', ['Taunt', 'Defense Up'], ['defensive'])
    ],
    'Inquisitorius',
    4500,
    'Heavy armored tank that debuffs enemy offense',
    { speed: 106, offense: 1300, hp: 32000, protection: 28000 }
  ),
  createCharacter(
    'purge_commander',
    'Purge Trooper Commander',
    'Support',
    ['Galactic Empire', 'Inquisitorius', 'NPC'],
    'High-ranking Purge Trooper directing tactics and commanding trooper formations.',
    [
      makeAbility('pc_basic', 'Rifle Burst', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('pc_special_1', 'Coordinate Purge', 'special', 3, 'All Empire and Inquisitorius allies gain Offense Up and 15% Turn Meter.', ['Offense Up'], ['defensive'])
    ],
    'Galactic Empire',
    3800,
    'Coordinates Purge Trooper divisions with team-wide buffs',
    { speed: 120, offense: 1500, hp: 20000, protection: 18000 }
  ),
  createCharacter(
    'fortress_security_droid',
    'Fortress Security Droid',
    'Tank',
    ['Galactic Empire', 'NPC', 'Droid'],
    'Heavy automated military guard of the ocean fortress.',
    [
      makeAbility('fsd_basic', 'Security Claw', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('fsd_special_1', 'Fortress Lockup', 'special', 3, 'Gain Taunt (2 turns) and Retribution (2 turns).', ['Taunt'], ['defensive'])
    ],
    'Galactic Empire',
    3900,
    'Heavy fortress defender with Retribution counters',
    { speed: 104, offense: 1200, hp: 25000, protection: 25000 }
  ),
  createCharacter(
    'acklay_raid',
    'Acklay Alpha',
    'Attacker',
    ['Beast', 'NPC'],
    'Colossal predatory beast from Geonosis with armor-piercing claws.',
    [
      makeAbility('aa_basic', 'Scythe Slash', 'basic', 0, 'Deal heavy Physical Damage. Ignore 30% Defense.', ['damage_single'], ['offensive']),
      makeAbility('aa_special_1', 'Frenzy Shriek', 'special', 4, 'Deal Physical Damage to all enemies. Inflict Daze.', ['damage_aoe'], ['offensive'])
    ],
    'Geonosians',
    5500,
    'Slashes through defenses and dazes groups',
    { speed: 112, offense: 2500, hp: 45000, protection: 20000 }
  ),
  createCharacter(
    'nexu',
    'Nexu',
    'Attacker',
    ['Beast', 'NPC'],
    'Agile feline predator with sharp claws and stealthy reflexes.',
    [
      makeAbility('nexu_basic', 'Pounce Strike', 'basic', 0, 'Deal Physical Damage. Gain Stealth (1 turn) on Crit.', ['damage_single'], ['offensive']),
      makeAbility('nexu_special_1', 'Maul Claw', 'special', 3, 'Deal heavy Physical Damage. Inflict Damage Over Time (2 turns).', ['damage_heavy'], ['offensive'])
    ],
    'Geonosians',
    3500,
    'Agile critical attacker that inflicts bleeds',
    { speed: 124, offense: 2000, hp: 15000, protection: 5000 }
  ),
  createCharacter(
    'acklay',
    'Acklay',
    'Attacker',
    ['Beast', 'NPC'],
    'Vicious razor-sharp coliseum crustacean.',
    [
      makeAbility('acklay_basic', 'Crustacean Claw', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('acklay_special_1', 'Savage Bite', 'special', 3, 'Deal heavy Physical Damage. 50% chance to Daze.', ['damage_heavy'], ['offensive'])
    ],
    'Geonosians',
    4500,
    'Heavy slasher with high base physical damage',
    { speed: 108, offense: 2200, hp: 25000, protection: 12000 }
  ),
  createCharacter(
    'reek',
    'Reek',
    'Tank / Attacker',
    ['Beast', 'NPC'],
    'Mammoth-like beast with massive horns who stampedes through armor.',
    [
      makeAbility('reek_basic', 'Horn Gash', 'basic', 0, 'Deal Physical Damage. 50% chance to Inflict Offense Down.', ['damage_single'], ['offensive']),
      makeAbility('reek_special_1', 'Coliseum Stampede', 'special', 4, 'Deal Physical Damage to all enemies and gain Taunt (2 turns).', ['damage_aoe', 'Taunt'], ['defensive'])
    ],
    'Geonosians',
    4800,
    'Indestructible charging beast that Taunts',
    { speed: 102, offense: 1800, hp: 35000, protection: 25000 }
  ),
  createCharacter(
    'arena_handler',
    'Coliseum Handler',
    'Support',
    ['Geonosian', 'NPC'],
    'Geonosian handler who directs beasts and whips prisoners.',
    [
      makeAbility('ah_basic', 'Energy Whip', 'basic', 0, 'Deal Special Damage.', ['damage_single'], ['offensive']),
      makeAbility('ah_special_1', 'Direct Beasts', 'special', 3, 'All Beast and Geonosian allies gain Offense Up (2 turns) and 20% Turn Meter.', ['Offense Up'], ['defensive'])
    ],
    'Geonosians',
    3400,
    'Inspires arena beasts with heavy buffs',
    { speed: 118, offense: 1300, hp: 16000, protection: 10000 }
  ),
  createCharacter(
    'geonosian_handler',
    'Geonosian Handler',
    'Support',
    ['Geonosian', 'NPC'],
    'Whip-cracking arena overseer.',
    [
      makeAbility('gh_basic', 'Shock Prod', 'basic', 0, 'Deal Special Damage.', ['damage_single'], ['offensive']),
      makeAbility('gh_special_1', 'Unleash Monsters', 'special', 3, 'Give all Beast allies Speed Up (2 turns).', ['Speed Up'], ['defensive'])
    ],
    'Geonosians',
    3300,
    'Speeds up coliseum beasts',
    { speed: 116, offense: 1200, hp: 15000, protection: 10000 }
  ),
  createCharacter(
    'droid_foundry_core',
    'Foundry Power Core',
    'Tank',
    ['Droid', 'NPC'],
    'Immense power reactor powering the droid manufacturing facility. Extremely durable.',
    [
      makeAbility('dfc_basic', 'Static Charge', 'basic', 0, 'Deal Special Damage. 25% chance to Shock.', ['damage_single'], ['offensive']),
      makeAbility('dfc_special_1', 'Overload', 'special', 5, 'Deal massive Special Damage to all enemies.', ['damage_aoe'], ['offensive'])
    ],
    'Separatists',
    6000,
    'Extremely tanky mechanical reactor core',
    { speed: 90, offense: 1000, hp: 60000, protection: 80000 }
  ),
  createCharacter(
    'dak_ralter',
    'Dak Ralter',
    'Support',
    ['Rebel', 'NPC'],
    'Rogue Squadron co-pilot who supports Luke Skywalker with coordinates.',
    [
      makeAbility('dak_basic', 'Blaster Pistol', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('dak_special_1', 'Harpoon Launch', 'special', 3, 'Inflict Speed Down and Pin (2 turns) on target enemy.', ['Speed Down'], ['debuff'])
    ],
    'Rebel Alliance',
    3500,
    'Disrupts enemies and provides target coordinate assists',
    { speed: 120, offense: 1400, hp: 17000, protection: 15000 }
  ),
  createCharacter(
    'pikk_mukmuk',
    'Pikk Mukmuk',
    'Support',
    ['Scoundrel', 'NPC'],
    'Kowakian monkey-lizard trainer of Hondo\'s pirate crew.',
    [
      makeAbility('pm_basic', 'Blaster Burst', 'basic', 0, 'Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('pm_special_1', 'Monkey-Lizard Chaos', 'special', 3, 'Inflict Speed Down and Offense Down on target enemy.', ['debuff'], ['debuff'])
    ],
    'Scoundrels',
    3400,
    'Disrupts targets with monkey-lizard chaos',
    { speed: 122, offense: 1300, hp: 15000, protection: 12000 }
  ),
  createCharacter(
    'republic_commando',
    'Republic Commando',
    'Attacker',
    ['Galactic Republic', 'Clone Trooper', 'NPC'],
    'Elite clone commando dealing heavy critical damage and armor shred.',
    [
      makeAbility('commando_basic', 'Deceive Blaster', 'basic', 0, 'Deal Physical Damage. Ignore 20% Defense.', ['damage_single'], ['offensive']),
      makeAbility('commando_special_1', 'Vibroblade Slash', 'special', 3, 'Deal massive Physical Damage. Inflict Healing Immunity (2 turns).', ['damage_heavy', 'Healing Immunity'], ['offensive'])
    ],
    'Galactic Republic',
    3900,
    'Deals massive armor-penetrating damage',
    { speed: 124, offense: 2400, hp: 17000, protection: 14000 }
  )
];
