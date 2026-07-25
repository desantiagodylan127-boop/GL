import { createCharacter, makeAbility } from '../characters_base';
import { Character } from '../../types';

export const EMPIRE_INQUISITOR_CHARACTERS: Character[] = [
  // --- Inquisitorius Faction (Central theme: Purge) ---
  createCharacter(
    'fourth_sister',
    'Fourth Sister',
    'Support / Saboteur',
    ['Inquisitorius', 'Galactic Empire'],
    'Interrogator who extends debuffs and locks down actions with Daze and Ability Block.',
    [
      makeAbility('fourth_basic', 'Invasive Strike', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Buff Immunity (1 turn).', ['damage', 'buff_immunity', 'Buff Immunity'], ['offensive']),
      makeAbility('fourth_special_1', 'Psychological Fracture', 'special', 3, 'Extend all debuffs on target enemy by 1 turn. Inflict 1 stack of Purge.', ['debuff_extend', 'purge', 'Purge'], ['debuff']),
      makeAbility('fourth_special_2', 'Torturous Interrogation', 'special', 4, 'Inflict Daze and Ability Block (2 turns). Jedi enemies lose 10% Turn Meter.', ['debuff_all', 'turn_meter_reduction', 'Ability Block', 'Daze'], ['debuff']),
      makeAbility('fourth_unique', 'Lingering Fear', 'unique', 0, 'Whenever enemies resist debuffs, Fourth Sister gains 5% Turn Meter. Whenever debuffs expire on enemies, inflict 1 stack of Purge.', ['debuff_passive', 'Purge'], [])
    ],
    'Inquisitorius',
    8100,
    'Debuff manipulation and lockdown',
    { speed: 130 }
  ),

  createCharacter(
    'marrok',
    'Marrok',
    'Attacker / Saboteur',
    ['Inquisitorius', 'Galactic Empire'],
    'Silent masked hunter who uses Fear, Stealth, and extra rapid-attacks against feared prey.',
    [
      makeAbility('marrok_basic', 'Phantom Saber Rush', 'basic', 0, 'Deal Physical Damage and inflict Purge. If target already has Fear, attack again for reduced damage.', ['damage', 'purge', 'double_strike', 'Purge', 'Fear'], ['offensive']),
      makeAbility('marrok_special_1', 'Hollow Presence', 'special', 3, 'Gain Stealth and Offense Up (2 turns). Inflict Fear (1 turn) on a Purged enemy.', ['stealth', 'buff_self', 'fear', 'Purge', 'Offense Up', 'Stealth', 'Fear'], ['debuff']),
      makeAbility('marrok_special_2', 'Wraith Assault', 'special', 4, 'Deal Physical Damage to all enemies. Enemies with Fear lose 5% Turn Meter. Inflict Purge on all Jedi.', ['damage_aoe', 'purge', 'turn_meter_reduction', 'Purge', 'Fear'], ['offensive']),
      makeAbility('marrok_unique', 'Relentless Presence', 'unique', 0, 'Whenever enemies fall below 50% Health, Marrok gains 5% Turn Meter. Whenever Fear expires on enemies, Marrok gains Critical Damage Up (2 turns).', ['passive_trigger', 'Critical Damage Up', 'Fear'], [])
    ],
    'Inquisitorius',
    8400,
    'Stealthed psychological assault and fear',
    { speed: 138, offense: 3550 }
  ),

  createCharacter(
    'reva',
    'Reva (The Third Sister)',
    'Leader / Tank / Attacker',
    ['Galactic Empire', 'Inquisitorius'],
    'Relentless Inquisitor tank utilizing dark rage, burning hatred, and ruthless pursuit.',
    [
      makeAbility('reva_basic', 'Furious Saber Strike', 'basic', 0, 'Deal Physical Damage twice. Inflict 1 stack of Purge.', ['damage', 'Purge'], ['offensive']),
      makeAbility('reva_special_1', 'Vengeful Hunt', 'special', 3, 'Deal Physical Damage to all enemies. Inflict 2 stacks of Purge. Reva gains Taunt (2 turns) and Retribution (2 turns).', ['damage_aoe', 'Purge', 'Taunt', 'Retribution'], ['defensive']),
      makeAbility('reva_special_2', 'Survivor\'s Rage', 'special', 5, 'Restore Reva to 100% Health and Protection. Dispel all debuffs on Reva. Deal massive Physical Damage to target enemy based on her Max Health.', ['heal_self', 'dispel_self', 'damage_heavy'], ['defensive']),
      makeAbility('reva_leader', 'Ruthless Pursuit', 'leader', 0, 'Inquisitorius allies gain 20 Speed and 20% Defense. Whenever an ally attacks an enemy with Purge, they recover 2% Protection.', ['leader', 'protection_recovery_passive'], []),
      makeAbility('reva_unique', 'Burning Hatred', 'unique', 0, 'Reva revives the first time she is defeated with 50% Health and 50% Turn Meter. Whenever an enemy attacks Reva: Inflict 1 stack of Purge on the attacker.', ['revive', 'Purge'], [])
    ],
    'Inquisitorius',
    10000,
    'Resilient tank with dual-strikes and high survivability',
    { speed: 128, hp: 70000, protection: 50000, defense: 60 }
  ),

  createCharacter(
    'barriss_fallen',
    'Barriss (Fallen Healer)',
    'Support / Tank',
    ['Inquisitorius', 'Galactic Empire', 'Jedi Disciple'],
    'Twisted dark sister who heals the Inquisitorius team in battles of attrition.',
    [
      makeAbility('barriss_basic', 'Corrupted Force Pulse', 'basic', 0, 'Deal Special Damage. Lowest Health ally recovers 5% Protection.', ['damage', 'protection_recovery'], ['offensive', 'heal']),
      makeAbility('barriss_special_1', 'Twisted Restoration', 'special', 3, 'Heal all Inquisitorius allies for 15% Health. Purged enemies lose 5% Turn Meter.', ['heal_all', 'turn_meter_reduction', 'Purge'], ['heal']),
      makeAbility('barriss_special_2', 'Force Suppression Barrier', 'special', 4, 'Grant Defense Up and Tenacity Up (2 turns). Allies gain 15% Protection Up.', ['buff_all', 'protection_up', 'Defense Up', 'Tenacity Up', 'Protection Up'], ['defensive']),
      makeAbility('barriss_unique', 'Pain Sustains Us', 'unique', 0, 'Whenever Purge is applied, lowest Health ally recovers 3% Protection. Whenever allies fall below 50% Health, Barriss gains Taunt (1 turn).', ['heal_passive', 'taunt_passive', 'Purge', 'Taunt'], [])
    ],
    'Inquisitorius',
    8100,
    'Sustained team survival',
    { speed: 125, hp: 52000, protection: 46000 }
  ),

  createCharacter(
    'crow',
    'Crow',
    'Attacker / Strategist',
    ['Inquisitorius', 'Galactic Empire'],
    'Tactical hunter who marks primary targets and triggers assist calling.',
    [
      makeAbility('crow_basic', 'Tactical Saber Lunge', 'basic', 0, 'Deal Physical Damage. Inflict 1 stack of Purge.', ['damage', 'purge', 'Purge'], ['offensive']),
      makeAbility('crow_special_1', 'Target Isolation', 'special', 3, 'Inflict Marked and Speed Down (2 turns). Crow gains Stealth (1 turn).', ['debuff', 'stealth', 'Speed Down', 'Stealth', 'Marked'], ['debuff']),
      makeAbility('crow_special_2', 'Coordinated Elimination', 'special', 4, 'Call two random Inquisitorius allies to assist. Marked enemies lose 10% Turn Meter.', ['assist', 'turn_meter_reduction', 'Marked'], ['assist']),
      makeAbility('crow_unique', 'Hunter Cell Commander', 'unique', 0, 'Whenever enemies become Marked, Crow gains 5% Turn Meter. Whenever allies assist, Crow gains Offense Up (1 turn). Whenever Purged enemies are defeated, reduce cooldowns by 1.', ['cooldown_reduction', 'Purge', 'Offense Up', 'Marked'], [])
    ],
    'Inquisitorius',
    8300,
    'Single-target focus enabler',
    { speed: 133 }
  ),

  createCharacter(
    'grand_inquisitor',
    'Grand Inquisitor',
    'Leader / Strategist',
    ['Galactic Empire', 'Inquisitorius', 'Journey Character'],
    'The overall supreme commander of the Inquisitorius, built to completely suppress Jedi and optimize Purge dynamics.',
    [
      makeAbility('gi_basic', 'Grand Saber Assault', 'basic', 0, 'Deal Physical Damage. Inflict 2 stacks of Purge. If target already has 3 or more Purge: Remove 5% Turn Meter. If target is Jedi: Inflict 1 extra stack of Purge.', ['damage', 'Purge', 'turn_meter_reduction'], ['offensive']),
      makeAbility('gi_special_1', 'Interrogation', 'special', 3, 'Deal Special Damage. Inflict 2 stacks of Purge. Target loses 15% Turn Meter. If target has 5 stacks of Purge: Deal 50% additional damage and inflict Daze (2 turns).', ['damage', 'Purge', 'turn_meter_reduction', 'Daze'], ['offensive']),
      makeAbility('gi_special_2', 'Pain is the only Law', 'special', 5, 'Deal Physical Damage to all enemies. Consume all Purge stacks on all enemies. For each stack consumed: Deal 5% additional damage. All Inquisitorius allies gain Offense Up (2 turns) and Defense Up (2 turns).', ['damage_aoe', 'purge_consume', 'Offense Up', 'Defense Up'], ['offensive']),
      makeAbility('gi_leader', 'Master of the Inquisitorius', 'leader', 0, 'Inquisitorius allies gain 35 Speed, 30% Offense, and 30% Potency. Whenever an enemy gains a stack of Purge: Inquisitorius allies recover 2% Health. If the enemy is a Jedi: Also recover 2% Protection.', ['buff_faction', 'Purge', 'heal_all', 'protection_recovery_all'], []),
      makeAbility('gi_unique', 'Patience', 'unique', 0, 'Whenever an enemy with 5 or more stacks of Purge uses an ability: Grand Inquisitor gains 10% Turn Meter. Grand Inquisitor is immune to Fear and Daze.', ['turn_meter_gain', 'immunity_cc'], [])
    ],
    'Galactic Empire',
    9500,
    'Controls Purge mechanics and suppresses Jedi',
    { speed: 142, hp: 50000, protection: 45000 }
  )
];
