import React, { useState, useEffect } from 'react';
import { SaveState, EventConfig, CampaignNode } from '../types';
import { EVENTS } from '../data/events';
import { INITIAL_CHARACTERS } from '../data/characters';
import { Play, ShieldAlert, Layers, FastForward } from 'lucide-react';

interface EventsViewProps {
  saveState: SaveState;
  onLaunchEventBattle: (
    eventNode: CampaignNode,
    isMarquee: boolean,
    marqueeCharId?: string,
    restrictEra?: string,
    restrictTags?: string[],
    allowedCharacterIds?: string[],
    isAssaultBattle?: boolean
  ) => void;
  onUpdateState?: (newState: SaveState) => void;
  defaultTab?: 'era' | 'special';
}

export const EventsView: React.FC<EventsViewProps> = ({
  saveState,
  onLaunchEventBattle,
  onUpdateState,
  defaultTab = 'special'
}) => {
  const isEra = defaultTab === 'era';
  
  const [now, setNow] = useState(new Date());
  useEffect(() => {
     const timer = setInterval(() => setNow(new Date()), 60000);
     return () => clearInterval(timer);
  }, []);

  const epoch = new Date('2026-06-01T00:00:00Z').getTime();
  const dayIndex = Math.floor((now.getTime() - epoch) / (1000 * 60 * 60 * 24));
  const weekIndex = Math.floor((now.getTime() - epoch) / (1000 * 60 * 60 * 24 * 7));
  const dayOfWeek = now.getUTCDay(); // 0 is Sunday

  // Daily reset
  const midnight = new Date(now);
  midnight.setUTCHours(23, 59, 59, 999);
  let timeTilMidnight = midnight.getTime() - now.getTime();
  if (timeTilMidnight < 0) timeTilMidnight += 24 * 60 * 60 * 1000;
  const expiresDailyStr = `${Math.floor(timeTilMidnight / 3600000)}h ${Math.floor((timeTilMidnight % 3600000) / 60000)}m`;

  // Weekly reset
  const nextWeek = new Date(epoch + (weekIndex + 1) * 7 * 24 * 60 * 60 * 1000);
  let timeTilNextWeek = nextWeek.getTime() - now.getTime();
  if (timeTilNextWeek < 0) timeTilNextWeek += 7 * 24 * 60 * 60 * 1000;
  const expiresWeeklyStr = `${Math.floor(timeTilNextWeek / 86400000)}d ${Math.floor((timeTilNextWeek % 86400000) / 3600000)}h`;

  // 48 hour reset mapping
  const next48 = new Date(epoch + (Math.floor((now.getTime() - epoch) / (48 * 3600000)) + 1) * (48 * 3600000));
  let timeTil48 = next48.getTime() - now.getTime();
  if (timeTil48 < 0) timeTil48 += 48 * 3600000;
  const expires48Str = `${Math.floor(timeTil48 / 3600000)}h ${Math.floor((timeTil48 % 3600000) / 60000)}m`;

  // Monthly reset mapping
  const startYear = 2026;
  const startMonth = 5; // June is 5 (0-indexed)
  const currentDate = new Date(now);
  const currentYear = currentDate.getUTCFullYear();
  const currentMonth = currentDate.getUTCMonth();
  const monthIndex = (currentYear - startYear) * 12 + (currentMonth - startMonth);

  const nextMonthDate = new Date(Date.UTC(startYear, startMonth + monthIndex + 1, 1, 0, 0, 0, 0));
  let timeTilNextMonth = nextMonthDate.getTime() - now.getTime();
  if (timeTilNextMonth < 0) timeTilNextMonth += 30 * 24 * 60 * 60 * 1000;
  const expiresMonthlyStr = `${Math.floor(timeTilNextMonth / 86400000)}d ${Math.floor((timeTilNextMonth % 86400000) / 3600000)}h`;

  // Only one Assault Battle active at a time, rotating daily
  const allAssaults = EVENTS.filter(e => e.type === 'Assault Battle');
  const activeAssaults = allAssaults.length > 0 ? [allAssaults[dayIndex % allAssaults.length]] : [];

  // Only one Character Event active at a time, rotating daily
  const allCharEvents = EVENTS.filter(e => e.type === 'Character Event');
  const activeCharEvents = allCharEvents.length > 0 ? [allCharEvents[dayIndex % allCharEvents.length]] : [];

  // Only one Legacy Marquee active at a time, rotating weekly
  const allLegacyMarquees = EVENTS.filter(e => e.type === 'Marquee Event');
  const activeMarquee = allLegacyMarquees.length > 0 ? [allLegacyMarquees[weekIndex % allLegacyMarquees.length]] : [];

  // Only one Elite Marquee active at a time, rotating monthly
  const allEliteMarquees = EVENTS.filter(e => e.type === 'Elite Marquee');
  const activeEliteMarquee = allEliteMarquees.length > 0 ? [allEliteMarquees[monthIndex % allEliteMarquees.length]] : [];

  // Rotate Resource Events: All open on Sunday (0), otherwise 2 per day
  const allResources = EVENTS.filter(e => e.type === 'Material Battle');
  let activeResources = allResources;
  if (dayOfWeek !== 0) {
      activeResources = [
         allResources[dayIndex % allResources.length],
         allResources[(dayIndex + 1) % allResources.length]
      ].filter(Boolean);
  }

  // Other special/random events rotating daily
  const allSpecialEvents = EVENTS.filter(e => e.type === 'Special Event');
  const activeSpecialEvents = allSpecialEvents.length > 0 ? [allSpecialEvents[dayIndex % allSpecialEvents.length]] : [];

  const activeEvents = isEra ? [] : [
    ...activeMarquee,
    ...activeEliteMarquee,
    ...activeCharEvents,
    ...activeAssaults,
    ...activeResources,
    ...activeSpecialEvents
  ];

  const [selectedEventId, setSelectedEventId] = useState<string>(activeEvents[0]?.id || '');
  useEffect(() => {
     if (!activeEvents.find(e => e.id === selectedEventId)) {
         setSelectedEventId(activeEvents[0]?.id || '');
     }
  }, [activeEvents.length]);

  const activeEvent = activeEvents.find(e => e.id === selectedEventId);

  // Enforce Journey Character Ownership Lock for Character Events
  const isLockedByJourney = activeEvent?.type === 'Character Event' && activeEvent.requiredJourneyCharacterId && (
    !saveState.characters[activeEvent.requiredJourneyCharacterId] || 
    !saveState.characters[activeEvent.requiredJourneyCharacterId].unlocked
  );

  const requiredCharName = activeEvent?.requiredJourneyCharacterId 
    ? (INITIAL_CHARACTERS.find(c => c.id === activeEvent.requiredJourneyCharacterId)?.name || activeEvent.requiredJourneyCharacterId)
    : '';

  function formatRewardItem(itemId: string) {
    if (itemId === 'credit') return 'Credits';
    if (itemId === 'crystal') return 'Crystals';
    if (itemId === 'legend_shard') return 'Legendary Tokens';
    if (itemId.startsWith('shards_')) {
      const cid = itemId.replace('shards_', '');
      const char = INITIAL_CHARACTERS.find(c => c.id === cid);
      return (char?.name || cid) + ' Shards';
    }
    return itemId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  function handleStartEventBattle(node: CampaignNode, ev: EventConfig) {
    const isMarquee = ev.type === 'Marquee Event';
    const isAssaultBattle = ev.type === 'Assault Battle';
    onLaunchEventBattle(
      node,
      isMarquee,
      ev.marqueeCharId,
      undefined,
      ev.primaryFaction && ev.primaryFaction.length > 0 ? ev.primaryFaction : undefined,
      undefined,
      isAssaultBattle
    );
  }

  function handleSimEvent(node: CampaignNode, ev: EventConfig) {
     if (!onUpdateState) return;
     const updated = { ...saveState, inventory: { ...saveState.inventory } };
     
     let earnedCredits = 0;
     let earnedCrystals = 0;

     node.rewards.forEach(r => {
        const amount = typeof r.amountMax === 'number' ? r.amountMax : r.amountMin;
        updated.inventory[r.itemId] = (updated.inventory[r.itemId] || 0) + amount;
        if (r.itemId === 'credit') earnedCredits += amount;
        if (r.itemId === 'crystal') earnedCrystals += amount;
     });
     
     if (earnedCredits > 0) updated.credits = (updated.credits || 0) + earnedCredits;
     if (earnedCrystals > 0) updated.crystals = (updated.crystals || 0) + earnedCrystals;
     
     updated.completedDailyEvents = [...(updated.completedDailyEvents || []), node.id];
     
     onUpdateState(updated);
  }

  if (isEra) {
     return <div className="text-white text-center py-10 opacity-50">Era Events have been moved to the specialized ERA tab.</div>;
  }

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="space-y-8">
        {activeEvents.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-display font-black tracking-widest text-white uppercase">Active Events</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {activeEvents.map(ev => {
                    const isActive = selectedEventId === ev.id;
                    
                    let bgCol = 'bg-black/60 border-zinc-800 focus:border-zinc-500 hover:border-zinc-500';
                    let accentStr = 'text-zinc-400';
                    let spanStyle = 'text-zinc-400 border-zinc-500/20 bg-zinc-950/50';
                    let expStr = expiresDailyStr;
                    
                    if (ev.type === 'Marquee Event') { accentStr = 'text-amber-400'; spanStyle = 'text-amber-400 border-amber-500/20 bg-amber-950/50'; expStr = expiresWeeklyStr; if (isActive) bgCol = 'bg-amber-950/30 border-amber-500'; }
                    else if (ev.type === 'Elite Marquee') { accentStr = 'text-cyan-400'; spanStyle = 'text-cyan-400 border-cyan-500/20 bg-cyan-950/50'; expStr = expiresMonthlyStr; if (isActive) bgCol = 'bg-cyan-950/30 border-cyan-500'; }
                    else if (ev.type === 'Character Event') { accentStr = 'text-rose-400'; spanStyle = 'text-rose-400 border-rose-500/20 bg-rose-950/50'; expStr = expiresDailyStr; if (isActive) bgCol = 'bg-rose-950/30 border-rose-500'; }
                    else if (ev.type === 'Assault Battle') { accentStr = 'text-purple-400'; spanStyle = 'text-purple-400 border-purple-500/20 bg-purple-950/50'; expStr = expiresDailyStr; if (isActive) bgCol = 'bg-purple-950/30 border-purple-500'; }
                    else if (ev.type === 'Material Battle') { accentStr = 'text-emerald-400'; spanStyle = 'text-emerald-400 border-emerald-500/20 bg-emerald-950/50'; expStr = expiresDailyStr; if (isActive) bgCol = 'bg-emerald-950/30 border-emerald-500'; }
                    else if (ev.type === 'Special Event') { accentStr = 'text-fuchsia-400'; spanStyle = 'text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-950/50'; expStr = expires48Str; if (isActive) bgCol = 'bg-fuchsia-950/30 border-fuchsia-500'; }

                    return (
                        <button
                            key={ev.id}
                            onClick={() => setSelectedEventId(ev.id)}
                            className={`shrink-0 w-64 text-left p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${bgCol} ${!isActive ? 'grayscale hover:grayscale-0' : 'shadow-glow'}`}
                        >
                            <div className="relative z-10 mb-6">
                                <h4 className={`font-display font-black text-sm tracking-widest uppercase mb-1 line-clamp-2 ${isActive ? 'text-white' : 'text-zinc-300'}`}>{ev.name}</h4>
                                <p className="text-[10px] text-zinc-400 font-mono line-clamp-2 leading-relaxed">{ev.desc}</p>
                            </div>
                            <div className="relative z-10 flex justify-between items-end mt-auto">
                                <div className="space-y-1">
                                    <span className={`block text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded border w-fit ${spanStyle}`}>{ev.type}</span>
                                    <span className="block text-[9px] uppercase font-mono text-zinc-400">Ends in: {expStr}</span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
          </div>
        )}
      </div>

      {activeEvent && (
          <div className="holo-panel rounded-3xl p-6 border border-zinc-700/50 space-y-6 box-glow shadow-[0_0_30px_rgba(255,255,255,0.05)] relative overflow-hidden">
             <div className="absolute inset-0 scan-overlay opacity-5 pointer-events-none"></div>
             <div className="relative z-10 border-b border-zinc-700/50 pb-4">
                 <h2 className="text-2xl font-display font-black tracking-widest text-white uppercase">{activeEvent.name}</h2>
                 <p className="text-zinc-400 font-mono text-sm max-w-3xl mt-2">{activeEvent.desc}</p>
                 
                 {isLockedByJourney && (
                     <div className="mt-4 p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 flex items-center gap-3 text-rose-400">
                         <ShieldAlert className="w-5 h-5 shrink-0" />
                         <div>
                             <p className="text-xs font-mono font-bold uppercase tracking-wider">EVENT LOCKED</p>
                             <p className="text-xs font-mono">You must unlock and activate <strong className="text-white">{requiredCharName}</strong> (7★ Journey) to participate in this Character Event.</p>
                         </div>
                     </div>
                 )}

                 {activeEvent.primaryFaction && (
                     <div className="flex gap-2 mt-4 flex-wrap">
                         <span className="text-[10px] uppercase font-mono text-zinc-500 py-1">Required Factions:</span>
                         {activeEvent.primaryFaction.map(f => (
                             <span key={f} className="text-[10px] uppercase font-mono font-bold text-indigo-300 bg-indigo-950/40 border border-indigo-500/30 px-2 py-1 rounded">
                                 {f}
                             </span>
                         ))}
                     </div>
                 )}
                 {activeEvent.enemyFaction && activeEvent.enemyFaction[0] !== 'Any' && (
                     <div className="flex gap-2 mt-2 flex-wrap">
                         <span className="text-[10px] uppercase font-mono text-zinc-500 py-1">Enemies:</span>
                         {activeEvent.enemyFaction.map(f => (
                             <span key={f} className="text-[10px] uppercase font-mono font-bold text-rose-300 bg-rose-950/40 border border-rose-500/30 px-2 py-1 rounded">
                                 {f}
                             </span>
                         ))}
                     </div>
                 )}
             </div>

             <div className="relative z-10 space-y-4">
                 <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-2">
                     <ShieldAlert className="w-4 h-4"/> Event Stages ({activeEvent.nodes.length})
                 </h3>
                 
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                     {activeEvent.nodes.map((node, i) => {
                         const isCompleted = saveState?.completedDailyEvents?.includes(node.id);
                         const isMarquee = activeEvent.type === 'Marquee Event';
                         const is3Starred = saveState?.completed3StarNodes?.includes(node.id);
                         const canSim = is3Starred && !isMarquee;
                         
                         return (
                          <div key={node.id} className="bg-black/60 border border-zinc-500/20 p-4 rounded-xl flex flex-col justify-between hover:border-zinc-500/50 transition relative overflow-hidden">
                               <div className="mb-4 relative z-10">
                                   <div className="flex justify-between items-start mb-2">
                                       <h4 className="font-display font-black text-sm text-white uppercase tracking-wider">{i + 1}. {node.nodeName}</h4>
                                       <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                                           node.difficulty === 'Legend' ? 'text-rose-400 border-rose-500/30 bg-rose-950/50' :
                                           node.difficulty === 'Galactic' ? 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-950/50' :
                                           node.difficulty === 'Hard' ? 'text-amber-400 border-amber-500/30 bg-amber-950/50' :
                                           'text-cyan-400 border-cyan-500/30 bg-cyan-950/50'
                                       }`}>
                                           {node.difficulty}
                                       </span>
                                   </div>
                                   <p className="text-[10px] text-zinc-500 font-mono mb-2">Recommended Power: {node.powerRecommended.toLocaleString()}</p>
                                   
                                   {/* Rewards preview */}
                                   <div className="flex gap-1.5 flex-wrap">
                                       {node.rewards.map((r, rIdx) => (
                                           <span key={rIdx} className="bg-zinc-950/40 text-zinc-400 border border-zinc-500/20 text-[8px] font-mono px-1.5 py-0.5 rounded uppercase">
                                               {r.amountMin === r.amountMax ? r.amountMax : `${r.amountMin}-${r.amountMax}`} {formatRewardItem(r.itemId)}
                                           </span>
                                       ))}
                                   </div>
                               </div>

                               <div className="flex gap-2 mt-auto relative z-10">
                                   <button 
                                       onClick={() => !isLockedByJourney && handleStartEventBattle(node, activeEvent)}
                                       disabled={isCompleted || isLockedByJourney}
                                       className={`flex-1 border py-2 rounded-lg text-[10px] font-mono font-black uppercase flex items-center justify-center gap-2 transition-all shadow-glow ${
                                          isCompleted ? 'bg-zinc-900/50 text-zinc-600 border-zinc-800 cursor-not-allowed opacity-50' : 
                                          isLockedByJourney ? 'bg-zinc-950/30 text-zinc-600 border-zinc-900 cursor-not-allowed opacity-40' :
                                          'bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border-indigo-500/50 hover:text-white'
                                       }`}
                                   >
                                       <Play className="w-3 h-3 fill-current" /> 
                                       {isCompleted ? 'COMPLETED' : isLockedByJourney ? 'LOCKED' : 'BATTLE'}
                                   </button>

                                   <button 
                                       onClick={() => !isLockedByJourney && handleSimEvent(node, activeEvent)}
                                       disabled={isCompleted || !canSim || isLockedByJourney}
                                       className={`px-4 border py-2 rounded-lg text-[10px] font-mono font-black uppercase flex items-center justify-center gap-2 transition-all shadow-glow ${
                                          isCompleted ? 'bg-black text-zinc-600 border-zinc-800 hidden' : 
                                          (!canSim || isLockedByJourney) ? 'bg-black/40 text-zinc-600 border-zinc-800 cursor-not-allowed hidden xl:flex' : 
                                          'bg-green-500/10 hover:bg-green-500/30 text-green-400 border-green-500/30 hover:text-white'
                                       }`}
                                       title={!canSim && !isMarquee ? "Requires 3★ to SIM" : "Simulate Battle instantly"}
                                   >
                                       <FastForward className="w-3 h-3 fill-current" /> 
                                       {(!canSim && !isMarquee) ? 'LOCKED' : 'SIM'}
                                   </button>
                               </div>
                          </div>
                      )})}
                 </div>
             </div>
          </div>
      )}
    </div>
  );
};
