import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const GEONOSIAN_CHARACTERS: Character[] = [
  createCharacter(
    'karina_the_great',
    'Karina the Great',
    'Leader / Tank',
    ['Separatist', 'Geonosian Royal Hive'],
    'Matriarch of the Hive who spawns drones and commands endless swarms of Geonosian parasites.',
    [
      makeAbility('karina_basic', 'Royal Mandibles', 'basic', 0, 'Deal Physical Damage. Inflict Infested.', ['damage', 'Infested'], ['offensive']),
      makeAbility('karina_special_1', 'Spawn The Swarm', 'special', 3, 'Summon Geonosian Drone. If Geonosian Drone is already active: It assists.', ['summon', 'assist'], ['defensive']),
      makeAbility('karina_special_2', 'Queen Of Geonosis', 'special', 4, 'All enemies gain Infested. All Geonosian Royal Hive allies recover 20% Health.', ['Infested', 'heal_aoe'], ['debuff', 'heal']),
      makeAbility('karina_leader', 'Matriarch Of The Hive', 'leader', 0, 'Geonosian Royal Hive allies gain: 30% Max Health and 20% Offense. Whenever an enemy gains Infested: Recover 3% Health.', ['buff_faction'], []),
      makeAbility('karina_unique', 'Endless Broodmother', 'unique', 0, 'At the start of battle: Summon Geonosian Drone. Whenever a Geonosian ally attacks an Infested enemy: Gain 5% Turn Meter. Whenever Geonosian Drone is defeated: Recover 10% Health.', ['summon_passive', 'turn_meter_gain_passive', 'heal_passive'], [])
    ],
    'Geonosian Royal Hive',
    9500,
    'Swarms, Summons, Infested spreading',
    { speed: 120, hp: 60000, protection: 40000 }
  ),
  createCharacter(
    'geonosian_drone',
    'Geonosian Drone',
    'Attacker / Summon',
    ['Separatist', 'Geonosian Royal Hive', 'Summon'],
    'Endless swarm drone that assists the Queen unconditionally.',
    [
      makeAbility('geo_drone_basic', 'Swarm Strike', 'basic', 0, 'Deal Physical Damage. Inflict Infested.', ['damage', 'Infested'], ['offensive']),
      makeAbility('geo_drone_unique', 'Hive Servant', 'unique', 0, 'Assist whenever Karina the Great uses an ability. Whenever this unit defeats an enemy: Recover 100% Health. If defeated while Karina the Great is active: Revive once with 100% Health.', ['assist_passive', 'heal_passive', 'revive_passive'], [])
    ],
    'Geonosian Royal Hive',
    4000,
    'Relentless swarm attacker',
    { speed: 140, hp: 20000, protection: 10000 }
  ),
  createCharacter(
    'poggle_the_lesser',
    'Poggle the Lesser',
    'Support',
    ['Separatist', 'Geonosian Royal Hive'],
    'Archduke of Geonosis that enables production of droid and Hive weaponry.',
    [
      makeAbility('poggle_basic', 'Geonosian Blaster', 'basic', 0, 'Deal Physical Damage. Inflict Infested.', ['damage', 'Infested'], ['offensive']),
      makeAbility('poggle_special_1', 'Manufacturing Directive', 'special', 3, 'All Geonosian Royal Hive allies gain: Offense Up (2 turns). Inflict Infested on all enemies.', ['Offense Up', 'Infested'], ['buff', 'debuff']),
      makeAbility('poggle_special_2', 'Droid Foundries', 'special', 4, 'All allies recover 15% Health. All Infested enemies lose 15% Turn Meter.', ['heal_aoe', 'turn_meter_reduction'], ['heal', 'debuff']),
      makeAbility('poggle_unique', 'Archduke Of Geonosis', 'unique', 0, 'Whenever an enemy gains Infested: Poggle gains 5% Turn Meter. Whenever a Geonosian ally attacks: 25% chance to inflict Infested.', ['turn_meter_gain_passive', 'inflict_passive'], [])
    ],
    'Geonosian Royal Hive',
    8200,
    'Offense buffers, turn meter manipulation',
    { speed: 135, hp: 45000, protection: 35000 }
  ),
  createCharacter(
    'sun_fac',
    'Sun Fac',
    'Tank',
    ['Separatist', 'Geonosian Royal Hive'],
    'Stalwart Hive guardian that punishes Infested attackers.',
    [
      makeAbility('sun_fac_basic', 'Pincer Strike', 'basic', 0, 'Deal Physical Damage. Inflict Infested.', ['damage', 'Infested'], ['offensive']),
      makeAbility('sun_fac_special_1', 'Hive Guardian', 'special', 3, 'Gain: Taunt (2 turns), Defense Up (2 turns), Recover 20% Health.', ['Taunt', 'Defense Up', 'heal'], ['defensive']),
      makeAbility('sun_fac_special_2', 'Crushing Mandibles', 'special', 4, 'Deal Physical Damage. If target is Infested: Stun (1 turn).', ['damage', 'Stun'], ['offensive']),
      makeAbility('sun_fac_unique', 'Royal Protector', 'unique', 0, 'Whenever an enemy with Infested attacks: Sun Fac gains 5% Turn Meter. Whenever Sun Fac attacks an Infested enemy: Recover 10% Health.', ['turn_meter_gain_passive', 'heal_passive'], [])
    ],
    'Geonosian Royal Hive',
    8400,
    'Heavy counter-attacks and stuns',
    { speed: 110, hp: 55000, protection: 50000 }
  ),
  createCharacter(
    'gizor_dellso',
    'Gizor Dellso',
    'Attacker',
    ['Separatist', 'Geonosian Royal Hive'],
    'Separatist engineer who bombards enemies through coordinated strikes.',
    [
      makeAbility('gizor_basic', 'Experimental Blaster', 'basic', 0, 'Deal Physical Damage. Inflict Infested.', ['damage', 'Infested'], ['offensive']),
      makeAbility('gizor_special_1', 'Hive Weaponry', 'special', 3, 'Deal Physical Damage. Deal 25% additional damage to Infested enemies.', ['damage', 'bonus_damage'], ['offensive']),
      makeAbility('gizor_special_2', 'Tactical Bombardment', 'special', 4, 'Deal Physical Damage to all enemies. Infested enemies take additional damage.', ['damage_aoe', 'bonus_damage'], ['offensive']),
      makeAbility('gizor_unique', 'Separatist Engineer', 'unique', 0, 'Whenever an enemy gains Infested: Gizor gains 5% Offense (stacking). Maximum 50%.', ['offense_passive'], [])
    ],
    'Geonosian Royal Hive',
    8100,
    'Artillery, explosive AoE damage',
    { speed: 125, hp: 42000, protection: 28000 }
  ),
  createCharacter(
    'geonosian_brood_alpha',
    'Geonosian Brood Alpha',
    'Leader / Support',
    ['Separatist', 'Geonosian Royal Hive'],
    'Commands the Swarm into brutal concentrated onslaughts.',
    [
      makeAbility('geo_alpha_basic', 'Brood Claws', 'basic', 0, 'Deal Physical Damage. Inflict Infested.', ['damage', 'Infested'], ['offensive']),
      makeAbility('geo_alpha_special_1', 'Swarm Assault', 'special', 3, 'Call all Geonosian Royal Hive allies to assist.', ['assist_aoe'], ['offensive']),
      makeAbility('geo_alpha_special_2', 'Spread The Hive', 'special', 4, 'All enemies gain Infested. All Geonosian Royal Hive allies gain Speed Up (2 turns).', ['Infested', 'Speed Up'], ['debuff', 'buff']),
      makeAbility('geo_alpha_leader', 'Hive Coordination', 'leader', 0, 'Geonosian Royal Hive allies gain: 25 Speed, 20% Offense. Whenever an enemy gains Infested: Geonosian allies recover 3% Health.', ['buff_faction'], []),
      makeAbility('geo_alpha_unique', 'Swarm Commander', 'unique', 0, 'Whenever a Geonosian ally attacks an Infested enemy: Gain 2% Turn Meter. Whenever an enemy is defeated: All Geonosian Royal Hive allies gain Offense Up (2 turns).', ['turn_meter_gain_passive', 'buff_aoe_passive'], [])
    ],
    'Geonosian Royal Hive',
    9200,
    'Mass assists and persistent swarm buffing',
    { speed: 138, hp: 50000, protection: 40000 }
  )
];
