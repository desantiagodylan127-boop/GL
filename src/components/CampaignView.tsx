import React, { useState, useEffect } from 'react';
import { SaveState, CampaignNode, Character, PlayerCharacterProgress } from '../types';
import { CAMPAIGN_NODES, PROGRESSION_MATERIALS } from '../data/campaign';
import { solveSimBattle } from '../utils/combatEngine';
import { getAllCharacters } from '../data/characters';
import { Play, Zap, Grid, Sparkles, Award, ShieldAlert, Check, Lock } from 'lucide-react';
import { InfoDialog } from './InfoDialog';

interface CampaignViewProps {
  saveState: SaveState;
  onUpdateState: (newState: SaveState) => void;
  onLaunchBattle: (node: CampaignNode) => void;
  targetNodeId?: string | null;
}

export const CampaignView: React.FC<CampaignViewProps> = ({
  saveState,
  onUpdateState,
  onLaunchBattle,
  targetNodeId
}) => {
  const nodesToUse = saveState.customCampaignNodes && saveState.customCampaignNodes.length > 0 ? saveState.customCampaignNodes : CAMPAIGN_NODES;

  const [selectedEra, setSelectedEra] = useState<string>(() => sessionStorage.getItem('swgoh_ui_era') || 'CLONE WARS');
  const [selectedPlanet, setSelectedPlanet] = useState<string>(() => sessionStorage.getItem('swgoh_ui_planet') || 'Coruscant');
  const [selectedSector, setSelectedSector] = useState<string | null>(() => sessionStorage.getItem('swgoh_ui_sector') || null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(() => sessionStorage.getItem('swgoh_ui_node') || null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Normal' | 'Hard'>('Normal');
  const [simCount, setSimCount] = useState<number>(1);
  const [simResultModal, setSimResultModal] = useState<{ success: boolean; stars: number; totalDrops: Record<string, number> } | null>(null);
  const [showIntro, setShowIntro] = useState(!saveState.stats?.['seen_campaign_intro']);

  useEffect(() => {
    sessionStorage.setItem('swgoh_ui_era', selectedEra);
  }, [selectedEra]);

  useEffect(() => {
    sessionStorage.setItem('swgoh_ui_planet', selectedPlanet);
  }, [selectedPlanet]);

  useEffect(() => {
    if (selectedSector) sessionStorage.setItem('swgoh_ui_sector', selectedSector);
    else sessionStorage.removeItem('swgoh_ui_sector');
  }, [selectedSector]);

  useEffect(() => {
    if (selectedNodeId) sessionStorage.setItem('swgoh_ui_node', selectedNodeId);
    else sessionStorage.removeItem('swgoh_ui_node');
  }, [selectedNodeId]);

  useEffect(() => {
    if (targetNodeId) {
      const targetNode = nodesToUse.find(n => n.id === targetNodeId);
      if (targetNode) {
        if (targetNode.era) {
          setSelectedEra(targetNode.era);
        }
        setSelectedPlanet(targetNode.planet);
        setSelectedSector(targetNode.sector);
        setSelectedNodeId(targetNode.id);
      }
    }
  }, [targetNodeId, nodesToUse]);

  const ERAs = ['CLONE WARS', 'IMPERIAL', 'NEW REPUBLIC', 'OUTLAWS'] as const;

  const PLANETS = Array.from(new Set(nodesToUse.filter(n => (n.era || 'IMPERIAL') === selectedEra).map(n => n.planet)));
  
  const availableSectors = Array.from(new Set(nodesToUse.filter(n => n.planet === selectedPlanet).map(n => n.sector)));
  const currentSector = availableSectors.includes(selectedSector || '') ? selectedSector : availableSectors[0];

  // Current active nodes
  const activeNodes = nodesToUse.filter(
    n => n.planet === selectedPlanet && n.sector === currentSector && (selectedDifficulty === 'Hard' ? (n.difficulty === 'Hard' || n.difficulty === 'Legend') : n.difficulty === 'Normal')
  );

  const selectedNode = nodesToUse.find(n => n.id === selectedNodeId);
  const unlockedCharacters = (Object.values(saveState.characters) as PlayerCharacterProgress[]).filter(c => c.unlocked);
  const allCharacters = getAllCharacters();

  const isNodeUnlocked = (node: CampaignNode): boolean => {
    // 1. If Normal node
    if (node.difficulty === 'Normal') {
      const era = node.era || 'IMPERIAL';
      const eraNormalNodes = nodesToUse.filter(n => (n.era || 'IMPERIAL') === era && n.difficulty === 'Normal');
      const idx = eraNormalNodes.findIndex(n => n.id === node.id);
      if (idx === 0) return true; // First normal node of any era is always unlocked
      if (idx < 0) return false;
      return saveState.completedCampaigns.includes(eraNormalNodes[idx - 1].id);
    }
    
    // 2. If Hard/Legend node
    // Hard requires all Normal nodes of that planet & sector to be completed.
    const normalInSector = nodesToUse.filter(
      n => n.planet === node.planet && n.sector === node.sector && n.difficulty === 'Normal'
    );
    const allNormalBeaten = normalInSector.every(n => saveState.completedCampaigns.includes(n.id));
    if (!allNormalBeaten) return false;
    
    // Within Hard/Legend in this sector, require previous Hard node to be completed.
    const hardInSector = nodesToUse.filter(
      n => n.planet === node.planet && n.sector === node.sector && (n.difficulty === 'Hard' || n.difficulty === 'Legend')
    );
    const hardIdx = hardInSector.findIndex(n => n.id === node.id);
    if (hardIdx <= 0) return true; // First Hard node of this sector is unlocked once Normal is done
    return saveState.completedCampaigns.includes(hardInSector[hardIdx - 1].id);
  };

  function handleInstantSim() {
    if (!selectedNode) return;
    if (!saveState.completed3StarNodes?.includes(selectedNode.id)) {
      alert("You must complete this node with a 3-Star victory to use instant simulation!");
      return;
    }
    if (!isNodeUnlocked(selectedNode)) {
      alert("Tactical route locked! You cannot simulate a locked node.");
      return;
    }
    if (saveState.energy < selectedNode.energyCost * simCount) {
      alert(`Missing energy! You need ${selectedNode.energyCost * simCount} energy to SIM ${simCount} times.`);
      return;
    }

    // Automatically select top 5 highest level/starred units for Simulation solves!
    const sortedUnlocked = unlockedCharacters
      .slice()
      .sort((a, b) => {
        const ratingA = a.level * 150 + a.stars * 800 + a.gearTier * 1200 + a.relicLevel * 2500;
        const ratingB = b.level * 150 + b.stars * 800 + b.gearTier * 1200 + b.relicLevel * 2500;
        return ratingB - ratingA;
      });
    const selectedSquad = sortedUnlocked.slice(0, 5).map(u => u.id);
    if (selectedSquad.length === 0) {
      alert("No unlocked characters in your roster to initiate simulations!");
      return;
    }

    const stateCopy = { ...saveState };
    const playerSquad = selectedSquad.map(id => allCharacters.find(ch => ch.id === id)!);
    const enemySquad = selectedNode.enemies.map(eid => allCharacters.find(ch => ch.id === eid)!).filter(Boolean);

    // Run statistical sim solver (we do it once for the outcome, if player wins 3 stars, they win all sims)
    const res = solveSimBattle(playerSquad, enemySquad, selectedNode.energyCost, saveState);
    
    if (!res.success) {
      alert("SIMULATION FAILED - Your team was not strong enough to win this battle.");
      return;
    }

    // Deduct energy
    stateCopy.energy -= (selectedNode.energyCost * simCount);

    const totalDrops: Record<string, number> = {};

    // Distribute material drops based on chance
    for (let s = 0; s < simCount; s++) {
      selectedNode.rewards.forEach(r => {
        if (Math.random() <= r.chance) {
          const amount = Math.floor(Math.random() * (r.amountMax - r.amountMin + 1)) + r.amountMin;
          stateCopy.inventory[r.itemId] = (stateCopy.inventory[r.itemId] || 0) + amount;
          if (r.itemId === 'credit') {
            stateCopy.credits += amount;
          }
          totalDrops[r.itemId] = (totalDrops[r.itemId] || 0) + amount;
        }
      });
    }

    // Record star completion
    if (!stateCopy.completedCampaigns.includes(selectedNode.id)) {
      stateCopy.completedCampaigns.push(selectedNode.id);
    }

    onUpdateState(stateCopy);
    setSimResultModal({
      success: res.success,
      stars: res.stars,
      totalDrops
    });
  }

  function handleStartManualArena() {
    if (!selectedNode) return;
    if (!isNodeUnlocked(selectedNode)) {
      alert("Tactical route locked! Complete the previous nodes first.");
      return;
    }
    onLaunchBattle(selectedNode);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative" id="campaign_pane_wrapper">
      {showIntro && (
        <InfoDialog 
          title="Campaign Directives" 
          content={
            <>
               <p>Welcome Commander. Engage in sequential planetary missions to gain character shards, upgrade materials, and credits.</p>
               <p><strong>Note:</strong> Clearing a combat node with 3 Stars will unlock auto-SIM capabilities, allowing you to instantly complete the node with Energy without manual battle!</p>
            </>
          }
          onClose={() => {
             setShowIntro(false);
             const copy = { ...saveState };
             if (!copy.stats) copy.stats = {};
             copy.stats['seen_campaign_intro'] = 1;
             onUpdateState(copy);
          }}
        />
      )}
      <div className="scan-overlay rounded-xl hidden sm:block"></div>

      {/* Sector map panel */}
      <div className="md:col-span-2 space-y-4">
        {/* Era Selection Navigation */}
        <div className="holo-panel border border-emerald-500/30 p-4 rounded-2xl bg-black/60 shadow-[0_0_20px_rgba(16,185,129,0.05)] relative z-10 w-full">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 font-bold">Active Campaign Era</span>
          <div className="flex flex-wrap items-center gap-2">
            {ERAs.map(era => (
              <button 
                key={era}
                onClick={() => {
                  setSelectedEra(era);
                  const firstPlanetOfEra = Array.from(new Set(nodesToUse.filter(n => (n.era || 'IMPERIAL') === era).map(n => n.planet)))[0];
                  if (firstPlanetOfEra) {
                    setSelectedPlanet(firstPlanetOfEra);
                  }
                  setSelectedNodeId(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all duration-300 ${
                  selectedEra === era 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-glow glow-neon' 
                    : 'bg-black/60 hover:bg-zinc-800/50 text-zinc-500 border border-zinc-800/80 hover:text-zinc-300'
                }`}
              >
                {era}
              </button>
            ))}
          </div>
        </div>

        {/* Planet Navigation */}
        <div className={`holo-panel font-mono border-b border-emerald-500/30 p-4 rounded-2xl flex flex-col gap-3 shadow-[0_0_20px_rgba(16,185,129,0.1)] relative z-10 overflow-hidden w-full transition-colors duration-700
          ${selectedPlanet === 'Coruscant' ? 'bg-gradient-to-br from-cyan-950/40 to-black' :
            selectedPlanet === 'Kamino' ? 'bg-gradient-to-br from-blue-950/40 to-black' :
            selectedPlanet === 'Utapau' ? 'bg-gradient-to-br from-amber-950/40 to-black' :
            selectedPlanet === 'Geonosis' ? 'bg-gradient-to-br from-orange-950/40 via-red-950/20 to-black' :
            selectedPlanet === 'Ryloth' ? 'bg-gradient-to-br from-purple-950/40 to-black' : ''
          }
        `}>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-screen pointer-events-none"></div>

          <div className="flex flex-wrap items-center justify-center gap-2 w-full pb-2 relative z-10">
            {PLANETS.map(p => (
              <button 
                key={p}
                onClick={() => {
                  setSelectedPlanet(p);
                  setSelectedNodeId(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition ${
                  selectedPlanet === p 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-inner glow-neon' 
                    : 'bg-black/60 hover:bg-zinc-800/50 text-zinc-400 border border-zinc-800/80'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex bg-black/50 p-1 rounded-xl border border-zinc-800 gap-1 text-[9px] uppercase tracking-widest overflow-x-auto scrollbar-none w-full">
            {availableSectors.map(sec => (
              <button 
                key={sec}
                onClick={() => {
                  setSelectedSector(sec);
                  setSelectedNodeId(null);
                }}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
                  currentSector === sec 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 glow-neon' 
                    : 'text-zinc-500 border border-transparent hover:text-zinc-300'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Nodes Timeline list */}
        <div className="space-y-4 relative z-10">
          {/* Difficulty Tabs */}
          <div className="flex justify-center gap-4 mb-6 relative z-10">
            <button
              onClick={() => setSelectedDifficulty('Normal')}
              className={`px-6 py-2 rounded-xl font-mono text-xs tracking-widest uppercase transition-all duration-300 shadow-glow ${
                selectedDifficulty === 'Normal' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 glow-neon' : 'bg-black/40 text-zinc-500 border border-zinc-800 hover:border-emerald-500/30 hover:text-zinc-300'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setSelectedDifficulty('Hard')}
              className={`px-6 py-2 rounded-xl font-mono text-xs tracking-widest uppercase transition-all duration-300 shadow-glow ${
                selectedDifficulty === 'Hard' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-black/40 text-zinc-500 border border-zinc-800 hover:border-rose-500/30 hover:text-zinc-300'
              }`}
            >
              Hard
            </button>
          </div>
          <div className="absolute left-[24px] top-[70px] bottom-[10px] w-0.5 bg-gradient-to-b from-emerald-500/50 via-emerald-500/10 to-transparent blur-[1px]"></div>
          {activeNodes.length > 0 ? (
            activeNodes.map((node, index) => {
              const isSelected = selectedNodeId === node.id;
              const hasCompleted = saveState.completedCampaigns.includes(node.id);
              const isUnlocked = isNodeUnlocked(node);
              const has3Stars = saveState.completed3StarNodes?.includes(node.id);

              return (
                <div 
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`cursor-pointer transition-all duration-300 relative border p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden group ${
                    isSelected 
                      ? 'bg-emerald-950/20 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.02]' 
                      : !isUnlocked
                        ? 'bg-zinc-950/40 border-zinc-800/50 opacity-60 hover:border-zinc-700/50'
                        : 'holo-panel hover:border-emerald-500/30'
                  }`}
                  id={`node_card_${node.id}`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>

                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`h-12 w-12 flex shrink-0 items-center justify-center rounded-xl font-mono font-bold text-lg shadow-inner ${
                      isSelected 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 glow-neon' 
                        : !isUnlocked
                          ? 'bg-black/40 text-zinc-600 border border-zinc-800'
                          : 'bg-black/60 text-zinc-400 border border-zinc-700'
                    }`}>
                      {!isUnlocked ? <Lock className="w-5 h-5 text-zinc-600" /> : index + 1}
                    </div>
                    <div>
                      <h4 className={`font-display font-bold tracking-wide text-sm sm:text-base ${
                        isSelected 
                          ? 'text-white glow-neon' 
                          : !isUnlocked
                            ? 'text-zinc-500'
                            : 'text-zinc-200'
                      }`}>{node.nodeName}</h4>
                      <p className={`text-[10px] sm:text-[11px] font-mono mt-1 uppercase tracking-widest ${
                         !isUnlocked ? 'text-zinc-600' :
                         node.difficulty === 'Legend' ? 'text-amber-400' :
                         node.difficulty === 'Hard' ? 'text-rose-400' :
                         'text-cyan-400/70'
                      }`}>
                         {!isUnlocked ? 'LOCKED' : `${node.difficulty} DIFFICULTY`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono relative z-10 justify-between sm:justify-start pl-[64px] sm:pl-0 border-t border-zinc-800/50 sm:border-0 pt-3 sm:pt-0">
                    <span className="text-emerald-400 flex items-center gap-1.5 shrink-0 px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <Zap className="w-3.5 h-3.5 fill-current" /> {node.energyCost}
                    </span>
                    {has3Stars ? (
                      <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-1 rounded-lg text-[10px] font-bold shadow-glow shrink-0">
                        ★ 3 STARS
                      </span>
                    ) : hasCompleted ? (
                      <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-2 py-1 rounded-lg text-[10px] font-bold shrink-0">
                        ✓ COMPLETE
                      </span>
                    ) : null}
                    <span className="text-zinc-500 shrink-0 text-[10px] uppercase">Power: {node.powerRecommended}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="holo-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center">
              <Grid className="w-12 h-12 text-zinc-700 mb-4 opacity-50" />
              <p className="font-mono text-sm text-cyan-500/50 uppercase tracking-widest">No tactical routes mapped for {selectedPlanet} in {currentSector}.</p>
            </div>
          )}
        </div>
      </div>

      {/* Selected Node Details side column */}
      <div className="space-y-4 relative z-20">
        {selectedNode ? (
          <div className="holo-panel p-6 rounded-3xl space-y-6 text-sm border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] sticky top-24" id="campaign_selected_node_detail">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg leading-none shadow-glow font-bold">
                {selectedNode.difficulty} SECTOR
              </span>
              <h3 className="font-display text-2xl font-black text-white tracking-tight mt-3 glow-neon">{selectedNode.nodeName}</h3>
              <p className="text-[11px] text-cyan-400/80 font-mono mt-1 uppercase tracking-widest">{selectedPlanet} // {selectedNode.sector}</p>
            </div>

            {/* Roster & power limit info */}
            <div className="space-y-3 relative z-10">
              <h4 className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest text-zinc-400 border-b border-zinc-800/50 pb-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" /> Hostile Signatures
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedNode.enemies.map((eid, idx) => {
                  const ch = allCharacters.find(c => c.id === eid);
                  if (!ch) return null;
                  
                  let enemyLevel = 1;
                  let enemyGear = 1;
                  let enemyStars = 1;
                  let enemyRelic = 0;
                  
                  const difficultyRating = selectedNode.powerRecommended
                     ? (selectedNode.powerRecommended / 1000)
                     : (selectedNode.energyCost || 10);
                  
                  if (difficultyRating >= 25) {
                     enemyGear = 13; enemyRelic = Math.min(9, Math.floor(difficultyRating - 22)); enemyStars = 7; enemyLevel = 85;
                  } else if (difficultyRating >= 18) {
                     enemyGear = 12; enemyStars = 7; enemyLevel = 85;
                  } else if (difficultyRating >= 15) {
                     enemyGear = 10; enemyStars = 6; enemyLevel = 80;
                  } else if (difficultyRating >= 12) {
                     enemyGear = 8; enemyStars = 5; enemyLevel = 70;
                  } else if (difficultyRating >= 9) {
                     enemyGear = 6; enemyStars = 4; enemyLevel = 55;
                  } else if (difficultyRating >= 7) {
                     enemyGear = 4; enemyStars = 3; enemyLevel = 40;
                  } else if (difficultyRating >= 5.5) {
                     enemyGear = 2; enemyStars = 2; enemyLevel = 20;
                  } else {
                     enemyGear = 1; enemyStars = 1; enemyLevel = Math.max(1, Math.floor(difficultyRating * 2));
                  }

                  return (
                    <div key={idx} className="bg-black/30 border border-zinc-800 rounded-lg p-2.5 flex flex-col items-center gap-1.5 min-w-[75px] shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                      <div className="w-10 h-10 bg-red-950/30 rounded-full border border-red-500/20 flex items-center justify-center shrink-0 mb-1 relative">
                         <ShieldAlert className="w-5 h-5 text-red-500/50" />
                         <div className="absolute -bottom-2 bg-black px-1.5 py-0.5 rounded text-[8px] font-bold border border-zinc-700 whitespace-nowrap">
                            <span className="text-zinc-300">Lv.{enemyLevel}</span>
                         </div>
                      </div>
                      
                      <div className="flex gap-1 items-center text-[9px] font-mono leading-none">
                        <span className="text-yellow-500">{enemyStars}⭐</span>
                        <span className="text-blue-400">G{enemyGear}</span>
                        {enemyRelic > 0 && <span className="text-red-400 font-bold">R{enemyRelic}</span>}
                      </div>

                      <span className="text-[10px] text-center font-bold text-red-300 leading-tight w-full truncate mt-0.5">{ch.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drops catalog */}
            <div className="space-y-3 relative z-10">
              <h4 className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest text-zinc-400 border-b border-zinc-800/50 pb-2">
                <Award className="w-4 h-4 text-amber-500" /> Scanned Drops
              </h4>
              <div className="space-y-2 font-mono text-[10px] sm:text-xs text-zinc-300">
                {selectedNode.rewards.map((rew, rIdx) => {
                  const name = PROGRESSION_MATERIALS.find(m => m.id === rew.itemId)?.name || rew.itemId;
                  return (
                    <div key={rIdx} className="flex justify-between items-center bg-black/40 px-3 py-2 rounded-xl border border-zinc-800 hover:border-zinc-700 transition">
                      <span className="truncate pr-2">{name}</span>
                      <span className="text-amber-400 font-bold shrink-0">{rew.amountMin}-{rew.amountMax} <span className="opacity-50 font-normal">({Math.round(rew.chance * 100)}%)</span></span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Energy and engagement */}
            {!isNodeUnlocked(selectedNode) ? (
              <div className="pt-5 border-t border-zinc-800/50 space-y-4 relative z-10 text-center bg-black/40 p-4 rounded-2xl border border-rose-500/20">
                <Lock className="w-8 h-8 text-rose-500 mx-auto mb-2 animate-pulse" />
                <h5 className="font-mono text-rose-400 font-bold uppercase tracking-wider text-xs">Tactical Link Locked</h5>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Complete previous campaign nodes sequentially in this sector to unlock this deployment route.
                </p>
              </div>
            ) : (
              <div className="pt-5 border-t border-zinc-800/50 space-y-4 relative z-10">
                <div className="flex justify-between items-center text-xs font-mono bg-black/30 p-2.5 rounded-xl border border-emerald-500/20">
                  <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Jump Cost</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" /> {selectedNode.energyCost * simCount} <span className="text-zinc-600 font-normal">/ {saveState.energy}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono pb-2">
                  <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Sim Multiplier</span>
                  <input 
                    type="number" 
                    min={1} 
                    max={20} 
                    value={simCount} 
                    onChange={e => setSimCount(parseInt(e.target.value) || 1)} 
                    className="bg-black/60 border border-zinc-700 rounded-lg px-3 py-1.5 w-20 text-right text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Simulator */}
                  {saveState.completed3StarNodes?.includes(selectedNode.id) ? (
                    <button 
                      onClick={handleInstantSim}
                      className="bg-black border border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500 text-emerald-400 font-mono text-xs py-3 rounded-xl transition tracking-widest uppercase font-bold text-center glow-neon shadow-glow"
                    >
                      SIM x{simCount}
                    </button>
                  ) : (
                    <div className="bg-black/40 border border-zinc-800 rounded-xl py-3 text-center text-zinc-500 font-mono text-[10px] uppercase tracking-wider flex flex-col justify-center items-center">
                      <span className="text-[10px] text-zinc-400 font-bold">SIM Locked</span>
                      <span className="text-[8px] text-zinc-600 mt-0.5">Need 3★ Victory</span>
                    </div>
                  )}

                  {/* Direct arena */}
                  <button 
                    onClick={handleStartManualArena}
                    className={`bg-zinc-100 hover:bg-white text-zinc-950 font-display font-black tracking-widest text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] ${!saveState.completed3StarNodes?.includes(selectedNode.id) ? 'col-span-1' : ''}`}
                  >
                    <Play className="w-4 h-4 fill-current" /> INITIATE DEPLOY
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="holo-panel p-8 rounded-3xl text-center text-zinc-500 h-[calc(100vh-200px)] min-h-[400px] flex flex-col items-center justify-center border-dashed border-2 border-emerald-500/20">
            <Sparkles className="w-12 h-12 text-zinc-600 mb-4 opacity-50 float-gentle" />
            <p className="font-mono text-sm uppercase tracking-widest text-cyan-400/50">Awaiting Target Selection...</p>
          </div>
        )}
      </div>

      {/* Sim Result Modal */}
      {simResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="holo-panel w-full max-w-sm rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] border-emerald-500/50 relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-400"></div>
            <div className={`p-6 text-center font-display font-black text-2xl tracking-widest uppercase border-b ${simResultModal.success ? 'bg-emerald-950/30 text-white border-emerald-500/20 glow-neon' : 'bg-red-950/30 text-red-500 border-red-500/20'}`}>
              {simResultModal.success ? `SUCCESS (${simResultModal.stars}★)` : 'CRITICAL FAILURE'}
            </div>
            <div className="p-6 space-y-5">
              <h3 className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2">
                <Check className="w-3.5 h-3.5" /> Payload Extracted
              </h3>
              {Object.keys(simResultModal.totalDrops).length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(simResultModal.totalDrops).map(([itemId, amount]) => {
                    const name = PROGRESSION_MATERIALS.find(m => m.id === itemId)?.name || itemId;
                    return (
                      <div key={itemId} className="bg-black/50 border border-zinc-800/50 p-3 rounded-2xl flex flex-col gap-1 items-center justify-center hover:border-emerald-500/30 transition">
                         <span className="text-[9px] text-zinc-400 font-mono text-center uppercase tracking-wide leading-tight">{name}</span>
                         <span className="text-lg font-bold text-amber-400 glow-neon">+{amount}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-zinc-500 text-sm font-mono py-6">Sensors empty. No assets recovered.</div>
              )}
            </div>
            <div className="p-4 bg-black/40 border-t border-emerald-500/20 flex justify-center">
               <button 
                 onClick={() => setSimResultModal(null)}
                 className="bg-zinc-900 border border-emerald-500/40 hover:bg-emerald-500 hover:text-black text-emerald-400 text-xs px-8 font-black tracking-widest uppercase py-3 rounded-xl font-mono transition-all duration-300 shadow-glow"
               >
                 Acknowledge
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
