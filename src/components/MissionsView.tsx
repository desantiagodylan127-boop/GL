import React, { useState } from 'react';
import { SaveState, MissionDef } from '../types';
import { MISSIONS } from '../data/missions';
import { Award, CheckCircle2, ChevronRight, Shield, Target } from 'lucide-react';

interface MissionsViewProps {
  saveState: SaveState;
  onUpdateState: (newState: SaveState) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({ saveState, onUpdateState }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'achievement'>('daily');
  const [claimedReward, setClaimedReward] = useState<{ name: string; credits?: number; crystals?: number; energy?: number } | null>(null);

  const missionProgress = saveState.missionProgress || {};
  const claimedMissions = saveState.claimedMissions || [];

  function claimMission(mission: MissionDef) {
    if (claimedMissions.includes(mission.id)) return;

    // Strict validation: cannot claim if progress is less than target
    const progress = missionProgress[mission.id] || 0;
    if (progress < mission.target) return;

    const copy = { ...saveState };
    if (!copy.claimedMissions) copy.claimedMissions = [];
    copy.claimedMissions.push(mission.id);

    // Apply and show rewards
    if (mission.reward) {
      if (mission.reward.credits) {
        copy.credits = (copy.credits || 0) + mission.reward.credits;
      }
      if (mission.reward.crystals) {
        copy.crystals = (copy.crystals || 0) + mission.reward.crystals;
      }
      if (mission.reward.energy) {
        copy.energy = (copy.energy || 0) + mission.reward.energy;
      }
      setClaimedReward({
        name: mission.name,
        credits: mission.reward.credits,
        crystals: mission.reward.crystals,
        energy: mission.reward.energy
      });
    }

    // Force progress to target to show full completion state
    if (!copy.missionProgress) copy.missionProgress = {};
    copy.missionProgress[mission.id] = mission.target;

    if (!copy.battleLog) copy.battleLog = [];
    copy.battleLog.push(`✅ Completed Directive: ${mission.name}`);
    
    // Check daily completionist
    if (mission.type === 'daily') {
       let dailyCompleted = 0;
       MISSIONS.filter(m => m.type === 'daily' && m.id !== 'daily_all_complete').forEach(m => {
           if (copy.claimedMissions!.includes(m.id)) dailyCompleted++;
       });
       copy.missionProgress['daily_all_complete'] = dailyCompleted;
       // If daily completed is 4, also complete the daily completionist directive
       if (dailyCompleted >= 4 && !copy.claimedMissions.includes('daily_all_complete')) {
          copy.claimedMissions.push('daily_all_complete');
          copy.missionProgress['daily_all_complete'] = 4;
          const compMission = MISSIONS.find(m => m.id === 'daily_all_complete');
          if (compMission && compMission.reward) {
            if (compMission.reward.credits) copy.credits = (copy.credits || 0) + compMission.reward.credits;
            if (compMission.reward.crystals) copy.crystals = (copy.crystals || 0) + compMission.reward.crystals;
            if (compMission.reward.energy) copy.energy = (copy.energy || 0) + compMission.reward.energy;
          }
       }
    }

    onUpdateState(copy);
  }

  const renderTabContent = (type: 'daily' | 'weekly' | 'achievement' | 'hidden') => {
    // Hidden achievements show in achievements list ONLY if progress > 0
    let typeMissions = MISSIONS.filter(m => m.type === type);
    if (type === 'achievement') {
       const hidden = MISSIONS.filter(m => m.type === 'hidden' && (missionProgress[m.id] > 0 || claimedMissions.includes(m.id)));
       typeMissions = [...typeMissions, ...hidden];
    }
    
    return typeMissions.map(m => {
      const progress = missionProgress[m.id] || 0;
      const isClaimed = claimedMissions.includes(m.id);
      const isComplete = progress >= m.target;
      const pct = Math.min(100, Math.round((progress / m.target) * 100));

      return (
        <div key={m.id} className="bg-black/60 border border-emerald-500/20 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center group shadow-inner relative overflow-hidden">
          {(!isClaimed && isComplete) && <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none"></div>}
          
          <div className="flex-1 w-full relative z-10">
             <div className="flex items-center gap-2 mb-1">
               {m.type === 'hidden' && <span className="text-[9px] bg-purple-500/20 border border-purple-500/30 text-purple-400 px-1 py-0.5 rounded font-black uppercase tracking-widest font-mono">HIDDEN</span>}
               <h4 className="text-white font-display font-black tracking-widest uppercase">{m.name}</h4>
             </div>
             <p className="text-[10px] text-zinc-400 font-mono mb-2">{m.description}</p>
             
             <div className="flex items-center gap-3 w-full md:w-3/4">
               <div className="w-full bg-black h-2 rounded-full border border-emerald-500/20 overflow-hidden shadow-inner flex-1">
                 <div className="h-full bg-emerald-400 glow-neon transition-all" style={{ width: `${pct}%` }}></div>
               </div>
               <span className={`text-[10px] font-mono font-black ${isComplete ? 'text-emerald-400' : 'text-zinc-500'}`}>
                 {progress} / {m.target}
               </span>
             </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col items-center md:items-end w-full md:w-auto relative z-10">
             {isClaimed ? (
               <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-400/50 px-4 py-2 rounded text-[10px] font-mono font-bold flex items-center gap-2">
                 <CheckCircle2 className="w-3 h-3" /> CLAIMED
               </div>
             ) : isComplete ? (
               <button 
                 onClick={() => claimMission(m)}
                 className="px-6 py-2 rounded uppercase font-black tracking-widest text-[10px] transition font-mono bg-emerald-500/20 border border-emerald-400 text-emerald-300 hover:bg-emerald-500/40 glow-neon shadow-glow cursor-pointer animate-pulse"
               >
                 Claim
               </button>
             ) : (
               <div className="bg-zinc-950/60 border border-zinc-800/40 text-zinc-500 px-4 py-2 rounded text-[10px] font-mono font-bold uppercase tracking-wider select-none">
                 In Progress
               </div>
             )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn holo-panel-container pb-20 pt-8" id="missions_view">
      
      {/* Intro Header */}
      <div className="holo-panel border-emerald-500/20 p-8 rounded-3xl space-y-4 relative overflow-hidden box-glow h-full">
        <div className="absolute inset-0 scan-overlay pointer-events-none opacity-[0.03]"></div>
        
        <div className="border-b border-emerald-500/20 pb-4 relative z-10 flex flex-col gap-2">
          <h2 className="font-display text-2xl font-black text-white tracking-widest uppercase flex items-center gap-3 drop-shadow-md">
            <Target className="w-6 h-6 text-emerald-400 glow- neon" />
            Galactic Directives
          </h2>
          <p className="text-emerald-200/60 font-mono text-[10px] uppercase tracking-wide leading-relaxed max-w-2xl">
            Complete assigned objectives to secure vital resources for the continuing conflict. Daily directives reset at 0000h standard galactic time.
          </p>
        </div>

        {/* Primary Sub-Nav */}
        <div className="flex gap-4 border-b border-emerald-500/20 pb-0 relative z-10 mt-6">
          <button 
            onClick={() => setActiveTab('daily')}
            className={`uppercase font-mono text-[11px] font-black pb-3 px-3 transition border-b-2 ${activeTab === 'daily' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-emerald-500/50 hover:text-emerald-300'}`}
          >
            Daily
          </button>
          <button 
            onClick={() => setActiveTab('weekly')}
            className={`uppercase font-mono text-[11px] font-black pb-3 px-3 transition border-b-2 ${activeTab === 'weekly' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-emerald-500/50 hover:text-emerald-300'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setActiveTab('achievement')}
            className={`uppercase font-mono text-[11px] font-black pb-3 px-3 transition border-b-2 ${activeTab === 'achievement' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-emerald-500/50 hover:text-emerald-300'}`}
          >
            Achievements
          </button>
        </div>

        <div className="space-y-4 relative z-10 max-h-[60vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
           {renderTabContent(activeTab)}
        </div>
      </div>

      {claimedReward && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-zinc-950 border border-emerald-500/30 p-6 rounded-3xl max-w-sm w-full text-center space-y-5 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
            
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce-slow shadow-glow">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1 text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">Directive Accomplished</span>
              <h3 className="font-display font-black text-white text-lg uppercase tracking-wider">{claimedReward.name}</h3>
            </div>

            <div className="bg-black/50 border border-zinc-900/60 p-4 rounded-2xl flex justify-center gap-4 font-mono text-xs">
              {claimedReward.credits && (
                <div className="text-center">
                  <span className="text-zinc-500 block text-[9px] font-bold uppercase">Credits</span>
                  <span className="text-amber-400 font-bold">+{claimedReward.credits.toLocaleString()}</span>
                </div>
              )}
              {claimedReward.crystals && (
                <div className="text-center">
                  <span className="text-zinc-500 block text-[9px] font-bold uppercase">Crystals</span>
                  <span className="text-purple-400 font-bold">+{claimedReward.crystals.toLocaleString()}</span>
                </div>
              )}
              {claimedReward.energy && (
                <div className="text-center">
                  <span className="text-zinc-500 block text-[9px] font-bold uppercase">Tactical Energy</span>
                  <span className="text-emerald-400 font-bold">+{claimedReward.energy.toLocaleString()}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setClaimedReward(null)}
              className="w-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 py-2.5 rounded-xl uppercase font-black font-mono tracking-widest text-[10px] hover:bg-emerald-500 hover:text-black hover:border-emerald-400 transition cursor-pointer"
            >
              Secure Spoils
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
