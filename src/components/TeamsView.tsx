import React, { useState } from 'react';
import { SaveState, PlayerCharacterProgress } from '../types';
import { getAllCharacters } from '../data/characters';
import { SQUAD_RECOMMENDATIONS } from '../data/squadRecommendations';
import { Users, Plus, Trash2, CheckCircle2, Shield, Sword, Sparkles, BookOpen } from 'lucide-react';

import { getCharacterFarmLocation } from './RosterView';

interface TeamsViewProps {
  saveState: SaveState;
  onUpdateState: (newState: SaveState) => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  saveState,
  onUpdateState
}) => {
  const allCharacters = getAllCharacters();
  const unlockedCharacters = (Object.values(saveState.characters) as PlayerCharacterProgress[])
    .filter(c => c.unlocked)
    .map(c => allCharacters.find(ch => ch.id === c.id)!)
    .filter(Boolean);

  const [activeTab, setActiveTab] = useState<'custom' | 'recommended'>('custom');
  const [squadName, setSquadName] = useState('');
  const [selectedCharIds, setSelectedCharIds] = useState<string[]>([]);
  const [editingSquadId, setEditingSquadId] = useState<string | null>(null);

  const teams = (saveState.prebuiltSquads || {}) as Record<string, string[]>;

  function toggleCharacter(id: string) {
    if (selectedCharIds.includes(id)) {
      setSelectedCharIds(selectedCharIds.filter(x => x !== id));
    } else {
      if (selectedCharIds.length >= 5) {
        alert("A squad has a strict tactical limitation of 5 characters max!");
        return;
      }
      setSelectedCharIds([...selectedCharIds, id]);
    }
  }

  function handleSaveSquad() {
    if (!squadName.trim()) {
      alert("Please provide a name for your custom squad!");
      return;
    }
    if (selectedCharIds.length === 0) {
      alert("A squad must contain at least one tactical unit!");
      return;
    }

    const copy = { ...saveState };
    if (!copy.prebuiltSquads) {
      copy.prebuiltSquads = {};
    }

    const key = editingSquadId || 'squad_' + Date.now();
    copy.prebuiltSquads[key] = [...selectedCharIds];

    if (copy.tutorialStep === 4) {
      copy.tutorialStep = 5;
    }
    
    // Track in logs
    copy.battleLog.push(`📁 Saved custom team: "${squadName.trim()}" containing ${selectedCharIds.length} units.`);

    onUpdateState(copy);

    // Reset editor
    setSquadName('');
    setSelectedCharIds([]);
    setEditingSquadId(null);
    alert("Squad compiled and saved successfully in local command grids!");
  }

  function handleDeleteSquad(key: string) {
    const copy = { ...saveState };
    if (copy.prebuiltSquads) {
      delete copy.prebuiltSquads[key];
      copy.battleLog.push(`📁 Purged custom squad index: ${key}`);
      onUpdateState(copy);
    }
  }

  function handleEditSquad(key: string) {
    const copy = { ...saveState };
    const squad = copy.prebuiltSquads?.[key];
    if (squad) {
      setSelectedCharIds([...squad]);
      setSquadName(key.startsWith('squad_') ? 'Custom Squad' : key);
      setEditingSquadId(key);
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn holo-panel-container pb-20" id="teams_prebuild_view">
      
      {/* Primary Sub-Nav for Teams */}
      <div className="flex gap-4 border-b border-indigo-500/20 pb-2">
        <button 
          onClick={() => setActiveTab('custom')}
          className={`uppercase font-mono text-[11px] font-black pb-2 px-2 transition border-b-2 ${activeTab === 'custom' ? 'border-indigo-400 text-indigo-400 glow-neon' : 'border-transparent text-indigo-500/50 hover:text-indigo-300'}`}
        >
          <Users className="w-3.5 h-3.5 inline mr-1" />
          My Blueprints
        </button>
        <button 
          onClick={() => setActiveTab('recommended')}
          className={`uppercase font-mono text-[11px] font-black pb-2 px-2 transition border-b-2 ${activeTab === 'recommended' ? 'border-amber-400 text-amber-400 box-glow-amber' : 'border-transparent text-amber-500/50 hover:text-amber-300'}`}
        >
          <BookOpen className="w-3.5 h-3.5 inline mr-1" />
          Recommended Squads
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {/* Left Side: Creator or Recommended panel */}
        <div className="lg:col-span-2">
          {activeTab === 'custom' ? (
            <div className="holo-panel border-indigo-500/20 p-8 rounded-3xl space-y-7 relative overflow-hidden box-glow h-full">
              <div className="absolute inset-0 scan-overlay pointer-events-none opacity-[0.03]"></div>
              
              <div className="border-b border-indigo-500/20 pb-4 relative z-10">
                <h2 className="font-display text-2xl font-black text-white tracking-widest uppercase flex items-center gap-3 drop-shadow-md">
                  <Users className="w-6 h-6 text-indigo-400 glow-neon" />
                  Squad Blueprint Synthesizer
                </h2>
                <p className="text-indigo-200/60 font-mono text-xs mt-2 uppercase tracking-wide">Pre-compile your synergies here to rapidly load them into Campaign, Raid, and Events airspaces.</p>
              </div>

        {/* Input Name */}
        <div className="space-y-3 relative z-10">
          <label className="block text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-black shadow-inner p-1">Squad Blueprint Identifier Name:</label>
          <div className="flex gap-3">
            <input 
              type="text" 
              value={squadName}
              onChange={(e) => setSquadName(e.target.value)}
              placeholder="e.g., 501st Clone Airborne, Jedi Council Shield"
              className="w-full bg-black/60 border border-indigo-500/30 rounded-xl p-4 text-white text-sm font-mono focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all shadow-inner placeholder-indigo-500/30"
            />
            <button 
              onClick={handleSaveSquad}
              className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400 text-indigo-300 font-mono font-black text-xs px-6 lg:px-8 py-3 rounded-xl transition-all duration-300 uppercase tracking-widest select-none whitespace-nowrap shadow-glow box-glow hover:-translate-y-0.5"
            >
              {editingSquadId ? "Update Squad" : "Save Team"}
            </button>
          </div>
        </div>

        {/* Squad Selection Preview */}
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-black">Selected Blueprint Units</h4>
            <span className="text-[10px] font-mono font-black bg-indigo-950/40 border border-indigo-500/20 px-2 py-1 rounded text-indigo-300">
               {selectedCharIds.length} <span className="text-indigo-500/50">/</span> 5
            </span>
          </div>
          
          {selectedCharIds.length === 0 ? (
            <div className="border border-dashed border-indigo-500/30 bg-black/40 p-6 rounded-2xl text-center text-xs text-indigo-400/50 italic font-mono shadow-inner">
              No units currently drafted. Select matching unit matrices from your unlocked roster below!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {selectedCharIds.map(id => {
                const char = allCharacters.find(c => c.id === id);
                if (!char) return null;
                return (
                  <div key={id} className="bg-gradient-to-b from-indigo-950/40 to-black/60 border border-indigo-500/30 p-3 rounded-2xl relative flex flex-col items-center text-center shadow-inner group transition-all">
                    <button 
                      onClick={() => toggleCharacter(id)}
                      className="absolute top-1 right-1 text-indigo-500/50 hover:text-rose-400 transition-colors text-lg font-bold font-mono px-1 z-10 leading-none"
                    >
                      ×
                    </button>
                    <span className="text-[8px] uppercase font-black font-mono tracking-widest text-indigo-400/60 truncate w-full pt-2">{char.faction}</span>
                    <h5 className="font-display font-black text-white text-[11px] mt-1 truncate w-full drop-shadow-md">{char.name}</h5>
                    <div className="mt-2 flex items-center justify-center w-full">
                      <span className="text-[8px] bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 px-2 py-0.5 rounded uppercase font-black tracking-widest w-full">
                        {char.role}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active roster to draft from */}
        <div className="space-y-4 relative z-10 pt-4 border-t border-indigo-500/20">
          <h4 className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-black">Draft Eligible Officers:</h4>
          {unlockedCharacters.length === 0 ? (
            <p className="text-zinc-505 text-indigo-400/50 italic text-xs font-mono">All database officers are locked. Acquire new shards or promote roster characters to draft custom teams!</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {unlockedCharacters.map(char => {
                const isSelected = selectedCharIds.includes(char.id);
                return (
                  <button 
                    key={char.id}
                    onClick={() => toggleCharacter(char.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group shadow-inner ${
                      isSelected 
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400 shadow-[inset_0_0_15px_rgba(52,211,153,0.1)]' 
                        : 'bg-black/60 border-indigo-500/20 hover:border-indigo-400/80 hover:bg-indigo-950/20 text-indigo-200'
                    }`}
                  >
                    <div className={`font-black tracking-wide text-xs truncate ${isSelected ? 'text-white' : 'text-white'}`}>{char.name}</div>
                    <div className="text-[9px] font-mono mt-1.5 uppercase justify-between flex truncate items-center">
                      <span className={`${isSelected ? 'text-emerald-400/70' : 'text-indigo-400/70 font-bold'}`}>{char.faction}</span>
                      <span className={`font-black px-1.5 py-0.5 rounded ${isSelected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>Lv {saveState.characters[char.id].level}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
          ) : (
            <div className="holo-panel border-amber-500/20 p-8 rounded-3xl space-y-7 relative overflow-hidden box-glow h-full">
              <div className="absolute inset-0 scan-overlay pointer-events-none opacity-[0.03]"></div>
              
              <div className="border-b border-amber-500/20 pb-4 relative z-10 flex flex-col gap-2">
                <h2 className="font-display text-2xl font-black text-white tracking-widest uppercase flex items-center gap-3 drop-shadow-md">
                  <BookOpen className="w-6 h-6 text-amber-400 box-glow-amber" />
                  Tactical Recommendations
                </h2>
                <p className="text-amber-200/60 font-mono text-[10px] uppercase tracking-wide leading-relaxed max-w-2xl">
                  Analyze strategic formations proven effective across the galactic conflict. Build these synergistic groupings to maximize combat efficiency. Missing units must be acquired through active duty or the Character Finder.
                </p>
              </div>

              <div className="space-y-6 relative z-10 max-h-[70vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
                {SQUAD_RECOMMENDATIONS.map(rec => {
                  const ownedIds = rec.members.filter(id => saveState.characters[id]?.unlocked);
                  const missingIds = rec.members.filter(id => !saveState.characters[id]?.unlocked);
                  const completionPercentage = Math.round((ownedIds.length / rec.members.length) * 100);

                  return (
                    <div key={rec.id} className="bg-black/60 border border-amber-500/20 rounded-2xl p-5 hover:border-amber-400/50 transition-colors shadow-inner flex flex-col gap-4">
                      
                      {/* Header */}
                      <div className="flex justify-between items-start border-b border-amber-500/10 pb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-black font-mono uppercase tracking-widest leading-none">
                              {rec.faction}
                            </span>
                            <span className={`text-[9px] font-black font-mono uppercase tracking-widest leading-none px-2 py-0.5 rounded border ${
                              rec.difficulty === 'Beginner' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                              rec.difficulty === 'Intermediate' ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' :
                              rec.difficulty === 'Advanced' ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' :
                              'text-rose-400 border-rose-500/30 bg-rose-500/10'
                            }`}>
                              {rec.difficulty}
                            </span>
                          </div>
                          <h3 className="text-lg font-display font-black text-white uppercase tracking-wider">{rec.name}</h3>
                          <div className="text-[10px] text-amber-500/50 font-mono font-bold uppercase tracking-widest mt-0.5">Role: {rec.role}</div>
                        </div>
                        <div className="text-right flex flex-col justify-end items-end gap-1">
                          <div className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest">
                            Roster Status
                          </div>
                          <div className="flex gap-1 items-center">
                            <div className="w-16 h-1.5 bg-black rounded overflow-hidden shadow-inner border border-zinc-800">
                              <div className="h-full bg-amber-400 box-glow-amber opacity-80 transition-all" style={{ width: `${completionPercentage}%` }}></div>
                            </div>
                            <span className={`text-xs font-mono font-black ${completionPercentage === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {ownedIds.length}/{rec.members.length}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[10px] font-mono text-zinc-400 leading-relaxed max-w-full">
                        {rec.description}
                      </p>

                      {/* Roster Layout */}
                      <div className="grid grid-cols-5 gap-2">
                        {rec.members.map(memberId => {
                          const char = allCharacters.find(c => c.id === memberId);
                          const isOwned = saveState.characters[memberId]?.unlocked;
                          
                          if (!char) return null;

                          return (
                            <div 
                              key={memberId} 
                              onClick={() => {
                                if (!isOwned) {
                                  const loc = getCharacterFarmLocation(memberId);
                                  alert(`FIND SHARDS: ${char.name}\n\nAvailable in: ${loc.locationName}`);
                                }
                              }}
                              className={`relative flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                                isOwned 
                                  ? 'bg-emerald-950/20 border-emerald-500/30' 
                                  : 'bg-black/80 border-rose-500/20 opacity-60 backdrop-blur-sm grayscale-[0.8] cursor-pointer hover:opacity-100 hover:grayscale-0'
                              }`}>
                              {!isOwned && (
                                <div className="absolute top-1 right-1 text-rose-500 text-[8px] font-black font-mono">
                                  MISSING
                                </div>
                              )}
                              <span className={`text-[7px] uppercase font-black font-mono tracking-widest truncate w-full pt-2 ${isOwned ? 'text-emerald-400/60' : 'text-rose-400/60'}`}>
                                {char.faction}
                              </span>
                              <h5 className={`font-display font-black text-[9px] mt-1 line-clamp-2 w-full drop-shadow-md ${isOwned ? 'text-white' : 'text-zinc-400'}`}>
                                {char.name}
                              </h5>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>

      {/* Right Column: Pre-built squads listing */}
      <div className="holo-panel border-indigo-500/20 p-8 rounded-3xl space-y-6 text-sm h-fit relative overflow-hidden box-glow">
        <div className="absolute inset-0 scan-overlay pointer-events-none opacity-[0.03]"></div>
        <div className="flex items-center gap-3 pb-3 border-b border-indigo-500/20 uppercase tracking-widest text-indigo-400 font-black font-mono text-[11px] relative z-10">
          <Sparkles className="w-4 h-4 text-amber-500 glow-neon" /> Compiled Squad Databases
        </div>

        {Object.keys(teams).length === 0 ? (
          <div className="text-center font-mono text-xs text-indigo-400/50 py-12 italic relative z-10 shadow-inner rounded-xl bg-black/40 border border-indigo-500/10">
            No command blueprints drafted yet. Create your first strategic squad to view details!
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent relative z-10">
            {Object.entries(teams).map(([key, ids]) => {
              const displayTitle = key.startsWith('squad_') ? 'Prebuilt Group' : key;
              return (
                <div key={key} className="bg-black/60 border border-indigo-500/20 p-5 rounded-2xl space-y-4 shadow-inner hover:border-indigo-400/50 transition-colors group">
                  <div className="flex justify-between items-center pb-2.5 border-b border-indigo-500/10">
                    <span className="font-display font-black text-white truncate max-w-[120px] tracking-wide">{displayTitle}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditSquad(key)}
                        className="text-indigo-400 hover:text-white transition-colors text-[9px] font-black font-mono uppercase tracking-widest px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/30 border border-indigo-500/30 rounded shadow-glow"
                        title="Edit blueprint"
                      >
                        Draft
                      </button>
                      <button 
                        onClick={() => handleDeleteSquad(key)}
                        className="text-rose-400 hover:text-rose-300 transition-colors bg-rose-950/20 p-1 rounded border border-rose-500/20"
                        title="Dismantle team"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {ids.map(id => {
                      const char = allCharacters.find(c => c.id === id);
                      return (
                        <span key={id} className="bg-gradient-to-r from-indigo-950/40 to-black/60 border border-indigo-500/30 text-[9px] font-black tracking-widest uppercase font-mono text-indigo-300 px-2 py-1 rounded shadow-inner">
                          {char ? char.name : id}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
     </div>
    </div>
  );
};
