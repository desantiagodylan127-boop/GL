import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const JEDI_HIGH_COUNCIL_CHARACTERS: Character[] = [
  createCharacter(
    'coleman_kcaj',
    'Coleman Kcaj',
    'Support / Strategist',
    ['Jedi', 'Jedi High Council'],
    'Disciplined member of the Jedi High Council who stabilizes team condition, cleanses debuffs and speeds up turn meters.',
    [
      makeAbility('kcaj_basic', 'Measured Strike', 'basic', 0, 'Deal Special Damage. 50% chance to inflict Offense Down (2 turns).', ['damage', 'offense_down', 'Offense Down'], ['offensive']),
      makeAbility('kcaj_special_1', 'Council Guidance', 'special', 3, 'Jedi High Council allies recover 10% Health and 10% Protection, and gain Tenacity Up (2 turns).', ['heal', 'protection_recovery', 'tenacity_up', 'Tenacity Up'], ['heal']),
      makeAbility('kcaj_special_2', 'Steady Presence', 'special', 4, 'Cleanse all debuffs from target ally. Target ally gains Defense Up (2 turns).', ['cleanse', 'defense_up', 'Defense Up'], ['defensive']),
      makeAbility('kcaj_unique', 'Wise Councilor', 'unique', 0, 'Whenever Jedi allies gain buffs, Coleman Kcaj gains 5% Turn Meter. Whenever allies resist debuffs, Coleman Kcaj recovers 3% Protection.', ['turn_meter_gain', 'protection_recovery_passive'], [])
    ],
    'Jedi High Council',
    8200,
    'Support defensive tactical sustain',
    { speed: 124, hp: 48000, protection: 36000 }
  ),

  createCharacter(
    'oppo_rancisis',
    'Oppo Rancisis',
    'Tank / Strategist',
    ['Jedi', 'Jedi High Council'],
    'Ancient and wise master who controls the field through protective meditation barriers and patient discipline.',
    [
      makeAbility('oppo_basic', 'Serpent Staff', 'basic', 0, 'Deal Physical Damage. 30% chance to inflict Offense Down (2 turns).', ['damage', 'offense_down', 'Offense Down'], ['offensive']),
      makeAbility('oppo_special_1', 'Defensive Meditation', 'special', 3, 'Jedi High Council allies gain Defense Up (2 turns) and Tenacity Up (2 turns).', ['defense_up', 'tenacity_up', 'Defense Up', 'Tenacity Up'], ['defensive']),
      makeAbility('oppo_special_2', 'Ancient Barrier', 'special', 4, 'Oppo Rancisis gains Taunt (2 turns) and 30% Protection Up (3 turns).', ['taunt', 'protection_up', 'Taunt', 'Protection Up'], ['defensive']),
      makeAbility('oppo_unique', 'Ancient Discipline', 'unique', 0, 'Whenever Jedi allies resist debuffs, Oppo Rancisis gains 5% Turn Meter. Whenever Oppo Rancisis is critically hit, he gains Defense Up (1 turn).', ['turn_meter_gain', 'defense_up_passive', 'Defense Up'], [])
    ],
    'Jedi High Council',
    8300,
    'Taunting defense and static buffer',
    { speed: 112, hp: 54000, protection: 52000 }
  ),

  createCharacter(
    'adi_gallia',
    'Adi Gallia',
    'Leader / Support',
    ['Jedi', 'Jedi High Council'],
    'A respected High Council diplomat who speeds up council members and shields allies at low health.',
    [
      makeAbility('adi_basic', 'Council Saber Form', 'basic', 0, 'Deal Physical Damage and recover 5% Protection.', ['damage', 'protection_recovery'], ['offensive']),
      makeAbility('adi_special_1', 'Coordinated Defense', 'special', 3, 'Jedi High Council allies gain Defense Up (2 turns) and Critical Avoidance Up (2 turns).', ['defense_up', 'crit_avoidance_up', 'Defense Up'], ['defensive']),
      makeAbility('adi_special_2', 'Council Intervention', 'special', 4, 'All Jedi allies recover 15% Health and 15% Protection.', ['heal', 'protection_recovery'], ['heal']),
      makeAbility('adi_leader', 'Council Discipline', 'leader', 0, 'Jedi High Council allies gain +25 Speed and +20% Max Health. Whenever Jedi allies counterattack, recover 3% Protection. Whenever allies gain buffs, they gain 2% Turn Meter.', ['buff_faction'], []),
      makeAbility('adi_unique', 'Jedi Authority', 'unique', 0, 'Whenever allies fall below 50% Health, Adi Gallia gains Foresight (1 turn).', ['foresight_passive', 'Foresight'], [])
    ],
    'Jedi High Council',
    8400,
    'Faction speed and counter tactical healing',
    { speed: 135, hp: 50000, protection: 40000 }
  ),

  createCharacter(
    'luminara_unduli',
    'Luminara Unduli',
    'Support / Strategist',
    ['Jedi', 'Jedi High Council'],
    'Compassionate Jedi Master who channels incredible serenity into patient team healing.',
    [
      makeAbility('lumi_basic', 'Calm Saber', 'basic', 0, 'Deal Special Damage. Random Jedi ally gains Evasion Up (1 turn).', ['damage'], ['offensive']),
      makeAbility('lumi_special_1', 'Healing Wave', 'special', 3, 'All Jedi allies recover 20% Health.', ['heal'], ['heal']),
      makeAbility('lumi_special_2', 'Inner Serenity', 'special', 4, 'Jedi allies gain Tenacity Up (2 turns) and Defense Up (2 turns).', ['tenacity_up', 'defense_up', 'Defense Up', 'Tenacity Up'], ['defensive']),
      makeAbility('lumi_unique', 'Serene Wisdom', 'unique', 0, 'Whenever Jedi allies recover Health, Luminara Unduli gains 5% Turn Meter. Whenever allies gain buffs, recover 2% Health.', ['turn_meter_gain', 'heal_passive'], [])
    ],
    'Jedi High Council',
    8100,
    'Team-wide burst healing and defensive buffs',
    { speed: 126, hp: 46000, protection: 42000 }
  ),

  createCharacter(
    'yaddle',
    'Yaddle',
    'Support / Strategist',
    ['Jedi', 'Jedi High Council'],
    'Ancient Jedi Master of Yodas species who provides Foresight, restores shields, and reacts to evades.',
    [
      makeAbility('yaddle_basic', 'Ancient Guidance', 'basic', 0, 'Deal Special Damage. 30% chance to inflict Offense Down (2 turns).', ['damage', 'offense_down', 'Offense Down'], ['offensive']),
      makeAbility('yaddle_special_1', 'Ancient Wisdom', 'special', 3, 'Jedi allies gain Foresight (1 turn) and Tenacity Up (2 turns).', ['foresight', 'tenacity_up', 'Tenacity Up', 'Foresight'], ['defensive']),
      makeAbility('yaddle_special_2', 'Force Restoration', 'special', 4, 'Jedi allies recover 10% Health and 15% Protection.', ['heal', 'protection_recovery'], ['heal']),
      makeAbility('yaddle_unique', 'Council Foresight', 'unique', 0, 'Whenever allies evade, Yaddle gains 5% Turn Meter. Whenever Jedi allies are critically hit, a random ally gains Foresight (1 turn).', ['turn_meter_gain', 'foresight_passive_all', 'Foresight'], [])
    ],
    'Jedi High Council',
    8200,
    'Foresight distribution and evasion utility',
    { speed: 128, hp: 47000, protection: 44000 }
  )
];