import React, { useState } from 'react';
import { BATTLE_BACKGROUNDS, BattleBackground } from '../data/battleBackgrounds';
import { EnvironmentParticles } from './EnvironmentParticles';
import { BattleScenery } from './BattleScenery';
import { Search, Globe, Tag, Sparkles, Eye, X, Compass, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BackgroundViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanet, setSelectedPlanet] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePreview, setActivePreview] = useState<BattleBackground | null>(null);

  // Extract unique planets and categories for filters
  const planets = ['All', ...Array.from(new Set(BATTLE_BACKGROUNDS.map(b => b.planet)))];
  const categories = ['All', ...Array.from(new Set(BATTLE_BACKGROUNDS.map(b => b.category)))];

  // Filtered backgrounds list
  const filteredBackgrounds = BATTLE_BACKGROUNDS.filter(bg => {
    const matchesSearch = bg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          bg.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlanet = selectedPlanet === 'All' || bg.planet === selectedPlanet;
    const matchesCategory = selectedCategory === 'All' || bg.category === selectedCategory;
    return matchesSearch && matchesPlanet && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 bg-zinc-950 text-white rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden">
      
      {/* Visual Header Grid Accent */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-amber-500 opacity-80"></div>
      
      {/* Decorative top grid */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 text-[9px] font-mono font-black uppercase tracking-widest">
              TEMP DIAGNOSTIC SUITE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-mono font-black">
              {BATTLE_BACKGROUNDS.length} Systems Compiled
            </span>
          </div>
          <h2 className="font-display font-black text-2xl tracking-wider text-cyan-400 flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-400 animate-spin-slow" />
            <span>STELLAR BACKGROUND<span className="text-white ml-2">ARCHIVE</span></span>
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Evaluate radial shaders, composite linear overlays, and dynamic particle simulations.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search systems (e.g. Hoth)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500/50 font-mono transition"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter HUD Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/40 relative z-10">
        {/* Planet filter */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-cyan-400" />
            Filter by Celestial Planet
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-thin pr-2">
            {planets.map(planet => (
              <button
                key={planet}
                onClick={() => setSelectedPlanet(planet)}
                className={`px-3 py-1 text-[10px] font-mono font-bold rounded-lg transition border ${
                  selectedPlanet === planet
                    ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                {planet}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-fuchsia-400" />
            Filter by Environment Category
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-thin pr-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-[10px] font-mono font-bold rounded-lg transition border ${
                  selectedCategory === category
                    ? 'bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.15)]'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid view of backgrounds */}
      {filteredBackgrounds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
          <Globe className="w-12 h-12 mb-3 text-zinc-600 animate-pulse" />
          <p className="font-mono text-sm font-bold">No sectors matched search parameters</p>
          <p className="text-xs text-zinc-600 mt-1">Try resetting your filters or altering search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {filteredBackgrounds.map((bg) => {
            // Setup appropriate final particle string
            const finalParticleEnv = `environment-${bg.planet.toLowerCase()}-${bg.particles}`;
            
            return (
              <motion.div 
                key={bg.id}
                layoutId={`bg_card_${bg.id}`}
                className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg hover:shadow-cyan-950/10"
              >
                {/* Visual Viewport of Background */}
                <div 
                  className="w-full h-40 relative overflow-hidden cursor-pointer"
                  onClick={() => setActivePreview(bg)}
                  style={bg.style}
                >
                  {/* Particle simulation inside card */}
                  <EnvironmentParticles environment={finalParticleEnv} />
                  
                  {/* High-fidelity custom vector scenery */}
                  <BattleScenery planet={bg.planet} name={bg.name} />
                  
                  {/* Overlay scanlines */}
                  <div className="absolute inset-0 hologram-overlay opacity-30 pointer-events-none"></div>

                  {/* Play preview icon overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-xl bg-cyan-500/80 hover:bg-cyan-400 text-black font-mono font-black text-xs flex items-center gap-1.5 shadow-lg transform scale-95 group-hover:scale-100 transition duration-300">
                      <Eye className="w-3.5 h-3.5" />
                      FULL PREVIEW
                    </span>
                  </div>

                  {/* Planet Badge */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-zinc-800 text-[9px] font-mono font-bold tracking-wider text-zinc-300">
                    {bg.planet}
                  </div>

                  {/* Particles indicator badge */}
                  {bg.particles !== 'none' && (
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-cyan-500/10 backdrop-blur-md border border-cyan-500/20 text-[9px] font-mono text-cyan-400 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      {bg.particles.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info and Details */}
                <div className="p-4 flex flex-col flex-grow border-t border-zinc-800/60 font-mono text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-zinc-400 text-[10px] uppercase font-black tracking-widest truncate">{bg.category}</span>
                    <span className="text-zinc-600 text-[9px] font-mono">{bg.id.slice(4)}</span>
                  </div>
                  
                  <h3 className="font-display font-black text-sm text-white mb-2 group-hover:text-cyan-400 transition truncate">
                    {bg.name}
                  </h3>

                  {/* CSS gradient description panel */}
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800/50 mt-auto">
                    <div className="text-[9px] text-zinc-500 flex items-center justify-between mb-1">
                      <span>STRETCH CONFIGURATION</span>
                      <span className="text-emerald-400 font-bold">READY</span>
                    </div>
                    <p className="text-[9px] text-zinc-400 leading-normal truncate" title={bg.style.background}>
                      {bg.style.background}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Immersive Fullscreen Preview Drawer */}
      <AnimatePresence>
        {activePreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col bg-black"
          >
            {/* The actual background filling the complete viewport */}
            <div 
              className="absolute inset-0 pointer-events-none transition-all duration-1000"
              style={activePreview.style}
            ></div>

            {/* High-fidelity custom vector scenery */}
            <BattleScenery planet={activePreview.planet} name={activePreview.name} />

            {/* Immersive simulation overlay & particles */}
            <EnvironmentParticles environment={`environment-${activePreview.planet.toLowerCase()}-${activePreview.particles}`} />
            <div className="absolute inset-0 hologram-overlay opacity-20 pointer-events-none"></div>

            {/* Futuristic HUD overlay to give it true galactic scale context */}
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-auto">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[9px] font-mono font-black uppercase tracking-widest">
                    SYSTEM: {activePreview.planet.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 text-[9px] font-mono font-black uppercase tracking-widest">
                    ZONE: {activePreview.category.toUpperCase()}
                  </span>
                </div>
                
                <h1 className="font-display font-black text-4xl tracking-wider text-white mb-2">
                  {activePreview.name}
                </h1>
                
                <p className="text-zinc-400 font-mono text-xs max-w-2xl">
                  Diagnostic Identifier: <span className="text-amber-400 font-bold">{activePreview.id}</span>. This layout is engineered to fit multi-wave battle grids, conquest nodes, and holographic journeys seamlessly.
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    // Go to previous background
                    const curIdx = BATTLE_BACKGROUNDS.findIndex(b => b.id === activePreview.id);
                    const prevIdx = (curIdx - 1 + BATTLE_BACKGROUNDS.length) % BATTLE_BACKGROUNDS.length;
                    setActivePreview(BATTLE_BACKGROUNDS[prevIdx]);
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-white font-mono transition flex items-center gap-1"
                >
                  PREVIOUS SECTOR
                </button>
                <button
                  onClick={() => {
                    // Go to next background
                    const curIdx = BATTLE_BACKGROUNDS.findIndex(b => b.id === activePreview.id);
                    const nextIdx = (curIdx + 1) % BATTLE_BACKGROUNDS.length;
                    setActivePreview(BATTLE_BACKGROUNDS[nextIdx]);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 border border-cyan-400/20 text-xs text-black font-mono font-black transition flex items-center gap-1"
                >
                  NEXT SECTOR
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setActivePreview(null)}
                  className="p-3 rounded-full bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-400 hover:text-white transition"
                  title="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Minimalistic grid target design overlays */}
            <div className="absolute top-10 left-10 text-cyan-400/40 font-mono text-[9px] pointer-events-none flex flex-col gap-1">
              <span>HOLO_COORD: X-4929 / Y-2940</span>
              <span>LUMINOSITY_INDEX: 0.88</span>
              <span>PARTICLE_DENSITY: ACTIVE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
