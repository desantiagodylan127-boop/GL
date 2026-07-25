import { createCharacter, makeAbility } from '../characters_base';
import { Character } from '../../types';

export const RAID_EXCLUSIVE_CHARACTERS: Character[] = [
  // 1. IG-90 (Monday / Day 1 Raid Exclusive)
  createCharacter(
    'ig90',
    'IG-90',
    'Attacker / Saboteur',
    ['Rogue Archaeologist', 'Droid'],
    'A relentless security droid built to protect priceless artifacts at all costs. IG-90 grows stronger as Doctor Aphra assembles her collection, eventually becoming an unstoppable guardian.',
    [
      makeAbility('ig90_basic', 'Security Sweep', 'basic', 0, 'Deal Physical damage to target enemy and inflict Defense Down (2 turns). If IG-90 has Museum Security, attack again dealing 50% reduced damage. If the target already has Defense Down or Ability Block, inflict Exposed (2 turns).', ['damage', 'Defense Down', 'Exposed'], ['offensive']),
      makeAbility('ig90_special_1', 'Lockdown Protocol', 'special', 3, 'Deal Physical damage to all enemies and inflict Speed Down (2 turns). If two or more allied Artifacts are active, inflict Buff Immunity (2 turns). If all four Artifacts are active, inflict Stagger (2 turns). Enemies defeated by this ability cannot be revived.', ['damage', 'Speed Down', 'Buff Immunity', 'Stagger'], ['offensive']),
      makeAbility('ig90_special_2', 'Preservation Directive', 'special', 4, 'Target Rogue Archaeologist or Droid ally gains Protection Up (40%) and Tenacity Up for 2 turns, and Foresight for 1 turn. If that ally possesses an Artifact, reduce all of their cooldowns by 1. If Aphra is an ally, she gains 10% Turn Meter.', ['buff_ally', 'Protection Up', 'Tenacity Up', 'Foresight', 'cooldown_reduction'], ['defensive', 'buff']),
      makeAbility('ig90_unique_1', 'Museum Security', 'unique', 0, 'While 1 allied Artifact is active, IG-90 gains +20% Offense. While 2 are active, ignore 25% Defense. While 3 are active, whenever another Rogue Archaeologist uses a Special ability, IG-90 assists (once per turn). When 4 are active, gain Museum Guardian (cannot be copied/dispelled/prevented: +75% Offense, +40 Speed, ignore 40% Defense, assist whenever a Rogue Archaeologist attacks, recover 15% Health and Protection when Aphra assigns/activates Artifacts, and Taunt + Bonus Turn when an Artifact holder falls below 50% Health).', ['passive_boost', 'assist', 'taunt', 'bonus_turn'], []),
      makeAbility('ig90_unique_2', 'Last Line Of Defense', 'unique', 0, 'The first time each Rogue Archaeologist ally would be defeated while they possess an Artifact, prevent that defeat. They recover 30% Health and Protection, and IG-90 loses 20% Max Health (cannot be prevented). Triggerable once per ally.', ['save_ally', 'healing'], [])
    ],
    'Rogue Archaeologist',
    8200,
    'Artifact guardian and high-firepower defender',
    { speed: 135, offense: 3400, hp: 46000, protection: 32000 },
    'conquest', // Uses conquest/event tier internally for shops, marked as raid exclusive in display
    'dark',
    'civil_war'
  ),

  // 2. Rotta the Hutt (Tuesday / Day 2 Raid Exclusive)
  createCharacter(
    'rotta_hutt',
    'Rotta the Hutt',
    'Support',
    ['Hutt Cartel'],
    "A unique non-combat support unit. Rotta never participates directly in battle, instead inspiring Jabba's empire to fight harder to protect the future of the Cartel.",
    [
      makeAbility('rotta_basic', 'Cute Hutt Coo', 'basic', 0, 'Inspire allies. Target Hutt Cartel ally recovers 5% Protection and gains 5% Turn Meter. Rotta does not deal direct damage.', ['protection_recovery', 'turn_meter_gain'], ['defensive']),
      makeAbility('rotta_special_1', "Father's Favorite", 'special', 2, 'Target Hutt Cartel ally immediately progresses their personal Scum Condition by 2. If that ally already has Scum, recover 25% Health and Protection and reduce their cooldowns by 1.', ['cooldown_reduction', 'healing'], ['defensive']),
      makeAbility('rotta_special_2', 'Protect The Heir', 'special', 4, 'Dispel all debuffs from Hutt Cartel allies and grant them Defense Up and Tenacity Up (2 turns). If an ally already has Scum, they gain Retribution (2 turns). Gamorrean Guard immediately Taunts for 2 turns.', ['dispel', 'Defense Up', 'Tenacity Up', 'Retribution', 'taunt'], ['defensive', 'buff']),
      makeAbility('rotta_special_3', 'Tiny Crime Lord', 'special', 5, 'Select an allied Hutt Cartel character. Until the start of Rotta\'s next turn, whenever that ally attacks, they deal 20% additional damage, progress their Scum condition by 1, and recover 5% Protection if they already have Scum.', ['buff_ally', 'damage_boost'], ['defensive']),
      makeAbility('rotta_unique_1', 'Son Of Jabba', 'unique', 0, 'Rotta cannot attack, assist, counterattack, or gain Turn Meter. He cannot be targeted while another allied Hutt Cartel character is active. If Rotta is the last remaining ally, he retreats and the battle ends as defeat. Rotta earns Scum (Future of the Cartel) after 4 different allies earn Scum. Scum: When allies earn Scum, they gain a Bonus Turn; Jabba Specials reduce all allied Hutt Cartel cooldowns by 1; Boba Fett (Daimyo) defeats progress allied Scum by 1; Bib Fortuna Specials recover 10% Health and Protection.', ['passive_boost'], []),
      makeAbility('rotta_unique_2', 'Protected At All Costs', 'unique', 0, 'At battle start, the first allied Hutt Cartel character to use a Special immediately progresses their Scum condition by 1. Whenever an ally earns Scum, all allies recover 5% Health and Protection. If Jabba is an ally, he gains 5% Ultimate Charge when allies earn Scum. If Jabba already has Scum, allies with Scum gain 15 Speed and 15% Defense. The first time each Hutt Cartel ally would be defeated, they instead survive with 1% Health, dispel debuffs, and gain Protection Up (50%) for 1 turn.', ['save_ally', 'passive_boost', 'healing'], [])
    ],
    'Hutt Cartel',
    8000,
    'Non-combat team catalyst and emergency protector',
    { speed: 120, hp: 50000, protection: 50000 },
    'conquest',
    'dark',
    'clone_wars'
  ),

  // 3. Shaak Ti (Wednesday / Day 3 Raid Exclusive)
  createCharacter(
    'shaak_ti',
    'Shaak Ti',
    'Leader / Support',
    ['Galactic Republic', 'Jedi', 'Clone Trooper'],
    'An elite battlefield commander who unites every Clone battalion under one leader, helping them coordinate their mechanics and survive lethal encounters.',
    [
      makeAbility('shaak_basic', 'Calm Guidance', 'basic', 0, 'Deal Special damage. Target Clone ally recovers 10% Health and Protection. If that ally has a faction mechanic active (Momentum, Combined Arms, Marked, etc.), call them to Assist dealing 50% reduced damage.', ['damage', 'healing', 'assist'], ['offensive']),
      makeAbility('shaak_special_1', 'Grand Army Coordination', 'special', 3, 'Dispel all debuffs from Clone Trooper allies. All Clone allies gain Defense Up and Tenacity Up (2 turns) and progress their own faction mechanic by 1. If three or more Clone battalions are present, reduce all Clone cooldowns by 1.', ['dispel', 'Defense Up', 'Tenacity Up', 'cooldown_reduction'], ['defensive', 'buff']),
      makeAbility('shaak_special_2', 'Jedi General', 'special', 4, 'Select Clone ally to immediately take a Bonus Turn. Whenever they attack this turn, recover 5% Health and Protection. If they already possess their completed faction mechanic, they attack twice.', ['bonus_turn', 'healing', 'double_strike'], ['defensive', 'buff']),
      makeAbility('shaak_leader', 'Voice of the Grand Army', 'leader', 0, 'Clone Troopers gain 25 Speed, 20% Max Health, and 20% Max Protection. Whenever a Clone completes their personal faction mechanic, all Clone allies recover 10% Health and Protection. The first time each Clone completes their mechanic, all Galactic Republic allies gain 10% Turn Meter.', ['buff_faction', 'healing', 'turn_meter_gain'], []),
      makeAbility('shaak_unique_1', 'Battle Meditation', 'unique', 0, 'At the start of battle, every Clone immediately progresses their faction mechanic by 1. Whenever a Clone gains a Bonus Turn, they gain Offense Up (2 turns). Whenever a Clone defeats an enemy, all Clone allies recover Protection (Supports recover Health, Tanks Taunt for 1 turn).', ['passive_boost', 'Offense Up', 'taunt'], []),
      makeAbility('shaak_unique_2', 'Master of Kamino', 'unique', 0, 'Whenever a Clone ally would be defeated for the first time, prevent that defeat. Recover 50% Health, dispel all debuffs, and progress that Clone\'s faction mechanic by 2. If General Skywalker is present, he gains 10% Turn Meter whenever a Clone completes their faction mechanic.', ['save_ally', 'turn_meter_gain'], [])
    ],
    'Clone Trooper',
    8500,
    'Unified battalion leader and strategic healing general',
    { speed: 140, hp: 44000, protection: 36000 },
    'conquest',
    'light',
    'clone_wars'
  ),

  // 4. Commander Bly (Thursday / Day 4 Raid Exclusive)
  createCharacter(
    'commander_bly',
    'Commander Bly',
    'Attacker',
    ['Clone Trooper', 'Galactic Republic'],
    'An aggressive frontline commander who excels at protecting Jedi during battle, dramatically enhancing Galactic Republic Jedi (especially Aayla Secura) with assist chains.',
    [
      makeAbility('bly_basic', 'Covering Fire', 'basic', 0, 'Deal Physical damage and inflict Defense Down (2 turns). If the target is already debuffed, attack again dealing 50% reduced damage.', ['damage', 'Defense Down'], ['offensive']),
      makeAbility('bly_special_1', 'Forward Advance', 'special', 3, 'Call target Galactic Republic ally to Assist. If that ally is a Jedi, they gain Critical Damage Up (2 turns). If they are Aayla Secura, she immediately gains a Bonus Turn.', ['assist', 'Critical Damage Up', 'bonus_turn'], ['offensive']),
      makeAbility('bly_special_2', 'Execute the Maneuver', 'special', 4, 'Deal Physical damage to all enemies and inflict Exposed (2 turns). Galactic Republic allies gain 15% Turn Meter. If Aayla is present, she attacks the primary target immediately after Bly.', ['damage', 'Exposed', 'turn_meter_gain', 'assist'], ['offensive']),
      makeAbility('bly_unique_1', "General's Escort", 'unique', 0, 'Whenever a Galactic Republic Jedi uses a Special ability, Bly gains Guarded Position (Max 3). Each stack grants +10 Speed and +10% Offense. At 3 stacks, consume them to gain Veteran Commander (cannot be dispelled: assist when Jedi attack, random Jedi recovers 10% Protection when Bly attacks, ignore Taunt and 25% Defense).', ['passive_boost', 'assist', 'ignore_taunt'], []),
      makeAbility('bly_unique_2', 'The 327th', 'unique', 0, 'At the start of battle, if Aayla Secura is an ally, she gains Foresight. Whenever Aayla critically hits, Bly gains 20% Turn Meter. Whenever Bly critically hits, Aayla recovers 5% Health and Protection. The first time Aayla would be defeated, prevent that defeat, she recovers 40% Health, and Bly Taunts for 1 turn (otherwise applies to Galactic Republic Jedi Leader).', ['save_ally', 'turn_meter_gain', 'taunt'], [])
    ],
    'Clone Trooper',
    8300,
    'Jedi bodyguard and heavy-assisting commander',
    { speed: 136, offense: 3300, hp: 43000, protection: 34000 },
    'conquest',
    'light',
    'clone_wars'
  ),

  // 5. AT-AT Driver (Friday / Day 5 Raid Exclusive)
  createCharacter(
    'atat_driver',
    'AT-AT Driver',
    'Leader / Tank',
    ['Empire', 'Imperial Trooper'],
    'Transforms Imperial Troopers into an advancing military column, slowly becoming impossible to stop through coordinated Siege Formations.',
    [
      makeAbility('atat_basic', 'Suppressive Fire', 'basic', 0, 'Deal Physical damage and inflict Offense Down (2 turns). If target already has a debuff, inflict Speed Down (2 turns).', ['damage', 'Offense Down', 'Speed Down'], ['offensive']),
      makeAbility('atat_special_1', 'Forward Barrage', 'special', 3, 'Deal Physical damage to all enemies and inflict Daze (2 turns). Imperial Trooper allies recover 10% Protection. If 3 or more Imperial Troopers are active, all Imperial Troopers gain Defense Up (2 turns).', ['damage', 'Daze', 'Protection Up', 'Defense Up'], ['offensive']),
      makeAbility('atat_special_2', 'Walker Advance', 'special', 4, 'Gain Taunt (2 turns) and Defense Up (2 turns). Imperial Trooper allies gain 20% Turn Meter, and enemies with Speed Down lose an additional 10% Turn Meter.', ['taunt', 'Defense Up', 'turn_meter_gain', 'turn_meter_reduction'], ['defensive', 'buff']),
      makeAbility('atat_unique_1', 'Armored Assault', 'unique', 0, 'Whenever an Imperial Trooper uses a Special ability, gain 1 stack of Advance (max 5). Each stack grants +5 Speed and +5% Defense. At 5 stacks, Advance converts to Siege Formation (cannot be copied/dispelled: Imperial Troopers ignore Taunt, gain 30% Defense Penetration, and recover 5% Protection on hits against debuffed enemies).', ['passive_boost', 'ignore_taunt', 'protection_recovery'], []),
      makeAbility('atat_unique_2', 'Blizzard Spearhead', 'unique', 0, 'Whenever another Imperial Trooper gains Turn Meter, AT-AT Driver gains half that amount. The first time each Imperial Trooper would be defeated, prevent that defeat, recover 30% Health, and gain Defense Up.', ['turn_meter_gain', 'save_ally', 'Defense Up'], [])
    ],
    'Imperial Trooper',
    8200,
    'Armored advance tank and squad protector',
    { speed: 125, hp: 49000, protection: 41000 },
    'conquest',
    'dark',
    'civil_war'
  ),

  // 6. Eeth Koth (Saturday / Day 6 Raid Exclusive)
  createCharacter(
    'eeth_koth',
    'Eeth Koth',
    'Leader / Support',
    ['Galactic Republic', 'Jedi', 'Jedi High Council'],
    'The strategist of the High Council. Eeth Koth dramatically expands the value of Council Guidance, rewarding patience and coordinated Jedi tactics.',
    [
      makeAbility('koth_basic', 'Council Discipline', 'basic', 0, 'Deal Special damage and inflict Offense Down (2 turns). If Eeth has Council Guidance, dispel one buff from the target.', ['damage', 'Offense Down', 'dispel'], ['offensive']),
      makeAbility('koth_special_1', 'Wisdom Of The Council', 'special', 3, 'Target Jedi High Council ally gains Protection Up (40%), Tenacity Up, and Council Guidance. If they already have Council Guidance, reduce their cooldowns by 1.', ['Protection Up', 'Tenacity Up', 'cooldown_reduction'], ['defensive', 'buff']),
      makeAbility('koth_special_2', 'Stand Together', 'special', 4, 'All Jedi High Council allies recover 25% Health and 25% Protection, and dispel all debuffs from themselves. Every ally with Council Guidance gains a Bonus Turn.', ['healing', 'dispel', 'bonus_turn'], ['defensive', 'buff']),
      makeAbility('koth_unique_1', 'Voice Of Coruscant', 'unique', 0, 'Whenever a Jedi High Council ally gains Council Guidance, Eeth gains Insight (max 4). Each stack grants 10 Speed and 10% Potency. At 4 stacks, consume Insight to gain Master of the Council (cannot be dispelled: assist on Specials, recover 5% Health/Protection for all allies when Council Guidance is consumed).', ['passive_boost', 'assist', 'healing'], []),
      makeAbility('koth_unique_2', 'United We Stand', 'unique', 0, 'At battle start, the Leader gains Council Guidance. The first time each Jedi High Council ally gains Council Guidance, reduce all cooldowns by 1. Whenever Yoda is present, he gains 5% Turn Meter whenever Council Guidance is granted.', ['cooldown_reduction', 'turn_meter_gain'], [])
    ],
    'Jedi High Council',
    8400,
    'High council tactician and coordinate strategist',
    { speed: 132, hp: 45000, protection: 37000 },
    'conquest',
    'light',
    'clone_wars'
  ),

  // 7. Darth Maul (Theed) (Sunday / Day 7 Raid Exclusive)
  createCharacter(
    'darth_maul_theed',
    'Darth Maul (Theed)',
    'Attacker',
    ['Sith', 'Separatist'],
    'A relentless duelist who grows more dangerous the longer a fight continues. Rather than leading armies, this Maul dominates individual opponents with speed, aggression and constant pressure.',
    [
      makeAbility('maul_theed_basic', 'Juyo Assault', 'basic', 0, 'Deal Physical damage. Attack again if the target is debuffed. If Maul has Duelist, ignore Protection.', ['damage', 'double_strike'], ['offensive']),
      makeAbility('maul_theed_special_1', 'Double-Bladed Onslaught', 'special', 3, 'Deal Physical damage 3 times and inflict Defense Down and Healing Immunity. If all attacks critically hit, take a Bonus Turn.', ['damage', 'Defense Down', 'Healing Immunity', 'bonus_turn'], ['offensive']),
      makeAbility('maul_theed_special_2', 'There Is No Escape', 'special', 4, 'Deal massive Physical damage, inflict Stagger, and prevent target from gaining Turn Meter for 1 turn. If target is a Jedi, deal bonus True Damage.', ['damage', 'Stagger', 'turn_meter_reduction'], ['offensive']),
      makeAbility('maul_theed_unique_1', 'Apprentice Of Sidious', 'unique', 0, 'Whenever Maul attacks the same enemy twice consecutively, gain 1 stack of Duelist (max 5). Each stack grants 10 Speed and 10% Offense. At 5 stacks, gain Master Duelist (+75% Offense, +40 Speed, ignore Taunt, ignore 50% Defense). Whenever Maul defeats an enemy, reset Double-Bladed Onslaught cooldown. Whenever Maul critically hits, recover 10% Protection.', ['passive_boost', 'ignore_taunt', 'protection_recovery'], []),
      makeAbility('maul_theed_unique_2', 'Duel Of The Fates', 'unique', 0, 'At the start of battle, select the enemy Leader to become Marked until defeated. Maul deals 30% additional damage to Marked enemies. If the Marked enemy is defeated, Maul gains a Bonus Turn, 100% Turn Meter, and Offense Up (2 turns). If Darth Sidious is an ally, Maul immediately gains 3 Duelist stacks at battle start.', ['Marked', 'bonus_turn', 'turn_meter_gain', 'Offense Up'], [])
    ],
    'Sith',
    8500,
    'Unstoppable high-velocity duelist and Jedi hunter',
    { speed: 142, offense: 3600, hp: 42000, protection: 31000 },
    'conquest',
    'dark',
    'clone_wars'
  )
];
