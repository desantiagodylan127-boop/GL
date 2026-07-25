import React, { useState, useEffect } from 'react';
import { SaveState, CombatState } from '../types';
import { Sparkles, Calendar, Activity, Users, Shield, Target, Play, Award, Check } from 'lucide-react';
import { SquadSelectView } from './SquadSelectView';
import { CombatBattleView } from './CombatBattleView';
import { getAllCharacters, ERA_IDS, CLONE_WARS_ERA_IDS, NEW_REPUBLIC_ERA_IDS } from '../data/characters';
import { getEraLevelUpCost, getEraConversion } from '../utils/eraConverter';
import { InfoDialog } from './InfoDialog';
import { GAME_ACTIVE_ERA } from '../data/eraConfig';

interface Props {
  saveState: SaveState;
  onUpdateState: (st: SaveState) => void;
  activeTab: string;
  onLaunchBattle: (battleFn: () => any) => void;
  onExitBattle?: () => void;
}

export const EraView: React.FC<Props> = ({ saveState, onUpdateState, activeTab, onLaunchBattle, onExitBattle }) => {
  const [selectedBattleTier, setSelectedBattleTier] = useState<{ faction: string, tier: number } | null>(null);
  const [showEraEndPopup, setShowEraEndPopup] = useState(false);
  const [showIntro, setShowIntro] = useState(!saveState.stats?.['seen_era_intro']);

  useEffect(() => {
    if (GAME_ACTIVE_ERA === 'new_republic' && saveState.stats?.['cw_era_converted'] !== 1) {
      setShowEraEndPopup(true);
    }
  }, [saveState, GAME_ACTIVE_ERA]);

  const handleApplyConversion = () => {
     const nextState = JSON.parse(JSON.stringify(saveState));
     if (!nextState.stats) nextState.stats = {};
     nextState.stats['cw_era_converted'] = 1;

     // Apply conversions
     if (nextState.characters) {
         Object.values<any>(nextState.characters).forEach(char => {
             if (CLONE_WARS_ERA_IDS.includes(char.id)) {
                 // Force era level to 150 for the start of the New Republic era per user request
                 const eraLevel = 150;
                 const converted = getEraConversion(eraLevel);
                 char.gearTier = Math.max(char.gearTier || 1, converted.gearTier);
                 char.relicLevel = Math.max(char.relicLevel || 0, converted.relicLevel);
                 char.eraLevel = 0;
             }
         });
     }

     onUpdateState(nextState);
     setShowEraEndPopup(false);
  };

  const handleLaunchFrontline = (faction: string, tier: number) => {
     setSelectedBattleTier({ faction, tier });
  };

  const validateCombatArrays = (playerIds: string[], enemyIds: string[]): { validPlayers: string[], validEnemies: string[] } => {
     const allChars = getAllCharacters();
     const validPlayers = playerIds.filter(id => allChars.some(c => c.id === id));
     const validEnemies = enemyIds.filter(id => allChars.some(c => c.id === id));
     
     if (validPlayers.length === 0) {
        console.warn("EraView validation: No valid players found in roster. Falling back to default player unit.");
        validPlayers.push('captain_rex');
     }
     if (validEnemies.length === 0) {
        console.warn("EraView validation: No valid enemies found in roster. Falling back to default enemy units.");
        validEnemies.push('b1_battle_droid', 'b2_super_droid');
     }
     
     return { validPlayers, validEnemies };
  };

  const launchActualCombat = (squad: string[]) => {
      if (!selectedBattleTier) return;
      const { faction, tier } = selectedBattleTier;
      
      let rawEnemyIds: string[] = [];
      if (GAME_ACTIVE_ERA === 'new_republic') {
          rawEnemyIds = faction === 'LightSide'
             ? ['grand_admiral_thrawn', 'commander_enoch', 'night_trooper_peridea', 'death_trooper_peridea', 'scout_trooper_peridea']
             : ['general_hera', 'chopper', 'zeb_nr', 'sabine_apprentice', 'huyang'];
      } else {
          rawEnemyIds = faction === 'LightSide' 
             ? ['dooku_war_council', 'general_grievous_droid', 'b1_battle_droid', 'b2_super_droid', 'nute_gunray']
             : ['general_kenobi', 'general_skywalker', 'commander_cody', 'captain_rex', 'fives'];
      }
         
      const { validPlayers, validEnemies } = validateCombatArrays(squad, rawEnemyIds);
         
      const runBattle = () => {
         const namePrefix = faction === 'LightSide' ? (GAME_ACTIVE_ERA === 'new_republic' ? 'New Republic' : 'Republic') : (GAME_ACTIVE_ERA === 'new_republic' ? 'Remnant' : 'Separatist');
         const bg = faction === 'LightSide' ? (GAME_ACTIVE_ERA === 'new_republic' ? 'lothal' : 'ryloth') : (GAME_ACTIVE_ERA === 'new_republic' ? 'peridea' : 'kamino');
         
         return <CombatBattleView 
                 playerTeamIds={validPlayers}
                 enemyIds={validEnemies}
                 saveState={saveState}
                 onExitCombat={(won, loot) => {
                    if (won) {
                       const stateCopy = JSON.parse(JSON.stringify(saveState));
                       stateCopy.inventory['era_currency'] = (stateCopy.inventory['era_currency'] || 0) + (tier * 50);
                       stateCopy.inventory[`era_frontline_${faction}_${tier}`] = new Date().toISOString().split('T')[0];
                       onUpdateState(stateCopy);
                       alert(`Victory! +${tier * 50} Era Currency`);
                    }
                    if (onExitBattle) onExitBattle();
                 }}
                 rewardNode={{ id: 'era_battle_' + faction + '_' + tier, name: `${namePrefix} Frontline Tier ${tier}`, rewards: [], energyCost: 0, powerRecommended: tier * 3500, background: bg }}
             />;
      };
      onLaunchBattle(runBattle);
      setSelectedBattleTier(null);
  };

  if (selectedBattleTier) {
      let restrictTags: string[] = [];
      let enemiesPreview: string[] = [];
      const namePrefix = selectedBattleTier.faction === 'LightSide' ? (GAME_ACTIVE_ERA === 'new_republic' ? 'New Republic' : 'Republic') : (GAME_ACTIVE_ERA === 'new_republic' ? 'Remnant' : 'Separatist');
      
      if (GAME_ACTIVE_ERA === 'new_republic') {
          restrictTags = selectedBattleTier.faction === 'LightSide' ? ['new_republic'] : ['imperial_remnant', 'exiles'];
          enemiesPreview = selectedBattleTier.faction === 'LightSide' ? ['grand_admiral_thrawn'] : ['general_hera'];
      } else {
          restrictTags = selectedBattleTier.faction === 'LightSide' ? ['Galactic Republic'] : ['Separatist'];
          enemiesPreview = selectedBattleTier.faction === 'LightSide' ? ['dooku_war_council'] : ['general_kenobi'];
      }
      
      return (
         <SquadSelectView 
            saveState={saveState}
            enemies={enemiesPreview}
            restrictTags={restrictTags}
            allowedCharacterIds={GAME_ACTIVE_ERA === 'new_republic' ? NEW_REPUBLIC_ERA_IDS : CLONE_WARS_ERA_IDS}
            onCancel={() => setSelectedBattleTier(null)}
            onLaunch={launchActualCombat}
            nodeName={`${namePrefix} Frontline Tier ${selectedBattleTier.tier}`}
            energyCost={0}
            powerRecommended={selectedBattleTier.tier * 3500}
            rewards={[]}
         />
      );
  }

  if (showEraEndPopup) {
     const cwConvertedUnits = CLONE_WARS_ERA_IDS.filter(id => saveState.characters?.[id]?.unlocked).map(id => saveState.characters[id]);

     return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-[#0A0A0A] border border-amber-500/30 p-8 rounded-2xl max-w-2xl w-full text-center max-h-[90vh] overflow-y-auto hidden-scrollbar">
              <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-6" />
              <h2 className="text-3xl font-display font-black text-white uppercase tracking-widest mb-4">
                 The Clone Wars Era Has Ended
              </h2>
              <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-6">
                 Your active era units have been converted into Legacy (Farmable) units. Their Era Levels have been permanently translated into base Gear Tiers and Relic Levels. You can now farm them in regular Campaign operations alongside other Legacy units.
              </p>
              
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl mb-8 flex flex-col items-center justify-center text-left">
                   <h3 className="font-display font-bold text-lg text-white mb-4 w-full text-center border-b border-zinc-800 pb-2">Your Converted Roster (Force Level 150)</h3>
                   <div className="w-full space-y-2">
                       {cwConvertedUnits.length > 0 ? cwConvertedUnits.map(char => {
                           const eraLevel = 150;
                           const converted = getEraConversion(eraLevel);
                           const charDef = getAllCharacters().find(c => c.id === char.id);
                           const name = charDef ? charDef.name : char.id.replace(/_/g, ' ');
                           return (
                               <div key={char.id} className="flex justify-between items-center bg-black/40 border border-zinc-800 p-2 rounded">
                                   <span className="text-amber-500 font-bold text-xs uppercase">{name}</span>
                                   <span className="text-zinc-400 font-mono text-[10px]">Era Lvl {eraLevel} &rarr; Max(G{converted.gearTier}, R{converted.relicLevel})</span>
                               </div>
                           );
                       }) : (
                           <div className="text-center text-zinc-500 font-mono text-xs py-4">No Clone Wars Era Units acquired.</div>
                       )}
                   </div>
              </div>

              <button 
                 onClick={handleApplyConversion}
                 className="bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-sm px-8 py-3 rounded-xl inline-flex items-center gap-2 transition-colors"
              >
                 <Check className="w-4 h-4" /> Acknowledge Conversion
              </button>
           </div>
        </div>
     );
  }

  if (activeTab === 'era_overview') {
    return (
      <div className="space-y-6 animate-fade-in pb-20">
        {showIntro && (
          <InfoDialog 
            title="Era Operations" 
            content={
              <>
                 <p>The galaxy shifts over time. The active <b>Era</b> dictates which units can be earned via Marquees and Journeys.</p>
                 <p>Collect Era Currency from Frontline Battles to convert into Relic levels for the current feature units!</p>
              </>
            }
            onClose={() => {
               setShowIntro(false);
               const copy = { ...saveState };
               if (!copy.stats) copy.stats = {};
               copy.stats['seen_era_intro'] = 1;
               onUpdateState(copy);
            }}
          />
        )}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-500 text-[10px] font-mono font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3 h-3" /> Current Era Active
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-widest leading-none">
            {GAME_ACTIVE_ERA === 'new_republic' ? 'The New Republic' : 'The Clone Wars'}
          </h2>
          <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mt-4 max-w-2xl leading-relaxed">
            Participate in era events, upgrade era units utilizing universal era currency, and prepare for the ultimate Galactic Legend capstones.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {/* Summary Cards */}
           <div className="bg-black/60 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none"></div>
             <Calendar className="w-8 h-8 text-amber-500 mb-4" />
             <h3 className="font-display font-bold text-lg text-white">12 Week Cycle</h3>
             <p className="text-xs font-mono text-amber-500 mt-2">
                Week {Math.min(12, Math.max(1, Math.floor((Date.now() - new Date('2026-05-30T00:00:00Z').getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1))} of 12
             </p>
             <p className="text-[10px] font-mono text-zinc-500 mt-1">
                {Math.max(0, 12 - Math.floor((Date.now() - new Date('2026-05-30T00:00:00Z').getTime()) / (1000 * 60 * 60 * 24 * 7)) - 1)} weeks remaining
             </p>
           </div>
           
           <div className="bg-black/60 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none"></div>
             <Users className="w-8 h-8 text-amber-500 mb-4" />
             <h3 className="font-display font-bold text-lg text-white">20 Marquee Units</h3>
             <p className="text-xs font-mono text-zinc-500 mt-2">New releases weekly</p>
           </div>
           
           <div className="bg-black/60 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none"></div>
             <Award className="w-8 h-8 text-amber-500 mb-4" />
             <h3 className="font-display font-bold text-lg text-white">2 Galactic Legends</h3>
             <p className="text-xs font-mono text-zinc-500 mt-2">Capstone releases on Week 12</p>
           </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'era_battles') {
     return (
       <div className="space-y-6 animate-fade-in pb-20">
         <header className="mb-6">
           <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest">Frontline Battles</h2>
           <p className="text-zinc-500 font-mono text-xs uppercase mt-2">Deploy Era Units to earn Era Currency for tuning.</p>
         </header>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/60 border border-amber-500/30 p-6 rounded-2xl relative overflow-hidden box-glow-amber">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533246736798-2de56db743fe?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
               
               <div className="relative z-10">
                 <h3 className="font-display font-black text-xl text-amber-400 uppercase tracking-widest mb-1">{GAME_ACTIVE_ERA === 'new_republic' ? 'New Republic Front' : 'Republic Front'}</h3>
                 <p className="text-[10px] font-mono text-zinc-400 mb-4 uppercase">Requires: {GAME_ACTIVE_ERA === 'new_republic' ? 'New Republic Units' : 'Republic Units'}</p>
                 
                 <div className="space-y-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(tier => (
                      <div key={tier} className="bg-black/40 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xs">{tier}</div>
                           <span className="text-zinc-300 font-bold text-sm">Tier {tier}</span>
                         </div>
                         <div className="flex gap-2">
                            <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-1 rounded">+{tier * 50} Era Currency</span>
                            <button 
                               disabled={saveState.inventory[`era_frontline_LightSide_${tier}`] === new Date().toISOString().split('T')[0]}
                               onClick={() => handleLaunchFrontline('LightSide', tier)} 
                               className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1 rounded text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed">
                               {saveState.inventory[`era_frontline_LightSide_${tier}`] === new Date().toISOString().split('T')[0] ? 'Done' : 'Play'}
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
            
            <div className="bg-black/60 border border-amber-500/30 p-6 rounded-2xl relative overflow-hidden box-glow-amber">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621252178229-3b6d26cfecce?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
               
               <div className="relative z-10">
                 <h3 className="font-display font-black text-xl text-amber-400 uppercase tracking-widest mb-1">{GAME_ACTIVE_ERA === 'new_republic' ? 'Remnant Front' : 'Separatist Front'}</h3>
                 <p className="text-[10px] font-mono text-zinc-400 mb-4 uppercase">Requires: {GAME_ACTIVE_ERA === 'new_republic' ? 'Imperial Remnant Units' : 'Separatist Units'}</p>
                 
                 <div className="space-y-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(tier => (
                      <div key={tier} className="bg-black/40 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xs">{tier}</div>
                           <span className="text-zinc-300 font-bold text-sm">Tier {tier}</span>
                         </div>
                         <div className="flex gap-2">
                            <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-1 rounded">+{tier * 50} Era Currency</span>
                            <button 
                               disabled={saveState.inventory[`era_frontline_DarkSide_${tier}`] === new Date().toISOString().split('T')[0]}
                               onClick={() => handleLaunchFrontline('DarkSide', tier)} 
                               className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1 rounded text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed">
                               {saveState.inventory[`era_frontline_DarkSide_${tier}`] === new Date().toISOString().split('T')[0] ? 'Done' : 'Play'}
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
         </div>
       </div>
     );
  }

  if (activeTab === 'era_marquees') {
     const marquees = GAME_ACTIVE_ERA === 'new_republic' ? [
        { id: 'mq_hera', name: 'General Hera Syndulla', charId: 'general_hera', desc: 'Week 1 Release' },
        { id: 'mq_chopper', name: 'C1-10P "Chopper"', charId: 'chopper', desc: 'Week 2 Release' },
        { id: 'mq_huyang', name: 'Professor Huyang', charId: 'huyang', desc: 'Week 3 Release' },
        { id: 'mq_sabine', name: 'Sabine Wren (Apprentice)', charId: 'sabine_apprentice', desc: 'Week 4 Release' },
        { id: 'mq_zeb', name: 'Garazeb Orrelios', charId: 'zeb_nr', desc: 'Week 5 Release' },
     ] : [
        { id: 'mq_rex', name: 'Captain Rex', charId: 'captain_rex', desc: 'Week 1 Release' },
        { id: 'mq_jesse', name: 'CT-5597 "Jesse"', charId: 'jesse', desc: 'Week 2 Release' },
        { id: 'mq_fives', name: 'CT-5555 "Fives"', charId: 'fives', desc: 'Week 3 Release' },
        { id: 'mq_echo', name: 'CT-1409 "Echo"', charId: 'echo_501st', desc: 'Week 4 Release' },
        { id: 'mq_appo', name: 'Commander Appo', charId: 'appo_501st', desc: 'Week 5 Release' },
     ];
     const marqueesTeam2 = GAME_ACTIVE_ERA === 'new_republic' ? [
        { id: 'mq_din', name: 'Din Djarin', charId: 'din_djarin_beskar', desc: 'Week 6 Release' },
        { id: 'mq_paz', name: 'Paz Vizsla', charId: 'paz_vizsla', desc: 'Week 7 Release' },
        { id: 'mq_ig12', name: 'IG-12 & Grogu', charId: 'ig12_grogu', desc: 'Week 8 Release' },
        { id: 'mq_axe', name: 'Axe Woves', charId: 'axe_woves', desc: 'Week 9 Release' },
        { id: 'mq_koska', name: 'Koska Reeves', charId: 'koska_reeves', desc: 'Week 10 Release' },
     ] : [
        { id: 'mq_bx', name: 'BX Commando Droid', charId: 'bx_commando_droid', desc: 'Week 6 Release' },
        { id: 'mq_kelhani', name: 'Kelhani', charId: 'kelhani', desc: 'Week 7 Release' },
        { id: 'mq_droideka', name: 'Droideka', charId: 'droideka', desc: 'Week 8 Release' },
        { id: 'mq_spider', name: 'Dwarf Spider Droid', charId: 'dwarf_spider_droid', desc: 'Week 9 Release' },
        { id: 'mq_magna_elite', name: 'Magna Guard Elite', charId: 'magna_guard_elite', desc: 'Week 10 Release' },
     ];
     const grandMarquees1 = GAME_ACTIVE_ERA === 'new_republic' ? [
        { id: 'gmq_enoch', name: 'Commander Enoch', charId: 'commander_enoch', desc: 'Grand Marquee' },
        { id: 'gmq_night', name: 'Night Trooper', charId: 'night_trooper_peridea', desc: 'Grand Marquee' },
        { id: 'gmq_death', name: 'Death Trooper', charId: 'death_trooper_peridea', desc: 'Grand Marquee' },
        { id: 'gmq_scout', name: 'Scout Trooper', charId: 'scout_trooper_peridea', desc: 'Grand Marquee' },
        { id: 'gmq_shadow', name: 'Shadow Trooper', charId: 'shadow_trooper_peridea', desc: 'Grand Marquee' },
     ] : [
        { id: 'gmq_coleman', name: 'Coleman Kcaj', charId: 'coleman_kcaj', desc: 'Grand Marquee' },
        { id: 'gmq_oppo', name: 'Oppo Rancisis', charId: 'oppo_rancisis', desc: 'Grand Marquee' },
        { id: 'gmq_adi', name: 'Adi Gallia', charId: 'adi_gallia', desc: 'Grand Marquee' },
        { id: 'gmq_luminara', name: 'Luminara Unduli', charId: 'luminara_unduli', desc: 'Grand Marquee' },
        { id: 'gmq_yaddle', name: 'Yaddle', charId: 'yaddle', desc: 'Grand Marquee' },
     ];
     const grandMarquees2 = GAME_ACTIVE_ERA === 'new_republic' ? [
        { id: 'gmq_voss', name: 'Warlord Voss', charId: 'warlord_drake_voss', desc: 'Grand Marquee' },
        { id: 'gmq_mire', name: 'Mire Talon', charId: 'mire_talon', desc: 'Grand Marquee' },
        { id: 'gmq_torr', name: 'Torr Kane', charId: 'torr_kane', desc: 'Grand Marquee' },
        { id: 'gmq_ashen', name: 'Ashen Veil', charId: 'ashen_veil', desc: 'Grand Marquee' },
        { id: 'gmq_hollow', name: 'Hollow', charId: 'hollow', desc: 'Grand Marquee' },
     ] : [
        { id: 'gmq_nute', name: 'Nute Gunray', charId: 'nute_gunray', desc: 'Grand Marquee' },
        { id: 'gmq_dooku', name: 'Count Dooku', charId: 'dooku_war_council', desc: 'Grand Marquee' },
        { id: 'gmq_wat', name: 'Wat Tambor', charId: 'wat_tambor', desc: 'Grand Marquee' },
        { id: 'gmq_lott', name: 'Lott Dod', charId: 'lott_dod', desc: 'Grand Marquee' },
        { id: 'gmq_whorm', name: 'Whorm Loathsom', charId: 'whorm_loathsom', desc: 'Grand Marquee' },
     ];

     const renderMarquee = (mq: any) => {
        const weekStr = mq.desc.toLowerCase().replace('week', '').replace('release', '').trim();
        const charWeek = parseInt(weekStr, 10);
        
        const ERA_START = new Date('2026-05-30T00:00:00Z').getTime();
        const nowMs = Date.now();
        const weeksSinceEpoch = Math.max(0, Math.floor((nowMs - ERA_START) / (1000 * 60 * 60 * 24 * 7)));
        const currentWeek = weeksSinceEpoch + 1;
        const isGrand = mq.desc.includes('Grand Marquee');
        const isLockedByWeek = (!isNaN(charWeek) && currentWeek < charWeek) || (isGrand && currentWeek < 11);
        const displayWeek = isGrand ? 11 : charWeek;

        const lastCompletedKey = `era_mq_completed_${mq.charId}`;
        const lastCompletedDate = saveState.inventory[lastCompletedKey];
        const today = new Date().toISOString().split('T')[0];
        const isCompletedToday = lastCompletedDate === today;
        const prog = saveState.characters[mq.charId];
        const isFullyUnlocked = prog && prog.unlocked;
        const disablePlayButton = isLockedByWeek || (isFullyUnlocked && isCompletedToday);
        const charDef = getAllCharacters().find(c => c.id === mq.charId);
        const bg = (charDef && charDef.faction.toLowerCase().includes('republic')) ? 'ryloth' : 'kamino';

        return (
         <div key={mq.id} className={`bg-black/40 border border-zinc-800 p-4 rounded-xl flex items-center justify-between group transition ${isLockedByWeek ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:border-amber-500/30'}`}>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-700 font-bold text-amber-500">M</div>
               <div>
                  <h4 className="text-zinc-200 font-bold font-display uppercase tracking-wider group-hover:text-amber-400 transition">{mq.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-1">{mq.desc}</p>
               </div>
            </div>
            <button 
              disabled={disablePlayButton}
              onClick={() => {
                 const { validPlayers, validEnemies } = validateCombatArrays([mq.charId], ['b1_battle_droid', 'b2_super_droid']);
                 const runBattle = () => {
                    return <CombatBattleView 
                      playerTeamIds={validPlayers}
                      enemyIds={validEnemies}
                      isMarquee={true} 
                      saveState={saveState}
                      rewardNode={{ id: mq.id, name: `${mq.name} Marquee`, rewards: [], energyCost: 0, powerRecommended: 2000, background: bg }}
                      onExitCombat={(won) => {
                         if (won) {
                            const stateCopy = JSON.parse(JSON.stringify(saveState));
                            const today = new Date().toISOString().split('T')[0];
                            const lastCompletedKey = `era_mq_completed_${mq.charId}`;
                            const lastCompletedDate = stateCopy.inventory[lastCompletedKey];
                            const prog = stateCopy.characters[mq.charId];
                            
                            if (!prog || !prog.unlocked) {
                                stateCopy.characters[mq.charId] = { id: mq.charId, unlocked: true, level: 85, stars: 7, gearTier: 1, gearSlots: [], relicLevel: 0, legendLevel: 0, abilityLevels: {}, eraLevel: 1 };
                                stateCopy.inventory['era_currency'] = (stateCopy.inventory['era_currency'] || 0) + 1000;
                                stateCopy.inventory[lastCompletedKey] = today;
                                alert(`${mq.name} Unlocked! +1000 Era Currency received.`);
                            } else if (lastCompletedDate !== today) {
                                stateCopy.inventory['era_currency'] = (stateCopy.inventory['era_currency'] || 0) + 200;
                                stateCopy.inventory[lastCompletedKey] = today;
                                alert(`Daily Bonus! +200 Era Currency received.`);
                            } else {
                                alert(`You already claimed today's rewards for this marquee.`);
                            }
                            onUpdateState(stateCopy);
                         }
                         if (onExitBattle) onExitBattle();
                      }}
                    />;
                 };
                 onLaunchBattle(runBattle);
              }}
              className="bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black border border-amber-500/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:border-zinc-700 disabled:cursor-not-allowed"
            >
              {isLockedByWeek ? `UNAVAILABLE (WEEK ${displayWeek})` : (disablePlayButton ? 'COMPLETED TODAY' : 'Simulate')}
            </button>
         </div>
      )};

      const ERA_START = new Date('2026-05-30T00:00:00Z').getTime();
      const currentWeek = Math.max(1, Math.floor((Date.now() - ERA_START) / (1000 * 60 * 60 * 24 * 7)) + 1);

     return (
       <div className="space-y-8 animate-fade-in pb-20">
         <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
             <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest">Marquee Events</h2>
             <p className="text-zinc-500 font-mono text-xs uppercase mt-2">Test Drive New Units to unlock them at baseline power (7★ equivalent).</p>
           </div>
           <div className="bg-black/60 border border-amber-500/30 px-4 py-2 rounded-lg text-right min-w-[200px]">
             <div className="text-[10px] text-amber-500/70 font-mono uppercase tracking-widest mb-1">Era Progression</div>
             <div className="text-amber-400 font-bold font-display text-lg">Current: Week {Math.min(12, currentWeek)} / 12</div>
           </div>
         </header>

         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-4">
               <h3 className="text-sm font-bold text-amber-400 font-mono uppercase border-b border-amber-500/30 pb-2 flex items-center gap-2">
                 <Users className="w-4 h-4" /> {GAME_ACTIVE_ERA === 'new_republic' ? "Spectre Introductions" : "501st Introductions"}
                 <span className="ml-auto text-[10px] text-amber-500/50">Phase 1</span>
               </h3>
               {marquees.map(renderMarquee)}

               <h3 className="text-sm font-bold text-blue-400 font-mono uppercase border-b border-blue-500/30 pb-2 pt-6 flex items-center gap-2 mt-8">
                 <Users className="w-4 h-4" /> {GAME_ACTIVE_ERA === 'new_republic' ? "Remnant Troupers" : "Jedi High Council"}
                 <span className="ml-auto text-[10px] text-blue-500/50">Grand Marquee</span>
               </h3>
               {grandMarquees1.map(renderMarquee)}
            </div>

            <div className="space-y-4">
               <h3 className="text-sm font-bold text-cyan-400 font-mono uppercase border-b border-cyan-500/30 pb-2 flex items-center gap-2">
                 <Users className="w-4 h-4" /> {GAME_ACTIVE_ERA === 'new_republic' ? "Mandalorian Coverts" : "Elite Droids Introductions"}
                 <span className="ml-auto text-[10px] text-cyan-500/50">Phase 2</span>
               </h3>
               {marqueesTeam2.map(renderMarquee)}

               <h3 className="text-sm font-bold text-red-500 font-mono uppercase border-b border-red-500/30 pb-2 pt-6 flex items-center gap-2 mt-8">
                 <Users className="w-4 h-4" /> {GAME_ACTIVE_ERA === 'new_republic' ? "Exiles & Shadows" : "Separatist War Council"}
                 <span className="ml-auto text-[10px] text-red-500/50">Grand Marquee</span>
               </h3>
               {grandMarquees2.map(renderMarquee)}
            </div>
         </div>
       </div>
     );
  }

  if (activeTab === 'era_journeys') {
     // Display the Era Journeys which are usually 2 units released.
     const eraJourneys = GAME_ACTIVE_ERA === 'new_republic' ? [
        { id: 'j_ezra_exile', name: 'Ezra Bridger (Exile)', charId: 'ezra_exile', desc: 'Lost Jedi', reqs: ['general_hera', 'chopper', 'huyang', 'sabine_apprentice', 'zeb_nr'] },
        { id: 'j_captain_pellaeon', name: 'Captain Pellaeon', charId: 'captain_pellaeon', desc: 'The Last Admiral', reqs: ['commander_enoch', 'night_trooper_peridea', 'death_trooper_peridea', 'scout_trooper_peridea', 'shadow_trooper_peridea'] },
        { id: 'j_bo_katan', name: 'Bo-Katan (Mand\'alor)', charId: 'bo_katan_mandalor', desc: 'Ruler of Mandalore', reqs: ['din_djarin_beskar', 'paz_vizsla', 'ig12_grogu', 'axe_woves', 'koska_reeves'] }
     ] : [
        { id: 'j_gas', name: 'General Skywalker', charId: 'general_skywalker', desc: '501st General', reqs: ['captain_rex', 'jesse', 'fives', 'echo_501st', 'appo_501st'] },
        { id: 'j_trench', name: 'Admiral Trench', charId: 'grand_admiral_trench', desc: 'Elite Droid Commander', reqs: ['bx_commando_droid', 'kelhani', 'droideka', 'dwarf_spider_droid', 'magna_guard_elite'] },
        { id: 'j_plo_koon', name: 'Plo Koon', charId: 'plo_koon_journey', desc: 'Wolfpack General', reqs: ['commander_wolffe', 'wp_sinker', 'wp_boost', 'wp_heavy', 'wp_scout'] },
         { id: 'j_palpatine', name: 'Supreme Chancellor Palpatine', charId: 'chancellor_palpatine_journey', desc: 'Coruscant Guard Leader', reqs: ['commander_fox_riot', 'commander_thorn', 'riot_guard', 'coruscant_trooper', 'underworld_police'] },
         { id: 'j_ki_adi_mundi', name: 'Ki-Adi-Mundi', charId: 'ki_adi_mundi_journey', desc: 'Galactic Marines General', reqs: ['commander_bacara', 'neyo', 'jet_marine', 'keller', 'stak'] }
     ];
     
     return (
       <div className="space-y-6 animate-fade-in pb-20">
         <header className="mb-6">
           <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest">Era Journeys</h2>
           <p className="text-zinc-500 font-mono text-xs uppercase mt-2">Elite characters unlocked via event ladders during the Era cycle.</p>
         </header>
         
         <div className="grid grid-cols-1 gap-6">
            {eraJourneys.map(j => (
                <div key={j.id} className="bg-black/60 border border-amber-500/30 p-6 rounded-2xl relative overflow-hidden box-glow-amber group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div>
                            <h3 className="text-2xl font-display font-black text-amber-500 uppercase tracking-widest">{j.name}</h3>
                            <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mt-1">{j.desc}</p>
                            
                            <div className="mt-4">
                               <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">Required Roster Signatures:</p>
                               <div className="flex flex-wrap gap-2">
                                  {j.reqs.map(req => {
                                      const prog = saveState.characters[req];
                                      const meets = prog && prog.unlocked && (prog.eraLevel || 0) >= 50;
                                      return (
                                        <div key={req} className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${meets ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-black border border-zinc-800 text-zinc-600'}`}>
                                           {req.replace(/_/g, ' ').toUpperCase()} {meets ? '(✓)' : '(E50 REQ)'}
                                        </div>
                                      );
                                  })}
                               </div>
                            </div>
                        </div>
                        
                        <div className="shrink-0 flex flex-col items-center gap-3">
                            <button
                               disabled={!j.reqs.every(req => saveState.characters[req]?.unlocked && (saveState.characters[req]?.eraLevel || 0) >= 50)}
                               onClick={() => {
                                   const { validPlayers, validEnemies } = validateCombatArrays([j.reqs[0]], ['b1_battle_droid']);
                                   const runBattle = () => {
                                      return <CombatBattleView 
                                        playerTeamIds={validPlayers}
                                        enemyIds={validEnemies}
                                        isMarquee={true} 
                                        saveState={saveState}
                                        rewardNode={{ id: j.id, name: `${j.name} Journey Unlocked`, rewards: [{ type: 'character', characterId: j.charId, count: 1 }], energyCost: 0}}
                                        onExitCombat={(won) => {
                                           if (won) {
                                              const stateCopy = JSON.parse(JSON.stringify(saveState));
                                              if (!stateCopy.characters[j.charId]) {
                                                  stateCopy.characters[j.charId] = { id: j.charId, unlocked: true, level: 1, stars: 5, gearTier: 1, gearSlots: [], relicLevel: 0, legendLevel: 0, abilityLevels: {}, eraLevel: 1 };
                                              }
                                              stateCopy.inventory['era_currency'] = (stateCopy.inventory['era_currency'] || 0) + 5000;
                                              onUpdateState(stateCopy);
                                              alert(`You unlocked Campaign Journey Character: ${j.name}! +5000 Era Currency`);
                                           }
                                           if (onExitBattle) onExitBattle();
                                        }}
                                      />;
                                   };
                                   onLaunchBattle(runBattle);
                               }}
                               className="bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 border border-transparent disabled:border-zinc-700 text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition w-full"
                            >
                               {j.reqs.every(req => saveState.characters[req]?.unlocked && (saveState.characters[req]?.eraLevel || 0) >= 50) ? 'Enter Journey' : 'Requirements Not Met'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
         </div>
       </div>
     );
  }

  if (activeTab === 'era_gls') {
     const legends = GAME_ACTIVE_ERA === 'new_republic' ? [
        { id: 'gl_ahsoka', name: 'Ahsoka Tano (Grey)', charId: 'ahsoka_tano_grey', desc: 'New Republic Galactic Legend', bg: 'environment-lothal-city', reqs: ['ezra_exile', 'general_hera', 'chopper', 'sabine_apprentice', 'bo_katan_mandalor', 'din_djarin_beskar', 'paz_vizsla', 'ig12_grogu', 'axe_woves', 'koska_reeves'] },
        { id: 'gl_thrawn', name: 'Grand Admiral Thrawn (Chimaera Eternal)', charId: 'grand_admiral_thrawn', desc: 'Empire Galactic Legend', bg: 'environment-peridea-ruins', reqs: ['commander_enoch', 'night_trooper_peridea', 'death_trooper_peridea', 'scout_trooper_peridea', 'shadow_trooper_peridea', 'shin_hati', 'morgan_elsbeth', 'marrok_mercenary', 'commander_hux_exile', 'warlord_drake_voss'] }
     ] : [
        { id: 'gl_jmk', name: 'Jedi Master Kenobi', charId: 'master_kenobi', desc: 'Jedi Galactic Legend', bg: 'environment-coruscant-senate', reqs: ['general_skywalker', 'captain_rex', 'jesse', 'fives', 'echo_501st', 'appo_501st', 'coleman_kcaj', 'oppo_rancisis', 'adi_gallia', 'luminara_unduli', 'yaddle'] },
        { id: 'gl_efg', name: 'Eternal Fire Grievous', charId: 'eternal_fire_grievous', desc: 'Separatist Galactic Legend', bg: 'environment-geonosis-arena', reqs: ['grand_admiral_trench', 'bx_commando_droid', 'kelhani', 'droideka', 'dwarf_spider_droid', 'magna_guard_elite', 'nute_gunray', 'dooku_war_council', 'wat_tambor', 'lott_dod', 'whorm_loathsom'] },
        
     ];

     return (
       <div className="space-y-6 animate-fade-in pb-20">
         <header className="mb-6">
           <h2 className="text-2xl font-display font-black text-amber-500 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">Galactic Legends</h2>
           <p className="text-zinc-500 font-mono text-xs uppercase mt-2">The Ultimate Era Capstones. Requires heavy roster progression to unlock.</p>
         </header>
         
         <div className="grid grid-cols-1 gap-6">
            {legends.map(g => (
                <div key={g.id} className={`bg-black/80 border border-amber-500/50 p-6 xl:p-8 rounded-3xl relative overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.15)] group ${g.bg || ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition duration-700"></div>
                    
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative z-10">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded text-amber-400 text-[10px] font-black uppercase tracking-widest mb-4">
                               <Sparkles className="w-3 h-3" /> Galactic Legend Equivalent
                            </div>
                            <h3 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-widest leading-none drop-shadow-md">{g.name}</h3>
                            <p className="text-amber-500/80 font-mono text-sm uppercase tracking-widest mt-3">{g.desc}</p>
                            
                            <div className="mt-8 bg-black/60 border border-zinc-800 p-4 rounded-xl">
                               <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3 font-bold border-b border-zinc-800 pb-2">Mandatory Prerequisite Units (Era Level 150+):</p>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {g.reqs.map(req => {
                                      const prog = saveState.characters[req];
                                      const meets = prog && prog.unlocked && (prog.eraLevel || 0) >= 150;
                                      return (
                                        <div key={req} className={`p-3 rounded-lg flex items-center justify-between border ${meets ? 'bg-amber-950/30 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'bg-black border-zinc-800'}`}>
                                           <span className={`text-xs font-mono font-bold uppercase tracking-wider ${meets ? 'text-amber-400' : 'text-zinc-600'}`}>{req.replace(/_/g, ' ')}</span>
                                           <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${meets ? 'bg-amber-500/20 text-amber-500' : 'bg-zinc-900 text-zinc-500'}`}>{meets ? 'E150 MET' : 'NEED E150'}</span>
                                        </div>
                                      );
                                  })}
                               </div>
                            </div>
                        </div>
                        
                        <div className="shrink-0 flex flex-col items-center justify-center bg-black/60 p-6 rounded-2xl border border-zinc-800 min-w-[250px]">
                            <button
                               disabled={!g.reqs.every(req => saveState.characters[req]?.unlocked && (saveState.characters[req]?.eraLevel || 0) >= 150)}
                               onClick={() => {
                                   const { validPlayers, validEnemies } = validateCombatArrays([g.reqs[0], g.reqs[1]], ['emperor_palpatine']);
                                   const runBattle = () => {
                                      return <CombatBattleView 
                                        playerTeamIds={validPlayers}
                                        enemyIds={validEnemies}
                                        isMarquee={true} 
                                        saveState={saveState}
                                        rewardNode={{ id: g.id, name: `${g.name} Galactic Legend Unlock Level`, background: g.bg, rewards: [{ type: 'character', characterId: g.charId, count: 1 }], energyCost: 0}}
                                        onExitCombat={(won) => {
                                           if (won) {
                                              const stateCopy = JSON.parse(JSON.stringify(saveState));
                                              if (!stateCopy.characters[g.charId]) {
                                                  stateCopy.characters[g.charId] = { id: g.charId, unlocked: true, level: 85, stars: 7, gearTier: 1, gearSlots: [], relicLevel: 0, legendLevel: 0, abilityLevels: {}, eraLevel: 1 };
                                              }
                                              stateCopy.inventory['era_currency'] = (stateCopy.inventory['era_currency'] || 0) + 15000;
                                              onUpdateState(stateCopy);
                                              alert(`Legend Acquired: ${g.name}! +15000 Era Currency`);
                                           }
                                           if (onExitBattle) onExitBattle();
                                        }}
                                      />;
                                   };
                                   onLaunchBattle(runBattle);
                               }}
                               className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-900 disabled:text-zinc-700 border border-transparent disabled:border-zinc-800 text-black px-6 py-4 rounded-xl font-black uppercase tracking-widest transition"
                            >
                               {g.reqs.every(req => saveState.characters[req]?.unlocked && (saveState.characters[req]?.eraLevel || 0) >= 150) ? 'Initiate Capstone' : 'Locked'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
         </div>
       </div>
     );
  }

  if (activeTab === 'era_collection') {
     const sections = GAME_ACTIVE_ERA === 'new_republic' ? [
        { title: 'Spectres (Phase 1 Marquees)', items: ['general_hera', 'chopper', 'huyang', 'sabine_apprentice', 'zeb_nr'] },
        { title: 'Mandalorians (Phase 2 Marquees)', items: ['din_djarin_beskar', 'paz_vizsla', 'ig12_grogu', 'axe_woves', 'koska_reeves'] },
        { title: 'Remnant Troopers (Grand Marquees)', items: ['commander_enoch', 'night_trooper_peridea', 'death_trooper_peridea', 'scout_trooper_peridea', 'shadow_trooper_peridea'] },
        { title: 'Morvek Survivors (Grand Marquees)', items: ['warlord_drake_voss', 'mire_talon', 'torr_kane', 'ashen_veil', 'hollow'] },
        { title: 'Lost Commanders & Rebels', items: ['rex_lost_commander', 'agent_kallus'] },
        { title: 'Empire Operatives (Grand Marquees)', items: ['shin_hati', 'baylan_skoll', 'morgan_elsbeth', 'marrok_mercenary', 'commander_hux_exile'] },
        { title: 'Era Journeys', items: ['ezra_exile', 'captain_pellaeon', 'bo_katan_mandalor'] },
        { title: 'Galactic Legends', items: ['ahsoka_tano_grey', 'grand_admiral_thrawn'] },
     ] : [
        { title: '501st Battalion (Phase 1 Marquees)', items: ['captain_rex', 'jesse', 'fives', 'echo_501st', 'appo_501st'] },
        { title: 'Elite Droids (Phase 2 Marquees)', items: ['bx_commando_droid', 'kelhani', 'droideka', 'dwarf_spider_droid', 'magna_guard_elite'] },
        { title: 'Jedi High Council (Grand Marquees)', items: ['coleman_kcaj', 'oppo_rancisis', 'adi_gallia', 'luminara_unduli', 'yaddle'] },
        { title: 'Separatist War Council (Grand Marquees)', items: ['nute_gunray', 'dooku_war_council', 'wat_tambor', 'lott_dod', 'whorm_loathsom'] },
        { title: 'Era Journeys', items: ['general_skywalker', 'grand_admiral_trench'] },
        { title: 'Galactic Legends', items: ['master_kenobi', 'eternal_fire_grievous'] },
     ];

     const renderCollectionUnit = (charId: string) => {
         const charInfo = getAllCharacters().find(c => c.id === charId);
         const prog = saveState.characters[charId];
         const name = charInfo?.name || charId.replace(/_/g, ' ');
         const eLevel = prog?.eraLevel || 0;
         const upgradeCost = 50; // Cost for +5 Era Levels
         const currency = saveState.inventory['era_currency'] || 0;
         const conversion = getEraConversion(eLevel);
         const convertedStr = conversion.relicLevel > 0 ? `R${conversion.relicLevel}` : `G${conversion.gearTier}`;

         return (
             <div key={charId} className={`relative p-3 rounded-lg border flex flex-col items-center justify-center text-center transition ${prog?.unlocked ? 'bg-amber-900/20 border-amber-500/30' : 'bg-black/50 border-zinc-800 opacity-50 grayscale'}`}>
                 <div className="w-12 h-12 bg-zinc-900 rounded mb-2 flex items-center justify-center overflow-hidden border border-zinc-700">
                    <span className="text-xl font-black text-amber-500">{name.charAt(0)}</span>
                 </div>
                 <span className="text-[10px] font-bold uppercase truncate w-full text-zinc-300">{name}</span>
                 <span className="text-[9px] font-mono mt-1 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">{prog?.unlocked ? `ERA ${eLevel} (${convertedStr})` : 'LOCKED'}</span>
                 
                 {prog?.unlocked && (
                     <button
                         onClick={() => {
                             if (currency >= upgradeCost && eLevel < 200) {
                                 const newSave = JSON.parse(JSON.stringify(saveState));
                                 newSave.inventory = { ...newSave.inventory, era_currency: currency - upgradeCost };
                                 newSave.characters = { ...newSave.characters, [charId]: { ...prog, eraLevel: Math.min(200, eLevel + 5) } };
                                 onUpdateState(newSave);
                             }
                         }}
                         disabled={currency < upgradeCost || eLevel >= 200}
                         className="mt-2 w-full text-[9px] font-bold uppercase py-1 rounded bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition"
                     >
                         {eLevel >= 200 ? 'MAX' : `+5 LVL (50)`}
                     </button>
                 )}
             </div>
         );
     };

     return (
       <div className="space-y-8 animate-fade-in pb-20">
         <header className="mb-6 flex justify-between items-end border-b border-zinc-800 pb-4">
           <div>
               <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest">Era Collection Viewer</h2>
               <p className="text-zinc-500 font-mono text-xs uppercase mt-2">Track your progress and tune Phase units.</p>
           </div>
           <div className="flex flex-col items-end">
               <span className="text-xs font-mono text-zinc-500 uppercase">Era Currency</span>
               <span className="text-xl font-bold font-mono text-amber-400">{saveState.inventory['era_currency'] || 0}</span>
           </div>
         </header>

         {sections.map(sec => (
             <div key={sec.title} className="mb-8 bg-black/40 p-6 rounded-2xl border border-zinc-800/50">
                 <h3 className="text-sm font-bold font-mono tracking-widest text-amber-500 uppercase border-b border-amber-500/30 pb-3 mb-4 flex items-center gap-2">
                     <Users className="w-4 h-4" /> {sec.title}
                 </h3>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                     {sec.items.map(renderCollectionUnit)}
                 </div>
             </div>
         ))}
       </div>
     );
  }

  // Fallback
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
       <Sparkles className="w-12 h-12 text-amber-500/50 mb-4" />
       <h2 className="text-2xl font-display font-black text-zinc-300 uppercase tracking-widest">Coming Soon</h2>
       <p className="text-zinc-500 mt-2 font-mono text-xs uppercase max-w-sm">This section of the Era cycle unlocks in a future week schedule.</p>
    </div>
  );
};
