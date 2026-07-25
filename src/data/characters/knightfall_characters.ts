import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const KNIGHTFALL_CHARACTERS: Character[] = [
  createCharacter(
    'commander_appo',
    'Commander Appo',
    'Leader / Strategist',
    ['Empire', 'Clone Trooper', 'Knightfall'],
    'Ruthless clone commander leading the Jedi Purge inside the temple with coordinated assist fire.',
    [
      makeAbility('appo_m_basic', 'Execute the Traitors', 'basic', 0, 'Deal Physical Damage. Inflict 2 stacks of Order 66 for 2 turns. If target already has Order 66: Call random Knightfall ally to assist.', ['damage', 'assist', 'Order 66'], ['offensive']),
      makeAbility('appo_m_special_1', 'Knightfall Advance', 'special', 3, 'All Knightfall allies gain Dramatic Entrance. Commander Appo gains 25% Turn Meter. All enemies gain 2 stacks of Order 66.', ['turn_meter_gain', 'Dramatic Entrance', 'Order 66'], ['offensive']),
      makeAbility('appo_m_special_2', 'Operation Knightfall', 'special', 4, 'Inflict 3 stacks of Order 66 and 2 stacks of Purge on all enemies. Call all Knightfall allies to assist target enemy. If target reaches 10 stacks of Order 66: Consume all Order 66. Inflict Ability Block, Healing Immunity, and Exposed for 2 turns.', ['assist', 'Ability Block', 'Healing Immunity', 'Exposed', 'Purge', 'Order 66'], ['offensive']),
      makeAbility('appo_m_leader', 'The Jedi Temple Burns', 'leader', 0, 'Knightfall allies gain: +35 Speed, +30% Offense. Whenever a Knightfall ally attacks: 20% chance to apply Order 66. Whenever Purge is applied: Apply 1 stack of Order 66. Whenever Order 66 is applied: 20% chance to apply Purge. Knightfall allies recover 3% Protection whenever an enemy gains Order 66.', ['buff_faction', 'Purge', 'Order 66'], []),
      makeAbility('appo_m_unique', 'Lord Vader\'s Right Hand', 'unique', 0, 'Whenever a Knightfall ally gains Dramatic Entrance: Commander Appo gains 10% Turn Meter. Whenever an enemy reaches 10 stacks of Order 66: All Knightfall allies gain Offense Up for 2 turns. If Lord Vader is present: Knightfall allies gain +20% Max Health and +20% Critical Damage.', ['turn_meter_gain', 'Offense Up', 'Dramatic Entrance', 'Order 66'], [])
    ],
    'Knightfall',
    8500,
    'Aggressive assist coordinate leadership',
    { speed: 134, offense: 3400, hp: 50000, protection: 40000 }
  ),

  createCharacter(
    'knightfall_commander',
    'Knightfall Commander',
    'Tank / Protector',
    ['Empire', 'Clone Trooper', 'Knightfall'],
    'Frontline clone guardian consumed by absolute loyalty during Order 66, securing Knightfall defenses.',
    [
      makeAbility('kfc_basic', 'Suppressive Fire', 'basic', 0, 'Deal Physical Damage. Inflict Offense Down. Apply 1 stack of Order 66.', ['damage', 'Offense Down', 'Order 66'], ['offensive']),
      makeAbility('kfc_special_1', 'Advance Formation', 'special', 3, 'Gain Taunt. Gain Defense Up. Knightfall allies gain Protection Up.', ['taunt', 'Taunt', 'Defense Up', 'Protection Up'], ['defensive']),
      makeAbility('kfc_special_2', 'Hold The Line', 'special', 4, 'Dispel debuffs from Knightfall allies. Apply 2 stacks of Order 66 to all enemies. Gain Dramatic Entrance.', ['cleanse_ally', 'Dramatic Entrance', 'Order 66'], ['defensive']),
      makeAbility('kfc_unique', 'Temple Assault Commander', 'unique', 0, 'Whenever a Knightfall ally gains Dramatic Entrance: Taunt for 1 turn. Whenever Order 66 is applied: Recover 3% Protection. Whenever an enemy reaches 10 stacks of Order 66: Gain Retribution.', ['Taunt', 'Retribution', 'Dramatic Entrance', 'Order 66'], [])
    ],
    'Knightfall',
    8100,
    'Sustained defensive block tanking',
    { speed: 118, hp: 58000, protection: 50000 }
  ),

  createCharacter(
    'commander_fox',
    'Commander Fox',
    'Attacker / Executioner',
    ['Empire', 'Clone Trooper', 'Knightfall'],
    'Cold, efficient officer specializing in lockdown protocols and out-of-turn execution responses.',
    [
      makeAbility('fox_basic', 'Point Blank Execution', 'basic', 0, 'Deal Physical Damage. Inflict 2 stacks of Order 66. If enemy has Purge: Ignore Protection.', ['damage', 'Purge', 'Order 66'], ['offensive']),
      makeAbility('fox_special_1', 'Judgment Protocol', 'special', 3, 'Deal massive Physical Damage. Consume all Order 66 from target. Deal bonus damage for each stack consumed. Enemy defeated by this attack cannot be revived.', ['damage_heavy', 'Order 66'], ['offensive']),
      makeAbility('fox_special_2', 'No Exceptions', 'special', 4, 'Inflict Buff Immunity. Inflict Healing Immunity. Apply 4 stacks of Order 66. Fox gains Dramatic Entrance.', ['Buff Immunity', 'Healing Immunity', 'Dramatic Entrance', 'Order 66'], ['debuff']),
      makeAbility('fox_unique', 'The Coruscant Guard', 'unique', 0, 'Whenever an enemy reaches 10 stacks of Order 66: Fox gains: Offense Up, Critical Damage Up, Advantage for 2 turns. Whenever Purge is consumed: Fox assists.', ['Offense Up', 'Advantage', 'assist_passive', 'Critical Damage Up', 'Purge', 'Order 66'], [])
    ],
    'Knightfall',
    8200,
    'Tactics speed down and lock downs',
    { speed: 130, hp: 48000, protection: 38000 }
  ),

  createCharacter(
    'crosshair_imperial',
    'Crosshair (Imperial Marksman)',
    'Attacker / Hunter',
    ['Empire', 'Clone Trooper', 'Knightfall'],
    'Elite sniper serving the Empire through ruthless accuracy and single-target execution.',
    [
      makeAbility('cross_basic', 'Calculated Shot', 'basic', 0, 'Deal Physical Damage. Apply Pursued for 2 turns.', ['damage', 'Pursued'], ['offensive']),
      makeAbility('cross_special', 'One Mile Away', 'special', 3, 'Deal massive Physical Damage. Apply 3 stacks of Order 66. If target has Pursued: Attack again.', ['damage_heavy', 'Pursued', 'Order 66'], ['offensive']),
      makeAbility('cross_special_2', 'Target Acquired', 'special', 4, 'Apply Pursued. Apply 3 stacks of Purge. Reduce Turn Meter by 30%.', ['turn_meter_reduction', 'Pursued', 'Purge'], ['debuff']),
      makeAbility('cross_unique', 'Never Misses', 'unique', 0, 'Knightfall allies gain +15% Critical Chance against Pursued enemies. Whenever an enemy with Pursued takes damage: Crosshair gains 5% Turn Meter. Whenever an enemy with Order 66 reaches 10 stacks: Crosshair immediately attacks them.', ['turn_meter_gain', 'Pursued', 'Order 66'], [])
    ],
    'Knightfall',
    8400,
    'Single target marksman and protection bypass',
    { speed: 138, offense: 3800, critChance: 0.50 }
  ),

  createCharacter(
    'scorch_knightfall',
    'Scorch (Knightfall)',
    'Bruiser / AoE Attacker',
    ['Empire', 'Clone Trooper', 'Knightfall'],
    'Heavy demolition commando sweeping rooms with overwhelming brute-force heavy blaster fire.',
    [
      makeAbility('scorch_basic', 'Heavy Repeater', 'basic', 0, 'Deal Physical Damage. 50% chance to apply Daze.', ['damage', 'Daze'], ['offensive']),
      makeAbility('scorch_special', 'Explosive Entry', 'special', 3, 'Gain Dramatic Entrance. Deal Physical Damage to all enemies. Apply Burning. Apply 2 stacks of Order 66.', ['damage_aoe', 'Burning', 'Dramatic Entrance', 'Order 66'], ['offensive']),
      makeAbility('scorch_special_2', 'Demolition Protocol', 'special', 4, 'Deal Physical Damage to all enemies. Consume Purge. Deal bonus damage for each Purge consumed.', ['damage_aoe', 'Purge'], ['offensive']),
      makeAbility('scorch_unique', 'Heavy Weapons Specialist', 'unique', 0, 'Whenever Dramatic Entrance triggers: Scorch gains 20% Offense. Whenever enemies suffer Burning: Apply Order 66. Whenever Order 66 is consumed: Scorch assists.', ['assist_passive', 'Dramatic Entrance', 'Burning', 'Order 66'], [])
    ],
    'Knightfall',
    8350,
    'Bruiser style tanking and aggression',
    { speed: 114, offense: 3300, hp: 55000, protection: 46000 }
  ),

  createCharacter(
    'gl_lord_vader',
    'Lord Vader',
    'Galactic Legend / Leader / Tank / Attacker',
    ['Empire', 'Sith', 'Galactic Legend', 'Knightfall'],
    'The ultimate form of Anakin Skywalker consumed entirely by hatred and domination, leading the Imperial standard.',
    [
      makeAbility('lv_basic', 'Crushing Strike', 'basic', 0, 'Deal Physical Damage to target enemy. Inflict: 2 stacks of Order 66. If target already has Purge: Attack again dealing reduced damage. If target has 10 stacks of Order 66: Inflict Healing Immunity and Ability Block for 2 turns.', ['damage', 'Healing Immunity', 'Ability Block', 'Purge', 'Order 66'], ['offensive']),
      makeAbility('lv_special_1', 'You Will Not Stop Me', 'special', 3, 'Deal Physical Damage to all enemies. Inflict: 2 stacks of Order 66, 1 stack of Purge. All Knightfall allies gain: Offense Up (2 turns). Lord Vader gains: Damage Immunity (1 turn). If at least one enemy had Purge: Recover 20% Protection.', ['damage_aoe', 'Offense Up', 'Damage Immunity', 'Purge', 'Order 66'], ['offensive']),
      makeAbility('lv_special_2', 'March on the Temple', 'special', 4, 'Dispel all buffs from enemies. Apply: 3 stacks of Order 66, 2 stacks of Purge. Call all Knightfall allies to assist. Enemies defeated by this ability cannot be revived. If Commander Appo is present: All enemies lose 25% Turn Meter.', ['dispel_all', 'assist', 'turn_meter_reduction', 'Purge', 'Order 66'], ['offensive']),
      makeAbility('lv_leader', 'Knightfall Protocol', 'leader', 0, 'Empire and Knightfall allies gain: +40 Speed, +40% Max Health, +40% Offense. Whenever a Knightfall ally applies Order 66: Apply 1 stack of Purge. Whenever a Knightfall ally applies Purge: Apply 1 stack of Order 66. The first time an enemy reaches 10 stacks of Order 66: Consume all stacks and inflict: Healing Immunity, Ability Block, Marked (2 turns). Enemies with Purge take 25% more damage from Knightfall allies. Enemies with Order 66 take 2% more damage per stack. Whenever an enemy is defeated: Knightfall allies recover 20% Health, 20% Protection.', ['buff_gl_faction', 'Healing Immunity', 'Ability Block', 'Marked', 'Purge', 'Order 66'], []),
      makeAbility('lv_unique', 'The Fall of the Jedi', 'unique', 0, 'Galactic Legend mechanics apply. At the start of battle: Lord Vader gains Taunt for 1 turn. Knightfall allies gain Dramatic Entrance. Whenever a Knightfall ally uses a Special ability: Lord Vader gains 5% Turn Meter. Whenever an enemy gains Order 66: Lord Vader gains 2% Offense. Whenever an enemy gains Purge: Lord Vader gains 2% Critical Damage. If Commander Appo is active: Knightfall immune to Fear. If Commander Fox is active: Lord Vader ignores Protection vs 10 stacks of Order 66. If Crosshair is active: Lord Vader no evade. If Scorch is active: Burning enemies deal 25% less damage. If Knightfall Commander is active: Lord Vader gains 30% Defense and 30% Tenacity.', ['passive_gl_immunity', 'Taunt', 'Dramatic Entrance', 'Fear', 'Burning', 'Purge', 'Order 66'], []),
      makeAbility('lv_ultimate', 'Execute Order 66', 'ultimate', 0, 'Activate at 100% Ultimate Charge. Enter Ultimate Stance for 3 turns. Enemies receive: 10x Order 66, 5x Purge, Healing Immunity, Daze, Buff Immunity. Knightfall allies gain Dramatic Entrance, Offense Up, Critical Damage Up. While in Ultimate Stance: Lord Vader ignores Taunt and Protection, immune to Turn Meter manipulation. Whenever Lord Vader damages an enemy: Inflict Burning (2 turns), add 1 stack of Order 66. At end of Ultimate Stance: Deal massive True Damage to all enemies. Enemies defeated cannot be revived.', ['Healing Immunity', 'Daze', 'Buff Immunity', 'Offense Up', 'Burning', 'Critical Damage Up', 'Taunt', 'Dramatic Entrance', 'Purge', 'Order 66'], ['ultimate'], 100)
    ],
    'Knightfall',
    15000,
    'Elite suppression Sith powerhouse',
    { speed: 155, hp: 86000, protection: 64000, defense: 55 }
  )
];