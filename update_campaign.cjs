const fs = require('fs');

const content = `import { INITIAL_CHARACTERS } from './characters';
import { ALL_GEAR_PIECES } from './gear';

export interface CampaignNode {
  id: string;
  planet: string;
  sector: string;
  era: string;
  nodeName: string;
  difficulty: 'Normal' | 'Hard' | 'Legend';
  energyCost: number;
  powerRecommended: number;
  enemies: string[];
  background: string;
  rewards: {
    itemId: string;
    amountMin: number;
    amountMax: number;
    chance: number;
  }[];
}

export const PROGRESSION_MATERIALS = [
  { id: 'credit', name: 'Credits', desc: 'Main currency for leveling up characters, ranking gear, and promoting stars.', type: 'currency' },
  { id: 'crystal', name: 'Kyber Crystals', desc: 'Rare premium currency for buying character shard packs in the Scavenger Store.', type: 'currency' },
  { id: 'gear_salvage_low', name: 'Low Tier Gear Salvage', desc: 'Basic parts for upgrading low tier gear components.', type: 'gear' },
  { id: 'gear_salvage_mid', name: 'Mid Tier Gear Salvage', desc: 'Moderate parts for upgrading mid tier gear components.', type: 'gear' },
  { id: 'gear_salvage_high', name: 'High Tier Gear Salvage', desc: 'Advanced parts for upgrading high tier gear components.', type: 'gear' },
  { id: 'carbonite_matrix', name: 'Carbonite Matrix', desc: 'Relic Material Tier 1. Used to calibrate basic relic nodes.', type: 'relic' },
  { id: 'hyper_alloy', name: 'Hyper Alloy', desc: 'Relic Material Tier 2. Engineered for high defensive resilience.', type: 'relic' },
  { id: 'beskar_alloy', name: 'Beskar Alloy', desc: 'Relic Material Tier 3. Highly durable Mandalorian steel component.', type: 'relic' },
  { id: 'kyber_crystals', name: 'Kyber Crystals', desc: 'Relic Material Tier 4. Infused with Force energy for lightsaber precision.', type: 'relic' },
  { id: 'ancient_jedi_texts', name: 'Ancient Jedi Texts', desc: 'Relic Material Tier 5. Provides arcane insights into light side mastery.', type: 'relic' },
  { id: 'sith_obsidian', name: 'Sith Obsidian', desc: 'Relic Material Tier 6. Darkly resonant stone that unlocks raw Sith scaling.', type: 'relic' },
  { id: 'imperial_command_circuits', name: 'Imperial Command Circuits', desc: 'Relic Material Tier 7. Integrates strategic armor directives.', type: 'relic' },
  { id: 'smuggler_cache', name: 'Smuggler Cache', desc: 'Relic Material Tier 8. Contains restricted illegal parts and caches.', type: 'relic' },
  { id: 'clone_combat_data', name: 'Clone Combat Data', desc: 'Relic Material Tier 9. Preserves tactical field telemetry from clones.', type: 'relic' },
  { id: 'dark_matter_core', name: 'Dark Matter Core', desc: 'Relic Material Tier 10. Ultimate black-hole energy cell for prime relic slots.', type: 'relic' },
  { id: 'legend_shard', name: 'Legendary Spark', desc: 'Special farming material consumed to raise Legend levels from 1 to 10.', type: 'legend' }
];

const PLANET_CONFIGS = [
  // --- CLONE WARS ERA ---
  {
    name: 'Coruscant',
    era: 'CLONE WARS',
    sectors: ['Underworld', 'Jedi Temple', 'Chancellors Chambers'],
    backdrops: ['coruscant_underworld', 'coruscant_temple', 'coruscant_senate'],
    factionAffinity: ['galactic republic', 'clone trooper', 'coruscant guard', 'jedi', 'jedi guardian']
  },
  {
    name: 'Kamino',
    era: 'CLONE WARS',
    sectors: ['Topaka City', 'Barracks', 'Cloning Chambers'],
    backdrops: ['kamino_platform', 'kamino_lab', 'kamino_hangar'],
    factionAffinity: ['galactic republic', 'clone trooper', 'bad batch', 'jedi']
  },
  {
    name: 'Utapau',
    era: 'CLONE WARS',
    sectors: ['Landing Platform', 'Sepretist Base', 'Hot Springs'],
    backdrops: ['utapau_sinkhole', 'utapau_base', 'utapau_springs'],
    factionAffinity: ['separatist', 'droid', '212th', 'clone trooper']
  },
  {
    name: 'Geonosis',
    era: 'CLONE WARS',
    sectors: ['The Arena', 'Droid Foundries', 'Catacombs'],
    backdrops: ['geonosis_arena', 'geonosis_factory', 'geonosis_hive'],
    factionAffinity: ['separatist', 'separatist elite', 'separatist droid', 'separatist war council', 'geonosian']
  },
  {
    name: 'Ryloth',
    era: 'CLONE WARS',
    sectors: ['Badlands', 'Village', 'Capital'],
    backdrops: ['ryloth_canyon', 'ryloth_outpost', 'ryloth_tunnels'],
    factionAffinity: ['republic', '501st', 'wolfpack', 'clone trooper']
  },
  // --- IMPERIAL ERA ---
  {
    name: 'Tatooine',
    era: 'IMPERIAL',
    sectors: ['Great Desert', 'Mos Eisley', 'Stone Fields'],
    backdrops: ['tatooine_desert', 'tatooine_cantina', 'tatooine_dunes'],
    factionAffinity: ['rebel', 'hutt cartel', 'knightfall', 'bounty hunter']
  },
  {
    name: 'Hoth',
    era: 'IMPERIAL',
    sectors: ['Ice Fields', 'Trenches', 'Rebel Base'],
    backdrops: ['hoth_plains', 'hoth_trenches', 'hoth_base'],
    factionAffinity: ['rebel', 'empire', 'imperial remnant']
  },
  {
    name: 'Yavin 4',
    era: 'IMPERIAL',
    sectors: ['The Jungle', 'Rebel Headquarters', 'The Great Temple'],
    backdrops: ['yavin_jungle', 'yavin_base', 'yavin_temple'],
    factionAffinity: ['rebel', 'inquisitorius', 'the network', 'honor guard']
  },
  {
    name: 'Endor',
    era: 'IMPERIAL',
    sectors: ['Deep Forest', 'Great Village', 'Imperial Base'],
    backdrops: ['endor_forest', 'endor_village', 'endor_bunker'],
    factionAffinity: ['rebel', 'empire', 'imperial trooper', 'ewok']
  },
  {
    name: 'Death Star',
    era: 'IMPERIAL',
    sectors: ['Hanger Bay', 'Generator Room', 'Throne Room'],
    backdrops: ['deathstar_hangar', 'deathstar_corridor', 'deathstar_throne'],
    factionAffinity: ['empire', 'isb', 'emperors hand', 'sith']
  },
  // --- NEW REPUBLIC ERA ---
  {
    name: 'Peridea',
    era: 'NEW REPUBLIC',
    sectors: ['Wastelands', 'Nightsister Fortress', 'Exile Camp'],
    backdrops: ['peridea_wastes', 'peridea_keep', 'peridea_camp'],
    factionAffinity: ['exiles', 'nightsister', 'empire']
  },
  {
    name: 'Mandalore',
    era: 'NEW REPUBLIC',
    sectors: ['Glassed Surface', 'Underground Ruins', 'Great Forge'],
    backdrops: ['mandalore_surface', 'mandalore_ruins', 'mandalore_forge'],
    factionAffinity: ['mandalorian', 'imperial remnant']
  },
  {
    name: 'Morvek',
    era: 'NEW REPUBLIC',
    sectors: ['Acid Pools', 'Crashed Star Destroyer', 'Survivor Encampment'],
    backdrops: ['morvek_pools', 'morvek_wreckage', 'morvek_camp'],
    factionAffinity: ['morvek survivors', 'imperial remnant']
  },
  {
    name: 'Lothal',
    era: 'NEW REPUBLIC',
    sectors: ['Capital City', 'Jedi Temple Ruins', 'Grasslands'],
    backdrops: ['lothal_city', 'lothal_temple', 'lothal_plains'],
    factionAffinity: ['rebel', 'spectre', 'empire']
  },
  {
    name: 'Seatos',
    era: 'NEW REPUBLIC',
    sectors: ['Red Forests', 'Ancient Ruins', 'Henge'],
    backdrops: ['seatos_forest', 'seatos_ruins', 'seatos_henge'],
    factionAffinity: ['exiles', 'imperial remnant', 'empire']
  },
  // --- OUTLAWS ERA ---
  {
    name: 'Takodana',
    era: 'OUTLAWS',
    sectors: ['Mazs Castle', 'Forest Approach', 'Lakeside Base'],
    backdrops: ['takodana_castle', 'takodana_forest', 'takodana_lake'],
    factionAffinity: ['scoundrel', 'smuggler', 'pirate']
  },
  {
    name: 'Felucia',
    era: 'OUTLAWS',
    sectors: ['Fungal Forests', 'Separatist Wreckage', 'Mercenary Camp'],
    backdrops: ['felucia_forest', 'felucia_wreckage', 'felucia_camp'],
    factionAffinity: ['bounty hunter', 'separatist', 'scoundrel']
  },
  {
    name: 'Vandor',
    era: 'OUTLAWS',
    sectors: ['Snowy Peaks', 'Crimson Dawn Hideout', 'Train Heist'],
    backdrops: ['vandor_snow', 'vandor_hideout', 'vandor_train'],
    factionAffinity: ['crimson dawn', 'scoundrel', 'smuggler']
  },
  {
    name: 'Kessel',
    era: 'OUTLAWS',
    sectors: ['Spice Mines', 'Pyke Syndicate Fortress', 'The Maw'],
    backdrops: ['kessel_mines', 'kessel_fortress', 'kessel_maw'],
    factionAffinity: ['hutt cartel', 'scoundrel', 'rebel']
  },
  {
    name: 'Anaxes',
    era: 'OUTLAWS',
    sectors: ['Republic Shipyards', 'Asteroid Base', 'Abandoned Outpost'],
    backdrops: ['anaxes_shipyards', 'anaxes_asteroids', 'anaxes_outpost'],
    factionAffinity: ['galactic republic', 'scoundrel', 'bounty hunter']
  }
];

export const CAMPAIGN_NODES: CampaignNode[] = [];

function getEnemiesForPlanetAndSector(planetName: string, sectorName: string, nodeIndex: number): string[] {
  switch (planetName) {
    case 'Coruscant': return ['b1_battle_droid', 'b2_super_battle_droid', 'magnaguard', 'coruscant_trooper', 'underworld_police'];
    case 'Kamino': return ['general_grievous_droid', 'b1_battle_droid', 'b2_super_battle_droid', 'magnaguard', 'droideka'];
    case 'Utapau': return ['b1_battle_droid', 'b2_super_battle_droid', 'crab_droid', 'magnaguard', 'tactical_droid'];
    case 'Geonosis': return ['sun_fac', 'geonosian_brood_alpha', 'poggle_the_lesser', 'b2_super_battle_droid', 'magnaguard'];
    case 'Ryloth': return ['tactical_droid', 'b1_battle_droid', 'bx_commando_droid', 'droideka', 'magnaguard'];
    case 'Tatooine': return ['stormtrooper', 'sandtrooper', 'boba_fett', 'greedo', 'tusken_raider'];
    case 'Hoth': return ['snowtrooper', 'probe_droid', 'darth_vader', 'tie_pilot', 'stormtrooper_commando'];
    case 'Yavin 4': return ['stormtrooper', 'scout_trooper', 'death_trooper', 'shore_trooper', 'director_krennic_architect'];
    case 'Endor': return ['scout_trooper', 'stormtrooper', 'biker_scout', 'emperor_palpatine', 'royal_guard'];
    case 'Death Star': return ['stormtrooper', 'death_trooper', 'imperial_officer', 'darth_vader', 'emperor_palpatine'];
    case 'Peridea': return ['night_trooper_peridea', 'death_trooper_peridea', 'morgan_elsbeth', 'marrok_mercenary', 'grand_admiral_thrawn_exile'];
    case 'Mandalore': return ['moff_gideon_dark_trooper', 'dark_trooper', 'stormtrooper', 'incinerator_trooper', 'imperial_officer'];
    case 'Morvek': return ['warlord_drake_voss', 'mire_talon', 'torr_kane', 'ashen_veil', 'stormtrooper'];
    case 'Lothal': return ['stormtrooper', 'tie_pilot', 'imperial_officer', 'agent_kallus', 'grand_inquisitor'];
    case 'Seatos': return ['commander_enoch', 'night_trooper_peridea', 'scout_trooper_peridea', 'morgan_elsbeth', 'baylan_skoll'];
    case 'Takodana': return ['hondo_ohnaka', 'krrsantan', 'bossk', 'stormtrooper', 'scout_trooper'];
    case 'Felucia': return ['boba_fett', 'aurra_sing', 'b1_battle_droid', 'b2_super_battle_droid', 'droideka'];
    case 'Vandor': return ['crimson_dawn_captain', 'crimson_dawn_soldier', 'range_trooper', 'stormtrooper', 'biker_scout'];
    case 'Kessel': return ['pyke_captain', 'pyke_soldier', 'pyke_enforcer', 'stormtrooper', 'tie_pilot'];
    case 'Anaxes': return ['admiral_piett', 'stormtrooper', 'stormtrooper_commando', 'b1_battle_droid', 'tactical_droid'];
    default: return ['b1_battle_droid', 'b2_super_battle_droid', 'magnaguard', 'dwarf_spider_droid', 'droideka'];
  }
}

const PLANET_FORCED_FARMABLES: Record<string, string[]> = {
  "Coruscant": [
    "commander_fox_riot", "commander_thorn", "riot_guard", "coruscant_trooper", "underworld_police",
    "coleman_kcaj", "oppo_rancisis", "adi_gallia", "luminara_unduli", "yaddle",
    "kit_fisto", "depa_billaba", "saesee_tiin", "agen_kolar", "jocasta_nu"
  ],
  "Kamino": [
    "stak", "jet_marine", "keller", "neyo", "commander_bacara",
    "ima_gun_di", "barriss_offee", "quinlan_vos", "aayla_secura", "yoda",
    "omega", "echo_bb", "wrecker", "hunter", "tech_bb"
  ],
  "Utapau": [
    "b1_battle_droid", "b2_super_battle_droid", "crab_droid", "magnaguard", "tactical_droid",
    "magna_guard_elite", "bx_commando_droid", "droideka", "dwarf_spider_droid", "kelhani",
    "waxer", "boiler", "aerial_trooper_212th", "clone_trooper_212th", "commander_cody"
  ],
  "Geonosis": [
    "sun_fac", "gizor_dellso", "poggle_the_lesser", "geonosian_brood_alpha", "karina_the_great",
    "director_krennic_architect", "galen_erso", "imperial_engineer", "vice_admiral_dodd_rancit", "bevel_lemelisk",
    "batcher", "jedi_knight", "dedra_meero", "crimson_dawn_captain", "hondo_ohnaka"
  ],
  "Ryloth": [
    "four_lom", "zuckuss", "dengar", "ig_88", "stormtrooper_commando",
    "wp_boost", "wp_sinker", "wp_scout", "wp_heavy", "commander_wolffe",
    "jesse", "appo_501st", "echo_501st", "fives", "captain_rex"
  ],
  "Tatooine": [
    "stormtrooper_luke", "r2d2", "senator_organa", "stormtrooper_han", "smuggler_chewbacca",
    "gamorrean_guard_cartel", "bib_fortuna", "boba_fett", "greedo", "fennec_shand",
    "commander_appo", "scorch_knightfall", "commander_fox", "crosshair_imperial", "knightfall_commander"
  ],
  "Hoth": [
    "general_han_solo", "nien_nunb", "lando_calrissian", "chewbacca", "wedge_antilles",
    "commander_voren", "glaze", "hail", "frostburn", "captain_rime",
    "tie_pilot", "snowtrooper", "shore_trooper", "scout_trooper", "colonel_stark"
  ],
  "Yavin 4": [
    "emmie", "sm_33", "prast_ror", "dexter_jettster", "scissorpunch",
    "winter", "mon_mothma", "captain_antilles", "rebel_sentinel", "honor_guard",
    "barriss_fallen", "marrok", "crow", "fourth_sister", "reva"
  ],
  "Endor": [
    "general_veers", "admiral_piett", "magmatrooper", "sandtrooper", "tank_trooper",
    "chief_chirpa", "kneesaa", "wicket", "teebo", "paploo",
    "gideon", "incinerator_trooper", "hazard_trooper", "range_trooper", "dark_trooper"
  ],
  "Death Star": [
    "partagaz", "death_trooper", "kx_security_droid", "probe_droid", "colonel_yularen",
    "emperor_palpatine", "darth_vader", "royal_guard", "stormtrooper", "shadow_trooper",
    "riot_trooper", "gideon_hask", "mara_jade", "imperial_officer", "grand_moff_tarkin"
  ],
  "Peridea": [
    "shin_hati", "morgan_elsbeth", "marrok_mercenary", "commander_hux_exile", "captain_howzer"
  ],
  "Mandalore": [
    "paz_vizsla", "axe_woves", "koska_reeves", "din_djarin_beskar", "armorer"
  ],
  "Morvek": [
    "warlord_drake_voss", "mire_talon", "torr_kane", "ashen_veil", "hollow"
  ],
  "Lothal": [
    "general_hera", "chopper", "sabine_apprentice", "zeb_nr", "agent_kallus"
  ],
  "Seatos": [
    "commander_enoch", "night_trooper_peridea", "death_trooper_peridea", "scout_trooper_peridea", "shadow_trooper_peridea"
  ],
  "Takodana": [
    "sabe_dawn", "toht_ra", "crimson_spybot"
  ],
  "Felucia": [
    "triple_zero_conquest", "bt_one_conquest", "bokatan_exile"
  ],
  "Vandor": [
    "dw_vanguard", "dw_flametrooper", "bossk"
  ],
  "Kessel": [
    "embo", "aurra_sing", "darth_sidious_farmable"
  ],
  "Anaxes": [
    "dak_ralter", "wes_janson", "hobbie_klivian"
  ]
};

const forcedIds = Object.values(PLANET_FORCED_FARMABLES).flat();

const charactersToAssign = INITIAL_CHARACTERS.filter(char => 
  char.tags.includes("Legacy (Farmable)") ||
  forcedIds.includes(char.id)
);

function popCohesiveCharacter(planetName: string, planetFactions: string[]): typeof INITIAL_CHARACTERS[0] | null {
   if (charactersToAssign.length === 0) return null;
   
   if (PLANET_FORCED_FARMABLES[planetName] && PLANET_FORCED_FARMABLES[planetName].length > 0) {
      const targetId = PLANET_FORCED_FARMABLES[planetName][0];
      const forcedIndex = charactersToAssign.findIndex(c => c.id === targetId);
      if (forcedIndex !== -1) {
          PLANET_FORCED_FARMABLES[planetName].shift();
          return charactersToAssign.splice(forcedIndex, 1)[0];
      }
      PLANET_FORCED_FARMABLES[planetName].shift();
   }
   
   for (let i = 0; i < charactersToAssign.length; i++) {
       const char = charactersToAssign[i];
       const match = planetFactions.some(fac => char.tags.map(t=>t.toLowerCase()).includes(fac) || char.faction.toLowerCase().includes(fac));
       if (match) {
           charactersToAssign.splice(i, 1);
           return char;
       }
   }
   return charactersToAssign.shift() || null;
}

let nodeIdCounter = 1;
PLANET_CONFIGS.forEach((planetConfig, pIndex) => {
    const totalSectors = planetConfig.sectors.length;
    const basePower = 5000 + (Math.pow(pIndex, 1.6) * 4000); 

    for (let sIndex = 0; sIndex < totalSectors; sIndex++) {
        const sectorName = planetConfig.sectors[sIndex];
        const numNodes = 15;
        
        for (let nIndex = 0; nIndex < numNodes; nIndex++) {
            const isHard = nIndex >= 10;
            const isBoss = nIndex === numNodes - 1;
            const diff = isBoss ? 'Legend' : isHard ? 'Hard' : 'Normal';
            const cost = diff === 'Legend' ? 20 : diff === 'Hard' ? 16 : 10;
            
            const power = basePower + (sIndex * 3000) + (nIndex * 500) + (isBoss ? 8000 : 0);
            
            const hasCharReward = isHard;
            let charReward = null;
            if (hasCharReward) {
                charReward = popCohesiveCharacter(planetConfig.name, planetConfig.factionAffinity);
            }

            const nodeEnemies = getEnemiesForPlanetAndSector(planetConfig.name, sectorName, nIndex).slice();
            const backdrop = planetConfig.backdrops[sIndex % planetConfig.backdrops.length];
            const nodeName = isBoss ? \`\${sectorName} Apex\` : charReward ? \`\${charReward.name} Intercept\` : \`Sector \${sIndex+1} Patrol\`;

            const extraRewards = [];
            
            if (isBoss) {
               extraRewards.push({ itemId: 'legend_shard', amountMin: 1, amountMax: 2, chance: 0.1 + (pIndex*0.01) });
               extraRewards.push({ itemId: 'dark_matter_core', amountMin: 1, amountMax: 2, chance: 0.35 + (pIndex*0.02) });
               extraRewards.push({ itemId: 'ancient_jedi_texts', amountMin: 1, amountMax: 2, chance: 0.45 });
            } else if (isHard) {
               extraRewards.push({ itemId: 'sith_obsidian', amountMin: 1, amountMax: 3, chance: 0.3 + (pIndex*0.02) });
               extraRewards.push({ itemId: 'imperial_command_circuits', amountMin: 1, amountMax: 3, chance: 0.45 });
            } else {
               const seqGlobalIndex = (pIndex * 4 + sIndex) * 15 + nIndex;
               const gearPiece = ALL_GEAR_PIECES[seqGlobalIndex % ALL_GEAR_PIECES.length].id;
               extraRewards.push({ itemId: gearPiece, amountMin: 1, amountMax: 3, chance: 1.0 });
               
               const cycle = seqGlobalIndex % 4;
               if (cycle === 0) extraRewards.push({ itemId: 'carbonite_matrix', amountMin: 1, amountMax: 2, chance: 0.7 });
               else if (cycle === 1) extraRewards.push({ itemId: 'hyper_alloy', amountMin: 1, amountMax: 2, chance: 0.6 });
               else if (cycle === 2) extraRewards.push({ itemId: 'beskar_alloy', amountMin: 1, amountMax: 2, chance: 0.4 });
               else extraRewards.push({ itemId: 'kyber_crystals', amountMin: 1, amountMax: 1, chance: 0.25 });
            }

            CAMPAIGN_NODES.push({
               id: \`node_gen_\${nodeIdCounter++}\`,
               planet: planetConfig.name,
               sector: sectorName,
               era: planetConfig.era,
               nodeName: nodeName,
               difficulty: diff,
               energyCost: cost,
               powerRecommended: Math.floor(power),
               enemies: nodeEnemies,
               background: backdrop,
               rewards: [
                 { itemId: 'credit', amountMin: 300 + sIndex*150 + pIndex * 200, amountMax: 800 + sIndex*250 + pIndex * 350, chance: 1.0 },
                 { itemId: 'crystal', amountMin: 1, amountMax: 3, chance: isBoss ? 0.8 : 0.15 },
                 ...extraRewards,
                 ...(charReward ? [{
                     itemId: \`shards_\${charReward.id}\`,
                     amountMin: isBoss ? 4 : 2,
                     amountMax: isBoss ? 8 : 4,
                     chance: 0.85
                 }] : [])
               ]
            });
        }
    }
});

export const CAMPAIGN_CONFIG = {
  planets: PLANET_CONFIGS,
  nodes: CAMPAIGN_NODES
};
`;

fs.writeFileSync('src/data/campaign.ts', content, 'utf8');
console.log('Successfully updated src/data/campaign.ts');
