import React, { useState } from 'react';
import { SaveState } from '../types';
import { Skull, Map, ShieldAlert, Award, Coffee } from 'lucide-react';
import { SquadSelectView } from './SquadSelectView';
import { CombatBattleView } from './CombatBattleView';
import { getCharacterById, getAllCharacters } from '../data/characters';
import { InfoDialog } from './InfoDialog';

interface Props {
  saveState: SaveState;
  onUpdateState: (st: SaveState) => void;
  onLaunchBattle: (combatFn: () => any) => void;
  onExitBattle?: () => void;
  onSelectCharacter?: (id: string) => void;
}

// Hardcoded lightweight nodes
const ZONES = [
  {
    name: 'Sector 1: Outer Rim Scraps',
    nodeSteps: [
      [
        { id: 'c_1_1a', type: 'combat', name: 'Scrap Deal', enemies: ['b1_battle_droid', 'b1_battle_droid'], powerRec: 4000, rewardCurrency: 80, modifier: 'Volatile Defenses (-50% Def, +25% Off)' },
        { id: 'c_1_1b', type: 'combat', name: 'Desert Bandits', enemies: ['stormtrooper', 'scout_trooper'], powerRec: 4500, rewardCurrency: 90, modifier: 'Entrenched (+50% Def)' }
      ],
      [
        { id: 'c_1_2a', type: 'combat', name: 'Underworld Scum', enemies: ['greedo', 'gamorrean_guard_cartel'], powerRec: 5500, rewardCurrency: 100, modifier: 'Thermal Detonator Hazards' },
        { id: 'c_1_2b', type: 'combat', name: 'Droid Patrol', enemies: ['magnaguard', 'b2_super_droid'], powerRec: 5000, rewardCurrency: 90, modifier: 'Data Disk: Turn Meter Up' }
      ],
      [
        { id: 'c_1_3a', type: 'combat', name: 'Rebel Partisans', enemies: ['rebel_soldier', 'rebel_soldier', 'stormtrooper_luke'], powerRec: 6500, rewardCurrency: 110, modifier: 'Rebel Resolve' },
        { id: 'c_1_3b', type: 'combat', name: 'Imperial Remnant', enemies: ['stormtrooper', 'range_trooper', 'death_trooper'], powerRec: 7000, rewardCurrency: 130, modifier: 'Ruthless Swiftness' }
      ],
      [
        { id: 'c_1_4a', type: 'combat', name: 'Beast Lair', enemies: ['krrsantan'], powerRec: 8000, rewardCurrency: 140, modifier: 'Massive Health Boost (+100% HP)' },
        { id: 'c_1_4b', type: 'combat', name: 'Assassins', enemies: ['fennec_shand', 'boba_fett'], powerRec: 8500, rewardCurrency: 150, modifier: 'Bounty Postulates (+50% Crit)' }
      ],
      [
        { id: 'c_1_5', type: 'boss', name: 'Sector 1 Boss: Moff Gideon', enemies: ['gideon', 'dark_trooper', 'stormtrooper'], powerRec: 10000, rewardCurrency: 350, modifier: 'Data Disk: Weak Point (Debuffs Stack Damage)' }
      ]
    ]
  },
  {
    name: 'Sector 2: Mid Rim Conflicts',
    nodeSteps: [
      [
        { id: 'c_2_1a', type: 'combat', name: 'Separatist Factories', enemies: ['b1_battle_droid', 'b2_super_droid', 'droideka'], powerRec: 12000, rewardCurrency: 120, modifier: 'Auto-Revive Core (Revive once)' },
        { id: 'c_2_1b', type: 'combat', name: 'Republic Outpost', enemies: ['clone_trooper', 'clone_trooper', 'fives'], powerRec: 11500, rewardCurrency: 115, modifier: 'Data Disk: Fortified (+100% Prot)' },
      ],
      [
        { id: 'c_2_2a', type: 'combat', name: 'Jedi Vanguard', enemies: ['luminara_unduli', 'barriss_offee'], powerRec: 13000, rewardCurrency: 140, modifier: 'Restoration Wave (Heal 10% per turn)' },
        { id: 'c_2_2b', type: 'combat', name: 'Hutt Enforcers', enemies: ['gamorrean_guard_cartel', 'boushh_leia', 'greedo'], powerRec: 13500, rewardCurrency: 150, modifier: 'Ruthless Offense' }
      ],
      [
        { id: 'c_2_3a', type: 'combat', name: 'Inquisitor Hunter', enemies: ['fourth_sister', 'marrok'], powerRec: 15000, rewardCurrency: 160, modifier: 'Data Disk: Purge Engine (DoT amplifier)' },
        { id: 'c_2_3b', type: 'combat', name: 'Nightsister Coven', enemies: ['nightsister_zombie', 'asajj_ventress'], powerRec: 15500, rewardCurrency: 170, modifier: 'Plague Vectors (Debuffs)' }
      ],
      [
        { id: 'c_2_4a', type: 'combat', name: 'Elite Guard', enemies: ['magnaguard', 'magna_guard_elite', 'bx_commando_droid'], powerRec: 16500, rewardCurrency: 180, modifier: 'Data Disk: Retaliation' },
        { id: 'c_2_4b', type: 'combat', name: 'Clone Commandos', enemies: ['captain_rex', 'commander_appo'], powerRec: 17000, rewardCurrency: 200, modifier: 'Coordinated Fire' }
      ],
      [
        { id: 'c_2_5', type: 'boss', name: 'Sector 2 Boss: Admiral Trench', enemies: ['admiral_trench', 'spider_droid', 'magnaguard'], powerRec: 19000, rewardCurrency: 450, modifier: 'Tactical Supremacy (+100% Speed)' }
      ]
    ]
  },
  {
    name: 'Sector 3: The Core Worlds',
    nodeSteps: [
      [
        { id: 'c_3_1a', type: 'combat', name: 'Coruscant Underworld', enemies: ['maul_survival', 'hondo_ohnaka'], powerRec: 21000, rewardCurrency: 160, modifier: 'Volatile Accelerator (High DoTs)' },
        { id: 'c_3_1b', type: 'combat', name: 'Smuggler Run', enemies: ['han_solo', 'chewbacca', 'lando_calrissian'], powerRec: 21500, rewardCurrency: 170, modifier: 'Data Disk: Evasive Maneuvers' }
      ],
      [
        { id: 'c_3_2a', type: 'combat', name: 'Jedi High Council', enemies: ['master_kenobi', 'plo_koon'], powerRec: 23000, rewardCurrency: 180, modifier: 'Data Disk: Leader Resolve' },
        { id: 'c_3_2b', type: 'combat', name: 'Sith Apprentices', enemies: ['darth_maul', 'savage_opress'], powerRec: 24000, rewardCurrency: 200, modifier: 'Dark Rage (+50% Crit Damage)' }
      ],
      [
        { id: 'c_3_3a', type: 'combat', name: 'Geonosian Hive', enemies: ['spider_droid', 'b1_battle_droid', 'droideka', 'magnaguard'], powerRec: 26000, rewardCurrency: 220, modifier: 'Swarm Tactics (Assist Damage Up)' },
        { id: 'c_3_3b', type: 'combat', name: 'Imperial High Command', enemies: ['director_krennic', 'death_trooper', 'stormtrooper'], powerRec: 27000, rewardCurrency: 230, modifier: 'Data Disk: Zealous Ambition' }
      ],
      [
        { id: 'c_3_4a', type: 'combat', name: 'Mandalorian Enclave', enemies: ['the_mandalorian', 'bo_katan_light', 'armorer'], powerRec: 29000, rewardCurrency: 240, modifier: 'Beskar Master (Damage Reduction)' },
        { id: 'c_3_4b', type: 'combat', name: 'Inquisitor Masterclass', enemies: ['grand_inquisitor', 'fourth_sister', 'crow'], powerRec: 30000, rewardCurrency: 260, modifier: 'Data Disk: Deadly Catalyst' }
      ],
      [
        { id: 'c_3_5', type: 'boss', name: 'Sector 3 Boss: Darth Vader', enemies: ['darth_vader', 'emperor_palpatine', 'royal_guard'], powerRec: 33000, rewardCurrency: 550, modifier: 'Crushing Fear (Ability Block on Hit)' }
      ]
    ]
  },
  {
    name: 'Sector 4: Unknown Regions',
    nodeSteps: [
      [
        { id: 'c_4_1a', type: 'combat', name: 'First Order Vanguard', enemies: ['kylo_ren_unmasked', 'sith_trooper'], powerRec: 35000, rewardCurrency: 210, modifier: 'Data Disk: Defensive Formation' },
        { id: 'c_4_1b', type: 'combat', name: 'Resistance Base', enemies: ['rey_jedi_training', 'finn'], powerRec: 36000, rewardCurrency: 220, modifier: 'Data Disk: Opportunistic Strike' }
      ],
      [
        { id: 'c_4_2a', type: 'combat', name: 'Sith Empire Remnant', enemies: ['darth_revan', 'sith_assassin'], powerRec: 38000, rewardCurrency: 240, modifier: 'Ferocity Stacks (+Speed, -Def)' },
        { id: 'c_4_2b', type: 'combat', name: 'Old Republic Heroes', enemies: ['jedi_knight_revan', 'jolee_bindo'], powerRec: 39000, rewardCurrency: 250, modifier: 'Savior (Heal to Full once)' }
      ],
      [
        { id: 'c_4_3a', type: 'combat', name: 'Cartel Bosses', enemies: ['jabba', 'krrsantan', 'boba_fett'], powerRec: 41000, rewardCurrency: 270, modifier: 'Thermal Exhaust (Explosives)' },
        { id: 'c_4_3b', type: 'combat', name: 'Mercenary Syndicate', enemies: ['hondo_ohnaka', 'fennec_shand', 'bossk'], powerRec: 42000, rewardCurrency: 280, modifier: 'Data Disk: Entangled' }
      ],
      [
        { id: 'c_4_4a', type: 'combat', name: 'Fallen Jedi', enemies: ['taron_malicos', 'asajj_ventress'], powerRec: 44000, rewardCurrency: 300, modifier: 'Data Disk: Ruthless Swiftness' },
        { id: 'c_4_4b', type: 'combat', name: 'Rebels of the Force', enemies: ['commander_luke', 'ahsoka_fulcrum'], powerRec: 45000, rewardCurrency: 310, modifier: 'Data Disk: Amplified Agony' }
      ],
      [
        { id: 'c_4_5', type: 'boss', name: 'Sector 4 Boss: Ben Solo', enemies: ['ben_solo', 'rey_gl'], powerRec: 48000, rewardCurrency: 700, modifier: 'Dyad in the Force (Shared Damage)' }
      ]
    ]
  },
  {
    name: 'Sector 5: Exegol Dark Core',
    nodeSteps: [
      [
        { id: 'c_5_1a', type: 'combat', name: 'Sith Eternal Cult', enemies: ['emperor_palpatine', 'sith_trooper'], powerRec: 51000, rewardCurrency: 350, modifier: 'Data Disk: Insatiable' },
        { id: 'c_5_1b', type: 'combat', name: 'Final Order Fleet', enemies: ['general_hux', 'first_order_executioner'], powerRec: 50000, rewardCurrency: 330, modifier: 'Data Disk: Decaying Morale' }
      ],
      [
        { id: 'c_5_2a', type: 'combat', name: 'Knights of Ren', enemies: ['kylo_ren', 'knight_of_ren'], powerRec: 53000, rewardCurrency: 370, modifier: 'Bloodlust (+10% Offense on Hit)' },
        { id: 'c_5_2b', type: 'combat', name: 'Shadow Council', enemies: ['gideon_remnant', 'death_trooper'], powerRec: 52000, rewardCurrency: 360, modifier: 'Data Disk: Volatile Accelerator' }
      ],
      [
        { id: 'c_5_3a', type: 'combat', name: 'Legends of the Light', enemies: ['gl_leia', 'luke_skywalker_gl', 'rey_gl'], powerRec: 56000, rewardCurrency: 400, modifier: 'Unbreakable Resolve' },
        { id: 'c_5_3b', type: 'combat', name: 'Rule of Two', enemies: ['darth_vader', 'gl_darth_sidious'], powerRec: 58000, rewardCurrency: 420, modifier: 'Dark Illusions (Evade 30%)' }
      ],
      [
        { id: 'c_5_4', type: 'boss', name: 'Grand Conquest Finale: Exegol', enemies: ['chancellor_palpatine_journey', 'darth_vader', 'emperor_palpatine'], powerRec: 65000, rewardCurrency: 1200, modifier: 'Ultimate Darkness (Max Power)' }
      ]
    ]
  }
];

export function ConquestView({ saveState, onUpdateState, onLaunchBattle, onExitBattle }: Props) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [preBattleSquadSelect, setPreBattleSquadSelect] = useState<{ node: any } | null>(null);
  const [selectingDataDisk, setSelectingDataDisk] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(!saveState.stats?.['seen_conquest_intro']);

  const GAME_START_TIME = new Date('2026-06-03T00:00:00Z').getTime(); // Fixed start date roughly relative to right now in prompt
  const CYCLE_DURATION_MS = 28 * 24 * 60 * 60 * 1000;
  const nowMs = new Date().getTime();
  const rawDiff = nowMs - GAME_START_TIME;
  const currentCycleCalculated = Math.max(0, Math.floor(rawDiff / CYCLE_DURATION_MS)) % 3;
  const nextCycleTime = GAME_START_TIME + ((Math.max(0, Math.floor(rawDiff / CYCLE_DURATION_MS)) + 1) * CYCLE_DURATION_MS);
  const timeRemainingMs = nextCycleTime - nowMs;
  const daysRem = Math.floor(timeRemainingMs / (24 * 60 * 60 * 1000));
  const hoursRem = Math.floor((timeRemainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  let conqState = {
    currentZoneIndex: saveState.conquestState?.currentZoneIndex || 0,
    currentNodeIndex: saveState.conquestState?.currentNodeIndex || 0,
    clearedNodes: saveState.conquestState?.clearedNodes || [],
    rewardCurrency: saveState.conquestState?.rewardCurrency || 0,
    activeDataDisks: saveState.conquestState?.activeDataDisks || [],
    cycleId: saveState.conquestState?.cycleId
  };

  // Check if we need to reset conquest progress
  if (conqState.cycleId !== undefined && conqState.cycleId !== currentCycleCalculated) {
    // Reset progress but KEEP the currency
    conqState = {
      ...conqState,
      currentZoneIndex: 0,
      currentNodeIndex: 0,
      clearedNodes: [],
      activeDataDisks: [],
      cycleId: currentCycleCalculated
    };
    
    // Auto-save the reset
    setTimeout(() => {
        const updated = JSON.parse(JSON.stringify(saveState));
        updated.conquestState = conqState;
        onUpdateState(updated);
    }, 0);
  } else if (conqState.cycleId === undefined) {
      conqState.cycleId = currentCycleCalculated;
  }
  
  // Use the calculated cycle instead of state
  const conquestCycle = currentCycleCalculated;
  
	const DATA_DISKS = [
    { id: 'dd_zealous_ambition', name: 'Zealous Ambition', effect: 'Support Units gain massive Offense (+200% Off)' },
    { id: 'dd_volatile_accelerator', name: 'Volatile Accelerator', effect: 'Critical Hits apply 2 Damage Over Time' },
    { id: 'dd_defensive_formation', name: 'Defensive Formation', effect: 'All Allies gain +50% Defense & Auto-Heal' },
    { id: 'dd_ruthless_swiftness', name: 'Ruthless Swiftness', effect: 'Enemy deaths grant +50% Turn Meter' },
    { id: 'dd_amplified_agony', name: 'Amplified Agony', effect: 'Debuffed Enemies take massive bonus Damage' }
  ];

  const [selectedZoneIndex, setSelectedZoneIndex] = useState<number>(conqState.currentZoneIndex);
  
  const currentZone = ZONES[selectedZoneIndex];

  // Update selectedZoneIndex if currentZoneIndex advances, only on first render/advance
  React.useEffect(() => {
     setSelectedZoneIndex(conqState.currentZoneIndex);
  }, [conqState.currentZoneIndex]);

  const CYCLES = [
    { id: 'rex_lost_commander', name: 'Rex (Lost Commander)', gear: 'Clone Combat Data', gearId: 'clone_combat_data' },
    { id: 'agent_kallus', name: 'Agent Kallus', gear: 'Imperial Command Circuits', gearId: 'imperial_command_circuits' },
    { id: 'shin_hati', name: 'Shin Hati', gear: 'Beskar Alloy Plating', gearId: 'beskar_alloy' }
  ];
  const activeCycleChar = CYCLES[conquestCycle];

  function handlePurchaseShard(charId: string, cost: number) {
    if (conqState.rewardCurrency >= cost) {
      const updated = JSON.parse(JSON.stringify(saveState));
      if (!updated.conquestState) updated.conquestState = JSON.parse(JSON.stringify(conqState));
      updated.conquestState.rewardCurrency -= cost;
      
      const itemId = `shards_${charId}`;
      updated.inventory[itemId] = (updated.inventory[itemId] || 0) + 25;
      
      onUpdateState(updated);
      alert(`Purchased 25 shards of ${getCharacterById(charId)?.name || 'Unit'}!`);
    } else {
      alert("Not enough Conquest Keys!");
    }
  }

  function handlePurchaseGear(gearId: string, name: string, cost: number) {
    if (conqState.rewardCurrency >= cost) {
      const updated = JSON.parse(JSON.stringify(saveState));
      if (!updated.conquestState) updated.conquestState = JSON.parse(JSON.stringify(conqState));
      updated.conquestState.rewardCurrency -= cost;
      
      updated.inventory[gearId] = (updated.inventory[gearId] || 0) + 5;
      
      onUpdateState(updated);
      alert(`Purchased 5x ${name}!`);
    } else {
      alert("Not enough Conquest Keys!");
    }
  }

  const validateCombatArrays = (playerIds: string[], enemyIds: string[]): { validPlayers: string[], validEnemies: string[] } => {
     const allChars = getAllCharacters();
     const validPlayers = playerIds.filter(id => allChars.some(c => c.id === id));
     const validEnemies = enemyIds.filter(id => allChars.some(c => c.id === id));
     
     if (validPlayers.length === 0) {
        console.warn("Conquest validation: No valid players. Falling back to default.");
        validPlayers.push('captain_rex');
     }
     if (validEnemies.length === 0) {
        console.warn("Conquest validation: No valid enemies. Falling back to default.");
        validEnemies.push('b1_battle_droid', 'b2_super_droid');
     }
     
     return { validPlayers, validEnemies };
  };

  function launchConquestNode(node: any, squad: string[]) {
    if ((saveState.conquestEnergy || 0) < 20) {
       alert("Not enough Conquest Energy! (Need 20)");
       return;
    }
    
    const { validPlayers, validEnemies } = validateCombatArrays(squad, node.enemies);

    const runBattle = () => {
      return <CombatBattleView 
          playerTeamIds={validPlayers}
          enemyIds={validEnemies}
          saveState={saveState}
          rewardNode={{ id: node.id, name: node.name, rewards: [], energyCost: 0 }}
          conquestConfig={{
             enemyModifiers: [node.modifier],
             playerDataDisks: conqState.activeDataDisks
          }}
          onExitCombat={(won) => {
            if (won) {
              const up = JSON.parse(JSON.stringify(saveState));
              up.conquestEnergy = Math.max(0, (up.conquestEnergy || 0) - 20);
              
              if (!up.conquestState) up.conquestState = JSON.parse(JSON.stringify(conqState));
              up.conquestState.clearedNodes = [...up.conquestState.clearedNodes, node.id];
              up.conquestState.rewardCurrency += node.rewardCurrency;
              
              up.conquestState.currentNodeIndex += 1;
              if (up.conquestState.currentNodeIndex >= ZONES[up.conquestState.currentZoneIndex].nodeSteps.length) {
                up.conquestState.currentNodeIndex = 0;
                up.conquestState.currentZoneIndex += 1;
                if (up.conquestState.currentZoneIndex >= ZONES.length) {
                  up.conquestState.currentZoneIndex = ZONES.length - 1;
                  up.conquestState.currentNodeIndex = ZONES[up.conquestState.currentZoneIndex].nodeSteps.length - 1;
                }
              }
              onUpdateState(up);
              
              if (node.type === 'boss') {
                  setSelectingDataDisk(node.id);
              }
            }
            if (onExitBattle) onExitBattle();
          }}
      />;
    };

    onLaunchBattle(runBattle);
    setPreBattleSquadSelect(null);
  }

  if (selectingDataDisk) {
    return (
      <div className="space-y-6 animate-fadeIn pb-24 holo-panel-container min-h-screen p-6">
        <div className="holo-panel p-8 rounded-3xl relative overflow-hidden box-glow-purple max-w-4xl mx-auto w-full text-center">
          <div className="absolute inset-0 scan-overlay pointer-events-none opacity-20"></div>
          <h2 className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 mb-2 drop-shadow-[0_0_15px_rgba(192,38,211,0.5)]">BOSS ELIMINATED</h2>
          <p className="text-purple-200/70 max-w-2xl text-sm leading-relaxed font-mono mx-auto mb-8">
            Acquire a Data Disk from their wreckage. This logic core acts as a persistent Leader Ability for your entire squad in all upcoming Conquest sectors.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {DATA_DISKS.map((disk) => {
               const alreadyHave = conqState.activeDataDisks?.includes(disk.id);
               return (
                 <button
                   key={disk.id}
                   onClick={() => {
                     const up = JSON.parse(JSON.stringify(saveState));
                     if (!up.conquestState) up.conquestState = JSON.parse(JSON.stringify(conqState));
                     if (!up.conquestState.activeDataDisks) up.conquestState.activeDataDisks = [];
                     if (!alreadyHave) {
                       up.conquestState.activeDataDisks.push(disk.id);
                     } else {
                       up.inventory['credit'] = (up.inventory['credit'] || 0) + 150000;
                     }
                     onUpdateState(up);
                     setSelectingDataDisk(null);
                   }}
                   className="p-5 bg-indigo-950/40 border border-indigo-500/30 hover:border-indigo-400 rounded-xl transition-all shadow-glow hover:-translate-y-1 text-left flex flex-col gap-2 relative overflow-hidden group"
                 >
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                   
                   <span className="font-display font-black text-indigo-300 flex items-center gap-2 text-lg">
                      <ShieldAlert className="w-5 h-5 text-indigo-400" />
                      {disk.name}
                   </span>
                   <span className="font-mono text-indigo-200/70 text-xs">{disk.effect}</span>
                   {alreadyHave && <span className="font-mono text-[10px] text-amber-500 font-bold uppercase mt-2">Duplicate! Converting to 150,000 Credits</span>}
                 </button>
               )
             })}
          </div>
          <button 
             onClick={() => setSelectingDataDisk(null)}
             className="mt-8 px-6 py-2 border border-zinc-700 text-zinc-400 text-xs font-mono font-bold tracking-widest rounded-lg hover:bg-zinc-800 transition"
          >
             SKIP SALVAGE
          </button>
        </div>
      </div>
    );
  }

  if (preBattleSquadSelect) {
    return (
      <SquadSelectView 
        saveState={saveState}
        enemies={preBattleSquadSelect.node.enemies}
        onCancel={() => setPreBattleSquadSelect(null)}
        onLaunch={(squad) => launchConquestNode(preBattleSquadSelect.node, squad)}
        contextText={`Conquest Node. Mod: ${preBattleSquadSelect.node.modifier}`}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-24 holo-panel-container">
      {showIntro && (
        <InfoDialog 
          title="Galactic Conquest directIves" 
          content={
            <>
               <p>Conquest requires navigating sequential battle sectors containing randomized enemy modifiers.</p>
               <p>Every node uses <b>Conquest Energy</b> (Red) instead of standard Campaign Energy.</p>
               <p>Clearing Boss nodes will provide <b>Data Disks</b>, rewarding you with persistent passive bonuses for the rest of your current Conquest run.</p>
            </>
          }
          onClose={() => {
             setShowIntro(false);
             const copy = { ...saveState };
             if (!copy.stats) copy.stats = {};
             copy.stats['seen_conquest_intro'] = 1;
             onUpdateState(copy);
          }}
        />
      )}

      <div className="holo-panel font-mono border-b border-indigo-500/30 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(99,102,241,0.1)] relative z-10 w-full mb-4">
         <div>
            <h3 className="font-display font-black tracking-widest text-lg text-white">CONQUEST <span className="text-indigo-400">CYCLE {conquestCycle + 1}</span></h3>
            <p className="text-[10px] text-zinc-400 mt-1 uppercase">Cycle Duration Remaining: <span className="text-amber-400 font-bold">{daysRem} Days, {hoursRem} Hours</span></p>
         </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center holo-panel p-8 rounded-3xl relative overflow-hidden box-glow-purple max-w-7xl mx-auto w-full">
        <div className="absolute inset-0 scan-overlay pointer-events-none opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 mb-2 drop-shadow-[0_0_15px_rgba(192,38,211,0.5)]">GALACTIC CONQUEST</h2>
          <p className="text-purple-200/70 max-w-2xl text-sm leading-relaxed font-mono">
            Engage in deep-space incursions through procedural sectors. Enemy formations possess highly localized anomalous modifiers. 
            <span className="text-purple-400 font-bold ml-1">Escavate Conquest Keys to secure priority acquisitions.</span>
          </p>
        </div>
        <div className="mt-6 md:mt-0 flex gap-4">
          <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-rose-500/30 relative z-10 box-glow shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <div className="w-12 h-12 rounded-lg bg-rose-950/40 flex items-center justify-center border border-rose-500/20 box-glow overflow-hidden relative">
              <div className="absolute inset-0 bg-rose-500/10 animate-pulse"></div>
              <Coffee className="w-6 h-6 text-rose-500 relative z-10 glow-neon" />
            </div>
            <div>
              <div className="text-[10px] text-rose-500/50 uppercase tracking-widest font-black">Conquest Energy</div>
              <div className="text-2xl font-black text-rose-400 glow-neon font-mono">{saveState.conquestEnergy ?? 144} <span className="text-sm text-rose-500/50">/ 144</span></div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-amber-500/30 relative z-10 box-glow">
            <div className="w-12 h-12 rounded-lg bg-amber-950/40 flex items-center justify-center border border-amber-500/20 box-glow overflow-hidden relative">
              <div className="absolute inset-0 bg-amber-500/10 animate-pulse"></div>
              <Award className="w-6 h-6 text-amber-500 relative z-10 glow-neon" />
            </div>
            <div>
              <div className="text-[10px] text-amber-500/50 uppercase tracking-widest font-black">Conquest Keys</div>
              <div className="text-2xl font-black text-amber-400 glow-neon font-mono">{(conqState.rewardCurrency || 0).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        <div className="md:col-span-2 space-y-4 min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
             <h3 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 flex items-center gap-3">
                <Map className="w-5 h-5 text-purple-400" /> Sector Navigation
             </h3>
             <div className="flex overflow-x-auto gap-2 bg-black/40 p-1 rounded-xl shrink-0 max-w-full w-full sm:w-auto h-auto no-scrollbar scroll-smooth snap-x">
                {ZONES.map((z, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedZoneIndex(idx)}
                    disabled={idx > conqState.currentZoneIndex}
                    className={`shrink-0 snap-center px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono tracking-widest uppercase transition whitespace-nowrap ${selectedZoneIndex === idx ? 'bg-indigo-600 text-white' : idx <= conqState.currentZoneIndex ? 'bg-zinc-900 border border-zinc-700 hover:border-indigo-500 text-zinc-300' : 'bg-black/50 text-zinc-700 cursor-not-allowed border-dashed border border-zinc-900'}`}
                  >
                    Sector {idx + 1}
                  </button>
                ))}
             </div>
          </div>
          
          <div className="holo-panel p-6 w-full relative pb-8 border-indigo-500/10 rounded-2xl">
             <div className="absolute inset-0 scan-overlay pointer-events-none opacity-[0.03]"></div>
            <div className="flex flex-col gap-8 pb-4">
              {currentZone && currentZone.nodeSteps.map((stepChoices, stepIdx) => {
                const isStepCleared = conqState.clearedNodes.some(clearedId => stepChoices.some(n => n.id === clearedId));
                let isStepLocked = false;
                let isStepActive = false;
                
                if (selectedZoneIndex < conqState.currentZoneIndex) {
                   isStepLocked = !isStepCleared;
                } else if (selectedZoneIndex === conqState.currentZoneIndex) {
                   isStepLocked = !isStepCleared && conqState.currentNodeIndex < stepIdx;
                   isStepActive = !isStepCleared && !isStepLocked && conqState.currentNodeIndex === stepIdx;
                } else {
                   isStepLocked = true;
                }

                return (
                  <div key={stepIdx} className="flex flex-col gap-4 relative shrink-0">
                    <div className="flex items-center gap-4">
                       <div className="h-[1px] bg-cyan-500/30 flex-1"></div>
                       <span className="text-xs font-black font-mono text-cyan-500 uppercase tracking-widest bg-cyan-950/40 px-4 py-1.5 rounded-full border border-cyan-500/20 text-center">
                         Node {stepIdx + 1} {isStepCleared ? '[CLEARED]' : isStepActive ? '[ACTIVE]' : ''}
                       </span>
                       <div className="h-[1px] bg-cyan-500/30 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stepChoices.map((node) => {
                      const isSpecificNodeCleared = conqState.clearedNodes.includes(node.id);
                      // If the step is cleared but this wasn't the chosen node, dim it out
                      const isUnchosen = isStepCleared && !isSpecificNodeCleared;

                      return (
                        <div key={node.id} className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${isStepActive ? 'bg-indigo-950/30 border-indigo-500/50 hover:border-indigo-400 hover:bg-indigo-900/40 cursor-pointer shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:-translate-y-1 group relative' : isSpecificNodeCleared ? 'bg-emerald-950/20 border-emerald-500/30 relative opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : isUnchosen ? 'bg-black/40 border-zinc-900 opacity-20 grayscale' : 'bg-black/40 border-zinc-800/50 opacity-40 grayscale hover:grayscale-0 transition-opacity'}`}>
                          {isStepActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>}
                          
                          <div>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${node.type === 'boss' ? 'bg-rose-950/50 text-rose-400 box-glow-rose border border-rose-500/30' : 'bg-indigo-950/50 text-indigo-400 box-glow-purple border border-indigo-500/30'}`}>
                                   {node.type === 'boss' ? <Skull className="w-5 h-5" /> : <Map className="w-5 h-5" />}
                                </div>
                                <div>
                                  <div className={`font-bold font-display tracking-wide text-lg leading-tight ${node.type === 'boss' ? 'text-rose-300' : 'text-indigo-200'}`}>{node.name}</div>
                                  <div className="text-[10px] font-mono text-zinc-500 mt-0.5">Power: {node.powerRec.toLocaleString()}</div>
                                </div>
                              </div>
                              {isSpecificNodeCleared && <span className="text-[10px] font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 glow-neon shrink-0 ml-2">CLEARED</span>}
                            </div>
                            
                            <div className="space-y-3 mt-4 bg-black/40 p-3 rounded-xl border border-white/5">
                              <div className="flex items-start gap-2">
                                <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                                <div>
                                  <div className="text-[9px] font-bold text-zinc-500 font-mono uppercase tracking-widest">Data Disk</div>
                                  <div className="text-sm font-bold text-rose-300 leading-snug">{node.modifier}</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Award className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                                <div>
                                  <div className="text-[9px] font-bold text-zinc-500 font-mono uppercase tracking-widest">Rewards</div>
                                  <div className="text-sm font-bold text-amber-400 glow-neon">+{node.rewardCurrency} Keys</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {isStepActive && (
                            <button 
                              onClick={() => setPreBattleSquadSelect({ node })}
                              className="w-full mt-5 py-3 text-sm rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border border-indigo-500/30 font-black tracking-widest uppercase transition-all shadow-glow flex items-center justify-center gap-2"
                            >
                              <Skull className="w-4 h-4" /> INITIATE ASSAULT
                            </button>
                          )}
                        </div>
                      );
                    })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="holo-panel p-5 rounded-2xl relative">
             <div className="absolute inset-0 scan-overlay pointer-events-none opacity-[0.03]"></div>
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-display font-black text-amber-500 shadow-glow flex items-center gap-2 uppercase"><Award className="w-5 h-5"/> Requisitions</h3>
               <div className="flex gap-1 bg-black/60 p-1 rounded-lg border border-amber-500/20 box-glow shadow-inner">
                 <span className="px-3 py-1 text-[9px] font-mono rounded font-black uppercase bg-amber-500 text-black shadow-glow">
                   ACTIVE CYCLE: 1
                 </span>
               </div>
             </div>
             <p className="text-[10px] uppercase font-mono tracking-widest text-amber-500/70 mb-4 px-1 border-b border-amber-500/20 pb-2">Priority Acquisition: <span className="text-amber-400 font-bold ml-1">{activeCycleChar.name}</span></p>
             
             <div className="space-y-4">
                <div className="p-4 bg-amber-950/20 rounded-xl border border-amber-500/50 flex flex-col justify-between items-center gap-4 box-glow shadow-inner relative overflow-hidden group">
                  <div className="absolute inset-0 bg-amber-500/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="text-sm font-bold text-white text-center font-display tracking-wide relative z-10">{activeCycleChar.name} <br/> <span className="text-[10px] text-amber-500 font-mono">25x Shards</span></span>
                  <button 
                    onClick={() => handlePurchaseShard(activeCycleChar.id, 50)}
                    className="px-4 py-2 w-full text-xs font-black bg-amber-500 text-black hover:bg-amber-400 rounded-lg shadow-glow relative z-10 hover:scale-105 transition-transform uppercase tracking-widest"
                  >
                    Authorize [50 Keys]
                  </button>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-amber-500/20 flex flex-col justify-between items-center gap-4 shadow-inner relative group hover:border-amber-500/40 transition-colors">
                  <span className="text-sm font-bold text-zinc-300 text-center font-display tracking-wide">{activeCycleChar.gear} <br/><span className="text-[10px] text-amber-500/70 font-mono">5x Salvage</span></span>
                  <button 
                    onClick={() => handlePurchaseGear(activeCycleChar.gearId, activeCycleChar.gear, 25)}
                    className="px-4 py-2 w-full text-xs font-bold bg-amber-950/40 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors uppercase tracking-widest"
                  >
                    Acquire [25 Keys]
                  </button>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-amber-500/20 flex flex-col justify-between items-center gap-4 shadow-inner relative group hover:border-emerald-500/40 transition-colors">
                  <span className="text-sm font-bold text-zinc-300 text-center font-display tracking-wide">Refill Energy <br/><span className="text-[10px] text-emerald-500/70 font-mono">+100 Energy</span></span>
                  <button 
                    onClick={() => {
                        if (conqState.rewardCurrency >= 10) {
                            const updated = JSON.parse(JSON.stringify(saveState));
                            updated.energy += 100;
                            if (updated.conquestState) updated.conquestState.rewardCurrency -= 10;
                            onUpdateState(updated);
                        } else alert('Not enough keys');
                    }}
                    className="px-4 py-2 w-full text-xs font-bold bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors uppercase tracking-widest shadow-glow"
                  >
                    Restock [10 Keys]
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
