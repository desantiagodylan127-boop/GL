import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const THE_NETWORK_CHARACTERS: Character[] = [
  createCharacter(
    'maz_kanata_gl',
    'Maz Kanata',
    'Leader / Strategist / Support / Galactic Legend',
    ['Smuggler', 'Pirate', 'The Network', 'Galactic Legend', 'Journey Character'],
    'Galactic Legend controlling battleflows via Information Broker dominance.',
    [
      makeAbility('maz_basic', 'I\'ve Seen This Before', 'basic', 0, 'Attack target enemy. Inflict Information Broker (2 turns). If target already has Information Broker: Steal 1 random buff.', ['damage', 'Information Broker', 'steal_buff'], ['offensive']),
      makeAbility('maz_special_1', 'A Useful Secret', 'special', 3, 'Target enemy gains Information Broker (3 turns). Then dispel all buffs. For each buff removed: Recover 5% Protection.', ['Information Broker', 'dispel', 'protection_recovery'], ['debuff']),
      makeAbility('maz_special_2', 'Call In A Favor', 'special', 4, 'Target ally gains Bonus Turn and Offense Up (2 turns). If enemy target has Information Broker: Ally ignores Taunt during Bonus Turn.', ['bonus_turn', 'Offense Up'], ['buff']),
      makeAbility('maz_leader', 'The Network Knows', 'leader', 0, 'Network allies gain +30 Speed, +25% Potency. Whenever Information Broker is applied: Recover 3% Protection. Whenever enemy gains 3 stacks: Steal 1 random buff. Network allies deal 20% more damage to enemies with Information Broker.', ['buff_faction', 'protection_recovery_aoe_passive', 'steal_buff', 'bonus_damage_passive'], []),
      makeAbility('maz_unique', 'Centuries Of Connections', 'unique', 0, 'Whenever enemy with Info Broker takes a turn: Maz gains 5% Turn Meter. Whenever buff stored: Recover 5% Health. Whenever enemy defeated: Spread Information Broker to all remaining enemies.', ['turn_meter_gain_passive', 'heal_passive', 'Information Broker'], []),
      makeAbility('maz_ultimate', 'Everyone Owes Someone', 'ultimate', 0, '100% Charge. All enemies gain 3 stacks of Information Broker. Steal all buffs from all enemies. Distribute among allies. Call all Network allies to Assist.', ['Information Broker', 'steal_buff_all', 'assist_aoe'], [])
    ],
    'The Network',
    25000,
    'Information Broker economy',
    { speed: 155, hp: 70000, protection: 65000, potency: 60 }
  ),
  createCharacter(
    'emmie',
    'ME-8D9 "Emmie"',
    'Leader / Strategist / Support',
    ['The Network'],
    'Maz\'s chief coordinator managing Information Broker stacks.',
    [
      makeAbility('emmie_basic', 'Coordinate Assets', 'basic', 0, 'Attack target enemy. Inflict Information Broker (1 turn).', ['damage', 'Information Broker'], ['offensive']),
      makeAbility('emmie_special_1', 'Contact Network', 'special', 3, 'Target ally gains Speed Up (2 turns) and 20% Turn Meter.', ['Speed Up', 'turn_meter_gain'], ['buff']),
      makeAbility('emmie_special_2', 'Information Exchange', 'special', 4, 'Transfer all Information Broker stacks from target enemy to another enemy. Both lose 10% Turn Meter.', ['Information Broker', 'turn_meter_reduction'], ['debuff']),
      makeAbility('emmie_leader', 'Trusted Operator', 'leader', 0, 'Network allies gain +20 Speed, +20% Potency. Whenever Information Broker is applied: Recover 2% Protection.', ['buff_faction', 'protection_recovery_aoe_passive'], []),
      makeAbility('emmie_unique', 'Master Coordinator', 'unique', 0, 'Whenever ally uses Special Ability: 50% chance to apply Information Broker. Whenever enemy reaches 3 stacks: Emmie gains Bonus Turn Meter.', ['Information Broker', 'turn_meter_gain_passive'], [])
    ],
    'The Network',
    8500,
    'Stack management and Turn Meter',
    { speed: 145, hp: 45000, protection: 45000 }
  ),
  createCharacter(
    'sm_33',
    'SM-33',
    'Tank / Attacker',
    ['Pirate', 'The Network'],
    'Ancient pirate droid devastating Information Broker targets.',
    [
      makeAbility('sm33_basic', 'Heavy Cutlass', 'basic', 0, 'Attack target enemy. If target has Information Broker: Deal bonus damage.', ['damage', 'bonus_damage'], ['offensive']),
      makeAbility('sm33_special_1', 'Forgotten Armada', 'special', 3, 'Gain Taunt and Defense Up (2 turns). Enemies with Information Broker lose 10% Turn Meter.', ['Taunt', 'Defense Up', 'turn_meter_reduction_aoe'], ['defensive']),
      makeAbility('sm33_special_2', 'Pirate Execution Protocol', 'special', 4, 'Attack target enemy. Deal additional damage for each stack of Information Broker.', ['damage', 'bonus_damage'], ['offensive']),
      makeAbility('sm33_unique', 'Buried Secrets', 'unique', 0, 'Whenever enemy gains Information Broker: Recover 5% Protection. Whenever enemy reaches 3 stacks: Gain Taunt.', ['protection_recovery_passive', 'Taunt'], [])
    ],
    'The Network',
    9000,
    'Taunting tank and heavy damage punisher',
    { speed: 110, hp: 60000, protection: 70000 }
  ),
  createCharacter(
    'prast_ror',
    'Prast Ror',
    'Saboteur / Strategist',
    ['The Network'],
    'Information broker specializing in vulnerability exploitation.',
    [
      makeAbility('prast_basic', 'Expose Weakness', 'basic', 0, 'Attack target enemy. Inflict Information Broker.', ['damage', 'Information Broker'], ['offensive']),
      makeAbility('prast_special_1', 'Dig Deeper', 'special', 3, 'Target enemy gains 2 stacks of Information Broker.', ['Information Broker'], ['debuff']),
      makeAbility('prast_special_2', 'Blackmail Material', 'special', 4, 'Steal 2 random buffs. Apply Information Broker.', ['steal_buff', 'Information Broker'], ['debuff']),
      makeAbility('prast_unique', 'Information Is Power', 'unique', 0, 'Whenever buffs are stolen: Gain 10% Turn Meter. Whenever enemy has 3 stacks of Info Broker: Ignore 25% Defense.', ['turn_meter_gain_passive', 'ignore_defense'], [])
    ],
    'The Network',
    8200,
    'Stack scaling',
    { speed: 138, hp: 40000, protection: 35000 }
  ),
  createCharacter(
    'dexter_jettster',
    'Dexter Jettster',
    'Support / Strategist',
    ['The Network'],
    'Valuable informant healing allies and passing info rumors.',
    [
      makeAbility('dexter_basic', 'Heard Something Interesting', 'basic', 0, 'Attack target enemy. Inflict Information Broker.', ['damage', 'Information Broker'], ['offensive']),
      makeAbility('dexter_special_1', 'Old Friend', 'special', 3, 'Target ally gains Protection Up (25%) and Tenacity Up (2 turns).', ['Protection Up', 'Tenacity Up'], ['buff']),
      makeAbility('dexter_special_2', 'Diner Rumors', 'special', 4, 'All enemies gain Information Broker. Recover 15% Protection.', ['Information Broker_aoe', 'protection_recovery_aoe'], ['debuff', 'heal']),
      makeAbility('dexter_unique', 'Everybody Talks', 'unique', 0, 'Whenever enemy gains Information Broker: Allies recover 2% Protection. Whenever ally gains a buff: Dexter gains Turn Meter.', ['protection_recovery_aoe_passive', 'turn_meter_gain_passive'], [])
    ],
    'The Network',
    8800,
    'Support and mass Info Broker',
    { speed: 125, hp: 55000, protection: 50000 }
  ),
  createCharacter(
    'scissorpunch',
    'Scissorpunch',
    'Attacker',
    ['The Network'],
    'Intimidating enforcer dealing massive damage to compromised targets.',
    [
      makeAbility('scissor_basic', 'Brutal Strike', 'basic', 0, 'Attack target enemy. Deal bonus damage against enemies with Information Broker.', ['damage', 'bonus_damage'], ['offensive']),
      makeAbility('scissor_special_1', 'Finish The Job', 'special', 3, 'Attack target enemy. Ignore 25% Defense. If target has 3 stacks of Info Broker: Ignore Taunt.', ['damage', 'ignore_defense', 'ignore_taunt'], ['offensive']),
      makeAbility('scissor_special_2', 'Scissor Storm', 'special', 4, 'Attack all enemies. Deal bonus damage for each Information Broker stack present.', ['damage_aoe', 'bonus_damage'], ['offensive']),
      makeAbility('scissor_unique', 'Network Enforcer', 'unique', 0, 'Whenever enemy reaches 3 stacks of Information Broker: Gain Offense Up (2 turns). Whenever enemy with Info Broker is defeated: Gain 25% Turn Meter.', ['Offense Up', 'turn_meter_gain_passive'], [])
    ],
    'The Network',
    8600,
    'Heavy hitter',
    { speed: 130, hp: 45000, protection: 40000, offense: 4800 }
  )
];
