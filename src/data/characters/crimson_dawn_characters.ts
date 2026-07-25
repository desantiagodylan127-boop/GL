import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const CRIMSON_DAWN_CHARACTERS: Character[] = [
  createCharacter(
    'qira_journey',
    'Qi\'ra',
    'Leader / Attacker / Saboteur / Journey Character',
    ['Crimson Dawn', 'Scoundrel', 'Journey Character'],
    'Syndicate leader utilizing Secrecy for devastating ambushes.',
    [
      makeAbility('qira_basic', 'Precision Strike', 'basic', 0, 'Attack target enemy. If Qi\'ra has Secrecy: Consume Secrecy, Deal 50% bonus damage. Gain Secrecy.', ['damage', 'Secrecy', 'consume_secrecy', 'bonus_damage'], ['offensive']),
      makeAbility('qira_special_1', 'Crimson Ambush', 'special', 3, 'Target ally gains Secrecy. Qi\'ra gains Secrecy. Both gain 10% Turn Meter.', ['Secrecy', 'turn_meter_gain'], ['buff']),
      makeAbility('qira_special_2', 'Hidden Blade', 'special', 4, 'Consume Secrecy. Attack target enemy. Ignore Protection, 25% Defense. If target is defeated: Gain Secrecy.', ['consume_secrecy', 'damage', 'ignore_protection', 'ignore_defense'], ['offensive']),
      makeAbility('qira_leader', 'We Move Unseen', 'leader', 0, 'Crimson Dawn allies gain: +25 Speed, +20% Critical Damage. Whenever an ally gains Secrecy: Recover 5% Protection. Whenever Secrecy is consumed: Gain 5% Turn Meter.', ['buff_faction', 'protection_recovery_passive', 'turn_meter_gain_passive'], []),
      makeAbility('qira_unique', 'Maul\'s Apprentice', 'unique', 0, 'Whenever Qi\'ra consumes Secrecy: Gain Offense Up (2 turns). Whenever an enemy is defeated: Gain Secrecy.', ['Offense Up', 'Secrecy'], [])
    ],
    'Crimson Dawn',
    14000,
    'Secrecy mechanics',
    { speed: 155, hp: 50000, protection: 50000, offense: 4500 }
  ),
  createCharacter(
    'dryden_vos',
    'Dryden Vos',
    'Leader / Strategist',
    ['Crimson Dawn'],
    'Manipulates deals to keep Crimson Dawn profitable.',
    [
      makeAbility('dryden_basic', 'Syndicate Authority', 'basic', 0, 'Attack target enemy. Inflict Offense Down (2 turns).', ['damage', 'Offense Down'], ['offensive']),
      makeAbility('dryden_special_1', 'A Profitable Arrangement', 'special', 3, 'Target ally gains Secrecy. Recover 15% Protection.', ['Secrecy', 'protection_recovery'], ['buff']),
      makeAbility('dryden_special_2', 'Debt Collection', 'special', 4, 'Attack target enemy. Dispel all buffs. If Dryden has Secrecy: Consume Secrecy, Inflict Ability Block (1 turn).', ['damage', 'dispel', 'consume_secrecy', 'Ability Block'], ['offensive']),
      makeAbility('dryden_leader', 'Crimson Dawn Syndicate', 'leader', 0, 'Crimson Dawn allies gain +20 Speed, +25% Potency. Whenever Secrecy is consumed: Recover 3% Health.', ['buff_faction', 'heal_aoe_passive'], []),
      makeAbility('dryden_unique', 'Everybody Pays', 'unique', 0, 'Whenever an enemy loses a buff: Gain 5% Turn Meter. Whenever Secrecy is consumed: Recover Protection.', ['turn_meter_gain_passive', 'protection_recovery_passive'], [])
    ],
    'Crimson Dawn',
    9500,
    'Secrecy generation and dispels',
    { speed: 140, hp: 55000, protection: 60000 }
  ),
  createCharacter(
    'tobias_beckett',
    'Tobias Beckett',
    'Attacker',
    ['Crimson Dawn', 'Scoundrel'],
    'Master thief striking hard and fast.',
    [
      makeAbility('beckett_basic', 'Fast Draw', 'basic', 0, 'Attack target enemy. If Beckett has Secrecy: Consume Secrecy, Attack again.', ['damage', 'consume_secrecy', 'bonus_attack'], ['offensive']),
      makeAbility('beckett_special_1', 'Professional Job', 'special', 3, 'Gain Secrecy. Attack target enemy.', ['Secrecy', 'damage'], ['offensive']),
      makeAbility('beckett_special_2', 'One Last Score', 'special', 4, 'Consume Secrecy. Attack target enemy. Ignore Protection. Deal massive Physical Damage.', ['consume_secrecy', 'damage', 'ignore_protection'], ['offensive']),
      makeAbility('beckett_unique', 'Never Get Attached', 'unique', 0, 'Whenever Beckett defeats an enemy: Gain Secrecy. Whenever Secrecy is consumed: Gain Offense Up.', ['Secrecy', 'Offense Up'], [])
    ],
    'Crimson Dawn',
    9000,
    'Damage dealer',
    { speed: 148, hp: 45000, protection: 40000, offense: 4800 }
  ),
  createCharacter(
    'sabe_dawn',
    'Sabé',
    'Support / Strategist',
    ['Crimson Dawn'],
    'Master infiltrator spreading Secrecy everywhere.',
    [
      makeAbility('sabe_basic', 'Quiet Observation', 'basic', 0, 'Attack target enemy. Gain Secrecy.', ['damage', 'Secrecy'], ['offensive']),
      makeAbility('sabe_special_1', 'False Identity', 'special', 3, 'Target ally gains Secrecy and Protection Up (20%).', ['Secrecy', 'Protection Up'], ['buff']),
      makeAbility('sabe_special_2', 'Hidden Operatives', 'special', 4, 'All Crimson Dawn allies gain Secrecy.', ['Secrecy_aoe'], ['buff']),
      makeAbility('sabe_unique', 'Infiltration Expert', 'unique', 0, 'Whenever ally gains Secrecy: Recover 5% Health. Whenever ally consumes Secrecy: Gain 5% Turn Meter.', ['heal_passive', 'turn_meter_gain_passive'], [])
    ],
    'Crimson Dawn',
    8800,
    'Mass Secrecy application',
    { speed: 155, hp: 45000, protection: 45000 }
  ),
  createCharacter(
    'toht_ra',
    'Toht Ra',
    'Tank / Attacker',
    ['Crimson Dawn'],
    'Intimidating enforcer guarding Secrecy users.',
    [
      makeAbility('toht_ra_basic', 'Brutal Enforcement', 'basic', 0, 'Attack target enemy. Inflict Defense Down (2 turns).', ['damage', 'Defense Down'], ['offensive']),
      makeAbility('toht_ra_special_1', 'Guard The Syndicate', 'special', 3, 'Gain Taunt (2 turns). If another Crimson Dawn ally has Secrecy: Gain Defense Up (2 turns).', ['Taunt', 'Defense Up'], ['defensive']),
      makeAbility('toht_ra_special_2', 'Ruthless Example', 'special', 4, 'Attack all enemies. If Toht Ra has Secrecy: Consume Secrecy, Deal bonus damage.', ['damage_aoe', 'consume_secrecy', 'bonus_damage'], ['offensive']),
      makeAbility('toht_ra_unique', 'Syndicate Enforcer', 'unique', 0, 'Whenever ally gains Secrecy: Recover 5% Protection. Whenever ally consumes Secrecy: Gain 10% Turn Meter.', ['protection_recovery_passive', 'turn_meter_gain_passive'], [])
    ],
    'Crimson Dawn',
    9200,
    'Tanking based on Secrecy',
    { speed: 125, hp: 65000, protection: 65000 }
  ),
  createCharacter(
    'crimson_spybot',
    'Crimson (Spybot)',
    'Saboteur / Strategist',
    ['Crimson Dawn', 'Droid'],
    'Coordinates infiltrations and marks enemies.',
    [
      makeAbility('spybot_basic', 'Surveillance Sweep', 'basic', 0, 'Attack target enemy. Inflict Defense Down (2 turns).', ['damage', 'Defense Down'], ['offensive']),
      makeAbility('spybot_special_1', 'Shadow Network', 'special', 3, 'Target ally gains Secrecy. Enemy target gains Speed Down (2 turns).', ['Secrecy', 'Speed Down'], ['buff', 'debuff']),
      makeAbility('spybot_special_2', 'Covert Transmission', 'special', 4, 'All enemies gain Expose. All Crimson Dawn allies gain Secrecy.', ['Exposed', 'Secrecy_aoe'], ['debuff', 'buff']),
      makeAbility('spybot_unique', 'Eyes Everywhere', 'unique', 0, 'Whenever an ally gains Secrecy: Crimson gains 5% Turn Meter. Whenever an enemy gains a debuff: Recover 3% Protection.', ['turn_meter_gain_passive', 'protection_recovery_passive'], [])
    ],
    'Crimson Dawn',
    8500,
    'Sabotage and Expose',
    { speed: 160, hp: 35000, protection: 35000 }
  )
];
