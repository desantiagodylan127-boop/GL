import React, { useState } from 'react';
import { SaveState, Character, PlayerCharacterProgress, CampaignNodeReward } from '../types';
import { getAllCharacters } from '../data/characters';
import { Sliders, Search, Zap, Star, Shield, AlertTriangle, Play, ChevronLeft, Award, Swords } from 'lucide-react';

// Get farmable / category helpers
import { getCharacterFarmLocation } from './RosterView';

interface SquadSelectViewProps {
  saveState: SaveState;
  nodeName: string;
  enemies: string[];
  energyCost: number;
  powerRecommended?: number;
  rewards: CampaignNodeReward[];
  restrictTags?: string[]; // Faction restriction tags
  allowedCharacterIds?: string[]; // Era-specific allowed pool
  isMarquee?: boolean;
  marqueeCharId?: string;
  isJourney?: boolean;
  onLaunch: (playerIds: string[]) => void;
  onCancel: () => void;
}

export const SquadSelectView: React.FC<SquadSelectViewProps> = ({
  saveState,
  nodeName,
  enemies,
  energyCost,
  powerRecommended,
  rewards,
  restrictTags = [],
  allowedCharacterIds,
  isMarquee = false,
  marqueeCharId,
  isJourney = false,
  onLaunch,
  onCancel
}) => {
  const allCharacters = getAllCharacters().filter(c => !c.tags.includes('Summon'));
  const unlockedCharactersProgress = (Object.values(saveState.characters) as PlayerCharacterProgress[])
    .filter(c => c.unlocked);

  const maxJourneySquadSize = (isJourney && allowedCharacterIds && allowedCharacterIds.length > 0)
    ? Math.min(5, allowedCharacterIds.length)
    : 5;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [factionFilter, setFactionFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Groups of options for filter dropdown including Tag & Factions with clear separations
  const FILTER_GROUPS = [
    {
      label: 'General',
      options: [
        { value: 'All', label: 'All Eligible Characters' }
      ]
    },
    {
      label: 'Main Factions',
      options: [
        { value: 'Jedi', label: 'Jedi Order' },
        { value: 'Separatist', label: 'Separatists' },
        { value: 'Galactic Republic', label: 'Galactic Republic' },
        { value: 'Clone Trooper', label: 'Clone Troopers' },
        { value: 'Rebel', label: 'Rebel Alliance' },
        { value: 'Scoundrel', label: 'Scoundrels & Underworld' },
        { value: 'Empire', label: 'Galactic Empire' }
      ]
    },
    {
      label: 'Squad & Faction Tags',
      options: [
        { value: '501st', label: '501st Battalion' },
        { value: '212th', label: '212th Attack Battalion' },
        { value: 'Bad Batch', label: 'The Bad Batch' },
        { value: 'Jedi High Council', label: 'Jedi High Council' },
        { value: 'Separatist War Council', label: 'Separatist War Council' },
        { value: 'Inquisitorius', label: 'Inquisitorius' },
        { value: 'Honor Guard', label: 'Alderaanian Honor Guard' },
        { value: 'Hutt Cartel', label: 'Hutt Cartel' },
        { value: 'Mandalorian', label: 'Mandalorians' }
      ]
    }
  ];

  // Helper: check if a character matches the specific era
  function isCharacterInSelectedEra(c: Character, era: string): boolean {
    if (era === 'Clone Wars') {
      // Must be Clone Wars released unit: Seps, Galactic Republic, Clone Troopers, etc.
      return (
        c.faction === 'Separatist' ||
        c.faction === 'Galactic Republic' ||
        c.tags.includes('Clone Trooper') ||
        c.tags.includes('501st') ||
        c.tags.includes('212th') ||
        ['b1_battle_droid', 'b2_super_droid', 'magnaguard', 'droideka', 'crab_droid_boss', 'remnant_droids'].includes(c.id)
      );
    }
    if (era === 'Galactic Civil War') {
      // Rebels, Empire, Scoundrels
      return (
        c.faction === 'Rebel' ||
        c.faction === 'Empire' ||
        c.faction === 'Scoundrel' ||
        c.tags.includes('Rebel') ||
        c.tags.includes('Empire')
      );
    }
    return true; // Default allows all
  }

  // Handle auto-populations for Marquee trials test team
  React.useEffect(() => {
    if (isMarquee && marqueeCharId) {
      // Find the character's faction
      const mChar = allCharacters.find(c => c.id === marqueeCharId);
      
      let preset: string[] = [marqueeCharId];
      if (mChar) {
        // Ignore general role/system tags when matching theme mates
        const ignoreTags = [
          'Legacy (Farmable)', 'Attacker', 'Saboteur', 'Support', 'Strategist', 'Tank',
          'Leader', 'Galactic Legend', 'Journey Character', 'Era Unit', 'Marquee',
          'Event Exclusive', 'Founder', 'NPC', 'Raid Boss', 'Summon', 'Light Side', 'Dark Side'
        ].map(t => t.toLowerCase());

        const specificFactionTags = mChar.tags.filter(t => !ignoreTags.includes(t.toLowerCase()));

        // Find 4 other characters from the same specific faction tags or the same primary faction
        const squadMates = allCharacters.filter(c => 
          c.id !== marqueeCharId && 
          (
            c.faction === mChar.faction || 
            c.tags.some(t => specificFactionTags.includes(t))
          )
        ).slice(0, 4).map(c => c.id);
        
        preset = [...preset, ...squadMates];
      }

      // Fill with generic units aligned to side if we somehow don't have 5
      const generics = mChar?.alignment === 'light' 
        ? ['clone_trooper_212th', 'fives', 'captain_rex']
        : ['b2_super_droid', 'b1_battle_droid', 'stormtrooper'];
        
      while (preset.length < 5 && generics.length > 0) {
        const nextGen = generics.shift();
        if (nextGen && !preset.includes(nextGen)) {
          preset.push(nextGen);
        }
      }

      // Hard safety fallback
      while (preset.length < 5) {
        preset.push('stormtrooper');
      }

      setSelectedIds(preset);
    }
  }, [isMarquee, marqueeCharId]);

  // Filters candidates
  const eligibleCharacters = allCharacters.filter(c => {
    // 1. Must be unlocked in roster unless it's Marquee test trial
    const prog = saveState.characters[c.id];
    if (!isMarquee && (!prog || !prog.unlocked)) {
      return false;
    }

    // 2. Enforce Raid / Faction restriction tags
    if (restrictTags && restrictTags.length > 0) {
      const hasStrictFaction = restrictTags.some(recFaction => {
        const lowerFact = recFaction.toLowerCase().replace(/_/g, ' ');
        const matchesFaction = c.faction.toLowerCase().replace(/_/g, ' ').includes(lowerFact);
        const matchesTag = c.tags.some(t => t.toLowerCase().replace(/_/g, ' ').includes(lowerFact));
        return matchesFaction || matchesTag;
      });
      if (!hasStrictFaction) return false;
    }

    // 2.5 Era restriction
    if (allowedCharacterIds && allowedCharacterIds.length > 0) {
      if (!allowedCharacterIds.includes(c.id)) {
        // If it's a marquee and we're looking at the marquee char, always allow them
        if (isMarquee && c.id === marqueeCharId) return true;
        return false;
      }
    }

    // 3. Filter out Era Units from standard combat unless explicitly allowed via allowedCharacterIds
    if (!allowedCharacterIds && c.tags.includes('Era Unit')) {
      if (isMarquee && c.id === marqueeCharId) return true; // Except for themself in their marquee
      return false; 
    }

    // 4. apply search input term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = c.name.toLowerCase().includes(term);
      const matchFact = c.faction.toLowerCase().includes(term);
      const matchTag = c.tags.some(t => t.toLowerCase().includes(term));
      if (!matchName && !matchFact && !matchTag) return false;
    }

    // 5. apply dropdown select filter
    if (factionFilter !== 'All') {
      const fLower = factionFilter.toLowerCase();
      const matchFact = c.faction.toLowerCase().includes(fLower);
      const matchTag = c.tags.some(t => t.toLowerCase().includes(fLower));
      if (!matchFact && !matchTag) return false;
    }

    return true;
  });

  function toggleSelectCharacter(charId: string) {
    if (isMarquee) return; // Locked to marquee trial squad presets

    if (selectedIds.includes(charId)) {
      setSelectedIds(selectedIds.filter(id => id !== charId));
    } else {
      const maxSquadSize = (isJourney && allowedCharacterIds && allowedCharacterIds.length > 0)
        ? Math.min(5, allowedCharacterIds.length)
        : 5;
      if (selectedIds.length >= maxSquadSize) {
        alert(`Maximum squad size is ${maxSquadSize} character(s) for this battle!`);
        return;
      }
      setSelectedIds([...selectedIds, charId]);
    }
  }

  function handleDeploy() {
    if (selectedIds.length === 0) {
      alert("Please select at least 1 character before launching into combat!");
      return;
    }
    onLaunch(selectedIds);
  }

  return (
    <div className="bg-gradient-to-b from-zinc-950 to-black border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden font-sans" id="squad_selection_screen">
      <div className="absolute top-0 right-0 p-8 opacity-5 text-zinc-500 font-mono text-[9px]">
        COSMIC SQUAD ALLOCATIONS
      </div>

      {/* Screen Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-805 pb-5">
        <div className="flex items-center gap-3">
          <button 
            onClick={onCancel}
            className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl hover:bg-zinc-800 text-zinc-300 transition shrink-0"
            title="Go Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-orange-500 text-[9px] font-mono tracking-widest uppercase block">Deployment Setup</span>
            <h1 className="font-display font-black text-white text-2xl tracking-tight leading-none">Assemble Tactical Strike Force</h1>
          </div>
          {/* Load Saved Squads */}
          {!isMarquee && saveState.prebuiltSquads && Object.keys(saveState.prebuiltSquads).length > 0 && (
            <div className="ml-4 shrink-0">
              <select 
                onChange={(e) => {
                   if (!e.target.value) return;
                   const squadArr = saveState.prebuiltSquads?.[e.target.value];
                   if (squadArr) {
                      const validArr = squadArr.filter(id => {
                          if (restrictTags.length > 0) {
                              const charTest = allCharacters.find(hc => hc.id === id);
                              if (!charTest) return false;
                              return restrictTags.some(t => {
                                  const normalizedT = t.toLowerCase().replace(/_/g, ' ');
                                  const matchesFaction = charTest.faction.toLowerCase().replace(/_/g, ' ').includes(normalizedT);
                                  const matchesTag = charTest.tags.some(ct => ct.toLowerCase().replace(/_/g, ' ').includes(normalizedT));
                                  return matchesFaction || matchesTag;
                              });
                          }
                          return true;
                      });
                      setSelectedIds(validArr.slice(0, 5));
                   }
                   e.target.value = "";
                }}
                className="bg-black/60 text-yellow-500 border border-yellow-500/30 px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold tracking-widest cursor-pointer outline-none max-w-[150px] truncate"
              >
                <option value="">+ LOAD SQUAD</option>
                {Object.entries(saveState.prebuiltSquads || {}).map(([k, squad]) => (
                  <option key={k} value={k}>{k.startsWith('squad_') ? 'Custom Squad' : k} ({(squad as string[]).length})</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Selected target metadata summary */}
        <div className="bg-zinc-900/60 border border-zinc-810/80 px-4 py-2 rounded-2xl flex items-center gap-4 text-xs font-mono shrink-0">
          <div>
            <span className="text-zinc-[500] text-[9.5px] text-zinc-400 block pb-0.5">TARGET ENCOUNTER</span>
            <span className="text-white font-bold">{nodeName}</span>
          </div>
          <div className="h-6 w-px bg-zinc-800" />
          <div className="text-center">
            <span className="text-zinc-[400] text-[9.5px] block pb-0.5">ENERGY COST</span>
            <span className="text-emerald-400 font-black flex items-center justify-center gap-0.5">
              <Zap className="w-3.5 h-3.5 fill-current" /> {energyCost}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        {/* Enemy Preview Module */}
        <div className="bg-zinc-900 border border-red-900/40 p-4 rounded-3xl shrink-0">
          <div className="text-[10px] text-red-500 font-mono font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5" /> Enemy Contingent Preview
          </div>
          <div className="flex flex-wrap gap-2">
            {enemies.map((eId, idx) => {
              const charInfo = allCharacters.find(c => c.id === eId);
              
              let enemyLevel = 1;
              let enemyGear = 1;
              let enemyStars = 1;
              let enemyRelic = 0;

              // SquadSelectView does not have conquestConfig directly so difficulty is purely off powerRecommended or energyCost
              const difficultyRating = powerRecommended
                 ? (powerRecommended / 1000)
                 : (energyCost || 10);
              
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
                <div key={`${eId}-${idx}`} className="bg-black/50 border border-zinc-800 p-2 rounded-xl text-center w-[100px]">
                  <div className="text-[9px] uppercase font-mono text-zinc-500 truncate mb-1">{charInfo?.faction || 'Unknown'}</div>
                  <div className="text-[9px] font-bold text-red-200 leading-tight h-6 overflow-hidden">{charInfo?.name || eId}</div>
                  <div className="flex items-center justify-center gap-1.5 text-[8px] font-mono text-zinc-400 mt-1">
                    <span className="text-zinc-300">Lv.{enemyLevel}</span>
                    <span className="text-yellow-500">{enemyStars}⭐</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[8px] font-mono text-zinc-400 mt-0.5 min-h-[16px]">
                    <span className="text-blue-400">G{enemyGear}</span>
                    {enemyRelic > 0 && <span className="text-red-400 font-bold">R{enemyRelic}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Constraints Warning box */}
      {(restrictTags.length > 0 || isMarquee) && (
        <div className="bg-yellow-950/15 border border-yellow-500/25 p-4 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="text-yellow-400 uppercase tracking-widest text-[9.5px] block">Engagement Parameters Active</strong>
            {isMarquee ? (
              <p className="text-zinc-300 leading-relaxed">
                🤖 <strong className="text-yellow-400">Marquee Combat Trial</strong>: Pre-assigned maximum power elite squad loaded for simulation testing. (Your own units are bypassed).
              </p>
            ) : (
              <div className="text-zinc-300 space-y-1">
                {restrictTags.length > 0 && (
                  <p>• 🛡️ <strong className="text-yellow-400 font-bold">Faction Enforcement</strong>: Strike force units MUST belong to the following categories: <span className="bg-yellow-500/10 border border-yellow-500/30 font-mono text-yellow-300 px-2 py-0.5 rounded ml-1 font-bold">{restrictTags.join(', ')}</span></p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACTIVE SQUAD SELECT PREVIEW */}
      <div className="bg-black/40 border border-zinc-850 p-5 rounded-2xl space-y-3">
        <h3 className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">
          Selected Squad Line-up ({selectedIds.length} / {maxJourneySquadSize}) {isJourney && <span className="text-amber-500 font-bold ml-2 font-mono uppercase tracking-wider text-[9px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">LOCK ACTIVE</span>}
        </h3>
        
        <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${maxJourneySquadSize}, minmax(0, 1fr))` }}>
          {Array.from({ length: maxJourneySquadSize }, (_, i) => i).map(slotIdx => {
            const charId = selectedIds[slotIdx];
            const char = charId ? allCharacters.find(ch => ch.id === charId) : null;
            const prog = char ? saveState.characters[char.id] : null;

            return (
              <div 
                key={slotIdx} 
                onClick={() => charId && toggleSelectCharacter(charId)}
                className={`border p-3.5 rounded-xl text-center h-28 flex flex-col justify-between transition-all relative select-none ${
                  char 
                    ? 'bg-gradient-to-b from-zinc-900 to-black border-yellow-500/30 cursor-pointer hover:border-red-500/40 group' 
                    : 'bg-zinc-950/45 border-zinc-855 border-dashed text-zinc-650'
                }`}
              >
                {char ? (
                  <>
                    {slotIdx === 0 && (
                       <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[8px] font-black font-mono tracking-widest px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(234,179,8,0.5)] z-10 whitespace-nowrap">
                         👑 LEADER
                       </div>
                    )}
                    <span className="text-[8px] bg-yellow-500/10 border border-yellow-500/20 px-1 py-0.2 rounded text-yellow-400 font-mono uppercase tracking-widest block truncate">
                      {char.faction}
                    </span>
                    <div className="font-display font-semibold text-white text-xs truncate my-1 group-hover:text-red-400">{char.name}</div>
                    
                    <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 mt-1">
                      <span>Lv.{prog?.level || 85}</span>
                      <span className="text-yellow-500 font-bold flex items-center leading-none">
                        ★ {prog?.stars || 7}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-mono mt-0.5">
                      <span className="text-blue-400 font-bold">G{prog?.gearTier || 13}</span>
                      {((prog?.relicLevel || 9) > 0) && (
                        <span className="text-red-400 font-bold">R{prog?.relicLevel || 9}</span>
                      )}
                    </div>

                    {/* RED OVERLAY DELETE BUTTON */}
                    <div className="absolute inset-0 bg-red-950/90 border border-red-500/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150 z-20">
                      <span className="text-red-400 text-[10px] uppercase font-mono tracking-widest font-black">REMOVE</span>
                    </div>
                  </>
                ) : (
                  <div className="m-auto flex flex-col items-center gap-1">
                    <span className={`text-[10px] font-mono font-bold ${slotIdx === 0 ? 'text-yellow-500/80' : ''}`}>
                      {slotIdx === 0 ? '👑 LEADER SLOT' : `SLOT ${slotIdx + 1}`}
                    </span>
                    <span className="text-[8px] uppercase tracking-wide opacity-50 block">VACANT</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SQUAD CATALOG WITH FILTERS */}
      <div className="space-y-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Sliders className="w-4 h-4 text-zinc-405" />
            <input
              type="text"
              placeholder="Search Name, Tag, Faction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black text-white px-3 py-1.5 rounded-lg border border-zinc-800 text-xs font-mono placeholder-zinc-550 focus:outline-none focus:border-yellow-505 w-44"
              disabled={isMarquee}
            />

            <select 
              value={factionFilter}
              onChange={(e) => setFactionFilter(e.target.value)}
              className="bg-black text-white px-2 py-1.5 rounded-lg border border-zinc-800 text-xs font-mono"
              disabled={isMarquee}
            >
              {FILTER_GROUPS.map(gp => (
                <optgroup key={gp.label} label={gp.label} className="text-zinc-[400] bg-black font-sans font-bold">
                  {gp.options.map(opt => (
                    <option key={opt.value} value={opt.value} className="text-white">
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <span className="text-zinc-550 text-xs font-mono">{eligibleCharacters.length} CHARACTERS MATCHED</span>
        </div>

        {/* Available Character Cards Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-2.5 max-h-[350px] overflow-y-auto pr-1">
          {eligibleCharacters.map(char => {
            const prog = saveState.characters[char.id];
            const isPicked = selectedIds.includes(char.id);

            return (
              <div
                key={char.id}
                onClick={() => !isMarquee && toggleSelectCharacter(char.id)}
                className={`border p-2 sm:p-3 rounded-xl text-center flex flex-col justify-between h-24 relative transition-all ${
                  isMarquee 
                    ? 'border-zinc-850 bg-zinc-950/45'
                    : isPicked
                      ? 'bg-yellow-500/10 border-yellow-500/70 shadow-glow cursor-pointer scale-105'
                      : 'bg-black/50 border-zinc-850 hover:border-zinc-700 cursor-pointer'
                }`}
              >
                <span className="text-[7px] sm:text-[8px] uppercase tracking-widest font-mono text-zinc-500 truncate">{char.faction}</span>
                <div className="font-display font-medium text-white text-[10px] sm:text-xs mt-1 truncate">{char.name}</div>
                
                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 mt-2">
                  <span>M{prog?.gearTier || 1}</span>
                  <span className="text-yellow-500 font-bold flex items-center leading-none">
                    ★{prog?.stars || 7}
                  </span>
                </div>

                {/* PICKED CHECK EMBLEM */}
                {isPicked && !isMarquee && (
                  <div className="absolute top-1 right-1 bg-yellow-500 text-black font-bold p-0.5 rounded-full z-10 scale-90 text-[10px]">
                    ✓
                  </div>
                )}
              </div>
            );
          })}

          {eligibleCharacters.length === 0 && (
            <div className="col-span-full py-8 text-center text-zinc-500 bg-zinc-950/30 border border-dashed border-zinc-900 rounded-xl font-mono text-xs">
              ⚠️ NO ELIGIBLE ROSTER CHARACTERS TO MEET MATCHING RESTRICTIONS.
            </div>
          )}
        </div>
      </div>

      {/* LAUNCH OPERATIONAL ACTIONS BAR */}
      <div className="border-t border-zinc-850 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onCancel}
          className="text-zinc-450 hover:text-white text-xs font-mono uppercase tracking-widest transition"
        >
          Cancel & Return
        </button>

        <button
          onClick={handleDeploy}
          disabled={selectedIds.length === 0}
          className={`px-8 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs transition duration-200 shadow-lg flex items-center gap-2 cursor-pointer ${
            selectedIds.length > 0
              ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/10 hover:shadow-yellow-500/20 transform hover:-translate-y-0.5'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" /> Deploy Strike Force
        </button>
      </div>
    </div>
  );
};
