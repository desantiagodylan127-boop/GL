import React, { useState } from 'react';
import { SaveState, JourneyConfig, JourneyPrereqItem } from '../types';
import { JOURNEY_CONFIGS, getJourneyPrereqs, getJourneyDisplayTier } from '../data/journeys';
import { getAllCharacters } from '../data/characters';
import { Award, Check, Lock, Play, AlertTriangle, ShieldCheck, Zap, Columns, ListFilter, Star, ChevronDown, ChevronRight } from 'lucide-react';
import { InfoDialog } from './InfoDialog';

interface JourneyViewProps {
  saveState: SaveState;
  onUpdateState: (st: SaveState) => void;
  onLaunchJourneyBattle: (config: JourneyConfig, phaseIndex: number, playerIds: string[]) => void;
  journeyContext: { id: string | null; tab: 'prereqs' | 'phases'; category: 'standard' | 'gl' };
  setJourneyContext: React.Dispatch<React.SetStateAction<{ id: string | null; tab: 'prereqs' | 'phases'; category: 'standard' | 'gl' }>>;
}

export function getTierDetails(tier: number): { title: string; desc: string; colorClass: string; borderClass: string; bgClass: string; badgeColor: string; hoverColor: string } {
  switch (tier) {
    case 1:
      return {
        title: "Tier 1: Recruit",
        desc: "Entry-level legacy unlocks",
        colorClass: "text-zinc-300",
        borderClass: "border-zinc-800/80 hover:border-zinc-600",
        bgClass: "bg-zinc-950/40",
        badgeColor: "bg-zinc-900/60 text-zinc-300 border-zinc-700/30",
        hoverColor: "hover:bg-zinc-900/30"
      };
    case 2:
      return {
        title: "Tier 2: Captain",
        desc: "Mid-tier fleet commanders",
        colorClass: "text-blue-400",
        borderClass: "border-blue-900/40 hover:border-blue-700/60",
        bgClass: "bg-blue-950/10",
        badgeColor: "bg-blue-950/60 text-blue-400 border-blue-500/20",
        hoverColor: "hover:bg-blue-950/30"
      };
    case 3:
      return {
        title: "Tier 3: Veteran",
        desc: "Specialized Era commanders",
        colorClass: "text-cyan-400",
        borderClass: "border-cyan-900/40 hover:border-cyan-700/60",
        bgClass: "bg-cyan-950/10",
        badgeColor: "bg-cyan-950/60 text-cyan-400 border-cyan-500/20",
        hoverColor: "hover:bg-cyan-950/30"
      };
    case 4:
      return {
        title: "Tier 4: Legendary Commander",
        desc: "High-synergy squad leaders",
        colorClass: "text-indigo-400",
        borderClass: "border-indigo-900/40 hover:border-indigo-700/60",
        bgClass: "bg-indigo-950/10",
        badgeColor: "bg-indigo-950/60 text-indigo-400 border-indigo-500/20",
        hoverColor: "hover:bg-indigo-950/30"
      };
    case 5:
      return {
        title: "Tier 5: Sector Overlord",
        desc: "Elite tactical command challenges",
        colorClass: "text-purple-400",
        borderClass: "border-purple-900/40 hover:border-purple-700/60",
        bgClass: "bg-purple-950/10",
        badgeColor: "bg-purple-950/60 text-purple-400 border-purple-500/20",
        hoverColor: "hover:bg-purple-950/30"
      };
    case 6:
      return {
        title: "Tier 6: Pinnacle Mythic",
        desc: "Severe campaigns and relic 9 tests",
        colorClass: "text-rose-400",
        borderClass: "border-rose-950/40 hover:border-rose-700/60",
        bgClass: "bg-rose-950/10",
        badgeColor: "bg-rose-950/60 text-rose-400 border-rose-500/20",
        hoverColor: "hover:bg-rose-950/30"
      };
    default:
      return {
        title: `Tier ${tier}`,
        desc: "Standard Event Journey",
        colorClass: "text-indigo-400",
        borderClass: "border-indigo-900/40 hover:border-indigo-700/60",
        bgClass: "bg-indigo-950/10",
        badgeColor: "bg-indigo-950/60 text-indigo-400 border-indigo-500/20",
        hoverColor: "hover:bg-indigo-950/30"
      };
  }
}

export const JourneyView: React.FC<JourneyViewProps> = ({
  saveState,
  onLaunchJourneyBattle,
  onUpdateState,
  journeyContext,
  setJourneyContext
}) => {
  const selectedJourneyId = journeyContext.id;
  const activeTab = journeyContext.tab;
  const journeyCategory = journeyContext.category;

  const [confirmReset, setConfirmReset] = useState(false);
  const [expandedTiers, setExpandedTiers] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: true,
    5: false,
    6: false
  });

  React.useEffect(() => {
    if (selectedJourneyId) {
      const tierOfSelected = getJourneyDisplayTier(selectedJourneyId);
      setExpandedTiers(prev => {
        if (!prev[tierOfSelected]) {
          return { ...prev, [tierOfSelected]: true };
        }
        return prev;
      });
    }
  }, [selectedJourneyId]);
  
  const setSelectedJourneyId = (id: string | null) => {
    setConfirmReset(false);
    setJourneyContext(prev => ({ ...prev, id }));
  };
  const setActiveTab = (tab: 'prereqs' | 'phases') => setJourneyContext(prev => ({ ...prev, tab }));
  const setJourneyCategory = (category: 'standard' | 'gl') => setJourneyContext(prev => ({ ...prev, category }));
  const allCharacters = getAllCharacters();

  // Fallback to ensuring newly added built-in journeys appear even if customJourneys was saved earlier
  const baseOrCustomJourneys = saveState.customJourneys || JOURNEY_CONFIGS;
  const missingBuiltIns = JOURNEY_CONFIGS.filter(builtin => !baseOrCustomJourneys.some(j => j.id === builtin.id));
  const journeys = [...baseOrCustomJourneys, ...missingBuiltIns];

  const filteredJourneys = journeys.filter(j => 
    journeyCategory === 'standard' ? !j.isGalacticLegend : j.isGalacticLegend
  );

  const selectedJourney = journeys.find(j => j.id === selectedJourneyId);

  // Helper verifying character requirements for specific items
  function checkUnitMeeting(charId: string, levelReq: number, gearReq: number, relicReq: number): { meet: boolean; msg: string; prog?: any } {
    const prog = saveState.characters[charId];
    if (!prog || !prog.unlocked) {
      return { meet: false, msg: 'NOT OWNED (LOCKED)' };
    }
    if (prog.level < levelReq) {
      return { meet: false, msg: `Level ${prog.level} < Required Level ${levelReq}`, prog };
    }
    if (prog.gearTier < gearReq) {
      return { meet: false, msg: `Gear G${prog.gearTier} < Required G${gearReq}`, prog };
    }
    if (prog.relicLevel < relicReq) {
      return { meet: false, msg: `Relic R${prog.relicLevel} < Required R${relicReq}`, prog };
    }
    return { meet: true, msg: 'READY', prog };
  }

  // Global Journey entry check using dynamic system
  function checkJourneyLocked(journeyId: string): { locked: boolean; reason: string; items: JourneyPrereqItem[]; completedCount: number } {
    const prList = getJourneyPrereqs(journeyId);
    let completedCount = 0;
    
    const notMet = prList.filter(item => {
      const p = saveState.characters[item.id];
      if (!p || !p.unlocked) return true;
      if (item.requiredGear && p.gearTier < item.requiredGear) return true;
      if (item.requiredRelic && p.relicLevel < item.requiredRelic) return true;
      completedCount++;
      return false;
    });

    if (notMet.length > 0) {
      return {
        locked: true,
        reason: `Requires all ${prList.length} prerequisites configured. You have met ${completedCount}/${prList.length} training guidelines.`,
        items: prList,
        completedCount
      };
    }
    return { locked: false, reason: "", items: prList, completedCount: prList.length };
  }

  const [showIntro, setShowIntro] = useState(!saveState.stats?.['seen_journey_intro']);

  return (
    <div className="flex flex-col space-y-6 animate-fadeIn pb-20" id="journey_guide_wrapper">
      {showIntro && (
        <InfoDialog 
          title="Journey Guide" 
          content={
            <>
               <p>The Journey Guide contains pinnacle characters required for endgame progression.</p>
               <p>To unlock these units, you must complete sequential combat tiers. Each tier is locked behind heavy prerequisite requirements (specific characters, gear tiers, and relics).</p>
               <p>Plan your progression carefully.</p>
            </>
          }
          onClose={() => {
             setShowIntro(false);
             const copy = { ...saveState };
             if (!copy.stats) copy.stats = {};
             copy.stats['seen_journey_intro'] = 1;
             onUpdateState(copy);
          }}
        />
      )}
      {/* Global Entry Category Selection */}
      <div className="flex bg-black/60 p-1.5 border border-indigo-500/20 rounded-xl shadow-inner relative z-10 w-[300px] mx-auto">
        <button
          onClick={() => {
            setJourneyCategory('standard');
            const std = journeys.find(j => !j.id.startsWith('gl_'));
            if(std) setSelectedJourneyId(std.id);
          }}
          className={`flex-1 py-2 text-[10px] font-mono font-black uppercase tracking-widest rounded-lg transition-all md:min-w-fit md:truncate ${journeyCategory === 'standard' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-glow' : 'text-zinc-500 hover:text-indigo-300 hover:bg-indigo-950/30'}`}
        >
          Journeys
        </button>
        <button
          onClick={() => {
            setJourneyCategory('gl');
            setSelectedJourneyId(null);
          }}
          className={`flex-1 py-2 text-[10px] font-mono font-black uppercase tracking-widest rounded-lg transition-all md:min-w-fit md:truncate ${journeyCategory === 'gl' ? 'bg-amber-950/40 text-amber-400 border border-amber-500/40 glow-neon shadow-glow box-glow' : 'text-zinc-500 hover:text-amber-400 hover:bg-amber-950/30'}`}
        >
          Galactic Legends
        </button>
      </div>

      {journeyCategory === 'gl' && !selectedJourneyId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pt-4 max-w-7xl mx-auto w-full">
          {filteredJourneys.map(config => {
            const lockState = checkJourneyLocked(config.id);
            const rewardChar = allCharacters.find(ch => ch.id === config.rewardCharacterId);

            let bgClass = "environment-mandalore-city";
            if (config.id === 'gl_kenobi') bgClass = "environment-mustafar-lava";
            if (config.id === 'gl_grievous') bgClass = "environment-geonosis-arena"; // No Utapau, using Geonosis
            if (config.id === 'gl_lord_vader' || config.id === 'gl_tarkin_journey' || config.id === 'j_palpatine') bgClass = "environment-coruscant-senate";
            if (config.id === 'j_ki_adi_mundi') bgClass = "environment-coruscant-senate";
            if (config.id === 'gl_leia') bgClass = "environment-endor-forest";
            if (config.id === 'gl_jabba') bgClass = "environment-tatooine-dunes";
            if (config.id === 'gl_master_windu') bgClass = "environment-ryloth-outpost";

            return (
              <div 
                key={config.id}
                onClick={() => {
                  setSelectedJourneyId(config.id);
                  setActiveTab('prereqs');
                }}
                className={`cursor-pointer group relative h-96 rounded-3xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-[1.02] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] ${lockState.locked ? 'border-amber-900/50' : 'border-amber-400 box-glow'}`}
              >
                {/* 2D Pixel Art Env Background */}
                <div className={`absolute inset-0 ${bgClass} opacity-40 group-hover:opacity-70 transition-opacity duration-500 scale-105 group-hover:scale-100 z-0`}></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center -mt-16 pointer-events-none opacity-50 z-0">
                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-[150px] h-[150px] text-black drop-shadow-[0_0_15px_rgba(0,0,0,1)]">
                     <circle cx="12" cy="7" r="4" />
                     <path d="M5.5 21a8.38 8.38 0 0 1 13 0H5.5z" />
                   </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/10 z-0 pointer-events-none"></div>
                
                {/* Overlay Scanlines */}
                <div className="absolute inset-0 scan-overlay mix-blend-overlay opacity-20 pointer-events-none"></div>

                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center space-y-4">
                  <span className="text-[10px] font-mono font-black tracking-[0.3em] uppercase text-amber-500 bg-amber-950/80 px-3 py-1 rounded shadow-inner border border-amber-500/20">
                    Galactic Legend
                  </span>
                  
                  <h3 className="font-display text-2xl font-black text-white tracking-widest leading-none drop-shadow-md">
                    {config.name}
                  </h3>
                  
                  <p className="text-[11px] text-zinc-300 font-sans tracking-wide max-w-sm line-clamp-2 px-4 leading-relaxed opacity-90">
                    {config.desc}
                  </p>
                  
                  {lockState.locked ? (
                    <div className="flex flex-col items-center gap-1.5 pt-2">
                       <span className="text-rose-400 font-mono text-[10px] font-bold tracking-widest uppercase flex items-center gap-1">
                         <Lock className="w-3 h-3" /> Requirements Not Met
                       </span>
                       <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">{lockState.completedCount} / {lockState.items.length} Researched</span>
                    </div>
                  ) : (
                    <div className="text-emerald-400 font-mono text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 pt-2 glow-neon">
                       <ShieldCheck className="w-4 h-4" /> Journey Available
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh] md:h-[75vh]">
          {/* Selection timeline column */}
          <div className="lg:col-span-1 flex flex-col gap-4 h-full">
            {journeyCategory === 'gl' && (
              <div className="holo-panel p-4 rounded-xl flex items-center justify-start shrink-0">
                <button 
                   onClick={() => setSelectedJourneyId(null)}
                   className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest font-black transition-colors text-amber-400 hover:text-amber-300`}
                >
                   ← Back to Legends Hub
                </button>
              </div>
            )}
            
            <div className="holo-panel p-5 rounded-3xl space-y-3 flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-transparent">
              {journeyCategory === 'gl' ? (
                <div className="space-y-3">
                  {filteredJourneys.map(config => {
                    const isSelected = selectedJourneyId === config.id;
                    const rewardChar = allCharacters.find(ch => ch.id === config.rewardCharacterId);
                    const lockState = checkJourneyLocked(config.id);

                    return (
                      <div 
                        key={config.id}
                        onClick={() => {
                          setSelectedJourneyId(config.id);
                          setActiveTab('prereqs');
                        }}
                        className={`cursor-pointer transition-all duration-300 border p-5 rounded-2xl flex flex-col justify-between min-h-[160px] h-auto py-4 shrink-0 relative overflow-hidden group ${
                          isSelected 
                            ? 'bg-indigo-950/30 border-indigo-400 shadow-glow' 
                            : 'bg-amber-950/10 border-amber-500/20 hover:border-amber-400 shadow-inner'
                        }`}
                        id={`journey_selector_${config.id}`}
                      >
                        {isSelected && <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent pointer-events-none"></div>}

                        <div className="relative z-10">
                          <div className="flex items-center justify-between text-[10px] font-mono select-none">
                            <span className="font-black tracking-widest uppercase text-amber-500 glow-neon">
                              GALACTIC LEGEND
                            </span>
                            {lockState.locked ? (
                              <span className="text-rose-400 font-bold flex items-center gap-1 font-mono text-[9px] tracking-wider">
                                <Lock className="w-3 h-3" /> {lockState.completedCount}/{lockState.items.length} REQS
                              </span>
                            ) : (
                              <span className="text-emerald-400 flex items-center gap-1.5 font-bold tracking-wider">
                                <Check className="w-3.5 h-3.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> READY
                              </span>
                            )}
                          </div>
                          <h4 className={`font-display font-black tracking-wide mt-2 text-sm leading-tight ${isSelected ? 'text-white' : 'text-indigo-100/90'}`}>{config.name}</h4>
                          <p className="text-[10px] text-zinc-400 line-clamp-2 font-sans tracking-wide leading-relaxed select-none mt-1">
                            {config.desc}
                          </p>
                          <p className="text-[10px] text-indigo-400/60 font-mono mt-1.5 truncate uppercase font-bold tracking-widest">Payload: {rewardChar?.name || 'Unknown'}</p>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-mono text-indigo-500/60 pt-3 border-t border-indigo-500/10 relative z-10 font-bold uppercase tracking-widest">
                          <span>Req Pwr: {config.recommendedPower.toLocaleString()}+</span>
                          <span className={lockState.locked ? "text-amber-500/80" : "text-emerald-400 glow-neon"}>
                            {Math.round((lockState.completedCount / lockState.items.length) * 100)}% Sync
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const grouped: Record<number, JourneyConfig[]> = {};
                    filteredJourneys.forEach(j => {
                      const t = getJourneyDisplayTier(j.id);
                      if (!grouped[t]) grouped[t] = [];
                      grouped[t].push(j);
                    });

                    const availableTiers = Object.keys(grouped).map(Number).sort((a, b) => a - b);

                    return availableTiers.map(tierNum => {
                      const tierJourneys = grouped[tierNum];
                      if (!tierJourneys || tierJourneys.length === 0) return null;

                      const isExpanded = !!expandedTiers[tierNum];
                      const details = getTierDetails(tierNum);

                      return (
                        <div key={tierNum} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${details.borderClass} ${details.bgClass}`}>
                          <div 
                            onClick={() => {
                              setExpandedTiers(prev => ({
                                ...prev,
                                [tierNum]: !prev[tierNum]
                              }));
                            }}
                            className={`flex items-center justify-between p-4 cursor-pointer select-none transition ${details.hoverColor}`}
                          >
                            <div className="flex flex-col">
                              <span className={`text-[11px] font-mono font-black uppercase tracking-wider ${details.colorClass}`}>
                                {details.title}
                              </span>
                              <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">
                                {details.desc}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] bg-black/40 border border-zinc-800 text-zinc-400 font-mono font-bold px-2.5 py-0.5 rounded-full">
                                {tierJourneys.length}
                              </span>
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-zinc-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-zinc-400" />
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-3 space-y-3 bg-black/30 border-t border-indigo-500/5">
                              {tierJourneys.map(config => {
                                const isSelected = selectedJourneyId === config.id;
                                const rewardChar = allCharacters.find(ch => ch.id === config.rewardCharacterId);
                                const lockState = checkJourneyLocked(config.id);

                                return (
                                  <div 
                                    key={config.id}
                                    onClick={() => {
                                      setSelectedJourneyId(config.id);
                                      setActiveTab('prereqs');
                                    }}
                                    className={`cursor-pointer transition-all duration-300 border p-4 rounded-xl flex flex-col justify-between min-h-[148px] h-auto py-3.5 shrink-0 relative overflow-hidden group ${
                                      isSelected 
                                        ? 'bg-indigo-950/40 border-indigo-400 shadow-glow' 
                                        : 'bg-black/30 border-indigo-500/10 hover:border-indigo-500/30 hover:bg-indigo-950/10 shadow-inner'
                                    }`}
                                    id={`journey_selector_${config.id}`}
                                  >
                                    {isSelected && <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none"></div>}

                                    <div className="relative z-10 space-y-1">
                                      <div className="flex items-center justify-between text-[9px] font-mono select-none">
                                        <span className={`font-black tracking-widest uppercase ${details.colorClass}`}>
                                          TIER {tierNum}
                                        </span>
                                        {lockState.locked ? (
                                          <span className="text-rose-400 font-bold flex items-center gap-1 font-mono tracking-wider">
                                            <Lock className="w-2.5 h-2.5" /> {lockState.completedCount}/{lockState.items.length} REQS
                                          </span>
                                        ) : (
                                          <span className="text-emerald-400 flex items-center gap-1 font-bold tracking-wider">
                                            <Check className="w-3 h-3 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" /> READY
                                          </span>
                                        )}
                                      </div>
                                      <h4 className={`font-display font-black tracking-wide text-xs leading-tight ${isSelected ? 'text-white' : 'text-indigo-150'}`}>{config.name}</h4>
                                      <p className="text-[10px] text-zinc-400 line-clamp-2 font-sans tracking-wide leading-relaxed select-none mt-1">
                                        {config.desc}
                                      </p>
                                      <p className="text-[9px] text-zinc-500 font-mono uppercase font-bold tracking-widest truncate mt-1">Payload: {rewardChar?.name || 'Unknown'}</p>
                                    </div>

                                    <div className="flex justify-between items-center text-[9px] font-mono text-zinc-600 pt-2.5 border-t border-zinc-800/50 relative z-10 font-bold uppercase tracking-widest">
                                      <span>Power: {config.recommendedPower.toLocaleString()}+</span>
                                      <span className={lockState.locked ? "text-amber-500/60" : "text-emerald-400 glow-neon"}>
                                        {Math.round((lockState.completedCount / lockState.items.length) * 100)}% Sync
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          </div>

      {/* Journey detailed breakdown and phases */}
      <div className="lg:col-span-2 flex flex-col h-full bg-black/60 border border-indigo-900/40 rounded-3xl overflow-hidden relative shadow-2xl overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-transparent">
        {selectedJourney ? (() => {
          const lockState = checkJourneyLocked(selectedJourney.id);
          const percent = Math.round((lockState.completedCount / lockState.items.length) * 100);
          const rewardChar = allCharacters.find(ch => ch.id === selectedJourney.rewardCharacterId);

          return (
            <div className="holo-panel border-indigo-500/30 rounded-3xl p-8 space-y-7 relative overflow-hidden box-glow" id="journey_detail_sheet">
               <div className="absolute inset-0 scan-overlay pointer-events-none opacity-[0.03]"></div>
               {selectedJourney.isGalacticLegend && (
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
               )}
              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 relative z-10">
                <div className="space-y-3">
                  <span className={`text-[10px] px-3 py-1.5 rounded-md font-mono uppercase font-black tracking-widest leading-none border shadow-inner ${selectedJourney.isGalacticLegend ? 'bg-amber-950/50 border-amber-500/60 text-amber-400 box-glow' : 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400'}`}>
                    {selectedJourney.isGalacticLegend ? 'Tier 1 Divine Sovereign' : 'Classic Galactic Journey'}
                  </span>
                  <h2 className="font-display text-3xl font-black text-white tracking-wider drop-shadow-md">{selectedJourney.name}</h2>
                  <p className="text-sm font-mono text-indigo-200/70 italic max-w-xl leading-relaxed">"{selectedJourney.desc}"</p>
                  
                  {rewardChar && (
                    <div className="bg-indigo-950/20 border border-indigo-500/15 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-inner mt-2">
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono font-black uppercase tracking-widest text-amber-400">Target Specimen Profile</span>
                        <h4 className="text-white font-display font-black text-base">{rewardChar.name}</h4>
                        <p className="text-[11px] font-mono text-indigo-300/80 uppercase tracking-wider">{rewardChar.role} • {rewardChar.alignment === 'dark' ? 'Dark Side' : 'Light Side'}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-w-xs md:max-w-md">
                        {rewardChar.tags.slice(0, 5).map(tag => (
                          <span key={tag} className="text-[9px] bg-black/50 border border-indigo-500/20 text-indigo-200 font-mono font-bold px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Reset progress option */}
                  <div className="pt-2 flex items-center gap-2">
                    {confirmReset ? (
                      <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-500/30 px-3 py-1.5 rounded-lg animate-pulse">
                        <span className="text-[10px] text-rose-300 font-mono uppercase tracking-wider font-bold">Reset stages to replay? (No duplicate rewards)</span>
                        <button 
                          onClick={() => {
                            const stateCopy = JSON.parse(JSON.stringify(saveState));
                            if (!stateCopy.journeyProgress) stateCopy.journeyProgress = {};
                            stateCopy.journeyProgress[selectedJourney.id] = -1;
                            
                            onUpdateState(stateCopy);
                            setConfirmReset(false);
                            setActiveTab('prereqs');
                          }}
                          className="bg-rose-600 hover:bg-rose-500 text-white font-mono text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded transition"
                        >
                          Confirm Reset
                        </button>
                        <button 
                          onClick={() => setConfirmReset(false)}
                          className="bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-mono text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded border border-zinc-700 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setConfirmReset(true)}
                        className="text-[10px] font-mono text-zinc-400 hover:text-rose-400 bg-zinc-950/40 hover:bg-rose-950/10 border border-zinc-850 hover:border-rose-500/20 px-3 py-1.5 rounded-lg transition-all duration-300 shadow-inner uppercase tracking-wider font-bold"
                      >
                        Reset Journey Progress
                      </button>
                    )}
                  </div>
                </div>

                {/* Requirements progress disk */}
                <div className="flex items-center gap-4 bg-black/40 border border-indigo-500/20 px-5 py-4 rounded-2xl shrink-0 shadow-inner group">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-indigo-400/60 font-black tracking-widest uppercase mb-1">Prerequisites</div>
                    <div className="text-lg font-display font-black text-white px-2 bg-white/5 rounded border border-white/10">
                      {lockState.completedCount} <span className="text-indigo-500/50">/</span> {lockState.items.length}
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-full border-[3px] flex items-center justify-center font-mono text-xs font-black tracking-tight relative shadow-glow transition-colors duration-500 ${lockState.locked ? 'border-rose-950 bg-rose-950/20' : 'border-emerald-950 bg-emerald-950/20 glow-neon'}`}>
                    <div 
                      className={`absolute inset-0 rounded-full border-[3px] transition-all duration-1000 ${lockState.locked ? 'border-amber-500' : 'border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]'}`}
                      style={{ clipPath: `polygon(50% 50%, -50% -50%, ${percent >= 25 ? '150% -50%' : '50% -50%'}, ${percent >= 50 ? '150% 150%' : '50% -50%'}, ${percent >= 75 ? '-50% 150%' : '50% -50%'}, -50% -50%)` }}
                    />
                    <span className={`relative z-10 ${lockState.locked ? 'text-amber-400' : 'text-emerald-400'}`}>{percent}%</span>
                  </div>
                </div>
              </div>

              {/* TAB SELECTION - Show a clear prereqs screen before you get the phases */}
              <div className="flex bg-black/60 p-2 rounded-xl border border-indigo-500/20 relative z-10 shadow-inner">
                <button
                  onClick={() => setActiveTab('prereqs')}
                  className={`flex-1 py-3 rounded-lg font-mono text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'prereqs'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/50 shadow-glow'
                      : 'text-indigo-200/50 hover:text-indigo-200 hover:bg-indigo-950/30'
                  }`}
                >
                  <Columns className="w-4 h-4" /> 1. Prerequisites Overview
                </button>
                <button
                  onClick={() => setActiveTab('phases')}
                  className={`flex-1 py-3 rounded-lg font-mono text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'phases'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/50 shadow-glow'
                      : 'text-indigo-200/50 hover:text-indigo-200 hover:bg-indigo-950/30'
                  } ${lockState.locked ? 'opacity-80' : ''}`}
                >
                  <Zap className={`w-4 h-4 ${lockState.locked ? 'text-rose-400/60' : 'text-amber-400'}`} /> 2. Combat Phases
                  {lockState.locked && (
                    <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0 inline-block ml-1" />
                  )}
                </button>
              </div>

              {/* TAB 1: PREREQUISITES VIEW SCREEN */}
              {activeTab === 'prereqs' && (
                <div className="space-y-5 animate-fadeIn relative z-10">
                  <div className="bg-amber-950/20 p-5 rounded-2xl border border-amber-500/30 flex items-start gap-4 shadow-inner">
                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                    <div className="space-y-1.5">
                      <h4 className="text-amber-400 font-mono font-black uppercase tracking-widest text-[10px]">MANDATORY DIVISION REQUIREMENT BRIEFING:</h4>
                      <p className="text-amber-100/70 leading-relaxed font-mono text-xs">
                        As requested by fleet protocols, {selectedJourney.isGalacticLegend ? 'Galactic Legends require robust 12-16 member specialized rosters' : 'Specialized Journeys require their complete coordinated pilot team'}. All character divisions must be fully unlocked in your inventory and elevated to the specific Gear and Relic benchmarks indicated below before combat sequences unlock.
                      </p>
                    </div>
                  </div>

                  {/* Prerequisites checklist cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
                    {lockState.items.map(item => {
                      const charProg = saveState.characters[item.id];
                      const unlocked = charProg?.unlocked;
                      const hasGear = unlocked && charProg.gearTier >= item.requiredGear;
                      const hasRelic = unlocked && charProg.relicLevel >= item.requiredRelic;
                      const meetsAll = unlocked && hasGear && hasRelic;

                      return (
                        <div 
                          key={item.id} 
                          className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 text-xs font-mono transition-colors duration-300 shadow-inner group ${
                            meetsAll 
                              ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400' 
                              : unlocked
                                ? 'bg-black/60 border-indigo-500/20 hover:border-indigo-400'
                                : 'bg-rose-950/20 border-rose-500/20 grayscale opacity-80'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="font-display font-black tracking-wide text-white text-[13px]">{item.name}</h5>
                              <span className={`text-[9px] tracking-widest uppercase font-bold mt-1 block ${meetsAll ? 'text-emerald-400' : 'text-indigo-400/60'}`}>Prerequisite Unit</span>
                            </div>
                            {meetsAll ? (
                              <div className="bg-emerald-500/20 border border-emerald-400/50 p-1.5 rounded-lg text-emerald-400 shadow-glow group-hover:scale-110 transition-transform">
                                <Check className="w-4 h-4 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                              </div>
                            ) : (
                              <div className="bg-rose-950/50 border border-rose-500/30 p-1.5 rounded-lg text-rose-500/60 group-hover:scale-110 transition-transform">
                                <Lock className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-indigo-500/10 text-[10.5px]">
                            {/* Requirement parameter */}
                            <div className="bg-black/40 p-2.5 rounded-xl border border-indigo-500/20 text-center shadow-inner">
                              <div className="text-indigo-400/70 font-black uppercase tracking-widest text-[8px] mb-1">Required</div>
                              <div className="text-indigo-200 font-bold">
                                {item.requiredRelic > 0 ? `Relic R${item.requiredRelic}` : `Gear G${item.requiredGear}`}
                              </div>
                            </div>

                            {/* Self current parameter */}
                            <div className={`p-2.5 rounded-xl text-center border shadow-inner transition-colors duration-300 ${meetsAll ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/20'}`}>
                              <div className={`font-black uppercase tracking-widest text-[8px] mb-1 ${meetsAll ? 'text-emerald-400/70' : 'text-rose-400/70'}`}>Current</div>
                              <div className={`font-extrabold ${meetsAll ? 'text-emerald-400 glow-neon' : 'text-rose-400'}`}>
                                {!unlocked 
                                  ? 'LOCKED' 
                                  : charProg.relicLevel > 0 
                                    ? `R${charProg.relicLevel}` 
                                    : `G${charProg.gearTier}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Continue Button */}
                  <div className="pt-3 border-t border-indigo-500/20">
                    <button
                      onClick={() => {
                        if (lockState.locked) {
                          alert("⚠️ ACCESS RESTRICTED: You must acquire and calibrate all prerequisites to unlock the tactical combat phases.");
                        } else {
                          setActiveTab('phases');
                        }
                      }}
                      className={`w-full py-4 rounded-xl text-xs font-mono font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${
                        lockState.locked
                          ? 'bg-rose-950/20 text-rose-500/50 border border-rose-500/20 cursor-not-allowed shadow-inner'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-glow box-glow hover:-translate-y-0.5'
                      }`}
                    >
                      {lockState.locked ? (
                        <>
                          <Lock className="w-4 h-4 text-rose-500/50" /> Prerequisites Incomplete ({lockState.completedCount} / {lockState.items.length})
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" /> ALL PREREQUISITES MET - Unlock Flight Phases <Columns className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: COMBAT PHASES VIEW SCREEN */}
              {activeTab === 'phases' && (
                <div className="space-y-4 animate-fadeIn relative z-10">
                  {/* Lock announcement overlay card */}
                  {lockState.locked ? (
                    <div className="bg-rose-950/20 border border-rose-500/20 p-8 rounded-2xl flex flex-col gap-4 text-center items-center justify-center py-12 shadow-inner">
                      <Lock className="w-10 h-10 text-rose-400 animate-pulse" />
                      <div className="space-y-3 max-w-lg">
                        <strong className="text-white text-sm font-display font-black uppercase tracking-wider block">PHASE COMBAT PROTOCOL IS CONTROL-LOCKED:</strong>
                        <p className="text-rose-200/70 font-mono leading-relaxed text-xs">
                          Your faction forces have not cleared the required prerequisite calibrations. To engage in battlefield duels and earn reward shards, you must satisfy all training matrices.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('prereqs')}
                        className="mt-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest font-mono transition-colors"
                      >
                        ← Return to Prerequisites Checklist
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-950/20 border border-emerald-500/30 p-5 rounded-2xl flex items-center gap-4 text-xs font-mono text-emerald-400 shadow-inner">
                      <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] glow-neon" />
                      <strong className="tracking-wide">SECURED FLIGHT PROTOCOL ACTIVE: All training benchmarks achieved! Complete historical phases to secure this Journey character.</strong>
                    </div>
                  )}

                  <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
                    {selectedJourney.phases.map((phase, pIdx) => {
                      // Verify requirements
                      let phaseUnlockResult = phase.requiredCharacterIds.map(cid => 
                        checkUnitMeeting(cid, phase.levelReq, phase.gearReq, phase.relicReq)
                      );
                      
                      // Story-order lock: cannot play phase unless previous phase is completed
                      const isPreviousPhaseNotCompleted = pIdx > 0 && (!saveState.journeyProgress || (saveState.journeyProgress[selectedJourney.id] ?? -1) < pIdx - 1);
                      const isBlocked = phaseUnlockResult.some(r => !r.meet) || lockState.locked || isPreviousPhaseNotCompleted;

                      const phaseId = `journey_phase_${selectedJourney.id}_${pIdx}`;
                      const isAlreadyCompletedInHistory = saveState.completedCampaigns?.includes(phaseId) || (saveState.maxJourneyProgress?.[selectedJourney.id] !== undefined && saveState.maxJourneyProgress[selectedJourney.id] >= pIdx);

                      return (
                        <div 
                          key={phase.phaseNumber}
                          className={`border p-6 rounded-3xl flex flex-col sm:flex-row justify-between gap-5 transition-all duration-300 relative shadow-inner overflow-hidden ${
                            isBlocked 
                              ? 'bg-rose-950/10 border-rose-500/10 opacity-70 grayscale' 
                              : 'bg-black/40 border-indigo-500/20 hover:border-indigo-400 hover:bg-indigo-950/20 group'
                          }`}
                          id={`journey_phase_${phase.phaseNumber}`}
                        >
                          {/* Environment Background with Gradient overlay to ensure text contrast */}
                          <div className={`absolute inset-0 ${phase.background || 'environment-mandalore-city'} opacity-25 ${isBlocked ? 'opacity-5' : 'group-hover:opacity-45'} transition-opacity duration-300 scale-105 group-hover:scale-100 z-0`}></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-indigo-950/10 pointer-events-none z-0 animate-fadeIn"></div>

                          {/* Left: Phase content info */}
                          <div className="space-y-4 flex-1 relative z-10">
                            <div className="flex items-center gap-3">
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs font-black tracking-widest border transition-colors ${isBlocked ? 'bg-black text-rose-500/50 border-rose-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-400/50 shadow-glow'}`}>
                                {phase.phaseNumber}
                              </span>
                              <span className={`font-display font-black tracking-wider text-base ${isBlocked ? 'text-white/50' : 'text-white drop-shadow-md'}`}>Phase {phase.phaseNumber}: Sequence Operation</span>
                            </div>

                            <p className="text-zinc-400 text-xs leading-relaxed max-w-xl">{phase.description}</p>

                            {/* Requirements checks metrics */}
                            <div className="space-y-2 pt-3 border-t border-indigo-500/10">
                              <p className="text-[9px] uppercase font-mono font-black tracking-[0.2em] text-indigo-500/70 mb-2">Squad Phase Requirements Check:</p>
                              {phase.requiredCharacterIds.map((cid, cIdx) => {
                                const unitName = allCharacters.find(ch => ch.id === cid)?.name || cid;
                                const check = phaseUnlockResult[cIdx];

                                return (
                                  <div key={cid} className={`flex justify-between items-center px-4 py-2.5 rounded-xl border font-mono text-xs shadow-inner ${check.meet ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-rose-950/10 border-rose-500/20'}`}>
                                    <span className={check.meet ? 'text-indigo-200' : 'text-rose-300'}>{unitName}</span>
                                    <span className={check.meet ? 'text-emerald-400 font-bold flex items-center gap-2 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' : 'text-rose-400 flex items-center gap-2'}>
                                      {check.meet ? (
                                        <>
                                          <Check className="w-4 h-4 text-emerald-400" /> READY
                                        </>
                                      ) : (
                                        <>
                                          <AlertTriangle className="w-4 h-4 text-rose-500" /> {check.msg}
                                        </>
                                      )}
                                    </span>
                                  </div>
                                );
                              })}

                              {isPreviousPhaseNotCompleted && (
                                <div className="flex justify-between items-center px-4 py-2.5 rounded-xl border font-mono text-xs shadow-inner bg-rose-950/10 border-rose-500/20">
                                  <span className="text-rose-300">Story Order Check</span>
                                  <span className="text-rose-400 font-bold flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-rose-500" /> COMPLETE PHASE {pIdx} FIRST
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: triggers button */}
                          <div className="flex flex-col justify-center sm:items-end gap-4 sm:w-48 border-t sm:border-t-0 sm:border-l border-indigo-500/20 pt-4 sm:pt-0 sm:pl-5 select-none shrink-0 relative z-10">
                            
                            {saveState.journeyProgress && saveState.journeyProgress[selectedJourney.id] >= pIdx ? (
                              <div className="w-full flex-col flex items-center justify-center py-3.5 rounded-xl text-[11px] font-mono font-black tracking-widest uppercase text-emerald-400 bg-emerald-950/20 border border-emerald-500/50 shadow-glow">
                                <Check className="w-5 h-5 mb-1" />
                                COMPLETED
                              </div>
                            ) : (
                              <>
                                <div className="text-xs font-mono font-bold tracking-wider text-indigo-300/70 uppercase sm:text-right">
                                  Payoff Shard Reward:<br />
                                  {isAlreadyCompletedInHistory ? (
                                    <strong className="block text-sm mt-1 font-display font-black tracking-wider text-zinc-500 line-through">
                                      0 Shards (Reclaimed)
                                    </strong>
                                  ) : (
                                    <strong className={`block text-xl mt-1 font-display font-black tracking-widest ${isBlocked ? 'text-amber-500/40' : 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'}`}>{phase.rewards[0]?.amount} Shards</strong>
                                  )}
                                </div>

                                <button 
                                  onClick={() => onLaunchJourneyBattle(selectedJourney, pIdx, phase.requiredCharacterIds || [])}
                                  disabled={isBlocked}
                                  className={`w-full py-3.5 rounded-xl text-[11px] font-mono font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                                    isBlocked
                                      ? 'bg-black/60 text-rose-500/50 border border-rose-500/20 cursor-not-allowed shadow-inner'
                                      : 'bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400 text-indigo-300 hover:text-white shadow-glow box-glow hover:-translate-y-0.5'
                                  }`}
                                >
                                  {isBlocked ? (
                                    <>
                                      <Lock className="w-4 h-4" /> {isPreviousPhaseNotCompleted ? "LOCKED" : "ENGAGE"}
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-4 h-4 fill-current drop-shadow-[0_0_5px_currentColor]" /> DUEL BOSS
                                    </>
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })() : (
          <div className="holo-panel border-indigo-500/20 p-8 md:p-12 rounded-3xl text-indigo-300/80 min-h-[500px] flex flex-col justify-center relative overflow-hidden" id="journey_default_state">
            <div className="absolute inset-0 scan-overlay pointer-events-none opacity-[0.03]"></div>
            
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-5 justify-center md:justify-start">
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400 shadow-glow animate-pulse">
                  <Award className="w-12 h-12" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-indigo-400 glow-neon block">
                    Command Archive Database
                  </span>
                  <h3 className="font-display text-3xl font-black text-white tracking-wider uppercase">
                    Journey Guide Archives
                  </h3>
                </div>
              </div>
              
              <p className="text-zinc-300 font-sans text-sm leading-relaxed">
                The archives catalog the most pivotal conflicts in galactic history. Complete these specialized legendary campaigns to recruit elite faction leaders and supreme entities into your battle roster.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-mono">
                <div className="bg-black/40 border border-indigo-500/10 p-5 rounded-2xl space-y-2">
                  <h4 className="text-amber-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-500" /> Classic Journeys
                  </h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Focused campaigns requiring specific pilot teams (e.g. Captain Pellaeon, General Kenobi, Grand Inquisitor). Unlocks vital faction-specific commanders.
                  </p>
                </div>
                
                <div className="bg-black/40 border border-indigo-500/10 p-5 rounded-2xl space-y-2">
                  <h4 className="text-amber-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" /> Galactic Legends
                  </h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Ultimate multi-stage campaigns requiring deep roster synchronization (up to 12+ fully calibrated high-relic units) to unlock supreme-tier forces.
                  </p>
                </div>
              </div>
              
              <div className="bg-indigo-950/20 border border-indigo-500/10 p-5 rounded-2xl text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-indigo-200 block uppercase tracking-wide">Calibration & Combat Protocols:</strong>
                  <p className="text-zinc-400 leading-relaxed">
                    Roster prerequisites must be completely satisfied to unlock combat operations. Once authorized, fight through sequential stages to secure the target unit shards.
                  </p>
                </div>
              </div>
              
              <div className="text-center pt-3">
                <p className="text-[11px] text-indigo-400/50 uppercase tracking-widest font-black animate-pulse">
                  ← Select a Guide sequence in the sidebar to engage
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
      )}
    </div>
  );
};
