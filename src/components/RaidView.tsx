import React, { useState } from 'react';
import { SaveState, RaidConfig, PlayerCharacterProgress } from '../types';
import { RAIDS, RAID_SCHEDULE } from '../data/raids';
import { getAllCharacters } from '../data/characters';
import { Play, Shield, Flame, Activity, TrendingUp, Sparkles, Award, Users, Calendar, AlertCircle, Layers, Crosshair } from 'lucide-react';
import { InfoDialog } from './InfoDialog';

interface RaidViewProps {
  saveState: SaveState;
  onLaunchRaidBattle: (raid: RaidConfig, difficultyMultiplier: number) => void;
  onUpdateState: (newState: SaveState) => void;
}

export const RaidView: React.FC<RaidViewProps> = ({
  saveState,
  onLaunchRaidBattle,
  onUpdateState
}) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay();
  const todayName = daysOfWeek[todayIndex];

  function getDailyRaidId(): string {
    const scheduled = RAID_SCHEDULE.find(item => item.dayIndex === todayIndex);
    return scheduled ? scheduled.raidId : 'duel_of_the_fates';
  }

  const dailyFeaturedId = getDailyRaidId();
  const [selectedRaidId, setSelectedRaidId] = useState<string | null>(dailyFeaturedId);
  const [showIntro, setShowIntro] = useState(!saveState.stats?.['seen_raid_intro']);

  const [difficultyMultiplier, setDifficultyMultiplier] = useState<number>(1.0);

  React.useEffect(() => {
    // legacy hook 
  }, [selectedRaidId, saveState.raidPhaseSelections]);

  const raidsList = React.useMemo(() => {
    const baseList = saveState.customRaids || RAIDS;
    return RAID_SCHEDULE.map(sched => baseList.find(r => r.id === sched.raidId)).filter(Boolean) as RaidConfig[];
  }, [saveState.customRaids]);

  const activeRaid = raidsList.find(r => r.id === selectedRaidId) || raidsList[0];
  const allCharacters = getAllCharacters();
  const unlockedCharacters = (Object.values(saveState.characters) as PlayerCharacterProgress[]).filter(c => c.unlocked);

  // Filter selectable roster to those matching raid factions
  const raidEligibleCharacters = unlockedCharacters.filter(prog => {
    const char = allCharacters.find(c => c.id === prog.id);
    if (!char || !activeRaid) return false;
    return char.tags.some(t => activeRaid.recommendedFactions.includes(t)) || 
           activeRaid.recommendedFactions.includes(char.faction);
  });

  function handleDeployRaid() {
    if (!activeRaid) return;

    const remainingAttempts = saveState.globalRaidAttempts ?? 3;
    if (remainingAttempts <= 0) {
      alert("No tactical squad attempts remaining today! Wait for daily server reset or unlock reset in Admin Panel.");
      return;
    }

    onLaunchRaidBattle(activeRaid, difficultyMultiplier);
  }

  function getRaidEnvironment(raidId: string) {
    switch (raidId) {
      case 'duel_of_the_fates': return 'environment-capital-ship';
      case 'battle_of_kamino': return 'environment-underwater-facility';
      case 'battle_of_hoth': return 'environment-hoth-base';
      case 'fortress_inquisitorius_raid': return 'environment-underwater-facility';
      case 'rescue_of_rotta': return 'environment-tatooine-junkyard';
      case 'death_star_siege_raid': return 'environment-death-star';
      case 'spark_eternal_raid': return 'environment-capital-ship';
      case 'geonosian_coliseum': return 'environment-tatooine-dunes';
      default: return 'environment-tatooine-dunes';
    }
  }

  const cumulativeScore = saveState.raidScores[selectedRaidId || ''] || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn holo-panel-container pb-20" id="raid_view_container">
      {showIntro && (
        <InfoDialog 
          title="Raid Operations" 
          content={
            <>
               <p>Raids are multi-phase boss encounters. The active Raid rotates daily.</p>
               <p>Deal as much damage as possible within the allowed attempts. Once a phase boss is defeated, you advance to harder phases for higher reward progression at the end of the day!</p>
            </>
          }
          onClose={() => {
             setShowIntro(false);
             const copy = { ...saveState };
             if (!copy.stats) copy.stats = {};
             copy.stats['seen_raid_intro'] = 1;
             onUpdateState(copy);
          }}
        />
      )}
      {/* High deck phases picker column */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* DAILY ROTATION SCHEDULE SELECTORS BAR */}
        <div className="holo-panel p-6 rounded-3xl space-y-5 relative overflow-hidden" id="raid_rotation_dashboard">
          <div className="absolute inset-0 scan-overlay pointer-events-none opacity-[0.05]"></div>
          <div className="flex items-center justify-between relative z-10 border-b border-cyan-500/20 pb-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Rotation Hub ({todayName} Server Day)
            </h3>
            <span className="text-[10px] font-mono text-cyan-500/50 uppercase tracking-widest font-black">Automatic daily cycle sync</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
            {raidsList.map(raid => {
              const isRotatedIn = raid.id === dailyFeaturedId;
              const isSelected = raid.id === selectedRaidId;

              const scheduleInfo = RAID_SCHEDULE.find(item => item.raidId === raid.id);
              const charInfo = scheduleInfo ? allCharacters.find(c => c.id === scheduleInfo.characterId) : null;

              return (
                <div 
                  key={raid.id}
                  onClick={() => setSelectedRaidId(raid.id)}
                  className={`cursor-pointer border p-4 rounded-2xl flex flex-col justify-between transition-all duration-300 h-auto min-h-[120px] py-3.5 relative overflow-hidden group ${
                    isSelected 
                      ? 'bg-rose-500/10 border-rose-500/50 shadow-glow' 
                      : 'bg-black/40 border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-950/30'
                  }`}
                >
                  {isSelected && <div className="absolute inset-0 bg-gradient-to-t from-rose-500/20 to-transparent pointer-events-none"></div>}
                  {isRotatedIn && !isSelected && <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none"></div>}

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                      <h4 className={`font-display font-black tracking-widest text-xs uppercase ${isSelected ? 'text-rose-400 glow-neon' : 'text-cyan-100/90'}`}>{raid.name}</h4>
                      {scheduleInfo && (
                        <span className="text-[8px] font-mono font-bold bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded uppercase">
                          {scheduleInfo.dayName}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-cyan-500/60 font-mono flex items-center gap-1.5 uppercase font-bold truncate">
                       <Crosshair className="w-3 h-3" /> Target: {raid.bossName}
                    </span>
                    {charInfo && (
                      <span className="text-[9px] text-amber-400 font-mono flex items-center gap-1 uppercase font-black tracking-wider mt-1.5">
                         ✨ Exclusive: {charInfo.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono pt-3 border-t border-cyan-500/10 relative z-10 mt-2">
                    {isRotatedIn ? (
                      <span className="text-emerald-400 font-black tracking-widest flex items-center gap-1.5 glow-neon">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> FEATURED LOGS
                      </span>
                    ) : (
                      <span className="text-cyan-500/40 font-bold tracking-widest">ARCHIVED DATA</span>
                    )}
                    {isRotatedIn && (
                      <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-black px-2 py-0.5 rounded text-[8px] tracking-widest shadow-inner">+25% CACHE</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Raid Overview Header */}
        {activeRaid && (
          <div className="space-y-6">
            <div className={`h-48 rounded-3xl border border-zinc-800 shadow-inner overflow-hidden relative ${getRaidEnvironment(activeRaid.id)}`}>
               <div className="absolute inset-0 scan-overlay mix-blend-overlay opacity-30 pointer-events-none"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
            </div>
            
            <div className={`holo-panel border p-8 rounded-3xl space-y-5 relative overflow-hidden ${activeRaid.id === 'duel_of_the_fates' ? 'bg-red-950/20 border-red-500/40 box-glow-rose' : 'border-indigo-500/30 box-glow-purple'}`}>
               <div className="absolute inset-0 scan-overlay pointer-events-none opacity-20"></div>
            {activeRaid.id === 'duel_of_the_fates' && (
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            )}
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-3 py-1.5 rounded-md font-mono uppercase font-black tracking-widest leading-none border shadow-inner ${activeRaid.id === 'duel_of_the_fates' ? 'bg-red-950/50 border-red-500/60 text-red-400 box-glow-rose' : 'bg-rose-500/10 border-rose-500/40 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'}`}>
                    SIEGE DECK COMMANDER
                  </span>
                  {activeRaid.id === dailyFeaturedId && (
                    <span className="bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 text-[10px] px-3 py-1.5 rounded-md font-mono font-black tracking-widest shadow-glow">
                      ACTIVE FREQUENCY
                    </span>
                  )}
                  {activeRaid.id === 'duel_of_the_fates' && (
                    <span className="bg-red-950/60 border border-red-500 animate-pulse text-red-300 text-[10px] px-3 py-1.5 rounded-md font-mono font-black tracking-widest flex items-center gap-2 shadow-inner">
                      <Layers className="w-3.5 h-3.5" /> RED DATACRON
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-[10px] uppercase font-mono font-black tracking-widest text-indigo-400/60 mb-1.5">Raid Treasury</div>
                  <div className="text-sm font-black font-mono text-indigo-400 flex items-center gap-2 bg-indigo-950/40 border border-indigo-500/40 px-3.5 py-1.5 rounded-xl shadow-glow">
                    <Shield className="w-4 h-4" />
                    {(saveState.inventory['raid_token'] || 0).toLocaleString()}
                  </div>
                </div>
              </div>
              <h2 className={`font-display text-3xl font-black tracking-wider mt-4 drop-shadow-md ${activeRaid.id === 'duel_of_the_fates' ? 'text-red-400 glow-neon' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white'}`}>{activeRaid.name}</h2>
              <p className={`text-sm mt-3 leading-relaxed italic font-mono max-w-2xl ${activeRaid.id === 'duel_of_the_fates' ? 'text-red-200/70' : 'text-indigo-200/70'}`}>"{activeRaid.desc}"</p>

              {/* Day's exclusive Raid Shop Character Reward Banner */}
              {(() => {
                const activeSched = RAID_SCHEDULE.find(s => s.raidId === activeRaid.id);
                const activeChar = activeSched ? allCharacters.find(c => c.id === activeSched.characterId) : null;
                if (!activeChar) return null;
                return (
                  <div className="mt-5 bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/30 p-4 rounded-2xl flex items-center gap-4 relative z-10 shadow-inner">
                    <span className="text-3xl">🧬</span>
                    <div>
                      <h4 className="text-amber-300 font-display font-black text-[10px] uppercase tracking-widest">Raid-Exclusive Character Reward</h4>
                      <p className="text-white font-mono font-black text-sm">{activeChar.name}</p>
                      <p className="text-zinc-400 text-[10px] font-mono mt-1 leading-normal">
                        Only available in the Raid Shop on <strong className="text-amber-400 font-bold uppercase">{activeSched.dayName}s</strong> (the day of this raid!).
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className={`flex gap-2 text-xs font-black uppercase tracking-widest py-3 border-t relative z-10 ${activeRaid.id === 'duel_of_the_fates' ? 'text-red-500 border-red-500/20' : 'text-red-400 border-indigo-500/20'}`}>
              <Flame className="w-4 h-4" /> All Phases will be deployed consecutively.
            </div>
          </div>
        </div>
        )}

        {/* Phase Detailed Mechanics briefing card */}
        {activeRaid && activeRaid.phases[0] && (
          <div className="holo-panel border-amber-500/30 p-8 rounded-3xl relative overflow-hidden space-y-6 box-glow shadow-inner">
            <div className="absolute inset-0 scan-overlay pointer-events-none opacity-[0.03]"></div>
            <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-[0.03]">
              <Flame className="w-64 h-64 text-amber-500" />
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-amber-500/20 flex-wrap gap-2 text-xs font-mono relative z-10">
              <span className="text-amber-500 font-black uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="w-4 h-4"/> STAGE 1 COMPILATION BRIEFING
              </span>
              <span className="text-rose-400 font-bold bg-rose-950/40 px-3 py-1 rounded-md border border-rose-500/30 shadow-inner tracking-widest text-[10px]">
                Boss HP Pool: {activeRaid.phases[0].bossHp.toLocaleString()}
              </span>
            </div>

            <div className="space-y-5 text-sm font-sans relative z-10">
              <h4 className="font-display font-medium text-amber-100/90 flex items-start gap-2.5 leading-snug">
                <Shield className="w-5 h-5 text-amber-400 inline shrink-0 mt-0.5" /> 
                <span className="flex-1"><strong className="text-amber-400 font-black tracking-wide mr-2 uppercase">Objective:</strong> {activeRaid.phases[0].objectiveDesc}</span>
              </h4>
              
              {/* Environmental effects */}
              <div className="bg-black/40 border border-amber-500/10 p-5 rounded-2xl shadow-inner">
                <p className="text-[10px] font-mono uppercase text-amber-500 mb-3 font-black tracking-widest flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5" /> Rencounter Hazards:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {activeRaid.phases[0].environmentalEffects.map((env, i) => (
                    <span key={i} className="bg-rose-950/40 border border-rose-500/40 px-3 py-1.5 rounded-lg text-rose-300 text-[11px] font-mono font-bold shadow-inner">
                      ▲ {env}
                    </span>
                  ))}
                </div>
              </div>

              {/* Unique mechanics ticks */}
              <div className="bg-black/40 border border-amber-500/10 p-5 rounded-2xl shadow-inner">
                <p className="text-[10px] font-mono uppercase text-amber-500 mb-3 font-black tracking-widest flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" /> Tactical Action Counter-Mechanics:
                </p>
                <ul className="space-y-2.5 text-amber-100/70 list-disc pl-5 font-mono text-xs">
                  {activeRaid.phases[0].mechanics.map((mec, i) => (
                    <li key={i} className="leading-relaxed pl-1">{mec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Quick Load Saved Teams */}
        {/* Raid Guidelines */}
        <div className="holo-panel p-6 rounded-3xl space-y-4">
          <h4 className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-black flex items-center gap-2">
            <Sparkles className="w-4 h-4"/> Raid Assault Guidelines
          </h4>
          <p className="text-xs text-indigo-200/70 leading-relaxed font-mono">
            Click <strong className="text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded">Launch Assault</strong> to initiate deployment setup. You will assemble your 5-character strike team on the subsequent tactical console. Faction eligibility criteria will be strictly checked and enforced.
          </p>
          <div className="bg-indigo-950/30 border border-indigo-500/30 p-4 rounded-xl flex flex-col gap-3 text-xs mt-4 shadow-inner">
            <span className="text-indigo-400 font-mono font-black tracking-widest uppercase text-[10px]">Authorized Factions:</span>
            <div className="flex gap-2 flex-wrap">
              {activeRaid.recommendedFactions.map(f => (
                <span key={f} className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-sm text-[10px] font-mono font-bold border border-indigo-400/40 uppercase shadow-glow">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cumulative details & triggers side panel */}
      <div className="space-y-6">
        <div className="holo-panel p-7 rounded-3xl space-y-6 text-sm relative overflow-hidden box-glow" id="raid_scoring_dashboard">
          <div className="absolute inset-0 scan-overlay pointer-events-none opacity-20"></div>
          <div className="flex items-center gap-2 pb-3 border-b border-cyan-500/20 uppercase tracking-widest text-cyan-400 font-mono text-xs font-black relative z-10">
            <TrendingUp className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Scoring Terminals
          </div>

          <div className="bg-black/60 p-5 rounded-2xl border border-indigo-500/30 text-center relative z-10 shadow-inner group transition-all hover:border-indigo-400">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400/70 font-bold block mb-2">Current Raid Tokens</span>
            <div className="font-display font-black text-4xl text-indigo-400 tracking-wider flex justify-center items-center gap-3 drop-shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-transform group-hover:scale-105">
              <Shield className="w-8 h-8 text-indigo-500" />
              {saveState.inventory['raid_token'] ? saveState.inventory['raid_token'].toLocaleString() : 0}
            </div>
            <p className="text-[9px] font-mono text-indigo-500/50 mt-3 font-bold uppercase tracking-widest">Available for Raid Exclusives in Shop</p>
          </div>

          <div className="bg-black/60 p-5 rounded-2xl border border-rose-500/30 text-center relative z-10 shadow-inner group transition-all hover:border-rose-400">
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400/70 font-bold block mb-2">Cumulative Recorded Score</span>
            <div className="font-display font-black text-4xl text-rose-500 tracking-wider transition-transform group-hover:scale-105 drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]">
              {cumulativeScore.toLocaleString()}
            </div>
            <p className="text-[9px] font-mono text-rose-500/50 mt-3 font-bold uppercase tracking-widest">Damage points recorded overall</p>
          </div>

          {activeRaid && (
            <div className="bg-black/60 p-5 rounded-2xl border border-emerald-500/30 text-center relative z-10 shadow-inner space-y-2 group transition-all hover:border-emerald-400">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/70 font-bold block">Daily Siege Attempts Remaining</span>
              <div className="font-display font-black text-3xl text-emerald-400 tracking-wider transition-transform group-hover:scale-105 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]">
                {saveState.globalRaidAttempts ?? 3} / 3
              </div>
              <p className="text-[9px] font-mono text-emerald-500/50 mt-1 font-bold uppercase tracking-widest">Locks squad and payouts on 0 attempts</p>
              
              <button 
                onClick={() => {
                   const updated = { ...saveState };
                   updated.globalRaidAttempts = 3;
                   if (!updated.raidAttemptsRemaining) updated.raidAttemptsRemaining = {};
                   updated.raidAttemptsRemaining[activeRaid.id] = 3;
                   localStorage.setItem(`save_${updated.playerId}`, JSON.stringify(updated));
                   localStorage.setItem('swgoh_clone_save_v4', JSON.stringify(updated));
                   window.location.reload();
                }}
                className="mt-3 bg-emerald-950/40 border border-emerald-500 hover:bg-emerald-500/30 text-[9px] font-mono font-bold tracking-widest text-emerald-300 px-3 py-1.5 rounded uppercase"
              >
                Reset Attempts
              </button>
            </div>
          )}

          <div className="space-y-4 text-xs relative z-10 pt-2 border-t border-cyan-500/10 mt-2">
            <h5 className="uppercase font-mono text-cyan-400 font-black tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4"/> Synergy Priority Tags
            </h5>
            <div className="flex flex-wrap gap-2">
              {activeRaid?.recommendedFactions.map(tag => (
                <span key={tag} className="bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold tracking-wider text-cyan-300 uppercase shadow-glow">
                  {tag}
                </span>
                ))}
            </div>
            <p className="text-cyan-200/60 leading-relaxed font-mono mt-1">
              Recommended factions trigger special tactical buffs, counter capital deck hazards and optimize score performance.
            </p>
          </div>

          {/* Day indication board */}
          {activeRaid && activeRaid.id !== dailyFeaturedId && (
            <div className="bg-rose-950/30 border border-rose-500/40 p-4 rounded-xl text-rose-300 text-xs flex gap-3 relative z-10 shadow-inner">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
              <span className="font-mono leading-relaxed">
                <strong className="text-rose-400">NOTE:</strong> This raid is not today's daily rotation. You can still test it, but daily rotation rewards are focused on the daily active featured target.
              </span>
            </div>
          )}

          <div className="pt-4 pb-2 relative z-10 w-full text-left">
            <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-2">Raid Difficulty Tier</label>
            <select 
              value={difficultyMultiplier}
              onChange={(e) => setDifficultyMultiplier(parseFloat(e.target.value))}
              className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2.5 text-xs text-white font-mono uppercase focus:border-rose-500 outline-none"
            >
              <option value={1.0}>Tier 1 (Base - Gear 11/12)</option>
              <option value={1.5}>Tier 2 (Heroic - Relic 3+)</option>
              <option value={3.0}>Tier 3 (Mythic - Relic 7+)</option>
              <option value={6.0}>Tier 4 (Legendary - Relic 9+)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-cyan-500/20 relative z-10">
            <button 
              onClick={handleDeployRaid}
              className="w-full bg-rose-500/10 border border-rose-500/50 hover:bg-rose-500/30 hover:border-rose-400 text-rose-400 px-4 py-4 rounded-xl font-display font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-glow hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]"
              id="deploy_force_raid_btn"
            >
              <Shield className="w-5 h-5" /> 
              <span>LAUNCH ASSAULT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
