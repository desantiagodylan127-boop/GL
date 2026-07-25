import React, { useState } from 'react';
import { SaveState, Character, PlayerCharacterProgress } from '../types';
import { getAllCharacters } from '../data/characters';
import { CAMPAIGN_NODES } from '../data/campaign';
import { getGearPiece } from '../data/gear';
import { checkMissions } from '../utils/missionEngine';
import { calculateDisplayStats } from '../utils/combatEngine';
import { 
  Shield, Layers, Star, Plus, Sword, Flame, ChevronRight, HelpCircle, AlertCircle, Sparkles, Sliders, Zap, Grid, Award, Book, Clock, Scan, Lock, Settings, Globe, Search, RefreshCw, X, SlidersHorizontal, BookOpen, ChevronDown, Check, Info
} from 'lucide-react';

import { SquadBuilderView } from './SquadBuilderView';
import { MaterialsInventoryView } from './MaterialsInventoryView';
import { MissionsView } from './MissionsView';
import { OnlinePanel } from './OnlinePanel';

export function getCharacterFarmLocation(charId: string): { type: 'campaign' | 'journey' | 'event'; locationName: string; nodeId?: string; journeyId?: string } {
  // Journey units cannot be bought or farmed (found only in their journey)
  if ([
    'master_kenobi', 'gl_leia', 'general_skywalker', 'admiral_trench', 'starkiller',
    'director_krennic', 'admiral_raddus', 'maul_mandalore', 'plo_koon_journey',
    'chancellor_palpatine_journey', 'general_skywalker', 'grand_inquisitor',
    'thrawn_remnant', 'old_ben', 'boba_fett_daimyo', 'general_kenobi_rep',
    'general_grievous_droid', 'eternal_fire_grievous', 'jabba', 'lord_vader', 'mace_windu',
    'rey_gl', 'luke_skywalker_gl', 'gl_darth_sidious', 'emperor_palpatine', 'darth_vader',
    'the_mandalorian'
  ].includes(charId)) {
    return { type: 'journey', locationName: 'Legendary Journey Guide', journeyId: charId };
  }
  
  // Clone Era 501st / Elites are event only
  const eraEventExclusives = [
    'captain_rex', 'echo_501st', 'fives', 'jesse', 'appo_501st',
    'bx_commando_droid', 'kelhani', 'droideka', 'spider_droid', 'magna_guard_elite',
    'crab_droid', 'din_djarin', 'magna_guard_remnant', 'raid_boss_1', 'cartel_enforcer'
  ];
  if (eraEventExclusives.includes(charId)) {
    return { type: 'event', locationName: 'Marquee / Era Events Only' };
  }

  // Find character in CAMPAIGN_NODES
  const foundNode = CAMPAIGN_NODES.find(n => n.rewards.some(r => r.itemId === `shards_${charId}`));
  if (foundNode) {
    return { 
      type: 'campaign', 
      locationName: `${foundNode.planet} - ${foundNode.sector} (${foundNode.difficulty})`, 
      nodeId: foundNode.id 
    };
  }
  
  return { type: 'campaign', locationName: 'Sovereign Campaign Maps', nodeId: CAMPAIGN_NODES[0]?.id };
}

interface RosterViewProps {
  saveState: SaveState;
  onUpdateState: (newState: SaveState) => void;
  onNavigateToFarm?: (targetTab: 'campaign' | 'journey' | 'shop' | 'events', targetId?: string) => void;
}

export const RosterView: React.FC<RosterViewProps> = ({
  saveState,
  onUpdateState,
  onNavigateToFarm
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'database' | 'squads' | 'inventory' | 'missions' | 'holonet'>('database');
  const allCharacters = getAllCharacters().filter(c => !c.isSummon && !c.tags.includes('Era Unit'));
  
  // Selected character state
  const [selectedCharId, setSelectedCharId] = useState<string | null>(allCharacters[0]?.id || null);
  const [showLore, setShowLore] = useState<boolean>(false);
  const [selectedDetailTab, setSelectedDetailTab] = useState<'directives' | 'gear' | 'relic' | 'shards'>('directives');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('power');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  
  // Selected attributes for multi-attribute filtering
  const [selectedFactions, setSelectedFactions] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const ROLE_OPTIONS = [
    'Leader', 'Attacker', 'Support', 'Tank', 'Saboteur', 'Strategist', 'Droid', 'Galactic Legend'
  ];

  const STATUS_OPTIONS = [
    'Owned', 'Unowned', 'Upgradeable'
  ];

  // Dynamically derive all faction options from our character registry to ensure 100% coverage
  const FACTION_OPTIONS = React.useMemo(() => {
    const list = new Set<string>();
    allCharacters.forEach(c => {
      if (c.faction) list.add(c.faction);
      c.tags.forEach(t => {
        // Exclude system tags, roles, statuses and alignments
        const exclude = [
          'light side', 'dark side', 'neutral', 'leader', 'attacker', 'support', 'tank', 'saboteur', 'strategist',
          'droid', 'galactic legend', 'journey character', 'era unit', 'npc', 'summon', 'event exclusive',
          'unlocked', 'locked', 'upgradeable', 'owned', 'unowned', 'founder', 'marquee', 'legacy (farmable)'
        ];
        if (!exclude.includes(t.toLowerCase())) {
          list.add(t);
        }
      });
    });
    return Array.from(list).sort((a, b) => a.localeCompare(b));
  }, [allCharacters]);

  function getShardsNeededForStar(starsNum: number): number {
    if (starsNum === 1) return 10;
    if (starsNum === 2) return 15;
    if (starsNum === 3) return 25;
    if (starsNum === 4) return 30;
    if (starsNum === 5) return 65;
    if (starsNum === 6) return 85;
    if (starsNum === 7) return 100;
    return 0;
  }

  // Calculate character power
  function calculateCharPower(char: Character, progress: PlayerCharacterProgress | undefined): number {
    if (!progress || !progress.unlocked) return 0;
    
    let gTier = progress.gearTier || 1;
    let rLvl = progress.relicLevel || 0;
    
    if (char.releaseState === 'era') {
      const eraLevel = progress.eraLevel || 1;
      if (eraLevel <= 10) { gTier = 1; rLvl = 0; }
      else if (eraLevel <= 25) { gTier = 3; rLvl = 0; }
      else if (eraLevel <= 50) { gTier = 5; rLvl = 0; }
      else if (eraLevel <= 75) { gTier = 7; rLvl = 0; }
      else if (eraLevel <= 100) { gTier = 9; rLvl = 0; }
      else if (eraLevel <= 125) { gTier = 13; rLvl = 1; }
      else if (eraLevel <= 150) { gTier = 13; rLvl = 3; }
      else if (eraLevel <= 175) { gTier = 13; rLvl = 5; }
      else { gTier = 13; rLvl = 7; }
    }

    return (
      (progress.level || 1) * 150 +
      (progress.stars || 0) * 800 +
      gTier * 1200 +
      rLvl * 2500 +
      (progress.legendLevel || 0) * 4000 +
      (progress.eraLevel || 0) * 100
    );
  }

  // Check if character is upgradeable
  function isCharacterUpgradeable(char: Character, prog: PlayerCharacterProgress | undefined): boolean {
    const shards = saveState.inventory[`shards_${char.id}`] || 0;
    const isSpecial = char.tags.includes('Galactic Legend') || char.tags.includes('Journey Character');
    const reqShards = isSpecial ? 330 : 10;
    
    if (!prog || !prog.unlocked) {
      return shards >= reqShards;
    }

    // Level up available
    if (prog.level < 85 && saveState.credits >= prog.level * 150) {
      return true;
    }

    // Star Promote available
    if (prog.stars < 7) {
      const nextStar = prog.stars + 1;
      const shardsNeeded = getShardsNeededForStar(nextStar);
      if (shards >= shardsNeeded) {
        return true;
      }
    }

    // Gear slots equipable
    if (char.releaseState !== 'era' && prog.gearTier < 13) {
      for (let s = 0; s < 6; s++) {
        if (!prog.gearSlots[s]) {
          const piece = getGearPiece(prog.gearTier, s);
          const reqCount = prog.gearTier < 5 ? 2 : prog.gearTier < 9 ? 3 : 5;
          if ((saveState.inventory[piece.id] || 0) >= reqCount) {
            return true;
          }
        }
      }
    }

    // Gear Tier promotion available
    if (char.releaseState !== 'era' && prog.gearTier < 13 && prog.gearSlots.every(s => s === true)) {
      return true;
    }

    // Relic forge available
    if (char.releaseState !== 'era' && prog.gearTier >= 13 && prog.stars === 7 && (prog.relicLevel || 0) < 10) {
      const reqs = getRelicReqsForLevel(prog.relicLevel || 0);
      const hasRelicMaterials = reqs.every(r => (saveState.inventory[r.key] || 0) >= r.count);
      if (hasRelicMaterials) {
        return true;
      }
    }

    // Legend resonance spark available
    if (char.tags.includes('Galactic Legend') && (prog.legendLevel || 0) < 10 && (saveState.inventory['legend_shard'] || 0) >= 2) {
      return true;
    }

    // Era unit tune available
    if (char.releaseState === 'era' && (prog.eraLevel || 1) < 200) {
      const cost = Math.floor(10 + Math.pow(prog.eraLevel || 1, 1.25));
      if ((saveState.inventory['era_currency'] || 0) >= cost) {
        return true;
      }
    }

    return false;
  }

  // Helper for relic materials cost
  function getRelicReqsForLevel(level: number) {
    const reqs: { key: string, name: string, count: number }[] = [];
    if (level < 10) {
      reqs.push({ key: 'carbonite_matrix', name: 'Carbonite Matrix', count: Math.max(10, level * 10) });
    }
    if (level >= 2) {
      reqs.push({ key: 'hyper_alloy', name: 'Hyper Alloy', count: Math.max(10, (level - 1) * 10) });
    }
    if (level >= 4) {
      reqs.push({ key: 'beskar_alloy', name: 'Beskar Alloy', count: Math.max(10, (level - 3) * 10) });
    }
    if (level >= 6) {
      reqs.push({ key: 'kyber_crystals', name: 'Kyber Crystals', count: Math.max(10, (level - 5) * 10) });
    }
    if (level >= 7) {
      reqs.push({ key: 'ancient_jedi_texts', name: 'Ancient Jedi Texts', count: (level - 6) * 10 });
    }
    if (level >= 8) {
      reqs.push({ key: 'imperial_command_circuits', name: 'Imperial Command Circuits', count: (level - 7) * 5 });
    }
    if (level >= 9) {
      reqs.push({ key: 'clone_combat_data', name: 'Clone Combat Data', count: 5 });
      reqs.push({ key: 'dark_matter_core', name: 'Dark Matter Core', count: 5 });
    }
    return reqs;
  }

  // Compute Total Galactic Collection Power
  const ownedChars = allCharacters.filter(c => saveState.characters[c.id]?.unlocked);
  const totalGP = ownedChars.reduce((sum, c) => sum + calculateCharPower(c, saveState.characters[c.id]), 0);

  // Multi-attribute filtering logic
  const filteredChars = allCharacters.filter(char => {
    const prog = saveState.characters[char.id];

    // Search term check
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = char.name.toLowerCase().includes(term);
      const matchFaction = char.faction?.toLowerCase().includes(term) || false;
      const matchTags = char.tags.some(t => t.toLowerCase().includes(term));
      const matchRole = char.role.toLowerCase().includes(term);
      if (!matchName && !matchFaction && !matchTags && !matchRole) {
        return false;
      }
    }

    // 1. Faction filters (Satisfy ALL active factions - AND logic)
    for (const faction of selectedFactions) {
      const filterLower = faction.toLowerCase();
      let factionMatch = char.faction?.toLowerCase().includes(filterLower) || char.tags.some(t => t.toLowerCase().includes(filterLower));
      
      if (filterLower === 'clone trooper') {
        factionMatch = char.faction?.toLowerCase().includes('clone') || char.tags.some(t => t.toLowerCase().includes('clone') || t.toLowerCase().includes('501st') || t.toLowerCase().includes('212th') || t.toLowerCase().includes('bad batch'));
      } else if (filterLower === 'droid') {
        factionMatch = char.faction?.toLowerCase().includes('droid') || char.tags.some(t => t.toLowerCase().includes('droid') || t.toLowerCase().includes('elite'));
      } else if (filterLower === 'jedi high council') {
        factionMatch = char.tags.some(t => t.toLowerCase().includes('council') || t.toLowerCase().includes('high council') || t.toLowerCase().includes('jedi council'));
      } else if (filterLower === 'separatist war council') {
        factionMatch = char.tags.some(t => t.toLowerCase().includes('war council') || t.toLowerCase().includes('separatist council') || t.toLowerCase().includes('war_council'));
      } else if (filterLower === 'rebel' || filterLower === 'rebel alliance') {
        factionMatch = char.faction?.toLowerCase() === 'rebel' || char.faction?.toLowerCase().includes('rebel') || char.tags.some(t => t.toLowerCase().includes('rebel'));
      } else if (filterLower === 'empire' || filterLower === 'galactic empire') {
        factionMatch = char.faction?.toLowerCase() === 'empire' || char.faction?.toLowerCase().includes('empire') || char.tags.some(t => t.toLowerCase().includes('empire'));
      }

      if (!factionMatch) return false;
    }

    // 2. Role filters (Satisfy ALL active roles)
    for (const role of selectedRoles) {
      const roleLower = role.toLowerCase();
      const roleMatch = char.role.toLowerCase().includes(roleLower) || char.tags.some(t => t.toLowerCase().includes(roleLower));
      if (!roleMatch) return false;
    }

    // 3. Status filters (Satisfy ALL active statuses)
    for (const status of selectedStatuses) {
      if (status === 'Owned' || status === 'Unlocked') {
        if (!prog?.unlocked) return false;
      } else if (status === 'Unowned' || status === 'Locked') {
        if (prog?.unlocked) return false;
      } else if (status === 'Upgradeable') {
        if (!isCharacterUpgradeable(char, prog)) return false;
      }
    }

    // Hide Galactic Legends and Grand Marquees from roster if fully locked & no shards
    const eraSpecial = [
      'coleman_kcaj', 'oppo_rancisis', 'adi_gallia', 'luminara_unduli', 'yaddle',
      'nute_gunray', 'dooku_war_council', 'wat_tambor', 'lott_dod', 'whorm_loathsom',
      'master_kenobi', 'eternal_fire_grievous', 'grand_admiral_trench', 'general_skywalker'
    ];
    if (eraSpecial.includes(char.id)) {
       const shards = saveState.inventory[`shards_${char.id}`] || 0;
       if (!prog?.unlocked && shards === 0) {
          return false;
       }
    }

    return true;
  });

  // Sort logic
  const sortedChars = [...filteredChars].sort((a, b) => {
    const progA = saveState.characters[a.id];
    const progB = saveState.characters[b.id];

    const shardsA = saveState.inventory[`shards_${a.id}`] || 0;
    const shardsB = saveState.inventory[`shards_${b.id}`] || 0;
    const reqA = (a.tags.includes('Galactic Legend') || a.tags.includes('Journey Character')) ? 330 : 10;
    const reqB = (b.tags.includes('Galactic Legend') || b.tags.includes('Journey Character')) ? 330 : 10;
    const canUnlockA = !progA?.unlocked && shardsA >= reqA;
    const canUnlockB = !progB?.unlocked && shardsB >= reqB;

    // Group priority: 1) Unlocked, 2) Can Unlock, 3) Locked
    const groupA = progA?.unlocked ? 1 : (canUnlockA ? 2 : 3);
    const groupB = progB?.unlocked ? 1 : (canUnlockB ? 2 : 3);

    if (groupA !== groupB) {
      return groupA - groupB;
    }

    if (sortBy === 'power') {
      return calculateCharPower(b, progB) - calculateCharPower(a, progA);
    }
    if (sortBy === 'level') {
      return (progB?.unlocked ? progB.level : 0) - (progA?.unlocked ? progA.level : 0);
    }
    if (sortBy === 'star') {
      return (progB?.unlocked ? progB.stars : 0) - (progA?.unlocked ? progA.stars : 0);
    }
    return a.name.localeCompare(b.name);
  });

  // Active Selected Character Dossier
  const selectedChar = allCharacters.find(c => c.id === selectedCharId) || allCharacters[0];
  const realProg = selectedChar ? saveState.characters[selectedChar.id] : null;
  const selectedProg = selectedChar ? (realProg || { id: selectedChar.id, unlocked: false, level: 1, stars: 0, gearTier: 1, gearSlots: [false, false, false, false, false, false], relicLevel: 0, legendLevel: 0, abilityLevels: {}, eraLevel: 1 }) : null;

  // --- Dynamic action callbacks ---
  function handleUnlock(charId: string) {
    const char = allCharacters.find(c => c.id === charId);
    if (!char) return;
    const stateCopy = { ...saveState };
    const shardKey = `shards_${charId}`;
    const ownedShards = stateCopy.inventory[shardKey] || 0;
    const requiredShards = (char.tags.includes('Galactic Legend') || char.tags.includes('Journey Character')) ? 330 : 10;

    if (ownedShards < requiredShards) {
      alert(`Access Denied: Unlocking requires ${requiredShards} shards. You have ${ownedShards}.`);
      return;
    }

    const cost = 25000;
    if (stateCopy.credits < cost) {
      alert(`Insufficient Credits: Unlocking requires 25,000 credits.`);
      return;
    }

    const unlockedStars = (char.tags.includes('Galactic Legend') || char.tags.includes('Journey Character')) ? 7 : 1;

    stateCopy.credits -= cost;
    stateCopy.inventory[shardKey] -= requiredShards;
    stateCopy.characters[charId] = {
      id: charId,
      unlocked: true,
      level: 1,
      stars: unlockedStars,
      gearTier: 1,
      gearSlots: [false, false, false, false, false, false],
      relicLevel: 0,
      legendLevel: 0,
      abilityLevels: {},
      eraLevel: 1
    };

    onUpdateState(checkMissions(stateCopy, 'recruit_character', 1));
    setSelectedCharId(charId);
  }

  function handleLevelUp() {
    if (!selectedChar || !selectedProg) return;
    const stateCopy = { ...saveState };
    const prog = stateCopy.characters[selectedChar.id];

    if (!prog || !prog.unlocked) {
      alert("Unlock character first!");
      return;
    }
    if (prog.level >= 85) return;

    const cost = prog.level * 150;
    if (stateCopy.credits < cost) {
      alert("Insufficient credits to level up.");
      return;
    }

    stateCopy.credits -= cost;
    prog.level += 1;

    if (stateCopy.tutorialStep === 5) {
      stateCopy.tutorialStep = 6;
    }

    onUpdateState(checkMissions(stateCopy, 'character_upgraded', 1));
  }

  function handleStarUpByCheat() {
    if (!selectedChar || !selectedProg) return;
    const stateCopy = { ...saveState };
    const prog = stateCopy.characters[selectedChar.id];

    if (!prog || !prog.unlocked) {
      alert("Unlock character first!");
      return;
    }
    if (prog.stars >= 7) return;

    const nextStar = prog.stars + 1;
    const shardKey = `shards_${selectedChar.id}`;
    const ownedShards = stateCopy.inventory[shardKey] || 0;
    const requiredShards = getShardsNeededForStar(nextStar);

    if (ownedShards < requiredShards) {
      alert(`Insufficient Shards: Requires ${requiredShards}, owned ${ownedShards}.`);
      return;
    }

    stateCopy.inventory[shardKey] -= requiredShards;
    prog.stars += 1;
    onUpdateState(checkMissions(stateCopy, 'character_upgraded', 1));
  }

  function handleGearSlot(slotIndex: number) {
    if (!selectedChar || !selectedProg) return;
    const stateCopy = { ...saveState };
    const prog = stateCopy.characters[selectedChar.id];

    if (!prog || !prog.unlocked) return;
    if (prog.gearSlots[slotIndex]) return;

    const piece = getGearPiece(prog.gearTier, slotIndex);
    const count = prog.gearTier < 5 ? 2 : prog.gearTier < 9 ? 3 : 5;
    const amount = stateCopy.inventory[piece.id] || 0;
    
    if (amount < count) {
      alert(`Missing ${piece.name} x${count - amount}. Need ${count}, owned ${amount}. Check shops!`);
      return;
    }

    stateCopy.inventory[piece.id] -= count;
    if (!prog.gearSlots) prog.gearSlots = [false, false, false, false, false, false];
    prog.gearSlots[slotIndex] = true;
    
    if (stateCopy.tutorialStep === 5) {
      stateCopy.tutorialStep = 6;
    }
    onUpdateState(checkMissions(stateCopy, 'character_upgraded', 1));
  }

  function handleGearTierUp() {
    if (!selectedChar || !selectedProg) return;
    const stateCopy = { ...saveState };
    const prog = stateCopy.characters[selectedChar.id];

    if (!prog || !prog.unlocked) return;
    if (prog.gearTier >= 13) return;
    if (prog.gearSlots.some(s => !s)) {
      alert("Equip all 6 active slots first!");
      return;
    }

    prog.gearSlots = [false, false, false, false, false, false];
    prog.gearTier += 1;
    
    if (stateCopy.tutorialStep === 5) {
      stateCopy.tutorialStep = 6;
    }
    onUpdateState(checkMissions(stateCopy, 'character_upgraded', 1));
  }

  function handleForgeRelic() {
    if (!selectedChar || !selectedProg) return;
    const stateCopy = { ...saveState };
    const prog = stateCopy.characters[selectedChar.id];
    
    if (!prog || !prog.unlocked) return;
    if (prog.gearTier < 13 || prog.stars < 7) {
      alert("Relics require Max Star (7★) and Max Gear Tier (G13).");
      return;
    }
    if (prog.relicLevel >= 10) return;

    const reqs = getRelicReqsForLevel(prog.relicLevel);
    for (const req of reqs) {
      const owned = stateCopy.inventory[req.key] || 0;
      if (owned < req.count) {
         alert(`Missing Relic Material: lack enough ${req.name}.\nRequired: ${req.count}\nOwned: ${owned}`);
         return;
      }
    }

    for (const req of reqs) {
      stateCopy.inventory[req.key] -= req.count;
    }
    prog.relicLevel = (prog.relicLevel || 0) + 1;
    onUpdateState(checkMissions(stateCopy, 'relic_forged', 1));
  }

  function handleLegendSpark() {
    if (!selectedChar || !selectedProg) return;
    const stateCopy = { ...saveState };
    const prog = stateCopy.characters[selectedChar.id];

    if (!prog || !prog.unlocked) return;
    if (prog.legendLevel >= 10) return;
    
    const hasSparks = stateCopy.inventory['legend_shard'] || 0;
    if (hasSparks < 2) {
      alert("Requires 2 Legendary Spark materials!");
      return;
    }

    stateCopy.inventory['legend_shard'] -= 2;
    prog.legendLevel += 1;
    onUpdateState(checkMissions(stateCopy, 'legend_spark_ignited', 1));
  }

  // Toggle filter menu tags
  function toggleFactionFilter(tag: string) {
    if (selectedFactions.includes(tag)) {
      setSelectedFactions(selectedFactions.filter(t => t !== tag));
    } else {
      setSelectedFactions([...selectedFactions, tag]);
    }
  }

  function toggleRoleFilter(tag: string) {
    if (selectedRoles.includes(tag)) {
      setSelectedRoles(selectedRoles.filter(t => t !== tag));
    } else {
      setSelectedRoles([...selectedRoles, tag]);
    }
  }

  function toggleStatusFilter(tag: string) {
    if (selectedStatuses.includes(tag)) {
      setSelectedStatuses(selectedStatuses.filter(t => t !== tag));
    } else {
      setSelectedStatuses([...selectedStatuses, tag]);
    }
  }

  function clearAllFilters() {
    setSelectedFactions([]);
    setSelectedRoles([]);
    setSelectedStatuses([]);
    setSearchTerm('');
  }

  const hasActiveFilters = selectedFactions.length > 0 || selectedRoles.length > 0 || selectedStatuses.length > 0 || searchTerm !== '';

  return (
    <div className="space-y-6">
      {/* Sub tabs bar */}
      <div className="flex border-b border-zinc-800 pb-px gap-2">
        <button
          onClick={() => setActiveSubTab('database')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest border-b-2 transition ${activeSubTab === 'database' ? 'border-amber-500 text-amber-400 glow-neon' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <Book className="w-3.5 h-3.5 text-zinc-400" />
          Roster Database
        </button>
        <button
          onClick={() => setActiveSubTab('squads')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest border-b-2 transition ${activeSubTab === 'squads' ? 'border-amber-500 text-amber-400 glow-neon' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          Squad Builder
        </button>
        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest border-b-2 transition ${activeSubTab === 'inventory' ? 'border-amber-500 text-amber-400 glow-neon' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <Grid className="w-3.5 h-3.5 text-zinc-400" />
          Materials Inventory
        </button>
        <button
          onClick={() => setActiveSubTab('missions')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest border-b-2 transition ${activeSubTab === 'missions' ? 'border-amber-500 text-amber-400 glow-neon' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <Award className="w-3.5 h-3.5 text-zinc-400" />
          Operations
        </button>
        <button
          onClick={() => setActiveSubTab('holonet')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest border-b-2 transition ${activeSubTab === 'holonet' ? 'border-amber-500 text-amber-400 glow-neon' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <Globe className="w-3.5 h-3.5 text-zinc-400" />
          Holonet News
        </button>
      </div>

      {activeSubTab === 'squads' && (
        <SquadBuilderView saveState={saveState} onUpdateState={onUpdateState} onNavigateToFarm={onNavigateToFarm} />
      )}

      {activeSubTab === 'inventory' && (
        <MaterialsInventoryView saveState={saveState} onNavigateToFarm={onNavigateToFarm} />
      )}

      {activeSubTab === 'missions' && (
        <MissionsView saveState={saveState} onUpdateState={onUpdateState} />
      )}

      {activeSubTab === 'holonet' && (
        <div className="animate-fadeIn">
          <OnlinePanel inline={true} saveState={saveState} onUpdateSaveState={onUpdateState} />
        </div>
      )}

      {activeSubTab === 'database' && (
        <div className="flex flex-col gap-6 animate-fadeIn" id="roster_page_container">
          
          {/* GALACTIC GP HEADER */}
          <div className="holo-panel py-4 px-6 rounded-3xl border-cyan-500/20 relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none"></div>
            <div className="space-y-1 text-center sm:text-left z-10">
              <span className="text-zinc-500 text-[10px] uppercase font-mono tracking-widest block font-bold">Galactic Commander Grid</span>
              <h2 className="font-display text-xl sm:text-2xl font-black text-white tracking-widest uppercase">
                Active Tactical Database
              </h2>
            </div>
            
            <div className="bg-black/40 border border-zinc-800 rounded-2xl py-3 px-5 flex items-center gap-4 text-center z-10 shadow-inner shrink-0">
              <div>
                <span className="text-zinc-500 text-[9px] font-mono uppercase tracking-widest block font-bold">Roster Size</span>
                <span className="text-sm font-mono font-bold text-white">{ownedChars.length} <span className="opacity-35 text-xs">/ {allCharacters.length}</span></span>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div>
                <span className="text-zinc-500 text-[9px] font-mono uppercase tracking-widest block font-bold text-cyan-400">Galactic Power</span>
                <span className="text-sm font-mono font-bold text-cyan-400 glow-neon">{totalGP.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* SEARCH, FILTERS & SORT COMMAND CENTER BOX */}
          <div className="holo-panel border-zinc-800 bg-black/60 p-4 rounded-2xl space-y-4 relative overflow-hidden z-30" id="roster_filter_control_center">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.02] to-transparent pointer-events-none"></div>
            
            {/* Control Bar: Search and Sort */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 border-b border-zinc-800 pb-3 relative z-10">
              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search characters, factions, roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/60 border border-zinc-800 focus:border-cyan-500/50 text-white pl-9 pr-4 py-2 rounded-xl text-xs font-mono placeholder-zinc-600 focus:outline-none transition-all w-full shadow-inner"
                />
              </div>

              {/* Sorting and Actions */}
              <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
                {/* Sort selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Sort Order</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-zinc-900/80 text-zinc-300 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs font-mono focus:border-cyan-500/50 outline-none transition"
                  >
                    <option value="power">Galactic Power</option>
                    <option value="level">Character Level</option>
                    <option value="star">Star Rank</option>
                    <option value="name">Alphabetical</option>
                  </select>
                </div>

                <button 
                  onClick={clearAllFilters}
                  className="text-rose-400 hover:text-rose-300 font-mono text-[9px] uppercase tracking-wider font-bold transition px-2.5 py-1.5 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/15 rounded-lg whitespace-nowrap"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Live Parameter Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
              {/* Group: Status */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider block font-bold">Ownership Status</span>
                <div className="flex flex-wrap gap-1">
                  {STATUS_OPTIONS.map(status => {
                    const isSel = selectedStatuses.includes(status);
                    return (
                      <button
                        key={status}
                        onClick={() => toggleStatusFilter(status)}
                        className={`px-2 py-1.5 text-[9px] font-mono rounded-lg border uppercase transition font-bold ${
                          isSel 
                            ? 'bg-cyan-500/15 border-cyan-400 text-cyan-400 glow-neon' 
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group: Roles */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider block font-bold">Tactical Archetypes</span>
                <div className="flex flex-wrap gap-1 max-h-[85px] overflow-y-auto pr-1 scrollbar-thin">
                  {ROLE_OPTIONS.map(role => {
                    const isSel = selectedRoles.includes(role);
                    return (
                      <button
                        key={role}
                        onClick={() => toggleRoleFilter(role)}
                        className={`px-2 py-1.5 text-[9px] font-mono rounded-lg border uppercase transition font-bold ${
                          isSel 
                            ? 'bg-cyan-500/15 border-cyan-400 text-cyan-400 glow-neon' 
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group: Factions */}
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider block font-bold">Squad Faction Tags</span>
                <div className="flex flex-wrap gap-1 max-h-[85px] overflow-y-auto pr-1 scrollbar-thin">
                  {FACTION_OPTIONS.map(fac => {
                    const isSel = selectedFactions.includes(fac);
                    return (
                      <button
                        key={fac}
                        onClick={() => toggleFactionFilter(fac)}
                        className={`px-2 py-1.5 text-[9px] font-mono rounded-lg border uppercase transition font-bold ${
                          isSel 
                            ? 'bg-cyan-500/15 border-cyan-400 text-cyan-400 glow-neon' 
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                        }`}
                      >
                        {fac}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Filters Display & Counter */}
            <div className="flex flex-wrap justify-between items-center text-[10px] font-mono pt-3 border-t border-zinc-900 gap-2 relative z-10">
              <div className="text-zinc-400 uppercase font-bold">
                Query Result: <span className="text-cyan-400">{filteredChars.length}</span> Profiles Match Current Filters
              </div>

              {hasActiveFilters && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-zinc-500 uppercase mr-1">Active:</span>
                  
                  {selectedStatuses.map(st => (
                    <span key={st} className="bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 pl-2 pr-1 py-0.5 rounded-lg flex items-center gap-1 text-[9px]">
                      {st}
                      <button onClick={() => toggleStatusFilter(st)} className="hover:text-white font-bold px-0.5 text-xs leading-none">×</button>
                    </span>
                  ))}
                  
                  {selectedRoles.map(rl => (
                    <span key={rl} className="bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 pl-2 pr-1 py-0.5 rounded-lg flex items-center gap-1 text-[9px]">
                      {rl}
                      <button onClick={() => toggleRoleFilter(rl)} className="hover:text-white font-bold px-0.5 text-xs leading-none">×</button>
                    </span>
                  ))}

                  {selectedFactions.map(fc => (
                    <span key={fc} className="bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 pl-2 pr-1 py-0.5 rounded-lg flex items-center gap-1 text-[9px]">
                      {fc}
                      <button onClick={() => toggleFactionFilter(fc)} className="hover:text-white font-bold px-0.5 text-xs leading-none">×</button>
                    </span>
                  ))}

                  {searchTerm && (
                    <span className="bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 pl-2 pr-1 py-0.5 rounded-lg flex items-center gap-1 text-[9px]">
                      {"\"" + searchTerm + "\""}
                      <button onClick={() => setSearchTerm('')} className="hover:text-white font-bold px-0.5 text-xs leading-none">×</button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* INTERNAL SCROLLABLE ROSTER GRID (Top Half) */}
          <div className="space-y-1 relative z-20">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-zinc-500 px-1 pb-1">
              <span>Database Query Matched {sortedChars.length} Officers</span>
              <span>Grid Independent Scroll</span>
            </div>
            
            <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2.5 max-h-[340px] md:max-h-[420px] overflow-y-auto pr-1.5 relative scrollbar-thin scrollbar-thumb-cyan-500/15 scrollbar-track-transparent bg-zinc-950/40 p-4 border border-zinc-800/80 rounded-2xl shadow-inner">
              {sortedChars.map(char => {
                const prog = saveState.characters[char.id];
                const isUnlocked = prog ? prog.unlocked : false;
                const isSelected = selectedCharId === char.id;
                const power = calculateCharPower(char, prog);
                const isGl = char.tags.includes('Galactic Legend');
                const ownedShards = saveState.inventory[`shards_${char.id}`] || 0;
                const reqShards = (char.tags.includes('Galactic Legend') || char.tags.includes('Journey Character')) ? 330 : 10;
                const canUnlock = !isUnlocked && ownedShards >= reqShards;

                return (
                  <div 
                    key={char.id}
                    onClick={() => {
                      setSelectedCharId(char.id);
                      // Reset details tab if character specific releases demand
                      if (char.releaseState === 'era') {
                        setSelectedDetailTab('directives');
                      }
                    }}
                    className={`cursor-pointer transition-all duration-300 relative rounded-xl flex flex-col justify-between h-[115px] sm:h-[135px] overflow-hidden group border ${
                      isSelected 
                        ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_15px_rgba(34,211,238,0.25)] scale-[1.01]' 
                        : isUnlocked 
                          ? 'bg-black/50 border-zinc-800/80 hover:border-cyan-500/30 hover:bg-cyan-950/5' 
                          : 'bg-black/80 border-zinc-900 opacity-60 hover:opacity-100 transition'
                    }`}
                    id={`roster_card_${char.id}`}
                  >
                    {/* Background glows */}
                    {isUnlocked && <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/[0.03] rounded-full blur-[20px] pointer-events-none group-hover:bg-cyan-500/5 transition"></div>}
                    {isGl && <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-500/10 to-transparent pointer-events-none"></div>}

                    {/* Card stats info */}
                    <div className="p-2 relative z-10">
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[7px] bg-black/50 border border-zinc-800 px-1 py-0.5 rounded text-zinc-400 font-mono font-bold uppercase tracking-wider leading-none truncate max-w-[55px]">
                          {char.faction}
                        </span>
                        {isUnlocked && (
                          <span className="text-amber-400 font-mono font-bold text-[9px] flex items-center leading-none select-none">
                            <Star className="w-2.5 h-2.5 fill-current mr-0.5 shrink-0" /> {prog?.stars || 0}
                          </span>
                        )}
                      </div>

                      <h4 className={`font-display font-bold text-xs leading-tight line-clamp-2 mt-1.5 ${isSelected ? 'text-white' : (isUnlocked ? 'text-zinc-200' : 'text-zinc-500')}`}>
                        {char.name}
                      </h4>
                    </div>

                    {/* Bottom Status bar */}
                    <div className="p-2 border-t border-zinc-900 bg-black/40 relative z-10 shrink-0">
                      {isUnlocked ? (
                        <div className="flex justify-between items-center font-mono">
                          <span className="text-[8px] uppercase tracking-wider text-zinc-500">Power</span>
                          <strong className={`text-[10px] ${isSelected ? 'text-cyan-400 glow-neon' : 'text-zinc-300'}`}>{power.toLocaleString()}</strong>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center text-[8.5px] font-mono leading-none">
                          <span className="text-zinc-500 uppercase">Shards</span>
                          <span className={canUnlock ? 'text-amber-400 font-bold' : 'text-zinc-500'}>
                            {ownedShards}/{reqShards}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PERSISTENT DETAILED INSPECTION SHEET (Bottom Half) */}
          <div className="space-y-2 relative z-10" id="roster_stats_detail_panel">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-zinc-500 px-1 pb-1">
              <span>Tactical Dossier and Upgrade Terminals</span>
              <span className="text-cyan-400">Anchor View</span>
            </div>

            {selectedChar && selectedProg ? (
              <div className="holo-panel shadow-[0_0_30px_rgba(34,211,238,0.12)] rounded-2xl p-5 border-cyan-500/20 relative overflow-hidden bg-black/80 backdrop-blur-md">
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-cyan-500/50 glow-neon"></div>
                
                {/* Visual interface header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left Column: Stat Dossier, Promotes and Upgrades */}
                  <div className="space-y-4 md:border-r md:border-zinc-800 md:pr-6">
                    
                    {/* Identity header */}
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[8px] bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-widest text-cyan-400">
                          {selectedChar.faction}
                        </span>
                        <span className="text-[8px] bg-black/60 border border-zinc-800 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-widest text-zinc-400">
                          {selectedChar.role}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl font-black text-white mt-1.5 uppercase tracking-wide truncate">{selectedChar.name}</h3>
                      
                      {/* Bio lore access */}
                      <button
                        onClick={() => setShowLore(!showLore)}
                        className="mt-2 text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500 hover:text-cyan-400 transition flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded"
                      >
                        <Info className="w-3 h-3" /> {showLore ? 'Hide Archive bio' : 'View Archive bio'}
                      </button>
                      
                      {showLore && (
                        <p className="text-zinc-400 text-xs italic font-serif leading-relaxed bg-zinc-950/50 border border-zinc-800/60 p-2.5 rounded-lg mt-2 font-light">
                          "{selectedChar.lore}"
                        </p>
                      )}
                    </div>

                    {/* Stats table */}
                    {(() => {
                      const displayStats = calculateDisplayStats(selectedChar, selectedProg);
                      const charPowerValue = calculateCharPower(selectedChar, selectedProg);

                      return (
                        <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-900 space-y-2.5">
                          <div className="flex justify-between items-center text-[9px] uppercase font-mono tracking-widest text-cyan-400 border-b border-zinc-900 pb-1.5">
                            <span>Combat Calibration</span>
                            <span>Rating: <strong className="text-white font-bold">{charPowerValue.toLocaleString()}</strong></span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] font-mono">
                            <div className="flex justify-between border-b border-zinc-900/50 pb-0.5">
                              <span className="text-zinc-500">HP</span>
                              <span className="text-zinc-300 font-bold">{displayStats.hp.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-900/50 pb-0.5">
                              <span className="text-zinc-500">Shields</span>
                              <span className="text-zinc-300 font-bold">{displayStats.maxProtection.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-900/50 pb-0.5">
                              <span className="text-zinc-500">Offense</span>
                              <span className="text-zinc-300 font-bold">{displayStats.offense.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-900/50 pb-0.5">
                              <span className="text-zinc-500">Agility</span>
                              <span className="text-amber-400 font-bold">{displayStats.speed}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Levels and cheat promo upgrades */}
                    <div className="space-y-2">
                      {/* Lock Screen overlay if character locked */}
                      {!selectedProg.unlocked && (
                        <div className="bg-rose-950/15 border border-rose-500/20 rounded-xl p-3 text-center flex flex-col items-center">
                          <Lock className="w-5 h-5 text-rose-500 mb-1 opacity-70" />
                          <span className="font-mono text-[9px] font-black uppercase text-rose-400 tracking-wider">Officer Locked</span>
                          <button
                            onClick={() => handleUnlock(selectedChar.id)}
                            className="w-full bg-rose-500 hover:bg-rose-400 text-black text-[9px] font-mono font-black uppercase tracking-wider py-1.5 rounded-lg mt-2 transition"
                          >
                            Verify Shard Status
                          </button>
                        </div>
                      )}

                      {/* Upgrade tools if character unlocked */}
                      {selectedProg.unlocked && (
                        <div className="space-y-2 text-xs">
                          {/* Training Level */}
                          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-2.5 flex justify-between items-center">
                            <div>
                              <span className="text-[8px] font-mono uppercase text-zinc-500 block">Training Level</span>
                              <strong className="text-white font-mono text-xs">Lv {selectedProg.level} <span className="opacity-35 font-light">/ 85</span></strong>
                            </div>
                            <button
                              onClick={handleLevelUp}
                              disabled={selectedProg.level >= 85}
                              className="bg-zinc-100 hover:bg-white text-black disabled:opacity-30 disabled:bg-zinc-900 disabled:text-zinc-500 px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest transition shrink-0"
                            >
                              {selectedProg.level >= 85 ? 'MAX' : `Upgrade (${(selectedProg.level * 150).toLocaleString()}¢)`}
                            </button>
                          </div>

                          {/* Star promotion */}
                          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-2.5 flex justify-between items-center">
                            <div>
                              <span className="text-[8px] font-mono uppercase text-zinc-500 block">Star Rank</span>
                              <strong className="text-amber-400 font-mono text-xs flex items-center">{selectedProg.stars} ★ <span className="opacity-35 font-light text-zinc-500 ml-1">/ 7★</span></strong>
                            </div>
                            <button
                              onClick={handleStarUpByCheat}
                              disabled={selectedProg.stars >= 7}
                              className="bg-amber-500 hover:bg-amber-400 text-black disabled:opacity-30 disabled:bg-zinc-900 disabled:text-zinc-500 px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest transition shrink-0 shadow-glow"
                            >
                              {selectedProg.stars >= 7 ? 'MAXED' : 'Ascend'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Detailed System Sub-Tabs (Abilities, Gear, Relics, Acquisition) */}
                  <div className="md:col-span-2 flex flex-col h-full justify-between gap-4">
                    
                    {/* Inner dossier tab selectors */}
                    <div className="flex border-b border-zinc-800 pb-px gap-1.5">
                      <button
                        onClick={() => setSelectedDetailTab('directives')}
                        className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest border-b-2 transition ${selectedDetailTab === 'directives' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                      >
                        Tactical Skills
                      </button>
                      {selectedChar.releaseState !== 'era' && (
                        <>
                          <button
                            onClick={() => setSelectedDetailTab('gear')}
                            className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest border-b-2 transition ${selectedDetailTab === 'gear' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                          >
                            Gear Matrix
                          </button>
                          <button
                            onClick={() => setSelectedDetailTab('relic')}
                            className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest border-b-2 transition ${selectedDetailTab === 'relic' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                          >
                            Relic Amp
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedDetailTab('shards')}
                        className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest border-b-2 transition ${selectedDetailTab === 'shards' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                      >
                        Shard Finder
                      </button>
                    </div>

                    {/* Inner tab content */}
                    <div className="flex-1 min-h-[200px] overflow-y-auto max-h-[250px] pr-1.5 scrollbar-thin">
                      
                      {/* TAB: DIRECTIVES (Abilities) */}
                      {selectedDetailTab === 'directives' && (
                        <div className="space-y-3 animate-fadeIn">
                          {selectedChar.abilities.map(ab => {
                            const isPassive = ab.type === 'leader' || ab.type === 'unique';
                            return (
                              <div key={ab.id} className="bg-zinc-950/40 border border-zinc-900 p-3.5 rounded-xl space-y-1.5 relative overflow-hidden group">
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-zinc-800 group-hover:bg-cyan-500 transition-colors"></div>
                                <div className="flex justify-between items-center gap-4">
                                  <div>
                                    <span className="font-display font-bold text-white text-xs group-hover:text-cyan-200 transition">{ab.name}</span>
                                    <div className="flex gap-2 items-center mt-0.5">
                                      <span className={`text-[6.5px] px-1 py-0.5 rounded font-mono uppercase font-bold tracking-widest leading-none ${
                                        isPassive ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                      }`}>
                                        {ab.type}
                                      </span>
                                    </div>
                                  </div>
                                  {ab.cooldown > 0 && (
                                    <span className="text-[8px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded font-mono">CD: {ab.cooldown}</span>
                                  )}
                                </div>
                                <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">{ab.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* TAB: GEAR MATRIX */}
                      {selectedDetailTab === 'gear' && selectedChar.releaseState !== 'era' && (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="flex justify-between items-center bg-zinc-950/40 p-3 rounded-xl border border-zinc-900">
                            <div>
                              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block font-bold font-mono">Enhancement Tier</span>
                              <strong className="text-cyan-400 font-mono text-xs">Matrix Tier {selectedProg.gearTier} <span className="opacity-35">/ 13</span></strong>
                            </div>
                            {selectedProg.gearTier < 13 && (
                              <button
                                onClick={handleGearTierUp}
                                disabled={selectedProg.gearSlots?.some(s => !s)}
                                className="bg-cyan-500 hover:bg-cyan-400 text-black disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border-zinc-800 border border-transparent px-3.5 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest transition"
                              >
                                Upgrade Tier
                              </button>
                            )}
                          </div>

                          {/* 6 gear slots info */}
                          <div className="grid grid-cols-2 gap-2">
                            {(selectedProg.gearSlots || [false, false, false, false, false, false]).map((equipped, idx) => {
                              const piece = getGearPiece(selectedProg.gearTier || 1, idx);
                              const reqCount = (selectedProg.gearTier || 1) < 5 ? 2 : (selectedProg.gearTier || 1) < 9 ? 3 : 5;
                              const owned = saveState.inventory[piece.id] || 0;
                              const canEquip = owned >= reqCount;
                              const missing = Math.max(0, reqCount - owned);

                              return (
                                <div
                                  key={idx}
                                  className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition ${
                                    equipped 
                                      ? 'bg-cyan-950/10 border-cyan-500/30 text-cyan-400' 
                                      : canEquip 
                                        ? 'bg-amber-950/10 border-amber-500/30 text-amber-400' 
                                        : 'bg-black/60 border-zinc-900 text-zinc-400'
                                  }`}
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <div>
                                      <span className="text-[7px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Slot {idx + 1}</span>
                                      <h5 className="font-display font-bold text-[10px] leading-tight truncate max-w-[120px]" title={piece.name}>{piece.name}</h5>
                                    </div>
                                    <span className="text-[9px] font-mono shrink-0">
                                      {owned}/{reqCount}
                                    </span>
                                  </div>

                                  <div className="flex justify-between items-center gap-1.5 pt-1.5 border-t border-zinc-900">
                                    <span className="text-[7.5px] font-mono text-zinc-500 uppercase">
                                      {equipped ? 'ALIGNED' : (missing > 0 ? `Missing ${missing}` : 'READY')}
                                    </span>
                                    {!equipped && (
                                      <button
                                        onClick={() => {
                                          if (canEquip) {
                                            handleGearSlot(idx);
                                          } else {
                                            if (onNavigateToFarm) onNavigateToFarm('shop');
                                          }
                                        }}
                                        className={`px-2 py-0.5 rounded font-mono text-[8px] font-bold uppercase tracking-wider transition ${
                                          canEquip 
                                            ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-glow' 
                                            : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-cyan-400'
                                        }`}
                                      >
                                        {canEquip ? 'Equip' : 'Find'}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* TAB: RELIC AMPLIFIER */}
                      {selectedDetailTab === 'relic' && selectedChar.releaseState !== 'era' && (
                        <div className="space-y-4 animate-fadeIn">
                          {selectedProg.gearTier < 13 || selectedProg.stars < 7 ? (
                            <div className="bg-zinc-950/40 p-6 rounded-xl border border-zinc-900 text-center flex flex-col items-center">
                              <Lock className="w-6 h-6 text-zinc-700 mb-2 opacity-50" />
                              <span className="font-mono text-[9px] uppercase text-zinc-500 tracking-wider">Relic Calibration Locked</span>
                              <p className="text-[9.5px] text-zinc-600 mt-1 max-w-xs font-mono uppercase">Requires Star Ascension 7★ and Gear Matrix Tier 13.</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="bg-zinc-950/40 p-3 rounded-xl border border-purple-500/20 flex justify-between items-center">
                                <div>
                                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Relic Amplifier</span>
                                  <strong className="text-purple-400 font-mono text-xs glow-purple">Relic Level {selectedProg.relicLevel || 0} <span className="opacity-35">/ 10</span></strong>
                                </div>
                                <button
                                  onClick={handleForgeRelic}
                                  disabled={selectedProg.relicLevel >= 10}
                                  className="bg-purple-500 hover:bg-purple-400 disabled:bg-zinc-900 disabled:text-zinc-600 border border-transparent px-4 py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-widest transition shadow-glow text-white"
                                >
                                  Forge Level
                                </button>
                              </div>

                              {/* Required relic items list */}
                              {(selectedProg.relicLevel || 0) < 10 && (
                                <div className="space-y-1.5 bg-zinc-950/30 border border-zinc-900 p-3.5 rounded-xl text-[10px] font-mono">
                                  <div className="text-[8.5px] uppercase text-zinc-500 tracking-wider border-b border-zinc-900 pb-1.5 mb-2 font-bold flex justify-between">
                                    <span>Required Materials</span>
                                    <span>Stock / Needed</span>
                                  </div>
                                  {getRelicReqsForLevel(selectedProg.relicLevel || 0).map((req, rIdx) => {
                                    const owned = saveState.inventory[req.key] || 0;
                                    const canAfford = owned >= req.count;
                                    const missing = Math.max(0, req.count - owned);
                                    return (
                                      <div key={rIdx} className="flex justify-between items-center gap-4 py-1 border-b border-zinc-900/40">
                                        <div className="flex gap-2 items-center">
                                          <span className="text-zinc-400 font-medium">{req.name}</span>
                                          {missing > 0 && (
                                            <button 
                                              onClick={() => { if (onNavigateToFarm) onNavigateToFarm('shop'); }}
                                              className="text-purple-400 hover:text-purple-300 font-bold text-[8px] underline"
                                            >
                                              Find
                                            </button>
                                          )}
                                        </div>
                                        <span className={canAfford ? 'text-purple-400 font-bold glow-purple' : 'text-zinc-600'}>
                                          {owned} / {req.count}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}

                          {/* GL Sparks resonance */}
                          {selectedChar.tags.includes('Galactic Legend') && (
                            <div className="bg-zinc-950/40 border border-amber-500/20 p-3.5 rounded-xl flex justify-between items-center mt-2.5">
                              <div>
                                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Legendary Resonance</span>
                                <strong className="text-amber-500 font-mono text-xs">Spark level {selectedProg.legendLevel || 0} / 10</strong>
                              </div>
                              <button
                                onClick={handleLegendSpark}
                                disabled={(selectedProg.legendLevel || 0) >= 10 || (saveState.inventory['legend_shard'] || 0) < 2}
                                className="bg-amber-500/20 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black disabled:opacity-30 disabled:border-amber-500/30 px-3.5 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest transition"
                              >
                                Ignite Spark
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* TAB: SHARD ACQUISITION */}
                      {selectedDetailTab === 'shards' && (
                        <div className="space-y-3.5 animate-fadeIn">
                          {/* Progress shard count */}
                          {(() => {
                            const ownedShards = saveState.inventory[`shards_${selectedChar.id}`] || 0;
                            const isSpecial = selectedChar.tags.includes('Galactic Legend') || selectedChar.tags.includes('Journey Character');
                            const targetShards = selectedProg.unlocked 
                              ? (selectedProg.stars < 7 ? getShardsNeededForStar(selectedProg.stars + 1) : 0)
                              : (isSpecial ? 330 : 10);
                            
                            const progressPercent = targetShards > 0 ? Math.min(100, Math.round((ownedShards / targetShards) * 100)) : 100;

                            return (
                              <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-900 space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                  <div>
                                    <span className="text-zinc-500 uppercase tracking-wider block font-bold">Shard Progress Bar</span>
                                    <strong className="text-zinc-200 uppercase font-medium">{selectedProg.unlocked ? `Promotion stars ${selectedProg.stars + 1}★` : 'Deployment Unlock'}</strong>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-amber-400 font-black text-xs glow-neon">{ownedShards}</span>
                                    <span className="text-zinc-600"> / {targetShards || 'MAX'} Shards</span>
                                  </div>
                                </div>
                                {targetShards > 0 && (
                                  <div className="w-full h-2 bg-black rounded overflow-hidden border border-zinc-800">
                                    <div className="h-full bg-amber-500 box-glow-amber transition-all" style={{ width: `${progressPercent}%` }}></div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                          {/* Farm Nodes details list */}
                          <div className="space-y-2">
                            <span className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider block font-bold pl-1">Identified Signature Datapoint Drops:</span>
                            
                            {/* Fetch farming sources dynamically */}
                            {(() => {
                              const sources = [];
                              
                              // Check campaign rewards
                              const foundNode = CAMPAIGN_NODES.find(n => n.rewards.some(r => r.itemId === `shards_${selectedChar.id}`));
                              if (foundNode) {
                                sources.push({
                                  source: 'Sovereign Campaign Mission Node',
                                  detail: `${foundNode.planet} - Sector ${foundNode.sector} (${foundNode.nodeName}) [${foundNode.difficulty}]`,
                                  actionText: 'WARP TO MISSION',
                                  tab: 'campaign',
                                  id: foundNode.id
                                });
                              }

                              // Check legend journey guides
                              const isJourneyUnit = [
                                'master_kenobi', 'gl_leia', 'general_skywalker', 'admiral_trench', 'starkiller',
                                'director_krennic', 'admiral_raddus', 'maul_mandalore', 'plo_koon_journey',
                                'chancellor_palpatine_journey', 'grand_inquisitor', 'thrawn_remnant', 'old_ben',
                                'boba_fett_daimyo', 'general_kenobi_rep', 'general_grievous_droid', 'eternal_fire_grievous',
                                'jabba', 'lord_vader', 'mace_windu', 'rey_gl', 'luke_skywalker_gl', 'gl_darth_sidious',
                                'emperor_palpatine', 'darth_vader', 'the_mandalorian'
                              ].includes(selectedChar.id);
                              
                              if (isJourneyUnit) {
                                sources.push({
                                  source: 'Legendary Journey Guide Archives',
                                  detail: 'Earn shards exclusively by successfully solving the legendary archive phases.',
                                  actionText: 'OPEN GUIDE',
                                  tab: 'journey',
                                  id: selectedChar.id
                                });
                              }

                              // Check conquest exclusive
                              const isConquest = ['coleman_kcaj', 'oppo_rancisis', 'adi_gallia', 'luminara_unduli', 'yaddle', 'nute_gunray', 'dooku_war_council', 'wat_tambor', 'lott_dod', 'whorm_loathsom'].includes(selectedChar.id);
                              if (isConquest) {
                                sources.push({
                                  source: 'Galactic Conquest Shop',
                                  detail: 'Purchase shards utilizing Conquest medals or Scavenger scrap currency.',
                                  actionText: 'WARP TO SHOP',
                                  tab: 'shop'
                                });
                              }

                              // General shop options
                              if (sources.length === 0) {
                                sources.push({
                                  source: 'Squad Arena Shipments',
                                  detail: 'Featured rotation available for arena tokens inside the central supply center.',
                                  actionText: 'WARP TO SHOP',
                                  tab: 'shop'
                                });
                                sources.push({
                                  source: 'Weekly Supplies Shop',
                                  detail: 'Spend crystals or credits to acquire shards directly in supply packs.',
                                  actionText: 'WARP TO SHOP',
                                  tab: 'shop'
                                });
                              }

                              return (
                                <div className="space-y-2">
                                  {sources.map((src, sIdx) => (
                                    <div key={sIdx} className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                      <div className="space-y-0.5">
                                        <span className="text-[9px] font-mono text-cyan-400 font-bold block">{src.source}</span>
                                        <span className="text-[10px] text-zinc-400 font-sans leading-none block">{src.detail}</span>
                                      </div>
                                      <button
                                        onClick={() => {
                                          if (onNavigateToFarm) {
                                            onNavigateToFarm(src.tab as any, src.id);
                                          }
                                        }}
                                        className="bg-cyan-500/15 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md transition whitespace-nowrap self-end sm:self-auto shrink-0 shadow-inner"
                                      >
                                        {src.actionText}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Bottom visual detail footer */}
                    <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider flex justify-between pt-2 border-t border-zinc-900">
                      <span>Tactical Signature: {selectedChar.id}</span>
                      <span>Alignment: {selectedChar.alignment || 'Neutral'}</span>
                    </div>

                  </div>

                </div>

              </div>
            ) : (
              <div className="holo-panel p-10 rounded-2xl border-zinc-800 text-center flex flex-col items-center justify-center bg-black/40">
                <AlertCircle className="w-8 h-8 text-zinc-600 mb-2 opacity-50" />
                <span className="text-zinc-500 font-mono text-xs uppercase font-bold tracking-widest">Awaiting officer selection</span>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
