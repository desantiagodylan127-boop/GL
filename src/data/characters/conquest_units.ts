import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const CONQUEST_UNITS: Character[] = [
  // --- Conquest Character: Darth Vader (Skywalker's Death) ---
  // Overwriting the existing vader_skywalker_death
  createCharacter(
    'vader_skywalker_death',
    'Vader (Skywalker’s Death)',
    'Leader / Attacker',
    ['Sith', 'Empire'],
    'Consumed completely by pain and rage, stripping away restraint in favor of raw destruction.',
    [
      makeAbility('vsd_basic', 'Crippled Fury', 'basic', 0, 'Deal Physical Damage. If target is Jedi, attack again. 50% chance to inflict Healing Immunity (2 turns).', ['damage', 'anti_jedi', 'Healing Immunity'], ['offensive']),
      makeAbility('vsd_s1', 'Hatred Sustains Me', 'special', 3, 'Gain Offense Up, Critical Damage Up, Defense Penetration Up. Lose 10% Health. Below 75% HP: +20% Offense. Below 50% HP: Gain Retribution. Below 25% HP: Gain Bonus Turn.', ['buff_self', 'Offense Up', 'Retribution', 'Critical Damage Up', 'Defense Penetration Up'], ['offensive']),
      makeAbility('vsd_s2', 'Duel in the Ashes', 'special', 4, 'Ignore Taunt. Massive Physical Damage. Target below 50% HP: Ignore Protection. If Jedi: inflict Daze (2 turns).', ['damage_heavy', 'ignore_taunt', 'Daze', 'Taunt'], ['offensive']),
      makeAbility('vsd_s3', 'Shattered Machine', 'special', 5, 'AoE Physical Damage. Recover 5% HP per debuffed enemy. Enemies with debuffs lose 5% TM.', ['damage_aoe', 'heal_self'], ['offensive']),
      makeAbility('vsd_leader', 'Fueled by Agony', 'leader', 0, 'Empire allies +30% Offense, +20 Speed. Empire falls below 50% HP -> recover 5% Protection. Jedi gain buffs -> Empire allies gain 5% TM.', ['leader_empire'], []),
      makeAbility('vsd_unique', 'Skywalker\'s Death', 'unique', 0, 'Take damage -> gain 5% Offense (stacking). Defeat enemy -> reset Duel in the Ashes. Last unit alive -> gain 25% Lifesteal, 30 Speed, Defense Up.', ['unique_vader', 'Defense Up'], [])
    ],
    'Empire',
    12500,
    'Sustained Hatred',
    { speed: 145, hp: 60000, protection: 45000, defense: 50, critChance: 0.3 },
    'conquest',
    'dark',
    'civil_war'
  ),

  // --- Conquest Character: Ahsoka Tano (Clone Wars) ---
  createCharacter(
    'ahsoka_clone_wars',
    'Ahsoka Tano (Clone Wars)',
    'Support / Strategist',
    ['Jedi', '501st'],
    'Brilliant battlefield commander fighting alongside the 501st.',
    [
      makeAbility('acw_basic', 'Shien Counterstrike', 'basic', 0, 'Deal Physical Damage. Gain Momentum. If Ahsoka has 5 or more Momentum: Gain Foresight (1 Turn).', ['damage', 'Momentum', 'Foresight'], ['offensive']),
      makeAbility('acw_s1', 'Fulcrum Of Battle', 'special', 3, 'Cleanse all debuffs from target ally. Target ally gains Offense Up (2 Turns) and Speed Up (2 Turns). Ahsoka gains Momentum (2 Stacks). If Ahsoka has 5 or more Momentum: Consume 5 Momentum, and target ally gains Bonus Turn.', ['cleanse', 'buff_all', 'Offense Up', 'Speed Up', 'Momentum', 'bonus_turn'], ['defensive']),
      makeAbility('acw_s2', 'Togruta Precision', 'special', 4, 'Deal Physical Damage. Gain Momentum (3 Stacks). If Ahsoka has 5 or more Momentum: Consume 5 Momentum, ignore Taunt, and inflict Armor Shred (2 Turns).', ['damage', 'Momentum', 'Armor Shred', 'ignore_taunt'], ['offensive']),
      makeAbility('acw_unique', 'Snips No Longer', 'unique', 0, 'Whenever a 501st ally uses Special, Ahsoka gains Momentum. Whenever Ahsoka gains Momentum: recovers 2% Protection. If General Skywalker is active, Ahsoka gains +20 Speed. Whenever General Skywalker becomes Fatigued: Ahsoka gains Bonus Turn.', ['passive_boost', 'Momentum', 'protection_recovery', 'bonus_turn'], [])
    ],
    '501st',
    11500,
    'Clone Strategy',
    { speed: 160, hp: 45000, protection: 50000, defense: 45, critChance: 0.25 },
    'conquest',
    'light',
    'clone_wars'
  ),

  // --- Conquest Character: Moff Gideon (Dark Trooper Mandalore) ---
  createCharacter(
    'moff_gideon_dark_trooper',
    'Dark Trooper Gideon',
    'Leader / Strategist',
    ['Galactic Empire', 'Imperial Remnant'],
    'Weaponizes Dark Trooper armor and frozen remnant warfare.',
    [
      makeAbility('gid_basic', 'Beskar Assault', 'basic', 0, 'Deal Physical Damage. Inflict Fear (1 turn). If target is Mandalorian: Attack again.', ['damage', 'Fear'], ['offensive']),
      makeAbility('gid_s1', 'Purge Of Mandalore', 'special', 4, 'Deal Physical Damage to all enemies. Mandalorian enemies gain: Fear (2 turns), Buff Immunity (2 turns), Healing Immunity (2 turns). Imperial Remnant allies assist against Mandalorian enemies.', ['damage_aoe', 'Fear', 'Buff Immunity', 'Healing Immunity', 'assist_all'], ['offensive']),
      makeAbility('gid_s2', 'For The Future Empire', 'special', 5, 'Defeat target other Imperial Remnant ally. Summon Dark Trooper Reinforcement. All Imperial Remnant allies gain: Offense Up (2 turns), Defense Up (2 turns), 20% Turn Meter.', ['sacrifice', 'summon', 'Offense Up', 'Defense Up', 'turn_meter_gain'], ['defensive']),
      makeAbility('gid_leader', 'Long Live The Empire', 'leader', 0, 'Imperial Remnant allies gain: 30% Offense, 30 Speed, 20% Defense. The first time each Imperial Remnant ally is defeated: Revive with 50% Health. Whenever an Imperial Remnant ally is defeated: All remaining Imperial Remnant allies gain 10% Offense (stacking) and 10% Turn Meter.', ['buff_faction', 'revive', 'Offense Up', 'turn_meter_gain'], []),
      makeAbility('gid_unique', 'Beskar Exoskeleton', 'unique', 0, 'Whenever an Imperial Remnant ally is revived: Dark Trooper Gideon gains Defense Up (2 turns). Whenever an Imperial Remnant ally is defeated: Dark Trooper Gideon gains Offense Up (2 turns). Whenever a Droid ally attacks: Recover 5% Protection. If Dark Trooper Reinforcement is defeated: Summon a new one (once per battle).', ['Defense Up', 'Offense Up', 'protection_recovery', 'summon'], [])
    ],
    'Imperial Remnant',
    13000,
    'Armor & Suppression',
    { speed: 135, hp: 65000, protection: 60000, defense: 60, critChance: 0.15 },
    'conquest',
    'dark',
    'post_endor'
  ),

  // --- Summon: Dark Trooper Reinforcement ---
  createCharacter(
    'dark_trooper_vanguard',
    'Dark Trooper Reinforcement',
    'Attacker',
    ['Imperial Remnant', 'Droid', 'Summon'],
    'Durable frontline assault droid.',
    [
      makeAbility('dtv_basic', 'Relentless Barrage', 'basic', 0, 'Deal Physical Damage. Attack again if target is below 50% Health.', ['damage'], ['offensive']),
      makeAbility('dtv_unique', 'Expendable Asset', 'unique', 0, 'Gain 25% Offense. Whenever an Imperial Remnant ally is defeated: Gain Offense Up (2 turns). Whenever Dark Trooper Gideon uses an ability: Assist. If defeated: Cannot be revived except by Dark Trooper Gideon\'s abilities.', ['passive_gain', 'Offense Up', 'assist_passive', 'unrevivable'], [])
    ],
    'Imperial Remnant',
    0,

    'Frontline Assault.',
    { speed: 110, hp: 75000, protection: 25000, defense: 75 }
  ),

  // --- Raid Enemies ---
  createCharacter(
    'imperial_bunker_commander',
    'Imperial Bunker Commander',
    'Leader',
    ['Galactic Empire', 'Raid Boss'],
    'Commands the Scarif defenses.',
    [makeAbility('scfc1', 'Bunker Defense', 'basic', 0, 'Gain Defense Up (2 turns) and recover 10% Protection.', ['Defense Up', 'protection_recovery'], ['defensive'])],
    'Empire', 4000, 'Defense', STANDARD_STATS
  ),
  createCharacter(
    'at_act_walker',
    'AT-ACT Walker',
    'Attacker',
    ['Galactic Empire', 'Raid Boss'],
    'Heavy cargo walker.',
    [makeAbility('scfc3', 'Heavy Blast', 'basic', 0, 'Deal heavy Physical Damage to target enemy.', ['damage'], ['offensive'])],
    'Empire', 5000, 'Heavy', STANDARD_STATS
  ),
  createCharacter(
    'star_destroyer_support_battery',
    'Star Destroyer Battery',
    'Attacker',
    ['Galactic Empire', 'Raid Boss'],
    'Orbit strikes.',
    [makeAbility('scfc4', 'Orbital Bombardment', 'basic', 0, 'Deal Physical Damage to all enemies.', ['damage_aoe'], ['offensive', 'aoe'])],
    'Empire', 5000, 'Heavy', STANDARD_STATS
  ),
  createCharacter(
    'crimson_dawn_captain',
    'Crimson Dawn Captain',
    'Leader',
    ['Crimson Dawn', 'Raid Boss'],
    'Syndicate lieutenant.',
    [makeAbility('scfc5', 'Syndicate Fire', 'basic', 0, 'Deal Physical Damage to target enemy. Inflict Offense Down (2 turns).', ['damage', 'Offense Down'], ['offensive'])],
    'Scoundrel', 4000, 'Leader', STANDARD_STATS
  ),
  createCharacter(
    'crimson_dawn_soldier',
    'Crimson Dawn Soldier',
    'Attacker',
    ['Crimson Dawn'],
    'Syndicate thug.',
    [makeAbility('scfc7', 'Blaster Shot', 'basic', 0, 'Deal Physical Damage to target enemy.', ['damage'], ['offensive'])],
    'Scoundrel', 3000, 'Attacker', STANDARD_STATS
  ),
];