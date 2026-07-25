import React, { useState } from 'react';
import { SaveState, PlayerCharacterProgress } from '../types';
import { 
  Compass, Coins, Sparkles, Award, Shield, Flame, Bot, Swords, Database, Users, Cpu, Layers, Globe, ChevronRight, ShoppingCart, Check, Terminal, Info, BookOpen, Star, HelpCircle, Settings
} from 'lucide-react';

interface DashboardViewProps {
  saveState: SaveState;
  onNavigate: (view: string) => void;
  onUpdateState: (newState: SaveState) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  saveState,
  onNavigate,
  onUpdateState
}) => {
  const activeChampions = (Object.values(saveState.characters) as PlayerCharacterProgress[]).filter(c => c.unlocked);
  
  const totalPower = activeChampions.reduce((sum, c) => {
    return sum + (c.level * 150 + c.stars * 800 + c.gearTier * 1200 + c.relicLevel * 2500 + c.legendLevel * 4000);
  }, 0);

  return (
    <div className="space-y-10 relative text-left" id="immersive_cantina_dashboard">
      
      {/* Immersive Atmospheric Lighting & Warm Vignette */}
      <div className="absolute inset-x-0 -top-40 h-[600px] bg-gradient-to-b from-amber-500/[0.04] via-transparent to-transparent pointer-events-none rounded-full blur-[120px]"></div>

      {/* Sleek, Non-Bloated Game Title & Compact Resource Topbar UI */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-zinc-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-widest flex items-center gap-2">
            <span className="text-cyan-400">GALACTIC</span> LEGENDS
          </h1>
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">Command Dashboard • Sector Active</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs font-bold justify-end">
          <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-amber-500/20 px-3 py-1.5 rounded-xl">
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="text-amber-400">{saveState.credits.toLocaleString()} Credits</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-purple-500/20 px-3 py-1.5 rounded-xl">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300">{saveState.crystals.toLocaleString()} Crystals</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400">{saveState.energy} <span className="text-zinc-600">/ 1000 Energy</span></span>
          </div>
        </div>
      </div>

      {/* Core Immersive Visual Holotables Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        
        {/* VISUAL 1: The Galaxy Projection Holotable (Campaign & Conquest) */}
        <div className="group bg-zinc-950/90 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between min-h-[440px]">
          
          {/* Visual Canvas Element: Orbital hologram */}
          <div className="h-48 bg-zinc-900/40 border-b border-zinc-800/80 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.22)_0%,transparent_70%)]"></div>
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.06)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
            
            {/* Spinning Holographic Star Map */}
            <div className="w-36 h-36 rounded-full border-2 border-dashed border-amber-500/50 flex items-center justify-center relative animate-spin-slow shadow-[0_0_35px_rgba(245,158,11,0.15)]">
              <div className="absolute w-28 h-28 rounded-full border border-double border-amber-500/40 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-dotted border-amber-500/60 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-amber-400/60 animate-ping"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,1)]"></div>
                </div>
              </div>
              
              {/* Floating planetary vectors */}
              <span className="absolute top-1 left-9 w-2.5 h-2.5 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.9)] animate-pulse"></span>
              <span className="absolute bottom-5 right-11 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.7)]"></span>
              <span className="absolute top-12 right-5 w-3.5 h-3.5 border-2 border-amber-500/60 rounded-full animate-pulse"></span>
            </div>

            {/* Glowing Projection Cone */}
            <div className="absolute bottom-0 w-52 h-32 bg-gradient-to-t from-amber-500/[0.18] to-transparent clip-triangle pointer-events-none"></div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h3 className="font-display text-lg font-black text-white uppercase tracking-wider">
                Holographic Playing Table
              </h3>
              <p className="text-zinc-400 font-mono text-xs leading-relaxed">
                Fight through Campaign sectors, complete conquest maps, and earn tactical rewards.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button 
                onClick={() => onNavigate('campaign')}
                className="bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl py-3 px-3 text-[10px] font-black uppercase tracking-wider font-mono hover:bg-amber-500 hover:text-black hover:border-amber-400 transition-all flex items-center justify-between group/btn shadow-md"
              >
                <span>Campaigns</span>
                <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
              </button>

              <button 
                onClick={() => onNavigate('conquest')}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-2xl py-3 px-3 text-[10px] font-black uppercase tracking-wider font-mono hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-between group/btn shadow-md"
              >
                <span>Conquest</span>
                <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
              </button>

              <button 
                onClick={() => onNavigate('raid')}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-2xl py-3 px-3 text-[10px] font-black uppercase tracking-wider font-mono hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-between group/btn shadow-md"
              >
                <span>Raids</span>
                <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* VISUAL 2: Jedi / Sith chronicle Guide Console (Journeys & Events) */}
        <div className="group bg-zinc-950/90 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between min-h-[440px]">
          
          {/* Visual Canvas Element: Ancient Pedestal with glowing pyramid holocron */}
          <div className="h-48 bg-zinc-900/40 border-b border-zinc-800/80 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.22)_0%,transparent_75%)]"></div>
            
            {/* Tech Hexagon grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.05)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(245,158,11,0.05)_1.5px,transparent_1.5px)] bg-[size:24px_24px]"></div>
            
            {/* Visual Holocron Pyramid */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Glowing Ambient Halo */}
              <div className="absolute w-24 h-24 bg-amber-500/25 rounded-full blur-xl animate-pulse"></div>
              
              {/* Outer floating shards */}
              <div className="absolute inset-0 border-2 border-amber-500/50 rounded-3xl rotate-45 animate-spin-slow shadow-[0_0_25px_rgba(245,158,11,0.2)]"></div>
              
              {/* Floating Holocron SVG/CSS shape */}
              <div className="w-20 h-20 relative flex items-center justify-center">
                <div className="w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[58px] border-b-amber-400 relative animate-bounce-slow flex items-center justify-center drop-shadow-[0_0_20px_rgba(245,158,11,0.9)]">
                  <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[30px] border-b-amber-200 absolute bottom-[-52px]"></div>
                </div>
              </div>
            </div>

            {/* Pedestal Top Ring */}
            <div className="absolute bottom-0 w-56 h-3 bg-zinc-850 rounded-full border border-zinc-700 shadow-md"></div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h3 className="font-display text-lg font-black text-white uppercase tracking-wider">
                Legendary Journeys
              </h3>
              <p className="text-zinc-400 font-mono text-xs leading-relaxed">
                Unlock rare legendary units and complete limited-time special events.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => onNavigate('journey')}
                className="bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl py-3 px-4 text-[11px] font-black uppercase tracking-wider font-mono hover:bg-amber-500 hover:text-black hover:border-amber-400 transition-all flex items-center justify-between group/btn shadow-md"
              >
                <span>Journey Guide</span>
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => onNavigate('events')}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-2xl py-3 px-4 text-[11px] font-black uppercase tracking-wider font-mono hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-between group/btn shadow-md"
              >
                <span>Special Events</span>
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* VISUAL 3: Clashing duelists at the Arena table (PvP Arena) */}
        <div className="group bg-zinc-950/90 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between min-h-[440px]">
          
          {/* Visual Canvas Element: Battle ring with two clashing energy sabers (lightsabers!) */}
          <div className="h-48 bg-zinc-900/40 border-b border-zinc-800/80 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.22)_0%,transparent_75%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(6,182,212,0.22)_0%,transparent_60%)]"></div>
            
            {/* Clashing Laser Beams */}
            <div className="relative w-48 h-28 flex items-center justify-center">
              {/* Clash central sparks */}
              <div className="absolute w-14 h-14 rounded-full bg-white blur-md animate-ping opacity-75"></div>
              <div className="absolute w-8 h-8 rounded-full bg-amber-200 blur-sm"></div>

              {/* Red blade */}
              <div className="absolute w-40 h-2 bg-red-500 rounded-full rotate-[-25deg] origin-center -translate-x-9 -translate-y-2 shadow-[0_0_20px_#ef4444,0_0_35px_#ef4444] animate-pulse"></div>
              
              {/* Blue blade */}
              <div className="absolute w-40 h-2 bg-cyan-400 rounded-full rotate-[25deg] origin-center translate-x-9 -translate-y-2 shadow-[0_0_20px_#22d3ee,0_0_35px_#22d3ee] animate-pulse"></div>

              {/* Sparks particles */}
              <span className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full animate-ping -translate-x-4 -translate-y-4"></span>
              <span className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-yellow-300 rounded-full animate-ping translate-x-3 -translate-y-2"></span>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h3 className="font-display text-lg font-black text-white uppercase tracking-wider">
                PvP Arena
              </h3>
              <p className="text-zinc-400 font-mono text-xs leading-relaxed">
                Challenge player squad formations in rank matchmaking and climb the leaderboard.
              </p>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => onNavigate('siege')}
                className="w-full bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500 hover:text-black text-amber-400 rounded-2xl py-3.5 px-4 text-xs font-black uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-2 group/btn shadow-md box-glow-amber"
              >
                <Swords className="w-4 h-4 animate-bounce-slow" />
                <span>Challenge PvP Matchmaking</span>
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform ml-1" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Mainframe Database Archive Panel (Integrated Roster and Custom Squads summary) */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/[0.03] rounded-full blur-[100px] pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Mainframe Identity with much bigger visual panel */}
          <div className="space-y-5 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-zinc-800 pb-6 lg:pb-0 lg:pr-8 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center shadow-inner">
                  <Database className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
                <h3 className="font-display text-xl font-black text-white uppercase tracking-wider">
                  Roster & Squadrons Archive
                </h3>
              </div>
              <p className="text-zinc-400 font-mono text-xs leading-relaxed">
                View character roster profiles, manage your custom squad formations, and track active operations progress.
              </p>
            </div>

            {/* Glowing grand cyber-holographic central data core layout */}
            <div className="h-56 bg-black/60 border border-cyan-500/25 rounded-2xl relative flex flex-col items-center justify-center overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.1)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.18)_0%,transparent_75%)]"></div>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
              
              {/* Rotating Tactical Ring */}
              <div className="absolute w-40 h-40 rounded-full border border-dashed border-cyan-500/30 animate-spin-slow flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border border-dotted border-cyan-500/20 animate-spin-reverse flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-cyan-500/15 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center">
                      <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Neon cyan cyber laser scanner bar sliding vertically */}
              <div className="absolute left-0 right-0 h-0.5 bg-cyan-400/80 shadow-[0_0_15px_#22d3ee] animate-scanline"></div>

              {/* Tiny telemetry status nodes */}
              <div className="absolute top-4 left-4 flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[8px] font-mono text-emerald-400 tracking-wider">SECURE_LINK // ON</span>
              </div>

              <div className="absolute bottom-4 right-4 flex gap-1.5 items-center">
                <div className="w-1 h-3 bg-cyan-500/60 animate-bounce-fast"></div>
                <div className="w-1 h-4 bg-cyan-500/80 animate-bounce-slow"></div>
                <div className="w-1 h-2 bg-cyan-500 animate-bounce-normal"></div>
              </div>
            </div>
          </div>

          {/* Column 2 & 3: Quick stats + Operations Daily Quest display */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-black/40 border border-zinc-800/80 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-zinc-500 font-mono text-[10px] uppercase tracking-widest border-b border-zinc-800/60 pb-1.5">
                  <span>Roster Diagnostics</span>
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Characters Unlocked:</span>
                    <span className="text-white font-bold">{activeChampions.length} / {Object.keys(saveState.characters).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Tactical GP Rating:</span>
                    <span className="text-cyan-400 font-bold">{totalPower.toLocaleString()} GP</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => onNavigate('roster')}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-400 rounded-xl py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider font-mono transition flex items-center justify-between mt-4"
              >
                <span>Access Archive Database</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-black/40 border border-zinc-800/80 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-zinc-500 font-mono text-[10px] uppercase tracking-widest border-b border-zinc-800/60 pb-1.5">
                  <span>Prebuilt Formations</span>
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Custom Squadrons:</span>
                    <span className="text-white font-bold">
                      {Object.keys(saveState.prebuiltSquads || {}).length} Formed
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Campaign Nodes Beaten:</span>
                    <span className="text-white font-bold">
                      {Object.keys(saveState.campaignProgress || {}).length} Sectors
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onNavigate('roster')}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-400 rounded-xl py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider font-mono transition flex items-center justify-between mt-4"
              >
                <span>Manage Squadrons</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* NEW 3RD COLUMN: Operations & Directives (Quests Summary) */}
            <div className="bg-black/40 border border-zinc-800/80 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-zinc-500 font-mono text-[10px] uppercase tracking-widest border-b border-zinc-800/60 pb-1.5">
                  <span>Operations Summary</span>
                  <Award className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                </div>
                
                {/* Micro checklist representing the Quests */}
                <div className="space-y-3 font-mono text-[11px] text-zinc-300">
                  {[
                    { id: 'daily_complete_battles', name: 'Win Battles', target: 5 },
                    { id: 'daily_spend_energy', name: 'Spend Energy', target: 50 },
                    { id: 'daily_complete_events', name: 'Event Coordinator', target: 1 },
                    { id: 'daily_upgrade_character', name: 'Upgrade Character', target: 1 },
                  ].map(q => {
                    const progress = saveState.missionProgress?.[q.id] || 0;
                    const isComplete = progress >= q.target;
                    const isClaimed = saveState.claimedMissions?.includes(q.id);
                    const percent = Math.min(100, Math.floor((progress / q.target) * 100));

                    return (
                      <div key={q.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`${isComplete ? 'text-emerald-400 font-bold' : 'text-zinc-300'}`}>
                            {q.name}
                          </span>
                          <span className="font-bold text-zinc-400 text-[10px]">
                            {isClaimed ? (
                              <span className="text-emerald-500 font-black">CLAIMED</span>
                            ) : isComplete ? (
                              <span className="text-emerald-400 font-black">READY</span>
                            ) : (
                              `${progress}/${q.target}`
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-zinc-950/80 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                          <div 
                            className={`h-full transition-all duration-500 ${isComplete ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button 
                onClick={() => onNavigate('missions')}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-zinc-300 hover:text-amber-400 rounded-xl py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider font-mono transition flex items-center justify-between mt-4 shadow-glow"
              >
                <span>Access Operations Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Supplies Shop & Bar Counter Bar */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(245,158,11,0.06)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="space-y-3 lg:col-span-5 text-left">
            <h3 className="font-display font-black text-amber-500 text-base uppercase tracking-widest flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-amber-500" />
              Supplies Shop Counter
            </h3>
            <p className="text-zinc-400 font-mono text-xs leading-relaxed">
              Exchange credits and crystals in the Supplies Shop for character shards, training materials, and upgrade booster cards.
            </p>
          </div>

          {/* Majestic Supply Counter Visual Canvas Element (Bigger/Better visual requested) */}
          <div className="lg:col-span-4 bg-zinc-950/80 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden h-36">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.02)_1px,transparent_1px)] bg-[size:12px_12px]"></div>

            {/* Glowing crates on the counter matrix */}
            <div className="flex gap-4 relative z-10">
              {/* Amber Cargo Box */}
              <div className="w-12 h-12 bg-black border-2 border-amber-500/50 rounded-xl relative flex items-center justify-center shadow-lg transform -rotate-6 hover:rotate-0 transition-all duration-300 cursor-pointer">
                <div className="w-7 h-7 border border-amber-500/30 rounded-lg"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                <div className="text-[7px] font-mono text-amber-400/80 absolute bottom-1 font-bold">CR_01</div>
              </div>
              
              {/* Purple Core Fuel cell */}
              <div className="w-12 h-12 bg-black border-2 border-purple-500/50 rounded-xl relative flex items-center justify-center shadow-lg transform translate-y-1 rotate-6 hover:rotate-0 transition-all duration-300 cursor-pointer">
                <div className="w-7 h-7 border border-purple-500/30 rounded-lg"></div>
                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"></div>
                <div className="text-[7px] font-mono text-purple-400/80 absolute bottom-1 font-bold">X_RE</div>
              </div>

              {/* Cyan Power canister */}
              <div className="w-12 h-12 bg-black border-2 border-cyan-500/50 rounded-xl relative flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="w-7 h-7 border border-cyan-500/30 rounded-lg"></div>
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                <div className="text-[7px] font-mono text-cyan-400/80 absolute bottom-1 font-bold">PT_X</div>
              </div>
            </div>

            {/* Thermal exhaust/smoke rises effect */}
            <div className="absolute bottom-1 text-[8px] font-mono text-zinc-600 tracking-wider uppercase">
              // Counter Active // Storage Safe
            </div>
          </div>

          {/* Action buttons (Now including Holonet Comms and Account Settings) */}
          <div className="lg:col-span-3 flex flex-col gap-2.5 justify-center">
            <button 
              onClick={() => onNavigate('shop')}
              className="w-full bg-amber-500/15 border border-amber-500/40 text-amber-400 py-2.5 rounded-xl uppercase font-black tracking-widest text-[10px] font-mono hover:bg-amber-500 hover:text-black hover:border-amber-400 transition shadow-glow flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Supplies Shop
            </button>

            <button 
              onClick={() => onNavigate('holonet')}
              className="w-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 py-2.5 rounded-xl uppercase font-black tracking-widest text-[10px] font-mono hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition shadow-glow flex items-center justify-center gap-2"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Holonet Terminal
            </button>

            <button 
              onClick={() => onNavigate('settings')}
              className="w-full bg-purple-500/10 border border-purple-500/30 text-purple-400 py-2.5 rounded-xl uppercase font-black tracking-widest text-[10px] font-mono hover:bg-purple-500 hover:text-black hover:border-purple-400 transition shadow-glow flex items-center justify-center gap-2"
            >
              <Settings className="w-3.5 h-3.5" />
              Account Settings
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Legal Disclaimer */}
      <div className="pt-8 pb-4 border-t border-zinc-900 text-center">
        <p className="text-zinc-600 text-[10px] font-mono max-w-2xl mx-auto tracking-wide leading-relaxed">
          [SECURE DATA OVERRIDE // CONNECTION CLOSED] // Galactic Legends is a fan-created project. Star Wars, its characters, costumes, and all associated items are the intellectual property of Lucasfilm Ltd. and The Walt Disney Company. This game is provided for non-commercial purposes only, with no affiliation to Lucasfilm Ltd., Disney, or Electronic Arts.
        </p>
      </div>

    </div>
  );
};
