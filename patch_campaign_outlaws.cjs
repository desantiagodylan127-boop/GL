const fs = require('fs');
let content = fs.readFileSync('src/data/campaign.ts', 'utf8');

// 1. Add Outlaws era to PLANET_CONFIGS
const outlawsPlanets = `  // --- OUTLAWS ERA ---
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
];`;

content = content.replace(/];[\s\S]*?export const CAMPAIGN_NODES/, outlawsPlanets + '\n\nexport const CAMPAIGN_NODES');

// 2. Add enemies to getEnemiesForPlanetAndSector
const outlawsEnemies = `    case 'Takodana': return ['hondo_ohnaka', 'krrsantan', 'bossk', 'stormtrooper', 'scout_trooper'];
    case 'Felucia': return ['boba_fett', 'aurra_sing', 'b1_battle_droid', 'b2_super_battle_droid', 'droideka'];
    case 'Vandor': return ['crimson_dawn_captain', 'crimson_dawn_soldier', 'range_trooper', 'stormtrooper', 'biker_scout'];
    case 'Kessel': return ['pyke_captain', 'pyke_soldier', 'pyke_enforcer', 'stormtrooper', 'tie_pilot'];
    case 'Anaxes': return ['admiral_piett', 'stormtrooper', 'stormtrooper_commando', 'b1_battle_droid', 'tactical_droid'];
    default: return ['b1_battle_droid', 'b2_super_battle_droid', 'magnaguard', 'dwarf_spider_droid', 'droideka'];`;

content = content.replace(/default: return \['b1_battle_droid', 'b2_super_battle_droid', 'magnaguard', 'dwarf_spider_droid', 'droideka'\];/, outlawsEnemies);

// 3. Add to PLANET_FORCED_FARMABLES
const forcedOutlaws = `  "Seatos": [
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
};`;

content = content.replace(/"Seatos": \[\s*"commander_enoch", "night_trooper_peridea", "death_trooper_peridea", "scout_trooper_peridea", "shadow_trooper_peridea"\s*\]\s*};/, forcedOutlaws);

// 4. Update the difficulty and cost since there are now more planets
// In the generation loop:
content = content.replace(/const basePower = 5000 \+ \(Math\.pow\(pIndex, 1\.5\) \* 4000\);/, "const basePower = 5000 + (Math.pow(pIndex, 1.6) * 4000);");


// We need to re-run the generator code inside the script, but since the generation logic
// runs at module evaluation time when CAMPAIGN_NODES is populated, modifying the arrays and logic
// in the file directly will auto-re-generate the CAMPAIGN_NODES when it's imported.
// Wait, the generation code does `charactersToAssign.shift()` etc. 
// I just need to make sure the file contents are correct.

fs.writeFileSync('src/data/campaign.ts', content, 'utf8');
console.log("Patched campaign.ts with Outlaws era.");
