import { RaidConfig } from '../types';

export const RAID_SCHEDULE = [
  { dayIndex: 0, dayName: 'Sunday', raidId: 'duel_of_the_fates', characterId: 'darth_maul_theed' },
  { dayIndex: 1, dayName: 'Monday', raidId: 'battle_of_kamino', characterId: 'shaak_ti' },
  { dayIndex: 2, dayName: 'Tuesday', raidId: 'rescue_of_rotta', characterId: 'rotta_hutt' },
  { dayIndex: 3, dayName: 'Wednesday', raidId: 'fortress_inquisitorius_raid', characterId: 'eeth_koth' },
  { dayIndex: 4, dayName: 'Thursday', raidId: 'geonosian_coliseum', characterId: 'commander_bly' },
  { dayIndex: 5, dayName: 'Friday', raidId: 'battle_of_hoth', characterId: 'atat_driver' },
  { dayIndex: 6, dayName: 'Saturday', raidId: 'spark_eternal_raid', characterId: 'ig90' },
];

export const RAIDS: RaidConfig[] = [
  {
    id: 'duel_of_the_fates',
    name: 'Duel of the Fates',
    bossName: 'Darth Maul',
    desc: 'Relive the iconic Naboo showdown! Push through the Trade Federation invasion forces of Theed, bypass the rotating laser power grids, and engage Darth Maul in a pure test of tactical focus.',
    recommendedFactions: ['Jedi', 'Sith', 'Galactic Republic'],
    phases: [
      {
        phaseNumber: 1,
        bossId: 'battle_droid_officer',
        bossHp: 250000,
        environmentalEffects: ['Occupation', 'Civilian Panic'],
        mechanics: [
          'Civilian Panic fills over time.',
          'At maximum Panic: Battle Droids gain Offense Up.',
          'Defeat Officer units to reduce Panic levels.'
        ],
        objectiveDesc: 'Invasion of Theed - Push back the Trade Federation invasion of Theed.',
        additionalEnemyIds: ['b1_battle_droid', 'b2_super_battle_droid', 'droideka'],
        background: 'naboo-plains'
      },
      {
        phaseNumber: 2,
        bossId: 'droideka_elite',
        bossHp: 500000,
        environmentalEffects: ['Laser Gates', 'Energy Fields'],
        mechanics: [
          'The battlefield is split into two separate compartments.',
          'Every two turns: Laser gates rotate.',
          'Only characters on the same side may target each other.'
        ],
        objectiveDesc: 'The Power Generator - Navigate rotating laser gates split across platforms.',
        additionalEnemyIds: ['b1_battle_droid', 'droideka', 'security_droid'],
        background: 'theed-generator-shaft'
      },
      {
        phaseNumber: 3,
        bossId: 'darth_maul_theed',
        bossHp: 1200000,
        environmentalEffects: ['Duel of the Fates', 'Stance Shift'],
        mechanics: [
          'No supporting minions! Maul fights alone, progressing through combat stances.',
          'Hunter: High Speed, frequent Bonus Turns.',
          'Aggressor: Massive Offense, reduced Defense.',
          'Cornered: Ignores Taunt, uses abilities twice.'
        ],
        objectiveDesc: 'Boss: Darth Maul - Duel the Sith Apprentice in the reactor core.',
        additionalEnemyIds: [],
        background: 'naboo-palace'
      }
    ]
  },
  {
    id: 'battle_of_kamino',
    name: 'Battle of Kamino',
    bossName: 'Asajj Ventress & Separatist Invaders',
    desc: 'Infiltrate and defend Tipoca City under siege from Separatist landing forces led by Asajj Ventress. Hold the lines against endless droids, ride out the rising tides, and secure Kamino\'s cloning facilities.',
    recommendedFactions: ['Clone Trooper', 'Galactic Republic', 'Jedi'],
    phases: [
      {
        phaseNumber: 1,
        bossId: 'bx_commando_droid',
        bossHp: 220000,
        environmentalEffects: ['Rising Tide', 'Tipoca City Defenses'],
        mechanics: [
          'Every turn, Kamino floods.',
          'Every 3 turns: All units gain Speed Up, Droids recover 5% Protection, Clone Troopers gain 10% Turn Meter.',
          'The battlefield becomes faster as the raid progresses.'
        ],
        objectiveDesc: 'Tipoca City Defense - Fight through waves of B1s, Aqua Droids and Commando Droids.',
        additionalEnemyIds: ['b1_battle_droid', 'bx_commando_droid', 'b2_super_battle_droid'],
        background: 'kamino-platform'
      },
      {
        phaseNumber: 2,
        bossId: 'droideka',
        bossHp: 450000,
        environmentalEffects: ['Hold The Line', 'Heavy Separatist Deployment'],
        mechanics: [
          'Push through Separatist landing forces.',
          'Enemies deploy heavier units including Droidekas and Super Tactical Droids.',
          'If two Clone allies fall below 50% Health simultaneously: Republic reinforcements grant all allies Protection Up.'
        ],
        objectiveDesc: 'The Invasion - Push through Separatist landing forces and protect cloning labs.',
        additionalEnemyIds: ['droideka', 'b2_super_battle_droid', 'tactical_droid'],
        background: 'kamino-hangar'
      },
      {
        phaseNumber: 3,
        bossId: 'asajj_ventress',
        bossHp: 900000,
        environmentalEffects: ['Endless Reinforcements', 'Dark Assassin Strikes'],
        mechanics: [
          'When a Droid is defeated: A weaker replacement joins after one turn.',
          'Victory comes from defeating Ventress rather than clearing every Droid.'
        ],
        objectiveDesc: 'Boss: Asajj Ventress - Defeat Ventress in the clone chamber before she sabotages the facility.',
        additionalEnemyIds: ['tactical_droid', 'magnaguard', 'b2_super_battle_droid', 'droideka'],
        background: 'kamino-lab'
      }
    ]
  },
  {
    id: 'rescue_of_rotta',
    name: 'Rescue of Rotta',
    bossName: 'Asajj Ventress',
    desc: 'Rescue Jabba the Hutt\'s kidnapped son! Secure Jabba\'s agreement, climb the sheer cliffs of the B\'omarr Monastery under bombardment, and break Ventress\' concentration to save Rotta!',
    recommendedFactions: ['Hutt Cartel', 'Bounty Hunter', 'Tusken'],
    phases: [
      {
        phaseNumber: 1,
        bossId: 'hired_gun_leader',
        bossHp: 260000,
        environmentalEffects: ['Jabba\'s Deal', 'Protect the Child'],
        mechanics: [
          'Rotta accompanies your squad but cannot attack.',
          'If Rotta loses all Protection: The entire team loses 25% Offense until he is healed.'
        ],
        objectiveDesc: 'Jabba\'s Deal - Fight through Dooku\'s hired guns and protect Rotta.',
        additionalEnemyIds: ['magnaguard', 'bx_commando_droid', 'ig86_assassin_droid', 'b1_battle_droid'],
        background: 'mos-eisley-streets'
      },
      {
        phaseNumber: 2,
        bossId: 'nightsister_guardian',
        bossHp: 520000,
        environmentalEffects: ['Steep Climb', 'Falling Rubble'],
        mechanics: [
          'Every turn: Falling rubble damages all active units.',
          'Destroy support pillars to temporarily disable the environmental hazard.'
        ],
        objectiveDesc: 'B\'omarr Monastery - Scale the cliffs and breach the gates.',
        additionalEnemyIds: ['nightsister_zombie', 'nightsister_acolyte', 'magnaguard', 'assassin_droid'],
        background: 'jabbas-palace'
      },
      {
        phaseNumber: 3,
        bossId: 'asajj_ventress',
        bossHp: 1100000,
        environmentalEffects: ['Hostage Exchange', 'Force Concentration'],
        mechanics: [
          'Rotta is placed in the center of the battlefield.',
          'Every 20% Boss Health lost: Ventress attempts to seize Rotta.',
          'Break her focus by dealing sufficient damage within 2 turns.',
          'If she succeeds: Ventress heals, gains Foresight, and takes a Bonus Turn.'
        ],
        objectiveDesc: 'Boss: Asajj Ventress - Rescue Rotta and defeat Ventress in the main temple hall.',
        additionalEnemyIds: ['durge', 'bx_commando_droid', 'magnaguard', 'tactical_droid'],
        background: 'tatooine-junkyard'
      }
    ]
  },
  {
    id: 'fortress_inquisitorius_raid',
    name: 'Fortress Inquisitorius',
    bossName: 'The Grand Inquisitor',
    desc: 'Shatter the deep-sea military headquarters of the Inquisitorial Order. Navigate heavy ocean platforms, rescue captured allies from automated cells, and survive the Grand Inquisitor\'s ruthless hunt.',
    recommendedFactions: ['Jedi', 'Jedi High Council', 'Inquisitorius'],
    phases: [
      {
        phaseNumber: 1,
        bossId: 'purge_trooper',
        bossHp: 260000,
        environmentalEffects: ['Heavy Seas', 'Slick Platforms'],
        mechanics: [
          'Every 4 turns: A heavy wave crashes across the slick ocean platform.',
          'Random characters become Off Balance (Lose 20 Speed, cannot Counter).',
          'Empire and Inquisitor units are immune.'
        ],
        objectiveDesc: 'Ocean Assault - Fight across the slick platforms outside the Fortress.',
        additionalEnemyIds: ['purge_trooper', 'death_trooper', 'stormtrooper'],
        background: 'fortress-ocean-exterior'
      },
      {
        phaseNumber: 2,
        bossId: 'fifth_brother',
        bossHp: 520000,
        environmentalEffects: ['Interrogation Lockdown', 'Captured Allies'],
        mechanics: [
          'Every few turns: One ally becomes Captured (cannot act).',
          'Destroy the Interrogation Console to free them immediately.',
          'If not rescued in 3 turns: Returns with Ability Block and Healing Immunity.'
        ],
        objectiveDesc: 'Prison Blocks - Infiltrate the holding cells and disable interrogation devices.',
        additionalEnemyIds: ['fifth_brother', 'seventh_sister', 'purge_trooper', 'security_droid'],
        background: 'fortress-prison-block'
      },
      {
        phaseNumber: 3,
        bossId: 'grand_inquisitor',
        bossHp: 1100000,
        environmentalEffects: ['The Hunt', 'Inquisitor Strategy'],
        mechanics: [
          'Every 25% Health lost: Grand Inquisitor targets the highest-Offense enemy to become Hunted.',
          'Hunted units cannot Stealth and receive 50% extra damage from Inquisitors.',
          'Defeating supporting Inquisitors removes Hunted early.'
        ],
        objectiveDesc: 'Boss: Grand Inquisitor - Duel the Grand Inquisitor on the central hangar bay.',
        additionalEnemyIds: ['eighth_brother', 'ninth_sister', 'purge_commander', 'fortress_security_droid'],
        background: 'fortress-interrogation-chamber'
      }
    ]
  },
  {
    id: 'geonosian_coliseum',
    name: 'Geonosian Coliseum',
    bossName: 'Poggle the Lesser & Coliseum Monsters',
    desc: 'Fight for the amusement of Count Dooku! Evade the Nexu, Acklay, and Reek, bypass Geonosian factory assembly lines, and defeat Poggle the Lesser in a high-stakes arena showdown.',
    recommendedFactions: ['Geonosian', 'Separatist', 'Droid'],
    phases: [
      {
        phaseNumber: 1,
        bossId: 'acklay_raid',
        bossHp: 280000,
        environmentalEffects: ['Arena Favor', 'Crowd Excitement'],
        mechanics: [
          'Whenever an ally defeats an enemy: Gain 1 Crowd Favor.',
          'At 10 Crowd Favor, choose: Heal team, Summon Geonosian Drone, or grant Offense Up to all allies.',
          'Defeat the Arena Handler and the beasts: Nexu, Acklay, and Reek.'
        ],
        objectiveDesc: 'The Arena - Defeat the coliseum handlers and wild beasts.',
        additionalEnemyIds: ['nexu', 'acklay', 'reek', 'arena_handler', 'geonosian_handler'],
        background: 'geonosis-arena'
      },
      {
        phaseNumber: 2,
        bossId: 'tactical_droid',
        bossHp: 500000,
        environmentalEffects: ['Factory Output', 'Assembly Lines'],
        mechanics: [
          'Every 3 turns: A random defeated Separatist Droid is completely rebuilt.',
          'Destroy the Assembly Console to disable rebuilding for 3 turns.'
        ],
        objectiveDesc: 'Droid Assembly Lines - Bypass security and shut down the rebuilding console.',
        additionalEnemyIds: ['b1_battle_droid', 'b2_super_battle_droid', 'droideka', 'tactical_droid'],
        background: 'geonosis-factory'
      },
      {
        phaseNumber: 3,
        bossId: 'poggle_the_lesser',
        bossHp: 1000000,
        environmentalEffects: ['Hive Network', 'Foundry Power Core'],
        mechanics: [
          'The Foundry Core is completely immune while Poggle or any Geonosian Leader lives.',
          'Poggle continuously calls Geonosian reinforcements.',
          'Destroying the Core removes Hive Network; Poggle enters Last Stand (Massive Offense, no summons).'
        ],
        objectiveDesc: 'Boss: Poggle the Lesser - Overrun the foundry defenses and destroy the core.',
        additionalEnemyIds: ['sun_fac', 'geonosian_brood_alpha', 'tactical_droid', 'droid_foundry_core'],
        background: 'geonosis-hive'
      }
    ]
  },
  {
    id: 'battle_of_hoth',
    name: 'Battle of Hoth',
    bossName: 'Rogue Squadron & Echo Base Defenders',
    desc: 'Fight through the frozen battlefields of Hoth! Overrun the perimeter Shield Generator defenses, escort massive AT-AT walkers across the snow ridges, and defeat Luke Skywalker\'s legendary Rogue Squadron.',
    recommendedFactions: ['Imperial Trooper', 'Empire', 'Imperial Remnant'],
    phases: [
      {
        phaseNumber: 1,
        bossId: 'rebel_officer',
        bossHp: 240000,
        environmentalEffects: ['Blizzard Conditions', 'Echo Base Perimeter'],
        mechanics: [
          'Fight Rebel infantry through Echo Base.',
          'Every other turn: Random enemies gain Foresight.',
          'Imperial Troopers ignore this effect.'
        ],
        objectiveDesc: 'Shield Generator Assault - Fight Rebel infantry through Echo Base.',
        additionalEnemyIds: ['rebel_pathfinder', 'rebel_trooper', 'rebel_commando'],
        background: 'hoth-blizzard'
      },
      {
        phaseNumber: 2,
        bossId: 'rebel_commando',
        bossHp: 500000,
        environmentalEffects: ['Walker Advance', 'Glacier Spearman Force'],
        mechanics: [
          'Escort AT-ATs toward Echo Base.',
          'Every turn the walkers survive: Empire allies gain stacking Offense.',
          'If both walkers are destroyed: Enemies gain massive buffs.'
        ],
        objectiveDesc: 'Advance The Walkers - Escort AT-ATs toward Echo Base and bypass defensive trenches.',
        additionalEnemyIds: ['rebel_pathfinder', 'rebel_trooper', 'rebel_officer'],
        background: 'hoth-base'
      },
      {
        phaseNumber: 3,
        bossId: 'luke_skywalker_gl',
        bossHp: 1000000,
        environmentalEffects: ['Tow Cable Harpoon', 'Air Combat Wing'],
        mechanics: [
          'Every few turns: A walker becomes Disabled.',
          'Destroy the Snowspeeders before all walkers fall.',
          'If all three walkers are destroyed, the raid is lost.'
        ],
        objectiveDesc: 'Boss: Rogue Squadron - Fight Luke Skywalker, Wedge Antilles, and Dak Ralter. Protect the walkers!',
        additionalEnemyIds: ['wedge_antilles', 'dak_ralter', 'rebel_commando', 'rebel_officer'],
        background: 'hoth-cave'
      }
    ]
  },
  {
    id: 'spark_eternal_raid',
    name: 'The Spark Eternal',
    bossName: 'Corrupted Guardians & Rogue Mercenaries',
    desc: 'Infiltrate an ancient vault housing pre-Republic technology. Evade defense systems, secure high-value relics from rogue mercenaries, and battle the corrupted Spark Eternal as it possesses powerful droid shells.',
    recommendedFactions: ['Rogue Archaeologist', 'Droid', 'Scoundrel'],
    phases: [
      {
        phaseNumber: 1,
        bossId: 'crab_droid',
        bossHp: 250000,
        environmentalEffects: ['Ancient Technology', 'Vault Security Field'],
        mechanics: [
          'Fight security systems inside the ancient vault.',
          'Random Artifacts activate throughout battle.',
          'Whoever controls them gains bonuses.'
        ],
        objectiveDesc: 'Ancient Vault - Bypass automated security and activate structural relays.',
        additionalEnemyIds: ['b1_battle_droid', 'b2_super_battle_droid', 'tactical_droid'],
        background: 'ancient-vault-entrance'
      },
      {
        phaseNumber: 2,
        bossId: 'gwarm',
        bossHp: 480000,
        environmentalEffects: ['Artifact Control', 'Mercenary Crossfire'],
        mechanics: [
          'Battle rogue mercenaries while recovering relics.',
          'Each recovered Artifact grants stacking bonuses.',
          'Lose one if its carrier is defeated.'
        ],
        objectiveDesc: 'Artifact Retrieval - Battle rogue mercenaries while recovering relics.',
        additionalEnemyIds: ['pikk_mukmuk', 'captain_ithano', 'quiggold'],
        background: 'relic-chamber'
      },
      {
        phaseNumber: 3,
        bossId: 'ig_88',
        bossHp: 1100000,
        environmentalEffects: ['Possession Frequency', 'Corrupted Droid Core'],
        mechanics: [
          'Every few turns: Spark Eternal possesses a random Droid.',
          'Possessed units gain massive Offense but lose Defense.'
        ],
        objectiveDesc: 'Boss: Spark Eternal - Defeat the possessed assassin droid vessel before it overloads.',
        additionalEnemyIds: ['b1_battle_droid', 'b2_super_battle_droid', 'tactical_droid', 'magnaguard'],
        background: 'corrupted-core-chamber'
      }
    ]
  }
];
