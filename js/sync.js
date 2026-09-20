/* ==========================================================================
   Book of Life / Life OS - Instant Cloud Sync Manager (Realtime Engine)
   ========================================================================== */

class SyncManager {
  constructor() {
    this.dbUrl = localStorage.getItem('BOL_SYNC_DB_URL') || '';
    this.passphrase = localStorage.getItem('BOL_SYNC_PASSPHRASE') || '';
    this.eventSource = null;
    this.isConnected = false;
    this.isSyncing = false;
    this.pendingPush = false;
    this.lastSyncTime = null;

    // Check URL parameters for 1-tap quick pairing: ?sync_url=...&sync_key=...
    this.checkUrlParams();

    if (this.isConfigured()) {
      this.init();
    }
  }

  isConfigured() {
    return !!(this.dbUrl && this.dbUrl.trim() && this.passphrase && this.passphrase.trim());
  }

  getCleanUrl() {
    let url = this.dbUrl.trim();
    if (url.endsWith('/')) url = url.slice(0, -1);
    return url;
  }

  getSafeKey() {
    return encodeURIComponent(this.passphrase.trim().replace(/[.#$\[\]\/]/g, '_'));
  }

  getEndpoint() {
    return `${this.getCleanUrl()}/sync/${this.getSafeKey()}.json`;
  }

  async init() {
    if (!this.isConfigured()) return;
    try {
      await this.pullFromCloud();
      this.startRealtimeListener();
      this.isConnected = true;
      this.updateStatusBadge();
    } catch (e) {
      console.warn('Sync init error:', e);
    }
  }

  checkUrlParams() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paramUrl = urlParams.get('sync_url');
      const paramKey = urlParams.get('sync_key');
      if (paramUrl && paramKey) {
        this.dbUrl = decodeURIComponent(paramUrl);
        this.passphrase = decodeURIComponent(paramKey);
        localStorage.setItem('BOL_SYNC_DB_URL', this.dbUrl);
        localStorage.setItem('BOL_SYNC_PASSPHRASE', this.passphrase);
        window.history.replaceState({}, document.title, window.location.pathname);
        showToast('⚡ Instant Cloud Sync paired successfully!');
      }
    } catch (e) {}
  }

  /**
   * Intelligently merge incoming cloud data without destroying local additions
   */
  mergeIncomingData(incoming) {
    if (!incoming || typeof incoming !== 'object' || !incoming.version) return false;
    if (typeof storage === 'undefined' || !storage.data) return false;

    // Check if cloud data is already identical to local
    const incomingStr = JSON.stringify(incoming);
    const localStr = JSON.stringify(storage.data);
    if (incomingStr === localStr) return false;

    let localWasRicher = false;

    // 1. Points: NEVER let cloud downgrade points or drop below 185 baseline floor
    const localPoints = Number(storage.data.points) || 185;
    const cloudPoints = Number(incoming.points) || 0;
    const mergedPoints = Math.max(localPoints, cloudPoints, 185);
    if (cloudPoints < mergedPoints) {
      localWasRicher = true;
    }

    // 2. Habits: Union by id & lowercase name - never let cloud erase locally added habits
    const habitMap = new Map();
    (Array.isArray(storage.data.habits) ? storage.data.habits : []).forEach(h => {
      if (h && h.name) habitMap.set(h.name.toLowerCase().trim(), { ...h });
    });
    (Array.isArray(incoming.habits) ? incoming.habits : []).forEach(h => {
      if (h && h.name) {
        const key = h.name.toLowerCase().trim();
        const existing = habitMap.get(key);
        habitMap.set(key, { ...(existing || {}), ...h });
      }
    });
    const mergedHabits = Array.from(habitMap.values());
    if (mergedHabits.length > (Array.isArray(incoming.habits) ? incoming.habits.length : 0)) {
      localWasRicher = true;
    }

    // 3. HabitsState: Respect local modifications
    const mergedHabitsState = { ...(storage.data.habitsState || {}) };
    if (incoming.habitsState && typeof incoming.habitsState === 'object') {
      Object.entries(incoming.habitsState).forEach(([dStr, dObj]) => {
        const localTime = (storage.data.habitsUpdatedAt && storage.data.habitsUpdatedAt[dStr]) || 0;
        const cloudTime = (incoming.habitsUpdatedAt && incoming.habitsUpdatedAt[dStr]) || 0;
        if (storage.data.habitsState && storage.data.habitsState[dStr] !== undefined && localTime >= cloudTime) {
          // Local is authoritative for this date (e.g. user toggled/unchecked habits today)
          mergedHabitsState[dStr] = { ...storage.data.habitsState[dStr] };
          if (JSON.stringify(dObj) !== JSON.stringify(storage.data.habitsState[dStr])) {
            localWasRicher = true;
          }
        } else if (!mergedHabitsState[dStr]) {
          mergedHabitsState[dStr] = { ...dObj };
        } else {
          mergedHabitsState[dStr] = { ...dObj, ...mergedHabitsState[dStr] };
        }
      });
    }

    // 4. ChoicesState: Compare timestamps so explicit zeroing is saved and pushes to cloud
    const mergedChoices = { ...(storage.data.choicesState || {}) };
    if (incoming.choicesState && typeof incoming.choicesState === 'object') {
      Object.entries(incoming.choicesState).forEach(([dStr, cObj]) => {
        const localObj = storage.data.choicesState ? storage.data.choicesState[dStr] : null;
        if (!localObj) {
          mergedChoices[dStr] = {
            good: Math.max(0, parseInt(cObj.good, 10) || 0),
            not: Math.max(0, parseInt(cObj.not, 10) || 0),
            updatedAt: cObj.updatedAt || 0
          };
        } else {
          const localTime = (localObj && typeof localObj === 'object') ? (localObj.updatedAt || 0) : 0;
          const cloudTime = (cObj && typeof cObj === 'object') ? (cObj.updatedAt || 0) : 0;
          if (cloudTime > localTime) {
            mergedChoices[dStr] = {
              good: Math.max(0, parseInt(cObj.good, 10) || 0),
              not: Math.max(0, parseInt(cObj.not, 10) || 0),
              updatedAt: cloudTime
            };
          } else {
            // Local is newer or equal -> local wins!
            mergedChoices[dStr] = localObj;
            if (cObj.good !== localObj.good || cObj.not !== localObj.not) {
              localWasRicher = true;
            }
          }
        }
      });
    }

    // 5. HealthState: By updatedAt
    const mergedHealth = { ...(storage.data.healthState || {}) };
    if (incoming.healthState && typeof incoming.healthState === 'object') {
      Object.entries(incoming.healthState).forEach(([dStr, hObj]) => {
        const ex = mergedHealth[dStr];
        if (!ex) {
          mergedHealth[dStr] = hObj;
        } else {
          const exT = (ex && typeof ex === 'object') ? (ex.updatedAt || 0) : 0;
          const inT = (hObj && typeof hObj === 'object') ? (hObj.updatedAt || 0) : 0;
          if (inT >= exT) mergedHealth[dStr] = hObj;
        }
      });
    }

    // 6. DayGoals: Purge 12,000 steps seed and respect local deletions
    const mergedDayGoals = { ...(storage.data.dayGoals || {}) };
    Object.keys(mergedDayGoals).forEach(dStr => {
      if (Array.isArray(mergedDayGoals[dStr])) {
        mergedDayGoals[dStr] = mergedDayGoals[dStr].filter(g => g && g.id !== 'dg-1' && !(g.text && (g.text.includes('12,000') || g.text.includes('12000'))));
      }
    });

    if (incoming.dayGoals && typeof incoming.dayGoals === 'object') {
      let cloudHadStale12k = false;
      Object.entries(incoming.dayGoals).forEach(([dStr, list]) => {
        if (Array.isArray(list)) {
          const cleanIncoming = list.filter(g => {
            if (!g) return false;
            if (g.id === 'dg-1' || (g.text && (g.text.includes('12,000') || g.text.includes('12000')))) {
              cloudHadStale12k = true;
              return false;
            }
            return true;
          });

          const localTime = (storage.data.dayGoalsUpdatedAt && storage.data.dayGoalsUpdatedAt[dStr]) || 0;
          const cloudTime = (incoming.dayGoalsUpdatedAt && incoming.dayGoalsUpdatedAt[dStr]) || 0;

          if (storage.data.dayGoals && storage.data.dayGoals[dStr] !== undefined && localTime >= cloudTime) {
            // Local is newer or equal -> local authoritatively wins (keeps deletions)
            mergedDayGoals[dStr] = [...(storage.data.dayGoals[dStr] || [])].filter(g => g && g.id !== 'dg-1' && !(g.text && (g.text.includes('12,000') || g.text.includes('12000'))));
            if (JSON.stringify(cleanIncoming) !== JSON.stringify(mergedDayGoals[dStr])) {
              localWasRicher = true;
            }
          } else if (!mergedDayGoals[dStr]) {
            mergedDayGoals[dStr] = cleanIncoming;
          } else {
            mergedDayGoals[dStr] = cleanIncoming;
          }
        }
      });
      if (cloudHadStale12k) {
        localWasRicher = true;
      }
    }

    // 7. SanctuaryJournals: Latest updatedAt per date
    const mergedJournals = { ...(storage.data.sanctuaryJournals || {}) };
    if (incoming.sanctuaryJournals && typeof incoming.sanctuaryJournals === 'object') {
      Object.entries(incoming.sanctuaryJournals).forEach(([dStr, jObj]) => {
        if (jObj && jObj.text && jObj.text.trim()) {
          const ex = mergedJournals[dStr];
          if (!ex || (jObj.updatedAt || '') >= (ex.updatedAt || '')) {
            mergedJournals[dStr] = jObj;
          }
        }
      });
    }

    // 8. QuickThoughts: Union by id & text
    const thoughtMap = new Map();
    (Array.isArray(storage.data.quickThoughts) ? storage.data.quickThoughts : []).forEach(t => {
      if (t && t.id) thoughtMap.set(t.id, { ...t });
    });
    (Array.isArray(incoming.quickThoughts) ? incoming.quickThoughts : []).forEach(t => {
      if (t && t.id) {
        const ex = thoughtMap.get(t.id);
        thoughtMap.set(t.id, { ...(ex || {}), ...t });
      }
    });
    const mergedThoughts = Array.from(thoughtMap.values());

    // 9. Claims: Union by id, sanitized & normalized
    const claimsMap = new Map();
    (Array.isArray(storage.data.claims) ? storage.data.claims : []).forEach(c => {
      if (c && c.id) claimsMap.set(c.id, { ...c });
    });
    (Array.isArray(incoming.claims) ? incoming.claims : []).forEach(c => {
      if (c && c.id) {
        const ex = claimsMap.get(c.id);
        claimsMap.set(c.id, { ...(ex || {}), ...c });
      }
    });
    const mergedClaims = Array.from(claimsMap.values()).map(c => {
      const claim = { ...c };
      claim.date = claim.date || claim.dateOfService || formatDateIso(new Date());
      claim.amountPaid = Number(claim.amountPaid !== undefined ? claim.amountPaid : (claim.amountBilled || 300.0));
      if (claim.amountPaid > 10000 || isNaN(claim.amountPaid)) claim.amountPaid = 300.0;
      if (claim.amountBilled > 10000 || isNaN(claim.amountBilled)) claim.amountBilled = 300.0;
      if (claim.insurancePaid > 10000 || isNaN(claim.insurancePaid)) claim.insurancePaid = 180.0;
      if (claim.outOfPocket > 10000 || claim.outOfPocket < 0 || isNaN(claim.outOfPocket)) {
        claim.outOfPocket = (claim.status === 'reimbursed' || claim.stage === 'settled') ? 120.0 : (claim.amountPaid - (claim.insurancePaid || 0));
      }
      if (!claim.stage) {
        claim.stage = (claim.status === 'reimbursed') ? 'settled' : 'with_included_health';
      }
      if (claim.reimbursedAmount === undefined) {
        claim.reimbursedAmount = (claim.stage === 'settled') ? (claim.insurancePaid || 180.0) : 0;
      }
      claim.superbillStatus = claim.superbillStatus || 'have';
      claim.submissionType = claim.submissionType || 'provider';
      claim.payoutMethod = claim.payoutMethod || 'direct_deposit';
      claim.nextAction = claim.nextAction || (claim.stage === 'settled' ? 'Claim settled & reimbursed' : 'Waiting on Included Health & Insurance review');
      return claim;
    });

    // 10. Z Log and Titration Seeds
    let mergedZLog = incoming.zlogEntries;
    let mergedZLogVersion = incoming.zlogSeedVersion;
    if (!mergedZLogVersion || mergedZLogVersion < 8 || !mergedZLog || !mergedZLog['2026-09-12']) {
      const cleanDefaults = (typeof DEFAULT_ZLOG_ENTRIES !== 'undefined') ? { ...DEFAULT_ZLOG_ENTRIES } : {};
      if (mergedZLog && typeof mergedZLog === 'object') {
        for (const [d, entry] of Object.entries(mergedZLog)) {
          if (d > '2026-09-12' && entry && entry.updatedAt) {
            cleanDefaults[d] = entry;
          }
        }
      }
      if (storage.data.zlogEntries && typeof storage.data.zlogEntries === 'object') {
        for (const [d, entry] of Object.entries(storage.data.zlogEntries)) {
          if (d > '2026-09-12' && entry && entry.updatedAt) {
            cleanDefaults[d] = entry;
          }
        }
      }
      if (typeof DEFAULT_ZLOG_ENTRIES !== 'undefined' && DEFAULT_ZLOG_ENTRIES['2026-09-12']) {
        cleanDefaults['2026-09-12'] = { ...DEFAULT_ZLOG_ENTRIES['2026-09-12'], updatedAt: new Date().toISOString() };
      }
      mergedZLog = cleanDefaults;
      mergedZLogVersion = 8;
      localWasRicher = true;
    }

    let mergedTitration = incoming.titrationHistory;
    let mergedTitVersion = incoming.titrationSeedVersion;
    if (!mergedTitVersion || mergedTitVersion < 6 || !Array.isArray(mergedTitration) || mergedTitration.length < 34) {
      mergedTitration = (typeof DEFAULT_TITRATION_HISTORY !== 'undefined') ? JSON.parse(JSON.stringify(DEFAULT_TITRATION_HISTORY)) : [];
      mergedTitVersion = 6;
      localWasRicher = true;
    }

    // Apply consolidated data
    storage.data = {
      ...storage.data,
      ...incoming,
      points: mergedPoints,
      habits: mergedHabits,
      habitsState: mergedHabitsState,
      choicesState: mergedChoices,
      healthState: mergedHealth,
      dayGoals: mergedDayGoals,
      sanctuaryJournals: mergedJournals,
      quickThoughts: mergedThoughts,
      claims: mergedClaims,
      zlogEntries: mergedZLog,
      zlogSeedVersion: mergedZLogVersion,
      titrationHistory: mergedTitration,
      titrationSeedVersion: mergedTitVersion
    };

    try {
      localStorage.setItem('BOOK_OF_LIFE_DATA_V2', JSON.stringify(storage.data));
      localStorage.setItem('BOOK_OF_LIFE_DATA_BACKUP', JSON.stringify(storage.data));
    } catch (e) {}

    storage.recalculateAllStreaks();
    storage.recalculatePointsFromHistory();

    if (localWasRicher) {
      this.pendingPush = true;
    }

    return true;
  }

  async pullFromCloud() {
    if (!this.isConfigured() || this.isSyncing) return;
    try {
      this.isSyncing = true;
      const res = await fetch(this.getEndpoint());
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const cloudData = await res.json();

      if (cloudData && typeof cloudData === 'object' && cloudData.version) {
        const hasChanges = this.mergeIncomingData(cloudData);
        if (hasChanges) {
          // Only re-render if user is NOT actively typing
          const isUserTyping = document.activeElement && (
            document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA'
          );
          if (!isUserTyping) {
            if (typeof renderCurrentView === 'function') {
              renderCurrentView();
            } else if (typeof renderDailySheet === 'function') {
              renderDailySheet();
            }
          }
        }
        this.lastSyncTime = new Date();
        this.isConnected = true;
        this.updateStatusBadge();
      } else if (cloudData === null) {
        // Cloud has no data yet, push local data to seed it
        await this.pushToCloud();
      }
    } catch (err) {
      console.warn('Cloud pull error:', err);
    } finally {
      this.isSyncing = false;
      if (this.pendingPush) {
        this.pushToCloud();
      }
    }
  }

  async pushToCloud() {
    if (!this.isConfigured()) return;
    if (this.isSyncing) {
      this.pendingPush = true;
      return;
    }

    try {
      this.isSyncing = true;
      this.pendingPush = false;
      const payload = JSON.stringify(storage.data);
      const res = await fetch(this.getEndpoint(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });
      if (res.ok) {
        this.lastSyncTime = new Date();
        this.isConnected = true;
        this.updateStatusBadge();
      }
    } catch (err) {
      console.warn('Cloud push error:', err);
    } finally {
      this.isSyncing = false;
      if (this.pendingPush) {
        this.pushToCloud();
      }
    }
  }

  startRealtimeListener() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (!this.isConfigured()) return;

    try {
      this.eventSource = new EventSource(this.getEndpoint());
      
      this.eventSource.addEventListener('put', (e) => {
        if (this.isSyncing) return;
        try {
          const parsed = JSON.parse(e.data);
          if (parsed && parsed.data && typeof parsed.data === 'object' && parsed.path === '/') {
            const incoming = parsed.data;
            if (incoming.version) {
              const hasChanges = this.mergeIncomingData(incoming);
              if (hasChanges) {
                const isUserTyping = document.activeElement && (
                  document.activeElement.tagName === 'INPUT' || 
                  document.activeElement.tagName === 'TEXTAREA'
                );
                if (!isUserTyping) {
                  if (typeof renderCurrentView === 'function') {
                    renderCurrentView();
                  } else if (typeof renderDailySheet === 'function') {
                    renderDailySheet();
                  }
                }
              }
              this.lastSyncTime = new Date();
              this.isConnected = true;
              this.updateStatusBadge();
            }
          }
        } catch (err) {}
      });

      this.eventSource.onerror = () => {
        this.isConnected = false;
        this.updateStatusBadge();
      };

      this.eventSource.onopen = () => {
        this.isConnected = true;
        this.updateStatusBadge();
      };
    } catch (err) {
      console.warn('SSE connection error:', err);
    }
  }

  saveConfig(dbUrl, passphrase) {
    this.dbUrl = (dbUrl || '').trim();
    this.passphrase = (passphrase || '').trim();
    localStorage.setItem('BOL_SYNC_DB_URL', this.dbUrl);
    localStorage.setItem('BOL_SYNC_PASSPHRASE', this.passphrase);

    if (this.isConfigured()) {
      this.init();
      this.pushToCloud();
      showToast('⚡ Cloud Sync configured! Syncing now...');
    } else {
      if (this.eventSource) this.eventSource.close();
      this.isConnected = false;
      this.updateStatusBadge();
      showToast('Cloud Sync disconnected.');
    }
  }

  getPairingUrl() {
    if (!this.isConfigured()) return null;
    const base = window.location.origin + window.location.pathname;
    return `${base}?sync_url=${encodeURIComponent(this.dbUrl)}&sync_key=${encodeURIComponent(this.passphrase)}`;
  }

  updateStatusBadge() {
    const badge = document.getElementById('sync-status-indicator');
    if (badge) {
      if (this.isConnected) {
        badge.className = 'sync-status-badge connected';
        badge.innerHTML = '<span class="status-dot green"></span> Live Instant Sync (Connected)';
      } else if (this.isConfigured()) {
        badge.className = 'sync-status-badge connecting';
        badge.innerHTML = '<span class="status-dot yellow"></span> Connecting...';
      } else {
        badge.className = 'sync-status-badge offline';
        badge.innerHTML = '<span class="status-dot grey"></span> Offline (Local Only)';
      }
    }
  }
}

const syncManager = new SyncManager();

// Only reconnect realtime listener on focus if connection was dropped
window.addEventListener('focus', () => {
  if (syncManager.isConfigured() && !syncManager.isConnected) {
    syncManager.startRealtimeListener();
  }
});
