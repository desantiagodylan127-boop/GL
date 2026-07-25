import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const REMNANT_MANDY_CARTEL_CHARACTERS: Character[] = [
  // --- Imperial Remnant (Standard) ---
  createCharacter(
    'gideon',
    'Moff Gideon',
    'Strategist / Tank',
    ['Galactic Empire', 'Imperial Remnant', 'Journey Character'],
    'Calculating commander who coordinates massive team assists, trades low-health allies for survival, and triggers undispellable taunts.',
    [
      makeAbility('gideon_basic', 'Cripple Shot', 'basic', 0, 'Deal Physical Damage. Inflict Fear (1 turn). If target already had a debuff: Remove 10% Turn Meter.', ['damage', 'Fear', 'turn_meter_reduction'], ['offensive']),
      makeAbility('gideon_special_1', 'Explosive Withdraw', 'special', 5, 'Restore Gideon to 100% Health and Protection. Gain Defense Up (2 turns), Tenacity Up (2 turns). Imperial Remnant allies assist dealing 60% reduced damage. Defeat a random non-Droid Imperial Remnant ally. Gideon loses Taunt for 2 turns.', ['heal_self', 'assist_all', 'sacrifice', 'Defense Up', 'Tenacity Up'], ['defensive']),
      makeAbility('gideon_leader', 'Pacifier Protocol', 'leader', 0, 'Imperial Remnant allies gain 15% Potency and 15% Defense. Imperial Remnant allies gain Pacifier. Whenever an Imperial Remnant ally takes damage: Gideon gains 5% Turn Meter (limit once per turn per ally).', ['buff_faction', 'turn_meter_gain'], []),
      makeAbility('gideon_unique', 'Remnant Discipline', 'unique', 0, 'Imperial Remnant allies gain 10% Defense. Whenever an Imperial Remnant ally inflicts a debuff: Gideon recovers 3% Protection. At the start of battle: Gain Taunt. This Taunt cannot be dispelled. If Gideon loses Taunt through Explosive Withdraw: Regain Taunt after 2 turns.', ['Taunt', 'protection_recovery'], [])
    ],
    'Imperial Remnant',
    8500,
    'Aggressive coordination and sacrifice',
    { speed: 132, hp: 50000, protection: 40000 }
  ),

  createCharacter(
    'range_trooper',
    'Range Trooper',
    'Support / Saboteur',
    ['Galactic Empire', 'Imperial Remnant', 'Imperial Trooper'],
    'Tactical enforcer who marks targets and helps cycle turn meters for Imperial troopers.',
    [
      makeAbility('range_basic', 'Suppressive Shot', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Speed Down (1 turn).', ['damage', 'Speed Down'], ['offensive']),
      makeAbility('range_special_1', 'Target Marking', 'special', 3, 'Inflict Marked (2 turns). Imperial Remnant allies deal 20% additional damage to Marked enemies.', ['Marked'], ['debuff']),
      makeAbility('range_unique', 'Squad Coordination', 'unique', 0, 'Whenever an Imperial Remnant ally uses a Basic Ability: 20% chance they gain 5% Turn Meter. Range Trooper gains 5% Turn Meter. Maximum 25% Turn Meter gained per round from this effect. Whenever a Marked enemy is attacked: Range Trooper gains 5% Turn Meter.', ['turn_meter_gain', 'Marked'], [])
    ],
    'Imperial Remnant',
    8000,
    'Deals marked and speeds coordination',
    { speed: 128 }
  ),

  createCharacter(
    'dark_trooper',
    'Dark Trooper',
    'Attacker',
    ['Galactic Empire', 'Imperial Remnant', 'Imperial Trooper', 'Droid'],
    'Heavily armored mechanical soldier who grows stronger as coworkers collapse.',
    [
      makeAbility('dark_basic', 'Counter Fire', 'basic', 0, 'Deal Physical Damage. If Dark Trooper was damaged since his last turn: Deal 25% additional damage.', ['damage'], ['offensive']),
      makeAbility('dark_special_1', 'Overload Burst', 'special', 3, 'Deal Heavy Physical Damage. Deal 25% additional damage if an Imperial Remnant ally has been defeated this battle. Deal 25% additional damage if target is below 50% Health.', ['damage_heavy'], ['offensive']),
      makeAbility('dark_unique', 'Combat Adaptation', 'unique', 0, 'Gain 10% Offense for each Imperial Remnant ally defeated this battle. The first time Dark Trooper falls below 50% Health: Gain Offense Up (2 turns). Whenever an Imperial Remnant ally is defeated: Gain 10% Turn Meter.', ['Offense Up', 'turn_meter_gain'], [])
    ],
    'Imperial Remnant',
    8400,
    'Unstoppable high damage finisher',
    { speed: 122, offense: 4200, hp: 45000, protection: 45000 }
  ),

  createCharacter(
    'incinerator_trooper',
    'Incinerator Trooper',
    'Attacker / Saboteur',
    ['Galactic Empire', 'Imperial Remnant', 'Imperial Trooper'],
    'Flame-thrower specialist who deals explosive damage-over-time and curbs enemy offensive speed.',
    [
      makeAbility('incin_basic', 'Flame Tap', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Burn (1 turn).', ['damage', 'Burning'], ['offensive']),
      makeAbility('incin_special_1', 'Fire Zone', 'special', 4, 'Deal Physical Damage to all enemies. Inflict Burn (2 turns). Burning enemies gain Speed Down (1 turn).', ['damage_aoe', 'Speed Down', 'Burning'], ['offensive']),
      makeAbility('incin_unique', 'Controlled Burn', 'unique', 0, 'Burning enemies deal 10% less damage. Burning enemies lose 10% Speed. Whenever Incinerator Trooper is attacked: 50% chance to inflict Burn on the attacker. Enemies with Burn cannot gain Stealth.', ['Burning'], [])
    ],
    'Imperial Remnant',
    8100,
    'Explosive fire damage and debuffs',
    { speed: 125 }
  ),

  createCharacter(
    'hazard_trooper',
    'Hazard Trooper',
    'Support / Saboteur',
    ['Galactic Empire', 'Imperial Remnant', 'Imperial Trooper'],
    'Battlefield destabilizer who delays enemy ability cooldowns and counter-strikes debuffed targets.',
    [
      makeAbility('hazard_basic', 'Suppression Fire', 'basic', 0, 'Deal Physical Damage. Inflict Speed Down (1 turn).', ['damage', 'Speed Down'], ['offensive']),
      makeAbility('hazard_special_1', 'Hazard Field', 'special', 4, 'Inflict Speed Down (2 turns) on all enemies. Increase the cooldown of their next ability by 1.', ['Speed Down', 'cooldown_increase_aoe'], ['debuff']),
      makeAbility('hazard_unique', 'Combat Interference Field', 'unique', 0, 'Whenever an enemy gains Speed Down: Hazard Trooper performs a bonus attack against that enemy. Whenever an enemy with Speed Down uses a Special Ability: They lose 10% Turn Meter. Whenever an Imperial Remnant ally is inflicted with a debuff: Hazard Trooper gains Defense Up (1 turn).', ['bonus_attack', 'turn_meter_reduction', 'Defense Up', 'Speed Down'], [])
    ],
    'Imperial Remnant',
    8200,
    'Pacing disruption and slow effects',
    { speed: 120 }
  ),

  // --- Avalanche Remnant (Frozen Attrition Faction) ---
  createCharacter(
    'commander_voren',
    'Commander Voren',
    'Leader / Tank',
    ['Galactic Empire', 'Imperial Remnant', 'Imperial Trooper', 'Avalanche Remnant'],
    'Outer Rim commander who inflicts Frostbite, taunts with Whiteout, and slowly freezing out squads.',
    [
      makeAbility('voren_basic', 'Glacial Suppression Fire', 'basic', 0, 'Deal Physical Damage. Inflict Frostbite (2 turns). If target already has Frostbite: Remove 5% Turn Meter.', ['damage', 'Frostbite', 'turn_meter_reduction'], ['offensive']),
      makeAbility('voren_special_1', 'Frozen Frontline', 'special', 3, 'Gain Taunt (2 turns) and Whiteout (2 turns). All Avalanche Remnant allies gain Defense Up (2 turns). Frostbitten enemies deal 20% less damage for 1 turn.', ['Taunt', 'Whiteout', 'Defense Up'], ['defensive']),
      makeAbility('voren_special_2', 'Blizzard Offensive', 'special', 4, 'Deal Physical Damage to all enemies. Inflict Frostbite (2 turns). Enemies already suffering Frostbite gain Speed Down (2 turns).', ['damage_aoe', 'Frostbite', 'Speed Down'], ['offensive']),
      makeAbility('voren_leader', 'Remnant Survival Doctrine', 'leader', 0, 'Avalanche Remnant allies gain 30% Defense and 20% Max Protection. Whenever an enemy gains Frostbite, Avalanche Remnant allies recover 2% Protection. Whenever a Frostbitten enemy attacks, lose 3% Turn Meter. While any Avalanche Remnant ally has Whiteout, all Avalanche Remnant allies gain 15% Defense.', ['buff_faction', 'Frostbite', 'Whiteout'], []),
      makeAbility('voren_unique', 'Endless Winter Campaign', 'unique', 0, 'Whenever an Avalanche Remnant ally is critically hit, inflict Frostbite (1 turn) on the attacker. Whenever a Frostbitten enemy falls below 50% Health, Voren gains Retribution and Tenacity Up (1 turn).', ['Frostbite', 'Retribution', 'Tenacity Up'], [])
    ],
    'Imperial Remnant',
    8600,
    'Sustained frozen attrition tanking',
    { speed: 124, hp: 53000, protection: 46000 }
  ),

  createCharacter(
    'captain_rime',
    'Captain Rime',
    'Strategist / Support',
    ['Galactic Empire', 'Imperial Remnant', 'Avalanche Remnant'],
    'Logistics officer who recovers Protection and drains enemy Turn Meters during Whiteout phases.',
    [
      makeAbility('rime_basic', 'Precision Ice Volley', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Speed Down (2 turns).', ['damage', 'Speed Down'], ['offensive']),
      makeAbility('rime_special_1', 'Supply Line Stabilization', 'special', 3, 'Avalanche Remnant allies recover 10% Protection. Grant Whiteout (2 turns) to the weakest ally.', ['protection_recovery', 'Whiteout'], ['heal']),
      makeAbility('rime_special_2', 'Whiteout Maneuver', 'special', 4, 'Remove 15% Turn Meter from all Frostbitten enemies. Avalanche Remnant allies gain Speed Up (2 turns).', ['turn_meter_reduction_aoe', 'Speed Up'], ['debuff']),
      makeAbility('rime_unique', 'Frozen Logistics', 'unique', 0, 'Whenever an enemy loses Turn Meter, Avalanche Remnant allies recover 2% Protection. Whenever Whiteout expires on an ally, Captain Rime gains 5% Turn Meter. Whenever an enemy reaches 3 stacks of Frostbite, Captain Rime gains 10% Turn Meter.', ['protection_recovery', 'Whiteout', 'Frostbite'], [])
    ],
    'Imperial Remnant',
    8100,
    'Support attrition logistics',
    { speed: 129 }
  ),

  createCharacter(
    'glaze',
    'Glaze',
    'Attacker / Saboteur',
    ['Galactic Empire', 'Imperial Remnant', 'Avalanche Remnant'],
    'Snowtrooper sniper who hunts down Frostbitten targets, bypassing defenses completely.',
    [
      makeAbility('glaze_basic', 'Cryo Rifle Shot', 'basic', 0, 'Deal Physical Damage. Deal 25% additional damage to Frostbitten enemies.', ['damage'], ['offensive']),
      makeAbility('glaze_special_1', 'Icebreaker Round', 'special', 3, 'Deal Massive Physical Damage. If target has Frostbite: Ignore 25% Defense and inflict Exposed (1 turn).', ['damage_heavy', 'Exposed', 'Frostbite'], ['offensive']),
      makeAbility('glaze_special_2', 'Frozen Quarry', 'special', 4, 'Inflict Frostbite (2 turns) and Ability Block (2 turns). Gain Critical Damage Up (2 turns).', ['Ability Block', 'Frostbite', 'Critical Damage Up'], ['offensive']),
      makeAbility('glaze_unique', 'Winter Hunter', 'unique', 0, 'Whenever an enemy gains Frostbite, Glaze gains 5% Turn Meter. Whenever a Frostbitten enemy falls below 50% Health, gain Offense Up (2 turns). Whenever Glaze defeats an enemy, recover 50% Protection.', ['Frostbite', 'Offense Up'], [])
    ],
    'Imperial Remnant',
    8300,
    'Single-target freeze-breaking execution',
    { speed: 133, offense: 3600 }
  ),

  createCharacter(
    'hail',
    'Hail',
    'Tank / Attacker',
    ['Galactic Empire', 'Imperial Remnant', 'Avalanche Remnant'],
    'Armored brawler whose counterattacks actively spread Frostbite across opponents.',
    [
      makeAbility('hail_basic', 'Thermal Riot Strike', 'basic', 0, 'Deal Physical Damage. 50% chance to inflict Frostbite (1 turn).', ['damage', 'Frostbite'], ['offensive']),
      makeAbility('hail_special_1', 'Arctic Bulwark', 'special', 4, 'Gain Taunt (2 turns), Defense Up (2 turns), and Whiteout (2 turns). Counterattacks inflict Frostbite.', ['Taunt', 'Defense Up', 'Whiteout', 'Frostbite'], ['defensive']),
      makeAbility('hail_special_2', 'Avalanche Sweep', 'special', 5, 'Deal Physical Damage to all enemies. Enemies lose 5% Turn Meter. Frostbitten enemies lose an additional 5%.', ['damage_aoe', 'turn_meter_reduction_aoe', 'Frostbite'], ['offensive']),
      makeAbility('hail_unique', 'Frozen Armor Plating', 'unique', 0, 'Whenever Hail counterattacks: Recover 3% Protection. Whenever an enemy attacks an ally with Whiteout: Hail gains Retribution (1 turn). Whenever Hail inflicts Frostbite: Recover 5% Protection.', ['protection_recovery', 'Retribution', 'Whiteout', 'Frostbite'], [])
    ],
    'Imperial Remnant',
    8200,
    'Frontline counter-spreading tank',
    { speed: 119, hp: 55000, protection: 48000 }
  ),

  createCharacter(
    'frostburn',
    'Frostburn',
    'Attacker / Support',
    ['Galactic Empire', 'Imperial Remnant', 'Avalanche Remnant'],
    'Volatile flametrooper who consumes Frostbite to inflict Healing Immunity and high damage bursts.',
    [
      makeAbility('frostburn_basic', 'Thermal Purge Stream', 'basic', 0, 'Deal Special Damage. Deal additional damage to Frostbitten enemies.', ['damage', 'Frostbite'], ['offensive']),
      makeAbility('frostburn_special_1', 'Flash Melt Ignition', 'special', 3, 'Deal Special Damage to all enemies. Consume Frostbite from enemies. Inflict Healing Immunity (2 turns).', ['damage_aoe', 'Healing Immunity', 'Frostbite'], ['offensive']),
      makeAbility('frostburn_special_2', 'Sudden Thaw Collapse', 'special', 4, 'Consume all Frostbite from target enemy. Deal massive additional damage based on the remaining duration consumed.', ['true_damage', 'Frostbite'], ['offensive']),
      makeAbility('frostburn_unique', 'Temperature Shock', 'unique', 0, 'Whenever Frostbite is consumed: Frostburn gains 5% Turn Meter. Whenever an enemy gains Healing Immunity: Avalanche Remnant allies recover 2% Protection. Whenever Frostburn defeats an enemy: Reduce all cooldowns by 1.', ['turn_meter_gain', 'Healing Immunity', 'Frostbite', 'cooldown_reduction'], [])
    ],
    'Imperial Remnant',
    8200,
    'Explosive heat-melt attrition attacker',
    { speed: 126 }
  ),

  createCharacter(
    'thrawn_remnant',
    'Grand Admiral Thrawn',
    'Leader / Strategist',
    ['Galactic Empire', 'Journey Character'],
    'Legendary tactical genius who analyzes opponents, swaps turn meters, and coordinates full Empire squads.',
    [
      makeAbility('thrawn_basic', 'Calculated Strike', 'basic', 0, 'Deal Physical Damage. Inflict Analyze (2 turns). If target already had Analyze: Remove 10% Turn Meter.', ['damage', 'Analyze', 'turn_meter_reduction'], ['offensive']),
      makeAbility('thrawn_special_1', 'Tactical Reassignment', 'special', 3, 'Swap Turn Meter with target ally. Target ally gains: Offense Up (2 turns), Critical Chance Up (2 turns). If target ally is Galactic Empire: Reduce their cooldowns by 1.', ['swap_turn_meter', 'Offense Up', 'Critical Chance Up', 'cooldown_reduction'], ['assist']),
      makeAbility('thrawn_special_2', 'Encirclement Formation', 'special', 4, 'Call all Galactic Empire allies to assist dealing 40% reduced damage. Enemies with Analyze lose: 10% Turn Meter for each assist received.', ['assist_all', 'turn_meter_reduction', 'Analyze'], ['offensive']),
      makeAbility('thrawn_special_3', 'Art Of War', 'special', 5, 'Inflict Analyze (2 turns) on all enemies. Galactic Empire allies gain: Defense Up (2 turns), Tenacity Up (2 turns). Enemies with Frostbite cannot gain bonus Turn Meter for 1 turn.', ['Analyze', 'Defense Up', 'Tenacity Up', 'Frostbite'], ['debuff']),
      makeAbility('thrawn_leader', 'Master Of Attrition', 'leader', 0, 'Galactic Empire allies gain: 25 Speed, 20% Defense. Whenever an enemy loses Turn Meter: Galactic Empire allies recover 2% Protection. Galactic Empire allies attacking Analyzed enemies ignore 20% Defense. Analyze duration on enemies cannot be reduced.', ['buff_faction', 'Analyze', 'protection_recovery'], []),
      makeAbility('thrawn_unique', 'Flawless Prediction', 'unique', 0, 'Whenever an enemy attacks out of turn: Grand Admiral Thrawn gains 5% Turn Meter. Whenever a Galactic Empire ally critically hits an Analyzed enemy: Inflict Speed Down (1 turn). Whenever an enemy loses Turn Meter: Grand Admiral Thrawn gains 2% Offense (stacking, Max 50%). At the start of battle: Inflict Analyze on the enemy Leader for 2 turns.', ['turn_meter_gain', 'Speed Down', 'Analyze', 'Offense Up'], [])
    ],
    'Galactic Empire',
    9600,
    'Advanced strategic coordinate leadership',
    { speed: 144, hp: 50000, protection: 41000 }
  ),

  // --- Mandalorians ---

  createCharacter(
    'grogu',
    'Grogu',
    'Support / Saboteur',
    ['Jedi', 'Mandalorian'],
    'Force-sensitive child who heals, surges protections, and enjoys permanent damage immunity.',
    [
      makeAbility('grogu_basic', 'Force Flick', 'basic', 0, 'No damage. Dispels 1 random buff on target; heals random ally 5% HP.', ['cleanse_enemy', 'heal'], ['debuff']),
      makeAbility('grogu_special_1', 'Protective Surge', 'special', 3, 'Heal 50% Health on target ally (triggers Protection recovery if full). Grants Taunt.', ['heal', 'taunt', 'Taunt'], ['heal']),
      makeAbility('grogu_unique_1', 'Force Stability Field', 'unique', 0, 'Whenever an ally falls below 50% Health, they gain 10% Protection.', ['heal_passive'], []),
      makeAbility('grogu_unique_2', 'Neutral Presence', 'unique', 0, 'Grogu has permanent undispellable damage immunity. Retreats instantly if all allies die.', ['immunity_passive', 'Damage Immunity'], [])
    ],
    'Mandalorian',
    8600,
    'Universal support and clutch immunity',
    { speed: 126, hp: 35000, protection: 20000 }
  ),

  createCharacter(
    'bo_katan_exile',
    'Bo Katan (Exile)',
    'Attacker / Strategist',
    ['Mandalorian'],
    'Converts Mandalorian team counterattacks and defense into rapid offensive turns.',
    [
      makeAbility('bokatan_basic', 'Twin Blaster Burst', 'basic', 0, 'Deal Physical Damage. +15% damage if above 50% Health.', ['damage'], ['offensive']),
      makeAbility('bokatan_special_1', 'Flanking Maneuver', 'special', 3, 'Deal Physical Damage. Grant Mandalorian allies Offense Up (2 turns). Call random assist.', ['damage', 'buff_all', 'assist', 'Offense Up'], ['offensive']),
      makeAbility('bokatan_unique', 'Adaptive Warfare', 'unique', 0, 'Bo-Katan gains +3% Turn Meter whenever a Mandalorian ally counters. Counterattacks deal +10% damage.', ['passive_boost'], [])
    ],
    'Mandalorian',
    8300,
    'Counter amplification attacker',
    { speed: 134 }
  ),

  createCharacter(
    'ig12',
    'IG-12',
    'Tank / Attacker',
    ['Droid', 'Bounty Hunter', 'Scoundrel', 'Mandalorian'],
    'Durable mech unit that taunts, counters automatically with AoE blaster sweeps, and resists stun.',
    [
      makeAbility('ig_basic', 'Twin Blaster Sweep', 'basic', 0, 'Deal Physical Damage to all enemies.', ['damage_aoe'], ['offensive']),
      makeAbility('ig_special_1', 'Beskar War Protocol', 'special', 4, 'IG-12 gains Taunt (2 turns) and Defense Up. Grants random ally Retribution (1 turn).', ['taunt', 'retribution', 'Defense Up', 'Retribution', 'Taunt'], ['defensive']),
      makeAbility('ig_unique', 'Beskar Counter System', 'unique', 0, 'IG-12 counterattacks automatically whenever damaged (using AoE basic). Immune to Stun.', ['counter_aoe', 'immunity_stun', 'Stun'], [])
    ],
    'Mandalorian',
    8200,
    'AoE retaliatory tank',
    { hp: 55000, protection: 50000, defense: 54 }
  ),

  // --- Hutt Cartel ---
  createCharacter(
    'bib_fortuna',
    'Bib Fortuna',
    'Leader / Strategist',
    ['Hutt Cartel'],
    'Jabba’s majordomo who rules behind the scenes with Bribes, Contracts, and betrayal.',
    [
      makeAbility('bib_basic', 'Covert Negotiations', 'basic', 0, 'Deal Special Damage. 50% chance to inflict Bribed (2 turns).', ['damage', 'bribed', 'Bribed'], ['offensive']),
      makeAbility('bib_special_1', 'Cartel Favor', 'special', 3, 'Target ally recovers 15% Protection and gains Critical Chance Up (2 turns). Hutt Cartel gains TM.', ['protection_recovery', 'turn_meter_gain', 'Critical Chance Up'], ['heal']),
      makeAbility('bib_special_2', 'Paid Betrayal', 'special', 4, 'Inflict Bribed and Offense Down (2 turns). If already Bribed, stun target.', ['debuff', 'stun', 'Offense Down', 'Stun', 'Bribed'], ['debuff']),
      makeAbility('bib_leader', 'Hutt Cartel Operations', 'leader', 0, 'Contract: Inflict Bribed 10 times. Reward: Hutt Cartel gain +20 Speed and recover 10% Protection when enemies gain debuffs. Bribed enemies cannot counter.', ['contract_leader', 'Bribed'], []),
      makeAbility('bib_unique', 'Survival Through Profit', 'unique', 0, 'Whenever Bribed enemies attack, Bib gains 5% Turn Meter. On Cartel recovery, Bib recovers 2% Health. Starts with Bribed on strongest enemy.', ['passive_gain', 'Bribed'], [])
    ],
    'Hutt Cartel',
    8300,
    'Underworld influence and bribes',
    { speed: 131 }
  ),

  createCharacter(
    'gamorrean_guard_cartel',
    'Gamorrean Guard',
    'Tank',
    ['Hutt Cartel'],
    'Lump of muscle who Taunts, counterattacks, and safeguards Cartel members under pressure.',
    [
      makeAbility('gam_basic', 'Heavy Cleaver Strike', 'basic', 0, 'Deal Physical Damage. 30% chance to inflict Daze (1 turn).', ['damage', 'daze', 'Daze'], ['offensive']),
      makeAbility('gam_special_1', 'Bodyguard Protocol', 'special', 3, 'Gain Taunt and Defense Up (2 turns). Other Cartel members gain 10% Protection Up.', ['taunt', 'protection_up', 'Defense Up', 'Taunt', 'Protection Up'], ['defensive']),
      makeAbility('gam_special_2', 'Brutal Retaliation', 'special', 4, 'Deal Physical Damage to all enemies. Bribed enemies deal less damage.', ['damage_aoe', 'Bribed'], ['offensive']),
      makeAbility('gam_unique', 'Palace Enforcer', 'unique', 0, 'Whenever Cartel allies drop below 50% HP, gain Taunt (1 turn). Gains 5% Protection on crit hits.', ['taunt_passive', 'Taunt'], [])
    ],
    'Hutt Cartel',
    7600,
    'Underworld frontline tank',
    { hp: 58000, protection: 46000, defense: 59 }
  ),

  createCharacter(
    'greedo',
    'Greedo',
    'Attacker / Saboteur',
    ['Hutt Cartel', 'Bounty Hunter'],
    'Reckless shooter who triggers high-risk double blasts and sprays multiple targets.',
    [
      makeAbility('greedo_basic', 'Unpredictable Barrage', 'basic', 0, 'Deal Physical Damage. 50% chance to attack again (recursively for reduced damage).', ['damage', 'double_strike'], ['offensive']),
      makeAbility('greedo_special_1', 'Cheap Shot', 'special', 3, 'Deal Physical Damage. Inflict Exposed and Healing Immunity (2 turns).', ['damage', 'exposed', 'healing_immunity', 'Exposed', 'Healing Immunity'], ['offensive']),
      makeAbility('greedo_special_2', 'Trigger Happy Frenzy', 'special', 4, 'Attack random enemies 5 times. Bribed targets are automatically critically hit.', ['damage_frenzy', 'Bribed'], ['offensive']),
      makeAbility('greedo_unique', 'Paid in Advance', 'unique', 0, 'Whenever enemies fall below 50% HP, Greedo gains Critical Chance Up (2 turns). Gains 2% TM on crits.', ['crit_boost', 'Critical Chance Up'], [])
    ],
    'Hutt Cartel',
    8000,
    'Chaotic burst shooter',
    { speed: 135, offense: 3500, critChance: 0.45 }
  ),

  createCharacter(
    'fennec_shand',
    'Fennec Shand',
    'Attacker / Saboteur',
    ['Hutt Cartel', 'Bounty Hunter'],
    'Marksman who ignores defense and strips protection layers off taunting tanks.',
    [
      makeAbility('fennec_basic', 'Precision Rifle Shot', 'basic', 0, 'Deal Physical Damage, ignoring 15% Defense.', ['damage_heavy'], ['offensive']),
      makeAbility('fennec_special_1', 'Ruthless Elimination', 'special', 3, 'Deal Physical Damage twice. Bypasses protection entirely if target has Taunt.', ['double_strike', 'bypass', 'Taunt'], ['offensive']),
      makeAbility('fennec_special_2', 'Scoped Execution', 'special', 4, 'Deal massive physical damage. Inflict Healing Immunity and Exposed (2 turns).', ['damage_heavy', 'exposed', 'healing_immunity', 'Exposed', 'Healing Immunity'], ['offensive']),
      makeAbility('fennec_unique', 'Veteran Assassin', 'unique', 0, 'Whenever enemies gain buffs, Fennec gains 5% TM. Defeating enemies reduces cooldowns by 1.', ['cooldown_reduction'], [])
    ],
    'Hutt Cartel',
    8400,
    'Sniper tank-buster pressure',
    { speed: 137 }
  ),

  createCharacter(
    'boba_fett_daimyo',
    'Boba Fett (Daimyo)',
    'Leader / Attacker / Journey Character',
    ['Hutt Cartel', 'Bounty Hunter'],
    'Journey Leader who rules Mos Espa, enabling massive physical assaults, burning rockets, and Contract payout boosts.',
    [
      makeAbility('boba_basic', 'Daimyo’s Shot', 'basic', 0, 'Deal Physical Damage. Inflict Defense Down (2 turns).', ['damage', 'defense_down', 'Defense Down'], ['offensive']),
      makeAbility('boba_special_1', 'Rule Through Respect', 'special', 3, 'Hutt Cartel allies gain Offense Up and Tenacity Up (2 turns). Recover 10% Protection.', ['buff_all', 'protection_recovery', 'Tenacity Up', 'Offense Up'], ['defensive', 'buff']),
      makeAbility('boba_special_2', 'Coordinated Elimination', 'special', 4, 'Call all Hutt Cartel allies to assist. Bribed targets cannot evade.', ['assist_all', 'Bribed'], ['offensive']),
      makeAbility('boba_special_3', 'Knee Rocket Barrage', 'special', 5, 'Deal Physical Damage to all enemies. Inflict Burning and Healing Immunity (2 turns).', ['damage_aoe', 'burn', 'healing_immunity', 'Healing Immunity', 'Burning'], ['offensive']),
      makeAbility('boba_leader', 'Daimyo of Mos Espa', 'leader', 0, 'Contract: Defeat 3 debuffed enemies. Reward: Hutt Cartel gain +25% Offense and recover Protection when enemies fall under 50% HP. Enemies suffer bonus damages if Bribed. Bribed targets cannot gain Turn Meter.', ['contract_leader', 'Bribed'], []),
      makeAbility('boba_unique', 'Criminal Empire', 'unique', 0, 'Whenever Cartel allies critically hit, Boba gains 3% Turn Meter. On emergency health (under 40%), dispel debuffs, gain Damage Immunity (1 turn) and trigger Coordinated Elimination.', ['passive_rescue', 'Damage Immunity'], [])
    ],
    'Hutt Cartel',
    9600,
    'Underworld sovereign offensive leadership',
    { speed: 143, offense: 3850, hp: 49000, protection: 41000 }
  ),

  createCharacter(
    'jabba',
    'Jabba the Hutt',
    'Leader / Tank / Strategist / Galactic Legend',
    ['Hutt Cartel'],
    'The ultimate supreme underworld Galactic Legend, corrupting targets through Bribes and Intimidation, accelerating contracts to execute targets inside the rancor pit.',
    [
      makeAbility('jabba_basic', 'Mocking Laughter', 'basic', 0, 'Deal Special Damage. Inflict Intimidated (2 turns). If already Bribed, remove 5% Turn Meter; Jabba recovers 3% Protection.', ['damage', 'intimidated', 'protection_recovery', 'Bribed', 'Intimidated'], ['offensive', 'heal']),
      makeAbility('jabba_special_1', 'Feed Them to the Pit', 'special', 3, 'Target gains Marked, Healing Immunity, and Offense Down (2 turns). Chosen ally gains Offense/Crit Chance Up. If target is Intimidated, stun them.', ['marked', 'debuff', 'stun', 'Offense Down', 'Healing Immunity', 'Stun', 'Intimidated', 'Marked'], ['debuff']),
      makeAbility('jabba_special_2', 'Cartel Tribute', 'special', 4, 'Hutt Cartel allies recover 20% Protection and 10% Health. Gain Tenacity and Defense Up. Bribed lose 10% TM; Intimidated lose additional 5%.', ['heal_all', 'turn_meter_reduction_aoe', 'Bribed', 'Intimidated', 'Defense Up'], ['heal']),
      makeAbility('jabba_special_3', 'Criminal Empire Unleashed', 'special', 5, 'Deal Special Damage to all enemies. Inflict Bribed and Intimidated (2 turns). Bribed/Intimidated lose 15% TM and cannot counter. Allies gain Retribution/Speed Up.', ['damage_aoe', 'bribed', 'intimidated', 'turn_meter_reduction_aoe', 'retribution_all', 'Bribed', 'Intimidated', 'Speed Up', 'Retribution'], ['offensive']),
      makeAbility('jabba_leader', 'Supreme Crime Lord', 'leader', 0, 'Contract: Inflict Bribed/Intimidated 20 times. Reward: Hutt Cartel gain +35% Max Health and +25 Speed. Allies recover 2% Protection when enemies gain debuffs. Bribed cannot counter; Intimidated cannot gain bonus Turn Meter. Contract fills 50% faster.', ['contract_gl', 'Bribed', 'Intimidated'], []),
      makeAbility('jabba_unique_1', 'Palace of Fear', 'unique', 0, 'Start: strongest enemy gains Intimidated. If enemies resist, apply Bribed. Whenever allies recover Protection, Jabba gains 2% Ultimate Charge. Bribed attacks grant Jabba 3% TM.', ['passive_gl', 'Bribed', 'Intimidated'], []),
      makeAbility('jabba_unique_2', 'The Galaxy Pays Tribute', 'unique', 0, 'Jabba is immune to Turn Meter reduction, Fear, and Stun. Jabba cannot be critically hit. On under 60% HP, dispel self, gain 20% Protection Up and Taunt weakest target. Under 30%, trigger Criminal Empire Unleashed/Damage Immunity.', ['passive_gl_emergency', 'Stun', 'Taunt', 'Protection Up', 'Damage Immunity', 'Fear'], []),
      makeAbility('jabba_ultimate', 'Execute Them All', 'ultimate', 0, 'At 100% Ultimate Charge, direct all Hutt Cartel allies to assist. Inflict Intimidated, Healing Immunity, and Ability Block (2 turns) on all. Targets under 40% Health take massive True damage (kills do not allow revive). Gains permanent Taunt immunity.', ['Ability Block', 'Healing Immunity', 'Intimidated', 'Taunt'], ['ultimate'], 100)
    ],
    'Hutt Cartel',
    15000,
    'Ultimate criminal empire execution',
    { speed: 150, hp: 90000, protection: 65000, defense: 50 }
  )
];