import React, { useState, useEffect } from 'react';
import { SaveState, CampaignNode, RaidConfig, CampaignNodeReward, PlayerCharacterProgress } from './types';
import { loadSaveState, saveState, resetSaveState } from './utils/saveManager';
import { DashboardView } from './components/DashboardView';
import { RosterView } from './components/RosterView';
import { CampaignView } from './components/CampaignView';
import { JourneyView } from './components/JourneyView';
import { RaidView } from './components/RaidView';
import { EventsView } from './components/EventsView';
import { ExportPipelineView } from './components/ExportPipelineView';
import { GearIndexView } from './components/GearIndexView';
import { CombatBattleView } from './components/CombatBattleView';
import { SquadSelectView } from './components/SquadSelectView';
import { ConquestView } from './components/ConquestView';
import { EraView } from './components/EraView';
import { RAIDS } from './data/raids';
import { getAllCharacters } from './data/characters';
import { TeamsView } from './components/TeamsView';
import { ShopView } from './components/ShopView';
import { MissionsView } from './components/MissionsView';
import { TutorialCoordinator } from './components/TutorialCoordinator';
import { BackgroundViewer } from './components/BackgroundViewer';
import { 
  Compass, Coins, Sparkles, Award, Shield, Flame, Sliders, Play, TrendingUp, Cpu, Users, Settings, Download, BookOpen, ShoppingCart, Check, Bot, Swords
} from 'lucide-react';

import { checkMissions, recalculateAchievements } from './utils/missionEngine';
import { NetworkManager, PlayerProfile } from './utils/networkManager';
import { OnlinePanel } from './components/OnlinePanel';
import { AnnouncementsTab } from './components/AnnouncementsTab';
import { GalacticSiege } from './components/GalacticSiege';
import { Globe, Wifi } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('home');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [targetFarmNodeId, setTargetFarmNodeId] = useState<string | null>(null);
  const [journeyContext, setJourneyContext] = useState<{id: string | null, tab: 'prereqs'|'phases', category: 'standard'|'gl'}>({id: 'j_anakin', tab: 'prereqs', category: 'standard'});
  const [save, setSave] = useState<SaveState | null>(null);
  const [isOnlinePanelOpen, setIsOnlinePanelOpen] = useState(false);
  const [onlinePanelTab, setOnlinePanelTab] = useState<string>('account');
  const [activeOpponent, setActiveOpponent] = useState<PlayerProfile | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Energy Regen timer (in seconds)
  const [energyTimer, setEnergyTimer] = useState<number>(360); // 6 minutes till next energy point

  useEffect(() => {
    const interval = setInterval(() => {
      setSave((currentSave) => {
        if (!currentSave) return null;
        if (currentSave.energy >= 1000) {
          setEnergyTimer(360);
          return currentSave;
        }
        
        let nextSave = currentSave;
        setEnergyTimer((prevTimer) => {
          if (prevTimer <= 1) {
            // Add 1 energy
            const updatedSave = {
              ...currentSave,
              energy: Math.min(1000, currentSave.energy + 1)
            };
            saveState(updatedSave);
            nextSave = updatedSave;
            return 360;
          }
          return prevTimer - 1;
        });

        return nextSave;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Active Combat Arena State
  const [inBattle, setInBattle] = useState<boolean>(false);
  const [customBattleRender, setCustomBattleRender] = useState<(() => React.ReactNode) | null>(null);
  const [battleRoster, setBattleRoster] = useState<{
    playerIds: string[];
    enemyIds: string[];
    enemyWaves?: string[][];
    waveBackgrounds?: string[];
    isLoaned?: boolean;
    isMarquee?: boolean;
    difficultyMultiplier?: number;
    rewardNode: { id: string; name: string; rewards: CampaignNodeReward[]; energyCost: number; background?: string; powerRecommended?: number } | null;
  } | null>(null);

  // Post-Start Squad Selection State
  const [squadSelectPayload, setSquadSelectPayload] = useState<{
    nodeName: string;
    enemies: string[];
    enemyWaves?: string[][];
    energyCost: number;
    powerRecommended?: number;
    rewards: CampaignNodeReward[];
    restrictTags?: string[];
    restrictEra?: string;
    allowedCharacterIds?: string[];
    isMarquee?: boolean;
    marqueeCharId?: string;
    isJourney?: boolean;
    onConfirm: (playerIds: string[]) => void;
  } | null>(null);

  const [postBattleModal, setPostBattleModal] = useState<{
    success: boolean;
    stars: number;
    rewards: { itemId: string; amount: number }[];
  } | null>(null);

  const loadActiveProfile = () => {
    let currentSave = loadSaveState();
    if (!currentSave) {
      return;
    }

      // Cleanup bad era unlocks (only once)
      if (!currentSave!.inventory) {
        currentSave!.inventory = {};
      }
      if (!currentSave!.inventory['era_wipe_complete_v2']) {
          const eraWipes = ['bx_commando_droid', 'kelhani', 'droideka', 'spider_droid', 'magna_guard_elite', 'grand_admiral_trench', 'coleman_kcaj', 'oppo_rancisis', 'adi_gallia', 'luminara_unduli', 'yaddle', 'dooku_war_council', 'nute_gunray', 'wat_tambor', 'lott_dod', 'whorm_loathsom', 'eternal_fire_grievous', 'master_kenobi'];
          let needsSave = false;
          eraWipes.forEach(uid => {
               if (currentSave!.characters[uid]) {
                   if (uid !== 'captain_rex') {
                       currentSave!.characters[uid].unlocked = false;
                       currentSave!.characters[uid].stars = 1;
                       currentSave!.inventory[`shards_${uid}`] = 0;
                   }
               }
               if (currentSave!.inventory[`era_mq_completed_${uid}`]) {
                   delete currentSave!.inventory[`era_mq_completed_${uid}`];
               }
          });
          if (currentSave!.inventory[`era_mq_completed_captain_rex`]) { delete currentSave!.inventory[`era_mq_completed_captain_rex`]; }
          Object.keys(currentSave!.inventory).forEach(k => {
               if (k.startsWith('era_frontline_')) delete currentSave!.inventory[k];
          });
          currentSave!.inventory['era_wipe_complete_v2'] = 1;
          saveState(currentSave!);
      }

    setSave(currentSave);
  };

  // Load save states
  useEffect(() => {
    loadActiveProfile();
  }, []);

  if (!save) return null;

  const activeChampions = (Object.values(save.characters) as PlayerCharacterProgress[]).filter(c => c.unlocked);
  const totalPower = activeChampions.reduce((sum, c) => {
    return sum + (c.level * 150 + c.stars * 800 + c.gearTier * 1200 + c.relicLevel * 2500 + c.legendLevel * 4000);
  }, 0);

  // Global save synchronizers
  function updateSaveState(newState: SaveState) {
    const updatedWithAchievements = recalculateAchievements(newState);
    saveState(updatedWithAchievements);
    setSave(updatedWithAchievements);
    if (NetworkManager.isOnline()) {
      NetworkManager.uploadSave(updatedWithAchievements).catch(err => {
        console.error("Auto cloud sync error:", err);
      });
    }
  }

  function launchTutorial1() {
    setBattleRoster({
      playerIds: ['captain_rex', 'fives', 'echo_501st'],
      enemyIds: ['b1_battle_droid', 'b1_battle_droid', 'b2_super_droid'],
      isLoaned: true,
      rewardNode: {
        id: 'tutorial_1',
        name: 'Combat Training: Basics',
        rewards: [],
        energyCost: 0
      }
    });
    setInBattle(true);
  }

  function launchTutorial2() {
    setBattleRoster({
      playerIds: ['commander_cody', 'general_kenobi', '212th_clone_trooper'],
      enemyIds: ['magnaguard', 'bx_commando_droid', 'b1_battle_droid'],
      isLoaned: true,
      rewardNode: {
        id: 'tutorial_2',
        name: 'Combat Training: Specials',
        rewards: [],
        energyCost: 0
      }
    });
    setInBattle(true);
  }

  // Handle battle launching from Campaign
  function launchCampaignBattle(node: CampaignNode) {
    // Check energy
    if (save.energy < node.energyCost) {
      alert("Missing energy! Adjust using Admin tool or wait for auto re-charges.");
      return;
    }

    setSquadSelectPayload({
      nodeName: node.nodeName,
      enemies: node.enemies,
      energyCost: node.energyCost,
      powerRecommended: node.powerRecommended,
      rewards: node.rewards,
      onConfirm: (squadIds: string[]) => {
        setBattleRoster({
          playerIds: squadIds,
          enemyIds: node.enemies,
          rewardNode: {
            id: node.id,
            name: node.nodeName,
            background: node.background,
            rewards: node.rewards,
            energyCost: node.energyCost,
            powerRecommended: node.powerRecommended
          }
        });
        setInBattle(true);
      }
    });
  }

  // Handle battle launching from Journey
  function launchJourneyBattle(config: any, phaseIndex: number, requiredIds: string[]) {
    const safeRequiredIds = requiredIds || [];
    const phase = config.phases[phaseIndex];
    const phaseId = `journey_phase_${config.id}_${phaseIndex}`;
    const maxProgressCompleted = save?.maxJourneyProgress?.[config.id] !== undefined && save.maxJourneyProgress[config.id] >= phaseIndex;
    const alreadyCompleted = save?.completedCampaigns?.includes(phaseId) || maxProgressCompleted;
    
    const rewardsList: CampaignNodeReward[] = alreadyCompleted ? [] : phase.rewards.map((r: any) => ({
      itemId: r.itemId,
      amountMin: r.amount,
      amountMax: r.amount,
      chance: 1.0
    }));

    if (phase.loanedPlayerSquad && phase.loanedPlayerSquad.length > 0) {
      // Direct inject loaned squad!
      setBattleRoster({
        playerIds: phase.loanedPlayerSquad,
        enemyIds: phase.enemies,
        enemyWaves: phase.enemyWaves,
        isLoaned: true,
        rewardNode: {
          id: `journey_phase_${config.id}_${phaseIndex}`,
          name: `${config.name} Phase ${phaseIndex + 1}`,
          background: phase.background || 'environment-mandalore-city',
          rewards: rewardsList,
          energyCost: 0,
          powerRecommended: config.recommendedPower,
          objective: phase.objective,
          story: phase.story,
          rules: phase.rules
        }
      });
      setInBattle(true);
      return;
    }

    setSquadSelectPayload({
      nodeName: `${config.name} Phase ${phaseIndex + 1}`,
      enemies: phase.enemies,
      energyCost: 0,
      rewards: rewardsList,
      allowedCharacterIds: safeRequiredIds,
      isJourney: true,
      onConfirm: (squadIds: string[]) => {
        // Enforce that players MUST deploy ALL the required characters for Journey Guide!
        const missing = safeRequiredIds.filter(rid => !squadIds.includes(rid));
        if (missing.length > 0) {
          const names = missing.map(m => {
            const ch = getAllCharacters().find(x => x.id === m);
            return ch ? ch.name : m;
          });
          alert(`Encounter block: You must deploy the required heroes for this Journey phase: ${names.join(', ')}`);
          return;
        }

        setBattleRoster({
          playerIds: squadIds,
          enemyIds: phase.enemies,
          enemyWaves: phase.enemyWaves,
          rewardNode: {
            id: `journey_phase_${config.id}_${phaseIndex}`,
            name: `${config.name} Phase ${phaseIndex + 1}`,
            background: phase.background || 'environment-coruscant-city',
            rewards: rewardsList,
            energyCost: 0,
            powerRecommended: config.recommendedPower,
            objective: phase.objective,
            story: phase.story,
            rules: phase.rules
          }
        });
        setInBattle(true);
      }
    });
  }

  // Handle battle launching from Raid
  function launchRaidBattle(raid: RaidConfig, difficultyMultiplier: number = 1.0) {
    const rewardNode: CampaignNodeReward[] = [
      { itemId: 'credit', amountMin: Math.floor(35000 * difficultyMultiplier), amountMax: Math.floor(80000 * difficultyMultiplier), chance: 1.0 },
      { itemId: 'crystal', amountMin: Math.floor(150 * difficultyMultiplier), amountMax: Math.floor(450 * difficultyMultiplier), chance: 1.0 },
      { itemId: 'raid_token', amountMin: Math.floor(1500 * difficultyMultiplier), amountMax: Math.floor(3000 * Math.pow(difficultyMultiplier, 1.2)), chance: 1.0 },
      { itemId: 'beskar_alloy', amountMin: 10, amountMax: 30, chance: Math.min(1.0, 0.5 * difficultyMultiplier) },
      { itemId: 'legend_shard', amountMin: Math.floor(20 * difficultyMultiplier), amountMax: Math.floor(50 * difficultyMultiplier), chance: 1.0 }
    ];

    // Build waves from phases
    // We can also inject supporting units here alongside the bossId
    const baseWaves = raid.phases.map((p: any) => {
      // Use additionalEnemyIds if present, otherwise fallback
      let support: string[] = p.additionalEnemyIds || [];
      if (support.length === 0) {
        if (raid.id === 'battle_of_kamino') {
          support = ['b1_battle_droid', 'bx_commando_droid', 'droideka', 'b2_super_battle_droid'];
        } else if (raid.id === 'battle_of_hoth') {
          support = ['rebel_pathfinder', 'rebel_trooper', 'rebel_commando', 'rebel_officer'];
        } else if (raid.id === 'fortress_inquisitorius_raid') {
          support = ['fourth_sister', 'marrok', 'reva', 'crow'];
        } else if (raid.id === 'duel_of_the_fates') {
          support = ['b1_battle_droid', 'b2_super_battle_droid', 'droideka', 'magnaguard'];
        } else if (raid.id === 'rescue_of_rotta') {
          support = ['magnaguard', 'bx_commando_droid', 'ig86_assassin_droid', 'b1_battle_droid'];
        } else if (raid.id === 'geonosian_coliseum') {
          support = ['geonosian_soldier', 'geonosian_spy', 'sun_fac', 'geonosian_brood_alpha'];
        } else if (raid.id === 'death_star_siege_raid' || raid.id === 'spark_eternal_raid') {
          support = ['b1_battle_droid', 'b2_super_battle_droid', 'tactical_droid', 'magnaguard'];
        } else {
          support = ['b1_battle_droid', 'b2_super_droid', 'magnaguard', 'droideka']; // Default separatists
        }
      }
      return [p.bossId, ...support];
    });

    const waveBackgrounds = raid.phases.map((p: any) => p.background || 'coruscant');

    setSquadSelectPayload({
      nodeName: `${raid.name} - Full Raid Assault`,
      enemies: baseWaves[0],
      enemyWaves: baseWaves,
      energyCost: 0,
      rewards: rewardNode,
      restrictTags: raid.recommendedFactions,
      onConfirm: (squadIds: string[]) => {
        // Deduct attempt
        const updated = { ...save };
        const rem = updated.globalRaidAttempts ?? 3;
        const newAttempts = Math.max(0, rem - 1);
        updated.globalRaidAttempts = newAttempts;
        
        // Keep the old map in sync for backwards-compatibility
        if (!updated.raidAttemptsRemaining) updated.raidAttemptsRemaining = {};
        updated.raidAttemptsRemaining[raid.id] = newAttempts;
        
        setSave(updated);
        localStorage.setItem(`save_${updated.playerId}`, JSON.stringify(updated));
        localStorage.setItem('swgoh_clone_save_v4', JSON.stringify(updated));

        setBattleRoster({
          playerIds: squadIds,
          enemyIds: baseWaves[0],
          enemyWaves: baseWaves,
          waveBackgrounds: waveBackgrounds,
          difficultyMultiplier: difficultyMultiplier,
          rewardNode: {
            id: `${raid.id}_complete`,
            name: `${raid.name} Full Clear`,
            rewards: rewardNode,
            energyCost: 0
          }
        });
        setInBattle(true);
      }
    });
  }

  // Handle battle launching from Era Events
  function launchEventBattle(
    node: CampaignNode,
    isMarquee: boolean,
    marqueeCharId?: string,
    restrictEra?: string,
    restrictTags?: string[],
    allowedCharacterIds?: string[],
    isAssaultBattle?: boolean
  ) {
    setSquadSelectPayload({
      nodeName: node.nodeName,
      enemies: node.enemies,
      energyCost: 0,
      powerRecommended: node.powerRecommended,
      rewards: node.rewards,
      isMarquee,
      marqueeCharId,
      restrictEra,
      restrictTags,
      allowedCharacterIds,
      onConfirm: (squadIds: string[]) => {
        let enemyWaves;
        if (isAssaultBattle) {
           const e0 = node.enemies[0] || 'stormtrooper';
           const e1 = node.enemies[1 % node.enemies.length] || 'stormtrooper';
           const e2 = node.enemies[2 % node.enemies.length] || 'stormtrooper';
           const e3 = node.enemies[3 % node.enemies.length] || 'stormtrooper';

           enemyWaves = [
             [e0, e0, e0],                  // Round 1: Basic enemies
             [e0, e1, e1],                  // Round 2: Stronger enemies
             [e1, e2, e2],                  // Round 3: Mixed compositions
             [e2, e3, e3, e2],              // Round 4: Elite squads
             node.enemies                   // Round 5: Boss encounter (full team)
           ];
        }

        setBattleRoster({
          playerIds: squadIds,
          enemyIds: node.enemies,
          enemyWaves,
          isMarquee,
          rewardNode: {
            id: node.id,
            name: node.nodeName,
            rewards: node.rewards,
            energyCost: 0
          }
        });
        setInBattle(true);
      }
    });
  }

  function handleExitBattle(won: boolean, rewardsEarned: { itemId: string; amount: number }[], stars: number = 0, defeatedEnemyIds?: string[]) {
    try {
      setSquadSelectPayload(null);
      let updated = JSON.parse(JSON.stringify(save));

      // Handle Galactic Siege PvP match result submission
      if (battleRoster?.rewardNode?.id?.startsWith('siege_match_')) {
        const rewardNodeId = battleRoster.rewardNode.id;
        const parts = rewardNodeId.split('_squad_');
        const account = NetworkManager.getAccount();
        
        if (parts.length === 2 && account) {
          const opponentId = parts[0].replace('siege_match_', '');
          const squadIndex = parts[1];
          const survivors = won ? (stars === 3 ? 5 : (stars === 2 ? 4 : 3)) : 0;
          const fullHealth = won ? (stars === 3 ? 4 : (stars === 2 ? 2 : 1)) : 0;
          const fullProtection = won ? (stars === 3 ? 3 : (stars === 2 ? 1 : 0)) : 0;
          
          fetch('/api/siege/battle-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              accountId: account.accountId,
              squadIndex: parseInt(squadIndex, 10),
              win: won,
              playerSquad: battleRoster.playerIds,
              survivingCount: survivors,
              fullHealthCount: fullHealth,
              fullProtectionCount: fullProtection,
              battleSeed: 'seed_' + Math.random(),
              battleActions: [],
              turnOrder: [],
              defeatedEnemyIds: defeatedEnemyIds || []
            })
          }).then(r => r.json()).then(res => {
            if (res.success) {
              console.log('Advanced Galactic Siege score submitted:', res);
            }
          });
        } else {
          const opponentId = rewardNodeId.replace('siege_match_', '');
          NetworkManager.postMatchResult(opponentId, won, battleRoster.playerIds, battleRoster.enemyIds).then(res => {
            if (res.success) {
              console.log('Galactic Siege ranking updated:', res.newRank);
            }
          });
        }

        if (won) {
          updated.credits += 25000;
          updated.crystals += 15;
          rewardsEarned.push({ itemId: 'credit', amount: 25000 });
          rewardsEarned.push({ itemId: 'crystal', amount: 15 });
        }
      }
      
      if (battleRoster?.rewardNode && battleRoster.rewardNode.energyCost > 0) {
        updated.energy = Math.max(0, updated.energy - battleRoster.rewardNode.energyCost);
        updated = checkMissions(updated, 'energy_spent', battleRoster.rewardNode.energyCost);
      }

      if (won) {
        updated = checkMissions(updated, 'battle_won', 1);

        // check hidden achievements
        if (battleRoster?.playerIds?.includes('emperor_palpatine')) {
           updated = checkMissions(updated, 'palpatine_won', 1);
        }
        if (battleRoster?.playerIds?.includes('general_skywalker')) {
           updated = checkMissions(updated, 'anakin_used', 1);
        }

        if (battleRoster?.rewardNode?.id === 'tutorial_1') {
           updated.tutorialStep = 2;
        } else if (battleRoster?.rewardNode?.id === 'tutorial_2') {
           updated.tutorialStep = 4;
        } else if (updated.tutorialStep === 6) {
           updated.tutorialStep = 7;
        }

        if (!updated.completedCampaigns) updated.completedCampaigns = [];
        const isJourneyPhase = battleRoster?.rewardNode?.id?.startsWith('journey_phase_');
        let isAlreadyCompleted = battleRoster?.rewardNode ? updated.completedCampaigns.includes(battleRoster.rewardNode.id) : false;
        if (isJourneyPhase && battleRoster?.rewardNode?.id) {
          const journeyMatch = battleRoster.rewardNode.id.match(/^journey_phase_(.+)_(\d+)$/);
          if (journeyMatch) {
            const jId = journeyMatch[1];
            const pIdx = parseInt(journeyMatch[2], 10);
            if (updated.maxJourneyProgress?.[jId] !== undefined && updated.maxJourneyProgress[jId] >= pIdx) {
              isAlreadyCompleted = true;
            }
          }
        }

        // 1. Add completed node to campaign completions keys
        if (battleRoster?.rewardNode && !isAlreadyCompleted) {
          updated.completedCampaigns.push(battleRoster.rewardNode.id);
        }
        
        // 1a. Add to 3-star tracker if won with 3 stars
        if (stars === 3 && battleRoster?.rewardNode) {
          if (!updated.completed3StarNodes) updated.completed3StarNodes = [];
          if (!updated.completed3StarNodes.includes(battleRoster.rewardNode.id)) {
            updated.completed3StarNodes.push(battleRoster.rewardNode.id);
          }
        }
        
        // 1b. Add to daily completed events if it's an event node
        if (battleRoster?.rewardNode) {
          if (!updated.completedDailyEvents) updated.completedDailyEvents = [];
          if (!updated.completedDailyEvents.includes(battleRoster.rewardNode.id)) {
            updated.completedDailyEvents.push(battleRoster.rewardNode.id);
          }
          if (battleRoster.rewardNode.id.startsWith('ev_') || battleRoster.rewardNode.id.startsWith('marquee_') || battleRoster.rewardNode.id.startsWith('event_')) {
               updated = checkMissions(updated, 'event_completed', 1);
          }
        }

        // 1b. Check if this is a winning Raid phase battle
        if (battleRoster?.rewardNode?.id) {
          const match = battleRoster.rewardNode.id.match(/^(.+)_phase_(\d+)$/);
          if (match && !battleRoster.rewardNode.id.startsWith('journey_')) {
            const raidId = match[1];
            const phaseIndex = parseInt(match[2], 10);
            
            // Refund deployment keys so they didn't consume an attempt on victory!
            if (updated.raidAttemptsRemaining && updated.raidAttemptsRemaining[raidId] !== undefined) {
              updated.raidAttemptsRemaining[raidId] = Math.min(3, updated.raidAttemptsRemaining[raidId] + 1);
            }

            // Advance phase selection
            if (!updated.raidPhaseSelections) {
              updated.raidPhaseSelections = {};
            }
            const activeRaidRules = (updated.customRaids || RAIDS).find((r: any) => r.id === raidId);
            if (activeRaidRules && phaseIndex + 1 < activeRaidRules.phases.length) {
              updated.raidPhaseSelections[raidId] = phaseIndex + 1;
            }

            // Score bonus
            const scoreVal = 120000 + (phaseIndex * 60000);
            updated.raidScores[raidId] = (updated.raidScores[raidId] || 0) + scoreVal;
            if (!updated.battleLog) updated.battleLog = [];
            updated.battleLog.push(`⚔️ Raid Phase Victory! Completed Stage ${phaseIndex + 1} of ${activeRaidRules?.name || 'Raid'}. Refunding spent attempt, auto-transitioning to next stage, and awarded +${scoreVal.toLocaleString()} score.`);
          }
        }

        // Check if it's a journey phase win
        if (battleRoster?.rewardNode?.id) {
          const journeyMatch = battleRoster.rewardNode.id.match(/^journey_phase_(.+)_(\d+)$/);
          if (journeyMatch) {
             const jId = journeyMatch[1];
             const pIdx = parseInt(journeyMatch[2], 10);
             if (!updated.journeyProgress) updated.journeyProgress = {};
             updated.journeyProgress[jId] = Math.max(updated.journeyProgress[jId] || -1, pIdx);
             if (!updated.maxJourneyProgress) updated.maxJourneyProgress = {};
             updated.maxJourneyProgress[jId] = Math.max(updated.maxJourneyProgress[jId] || -1, pIdx);
             if (!updated.battleLog) updated.battleLog = [];
             updated.battleLog.push(`🌟 Journey Phase Completed: ${battleRoster.rewardNode.name}`);
          }
        }

        // 2. Grant rewards
        if (rewardsEarned) {
          if (isJourneyPhase && isAlreadyCompleted) {
            rewardsEarned = rewardsEarned.filter(rew => !rew.itemId.startsWith('shards_'));
          }
          rewardsEarned.forEach(rew => {
            if (!updated.inventory) updated.inventory = {};
            updated.inventory[rew.itemId] = (updated.inventory[rew.itemId] || 0) + rew.amount;
            if (rew.itemId === 'credit') {
              updated.credits += rew.amount;
            }
            if (rew.itemId === 'crystal') {
              updated.crystals += rew.amount;
            }
          });
        }

        if (!updated.battleLog) updated.battleLog = [];
        // Special custom payout strings
        updated.battleLog.push(`🏆 Victory recorded in: ${battleRoster?.rewardNode?.name || 'Combat Zone'}`);
        if (rewardsEarned && rewardsEarned.length > 0) {
          const lootStr = rewardsEarned.map(r => `+${r.amount} ${r.itemId.replace('shards_', 'Shards: ')}`).join(', ');
          updated.battleLog.push(`Loot Distributed: ${lootStr}`);
          
          if (!battleRoster?.rewardNode?.id?.includes('phase_')) {
             setPostBattleModal({
                success: true,
                stars: stars,
                rewards: rewardsEarned
             });
          }
        } else if (won && !battleRoster?.rewardNode?.id?.includes('phase_')) {
           setPostBattleModal({ success: true, stars: stars, rewards: [] });
        }
      } else {
        if (!updated.battleLog) updated.battleLog = [];
        updated.battleLog.push(`❌ Defeat recorded in: ${battleRoster?.rewardNode?.name || 'Combat Zone'}`);
        if (!battleRoster?.rewardNode?.id?.includes('phase_')) {
           setPostBattleModal({ success: false, stars: 0, rewards: [] });
        }
      }

      updateSaveState(updated);
    } catch (e: any) {
      alert("Error saving battle results: " + e.message);
      console.error(e);
    } finally {
      if (battleRoster?.rewardNode?.id?.includes('phase_')) {
         // No post-battle modal for phases
      }
      setInBattle(false);
      setCustomBattleRender(null);
      setBattleRoster(null);
    }
  }

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans flex flex-col selection:bg-yellow-500 selection:text-black antialiased relative overflow-x-hidden">
      {/* Background radial atmosphere */}
      <div className="galaxy-bg"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-radial-glow opacity-30 pointer-events-none z-0"></div>

      {!save.tutorialCompleted && (
        <TutorialCoordinator 
          saveState={save}
          onUpdateState={updateSaveState}
          onLaunchTutorial1={launchTutorial1}
          onLaunchTutorial2={launchTutorial2}
          activeCategory={activeCategory}
          activeTab={activeTab}
          setActiveCategory={setActiveCategory}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Top Main Navigation Bar - Ultra-compact and space-saving */}
      <header className="border-b border-zinc-800 bg-black/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row md:items-center justify-between gap-3 relative">
          <div className="flex items-center justify-between w-full md:w-auto">
            <h1 className="font-display font-black text-lg tracking-wider text-cyan-400 flex items-center gap-2 cursor-pointer shrink-0" onClick={() => { setActiveCategory('home'); setActiveTab('home'); }}>
              <Flame className="w-4 h-4 text-cyan-400" />
              <span>GALACTIC<span className="text-white ml-1">LEGENDS</span></span>
            </h1>
            
            {/* Extremely compact inline mobile resources view */}
            <div className="md:hidden flex items-center gap-2 text-[9px] font-mono font-black">
              <span className="text-amber-400">{save.credits.toLocaleString()} Cr</span>
              <span className="text-purple-300">{save.crystals.toLocaleString()} Cry</span>
              <span className="text-emerald-400">{save.energy}/1000 En</span>
            </div>
          </div>

          {/* Tab bar layout, scrollable on mobile without wrapping */}
          {!inBattle && (
            <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full md:w-auto py-0.5">
              {[
                { cat: 'home', tab: 'home', label: 'Command' },
                { cat: 'units', tab: 'roster', label: 'Archive' },
                { cat: 'events', tab: 'events_special', label: 'Events' },
                { cat: 'journeys', tab: 'journey', label: 'Journeys' },
                { cat: 'conquest', tab: 'conquest', label: 'Conquest' },
                { cat: 'siege', tab: 'siege_hub', label: 'Siege' },
                { cat: 'home', tab: 'missions', label: 'Quests' },
                { cat: 'holonet', tab: 'account', label: 'Holonet', action: () => { setOnlinePanelTab('account'); setIsOnlinePanelOpen(true); } },
              ].map(item => {
                const isActive = item.action 
                  ? (isOnlinePanelOpen && onlinePanelTab !== 'settings') 
                  : (activeCategory === item.cat && (item.tab === 'home' ? activeTab !== 'missions' : activeTab === item.tab));
                
                const btnClass = isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : 'border-transparent text-zinc-500 hover:text-cyan-400 hover:bg-cyan-950/10';

                return (
                  <button 
                    key={item.label}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        setActiveCategory(item.cat);
                        setActiveTab(item.tab);
                      }
                    }}
                    className={`px-2 py-1 text-[10px] font-mono font-black uppercase tracking-wider rounded-lg border transition whitespace-nowrap ${btnClass}`}
                  >
                    {item.label}
                  </button>
                );
              })}
              <button 
                onClick={() => { setActiveCategory('shop'); setActiveTab('shop'); }}
                className={`px-2 py-1 text-[10px] font-mono font-black uppercase tracking-wider rounded-lg border transition whitespace-nowrap ${activeCategory === 'shop' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'border-transparent text-amber-500/50 hover:text-amber-400 hover:bg-amber-950/10'}`}
              >
                Shop
              </button>
              <button 
                onClick={() => { setActiveCategory('dev_bg_viewer'); setActiveTab('dev_bg_viewer'); }}
                className={`px-2 py-1 text-[10px] font-mono font-black uppercase tracking-wider rounded-lg border transition whitespace-nowrap ${activeCategory === 'dev_bg_viewer' ? 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400' : 'border-transparent text-fuchsia-500/50 hover:text-fuchsia-400 hover:bg-fuchsia-950/10'}`}
              >
                🎨 BG Viewer (Temp)
              </button>
            </nav>
          )}

          {/* Compact desktop resources view */}
          <div className="hidden md:flex items-center gap-3.5 text-[10px] font-mono select-none font-bold shrink-0">
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-400">{save.credits.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-purple-300">{save.crystals.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">{save.energy} / 1000</span>
            </div>

            <button 
              onClick={() => { setOnlinePanelTab('settings'); setIsOnlinePanelOpen(true); }}
              className="p-1 rounded-lg border border-zinc-800 hover:border-cyan-500/30 text-zinc-500 hover:text-cyan-400 transition"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Primary Sub-Navigation Bar */}
      {!inBattle && activeCategory !== 'shop' && activeCategory !== 'home' && (
        <div className="bg-black/60 border-b border-cyan-900/30 sticky z-40 backdrop-blur-md" id="sub_nav_bar">
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-4 overflow-x-auto scrollbar-none pt-1">
            {activeCategory === 'events' && (
              <>
                <button onClick={() => setActiveTab('events_special')} className={`text-[10px] uppercase font-mono tracking-widest pb-3 border-b-2 transition ${activeTab === 'events_special' ? 'border-cyan-400 text-cyan-400 font-black glow-neon' : 'border-transparent text-zinc-500 hover:text-cyan-300 font-bold'}`}>Galactic Events</button>
                <button onClick={() => setActiveTab('raid')} className={`text-[10px] uppercase font-mono tracking-widest pb-3 border-b-2 transition ${activeTab === 'raid' ? 'border-cyan-400 text-cyan-400 font-black glow-neon' : 'border-transparent text-zinc-500 hover:text-cyan-300 font-bold'}`}>Raid Operations</button>
              </>
            )}
            {activeCategory === 'era' && (
              <>
                <button onClick={() => setActiveTab('era_overview')} className={`text-[10px] uppercase font-mono tracking-widest pb-3 border-b-2 transition ${activeTab === 'era_overview' ? 'border-amber-400 text-amber-400 font-black shadow-glow' : 'border-transparent text-zinc-500 hover:text-amber-300 font-bold'}`}>Overview</button>
                <button onClick={() => setActiveTab('era_battles')} className={`text-[10px] uppercase font-mono tracking-widest pb-3 border-b-2 transition ${activeTab === 'era_battles' ? 'border-amber-400 text-amber-400 font-black shadow-glow' : 'border-transparent text-zinc-500 hover:text-amber-300 font-bold'}`}>Battles</button>
                <button onClick={() => setActiveTab('era_marquees')} className={`text-[10px] uppercase font-mono tracking-widest pb-3 border-b-2 transition ${activeTab === 'era_marquees' ? 'border-amber-400 text-amber-400 font-black shadow-glow' : 'border-transparent text-zinc-500 hover:text-amber-300 font-bold'}`}>Marquees</button>
                <button onClick={() => setActiveTab('era_journeys')} className={`text-[10px] uppercase font-mono tracking-widest pb-3 border-b-2 transition ${activeTab === 'era_journeys' ? 'border-amber-400 text-amber-400 font-black shadow-glow' : 'border-transparent text-zinc-500 hover:text-amber-300 font-bold'}`}>Journeys</button>
                <button onClick={() => setActiveTab('era_gls')} className={`text-[10px] uppercase font-mono tracking-widest pb-3 border-b-2 transition ${activeTab === 'era_gls' ? 'border-amber-400 text-amber-400 font-black shadow-glow' : 'border-transparent text-zinc-500 hover:text-amber-300 font-bold'}`}>Legends</button>
                <button onClick={() => setActiveTab('era_collection')} className={`text-[10px] uppercase font-mono tracking-widest pb-3 border-b-2 transition ${activeTab === 'era_collection' ? 'border-amber-400 text-amber-400 font-black shadow-glow' : 'border-transparent text-zinc-500 hover:text-amber-300 font-bold'}`}>Collection</button>
              </>
            )}
            {activeCategory === 'journeys' && (
              <>
                <button onClick={() => setActiveTab('campaign')} className={`text-[10px] uppercase font-mono tracking-widest pb-3 border-b-2 transition ${activeTab === 'campaign' ? 'border-cyan-400 text-cyan-400 font-black glow-neon' : 'border-transparent text-zinc-500 hover:text-cyan-300 font-bold'}`}>Sector Campaigns</button>
                <button onClick={() => setActiveTab('journey')} className={`text-[10px] uppercase font-mono tracking-widest pb-3 border-b-2 transition ${activeTab === 'journey' ? 'border-cyan-400 text-cyan-400 font-black glow-neon' : 'border-transparent text-zinc-500 hover:text-cyan-300 font-bold'}`}>Legendary Journeys</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 relative z-10">
        {inBattle && customBattleRender ? (
           <div className="relative">
             <button onClick={() => { setInBattle(false); setCustomBattleRender(null); }} className="absolute top-4 right-4 z-50 bg-black/80 px-4 py-2 font-bold uppercase text-white rounded hover:bg-zinc-800">
               Exit
             </button>
             {customBattleRender()}
           </div>
        ) : inBattle && battleRoster ? (
          <CombatBattleView 
            playerTeamIds={battleRoster.playerIds}
            enemyIds={battleRoster.enemyIds}
            enemyWaves={battleRoster.enemyWaves}
            waveBackgrounds={battleRoster.waveBackgrounds}
            rewardNode={battleRoster.rewardNode}
            onExitCombat={handleExitBattle}
            saveState={save}
            isMarquee={battleRoster.isMarquee}
            isLoaned={battleRoster.isLoaned}
            difficultyMultiplier={battleRoster.difficultyMultiplier}
          />
        ) : squadSelectPayload ? (
          <SquadSelectView 
            saveState={save}
            nodeName={squadSelectPayload.nodeName}
            enemies={squadSelectPayload.enemies}
            energyCost={squadSelectPayload.energyCost}
            powerRecommended={squadSelectPayload.powerRecommended}
            rewards={squadSelectPayload.rewards}
            restrictTags={squadSelectPayload.restrictTags}
            allowedCharacterIds={squadSelectPayload.allowedCharacterIds}
            isMarquee={squadSelectPayload.isMarquee}
            marqueeCharId={squadSelectPayload.marqueeCharId}
            isJourney={squadSelectPayload.isJourney}
            onLaunch={squadSelectPayload.onConfirm}
            onCancel={() => setSquadSelectPayload(null)}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <DashboardView 
                saveState={save}
                onNavigate={(view) => {
                  if (view === 'campaign') { setActiveCategory('journeys'); setActiveTab('campaign'); }
                  if (view === 'conquest') { setActiveCategory('conquest'); setActiveTab('conquest'); }
                  if (view === 'journey') { setActiveCategory('journeys'); setActiveTab('journey'); }
                  if (view === 'events') { setActiveCategory('events'); setActiveTab('events_special'); }
                  if (view === 'raid') { setActiveCategory('events'); setActiveTab('raid'); }
                  if (view === 'siege') { setActiveCategory('siege'); setActiveTab('siege_hub'); }
                  if (view === 'roster') { setActiveCategory('units'); setActiveTab('roster'); }
                  if (view === 'teams') { setActiveCategory('units'); setActiveTab('teams'); }
                  if (view === 'gearIndex') { setActiveCategory('units'); setActiveTab('gearIndex'); }
                  if (view === 'shop') { setActiveCategory('shop'); setActiveTab('shop'); }
                  if (view === 'settings') { setOnlinePanelTab('settings'); setIsOnlinePanelOpen(true); }
                  if (view === 'holonet') { setOnlinePanelTab('account'); setIsOnlinePanelOpen(true); }
                  if (view === 'missions') { setActiveCategory('home'); setActiveTab('missions'); }
                  if (view === 'announcements') { setActiveCategory('home'); setActiveTab('announcements'); }
                }}
                onUpdateState={updateSaveState}
              />
            )}

            {activeTab === 'missions' && (
              <MissionsView 
                saveState={save}
                onUpdateState={updateSaveState}
              />
            )}

            {activeTab === 'announcements' && (
              <AnnouncementsTab />
            )}

            {activeTab === 'roster' && (
              <RosterView 
                saveState={save}
                onUpdateState={updateSaveState}
                onNavigateToFarm={(tab, targetId) => {
                  setActiveTab(tab);
                  if (tab === 'campaign' && targetId) {
                    setActiveCategory('journeys');
                    setTargetFarmNodeId(targetId);
                  }
                }}
              />
            )}

            {activeTab === 'teams' && (
              <TeamsView 
                saveState={save}
                onUpdateState={updateSaveState}
              />
            )}

            {activeTab === 'shop' && (
              <ShopView 
                saveState={save}
                onUpdateState={updateSaveState}
              />
            )}

            {activeTab === 'campaign' && (
              <CampaignView 
                saveState={save}
                onUpdateState={updateSaveState}
                onLaunchBattle={launchCampaignBattle}
                targetNodeId={targetFarmNodeId}
              />
            )}

            {activeTab === 'journey' && (
              <JourneyView 
                saveState={save}
                onUpdateState={updateSaveState}
                onLaunchJourneyBattle={launchJourneyBattle}
                journeyContext={journeyContext}
                setJourneyContext={setJourneyContext}
              />
            )}

            {activeTab === 'raid' && (
              <RaidView 
                saveState={save}
                onLaunchRaidBattle={launchRaidBattle}
                onUpdateState={updateSaveState}
              />
            )}

            {activeTab === 'events_era' && (
              <EventsView 
                saveState={save}
                onLaunchEventBattle={launchEventBattle}
                onUpdateState={updateSaveState}
                defaultTab="era"
              />
            )}

            {activeTab === 'events_special' && (
              <EventsView 
                saveState={save}
                onLaunchEventBattle={launchEventBattle}
                onUpdateState={updateSaveState}
                defaultTab="special"
              />
            )}

            {activeCategory === 'era' && (
              <EraView 
                 saveState={save}
                 onUpdateState={updateSaveState}
                 activeTab={activeTab}
                 onLaunchBattle={(battleFn) => {
                   setBattleRoster(null); 
                   setCustomBattleRender(() => battleFn);
                   setInBattle(true);
                }}
                onExitBattle={() => {
                   setInBattle(false);
                   setCustomBattleRender(null);
                }}
              />
            )}

            {activeTab === 'gearIndex' && (
              <GearIndexView />
            )}

            {activeTab === 'dev_bg_viewer' && (
              <BackgroundViewer />
            )}

            {activeTab === 'conquest' && (
              <ConquestView
                saveState={save}
                onUpdateState={updateSaveState}
                onLaunchBattle={(battleFn) => {
                   setBattleRoster(null); 
                   setCustomBattleRender(() => battleFn);
                   setInBattle(true);
                }}
                onExitBattle={() => {
                   setInBattle(false);
                   setCustomBattleRender(null);
                }}
              />
            )}

            {activeCategory === 'siege' && (
              <GalacticSiege 
                saveState={save}
                onLaunchBattle={(playerSquadIds, opponentShowcaseSquad, opponent) => {
                  setSquadSelectPayload({
                    nodeName: `Galactic Siege: ${opponent.username}`,
                    enemies: opponentShowcaseSquad,
                    energyCost: 0,
                    rewards: [],
                    onConfirm: (playerIds: string[]) => {
                      setSquadSelectPayload(null);
                      setBattleRoster({
                        playerIds,
                        enemyIds: opponentShowcaseSquad,
                        rewardNode: {
                          id: 'siege_match_' + opponent.accountId,
                          name: `Galactic Siege: ${opponent.username}`,
                          rewards: [],
                          energyCost: 0
                        }
                      });
                      setInBattle(true);
                    }
                  });
                }}
                onOpenOnlinePanel={() => setIsOnlinePanelOpen(true)}
              />
            )}

          </>
        )}
      </main>

      {postBattleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
          <div className="holo-panel w-full max-w-sm rounded-3xl shadow-[0_0_80px_rgba(16,185,129,0.3)] border-emerald-500/50 relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-400"></div>
            <div className={`p-6 text-center font-display font-black text-2xl tracking-widest uppercase border-b ${postBattleModal.success ? 'bg-emerald-950/40 text-white border-emerald-500/30 glow-neon' : 'bg-red-950/40 text-red-500 border-red-500/30'}`}>
              {postBattleModal.success ? `VICTORY (${postBattleModal.stars}★)` : 'DEFEAT'}
            </div>
            
            <div className="p-6 space-y-5">
              {postBattleModal.success ? (
                <>
                  <h3 className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2">
                    <Check className="w-3.5 h-3.5" /> Payload Extracted
                  </h3>
                  {postBattleModal.rewards.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                      {postBattleModal.rewards.map((r, idx) => {
                        return (
                          <div key={idx} className="bg-black/60 border border-emerald-900/40 p-3 rounded-2xl flex flex-col gap-1 items-center justify-center hover:border-emerald-500/50 transition">
                            <span className="text-[9px] text-zinc-400 font-mono text-center uppercase tracking-wide leading-tight px-1">
                               {r.itemId.replace('shards_', 'Shards: ').replace(/_/g, ' ')}
                            </span>
                            <span className="text-lg font-bold text-amber-400 glow-neon">+{r.amount}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-zinc-500 text-sm font-mono py-6">Sensors empty. No assets recovered.</div>
                  )}
                </>
              ) : (
                <div className="text-center text-zinc-500 text-sm font-mono py-6">Mission failed. Retreat and resupply.</div>
              )}
            </div>

            <div className="p-4 bg-black/60 border-t border-emerald-500/20 flex justify-center">
               <button 
                 onClick={() => {
                   setPostBattleModal(null);
                   setInBattle(false);
                   setBattleRoster(null);
                 }}
                 className="bg-zinc-900 border border-emerald-500/40 hover:bg-emerald-500 hover:text-black text-emerald-400 text-xs px-8 font-black tracking-widest uppercase py-3 rounded-xl font-mono transition-all duration-300 shadow-glow"
               >
                 Acknowledge
               </button>
            </div>
          </div>
        </div>
      )}

      {isOnlinePanelOpen && (
        <OnlinePanel 
          saveState={save}
          onUpdateSaveState={updateSaveState}
          onClose={() => setIsOnlinePanelOpen(false)}
          initialTab={onlinePanelTab as any}
        />
      )}

      {isSettingsOpen && save && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fadeIn">
          <div className="holo-panel w-full max-w-lg rounded-3xl shadow-[0_0_80px_rgba(6,182,212,0.3)] border-cyan-500/50 relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500"></div>
             <div className="p-6 text-center font-display font-black text-2xl tracking-widest uppercase border-b bg-cyan-950/40 text-white border-cyan-500/30 glow-neon flex justify-between items-center">
               <span>COMM CENTER SETTINGS</span>
               <button onClick={() => setIsSettingsOpen(false)} className="text-zinc-500 hover:text-white text-lg">&times;</button>
             </div>
             <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Profile Rename Section */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">Change Commander Name</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={save.playerName} 
                      onChange={(e) => {
                        const copy = { ...save };
                        copy.playerName = e.target.value;
                        updateSaveState(copy);
                      }}
                      className="bg-black/60 border border-zinc-700 rounded-xl px-4 py-3 w-full text-white font-mono focus:outline-none focus:border-cyan-500 transition text-sm"
                      placeholder="Commander Name"
                    />
                  </div>
                </div>

                {/* Statistics panel */}
                <div className="bg-black/40 border border-zinc-800 rounded-2xl p-4 space-y-3">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold border-b border-zinc-800 pb-1.5">Roster Strategic Metrics</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-zinc-500">Galactic Power</span>
                      <span className="text-cyan-400 font-bold text-sm">{totalPower.toLocaleString()} GP</span>
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-zinc-500">Unlocked Characters</span>
                      <span className="text-zinc-200 font-bold text-sm">
                        {activeChampions.length} / {Object.keys(save.characters).length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-zinc-500">Liquid Credits</span>
                      <span className="text-amber-500 font-bold text-sm">{save.credits.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-zinc-500">Reserve Crystals</span>
                      <span className="text-purple-400 font-bold text-sm">{save.crystals.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Boost / Reinforcements button for testing ease! */}
                <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3 text-left">
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-black">Commander Test Reinforcements</h4>
                    <p className="text-[10px] text-zinc-400 font-mono mt-1 leading-relaxed">Instantly request credit reserves, crystals, and full energy to easily explore and test the entire cantina and campaigns.</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button 
                      onClick={() => {
                        const copy = { ...save };
                        copy.credits += 500000;
                        copy.crystals += 2500;
                        copy.energy = 1000;
                        updateSaveState(copy);
                        alert("Reinforcements received! Added +500,000 Credits, +2,500 Crystals, and refilled Tactical Energy.");
                      }}
                      className="bg-amber-500/20 border border-amber-500/40 text-amber-400 px-4 py-2 rounded-xl text-[10px] uppercase font-mono font-bold hover:bg-amber-500/30 transition shadow-glow"
                    >
                      Receive +500k / +2.5k
                    </button>
                    <button 
                      onClick={() => {
                        const copy = { ...save };
                        Object.keys(copy.characters).forEach(id => {
                          const c = copy.characters[id];
                          if (!c.unlocked) {
                            c.unlocked = true;
                            c.stars = 5;
                            c.level = 50;
                            c.gearTier = 5;
                          }
                        });
                        updateSaveState(copy);
                        alert("Roster reinforce sequence complete! All locked characters have been unlocked at 5★ level 50 for testing!");
                      }}
                      className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 px-4 py-2 rounded-xl text-[10px] uppercase font-mono font-bold hover:bg-cyan-500/30 transition shadow-glow"
                    >
                      Unlock All 5★
                    </button>
                  </div>
                </div>

                {/* Reset Section */}
                <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-4 space-y-3 text-left">
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">Factory System Override</h4>
                    <p className="text-[10px] text-zinc-400 font-mono mt-1 leading-relaxed">This will override current data and clear all custom progress, resetting to default levels.</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm("Are you absolutely sure you want to reset your account? This will wipe all progression, shards, level upgrades, and custom squads!")) {
                        localStorage.removeItem(`save_${save.playerId}`);
                        localStorage.removeItem('galactic_legends_profiles_v2');
                        window.location.reload();
                      }
                    }}
                    className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-2 rounded-xl text-[10px] uppercase font-mono font-bold hover:bg-red-500/30 transition"
                  >
                    Wipe Save & Reset Profile
                  </button>
                </div>
             </div>
             <div className="p-4 bg-black/60 border-t border-cyan-500/20 flex justify-center">
               <button 
                 onClick={() => setIsSettingsOpen(false)}
                 className="bg-zinc-900 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black text-cyan-400 text-xs px-8 font-black tracking-widest uppercase py-3 rounded-xl font-mono transition-all duration-300 shadow-glow"
               >
                 Close Settings
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Soft aesthetic footer */}
      <footer className="border-t border-zinc-850 bg-black/60 py-5 mt-10 text-center font-mono text-[10px] text-zinc-500 space-y-1 select-none">
        <div>
          Galactic Legends TM @2026-Dylan de Santiago
        </div>
      </footer>
    </div>
  );
}
