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

    // Check if cloud data is already identical to local
    const incomingStr = JSON.stringify(incoming);
    const localStr = JSON.stringify(storage.data);
    if (incomingStr === localStr) return false;

    // Smart-merge claims: NEVER allow an older cloud snapshot to erase locally added claims
    if (Array.isArray(storage.data.claims)) {
      const localClaims = storage.data.claims;
      const cloudClaims = Array.isArray(incoming.claims) ? incoming.claims : [];
      const claimsMap = new Map();

      // Add cloud claims first
      cloudClaims.forEach(c => claimsMap.set(c.id, c));

      // Add/overwrite with local claims so newly added/edited local claims always survive
      localClaims.forEach(c => {
        const existing = claimsMap.get(c.id);
        if (!existing || (c.updatedAt && (!existing.updatedAt || c.updatedAt >= existing.updatedAt))) {
          claimsMap.set(c.id, c);
        }
      });

      incoming.claims = Array.from(claimsMap.values());
    }

    // Merge into local storage
    storage.data = { ...storage.data, ...incoming };
    try {
      localStorage.setItem('BOOK_OF_LIFE_DATA_V2', JSON.stringify(storage.data));
    } catch (e) {}

    storage.recalculateAllStreaks();
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
