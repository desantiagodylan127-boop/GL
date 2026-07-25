import React, { useState } from 'react';
import { SaveState } from '../types';
import { ALL_GEAR_PIECES } from '../data/gear';
import { CAMPAIGN_NODES } from '../data/campaign';
import { 
  Search, 
  Compass, 
  Scan, 
  SlidersHorizontal, 
  X, 
  HelpCircle, 
  ShoppingCart, 
  Award, 
  Orbit, 
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface MaterialsInventoryViewProps {
  saveState: SaveState;
  onNavigateToFarm?: (targetTab: any, targetId?: string) => void;
}

interface NavigationSource {
  source: string;
  detail: string;
  tab: 'campaign' | 'shop' | 'events_special' | 'journey' | 'raid' | 'conquest';
  targetId?: string;
  actionText: string;
}

export const MaterialsInventoryView: React.FC<MaterialsInventoryViewProps> = ({
  saveState,
  onNavigateToFarm
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'relic' | 'gear' | 'currency'>('all');
  const [stockStatus, setStockStatus] = useState<'all' | 'owned' | 'unowned'>('all');
  const [gearTier, setGearTier] = useState<number | 'all'>('all');
  const [primarySource, setPrimarySource] = useState<'all' | 'campaign' | 'shop' | 'raids_events'>('all');
  
  // State for the Holographic Source Locator Radar modal
  const [selectedMaterial, setSelectedMaterial] = useState<{
    id: string;
    name: string;
    desc: string;
    owned: number;
    locations: string;
    type: 'relic' | 'gear' | 'currency';
  } | null>(null);

  // Define relic materials with descriptions and farming sources
  const RELIC_MATERIALS = [
    {
      id: 'carbonite_matrix',
      name: 'Carbonite Matrix',
      desc: 'Standard metal alloy used to reinforce basic relic structures.',
      locations: 'Campaign Hard Nodes, Scavenger Shop, Daily Events',
      type: 'relic' as const
    },
    {
      id: 'hyper_alloy',
      name: 'Hyper Alloy',
      desc: 'High-energy alloy designed to handle amplified voltage in relic wiring.',
      locations: 'Campaign Legendary Nodes, Scavenger Shop, Raids',
      type: 'relic' as const
    },
    {
      id: 'beskar_alloy',
      name: 'Beskar Alloy',
      desc: 'Extremely resilient material that provides heat dissipation for relics.',
      locations: 'Campaign Legendary Nodes, Scavenger Shop, Raids',
      type: 'relic' as const
    },
    {
      id: 'kyber_crystals',
      name: 'Kyber Crystals',
      desc: 'Force-tuned crystal shard that channels relic amplification beams.',
      locations: 'Daily Challenges, Raids, Guild Store',
      type: 'relic' as const
    },
    {
      id: 'ancient_jedi_texts',
      name: 'Ancient Jedi Texts',
      desc: 'Sparsely recovered records describing advanced relic alignment practices.',
      locations: 'Raid Shop, Special Events',
      type: 'relic' as const
    },
    {
      id: 'imperial_command_circuits',
      name: 'Imperial Command Circuits',
      desc: 'Microprocessor circuitry extracted from elite Imperial commanders.',
      locations: 'Guild Store, Raids, Conquest',
      type: 'relic' as const
    },
    {
      id: 'clone_combat_data',
      name: 'Clone Combat Data',
      desc: 'Tactical matrices of seasoned clones, used to configure relic processors.',
      locations: 'Guild Store, Raids, Conquest',
      type: 'relic' as const
    },
    {
      id: 'dark_matter_core',
      name: 'Dark Matter Core',
      desc: 'Subatomic reactor cores harvested from anomalous deep-space fields.',
      locations: 'Raids, Alliance Shop, Conquest Merchants',
      type: 'relic' as const
    },
    {
      id: 'legend_shard',
      name: 'Legendary Spark Data',
      desc: 'Pure harmonic energy signature used to ignite Galactic Legend resonance.',
      locations: 'Conquest Store, Weekly Supplies, Special Events',
      type: 'relic' as const
    },
    {
      id: 'era_currency',
      name: 'Era Currency',
      desc: 'Specialized credits utilized to tune Era-specific characters.',
      locations: 'Era Events, Rotating Challenges, Conquest Shop',
      type: 'currency' as const
    }
  ];

  // Helper to generate multiple farming/acquisition sources with direct navigate buttons
  function getSourcesForMaterial(item: {
    id: string;
    name: string;
    desc: string;
    locations: string;
    type: 'relic' | 'gear' | 'currency';
  }): NavigationSource[] {
    const sources: NavigationSource[] = [];

    if (item.type === 'relic') {
      if (item.id === 'carbonite_matrix') {
        sources.push({
          source: 'Campaign Sector Nodes (Hard)',
          detail: 'Farm sector missions on Hard difficulty to salvage basic matrices.',
          tab: 'campaign',
          actionText: 'WARP TO CAMPAIGN'
        });
        sources.push({
          source: 'Scavenger Junk Salvage',
          detail: 'Convert excess standard gear into carbonite matrices at the Scavenger.',
          tab: 'shop',
          actionText: 'WARP TO SCAVENGER'
        });
        sources.push({
          source: 'Daily Events & Milestones',
          detail: 'Participate in rotating daily resource events for bonus matrices.',
          tab: 'events_special',
          actionText: 'GALACTIC EVENTS'
        });
      } else if (item.id === 'hyper_alloy' || item.id === 'beskar_alloy') {
        sources.push({
          source: 'Campaign Sector Nodes (Legendary)',
          detail: 'Farm sector missions on Legendary difficulty for elite alloy metals.',
          tab: 'campaign',
          actionText: 'WARP TO CAMPAIGN'
        });
        sources.push({
          source: 'Scavenger Shop & Shipments',
          detail: 'Direct purchase with crystals or guild tokens inside the shipments.',
          tab: 'shop',
          actionText: 'GO TO SHIPMENTS'
        });
        sources.push({
          source: 'Raid Operations',
          detail: 'Join guild raids to earn premium alloys as leaderboard rewards.',
          tab: 'raid',
          actionText: 'WARP TO RAIDS'
        });
      } else if (item.id === 'kyber_crystals') {
        sources.push({
          source: 'Daily Challenges',
          detail: 'Complete daily activity challenges inside the core hub.',
          tab: 'events_special',
          actionText: 'GALACTIC EVENTS'
        });
        sources.push({
          source: 'Guild Shipments',
          detail: 'Buy directly with Guild tokens inside the Supplies shop shipments.',
          tab: 'shop',
          actionText: 'GO TO SHOP'
        });
        sources.push({
          source: 'Raid Operations',
          detail: 'High-tier reward chests in active Guild raids drop Kyber crystals.',
          tab: 'raid',
          actionText: 'WARP TO RAIDS'
        });
      } else if (item.id === 'ancient_jedi_texts') {
        sources.push({
          source: 'Guild Raid Store',
          detail: 'Exchange raid currency directly for sacred archives and texts.',
          tab: 'shop',
          actionText: 'GO TO STORE'
        });
        sources.push({
          source: 'Legendary Events & Journeys',
          detail: 'Earned through completing special Force alignment milestones.',
          tab: 'journey',
          actionText: 'JOURNEYS INDEX'
        });
      } else if (item.id === 'imperial_command_circuits' || item.id === 'clone_combat_data') {
        sources.push({
          source: 'Conquest Store Shipments',
          detail: 'Spend conquest tokens on elite operational circuitry.',
          tab: 'shop',
          actionText: 'GO TO SHIPMENTS'
        });
        sources.push({
          source: 'Guild Raid Operations',
          detail: 'High reward tier guild raid chests.',
          tab: 'raid',
          actionText: 'WARP TO RAIDS'
        });
        sources.push({
          source: 'Sector Conquest',
          detail: 'Progress through Conquest sectors to unlock commander circuits.',
          tab: 'conquest',
          actionText: 'WARP TO CONQUEST'
        });
      } else if (item.id === 'dark_matter_core') {
        sources.push({
          source: 'Raid Operations (Heroic)',
          detail: 'Awarded to top performers in high-difficulty heroic raids.',
          tab: 'raid',
          actionText: 'WARP TO RAIDS'
        });
        sources.push({
          source: 'Alliance Shipments',
          detail: 'Purchase from the rotating alliance shipments node.',
          tab: 'shop',
          actionText: 'GO TO SHOP'
        });
      } else if (item.id === 'legend_shard') {
        sources.push({
          source: 'Sector Conquest Bosses',
          detail: 'Defeat final bosses in Conquest sectors for Legendary Spark data.',
          tab: 'conquest',
          actionText: 'WARP TO CONQUEST'
        });
        sources.push({
          source: 'Weekly Supplies Shop',
          detail: 'Rare high-value packages available in shipments during weekly rotations.',
          tab: 'shop',
          actionText: 'GO TO SUPPLIES'
        });
      } else if (item.id === 'era_currency') {
        sources.push({
          source: 'Era Battles',
          detail: 'Clear themed battles inside the current active Era.',
          tab: 'events_special',
          actionText: 'GO TO ERA SECTOR'
        });
      } else {
        sources.push({
          source: 'Supplies Shop & Shipments',
          detail: 'Featured in general supply shipments.',
          tab: 'shop',
          actionText: 'GO TO SHOP'
        });
      }
    } else {
      // Gear components
      const matchingNode = CAMPAIGN_NODES.find(n => n.rewards.some(r => r.itemId === item.id));
      if (matchingNode) {
        sources.push({
          source: `Sector Campaign Node ${matchingNode.id.toUpperCase()}`,
          detail: `Planet: ${matchingNode.planet} - Mode: ${matchingNode.difficulty}. Reward probability: High.`,
          tab: 'campaign',
          targetId: matchingNode.id,
          actionText: `WARP TO NODE`
        });
      }
      sources.push({
        source: 'Supplies Shipments',
        detail: 'Rotating inventory inside the main shipments node.',
        tab: 'shop',
        actionText: 'CHECK SHIPMENTS'
      });
      sources.push({
        source: 'Guild Token Exchange',
        detail: 'Purchase with Guild tokens earned from Raids and Daily Guild activities.',
        tab: 'shop',
        actionText: 'CHECK STORE'
      });
    }

    return sources;
  }

  // Search filter
  const term = searchTerm.toLowerCase();

  // 1. Filter and sort Relics / Currencies
  const filteredRelics = RELIC_MATERIALS.filter(item => {
    const owned = saveState.inventory[item.id] || 0;
    
    // Search Term
    if (term) {
      const match = item.name.toLowerCase().includes(term) || item.desc.toLowerCase().includes(term);
      if (!match) return false;
    }

    // Material Class / Category
    if (filterCategory !== 'all') {
      if (filterCategory === 'gear') return false; // Relics can't be gear
      if (item.type !== filterCategory) return false;
    }

    // Stock Status
    if (stockStatus === 'owned' && owned <= 0) return false;
    if (stockStatus === 'unowned' && owned > 0) return false;

    // Gear Tier filter (Relics don't have a tier, so if tier is specified, hide relics)
    if (gearTier !== 'all') return false;

    // Primary Source
    if (primarySource !== 'all') {
      const locs = item.locations.toLowerCase();
      if (primarySource === 'campaign' && !locs.includes('campaign')) return false;
      if (primarySource === 'shop' && !(locs.includes('shop') || locs.includes('store') || locs.includes('scavenger') || locs.includes('supplies') || locs.includes('shipments'))) return false;
      if (primarySource === 'raids_events' && !(locs.includes('raid') || locs.includes('event') || locs.includes('challenge') || locs.includes('conquest'))) return false;
    }

    return true;
  }).sort((a, b) => {
    const ownedA = saveState.inventory[a.id] || 0;
    const ownedB = saveState.inventory[b.id] || 0;
    return ownedB - ownedA; // Show owned relics first
  });

  // 2. Filter and sort Gear components
  const ownedGear = ALL_GEAR_PIECES.map(gear => {
    const owned = saveState.inventory[gear.id] || 0;
    return { ...gear, owned };
  }).filter(gear => {
    // Search Term
    if (term) {
      const match = gear.name.toLowerCase().includes(term) || gear.id.toLowerCase().includes(term);
      if (!match) return false;
    }

    // Material Class / Category
    if (filterCategory !== 'all' && filterCategory !== 'gear') {
      return false; // Gear can only show up in 'all' or 'gear'
    }

    // Stock Status
    if (stockStatus === 'owned' && gear.owned <= 0) return false;
    if (stockStatus === 'unowned' && gear.owned > 0) return false;

    // Gear Tier filter
    if (gearTier !== 'all' && gear.tier !== gearTier) return false;

    // Primary Source
    if (primarySource !== 'all') {
      const matchingNode = CAMPAIGN_NODES.find(n => n.rewards.some(r => r.itemId === gear.id));
      if (primarySource === 'campaign' && !matchingNode) return false;
      if (primarySource === 'raids_events') return false; // Gear is primarily from nodes or shop
    }

    return true;
  }).sort((a, b) => {
    // Sort owned items to the top, then sort by tier descending, then slot ascending
    if (b.owned !== a.owned) {
      return b.owned - a.owned;
    }
    if (b.tier !== a.tier) {
      return b.tier - a.tier;
    }
    return a.slot - b.slot;
  });

  return (
    <div className="space-y-6 animate-fadeIn" id="materials_inventory_panel">
      {/* Search Header */}
      <div className="holo-panel py-3.5 px-4 rounded-2xl flex flex-wrap gap-3 items-center justify-between border-cyan-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none"></div>
        <div className="flex flex-wrap gap-3 items-center relative z-10 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, tags, or components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/60 border border-zinc-800 focus:border-cyan-500/50 text-white pl-9 pr-4 py-2 rounded-xl text-xs font-mono placeholder-zinc-600 focus:outline-none transition-all w-full shadow-inner"
            />
          </div>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 uppercase px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>
        <span className="text-cyan-500/60 text-[10px] font-mono uppercase tracking-widest relative z-10">
          Command Grid Cargo Bay
        </span>
      </div>

      {/* CARGO SORTING & FILTERS CONTROL CENTER */}
      <div className="holo-panel border-zinc-800 bg-black/60 p-4 rounded-2xl space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.02] to-transparent pointer-events-none"></div>
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 relative z-10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-zinc-300 font-bold">Cargo Control System & Filters</h3>
          </div>
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('all');
              setStockStatus('all');
              setGearTier('all');
              setPrimarySource('all');
            }}
            className="text-rose-400 hover:text-rose-300 font-mono text-[9px] uppercase tracking-wider font-bold transition"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {/* Category Selector */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">Material Class</span>
            <div className="flex flex-wrap gap-1">
              {(['all', 'relic', 'gear', 'currency'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterCategory(cat);
                    if (cat !== 'gear') setGearTier('all');
                  }}
                  className={`px-2 py-1.5 text-[9px] font-mono rounded-lg border uppercase transition font-bold ${
                    filterCategory === cat
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 glow-neon'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  {cat === 'all' ? 'All Classes' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Status */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">In-Stock Status</span>
            <div className="flex flex-wrap gap-1">
              {(['all', 'owned', 'unowned'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStockStatus(st)}
                  className={`px-2 py-1.5 text-[9px] font-mono rounded-lg border uppercase transition font-bold ${
                    stockStatus === st
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 glow-neon'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  {st === 'all' ? 'All Stock' : st === 'owned' ? 'Owned' : 'Out of Stock'}
                </button>
              ))}
            </div>
          </div>

          {/* Enhancement Tier (For Gear Matrices) */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">Matrix Enhancement Tier</span>
            <div className="flex flex-wrap gap-1">
              {(['all', 1, 2, 3, 4, 5, 6] as const).map(tr => (
                <button
                  key={tr}
                  onClick={() => {
                    setGearTier(tr);
                    if (tr !== 'all') {
                      setFilterCategory('gear'); // Auto lock to gear view when a gear tier is chosen
                    }
                  }}
                  className={`px-1.5 py-1 text-[9px] font-mono rounded-lg border uppercase transition font-bold ${
                    gearTier === tr
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 glow-neon'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  {tr === 'all' ? 'All Tiers' : `M${tr}`}
                </button>
              ))}
            </div>
          </div>

          {/* Acquisition Node Channel */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">Primary Acquisition Sector</span>
            <div className="flex flex-wrap gap-1">
              {(['all', 'campaign', 'shop', 'raids_events'] as const).map(src => (
                <button
                  key={src}
                  onClick={() => setPrimarySource(src)}
                  className={`px-2 py-1.5 text-[9px] font-mono rounded-lg border uppercase transition font-bold ${
                    primarySource === src
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 glow-neon'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  {src === 'all' ? 'All Sectors' : src === 'campaign' ? 'Campaigns' : src === 'shop' ? 'Shops' : 'Events & Raids'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Relic & Resonance Materials Group */}
      {(filterCategory === 'all' || filterCategory === 'relic' || filterCategory === 'currency') && (
        <div className="space-y-3">
          <h3 className="text-xs uppercase font-mono tracking-widest text-purple-400 flex items-center gap-2 border-b border-purple-950/40 pb-2">
            <Scan className="w-4 h-4 text-purple-400" /> Relic Materials & Core Assets
          </h3>
          {filteredRelics.length === 0 ? (
            <p className="text-zinc-500 font-mono text-xs italic pl-2">No matching relic materials found in this filter profile.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredRelics.map(item => {
                const owned = saveState.inventory[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="bg-black/40 border border-purple-500/20 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/40 transition relative overflow-hidden group shadow-inner"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/10 transition"></div>
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-display font-bold text-white text-sm tracking-wide">{item.name}</h4>
                          <span className="text-[8px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-widest mt-1 inline-block">
                            {item.type}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block">In Cargo</span>
                          <strong className={`text-lg font-mono ${owned > 0 ? 'text-purple-400 glow-purple' : 'text-zinc-600'}`}>
                            {owned.toLocaleString()}
                          </strong>
                        </div>
                      </div>
                      <p className="text-zinc-400 text-xs mt-2.5 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono">
                      <div>
                        <span className="text-zinc-500 uppercase tracking-wider block">Acquisition Nodes:</span>
                        <span className="text-zinc-300 font-semibold">{item.locations}</span>
                      </div>
                      <button
                        onClick={() => setSelectedMaterial({
                          id: item.id,
                          name: item.name,
                          desc: item.desc,
                          owned,
                          locations: item.locations,
                          type: item.type
                        })}
                        className="bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 font-bold px-2.5 py-1 rounded transition whitespace-nowrap uppercase text-[8px] tracking-widest flex items-center gap-1"
                      >
                        <span>Locate</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Gear Materials Group */}
      {(filterCategory === 'all' || filterCategory === 'gear') && (
        <div className="space-y-3 pt-4">
          <h3 className="text-xs uppercase font-mono tracking-widest text-cyan-400 flex items-center gap-2 border-b border-cyan-950/40 pb-2">
            <Compass className="w-4 h-4 text-cyan-400" /> Owned Enhancement Matrices (Gear Components)
          </h3>
          {ownedGear.length === 0 ? (
            <div className="border border-dashed border-zinc-800 p-8 rounded-2xl text-center text-xs text-zinc-500 italic font-mono bg-black/20">
              No gear components matching this filter setup are stockpiled in the cargo hold.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {ownedGear.map(gear => {
                const matchingNode = CAMPAIGN_NODES.find(n => n.rewards.some(r => r.itemId === gear.id));
                const farmDetails = matchingNode 
                  ? `${matchingNode.planet} (${matchingNode.difficulty})` 
                  : gear.find;

                return (
                  <div
                    key={gear.id}
                    className="bg-black/40 border border-cyan-500/10 rounded-2xl p-4 flex flex-col justify-between hover:border-cyan-500/30 transition relative overflow-hidden group shadow-inner"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-display font-bold text-zinc-100 text-xs leading-tight line-clamp-2">{gear.name}</h4>
                          <span className="text-[8px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-widest mt-1.5 inline-block">
                            Matrix M{gear.tier}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 block">Owned</span>
                          <strong className="text-sm font-mono text-cyan-400 glow-neon">
                            {gear.owned}
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center text-[9px] font-mono gap-2">
                      <div className="truncate">
                        <span className="text-zinc-500 uppercase tracking-wider block">Farming Node:</span>
                        <span className="text-zinc-300 truncate block font-medium" title={farmDetails}>{farmDetails}</span>
                      </div>
                      <button
                        onClick={() => setSelectedMaterial({
                          id: gear.id,
                          name: gear.name,
                          desc: `Grade Matrix level M${gear.tier} element used inside characters gear matrices.`,
                          owned: gear.owned,
                          locations: matchingNode ? `${matchingNode.planet} (${matchingNode.difficulty})` : 'Supplies Shop, Guild shipments',
                          type: 'gear'
                        })}
                        className="bg-zinc-900 hover:bg-cyan-950/20 hover:border-cyan-500/40 border border-zinc-800 text-cyan-400 font-bold px-2 py-1 rounded transition uppercase text-[8px] tracking-widest shrink-0 flex items-center gap-1"
                      >
                        <span>Find</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* HOLOGRAPHIC SOURCE LOCATOR RADAR MODAL */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="holo-panel border-cyan-500/40 bg-zinc-950/95 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl relative">
            {/* Hologram aesthetic lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none"></div>
            
            {/* Modal Header */}
            <div className="border-b border-zinc-800 p-4 flex justify-between items-center relative bg-black/40">
              <div className="flex items-center gap-2">
                <Orbit className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">ACQUISITION RADAR SCANNER</span>
              </div>
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="text-zinc-400 hover:text-white transition p-1.5 rounded-lg hover:bg-zinc-900/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-5">
              {/* Material Stats Card */}
              <div className="bg-black/40 border border-zinc-800 p-4 rounded-xl flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-white text-base tracking-wide">{selectedMaterial.name}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{selectedMaterial.desc}</p>
                  <span className={`text-[8px] border px-2 py-0.5 rounded font-mono uppercase font-black tracking-widest inline-block mt-2 ${
                    selectedMaterial.type === 'relic' 
                      ? 'border-purple-500/30 bg-purple-500/10 text-purple-400' 
                      : selectedMaterial.type === 'currency'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                        : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                  }`}>
                    {selectedMaterial.type} Component
                  </span>
                </div>
                <div className="text-right shrink-0 bg-zinc-900/40 border border-zinc-800/80 px-3.5 py-2.5 rounded-xl min-w-[80px]">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Cargo Qty</span>
                  <strong className={`text-xl font-mono ${selectedMaterial.owned > 0 ? 'text-cyan-400 glow-neon' : 'text-zinc-500'}`}>
                    {selectedMaterial.owned.toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Acquisition Options */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-bold">AVAILABLE NAVIGATION TARGETS</h4>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                  {getSourcesForMaterial(selectedMaterial).map((src, idx) => (
                    <div 
                      key={idx} 
                      className="bg-black/60 border border-zinc-900 rounded-xl p-3 flex justify-between items-center gap-4 hover:border-cyan-500/30 transition group"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold block group-hover:text-cyan-300 transition">
                          {src.source}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-sans leading-tight block">
                          {src.detail}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (onNavigateToFarm) {
                            onNavigateToFarm(src.tab, src.targetId);
                          }
                          setSelectedMaterial(null);
                        }}
                        className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-lg transition whitespace-nowrap"
                      >
                        {src.actionText}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-black/20 border-t border-zinc-900 px-5 py-3 text-[9px] font-mono text-zinc-500 flex justify-between items-center">
              <span>SCANNER ACCURACY: 100%</span>
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="text-cyan-400 hover:text-cyan-300 font-bold uppercase"
              >
                Close Radar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
