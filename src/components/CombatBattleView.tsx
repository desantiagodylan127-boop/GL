import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CombatUnit, Ability, CampaignNode, CombatState, CampaignNodeReward, SaveState } from '../types';
import { 
  createCombatUnit, executeCombatAction, advanceTurnMeters, checkHasTag, getModifiedStats, applyStatus, applySquadPassives
} from '../utils/combatEngine';
import { STATUS_DEFINITIONS } from '../utils/statusRegistry';
import { getAIChoice } from '../utils/combatAI';
import { getCharacterAnimationFamily, getAbilityAnimationType } from '../utils/combatAnimations';
import { getAllCharacters } from '../data/characters';
import { Shield, Zap, Flame, RotateCcw, AlertTriangle, Play, ChevronRight, Activity, X, Star, ScrollText } from 'lucide-react';
import { HoloCombatUnit } from './HoloCombatUnit';
import { EnvironmentParticles } from './EnvironmentParticles';
import { BattleScenery } from './BattleScenery';
import { BATTLE_BACKGROUNDS, getFallbackBackground, BattleBackground } from '../data/battleBackgrounds';

interface CombatBattleViewProps {
  playerTeamIds: string[];
  enemyIds: string[];
  enemyWaves?: string[][];
  waveBackgrounds?: string[];
  rewardNode: { 
    id: string; 
    name: string; 
    rewards: CampaignNodeReward[]; 
    energyCost: number; 
    background?: string; 
    powerRecommended?: number;
    objective?: string;
    story?: string;
    rules?: string;
  } | null;
  onExitCombat: (won: boolean, rewardsEarned: { itemId: string; amount: number }[], stars: number, defeatedEnemyIds?: string[]) => void;
  saveState: SaveState;
  isMarquee?: boolean;
  isLoaned?: boolean;
  difficultyMultiplier?: number;
  conquestConfig?: {
    enemyModifiers?: string[];
    playerDataDisks?: string[];
  };
}

export const CombatBattleView: React.FC<CombatBattleViewProps> = ({
  playerTeamIds,
  enemyIds,
  enemyWaves,
  waveBackgrounds,
  rewardNode,
  onExitCombat,
  saveState,
  isMarquee = false,
  isLoaned = false,
  difficultyMultiplier = 1.0,
  conquestConfig
}) => {
  const allCharacters = getAllCharacters();
  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  // Core Combat state
  const [combatState, setCombatState] = useState<CombatState | null>(null);
  const [battleSpeed, setBattleSpeed] = useState<number>(() => parseInt(sessionStorage.getItem('swgoh_battle_speed') || '1', 10));
  const [isAuto, setIsAuto] = useState<boolean>(() => sessionStorage.getItem('swgoh_battle_auto') === 'true');
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  useEffect(() => {
     sessionStorage.setItem('swgoh_battle_speed', battleSpeed.toString());
  }, [battleSpeed]);

  useEffect(() => {
     sessionStorage.setItem('swgoh_battle_auto', isAuto ? 'true' : 'false');
  }, [isAuto]);
  const [selectedAllyId, setSelectedAllyId] = useState<string | null>(null);
  const [currentWaveIndex, setCurrentWaveIndex] = useState<number>(0);
  const [showLog, setShowLog] = useState<boolean>(false);
  const [inspectedUnitId, setInspectedUnitId] = useState<string | null>(null);
  const [showDeepStats, setShowDeepStats] = useState<boolean>(false);
  const [attackingUnitIds, setAttackingUnitIds] = useState<string[]>([]);
  const [cinematicAbility, setCinematicAbility] = useState<{name: string, isUltimate: boolean, characterId: string} | null>(null);
  const [needsAllySelectionAbilityId, setNeedsAllySelectionAbilityId] = useState<string | null>(null);

  // Scripted Journey encounter state variables
  const [vader75Triggered, setVader75Triggered] = useState(false);
  const [vader50Triggered, setVader50Triggered] = useState(false);
  const [vader25Triggered, setVader25Triggered] = useState(false);
  const [duelActive, setDuelActive] = useState(false);
  const [imperialApprovalApplied, setImperialApprovalApplied] = useState(false);
  const [prevActiveEnemyCount, setPrevActiveEnemyCount] = useState<number | null>(null);
  const [thrawnArrivedTriggered, setThrawnArrivedTriggered] = useState(false);
  const [showBriefing, setShowBriefing] = useState(true);

  // Animated floating combat indicators state
  const [floatingTexts, setFloatingTexts] = useState<{
    id: string;
    unitId: string;
    text: string;
    colorClass: string;
  }[]>([]);
  const [screenShake, setScreenShake] = useState<'small' | 'medium' | 'large' | false>(false);
  const [flashEffect, setFlashEffect] = useState<'red' | 'white' | 'blue' | 'yellow' | 'purple' | 'tactical' | 'hologram' | null>(null);
  const [cameraZoom, setCameraZoom] = useState<'none' | 'quick' | 'wide' | 'large' | 'cinematic'>('none');
  const [activeStrikes, setActiveStrikes] = useState<{ targets: string[], family: string, type: string } | null>(null);
  const [precalculatedLoot, setPrecalculatedLoot] = useState<{ itemId: string; amount: number }[] | null>(null);
  const [starsCount, setStarsCount] = useState<number>(0);

  const processedLogCountRef = useRef<number>(0);

  useEffect(() => {
    if (!combatState || combatState.battleLog.length === 0) return;
    const totalLogs = combatState.battleLog.length;
    if (processedLogCountRef.current >= totalLogs) {
      processedLogCountRef.current = totalLogs;
      return;
    }

    const allUnits = [...combatState.playerTeam, ...combatState.enemyTeam];
    const newTexts: typeof floatingTexts = [];

    for (let i = processedLogCountRef.current; i < totalLogs; i++) {
      const log = combatState.battleLog[i];
      const text = log.text;

      // Handle Fullscreen VFX based on log content
      if (text.includes('CRITICAL') || text.includes('TRUE DAMAGE')) {
         setScreenShake('small');
         setFlashEffect('red');
         setTimeout(() => { setScreenShake(false); setFlashEffect(null); }, 300);
      } else if (text.includes('revived') || text.includes('healed')) {
         setFlashEffect('white');
         setTimeout(() => setFlashEffect(null), 200);
      } else if (log.type === 'ultimate') {
         setScreenShake('large');
         setFlashEffect('blue');
         setTimeout(() => { setScreenShake(false); setFlashEffect(null); }, 500);
      } else if (text.includes('Predicted') && text.includes('trigger')) {
         setFlashEffect('tactical');
         setTimeout(() => setFlashEffect(null), 1200);
      } else if (text.includes('Grand Design')) {
         setFlashEffect('hologram');
         setTimeout(() => setFlashEffect(null), 2500);
      }

      // Find which unit's name is mentioned in this log segment
      let matchingUnit = allUnits.find(u => 
        text.includes(u.name) || 
        (u.name.length > 3 && text.toLowerCase().includes(u.name.toLowerCase()))
      );

      // If log has an explicit target, strongly prefer it
      if (log.targetId) {
         const explicitTarget = allUnits.find(u => u.id === log.targetId);
         if (explicitTarget) matchingUnit = explicitTarget;
      }

      if (matchingUnit) {
        let displayVal = '';
        let colorClass = 'text-yellow-400 font-bold';

        if (log.type === 'damage') {
          const dmgVal = log.amount !== undefined ? log.amount.toLocaleString() : text.match(/\d+/) ? parseInt(text.match(/\d+/)![0], 10).toLocaleString() : '';
          const isCrit = log.isCrit || text.includes('CRITICAL') || text.includes('💥');
          const isTrueDmg = text.includes('TRUE DAMAGE');
          displayVal = isCrit ? `💥 -${dmgVal}` : `-${dmgVal}`;
          let dmgColor = 'text-white font-[900] text-3xl drop-shadow-[0_4px_4px_rgba(0,0,0,1)] z-[100]';
          if (isCrit) dmgColor = 'text-orange-500 font-[900] text-4xl drop-shadow-[0_0_20px_rgba(249,115,22,1)] scale-110 z-[100]';
          if (isTrueDmg) dmgColor = 'text-yellow-300 font-[900] text-3xl drop-shadow-[0_0_15px_rgba(253,224,71,1)] z-[100]';
          colorClass = dmgColor;
        } else if (log.type === 'heal') {
          const healVal = log.amount !== undefined ? log.amount.toLocaleString() : text.match(/\d+/) ? parseInt(text.match(/\d+/)![0], 10).toLocaleString() : '';
          if (text.includes('revived')) {
            displayVal = '✨ REVIVED';
            colorClass = 'text-emerald-300 font-[900] text-2xl animate-bounce z-[100]';
          } else {
            displayVal = `💚 +${healVal}`;
            colorClass = 'text-emerald-400 font-[900] text-4xl shadow-black drop-shadow-[0_4px_4px_rgba(0,0,0,1)] scale-110 z-[100]';
          }
        } else if (log.type === 'death' || text.includes('DEFEATED!') || text.includes('💀')) {
          displayVal = '💀 DEFEATED';
          colorClass = 'text-red-500 font-[900] text-4xl drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] scale-125 z-[100]';
        } else if (text.includes('STUNNED') || text.includes('Stunned')) {
          displayVal = '❄️ STUNNED';
          colorClass = 'text-blue-300 font-[900] text-xl drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse z-[100]';
        } else if (text.includes('ABILITY BLOCK') || text.includes('Ability Block') || text.includes('Blocked')) {
          displayVal = '🔇 BLOCKED';
          colorClass = 'text-zinc-400 font-[800] text-sm drop-shadow-md z-[100]';
        } else if (text.includes('Resisted')) {
          displayVal = '🛡️ RESISTED!';
          colorClass = 'text-zinc-200 font-[900] text-xl bg-zinc-900/90 px-2 py-1 rounded border border-zinc-700/80 shadow-lg z-[100]';
        } else if (text.includes('Evaded')) {
          displayVal = '💨 EVADED!';
          colorClass = 'text-cyan-300 font-[900] text-2xl italic shadow-cyan-500/50 drop-shadow-xl slide-out-top z-[100]';
        } else if (text.includes('Assist:')) {
          displayVal = '➡️ ASSIST';
          colorClass = 'text-amber-500 font-[900] text-base drop-shadow-lg z-[100]';
        } else if (text.includes('gained') || text.includes('stacked')) {
          const statusMatch = text.match(/gained (.+?) \(/) || text.match(/stacked (.+?) \(/) || text.match(/gained (.+)/);
          const statusName = statusMatch ? statusMatch[1] : 'Status';
          const isDebuff = log.type === 'debuff' || text.toLowerCase().includes('down') || text.toLowerCase().includes('daze') || text.toLowerCase().includes('stun');
          displayVal = isDebuff ? `🔻 ${statusName}` : `🔺 ${statusName}`;
          colorClass = isDebuff ? 'text-purple-400 font-[800] tracking-wide text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] z-[100]' : 'text-cyan-400 font-[800] tracking-wide text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] z-[100]';
        }

        if (displayVal) {
          newTexts.push({
            id: `${i}_${matchingUnit.id}_${Date.now()}_${Math.random()}`,
            unitId: matchingUnit.id,
            text: displayVal,
            colorClass
          });
        }
      }
    }

    if (newTexts.length > 0) {
      setFloatingTexts(prev => [...prev, ...newTexts]);
      newTexts.forEach(nt => {
        setTimeout(() => {
          setFloatingTexts(prev => prev.filter(x => x.id !== nt.id));
        }, 1300);
      });
    }

    processedLogCountRef.current = totalLogs;
  }, [combatState?.battleLog, combatState?.playerTeam, combatState?.enemyTeam]);

  // Initialize Combat Roster
  useEffect(() => {
    // Only initialize once on mount or if team changes. We don't want to reset if currentWaveIndex changes.
    const rawPlayerTeam = playerTeamIds
      .map(id => allCharacters.find(ch => ch.id === id))
      .filter((ch): ch is typeof ch & {} => !!ch);

    const activeEnemyIds = enemyWaves ? enemyWaves[0] : enemyIds;
    // If no enemies passed, populate basic Separatist droids as default challenge
    let rawEnemyTeam = (activeEnemyIds.length > 0 ? activeEnemyIds : ['b1_battle_droid', 'b2_super_droid', 'crab_droid', 'magnaguard'])
      .map(id => allCharacters.find(ch => ch.id === id))
      .filter((ch): ch is typeof ch & {} => !!ch);
      
    // Fallback if the specific enemy IDs passed did not exist in the database, avoiding complete battle crash
    if (rawEnemyTeam.length === 0) {
       console.warn('CombatBattleView: Enemy team resolved to empty. Falling back to default droids.');
       rawEnemyTeam = ['b1_battle_droid', 'b2_super_droid']
         .map(id => allCharacters.find(ch => ch.id === id))
         .filter((ch): ch is typeof ch & {} => !!ch);
    }
    
    if (rawPlayerTeam.length === 0) {
       console.error('CombatBattleView: Player team resolved to empty after filtering missing IDs. Check player roster IDs.', playerTeamIds);
       // Add a dummy so it doesn't infinite loop, user will just instantly lose or something, better than crash
       const fallback = allCharacters.find(ch => ch.id === 'captain_rex');
       if (fallback) rawPlayerTeam.push(fallback);
    }

    const playerUnits = rawPlayerTeam.map((c, idx) => {
      let prog = saveState.characters[c.id];
      if (isMarquee || isLoaned || !prog) {
        prog = { unlocked: true, level: 85, stars: 7, gearTier: 13, gearSlots: [true, true, true, true, true, true], relicLevel: 9, legendLevel: 10 };
      }
      const unit = createCombatUnit(c, 'player', idx, prog);
      if (conquestConfig?.playerDataDisks) {
          conquestConfig.playerDataDisks.forEach(disk => {
              if (disk === 'dd_zealous_ambition' && c.role.toLowerCase().includes('support')) {
                  unit.offense *= 3;
              }
              if (disk === 'dd_defensive_formation') {
                  unit.defense *= 1.5;
              }
          });
      }
      return unit;
    });

    const enemyUnits = rawEnemyTeam.map((c, idx) => {
        let enemyLevel = 1;
        let enemyGear = 1;
        let enemyStars = 1;
        let enemyRelic = 0;
        
        const difficultyRating = rewardNode?.powerRecommended 
           ? (rewardNode.powerRecommended / 1000)
           : ((rewardNode?.energyCost || 10) + (conquestConfig ? 10 : 0));
        
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

        const enemyProg = {
           id: c.id,
           unlocked: true, level: enemyLevel, stars: enemyStars, gearTier: enemyGear,
           gearSlots: [true,true,true,true,true,true], relicLevel: enemyRelic, legendLevel: 0,
           abilityLevels: {}
        };

        const unit = createCombatUnit(c, 'enemy', idx, enemyProg);
        if (difficultyMultiplier > 1) {
            unit.maxHp *= difficultyMultiplier;
            unit.hp *= difficultyMultiplier;
            unit.maxProtection *= difficultyMultiplier;
            unit.protection *= difficultyMultiplier;
            unit.offense *= (difficultyMultiplier * 0.7); // scale damage slightly less than health
        }
        if (conquestConfig?.enemyModifiers) {
            conquestConfig.enemyModifiers.forEach(mod => {
                if (mod === 'Bonus Offense') unit.offense *= 1.25;
                if (mod === 'Bonus Defense') { unit.defense *= 1.5; unit.maxProtection *= 1.25; unit.protection *= 1.25; }
                if (mod === 'Bonus Critical Damage') unit.offense *= 1.15;
                if (mod === 'Turn Meter Gain') unit.turnMeter = 50;
                // Healing immunity handled manually in combat engine or simulated by high offense. We'll leave the flag available but it's lightweight simulation.
            });
        }
        return unit;
    });

    const state: CombatState = {
      playerTeam: playerUnits,
      enemyTeam: enemyUnits,
      activeUnitId: null,
      battleLog: [
        { text: "🛰️ Deploying security taskforce to orbital airspace Coordinate...", type: 'info' },
        { text: "⚠️ ENEMY DEFENSES ENGAGING. Battle systems initialized.", type: 'death' }
      ],
      turnCount: 0,
      battleSpeed: 1,
      isAuto: false,
      ended: false,
      winner: null,
      selectedTargetId: null,
      bonusTurnQueue: [],
      consecutiveBonusCount: {},
      totalScore: 0,
      raidPhaseCurrent: 1,
      reviveCounts: {},
      conquestDataDisks: conquestConfig?.playerDataDisks || [],
      rewardNodeId: rewardNode?.id || null
    };

    // Apply leader buffs and unique passives at start of battle
    applySquadPassives(state, 'all');

    processedLogCountRef.current = 0;
    setFloatingTexts([]);

    if (state.playerTeam.length === 0) {
       state.ended = true;
       state.winner = 'enemy';
    } else if (state.enemyTeam.length === 0) {
       state.ended = true;
       state.winner = 'player';
    }

    setCombatState(state);
  }, [playerTeamIds, enemyIds, enemyWaves]); // Re-run if base props change, but not on wave index to avoid reset

  // Wave advancement check
  useEffect(() => {
    if (combatState?.ended && combatState?.winner === 'player') {
      if (enemyWaves && currentWaveIndex < enemyWaves.length - 1) {
        // More waves exist! We do NOT payout yet, we advance to next wave!
        const nextWaveIndex = currentWaveIndex + 1;
        const nextWaveIds = enemyWaves[nextWaveIndex];
        
        const rawEnemyTeam = nextWaveIds
          .map(id => allCharacters.find(ch => ch.id === id))
          .filter((ch): ch is typeof ch & {} => !!ch);
          
        const enemyUnits = rawEnemyTeam.map((c, idx) => {
          let enemyLevel = 1;
          let enemyGear = 1;
          let enemyStars = 1;
          let enemyRelic = 0;
          
          const difficultyRating = rewardNode?.powerRecommended 
             ? (rewardNode.powerRecommended / 1000)
             : ((rewardNode?.energyCost || 10) + (conquestConfig ? 10 : 0));
          
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

          const enemyProg = {
             id: c.id,
             unlocked: true, level: enemyLevel, stars: enemyStars, gearTier: enemyGear,
             gearSlots: [true,true,true,true,true,true], relicLevel: enemyRelic, legendLevel: 0,
             abilityLevels: {}
          };

          const unit = createCombatUnit(c, 'enemy', idx, enemyProg);
          if (difficultyMultiplier > 1) {
              unit.maxHp *= difficultyMultiplier;
              unit.hp *= difficultyMultiplier;
              unit.maxProtection *= difficultyMultiplier;
              unit.protection *= difficultyMultiplier;
              unit.offense *= (difficultyMultiplier * 0.7);
          }
          if (conquestConfig?.enemyModifiers) {
              conquestConfig.enemyModifiers.forEach(mod => {
                  if (mod === 'Bonus Offense') unit.offense *= 1.25;
                  if (mod === 'Bonus Defense') { unit.defense *= 1.5; unit.maxProtection *= 1.25; unit.protection *= 1.25; }
                  if (mod === 'Bonus Critical Damage') unit.offense *= 1.15;
                  if (mod === 'Turn Meter Gain') unit.turnMeter = 50;
              });
          }
          return unit;
        });
        
        const copy = { ...combatState };
        copy.enemyTeam = enemyUnits;
        copy.ended = false;
        copy.winner = null;
        copy.activeUnitId = null;
        copy.selectedTargetId = null;
        if (copy.totalScore !== undefined) {
          copy.totalScore += 10000; // Bonus points for wave clear
        }
        copy.battleLog.push({ text: `🌊 WAVE ${nextWaveIndex + 1} ENGAGING! 🌊 (+10000 Points)`, type: 'info' });
        
        // Re-apply enemy squad passives
        applySquadPassives(copy, 'enemy');
        copy.raidPhaseCurrent = nextWaveIndex + 1;
        
        setCombatState(copy);
        setCurrentWaveIndex(nextWaveIndex);
      }
    }
  }, [combatState?.ended, combatState?.winner]);

  // Pre-calculate battle results, stars, and loot on battle conclusion
  useEffect(() => {
    if (combatState?.ended && !precalculatedLoot) {
      let loot: { itemId: string; amount: number }[] = [];
      let stars = 1;
      
      if (combatState.winner === 'player') {
         const survivingPlayers = combatState.playerTeam.filter(u => u.hp > 0 && !u.isSummon).length;
         if (survivingPlayers >= (playerTeamIds?.length || 1)) stars = 3;
         else if (survivingPlayers === (playerTeamIds?.length || 1) - 1) stars = 2;
         
         if (rewardNode) {
           rewardNode.rewards.forEach(r => {
             const chance = r.chance !== undefined ? r.chance : 1;
             if (Math.random() <= chance) {
               const min = typeof r.amountMin === 'number' ? r.amountMin : (r as any).amount || 1;
               const max = typeof r.amountMax === 'number' ? r.amountMax : (r as any).amount || 1;
               const amount = Math.floor(Math.random() * (max - min + 1)) + min;
               loot.push({ itemId: r.itemId, amount });
             }
           });
         }
      } else if (combatState.winner === 'enemy' && rewardNode && rewardNode.id.includes('_complete')) {
         const score = combatState.totalScore || 0;
         if (score > 1000) {
             const tokens = Math.floor(score / 500);
             const credits = Math.floor(score / 20);
             loot.push({ itemId: 'raid_token', amount: tokens });
             loot.push({ itemId: 'credit', amount: credits });
         }
      }
      
      setPrecalculatedLoot(loot);
      setStarsCount(stars);
    }
  }, [combatState?.ended, combatState?.winner, rewardNode, precalculatedLoot]);

  // Handle active turn meter ticks and Scripted Journey encounters
  useEffect(() => {
    if (!combatState || combatState.ended) return;

    // --- CHECK SCRIPTED TRIGGERS FIRST ---
    // 1. Scripted Encounter: Old Ben Phase III (Duel on the Death Star)
    if (rewardNode?.id === 'journey_phase_j_old_ben_2') {
      // Required characters cannot be defeated (excluding Old Ben)
      let teamHealed = false;
      const healedPlayerTeam = combatState.playerTeam.map(u => {
        if (u.characterId !== 'old_ben' && u.hp <= 1) {
          teamHealed = true;
          return { ...u, hp: Math.max(2, Math.floor(u.maxHp * 0.05)) }; // Keep at 5% HP
        }
        return u;
      });

      if (teamHealed) {
        const copy = { ...combatState, playerTeam: healedPlayerTeam };
        setCombatState(copy);
        return;
      }

      // Find Darth Vader in battle
      const vader = combatState.enemyTeam.find(u => u.characterId === 'darth_vader');
      if (vader) {
        const vaderHpPercent = (vader.hp / vader.maxHp) * 100;

        // Trigger 75% Rule (Obi-Wan gains Damage Immunity for 1 turn)
        if (vaderHpPercent <= 75 && !vader75Triggered) {
          setVader75Triggered(true);
          const copy = { ...combatState };
          const oldBen = copy.playerTeam.find(u => u.characterId === 'old_ben');
          if (oldBen) {
            if (!oldBen.statuses.some(s => s.name === 'Damage Immunity')) {
              oldBen.statuses.push({ name: 'Damage Immunity', duration: 1, isDebuff: false });
            }
            copy.battleLog.push({
              text: "⚡ Scripted Encounter: Darth Vader falls below 75% HP! Old Ben gains Damage Immunity (1 turn)!",
              type: 'ultimate'
            });
            setCombatState(copy);
            return;
          }
        }

        // Trigger 50% Rule (Obi-Wan and Darth Vader enter Duel stance)
        if (vaderHpPercent <= 50 && vaderHpPercent > 25 && !vader50Triggered) {
          setVader50Triggered(true);
          setDuelActive(true);
          const copy = { ...combatState };
          copy.battleLog.push({
            text: "🚨 Scripted Encounter: Darth Vader falls below 50% HP! Obi-Wan and Darth Vader enter a Duel stance! Other units are sidelined.",
            type: 'death'
          });
          setCombatState(copy);
          setFlashEffect('tactical');
          setTimeout(() => setFlashEffect(null), 1000);
          return;
        }

        // Trigger 25% Rule (Sacrifice & Victory)
        if (vaderHpPercent <= 25 && !vader25Triggered) {
          setVader25Triggered(true);
          setDuelActive(false);
          const copy = { ...combatState };
          
          // Defeat Old Ben
          copy.playerTeam = copy.playerTeam.map(u => {
            if (u.characterId === 'old_ben') {
              return { ...u, hp: 0, activeInBattle: false };
            }
            return u;
          });

          // Give Offense Up and Speed Up to remaining allies
          copy.playerTeam = copy.playerTeam.map(u => {
            if (u.hp > 0) {
              const statuses = [...u.statuses];
              if (!statuses.some(s => s.name === 'Offense Up')) statuses.push({ name: 'Offense Up', duration: 2, isDebuff: false });
              if (!statuses.some(s => s.name === 'Speed Up')) statuses.push({ name: 'Speed Up', duration: 2, isDebuff: false });
              return { ...u, statuses };
            }
            return u;
          });

          copy.battleLog.push({
            text: "🎬 Scripted Event: Knowing his purpose has been fulfilled, Obi-Wan gives himself willingly so Luke and the others can escape aboard the Millennium Falcon. His sacrifice becomes the first step toward the restoration of the Jedi.",
            type: 'ultimate'
          });
          
          copy.battleLog.push({
            text: "🏆 VICTORY: All Rebel units gain Offense Up & Speed Up (2 Turns)!",
            type: 'buff'
          });

          copy.ended = true;
          copy.winner = 'player';
          setCombatState(copy);
          setFlashEffect('blue');
          setTimeout(() => setFlashEffect(null), 2000);
          return;
        }
      }
    }

    // 2. Scripted Encounter: Thrawn Phase III (Grand Admiral)
    if (rewardNode?.id === 'journey_phase_j_thrawn_2') {
      // 1. Palpatine gains unique buff: Imperial Approval
      if (!imperialApprovalApplied) {
        const palpatine = combatState.playerTeam.find(u => u.characterId === 'emperor_palpatine');
        if (palpatine) {
          setImperialApprovalApplied(true);
          const copy = { ...combatState };
          const palpy = copy.playerTeam.find(u => u.characterId === 'emperor_palpatine')!;
          if (!palpy.statuses.some(s => s.name === 'Imperial Approval')) {
            applyStatus(copy as any, palpy, 'Imperial Approval', 99, false, palpy);
          }
          copy.battleLog.push({
            text: "👑 Scripted Encounter: Emperor Palpatine gains the unique buff: Imperial Approval!",
            type: 'buff'
          });
          setCombatState(copy);
          return;
        }
      }

      // 2. Whenever an enemy is defeated: recover 20% protection on Imperial allies
      const currentActiveCount = combatState.enemyTeam.filter(u => u.hp > 0).length;
      if (prevActiveEnemyCount === null) {
        setPrevActiveEnemyCount(currentActiveCount);
      } else if (currentActiveCount < prevActiveEnemyCount) {
        setPrevActiveEnemyCount(currentActiveCount);
        const copy = { ...combatState };
        copy.playerTeam = copy.playerTeam.map(u => {
          if (u.hp > 0 && (
            u.tags.includes('Empire') || 
            u.tags.includes('Galactic Empire') || 
            u.characterId === 'emperor_palpatine' || 
            u.characterId === 'darth_vader' || 
            u.characterId === 'royal_guard' || 
            u.characterId === 'stormtrooper' || 
            u.characterId === 'sandtrooper'
          )) {
            const protectionGain = Math.floor(u.maxProtection * 0.2);
            const newProt = Math.min(u.maxProtection, u.protection + protectionGain);
            return { ...u, protection: newProt };
          }
          return u;
        });

        copy.battleLog.push({
          text: "✨ Imperial Approval: An enemy is defeated! All Imperial allies recover 20% Protection!",
          type: 'heal'
        });

        setCombatState(copy);
        return;
      }
    }

    // --- MAIN COMBAT TURN AND TICK ENGINE ---
    // Is active unit selected yet? If not, tick turn meters!
    if (!combatState.activeUnitId) {
      const copy = { ...combatState };
      advanceTurnMeters(copy);
      setCombatState(copy);
      return;
    }

    // Auto AI Combat Handler
    const activeUnit = [...combatState.playerTeam, ...combatState.enemyTeam].find(
      u => u.id === combatState.activeUnitId && u.activeInBattle && u.hp > 0
    );

    if (!activeUnit) {
      // Clean stale active units
      const copy = { ...combatState };
      copy.activeUnitId = null;
      setCombatState(copy);
      return;
    }

    if (activeUnit && duelActive) {
      if (activeUnit.characterId !== 'old_ben' && activeUnit.characterId !== 'darth_vader') {
         // Skip turn immediately!
         const copy = { ...combatState };
         const u = copy.playerTeam.concat(copy.enemyTeam).find(x => x.id === activeUnit.id);
         if (u) {
            u.turnMeter = 0;
         }
         copy.activeUnitId = null;
         setCombatState(copy);
         return;
      }
    }

    if (isAuto || activeUnit.team === 'enemy') {
      const isQuickBase = battleSpeed >= 2;
      const delay = (isQuickBase ? 600 : 1000) / battleSpeed;
      const animationWait = (isQuickBase ? 400 : 800) / battleSpeed;
      
      const timer = setTimeout(() => {
        const copy = { ...combatState };
        const unitToQuery = copy.playerTeam.concat(copy.enemyTeam).find(u => u.id === activeUnit.id)!;
        
        // Let AI engine select ability and target
        const decision = getAIChoice(unitToQuery, copy);
        
        const isAoE = (decision.ability.effects.join(' ') + ' ' + decision.ability.desc).toLowerCase().includes('enemies') || 
                      (decision.ability.effects.join(' ') + ' ' + decision.ability.desc).toLowerCase().includes('damage_aoe') || 
                      (decision.ability.effects.join(' ') + ' ' + decision.ability.desc).toLowerCase().includes('debuff_all') ||
                      decision.ability.aiTags.includes('aoe');
        
        // Setup Camera Effects based on Ability
        let shakeLevel: 'small' | 'medium' | 'large' = 'small';
        let zoomLevel: 'none' | 'quick' | 'wide' | 'large' | 'cinematic' = 'none';

        if (decision.ability.type === 'ultimate') {
           shakeLevel = 'large';
           zoomLevel = 'cinematic';
           setCinematicAbility({ name: decision.ability.name, isUltimate: true, characterId: unitToQuery.characterId });
        } else if (decision.ability.type === 'special') {
           shakeLevel = 'medium';
           zoomLevel = isAoE ? 'wide' : 'quick';
           setCinematicAbility({ name: decision.ability.name, isUltimate: false, characterId: unitToQuery.characterId });
        } else if (isAoE) {
           zoomLevel = 'wide';
         }

        setScreenShake(shakeLevel);
        setCameraZoom(zoomLevel);
        
        // Trigger lunge animation
        copy.turnAttackers = [];
        const cinematicDelay = (decision.ability.type === 'ultimate' ? 3000 : decision.ability.type === 'special' ? 1200 : 500) / battleSpeed;
        
        setTimeout(() => {
           const finalCopy = { ...copy };
           executeCombatAction(finalCopy, unitToQuery.id, decision.ability, decision.targetId);
           finalCopy.activeUnitId = null;
           setAttackingUnitIds(finalCopy.turnAttackers || [unitToQuery.id]);
           
           const family = getCharacterAnimationFamily(unitToQuery.characterId, decision.ability.type, decision.ability.id);
           setActiveStrikes({
             targets: isAoE ? finalCopy.playerTeam.map(u => u.id) : [decision.targetId],
             family,
             type: getAbilityAnimationType(decision.ability.type)
           });
           
           const strikeDuration = (decision.ability.type === 'ultimate' ? 2200 : decision.ability.type === 'special' ? 1200 : 600) / battleSpeed;
           setTimeout(() => {
             setAttackingUnitIds([]);
             setCinematicAbility(null);
             setCameraZoom('none');
             setScreenShake(false);
             setActiveStrikes(null);
             setCombatState(finalCopy);
           }, strikeDuration);
        }, animationWait);

      }, delay);

      return () => clearTimeout(timer);
    }
  }, [combatState, isAuto, battleSpeed, rewardNode, vader75Triggered, vader50Triggered, vader25Triggered, duelActive, imperialApprovalApplied, prevActiveEnemyCount]);

  // Scripted Event: Thrawn's Arrival on Victory
  useEffect(() => {
    if (!combatState) return;
    if (rewardNode?.id !== 'journey_phase_j_thrawn_2') return;

    if (combatState.ended && combatState.winner === 'player' && !thrawnArrivedTriggered) {
      setThrawnArrivedTriggered(true);
      const copy = { ...combatState };
      copy.battleLog.push({
        text: "🎖️ Scripted Event: Having repeatedly demonstrated unmatched strategic brilliance against the Rebel Alliance, Thrawn earns the personal trust of Emperor Palpatine and is elevated to the rank of Grand Admiral.",
        type: 'ultimate'
      });
      setCombatState(copy);
    }
  }, [combatState?.ended, rewardNode, thrawnArrivedTriggered]);

  // Scroll logging console automatically
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [combatState?.battleLog]);

  if (!combatState) return null;

  const playerTeam = combatState.playerTeam;
  const enemyTeam = combatState.enemyTeam;

  const currentActiveUnit = playerTeam.concat(enemyTeam).find(
    u => u.id === combatState.activeUnitId
  );

  // Helper to determine if ability requires an ally target
  const isAllyTargetAbility = (ab: Ability) => {
    const str = ab.effects.join(' ').toLowerCase();
    return str.includes('target ally') || str.includes('target other ally') || str.includes('buff_ally') || str.includes('target_ally');
  };

  // Trigger manual player actions
  function handleManualAbilityUse(ability: Ability) {
    if (!combatState || !currentActiveUnit || currentActiveUnit.team !== 'player') return;

    if (isAllyTargetAbility(ability) && !selectedAllyId) {
      setNeedsAllySelectionAbilityId(ability.id);
      setTimeout(() => setNeedsAllySelectionAbilityId(null), 3500);
      return;
    }
    
    setNeedsAllySelectionAbilityId(null);

    const targets = enemyTeam.filter(u => u.activeInBattle && u.hp > 0);
    // Use selected target, otherwise default to first alive enemy
    let finalTargetId = selectedTargetId || '';
    const validSelected = targets.map(t => t.id).includes(finalTargetId);
    if (!validSelected) {
      finalTargetId = targets[0]?.id || '';
    }
    if (!finalTargetId) return;

    const copy = { ...combatState };
    
    const isAoE = (ability.effects.join(' ') + ' ' + ability.desc).toLowerCase().includes('enemies') || 
                  (ability.effects.join(' ') + ' ' + ability.desc).toLowerCase().includes('damage_aoe') || 
                  (ability.effects.join(' ') + ' ' + ability.desc).toLowerCase().includes('debuff_all') ||
                  ability.aiTags.includes('aoe');
    
    // Setup Camera Effects based on Ability
    let shakeLevel: 'small' | 'medium' | 'large' = 'small';
    let zoomLevel: 'none' | 'quick' | 'wide' | 'large' | 'cinematic' = 'none';

    if (ability.type === 'ultimate') {
       shakeLevel = 'large';
       zoomLevel = 'cinematic';
       setCinematicAbility({ name: ability.name, isUltimate: true, characterId: currentActiveUnit.characterId });
    } else if (ability.type === 'special') {
       shakeLevel = 'medium';
       zoomLevel = isAoE ? 'wide' : 'quick';
       setCinematicAbility({ name: ability.name, isUltimate: false, characterId: currentActiveUnit.characterId });
    } else if (isAoE) {
       zoomLevel = 'wide';
    }

    setScreenShake(shakeLevel);
    setCameraZoom(zoomLevel);

    // Trigger lunge animation
    copy.turnAttackers = [];
    
    executeCombatAction(copy, currentActiveUnit.id, ability, finalTargetId, selectedAllyId || undefined);
    copy.activeUnitId = null; // Turn consumed
    setSelectedAllyId(null);  // Reset ally targeting selection for next unit turn
    setAttackingUnitIds(copy.turnAttackers || [currentActiveUnit.id]);
    
    const family = getCharacterAnimationFamily(currentActiveUnit.characterId, ability.type, ability.id);
    setActiveStrikes({
       targets: isAoE ? copy.enemyTeam.map(u => u.id) : [finalTargetId],
       family,
       type: getAbilityAnimationType(ability.type)
    });
    
    const attackDuration = (ability.type === 'ultimate' ? 2200 : ability.type === 'special' ? 1200 : 800) / battleSpeed;
    
    setTimeout(() => {
       setAttackingUnitIds([]);
       setCinematicAbility(null);
       setCameraZoom('none');
       setScreenShake(false);
       setActiveStrikes(null);
       setCombatState(copy);
       setSelectedAllyId(null); // Reset ally selection
    }, attackDuration);
  }

  function handleEndCombatAndPayout() {
    try {
      const earnedLoot = precalculatedLoot || [];
      const stars = starsCount || 1;
      const defeatedEnemyIds = combatState.enemyTeam.filter(u => u.hp <= 0).map(u => u.characterId);
      onExitCombat(combatState.winner === 'player', earnedLoot, stars, defeatedEnemyIds);
      return;
    } catch (err: any) {
      alert("Error concluding combat: " + err.message);
      console.error(err);
      onExitCombat(false, [], 0);
    }
  }

  function legacyHandleEndCombatAndPayout() {
    try {
      const earnedLoot = precalculatedLoot || [];
      const starsCountVal = starsCount || 1;
      const defeatedEnemyIdsVal = combatState.enemyTeam.filter(u => u.hp <= 0).map(u => u.characterId);
      // Legacy calculation ignored
      let earnedLootLegacy: { itemId: string; amount: number }[] = [];
      if (combatState.winner === 'player' && rewardNode) {
        rewardNode.rewards.forEach(r => {
          const chance = r.chance !== undefined ? r.chance : 1;
          if (Math.random() <= chance) {
            const min = typeof r.amountMin === 'number' ? r.amountMin : (r as any).amount || 1;
            const max = typeof r.amountMax === 'number' ? r.amountMax : (r as any).amount || 1;
            const amount = Math.floor(Math.random() * (max - min + 1)) + min;
            earnedLoot.push({ itemId: r.itemId, amount });
          }
        });
      } else if (combatState.winner === 'enemy' && rewardNode && rewardNode.id.includes('_complete')) {
         const score = combatState.totalScore || 0;
         if (score > 1000) {
             const tokens = Math.floor(score / 500);
             const credits = Math.floor(score / 20);
             earnedLoot.push({ itemId: 'raid_token', amount: tokens });
             earnedLoot.push({ itemId: 'credit', amount: credits });
         }
      }
      
      let starsLegacy = 1;
      if (combatState.winner === 'player') {
         const survivingPlayers = combatState.playerTeam.filter(u => u.hp > 0 && !u.isSummon).length;
         if (survivingPlayers >= (playerTeamIds?.length || 1)) starsLegacy = 3;
         else if (survivingPlayers === (playerTeamIds?.length || 1) - 1) starsLegacy = 2;
      }
      
      const defeatedEnemyIdsLegacy = combatState.enemyTeam.filter(u => u.hp <= 0).map(u => u.characterId);
      onExitCombat(combatState.winner === 'player', earnedLoot, starsLegacy, defeatedEnemyIdsLegacy);
    } catch (err: any) {
      alert("Error concluding combat: " + err.message);
      console.error(err);
      onExitCombat(false, [], 0);
    }
  }

  // Get environment styling
  let environmentClass = 'environment-coruscant-city';
  let customBackground: BattleBackground | null = null;
  
  // 1. Resolve Background String
  let bgString = '';
  if (waveBackgrounds && waveBackgrounds[currentWaveIndex]) {
    bgString = waveBackgrounds[currentWaveIndex];
  } else if (rewardNode?.background) {
    bgString = rewardNode.background;
  }

  // 2. Check if we have an explicit custom background ID or match
  if (bgString) {
    const found = BATTLE_BACKGROUNDS.find(b => 
      b.id === bgString || 
      b.id === `env_${bgString.toLowerCase().replace(/ /g, "_")}` ||
      b.name.toLowerCase() === bgString.toLowerCase()
    );
    if (found) {
      customBackground = found;
    }
  }

  // 3. Fallbacks if no custom background found yet
  if (!customBackground) {
    if (bgString) {
      // Use existing CSS class naming logic
      environmentClass = bgString.startsWith('environment-') ? bgString.replace(/_/g, '-') : `environment-${bgString.replace(/_/g, '-')}`;
    } else if (rewardNode?.planet) {
      // Planet fallback
      const p = rewardNode.planet.toLowerCase();
      if (p.includes('tatooine')) environmentClass = 'environment-tatooine-dunes';
      else if (p.includes('hoth')) environmentClass = 'environment-hoth-blizzard';
      else if (p.includes('mustafar')) environmentClass = 'environment-mustafar-lava';
      else if (p.includes('kamino')) environmentClass = 'environment-kamino-platform';
      else if (p.includes('geonosis')) environmentClass = 'environment-geonosis-arena';
      else if (p.includes('coruscant')) environmentClass = 'environment-coruscant-city';
      else if (p.includes('ryloth')) environmentClass = 'environment-ryloth-outpost';
      else if (p.includes('endor')) environmentClass = 'environment-endor-forest';
      else if (p.includes('exegol')) environmentClass = 'environment-exegol-storm';
      else if (p.includes('felucia')) environmentClass = 'environment-felucia-forest';
      else if (p.includes('mandalore')) environmentClass = 'environment-mandalore-city';
      else if (p.includes('jakku')) environmentClass = 'environment-jakku-dunes';
      else if (p.includes('takodana')) environmentClass = 'environment-takodana-forest';
      else if (p.includes('utapau')) environmentClass = 'environment-utapau-sinkhole';
      else if (p.includes('sullust')) environmentClass = 'environment-sullust-volcano';
      else if (p.includes('yavin')) environmentClass = 'environment-yavin-jungle';
      else if (p.includes('christophsis')) environmentClass = 'environment-christophsis-city';
      else if (p.includes('naboo')) environmentClass = 'environment-naboo-plains';
      else if (p.includes('mon cala')) environmentClass = 'environment-mon-cala-ocean';
      else {
        // Try to find if it's one of our custom backgrounds matching planet
        const matched = BATTLE_BACKGROUNDS.find(b => b.planet.toLowerCase() === p);
        if (matched) {
          customBackground = matched;
        } else {
          environmentClass = `environment-${p.replace(/ /g, '-')}`;
        }
      }
    } else {
      // Absolutely no background or planet info, check if we match by rewardNode name
      let foundByName = false;
      if (rewardNode?.name) {
        if (rewardNode.name.includes('Hoth')) { environmentClass = 'environment-hoth-base'; foundByName = true; }
        else if (rewardNode.name.includes('Mandalore') || rewardNode.name.includes('Maul')) { environmentClass = 'environment-mandalore-city'; foundByName = true; }
        else if (rewardNode.name.includes('Scarif')) { environmentClass = 'environment-beach-scarif'; foundByName = true; }
        else if (rewardNode.name.includes('Peridea')) { environmentClass = 'environment-exegol-temple'; foundByName = true; }
        else if (rewardNode.name.includes('Umbara')) { environmentClass = 'environment-christophsis-city'; foundByName = true; }
        else if (enemyWaves && enemyWaves[0] && enemyWaves[0].includes('b1_battle_droid')) { environmentClass = 'environment-geonosis-arena'; foundByName = true; }
        else if (enemyWaves && enemyWaves[0] && enemyWaves[0].includes('stormtrooper')) { environmentClass = 'environment-death-star'; foundByName = true; }
      }
      
      if (!foundByName) {
        // Absolutely no background or planet/name matches, auto-cycle fallback so a battle NEVER lacks a background!
        const seed = rewardNode?.id || rewardNode?.name || "fallback_cycle";
        customBackground = getFallbackBackground(seed);
      }
    }
  }

  // Set particle environment name based on customBackground if present
  let finalParticleEnv = environmentClass;
  if (customBackground) {
    // triggers appropriate particles in EnvironmentParticles
    finalParticleEnv = `environment-${customBackground.planet.toLowerCase()}-${customBackground.particles}`;
  }

  const turnOrderQueue = [...playerTeam, ...enemyTeam].filter(u => u.hp > 0).sort((a,b) => b.turnMeter - a.turnMeter).slice(0, 8);

  const getStatusIcon = (name: string) => {
    switch (name) {
      case 'Stun':
      case 'STUNNED':
        return '💤';
      case 'Ability Block':
      case 'ABILITY BLOCK':
        return '🔇';
      case 'Healing Immunity':
        return '🏥';
      case 'Daze':
        return '😵';
      case 'Shock':
        return '🌩️';
      case 'Burn':
      case 'Burning':
        return '🔥';
      case 'Exposed':
      case 'Expose':
        return '🎯';
      case 'Purge':
        return '👁️‍🗨️';
      case 'Frostbite':
        return '❄️';
      case 'Blind':
        return '🦯';
      case 'Fear':
        return '👻';
      case 'Offense Up':
        return '⚔️';
      case 'Offense Down':
        return '🗡️';
      case 'Defense Up':
        return '🛡️';
      case 'Defense Down':
        return '💔';
      case 'Speed Up':
        return '💨';
      case 'Speed Down':
        return '🐌';
      case 'Tenacity Up':
        return '💪';
      case 'Tenacity Down':
        return '🤒';
      case 'Potency Up':
        return '🎯';
      case 'Potency Down':
        return '📉';
      case 'Critical Chance Up':
        return '💥';
      case 'Critical Damage Up':
        return '🔥';
      case 'Foresight':
        return '👁️';
      case 'Retribution':
        return '↩️';
      case 'Protection Up':
        return '🔵';
      case 'Stealth':
        return '🥷';
      case 'Taunt':
        return '📢';
      case 'Tactical Data':
        return '💾';
      case 'Tactical Advantage':
        return '📈';
      case 'Impending Doom':
        return '⏳';
      case 'Last Hope':
        return '🌟';
      case 'Endless Legion':
        return '🤖';
      case 'Dark Maelstrom':
        return '🌪️';
      case 'Rule of Two':
        return '👥';
      case 'Unlimited Power':
        return '⚡';
      case 'Deathmark':
        return '💀';
      case 'Elusive':
        return '🌫️';
      case 'Contract':
        return '📜';
      case 'Bounty':
        return '🪙';
      case 'Unleashed':
        return '🔋';
      case 'Imperial Contract':
        return '📋';
      case 'Armor Shred':
        return '🔓';
      case 'Debt':
        return '💸';
      case 'Corruption':
        return '☣️';
      case 'Collector':
        return '🎒';
      case 'Infested':
        return '🐛';
      case 'Foil':
        return '⚔️';
      case 'Information Broker':
        return '🕵️';
      case 'Treasure':
        return '💎';
      case 'Hostage':
        return '🔗';
      case 'Payout':
        return '💰';
      case 'Raid Mark':
        return '🎯';
      case 'Secrecy':
        return '🤫';
      case 'Artifact':
        return '🏺';
      case 'Explosive Charge':
        return '💣';
      case 'Tortured':
        return '⛓️';
      case 'Imperial Decree':
        return '📜';
      case 'Dossier':
        return '📂';
      case 'Combined Arms':
        return '🤝';
      case 'Negotiator':
        return '⚖️';
      case 'Ambushed':
        return '🚨';
      case 'Overdisciplined':
        return '🧠';
      case 'Council Guidance':
        return '🧘';
      case 'Guardian\'s Resolve':
        return '🛡️';
      case 'Inspired':
        return '⭐';
      case 'Unconventional Tactics':
        return '💡';
      case 'Intel':
        return '🔎';
      case 'Insight':
        return '🔮';
      case 'Blaze Of Glory':
        return '🌠';
      case 'Reanimated':
        return '🧟';
      case 'Analysis':
        return '📊';
      case 'Entrenched':
        return '🪖';
      case 'Veteran Orders':
        return '🫡';
      case 'Resolve':
        return '🦁';
      case 'Ultimate Stance':
        return '👑';
      case 'Marked':
      case 'Marked Target':
        return '🎯';
      case 'Pursued':
        return '👣';
      case 'Order 66':
        return '💀';
      case 'Damage Over Time':
        return '🩸';
      case 'Shattered Defense':
        return '💥';
      case 'Whiteout':
        return '🌫️';
      case 'Predicted':
        return '🔮';
      case 'Battlefield Corruption':
        return '☣️';
      case 'Suppressed':
        return '🛑';
      case 'Momentum':
        return '👟';
      case 'Pathfinder':
        return '🧭';
      case 'Fatigued':
        return '🥱';
      case 'Lockdown':
        return '🔒';
      case 'Riot Control':
        return '🧱';
      case 'Damage Immunity':
        return '🔰';
      case 'Buff Immunity':
        return '🚫';
      case 'Advantage':
        return '🌟';
      case 'Dramatic Entrance':
        return '🎭';
      case 'Heal Over Time':
        return '❤️‍🩹';
      case 'Protection Over Time':
        return '✨';
      default: {
        const def = STATUS_DEFINITIONS[name];
        if (def) {
          return def.type === 'buff' ? '⬆️' : '⬇️';
        }
        return name.includes('Up') || name.includes('Recovery') ? '⬆️' : '⬇️';
      }
    }
  };

  let cameraTransformClass = 'scale-100 transition-transform duration-500 ease-in-out';
  if (cameraZoom === 'quick') cameraTransformClass = 'scale-110 transition-transform duration-300 ease-out';
  if (cameraZoom === 'wide') cameraTransformClass = 'scale-90 transition-transform duration-700 ease-in-out';
  if (cameraZoom === 'large') cameraTransformClass = 'scale-125 transition-transform duration-500 ease-out';
  if (cameraZoom === 'cinematic') cameraTransformClass = 'scale-150 backdrop-brightness-50 transition-all duration-1000 ease-in-out';

  let getShakeClass = () => {
    if (screenShake === 'small') return 'animate-shake-small';
    if (screenShake === 'medium') return 'animate-shake';
    if (screenShake === 'large') return 'animate-shake-large';
    if (screenShake === true) return 'animate-shake'; // Fallback
    return '';
  };

  return (
    <div className={`flex flex-col h-full min-h-[calc(100vh-6rem)] relative overflow-hidden bg-black ${getShakeClass()}`} id="combat_arena_stage">
      
      {/* Fullscreen Flash Effects */}
      <AnimatePresence>
        {flashEffect === 'red' && (
          <motion.div initial={{ opacity: 0.6 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 bg-red-600/40 z-[100] pointer-events-none mix-blend-screen" />
        )}
        {flashEffect === 'white' && (
          <motion.div initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-white/60 z-[100] pointer-events-none mix-blend-screen" />
        )}
        {flashEffect === 'blue' && (
          <motion.div initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 bg-indigo-500/50 z-[100] pointer-events-none mix-blend-screen" />
        )}
        {flashEffect === 'yellow' && (
           <motion.div initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 bg-amber-500/50 z-[100] pointer-events-none mix-blend-screen" />
        )}
        {flashEffect === 'purple' && (
           <motion.div initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className="absolute inset-0 bg-purple-600/40 z-[100] pointer-events-none mix-blend-screen" />
        )}
        {flashEffect === 'tactical' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 bg-blue-900/60 z-[100] pointer-events-none mix-blend-color-dodge flex items-center justify-center">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 animate-scan"></div>
             <div className="w-full h-1 bg-blue-400 absolute top-1/2 -translate-y-1/2 shadow-[0_0_20px_rgba(96,165,250,1)]"></div>
             <div className="w-1 h-full bg-blue-400 absolute left-1/2 -translate-x-1/2 shadow-[0_0_20px_rgba(96,165,250,1)]"></div>
           </motion.div>
        )}
        {flashEffect === 'hologram' && (
           <motion.div initial={{ opacity: 0.5, scale: 1.1 }} animate={{ opacity: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }} className="absolute inset-0 z-[100] pointer-events-none bg-blue-500/20 mix-blend-screen">
             <div className="absolute inset-0 scan-overlay opacity-80"></div>
             <div className="absolute top-0 w-full h-[2px] bg-blue-300 animate-slide-down shadow-[0_0_10px_rgba(147,197,253,1)]"></div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Container for camera zoom */}
      <div className={`absolute inset-0 z-0 pointer-events-none origin-bottom ${cameraTransformClass}`}>
         {/* Dynamic Environment Background */}
         {customBackground ? (
           <div 
             className="absolute inset-0 opacity-80 pointer-events-none transition-all duration-1000"
             style={customBackground.style}
           ></div>
         ) : (
           <div className={`absolute inset-0 ${environmentClass} opacity-80 pointer-events-none transition-all duration-1000`}></div>
         )}
         <BattleScenery 
           planet={customBackground ? customBackground.planet : (rewardNode?.planet || 'Coruscant')} 
           name={customBackground ? customBackground.name : (rewardNode?.name || '')} 
         />
         <EnvironmentParticles environment={finalParticleEnv} />
         <div className="hologram-overlay absolute inset-0"></div>
      </div>

      {/* Tactical Mission Briefing HUD Overlay */}
      {(rewardNode?.objective || rewardNode?.story) && showBriefing && (
        <div className="absolute top-24 left-4 w-72 md:w-80 bg-black/85 backdrop-blur-md border border-indigo-500/30 hover:border-indigo-500/50 rounded-2xl p-4 z-30 shadow-glow flex flex-col gap-3 text-zinc-300 pointer-events-auto" id="battle_briefing_panel">
          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
            <div className="flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-amber-400">
                Tactical Mission Intel
              </span>
            </div>
            <button onClick={() => setShowBriefing(false)} className="text-zinc-500 hover:text-white transition">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {rewardNode.objective && (
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-wider text-indigo-400 font-bold">Battle Objective</span>
              <p className="text-white text-xs font-semibold leading-snug font-sans">
                {rewardNode.objective}
              </p>
            </div>
          )}
          
          {rewardNode.story && (
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-wider text-indigo-400 font-bold">Story Logs</span>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-sans italic">
                "{rewardNode.story}"
              </p>
            </div>
          )}

          {rewardNode.rules && (
            <div className="space-y-1 bg-amber-950/20 border border-amber-500/15 p-2 rounded-lg text-[10px]">
              <span className="text-[9px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-0.5">Encounter Rules</span>
              <p className="text-zinc-300 font-mono leading-relaxed whitespace-pre-line text-[9.5px]">
                {rewardNode.rules}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Re-open briefing button */}
      {(rewardNode?.objective || rewardNode?.story) && !showBriefing && (
        <button 
          onClick={() => setShowBriefing(true)} 
          className="absolute top-24 left-4 z-30 bg-black/80 backdrop-blur-md border border-zinc-700 hover:border-indigo-500 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-mono text-zinc-300 hover:text-white transition shadow-lg pointer-events-auto"
        >
          <ScrollText className="w-3.5 h-3.5 text-indigo-400" />
          <span>Show Mission Intel</span>
        </button>
      )}

      {/* Top Header Bar */}
      <header className="relative z-20 flex justify-between items-start p-4">
        <div className="flex flex-col">
          <h2 className="font-display font-black text-white text-base md:text-xl tracking-widest text-shadow uppercase flex items-center gap-3">
            <Activity className="w-4 h-4 md:w-5 md:h-5 text-red-500 animate-pulse" /> 
            {rewardNode?.name || 'TACTICAL BATTLEFIELD'}
          </h2>
          {enemyWaves && enemyWaves.length > 1 && (
            <div className="text-zinc-400 font-mono text-xs md:text-sm tracking-widest mt-1">
              WAVE {currentWaveIndex + 1} / {enemyWaves.length}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-black/60 backdrop-blur-md rounded-xl border border-zinc-800 flex overflow-hidden">
              {[1, 2, 4].map(speed => (
                <button 
                  key={speed}
                  onClick={() => setBattleSpeed(speed)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 font-mono text-[10px] uppercase font-black transition ${
                    battleSpeed === speed 
                      ? 'bg-blue-600/30 text-blue-400 shadow-[inset_0_0_10px_rgba(37,99,235,0.5)]' 
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowLog(!showLog)}
              className={`p-1.5 md:p-2 rounded-xl transition ${
                showLog 
                  ? 'bg-indigo-600 border border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' 
                  : 'bg-black/60 border border-zinc-800 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/50'
              }`}
              title="Toggle Combat Log"
            >
              <ScrollText className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <button 
              onClick={() => setIsAuto(!isAuto)}
              className={`px-4 py-1.5 md:px-6 md:py-2 rounded-xl text-[10px] md:text-xs font-mono tracking-widest font-black transition uppercase ${
                isAuto 
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
                  : 'bg-black/60 text-zinc-400 border border-zinc-500 hover:text-white'
              }`}
            >
              {isAuto ? 'AUTO' : 'MANUAL'}
            </button>

            <button 
              onClick={() => {
                const defeatedEnemyIds = combatState.enemyTeam.filter(u => u.hp <= 0).map(u => u.characterId);
                onExitCombat(false, [], 0, defeatedEnemyIds);
              }}
              className="bg-black/60 hover:bg-red-950/40 border border-zinc-800 hover:border-red-500/50 p-1.5 md:p-2 rounded-xl text-zinc-400 hover:text-red-400 transition"
              title="Retreat"
            >
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Cinematic Ability Splash */}
      <AnimatePresence>
        {cinematicAbility && (
           <motion.div 
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
             className={`absolute inset-x-0 ${cinematicAbility.isUltimate ? 'bottom-32' : 'bottom-10'} z-[60] flex items-center justify-center pointer-events-none bg-transparent`}
           >
             {/* Lord Vader Signature */}
             {cinematicAbility.characterId === 'gl_lord_vader' && cinematicAbility.isUltimate && (
                <div className="fixed inset-0 flex items-center justify-center mix-blend-screen opacity-50 z-[-1]">
                   <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/30 via-transparent to-transparent animate-pulse"></div>
                   <div className="absolute inset-0 border-[4px] border-red-900/50 vibrate-1"></div>
                </div>
             )}

             {/* Kenobi Signature */}
             {cinematicAbility.characterId === 'master_kenobi' && cinematicAbility.isUltimate && (
                <div className="fixed inset-0 flex flex-col items-center justify-center z-[-1]">
                   <motion.div animate={{ scale: [0, 10], opacity: [0.5, 0] }} transition={{ duration: 1 }} className="absolute w-32 h-32 rounded-full border-2 border-blue-400/50 shadow-[0_0_20px_rgba(96,165,250,0.5)]"></motion.div>
                </div>
             )}

             {/* Master Luke Signature */}
             {cinematicAbility.characterId === 'luke_skywalker_gl' && cinematicAbility.isUltimate && (
                <div className="fixed inset-x-0 top-0 bottom-0 bg-gradient-to-b from-blue-900/30 to-transparent z-[-1]">
                   <motion.div animate={{ opacity: [0, 0.5, 0] }} transition={{ repeat: Infinity, duration: 0.1 }} className="absolute inset-0 bg-white/10 mix-blend-overlay"></motion.div>
                </div>
             )}

             {/* Leia Signature */}
             {cinematicAbility.characterId === 'gl_leia' && cinematicAbility.isUltimate && (
                <div className="fixed inset-0 flex gap-4 px-20 z-[-1]">
                   {[...Array(10)].map((_, i) => (
                      <motion.div key={i} animate={{ y: [-500, 500] }} transition={{ delay: Math.random() * 0.5, duration: 0.2 }} className="w-1 h-32 bg-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></motion.div>
                   ))}
                </div>
             )}
             
             {/* Jabba Signature */}
             {cinematicAbility.characterId === 'jabba' && cinematicAbility.isUltimate && (
                <motion.div animate={{ y: [-200, 0], scale: [1.5, 1] }} transition={{ type: "spring", bounce: 0 }} className="fixed bottom-0 w-full h-1/4 bg-amber-900/40 blur-xl z-[-1]"></motion.div>
             )}

             {/* Emperor Palpatine Signature */}
             {cinematicAbility.characterId === 'emperor_palpatine' && cinematicAbility.isUltimate && (
                <div className="fixed inset-0 flex flex-col items-center justify-center z-[-1] bg-black/50 overflow-hidden">
                   {[...Array(8)].map((_, i) => (
                      <motion.div key={i} animate={{ rotate: [0, 360 * (i%2 ? 1 : -1)] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute w-[200vw] h-[200vh] border border-blue-500/20 mix-blend-screen scale-[0.5] shadow-[0_0_30px_rgba(59,130,246,0.3)] origin-center"></motion.div>
                   ))}
                </div>
             )}

             {/* Rey / EFG Signatures */}
             {(cinematicAbility.characterId === 'rey_gl' || cinematicAbility.characterId === 'eternal_fire_grievous') && cinematicAbility.isUltimate && (
                <div className="fixed inset-0 bg-white/20 animate-pulse z-[-1]"></div>
             )}

             <div className={`relative z-10 font-display font-black text-xl md:text-2xl text-center uppercase tracking-widest px-8 py-2 rounded-full border border-white/10 bg-black/60 shadow-2xl backdrop-blur-md
               ${cinematicAbility.isUltimate ? 'text-indigo-300 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)] border-indigo-500/30' : 'text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] text-base md:text-xl px-6'}
             `}>
               {cinematicAbility.name}
             </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Turn Order Queue */}
      <div className="flex justify-center -mt-2 relative z-20">
        <div className="bg-black/40 backdrop-blur-md border border-cyan-500/20 px-4 md:px-6 py-1.5 md:py-2 rounded-full flex gap-2 md:gap-3 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex-wrap justify-center">
           <span className="text-[9px] md:text-[10px] text-cyan-500/50 uppercase tracking-widest font-mono self-center md:mr-2">Initiative</span>
           {turnOrderQueue.map((u, i) => (
             <div key={`${u.id}-${i}`} className={`flex items-center gap-1 ${i === 0 ? 'scale-110' : 'opacity-60 grayscale'}`}>
               <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border border-zinc-800 flex items-center justify-center text-[9px] md:text-[10px] font-bold ${u.team === 'player' ? 'bg-blue-900/50 text-blue-300 border-blue-500/30' : 'bg-red-900/50 text-red-300 border-red-500/30'}`}>
                 {u.name.substring(0,1)}
               </div>
             </div>
           ))}
        </div>
      </div>

      {/* Battlefield Elements */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-2 xl:px-12 relative z-10 w-full md:gap-8 pb-32">
         
         {/* Player Formation */}
         <div className="flex-1 flex flex-wrap justify-center xl:justify-start items-center gap-4 xl:gap-8 w-full mt-4 md:mt-0 relative perspective-1000">
           {playerTeam.map(unit => {
             const isActive = currentActiveUnit?.id === unit.id;
             const isSelectedAlly = selectedAllyId === unit.id;

             return (
               <div key={unit.id} className="relative z-20">
                 {floatingTexts.filter(ft => ft.unitId === unit.id).map(ft => (
                    <motion.div 
                      key={ft.id}
                      initial={{ y: 20, opacity: 0, scale: 0.5 }}
                      animate={{ y: -60, opacity: [0, 1, 1, 0], scale: [0.5, 1.3, 1, 0.8] }}
                      transition={{ duration: 1.8, ease: "easeOut" }}
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999] text-center font-black font-mono px-2 py-0.5 lg:px-3 lg:py-1 whitespace-nowrap ${ft.colorClass}`}
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)' }}
                    >
                      {ft.text}
                    </motion.div>
                 ))}
                 
                 <HoloCombatUnit
                    unit={unit}
                    isActive={isActive}
                    isAttacking={attackingUnitIds.includes(unit.id)}
                    strikeEffect={activeStrikes?.targets.includes(unit.id) ? { family: activeStrikes.family, type: activeStrikes.type } : null}
                    isSelectedTarget={false}
                    isSelectedAlly={isSelectedAlly}
                    onSelect={() => { setSelectedAllyId(unit.id); }}
                    onDoubleClick={() => { setInspectedUnitId(unit.id); setShowDeepStats(true); }}
                 />
                 {isSelectedAlly && <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] bg-emerald-600/80 px-2 py-0.5 text-white font-black animate-pulse rounded-full border border-emerald-400 whitespace-nowrap z-30">ALLY</div>}
               </div>
             );
           })}
         </div>

         {/* Enemy Formation */}
         <div className="flex-1 flex flex-wrap justify-center xl:justify-end items-center gap-4 xl:gap-8 w-full mt-6 md:mt-0 relative perspective-1000">
           {enemyTeam.map(unit => {
             const isActive = currentActiveUnit?.id === unit.id;
             const isSelected = selectedTargetId === unit.id;

             return (
               <div key={unit.id} className="relative z-20">
                 {floatingTexts.filter(ft => ft.unitId === unit.id).map(ft => (
                    <motion.div 
                      key={ft.id}
                      initial={{ y: 20, opacity: 0, scale: 0.5 }}
                      animate={{ y: -60, opacity: [0, 1, 1, 0], scale: [0.5, 1.3, 1, 0.8] }}
                      transition={{ duration: 1.8, ease: "easeOut" }}
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999] text-center font-black font-mono px-2 py-0.5 lg:px-3 lg:py-1 whitespace-nowrap ${ft.colorClass}`}
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)' }}
                    >
                      {ft.text}
                    </motion.div>
                 ))}

                 <HoloCombatUnit
                    unit={unit}
                    isActive={isActive}
                    isAttacking={attackingUnitIds.includes(unit.id)}
                    strikeEffect={activeStrikes?.targets.includes(unit.id) ? { family: activeStrikes.family, type: activeStrikes.type } : null}
                    isSelectedTarget={isSelected}
                    isSelectedAlly={false}
                    onSelect={() => { setSelectedTargetId(unit.id); }}
                    onDoubleClick={() => { setInspectedUnitId(unit.id); setShowDeepStats(true); }}
                 />
                 
                 {isSelected && <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] bg-red-600/80 px-2 py-0.5 text-white font-black animate-pulse rounded-full border border-red-400">TARGET</div>}
               </div>
             );
           })}
         </div>
      </div>
      
      {/* Inspected Unit Overlay */}
      {inspectedUnitId && combatState && (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-11/12 max-w-md holo-panel rounded-3xl p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-cyan-500/30"
          >
            {(() => {
              const u = combatState.playerTeam.find(x => x.id === inspectedUnitId) || combatState.enemyTeam.find(x => x.id === inspectedUnitId);
              if (!u) return null;
              
              const hpPercent = (u.hp / u.maxHp) * 100;
              const protPercent = u.maxProtection > 0 ? (u.protection / u.maxProtection) * 100 : 0;
              
              const baseStats = { speed: u.speed, offense: u.offense, defense: u.defense, pot: u.potency, ten: u.tenacity };
              const modStats = getModifiedStats(u);
              
              return (
                <div className="relative">
                  <div className="flex gap-2 absolute -top-4 -right-4 z-10">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowDeepStats(!showDeepStats); }}
                      className="text-cyan-400 hover:text-white bg-black/90 rounded-full p-2 border border-cyan-700/50 hover:bg-cyan-900/50 transition-colors shadow-lg"
                      title={showDeepStats ? "Hide Detailed Stats" : "Show Detailed Kit Stats"}
                    >
                      <Activity className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setInspectedUnitId(null); setShowDeepStats(false); }}
                      className="text-zinc-400 hover:text-white bg-black/90 rounded-full p-2 border border-zinc-700 transition-colors shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                     <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center shrink-0 glow-neon ${u.team === 'player' ? 'border-sky-500 bg-sky-950/50' : 'border-red-500 bg-red-950/50'}`}>
                        <div className="text-[10px] font-black uppercase text-center break-words px-1">
                          {allCharacters.find(c => c.id === u.characterId)?.faction || 'Unknown'}
                        </div>
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-white uppercase tracking-wider">{u.name}</h3>
                       <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-1">
                          Levels: <span className="text-zinc-200">{u.level || 1}</span> | <span className="text-yellow-500">{u.stars || 1}⭐</span>
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 mt-0.5">
                          Tier: <span className="text-blue-400">G{u.gearTier || 1}</span>
                          {(u.relicLevel ?? 0) > 0 && <span className="text-red-400">R{u.relicLevel}</span>}
                       </div>
                     </div>
                  </div>

                  <div className="space-y-3 mb-4 bg-black/40 p-3 rounded-xl border border-white/5">
                    <div>
                      <div className="flex justify-between text-[10px] text-zinc-400 font-mono mb-1">
                        <span>HEALTH</span>
                        <span>{Math.ceil(u.hp).toLocaleString()} / {Math.ceil(u.maxHp).toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-zinc-800">
                        <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${Math.max(0, hpPercent)}%` }}></div>
                      </div>
                    </div>
                    {u.maxProtection > 0 && (
                      <div>
                        <div className="flex justify-between text-[10px] text-zinc-400 font-mono mb-1">
                          <span>PROTECTION</span>
                          <span>{Math.ceil(u.protection).toLocaleString()} / {Math.ceil(u.maxProtection).toLocaleString()}</span>
                        </div>
                        <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-zinc-800">
                          <div className="h-full bg-white transition-all duration-300" style={{ width: `${Math.max(0, protPercent)}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {showDeepStats && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-4 overflow-hidden">
                       <h4 className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-widest mb-2 border-b border-indigo-900/50 pb-1 flex justify-between">
                         <span>Live Combat Stats</span>
                         <span className="text-zinc-500">Base {'->'} Modified</span>
                       </h4>
                       <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                          <div className="bg-black/50 p-2 rounded border border-white/5 flex justify-between">
                             <span className="text-zinc-500">SPD</span>
                             <span className={modStats.speed !== baseStats.speed ? (modStats.speed > baseStats.speed ? 'text-emerald-400' : 'text-red-400') : 'text-zinc-300'}>{Math.floor(baseStats.speed)} {'->'} {Math.floor(modStats.speed)}</span>
                          </div>
                          <div className="bg-black/50 p-2 rounded border border-white/5 flex justify-between">
                             <span className="text-zinc-500">OFF</span>
                             <span className={modStats.offense !== baseStats.offense ? (modStats.offense > baseStats.offense ? 'text-emerald-400' : 'text-red-400') : 'text-zinc-300'}>{Math.floor(baseStats.offense)} {'->'} {Math.floor(modStats.offense)}</span>
                          </div>
                          <div className="bg-black/50 p-2 rounded border border-white/5 flex justify-between">
                             <span className="text-zinc-500">DEF</span>
                             <span className={modStats.defense !== baseStats.defense ? (modStats.defense > baseStats.defense ? 'text-emerald-400' : 'text-red-400') : 'text-zinc-300'}>{Math.floor(baseStats.defense)} {'->'} {Math.floor(modStats.defense)}</span>
                          </div>
                          <div className="bg-black/50 p-2 rounded border border-white/5 flex justify-between">
                             <span className="text-zinc-500">POT</span>
                             <span className={modStats.potency !== baseStats.pot ? (modStats.potency > baseStats.pot ? 'text-emerald-400' : 'text-red-400') : 'text-zinc-300'}>{Math.round(baseStats.pot * 100)}% {'->'} {Math.round(modStats.potency * 100)}%</span>
                          </div>
                       </div>
                    </motion.div>
                  )}

                  <div>
                    <h4 className="text-[10px] text-cyan-500 font-mono font-bold uppercase tracking-widest mb-2 border-b border-cyan-900/50 pb-1">Active Statuses</h4>
                    {u.statuses.length === 0 ? (
                      <div className="text-xs text-zinc-500 font-mono italic p-2 bg-white/5 rounded-lg text-center">No active statuses</div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 pr-1">
                        {u.statuses.map((st, idx) => {
                          const def = STATUS_DEFINITIONS[st.name];
                          let descStr = '';
                          if (def && showDeepStats) {
                              if (def.desc) {
                                  descStr = def.desc;
                              } else {
                                  const mods = [];
                                  if (def.statModifiers?.speed) mods.push(`Speed x${def.statModifiers.speed}`);
                                  if (def.statModifiers?.offense) mods.push(`Offense x${def.statModifiers.offense}`);
                                  if (def.statModifiers?.defense) mods.push(`Defense x${def.statModifiers.defense}`);
                                  if (def.flags?.includes('stun')) mods.push('Cannot act');
                                  if (def.flags?.includes('ability_block')) mods.push('Cannot use Specials');
                                  if (def.flags?.includes('damage_on_turn_start')) mods.push('Damage on turn start');
                                  if (def.flags?.includes('taunt')) mods.push('Forces enemy targeting');
                                  
                                  if (mods.length > 0) {
                                    descStr = mods.join(' | ');
                                  } else {
                                    descStr = `${st.isDebuff ? 'Negative' : 'Positive'} tactical status`;
                                  }
                              }
                          }
                          
                          return (
                            <div key={idx} className={`p-2.5 rounded-lg border flex flex-col gap-1.5 ${st.isDebuff ? 'bg-red-950/20 border-red-900/50' : 'bg-emerald-950/20 border-emerald-900/50'}`}>
                              <div className="flex items-center justify-between font-bold">
                                 <div className="flex gap-1.5 items-center">
                                   <span className={st.isDebuff ? 'text-red-400 text-xs' : 'text-emerald-400 text-xs'}>{st.name}</span>
                                   {st.count && st.count > 1 && <span className="text-[10px] bg-black/50 px-1.5 py-0.5 rounded border border-white/10">x{st.count}</span>}
                                 </div>
                                 <span className="text-[9px] text-zinc-400 font-mono uppercase bg-black/30 px-1.5 py-0.5 rounded">{st.duration} turns</span>
                              </div>
                              {showDeepStats && (
                                <div className="text-[9.5px] leading-relaxed text-zinc-300 font-mono opacity-90 border-t border-white/5 pt-1.5 mt-0.5">
                                  {descStr}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Cinematic HUD Overlay - Active Commands */}
      <div className="absolute bottom-0 left-0 right-0 h-40 md:h-48 bg-gradient-to-t from-black via-black/90 to-transparent z-40 p-4 md:p-6 flex flex-col justify-end pointer-events-none">
        {currentActiveUnit && currentActiveUnit.team === 'player' && !isAuto && (
          <div className="flex justify-center gap-2 md:gap-6 w-full max-w-5xl mx-auto items-end pointer-events-auto">
             {currentActiveUnit.abilities.filter(ab => ab.type !== 'leader' && ab.type !== 'unique').map(ab => {
                 const cdRemaining = currentActiveUnit.cooldowns[ab.id] || 0;
                 const isBlocked = currentActiveUnit.statuses.some(s => s.name === 'Ability Block' || s.name === 'ABILITY BLOCK');
                 const ultimateCharge = currentActiveUnit.ultimateCharge ?? 0;
                 const ultimateNotReady = ab.type === 'ultimate' && ultimateCharge < 100;
                 const isTutorialLocked = saveState?.tutorialStep === 1 && ab.type !== 'basic';
                 const isRestricted = (isBlocked && (ab.type === 'special' || ab.type === 'ultimate')) || ultimateNotReady || isTutorialLocked;
                 const onCd = cdRemaining > 0 || isRestricted;

                 return (
                   <button 
                     key={ab.id}
                     onClick={() => !onCd && handleManualAbilityUse(ab)}
                     disabled={onCd}
                     className={`group relative py-3 px-4 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all w-28 md:w-64 text-left flex flex-col justify-end min-h-[4rem] hover:min-h-[8rem] ${
                       onCd 
                         ? 'bg-zinc-950/90 border-zinc-800 opacity-60 cursor-not-allowed grayscale' 
                         : ab.type === 'ultimate' ? 'bg-indigo-950/90 border-indigo-500 hover:border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-2' 
                         : 'bg-cyan-950/90 border-cyan-500 hover:bg-cyan-900/90 hover:border-cyan-400 hover:-translate-y-1 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                     } overflow-hidden`}
                   >
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     
                     {/* Dynamic Extra Info (Reveals on Hover) */}
                     <div className="h-0 overflow-hidden group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
                       <div className="flex justify-between items-center text-[9px] md:text-[10px] font-mono uppercase text-zinc-300 w-full mb-1">
                         <span className={`font-black flex items-center gap-1.5 ${ab.type === 'ultimate' ? 'text-indigo-400' : 'text-cyan-400'}`}>
                           {ab.type === 'ultimate' && <Star className="w-3 h-3 animate-pulse" />}
                           {ab.type}
                         </span>
                         {isTutorialLocked ? <span className="text-red-400 bg-red-950 px-1.5 py-0.5 rounded font-black border border-red-500/30">LOCKED PENDING TRAINING</span> : ultimateNotReady ? <span className="text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded font-black border border-amber-500/30">{ultimateCharge}% ULT</span> : isBlocked && ab.type !== 'basic' ? <span className="text-red-400 bg-red-950 px-1.5 py-0.5 rounded font-black border border-red-500/30">BLOCKED</span> : (cdRemaining > 0 && <span className="text-red-400 bg-red-950 px-1.5 py-0.5 rounded font-black border border-red-500/30">CD: {cdRemaining}</span>)}
                       </div>
                       <p className="text-[9px] md:text-[10px] text-zinc-400 font-mono mt-1 mb-2 leading-relaxed line-clamp-3">{ab.desc}</p>
                     </div>

                     {isAllyTargetAbility(ab) && !selectedAllyId && (
                        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-black text-[9px] font-black font-mono tracking-widest px-2 py-0.5 rounded pointer-events-none transition-all ${needsAllySelectionAbilityId === ab.id ? 'bg-red-500 scale-125 animate-pulse z-50 text-white border border-red-300 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-amber-500'}`}>
                           SELECT ALLY
                        </div>
                     )}

                     <strong className="text-white text-xs md:text-base relative z-10 tracking-widest font-display block truncate drop-shadow-md">{ab.name}</strong>

                     {ab.type === 'ultimate' && (
                       <div className="absolute top-0 inset-x-0 h-1 bg-amber-950 opacity-80 z-20">
                         <div className="h-full bg-amber-500 shadow-glow" style={{ width: `${ultimateCharge}%` }}></div>
                       </div>
                     )}
                   </button>
                 );
             })}
          </div>
        )}
      </div>

      {/* Combat Log Panel */}
      {showLog && (
        <div className="absolute top-20 right-4 w-72 md:w-80 max-h-[60vh] bg-black/90 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 z-50 flex flex-col shadow-2xl animate-fade-in pointer-events-auto">
          <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
            <h3 className="text-zinc-200 font-mono text-xs uppercase tracking-widest font-black flex items-center gap-2">
              <ScrollText className="w-3.5 h-3.5 text-indigo-400" /> Action Log
            </h3>
            <button onClick={() => setShowLog(false)} className="text-zinc-500 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin rounded">
            {combatState.battleLog.slice().reverse().map((log, i) => (
              <div key={i} className="text-[10px] md:text-xs font-mono">
                <span className={`
                  ${log.type === 'damage' ? 'text-red-400' : ''}
                  ${log.type === 'heal' ? 'text-emerald-400' : ''}
                  ${log.type === 'debuff' ? 'text-purple-400' : ''}
                  ${log.type === 'buff' ? 'text-cyan-400' : ''}
                  ${log.type === 'turn' ? 'text-amber-500 font-bold' : ''}
                  ${log.type === 'ultimate' ? 'text-indigo-400 font-black' : ''}
                  ${log.type === 'death' ? 'text-rose-600 font-black' : 'text-zinc-400'}
                `}>
                  {log.text}
                </span>
              </div>
            ))}
            {combatState.battleLog.length === 0 && (
              <div className="text-zinc-600 text-xs text-center py-4 font-mono">No actions recorded yet.</div>
            )}
          </div>
        </div>
      )}

      {/* Combat Log Panel */}
      {showLog && (
        <div className="absolute top-20 right-4 w-72 md:w-80 max-h-[60vh] bg-black/90 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 z-50 flex flex-col shadow-2xl animate-fade-in pointer-events-auto">
          <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
            <h3 className="text-zinc-200 font-mono text-xs uppercase tracking-widest font-black flex items-center gap-2">
              <ScrollText className="w-3.5 h-3.5 text-indigo-400" /> Action Log
            </h3>
            <button onClick={() => setShowLog(false)} className="text-zinc-500 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin rounded">
            {combatState.battleLog.slice().reverse().map((log, i) => (
              <div key={i} className="text-[10px] md:text-xs font-mono">
                <span className={`
                  ${log.type === 'damage' ? 'text-red-400' : ''}
                  ${log.type === 'heal' ? 'text-emerald-400' : ''}
                  ${log.type === 'debuff' ? 'text-purple-400' : ''}
                  ${log.type === 'buff' ? 'text-cyan-400' : ''}
                  ${log.type === 'turn' ? 'text-amber-500 font-bold' : ''}
                  ${log.type === 'ultimate' ? 'text-indigo-400 font-black' : ''}
                  ${log.type === 'death' ? 'text-rose-600 font-black' : 'text-zinc-400'}
                `}>
                  {log.text}
                </span>
              </div>
            ))}
            {combatState.battleLog.length === 0 && (
              <div className="text-zinc-600 text-xs text-center py-4 font-mono">No actions recorded yet.</div>
            )}
          </div>
        </div>
      )}

      {/* Cinematic End Screen Overlay */}
      {combatState.ended && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl z-50 flex items-center justify-center animate-fade-in">
           <div className="bg-zinc-950 border border-zinc-800 p-12 rounded-[2rem] max-w-lg w-full text-center space-y-8 shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute top-0 w-full h-2 left-0 bg-gradient-to-r from-transparent via-zinc-500 to-transparent"></div>
              
              <h2 className="font-display font-black text-5xl uppercase tracking-widest text-shadow-lg">
                 {combatState.winner === 'player' ? <span className="text-emerald-400 drop-shadow-[0_0_25px_rgba(16,185,129,1)]">VICTORY</span> : <span className="text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,1)]">DEFEAT</span>}
              </h2>
              
              {/* Dynamic Victory/Story Text */}
              <div className="space-y-4 max-w-sm mx-auto">
                {(() => {
                  const ultimateLogs = combatState.winner === 'player' ? combatState.battleLog.filter(log => log.type === 'ultimate') : [];
                  const hasStory = combatState.winner === 'player' && rewardNode?.story;
                  const hasUltimates = ultimateLogs.length > 0;

                  if (!hasStory && !hasUltimates) {
                    return (
                      <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                         All hostilities have concluded. Mission objectives have been consolidated. Threat neutralized.
                      </p>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {hasStory && (
                        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 text-left shadow-lg">
                          <span className="text-[9px] font-mono font-black uppercase text-indigo-400 tracking-widest block mb-1">STORY REPORT</span>
                          <p className="text-indigo-100 font-mono text-xs leading-relaxed">{rewardNode.story}</p>
                        </div>
                      )}
                      {hasUltimates && (
                        <div className="space-y-3">
                          {ultimateLogs.map((log, i) => (
                            <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-left shadow-lg">
                              <span className="text-[9px] font-mono font-black uppercase text-amber-400 tracking-widest block mb-1">SCRIPTED EVENT</span>
                              <p className="text-amber-100 font-mono text-xs leading-relaxed">{log.text.replace(/^[🎬🎖️🚨🏆]\s*/, '').replace(/^Scripted Event:\s*/i, '')}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Earned Loot Section */}
              {combatState.winner === 'player' && precalculatedLoot && precalculatedLoot.length > 0 && (
                <div className="space-y-3 border-t border-zinc-900 pt-6">
                  <h4 className="text-zinc-500 text-[9px] font-mono uppercase tracking-widest text-center">Tactical Assets Recovered</h4>
                  <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto">
                    {precalculatedLoot.map((rew, idx) => (
                      <div key={idx} className="bg-zinc-900/60 border border-zinc-800 px-3 py-2 rounded-xl flex items-center gap-2 text-left min-w-[120px] hover:border-emerald-500/20 transition">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-zinc-400 font-mono uppercase tracking-wide leading-none">
                            {rew.itemId.replace('shards_', 'Shards: ').replace(/_/g, ' ')}
                          </span>
                          <span className="text-sm font-bold text-emerald-400 mt-1">+{rew.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button 
                onClick={handleEndCombatAndPayout}
                className={`w-full py-5 rounded-2xl text-black font-black uppercase text-base tracking-widest transition ${combatState.winner === 'player' ? 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.7)]' : 'bg-red-600 hover:bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.7)]'}`}
              >
                Return to Command
              </button>
           </div>
        </div>
      )}
    </div>
  );
};
