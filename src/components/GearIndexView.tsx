import React, { useState } from 'react';
import { Package, Search, Map } from 'lucide-react';

export const GearIndexView: React.FC = () => {
  const [search, setSearch] = useState('');

  const GEAR_DATA = [
    { name: 'Carbonite Matrix', where: 'Campaign (Kamino/Ryloth Hard), Assault: Military Might, Daily Store' },
    { name: 'Hyper Alloy', where: 'Campaign (Hard Nodes), Assault Battles Tier II, Daily Store (Credits)' },
    { name: 'Beskar Alloy', where: 'Campaign (Hard Nodes Tier 3-4), Assault Battles Tier II, Weekly Shop' },
    { name: 'Kyber Crystals', where: 'Assault: Forest Moon, Raid Phase 3-4, High End Campaign' },
    { name: 'Dark Matter Core', where: 'Raid (Highest Tiers), Weekly Shop' },
    { name: 'Legendary Spark', where: 'Legendary Events, Highest Shop Tiers' },
    { name: 'Ancient Jedi Texts', where: 'Legendary Journey Nodes (Light Side)' },
    { name: 'Sith Obsidian', where: 'Legendary Journey Nodes (Dark Side)' },
    { name: 'Clone Combat Data', where: 'Era Events: Kamino Siege, Ryloth' },
    { name: 'Imperial Command Circuits', where: 'Empire specific nodes (Coruscant)' },
    { name: 'Mk 3 Carbanti Sensor Array', where: 'Daily Shop (Credits), Campaign (Medium Nodes)' },
    { name: 'Mk 5 Arakyd Droid Caller', where: 'Daily Shop (Credits), Assault Battles' },
    { name: 'Mk 8 BioTech Implant', where: 'Daily Shop (Credits), Raid Rewards' },
    { name: 'Mk 11 BlasTech Weapon Mod', where: 'Daily Shop (Credits), Era Events' },
    { name: 'Mk 6 Stun Gun', where: 'Daily Shop (Credits), Campaign (Hard Nodes)' },
    { name: 'Mk 7 Shield Generator', where: 'Daily Shop (Credits), Campaign (Hard Nodes)' },
  ];

  const filtered = GEAR_DATA.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) || g.where.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fadeIn" id="gear_index_view">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <Package className="w-5 h-5 text-amber-500" /> Relic & Gear Locator Archive
        </h2>
        <p className="text-zinc-400 text-xs max-w-xl">
          Consult the logistics mainframe to locate where to farm crucial salvage pieces and high tier upgrade materials.
        </p>

        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search gear name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black text-white px-9 py-2 rounded-xl border border-zinc-800 text-sm font-mono placeholder-zinc-600 focus:outline-none focus:border-amber-500 w-full max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {filtered.map((g, i) => (
            <div key={i} className="bg-black/40 border border-zinc-850 p-4 rounded-xl flex flex-col gap-2">
              <span className="font-bold text-amber-400 font-mono text-sm uppercase">{g.name}</span>
              <span className="text-xs text-zinc-400 flex items-start gap-1.5 leading-relaxed">
                <Map className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" /> {g.where}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-8 text-center text-zinc-500 text-xs font-mono border border-dashed border-zinc-800 rounded-xl">
              No matching parts found in archive.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
