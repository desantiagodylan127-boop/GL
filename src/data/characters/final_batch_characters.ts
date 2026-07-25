import { Character } from '../../types';

export const FINAL_BATCH_CHARACTERS: Character[] = [
  {
    id: 'gl_darth_sidious',
    name: 'Darth Sidious (Galactic Sovereign)',
    role: 'Leader / Attacker',
    tags: ['Galactic Empire', 'Sith', 'Emperors Hand', 'Galactic Legend'],
    era: 'CIVIL_WAR',
    image: '/units/gl_darth_sidious.webp',
    isLegend: true,
    abilities: [
      {
        id: 'gl_sidious_basic',
        name: 'Unlimited Power',
        type: 'basic',
        cooldown: 0,
        desc: 'Deal Special Damage. Inflict Shock (2 turns). If target has Imperial Decree: Attack again.',
        effects: ['damage', 'Shock'],
        aiTags: ['offensive']
      },
      {
        id: 'gl_sidious_special1',
        name: 'I Am The Senate',
        type: 'special',
        cooldown: 3,
        desc: 'Move Imperial Decree to target enemy. Inflict Fear (1 turn). Remove 15% Turn Meter. If target is a Leader: Remove an additional 15% Turn Meter.',
        effects: ['Fear', 'turn_meter_reduction'],
        aiTags: ['offensive']
      },
      {
        id: 'gl_sidious_special2',
        name: 'Execute Order 66',
        type: 'special',
        cooldown: 4,
        desc: 'Deal Special Damage to all enemies. Enemies with Imperial Decree: Lose 20% Turn Meter. Gain Healing Immunity (2 turns). Gain Buff Immunity (2 turns).',
        effects: ['damage_aoe', 'turn_meter_reduction', 'Healing Immunity', 'Buff Immunity'],
        aiTags: ['aoe', 'offensive']
      },
      {
        id: 'gl_sidious_leader',
        name: 'Galactic Sovereign',
        type: 'leader',
        cooldown: 0,
        desc: 'Emperor\'s Hand allies gain: 30 Speed. 30% Offense. 25% Potency. Enemies with Imperial Decree deal 30% less damage. Whenever an Emperor\'s Hand ally attacks an enemy with Imperial Decree: Recover 5% Protection. Whenever Imperial Decree is moved: Emperor\'s Hand allies gain 10% Turn Meter. Whenever an enemy with Imperial Decree is defeated: Apply Imperial Decree to the healthiest remaining enemy.',
        effects: ['Speed Up', 'Offense Up'],
        aiTags: []
      },
      {
        id: 'gl_sidious_unique1',
        name: 'Master Of The Grand Plan',
        type: 'unique',
        cooldown: 0,
        desc: 'At the start of battle: Inflict Imperial Decree on the enemy Leader. Whenever Imperial Decree is applied: Gain Offense Up (2 turns). Whenever an enemy with Imperial Decree loses Turn Meter: Gain 5% Turn Meter. Whenever an enemy with Imperial Decree is defeated: Reduce all Emperor\'s Hand cooldowns by 1.',
        effects: [],
        aiTags: []
      },
      {
        id: 'gl_sidious_unique2',
        name: 'The Dark Side Ascendant',
        type: 'unique',
        cooldown: 0,
        desc: 'Enemies with Imperial Decree cannot gain Stealth. Enemies with Imperial Decree cannot gain bonus Turn Meter. Emperor\'s Hand allies ignore 20% Defense against enemies with Imperial Decree. The first time an enemy gains Imperial Decree: Inflict Fear (1 turn).',
        effects: [],
        aiTags: []
      },
      {
        id: 'gl_sidious_ultimate',
        name: 'The Empire Eternal',
        type: 'ultimate',
        chargeRequirement: 100,
        cooldown: 0,
        desc: 'Move Imperial Decree to target enemy. All Emperor\'s Hand allies gain: Offense Up (3 turns), Critical Damage Up (3 turns), Defense Penetration Up (3 turns). Target enemy with Imperial Decree: Lose 50% Turn Meter. Cannot recover Health or Protection for 3 turns. All Emperor\'s Hand allies immediately assist against that enemy. If the target is defeated: Reset all Emperor\'s Hand cooldowns.',
        effects: ['buff_all', 'assist_all', 'turn_meter_reduction'],
        aiTags: ['ultimate']
      }
    ]
  },
  {
    id: 'din_djarin_beskar',
    name: 'Din Djarin',
    role: 'Leader / Attacker',
    tags: ['Mandalorian', 'Bounty Hunter', 'Scoundrel'],
    era: 'NEW_REPUBLIC',
    image: '/units/din_djarin_beskar.webp',
    isLegend: false,
    abilities: [
      { id: 'din_b', name: 'Amban Disintegration Rifle', type: 'basic', cooldown: 0, desc: 'Deal physical damage. If Din has Advantage, deal bonus damage and remove 10% Turn Meter from target.', effects: ['damage', 'turn_meter_reduction'], aiTags: ['offensive'] },
      { id: 'din_s1', name: 'I Can Bring You In Warm...', type: 'special', cooldown: 3, desc: 'Deal physical damage and inflict Ability Block (1 turn). If target is below 50% Health: Inflict Healing Immunity (2 turns). If Grogu is active: Din gains Defense Up (2 turns).', effects: ['damage', 'Ability Block', 'Healing Immunity', 'Defense Up'], aiTags: ['offensive'] },
      { id: 'din_s2', name: 'Whistling Birds', type: 'special', cooldown: 4, desc: 'Deal physical damage to all enemies. Deal additional damage for each active Mandalorian ally. If only Din and Grogu remain: This attack deals 50% additional damage.', effects: ['damage_aoe'], aiTags: ['aoe'] },
      { id: 'din_l', name: 'Clan Of Two', type: 'leader', cooldown: 0, desc: 'While Din is Leader: Mandalorian allies gain +25 Speed, +20% Max Health. Bounty Hunter allies gain +20% Critical Chance. Whenever a Mandalorian ally falls below 50% Health, recover 10% Protection. Whenever an ally uses a Special ability, Din gains 5% Turn Meter.', effects: [], aiTags: [] },
      { id: 'din_u', name: 'The Creed', type: 'unique', cooldown: 0, desc: 'The first time another ally falls below 50% Health: Din gains Taunt (1 turn). Whenever Din gains Taunt: Recover 10% Protection. If Grogu is active: Din gains +20% Defense.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'bokatan_exile',
    name: 'Bo-Katan (Exile)',
    role: 'Attacker',
    tags: ['Mandalorian', 'Scoundrel'],
    era: 'NEW_REPUBLIC',
    image: '/units/bokatan_exile.webp',
    isLegend: false,
    abilities: [
      { id: 'bokatan_exile_b', name: 'Nite Owl Precision', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Inflict Defense Down (2 turns).', effects: ['damage', 'Defense Down'], aiTags: ['offensive'] },
      { id: 'bokatan_exile_s1', name: 'We Are Stronger Together', type: 'special', cooldown: 3, desc: 'Bo-Katan gains: Offense Up, Speed Up (2 turns). Then attack target enemy. If Din Djarin is present: Call Din to assist.', effects: ['Offense Up', 'Speed Up', 'damage', 'assist'], aiTags: ['offensive'] },
      { id: 'bokatan_exile_s2', name: 'Jetpack Ambush', type: 'special', cooldown: 4, desc: 'Deal physical damage to all enemies. Enemies suffering Defense Down take bonus damage.', effects: ['damage_aoe'], aiTags: ['aoe'] },
      { id: 'bokatan_exile_u', name: 'Last Of The Nite Owls', type: 'unique', cooldown: 0, desc: 'Whenever Bo-Katan gains a buff: Recover 5% Protection. Whenever Din uses a Special ability: Bo-Katan gains 10% Turn Meter.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'armorer',
    name: 'The Armorer',
    role: 'Support',
    tags: ['Mandalorian'],
    era: 'NEW_REPUBLIC',
    image: '/units/armorer.webp',
    isLegend: false,
    abilities: [
      { id: 'armorer_b', name: 'Forge Guidance', type: 'basic', cooldown: 0, desc: 'Target ally recovers 10% Protection. If that ally is Mandalorian: Gain Defense Up (1 turn). (No attack.)', effects: ['heal_protection', 'Defense Up'], aiTags: ['support'] },
      { id: 'armorer_s1', name: 'Beskar Armor', type: 'special', cooldown: 3, desc: 'Target ally gains: Defense Up, Tenacity Up (2 turns). Recover 15% Protection. If target is Din: Recover an additional 10% Protection.', effects: ['Defense Up', 'Tenacity Up', 'heal_protection'], aiTags: ['support'] },
      { id: 'armorer_s2', name: 'This Is The Way', type: 'special', cooldown: 4, desc: 'All Mandalorian allies recover: 15% Health, 15% Protection. Grant Defense Up (2 turns).', effects: ['heal_aoe', 'Defense Up'], aiTags: ['support'] },
      { id: 'armorer_u', name: 'Keeper Of The Forge', type: 'unique', cooldown: 0, desc: 'The Armorer cannot critically hit. Whenever a Mandalorian ally gains a buff: Armorer gains 5% Turn Meter. Whenever an ally falls below 50% Health: Recover 5% Protection.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'savage_opress_dw',
    name: 'Savage Opress',
    role: 'Tank',
    tags: ['Sith', 'Death Watch', 'Event Exclusive'],
    era: 'CLONE_WARS',
    image: '/units/savage_opress_dw.webp',
    isLegend: false,
    abilities: [
      { id: 'savage_dw_b', name: 'Brutal Cleave', type: 'basic', cooldown: 0, desc: 'Deal physical damage. If target is Burning: Inflict Offense Down (2 turns).', effects: ['damage', 'Offense Down'], aiTags: ['offensive'] },
      { id: 'savage_dw_s1', name: 'Relentless Protector', type: 'special', cooldown: 3, desc: 'Gain: Defense Up (2 turns), Protection Up (20%), Taunt (2 turns). If Maul (Mand\'alore) is active: Recover 20% Protection.', effects: ['Defense Up', 'Protection Up', 'Taunt', 'heal_protection'], aiTags: ['defensive'] },
      { id: 'savage_dw_s2', name: 'Rage Of Dathomir', type: 'special', cooldown: 4, desc: 'Deal physical damage to all enemies. Inflict Burning (2 turns). For each enemy already suffering Burning: Recover 5% Health.', effects: ['damage_aoe', 'Burning', 'heal_self'], aiTags: ['aoe'] },
      { id: 'savage_dw_u1', name: 'Brotherly Love', type: 'unique', cooldown: 0, desc: 'At the start of battle, gain Brotherly Love if Maul (Mand\'alore) is present. Whenever Maul takes damage: Savage gains 5% Turn Meter. Whenever Maul falls below 50% Health: Savage gains Defense Up (2 turns).', effects: [], aiTags: [] },
      { id: 'savage_dw_u2', name: 'My Brother\'s Shield', type: 'unique', cooldown: 0, desc: 'If Maul is active: The first time Maul would fall below 50% Health: Savage immediately gains Taunt for 2 turns, recovers 25% Health and Protection, and reduces cooldown of Relentless Protector by 1. Whenever Savage is defeated while Maul is active: Maul gains 50% Turn Meter, Offense Up (2 turns).', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'maul_mandalore',
    name: 'Maul (Mand\'alore)',
    role: 'Leader / Attacker',
    tags: ['Mandalorian', 'Sith', 'Death Watch'],
    era: 'CLONE_WARS',
    image: '/units/maul_mandalore.webp',
    isLegend: false,
    abilities: [
      { id: 'maul_man_b', name: 'Crimson Darksaber', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Inflict Burning (2 turns). If target already has Burning: Deal bonus damage equal to 10% of their Max Health.', effects: ['damage', 'Burning'], aiTags: ['offensive'] },
      { id: 'maul_man_s1', name: 'Rule Through Fear', type: 'special', cooldown: 3, desc: 'Deal physical damage. Dispel all buffs from target enemy. Inflict: Burning (3 turns), Healing Immunity (2 turns). If Savage assists during this attack: Inflict Ability Block (1 turn).', effects: ['damage', 'dispel_enemy', 'Burning', 'Healing Immunity', 'Ability Block'], aiTags: ['offensive'] },
      { id: 'maul_man_s2', name: 'Siege Of Mandalore', type: 'special', cooldown: 4, desc: 'Deal physical damage to all enemies. Inflict Burning (2 turns). Enemies already suffering Burning: Lose 20% Turn Meter, Gain Defense Down (2 turns).', effects: ['damage_aoe', 'Burning', 'turn_meter_reduction', 'Defense Down'], aiTags: ['aoe'] },
      { id: 'maul_man_l', name: 'Shadow Collective Ascendant', type: 'leader', cooldown: 0, desc: 'While Maul is Leader: Death Watch allies gain 30% Offense, 20 Speed. Whenever a Death Watch ally inflicts Burning, recover 3% Protection. Burning enemies receive 20% additional damage. Whenever a Burning enemy falls below 50% Health, Death Watch allies gain 5% Turn Meter.', effects: [], aiTags: [] },
      { id: 'maul_man_u1', name: 'Brotherly Love', type: 'unique', cooldown: 0, desc: 'At the start of battle, gain Brotherly Love if Savage Opress is present. Whenever Savage attacks out of turn: Maul gains 5% Turn Meter. Whenever Savage takes damage: Maul gains 2% Offense (stacking).', effects: [], aiTags: [] },
      { id: 'maul_man_u2', name: 'The Throne Of Mandalore', type: 'unique', cooldown: 0, desc: 'Whenever Maul damages a Burning enemy: Gain 3% Offense (stacking, max 20 stacks). Whenever a Burning enemy is defeated: Reduce Maul\'s cooldowns by 1. If Savage Opress is active: Maul ignores 25% Defense, gains 25 Speed.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'dw_vanguard',
    name: 'Death Watch Vanguard',
    role: 'Tank',
    tags: ['Mandalorian', 'Death Watch'],
    era: 'CLONE_WARS',
    image: '/units/dw_vanguard.webp',
    isLegend: false,
    abilities: [
      { id: 'dw_vanguard_b', name: 'Beskar Pike', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Inflict Offense Down (2 turns).', effects: ['damage', 'Offense Down'], aiTags: ['offensive'] },
      { id: 'dw_vanguard_s1', name: 'Hold The Line', type: 'special', cooldown: 3, desc: 'Gain: Taunt (2 turns), Defense Up (2 turns). If any enemy is Burning: Recover 20% Protection.', effects: ['Taunt', 'Defense Up', 'heal_protection'], aiTags: ['defensive'] },
      { id: 'dw_vanguard_s2', name: 'Crushing Advance', type: 'special', cooldown: 4, desc: 'Deal physical damage to target enemy. Inflict Stagger (2 turns). If target is Burning: Stun for 1 turn.', effects: ['damage', 'Stagger', 'Stun'], aiTags: ['offensive'] },
      { id: 'dw_vanguard_u', name: 'Fanatical Defender', type: 'unique', cooldown: 0, desc: 'Whenever an ally falls below 50% Health: Gain Taunt (1 turn). Whenever an enemy with Burning attacks: Recover 3% Health.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'dw_flametrooper',
    name: 'Death Watch Flametrooper',
    role: 'Support / Attacker',
    tags: ['Mandalorian', 'Death Watch'],
    era: 'CLONE_WARS',
    image: '/units/dw_flametrooper.webp',
    isLegend: false,
    abilities: [
      { id: 'dw_flame_b', name: 'Flame Burst', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Inflict Burning (2 turns).', effects: ['damage', 'Burning'], aiTags: ['offensive'] },
      { id: 'dw_flame_s1', name: 'Purge The Weak', type: 'special', cooldown: 3, desc: 'Deal physical damage to all enemies. Inflict Burning (2 turns). Enemies already suffering Burning take bonus damage.', effects: ['damage_aoe', 'Burning'], aiTags: ['aoe'] },
      { id: 'dw_flame_s2', name: 'Wall Of Fire', type: 'special', cooldown: 4, desc: 'Inflict Burning (3 turns) on all enemies. Burning enemies lose 10% Turn Meter. Death Watch allies gain Offense Up (2 turns).', effects: ['Burning', 'turn_meter_reduction', 'Offense Up'], aiTags: ['debuff_all', 'support'] },
      { id: 'dw_flame_u', name: 'Pyromaniac', type: 'unique', cooldown: 0, desc: 'Whenever an enemy gains Burning: Flametrooper gains 5% Turn Meter. Whenever a Burning enemy takes a turn: Recover 2% Protection. The first time an enemy reaches 3 or more stacks of Burning: Reduce all Flametrooper cooldowns by 1.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'salacious_crumb',
    name: 'Salacious B. Crumb',
    role: 'Support',
    tags: ['Hutt Cartel', 'Event Exclusive'],
    era: 'CIVIL_WAR',
    image: '/units/salacious_crumb.webp',
    isLegend: false,
    abilities: [
      { id: 'crumb_b', name: 'Cackling Mockery', type: 'basic', cooldown: 0, desc: 'Deal special damage. Target enemy loses 5% Turn Meter.', effects: ['damage', 'turn_meter_reduction'], aiTags: ['support'] },
      { id: 'crumb_s1', name: 'Disturbing Laughter', type: 'special', cooldown: 3, desc: 'Inflict: Offense Down (2 turns), Potency Down (2 turns) on all enemies.', effects: ['Offense Down', 'Potency Down'], aiTags: ['debuff_all'] },
      { id: 'crumb_s2', name: 'Palace Gossip', type: 'special', cooldown: 4, desc: 'Reduce a random ally cooldown by 1. Increase a random enemy cooldown reduction by 1.', effects: ['cooldown_manipulation'], aiTags: ['support'] },
      { id: 'crumb_u', name: 'Court Jester', type: 'unique', cooldown: 0, desc: 'Scum Condition: Take 10 turns. Scum (Jabba\'s Pet): Gain 50 Speed. Jabba gains 2% Ultimate Charge whenever Salacious takes a turn.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'bossk',
    name: 'Bossk',
    role: 'Leader / Tank',
    tags: ['Bounty Hunter', 'Scoundrel'],
    era: 'CIVIL_WAR',
    image: '/units/bossk.webp',
    isLegend: false,
    abilities: [
      { id: 'bossk_b', name: 'Trandoshan Brutality', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Inflict Offense Down (2 turns). If Bossk has Payout: Recover 5% Health and Protection.', effects: ['damage', 'Offense Down'], aiTags: ['offensive'] },
      { id: 'bossk_s1', name: 'Hunting Party', type: 'special', cooldown: 3, desc: 'Call target Bounty Hunter ally to assist. Both Bossk and assisting ally recover 10% Protection. If either ally has Payout: Gain 10% Turn Meter.', effects: ['assist', 'heal_protection', 'turn_meter_gain'], aiTags: ['support'] },
      { id: 'bossk_s2', name: 'Relentless Pursuit', type: 'special', cooldown: 4, desc: 'Gain: Taunt (2 turns), Defense Up (2 turns). Recover 25% Protection. Then inflict Target Lock (2 turns) on target enemy.', effects: ['Taunt', 'Defense Up', 'heal_protection', 'Target Lock'], aiTags: ['defensive'] },
      { id: 'bossk_l', name: 'Professional Hunters', type: 'leader', cooldown: 0, desc: 'While Bossk is Leader: Bounty Hunter allies gain 25 Speed. Bounty Hunter allies gain 20% Max Health. Whenever a Bounty Hunter gains Payout, all Bounty Hunter allies recover 15% Protection. Bounty Hunter allies with Payout gain 20% Offense and Defense.', effects: [], aiTags: [] },
      { id: 'bossk_u', name: 'Trandoshan Persistence', type: 'unique', cooldown: 0, desc: 'Payout Condition: Bossk takes damage 15 times. Payout: Gain 50% Defense. Gain 50% Max Health. Recover 5% Health whenever damaged.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'embo',
    name: 'Embo',
    role: 'Attacker',
    tags: ['Bounty Hunter', 'Scoundrel'],
    era: 'CLONE_WARS',
    image: '/units/embo.webp',
    isLegend: false,
    abilities: [
      { id: 'embo_b', name: 'Kyuzo Hat Strike', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Inflict Defense Down (2 turns). If Embo has Payout: Attack again dealing 50% reduced damage.', effects: ['damage', 'Defense Down'], aiTags: ['offensive'] },
      { id: 'embo_s1', name: 'Merciless Pursuit', type: 'special', cooldown: 3, desc: 'Deal physical damage. Gain Offense Up (2 turns). If target is debuffed: Inflict Exposed (2 turns).', effects: ['damage', 'Offense Up', 'Exposed'], aiTags: ['offensive'] },
      { id: 'embo_s2', name: 'Survivor\'s Instinct', type: 'special', cooldown: 4, desc: 'Recover 20% Health and Protection. Gain: Critical Chance Up (2 turns), Critical Damage Up (2 turns). Then attack target enemy.', effects: ['heal_self', 'Critical Chance Up', 'Critical Damage Up', 'damage'], aiTags: ['offensive'] },
      { id: 'embo_u1', name: 'Independent Contractor', type: 'unique', cooldown: 0, desc: 'Payout Condition: Use Merciless Pursuit 3 times. Payout: Gain 50% Offense. Gain 20 Speed. Gain 20% Critical Damage.', effects: [], aiTags: [] },
      { id: 'embo_u2', name: 'Kyuzo Warrior', type: 'unique', cooldown: 0, desc: 'Whenever Embo defeats an enemy: Gain 10% Turn Meter. Whenever Embo critically hits: Recover 5% Protection.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'aurra_sing',
    name: 'Aurra Sing',
    role: 'Leader / Saboteur',
    tags: ['Bounty Hunter', 'Scoundrel'],
    era: 'CLONE_WARS',
    image: '/units/aurra_sing.webp',
    isLegend: false,
    abilities: [
      { id: 'aurra_b', name: 'Precision Shot', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Inflict Accuracy Down (2 turns). If Aurra has Payout: Remove 10% Turn Meter.', effects: ['damage', 'Accuracy Down', 'turn_meter_reduction'], aiTags: ['offensive'] },
      { id: 'aurra_s1', name: 'Professional Rivalry', type: 'special', cooldown: 3, desc: 'Deal physical damage. Call another Bounty Hunter ally to assist. If the assisting ally has Payout: They deal 50% additional damage.', effects: ['damage', 'assist'], aiTags: ['offensive'] },
      { id: 'aurra_s2', name: 'Long Range Elimination', type: 'special', cooldown: 4, desc: 'Deal massive physical damage. Inflict: Healing Immunity (2 turns), Buff Immunity (2 turns). If target is below 50% Health: Ignore Protection.', effects: ['damage_heavy', 'Healing Immunity', 'Buff Immunity'], aiTags: ['offensive'] },
      { id: 'aurra_l', name: 'Contract Broker', type: 'leader', cooldown: 0, desc: 'While Aurra is Leader: Bounty Hunter allies gain 20 Speed. Bounty Hunter allies gain 25% Potency. Whenever a Bounty Hunter inflicts a debuff, progress their Payout condition by 1. Whenever a Bounty Hunter earns Payout, they gain 15% Turn Meter.', effects: [], aiTags: [] },
      { id: 'aurra_u', name: 'Ruthless Opportunist', type: 'unique', cooldown: 0, desc: 'Payout Condition: Inflict debuffs on 15 enemies. Payout: Gain 40 Speed. Ignore 30% Defense. Debuffs cannot be resisted.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'darth_sidious_farmable',
    name: 'Darth Sidious',
    role: 'Leader / Attacker',
    tags: ['Sith'],
    era: 'CLONE_WARS',
    image: '/units/darth_sidious_farmable.webp',
    isLegend: false,
    abilities: [
      { id: 'dsid_farm_b', name: 'There Is No Mercy', type: 'basic', cooldown: 0, desc: 'Deal special damage. Dispel all buffs from target enemy. If target is a Galactic Legend, Journey, or Conquest character: Deal bonus true damage.', effects: ['damage', 'dispel_enemy', 'true_damage'], aiTags: ['offensive'] },
      { id: 'dsid_farm_s1', name: 'Unlimited Power', type: 'special', cooldown: 3, desc: 'Deal special damage to all enemies. Inflict: Shock (2 turns), Ability Block (1 turn). Enemies already suffering Shock lose 20% Turn Meter. Sidious recovers 10% Health and Protection for each enemy hit.', effects: ['damage_aoe', 'Shock', 'Ability Block', 'turn_meter_reduction', 'heal_self'], aiTags: ['aoe'] },
      { id: 'dsid_farm_s2', name: 'The Dark Side Of The Force', type: 'special', cooldown: 4, desc: 'Deal massive special damage to target enemy. Ignore Taunt. Ignore Defense. If target is defeated: Reset the cooldown of Unlimited Power.', effects: ['damage_heavy'], aiTags: ['offensive'] },
      { id: 'dsid_farm_l', name: 'Supreme Chancellor', type: 'leader', cooldown: 0, desc: 'While Sidious is Leader: Sith allies gain 30 Speed. Sith allies gain 25% Offense. If Sidious is the only active Sith ally: Double these bonuses.', effects: [], aiTags: [] },
      { id: 'dsid_farm_u1', name: 'Master Of Both Sides', type: 'unique', cooldown: 0, desc: 'Whenever an enemy gains Turn Meter: Sidious gains 2% Turn Meter. Whenever an enemy attacks out of turn: Sidious gains 5% Offense (stacking). Whenever Sidious defeats an enemy: Recover 25% Health and Protection.', effects: [], aiTags: [] },
      { id: 'dsid_farm_u2', name: 'The Phantom Menace', type: 'unique', cooldown: 0, desc: 'At the start of battle: If Sidious is the only Sith ally: Gain 100% Max Health, 100% Offense, 50 Speed, 50% Defense, 50% Tenacity. Whenever Sidious falls below 75%, 50%, or 25% Health: Dispel all debuffs from himself. Recover 20% Health. Gain Offense Up (2 turns). The first time Sidious would be defeated: Prevent the defeat. Recover 100% Health. Gain 100% Turn Meter. Once per battle.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'general_han_solo',
    name: 'General Han Solo',
    role: 'Leader / Tank / Strategist',
    tags: ['Rebel Alliance', 'Rebel Command'],
    era: 'CIVIL_WAR',
    image: '/units/general_han_solo.webp',
    isLegend: false,
    abilities: [
      { id: 'ghan_b', name: 'General\'s Shot', type: 'basic', cooldown: 0, desc: 'Deal physical damage to target enemy. Inflict Offense Down (2 turns). If Han has Last Hope, call a random Rebel Command ally to assist.', effects: ['damage', 'Offense Down', 'assist'], aiTags: ['offensive'] },
      { id: 'ghan_s1', name: 'Hold Together!', type: 'special', cooldown: 3, desc: 'Dispel all debuffs from target Rebel ally. That ally gains Last Hope (2 turns). If the ally already had Last Hope: Recover 20% Health, 20% Protection.', effects: ['dispel_ally', 'Last Hope', 'heal'], aiTags: ['support'] },
      { id: 'ghan_s2', name: 'Strike Team Advance', type: 'special', cooldown: 4, desc: 'Call all Rebel Command allies to assist dealing 25% reduced damage. Each assisting ally gains Last Hope (1 turn). For each ally that already had Last Hope: Deal 10% bonus damage.', effects: ['assist_all', 'Last Hope'], aiTags: ['offensive', 'support'] },
      { id: 'ghan_l', name: 'Never Tell Me The Odds', type: 'leader', cooldown: 0, desc: 'While General Han Solo is Leader: Rebel Command allies gain 30% Max Health, 20 Speed. Whenever a Rebel Command ally falls below 50% Health, they gain Last Hope (2 turns). Whenever a Rebel Command ally resists a debuff, they gain Last Hope (1 turn). Whenever a Rebel Command ally gains Last Hope, recover 3% Health and Protection. Whenever an ally is defeated, all remaining Rebel Command allies gain 2 stacks of Last Hope (2 turns).', effects: [], aiTags: [] },
      { id: 'ghan_u', name: 'General of the Alliance', type: 'unique', cooldown: 0, desc: 'At the start of battle: Han gains Taunt (1 turn). Whenever Han loses Taunt: Gain Last Hope (2 turns). Whenever Han loses Last Hope he gains Taunt (1 turn). Whenever a Rebel Command ally attacks out of turn: Han gains 5% Turn Meter. The first time Han falls below 50% Health: Recover 50% Protection, Gain Defense Up (2 turns), Gain Last Hope (3 turns).', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'wedge_antilles',
    name: 'Wedge Antilles',
    role: 'Attacker',
    tags: ['Rebel Alliance', 'Rebel Command', 'Red Squadron'],
    era: 'CIVIL_WAR',
    image: '/units/wedge_antilles.webp',
    isLegend: false,
    abilities: [
      { id: 'wedge_b', name: 'Precision Burst', type: 'basic', cooldown: 0, desc: 'Deal physical damage. If Wedge has Last Hope: Attack again dealing 50% reduced damage.', effects: ['damage'], aiTags: ['offensive'] },
      { id: 'wedge_s1', name: 'Air Support Run', type: 'special', cooldown: 3, desc: 'Deal physical damage to all enemies. Enemies below 50% Health take bonus damage. Gain Last Hope (2 turns).', effects: ['damage_aoe', 'Last Hope'], aiTags: ['aoe'] },
      { id: 'wedge_s2', name: 'Rogue Squadron Assault', type: 'special', cooldown: 5, desc: 'Deal massive physical damage to target enemy. If Wedge has Last Hope: Ignore 50% Defense, Inflict Exposed (2 turns). If Wedge has 3 stacks of Last Hope: Deal true damage equal to 15% of target\'s Max Health.', effects: ['damage_heavy', 'Exposed', 'true_damage'], aiTags: ['offensive'] },
      { id: 'wedge_u1', name: 'Battle of Endor Ace', type: 'unique', cooldown: 0, desc: 'Whenever Rebel Command allies gain Last Hope: Wedge gains 5% Turn Meter. Whenever allies attack out of turn: Wedge gains Offense Up (1 turn). Whenever an enemy falls below 50% Health: Gain Last Hope (1 turn).', effects: [], aiTags: [] },
      { id: 'wedge_u2', name: 'Rebel Air Superiority', type: 'unique', cooldown: 0, desc: 'While Wedge has Last Hope: Gain 30% Critical Damage, 20% Offense. Whenever Wedge critically hits: Reduce cooldown of Air Support Run by 1.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'luke_skywalker_gl',
    name: 'Luke Skywalker (Rebellion\'s Twilight)',
    role: 'Leader / Attacker',
    tags: ['Rebel Alliance', 'Rebel Command', 'Galactic Legend'],
    era: 'CIVIL_WAR',
    image: '/units/luke_skywalker_gl.webp',
    isLegend: true,
    abilities: [
      { id: 'luke_gl_b', name: 'A Jedi\'s Resolve', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Inflict Ability Block (1 turn). If Luke has Last Hope: Dispel all buffs from target enemy.', effects: ['damage', 'Ability Block', 'dispel_enemy'], aiTags: ['offensive'] },
      { id: 'luke_gl_s1', name: 'The Light Remains', type: 'special', cooldown: 3, desc: 'All Rebel allies recover 20% Health and Protection. All Rebel Command allies gain Last Hope (2 turns). Dispel all debuffs from Luke.', effects: ['heal_aoe', 'Last Hope', 'dispel_self'], aiTags: ['support'] },
      { id: 'luke_gl_s2', name: 'I Am A Jedi', type: 'special', cooldown: 4, desc: 'Deal massive physical damage to target enemy. Inflict Daze (2 turns). If Luke has Last Hope: Ignore Protection, Prevent revival. If target is defeated: Rebel Command allies gain Last Hope (2 turns).', effects: ['damage_heavy', 'Daze', 'Last Hope'], aiTags: ['offensive'] },
      { id: 'luke_gl_s3', name: 'Endor Counteroffensive', type: 'special', cooldown: 5, desc: 'Call all Rebel Command allies to assist. All assisting allies gain Last Hope (2 turns). Enemies hit by 3 or more attacks: Lose 20% Turn Meter, Gain Exposed (2 turns).', effects: ['assist_all', 'Last Hope', 'turn_meter_reduction', 'Exposed'], aiTags: ['offensive'] },
      { id: 'luke_gl_l', name: 'Rebellion\'s Twilight', type: 'leader', cooldown: 0, desc: 'While Luke is Leader: Rebel allies gain 40% Max Health. Rebel Command allies gain 30 Speed. Last Hope grants an additional 10% Offense per stack. Whenever Rebel Command allies gain Last Hope, recover 5% Protection. Rebel Command allies cannot have Last Hope dispelled by enemies during their own turn. Whenever an enemy defeats a Rebel ally, all remaining Rebel Command allies gain 3 stacks of Last Hope (2 turns).', effects: [], aiTags: [] },
      { id: 'luke_gl_u', name: 'The Last Spark', type: 'unique', cooldown: 0, desc: 'At the start of battle: Luke gains Last Hope (3 turns). Whenever a Rebel Command ally gains Last Hope: Luke gains 3% Ultimate Charge. Whenever allies attack out of turn: Luke gains 2% Ultimate Charge. Whenever an enemy is defeated: Luke gains Last Hope (2 turns).', effects: [], aiTags: [] },
      { id: 'luke_gl_ult', name: 'Return of the Jedi', type: 'ultimate', chargeRequirement: 100, cooldown: 0, desc: 'Luke enters Ultimate Stance for 3 turns. While in Ultimate Stance: Rebel Command allies gain 50% Offense, 50% Defense. Last Hope cannot expire. Rebel Command allies recover 10% Health and Protection whenever they attack. Activate: Dispel all enemy buffs. Inflict Ability Block and Daze (2 turns) on all enemies. Rebel Command allies gain 3 stacks of Last Hope (3 turns). This effect cannot be prevented.', effects: ['buff_all', 'debuff_all', 'Last Hope'], aiTags: ['ultimate'] }
    ]
  },
  {
    id: 'nien_nunb',
    name: 'Nien Nunb',
    role: 'Support / Strategist',
    tags: ['Rebel Alliance', 'Rebel Command'],
    era: 'CIVIL_WAR',
    image: '/units/nien_nunb.webp',
    isLegend: false,
    abilities: [
      { id: 'nien_b', name: 'Coordinated Fire', type: 'basic', cooldown: 0, desc: 'Deal physical damage to target enemy and grant the weakest Rebel Command ally 5% Turn Meter. If Nien has Last Hope, grant another random Rebel Command ally 5% Turn Meter. If the target enemy has Exposed, remove 5% Turn Meter from them.', effects: ['damage', 'turn_meter_gain', 'turn_meter_reduction'], aiTags: ['support'] },
      { id: 'nien_s1', name: 'Emergency Supply Run', type: 'special', cooldown: 3, desc: 'Target ally recovers 20% Health and Protection and gains Last Hope (2 turns). If the target already had Last Hope: Dispel all debuffs from them. Reduce their cooldowns by 1. Grant them 15% Turn Meter. If the target is General Han Solo or Luke Skywalker (Rebellion\'s Twilight), they immediately assist.', effects: ['heal_protection', 'Last Hope', 'dispel_ally', 'turn_meter_gain', 'assist'], aiTags: ['support'] },
      { id: 'nien_s2', name: 'Endor Command Network', type: 'special', cooldown: 4, desc: 'All Rebel Command allies gain: Last Hope (2 turns), 15% Turn Meter. Then call the ally with the highest Offense to assist. For every ally already affected by Last Hope: Rebel Command allies gain 3% Turn Meter. Recover 3% Protection. Enemies below 50% Health lose 15% Turn Meter.', effects: ['Last Hope', 'turn_meter_gain', 'assist', 'turn_meter_reduction'], aiTags: ['support'] },
      { id: 'nien_u', name: 'Rebel Logistics', type: 'unique', cooldown: 0, desc: 'Whenever Rebel Command allies gain Last Hope: Nien gains 5% Turn Meter. Whenever a Rebel Command ally attacks out of turn: Recover 2% Protection. The first time each Rebel Command ally falls below 50% Health, Nien grants them Last Hope (2 turns).', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'lando_calrissian',
    name: 'Lando Calrissian',
    role: 'Attacker / Strategist',
    tags: ['Rebel Alliance', 'Rebel Command'],
    era: 'CIVIL_WAR',
    image: '/units/lando_calrissian.webp',
    isLegend: false,
    abilities: [
      { id: 'lando_b', name: 'Lucky Shot', type: 'basic', cooldown: 0, desc: 'Deal physical damage. 50% chance to attack again. If Lando has Last Hope, this chance becomes 100%. Critical hits grant Lando 5% Turn Meter.', effects: ['damage', 'turn_meter_gain'], aiTags: ['offensive'] },
      { id: 'lando_s1', name: 'Stack The Odds', type: 'special', cooldown: 3, desc: 'Gain: Last Hope (3 turns), Critical Chance Up, Critical Damage Up (2 turns). Then deal physical damage to target enemy. If the attack critically hits: Inflict Exposed (2 turns). Reduce this ability\'s cooldown by 1. If the target was already Exposed: Attack again.', effects: ['Last Hope', 'Critical Chance Up', 'Critical Damage Up', 'damage', 'Exposed'], aiTags: ['offensive'] },
      { id: 'lando_s2', name: 'Cloud City Gambit', type: 'special', cooldown: 4, desc: 'Consume all stacks of Last Hope on Lando. Deal physical damage to all enemies. Gain bonus effects for each stack consumed: 1 Stack: Inflict Exposed (2 turns). 2 Stacks: Ignore Protection. 3 Stacks: Ignore Defense. Prevent defeated enemies from reviving. Then gain Last Hope (1 turn).', effects: ['damage_aoe', 'Exposed', 'Last Hope'], aiTags: ['aoe'] },
      { id: 'lando_u', name: 'Professional Gambler', type: 'unique', cooldown: 0, desc: 'Whenever Lando gains Last Hope: Gain 5% Turn Meter. Whenever Rebel Command allies critically hit: Lando gains 2% Offense (stacking). Whenever an enemy falls below 50% Health: Lando gains Last Hope (1 turn).', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'chewbacca',
    name: 'Chewbacca',
    role: 'Tank',
    tags: ['Rebel Alliance', 'Rebel Command'],
    era: 'CIVIL_WAR',
    image: '/units/chewbacca_rc.webp',
    isLegend: false,
    abilities: [
      { id: 'chewie_rc_b', name: 'Wookiee Slam', type: 'basic', cooldown: 0, desc: 'Deal physical damage and inflict Offense Down (2 turns). If Chewbacca has Last Hope: Stun the target for 1 turn. If the target was already debuffed: Recover 5% Health.', effects: ['damage', 'Offense Down', 'Stun', 'heal_self'], aiTags: ['offensive'] },
      { id: 'chewie_rc_s1', name: 'Protective Roar', type: 'special', cooldown: 3, desc: 'Gain: Taunt (2 turns), Defense Up (2 turns), Last Hope (2 turns). All Rebel Command allies recover 10% Protection. While Taunting, whenever another Rebel Command ally takes damage: Chewbacca gains 5% Turn Meter.', effects: ['Taunt', 'Defense Up', 'Last Hope', 'heal_protection'], aiTags: ['defensive'] },
      { id: 'chewie_rc_s2', name: 'Not My Friends', type: 'special', cooldown: 4, desc: 'Dispel all buffs from target enemy. Deal physical damage. Then call all Rebel Command allies to assist. For each assisting ally affected by Last Hope: Recover 5% Health and Protection. Deal 10% bonus damage. If General Han Solo is present, he is always called first.', effects: ['dispel_enemy', 'damage', 'assist_all'], aiTags: ['offensive'] },
      { id: 'chewie_rc_u', name: 'Loyal Companion', type: 'unique', cooldown: 0, desc: 'Whenever a Rebel Command ally falls below 50% Health: Chewbacca gains Taunt for 1 turn. Whenever allies gain Last Hope: Chewbacca gains 5% Protection Up (stacking). While Chewbacca has Last Hope: Gain 40% Defense. Gain 30% Counter Chance.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'c3po',
    name: 'C-3PO',
    role: 'Support / Strategist',
    tags: ['Rebel Alliance', 'Galactic Republic', 'Ewok', 'Rebel Command'],
    era: 'CIVIL_WAR',
    image: '/units/c3po.webp',
    isLegend: false,
    abilities: [
      { id: 'c3po_b', name: 'Oh Dear', type: 'basic', cooldown: 0, desc: 'Deal special damage. This attack cannot critically hit. Grant the weakest ally Last Hope (1 turn). If the target enemy is debuffed: Remove 5% Turn Meter.', effects: ['damage', 'Last Hope', 'turn_meter_reduction'], aiTags: ['support'] },
      { id: 'c3po_s1', name: 'Protocol Analysis', type: 'special', cooldown: 3, desc: 'Target ally gains: Last Hope (2 turns), Tenacity Up (2 turns). Rebel Command: Gain 15% Turn Meter. Reduce cooldowns by 1. Galactic Republic: Recover 20% Protection. Gain Defense Up (2 turns). Ewoks: Gain Stealth (2 turns). Gain Speed Up (2 turns).', effects: ['Last Hope', 'Tenacity Up'], aiTags: ['support'] },
      { id: 'c3po_s2', name: 'Odds Of Survival', type: 'special', cooldown: 4, desc: 'All allies recover: 15% Health, 15% Protection. All allies gain Last Hope (2 turns). Rebel Command: Recover an additional 10% Protection. Galactic Republic: Gain 10% Turn Meter. Ewoks: Recover cooldowns by 1.', effects: ['heal_aoe', 'Last Hope'], aiTags: ['support'] },
      { id: 'c3po_u', name: 'Hero Of Three Wars', type: 'unique', cooldown: 0, desc: 'At the start of battle: Grant all allies Last Hope (1 turn). Whenever allies gain Last Hope: C-3PO gains 5% Turn Meter. Whenever an ally falls below 50% Health: Grant them Last Hope (2 turns). Whenever an ally is defeated: Remaining allies gain Last Hope (2 turns). For Rebel Command allies, Last Hope grants an additional 5% Health Steal. For Galactic Republic allies, allies gain 5% Defense.(stacking) For Ewok allies, allies gain 5% Speed.(stacking)', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'admiral_ackbar',
    name: 'Admiral Ackbar',
    role: 'Leader / Strategist',
    tags: ['Rebel Alliance'],
    era: 'CIVIL_WAR',
    image: '/units/admiral_ackbar.webp',
    isLegend: false,
    abilities: [
      { id: 'ackbar_b', name: 'Coordinated Volley', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Call a random Rebel ally to assist dealing 50% reduced damage. If the assisting ally is from a different Rebel faction than Ackbar\'s leader ability is currently supporting: They gain 10% Turn Meter.', effects: ['damage', 'assist'], aiTags: ['offensive', 'support'] },
      { id: 'ackbar_s1', name: 'It\'s A Trap!', type: 'special', cooldown: 3, desc: 'Expose all enemies for 2 turns. Enemies already affected by Exposed: Lose 15% Turn Meter. Then call the Rebel ally with the highest Offense to assist.', effects: ['Exposed', 'turn_meter_reduction', 'assist'], aiTags: ['support', 'debuff_all'] },
      { id: 'ackbar_s2', name: 'Fleet Coordination', type: 'special', cooldown: 4, desc: 'All Rebel allies gain: Speed Up (2 turns), Offense Up (2 turns). Then each Rebel ally gains a bonus effect based on their faction: Rebel Command (Gain Last Hope), Rogue One (Recover 20% Protection), Rebel Honor (Gain Defense Up), Spectres (Gain 15% Turn Meter), Ewoks (Gain Stealth).', effects: ['Speed Up', 'Offense Up'], aiTags: ['buff_all'] },
      { id: 'ackbar_l', name: 'Alliance High Command', type: 'leader', cooldown: 0, desc: 'While Ackbar is Leader: Rebel allies gain 25 Speed. Rebel allies gain 20% Max Health. Whenever a Rebel ally uses a Special ability, call a random Rebel ally to assist dealing 50% reduced damage. Whenever Rebels attack out of turn, recover 2% Protection. Whenever enemies are inflicted with Exposed, Rebel allies gain 3% Turn Meter. If all allies are Rebels: Rebel allies gain an additional 20 Speed. If at least 3 different Rebel factions are present: Allies gain 20% Offense. Allies recover 5% Health whenever they assist.', effects: [], aiTags: [] },
      { id: 'ackbar_u', name: 'The Rebellion United', type: 'unique', cooldown: 0, desc: 'At the start of battle: Grant all Rebel allies Offense Up (2 turns). Whenever a Rebel ally falls below 50% Health: They recover 15% Protection. The first time a Rebel ally is defeated: Remaining Rebel allies gain 25% Turn Meter. Reduce all Rebel cooldowns by 1. This effect can only occur once per battle.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'stormtrooper_luke',
    name: 'Stormtrooper Luke',
    role: 'Leader / Attacker',
    tags: ['Rebel Alliance'],
    era: 'CIVIL_WAR',
    image: '/units/stormtrooper_luke.webp',
    isLegend: false,
    abilities: [
      { id: 'stluke_b', name: 'Lucky Shot', type: 'basic', cooldown: 0, desc: 'Deal physical damage. If Luke has a buff, attack again dealing 50% reduced damage.', effects: ['damage'], aiTags: ['offensive'] },
      { id: 'stluke_s1', name: 'Aren\'t You A Little Short For A Stormtrooper?', type: 'special', cooldown: 3, desc: 'Deal physical damage and inflict Exposed (2 turns). Call the ally with the highest Offense to assist. If that ally is Han Solo or Smuggler Chewbacca, they gain Offense Up (2 turns).', effects: ['damage', 'Exposed', 'assist'], aiTags: ['offensive'] },
      { id: 'stluke_s2', name: 'We\'re Here To Rescue You', type: 'special', cooldown: 4, desc: 'Dispel all debuffs from target ally and grant them Speed Up and Offense Up (2 turns). If the ally was below 50% Health: Recover 25% Protection. Call them to assist.', effects: ['dispel_ally', 'Speed Up', 'Offense Up', 'assist'], aiTags: ['support'] },
      { id: 'stluke_l', name: 'New Hope', type: 'leader', cooldown: 0, desc: 'While Luke is Leader: Rebel allies gain 20 Speed. Rebel allies gain 20% Max Health. Whenever a Rebel ally falls below 50% Health, they gain 10% Turn Meter. Whenever a Rebel ally is defeated, remaining allies recover 20% Health and Protection.', effects: [], aiTags: [] },
      { id: 'stluke_u', name: 'Kid From Tatooine', type: 'unique', cooldown: 0, desc: 'Whenever Luke gains a buff: Gain 5% Turn Meter. Whenever Luke defeats an enemy: Gain Offense Up (2 turns). Recover 20% Protection.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'stormtrooper_han',
    name: 'Stormtrooper Han',
    role: 'Tank',
    tags: ['Rebel Alliance'],
    era: 'CIVIL_WAR',
    image: '/units/stormtrooper_han.webp',
    isLegend: false,
    abilities: [
      { id: 'sthan_b', name: 'Wild Blaster Fire', type: 'basic', cooldown: 0, desc: 'Deal physical damage. 50% chance to inflict Offense Down (2 turns).', effects: ['damage', 'Offense Down'], aiTags: ['offensive'] },
      { id: 'sthan_s1', name: 'Boring Conversation Anyway', type: 'special', cooldown: 3, desc: 'Gain Taunt and Defense Up (2 turns). Dispel all debuffs from Han. All Rebel allies recover 10% Protection.', effects: ['Taunt', 'Defense Up', 'heal_aoe'], aiTags: ['defensive'] },
      { id: 'sthan_s2', name: 'Into The Detention Block', type: 'special', cooldown: 4, desc: 'Deal physical damage to all enemies. Inflict Accuracy Down (2 turns). Gain Taunt (1 turn). If Leia is present: Leia gains 15% Turn Meter.', effects: ['damage_aoe', 'Accuracy Down', 'Taunt'], aiTags: ['aoe', 'defensive'] },
      { id: 'sthan_u', name: 'Fly Casual', type: 'unique', cooldown: 0, desc: 'Whenever Han is damaged while Taunting: Gain 5% Turn Meter. Whenever another Rebel ally falls below 50% Health: Gain Defense Up (1 turn).', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'senator_organa',
    name: 'Senator Organa',
    role: 'Support / Strategist',
    tags: ['Rebel Alliance'],
    era: 'CIVIL_WAR',
    image: '/units/senator_organa.webp',
    isLegend: false,
    abilities: [
      { id: 'senator_b', name: 'You\'re Braver Than I Thought', type: 'basic', cooldown: 0, desc: 'Deal special damage. The weakest ally recovers 5% Protection.', effects: ['damage', 'heal'], aiTags: ['support'] },
      { id: 'senator_s1', name: 'Somebody Has To Save Our Skins', type: 'special', cooldown: 3, desc: 'Target ally gains: Offense Up (2 turns), Tenacity Up (2 turns). Then call them to assist. If the target is Luke or Han: Gain 15% Turn Meter.', effects: ['Offense Up', 'Tenacity Up', 'assist'], aiTags: ['support'] },
      { id: 'senator_s2', name: 'Into The Garbage Chute!', type: 'special', cooldown: 4, desc: 'All Rebel allies recover 15% Health and Protection. Dispel one debuff from all allies. Enemies lose 10% Turn Meter.', effects: ['heal_aoe', 'dispel_ally', 'turn_meter_reduction'], aiTags: ['support'] },
      { id: 'senator_u', name: 'Princess Of Alderaan', type: 'unique', cooldown: 0, desc: 'Whenever an ally falls below 50% Health: Leia gains 10% Turn Meter. Whenever an ally uses a Special ability: Recover 2% Protection.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'smuggler_chewbacca',
    name: 'Smuggler Chewbacca',
    role: 'Tank / Attacker',
    tags: ['Rebel Alliance'],
    era: 'CIVIL_WAR',
    image: '/units/smuggler_chewbacca.webp',
    isLegend: false,
    abilities: [
      { id: 'smug_chewie_b', name: 'Wookiee Slam', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Inflict Offense Down (2 turns).', effects: ['damage', 'Offense Down'], aiTags: ['offensive'] },
      { id: 'smug_chewie_s1', name: 'Let The Wookiee Win', type: 'special', cooldown: 3, desc: 'Deal physical damage. If target enemy is debuffed: Stun for 1 turn. If Han Solo is present: Han assists.', effects: ['damage', 'Stun', 'assist'], aiTags: ['offensive'] },
      { id: 'smug_chewie_s2', name: 'Prisoner Transfer', type: 'special', cooldown: 4, desc: 'Deal physical damage to all enemies. Enemies already suffering a debuff take bonus damage. Smuggler Chewbacca gains Taunt (2 turns).', effects: ['damage_aoe', 'Taunt'], aiTags: ['aoe', 'defensive'] },
      { id: 'smug_chewie_u', name: 'Walking Carpet', type: 'unique', cooldown: 0, desc: 'Whenever another Rebel ally falls below 50% Health: Gain Taunt (1 turn). Whenever Han Solo is damaged: Recover 5% Health. Gain 5% Turn Meter.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'r2d2',
    name: 'R2-D2',
    role: 'Support / Saboteur',
    tags: ['Rebel Alliance', 'Galactic Republic'],
    era: 'CIVIL_WAR',
    image: '/units/r2d2.webp',
    isLegend: false,
    abilities: [
      { id: 'r2d2_b', name: 'Shock Prod', type: 'basic', cooldown: 0, desc: 'Deal special damage. 50% chance to Stun target enemy for 1 turn.', effects: ['damage', 'Stun'], aiTags: ['support'] },
      { id: 'r2d2_s1', name: 'Move Past My Leg', type: 'special', cooldown: 3, desc: 'Target ally gains: Stealth (2 turns), Foresight (1 turn). Dispel all debuffs from that ally. If they are Rebel or Galactic Republic: Recover 20% Protection.', effects: ['Stealth', 'Foresight', 'dispel_ally', 'heal_protection'], aiTags: ['support'] },
      { id: 'r2d2_s2', name: 'Scomp Link Override', type: 'special', cooldown: 4, desc: 'Target enemy loses: 15% Turn Meter. Inflict: Buff Immunity (2 turns), Daze (2 turns). If target was already debuffed: Call a random ally to assist.', effects: ['turn_meter_reduction', 'Buff Immunity', 'Daze', 'assist'], aiTags: ['support'] },
      { id: 'r2d2_u', name: 'Resourceful Astromech', type: 'unique', cooldown: 0, desc: 'Whenever allies gain a buff: R2 gains 5% Turn Meter. Whenever a Rebel ally uses a Special ability: Recover 3% Protection. Whenever a Galactic Republic ally uses a Special ability: Recover 3% Health. The first time each ally falls below 50% Health: Grant Foresight (1 turn). Whenever an enemy is defeated: Reduce R2\'s cooldowns by 1.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'honor_guard',
    name: 'Alderaan Honor Guard',
    role: 'Tank',
    tags: ['Rebel Alliance', 'Rebel Honor'],
    era: 'CIVIL_WAR',
    image: '/units/honor_guard.webp',
    isLegend: false,
    abilities: [
      { id: 'hg_b', name: 'Honor Staff Strike', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Inflict Offense Down (2 turns).', effects: ['damage', 'Offense Down'], aiTags: ['offensive'] },
      { id: 'hg_s1', name: 'Protective Wall', type: 'special', cooldown: 3, desc: 'Gain Taunt and Defense Up (2 turns). Leia gains Protection Up (15%).', effects: ['Taunt', 'Defense Up', 'Protection Up'], aiTags: ['defensive'] },
      { id: 'hg_s2', name: 'Stand Your Ground', type: 'special', cooldown: 4, desc: 'Gain Retribution (2 turns). Whenever Leia is damaged: Counterattack the attacker. Recover 10% Protection.', effects: ['Retribution', 'heal_protection'], aiTags: ['defensive'] },
      { id: 'hg_u', name: 'Oath Of Alderaan', type: 'unique', cooldown: 0, desc: 'While Leia is active: Gain 50% Defense. Whenever Leia falls below 75% Health: Recover 20% Health and Protection. If Leia would fall below 1 Health: Honor Guard loses 25% Health instead. (Once per turn)', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'chief_chirpa',
    name: 'Chief Chirpa',
    role: 'Leader / Support',
    tags: ['Rebel Alliance', 'Ewok'],
    era: 'CIVIL_WAR',
    image: '/units/chief_chirpa.webp',
    isLegend: false,
    abilities: [
      { id: 'chirpa_b', name: 'Chief\'s Command', type: 'basic', cooldown: 0, desc: 'Deal physical damage to target enemy. Call a random Ewok ally to assist dealing 50% reduced damage. If C-3PO is an ally: The assisting ally gains 10% Turn Meter.', effects: ['damage', 'assist'], aiTags: ['offensive'] },
      { id: 'chirpa_s1', name: 'Sound The Horn', type: 'special', cooldown: 3, desc: 'All Ewok allies gain: Offense Up (2 turns), Speed Up (2 turns). Then call the Ewok ally with the highest Offense to assist. If C-3PO is present: All Ewoks recover 10% Protection.', effects: ['Offense Up', 'Speed Up', 'assist', 'heal_protection'], aiTags: ['support'] },
      { id: 'chirpa_s2', name: 'Tribal Assault', type: 'special', cooldown: 4, desc: 'Call all Ewok allies to assist dealing 25% reduced damage. For each assisting Ewok: Recover 5% Health. If 3 or more Ewoks assist: Inflict Exposed (2 turns) on target enemy.', effects: ['assist_all', 'heal', 'Exposed'], aiTags: ['offensive'] },
      { id: 'chirpa_l', name: 'Bright Tree Chief', type: 'leader', cooldown: 0, desc: 'While Chirpa is Leader: Ewoks gain 25 Speed. Ewoks gain 20% Max Health. Whenever an Ewok attacks out of turn, recover 2% Health and Protection. Whenever an Ewok gains a buff, gain 2% Turn Meter. Ewoks deal 20% more damage to enemies below 50% Health.', effects: [], aiTags: [] },
      { id: 'chirpa_u', name: 'Trap: Ambush Signal', type: 'unique', cooldown: 0, desc: 'Trap begins battle armed. Trigger Condition: The first time an enemy falls below 50% Health. Trap Effect: All Ewoks gain 25% Turn Meter. All Ewoks immediately assist the weakest enemy dealing 50% reduced damage. This Trap can only trigger once per battle.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'wicket',
    name: 'Wicket',
    role: 'Attacker',
    tags: ['Rebel Alliance', 'Ewok'],
    era: 'CIVIL_WAR',
    image: '/units/wicket.webp',
    isLegend: false,
    abilities: [
      { id: 'wicket_b', name: 'Hunter\'s Strike', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Deal bonus damage if target is below 50% Health. If Leia Organa is an ally: Gain 5% Turn Meter.', effects: ['damage'], aiTags: ['offensive'] },
      { id: 'wicket_s1', name: 'Spear Rush', type: 'special', cooldown: 3, desc: 'Deal physical damage twice. If the target is below 50% Health: Inflict Exposed (2 turns). If Leia is present: Attack a third time dealing reduced damage.', effects: ['damage', 'Exposed'], aiTags: ['offensive'] },
      { id: 'wicket_s2', name: 'Endor Champion', type: 'special', cooldown: 4, desc: 'Gain: Offense Up (2 turns), Critical Damage Up (2 turns). Then deal massive physical damage. If target is defeated: Recover 50% Protection. Reduce cooldowns by 1. If Leia is present: Gain 20% Turn Meter.', effects: ['Offense Up', 'Critical Damage Up', 'damage_heavy'], aiTags: ['offensive'] },
      { id: 'wicket_u', name: 'Trap: Hunter\'s Snare', type: 'unique', cooldown: 0, desc: 'Trap begins battle armed. Trigger Condition: The first time an enemy falls below 30% Health. Trap Effect: Wicket gains Offense Up (2 turns). Wicket immediately attacks that enemy. If that attack defeats the target, reset the cooldown of Endor Champion. This Trap can only trigger once per battle.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'kneesaa',
    name: 'Kneesaa',
    role: 'Support',
    tags: ['Rebel Alliance', 'Ewok'],
    era: 'CIVIL_WAR',
    image: '/units/kneesaa.webp',
    isLegend: false,
    abilities: [
      { id: 'kneesaa_b', name: 'Forest Medicine', type: 'basic', cooldown: 0, desc: 'Deal physical damage. The weakest ally recovers 5% Health. If Leia Organa is present: Recover an additional 5% Protection.', effects: ['damage', 'heal'], aiTags: ['support'] },
      { id: 'kneesaa_s1', name: 'Tribal Remedy', type: 'special', cooldown: 3, desc: 'Dispel all debuffs from target ally. Target ally recovers: 20% Health, 20% Protection. If the target is Leia: Grant Foresight (1 turn).', effects: ['dispel_ally', 'heal', 'Foresight'], aiTags: ['support'] },
      { id: 'kneesaa_s2', name: 'Princess Of Endor', type: 'special', cooldown: 4, desc: 'All allies recover: 15% Health, 15% Protection. Grant Tenacity Up (2 turns) to all Ewok allies. If Leia is present: Leia recovers an additional 20% Protection. Reduce one random Leia cooldown by 1.', effects: ['heal_aoe', 'Tenacity Up'], aiTags: ['support'] },
      { id: 'kneesaa_u', name: 'Trap: Forest Refuge', type: 'unique', cooldown: 0, desc: 'Trap begins battle armed. Trigger Condition: The first time an Ewok ally falls below 40% Health. Trap Effect: That ally recovers 30% Health and Protection. Dispel all debuffs from that ally. If the ally is Leia Organa: Grant Foresight (1 turn). This Trap can only trigger once per battle.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'paploo',
    name: 'Paploo',
    role: 'Tank / Saboteur',
    tags: ['Rebel Alliance', 'Ewok'],
    era: 'CIVIL_WAR',
    image: '/units/paploo.webp',
    isLegend: false,
    abilities: [
      { id: 'paploo_b', name: 'Hit And Run', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Remove 5% Turn Meter from target enemy. Paploo gains 5% Turn Meter. If C-3PO is present: Remove an additional 5% Turn Meter.', effects: ['damage', 'turn_meter_reduction', 'turn_meter_gain'], aiTags: ['offensive'] },
      { id: 'paploo_s1', name: 'Stolen Speeder Bike', type: 'special', cooldown: 3, desc: 'Deal physical damage. Dispel all buffs from target enemy. Paploo gains: Speed Up (2 turns), Foresight (1 turn). If target had Taunt: Paploo gains 20% Turn Meter.', effects: ['damage', 'dispel_enemy', 'Speed Up', 'Foresight'], aiTags: ['offensive'] },
      { id: 'paploo_s2', name: 'You Can\'t Catch Me!', type: 'special', cooldown: 4, desc: 'Paploo gains Stealth (2 turns). All Ewok allies gain 10% Turn Meter. Target enemy loses 15% Turn Meter. If C-3PO is present: Ewok allies recover 10% Protection.', effects: ['Stealth', 'turn_meter_gain', 'turn_meter_reduction'], aiTags: ['support'] },
      { id: 'paploo_u', name: 'Trap: Tripwire', type: 'unique', cooldown: 0, desc: 'Trap begins battle armed. Trigger Condition: The first time an enemy gains Taunt. Trap Effect: Remove Taunt from that enemy. Paploo gains 100% Turn Meter. Paploo immediately uses Stolen Speeder Bike targeting that enemy. This Trap can only trigger once per battle.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'teebo',
    name: 'Teebo',
    role: 'Support / Saboteur',
    tags: ['Rebel Alliance', 'Ewok'],
    era: 'CIVIL_WAR',
    image: '/units/teebo.webp',
    isLegend: false,
    abilities: [
      { id: 'teebo_b', name: 'Hidden Hunter', type: 'basic', cooldown: 0, desc: 'Deal physical damage. 50% chance to inflict Daze (1 turn). If Teebo is Stealthed: Remove 5% Turn Meter from target enemy.', effects: ['damage', 'Daze', 'turn_meter_reduction'], aiTags: ['offensive'] },
      { id: 'teebo_s1', name: 'Forest Ambush', type: 'special', cooldown: 3, desc: 'Teebo gains Stealth (2 turns). Call another Ewok ally to assist. If C-3PO is present: Both Ewoks gain 10% Turn Meter.', effects: ['Stealth', 'assist', 'turn_meter_gain'], aiTags: ['support'] },
      { id: 'teebo_s2', name: 'Prepare The Trap', type: 'special', cooldown: 4, desc: 'Inflict: Ability Block (2 turns), Offense Down (2 turns) on target enemy. If target already had a debuff: Increase all cooldowns by 1. If the target is below 50% Health: Remove 15% Turn Meter.', effects: ['Ability Block', 'Offense Down', 'turn_meter_reduction'], aiTags: ['debuff'] },
      { id: 'teebo_u', name: 'Trap: Falling Log', type: 'unique', cooldown: 0, desc: 'Trap begins battle armed. Trigger Condition: The first time an enemy attacks out of turn. Trap Effect: Stun that enemy for 1 turn. Remove 20% Turn Meter from all enemies. All Ewok allies gain 10% Turn Meter. This Trap can only trigger once per battle.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'biggs',
    name: 'Biggs Darklighter',
    role: 'Leader / Tank',
    tags: ['Rebel Alliance', 'Red Squadron'],
    era: 'CIVIL_WAR',
    image: '/units/biggs.webp',
    isLegend: false,
    abilities: [
      { id: 'biggs_b', name: 'Covering Fire', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Grant the weakest Red Squadron ally Defense Up (2 turns).', effects: ['damage', 'Defense Up'], aiTags: ['offensive'] },
      { id: 'biggs_s1', name: 'Stay On My Wing', type: 'special', cooldown: 3, desc: 'Target ally gains: Defense Up (2 turns), Protection Up (15%). Then both Biggs and the target assist.', effects: ['Defense Up', 'Protection Up', 'assist'], aiTags: ['defensive'] },
      { id: 'biggs_s2', name: 'Lock S-Foils In Attack Position', type: 'special', cooldown: 4, desc: 'All Red Squadron allies gain: Offense Up (2 turns), Critical Chance Up (2 turns). Target enemy becomes Marked Target until defeated. Only one enemy can be Marked Target at a time.', effects: ['Offense Up', 'Critical Chance Up', 'Marked'], aiTags: ['support'] },
      { id: 'biggs_l', name: 'Red Leader', type: 'leader', cooldown: 0, desc: 'While Biggs is Leader: Red Squadron allies gain 25 Speed. Red Squadron allies gain 20% Max Health. Whenever a Red Squadron ally attacks Marked Target, recover 3% Protection. Red Squadron allies gain 20% Critical Damage against Marked Target.', effects: [], aiTags: [] },
      { id: 'biggs_u', name: 'Trusted Wingman', type: 'unique', cooldown: 0, desc: 'Whenever another Red Squadron ally falls below 50% Health: Biggs gains Taunt (1 turn). Whenever Marked Target is defeated: Biggs gains 20% Turn Meter.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'jek_porkins',
    name: 'Jek Porkins',
    role: 'Tank / Attacker',
    tags: ['Rebel Alliance', 'Red Squadron'],
    era: 'CIVIL_WAR',
    image: '/units/jek_porkins.webp',
    isLegend: false,
    abilities: [
      { id: 'porkins_b', name: 'Heavy Blaster', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Gain Protection Up (5%).', effects: ['damage', 'Protection Up'], aiTags: ['offensive'] },
      { id: 'porkins_s1', name: 'I\'ve Got A Problem Here', type: 'special', cooldown: 3, desc: 'Recover 25% Health and Protection. Gain Taunt (2 turns). If Marked Target exists: Gain Defense Up (2 turns).', effects: ['heal_self', 'Taunt', 'Defense Up'], aiTags: ['defensive'] },
      { id: 'porkins_s2', name: 'Full Power!', type: 'special', cooldown: 4, desc: 'Deal physical damage to target enemy. Deal bonus damage based on Porkins\' Max Health. If target is Marked Target: Stun for 1 turn.', effects: ['damage', 'Stun'], aiTags: ['offensive'] },
      { id: 'porkins_u', name: 'Can\'t Shake Him', type: 'unique', cooldown: 0, desc: 'Whenever Porkins loses Protection: Gain 2% Offense (stacking). Maximum 20 stacks.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'dak_ralter',
    name: 'Dak Ralter',
    role: 'Support',
    tags: ['Rebel Alliance', 'Red Squadron'],
    era: 'CIVIL_WAR',
    image: '/units/dak_ralter.webp',
    isLegend: false,
    abilities: [
      { id: 'dak_b', name: 'Target Callout', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Remove 5% Turn Meter.', effects: ['damage', 'turn_meter_reduction'], aiTags: ['support'] },
      { id: 'dak_s1', name: 'Watch That Fighter!', type: 'special', cooldown: 3, desc: 'Grant target ally: Offense Up (2 turns), Speed Up (2 turns). Then call them to assist. If they attack Marked Target: Gain 15% Turn Meter.', effects: ['Offense Up', 'Speed Up', 'assist', 'turn_meter_gain'], aiTags: ['support'] },
      { id: 'dak_s2', name: 'Attack Vector', type: 'special', cooldown: 4, desc: 'All Red Squadron allies gain 15% Turn Meter. Then the ally with the highest Offense attacks Marked Target.', effects: ['turn_meter_gain', 'assist'], aiTags: ['support'] },
      { id: 'dak_u', name: 'Combat Spotter', type: 'unique', cooldown: 0, desc: 'Whenever Marked Target is damaged: Dak gains 5% Turn Meter. Whenever Marked Target falls below 50% Health: All Red Squadron allies recover 10% Protection.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'wes_janson',
    name: 'Wes Janson',
    role: 'Attacker',
    tags: ['Rebel Alliance', 'Red Squadron'],
    era: 'CIVIL_WAR',
    image: '/units/wes_janson.webp',
    isLegend: false,
    abilities: [
      { id: 'wes_janson_b', name: 'Concussion Charge', type: 'basic', cooldown: 0, desc: 'Deal physical damage. 50% chance to inflict Defense Down (2 turns).', effects: ['damage', 'Defense Down'], aiTags: ['offensive'] },
      { id: 'wes_janson_s1', name: 'Bombing Run', type: 'special', cooldown: 3, desc: 'Deal physical damage to all enemies. Enemies with Defense Down take bonus damage.', effects: ['damage_aoe'], aiTags: ['aoe'] },
      { id: 'wes_janson_s2', name: 'Direct Hit!', type: 'special', cooldown: 4, desc: 'Deal massive physical damage. If target is Marked Target: Ignore Defense. Inflict Exposed (2 turns).', effects: ['damage_heavy', 'Exposed'], aiTags: ['offensive'] },
      { id: 'wes_janson_u', name: 'Payload Specialist', type: 'unique', cooldown: 0, desc: 'Whenever Marked Target is damaged: Wes gains 5% Critical Damage (stacking). Maximum 10 stacks.', effects: [], aiTags: [] }
    ]
  },
  {
    id: 'hobbie_klivian',
    name: 'Hobbie Klivian',
    role: 'Saboteur',
    tags: ['Rebel Alliance', 'Red Squadron'],
    era: 'CIVIL_WAR',
    image: '/units/hobbie_klivian.webp',
    isLegend: false,
    abilities: [
      { id: 'hobbie_b', name: 'Precision Burst', type: 'basic', cooldown: 0, desc: 'Deal physical damage. Inflict Accuracy Down (2 turns).', effects: ['damage', 'Accuracy Down'], aiTags: ['offensive'] },
      { id: 'hobbie_s1', name: 'Engine Failure', type: 'special', cooldown: 3, desc: 'Inflict: Speed Down (2 turns), Offense Down (2 turns). If target is Marked Target: Remove 15% Turn Meter.', effects: ['Speed Down', 'Offense Down', 'turn_meter_reduction'], aiTags: ['debuff'] },
      { id: 'hobbie_s2', name: 'Disable Systems', type: 'special', cooldown: 4, desc: 'Dispel all buffs from target enemy. Inflict Ability Block (1 turn). If target is Marked Target: Increase cooldowns by 1.', effects: ['dispel_enemy', 'Ability Block', 'cooldown_manipulation'], aiTags: ['debuff'] },
      { id: 'hobbie_u', name: 'Veteran Ace', type: 'unique', cooldown: 0, desc: 'Whenever Marked Target gains a buff: Hobbie gains 10% Turn Meter. Whenever Hobbie inflicts a debuff: Recover 5% Protection.', effects: [], aiTags: [] }
    ]
  }
];
