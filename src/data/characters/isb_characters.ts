import { createCharacter, makeAbility } from '../characters_base';
import { Character } from '../../types';

export const ISB_CHARACTERS: Character[] = [
  createCharacter(
    'partagaz',
    'Major Partagaz',
    'Leader / Strategist',
    ['Galactic Empire', 'ISB'],
    'ISB commander who builds dossiers on targets, lock down enemy turn generation, and coordinates Imperial surveillance.',
    [
      makeAbility('partagaz_basic', 'Operational Assessment', 'basic', 0, 'Deal Special Damage. Inflict 1 stack of Dossier.', ['damage', 'Dossier'], ['offensive']),
      makeAbility('partagaz_special_1', 'Investigative Sweep', 'special', 3, 'Deal Special Damage to all enemies. Inflict 1 stack of Dossier on all enemies. Enemies with Dossier lose 15% Turn Meter.', ['damage_aoe', 'Dossier', 'turn_meter_reduction_aoe'], ['offensive']),
      makeAbility('partagaz_special_2', 'Identify The Threat', 'special', 4, 'Target enemy gains 2 stacks of Dossier. If target already had Dossier, inflict Ability Block (2 turns).', ['Dossier', 'Ability Block'], ['debuff']),
      makeAbility('partagaz_leader', 'Imperial Oversight', 'leader', 0, 'ISB allies gain 35 Speed and 25% Potency. Whenever an enemy gains a stack of Dossier, ISB allies recover 3% Protection.', ['buff_faction', 'Dossier', 'protection_recovery_passive'], []),
      makeAbility('partagaz_unique', 'Nothing Escapes Notice', 'unique', 0, 'Whenever an enemy gains Stealth, Major Partagaz gains 10% Turn Meter. Whenever Major Partagaz inflicts a debuff, all ISB allies gain 2% Turn Meter.', ['turn_meter_gain', 'Stealth'], [])
    ],
    'Galactic Empire',
    9000,
    'Controls the battlefield through intelligence gathering',
    { speed: 140, hp: 45000, protection: 50000, defense: 50 }
  ),

  createCharacter(
    'death_trooper',
    'Death Trooper',
    'Attacker',
    ['Galactic Empire', 'Imperial Trooper', 'ISB'],
    'Elite imperial enforcer utilizing crippling precision strikes and suppressive advance.',
    [
      makeAbility('deathtrooper_basic', 'E-11D Precision Burst', 'basic', 0, 'Deal Physical Damage. 50% chance to attack again. If target has Dossier, both hits are critical.', ['damage', 'Dossier'], ['offensive']),
      makeAbility('deathtrooper_special_1', 'Termination Order', 'special', 3, 'Deal heavy Physical Damage to target enemy. If target has Dossier, remove all buffs and inflict Deathmark (2 turns).', ['damage_heavy', 'Deathmark', 'dispel_enemy', 'Dossier'], ['offensive']),
      makeAbility('deathtrooper_special_2', 'Suppressive Advance', 'special', 4, 'Deal Physical Damage to all enemies and remove 15% Turn Meter from targets suffering from Dossier.', ['damage_aoe', 'turn_meter_reduction_aoe', 'Dossier'], ['offensive']),
      makeAbility('deathtrooper_unique_1', 'Elite Enforcer', 'unique', 0, 'Death Trooper gains 20% Offense for each active ISB ally.', ['Offense Up'], []),
      makeAbility('deathtrooper_unique_2', 'Final Authorization', 'unique', 0, 'Whenever Director Krennic is critically hit, Death Trooper gains Taunt (1 turn) and Retribution (1 turn).', ['Taunt', 'Retribution'], [])
    ],
    'Galactic Empire',
    8500,
    'Elite assassin and guard',
    { speed: 135, offense: 3500 }
  ),

  createCharacter(
    'director_krennic',
    'ISB Executor Krennic',
    'Leader / Strategist',
    ['Galactic Empire', 'ISB', 'Journey Character'],
    'Ruthless director who commands absolute executive authority, summoning Death Troopers and shielding assets.',
    [
      makeAbility('krennic_basic', 'Executive Authority', 'basic', 0, 'Deal Physical Damage. Inflict 1 stack of Dossier. If target already has Dossier: Remove 5% Turn Meter.', ['damage', 'Dossier', 'turn_meter_reduction'], ['offensive']),
      makeAbility('krennic_special_1', 'Asset Deployment', 'special', 3, 'Summon Death Trooper Reinforcement. If Death Trooper Reinforcement is already active: It assists.', ['summon', 'assist'], ['defensive']),
      makeAbility('krennic_special_2', 'By Order Of The ISB', 'special', 4, 'Inflict 2 stacks of Dossier on all enemies. Enemies with Dossier lose 10% Turn Meter. If an enemy has 5 Dossier: Inflict Ability Block (1 turn).', ['Dossier', 'turn_meter_reduction_aoe', 'Ability Block'], ['debuff']),
      makeAbility('krennic_leader', 'Total Surveillance', 'leader', 0, 'ISB allies gain 30 Speed and 25% Potency. Whenever Dossier is applied: ISB allies recover 3% Protection. Whenever Dossier is consumed: ISB allies gain 5% Turn Meter. Enemies with Dossier deal 20% less damage. At the start of battle: The enemy Leader gains 2 stacks of Dossier.', ['Speed Up', 'Potency Up', 'protection_recovery_faction', 'turn_meter_gain_faction', 'Dossier'], []),
      makeAbility('krennic_unique_1', 'Director Of Internal Security', 'unique', 0, 'At the start of battle: Summon Death Trooper Reinforcement. Whenever Dossier reaches 5 stacks: Reduce all ISB cooldowns by 1. Whenever an enemy with Dossier is defeated: All ISB allies gain Offense Up (2 turns). Whenever Death Trooper Reinforcement is defeated: Resummon it once.', ['summon', 'cooldown_reduction', 'Offense Up'], []),
      makeAbility('krennic_unique_2', 'Fear Through Information', 'unique', 0, 'Whenever Dossier is consumed: Krennic gains 5% Turn Meter. Whenever an enemy gains 5 Dossier: Inflict Fear (1 turn). Enemies with Dossier cannot gain Stealth.', ['turn_meter_gain', 'Fear', 'Stealth_disability'], [])
    ],
    'Galactic Empire',
    10000,
    'Deploys elite guards and shields assets',
    { speed: 130, hp: 55000, protection: 65000 }
  ),

  createCharacter(
    'death_trooper_reinforcement',
    'Death Trooper Reinforcement',
    'Attacker',
    ['Galactic Empire', 'ISB', 'Summon'],
    'Summoned elite trooper who assists Director Krennic in battle and sacrifices itself if needed.',
    [
      makeAbility('dtr_basic', 'E-11D Precision Burst', 'basic', 0, 'Deal Physical Damage. If target has Dossier: Deal 20% additional damage.', ['damage', 'Dossier'], ['offensive']),
      makeAbility('dtr_special_1', 'Termination Order', 'special', 3, 'Deal Massive Physical Damage. Consume up to 3 stacks of Dossier from target enemy. Deal 20% additional damage for each stack consumed.', ['damage_heavy', 'Dossier_consume'], ['offensive']),
      makeAbility('dtr_special_2', 'Suppressive Advance', 'special', 4, 'Deal Physical Damage to all enemies. Inflict Daze (2 turns). Enemies with Dossier lose 5% Turn Meter.', ['damage_aoe', 'Daze', 'turn_meter_reduction_aoe', 'Dossier'], ['offensive']),
      makeAbility('dtr_unique', 'Expendable Asset', 'unique', 0, 'Gain 25% Offense. Whenever Dossier is consumed: Gain Offense Up (2 turns). Whenever Krennic uses an ability: Assist.', ['Offense Up', 'assist_passive'], [])
    ],
    'Galactic Empire',
    8000,
    'Summoned enforcer',
    { speed: 130, offense: 3200 }
  ),

  createCharacter(
    'probe_droid',
    'Probe Droid',
    'Support / Saboteur',
    ['Galactic Empire', 'ISB', 'Droid'],
    'Reconnaissance droid that performs sweeps and transmits intercept signals.',
    [
      makeAbility('probe_basic', 'Recon Scan', 'basic', 0, 'Deal Physical Damage. Inflict 1 stack of Dossier.', ['damage', 'Dossier'], ['offensive']),
      makeAbility('probe_special_1', 'Surveillance Sweep', 'special', 3, 'Inflict Target Lock (2 turns) and Dossier (2 turns) on target enemy. Dispel Stealth from all enemies.', ['Target Lock', 'Dossier', 'dispel_enemies_stealth'], ['debuff']),
      makeAbility('probe_special_2', 'Signal Intercept', 'special', 4, 'Deal Special Damage to all enemies. Enemies with Dossier lose 15% Turn Meter and gain Buff Immunity (1 turn).', ['damage_aoe', 'turn_meter_reduction_aoe', 'Buff Immunity', 'Dossier'], ['offensive']),
      makeAbility('probe_unique_1', 'Constant Observation', 'unique', 0, 'Whenever an enemy gains Stealth, Probe Droid gains 15% Turn Meter.', ['turn_meter_gain', 'Stealth'], []),
      makeAbility('probe_unique_2', 'Imperial Surveillance Network', 'unique', 0, 'ISB allies gain 15% Accuracy. Enemies with Dossier have -15% Evasion.', ['Dossier'], [])
    ],
    'Galactic Empire',
    6000,
    'Scout and signal disruptor',
    { speed: 150, hp: 30000, protection: 20000 }
  ),

  createCharacter(
    'colonel_yularen',
    'Colonel Wullf Yularen',
    'Strategist',
    ['Galactic Empire', 'ISB'],
    'Veteran commander who issues directives and coordinates investigations.',
    [
      makeAbility('yularen_basic', 'Command Directive', 'basic', 0, 'Deal Physical Damage. 50% chance to grant Speed Up (1 turn) to a random ISB ally.', ['damage', 'Speed Up'], ['offensive']),
      makeAbility('yularen_special_1', 'Coordinated Investigation', 'special', 3, 'All ISB allies recover 15% Protection. Inflict 1 stack of Dossier on target enemy.', ['protection_recovery', 'Dossier'], ['heal']),
      makeAbility('yularen_special_2', 'Operational Priority', 'special', 4, 'Reduce the cooldowns of target ISB ally by 1 and grant them 20% Turn Meter.', ['cooldown_reduction', 'turn_meter_gain'], ['defensive']),
      makeAbility('yularen_unique_1', 'Republic Intelligence Veteran', 'unique', 0, 'ISB allies have +25% Tenacity.', ['tenacity_passive'], []),
      makeAbility('yularen_unique_2', 'Master Coordinator', 'unique', 0, 'Whenever an ISB ally resists a debuff, they gain 10% Turn Meter.', ['turn_meter_gain'], [])
    ],
    'Galactic Empire',
    7500,
    'Tactical command and coordination support',
    { speed: 135 }
  ),

  createCharacter(
    'kx_security_droid',
    'KX Security Droid',
    'Tank',
    ['Galactic Empire', 'ISB', 'Droid'],
    'Imposing security droid that enforces compliance and intercepts attacks.',
    [
      makeAbility('kx_basic', 'Security Enforcement', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Offense Down (1 turn). If target has Dossier, this chance is 100%.', ['damage', 'Offense Down', 'Dossier'], ['offensive']),
      makeAbility('kx_special_1', 'Containment Protocol', 'special', 3, 'Gain Taunt (2 turns) and Defense Up (2 turns). Other ISB allies recover 10% Protection.', ['Taunt', 'Defense Up', 'protection_recovery_all'], ['defensive']),
      makeAbility('kx_special_2', 'Violent Compliance', 'special', 4, 'Deal Physical Damage to target enemy. Inflict Daze (2 turns) and Speed Down (2 turns).', ['damage_single', 'Daze', 'Speed Down'], ['offensive']),
      makeAbility('kx_unique_1', 'Security Override', 'unique', 0, 'Whenever another ISB ally is critically hit, KX Security Droid gains Taunt (1 turn).', ['Taunt'], []),
      makeAbility('kx_unique_2', 'Internal Enforcement', 'unique', 0, 'KX Security Droid takes 20% less damage from enemies with Dossier.', ['Dossier'], [])
    ],
    'Galactic Empire',
    8000,
    'Imposing security droid tank',
    { speed: 120, hp: 60000, protection: 40000, defense: 60 }
  ),

  createCharacter(
    'dedra_meero',
    'Dedra Meero',
    'Support',
    ['Galactic Empire', 'ISB'],
    'Ambitious supervisor who uncovers patterns and relentlessly builds cases.',
    [
      makeAbility('dedra_basic', 'Investigative Pressure', 'basic', 0, 'Deal Special Damage. Inflict 1 stack of Dossier. If target is Jedi, also inflict Vulnerable (1 turn).', ['damage', 'Dossier', 'Vulnerable'], ['offensive']),
      makeAbility('dedra_special_1', 'Follow The Pattern', 'special', 3, 'Dispel all buffs on target enemy and inflict Exposed (2 turns). ISB allies gain Offense Up (2 turns).', ['dispel_enemy', 'Exposed', 'Offense Up'], ['debuff']),
      makeAbility('dedra_special_2', 'Nothing Is Random', 'special', 4, 'Inflict Target Lock (2 turns) and 2 stacks of Dossier on target enemy. Call a random ISB ally to assist.', ['Target Lock', 'Dossier', 'assist'], ['debuff']),
      makeAbility('dedra_unique_1', 'Relentless Investigator', 'unique', 0, 'Dedra Meero gains Stealth (1 turn) at the start of each encounter. While Dedra is active, ISB allies have +15% Critical Chance.', ['Stealth', 'Critical Chance Up'], []),
      makeAbility('dedra_unique_2', 'Building The Case', 'unique', 0, 'Whenever an enemy takes damage from a Dossier-triggered effect, Dedra Meero gains 5% Turn Meter.', ['turn_meter_gain', 'Dossier'], [])
    ],
    'Galactic Empire',
    7800,
    'Analytical support and debuffer',
    { speed: 145 }
  )
];
