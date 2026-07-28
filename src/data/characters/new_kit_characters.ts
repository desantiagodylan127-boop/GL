import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const NEW_KIT_CHARACTERS: Character[] = [
  // --- Boba Fett ---
  createCharacter(
    'boba_fett',
    'Boba Fett',
    'Attacker / Saboteur',
    ['Bounty Hunter', 'Hutt Cartel'],
    'Before becoming Daimyo of Tatooine, Boba Fett operated as the galaxy’s most feared bounty hunter — precise, ruthless, and impossible to escape.',
    [
      makeAbility('boba_basic', 'EE-3 Precision Burst', 'basic', 0, 'Attack target enemy. Deal Physical Damage. 50% chance to inflict Defense Down (2 turns).', ['damage', 'defense_down', 'Defense Down'], ['offensive']),
      makeAbility('boba_special_1', 'Wrist Rocket', 'special', 3, 'Attack all enemies. Deal Physical Damage. Inflict Burning (2 turns).', ['damage_aoe', 'burn', 'Burning'], ['offensive']),
      makeAbility('boba_special_2', 'Contract Hunter', 'special', 4, 'Attack target enemy. Ignore Taunt. Deal massive Physical Damage. If target enemy has debuffs, deal bonus damage.', ['damage_heavy', 'Taunt'], ['offensive']),
      makeAbility('boba_unique_1', 'Feared Reputation', 'unique', 0, 'Whenever enemies fall below 50% Health, Boba gains Offense Up (1 turn). Whenever enemies are defeated, Boba gains Critical Damage Up (2 turns) and 10% Turn Meter.', ['buff_passive', 'Offense Up', 'Critical Damage Up'], []),
      makeAbility('boba_unique_2', 'Veteran Bounty Hunter', 'unique', 0, 'Whenever Boba Fett critically hits, recover 5% Protection. Whenever Bounty Hunter or Hutt Cartel allies inflict debuffs, Boba gains 3% Turn Meter.', ['heal_passive'], [])
    ],
    'Hutt Cartel',
    8500,
    'Precise high-damage bursts and debuffs',
    { speed: 132, hp: 52000, protection: 38000 }
  ),

  // --- Hondo Ohnaka ---
  createCharacter(
    'hondo_ohnaka',
    'Hondo Ohnaka',
    'Strategist / Saboteur',
    ['Smuggler', 'Hutt Cartel', 'Rogue Archaeologist', 'Pirate', 'Ohnaka Gang'],
    'Legendary pirate captain Hondo Ohnaka survives through manipulation, betrayal, and opportunistic alliances. Hondo constantly shifts battlefield momentum in his favor while profiting from absolute chaos.',
    [
      makeAbility('hondo_basic', 'Pirate’s Pistol', 'basic', 0, 'Attack target enemy. Deal Physical Damage. 50% chance to inflict Offense Down (2 turns).', ['damage', 'offense_down', 'Offense Down'], ['offensive']),
      makeAbility('hondo_special_1', 'Business Opportunity', 'special', 3, 'Hutt Cartel and Smuggler allies gain Evasion Up (2 turns) and Critical Chance Up (2 turns). Hondo gains Stealth (2 turns).', ['evasion_up', 'crit_chance_up', 'stealth', 'Stealth', 'Critical Chance Up', 'Evasion Up'], ['support']),
      makeAbility('hondo_special_2', 'Smoke and Credits', 'special', 4, 'All enemies lose 5% Turn Meter and inflict Blind (2 turns) on all of them.', ['turn_meter_decrease_aoe', 'blind', 'Blind'], ['debuff']),
      makeAbility('hondo_special_3', 'Perfectly Fair Deal', 'special', 5, 'Dispel all buffs from target enemy. Then Hondo steals 10% Turn Meter and 10% Protection.', ['dispel', 'steal_turn_meter', 'steal_protection'], ['offensive']),
      makeAbility('hondo_unique_1', 'Pirate King', 'unique', 0, 'Whenever enemies miss attacks, Hondo gains 5% Turn Meter. Whenever allies evade, Hondo gains Offense Up (1 turn). Whenever Hondo falls below 50% Health, gain Stealth (1 turn).', ['stealth_passive', 'Offense Up', 'Stealth'], []),
      makeAbility('hondo_unique_2', 'Profit Above All', 'unique', 0, 'Whenever any unit is defeated, Hondo recovers 10% Protection. Whenever Hondo attacks out of turn, recover 5% Health.', ['heal_passive'], [])
    ],
    'Hutt Cartel',
    8300,
    'Disruption and extreme evasion manipulation',
    { speed: 135, hp: 44000, protection: 41000 }
  ),

  // --- Princess Leia ---
  createCharacter(
    'princess_leia',
    'Princess Leia',
    'Leader / Strategist',
    ['Rebel', 'Honor Guard'],
    'Even during the Galactic Civil War, Leia Organa balanced diplomacy, rebellion, and direct battlefield command. Princess Leia specializes in rallying allies through tactical leadership and relentless resolve.',
    [
      makeAbility('leia_basic', 'Diplomatic Shot', 'basic', 0, 'Attack target enemy. Deal Physical Damage. A random Rebel ally gains Critical Chance Up (1 turn).', ['damage', 'crit_chance_up', 'Critical Chance Up'], ['offensive']),
      makeAbility('leia_special_1', 'Rebel Coordination', 'special', 3, 'Rebel allies gain Speed Up (2 turns) and Offense Up (2 turns). Recover 10% Protection.', ['speed_up', 'offense_up', 'heal_protection', 'Speed Up', 'Offense Up'], ['support']),
      makeAbility('leia_special_2', 'Hope of the Rebellion', 'special', 4, 'Cleanse all debuffs from allies. Rebel allies recover 15% Health and 15% Protection.', ['cleanse', 'heal', 'heal_protection'], ['support']),
      makeAbility('leia_leader', 'Spark of Hope', 'leader', 0, 'Rebel allies gain +25 Speed and +20% Max Protection. Whenever Rebel allies assist, recover 3% Protection. Whenever enemies are defeated, allies gain 5% Turn Meter.', ['buff_faction'], []),
      makeAbility('leia_unique', 'Unbreakable Resolve', 'unique', 0, 'Whenever allies fall below 50% Health, Leia gains Foresight (1 turn). Whenever Rebel allies gain buffs, Leia gains 3% Turn Meter.', ['foresight_passive', 'Foresight'], [])
    ],
    'Rebel',
    8600,
    'Cleanses and coordinates Rebel squads',
    { speed: 126, hp: 48000, protection: 42000 }
  ),

  // --- Boushh Leia ---
  createCharacter(
    'boushh_leia',
    'Boushh Leia',
    'Saboteur / Attacker',
    ['Hutt Cartel', 'Rebel'],
    'Disguised as the bounty hunter Boushh, Leia infiltrated Jabba’s palace to rescue Han Solo. Her combat style focuses on deception, explosives, and sudden disruption.',
    [
      makeAbility('boushh_basic', 'Thermal Detonator Toss', 'basic', 0, 'Attack target enemy. Deal Physical Damage. 50% chance to inflict Healing Immunity (2 turns).', ['damage', 'healing_immunity', 'Healing Immunity'], ['offensive']),
      makeAbility('boushh_special_1', 'Palace Infiltration', 'special', 3, 'Gain Stealth (2 turns) and Critical Damage Up (2 turns).', ['stealth', 'crit_damage_up', 'Stealth', 'Critical Damage Up'], ['support']),
      makeAbility('boushh_special_2', 'Hidden Explosives', 'special', 4, 'Attack all enemies. Deal Physical Damage. Inflict Buff Immunity (2 turns).', ['damage_aoe', 'buff_immunity', 'Buff Immunity'], ['offensive']),
      makeAbility('boushh_unique', 'Undercover Operative', 'unique', 0, 'Whenever enemies gain buffs, Boushh Leia gains 5% Turn Meter. Whenever Boushh Leia defeats an enemy, gain Stealth (1 turn).', ['stealth_passive', 'Stealth'], [])
    ],
    'Hutt Cartel',
    8400,
    'Thermal attacks and healing obstruction',
    { speed: 130, hp: 49000, protection: 39000 }
  ),

  // --- Han Solo ---
  createCharacter(
    'han_solo',
    'Han Solo',
    'Attacker / Strategist',
    ['Rebel', 'Smuggler'],
    'Legendary smuggler and hero of the Rebellion, Han Solo thrives through fast reactions, risky attacks, and battlefield improvisation.',
    [
      makeAbility('han_basic', 'DL-44 Quickdraw', 'basic', 0, 'Attack target enemy. Deal Physical Damage. 50% chance to attack again.', ['damage'], ['offensive']),
      makeAbility('han_special_1', 'Never Tell Me the Odds', 'special', 3, 'Gain Critical Chance Up (2 turns) and Offense Up (2 turns).', ['crit_chance_up', 'offense_up', 'Offense Up', 'Critical Chance Up'], ['support']),
      makeAbility('han_special_2', 'Smuggler’s Barrage', 'special', 4, 'Attack target enemy. Deal massive Physical Damage. If target enemy is defeated, Han gains a Bonus Turn.', ['damage_heavy', 'bonus_turn'], ['offensive']),
      makeAbility('han_unique', 'Fastest Gun in the Galaxy', 'unique', 0, 'At battle start, Han gains a Bonus Turn. Whenever Han critically hits, gain 5% Turn Meter.', ['bonus_turn_passive'], [])
    ],
    'Rebel',
    8550,
    'Fast-paced multi-attacks and bonus turns',
    { speed: 134, hp: 47000, protection: 37000 }
  ),

  // --- Krrsantan ---
  createCharacter(
    'krrsantan',
    'Krrsantan',
    'Tank / Attacker',
    ['Hutt Cartel', 'Bounty Hunter', 'Rogue Archaeologist'],
    'A brutal Wookiee gladiator turned bounty hunter, Krrsantan overwhelms enemies through raw strength and relentless aggression.',
    [
      makeAbility('krrsantan_basic', 'Brutal Maul', 'basic', 0, 'Attack target enemy. Deal Physical Damage. 30% chance to inflict Daze (2 turns).', ['damage', 'daze', 'Daze'], ['offensive']),
      makeAbility('krrsantan_special_1', 'Gladiator Charge', 'special', 3, 'Attack target enemy. Deal massive Physical Damage. Gain Taunt (1 turn).', ['damage_heavy', 'taunt', 'Taunt'], ['offensive']),
      makeAbility('krrsantan_special_2', 'Savage Roar', 'special', 4, 'Attack all enemies. Deal Physical Damage. Inflict Offense Down (2 turns).', ['damage_aoe', 'offense_down', 'Offense Down'], ['offensive']),
      makeAbility('krrsantan_unique', 'Wookiee Berserker', 'unique', 0, 'Whenever Krrsantan is critically hit, gain Retribution (1 turn). Whenever enemies fall below 50% Health, gain Offense Up (1 turn).', ['retribution_passive', 'Offense Up', 'Retribution'], [])
    ],
    'Hutt Cartel',
    8450,
    'Retribution taunts and brutal dazing charges',
    { speed: 118, hp: 58000, protection: 46000 }
  )
];