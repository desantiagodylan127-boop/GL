// Unified Shop Offer Database for Procurement Hub
import { ALL_GEAR_PIECES } from './gear';

export interface ShopItemOffer {
  itemId: string;
  name: string;
  qty: number;
  currency: 'credits' | 'crystals' | 'raid_token' | 'shard_token' | 'siege_token';
  price: number;
  characterId?: string;
  isRelicMaterial?: boolean;
  isLegendMat?: boolean;
}

// 1. SHIPMENTS (Standard Consumables & Massive Gear catalog)
const baseShipments: ShopItemOffer[] = [
  { itemId: 'training_droid', name: 'Basic Training Droid', qty: 10, currency: 'credits', price: 5000 },
  { itemId: 'medpac', name: 'Standard Medpac', qty: 5, currency: 'credits', price: 8000 },
  { itemId: 'gear_salvage_low', name: 'Low Tier Gear Salvage', qty: 5, currency: 'credits', price: 5000 },
  { itemId: 'gear_salvage_mid', name: 'Mid Tier Gear Salvage', qty: 5, currency: 'credits', price: 10000 },
  { itemId: 'gear_salvage_high', name: 'High Tier Gear Salvage', qty: 5, currency: 'crystals', price: 50 },
  { itemId: 'refill_energy', name: 'Tactical Energy Recharge', qty: 120, currency: 'crystals', price: 50 },
  { itemId: 'training_droid_mega', name: 'Industrial Training Droid Cache', qty: 50, currency: 'credits', price: 25000 },
  { itemId: 'medpac_bulk', name: 'Field Medpac Supply Crate', qty: 25, currency: 'credits', price: 35000 },
  { itemId: 'gear_salvage_bulk_low', name: 'Low Tier Gear Salvage (Bulk)', qty: 25, currency: 'credits', price: 20000 },
  { itemId: 'gear_salvage_bulk_mid', name: 'Mid Tier Gear Salvage (Bulk)', qty: 20, currency: 'credits', price: 38000 },
  { itemId: 'relic_booster_alpha', name: 'Relic Spark Booster Package', qty: 3, currency: 'credits', price: 75000 },
  { itemId: 'energy_capsule_low', name: 'Mini Energy Stimulant', qty: 30, currency: 'crystals', price: 15 },
  { itemId: 'credits_booster_crystals', name: 'High-yield Credit Reserve', qty: 100000, currency: 'crystals', price: 100 }
];

// Map all 72 gear pieces dynamically so they always have a spot with actual gear prices!
const gearShipments: ShopItemOffer[] = ALL_GEAR_PIECES.map(piece => {
  let currency: 'credits' | 'crystals' = 'credits';
  let price = 5000;
  
  if (piece.tier >= 10) {
    currency = piece.slot % 2 === 0 ? 'credits' : 'crystals';
    price = currency === 'credits' ? 240000 : 150;
  } else if (piece.tier >= 7) {
    currency = 'credits';
    price = 120000;
  } else if (piece.tier >= 4) {
    currency = 'credits';
    price = 45000;
  } else {
    currency = 'credits';
    price = 15000;
  }

  return {
    itemId: piece.id,
    name: piece.name,
    qty: 5,
    currency,
    price
  };
});

// Map all 15 relic/legend materials dynamically so they are always guaranteed a spot in standard Shipments
const relicShipments: ShopItemOffer[] = [
  { itemId: 'carbonite_matrix', name: 'Carbonite Matrix', qty: 5, currency: 'credits', price: 15000, isRelicMaterial: true },
  { itemId: 'hyper_alloy', name: 'Hyper Alloy Component', qty: 5, currency: 'credits', price: 25000, isRelicMaterial: true },
  { itemId: 'beskar_alloy', name: 'Beskar Alloy Fragment', qty: 5, currency: 'credits', price: 40000, isRelicMaterial: true },
  { itemId: 'kyber_crystals', name: 'Kyber Catalyst', qty: 2, currency: 'credits', price: 50000, isRelicMaterial: true },
  { itemId: 'ancient_jedi_texts', name: 'Ancient Jedi Texts', qty: 5, currency: 'credits', price: 60000, isRelicMaterial: true },
  { itemId: 'imperial_command_circuits', name: 'Imperial Command Circuits', qty: 5, currency: 'credits', price: 50000, isRelicMaterial: true },
  { itemId: 'clone_combat_data', name: 'Clone Combat Data', qty: 5, currency: 'credits', price: 35000, isRelicMaterial: true },
  { itemId: 'dark_matter_core', name: 'Dark Matter Core', qty: 2, currency: 'credits', price: 80000, isRelicMaterial: true },
  { itemId: 'smuggler_cache', name: 'Smuggler Cache', qty: 5, currency: 'credits', price: 30000, isRelicMaterial: true },
  { itemId: 'sith_obsidian', name: 'Sith Obsidian', qty: 5, currency: 'credits', price: 60000, isRelicMaterial: true },
  { itemId: 'aurodium_heatsink', name: 'Aurodium Heatsink', qty: 2, currency: 'credits', price: 75000, isRelicMaterial: true },
  { itemId: 'electrium_conductor', name: 'Electrium Conductor', qty: 2, currency: 'credits', price: 120000, isRelicMaterial: true },
  { itemId: 'zinbiddle_card', name: 'Zinbiddle Card', qty: 2, currency: 'credits', price: 180000, isRelicMaterial: true },
  { itemId: 'relic_fragment', name: 'Prime Relic Fragment', qty: 5, currency: 'credits', price: 50000, isRelicMaterial: true },
  { itemId: 'legend_shard', name: 'Legendary Spark', qty: 1, currency: 'credits', price: 250000, isLegendMat: true }
];

// Combined Shipments contains well over 100 items (13 base + 72 gear + 15 relics = 100 entries!)
export const SHIPMENT_GEAR: ShopItemOffer[] = [...baseShipments, ...gearShipments, ...relicShipments];

// 2. RAID SHOP (Relic Upgrade Materials)
export const RAID_UPGRADE_MATERIALS: ShopItemOffer[] = [
  { itemId: 'dark_matter_core', name: 'Dark Matter Core', qty: 2, currency: 'raid_token', price: 500, isRelicMaterial: true },
  { itemId: 'clone_combat_data', name: 'Clone Combat Data', qty: 3, currency: 'raid_token', price: 400, isRelicMaterial: true },
  { itemId: 'smuggler_cache', name: 'Smuggler Cache', qty: 3, currency: 'raid_token', price: 300, isRelicMaterial: true },
  { itemId: 'ancient_jedi_texts', name: 'Ancient Jedi Texts', qty: 2, currency: 'raid_token', price: 600, isRelicMaterial: true },
  { itemId: 'sith_obsidian', name: 'Sith Obsidian', qty: 2, currency: 'raid_token', price: 600, isRelicMaterial: true },
  { itemId: 'imperial_command_circuits', name: 'Command Circuits', qty: 2, currency: 'raid_token', price: 600, isRelicMaterial: true },
  { itemId: 'aurodium_heatsink', name: 'Aurodium Heatsink', qty: 2, currency: 'raid_token', price: 800, isRelicMaterial: true },
  { itemId: 'electrium_conductor', name: 'Electrium Conductor', qty: 1, currency: 'raid_token', price: 1000, isRelicMaterial: true }
];

// 3. SHARD SHOP (Currency from Maxed Shards)
export const SHARD_SHOP_ITEMS: ShopItemOffer[] = [
  { itemId: 'gear_salvage_low', name: 'Low Tier Gear Salvage (Bulk)', qty: 10, currency: 'shard_token', price: 100 },
  { itemId: 'gear_salvage_mid', name: 'Mid Tier Gear Salvage (Bulk)', qty: 10, currency: 'shard_token', price: 200 },
  { itemId: 'gear_salvage_high', name: 'High Tier Gear Salvage (Bulk)', qty: 10, currency: 'shard_token', price: 300 },
  { itemId: 'carbonite_matrix', name: 'Carbonite Matrix (Bulk)', qty: 5, currency: 'shard_token', price: 300, isRelicMaterial: true },
  { itemId: 'hyper_alloy', name: 'Hyper Alloy (Bulk)', qty: 5, currency: 'shard_token', price: 400, isRelicMaterial: true },
  { itemId: 'beskar_alloy', name: 'Beskar Alloy (Bulk)', qty: 5, currency: 'shard_token', price: 500, isRelicMaterial: true },
  { itemId: 'kyber_crystals', name: 'Kyber Catalyst', qty: 2, currency: 'shard_token', price: 800 },
  { itemId: 'zinbiddle_card', name: 'Zinbiddle Card', qty: 1, currency: 'shard_token', price: 1200, isRelicMaterial: true }
];

// 4. SIEGE STORE (Legendary Materials & Relic Upgrades)
export const SIEGE_STORE_ITEMS: ShopItemOffer[] = [
  { itemId: 'legend_shard', name: 'Legendary Spark', qty: 1, currency: 'siege_token', price: 1500, isLegendMat: true },
  { itemId: 'relic_fragment', name: 'Prime Relic Fragment', qty: 5, currency: 'siege_token', price: 600, isRelicMaterial: true },
  { itemId: 'zinbiddle_card', name: 'Zinbiddle Card', qty: 2, currency: 'siege_token', price: 800, isRelicMaterial: true },
  { itemId: 'electrium_conductor', name: 'Electrium Conductor', qty: 3, currency: 'siege_token', price: 900, isRelicMaterial: true },
  { itemId: 'aurodium_heatsink', name: 'Aurodium Heatsink', qty: 3, currency: 'siege_token', price: 700, isRelicMaterial: true },
  { itemId: 'dark_matter_core', name: 'Dark Matter Core', qty: 3, currency: 'siege_token', price: 500, isRelicMaterial: true },
  { itemId: 'beskar_alloy', name: 'Beskar Alloy Bundle', qty: 10, currency: 'siege_token', price: 600, isRelicMaterial: true }
];

// 5. BLACK MARKET (Normalized, fair prices - no longer over-inflated!)
export const BLACK_MARKET_ITEMS: ShopItemOffer[] = [
  { itemId: 'legend_shard', name: 'Legendary Spark (Black Market)', qty: 1, currency: 'crystals', price: 250, isLegendMat: true },
  { itemId: 'zinbiddle_card', name: 'Syndicate Zinbiddle Card', qty: 2, currency: 'credits', price: 120000, isRelicMaterial: true },
  { itemId: 'electrium_conductor', name: 'Hot Electrium Conductor', qty: 2, currency: 'credits', price: 90000, isRelicMaterial: true },
  { itemId: 'aurodium_heatsink', name: 'Smuggled Aurodium Heatsink', qty: 2, currency: 'credits', price: 60000, isRelicMaterial: true },
  { itemId: 'ancient_jedi_texts', name: 'Ancient Jedi Texts', qty: 5, currency: 'credits', price: 50000, isRelicMaterial: true },
  { itemId: 'sith_obsidian', name: 'Sith Obsidian', qty: 5, currency: 'crystals', price: 120, isRelicMaterial: true },
  { itemId: 'refill_energy', name: 'Black Market Energy Stim', qty: 300, currency: 'crystals', price: 80 }
];

// GACHA PACK CONFIGURATION (BAR STAND)
export interface GachaPack {
  id: string;
  name: string;
  description: string;
  costCrystals: number;
  packType: 'cantina' | 'premium' | 'mega' | 'relic' | 'faction';
  icon: string;
  factionTag?: string;
  isMultiDraw?: boolean;
}

export const GACHA_PACKS: GachaPack[] = [
  {
    id: 'pack_cantina_shards',
    name: 'Marquee & Starter Recruits Pack',
    description: 'Guarantees 5 to 8 shards of a random Farmable/Marquee Character. Drop Rates: 100% chance for eligible farmable recruits (e.g. Captain Rex, Fives).',
    costCrystals: 150,
    packType: 'cantina',
    icon: '🍺'
  },
  {
    id: 'pack_premium_unlock',
    name: 'Conquest & Elite Shard Pack',
    description: 'Guarantees 10 to 15 shards of elite past Conquest or Marquee characters. Drop Rates: 80% chance for 10-15 shards, 20% chance for a full 80-shard instant unlock of an elite unit.',
    costCrystals: 450,
    packType: 'premium',
    icon: '✨'
  },
  {
    id: 'pack_mega_raid',
    name: 'Ultimate Relic & Conquest Booster',
    description: 'Guarantees exactly 20 shards of an elite past Conquest or Marquee character, 3 to 5 random high-tier Relic Materials, and 10,000 Credits. Drop Rates: 100% chance of all items.',
    costCrystals: 850,
    packType: 'mega',
    icon: '🏆'
  },
  {
    id: 'pack_relic_upgrade',
    name: 'Relic & Core Materials Pack',
    description: 'Guarantees 3 to 5 random Relic upgrade materials of a specific type. Drop Rates: 40% Carbonite Matrix, 30% Beskar/Hyper Alloy, 20% Aurodium Heatsink, 10% Electrium Conductor / Zinbiddle Card.',
    costCrystals: 300,
    packType: 'relic',
    icon: '⚙️'
  },
  {
    id: 'pack_faction_separatist',
    name: 'Separatist Vanguard Multi-Pack',
    description: 'Multi-Draw: Yields 5 separate sets of 10 to 100 shards each for random Separatist characters! Guaranteed Farmable or Conquest tier recruits.',
    costCrystals: 750,
    packType: 'faction',
    factionTag: 'Separatist',
    isMultiDraw: true,
    icon: '🤖'
  },
  {
    id: 'pack_faction_clone',
    name: 'Clone Trooper Garrison Multi-Pack',
    description: 'Multi-Draw: Yields 5 separate sets of 10 to 100 shards each for random Clone Trooper or 501st characters! Build your Republic squad.',
    costCrystals: 750,
    packType: 'faction',
    factionTag: 'Clone Trooper',
    isMultiDraw: true,
    icon: '🛡️'
  },
  {
    id: 'pack_faction_jedi',
    name: 'Jedi High Council Multi-Pack',
    description: 'Multi-Draw: Yields 5 separate sets of 10 to 100 shards each for random Jedi characters! Secure protectors of the Galactic Republic.',
    costCrystals: 750,
    packType: 'faction',
    factionTag: 'Jedi',
    isMultiDraw: true,
    icon: '🟢'
  },
  {
    id: 'pack_faction_sith',
    name: 'Sith Inquisitorius Multi-Pack',
    description: 'Multi-Draw: Yields 5 separate sets of 10 to 100 shards each for random Sith or Inquisitorius characters! Embrace the power of the Dark Side.',
    costCrystals: 750,
    packType: 'faction',
    factionTag: 'Sith',
    isMultiDraw: true,
    icon: '🔴'
  },
  {
    id: 'pack_faction_empire',
    name: 'Imperial Might Multi-Pack',
    description: 'Multi-Draw: Yields 5 separate sets of 10 to 100 shards each for random Empire or Imperial Remnant characters! Enforce galactic order.',
    costCrystals: 750,
    packType: 'faction',
    factionTag: 'Empire',
    isMultiDraw: true,
    icon: '🦅'
  },
  {
    id: 'pack_faction_rebel',
    name: 'Rebel Insurgency Multi-Pack',
    description: 'Multi-Draw: Yields 5 separate sets of 10 to 100 shards each for random Rebel faction characters! Restore the Republic.',
    costCrystals: 750,
    packType: 'faction',
    factionTag: 'Rebel',
    isMultiDraw: true,
    icon: '⭐'
  },
  {
    id: 'pack_faction_corsair',
    name: 'Hondo\'s Pirate Syndicate Multi-Pack',
    description: 'Multi-Draw: Yields 5 separate sets of 10 to 100 shards each for random Corsair, Pirate, or Scoundrel characters! Extremely profitable.',
    costCrystals: 750,
    packType: 'faction',
    factionTag: 'Corsair',
    isMultiDraw: true,
    icon: '🏴‍☠️'
  }
];
