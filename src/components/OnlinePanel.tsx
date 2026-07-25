import React, { useState, useEffect } from 'react';
import { 
  Wifi, WifiOff, Mail, Shield, Activity, User, Trophy, Sparkles, 
  Plus, Trash2, Lock, Settings, Globe, RefreshCw, AlertCircle, 
  Inbox, ChevronRight, CheckCircle2, Ban, Landmark, Award, Download, Copy, Calendar, Eye, FileText, Printer, Key,
  Heart, Sliders, MessageSquare, Users, LogOut, Volume2, ShieldAlert, Coins
} from 'lucide-react';
import { NetworkManager, PlayerAccount, PlayerProfile, MailMessage, SaveBackup, Announcement, AdminLog, SeasonInfo, calculateCollectionPower } from '../utils/networkManager';
import { SaveState } from '../types';
import { getAllCharacters } from '../data/characters';

interface OnlinePanelProps {
  saveState: SaveState;
  onUpdateSaveState: (state: SaveState) => void;
  onClose?: () => void;
  inline?: boolean;
  initialTab?: string;
}

export function OnlinePanel({ saveState, onUpdateSaveState, onClose, inline, initialTab }: OnlinePanelProps) {
  const [account, setAccount] = useState<PlayerAccount | null>(NetworkManager.getAccount());
  const [isOnline, setIsOnline] = useState(NetworkManager.isOnline());
  const [activeSubTab, setActiveSubTab] = useState<string>(initialTab || 'account');

  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);
  
  // Auth Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Recovery Code Display
  const [recoveryCodeToShow, setRecoveryCodeToShow] = useState('');
  const [tempAccount, setTempAccount] = useState<PlayerAccount | null>(null);

  // Recovery Form State
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryUsername, setRecoveryUsername] = useState('');
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');

  // Email Linking State (Task 3)
  const [emailInput, setEmailInput] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [isEmailRecovering, setIsEmailRecovering] = useState(false);
  const [recoveryEmailInput, setRecoveryEmailInput] = useState('');
  const [recoveryEmailPassword, setRecoveryEmailPassword] = useState('');
  const [acknowledgedCode, setAcknowledgedCode] = useState(false);

  // Announcement Categories / Filtering (Task 6)
  const [activeAnnCategory, setActiveAnnCategory] = useState<'all' | 'news' | 'update' | 'maintenance' | 'event' | 'developer_post' | 'emergency_notice'>('all');

  // Admin Mail Templates & Bulk Operations (Task 7, 10, 11)
  const [selectedMailTemplateId, setSelectedMailTemplateId] = useState('');
  const [adminBulkGroup, setAdminBulkGroup] = useState<'All Players' | 'Beta Testers' | 'Founders' | 'Developers' | 'Admins' | 'VIP Players'>('All Players');
  const [adminBulkOpType, setAdminBulkOpType] = useState<'currency' | 'mail' | 'character' | 'title' | 'border' | 'flag'>('currency');
  const [bulkParamCredits, setBulkParamCredits] = useState(100000);
  const [bulkParamCrystals, setBulkParamCrystals] = useState(500);
  const [bulkParamMailSubject, setBulkParamMailSubject] = useState('Urgent Galactic Dispatch');
  const [bulkParamMailBody, setBulkParamMailBody] = useState('Attention Commander. A system bulletin has been delivered.');
  const [bulkParamCharId, setBulkParamCharId] = useState('stormtrooper_luke');
  const [bulkParamTitle, setBulkParamTitle] = useState('Beta Tester');
  const [bulkParamBorder, setBulkParamBorder] = useState('bronze');
  const [bulkParamFlag, setBulkParamFlag] = useState<'founder' | 'betaTester' | 'admin' | 'developer'>('betaTester');

  // Centralized Registries Viewer selected tab (Task 12, 13, 14, 15)
  const [activeRegistryTab, setActiveRegistryTab] = useState<'characters' | 'factions' | 'tags' | 'abilities'>('characters');
  const [registrySearch, setRegistrySearch] = useState('');

  // Health Check Dashboard Data (Task 17)
  const [healthDashboard, setHealthDashboard] = useState<any>(null);

  // Security Locker List (Task 4)
  const [lockedOutUsers, setLockedOutUsers] = useState<string[]>([]);

  // Mail Box State
  const [mails, setMails] = useState<MailMessage[]>([]);
  const [mailStatus, setMailStatus] = useState('');

  // Rankings State
  const [rankings, setRankings] = useState<PlayerProfile[]>([]);
  const [refreshingRankings, setRefreshingRankings] = useState(false);

  // Profile Form State (Task 10)
  const [profileAvatar, setProfileAvatar] = useState(saveState.characters['stormtrooper_luke']?.unlocked ? 'stormtrooper_luke' : 'stormtrooper_luke');
  const [profileTitle, setProfileTitle] = useState(saveState.equippedTitle || 'Beta Tester');
  const [profileBorder, setProfileBorder] = useState('none');
  const [favoriteFaction, setFavoriteFaction] = useState('Rebel');
  const [favoriteEra, setFavoriteEra] = useState('civil_war');
  const [showcaseSquad, setShowcaseSquad] = useState<string[]>([]);
  const [profileStatus, setProfileStatus] = useState('');

  // Admin Panel State (Tasks 4, 7, 8, 9)
  const [adminStatus, setAdminStatus] = useState('');
  const [targetAccountId, setTargetAccountId] = useState('');
  const [grantType, setGrantType] = useState<'credits' | 'crystals' | 'raidTokens' | 'character'>('credits');
  const [grantAmount, setGrantAmount] = useState(10000);
  const [grantCharId, setGrantCharId] = useState('captain_howzer');
  
  // Advanced Mail Broadcasting
  const [advMailTargetType, setAdvMailTargetType] = useState<'single' | 'group' | 'all'>('all');
  const [advMailTargetAccount, setAdvMailTargetAccount] = useState('');
  const [advMailSubject, setAdvMailSubject] = useState('');
  const [advMailBody, setAdvMailBody] = useState('');
  const [advMailCredits, setAdvMailCredits] = useState(0);
  const [advMailCrystals, setAdvMailCrystals] = useState(0);
  const [advMailRaidTokens, setAdvMailRaidTokens] = useState(0);

  // Save History (Task 4)
  const [backups, setBackups] = useState<SaveBackup[]>([]);
  const [selectedBackupAccount, setSelectedBackupAccount] = useState('');

  // Announcements Management (Task 7)
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnBody, setNewAnnBody] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newAnnCategory, setNewAnnCategory] = useState<'news' | 'update' | 'maintenance' | 'event' | 'developer_post' | 'emergency_notice'>('news');

  // Admin Audit Logs (Task 9)
  const [auditLogs, setAuditLogs] = useState<AdminLog[]>([]);
  const [matchLogs, setMatchLogs] = useState<any[]>([]);

  // Developer Panel State (Tasks 12, 13, 14)
  const [analytics, setAnalytics] = useState<any>(null);
  const [devStatus, setDevStatus] = useState('');
  const [economyMultiplier, setEconomyMultiplier] = useState<number>(1.0);
  const [devSeasonEra, setDevSeasonEra] = useState('civil_war');
  const [devSeasonPlanet, setDevSeasonPlanet] = useState('Tatooine');
  const [devTestRank, setDevTestRank] = useState(1200);
  const [devTestCharId, setDevTestCharId] = useState('stormtrooper_luke');
  const [devTestLevel, setDevTestLevel] = useState(85);
  const [devTestStars, setDevTestStars] = useState(7);
  const [devTestGear, setDevTestGear] = useState(13);
  const [devTestRelic, setDevTestRelic] = useState(5);
  
  const [simulatedOpponents, setSimulatedOpponents] = useState<any[]>([]);
  const [simulatedCP, setSimulatedCP] = useState<number | null>(null);

  const characters = getAllCharacters().filter(c => !c.isSummon);

  const availableTitles = [
    'Founder', 'Beta Tester', 'Clone Marshal', 'Jedi Master', 
    'Conqueror', 'Hero Of Endor', 'The Senate', 'Door Technician'
  ];

  const availableBorders = [
    { id: 'none', name: 'Standard Slate' },
    { id: 'bronze', name: 'Inquisitor Bronze' },
    { id: 'silver', name: 'Beskar Silver' },
    { id: 'gold', name: 'Kyber Gold' },
    { id: 'founder', name: 'Founder Crimson' },
    { id: 'beta', name: 'Beta Teal' }
  ];

  // --- Task 4 & 9: Friends State ---
  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [friendSearchResults, setFriendSearchResults] = useState<any[]>([]);
  const [friendStatusMsg, setFriendStatusMsg] = useState('');

  // --- Task 13 & 14: Settings State ---
  const [playerSettings, setPlayerSettings] = useState<any>({
    musicVolume: 80,
    soundVolume: 90,
    voiceVolume: 85,
    graphicsQuality: 'high',
    frameRate: '60',
    language: 'en',
    notifications: { unreadMail: true, newAnnouncement: true, dailyReset: true, energyFull: true },
    cloudSaveEnabled: true,
    privacy: { publicProfile: true, showCP: true, showFavoriteCharacter: true, showLastActive: true, allowFriendRequests: true }
  });

  // --- Task 5: Universal Notifications Status ---
  const [notifStatus, setNotifStatus] = useState<any>(null);

  // --- Task 15: Feedback Tool State ---
  const [feedbackType, setFeedbackType] = useState<'bug' | 'suggestion' | 'praise'>('bug');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('');

  // --- Task 10: Error Reports (Admin/Dev view) ---
  const [errorReports, setErrorReports] = useState<any[]>([]);
  const [feedbackReports, setFeedbackReports] = useState<any[]>([]);
  const [systemLogsList, setSystemLogsList] = useState<any[]>([]);

  // Fetch Friends
  const fetchFriends = async () => {
    try {
      const res = await NetworkManager.secureFetch('/api/friends/list');
      const data = await res.json();
      if (data.success) {
        setFriendsList(data.friends || []);
        setSentRequests(data.sentRequests || []);
        setReceivedRequests(data.receivedRequests || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Search Friends
  const searchFriends = async () => {
    if (!friendSearchQuery.trim()) return;
    try {
      const res = await NetworkManager.secureFetch('/api/friends/search', {
        method: 'POST',
        body: JSON.stringify({ query: friendSearchQuery })
      });
      const data = await res.json();
      if (data.success) {
        setFriendSearchResults(data.results || []);
      } else {
        setFriendStatusMsg(data.error || 'Search failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Friend actions
  const sendFriendRequest = async (targetId: string) => {
    try {
      const res = await NetworkManager.secureFetch('/api/friends/request', {
        method: 'POST',
        body: JSON.stringify({ targetAccountId: targetId })
      });
      const data = await res.json();
      setFriendStatusMsg(data.message || data.error);
      fetchFriends();
    } catch (err) {
      console.error(err);
    }
  };

  const acceptFriendRequest = async (targetId: string) => {
    try {
      const res = await NetworkManager.secureFetch('/api/friends/accept', {
        method: 'POST',
        body: JSON.stringify({ targetAccountId: targetId })
      });
      const data = await res.json();
      setFriendStatusMsg(data.message || data.error);
      fetchFriends();
    } catch (err) {
      console.error(err);
    }
  };

  const declineFriendRequest = async (targetId: string) => {
    try {
      const res = await NetworkManager.secureFetch('/api/friends/decline', {
        method: 'POST',
        body: JSON.stringify({ targetAccountId: targetId })
      });
      const data = await res.json();
      setFriendStatusMsg(data.message || data.error);
      fetchFriends();
    } catch (err) {
      console.error(err);
    }
  };

  const removeFriend = async (targetId: string) => {
    try {
      const res = await NetworkManager.secureFetch('/api/friends/remove', {
        method: 'POST',
        body: JSON.stringify({ targetAccountId: targetId })
      });
      const data = await res.json();
      setFriendStatusMsg(data.message || data.error);
      fetchFriends();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavoriteFriend = async (targetId: string) => {
    try {
      const res = await NetworkManager.secureFetch('/api/friends/toggle-favorite', {
        method: 'POST',
        body: JSON.stringify({ targetAccountId: targetId })
      });
      const data = await res.json();
      fetchFriends();
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Settings
  const fetchSettings = async () => {
    try {
      const res = await NetworkManager.secureFetch('/api/player/settings');
      const data = await res.json();
      if (data.success) {
        setPlayerSettings(data.settings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Settings
  const updateSettings = async (newSettings: any) => {
    const updated = { ...playerSettings, ...newSettings };
    setPlayerSettings(updated);
    try {
      await NetworkManager.secureFetch('/api/player/settings/update', {
        method: 'POST',
        body: JSON.stringify({ settings: updated })
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Notifications Status
  const fetchNotifStatus = async () => {
    try {
      const res = await NetworkManager.secureFetch('/api/notifications/status');
      const data = await res.json();
      if (data.success) {
        setNotifStatus(data.notifications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Feedback
  const submitFeedback = async () => {
    if (!feedbackMsg.trim()) {
      setFeedbackStatus('Please type a message before submitting.');
      return;
    }
    try {
      const res = await NetworkManager.secureFetch('/api/feedback/submit', {
        method: 'POST',
        body: JSON.stringify({
          type: feedbackType,
          message: feedbackMsg,
          version: '1.0.0-Production-Ready',
          device: 'Imperial Holotable Console'
        })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg('');
        setFeedbackStatus('✓ Tactical feedback synchronized successfully to developer core.');
      } else {
        setFeedbackStatus(data.error || 'Sync failed.');
      }
    } catch (err) {
      console.error(err);
      setFeedbackStatus('Error submitting feedback.');
    }
  };

  // Developer Quality of Life Resets
  const triggerDevQoLReset = async (type: 'daily' | 'weekly' | 'season' | 'maintenance-on' | 'maintenance-off' | 'grant' | 'reset-account' | 'dummies') => {
    try {
      let endpoint = '';
      let body: any = null;
      if (type === 'daily') endpoint = '/api/dev/force-daily-reset';
      else if (type === 'weekly') endpoint = '/api/dev/force-weekly-reset';
      else if (type === 'season') endpoint = '/api/dev/force-season-reset';
      else if (type === 'maintenance-on') { endpoint = '/api/dev/simulate-maintenance'; body = { active: true }; }
      else if (type === 'maintenance-off') { endpoint = '/api/dev/simulate-maintenance'; body = { active: false }; }
      else if (type === 'grant') endpoint = '/api/dev/grant-resources';
      else if (type === 'reset-account') endpoint = '/api/dev/reset-test-account';
      else if (type === 'dummies') endpoint = '/api/dev/create-dummy-accounts';

      const res = await NetworkManager.secureFetch(endpoint, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined
      });
      const data = await res.json();
      setAuthSuccess(data.message || 'Operation executed successfully');
      if (type === 'reset-account' || type === 'grant') {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch admin details
  const fetchAdminDetails = async () => {
    try {
      const [errRes, fbRes, sysRes] = await Promise.all([
        NetworkManager.secureFetch('/api/admin/errors/list'),
        NetworkManager.secureFetch('/api/admin/feedback/list'),
        NetworkManager.secureFetch('/api/admin/system-logs')
      ]);
      const errData = await errRes.json();
      const fbData = await fbRes.json();
      const sysData = await sysRes.json();
      if (errData.success) setErrorReports(errData.reports);
      if (fbData.success) setFeedbackReports(fbData.feedback);
      if (sysData.success) setSystemLogsList(sysData.logs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const acc = NetworkManager.getAccount();
    setAccount(acc);
    setIsOnline(NetworkManager.isOnline());
    
    if (acc) {
      fetchMails();
      fetchRankings();
      loadProfileData();
      fetchFriends();
      fetchSettings();
      fetchNotifStatus();
      if (acc.admin || acc.developer) {
        fetchAdminDetails();
      }
    }
  }, [activeSubTab]);

  const handleToggleOnline = async () => {
    const nextState = !isOnline;
    NetworkManager.setOnline(nextState);
    if (nextState) {
      const ping = await NetworkManager.checkConnection();
      setIsOnline(ping);
      if (ping && NetworkManager.getAccount()) {
        fetchMails();
        fetchRankings();
        await NetworkManager.uploadSave(saveState);
      }
    } else {
      setIsOnline(false);
    }
  };

  const loadProfileData = async () => {
    const acc = NetworkManager.getAccount();
    if (!acc) return;
    const profile = await NetworkManager.getProfile(acc.accountId);
    if (profile) {
      setProfileAvatar(profile.avatar || 'stormtrooper_luke');
      setProfileTitle(profile.title || 'Beta Tester');
      setProfileBorder(profile.profileBorder || 'none');
      setFavoriteFaction(profile.favoriteFaction || 'Rebel');
      setFavoriteEra(profile.favoriteEra || 'civil_war');
      setShowcaseSquad(profile.showcaseSquad || []);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setAuthError('Fill out all authorization fields.');
      return;
    }
    setLoading(true);
    setAuthError('');
    setAuthSuccess('');

    const res = await NetworkManager.authenticate(username, password, isRegistering);
    setLoading(false);
    
    if (res.success && res.account) {
      if (isRegistering && res.recoveryCode) {
        setRecoveryCodeToShow(res.recoveryCode);
        setTempAccount(res.account);
        setAuthSuccess('Commander cloud ID generated! Secure your recovery key below.');
      } else {
        setAccount(res.account);
        setAuthSuccess('Connection authenticated.');
        setIsOnline(true);
        await NetworkManager.uploadSave(saveState);
        fetchMails();
        fetchRankings();
        loadProfileData();
        setUsername('');
        setPassword('');
      }
    } else {
      setAuthError(res.error || 'Authentication rejected by security protocol.');
    }
  };

  const handleConfirmRecoveryCodeSaved = async () => {
    if (!tempAccount) return;
    setAccount(tempAccount);
    setIsOnline(true);
    await NetworkManager.uploadSave(saveState);
    fetchMails();
    fetchRankings();
    loadProfileData();
    setRecoveryCodeToShow('');
    setTempAccount(null);
    setUsername('');
    setPassword('');
    setAuthSuccess('Commander profile activated. Recovery key verified.');
  };

  const handleRecoverViaCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryUsername || !recoveryCodeInput || !recoveryNewPassword) {
      setAuthError('Please fill in all recovery fields.');
      return;
    }
    setLoading(true);
    setAuthError('');
    setAuthSuccess('');

    const res = await NetworkManager.recoverAccount(recoveryUsername, recoveryCodeInput, recoveryNewPassword);
    setLoading(false);

    if (res.success) {
      setAuthSuccess('Access restored! You can now log in using your new password.');
      setIsRecovering(false);
      setUsername(recoveryUsername);
      setRecoveryUsername('');
      setRecoveryCodeInput('');
      setRecoveryNewPassword('');
    } else {
      setAuthError(res.error || 'Failed to restore access. Please double check values.');
    }
  };

  const handleRecoverViaEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmailInput || !recoveryEmailPassword) {
      setAuthError('Fill in your email and the desired new password.');
      return;
    }
    setLoading(true);
    setAuthError('');
    setAuthSuccess('');

    const res = await NetworkManager.recoverViaEmail(recoveryEmailInput, recoveryEmailPassword);
    setLoading(false);

    if (res.success) {
      setAuthSuccess('Access restored! Login using your email-linked account credentials.');
      setIsEmailRecovering(false);
      setRecoveryEmailInput('');
      setRecoveryEmailPassword('');
    } else {
      setAuthError(res.error || 'No commander matching this verified email was located.');
    }
  };

  const handleLinkEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.includes('@')) {
      setEmailStatus('Provide a valid communication link address.');
      return;
    }
    setEmailStatus('Syncing linked email with network register...');
    const ok = await NetworkManager.linkEmail(emailInput);
    if (ok) {
      setEmailStatus('Email linked successfully! Secure validation key dispatched.');
      setAccount(NetworkManager.getAccount());
      setEmailInput('');
    } else {
      setEmailStatus('An error occurred during verification.');
    }
  };

  const handleVerifyEmail = async () => {
    setEmailStatus('Confirming validation key...');
    const ok = await NetworkManager.verifyEmail();
    if (ok) {
      setEmailStatus('Email verification flag confirmed.');
      setAccount(NetworkManager.getAccount());
    } else {
      setEmailStatus('Verification cycle failed.');
    }
  };

  const handleRemoveEmail = async () => {
    if (!confirm('Are you sure you want to decouple this communication link?')) return;
    setEmailStatus('Decoupling registry...');
    const ok = await NetworkManager.removeEmail();
    if (ok) {
      setEmailStatus('Communication channel removed.');
      setAccount(NetworkManager.getAccount());
    } else {
      setEmailStatus('Process rejected.');
    }
  };

  const handleLogout = () => {
    NetworkManager.logout();
    setAccount(null);
    setMails([]);
    setAuthSuccess('Disconnected from secure node.');
  };

  const fetchHealthDashboard = async () => {
    try {
      const res = await fetch('/api/admin/health-dashboard');
      const data = await res.json();
      if (data.success) {
        setHealthDashboard(data);
      }
    } catch (e) {
      console.error('Failed to load health status', e);
    }
  };

  const handleUnlockAccount = async (targetUser: string) => {
    if (!account) return;
    try {
      const res = await fetch('/api/admin/unlock-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: account.accountId, targetUsername: targetUser })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminStatus(data.message);
        fetchAdminLogs();
      } else {
        setAdminStatus(`Lockout clearing failed: ${data.error}`);
      }
    } catch (e) {
      setAdminStatus('Failed to transmit unlock command.');
    }
  };

  const handleBulkOperation = async () => {
    if (!account) return;
    setAdminStatus('Authorizing bulk transport...');
    let params: any = {};
    if (adminBulkOpType === 'currency') {
      params = { credits: bulkParamCredits, crystals: bulkParamCrystals };
    } else if (adminBulkOpType === 'mail') {
      params = { subject: bulkParamMailSubject, body: bulkParamMailBody, credits: bulkParamCredits, crystals: bulkParamCrystals };
    } else if (adminBulkOpType === 'character') {
      params = { characterId: bulkParamCharId };
    } else if (adminBulkOpType === 'title') {
      params = { title: bulkParamTitle };
    } else if (adminBulkOpType === 'border') {
      params = { border: bulkParamBorder };
    } else if (adminBulkOpType === 'flag') {
      params = { flag: bulkParamFlag };
    }

    try {
      const res = await fetch('/api/admin/bulk-operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: account.accountId,
          targetGroup: adminBulkGroup,
          operationType: adminBulkOpType,
          parameters: params
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminStatus(data.message);
        fetchDevAnalytics();
      } else {
        setAdminStatus(`Bulk transfer failed: ${data.error}`);
      }
    } catch (e) {
      setAdminStatus('Failed to execute bulk operation.');
    }
  };

  const fetchMails = async () => {
    if (!isOnline || !NetworkManager.getAccount()) return;
    const items = await NetworkManager.getMails();
    setMails(items);
  };

  const fetchRankings = async () => {
    setRefreshingRankings(true);
    const list = await NetworkManager.getRankings();
    setRankings(list);
    setRefreshingRankings(false);
  };

  const handleClaimMail = async (mailId: string) => {
    setMailStatus('Contacting network relay...');
    const res = await NetworkManager.claimMailReward(mailId);
    if (res.success && res.rewards) {
      setMailStatus('Logistics received.');
      const updated = { ...saveState };
      
      if (res.rewards.credits) updated.credits += Number(res.rewards.credits);
      if (res.rewards.crystals) updated.crystals += Number(res.rewards.crystals);
      if (res.rewards.raidTokens) {
        updated.inventory['raid_token'] = (updated.inventory['raid_token'] || 0) + Number(res.rewards.raidTokens);
      }
      if (res.rewards.eraCurrency) {
        updated.inventory['era_currency'] = (updated.inventory['era_currency'] || 0) + Number(res.rewards.eraCurrency);
      }
      if (res.rewards.shards) {
        res.rewards.shards.forEach((sh: any) => {
          updated.inventory[`shards_${sh.characterId}`] = (updated.inventory[`shards_${sh.characterId}`] || 0) + sh.amount;
        });
      }
      if (res.rewards.gear) {
        res.rewards.gear.forEach((g: any) => {
          updated.inventory[g.gearId] = (updated.inventory[g.gearId] || 0) + g.count;
        });
      }
      if (res.rewards.relicMaterials) {
        res.rewards.relicMaterials.forEach((rm: any) => {
          updated.inventory[rm.materialId] = (updated.inventory[rm.materialId] || 0) + rm.count;
        });
      }
      
      // Legacy unlock mapping support
      if ((res.rewards as any).unlockCharacterId) {
        const cid = (res.rewards as any).unlockCharacterId;
        if (updated.characters[cid]) {
          updated.characters[cid].unlocked = true;
          updated.characters[cid].level = Math.max(85, updated.characters[cid].level);
          updated.characters[cid].stars = Math.max(7, updated.characters[cid].stars);
          updated.characters[cid].gearTier = Math.max(13, updated.characters[cid].gearTier);
          updated.characters[cid].relicLevel = Math.max(9, updated.characters[cid].relicLevel);
        }
      }

      onUpdateSaveState(updated);
      await NetworkManager.uploadSave(updated);
      fetchMails();
    } else {
      setMailStatus('Failed to draw log supplies.');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus('Encrypting changes...');
    const success = await NetworkManager.updateProfile({
      avatar: profileAvatar,
      title: profileTitle,
      profileBorder,
      favoriteCharacter: profileAvatar,
      favoriteFaction,
      favoriteEra,
      showcaseSquad: showcaseSquad.length > 0 ? showcaseSquad : ['stormtrooper_luke']
    });

    if (success) {
      setProfileStatus('Holographic identity synchronized.');
      const updated = { ...saveState, equippedTitle: profileTitle };
      onUpdateSaveState(updated);
      await NetworkManager.uploadSave(updated);
      setAccount(NetworkManager.getAccount());
    } else {
      setProfileStatus('Failed to sync profile.');
    }
  };

  // Admin Actions (Task 4, 7, 8, 9)
  const handleAdminGrant = async () => {
    if (!targetAccountId) {
      setAdminStatus('Select target commander ID.');
      return;
    }
    setAdminStatus('Processing administrative requisition...');
    const res = await NetworkManager.triggerAdminAction('grant', {
      targetAccountId,
      type: grantType,
      itemId: grantType === 'character' ? grantCharId : undefined,
      amount: grantAmount
    });

    if (res.success) {
      setAdminStatus(`Command request executed: ${res.message}`);
      fetchRankings();
    } else {
      setAdminStatus(`Failed to execute: ${res.error}`);
    }
  };

  const handleSelectMailTemplate = async (templateId: string) => {
    setSelectedMailTemplateId(templateId);
    if (!templateId) return;
    try {
      const res = await fetch('/api/admin/mail/templates');
      const data = await res.json();
      if (data.success && data.templates) {
        const selected = data.templates.find((t: any) => t.id === templateId);
        if (selected) {
          setAdvMailSubject(selected.subject);
          setAdvMailBody(selected.body);
          setAdvMailCredits(selected.rewards.credits || 0);
          setAdvMailCrystals(selected.rewards.crystals || 0);
        }
      }
    } catch (e) {
      console.error('Failed to pre-populate mail template', e);
    }
  };

  const handleSendAdvancedMail = async () => {
    if (!advMailSubject || !advMailBody) {
      setAdminStatus('Fill in subject and message body.');
      return;
    }
    setAdminStatus('Drafting logistics parameters...');
    const rewards: any = {};
    if (advMailCredits > 0) rewards.credits = advMailCredits;
    if (advMailCrystals > 0) rewards.crystals = advMailCrystals;
    if (advMailRaidTokens > 0) rewards.raidTokens = advMailRaidTokens;

    const res = await NetworkManager.sendAdvancedMail({
      targetType: advMailTargetType,
      targetAccountId: advMailTargetType === 'single' ? advMailTargetAccount : undefined,
      subject: advMailSubject,
      body: advMailBody,
      rewards
    });

    if (res.success) {
      setAdminStatus('Advanced multi-reward mail broad-relayed successfully.');
      setAdvMailSubject('');
      setAdvMailBody('');
      setAdvMailCredits(0);
      setAdvMailCrystals(0);
      setAdvMailRaidTokens(0);
    } else {
      setAdminStatus(`Relay failure: ${res.error}`);
    }
  };

  const handleFetchBackups = async () => {
    if (!selectedBackupAccount) {
      setAdminStatus('Please select a target account ID.');
      return;
    }
    setAdminStatus('Retrieving secure cloud history backups...');
    const list = await NetworkManager.getSaveBackups(selectedBackupAccount);
    setBackups(list);
    setAdminStatus(`Located ${list.length} restorable backup slots.`);
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (!confirm('Restore user profile to this historical image? Current progress will be archived.')) return;
    setAdminStatus('Instructing server node restore protocol...');
    const ok = await NetworkManager.restoreSaveBackup(selectedBackupAccount, backupId);
    if (ok) {
      setAdminStatus('Cloud profile successfully re-imaged.');
      handleFetchBackups();
    } else {
      setAdminStatus('Restore request rejected by server.');
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnBody) return;
    setAdminStatus('Publishing Holonet bulletin...');
    const ok = await NetworkManager.createAnnouncement(newAnnTitle, newAnnBody, newAnnPriority, newAnnCategory);
    if (ok) {
      setAdminStatus('Announcement broadcast published to active Holotables.');
      setNewAnnTitle('');
      setNewAnnBody('');
      fetchAnnouncements();
    } else {
      setAdminStatus('Bulletin submission failed.');
    }
  };

  const handleArchiveAnnouncement = async (id: string, state: boolean) => {
    setAdminStatus('Updating Holonet bulletin register...');
    const ok = await NetworkManager.archiveAnnouncement(id, state);
    if (ok) {
      setAdminStatus('Registry updated.');
      fetchAnnouncements();
    } else {
      setAdminStatus('Action refused.');
    }
  };

  const fetchAnnouncements = async () => {
    const list = await NetworkManager.getAnnouncements();
    setAnnouncements(list);
  };

  const fetchAdminLogs = async () => {
    setAdminStatus('Retrieving high security console audit logs...');
    const logs = await NetworkManager.getAuditLogs();
    setAuditLogs(logs);
  };

  const handleAdminBan = async (accountIdToBan: string, banState: boolean) => {
    const action = banState ? 'ban' : 'unban';
    if (!confirm(`Are you sure you want to execute ${action} orders on this commander?`)) return;
    
    setAdminStatus(`Executing status directive...`);
    const res = await NetworkManager.triggerAdminAction('ban', {
      targetAccountId: accountIdToBan,
      ban: banState
    });

    if (res.success) {
      setAdminStatus(res.message);
      fetchRankings();
    } else {
      setAdminStatus(res.error);
    }
  };

  const handleAdminReset = async (accountIdToReset: string) => {
    if (!confirm('Are you sure you want to purge this save? This is irreversible.')) return;
    setAdminStatus('Wiping remote sectors...');
    const res = await NetworkManager.triggerAdminAction('reset-player', {
      targetAccountId: accountIdToReset
    });

    if (res.success) {
      setAdminStatus(res.message);
      fetchRankings();
    } else {
      setAdminStatus(res.error);
    }
  };

  const fetchAdminMatchLogs = async () => {
    const logs = await NetworkManager.getMatchLogs();
    setMatchLogs(logs);
  };

  // Developer overrides
  const handleOverrideSeason = async () => {
    setDevStatus('Publishing developer planetary variables...');
    const ok = await NetworkManager.overrideSeason(devSeasonEra, devSeasonPlanet);
    if (ok) {
      setDevStatus('Planetary variables successfully synchronized.');
    } else {
      setDevStatus('Overrides refused by security master.');
    }
  };

  const handleSimulateMatchmaking = async () => {
    setDevStatus('Calculating PvP matching candidates...');
    const res = await NetworkManager.testMatchmaking(devTestRank);
    if (res && res.success) {
      setSimulatedOpponents(res.simulatedOpponents || []);
      setDevStatus(`Simulation complete. Found ${res.simulatedOpponents.length} valid matchmaking pairings.`);
    } else {
      setDevStatus('Matchmaking calculations failed.');
    }
  };

  const handleTestCharacterCP = async () => {
    setDevStatus('Initiating mathematical CP compilation...');
    const res = await NetworkManager.testCharacter(devTestCharId, devTestLevel, devTestStars, devTestGear, devTestRelic);
    if (res && res.success) {
      setSimulatedCP(res.simulatedCP);
      setDevStatus(`Simulation computed CP: ${res.simulatedCP.toLocaleString()} GP`);
    } else {
      setDevStatus('Computation rejected due to validation failure.');
    }
  };

  const handleUpdateEconomy = () => {
    setDevStatus('Logistics rate adjusted.');
  };

  const handleShowcaseToggle = (cid: string) => {
    if (showcaseSquad.includes(cid)) {
      setShowcaseSquad(showcaseSquad.filter(id => id !== cid));
    } else {
      if (showcaseSquad.length >= 5) return;
      setShowcaseSquad([...showcaseSquad, cid]);
    }
  };

  const fetchDevAnalytics = async () => {
    const data = await NetworkManager.getAnalytics();
    if (data && data.success) {
      setAnalytics(data.analytics);
    }
  };

  const handleDownloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([`GALACTIC LEGENDS COMMANDER RECOVERY CODE\nUsername: ${tempAccount?.username}\nRecovery Key: ${recoveryCodeToShow}\n\nKeep this code private and secure. If you lose your credentials, enter this key to restore access.`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `galactic_legends_recovery_${tempAccount?.username}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={inline ? "w-full" : "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"} id="online_panel_root">
      <div className={inline ? "relative w-full h-[75vh] bg-zinc-950 border border-cyan-500/30 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(6,182,212,0.15)]" : "relative w-full max-w-6xl h-[90vh] bg-zinc-950 border border-cyan-500/30 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(6,182,212,0.15)]"}>
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-80 bg-zinc-950 border-r border-zinc-900 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <Globe className="w-5 h-5 text-cyan-400 animate-spin-slow" />
              </div>
              <div>
                <h2 className="font-display font-black text-white text-md tracking-widest uppercase">Holonet Terminal</h2>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Global Comms Network</span>
              </div>
            </div>

            <nav className="space-y-1">
              <button 
                onClick={() => setActiveSubTab('account')}
                className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center gap-3 ${activeSubTab === 'account' ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
              >
                <User className="w-4 h-4" /> Commander Secure ID
              </button>
              
              <button 
                onClick={() => { setActiveSubTab('mail'); fetchMails(); }}
                className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center justify-between ${activeSubTab === 'mail' ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
              >
                <span className="flex items-center gap-3">
                  <Mail className="w-4 h-4" /> Message Inbox
                </span>
                {mails.filter(m => !m.claimed).length > 0 && (
                  <span className="bg-cyan-500 text-black px-1.5 py-0.5 rounded-full text-[8px] font-black">
                    {mails.filter(m => !m.claimed).length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => { setActiveSubTab('profile'); loadProfileData(); }}
                className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center gap-3 ${activeSubTab === 'profile' ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
              >
                <Settings className="w-4 h-4" /> Holographic Profile
              </button>

              <button 
                onClick={() => { setActiveSubTab('leaderboard'); fetchRankings(); }}
                className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center gap-3 ${activeSubTab === 'leaderboard' ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
              >
                <Trophy className="w-4 h-4" /> Siege Leaderboard
              </button>

              <button 
                onClick={() => { setActiveSubTab('friends'); fetchFriends(); }}
                className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center justify-between ${activeSubTab === 'friends' ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
              >
                <span className="flex items-center gap-3">
                  <Users className="w-4 h-4" /> Allied Fleet Links
                </span>
                {receivedRequests.length > 0 && (
                  <span className="bg-cyan-500 text-black px-1.5 py-0.5 rounded-full text-[8px] font-black">
                    {receivedRequests.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => { setActiveSubTab('settings'); }}
                className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center gap-3 ${activeSubTab === 'settings' ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
              >
                <Settings className="w-4 h-4" /> Account Settings
              </button>

              <button 
                onClick={() => { setActiveSubTab('feedback'); }}
                className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center gap-3 ${activeSubTab === 'feedback' ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
              >
                <MessageSquare className="w-4 h-4" /> Submit Intelligence
              </button>

              {account?.admin && (
                <button 
                  onClick={() => { setActiveSubTab('admin'); fetchAnnouncements(); fetchAdminLogs(); }}
                  className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-black transition flex items-center gap-3 ${activeSubTab === 'admin' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' : 'text-amber-500/60 hover:text-amber-400 hover:bg-zinc-900'}`}
                >
                  <Shield className="w-4 h-4" /> Administrator Panel
                </button>
              )}

              {account?.developer && (
                <button 
                  onClick={() => { setActiveSubTab('dev'); fetchDevAnalytics(); }}
                  className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-black transition flex items-center gap-3 ${activeSubTab === 'dev' ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400' : 'text-purple-500/60 hover:text-purple-400 hover:bg-zinc-900'}`}
                >
                  <Activity className="w-4 h-4" /> Developer Overrides
                </button>
              )}
            </nav>
          </div>

          <div className="pt-4 border-t border-zinc-900">
            <button 
              onClick={handleToggleOnline}
              className={`w-full py-2.5 px-4 rounded-xl font-mono text-[10px] font-bold border transition flex items-center justify-center gap-2 ${isOnline ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/20' : 'bg-red-950/20 border-red-500/30 text-red-400 hover:bg-red-900/20'}`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 animate-pulse" /> NETWORK ONLINE
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" /> NETWORK OFFLINE
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto bg-zinc-950 p-6 md:p-8">
          
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6 shrink-0">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">Holographic Secure Console</span>
              <h1 className="text-2xl font-black font-display text-white uppercase tracking-wider mt-1">
                {activeSubTab === 'account' && 'Secure Console Log'}
                {activeSubTab === 'mail' && 'Directives & Message Hub'}
                {activeSubTab === 'profile' && 'Holographic Identity'}
                {activeSubTab === 'leaderboard' && 'Galactic Siege Standings'}
                {activeSubTab === 'friends' && 'Allied Fleet Connections'}
                {activeSubTab === 'settings' && 'Account Settings & Controls'}
                {activeSubTab === 'feedback' && 'Intelligence & Diagnostics Feed'}
                {activeSubTab === 'admin' && 'Imperial Overlord Command'}
                {activeSubTab === 'dev' && 'Core Analytics Dashboard'}
              </h1>
            </div>
            <button onClick={onClose} className="px-4 py-2 border border-zinc-800 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-white font-mono text-xs font-bold transition">
              CLOSE (ESC)
            </button>
          </div>

          {/* Sub Tab Bodies */}
          <div className="flex-1 overflow-y-auto pb-6">

            {/* Account Management & Recovery Systems */}
            {activeSubTab === 'account' && (
              <div className="max-w-xl space-y-6">
                {!account ? (
                  <div className="space-y-4">
                    {/* HOLOGRAPHIC RECOVERY DISPLAY */}
                    {recoveryCodeToShow ? (
                      <div className="p-6 border border-cyan-500/40 bg-cyan-950/20 rounded-2xl space-y-4 font-mono text-xs">
                        <h3 className="text-sm font-black text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
                          ⚠️ SECURE KEY GENERATION PROTOCOL
                        </h3>
                        <p className="text-zinc-300 leading-relaxed">
                          Your profile has been created. The server stores a secure hash of your password. In case of lost credentials, use this raw recovery key. It will **NOT** be shown again.
                        </p>
                        <div className="bg-black/80 border border-cyan-500/30 p-4 rounded-xl text-center text-lg font-black text-cyan-300 select-all tracking-widest print:bg-white print:text-black">
                          {recoveryCodeToShow}
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(recoveryCodeToShow);
                              setAuthSuccess('Recovery key copied to local clip memory!');
                            }}
                            className="flex-1 min-w-[120px] py-2 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 font-bold rounded-lg flex items-center justify-center gap-1.5 transition text-[10px]"
                          >
                            <Copy className="w-3.5 h-3.5" /> COPY KEY
                          </button>
                          <button 
                            onClick={handleDownloadCode}
                            className="flex-1 min-w-[120px] py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition text-[10px]"
                          >
                            <Download className="w-3.5 h-3.5" /> DOWNLOAD (.TXT)
                          </button>
                          <button 
                            onClick={() => {
                              window.print();
                            }}
                            className="flex-1 min-w-[120px] py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-black rounded-lg flex items-center justify-center gap-1.5 transition text-[10px]"
                          >
                            <Printer className="w-3.5 h-3.5" /> PRINT KEY
                          </button>
                        </div>
                        
                        <div className="p-3 bg-zinc-950/40 border border-zinc-900 rounded-xl flex items-center gap-2.5">
                          <input 
                            type="checkbox"
                            id="ack_saved_key"
                            checked={acknowledgedCode}
                            onChange={(e) => setAcknowledgedCode(e.target.checked)}
                            className="rounded border-zinc-800 bg-zinc-950 text-cyan-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                          />
                          <label htmlFor="ack_saved_key" className="text-[10px] text-zinc-400 leading-normal select-none cursor-pointer hover:text-white">
                            I have saved my recovery code. I understand it is my sole method for emergency restoration.
                          </label>
                        </div>

                        <button 
                          onClick={handleConfirmRecoveryCodeSaved}
                          disabled={!acknowledgedCode}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black font-mono text-xs rounded-xl uppercase tracking-wider transition mt-4"
                        >
                          ✓ INITIALIZE CLOUD RETAIN
                        </button>
                      </div>
                    ) : isRecovering ? (
                      /* RECOVERY VIA CODE FORM */
                      <form onSubmit={handleRecoverViaCode} className="space-y-4 font-mono text-xs">
                        <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest">Restoration via Key</h3>
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase mb-1.5">Commander Username</label>
                          <input 
                            type="text"
                            value={recoveryUsername}
                            onChange={e => setRecoveryUsername(e.target.value)}
                            placeholder="Designation code..."
                            className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase mb-1.5">Recovery Code Key</label>
                          <input 
                            type="text"
                            value={recoveryCodeInput}
                            onChange={e => setRecoveryCodeInput(e.target.value)}
                            placeholder="XXXX-XXXX-XXXX"
                            className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-amber-500 uppercase"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase mb-1.5">New Password</label>
                          <input 
                            type="password"
                            value={recoveryNewPassword}
                            onChange={e => setRecoveryNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button 
                            type="button"
                            onClick={() => setIsRecovering(false)}
                            className="flex-1 py-3 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 rounded-xl uppercase font-bold"
                          >
                            Back
                          </button>
                          <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl uppercase"
                          >
                            {loading ? 'Validating...' : 'RESET PASSKEY'}
                          </button>
                        </div>
                      </form>
                    ) : isEmailRecovering ? (
                      /* RECOVERY VIA EMAIL FORM */
                      <form onSubmit={handleRecoverViaEmail} className="space-y-4 font-mono text-xs">
                        <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest">Restoration via Email</h3>
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase mb-1.5">Registered Email Address</label>
                          <input 
                            type="email"
                            value={recoveryEmailInput}
                            onChange={e => setRecoveryEmailInput(e.target.value)}
                            placeholder="commander@republic.net"
                            className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase mb-1.5">New Password</label>
                          <input 
                            type="password"
                            value={recoveryEmailPassword}
                            onChange={e => setRecoveryEmailPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button 
                            type="button"
                            onClick={() => setIsEmailRecovering(false)}
                            className="flex-1 py-3 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 rounded-xl uppercase font-bold"
                          >
                            Back
                          </button>
                          <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-black rounded-xl uppercase"
                          >
                            {loading ? 'Scanning...' : 'DISPATCH PASSKEY'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* LOGIN / REGISTER FORM */
                      <div className="space-y-4">
                        <p className="text-sm text-zinc-400 font-mono leading-relaxed">
                          Initialize or connect to a cloud commander profile. Cloud backups allow you to secure your roster achievements, title progress, and engage in the **Galactic Siege PvP Arena**.
                        </p>

                        <form onSubmit={handleAuth} className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Commander Username</label>
                            <input 
                              type="text"
                              value={username}
                              onChange={e => setUsername(e.target.value)}
                              placeholder="Designation code..."
                              className="w-full bg-zinc-950/60 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500 font-mono text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Node Password</label>
                            <input 
                              type="password"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-zinc-950/60 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500 font-mono text-sm"
                            />
                          </div>

                          {authError && (
                            <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-xs text-red-400 font-mono flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 shrink-0" /> {authError}
                            </div>
                          )}

                          {authSuccess && (
                            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-mono flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 shrink-0" /> {authSuccess}
                            </div>
                          )}

                          <div className="flex gap-3 pt-2">
                            <button 
                              type="submit"
                              disabled={loading}
                              className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-black font-black font-mono text-xs rounded-xl uppercase tracking-wider transition shadow-glow"
                            >
                              {loading ? 'Transmitting...' : (isRegistering ? 'INITIALIZE CLOUD ID' : 'CONNECT CLOUD ID')}
                            </button>
                          </div>
                        </form>

                        <div className="flex flex-col gap-2 pt-2 items-center text-center">
                          <button 
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-xs text-cyan-400/80 hover:text-cyan-400 font-mono underline"
                          >
                            {isRegistering ? 'Already have a secure node connection? Log In' : 'No account? Establish cloud connection now'}
                          </button>
                          
                          <div className="flex gap-4 pt-1">
                            <button 
                              onClick={() => { setIsRecovering(true); setAuthError(''); setAuthSuccess(''); }}
                              className="text-[10px] text-amber-500/80 hover:text-amber-400 font-mono underline"
                            >
                              Lost Password? Recover with Key
                            </button>
                            <button 
                              onClick={() => { setIsEmailRecovering(true); setAuthError(''); setAuthSuccess(''); }}
                              className="text-[10px] text-cyan-500/80 hover:text-cyan-400 font-mono underline"
                            >
                              Recover via Linked Email
                            </button>
                          </div>
                        </div>

                        <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-2xl text-xs text-zinc-500 font-mono leading-relaxed space-y-2">
                          <p className="text-zinc-400 font-bold uppercase tracking-wider">🔒 Anti-Overlap Security Protocol</p>
                          <p>• All cloud account generation is validated against global designation registers to prevent user profiles from overlapping.</p>
                          <p>• Logging in automatically fetches your remote save with automated conflict verification.</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/20 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-950 to-indigo-950 flex items-center justify-center border border-cyan-500/40">
                          <User className="text-cyan-400 w-8 h-8" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-xl text-white font-display">{account.username}</h3>
                            {account.admin && <span className="text-[8px] bg-amber-950 border border-amber-500/40 text-amber-400 px-1.5 py-0.5 rounded font-black uppercase tracking-widest">Admin</span>}
                          </div>
                          <p className="text-xs text-zinc-500 font-mono mt-1">SECURE ID: {account.accountId}</p>
                          <p className="text-xs text-cyan-400 font-mono mt-0.5">Title: {profileTitle}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-xs">
                        <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-900">
                          <span className="text-zinc-500 block uppercase text-[10px]">Collection Power</span>
                          <span className="text-cyan-400 font-bold text-sm mt-1 block">{calculateCollectionPower(saveState).toLocaleString()} GP</span>
                        </div>
                        <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-900">
                          <span className="text-zinc-500 block uppercase text-[10px]">Direct Connection</span>
                          <span className="text-emerald-400 font-bold text-sm mt-1 block">SECURE ACTIVE</span>
                        </div>
                      </div>
                    </div>

                    {/* EMAIL LINKING SYSTEM (TASK 3) */}
                    <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/10 space-y-4">
                      <h3 className="font-display font-black text-sm text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-4 h-4" /> SECURE COMMUNICATION CHANNELS
                      </h3>
                      {account.email ? (
                        <div className="space-y-3 font-mono text-xs">
                          <div className="p-3 bg-black/40 border border-zinc-900 rounded-xl flex items-center justify-between">
                            <div>
                              <span className="text-zinc-500 block text-[9px] uppercase">LINKED ADDRESS</span>
                              <span className="text-white font-bold">{account.email}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${account.emailVerified ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'}`}>
                              {account.emailVerified ? 'VERIFIED' : 'PENDING'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {!account.emailVerified && (
                              <button 
                                onClick={handleVerifyEmail}
                                className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-black text-[10px] rounded-lg uppercase transition"
                              >
                                VALIDATE CHANNEL
                              </button>
                            )}
                            <button 
                              onClick={handleRemoveEmail}
                              className="flex-1 py-2 border border-red-500/30 hover:bg-red-950/10 text-red-400 font-bold text-[10px] rounded-lg uppercase transition"
                            >
                              DECOUPLE EMAIL
                            </button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleLinkEmail} className="space-y-3 font-mono text-xs">
                          <p className="text-zinc-500 leading-relaxed text-[10px]">
                            Linking an optional email provides an alternative pathway for account restoration and high priority logistic notifications.
                          </p>
                          <div className="flex gap-2">
                            <input 
                              type="email"
                              required
                              value={emailInput}
                              onChange={e => setEmailInput(e.target.value)}
                              placeholder="commander@galaxy.net"
                              className="flex-1 bg-zinc-950 border border-zinc-850 p-2.5 rounded-lg text-white font-mono text-xs outline-none focus:border-cyan-500"
                            />
                            <button 
                              type="submit"
                              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase rounded-lg text-[10px]"
                            >
                              LINK CHANNEL
                            </button>
                          </div>
                        </form>
                      )}
                      {emailStatus && (
                        <p className="text-[10px] text-cyan-400 font-mono">{emailStatus}</p>
                      )}
                    </div>

                    {/* RECOVERY KEY PROTOCOLS */}
                    <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/10 space-y-4">
                      <h3 className="font-display font-black text-sm text-amber-500 uppercase tracking-widest flex items-center gap-2">
                        <Key className="w-4 h-4" /> RECOVERY KEY PROTOCOLS
                      </h3>
                      <p className="text-zinc-500 text-[10px] leading-relaxed">
                        If you lose your password, your recovery key can restore access to your account. Store it in a safe, offline location.
                      </p>
                      {recoveryCodeToShow ? (
                        <div className="p-4 border border-amber-500/40 bg-amber-950/20 rounded-xl space-y-3 font-mono text-[10px]">
                          <span className="text-amber-400 font-bold block uppercase">NEW RECOVERY KEY GENERATED:</span>
                          <div className="bg-black border border-amber-500/30 p-2.5 rounded-lg text-center text-sm font-black text-amber-300 tracking-wider select-all">
                            {recoveryCodeToShow}
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(recoveryCodeToShow);
                                setAuthSuccess('New key copied to clipboard.');
                              }}
                              className="flex-1 py-1.5 border border-amber-500/30 hover:border-amber-400 text-amber-400 font-bold rounded text-[10px]"
                            >
                              COPY
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRecoveryCodeToShow('');
                              }}
                              className="flex-1 py-1.5 bg-zinc-850 hover:bg-zinc-800 text-white font-bold rounded text-[10px]"
                            >
                              DISMISS
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={async () => {
                            if (!confirm('Are you sure you want to invalidate your current recovery key and generate a new one? Your previous key will be voided.')) return;
                            try {
                              const res = await NetworkManager.secureFetch('/api/account/regenerate-recovery-key', { method: 'POST' });
                              const data = await res.json();
                              if (res.ok && data.success) {
                                setRecoveryCodeToShow(data.recoveryCode);
                                setAuthSuccess('New recovery code generated successfully!');
                              } else {
                                alert('Failed to regenerate key: ' + (data.error || 'Server error'));
                              }
                            } catch (e) {
                              alert('Network relay failure.');
                            }
                          }}
                          className="w-full py-2.5 border border-amber-500/30 hover:bg-amber-950/10 text-amber-500 font-mono text-xs font-bold rounded-xl uppercase tracking-wider transition"
                        >
                          REGENERATE SECURE RECOVERY KEY
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <button 
                        onClick={() => {
                          setMailStatus('Syncing save state with Holonet servers...');
                          NetworkManager.uploadSave(saveState).then(ok => {
                            setMailStatus(ok ? 'Backup complete.' : 'Upload failed.');
                          });
                        }}
                        className="w-full py-3 border border-zinc-800 hover:bg-zinc-900 text-white font-mono text-xs font-bold rounded-xl uppercase tracking-wider transition"
                      >
                        MANUALLY TRIGGER CLOUD BACKUP
                      </button>

                      <button 
                        onClick={handleLogout}
                        className="w-full py-3 bg-red-950/20 border border-red-500/20 hover:bg-red-900/20 text-red-400 font-mono text-xs font-black rounded-xl uppercase tracking-wider transition"
                      >
                        TERMINATE TERMINAL SESSION
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Allied Fleet Connections (Friends Tab) */}
            {activeSubTab === 'friends' && (
              <div className="space-y-6">
                {/* Search / Add Friend Section */}
                <div className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80 space-y-4">
                  <h3 className="text-sm font-black font-mono text-cyan-400 uppercase tracking-wide flex items-center gap-2">
                    <Plus className="w-4 h-4" /> RECRUIT NEW ALLIED COMMANDER
                  </h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter Commander ID or name designation..."
                      value={friendSearchQuery}
                      onChange={(e) => setFriendSearchQuery(e.target.value)}
                      className="flex-1 bg-black/60 border border-zinc-800 focus:border-cyan-500 rounded-xl px-4 py-2 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none"
                    />
                    <button 
                      onClick={searchFriends}
                      className="bg-cyan-600 hover:bg-cyan-500 text-black font-black font-mono text-xs px-5 py-2 rounded-xl transition"
                    >
                      SEARCH
                    </button>
                  </div>
                  {friendStatusMsg && (
                    <p className="text-[10px] font-mono text-cyan-400">{friendStatusMsg}</p>
                  )}
                  {friendSearchResults.length > 0 && (
                    <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-900 bg-black/40">
                      {friendSearchResults.map((f) => (
                        <div key={f.accountId} className="p-3 flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center border border-zinc-700/50">
                              <User className="w-4 h-4 text-zinc-400" />
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                {f.username}
                                <span className="text-[9px] text-zinc-500">Lvl {f.level}</span>
                              </div>
                              <div className="text-[10px] text-zinc-500">CP: {f.collectionPower.toLocaleString()}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => sendFriendRequest(f.accountId)}
                            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold px-3 py-1 rounded text-[10px]"
                          >
                            DISPATCH REQUEST
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Received Pending Requests */}
                {receivedRequests.length > 0 && (
                  <div className="bg-amber-950/10 border border-amber-500/20 p-5 rounded-2xl space-y-3">
                    <h3 className="text-xs font-black font-mono text-amber-400 uppercase tracking-wide flex items-center gap-2">
                      ⚠️ INBOUND ALLIED SIGNALS ({receivedRequests.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {receivedRequests.map((r) => (
                        <div key={r.accountId} className="bg-black/40 border border-zinc-900 p-3 rounded-xl flex items-center justify-between font-mono text-xs">
                          <div>
                            <div className="font-bold text-white">{r.username}</div>
                            <div className="text-[10px] text-zinc-500">Level {r.level}</div>
                          </div>
                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => acceptFriendRequest(r.accountId)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded text-[9px]"
                            >
                              ACCEPT
                            </button>
                            <button 
                              onClick={() => declineFriendRequest(r.accountId)}
                              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold px-2 py-1 rounded text-[9px]"
                            >
                              DECLINE
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sent Pending Requests */}
                {sentRequests.length > 0 && (
                  <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl space-y-3">
                    <h3 className="text-xs font-black font-mono text-zinc-400 uppercase tracking-wide">
                      OUTBOUND SIGNALS DEPLOYED ({sentRequests.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sentRequests.map((s) => (
                        <div key={s.accountId} className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-900 flex items-center justify-between font-mono text-xs">
                          <span className="text-zinc-300">{s.username}</span>
                          <span className="text-[9px] text-zinc-600 uppercase">TRANSMITTING...</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Allied list */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <h3 className="text-sm font-black font-mono text-white uppercase tracking-wider">
                      ALLIED COMMISSIONS ({friendsList.length} / 50)
                    </h3>
                    <button onClick={fetchFriends} className="text-xs font-mono text-cyan-400 underline">Sync Fleet</button>
                  </div>

                  {friendsList.length === 0 ? (
                    <div className="p-12 border border-zinc-900 rounded-2xl bg-zinc-900/5 text-center font-mono space-y-2">
                      <Users className="w-8 h-8 text-zinc-700 mx-auto" />
                      <p className="text-zinc-500 text-sm">No allied fleet links currently active.</p>
                      <p className="text-zinc-600 text-xs">Dispatch transmissions above to recruit allies.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {friendsList.map((f) => (
                        <div 
                          key={f.accountId} 
                          className={`p-4 rounded-2xl border transition-all relative ${
                            f.isFavorite 
                              ? 'bg-gradient-to-br from-cyan-950/20 to-zinc-950 border-cyan-500/30 shadow-lg shadow-cyan-950/10' 
                              : 'bg-zinc-950/50 border-zinc-900 hover:border-zinc-800'
                          }`}
                        >
                          {/* Favorite Tag */}
                          <button 
                            onClick={() => toggleFavoriteFriend(f.accountId)}
                            className="absolute top-4 right-4 text-zinc-600 hover:text-rose-500 transition"
                          >
                            <Heart className={`w-4 h-4 ${f.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-cyan-400 relative">
                              <User className="w-5 h-5 text-zinc-400" />
                              <span className="absolute -bottom-1 -right-1 bg-cyan-600 text-black font-black text-[8px] px-1 rounded">
                                {f.level}
                              </span>
                            </div>
                            
                            <div>
                              <div className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                                {f.username}
                                {f.isFavorite && (
                                  <span className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">
                                    ELITE ALLY
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-zinc-500 font-mono">
                                CP: {f.collectionPower ? f.collectionPower.toLocaleString() : '1,500'}
                              </div>
                              <div className="text-[9px] text-zinc-600 font-mono">
                                Active: {new Date(f.lastActive).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-zinc-900/60 flex items-center justify-between text-[10px] font-mono">
                            <span className="text-zinc-500">Showcase: {f.favoriteCharacter ? f.favoriteCharacter.replace('_', ' ') : 'N/A'}</span>
                            <button 
                              onClick={() => removeFriend(f.accountId)}
                              className="text-red-500/70 hover:text-red-500 font-bold uppercase transition"
                            >
                              DISCHARGE
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* System Preferences & Settings */}
            {activeSubTab === 'settings' && (
              <div className="max-w-xl space-y-6 font-mono text-xs text-zinc-300 animate-fadeIn">
                {/* Profile Rename Section */}
                <div className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80 space-y-4 text-left">
                  <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" /> CHANGE COMMANDER NAME
                  </h3>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={saveState.playerName} 
                      onChange={(e) => {
                        const copy = { ...saveState };
                        copy.playerName = e.target.value;
                        onUpdateSaveState(copy);
                      }}
                      className="bg-black/60 border border-zinc-700 rounded-xl px-4 py-3 w-full text-white font-mono focus:outline-none focus:border-cyan-500 transition text-sm"
                      placeholder="Commander Name"
                    />
                  </div>
                </div>

                {/* Statistics panel */}
                <div className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80 space-y-4 text-left">
                  <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4" /> ROSTER STRATEGIC METRICS
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-500 text-[10px] uppercase">Galactic Power</span>
                      <span className="text-cyan-400 font-bold text-sm">
                        {Object.values(saveState.characters || {}).reduce((sum, c) => {
                          if (!c.unlocked) return sum;
                          const starPower = c.stars * 1200;
                          const levelPower = c.level * 150;
                          const gearPower = c.gearTier * 800;
                          const relicPower = (c.relicLevel || 0) * 1000;
                          const legendPower = (c.legendLevel || 0) * 1500;
                          return sum + starPower + levelPower + gearPower + relicPower + legendPower;
                        }, 0).toLocaleString()} GP
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-500 text-[10px] uppercase">Unlocked Characters</span>
                      <span className="text-zinc-200 font-bold text-sm">
                        {Object.values(saveState.characters || {}).filter(c => c.unlocked).length} / {Object.keys(saveState.characters || {}).length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-500 text-[10px] uppercase">Liquid Credits</span>
                      <span className="text-amber-500 font-bold text-sm">{saveState.credits.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-500 text-[10px] uppercase">Reserve Crystals</span>
                      <span className="text-purple-400 font-bold text-sm">{saveState.crystals.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Commander Test Reinforcements */}
                <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-4 text-left">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-black flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> COMMANDER TEST REINFORCEMENTS
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-mono mt-1 leading-relaxed">Instantly request credit reserves, crystals, and full energy to easily explore and test the entire cantina and campaigns.</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button 
                      onClick={() => {
                        const copy = { ...saveState };
                        copy.credits += 500000;
                        copy.crystals += 2500;
                        copy.energy = 1000;
                        onUpdateSaveState(copy);
                        alert("Reinforcements received! Added +500,000 Credits, +2,500 Crystals, and refilled Tactical Energy.");
                      }}
                      className="bg-amber-500/20 border border-amber-500/40 text-amber-400 px-4 py-2 rounded-xl text-[10px] uppercase font-mono font-bold hover:bg-amber-500/30 transition shadow-glow"
                    >
                      Receive +500k / +2.5k
                    </button>
                    <button 
                      onClick={() => {
                        const copy = { ...saveState };
                        Object.keys(copy.characters).forEach(id => {
                          const c = copy.characters[id];
                          if (!c.unlocked) {
                            c.unlocked = true;
                            c.stars = 5;
                            c.level = 50;
                            c.gearTier = 5;
                          }
                        });
                        onUpdateSaveState(copy);
                        alert("Roster reinforce sequence complete! All locked characters have been unlocked at 5★ level 50 for testing!");
                      }}
                      className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 px-4 py-2 rounded-xl text-[10px] uppercase font-mono font-bold hover:bg-cyan-500/30 transition shadow-glow"
                    >
                      Unlock All 5★
                    </button>
                  </div>
                </div>

                {/* Factory System Override */}
                <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-5 space-y-4 text-left">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-500" /> FACTORY SYSTEM OVERRIDE
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-mono mt-1 leading-relaxed">This will override current data and clear all custom progress, resetting to default levels.</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm("Are you absolutely sure you want to reset your account? This will wipe all progression, shards, level upgrades, and custom squads!")) {
                        localStorage.removeItem(`save_${saveState.playerId}`);
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
            )}

            {/* Feedback & Core Intelligence reports */}
            {activeSubTab === 'feedback' && (
              <div className="max-w-xl space-y-6 font-mono text-xs">
                <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 space-y-4">
                  <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wide flex items-center gap-2">
                    <MessageSquare className="w-4.5 h-4.5" /> TRANSMIT CONTEXT INTELLIGENCE
                  </h3>
                  <p className="text-zinc-400 leading-normal text-[11px]">
                    Submitting feedback logs essential telemetry parameters to coordinate terminal enhancements directly with Overlord Engineers.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase block mb-1">Transceiver Protocol Category</label>
                      <div className="flex gap-2">
                        {['bug', 'suggestion', 'praise'].map((t) => (
                          <button 
                            key={t}
                            onClick={() => setFeedbackType(t as any)}
                            className={`flex-1 py-2 rounded-xl border uppercase font-bold text-center transition ${
                              feedbackType === t 
                                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                                : 'bg-black/30 border-zinc-900 hover:border-zinc-800 text-zinc-400'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase block mb-1">Detailed Message Dispatch</label>
                      <textarea 
                        rows={6}
                        placeholder="Detail the tactical error or suggested holographic optimizations..."
                        value={feedbackMsg}
                        onChange={(e) => setFeedbackMsg(e.target.value)}
                        className="w-full bg-black/60 border border-zinc-800 focus:border-cyan-500 rounded-xl p-4 text-xs text-white placeholder:text-zinc-700 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <button 
                      onClick={submitFeedback}
                      className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase rounded-xl tracking-wider transition"
                    >
                      ✓ TRANSMIT LOGISTICS REPORT
                    </button>

                    {feedbackStatus && (
                      <p className="text-center font-bold text-[10px] text-cyan-400 animate-pulse">{feedbackStatus}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mail System */}
            {activeSubTab === 'mail' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-zinc-950/40 p-4 rounded-xl border border-zinc-900 shrink-0">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Received Signals</span>
                  <button onClick={fetchMails} className="text-xs font-mono text-cyan-400 underline">Refresh Inbox</button>
                </div>

                {mails.length === 0 ? (
                  <div className="p-12 border border-zinc-900 rounded-2xl bg-zinc-900/5 text-center font-mono space-y-2">
                    <Inbox className="w-8 h-8 text-zinc-600 mx-auto" />
                    <p className="text-zinc-400 text-sm">Communication register empty.</p>
                    <p className="text-zinc-600 text-xs">No administrative alerts logged.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                    {mails.map(m => (
                      <div key={m.id} className={`p-5 border rounded-2xl font-mono text-xs transition ${m.read ? 'bg-zinc-900/10 border-zinc-900' : 'bg-cyan-950/10 border-cyan-500/20'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[10px] text-cyan-400 font-bold uppercase">{m.sender}</span>
                            <h4 className="text-white font-bold text-sm mt-0.5">{m.subject}</h4>
                          </div>
                          <span className="text-zinc-500 text-[9px]">{new Date(m.sentAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed">{m.body}</p>

                        {m.rewards && (
                          <div className="mt-4 p-3 bg-cyan-950/10 border border-cyan-500/20 rounded-xl flex items-center justify-between">
                            <div className="flex gap-4">
                              {m.rewards.credits ? (
                                <div className="text-xs font-mono text-amber-400">
                                  🪙 {Number(m.rewards.credits).toLocaleString()} Credits
                                </div>
                              ) : null}
                              {m.rewards.crystals ? (
                                <div className="text-xs font-mono text-purple-400">
                                  💎 {Number(m.rewards.crystals).toLocaleString()} Crystals
                                </div>
                              ) : null}
                              {m.rewards.raidTokens ? (
                                <div className="text-xs font-mono text-indigo-400">
                                  🛡️ {Number(m.rewards.raidTokens).toLocaleString()} Raid Tokens
                                </div>
                              ) : null}
                              {m.rewards.eraCurrency ? (
                                <div className="text-xs font-mono text-cyan-400">
                                  🌌 {Number(m.rewards.eraCurrency).toLocaleString()} Era Credits
                                </div>
                              ) : null}
                            </div>
                            
                            {!m.claimed ? (
                              <button 
                                onClick={() => handleClaimMail(m.id)}
                                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-black font-mono rounded-lg transition"
                              >
                                CLAIM LOGISTICS
                              </button>
                            ) : (
                              <span className="text-xs font-mono text-zinc-600 uppercase">Claimed</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {mailStatus && (
                  <p className="text-xs text-cyan-400 font-mono text-center">{mailStatus}</p>
                )}
              </div>
            )}

            {/* Profile Customization with Custom Borders (Task 10) */}
            {activeSubTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="max-w-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 font-bold">Equipped Avatar</label>
                      <select 
                        value={profileAvatar} 
                        onChange={e => setProfileAvatar(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white font-mono text-xs outline-none focus:border-cyan-500"
                      >
                        {Object.keys(saveState.characters).filter(cid => saveState.characters[cid].unlocked).map(cid => (
                          <option key={cid} value={cid}>{characters.find(c => c.id === cid)?.name || cid}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 font-bold">Equipped Title</label>
                      <select 
                        value={profileTitle} 
                        onChange={e => setProfileTitle(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white font-mono text-xs outline-none focus:border-cyan-500"
                      >
                        {availableTitles.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* DECORATIVE PROFILE BORDERS (TASK 10) */}
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 font-bold">Profile Frame Border</label>
                      <select 
                        value={profileBorder} 
                        onChange={e => setProfileBorder(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white font-mono text-xs outline-none focus:border-cyan-500"
                      >
                        {availableBorders.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 font-bold">Favorite Faction</label>
                      <input 
                        type="text" 
                        value={favoriteFaction}
                        onChange={e => setFavoriteFaction(e.target.value)}
                        placeholder="Rebel, Clone Trooper, Inquisitor..."
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white font-mono text-xs outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 font-bold">Favorite Era</label>
                      <select 
                        value={favoriteEra} 
                        onChange={e => setFavoriteEra(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white font-mono text-xs outline-none focus:border-cyan-500"
                      >
                        <option value="clone_wars">Clone Wars Era</option>
                        <option value="civil_war">Galactic Civil War</option>
                        <option value="post_endor">New Republic Era</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 font-bold">
                      Arena Showcase Squad ({showcaseSquad.length}/5)
                    </label>
                    <p className="text-[10px] text-zinc-500 font-mono leading-relaxed mb-3">
                      This squadron is loaded on Holonet servers for defensive matchmaking when other players encounter you in the **Galactic Siege**.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto border border-zinc-900 p-3 rounded-xl bg-zinc-950/40">
                      {Object.keys(saveState.characters).filter(cid => saveState.characters[cid].unlocked).map(cid => {
                        const charName = characters.find(c => c.id === cid)?.name || cid;
                        const isSelected = showcaseSquad.includes(cid);
                        return (
                          <button 
                            type="button"
                            key={cid}
                            onClick={() => handleShowcaseToggle(cid)}
                            className={`p-2 rounded-lg border font-mono text-[9px] text-left truncate transition ${isSelected ? 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}
                          >
                            {isSelected ? '✓ ' : ''}{charName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-900">
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-black font-mono text-xs rounded-xl uppercase tracking-wider transition"
                  >
                    SYNC IDENTITY CARD
                  </button>
                </div>

                {profileStatus && (
                  <p className="text-xs text-cyan-400 font-mono text-center">{profileStatus}</p>
                )}
              </form>
            )}

            {/* Standings/Leaderboards */}
            {activeSubTab === 'leaderboard' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-zinc-950/40 p-4 rounded-xl border border-zinc-900">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Top 50 Active Commanders</span>
                  <button 
                    onClick={fetchRankings}
                    disabled={refreshingRankings}
                    className="text-xs font-mono text-cyan-400 underline"
                  >
                    {refreshingRankings ? 'Scanning...' : 'Refresh Register'}
                  </button>
                </div>

                <div className="border border-zinc-900 rounded-2xl overflow-hidden bg-zinc-950/20">
                  <table className="w-full border-collapse font-mono text-xs text-left">
                    <thead>
                      <tr className="bg-zinc-900/60 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-900">
                        <th className="p-4 font-bold">Rank</th>
                        <th className="p-4 font-bold">Commander</th>
                        <th className="p-4 font-bold">Border Frame</th>
                        <th className="p-4 font-bold">Roster Power</th>
                        <th className="p-4 font-bold text-right">League Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-zinc-300">
                      {rankings.map((r, idx) => (
                        <tr key={r.accountId} className="hover:bg-zinc-900/30 transition">
                          <td className="p-4 font-black text-cyan-400">#{idx + 1}</td>
                          <td className="p-4 flex items-center gap-2">
                            <span className="font-bold text-white">{r.username}</span>
                            {r.founderBadge && (
                              <span className="px-1 py-0.5 bg-red-950/40 border border-red-500/30 rounded text-[7px] text-red-400 font-black">FD</span>
                            )}
                            {r.betaTesterBadge && (
                              <span className="px-1 py-0.5 bg-cyan-950/40 border border-cyan-500/30 rounded text-[7px] text-cyan-400 font-black">BT</span>
                            )}
                          </td>
                          <td className="p-4 capitalize text-zinc-500">{r.profileBorder || 'None'}</td>
                          <td className="p-4 text-zinc-400">{r.collectionPower ? r.collectionPower.toLocaleString() : '1,500'} GP</td>
                          <td className="p-4 text-right font-black text-amber-400">{r.galacticSiegeRank || 1000} LP</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Administrative Overlord Command Panel (Tasks 4, 7, 8, 9) */}
            {activeSubTab === 'admin' && account?.admin && (
              <div className="space-y-6 max-w-4xl">
                
                {/* 1. ANNOUNCEMENTS BULLETIN EDITOR (Task 7) */}
                <div className="p-6 border border-amber-500/20 bg-amber-500/5 rounded-2xl space-y-4">
                  <h3 className="font-display font-black text-sm tracking-wider text-amber-400 uppercase flex items-center gap-2">
                    <Calendar className="w-4 h-4 animate-pulse" /> HOLONET NEWS BULLETIN EDITOR
                  </h3>
                  
                  <form onSubmit={handleCreateAnnouncement} className="space-y-3 font-mono text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase mb-1">Bulletin Title</label>
                        <input 
                          type="text"
                          required
                          value={newAnnTitle}
                          onChange={e => setNewAnnTitle(e.target.value)}
                          placeholder="Recreation of Era 3 active..."
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase mb-1">Broadcast Priority</label>
                        <select 
                          value={newAnnPriority}
                          onChange={e => setNewAnnPriority(e.target.value as any)}
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white font-bold"
                        >
                          <option value="low">Low Priority (Green)</option>
                          <option value="medium">Medium Priority (Amber)</option>
                          <option value="high">High Priority (Red Alert)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase mb-1">Broadcast Category</label>
                        <select 
                          value={newAnnCategory}
                          onChange={e => setNewAnnCategory(e.target.value as any)}
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-cyan-400 font-bold"
                        >
                          <option value="news">News</option>
                          <option value="update">Update</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="event">Sector Event</option>
                          <option value="developer_post">Developer Post</option>
                          <option value="emergency_notice">Emergency Notice</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase mb-1">Message Body</label>
                      <textarea 
                        rows={2}
                        required
                        value={newAnnBody}
                        onChange={e => setNewAnnBody(e.target.value)}
                        placeholder="Detail information drop..."
                        className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase rounded-lg text-[10px] tracking-widest"
                    >
                      PUBLISH DIRECTIVES TO HOLONET
                    </button>
                  </form>

                  {/* Active Bulletins list */}
                  <div className="space-y-2 max-h-40 overflow-y-auto pt-2">
                    {announcements.map(ann => (
                      <div key={ann.id} className="p-3 bg-black/60 border border-zinc-900 rounded-lg flex items-center justify-between text-[11px] font-mono">
                        <div>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black mr-2 uppercase ${ann.priority === 'high' ? 'bg-red-950 text-red-400' : ann.priority === 'medium' ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'}`}>
                            {ann.priority}
                          </span>
                          <span className="text-white font-bold">{ann.title}</span>
                        </div>
                        <button 
                          onClick={() => handleArchiveAnnouncement(ann.id, !ann.archived)}
                          className="text-[10px] text-zinc-500 hover:text-red-400 underline"
                        >
                          {ann.archived ? 'Restore' : 'Archive'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. SAVE BACKUP RETRIEVAL & RESTORE SYSTEM (Task 4) */}
                <div className="p-6 border border-amber-500/20 bg-amber-500/5 rounded-2xl space-y-4 font-mono text-xs">
                  <h3 className="font-display font-black text-sm tracking-wider text-amber-400 uppercase flex items-center gap-2">
                    <FileText className="w-4 h-4" /> SAVE RESTORE ARCHIVE REGISTRY
                  </h3>
                  
                  <div className="flex gap-2">
                    <select 
                      value={selectedBackupAccount}
                      onChange={e => setSelectedBackupAccount(e.target.value)}
                      className="flex-1 bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                    >
                      <option value="">-- Select Target Account ID --</option>
                      {rankings.map(r => (
                        <option key={r.accountId} value={r.accountId}>{r.username} ({r.accountId})</option>
                      ))}
                    </select>
                    <button 
                      onClick={handleFetchBackups}
                      className="px-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase rounded-lg text-[10px]"
                    >
                      SCAN BACKUPS
                    </button>
                  </div>

                  <div className="space-y-2">
                    {backups.length === 0 ? (
                      <p className="text-zinc-600 text-center text-[10px] py-2">Select an account and scan to show restorable historical save images.</p>
                    ) : (
                      backups.map(bk => (
                        <div key={bk.id} className="p-3 bg-black/60 border border-zinc-900 rounded-lg flex items-center justify-between text-[10px]">
                          <div>
                            <span className="text-cyan-400 font-bold">Image: {bk.id}</span>
                            <span className="text-zinc-500 block">Version: {bk.saveVersion} // Synced: {new Date(bk.timestamp).toLocaleString()}</span>
                          </div>
                          <button 
                            onClick={() => handleRestoreBackup(bk.id)}
                            className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/40 rounded text-[9px] font-black uppercase"
                          >
                            RESTORE IMAGE
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. ADVANCED MAIL REQUISITION ENGINE (Task 8) */}
                <div className="p-6 border border-amber-500/20 bg-amber-500/5 rounded-2xl space-y-4">
                  <h3 className="font-display font-black text-sm tracking-wider text-amber-400 uppercase flex items-center gap-2">
                    <Mail className="w-4 h-4" /> MULTI-REWARD BROADCAST SYSTEM
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase mb-1">Target Audience</label>
                        <select 
                          value={advMailTargetType}
                          onChange={e => setAdvMailTargetType(e.target.value as any)}
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                        >
                          <option value="all">Relay: ALL Commanders</option>
                          <option value="group">Relay: Active Beta Testers Group</option>
                          <option value="single">Relay: Direct Target</option>
                        </select>
                      </div>
                      {advMailTargetType === 'single' && (
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase mb-1">Target Account ID</label>
                          <select 
                            value={advMailTargetAccount}
                            onChange={e => setAdvMailTargetAccount(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                          >
                            <option value="">-- Choose Target Account --</option>
                            {rankings.map(r => (
                              <option key={r.accountId} value={r.accountId}>{r.username}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div>
                        <label className="block text-[10px] text-cyan-400 uppercase mb-1">Prepopulate Mail Template (Optional)</label>
                        <select 
                          value={selectedMailTemplateId}
                          onChange={e => handleSelectMailTemplate(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-cyan-400 font-bold"
                        >
                          <option value="">-- Manual Draft (Custom) --</option>
                          <option value="welcome">Welcome Commander Pack</option>
                          <option value="maintenance">Maintenance Compensation</option>
                          <option value="bug_compensation">Bug Compensation Mail</option>
                          <option value="season_rewards">Season Reward Grant</option>
                          <option value="founder_rewards">Founder Commendation</option>
                          <option value="beta_tester_rewards">Beta Tester Rewards</option>
                          <option value="event_rewards">Event Rewards Grant</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase mb-1">Subject Title</label>
                        <input 
                          type="text"
                          value={advMailSubject}
                          onChange={e => setAdvMailSubject(e.target.value)}
                          placeholder="Requisition dispatched..."
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase mb-1">Message Detail</label>
                        <textarea 
                          rows={3}
                          value={advMailBody}
                          onChange={e => setAdvMailBody(e.target.value)}
                          placeholder="Logistics instructions..."
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    {/* Quantities */}
                    <div className="space-y-3 p-4 bg-black/40 border border-zinc-900 rounded-xl">
                      <span className="text-[10px] text-amber-500 font-bold block uppercase tracking-wider mb-2">Attached Logistics Supplies</span>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] text-zinc-500 uppercase mb-1">Credits</label>
                          <input 
                            type="number" 
                            value={advMailCredits} 
                            onChange={e => setAdvMailCredits(Number(e.target.value))}
                            className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-zinc-500 uppercase mb-1">Crystals</label>
                          <input 
                            type="number" 
                            value={advMailCrystals} 
                            onChange={e => setAdvMailCrystals(Number(e.target.value))}
                            className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-zinc-500 uppercase mb-1">Raid Currency</label>
                          <input 
                            type="number" 
                            value={advMailRaidTokens} 
                            onChange={e => setAdvMailRaidTokens(Number(e.target.value))}
                            className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white rounded"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={handleSendAdvancedMail}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase rounded-lg transition mt-4"
                      >
                        DISPATCH MAIL DECREE
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. HIGH SECURITY AUDIT LOG CONSOLE (Task 9) */}
                <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950/40 space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-black text-sm tracking-wider text-white uppercase flex items-center gap-2">
                      <Lock className="w-4 h-4 text-cyan-400" /> ADMIN OPERATIONS AUDIT LOG MATRIX
                    </h3>
                    <button 
                      onClick={fetchAdminLogs}
                      className="px-3 py-1 border border-zinc-800 rounded hover:bg-zinc-900 text-[10px]"
                    >
                      SYNC RECEPTACLE
                    </button>
                  </div>

                  <div className="space-y-1 max-h-48 overflow-y-auto text-[10px]">
                    {auditLogs.length === 0 ? (
                      <p className="text-zinc-600 text-center py-4 italic">Console empty. Press sync to download audit log buffers.</p>
                    ) : (
                      auditLogs.map(log => (
                        <div key={log.id} className="p-2.5 bg-black/60 border border-zinc-900 rounded-lg flex justify-between items-start gap-3">
                          <div>
                            <span className="text-zinc-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                            <span className="text-amber-400 font-bold">{log.adminName}</span> Executed{' '}
                            <span className="text-white font-bold">{log.action}</span>
                            <span className="block text-zinc-400 mt-1">{log.details}</span>
                          </div>
                          <span className="text-[9px] text-zinc-600 font-mono">TGT: {log.targetAccount}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Legacy Action Deck */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950/40 space-y-4 font-mono text-xs">
                    <h3 className="font-display font-black text-sm tracking-wider text-white uppercase">REQUISITION PROTOCOLS</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase mb-1">Target Account</label>
                        <select 
                          value={targetAccountId}
                          onChange={e => setTargetAccountId(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                        >
                          <option value="">-- Choose Account --</option>
                          {rankings.map(r => (
                            <option key={r.accountId} value={r.accountId}>{r.username}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase mb-1">Supply Type</label>
                        <select 
                          value={grantType}
                          onChange={e => setGrantType(e.target.value as any)}
                          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                        >
                          <option value="credits">Credits</option>
                          <option value="crystals">Crystals</option>
                          <option value="raidTokens">Raid Tokens</option>
                          <option value="character">Force Unlock Character</option>
                        </select>
                      </div>

                      {grantType === 'character' ? (
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase mb-1">Target Character</label>
                          <select 
                            value={grantCharId}
                            onChange={e => setGrantCharId(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                          >
                            {characters.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase mb-1">Supply Quota Amount</label>
                          <input 
                            type="number"
                            value={grantAmount}
                            onChange={e => setGrantAmount(Number(e.target.value))}
                            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white outline-none focus:border-amber-500"
                          />
                        </div>
                      )}

                      <button 
                        onClick={handleAdminGrant}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase rounded-lg transition mt-2 text-[10px]"
                      >
                        EXECUTE SECURE REQUISITION
                      </button>
                    </div>
                  </div>

                  <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950/40 space-y-4 font-mono text-xs">
                    <h3 className="font-display font-black text-sm tracking-wider text-white uppercase">SQUADRON STATUS DIRECTIVES</h3>
                    <div className="border border-zinc-900 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="bg-zinc-900/40 border-b border-zinc-900 text-zinc-500 uppercase">
                            <th className="p-3">Commander</th>
                            <th className="p-3">Rating</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {rankings.map(r => (
                            <tr key={r.accountId}>
                              <td className="p-3 text-white font-bold">{r.username}</td>
                              <td className="p-3 text-amber-400 font-bold">{r.galacticSiegeRank || 1000} LP</td>
                              <td className="p-3 text-right space-x-1 whitespace-nowrap">
                                <button 
                                  onClick={() => handleAdminReset(r.accountId)}
                                  className="px-2 py-1 border border-zinc-800 rounded text-[9px] hover:bg-zinc-800 text-zinc-400 hover:text-white"
                                >
                                  Reset
                                </button>
                                <button 
                                  onClick={() => handleAdminBan(r.accountId, true)}
                                  className="px-2 py-1 bg-red-950/20 border border-red-500/30 rounded text-[9px] hover:bg-red-900/20 text-red-400"
                                >
                                  Ban
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Match Logs */}
                <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950/40 space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-black text-sm tracking-wider text-white uppercase flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-500" /> HOLONET PVP MATCH LOG RECEPTACLE
                    </h3>
                    <button 
                      onClick={fetchAdminMatchLogs}
                      className="px-3 py-1 border border-zinc-800 rounded hover:bg-zinc-900 text-[10px]"
                    >
                      Retrieve Buffer
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {matchLogs.length === 0 ? (
                      <p className="text-zinc-600 text-xs italic text-center py-4">Logs buffer empty. No PvP matches logged in current cycle.</p>
                    ) : (
                      matchLogs.map((log: any) => (
                        <div key={log.id} className="p-3 bg-black/60 border border-zinc-900 rounded-lg flex justify-between items-center text-[10px]">
                          <div>
                            <span className="text-zinc-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                            <span className="text-cyan-400 font-bold">{log.playerUsername}</span> vs{' '}
                            <span className="text-rose-400 font-bold">{log.opponentUsername}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded uppercase font-black font-mono text-[8px] ${log.winnerAccountId === log.playerAccountId ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-400' : 'bg-red-950 border border-red-500/30 text-red-400'}`}>
                            {log.winnerAccountId === log.playerAccountId ? 'Attacker Won' : 'Defender Won'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Tactical Error Reports from players */}
                <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950/40 space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-black text-sm tracking-wider text-white uppercase flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-500" /> TACTICAL PLAYER ERROR REPORTS
                    </h3>
                    <button 
                      onClick={async () => {
                        const res = await NetworkManager.secureFetch('/api/admin/errors/clear', { method: 'POST' });
                        const data = await res.json();
                        if (data.success) {
                          setErrorReports([]);
                          setAdminStatus('Cleared all terminal error logs.');
                        }
                      }}
                      className="px-3 py-1 border border-red-500/30 hover:bg-red-500/10 text-red-400 rounded text-[10px]"
                    >
                      WIPE RECEPTACLE
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {errorReports.length === 0 ? (
                      <p className="text-zinc-600 text-xs italic text-center py-4">No tactical errors reported in this cycle.</p>
                    ) : (
                      errorReports.map((report: any) => (
                        <div key={report.id} className="p-3 bg-red-950/10 border border-red-500/10 rounded-lg text-[10px] space-y-1">
                          <div className="flex justify-between text-zinc-500">
                            <span>[{new Date(report.timestamp).toLocaleString()}] Account ID: {report.accountId || 'anonymous'}</span>
                            <span className="text-red-400 font-bold uppercase">{report.severity || 'high'}</span>
                          </div>
                          <div className="text-white"><span className="text-red-500 font-bold">Error:</span> {report.message}</div>
                          {report.stack && <pre className="p-2 bg-black/40 text-zinc-500 rounded text-[9px] overflow-x-auto">{report.stack}</pre>}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Feedback Intel Reports */}
                <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950/40 space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-black text-sm tracking-wider text-white uppercase flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-cyan-400" /> FEEDBACK & CORE INTELLIGENCE REPORTS
                    </h3>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {feedbackReports.length === 0 ? (
                      <p className="text-zinc-600 text-xs italic text-center py-4">No feedback dispatches compiled.</p>
                    ) : (
                      feedbackReports.map((fb: any) => (
                        <div key={fb.id} className="p-3 bg-zinc-900/20 border border-zinc-900 rounded-lg text-[10px] space-y-1">
                          <div className="flex justify-between text-zinc-500">
                            <span>[{new Date(fb.timestamp).toLocaleString()}] User ID: {fb.accountId}</span>
                            <span className="text-cyan-400 font-bold uppercase">{fb.type}</span>
                          </div>
                          <div className="text-white font-semibold">{fb.message}</div>
                          <div className="text-zinc-500 text-[9px]">Client: v{fb.version} | Device: {fb.device}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Central Security Event Logs */}
                <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950/40 space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-black text-sm tracking-wider text-white uppercase flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-500" /> CENTRAL SYSTEM SECURITY EVENT LOGS
                    </h3>
                  </div>

                  <div className="space-y-1 max-h-48 overflow-y-auto text-[9px]">
                    {systemLogsList.length === 0 ? (
                      <p className="text-zinc-600 text-center py-4 italic">Security registers clear.</p>
                    ) : (
                      systemLogsList.map((log: any) => (
                        <div key={log.id} className="p-2 bg-black/60 border border-zinc-900 rounded flex justify-between items-start gap-2">
                          <div>
                            <span className="text-zinc-500">[{new Date(log.timestamp).toLocaleString()}]</span>{' '}
                            <span className="text-amber-500 font-bold">{log.action}</span> - Account: <span className="text-white">{log.accountId || 'SYSTEM'}</span>
                            <span className="block text-zinc-400 mt-0.5">{log.details}</span>
                          </div>
                          <span className="text-zinc-600 font-mono">IP: {log.ip}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {adminStatus && (
                  <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl text-xs text-amber-400 font-mono text-center">
                    ✓ {adminStatus}
                  </div>
                )}
              </div>
            )}

            {/* Developer Panel Overrides (Tasks 12, 13, 14) */}
            {activeSubTab === 'dev' && account?.developer && (
              <div className="space-y-6 max-w-4xl font-mono text-xs">
                
                {/* 1. SEASON ENVIRONMENT SERVICE CONTROL (Task 12 & 13) */}
                <div className="p-6 border border-purple-500/20 bg-purple-500/5 rounded-2xl space-y-4">
                  <h3 className="font-display font-black text-sm tracking-wider text-purple-400 uppercase flex items-center gap-2">
                    <Calendar className="w-4 h-4 animate-spin-slow" /> SEASON & WORLD ENVIRONMENT SERVICE
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase mb-1">Active Era Conflict</label>
                      <select 
                        value={devSeasonEra}
                        onChange={e => setDevSeasonEra(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                      >
                        <option value="clone_wars">Clone Wars Era</option>
                        <option value="civil_war">Galactic Civil War</option>
                        <option value="post_endor">Post Endor Conflict</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase mb-1">Conflict Hot Planet</label>
                      <input 
                        type="text"
                        value={devSeasonPlanet}
                        onChange={e => setDevSeasonPlanet(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleOverrideSeason}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider"
                  >
                    DEPLOY OVERRIDE CONSTANTS
                  </button>
                </div>

                {/* 2. MATCHMAKING SIMULATION TESTING DECK (Task 13) */}
                <div className="p-6 border border-purple-500/20 bg-purple-500/5 rounded-2xl space-y-4">
                  <h3 className="font-display font-black text-sm tracking-wider text-purple-400 uppercase flex items-center gap-2">
                    <Activity className="w-4 h-4" /> MULTIPLAYER MATCHMAKING SIMULATOR
                  </h3>
                  
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[9px] text-zinc-500 uppercase mb-1">Simulated Squad LP Score</label>
                      <input 
                        type="number"
                        value={devTestRank}
                        onChange={e => setDevTestRank(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white rounded"
                      />
                    </div>
                    <button 
                      onClick={handleSimulateMatchmaking}
                      className="px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-[10px] uppercase"
                    >
                      CALCULATE PAIRINGS
                    </button>
                  </div>

                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {simulatedOpponents.length === 0 ? (
                      <p className="text-zinc-600 text-center text-[10px] py-2">No matchmaking simulation executed yet.</p>
                    ) : (
                      simulatedOpponents.map(op => (
                        <div key={op.accountId} className="p-2 bg-black/40 border border-zinc-900 rounded-lg flex justify-between text-[10px]">
                          <span className="text-white font-bold">{op.username}</span>
                          <span className="text-amber-400 font-bold">{op.galacticSiegeRank} LP</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. MATHEMATICAL COLLECTION POWER SIMULATOR (Task 13) */}
                <div className="p-6 border border-purple-500/20 bg-purple-500/5 rounded-2xl space-y-4">
                  <h3 className="font-display font-black text-sm tracking-wider text-purple-400 uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> COLLECTION POWER ENGINE TESTER
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[9px] text-zinc-500 uppercase mb-1">Character</label>
                      <select 
                        value={devTestCharId}
                        onChange={e => setDevTestCharId(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white rounded text-[11px]"
                      >
                        {characters.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase mb-1">Level</label>
                      <input 
                        type="number" 
                        value={devTestLevel} 
                        onChange={e => setDevTestLevel(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase mb-1">Stars</label>
                      <input 
                        type="number" 
                        value={devTestStars} 
                        onChange={e => setDevTestStars(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase mb-1">Gear</label>
                      <input 
                        type="number" 
                        value={devTestGear} 
                        onChange={e => setDevTestGear(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white rounded"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleTestCharacterCP}
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-[10px] uppercase"
                  >
                    EXECUTE DIAGNOSTICS RUN
                  </button>
                </div>

                {/* Extended Analytics Metrics Dashboard (Task 14) */}
                {analytics ? (
                  <div className="space-y-6 pt-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-purple-950/10 border border-purple-500/20 rounded-xl">
                        <span className="text-zinc-500 block uppercase text-[10px]">DAILY ACTIVE USER STATE (DAU)</span>
                        <span className="text-xl font-bold text-white block mt-1">{analytics.totalDAU} Active</span>
                      </div>
                      <div className="p-4 bg-purple-950/10 border border-purple-500/20 rounded-xl">
                        <span className="text-zinc-500 block uppercase text-[10px]">AUTHENTICATED CONNECTIONS</span>
                        <span className="text-xl font-bold text-white block mt-1">{analytics.loginsCount} Entries</span>
                      </div>
                      <div className="p-4 bg-purple-950/10 border border-purple-500/20 rounded-xl">
                        <span className="text-zinc-500 block uppercase text-[10px]">CLOUD SAVES SYNCS</span>
                        <span className="text-xl font-bold text-white block mt-1">{analytics.savesUploadedCount} Syncs</span>
                      </div>
                      <div className="p-4 bg-purple-950/10 border border-purple-500/20 rounded-xl">
                        <span className="text-zinc-500 block uppercase text-[10px]">GALACTIC SIEGE FIGHTS</span>
                        <span className="text-xl font-bold text-white block mt-1">{analytics.siegeMatchesCount} Battles</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 border border-zinc-800 bg-zinc-950/40 rounded-2xl space-y-4">
                        <h2 className="font-display font-black text-sm tracking-wider text-purple-400 uppercase">
                          COMMANDER FACTION PREFERENCE MATRIX
                        </h2>
                        <div className="space-y-2">
                          {Object.keys(analytics.factionDistribution).map(faction => {
                            const count = analytics.factionDistribution[faction];
                            const maxCount = Math.max(...Object.values(analytics.factionDistribution) as number[], 1);
                            const percentage = Math.round((count / maxCount) * 100);
                            return (
                              <div key={faction} className="space-y-1">
                                <div className="flex justify-between text-[11px]">
                                  <span className="text-zinc-300 font-bold uppercase">{faction}</span>
                                  <span className="text-zinc-500">{count} Commanders</span>
                                </div>
                                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-purple-500 h-full transition-all" style={{ width: `${percentage}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Economic settings */}
                      <div className="p-6 border border-purple-500/20 bg-purple-500/5 rounded-2xl space-y-4">
                        <h2 className="font-display font-black text-sm tracking-wider text-purple-400 uppercase">
                          ⚙ ECONOMY ENGINE CONFIGURATOR
                        </h2>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">
                          Adjust direct server drop rates or credit rewards dynamically for live play sessions. Let's optimize the retention calculations.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                          <span className="text-zinc-400 whitespace-nowrap">Drop Rate Multiplier:</span>
                          <input 
                            type="range"
                            min="0.5"
                            max="3.0"
                            step="0.1"
                            value={economyMultiplier}
                            onChange={e => setEconomyMultiplier(Number(e.target.value))}
                            className="flex-1 accent-purple-500 bg-zinc-800 rounded-lg h-1.5"
                          />
                          <span className="font-bold text-purple-400 whitespace-nowrap">{economyMultiplier}x Rate</span>
                        </div>
                        <button 
                          onClick={handleUpdateEconomy}
                          className="py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition"
                        >
                          PUBLISH CONFIG OVERRIDES
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={fetchDevAnalytics}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition"
                  >
                    SCAN SYSTEM RETENTION ANALYTICS
                  </button>
                )}

                {devStatus && (
                  <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl text-xs text-purple-400 text-center">
                    {devStatus}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Panel Footer */}
          <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-600 shrink-0">
            <span>SECURE CONSOLE PROTOCOL SECURE_v2.5 // SEED_ADMIN=ANTISANTI1272</span>
            <span>DATE REVOLUTION CYCLE: 2026_06_23</span>
          </div>

        </div>

      </div>
    </div>
  );
}
