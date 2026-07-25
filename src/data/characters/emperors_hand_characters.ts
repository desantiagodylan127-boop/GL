import { createCharacter, makeAbility } from '../characters_base';
import { Character } from '../../types';

export const EMPERORS_HAND_CHARACTERS: Character[] = [
  createCharacter(
    'starkiller',
    'Starkiller',
    'Attacker / Saboteur',
    ['Galactic Empire', 'Emperors Hand', 'Journey Character'],
    'Devastating Force user trained in secret to destroy the Emperor\'s enemies.',
    [
      makeAbility('starkiller_basic', 'Furious Assault', 'basic', 0, 'Deal Physical Damage. If the target has Imperial Decree: Attack again. If this attack critically hits: Gain 5% Turn Meter. If the target is below 50% Health: Attack a third time.', ['damage', 'turn_meter_gain'], ['offensive']),
      makeAbility('starkiller_s1', 'Force Repulse', 'special', 3, 'Deal Special Damage to all enemies. Enemies with Imperial Decree: Lose 20% Turn Meter and Gain Daze (2 turns). If only one enemy has Imperial Decree: Deal damage again.', ['damage_aoe', 'turn_meter_reduction', 'Daze'], ['offensive']),
      makeAbility('starkiller_s2', 'Bring Down The Fleet', 'special', 4, 'Deal Massive Special Damage. Ignore Protection. If target has Imperial Decree: Deal bonus damage equal to 20% Starkiller\'s Max Protection. If the target is defeated: Gain an immediate bonus turn. Reset Furious Assault. Reduce Emperor\'s Hand cooldowns by 1.', ['damage_heavy', 'bonus_turn', 'cooldown_reduction'], ['offensive']),
      makeAbility('starkiller_u1', 'Emperor\'s Wrath', 'unique', 0, 'Whenever Imperial Decree moves: Gain 15% Turn Meter. Whenever an enemy with Imperial Decree is damaged: Gain 2 stacks of Wrath. (Max 10) At 10 stacks: Consume Wrath. Gain: Offense Up, Critical Damage Up, Defense Penetration Up for 2 turns.', ['turn_meter_gain', 'Wrath', 'Offense Up', 'Critical Damage Up', 'Defense Penetration Up'], []),
      makeAbility('starkiller_u2', 'Unleashed Power', 'unique', 0, 'Whenever Starkiller attacks an enemy with Imperial Decree: Ignore 35% Defense and 30% Protection. Whenever an enemy with Imperial Decree is defeated: Recover 40% Health, 40% Protection, Take an immediate bonus turn.', ['defense_penetration', 'heal', 'protection_recovery', 'bonus_turn'], [])
    ],
    'Galactic Empire',
    12000,
    'Devastating Force attacker',
    { speed: 145, offense: 4500, hp: 55000, protection: 45000, defense: 45, critChance: 0.40, critDamage: 1.50, potency: 0.40, tenacity: 0.45 }
  ),

  createCharacter(
    'mara_jade',
    'Mara Jade',
    'Attacker / Saboteur',
    ['Galactic Empire', 'Emperors Hand'],
    'Deadly assassin loyal to the Emperor, specializing in stealth and critical strikes.',
    [
      makeAbility('mara_basic', 'Emperor\'s Strike', 'basic', 0, 'Deal Physical Damage. If target has Imperial Decree: Inflict Healing Immunity (2) and Ability Block (1), Mara gains Stealth.', ['damage', 'Healing Immunity', 'Ability Block', 'Stealth'], ['offensive']),
      makeAbility('mara_s1', 'Silent Assassination', 'special', 3, 'Deal Massive Physical Damage. Ignore 50% Defense. If target has Imperial Decree: Ignore Taunt, Gain Stealth, Inflict Expose, Inflict Buff Immunity. If Mara is already Stealthed: Attack again.', ['damage_heavy', 'Stealth', 'Exposed', 'Buff Immunity'], ['offensive']),
      makeAbility('mara_s2', 'By The Emperor\'s Command', 'special', 4, 'Attack target enemy. Call another Emperor\'s Hand ally to assist. If target has Imperial Decree: Call a second assist, Remove 25% Turn Meter, Inflict Ability Block, Daze.', ['damage', 'assist', 'turn_meter_reduction', 'Ability Block', 'Daze'], ['offensive']),
      makeAbility('mara_u1', 'Emperor\'s Hand', 'unique', 0, 'Whenever Imperial Decree is applied: Gain Stealth, Gain Critical Damage Up. Whenever Mara attacks while Stealthed: Recover 10% Protection. Whenever an enemy with Imperial Decree falls below: 75%, 50%, 25%, Mara immediately assists. (Limit once per threshold)', ['Stealth', 'Critical Damage Up', 'protection_recovery', 'assist'], []),
      makeAbility('mara_u2', 'Elite Assassin', 'unique', 0, 'Ignore 30% Defense. Whenever Mara attacks a Decree target: Gain stacking Offense (+5%, max 100%). Whenever Mara defeats an enemy: Reset Silent Assassination.', ['defense_penetration', 'Offense Up', 'cooldown_reduction'], [])
    ],
    'Galactic Empire',
    8000,
    'Stealthy precision strikes',
    { speed: 155, offense: 4200, hp: 45000, protection: 35000, defense: 35, critChance: 0.45, critDamage: 1.50, potency: 0.50, tenacity: 0.40 }
  ),

  createCharacter(
    'riot_trooper',
    'Riot Trooper',
    'Tank',
    ['Galactic Empire', 'Emperors Hand'],
    'Heavily armored crowd control specialist that punishes counter-attacks.',
    [
      makeAbility('riot_basic', 'Shock Baton', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Daze (1 turn).', ['damage', 'Daze'], ['offensive']),
      makeAbility('riot_s1', 'Containment Formation', 'special', 3, 'Gain: Taunt (2 turns), Defense Up (2 turns). If an enemy has Imperial Decree: Gain Retribution (2 turns).', ['Taunt', 'Defense Up', 'Retribution'], ['defensive']),
      makeAbility('riot_s2', 'Suppress The Target', 'special', 4, 'Deal Physical Damage. If target has Imperial Decree: Inflict Offense Down (2 turns). Inflict Speed Down (2 turns).', ['damage', 'Offense Down', 'Speed Down'], ['offensive']),
      makeAbility('riot_u1', 'Imperial Enforcer', 'unique', 0, 'Whenever an enemy with Imperial Decree attacks: Riot Trooper gains 5% Turn Meter. Whenever Riot Trooper counterattacks: Recover 3% Protection.', ['turn_meter_gain', 'protection_recovery'], []),
      makeAbility('riot_u2', 'Hold The Line', 'unique', 0, 'Whenever an enemy with Imperial Decree damages an ally: Riot Trooper gains Taunt (1 turn). Whenever Riot Trooper gains Taunt: Gain Defense Up (1 turn).', ['Taunt', 'Defense Up'], [])
    ],
    'Galactic Empire',
    7500,
    'Punishes out-of-turn attacks',
    { speed: 115, hp: 60000, protection: 50000, defense: 65, critChance: 0.15, critDamage: 1.50, potency: 0.30, tenacity: 0.60 }
  ),

  createCharacter(
    'gideon_hask',
    'Gideon Hask',
    'Attacker / Support',
    ['Galactic Empire', 'Emperors Hand'],
    'Ruthless special forces operative who thrives on completing objectives at any cost.',
    [
      makeAbility('hask_basic', 'Precision Volley', 'basic', 0, 'Deal Physical Damage. If target has Imperial Decree: Remove 5% Turn Meter.', ['damage', 'turn_meter_reduction'], ['offensive']),
      makeAbility('hask_s1', 'Relentless Barrage', 'special', 3, 'Deal Physical Damage to all enemies. Enemies with Imperial Decree take additional damage.', ['damage_aoe'], ['offensive']),
      makeAbility('hask_s2', 'Final Compliance', 'special', 4, 'Target enemy gains Daze (2 turns). If target has Imperial Decree: Inflict Buff Immunity (2 turns). Remove 10% Turn Meter.', ['Daze', 'Buff Immunity', 'turn_meter_reduction'], ['offensive']),
      makeAbility('hask_u1', 'Fanatical Loyalty', 'unique', 0, 'Whenever an enemy with Imperial Decree loses Turn Meter: Gideon Hask gains 5% Turn Meter. Whenever an enemy with Imperial Decree is damaged: Gain Offense Up (1 turn).', ['turn_meter_gain', 'Offense Up'], []),
      makeAbility('hask_u2', 'No Escape', 'unique', 0, 'Whenever an enemy with Imperial Decree falls below 50% Health: Gain Critical Damage Up (2 turns). Whenever Gideon Hask defeats an enemy: Reduce cooldowns by 1.', ['Critical Damage Up', 'cooldown_reduction'], [])
    ],
    'Galactic Empire',
    8200,
    'Opportunistic attacker',
    { speed: 138, offense: 3800, hp: 48000, protection: 38000, defense: 38, critChance: 0.35, critDamage: 1.50, potency: 0.40, tenacity: 0.40 }
  ),
  
  createCharacter(
    'imperial_officer',
    'Imperial Officer',
    'Strategist / Support',
    ['Galactic Empire', 'Emperors Hand'],
    'Provides crucial operational support and directs fire to priority targets.',
    [
      makeAbility('officer_basic', 'Commanding Shot', 'basic', 0, 'Deal Physical Damage. Target ally gains 3% Turn Meter.', ['damage', 'turn_meter_gain'], ['offensive']),
      makeAbility('officer_s1', 'Strategic Repositioning', 'special', 3, 'Target ally gains: Offense Up (2 turns), Critical Chance Up (2 turns), 10% Turn Meter.', ['Offense Up', 'Critical Chance Up', 'turn_meter_gain'], ['defensive']),
      makeAbility('officer_s2', 'Priority Target', 'special', 4, 'All Emperor\'s Hand allies gain: 5% Turn Meter. If an enemy has Imperial Decree: Call the ally with the highest Offense to assist.', ['turn_meter_gain', 'assist'], ['defensive']),
      makeAbility('officer_u1', 'Chain Of Command', 'unique', 0, 'Whenever an Emperor\'s Hand ally attacks an enemy with Imperial Decree: Imperial Officer gains 5% Turn Meter. Whenever an Emperor\'s Hand ally assists: Recover 2% Protection.', ['turn_meter_gain', 'protection_recovery'], []),
      makeAbility('officer_u2', 'Flawless Coordination', 'unique', 0, 'Whenever Imperial Decree is moved: All Emperor\'s Hand allies gain 5% Turn Meter. Whenever an enemy with Imperial Decree is defeated: All Emperor\'s Hand allies recover 10% Health and gain Speed Up (2 turns).', ['turn_meter_gain', 'heal', 'Speed Up'], [])
    ],
    'Galactic Empire',
    7000,
    'Tactical command and support',
    { speed: 130, hp: 42000, protection: 35000, defense: 30, critChance: 0.20, critDamage: 1.50, potency: 0.35, tenacity: 0.50 }
  ),

  createCharacter(
    'grand_moff_tarkin',
    'Grand Moff Tarkin',
    'Support',
    ['Galactic Empire', 'Emperors Hand'],
    'Imperial Governor who enforces control through fear, directing fire and strategic strikes.',
    [
      makeAbility('tarkin_basic', 'Target The Weakness', 'basic', 0, 'Deal Physical Damage to target enemy and move Imperial Decree to them. Dispel all buffs on them. If Imperial Decree was already present: Remove 15% Turn Meter from them, and all Emperor\'s Hand allies gain 5% Turn Meter.', ['damage', 'Imperial Decree', 'turn_meter_reduction'], ['offensive']),
      makeAbility('tarkin_spec1', 'Priority Target', 'special', 3, 'Move Imperial Decree to target enemy. All Emperor\'s Hand allies gain 5% Turn Meter. If an enemy has Imperial Decree: Call the ally with the highest Offense to assist.', ['Imperial Decree', 'assist'], ['offensive']),
      makeAbility('tarkin_spec2', 'Orbital Bombardment', 'special', 4, 'Deal Physical Damage to all enemies. Enemies with Imperial Decree take 50% additional damage, gain Offense Down (2 turns), and gain Vulnerable (2 turns). If only one enemy remains: Attack that enemy again.', ['damage_aoe', 'Offense Down', 'Vulnerable'], ['offensive']),
      makeAbility('tarkin_lead', 'Doctrine Of Fear', 'leader', 0, 'Empire allies gain: 25 Speed, 20% Potency, 20% Critical Damage. Whenever an Emperor\'s Hand ally attacks an enemy with Imperial Decree: Gain 2% Offense (stacking, max 20 stacks). Whenever Imperial Decree is moved: Empire allies gain 5% Turn Meter. Whenever an enemy with Imperial Decree loses Turn Meter: Empire allies recover 3% Protection.', ['speed', 'potency', 'crit_damage'], []),
      makeAbility('tarkin_uniq', 'Architect Of Order', 'unique', 0, 'Grand Moff Tarkin has +30% Defense and +30% Potency. Whenever an enemy with Imperial Decree is damaged: Tarkin gains 3% Turn Meter. Whenever an enemy with Imperial Decree is defeated: All Emperor\'s Hand allies gain: Offense Up (2 turns), Critical Chance Up (2 turns).', ['defense', 'potency', 'turn_meter_gain'], [])
    ],
    'Galactic Empire',
    8500,
    'Fear tactics and strategic order',
    { speed: 135, offense: 3200, hp: 50000, protection: 40000, defense: 45, potency: 0.40 }
  )
];
