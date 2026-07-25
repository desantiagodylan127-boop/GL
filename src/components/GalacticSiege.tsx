import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Globe, Zap, Shield, Swords, RefreshCw, Star, HelpCircle, 
  UserCheck, AlertTriangle, CheckCircle2, Lock, Trash2, LayoutGrid, 
  Sparkles, Award, ShoppingBag, Eye, Hourglass, ChevronRight, UserMinus, RotateCcw
} from 'lucide-react';
import { NetworkManager, PlayerProfile } from '../utils/networkManager';
import { SaveState } from '../types';
import { getAllCharacters } from '../data/characters';

function getCharacterInitials(name: string): string {
  if (!name) return '??';
  const cleaned = name.replace(/^(General|Grand Admiral|Grand Master|Darth|Commander|Lieutenant|Captain|Colonel|GL)\s+/i, '');
  const words = cleaned.split(/\s+/).filter(w => w.length > 0);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getFactionColor(char: any): { bg: string; border: string; text: string } {
  if (!char) return { bg: 'from-zinc-850 to-zinc-950', border: 'border-zinc-700/60', text: 'text-zinc-400' };
  
  const factions = char.faction ? [char.faction] : [];
  if (char.tags) {
    char.tags.forEach((t: string) => factions.push(t));
  }
  
  const factionStr = factions.join(' ').toLowerCase();
  
  if (factionStr.includes('jedi')) {
    return { bg: 'from-emerald-950/80 to-emerald-900/60', border: 'border-emerald-500/40', text: 'text-emerald-400' };
  }
  if (factionStr.includes('empire') || factionStr.includes('sith') || factionStr.includes('inquisitor') || factionStr.includes('vader')) {
    return { bg: 'from-rose-950/80 to-rose-900/60', border: 'border-rose-500/40', text: 'text-rose-400' };
  }
  if (factionStr.includes('separatist')) {
    return { bg: 'from-violet-950/80 to-violet-900/60', border: 'border-violet-500/40', text: 'text-violet-400' };
  }
  if (factionStr.includes('clone') || factionStr.includes('republic')) {
    return { bg: 'from-blue-950/80 to-blue-900/60', border: 'border-blue-400/40', text: 'text-blue-300' };
  }
  if (factionStr.includes('rebel')) {
    return { bg: 'from-amber-950/80 to-amber-900/60', border: 'border-amber-500/40', text: 'text-amber-400' };
  }
  if (factionStr.includes('bounty') || factionStr.includes('scoundrel') || factionStr.includes('hutt') || factionStr.includes('pirate')) {
    return { bg: 'from-yellow-950/80 to-yellow-900/60', border: 'border-yellow-600/40', text: 'text-yellow-400' };
  }
  
  return { bg: 'from-zinc-900/90 to-zinc-800/60', border: 'border-zinc-600/40', text: 'text-zinc-300' };
}

interface GalacticSiegeProps {
  saveState: SaveState;
  onLaunchBattle: (playerSquadIds: string[], enemySquadIds: string[], opponent: PlayerProfile) => void;
  onOpenOnlinePanel: () => void;
}

export function GalacticSiege({ saveState, onLaunchBattle, onOpenOnlinePanel }: GalacticSiegeProps) {
  const [activeTab, setActiveTab] = useState<'match' | 'store' | 'history' | 'leaderboards' | 'tutorial'>('match');
  const [loading, setLoading] = useState(false);
  const [siegeProfile, setSiegeProfile] = useState<any>(null);
  const [planets, setPlanets] = useState<any[]>([]);
  const [activePlanet, setActivePlanet] = useState<any>(null);
  
  // Store state
  const [storeItems, setStoreItems] = useState<any[]>([]);
  const [storeCategory, setStoreCategory] = useState<'all' | 'general' | 'relic' | 'archives' | 'era' | 'cosmetics'>('all');
  
  // Leaderboards
  const [leaderboard, setLeaderboard] = useState<PlayerProfile[]>([]);
  
  // Defense Phase Setup State
  const [selectedSquadIndex, setSelectedSquadIndex] = useState<number | null>(null);
  const [selectedSector, setSelectedSector] = useState<'outer' | 'middle' | 'inner'>('outer');
  const [tempPlayerDefense, setTempPlayerDefense] = useState<Record<string, string[]>>({});
  
  // Roster placement filter/sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [factionFilter, setFactionFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'power' | 'name'>('power');

  // Error/Success flags
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<string>('');
  const currentMatch = siegeProfile?.currentMatch;

  useEffect(() => {
    if (!currentMatch?.phaseEndTimestamp || currentMatch.phase === 'ended') {
      setTimeLeft('');
      return;
    }
    const updateTimer = () => {
      const diff = currentMatch.phaseEndTimestamp - Date.now();
      if (diff <= 0) {
        setTimeLeft('Auto-advancing...');
        fetchSiegeStatus();
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentMatch?.phaseEndTimestamp, currentMatch?.phase]);
  
  const isOnline = NetworkManager.isOnline();
  const account = NetworkManager.getAccount();
  const allChars = getAllCharacters();

  // Load user's siege profile
  const fetchSiegeStatus = async () => {
    if (!isOnline || !account) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/siege/status?accountId=${account.accountId}`);
      const data = await response.json();
      if (data.success) {
        setSiegeProfile(data.profile);
        setPlanets(data.planets || []);
        setActivePlanet(data.activePlanet);
        
        // Synchronize our temporary defense state with the server state if there's an active defense phase
        if (data.profile?.currentMatch?.phase === 'defense') {
          setTempPlayerDefense(data.profile.currentMatch.playerDefense || {});
        }
      }
    } catch (err) {
      console.error('Error fetching siege status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Store
  const fetchStoreItems = async () => {
    try {
      const response = await fetch('/api/siege/store');
      const data = await response.json();
      if (data.success) {
        setStoreItems(data.items);
      }
    } catch (err) {
      console.error('Error fetching store items:', err);
    }
  };

  // Fetch Leaderboard
  const fetchLeaderboards = async () => {
    try {
      const rankings = await NetworkManager.getRankings();
      setLeaderboard(rankings);
    } catch (err) {
      console.error('Error fetching rankings:', err);
    }
  };

  useEffect(() => {
    if (isOnline && account) {
      fetchSiegeStatus();
      fetchStoreItems();
      fetchLeaderboards();
    }
  }, [isOnline, account]);

  // Phase transition (force advance for developers)
  const handleForceAdvance = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const response = await fetch('/api/siege/phase/force-advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: account.accountId })
      });
      const data = await response.json();
      if (data.success) {
        setSiegeProfile(data.profile);
        setTempPlayerDefense(data.profile.currentMatch?.playerDefense || {});
        setActionSuccess(`Match Phase advanced successfully to: ${data.profile.currentMatch?.phase.toUpperCase()}`);
        setTimeout(() => setActionSuccess(null), 4000);
        fetchLeaderboards();
      }
    } catch (err) {
      console.error(err);
      setActionError('Failed to advance match phase');
      setTimeout(() => setActionError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Defense Management
  const handleSaveDefense = async () => {
    if (!account) return;
    setLoading(true);
    setActionError(null);
    try {
      const response = await fetch('/api/siege/defense/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: account.accountId, squads: tempPlayerDefense })
      });
      const data = await response.json();
      if (data.success) {
        setSiegeProfile(data.profile || { ...siegeProfile, currentMatch: data.currentMatch });
        setActionSuccess('Defensive placements locked and saved successfully!');
        setSelectedSquadIndex(null);
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(data.error || 'Failed to save defenses');
      }
    } catch (err) {
      console.error(err);
      setActionError('Error setting defensive squads');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFillDefense = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const response = await fetch('/api/siege/defense/auto-fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: account.accountId })
      });
      const data = await response.json();
      if (data.success) {
        setTempPlayerDefense(data.currentMatch.playerDefense);
        setActionSuccess('Empty slots auto-filled with your best available roster units!');
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(data.error || 'Auto fill failed');
        setTimeout(() => setActionError(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearDefense = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const response = await fetch('/api/siege/defense/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: account.accountId })
      });
      const data = await response.json();
      if (data.success) {
        setTempPlayerDefense({});
        setActionSuccess('All defensive squads cleared.');
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPreviousDefense = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const response = await fetch('/api/siege/copy-previous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: account.accountId })
      });
      const data = await response.json();
      if (data.success) {
        setTempPlayerDefense(data.currentMatch.playerDefense);
        setActionSuccess('Loaded your previous defensive layout successfully!');
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(data.error || 'Failed to copy previous defense');
        setTimeout(() => setActionError(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Buy Item from Store
  const handleBuyItem = async (itemId: string, cost: number) => {
    if (!account || !siegeProfile) return;
    if (siegeProfile.tokens < cost) {
      setActionError('Insufficient Siege Tokens');
      setTimeout(() => setActionError(null), 3000);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/siege/store/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: account.accountId, itemId })
      });
      const data = await response.json();
      if (data.success) {
        setSiegeProfile(data.profile);
        setActionSuccess('Purchase completed! Items integrated to inventory.');
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(data.error || 'Purchase failed');
        setTimeout(() => setActionError(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Claim Daily division rewards
  const handleClaimDailyRewards = async () => {
    if (!account) return;
    try {
      const response = await fetch('/api/siege/claim-daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: account.accountId })
      });
      const data = await response.json();
      if (data.success) {
        setSiegeProfile(data.profile);
        setActionSuccess(`Claimed division salary: +${data.rewards.tokens} Tokens, +${data.rewards.credits} Credits!`);
        setTimeout(() => setActionSuccess(null), 4000);
      } else {
        setActionError(data.error || 'Daily reward already claimed.');
        setTimeout(() => setActionError(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Manual store refresh
  const handleRefreshStoreCrystals = async () => {
    if (!account || saveState.crystals < 50) {
      setActionError('Requires 50 Crystals to refresh store');
      setTimeout(() => setActionError(null), 3000);
      return;
    }
    try {
      const response = await fetch('/api/siege/store/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: account.accountId })
      });
      const data = await response.json();
      if (data.success) {
        setActionSuccess('Store templates refreshed!');
        setTimeout(() => setActionSuccess(null), 3000);
        fetchStoreItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Render division badge color / label
  const getDivisionBadge = (division: string) => {
    switch (division) {
      case 'Mythic': return { text: 'Mythic Overlord', bg: 'from-amber-500/20 to-orange-500/20 border-amber-500 text-amber-400', icon: '🏆' };
      case 'Kyber': return { text: 'Kyber Sovereign', bg: 'from-rose-500/20 to-red-500/20 border-rose-500 text-rose-400', icon: '💎' };
      case 'Aurodium': return { text: 'Aurodium Gladiator', bg: 'from-yellow-600/20 to-amber-600/20 border-amber-500 text-yellow-400', icon: '🥇' };
      case 'Chromium': return { text: 'Chromium Commander', bg: 'from-slate-400/20 to-zinc-500/20 border-slate-400 text-slate-300', icon: '🥈' };
      case 'Bronzium': return { text: 'Bronzium Vanguard', bg: 'from-orange-800/20 to-amber-800/20 border-orange-700 text-orange-400', icon: '🥉' };
      default: return { text: 'Carbonite Cadet', bg: 'from-zinc-800/20 to-neutral-800/20 border-zinc-700 text-zinc-400', icon: '💀' };
    }
  };

  if (!isOnline || !account) {
    return (
      <div className="p-8 border border-zinc-900 rounded-3xl bg-zinc-950/40 text-center space-y-6 max-w-2xl mx-auto my-12 backdrop-blur-md">
        <div className="w-16 h-16 rounded-2xl bg-red-950/20 border border-red-500/20 flex items-center justify-center mx-auto shadow-inner">
          <Globe className="text-red-500 w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black font-display text-white tracking-wide uppercase">Connection Required</h2>
          <p className="text-xs text-zinc-500 font-mono leading-relaxed max-w-md mx-auto">
            Establishing Holonet connection is mandatory to synchronize tactical coordinates and challenge other commanders across the outer rim.
          </p>
        </div>
        <button 
          onClick={onOpenOnlinePanel}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-black font-mono text-xs rounded-xl uppercase tracking-wider transition shadow-glow"
        >
          CONNECT HOLONET
        </button>
      </div>
    );
  }

  const divisionInfo = getDivisionBadge(siegeProfile?.division || 'Bronzium');

  // Filtered and sorted characters list for placement
  const characterProgressList = saveState?.characters ? Object.values(saveState.characters).filter(c => c.unlocked) : [];

  // Characters placed in other defense slots (excluding currently editing squad)
  const getUsedDefenseCharacters = () => {
    const used = new Set<string>();
    Object.keys(tempPlayerDefense).forEach(key => {
      if (parseInt(key, 10) !== selectedSquadIndex) {
        tempPlayerDefense[key].forEach(cid => used.add(cid));
      }
    });
    return used;
  };

  const usedDefenseChars = getUsedDefenseCharacters();

  // Characters already used in previous attacks
  const getUsedAttackCharacters = () => {
    const used = new Set<string>();
    if (currentMatch?.playerAttacks) {
      currentMatch.playerAttacks.forEach((att: any) => {
        if (att.charactersUsed) {
          att.charactersUsed.forEach((cid: string) => used.add(cid));
        }
      });
    }
    return used;
  };

  const usedAttackChars = getUsedAttackCharacters();

  // Eligible character cards
  const eligibleCharacters = characterProgressList
    .map(progress => {
      const char = allChars.find(c => c.id === progress.id);
      return { progress, char };
    })
    .filter(item => {
      if (!item.char) return false;
      const matchesSearch = item.char.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFaction = factionFilter === 'all' || item.char.tags.some(tag => tag.toLowerCase() === factionFilter.toLowerCase()) || item.char.faction?.toLowerCase() === factionFilter.toLowerCase();
      return matchesSearch && matchesFaction;
    })
    .sort((a, b) => {
      if (sortOrder === 'name') {
        return (a.char?.name || '').localeCompare(b.char?.name || '');
      } else {
        const powerA = (a.progress.level * 100) + (a.progress.gearTier * 200) + (a.progress.relicLevel * 500);
        const powerB = (b.progress.level * 100) + (b.progress.gearTier * 200) + (b.progress.relicLevel * 500);
        return powerB - powerA;
      }
    });

  // Check sector locked state in attack phase
  const isSectorLocked = (sector: 'outer' | 'middle' | 'inner') => {
    if (!currentMatch) return true;
    if (currentMatch.phase !== 'attack') return true;
    
    const clearedOuter = currentMatch.playerAttacks?.filter((a: any) => a.squadIndex < 3 && a.success).length || 0;
    const clearedMiddle = currentMatch.playerAttacks?.filter((a: any) => a.squadIndex >= 3 && a.squadIndex < 6 && a.success).length || 0;
    
    if (sector === 'middle') return clearedOuter < 3;
    if (sector === 'inner') return clearedOuter < 3 || clearedMiddle < 3;
    return false;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER HUD BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Division & LP CARD */}
        <div className={`holo-panel p-5 rounded-2xl border bg-black/40 flex items-center justify-between transition-all duration-300 border-zinc-800 ${divisionInfo.bg}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{divisionInfo.icon}</span>
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold tracking-widest">{divisionInfo.text}</span>
            </div>
            <div className="text-3xl font-black font-display text-white tracking-wide">
              {siegeProfile?.rating || 1000} <span className="text-xs font-mono text-zinc-500">LP</span>
            </div>
            <p className="text-[9px] text-zinc-500 font-mono leading-none">Global Competitive Standing</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] font-mono text-emerald-400 font-black tracking-widest bg-emerald-950/20 border border-emerald-500/20 px-1.5 py-0.5 rounded">Active Season</span>
          </div>
        </div>

        {/* Siege Currency CARD */}
        <div className="holo-panel p-5 rounded-2xl border border-zinc-800/80 bg-black/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Siege Tokens</span>
            <div className="text-3xl font-black font-display text-cyan-400 tracking-wide flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-cyan-400" />
              {siegeProfile?.tokens || 0}
            </div>
            <p className="text-[9px] text-zinc-500 font-mono leading-none">Redeemable in the Siege Store</p>
          </div>
          <button 
            onClick={() => setActiveTab('store')}
            className="px-3 py-1.5 bg-cyan-950/30 hover:bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-black rounded-lg uppercase tracking-wider transition"
          >
            Store
          </button>
        </div>

        {/* Match phase timer card */}
        <div className="holo-panel p-5 rounded-2xl border border-zinc-800/80 bg-black/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Siege Match Cycle</span>
            <div className="text-lg font-black font-mono text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Hourglass className="w-4 h-4 text-amber-500 animate-spin-slow" />
              {currentMatch ? (
                <span className={currentMatch.phase === 'defense' ? 'text-amber-400' : 'text-rose-500'}>
                  {currentMatch.phase === 'defense' ? 'Defense Phase' : currentMatch.phase === 'attack' ? 'Attack Phase' : 'Match Resolved'}
                </span>
              ) : (
                <span className="text-zinc-500">No active match</span>
              )}
            </div>
            <p className="text-[9px] text-zinc-500 font-mono leading-none mt-1">Sectors lock/unlock automatically</p>
          </div>
          
          {timeLeft && (
            <div className="flex flex-col items-end text-right font-mono">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Auto-Progressing in</span>
              <span className="text-sm font-black text-cyan-400 animate-pulse tracking-wider">{timeLeft}</span>
            </div>
          )}
        </div>

        {/* Daily Salary claiming card */}
        <div className="holo-panel p-5 rounded-2xl border border-zinc-800/80 bg-black/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Division Daily Salary</span>
            <div className="text-xs font-mono font-bold mt-1 text-zinc-300">
              {siegeProfile?.dailyRewardClaimedToday ? (
                <span className="text-zinc-500 flex items-center gap-1">Claimed Today <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600" /></span>
              ) : (
                <span className="text-emerald-400 animate-pulse flex items-center gap-1">Available for claim <Sparkles className="w-3.5 h-3.5" /></span>
              )}
            </div>
            <p className="text-[9px] text-zinc-500 font-mono leading-none mt-1">Refreshes every 24 hours</p>
          </div>
          
          <button 
            onClick={handleClaimDailyRewards}
            disabled={siegeProfile?.dailyRewardClaimedToday}
            className={`px-3 py-2 rounded-lg font-mono text-[10px] font-black uppercase tracking-wider transition ${siegeProfile?.dailyRewardClaimedToday ? 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-black font-black'}`}
          >
            CLAIM SALARY
          </button>
        </div>
      </div>

      {/* TOP SUB NAVIGATION BAR */}
      <div className="flex gap-1 bg-zinc-950 border border-zinc-900 p-1.5 rounded-2xl max-w-lg">
        <button 
          onClick={() => setActiveTab('match')}
          className={`flex-1 py-2 px-3 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 ${activeTab === 'match' ? 'bg-zinc-900 text-cyan-400 border border-zinc-800' : 'text-zinc-400 hover:text-white'}`}
        >
          <Swords className="w-3.5 h-3.5" /> Active Siege
        </button>
        <button 
          onClick={() => setActiveTab('store')}
          className={`flex-1 py-2 px-3 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 ${activeTab === 'store' ? 'bg-zinc-900 text-cyan-400 border border-zinc-800' : 'text-zinc-400 hover:text-white'}`}
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Store
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-3 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 ${activeTab === 'history' ? 'bg-zinc-900 text-cyan-400 border border-zinc-800' : 'text-zinc-400 hover:text-white'}`}
        >
          <Hourglass className="w-3.5 h-3.5" /> Logs
        </button>
        <button 
          onClick={() => setActiveTab('leaderboards')}
          className={`flex-1 py-2 px-3 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 ${activeTab === 'leaderboards' ? 'bg-zinc-900 text-cyan-400 border border-zinc-800' : 'text-zinc-400 hover:text-white'}`}
        >
          <Trophy className="w-3.5 h-3.5" /> Ranks
        </button>
        <button 
          onClick={() => setActiveTab('tutorial')}
          className={`flex-1 py-2 px-3 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 ${activeTab === 'tutorial' ? 'bg-zinc-900 text-cyan-400 border border-zinc-800' : 'text-zinc-400 hover:text-white'}`}
        >
          <HelpCircle className="w-3.5 h-3.5" /> Guide
        </button>
      </div>

      {/* FEEDBACK LABELS */}
      <AnimatePresence>
        {actionError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 font-mono text-xs rounded-xl flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </motion.div>
        )}
        {actionSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 font-mono text-xs rounded-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TAB CONTENT: ACTIVE MATCH */}
      {activeTab === 'match' && currentMatch && (
        <div className="space-y-8">
          {/* ROTATED PLANET SHOWCASE MODULE */}
          {activePlanet && (
            <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 shadow-2xl">
              <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded">Active Battlefield</span>
                  <span className="text-zinc-500 text-xs font-mono">• Sector rotated</span>
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-3xl font-black tracking-wide text-white font-display uppercase">{activePlanet.name}</h1>
                  <p className="text-zinc-400 font-mono text-xs leading-relaxed max-w-xl">{activePlanet.description}</p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold tracking-wider">Synergistic Battlefield Tags</span>
                  <div className="flex gap-2">
                    {activePlanet.featuredTags?.map((tag: string) => (
                      <span key={tag} className="text-[10px] font-mono bg-cyan-950/20 border border-cyan-500/30 text-cyan-400 font-black px-2.5 py-1 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Planet Bonuses Card */}
              <div className="bg-zinc-950/80 border border-zinc-800 p-5 rounded-2xl max-w-sm w-full space-y-4">
                <h4 className="font-mono text-xs font-black uppercase text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Planetary Modifiers
                </h4>
                <div className="space-y-3 font-mono text-[10px] leading-relaxed">
                  {activePlanet.bonuses?.map((bonus: any, idx: number) => (
                    <div key={idx} className="space-y-1 bg-zinc-900/40 p-2 rounded-lg border border-zinc-800/40">
                      <span className="font-bold text-cyan-300">[{bonus.tag}] Faction Boost:</span>
                      <p className="text-zinc-400 text-[10px]">{bonus.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE MATCH PLAYERS VS MODULE */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-zinc-950 border border-zinc-900 p-6 rounded-3xl">
            {/* Player block */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/20 border-2 border-cyan-500 flex items-center justify-center text-3xl shadow-glow">
                🧑‍✈️
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-black">Commander (You)</span>
                <h3 className="text-xl font-black text-white leading-none">{account.username}</h3>
                <p className="text-xs font-mono text-zinc-500">Score: <span className="text-cyan-400 font-bold">{currentMatch.playerScore} Pts</span></p>
              </div>
            </div>

            {/* VS Divider */}
            <div className="flex flex-col items-center">
              <div className="px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900 font-mono text-xs font-black text-amber-500 uppercase tracking-widest animate-pulse">
                VS
              </div>
              <span className="text-[9px] font-mono text-zinc-500 mt-2">Active Engagement</span>
            </div>

            {/* Opponent block */}
            <div className="flex items-center gap-4 w-full md:w-auto flex-row-reverse md:flex-row justify-end text-right md:text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-rose-400 uppercase font-black">Matched Rival</span>
                <h3 className="text-xl font-black text-white leading-none">{currentMatch.opponentUsername}</h3>
                <p className="text-xs font-mono text-zinc-500">Score: <span className="text-rose-400 font-bold">{currentMatch.opponentScore} Pts</span></p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-rose-950/20 border-2 border-rose-500 flex items-center justify-center text-3xl shadow-glow-rose overflow-hidden relative select-none">
                {(() => {
                  const avatarChar = allChars.find(c => c.id === currentMatch.opponentAvatar);
                  if (avatarChar) {
                    const initials = getCharacterInitials(avatarChar.name);
                    return (
                      <div className="w-full h-full bg-gradient-to-b from-rose-950/60 to-rose-900/40 flex flex-col items-center justify-center">
                        <span className="text-sm font-black font-mono tracking-tighter text-rose-400">
                          {initials}
                        </span>
                        <span className="text-[5px] text-zinc-500 font-mono scale-[0.8] absolute bottom-1 leading-none uppercase">
                          {avatarChar.faction}
                        </span>
                      </div>
                    );
                  }
                  return <span className="text-3xl">👤</span>;
                })()}
              </div>
            </div>
          </div>

          {/* PHASE CONDITIONAL INTERFACES */}

          {/* 1. DEFENSE PHASE INTERFACE */}
          {currentMatch.phase === 'defense' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-950/80 border border-zinc-900 p-5 rounded-2xl">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase font-display flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-400" /> Defense Installation
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono leading-relaxed mt-1">
                    Install exactly **9 defensive squads** (3 per sector) to protect your rating. Your placed units will be locked from attacking.
                  </p>
                </div>
                
                <div className="flex gap-2 flex-wrap font-mono">
                  <button 
                    onClick={handleCopyPreviousDefense}
                    className="px-3.5 py-2 border border-zinc-800 hover:border-cyan-500/40 text-xs font-bold text-zinc-400 hover:text-cyan-400 rounded-xl transition"
                  >
                    Copy Previous
                  </button>
                  <button 
                    onClick={handleAutoFillDefense}
                    className="px-3.5 py-2 border border-zinc-800 hover:border-cyan-500/40 text-xs font-bold text-zinc-400 hover:text-cyan-400 rounded-xl transition"
                  >
                    Auto Fill
                  </button>
                  <button 
                    onClick={handleClearDefense}
                    className="px-3.5 py-2 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-500 hover:text-zinc-200 rounded-xl transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                  <button 
                    onClick={handleSaveDefense}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs rounded-xl uppercase tracking-wider shadow-inner transition"
                  >
                    Lock and Save Defense
                  </button>
                </div>
              </div>

              {/* SECTION GRID & SELECTION */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* OUTER SECTOR (Indices 0, 1, 2) */}
                <div className="holo-panel p-5 rounded-2xl border border-zinc-800 bg-zinc-950/40 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                    <span className="font-mono text-[10px] font-black uppercase text-cyan-400">Sector 1: Outer Layer</span>
                    <span className="text-[9px] font-mono text-zinc-500">Value: 100 Pts</span>
                  </div>
                  
                  <div className="space-y-4">
                    {[0, 1, 2].map(idx => {
                      const squad = tempPlayerDefense[idx.toString()] || [];
                      const isSelected = selectedSquadIndex === idx;
                      return (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedSquadIndex(idx)}
                          className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${isSelected ? 'bg-cyan-950/20 border-cyan-500/50 shadow-inner' : 'bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700'}`}
                        >
                          <div className="flex justify-between items-center text-xs font-mono font-bold">
                            <span className="text-zinc-400">Defensive Squad #{idx + 1}</span>
                            <span className={squad.length > 0 ? 'text-emerald-400' : 'text-amber-500 animate-pulse'}>
                              {squad.length > 0 ? `${squad.length}/5 Placed` : 'Empty Slot'}
                            </span>
                          </div>
                          
                          <div className="flex gap-1.5 mt-3 min-h-[44px] overflow-x-auto py-1">
                            {squad.length > 0 ? (
                              squad.map((cid, cidx) => {
                                const char = allChars.find(c => c.id === cid);
                                return (
                                  <div key={cid + '_' + cidx} className="w-10 h-10 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0" title={char?.name || cid}>
                                    <span className="text-base">👤</span>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-[10px] text-zinc-600 font-mono flex items-center gap-1.5">
                                <LayoutGrid className="w-3.5 h-3.5" /> Tap to assign characters
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* MIDDLE SECTOR (Indices 3, 4, 5) */}
                <div className="holo-panel p-5 rounded-2xl border border-zinc-800 bg-zinc-950/40 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                    <span className="font-mono text-[10px] font-black uppercase text-amber-500">Sector 2: Middle Layer</span>
                    <span className="text-[9px] font-mono text-zinc-500">Value: 150 Pts</span>
                  </div>
                  
                  <div className="space-y-4">
                    {[3, 4, 5].map(idx => {
                      const squad = tempPlayerDefense[idx.toString()] || [];
                      const isSelected = selectedSquadIndex === idx;
                      return (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedSquadIndex(idx)}
                          className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${isSelected ? 'bg-cyan-950/20 border-cyan-500/50 shadow-inner' : 'bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700'}`}
                        >
                          <div className="flex justify-between items-center text-xs font-mono font-bold">
                            <span className="text-zinc-400">Defensive Squad #{idx + 1}</span>
                            <span className={squad.length > 0 ? 'text-emerald-400' : 'text-amber-500 animate-pulse'}>
                              {squad.length > 0 ? `${squad.length}/5 Placed` : 'Empty Slot'}
                            </span>
                          </div>
                          
                          <div className="flex gap-1.5 mt-3 min-h-[44px] overflow-x-auto py-1">
                            {squad.length > 0 ? (
                              squad.map((cid, cidx) => {
                                const char = allChars.find(c => c.id === cid);
                                return (
                                  <div key={cid + '_' + cidx} className="w-10 h-10 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0" title={char?.name || cid}>
                                    <span className="text-base">👤</span>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-[10px] text-zinc-600 font-mono flex items-center gap-1.5">
                                <LayoutGrid className="w-3.5 h-3.5" /> Tap to assign characters
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* INNER SECTOR (Indices 6, 7, 8) */}
                <div className="holo-panel p-5 rounded-2xl border border-zinc-800 bg-zinc-950/40 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                    <span className="font-mono text-[10px] font-black uppercase text-rose-500">Sector 3: Command Center</span>
                    <span className="text-[9px] font-mono text-zinc-500">Value: 250 Pts</span>
                  </div>
                  
                  <div className="space-y-4">
                    {[6, 7, 8].map(idx => {
                      const squad = tempPlayerDefense[idx.toString()] || [];
                      const isSelected = selectedSquadIndex === idx;
                      return (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedSquadIndex(idx)}
                          className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${isSelected ? 'bg-cyan-950/20 border-cyan-500/50 shadow-inner' : 'bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700'}`}
                        >
                          <div className="flex justify-between items-center text-xs font-mono font-bold">
                            <span className="text-zinc-400">Defensive Squad #{idx + 1}</span>
                            <span className={squad.length > 0 ? 'text-emerald-400' : 'text-amber-500 animate-pulse'}>
                              {squad.length > 0 ? `${squad.length}/5 Placed` : 'Empty Slot'}
                            </span>
                          </div>
                          
                          <div className="flex gap-1.5 mt-3 min-h-[44px] overflow-x-auto py-1">
                            {squad.length > 0 ? (
                              squad.map((cid, cidx) => {
                                const char = allChars.find(c => c.id === cid);
                                return (
                                  <div key={cid + '_' + cidx} className="w-10 h-10 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0" title={char?.name || cid}>
                                    <span className="text-base">👤</span>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-[10px] text-zinc-600 font-mono flex items-center gap-1.5">
                                <LayoutGrid className="w-3.5 h-3.5" /> Tap to assign characters
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* INTERACTIVE ROSTER PLACEMENT DRAWER */}
              {selectedSquadIndex !== null && (
                <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white text-base">Assign Units to Defensive Squad #{selectedSquadIndex + 1}</h4>
                      <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Pick up to 5 unique characters. Locked characters cannot be reused.</p>
                    </div>
                    <button 
                      onClick={() => setSelectedSquadIndex(null)}
                      className="text-xs font-mono text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-xl transition"
                    >
                      Close Panel
                    </button>
                  </div>

                  {/* Filter / Sort bar */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                    <input 
                      type="text" 
                      placeholder="Search character name..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl text-white outline-none focus:border-cyan-500/50"
                    />
                    <select 
                      value={factionFilter}
                      onChange={(e) => setFactionFilter(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl text-white outline-none focus:border-cyan-500/50"
                    >
                      <option value="all">All Factions</option>
                      <option value="Jedi">Jedi</option>
                      <option value="Sith">Sith</option>
                      <option value="Clone Trooper">Clone Trooper</option>
                      <option value="Empire">Empire</option>
                      <option value="Rebel">Rebel</option>
                      <option value="Separatist">Separatist</option>
                      <option value="Droid">Droid</option>
                    </select>
                    <select 
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as any)}
                      className="bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl text-white outline-none focus:border-cyan-500/50"
                    >
                      <option value="power">Sort by Collection Power</option>
                      <option value="name">Sort by Alphabetical Name</option>
                    </select>
                  </div>

                  {/* Selected units in current edited squad */}
                  <div className="space-y-1.5 pt-1.5">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">Squad Formation (Leader in first slot)</span>
                    <div className="flex gap-3 min-h-[50px] bg-zinc-900/30 border border-zinc-800/60 p-2 rounded-xl">
                      {(tempPlayerDefense[selectedSquadIndex.toString()] || []).map((cid, idx) => {
                        const char = allChars.find(c => c.id === cid);
                        return (
                          <div key={cid + '_' + idx} className="px-3 py-2 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 rounded-lg flex items-center gap-1.5 font-mono text-[11px] font-bold">
                            <span>{idx === 0 ? '👑' : ''} {char?.name || cid}</span>
                            <button 
                              onClick={() => {
                                const current = [...(tempPlayerDefense[selectedSquadIndex!.toString()] || [])];
                                const updated = current.filter(id => id !== cid);
                                setTempPlayerDefense({ ...tempPlayerDefense, [selectedSquadIndex!.toString()]: updated });
                              }}
                              className="text-red-400 hover:text-red-300 font-bold ml-1.5"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                      {(tempPlayerDefense[selectedSquadIndex.toString()] || []).length === 0 && (
                        <span className="text-zinc-600 text-xs font-mono self-center pl-2">No units slotted. Tap available characters below to add.</span>
                      )}
                    </div>
                  </div>

                  {/* Character select grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 pt-2 max-h-[300px] overflow-y-auto pr-1">
                    {eligibleCharacters.map(({ progress, char }) => {
                      if (!char) return null;
                      const isSlotted = (tempPlayerDefense[selectedSquadIndex!.toString()] || []).includes(char.id);
                      const isLockedElseWhere = usedDefenseChars.has(char.id);
                      
                      return (
                        <div 
                          key={char.id}
                          onClick={() => {
                            if (isLockedElseWhere) return;
                            const current = [...(tempPlayerDefense[selectedSquadIndex!.toString()] || [])];
                            if (isSlotted) {
                              // remove
                              const updated = current.filter(id => id !== char.id);
                              setTempPlayerDefense({ ...tempPlayerDefense, [selectedSquadIndex!.toString()]: updated });
                            } else {
                              // add
                              if (current.length >= 5) return;
                              current.push(char.id);
                              setTempPlayerDefense({ ...tempPlayerDefense, [selectedSquadIndex!.toString()]: current });
                            }
                          }}
                          className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer font-mono transition text-xs select-none relative ${isLockedElseWhere ? 'bg-zinc-950/60 border-zinc-900/60 text-zinc-600 opacity-40 cursor-not-allowed' : isSlotted ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400' : 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'}`}
                        >
                          <div className="space-y-1">
                            <span className="text-xs font-bold block truncate">{char.name}</span>
                            <span className="text-[9px] text-zinc-500 block uppercase font-black">{char.faction || 'Scoundrel'}</span>
                          </div>
                          <div className="flex justify-between items-center mt-3 text-[9px] text-zinc-500 border-t border-zinc-900/40 pt-1.5">
                            <span>Lvl {progress.level}</span>
                            <span className="text-cyan-500/80 font-bold">G{progress.gearTier}</span>
                          </div>
                          {isLockedElseWhere && (
                            <span className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center font-bold text-[9px] text-zinc-400 uppercase tracking-widest flex-col gap-1.5">
                              <Lock className="w-3.5 h-3.5" /> Sector Defense
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. ATTACK PHASE INTERFACE */}
          {currentMatch.phase === 'attack' && (
            <div className="space-y-8">
              {/* Sector Progress indicators */}
              <div className="holo-panel p-5 rounded-2xl border border-zinc-800 bg-zinc-950/40">
                <h3 className="text-xs font-mono font-black uppercase text-cyan-400 pb-3 border-b border-zinc-900 flex items-center gap-2">
                  ⚔️ Strategic Sector Progress Board
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/40 border border-zinc-800">
                    <span className="font-mono text-[11px] font-bold text-zinc-400">Sector 1 (Outer Layer)</span>
                    <span className={currentMatch.playerClearedSectors?.includes('outer') ? 'text-emerald-400 font-bold text-xs font-mono' : 'text-amber-500 font-mono text-xs'}>
                      {currentMatch.playerClearedSectors?.includes('outer') ? 'CLEARED (+100 Bonus)' : 'ACTIVE (0-2)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/40 border border-zinc-800">
                    <span className="font-mono text-[11px] font-bold text-zinc-400">Sector 2 (Middle Layer)</span>
                    <span className={currentMatch.playerClearedSectors?.includes('middle') ? 'text-emerald-400 font-bold text-xs font-mono' : isSectorLocked('middle') ? 'text-zinc-600 font-mono text-xs flex items-center gap-1' : 'text-amber-500 font-mono text-xs'}>
                      {isSectorLocked('middle') ? <><Lock className="w-3 h-3" /> LOCKED</> : currentMatch.playerClearedSectors?.includes('middle') ? 'CLEARED (+150 Bonus)' : 'ACTIVE (3-5)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/40 border border-zinc-800">
                    <span className="font-mono text-[11px] font-bold text-zinc-400">Sector 3 (Command Layer)</span>
                    <span className={currentMatch.playerClearedSectors?.includes('inner') ? 'text-emerald-400 font-bold text-xs font-mono' : isSectorLocked('inner') ? 'text-zinc-600 font-mono text-xs flex items-center gap-1' : 'text-rose-500 font-mono text-xs animate-pulse'}>
                      {isSectorLocked('inner') ? <><Lock className="w-3 h-3" /> LOCKED</> : currentMatch.playerClearedSectors?.includes('inner') ? 'CLEARED (+250 Bonus)' : 'ACTIVE (6-8)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Roster usage locks indicator */}
              <div className="flex items-center gap-2.5 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800 text-[10px] text-zinc-500 font-mono leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong>ROSTER LOCK ACTIVE:</strong> Used units cannot be redeployed in this match. Characters assigned to defense are locked. Attacks are unlimited.
                </span>
              </div>

              {/* ENEMY SECTOR GROUPS */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* SECTOR 1 (0, 1, 2) */}
                <div className="holo-panel p-5 rounded-2xl border border-zinc-800 bg-zinc-950/40 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                    <span className="font-mono text-[10px] font-black uppercase text-cyan-400">Enemy Sector 1: Outer Layer</span>
                    <span className="text-[9px] font-mono text-zinc-500">Value: 100 Pts</span>
                  </div>
                  
                  <div className="space-y-4">
                    {[0, 1, 2].map(idx => {
                      const opponentSquad = currentMatch.opponentDefense[idx.toString()] || [];
                      const isCleared = currentMatch.playerAttacks?.some((a: any) => a.squadIndex === idx && a.success);
                      const isAttempted = currentMatch.playerAttacks?.filter((a: any) => a.squadIndex === idx);
                      
                      return (
                        <div key={idx} className={`p-4 rounded-xl border relative ${isCleared ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-zinc-900/30 border-zinc-800/80'}`}>
                          <div className="flex justify-between items-center text-xs font-mono font-bold mb-2">
                            <span className="text-zinc-300">Squadron #{idx + 1}</span>
                            <span className={isCleared ? 'text-emerald-400' : 'text-zinc-500'}>
                              {isCleared ? 'CLEARED' : isAttempted?.length > 0 ? `${isAttempted.length} Failed Tries` : 'Hostile Team'}
                            </span>
                          </div>

                          {/* Characters layout */}
                          <div className="flex gap-2 py-1.5 overflow-x-auto scrollbar-none">
                            {opponentSquad.map((cid: string, cidx: number) => {
                              const char = allChars.find(c => c.id === cid);
                              const initials = getCharacterInitials(char?.name || cid);
                              const themeColors = getFactionColor(char);
                              return (
                                <div 
                                  key={cid + '_' + cidx} 
                                  className={`w-10 h-10 rounded-xl bg-gradient-to-b ${themeColors.bg} border ${themeColors.border} shrink-0 flex flex-col items-center justify-center relative overflow-hidden select-none`} 
                                  title={char?.name || cid}
                                >
                                  <span className={`text-[10px] font-black font-mono tracking-tighter ${themeColors.text}`}>
                                    {initials}
                                  </span>
                                  <span className="text-[5px] text-zinc-500 font-mono scale-[0.8] leading-none absolute bottom-0.5 uppercase truncate max-w-full px-0.5">
                                    {char?.faction || 'unit'}
                                  </span>
                                  {cidx === 0 && (
                                    <span className="absolute top-0 right-1 text-[8px]" title="Leader">
                                      👑
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex justify-end items-center pt-2.5 mt-2 border-t border-zinc-900/60">
                            {isCleared ? (
                              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Defeated (+100 Pts)
                              </span>
                            ) : (
                              <button 
                                onClick={() => onLaunchBattle([], opponentSquad, { accountId: currentMatch.opponentId + '_squad_' + idx, username: currentMatch.opponentUsername, avatar: currentMatch.opponentAvatar, title: 'Matched Enemy', profileBorder: '', favoriteCharacter: '', favoriteFaction: '', favoriteEra: '', collectionPower: currentMatch.opponentCollectionPower, galacticSiegeRank: currentMatch.opponentRank, showcaseSquad: opponentSquad, founderBadge: false, betaTesterBadge: false })}
                                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-[10px] font-black rounded-lg uppercase tracking-wider transition flex items-center gap-1"
                              >
                                <Swords className="w-3.5 h-3.5" /> Attack Squad #{idx + 1}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SECTOR 2 (3, 4, 5) */}
                <div className="holo-panel p-5 rounded-2xl border border-zinc-800 bg-zinc-950/40 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                    <span className="font-mono text-[10px] font-black uppercase text-amber-500">Enemy Sector 2: Middle Layer</span>
                    <span className="text-[9px] font-mono text-zinc-500">Value: 150 Pts</span>
                  </div>
                  
                  <div className="space-y-4 relative">
                    {isSectorLocked('middle') && (
                      <div className="absolute inset-0 bg-zinc-950/90 rounded-xl z-20 flex flex-col items-center justify-center p-4 border border-zinc-900/60 backdrop-blur-sm text-center">
                        <Lock className="w-10 h-10 text-zinc-600 animate-pulse mb-3" />
                        <h4 className="font-bold text-zinc-400 font-mono text-xs uppercase tracking-wider">Sector Locked</h4>
                        <p className="text-[9px] text-zinc-600 font-mono mt-1 max-w-xs">
                          Command directives require clearing ALL Outer Sector squads first to capture coordinates.
                        </p>
                      </div>
                    )}

                    {[3, 4, 5].map(idx => {
                      const opponentSquad = currentMatch.opponentDefense[idx.toString()] || [];
                      const isCleared = currentMatch.playerAttacks?.some((a: any) => a.squadIndex === idx && a.success);
                      const isAttempted = currentMatch.playerAttacks?.filter((a: any) => a.squadIndex === idx);
                      
                      return (
                        <div key={idx} className={`p-4 rounded-xl border relative ${isCleared ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-zinc-900/30 border-zinc-800/80'}`}>
                          <div className="flex justify-between items-center text-xs font-mono font-bold mb-2">
                            <span className="text-zinc-300">Squadron #{idx + 1}</span>
                            <span className={isCleared ? 'text-emerald-400' : 'text-zinc-500'}>
                              {isCleared ? 'CLEARED' : isAttempted?.length > 0 ? `${isAttempted.length} Failed Tries` : 'Hostile Team'}
                            </span>
                          </div>

                          {/* Characters layout */}
                          <div className="flex gap-2 py-1.5 overflow-x-auto scrollbar-none">
                            {opponentSquad.map((cid: string, cidx: number) => {
                              const char = allChars.find(c => c.id === cid);
                              const initials = getCharacterInitials(char?.name || cid);
                              const themeColors = getFactionColor(char);
                              return (
                                <div 
                                  key={cid + '_' + cidx} 
                                  className={`w-10 h-10 rounded-xl bg-gradient-to-b ${themeColors.bg} border ${themeColors.border} shrink-0 flex flex-col items-center justify-center relative overflow-hidden select-none`} 
                                  title={char?.name || cid}
                                >
                                  <span className={`text-[10px] font-black font-mono tracking-tighter ${themeColors.text}`}>
                                    {initials}
                                  </span>
                                  <span className="text-[5px] text-zinc-500 font-mono scale-[0.8] leading-none absolute bottom-0.5 uppercase truncate max-w-full px-0.5">
                                    {char?.faction || 'unit'}
                                  </span>
                                  {cidx === 0 && (
                                    <span className="absolute top-0 right-1 text-[8px]" title="Leader">
                                      👑
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex justify-end items-center pt-2.5 mt-2 border-t border-zinc-900/60">
                            {isCleared ? (
                              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Defeated (+150 Pts)
                              </span>
                            ) : (
                              <button 
                                onClick={() => onLaunchBattle([], opponentSquad, { accountId: currentMatch.opponentId + '_squad_' + idx, username: currentMatch.opponentUsername, avatar: currentMatch.opponentAvatar, title: 'Matched Enemy', profileBorder: '', favoriteCharacter: '', favoriteFaction: '', favoriteEra: '', collectionPower: currentMatch.opponentCollectionPower, galacticSiegeRank: currentMatch.opponentRank, showcaseSquad: opponentSquad, founderBadge: false, betaTesterBadge: false })}
                                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-[10px] font-black rounded-lg uppercase tracking-wider transition flex items-center gap-1"
                              >
                                <Swords className="w-3.5 h-3.5" /> Attack Squad #{idx + 1}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SECTOR 3 (6, 7, 8) */}
                <div className="holo-panel p-5 rounded-2xl border border-zinc-800 bg-zinc-950/40 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                    <span className="font-mono text-[10px] font-black uppercase text-rose-500">Enemy Sector 3: Command Center</span>
                    <span className="text-[9px] font-mono text-zinc-500">Value: 250 Pts</span>
                  </div>
                  
                  <div className="space-y-4 relative">
                    {isSectorLocked('inner') && (
                      <div className="absolute inset-0 bg-zinc-950/90 rounded-xl z-20 flex flex-col items-center justify-center p-4 border border-zinc-900/60 backdrop-blur-sm text-center">
                        <Lock className="w-10 h-10 text-zinc-600 animate-pulse mb-3" />
                        <h4 className="font-bold text-zinc-400 font-mono text-xs uppercase tracking-wider">Sector Locked</h4>
                        <p className="text-[9px] text-zinc-600 font-mono mt-1 max-w-xs">
                          Sector unlocked only after completely clearing both Sector 1 and Sector 2 defensive squads.
                        </p>
                      </div>
                    )}

                    {[6, 7, 8].map(idx => {
                      const opponentSquad = currentMatch.opponentDefense[idx.toString()] || [];
                      const isCleared = currentMatch.playerAttacks?.some((a: any) => a.squadIndex === idx && a.success);
                      const isAttempted = currentMatch.playerAttacks?.filter((a: any) => a.squadIndex === idx);
                      
                      return (
                        <div key={idx} className={`p-4 rounded-xl border relative ${isCleared ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-zinc-900/30 border-zinc-800/80'}`}>
                          <div className="flex justify-between items-center text-xs font-mono font-bold mb-2">
                            <span className="text-zinc-300">Squadron #{idx + 1}</span>
                            <span className={isCleared ? 'text-emerald-400' : 'text-zinc-500'}>
                              {isCleared ? 'CLEARED' : isAttempted?.length > 0 ? `${isAttempted.length} Failed Tries` : 'Hostile Team'}
                            </span>
                          </div>

                          {/* Characters layout */}
                          <div className="flex gap-2 py-1.5 overflow-x-auto scrollbar-none">
                            {opponentSquad.map((cid: string, cidx: number) => {
                              const char = allChars.find(c => c.id === cid);
                              const initials = getCharacterInitials(char?.name || cid);
                              const themeColors = getFactionColor(char);
                              return (
                                <div 
                                  key={cid + '_' + cidx} 
                                  className={`w-10 h-10 rounded-xl bg-gradient-to-b ${themeColors.bg} border ${themeColors.border} shrink-0 flex flex-col items-center justify-center relative overflow-hidden select-none`} 
                                  title={char?.name || cid}
                                >
                                  <span className={`text-[10px] font-black font-mono tracking-tighter ${themeColors.text}`}>
                                    {initials}
                                  </span>
                                  <span className="text-[5px] text-zinc-500 font-mono scale-[0.8] leading-none absolute bottom-0.5 uppercase truncate max-w-full px-0.5">
                                    {char?.faction || 'unit'}
                                  </span>
                                  {cidx === 0 && (
                                    <span className="absolute top-0 right-1 text-[8px]" title="Leader">
                                      👑
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex justify-end items-center pt-2.5 mt-2 border-t border-zinc-900/60">
                            {isCleared ? (
                              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Defeated (+250 Pts)
                              </span>
                            ) : (
                              <button 
                                onClick={() => onLaunchBattle([], opponentSquad, { accountId: currentMatch.opponentId + '_squad_' + idx, username: currentMatch.opponentUsername, avatar: currentMatch.opponentAvatar, title: 'Matched Enemy', profileBorder: '', favoriteCharacter: '', favoriteFaction: '', favoriteEra: '', collectionPower: currentMatch.opponentCollectionPower, galacticSiegeRank: currentMatch.opponentRank, showcaseSquad: opponentSquad, founderBadge: false, betaTesterBadge: false })}
                                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-[10px] font-black rounded-lg uppercase tracking-wider transition flex items-center gap-1"
                              >
                                <Swords className="w-3.5 h-3.5" /> Attack Squad #{idx + 1}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 3. ENDED PHASE INTERFACE */}
          {currentMatch.phase === 'ended' && (
            <div className="p-8 border border-zinc-800 rounded-3xl bg-zinc-950/40 text-center space-y-6 max-w-2xl mx-auto backdrop-blur-md">
              <div className="w-16 h-16 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex items-center justify-center mx-auto shadow-inner">
                <Award className="text-amber-500 w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black font-display text-white tracking-wide uppercase">Match Outcome Resolved</h2>
                <p className="text-xs text-zinc-400 font-mono leading-relaxed max-w-md mx-auto">
                  The orbital fleet has synchronized current skirmish results. Sector calculations have concluded.
                </p>
                
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-4 font-mono text-xs">
                  <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
                    <span className="text-zinc-500 uppercase block text-[9px]">Your Final Score</span>
                    <span className="text-lg font-bold text-cyan-400">{currentMatch.playerScore} Pts</span>
                  </div>
                  <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
                    <span className="text-zinc-500 uppercase block text-[9px]">Rival's Score</span>
                    <span className="text-lg font-bold text-rose-400">{currentMatch.opponentScore} Pts</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleForceAdvance}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-black font-mono text-xs rounded-xl uppercase tracking-widest transition"
              >
                Matchmake Next Opponent
              </button>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: STORE */}
      {activeTab === 'store' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-950 p-5 rounded-2xl border border-zinc-900">
            <div>
              <h2 className="text-xl font-bold text-white uppercase font-display">Galactic Siege Requisition Store</h2>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Utilize your earned Siege Tokens to purchase rare Relic components, Character shards, and credit reserves.</p>
            </div>
            <button 
              onClick={handleRefreshStoreCrystals}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-mono text-[10px] font-black rounded-lg uppercase tracking-wide flex items-center gap-1.5 transition"
            >
              Refresh store (50 Crystals)
            </button>
          </div>

          {/* Categories select filter */}
          <div className="flex gap-2 font-mono text-[10px] font-bold overflow-x-auto pb-1 max-w-lg scrollbar-none">
            {['all', 'general', 'relic', 'archives', 'era', 'cosmetics'].map(cat => (
              <button 
                key={cat}
                onClick={() => setStoreCategory(cat as any)}
                className={`px-3 py-1.5 rounded-lg border uppercase transition shrink-0 ${storeCategory === cat ? 'bg-cyan-950/20 border-cyan-500/50 text-cyan-400' : 'bg-zinc-900 border-zinc-800/80 text-zinc-500 hover:text-zinc-300'}`}
              >
                {cat} Supplies
              </button>
            ))}
          </div>

          {/* Store items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {storeItems
              .filter(item => storeCategory === 'all' || item.type === storeCategory)
              .map(item => (
                <div key={item.id} className="holo-panel p-5 rounded-2xl border border-zinc-800/80 bg-zinc-950/30 flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-center text-2xl">
                        {item.icon === 'credit' ? '💵' : item.icon === 'relic' ? '⚙️' : item.icon === 'shards' ? '🧬' : item.icon === 'border' ? '🖼️' : '⚡'}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.name}</h4>
                        <span className="text-[9px] font-mono text-cyan-500 uppercase font-bold">{item.type} supplies</span>
                      </div>
                    </div>
                    {item.weeklyLimit && (
                      <span className="text-[8px] font-mono font-black text-rose-400 uppercase tracking-widest bg-rose-950/20 border border-rose-500/20 px-1.5 py-0.5 rounded">
                        Limit: {item.weeklyLimit} / Wk
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-zinc-900 font-mono text-xs">
                    <div>
                      <span className="text-zinc-500 text-[9px] uppercase block">Cost</span>
                      <span className="font-bold text-cyan-400">{item.cost} Siege Tokens</span>
                    </div>

                    <button 
                      onClick={() => handleBuyItem(item.id, item.cost)}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-black font-mono text-xs rounded-xl uppercase tracking-wider transition shadow-glow"
                    >
                      PURCHASE
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: HISTORY / LOGS */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900">
            <h2 className="text-lg font-bold text-white uppercase font-display">Lifetime PvP Encounter Record</h2>
            <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Historical telemetry records retrieved from sector command logs.</p>
          </div>

          {/* History table */}
          {(!siegeProfile?.history || siegeProfile.history.length === 0) ? (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-3xl font-mono">
              <Hourglass className="w-10 h-10 text-zinc-600 mx-auto mb-2 animate-pulse" />
              <p className="text-xs text-zinc-500">No resolved combat encounters recorded in current database registers.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {siegeProfile.history.map((hist: any, index: number) => (
                <div key={index} className={`p-4 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs ${hist.result === 'victory' ? 'bg-emerald-950/5 border-emerald-500/20' : 'bg-red-950/5 border-red-500/20'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-black px-2 py-0.5 rounded uppercase ${hist.result === 'victory' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'}`}>
                      {hist.result}
                    </span>
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-1 text-sm">vs {hist.opponentUsername}</h4>
                      <p className="text-[9px] text-zinc-500">Planet: {hist.planet} • Completed on {new Date(hist.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right font-mono">
                    <div>
                      <span className="text-zinc-500 text-[9px] block">Match Score</span>
                      <span className="text-zinc-200 text-xs font-bold">{hist.playerScore} - {hist.opponentScore} Pts</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[9px] block">LP Delta</span>
                      <span className={`font-bold text-xs ${hist.ratingChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {hist.ratingChange >= 0 ? '+' : ''}{hist.ratingChange} LP
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: LEADERBOARDS */}
      {activeTab === 'leaderboards' && (
        <div className="space-y-6">
          <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900">
            <h2 className="text-lg font-bold text-white uppercase font-display">Sector Standing Leaderboards</h2>
            <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Real-time planetary rankings of all active outer rim battle commanders.</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden font-mono text-xs">
            <div className="grid grid-cols-12 bg-zinc-900/60 p-4 font-bold text-zinc-400 border-b border-zinc-900 text-[10px] uppercase">
              <span className="col-span-2 text-center">Rank</span>
              <span className="col-span-5">Commander</span>
              <span className="col-span-3 text-right">LP Rating</span>
              <span className="col-span-2 text-right">Div</span>
            </div>

            <div className="divide-y divide-zinc-900">
              {leaderboard.map((user, idx) => {
                const isUs = user.accountId === account.accountId;
                return (
                  <div key={user.accountId} className={`grid grid-cols-12 p-4 items-center ${isUs ? 'bg-cyan-950/10 text-cyan-400 font-bold' : 'text-zinc-300'}`}>
                    <span className="col-span-2 text-center font-bold text-zinc-500">{idx + 1}</span>
                    <span className="col-span-5 truncate">{user.username} {isUs ? '(You)' : ''}</span>
                    <span className="col-span-3 text-right font-bold text-amber-400">{user.galacticSiegeRank || 1000}</span>
                    <span className="col-span-2 text-right text-[10px] text-zinc-500">{user.galacticSiegeRank >= 2500 ? 'Kyber' : 'Bronzium'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: INTERACTIVE TUTORIAL */}
      {activeTab === 'tutorial' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-900 space-y-6 leading-relaxed">
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-900">
              <Globe className="text-cyan-400 w-7 h-7" />
              <div>
                <h2 className="text-xl font-black text-white uppercase font-display">Galactic Siege Tactical Academy</h2>
                <span className="text-[10px] text-zinc-500 font-mono uppercase">Holographic training module loaded</span>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs text-zinc-400">
              <div className="space-y-1.5">
                <h4 className="text-white font-bold uppercase text-sm">1. Competitive Match Cycles</h4>
                <p>
                  Every Siege battle lasts for **2 Days (Real-time)** or is manually accelerated by developers.
                </p>
                <p className="pl-3 border-l-2 border-cyan-500/40">
                  - **Day 1: Defense Phase:** Commanders setup, clear, or copy defensive formations. Once locked, squad formations cannot be modified.
                </p>
                <p className="pl-3 border-l-2 border-rose-500/40">
                  - **Day 2: Attack Phase:** Players attack their opponent's defensive layout sector by sector. Your placed defense squads are fully locked from attack.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-white font-bold uppercase text-sm">2. Structural Order of Attack</h4>
                <p>
                  Enemy defensive shields are divided into **3 distinct layers / Sectors**:
                </p>
                <p className="pl-3 border-l-2 border-zinc-700">
                  - **Sector 1 (Outer Layer):** Contains 3 squads. Defeat all 3 to pierce the perimeter.
                </p>
                <p className="pl-3 border-l-2 border-zinc-700">
                  - **Sector 2 (Middle Layer):** Unlocks after Sector 1 is completely wiped out.
                </p>
                <p className="pl-3 border-l-2 border-zinc-700">
                  - **Sector 3 (Command Layer):** Unlocks after Sector 2 is completely wiped out.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-white font-bold uppercase text-sm">3. Score & Bonus Calculations</h4>
                <p>Your total match score is calculated with extreme tactical precision:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Sector Clears: Sector 1 (+100 Pts), Sector 2 (+150 Pts), Sector 3 (+250 Pts).</li>
                  <li>Efficiency Bonus: First attempts win (+50 Pts), Second attempt (+25 Pts).</li>
                  <li>Survival Bonus: +5 Pts per surviving ally.</li>
                  <li>Full health/protection buffs: +2 Pts per ally with pristine health or shield status.</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-white font-bold uppercase text-sm">4. Persistent Rewards & Store</h4>
                <p>
                  Claim daily salaries in **Siege Tokens** based on your active division. Mythic division grants high кристал bonuses, credits, and supplies to accelerate your characters.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
