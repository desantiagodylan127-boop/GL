import { SaveState, PlayerCharacterProgress } from '../types';
import { STARTER_CHARACTER_IDS, getAllCharacters } from '../data/characters';
import { JOURNEY_CONFIGS, getJourneyPrereqs } from '../data/journeys';

const PROFILES_LIST_KEY = 'galactic_legends_profiles_v2';
const ACTIVE_PROFILE_KEY = 'galactic_legends_active_profile_v2';
const CURRENT_VERSION = 1;

export function getProfilesList(): { id: string; name: string; lastLogin: number; founder: boolean; beta: boolean; }[] {
  try {
    const raw = localStorage.getItem(PROFILES_LIST_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch(e) {
    return [];
  }
}

export function createProfile(name: string): string {
  const id = crypto.randomUUID();
  const profiles = getProfilesList();
  
  const now = Date.now();
  profiles.push({
    id,
    name,
    lastLogin: now,
    founder: true, // all beta accounts are founders
    beta: true
  });
  
  localStorage.setItem(PROFILES_LIST_KEY, JSON.stringify(profiles));
  
  const newSave = getInitialSaveState(id, name, now);
  localStorage.setItem(`save_${id}`, JSON.stringify(newSave));
  
  return id;
}

export function loadProfileInfo(id: string) {
  return getProfilesList().find(p => p.id === id);
}

export function getActiveProfileId(): string | null {
  return localStorage.getItem(ACTIVE_PROFILE_KEY);
}

export function setActiveProfile(id: string | null) {
  if (id) {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
    const profiles = getProfilesList();
    const idx = profiles.findIndex(p => p.id === id);
    if (idx !== -1) {
      profiles[idx].lastLogin = Date.now();
      localStorage.setItem(PROFILES_LIST_KEY, JSON.stringify(profiles));
    }
  } else {
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
  }
}

export function getInitialSaveState(playerId: string, playerName: string, createdAt: number): SaveState {
  const allChars = getAllCharacters();
  const charactersProgress: Record<string, PlayerCharacterProgress> = {};

  allChars.forEach(char => {
    const isStarter = STARTER_CHARACTER_IDS.includes(char.id);

    charactersProgress[char.id] = {
      id: char.id,
      unlocked: isStarter,
      level: isStarter ? 50 : 1,
      stars: isStarter ? 5 : 0,
      gearTier: isStarter ? 5 : 1,
      gearSlots: [false, false, false, false, false, false],
      relicLevel: 0,
      legendLevel: 0,
      abilityLevels: char.abilities.reduce((acc, ab) => {
        acc[ab.id] = 1;
        return acc;
      }, {} as Record<string, number>)
    };
  });

  return {
    version: CURRENT_VERSION,
    playerId,
    playerName,
    createdAt,
    lastLoginDate: createdAt,
    founderAccount: true,
    betaAccount: true,
    credits: 150000,
    crystals: 500,
    energy: 1000,
    maxEnergy: 1000,
    dailyStreak: 0,
    characters: charactersProgress,
    inventory: {
      credit: 150000,
      crystal: 500,
      carbonite_matrix: 10,
      hyper_alloy: 5,
      beskar_alloy: 2,
      legend_shard: 5
    },
    completedCampaigns: [],
    journeyProgress: {},
    raidScores: {},
    battleLog: [],
    prebuiltSquads: {},
    raidAttemptsRemaining: {},
    globalRaidAttempts: 3,
    lastRaidResetDate: new Date().toDateString(),
    conquestEnergy: 144,
    lastConquestEnergyUpdate: new Date().getTime(),
    tutorialCompleted: false,
    tutorialStep: 0
  };
}

export function loadSaveState(): SaveState | null {
  let activeId = getActiveProfileId();
  if (!activeId) {
    const list = getProfilesList();
    if (list.length === 0) {
      activeId = createProfile("Commander");
    } else {
      activeId = list[0].id;
    }
    setActiveProfile(activeId);
  }

  try {
    const raw = localStorage.getItem(`save_${activeId}`);
    if (!raw) {
      return null;
    }

    const state = JSON.parse(raw) as SaveState;

    if (!state.playerId) state.playerId = activeId;
    if (!state.characters) state.characters = {};
    if (!state.inventory) state.inventory = {};
    if (!state.completedCampaigns) state.completedCampaigns = [];
    if (!state.journeyProgress) state.journeyProgress = {};
    if (!state.maxJourneyProgress) state.maxJourneyProgress = {};
    if (!state.raidScores) state.raidScores = {};
    if (!state.battleLog) state.battleLog = [];
    if (!state.prebuiltSquads) state.prebuiltSquads = {};
    if (!state.raidAttemptsRemaining) state.raidAttemptsRemaining = {};
    
    // Core currencies protection
    if (state.credits === undefined) state.credits = 150000;
    if (state.crystals === undefined) state.crystals = 500;
    if (state.energy === undefined) state.energy = 144;
    if (state.maxEnergy === undefined) state.maxEnergy = 144;
    if (state.tutorialCompleted === undefined) state.tutorialCompleted = false;
    if (state.tutorialStep === undefined) state.tutorialStep = 0;

    // Direct Version Migration support
    if (state.version < CURRENT_VERSION) {
      state.version = CURRENT_VERSION;
      saveState(state);
    }

    // Repair missing characters (e.g. if new ones are registered in code but not in localState)
    const allChars = getAllCharacters();
    let updated = false;
    allChars.forEach(char => {
      const prog = state.characters[char.id];
      if (!prog) {
        state.characters[char.id] = {
          id: char.id,
          unlocked: STARTER_CHARACTER_IDS.includes(char.id),
          level: STARTER_CHARACTER_IDS.includes(char.id) ? 50 : 1,
          stars: STARTER_CHARACTER_IDS.includes(char.id) ? 5 : 0,
          gearTier: STARTER_CHARACTER_IDS.includes(char.id) ? 5 : 1,
          gearSlots: [false, false, false, false, false, false],
          relicLevel: 0,
          legendLevel: 0,
          abilityLevels: char.abilities.reduce((acc, ab) => {
            acc[ab.id] = 1;
            return acc;
          }, {} as Record<string, number>)
        };
        updated = true;
      } else {
        // Guarantee properties exist on old saved progress objects
        if (!prog.id) { prog.id = char.id; updated = true; }
        if (!prog.gearSlots) { prog.gearSlots = [false, false, false, false, false, false]; updated = true; }
        if (prog.legendLevel === undefined) { prog.legendLevel = 0; updated = true; }
        if (prog.relicLevel === undefined) { prog.relicLevel = 0; updated = true; }
        if (prog.level === undefined) { prog.level = 1; updated = true; }
        if (prog.stars === undefined) { prog.stars = 0; updated = true; }
        if (prog.gearTier === undefined) { prog.gearTier = 1; updated = true; }
        if (prog.unlocked === undefined) { prog.unlocked = false; updated = true; }

        if (!prog.abilityLevels) { 
          prog.abilityLevels = char.abilities.reduce((acc, ab) => {
            acc[ab.id] = 1;
            return acc;
          }, {} as Record<string, number>); 
          updated = true; 
        }
      }
    });

    // Auto-unlock and scale any character that is required for any journey phase or prerequisite item!
    JOURNEY_CONFIGS.forEach(journey => {
      // 1. Prerequisites
      const prereqs = getJourneyPrereqs(journey.id);
      prereqs.forEach(req => {
        const prog = state.characters[req.id];
        if (prog) {
          const reqGear = req.requiredGear || 10;
          const reqRelic = req.requiredRelic || 0;
          if (!prog.unlocked || prog.stars < 7 || prog.level < 85 || prog.gearTier < Math.max(reqGear, 10) || prog.relicLevel < reqRelic) {
            prog.unlocked = true;
            prog.stars = 7;
            prog.level = 85;
            prog.gearTier = Math.max(prog.gearTier, reqGear, 10);
            prog.relicLevel = Math.max(prog.relicLevel, reqRelic);
            const charObj = allChars.find(c => c.id === req.id);
            if (charObj) {
              charObj.abilities.forEach(ab => {
                prog.abilityLevels[ab.id] = 8;
              });
            }
            updated = true;
          }
        }
      });

      // 2. Phase-specific required character IDs
      journey.phases.forEach(phase => {
        if (phase.requiredCharacterIds) {
          phase.requiredCharacterIds.forEach(charId => {
            const prog = state.characters[charId];
            if (prog) {
              const reqGear = phase.gearReq || 10;
              const reqRelic = phase.relicReq || 0;
              if (!prog.unlocked || prog.stars < 7 || prog.level < 85 || prog.gearTier < Math.max(reqGear, 10) || prog.relicLevel < reqRelic) {
                prog.unlocked = true;
                prog.stars = 7;
                prog.level = 85;
                prog.gearTier = Math.max(prog.gearTier, reqGear, 10);
                prog.relicLevel = Math.max(prog.relicLevel, reqRelic);
                const charObj = allChars.find(c => c.id === charId);
                if (charObj) {
                  charObj.abilities.forEach(ab => {
                    prog.abilityLevels[ab.id] = 8;
                  });
                }
                updated = true;
              }
            }
          });
        }
      });
    });

    if (!state.prebuiltSquads) {
      state.prebuiltSquads = {};
      updated = true;
    }
    if (!state.raidAttemptsRemaining) {
      state.raidAttemptsRemaining = {};
      updated = true;
    }
    if (state.globalRaidAttempts === undefined) {
      state.globalRaidAttempts = 3;
      updated = true;
    }
    if (!state.lastRaidResetDate || state.lastRaidResetDate !== new Date().toDateString()) {
      state.lastRaidResetDate = new Date().toDateString();
      state.globalRaidAttempts = 3;
      state.raidAttemptsRemaining = {};
      updated = true;
    }

    if (!state.maxEnergy || state.maxEnergy < 1000) {
      state.maxEnergy = 1000;
      updated = true;
    }
    
    if (state.conquestEnergy === undefined) {
      state.conquestEnergy = 144;
      state.lastConquestEnergyUpdate = new Date().getTime();
      updated = true;
    }
    
    // As per user request: "give me my energy back lol and increase cap too 1000"
    if (state.energy < 1000) {
      state.energy = 1000;
      updated = true;
    }

    // As per user request: "Okay reset my raid attempts so I can try"
    state.globalRaidAttempts = 3;
    if (!state.raidAttemptsRemaining) {
      state.raidAttemptsRemaining = {};
    }
    // Clear all per-raid lockouts
    Object.keys(state.raidAttemptsRemaining).forEach(key => {
      state.raidAttemptsRemaining![key] = 3;
    });
    updated = true;

    // Offline Energy Replenishment
    const now = new Date();
    const lastLogin = new Date(state.lastLoginDate || now.getTime());
    const diffMs = now.getTime() - lastLogin.getTime();
    
    // Check if it's a new day to reset daily events
    if (now.toDateString() !== lastLogin.toDateString()) {
      state.completedDailyEvents = [];
    }

    const energyGained = Math.floor(diffMs / (1000 * 60 * 6)); // 1 energy per 6 mins
    if (energyGained > 0 && state.energy < state.maxEnergy) {
      state.energy = Math.min(state.maxEnergy, state.energy + energyGained);
    }
    
    // Conquest Energy Replenishment (1 per 12 mins)
    const conquestDiffMs = now.getTime() - (state.lastConquestEnergyUpdate || now.getTime());
    const conquestEnergyGained = Math.floor(conquestDiffMs / (1000 * 60 * 12));
    if (conquestEnergyGained > 0 && state.conquestEnergy < 144) {
      state.conquestEnergy = Math.min(144, state.conquestEnergy + conquestEnergyGained);
      state.lastConquestEnergyUpdate = now.getTime();
    } else if (state.lastConquestEnergyUpdate === undefined) {
      state.lastConquestEnergyUpdate = now.getTime();
    }
    
    // Always update lastLogin to handle fractional resets or current time
    state.lastLoginDate = now.getTime();
    updated = true;

    if (updated) {
      saveState(state);
    }

    return state;
  } catch (e) {
    console.error('Failed to load save state. Returns null', e);
    return null;
  }
}

export function saveState(state: SaveState) {
  try {
    localStorage.setItem(`save_${state.playerId}`, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to serialize state to localStorage', e);
  }
}

function migrateSaveState(oldState: any): SaveState {
  // Simple copy matching properties
  const migrated: SaveState = {
    ...oldState,
    version: CURRENT_VERSION
  };
  // Save it as string and then parse it again with the standard repairs
  saveState(migrated);
  const reloaded = localStorage.getItem(`save_${oldState.playerId || migrated.playerId}`);
  if (reloaded) {
    // Break circular migration loop by spoofing version correctly
    return JSON.parse(reloaded) as SaveState;
  }
  return migrated;
}

export function resetSaveState(): SaveState | null {
  return loadSaveState();
}
