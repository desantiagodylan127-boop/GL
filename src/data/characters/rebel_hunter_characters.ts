import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const REBEL_HUNTER_CHARACTERS: Character[] = [
  createCharacter(
    'dengar',
    'Dengar',
    'Leader / Tank',
    ['Rebel Hunter', 'Bounty Hunter', 'Scoundrel'],
    'Gritty bounty hunter.',
    [
      makeAbility('dengar_basic', 'Suppressive Fire', 'basic', 0, 'Deal Physical Damage. Inflict Offense Down (2 turns). If target has Imperial Contract: Inflict Speed Down (2 turns).', ['damage', 'Offense Down', 'Speed Down'], ['offensive']),
      makeAbility('dengar_special_1', 'Flush Them Out', 'special', 3, 'Deal Physical Damage to all enemies. Enemies with Stealth lose Stealth. Enemy with Imperial Contract loses 10% Turn Meter.', ['damage_aoe', 'turn_meter_reduction', 'Stealth'], ['offensive']),
      makeAbility('dengar_special_2', 'No Escape Route', 'special', 4, 'Gain Taunt (2 turns), Defense Up (2 turns), and Retribution (2 turns). Whenever an enemy attacks an ally other than Dengar: Dengar immediately counterattacks that enemy. If the enemy has Imperial Contract: Recover 10% Protection.', ['taunt', 'Defense Up', 'Retribution', 'protection_recovery', 'Taunt'], ['defensive']),
      makeAbility('dengar_leader', 'The Hunt Begins', 'leader', 0, 'At the start of battle: Enemy Leader gains Imperial Contract. Rebel Hunter allies gain 20 Speed and 20% Max Protection. Whenever an enemy with Imperial Contract is damaged: Rebel Hunter allies recover 2% Protection. Whenever Imperial Contract transfers: Rebel Hunter allies gain 10% Turn Meter.', ['leader', 'protection_recovery_passive', 'turn_meter_gain_passive', 'Imperial Contract'], []),
      makeAbility('dengar_unique', 'Professional Tracker', 'unique', 0, 'Whenever an enemy with Imperial Contract falls below 50% Health: Dengar gains Taunt (1 turn). Whenever an enemy with Imperial Contract is defeated: Recover 20% Health and Protection. Whenever Dengar counterattacks: Deal 25% additional damage to enemies with Imperial Contract.', ['taunt_passive', 'protection_recovery_passive', 'Taunt', 'Imperial Contract'], [])
    ],
    'Rebel Hunter',
    6500,
    'Tough tank with anti-stealth.',
    { speed: 110, hp: 55000, protection: 55000, defense: 60 }
  ),
  createCharacter(
    'embo_warlord',
    'Embo (Warlord)',
    'Attacker / Strategist',
    ['Rebel Hunter', 'Bounty Hunter', 'Pirate', 'Hutt Cartel'],
    'Lethal bounty hunter accompanied by Keibu.',
    [
      makeAbility('embow_basic', 'Hat Toss', 'basic', 0, 'Deal Physical Damage. Ignore Taunt if target has Imperial Contract. If target has Imperial Contract: Attack again.', ['damage', 'bonus_attack', 'Imperial Contract'], ['offensive']),
      makeAbility('embow_special_1', 'Merciless Pursuit', 'special', 3, 'Deal Massive Physical Damage. If target has Imperial Contract: Ignore 30% Defense, Inflict Healing Immunity (2 turns).', ['damage_heavy', 'Healing Immunity', 'Imperial Contract'], ['offensive']),
      makeAbility('embow_special_2', 'The Price Of Failure', 'special', 4, 'Call Keibu and a random Rebel Hunter ally to assist. If target has Imperial Contract: Both assists deal 50% additional damage.', ['assist_faction', 'Imperial Contract'], ['offensive']),
      makeAbility('embow_unique_1', 'Warlord Of The Hunt', 'unique', 0, 'Whenever Imperial Contract transfers: Gain Offense Up (2 turns) and Critical Damage Up (2 turns). Whenever an enemy with Imperial Contract is defeated: Reduce all cooldowns by 1. Whenever Embo attacks an enemy with Imperial Contract: Gain 5% Turn Meter.', ['turn_meter_gain_passive', 'Offense Up', 'Critical Damage Up', 'Imperial Contract'], []),
      makeAbility('embow_unique_2', 'The One They Send Last', 'unique', 0, 'Whenever an enemy falls below 50% Health: Gain 5% Offense (stacking). Maximum 20 stacks. Whenever Embo defeats an enemy: Recover 20% Protection. If the defeated enemy had Imperial Contract: Immediately take a bonus turn. Summon Keibu at battle start.', ['passive_gain', 'protection_recovery_passive', 'Imperial Contract'], [])
    ],
    'Rebel Hunter',
    8000,
    'Summons Keibu and dominates single targets.',
    { speed: 135, offense: 5000 }
  ),
  createCharacter(
    'keibu',
    'Keibu',
    'Attacker / Support',
    ['Rebel Hunter', 'Summon'],
    'Embo\'s faithful anooba companion.',
    [
      makeAbility('keibu_basic', 'Savage Bite', 'basic', 0, 'Deal Physical Damage. If target has Imperial Contract: Inflict Offense Down (2 turns).', ['damage', 'Offense Down', 'Imperial Contract'], ['offensive']),
      makeAbility('keibu_special', 'Pack Hunter', 'special', 3, 'Deal Physical Damage. If target has Imperial Contract: Call Embo to assist. If Embo assists: Both attacks deal 25% additional damage.', ['damage', 'assist', 'Imperial Contract'], ['offensive']),
      makeAbility('keibu_unique_1', 'Faithful Companion', 'unique', 0, 'Keibu is summoned at the start of battle. Cannot be revived. Cannot gain Imperial Contract. Whenever Embo attacks an enemy with Imperial Contract: Keibu assists. Whenever Keibu attacks an enemy with Imperial Contract: Embo gains 3% Turn Meter.', ['assist_passive', 'turn_meter_gain_ally', 'Imperial Contract'], []),
      makeAbility('keibu_unique_2', 'Hunter\'s Bond', 'unique', 0, 'While Embo is active: Keibu gains 50% Max Health, 25% Offense, 25 Speed. Whenever Imperial Contract transfers: Keibu gains Offense Up (2 turns). Whenever an enemy with Imperial Contract is defeated: Keibu recovers 100% Health. If Embo is defeated: Keibu immediately escapes from battle.', ['passive_gain', 'Offense Up', 'Imperial Contract'], [])
    ],
    'Rebel Hunter',
    4000,
    'Assists Embo.',
    { speed: 140, hp: 30000, offense: 3000 }
  ),
  createCharacter(
    'four_lom',
    '4-LOM',
    'Support / Saboteur',
    ['Rebel Hunter', 'Bounty Hunter', 'Droid'],
    'Protocol droid turned bounty hunter.',
    [
      makeAbility('4lom_basic', 'Calculated Disruption', 'basic', 0, 'Deal Physical Damage. Inflict Offense Down (2 turns). If target has Imperial Contract: Inflict Ability Block (1 turn). If Zuckuss is an ally: Zuckuss gains 5% Turn Meter.', ['damage', 'Offense Down', 'Ability Block', 'Imperial Contract'], ['offensive', 'debuff']),
      makeAbility('4lom_special_1', 'System Interference', 'special', 3, 'Deal Physical Damage. Inflict Daze (2 turns) and Speed Down (2 turns). If target has Imperial Contract: Remove 10% Turn Meter. If Zuckuss is an ally: Call him to assist.', ['damage', 'turn_meter_reduction', 'Daze', 'Speed Down', 'Imperial Contract'], ['offensive', 'debuff']),
      makeAbility('4lom_special_2', 'Hunter Coordination', 'special', 4, 'Call target Rebel Hunter ally to assist. If the target enemy has Imperial Contract: Call another random Rebel Hunter ally to assist. If Zuckuss is an ally: He is always selected as the second assist.', ['assist_faction', 'Imperial Contract'], ['offensive']),
      makeAbility('4lom_unique', 'Partner Protocol', 'unique', 0, 'Whenever Zuckuss inflicts Blind: 4-LOM gains 5% Turn Meter. Whenever Zuckuss attacks an enemy with Imperial Contract: 4-LOM assists dealing 50% reduced damage. Whenever a Rebel Hunter ally attacks an enemy with Imperial Contract: 4-LOM recovers 3% Protection.', ['turn_meter_gain_passive', 'assist_passive', 'protection_recovery_passive', 'Imperial Contract'], [])
    ],
    'Rebel Hunter',
    6000,
    'Pairs well with Zuckuss.',
    { speed: 125 }
  ),
  createCharacter(
    'zuckuss',
    'Zuckuss',
    'Support / Strategist',
    ['Rebel Hunter', 'Bounty Hunter', 'Unaligned Force User'],
    'Findsman who tracks his prey using the Force.',
    [
      makeAbility('zuckuss_basic', 'Mist Hunter Rifle', 'basic', 0, 'Deal Physical Damage. Inflict Blind (1 turn). If target has Imperial Contract: Inflict Blind for 2 turns instead.', ['damage', 'Blind', 'Imperial Contract'], ['offensive', 'debuff']),
      makeAbility('zuckuss_special_1', 'Toxic Atmosphere', 'special', 3, 'Deal Physical Damage to all enemies. Inflict Blind (2 turns). Enemy with Imperial Contract loses 10% Turn Meter. If 4-LOM is an ally: 4-LOM gains 10% Turn Meter.', ['damage_aoe', 'turn_meter_reduction', 'Blind', 'Imperial Contract'], ['offensive', 'debuff']),
      makeAbility('zuckuss_special_2', 'Predictive Tracking', 'special', 4, 'Select target enemy. Until the start of Zuckuss\'s next turn: Whenever that enemy gains Turn Meter: Lose 5% Turn Meter. If that enemy has Imperial Contract: Double this effect. If 4-LOM is active: 4-LOM gains Stealth (2 turns).', ['debuff', 'Stealth', 'Imperial Contract'], ['debuff', 'buff']),
      makeAbility('zuckuss_unique', 'Mystic Tracker', 'unique', 0, 'Whenever Imperial Contract transfers: Gain Foresight (2 turns). Whenever an enemy with Imperial Contract misses an attack: All Rebel Hunter allies gain 5% Turn Meter. Whenever 4-LOM attacks: Zuckuss gains 3% Turn Meter. Whenever 4-LOM is defeated: Zuckuss gains Offense Up and Critical Damage Up (3 turns).', ['turn_meter_gain_passive', 'buff_self', 'Foresight', 'Offense Up', 'Critical Damage Up', 'Imperial Contract'], [])
    ],
    'Rebel Hunter',
    6200,
    'Controls turn meter and inflicts Blind.',
    { speed: 122 }
  ),
  createCharacter(
    'ig_88',
    'IG-88',
    'Attacker',
    ['Rebel Hunter', 'Bounty Hunter', 'Droid'],
    'Assassin droid and bounty hunter.',
    [
      makeAbility('ig88_basic', 'Assassination Protocol', 'basic', 0, 'Deal Physical Damage. If target has Imperial Contract: Deal 20% additional damage.', ['damage', 'Imperial Contract'], ['offensive']),
      makeAbility('ig88_special_1', 'Rapid Elimination', 'special', 3, 'Deal Physical Damage. Attack again. If target has Imperial Contract: Attack a third time.', ['damage', 'bonus_attack', 'Imperial Contract'], ['offensive']),
      makeAbility('ig88_special_2', 'Termination Sequence', 'special', 4, 'Deal Massive Physical Damage. If target has Imperial Contract: Ignore 30% Defense. If target is below 50% Health: Deal additional damage.', ['damage_heavy', 'Imperial Contract'], ['offensive']),
      makeAbility('ig88_unique', 'Profit Motive', 'unique', 0, 'Whenever an enemy with Imperial Contract falls below 50% Health: IG-88 gains Offense Up (2 turns). Whenever an enemy with Imperial Contract is defeated: Recover 20% Protection. Whenever IG-88 defeats an enemy: Reduce cooldowns by 1.', ['protection_recovery_passive', 'Offense Up', 'Imperial Contract'], [])
    ],
    'Rebel Hunter',
    6500,
    'Burst damage output.',
    { speed: 130, offense: 4800 }
  ),
  createCharacter(
    'stormtrooper_commando',
    'Stormtrooper Commando',
    'Attacker / Saboteur',
    ['Rebel Hunter', 'Galactic Empire', 'Imperial Trooper'],
    'Elite specialized trooper.',
    [
      makeAbility('storm_com_basic', 'Silent Shot', 'basic', 0, 'Deal Physical Damage. If Stormtrooper Commando has Stealth: Deal 25% additional damage.', ['damage', 'Stealth'], ['offensive']),
      makeAbility('storm_com_special_1', 'Infiltration Protocol', 'special', 3, 'Gain Stealth (2 turns), Critical Damage Up (2 turns), and 10% Turn Meter.', ['Stealth', 'Critical Damage Up', 'turn_meter_gain_self'], ['buff']),
      makeAbility('storm_com_special_2', 'Black Operations', 'special', 4, 'Deal Massive Physical Damage. Ignore Taunt against enemies with Imperial Contract. If Stormtrooper Commando had Stealth: Inflict Healing Immunity (2 turns).', ['damage_heavy', 'Healing Immunity', 'Imperial Contract'], ['offensive']),
      makeAbility('storm_com_unique', 'Ghost In The Crowd', 'unique', 0, 'Whenever Imperial Contract transfers: Stormtrooper Commando gains Stealth (2 turns). Whenever Stormtrooper Commando attacks an enemy with Imperial Contract: Gain 5% Turn Meter. Whenever Stormtrooper Commando defeats an enemy: Recover 20% Protection.', ['turn_meter_gain_passive', 'protection_recovery_passive', 'Stealth', 'Imperial Contract'], [])
    ],
    'Rebel Hunter',
    5800,
    'Stealth assassin.',
    { speed: 138, offense: 4100 }
  )
];
