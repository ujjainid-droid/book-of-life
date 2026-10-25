/* ==========================================================================
   Book of Life / Life OS - Instant Cloud Sync Manager (Realtime Engine)
   ========================================================================== */

const DEFAULT_SYNC_DB_URL = 'https://book-of-life-11904-default-rtdb.firebaseio.com';
const DEFAULT_SYNC_PASSPHRASE = 'm-a-r-g-o';

class SyncManager {
  constructor() {
    this.dbUrl = localStorage.getItem('BOL_SYNC_DB_URL') || DEFAULT_SYNC_DB_URL;
    this.passphrase = localStorage.getItem('BOL_SYNC_PASSPHRASE') || DEFAULT_SYNC_PASSPHRASE;
    this.eventSource = null;
    this.isConnected = false;
    this.isSyncing = false;
    this.pendingPush = false;
    this.lastSyncTime = null;

    try {
      if (!localStorage.getItem('BOL_SYNC_DB_URL')) localStorage.setItem('BOL_SYNC_DB_URL', this.dbUrl);
      if (!localStorage.getItem('BOL_SYNC_PASSPHRASE')) localStorage.setItem('BOL_SYNC_PASSPHRASE', this.passphrase);
    } catch (e) {}

    // Check URL parameters for 1-tap quick pairing: ?sync_url=...&sync_key=...
    this.checkUrlParams();

    if (this.isConfigured()) {
      this.init();
    }
  }

  encodeFirebaseKeys(val) {
    if (Array.isArray(val)) {
      return val.map(item => this.encodeFirebaseKeys(item));
    }
    if (val !== null && typeof val === 'object') {
      const out = {};
      Object.entries(val).forEach(([k, v]) => {
        if (v === undefined) return;
        const safeKey = String(k || '__EMPTY__')
          .replace(/\$/g, '__DLR__')
          .replace(/\./g, '__DOT__')
          .replace(/#/g, '__HSH__')
          .replace(/\//g, '__SLS__')
          .replace(/\[/g, '__LBK__')
          .replace(/\]/g, '__RBK__');
        out[safeKey] = this.encodeFirebaseKeys(v);
      });
      return out;
    }
    return val;
  }

  decodeFirebaseKeys(val) {
    if (Array.isArray(val)) {
      return val.map(item => this.decodeFirebaseKeys(item));
    }
    if (val !== null && typeof val === 'object') {
      const out = {};
      Object.entries(val).forEach(([k, v]) => {
        const origKey = String(k)
          .replace(/__DLR__/g, '$')
          .replace(/__DOT__/g, '.')
          .replace(/__HSH__/g, '#')
          .replace(/__SLS__/g, '/')
          .replace(/__LBK__/g, '[')
          .replace(/__RBK__/g, ']')
          .replace(/^__EMPTY__$/, '');
        out[origKey] = this.decodeFirebaseKeys(v);
      });
      return out;
    }
    return val;
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
      let paramUrl = urlParams.get('sync_url');
      let paramKey = urlParams.get('sync_key');
      let modeParam = urlParams.get('mode');

      // Also support query params embedded inside location.hash (e.g. #today?sync_url=...)
      if ((!paramUrl || !paramKey) && window.location.hash && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQuery);
        paramUrl = paramUrl || hashParams.get('sync_url');
        paramKey = paramKey || hashParams.get('sync_key');
        modeParam = modeParam || hashParams.get('mode');
      }

      if (modeParam === 'family' || modeParam === 'partner') {
        localStorage.setItem('BOL_APP_MODE', 'family');
      } else if (modeParam === 'all' || modeParam === 'full' || modeParam === 'personal') {
        localStorage.setItem('BOL_APP_MODE', 'full');
      }

      if (paramUrl && paramKey) {
        this.dbUrl = decodeURIComponent(paramUrl);
        this.passphrase = decodeURIComponent(paramKey);
        localStorage.setItem('BOL_SYNC_DB_URL', this.dbUrl);
        localStorage.setItem('BOL_SYNC_PASSPHRASE', this.passphrase);
        const cleanSearch = (modeParam === 'family' || modeParam === 'partner') ? '?mode=family' : '';
        const cleanHash = (window.location.hash || '').split('?')[0];
        window.history.replaceState({}, document.title, window.location.pathname + cleanSearch + cleanHash);
        if (typeof showToast === 'function') {
          showToast('⚡ Instant Cloud Sync paired successfully!');
        }
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

    // 2. Habits: Union by id & lowercase name (excluding duplicate 'stand ring' as Anchor #2 is Stand)
    const habitMap = new Map();
    (Array.isArray(storage.data.habits) ? storage.data.habits : []).forEach(h => {
      if (h && h.name && h.name.toLowerCase().trim() !== 'stand ring') {
        habitMap.set(h.name.toLowerCase().trim(), { ...h });
      }
    });
    (Array.isArray(incoming.habits) ? incoming.habits : []).forEach(h => {
      if (h && h.name && h.name.toLowerCase().trim() !== 'stand ring') {
        const key = h.name.toLowerCase().trim();
        const existing = habitMap.get(key);
        habitMap.set(key, { ...(existing || {}), ...h });
      }
    });
    const mergedHabits = Array.from(habitMap.values());
    if (mergedHabits.length !== (Array.isArray(incoming.habits) ? incoming.habits.length : 0)) {
      localWasRicher = true;
    }

    // 3. HabitsState: Respect latest timestamp per date; when timestamps are both 0, prefer completed/higher stage
    const mergedHabitsState = { ...(storage.data.habitsState || {}) };
    const mergedHabitsUpdatedAt = { ...(storage.data.habitsUpdatedAt || {}), ...(incoming.habitsUpdatedAt || {}) };
    if (incoming.habitsState && typeof incoming.habitsState === 'object') {
      Object.entries(incoming.habitsState).forEach(([dStr, dObj]) => {
        const localDay = (storage.data.habitsState && storage.data.habitsState[dStr]) || null;
        const localTime = (storage.data.habitsUpdatedAt && storage.data.habitsUpdatedAt[dStr]) || 0;
        const cloudTime = (incoming.habitsUpdatedAt && incoming.habitsUpdatedAt[dStr]) || 0;

        if (!localDay) {
          mergedHabitsState[dStr] = { ...dObj };
          mergedHabitsUpdatedAt[dStr] = cloudTime;
        } else if (cloudTime > localTime) {
          // Cloud is strictly newer -> cloud wins!
          mergedHabitsState[dStr] = { ...localDay, ...dObj };
          mergedHabitsUpdatedAt[dStr] = cloudTime;
        } else if (localTime > cloudTime) {
          // Local is strictly newer -> local wins!
          mergedHabitsState[dStr] = { ...dObj, ...localDay };
          mergedHabitsUpdatedAt[dStr] = localTime;
          if (JSON.stringify(dObj) !== JSON.stringify(mergedHabitsState[dStr])) {
            localWasRicher = true;
          }
        } else {
          // Equal timestamps (e.g. 0 on initial boot): union keys preferring non-false / higher progress
          const combined = { ...dObj, ...localDay };
          Object.keys(dObj || {}).forEach(k => {
            const cVal = dObj[k];
            const lVal = localDay[k];
            if (cVal && (!lVal || (typeof cVal === 'number' && typeof lVal === 'number' && cVal > lVal))) {
              combined[k] = cVal;
            }
          });
          mergedHabitsState[dStr] = combined;
          if (JSON.stringify(dObj) !== JSON.stringify(combined)) {
            localWasRicher = true;
          }
        }
      });
    }

    // 4. ChoicesState: Compare timestamps so explicit updates win; when both 0, take higher count
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
          } else if (localTime > cloudTime) {
            mergedChoices[dStr] = localObj;
            if (cObj.good !== localObj.good || cObj.not !== localObj.not) {
              localWasRicher = true;
            }
          } else {
            // Both timestamps are equal (e.g. 0): take max so un-timestamped 0 doesn't wipe logged choices
            const maxGood = Math.max(0, parseInt(cObj.good, 10) || 0, parseInt(localObj.good, 10) || 0);
            const maxNot = Math.max(0, parseInt(cObj.not, 10) || 0, parseInt(localObj.not, 10) || 0);
            mergedChoices[dStr] = {
              good: maxGood,
              not: maxNot,
              updatedAt: cloudTime || localTime || 0
            };
            if (maxGood !== (parseInt(cObj.good, 10) || 0) || maxNot !== (parseInt(cObj.not, 10) || 0)) {
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

    // 6. DayGoals: Purge 12,000 steps seed, clean inverted keys, and respect latest timestamp
    const mergedDayGoals = { ...(storage.data.dayGoals || {}) };
    const mergedDayGoalsUpdatedAt = { ...(storage.data.dayGoalsUpdatedAt || {}), ...(incoming.dayGoalsUpdatedAt || {}) };

    // Clean any inverted day goals from local state
    Object.keys(mergedDayGoals).forEach(key => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) {
        const items = mergedDayGoals[key];
        if (Array.isArray(items)) {
          items.forEach(item => {
            const targetDate = (item && item.text && /^\d{4}-\d{2}-\d{2}$/.test(item.text.trim()))
              ? item.text.trim()
              : (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0]);
            if (!mergedDayGoals[targetDate]) mergedDayGoals[targetDate] = [];
            if (!mergedDayGoals[targetDate].some(g => g.id === item.id || g.text === key.trim())) {
              mergedDayGoals[targetDate].push({ ...item, text: key.trim() });
            }
          });
        }
        delete mergedDayGoals[key];
        localWasRicher = true;
      }
    });

    Object.keys(mergedDayGoals).forEach(dStr => {
      if (Array.isArray(mergedDayGoals[dStr])) {
        mergedDayGoals[dStr] = mergedDayGoals[dStr].filter(g => g && g.id !== 'dg-1' && !(g.text && (g.text.includes('12,000') || g.text.includes('12000'))));
      }
    });

    if (incoming.dayGoals && typeof incoming.dayGoals === 'object') {
      let cloudHadStale12k = false;
      Object.entries(incoming.dayGoals).forEach(([dStr, list]) => {
        // If incoming has an inverted non-date key, normalize it into valid date list
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dStr) && Array.isArray(list)) {
          list.forEach(item => {
            const targetDate = (item && item.text && /^\d{4}-\d{2}-\d{2}$/.test(item.text.trim()))
              ? item.text.trim()
              : (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0]);
            if (!mergedDayGoals[targetDate]) mergedDayGoals[targetDate] = [];
            if (!mergedDayGoals[targetDate].some(g => g.id === item.id || g.text === dStr.trim())) {
              mergedDayGoals[targetDate].push({ ...item, text: dStr.trim() });
            }
          });
          localWasRicher = true;
          return;
        }

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
          const localList = Array.isArray(mergedDayGoals[dStr]) ? mergedDayGoals[dStr] : null;

          if (cloudTime > localTime || !localList) {
            mergedDayGoals[dStr] = cleanIncoming;
            mergedDayGoalsUpdatedAt[dStr] = cloudTime;
          } else if (localTime > cloudTime) {
            mergedDayGoals[dStr] = localList;
            mergedDayGoalsUpdatedAt[dStr] = localTime;
            if (JSON.stringify(cleanIncoming) !== JSON.stringify(localList)) {
              localWasRicher = true;
            }
          } else {
            // Both 0: prefer non-empty list
            mergedDayGoals[dStr] = (localList.length >= cleanIncoming.length) ? localList : cleanIncoming;
            if (JSON.stringify(cleanIncoming) !== JSON.stringify(mergedDayGoals[dStr])) {
              localWasRicher = true;
            }
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

    // 7b. HairCareState: Two-way merge by updatedAt
    const mergedHairCareState = { ...(storage.data.hairCareState || {}) };
    try {
      const hairBackup = localStorage.getItem('HAIR_CARE_STATE_BACKUP');
      if (hairBackup) {
        const bObj = JSON.parse(hairBackup);
        if (bObj && typeof bObj === 'object') {
          Object.entries(bObj).forEach(([dStr, hObj]) => {
            if (hObj && (hObj.completed || hObj.skipped || hObj.updatedAt)) {
              const curT = (mergedHairCareState[dStr] && mergedHairCareState[dStr].updatedAt) || 0;
              const bakT = hObj.updatedAt || 0;
              if (!mergedHairCareState[dStr] || bakT >= curT) {
                mergedHairCareState[dStr] = { ...(mergedHairCareState[dStr] || {}), ...hObj };
              }
            }
          });
        }
      }
    } catch (e) {}

    if (incoming.hairCareState && typeof incoming.hairCareState === 'object') {
      Object.entries(incoming.hairCareState).forEach(([dStr, hObj]) => {
        const localDay = mergedHairCareState[dStr];
        if (!localDay || Object.keys(localDay).length === 0) {
          mergedHairCareState[dStr] = { ...hObj };
        } else {
          const localTime = (localDay && localDay.updatedAt) || 0;
          const cloudTime = (hObj && hObj.updatedAt) || 0;
          if (cloudTime > localTime) {
            mergedHairCareState[dStr] = { ...localDay, ...hObj };
          } else if (localTime > cloudTime) {
            mergedHairCareState[dStr] = { ...hObj, ...localDay };
            if (JSON.stringify(hObj) !== JSON.stringify(mergedHairCareState[dStr])) {
              localWasRicher = true;
            }
          } else {
            mergedHairCareState[dStr] = { ...hObj, ...localDay };
            if (hObj.completed || hObj.skipped) {
              mergedHairCareState[dStr] = { ...localDay, ...hObj };
            }
          }
        }
      });
    }
    try {
      localStorage.setItem('HAIR_CARE_STATE_BACKUP', JSON.stringify(mergedHairCareState));
    } catch (e) {}

    // 7c. SkinCareState: Two-way merge by updatedAt
    const mergedSkinCareState = { ...(storage.data.skinCareState || {}) };
    try {
      const skinBackup = localStorage.getItem('SKIN_CARE_STATE_BACKUP');
      if (skinBackup) {
        const bObj = JSON.parse(skinBackup);
        if (bObj && typeof bObj === 'object') {
          Object.entries(bObj).forEach(([dStr, sObj]) => {
            if (sObj && (sObj.completed || sObj.skipped || sObj.updatedAt)) {
              const curT = (mergedSkinCareState[dStr] && mergedSkinCareState[dStr].updatedAt) || 0;
              const bakT = sObj.updatedAt || 0;
              if (!mergedSkinCareState[dStr] || bakT >= curT) {
                mergedSkinCareState[dStr] = { ...(mergedSkinCareState[dStr] || {}), ...sObj };
              }
            }
          });
        }
      }
    } catch (e) {}

    if (incoming.skinCareState && typeof incoming.skinCareState === 'object') {
      Object.entries(incoming.skinCareState).forEach(([dStr, sObj]) => {
        const localDay = mergedSkinCareState[dStr];
        if (!localDay || Object.keys(localDay).length === 0) {
          mergedSkinCareState[dStr] = { ...sObj };
        } else {
          const localTime = (localDay && localDay.updatedAt) || 0;
          const cloudTime = (sObj && sObj.updatedAt) || 0;
          if (cloudTime > localTime) {
            mergedSkinCareState[dStr] = { ...localDay, ...sObj };
          } else if (localTime > cloudTime) {
            mergedSkinCareState[dStr] = { ...sObj, ...localDay };
            if (JSON.stringify(sObj) !== JSON.stringify(mergedSkinCareState[dStr])) {
              localWasRicher = true;
            }
          } else {
            mergedSkinCareState[dStr] = { ...sObj, ...localDay };
            if (sObj.completed || sObj.skipped) {
              mergedSkinCareState[dStr] = { ...localDay, ...sObj };
            }
          }
        }
      });
    }
    try {
      localStorage.setItem('SKIN_CARE_STATE_BACKUP', JSON.stringify(mergedSkinCareState));
    } catch (e) {}

    // 7d. SkincareShoppingList
    const mergedSkinShopping = {
      ...(storage.data.skincareShoppingList || {}),
      ...(incoming.skincareShoppingList || {})
    };

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

    // 9. Claims: Merge & sanitize against synthetic legacy placeholders
    const claimsMap = new Map();
    if (typeof DEFAULT_REAL_CLAIMS !== 'undefined' && Array.isArray(DEFAULT_REAL_CLAIMS)) {
      DEFAULT_REAL_CLAIMS.forEach(c => {
        if (c && c.id) claimsMap.set(c.id, { ...c });
      });
    }

    const isSyntheticClaim = (id) => {
      if (!id) return true;
      if (id.startsWith('claim-demo-')) return true;
      if (id === 'claim-ms-01') return true;
      if (/^claim-barness-\d+$/.test(id)) return true;
      return false;
    };

    (Array.isArray(storage.data.claims) ? storage.data.claims : []).forEach(c => {
      if (c && c.id && !isSyntheticClaim(c.id)) {
        const ex = claimsMap.get(c.id);
        claimsMap.set(c.id, { ...(ex || {}), ...c });
      }
    });

    (Array.isArray(incoming.claims) ? incoming.claims : []).forEach(c => {
      if (c && c.id && !isSyntheticClaim(c.id)) {
        const ex = claimsMap.get(c.id);
        const exTime = (ex && ex.updatedAt) ? new Date(ex.updatedAt).getTime() : 0;
        const incTime = c.updatedAt ? new Date(c.updatedAt).getTime() : 0;
        if (!ex || incTime >= exTime) {
          claimsMap.set(c.id, { ...(ex || {}), ...c });
        } else {
          claimsMap.set(c.id, { ...c, ...ex });
          localWasRicher = true;
        }
      }
    });

    const mergedClaims = Array.from(claimsMap.values()).map(c => {
      const claim = { ...c };
      claim.date = claim.date || claim.dateOfService || formatDateIso(new Date());
      claim.amountPaid = Number(claim.amountPaid !== undefined ? claim.amountPaid : (claim.amountBilled || 0));
      claim.patient = claim.patient || 'Xavier Healy';
      claim.superbillStatus = claim.superbillStatus || 'have';
      claim.submissionType = claim.submissionType || 'provider';
      claim.payoutMethod = claim.payoutMethod || 'direct_deposit';
      return claim;
    });

    // 10. Z Log and Titration Seeds: Two-way merge strictly preserving user notes, ratings, and attachments
    const localZLog = (storage.data.zlogEntries && typeof storage.data.zlogEntries === 'object') ? storage.data.zlogEntries : {};
    const incomingZLog = (incoming.zlogEntries && typeof incoming.zlogEntries === 'object') ? incoming.zlogEntries : {};
    const defaultsZLog = (typeof DEFAULT_ZLOG_ENTRIES !== 'undefined') ? DEFAULT_ZLOG_ENTRIES : {};

    const mergedZLog = {};
    const allZLogDates = new Set([...Object.keys(defaultsZLog), ...Object.keys(incomingZLog), ...Object.keys(localZLog)]);

    allZLogDates.forEach(dStr => {
      const def = defaultsZLog[dStr] || null;
      const inc = incomingZLog[dStr] || null;
      const loc = localZLog[dStr] || null;

      // Start with base defaults if available
      let entry = def ? { ...def } : {};

      if (!inc && loc) {
        entry = { ...entry, ...loc };
        localWasRicher = true;
      } else if (inc && !loc) {
        entry = { ...entry, ...inc };
      } else if (inc && loc) {
        const locTime = loc.updatedAt ? new Date(loc.updatedAt).getTime() : 0;
        const incTime = inc.updatedAt ? new Date(inc.updatedAt).getTime() : 0;

        const locHasNotes = !!(loc.notes && loc.notes.trim());
        const incHasNotes = !!(inc.notes && inc.notes.trim());
        const locHasRating = loc.rating !== null && loc.rating !== undefined;
        const incHasRating = inc.rating !== null && inc.rating !== undefined;

        // Merge attachments safely
        const mergedAtts = [];
        const seenAttIds = new Set();
        [...(loc.attachments || []), ...(inc.attachments || []), ...(def && def.attachments ? def.attachments : [])].forEach(a => {
          if (a && a.id && !seenAttIds.has(a.id)) {
            seenAttIds.add(a.id);
            mergedAtts.push(a);
          }
        });

        // Determine winner
        if ((locHasNotes && !incHasNotes) || (locHasRating && !incHasRating)) {
          entry = { ...entry, ...inc, ...loc, attachments: mergedAtts };
          localWasRicher = true;
        } else if ((incHasNotes && !locHasNotes) || (incHasRating && !locHasRating)) {
          entry = { ...entry, ...loc, ...inc, attachments: mergedAtts };
        } else if (locTime > incTime) {
          entry = { ...entry, ...inc, ...loc, attachments: mergedAtts };
          if (JSON.stringify(inc) !== JSON.stringify(entry)) {
            localWasRicher = true;
          }
        } else {
          entry = { ...entry, ...loc, ...inc, attachments: mergedAtts };
        }
      }

      // Check dedicated backup in localStorage for extra resilience
      try {
        const backupStr = localStorage.getItem('ZLOG_ENTRY_BACKUP_' + dStr);
        if (backupStr) {
          const bObj = JSON.parse(backupStr);
          if (bObj) {
            const bHasNotes = !!(bObj.notes && bObj.notes.trim());
            const bHasRating = bObj.rating !== null && bObj.rating !== undefined;
            if ((bHasNotes && (!entry.notes || !entry.notes.trim())) || (bHasRating && (entry.rating === null || entry.rating === undefined))) {
              entry = { ...entry, ...bObj };
              localWasRicher = true;
            }
          }
        }
      } catch (e) {}

      mergedZLog[dStr] = entry;
    });

    const mergedZLogVersion = Math.max(Number(incoming.zlogSeedVersion) || 0, Number(storage.data.zlogSeedVersion) || 0, 16);

    let mergedTitration = incoming.titrationHistory;
    let mergedTitVersion = Math.max(Number(incoming.titrationSeedVersion) || 0, Number(storage.data.titrationSeedVersion) || 0, 7);
    if (!Array.isArray(mergedTitration) || mergedTitration.length < 35) {
      mergedTitration = (typeof DEFAULT_TITRATION_HISTORY !== 'undefined') ? JSON.parse(JSON.stringify(DEFAULT_TITRATION_HISTORY)) : [];
      mergedTitVersion = 7;
      localWasRicher = true;
    }

    // 11. Cover Page: Top of Mind, Topic Audits & Campaigns (respecting coverUpdatedAt)
    let locCoverTime = Number(storage.data.coverUpdatedAt) || 0;
    let locCoverCampaigns = storage.data.coverCampaigns;
    try {
      const dedicatedCover = localStorage.getItem('BOL_COVER_CAMPAIGNS_V2');
      if (dedicatedCover) {
        const parsedCover = JSON.parse(dedicatedCover);
        if (parsedCover && parsedCover.coverCampaigns && typeof parsedCover.coverCampaigns === 'object') {
          const dedTime = Number(parsedCover.coverUpdatedAt) || 0;
          if (dedTime >= locCoverTime) {
            locCoverTime = dedTime;
            locCoverCampaigns = {
              now: Array.isArray(parsedCover.coverCampaigns.now) ? parsedCover.coverCampaigns.now : [],
              later: Array.isArray(parsedCover.coverCampaigns.later) ? parsedCover.coverCampaigns.later : []
            };
          }
        }
      }
    } catch (e) {}

    const incCoverTime = Number(incoming.coverUpdatedAt) || 0;
    const mergedCoverUpdatedAt = Math.max(locCoverTime, incCoverTime);

    let mergedTopMind = (locCoverTime >= incCoverTime && storage.data.coverTopMind)
      ? storage.data.coverTopMind
      : incoming.coverTopMind;
    if (!mergedTopMind || (!Array.isArray(mergedTopMind.now) && !Array.isArray(mergedTopMind.later))) {
      mergedTopMind = storage.data.coverTopMind || { now: [], later: [] };
      if (storage.data.coverTopMind) localWasRicher = true;
    }

    let mergedTopicAudits = (locCoverTime >= incCoverTime && Array.isArray(storage.data.coverTopicAudits) && storage.data.coverTopicAudits.length > 0)
      ? storage.data.coverTopicAudits
      : incoming.coverTopicAudits;
    if (!Array.isArray(mergedTopicAudits) || mergedTopicAudits.length === 0) {
      if (Array.isArray(storage.data.coverTopicAudits) && storage.data.coverTopicAudits.length > 0) {
        mergedTopicAudits = storage.data.coverTopicAudits;
        localWasRicher = true;
      } else {
        mergedTopicAudits = incoming.coverTopicAudits || [];
      }
    }

    // 12. Cover Page: Life Architecture & Focus Board (Now vs. Later)
    const normalizedIncomingCampaigns = (incoming.coverCampaigns && typeof incoming.coverCampaigns === 'object')
      ? {
          now: Array.isArray(incoming.coverCampaigns.now) ? incoming.coverCampaigns.now : [],
          later: Array.isArray(incoming.coverCampaigns.later) ? incoming.coverCampaigns.later : []
        }
      : null;

    let mergedCampaigns = (locCoverTime >= incCoverTime && locCoverCampaigns)
      ? locCoverCampaigns
      : (normalizedIncomingCampaigns || locCoverCampaigns);
    if (locCoverTime > incCoverTime) {
      localWasRicher = true;
    }
    let mergedCampVersion = Math.max(Number(incoming.coverCampaignsSeedVersion) || 0, Number(storage.data.coverCampaignsSeedVersion) || 0, 9);
    if (!mergedCampaigns || (!Array.isArray(mergedCampaigns.now) && !Array.isArray(mergedCampaigns.later))) {
      const defaults = (typeof storage !== 'undefined' && storage.getDefaultState) ? storage.getDefaultState() : null;
      mergedCampaigns = locCoverCampaigns
        ? locCoverCampaigns
        : (defaults ? JSON.parse(JSON.stringify(defaults.coverCampaigns)) : { now: [], later: [] });
      mergedCampVersion = 9;
      localWasRicher = true;
    }
    if (!Array.isArray(mergedCampaigns.now)) mergedCampaigns.now = [];
    if (!Array.isArray(mergedCampaigns.later)) mergedCampaigns.later = [];

    // Ensure Chin hair is present in later if not already in now or later
    const hasChinHair = [...(mergedCampaigns.now || []), ...(mergedCampaigns.later || [])].some(c =>
      c && (c.id === 'camp-chinhair' || (c.title || '').toLowerCase().trim() === 'chin hair')
    );
    if (!hasChinHair && Array.isArray(mergedCampaigns.later)) {
      const defaults = (typeof storage !== 'undefined' && storage.getDefaultState) ? storage.getDefaultState() : null;
      const chinHairDefault = defaults && defaults.coverCampaigns && defaults.coverCampaigns.later
        ? defaults.coverCampaigns.later.find(c => c && c.id === 'camp-chinhair')
        : null;
      if (chinHairDefault) {
        mergedCampaigns.later.push(JSON.parse(JSON.stringify(chinHairDefault)));
        localWasRicher = true;
      }
    }
    // Ensure Shoes is present in later if not already in now or later
    const hasShoes = [...(mergedCampaigns.now || []), ...(mergedCampaigns.later || [])].some(c =>
      c && (c.id === 'camp-shoes' || (c.title || '').toLowerCase().trim() === 'shoes')
    );
    if (!hasShoes && Array.isArray(mergedCampaigns.later)) {
      const defaults = (typeof storage !== 'undefined' && storage.getDefaultState) ? storage.getDefaultState() : null;
      const shoesDefault = defaults && defaults.coverCampaigns && defaults.coverCampaigns.later
        ? defaults.coverCampaigns.later.find(c => c && c.id === 'camp-shoes')
        : null;
      if (shoesDefault) {
        mergedCampaigns.later.push(JSON.parse(JSON.stringify(shoesDefault)));
        localWasRicher = true;
      }
    }
    ['now', 'later'].forEach(tierKey => {
      if (mergedCampaigns && Array.isArray(mergedCampaigns[tierKey])) {
        mergedCampaigns[tierKey].forEach(c => {
          if (c && (c.id === 'camp-haircare' || (c.title || '').toLowerCase().trim() === 'haircare')) {
            if (!['IP', 'NS', 'Maintain', 'Done'].includes(c.status)) c.status = 'Maintain';
            c.tools = {
              margo: { label: 'Haircare Checkpoint', action: 'haircare' },
              apple: { noteQuery: '# BEAUTY 02_HAIR' }
            };
            c.visibleTools = ['margo', 'apple'];
          }
        });
      }
    });

    // 7c. AuroraDailyState: Two-way merge by updatedAt
    const mergedAuroraDailyState = { ...(storage.data.auroraDailyState || {}) };
    if (incoming.auroraDailyState && typeof incoming.auroraDailyState === 'object') {
      Object.entries(incoming.auroraDailyState).forEach(([dStr, aObj]) => {
        const loc = mergedAuroraDailyState[dStr];
        if (!loc) {
          mergedAuroraDailyState[dStr] = { ...aObj };
        } else {
          const locTime = (loc && loc.updatedAt) || 0;
          const incTime = (aObj && aObj.updatedAt) || 0;
          if (incTime > locTime) {
            mergedAuroraDailyState[dStr] = { ...aObj };
          } else if (locTime > incTime && JSON.stringify(aObj) !== JSON.stringify(loc)) {
            localWasRicher = true;
          } else if (incTime === 0 && locTime === 0) {
            // Prefer whichever has higher moveCal, stand hours, or steps
            const incMove = Number(aObj && aObj.moveCal) || 0;
            const locMove = Number(loc && loc.moveCal) || 0;
            const incStand = Array.isArray(aObj && aObj.hours) ? aObj.hours.filter(Boolean).length : 0;
            const locStand = Array.isArray(loc && loc.hours) ? loc.hours.filter(Boolean).length : 0;
            const incSteps = Number(aObj && aObj.steps) || 0;
            const locSteps = Number(loc && loc.steps) || 0;
            if (incMove > locMove || incStand > locStand || incSteps > locSteps) {
              mergedAuroraDailyState[dStr] = { ...aObj };
            } else if (locMove > incMove || locStand > incStand || locSteps > incSteps) {
              localWasRicher = true;
            }
          }
        }
      });
    }
    if (Object.keys(mergedAuroraDailyState).length > Object.keys(incoming.auroraDailyState || {}).length) {
      localWasRicher = true;
    }

    // 11c. PeriodGoals: 2-way merge preserving daily logs
    const pgMap = new Map();
    (Array.isArray(storage.data.periodGoals) ? storage.data.periodGoals : []).forEach(pg => {
      if (pg && pg.id) pgMap.set(pg.id, { ...pg, logs: { ...(pg.logs || {}) } });
    });
    if (Array.isArray(incoming.periodGoals)) {
      incoming.periodGoals.forEach(pg => {
        if (pg && pg.id) {
          const loc = pgMap.get(pg.id);
          if (!loc) {
            pgMap.set(pg.id, { ...pg, logs: { ...(pg.logs || {}) } });
          } else {
            const locTime = loc.updatedAt || 0;
            const incTime = pg.updatedAt || 0;
            const mergedLogs = incTime >= locTime
              ? { ...(loc.logs || {}), ...(pg.logs || {}) }
              : { ...(pg.logs || {}), ...(loc.logs || {}) };
            pgMap.set(pg.id, {
              ...(incTime >= locTime ? loc : pg),
              ...(incTime >= locTime ? pg : loc),
              logs: mergedLogs,
              updatedAt: Math.max(locTime, incTime)
            });
            if (locTime > incTime || JSON.stringify(mergedLogs) !== JSON.stringify(pg.logs || {})) {
              localWasRicher = true;
            }
          }
        }
      });
    }
    const mergedPeriodGoals = Array.from(pgMap.values());

    // Keep mergedHabitsState consistent with mergedAuroraDailyState and mergedPeriodGoals for accurate streaks
    Object.entries(mergedAuroraDailyState).forEach(([dStr, aObj]) => {
      if (!aObj || typeof aObj !== 'object') return;
      if (!mergedHabitsState[dStr]) mergedHabitsState[dStr] = {};
      const moveCal = Number(aObj.moveCal) || 0;
      const moveAnch = (aObj.anch && typeof aObj.anch.move === 'number') ? aObj.anch.move : 0;
      if (moveCal >= 300 || moveAnch === 4) {
        mergedHabitsState[dStr]['h-move'] = 1;
      }
      const standHours = Array.isArray(aObj.hours) ? aObj.hours.filter(Boolean).length : 0;
      const standAnch = (aObj.anch && typeof aObj.anch.stand === 'number') ? aObj.anch.stand : 0;
      if (standHours >= 12 || standAnch === 4) {
        mergedHabitsState[dStr]['h-stand'] = 1;
      }
      const stepsCount = Number(aObj.steps) || 0;
      const stepsAnch = (aObj.anch && typeof aObj.anch.steps === 'number') ? aObj.anch.steps : 0;
      if (stepsCount >= 10000 || stepsAnch === 4) {
        mergedHabitsState[dStr]['h-steps'] = 1;
      }
    });

    // 11d. Weight Logs & Target: 2-way merge by weightUpdatedAt
    const locWeightTime = Number(storage.data.weightUpdatedAt) || 0;
    const incWeightTime = Number(incoming.weightUpdatedAt) || 0;
    const mergedWeightUpdatedAt = Math.max(locWeightTime, incWeightTime);
    const mergedWeightLogs = incWeightTime >= locWeightTime
      ? { ...(storage.data.weightLogs || {}), ...(incoming.weightLogs || {}) }
      : { ...(incoming.weightLogs || {}), ...(storage.data.weightLogs || {}) };
    const mergedWeightTarget = (incWeightTime >= locWeightTime && incoming.weightTarget)
      ? incoming.weightTarget
      : (storage.data.weightTarget || incoming.weightTarget || 110);
    if (locWeightTime > incWeightTime || JSON.stringify(mergedWeightLogs) !== JSON.stringify(incoming.weightLogs || {})) {
      localWasRicher = true;
    }

    // 11e. Hobbies & Hobby Shortlist: 2-way merge by hobbiesUpdatedAt
    const locHobTime = Number(storage.data.hobbiesUpdatedAt) || 0;
    const incHobTime = Number(incoming.hobbiesUpdatedAt) || 0;
    const mergedHobbiesUpdatedAt = Math.max(locHobTime, incHobTime);
    let mergedHobbies = (incHobTime >= locHobTime && Array.isArray(incoming.hobbies) && incoming.hobbies.length > 0)
      ? incoming.hobbies
      : (Array.isArray(storage.data.hobbies) && storage.data.hobbies.length > 0 ? storage.data.hobbies : (incoming.hobbies || []));
    let mergedHobbyShortlist = (incHobTime >= locHobTime && Array.isArray(incoming.hobbyShortlist))
      ? incoming.hobbyShortlist
      : (Array.isArray(storage.data.hobbyShortlist) ? storage.data.hobbyShortlist : (incoming.hobbyShortlist || []));
    if (locHobTime > incHobTime) {
      localWasRicher = true;
    }

    // 11f. Finance State: 2-way merge by updatedAt preserving checklists across devices
    const locFin = storage.data.finance || {};
    const incFin = incoming.finance || {};
    const locFinTime = Number(locFin.updatedAt) || 0;
    const incFinTime = Number(incFin.updatedAt) || 0;

    const mergeChecklistMaps = (incMap = {}, locMap = {}) => {
      const result = {};
      const allKeys = new Set([...Object.keys(incMap || {}), ...Object.keys(locMap || {})]);
      allKeys.forEach(k => {
        const incItem = incMap[k];
        const locItem = locMap[k];
        if (incItem && !locItem) {
          result[k] = typeof incItem === 'object' ? { ...incItem } : incItem;
        } else if (locItem && !incItem) {
          result[k] = typeof locItem === 'object' ? { ...locItem } : locItem;
        } else if (typeof incItem === 'object' && typeof locItem === 'object') {
          if (incFinTime > locFinTime) {
            result[k] = { ...locItem, ...incItem };
          } else if (locFinTime > incFinTime) {
            result[k] = { ...incItem, ...locItem };
          } else {
            // Equal/zero timestamps: merge item-by-item preferring true over default false
            const combined = { ...incItem, ...locItem };
            Object.keys({ ...incItem, ...locItem }).forEach(stepKey => {
              combined[stepKey] = Boolean(incItem[stepKey] || locItem[stepKey]);
            });
            result[k] = combined;
          }
        } else {
          result[k] = (incFinTime > locFinTime) ? incItem : ((locFinTime > incFinTime) ? locItem : Boolean(incItem || locItem));
        }
      });
      return result;
    };

    const mergedWeeklyChecklists = mergeChecklistMaps(incFin.weeklyChecklists, locFin.weeklyChecklists);
    const mergedQuarterlyChecklists = mergeChecklistMaps(incFin.quarterlyChecklists, locFin.quarterlyChecklists);
    const mergedAnnualChecklists = mergeChecklistMaps(incFin.annualChecklists, locFin.annualChecklists);
    const mergedWeeklySundayUpdates = mergeChecklistMaps(incFin.weeklySundayUpdates, locFin.weeklySundayUpdates);

    const mergedFinance = {
      ...(incFinTime >= locFinTime ? locFin : incFin),
      ...(incFinTime >= locFinTime ? incFin : locFin),
      weeklyChecklists: mergedWeeklyChecklists,
      quarterlyChecklists: mergedQuarterlyChecklists,
      annualChecklists: mergedAnnualChecklists,
      weeklySundayUpdates: mergedWeeklySundayUpdates,
      updatedAt: Math.max(locFinTime, incFinTime)
    };
    if (locFinTime > incFinTime) {
      localWasRicher = true;
    }
    try {
      localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(mergedFinance));
      localStorage.setItem('BOL_FINANCE_WEEKLY_CHECKLISTS', JSON.stringify(mergedWeeklyChecklists));
    } catch (e) {}

    // Apply consolidated data
    storage.data = {
      ...storage.data,
      ...incoming,
      finance: mergedFinance,
      coverTopMind: mergedTopMind,
      coverTopicAudits: mergedTopicAudits,
      coverCampaigns: mergedCampaigns,
      coverCampaignsSeedVersion: mergedCampVersion,
      coverUpdatedAt: mergedCoverUpdatedAt,
      points: mergedPoints,
      habits: mergedHabits,
      habitsState: mergedHabitsState,
      habitsUpdatedAt: mergedHabitsUpdatedAt,
      auroraDailyState: mergedAuroraDailyState,
      periodGoals: mergedPeriodGoals.length > 0 ? mergedPeriodGoals : storage.getPeriodGoals(),
      weightLogs: mergedWeightLogs,
      weightTarget: mergedWeightTarget,
      weightUpdatedAt: mergedWeightUpdatedAt,
      hobbies: mergedHobbies,
      hobbyShortlist: mergedHobbyShortlist,
      hobbiesUpdatedAt: mergedHobbiesUpdatedAt,
      choicesState: mergedChoices,
      healthState: mergedHealth,
      dayGoals: mergedDayGoals,
      dayGoalsUpdatedAt: mergedDayGoalsUpdatedAt,
      sanctuaryJournals: mergedJournals,
      hairCareState: mergedHairCareState,
      skinCareState: mergedSkinCareState,
      skincareShoppingList: mergedSkinShopping,
      quickThoughts: mergedThoughts,
      claims: mergedClaims,
      zlogEntries: mergedZLog,
      zlogSeedVersion: mergedZLogVersion,
      titrationHistory: mergedTitration,
      titrationSeedVersion: mergedTitVersion
    };

    storage.recalculateAllStreaks();
    storage.recalculatePointsFromHistory(true);

    try {
      localStorage.setItem('BOOK_OF_LIFE_DATA_V2', JSON.stringify(storage.data));
      localStorage.setItem('BOOK_OF_LIFE_DATA_BACKUP', JSON.stringify(storage.data));
      if (storage.data.coverCampaigns) {
        localStorage.setItem('BOL_COVER_CAMPAIGNS_V2', JSON.stringify({
          coverCampaigns: storage.data.coverCampaigns,
          coverUpdatedAt: storage.data.coverUpdatedAt || 0,
          coverCampaignsSeedVersion: storage.data.coverCampaignsSeedVersion || 9
        }));
      }
    } catch (e) {}

    if (localWasRicher) {
      this.pendingPush = true;
    }

    return true;
  }

  async pullFromCloud() {
    if (!this.isConfigured() || this.isSyncing) return;
    try {
      this.isSyncing = true;
      this.updateStatusBadge();
      const separator = this.getEndpoint().includes('?') ? '&' : '?';
      const res = await fetch(`${this.getEndpoint()}${separator}_t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const rawCloudData = await res.json();
      const cloudData = this.decodeFirebaseKeys(rawCloudData);

      if (cloudData && typeof cloudData === 'object' && cloudData.version) {
        const hasChanges = this.mergeIncomingData(cloudData);
        if (hasChanges) {
          // Only re-render if user is NOT actively typing and NO modal is open
          const isUserTyping = document.activeElement && (
            document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA'
          );
          const isModalActive = Boolean(document.querySelector('.modal-overlay.active'));
          if (!isUserTyping && !isModalActive) {
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
        this.pendingPush = true;
      }
    } catch (err) {
      console.warn('Cloud pull error:', err);
    } finally {
      this.isSyncing = false;
      this.updateStatusBadge();
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
      this.updateStatusBadge();
      this.pendingPush = false;
      const safeData = this.encodeFirebaseKeys(storage.data);
      const payload = JSON.stringify(safeData);
      const res = await fetch(this.getEndpoint(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });
      if (res.ok) {
        this.lastSyncTime = new Date();
        this.isConnected = true;
        this.updateStatusBadge();
      } else {
        console.warn('Cloud push HTTP error:', res.status);
      }
    } catch (err) {
      console.warn('Cloud push error:', err);
    } finally {
      this.isSyncing = false;
      this.updateStatusBadge();
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
            const incoming = this.decodeFirebaseKeys(parsed.data);
            if (incoming.version) {
              const hasChanges = this.mergeIncomingData(incoming);
              if (hasChanges) {
                const isUserTyping = document.activeElement && (
                  document.activeElement.tagName === 'INPUT' || 
                  document.activeElement.tagName === 'TEXTAREA'
                );
                const isModalActive = Boolean(document.querySelector('.modal-overlay.active'));
                if (!isUserTyping && !isModalActive) {
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

  async saveConfig(dbUrl, passphrase) {
    this.dbUrl = (dbUrl || '').trim();
    this.passphrase = (passphrase || '').trim();
    localStorage.setItem('BOL_SYNC_DB_URL', this.dbUrl);
    localStorage.setItem('BOL_SYNC_PASSPHRASE', this.passphrase);

    if (this.isConfigured()) {
      showToast('⚡ Cloud Sync configured! Syncing now...');
      await this.init();
      await this.pushToCloud();
    } else {
      if (this.eventSource) this.eventSource.close();
      this.isConnected = false;
      this.updateStatusBadge();
      showToast('Cloud Sync disconnected.');
    }
  }

  getMobileBaseUrl() {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'https://ujjainid-droid.github.io/book-of-life/';
    }
    return window.location.origin + window.location.pathname;
  }

  getPairingUrl() {
    if (!this.isConfigured()) return null;
    const base = this.getMobileBaseUrl();
    return `${base}?sync_url=${encodeURIComponent(this.dbUrl)}&sync_key=${encodeURIComponent(this.passphrase)}`;
  }

  getFamilyPairingUrl() {
    const base = this.getMobileBaseUrl();
    if (this.isConfigured()) {
      return `${base}?mode=family&sync_url=${encodeURIComponent(this.dbUrl)}&sync_key=${encodeURIComponent(this.passphrase)}#zhub`;
    }
    return `${base}?mode=family#zhub`;
  }

  updateStatusBadge() {
    const badge = document.getElementById('sync-status-indicator');
    if (badge) {
      if (this.isConnected) {
        badge.className = 'sync-status-badge connected';
        badge.innerHTML = '<span class="status-dot green"></span> Live Instant Sync (Connected)';
      } else if (this.isConfigured()) {
        badge.className = 'sync-status-badge connecting';
        badge.innerHTML = '<span class="status-dot blue"></span> Connecting...';
      } else {
        badge.className = 'sync-status-badge offline';
        badge.innerHTML = '<span class="status-dot grey"></span> Offline (Local Only)';
      }
    }

    // Global Header Sync Pill
    const dot = document.getElementById('global-sync-dot');
    const label = document.getElementById('global-sync-label');
    const btn = document.getElementById('globalSyncBtn');
    if (dot && label) {
      if (this.isSyncing) {
        dot.className = 'sync-dot syncing';
        label.textContent = 'Syncing...';
        if (btn) btn.title = 'Syncing with Firebase Cloud...';
      } else if (this.isConnected) {
        dot.className = 'sync-dot connected';
        label.textContent = 'Synced';
        const timeStr = this.lastSyncTime ? this.lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now';
        if (btn) btn.title = `Cloud Sync Active · Last synced ${timeStr} (Click for Settings)`;
      } else if (this.isConfigured()) {
        dot.className = 'sync-dot connecting';
        label.textContent = 'Connecting...';
        if (btn) btn.title = 'Connecting to Firebase Cloud...';
      } else {
        dot.className = 'sync-dot offline';
        label.textContent = 'Local';
        if (btn) btn.title = 'Local only · Click to configure Cloud Sync';
      }
    }
  }
}

const syncManager = new SyncManager();

// Re-sync and reconnect when switching back to Mobile Chrome or Desktop Chrome tab
function handleAppWakeSync() {
  if (syncManager.isConfigured()) {
    syncManager.pullFromCloud();
    if (!syncManager.isConnected || !syncManager.eventSource || syncManager.eventSource.readyState === 2) {
      syncManager.startRealtimeListener();
    }
  }
}

window.addEventListener('focus', handleAppWakeSync);
window.addEventListener('pageshow', handleAppWakeSync);
window.addEventListener('online', handleAppWakeSync);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    handleAppWakeSync();
  }
});

// Lightweight background poll while visible to guard against Mobile Chrome dropping SSE streams silently
setInterval(() => {
  if (document.visibilityState === 'visible' && syncManager.isConfigured() && !syncManager.isSyncing) {
    syncManager.pullFromCloud();
  }
}, 12000);

