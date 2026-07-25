import { Character, Ability } from '../../types';
import { makeAbility } from '../characters_base';

export const NEW_REPUBLIC_CHARACTERS: Character[] = [
  // General Hera
  {
    id: 'general_hera',
    name: 'General Hera',
    tags: ['rebel', 'spectre', 'new_republic'],
    role: 'Support',
    lore: 'A combatant of the New Republic era.',
    faction: 'Rebel',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 165, hp: 40000, protection: 40000, offense: 4500, defense: 4000, critChance: 0.3, critDamage: 1.5, tenacity: 0.5, potency: 0.5 },
    abilities: [
      makeAbility('general_hera_basic', 'Phoenix Command', 'basic', 0, 'Deal Physical Damage. Random Spectre ally gains Speed Up (1 turn). If Hera has Unconventional Tactics: Random Spectre ally recovers 5% Protection.', ['damage_single', 'Speed Up'], ['offensive']),
      makeAbility('general_hera_special_1', 'Rebel Coordination', 'special', 3, 'All Spectre allies gain Defense Up (2 turns) and recover 10% Protection. Refresh Unconventional Tactics on all Spectre allies.', ['Defense Up', 'heal_ally'], ['defensive']),
      makeAbility('general_hera_special_2', 'Emergency Maneuver', 'special', 4, 'Cleanse all debuffs from target ally. Target ally gains Foresight (2 turns) and Unconventional Tactics.', ['cleanse_ally', 'Foresight', 'Unconventional Tactics'], ['defensive']),
      makeAbility('general_hera_leader', 'Phoenix Reborn', 'leader', 0, 'At battle start: All Spectre allies gain Unconventional Tactics. Spectre allies gain +25 Speed and +20% Max Health. Whenever Spectre allies trigger Unconventional Tactics: Recover 2% Protection. Whenever Spectre allies fall below 50% Health: Gain Defense Up (1 turn).', ['Unconventional Tactics', 'Defense Up'], []),
      makeAbility('general_hera_unique', 'The Crew Comes First', 'unique', 0, 'Whenever Spectre allies gain buffs: Hera gains 5% Turn Meter. Whenever Spectre allies assist: Random Spectre ally recovers 3% Protection.', ['turn_meter_gain', 'heal_ally'], [])
    ]
  },
  // Chopper
  {
    id: 'chopper',
    name: 'Chopper',
    tags: ['droid', 'spectre'],
    role: 'Saboteur',
    lore: 'A combatant of the New Republic era.',
    faction: 'Rebel',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 170, hp: 35000, protection: 35000, offense: 3500, defense: 5000, critChance: 0.2, critDamage: 1.5, tenacity: 0.4, potency: 0.8 },
    abilities: [
      makeAbility('chopper_basic', 'Chaotic Shock', 'basic', 0, 'Deal Special Damage. 50% chance to inflict Buff Immunity (1 turn).', ['damage_single', 'Buff Immunity'], ['offensive']),
      makeAbility('chopper_special_1', 'Droid Interference', 'special', 3, 'All enemies lose 5% Turn Meter. Inflict Offense Down (2 turns).', ['turn_meter_reduction', 'Offense Down'], ['debuff']),
      makeAbility('chopper_special_2', 'Improvised Disaster', 'special', 4, 'Random enemy suffers two of the following: Daze (2 turns), Buff Immunity (2 turns), Speed Down (2 turns), Offense Down (2 turns). Chopper gains Stealth (2 turns).', ['Daze', 'Buff Immunity', 'Speed Down', 'Offense Down', 'Stealth'], ['debuff']),
      makeAbility('chopper_unique', 'Walking Disaster', 'unique', 0, 'Whenever Chopper takes damage: Random enemy suffers one: Daze (1 turn), Buff Immunity (1 turn), Lose 5% Turn Meter, Offense Down (1 turn). Whenever Chopper triggers Unconventional Tactics: Trigger an additional random effect.', ['Daze', 'Buff Immunity', 'Offense Down'], [])
    ]
  },
  // Huyang
  {
    id: 'huyang',
    name: 'Huyang',
    tags: ['droid', 'spectre'],
    role: 'Attacker',
    lore: 'A combatant of the New Republic era.',
    faction: 'Rebel',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 155, hp: 40000, protection: 30000, offense: 5500, defense: 3500, critChance: 0.4, critDamage: 1.8, tenacity: 0.6, potency: 0.4 },
    abilities: [
      makeAbility('huyang_basic', 'Precision Guidance', 'basic', 0, 'Deal Special Damage. Huyang gains Critical Chance Up (1 turn).', ['damage_single', 'Critical Chance Up'], ['offensive']),
      makeAbility('huyang_special_1', 'Ancient Instruction', 'special', 3, 'Target ally gains Offense Up (2 turns) and Critical Chance Up (2 turns). Huyang assists.', ['Offense Up', 'Critical Chance Up', 'assist'], ['defensive']),
      makeAbility('huyang_special_2', 'Ten Thousand Years', 'special', 4, 'Deal Special Damage to all enemies. Enemies with debuffs take bonus damage.', ['damage_aoe'], ['offensive']),
      makeAbility('huyang_unique', 'Archive of War', 'unique', 0, 'Whenever allies gain buffs: Huyang gains +2% Offense (stacking). Whenever enemies gain buffs: Huyang gains +2% Offense (stacking). Whenever Chopper acts: Huyang gains 2% Turn Meter.', ['turn_meter_gain'], [])
    ]
  },
  // Sabine Wren (Apprentice)
  {
    id: 'sabine_apprentice',
    name: 'Sabine Wren (Apprentice)',
    tags: ['spectre', 'mandalorian'],
    role: 'Attacker',
    lore: 'A combatant of the New Republic era.',
    faction: 'Rebel',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 168, hp: 35000, protection: 35000, offense: 6000, defense: 3500, critChance: 0.6, critDamage: 2.0, tenacity: 0.5, potency: 0.5 },
    abilities: [
      makeAbility('sabine_apprentice_basic', 'Twin Blaster Burst', 'basic', 0, 'Attack twice. Deal Physical Damage.', ['damage_single'], ['offensive']),
      makeAbility('sabine_apprentice_special_1', 'Explosive Flourish', 'special', 3, 'Deal Physical Damage to all enemies. Inflict Defense Down (2 turns).', ['damage_aoe', 'Defense Down'], ['offensive']),
      makeAbility('sabine_apprentice_special_2', 'Apprentice Reflexes', 'special', 4, 'Sabine gains Foresight (2 turns), Critical Damage Up (2 turns), and a Bonus Turn.', ['Foresight', 'Critical Damage Up', 'bonus_turn'], ['defensive']),
      makeAbility('sabine_apprentice_unique', 'Explosive Improvisation', 'unique', 0, 'Whenever Spectre allies trigger Unconventional Tactics: Sabine gains 5% Turn Meter. Whenever enemies gain debuffs: Sabine gains Offense Up (1 turn). Critical Hits have 30% chance to inflict Armor Shred.', ['turn_meter_gain', 'Offense Up', 'Armor Shred'], [])
    ]
  },
  // Zeb Orrelios (New Republic)
  {
    id: 'zeb_nr',
    name: 'Zeb Orrelios (New Republic)',
    tags: ['spectre', 'new_republic'],
    role: 'Tank',
    lore: 'A combatant of the New Republic era.',
    faction: 'Rebel',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 140, hp: 60000, protection: 50000, offense: 4500, defense: 6500, critChance: 0.25, critDamage: 1.5, tenacity: 0.8, potency: 0.4 },
    abilities: [
      makeAbility('zeb_nr_basic', 'Lasat Staff Strike', 'basic', 0, 'Deal Physical Damage. 30% chance to inflict Stun (1 turn).', ['damage_single', 'Stun'], ['offensive']),
      makeAbility('zeb_nr_special_1', 'Lasat Smash', 'special', 3, 'Deal massive Physical Damage. Ignore Protection.', ['damage_single', 'ignore_protection'], ['offensive']),
      makeAbility('zeb_nr_special_2', 'Guardian Instinct', 'special', 4, 'Gain Taunt (2 turns), Defense Up (2 turns), and Protection Up (20%).', ['Taunt', 'Defense Up', 'Protection Up'], ['defensive']),
      makeAbility('zeb_nr_unique', 'Last Line Standing', 'unique', 0, 'Whenever Spectre allies fall below 50% Health: Zeb gains Taunt (1 turn). Whenever Zeb counterattacks: Recover 5% Protection. Whenever Spectre allies trigger Unconventional Tactics: Zeb gains Defense Up (1 turn).', ['Taunt', 'heal_self', 'Defense Up'], [])
    ]
  },
  // Ezra Bridger (Exile)
  {
    id: 'ezra_exile',
    name: 'Ezra Bridger (Exile)',
    tags: ['spectre', 'journey_character'],
    role: 'Support',
    lore: 'A combatant of the New Republic era.',
    faction: 'Rebel',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 160, hp: 50000, protection: 60000, offense: 2000, defense: 6000, critChance: 0.1, critDamage: 1.5, tenacity: 0.9, potency: 0.4 },
    abilities: [
      makeAbility('ezra_exile_basic', 'Trust The Current', 'basic', 0, 'Ezra cannot deal damage. Random Spectre ally recovers 5% Protection and gains Foresight (1 turn).', ['heal_ally', 'Foresight'], ['defensive']),
      makeAbility('ezra_exile_special_1', 'Beyond Sight', 'special', 3, 'All Spectre allies gain Foresight (1 turn). Cleanse all debuffs from Spectre allies. Refresh Unconventional Tactics on all Spectre allies.', ['Foresight', 'cleanse_ally', 'Unconventional Tactics'], ['defensive']),
      makeAbility('ezra_exile_special_2', 'Let Go', 'special', 4, 'All Spectre allies recover 10% Health and 10% Protection. Weakest Spectre ally gains a Bonus Turn.', ['heal_ally', 'bonus_turn'], ['defensive']),
      makeAbility('ezra_exile_leader', 'Exiled Wisdom', 'leader', 0, 'Spectre allies gain +20 Speed and +15% Evasion. Whenever Spectre allies gain Unconventional Tactics: Recover 2% Protection. Whenever allies evade: Recover 2% Health.', ['heal_ally'], []),
      makeAbility('ezra_exile_unique', 'One With The Force', 'unique', 0, 'Ezra cannot critically hit and deals no damage. Ezra cannot be targeted while another Spectre ally is active. Whenever Spectre allies fall below 50% Health: Grant Foresight (1 turn). Whenever Spectre allies trigger Unconventional Tactics: Recover 2% Health. If Ezra becomes the last surviving ally: Ezra retreats from battle.', ['Foresight', 'heal_ally'], [])
    ]
  },
  // Agent Kallus (Conquest)
  {
    id: 'agent_kallus',
    name: 'Agent Kallus',
    tags: ['rebel', 'spectre', 'new_republic'],
    role: 'Support',
    lore: 'A combatant of the New Republic era.',
    faction: 'Rebel',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 160, hp: 45000, protection: 50000, offense: 4000, defense: 4500, critChance: 0.3, critDamage: 1.5, tenacity: 0.6, potency: 0.7 },
    abilities: [
      makeAbility('kallus_basic', 'Inside Information', 'basic', 0, 'Deal Physical Damage. If target has buffs: Remove 1 buff and gain 1 Intel.', ['damage_single', 'dispel_buff', 'Intel'], ['offensive']),
      makeAbility('kallus_special_1', 'Imperial Weaknesses', 'special', 3, 'Remove all buffs from target enemy. Inflict Exposed (2 turns). Against Empire or ISB enemies: Inflict Defense Down (2 turns).', ['dispel_buff', 'Exposed', 'Defense Down'], ['debuff']),
      makeAbility('kallus_special_2', 'Fulcrum Network', 'special', 4, 'Consume all Intel. For each Intel consumed: All allies recover 1% Protection and enemies lose 1% Turn Meter. At 10 Intel: Spectre allies gain Offense Up (2 turns).', ['heal_ally', 'turn_meter_reduction', 'Offense Up'], ['defensive']),
      makeAbility('kallus_unique', 'Former ISB', 'unique', 0, 'Whenever enemies gain buffs, gain Turn Meter, or Empire/ISB enemies act: Gain 1 Intel. Maximum 10 stacks. Whenever Kallus reaches 10 Intel: Gain Bonus Turn.', ['Intel', 'bonus_turn'], [])
    ]
  },
  // Ahsoka Tano (The Grey)
  {
    id: 'ahsoka_tano_grey',
    name: 'Ahsoka Tano (The Grey)',
    tags: ['spectre', 'galactic_legend'],
    role: 'Attacker',
    lore: 'A combatant of the New Republic era.',
    faction: 'Rebel',
    powerLevel: 8500,
    isLegend: true,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 185, hp: 90000, protection: 80000, offense: 9000, defense: 6000, critChance: 0.6, critDamage: 2.5, tenacity: 1.0, potency: 0.8 },
    abilities: [
      makeAbility('ahsoka_grey_basic', 'Twin Blade Harmony', 'basic', 0, 'Attack target enemy twice. Deal Physical Damage. Gain 1 Insight.', ['damage_single', 'Insight'], ['offensive']),
      makeAbility('ahsoka_grey_special_1', 'Fulcrum Signal', 'special', 3, 'Cleanse all allies. Spectre allies gain Foresight (2 turns) and Speed Up (2 turns). Gain 3 Insight.', ['cleanse_ally', 'Foresight', 'Speed Up', 'Insight'], ['defensive']),
      makeAbility('ahsoka_grey_special_2', 'I Am No Jedi', 'special', 4, 'Attack target enemy. Ignore Taunt. Deal massive Physical Damage. Inflict Healing Immunity (2 turns) and Defense Down (2 turns). Gain 5 Insight.', ['damage_single', 'ignore_taunt', 'Healing Immunity', 'Defense Down', 'Insight'], ['offensive']),
      makeAbility('ahsoka_grey_special_3', 'Path Between Worlds', 'special', 4, 'All allies recover 20% Protection and 10% Health. Spectre allies assist dealing reduced damage. Gain 5 Insight.', ['heal_ally', 'assist_team', 'Insight'], ['defensive']),
      makeAbility('ahsoka_grey_leader', 'Between Light And Dark', 'leader', 0, 'Spectre allies gain +35 Speed and +20% Evasion. Whenever Spectre allies trigger Unconventional Tactics: Recover 3% Protection and gain 2% Turn Meter. Whenever allies evade or gain buffs/debuffs: Gain 1 Insight.', ['turn_meter_gain', 'heal_ally', 'Insight'], []),
      makeAbility('ahsoka_grey_unique', 'The Grey Jedi', 'unique', 0, 'Ahsoka is immune to Ability Block and Daze. Whenever Spectre allies trigger Unconventional Tactics: Gain 2 Insight. At 10 Insight: Gain Bonus Turn. At 20 Insight: Reset all cooldowns, gain Offense Up (2 turns) and Critical Damage Up (2 turns).', ['bonus_turn', 'Offense Up', 'Critical Damage Up'], []),
      makeAbility('ahsoka_grey_ultimate', 'Balance Of The Force', 'ultimate', 0, 'Activate at 100% Ultimate Charge. Revive all defeated Spectre allies with 50% Health and Protection. All allies gain Foresight (2 turns), Offense Up (2 turns), and Defense Up (2 turns). Then: All Spectre allies assist.', ['revive', 'Foresight', 'Offense Up', 'Defense Up', 'assist_team'], ['ultimate'], 100)
    ]
  },
  // Bo-Katan (Mand'alor)
  {
    id: 'bo_katan_mandalor',
    name: "Bo-Katan (Mand'alor)",
    tags: ['mandalorian', 'mandalore', 'journey_character'],
    role: 'Attacker',
    lore: 'A combatant of the New Republic era.',
    faction: 'Mandalorian',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 175, hp: 80000, protection: 0, offense: 8500, defense: 5000, critChance: 0.6, critDamage: 2.2, tenacity: 0.7, potency: 0.6 },
    abilities: [
      makeAbility('bo_katan_mandalor_basic', 'Darksaber Assault', 'basic', 0, 'Deal Physical Damage. Inflict Armor Shred (2 turns). If target already has Armor Shred: Attack again for 50% reduced damage.', ['damage_single', 'Armor Shred'], ['offensive']),
      makeAbility('bo_katan_mandalor_special_1', 'Reclaim Mandalore', 'special', 3, 'Deal Physical Damage to all enemies. Inflict Defense Down (2 turns). Enemies with Armor Shred lose 10% Turn Meter.', ['damage_aoe', 'Defense Down', 'turn_meter_reduction'], ['offensive']),
      makeAbility('bo_katan_mandalor_special_2', 'Rally The Clans', 'special', 4, 'All Mandalore allies gain Blaze Of Glory (2 turns) and recover 10% Health. Axe Woves assists.', ['Blaze Of Glory', 'heal_ally', 'assist'], ['defensive']),
      makeAbility('bo_katan_mandalor_leader', "The Mand'alor", 'leader', 0, 'At battle start: All units lose all Protection and it is converted into Health. Protection cannot be recovered or gained. Mandalore allies gain +25 Speed. Whenever Mandalore allies critically hit: Recover 3% Health.', ['heal_ally'], []),
      makeAbility('bo_katan_mandalor_unique', 'Heir Of The Darksaber', 'unique', 0, 'Whenever enemies gain buffs: Bo-Katan gains 5% Turn Meter. Whenever enemies suffer Armor Shred: Bo-Katan gains Offense Up (1 turn). Armor Shred cannot be resisted while Bo-Katan is active.', ['turn_meter_gain', 'Offense Up'], [])
    ]
  },
  // Din Djarin (Beskar)
  // Paz Vizsla
  {
    id: 'paz_vizsla',
    name: 'Paz Vizsla',
    tags: ['mandalorian', 'mandalore'],
    role: 'Tank',
    lore: 'A combatant of the New Republic era.',
    faction: 'Mandalorian',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 135, hp: 70000, protection: 50000, offense: 5000, defense: 7500, critChance: 0.3, critDamage: 1.5, tenacity: 0.6, potency: 0.4 },
    abilities: [
      makeAbility('paz_vizsla_basic', 'Heavy Repeater', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Offense Down (1 turn).', ['damage_single', 'Offense Down'], ['offensive']),
      makeAbility('paz_vizsla_special_1', 'Hold The Line', 'special', 3, 'Recover 15% Health. Gain Defense Up (2 turns).', ['heal_self', 'Defense Up'], ['defensive']),
      makeAbility('paz_vizsla_special_2', 'Suppressive Barrage', 'special', 4, 'Deal Physical Damage to all enemies. Inflict Offense Down (2 turns).', ['damage_aoe', 'Offense Down'], ['offensive']),
      makeAbility('paz_vizsla_unique', 'The Living Bulwark', 'unique', 0, 'At battle start: Gain Taunt. Paz cannot lose Taunt while another Mandalore ally is active. Whenever Paz takes damage: Gain +5% Defense (stacking). Whenever Paz falls below 50% Health: Recover 10% Health. Allies take 20% reduced AoE damage while Paz is active.', ['Taunt', 'heal_self'], [])
    ]
  },
  // IG-12 & Grogu
  {
    id: 'ig12_grogu',
    name: 'IG-12 & Grogu',
    tags: ['droid', 'mandalorian', 'mandalore'],
    role: 'Saboteur',
    lore: 'A combatant of the New Republic era.',
    faction: 'Mandalorian',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 155, hp: 50000, protection: 30000, offense: 3500, defense: 5000, critChance: 0.2, critDamage: 1.5, tenacity: 0.8, potency: 0.7 },
    abilities: [
      makeAbility('ig12_grogu_basic', 'Yes.', 'basic', 0, 'Deal Physical Damage. Inflict Offense Down (1 turn).', ['damage_single', 'Offense Down'], ['offensive']),
      makeAbility('ig12_grogu_special_1', 'No.', 'special', 3, 'Target enemy gains Stun (1 turn). Ignores Tenacity.', ['Stun', 'ignore_tenacity'], ['debuff']),
      makeAbility('ig12_grogu_special_2', 'Force Trouble', 'special', 4, 'Random enemies gain two of: Daze (2 turns), Ability Block (1 turn), Healing Immunity (2 turns), Offense Down (2 turns). Ignores Tenacity.', ['Daze', 'Ability Block', 'Healing Immunity', 'Offense Down'], ['debuff']),
      makeAbility('ig12_grogu_unique', 'Tiny Menace', 'unique', 0, 'Whenever an enemy takes a turn: 25% chance to inflict one: Daze (1 turn), Ability Block (1 turn), Offense Down (1 turn). Ignores Tenacity. Whenever Din Djarin is present: Gain Foresight at battle start.', ['Daze', 'Ability Block', 'Offense Down', 'Foresight'], [])
    ]
  },
  // Axe Woves
  {
    id: 'axe_woves',
    name: 'Axe Woves',
    tags: ['mandalorian', 'mandalore'],
    role: 'Attacker',
    lore: 'A combatant of the New Republic era.',
    faction: 'Mandalorian',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 165, hp: 35000, protection: 30000, offense: 6500, defense: 3500, critChance: 0.5, critDamage: 1.8, tenacity: 0.5, potency: 0.4 },
    abilities: [
      makeAbility('axe_woves_basic', 'Jetpack Barrage', 'basic', 0, 'Deal Physical Damage. If target is below 50% Health: Deal bonus damage.', ['damage_single'], ['offensive']),
      makeAbility('axe_woves_special_1', 'Sky Assault', 'special', 3, 'Attack target enemy. Ignore Taunt. Deal massive Physical Damage.', ['damage_single', 'ignore_taunt'], ['offensive']),
      makeAbility('axe_woves_special_2', 'Clan Offensive', 'special', 4, 'Gain Offense Up (2 turns), Critical Chance Up (2 turns), and a Bonus Turn.', ['Offense Up', 'Critical Chance Up', 'bonus_turn'], ['defensive']),
      makeAbility('axe_woves_unique', 'Glory Seeker', 'unique', 0, 'Whenever enemies fall below 50% Health: Gain Offense Up (1 turn). Whenever attacking enemies below 50% Health: Ignore 25% Defense. Whenever allies gain Blaze Of Glory: Gain 10% Turn Meter.', ['Offense Up', 'turn_meter_gain'], [])
    ]
  },
  // Koska Reeves
  {
    id: 'koska_reeves',
    name: 'Koska Reeves',
    tags: ['mandalorian', 'mandalore'],
    role: 'Strategist',
    lore: 'A combatant of the New Republic era.',
    faction: 'Mandalorian',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 170, hp: 40000, protection: 35000, offense: 5500, defense: 4500, critChance: 0.4, critDamage: 1.5, tenacity: 0.6, potency: 0.5 },
    abilities: [
      makeAbility('koska_reeves_basic', 'Cover Volley', 'basic', 0, 'Deal Physical Damage. Random Mandalore ally recovers 5% Health.', ['damage_single', 'heal_ally'], ['offensive']),
      makeAbility('koska_reeves_special_1', 'Clan Coordination', 'special', 3, 'All Mandalore allies recover 10% Health and gain Defense Up (2 turns).', ['heal_ally', 'Defense Up'], ['defensive']),
      makeAbility('koska_reeves_special_2', 'Tactical Pursuit', 'special', 4, 'Deal Physical Damage. If target has debuffs: Mandalore allies assist dealing reduced damage.', ['damage_single', 'assist_team'], ['offensive']),
      makeAbility('koska_reeves_unique', 'Veteran Of The Clans', 'unique', 0, 'Whenever Mandalore allies critically hit: Recover 2% Health. Whenever Mandalore allies assist: Koska gains 5% Turn Meter. Whenever allies gain Blaze Of Glory: Recover 3% Health.', ['heal_ally', 'turn_meter_gain'], [])
    ]
  },
  // Grand Admiral Thrawn
  {
    id: 'grand_admiral_thrawn',
    name: 'Grand Admiral Thrawn (Chimaera Eternal)',
    tags: ['galactic_empire', 'imperial_remnant', 'second_empire', 'galactic_legend'],
    role: 'Leader',
    lore: 'A combatant of the New Republic era.',
    faction: 'Imperial Remnant',
    powerLevel: 8500,
    isLegend: true,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 180, hp: 85000, protection: 85000, offense: 7500, defense: 7500, critChance: 0.4, critDamage: 1.8, tenacity: 1.0, potency: 0.9 },
    abilities: [
      makeAbility('thrawn_gl_basic', 'Calculated Strike', 'basic', 0, 'Deal Physical Damage. Inflict Predicted.', ['damage_single', 'Predicted'], ['offensive']),
      makeAbility('thrawn_gl_special_1', 'Tactical Reposition', 'special', 3, 'Target ally gains Bonus Turn, Offense Up (2 turns), and Speed Up (2 turns).', ['bonus_turn', 'Offense Up', 'Speed Up'], ['defensive']),
      makeAbility('thrawn_gl_special_2', 'Art Of War', 'special', 4, 'Dispel all buffs from all enemies. Second Empire allies gain Critical Damage Up (2 turns) and Potency Up (2 turns).', ['dispel_enemies', 'Critical Damage Up', 'Potency Up'], ['debuff']),
      makeAbility('thrawn_gl_special_3', 'Predicted Maneuver', 'special', 1, 'Can only be used after gaining a Bonus Turn from Predicted. All allies gain 10% Turn Meter and recover 10% Protection.', ['turn_meter_gain', 'heal_ally'], ['defensive']),
      makeAbility('thrawn_gl_special_4', 'Predicted Countermeasure', 'special', 1, 'Can only be used after gaining a Bonus Turn from Predicted. Target enemy gains Ability Block (1 turn) and Offense Down (2 turns).', ['Ability Block', 'Offense Down'], ['debuff']),
      makeAbility('thrawn_gl_special_5', 'Predicted Exploitation', 'special', 1, 'Can only be used after gaining a Bonus Turn from Predicted. Deal massive Physical Damage. Ignore Defense. Inflict Exposed (2 turns).', ['damage_single', 'Exposed'], ['offensive']),
      makeAbility('thrawn_gl_leader', 'Heir To The Empire', 'leader', 0, 'Second Empire allies gain +35 Speed and +20% Potency. Whenever Predicted is consumed: All Second Empire allies gain 2% Turn Meter. Whenever Thrawn gains a Bonus Turn: Recover 5% Protection.', ['turn_meter_gain', 'heal_self'], []),
      makeAbility('thrawn_gl_unique', 'Master Strategist', 'unique', 0, 'Immune to Fear and Turn Meter Reduction. Whenever Predicted is consumed: Gain 1 Analysis. Maximum 20 Stacks. Whenever Thrawn gains a Bonus Turn: Gain Offense Up (1 turn).', ['Analysis', 'Offense Up'], []),
      makeAbility('thrawn_gl_ultimate', 'Grand Design', 'ultimate', 0, 'Activate at 100% Ultimate Charge. All enemies gain Predicted, Defense Down (2 turns), and Offense Down (2 turns). Thrawn gains 10 Analysis. All Second Empire allies gain Bonus Turn. Reset cooldowns of Predicted abilities.', ['Predicted', 'Defense Down', 'Offense Down', 'Analysis', 'bonus_turn'], ['ultimate'], 100)
    ]
  },
  // Captain Pellaeon
  {
    id: 'captain_pellaeon',
    name: 'Captain Pellaeon',
    tags: ['galactic_empire', 'imperial_remnant', 'second_empire', 'journey_character'],
    role: 'Leader',
    lore: 'A combatant of the New Republic era.',
    faction: 'Imperial Remnant',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 155, hp: 50000, protection: 50000, offense: 4500, defense: 6000, critChance: 0.3, critDamage: 1.5, tenacity: 0.6, potency: 0.5 },
    abilities: [
      makeAbility('pellaeon_basic', 'Ordered Fire', 'basic', 0, 'Deal Physical Damage. Gain Ordered Fire (2 turns). Random ally assists.', ['damage_single', 'Ordered Fire', 'assist'], ['offensive']),
      makeAbility('pellaeon_special_1', 'Fleet Coordination', 'special', 3, 'All allies gain Speed Up (2 turns) and recover 10% Protection.', ['Speed Up', 'heal_ally'], ['defensive']),
      makeAbility('pellaeon_special_2', 'Strategic Relay', 'special', 4, 'Target ally gains Bonus Turn. Reduce cooldowns by 1.', ['bonus_turn'], ['defensive']),
      makeAbility('pellaeon_leader', 'Last Admiral', 'leader', 0, 'Imperial Remnant allies gain +20 Speed and +20% Defense. Whenever allies gain Bonus Turns: Recover 2% Protection.', ['heal_ally'], []),
      makeAbility('pellaeon_unique', 'Foundation Of The Empire', 'unique', 0, 'Whenever Thrawn gains a Bonus Turn: Pellaeon gains 10% Turn Meter. Whenever Predicted is consumed: All allies recover 2% Protection.', ['turn_meter_gain', 'heal_ally'], [])
    ]
  },
  // Commander Enoch
  {
    id: 'commander_enoch',
    name: 'Commander Enoch',
    tags: ['galactic_empire', 'imperial_remnant', 'second_empire'],
    role: 'Leader',
    lore: 'A combatant of the New Republic era.',
    faction: 'Imperial Remnant',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 160, hp: 60000, protection: 40000, offense: 5000, defense: 6000, critChance: 0.4, critDamage: 1.5, tenacity: 0.7, potency: 0.6 },
    abilities: [
      makeAbility('enoch_basic', 'March Of The Damned', 'basic', 0, 'Deal Physical Damage. Inflict Predicted.', ['damage_single', 'Predicted'], ['offensive']),
      makeAbility('enoch_special_1', 'Tomb Legion Advance', 'special', 3, 'Deal Physical Damage to all enemies. Inflict Speed Down (2 turns).', ['damage_aoe', 'Speed Down'], ['offensive']),
      makeAbility('enoch_special_2', 'Call The Fallen', 'special', 4, 'All Second Empire allies gain Reanimated. Gain Defense Up (2 turns) and recover 10% Protection.', ['Reanimated', 'Defense Up', 'heal_self'], ['defensive']),
      makeAbility('enoch_leader', 'Herald Of The Returned', 'leader', 0, 'Second Empire allies gain +25% Max Health and +20% Defense. Whenever allies revive: Gain 5% Turn Meter.', ['turn_meter_gain'], []),
      makeAbility('enoch_unique', 'Gold Masked Commander', 'unique', 0, 'Immune to Fear and Ability Block. Whenever allies revive: Enoch gains Defense Up (1 turn). Whenever Reanimated is consumed: Recover 5% Protection.', ['Defense Up', 'heal_self'], [])
    ]
  },
  // Night Trooper (Peridea)
  {
    id: 'night_trooper_peridea',
    name: 'Night Trooper (Peridea)',
    tags: ['galactic_empire', 'imperial_remnant', 'second_empire'],
    role: 'Tank',
    lore: 'A combatant of the New Republic era.',
    faction: 'Imperial Remnant',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 130, hp: 50000, protection: 30000, offense: 3500, defense: 7000, critChance: 0.2, critDamage: 1.5, tenacity: 0.5, potency: 0.4 },
    abilities: [
      makeAbility('night_trooper_basic', 'Rusted Volley', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Offense Down (1 turn).', ['damage_single', 'Offense Down'], ['offensive']),
      makeAbility('night_trooper_special_1', 'Undying Wall', 'special', 3, 'Gain Taunt (2 turns) and Defense Up (2 turns).', ['Taunt', 'Defense Up'], ['defensive']),
      makeAbility('night_trooper_special_2', 'Grave March', 'special', 4, 'Deal Physical Damage to all enemies. Enemies with Predicted lose 5% Turn Meter.', ['damage_aoe', 'turn_meter_reduction'], ['offensive']),
      makeAbility('night_trooper_unique', 'Already Dead', 'unique', 0, 'Battle Start: Gain Reanimated. Whenever this unit revives: Gain Taunt (1 turn) and recover 10% Protection.', ['Reanimated', 'Taunt', 'heal_self'], [])
    ]
  },
  // Death Trooper (Peridea)
  {
    id: 'death_trooper_peridea',
    name: 'Death Trooper (Peridea)',
    tags: ['galactic_empire', 'imperial_remnant', 'second_empire'],
    role: 'Attacker',
    lore: 'A combatant of the New Republic era.',
    faction: 'Imperial Remnant',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 165, hp: 35000, protection: 25000, offense: 6500, defense: 3500, critChance: 0.5, critDamage: 1.8, tenacity: 0.5, potency: 0.6 },
    abilities: [
      makeAbility('death_trooper_peridea_basic', 'Grave Precision', 'basic', 0, 'Deal Physical Damage. If target has Predicted: Inflict Healing Immunity (2 turns).', ['damage_single', 'Healing Immunity'], ['offensive']),
      makeAbility('death_trooper_peridea_special_1', 'Execution Rite', 'special', 3, 'Deal massive Physical Damage. If target has Predicted: Ignore Protection.', ['damage_single', 'ignore_protection'], ['offensive']),
      makeAbility('death_trooper_peridea_special_2', 'Hollow Advance', 'special', 4, 'Gain Stealth (2 turns), Critical Damage Up (2 turns), and a Bonus Turn.', ['Stealth', 'Critical Damage Up', 'bonus_turn'], ['defensive']),
      makeAbility('death_trooper_peridea_unique', 'Dead Men Obey', 'unique', 0, 'Battle Start: Gain Reanimated. Whenever this unit revives: Gain Critical Damage Up (2 turns) and a Bonus Turn. Whenever enemies with Predicted are defeated: Gain Offense Up (2 turns).', ['Reanimated', 'Critical Damage Up', 'bonus_turn', 'Offense Up'], [])
    ]
  },
  // Scout Trooper (Peridea)
  {
    id: 'scout_trooper_peridea',
    name: 'Scout Trooper (Peridea)',
    tags: ['galactic_empire', 'imperial_remnant', 'second_empire'],
    role: 'Saboteur',
    lore: 'A combatant of the New Republic era.',
    faction: 'Imperial Remnant',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 175, hp: 30000, protection: 25000, offense: 5000, defense: 3000, critChance: 0.4, critDamage: 1.5, tenacity: 0.6, potency: 0.8 },
    abilities: [
      makeAbility('scout_trooper_peridea_basic', 'Grave Marker', 'basic', 0, 'Deal Physical Damage. Inflict Predicted.', ['damage_single', 'Predicted'], ['offensive']),
      makeAbility('scout_trooper_peridea_special_1', 'Tomb Recon', 'special', 3, 'Reveal Stealthed enemies. Second Empire allies gain Critical Chance Up (2 turns).', ['dispel_stealth', 'Critical Chance Up'], ['defensive']),
      makeAbility('scout_trooper_peridea_special_2', 'Funeral Signal', 'special', 4, 'Target enemy gains Predicted and Defense Down (2 turns).', ['Predicted', 'Defense Down'], ['debuff']),
      makeAbility('scout_trooper_peridea_unique', 'Whispering Static', 'unique', 0, 'Whenever Predicted is consumed: Gain 5% Turn Meter. Whenever allies critically hit: Gain 2% Potency (stacking).', ['turn_meter_gain'], [])
    ]
  },
  // Shadow Trooper (Peridea)
  {
    id: 'shadow_trooper_peridea',
    name: 'Shadow Trooper (Peridea)',
    tags: ['galactic_empire', 'imperial_remnant', 'second_empire'],
    role: 'Attacker',
    lore: 'A combatant of the New Republic era.',
    faction: 'Imperial Remnant',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 170, hp: 35000, protection: 30000, offense: 6000, defense: 3500, critChance: 0.5, critDamage: 1.5, tenacity: 0.5, potency: 0.6 },
    abilities: [
      makeAbility('shadow_trooper_peridea_basic', 'Phantom Slash', 'basic', 0, 'Deal Physical Damage. If Shadow Trooper has Stealth: Inflict Ability Block (1 turn).', ['damage_single', 'Ability Block'], ['offensive']),
      makeAbility('shadow_trooper_peridea_special_1', 'Cloaked Reaping', 'special', 3, 'Gain Stealth (2 turns) and Offense Up (2 turns). Attack target enemy. If target has Predicted: Ignore Taunt.', ['Stealth', 'Offense Up', 'damage_single', 'ignore_taunt'], ['offensive']),
      makeAbility('shadow_trooper_peridea_special_2', 'Terror From Beyond', 'special', 4, 'All enemies gain Predicted and Offense Down (2 turns).', ['Predicted', 'Offense Down'], ['debuff']),
      makeAbility('shadow_trooper_peridea_unique', 'Living Nightmare', 'unique', 0, 'Battle Start: Gain Reanimated. Whenever this unit revives: Gain Stealth (2 turns) and Offense Up (2 turns). Whenever enemies gain Predicted: Gain 5% Turn Meter. Whenever attacking enemies with Predicted: Deal bonus damage.', ['Reanimated', 'Stealth', 'Offense Up', 'turn_meter_gain'], [])
    ]
  },
  // Warlord Drake Voss
  {
    id: 'warlord_drake_voss',
    name: 'Warlord Drake Voss',
    tags: ['galactic_empire', 'imperial_remnant', 'morvek_survivors'],
    role: 'Tank',
    lore: 'A combatant of the New Republic era.',
    faction: 'Galactic Empire',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 135, hp: 65000, protection: 45000, offense: 4500, defense: 7500, critChance: 0.3, critDamage: 1.5, tenacity: 0.8, potency: 0.4 },
    abilities: [
      makeAbility('drake_voss_basic', 'Siege Revolver', 'basic', 0, 'Deal Physical Damage. 70% chance to inflict Suppressed (2 turns). If Voss has Entrenched: Attack again for 50% reduced damage.', ['damage_single', 'Suppressed'], ['offensive']),
      makeAbility('drake_voss_special_1', 'Dig In', 'special', 3, 'Gain Entrenched (3 turns), Taunt (2 turns), and Defense Up (2 turns). All Morvek Survivor allies recover 10% Health.', ['Entrenched', 'Taunt', 'Defense Up', 'heal_ally'], ['defensive']),
      makeAbility('drake_voss_special_2', 'Artillery Barrage', 'special', 4, 'Deal Physical Damage to all enemies. Inflict Suppressed (2 turns) and Speed Down (2 turns).', ['damage_aoe', 'Suppressed', 'Speed Down'], ['offensive']),
      makeAbility('drake_voss_leader', 'Endless Campaign', 'leader', 0, 'Morvek Survivor allies gain +30% Defense and +20% Max Health. Whenever Morvek Survivor allies gain Entrenched: Recover 5% Health. Whenever enemies suffer Battlefield Corruption damage: Morvek Survivor allies gain 2% Turn Meter.', ['heal_ally', 'turn_meter_gain'], []),
      makeAbility('drake_voss_unique', 'Veteran Of Morvek', 'unique', 0, 'Immune to Fear and Daze. Whenever Voss is critically hit: Gain Entrenched (1 turn). Whenever allies fall below 50% Health: Voss gains Taunt (1 turn).', ['Entrenched', 'Taunt'], [])
    ]
  },
  // Mire Talon
  {
    id: 'mire_talon',
    name: 'Mire Talon',
    tags: ['galactic_empire', 'imperial_remnant', 'morvek_survivors'],
    role: 'Attacker',
    lore: 'A combatant of the New Republic era.',
    faction: 'Galactic Empire',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 165, hp: 35000, protection: 35000, offense: 6000, defense: 3500, critChance: 0.5, critDamage: 1.8, tenacity: 0.5, potency: 0.6 },
    abilities: [
      makeAbility('mire_talon_basic', 'Crater Knife', 'basic', 0, 'Deal Physical Damage. If Talon has Stealth: Inflict Healing Immunity (2 turns).', ['damage_single', 'Healing Immunity'], ['offensive']),
      makeAbility('mire_talon_special_1', 'Tunnel Ambush', 'special', 3, 'Gain Stealth (2 turns) and Critical Chance Up (2 turns). Attack target enemy. If target suffers Battlefield Corruption: Attack again.', ['Stealth', 'Critical Chance Up', 'damage_single'], ['offensive']),
      makeAbility('mire_talon_special_2', 'No Man\'s Land', 'special', 4, 'Deal Physical Damage. Inflict Battlefield Corruption (3 turns). If target is below 50% Health: Deal bonus damage.', ['damage_single', 'Battlefield Corruption'], ['offensive']),
      makeAbility('mire_talon_unique', 'Ash Walker', 'unique', 0, 'Whenever enemies suffer Battlefield Corruption damage: Gain 5% Turn Meter. Whenever enemies fall below 50% Health: Gain Offense Up (2 turns).', ['turn_meter_gain', 'Offense Up'], [])
    ]
  },
  // Torr Kane
  {
    id: 'torr_kane',
    name: 'Torr Kane',
    tags: ['galactic_empire', 'imperial_remnant', 'morvek_survivors'],
    role: 'Tank',
    lore: 'A combatant of the New Republic era.',
    faction: 'Galactic Empire',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 140, hp: 60000, protection: 40000, offense: 4000, defense: 7000, critChance: 0.2, critDamage: 1.5, tenacity: 0.7, potency: 0.5 },
    abilities: [
      makeAbility('torr_kane_basic', 'Rotary Barrage', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Suppressed (1 turn).', ['damage_single', 'Suppressed'], ['offensive']),
      makeAbility('torr_kane_special_1', 'Shield Wall', 'special', 3, 'Gain Taunt (2 turns), Entrenched (2 turns), and Defense Up (2 turns). Weakest ally gains Defense Up (2 turns).', ['Taunt', 'Entrenched', 'Defense Up'], ['defensive']),
      makeAbility('torr_kane_special_2', 'Suppression Sweep', 'special', 4, 'Deal Physical Damage to all enemies. Inflict Offense Down (2 turns) and Suppressed (2 turns).', ['damage_aoe', 'Offense Down', 'Suppressed'], ['offensive']),
      makeAbility('torr_kane_unique', 'Hold The Line', 'unique', 0, 'Whenever allies fall below 50% Health: Gain Taunt (1 turn). Whenever Kane takes damage: Gain +2% Defense (stacking).', ['Taunt'], [])
    ]
  },
  // Ashen Veil
  {
    id: 'ashen_veil',
    name: 'Ashen Veil',
    tags: ['galactic_empire', 'imperial_remnant', 'morvek_survivors'],
    role: 'Support',
    lore: 'A combatant of the New Republic era.',
    faction: 'Galactic Empire',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 150, hp: 45000, protection: 40000, offense: 3500, defense: 5000, critChance: 0.3, critDamage: 1.5, tenacity: 0.6, potency: 0.7 },
    abilities: [
      makeAbility('ashen_veil_basic', 'Combat Stimulants', 'basic', 0, 'Deal Physical Damage. Random ally recovers 5% Health.', ['damage_single', 'heal_ally'], ['offensive']),
      makeAbility('ashen_veil_special_1', 'Emergency Surgery', 'special', 3, 'Target ally recovers 25% Health. Gain Defense Up (2 turns).', ['heal_ally', 'Defense Up'], ['defensive']),
      makeAbility('ashen_veil_special_2', 'Toxic Saturation', 'special', 4, 'All enemies gain Battlefield Corruption (3 turns) and Healing Immunity (2 turns).', ['Battlefield Corruption', 'Healing Immunity'], ['debuff']),
      makeAbility('ashen_veil_unique', 'Necessary Losses', 'unique', 0, 'Whenever allies are defeated: Remaining Morvek Survivor allies recover 10% Health. Whenever enemies suffer Battlefield Corruption damage: Veil gains 5% Turn Meter.', ['heal_ally', 'turn_meter_gain'], [])
    ]
  },
  // Hollow
  {
    id: 'hollow',
    name: 'Hollow',
    tags: ['galactic_empire', 'imperial_remnant', 'morvek_survivors'],
    role: 'Attacker',
    lore: 'A combatant of the New Republic era.',
    faction: 'Galactic Empire',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 160, hp: 40000, protection: 30000, offense: 6500, defense: 4000, critChance: 0.5, critDamage: 1.8, tenacity: 0.5, potency: 0.5 },
    abilities: [
      makeAbility('hollow_basic', 'Gravefire Shot', 'basic', 0, 'Deal Physical Damage. If Hollow is below 50% Health: Deal bonus damage.', ['damage_single'], ['offensive']),
      makeAbility('hollow_special_1', 'Ash Rage', 'special', 3, 'Lose 10% Health. Gain Offense Up (2 turns), Critical Damage Up (2 turns), and Retribution (2 turns).', ['Offense Up', 'Critical Damage Up', 'Retribution'], ['defensive']),
      makeAbility('hollow_special_2', 'Trencher\'s Fury', 'special', 4, 'Deal massive Physical Damage. Ignore Taunt. If target suffers Battlefield Corruption: Inflict Defense Down (2 turns).', ['damage_single', 'ignore_taunt', 'Defense Down'], ['offensive']),
      makeAbility('hollow_unique', 'Buried Alive', 'unique', 0, 'Whenever Hollow falls below 50% Health: Gain Bonus Turn. Whenever allies are defeated: Gain +5% Offense (stacking) and +5 Speed (stacking).', ['bonus_turn'], [])
    ]
  },
  // Rex (Lost Commander)
  {
    id: 'rex_lost_commander',
    name: 'Rex (Lost Commander)',
    tags: ['rebel_alliance', 'clone_trooper', 'new_republic'],
    role: 'Tank',
    lore: 'A combatant of the New Republic era.',
    faction: 'Rebel',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 155, hp: 70000, protection: 50000, offense: 4500, defense: 7000, critChance: 0.3, critDamage: 1.5, tenacity: 0.7, potency: 0.6 },
    abilities: [
      makeAbility('rex_lost_basic', 'Hold The Line', 'basic', 0, 'Deal Physical Damage. Gain Defense Up (1 turn). If target enemy has a debuff: Recover 5% Health.', ['damage_single', 'Defense Up', 'heal_self'], ['offensive']),
      makeAbility('rex_lost_special_1', 'Old Soldier\'s Instinct', 'special', 3, 'Gain Taunt (2 turns), Defense Up (2 turns), and Veteran Orders. Recover 15% Health.', ['Taunt', 'Defense Up', 'Veteran Orders', 'heal_self'], ['defensive']),
      makeAbility('rex_lost_special_2', 'Extraction Route', 'special', 4, 'Target ally recovers 20% Health. Cleanse all debuffs from target ally. Rex gains Taunt (2 turns). If target ally is a Rebel Alliance ally: Target ally gains Defense Up (2 turns).', ['heal_ally', 'cleanse_ally', 'Taunt', 'Defense Up'], ['defensive']),
      makeAbility('rex_lost_unique_1', 'Last Of The Clones', 'unique', 0, 'Battle Start: Gain Veteran Orders. Whenever allies fall below 50% Health: Rex gains 5% Turn Meter. Whenever Rex takes damage while Taunting: Gain +2% Defense (stacking). The first time each ally would be defeated: That ally instead recovers 15% Health. Can trigger once per ally.', ['Veteran Orders', 'turn_meter_gain', 'heal_ally'], []),
      makeAbility('rex_lost_unique_2', 'Veteran Of Every War', 'unique', 0, 'Whenever an ally gains a buff: Rex recovers 2% Health. Whenever an ally is defeated: Rex gains Defense Up (2 turns) and Veteran Orders. Whenever Rex falls below 50% Health: Recover 10% Health and gain Taunt (1 turn) (once every 3 turns).', ['heal_self', 'Defense Up', 'Veteran Orders', 'Taunt'], []),
      makeAbility('rex_lost_unique_3', 'Not Today', 'unique', 0, 'The first time Rex would be defeated: Recover 50% Health. Gain Taunt (2 turns), Defense Up (2 turns), and Veteran Orders. All allies recover 10% Health. Can trigger once per battle.', ['heal_self', 'Taunt', 'Defense Up', 'Veteran Orders', 'heal_ally'], [])
    ]
  },
  // Shin Hati
  {
    id: 'shin_hati',
    name: 'Shin Hati',
    tags: ['exiles', 'pirate', 'mercenary', 'unaligned_force_user'],
    role: 'Attacker',
    lore: 'A combatant of the New Republic era.',
    faction: 'Exiles',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 175, hp: 40000, protection: 35000, offense: 7500, defense: 4000, critChance: 0.6, critDamage: 2.0, tenacity: 0.5, potency: 0.4 },
    abilities: [
      makeAbility('shin_hati_basic', 'Relentless Assault', 'basic', 0, 'Deal Physical Damage. If target has a debuff: Attack again.', ['damage_single'], ['offensive']),
      makeAbility('shin_hati_special_1', 'Impulsive Strike', 'special', 3, 'Deal massive Physical Damage. Ignore Taunt. If Baylan has Resolve: Consume 2 Resolve, Inflict Defense Down (2 turns).', ['damage_single', 'ignore_taunt', 'Defense Down'], ['offensive']),
      makeAbility('shin_hati_special_2', 'Apprentice Fury', 'special', 4, 'Gain Offense Up (2 turns), Critical Damage Up (2 turns), and a Bonus Turn. If Baylan has 4 or more Resolve: Consume 4 Resolve, Gain Advantage (2 turns).', ['Offense Up', 'Critical Damage Up', 'bonus_turn', 'Advantage'], ['defensive']),
      makeAbility('shin_hati_unique', 'Restless Apprentice', 'unique', 0, 'Whenever Baylan gains Resolve: Shin gains 5% Turn Meter. Whenever enemies fall below 50% Health: Gain Offense Up (1 turn). Whenever Baylan consumes Resolve: Shin assists.', ['turn_meter_gain', 'Offense Up', 'assist_passive'], [])
    ]
  },
  // Baylan Skoll
  {
    id: 'baylan_skoll',
    name: 'Baylan Skoll',
    tags: ['exiles', 'mercenary', 'unaligned_force_user', 'journey_character'],
    role: 'Tank',
    lore: 'A combatant of the New Republic era.',
    faction: 'Exiles',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 150, hp: 80000, protection: 65000, offense: 6000, defense: 7500, critChance: 0.4, critDamage: 1.5, tenacity: 0.8, potency: 0.5 },
    abilities: [
      makeAbility('baylan_skoll_basic', 'Merciful Strike', 'basic', 0, 'Deal Physical Damage. Gain 1 Resolve. If Baylan has 5 or more Resolve: Recover 5% Health.', ['damage_single', 'Resolve', 'heal_self'], ['offensive']),
      makeAbility('baylan_skoll_special_1', 'There Is Another Path', 'special', 3, 'Gain Taunt (2 turns), Defense Up (2 turns), and 3 Resolve. If Baylan has 5 or more Resolve: Consume 5 Resolve, gain Protection Up (30%) and Retribution (2 turns).', ['Taunt', 'Defense Up', 'Resolve', 'Protection Up', 'Retribution'], ['defensive']),
      makeAbility('baylan_skoll_special_2', 'Ancient Purpose', 'special', 4, 'All Exile allies gain Offense Up (2 turns). Baylan gains 2 Resolve. If Baylan has 8 or more Resolve: Consume 8 Resolve, all Exile allies gain Speed Up (2 turns) and Critical Damage Up (2 turns).', ['Offense Up', 'Resolve', 'Speed Up', 'Critical Damage Up'], ['defensive']),
      makeAbility('baylan_skoll_leader', 'Beyond The Cycle', 'leader', 0, 'Exile allies gain +20 Speed and +20% Max Health. Whenever allies are defeated: Remaining Exile allies gain 1 Resolve. Whenever enemies are defeated: Recover 5% Health.', ['Resolve', 'heal_ally'], []),
      makeAbility('baylan_skoll_unique_1', 'A Greater Calling', 'unique', 0, 'Whenever allies are defeated: Gain 2 Resolve. Whenever Baylan gains Resolve: Recover 2% Health. At the start of his turn: If Baylan has 10 Resolve: Consume all Resolve, gain Taunt (2 turns), Defense Up (2 turns), and Protection Up (40%).', ['Resolve', 'heal_self', 'Taunt', 'Defense Up', 'Protection Up'], []),
      makeAbility('baylan_skoll_unique_2', 'The Weight Of History', 'unique', 0, 'Immune to Fear. Whenever Baylan is critically hit: Gain 1 Resolve. Whenever Baylan loses Taunt: Gain 10% Turn Meter.', ['Resolve', 'turn_meter_gain'], [])
    ]
  },
  // Morgan Elsbeth
  {
    id: 'morgan_elsbeth',
    name: 'Morgan Elsbeth',
    tags: ['exiles', 'nightsister'],
    role: 'Support',
    lore: 'A combatant of the New Republic era.',
    faction: 'Exiles',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 160, hp: 45000, protection: 40000, offense: 4500, defense: 5000, critChance: 0.3, critDamage: 1.5, tenacity: 0.7, potency: 0.8 },
    abilities: [
      makeAbility('morgan_elsbeth_basic', 'Witchsteel Slash', 'basic', 0, 'Deal Physical Damage. Inflict Defense Down (2 turns).', ['damage_single', 'Defense Down'], ['offensive']),
      makeAbility('morgan_elsbeth_special_1', 'Great Mothers\' Blessing', 'special', 3, 'Exile allies gain Defense Up (2 turns) and recover 10% Health.', ['Defense Up', 'heal_ally'], ['defensive']),
      makeAbility('morgan_elsbeth_special_2', 'Threads Of Fate', 'special', 4, 'All enemies gain Offense Down (2 turns) and Speed Down (2 turns).', ['Offense Down', 'Speed Down'], ['debuff']),
      makeAbility('morgan_elsbeth_unique', 'Voice Of Peridea', 'unique', 0, 'Whenever enemies gain debuffs: Morgan gains 5% Turn Meter. Whenever Baylan consumes Resolve: All allies recover 3% Health.', ['turn_meter_gain', 'heal_ally'], [])
    ]
  },
  // Marrok (Mercenary)
  {
    id: 'marrok_mercenary',
    name: 'Marrok (Mercenary)',
    tags: ['exiles', 'inquisitorius', 'nightsister'],
    role: 'Saboteur',
    lore: 'A combatant of the New Republic era.',
    faction: 'Exiles',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 170, hp: 40000, protection: 35000, offense: 6500, defense: 4500, critChance: 0.5, critDamage: 1.8, tenacity: 0.5, potency: 0.6 },
    abilities: [
      makeAbility('marrok_merc_basic', 'Spinning Assault', 'basic', 0, 'Deal Physical Damage. If target has debuffs: Deal bonus damage.', ['damage_single'], ['offensive']),
      makeAbility('marrok_merc_special_1', 'Hollow Warrior', 'special', 3, 'Gain Offense Up (2 turns). Attack target enemy.', ['Offense Up', 'damage_single'], ['offensive']),
      makeAbility('marrok_merc_special_2', 'Crimson Cyclone', 'special', 4, 'Deal Physical Damage to all enemies. Inflict Healing Immunity (2 turns).', ['damage_aoe', 'Healing Immunity'], ['offensive']),
      makeAbility('marrok_merc_unique', 'Empty Shell', 'unique', 0, 'Whenever enemies gain debuffs: Gain 5% Turn Meter. Whenever Morgan uses a Special Ability: Marrok assists. Whenever Baylan consumes Resolve: Marrok gains Offense Up (1 turn).', ['turn_meter_gain', 'assist_passive', 'Offense Up'], [])
    ]
  },
  // Commander Hux
  {
    id: 'commander_hux_exile',
    name: 'Commander Hux',
    tags: ['exiles', 'new_empire'],
    role: 'Support',
    lore: 'A combatant of the New Republic era.',
    faction: 'Exiles',
    powerLevel: 8500,
    combatStyle: 'Balanced tactics and strategy',
    baseStats: { speed: 165, hp: 45000, protection: 40000, offense: 4000, defense: 5000, critChance: 0.3, critDamage: 1.5, tenacity: 0.6, potency: 0.7 },
    abilities: [
      makeAbility('hux_basic', 'Direct Fire', 'basic', 0, 'Deal Physical Damage. Random ally gains 5% Turn Meter.', ['damage_single', 'turn_meter_gain'], ['offensive']),
      makeAbility('hux_special_1', 'Coordinated Response', 'special', 3, 'All allies gain Speed Up (2 turns).', ['Speed Up'], ['defensive']),
      makeAbility('hux_special_2', 'Tactical Withdrawal', 'special', 4, 'Cleanse all debuffs from allies. Recover 10% Health.', ['cleanse_ally', 'heal_ally'], ['defensive']),
      makeAbility('hux_unique', 'Taking Credit', 'unique', 0, 'Whenever allies defeat enemies: Hux gains Offense Up (1 turn). Whenever allies gain buffs: Hux gains 3% Turn Meter. Whenever Baylan consumes Resolve: Hux gains 10% Turn Meter.', ['Offense Up', 'turn_meter_gain'], [])
    ]
  }
];
