import { SaveState } from '../types';

export interface PlayerAccount {
  accountId: string;
  username: string;
  createdAt: number;
  lastLogin: number;
  founder: boolean;
  betaTester: boolean;
  admin: boolean;
  developer: boolean;
  commanderLevel: number;
  profileAvatar: string;
  profileTitle: string;
  email?: string;
  emailVerified?: boolean;
  profileBorder?: string;
}

export interface PlayerProfile {
  accountId: string;
  username: string;
  avatar: string;
  title: string;
  profileBorder: string;
  favoriteCharacter: string;
  favoriteFaction: string;
  favoriteEra: string;
  collectionPower: number;
  galacticSiegeRank: number;
  showcaseSquad: string[];
  founderBadge?: boolean;
  betaTesterBadge?: boolean;
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
  rewards?: MailRewards;
}

export interface SaveBackup {
  id: string;
  accountId: string;
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

export interface AdminLog {
  id: string;
  adminName: string;
  timestamp: number;
  action: string;
  targetAccount: string;
  details: string;
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

class NetworkManagerClass {
  private onlineStatus: boolean = true;
  private currentAccount: PlayerAccount | null = null;
  private cachedProfiles: Record<string, PlayerProfile> = {};
  private syncIntervalId: any = null;

  constructor() {
    this.loadLocalAccountState();
    this.checkConnection();
    if (typeof window !== 'undefined') {
      this.syncIntervalId = setInterval(() => {
        this.autoSync();
      }, 5 * 60 * 1000);
    }
  }

  private loadLocalAccountState() {
    try {
      const acc = localStorage.getItem('gl_logged_in_account');
      if (acc) {
        this.currentAccount = JSON.parse(acc);
      }
    } catch (e) {
      console.error(e);
    }
  }

  public async checkConnection(): Promise<boolean> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        this.onlineStatus = true;
      } else {
        this.onlineStatus = false;
      }
    } catch (e) {
      this.onlineStatus = false;
    }
    return this.onlineStatus;
  }

  public isOnline(): boolean {
    return this.onlineStatus;
  }

  public setOnline(status: boolean) {
    this.onlineStatus = status;
  }

  public getAccount(): PlayerAccount | null {
    return this.currentAccount;
  }

  public async secureFetch(url: string, options: any = {}): Promise<Response> {
    if (!options.headers) options.headers = {};
    if (!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json';
    
    const accessToken = localStorage.getItem('gl_access_token');
    if (accessToken) {
      options.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    let response = await fetch(url, options);
    
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('gl_refresh_token');
      if (refreshToken) {
        try {
          const refreshRes = await fetch('/api/account/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });
          const refreshData = await refreshRes.json();
          if (refreshRes.ok && refreshData.success) {
            localStorage.setItem('gl_access_token', refreshData.accessToken);
            localStorage.setItem('gl_refresh_token', refreshData.refreshToken);
            
            options.headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
            response = await fetch(url, options);
          } else {
            this.logout();
          }
        } catch (e) {
          console.error('Failed auto session renew', e);
        }
      }
    }
    
    return response;
  }

  public logout() {
    const accessToken = localStorage.getItem('gl_access_token');
    if (accessToken) {
      fetch('/api/account/logout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }).catch(err => console.error(err));
    }
    
    this.currentAccount = null;
    localStorage.removeItem('gl_logged_in_account');
    localStorage.removeItem('gl_access_token');
    localStorage.removeItem('gl_refresh_token');
  }

  public async authenticate(username: string, password: string, isRegister: boolean = false): Promise<{ success: boolean; error?: string; account?: PlayerAccount; recoveryCode?: string }> {
    try {
      const url = isRegister ? '/api/account/register' : '/api/account/login';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        this.currentAccount = data.account;
        localStorage.setItem('gl_logged_in_account', JSON.stringify(data.account));
        if (data.session) {
          localStorage.setItem('gl_access_token', data.session.accessToken);
          localStorage.setItem('gl_refresh_token', data.session.refreshToken);
        }
        this.onlineStatus = true;
        return { success: true, account: data.account, recoveryCode: data.recoveryCode };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (err: any) {
      return { success: false, error: 'Network error: Server is unreachable.' };
    }
  }

  public async authenticateViaRecoveryCode(recoveryCode: string): Promise<{ success: boolean; error?: string; account?: PlayerAccount }> {
    try {
      const response = await fetch('/api/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recoveryCode })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        this.currentAccount = data.account;
        localStorage.setItem('gl_logged_in_account', JSON.stringify(data.account));
        if (data.session) {
          localStorage.setItem('gl_access_token', data.session.accessToken);
          localStorage.setItem('gl_refresh_token', data.session.refreshToken);
        }
        this.onlineStatus = true;
        return { success: true, account: data.account };
      } else {
        return { success: false, error: data.error || 'Holographic recovery verification failed.' };
      }
    } catch (err: any) {
      return { success: false, error: 'Network error: Server is unreachable.' };
    }
  }

  public async recoverAccount(username: string, recoveryCode: string, newPass: string): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const response = await fetch('/api/account/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, recoveryCode, newPassword: newPass })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Recovery protocol failed.' };
      }
    } catch (err: any) {
      return { success: false, error: 'Connection failure.' };
    }
  }

  // TASK 3: OPTIONAL EMAIL LINKING
  public async linkEmail(email: string): Promise<boolean> {
    if (!this.currentAccount) return false;
    try {
      const res = await this.secureFetch('/api/account/email/link', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const data = await res.json();
        this.currentAccount = data.account;
        localStorage.setItem('gl_logged_in_account', JSON.stringify(data.account));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  public async removeEmail(): Promise<boolean> {
    if (!this.currentAccount) return false;
    try {
      const res = await this.secureFetch('/api/account/email/remove', {
        method: 'POST',
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        this.currentAccount = data.account;
        localStorage.setItem('gl_logged_in_account', JSON.stringify(data.account));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  public async verifyEmail(): Promise<boolean> {
    if (!this.currentAccount) return false;
    try {
      const res = await this.secureFetch('/api/account/email/verify', {
        method: 'POST',
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        this.currentAccount = data.account;
        localStorage.setItem('gl_logged_in_account', JSON.stringify(data.account));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  public async recoverViaEmail(email: string, newPass: string): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const res = await fetch('/api/account/email/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: newPass })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Failed to recover via email.' };
      }
    } catch (e) {
      return { success: false, error: 'Connection failure.' };
    }
  }

  public async uploadSave(saveState: SaveState): Promise<boolean> {
    if (!this.isOnline() || !this.currentAccount) return false;
    try {
      const response = await this.secureFetch('/api/save/upload', {
        method: 'POST',
        body: JSON.stringify({
          saveState,
          updatedAt: Date.now()
        })
      });
      return response.ok;
    } catch (err) {
      console.error('Failed to upload save', err);
      return false;
    }
  }

  public async downloadSave(): Promise<SaveState | null> {
    if (!this.isOnline() || !this.currentAccount) return null;
    try {
      const response = await this.secureFetch('/api/save/download');
      if (response.ok) {
        const data = await response.json();
        return data.saveState || null;
      }
    } catch (err) {
      console.error('Failed to download save', err);
    }
    return null;
  }

  // TASK 4: Backups & Restore
  public async getSaveBackups(accountId: string): Promise<SaveBackup[]> {
    if (!this.currentAccount?.admin) return [];
    try {
      const res = await fetch(`/api/admin/saves/history?adminId=${this.currentAccount.accountId}&accountId=${accountId}`);
      if (res.ok) {
        const data = await res.json();
        return data.backups || [];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  public async restoreSaveBackup(accountId: string, backupId: string): Promise<boolean> {
    if (!this.currentAccount?.admin) return false;
    try {
      const res = await fetch('/api/admin/saves/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: this.currentAccount.accountId, accountId, backupId })
      });
      return res.ok;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  public async getProfile(id: string): Promise<PlayerProfile | null> {
    try {
      const response = await fetch(`/api/profile/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          this.cachedProfiles[id] = data.profile;
          return data.profile;
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
    return null;
  }

  public async updateProfile(updates: Partial<PlayerProfile>): Promise<boolean> {
    if (!this.isOnline() || !this.currentAccount) return false;
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: this.currentAccount.accountId,
          ...updates
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.account && this.currentAccount) {
          this.currentAccount = { ...this.currentAccount, ...data.account };
          localStorage.setItem('gl_logged_in_account', JSON.stringify(this.currentAccount));
        }
        return true;
      }
    } catch (err) {
      console.error('Failed to update profile', err);
    }
    return false;
  }

  public async getRankings(): Promise<PlayerProfile[]> {
    try {
      const response = await fetch('/api/rankings');
      if (response.ok) {
        const data = await response.json();
        return data.rankings || [];
      }
    } catch (err) {
      console.error('Failed to fetch rankings', err);
    }
    return [];
  }

  public async getMails(): Promise<MailMessage[]> {
    if (!this.currentAccount) return [];
    try {
      const response = await fetch(`/api/mail/list?accountId=${this.currentAccount.accountId}`);
      if (response.ok) {
        const data = await response.json();
        return data.mails || [];
      }
    } catch (err) {
      console.error(err);
    }
    return [];
  }

  public async claimMailReward(mailId: string): Promise<{ success: boolean; rewards?: any }> {
    if (!this.currentAccount) return { success: false };
    try {
      const response = await fetch('/api/mail/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: this.currentAccount.accountId, mailId })
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error(err);
    }
    return { success: false };
  }

  // TASK 8: Advanced Mail Sending (Multi-rewards)
  public async sendAdvancedMail(payload: { targetType: 'single' | 'group' | 'all'; targetAccountId?: string; subject: string; body: string; rewards: MailRewards }): Promise<any> {
    if (!this.currentAccount?.admin) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/admin/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: this.currentAccount.accountId, ...payload })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  public async triggerAdminAction(endpoint: string, payload: any): Promise<any> {
    if (!this.currentAccount?.admin) return { success: false, error: 'Unauthorized' };
    try {
      const response = await fetch(`/api/admin/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: this.currentAccount.accountId,
          ...payload
        })
      });
      return await response.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  public async getAnalytics(): Promise<any> {
    if (!this.currentAccount?.developer) return { success: false, error: 'Unauthorized' };
    try {
      const response = await fetch(`/api/admin/analytics?developerId=${this.currentAccount.accountId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  public async getMatchLogs(): Promise<any[]> {
    if (!this.currentAccount?.admin) return [];
    try {
      const response = await fetch(`/api/admin/match-logs?adminId=${this.currentAccount.accountId}`);
      if (response.ok) {
        const data = await response.json();
        return data.logs || [];
      }
    } catch (err) {
      console.error(err);
    }
    return [];
  }

  public async getAuditLogs(): Promise<AdminLog[]> {
    if (!this.currentAccount?.admin) return [];
    try {
      const res = await fetch(`/api/admin/audit-logs?adminId=${this.currentAccount.accountId}`);
      if (res.ok) {
        const data = await res.json();
        return data.logs || [];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  // TASK 7: ANNOUNCEMENT SERVICE
  public async getAnnouncements(): Promise<Announcement[]> {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        return data.announcements || [];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  public async createAnnouncement(title: string, body: string, priority: 'low' | 'medium' | 'high', category?: string): Promise<boolean> {
    if (!this.currentAccount?.admin) return false;
    try {
      const res = await fetch('/api/admin/announcements/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: this.currentAccount.accountId, title, body, priority, category })
      });
      return res.ok;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  public async archiveAnnouncement(id: string, archive: boolean): Promise<boolean> {
    if (!this.currentAccount?.admin) return false;
    try {
      const res = await fetch('/api/admin/announcements/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: this.currentAccount.accountId, id, archive })
      });
      return res.ok;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  // TASK 12: SEASON SERVICE
  public async getSeasonInfo(): Promise<SeasonInfo | null> {
    try {
      const res = await fetch('/api/season/info');
      if (res.ok) {
        const data = await res.json();
        return data.seasonInfo || null;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  // TASK 13: DEVELOPER CONTROLS
  public async overrideSeason(era: string, planet: string, bonuses?: any[]): Promise<boolean> {
    if (!this.currentAccount?.developer) return false;
    try {
      const res = await fetch('/api/admin/dev/season', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ developerId: this.currentAccount.accountId, era, planet, bonuses })
      });
      return res.ok;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  public async testMatchmaking(squadRank: number): Promise<any> {
    if (!this.currentAccount?.developer) return null;
    try {
      const res = await fetch('/api/admin/dev/test-matchmaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ developerId: this.currentAccount.accountId, squadRank })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  public async testCharacter(charId: string, level: number, stars: number, gearTier: number, relicLevel: number): Promise<any> {
    if (!this.currentAccount?.developer) return null;
    try {
      const res = await fetch('/api/admin/dev/test-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ developerId: this.currentAccount.accountId, charId, level, stars, gearTier, relicLevel })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  public async postMatchResult(opponentId: string, win: boolean, playerSquad: string[], opponentSquad: string[], battleSeed?: string, battleActions?: any[], turnOrder?: string[]): Promise<{ success: boolean; newRank?: number }> {
    if (!this.currentAccount) return { success: false };
    try {
      const response = await fetch('/api/siege/match-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: this.currentAccount.accountId,
          opponentId,
          win,
          playerSquad,
          opponentSquad,
          battleSeed,
          battleActions,
          turnOrder
        })
      });
      if (response.ok) {
        const data = await response.json();
        return { success: true, newRank: data.newRank };
      }
    } catch (err) {
      console.error(err);
    }
    return { success: false };
  }

  private async autoSync() {
    if (!this.currentAccount) return;
    try {
      const activeId = localStorage.getItem('galactic_legends_active_profile_v2');
      if (!activeId) return;
      const rawSave = localStorage.getItem(`save_${activeId}`);
      if (!rawSave) return;
      const saveState = JSON.parse(rawSave) as SaveState;

      await this.uploadSave(saveState);
      console.log('AutoSync save complete.');
    } catch (e) {
      console.warn('AutoSync failed', e);
    }
  }
}

export const NetworkManager = new NetworkManagerClass();

export function calculateCollectionPower(saveState: SaveState): number {
  let totalPower = 0;
  if (!saveState?.characters) return 0;
  
  Object.values(saveState.characters).forEach((char) => {
    if (!char.unlocked) return;
    
    const levelPower = char.level * 10;
    const starsPower = char.stars * 150;
    const gearPower = char.gearTier * 250;
    const relicPower = char.relicLevel * 500;
    const legendPower = (char.legendLevel || 0) * 800;
    const eraPower = (char.eraLevel || 0) * 50;

    totalPower += (levelPower + starsPower + gearPower + relicPower + legendPower + eraPower);
  });

  return totalPower;
}
