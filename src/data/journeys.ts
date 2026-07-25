import { JourneyConfig, JourneyPrereqItem } from '../types';

export const JOURNEY_CONFIGS: JourneyConfig[] = [
  // TIER 1
  {
    id: 'j_old_ben',
    name: 'A New Hope',
    desc: 'Relive the legendary journey of Obi-Wan Kenobi. Command the Rebel allies on Tatooine and the Death Star, culminating in the ultimate sacrifice.',
    isGalacticLegend: false,
    journeyTier: 1,
    rewardCharacterId: 'old_ben',
    recommendedPower: 4000,
    phases: [
      {
        phaseNumber: 1,
        description: 'The Streets of Mos Eisley',
        levelReq: 85, gearReq: 10, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['stormtrooper_luke', 'senator_organa', 'smuggler_chewbacca', 'stormtrooper_han', 'r2d2'],
        enemies: ['sandtrooper', 'stormtrooper', 'stormtrooper', 'sandtrooper', 'imperial_officer'],
        rewards: [{ itemId: 'shards_old_ben', amount: 100 }],
        background: 'environment-mos-eisley-streets',
        objective: 'Defeat all Imperial forces.',
        story: 'Disguised as Imperial soldiers, Luke and his allies attempt to escort Princess Leia safely through Mos Eisley while Imperial patrols search the city.'
      },
      {
        phaseNumber: 2,
        description: 'The Hangar Escape',
        levelReq: 85, gearReq: 10, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['stormtrooper_luke', 'senator_organa', 'smuggler_chewbacca', 'stormtrooper_han', 'r2d2'],
        enemies: [],
        enemyWaves: [
          ['imperial_officer', 'stormtrooper', 'stormtrooper', 'stormtrooper', 'stormtrooper'],
          ['death_trooper', 'stormtrooper', 'stormtrooper', 'imperial_officer']
        ],
        rewards: [{ itemId: 'shards_old_ben', amount: 100 }],
        background: 'environment-mos-eisley-docking-bay-94',
        objective: 'Survive both Imperial assault waves.',
        story: 'The Empire discovers the Millennium Falcon before takeoff. Han and Chewbacca hold the line while Luke protects Leia and R2-D2.'
      },
      {
        phaseNumber: 3,
        description: 'Duel on the Death Star',
        levelReq: 85, gearReq: 10, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['stormtrooper_luke', 'stormtrooper_han'],
        loanedPlayerSquad: ['old_ben', 'stormtrooper_luke', 'stormtrooper_han'],
        enemies: ['darth_vader'],
        rewards: [{ itemId: 'shards_old_ben', amount: 130 }],
        background: 'environment-death-star-hangar',
        objective: 'Survive the ultimate duel and buy time for the escape.',
        rules: 'At the start of battle:\nOld Ben Kenobi enters as a temporary allied unit.\nAll required characters are present but cannot be defeated.\n\nWhenever Darth Vader falls below:\n75% Health:\nOld Ben gains Damage Immunity for 1 turn.\n\nWhenever Darth Vader falls below:\n50% Health:\nOld Ben and Darth Vader immediately enter a Duel stance.\nAll other units become untargetable and cannot take actions until the duel ends.\n\nWhen Darth Vader reaches 25% Health:\nA scripted event triggers.\nOld Ben sacrifices himself.\nOld Ben is defeated and cannot be revived.\n\nAll allied units gain:\n* Offense Up (2 Turns)\n* Speed Up (2 Turns)\n\nThe battle immediately ends in victory.',
        story: 'Knowing his purpose has been fulfilled, Obi-Wan gives himself willingly so Luke and the others can escape aboard the Millennium Falcon. His sacrifice becomes the first step toward the restoration of the Jedi.'
      }
    ]
  },
  {
    id: 'j_thrawn',
    name: 'Heir to the Empire',
    desc: "Guide Chimaera's forces to eradicate localized rebel cells, establish Imperial control, and outmaneuver the ultimate Spectre uprising under Grand Admiral Thrawn's precise supervision.",
    isGalacticLegend: false,
    journeyTier: 1,
    rewardCharacterId: 'thrawn_remnant',
    recommendedPower: 7000,
    phases: [
      {
        phaseNumber: 1,
        description: 'The Chiss Strategist',
        levelReq: 85, gearReq: 10, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['stormtrooper', 'sandtrooper', 'emperor_palpatine', 'darth_vader', 'royal_guard'],
        enemies: ['ezra_phoenix', 'kanan_jarrus', 'sabine_wren', 'garazeb_orrelios', 'chopper_phoenix'],
        rewards: [{ itemId: 'shards_thrawn_remnant', amount: 100 }],
        background: 'environment-star-destroyer-bridge',
        objective: 'Defeat the Phoenix Cell.',
        story: 'The Emperor observes the tactical brilliance of the mysterious Chiss officer as he begins dismantling the growing Rebel threat.'
      },
      {
        phaseNumber: 2,
        description: 'The Battle for Atollon',
        levelReq: 85, gearReq: 10, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['stormtrooper', 'sandtrooper', 'emperor_palpatine', 'darth_vader', 'royal_guard'],
        enemies: [],
        enemyWaves: [
          ['rex_lost_commander', 'garazeb_orrelios', 'sabine_wren', 'chopper_phoenix', 'rebel_pathfinder'],
          ['ezra_phoenix', 'kanan_jarrus', 'general_hera', 'rebel_trooper', 'rebel_trooper']
        ],
        rewards: [{ itemId: 'shards_thrawn_remnant', amount: 100 }],
        background: 'environment-atollon',
        objective: 'Defeat both Rebel waves.',
        story: 'Thrawn surrounds the Rebel base on Atollon, forcing the Alliance into a desperate last stand through overwhelming Imperial strategy.'
      },
      {
        phaseNumber: 3,
        description: 'Grand Admiral',
        levelReq: 85, gearReq: 10, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['stormtrooper', 'sandtrooper', 'emperor_palpatine', 'darth_vader', 'royal_guard'],
        enemies: ['rebel_officer', 'rebel_trooper', 'rebel_trooper', 'rebel_commando', 'rebel_pathfinder'],
        rewards: [{ itemId: 'shards_thrawn_remnant', amount: 130 }],
        background: 'environment-imperial-palace',
        objective: 'Defeat all rebel forces.',
        rules: 'At the start of battle:\nEmperor Palpatine gains the unique buff:\nImperial Approval\n\nWhenever an enemy is defeated:\nAll Imperial allies recover 20% Protection.\n\nWhen the final enemy is defeated:\nA scripted event triggers.\nGrand Admiral Thrawn arrives.\nEmperor Palpatine promotes Thrawn to Grand Admiral.\n\nThe battle immediately ends in victory.',
        story: 'Having repeatedly demonstrated unmatched strategic brilliance against the Rebel Alliance, Thrawn earns the personal trust of Emperor Palpatine and is elevated to the rank of Grand Admiral.'
      }
    ]
  },

  // TIER 2
  {
    id: 'j_anakin',
    name: 'Hero of the 501st',
    desc: 'Unite the clone brothers of the 501st battalion to unlock Anakin Skywalker.',
    isGalacticLegend: false,
    journeyTier: 2,
    rewardCharacterId: 'general_skywalker',
    recommendedPower: 12000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Command the vanguard lines of Christophsis. Survive the Separatist droid vanguard under the direction of Captain Rex to secure the crystal coordinates.',
        levelReq: 85, gearReq: 12, relicReq: 3, legendLevelReq: 0,
        requiredCharacterIds: ['captain_rex'],
        enemies: ['b1_battle_droid', 'b1_battle_droid', 'bx_commando_droid'],
        rewards: [{ itemId: 'shards_general_skywalker', amount: 80 }],
        background: 'environment-christophsis-city'
      },
      {
        phaseNumber: 2,
        description: 'Hold the high-pressure defense sector on the aquatic ridges of Mon Cala. Direct the combined tactical response with Fives, Jesse, Echo, and Appo.',
        levelReq: 85, gearReq: 13, relicReq: 5, legendLevelReq: 0,
        requiredCharacterIds: ['fives', 'jesse', 'echo_501st', 'appo_501st'],
        enemies: ['b2_super_droid', 'magnaguard', 'dwarf_spider_droid'],
        rewards: [{ itemId: 'shards_general_skywalker', amount: 150 }],
        background: 'environment-mon-cala-ocean'
      },
      {
        phaseNumber: 3,
        description: 'In Rabid Pursuit: Lead the ultimate 501st battalion assault on the plains of Naboo to capture high-value targets, utilizing Skywalker\'s legendary tactical lead.',
        levelReq: 85, gearReq: 13, relicReq: 5, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['general_skywalker', 'captain_rex', 'fives', 'jesse', 'echo_501st'],
        enemies: ['magna_guard_elite', 'magnaguard', 'general_grievous_droid'],
        rewards: [{ itemId: 'shards_general_skywalker', amount: 100 }],
        background: 'environment-naboo-plains'
      }
    ]
  },
  {
    id: 'j_boba',
    name: 'Daimyo of Mos Espa',
    desc: 'Escaped from the Sarlacc, Boba Fett secures his rule on Tatooine by defeating the Pyke Syndicate.',
    isGalacticLegend: false,
    journeyTier: 2,
    rewardCharacterId: 'boba_fett_daimyo',
    recommendedPower: 12000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Return of the Hunter',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['boba_fett', 'bossk', 'greedo', 'ig_88', 'aurra_sing'],
        enemies: ['tusken_raider', 'tusken_warrior', 'tusken_chieftain', 'tusken_raider', 'tusken_raider'],
        rewards: [{ itemId: 'shards_boba_fett_daimyo', amount: 100 }],
        background: 'environment-tatooine-dune-sea',
        objective: 'Defeat all Tusken Raiders.',
        story: 'Having escaped the Sarlacc Pit, Boba Fett begins rebuilding his strength while proving himself among the Tusken tribes of Tatooine.'
      },
      {
        phaseNumber: 2,
        description: 'Claiming Jabba\'s Throne',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['boba_fett', 'bossk', 'greedo', 'ig_88', 'aurra_sing'],
        enemies: [],
        enemyWaves: [
          ['gamorrean_guard', 'gamorrean_guard', 'nikto_guard', 'weequay_pirate', 'bib_fortuna'],
          ['gamorrean_guard', 'gamorrean_guard', 'skiff_guard', 'weequay_pirate', 'bib_fortuna']
        ],
        rewards: [{ itemId: 'shards_boba_fett_daimyo', amount: 100 }],
        background: 'environment-jabbas-palace',
        objective: 'Defeat both defending waves.',
        story: 'Boba Fett storms Jabba\'s Palace, overthrowing Bib Fortuna and claiming the throne once occupied by the galaxy\'s most feared crime lord.'
      },
      {
        phaseNumber: 3,
        description: 'The Daimyo',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['boba_fett', 'bossk', 'greedo', 'ig_88', 'aurra_sing'],
        enemies: ['pyke_captain', 'pyke_soldier', 'pyke_soldier', 'pyke_enforcer', 'pyke_heavy'],
        rewards: [
          { itemId: 'shards_boba_fett_daimyo', amount: 130 },
          { itemId: 'credit', amount: 100000 },
          { itemId: 'crystal', amount: 200 }
        ],
        background: 'environment-mos-espa-sanctuary',
        objective: 'Defeat the Pyke Syndicate.',
        rules: 'Boba Fett gains the unique buff: Claimed Throne. Whenever an enemy is defeated: All allied Bounty Hunters recover 15% Health and Protection.\n\nWhen only the Pyke Captain remains: A scripted event triggers. The Pyke Captain surrenders. Boba Fett is crowned Daimyo of Mos Espa. The battle immediately ends in victory.',
        story: 'The Pyke Syndicate launches one final assault on Mos Espa. By defeating their leadership, Boba secures his rule and becomes the Daimyo of Tatooine.'
      }
    ]
  },

  {
    id: 'j_general_kenobi',
    name: 'Negotiator General',
    desc: 'Lead the 212th assault battalion against Separatist strongholds under General Kenobi.',
    isGalacticLegend: false,
    journeyTier: 2,
    rewardCharacterId: 'general_kenobi',
    recommendedPower: 15000,
    phases: [
      {
        phaseNumber: 1,
        description: 'First Deployment',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['commander_cody', 'waxer', 'boiler', 'clone_trooper_212th', 'aerial_trooper_212th'],
        enemies: ['b1_battle_droid', 'b1_battle_droid', 'b1_battle_droid', 'b1_battle_droid', 'b2_super_battle_droid'],
        rewards: [{ itemId: 'shards_general_kenobi', amount: 80 }],
        background: 'environment-christophsis',
        objective: 'Defeat all Separatist droids.',
        story: 'Establish forward command with clones of the 212th to secure positions against the Separatist droid army.'
      },
      {
        phaseNumber: 2,
        description: 'The Siege of Utapau',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['commander_cody', 'waxer', 'boiler', 'clone_trooper_212th', 'aerial_trooper_212th'],
        enemies: ['b2_super_battle_droid', 'b2_super_battle_droid', 'magnaguard', 'magnaguard', 'tactical_droid'],
        rewards: [{ itemId: 'shards_general_kenobi', amount: 100 }],
        background: 'environment-utapau',
        objective: 'Assault Pau City and defeat the defenders.',
        story: 'Assault the sinkhole city of Pau City on Utapau, crushing General Grievous\'s elite bodyguard forces.'
      },
      {
        phaseNumber: 3,
        description: 'Hold the Line',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['commander_cody', 'waxer', 'boiler', 'clone_trooper_212th', 'aerial_trooper_212th'],
        enemies: [],
        enemyWaves: [
          ['b1_battle_droid', 'b1_battle_droid', 'b2_super_battle_droid', 'b2_super_battle_droid', 'bx_commando_droid'],
          ['b1_battle_droid', 'b1_battle_droid', 'b2_super_battle_droid', 'magnaguard', 'droideka']
        ],
        rewards: [{ itemId: 'shards_general_kenobi', amount: 50 }],
        background: 'environment-mygeeto',
        objective: 'Hold critical bridges against Separatist waves.',
        story: 'Hold critical bridges against waves of Separatist heavy armor and infantry.'
      },
      {
        phaseNumber: 4,
        description: 'The Negotiator',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['commander_cody', 'waxer', 'boiler', 'clone_trooper_212th', 'aerial_trooper_212th'],
        loanedPlayerSquad: ['general_kenobi', 'commander_cody', 'clone_trooper_212th', 'waxer', 'boiler'],
        enemies: ['general_grievous_droid', 'magnaguard', 'magnaguard', 'droideka', 'tactical_droid'],
        rewards: [
          { itemId: 'shards_general_kenobi', amount: 100 },
          { itemId: 'credit', amount: 150000 },
          { itemId: 'crystal', amount: 200 }
        ],
        background: 'environment-utapau-command',
        objective: 'Defeat General Grievous.',
        rules: 'At the start of battle: General Kenobi enters as a Loaned Unit. He gains the unique buff: High Ground, giving him 50% Counter Chance and 25% Offense.\n\nWhen General Grievous is defeated: All remaining droid units are instantly deactivated and the battle ends in victory.',
        story: 'Obi-Wan Kenobi engages General Grievous in single combat while his 212th battalion shuts down the droid command.'
      }
    ]
  },

  {
    id: 'j_general_grievous',
    name: 'Droid Army Commander',
    desc: 'Annihilate Republic forces with overwhelming droid battalions.',
    isGalacticLegend: false,
    journeyTier: 2,
    rewardCharacterId: 'general_grievous_droid',
    recommendedPower: 15000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Scourge of the Republic',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['b1_battle_droid', 'b2_super_battle_droid', 'tactical_droid', 'crab_droid', 'magnaguard'],
        enemies: ['clone_sergeant', 'clone_trooper', 'arc_trooper', 'republic_officer', 'jedi_general'],
        rewards: [{ itemId: 'shards_general_grievous_droid', amount: 100 }],
        background: 'environment-hypori',
        objective: 'Massacre the Republic expedition.',
        story: 'General Grievous leads his droid legion to completely massacre a stranded Republic expedition on Hypori.'
      },
      {
        phaseNumber: 2,
        description: 'Malevolence Assault',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['b1_battle_droid', 'b2_super_battle_droid', 'tactical_droid', 'crab_droid', 'magnaguard'],
        enemies: [],
        enemyWaves: [
          ['clone_trooper', 'clone_trooper', 'clone_heavy_trooper', 'clone_medic', 'republic_officer'],
          ['arc_trooper', 'arc_trooper', 'republic_officer', 'republic_commando', 'captain_rex']
        ],
        rewards: [{ itemId: 'shards_general_grievous_droid', amount: 100 }],
        background: 'environment-malevolence',
        objective: 'Defend the Malevolence Bridge.',
        story: 'Defend the bridge of the Separatist flagship Malevolence against boarding parties of Republic Clone Troopers.'
      },
      {
        phaseNumber: 3,
        description: 'Dreadlord of the Separatists',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['b1_battle_droid', 'b2_super_battle_droid', 'tactical_droid', 'crab_droid', 'magnaguard'],
        enemies: ['general_kenobi', 'commander_cody', 'waxer', 'boiler', 'clone_trooper_212th'],
        rewards: [
          { itemId: 'shards_general_grievous_droid', amount: 130 },
          { itemId: 'credit', amount: 100000 },
          { itemId: 'crystal', amount: 200 }
        ],
        background: 'environment-utapau-command',
        objective: 'Defeat Obi-Wan Kenobi and his clones.',
        rules: 'Whenever a Droid ally is defeated: General Grievous gains 25% Turn Meter and Offense Up (1 turn).\n\nWhen General Kenobi reaches 25% Health: Grievous unleashes a four-lightsaber spin attack, instantly defeating the remaining clones and forcing General Kenobi to retreat, securing victory.',
        story: 'General Grievous makes his final stand on Utapau against Obi-Wan Kenobi and his elite 212th Clone troopers.'
      }
    ]
  },

  {
    id: 'j_grand_inquisitor',
    name: 'Supreme Hunt Doctrine',
    desc: 'Marshal the Inquisitors to track down Jedi survivors and establish Imperial dominance.',
    isGalacticLegend: false,
    journeyTier: 2,
    rewardCharacterId: 'grand_inquisitor',
    recommendedPower: 15000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Evaluating Jedi Presence',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['reva', 'marrok', 'crow', 'barriss_fallen', 'fourth_sister'],
        enemies: ['jedi_padawan', 'jedi_padawan', 'jedi_padawan', 'jedi_knight', 'jedi_knight'],
        rewards: [{ itemId: 'shards_grand_inquisitor', amount: 100 }],
        background: 'environment-coruscant-underworld',
        objective: 'Defeat all hiding Jedi.',
        story: 'The Inquisitorius tracks rumors of surviving Jedi Padawans hiding in the lower levels of Coruscant.'
      },
      {
        phaseNumber: 2,
        description: 'Inquisitorius Supremacy',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['reva', 'marrok', 'crow', 'barriss_fallen', 'fourth_sister'],
        enemies: ['temple_guard', 'temple_guard', 'temple_guard', 'jedi_knight', 'jedi_master'],
        rewards: [{ itemId: 'shards_grand_inquisitor', amount: 100 }],
        background: 'environment-jedi-temple',
        objective: 'Destroy the Jedi Sanctuary.',
        story: 'Reva leads a direct assault on a secret Jedi sanctuary, demonstrating the sinister power of the Inquisitorius.'
      },
      {
        phaseNumber: 3,
        description: 'Grand Inquisitor\'s Trials',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['reva', 'marrok', 'crow', 'barriss_fallen', 'fourth_sister'],
        enemies: ['quinlan_vos', 'jedi_survivor', 'cere_junda'],
        rewards: [
          { itemId: 'shards_grand_inquisitor', amount: 130 },
          { itemId: 'credit', amount: 100000 },
          { itemId: 'crystal', amount: 200 }
        ],
        background: 'environment-fortress-inquisitorius',
        objective: 'Defeat the Jedi Survivors.',
        rules: 'Each Inquisitor ally gains a stack of Purge whenever they attack. Jedi enemies take 20% more damage from Inquisitors.\n\nWhen the final Jedi is defeated: A scripted event triggers. The Grand Inquisitor appears, approving of their progress, and joins the ranks.',
        story: 'With the Grand Inquisitor overseeing, the hunters corner elite Jedi survivors, establishing total dominance.'
      }
    ]
  },
  {
    id: 'j_trench',
    name: 'Sovereign Separatist Commander',
    desc: 'Mobilize elite Separatist forces under admiral codes.',
    isGalacticLegend: false,
    journeyTier: 3,
    rewardCharacterId: 'grand_admiral_trench',
    recommendedPower: 15000,
    phases: [
      {
        phaseNumber: 1,
        description: 'BX-Series Infiltration.',
        levelReq: 85, gearReq: 13, relicReq: 5, legendLevelReq: 0,
        requiredCharacterIds: ['bx_commando_droid', 'kelhani'],
        enemies: ['clone_trooper_212th', 'aerial_trooper_212th'],
        rewards: [{ itemId: 'shards_grand_admiral_trench', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Trench\'s ultimate strategy.',
        levelReq: 85, gearReq: 13, relicReq: 5, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['grand_admiral_trench', 'bx_commando_droid', 'kelhani', 'droideka', 'dwarf_spider_droid'],
        enemies: ['general_kenobi', 'commander_cody', 'waxer'],
        rewards: [{ itemId: 'shards_grand_admiral_trench', amount: 165 }]
      }
    ]
  },
  {
    id: 'j_director_krennic',
    name: 'ISB Director (Krennic)',
    desc: 'Unleash ruthless Imperial efficiency.',
    isGalacticLegend: false,
    journeyTier: 3,
    rewardCharacterId: 'director_krennic',
    recommendedPower: 15000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Protect the project parameters.',
        levelReq: 85, gearReq: 13, relicReq: 6, legendLevelReq: 0,
        requiredCharacterIds: ['partagaz', 'death_trooper'],
        enemies: ['jyn_erso', 'cassian_andor'],
        rewards: [{ itemId: 'shards_director_krennic', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Secure the intellectual property.',
        levelReq: 85, gearReq: 13, relicReq: 6, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['director_krennic', 'partagaz', 'death_trooper', 'kx_security_droid', 'probe_droid'],
        enemies: ['jyn_erso', 'cassian_andor', 'k2so', 'chirrut_imwe', 'baze_malbus'],
        rewards: [{ itemId: 'shards_director_krennic', amount: 165 }]
      }
    ]
  },
  {
    id: 'j_admiral_raddus',
    name: 'Rebel Fleet Admiral',
    desc: 'Rally the Rogue One squad for an impossible victory.',
    isGalacticLegend: false,
    journeyTier: 3,
    rewardCharacterId: 'admiral_raddus',
    recommendedPower: 15000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Hold the Beach at Scarif.',
        levelReq: 85, gearReq: 13, relicReq: 3, legendLevelReq: 0,
        requiredCharacterIds: ['jyn_erso', 'cassian_andor', 'k2so'],
        enemies: ['death_trooper', 'stormtrooper'],
        rewards: [{ itemId: 'shards_admiral_raddus', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Extract the Death Star plans.',
        levelReq: 85, gearReq: 13, relicReq: 3, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['admiral_raddus', 'jyn_erso', 'cassian_andor', 'chirrut_imwe', 'baze_malbus'],
        enemies: ['director_krennic', 'death_trooper', 'magna_guard_elite'],
        rewards: [{ itemId: 'shards_admiral_raddus', amount: 165 }]
      }
    ]
  },

  // TIER 4
  {
    id: 'j_plo_koon',
    name: 'Wolfpack Commander',
    desc: 'Lead the Wolfpack with hardened discipline and battlefield precision.',
    isGalacticLegend: false,
    journeyTier: 4,
    rewardCharacterId: 'plo_koon_journey',
    recommendedPower: 25000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Establish tactical formations.',
        levelReq: 85, gearReq: 13, relicReq: 6, legendLevelReq: 0,
        requiredCharacterIds: ['commander_wolffe', 'wp_scout'],
        enemies: ['b1_battle_droid', 'b1_battle_droid'],
        rewards: [{ itemId: 'shards_plo_koon_journey', amount: 130 }]
      },
      {
        phaseNumber: 2,
        description: 'Hold the lines alongside the heavy gunners.',
        levelReq: 85, gearReq: 13, relicReq: 6, legendLevelReq: 0,
        requiredCharacterIds: ['wp_heavy', 'wp_sinker', 'wp_boost'],
        enemies: ['b2_super_droid', 'magnaguard'],
        rewards: [{ itemId: 'shards_plo_koon_journey', amount: 100 }]
      },
      {
        phaseNumber: 3,
        description: 'Lead the Wolfpack.',
        levelReq: 85, gearReq: 13, relicReq: 6, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['plo_koon_journey', 'commander_wolffe', 'wp_boost', 'wp_sinker', 'wp_heavy'],
        enemies: ['general_grievous_droid', 'magna_guard_elite', 'crab_droid'],
        rewards: [{ itemId: 'shards_plo_koon_journey', amount: 100 }]
      }
    ]
  },
  {
    id: 'j_maul_mandalore',
    name: 'Shadow Over Mandalore',
    desc: 'Restore Mandalore through violence and conquest.',
    isGalacticLegend: false,
    journeyTier: 4,
    rewardCharacterId: 'maul_mandalore',
    recommendedPower: 25000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Take down the unfaithful Mando dissidents.',
        levelReq: 85, gearReq: 13, relicReq: 6, legendLevelReq: 0,
        requiredCharacterIds: ['pre_vizsla', 'rook_kast'],
        enemies: ['jedi_knight'],
        rewards: [{ itemId: 'shards_maul_mandalore', amount: 110 }]
      },
      {
        phaseNumber: 2,
        description: 'Crush the Republic reinforcements.',
        levelReq: 85, gearReq: 13, relicReq: 5, legendLevelReq: 0,
        requiredCharacterIds: ['bo_katan_death_watch', 'dw_raider', 'dw_veteran', 'savage_opress_dw'],
        enemies: ['commander_appo', 'clone_trooper_212th'],
        rewards: [{ itemId: 'shards_maul_mandalore', amount: 110 }]
      },
      {
        phaseNumber: 3,
        description: 'Rule Mandalore with an Iron Fist.',
        levelReq: 85, gearReq: 13, relicReq: 5, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['maul_mandalore', 'savage_opress_dw', 'bo_katan_death_watch', 'pre_vizsla', 'rook_kast'],
        enemies: ['master_kenobi', 'ahsoka_clone_wars'],
        rewards: [{ itemId: 'shards_maul_mandalore', amount: 110 }]
      }
    ]
  },
  {
    id: 'j_palpatine',
    name: 'Supreme Chancellor',
    desc: 'Manipulate the galactic battlefield with Coruscant Guards to unlock Supreme Chancellor Palpatine.',
    isGalacticLegend: false,
    rewardCharacterId: 'chancellor_palpatine_journey',
    recommendedPower: 25000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Senate Hostage Crisis on Coruscant.',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['commander_fox_riot', 'underworld_police'],
        enemies: ['jedi_knight', 'captain_rex'],
        rewards: [{ itemId: 'shards_chancellor_palpatine_journey', amount: 145 }]
      },
      {
        phaseNumber: 2,
        description: 'Secure the Senate Rotunda.',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['commander_thorn', 'riot_guard', 'coruscant_trooper'],
        enemies: ['jedi_knight', 'mace_windu', 'kit_fisto'],
        rewards: [{ itemId: 'shards_chancellor_palpatine_journey', amount: 100 }]
      },
      {
        phaseNumber: 3,
        description: 'Execute Order 66.',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['chancellor_palpatine_journey', 'commander_fox_riot', 'commander_thorn', 'riot_guard', 'coruscant_trooper'],
        enemies: ['master_kenobi', 'mace_windu', 'kit_fisto', 'jedi_knight'],
        rewards: [{ itemId: 'shards_chancellor_palpatine_journey', amount: 85 }]
      }
    ]
  },
  {
    id: 'j_ki_adi_mundi',
    name: 'The Mygeeto Campaign',
    desc: 'Unleash the terrifying force and iron discipline of the Galactic Marines under General Ki-Adi-Mundi on Mygeeto. (Requires Relic 9)',
    isGalacticLegend: false,
    rewardCharacterId: 'ki_adi_mundi_journey',
    recommendedPower: 45000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Secure the Tri-Clyder bridge.',
        levelReq: 85, gearReq: 13, relicReq: 9, legendLevelReq: 0,
        requiredCharacterIds: ['commander_bacara', 'neyo'],
        enemies: ['b1_battle_droid', 'b2_super_droid', 'bx_commando_droid'],
        rewards: [{ itemId: 'shards_ki_adi_mundi_journey', amount: 65 }]
      },
      {
        phaseNumber: 2,
        description: 'Infiltrate the artillery compound.',
        levelReq: 85, gearReq: 13, relicReq: 9, legendLevelReq: 0,
        requiredCharacterIds: ['jet_marine', 'keller', 'stak'],
        enemies: ['b2_super_droid', 'magnaguard', 'dwarf_spider_droid'],
        rewards: [{ itemId: 'shards_ki_adi_mundi_journey', amount: 65 }]
      },
      {
        phaseNumber: 3,
        description: 'Bypassing the Shields.',
        levelReq: 85, gearReq: 13, relicReq: 9, legendLevelReq: 0,
        requiredCharacterIds: ['commander_bacara', 'neyo', 'stak'],
        enemies: ['crab_droid', 'bx_commando_droid', 'dwarf_spider_droid'],
        rewards: [{ itemId: 'shards_ki_adi_mundi_journey', amount: 65 }]
      },
      {
        phaseNumber: 4,
        description: 'Assault on the central dome.',
        levelReq: 85, gearReq: 13, relicReq: 9, legendLevelReq: 0,
        requiredCharacterIds: ['commander_bacara', 'neyo', 'jet_marine', 'keller', 'stak'],
        enemies: ['b2_super_droid', 'magna_guard_elite', 'general_grievous_droid'],
        rewards: [{ itemId: 'shards_ki_adi_mundi_journey', amount: 80 }]
      },
      {
        phaseNumber: 5,
        description: 'The Ultimate Charge.',
        levelReq: 85, gearReq: 13, relicReq: 9, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['ki_adi_mundi_journey', 'commander_bacara', 'neyo', 'jet_marine', 'keller'],
        enemies: ['general_grievous_droid', 'magna_guard_elite', 'crab_droid', 'bx_commando_droid', 'dwarf_spider_droid'],
        rewards: [{ itemId: 'shards_ki_adi_mundi_journey', amount: 55 }]
      }
    ]
  },
  {
    id: 'j_crosshair',
    name: 'Clone Force 99 Outcast',
    desc: 'Help the outcast find his place or lead his final mission with the squad. (Requires Relic 1)',
    isGalacticLegend: false,
    rewardCharacterId: 'crosshair_bb',
    recommendedPower: 20000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Survival on Anaxes.',
        levelReq: 85, gearReq: 13, relicReq: 1, legendLevelReq: 0,
        requiredCharacterIds: ['hunter', 'wrecker', 'tech_bb', 'echo_bb', 'omega'],
        enemies: ['b1_battle_droid', 'b2_super_droid', 'bx_commando_droid', 'dwarf_spider_droid'],
        rewards: [{ itemId: 'shards_crosshair_bb', amount: 330 }]
      }
    ]
  },
  {
    id: 'j_pikk_mukmuk',
    name: 'The Monkey-Lizard\'s Stash',
    desc: 'Bribe your way through pirate encounters to secure Hondo\'s most loyal pet.',
    isGalacticLegend: false,
    rewardCharacterId: 'pikk_mukmuk',
    recommendedPower: 20000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Treasure Procurement',
        levelReq: 85, gearReq: 13, relicReq: 5, legendLevelReq: 0,
        requiredCharacterIds: ['gwarm', 'jiro', 'turk_falso', 'melch', 'azmorigan'],
        enemies: ['stormtrooper', 'stormtrooper', 'stormtrooper'],
        rewards: [{ itemId: 'shards_pikk_mukmuk', amount: 330 }]
      }
    ]
  },
  {
    id: 'j_qira_dawn',
    name: 'Dawn of Crimson',
    desc: 'Lead the Crimson Dawn from the shadows as Maul\'s apprentice.',
    isGalacticLegend: false,
    rewardCharacterId: 'qira_journey',
    recommendedPower: 20000,
    phases: [
      {
        phaseNumber: 1,
        description: 'First Acquisition',
        levelReq: 85, gearReq: 13, relicReq: 5, legendLevelReq: 0,
        requiredCharacterIds: ['dryden_vos', 'tobias_beckett', 'sabe_dawn', 'toht_ra', 'crimson_spybot'],
        enemies: ['pyke_sentinel', 'pyke_sentinel'],
        rewards: [{ itemId: 'shards_qira_journey', amount: 330 }]
      }
    ]
  },

  // GALACTIC LEGENDS (Always 2 phases: 1 requirements, 1 max loaned)
  {
    id: 'gl_tarkin_journey',
    name: 'Security Architecture',
    desc: 'Deconstruct chaos and construct flawless order with Galactic Legend War Architect Tarkin on Coruscant.',
    isGalacticLegend: true,
    rewardCharacterId: 'gl_tarkin',
    recommendedPower: 45000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Establish Total Coruscant Lockdown.',
        levelReq: 40, gearReq: 1, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: [],
        enemies: ['jedi_knight', 'mace_windu', 'master_kenobi'],
        rewards: [{ itemId: 'shards_gl_tarkin', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Absolute Containment.',
        levelReq: 85, gearReq: 13, relicReq: 10, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['gl_tarkin', 'commander_fox_riot', 'commander_thorn', 'riot_guard', 'coruscant_trooper'],
        enemies: ['mace_windu', 'master_kenobi', 'jedi_knight', 'kit_fisto'],
        rewards: [{ itemId: 'shards_gl_tarkin', amount: 165 }]
      }
    ]
  },
  {
    id: 'gl_kenobi',
    name: 'Master of Soresu',
    desc: 'Unlock the ultimate defensive powerhouse, Jedi Master Kenobi.',
    isGalacticLegend: true,
    rewardCharacterId: 'master_kenobi',
    recommendedPower: 45000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Hold the line with the 212th.',
        levelReq: 85, gearReq: 13, relicReq: 8, legendLevelReq: 0,
        requiredCharacterIds: ['general_kenobi', 'commander_cody', 'clone_trooper_212th', 'general_skywalker'],
        enemies: ['general_grievous_droid', 'magna_guard_elite', 'magnaguard', 'b2_super_droid'],
        rewards: [{ itemId: 'shards_master_kenobi', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Embrace the Legend.',
        levelReq: 85, gearReq: 13, relicReq: 10, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['gl_kenobi', 'commander_cody', 'clone_trooper_212th', 'r2d2', 'general_skywalker'],
        enemies: ['gl_grievous', 'magnaguard', 'b2_super_droid', 'magna_guard_elite'],
        rewards: [{ itemId: 'shards_master_kenobi', amount: 165 }]
      }
    ]
  },
  {
    id: 'gl_grievous',
    name: 'Eternal Droid Dominance',
    desc: 'Unleash the ultimate Separatist menace, Galactic Legend Grievous.',
    isGalacticLegend: true,
    rewardCharacterId: 'eternal_fire_grievous',
    recommendedPower: 45000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Overwhelm the Republic.',
        levelReq: 85, gearReq: 13, relicReq: 8, legendLevelReq: 0,
        requiredCharacterIds: ['general_grievous_droid', 'magna_guard_elite', 'magnaguard', 'b2_super_droid'],
        enemies: ['general_kenobi', 'commander_cody', 'clone_trooper_212th'],
        rewards: [{ itemId: 'shards_eternal_fire_grievous', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Embrace the Legend.',
        levelReq: 85, gearReq: 13, relicReq: 10, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['gl_grievous', 'magna_guard_elite', 'magnaguard', 'b2_super_droid'],
        enemies: ['gl_kenobi', 'commander_cody', 'clone_trooper_212th', 'ahsoka_clone_wars'],
        rewards: [{ itemId: 'shards_eternal_fire_grievous', amount: 165 }]
      }
    ]
  },
  {
    id: 'gl_lord_vader',
    name: 'Rise of Lord Vader',
    desc: 'Succumb to the dark side and unleash Galactic Legend Lord Vader.',
    isGalacticLegend: true,
    rewardCharacterId: 'gl_lord_vader',
    recommendedPower: 45000,
    phases: [
      {
        phaseNumber: 1,
        description: 'March on the Jedi Temple.',
        levelReq: 85, gearReq: 13, relicReq: 8, legendLevelReq: 0,
        requiredCharacterIds: ['darth_vader', 'commander_appo', 'stormtrooper'],
        enemies: ['mace_windu', 'kit_fisto', 'jedi_knight', 'depa_billaba'],
        rewards: [{ itemId: 'shards_gl_lord_vader', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Embrace the Legend.',
        levelReq: 85, gearReq: 13, relicReq: 10, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['gl_lord_vader', 'chancellor_palpatine_journey', 'commander_appo', 'stormtrooper'],
        enemies: ['gl_kenobi', 'mace_windu', 'jedi_knight'],
        rewards: [{ itemId: 'shards_gl_lord_vader', amount: 165 }]
      }
    ]
  },
  {
    id: 'gl_leia',
    name: 'Hope of the Rebellion',
    desc: 'Master the Rebellion to achieve the ultimate Senator Leia.',
    isGalacticLegend: true,
    rewardCharacterId: 'leia_gl',
    recommendedPower: 45000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Infiltrate the Imperial Stronghold.',
        levelReq: 85, gearReq: 13, relicReq: 9, legendLevelReq: 0,
        requiredCharacterIds: ['senator_organa', 'stormtrooper_han', 'r2d2', 'stormtrooper_luke'],
        enemies: ['darth_vader', 'stormtrooper'],
        rewards: [{ itemId: 'shards_leia_gl', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Embrace the Legend.',
        levelReq: 85, gearReq: 13, relicReq: 10, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['gl_leia', 'r2d2', 'mon_mothma', 'alderaan_guard', 'winter'],
        enemies: ['gl_lord_vader', 'darth_vader', 'stormtrooper'],
        rewards: [{ itemId: 'shards_leia_gl', amount: 165 }]
      }
    ]
  },
  {
    id: 'gl_jabba',
    name: 'Hutt Cartel Empire',
    desc: 'Seize the criminal underworld with Galactic Legend Jabba the Hutt.',
    isGalacticLegend: true,
    rewardCharacterId: 'jabba',
    recommendedPower: 45000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Establish the Bounty.',
        levelReq: 85, gearReq: 13, relicReq: 7, legendLevelReq: 0,
        requiredCharacterIds: ['boba_fett', 'krrsantan', 'gamorrean_guard_cartel'],
        enemies: ['han_solo', 'smuggler_chewbacca', 'princess_leia'],
        rewards: [{ itemId: 'shards_jabba', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Embrace the Legend.',
        levelReq: 85, gearReq: 13, relicReq: 10, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['gl_jabba', 'krrsantan', 'boba_fett', 'bib_fortuna', 'gamorrean_guard_cartel'],
        enemies: ['gl_leia', 'han_solo', 'smuggler_chewbacca'],
        rewards: [{ itemId: 'shards_jabba', amount: 165 }]
      }
    ]
  },
  {
    id: 'gl_master_windu',
    name: 'Champion of the Order',
    desc: 'Defend the Republic with Galactic Legend Master Windu.',
    isGalacticLegend: true,
    rewardCharacterId: 'mace_windu',
    recommendedPower: 45000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Strike at the Heart of the Sith.',
        levelReq: 85, gearReq: 13, relicReq: 7, legendLevelReq: 0,
        requiredCharacterIds: ['kit_fisto', 'saesee_tiin', 'agen_kolar', 'depa_billaba'],
        enemies: ['darth_sidious', 'commander_fox_riot'],
        rewards: [{ itemId: 'shards_mace_windu', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Embrace the Legend.',
        levelReq: 85, gearReq: 13, relicReq: 10, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['gl_master_windu', 'kit_fisto', 'saesee_tiin', 'agen_kolar', 'depa_billaba'],
        enemies: ['gl_lord_vader', 'darth_sidious', 'chancellor_palpatine_journey'],
        rewards: [{ itemId: 'shards_mace_windu', amount: 165 }]
      }
    ]
  },
  // NEW REPUBLIC ERA
  {
    id: 'j_ezra_exile',
    name: 'The Lost Jedi',
    desc: 'Survive in a galaxy far, far away from home.',
    isGalacticLegend: false,
    journeyTier: 3,
    rewardCharacterId: 'ezra_exile',
    recommendedPower: 18000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Spectre reunion.',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['general_hera', 'chopper', 'zeb_nr', 'huyang', 'sabine_apprentice'],
        enemies: ['night_trooper_peridea', 'death_trooper_peridea', 'scout_trooper_peridea'],
        rewards: [{ itemId: 'shards_ezra_exile', amount: 145 }]
      },
      {
        phaseNumber: 2,
        description: 'Help comes from unexpected places.',
        levelReq: 85, gearReq: 13, relicReq: 3, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['ezra_exile', 'general_hera', 'sabine_apprentice'],
        enemies: ['shin_hati', 'baylan_skoll'],
        rewards: [{ itemId: 'shards_ezra_exile', amount: 185 }]
      }
    ]
  },
  {
    id: 'j_captain_pellaeon',
    name: 'The Last Admiral',
    desc: 'Hold the Imperial Remnant together.',
    isGalacticLegend: false,
    journeyTier: 3,
    rewardCharacterId: 'captain_pellaeon',
    recommendedPower: 18000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Command the Remnant fleet.',
        levelReq: 85, gearReq: 12, relicReq: 0, legendLevelReq: 0,
        requiredCharacterIds: ['commander_enoch', 'night_trooper_peridea', 'death_trooper_peridea', 'scout_trooper_peridea', 'shadow_trooper_peridea'],
        enemies: ['general_hera', 'chopper', 'zeb_nr'],
        rewards: [{ itemId: 'shards_captain_pellaeon', amount: 145 }]
      },
      {
        phaseNumber: 2,
        description: 'Establish order.',
        levelReq: 85, gearReq: 13, relicReq: 3, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['captain_pellaeon', 'commander_enoch', 'night_trooper_peridea'],
        enemies: ['ezra_exile', 'sabine_apprentice'],
        rewards: [{ itemId: 'shards_captain_pellaeon', amount: 185 }]
      }
    ]
  },
  {
    id: 'j_bo_katan_mandalor',
    name: "The Mand'alor",
    desc: 'Unite the Mandalorian clans.',
    isGalacticLegend: false,
    journeyTier: 4,
    rewardCharacterId: 'bo_katan_mandalor',
    recommendedPower: 25000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Rally the clans.',
        levelReq: 85, gearReq: 13, relicReq: 5, legendLevelReq: 0,
        requiredCharacterIds: ['din_djarin_beskar', 'paz_vizsla', 'ig12_grogu', 'axe_woves', 'koska_reeves'],
        enemies: ['gideon', 'dark_trooper', 'stormtrooper', 'scout_trooper'],
        rewards: [{ itemId: 'shards_bo_katan_mandalor', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Retake Mandalore.',
        levelReq: 85, gearReq: 13, relicReq: 7, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['bo_katan_mandalor', 'din_djarin_beskar', 'paz_vizsla', 'axe_woves', 'koska_reeves'],
        enemies: ['gideon', 'dark_trooper', 'dark_trooper', 'dark_trooper'],
        rewards: [{ itemId: 'shards_bo_katan_mandalor', amount: 165 }]
      }
    ]
  },

  {
    id: 'gl_ahsoka_grey',
    name: 'The Grey Force',
    desc: 'Become the fulcrum of light and dark.',
    isGalacticLegend: true,
    rewardCharacterId: 'ahsoka_tano_grey',
    recommendedPower: 45000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Train the apprentice.',
        levelReq: 85, gearReq: 13, relicReq: 7, legendLevelReq: 0,
        requiredCharacterIds: ['general_hera', 'chopper', 'zeb_nr', 'huyang', 'sabine_apprentice'],
        enemies: ['shin_hati', 'marrok_mercenary', 'morgan_elsbeth'],
        rewards: [{ itemId: 'shards_ahsoka_tano_grey', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Confront the Grand Admiral.',
        levelReq: 85, gearReq: 13, relicReq: 10, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['ahsoka_tano_grey', 'ezra_exile', 'sabine_apprentice', 'general_hera', 'huyang'],
        enemies: ['grand_admiral_thrawn', 'commander_enoch', 'night_trooper_peridea'],
        rewards: [{ itemId: 'shards_ahsoka_tano_grey', amount: 165 }]
      }
    ]
  },
  {
    id: 'gl_thrawn',
    name: 'Heir to the Empire',
    desc: 'Command the Second Empire as its tactical genius.',
    isGalacticLegend: true,
    rewardCharacterId: 'grand_admiral_thrawn',
    recommendedPower: 45000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Return of the Commander.',
        levelReq: 85, gearReq: 13, relicReq: 7, legendLevelReq: 0,
        requiredCharacterIds: ['commander_enoch', 'night_trooper_peridea', 'death_trooper_peridea', 'scout_trooper_peridea', 'shadow_trooper_peridea', 'warlord_drake_voss', 'mire_talon', 'torr_kane', 'ashen_veil', 'hollow', 'captain_pellaeon'],
        enemies: ['ezra_exile', 'sabine_apprentice', 'huyang'],
        rewards: [{ itemId: 'shards_grand_admiral_thrawn', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Vanguard of the Empire.',
        levelReq: 85, gearReq: 13, relicReq: 10, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['grand_admiral_thrawn', 'captain_pellaeon', 'commander_enoch', 'night_trooper_peridea'],
        enemies: ['ahsoka_tano_grey', 'ezra_exile', 'general_hera', 'sabine_apprentice'],
        rewards: [{ itemId: 'shards_grand_admiral_thrawn', amount: 165 }]
      }
    ]
  },
  {
    id: 'gl_hondo',
    name: 'Lord of Piracy',
    desc: 'Unite the underworld under the banner of the Pirate King.',
    isGalacticLegend: true,
    rewardCharacterId: 'hondo_ohnaka_gl',
    recommendedPower: 45000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Hostile Takeover.',
        levelReq: 85, gearReq: 13, relicReq: 7, legendLevelReq: 0,
        requiredCharacterIds: ['hondo_ohnaka', 'gwarm', 'jiro', 'turk_falso', 'melch', 'azmorigan', 'captain_ithano', 'quiggold', 'reveth', 'navrokk', 'pendewqell'],
        enemies: ['stormtrooper', 'stormtrooper', 'stormtrooper'],
        rewards: [{ itemId: 'shards_hondo_ohnaka_gl', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'A Profitable Alliance.',
        levelReq: 85, gearReq: 13, relicReq: 10, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['hondo_ohnaka_gl', 'gwarm', 'jiro', 'turk_falso', 'azmorigan'],
        enemies: ['darth_vader', 'emperor_palpatine', 'stormtrooper'],
        rewards: [{ itemId: 'shards_hondo_ohnaka_gl', amount: 165 }]
      }
    ]
  },
  {
    id: 'gl_maz',
    name: 'The Network Server',
    desc: 'Information is power. Harness the ultimate intelligence network.',
    isGalacticLegend: true,
    rewardCharacterId: 'maz_kanata_gl',
    recommendedPower: 45000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Calling in Favors.',
        levelReq: 85, gearReq: 13, relicReq: 7, legendLevelReq: 0,
        requiredCharacterIds: ['emmie', 'sm_33', 'prast_ror', 'dexter_jettster', 'scissorpunch', 'boba_fett', 'bossk', 'greedo', 'krrsantan'],
        enemies: ['stormtrooper', 'stormtrooper', 'stormtrooper'],
        rewards: [{ itemId: 'shards_maz_kanata_gl', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Everyone Owes Someone.',
        levelReq: 85, gearReq: 13, relicReq: 10, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['maz_kanata_gl', 'emmie', 'sm_33', 'prast_ror', 'dexter_jettster'],
        enemies: ['darth_vader', 'stormtrooper', 'stormtrooper'],
        rewards: [{ itemId: 'shards_maz_kanata_gl', amount: 165 }]
      }
    ]
  },
  {
    id: 'gl_trench',
    name: 'Immortal Admiral',
    desc: 'Lead the Separatist fleet with unparalleled tactical brilliance.',
    isGalacticLegend: true,
    rewardCharacterId: 'immortal_admiral_trench',
    recommendedPower: 45000,
    phases: [
      {
        phaseNumber: 1,
        description: 'A Calculated Move.',
        levelReq: 85, gearReq: 13, relicReq: 7, legendLevelReq: 0,
        requiredCharacterIds: ['grand_admiral_trench', 'bx_commando_droid', 'kelhani', 'droideka', 'dwarf_spider_droid', 'magna_guard_elite'],
        enemies: ['clone_trooper_212th', 'clone_trooper_212th', 'fives'],
        rewards: [{ itemId: 'shards_immortal_admiral_trench', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Fear of Ignorance.',
        levelReq: 85, gearReq: 13, relicReq: 10, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['immortal_admiral_trench', 'bx_commando_droid', 'kelhani', 'droideka', 'magna_guard_elite'],
        enemies: ['general_skywalker', 'captain_rex', 'fives'],
        rewards: [{ itemId: 'shards_immortal_admiral_trench', amount: 165 }]
      }
    ]
  },
  {
    id: 'j_starkiller',
    name: 'The Secret Apprentice',
    desc: 'Unleash the full power of the dark side as Darth Vader\'s hidden assassin.',
    isGalacticLegend: false,
    rewardCharacterId: 'starkiller',
    recommendedPower: 25000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Hunting the last Jedi.',
        levelReq: 85, gearReq: 12, relicReq: 5, legendLevelReq: 0,
        requiredCharacterIds: ['darth_vader', 'emperor_palpatine', 'mara_jade'],
        enemies: ['jedi_knight', 'rebels', 'master_yoda'],
        rewards: [{ itemId: 'shards_starkiller', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Vader\'s ultimate weapon.',
        levelReq: 85, gearReq: 13, relicReq: 5, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['starkiller', 'darth_vader', 'mara_jade', 'riot_trooper', 'gideon_hask'],
        enemies: ['jedi_knight', 'rebel_honor_guard', 'luke_skywalker_farmboy'],
        rewards: [{ itemId: 'shards_starkiller', amount: 165 }]
      }
    ]
  },
  {
    id: 'gl_darth_sidious',
    name: 'Unlimited Power',
    desc: 'Orchestrate the destruction of the Republic and rise to ultimate power.',
    isGalacticLegend: true,
    rewardCharacterId: 'gl_darth_sidious',
    recommendedPower: 45000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Execute Order 66.',
        levelReq: 85, gearReq: 13, relicReq: 7, legendLevelReq: 0,
        requiredCharacterIds: ['darth_vader', 'emperor_palpatine', 'starkiller', 'royal_guard'],
        enemies: ['mace_windu', 'kit_fisto', 'agen_kolar', 'saesee_tiin'],
        rewards: [{ itemId: 'shards_gl_darth_sidious', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Embrace the Legend.',
        levelReq: 85, gearReq: 13, relicReq: 10, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['darth_sidious', 'darth_vader', 'mara_jade', 'starkiller', 'imperial_officer'],
        enemies: ['master_yoda', 'gl_kenobi', 'jedi_knight'],
        rewards: [{ itemId: 'shards_gl_darth_sidious', amount: 165 }]
      }
    ]
  },
  {
    id: 'gl_luke',
    name: 'Rebellion\'s Twilight',
    desc: 'Unleash the full power of a Jedi to save the Rebellion.',
    isGalacticLegend: true,
    rewardCharacterId: 'luke_skywalker_gl',
    recommendedPower: 45000,
    phases: [
      {
        phaseNumber: 1,
        description: 'Face the Emperor.',
        levelReq: 85, gearReq: 13, relicReq: 7, legendLevelReq: 0,
        requiredCharacterIds: ['luke_force_found', 'r2d2', 'c3po', 'han_solo', 'chewbacca'],
        enemies: ['darth_vader', 'emperor_palpatine', 'royal_guard', 'royal_guard'],
        rewards: [{ itemId: 'shards_luke_skywalker_gl', amount: 165 }]
      },
      {
        phaseNumber: 2,
        description: 'Embrace your destiny.',
        levelReq: 85, gearReq: 13, relicReq: 10, legendLevelReq: 0,
        requiredCharacterIds: [],
        loanedPlayerSquad: ['luke_skywalker_gl', 'leia_organa', 'han_solo', 'lando_calrissian', 'chewbacca'],
        enemies: ['gl_darth_sidious', 'darth_vader', 'stormtrooper'],
        rewards: [{ itemId: 'shards_luke_skywalker_gl', amount: 165 }]
      }
    ]
  }
];

export function getJourneyPrereqs(journeyId: string): JourneyPrereqItem[] {
  if (journeyId === 'j_anakin') {
    return [
      { id: 'captain_rex', name: 'Captain Rex', requiredRelic: 5, requiredGear: 13 },
      { id: 'echo_501st', name: 'Echo (501st)', requiredRelic: 5, requiredGear: 13 },
      { id: 'jesse', name: 'Jesse', requiredRelic: 5, requiredGear: 13 },
      { id: 'appo_501st', name: 'Appo (501st)', requiredRelic: 5, requiredGear: 13 },
      { id: 'fives', name: 'Fives', requiredRelic: 5, requiredGear: 13 }
    ];
  }
  if (journeyId === 'j_trench') {
    return [
      { id: 'bx_commando_droid', name: 'BX-Commando Droid', requiredRelic: 5, requiredGear: 13 },
      { id: 'kelhani', name: 'Kelhani', requiredRelic: 5, requiredGear: 13 },
      { id: 'droideka', name: 'Droideka', requiredRelic: 5, requiredGear: 13 },
      { id: 'dwarf_spider_droid', name: 'Dwarf Spider Droid', requiredRelic: 5, requiredGear: 13 },
      { id: 'magna_guard_elite', name: 'Magna Guard Elite', requiredRelic: 5, requiredGear: 13 }
    ];
  }
  if (journeyId === 'j_grand_inquisitor') {
    return [
      { id: 'fourth_sister', name: 'Fourth Sister', requiredRelic: 5, requiredGear: 13 },
      { id: 'marrok', name: 'Marrok', requiredRelic: 5, requiredGear: 13 },
      { id: 'reva', name: 'Reva (The Third Sister)', requiredRelic: 5, requiredGear: 13 },
      { id: 'crow', name: 'Crow', requiredRelic: 5, requiredGear: 13 },
      { id: 'barriss_fallen', name: 'Barriss (Fallen Healer)', requiredRelic: 5, requiredGear: 13 }
    ];
  }
  if (journeyId === 'j_thrawn') {
    return [
      { id: 'stormtrooper', name: 'Stormtrooper', requiredRelic: 0, requiredGear: 10 },
      { id: 'sandtrooper', name: 'Sandtrooper', requiredRelic: 0, requiredGear: 10 },
      { id: 'emperor_palpatine', name: 'Emperor Palpatine', requiredRelic: 0, requiredGear: 10 },
      { id: 'darth_vader', name: 'Darth Vader', requiredRelic: 0, requiredGear: 10 },
      { id: 'royal_guard', name: 'Royal Guard', requiredRelic: 0, requiredGear: 10 }
    ];
  }
  if (journeyId === 'j_old_ben') {
    return [
      { id: 'stormtrooper_luke', name: 'Stormtrooper Luke', requiredRelic: 0, requiredGear: 10 },
      { id: 'senator_organa', name: 'Senator Organa', requiredRelic: 0, requiredGear: 10 },
      { id: 'smuggler_chewbacca', name: 'Smuggler Chewbacca', requiredRelic: 0, requiredGear: 10 },
      { id: 'stormtrooper_han', name: 'Stormtrooper Han', requiredRelic: 0, requiredGear: 10 },
      { id: 'r2d2', name: 'R2-D2', requiredRelic: 0, requiredGear: 10 }
    ];
  }
  if (journeyId === 'j_boba') {
    return [
      { id: 'boba_fett', name: 'Boba Fett', requiredRelic: 0, requiredGear: 12 },
      { id: 'bossk', name: 'Bossk', requiredRelic: 0, requiredGear: 12 },
      { id: 'greedo', name: 'Greedo', requiredRelic: 0, requiredGear: 12 },
      { id: 'ig_88', name: 'IG-88', requiredRelic: 0, requiredGear: 12 },
      { id: 'aurra_sing', name: 'Aurra Sing', requiredRelic: 0, requiredGear: 12 }
    ];
  }
  if (journeyId === 'j_general_kenobi') {
    return [
      { id: 'commander_cody', name: 'Commander Cody', requiredRelic: 0, requiredGear: 12 },
      { id: 'waxer', name: 'Waxer', requiredRelic: 0, requiredGear: 12 },
      { id: 'boiler', name: 'Boiler', requiredRelic: 0, requiredGear: 12 },
      { id: 'clone_trooper_212th', name: '212th Clone Trooper', requiredRelic: 0, requiredGear: 12 },
      { id: 'aerial_trooper_212th', name: '212th Aerial Trooper', requiredRelic: 0, requiredGear: 12 }
    ];
  }
  if (journeyId === 'j_general_grievous') {
    return [
      { id: 'b1_battle_droid', name: 'B1 Battle Droid', requiredRelic: 0, requiredGear: 12 },
      { id: 'b2_super_droid', name: 'B2 Super Battle Droid', requiredRelic: 0, requiredGear: 12 },
      { id: 'tactical_droid', name: 'Tactical Droid', requiredRelic: 0, requiredGear: 12 },
      { id: 'crab_droid', name: 'Crab Droid', requiredRelic: 0, requiredGear: 12 },
      { id: 'magnaguard', name: 'MagnaGuard', requiredRelic: 0, requiredGear: 12 }
    ];
  }
  if (journeyId === 'gl_kenobi' || journeyId === 'gl_jmk') {
    return [
      { id: 'general_skywalker', name: 'General Skywalker', requiredRelic: 9, requiredGear: 13 },
      { id: 'coleman_kcaj', name: 'Coleman Kcaj', requiredRelic: 4, requiredGear: 13 },
      { id: 'oppo_rancisis', name: 'Oppo Rancisis', requiredRelic: 5, requiredGear: 13 },
      { id: 'adi_gallia', name: 'Adi Gallia', requiredRelic: 7, requiredGear: 13 },
      { id: 'luminara_unduli', name: 'Luminara Unduli', requiredRelic: 8, requiredGear: 13 },
      { id: 'yaddle', name: 'Yaddle', requiredRelic: 6, requiredGear: 13 }
    ];
  }
  if (journeyId === 'gl_grievous' || journeyId === 'gl_efg') {
    return [
      { id: 'nute_gunray', name: 'Nute Gunray', requiredRelic: 7, requiredGear: 13 },
      { id: 'dooku_war_council', name: 'Count Dooku', requiredRelic: 9, requiredGear: 13 },
      { id: 'wat_tambor', name: 'Wat Tambor', requiredRelic: 7, requiredGear: 13 },
      { id: 'lott_dod', name: 'Lott Dod', requiredRelic: 4, requiredGear: 13 },
      { id: 'whorm_loathsom', name: 'Whorm Loathsom', requiredRelic: 5, requiredGear: 13 },
      { id: 'grand_admiral_trench', name: 'Admiral Trench', requiredRelic: 9, requiredGear: 13 }
    ];
  }
  if (journeyId === 'gl_leia') {
    return [
      { id: 'senator_organa', name: 'Senator Leia', requiredRelic: 9, requiredGear: 13 },
      { id: 'alderaan_guard', name: 'Alderaan Guard', requiredRelic: 5, requiredGear: 13 },
      { id: 'mon_mothma', name: 'Mon Mothma', requiredRelic: 9, requiredGear: 13 },
      { id: 'stormtrooper_luke', name: 'Luke (Stormtrooper)', requiredRelic: 7, requiredGear: 13 },
      { id: 'stormtrooper_han', name: 'Han (Stormtrooper)', requiredRelic: 7, requiredGear: 13 },
      { id: 'smuggler_chewbacca', name: 'Chewbacca (Smuggler)', requiredRelic: 6, requiredGear: 13 },
      { id: 'r2d2', name: 'R2-D2', requiredRelic: 7, requiredGear: 13 },
      { id: 'boushh_leia', name: 'Boushh Leia', requiredRelic: 5, requiredGear: 13 },
      { id: 'old_ben', name: 'Old Ben', requiredRelic: 5, requiredGear: 13 },
      { id: 'winter', name: 'Winter', requiredRelic: 9, requiredGear: 13 },
      { id: 'princess_leia', name: 'Princess Leia', requiredRelic: 5, requiredGear: 13 },
      { id: 'boba_fett', name: 'Boba Fett', requiredRelic: 5, requiredGear: 13 }
    ];
  }
  if (journeyId === 'gl_jabba') {
    return [
      { id: 'boba_fett_daimyo', name: 'Boba Fett Daimyo', requiredRelic: 7, requiredGear: 13 },
      { id: 'embo', name: 'Embo', requiredRelic: 5, requiredGear: 13 },
      { id: 'r2d2', name: 'R2-D2', requiredRelic: 5, requiredGear: 13 },
      { id: 'alderaan_guard', name: 'Alderaan Guard', requiredRelic: 5, requiredGear: 13 },
      { id: 'krrsantan', name: 'Krrsantan', requiredRelic: 7, requiredGear: 13 },
      { id: 'bib_fortuna', name: 'Bib Fortuna', requiredRelic: 5, requiredGear: 13 },
      { id: 'gamorrean_guard_cartel', name: 'Gamorrean Guard', requiredRelic: 5, requiredGear: 13 },
      { id: 'greedo', name: 'Greedo', requiredRelic: 5, requiredGear: 13 },
      { id: 'boushh_leia', name: 'Boushh Leia', requiredRelic: 5, requiredGear: 13 },
      { id: 'boba_fett', name: 'Boba Fett', requiredRelic: 7, requiredGear: 13 },
      { id: 'smuggler_chewbacca', name: 'Chewbacca (Smuggler)', requiredRelic: 5, requiredGear: 13 },
      { id: 'han_solo', name: 'Han Solo', requiredRelic: 5, requiredGear: 13 }
    ];
  }
  if (journeyId === 'gl_lord_vader') {
    return [
      { id: 'commander_appo', name: 'Commander Appo', requiredRelic: 8, requiredGear: 13 },
      { id: 'knightfall_commander', name: 'Knightfall Commander', requiredRelic: 7, requiredGear: 13 },
      { id: 'commander_fox', name: 'Commander Fox', requiredRelic: 7, requiredGear: 13 },
      { id: 'crosshair_imperial', name: 'Crosshair (Imperial Marksman)', requiredRelic: 7, requiredGear: 13 },
      { id: 'scorch_knightfall', name: 'Scorch (Knightfall)', requiredRelic: 7, requiredGear: 13 },
      { id: 'darth_vader', name: 'Darth Vader', requiredRelic: 9, requiredGear: 13 },
      { id: 'shadow_trooper', name: 'Shadow Trooper', requiredRelic: 6, requiredGear: 13 },
      { id: 'admiral_piett', name: 'Admiral Piett', requiredRelic: 7, requiredGear: 13 },
      { id: 'tie_pilot', name: 'TIE Pilot', requiredRelic: 5, requiredGear: 13 },
      { id: 'stormtrooper', name: 'Stormtrooper', requiredRelic: 7, requiredGear: 13 },
      { id: 'gideon', name: 'Moff Gideon', requiredRelic: 7, requiredGear: 13 },
      { id: 'dark_trooper', name: 'Dark Trooper', requiredRelic: 5, requiredGear: 13 }
    ];
  }
  if (journeyId === 'gl_master_windu') {
    return [];
  }
  if (journeyId === 'j_director_krennic') {
    return [
      { id: 'partagaz', name: 'Major Partagaz', requiredRelic: 6, requiredGear: 13 },
      { id: 'death_trooper', name: 'Death Trooper', requiredRelic: 6, requiredGear: 13 },
      { id: 'kx_security_droid', name: 'KX Security Droid', requiredRelic: 6, requiredGear: 13 },
      { id: 'probe_droid', name: 'Imperial Probe Droid', requiredRelic: 6, requiredGear: 13 },
      { id: 'colonel_yularen', name: 'Colonel Yularen', requiredRelic: 6, requiredGear: 13 }
    ];
  }
  if (journeyId === 'j_admiral_raddus') {
    return [
      { id: 'jyn_erso', name: 'Jyn Erso', requiredRelic: 3, requiredGear: 13 },
      { id: 'cassian_andor', name: 'Cassian Andor', requiredRelic: 3, requiredGear: 13 },
      { id: 'k2so', name: 'K-2SO', requiredRelic: 3, requiredGear: 13 },
      { id: 'chirrut_imwe', name: 'Chirrut Îmwe', requiredRelic: 3, requiredGear: 13 },
      { id: 'baze_malbus', name: 'Baze Malbus', requiredRelic: 3, requiredGear: 13 }
    ];
  }
  if (journeyId === 'j_maul_mandalore') {
    return [
      { id: 'pre_vizsla', name: 'Pre Vizsla', requiredRelic: 6, requiredGear: 13 },
      { id: 'rook_kast', name: 'Rook Kast', requiredRelic: 6, requiredGear: 13 },
      { id: 'bo_katan_death_watch', name: 'Bo-Katan (Death Watch)', requiredRelic: 5, requiredGear: 13 },
      { id: 'dw_raider', name: 'Death Watch Raider', requiredRelic: 5, requiredGear: 13 },
      { id: 'dw_veteran', name: 'Death Watch Veteran', requiredRelic: 5, requiredGear: 13 },
      { id: 'savage_opress_dw', name: 'Savage Opress (Death Watch)', requiredRelic: 3, requiredGear: 13 }
    ];
  }
  if (journeyId === 'j_plo_koon') {
    return [
      { id: 'commander_wolffe', name: 'Commander Wolffe', requiredRelic: 6, requiredGear: 13 },
      { id: 'wp_boost', name: 'Boost', requiredRelic: 6, requiredGear: 13 },
      { id: 'wp_sinker', name: 'Sinker', requiredRelic: 6, requiredGear: 13 },
      { id: 'wp_heavy', name: 'Wolfpack Heavy', requiredRelic: 6, requiredGear: 13 },
      { id: 'wp_scout', name: 'Comet', requiredRelic: 6, requiredGear: 13 }
    ];
  }
  if (journeyId === 'j_palpatine') {
    return [
      { id: 'commander_fox_riot', name: 'Commander Fox (Riot)', requiredRelic: 0, requiredGear: 12 },
      { id: 'commander_thorn', name: 'Commander Thorn', requiredRelic: 0, requiredGear: 12 },
      { id: 'riot_guard', name: 'Riot Guard', requiredRelic: 0, requiredGear: 12 },
      { id: 'coruscant_trooper', name: 'Coruscant Trooper', requiredRelic: 0, requiredGear: 12 },
      { id: 'underworld_police', name: 'Underworld Police', requiredRelic: 0, requiredGear: 12 }
    ];
  }
  if (journeyId === 'j_ki_adi_mundi') {
    return [
      { id: 'commander_bacara', name: 'Commander Bacara', requiredRelic: 9, requiredGear: 13 },
      { id: 'neyo', name: 'Neyo', requiredRelic: 9, requiredGear: 13 },
      { id: 'jet_marine', name: 'Jet', requiredRelic: 9, requiredGear: 13 },
      { id: 'keller', name: 'Keller', requiredRelic: 9, requiredGear: 13 },
      { id: 'stak', name: 'Stak', requiredRelic: 9, requiredGear: 13 }
    ];
  }
  if (journeyId === 'j_crosshair') {
    return [
      { id: 'hunter', name: 'Hunter', requiredRelic: 1, requiredGear: 13 },
      { id: 'wrecker', name: 'Wrecker', requiredRelic: 1, requiredGear: 13 },
      { id: 'tech_bb', name: 'Tech', requiredRelic: 1, requiredGear: 13 },
      { id: 'echo_bb', name: 'Echo', requiredRelic: 1, requiredGear: 13 },
      { id: 'omega', name: 'Omega', requiredRelic: 1, requiredGear: 13 }
    ];
  }
  if (journeyId === 'gl_tarkin_journey') {
    return [];
  }
  if (journeyId === 'gl_ahsoka_grey') {
    return [
      { id: 'general_hera', name: 'General Hera Syndulla', requiredRelic: 7, requiredGear: 13 },
      { id: 'chopper', name: 'Chopper', requiredRelic: 7, requiredGear: 13 },
      { id: 'sabine_apprentice', name: 'Sabine Wren (Apprentice)', requiredRelic: 7, requiredGear: 13 },
      { id: 'zeb_nr', name: 'Zeb Orrelios', requiredRelic: 5, requiredGear: 13 },
      { id: 'huyang', name: 'Huyang', requiredRelic: 5, requiredGear: 13 },
      { id: 'ezra_exile', name: 'Ezra Bridger (Exile)', requiredRelic: 8, requiredGear: 13 },
      { id: 'bo_katan_mandalor', name: "Bo-Katan (Mand'alor)", requiredRelic: 8, requiredGear: 13 }
    ];
  }
  if (journeyId === 'gl_thrawn') {
    return [
      { id: 'commander_enoch', name: 'Commander Enoch', requiredRelic: 7, requiredGear: 13 },
      { id: 'night_trooper_peridea', name: 'Night Trooper', requiredRelic: 7, requiredGear: 13 },
      { id: 'death_trooper_peridea', name: 'Death Trooper', requiredRelic: 7, requiredGear: 13 },
      { id: 'scout_trooper_peridea', name: 'Scout Trooper', requiredRelic: 5, requiredGear: 13 },
      { id: 'shadow_trooper_peridea', name: 'Shadow Trooper', requiredRelic: 5, requiredGear: 13 },
      { id: 'warlord_drake_voss', name: 'Warlord Drake Voss', requiredRelic: 7, requiredGear: 13 },
      { id: 'mire_talon', name: 'Mire Talon', requiredRelic: 5, requiredGear: 13 },
      { id: 'torr_kane', name: 'Torr Kane', requiredRelic: 5, requiredGear: 13 },
      { id: 'ashen_veil', name: 'Ashen Veil', requiredRelic: 5, requiredGear: 13 },
      { id: 'hollow', name: 'Hollow', requiredRelic: 5, requiredGear: 13 },
      { id: 'captain_pellaeon', name: 'Captain Pellaeon', requiredRelic: 8, requiredGear: 13 }
    ];
  }
  if (journeyId === 'j_captain_pellaeon') {
    return [
      { id: 'commander_enoch', name: 'Commander Enoch', requiredRelic: 5, requiredGear: 13 },
      { id: 'night_trooper_peridea', name: 'Night Trooper (Peridea)', requiredRelic: 5, requiredGear: 13 },
      { id: 'death_trooper_peridea', name: 'Death Trooper (Peridea)', requiredRelic: 5, requiredGear: 13 },
      { id: 'scout_trooper_peridea', name: 'Scout Trooper (Peridea)', requiredRelic: 5, requiredGear: 13 },
      { id: 'shadow_trooper_peridea', name: 'Shadow Trooper (Peridea)', requiredRelic: 5, requiredGear: 13 }
    ];
  }
  if (journeyId === 'j_ezra_exile') {
    return [
      { id: 'general_hera', name: 'General Hera Syndulla', requiredRelic: 5, requiredGear: 13 },
      { id: 'chopper', name: 'Chopper', requiredRelic: 5, requiredGear: 13 },
      { id: 'sabine_apprentice', name: 'Sabine Wren (Apprentice)', requiredRelic: 5, requiredGear: 13 },
      { id: 'zeb_nr', name: 'Zeb Orrelios', requiredRelic: 3, requiredGear: 13 },
      { id: 'huyang', name: 'Huyang', requiredRelic: 3, requiredGear: 13 }
    ];
  }
  if (journeyId === 'j_bo_katan_mandalor') {
    return [
      { id: 'din_djarin_beskar', name: 'Din Djarin', requiredRelic: 7, requiredGear: 13 },
      { id: 'paz_vizsla', name: 'Paz Vizsla', requiredRelic: 7, requiredGear: 13 },
      { id: 'ig12_grogu', name: 'IG-12 & Grogu', requiredRelic: 5, requiredGear: 13 },
      { id: 'axe_woves', name: 'Axe Woves', requiredRelic: 5, requiredGear: 13 },
      { id: 'koska_reeves', name: 'Koska Reeves', requiredRelic: 5, requiredGear: 13 }
    ];
  }
  if (journeyId === 'j_baylan_skoll') {
    return [
      { id: 'morgan_elsbeth', name: 'Morgan Elsbeth', requiredRelic: 7, requiredGear: 13 },
      { id: 'marrok_mercenary', name: 'Marrok', requiredRelic: 7, requiredGear: 13 },
      { id: 'commander_hux_exile', name: 'Commander Hux', requiredRelic: 7, requiredGear: 13 },
      { id: 'shin_hati', name: 'Shin Hati', requiredRelic: 7, requiredGear: 13 }
    ];
  }
  if (journeyId === 'j_grand_inquisitor') {
    return [
      { id: 'reva', name: 'Reva (The Third Sister)', requiredRelic: 0, requiredGear: 12 },
      { id: 'marrok', name: 'Marrok', requiredRelic: 0, requiredGear: 12 },
      { id: 'crow', name: 'The Eighth Brother (Crow)', requiredRelic: 0, requiredGear: 12 },
      { id: 'barriss_fallen', name: 'Barriss Offee (Fallen)', requiredRelic: 0, requiredGear: 12 },
      { id: 'fourth_sister', name: 'Fourth Sister', requiredRelic: 0, requiredGear: 12 }
    ];
  }
  return [];
}

export function getJourneyDisplayTier(journeyId: string): number {
  if (journeyId === 'j_old_ben' || journeyId === 'j_thrawn') return 1;
  if (journeyId === 'j_boba' || journeyId === 'j_general_grievous' || journeyId === 'j_general_kenobi' || journeyId === 'j_grand_inquisitor') return 2;
  if (journeyId === 'j_ezra_exile' || journeyId === 'j_captain_pellaeon') return 3;
  if (journeyId === 'j_admiral_raddus' || journeyId === 'j_director_krennic' || journeyId === 'j_anakin' || journeyId === 'j_trench' || journeyId === 'j_crosshair') return 4;
  if (journeyId === 'j_maul_mandalore' || journeyId === 'j_plo_koon') return 5;
  if (journeyId === 'j_ki_adi_mundi' || journeyId === 'j_palpatine') return 6;
  if (journeyId === 'j_bo_katan_mandalor') return 5;
  return 4;
}
