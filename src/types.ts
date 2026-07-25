export interface Character {
  id: string;
  name: string;
  role: string;
  tags: string[];
  lore?: string;
  baseStats?: Record<string, number>;
  abilities: Ability[];
  faction?: string;
  powerLevel?: number;
  combatStyle?: string;
  isSummon?: boolean;
  releaseState?: 'legacy' | 'era' | 'conquest';
  image?: string;
  isLegend?: boolean;
  era?: string;
  eraId?: string; // e.g. 'clone_wars'
  acquisition?: 'farmable' | 'journey' | 'era' | 'galactic_legend' | 'conquest' | 'event';
  alignment?: 'light' | 'dark';
  timePeriod?: 'clone_wars' | 'civil_war' | 'post_endor';
}

export interface Ability {
  id: string;
  name: string;
  type: 'basic' | 'special' | 'leader' | 'unique' | 'ultimate' | 'summon';
  cooldown: number;
  desc: string;
  effects: string[];
  aiTags: string[];
  chargeRequirement?: number; // For Ultimate abilities
  targetType?: string;
}

export interface CombatStatus {
  name: string; // 'Offense Up', 'Daze', etc.
  duration: number; // in unit turns
  isDebuff: boolean;
  value?: number; // optional, e.g., stat multiplier or stack value
  count?: number; // optional stack counter for stacking effects like Purge or Frostbite
}

export interface CombatUnit {
  id: string; // character.id + team + index
  characterId: string;
  name: string;
  team: 'player' | 'enemy';
  isSummon?: boolean;
  hp: number;
  maxHp: number;
  protection: number;
  maxProtection: number;
  speed: number;
  turnMeter: number; // 0 to 100
  offense: number;
  defense: number;
  critChance: number; // e.g., 0.4 for 40%
  critDamage: number; // e.g., 1.5 for 150%
  potency: number;
  tenacity: number;
  cooldowns: Record<string, number>; // abilityId -> turns remaining
  statuses: CombatStatus[];
  ultimateCharge?: number; // for Galactic Legends (0 to 100)
  activeInBattle: boolean;
  tags: string[];
  abilities: Ability[];
  position: number; // index in squad (0-4)
  dynamicState?: any; // generic dynamic tracker state (e.g. momentum gains, turn metrics)
  level?: number;
  stars?: number;
  gearTier?: number;
  relicLevel?: number;
  preventRevive?: boolean;
}

export interface PlayerCharacterProgress {
  id: string;
  unlocked: boolean;
  level: number; // 1-85
  stars: number; // 1-7
  gearTier: number; // 1-13
  gearSlots: boolean[]; // size 6, indicating if slotted
  relicLevel: number; // 0-10
  legendLevel: number; // 0-10
  abilityLevels: Record<string, number>; // abilityId -> level
  eraLevel?: number; // 1-200 for Era progression
}

export interface InventoryItem {
  id: string;
  name: string;
  desc: string;
  type: 'gear' | 'relic' | 'legend' | 'currency' | 'shards';
  characterId?: string; // for shards
}

export interface ConquestState {
  currentZoneIndex: number;
  currentNodeIndex: number;
  clearedNodes: string[]; // node IDs cleared
  rewardCurrency: number; // custom conquest currency won
  activeDataDisks?: string[];
  cycleId?: number;
}

export interface SaveState {
  version: number;
  playerId: string;
  playerName: string;
  founderAccount: boolean;
  betaAccount: boolean;
  credits: number;
  crystals: number;
  energy: number; // current stamina
  maxEnergy: number;
  createdAt: number;
  lastLoginDate: number;
  dailyStreak: number;
  characters: Record<string, PlayerCharacterProgress>;
  inventory: Record<string, number>; // item_id -> quantity
  completedCampaigns: string[]; // planetId_difficulty_sector_nodeId // cleared Campaign nodes
  completed3StarNodes?: string[]; // nodes completed 3-star
  completedDailyEvents?: string[]; // Events completed today
  journeyProgress: Record<string, number>; // journeyId -> phaseIndex completed
  maxJourneyProgress?: Record<string, number>; // journeyId -> highest phaseIndex ever completed (survives reset)
  raidScores: Record<string, number>; // raidId -> highestScore
  raidPhaseSelections?: Record<string, number>; // raidId -> active selected automatic phase
  battleLog: string[];
  prebuiltSquads?: Record<string, string[]>;
  raidAttemptsRemaining?: Record<string, number>;
  globalRaidAttempts?: number;
  lastRaidResetDate?: string;
  customJourneys?: JourneyConfig[];
  customRaids?: RaidConfig[];
  customEvents?: EventConfig[];
  customCampaignNodes?: CampaignNode[];
  isLockedPlayerClient?: boolean;
  conquestEnergy?: number;
  lastConquestEnergyUpdate?: number;
  conquestState?: ConquestState;
  
  // Tactical data
  raidScoresCurrent?: Record<string, number>;
  raidPhaseCurrent?: number;
  conquestDataDisks?: string[];
  reviveCounts?: Record<string, number>;
  turnAttackers?: string[];
  
  // Missions
  missionProgress?: Record<string, number>;
  claimedMissions?: string[];
  lastDailyReset?: number;
  lastWeeklyReset?: number;
  stats?: Record<string, number>; // generic stats for tracking achievements
  equippedTitle?: string;
  
  tutorialCompleted?: boolean;
  tutorialStep?: number;
}

export interface MissionDef {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement' | 'hidden';
  target: number;
  reward: {
    credits?: number;
    crystals?: number;
    energy?: number;
    shards?: { character: string; amount: number };
    title?: string;
  };
}

export interface CampaignNodeReward {
  itemId: string;
  amountMin: number;
  amountMax: number;
  chance: number;
}

export interface CampaignNode {
  id: string;
  planet: string;
  sector: string;
  era?: string;
  background?: string;
  nodeName: string;
  difficulty: 'Normal' | 'Hard' | 'Legend' | 'Galactic';
  energyCost: number;
  powerRecommended: number;
  enemies: string[]; // characterIds of enemies
  rewards: CampaignNodeReward[];
}

export interface CombatEventLog {
  text: string;
  type: 'info' | 'damage' | 'heal' | 'buff' | 'debuff' | 'death' | 'turn' | 'summon' | 'ultimate';
  targetId?: string;
  sourceId?: string;
  amount?: number;
  isCrit?: boolean;
}

export interface CombatState {
  playerTeam: CombatUnit[];
  enemyTeam: CombatUnit[];
  activeUnitId: string | null;
  battleLog: CombatEventLog[];
  turnCount: number;
  battleSpeed: 1 | 2 | 4;
  isAuto: boolean;
  ended: boolean;
  winner: 'player' | 'enemy' | null;
  selectedTargetId: string | null;
  bonusTurnQueue: string[];
  consecutiveBonusCount: Record<string, number>;
  totalScore: number;
  raidPhaseCurrent: number;
  reviveCounts: Record<string, number>;
  conquestDataDisks?: string[];
  turnAttackers?: string[];
  tutorialStep?: number;
  tutorialCompleted?: boolean;
  dynamicState?: any;
  rewardNodeId?: string | null;
}

export interface EventConfig {
  id: string;
  name: string;
  desc: string;
  type: 'Era Battle' | 'Special Event' | 'Marquee Event' | 'Assault Battle' | 'Character Event' | 'Material Battle' | 'Raid Event' | 'Seasonal Event' | 'Elite Marquee';
  schedule: 'daily' | 'weekly' | 'monthly' | 'recurring' | 'date-range' | 'active';
  startDate?: string;
  endDate?: string;
  durationDays: number;
  primaryFaction: string[]; // allowed player factions
  enemyFaction: string[]; // decorative
  recommendedFactions?: string[];
  marqueeCharId?: string;
  requiredJourneyCharacterId?: string;
  nodes: CampaignNode[];
}

export interface JourneyConfig {
  id: string;
  name: string;
  desc: string;
  isGalacticLegend: boolean;
  rewardCharacterId: string;
  phases: JourneyPhase[];
  recommendedPower: number;
  journeyTier?: number;
}

export interface JourneyPhase {
  phaseNumber: number;
  description: string;
  levelReq: number;
  gearReq: number;
  relicReq: number;
  legendLevelReq: number;
  requiredCharacterIds: string[]; // must use these characters
  enemies: string[]; // characterIds of enemies to face
  enemyWaves?: string[][]; // waves of enemies to face
  rewards: { itemId: string; amount: number }[];
  loanedPlayerSquad?: string[]; // character ids provided automatically at high power
  background?: string;
  objective?: string;
  story?: string;
  rules?: string;
}

export interface RaidPhaseConfig {
  phaseNumber: number;
  bossId: string;
  bossHp: number;
  environmentalEffects: string[];
  mechanics: string[];
  objectiveDesc: string;
  additionalEnemyIds?: string[]; // Multiple enemies in raid rounds
  background?: string;
}

export interface RaidConfig {
  id: string;
  name: string;
  bossName: string;
  desc: string;
  phases: RaidPhaseConfig[];
  recommendedFactions: string[];
}

export interface JourneyPrereqItem {
  id: string;
  name: string;
  requiredRelic: number; // 0 means just unlocked
  requiredGear: number;
}
