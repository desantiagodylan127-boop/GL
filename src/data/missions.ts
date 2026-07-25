import { MissionDef } from '../types';

export const MISSIONS: MissionDef[] = [
  // Daily Missions
  {
    id: 'daily_complete_battles',
    name: 'Complete Battles',
    description: 'Win 5 battles.',
    type: 'daily',
    target: 5,
    reward: { credits: 5000, crystals: 10 }
  },
  {
    id: 'daily_spend_energy',
    name: 'Spend Energy',
    description: 'Spend 50 Energy.',
    type: 'daily',
    target: 50,
    reward: { crystals: 10 }
  },
  {
    id: 'daily_complete_events',
    name: 'Event Coordinator',
    description: 'Complete 1 Event.',
    type: 'daily',
    target: 1,
    reward: { credits: 2000 }
  },
  {
    id: 'daily_upgrade_character',
    name: 'Upgrade a Character',
    description: 'Level up or gear up a character.',
    type: 'daily',
    target: 1,
    reward: { credits: 5000 }
  },
  {
    id: 'daily_all_complete',
    name: 'Daily Completionist',
    description: 'Complete all other Daily Missions.',
    type: 'daily',
    target: 4, // 4 other daily missions
    reward: { crystals: 50 }
  },

  // Weekly Missions
  {
    id: 'weekly_win_battles',
    name: 'Galactic Conqueror',
    description: 'Win 50 Battles.',
    type: 'weekly',
    target: 50,
    reward: { credits: 25000 }
  },
  {
    id: 'weekly_spend_energy',
    name: 'Resource Allocation',
    description: 'Spend 500 Energy.',
    type: 'weekly',
    target: 500,
    reward: { crystals: 100 }
  },
  {
    id: 'weekly_complete_events',
    name: 'Event Master',
    description: 'Complete 20 Events.',
    type: 'weekly',
    target: 20,
    reward: { credits: 15000 }
  },

  // Faction / Collection Achievements (Basic & Practical)
  {
    id: 'achieve_recruit_10',
    name: 'Recruit 10 Characters',
    description: 'Recruit 10 Characters to your roster.',
    type: 'achievement',
    target: 10,
    reward: { credits: 10000 }
  },
  {
    id: 'achieve_recruit_25',
    name: 'Assemble the Force',
    description: 'Recruit 25 Characters to your roster.',
    type: 'achievement',
    target: 25,
    reward: { crystals: 100 }
  },
  {
    id: 'achieve_recruit_50',
    name: 'Galactic Alliance',
    description: 'Recruit 50 Characters to your roster.',
    type: 'achievement',
    target: 50,
    reward: { crystals: 200 }
  },
  {
    id: 'achieve_recruit_100',
    name: 'Living Database',
    description: 'Recruit 100 Characters to your roster.',
    type: 'achievement',
    target: 100,
    reward: { crystals: 500 }
  },
  {
    id: 'achieve_max_level_1',
    name: 'Peak Performance',
    description: 'Reach Level 85 with 1 character.',
    type: 'achievement',
    target: 1,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_max_level_5',
    name: 'Veteran Strike Team',
    description: 'Reach Level 85 with 5 characters.',
    type: 'achievement',
    target: 5,
    reward: { crystals: 150 }
  },
  {
    id: 'achieve_max_level_20',
    name: 'Galactic Elite',
    description: 'Reach Level 85 with 20 characters.',
    type: 'achievement',
    target: 20,
    reward: { crystals: 300 }
  },
  {
    id: 'achieve_max_level_50',
    name: 'Grand Academy Director',
    description: 'Reach Level 85 with 50 characters.',
    type: 'achievement',
    target: 50,
    reward: { crystals: 750 }
  },
  {
    id: 'achieve_7star_1',
    name: 'Seven-Star Warrior',
    description: 'Upgrade 1 character to 7 Stars.',
    type: 'achievement',
    target: 1,
    reward: { credits: 100000 }
  },
  {
    id: 'achieve_7star_5',
    name: 'Seven-Star Squad',
    description: 'Upgrade 5 characters to 7 Stars.',
    type: 'achievement',
    target: 5,
    reward: { crystals: 100 }
  },
  {
    id: 'achieve_7star_20',
    name: 'Seven-Star Battalion',
    description: 'Upgrade 20 characters to 7 Stars.',
    type: 'achievement',
    target: 20,
    reward: { crystals: 250 }
  },
  {
    id: 'achieve_7star_50',
    name: 'Grand Marshal',
    description: 'Upgrade 50 characters to 7 Stars.',
    type: 'achievement',
    target: 50,
    reward: { crystals: 600 }
  },
  {
    id: 'achieve_gear12_1',
    name: 'Purple Vanguard',
    description: 'Upgrade 1 character to Gear Tier 12.',
    type: 'achievement',
    target: 1,
    reward: { credits: 150000 }
  },
  {
    id: 'achieve_gear12_5',
    name: 'Gear Tier 12 Squad',
    description: 'Upgrade 5 characters to Gear Tier 12.',
    type: 'achievement',
    target: 5,
    reward: { crystals: 100 }
  },
  {
    id: 'achieve_gear12_20',
    name: 'Gear Tier 12 Platoon',
    description: 'Upgrade 20 characters to Gear Tier 12.',
    type: 'achievement',
    target: 20,
    reward: { crystals: 300 }
  },
  {
    id: 'achieve_gear13_1',
    name: 'Golden Gladiator',
    description: 'Upgrade 1 character to Gear Tier 13.',
    type: 'achievement',
    target: 1,
    reward: { credits: 250000 }
  },
  {
    id: 'achieve_gear13_5',
    name: 'Gear Tier 13 Squad',
    description: 'Upgrade 5 characters to Gear Tier 13.',
    type: 'achievement',
    target: 5,
    reward: { crystals: 200 }
  },
  {
    id: 'achieve_gear13_20',
    name: 'Gear Tier 13 Division',
    description: 'Upgrade 20 characters to Gear Tier 13.',
    type: 'achievement',
    target: 20,
    reward: { crystals: 500 }
  },
  {
    id: 'achieve_relic_first',
    name: 'Relic Unleashed',
    description: 'Forge your first Relic Amplifier (Gear Tier 13 + 7★).',
    type: 'achievement',
    target: 1,
    reward: { credits: 100000, crystals: 100 }
  },
  {
    id: 'achieve_relic_5',
    name: 'Relic Strike Team',
    description: 'Forge 5 Relics on your characters.',
    type: 'achievement',
    target: 5,
    reward: { crystals: 250 }
  },
  {
    id: 'achieve_relic_20',
    name: 'Relic Vanguard',
    description: 'Forge 20 Relics on your characters.',
    type: 'achievement',
    target: 20,
    reward: { crystals: 600 }
  },
  {
    id: 'achieve_relic_50',
    name: 'Relic Overlord',
    description: 'Forge 50 Relics on your characters.',
    type: 'achievement',
    target: 50,
    reward: { crystals: 1000 }
  },
  {
    id: 'achieve_relic_r5_1',
    name: 'Veteran Relic',
    description: 'Upgrade 1 character to Relic Level 5.',
    type: 'achievement',
    target: 1,
    reward: { credits: 300000 }
  },
  {
    id: 'achieve_relic_r7_1',
    name: 'Legendary Relic',
    description: 'Upgrade 1 character to Relic Level 7.',
    type: 'achievement',
    target: 1,
    reward: { crystals: 200 }
  },
  {
    id: 'achieve_relic_r9_1',
    name: 'Ultimate Relic',
    description: 'Upgrade 1 character to Relic Level 9.',
    type: 'achievement',
    target: 1,
    reward: { crystals: 400 }
  },

  // Faction Unlocks (Specific Targets)
  {
    id: 'achieve_unlock_5_jedi',
    name: 'Jedi Guardian',
    description: 'Unlock 5 Jedi characters.',
    type: 'achievement',
    target: 5,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_unlock_15_jedi',
    name: 'Jedi Council Chamber',
    description: 'Unlock 15 Jedi characters.',
    type: 'achievement',
    target: 15,
    reward: { crystals: 150 }
  },
  {
    id: 'achieve_unlock_5_sith',
    name: 'Sith Apprentice',
    description: 'Unlock 5 Sith characters.',
    type: 'achievement',
    target: 5,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_unlock_15_sith',
    name: 'Sith Triumvirate',
    description: 'Unlock 15 Sith characters.',
    type: 'achievement',
    target: 15,
    reward: { crystals: 150 }
  },
  {
    id: 'achieve_unlock_5_clones',
    name: 'Clone Commander',
    description: 'Unlock 5 Clone Trooper characters.',
    type: 'achievement',
    target: 5,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_unlock_10_clones',
    name: 'Grand Army of the Republic',
    description: 'Unlock 10 Clone Trooper characters.',
    type: 'achievement',
    target: 10,
    reward: { crystals: 150 }
  },
  {
    id: 'achieve_unlock_5_empire',
    name: 'Imperial Officer',
    description: 'Unlock 5 Empire characters.',
    type: 'achievement',
    target: 5,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_unlock_15_empire',
    name: 'Imperial Legion',
    description: 'Unlock 15 Empire characters.',
    type: 'achievement',
    target: 15,
    reward: { crystals: 150 }
  },
  {
    id: 'achieve_unlock_5_rebel',
    name: 'Rebel Cell Leader',
    description: 'Unlock 5 Rebel characters.',
    type: 'achievement',
    target: 5,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_unlock_15_rebel',
    name: 'Alliance Fleet Command',
    description: 'Unlock 15 Rebel characters.',
    type: 'achievement',
    target: 15,
    reward: { crystals: 150 }
  },
  {
    id: 'achieve_unlock_5_mando',
    name: 'Mandalorian Clan',
    description: 'Unlock 5 Mandalorian characters.',
    type: 'achievement',
    target: 5,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_unlock_10_mando',
    name: 'Mandalore Reunited',
    description: 'Unlock 10 Mandalorian characters.',
    type: 'achievement',
    target: 10,
    reward: { crystals: 150 }
  },
  {
    id: 'achieve_unlock_5_droid',
    name: 'Automated Squad',
    description: 'Unlock 5 Droid characters.',
    type: 'achievement',
    target: 5,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_unlock_10_droid',
    name: 'Droid Uprising',
    description: 'Unlock 10 Droid characters.',
    type: 'achievement',
    target: 10,
    reward: { crystals: 150 }
  },
  {
    id: 'achieve_unlock_5_bounty',
    name: 'Guild Contractor',
    description: 'Unlock 5 Bounty Hunter characters.',
    type: 'achievement',
    target: 5,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_unlock_10_bounty',
    name: 'Death Warrant Registry',
    description: 'Unlock 10 Bounty Hunter characters.',
    type: 'achievement',
    target: 10,
    reward: { crystals: 150 }
  },
  {
    id: 'achieve_unlock_5_smuggler',
    name: 'Scoundrel\'s Wit',
    description: 'Unlock 5 Smuggler characters.',
    type: 'achievement',
    target: 5,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_unlock_5_sep',
    name: 'Confederacy Plotter',
    description: 'Unlock 5 Separatist characters.',
    type: 'achievement',
    target: 5,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_unlock_10_sep',
    name: 'Separatist War Council',
    description: 'Unlock 10 Separatist characters.',
    type: 'achievement',
    target: 10,
    reward: { crystals: 150 }
  },
  {
    id: 'achieve_unlock_5_inquisitor',
    name: 'Inquisition Tribunal',
    description: 'Unlock 5 Inquisitorius characters.',
    type: 'achievement',
    target: 5,
    reward: { credits: 50000 }
  },

  // GL / Special Unlocks
  {
    id: 'achieve_unlock_first_gl',
    name: 'Ultimate Figure',
    description: 'Unlock your first Galactic Legend character.',
    type: 'achievement',
    target: 1,
    reward: { crystals: 500 }
  },
  {
    id: 'achieve_unlock_3_gl',
    name: 'Council of Legends',
    description: 'Unlock 3 Galactic Legend characters.',
    type: 'achievement',
    target: 3,
    reward: { crystals: 1000 }
  },
  {
    id: 'achieve_legend_spark_first',
    name: 'Mythic Resonance',
    description: 'Ignite your first Legend Spark on a Galactic Legend.',
    type: 'achievement',
    target: 1,
    reward: { credits: 100000, crystals: 300 }
  },
  {
    id: 'achieve_legend_spark_5',
    name: 'Eternal Sparks',
    description: 'Ignite 5 total Legend Sparks across your roster.',
    type: 'achievement',
    target: 5,
    reward: { crystals: 400 }
  },

  // Resource / Cumulative Milestones (Basic & Practical)
  {
    id: 'achieve_earn_credits_1m',
    name: 'Wealthy Merchant',
    description: 'Earn a cumulative total of 1,000,000 Credits.',
    type: 'achievement',
    target: 1000000,
    reward: { crystals: 100 }
  },
  {
    id: 'achieve_earn_credits_10m',
    name: 'Baron of Corellia',
    description: 'Earn a cumulative total of 10,000,000 Credits.',
    type: 'achievement',
    target: 10000000,
    reward: { crystals: 500 }
  },
  {
    id: 'achieve_spend_energy_1k',
    name: 'Active Deployments',
    description: 'Spend 1,000 total Energy.',
    type: 'achievement',
    target: 1000,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_spend_energy_10k',
    name: 'Tireless Field Marshal',
    description: 'Spend 10,000 total Energy.',
    type: 'achievement',
    target: 10000,
    reward: { crystals: 300 }
  },
  {
    id: 'achieve_spend_energy_50k',
    name: 'Galactic Fuel Reactor',
    description: 'Spend 50,000 total Energy.',
    type: 'achievement',
    target: 50000,
    reward: { crystals: 1000 }
  },
  {
    id: 'achieve_win_battles_100',
    name: 'War Veteran',
    description: 'Win 100 battles across all modes.',
    type: 'achievement',
    target: 100,
    reward: { credits: 100000 }
  },
  {
    id: 'achieve_win_battles_500',
    name: 'Renowned Tactician',
    description: 'Win 500 battles across all modes.',
    type: 'achievement',
    target: 500,
    reward: { crystals: 300 }
  },
  {
    id: 'achieve_win_battles_2000',
    name: 'Supreme Galactic Overlord',
    description: 'Win 2,000 battles across all modes.',
    type: 'achievement',
    target: 2000,
    reward: { crystals: 1000 }
  },
  {
    id: 'achieve_complete_events_20',
    name: 'Event Aficionado',
    description: 'Complete 20 Events successfully.',
    type: 'achievement',
    target: 20,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_complete_events_100',
    name: 'Event Master Strategist',
    description: 'Complete 100 Events successfully.',
    type: 'achievement',
    target: 100,
    reward: { crystals: 300 }
  },
  {
    id: 'achieve_complete_raids_5',
    name: 'Raid Raider',
    description: 'Participate or achieve high scores in 5 Raid sessions.',
    type: 'achievement',
    target: 5,
    reward: { credits: 100000 }
  },
  {
    id: 'achieve_complete_conquest_nodes_20',
    name: 'Outer Rim Scout',
    description: 'Clear 20 Conquest Nodes.',
    type: 'achievement',
    target: 20,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_complete_conquest_sectors_5',
    name: 'Conquest Conqueror',
    description: 'Defeat 5 Conquest Sector bosses.',
    type: 'achievement',
    target: 5,
    reward: { crystals: 200 }
  },

  // Unique / Team Comp & Lore Milestones
  {
    id: 'achieve_unlock_spectre_5',
    name: 'Spark of Rebellion',
    description: 'Unlock 5 Spectre crew members (Hera, Sabine, Ezra, Chopper, Zeb).',
    type: 'achievement',
    target: 5,
    reward: { crystals: 200 }
  },
  {
    id: 'achieve_unlock_bad_batch',
    name: 'Clone Force 99',
    description: 'Unlock Hunter, Wrecker, Tech, Echo (Bad Batch), and Omega.',
    type: 'achievement',
    target: 5,
    reward: { crystals: 250 }
  },
  {
    id: 'achieve_unlock_isb_3',
    name: 'Tactical Surveillance',
    description: 'Unlock 3 Imperial Security Bureau (ISB) members (Dedra Meero, Partagaz, Krennic, or Voren).',
    type: 'achievement',
    target: 3,
    reward: { credits: 75000 }
  },
  {
    id: 'achieve_unlock_peridea_3',
    name: 'Peridea Exiles',
    description: 'Unlock 3 Peridea Trooper units.',
    type: 'achievement',
    target: 3,
    reward: { credits: 75000 }
  },
  {
    id: 'achieve_unlock_grey_jedi_3',
    name: 'Twilight Seekers',
    description: 'Unlock Baylan Skoll, Shin Hati, and Ahsoka Tano (The Grey).',
    type: 'achievement',
    target: 3,
    reward: { crystals: 300 }
  },
  {
    id: 'achieve_unlock_hutt_cartel_5',
    name: 'Underworld Syndicate',
    description: 'Unlock 5 Hutt Cartel characters.',
    type: 'achievement',
    target: 5,
    reward: { credits: 100000 }
  },
  {
    id: 'achieve_relic_anakin',
    name: 'Hero With No Fear',
    description: 'Upgrade Anakin Skywalker to Relic Level.',
    type: 'achievement',
    target: 1,
    reward: { credits: 100000 }
  },
  {
    id: 'achieve_relic_kenobi',
    name: 'Negotiator\'s Shield',
    description: 'Upgrade Obi-Wan Kenobi or Master Kenobi to Relic Level.',
    type: 'achievement',
    target: 1,
    reward: { crystals: 100 }
  },
  {
    id: 'achieve_relic_vader',
    name: 'Dark Lord of the Sith',
    description: 'Upgrade Lord Vader to Relic Level.',
    type: 'achievement',
    target: 1,
    reward: { crystals: 150 }
  },
  {
    id: 'achieve_relic_sidious',
    name: 'Ultimate Chancellor',
    description: 'Upgrade Galactic Legend Sidious to Relic Level.',
    type: 'achievement',
    target: 1,
    reward: { crystals: 200 }
  },
  {
    id: 'achieve_unlock_jocasta',
    name: 'Keeper of the Archives',
    description: 'Unlock Jocasta Nu.',
    type: 'achievement',
    target: 1,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_unlock_bo_katan',
    name: 'Mandalore\'s Sovereign',
    description: 'Unlock Bo-Katan (Mandalore).',
    type: 'achievement',
    target: 1,
    reward: { credits: 100000 }
  },
  {
    id: 'achieve_unlock_paz',
    name: 'Heavy Artillery Frontline',
    description: 'Unlock Paz Vizsla.',
    type: 'achievement',
    target: 1,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_unlock_aphra',
    name: 'Rogue Archaeologist',
    description: 'Unlock Doctor Aphra.',
    type: 'achievement',
    target: 1,
    reward: { crystals: 100 }
  },
  {
    id: 'achieve_relic_chewie',
    name: 'Loyal Companion Relic',
    description: 'Upgrade Chewbacca or Smuggler Chewbacca to Relic Level.',
    type: 'achievement',
    target: 1,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_relic_han',
    name: 'Always Shoot First',
    description: 'Upgrade Han Solo or General Han Solo to Relic Level.',
    type: 'achievement',
    target: 1,
    reward: { crystals: 100 }
  },
  {
    id: 'achieve_unlock_thrawn',
    name: 'Masterful Strategist',
    description: 'Unlock Grand Admiral Thrawn.',
    type: 'achievement',
    target: 1,
    reward: { crystals: 150 }
  },
  {
    id: 'achieve_relic_rex',
    name: 'Captain\'s Honor Guard',
    description: 'Upgrade Captain Rex or Rex (Lost Commander) to Relic Level.',
    type: 'achievement',
    target: 1,
    reward: { credits: 100000 }
  },
  {
    id: 'achieve_unlock_ewoks_5',
    name: 'Bright Tree Village Gathering',
    description: 'Unlock 5 Ewok characters.',
    type: 'achievement',
    target: 5,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_unlock_red_squad_3',
    name: 'Red Squadron, Standing By',
    description: 'Unlock Wedge Antilles, Biggs Darklighter, and Jek Porkins.',
    type: 'achievement',
    target: 3,
    reward: { credits: 100000 }
  },
  {
    id: 'achieve_relic_porkins',
    name: 'Full Throttle Jek',
    description: 'Upgrade Jek Porkins to Relic Level.',
    type: 'achievement',
    target: 1,
    reward: { crystals: 100 }
  },
  {
    id: 'achieve_unlock_geonosians_4',
    name: 'Hive Mind Colossus',
    description: 'Unlock 4 Geonosian characters.',
    type: 'achievement',
    target: 4,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_unlock_inquisitor_lead',
    name: 'Grand Inquisitor\'s Executioner',
    description: 'Unlock Grand Inquisitor or Third Sister (Reva).',
    type: 'achievement',
    target: 1,
    reward: { crystals: 250 }
  },
  {
    id: 'achieve_unlock_crimson_dawn_3',
    name: 'Crimson Dawn Syndicate',
    description: 'Unlock Maul, Savage Opress, and Qi\'ra.',
    type: 'achievement',
    target: 3,
    reward: { credits: 80000 }
  },
  {
    id: 'achieve_unlock_pirates_3',
    name: 'Ohnaka Pirate Crew',
    description: 'Unlock Hondo Ohnaka and 2 pirate allies.',
    type: 'achievement',
    target: 3,
    reward: { credits: 100000 }
  },
  {
    id: 'achieve_relic_talon',
    name: 'Blade of Battlefield Corruption',
    description: 'Upgrade Mire Talon to Relic Level.',
    type: 'achievement',
    target: 1,
    reward: { credits: 75000 }
  },
  {
    id: 'achieve_relic_voss',
    name: 'Warlord\'s Enduring Might',
    description: 'Upgrade Warlord Drake Voss to Relic Level.',
    type: 'achievement',
    target: 1,
    reward: { credits: 75000 }
  },
  {
    id: 'achieve_unlock_new_republic_5',
    name: 'New Republic Assembly',
    description: 'Unlock 5 New Republic units.',
    type: 'achievement',
    target: 5,
    reward: { credits: 100000 }
  },
  {
    id: 'achieve_unlock_remnants_5',
    name: 'Imperial Remnant Bastion',
    description: 'Unlock 5 Imperial Remnant units.',
    type: 'achievement',
    target: 5,
    reward: { credits: 100000 }
  },
  {
    id: 'achieve_complete_campaign_nodes_50',
    name: 'Outer Rim Campaigner',
    description: 'Clear 50 total Campaign Nodes.',
    type: 'achievement',
    target: 50,
    reward: { credits: 100000 }
  },
  {
    id: 'achieve_complete_campaign_nodes_150',
    name: 'Sector Grand Campaigner',
    description: 'Clear 150 total Campaign Nodes.',
    type: 'achievement',
    target: 150,
    reward: { crystals: 300 }
  },
  {
    id: 'achieve_completed_3star_25',
    name: 'Tactical Perfectionist',
    description: 'Clear 25 nodes with a flawless 3-Star rating.',
    type: 'achievement',
    target: 25,
    reward: { credits: 50000 }
  },
  {
    id: 'achieve_completed_3star_100',
    name: 'Master of Flawless Runs',
    description: 'Clear 100 nodes with a flawless 3-Star rating.',
    type: 'achievement',
    target: 100,
    reward: { crystals: 250 }
  },
  {
    id: 'achieve_spend_credits_500k',
    name: 'Active Galactic Spender',
    description: 'Spend 500,000 Credits in stores or character training.',
    type: 'achievement',
    target: 500000,
    reward: { credits: 25000 }
  },
  {
    id: 'achieve_spend_credits_5m',
    name: 'Banking Clan Magnate',
    description: 'Spend 5,000,000 Credits in stores or character training.',
    type: 'achievement',
    target: 5000000,
    reward: { crystals: 250 }
  },

  // Crazy / Secret / Lore-Specific Hidden Achievements (Revealed only upon progress > 0)
  {
    id: 'hidden_order_66',
    name: 'Execute Order 66',
    description: 'Defeat 66 Jedi in battles.',
    type: 'hidden',
    target: 66,
    reward: { title: 'Order 66 Executor' }
  },
  {
    id: 'hidden_somehow_returned',
    name: 'Somehow Returned',
    description: 'Win 100 battles with Emperor Palpatine or Sidious in your squad.',
    type: 'hidden',
    target: 100,
    reward: { title: 'The Senate' }
  },
  {
    id: 'hidden_i_hate_sand',
    name: 'I Hate Sand',
    description: 'Deploy Anakin Skywalker 500 times in combat operations.',
    type: 'hidden',
    target: 500,
    reward: { title: 'Sand Hater' }
  },
  {
    id: 'hidden_unlimited_power',
    name: 'UNLIMITED POWER!',
    description: 'Activate Palpatine\'s ultimate ability 25 times.',
    type: 'hidden',
    target: 25,
    reward: { title: 'Sith Emperor' }
  },
  {
    id: 'hidden_high_ground',
    name: 'I Have the High Ground',
    description: 'Win 50 battles with Obi-Wan Kenobi or Master Kenobi as the Leader.',
    type: 'hidden',
    target: 50,
    reward: { title: 'High Ground Master' }
  },
  {
    id: 'hidden_never_tell_odds',
    name: 'Never Tell Me the Odds',
    description: 'Win 30 battles with Han Solo or General Han Solo in your squad as a survivor.',
    type: 'hidden',
    target: 30,
    reward: { title: 'Scoundrel Captain' }
  },
  {
    id: 'hidden_rule_of_two',
    name: 'The Rule of Two',
    description: 'Have exactly two Sith characters at Relic Level 7 or higher.',
    type: 'hidden',
    target: 2,
    reward: { title: 'Sith Master' }
  },
  {
    id: 'hidden_this_is_the_way',
    name: 'This is the Way',
    description: 'Have both The Armorer and Din Djarin (Beskar) at Relic level.',
    type: 'hidden',
    target: 2,
    reward: { title: 'Mandalore Champion' }
  },
  {
    id: 'hidden_im_no_jedi',
    name: 'I\'m No Jedi',
    description: 'Win 50 battles with Ahsoka Tano (The Grey) in your squad.',
    type: 'hidden',
    target: 50,
    reward: { title: 'Grey Wanderer' }
  },
  {
    id: 'hidden_unconventional_tactics',
    name: 'Unconventional Tactics',
    description: 'Win 50 battles with a team consisting of both Light Side and Dark Side characters.',
    type: 'hidden',
    target: 50,
    reward: { title: 'Bendu Disciple' }
  }
];
