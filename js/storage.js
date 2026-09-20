/* ==========================================================================
   Book of Life / Life OS - Storage & Data Persistence Manager
   ========================================================================== */

const STORAGE_KEY = 'BOOK_OF_LIFE_DATA_V2';

class StorageManager {
  constructor() {
    this.data = this.loadData();
    this.applyZeroResetFix();
    this.recalculateAllStreaks();
    this.recalculatePointsFromHistory();
  }

  applyZeroResetFix() {
    const todayStr = (typeof formatDateIso === 'function') ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0];
    const resetMarker = 'BOL_ZERO_RESET_APPLIED_V6';
    try {
      if (typeof localStorage !== 'undefined' && !localStorage.getItem(resetMarker)) {
        // Set today's choices explicitly to 0
        if (!this.data.choicesState) this.data.choicesState = {};
        this.data.choicesState[todayStr] = { good: 0, not: 0, updatedAt: Date.now() };

        // Clean out any stale hardcoded { good: 3, not: 0 } from any date
        Object.entries(this.data.choicesState).forEach(([dStr, c]) => {
          if (c && c.good === 3 && c.not === 0) {
            this.data.choicesState[dStr] = { good: 0, not: 0, updatedAt: Date.now() };
          }
        });

        // Set today's habits to uncompleted (0%)
        if (!this.data.habitsState) this.data.habitsState = {};
        if (!this.data.habitsState[todayStr]) this.data.habitsState[todayStr] = {};
        this.data.habitsState[todayStr]['h-move'] = false;
        this.data.habitsState[todayStr]['h-stand'] = false;

        if (!this.data.habitsUpdatedAt) this.data.habitsUpdatedAt = {};
        this.data.habitsUpdatedAt[todayStr] = Date.now();

        if (!this.data.habitStreaks) this.data.habitStreaks = {};
        this.data.habitStreaks['h-move'] = 0;
        this.data.habitStreaks['h-stand'] = 0;

        // Permanently purge any hardcoded 12,000 steps goal from all dates
        if (this.data.dayGoals && typeof this.data.dayGoals === 'object') {
          Object.keys(this.data.dayGoals).forEach(dStr => {
            if (Array.isArray(this.data.dayGoals[dStr])) {
              this.data.dayGoals[dStr] = this.data.dayGoals[dStr].filter(g => {
                if (!g) return false;
                if (g.id === 'dg-1') return false;
                if (g.text && (g.text.includes('12,000') || g.text.includes('12000'))) return false;
                return true;
              });
            }
          });
        }
        if (!this.data.dayGoalsUpdatedAt) this.data.dayGoalsUpdatedAt = {};
        this.data.dayGoalsUpdatedAt[todayStr] = Date.now();

        // Clean out legacy V1 from localStorage so it never resurrects stale seeds
        try {
          localStorage.removeItem('BOOK_OF_LIFE_DATA_V1');
          localStorage.setItem(resetMarker, 'true');
        } catch (e) {}

        this.saveData();
      }
    } catch (e) {
      console.warn('Zero reset check failed', e);
    }
  }

  recalculateAllStreaks() {
    if (!this.data || !Array.isArray(this.data.habits)) return;
    this.data.habits.forEach(h => {
      this.recalculateStreak(h.id);
    });
  }

  getDefaultState() {
    const todayStr = formatDateIso(new Date());
    return {
      version: 2,
      currentPhaseId: 'phase-1',
      programStartDate: todayStr,
      theme: 'light',
      motto: 'Executive focus. Low friction. Relentless momentum.',
      weekStartDay: 0, // 0 = Sunday
      // Active Habits starting with 'Move' and 'Stand'
      habits: [
        {
          id: 'h-move',
          name: 'Move',
          bucket: 'M',
          cadence: 'daily',
          target: 1,
          color: '#4E8765',
          icon: 'activity',
          description: 'Daily movement, workout, or closing active move ring',
          createdAt: todayStr
        },
        {
          id: 'h-stand',
          name: 'Stand',
          bucket: 'M',
          cadence: 'daily',
          target: 1,
          color: '#00C2A8',
          icon: 'user-check',
          description: 'Hourly stand goal / active standing reset',
          createdAt: todayStr
        }
      ],
      // [dateStr (YYYY-MM-DD)]: { [habitId]: boolean or count }
      habitsState: {},
      habitStreaks: {
        'h-move': 0,
        'h-stand': 0
      },
      // Energy Mode: 'power' (full view) | 'maint' (protect baseline)
      energyMode: 'power',
      // Sanctuary Unstructured Daily Journals: { [dateStr]: { date, text, wordCount, updatedAt } }
      sanctuaryJournals: {},
      // Good Choices (vs Not) Tracker: { [dateStr]: { good: number, not: number } }
      choicesState: {},
      // Daily Health & Vitality Check-in: { [dateStr]: { level: number, updatedAt: number } }
      healthState: {},
      // Day-Specific Goals (one-off daily targets): { [dateStr]: [ { id, text, completed } ] }
      dayGoals: {},
      dayGoalsUpdatedAt: {},
      // Sassy Gamification Points & Status (Baseline: 185 XP Functional Menace)
      points: 185,
      claimedRewards: [],
      // Quick Thoughts & Ideas Inbox (To Triage Later)
      quickThoughts: [
        {
          id: 'qt-1',
          text: 'Look into walking pad for standing desk during meetings',
          createdAt: new Date().toISOString(),
          triaged: false,
          triagedAt: null
        }
      ],
      // Currently Terrorizing active projects list
      activeTerrorizing: ['10k steps', 'Close rings'],
      // Weekly Reflections: { [sundayIso]: { wins: string, focus: string } }
      weeklyReflections: {},
      backlog: [...DEFAULT_BACKLOG_HABITS],
      projects: [...DEFAULT_PROJECTS],
      tasks: [...DEFAULT_TASKS],
      budgetCategories: [...DEFAULT_BUDGET_CATEGORIES],
      transactions: [...DEFAULT_TRANSACTIONS],
      // Medical Claims & Recovery Tracker (Out-of-Network)
      claims: [
        ...((typeof DEFAULT_BARNESS_CLAIMS !== 'undefined') ? DEFAULT_BARNESS_CLAIMS : []),
        {
          id: 'claim-demo-1',
          date: '2026-08-28',
          provider: 'Dr. Adams (Specialist)',
          amountPaid: 250.00,
          superbillStatus: 'need',
          stage: 'need_superbill',
          nextAction: 'Call/email clinic to request itemized superbill',
          reimbursedAmount: 0,
          notes: 'Specialist consult. Paid with card.',
          createdAt: '2026-08-28T10:00:00.000Z'
        },
        {
          id: 'claim-demo-2',
          date: '2026-08-14',
          provider: 'City Physical Therapy',
          amountPaid: 180.00,
          superbillStatus: 'have',
          stage: 'ready_to_send',
          nextAction: 'Batch upload superbill to Included Health app',
          reimbursedAmount: 0,
          notes: 'Superbill received with CPT 97110/97140.',
          createdAt: '2026-08-14T14:30:00.000Z'
        },
        {
          id: 'claim-demo-3',
          date: '2026-07-20',
          provider: 'Dr. Miller (Therapy)',
          amountPaid: 320.00,
          superbillStatus: 'have',
          stage: 'with_included_health',
          nextAction: 'Waiting on Included Health & Insurance EOB review',
          reimbursedAmount: 0,
          notes: 'Forwarded to Included Health advocate.',
          createdAt: '2026-07-20T16:00:00.000Z'
        }
      ],
      // Z Log Data, Titration & Protocols
      zlogEntries: (typeof DEFAULT_ZLOG_ENTRIES !== 'undefined') ? { ...DEFAULT_ZLOG_ENTRIES } : {},
      titrationHistory: (typeof DEFAULT_TITRATION_HISTORY !== 'undefined') ? [...DEFAULT_TITRATION_HISTORY] : [],
      zlogActiveMeds: (typeof DEFAULT_ZLOG_MEDS !== 'undefined') ? [...DEFAULT_ZLOG_MEDS] : []
    };
  }

  loadData() {
    return this.restoreAndMergeAllBackups();
  }

  restoreAndMergeAllBackups() {
    try {
      const defaults = this.getDefaultState();
      const snapshots = [];

      // Priority list of keys to scan and merge
      const candidateKeys = [
        'BOOK_OF_LIFE_DATA_V1',
        'BOOK_OF_LIFE_DATA_BACKUP',
        STORAGE_KEY
      ];

      // Scan localStorage for any other Book of Life snapshots
      try {
        if (typeof localStorage !== 'undefined') {
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && (k.startsWith('BOOK_OF_LIFE') || k.startsWith('BOL_DATA')) && !candidateKeys.includes(k)) {
              candidateKeys.unshift(k);
            }
          }
        }
      } catch (e) {}

      for (const key of candidateKeys) {
        try {
          const raw = localStorage.getItem(key);
          if (raw && raw !== 'null' && raw !== 'undefined' && typeof raw === 'string') {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
              snapshots.push({ key, data: parsed });
            }
          }
        } catch (e) {}
      }

      let merged = { ...defaults };

      // If no stored snapshots exist, initialize defaults
      if (snapshots.length === 0) {
        return defaults;
      }

      // Merge snapshots in sequence
      for (const snap of snapshots) {
        const s = snap.data;
        if (!s || typeof s !== 'object') continue;

        // 1. Habits: Union by id and name
        if (Array.isArray(s.habits) && s.habits.length > 0) {
          const habitMap = new Map();
          (merged.habits || []).forEach(h => {
            if (h && h.name) habitMap.set(h.name.toLowerCase().trim(), { ...h });
          });
          s.habits.forEach(h => {
            if (h && h.name) {
              const key = h.name.toLowerCase().trim();
              const existing = habitMap.get(key);
              habitMap.set(key, { ...(existing || {}), ...h });
            }
          });
          merged.habits = Array.from(habitMap.values());
        }

        // 2. HabitsState: (Active V2 takes absolute priority!)
        if (s.habitsState && typeof s.habitsState === 'object') {
          if (!merged.habitsState) merged.habitsState = {};
          Object.entries(s.habitsState).forEach(([dateStr, dayObj]) => {
            if (snap.key === STORAGE_KEY) {
              merged.habitsState[dateStr] = { ...dayObj };
            } else if (!merged.habitsState[dateStr]) {
              merged.habitsState[dateStr] = { ...dayObj };
            }
          });
        }

        // 3. ChoicesState: (Active V2 takes absolute priority, so setting to 0 is preserved!)
        if (s.choicesState && typeof s.choicesState === 'object') {
          if (!merged.choicesState) merged.choicesState = {};
          Object.entries(s.choicesState).forEach(([dateStr, cObj]) => {
            if (cObj && typeof cObj === 'object') {
              // Skip legacy seed choices { good: 3, not: 0 } from old snapshots
              if (snap.key !== STORAGE_KEY && cObj.good === 3 && cObj.not === 0) {
                return;
              }
              if (snap.key === STORAGE_KEY) {
                merged.choicesState[dateStr] = {
                  good: Math.max(0, parseInt(cObj.good, 10) || 0),
                  not: Math.max(0, parseInt(cObj.not, 10) || 0),
                  updatedAt: cObj.updatedAt || Date.now()
                };
              } else if (!merged.choicesState[dateStr]) {
                merged.choicesState[dateStr] = {
                  good: Math.max(0, parseInt(cObj.good, 10) || 0),
                  not: Math.max(0, parseInt(cObj.not, 10) || 0),
                  updatedAt: cObj.updatedAt || 0
                };
              }
            }
          });
        }

        // 4. HealthState: Latest rating per date
        if (s.healthState && typeof s.healthState === 'object') {
          if (!merged.healthState) merged.healthState = {};
          Object.entries(s.healthState).forEach(([dateStr, hObj]) => {
            const ex = merged.healthState[dateStr];
            if (!ex) {
              merged.healthState[dateStr] = hObj;
            } else {
              const exT = (ex && typeof ex === 'object') ? (ex.updatedAt || 0) : 0;
              const snT = (hObj && typeof hObj === 'object') ? (hObj.updatedAt || 0) : 0;
              if (snT >= exT) merged.healthState[dateStr] = hObj;
            }
          });
        }

        // 5. DayGoals: Active V2 takes absolute priority; filter legacy 12,000 steps seed
        if (s.dayGoals && typeof s.dayGoals === 'object') {
          if (!merged.dayGoals) merged.dayGoals = {};
          Object.entries(s.dayGoals).forEach(([dateStr, list]) => {
            if (Array.isArray(list)) {
              const cleanList = list.filter(g => g && g.id !== 'dg-1' && !(g.text && (g.text.includes('12,000') || g.text.includes('12000'))));
              if (snap.key === STORAGE_KEY) {
                merged.dayGoals[dateStr] = cleanList;
              } else if (!merged.dayGoals[dateStr]) {
                merged.dayGoals[dateStr] = cleanList;
              }
            }
          });
        }

        // 6. SanctuaryJournals: Latest entry per date
        if (s.sanctuaryJournals && typeof s.sanctuaryJournals === 'object') {
          if (!merged.sanctuaryJournals) merged.sanctuaryJournals = {};
          Object.entries(s.sanctuaryJournals).forEach(([dateStr, jObj]) => {
            if (jObj && jObj.text && jObj.text.trim()) {
              const ex = merged.sanctuaryJournals[dateStr];
              if (!ex || (jObj.updatedAt || '') >= (ex.updatedAt || '')) {
                merged.sanctuaryJournals[dateStr] = jObj;
              }
            }
          });
        }

        // 7. QuickThoughts: Union by id / text
        if (Array.isArray(s.quickThoughts)) {
          if (!Array.isArray(merged.quickThoughts)) merged.quickThoughts = [];
          s.quickThoughts.forEach(thought => {
            if (!thought || !thought.text) return;
            const exists = merged.quickThoughts.some(t => t.id === thought.id || t.text.trim() === thought.text.trim());
            if (!exists) {
              merged.quickThoughts.push(thought);
            }
          });
        }

        // 8. Claims: Union by id
        if (Array.isArray(s.claims)) {
          if (!Array.isArray(merged.claims)) merged.claims = [];
          const claimsMap = new Map();
          merged.claims.forEach(c => { if (c && c.id) claimsMap.set(c.id, c); });
          s.claims.forEach(c => {
            if (c && c.id) {
              const ex = claimsMap.get(c.id);
              claimsMap.set(c.id, { ...(ex || {}), ...c });
            }
          });
          merged.claims = Array.from(claimsMap.values());
        }

        // 9. Points: Track highest point score
        merged.points = Math.max(Number(merged.points) || 185, Number(s.points) || 0, 185);

        // 10. Energy mode & reflections
        if (s.energyMode) merged.energyMode = s.energyMode;
        if (s.weeklyReflections && typeof s.weeklyReflections === 'object') {
          merged.weeklyReflections = { ...(merged.weeklyReflections || {}), ...s.weeklyReflections };
        }
        if (Array.isArray(s.activeTerrorizing) && s.activeTerrorizing.length > 0) {
          merged.activeTerrorizing = Array.from(new Set([...(merged.activeTerrorizing || []), ...s.activeTerrorizing]));
        }
      }

      // Ensure 'Move' and 'Stand' exist in habits
      if (!Array.isArray(merged.habits) || merged.habits.length === 0) {
        merged.habits = [...defaults.habits];
      }
      const hasMove = merged.habits.some(h => h && ((h.name && h.name.toLowerCase() === 'move') || h.id === 'h-move'));
      if (!hasMove && defaults.habits && defaults.habits[0]) {
        merged.habits.unshift(defaults.habits[0]);
      }
      const hasStand = merged.habits.some(h => h && ((h.name && h.name.toLowerCase() === 'stand') || h.id === 'h-stand'));
      if (!hasStand) {
        merged.habits.push({
          id: 'h-stand',
          name: 'Stand',
          bucket: 'M',
          cadence: 'daily',
          target: 1,
          color: '#00C2A8',
          icon: 'user-check',
          description: 'Hourly stand goal / active standing reset',
          createdAt: defaults.programStartDate || formatDateIso(new Date())
        });
      }

      // Merge and normalize Dr. Barness and other claims
      const claimsMap = new Map();
      if (typeof DEFAULT_BARNESS_CLAIMS !== 'undefined' && Array.isArray(DEFAULT_BARNESS_CLAIMS)) {
        DEFAULT_BARNESS_CLAIMS.forEach(c => claimsMap.set(c.id, { ...c }));
      }
      (merged.claims || []).forEach(c => {
        if (c && c.id) {
          const ex = claimsMap.get(c.id);
          claimsMap.set(c.id, { ...(ex || {}), ...c });
        }
      });

      merged.claims = Array.from(claimsMap.values()).map(c => {
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

      // Initialize Z Log entries & Titration
      const hasStaleFutureEntries = merged.zlogEntries && (merged.zlogEntries['2026-12-22'] || merged.zlogEntries['2026-10-01'] || merged.zlogEntries['2026-11-15']);
      const needsEnrichedSeed = !merged.zlogEntries || 
        typeof merged.zlogEntries !== 'object' || 
        Object.keys(merged.zlogEntries).length === 0 || 
        hasStaleFutureEntries ||
        !merged.zlogSeedVersion ||
        merged.zlogSeedVersion < 8 ||
        !merged.zlogEntries['2026-09-12'];

      if (needsEnrichedSeed) {
        const cleanDefaults = (typeof DEFAULT_ZLOG_ENTRIES !== 'undefined') ? { ...DEFAULT_ZLOG_ENTRIES } : {};
        if (merged.zlogEntries && typeof merged.zlogEntries === 'object') {
          for (const [d, entry] of Object.entries(merged.zlogEntries)) {
            if (d > '2026-09-12' && entry && entry.updatedAt) {
              cleanDefaults[d] = entry;
            }
          }
        }
        if (typeof DEFAULT_ZLOG_ENTRIES !== 'undefined' && DEFAULT_ZLOG_ENTRIES['2026-09-12']) {
          cleanDefaults['2026-09-12'] = { ...DEFAULT_ZLOG_ENTRIES['2026-09-12'], updatedAt: new Date().toISOString() };
        }
        merged.zlogEntries = cleanDefaults;
        merged.zlogSeedVersion = 8;
      }

      const hasMissingPrescribers = Array.isArray(merged.titrationHistory) && merged.titrationHistory.some(r => !r || !r.prescriber);
      if (!merged.titrationSeedVersion || merged.titrationSeedVersion < 6 || !Array.isArray(merged.titrationHistory) || merged.titrationHistory.length < 34 || hasMissingPrescribers) {
        merged.titrationHistory = (typeof DEFAULT_TITRATION_HISTORY !== 'undefined') ? JSON.parse(JSON.stringify(DEFAULT_TITRATION_HISTORY)) : [];
        merged.titrationSeedVersion = 6;
      }

      if (!Array.isArray(merged.zlogActiveMeds) || merged.zlogActiveMeds.length === 0) {
        merged.zlogActiveMeds = (typeof DEFAULT_ZLOG_MEDS !== 'undefined') ? [...DEFAULT_ZLOG_MEDS] : [];
      }

      // Persist the consolidated state
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        localStorage.setItem('BOOK_OF_LIFE_DATA_BACKUP', JSON.stringify(merged));
      } catch (e) {}

      return merged;
    } catch (e) {
      console.error('Failed to parse saved state, resetting to default', e);
      return this.getDefaultState();
    }
  }

  saveData() {
    try {
      const serialized = JSON.stringify(this.data);
      localStorage.setItem(STORAGE_KEY, serialized);
      localStorage.setItem('BOOK_OF_LIFE_DATA_BACKUP', serialized);
      if (typeof syncManager !== 'undefined' && syncManager.isConfigured()) {
        syncManager.pushToCloud();
      }
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }

  // --- Habit Management Methods ---

  getHabits(includeArchived = false) {
    if (!this.data.habits) this.data.habits = [];
    return includeArchived ? this.data.habits : this.data.habits.filter(h => !h.archived);
  }

  getHabit(habitId) {
    return this.data.habits.find(h => h.id === habitId);
  }

  addHabit(habitData) {
    const todayStr = formatDateIso(new Date());
    const newHabit = {
      id: `h-${Date.now()}`,
      name: habitData.name.trim(),
      bucket: habitData.bucket || 'M',
      cadence: habitData.cadence || 'daily',
      target: Number(habitData.target) || 1,
      color: habitData.color || (MARGO_BUCKETS[habitData.bucket]?.colorHex || '#4E8765'),
      icon: habitData.icon || (MARGO_BUCKETS[habitData.bucket]?.icon || 'activity'),
      description: (habitData.description || '').trim(),
      createdAt: todayStr
    };

    this.data.habits.push(newHabit);
    this.saveData();
    return newHabit;
  }

  updateHabit(habitId, updates) {
    const habit = this.getHabit(habitId);
    if (!habit) return false;

    Object.assign(habit, updates);
    this.saveData();
    return true;
  }

  deleteHabit(habitId) {
    this.data.habits = this.data.habits.filter(h => h.id !== habitId);
    if (this.data.habitStreaks) {
      delete this.data.habitStreaks[habitId];
    }
    this.saveData();
    return true;
  }

  toggleHabit(habitId, dateStr = formatDateIso(new Date())) {
    if (!this.data.habitsState[dateStr]) {
      this.data.habitsState[dateStr] = {};
    }

    const current = !!this.data.habitsState[dateStr][habitId];
    const nextVal = !current;
    this.data.habitsState[dateStr][habitId] = nextVal;
    if (!this.data.habitsUpdatedAt) this.data.habitsUpdatedAt = {};
    this.data.habitsUpdatedAt[dateStr] = Date.now();

    this.addPoints(nextVal ? 10 : -10);
    this.recalculateStreak(habitId);
    this.saveData();
    return nextVal;
  }

  setWeeklyHabitCount(habitId, dateStr, count) {
    if (!this.data.habitsState[dateStr]) {
      this.data.habitsState[dateStr] = {};
    }
    this.data.habitsState[dateStr][habitId] = count;
    if (!this.data.habitsUpdatedAt) this.data.habitsUpdatedAt = {};
    this.data.habitsUpdatedAt[dateStr] = Date.now();
    this.recalculateStreak(habitId);
    this.saveData();
  }

  recalculateStreak(habitId) {
    if (!this.data.habitStreaks) this.data.habitStreaks = {};

    const habit = this.getHabit(habitId);
    if (!habit) return;

    let streak = 0;
    const now = new Date();
    
    // Check consecutive days backward from today
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dStr = formatDateIso(d);
      const dayState = this.data.habitsState[dStr] || {};
      const val = dayState[habitId];

      const isCompleted = habit.cadence === 'weekly' 
        ? (Number(val || 0) > 0 || !!val)
        : !!val;

      if (isCompleted) {
        streak++;
      } else {
        // If today is not completed yet, don't break the streak from yesterday
        if (i === 0) continue;
        break;
      }
    }

    this.data.habitStreaks[habitId] = streak;
  }

  // --- Good Choices (vs Not) Tracker Methods ---

  getChoices(dateStr = formatDateIso(new Date())) {
    if (!this.data.choicesState) this.data.choicesState = {};
    if (!this.data.choicesState[dateStr]) {
      this.data.choicesState[dateStr] = { good: 0, not: 0 };
    }
    return this.data.choicesState[dateStr];
  }

  recordChoice(type, delta = 1, dateStr = formatDateIso(new Date())) {
    const choices = this.getChoices(dateStr);
    if (type === 'good') {
      choices.good = Math.max(0, (choices.good || 0) + delta);
      if (delta > 0) this.addPoints(5);
    } else if (type === 'not') {
      choices.not = Math.max(0, (choices.not || 0) + delta);
    }
    choices.updatedAt = Date.now();
    this.saveData();
    return choices;
  }

  resetChoices(dateStr = formatDateIso(new Date())) {
    if (!this.data.choicesState) this.data.choicesState = {};
    this.data.choicesState[dateStr] = { good: 0, not: 0, updatedAt: Date.now() };
    this.saveData();
    return this.data.choicesState[dateStr];
  }

  getWeeklyChoices(sundayDate = getSundayOfWeek(new Date())) {
    const days = [];
    let totalGood = 0;
    let totalNot = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(sundayDate);
      d.setDate(sundayDate.getDate() + i);
      const dIso = formatDateIso(d);
      const dayChoices = this.getChoices(dIso);
      const good = dayChoices.good || 0;
      const not = dayChoices.not || 0;
      totalGood += good;
      totalNot += not;
      days.push({
        dateStr: dIso,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        good,
        not,
        isToday: dIso === formatDateIso(new Date())
      });
    }

    const total = totalGood + totalNot;
    const ratio = total > 0 ? Math.round((totalGood / total) * 100) : 100;

    return {
      totalGood,
      totalNot,
      total,
      ratio,
      days
    };
  }

  getRunningChoices() {
    if (!this.data.choicesState || typeof this.data.choicesState !== 'object') {
      return { totalGood: 0, totalNot: 0, total: 0, ratio: 100, net: 0 };
    }
    let totalGood = 0;
    let totalNot = 0;

    Object.values(this.data.choicesState).forEach(c => {
      if (c && typeof c === 'object') {
        totalGood += Math.max(0, parseInt(c.good, 10) || 0);
        totalNot += Math.max(0, parseInt(c.not, 10) || 0);
      }
    });

    const total = totalGood + totalNot;
    const ratio = total > 0 ? Math.round((totalGood / total) * 100) : 100;
    const net = totalGood - totalNot;

    return {
      totalGood,
      totalNot,
      total,
      ratio,
      net
    };
  }

  // --- Health & Vitality Check-in Methods ---

  getHealthLevel(dateStr = formatDateIso(new Date())) {
    if (!this.data.healthState) this.data.healthState = {};
    const val = this.data.healthState[dateStr];
    return (val && typeof val === 'object') ? (val.level || null) : (typeof val === 'number' ? val : null);
  }

  setHealthLevel(level, dateStr = formatDateIso(new Date())) {
    if (!this.data.healthState) this.data.healthState = {};
    const existing = this.getHealthLevel(dateStr);
    const numLevel = parseInt(level, 10);
    if (isNaN(numLevel) || numLevel < 1 || numLevel > 5) return;

    this.data.healthState[dateStr] = {
      level: numLevel,
      updatedAt: Date.now()
    };

    // First time rating for the day awards +5 XP
    if (!existing) {
      this.addPoints(5);
    }

    this.saveData();
    return numLevel;
  }

  clearHealthLevel(dateStr = formatDateIso(new Date())) {
    if (this.data.healthState && this.data.healthState[dateStr]) {
      delete this.data.healthState[dateStr];
      this.saveData();
    }
  }

  getWeeklyHealth(sundayDate = getSundayOfWeek(new Date())) {
    const days = [];
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    let totalDays = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(sundayDate);
      d.setDate(sundayDate.getDate() + i);
      const dIso = formatDateIso(d);
      const level = this.getHealthLevel(dIso);
      if (level) {
        counts[level] = (counts[level] || 0) + 1;
        sum += level;
        totalDays++;
      }
      days.push({
        dateStr: dIso,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        level: level,
        isToday: dIso === formatDateIso(new Date())
      });
    }

    const avgScore = totalDays > 0 ? (sum / totalDays).toFixed(1) : null;

    return {
      counts,
      avgScore,
      totalDays,
      days
    };
  }

  getRunningHealth() {
    if (!this.data.healthState || typeof this.data.healthState !== 'object') {
      return { counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, avgScore: null, totalDays: 0 };
    }
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    let totalDays = 0;

    Object.values(this.data.healthState).forEach(val => {
      const lvl = (val && typeof val === 'object') ? val.level : (typeof val === 'number' ? val : null);
      if (lvl && lvl >= 1 && lvl <= 5) {
        counts[lvl] = (counts[lvl] || 0) + 1;
        sum += lvl;
        totalDays++;
      }
    });

    const avgScore = totalDays > 0 ? (sum / totalDays).toFixed(1) : null;

    return {
      counts,
      avgScore,
      totalDays
    };
  }

  // --- Day-Specific Goals Methods ---

  getDayGoals(dateStr = formatDateIso(new Date())) {
    if (!this.data.dayGoals) this.data.dayGoals = {};
    if (!Array.isArray(this.data.dayGoals[dateStr])) {
      this.data.dayGoals[dateStr] = [];
    }
    return this.data.dayGoals[dateStr];
  }

  addDayGoal(text, dateStr = formatDateIso(new Date())) {
    if (!text || !text.trim()) return null;
    const goals = this.getDayGoals(dateStr);
    const newGoal = {
      id: `dg-${Date.now()}`,
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    goals.push(newGoal);
    if (!this.data.dayGoalsUpdatedAt) this.data.dayGoalsUpdatedAt = {};
    this.data.dayGoalsUpdatedAt[dateStr] = Date.now();
    this.saveData();
    return newGoal;
  }

  toggleDayGoal(goalId, dateStr = formatDateIso(new Date())) {
    const goals = this.getDayGoals(dateStr);
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      goal.completed = !goal.completed;
      this.addPoints(goal.completed ? 15 : -15);
      if (!this.data.dayGoalsUpdatedAt) this.data.dayGoalsUpdatedAt = {};
      this.data.dayGoalsUpdatedAt[dateStr] = Date.now();
      this.saveData();
      return goal.completed;
    }
    return false;
  }

  deleteDayGoal(goalId, dateStr = formatDateIso(new Date())) {
    const goals = this.getDayGoals(dateStr);
    this.data.dayGoals[dateStr] = goals.filter(g => g.id !== goalId);
    if (!this.data.dayGoalsUpdatedAt) this.data.dayGoalsUpdatedAt = {};
    this.data.dayGoalsUpdatedAt[dateStr] = Date.now();
    this.saveData();
    return true;
  }

  // --- Gamification Points & Sassy Status Methods ---

  addPoints(amount) {
    if (typeof this.data.points !== 'number') this.data.points = 185;
    this.data.points = Math.max(0, this.data.points + amount);
    this.saveData();
    return this.data.points;
  }

  getPoints() {
    if (typeof this.data.points !== 'number' || this.data.points < 185) {
      this.data.points = 185;
    }
    return this.data.points;
  }

  setPoints(amount) {
    const val = parseInt(amount, 10);
    this.data.points = isNaN(val) ? 185 : Math.max(0, val);
    this.saveData();
    return this.data.points;
  }

  recalculatePointsFromHistory() {
    let pts = 185; // Baseline floor: Functional Menace
    if (this.data.habitsState) {
      Object.values(this.data.habitsState).forEach(day => {
        if (day && typeof day === 'object') {
          Object.values(day).forEach(v => {
            if (v) pts += 10;
          });
        }
      });
    }
    if (this.data.choicesState) {
      Object.values(this.data.choicesState).forEach(day => {
        if (day && typeof day === 'object' && day.good) {
          pts += day.good * 5;
        }
      });
    }
    if (this.data.healthState) {
      pts += Object.keys(this.data.healthState).length * 5;
    }
    if (this.data.dayGoals) {
      Object.values(this.data.dayGoals).forEach(list => {
        if (Array.isArray(list)) {
          list.forEach(g => {
            if (g && g.completed) pts += 15;
          });
        }
      });
    }
    if (Array.isArray(this.data.quickThoughts)) {
      pts += this.data.quickThoughts.filter(t => t && t.triaged).length * 5;
    }
    if (this.data.sanctuaryJournals && typeof this.data.sanctuaryJournals === 'object') {
      pts += Object.keys(this.data.sanctuaryJournals).length * 10;
    }
    this.data.points = Math.max(pts, Number(this.data.points) || 185, 185);
    this.saveData();
    return this.data.points;
  }

  // --- Quick Thoughts & Ideas Inbox Methods (To Triage Later) ---

  getQuickThoughts(filter = 'active') {
    if (!Array.isArray(this.data.quickThoughts)) this.data.quickThoughts = [];
    if (filter === 'active') {
      return this.data.quickThoughts.filter(t => !t.triaged);
    } else if (filter === 'triaged') {
      return this.data.quickThoughts.filter(t => t.triaged);
    }
    return this.data.quickThoughts;
  }

  addQuickThought(text) {
    if (!Array.isArray(this.data.quickThoughts)) this.data.quickThoughts = [];
    const clean = (text || '').trim();
    if (!clean) return null;
    const item = {
      id: 'qt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      text: clean,
      createdAt: new Date().toISOString(),
      triaged: false,
      triagedAt: null
    };
    this.data.quickThoughts.unshift(item);
    this.saveData();
    return item;
  }

  toggleTriageThought(id) {
    if (!Array.isArray(this.data.quickThoughts)) return false;
    const item = this.data.quickThoughts.find(t => t.id === id);
    if (!item) return false;
    item.triaged = !item.triaged;
    item.triagedAt = item.triaged ? new Date().toISOString() : null;
    if (item.triaged) {
      this.addPoints(5); // Reward +5 XP for triaging
    }
    this.saveData();
    return item.triaged;
  }

  deleteQuickThought(id) {
    if (!Array.isArray(this.data.quickThoughts)) return;
    this.data.quickThoughts = this.data.quickThoughts.filter(t => t.id !== id);
    this.saveData();
  }

  convertThoughtToGoal(id, dateStr = formatDateIso(new Date())) {
    if (!Array.isArray(this.data.quickThoughts)) return null;
    const item = this.data.quickThoughts.find(t => t.id === id);
    if (!item) return null;
    const goal = this.addDayGoal(dateStr, item.text);
    item.triaged = true;
    item.triagedAt = new Date().toISOString();
    this.addPoints(10);
    this.saveData();
    return goal;
  }

  convertThoughtToJournal(id, dateStr = formatDateIso(new Date())) {
    if (!Array.isArray(this.data.quickThoughts)) return null;
    const item = this.data.quickThoughts.find(t => t.id === id);
    if (!item) return null;
    const current = this.getJournal(dateStr);
    const bullet = `• ${item.text}`;
    const newText = (current && current.text) ? `${current.text}\n\n${bullet}` : bullet;
    this.saveJournal(dateStr, newText);
    item.triaged = true;
    item.triagedAt = new Date().toISOString();
    this.addPoints(10);
    this.saveData();
    return newText;
  }

  claimReward(tierTitle) {
    if (!Array.isArray(this.data.claimedRewards)) this.data.claimedRewards = [];
    if (!this.data.claimedRewards.includes(tierTitle)) {
      this.data.claimedRewards.push(tierTitle);
      this.saveData();
    }
  }

  isRewardClaimed(tierTitle) {
    if (!Array.isArray(this.data.claimedRewards)) return false;
    return this.data.claimedRewards.includes(tierTitle);
  }

  // --- Currently Terrorizing Active Projects ---

  toggleTerrorizing(item) {
    if (!Array.isArray(this.data.activeTerrorizing)) {
      this.data.activeTerrorizing = [];
    }
    const idx = this.data.activeTerrorizing.indexOf(item);
    const isNowActive = (idx < 0);
    if (isNowActive) {
      this.data.activeTerrorizing.push(item);
    } else {
      this.data.activeTerrorizing.splice(idx, 1);
    }
    this.saveData();
    return isNowActive;
  }

  isTerrorizing(item) {
    if (!Array.isArray(this.data.activeTerrorizing)) return false;
    return this.data.activeTerrorizing.includes(item);
  }

  // --- Weekly Reflection Methods ---

  saveWeeklyReflection(sundayIso, reflectionObj) {
    if (!this.data.weeklyReflections) this.data.weeklyReflections = {};
    this.data.weeklyReflections[sundayIso] = {
      wins: reflectionObj.wins || '',
      focus: reflectionObj.focus || '',
      updatedAt: new Date().toISOString()
    };
    this.saveData();
  }

  getWeeklyReflection(sundayIso) {
    return (this.data.weeklyReflections && this.data.weeklyReflections[sundayIso]) || { wins: '', focus: '' };
  }

  // --- Medical Claims & Recovery Methods ---

  getClaims() {
    if (!Array.isArray(this.data.claims)) this.data.claims = [];
    return this.data.claims;
  }

  getClaim(id) {
    return this.getClaims().find(c => c.id === id) || null;
  }

  addClaim(claimData) {
    if (!Array.isArray(this.data.claims)) this.data.claims = [];
    const newClaim = {
      id: 'claim-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      date: claimData.date || formatDateIso(new Date()),
      provider: (claimData.provider || '').trim() || 'Provider',
      amountPaid: parseFloat(claimData.amountPaid) || 0,
      submissionType: claimData.submissionType || 'provider', // 'provider' | 'self'
      payoutMethod: claimData.payoutMethod || 'direct_deposit', // 'direct_deposit' | 'check'
      superbillStatus: claimData.superbillStatus || 'have',
      stage: claimData.stage || (claimData.submissionType === 'provider' ? 'with_included_health' : 'ready_to_send'),
      nextAction: (claimData.nextAction || '').trim() || (typeof getDefaultNextAction === 'function' ? getDefaultNextAction(claimData.stage, claimData.payoutMethod, claimData.submissionType) : 'Review claim'),
      reimbursedAmount: parseFloat(claimData.reimbursedAmount) || 0,
      notes: (claimData.notes || '').trim(),
      createdAt: new Date().toISOString()
    };
    this.data.claims.unshift(newClaim);
    this.saveData();
    return newClaim;
  }

  updateClaim(id, patch) {
    const claims = this.getClaims();
    const idx = claims.findIndex(c => c.id === id);
    if (idx !== -1) {
      claims[idx] = { ...claims[idx], ...patch, updatedAt: new Date().toISOString() };
      this.saveData();
      return claims[idx];
    }
    return null;
  }

  deleteClaim(id) {
    if (!Array.isArray(this.data.claims)) return;
    this.data.claims = this.data.claims.filter(c => c.id !== id);
    this.saveData();
  }

  getClaimsStats() {
    const claims = this.getClaims();
    let totalPendingRecovery = 0;
    let actionNeededCount = 0;
    let withIncludedHealthCount = 0;
    let checkDueCount = 0;
    let settledCount = 0;
    let totalSettled = 0;

    claims.forEach(c => {
      const amt = parseFloat(c.amountPaid) || 0;
      if (c.stage === 'settled') {
        settledCount++;
        totalSettled += (parseFloat(c.reimbursedAmount) || amt);
      } else {
        totalPendingRecovery += amt;
        if (c.stage === 'need_superbill' || c.stage === 'ready_to_send') {
          actionNeededCount++;
        } else if (c.stage === 'with_included_health') {
          withIncludedHealthCount++;
        } else if (c.stage === 'check_due') {
          checkDueCount++;
        }
      }
    });

    return {
      totalCount: claims.length,
      totalPendingRecovery,
      actionNeededCount,
      withIncludedHealthCount,
      checkDueCount,
      settledCount,
      totalSettled
    };
  }

  // --- Import / Export / Backup ---

  exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = `BookOfLife_Backup_${formatDateIso(new Date())}.json`;
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        this.data = { ...this.getDefaultState(), ...parsed };
        this.saveData();
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON file', e);
    }
    return false;
  }

  exportFinancesCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Date,Description,Category,Type,Amount,Bucket\n";
    this.data.transactions.forEach(t => {
      const cat = this.data.budgetCategories.find(c => c.id === t.categoryId);
      const catName = t.categoryId === 'income' ? 'Income' : (cat ? cat.name : 'Uncategorized');
      csvContent += `"${t.date}","${t.description.replace(/"/g, '""')}","${catName}","${t.type}",${t.amount},"${t.bucket}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BookOfLife_Finances_${formatDateIso(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  exportClaimsCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Date,Provider,Bill / Charge Amount,Submission By,Payout Method,Superbill Status,Stage,Next Action,Notes\n";
    this.getClaims().forEach(c => {
      const sub = (c.submissionType === 'provider') ? 'Provider (Courtesy)' : 'Self / Included Health';
      const payout = (c.payoutMethod === 'check') ? 'Mailed Check' : 'Direct Deposit';
      csvContent += `"${c.date}","${(c.provider || '').replace(/"/g, '""')}",${c.amountPaid || 0},"${sub}","${payout}","${c.superbillStatus || 'have'}","${c.stage}","${(c.nextAction || '').replace(/"/g, '""')}","${(c.notes || '').replace(/"/g, '""')}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Medical_Claims_${formatDateIso(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  /* --------------------------------------------------------------------------
     Z Log & Protocol Methods
     -------------------------------------------------------------------------- */
  getZLogEntry(dateStr) {
    if (!this.data.zlogEntries) this.data.zlogEntries = {};
    return this.data.zlogEntries[dateStr] || {
      date: dateStr,
      rating: null,
      aggression: false,
      notes: '',
      meds: { z: false, g: false, ris: false, rit: '', mag: false, mel: false, melDose: '' }
    };
  }

  saveZLogEntry(dateStr, entryData) {
    if (!this.data.zlogEntries) this.data.zlogEntries = {};
    const current = this.getZLogEntry(dateStr);
    this.data.zlogEntries[dateStr] = {
      ...current,
      ...entryData,
      date: dateStr,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.data.zlogEntries[dateStr];
  }

  setZLogRating(dateStr, rating) {
    const current = this.getZLogEntry(dateStr);
    current.rating = (current.rating === rating) ? null : rating;
    return this.saveZLogEntry(dateStr, current);
  }

  toggleZLogAggression(dateStr) {
    const current = this.getZLogEntry(dateStr);
    current.aggression = !current.aggression;
    return this.saveZLogEntry(dateStr, current);
  }

  setZLogMedStatus(dateStr, medKey, value, doseVal = null) {
    const current = this.getZLogEntry(dateStr);
    if (!current.meds) current.meds = {};
    current.meds[medKey] = !!value;
    if (doseVal !== null && doseVal !== undefined && doseVal !== '') {
      current.meds[medKey + 'Dose'] = doseVal;
    }
    if (medKey === 'rit') {
      if (doseVal) current.meds.ritDose = doseVal;
      current.meds.rit = value ? (doseVal || current.meds.ritDose || '5mg') : false;
    }
    return this.saveZLogEntry(dateStr, current);
  }

  setZLogMedDose(dateStr, medKey, doseVal) {
    const current = this.getZLogEntry(dateStr);
    if (!current.meds) current.meds = {};
    current.meds[medKey + 'Dose'] = doseVal;
    if (medKey === 'rit') {
      current.meds.ritDose = doseVal;
      if (current.meds.rit) current.meds.rit = doseVal;
    }
    return this.saveZLogEntry(dateStr, current);
  }

  setZLogNotes(dateStr, notes) {
    const current = this.getZLogEntry(dateStr);
    current.notes = notes;
    return this.saveZLogEntry(dateStr, current);
  }

  getAllZLogEntries() {
    if (!this.data.zlogEntries) return [];
    const todayIso = (typeof formatDateIso === 'function') ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0];
    return Object.values(this.data.zlogEntries)
      .filter(e => {
        if (!e || !e.date) return false;
        // Never return blank future template dates
        if (e.date > todayIso) {
          const hasNotes = !!(e.notes && e.notes.trim());
          const hasMeds = e.meds && (e.meds.z || e.meds.g || e.meds.rit || e.meds.mag || e.meds.mel || e.meds.ris);
          if (!hasNotes && !hasMeds) return false;
        }
        return true;
      })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }

  getZLogStats() {
    const entries = this.getAllZLogEntries();
    const totalWithData = entries.filter(e => {
      const hasRating = !!e.rating;
      const hasNotes = !!(e.notes && e.notes.trim());
      const hasMeds = e.meds && (e.meds.z || e.meds.g || e.meds.rit || e.meds.mag || e.meds.mel || e.meds.ris);
      return hasRating || hasNotes || hasMeds;
    });
    const totalRated = entries.filter(e => e.rating);
    const goodDays = entries.filter(e => e.rating >= 4).length;
    const aggressionDays = entries.filter(e => e.aggression).length;
    const ratingSum = totalRated.reduce((sum, e) => sum + e.rating, 0);
    const avgRating = totalRated.length > 0 ? (ratingSum / totalRated.length).toFixed(1) : '—';
    const percentGood = totalRated.length > 0 ? Math.round((goodDays / totalRated.length) * 100) : 0;

    return {
      totalLogged: totalWithData.length,
      totalRated: totalRated.length,
      goodDays,
      percentGood,
      aggressionDays,
      avgRating
    };
  }

  getTitrationHistory() {
    return this.data.titrationHistory || [];
  }

  addTitrationEvent(record) {
    if (!this.data.titrationHistory) this.data.titrationHistory = [];
    const newEvent = {
      id: 'tit-' + Date.now(),
      date: record.date || formatDateIso(new Date()),
      medication: record.medication,
      dosage: record.dosage,
      action: record.action || 'Dose Adjustment',
      prescriber: record.prescriber || 'Dr Barness',
      notes: record.notes || ''
    };
    this.data.titrationHistory.unshift(newEvent);
    this.saveData();
    return newEvent;
  }

  updateTitrationEvent(recordId, updates) {
    if (!this.data.titrationHistory) return null;
    const record = this.data.titrationHistory.find(r => r.id === recordId);
    if (record) {
      Object.assign(record, updates);
      this.saveData();
      return record;
    }
    return null;
  }

  exportZLogCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Date,Rating (1-5),Rating Label,Aggression Reported,Zoloft,Zoloft Dose,Guanfacine,Guanfacine Dose,Ritalin,Ritalin Dose,Magnesium,Magnesium Dose,Melatonin,Melatonin Dose,Risperidone,Risperidone Dose,Narrative Log\n";
    this.getAllZLogEntries().forEach(e => {
      const ratingLabel = (typeof ZLOG_RATINGS !== 'undefined' && ZLOG_RATINGS[e.rating]) ? ZLOG_RATINGS[e.rating].label : '';
      const m = e.meds || {};
      const zDose = m.zDose || (m.z ? '75mg' : '');
      const gDose = m.gDose || (m.g ? '2mg' : '');
      const ritDose = m.ritDose || (typeof m.rit === 'string' ? m.rit : (m.rit ? '5mg' : ''));
      const magDose = m.magDose || (m.mag ? 'Daily' : '');
      const melDose = m.melDose || (m.mel ? 'Bedtime' : '');
      const risDose = m.risDose || (m.ris ? 'As needed' : '');
      csvContent += `"${e.date}",${e.rating || ''},"${ratingLabel}","${e.aggression ? 'YES' : 'NO'}","${m.z ? 'YES' : 'NO'}","${zDose}","${m.g ? 'YES' : 'NO'}","${gDose}","${m.rit ? 'YES' : 'NO'}","${ritDose}","${m.mag ? 'YES' : 'NO'}","${magDose}","${m.mel ? 'YES' : 'NO'}","${melDose}","${m.ris ? 'YES' : 'NO'}","${risDose}","${(e.notes || '').replace(/"/g, '""')}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ZLog_History_${formatDateIso(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  /* --------------------------------------------------------------------------
     Sanctuary Journal & Energy Mode Methods
     -------------------------------------------------------------------------- */
  getJournal(dateStr) {
    if (!this.data.sanctuaryJournals) this.data.sanctuaryJournals = {};
    return this.data.sanctuaryJournals[dateStr] || null;
  }

  saveJournal(dateStr, content) {
    if (!this.data.sanctuaryJournals) this.data.sanctuaryJournals = {};
    const text = (content || '').trim();
    if (!text) {
      delete this.data.sanctuaryJournals[dateStr];
    } else {
      const existing = this.data.sanctuaryJournals[dateStr] || {};
      const words = text ? text.split(/\s+/).length : 0;
      this.data.sanctuaryJournals[dateStr] = {
        date: dateStr,
        text: content,
        wordCount: words,
        updatedAt: new Date().toISOString(),
        createdAt: existing.createdAt || new Date().toISOString()
      };
    }
    this.saveData();
    return this.data.sanctuaryJournals[dateStr] || null;
  }

  getAllJournals() {
    if (!this.data.sanctuaryJournals) return [];
    return Object.values(this.data.sanctuaryJournals)
      .filter(j => j && j.date && j.text && j.text.trim())
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }

  getEnergyMode() {
    return this.data.energyMode || 'power';
  }

  setEnergyMode(mode) {
    this.data.energyMode = (mode === 'maint') ? 'maint' : 'power';
    this.saveData();
    return this.data.energyMode;
  }

  resetToDefaults() {
    this.data = this.getDefaultState();
    this.saveData();
  }
}

const storage = new StorageManager();

