import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const SEPARATIST_WAR_COUNCIL_CHARACTERS: Character[] = [
  createCharacter(
    'dooku_war_council',
    'Count Dooku',
    'Leader / Attacker / Strategist',
    ['Separatist', 'Sith', 'Separatist War Council'],
    'Leader of the War Council manipulating Corruption and commanding Debt.',
    [
      makeAbility('dooku_wc_basic', 'Makashi Riposte', 'basic', 0, 'Deal Physical Damage. Inflict Corruption. If target already has Corruption: Inflict Ability Block (1 turn).', ['damage', 'Corruption', 'Ability Block'], ['offensive']),
      makeAbility('dooku_wc_special_1', 'Political Manipulation', 'special', 3, 'Target enemy gains Corruption. Reduce their Turn Meter by 20%. If target already had Corruption: Stun (1 turn).', ['Corruption', 'turn_meter_reduction', 'Stun'], ['debuff']),
      makeAbility('dooku_wc_special_2', 'The Senate Is Weak', 'special', 4, 'Deal Physical Damage to all enemies. Enemies with Corruption: Lose 10% Turn Meter. All Separatist War Council allies gain: Debt.', ['damage_aoe', 'turn_meter_reduction_aoe', 'Debt'], ['offensive', 'buff']),
      makeAbility('dooku_wc_leader', 'Head Of State', 'leader', 0, 'Separatist War Council allies gain: 20 Speed, 20% Potency. Whenever an enemy gains Corruption: Recover 3% Health and Protection. Whenever an enemy uses Pay The Debt: All Separatist War Council allies gain Debt.', ['buff_faction'], []),
      makeAbility('dooku_wc_unique', 'Lord Tyranus', 'unique', 0, 'Whenever an enemy gains Corruption: Count Dooku gains 5% Turn Meter. Whenever an enemy with Corruption takes a turn: Count Dooku recovers 5% Health and Protection. Whenever a Separatist War Council ally gains Debt: Count Dooku gains 2% Offense (stacking). Maximum 50%.', ['turn_meter_gain_passive', 'heal_passive', 'offense_passive'], [])
    ],
    'Separatist War Council',
    10500,
    'Fast Control and Turn Meter gains from Corruption',
    { speed: 155, hp: 55000, protection: 45000, potency: 45 }
  ),
  createCharacter(
    'magnaguard_remnant',
    'MagnaGuard Remnant',
    'Tank / Summon',
    ['Separatist', 'Droid', 'Summon'],
    'Scarred, burning remnant bodyguard strictly devoted to defending the Eternal Fire.',
    [
      makeAbility('mgr_basic', 'Damaged Electrostaff', 'basic', 0, 'Deal Physical Damage. Inflict Offense Down (1 turn).', ['damage', 'Offense Down'], ['offensive']),
      makeAbility('mgr_special', 'Shield The General', 'special', 2, 'Gain: Taunt (2 turns) and Defense Up (2 turns).', ['Taunt', 'Defense Up'], ['defensive']),
      makeAbility('mgr_unique', 'Refuses To Fall', 'unique', 0, 'Whenever Eternal Fire Grievous takes damage: Recover 5% Health, Gain Taunt (1 Turn). Whenever this unit is defeated: Eternal Fire Grievous gains Offense Up (2 turns) and Tenacity Up (2 turns). This unit cannot be revived except by Eternal Fire Grievous\'s abilities.', ['heal_passive', 'Taunt', 'Offense Up', 'Tenacity Up'], [])
    ],
    'Separatist War Council',
    5000,
    'Devoted, self-sacrificing summon',
    { speed: 120, hp: 50000, protection: 40000 }
  ),
  createCharacter(
    'nute_gunray',
    'Nute Gunray',
    'Support / Saboteur',
    ['Separatist', 'Separatist War Council'],
    'Viceroy distributing Corruption and profiting from enemies.',
    [
      makeAbility('nute_wc_basic', 'Trade Federation Demands', 'basic', 0, 'Deal Physical Damage. Inflict Corruption.', ['damage', 'Corruption'], ['offensive']),
      makeAbility('nute_wc_special_1', 'Hidden Surcharges', 'special', 3, 'All enemies gain Corruption.', ['Corruption_aoe'], ['debuff']),
      makeAbility('nute_wc_special_2', 'Profit Above All', 'special', 4, 'All Separatist War Council allies gain: Debt. Recover 10% Health and Protection.', ['Debt', 'heal_aoe'], ['buff', 'heal']),
      makeAbility('nute_wc_unique', 'Viceroy Of The Trade Federation', 'unique', 0, 'Whenever an enemy uses Pay The Debt: Nute Gunray gains 10% Turn Meter. Whenever a Separatist War Council ally gains Debt: Recover 3% Health and Protection.', ['turn_meter_gain_passive', 'heal_passive'], [])
    ],
    'Separatist War Council',
    8200,
    'Surcharges and full-field Corruption',
    { speed: 135, hp: 45000, protection: 45000 }
  ),
  createCharacter(
    'wat_tambor',
    'Wat Tambor',
    'Support / Strategist',
    ['Separatist', 'Separatist War Council'],
    'Foreman infusing allies with powerful experimental upgrades and reducing cooldowns.',
    [
      makeAbility('wat_wc_basic', 'Techno Union Arsenal', 'basic', 0, 'Deal Special Damage. Target ally gains Potency Up (2 turns).', ['damage', 'Potency Up'], ['offensive', 'buff']),
      makeAbility('wat_wc_special_1', 'Experimental Upgrades', 'special', 3, 'Target ally gains: Offense Up (2 turns) and Defense Up (2 turns). If Wat Tambor has Debt: Consume 1 stack of Debt. Reduce target ally cooldowns by 1.', ['Offense Up', 'Defense Up', 'cooldown_decrease'], ['buff']),
      makeAbility('wat_wc_special_2', 'Industrial Investment', 'special', 4, 'All Separatist War Council allies gain Debt. All allies gain Protection Up (20%).', ['Debt', 'Protection Up'], ['buff']),
      makeAbility('wat_wc_unique', 'Foreman Of The Techno Union', 'unique', 0, 'Whenever Wat Tambor gains Debt: Recover 5% Health and Protection. Whenever a Separatist War Council ally gains Debt: Gain 2% Turn Meter.', ['heal_passive', 'turn_meter_gain_passive'], [])
    ],
    'Separatist War Council',
    8400,
    'Powerful coordinated upgrades and Cooldown Reduction',
    { speed: 140, hp: 50000, protection: 50000 }
  ),
  createCharacter(
    'lott_dod',
    'Lot Dodd',
    'Support / Strategist',
    ['Separatist', 'Separatist War Council'],
    'Banking Clan representative leveraging Debt for Turn Meter loops.',
    [
      makeAbility('lott_wc_basic', 'Banking Clan Influence', 'basic', 0, 'Deal Special Damage. Inflict Corruption.', ['damage', 'Corruption'], ['offensive']),
      makeAbility('lott_wc_special_1', 'Extend The Loan', 'special', 3, 'Target enemy gains: Corruption. Speed Down (2 turns).', ['Corruption', 'Speed Down'], ['debuff']),
      makeAbility('lott_wc_special_2', 'Compound Interest', 'special', 4, 'All Separatist War Council allies gain Debt. For each ally with Debt: Gain 5% Turn Meter.', ['Debt', 'turn_meter_gain'], ['buff']),
      makeAbility('lott_wc_unique', 'Representative Of The Banking Clan', 'unique', 0, 'Whenever an enemy uses Pay The Debt: Lot Dodd gains 5% Turn Meter. Whenever a Separatist War Council ally gains Debt: Gain 2% Potency (stacking). Maximum 50%.', ['turn_meter_gain_passive', 'potency_passive'], [])
    ],
    'Separatist War Council',
    8100,
    'Potency scaling and massive turn meter gains',
    { speed: 128, hp: 42000, protection: 48000 }
  ),
  createCharacter(
    'whorm_loathsom',
    'Whorm Loathsom',
    'Tank / Strategist',
    ['Separatist', 'Separatist War Council'],
    'Commerce Guild marshal locking down Corrupt targets.',
    [
      makeAbility('whorm_wc_basic', 'Forward Advance', 'basic', 0, 'Deal Physical Damage. If target has Corruption: Inflict Offense Down (2 turns).', ['damage', 'Offense Down'], ['offensive']),
      makeAbility('whorm_wc_special_1', 'Mechanized Offensive', 'special', 3, 'Gain: Taunt (2 turns) and Defense Up (2 turns). All enemies with Corruption lose 10% Turn Meter.', ['Taunt', 'Defense Up', 'turn_meter_reduction_aoe'], ['defensive', 'debuff']),
      makeAbility('whorm_wc_special_2', 'Corporate Military', 'special', 4, 'All Separatist War Council allies gain Debt. Whorm Loathsom gains Protection Up (40%).', ['Debt', 'Protection Up'], ['buff']),
      makeAbility('whorm_wc_unique', 'Commerce Guild Marshal', 'unique', 0, 'Whenever a Separatist War Council ally gains Debt: Recover 5% Protection. Whenever an enemy with Corruption takes a turn: Whorm gains 5% Turn Meter.', ['protection_recovery_passive', 'turn_meter_gain_passive'], [])
    ],
    'Separatist War Council',
    8300,
    'Taunting brick wall punishing Corruption',
    { speed: 115, hp: 60000, protection: 55000 }
  ),
  createCharacter(
    'rune_haako',
    'Rune Haako',
    'Support / Saboteur',
    ['Separatist', 'Separatist War Council'],
    'Bureaucratic Saboteur taxing enemies in the name of the Trade Federation.',
    [
      makeAbility('rune_basic', 'Administrative Pressure', 'basic', 0, 'Deal Special Damage. Inflict Corruption.', ['damage', 'Corruption'], ['offensive']),
      makeAbility('rune_special_1', 'Emergency Taxation', 'special', 3, 'Target enemy gains Corruption. If target already had Corruption: Reduce cooldowns of all Separatist War Council allies by 1.', ['Corruption', 'cooldown_decrease_aoe'], ['debuff', 'buff']),
      makeAbility('rune_special_2', 'Collection Department', 'special', 4, 'All enemies with Corruption gain: Healing Immunity (2 turns). All Separatist War Council allies gain Debt.', ['Healing Immunity', 'Debt'], ['debuff', 'buff']),
      makeAbility('rune_unique', 'Chief Of Staff', 'unique', 0, 'Whenever a Separatist War Council ally gains Debt: Rune Haako gains 5% Turn Meter. Debt gained by Separatist War Council allies grants +7% Offense, +7% Defense, +7% Potency instead of +5%. Whenever an enemy uses Pay The Debt: Rune Haako recovers 10% Health and Protection.', ['turn_meter_gain_passive', 'stat_boost_passive', 'heal_passive'], [])
    ],
    'Separatist War Council',
    8250,
    'Debt amplification and Cooldown reduction',
    { speed: 132, hp: 44000, protection: 46000 }
  )
];
