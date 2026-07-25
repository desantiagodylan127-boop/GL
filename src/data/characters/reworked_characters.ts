import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const REWORKED_CHARACTERS = [
  // TIE PILOT
  createCharacter(
    'tie_pilot',
    'TIE Pilot',
    'Attacker',
    ['Empire', 'Imperial Trooper'],
    'An extremely lethal Empire attacker that coordinates Critical Hits to recover protection and gain advantage.',
    [
      makeAbility('tie_basic', 'Targeting Lasers', 'basic', 0, 'Deal Physical Damage. Gain Critical Chance Up for 1 turn. If this attack critically hits: Gain 10% Turn Meter.', ['damage', 'Critical Chance Up', 'turn_meter_gain'], ['offensive']),
      makeAbility('tie_spec1', 'Aerial Barrage', 'special', 3, 'Deal Physical Damage. Inflict Defense Down (2 turns). If target already has Defense Down: Attack again for reduced damage.', ['damage', 'Defense Down', 'bonus_attack_conditional'], ['offensive']),
      makeAbility('tie_spec2', 'Imperial Air Support', 'special', 4, 'All Empire allies gain: Critical Chance Up (2 turns) and Critical Damage Up (2 turns). TIE Pilot gains Advantage.', ['buff_all', 'Critical Chance Up', 'Critical Damage Up', 'Advantage'], ['offensive']),
      makeAbility('tie_unique', 'Elite Flight Training', 'unique', 0, 'Gain +25% Critical Chance and +25% Critical Damage. Whenever an Empire ally critically hits: Gain 5% Turn Meter. Whenever TIE Pilot critically hits: Empire allies recover 3% Protection.', ['passive_damage_boost', 'turn_meter_gain', 'protection_recovery'], [])
    ],
    'Empire',
    7500,
    'Critical-hit focused Empire attacker',
    {...STANDARD_STATS, speed: 140, critChance: 0.35, critDamage: 1.65}
  ),

  // SCOUT TROOPER
  createCharacter(
    'scout_trooper',
    'Scout Trooper',
    'Support',
    ['Empire', 'Imperial Trooper'],
    'Forward observer who heavily synergizes with Target Lock mechanics and coordinates strikes.',
    [
      makeAbility('scout_basic', 'Recon Shot', 'basic', 0, 'Deal Physical Damage. Inflict Target Lock for 2 turns.', ['damage', 'Target Lock'], ['offensive']),
      makeAbility('scout_spec1', 'Forward Observation', 'special', 3, 'Empire allies gain: Potency Up (2 turns) and Critical Chance Up (2 turns). Scout Trooper gains Stealth for 2 turns.', ['buff_all', 'Potency Up', 'Critical Chance Up', 'Stealth'], ['defensive', 'buff']),
      makeAbility('scout_spec2', 'Coordinate Fire', 'special', 4, 'Call random Empire ally to assist. If target has Target Lock: Call a second Empire ally to assist.', ['assist', 'Target Lock'], ['offensive']),
      makeAbility('scout_unique', 'Battlefield Recon', 'unique', 0, 'Whenever an enemy gains a debuff: Scout Trooper gains 5% Turn Meter. Whenever Scout Trooper attacks a Target Locked enemy: Recover 5% Protection. Whenever an Empire ally attacks a Target Locked enemy: Scout Trooper gains 2% Offense (stacking).', ['turn_meter_gain', 'protection_recovery', 'passive_stacking_offense'], [])
    ],
    'Empire',
    7200,
    'Fast Imperial Trooper providing Target Lock and assists',
    {...STANDARD_STATS, speed: 145}
  ),

  // ASAJJ VENTRESS
  createCharacter(
    'asajj_ventress',
    'Asajj Ventress',
    'Attacker',
    ['Separatist'],
    'Lethal Separatist assassin who excels at chaining Special abilities when defeating enemies.',
    [
      makeAbility('asajj_basic', 'Dual Saber Assault', 'basic', 0, 'Deal Physical Damage. If target has Defense Down: Attack again for reduced damage.', ['damage', 'bonus_attack_conditional', 'Defense Down'], ['offensive']),
      makeAbility('asajj_spec1', 'Separatist Ambition', 'special', 3, 'Gain: Offense Up (2 turns) and Critical Damage Up (2 turns). Then deal Physical Damage. If target is defeated: Reset this ability\'s cooldown.', ['damage', 'Offense Up', 'Critical Damage Up', 'cooldown_reset_on_kill'], ['offensive']),
      makeAbility('asajj_spec2', 'Dark Side Fury', 'special', 4, 'Deal Physical Damage to all enemies. Inflict: Defense Down (2 turns) and Healing Immunity (2 turns).', ['damage_aoe', 'Defense Down', 'Healing Immunity'], ['offensive']),
      makeAbility('asajj_unique', 'Assassin Of Dooku', 'unique', 0, 'Whenever a Separatist ally attacks: Gain 2% Offense (stacking). Whenever an enemy falls below 50% Health: Gain 20% Turn Meter. If all allies are Separatists: Gain +25% Max Health and +25% Critical Damage.', ['passive_scaling', 'turn_meter_gain', 'passive_boost'], [])
    ],
    'Separatist War Council',
    8500,
    'AoE Debuffs and stacking Offense',
    {...STANDARD_STATS, speed: 138, hp: 42000}
  ),

  // JEDI KNIGHT
  createCharacter(
    'jedi_knight',
    'Jedi Knight',
    'Tank',
    ['Jedi', 'Jedi Guardian'],
    'Resilient frontline defender who uses Guardian Resolve to shield the team.',
    [
      makeAbility('jk_basic', 'Defensive Strike', 'basic', 0, 'Deal Physical Damage. Gain 1 stack of Guardian\'s Resolve.', ['damage', 'Guardian\'s Resolve'], ['offensive']),
      makeAbility('jk_spec1', 'Protect The Weak', 'special', 3, 'Target ally gains: Defense Up (2 turns) and Protection Up (15%). Gain 2 stacks of Guardian\'s Resolve.', ['buff_ally', 'Defense Up', 'Protection Up', 'Guardian\'s Resolve'], ['defensive']),
      makeAbility('jk_spec2', 'Stand Firm', 'special', 4, 'Gain: Taunt (2 turns) and Retribution (2 turns). Gain 3 stacks of Guardian\'s Resolve.', ['buff_self', 'Taunt', 'Retribution', 'Guardian\'s Resolve'], ['defensive']),
      makeAbility('jk_unique', 'Temple Protector', 'unique', 0, 'Whenever a Jedi Guardian ally falls below 50% Health: Gain Taunt for 1 turn and recover 15% Protection. Whenever Guardian\'s Resolve reaches 10 stacks: Recover 20% Health and Protection.', ['passive_taunt', 'protection_recovery', 'heal'], [])
    ],
    'Jedi Guardian',
    7000,
    'Reliable temple protector',
    {...STANDARD_STATS, speed: 110}
  ),

  // KIT FISTO
  createCharacter(
    'kit_fisto',
    'Kit Fisto',
    'Attacker / Saboteur',
    ['Galactic Republic', 'Jedi', 'Jedi Guardian', 'Jedi High Council'],
    'Water-skilled Nautolan duelist whose flurry excels when punishing enemies under investigation.',
    [
      makeAbility('kit_basic', 'Shii-Cho Flurry', 'basic', 0, 'Deal Physical Damage. If target has Investigation: Attack again.', ['damage', 'Investigation', 'bonus_attack'], ['offensive']),
      makeAbility('kit_spec1', 'Master Of The Mon Cala', 'special', 3, 'Deal Physical Damage. Inflict: Buff Immunity (2 turns). If target has Investigation: Inflict Healing Immunity (2 turns).', ['damage', 'Buff Immunity', 'Healing Immunity', 'Investigation'], ['offensive']),
      makeAbility('kit_spec2', 'Underwater Assault', 'special', 4, 'Deal Physical Damage to all enemies. Enemies with Investigation: Take bonus damage.', ['damage_aoe', 'Investigation'], ['offensive']),
      makeAbility('kit_unique', 'Relentless Duelist', 'unique', 0, 'Whenever an enemy gains Investigation: Kit Fisto gains 5% Turn Meter. Whenever Kit Fisto damages an enemy with Investigation: Gain Critical Chance Up (1 turn).', ['passive_synergy', 'Investigation', 'turn_meter_gain', 'Critical Chance Up'], [])
    ],
    'Jedi Guardian',
    8500,
    'Responsive dynamic investigation duelist',
    {...STANDARD_STATS, speed: 135, hp: 52000, protection: 42000}
  ),

  // AGEN KOLAR
  createCharacter(
    'agen_kolar',
    'Agen Kolar',
    'Support / Strategist',
    ['Galactic Republic', 'Jedi', 'Jedi Guardian', 'Jedi High Council'],
    'Tactical coordinator who executes arrest warrants and calls assists upon investigation.',
    [
      makeAbility('agen_basic', 'Council Enforcer', 'basic', 0, 'Deal Physical Damage. Target ally recovers 5% Health and Protection.', ['damage', 'heal', 'protection_recovery'], ['offensive']),
      makeAbility('agen_spec1', 'Jedi Coordination', 'special', 3, 'Target ally gains: Offense Up (2 turns), Critical Chance Up (2 turns). If an enemy has Investigation: Call target ally to Assist.', ['buff_ally', 'assist', 'Investigation', 'Offense Up', 'Critical Chance Up'], ['offensive']),
      makeAbility('agen_spec2', 'Execute The Warrant', 'special', 4, 'Deal Physical Damage. If target has Investigation: Remove Investigation. Inflict: Arrest Warrant. If target already has Arrest Warrant: Reduce cooldowns of all Jedi Guardian allies by 1.', ['damage', 'Arrest Warrant', 'cooldown_reduction'], ['offensive']),
      makeAbility('agen_unique', 'Guardian Of The Chancellor', 'unique', 0, 'Whenever an enemy gains Arrest Warrant: All Jedi Guardian allies gain 5% Turn Meter. Whenever an enemy with Arrest Warrant takes a turn: Agen Kolar recovers 5% Health and Protection. Whenever a Jedi Guardian ally uses a Special Ability: 10% chance to inflict Investigation on the strongest enemy that does not already have it.', ['passive_synergy', 'Arrest Warrant', 'turn_meter_gain', 'heal', 'protection_recovery', 'Investigation'], [])
    ],
    'Jedi Guardian',
    8200,
    'Execute warrant support and coordination',
    {...STANDARD_STATS, speed: 122, hp: 55000, protection: 48000}
  ),

  // DEPA BILLABA
  createCharacter(
    'depa_billaba',
    'Depa Billaba',
    'Leader / Attacker / Support',
    ['Galactic Republic', 'Jedi', 'Jedi Guardian', 'Jedi High Council'],
    'Empathetic master whose council directives and wind-following tactics sustain Jedi Guardians.',
    [
      makeAbility('depa_basic', 'Disciplined Strike', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict: Investigation. If target already has Investigation: Recover 5% Health.', ['damage', 'Investigation', 'heal'], ['offensive']),
      makeAbility('depa_spec1', 'Council Directive', 'special', 3, 'Target enemy gains: Investigation. All Jedi Guardian allies gain: Offense Up (2 turns)', ['Investigation', 'Offense Up'], ['offensive']),
      makeAbility('depa_spec2', 'Master Of Caleb', 'special', 4, 'Target ally gains: Defense Up (2 turns), Tenacity Up (2 turns). If an enemy has Investigation: Call target ally to Assist.', ['buff_ally', 'assist', 'Investigation', 'Defense Up', 'Tenacity Up'], ['defensive']),
      makeAbility('depa_lead', 'Follow the Winds', 'leader', 0, 'Jedi Guardian allies gain: 20 Speed, 20% Max Health. Whenever an enemy gains Investigation: Jedi Guardian allies recover 3% Health and Protection.', ['leader_buff', 'Investigation', 'heal', 'protection_recovery'], []),
      makeAbility('depa_unique', 'Vaapad Apprentice', 'unique', 0, 'Whenever an enemy gains Investigation: Depa gains 5% Turn Meter. Whenever a Jedi Guardian ally attacks an enemy with Investigation: Depa gains Offense Up (1 turn).', ['passive_synergy', 'Investigation', 'turn_meter_gain', 'Offense Up'], [])
    ],
    'Jedi Guardian',
    8000,
    'Sustained tactical healing and investigation driver',
    {...STANDARD_STATS, speed: 128, hp: 51000, protection: 43000}
  ),

  // JOCASTA NU
  createCharacter(
    'jocasta_nu',
    'Jocasta Nu',
    'Strategist / Saboteur',
    ['Galactic Republic', 'Jedi', 'Jedi Guardian'],
    'Jedi Librarian who marks key targets under investigation and grants team-wide defensive records.',
    [
      makeAbility('jocasta_basic', 'Archives Research', 'basic', 0, 'Deal Special Damage. Inflict: Investigation.', ['damage', 'Investigation'], ['offensive']),
      makeAbility('jocasta_spec1', 'Lost Twenty', 'special', 3, 'Dispel all buffs from target enemy. Inflict: Investigation. If target already has Investigation: Reduce Turn Meter by 25%.', ['dispel', 'Investigation', 'turn_meter_reduction'], ['offensive']),
      makeAbility('jocasta_spec2', 'Ancient Records', 'special', 4, 'All Jedi Guardian allies gain: Tenacity Up (2 turns), Potency Up (2 turns). The strongest enemy that does not already have Investigation gains: Investigation.', ['buff_all', 'Tenacity Up', 'Potency Up', 'Investigation'], ['defensive', 'buff']),
      makeAbility('jocasta_unique', 'Keeper Of The Archives', 'unique', 0, 'At the start of battle: Inflict Investigation on the strongest enemy. Whenever an enemy loses Investigation: Jocasta Nu gains 10% Turn Meter. Whenever an enemy gains Arrest Warrant: Jocasta Nu gains Stealth (2 turns). Whenever a Jedi Guardian ally attacks an enemy with Investigation: That ally gains 5% Turn Meter and recovers 5% Health and Protection.', ['passive_synergy', 'Investigation', 'Arrest Warrant', 'turn_meter_gain', 'Stealth', 'heal', 'protection_recovery'], [])
    ],
    'Jedi Guardian',
    8000,
    'Information and investigation suppression support',
    {...STANDARD_STATS, speed: 130, hp: 45000, protection: 35000}
  ),

  // SAESEE TIIN
  createCharacter(
    'saesee_tiin',
    'Saesee Tiin',
    'Attacker',
    ['Galactic Republic', 'Jedi', 'Jedi Guardian', 'Jedi High Council'],
    'Rapid High-Council duelist who gains massive Turn Meter and coordinates assists against investigated enemies.',
    [
      makeAbility('saesee_basic', 'Precision Slash', 'basic', 0, 'Deal Physical Damage with high Critical Chance. If target has Investigation: Gain Offense Up (1 turn).', ['damage', 'Investigation', 'Offense Up'], ['offensive']),
      makeAbility('saesee_spec1', 'Aggressive Advance', 'special', 3, 'Deal Special Damage. If target has Investigation: Inflict Stun (1 turn) and Exposed (2 turns).', ['damage', 'Investigation', 'Stun', 'Exposed'], ['offensive']),
      makeAbility('saesee_unique', 'Combat Reflexes', 'unique', 0, 'At the start of battle: Saesee Tiin gains Critical Damage Up (2 turns). Whenever a Jedi Guardian ally attacks an enemy with Investigation: Saesee Tiin has a 50% chance to Assist (limit once per turn).', ['passive_synergy', 'Investigation', 'assist', 'Critical Damage Up'], [])
    ],
    'Jedi Guardian',
    8200,
    'Aggressive high velocity offensive damage and assists',
    {...STANDARD_STATS, speed: 138, critChance: 0.45, offense: 3600, hp: 50000, protection: 40000}
  ),

  // ADI GALLIA
  createCharacter(
    'adi_gallia',
    'Adi Gallia',
    'Attacker / Strategist',
    ['Galactic Republic', 'Jedi', 'Jedi High Council'],
    'Respected High Council diplomat who inflicts Speed Down, stuns, and drains TM when guided.',
    [
      makeAbility('adi_basic', 'Council Judgment', 'basic', 0, 'Deal Physical Damage and inflict Speed Down (2 turns).', ['damage', 'Speed Down'], ['offensive']),
      makeAbility('adi_spec1', 'Swift Intervention', 'special', 3, 'Deal Physical Damage and gain Council Guidance. If Adi already had Council Guidance, consume it and Stun target enemy (1 turn).', ['damage', 'Council Guidance', 'Stun'], ['offensive']),
      makeAbility('adi_spec2', 'Battlefield Oversight', 'special', 4, 'All enemies gain Speed Down (2 turns). If Adi has Council Guidance, consume it to reduce all enemy Turn Meter by 20%.', ['damage_aoe', 'Speed Down', 'turn_meter_reduction_aoe', 'Council Guidance'], ['offensive']),
      makeAbility('adi_unique', 'Decisive Action', 'unique', 0, 'Whenever Adi gains Council Guidance, gain 10% Turn Meter. Whenever Adi consumes Council Guidance, gain Critical Chance Up (2 turns). Whenever an enemy is defeated, Adi gains Council Guidance.', ['turn_meter_gain', 'Critical Chance Up', 'Council Guidance'], [])
    ],
    'Jedi High Council',
    8600,
    'Stun and TM control attacker',
    {...STANDARD_STATS, speed: 135, hp: 50000, protection: 40000}
  ),

  // OPPO RANCISIS
  createCharacter(
    'oppo_rancisis',
    'Oppo Rancisis',
    'Tank / Strategist',
    ['Galactic Republic', 'Jedi', 'Jedi High Council'],
    'Wise tactician who provides defensive barriers and robust defense for high council members.',
    [
      makeAbility('oppo_basic', 'Coiled Strike', 'basic', 0, 'Deal Physical Damage. Gain Defense Up (1 turn).', ['damage', 'Defense Up'], ['offensive']),
      makeAbility('oppo_spec1', 'Council Protector', 'special', 3, 'Gain Taunt (2 turns), Defense Up (2 turns), and Council Guidance.', ['Taunt', 'Defense Up', 'Council Guidance'], ['defensive']),
      makeAbility('oppo_spec2', 'Predictive Defense', 'special', 4, 'All Jedi High Council allies gain Protection Up (20%). If they have Council Guidance, they recover 10% Health and Protection, then consume Council Guidance.', ['Protection Up', 'heal', 'protection_recovery', 'Council Guidance'], ['defensive']),
      makeAbility('oppo_unique', 'Master Strategist', 'unique', 0, 'Whenever an ally gains Council Guidance, Oppo gains 5% Turn Meter. Whenever an ally consumes Council Guidance, Oppo gains Defense Up (1 turn). While Oppo has Taunt, Jedi High Council allies gain 15% Defense.', ['turn_meter_gain', 'Defense Up', 'Defense'], [])
    ],
    'Jedi High Council',
    8400,
    'Taunting defense and council buffer',
    {...STANDARD_STATS, speed: 105, hp: 54000, protection: 52000}
  ),

  // COLEMAN KCAJ
  createCharacter(
    'coleman_kcaj',
    'Coleman Kcaj',
    'Support',
    ['Galactic Republic', 'Jedi', 'Jedi High Council'],
    'Reserved wise councilor who provides consistent heal, clean, and gains bonus turns upon critical triggers.',
    [
      makeAbility('coleman_basic', 'Quiet Counsel', 'basic', 0, 'Deal Special Damage. Target ally recovers 5% Health and 5% Protection.', ['damage', 'heal', 'protection_recovery'], ['offensive']),
      makeAbility('coleman_spec1', 'Voice Of Prudence', 'special', 3, 'Target ally gains Council Guidance, Defense Up (2 turns), and Tenacity Up (2 turns). If target already had Council Guidance, reduce their cooldowns by 1.', ['Council Guidance', 'Defense Up', 'Tenacity Up', 'cooldown_reduction'], ['buff']),
      makeAbility('coleman_spec2', 'Avert Disaster', 'special', 4, 'Dispel all debuffs from all Jedi High Council allies. All allies gain Protection Up (20%). All allies without Council Guidance gain Council Guidance.', ['dispel_all', 'Protection Up', 'Council Guidance'], ['defensive']),
      makeAbility('coleman_unique_1', 'Reserved Wisdom', 'unique', 0, 'Whenever an ally gains Council Guidance, recover 3% Health and Protection. Whenever an ally consumes Council Guidance, reduce Coleman Kcaj\'s cooldowns by 1. Whenever Coleman Kcaj uses a Special Ability, a random Jedi High Council ally gains Council Guidance.', ['heal', 'protection_recovery', 'cooldown_reduction', 'Council Guidance'], []),
      makeAbility('coleman_unique_2', 'Future Foretold', 'unique', 0, 'At the start of battle, Coleman Kcaj gains Council Guidance. The first time each Jedi High Council ally consumes Council Guidance, they recover 10% Health and Protection. Whenever a Jedi High Council ally falls below 50% Health, Coleman Kcaj gains a Bonus Turn. Whenever a Jedi High Council ally is defeated, all remaining Jedi High Council allies gain Council Guidance.', ['Council Guidance', 'heal', 'protection_recovery', 'bonus_turn'], [])
    ],
    'Jedi High Council',
    8100,
    'Supreme cleansing restorative support',
    {...STANDARD_STATS, speed: 120, hp: 48000, protection: 36000}
  ),

  // LUMINARA UNDULI
  createCharacter(
    'luminara_unduli',
    'Luminara Unduli',
    'Support / Strategist',
    ['Galactic Republic', 'Jedi', 'Jedi Guardian', 'Jedi High Council'],
    'Compassionate master who heals constantly and gains bonus turns when allies face critical danger.',
    [
      makeAbility('luminara_basic', 'Graceful Strike', 'basic', 0, 'Deal Special Damage. Target ally recovers 5% Health. If target ally has Council Guidance, they recover an additional 5% Health.', ['damage', 'heal'], ['offensive']),
      makeAbility('luminara_spec1', 'Healing Trance', 'special', 3, 'Target ally recovers 25% Health and has all debuffs dispelled. That ally gains Council Guidance.', ['heal', 'dispel', 'Council Guidance'], ['heal']),
      makeAbility('luminara_spec2', 'Light Of Mirial', 'special', 4, 'All allies recover 15% Health and gain Tenacity Up (2 turns). All allies with Council Guidance gain Protection Up (20%), then consume Council Guidance.', ['heal', 'Tenacity Up', 'Protection Up', 'Council Guidance'], ['heal']),
      makeAbility('luminara_unique', 'Compassionate Master', 'unique', 0, 'Whenever an ally gains Council Guidance, they recover 5% Health. Whenever an ally consumes Council Guidance, they recover 5% Health and Protection. Whenever a Jedi High Council ally falls below 50% Health, Luminara gains a Bonus Turn.', ['heal', 'protection_recovery', 'bonus_turn'], [])
    ],
    'Jedi High Council',
    8400,
    'Serene sustain and bonus actions',
    {...STANDARD_STATS, speed: 130, hp: 46000, protection: 42000}
  ),

  // YADDLE
  createCharacter(
    'yaddle',
    'Yaddle',
    'Support / Strategist',
    ['Galactic Republic', 'Jedi', 'Jedi High Council'],
    'Ancient keeper of knowledge who guides her allies and boosts team velocity.',
    [
      makeAbility('yaddle_basic', 'Gentle Guidance', 'basic', 0, 'Deal Special Damage. Target ally gains: Council Guidance.', ['damage', 'Council Guidance'], ['offensive']),
      makeAbility('yaddle_spec1', 'Ancient Wisdom', 'special', 3, 'Target ally gains Council Guidance and recovers 20% Health and Protection. If target already had Council Guidance, reduce their cooldowns by 1.', ['Council Guidance', 'heal', 'protection_recovery', 'cooldown_reduction'], ['heal']),
      makeAbility('yaddle_spec2', 'Harmony Through The Force', 'special', 4, 'All Jedi High Council allies gain Tenacity Up (2 turns) and Defense Up (2 turns). All allies without Council Guidance gain Council Guidance.', ['Tenacity Up', 'Defense Up', 'Council Guidance'], ['buff']),
      makeAbility('yaddle_unique', 'Voice Of Serenity', 'unique', 0, 'Whenever an ally gains Council Guidance, they recover 5% Health. Whenever an ally consumes Council Guidance, Yaddle gains 5% Turn Meter. Whenever Yaddle uses a Special Ability, a random ally gains Council Guidance.', ['heal', 'turn_meter_gain', 'Council Guidance'], [])
    ],
    'Jedi High Council',
    8500,
    'Sustained coordination and guidance distributor',
    {...STANDARD_STATS, speed: 140, hp: 47000, protection: 44000}
  ),

  // AAYLA SECURA
  createCharacter(
    'aayla_secura',
    'Aayla Secura',
    'Attacker / Support',
    ['Galactic Republic', 'Jedi', 'Jedi Guardian', 'Jedi High Council'],
    'Graceful attacker who benefits from Council Guidance to chain strike commands.',
    [
      makeAbility('aayla_basic', 'Elegant Assault', 'basic', 0, 'Deal Physical Damage. If Aayla has Council Guidance, consume it to attack again.', ['damage', 'Council Guidance', 'bonus_attack'], ['offensive']),
      makeAbility('aayla_spec1', 'Twin-Blade Flourish', 'special', 3, 'Deal Physical Damage. If Aayla has Council Guidance, consume it to attack twice more.', ['damage', 'Council Guidance', 'bonus_attack'], ['offensive']),
      makeAbility('aayla_spec2', 'Jedi Precision', 'special', 4, 'Gain Council Guidance, Critical Chance Up (2 turns), and Critical Damage Up (2 turns).', ['Council Guidance', 'Critical Chance Up', 'Critical Damage Up'], ['buff']),
      makeAbility('aayla_unique', 'Grace In Motion', 'unique', 0, 'Whenever Aayla gains Council Guidance, gain 10% Turn Meter. Whenever Aayla consumes Council Guidance, gain Offense Up (2 turns). Whenever Aayla defeats an enemy, gain Council Guidance.', ['turn_meter_gain', 'Offense Up', 'Council Guidance'], [])
    ],
    'Jedi High Council',
    8450,
    'Flurrying multiple attacker',
    {...STANDARD_STATS, speed: 132, hp: 49000, protection: 39000, offense: 3500, critChance: 0.35}
  ),

  // GRAND MASTER YODA
  createCharacter(
    'yoda',
    'Grand Master Yoda',
    'Leader / Support / Strategist',
    ['Galactic Republic', 'Jedi', 'Jedi High Council'],
    'Legendary grand master who commands high council tactics, gains foresights, and heals units.',
    [
      makeAbility('yoda_basic', 'Judge Me By My Size', 'basic', 0, 'Deal Special Damage. Target ally gains: Council Guidance.', ['damage', 'Council Guidance'], ['offensive']),
      makeAbility('yoda_spec1', "Grand Master's Wisdom", 'special', 3, 'All Jedi High Council allies gain: Council Guidance. All allies with Council Guidance recover: 10% Health and Protection.', ['Council Guidance', 'heal', 'protection_recovery'], ['heal', 'buff']),
      makeAbility('yoda_spec2', 'See The Future', 'special', 4, 'All Jedi High Council allies gain: Foresight (2 turns) and Tenacity Up (2 turns). If an ally already has Council Guidance, reduce their cooldowns by 1. Otherwise, they gain Council Guidance.', ['Foil', 'Tenacity Up', 'Council Guidance', 'cooldown_reduction'], ['buff']),
      makeAbility('yoda_leader', 'Voice Of The Council', 'leader', 0, 'Jedi High Council allies gain: 25 Speed and 20% Max Health. Whenever an ally gains Council Guidance, they recover 3% Health and Protection.', ['leader_buff', 'heal', 'protection_recovery'], []),
      makeAbility('yoda_unique', 'Centuries Of Wisdom', 'unique', 0, 'Whenever an ally gains Council Guidance, Grand Master Yoda gains 5% Turn Meter. Whenever a Jedi High Council ally consumes Council Guidance, Grand Master Yoda gains Foresight (1 turn). Whenever Grand Master Yoda uses a Special Ability, a random Jedi High Council ally gains Council Guidance.', ['turn_meter_gain', 'Foresight', 'Council Guidance'], [])
    ],
    'Jedi High Council',
    11000,
    'Sovereign Grand Master and strategist',
    {...STANDARD_STATS, speed: 160, hp: 50000, protection: 45000, defense: 45}
  ),

  // MASTER KENOBI
  createCharacter(
    'master_kenobi',
    'Master Kenobi',
    'Leader / Tank / Support',
    ['Galactic Republic', 'Jedi', 'Jedi High Council'],
    'The legendary Master of Soresu who gains ultimate charges and executes perfect defensive stances.',
    [
      makeAbility('kenobi_basic', 'The Strongest Defense', 'basic', 0, 'Deal Physical Damage. Gain Council Guidance. If Master Kenobi already had Council Guidance, consume it and attack again.', ['damage', 'Council Guidance', 'bonus_attack'], ['offensive']),
      makeAbility('kenobi_spec1', 'Soresu Perfection', 'special', 3, 'Gain Taunt (2 turns) and Defense Up (2 turns). Gain Council Guidance. If Master Kenobi already had Council Guidance, consume it, recover 25% Health and Protection, and dispel all debuffs from self.', ['Taunt', 'Defense Up', 'Council Guidance', 'heal', 'protection_recovery', 'dispel'], ['defensive']),
      makeAbility('kenobi_spec2', 'The High Ground', 'special', 4, 'Deal massive Physical Damage, ignoring Taunt. If Master Kenobi has Council Guidance, consume it to ignore Protection and Defense, and inflict Ability Block (2 turns). If the target is defeated, they cannot be revived.', ['damage', 'Ability Block', 'prevent_revive'], ['offensive']),
      makeAbility('kenobi_leader', 'Last Hope Of The Republic', 'leader', 0, 'Jedi High Council allies gain: 40 Speed, 40% Max Health, and 30% Defense. Whenever an ally gains Council Guidance, they recover 5% Health and Protection. Whenever an ally consumes Council Guidance, Master Kenobi gains 3% Ultimate Charge. Whenever a Jedi High Council ally falls below 50% Health, Master Kenobi gains Council Guidance.', ['leader_buff', 'heal', 'protection_recovery', 'ultimate_charge'], []),
      makeAbility('kenobi_unique', 'Master of Soresu', 'unique', 0, 'At battle start, gain Council Guidance. Master Kenobi is immune to Ability Block and Stun. Whenever Master Kenobi consumes Council Guidance, gain 10% Defense (stacking). Whenever an ally with Council Guidance takes damage, Master Kenobi gains Taunt (1 turn). Whenever Master Kenobi defeats an enemy, all Jedi High Council allies gain Council Guidance.', ['Council Guidance', 'immunity_ability_block', 'immunity_stun', 'Defense', 'Taunt'], []),
      makeAbility('kenobi_ultimate', 'I Will Do What I Must', 'ultimate', 0, 'Dispel all buffs from all enemies. Master Kenobi gains Damage Immunity (1 turn) and Offense Up (3 turns). Deal massive Physical Damage to target. If target has less than 100% Health, instantly defeat them. All Jedi High Council allies gain Council Guidance. All enemies lose 25% Max Health.', ['dispel_all', 'Damage Immunity', 'Offense Up', 'damage', 'instant_defeat', 'Council Guidance', 'max_health_reduction'], ['ultimate'], 100)
    ],
    'Jedi High Council',
    15000,
    'Sovereign defensive legend and leader',
    {...STANDARD_STATS, speed: 154, hp: 86000, protection: 64000, defense: 58}
  ),

  // --- Galactic Marines ---
  createCharacter(
    'commander_bacara',
    'Commander Bacara',
    'Leader / Attacker / Strategist',
    ['Galactic Republic', 'Galactic Marines', 'Clone Trooper'],
    'Galactic Marines Leader. Aggressive tactical leader who enforces the Overdisciplined status and decimates debuffed lines with unrelenting physical pressure.',
    [
      makeAbility('bacara_b', 'Mygeeto Offensive', 'basic', 0, 'Deal Physical Damage. If target is suffering Fear: Attack again.', ['damage'], ['offensive']),
      makeAbility('bacara_s1', 'Relentless Advance', 'special', 3, 'Deal Physical Damage to all enemies. Inflict: Offense Down (2 turns). If an enemy is suffering Fear: Gain Offense Up (2 turns).', ['damage_aoe', 'Offense Down', 'Offense Up'], ['offensive']),
      makeAbility('bacara_s2', 'No Retreat', 'special', 4, 'All Galactic Marine allies gain: Tenacity Up (2 turns), Critical Chance Up (2 turns). Inflict Fear on target enemy.', ['buff_all', 'Tenacity Up', 'Critical Chance Up', 'Fear'], ['offensive']),
      makeAbility('bacara_l', 'Advance At All Costs', 'leader', 0, 'Galactic Marine allies gain: 30% Max Health, 20 Speed. Whenever a Galactic Marine ally attacks a Feared enemy: Recover 5% Health. Whenever an enemy gains Fear: Galactic Marine allies gain 5% Turn Meter.', ['leader', 'turn_meter_gain', 'heal'], []),
      makeAbility('bacara_u', 'Overdisciplined Battalion', 'unique', 0, 'At battle start: All Galactic Marine allies gain: Overdisciplined. Whenever an enemy gains Fear: Commander Bacara gains 5% Turn Meter. Whenever a Galactic Marine ally falls below 50% Health: Gain Offense Up (2 turns).', ['unique', 'turn_meter_gain', 'Offense Up'], [])
    ],
    'Galactic Marines',
    9500,
    'Mygeeto Commander',
    { speed: 140, hp: 55000, protection: 55000, defense: 50 }
  ),
  createCharacter(
    'neyo',
    'Neyo',
    'Saboteur / Support',
    ['Galactic Republic', 'Galactic Marines', 'Clone Trooper'],
    'Extremely fast scout and reconnaissance attacker who calls assists and coordinates flanking assaults.',
    [
      makeAbility('neyo_b', 'Recon Sweep', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict: Speed Down (2 turns). If target is suffering Fear: Inflict Healing Immunity (2 turns).', ['damage', 'Speed Down', 'Healing Immunity'], ['offensive']),
      makeAbility('neyo_s1', 'Scout Intelligence', 'special', 3, 'Dispel all buffs from target enemy. Inflict: Fear. If target already had Fear: Reduce cooldowns of a random Galactic Marine ally by 1.', ['dispel', 'Fear', 'cooldown_reduction'], ['offensive']),
      makeAbility('neyo_s2', 'Behind Enemy Lines', 'special', 4, 'Deal Physical Damage. Inflict: Expose (2 turns), Fear. Gain Stealth (2 turns).', ['damage', 'Expose', 'Fear', 'Stealth'], ['offensive']),
      makeAbility('neyo_u', 'Forward Observer', 'unique', 0, 'Whenever an enemy gains Fear: All Galactic Marine allies recover 5% Health. Whenever Neyo inflicts a debuff: Gain 5% Turn Meter. Whenever a Feared enemy takes a turn: Neyo gains Stealth (1 turn).', ['unique', 'heal', 'turn_meter_gain', 'Stealth'], [])
    ],
    'Galactic Marines',
    8000,
    'Rapid Flanking',
    { speed: 148, hp: 45000, protection: 40000, defense: 45 }
  ),
  createCharacter(
    'jet_marine',
    'Jet',
    'Support',
    ['Galactic Republic', 'Galactic Marines', 'Clone Trooper'],
    'Heavy heavy-duty flamethrower marine who taunts, burns target lines, and shields allies.',
    [
      makeAbility('jet_b', 'Supply Run', 'basic', 0, 'Deal Physical Damage. Target ally recovers 5% Health.', ['damage', 'heal'], ['offensive']),
      makeAbility('jet_s1', 'Emergency Reinforcements', 'special', 3, 'Target ally gains: Health Up (2 turns), Defense Up (2 turns), Recover 15% Health.', ['buff', 'Health Up', 'Defense Up', 'heal'], ['defensive']),
      makeAbility('jet_s2', 'Medical Evacuation', 'special', 4, 'All Galactic Marine allies recover: 20% Health. Dispel all debuffs from target ally. If an enemy is suffering Fear: Recover an additional 10% Health.', ['heal', 'dispel'], ['defensive']),
      makeAbility('jet_u', 'Keep Them Moving', 'unique', 0, 'Whenever a Galactic Marine ally falls below 50% Health: Recover 10% Health. Whenever an enemy gains Fear: Jet gains 10% Turn Meter. Galactic Marine allies gain 15% Health Steal.', ['unique', 'heal', 'turn_meter_gain', 'health_steal'], [])
    ],
    'Galactic Marines',
    8200,
    'Heavy Flamethrower',
    { speed: 110, hp: 65000, protection: 55000, defense: 60 }
  ),
  createCharacter(
    'keller',
    'Keller',
    'Tank / Saboteur',
    ['Galactic Republic', 'Galactic Marines', 'Clone Trooper'],
    'Assault specialist who strikes twice on his basic and ruthlessly finishes low-Health targets.',
    [
      makeAbility('keller_b', 'Close Quarters Assault', 'basic', 0, 'Deal Physical Damage. Inflict: Offense Down (2 turns). If target is suffering Fear: Inflict Daze (2 turns).', ['damage', 'Offense Down', 'Daze'], ['offensive']),
      makeAbility('keller_s1', 'Breach The Position', 'special', 3, 'Deal Physical Damage. Inflict: Fear. Gain: Taunt (2 turns).', ['damage', 'Fear', 'Taunt'], ['defensive']),
      makeAbility('keller_s2', 'Hold This Ground', 'special', 4, 'Gain: Taunt (2 turns), Defense Up (2 turns). All Galactic Marine allies recover 10% Health. If an enemy is suffering Fear: Gain Damage Immunity (1 turn).', ['Taunt', 'Defense Up', 'heal', 'Damage Immunity'], ['defensive']),
      makeAbility('keller_u', 'Veteran Of Mygeeto', 'unique', 0, 'Whenever Keller is damaged: Recover 3% Health. Whenever a Feared enemy attacks: Keller gains 5% Turn Meter. Whenever Keller gains Taunt: All Galactic Marine allies gain 10% Defense.', ['unique', 'heal', 'turn_meter_gain', 'defense_boost'], [])
    ],
    'Galactic Marines',
    8000,
    'Relentless Pursuit',
    { speed: 135, hp: 48000, protection: 42000, defense: 42 }
  ),
  createCharacter(
    'stak',
    'Stak',
    'Attacker / Strategist',
    ['Galactic Republic', 'Galactic Marines', 'Clone Trooper'],
    'Discipline coordinator who dispels debuffs, grants bonus turns, and bypasses enemy armor with True Damage.',
    [
      makeAbility('stak_b', 'Precision Burst', 'basic', 0, 'Deal Physical Damage. If target is suffering Fear: Deal bonus damage.', ['damage'], ['offensive']),
      makeAbility('stak_s1', 'Concentrated Fire', 'special', 3, 'Deal Physical Damage. Ignore 25% Defense. If target is suffering Fear: Attack again.', ['damage'], ['offensive']),
      makeAbility('stak_s2', 'No Safe Position', 'special', 4, 'Deal Physical Damage to all enemies. Enemies suffering Fear: Gain Expose (2 turns).', ['damage_aoe', 'Expose'], ['offensive']),
      makeAbility('stak_u', 'Battlefield Opportunist', 'unique', 0, 'Whenever an enemy gains Fear: Gain Offense Up (2 turns). Whenever a Feared enemy falls below 50% Health: Gain 15% Turn Meter. Whenever Stak defeats an enemy: Reduce cooldowns by 1.', ['unique', 'Offense Up', 'turn_meter_gain', 'cooldown_reduction'], [])
    ],
    'Galactic Marines',
    8000,
    'Empowered Strikes',
    { speed: 130, hp: 46000, protection: 44000, defense: 44 }
  ),
  createCharacter(
    'ki_adi_mundi_journey',
    'Ki-Adi-Mundi',
    'Leader / Attacker / Saboteur',
    ['Galactic Republic', 'Galactic Marines', 'Jedi', 'Jedi High Council'],
    'Journey Character. Veteran Jedi General whose unwavering resolve empowers both Galactic Marines fortitude and Jedi High Council synergy.',
    [
      makeAbility('kam_b', 'Form VII Execution', 'basic', 0, 'Deal Physical Damage. Dispel all buffs from target enemy. If target is suffering Fear: Attack again.', ['damage', 'dispel'], ['offensive']),
      makeAbility('kam_s1', 'Break Their Resolve', 'special', 3, 'Deal Physical Damage to all enemies. Inflict: Fear. Enemies already suffering Fear: Lose 25% Turn Meter.', ['damage_aoe', 'Fear', 'turn_meter_reduction'], ['offensive']),
      makeAbility('kam_s2', 'Makashi Execution', 'special', 4, 'Deal massive Physical Damage to target enemy. Ignore Protection. If target is suffering Fear: Ignore Defense. Cannot be Revived. If this defeats an enemy: All Galactic Marine allies recover 20% Health.', ['damage', 'ignore_protection', 'ignore_defense', 'prevent_revive', 'heal'], ['offensive']),
      makeAbility('kam_l', 'The Cost Of Victory', 'leader', 0, 'Galactic Marine allies gain: 50% Max Health, 25 Speed, 30% Offense. At battle start: Galactic Marine allies gain: Overdisciplined. Whenever an enemy gains Fear: Galactic Marine allies gain 5% Turn Meter. Whenever a Galactic Marine ally attacks a Feared enemy: Recover 5% Health. Whenever a Feared enemy is defeated: Galactic Marine allies gain Offense Up (2 turns).', ['leader', 'Overdisciplined', 'turn_meter_gain', 'heal', 'Offense Up'], []),
      makeAbility('kam_u', 'Acceptable Losses', 'unique', 0, 'Ki-Adi-Mundi is immune to Fear. Whenever an enemy gains Fear: Ki-Adi-Mundi gains 5% Offense (stacking, max 100%). Whenever a Galactic Marine ally falls below 50% Health: Ki-Adi-Mundi gains Bonus Turn. Whenever Ki-Adi-Mundi uses a Special Ability: Inflict Fear on the strongest enemy that does not already have Fear. Whenever a Feared enemy takes a turn: Lose 5% Max Health. Whenever a Galactic Marine ally is defeated: All remaining Galactic Marine allies gain: 25% Turn Meter, 20% Offense (stacking). Ki-Adi-Mundi gains: 10% Offense (stacking).', ['unique', 'Fear_immunity', 'offense_boost', 'bonus_turn', 'Fear', 'max_health_reduction', 'turn_meter_gain'], [])
    ],
    'Galactic Marines',
    15500,
    'Unwavering Resolve',
    { speed: 145, hp: 65000, protection: 50000, defense: 55 }
  ),

  // BARRISS OFFEE
  createCharacter(
    'barriss_offee',
    'Barriss Offee',
    'Support / Saboteur',
    ['Galactic Republic', 'Jedi', 'Jedi Guardian'],
    'Jedi Guardian healer and saboteur who uses patient analysis to target hostile motives, exposing secret schemes.',
    [
      makeAbility('barriss_offee_basic', 'Patient Observation', 'basic', 0, 'Deal Special Damage. Inflict Healing Immunity (1 turn).', ['damage', 'Healing Immunity'], ['offensive']),
      makeAbility('barriss_offee_spec1', 'Question Their Motives', 'special', 3, 'Deal Special Damage. Inflict Investigation (2 turns). If target already has Investigation, inflict Ability Block (1 turn).', ['damage', 'Investigation', 'Ability Block'], ['offensive']),
      makeAbility('barriss_offee_spec2', 'False Reassurance', 'special', 4, 'Target ally recovers 20% Health and has all debuffs dispelled. Random enemy gains Investigation (2 turns).', ['heal', 'dispel', 'Investigation'], ['heal']),
      makeAbility('barriss_offee_unique1', 'Hidden Doubts', 'unique', 0, 'Whenever an enemy gains Investigation, Barriss gains 5% Turn Meter. Whenever a Jedi Guardian ally inflicts Arrest Warrant, Barriss gains Stealth (2 turns). Whenever an enemy with Investigation takes a turn, they lose 3% Max Health.', ['turn_meter_gain', 'Stealth', 'max_health_reduction'], []),
      makeAbility('barriss_offee_unique2', 'The Wrong Path', 'unique', 0, 'Barriss ignores Taunt when targeting enemies with Investigation. Whenever an enemy loses Investigation, Barriss gains Offense Up (2 turns). Whenever an enemy gains Arrest Warrant, Barriss assists dealing 50% reduced damage.', ['ignores_taunt', 'Offense Up', 'assist'], [])
    ],
    'Jedi Guardian',
    8350,
    'Patient healing and motive subversion supporter',
    { ...STANDARD_STATS, speed: 122, hp: 52000, protection: 42000 }
  ),

  // QUINLAN VOS
  createCharacter(
    'quinlan_vos',
    'Quinlan Vos',
    'Attacker / Saboteur',
    ['Galactic Republic', 'Jedi', 'Jedi Guardian'],
    'Unorthodox Jedi tracker who operates deep undercover inside informant networks, breaking targets under arrest warrants.',
    [
      makeAbility('quinlan_vos_basic', 'Underworld Contacts', 'basic', 0, 'Deal Physical Damage. Inflict Investigation (2 turns).', ['damage', 'Investigation'], ['offensive']),
      makeAbility('quinlan_vos_spec1', 'Deep Cover', 'special', 3, 'Gain Stealth (2 turns) and Critical Chance Up (2 turns). Target enemy gains Investigation (2 turns).', ['Stealth', 'Critical Chance Up', 'Investigation'], ['buff']),
      makeAbility('quinlan_vos_spec2', 'Informant Network', 'special', 4, 'Deal Physical Damage, ignoring Taunt. If target has Investigation, remove it and inflict Arrest Warrant (2 turns).', ['damage', 'Arrest Warrant', 'ignores_taunt'], ['offensive']),
      makeAbility('quinlan_vos_unique1', 'Master Of Disguises', 'unique', 0, 'Whenever Quinlan gains Stealth, recover 10% Health and Protection. Whenever an enemy gains Investigation, Quinlan gains 5% Turn Meter. Quinlan deals 25% additional damage to enemies with Arrest Warrant.', ['heal', 'protection_recovery', 'turn_meter_gain', 'damage_boost'], []),
      makeAbility('quinlan_vos_unique2', 'Unorthodox Jedi', 'unique', 0, 'Whenever Quinlan defeats an enemy, gain a Bonus Turn. Whenever an enemy loses Investigation, Quinlan gains Offense Up (2 turns). Whenever a Jedi Guardian ally attacks an enemy with Arrest Warrant, Quinlan assists dealing 50% reduced damage.', ['bonus_turn', 'Offense Up', 'assist'], [])
    ],
    'Jedi Guardian',
    8550,
    'Deceptive critical flanking stealth striker',
    { ...STANDARD_STATS, speed: 138, hp: 47000, protection: 38000, offense: 3600, critChance: 0.38 }
  ),

  // IMA-GUN DI
  createCharacter(
    'ima_gun_di',
    'Ima-Gun Di',
    'Leader / Tank',
    ['Galactic Republic', 'Jedi', 'Jedi Guardian', 'Clone Trooper'],
    'Resolute Jedi Guardian and military leader who provides the last defense of Ryloth, refusing to fall no matter the cost.',
    [
      makeAbility('ima_gun_di_basic', 'Stand Together', 'basic', 0, 'Deal Physical Damage. Heal random ally for 10% Health and Protection.', ['damage', 'heal', 'protection_recovery'], ['offensive']),
      makeAbility('ima_gun_di_spec1', 'Hold The Line', 'special', 3, 'Gain Taunt (2 turns) and Defense Up (2 turns).', ['Taunt', 'Defense Up'], ['defensive']),
      makeAbility('ima_gun_di_spec2', 'No Matter The Cost', 'special', 4, 'Lose 20% Health. All Clone Trooper allies recover 20% Health and gain Offense Up (2 turns).', ['heal', 'Offense Up'], ['offensive', 'buff']),
      makeAbility('ima_gun_di_leader', 'Last Defense Of Ryloth', 'leader', 0, 'Clone Trooper allies gain 20% Max Health and 20% Defense. Whenever a Clone Trooper ally gains a buff, recover 5% Health. Whenever a Clone Trooper ally falls below 50% Health, gain 5% Turn Meter.', ['leader_buff', 'heal_faction', 'turn_meter_gain'], []),
      makeAbility('ima_gun_di_unique1', 'There Is Still Hope', 'unique', 0, 'Whenever Ima-Gun Di loses Health, gain 5% Turn Meter. Whenever a Clone Trooper ally is defeated, all remaining Clone Trooper allies gain 100% Health and Offense Up (2 turns). The first time Ima-Gun Di would be defeated, he recovers 50% Health (once per battle). Ima-Gun Di gains a permanent Taunt at battle start that cannot be dispelled or expire.', ['turn_meter_gain', 'heal_on_defeat', 'Offense Up', 'heal', 'Taunt'], []),
      makeAbility('ima_gun_di_unique2', 'The Last Stand', 'unique', 0, 'Upon defeat, all Clone Trooper allies gain 50% Turn Meter, Offense Up (3 turns), Defense Up (3 turns), and recover 100% Health (Max Heal).', ['turn_meter_gain', 'Offense Up', 'Defense Up', 'heal'], [])
    ],
    'Jedi Guardian',
    8600,
    'Unyielding defensive leader for Clone Trooper legions',
    { ...STANDARD_STATS, speed: 110, hp: 62000, protection: 58000, defense: 62 }
  )
];