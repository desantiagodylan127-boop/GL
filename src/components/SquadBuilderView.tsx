import React, { useState } from 'react';
import { SaveState, PlayerCharacterProgress, Character } from '../types';
import { getAllCharacters } from '../data/characters';
import { SQUAD_RECOMMENDATIONS } from '../data/squadRecommendations';
import { getCharacterFarmLocation } from './RosterView';
import { Users, Plus, Trash2, CheckCircle2, Shield, Sword, Sparkles, BookOpen, Copy, Edit2, Play, Search, Check, X, Info } from 'lucide-react';
import { checkMissions } from '../utils/missionEngine';

interface SquadBuilderViewProps {
  saveState: SaveState;
  onUpdateState: (newState: SaveState) => void;
  onNavigateToFarm?: (targetTab: 'campaign' | 'journey' | 'shop' | 'events', targetId?: string) => void;
}

export const SquadBuilderView: React.FC<SquadBuilderViewProps> = ({
  saveState,
  onUpdateState,
  onNavigateToFarm
}) => {
  const allCharacters = getAllCharacters();
  const unlockedCharacters = (Object.values(saveState.characters) as PlayerCharacterProgress[])
    .filter(c => c.unlocked)
    .map(c => allCharacters.find(ch => ch.id === c.id)!)
    .filter(Boolean);

  const [activeTab, setActiveTab] = useState<'synergies' | 'blueprints'>('synergies');
  const [squadName, setSquadName] = useState('');
  const [selectedCharIds, setSelectedCharIds] = useState<string[]>([]);
  const [editingSquadKey, setEditingSquadKey] = useState<string | null>(null);
  const [showCreator, setShowCreator] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLoadedSquadKey, setActiveLoadedSquadKey] = useState<string | null>(null);

  const teams = (saveState.prebuiltSquads || {}) as Record<string, string[]>;

  // Sort SQUAD_RECOMMENDATIONS based on the number of owned units (descending)
  const sortedRecommendations = [...SQUAD_RECOMMENDATIONS].sort((a, b) => {
    const ownedA = a.members.filter(id => saveState.characters[id]?.unlocked).length;
    const ownedB = b.members.filter(id => saveState.characters[id]?.unlocked).length;
    
    // Primary sort: owned count (descending)
    if (ownedB !== ownedA) return ownedB - ownedA;
    // Secondary sort: alphabetical
    return a.name.localeCompare(b.name);
  });

  function toggleCharacter(id: string) {
    if (selectedCharIds.includes(id)) {
      setSelectedCharIds(selectedCharIds.filter(x => x !== id));
    } else {
      if (selectedCharIds.length >= 5) {
        alert("Tactical Limitation: A squad contains a maximum of 5 characters!");
        return;
      }
      setSelectedCharIds([...selectedCharIds, id]);
    }
  }

  function handleSaveSquad() {
    if (!squadName.trim()) {
      alert("Provide an identifier name for your blueprint!");
      return;
    }
    if (selectedCharIds.length === 0) {
      alert("Select at least one tactical unit!");
      return;
    }

    const copy = { ...saveState };
    if (!copy.prebuiltSquads) {
      copy.prebuiltSquads = {};
    }

    const key = editingSquadKey || squadName.trim();
    copy.prebuiltSquads[key] = [...selectedCharIds];

    if (copy.tutorialStep === 4) {
      copy.tutorialStep = 5;
    }
    
    copy.battleLog.push(`📁 Saved custom team blueprint: "${key}"`);
    onUpdateState(copy);

    // Reset and feedback
    setSquadName('');
    setSelectedCharIds([]);
    setEditingSquadKey(null);
    setShowCreator(false);
    alert(`Squad Blueprint "${key}" compiled successfully!`);
  }

  function handleCreateNew() {
    setSquadName('');
    setSelectedCharIds([]);
    setEditingSquadKey(null);
    setShowCreator(true);
  }

  function handleEditSquad(key: string) {
    const squad = teams[key];
    if (squad) {
      setSelectedCharIds([...squad]);
      setSquadName(key);
      setEditingSquadKey(key);
      setShowCreator(true);
      setActiveTab('blueprints');
    }
  }

  function handleDeleteSquad(key: string) {
    if (!confirm(`Are you sure you want to delete the "${key}" squad blueprint?`)) return;
    const copy = { ...saveState };
    if (copy.prebuiltSquads) {
      delete copy.prebuiltSquads[key];
      copy.battleLog.push(`📁 Dismantled squad: ${key}`);
      if (activeLoadedSquadKey === key) {
        setActiveLoadedSquadKey(null);
      }
      onUpdateState(copy);
    }
  }

  function handleDuplicateSquad(key: string) {
    const squad = teams[key];
    if (!squad) return;

    const copy = { ...saveState };
    if (!copy.prebuiltSquads) {
      copy.prebuiltSquads = {};
    }

    const newKey = `${key} - Copy`;
    copy.prebuiltSquads[newKey] = [...squad];
    copy.battleLog.push(`📁 Duplicated squad: "${newKey}"`);
    onUpdateState(copy);
    alert(`Duplicated blueprint as "${newKey}"`);
  }

  function handleLoadSquad(key: string, memberIds: string[]) {
    // Select the squad into the active battle comm-grid
    // We add visual confirmation
    setActiveLoadedSquadKey(key);
    
    const copy = { ...saveState };
    // Log the deployment action
    copy.battleLog.push(`⚡ Loaded tactical squad "${key}" into active deployment buffer!`);
    onUpdateState(copy);
    
    alert(`📁 Tactical Squad Loaded!\n\n"${key}" is now configured as your primary squad layout. When you start any Campaign node, Event, or Raid, look for the "+ LOAD SQUAD" dropdown in deployment to instantly recall this team!`);
  }

  function calculateSquadPower(memberIds: string[]) {
    let sum = 0;
    for (const id of memberIds) {
      const char = allCharacters.find(ch => ch.id === id);
      const prog = saveState.characters[id];
      if (char && prog && prog.unlocked) {
        // Power calculation matching RosterView
        const gTier = prog.gearTier || 1;
        const rLvl = prog.relicLevel || 0;
        const power = (prog.level || 1) * 150 + (prog.stars || 0) * 800 + gTier * 1200 + rLvl * 2500 + (prog.legendLevel || 0) * 4000 + (prog.eraLevel || 0) * 100;
        sum += power;
      }
    }
    return sum;
  }

  return (
    <div className="space-y-6 animate-fadeIn" id="squad_builder_dashboard">
      
      {/* Tab Navigation & Create button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-px">
        <div className="flex gap-2">
          <button
            onClick={() => { setActiveTab('synergies'); setShowCreator(false); }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest border-b-2 transition ${activeTab === 'synergies' && !showCreator ? 'border-amber-500 text-amber-400 glow-neon' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            Synergistic Formations ({SQUAD_RECOMMENDATIONS.length})
          </button>
          <button
            onClick={() => { setActiveTab('blueprints'); }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest border-b-2 transition ${activeTab === 'blueprints' && !showCreator ? 'border-amber-500 text-amber-400 glow-neon' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            Custom Blueprints ({Object.keys(teams).length})
          </button>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition flex items-center gap-1.5 shadow-glow select-none"
        >
          <Plus className="w-4 h-4" /> Create Custom Blueprint
        </button>
      </div>

      {/* active loaded notification banner */}
      {activeLoadedSquadKey && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between text-xs font-mono text-emerald-400 shadow-inner animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ACTIVE SQUAD LOADED: <strong className="text-white">"{activeLoadedSquadKey}"</strong> is primed in the battle comm-grid!</span>
          </div>
          <button onClick={() => setActiveLoadedSquadKey(null)} className="text-emerald-500/50 hover:text-white font-bold px-1 text-sm">×</button>
        </div>
      )}

      {/* SQUAD COMPOSER EDITOR (ShowCreator) */}
      {showCreator && (
        <div className="holo-panel border-cyan-500/30 p-6 rounded-3xl space-y-6 relative overflow-hidden box-glow animate-fadeIn">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none"></div>
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h3 className="font-display font-black text-white text-lg tracking-wider uppercase flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              {editingSquadKey ? `Edit Blueprint: ${editingSquadKey}` : 'Compile New Strategic Blueprint'}
            </h3>
            <button
              onClick={() => setShowCreator(false)}
              className="text-zinc-500 hover:text-white transition font-bold font-mono text-xs uppercase bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg"
            >
              Cancel
            </button>
          </div>

          {/* Name Input */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold">Blueprint Identifier Name</label>
              <input
                type="text"
                value={squadName}
                disabled={!!editingSquadKey}
                onChange={(e) => setSquadName(e.target.value)}
                placeholder="e.g. Imperial Remnant Frost Force, Ultimate Clone Assault"
                className="w-full bg-black/60 border border-zinc-800 focus:border-cyan-500/50 rounded-xl p-3 text-white text-xs font-mono outline-none transition"
              />
            </div>
            <button
              onClick={handleSaveSquad}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-black py-3 px-6 rounded-xl uppercase tracking-widest transition shadow-glow select-none w-full"
            >
              {editingSquadKey ? 'Save Changes' : 'Compile Blueprint'}
            </button>
          </div>

          {/* Blueprint Slots */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">Synergy Draft Slots ({selectedCharIds.length}/5)</h4>
            {selectedCharIds.length === 0 ? (
              <div className="border border-dashed border-zinc-800 bg-black/40 p-6 rounded-2xl text-center text-xs text-zinc-500 italic font-mono">
                Blueprint contains no tactical units. Toggle characters from your unlocked list below to draft!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {selectedCharIds.map(id => {
                  const char = allCharacters.find(c => c.id === id);
                  if (!char) return null;
                  return (
                    <div key={id} className="bg-zinc-950/60 border border-cyan-500/30 p-2.5 rounded-2xl relative flex flex-col items-center text-center shadow-inner group">
                      <button
                        onClick={() => toggleCharacter(id)}
                        className="absolute top-1 right-1.5 text-zinc-500 hover:text-red-400 transition font-bold font-mono text-xs leading-none"
                      >
                        ×
                      </button>
                      <span className="text-[7px] uppercase font-mono font-bold tracking-widest text-cyan-500/60 truncate w-full">{char.faction}</span>
                      <h5 className="font-display font-black text-white text-[10px] truncate w-full mt-1">{char.name}</h5>
                      <span className="text-[7px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-1 py-0.5 rounded uppercase font-mono font-bold tracking-widest w-full mt-2 truncate">
                        {char.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Draft Selection */}
          <div className="space-y-3 pt-4 border-t border-zinc-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold">Draft Eligible Officers (Unlocked):</h4>
              <div className="relative w-full sm:w-56">
                <Search className="w-3 h-3 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter officers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/60 border border-zinc-800 focus:border-cyan-500/40 text-white pl-8 pr-3 py-1.5 rounded-lg text-[10px] font-mono focus:outline-none w-full"
                />
              </div>
            </div>

            {unlockedCharacters.length === 0 ? (
              <p className="text-zinc-600 text-xs italic font-mono pl-1">All officers are locked. Acquire shards in Campaign nodes or Store to draft officers.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 text-xs max-h-[160px] overflow-y-auto pr-2 scrollbar-thin">
                {unlockedCharacters
                  .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(char => {
                    const isSelected = selectedCharIds.includes(char.id);
                    return (
                      <button
                        key={char.id}
                        onClick={() => toggleCharacter(char.id)}
                        className={`p-2.5 rounded-xl border text-left transition relative overflow-hidden group font-mono ${
                          isSelected
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400 shadow-inner'
                            : 'bg-black/40 border-zinc-800/80 hover:border-cyan-500/20 hover:bg-zinc-950/20 text-zinc-300'
                        }`}
                      >
                        <div className="font-bold text-[10px] truncate">{char.name}</div>
                        <div className="text-[7.5px] mt-1 uppercase flex justify-between gap-1 items-center">
                          <span className="text-zinc-500 truncate">{char.faction}</span>
                          <span className="bg-zinc-900 px-1 py-0.5 rounded font-black shrink-0">Lv {saveState.characters[char.id].level}</span>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SYNERGISTIC RECOMMENDED SQUADS TAB */}
      {activeTab === 'synergies' && !showCreator && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedRecommendations.map(rec => {
            const ownedIds = rec.members.filter(id => saveState.characters[id]?.unlocked);
            const missingIds = rec.members.filter(id => !saveState.characters[id]?.unlocked);
            const percentage = Math.round((ownedIds.length / rec.members.length) * 100);
            const combinedPower = calculateSquadPower(rec.members);

            return (
              <div
                key={rec.id}
                className="bg-black/40 border border-zinc-800/80 hover:border-amber-500/30 rounded-2xl p-5 flex flex-col justify-between hover:bg-zinc-950/10 transition relative group shadow-inner"
              >
                <div className="space-y-4">
                  {/* Header metadata */}
                  <div className="flex justify-between items-start border-b border-zinc-900 pb-3 gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-widest leading-none">
                          {rec.faction}
                        </span>
                        <span className={`text-[8px] font-bold font-mono uppercase tracking-widest leading-none px-2 py-0.5 rounded border ${
                          rec.difficulty === 'Beginner' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                          rec.difficulty === 'Intermediate' ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' :
                          rec.difficulty === 'Advanced' ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' :
                          'text-rose-400 border-rose-500/30 bg-rose-500/10'
                        }`}>
                          {rec.difficulty}
                        </span>
                      </div>
                      <h3 className="text-base font-display font-black text-white uppercase tracking-wider mt-1.5">{rec.name}</h3>
                      <p className="text-[8.5px] text-zinc-500 font-mono uppercase tracking-widest font-semibold mt-0.5">{rec.role}</p>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Roster Collect</span>
                      <div className="flex items-center gap-2 mt-1 justify-end">
                        <div className="w-14 h-1.5 bg-black rounded border border-zinc-900 overflow-hidden shadow-inner hidden sm:block">
                          <div className="h-full bg-amber-500 box-glow-amber opacity-85 transition-all" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className={`text-xs font-mono font-bold ${percentage === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {ownedIds.length}/{rec.members.length}
                        </span>
                      </div>
                      <div className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider mt-1">
                        Power: {combinedPower.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-xs leading-relaxed">{rec.description}</p>

                  {/* Members Layout */}
                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {rec.members.map(memberId => {
                      const char = allCharacters.find(c => c.id === memberId);
                      const isOwned = saveState.characters[memberId]?.unlocked;
                      const prog = saveState.characters[memberId];

                      if (!char) return null;

                      return (
                        <div
                          key={memberId}
                          onClick={() => {
                            if (!isOwned) {
                              const loc = getCharacterFarmLocation(memberId);
                              alert(`TARGET DETAILS: ${char.name}\n\nFarming coordinates:\n${loc.locationName}`);
                              if (onNavigateToFarm) {
                                if (loc.type === 'event') return;
                                onNavigateToFarm(loc.type as any, loc.journeyId || loc.nodeId);
                              }
                            }
                          }}
                          className={`relative flex flex-col items-center p-2 rounded-xl border text-center transition ${
                            isOwned
                              ? 'bg-emerald-950/15 border-emerald-500/20 hover:border-emerald-500/40'
                              : 'bg-black/70 border-rose-950/30 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 cursor-pointer'
                          }`}
                        >
                          {!isOwned && (
                            <span className="absolute top-1 right-1.5 text-[6.5px] font-mono font-black text-rose-500 select-none">LOCK</span>
                          )}
                          <span className={`text-[6px] uppercase font-mono font-bold tracking-widest truncate w-full ${isOwned ? 'text-emerald-500/60' : 'text-rose-500/60'}`}>{char.faction}</span>
                          <h5 className={`font-display font-bold text-[9px] truncate w-full mt-1 ${isOwned ? 'text-white' : 'text-zinc-500'}`} title={char.name}>{char.name}</h5>
                          {isOwned && prog && (
                            <div className="text-[7px] text-zinc-400 font-mono mt-1 shrink-0 bg-black/40 px-1 rounded uppercase tracking-wider">
                              L{prog.level} ★{prog.stars}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-900 flex justify-between items-center gap-3">
                  <button
                    onClick={() => {
                      const copy = { ...saveState };
                      if (!copy.prebuiltSquads) copy.prebuiltSquads = {};
                      copy.prebuiltSquads[rec.name] = [...rec.members];
                      copy.battleLog.push(`📁 Saved recommended blueprint: "${rec.name}"`);
                      onUpdateState(copy);
                      alert(`Saved recommended squad "${rec.name}" as custom blueprint!`);
                    }}
                    className="bg-zinc-900 border border-zinc-800 hover:border-amber-500/30 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest transition"
                  >
                    Compile Blueprint
                  </button>
                  <button
                    onClick={() => handleLoadSquad(rec.name, rec.members)}
                    className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 px-4 py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-widest transition shadow-glow flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" /> Load Squad
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CUSTOM BLUEPRINTS TAB */}
      {activeTab === 'blueprints' && !showCreator && (
        <div className="space-y-4">
          {Object.keys(teams).length === 0 ? (
            <div className="holo-panel p-12 rounded-3xl text-center border-dashed border-2 border-zinc-800/80 bg-black/20 flex flex-col items-center justify-center">
              <Users className="w-12 h-12 text-zinc-700 mb-4 opacity-50" />
              <h3 className="font-display font-black text-zinc-400 uppercase tracking-widest mb-1.5 text-sm">No Custom Blueprints Found</h3>
              <p className="text-zinc-600 font-mono text-xs max-w-sm leading-relaxed uppercase tracking-wide">
                You have not saved any custom blueprints. Click "Create Custom Blueprint" at the top to draft your custom synergy team!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(teams).map(([key, ids]) => {
                const combinedPower = calculateSquadPower(ids);
                return (
                  <div
                    key={key}
                    className="bg-black/40 border border-zinc-800 hover:border-cyan-500/30 p-5 rounded-2xl flex flex-col justify-between hover:bg-zinc-950/10 transition relative group shadow-inner"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2.5 border-b border-zinc-900 gap-4">
                        <div>
                          <h4 className="font-display font-black text-white text-base tracking-wide uppercase truncate max-w-[200px]" title={key}>{key}</h4>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Blueprint Synergies</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">Combined Power</span>
                          <strong className="text-xs font-mono text-cyan-400 glow-neon block">{combinedPower.toLocaleString()}</strong>
                        </div>
                      </div>

                      {/* Members */}
                      <div className="flex flex-wrap gap-1.5">
                        {ids.map(id => {
                          const char = allCharacters.find(c => c.id === id);
                          return (
                            <span
                              key={id}
                              className="bg-zinc-950/80 border border-zinc-800 text-[8.5px] font-mono font-bold tracking-wider uppercase text-zinc-300 px-2.5 py-1 rounded-xl shadow-inner inline-block"
                            >
                              {char ? char.name : id}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-zinc-900 flex justify-between items-center gap-2">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleEditSquad(key)}
                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 rounded-lg transition"
                          title="Edit Blueprint"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicateSquad(key)}
                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 rounded-lg transition"
                          title="Duplicate Blueprint"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSquad(key)}
                          className="p-1.5 text-rose-500 hover:text-rose-400 bg-rose-950/15 hover:bg-rose-950/30 border border-rose-950/20 rounded-lg transition"
                          title="Dismantle Blueprint"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleLoadSquad(key, ids)}
                        className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-widest transition shadow-glow flex items-center gap-1 select-none"
                      >
                        <Play className="w-3 h-3 fill-current" /> Deploy Blueprint
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
