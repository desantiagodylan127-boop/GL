const fs = require('fs');
let content = fs.readFileSync('src/data/campaign.ts', 'utf8');

const replacement = `export const PROGRESSION_MATERIALS = [
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

export const CAMPAIGN_NODES: CampaignNode[] = [];`;

content = content.replace("export const CAMPAIGN_NODES: CampaignNode[] = [];", replacement);
fs.writeFileSync('src/data/campaign.ts', content, 'utf8');
console.log("Patched!");
