import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const PIRATE_OHNAKA_CHARACTERS: Character[] = [
  createCharacter(
    'hondo_ohnaka_gl',
    'Hondo Ohnaka (Lord of Piracy)',
    'Leader / Strategist / Saboteur',
    ['Pirate', 'Ohnaka Gang', 'Galactic Legend', 'Journey Character'],
    'Galactic Legend pirate managing Treasure and Hostages for massive payouts.',
    [
      makeAbility('hondo_gl_basic', 'A Fair Exchange', 'basic', 0, 'Attack target enemy. Inflict Hostage (2 turns). If target already has Hostage: Gain 1 Treasure and Call random Pirate ally to Assist.', ['damage', 'Hostage', 'Treasure', 'assist'], ['offensive']),
      makeAbility('hondo_gl_special_1', 'Buy Their Loyalty', 'special', 3, 'Consume 3 Treasure. Target enemy gains Ability Block (1 turn) and Offense Down (2 turns). If target has Hostage: Target enemy attacks a random enemy.', ['consume_treasure', 'Ability Block', 'Offense Down', 'force_attack'], ['debuff']),
      makeAbility('hondo_gl_special_2', 'Pillage The Vault', 'special', 4, 'Dispel all enemy buffs. Gain 1 Treasure per buff removed (Max 5). Then consume up to 5 Treasure. For each consumed: Pirate allies recover 5% Protection.', ['dispel_aoe', 'Treasure', 'consume_treasure', 'protection_recovery_aoe'], ['debuff', 'heal']),
      makeAbility('hondo_gl_leader', 'Lord of Piracy', 'leader', 0, 'Pirate allies gain +30 Speed, +20% Potency, +20% Offense. Whenever Hostage is applied: Gain 1 Treasure. Whenever Treasure is consumed: Pirate allies gain 5% Turn Meter. Ohnaka Gang allies gain double Treasure from Hostage effects.', ['buff_faction'], []),
      makeAbility('hondo_gl_unique', 'Every Deal Profits Hondo', 'unique', 0, 'Hondo is immune to Fear and Stun. Whenever Treasure is consumed: Hondo gains 2% Mastery (stacking). Whenever Pirate allies use Special abilities: 50% chance to gain 1 Treasure. First time Hondo would be defeated: Consume all Treasure, Recover 100% Health and Protection.', ['immunity', 'mastery_passive', 'Treasure', 'revive_passive'], []),
      makeAbility('hondo_gl_ultimate', 'Pirate King\'s Ransom', 'ultimate', 0, '100% Charge. Consume all Treasure. All enemies gain Hostage (3 turns). Deal True Damage to all enemies. Extra damage per Treasure. Pirate allies gain Offense Up and Critical Damage Up. If 10 Treasure consumed: Pirate allies gain Bonus Turn.', ['consume_treasure', 'Hostage', 'damage_true_aoe', 'Offense Up', 'Critical Damage Up', 'bonus_turn_aoe'], [])
    ],
    'Ohnaka Gang',
    25000,
    'Managing Treasure economy and manipulating Hostages',
    { speed: 160, hp: 85000, protection: 60000, potency: 50 }
  ),
  createCharacter(
    'pikk_mukmuk',
    'Pikk Mukmuk',
    'Support / Strategist / Journey Character',
    ['Pirate', 'Ohnaka Gang', 'Journey Character'],
    'Thieving monkey-lizard handling emergency rescues and stockpiling treasure.',
    [
      makeAbility('pikk_basic', 'Shiny!', 'basic', 0, 'Attack target enemy. Gain 1 Treasure.', ['damage', 'Treasure'], ['offensive']),
      makeAbility('pikk_special_1', 'Hidden Stash', 'special', 3, 'Target ally gains Stealth (2 turns) and Protection Up (25%). Gain 2 Treasure.', ['Stealth', 'Protection Up', 'Treasure'], ['buff']),
      makeAbility('pikk_special_2', 'Emergency Escape Plan', 'special', 4, 'All Pirate allies recover 20% Health and 20% Protection. Gain 2 Treasure.', ['heal_aoe', 'protection_recovery_aoe', 'Treasure'], ['heal']),
      makeAbility('pikk_unique_1', 'Nobody Checks The Bird', 'unique', 0, 'First time each turn Treasure would be consumed: 50% chance to refund 1 Treasure. Whenever Treasure is refunded: Pikk gains 20% Turn Meter. Pirate allies gain +15 Speed.', ['turn_meter_gain_passive', 'speed_passive'], []),
      makeAbility('pikk_unique_2', 'Treasure Keeper', 'unique', 0, 'Whenever Treasure reaches 10: Pirate allies gain Critical Damage Up. Once per battle, when Treasure falls below 5: Gain 2 Treasure.', ['Critical Damage Up', 'Treasure'], [])
    ],
    'Ohnaka Gang',
    12000,
    'Treasure generation and team protection',
    { speed: 155, hp: 45000, protection: 35000 }
  ),
  createCharacter(
    'gwarm',
    'Gwarm',
    'Leader / Tank',
    ['Pirate', 'Ohnaka Gang'],
    'Enforcer keeping the pirates alive.',
    [
      makeAbility('gwarm_basic', 'Pirate Enforcer', 'basic', 0, 'Attack target enemy. 50% chance to inflict Offense Down (2 turns).', ['damage', 'Offense Down'], ['offensive']),
      makeAbility('gwarm_special_1', 'Hold The Loot', 'special', 3, 'Gain Taunt (2 turns) and Defense Up (2 turns). Gain 1 Treasure.', ['Taunt', 'Defense Up', 'Treasure'], ['defensive']),
      makeAbility('gwarm_special_2', 'Rough Handling', 'special', 4, 'Attack all enemies. Enemies with Hostage lose 15% Turn Meter.', ['damage_aoe', 'turn_meter_reduction_aoe'], ['offensive']),
      makeAbility('gwarm_leader', 'Keep What We Take', 'leader', 0, 'Pirate allies gain +25% Defense, +20% Max Health. Whenever Pirate allies gain Treasure: Recover 3% Protection. Whenever enemies with Hostage take a turn: Gain 1 Treasure.', ['buff_faction', 'heal_passive', 'Treasure'], []),
      makeAbility('gwarm_unique', 'Hondo\'s Old Partner', 'unique', 0, 'If Hondo is present: Gain Taunt at battle start. Whenever Treasure is consumed: Gain Defense Up.', ['Taunt', 'Defense Up'], [])
    ],
    'Ohnaka Gang',
    9000,
    'Taunting enforcer',
    { speed: 125, hp: 65000, protection: 50000 }
  ),
  createCharacter(
    'jiro',
    'Jiro',
    'Support / Strategist',
    ['Pirate', 'Ohnaka Gang'],
    'Quartermaster moving funds and buffing the crew.',
    [
      makeAbility('jiro_basic', 'Supply Delivery', 'basic', 0, 'Attack target enemy. Gain 1 Treasure. Random Pirate ally gains 5% Turn Meter.', ['damage', 'Treasure', 'turn_meter_gain'], ['offensive']),
      makeAbility('jiro_special_1', 'Hidden Reserves', 'special', 3, 'Target ally gains Offense Up (2 turns) and Potency Up (2 turns). Gain 2 Treasure. If Treasure is 5 or greater: Target ally gains 10% Turn Meter.', ['Offense Up', 'Potency Up', 'Treasure', 'turn_meter_gain'], ['buff']),
      makeAbility('jiro_special_2', 'Emergency Funding', 'special', 4, 'Consume 3 Treasure. All Pirate allies gain 20% Turn Meter and 15% Protection. If successful: All Pirate allies gain Speed Up (2 turns).', ['consume_treasure', 'turn_meter_gain_aoe', 'protection_recovery_aoe', 'Speed Up'], ['buff']),
      makeAbility('jiro_unique', 'Quartermaster', 'unique', 0, 'Whenever Pirate allies use Special abilities: 50% chance to gain 1 Treasure. Whenever Treasure is consumed: Jiro gains Speed Up (1 turn). Whenever Treasure reaches 10: Jiro recovers 20% Protection.', ['Treasure', 'Speed Up', 'protection_recovery_passive'], [])
    ],
    'Ohnaka Gang',
    8500,
    'Supports team with Turn Meter and Treasure',
    { speed: 140, hp: 40000, protection: 45000 }
  ),
  createCharacter(
    'turk_falso',
    'Turk Falso',
    'Attacker',
    ['Pirate', 'Ohnaka Gang'],
    'Reckless attacker cashing in Treasure for explosive damage.',
    [
      makeAbility('turk_falso_basic', 'Fast Hands', 'basic', 0, 'Attack target enemy. If Treasure is 5 or greater: Deal bonus damage.', ['damage', 'bonus_damage'], ['offensive']),
      makeAbility('turk_falso_special_1', 'Double Or Nothing', 'special', 3, 'Consume 2 Treasure. Attack target enemy twice. Each deals bonus damage. If Treasure not consumed: Gain Offense Up.', ['consume_treasure', 'damage_multi', 'Offense Up'], ['offensive']),
      makeAbility('turk_falso_special_2', 'Jackpot', 'special', 4, 'Consume 5 Treasure. Attack target enemy. Ignore Taunt and Protection. Deal massive Physical Damage. If target has Hostage: Deal extra bonus damage.', ['consume_treasure', 'damage_heavy', 'ignore_taunt', 'ignore_protection'], ['offensive']),
      makeAbility('turk_falso_unique', 'Fortune Favors The Bold', 'unique', 0, 'Whenever Treasure is consumed: Gain Offense Up (2 turns). Whenever an enemy falls below 50% Health: Gain 15% Turn Meter. Whenever Turk defeats an enemy: Gain 2 Treasure.', ['Offense Up', 'turn_meter_gain_passive', 'Treasure'], [])
    ],
    'Ohnaka Gang',
    8800,
    'Massive burst damage consumer',
    { speed: 145, hp: 42000, protection: 35000, offense: 4800 }
  ),
  createCharacter(
    'melch',
    'Melch',
    'Saboteur',
    ['Pirate', 'Ohnaka Gang'],
    'Ugnaught scavenger stealing buffs and trapping foes.',
    [
      makeAbility('melch_basic', 'Sneaky Fingers', 'basic', 0, 'Attack target enemy. Steal 1 random buff.', ['damage', 'steal_buff'], ['offensive']),
      makeAbility('melch_special_1', 'Salvage Rights', 'special', 3, 'Steal all buffs from target enemy. Gain 1 Treasure per buff stolen (Max 3). If target has Hostage: Inflict Ability Block (1 turn).', ['steal_buff_all', 'Treasure', 'Ability Block'], ['debuff']),
      makeAbility('melch_special_2', 'Trap Door', 'special', 4, 'Target enemy gains Ability Block and Speed Down (2 turns). If target has Hostage: Stun (1 turn). Gain 1 Treasure.', ['Ability Block', 'Speed Down', 'Stun', 'Treasure'], ['debuff']),
      makeAbility('melch_unique', 'Ugnaught Ingenuity', 'unique', 0, 'Whenever Melch steals buffs: Recover 5% Protection. Whenever enemies lose buffs: Gain 5% Turn Meter. Whenever Treasure reaches 10: Gain Stealth (2 turns).', ['protection_recovery_passive', 'turn_meter_gain_passive', 'Stealth'], [])
    ],
    'Ohnaka Gang',
    8400,
    'Buff stealing and debuffing',
    { speed: 135, hp: 38000, protection: 40000 }
  ),
  createCharacter(
    'azmorigan',
    'Azmorigan',
    'Tank / Strategist',
    ['Pirate', 'Ohnaka Gang'],
    'Merchant investing Hostages for defensive returns.',
    [
      makeAbility('azmorigan_basic', 'Debt Collection', 'basic', 0, 'Attack target enemy. If target has Hostage: Inflict Defense Down (2 turns).', ['damage', 'Defense Down'], ['offensive']),
      makeAbility('azmorigan_special_1', 'Interest Payments', 'special', 3, 'Target enemy gains Hostage (2 turns). Gain 2 Treasure. If target already had Hostage: Gain 1 extra Treasure.', ['Hostage', 'Treasure'], ['debuff']),
      makeAbility('azmorigan_special_2', 'Liquid Assets', 'special', 4, 'Consume 4 Treasure. All Pirate allies gain Protection Up (25%) and Defense Up (2 turns). If successful: Recover 15% Health.', ['consume_treasure', 'Protection Up', 'Defense Up', 'heal_aoe'], ['buff']),
      makeAbility('azmorigan_unique', 'Merchant Prince', 'unique', 0, 'Whenever Treasure is gained: Gain 5% Turn Meter. Whenever Treasure is consumed: Recover 5% Health. Whenever Hostage expires: Gain Defense Up.', ['turn_meter_gain_passive', 'heal_passive', 'Defense Up'], [])
    ],
    'Ohnaka Gang',
    8700,
    'Defensive Hostage enabler',
    { speed: 120, hp: 55000, protection: 60000 }
  ),
];
