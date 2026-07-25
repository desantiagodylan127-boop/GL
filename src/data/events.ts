import { EventConfig, CampaignNode } from '../types';

function padEnemyTeam(enemies: string[]): string[] {
  if (enemies.length >= 5) return enemies;
  const result = [...enemies];
  
  // Identify the theme of the enemies
  const isJedi = enemies.some(e => e.includes('jedi') || e === 'plo_koon' || e === 'mace_windu' || e === 'yoda' || e === 'yaddle' || e === 'adi_gallia' || e === 'luminara_unduli');
  const isDroid = enemies.some(e => e.includes('droid') || e === 'magnaguard' || e === 'kelhani');
  const isClone = enemies.some(e => e.includes('clone') || e === 'captain_rex' || e === 'fives' || e === 'jesse' || e === 'hunter');
  const isEmpire = enemies.some(e => e.includes('trooper') || e === 'gideon' || e === 'darth_vader' || e === 'director_krennic' || e === 'royal_guard' || e === 'shadow_trooper');
  const isRebelOrSpectre = enemies.some(e => e === 'general_hera' || e === 'sabine_apprentice' || e === 'chopper' || e === 'ezra_exile' || e === 'jyn_erso' || e === 'cassian_andor');
  
  const jediPool = ['jedi_knight', 'plo_koon', 'mace_windu', 'luminara_unduli', 'adi_gallia'];
  const droidPool = ['b1_battle_droid', 'b2_super_droid', 'magnaguard', 'droideka', 'dwarf_spider_droid'];
  const clonePool = ['clone_trooper_212th', 'captain_rex', 'fives', 'jesse', 'echo_501st'];
  const empirePool = ['stormtrooper', 'shadow_trooper', 'royal_guard', 'death_trooper', 'dark_trooper'];
  const rebelPool = ['general_hera', 'sabine_apprentice', 'chopper', 'huyang', 'ezra_exile'];
  const scoundrelPool = ['greedo', 'boba_fett', 'crimson_dawn_soldier', 'hondo_ohnaka', 'cartel_enforcer'];

  let pool = scoundrelPool; // default fallback
  if (isJedi) pool = jediPool;
  else if (isDroid) pool = droidPool;
  else if (isClone) pool = clonePool;
  else if (isEmpire) pool = empirePool;
  else if (isRebelOrSpectre) pool = rebelPool;

  for (const item of pool) {
    if (result.length >= 5) break;
    if (!result.includes(item)) {
      result.push(item);
    }
  }

  // If still not 5 (due to duplicates), just add whatever is unique
  while (result.length < 5) {
    const next = pool[result.length % pool.length];
    result.push(next);
  }

  return result;
}

// Helper function to generate campaign nodes dynamically
function createNodesForEvent(
  eventId: string,
  eventType: string,
  enemiesPool: string[],
  rewardItemId: string,
  rewardsCountMultiplier: number = 1
): CampaignNode[] {
  const finalEnemies = padEnemyTeam(enemiesPool);

  if (eventType === 'Assault Battle') {
    return [
      {
        id: `${eventId}_t1`,
        planet: 'Various planets',
        sector: 'Tier I',
        nodeName: 'Tier I (Hard)',
        difficulty: 'Hard',
        energyCost: 0,
        powerRecommended: 12000,
        enemies: finalEnemies,
        rewards: [
          { itemId: 'credit', amountMin: 100000, amountMax: 100000, chance: 1 },
          { itemId: rewardItemId, amountMin: 10, amountMax: 10, chance: 1 }
        ]
      },
      {
        id: `${eventId}_t2`,
        planet: 'Various planets',
        sector: 'Tier II',
        nodeName: 'Tier II (Legend)',
        difficulty: 'Legend',
        energyCost: 0,
        powerRecommended: 20000,
        enemies: finalEnemies,
        rewards: [
          { itemId: 'carbonite_matrix', amountMin: 3, amountMax: 5, chance: 1 },
          { itemId: 'beskar_alloy', amountMin: 2, amountMax: 4, chance: 1 }
        ]
      },
      {
        id: `${eventId}_t3`,
        planet: 'Various planets',
        sector: 'Tier III',
        nodeName: 'Tier III (Galactic)',
        difficulty: 'Galactic',
        energyCost: 0,
        powerRecommended: 30000,
        enemies: finalEnemies,
        rewards: [
          { itemId: 'signal_data', amountMin: 5, amountMax: 10, chance: 1 },
          { itemId: 'dark_matter_core', amountMin: 1, amountMax: 2, chance: 1 }
        ]
      }
    ];
  } else if (eventType === 'Character Event') {
    return [
      {
        id: `${eventId}_t1`,
        planet: 'Jedi Temple Archive',
        sector: 'Tier I',
        nodeName: 'Tier I (Hard)',
        difficulty: 'Hard',
        energyCost: 0,
        powerRecommended: 15000,
        enemies: finalEnemies,
        rewards: [
          { itemId: 'credit', amountMin: 250000, amountMax: 250000, chance: 1 },
          { itemId: 'crystal', amountMin: 50, amountMax: 50, chance: 1 }
        ]
      },
      {
        id: `${eventId}_t2`,
        planet: 'Jedi Temple Archive',
        sector: 'Tier II',
        nodeName: 'Tier II (Galactic)',
        difficulty: 'Galactic',
        energyCost: 0,
        powerRecommended: 35000,
        enemies: finalEnemies,
        rewards: [
          { itemId: 'legend_shard', amountMin: 5, amountMax: 5, chance: 1 },
          { itemId: 'crystal', amountMin: 200, amountMax: 200, chance: 1 }
        ]
      }
    ];
  } else if (eventType === 'Marquee Event') {
    return [
      {
        id: `${eventId}_t1`,
        planet: 'Archive Outpost',
        sector: 'Showcase',
        nodeName: 'Recruit',
        difficulty: 'Normal',
        energyCost: 0,
        powerRecommended: 5000,
        enemies: finalEnemies,
        rewards: [
          { itemId: rewardItemId, amountMin: 330, amountMax: 330, chance: 1 },
          { itemId: 'credit', amountMin: 100000, amountMax: 100000, chance: 1 }
        ]
      }
    ];
  } else if (eventType === 'Elite Marquee') {
    return [
      {
        id: `${eventId}_t1`,
        planet: 'Tactical proving grounds',
        sector: 'Tier I',
        nodeName: 'Tier I (Hard)',
        difficulty: 'Hard',
        energyCost: 0,
        powerRecommended: 10000,
        enemies: finalEnemies,
        rewards: [
          { itemId: rewardItemId, amountMin: 50, amountMax: 50, chance: 1 },
          { itemId: 'credit', amountMin: 100000, amountMax: 100000, chance: 1 }
        ]
      },
      {
        id: `${eventId}_t2`,
        planet: 'Tactical proving grounds',
        sector: 'Tier II',
        nodeName: 'Tier II (Legend)',
        difficulty: 'Legend',
        energyCost: 0,
        powerRecommended: 22000,
        enemies: finalEnemies,
        rewards: [
          { itemId: rewardItemId, amountMin: 100, amountMax: 100, chance: 1 },
          { itemId: 'crystal', amountMin: 100, amountMax: 100, chance: 1 }
        ]
      },
      {
        id: `${eventId}_t3`,
        planet: 'Tactical proving grounds',
        sector: 'Tier III',
        nodeName: 'Tier III (Galactic)',
        difficulty: 'Galactic',
        energyCost: 0,
        powerRecommended: 32000,
        enemies: finalEnemies,
        rewards: [
          { itemId: rewardItemId, amountMin: 180, amountMax: 180, chance: 1 },
          { itemId: 'legend_shard', amountMin: 10, amountMax: 10, chance: 1 }
        ]
      }
    ];
  } else {
    // Material Battle or other
    const isCredit = rewardItemId === 'credit';
    const isCrystal = rewardItemId === 'crystal';
    const isSignal = rewardItemId === 'signal_data';
    const isBeskar = rewardItemId === 'beskar_alloy';

    let r1, r2, r3;
    if (isCredit) {
      r1 = [{ itemId: 'credit', amountMin: 150000 * rewardsCountMultiplier, amountMax: 250000 * rewardsCountMultiplier, chance: 1 }];
      r2 = [{ itemId: 'credit', amountMin: 250000 * rewardsCountMultiplier, amountMax: 500000 * rewardsCountMultiplier, chance: 1 }];
      r3 = [{ itemId: 'credit', amountMin: 500000 * rewardsCountMultiplier, amountMax: 1000000 * rewardsCountMultiplier, chance: 1 }];
    } else if (isCrystal) {
      r1 = [{ itemId: 'crystal', amountMin: 50 * rewardsCountMultiplier, amountMax: 100 * rewardsCountMultiplier, chance: 1 }];
      r2 = [{ itemId: 'crystal', amountMin: 100 * rewardsCountMultiplier, amountMax: 200 * rewardsCountMultiplier, chance: 1 }];
      r3 = [{ itemId: 'crystal', amountMin: 200 * rewardsCountMultiplier, amountMax: 400 * rewardsCountMultiplier, chance: 1 }];
    } else if (isSignal) {
      r1 = [{ itemId: 'signal_data', amountMin: 3 * rewardsCountMultiplier, amountMax: 6 * rewardsCountMultiplier, chance: 1 }];
      r2 = [{ itemId: 'signal_data', amountMin: 6 * rewardsCountMultiplier, amountMax: 12 * rewardsCountMultiplier, chance: 1 }];
      r3 = [{ itemId: 'signal_data', amountMin: 12 * rewardsCountMultiplier, amountMax: 24 * rewardsCountMultiplier, chance: 1 }];
    } else if (isBeskar) {
      r1 = [{ itemId: 'beskar_alloy', amountMin: 2 * rewardsCountMultiplier, amountMax: 4 * rewardsCountMultiplier, chance: 1 }];
      r2 = [
        { itemId: 'beskar_alloy', amountMin: 4 * rewardsCountMultiplier, amountMax: 8 * rewardsCountMultiplier, chance: 1 },
        { itemId: 'carbonite_matrix', amountMin: 2, amountMax: 5, chance: 1 }
      ];
      r3 = [
        { itemId: 'beskar_alloy', amountMin: 8 * rewardsCountMultiplier, amountMax: 16 * rewardsCountMultiplier, chance: 1 },
        { itemId: 'hyper_alloy', amountMin: 4, amountMax: 8, chance: 1 }
      ];
    } else {
      // relic/surplus fallback
      r1 = [{ itemId: 'imperial_command_circuits', amountMin: 2, amountMax: 4, chance: 1 }];
      r2 = [{ itemId: 'imperial_command_circuits', amountMin: 4, amountMax: 8, chance: 1 }];
      r3 = [
        { itemId: 'imperial_command_circuits', amountMin: 8, amountMax: 12, chance: 1 },
        { itemId: 'dark_matter_core', amountMin: 1, amountMax: 3, chance: 1 }
      ];
    }

    return [
      {
        id: `${eventId}_t1`,
        planet: 'Resource Zone',
        sector: 'Tier I',
        nodeName: 'Tier I (Normal)',
        difficulty: 'Normal',
        energyCost: 0,
        powerRecommended: 8000,
        enemies: finalEnemies,
        rewards: r1
      },
      {
        id: `${eventId}_t2`,
        planet: 'Resource Zone',
        sector: 'Tier II',
        nodeName: 'Tier II (Hard)',
        difficulty: 'Hard',
        energyCost: 0,
        powerRecommended: 16000,
        enemies: finalEnemies,
        rewards: r2
      },
      {
        id: `${eventId}_t3`,
        planet: 'Resource Zone',
        sector: 'Tier III',
        nodeName: 'Tier III (Legend)',
        difficulty: 'Legend',
        energyCost: 0,
        powerRecommended: 26000,
        enemies: finalEnemies,
        rewards: r3
      }
    ];
  }
}

// Complete programmatic list of all 120 unique events
const generatedEvents: EventConfig[] = [];

// ================= ASSAULT BATTLES (40 events) =================
const ASSAULT_BLUEPRINTS = [
  { name: 'Military Might', primary: ['Galactic Republic', 'Rebel'], enemy: ['Empire'], enemies: ['stormtrooper', 'royal_guard', 'shadow_trooper', 'darth_vader', 'gl_lord_vader'], reward: 'shards_captain_howzer', desc: 'Face the might of the Galactic Empire.' },
  { name: 'Droid Invasion', primary: ['Separatist'], enemy: ['Galactic Republic'], enemies: ['clone_trooper_212th', 'fives', 'captain_rex', 'general_skywalker'], reward: 'shards_b1_battle_droid', desc: 'Shatter the Grand Army of the Republic.' },
  { name: 'Crimson Reign', primary: ['Underworld', 'Hutt Cartel'], enemy: ['Empire'], enemies: ['stormtrooper', 'death_trooper', 'dark_trooper', 'gideon'], reward: 'shards_greedo', desc: 'Fight off Moff Gideons Imperial remnants.' },
  { name: 'Night of the Inquisitors', primary: ['Inquisitorius'], enemy: ['Jedi'], enemies: ['jedi_knight', 'plo_koon', 'mace_windu', 'yoda'], reward: 'shards_royal_guard', desc: 'Hunt the remaining Jedi survivors.' },
  { name: 'Imperial Crackdown', primary: ['Empire'], enemy: ['Rebel'], enemies: ['senator_organa', 'captain_antilles', 'han_solo', 'mon_mothma'], reward: 'shards_snowtrooper', desc: 'Quell the Rebellion on occupied worlds.' },
  { name: 'Mandalore Under Siege', primary: ['Mandalorian'], enemy: ['Empire'], enemies: ['stormtrooper', 'death_trooper', 'pre_vizsla', 'maul_mandalore'], reward: 'shards_bo_katan_death_watch', desc: 'Reclaim the capital of Mandalore.' },
  { name: 'Jedi Temple Purge', primary: ['Sith', 'Empire'], enemy: ['Jedi'], enemies: ['jedi_knight', 'plo_koon', 'mace_windu', 'yoda'], reward: 'shards_darth_vader', desc: 'Eliminate the remaining Jedi.' },
  { name: 'Rebel Strike Force', primary: ['Rebel'], enemy: ['Empire'], enemies: ['stormtrooper', 'death_trooper', 'gideon'], reward: 'shards_jyn_erso', desc: 'Launch a covert strike against Imperial caches.' },
  { name: 'Separatist Blockade', primary: ['Galactic Republic'], enemy: ['Separatist'], enemies: ['b1_battle_droid', 'b2_super_droid', 'magnaguard', 'general_grievous_droid'], reward: 'shards_captain_rex', desc: 'Break the Separatist vanguard.' },
  { name: 'Underworld Turf War', primary: ['Bounty Hunter', 'Scoundrel'], enemy: ['Underworld'], enemies: ['crimson_dawn_soldier', 'greedo', 'boba_fett', 'hondo_ohnaka'], reward: 'shards_bossk', desc: 'Clash with rival criminal enterprises.' }
];

for (let i = 0; i < 40; i++) {
  const bp = ASSAULT_BLUEPRINTS[i % ASSAULT_BLUEPRINTS.length];
  const iteration = Math.floor(i / ASSAULT_BLUEPRINTS.length);
  const phaseLetters = ['Alpha', 'Beta', 'Gamma', 'Delta'];
  const name = `${bp.name} - Phase ${phaseLetters[iteration]}`;
  const id = `ab_${bp.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_p${iteration + 1}`;
  
  generatedEvents.push({
    id,
    name,
    desc: `${bp.desc} (Assault Battle Phase ${phaseLetters[iteration]})`,
    type: 'Assault Battle',
    schedule: 'recurring',
    durationDays: 1,
    primaryFaction: bp.primary,
    enemyFaction: bp.enemy,
    nodes: createNodesForEvent(id, 'Assault Battle', bp.enemies, bp.reward, 1)
  });
}

// ================= CHARACTER EVENTS (35 events) =================
const CHAR_BLUEPRINTS = [
  { id: 'old_ben', name: "Ben Kenobi's Sacrifice", faction: ['Rebel Alliance'], enemies: ['stormtrooper', 'darth_vader'] },
  { id: 'thrawn_remnant', name: 'Remnant Command Protocols', faction: ['Imperial Remnant'], enemies: ['general_hera', 'sabine_apprentice'] },
  { id: 'general_skywalker', name: 'Clash on Kamino', faction: ['501st Clones'], enemies: ['b1_battle_droid', 'general_grievous_droid'] },
  { id: 'boba_fett_daimyo', name: "The Daimyo's Court", faction: ['Hutt Cartel'], enemies: ['greedo', 'boba_fett'] },
  { id: 'general_kenobi', name: "The Negotiator's Gambit", faction: ['Galactic Republic'], enemies: ['b1_battle_droid', 'general_grievous_droid'] },
  { id: 'general_grievous_droid', name: 'Malevolence Onslaught', faction: ['Separatist Droids'], enemies: ['clone_trooper_212th', 'general_kenobi'] },
  { id: 'grand_inquisitor', name: 'Inquisitorial Mandate', faction: ['Inquisitorius'], enemies: ['jedi_knight', 'plo_koon'] },
  { id: 'grand_admiral_trench', name: 'Tactical Siege Strategy', faction: ['Separatist'], enemies: ['clone_trooper_212th', 'general_kenobi'] },
  { id: 'director_krennic', name: 'Stardust Security', faction: ['Empire'], enemies: ['jyn_erso', 'cassian_andor'] },
  { id: 'admiral_raddus', name: 'Defiance at Scarif', faction: ['Rogue One'], enemies: ['stormtrooper', 'director_krennic'] },
  { id: 'plo_koon_journey', name: '104th Wolfpack Command', faction: ['Clone Trooper'], enemies: ['b1_battle_droid', 'b2_super_droid'] },
  { id: 'maul_mandalore', name: 'Shadow Collective Ascendant', faction: ['Underworld'], enemies: ['pre_vizsla', 'bo_katan_death_watch'] },
  { id: 'chancellor_palpatine_journey', name: 'Executive Orders Protocol', faction: ['Galactic Republic'], enemies: ['b1_battle_droid', 'general_grievous_droid'] },
  { id: 'ki_adi_mundi_journey', name: 'Galactic Marine Vanguard', faction: ['Galactic Republic'], enemies: ['b1_battle_droid', 'b2_super_droid'] },
  { id: 'crosshair_bb', name: 'Elite Squad Protocol', faction: ['Imperial Remnant'], enemies: ['hunter', 'wrecker'] },
  { id: 'pikk_mukmuk', name: 'Kowakian Mayhem', faction: ['Pirate'], enemies: ['stormtrooper', 'shadow_trooper'] },
  { id: 'qira_journey', name: 'Crimson Dawn Insurgency', faction: ['Crimson Dawn'], enemies: ['greedo', 'boba_fett'] },
  { id: 'gl_tarkin', name: 'Grand Doctrine Enforcer', faction: ['Empire'], enemies: ['jyn_erso', 'cassian_andor'] },
  { id: 'master_kenobi', name: 'High Ground Masterclass', faction: ['Galactic Republic'], enemies: ['gl_lord_vader', 'darth_vader'] },
  { id: 'eternal_fire_grievous', name: 'Unstoppable Cyborg Carnage', faction: ['Separatist'], enemies: ['clone_trooper_212th', 'general_kenobi'] },
  { id: 'gl_lord_vader', name: 'Temple March Vanguard', faction: ['Empire'], enemies: ['jedi_knight', 'mace_windu'] },
  { id: 'leia_gl', name: 'Endor Bunker Sabotage', faction: ['Rebel'], enemies: ['stormtrooper', 'royal_guard'] },
  { id: 'jabba', name: 'Cartel Dominion Protocol', faction: ['Hutt Cartel'], enemies: ['smuggler_chewbacca', 'han_solo'] },
  { id: 'mace_windu', name: 'Shatterpoint Perfection', faction: ['Jedi'], enemies: ['gl_lord_vader', 'darth_vader'] },
  { id: 'ezra_exile', name: "Exile's Redeeming Hope", faction: ['Rebel'], enemies: ['grand_admiral_thrawn', 'commander_enoch'] },
  { id: 'captain_pellaeon', name: 'Remnant Order Restored', faction: ['Imperial Remnant'], enemies: ['general_hera', 'sabine_apprentice'] },
  { id: 'bo_katan_mandalor', name: 'Mandalorians Unite', faction: ['Mandalorian'], enemies: ['gideon', 'dark_trooper'] },
  { id: 'ahsoka_tano_grey', name: "Fulcrum's Shadows", faction: ['Unaligned Force User'], enemies: ['grand_admiral_thrawn', 'commander_enoch'] },
  { id: 'grand_admiral_thrawn', name: 'Tactical Flaw Discovery', faction: ['Empire'], enemies: ['general_hera', 'sabine_apprentice'] },
  { id: 'hondo_ohnaka_gl', name: 'Ohnaka Pirate Enterprise', faction: ['Pirate'], enemies: ['stormtrooper', 'shadow_trooper'] },
  { id: 'maz_kanata_gl', name: 'Castle Defense Security', faction: ['Scoundrel'], enemies: ['stormtrooper', 'royal_guard'] },
  { id: 'immortal_admiral_trench', name: 'Immortal Mind Strategist', faction: ['Separatist'], enemies: ['clone_trooper_212th', 'general_kenobi'] },
  { id: 'starkiller', name: 'Unleashed Force Outburst', faction: ['Sith'], enemies: ['jedi_knight', 'mace_windu'] },
  { id: 'gl_darth_sidious', name: 'Sith Empire Supremacy', faction: ['Sith'], enemies: ['jedi_knight', 'mace_windu'] },
  { id: 'luke_skywalker_gl', name: "Jedi Knight's Final Stand", faction: ['Rebel'], enemies: ['stormtrooper', 'darth_vader'] }
];

CHAR_BLUEPRINTS.forEach(bp => {
  const id = `ce_event_${bp.id}`;
  generatedEvents.push({
    id,
    name: `${bp.name} (Character Event)`,
    desc: `Requires 7-Star ${bp.name}. Battle themed enemies to earn Legendary rewards.`,
    type: 'Character Event',
    schedule: 'recurring',
    durationDays: 1,
    primaryFaction: bp.faction,
    enemyFaction: ['Opposing Force'],
    requiredJourneyCharacterId: bp.id,
    nodes: createNodesForEvent(id, 'Character Event', bp.enemies, 'legend_shard', 1)
  });
});

// ================= LEGACY MARQUEES (15 events) =================
const LEGACY_BLUEPRINTS = [
  { id: 'emperor_palpatine', name: 'Emperor Palpatine', faction: ['Empire'], enemies: ['jyn_erso', 'cassian_andor'] },
  { id: 'darth_vader', name: 'Darth Vader', faction: ['Sith'], enemies: ['jedi_knight', 'mace_windu'] },
  { id: 'bossk', name: 'Bossk', faction: ['Bounty Hunter'], enemies: ['greedo', 'boba_fett'] },
  { id: 'aurra_sing', name: 'Aurra Sing', faction: ['Bounty Hunter'], enemies: ['greedo', 'boba_fett'] },
  { id: 'commander_cody', name: 'Commander Cody', faction: ['Clone Trooper'], enemies: ['b1_battle_droid', 'b2_super_droid'] },
  { id: 'marrok', name: 'Marrok', faction: ['Inquisitorius'], enemies: ['jedi_knight', 'plo_koon'] },
  { id: 'pre_vizsla', name: 'Pre Vizsla', faction: ['Mandalorian'], enemies: ['bo_katan_death_watch', 'dw_raider'] },
  { id: 'hunter', name: 'Hunter', faction: ['Clone Trooper'], enemies: ['b1_battle_droid', 'b2_super_droid'] },
  { id: 'dryden_vos', name: 'Dryden Vos', faction: ['Underworld'], enemies: ['greedo', 'boba_fett'] },
  { id: 'tobias_beckett', name: 'Tobias Beckett', faction: ['Scoundrel'], enemies: ['greedo', 'boba_fett'] },
  { id: 'kit_fisto', name: 'Kit Fisto', faction: ['Jedi'], enemies: ['b1_battle_droid', 'b2_super_droid'] },
  { id: 'plo_koon', name: 'Plo Koon', faction: ['Jedi'], enemies: ['b1_battle_droid', 'b2_super_droid'] },
  { id: 'nute_gunray', name: 'Nute Gunray', faction: ['Separatist'], enemies: ['clone_trooper_212th', 'general_kenobi'] },
  { id: 'jyn_erso', name: 'Jyn Erso', faction: ['Rogue One'], enemies: ['stormtrooper', 'director_krennic'] },
  { id: 'gideon', name: 'Moff Gideon', faction: ['Empire'], enemies: ['general_hera', 'sabine_apprentice'] }
];

LEGACY_BLUEPRINTS.forEach(bp => {
  const id = `lm_event_${bp.id}`;
  generatedEvents.push({
    id,
    name: `${bp.name} (Legacy Marquee)`,
    desc: `Weekly Showcase. Battle with ${bp.name} and their allies to earn 330 Shards!`,
    type: 'Marquee Event',
    schedule: 'weekly',
    durationDays: 7,
    primaryFaction: bp.faction,
    enemyFaction: ['Opponents'],
    marqueeCharId: bp.id,
    nodes: createNodesForEvent(id, 'Marquee Event', bp.enemies, `shards_${bp.id}`, 1)
  });
});

// ================= ELITE MARQUEES (5 events) =================
const ELITE_BLUEPRINTS = [
  { id: 'baylan_skoll', name: 'Baylan Skoll', faction: ['Exiles'], enemies: ['ahsoka_tano_grey', 'sabine_apprentice', 'huyang', 'general_hera'], reward: 'shards_baylan_skoll', desc: 'Assemble your Exiles and follow a path beyond Jedi and Sith to unlock Baylan Skoll.' },
  { id: 'doctor_aphra_event', name: 'Doctor Aphra', faction: ['Rogue Archaeologist'], enemies: ['stormtrooper', 'royal_guard', 'darth_vader'], reward: 'shards_doctor_aphra_event', desc: 'Raid ancient weapon vaults with Rogue Archaeologists to unlock Doctor Aphra.' },
  { id: 'savage_opress_dw', name: 'Savage Opress', faction: ['Death Watch'], enemies: ['clone_trooper_212th', 'general_kenobi'], reward: 'shards_savage_opress_dw', desc: 'Unleash the wrath of the Death Watch clan to unlock Savage Opress.' },
  { id: 'salacious_crumb', name: 'Salacious B. Crumb', faction: ['Hutt Cartel'], enemies: ['smuggler_chewbacca', 'han_solo', 'captain_antilles'], reward: 'shards_salacious_crumb', desc: 'Entertain Jabba the Hutt with Cartel members to unlock Salacious B. Crumb.' },
  { id: 'c3po', name: 'C-3PO', faction: ['Rebel Command'], enemies: ['stormtrooper', 'shadow_trooper', 'royal_guard', 'darth_vader'], reward: 'shards_c3po', desc: 'Coordinate Rebel Command tactics to unlock the golden protocol droid C-3PO.' }
];

ELITE_BLUEPRINTS.forEach(bp => {
  const id = `em_event_${bp.id}`;
  generatedEvents.push({
    id,
    name: `${bp.name} (Elite Marquee)`,
    desc: bp.desc,
    type: 'Elite Marquee',
    schedule: 'monthly',
    durationDays: 30,
    primaryFaction: bp.faction,
    enemyFaction: ['Proving Force'],
    nodes: createNodesForEvent(id, 'Elite Marquee', bp.enemies, bp.reward, 1)
  });
});

// ================= MATERIAL BATTLES (20 events) =================
const MAT_TYPES = [
  { category: 'Credit', reward: 'credit', enemies: ['crimson_dawn_soldier', 'greedo', 'boba_fett'] },
  { category: 'Crystal', reward: 'crystal', enemies: ['crimson_dawn_soldier', 'hondo_ohnaka', 'boba_fett'] },
  { category: 'Signal Data', reward: 'signal_data', enemies: ['stormtrooper', 'shadow_trooper', 'royal_guard'] },
  { category: 'Beskar Refinery', reward: 'beskar_alloy', enemies: ['crimson_dawn_soldier', 'pre_vizsla', 'maul_mandalore'] }
];

const MAT_LOCATIONS = [
  'Tatooine Outpost', 'Scarif Depot', 'Ilum Caves', 'Mandalore Forge', 'Sullust Factory'
];

for (let i = 0; i < 20; i++) {
  const typeBp = MAT_TYPES[i % MAT_TYPES.length];
  const loc = MAT_LOCATIONS[Math.floor(i / MAT_TYPES.length)];
  const id = `res_battle_${typeBp.category.toLowerCase().replace(/[^a-z0-9]/g, '_')}_loc${Math.floor(i / MAT_TYPES.length) + 1}`;
  
  generatedEvents.push({
    id,
    name: `${typeBp.category} Blast - ${loc}`,
    desc: `Secure essential ${typeBp.category} resources from local syndicates.`,
    type: 'Material Battle',
    schedule: 'daily',
    durationDays: 1,
    primaryFaction: ['Any'],
    enemyFaction: ['Syndicates'],
    nodes: createNodesForEvent(id, 'Material Battle', typeBp.enemies, typeBp.reward, 1)
  });
}

// ================= SPECIAL RANDOM EVENTS (5 events) =================
const SPECIAL_THEMES = [
  { id: 'sp_omega', name: 'Omega Battles: Coruscant', faction: ['Jedi'], enemies: ['b1_battle_droid', 'b2_super_droid'], reward: 'credit', desc: 'Defend the capital coordinates to earn Omega resources.' },
  { id: 'sp_contraband', name: 'Contraband Cargo Escort', faction: ['Scoundrel'], enemies: ['stormtrooper', 'shadow_trooper'], reward: 'crystal', desc: 'Secure illicit spice payloads against Imperial customs.' },
  { id: 'sp_endor', name: 'Endor Escalation Defiance', faction: ['Ewok'], enemies: ['stormtrooper', 'royal_guard'], reward: 'credit', desc: 'Help Ewok forest tribes raid Imperial shield outposts.' },
  { id: 'sp_dathomir', name: 'Defense of Dathomir Coven', faction: ['Nightsister'], enemies: ['b1_battle_droid', 'general_grievous_droid'], reward: 'crystal', desc: 'Defend the sacred ritual grounds from Separatist droids.' },
  { id: 'sp_ghosts', name: 'Ghosts of Dathomir Crypts', faction: ['Nightsister'], enemies: ['jedi_knight', 'plo_koon'], reward: 'credit', desc: 'Purge ancestral tombs of uninvited tomb raiders.' }
];

SPECIAL_THEMES.forEach(bp => {
  generatedEvents.push({
    id: bp.id,
    name: bp.name,
    desc: bp.desc,
    type: 'Special Event',
    schedule: 'recurring',
    durationDays: 2,
    primaryFaction: bp.faction,
    enemyFaction: ['Attackers'],
    nodes: createNodesForEvent(bp.id, 'Material Battle', bp.enemies, bp.reward, 1)
  });
});

export const EVENTS: EventConfig[] = generatedEvents;
export const EVENT_BONUSES: Record<string, string> = {};
