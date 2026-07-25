import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const REBEL_HONOR_CHARACTERS: Character[] = [
  // --- Rebel Alliance Team (Stormtrooper Rescue) ---
  
  
  
  
  
  createCharacter(
    'old_ben',
    'Obi-Wan Kenobi (Old Ben)',
    'Tank / Support',
    ['Rebel', 'Jedi'],
    'Wise exiled Jedi who taunts to protect others and leaves massive stat boosts upon defeat.',
    [
      makeAbility('oldben_basic', 'Measured Strike', 'basic', 0, 'Deal Physical Damage. Inflict Offense Down (1 turn).', ['damage', 'offense_down', 'Offense Down'], ['offensive']),
      makeAbility('oldben_special_1', 'Jedi Guidance', 'special', 3, 'Dispel all debuffs from target ally. Grant Defense Up and Tenacity Up (2 turns).', ['cleanse', 'buff_ally', 'Defense Up', 'Tenacity Up'], ['defensive']),
      makeAbility('oldben_special_2', 'Mindful Sacrifice', 'special', 5, 'Old Ben gains Taunt (2 turns). All allies recover 15% Health and Protection.', ['taunt', 'heal_all', 'Taunt'], ['defensive']),
      makeAbility('oldben_leader', 'Wisdom of the Jedi', 'leader', 0, 'Rebel allies gain +20% Max Protection. Whenever an enemy attacks out of turn, Rebel allies recover 3% Protection. Jedi allies gain +15 Speed.', ['buff_faction'], []),
      makeAbility('oldben_unique', 'Final Lesson', 'unique', 0, 'When Old Ben is defeated, all allies gain Offense Up, Defense Up, and Speed Up (2 turns). Luke allies gain 25% Turn Meter.', ['on_death_passive', 'Defense Up', 'Speed Up', 'Offense Up'], [])
    ],
    'Rebel',
    8400,
    'Protective sacrificial tank',
    { speed: 121, hp: 54000, protection: 48000, defense: 58 }
  ),

  createCharacter(
    'luke_force_found',
    'Luke Skywalker (Force Found)',
    'Leader / Attacker / Support',
    ['Rebel', 'Jedi'],
    'Developing Jedi who uses Force reflexes, calls Rebel assists, and applies Exposed.',
    [
      makeAbility('luke_force_basic', 'Guided Strike', 'basic', 0, 'Deal Physical Damage. Gain Foresight (1 turn).', ['damage', 'foresight', 'Foresight'], ['offensive']),
      makeAbility('luke_force_special_1', 'Force Reflexes', 'special', 3, 'Dispel all debuffs from self. Gain Critical Chance Up and Speed Up (2 turns). Call target Rebel to assist.', ['self_cleanse', 'buff_self', 'assist', 'Speed Up', 'Critical Chance Up'], ['assist', 'offensive']),
      makeAbility('luke_force_special_2', 'Unfinished Training', 'special', 4, 'Deal Physical Damage to all enemies. Inflict Exposed (1 turn) on primary target. All allies recover 10% Protection.', ['damage_aoe', 'exposed', 'protection_recovery', 'Exposed'], ['offensive']),
      makeAbility('luke_force_leader', 'Growing Hope', 'leader', 0, 'Rebel allies gain +20 Speed. Whenever an ally gains a buff, they recover 2% Health. Whenever an enemy is Exposed, Rebel allies gain 3% Turn Meter.', ['buff_faction', 'Exposed'], []),
      makeAbility('luke_force_unique', 'The Force Awakens', 'unique', 0, 'Whenever Luke evades an attack, gain +5% Offense (stacking, max 10 stacks). Whenever an ally falls below 50% HP, gain Retribution. If Old Ben is active, Luke gains Foresight at start.', ['counter_passive', 'Retribution', 'Foresight'], [])
    ],
    'Rebel',
    8700,
    'Hybrid attacker-support force training',
    { speed: 135, offense: 3500 }
  ),

  // --- Honor Guard Faction ---
  createCharacter(
    'captain_antilles',
    'Captain Antilles',
    'Tank / Strategist',
    ['Honor Guard', 'Rebel Alliance'],
    'Tantive IV captain who commands Hold the Corridor defense and absorbs damage for Leia.',
    [
      makeAbility('antilles_basic', 'Defensive Fire', 'basic', 0, 'Deal Physical Damage. Grant weakest ally 5% Protection Up.', ['damage', 'protection_up', 'Protection Up'], ['offensive']),
      makeAbility('antilles_special_1', 'Hold the Corridor', 'special', 3, 'Gain Taunt and Defense Up (2 turns). All Honor Guard allies gain Tenacity Up (2 turns).', ['taunt', 'buff_all', 'Defense Up', 'Tenacity Up', 'Taunt'], ['defensive']),
      makeAbility('antilles_special_2', 'Evacuation Formation', 'special', 4, 'Dispel debuffs from target ally. That ally gains Stealth and Speed Up (2 turns). Captain Antilles gains Taunt.', ['cleanse', 'stealth', 'taunt', 'Speed Up', 'Stealth', 'Taunt'], ['defensive']),
      makeAbility('antilles_unique', 'Loyal to the End', 'unique', 0, 'Whenever allies fall below 50% HP, Antilles recovers 5% Protection. If Leia is attacked, Antilles assists for reduced damage. Once per battle, if Leia would fall below 1% HP, prevent defeat, Antilles loses 30% HP, and Leia gains 25% Protection Up.', ['guard_leia', 'rescue_passive', 'Protection Up'], [])
    ],
    'Honor Guard',
    8200,
    'Devoted Leia bodyguard tank',
    { speed: 126, hp: 51000, protection: 44000 }
  ),

  createCharacter(
    'alderaan_guard',
    'Alderaanian Honor Guard',
    'Tank / Support',
    ['Honor Guard', 'Rebel Alliance'],
    'Royal palace guard who shares protection buffs and coordinates shielding structures.',
    [
      makeAbility('alder_basic', 'Ceremonial Pike Strike', 'basic', 0, 'Deal Physical Damage. Inflict Offense Down (1 turn).', ['damage', 'offense_down', 'Offense Down'], ['offensive']),
      makeAbility('alder_special_1', 'Royal Protection', 'special', 3, 'Target ally gains 20% Protection Up and Defense Up (2 turns). If target is Leia, Honor Guard also gains Taunt.', ['protection_up', 'taunt', 'Defense Up', 'Taunt', 'Protection Up'], ['defensive']),
      makeAbility('alder_special_2', 'Shield Wall Advance', 'special', 4, 'Honor Guard allies gain Defense Up and Tenacity Up (2 turns). All enemies lose 5% Turn Meter.', ['buff_all', 'turn_meter_reduction_aoe', 'Defense Up', 'Tenacity Up'], ['defensive']),
      makeAbility('alder_unique', 'Stand Before the Queen', 'unique', 0, 'Whenever allies are critically hit, gain 5% Turn Meter. If Leia is targeted, gain Retribution. While Taunting, allies gain +20% Defense.', ['passive_reaction', 'Retribution', 'Taunt'], [])
    ],
    'Honor Guard',
    8000,
    'Royal defensive tank support',
    { speed: 122, hp: 53000, protection: 48000 }
  ),

  createCharacter(
    'rebel_sentinel',
    'Rebel Honor Sentinel',
    'Attacker / Tank',
    ['Honor Guard', 'Rebel Alliance'],
    'Frontline combat expert who counterattacks with Retribution and extra double-strike blasts.',
    [
      makeAbility('sentinel_basic', 'Retaliation Burst', 'basic', 0, 'Deal Physical Damage. If Sentinel has Retribution, attack again for 50% reduced damage.', ['damage', 'double_strike', 'Retribution'], ['offensive']),
      makeAbility('sentinel_special_1', 'Rebel Counteroffensive', 'special', 3, 'Gain Retribution and Offense Up (2 turns).', ['retribution', 'offense_up', 'Offense Up', 'Retribution'], ['defensive', 'offensive']),
      makeAbility('sentinel_special_2', 'Frontline Collapse', 'special', 4, 'Deal Physical Damage to all enemies. Enemies with debuffs lose 5% Turn Meter.', ['damage_aoe', 'turn_meter_reduction'], ['offensive']),
      makeAbility('sentinel_unique', 'Veteran of the Rebellion', 'unique', 0, 'Whenever allies are attacked, Sentinel gains +2% Offense (stacking). Whenever allies are debuffed, gain 3% Turn Meter. Counterattacks restore 2% Protection.', ['counter_passive'], [])
    ],
    'Honor Guard',
    8100,
    'Aggressive counter brawler',
    { speed: 128, offense: 3400 }
  ),

  createCharacter(
    'winter',
    'Winter',
    'Support / Saboteur',
    ['Honor Guard', 'Rebel Alliance'],
    'Espionage operative who leaks enemy details and shields Princess Leia from control blocks.',
    [
      makeAbility('winter_basic', 'Silent Sidearm', 'basic', 0, 'Deal Special Damage. 30% chance to inflict Buff Immunity (1 turn).', ['damage', 'buff_immunity', 'Buff Immunity'], ['offensive']),
      makeAbility('winter_special_1', 'Intelligence Leak', 'special', 3, 'Remove 10% Turn Meter from all enemies. Expose target enemy for 1 turn.', ['turn_meter_reduction_aoe', 'exposed', 'Exposed'], ['debuff']),
      makeAbility('winter_special_2', 'Emergency Extraction', 'special', 4, 'Dispel debuffs from target ally. Grant Stealth and Inspired (2 turns).', ['cleanse', 'stealth', 'inspired', 'Stealth', 'Inspired'], ['defensive']),
      makeAbility('winter_unique', 'Covert Protection', 'unique', 0, 'Whenever enemies inflict debuffs, Winter gains 5% Turn Meter. Whenever allies gain Inspired, recover 3% Protection. Leia is immune to Ability Block and Fear while Winter is active.', ['passive_intelligence', 'Ability Block', 'Inspired', 'Fear'], [])
    ],
    'Honor Guard',
    8300,
    'Infiltration intellectual support',
    { speed: 138 }
  ),

  createCharacter(
    'mon_mothma',
    'Mon Mothma',
    'Leader / Support / Journey Character',
    ['Honor Guard', 'Rebel Alliance'],
    'The political chief who drives Rebel coordination, healing, and unified inspired templates.',
    [
      makeAbility('mothma_basic', 'Diplomatic Directive', 'basic', 0, 'Deal Special Damage. Lowest Health ally recovers 5% Protection.', ['damage', 'protection_recovery'], ['offensive', 'heal']),
      makeAbility('mothma_special_1', 'Alliance Coordination', 'special', 3, 'Call random Rebel ally to assist. All allies gain Speed Up (2 turns).', ['assist', 'speed_up', 'Speed Up'], ['assist']),
      makeAbility('mothma_special_2', 'Unified Resistance', 'special', 4, 'Honor Guard allies recover 15% Health and 15% Protection. Grant them Inspired (2 turns).', ['heal_all', 'inspired', 'Inspired'], ['heal']),
      makeAbility('mothma_leader', 'Voice of the Rebellion', 'leader', 0, 'Rebel allies gain +20 Speed. Whenever allies assist, recover 2% Protection. Inspired allies gain +15% Tenacity. Gain 2% Turn Meter when debuffs are dispelled. Rebel allies resist TM reduction while Inspired.', ['buff_faction', 'Inspired'], []),
      makeAbility('mothma_unique', 'Alliance Chancellor', 'unique', 0, 'Whenever allies fall below 50% HP, gain 5% Turn Meter. Whenever allies recover Protection, Mon Mothma gains 2% Ultimate Charge. Once per battle, if an ally would be defeated: prevent defeat, recover 20% Health, and gain Inspired (2 turns).', ['rescue_passive', 'Inspired'], [])
    ],
    'Honor Guard',
    9200,
    'Eminent political coordination leader',
    { speed: 133, hp: 47000, protection: 39000 }
  ),

  createCharacter(
    'leia_gl',
    'Leia Organa',
    'Leader / Support / Strategist / Galactic Legend',
    ['Honor Guard', 'Rebel Alliance'],
    'Ultimate Galactic Legend who unites Rebel and Honor Guard circles, providing complete protection, revives, and massive assist chains.',
    [
      makeAbility('leia_gl_basic', 'Diplomatic Precision', 'basic', 0, 'Deal Special Damage. Random Rebel ally gains Inspired (2 turns). If ally is already Inspired, recover 3% Protection.', ['damage', 'inspired', 'protection_recovery', 'Inspired'], ['offensive', 'heal']),
      makeAbility('leia_gl_special_1', 'Rally the Alliance', 'special', 3, 'All Rebel allies gain Offense Up, Tenacity Up, and Inspired (2 turns). Dispel Daze and Ability Block from all allies.', ['buff_all', 'cleanse_all', 'Ability Block', 'Daze', 'Tenacity Up', 'Offense Up', 'Inspired'], ['defensive', 'buff']),
      makeAbility('leia_gl_special_2', 'Coordinated Assault', 'special', 4, 'Call all Rebel allies to assist dealing 30% reduced damage. Enemies lose 5% Turn Meter per assist received. Remove Intimidated, Bribed, or Feared before damage.', ['assist_all', 'turn_meter_reduction_aoe', 'debuff_dispel', 'Bribed', 'Intimidated', 'Fear'], ['offensive']),
      makeAbility('leia_gl_special_3', 'Never Surrender', 'special', 5, 'All allies recover 20% Health and 20% Protection. Grant Defense Up and 15% Protection Up (2 turns). Revive one defeated Rebel ally at 50% HP and Protection.', ['heal_all', 'revive', 'Defense Up', 'Protection Up'], ['heal']),
      makeAbility('leia_gl_leader', 'Spark of Rebellion', 'leader', 0, 'Rebel allies gain +30 Speed and +20% Max Protection. Whenever Rebel allies assist, recover 2% Protection. Rebel allies cannot have Turn Meter reduced while Inspired. Whenever enemies inflict debuffs, weakest Rebel recovers 3% Protection. Enemies cannot gain bonus Turn Meter while attacking Inspired allies. GL Bonus: Rebels are immune to Fear while Inspired and cannot be instantly defeated.', ['buff_gl_faction', 'Inspired', 'Fear'], []),
      makeAbility('leia_gl_unique_1', 'Rebellion United', 'unique', 0, 'At the start of battle, all Rebel allies gain Inspired (2 turns). Whenever allies fall below 50% Health, Leia gains 5% Ultimate Charge. Whenever Rebel allies recover Protection, Leia gains 2% Turn Meter.', ['passive_gl', 'Inspired'], []),
      makeAbility('leia_gl_unique_2', 'Hope of the Galaxy', 'unique', 0, 'Leia is immune to Ability Block, Fear, and Cooldown increases. Once per battle, if Leia falls below 40% Health: dispel all debuffs from allies, recover 30% Protection, and immediately use Rally the Alliance. Defeated allies grant survivors Offense/Speed Up (2 turns).', ['passive_gl_emergency', 'Ability Block', 'Speed Up', 'Fear'], []),
      makeAbility('leia_gl_ultimate', 'The Rebellion Rises', 'ultimate', 0, 'Activate at 100% Ultimate Charge. Leia inspires the entire battlefield, applying Inspired, Tenacity Up, and 30% Protection Up on all allies, and deals massive true damage to all enemies, bypassing defense. Heals all allies to 100%.', ['Tenacity Up', 'Protection Up', 'Inspired'], ['ultimate'], 100)
    ],
    'Honor Guard',
    15000,
    'Ultimate Rebel team engine and recovery',
    { speed: 156, hp: 85000, protection: 65000, defense: 55 }
  )
];