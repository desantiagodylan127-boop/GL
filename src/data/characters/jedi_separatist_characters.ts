import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const JEDI_SEPARATIST_CHARACTERS: Character[] = [
  // --- Jedi Guardian Team ---
  createCharacter(
    'agen_kolar',
    'Agen Kolar',
    'Support / Tank',
    ['Jedi', 'Galactic Republic', 'Jedi Guardian'],
    'Fierce Zabrak master who protects Jedi allies and recovers protection upon counterattacks.',
    [
      makeAbility('agen_basic', 'Guardian Strike', 'basic', 0, 'Deal Physical Damage and gain Defense Up (1 turn).', ['damage', 'defense_up', 'Defense Up'], ['offensive']),
      makeAbility('agen_special_1', 'Defensive Position', 'special', 3, 'Gain Taunt (2 turns) and dispel all debuffs from self.', ['taunt', 'cleanse_self', 'Taunt'], ['defensive']),
      makeAbility('agen_unique', 'Unyielding Loyalty', 'unique', 0, 'Whenever Agen counterattacks, recover 5% Protection.', ['counter_passive'], [])
    ],
    'Jedi Guardian',
    8000,
    'Sustained counter-defensive support',
    { speed: 122, hp: 51000, protection: 43000 }
  ),

  createCharacter(
    'saesee_tiin',
    'Saesee Tiin',
    'Attacker',
    ['Jedi', 'Galactic Republic', 'Jedi Guardian'],
    'Aggressive Jedi warrior whose precise strikes trigger bonus criticals and turn meter gains.',
    [
      makeAbility('saesee_basic', 'Precision Slash', 'basic', 0, 'Deal Physical Damage. High Critical Chance.', ['damage'], ['offensive']),
      makeAbility('saesee_special_1', 'Aggressive Advance', 'special', 3, 'Deal Special Damage. Attack again if target is debuffed.', ['damage', 'double_strike'], ['offensive']),
      makeAbility('saesee_unique', 'Combat Instincts', 'unique', 0, 'Whenever allies attack out of turn, Saesee Tiin gains 10% Turn Meter.', ['passive_gain'], [])
    ],
    'Jedi Guardian',
    8200,
    'High velocity offensive damage',
    { speed: 138, critChance: 0.45, offense: 3600 }
  ),

  createCharacter(
    'kit_fisto',
    'Kit Fisto',
    'Leader / Attacker / Saboteur',
    ['Jedi', 'Galactic Republic', 'Jedi Guardian'],
    'Fluid master who coordinates allies to strike out of turn and generates incredible tempo speed.',
    [
      makeAbility('fisto_basic', 'Flowing Strike', 'basic', 0, 'Deal Physical Damage and inflict Defense Down (1 turn).', ['damage', 'defense_down', 'Defense Down'], ['offensive']),
      makeAbility('fisto_special_1', 'Fluid Momentum', 'special', 3, 'Call random ally to assist. Brandish Speed Up (2 turns) on assisting ally.', ['assist', 'speed_up', 'Speed Up'], ['assist']),
      makeAbility('fisto_leader', 'Jedi Coordination', 'leader', 0, 'Jedi Guardian allies gain +20 Speed and 2% Protection recovery whenever they attack out of turn.', ['buff_faction'], []),
      makeAbility('fisto_unique', 'Adaptive Duelist', 'unique', 0, 'Whenever debuffed enemies take turns, Kit Fisto gains 5% Turn Meter.', ['passive_gain'], [])
    ],
    'Jedi Guardian',
    8300,
    'Fluid tempo and assist generation',
    { speed: 133 }
  ),

  createCharacter(
    'depa_billaba',
    'Depa Billaba',
    'Attacker / Support',
    ['Jedi', 'Galactic Republic', 'Jedi Guardian'],
    'Sympathetic healer whose focused strikes revive structures and cleanse team debuffs.',
    [
      makeAbility('depa_basic', 'Focused Slash', 'basic', 0, 'Deal Physical Damage. Heal weakest ally for 5% Health.', ['damage', 'heal'], ['offensive', 'heal']),
      makeAbility('depa_special_1', 'Force Guidance', 'special', 3, 'Dispel debuffs from all allies. Grant Offense Up and Tenacity Up (2 turns).', ['cleanse_all', 'buff_all', 'Tenacity Up', 'Offense Up'], ['defensive']),
      makeAbility('depa_unique', 'Steadfast Resolve', 'unique', 0, 'Whenever allies fall below 50% HP, Depa gains 10% Turn Meter.', ['passive_gain'], [])
    ],
    'Jedi Guardian',
    8100,
    'Hybrid offensive healing support',
    { speed: 128 }
  ),

  createCharacter(
    'mace_windu',
    'Jedi Master Windu',
    'Leader / Attacker / Tank / Galactic Legend',
    ['Jedi', 'Galactic Republic', 'Jedi Guardian', 'Jedi High Council'],
    'Vaapad master. Champion of the Republic who places investigation and arrest warrants to control and dismantle enemies.',
    [
      makeAbility('windu_basic', 'Master Of Vaapad', 'basic', 0, 'Deal Physical Damage. Inflict: Investigation. If target already has Investigation: Inflict Defense Down (2 turns).', ['damage', 'Investigation', 'Defense Down'], ['offensive']),
      makeAbility('windu_special_1', 'Hammer Of Ryloth', 'special', 3, 'Deal Physical Damage to target enemy. Inflict: Investigation. If target already has Investigation: Inflict Stun (1 turn). Ignore Protection.', ['damage', 'Investigation', 'Stun', 'penetrate_shield'], ['offensive']),
      makeAbility('windu_special_2', 'You Are Under Arrest', 'special', 4, 'Deal Physical Damage. If target has Investigation: Remove Investigation. Inflict: Arrest Warrant. If target already had Arrest Warrant: Inflict: Daze (2 turns), Buff Immunity (2 turns), Healing Immunity (2 turns).', ['damage', 'Arrest Warrant', 'Daze', 'Buff Immunity', 'Healing Immunity'], ['offensive']),
      makeAbility('windu_lead', 'Champion Of The Republic', 'leader', 0, 'Jedi Guardian allies gain: 30 Speed, 30% Max Health, 25% Offense. Whenever an enemy gains Investigation: Jedi Guardian allies gain 3% Turn Meter. Whenever an enemy gains Arrest Warrant: Jedi Guardian allies recover 5% Health and Protection.', ['leader_buff', 'Investigation', 'Arrest Warrant'], []),
      makeAbility('windu_unique', 'The Senate Will Decide Your Fate', 'unique', 0, 'Whenever an enemy gains Investigation: Jedi Master Windu gains 5% Offense (stacking). Whenever an enemy gains Arrest Warrant: Jedi Master Windu gains 5% Defense (stacking). Whenever a Jedi Guardian ally attacks an enemy with Investigation: Gain 2% Turn Meter. Jedi Master Windu ignores Taunt when targeting enemies with Arrest Warrant.', ['passive_synergy', 'Investigation', 'Arrest Warrant', 'turn_meter_gain'], []),
      makeAbility('windu_ultimate', "This Party's Over", 'ultimate', 0, 'Activate at 100% Ultimate Charge. All enemies gain: Investigation. All enemies with Investigation gain: Arrest Warrant. Dispel all buffs from all enemies. Deal massive Physical Damage to all enemies. Enemies with Arrest Warrant: Cannot be Revived. Jedi Guardian allies gain: Offense Up (2 turns), Defense Up (2 turns), Tenacity Up (2 turns).', ['ultimate', 'Investigation', 'Arrest Warrant', 'Dispel', 'damage_aoe'], ['ultimate'], 100)
    ],
    'Jedi Guardian',
    15000,
    'VAAPAD dynamic arrest and investigation mechanics',
    { speed: 148, hp: 82000, protection: 68000, defense: 56 }
  ),

  // --- Separatist Droids ---

  // --- Galactic Legends ---
  createCharacter(
    'master_kenobi',
    'Master Kenobi',
    'Leader / Tank / Strategist / Galactic Legend',
    ['Galactic Republic', 'Jedi', 'Jedi High Council', 'Jedi Guardian'],
    'The ultimate defensive sovereign who grants damage immunity, cleanses, triggers supreme ultimate High Ground stances and resists Turn Meter controls.',
    [
      makeAbility('kenobi_basic', 'Soresu Mastery', 'basic', 0, 'Deal Physical Damage. Inflict Offense Down (2 turns). Master Kenobi gains Defense Up (1 turn).', ['damage', 'offense_down', 'defense_up', 'Offense Down', 'Defense Up'], ['defensive']),
      makeAbility('kenobi_special_1', 'General of the Republic', 'special', 3, 'Call all Galactic Republic allies to assist for 30% reduced damage. Weakest ally recovers 15% Protection.', ['assist_all', 'protection_recovery'], ['offensive']),
      makeAbility('kenobi_special_2', 'Defensive Formation', 'special', 4, 'All allies gain Defense Up, Tenacity Up, and 20% Protection Up (2 turns). All enemies lose 10% Turn Meter.', ['buff_all', 'protection_up', 'turn_meter_reduction_aoe', 'Defense Up', 'Tenacity Up', 'Protection Up'], ['defensive']),
      makeAbility('kenobi_special_3', 'The Negotiator’s Resolve', 'special', 4, 'Dispel all debuffs from allies. All allies recover 20% Protection. Weakest ally gains Damage Immunity (1 turn).', ['cleanse_all', 'protection_recovery', 'damage_immunity', 'Damage Immunity'], ['defensive', 'heal']),
      makeAbility('kenobi_leader', 'Guardian of the Republic', 'leader', 0, 'Galactic Republic allies gain +30 Speed. Jedi allies gain +25% Defense. Clone Troopers gain +20% Counter Chance. Whenever allies are critically hit, recover 3% Protection. When enemies attack out of turn, allies gain 2% TM. Defeated allies grant stacking defensive stats.', ['buff_gl_faction'], []),
      makeAbility('kenobi_unique_1', 'Master of Soresu', 'unique', 0, 'Master Kenobi is immune to Ability Block, Healing Immunity, and Turn Meter Reduction. Whenever allies fall below 50% Health, Kenobi gains Taunt (1 turn). Kenobi gains +2% Defense on hits.', ['passive_gl_immunity', 'Ability Block', 'Healing Immunity', 'Taunt'], []),
      makeAbility('kenobi_unique_2', 'There Is Always Another Way', 'unique', 0, 'Once Per Battle, if an ally would be defeated: prevent defeat, ally recovers 40% Health and gains 30% Protection Up, and Master Kenobi gains Taunt (2 turns).', ['passive_gl', 'Taunt', 'Protection Up'], []),
      makeAbility('kenobi_ultimate', 'The High Ground', 'ultimate', 0, 'Activate at 100% Ultimate Charge. Enter High Ground Stance for 3 turns. While active, allies take 50% reduced damage, enemies deal reduced Crit Damage, Republic allies gain Retribution, Jedi gain Foresight, and Clone allies assist whenever Kenobi attacks. Instantly deals massive true damage to target, inflicting Shattered Defense (2 turns).', ['Shattered Defense', 'Retribution', 'Foresight'], ['ultimate'], 100)
    ],
    'Jedi Guardian',
    15000,
    'Sovereign defensive and true damage',
    { speed: 154, hp: 86000, protection: 64000, defense: 58 }
  ),

  createCharacter(
    'eternal_fire_grievous',
    'Eternal Fire Grievous',
    'Leader / Attacker / Tank / Galactic Legend',
    ['Separatist', 'Droid'],
    'The ultimate destructive droid Galactic Legend, which summons a Magna Guard Remnant, enters Endless Violence stance, and burns all enemies.',
    [
      makeAbility('efg_basic', 'Burning Hatred', 'basic', 0, 'Deal Physical Damage. Inflict Healing Immunity (2 turns). If target has debuffs, deal 30% bonus damage.', ['damage', 'healing_immunity', 'Healing Immunity'], ['offensive']),
      makeAbility('efg_special_1', 'Mechanical Slaughter', 'special', 3, 'Deal Physical Damage to all enemies. Inflict Defense Down (1 turn) and Ability Block (1 turn).', ['damage_aoe', 'defense_down', 'ability_block', 'Defense Down', 'Ability Block'], ['offensive']),
      makeAbility('efg_special_2', 'Relentless Advance', 'special', 4, 'Summon Magna Guard Remnant. Grievous gains Defense Up and Retribution (2 turns).', ['summon', 'buff_self', 'Defense Up', 'Retribution'], ['defensive']),
      makeAbility('efg_special_3', 'Inferno Protocol', 'special', 4, 'Lose 10% Max Health. All Separatist allies gain Offense Up and Critical Damage Up (2 turns). All enemies gain Burning (2 turns).', ['burn_all', 'self_damage', 'buff_all', 'Burning', 'Offense Up', 'Critical Damage Up'], ['offensive']),
      makeAbility('efg_leader', 'Eternal War Machine', 'leader', 0, 'Separatist allies gain +30 Speed. Droid allies gain +25% Offense. Whenever allies are defeated, Grievous gains stacking Offense, Critical Damage, and Speed. Enemies defeated by Separatists cannot be revived.', ['buff_gl_faction'], []),
      makeAbility('efg_unique_1', 'Rage Beyond Death', 'unique', 0, 'Grievous is immune to Fear, Stun, and Healing Immunity. Whenever Grievous falls below 50% Health, dispel all debuffs from self, gain a Bonus Turn, and gain Offense Up (2 turns).', ['passive_gl', 'Healing Immunity', 'Stun', 'Offense Up', 'Fear'], []),
      makeAbility('efg_unique_2', 'Charred Survivor', 'unique', 0, 'At battle start, summon Magna Guard Remnant. Whenever Magna Guard Remnant is defeated, Grievous immediately triggers Mechanical Slaughter. Magna Guard can be resummoned once per battle.', ['passive_gl_summon'], []),
      makeAbility('efg_ultimate', 'Endless Violence', 'ultimate', 0, 'Activate at 100% Ultimate Charge. Enter Endless Violence stance for 3 turns. While active, Grievous attacks twice per turn, ignores Taunt, gains massive Lifesteal and bonus Crit Damage, and all attacks inflict Burning. Deals devastating damage to all enemies (no revive).', ['Burning', 'Taunt'], ['ultimate'], 100)
    ],
    'Separatist Droid',
    15000,
    'Sovereign Droid assault and area burn',
    { speed: 152, hp: 88000, protection: 62000, defense: 48 }
  ),

  // --- Summon Unit (Cannot be in standard roster selections, but operates in battle) ---
  createCharacter(
    'magna_guard_remnant',
    'Magna Guard Remnant',
    'Summoned Ally',
    ['Separatist', 'Droid', 'Summon'],
    'A protective summoned droid bodyguard that shields Eternal Fire Grievous.',
    [
      makeAbility('remrant_basic', 'Remnant Electrostaff', 'basic', 0, 'Deal Physical Damage. 40% chance to inflict Offense Down (1 turn).', ['damage', 'offense_down', 'Offense Down'], ['offensive']),
      makeAbility('remnant_special', 'Burned Protector', 'special', 3, 'Gain Taunt (2 turns) and Defense Up (2 turns), and recover 15% Protection.', ['taunt', 'protection_recovery', 'Defense Up', 'Taunt'], ['defensive']),
      makeAbility('remnant_unique', 'Last Directive', 'unique', 0, 'Whenever Eternal Fire Grievous is attacked, 50% chance to counterattack. When defeated, Grievous immediately uses Mechanical Slaughter.', ['summon_passive'], [])
    ],
    'Separatist Droid',
    4000,
    'Defensive summoned protector',
    { speed: 110, hp: 30000, protection: 20000, defense: 50 }
  ),

  createCharacter(
    'general_kenobi',
    'General Kenobi',
    'Leader / Tank / Strategist',
    ['Galactic Republic', '212th', 'Jedi', 'Jedi High Council'],
    'Legendary Jedi master and General of the 212th Attack Battalion who leads with ultimate defensive redirection.',
    [
      makeAbility('gk_basic', 'Defensive Mastery', 'basic', 0, 'Deal Physical Damage. Recover 5% Protection.', ['damage', 'protection_recovery'], ['offensive']),
      makeAbility('gk_special', 'Hold Fast', 'special', 3, 'Gain Taunt (2 turns) and Defense Up (2 turns). Recover 20% Protection.', ['taunt', 'protection_recovery', 'Taunt'], ['defensive']),
      makeAbility('gk_special_2', 'General Of The 212th', 'special', 4, 'All 212th allies gain Protection Up (30%) and Defense Up (2 turns). Gain 1 stack of Combined Arms.', ['buff_all', 'Combined Arms'], ['defensive']),
      makeAbility('gk_leader', 'Courage Under Fire', 'leader', 0, 'At battle start: Gain Negotiator. 212th allies gain: 30% Max Health and 30% Defense. Whenever Combined Arms Assault is used: Recover 5% Protection. Whenever an ally falls below 50% Health: General Kenobi gains Taunt (1 turn).', ['buff_faction'], []),
      makeAbility('gk_unique', 'The Negotiator', 'unique', 0, 'General Kenobi is immune to Ability Block. Whenever General Kenobi loses Protection: Recover 2% Protection. Whenever a 212th ally gains Combined Arms: Recover 3% Protection. While General Kenobi has Negotiator: All allied Health damage is redirected to General Kenobi\'s Protection (ignores Taunt).', ['immune_ability_block'], []),
      makeAbility('combined_arms_assault_gk', 'Combined Arms Assault', 'special', 2, 'Effects depend on current Combined Arms stacks:\n- 0 Stacks: Coordinated Fire: Call target ally to Assist.\n- 1 Stack: Squad Advance: Call all other 212th allies to Assist dealing 50% reduced damage. Remove 1 Combined Arms stack.\n- 2 Stacks: Artillery Barrage: Deal Special Damage to all enemies. Inflict: Defense Down (2 turns). Remove 2 Combined Arms stacks.\n- 3 Stacks: LAAT Gunship Strike: Deal massive Physical Damage to all enemies. Ignore Taunt. Inflict: Daze (2 turns), Offense Down (2 turns). Remove all Combined Arms stacks.', ['damage_aoe', 'assist', 'Combined Arms'], ['offensive'])
    ],
    '212th',
    8800,
    'Defensive master and status redirector',
    { speed: 125, hp: 55000, protection: 48000 }
  ),
];
