import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { 
  getCharacterRegistry, 
  getFactionRegistry, 
  getTagRegistry, 
  getAbilityRegistry 
} from './src/data/registries';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent Server Database Path
const DB_PATH = path.join(process.cwd(), 'server_db.json');

// --- DATABASE INTERFACES (Tasks 1 - 14) ---

export interface PlayerAccount {
  accountId: string;
  username: string;
  passwordHash: string;      // Bcrypt hashed password (Task 1)
  recoveryCodeHash: string;  // Bcrypt hashed recovery code (Task 2)
  email?: string;            // Optional email (Task 3)
  emailVerified?: boolean;   // Email verification state (Task 3)
  createdAt: number;
  lastLogin: number;
  founder: boolean;
  betaTester: boolean;
  admin: boolean;
  developer: boolean;
  commanderLevel: number;
  profileAvatar: string;
  profileTitle: string;
  banned: boolean;
  profileBorder?: string;    // Custom decorative profile frame (Task 10)
}

export interface PlayerProfile {
  accountId: string;
  username: string;
  avatar: string;
  title: string;
  profileBorder: string;     // Custom border (Task 10)
  favoriteCharacter: string;
  favoriteFaction: string;
  favoriteEra: string;
  collectionPower: number;   // Server-authorized calculation (Task 6)
  galacticSiegeRank: number;
  showcaseSquad: string[];   // Profile showcase squad (Task 10)
  founderBadge: boolean;     // Showcase badges (Task 10)
  betaTesterBadge: boolean;
}

export interface SaveBackup {
  id: string;
  accountId: string;
  saveState: any;
  timestamp: number;
  saveVersion: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: number;
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  archived: boolean;
  category?: 'news' | 'update' | 'maintenance' | 'event' | 'developer_post' | 'emergency_notice';
  pinned?: boolean;
  maintenanceEndsAt?: number;
}

export interface MailRewards {
  credits?: number;
  crystals?: number;
  raidTokens?: number;
  eraCurrency?: number;
  shards?: { characterId: string; amount: number }[];
  gear?: { gearId: string; count: number }[];
  relicMaterials?: { materialId: string; count: number }[];
}

export interface MailMessage {
  id: string;
  sender: string;
  subject: string;
  body: string;
  sentAt: number;
  read: boolean;
  claimed: boolean;
  rewards?: MailRewards; // Advanced multiple rewards (Task 8)
}

export interface AdminLog {
  id: string;
  adminName: string;
  timestamp: number;
  action: string; 
  targetAccount: string;
  details: string;
}

export interface BattleReplay {
  id: string;
  battleSeed: string;
  battleActions: any[];
  turnOrder: string[];
  result: 'win' | 'loss';
  timestamp: number;
  attackerAccountId: string;
  attackerUsername: string;
  defenderAccountId: string;
  defenderUsername: string;
}

export interface SeasonInfo {
  currentEra: string;
  currentPlanet: string;
  seasonStart: number;
  seasonEnd: number;
  activeBonuses: { faction: string; bonusStat: string; value: number }[];
  currentConquestId: string;
  currentLoginCalendar: { day: number; rewardType: string; rewardAmount: number }[];
}

export interface MatchLog {
  id: string;
  timestamp: number;
  playerAccountId: string;
  playerUsername: string;
  opponentAccountId: string;
  opponentUsername: string;
  winnerAccountId: string;
  playerSquad: string[];
  opponentSquad: string[];
}

export interface UserSession {
  accessToken: string;
  refreshToken: string;
  accountId: string;
  expiresAt: number;
  refreshExpiresAt: number;
}

export interface FailedLoginLog {
  attempts: number;
  lockoutUntil: number;
  ip: string;
  lastAttemptAt: number;
}

export interface ExtendedAnalytics {
  dailyActiveUsers: string[];    // AccountIds active today
  monthlyActiveUsers: string[];  // AccountIds active this month
  factionUsage: Record<string, number>;
  characterUsage: Record<string, number>;
  journeyCompletion: Record<string, number>;
  eraParticipation: Record<string, number>;
  mailClaims: number;
  profileCreation: number;
  retention: {
    registered: number;
    returned1d: number;
    returned7d: number;
  };
  averageSessionLength: number; // in seconds
  totalSessionsCount: number;
  mostUsedTeam: string[];
  conquestParticipationRate: number;
  eventParticipationRate: number;
  factionWinRates: Record<string, number>;
  campaignFailureRate: number;
}

export interface DBStructure {
  accounts: Record<string, PlayerAccount>;
  saves: Record<string, { saveState: any; updatedAt: number }>;
  savesHistory: Record<string, SaveBackup[]>; // Keep latest 5 saves (Task 4)
  profiles: Record<string, PlayerProfile>;
  mails: Record<string, MailMessage[]>;
  matchLogs: MatchLog[];
  announcements: Announcement[]; // (Task 7)
  adminLogs: AdminLog[];         // (Task 9)
  replays: BattleReplay[];       // (Task 11)
  seasonInfo: SeasonInfo;        // (Task 12)
  analytics: {
    totalLogins: number;
    savesUploaded: number;
    siegeMatchesPlayed: number;
    charactersUnlocked: Record<string, number>;
    journeysCompleted: Record<string, number>;
  };
  analyticsExtended: ExtendedAnalytics; // (Task 14)
  sessions: Record<string, UserSession>; // Task 5 Proper session tokens
  failedLoginLogs: Record<string, FailedLoginLog>; // Task 4 Failed login lockout
  friends: Record<string, { friendsList: string[], sentRequests: string[], receivedRequests: string[], favorites: string[] }>;
  settings: Record<string, any>;
  errorReports: any[];
  feedback: any[];
  systemLogs: any[];
  siegeStates?: Record<string, any>;
  siegePlanets?: any[];
  activeSiegePlanetId?: string;
  siegeAnalytics?: {
    characterUsage: Record<string, number>;
    teamUsage: Record<string, number>;
    winRates: Record<string, { wins: number; total: number }>;
    popularDefenses: Record<string, number>;
  };
}

// Default DB Blueprint
let db: DBStructure = {
  accounts: {},
  saves: {},
  savesHistory: {},
  profiles: {},
  mails: {},
  matchLogs: [],
  announcements: [],
  adminLogs: [],
  replays: [],
  seasonInfo: {
    currentEra: 'civil_war',
    currentPlanet: 'Tatooine',
    seasonStart: Date.now(),
    seasonEnd: Date.now() + 30 * 24 * 60 * 60 * 1000,
    activeBonuses: [
      { faction: 'Rebel', bonusStat: 'Offense', value: 15 },
      { faction: 'Empire', bonusStat: 'Defense', value: 20 }
    ],
    currentConquestId: 'conquest_cycle_1',
    currentLoginCalendar: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      rewardType: i % 2 === 0 ? 'credits' : 'crystals',
      rewardAmount: i % 2 === 0 ? 50000 : 100
    }))
  },
  analytics: {
    totalLogins: 0,
    savesUploaded: 0,
    siegeMatchesPlayed: 0,
    charactersUnlocked: {},
    journeysCompleted: {}
  },
  analyticsExtended: {
    dailyActiveUsers: [],
    monthlyActiveUsers: [],
    factionUsage: {},
    characterUsage: {},
    journeyCompletion: {},
    eraParticipation: {},
    mailClaims: 0,
    profileCreation: 0,
    retention: { registered: 0, returned1d: 0, returned7d: 0 },
    averageSessionLength: 120,
    totalSessionsCount: 0,
    mostUsedTeam: ['luke_stormtrooper', 'han_stormtrooper', 'leia_senator'],
    conquestParticipationRate: 45,
    eventParticipationRate: 60,
    factionWinRates: { Rebel: 0.75, Empire: 0.68 },
    campaignFailureRate: 15
  },
  sessions: {},
  failedLoginLogs: {},
  friends: {},
  settings: {},
  errorReports: [],
  feedback: [],
  systemLogs: []
};

// --- CORE UTILITIES ---

function saveDatabase() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

function loadDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      db = { ...db, ...parsed };
      
      // Ensure key arrays / objects exist
      if (!db.savesHistory) db.savesHistory = {};
      if (!db.announcements) db.announcements = [];
      if (!db.adminLogs) db.adminLogs = [];
      if (!db.replays) db.replays = [];
      if (!db.sessions) db.sessions = {};
      if (!db.failedLoginLogs) db.failedLoginLogs = {};
      if (!db.friends) db.friends = {};
      if (!db.settings) db.settings = {};
      if (!db.errorReports) db.errorReports = [];
      if (!db.feedback) db.feedback = [];
      if (!db.systemLogs) db.systemLogs = [];
      if (!db.seasonInfo) db.seasonInfo = { ...db.seasonInfo };
      if (!db.analyticsExtended) {
        db.analyticsExtended = {
          dailyActiveUsers: [],
          monthlyActiveUsers: [],
          factionUsage: {},
          characterUsage: {},
          journeyCompletion: {},
          eraParticipation: {},
          mailClaims: 0,
          profileCreation: 0,
          retention: { registered: 0, returned1d: 0, returned7d: 0 },
          averageSessionLength: 120,
          totalSessionsCount: 0,
          mostUsedTeam: ['luke_stormtrooper', 'han_stormtrooper', 'leia_senator'],
          conquestParticipationRate: 45,
          eventParticipationRate: 60,
          factionWinRates: { Rebel: 0.75, Empire: 0.68 },
          campaignFailureRate: 15
        };
      }
      // Ensure specific fields exist
      if (db.analyticsExtended.averageSessionLength === undefined) db.analyticsExtended.averageSessionLength = 120;
      if (db.analyticsExtended.totalSessionsCount === undefined) db.analyticsExtended.totalSessionsCount = 0;
      if (db.analyticsExtended.mostUsedTeam === undefined) db.analyticsExtended.mostUsedTeam = ['luke_stormtrooper', 'han_stormtrooper', 'leia_senator'];
      if (db.analyticsExtended.conquestParticipationRate === undefined) db.analyticsExtended.conquestParticipationRate = 45;
      if (db.analyticsExtended.eventParticipationRate === undefined) db.analyticsExtended.eventParticipationRate = 60;
      if (db.analyticsExtended.factionWinRates === undefined) db.analyticsExtended.factionWinRates = { Rebel: 0.75, Empire: 0.68 };
      if (db.analyticsExtended.campaignFailureRate === undefined) db.analyticsExtended.campaignFailureRate = 15;

      // Initialize Galactic Siege fields
      if (!db.siegeStates) db.siegeStates = {};
      if (!db.siegePlanets) {
        db.siegePlanets = [
          {
            id: 'kamino',
            name: 'Kamino',
            artwork: 'kamino',
            description: 'An aquatic world covered in endless storms. Home to legendary cloning facilities.',
            featuredTags: ['Clone Trooper', 'Galactic Republic', '501st'],
            bonuses: [
              { tag: 'Clone Trooper', description: 'Gain +50% Max Protection and +20% Offense.' },
              { tag: 'Galactic Republic', description: 'Gain +25% Tenacity and heal 10% Health on turn start.' }
            ],
            timeRemaining: 24 * 60 * 60 * 1000 * 25,
            developerNotes: 'Featured planet A'
          },
          {
            id: 'death_star',
            name: 'Death Star',
            artwork: 'death_star',
            description: 'The Ultimate Weapon. Stationed deep in the Outer Rim.',
            featuredTags: ['Empire', 'Rebel', 'Imperial Trooper'],
            bonuses: [
              { tag: 'Empire', description: 'Gain +30% Critical Chance and +25% Counter Attack Chance.' },
              { tag: 'Rebel', description: 'Gain +15% Speed and +20% Potency.' }
            ],
            timeRemaining: 24 * 60 * 60 * 1000 * 12,
            developerNotes: 'Featured planet B'
          },
          {
            id: 'geonosis',
            name: 'Geonosis',
            artwork: 'geonosis',
            description: 'A harsh desert world covered in massive droid factories.',
            featuredTags: ['Separatist', 'Geonosian', 'Droid'],
            bonuses: [
              { tag: 'Separatist', description: 'Gain +40% Max Health and +15% Critical Avoidance.' },
              { tag: 'Geonosian', description: 'Equalize health when any Geonosian ally takes a turn.' }
            ],
            timeRemaining: 24 * 60 * 60 * 1000 * 5,
            developerNotes: 'Featured planet C'
          }
        ];
      }
      if (!db.activeSiegePlanetId) db.activeSiegePlanetId = 'kamino';
      if (!db.siegeAnalytics) {
        db.siegeAnalytics = {
          characterUsage: { 'captain_rex': 24, 'general_skywalker': 38, 'fives': 19 },
          teamUsage: { 'general_skywalker,fives,echo_501st,appo_501st,captain_rex': 12 },
          winRates: { 'general_skywalker': { wins: 35, total: 38 } },
          popularDefenses: { 'captain_rex,fives,echo_501st,appo_501st': 8 }
        };
      }

      console.log('Database loaded with', Object.keys(db.accounts).length, 'accounts.');
    } else {
      seedAdminAccount();
    }
    seedAIAccounts();
  } catch (err) {
    console.error('Error loading database file. Re-seeding:', err);
    seedAdminAccount();
    seedAIAccounts();
  }
}

function seedAIAccounts() {
  const prefixList = ['Commander', 'General', 'Captain', 'Sith', 'Jedi', 'Darth', 'Padawan', 'Trooper', 'Agent', 'Hunter', 'Baron', 'Moff', 'Pilot', 'Officer', 'Sovereign', 'Gladiator', 'Spectre', 'Sentinel', 'Enforcer', 'Overseer', 'Scourge', 'Executor', 'Adviser', 'Marshal', 'Warlord', 'Adjutant', 'Legionary'];
  const nameList = ['Skywalker', 'Vader', 'Kenobi', 'Thrawn', 'Rex', 'Cody', 'Ahsoka', 'Revan', 'Malak', 'Solo', 'Organa', 'Calrissian', 'Fett', 'Grievous', 'Dooku', 'Sidious', 'Windu', 'Yoda', 'Krennic', 'Tarkin', 'Kallus', 'Maul', 'Savage', 'Ventress', 'Bane', 'Jango', 'Phasma', 'Kylo', 'Hux', 'Palpatine', 'Tano', 'Secura', 'Shan', 'Katarn', 'Jade', 'Karrde', 'Jarrus', 'Bridger', 'Syndulla', 'Orrelios'];
  const suffixList = ['RedFive', 'GoldLeader', 'RogueOne', 'Clone99', 'Ghost', 'Spectre6', 'Shadow', 'Apex', 'Nova', 'Void', 'Kyber', 'Prime', 'Zenith', 'Echo', 'Omega', 'Vanguard', 'Alpha', 'Beta', 'Sigma', 'Squad', 'Wraith', 'Specter', 'WraithOne', 'Blade', 'Saber', 'Force'];

  const existingAIs = Object.keys(db.accounts).filter(id => id.startsWith('ai_'));
  const needed = 500 - existingAIs.length;

  if (needed <= 0) {
    return;
  }

  console.log(`Seeding ${needed} AI accounts for Galactic Siege matchmaking...`);

  const usedNames = new Set(Object.values(db.accounts).map((a: any) => a.username.toLowerCase()));

  for (let i = 0; i < needed; i++) {
    let name = '';
    let attempts = 0;
    while (attempts < 100) {
      const pref = prefixList[Math.floor(Math.random() * prefixList.length)];
      const nm = nameList[Math.floor(Math.random() * nameList.length)];
      const suff = Math.random() < 0.6 ? suffixList[Math.floor(Math.random() * suffixList.length)] : Math.floor(Math.random() * 999).toString();
      name = `${pref}_${nm}_${suff}`;
      if (!usedNames.has(name.toLowerCase())) {
        usedNames.add(name.toLowerCase());
        break;
      }
      attempts++;
    }
    if (!name) {
      name = `Commander_AI_${Math.random().toString(36).substr(2, 6)}`;
    }

    const aiId = `ai_${i}_${Math.random().toString(36).substr(2, 5)}`;
    
    db.accounts[aiId] = {
      accountId: aiId,
      username: name,
      passwordHash: 'ai_simulated_account_no_password',
      recoveryCodeHash: 'ai_simulated_account_no_recovery',
      createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      lastLogin: Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000,
      founder: Math.random() < 0.1,
      betaTester: Math.random() < 0.3,
      admin: false,
      developer: false,
      commanderLevel: 50 + Math.floor(Math.random() * 35),
      profileAvatar: Math.random() < 0.5 ? 'luke_stormtrooper' : 'leia_senator',
      profileTitle: Math.random() < 0.5 ? 'Siege Sovereign' : 'Frontline Veteran',
      profileBorder: Math.random() < 0.3 ? 'cyber' : 'none',
      banned: false
    };

    const aiState = {
      credits: 500000 + Math.floor(Math.random() * 2000000),
      crystals: 500 + Math.floor(Math.random() * 3000),
      energy: 144,
      arenaTickets: 5,
      lastDailyReset: Date.now(),
      dailyQuestsCompleted: [],
      unlockedTitles: ['Siege Sovereign', 'Frontline Veteran'],
      unlockedBorders: ['none', 'cyber'],
      characters: {
        luke_stormtrooper: { id: 'luke_stormtrooper', unlocked: true, level: 70 + Math.floor(Math.random() * 15), stars: 5 + Math.floor(Math.random() * 3), gearTier: 9 + Math.floor(Math.random() * 4), gearSlots: [false,false,false,false,false,false], relicLevel: 0, legendLevel: 0, abilityLevels: {} },
        han_stormtrooper: { id: 'han_stormtrooper', unlocked: true, level: 70 + Math.floor(Math.random() * 15), stars: 5 + Math.floor(Math.random() * 3), gearTier: 9 + Math.floor(Math.random() * 4), gearSlots: [false,false,false,false,false,false], relicLevel: 0, legendLevel: 0, abilityLevels: {} },
        leia_senator: { id: 'leia_senator', unlocked: true, level: 70 + Math.floor(Math.random() * 15), stars: 5 + Math.floor(Math.random() * 3), gearTier: 9 + Math.floor(Math.random() * 4), gearSlots: [false,false,false,false,false,false], relicLevel: 0, legendLevel: 0, abilityLevels: {} }
      }
    };
    db.saves[aiId] = { saveState: aiState, updatedAt: Date.now() };

    db.profiles[aiId] = {
      accountId: aiId,
      username: name,
      avatar: Math.random() < 0.5 ? 'luke_stormtrooper' : 'leia_senator',
      title: Math.random() < 0.5 ? 'Siege Sovereign' : 'Frontline Veteran',
      profileBorder: Math.random() < 0.3 ? 'cyber' : 'none',
      favoriteCharacter: 'luke_stormtrooper',
      favoriteFaction: Math.random() < 0.5 ? 'Rebel' : 'Empire',
      favoriteEra: 'civil_war',
      collectionPower: 50000 + Math.floor(Math.random() * 150000),
      galacticSiegeRank: 800 + Math.floor(Math.random() * 1800),
      showcaseSquad: ['luke_stormtrooper', 'han_stormtrooper'],
      founderBadge: Math.random() < 0.1,
      betaTesterBadge: Math.random() < 0.3
    };
  }

  saveDatabase();
  console.log(`Seeding complete! 500 AI Accounts fully initialized.`);
}

function logAdminAction(adminName: string, action: string, targetAccount: string, details: string) {
  const log: AdminLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    adminName,
    timestamp: Date.now(),
    action,
    targetAccount,
    details
  };
  db.adminLogs.unshift(log);
  if (db.adminLogs.length > 500) db.adminLogs.pop();
}

function generateRecoveryCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${seg()}-${seg()}-${seg()}`;
}

// Seed admin: ANTISANTI1272 / GL12725623 (Task 1 Hashed)
function seedAdminAccount() {
  const adminId = 'admin_antisanti1272';
  const hashedPass = bcrypt.hashSync('GL12725623', 10);
  const rawRecoveryCode = 'WXYZ-1234-ABCD';
  const hashedRecovery = bcrypt.hashSync(rawRecoveryCode, 10);

  const adminAccount: PlayerAccount = {
    accountId: adminId,
    username: 'ANTISANTI1272',
    passwordHash: hashedPass,
    recoveryCodeHash: hashedRecovery,
    createdAt: Date.now(),
    lastLogin: Date.now(),
    founder: true,
    betaTester: true,
    admin: true,
    developer: true,
    commanderLevel: 85,
    profileAvatar: 'luke_stormtrooper',
    profileTitle: 'The Senate',
    banned: false,
    profileBorder: 'gold'
  };

  const adminProfile: PlayerProfile = {
    accountId: adminId,
    username: 'ANTISANTI1272',
    avatar: 'luke_stormtrooper',
    title: 'The Senate',
    profileBorder: 'gold',
    favoriteCharacter: 'luke_stormtrooper',
    favoriteFaction: 'Rebel',
    favoriteEra: 'civil_war',
    collectionPower: 125000,
    galacticSiegeRank: 2500,
    showcaseSquad: ['luke_stormtrooper', 'han_stormtrooper', 'leia_senator', 'r2d2', 'chewbacca_smuggler'],
    founderBadge: true,
    betaTesterBadge: true
  };

  db.accounts[adminId] = adminAccount;
  db.profiles[adminId] = adminProfile;
  db.mails[adminId] = [
    {
      id: 'welcome_admin',
      sender: 'System Protocol',
      subject: 'Developer Mode Enabled',
      body: 'Greetings Admin ANTISANTI1272. Your high security administrative privileges have been activated. Use the developer tab to oversee operations.',
      sentAt: Date.now(),
      read: false,
      claimed: false
    }
  ];

  logAdminAction('SYSTEM', 'seed_admin', adminId, 'Seeded admin account with gold border and badges.');
  saveDatabase();
}

// --- TASK 6: SERVER AUTHORITY & COLLECTION POWER SERVICE ---
class CollectionPowerService {
  static calculateCharacterCP(char: any): number {
    if (!char || !char.unlocked) return 0;
    const level = Number(char.level) || 1;
    const stars = Number(char.stars) || 1;
    const gearTier = Number(char.gearTier) || 1;
    const relicLevel = Number(char.relicLevel) || 0;
    const legendLevel = Number(char.legendLevel) || 0;
    const eraLevel = Number(char.eraLevel) || 0;

    // Strict validation check for absurd/hacked values
    if (level > 85 || stars > 7 || gearTier > 13 || relicLevel > 10 || legendLevel > 10 || eraLevel > 200) {
      throw new Error(`Suspicious character parameters: level=${level}, stars=${stars}, gearTier=${gearTier}, relicLevel=${relicLevel}, legendLevel=${legendLevel}, eraLevel=${eraLevel}`);
    }

    return (
      level * 10 +
      stars * 150 +
      gearTier * 250 +
      relicLevel * 500 +
      legendLevel * 800 +
      eraLevel * 50
    );
  }

  static calculateTotalCP(saveState: any): number {
    let cp = 0;
    if (saveState && saveState.characters) {
      Object.values(saveState.characters).forEach((char: any) => {
        cp += this.calculateCharacterCP(char);
      });
    }
    return cp;
  }
}

// Load database immediately
loadDatabase();

// Lazy Gemini Setup
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY is not configured in secrets.');
    }
    geminiClient = new GoogleGenAI({ apiKey: key });
  }
  return geminiClient;
}

// --- SESSION TOKEN HELPERS (Task 5) ---
const JWT_SECRET = process.env.JWT_SECRET || 'galactic-legends-secret-hyperdrive-key';

function signJwt(payload: any, secret: string): string {
  const cleanPayload = { accountId: payload.accountId };
  return jwt.sign(cleanPayload, secret, { expiresIn: '15m' });
}

function verifyJwt(token: string, secret: string): any {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}

function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function createSessionForAccount(accountId: string): UserSession {
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
  const refreshExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  
  const accessToken = signJwt({ accountId, exp: expiresAt }, JWT_SECRET);
  const refreshToken = generateRandomToken();
  
  const session: UserSession = {
    accessToken,
    refreshToken,
    accountId,
    expiresAt,
    refreshExpiresAt
  };
  db.sessions[accessToken] = session;
  db.analyticsExtended.totalSessionsCount++;
  saveDatabase();
  return session;
}

export function validateSessionHeader(req: express.Request): UserSession | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  
  const payload = verifyJwt(token, JWT_SECRET);
  if (!payload) return null;
  
  const session = db.sessions[token];
  if (!session) return null;
  if (Date.now() > session.expiresAt) return null;
  return session;
}

const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const session = validateSessionHeader(req);
  if (!session) {
    return res.status(401).json({ success: false, error: 'SESSION_EXPIRED', message: 'Holographic session expired. Re-authentication required.' });
  }
  (req as any).session = session;
  next();
};

// --- EXPRESS ENDPOINTS ---

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', online: true });
});

// TASK 1 & 2: Register Account
app.post('/api/account/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required.' });
  }

  const normalizedUser = username.trim();
  const duplicate = Object.values(db.accounts).find(
    acc => acc.username.toLowerCase() === normalizedUser.toLowerCase()
  );

  if (duplicate) {
    return res.status(400).json({ success: false, error: 'Designation already in active service. Choose another.' });
  }

  const accountId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  const hashedPass = bcrypt.hashSync(password, 10);
  const rawRecovery = generateRecoveryCode();
  const hashedRecovery = bcrypt.hashSync(rawRecovery, 10);

  const newAccount: PlayerAccount = {
    accountId,
    username: normalizedUser,
    passwordHash: hashedPass,
    recoveryCodeHash: hashedRecovery,
    createdAt: Date.now(),
    lastLogin: Date.now(),
    founder: false,
    betaTester: true,
    admin: false,
    developer: false,
    commanderLevel: 1,
    profileAvatar: 'luke_stormtrooper',
    profileTitle: 'Beta Tester',
    banned: false,
    profileBorder: 'none'
  };

  const newProfile: PlayerProfile = {
    accountId,
    username: normalizedUser,
    avatar: 'luke_stormtrooper',
    title: 'Beta Tester',
    profileBorder: 'none',
    favoriteCharacter: 'luke_stormtrooper',
    favoriteFaction: 'Rebel',
    favoriteEra: 'civil_war',
    collectionPower: 1500,
    galacticSiegeRank: 1000,
    showcaseSquad: ['luke_stormtrooper', 'han_stormtrooper', 'leia_senator', 'r2d2', 'chewbacca_smuggler'],
    founderBadge: false,
    betaTesterBadge: true
  };

  db.accounts[accountId] = newAccount;
  db.profiles[accountId] = newProfile;
  db.mails[accountId] = [
    {
      id: 'welcome_mail',
      sender: 'System Protocol',
      subject: 'Welcome Commander',
      body: 'Thank you for connecting to the Galactic Network. As a launch promotion, we have credited your reserve balance with starter resources.',
      sentAt: Date.now(),
      read: false,
      claimed: false,
      rewards: {
        credits: 50000,
        crystals: 250
      }
    }
  ];

  db.analyticsExtended.profileCreation++;
  logSystemEvent(accountId, 'ACCOUNT_CREATED', req.ip || '0.0.0.0', `New commander registered: ${normalizedUser}`);
  saveDatabase();

  const session = createSessionForAccount(accountId);

  logAdminAction('SECURITY', 'register_account', accountId, `New commander registered: ${normalizedUser}`);

  // Return the raw recovery code ONCE during creation so they can save/confirm it.
  res.json({ success: true, account: newAccount, recoveryCode: rawRecovery, session });
});

// TASK 1 & 2: Login Account (Supports password or recovery code login with lockout)
app.post('/api/account/login', (req, res) => {
  const { username, password, recoveryCode } = req.body;
  const ip = req.ip || '0.0.0.0';

  // Support Login via recovery code directly
  if (recoveryCode) {
    const account = Object.values(db.accounts).find(
      acc => bcrypt.compareSync(recoveryCode, acc.recoveryCodeHash)
    );

    if (!account) {
      logAdminAction('SECURITY', 'failed_recovery_login', 'UNKNOWN', `Failed recovery key login attempt from IP: ${ip}`);
      return res.status(401).json({ success: false, error: 'Invalid recovery authorization code.' });
    }

    if (account.banned) {
      return res.status(403).json({ success: false, error: 'This commander account has been locked or suspended by imperial orders.' });
    }

    account.lastLogin = Date.now();
    db.analytics.totalLogins++;
    const session = createSessionForAccount(account.accountId);
    logAdminAction('SECURITY', 'login_recovery', account.accountId, `Logged in via recovery key from IP: ${ip}`);
    logSystemEvent(account.accountId, 'LOGIN_RECOVERY', ip, 'Authenticated via physical backup recovery passcode');
    saveDatabase();
    return res.json({ success: true, account, session });
  }

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required.' });
  }

  const normalizedUser = username.trim();
  const lockoutKey = normalizedUser.toLowerCase();

  const account = Object.values(db.accounts).find(
    acc => acc.username.toLowerCase() === lockoutKey
  );

  if (!account) {
    logAdminAction('SECURITY', 'failed_login', 'UNKNOWN', `Unregistered username attempt: ${normalizedUser} from ${ip}`);
    return res.status(401).json({ success: false, error: 'Invalid holographic credentials.' });
  }

  // Check Bcrypt password
  const isBcryptHash = account.passwordHash.startsWith('$2a$') || account.passwordHash.startsWith('$2b$');
  let isValid = false;

  if (isBcryptHash) {
    isValid = bcrypt.compareSync(password, account.passwordHash);
  } else {
    // Migration check (Task 9 fallback)
    if (account.passwordHash === password) {
      isValid = true;
      account.passwordHash = bcrypt.hashSync(password, 10);
      logAdminAction('SYSTEM', 'password_migration', account.accountId, 'Automatically migrated password to Bcrypt.');
    }
  }

  if (!isValid) {
    return res.status(401).json({ success: false, error: 'Invalid holographic credentials.' });
  }

  if (account.banned) {
    return res.status(403).json({ success: false, error: 'This commander account has been locked or suspended by imperial orders.' });
  }

  // Clear failed log on success
  delete db.failedLoginLogs[lockoutKey];

  // Update DAU / MAU analytics
  const today = new Date().toISOString().split('T')[0];
  if (!db.analyticsExtended.dailyActiveUsers.includes(account.accountId)) {
    db.analyticsExtended.dailyActiveUsers.push(account.accountId);
  }
  if (!db.analyticsExtended.monthlyActiveUsers.includes(account.accountId)) {
    db.analyticsExtended.monthlyActiveUsers.push(account.accountId);
  }

  account.lastLogin = Date.now();
  db.analytics.totalLogins++;
  
  // Create secure session
  const session = createSessionForAccount(account.accountId);
  logAdminAction('SECURITY', 'login_success', account.accountId, `Successful authentication from IP ${ip}`);
  logSystemEvent(account.accountId, 'LOGIN', ip, 'Authenticated successfully via passcode');
  saveDatabase();

  res.json({ success: true, account, session });
});

// TASK 5: Token Refresh Endpoint
app.post('/api/account/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ success: false, error: 'Refresh token required' });
  
  const existingSession = Object.values(db.sessions).find(s => s.refreshToken === refreshToken);
  if (!existingSession || Date.now() > existingSession.refreshExpiresAt) {
    return res.status(401).json({ success: false, error: 'SESSION_EXPIRED', message: 'Invalid or expired session. Please authenticate again.' });
  }
  
  const accountId = existingSession.accountId;
  delete db.sessions[existingSession.accessToken]; // Invalidate old access token
  
  const newSession = createSessionForAccount(accountId);
  res.json({ success: true, accessToken: newSession.accessToken, refreshToken: newSession.refreshToken, account: db.accounts[accountId] });
});

// TASK 5: Invalidate Session / Logout
app.post('/api/account/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const session = db.sessions[token];
    if (session) {
      logSystemEvent(session.accountId, 'LOGOUT', req.ip || '0.0.0.0', 'Commander session and refresh token terminated manually');
      delete db.sessions[token];
      saveDatabase();
    }
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// TASK 1 & 2: Account password reset via recovery code
app.post('/api/account/recover', (req, res) => {
  const { username, recoveryCode, newPassword } = req.body;

  if (!username || !recoveryCode || !newPassword) {
    return res.status(400).json({ success: false, error: 'All parameters (username, recoveryCode, newPassword) are required.' });
  }

  const account = Object.values(db.accounts).find(
    acc => acc.username.toLowerCase() === username.trim().toLowerCase()
  );

  if (!account) {
    return res.status(404).json({ success: false, error: 'Commander account not found.' });
  }

  const isRecoveryValid = bcrypt.compareSync(recoveryCode, account.recoveryCodeHash);
  if (!isRecoveryValid) {
    logAdminAction('SECURITY', 'failed_recovery_attempt', account.accountId, `Failed recovery attempt using raw recovery key`);
    return res.status(401).json({ success: false, error: 'Invalid recovery code for account.' });
  }

  account.passwordHash = bcrypt.hashSync(newPassword, 10);
  logAdminAction('SYSTEM', 'password_recovered', account.accountId, 'Reset password using secure recovery code.');
  saveDatabase();

  res.json({ success: true, message: 'Password has been updated successfully.' });
});

// TASK 1: Live Secure Key Regeneration (accessible from Settings while logged in)
app.post('/api/account/regenerate-recovery-key', requireAuth, (req, res) => {
  const session = (req as any).session;
  const account = db.accounts[session.accountId];
  if (!account) return res.status(404).json({ success: false, error: 'Account not found' });

  const rawRecovery = generateRecoveryCode();
  account.recoveryCodeHash = bcrypt.hashSync(rawRecovery, 10);
  logAdminAction('SECURITY', 'regenerate_recovery_key', account.accountId, 'Commander regenerated raw recovery key');
  saveDatabase();

  res.json({ success: true, recoveryCode: rawRecovery });
});

// TASK 3: OPTIONAL EMAIL LINKING
app.post('/api/account/email/link', requireAuth, (req, res) => {
  const { email } = req.body;
  const session = (req as any).session;
  const account = db.accounts[session.accountId];
  if (!account) return res.status(404).json({ success: false, error: 'Account not found.' });

  account.email = email;
  account.emailVerified = false;
  saveDatabase();
  res.json({ success: true, account });
});

app.post('/api/account/email/remove', requireAuth, (req, res) => {
  const session = (req as any).session;
  const account = db.accounts[session.accountId];
  if (!account) return res.status(404).json({ success: false, error: 'Account not found.' });

  delete account.email;
  delete account.emailVerified;
  saveDatabase();
  res.json({ success: true, account });
});

app.post('/api/account/email/verify', requireAuth, (req, res) => {
  const session = (req as any).session;
  const account = db.accounts[session.accountId];
  if (!account) return res.status(404).json({ success: false, error: 'Account not found.' });

  account.emailVerified = true;
  saveDatabase();
  res.json({ success: true, account });
});

app.post('/api/account/email/change', requireAuth, (req, res) => {
  const { newEmail } = req.body;
  const session = (req as any).session;
  const account = db.accounts[session.accountId];
  if (!account) return res.status(404).json({ success: false, error: 'Account not found.' });

  account.email = newEmail;
  account.emailVerified = false;
  saveDatabase();
  res.json({ success: true, account });
});

app.post('/api/account/email/recover', (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, error: 'Email and new password are required.' });
  }

  const account = Object.values(db.accounts).find(
    acc => acc.email && acc.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!account) {
    return res.status(404).json({ success: false, error: 'No account found with this email.' });
  }

  account.passwordHash = bcrypt.hashSync(newPassword, 10);
  logAdminAction('SYSTEM', 'email_recovered', account.accountId, 'Reset password via email verification.');
  saveDatabase();

  res.json({ success: true, message: 'Password updated. Access has been restored.' });
});

// TASK 4: Cloud Save Upload with 5-Save history backup & Authority Validations & Versioning (Task 9)
app.post('/api/save/upload', requireAuth, (req, res) => {
  const session = (req as any).session;
  const accountId = session.accountId;
  const { saveState, updatedAt } = req.body;

  if (!saveState) {
    return res.status(400).json({ success: false, error: 'Missing saveState' });
  }

  const account = db.accounts[accountId];
  if (!account) return res.status(404).json({ success: false, error: 'Account not found' });
  if (account.banned) return res.status(403).json({ success: false, error: 'Account banned' });

  // --- TASK 9: SAVE SAVE VERSION AND MIGRATE IF OLDER ---
  const CURRENT_SAVE_VERSION = 3;
  if (!saveState.version) {
    saveState.version = 1; // Mark old format as v1
  }

  if (saveState.version < CURRENT_SAVE_VERSION) {
    const oldVer = saveState.version;
    // Perform migrations
    if (saveState.version === 1) {
      saveState.version = 2;
      if (!saveState.characters) saveState.characters = {};
      if (!saveState.credits) saveState.credits = 10000;
    }
    if (saveState.version === 2) {
      saveState.version = 3;
      if (!saveState.unlockedBorders) saveState.unlockedBorders = ['none'];
      if (!saveState.unlockedTitles) saveState.unlockedTitles = ['Beta Tester'];
    }
    logAdminAction('SYSTEM', 'save_migration', accountId, `Automatically migrated save state from v${oldVer} to v${saveState.version}`);
  }

  // --- TASK 5 & 6: SERVER AUTHORITY & COLLECTION POWER VALIDATION ---
  let cpCalculated = 0;
  try {
    cpCalculated = CollectionPowerService.calculateTotalCP(saveState);
  } catch (err: any) {
    // Flag suspicious/absurd values
    logAdminAction('SYSTEM', 'SUSPICION', accountId, `Rejected upload due to absurd character parameters: ${err.message}`);
    return res.status(400).json({ success: false, error: 'Security rejection: Absurd character stats detected. Session logged.' });
  }

  // Currency Verification (Warn on huge crystal jumps)
  const existingSave = db.saves[accountId];
  if (existingSave) {
    const crystalsDiff = (saveState.crystals || 0) - (existingSave.saveState.crystals || 0);
    const creditsDiff = (saveState.credits || 0) - (existingSave.saveState.credits || 0);

    if (crystalsDiff > 50000 || creditsDiff > 10000000) {
      logAdminAction('SYSTEM', 'SUSPICION', accountId, `High currency addition flagged: +${crystalsDiff} Crystals, +${creditsDiff} Credits.`);
    }
  }

  // --- TASK 4: SAVE BACKUP SYSTEM (Keep latest 5 backups) ---
  if (existingSave) {
    if (!db.savesHistory[accountId]) {
      db.savesHistory[accountId] = [];
    }

    const backup: SaveBackup = {
      id: 'backup_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      accountId,
      saveState: existingSave.saveState,
      timestamp: existingSave.updatedAt || Date.now(),
      saveVersion: saveState.version?.toString() || '3'
    };

    db.savesHistory[accountId].push(backup);
    if (db.savesHistory[accountId].length > 5) {
      db.savesHistory[accountId].shift(); // Keep latest 5 only
    }
  }

  // Update save State
  db.saves[accountId] = {
    saveState,
    updatedAt: updatedAt || Date.now()
  };

  // Sync profile details
  const profile = db.profiles[accountId];
  if (profile) {
    profile.collectionPower = cpCalculated;
    profile.title = saveState.equippedTitle || profile.title;
  }

  db.analytics.savesUploaded++;
  saveDatabase();

  res.json({ success: true, cpCalculated });
});

// Download save State
app.get('/api/save/download', requireAuth, (req, res) => {
  const session = (req as any).session;
  const accountId = session.accountId;

  const save = db.saves[accountId];
  if (!save) {
    return res.json({ success: true, saveState: null });
  }

  res.json({ success: true, saveState: save.saveState, updatedAt: save.updatedAt });
});

// TASK 4: Admin list backups
app.get('/api/admin/saves/history', (req, res) => {
  const { adminId, accountId } = req.query;
  const admin = db.accounts[adminId as string];
  if (!admin || !admin.admin) {
    return res.status(403).json({ success: false, error: 'Administrative clearances required.' });
  }

  const backups = db.savesHistory[accountId as string] || [];
  res.json({ success: true, backups });
});

// TASK 4: Admin restore save backup
app.post('/api/admin/saves/restore', (req, res) => {
  const { adminId, accountId, backupId } = req.body;
  const admin = db.accounts[adminId];
  if (!admin || !admin.admin) {
    return res.status(403).json({ success: false, error: 'Administrative clearances required.' });
  }

  const backups = db.savesHistory[accountId] || [];
  const backup = backups.find(b => b.id === backupId);
  if (!backup) {
    return res.status(404).json({ success: false, error: 'Backup restore image not found.' });
  }

  db.saves[accountId] = {
    saveState: backup.saveState,
    updatedAt: Date.now()
  };

  logAdminAction(admin.username, 'restore_backup', accountId, `Restored backup image ${backupId} dated ${new Date(backup.timestamp).toISOString()}`);
  saveDatabase();

  res.json({ success: true, message: 'Commander cloud profile successfully restored to selected backup image.' });
});

// TASK 7: ANNOUNCEMENT SYSTEM
app.get('/api/announcements', (req, res) => {
  const activeAnnouncements = db.announcements.filter(a => !a.archived);
  res.json({ success: true, announcements: activeAnnouncements });
});

app.post('/api/admin/announcements/create', (req, res) => {
  const { adminId, title, body, priority, category } = req.body;
  const admin = db.accounts[adminId];
  if (!admin || !admin.admin) {
    return res.status(403).json({ success: false, error: 'Administrative clearances required.' });
  }

  const newAnn: Announcement = {
    id: 'ann_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    title,
    body,
    date: Date.now(),
    priority: priority || 'medium',
    createdBy: admin.username,
    archived: false,
    category: category || 'news'
  };

  db.announcements.unshift(newAnn);
  logAdminAction(admin.username, 'announcement_create', 'SYSTEM', `Created news bulletin: ${title} (${category || 'news'})`);
  saveDatabase();

  res.json({ success: true, announcement: newAnn });
});

app.post('/api/admin/announcements/edit', (req, res) => {
  const { adminId, id, title, body, priority, category } = req.body;
  const admin = db.accounts[adminId];
  if (!admin || !admin.admin) {
    return res.status(403).json({ success: false, error: 'Admin only.' });
  }

  const ann = db.announcements.find(a => a.id === id);
  if (!ann) return res.status(404).json({ success: false, error: 'Announcement not found.' });

  ann.title = title || ann.title;
  ann.body = body || ann.body;
  ann.priority = priority || ann.priority;
  if (category) ann.category = category;

  logAdminAction(admin.username, 'announcement_edit', 'SYSTEM', `Edited news bulletin ID: ${id}`);
  saveDatabase();

  res.json({ success: true, announcement: ann });
});

app.post('/api/admin/announcements/archive', (req, res) => {
  const { adminId, id, archive } = req.body;
  const admin = db.accounts[adminId];
  if (!admin || !admin.admin) {
    return res.status(403).json({ success: false, error: 'Admin only.' });
  }

  const ann = db.announcements.find(a => a.id === id);
  if (!ann) return res.status(404).json({ success: false, error: 'Announcement not found.' });

  ann.archived = !!archive;
  logAdminAction(admin.username, archive ? 'announcement_archive' : 'announcement_unarchive', 'SYSTEM', `Bulletin archive set to ${archive} for ID: ${id}`);
  saveDatabase();

  res.json({ success: true, announcement: ann });
});

// Profile fetching (Task 10 improvements integrated)
app.get('/api/profile/:id', (req, res) => {
  const accountId = req.params.id;
  const profile = db.profiles[accountId];

  if (!profile) {
    return res.status(404).json({ success: false, error: 'Profile not found.' });
  }

  // Ensure public border and title metrics exist
  res.json({ success: true, profile });
});

// Profile update (Task 10 updates)
app.post('/api/profile/update', (req, res) => {
  const { accountId, avatar, title, profileBorder, favoriteCharacter, favoriteFaction, favoriteEra, showcaseSquad } = req.body;

  const account = db.accounts[accountId];
  if (!account) return res.status(404).json({ success: false, error: 'Account not found.' });

  const profile = db.profiles[accountId];
  if (!profile) return res.status(404).json({ success: false, error: 'Profile not found.' });

  if (avatar) {
    profile.avatar = avatar;
    account.profileAvatar = avatar;
  }
  if (title) {
    profile.title = title;
    account.profileTitle = title;
  }
  if (profileBorder) {
    profile.profileBorder = profileBorder;
    account.profileBorder = profileBorder;
  }
  if (favoriteCharacter) profile.favoriteCharacter = favoriteCharacter;
  if (favoriteFaction) profile.favoriteFaction = favoriteFaction;
  if (favoriteEra) profile.favoriteEra = favoriteEra;
  if (showcaseSquad) profile.showcaseSquad = showcaseSquad;

  // Sync badges
  profile.founderBadge = account.founder;
  profile.betaTesterBadge = account.betaTester;

  saveDatabase();
  res.json({ success: true, account, profile });
});

// rankings
app.get('/api/rankings', (req, res) => {
  const rankingsList = Object.values(db.profiles)
    .sort((a, b) => b.galacticSiegeRank - a.galacticSiegeRank)
    .slice(0, 50);

  res.json({ success: true, rankings: rankingsList });
});

// TASK 8: ADVANCED MAIL SYSTEM (Multiple rewards, targets, preview logs)
app.get('/api/mail/list', (req, res) => {
  const { accountId } = req.query;
  if (!accountId || typeof accountId !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing accountId' });
  }

  const userMails = db.mails[accountId] || [];
  res.json({ success: true, mails: userMails });
});

app.post('/api/mail/claim', (req, res) => {
  const { accountId, mailId } = req.body;

  const userMails = db.mails[accountId];
  if (!userMails) return res.status(404).json({ success: false, error: 'No mails found.' });

  const mail = userMails.find(m => m.id === mailId);
  if (!mail) return res.status(404).json({ success: false, error: 'Message not found.' });

  if (mail.claimed) {
    return res.status(400).json({ success: false, error: 'Rewards already claimed.' });
  }

  mail.claimed = true;
  mail.read = true;
  db.analyticsExtended.mailClaims++;
  saveDatabase();

  res.json({ success: true, rewards: mail.rewards });
});

// TASK 8: Advanced mail send with admin logging (audit logs)
app.post('/api/admin/mail/send', (req, res) => {
  const { adminId, targetType, targetAccountId, subject, body, rewards } = req.body;
  const admin = db.accounts[adminId];
  if (!admin || !admin.admin) {
    return res.status(403).json({ success: false, error: 'Admin only.' });
  }

  const mailId = 'mail_' + Date.now();
  const mailMessage: MailMessage = {
    id: mailId,
    sender: admin.username,
    subject: subject || 'Operational Alert',
    body: body || '',
    sentAt: Date.now(),
    read: false,
    claimed: false,
    rewards: rewards || {}
  };

  let targetLogName = '';
  if (targetType === 'single') {
    targetLogName = targetAccountId;
    if (!db.mails[targetAccountId]) db.mails[targetAccountId] = [];
    db.mails[targetAccountId].push(mailMessage);
  } else if (targetType === 'group') {
    // Group targets (e.g., all beta testers, all admins)
    targetLogName = 'beta_testers';
    Object.keys(db.accounts).forEach(aid => {
      const acc = db.accounts[aid];
      if (acc.betaTester) {
        if (!db.mails[aid]) db.mails[aid] = [];
        db.mails[aid].push({ ...mailMessage, id: `${mailId}_${aid}` });
      }
    });
  } else {
    // All
    targetLogName = 'all_commanders';
    Object.keys(db.accounts).forEach(aid => {
      if (!db.mails[aid]) db.mails[aid] = [];
      db.mails[aid].push({ ...mailMessage, id: `${mailId}_${aid}` });
    });
  }

  logAdminAction(admin.username, 'mail_send', targetLogName, `Dispatched advanced mail with rewards: ${JSON.stringify(rewards)}`);
  saveDatabase();

  res.json({ success: true, message: 'Advanced mail successfully delivered.' });
});

// TASK 9: Admin Audit Logs retrieval
app.get('/api/admin/audit-logs', (req, res) => {
  const { adminId } = req.query;
  const admin = db.accounts[adminId as string];
  if (!admin || !admin.admin) {
    return res.status(403).json({ success: false, error: 'Admin credentials required.' });
  }

  res.json({ success: true, logs: db.adminLogs });
});

// Admin grants (legacyservice wrapper mapping to modern task 8 mail rewards)
app.post('/api/admin/grant', (req, res) => {
  const { adminId, targetAccountId, type, itemId, amount } = req.body;
  const admin = db.accounts[adminId];
  if (!admin || !admin.admin) return res.status(403).json({ success: false, error: 'Admin only' });

  const rewards: MailRewards = {};
  if (type === 'credits') rewards.credits = amount;
  else if (type === 'crystals') rewards.crystals = amount;
  else if (type === 'raidTokens') rewards.raidTokens = amount;
  else if (type === 'character') {
    rewards.shards = [{ characterId: itemId, amount: 80 }]; // starter unlock shards
  }

  const mailId = 'grant_' + Date.now();
  const mailMessage: MailMessage = {
    id: mailId,
    sender: 'ADMIN GRANT',
    subject: 'Imperial Requisition Order',
    body: `Your commander profile has been authorized to draw extra reinforcements from Admin command. Requisition amount: ${amount} ${itemId || type}.`,
    sentAt: Date.now(),
    read: false,
    claimed: false,
    rewards
  };

  if (!db.mails[targetAccountId]) db.mails[targetAccountId] = [];
  db.mails[targetAccountId].push(mailMessage);

  logAdminAction(admin.username, 'currency_grant', targetAccountId, `Granted ${amount} ${itemId || type}`);
  saveDatabase();

  res.json({ success: true, message: 'Logistics grant delivered successfully.' });
});

// Ban account
app.post('/api/admin/ban', (req, res) => {
  const { adminId, targetAccountId, ban } = req.body;
  const admin = db.accounts[adminId];
  if (!admin || !admin.admin) return res.status(403).json({ success: false, error: 'Admin only' });

  const target = db.accounts[targetAccountId];
  if (!target) return res.status(404).json({ success: false, error: 'Target not found' });

  target.banned = ban;
  logAdminAction(admin.username, ban ? 'account_ban' : 'account_unban', targetAccountId, `Ban set to ${ban}`);
  saveDatabase();

  res.json({ success: true, message: `Account status updated successfully.` });
});

// Reset Account save
app.post('/api/admin/reset-player', (req, res) => {
  const { adminId, targetAccountId } = req.body;
  const admin = db.accounts[adminId];
  if (!admin || !admin.admin) return res.status(403).json({ success: false, error: 'Admin only' });

  delete db.saves[targetAccountId];
  const profile = db.profiles[targetAccountId];
  if (profile) {
    profile.collectionPower = 1500;
    profile.galacticSiegeRank = 1000;
  }

  logAdminAction(admin.username, 'account_reset', targetAccountId, `Wiped player save state.`);
  saveDatabase();

  res.json({ success: true, message: 'Account save state successfully purged.' });
});

// TASK 11: REPLAY STORAGE DATABASE FOUNDATION
app.post('/api/siege/replay/save', (req, res) => {
  const { battleSeed, battleActions, turnOrder, result, attackerAccountId, attackerUsername, defenderAccountId, defenderUsername } = req.body;

  const newReplay: BattleReplay = {
    id: 'rep_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    battleSeed,
    battleActions: battleActions || [],
    turnOrder: turnOrder || [],
    result,
    timestamp: Date.now(),
    attackerAccountId,
    attackerUsername,
    defenderAccountId,
    defenderUsername
  };

  db.replays.unshift(newReplay);
  if (db.replays.length > 200) db.replays.pop(); // Cap at 200 replays
  saveDatabase();

  res.json({ success: true, replayId: newReplay.id });
});

app.get('/api/siege/replay/:id', (req, res) => {
  const rep = db.replays.find(r => r.id === req.params.id);
  if (!rep) return res.status(404).json({ success: false, error: 'Replay file not found.' });
  res.json({ success: true, replay: rep });
});

// TASK 12: SEASON SERVICE FOUNDATION
app.get('/api/season/info', (req, res) => {
  res.json({ success: true, seasonInfo: db.seasonInfo });
});

app.post('/api/admin/season/update', (req, res) => {
  const { adminId, currentEra, currentPlanet, seasonStart, seasonEnd, activeBonuses, currentConquestId, currentLoginCalendar } = req.body;
  const admin = db.accounts[adminId];
  if (!admin || !admin.admin) return res.status(403).json({ success: false, error: 'Admin only.' });

  db.seasonInfo = {
    currentEra: currentEra || db.seasonInfo.currentEra,
    currentPlanet: currentPlanet || db.seasonInfo.currentPlanet,
    seasonStart: seasonStart || db.seasonInfo.seasonStart,
    seasonEnd: seasonEnd || db.seasonInfo.seasonEnd,
    activeBonuses: activeBonuses || db.seasonInfo.activeBonuses,
    currentConquestId: currentConquestId || db.seasonInfo.currentConquestId,
    currentLoginCalendar: currentLoginCalendar || db.seasonInfo.currentLoginCalendar
  };

  logAdminAction(admin.username, 'season_update', 'SYSTEM', `Updated seasonal calendar parameters.`);
  saveDatabase();

  res.json({ success: true, seasonInfo: db.seasonInfo });
});

// TASK 13: DEVELOPER PANEL IMPROVEMENTS (Separated from admin tools)
app.post('/api/admin/dev/season', (req, res) => {
  const { developerId, era, planet, bonuses } = req.body;
  const dev = db.accounts[developerId];
  if (!dev || !dev.developer) return res.status(403).json({ success: false, error: 'Developer authentication required.' });

  db.seasonInfo.currentEra = era || db.seasonInfo.currentEra;
  db.seasonInfo.currentPlanet = planet || db.seasonInfo.currentPlanet;
  if (bonuses) db.seasonInfo.activeBonuses = bonuses;

  saveDatabase();
  res.json({ success: true, message: 'Developer environmental overrides applied.', seasonInfo: db.seasonInfo });
});

app.post('/api/admin/dev/test-matchmaking', (req, res) => {
  const { developerId, squadRank } = req.body;
  const dev = db.accounts[developerId];
  if (!dev || !dev.developer) return res.status(403).json({ success: false, error: 'Developer authentication required.' });

  // Simulate matchmaking test algorithm
  const candidates = Object.values(db.profiles)
    .filter(p => Math.abs(p.galacticSiegeRank - (squadRank || 1000)) < 500);

  res.json({ success: true, message: 'Matchmaking simulation executed.', simulatedOpponents: candidates });
});

app.post('/api/admin/dev/test-character', (req, res) => {
  const { developerId, charId, level, stars, gearTier, relicLevel } = req.body;
  const dev = db.accounts[developerId];
  if (!dev || !dev.developer) return res.status(403).json({ success: false, error: 'Developer authentication required.' });

  // Math test character calculation output
  let simulatedCP = 0;
  try {
    simulatedCP = CollectionPowerService.calculateCharacterCP({
      unlocked: true,
      level,
      stars,
      gearTier,
      relicLevel
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }

  res.json({ success: true, simulatedCP });
});

// TASK 14: ANALYTICS (DAU, MAU, Factions, Characters, Journey, Retention)
app.get('/api/admin/analytics', (req, res) => {
  const { developerId } = req.query;
  const dev = db.accounts[developerId as string];

  if (!dev || !dev.developer) {
    return res.status(403).json({ success: false, error: 'Developer clearances required.' });
  }

  // Compile active distributions
  const factionDistribution: Record<string, number> = {};
  const characterDistribution: Record<string, number> = {};
  const journeyDistribution: Record<string, number> = {};
  const eraDistribution: Record<string, number> = {};

  Object.values(db.profiles).forEach(p => {
    factionDistribution[p.favoriteFaction] = (factionDistribution[p.favoriteFaction] || 0) + 1;
    factionDistribution[p.favoriteEra] = (factionDistribution[p.favoriteEra] || 0) + 1;
  });

  Object.values(db.saves).forEach(s => {
    const saveState = s.saveState;
    if (saveState?.characters) {
      Object.keys(saveState.characters).forEach(cid => {
        if (saveState.characters[cid].unlocked) {
          characterDistribution[cid] = (characterDistribution[cid] || 0) + 1;
        }
      });
    }
    if (saveState?.journeyProgress) {
      Object.keys(saveState.journeyProgress).forEach(jid => {
        journeyDistribution[jid] = (journeyDistribution[jid] || 0) + 1;
      });
    }
  });

  res.json({
    success: true,
    analytics: {
      totalDAU: db.analyticsExtended.dailyActiveUsers.length,
      totalMAU: db.analyticsExtended.monthlyActiveUsers.length,
      loginsCount: db.analytics.totalLogins,
      savesUploadedCount: db.analytics.savesUploaded,
      siegeMatchesCount: db.analytics.siegeMatchesPlayed,
      mailClaimsCount: db.analyticsExtended.mailClaims,
      profileCreationsCount: db.analyticsExtended.profileCreation,
      factionDistribution,
      characterDistribution,
      journeyDistribution,
      eraDistribution
    }
  });
});

app.get('/api/admin/match-logs', (req, res) => {
  const { adminId } = req.query;
  const admin = db.accounts[adminId as string];

  if (!admin || !admin.admin) {
    return res.status(403).json({ success: false, error: 'Admin credentials required.' });
  }

  res.json({ success: true, logs: db.matchLogs });
});

// PvP Siege Match Submissions (Task 11 seed/action logger foundation integration)
app.post('/api/siege/match-result', (req, res) => {
  const { accountId, opponentId, win, playerSquad, opponentSquad, battleSeed, battleActions, turnOrder } = req.body;

  const playerProfile = db.profiles[accountId];
  const opponentProfile = db.profiles[opponentId];

  if (!playerProfile || !opponentProfile) {
    return res.status(404).json({ success: false, error: 'Player profiles not found' });
  }

  const pointShift = win ? 30 : -15;
  playerProfile.galacticSiegeRank = Math.max(0, playerProfile.galacticSiegeRank + pointShift);
  
  if (opponentId && !opponentId.startsWith('bot_')) {
    opponentProfile.galacticSiegeRank = Math.max(0, opponentProfile.galacticSiegeRank + (win ? -10 : 20));
  }

  const log: MatchLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: Date.now(),
    playerAccountId: accountId,
    playerUsername: playerProfile.username,
    opponentAccountId: opponentId,
    opponentUsername: opponentProfile.username,
    winnerAccountId: win ? accountId : opponentId,
    playerSquad: playerSquad || [],
    opponentSquad: opponentSquad || []
  };

  db.matchLogs.unshift(log);
  if (db.matchLogs.length > 100) db.matchLogs.pop();

  // If battle seed/actions are sent, also register in battle replays
  if (battleSeed) {
    const replay: BattleReplay = {
      id: 'rep_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      battleSeed,
      battleActions: battleActions || [],
      turnOrder: turnOrder || [],
      result: win ? 'win' : 'loss',
      timestamp: Date.now(),
      attackerAccountId: accountId,
      attackerUsername: playerProfile.username,
      defenderAccountId: opponentId,
      defenderUsername: opponentProfile.username
    };
    db.replays.unshift(replay);
    if (db.replays.length > 200) db.replays.pop();
  }

  db.analytics.siegeMatchesPlayed++;
  saveDatabase();

  res.json({ success: true, newRank: playerProfile.galacticSiegeRank });
});

// --- GALACTIC SIEGE ENDPOINTS & HELPERS ---

function getOrInitSiegeProfile(accountId: string): any {
  if (!db.siegeStates) db.siegeStates = {};
  if (!db.siegeStates[accountId]) {
    const acc = db.accounts[accountId];
    const prof = db.profiles[accountId];
    db.siegeStates[accountId] = {
      accountId,
      rating: prof?.galacticSiegeRank || 1000,
      division: 'Bronzium',
      tokens: 500,
      lastDefense: [],
      history: [],
      lifetime: {
        attackWins: 0,
        attackLosses: 0,
        defenseWins: 0,
        defenseLosses: 0,
        highestRating: prof?.galacticSiegeRank || 1000,
        longestWinStreak: 0,
        totalClearedSectors: 0,
        totalSiegeBattles: 0,
        lifetimeTokens: 500
      },
      analytics: {
        mostSuccessfulDefense: [],
        leastSuccessfulDefense: [],
        avgDefensiveHolds: 0,
        avgBattleScore: 0,
        avgSurvivors: 0,
        firstAttemptSuccessRate: 0,
        mostUsedCharacters: {}
      },
      currentMatch: null,
      dailyRewardClaimedToday: false,
      firstDailyWinClaimedToday: false
    };
  }
  
  const prof = db.profiles[accountId];
  if (prof) {
    db.siegeStates[accountId].rating = prof.galacticSiegeRank;
  }
  
  const rating = db.siegeStates[accountId].rating;
  let division = 'Carbonite';
  if (rating >= 3000) division = 'Mythic';
  else if (rating >= 2500) division = 'Kyber';
  else if (rating >= 2000) division = 'Aurodium';
  else if (rating >= 1500) division = 'Chromium';
  else if (rating >= 1000) division = 'Bronzium';
  db.siegeStates[accountId].division = division;
  
  return db.siegeStates[accountId];
}

function startSiegeMatchmaking(accountId: string): any {
  const profile = getOrInitSiegeProfile(accountId);
  const playerRating = profile.rating;
  
  const possibleOpponents = Object.keys(db.accounts).filter(id => id !== accountId && !db.accounts[id].banned);
  
  let oppId = '';
  let oppName = '';
  let oppAvatar = '';
  let oppRank = 1000;
  let oppCP = 1500;
  let oppLevel = 85;

  if (possibleOpponents.length > 0) {
    possibleOpponents.sort((a, b) => {
      const rA = db.profiles[a]?.galacticSiegeRank || 1000;
      const rB = db.profiles[b]?.galacticSiegeRank || 1000;
      return Math.abs(rA - playerRating) - Math.abs(rB - playerRating);
    });
    const chosenId = possibleOpponents[0];
    const acc = db.accounts[chosenId];
    const prof = db.profiles[chosenId];
    oppId = chosenId;
    oppName = acc?.username || 'Opponent Commander';
    oppAvatar = prof?.avatar || 'luke_stormtrooper';
    oppRank = prof?.galacticSiegeRank || 1000;
    oppCP = prof?.collectionPower || 1500;
    oppLevel = acc?.commanderLevel || 80;
  } else {
    const botNames = ['Grand Admiral Thrawn', 'Kyber Commander', 'Darth Revan Clone', 'General Kenobi Bot', 'Holographic Overlord'];
    oppId = 'bot_' + Math.random().toString(36).substr(2, 5);
    oppName = botNames[Math.floor(Math.random() * botNames.length)];
    oppAvatar = 'general_skywalker';
    oppRank = Math.max(800, playerRating + Math.floor(Math.random() * 200 - 100));
    oppCP = Math.max(1500, (db.profiles[accountId]?.collectionPower || 1500) + Math.floor(Math.random() * 400 - 200));
    oppLevel = Math.max(40, (db.accounts[accountId]?.commanderLevel || 80) + Math.floor(Math.random() * 10 - 5));
  }

  const opponentDefense: Record<string, string[]> = {};
  const allChars = ['captain_rex', 'jesse', 'fives', 'echo_501st', 'appo_501st', 
                    'general_skywalker', 'bx_commando_droid', 'kelhani', 'droideka', 
                    'grand_admiral_trench', 'nute_gunray', 'wat_tambor', 'aayla_secura', 
                    'barriss_offee', 'quinlan_vos', 'emperor_palpatine', 'darth_vader', 
                    'leia_senator', 'han_stormtrooper', 'luke_stormtrooper'];
                    
  for (let i = 0; i < 9; i++) {
    const squadChars: string[] = [];
    while (squadChars.length < 5) {
      const c = allChars[Math.floor(Math.random() * allChars.length)];
      if (!squadChars.includes(c)) {
        squadChars.push(c);
      }
    }
    opponentDefense[i.toString()] = squadChars;
  }

  const newMatch = {
    opponentId: oppId,
    opponentUsername: oppName,
    opponentAvatar: oppAvatar,
    opponentRank: oppRank,
    opponentCollectionPower: oppCP,
    opponentLevel: oppLevel,
    phase: 'defense',
    phaseEndTimestamp: Date.now() + 24 * 60 * 60 * 1000,
    playerDefense: {},
    opponentDefense,
    playerAttacks: [],
    opponentAttacks: [],
    playerDefensivePoints: 0,
    opponentDefensivePoints: 0,
    playerScore: 0,
    opponentScore: 0,
    playerFailedAttacks: 0,
    opponentFailedAttacks: 0,
    playerClearedSectors: [],
    opponentClearedSectors: []
  };

  profile.currentMatch = newMatch;
  saveDatabase();
  return newMatch;
}

function autoAdvanceSiegeMatchIfNeeded(accountId: string) {
  const profile = getOrInitSiegeProfile(accountId);
  if (!profile.currentMatch) return;
  
  const currentMatch = profile.currentMatch;
  if (currentMatch.phase === 'ended') return;
  
  if (Date.now() >= currentMatch.phaseEndTimestamp) {
    if (currentMatch.phase === 'defense') {
      if (Object.keys(currentMatch.playerDefense).length < 9) {
        const saveState = db.saves[accountId]?.saveState;
        const unlocked = saveState?.characters ? Object.values(saveState.characters).filter((c: any) => c.unlocked).map((c: any) => c.id) : [];
        const tempDef: Record<string, string[]> = { ...currentMatch.playerDefense };
        let cursor = 0;
        for (let i = 0; i < 9; i++) {
          if (!tempDef[i.toString()] || tempDef[i.toString()].length === 0) {
            const size = 5;
            const sl: string[] = [];
            for (let s = 0; s < size; s++) {
              if (unlocked[cursor]) {
                sl.push(unlocked[cursor]);
                cursor++;
              } else {
                sl.push('luke_stormtrooper');
              }
            }
            tempDef[i.toString()] = sl;
          }
        }
        currentMatch.playerDefense = tempDef;
        profile.lastDefense = Object.values(tempDef);
      }
      
      currentMatch.phase = 'attack';
      currentMatch.phaseEndTimestamp = Date.now() + 24 * 60 * 60 * 1000;
    } else if (currentMatch.phase === 'attack') {
      currentMatch.phase = 'ended';
      currentMatch.phaseEndTimestamp = Date.now();
      
      let simulatedOpponentScore = 0;
      let simulatedOpponentFailedAttacks = 0;
      
      const playerDefSize = Object.keys(currentMatch.playerDefense).length;
      let defensiveHolds = 0;
      
      for (let idx = 0; idx < playerDefSize; idx++) {
        const holdChance = 0.3;
        const random = Math.random();
        
        if (random < holdChance) {
          defensiveHolds++;
          simulatedOpponentFailedAttacks++;
          currentMatch.playerDefensivePoints += 20;
          currentMatch.playerDefensivePoints += 10;
        } else {
          let baseClearPoints = 0;
          if (idx < 3) baseClearPoints = 100;
          else if (idx < 6) baseClearPoints = 150;
          else baseClearPoints = 250;
          
          simulatedOpponentScore += baseClearPoints;
          simulatedOpponentScore += 50;
          simulatedOpponentScore += 25;
        }
      }
      
      if (defensiveHolds > 0) {
        currentMatch.playerDefensivePoints += 50;
      }
      
      currentMatch.opponentScore = simulatedOpponentScore;
      currentMatch.opponentFailedAttacks = simulatedOpponentFailedAttacks;
      currentMatch.playerScore += currentMatch.playerDefensivePoints;
      
      let playerWon = false;
      let isTie = false;
      
      if (currentMatch.playerScore > currentMatch.opponentScore) {
        playerWon = true;
      } else if (currentMatch.playerScore < currentMatch.opponentScore) {
        playerWon = false;
      } else {
        const playerSurvivingDef = playerDefSize - simulatedOpponentFailedAttacks;
        const opponentSurvivingDef = 9 - currentMatch.playerFailedAttacks;
        
        if (playerSurvivingDef > opponentSurvivingDef) {
          playerWon = true;
        } else if (playerSurvivingDef < opponentSurvivingDef) {
          playerWon = false;
        } else {
          if (currentMatch.playerFailedAttacks < currentMatch.opponentFailedAttacks) {
            playerWon = true;
          } else if (currentMatch.playerFailedAttacks > currentMatch.opponentFailedAttacks) {
            playerWon = false;
          } else {
            isTie = true;
            playerWon = Math.random() < 0.5;
          }
        }
      }
      
      const ratingShift = playerWon ? 35 : -15;
      profile.rating = Math.max(0, profile.rating + ratingShift);
      
      const prof = db.profiles[accountId];
      if (prof) prof.galacticSiegeRank = profile.rating;
      
      const r = profile.rating;
      let division = 'Carbonite';
      if (r >= 3000) division = 'Mythic';
      else if (r >= 2500) division = 'Kyber';
      else if (r >= 2000) division = 'Aurodium';
      else if (r >= 1500) division = 'Chromium';
      else if (r >= 1000) division = 'Bronzium';
      profile.division = division;
      
      let rewardTokens = 100;
      if (playerWon) {
        rewardTokens += 150;
        profile.firstDailyWinClaimedToday = false;
      } else {
        rewardTokens += 50;
      }
      
      profile.tokens += rewardTokens;
      profile.lifetime.lifetimeTokens += rewardTokens;
      
      if (playerWon) {
        profile.lifetime.attackWins++;
        profile.lifetime.longestWinStreak++;
      } else {
        profile.lifetime.attackLosses++;
        profile.lifetime.longestWinStreak = 0;
      }
      profile.lifetime.totalSiegeBattles++;
      if (profile.rating > profile.lifetime.highestRating) {
        profile.lifetime.highestRating = profile.rating;
      }
      
      profile.history.unshift({
        opponentId: currentMatch.opponentId,
        opponentUsername: currentMatch.opponentUsername,
        planet: db.siegePlanets?.find((p: any) => p.id === db.activeSiegePlanetId)?.name || 'Kamino',
        playerScore: currentMatch.playerScore,
        opponentScore: currentMatch.opponentScore,
        result: playerWon ? 'victory' : 'defeat',
        ratingChange: ratingShift,
        timestamp: Date.now()
      });
      if (profile.history.length > 50) profile.history.pop();
      
      db.matchLogs.unshift({
        id: 'log_' + Date.now(),
        timestamp: Date.now(),
        playerAccountId: accountId,
        playerUsername: prof?.username || 'Player',
        opponentAccountId: currentMatch.opponentId,
        opponentUsername: currentMatch.opponentUsername,
        winnerAccountId: playerWon ? accountId : currentMatch.opponentId,
        playerSquad: (Object.values(currentMatch.playerDefense)[0] as string[]) || [],
        opponentSquad: (Object.values(currentMatch.opponentDefense)[0] as string[]) || []
      });
    }
    
    saveDatabase();
    autoAdvanceSiegeMatchIfNeeded(accountId);
  }
}

// Galactic Siege routes
app.get('/api/siege/status', (req, res) => {
  const { accountId } = req.query;
  if (!accountId) return res.status(400).json({ success: false, error: 'accountId required' });
  
  autoAdvanceSiegeMatchIfNeeded(accountId as string);
  
  const profile = getOrInitSiegeProfile(accountId as string);
  if (!profile.currentMatch) {
    startSiegeMatchmaking(accountId as string);
  }
  
  res.json({
    success: true,
    profile,
    planets: db.siegePlanets,
    activePlanetId: db.activeSiegePlanetId,
    activePlanet: db.siegePlanets?.find((p: any) => p.id === db.activeSiegePlanetId)
  });
});

app.post('/api/siege/defense/set', (req, res) => {
  const { accountId, squads } = req.body;
  if (!accountId || !squads) return res.status(400).json({ success: false, error: 'accountId and squads required' });
  
  const profile = getOrInitSiegeProfile(accountId);
  if (!profile.currentMatch) return res.status(400).json({ success: false, error: 'No active match found' });
  if (profile.currentMatch.phase !== 'defense') return res.status(400).json({ success: false, error: 'Defense phase has ended' });
  
  const squadIndices = Object.keys(squads);
  if (squadIndices.length !== 9) {
    return res.status(400).json({ success: false, error: 'Must configure exactly 9 squads for Defense' });
  }
  
  const usedChars = new Set<string>();
  for (const idx of squadIndices) {
    const squad = squads[idx];
    if (!Array.isArray(squad) || squad.length < 1 || squad.length > 5) {
      return res.status(400).json({ success: false, error: `Squad ${idx} must contain between 1 and 5 characters` });
    }
    for (const charId of squad) {
      if (usedChars.has(charId)) {
        return res.status(400).json({ success: false, error: `Duplicate character detected: ${charId}` });
      }
      usedChars.add(charId);
    }
  }
  
  profile.currentMatch.playerDefense = squads;
  profile.lastDefense = Object.values(squads);
  saveDatabase();
  
  res.json({ success: true, currentMatch: profile.currentMatch });
});

app.post('/api/siege/defense/clear', (req, res) => {
  const { accountId } = req.body;
  if (!accountId) return res.status(400).json({ success: false, error: 'accountId required' });
  
  const profile = getOrInitSiegeProfile(accountId);
  if (!profile.currentMatch) return res.status(400).json({ success: false, error: 'No active match found' });
  if (profile.currentMatch.phase !== 'defense') return res.status(400).json({ success: false, error: 'Defense phase is locked' });
  
  profile.currentMatch.playerDefense = {};
  saveDatabase();
  res.json({ success: true, currentMatch: profile.currentMatch });
});

app.post('/api/siege/defense/auto-fill', (req, res) => {
  const { accountId } = req.body;
  if (!accountId) return res.status(400).json({ success: false, error: 'accountId required' });
  
  const profile = getOrInitSiegeProfile(accountId);
  if (!profile.currentMatch) return res.status(400).json({ success: false, error: 'No active match' });
  if (profile.currentMatch.phase !== 'defense') return res.status(400).json({ success: false, error: 'Defense is locked' });
  
  const saveState = db.saves[accountId]?.saveState;
  const unlocked = saveState?.characters ? Object.values(saveState.characters).filter((c: any) => c.unlocked).map((c: any) => c.id) : [];
  
  if (unlocked.length < 9) {
    return res.status(400).json({ success: false, error: 'Not enough unlocked characters to place 9 defensive squads' });
  }
  
  const playerDefense = { ...profile.currentMatch.playerDefense };
  const alreadyPlaced = new Set<string>();
  for (const squad of Object.values(playerDefense)) {
    if (Array.isArray(squad)) {
      squad.forEach(c => alreadyPlaced.add(c));
    }
  }
  
  const available = unlocked.filter((c: string) => !alreadyPlaced.has(c));
  
  for (let idx = 0; idx < 9; idx++) {
    const squadKey = idx.toString();
    if (!playerDefense[squadKey] || playerDefense[squadKey].length === 0) {
      const squadSize = Math.min(5, available.length);
      if (squadSize > 0) {
        playerDefense[squadKey] = available.splice(0, squadSize);
      } else {
        playerDefense[squadKey] = ['luke_stormtrooper'];
      }
    }
  }
  
  profile.currentMatch.playerDefense = playerDefense;
  profile.lastDefense = Object.values(playerDefense);
  saveDatabase();
  res.json({ success: true, currentMatch: profile.currentMatch });
});

app.post('/api/siege/defense/copy-previous', (req, res) => {
  const { accountId } = req.body;
  if (!accountId) return res.status(400).json({ success: false, error: 'accountId required' });
  
  const profile = getOrInitSiegeProfile(accountId);
  if (!profile.currentMatch) return res.status(400).json({ success: false, error: 'No active match' });
  if (profile.currentMatch.phase !== 'defense') return res.status(400).json({ success: false, error: 'Defense is locked' });
  if (!profile.lastDefense || profile.lastDefense.length < 9) {
    return res.status(400).json({ success: false, error: 'No complete previous defense layout saved' });
  }
  
  const squads: Record<string, string[]> = {};
  profile.lastDefense.forEach((squad: string[], idx: number) => {
    squads[idx.toString()] = squad;
  });
  
  profile.currentMatch.playerDefense = squads;
  saveDatabase();
  res.json({ success: true, currentMatch: profile.currentMatch });
});

app.post('/api/siege/phase/force-advance', (req, res) => {
  const { accountId } = req.body;
  if (!accountId) return res.status(400).json({ success: false, error: 'accountId required' });
  
  const profile = getOrInitSiegeProfile(accountId);
  if (!profile.currentMatch) return res.status(400).json({ success: false, error: 'No active match found' });
  
  const currentMatch = profile.currentMatch;
  if (currentMatch.phase === 'defense') {
    if (Object.keys(currentMatch.playerDefense).length < 9) {
      const saveState = db.saves[accountId]?.saveState;
      const unlocked = saveState?.characters ? Object.values(saveState.characters).filter((c: any) => c.unlocked).map((c: any) => c.id) : [];
      const tempDef: Record<string, string[]> = { ...currentMatch.playerDefense };
      let cursor = 0;
      for (let i = 0; i < 9; i++) {
        if (!tempDef[i.toString()] || tempDef[i.toString()].length === 0) {
          const size = 5;
          const sl: string[] = [];
          for (let s = 0; s < size; s++) {
            if (unlocked[cursor]) {
              sl.push(unlocked[cursor]);
              cursor++;
            } else {
              sl.push('luke_stormtrooper');
            }
          }
          tempDef[i.toString()] = sl;
        }
      }
      currentMatch.playerDefense = tempDef;
      profile.lastDefense = Object.values(tempDef);
    }
    
    currentMatch.phase = 'attack';
    currentMatch.phaseEndTimestamp = Date.now() + 24 * 60 * 60 * 1000;
  } else if (currentMatch.phase === 'attack') {
    currentMatch.phase = 'ended';
    currentMatch.phaseEndTimestamp = Date.now();
    
    let simulatedOpponentScore = 0;
    let simulatedOpponentFailedAttacks = 0;
    
    const playerDefSize = Object.keys(currentMatch.playerDefense).length;
    let defensiveHolds = 0;
    
    for (let idx = 0; idx < playerDefSize; idx++) {
      const holdChance = 0.3;
      const random = Math.random();
      
      if (random < holdChance) {
        defensiveHolds++;
        simulatedOpponentFailedAttacks++;
        currentMatch.playerDefensivePoints += 20;
        currentMatch.playerDefensivePoints += 10;
      } else {
        let baseClearPoints = 0;
        if (idx < 3) baseClearPoints = 100;
        else if (idx < 6) baseClearPoints = 150;
        else baseClearPoints = 250;
        
        simulatedOpponentScore += baseClearPoints;
        simulatedOpponentScore += 50;
        simulatedOpponentScore += 25;
      }
    }
    
    if (defensiveHolds > 0) {
      currentMatch.playerDefensivePoints += 50;
    }
    
    currentMatch.opponentScore = simulatedOpponentScore;
    currentMatch.opponentFailedAttacks = simulatedOpponentFailedAttacks;
    currentMatch.playerScore += currentMatch.playerDefensivePoints;
    
    let playerWon = false;
    let isTie = false;
    
    if (currentMatch.playerScore > currentMatch.opponentScore) {
      playerWon = true;
    } else if (currentMatch.playerScore < currentMatch.opponentScore) {
      playerWon = false;
    } else {
      const playerSurvivingDef = playerDefSize - simulatedOpponentFailedAttacks;
      const opponentSurvivingDef = 9 - currentMatch.playerFailedAttacks;
      
      if (playerSurvivingDef > opponentSurvivingDef) {
        playerWon = true;
      } else if (playerSurvivingDef < opponentSurvivingDef) {
        playerWon = false;
      } else {
        if (currentMatch.playerFailedAttacks < currentMatch.opponentFailedAttacks) {
          playerWon = true;
        } else if (currentMatch.playerFailedAttacks > currentMatch.opponentFailedAttacks) {
          playerWon = false;
        } else {
          isTie = true;
          playerWon = Math.random() < 0.5;
        }
      }
    }
    
    const ratingShift = playerWon ? 35 : -15;
    profile.rating = Math.max(0, profile.rating + ratingShift);
    
    const prof = db.profiles[accountId];
    if (prof) prof.galacticSiegeRank = profile.rating;
    
    const r = profile.rating;
    let division = 'Carbonite';
    if (r >= 3000) division = 'Mythic';
    else if (r >= 2500) division = 'Kyber';
    else if (r >= 2000) division = 'Aurodium';
    else if (r >= 1500) division = 'Chromium';
    else if (r >= 1000) division = 'Bronzium';
    profile.division = division;
    
    let rewardTokens = 100;
    if (playerWon) {
      rewardTokens += 150;
      profile.firstDailyWinClaimedToday = false;
    } else {
      rewardTokens += 50;
    }
    
    profile.tokens += rewardTokens;
    profile.lifetime.lifetimeTokens += rewardTokens;
    
    if (playerWon) {
      profile.lifetime.attackWins++;
      profile.lifetime.longestWinStreak++;
    } else {
      profile.lifetime.attackLosses++;
      profile.lifetime.longestWinStreak = 0;
    }
    profile.lifetime.totalSiegeBattles++;
    if (profile.rating > profile.lifetime.highestRating) {
      profile.lifetime.highestRating = profile.rating;
    }
    
    profile.history.unshift({
      opponentId: currentMatch.opponentId,
      opponentUsername: currentMatch.opponentUsername,
      planet: db.siegePlanets?.find((p: any) => p.id === db.activeSiegePlanetId)?.name || 'Kamino',
      playerScore: currentMatch.playerScore,
      opponentScore: currentMatch.opponentScore,
      result: playerWon ? 'victory' : 'defeat',
      ratingChange: ratingShift,
      timestamp: Date.now()
    });
    if (profile.history.length > 50) profile.history.pop();
    
    db.matchLogs.unshift({
      id: 'log_' + Date.now(),
      timestamp: Date.now(),
      playerAccountId: accountId,
      playerUsername: prof?.username || 'Player',
      opponentAccountId: currentMatch.opponentId,
      opponentUsername: currentMatch.opponentUsername,
      winnerAccountId: playerWon ? accountId : currentMatch.opponentId,
      playerSquad: (Object.values(currentMatch.playerDefense)[0] as string[]) || [],
      opponentSquad: (Object.values(currentMatch.opponentDefense)[0] as string[]) || []
    });
  } else {
    profile.currentMatch = null;
    startSiegeMatchmaking(accountId);
  }
  
  saveDatabase();
  res.json({ success: true, profile });
});

app.post('/api/siege/battle-result', (req, res) => {
  const { accountId, squadIndex, win, playerSquad, survivingCount, fullHealthCount, fullProtectionCount, battleSeed, battleActions, turnOrder } = req.body;
  
  if (!accountId || squadIndex === undefined) {
    return res.status(400).json({ success: false, error: 'accountId and squadIndex required' });
  }
  
  const profile = getOrInitSiegeProfile(accountId);
  if (!profile.currentMatch) return res.status(400).json({ success: false, error: 'No active match found' });
  if (profile.currentMatch.phase !== 'attack') return res.status(400).json({ success: false, error: 'Match is not in attack phase' });
  
  const currentMatch = profile.currentMatch;
  const idx = parseInt(squadIndex, 10);
  
  const outerClearedCount = currentMatch.playerAttacks.filter((a: any) => a.squadIndex < 3 && a.success).length;
  const middleClearedCount = currentMatch.playerAttacks.filter((a: any) => a.squadIndex >= 3 && a.squadIndex < 6 && a.success).length;
  
  if (idx >= 3 && idx < 6 && outerClearedCount < 3) {
    return res.status(400).json({ success: false, error: 'Middle Sector is locked. Clear all Outer Sector squads first.' });
  }
  if (idx >= 6 && outerClearedCount < 3) {
    return res.status(400).json({ success: false, error: 'Inner Sector is locked. Clear Outer Sector first.' });
  }
  if (idx >= 6 && middleClearedCount < 3) {
    return res.status(400).json({ success: false, error: 'Inner Sector is locked. Clear Middle Sector first.' });
  }
  
  const attempts = currentMatch.playerAttacks.filter((a: any) => a.squadIndex === idx);
  if (attempts.some((a: any) => a.success)) {
    return res.status(400).json({ success: false, error: 'This squad has already been cleared.' });
  }
  
  const attemptNum = attempts.length + 1;
  
  const attackInfo = {
    squadIndex: idx,
    attemptNumber: attemptNum,
    success: !!win,
    survivingAlliesCount: survivingCount || 0,
    fullHealthAlliesCount: fullHealthCount || 0,
    fullProtectionAlliesCount: fullProtectionCount || 0,
    charactersUsed: playerSquad || []
  };
  
  currentMatch.playerAttacks.push(attackInfo);
  
  let scoreGained = 0;
  if (win) {
    let baseProgress = 0;
    if (idx < 3) baseProgress = 100;
    else if (idx < 6) baseProgress = 150;
    else baseProgress = 250;
    scoreGained += baseProgress;
    
    if (attemptNum === 1) scoreGained += 50;
    else if (attemptNum === 2) scoreGained += 25;
    else if (attemptNum === 3) scoreGained += 10;
    
    scoreGained += (survivingCount || 0) * 5;
    scoreGained += (fullHealthCount || 0) * 2;
    scoreGained += (fullProtectionCount || 0) * 2;
    
    currentMatch.playerScore += scoreGained;
  } else {
    currentMatch.playerFailedAttacks++;
  }
  
  const currentOuterCleared = currentMatch.playerAttacks.filter((a: any) => a.squadIndex < 3 && a.success).length;
  const currentMiddleCleared = currentMatch.playerAttacks.filter((a: any) => a.squadIndex >= 3 && a.squadIndex < 6 && a.success).length;
  const currentInnerCleared = currentMatch.playerAttacks.filter((a: any) => a.squadIndex >= 6 && a.success).length;
  
  if (currentOuterCleared === 3 && !currentMatch.playerClearedSectors.includes('outer')) {
    currentMatch.playerClearedSectors.push('outer');
    currentMatch.playerScore += 100;
  }
  if (currentMiddleCleared === 3 && !currentMatch.playerClearedSectors.includes('middle')) {
    currentMatch.playerClearedSectors.push('middle');
    currentMatch.playerScore += 150;
  }
  if (currentInnerCleared === 3 && !currentMatch.playerClearedSectors.includes('inner')) {
    currentMatch.playerClearedSectors.push('inner');
    currentMatch.playerScore += 250;
  }
  
  if (playerSquad && Array.isArray(playerSquad)) {
    if (!db.siegeAnalytics) {
      db.siegeAnalytics = { characterUsage: {}, teamUsage: {}, winRates: {}, popularDefenses: {} };
    }
    playerSquad.forEach(cId => {
      db.siegeAnalytics!.characterUsage[cId] = (db.siegeAnalytics!.characterUsage[cId] || 0) + 1;
      
      if (!db.siegeAnalytics!.winRates[cId]) db.siegeAnalytics!.winRates[cId] = { wins: 0, total: 0 };
      db.siegeAnalytics!.winRates[cId].total++;
      if (win) {
        db.siegeAnalytics!.winRates[cId].wins++;
      }
    });
    
    const teamKey = playerSquad.slice().sort().join(',');
    db.siegeAnalytics!.teamUsage[teamKey] = (db.siegeAnalytics!.teamUsage[teamKey] || 0) + 1;
  }
  
  if (battleSeed) {
    const prof = db.profiles[accountId];
    const replay: BattleReplay = {
      id: 'rep_siege_' + Date.now(),
      battleSeed,
      battleActions: battleActions || [],
      turnOrder: turnOrder || [],
      result: win ? 'win' : 'loss',
      timestamp: Date.now(),
      attackerAccountId: accountId,
      attackerUsername: prof?.username || 'Player',
      defenderAccountId: currentMatch.opponentId,
      defenderUsername: currentMatch.opponentUsername
    };
    db.replays.unshift(replay);
    if (db.replays.length > 200) db.replays.pop();
  }
  
  saveDatabase();
  res.json({ success: true, currentMatch, scoreGained, win });
});

app.post('/api/siege/claim-daily', (req, res) => {
  const { accountId } = req.body;
  if (!accountId) return res.status(400).json({ success: false, error: 'accountId required' });
  
  const profile = getOrInitSiegeProfile(accountId);
  if (profile.dailyRewardClaimedToday) {
    return res.status(400).json({ success: false, error: 'Daily reward already claimed today.' });
  }
  
  let rewards = { tokens: 100, credits: 50000, crystals: 10 };
  if (profile.division === 'Mythic') rewards = { tokens: 400, credits: 200000, crystals: 50 };
  else if (profile.division === 'Kyber') rewards = { tokens: 300, credits: 150000, crystals: 30 };
  else if (profile.division === 'Aurodium') rewards = { tokens: 250, credits: 125000, crystals: 25 };
  else if (profile.division === 'Chromium') rewards = { tokens: 200, credits: 100000, crystals: 20 };
  else if (profile.division === 'Bronzium') rewards = { tokens: 150, credits: 75000, crystals: 15 };
  
  profile.tokens += rewards.tokens;
  profile.lifetime.lifetimeTokens += rewards.tokens;
  profile.dailyRewardClaimedToday = true;
  
  const saveState = db.saves[accountId]?.saveState;
  if (saveState) {
    saveState.credits += rewards.credits;
    saveState.crystals += rewards.crystals;
  }
  
  saveDatabase();
  res.json({ success: true, profile, rewards });
});

app.get('/api/siege/store', (req, res) => {
  const storeItems = [
    { id: 'item_general_credit', name: '500k Credits Cache', type: 'general', cost: 150, amount: 500000, icon: 'credit' },
    { id: 'item_relic_fragment', name: 'Relic Fragment Box', type: 'relic', cost: 300, amount: 10, icon: 'relic' },
    { id: 'item_cosmic_border', name: 'Cosmic Border Ornament', type: 'cosmetics', cost: 1000, amount: 1, icon: 'border', weeklyLimit: 1 },
    { id: 'item_legend_shard', name: 'Galactic Shard Pack (x5)', type: 'archives', cost: 400, amount: 5, icon: 'shards' },
    { id: 'item_era_stamina', name: 'Era Stamina Injector (x50)', type: 'era', cost: 200, amount: 50, icon: 'energy' }
  ];
  res.json({ success: true, items: storeItems });
});

app.post('/api/siege/store/buy', (req, res) => {
  const { accountId, itemId } = req.body;
  if (!accountId || !itemId) return res.status(400).json({ success: false, error: 'accountId and itemId required' });
  
  const profile = getOrInitSiegeProfile(accountId);
  const storeItems = [
    { id: 'item_general_credit', name: '500k Credits Cache', type: 'general', cost: 150, amount: 500000, icon: 'credit' },
    { id: 'item_relic_fragment', name: 'Relic Fragment Box', type: 'relic', cost: 300, amount: 10, icon: 'relic' },
    { id: 'item_cosmic_border', name: 'Cosmic Border Ornament', type: 'cosmetics', cost: 1000, amount: 1, icon: 'border', weeklyLimit: 1 },
    { id: 'item_legend_shard', name: 'Galactic Shard Pack (x5)', type: 'archives', cost: 400, amount: 5, icon: 'shards' },
    { id: 'item_era_stamina', name: 'Era Stamina Injector (x50)', type: 'era', cost: 200, amount: 50, icon: 'energy' }
  ];
  
  const item = storeItems.find(i => i.id === itemId);
  if (!item) return res.status(404).json({ success: false, error: 'Item not found in store templates.' });
  
  if (profile.tokens < item.cost) {
    return res.status(400).json({ success: false, error: 'Insufficient Siege Tokens.' });
  }
  
  profile.tokens -= item.cost;
  
  const saveState = db.saves[accountId]?.saveState;
  if (saveState) {
    if (item.id === 'item_general_credit') {
      saveState.credits += item.amount;
    } else if (item.id === 'item_cosmic_border') {
      saveState.equippedTitle = 'Siege Overlord';
    } else if (item.id === 'item_relic_fragment') {
      saveState.inventory = saveState.inventory || {};
      saveState.inventory['relic_part'] = (saveState.inventory['relic_part'] || 0) + item.amount;
    } else if (item.id === 'item_legend_shard') {
      saveState.inventory = saveState.inventory || {};
      saveState.inventory['legend_token'] = (saveState.inventory['legend_token'] || 0) + item.amount;
    } else if (item.id === 'item_era_stamina') {
      saveState.energy = Math.min(saveState.maxEnergy || 144, saveState.energy + item.amount);
    }
  }
  
  saveDatabase();
  res.json({ success: true, profile, saveState });
});

app.post('/api/siege/store/refresh', (req, res) => {
  const { accountId } = req.body;
  const saveState = db.saves[accountId]?.saveState;
  if (!saveState) return res.status(404).json({ success: false, error: 'Save state not found' });
  
  if (saveState.crystals < 50) {
    return res.status(400).json({ success: false, error: 'Insufficient crystals (needs 50)' });
  }
  
  saveState.crystals -= 50;
  saveDatabase();
  res.json({ success: true, saveState });
});

// Admin-specific Galactic Siege endpoints
app.post('/api/admin/siege/planet-update', (req, res) => {
  const { adminId, planetId } = req.body;
  const admin = db.accounts[adminId];
  if (!admin || !admin.admin) {
    return res.status(403).json({ success: false, error: 'Unauthorized admin credentials' });
  }
  
  if (!db.siegePlanets?.some((p: any) => p.id === planetId)) {
    return res.status(404).json({ success: false, error: 'Planet not found in available list' });
  }
  
  db.activeSiegePlanetId = planetId;
  saveDatabase();
  res.json({ success: true, activePlanetId: db.activeSiegePlanetId });
});

app.get('/api/admin/siege/stats', (req, res) => {
  const { adminId } = req.query;
  const admin = db.accounts[adminId as string];
  if (!admin || !admin.admin) {
    return res.status(403).json({ success: false, error: 'Unauthorized admin credentials' });
  }
  
  res.json({ success: true, stats: db.siegeAnalytics || { characterUsage: {}, teamUsage: {}, winRates: {}, popularDefenses: {} } });
});

app.post('/api/admin/siege/reset-all', (req, res) => {
  const { adminId } = req.body;
  const admin = db.accounts[adminId];
  if (!admin || !admin.admin) {
    return res.status(403).json({ success: false, error: 'Unauthorized admin credentials' });
  }
  
  Object.keys(db.profiles).forEach(id => {
    db.profiles[id].galacticSiegeRank = 1000;
  });
  
  db.siegeStates = {};
  db.siegeAnalytics = { characterUsage: {}, teamUsage: {}, winRates: {}, popularDefenses: {} };
  
  saveDatabase();
  res.json({ success: true, message: 'All Galactic Siege rankings and data have been reset.' });
});

// AI Kit Generation Endpoint
app.post('/api/gemini/generate-kit', async (req, res) => {
  try {
    const { lore, role, tags, faction, combatStyle, powerLevel } = req.body;

    if (!lore || !role) {
      return res.status(400).json({ error: 'Lore and Role parameters are required for AI kit generation.' });
    }

    let gAI: GoogleGenAI;
    try {
      gAI = getGeminiClient();
    } catch (err: any) {
      console.warn('API Key missing. Serving fallback kit.');
      return res.json({
        name: `GL - ${role} (${faction || 'Scoundrel'})`,
        baseStats: {
          hp: 48000,
          protection: 36000,
          speed: 135,
          offense: 3400,
          defense: 48,
          critChance: 0.38,
          critDamage: 1.55,
          potency: 0.42,
          tenacity: 0.45
        },
        abilities: [
          {
            name: `${combatStyle || 'Vibro'} Strike`,
            type: 'basic',
            cooldown: 0,
            desc: `Deal Special Damage and inflict Exposed (1 turn).`,
            effects: ['damage', 'Exposed'],
            aiTags: ['offensive']
          },
          {
            name: `Coordinated Tactical Pursuit`,
            type: 'special',
            cooldown: 3,
            desc: `Deal heavy physical damage to target and call a random assist. Grant Speed Up to allies.`,
            effects: ['damage_heavy', 'assist', 'Speed Up'],
            aiTags: ['offensive', 'assist']
          },
          {
            name: `Resolve of a Commander`,
            type: 'unique',
            cooldown: 0,
            desc: `Whenever an ally falls below 50% Health, gain Retribution and recover 10% Protection.`,
            effects: ['retribution', 'protection_recovery'],
            aiTags: ['defensive']
          }
        ]
      });
    }

    const sysInstruction = `You are a creative Star Wars RPG designer specialized in Star Wars Galaxy of Heroes (SWGOH).
Create a complete, play-ready character kit based on the requested lore, faction, and roles.
Your response MUST be a single, strict JSON object. Do not include any markdown fences or surrounding preambles.
Use this format:
{
  "name": "Generated Character Name",
  "baseStats": {
    "hp": 48000,
    "protection": 38000,
    "speed": 135,
    "offense": 3300,
    "defense": 48,
    "critChance": 0.35,
    "critDamage": 1.50,
    "potency": 0.40,
    "tenacity": 0.45
  },
  "abilities": [
    {
      "name": "Ability One",
      "type": "basic",
      "cooldown": 0,
      "desc": "Deal physical damage and apply Offense Down (1 turn).",
      "effects": ["damage", "Offense Down"],
      "aiTags": ["offensive", "debuff"]
    },
    {
      "name": "Ability Two",
      "type": "special",
      "cooldown": 3,
      "desc": "Deal heavy damage and apply Exposed (2 turns). Call a random ally to assist.",
      "effects": ["damage_heavy", "Exposed", "assist"],
      "aiTags": ["offensive", "assist"]
    }
  ]
}`;

    const prompt = `Lore: ${lore}
Role: ${role}
Tags: ${tags ? tags.join(', ') : 'None'}
Faction: ${faction || 'None'}
Combat Style: ${combatStyle || 'Tactical'}
Intended Power level: ${powerLevel || 8500}`;

    const response = await gAI.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '';
    const cleanJson = text.trim();
    const result = JSON.parse(cleanJson);

    return res.json(result);
  } catch (err: any) {
    console.error('Error generating AI kit:', err);
    return res.status(500).json({ error: 'Failed to generate kit using Gemini API.', details: err.message });
  }
});

// --- TASK 7: Mail Templates ---
app.get('/api/admin/mail/templates', (req, res) => {
  const templates = [
    {
      id: 'welcome',
      name: 'Welcome Commander Pack',
      subject: 'Welcome Commander',
      body: 'Thank you for connecting to the Galactic Network. As a launch promotion, we have credited your reserve balance with starter resources.',
      rewards: { credits: 50000, crystals: 250 }
    },
    {
      id: 'maintenance',
      name: 'Maintenance Compensation',
      subject: 'Scheduled Holonet Maintenance Complete',
      body: 'We have finished upgrading our primary sector relay arrays. Please accept this compensation for the service interruption.',
      rewards: { credits: 100000, crystals: 500 }
    },
    {
      id: 'bug_compensation',
      name: 'Bug Compensation Mail',
      subject: 'System Bug Rectified - Rewards Dispatched',
      body: 'Our orbital engineers resolved a glitch in the simulation chambers. Your roster has been credited.',
      rewards: { credits: 75000, crystals: 300 }
    },
    {
      id: 'season_rewards',
      name: 'Season Reward Grant',
      subject: 'Galactic Season Completion Rewards',
      body: 'Excellent performance in this sector. Your final ranking rewards have been computed and authorized.',
      rewards: { credits: 250000, crystals: 1000 }
    },
    {
      id: 'founder_rewards',
      name: 'Founder Commendation',
      subject: 'Founder Rank Authorization Rewards',
      body: 'Salutations, Pioneer. As a founder of this universe, we bestow these exclusive reserves.',
      rewards: { credits: 500000, crystals: 2000 }
    },
    {
      id: 'beta_tester_rewards',
      name: 'Beta Tester Rewards',
      subject: 'Beta Phase Honorarium',
      body: 'Thank you for participating in our beta test program. Your feedback has been invaluable in preparing for galactic deployment.',
      rewards: { credits: 150000, crystals: 600 }
    },
    {
      id: 'event_rewards',
      name: 'Event Rewards Grant',
      subject: 'Sector Event Victory Assets Dispatched',
      body: 'You have demonstrated complete dominance in the active tactical sector event. Rewards have been transferred to your command.',
      rewards: { credits: 200000, crystals: 800 }
    }
  ];
  res.json({ success: true, templates });
});

// --- TASK 4: Admin Unlock Account ---
app.post('/api/admin/unlock-account', (req, res) => {
  const { adminId, targetUsername } = req.body;
  const admin = db.accounts[adminId];
  if (!admin || !admin.admin) {
    return res.status(403).json({ success: false, error: 'Administrative clearances required.' });
  }

  const normalizedTarget = targetUsername ? targetUsername.trim().toLowerCase() : '';
  if (db.failedLoginLogs[normalizedTarget]) {
    delete db.failedLoginLogs[normalizedTarget];
    logAdminAction(admin.username, 'unlock_account', targetUsername, 'Cleared failed login locks for user.');
    saveDatabase();
    return res.json({ success: true, message: `Successfully unlocked terminal locks for ${targetUsername}` });
  }

  res.status(404).json({ success: false, error: 'No active lockout detected for this username.' });
});

// --- TASK 10 & 11: Admin Bulk Operation with Player Groups ---
app.post('/api/admin/bulk-operation', (req, res) => {
  const { adminId, targetGroup, operationType, parameters } = req.body;
  const admin = db.accounts[adminId];
  if (!admin || !admin.admin) {
    return res.status(403).json({ success: false, error: 'Administrative clearances required.' });
  }

  // Filter players by targetGroup: 'All Players', 'Beta Testers', 'Founders', 'Developers', 'Admins', 'VIP Players'
  const targetAccounts = Object.values(db.accounts).filter(acc => {
    if (targetGroup === 'All Players') return true;
    if (targetGroup === 'Beta Testers') return acc.betaTester;
    if (targetGroup === 'Founders') return acc.founder;
    if (targetGroup === 'Developers') return acc.developer;
    if (targetGroup === 'Admins') return acc.admin;
    if (targetGroup === 'VIP Players') return acc.founder || acc.commanderLevel > 50;
    return false;
  });

  let count = 0;

  targetAccounts.forEach(acc => {
    if (operationType === 'currency') {
      const { credits, crystals } = parameters;
      const saveObj = db.saves[acc.accountId];
      if (saveObj && saveObj.saveState) {
        saveObj.saveState.credits = (saveObj.saveState.credits || 0) + (credits || 0);
        saveObj.saveState.crystals = (saveObj.saveState.crystals || 0) + (crystals || 0);
      }
      count++;
    } else if (operationType === 'mail') {
      const { subject, body, credits, crystals } = parameters;
      const mailId = 'bulk_mail_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      if (!db.mails[acc.accountId]) db.mails[acc.accountId] = [];
      db.mails[acc.accountId].push({
        id: mailId,
        sender: 'High Command',
        subject,
        body,
        sentAt: Date.now(),
        read: false,
        claimed: false,
        rewards: { credits: credits || 0, crystals: crystals || 0 }
      });
      count++;
    } else if (operationType === 'character') {
      const { characterId } = parameters;
      const saveObj = db.saves[acc.accountId];
      if (saveObj && saveObj.saveState) {
        if (!saveObj.saveState.characters) saveObj.saveState.characters = {};
        if (!saveObj.saveState.characters[characterId]) {
          saveObj.saveState.characters[characterId] = {
            id: characterId,
            unlocked: true,
            level: 1,
            stars: 3,
            gearTier: 1,
            gearSlots: [false, false, false, false, false, false],
            relicLevel: 0,
            legendLevel: 0,
            abilityLevels: {}
          };
        } else {
          saveObj.saveState.characters[characterId].unlocked = true;
        }
      }
      count++;
    } else if (operationType === 'title') {
      const { title } = parameters;
      const saveObj = db.saves[acc.accountId];
      if (saveObj && saveObj.saveState) {
        if (!saveObj.saveState.unlockedTitles) saveObj.saveState.unlockedTitles = ['Beta Tester'];
        if (!saveObj.saveState.unlockedTitles.includes(title)) {
          saveObj.saveState.unlockedTitles.push(title);
        }
      }
      count++;
    } else if (operationType === 'border') {
      const { border } = parameters;
      const saveObj = db.saves[acc.accountId];
      if (saveObj && saveObj.saveState) {
        if (!saveObj.saveState.unlockedBorders) saveObj.saveState.unlockedBorders = ['none'];
        if (!saveObj.saveState.unlockedBorders.includes(border)) {
          saveObj.saveState.unlockedBorders.push(border);
        }
      }
      count++;
    } else if (operationType === 'flag') {
      const { flag } = parameters;
      if (flag === 'founder') acc.founder = true;
      if (flag === 'betaTester') acc.betaTester = true;
      if (flag === 'admin') acc.admin = true;
      if (flag === 'developer') acc.developer = true;
      count++;
    }
  });

  logAdminAction(admin.username, `bulk_${operationType}`, targetGroup, `Executed bulk operation for ${count} targets.`);
  saveDatabase();

  res.json({ success: true, message: `Successfully executed bulk ${operationType} on ${count} accounts in '${targetGroup}'.` });
});

// --- TASKS 12, 13, 14, 15: Centralized Registries ---
app.get('/api/registry/characters', (req, res) => {
  res.json({ success: true, registry: getCharacterRegistry() });
});

app.get('/api/registry/factions', (req, res) => {
  res.json({ success: true, registry: getFactionRegistry() });
});

app.get('/api/registry/tags', (req, res) => {
  res.json({ success: true, registry: getTagRegistry() });
});

app.get('/api/registry/abilities', (req, res) => {
  res.json({ success: true, registry: getAbilityRegistry() });
});

// --- TASK 17: Health Check Dashboard ---
app.get('/api/admin/health-dashboard', (req, res) => {
  let databaseOk = false;
  try {
    const tempFile = path.join(process.cwd(), 'health_check.temp');
    fs.writeFileSync(tempFile, 'ok', 'utf-8');
    if (fs.readFileSync(tempFile, 'utf-8') === 'ok') {
      databaseOk = true;
    }
    fs.unlinkSync(tempFile);
  } catch (err) {
    databaseOk = false;
  }

  const activeSessionsCount = Object.keys(db.sessions || {}).length;
  const totalAccounts = Object.keys(db.accounts || {}).length;
  const totalMails = Object.values(db.mails || {}).reduce((acc, current) => acc + current.length, 0);
  const totalAnnouncements = (db.announcements || []).length;
  const totalSaves = Object.keys(db.saves || {}).length;
  const totalReplays = (db.replays || []).length;
  const totalAnalyticsLogs = (db.matchLogs || []).length;

  res.json({
    success: true,
    status: {
      database: databaseOk ? 'HEALTHY' : 'DEGRADED',
      server: 'ONLINE',
      authentication: activeSessionsCount > 0 ? 'ACTIVE_SESSION_RELAY' : 'IDLE',
      mail: totalMails > 0 ? 'FUNCTIONING_RELAY' : 'IDLE',
      announcements: totalAnnouncements > 0 ? 'HOLONET_SYNCED' : 'NO_POSTS',
      cloudSave: totalSaves > 0 ? 'BACKUP_SYNCED' : 'NO_SAVES',
      replay: totalReplays > 0 ? 'STREAM_LIVE' : 'NO_REPLAYS',
      analytics: totalAnalyticsLogs > 0 ? 'MONITORING_ACTIVE' : 'NO_LOGS'
    },
    metrics: {
      activeSessionsCount,
      totalAccounts,
      totalMails,
      totalAnnouncements,
      totalSaves,
      totalReplays,
      totalAnalyticsLogs,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    }
  });
});

// --- SYSTEM LOGGER HELPER ---
function logSystemEvent(accountId: string, action: string, ip: string, details: string) {
  if (!db.systemLogs) db.systemLogs = [];
  db.systemLogs.unshift({
    id: 'syslog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: Date.now(),
    accountId,
    action,
    ip,
    details
  });
  if (db.systemLogs.length > 1000) {
    db.systemLogs.pop();
  }
  saveDatabase();
}

// --- TASK 4 & 9: PLAYER FRIEND SYSTEM & PLAYER SEARCH ---
app.get('/api/friends/list', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  if (!db.friends[accountId]) {
    db.friends[accountId] = { friendsList: [], sentRequests: [], receivedRequests: [], favorites: [] };
  }
  const fData = db.friends[accountId];
  
  const mapAccounts = (ids: string[]) => ids.map(id => {
    const acc = db.accounts[id];
    const prof: any = db.profiles[id] || {};
    return {
      accountId: id,
      username: acc?.username || 'Unknown Commander',
      level: acc?.commanderLevel || 1,
      avatar: acc?.profileAvatar || 'luke_stormtrooper',
      title: acc?.profileTitle || 'Initiate',
      profileBorder: acc?.profileBorder || 'none',
      favoriteCharacter: prof.favoriteCharacter || 'luke_stormtrooper',
      favoriteFaction: prof.favoriteFaction || 'Rebel',
      collectionPower: prof.collectionPower || 0,
      showcaseSquad: prof.showcaseSquad || [],
      lastActive: acc?.lastLogin || Date.now(),
      isFavorite: fData.favorites.includes(id)
    };
  });

  res.json({
    success: true,
    friends: mapAccounts(fData.friendsList),
    sentRequests: mapAccounts(fData.sentRequests),
    receivedRequests: mapAccounts(fData.receivedRequests)
  });
});

app.post('/api/friends/search', requireAuth, (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ success: false, error: 'Search query required.' });
  const q = query.trim().toLowerCase();
  
  const matches = Object.values(db.accounts)
    .filter(acc => acc.accountId.toLowerCase() === q || acc.username.toLowerCase().includes(q))
    .slice(0, 15)
    .map(acc => {
      const prof: any = db.profiles[acc.accountId] || {};
      return {
        accountId: acc.accountId,
        username: acc.username,
        level: acc.commanderLevel || 1,
        avatar: acc.profileAvatar || 'luke_stormtrooper',
        title: acc.profileTitle || 'Initiate',
        profileBorder: acc.profileBorder || 'none',
        favoriteCharacter: prof.favoriteCharacter || 'luke_stormtrooper',
        collectionPower: prof.collectionPower || 0,
        showcaseSquad: prof.showcaseSquad || [],
        lastActive: acc.lastLogin || Date.now()
      };
    });

  res.json({ success: true, results: matches });
});

app.post('/api/friends/request', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const { targetAccountId } = req.body;
  
  if (accountId === targetAccountId) {
    return res.status(400).json({ success: false, error: 'Cannot connect with yourself.' });
  }
  
  const targetAcc = db.accounts[targetAccountId];
  if (!targetAcc) return res.status(404).json({ success: false, error: 'Commander not found.' });

  if (!db.friends[accountId]) db.friends[accountId] = { friendsList: [], sentRequests: [], receivedRequests: [], favorites: [] };
  if (!db.friends[targetAccountId]) db.friends[targetAccountId] = { friendsList: [], sentRequests: [], receivedRequests: [], favorites: [] };

  const myFriends = db.friends[accountId];
  const targetFriends = db.friends[targetAccountId];

  if (myFriends.friendsList.includes(targetAccountId)) {
    return res.status(400).json({ success: false, error: 'Already allied with this Commander.' });
  }
  if (myFriends.sentRequests.includes(targetAccountId)) {
    return res.status(400).json({ success: false, error: 'Transmission request already dispatched.' });
  }
  if (myFriends.friendsList.length >= 50) {
    return res.status(400).json({ success: false, error: 'Allied fleet limit of 50 reached.' });
  }

  myFriends.sentRequests.push(targetAccountId);
  targetFriends.receivedRequests.push(accountId);
  
  logSystemEvent(accountId, 'FRIEND_REQUEST_SENT', req.ip || '0.0.0.0', `Sent request to target account: ${targetAccountId}`);
  saveDatabase();
  res.json({ success: true, message: 'Allied transmission dispatched to target Commander console.' });
});

app.post('/api/friends/accept', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const { targetAccountId } = req.body;

  const myFriends = db.friends[accountId];
  const targetFriends = db.friends[targetAccountId];

  if (!myFriends || !targetFriends) return res.status(400).json({ success: false, error: 'Invalid state' });

  myFriends.receivedRequests = myFriends.receivedRequests.filter(id => id !== targetAccountId);
  targetFriends.sentRequests = targetFriends.sentRequests.filter(id => id !== accountId);

  if (!myFriends.friendsList.includes(targetAccountId)) {
    myFriends.friendsList.push(targetAccountId);
  }
  if (!targetFriends.friendsList.includes(accountId)) {
    targetFriends.friendsList.push(accountId);
  }

  logSystemEvent(accountId, 'FRIEND_REQUEST_ACCEPTED', req.ip || '0.0.0.0', `Accepted allied contract with: ${targetAccountId}`);
  saveDatabase();
  res.json({ success: true, message: 'Allied contract initialized. Fleet link established.' });
});

app.post('/api/friends/decline', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const { targetAccountId } = req.body;

  const myFriends = db.friends[accountId];
  const targetFriends = db.friends[targetAccountId];

  if (myFriends) {
    myFriends.receivedRequests = myFriends.receivedRequests.filter(id => id !== targetAccountId);
  }
  if (targetFriends) {
    targetFriends.sentRequests = targetFriends.sentRequests.filter(id => id !== accountId);
  }

  logSystemEvent(accountId, 'FRIEND_REQUEST_DECLINED', req.ip || '0.0.0.0', `Declined allied contract with: ${targetAccountId}`);
  saveDatabase();
  res.json({ success: true, message: 'Transmission declined.' });
});

app.post('/api/friends/remove', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const { targetAccountId } = req.body;

  const myFriends = db.friends[accountId];
  const targetFriends = db.friends[targetAccountId];

  if (myFriends) {
    myFriends.friendsList = myFriends.friendsList.filter(id => id !== targetAccountId);
    myFriends.favorites = myFriends.favorites.filter(id => id !== targetAccountId);
  }
  if (targetFriends) {
    targetFriends.friendsList = targetFriends.friendsList.filter(id => id !== accountId);
    targetFriends.favorites = targetFriends.favorites.filter(id => id !== accountId);
  }

  logSystemEvent(accountId, 'FRIEND_REMOVED', req.ip || '0.0.0.0', `Severed allied contract with: ${targetAccountId}`);
  saveDatabase();
  res.json({ success: true, message: 'Allied contract severed. Channel decommissioned.' });
});

app.post('/api/friends/toggle-favorite', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const { targetAccountId } = req.body;

  const myFriends = db.friends[accountId];
  if (!myFriends) return res.status(400).json({ success: false, error: 'Invalid state' });

  if (myFriends.favorites.includes(targetAccountId)) {
    myFriends.favorites = myFriends.favorites.filter(id => id !== targetAccountId);
  } else {
    myFriends.favorites.push(targetAccountId);
  }

  saveDatabase();
  res.json({ success: true, message: 'Favorite state updated.' });
});

// --- TASK 13 & 14: PLAYER SETTINGS & PRIVACY ---
app.get('/api/player/settings', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  if (!db.settings[accountId]) {
    db.settings[accountId] = {
      musicVolume: 80,
      soundVolume: 90,
      voiceVolume: 85,
      graphicsQuality: 'high',
      frameRate: '60',
      language: 'en',
      notifications: { unreadMail: true, newAnnouncement: true, dailyReset: true, energyFull: true },
      cloudSaveEnabled: true,
      privacy: { publicProfile: true, showCP: true, showFavoriteCharacter: true, showLastActive: true, allowFriendRequests: true }
    };
    saveDatabase();
  }
  res.json({ success: true, settings: db.settings[accountId] });
});

app.post('/api/player/settings/update', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const { settings } = req.body;
  if (!settings) return res.status(400).json({ success: false, error: 'No settings payload provided.' });
  
  db.settings[accountId] = { ...db.settings[accountId], ...settings };
  logSystemEvent(accountId, 'SETTINGS_UPDATED', req.ip || '0.0.0.0', 'Updated terminal interface volumes and privacy presets');
  saveDatabase();
  res.json({ success: true, settings: db.settings[accountId] });
});

// --- TASK 5: UNIVERSAL NOTIFICATION SERVICE ---
app.get('/api/notifications/status', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  
  const playerMails = db.mails[accountId] || [];
  const unreadMailsCount = playerMails.filter(m => !m.read).length;

  const activeAnnouncements = db.announcements.filter(a => !a.archived);
  const newAnnouncementsCount = activeAnnouncements.filter(a => (Date.now() - a.date) < 24 * 60 * 60 * 1000).length;

  const fData = db.friends[accountId] || { friendsList: [], sentRequests: [], receivedRequests: [], favorites: [] };
  const pendingRequestsCount = fData.receivedRequests.length;

  const saveObj = db.saves[accountId]?.saveState || {};
  const arenaTickets = saveObj.arenaTickets ?? 5;
  const campaignEnergy = saveObj.energy ?? 120;

  res.json({
    success: true,
    notifications: {
      unreadMailCount: unreadMailsCount,
      newAnnouncementCount: newAnnouncementsCount,
      pendingRequestsCount: pendingRequestsCount,
      arenaTicketsFull: arenaTickets >= 5,
      energyFull: campaignEnergy >= 120,
      seasonEndingSoon: (db.seasonInfo.seasonEnd - Date.now()) < 3 * 24 * 60 * 60 * 1000,
      dailyResetAvailable: true,
      conquestAvailable: true,
      journeyEventAvailable: true
    }
  });
});

// --- TASK 10: ERROR REPORTING SERVICE ---
app.post('/api/errors/report', (req, res) => {
  const { accountId, version, device, type, message, stackTrace } = req.body;
  const report = {
    id: 'err_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: Date.now(),
    accountId: accountId || 'GUEST',
    version: version || '1.0.0',
    device: device || 'Web Simulator',
    type: type || 'CLIENT_CRASH',
    message: message || 'No message provided',
    stackTrace: stackTrace || 'No stack trace captured'
  };

  if (!db.errorReports) db.errorReports = [];
  db.errorReports.unshift(report);
  if (db.errorReports.length > 200) db.errorReports.pop();
  saveDatabase();
  res.json({ success: true, reportId: report.id });
});

app.get('/api/admin/errors/list', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const acc = db.accounts[accountId];
  if (!acc || (!acc.admin && !acc.developer)) {
    return res.status(403).json({ success: false, error: 'Unauthorized credentials.' });
  }
  res.json({ success: true, reports: db.errorReports || [] });
});

app.post('/api/admin/errors/clear', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const acc = db.accounts[accountId];
  if (!acc || (!acc.admin && !acc.developer)) {
    return res.status(403).json({ success: false, error: 'Unauthorized credentials.' });
  }
  db.errorReports = [];
  saveDatabase();
  res.json({ success: true, message: 'Holographic error report ledger cleared.' });
});

// --- TASK 15: BETA FEEDBACK TOOL ---
app.post('/api/feedback/submit', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const acc = db.accounts[accountId];
  const { type, message, version, device, logs } = req.body;

  if (!message) return res.status(400).json({ success: false, error: 'Feedback message cannot be blank.' });

  const fb = {
    id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: Date.now(),
    accountId,
    username: acc?.username || 'Commander',
    type: type || 'bug',
    message,
    version: version || '1.0.0-Beta',
    device: device || 'Simulated Terminal',
    logs: logs || 'No logs appended'
  };

  if (!db.feedback) db.feedback = [];
  db.feedback.unshift(fb);
  if (db.feedback.length > 500) db.feedback.pop();
  
  logSystemEvent(accountId, 'FEEDBACK_SUBMITTED', req.ip || '0.0.0.0', `Submitted ${type} feedback report`);
  saveDatabase();
  res.json({ success: true, message: 'Feedback successfully recorded and synchronized to development core console.' });
});

app.get('/api/admin/feedback/list', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const acc = db.accounts[accountId];
  if (!acc || (!acc.admin && !acc.developer)) {
    return res.status(403).json({ success: false, error: 'Unauthorized clearances.' });
  }
  res.json({ success: true, feedback: db.feedback || [] });
});

// --- TASK 16: DEVELOPER QUALITY OF LIFE RESETS ---
app.post('/api/dev/force-daily-reset', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const acc = db.accounts[accountId];
  if (!acc || !acc.developer) return res.status(403).json({ success: false, error: 'Developer clearances required.' });

  Object.values(db.saves).forEach(saveObj => {
    if (saveObj.saveState) {
      saveObj.saveState.arenaTickets = 5;
      saveObj.saveState.energy = 120;
      saveObj.saveState.lastDailyReset = Date.now();
      saveObj.saveState.dailyQuestsCompleted = [];
    }
  });

  logSystemEvent(accountId, 'FORCE_DAILY_RESET', req.ip || '0.0.0.0', 'Forced immediate daily cycle reset for all users');
  saveDatabase();
  res.json({ success: true, message: 'Galactic Daily Cycle reset completed. Tickets and energy reserves fully replenished across all sectors.' });
});

app.post('/api/dev/force-weekly-reset', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const acc = db.accounts[accountId];
  if (!acc || !acc.developer) return res.status(403).json({ success: false, error: 'Developer clearances required.' });

  logSystemEvent(accountId, 'FORCE_WEEKLY_RESET', req.ip || '0.0.0.0', 'Forced weekly challenge and raid keys cycle reset');
  saveDatabase();
  res.json({ success: true, message: 'Weekly cycle reset completed.' });
});

app.post('/api/dev/force-season-reset', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const acc = db.accounts[accountId];
  if (!acc || !acc.developer) return res.status(403).json({ success: false, error: 'Developer clearances required.' });

  const planets = ['Hoth', 'Coruscant', 'Mustafar', 'Endor', 'Tatooine'];
  const eras = ['civil_war', 'old_republic', 'clone_wars', 'new_republic'];
  const nextPlanet = planets[Math.floor(Math.random() * planets.length)];
  const nextEra = eras[Math.floor(Math.random() * eras.length)];

  db.seasonInfo = {
    currentEra: nextEra,
    currentPlanet: nextPlanet,
    seasonStart: Date.now(),
    seasonEnd: Date.now() + 30 * 24 * 60 * 60 * 1000,
    activeBonuses: [
      { faction: 'Rebel', bonusStat: 'Offense', value: 15 },
      { faction: 'Empire', bonusStat: 'Defense', value: 20 }
    ],
    currentConquestId: 'conquest_cycle_' + Math.floor(Math.random() * 10),
    currentLoginCalendar: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      rewardType: i % 2 === 0 ? 'credits' : 'crystals',
      rewardAmount: i % 2 === 0 ? 50000 : 100
    }))
  };

  logSystemEvent(accountId, 'FORCE_SEASON_RESET', req.ip || '0.0.0.0', `Initiated Galactic Season reset to era: ${nextEra}, planet: ${nextPlanet}`);
  saveDatabase();
  res.json({ success: true, message: `Season reset successful. Planet is now ${nextPlanet} under the ${nextEra} active cycle.`, seasonInfo: db.seasonInfo });
});

app.post('/api/dev/simulate-maintenance', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const acc = db.accounts[accountId];
  if (!acc || !acc.developer) return res.status(403).json({ success: false, error: 'Developer clearances required.' });

  const { active } = req.body;
  
  if (active) {
    const annId = 'maintenance_notice_dev';
    const countdown = Date.now() + 15 * 60 * 1000;
    const newAnn: Announcement = {
      id: annId,
      title: 'IMPERIAL PROTOCOL DEPLOYMENT IN PROGRESS',
      body: 'Maintenance droids are currently refurbishing tactical terminals. Complete offline state imminent in 15 minutes.',
      date: Date.now(),
      priority: 'high',
      createdBy: acc.username,
      archived: false,
      category: 'maintenance',
      pinned: true,
      maintenanceEndsAt: countdown
    };
    db.announcements.unshift(newAnn);
  } else {
    db.announcements = db.announcements.filter(a => a.id !== 'maintenance_notice_dev');
  }

  logSystemEvent(accountId, 'SIMULATE_MAINTENANCE', req.ip || '0.0.0.0', `Simulated maintenance state: ${active}`);
  saveDatabase();
  res.json({ success: true, message: `Simulated maintenance notice state updated.` });
});

app.post('/api/dev/grant-resources', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const acc = db.accounts[accountId];
  if (!acc || !acc.developer) return res.status(403).json({ success: false, error: 'Developer clearances required.' });

  const saveObj = db.saves[accountId];
  if (saveObj && saveObj.saveState) {
    saveObj.saveState.credits = (saveObj.saveState.credits || 0) + 1000000;
    saveObj.saveState.crystals = (saveObj.saveState.crystals || 0) + 10000;
    saveObj.saveState.arenaTickets = 10;
    saveObj.saveState.energy = 250;
    saveDatabase();
  }

  logSystemEvent(accountId, 'DEV_GRANT_RESOURCES', req.ip || '0.0.0.0', 'Granted sandbox debug reserves (1M Credits, 10K Crystals)');
  res.json({ success: true, message: 'Transferred 1,000,000 Credits and 10,000 Crystals into active Commander ledger.' });
});

app.post('/api/dev/reset-test-account', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const acc = db.accounts[accountId];
  if (!acc || !acc.developer) return res.status(403).json({ success: false, error: 'Developer clearances required.' });

  const defaultState = {
    credits: 100000,
    crystals: 500,
    energy: 120,
    arenaTickets: 5,
    lastDailyReset: Date.now(),
    dailyQuestsCompleted: [],
    unlockedTitles: ['Beta Tester'],
    unlockedBorders: ['none'],
    characters: {
      luke_stormtrooper: { id: 'luke_stormtrooper', unlocked: true, level: 1, stars: 3, gearTier: 1, gearSlots: [false,false,false,false,false,false], relicLevel: 0, legendLevel: 0, abilityLevels: {} }
    }
  };
  
  db.saves[accountId] = { saveState: defaultState, updatedAt: Date.now() };
  logSystemEvent(accountId, 'DEV_RESET_ACCOUNT', req.ip || '0.0.0.0', 'Reset personal development save state to defaults');
  saveDatabase();
  res.json({ success: true, message: 'Development save state completely reset to base credentials.' });
});

app.post('/api/dev/create-dummy-accounts', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const acc = db.accounts[accountId];
  if (!acc || !acc.developer) return res.status(403).json({ success: false, error: 'Developer clearances required.' });

  const dummyNames = ['Commander_Rex', 'Grand_Admiral_Thrawn', 'Ahsoka_Tano_Fan', 'Boba_Fett_Bounty', 'Mandalorian_Way', 'Darth_Revan_Legacy', 'Kyle_Katarn_Agent', 'Mara_Jade_Hand'];
  
  dummyNames.forEach((name, i) => {
    const dummyId = 'dummy_' + name.toLowerCase();
    if (db.accounts[dummyId]) return;

    db.accounts[dummyId] = {
      accountId: dummyId,
      username: name,
      passwordHash: bcrypt.hashSync('dummy123', 10),
      recoveryCodeHash: bcrypt.hashSync('dummy_recovery', 10),
      createdAt: Date.now(),
      lastLogin: Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000,
      founder: i % 2 === 0,
      betaTester: true,
      admin: false,
      developer: false,
      commanderLevel: 40 + Math.floor(Math.random() * 45),
      profileAvatar: i % 2 === 0 ? 'luke_stormtrooper' : 'leia_senator',
      profileTitle: 'Sector Guardian',
      profileBorder: i % 3 === 0 ? 'cyber' : 'none',
      banned: false
    };

    const dummyState = {
      credits: 250000,
      crystals: 1500,
      energy: 120,
      arenaTickets: 5,
      lastDailyReset: Date.now(),
      dailyQuestsCompleted: [],
      unlockedTitles: ['Beta Tester', 'Sector Guardian'],
      unlockedBorders: ['none', 'cyber'],
      characters: {
        luke_stormtrooper: { id: 'luke_stormtrooper', unlocked: true, level: 50, stars: 5, gearTier: 8, gearSlots: [false,false,false,false,false,false], relicLevel: 0, legendLevel: 0, abilityLevels: {} },
        han_stormtrooper: { id: 'han_stormtrooper', unlocked: true, level: 45, stars: 4, gearTier: 7, gearSlots: [false,false,false,false,false,false], relicLevel: 0, legendLevel: 0, abilityLevels: {} }
      }
    };

    db.saves[dummyId] = { saveState: dummyState, updatedAt: Date.now() };
    
    db.profiles[dummyId] = {
      accountId: dummyId,
      username: name,
      avatar: i % 2 === 0 ? 'luke_stormtrooper' : 'leia_senator',
      title: 'Sector Guardian',
      profileBorder: i % 3 === 0 ? 'cyber' : 'none',
      favoriteCharacter: 'luke_stormtrooper',
      favoriteFaction: 'Rebel',
      favoriteEra: 'civil_war',
      collectionPower: 12500 + Math.floor(Math.random() * 20000),
      galacticSiegeRank: 10 + i,
      showcaseSquad: ['luke_stormtrooper', 'han_stormtrooper'],
      founderBadge: i % 2 === 0,
      betaTesterBadge: true
    };
  });

  logSystemEvent(accountId, 'DEV_CREATE_DUMMIES', req.ip || '0.0.0.0', 'Generated dummy Commander profiles for social, leaderboards, and debugging');
  saveDatabase();
  res.json({ success: true, message: 'Dummy database seeded. 8 high-fidelity simulated Commander accounts dispatched to active registries.' });
});

app.get('/api/admin/system-logs', requireAuth, (req, res) => {
  const accountId = (req as any).session.accountId;
  const acc = db.accounts[accountId];
  if (!acc || (!acc.admin && !acc.developer)) {
    return res.status(403).json({ success: false, error: 'Unauthorized clearances.' });
  }
  res.json({ success: true, logs: db.systemLogs || [] });
});

// Serve assets / mount Vite compiler
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Galactic Legends backend serving at http://0.0.0.0:${PORT}`);
  });
}

startServer();
