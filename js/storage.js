/* ==========================================================================
   Book of Life / Life OS - Storage & Data Persistence Manager
   ========================================================================== */

const STORAGE_KEY = 'BOOK_OF_LIFE_DATA_V2';

class StorageManager {
  constructor() {
    this.data = this.loadData();
    this.cleanInvertedDayGoals();
    this.applyZeroResetFix();
    this.applyWhereInfoLivesAuditUpdate();
    this.applyCleanClaimsMigration();
    this.applyHobbiesSeedMigration();
    this.applyZLogOctoberMissingDatesMigration();
    this.recalculateAllStreaks();
    this.recalculatePointsFromHistory();
  }

  cleanInvertedDayGoals() {
    if (!this.data || !this.data.dayGoals || typeof this.data.dayGoals !== 'object') return;
    let changed = false;
    Object.keys(this.data.dayGoals).forEach(key => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) {
        const items = this.data.dayGoals[key];
        if (Array.isArray(items)) {
          items.forEach(item => {
            const targetDate = (item && item.text && /^\d{4}-\d{2}-\d{2}$/.test(item.text.trim()))
              ? item.text.trim()
              : (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0]);
            const realText = key.trim();
            if (!this.data.dayGoals[targetDate]) {
              this.data.dayGoals[targetDate] = [];
            }
            if (!this.data.dayGoals[targetDate].some(g => g.id === item.id || g.text === realText)) {
              this.data.dayGoals[targetDate].push({
                ...item,
                text: realText
              });
            }
          });
        }
        delete this.data.dayGoals[key];
        changed = true;
      }
    });
    if (changed) {
      this.saveData();
    }
  }

  applyZLogOctoberMissingDatesMigration() {
    const marker = 'BOL_ZLOG_OCTOBER_MISSING_DATES_V16';
    try {
      if (typeof localStorage !== 'undefined' && !localStorage.getItem(marker)) {
        if (!this.data.zlogEntries) this.data.zlogEntries = {};
        const missingDates = ['2026-10-12', '2026-10-13', '2026-10-14'];
        let updated = false;
        if (typeof DEFAULT_ZLOG_ENTRIES !== 'undefined') {
          missingDates.forEach(dateStr => {
            if (DEFAULT_ZLOG_ENTRIES[dateStr]) {
              this.data.zlogEntries[dateStr] = JSON.parse(JSON.stringify(DEFAULT_ZLOG_ENTRIES[dateStr]));
              updated = true;
            }
          });
        }
        if (updated) {
          this.data.zlogSeedVersion = 16;
          this.saveData();
        }
        try { localStorage.setItem(marker, 'true'); } catch (e) {}
      }
    } catch (e) {
      console.warn('Z Log October missing dates migration failed', e);
    }
  }

  applyCleanClaimsMigration() {
    const marker = 'BOL_CLAIMS_FORCED_RECONCILE_V16';
    try {
      if (typeof localStorage !== 'undefined' && !localStorage.getItem(marker)) {
        if (typeof DEFAULT_REAL_CLAIMS !== 'undefined' && Array.isArray(DEFAULT_REAL_CLAIMS)) {
          this.data.claims = JSON.parse(JSON.stringify(DEFAULT_REAL_CLAIMS));
          this.data.claimsSeedVersion = 16;
          this.saveData();
        }
        try { localStorage.setItem(marker, 'true'); } catch (e) {}
      }
    } catch (e) {
      console.warn('Claims clean migration failed', e);
    }
  }

  applyHobbiesSeedMigration() {
    const marker = 'BOL_HOBBIES_SEED_V1';
    try {
      if (typeof localStorage !== 'undefined' && !localStorage.getItem(marker)) {
        if (!Array.isArray(this.data.hobbies) || this.data.hobbies.length === 0) {
          if (typeof DEFAULT_HOBBIES !== 'undefined' && Array.isArray(DEFAULT_HOBBIES)) {
            this.data.hobbies = JSON.parse(JSON.stringify(DEFAULT_HOBBIES));
            this.data.hobbiesSeedVersion = 1;
            this.saveData();
          }
        }
        try { localStorage.setItem(marker, 'true'); } catch (e) {}
      }
    } catch (e) {
      console.warn('Hobbies seed migration failed', e);
    }
  }

  applyWhereInfoLivesAuditUpdate() {
    const marker = 'BOL_WHERE_INFO_LIVES_AUDIT_V5';
    try {
      if (typeof localStorage !== 'undefined' && !localStorage.getItem(marker)) {
        if (!Array.isArray(this.data.coverTopicAudits)) {
          this.data.coverTopicAudits = [];
        }

        this.data.coverTopicAudits.forEach(a => {
          if (!a) return;
          const isSchool = a.topic && (a.topic.toLowerCase().includes('school') || a.topic.toLowerCase().includes('iep'));
          if (isSchool) {
            a.status = 'streamlined';
            delete a.breakdown;
          } else {
            a.status = 'disorganized';
          }
        });

        const hasSchool = this.data.coverTopicAudits.some(a => a && a.topic && (a.topic.toLowerCase().includes('school') || a.topic.toLowerCase().includes('iep')));
        if (!hasSchool) {
          this.data.coverTopicAudits.push({
            id: 'top-school-iep',
            topic: 'School Notes + IEP',
            tools: ['Apple notes', 'Google Drive', 'emails', 'Things 3'],
            status: 'streamlined'
          });
        }

        try { localStorage.setItem(marker, 'true'); } catch (e) {}
        this.saveData();
      }
    } catch (e) {
      console.warn('Where Info Lives update check failed', e);
    }
  }

  applyZeroResetFix() {
    const todayStr = (typeof formatDateIso === 'function') ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0];
    const resetMarker = 'BOL_ZERO_RESET_APPLIED_V7';
    try {
      if (typeof localStorage !== 'undefined' && !localStorage.getItem(resetMarker)) {
        // Set today's choices explicitly to 0 (with updatedAt: 0 so cloud sync can override on new devices)
        if (!this.data.choicesState) this.data.choicesState = {};
        this.data.choicesState[todayStr] = { good: 0, not: 0, updatedAt: 0 };

        // Clean out any stale hardcoded { good: 3, not: 0 } from any date
        Object.entries(this.data.choicesState).forEach(([dStr, c]) => {
          if (c && c.good === 3 && c.not === 0) {
            this.data.choicesState[dStr] = { good: 0, not: 0, updatedAt: 0 };
          }
        });

        // Set today's habits to uncompleted (0%)
        if (!this.data.habitsState) this.data.habitsState = {};
        if (!this.data.habitsState[todayStr]) this.data.habitsState[todayStr] = {};
        this.data.habitsState[todayStr]['h-move'] = false;
        this.data.habitsState[todayStr]['h-stand'] = false;

        if (!this.data.habitsUpdatedAt) this.data.habitsUpdatedAt = {};
        this.data.habitsUpdatedAt[todayStr] = 0;

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
        this.data.dayGoalsUpdatedAt[todayStr] = 0;

        // Permanently remove duplicate "Stand ring" habit (Anchor #2 is already Stand)
        if (Array.isArray(this.data.habits)) {
          const removedIds = [];
          this.data.habits = this.data.habits.filter(h => {
            if (!h) return false;
            const n = (h.name || '').toLowerCase().trim();
            if (n === 'stand ring' || (n === 'stand' && h.id !== 'h-stand')) {
              removedIds.push(h.id);
              return false;
            }
            return true;
          });
          removedIds.forEach(id => {
            if (this.data.habitStreaks) delete this.data.habitStreaks[id];
            if (this.data.habitsState) {
              Object.values(this.data.habitsState).forEach(dayObj => {
                if (dayObj && dayObj[id] !== undefined) delete dayObj[id];
              });
            }
          });
        }

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
      // Abbey Yung Hair Care Routine State: { [dateStr]: { [stepId]: boolean } }
      hairCareState: {},
      // Skincare Routine & Tracker State: { [dateStr]: { completed: boolean, skipped: boolean, am: boolean, pm: boolean, insteadNote: string, updatedAt: number } }
      skinCareState: {},
      // Skincare Shopping List: { [itemId]: boolean }
      skincareShoppingList: {},
      // Sassy Gamification Points & Status (Baseline: 185 XP Functional Menace)
      points: 185,
      claimedRewards: [],
      // Quick Thoughts & Ideas Inbox
      quickThoughts: [],
      // Time-of-Day Goal Progress Pacer Schedule (Weekdays 7am-9pm, Weekends 9am-10pm)
      pacerSchedule: {
        weekday: { start: 7, end: 21, label: 'Weekday · 7 AM – 9 PM' },
        weekend: { start: 9, end: 22, label: 'Weekend · 9 AM – 10 PM' }
      },
      // Aurora Daily Granular State (Move calories, 12-hour Stand tiles, Anchor milestones, Active Quick Chips)
      auroraDailyState: {},
      // Period-Based Custom Average Goals (e.g. 10k Daily Steps for October)
      periodGoals: [
        {
          id: 'pg-oct-steps',
          title: '10k Steps · October',
          targetAvg: 10000,
          unit: 'steps',
          startDate: '2026-10-01',
          endDate: '2026-10-31',
          logs: {}
        }
      ],
      // Daily Weight Tracking: { [dateStr]: number } (e.g. 110.4)
      weightLogs: {},
      weightTarget: 110,
      // Currently Terrorizing active projects list
      activeTerrorizing: ['10k steps', 'Close rings'],
      // Hobbies Lifecycle & Tasting Pipeline
      hobbies: (typeof DEFAULT_HOBBIES !== 'undefined') ? JSON.parse(JSON.stringify(DEFAULT_HOBBIES)) : [],
      hobbiesSeedVersion: 1,
      // Cover Page: Unified Life Architecture & Focus Board (Now vs Later)
      coverCampaigns: {
        now: [
          {
            id: 'camp-school',
            title: 'Z school, ood, IEP',
            status: 'IP',
            theme: 'cat-school',
            tools: {
              margo: { label: 'Z Admissions & Battle Plan', action: 'school-plan' },
              apple: { noteQuery: '# SCHOOL 01_BATTLE PLAN' },
              google: { folder: 'Z Records' },
              things: { query: 'Z School IEP' },
              email: { emailQuery: 'OOD-Placement' }
            }
          },
          {
            id: 'camp-surgery',
            title: 'Surgery',
            status: 'IP',
            theme: 'cat-health',
            tools: {
              apple: { noteQuery: '# HEALTH 02_SURGERY' },
              things: { query: 'Surgery Follow-up' }
            },
            visibleTools: ['apple', 'things']
          },
          {
            id: 'camp-oon',
            title: 'oon',
            status: 'Maintain',
            theme: 'cat-finance',
            tools: {
              margo: { label: 'Medical Claims Tracker', action: 'claims' },
              google: { folder: 'Superbills & EOBs' },
              things: { query: 'Medical Claims Reimbursement' },
              email: { emailQuery: 'Insurance Superbills' }
            },
            visibleTools: ['margo', 'google', 'things', 'email']
          },
          {
            id: 'camp-haircare',
            title: 'Haircare',
            status: 'Maintain',
            theme: 'cat-care',
            tools: {
              margo: { label: 'Haircare Checkpoint', action: 'haircare' },
              apple: { noteQuery: '# BEAUTY 02_HAIR' }
            },
            visibleTools: ['margo', 'apple']
          },
          {
            id: 'camp-skincare',
            title: 'Skincare',
            status: 'Maintain',
            theme: 'cat-care',
            tools: {
              margo: { label: 'Skincare Regimen' },
              apple: { noteQuery: '# BEAUTY 01_SKINCARE' },
              google: { folder: 'Skincare Products' },
              things: { query: 'Skincare Routine' },
              email: { emailQuery: 'Skincare Orders' }
            }
          },
          {
            id: 'camp-undereye',
            title: 'Under eye bags',
            status: 'Maintain',
            theme: 'cat-care',
            tools: {
              margo: { label: 'Eye Care & Vitality' },
              apple: { noteQuery: '# BEAUTY 03_UNDEREYE' },
              google: { folder: 'Eye Treatments & Consults' },
              things: { query: 'Under Eye Research' },
              email: { emailQuery: 'Dermatology Consults' }
            }
          },
          {
            id: 'camp-makeup',
            title: 'Makeup',
            status: 'Maintain',
            theme: 'cat-care',
            tools: {
              margo: { label: 'Makeup & Beauty' },
              apple: { noteQuery: '# BEAUTY 05_MAKEUP' },
              google: { folder: 'Makeup Swatches & Products' },
              things: { query: 'Makeup Essentials' },
              email: { emailQuery: 'Makeup Orders' }
            }
          }
        ],
        later: [
          {
            id: 'camp-footcare',
            title: 'Foot care',
            status: 'NS',
            theme: 'cat-care',
            tools: {
              margo: { label: 'Foot Care' },
              apple: { noteQuery: '# BEAUTY 04_FOOTCARE' },
              google: { folder: 'Foot Care Protocol' },
              things: { query: 'Foot Care' },
              email: { emailQuery: 'Foot Care' }
            }
          },
          {
            id: 'camp-outfits',
            title: 'Outfits',
            status: 'NS',
            theme: 'cat-care',
            tools: {
              margo: { label: 'Style & Outfits' },
              apple: { noteQuery: '# STYLE 01_OUTFITS' },
              google: { folder: 'Wardrobe Capsule' },
              things: { query: 'Wardrobe Organizing' },
              email: { emailQuery: 'Clothing Orders' }
            }
          },
          {
            id: 'camp-shoes',
            title: 'Shoes',
            status: 'NS',
            theme: 'cat-care',
            tools: {
              margo: { label: 'Shoes & Footwear' },
              apple: { noteQuery: '# STYLE 03_SHOES' },
              google: { folder: 'Shoes & Footwear' },
              things: { query: 'Shoes Organization' },
              email: { emailQuery: 'Shoe Orders' }
            }
          },
          {
            id: 'camp-jewelry',
            title: 'Jewelry',
            status: 'NS',
            theme: 'cat-care',
            tools: {
              margo: { label: 'Jewelry & Accessories' },
              apple: { noteQuery: '# STYLE 02_JEWELRY' },
              google: { folder: 'Jewelry Inventory' },
              things: { query: 'Jewelry Organization' },
              email: { emailQuery: 'Jewelry Receipts' }
            }
          },
          {
            id: 'camp-finance',
            title: 'Personal Finance',
            status: 'NS',
            theme: 'cat-finance',
            tools: {
              margo: { label: 'Financial Health', action: 'finance' },
              apple: { noteQuery: '# FINANCE 01_OVERVIEW' },
              google: { folder: 'Tax Docs 2026' },
              things: { query: 'Monthly Budget Review' },
              email: { emailQuery: 'Financial Statements' }
            }
          },
          {
            id: 'camp-home',
            title: 'Home declutter',
            status: 'NS',
            theme: 'cat-home',
            tools: {
              margo: { label: 'Home Harmony' },
              apple: { noteQuery: '# HOME 01_DECLUTTER' },
              google: { folder: 'Home Inventory' },
              things: { query: 'Room-by-Room Declutter' },
              email: { emailQuery: 'Donations & Orders' }
            }
          },
          {
            id: 'camp-chinhair',
            title: 'Chin hair',
            status: 'NS',
            theme: 'cat-care',
            tools: {
              margo: { label: 'Chin Hair Protocol' },
              apple: { noteQuery: '# BEAUTY 06_CHIN_HAIR' },
              google: { folder: 'Chin Hair Treatments' },
              things: { query: 'Chin Hair Protocol' },
              email: { emailQuery: 'Chin Hair Consults' }
            }
          },
          {
            id: 'camp-foreheadline',
            title: 'Forehead lines',
            status: 'NS',
            theme: 'cat-care',
            tools: {
              margo: { label: 'Forehead Protocol' },
              apple: { noteQuery: '# BEAUTY 07_FOREHEAD' },
              google: { folder: 'Forehead Treatments & Research' },
              things: { query: 'Forehead Lines Protocol' },
              email: { emailQuery: 'Forehead Consults' }
            }
          },
          {
            id: 'camp-healthyfood',
            title: 'Healthy food',
            status: 'NS',
            theme: 'cat-food',
            tools: {
              margo: { label: 'Nutrition & Daily Choices', action: 'choices' },
              apple: { noteQuery: '# HEALTH 01_FOOD' },
              google: { folder: 'Meal Prep Recipes' },
              things: { query: 'Grocery & Meal Prep' },
              email: { emailQuery: 'Grocery Subscriptions' }
            }
          }
        ]
      },
      coverCampaignsSeedVersion: 9,
      // Cover Page: Top of Mind Scratchpad (legacy preserved)
      coverTopMind: {
        now: [
          { id: 'tm-1', text: 'AY 4-week hair wash & rest protocol' },
          { id: 'tm-2', text: 'Included Health claims audit & superbill settlement' },
          { id: 'tm-3', text: 'Skincare routine consolidation & product audit' }
        ],
        later: [
          { id: 'tm-4', text: 'Winter wardrobe capsule curation' },
          { id: 'tm-5', text: 'Schedule annual dental cleaning' },
          { id: 'tm-6', text: 'Q1 family vacation booking window' }
        ]
      },
      // Cover Page: Where Info Lives (Topic Streamlining Audit)
      coverTopicAudits: [
        {
          id: 'top-1',
          topic: 'Skincare & Daily Regimen',
          tools: ['Apple notes', 'margo'],
          status: 'disorganized'
        },
        {
          id: 'top-2',
          topic: 'Hair Health Protocol',
          tools: ['margo', 'Apple notes'],
          status: 'disorganized'
        },
        {
          id: 'top-3',
          topic: 'Medical Claims & Superbills',
          tools: ['margo', 'Google Drive', 'emails'],
          status: 'disorganized'
        },
        {
          id: 'top-4',
          topic: 'Child Health & Meds (Z-Log)',
          tools: ['margo', 'Google Drive', 'Things 3'],
          status: 'disorganized'
        },
        {
          id: 'top-5',
          topic: 'Home Logistics & Errands',
          tools: ['Things 3', 'iCloud'],
          status: 'disorganized'
        },
        {
          id: 'top-school-iep',
          topic: 'School Notes + IEP',
          tools: ['Apple notes', 'Google Drive', 'emails', 'Things 3'],
          status: 'streamlined'
        }
      ],
      // Weekly Reflections: { [sundayIso]: { wins: string, focus: string } }
      weeklyReflections: {},
      backlog: [...DEFAULT_BACKLOG_HABITS],
      projects: [...DEFAULT_PROJECTS],
      tasks: [...DEFAULT_TASKS],
      budgetCategories: [...DEFAULT_BUDGET_CATEGORIES],
      transactions: [...DEFAULT_TRANSACTIONS],
      // Medical Claims & Recovery Tracker (Out-of-Network)
      claims: (typeof DEFAULT_REAL_CLAIMS !== 'undefined' && Array.isArray(DEFAULT_REAL_CLAIMS))
        ? JSON.parse(JSON.stringify(DEFAULT_REAL_CLAIMS))
        : (typeof DEFAULT_BARNESS_CLAIMS !== 'undefined' ? [...DEFAULT_BARNESS_CLAIMS] : []),
      claimsSeedVersion: 5,
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

        // 1. Habits: Union by id and name (excluding duplicate 'stand ring' as Anchor #2 is Stand)
        if (Array.isArray(s.habits) && s.habits.length > 0) {
          const habitMap = new Map();
          (merged.habits || []).forEach(h => {
            if (h && h.name && h.name.toLowerCase().trim() !== 'stand ring') {
              habitMap.set(h.name.toLowerCase().trim(), { ...h });
            }
          });
          s.habits.forEach(h => {
            if (h && h.name && h.name.toLowerCase().trim() !== 'stand ring') {
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
                  updatedAt: cObj.updatedAt || 0
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
        if (s.theme === 'light' || s.theme === 'dark') merged.theme = s.theme;
        if (s.pacerSchedule && typeof s.pacerSchedule === 'object') {
          merged.pacerSchedule = { ...(merged.pacerSchedule || {}), ...s.pacerSchedule };
        }
        if (s.habitsUpdatedAt && typeof s.habitsUpdatedAt === 'object') {
          merged.habitsUpdatedAt = { ...(merged.habitsUpdatedAt || {}), ...s.habitsUpdatedAt };
        }
        if (s.dayGoalsUpdatedAt && typeof s.dayGoalsUpdatedAt === 'object') {
          merged.dayGoalsUpdatedAt = { ...(merged.dayGoalsUpdatedAt || {}), ...s.dayGoalsUpdatedAt };
        }
        if (s.coverCampaigns && typeof s.coverCampaigns === 'object' && (Array.isArray(s.coverCampaigns.now) || Array.isArray(s.coverCampaigns.later))) {
          const snapCoverTime = Number(s.coverUpdatedAt) || 0;
          const curCoverTime = Number(merged.coverUpdatedAt) || 0;
          if (snap.key === STORAGE_KEY || snapCoverTime >= curCoverTime || !merged._hasLoadedCoverCampaigns) {
            merged.coverCampaigns = {
              now: Array.isArray(s.coverCampaigns.now) ? s.coverCampaigns.now : [],
              later: Array.isArray(s.coverCampaigns.later) ? s.coverCampaigns.later : []
            };
            merged._hasLoadedCoverCampaigns = true;
          }
        }
        if (s.coverCampaignsSeedVersion) {
          merged.coverCampaignsSeedVersion = Math.max(Number(merged.coverCampaignsSeedVersion) || 0, Number(s.coverCampaignsSeedVersion) || 0);
        }
        if (s.coverUpdatedAt) {
          merged.coverUpdatedAt = Math.max(Number(merged.coverUpdatedAt) || 0, Number(s.coverUpdatedAt) || 0);
        }
        if (s.coverTopMind && typeof s.coverTopMind === 'object') {
          merged.coverTopMind = {
            now: Array.isArray(s.coverTopMind.now) ? s.coverTopMind.now : (defaults.coverTopMind.now || []),
            later: Array.isArray(s.coverTopMind.later) ? s.coverTopMind.later : (defaults.coverTopMind.later || [])
          };
        }
        if (s.coverTopicAudits && Array.isArray(s.coverTopicAudits) && s.coverTopicAudits.length > 0) {
          merged.coverTopicAudits = s.coverTopicAudits;
        }
        if (Array.isArray(s.hobbies) && s.hobbies.length > 0) {
          const snapHobTime = Number(s.hobbiesUpdatedAt) || 0;
          const curHobTime = Number(merged.hobbiesUpdatedAt) || 0;
          if (snap.key === STORAGE_KEY || snapHobTime >= curHobTime) {
            merged.hobbies = s.hobbies;
          }
        }
        if (Array.isArray(s.hobbyShortlist)) {
          const snapHobTime = Number(s.hobbiesUpdatedAt) || 0;
          const curHobTime = Number(merged.hobbiesUpdatedAt) || 0;
          if (snap.key === STORAGE_KEY || snapHobTime >= curHobTime) {
            merged.hobbyShortlist = s.hobbyShortlist;
          }
        }
        if (s.hobbiesUpdatedAt) {
          merged.hobbiesUpdatedAt = Math.max(Number(merged.hobbiesUpdatedAt) || 0, Number(s.hobbiesUpdatedAt) || 0);
        }
        if (s.hobbiesSeedVersion) {
          merged.hobbiesSeedVersion = Math.max(Number(merged.hobbiesSeedVersion) || 0, Number(s.hobbiesSeedVersion) || 0);
        }

        // 11. HairCareState: Two-way merge preserving local completions and skips
        if (s.hairCareState && typeof s.hairCareState === 'object') {
          if (!merged.hairCareState) merged.hairCareState = {};
          Object.entries(s.hairCareState).forEach(([dStr, hObj]) => {
            if (!merged.hairCareState[dStr]) {
              merged.hairCareState[dStr] = { ...hObj };
            } else {
              merged.hairCareState[dStr] = { ...hObj, ...merged.hairCareState[dStr] };
            }
          });
        }

        // 11c. SkinCareState: Two-way merge preserving local completions and skips
        if (s.skinCareState && typeof s.skinCareState === 'object') {
          if (!merged.skinCareState) merged.skinCareState = {};
          Object.entries(s.skinCareState).forEach(([dStr, sObj]) => {
            if (!merged.skinCareState[dStr]) {
              merged.skinCareState[dStr] = { ...sObj };
            } else {
              merged.skinCareState[dStr] = { ...sObj, ...merged.skinCareState[dStr] };
            }
          });
        }

        // 11d. SkincareShoppingList
        if (s.skincareShoppingList && typeof s.skincareShoppingList === 'object') {
          if (!merged.skincareShoppingList) merged.skincareShoppingList = {};
          merged.skincareShoppingList = { ...merged.skincareShoppingList, ...s.skincareShoppingList };
        }

        // 11b. AuroraDailyState: Preserve granular Move calories, Stand hours & Quick chips
        if (s.auroraDailyState && typeof s.auroraDailyState === 'object') {
          if (!merged.auroraDailyState) merged.auroraDailyState = {};
          Object.entries(s.auroraDailyState).forEach(([dStr, aObj]) => {
            if (snap.key === STORAGE_KEY || !merged.auroraDailyState[dStr]) {
              merged.auroraDailyState[dStr] = { ...aObj };
            }
          });
        }

        // 11c. PeriodGoals: Preserve custom time-period goals and daily logs
        if (Array.isArray(s.periodGoals) && s.periodGoals.length > 0) {
          if (!Array.isArray(merged.periodGoals)) merged.periodGoals = [];
          const pgMap = new Map();
          merged.periodGoals.forEach(pg => {
            if (pg && pg.id) pgMap.set(pg.id, { ...pg, logs: { ...(pg.logs || {}) } });
          });
          s.periodGoals.forEach(pg => {
            if (pg && pg.id) {
              const ex = pgMap.get(pg.id);
              if (!ex) {
                pgMap.set(pg.id, { ...pg, logs: { ...(pg.logs || {}) } });
              } else {
                pgMap.set(pg.id, {
                  ...ex,
                  ...pg,
                  logs: { ...(ex.logs || {}), ...(pg.logs || {}) }
                });
              }
            }
          });
          merged.periodGoals = Array.from(pgMap.values());
        }

        // 11d. WeightTracker: Preserve weight logs and target
        if (s.weightLogs && typeof s.weightLogs === 'object') {
          if (!merged.weightLogs) merged.weightLogs = {};
          Object.entries(s.weightLogs).forEach(([dStr, wVal]) => {
            if (snap.key === STORAGE_KEY || merged.weightLogs[dStr] === undefined) {
              if (wVal !== null && wVal !== undefined && !isNaN(Number(wVal))) {
                merged.weightLogs[dStr] = Math.round(Number(wVal) * 10) / 10;
              }
            }
          });
        }
        if (s.weightTarget !== undefined && !isNaN(Number(s.weightTarget)) && Number(s.weightTarget) > 0) {
          merged.weightTarget = Math.round(Number(s.weightTarget) * 10) / 10;
        }
        if (s.weightUpdatedAt) {
          merged.weightUpdatedAt = Math.max(Number(merged.weightUpdatedAt) || 0, Number(s.weightUpdatedAt) || 0);
        }

        // 12. Finance Hub State (Monarch summaries, categories, baselines, and transactions)
        if (s.finance && typeof s.finance === 'object') {
          if (!merged.finance) merged.finance = {};
          merged.finance = {
            ...merged.finance,
            ...s.finance,
            monthlySummaries: (Array.isArray(s.finance.monthlySummaries) && s.finance.monthlySummaries.length > 0)
              ? s.finance.monthlySummaries
              : (merged.finance.monthlySummaries || []),
            categoryBaselines: (s.finance.categoryBaselines && typeof s.finance.categoryBaselines === 'object')
              ? { ...(merged.finance.categoryBaselines || {}), ...s.finance.categoryBaselines }
              : (merged.finance.categoryBaselines || {}),
            categories: (Array.isArray(s.finance.categories) && s.finance.categories.length > 0)
              ? s.finance.categories
              : (merged.finance.categories || []),
            transactions: (Array.isArray(s.finance.transactions) && s.finance.transactions.length > 0)
              ? s.finance.transactions
              : (merged.finance.transactions || []),
            subscriptions: (Array.isArray(s.finance.subscriptions) && s.finance.subscriptions.length > 0)
              ? s.finance.subscriptions
              : (merged.finance.subscriptions || []),
            accounts: (Array.isArray(s.finance.accounts) && s.finance.accounts.length > 0)
              ? s.finance.accounts
              : (merged.finance.accounts || []),
            weeklySundayUpdates: (s.finance.weeklySundayUpdates && typeof s.finance.weeklySundayUpdates === 'object')
              ? { ...(merged.finance.weeklySundayUpdates || {}), ...s.finance.weeklySundayUpdates }
              : (merged.finance.weeklySundayUpdates || {}),
            weeklyChecklists: (s.finance.weeklyChecklists && typeof s.finance.weeklyChecklists === 'object')
              ? { ...(merged.finance.weeklyChecklists || {}), ...s.finance.weeklyChecklists }
              : (merged.finance.weeklyChecklists || {})
          };
        }
      }
      delete merged._hasLoadedCoverCampaigns;

      // Check dedicated resilient Cover Campaigns backup
      try {
        const dedicatedCover = localStorage.getItem('BOL_COVER_CAMPAIGNS_V2');
        if (dedicatedCover) {
          const parsedCover = JSON.parse(dedicatedCover);
          if (parsedCover && parsedCover.coverCampaigns && typeof parsedCover.coverCampaigns === 'object') {
            const dedTime = Number(parsedCover.coverUpdatedAt) || 0;
            const curTime = Number(merged.coverUpdatedAt) || 0;
            if (dedTime >= curTime && (Array.isArray(parsedCover.coverCampaigns.now) || Array.isArray(parsedCover.coverCampaigns.later))) {
              merged.coverCampaigns = {
                now: Array.isArray(parsedCover.coverCampaigns.now) ? parsedCover.coverCampaigns.now : [],
                later: Array.isArray(parsedCover.coverCampaigns.later) ? parsedCover.coverCampaigns.later : []
              };
              merged.coverUpdatedAt = Math.max(curTime, dedTime);
              merged.coverCampaignsSeedVersion = Math.max(Number(merged.coverCampaignsSeedVersion) || 0, Number(parsedCover.coverCampaignsSeedVersion) || 0, 9);
            }
          }
        }
      } catch (e) {}

      // Check dedicated resilient Finance backup
      try {
        const dedicatedFinance = localStorage.getItem('BOL_FINANCE_DATA_V2');
        if (dedicatedFinance) {
          const parsedFin = JSON.parse(dedicatedFinance);
          if (parsedFin && typeof parsedFin === 'object') {
            merged.finance = { ...(merged.finance || {}), ...parsedFin };
          }
        }
        const savedWeeklyLists = localStorage.getItem('BOL_FINANCE_WEEKLY_CHECKLISTS');
        if (savedWeeklyLists && merged.finance) {
          const parsedLists = JSON.parse(savedWeeklyLists);
          if (parsedLists && typeof parsedLists === 'object') {
            merged.finance.weeklyChecklists = {
              ...(merged.finance.weeklyChecklists || {}),
              ...parsedLists
            };
          }
        }
      } catch (e) {}

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

      // Merge and normalize Medical Claims (3-Way Reconciliation dataset)
      const claimsNeedMigration = !merged.claimsSeedVersion || merged.claimsSeedVersion < 5 || 
        (Array.isArray(merged.claims) && merged.claims.some(c => c && (
          c.id === 'claim-demo-1' || 
          c.id === 'claim-demo-2' || 
          c.id === 'claim-ms-01' || 
          /^claim-barness-\d+$/.test(c.id)
        )));

      if (claimsNeedMigration && typeof DEFAULT_REAL_CLAIMS !== 'undefined' && Array.isArray(DEFAULT_REAL_CLAIMS)) {
        const claimsMap = new Map();
        DEFAULT_REAL_CLAIMS.forEach(c => {
          if (c && c.id) claimsMap.set(c.id, { ...c });
        });
        // Only preserve genuine user-added claims logged in the app (id starts with claim-[timestamp])
        if (Array.isArray(merged.claims)) {
          merged.claims.forEach(c => {
            if (c && c.id) {
              const isOldPlaceholder = c.id.startsWith('claim-demo-') || 
                                       c.id === 'claim-ms-01' || 
                                       /^claim-barness-\d+$/.test(c.id);
              const isUserAdded = /^claim-\d{10,}-/.test(c.id);
              if (!isOldPlaceholder && isUserAdded && !claimsMap.has(c.id)) {
                claimsMap.set(c.id, { ...c });
              }
            }
          });
        }
        merged.claims = Array.from(claimsMap.values());
        merged.claimsSeedVersion = 5;
      } else if (Array.isArray(merged.claims)) {
        merged.claims = merged.claims.map(c => {
          const claim = { ...c };
          claim.date = claim.date || claim.dateOfService || formatDateIso(new Date());
          claim.amountPaid = Number(claim.amountPaid !== undefined ? claim.amountPaid : (claim.amountBilled || 0));
          claim.patient = claim.patient || 'Xavier Healy';
          claim.superbillStatus = claim.superbillStatus || 'have';
          claim.submissionType = claim.submissionType || 'provider';
          claim.payoutMethod = claim.payoutMethod || 'direct_deposit';
          return claim;
        });
      }

      // Initialize Z Log entries & Titration
      const needsEnrichedSeed = !merged.zlogEntries || 
        typeof merged.zlogEntries !== 'object' || 
        Object.keys(merged.zlogEntries).length === 0 || 
        !merged.zlogSeedVersion ||
        merged.zlogSeedVersion < 16;

      if (needsEnrichedSeed) {
        const cleanDefaults = (typeof DEFAULT_ZLOG_ENTRIES !== 'undefined') ? { ...DEFAULT_ZLOG_ENTRIES } : {};
        if (merged.zlogEntries && typeof merged.zlogEntries === 'object') {
          for (const [d, entry] of Object.entries(merged.zlogEntries)) {
            if (entry) {
              const defEntry = cleanDefaults[d] || {};
              cleanDefaults[d] = {
                ...defEntry,
                ...entry,
                notes: (entry.notes !== undefined && entry.notes !== '') ? entry.notes : (defEntry.notes || ''),
                rating: (entry.rating !== undefined && entry.rating !== null) ? entry.rating : (defEntry.rating || null),
                attachments: (Array.isArray(entry.attachments) && entry.attachments.length > 0) ? entry.attachments : (defEntry.attachments || [])
              };
            }
          }
        }
        // Safety recovery from any dedicated localStorage backups
        try {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('ZLOG_ENTRY_BACKUP_')) {
              const dKey = key.replace('ZLOG_ENTRY_BACKUP_', '');
              const bVal = JSON.parse(localStorage.getItem(key));
              if (bVal && ((bVal.notes && bVal.notes.trim()) || bVal.rating !== null)) {
                cleanDefaults[dKey] = { ...(cleanDefaults[dKey] || {}), ...bVal };
              }
            }
          }
        } catch (e) {}

        for (const targetDate of ['2026-09-30', '2026-10-01', '2026-10-02']) {
          if (cleanDefaults[targetDate]) {
            const defaultAtts = (DEFAULT_ZLOG_ENTRIES[targetDate] && DEFAULT_ZLOG_ENTRIES[targetDate].attachments) || [];
            const existingAtts = cleanDefaults[targetDate].attachments || [];
            const mergedAtts = [...existingAtts];
            for (const defAtt of defaultAtts) {
              if (!mergedAtts.some(a => a && (a.id === defAtt.id || a.name === defAtt.name))) {
                mergedAtts.push(defAtt);
              }
            }
            cleanDefaults[targetDate].attachments = mergedAtts;
            if (cleanDefaults[targetDate].notes && cleanDefaults[targetDate].notes.includes('🏫 School / Teacher Notes:')) {
              const idx = cleanDefaults[targetDate].notes.indexOf('🏫 School / Teacher Notes:');
              cleanDefaults[targetDate].notes = cleanDefaults[targetDate].notes.substring(0, idx).trim();
              if (!cleanDefaults[targetDate].notes) {
                cleanDefaults[targetDate].rating = null;
                cleanDefaults[targetDate].ratingRaw = '';
              }
            }
          }
        }
        merged.zlogEntries = cleanDefaults;
        merged.zlogSeedVersion = 16;
      }

      const hasMissingPrescribers = Array.isArray(merged.titrationHistory) && merged.titrationHistory.some(r => !r || !r.prescriber);
      const hasTit35 = Array.isArray(merged.titrationHistory) && merged.titrationHistory.some(r => r && (r.id === 'tit-35' || (r.date === '2026-09-19' && r.medication && r.medication.includes('Risperdal'))));
      if (!merged.titrationSeedVersion || merged.titrationSeedVersion < 7 || !Array.isArray(merged.titrationHistory) || merged.titrationHistory.length < 35 || hasMissingPrescribers || !hasTit35) {
        if (Array.isArray(merged.titrationHistory) && merged.titrationHistory.length > 0 && !hasTit35) {
          const tit35 = (typeof DEFAULT_TITRATION_HISTORY !== 'undefined') ? DEFAULT_TITRATION_HISTORY.find(t => t.id === 'tit-35') : null;
          if (tit35) {
            merged.titrationHistory.push(JSON.parse(JSON.stringify(tit35)));
          } else {
            merged.titrationHistory = (typeof DEFAULT_TITRATION_HISTORY !== 'undefined') ? JSON.parse(JSON.stringify(DEFAULT_TITRATION_HISTORY)) : [];
          }
        } else {
          merged.titrationHistory = (typeof DEFAULT_TITRATION_HISTORY !== 'undefined') ? JSON.parse(JSON.stringify(DEFAULT_TITRATION_HISTORY)) : [];
        }
        merged.titrationSeedVersion = 7;
      }

      if (!Array.isArray(merged.zlogActiveMeds) || merged.zlogActiveMeds.length === 0) {
        merged.zlogActiveMeds = (typeof DEFAULT_ZLOG_MEDS !== 'undefined') ? [...DEFAULT_ZLOG_MEDS] : [];
      }

      if (!merged.coverCampaigns || !merged.coverCampaignsSeedVersion || merged.coverCampaignsSeedVersion < 9 || !Array.isArray(merged.coverCampaigns.now)) {
        if (!merged.coverCampaigns || !Array.isArray(merged.coverCampaigns.now)) {
          merged.coverCampaigns = JSON.parse(JSON.stringify(defaults.coverCampaigns));
        }
        merged.coverCampaignsSeedVersion = 9;
      }
      // Ensure Chin hair is present in later if not already in now or later
      if (merged.coverCampaigns && Array.isArray(merged.coverCampaigns.later)) {
        const hasChinHair = [...(merged.coverCampaigns.now || []), ...merged.coverCampaigns.later].some(c =>
          c && (c.id === 'camp-chinhair' || (c.title || '').toLowerCase().trim() === 'chin hair')
        );
        if (!hasChinHair) {
          const chinHairDefault = defaults.coverCampaigns.later.find(c => c && c.id === 'camp-chinhair');
          if (chinHairDefault) {
            merged.coverCampaigns.later.push(JSON.parse(JSON.stringify(chinHairDefault)));
          }
        }
      }
      // Ensure Shoes is present in later if not already in now or later
      if (merged.coverCampaigns && Array.isArray(merged.coverCampaigns.later)) {
        const hasShoes = [...(merged.coverCampaigns.now || []), ...merged.coverCampaigns.later].some(c =>
          c && (c.id === 'camp-shoes' || (c.title || '').toLowerCase().trim() === 'shoes')
        );
        if (!hasShoes) {
          const shoesDefault = defaults.coverCampaigns.later.find(c => c && c.id === 'camp-shoes');
          if (shoesDefault) {
            merged.coverCampaigns.later.push(JSON.parse(JSON.stringify(shoesDefault)));
          }
        }
      }
      // Ensure Haircare and Surgery are always initialized with their dedicated tools
      ['now', 'later'].forEach(tierKey => {
        if (merged.coverCampaigns && Array.isArray(merged.coverCampaigns[tierKey])) {
          merged.coverCampaigns[tierKey].forEach(c => {
            if (c && (c.id === 'camp-haircare' || (c.title || '').toLowerCase().trim() === 'haircare')) {
              if (!['IP', 'NS', 'Maintain', 'Done'].includes(c.status)) c.status = 'Maintain';
              c.tools = {
                margo: { label: 'Haircare Checkpoint', action: 'haircare' },
                apple: { noteQuery: '# BEAUTY 02_HAIR' }
              };
              c.visibleTools = ['margo', 'apple'];
            }
            if (c && (c.id === 'camp-surgery' || (c.title || '').toLowerCase().trim() === 'surgery')) {
              c.tools = {
                apple: { noteQuery: '# HEALTH 02_SURGERY' },
                things: { query: 'Surgery Follow-up' }
              };
              c.visibleTools = ['apple', 'things'];
            }
            if (c && (c.id === 'camp-oon' || (c.title || '').toLowerCase().includes('oon') || (c.title || '').toLowerCase().includes('reimburse'))) {
              c.tools = {
                margo: { label: 'Medical Claims Tracker', action: 'claims' },
                google: { folder: 'Superbills & EOBs' },
                things: { query: 'Medical Claims Reimbursement' },
                email: { emailQuery: 'Insurance Superbills' }
              };
              c.visibleTools = ['margo', 'google', 'things', 'email'];
            }
          });
        }
      });
      if (!merged.coverTopMind || !Array.isArray(merged.coverTopMind.now)) {
        merged.coverTopMind = JSON.parse(JSON.stringify(defaults.coverTopMind));
      }
      if (!Array.isArray(merged.coverTopicAudits) || merged.coverTopicAudits.length === 0) {
        merged.coverTopicAudits = JSON.parse(JSON.stringify(defaults.coverTopicAudits));
      }

      // Persist the consolidated state
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        localStorage.setItem('BOOK_OF_LIFE_DATA_BACKUP', JSON.stringify(merged));
        if (merged.coverCampaigns) {
          localStorage.setItem('BOL_COVER_CAMPAIGNS_V2', JSON.stringify({
            coverCampaigns: merged.coverCampaigns,
            coverUpdatedAt: merged.coverUpdatedAt || 0,
            coverCampaignsSeedVersion: merged.coverCampaignsSeedVersion || 9
          }));
        }
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
      if (this.data && this.data.coverCampaigns) {
        localStorage.setItem('BOL_COVER_CAMPAIGNS_V2', JSON.stringify({
          coverCampaigns: this.data.coverCampaigns,
          coverUpdatedAt: this.data.coverUpdatedAt || 0,
          coverCampaignsSeedVersion: this.data.coverCampaignsSeedVersion || 9
        }));
      }
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

  setAnchorStage(habitId, stage, dateStr = formatDateIso(new Date())) {
    if (!this.data.habitsState[dateStr]) {
      this.data.habitsState[dateStr] = {};
    }

    const prevRaw = this.data.habitsState[dateStr][habitId];
    const getStagePoints = (s) => {
      if (s === 1 || s === true) return 10;
      if (s === 0.75) return 8;
      if (s === 0.5) return 5;
      if (s === 0.25) return 2;
      return 0;
    };
    const prevPoints = getStagePoints(prevRaw);
    const newPoints = getStagePoints(stage);
    const delta = newPoints - prevPoints;

    this.data.habitsState[dateStr][habitId] = stage === 0 ? false : stage;
    if (!this.data.habitsUpdatedAt) this.data.habitsUpdatedAt = {};
    this.data.habitsUpdatedAt[dateStr] = Date.now();

    if (delta !== 0) {
      this.addPoints(delta);
    }
    this.recalculateStreak(habitId);
    this.saveData();
    return stage;
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

  getAuroraDayState(dateStr = formatDateIso(new Date())) {
    if (!this.data.auroraDailyState) this.data.auroraDailyState = {};
    const octGoal = Array.isArray(this.data.periodGoals)
      ? this.data.periodGoals.find(g => g && g.id === 'pg-oct-steps')
      : null;
    const octLoggedSteps = (octGoal && octGoal.logs && octGoal.logs[dateStr] !== undefined && octGoal.logs[dateStr] !== null && octGoal.logs[dateStr] !== '')
      ? Number(octGoal.logs[dateStr])
      : null;

    if (!this.data.auroraDailyState[dateStr]) {
      const dayHabits = (this.data.habitsState && this.data.habitsState[dateStr]) || {};
      const rawMove = dayHabits['h-move'];
      const moveStage = (rawMove === 1 || rawMove === true) ? 1 : (rawMove === 0.75 ? 0.75 : (rawMove === 0.5 ? 0.5 : (rawMove === 0.25 ? 0.25 : 0)));
      const rawStand = dayHabits['h-stand'];
      const standStage = (rawStand === 1 || rawStand === true) ? 1 : (rawStand === 0.75 ? 0.75 : (rawStand === 0.5 ? 0.5 : (rawStand === 0.25 ? 0.25 : 0)));
      const rawSteps = dayHabits['h-steps'];
      const stepsStageFromHabit = (rawSteps === 1 || rawSteps === true) ? 1 : (rawSteps === 0.75 ? 0.75 : (rawSteps === 0.5 ? 0.5 : (rawSteps === 0.25 ? 0.25 : 0)));

      const initialMoveCal = Math.round(moveStage * 300);
      const initialStandCount = Math.round(standStage * 12);
      const initialSteps = (octLoggedSteps !== null && !isNaN(octLoggedSteps))
        ? Math.max(0, octLoggedSteps)
        : Math.round(stepsStageFromHabit * 10000);
      const stepsStage = initialSteps >= 10000 ? 1 : (initialSteps >= 7500 ? 0.75 : (initialSteps >= 5000 ? 0.5 : (initialSteps >= 2500 ? 0.25 : stepsStageFromHabit)));

      const hours = [];
      for (let i = 0; i < 12; i++) {
        hours.push(i < initialStandCount);
      }

      const stageToAnchIdx = (s) => (s >= 1 ? 4 : (s >= 0.75 ? 3 : (s >= 0.5 ? 2 : (s >= 0.25 ? 1 : 0))));
      this.data.auroraDailyState[dateStr] = {
        moveCal: initialMoveCal,
        hours,
        steps: initialSteps,
        anch: {
          move: stageToAnchIdx(moveStage),
          stand: stageToAnchIdx(standStage),
          steps: stageToAnchIdx(stepsStage)
        },
        chips: []
      };
    } else {
      const s = this.data.auroraDailyState[dateStr];
      if (!Array.isArray(s.hours) || s.hours.length < 12) {
        const hrs = [];
        for (let i = 0; i < 12; i++) hrs.push(!!(s.hours && s.hours[i]));
        s.hours = hrs;
      }
      if (!s.anch) s.anch = { move: 0, stand: 0, steps: 0 };
      if (typeof s.anch.steps !== 'number') {
        if (octLoggedSteps !== null && !isNaN(octLoggedSteps)) {
          s.steps = octLoggedSteps;
          s.anch.steps = octLoggedSteps >= 10000 ? 4 : (octLoggedSteps >= 7500 ? 3 : (octLoggedSteps >= 5000 ? 2 : (octLoggedSteps >= 2500 ? 1 : 0)));
        } else {
          s.anch.steps = 0;
        }
      }
      if (typeof s.steps !== 'number') {
        s.steps = (octLoggedSteps !== null && !isNaN(octLoggedSteps))
          ? octLoggedSteps
          : ([0, 2500, 5000, 7500, 10000][s.anch.steps] || 0);
      }
      if (!Array.isArray(s.chips)) s.chips = [];
      if (typeof s.moveCal !== 'number') s.moveCal = 0;
    }
    return this.data.auroraDailyState[dateStr];
  }

  saveAuroraDayState(dateStr, patch) {
    const cur = this.getAuroraDayState(dateStr);
    Object.assign(cur, patch);
    cur.updatedAt = Date.now();

    // Sync Move, Stand & 10K Steps back to habitsState for streaks and XP
    const moveCal = Math.max(0, Math.min(300, Number(cur.moveCal) || 0));
    cur.moveCal = moveCal;
    const moveAnch = (cur.anch && typeof cur.anch.move === 'number') ? cur.anch.move : 0;
    const moveStage = (moveCal >= 300 || moveAnch === 4) ? 1
      : ((moveCal >= 225 || moveAnch === 3) ? 0.75
      : ((moveCal >= 150 || moveAnch === 2) ? 0.5
      : ((moveCal >= 75 || moveAnch === 1 || moveCal > 0) ? 0.25 : 0)));

    const standCount = (cur.hours || []).filter(Boolean).length;
    const standAnch = (cur.anch && typeof cur.anch.stand === 'number') ? cur.anch.stand : 0;
    const standStage = (standCount >= 12 || standAnch === 4) ? 1
      : ((standCount >= 9 || standAnch === 3) ? 0.75
      : ((standCount >= 6 || standAnch === 2) ? 0.5
      : ((standCount >= 3 || standAnch === 1 || standCount > 0) ? 0.25 : 0)));

    const stepsCount = Math.max(0, Number(cur.steps) || 0);
    cur.steps = stepsCount;
    const stepsAnch = (cur.anch && typeof cur.anch.steps === 'number') ? cur.anch.steps : 0;
    const stepsStage = (stepsCount >= 10000 || stepsAnch === 4) ? 1
      : ((stepsCount >= 7500 || stepsAnch === 3) ? 0.75
      : ((stepsCount >= 5000 || stepsAnch === 2) ? 0.5
      : ((stepsCount >= 2500 || stepsAnch === 1 || stepsCount > 0) ? 0.25 : 0)));

    if ('moveCal' in patch || 'anch' in patch || moveStage > 0) {
      this.setAnchorStage('h-move', moveStage, dateStr);
    }
    if ('hours' in patch || 'anch' in patch || standStage > 0) {
      this.setAnchorStage('h-stand', standStage, dateStr);
    }
    if ('steps' in patch || 'anch' in patch || stepsStage > 0) {
      this.setAnchorStage('h-steps', stepsStage, dateStr);
    }

    const stageToAnchIdx = (s) => (s >= 1 ? 4 : (s >= 0.75 ? 3 : (s >= 0.5 ? 2 : (s >= 0.25 ? 1 : 0))));
    if (!cur.anch) cur.anch = { move: 0, stand: 0, steps: 0 };
    cur.anch.move = stageToAnchIdx(moveStage);
    cur.anch.stand = stageToAnchIdx(standStage);
    cur.anch.steps = stageToAnchIdx(stepsStage);

    // Also sync steps with October 10k steps period goal if applicable
    if (('steps' in patch || (patch.anch && typeof patch.anch.steps === 'number')) && dateStr >= '2026-10-01' && dateStr <= '2026-10-31') {
      const octGoal = this.getPeriodGoal('pg-oct-steps');
      if (octGoal && octGoal.id === 'pg-oct-steps') {
        if (!octGoal.logs) octGoal.logs = {};
        if (stepsCount > 0) {
          octGoal.logs[dateStr] = stepsCount;
        } else {
          delete octGoal.logs[dateStr];
        }
        octGoal.updatedAt = Date.now();
      }
    }

    this.saveData();
    return cur;
  }

  // --- Custom Period Average Goals Methods (e.g. 10k Steps for Oct) ---

  getPeriodGoals() {
    if (!Array.isArray(this.data.periodGoals) || this.data.periodGoals.length === 0) {
      this.data.periodGoals = [
        {
          id: 'pg-oct-steps',
          title: '10k Steps · October',
          targetAvg: 10000,
          unit: 'steps',
          startDate: '2026-10-01',
          endDate: '2026-10-31',
          logs: {}
        }
      ];
    }
    return this.data.periodGoals;
  }

  getPeriodGoal(goalId) {
    const list = this.getPeriodGoals();
    if (!goalId) return list[0] || null;
    return list.find(g => g.id === goalId) || list[0] || null;
  }

  logPeriodGoalDay(goalId, dateStr, rawVal) {
    const goal = this.getPeriodGoal(goalId);
    if (!goal) return null;
    if (!goal.logs || typeof goal.logs !== 'object') goal.logs = {};

    let num = 0;
    if (rawVal === null || rawVal === undefined || String(rawVal).trim() === '') {
      delete goal.logs[dateStr];
    } else {
      num = Math.max(0, Number(rawVal) || 0);
      goal.logs[dateStr] = num;
    }
    goal.updatedAt = Date.now();

    // Sync with daily 10K Steps tracker if this is the steps goal
    if (goal.id === 'pg-oct-steps' || (goal.unit || '').toLowerCase() === 'steps') {
      const cur = this.getAuroraDayState(dateStr);
      cur.steps = num;
      const stepsStage = num >= 10000 ? 1 : (num >= 7500 ? 0.75 : (num >= 5000 ? 0.5 : (num >= 2500 ? 0.25 : 0)));
      if (!cur.anch) cur.anch = { move: 0, stand: 0, steps: 0 };
      cur.anch.steps = stepsStage >= 1 ? 4 : (stepsStage >= 0.75 ? 3 : (stepsStage >= 0.5 ? 2 : (stepsStage >= 0.25 ? 1 : 0)));
      cur.updatedAt = Date.now();
      this.setAnchorStage('h-steps', stepsStage, dateStr);
    }

    this.saveData();
    return goal;
  }

  savePeriodGoal(payload) {
    const list = this.getPeriodGoals();
    const id = payload.id || `pg-${Date.now()}`;
    const existing = list.find(g => g.id === id);
    if (existing) {
      existing.title = (payload.title || existing.title || 'Custom Period Goal').trim();
      existing.targetAvg = Math.max(1, Number(payload.targetAvg) || existing.targetAvg || 10000);
      existing.unit = (payload.unit || existing.unit || 'steps').trim();
      existing.startDate = payload.startDate || existing.startDate || '2026-10-01';
      existing.endDate = payload.endDate || existing.endDate || '2026-10-31';
      existing.updatedAt = Date.now();
      this.saveData();
      return existing;
    } else {
      const newGoal = {
        id,
        title: (payload.title || 'Custom Period Goal').trim(),
        targetAvg: Math.max(1, Number(payload.targetAvg) || 10000),
        unit: (payload.unit || 'steps').trim(),
        startDate: payload.startDate || '2026-10-01',
        endDate: payload.endDate || '2026-10-31',
        logs: {},
        updatedAt: Date.now()
      };
      list.push(newGoal);
      this.saveData();
      return newGoal;
    }
  }

  deletePeriodGoal(goalId) {
    if (!Array.isArray(this.data.periodGoals)) return;
    if (this.data.periodGoals.length <= 1) return; // keep at least one period goal card
    this.data.periodGoals = this.data.periodGoals.filter(g => g.id !== goalId);
    this.saveData();
  }

  getPeriodGoalStats(goal, refDateStr = formatDateIso(new Date())) {
    if (!goal) return null;
    const startObj = parseDateIso(goal.startDate || '2026-10-01');
    const endObj = parseDateIso(goal.endDate || '2026-10-31');
    startObj.setHours(0, 0, 0, 0);
    endObj.setHours(0, 0, 0, 0);

    const dates = [];
    const cur = new Date(startObj);
    let safety = 0;
    while (cur <= endObj && safety < 400) {
      dates.push(formatDateIso(cur));
      cur.setDate(cur.getDate() + 1);
      safety++;
    }
    if (dates.length === 0) {
      dates.push(goal.startDate || refDateStr);
    }

    const totalDays = dates.length;
    const targetAvg = Math.max(1, Number(goal.targetAvg) || 10000);
    const totalTargetVolume = totalDays * targetAvg;
    const logs = goal.logs || {};

    let loggedDaysCount = 0;
    let totalLoggedSum = 0;
    dates.forEach(d => {
      const v = logs[d];
      if (v !== undefined && v !== null && v !== '') {
        const num = Number(v);
        if (!isNaN(num) && num >= 0) {
          loggedDaysCount++;
          totalLoggedSum += num;
        }
      }
    });

    const currentAvg = loggedDaysCount > 0 ? Math.round(totalLoggedSum / loggedDaysCount) : 0;
    const daysLeft = Math.max(0, totalDays - loggedDaysCount);
    const remainingVolume = Math.max(0, totalTargetVolume - totalLoggedSum);
    const neededAvgForBalance = daysLeft > 0 ? Math.ceil(remainingVolume / daysLeft) : 0;
    const avgProgressPct = Math.min(100, Math.round((currentAvg / targetAvg) * 100));
    const volumeProgressPct = Math.min(100, Math.round((totalLoggedSum / totalTargetVolume) * 100));
    const dayRaw = logs[refDateStr];
    const dayValue = (dayRaw !== undefined && dayRaw !== null && dayRaw !== '') ? Number(dayRaw) : null;
    const isDateInRange = (refDateStr >= dates[0] && refDateStr <= dates[dates.length - 1]);

    return {
      dates,
      totalDays,
      targetAvg,
      totalTargetVolume,
      loggedDaysCount,
      totalLoggedSum,
      currentAvg,
      daysLeft,
      remainingVolume,
      neededAvgForBalance,
      avgProgressPct,
      volumeProgressPct,
      dayValue,
      isDateInRange,
      isOnTrack: loggedDaysCount > 0 && currentAvg >= targetAvg
    };
  }

  // --- Daily Weight Tracker Methods (Target: 110 lbs) ---

  getWeight(dateStr = formatDateIso(new Date())) {
    if (!this.data.weightLogs) this.data.weightLogs = {};
    const val = this.data.weightLogs[dateStr];
    if (val === undefined || val === null || val === '' || isNaN(Number(val))) {
      return null;
    }
    return Math.round(Number(val) * 10) / 10;
  }

  setWeight(val, dateStr = formatDateIso(new Date())) {
    if (!this.data.weightLogs) this.data.weightLogs = {};
    if (val === null || val === undefined || String(val).trim() === '') {
      delete this.data.weightLogs[dateStr];
    } else {
      const num = Number(val);
      if (isNaN(num) || num <= 0) {
        delete this.data.weightLogs[dateStr];
      } else {
        this.data.weightLogs[dateStr] = Math.round(num * 10) / 10;
      }
    }
    this.data.weightUpdatedAt = Date.now();
    this.saveData();
    return this.getWeight(dateStr);
  }

  stepWeight(delta, dateStr = formatDateIso(new Date())) {
    const current = this.getWeight(dateStr);
    const target = this.getWeightTarget();
    let base = current;
    if (base === null) {
      const latest = this.getLatestLoggedWeight();
      base = latest ? latest.weight : target;
    }
    const nextVal = Math.max(1, Math.round((base + delta) * 10) / 10);
    return this.setWeight(nextVal, dateStr);
  }

  getWeightTarget() {
    if (this.data.weightTarget !== undefined && !isNaN(Number(this.data.weightTarget)) && Number(this.data.weightTarget) > 0) {
      return Number(this.data.weightTarget);
    }
    return 110;
  }

  setWeightTarget(target) {
    const num = Number(target);
    if (!isNaN(num) && num > 0) {
      this.data.weightTarget = Math.round(num * 10) / 10;
      this.data.weightUpdatedAt = Date.now();
      this.saveData();
    }
    return this.getWeightTarget();
  }

  getLatestLoggedWeight(beforeOrOnDateStr = formatDateIso(new Date())) {
    if (!this.data.weightLogs) return null;
    const entries = Object.entries(this.data.weightLogs)
      .filter(([d, w]) => d <= beforeOrOnDateStr && w !== null && !isNaN(Number(w)))
      .sort((a, b) => b[0].localeCompare(a[0]));
    if (entries.length === 0) return null;
    return { dateStr: entries[0][0], weight: Math.round(Number(entries[0][1]) * 10) / 10 };
  }

  getWeightStats(dateStr = formatDateIso(new Date())) {
    const current = this.getWeight(dateStr);
    const target = this.getWeightTarget();
    const latest = this.getLatestLoggedWeight(dateStr);
    const diff = (current !== null) ? Math.round((current - target) * 10) / 10 : null;
    const isAtTarget = (diff !== null) && Math.abs(diff) <= 0.2;
    return {
      current,
      target,
      diff,
      isAtTarget,
      latest
    };
  }

  isMove100Completed(dStr) {
    if (!dStr || !this.data) return false;
    const auroraDay = this.data.auroraDailyState && this.data.auroraDailyState[dStr];
    if (auroraDay) {
      const moveCal = Number(auroraDay.moveCal) || 0;
      const moveAnch = (auroraDay.anch && typeof auroraDay.anch.move === 'number') ? auroraDay.anch.move : 0;
      return moveCal >= 300 || moveAnch === 4;
    }
    const dayHabits = this.data.habitsState && this.data.habitsState[dStr];
    if (dayHabits) {
      const rawMove = dayHabits['h-move'];
      return rawMove === 1 || rawMove === true;
    }
    return false;
  }

  isStand100Completed(dStr) {
    if (!dStr || !this.data) return false;
    const auroraDay = this.data.auroraDailyState && this.data.auroraDailyState[dStr];
    if (auroraDay) {
      const standHours = Array.isArray(auroraDay.hours) ? auroraDay.hours.filter(Boolean).length : 0;
      const standAnch = (auroraDay.anch && typeof auroraDay.anch.stand === 'number') ? auroraDay.anch.stand : 0;
      return standHours >= 12 || standAnch === 4;
    }
    const dayHabits = this.data.habitsState && this.data.habitsState[dStr];
    if (dayHabits) {
      const rawStand = dayHabits['h-stand'];
      return rawStand === 1 || rawStand === true;
    }
    return false;
  }

  isSteps100Completed(dStr) {
    if (!dStr || !this.data) return false;
    const auroraDay = this.data.auroraDailyState && this.data.auroraDailyState[dStr];
    if (auroraDay) {
      const stepsCount = Number(auroraDay.steps) || 0;
      const stepsAnch = (auroraDay.anch && typeof auroraDay.anch.steps === 'number') ? auroraDay.anch.steps : 0;
      if (stepsCount >= 10000 || stepsAnch === 4) return true;
    }
    const dayHabits = this.data.habitsState && this.data.habitsState[dStr];
    if (dayHabits) {
      const rawSteps = dayHabits['h-steps'];
      if (rawSteps === 1 || rawSteps === true) return true;
    }
    const octGoal = Array.isArray(this.data.periodGoals)
      ? this.data.periodGoals.find(g => g && g.id === 'pg-oct-steps')
      : null;
    if (octGoal && octGoal.logs && octGoal.logs[dStr] !== undefined && octGoal.logs[dStr] !== null && octGoal.logs[dStr] !== '') {
      const target = Number(octGoal.targetAvg) || 10000;
      if (Number(octGoal.logs[dStr]) >= target) return true;
    }
    return false;
  }

  isDayActive(dStr) {
    return this.isMove100Completed(dStr) && this.isStand100Completed(dStr) && this.isSteps100Completed(dStr);
  }

  getOverallStreak() {
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dStr = formatDateIso(d);
      if (this.isMove100Completed(dStr) && this.isStand100Completed(dStr) && this.isSteps100Completed(dStr)) {
        streak++;
      } else {
        // If today is not 100% completed yet, don't break the streak from yesterday
        if (i === 0) continue;
        break;
      }
    }
    return streak;
  }

  recalculateStreak(habitId) {
    if (!this.data.habitStreaks) this.data.habitStreaks = {};

    const habit = this.getHabit(habitId) || (
      habitId === 'h-move' ? { id: 'h-move', name: 'Move', cadence: 'daily' } :
      (habitId === 'h-stand' ? { id: 'h-stand', name: 'Stand', cadence: 'daily' } :
      (habitId === 'h-steps' ? { id: 'h-steps', name: '10K Steps', cadence: 'daily' } : null))
    );
    if (!habit) return;

    let streak = 0;
    const now = new Date();
    const hName = (habit.name || '').toLowerCase().trim();
    
    // Check consecutive days backward from today (requires 100% completion for daily habits)
    for (let i = 0; i < 365; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dStr = formatDateIso(d);

      let isCompleted = false;
      if (habitId === 'h-move' || hName === 'move') {
        isCompleted = this.isMove100Completed(dStr);
      } else if (habitId === 'h-stand' || hName === 'stand' || hName === 'stand ring') {
        isCompleted = this.isStand100Completed(dStr);
      } else if (habitId === 'h-steps' || hName === '10k steps' || hName === 'steps') {
        isCompleted = this.isSteps100Completed(dStr);
      } else {
        const dayState = (this.data.habitsState && this.data.habitsState[dStr]) || {};
        const val = dayState[habitId];
        isCompleted = habit.cadence === 'weekly'
          ? (Number(val || 0) > 0 || val === true)
          : (val === 1 || val === true);
      }

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

  recalculateAllStreaks() {
    if (!this.data.habitStreaks) this.data.habitStreaks = {};
    const habits = this.getHabits(true);
    habits.forEach(h => {
      if (h && h.id) this.recalculateStreak(h.id);
    });
    this.recalculateStreak('h-move');
    this.recalculateStreak('h-stand');
    this.recalculateStreak('h-steps');
    this.data.overallStreak = this.getOverallStreak();
    return this.data.habitStreaks;
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
      const prev = choices.good || 0;
      choices.good = Math.max(0, prev + delta);
      if (delta > 0) {
        this.addPoints(5);
      } else if (delta < 0 && prev > 0) {
        this.addPoints(-5);
      }
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

  addDayGoal(text, dateStr = formatDateIso(new Date()), extraMeta = {}) {
    // Defensive check: swap arguments if accidentally passed as (dateStr, text)
    if (typeof text === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(text.trim()) && typeof dateStr === 'string' && !/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
      const temp = text.trim();
      text = dateStr.trim();
      dateStr = temp;
    }
    if (!text || !text.trim()) return null;
    const goals = this.getDayGoals(dateStr);
    const newGoal = {
      id: extraMeta.id || `dg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      ...extraMeta
    };
    goals.push(newGoal);
    if (!this.data.dayGoalsUpdatedAt) this.data.dayGoalsUpdatedAt = {};
    this.data.dayGoalsUpdatedAt[dateStr] = Date.now();
    this.saveData();
    return newGoal;
  }

  addRangeGoal(text, startDate, endDate) {
    if (!text || !text.trim()) return [];
    const todayIso = (typeof formatDateIso === 'function') ? formatDateIso(new Date()) : '2026-10-17';
    let sDate = startDate || todayIso;
    let eDate = endDate || sDate;
    if (eDate < sDate) {
      const tmp = sDate; sDate = eDate; eDate = tmp;
    }
    const rangeId = `dgr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const parseFn = (typeof parseDateIso === 'function') ? parseDateIso : (s => new Date(s));
    const formatFn = (typeof formatDateIso === 'function') ? formatDateIso : (d => d.toISOString().split('T')[0]);

    const sObj = parseFn(sDate);
    const eObj = parseFn(eDate);
    const sLabel = sObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const eLabel = eObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const rangeLabel = (sDate === eDate) ? sLabel : `${sLabel} – ${eLabel}`;

    const added = [];
    const cur = new Date(sObj);
    let count = 0;
    while (cur <= eObj && count < 90) {
      const dStr = formatFn(cur);
      const g = this.addDayGoal(text, dStr, {
        rangeId,
        startDate: sDate,
        endDate: eDate,
        rangeLabel
      });
      if (g) added.push(g);
      cur.setDate(cur.getDate() + 1);
      count++;
    }
    return added;
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

  deleteDayGoal(goalId, dateStr = formatDateIso(new Date()), deleteEntireRange = true) {
    const goals = this.getDayGoals(dateStr);
    const target = goals.find(g => g.id === goalId);
    if (target && target.rangeId && deleteEntireRange && this.data.dayGoals) {
      const rangeId = target.rangeId;
      Object.keys(this.data.dayGoals).forEach(d => {
        if (Array.isArray(this.data.dayGoals[d])) {
          this.data.dayGoals[d] = this.data.dayGoals[d].filter(g => g.rangeId !== rangeId && g.id !== goalId);
        }
      });
    } else {
      this.data.dayGoals[dateStr] = goals.filter(g => g.id !== goalId);
    }
    if (!this.data.dayGoalsUpdatedAt) this.data.dayGoalsUpdatedAt = {};
    this.data.dayGoalsUpdatedAt[dateStr] = Date.now();
    this.saveData();
    return true;
  }

  // --- Abbey Yung Hair Care Routine Methods ---

  getHairCareState(dateStr = (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0])) {
    if (!this.data.hairCareState) this.data.hairCareState = {};
    if (!this.data.hairCareState[dateStr]) this.data.hairCareState[dateStr] = {};
    return this.data.hairCareState[dateStr];
  }

  isHairCareDayDone(dateStr = (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0])) {
    if (!this.data.hairCareState) this.data.hairCareState = {};
    const day = this.data.hairCareState[dateStr] || {};
    if (day.completed) return true;
    if (day.skipped) return true;
    if (typeof getHairCareRoutineForDate === 'function') {
      const routine = getHairCareRoutineForDate(dateStr);
      if (routine && routine.steps && routine.steps.length > 0) {
        return routine.steps.every(s => !!day[s.id]);
      }
    }
    return false;
  }

  toggleHairCareDay(dateStr = (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0])) {
    if (!this.data.hairCareState) this.data.hairCareState = {};
    if (!this.data.hairCareState[dateStr]) this.data.hairCareState[dateStr] = {};
    const day = this.data.hairCareState[dateStr];
    const isCompleted = !!day.completed;
    const nextVal = !isCompleted;
    day.completed = nextVal;
    if (nextVal) {
      day.skipped = false;
    }
    day.updatedAt = Date.now();

    if (typeof getHairCareRoutineForDate === 'function') {
      const routine = getHairCareRoutineForDate(dateStr);
      if (routine && routine.steps) {
        routine.steps.forEach(s => {
          day[s.id] = nextVal;
        });
      }
    }

    this.addPoints(nextVal ? 10 : -10);
    try {
      localStorage.setItem('HAIR_CARE_STATE_BACKUP', JSON.stringify(this.data.hairCareState));
    } catch (e) {}
    this.saveData();
    return nextVal;
  }

  recordHairCareSkip(dateStr = (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0]), note = '') {
    if (!this.data.hairCareState) this.data.hairCareState = {};
    if (!this.data.hairCareState[dateStr]) this.data.hairCareState[dateStr] = {};
    const day = this.data.hairCareState[dateStr];
    const wasAlreadyHandled = day.completed || day.skipped;
    day.skipped = true;
    day.completed = false;
    day.insteadNote = (note || '').trim();
    day.skippedAt = new Date().toISOString();
    day.updatedAt = Date.now();

    if (!wasAlreadyHandled) {
      this.addPoints(5);
    }
    try {
      localStorage.setItem('HAIR_CARE_STATE_BACKUP', JSON.stringify(this.data.hairCareState));
    } catch (e) {}
    this.saveData();
    return day;
  }

  undoHairCareSkip(dateStr = (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0])) {
    if (!this.data.hairCareState) this.data.hairCareState = {};
    if (!this.data.hairCareState[dateStr]) return;
    const day = this.data.hairCareState[dateStr];
    if (day.skipped) {
      day.skipped = false;
      day.insteadNote = '';
      delete day.skippedAt;
      day.updatedAt = Date.now();
      this.addPoints(-5);
      try {
        localStorage.setItem('HAIR_CARE_STATE_BACKUP', JSON.stringify(this.data.hairCareState));
      } catch (e) {}
      this.saveData();
    }
  }

  toggleHairCareStep(dateStr = (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0]), stepId) {
    if (!this.data.hairCareState) this.data.hairCareState = {};
    if (!this.data.hairCareState[dateStr]) this.data.hairCareState[dateStr] = {};
    const current = !!this.data.hairCareState[dateStr][stepId];
    this.data.hairCareState[dateStr][stepId] = !current;
    this.data.hairCareState[dateStr].updatedAt = Date.now();
    this.addPoints(!current ? 5 : -5);
    try {
      localStorage.setItem('HAIR_CARE_STATE_BACKUP', JSON.stringify(this.data.hairCareState));
    } catch (e) {}
    this.saveData();
    return !current;
  }

  // --- Skincare Routine & Tracker Methods ---

  getSkinCareState(dateStr = (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0])) {
    if (!this.data.skinCareState) this.data.skinCareState = {};
    if (!this.data.skinCareState[dateStr]) this.data.skinCareState[dateStr] = {};
    return this.data.skinCareState[dateStr];
  }

  isSkinCareDayDone(dateStr = (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0])) {
    if (!this.data.skinCareState) this.data.skinCareState = {};
    const day = this.data.skinCareState[dateStr] || {};
    if (day.completed) return true;
    if (day.skipped) return true;
    if (day.am && day.pm) return true;
    return false;
  }

  toggleSkinCareDay(dateStr = (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0])) {
    if (!this.data.skinCareState) this.data.skinCareState = {};
    if (!this.data.skinCareState[dateStr]) this.data.skinCareState[dateStr] = {};
    const day = this.data.skinCareState[dateStr];
    const isCompleted = !!day.completed;
    const nextVal = !isCompleted;
    day.completed = nextVal;
    if (nextVal) {
      day.skipped = false;
      day.am = true;
      day.pm = true;
    } else {
      day.am = false;
      day.pm = false;
    }
    day.updatedAt = Date.now();

    if (typeof getSkinCareRoutineForDate === 'function') {
      const routine = getSkinCareRoutineForDate(dateStr);
      if (routine && routine.steps) {
        routine.steps.forEach(s => {
          day[s.id] = nextVal;
        });
      }
    }

    this.addPoints(nextVal ? 10 : -10);
    try {
      localStorage.setItem('SKIN_CARE_STATE_BACKUP', JSON.stringify(this.data.skinCareState));
    } catch (e) {}
    this.saveData();
    return nextVal;
  }

  toggleSkinCareSubStep(dateStr = (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0]), subKey = 'am') {
    if (!this.data.skinCareState) this.data.skinCareState = {};
    if (!this.data.skinCareState[dateStr]) this.data.skinCareState[dateStr] = {};
    const day = this.data.skinCareState[dateStr];
    const currentVal = !!day[subKey];
    const nextVal = !currentVal;
    day[subKey] = nextVal;
    day.updatedAt = Date.now();

    // If both AM and PM are checked, mark day completed
    const wasCompleted = !!day.completed;
    if (day.am && day.pm) {
      day.completed = true;
      day.skipped = false;
      if (!wasCompleted) {
        this.addPoints(10);
      }
    } else if (wasCompleted && (!day.am || !day.pm)) {
      day.completed = false;
      this.addPoints(-10);
    } else {
      // Partial credit for single sub-step (+5 XP)
      this.addPoints(nextVal ? 5 : -5);
    }

    try {
      localStorage.setItem('SKIN_CARE_STATE_BACKUP', JSON.stringify(this.data.skinCareState));
    } catch (e) {}
    this.saveData();
    return day;
  }

  recordSkinCareSkip(dateStr = (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0]), note = '') {
    if (!this.data.skinCareState) this.data.skinCareState = {};
    if (!this.data.skinCareState[dateStr]) this.data.skinCareState[dateStr] = {};
    const day = this.data.skinCareState[dateStr];
    const wasAlreadyHandled = day.completed || day.skipped;
    day.skipped = true;
    day.completed = false;
    day.insteadNote = (note || '').trim();
    day.skippedAt = new Date().toISOString();
    day.updatedAt = Date.now();

    if (!wasAlreadyHandled) {
      this.addPoints(5);
    }
    try {
      localStorage.setItem('SKIN_CARE_STATE_BACKUP', JSON.stringify(this.data.skinCareState));
    } catch (e) {}
    this.saveData();
    return day;
  }

  undoSkinCareSkip(dateStr = (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0])) {
    if (!this.data.skinCareState) this.data.skinCareState = {};
    if (!this.data.skinCareState[dateStr]) return;
    const day = this.data.skinCareState[dateStr];
    if (day.skipped) {
      day.skipped = false;
      day.insteadNote = '';
      delete day.skippedAt;
      day.updatedAt = Date.now();
      this.addPoints(-5);
      try {
        localStorage.setItem('SKIN_CARE_STATE_BACKUP', JSON.stringify(this.data.skinCareState));
      } catch (e) {}
      this.saveData();
    }
  }

  toggleSkinCareStep(dateStr = (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0]), stepId) {
    if (!this.data.skinCareState) this.data.skinCareState = {};
    if (!this.data.skinCareState[dateStr]) this.data.skinCareState[dateStr] = {};
    const current = !!this.data.skinCareState[dateStr][stepId];
    this.data.skinCareState[dateStr][stepId] = !current;
    this.data.skinCareState[dateStr].updatedAt = Date.now();
    this.addPoints(!current ? 2 : -2);
    try {
      localStorage.setItem('SKIN_CARE_STATE_BACKUP', JSON.stringify(this.data.skinCareState));
    } catch (e) {}
    this.saveData();
    return !current;
  }

  getSkinCareShoppingList() {
    if (!this.data.skincareShoppingList) this.data.skincareShoppingList = {};
    return this.data.skincareShoppingList;
  }

  toggleSkinCareShoppingItem(itemId) {
    if (!this.data.skincareShoppingList) this.data.skincareShoppingList = {};
    const current = !!this.data.skincareShoppingList[itemId];
    this.data.skincareShoppingList[itemId] = !current;
    this.saveData();
    return !current;
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

  recalculatePointsFromHistory(skipSave = false) {
    let pts = 185; // Baseline floor: Functional Menace
    if (this.data.habitsState) {
      Object.values(this.data.habitsState).forEach(day => {
        if (day && typeof day === 'object') {
          Object.values(day).forEach(v => {
            if (v) pts += (v === 0.5 ? 5 : 10);
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
    if (!skipSave) {
      this.saveData();
    }
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
    const goal = this.addDayGoal(item.text, dateStr);
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
    if (!Array.isArray(this.data.claims) || this.data.claims.length === 0) {
      if (typeof DEFAULT_REAL_CLAIMS !== 'undefined' && Array.isArray(DEFAULT_REAL_CLAIMS)) {
        this.data.claims = JSON.parse(JSON.stringify(DEFAULT_REAL_CLAIMS));
      } else {
        this.data.claims = [];
      }
    }

    const realIds = (typeof DEFAULT_REAL_CLAIMS !== 'undefined' && Array.isArray(DEFAULT_REAL_CLAIMS))
      ? new Set(DEFAULT_REAL_CLAIMS.map(c => c.id))
      : new Set();

    this.data.claims = this.data.claims.filter(c => {
      if (!c || !c.id) return false;
      if (c.id.startsWith('claim-demo-')) return false;
      if (c.id === 'claim-ms-01') return false;
      if (/^claim-barness-\d+$/.test(c.id)) return false;
      if (realIds.has(c.id)) return true;
      if (/^claim-\d{13,}-/.test(c.id)) return true;
      return false;
    });

    // Normalize and deduplicate Dr. Koffman / North Jersey Neuropsychology evaluation claims
    this.data.claims = this.data.claims.filter(c => {
      const p = (c.provider || '').toLowerCase();
      if (p.includes('neuro') || p.includes('koffman')) {
        c.provider = 'Dr. Koffman (North Jersey Neuropsychology)';
        // Purge obsolete draft entries (e.g. Oct 14 placeholder with $1457.76 billed amount)
        if (c.id !== 'claim-neuro-2025-10-15') {
          if (c.date === '2025-10-14' || c.date === '2025-10-15' || Math.abs((c.amountPaid || 0) - 1457.76) < 1 || Math.abs((c.amountPaid || 0) - 2375) < 1) {
            return false;
          }
        }
        if (c.id === 'claim-neuro-2025-10-15') {
          c.claimNumber = c.claimNumber || '20253272A0969';
          c.stage = 'settled';
          c.inBank = true;
          c.reimbursedAmount = 1457.76;
          c.reissueRequested = false;
          c.nextAction = 'Reconciled in bank ($1,457.76 deposited on 2026-10-23)';
        }
      }
      return true;
    });

    // Deduplicate Mindsoothers Jan 28, 2026 visit (remove older $157.50 unfiled draft in favor of verified $225 claim #2026036ML5580)
    this.data.claims = this.data.claims.filter(c => {
      const p = (c.provider || '').toLowerCase();
      if ((p.includes('mindsoother') || p.includes('mindsoothers')) && c.date === '2026-01-28') {
        if (c.id !== 'claim-ms-2026-01-28' || Math.abs((c.amountPaid || 0) - 157.5) < 1) {
          return false;
        }
      }
      return true;
    });

    // Normalize Mindsoother Jan 7, 14, 21 sessions (fix billed amount from 70% rate $157.50 to actual $225.00, est recovery to $157.50)
    this.data.claims.forEach(c => {
      const p = (c.provider || '').toLowerCase();
      if ((p.includes('mindsoother') || p.includes('mindsoothers')) && ['2026-01-07', '2026-01-14', '2026-01-21'].includes(c.date)) {
        c.provider = 'Mindsoother Therapy';
        if (Math.abs((c.amountPaid || 0) - 157.5) < 1) {
          c.amountPaid = 225.0;
          c.expectedRecovery = 157.5;
        }
        c.nextAction = 'Emailed Mindsoother requesting claim resubmission to Anthem — awaiting claim tracking IDs';
        if (!c.notes || c.notes.includes('Demo')) {
          c.notes = 'Therapy session ($225.00). Emailed Mindsoother requesting they resubmit claim to Anthem.';
        }
      }
    });

    // Deduplicate Dr. Barness Feb 2, 2026 visit (remove older $220 unverified draft in favor of verified $300 claim #20260462A0745)
    this.data.claims = this.data.claims.filter(c => {
      const p = (c.provider || '').toLowerCase();
      if ((p.includes('barness') || p.includes('mindful medicine')) && c.date === '2026-02-02') {
        if (c.id !== 'claim-barness-2026-02-02' || Math.abs((c.amountPaid || 0) - 220) < 1) {
          return false;
        }
      }
      return true;
    });

    // Sync seed updates for requested reissued checks and submitted Anthem claims
    const barnessSubmittedIds = new Set([
      'claim-barness-2026-09-15', 'claim-barness-2026-08-21',
      'claim-barness-2026-06-01', 'claim-barness-2026-05-04', 'claim-barness-2026-03-13',
      'claim-barness-2026-03-02'
    ]);

    this.data.claims.forEach(c => {
      if (barnessSubmittedIds.has(c.id)) {
        if (c.stage === 'ready_to_send') {
          c.stage = 'with_included_health';
          c.inPortal = true;
          c.nextAction = 'Submitted to Anthem — in review';
        }
      }
      if (c.id === 'claim-eval-2025-11') {
        if (!c.reissueRequested) {
          c.reissueRequested = true;
          c.nextAction = `Reissue requested from Anthem ($${(c.eobPlanPaid || c.expectedRecovery || 0).toFixed(2)}) — awaiting check arrival in mail`;
        }
      }
      if (c.id === 'claim-neuro-2025-10-15') {
        c.claimNumber = c.claimNumber || '20253272A0969';
        c.stage = 'settled';
        c.inBank = true;
        c.reimbursedAmount = 1457.76;
        c.reissueRequested = false;
        c.nextAction = 'Reconciled in bank ($1,457.76 deposited on 2026-10-23)';
      }
      if (c.id === 'claim-ms-2026-01-28') {
        c.claimNumber = c.claimNumber || '2026036ML5580';
        c.stage = 'settled';
        c.inBank = true;
        c.reimbursedAmount = 70.0;
        c.reissueRequested = false;
        c.nextAction = 'Reconciled in bank ($70.00 deposited on 2026-10-23)';
      }
      if (c.id === 'claim-barness-2026-10-13') {
        c.stage = 'settled';
        c.inBank = true;
        c.reimbursedAmount = 210.0;
        c.nextAction = 'Reconciled in bank ($210.00 deposited on 2026-10-26)';
      }
      if (c.id === 'claim-ms-2026-10-14') {
        c.stage = 'settled';
        c.inBank = true;
        c.reimbursedAmount = 157.5;
        c.nextAction = 'Reconciled in bank ($157.50 deposited on 2026-10-22)';
      }
      if (['claim-ms-2026-09-14', 'claim-ms-2026-09-16', 'claim-ms-2026-09-23'].includes(c.id)) {
        c.stage = 'settled';
        c.inBank = true;
        c.reimbursedAmount = 157.5;
        c.nextAction = 'Reconciled in bank ($157.50 deposited on 2026-09-28 via batch EFT TRN*1*34234)';
      }
      if (c.id === 'claim-barness-2026-02-02') {
        c.claimNumber = c.claimNumber || '20260462A0745';
        c.stage = 'settled';
        c.reimbursedAmount = 210.0;
        c.eobPlanPaid = 210.0;
        c.inBank = true;
        c.inPortal = true;
        c.reissueRequested = false;
        c.nextAction = 'Reconciled in bank ($210.00 ACH deposited on 2026-03-05)';
        if (c.notes && c.notes.includes('Missing Reimbursement Check')) {
          c.notes = 'Medication Management (CPT: 99214). Billed $300.00, Plan Paid $210.00 (Claim #20260462A0745). Reconciled against ACH direct deposit on 03/05/2026 (EFT Trace #3406481483).';
        }
      }
    });

    return this.data.claims;
  }

  getClaim(id) {
    return this.getClaims().find(c => c.id === id) || null;
  }

  addClaim(claimData) {
    if (!Array.isArray(this.data.claims)) this.data.claims = [];
    const amt = parseFloat(claimData.amountPaid) || 0;
    const expRecovery = claimData.expectedRecovery !== undefined 
      ? parseFloat(claimData.expectedRecovery) 
      : (parseFloat(claimData.reimbursedAmount) || (amt * 0.7));
    const newClaim = {
      id: 'claim-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      date: claimData.date || formatDateIso(new Date()),
      provider: (claimData.provider || '').trim() || 'Provider',
      patient: (claimData.patient || 'Xavier Healy').trim(),
      amountPaid: amt,
      expectedRecovery: expRecovery,
      submissionType: claimData.submissionType || 'provider', // 'provider' | 'self'
      payoutMethod: claimData.payoutMethod || 'direct_deposit', // 'direct_deposit' | 'check'
      superbillStatus: claimData.superbillStatus || 'have',
      stage: claimData.stage || (claimData.submissionType === 'provider' ? 'with_included_health' : 'ready_to_send'),
      inPortal: !!claimData.inPortal,
      inBank: !!claimData.inBank,
      claimNumber: claimData.claimNumber || '',
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
    let totalFloatingSpend = 0;
    let actionNeededCount = 0;
    let readyToSendCount = 0;
    let withIncludedHealthCount = 0;
    let checkDueCount = 0;
    let settledCount = 0;
    let totalSettled = 0;

    claims.forEach(c => {
      const amt = parseFloat(c.amountPaid) || 0;
      const rec = parseFloat(c.expectedRecovery !== undefined ? c.expectedRecovery : (c.eobPlanPaid !== undefined ? c.eobPlanPaid : amt * 0.7));
      if (c.stage === 'settled') {
        settledCount++;
        const recAmt = (c.reimbursedAmount !== undefined && c.reimbursedAmount !== null) 
          ? parseFloat(c.reimbursedAmount) 
          : amt;
        totalSettled += (isNaN(recAmt) ? 0 : recAmt);
      } else {
        totalFloatingSpend += amt;
        totalPendingRecovery += rec;
        if (c.stage === 'need_superbill' || c.stage === 'ready_to_send') {
          actionNeededCount++;
          if (c.stage === 'ready_to_send') readyToSendCount++;
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
      totalFloatingSpend,
      actionNeededCount,
      readyToSendCount,
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
    let csvContent = "data:text/csv;charset=utf-8,Date,Provider,Patient,Bill Amount,Expected Recovery,Reimbursed Amount,Submission By,Payout Method,Claim Number,Stage,Superbill Status,Next Action,Notes\n";
    this.getClaims().forEach(c => {
      const sub = (c.submissionType === 'provider') ? 'Provider (Courtesy)' : 'Self / Included Health';
      const payout = (c.payoutMethod === 'check') ? 'Mailed Check' : 'Direct Deposit';
      csvContent += `"${c.date}","${(c.provider || '').replace(/"/g, '""')}","${(c.patient || 'Xavier Healy').replace(/"/g, '""')}",${c.amountPaid || 0},${c.expectedRecovery !== undefined ? c.expectedRecovery : (c.amountPaid * 0.7)},${c.reimbursedAmount || 0},"${sub}","${payout}","${(c.claimNumber || '').replace(/"/g, '""')}","${c.stage}","${c.superbillStatus || 'have'}","${(c.nextAction || '').replace(/"/g, '""')}","${(c.notes || '').replace(/"/g, '""')}"\n`;
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
    let entry = this.data.zlogEntries[dateStr];

    // Safety recovery: check dedicated immutable backup if local state is missing or empty
    if (!entry || ((!entry.notes || !entry.notes.trim()) && (entry.rating === null || entry.rating === undefined))) {
      try {
        const backupStr = localStorage.getItem('ZLOG_ENTRY_BACKUP_' + dateStr);
        if (backupStr) {
          const backupObj = JSON.parse(backupStr);
          if (backupObj && ((backupObj.notes && backupObj.notes.trim()) || backupObj.rating !== null || (Array.isArray(backupObj.attachments) && backupObj.attachments.length > 0))) {
            entry = { ...(entry || {}), ...backupObj };
            this.data.zlogEntries[dateStr] = entry;
          }
        }
      } catch (e) {}
    }

    if (!entry) {
      entry = {
        date: dateStr,
        rating: null,
        aggression: false,
        notes: '',
        meds: { z: false, g: false, ris: false, rit: '', mag: false, mel: false, melDose: '' },
        attachments: []
      };
    }
    if (!entry.attachments) entry.attachments = [];
    return entry;
  }

  saveZLogEntry(dateStr, entryData) {
    if (!this.data.zlogEntries) this.data.zlogEntries = {};
    const current = this.getZLogEntry(dateStr);
    const updated = {
      ...current,
      ...entryData,
      date: dateStr,
      attachments: entryData.attachments || current.attachments || [],
      updatedAt: new Date().toISOString()
    };
    this.data.zlogEntries[dateStr] = updated;

    // Save dedicated immutable backup that survives any sync or cache clears
    try {
      localStorage.setItem('ZLOG_ENTRY_BACKUP_' + dateStr, JSON.stringify(updated));
    } catch (e) {}

    this.saveData();
    return this.data.zlogEntries[dateStr];
  }

  addZLogAttachment(dateStr, attachmentMeta) {
    const entry = this.getZLogEntry(dateStr);
    if (!entry.attachments) entry.attachments = [];
    // Prevent duplicate ID
    entry.attachments = entry.attachments.filter(a => a.id !== attachmentMeta.id);
    entry.attachments.push(attachmentMeta);
    return this.saveZLogEntry(dateStr, entry);
  }

  removeZLogAttachment(dateStr, attachmentId) {
    const entry = this.getZLogEntry(dateStr);
    if (entry.attachments) {
      entry.attachments = entry.attachments.filter(a => a.id !== attachmentId);
      return this.saveZLogEntry(dateStr, entry);
    }
    return entry;
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

  exportTitrationCSV(customRecords = null) {
    let list = Array.isArray(customRecords) ? customRecords : this.getTitrationHistory();
    if (!Array.isArray(list) || list.length === 0) {
      list = (typeof DEFAULT_TITRATION_HISTORY !== 'undefined') ? [...DEFAULT_TITRATION_HISTORY] : [];
    }
    const headers = ['Date', 'Medication', 'Dosage', 'Action', 'Prescriber', 'Clinical Notes', 'Context / Snapshot'];
    let csvRows = [headers.map(h => `"${h}"`).join(',')];
    list.forEach(r => {
      const row = [
        r.date || '',
        r.medication || '',
        r.dosage || '',
        r.action || '',
        r.prescriber || 'Dr Barness',
        (r.notes || '').replace(/\r?\n/g, ' '),
        (r.snapshot || '').replace(/\r?\n/g, ' ')
      ];
      csvRows.push(row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));
    });
    const csvContent = csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ZLog_Meds_Protocol_${formatDateIso(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    if (typeof showToast === 'function') {
      showToast(`Exported ${list.length} Meds & Protocol records as CSV`, 'success');
    }
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

  // --- Time-of-Day Goal Progress Pacers for Move & Stand ---
  getPacerSchedule() {
    if (!this.data.pacerSchedule || !this.data.pacerSchedule.weekday || !this.data.pacerSchedule.weekend) {
      this.data.pacerSchedule = {
        weekday: { start: 7, end: 21, label: 'Weekday · 7 AM – 9 PM' },
        weekend: { start: 9, end: 22, label: 'Weekend · 9 AM – 10 PM' }
      };
      this.saveData();
    }
    return this.data.pacerSchedule;
  }

  setPacerSchedule(schedule) {
    if (schedule && typeof schedule === 'object') {
      this.data.pacerSchedule = {
        weekday: schedule.weekday || { start: 7, end: 21, label: 'Weekday · 7 AM – 9 PM' },
        weekend: schedule.weekend || { start: 9, end: 22, label: 'Weekend · 9 AM – 10 PM' }
      };
      this.saveData();
    }
    return this.data.pacerSchedule;
  }

  // --- Cover Page: Unified Life Architecture & Focus Board (Now vs. Later) ---
  getCoverCampaigns() {
    const defaults = this.getDefaultState();
    if (!this.data.coverCampaigns || !this.data.coverCampaignsSeedVersion || this.data.coverCampaignsSeedVersion < 9) {
      if (!this.data.coverCampaigns) {
        this.data.coverCampaigns = JSON.parse(JSON.stringify(defaults.coverCampaigns));
      }
      this.data.coverCampaignsSeedVersion = 9;
      this.saveData();
    }
    if (!Array.isArray(this.data.coverCampaigns.now)) this.data.coverCampaigns.now = [];
    if (!Array.isArray(this.data.coverCampaigns.later)) this.data.coverCampaigns.later = [];

    // Ensure Chin hair is present in later if not already in now or later
    const hasChinHair = [...this.data.coverCampaigns.now, ...this.data.coverCampaigns.later].some(c =>
      c && (c.id === 'camp-chinhair' || (c.title || '').toLowerCase().trim() === 'chin hair')
    );
    if (!hasChinHair) {
      const chinHairDefault = defaults.coverCampaigns.later.find(c => c && c.id === 'camp-chinhair');
      if (chinHairDefault) {
        this.data.coverCampaigns.later.push(JSON.parse(JSON.stringify(chinHairDefault)));
        this.saveData();
      }
    }

    // Ensure Shoes is present in later if not already in now or later
    const hasShoes = [...this.data.coverCampaigns.now, ...this.data.coverCampaigns.later].some(c =>
      c && (c.id === 'camp-shoes' || (c.title || '').toLowerCase().trim() === 'shoes')
    );
    if (!hasShoes) {
      const shoesDefault = defaults.coverCampaigns.later.find(c => c && c.id === 'camp-shoes');
      if (shoesDefault) {
        this.data.coverCampaigns.later.push(JSON.parse(JSON.stringify(shoesDefault)));
        this.saveData();
      }
    }

    // Ensure Forehead lines is present in later if not already in now or later
    const hasForeheadLines = [...this.data.coverCampaigns.now, ...this.data.coverCampaigns.later].some(c =>
      c && (c.id === 'camp-foreheadline' || (c.title || '').toLowerCase().trim() === 'forehead lines')
    );
    if (!hasForeheadLines) {
      this.data.coverCampaigns.later.push({
        id: 'camp-foreheadline',
        title: 'Forehead lines',
        status: 'NS',
        theme: 'cat-care',
        tools: {
          margo: { label: 'Forehead Protocol' },
          apple: { noteQuery: '# BEAUTY 07_FOREHEAD' },
          google: { folder: 'Forehead Treatments & Research' },
          things: { query: 'Forehead Lines Protocol' },
          email: { emailQuery: 'Forehead Consults' }
        }
      });
      this.data.coverUpdatedAt = Date.now();
      this.saveData();
    }

    // Normalize any legacy statuses to IP, NS, Maintain, Done
    let updated = false;
    [...this.data.coverCampaigns.now, ...this.data.coverCampaigns.later].forEach(item => {
      if (!item) return;
      if (item.status === 'strike' || item.status === 'active') { item.status = 'IP'; updated = true; }
      else if (item.status === 'ondeck' || item.status === 'waiting') { item.status = 'NS'; updated = true; }
      else if (item.status === 'review') { item.status = 'Maintain'; updated = true; }
      else if (!['IP', 'NS', 'Maintain', 'Done'].includes(item.status)) {
        item.status = 'NS'; updated = true;
      }
      if (item && (item.id === 'camp-surgery' || (item.title || '').toLowerCase().trim() === 'surgery')) {
        if (!Array.isArray(item.visibleTools) || item.visibleTools.length !== 2 || !item.visibleTools.includes('apple') || !item.visibleTools.includes('things')) {
          item.tools = {
            apple: { noteQuery: '# HEALTH 02_SURGERY' },
            things: { query: 'Surgery Follow-up' }
          };
          item.visibleTools = ['apple', 'things'];
          updated = true;
        }
      }
      if (item && (item.id === 'camp-oon' || (item.title || '').toLowerCase().includes('reimb') || (item.title || '').toLowerCase() === 'oon reimbrsement')) {
        if (item.title !== 'oon') {
          item.title = 'oon';
          updated = true;
        }
      }
    });

    if (!this.data.coverMaintainSeedV2) {
      const targetTitles = ['oon', 'skincare', 'under eye bags'];
      const targetIds = ['camp-oon', 'camp-skincare', 'camp-undereye'];

      // Check later array first: promote them to now and set to Maintain
      for (let i = this.data.coverCampaigns.later.length - 1; i >= 0; i--) {
        const item = this.data.coverCampaigns.later[i];
        if (!item) continue;
        const t = (item.title || '').toLowerCase().trim();
        if (targetIds.includes(item.id) || targetTitles.some(x => t.includes(x)) || t.includes('reimb')) {
          item.status = 'Maintain';
          const [removed] = this.data.coverCampaigns.later.splice(i, 1);
          if (!this.data.coverCampaigns.now.some(x => x.id === removed.id || (x.title || '').toLowerCase().trim() === t)) {
            this.data.coverCampaigns.now.push(removed);
          }
          updated = true;
        }
      }

      // Check now array: ensure they have status Maintain
      this.data.coverCampaigns.now.forEach(item => {
        if (!item) return;
        const t = (item.title || '').toLowerCase().trim();
        if (targetIds.includes(item.id) || targetTitles.some(x => t.includes(x)) || t.includes('reimb')) {
          item.status = 'Maintain';
          updated = true;
        }
      });

      this.data.coverMaintainSeedV2 = true;
      this.data.coverUpdatedAt = Date.now();
      updated = true;
    }

    if (!this.data.coverMaintainSeedV3) {
      for (let i = this.data.coverCampaigns.later.length - 1; i >= 0; i--) {
        const item = this.data.coverCampaigns.later[i];
        if (!item) continue;
        const t = (item.title || '').toLowerCase().trim();
        if (item.id === 'camp-makeup' || t === 'makeup') {
          item.status = 'Maintain';
          const [removed] = this.data.coverCampaigns.later.splice(i, 1);
          if (!this.data.coverCampaigns.now.some(x => x.id === removed.id || (x.title || '').toLowerCase().trim() === t)) {
            this.data.coverCampaigns.now.push(removed);
          }
          updated = true;
        }
      }

      this.data.coverCampaigns.now.forEach(item => {
        if (!item) return;
        const t = (item.title || '').toLowerCase().trim();
        if (item.id === 'camp-makeup' || t === 'makeup') {
          item.status = 'Maintain';
          updated = true;
        }
      });

      this.data.coverMaintainSeedV3 = true;
      this.data.coverUpdatedAt = Date.now();
      updated = true;
    }

    if (updated) this.saveData();
    return this.data.coverCampaigns;
  }

  addCoverCampaign(targetList, itemData) {
    const campaigns = this.getCoverCampaigns();
    const listKey = (targetList === 'later') ? 'later' : 'now';
    const newCamp = {
      id: 'camp-' + Date.now(),
      title: (itemData.title || 'Untitled Focus').trim(),
      cat: itemData.cat || 'GROW',
      status: itemData.status || (listKey === 'now' ? 'IP' : 'NS'),
      visibleTools: Array.isArray(itemData.visibleTools) ? itemData.visibleTools : undefined,
      tools: Array.isArray(itemData.tools) ? itemData.tools : (itemData.tools || [
        { label: 'Apple Note', noteQuery: itemData.title }
      ])
    };
    campaigns[listKey].push(newCamp);
    this.data.coverUpdatedAt = Date.now();
    this.saveData();
    return newCamp;
  }

  moveCoverCampaign(id, fromList, toList) {
    const campaigns = this.getCoverCampaigns();
    const fromArr = campaigns[fromList] || [];
    const idx = fromArr.findIndex(x => x.id === id);
    if (idx !== -1) {
      const [item] = fromArr.splice(idx, 1);
      if (!campaigns[toList]) campaigns[toList] = [];
      if (toList === 'now' && (item.status === 'NS' || !item.status)) {
        item.status = 'IP';
      } else if (toList === 'later' && item.status === 'IP') {
        item.status = 'NS';
      }
      campaigns[toList].unshift(item);
      this.data.coverUpdatedAt = Date.now();
      this.saveData();
      return item;
    }
    return null;
  }

  deleteCoverCampaign(id, listName) {
    const campaigns = this.getCoverCampaigns();
    const arr = campaigns[listName] || [];
    const idx = arr.findIndex(x => x.id === id);
    if (idx !== -1) {
      arr.splice(idx, 1);
      this.data.coverUpdatedAt = Date.now();
      this.saveData();
    }
  }

  updateCoverCampaignStatus(id, newStatus) {
    const campaigns = this.getCoverCampaigns();
    let found = campaigns.now.find(x => x.id === id);
    if (!found) found = campaigns.later.find(x => x.id === id);
    if (found) {
      found.status = newStatus;
      this.data.coverUpdatedAt = Date.now();
      this.saveData();
    }
    return found;
  }

  // --- Cover Page: Top of Mind Scratchpad (Now vs. Later) ---
  getCoverTopMind() {
    if (!this.data.coverTopMind) {
      this.data.coverTopMind = { now: [], later: [] };
    }
    if (!Array.isArray(this.data.coverTopMind.now)) this.data.coverTopMind.now = [];
    if (!Array.isArray(this.data.coverTopMind.later)) this.data.coverTopMind.later = [];
    // Auto-update legacy Abbey Yung naming to AY
    this.data.coverTopMind.now.forEach(item => {
      if (item && item.text && item.text.includes('Abbey Yung')) {
        item.text = item.text.replace(/Abbey Yung/g, 'AY');
      }
    });
    this.data.coverTopMind.later.forEach(item => {
      if (item && item.text && item.text.includes('Abbey Yung')) {
        item.text = item.text.replace(/Abbey Yung/g, 'AY');
      }
    });
    return this.data.coverTopMind;
  }

  addCoverTopMindItem(targetList, text) {
    const listKey = (targetList === 'later') ? 'later' : 'now';
    const topMind = this.getCoverTopMind();
    const item = {
      id: 'tm-' + Date.now(),
      text: (text || '').trim()
    };
    if (item.text) {
      topMind[listKey].unshift(item);
      this.data.coverUpdatedAt = Date.now();
      this.saveData();
    }
    return item;
  }

  moveCoverTopMindItem(id, fromList, toList) {
    const topMind = this.getCoverTopMind();
    const fromArr = topMind[fromList] || [];
    const idx = fromArr.findIndex(x => x.id === id);
    if (idx !== -1) {
      const [item] = fromArr.splice(idx, 1);
      if (!topMind[toList]) topMind[toList] = [];
      topMind[toList].unshift(item);
      this.data.coverUpdatedAt = Date.now();
      this.saveData();
    }
  }

  deleteCoverTopMindItem(id, listName) {
    const topMind = this.getCoverTopMind();
    const arr = topMind[listName] || [];
    const idx = arr.findIndex(x => x.id === id);
    if (idx !== -1) {
      arr.splice(idx, 1);
      this.data.coverUpdatedAt = Date.now();
      this.saveData();
    }
  }

  updateCoverTopMindItem(id, listName, newText) {
    const topMind = this.getCoverTopMind();
    const arr = topMind[listName] || [];
    const item = arr.find(x => x.id === id);
    if (item) {
      item.text = (newText || '').trim();
      this.data.coverUpdatedAt = Date.now();
      this.saveData();
    }
  }

  // --- Cover Page: Where Info Lives (Topic Audits) ---
  getCoverTopicAudits() {
    if (!Array.isArray(this.data.coverTopicAudits)) {
      this.data.coverTopicAudits = [];
    }
    let changed = false;
    this.data.coverTopicAudits.forEach(a => {
      if (!a) return;
      const isSchool = a.topic && (a.topic.toLowerCase().includes('school') || a.topic.toLowerCase().includes('iep'));
      if (isSchool) {
        if (a.status !== 'streamlined') {
          a.status = 'streamlined';
          changed = true;
        }
        if (a.breakdown) {
          delete a.breakdown;
          changed = true;
        }
      } else {
        if (a.status !== 'disorganized') {
          a.status = 'disorganized';
          changed = true;
        }
      }
    });

    const hasSchool = this.data.coverTopicAudits.some(a => a && a.topic && (a.topic.toLowerCase().includes('school') || a.topic.toLowerCase().includes('iep')));
    if (!hasSchool) {
      this.data.coverTopicAudits.push({
        id: 'top-school-iep',
        topic: 'School Notes + IEP',
        tools: ['Apple notes', 'Google Drive', 'emails', 'Things 3'],
        status: 'streamlined'
      });
      changed = true;
    }

    if (changed) {
      this.saveData();
    }
    return this.data.coverTopicAudits;
  }

  addCoverTopicAudit(audit) {
    const audits = this.getCoverTopicAudits();
    const newAudit = {
      id: 'top-' + Date.now(),
      topic: (audit.topic || 'New Domain').trim(),
      tools: Array.isArray(audit.tools) ? audit.tools : (audit.tools ? String(audit.tools).split(',').map(s => s.trim()).filter(Boolean) : []),
      status: audit.status || 'in_progress',
      goal: (audit.goal || '').trim(),
      breakdown: audit.breakdown || []
    };
    audits.push(newAudit);
    this.data.coverUpdatedAt = Date.now();
    this.saveData();
    return newAudit;
  }

  updateCoverTopicAudit(id, updates) {
    const audits = this.getCoverTopicAudits();
    const item = audits.find(x => x.id === id);
    if (item) {
      if (updates.topic !== undefined) item.topic = updates.topic.trim();
      if (updates.tools !== undefined) item.tools = Array.isArray(updates.tools) ? updates.tools : String(updates.tools).split(',').map(s => s.trim()).filter(Boolean);
      if (updates.status !== undefined) item.status = updates.status;
      if (updates.goal !== undefined) item.goal = updates.goal.trim();
      if (updates.breakdown !== undefined) item.breakdown = updates.breakdown;
      this.data.coverUpdatedAt = Date.now();
      this.saveData();
    }
    return item;
  }

  deleteCoverTopicAudit(id) {
    const audits = this.getCoverTopicAudits();
    const idx = audits.findIndex(x => x.id === id);
    if (idx !== -1) {
      audits.splice(idx, 1);
      this.data.coverUpdatedAt = Date.now();
      this.saveData();
    }
  }


  /* --------------------------------------------------------------------------
     Personal Finance Hub Methods
     -------------------------------------------------------------------------- */
  getFinanceData() {
    const isLegacy = this.data.finance && (
      !this.data.finance.seedVersion ||
      this.data.finance.seedVersion < 8 ||
      (Array.isArray(this.data.finance.categories) && this.data.finance.categories.some(c => c && c.name === 'Housing & Rent / Mortgage'))
    );

    if (!this.data.finance || isLegacy) {
      // Check dedicated resilient backup first if not legacy
      if (!isLegacy) {
        try {
          const backup = localStorage.getItem('BOL_FINANCE_DATA_V2');
          if (backup) {
            const parsed = JSON.parse(backup);
            if (parsed && typeof parsed === 'object' && parsed.seedVersion >= 8) {
              this.data.finance = parsed;
              return this.data.finance;
            }
          }
        } catch (e) {}
      }

      this.data.finance = JSON.parse(JSON.stringify(typeof DEFAULT_FINANCE_DATA !== 'undefined' ? DEFAULT_FINANCE_DATA : {}));
      try {
        localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(this.data.finance));
      } catch (e) {}
      this.saveData();
      return this.data.finance;
    }

    if (this.data.finance && Array.isArray(this.data.finance.monthlySummaries)) {
      const oct = this.data.finance.monthlySummaries.find(m => m.month === '2026-10');
      if (oct && oct.outflow === 2638.11) {
        oct.outflow = 3303.11;
        try {
          localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(this.data.finance));
        } catch (e) {}
      }
    }

    // Seed v15 migration: Update full transactions, monthly summaries, and ensure wealthSweepPot
    if (this.data.finance && (!this.data.finance.seedVersion || this.data.finance.seedVersion < 15)) {
      this.data.finance.seedVersion = 15;
      if (typeof DEFAULT_FINANCE_DATA !== 'undefined') {
        if (Array.isArray(DEFAULT_FINANCE_DATA.transactions)) {
          this.data.finance.transactions = JSON.parse(JSON.stringify(DEFAULT_FINANCE_DATA.transactions));
        }
        if (Array.isArray(DEFAULT_FINANCE_DATA.monthlySummaries)) {
          this.data.finance.monthlySummaries = JSON.parse(JSON.stringify(DEFAULT_FINANCE_DATA.monthlySummaries));
        }
        if (DEFAULT_FINANCE_DATA.categoryBaselines) {
          this.data.finance.categoryBaselines = JSON.parse(JSON.stringify(DEFAULT_FINANCE_DATA.categoryBaselines));
        }
        if (Array.isArray(DEFAULT_FINANCE_DATA.categories)) {
          this.data.finance.categories = JSON.parse(JSON.stringify(DEFAULT_FINANCE_DATA.categories));
        }
        this.data.finance.monthlyTarget = DEFAULT_FINANCE_DATA.monthlyTarget || 18200;
        this.data.finance.savingsTarget = DEFAULT_FINANCE_DATA.savingsTarget || 3000;
        this.data.finance.incomeTarget = DEFAULT_FINANCE_DATA.incomeTarget || 22000;
        if (this.data.finance.wealthSweepPot === undefined) {
          this.data.finance.wealthSweepPot = 4258.30;
        }
      }
      try {
        localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(this.data.finance));
      } catch (e) {}
      this.saveData();
    }

    if (this.data.finance && (!this.data.finance.netWorth || !Array.isArray(this.data.finance.netWorth.accounts) || this.data.finance.netWorth.accounts.length === 0)) {
      if (typeof DEFAULT_NET_WORTH_DATA !== 'undefined') {
        this.data.finance.netWorth = JSON.parse(JSON.stringify(DEFAULT_NET_WORTH_DATA));
        try {
          localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(this.data.finance));
        } catch (e) {}
      }
    }

    if (this.data.finance && (!Array.isArray(this.data.finance.cardsROI) || this.data.finance.cardsROI.length === 0)) {
      if (typeof DEFAULT_FINANCE_CARDS_ROI !== 'undefined') {
        this.data.finance.cardsROI = JSON.parse(JSON.stringify(DEFAULT_FINANCE_CARDS_ROI));
        try {
          localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(this.data.finance));
        } catch (e) {}
      }
    }

    // Ensure Amex Plat fee is $895
    if (this.data.finance && Array.isArray(this.data.finance.cardsROI)) {
      const amex = this.data.finance.cardsROI.find(c => c.id === 'amex-plat');
      if (amex && amex.annualFee !== 895) {
        amex.annualFee = 895;
        try {
          localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(this.data.finance));
        } catch (e) {}
      }
    }

    if (this.data.finance && (!Array.isArray(this.data.finance.subscriptions) || this.data.finance.subscriptions.length === 0)) {
      if (typeof DEFAULT_FINANCE_SUBSCRIPTIONS !== 'undefined') {
        this.data.finance.subscriptions = JSON.parse(JSON.stringify(DEFAULT_FINANCE_SUBSCRIPTIONS));
        try {
          localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(this.data.finance));
        } catch (e) {}
      }
    }

    return this.data.finance;
  }

  saveFinanceData(data) {
    if (data && typeof data === 'object') data.updatedAt = Date.now();
    this.data.finance = data;
    try {
      localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(data));
    } catch (e) {}
    this.saveData();
    return this.data.finance;
  }

  isFinanceSundayUpdated(sundayIso) {
    const fin = this.getFinanceData();
    if (!fin.weeklySundayUpdates || typeof fin.weeklySundayUpdates !== 'object') {
      return false;
    }
    const iso = sundayIso || (typeof getSundayOfWeek === 'function' ? formatDateIso(getSundayOfWeek(new Date())) : 'current');
    return !!fin.weeklySundayUpdates[iso];
  }

  setFinanceSundayUpdated(sundayIso, isDone = true) {
    const fin = this.getFinanceData();
    if (!fin.weeklySundayUpdates || typeof fin.weeklySundayUpdates !== 'object') {
      fin.weeklySundayUpdates = {};
    }
    const iso = sundayIso || (typeof getSundayOfWeek === 'function' ? formatDateIso(getSundayOfWeek(new Date())) : 'current');
    fin.weeklySundayUpdates[iso] = !!isDone;
    fin.updatedAt = Date.now();
    try {
      localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin));
    } catch (e) {}
    this.saveData();
    return fin.weeklySundayUpdates[iso];
  }

  getFinanceWeeklyChecklist(sundayIso) {
    const fin = this.getFinanceData();
    if (!fin.weeklyChecklists || typeof fin.weeklyChecklists !== 'object') {
      fin.weeklyChecklists = {};
    }

    // Check dedicated resilient backup if empty
    if (Object.keys(fin.weeklyChecklists).length === 0) {
      try {
        const raw = localStorage.getItem('BOL_FINANCE_WEEKLY_CHECKLISTS');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            fin.weeklyChecklists = parsed;
          }
        }
      } catch (e) {}
    }

    const iso = sundayIso || (typeof getSundayOfWeek === 'function' ? formatDateIso(getSundayOfWeek(new Date())) : 'current');
    if (!fin.weeklyChecklists[iso] || typeof fin.weeklyChecklists[iso] !== 'object') {
      const wasDone = !!(fin.weeklySundayUpdates && fin.weeklySundayUpdates[iso]);
      fin.weeklyChecklists[iso] = { 1: wasDone, 2: wasDone, 3: wasDone, 4: wasDone, 5: wasDone };
    }
    return fin.weeklyChecklists[iso];
  }

  setFinanceWeeklyChecklistItem(sundayIso, itemNum, isDone) {
    const fin = this.getFinanceData();
    if (!fin.weeklyChecklists || typeof fin.weeklyChecklists !== 'object') {
      fin.weeklyChecklists = {};
    }
    const iso = sundayIso || (typeof getSundayOfWeek === 'function' ? formatDateIso(getSundayOfWeek(new Date())) : 'current');
    if (!fin.weeklyChecklists[iso] || typeof fin.weeklyChecklists[iso] !== 'object') {
      fin.weeklyChecklists[iso] = { 1: false, 2: false, 3: false, 4: false, 5: false };
    }
    fin.weeklyChecklists[iso][itemNum] = !!isDone;
    fin.updatedAt = Date.now();

    const allDone = [1, 2, 3, 4, 5].every(num => !!fin.weeklyChecklists[iso][num]);
    this.setFinanceSundayUpdated(iso, allDone);

    try {
      localStorage.setItem('BOL_FINANCE_WEEKLY_CHECKLISTS', JSON.stringify(fin.weeklyChecklists));
      localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin));
    } catch (e) {}
    this.saveData();
    return { checklist: fin.weeklyChecklists[iso], allDone };
  }

  getFinanceQuarterlyChecklist(quarterKey = '2026-Q3') {
    const fin = this.getFinanceData();
    if (!fin.quarterlyChecklists || typeof fin.quarterlyChecklists !== 'object') {
      fin.quarterlyChecklists = {};
    }
    const qKey = quarterKey || '2026-Q3';
    if (!fin.quarterlyChecklists[qKey]) {
      fin.quarterlyChecklists[qKey] = { 1: false, 2: false, 3: false, 4: false, 5: false };
    }
    return fin.quarterlyChecklists[qKey];
  }

  setFinanceQuarterlyChecklistItem(quarterKey = '2026-Q3', itemNum, isDone) {
    const fin = this.getFinanceData();
    if (!fin.quarterlyChecklists || typeof fin.quarterlyChecklists !== 'object') {
      fin.quarterlyChecklists = {};
    }
    const qKey = quarterKey || '2026-Q3';
    if (!fin.quarterlyChecklists[qKey]) {
      fin.quarterlyChecklists[qKey] = { 1: false, 2: false, 3: false, 4: false, 5: false };
    }
    fin.quarterlyChecklists[qKey][itemNum] = !!isDone;
    fin.updatedAt = Date.now();
    const allDone = [1, 2, 3, 4, 5].every(num => !!fin.quarterlyChecklists[qKey][num]);
    try {
      localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin));
    } catch (e) {}
    this.saveData();
    return { checklist: fin.quarterlyChecklists[qKey], allDone };
  }

  getFinanceAnnualChecklist(yearKey = '2026') {
    const fin = this.getFinanceData();
    if (!fin.annualChecklists || typeof fin.annualChecklists !== 'object') {
      fin.annualChecklists = {};
    }
    const yKey = yearKey || '2026';
    if (!fin.annualChecklists[yKey]) {
      fin.annualChecklists[yKey] = { 1: false, 2: false, 3: false, 4: false };
    }
    return fin.annualChecklists[yKey];
  }

  setFinanceAnnualChecklistItem(yearKey = '2026', itemNum, isDone) {
    const fin = this.getFinanceData();
    if (!fin.annualChecklists || typeof fin.annualChecklists !== 'object') {
      fin.annualChecklists = {};
    }
    const yKey = yearKey || '2026';
    if (!fin.annualChecklists[yKey]) {
      fin.annualChecklists[yKey] = { 1: false, 2: false, 3: false, 4: false };
    }
    fin.annualChecklists[yKey][itemNum] = !!isDone;
    fin.updatedAt = Date.now();
    const allDone = [1, 2, 3, 4].every(num => !!fin.annualChecklists[yKey][num]);
    try {
      localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin));
    } catch (e) {}
    this.saveData();
    return { checklist: fin.annualChecklists[yKey], allDone };
  }

  saveFinanceNetWorth(data) {
    const fin = this.getFinanceData();
    fin.netWorth = data;
    fin.updatedAt = Date.now();
    try {
      localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin));
    } catch (e) {}
    this.saveData();
    return fin.netWorth;
  }


  saveMonthlyCashFlowSummary(summary) {
    const fin = this.getFinanceData();
    if (!Array.isArray(fin.monthlySummaries)) fin.monthlySummaries = [];
    const idx = fin.monthlySummaries.findIndex(m => m.month === summary.month);
    if (idx !== -1) {
      fin.monthlySummaries[idx] = Object.assign(fin.monthlySummaries[idx], summary);
    } else {
      fin.monthlySummaries.unshift(summary);
    }
    fin.updatedAt = Date.now();
    try {
      localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin));
    } catch (e) {}
    this.saveData();
    return fin.monthlySummaries;
  }

  saveMonarchTransactions(transactions) {
    const fin = this.getFinanceData();
    // Keep up to 500 recent transactions to protect localStorage limits
    fin.transactions = Array.isArray(transactions) ? transactions.slice(0, 500) : [];
    fin.updatedAt = Date.now();
    try {
      localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin));
    } catch (e) {}
    this.saveData();
    return fin.transactions;
  }

  updateFinanceCategoryBudget(catId, newBudget) {
    const fin = this.getFinanceData();
    if (Array.isArray(fin.categories)) {
      const cat = fin.categories.find(c => c.id === catId);
      if (cat) {
        cat.budget = parseFloat(newBudget) || 0;
        fin.updatedAt = Date.now();
        this.saveData();
        return cat;
      }
    }
    return null;
  }

  updateFinanceCategoryBaseline(catName, newBaseline) {
    const fin = this.getFinanceData();
    if (!fin.categoryBaselines) fin.categoryBaselines = {};
    fin.categoryBaselines[catName] = parseFloat(newBaseline) || 0;
    fin.updatedAt = Date.now();
    this.saveData();
    return fin.categoryBaselines;
  }

  updateFinanceWealthSweepPot(newAmount) {
    const fin = this.getFinanceData();
    fin.wealthSweepPot = Math.max(0, parseFloat(newAmount) || 0);
    fin.updatedAt = Date.now();
    try {
      localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin));
    } catch (e) {}
    this.saveData();
    return fin.wealthSweepPot;
  }

  addFinanceSubscription(sub) {
    const fin = this.getFinanceData();
    if (!Array.isArray(fin.subscriptions)) fin.subscriptions = [];
    const newSub = {
      id: 'sub-' + Date.now(),
      name: (sub.name || '').trim(),
      cost: parseFloat(sub.cost) || 0,
      cadence: sub.cadence || 'monthly',
      category: sub.category || 'General',
      nextRenewal: sub.nextRenewal || '',
      status: sub.status || 'active',
      autoRenew: sub.autoRenew !== false,
      notes: (sub.notes || '').trim()
    };
    fin.subscriptions.push(newSub);
    fin.updatedAt = Date.now();
    this.saveData();
    return newSub;
  }

  updateFinanceSubscription(id, updates) {
    const fin = this.getFinanceData();
    if (Array.isArray(fin.subscriptions)) {
      const sub = fin.subscriptions.find(s => s.id === id);
      if (sub) {
        Object.assign(sub, updates);
        fin.updatedAt = Date.now();
        this.saveData();
        return sub;
      }
    }
    return null;
  }

  deleteFinanceSubscription(id) {
    const fin = this.getFinanceData();
    if (Array.isArray(fin.subscriptions)) {
      fin.subscriptions = fin.subscriptions.filter(s => s.id !== id);
      fin.updatedAt = Date.now();
      this.saveData();
    }
  }

  getFinanceCardsROI() {
    const fin = this.getFinanceData();
    // Ensure data is synced with the rich Google Sheet schema if benefits are missing periods
    const needsMigration = !Array.isArray(fin.cardsROI) || fin.cardsROI.length === 0 ||
      (fin.cardsROI[0] && (!fin.cardsROI[0].benefits || !fin.cardsROI[0].benefits[0].periods));

    if (needsMigration) {
      if (typeof DEFAULT_FINANCE_CARDS_ROI !== 'undefined') {
        fin.cardsROI = JSON.parse(JSON.stringify(DEFAULT_FINANCE_CARDS_ROI));
        try { localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin)); } catch (e) {}
        this.saveData();
      } else {
        return [];
      }
    }
    // Sync amex-ge with verified 2026 reimbursement if currently unclaimed in cache
    if (Array.isArray(fin.cardsROI)) {
      const amex = fin.cardsROI.find(c => c.id === 'amex-plat');
      if (amex && Array.isArray(amex.benefits)) {
        const ge = amex.benefits.find(b => b.id === 'amex-ge');
        if (ge && !ge.realized && ge.periods && !ge.periods.claim) {
          ge.periods.claim = true;
          ge.realized = true;
          ge.realizedValue = 120;
          try { localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin)); } catch (e) {}
        }
      }
    }
    return fin.cardsROI;
  }

  toggleFinanceCardBenefit(cardId, benefitId) {
    const fin = this.getFinanceData();
    const cards = this.getFinanceCardsROI();
    const card = cards.find(c => c.id === cardId);
    if (!card || !Array.isArray(card.benefits)) return null;
    const b = card.benefits.find(ben => ben.id === benefitId);
    if (!b) return null;
    b.realized = !b.realized;
    if (b.realized && (b.realizedValue === undefined || b.realizedValue === 0)) {
      b.realizedValue = b.maxVal;
      if (b.periods) {
        Object.keys(b.periods).forEach(k => b.periods[k] = true);
      }
    } else if (!b.realized) {
      b.realizedValue = 0;
      if (b.periods) {
        Object.keys(b.periods).forEach(k => b.periods[k] = false);
      }
    }
    fin.updatedAt = Date.now();
    try { localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin)); } catch (e) {}
    this.saveData();
    return b;
  }

  toggleFinanceCardPeriod(cardId, benefitId, periodKey) {
    const fin = this.getFinanceData();
    const cards = this.getFinanceCardsROI();
    const card = cards.find(c => c.id === cardId);
    if (!card || !Array.isArray(card.benefits)) return null;
    const b = card.benefits.find(ben => ben.id === benefitId);
    if (!b) return null;

    if (!b.periods) b.periods = {};
    b.periods[periodKey] = !b.periods[periodKey];

    // Recalculate realizedValue based on trackType and period values
    let calculated = 0;
    if (b.trackType === 'monthly') {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      months.forEach(m => {
        if (b.periods[m]) {
          const val = (b.periodValues && b.periodValues[m] !== undefined) ? b.periodValues[m] : (b.maxVal / 12);
          calculated += val;
        }
      });
      // Specific sheet match for Uber ($100 when Jan,Mar,Jun,Jul,Aug,Sep active)
      if (b.id === 'amex-uber') {
        const activeCount = months.filter(m => b.periods[m]).length;
        if (activeCount === 6 && b.periods.Jan && b.periods.Mar && b.periods.Jun && b.periods.Jul && b.periods.Aug && b.periods.Sep) {
          calculated = 100;
        }
      }
    } else if (b.trackType === 'quarterly') {
      const qKeys = Object.keys(b.periods);
      qKeys.forEach(q => {
        if (b.periods[q]) {
          const val = (b.periodValues && b.periodValues[q] !== undefined) ? b.periodValues[q] : (b.maxVal / 4);
          calculated += val;
        }
      });
    } else if (b.trackType === 'semi-annual') {
      ['H1', 'H2'].forEach(h => {
        if (b.periods[h]) {
          const val = (b.periodValues && b.periodValues[h] !== undefined) ? b.periodValues[h] : (b.maxVal / 2);
          calculated += val;
        }
      });
    } else if (b.trackType === 'annual' || b.trackType === 'multi-year') {
      calculated = b.periods[periodKey] ? b.maxVal : 0;
    } else if (b.trackType === 'status' || b.trackType === 'milestone') {
      calculated = b.periods[periodKey] ? b.maxVal : 0;
    }

    // Add any manual logged redemptions
    if (Array.isArray(b.redemptions) && b.redemptions.length > 0) {
      const manualSum = b.redemptions.reduce((acc, r) => acc + (parseFloat(r.amount) || 0), 0);
      calculated = Math.max(calculated, manualSum);
    }

    b.realizedValue = Math.round(calculated * 100) / 100;
    b.realized = b.realizedValue > 0;
    fin.updatedAt = Date.now();

    try { localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin)); } catch (e) {}
    this.saveData();
    return { card, benefit: b };
  }

  logFinanceCardRedemption(cardId, benefitId, redemption) {
    const fin = this.getFinanceData();
    const cards = this.getFinanceCardsROI();
    const card = cards.find(c => c.id === cardId);
    if (!card || !Array.isArray(card.benefits)) return null;
    const b = card.benefits.find(ben => ben.id === benefitId);
    if (!b) return null;

    if (!Array.isArray(b.redemptions)) b.redemptions = [];
    const newRedemption = {
      id: 'red-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      date: redemption.date || new Date().toISOString().split('T')[0],
      amount: parseFloat(redemption.amount) || 0,
      note: (redemption.note || '').trim(),
      merchant: (redemption.merchant || '').trim(),
      period: redemption.period || '',
      txId: redemption.txId || null,
      source: redemption.source || 'manual'
    };

    b.redemptions.unshift(newRedemption);

    // If period was specified, toggle that period on
    if (newRedemption.period && b.periods) {
      b.periods[newRedemption.period] = true;
    }

    // Update realized value
    b.realizedValue = (parseFloat(b.realizedValue) || 0) + newRedemption.amount;
    b.realized = true;
    fin.updatedAt = Date.now();

    try { localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin)); } catch (e) {}
    this.saveData();
    return newRedemption;
  }

  deleteFinanceCardRedemption(cardId, benefitId, redemptionId) {
    const fin = this.getFinanceData();
    const cards = this.getFinanceCardsROI();
    const card = cards.find(c => c.id === cardId);
    if (!card || !Array.isArray(card.benefits)) return null;
    const b = card.benefits.find(ben => ben.id === benefitId);
    if (!b || !Array.isArray(b.redemptions)) return null;

    const removed = b.redemptions.find(r => r.id === redemptionId);
    b.redemptions = b.redemptions.filter(r => r.id !== redemptionId);

    if (removed) {
      b.realizedValue = Math.max(0, (parseFloat(b.realizedValue) || 0) - (parseFloat(removed.amount) || 0));
      b.realized = b.realizedValue > 0;
    }
    fin.updatedAt = Date.now();

    try { localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin)); } catch (e) {}
    this.saveData();
    return true;
  }

  updateFinanceCardBenefitValue(cardId, benefitId, value) {
    const fin = this.getFinanceData();
    const cards = this.getFinanceCardsROI();
    const card = cards.find(c => c.id === cardId);
    if (!card || !Array.isArray(card.benefits)) return null;
    const b = card.benefits.find(ben => ben.id === benefitId);
    if (!b) return null;
    const val = Math.max(0, parseFloat(value) || 0);
    b.realizedValue = val;
    b.realized = val > 0;
    fin.updatedAt = Date.now();
    try { localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin)); } catch (e) {}
    this.saveData();
    return b;
  }

  resetFinanceCardsROI() {
    const fin = this.getFinanceData();
    if (typeof DEFAULT_FINANCE_CARDS_ROI !== 'undefined') {
      fin.cardsROI = JSON.parse(JSON.stringify(DEFAULT_FINANCE_CARDS_ROI));
      fin.updatedAt = Date.now();
      try { localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin)); } catch (e) {}
      this.saveData();
      return fin.cardsROI;
    }
    return [];
  }

  getFinanceSubscriptions() {
    const fin = this.getFinanceData();
    if (!Array.isArray(fin.subscriptions) || fin.subscriptions.length === 0) {
      if (typeof DEFAULT_FINANCE_SUBSCRIPTIONS !== 'undefined') {
        fin.subscriptions = JSON.parse(JSON.stringify(DEFAULT_FINANCE_SUBSCRIPTIONS));
        try { localStorage.setItem('BOL_FINANCE_DATA_V2', JSON.stringify(fin)); } catch (e) {}
        this.saveData();
      } else {
        return [];
      }
    }
    return fin.subscriptions;
  }


  updateFinanceAccount(accId, updates) {
    const fin = this.getFinanceData();
    if (Array.isArray(fin.accounts)) {
      const acc = fin.accounts.find(a => a.id === accId);
      if (acc) {
        Object.assign(acc, updates);
        acc.updated = (typeof formatDateIso === 'function') ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0];
        fin.updatedAt = Date.now();
        this.saveData();
        return acc;
      }
    }
    return null;
  }

  // --- Hobby Management Methods ---
  getHobbies() {
    if (!Array.isArray(this.data.hobbies) || this.data.hobbies.length === 0) {
      if (typeof DEFAULT_HOBBIES !== 'undefined' && Array.isArray(DEFAULT_HOBBIES)) {
        this.data.hobbies = JSON.parse(JSON.stringify(DEFAULT_HOBBIES));
        this.saveData();
      } else {
        this.data.hobbies = [];
      }
    }
    return this.data.hobbies;
  }

  getHobby(hobbyId) {
    return this.getHobbies().find(h => h.id === hobbyId);
  }

  updateHobbyStage(hobbyId, newStage) {
    const hobby = this.getHobby(hobbyId);
    if (!hobby) return null;
    hobby.stage = newStage;
    hobby.stageChangedAt = Date.now();
    if (newStage === 'trial') {
      if (!hobby.targetSessions) hobby.targetSessions = 4;
      if (!hobby.sessionsLogged) hobby.sessionsLogged = 0;
      if (!hobby.daysElapsed) hobby.daysElapsed = 1;
      if (!hobby.maxDays) hobby.maxDays = 30;
      hobby.trialStartedAt = Date.now();
    }
    this.data.hobbiesUpdatedAt = Date.now();
    this.saveData();
    return hobby;
  }

  logHobbySession(hobbyId, sessionData = {}) {
    const hobby = this.getHobby(hobbyId);
    if (!hobby) return null;
    hobby.sessionsLogged = (hobby.sessionsLogged || 0) + 1;
    if (!Array.isArray(hobby.sessionHistory)) hobby.sessionHistory = [];
    
    const entry = {
      date: sessionData.date || ((typeof formatDateIso === 'function') ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0]),
      notes: sessionData.notes || '',
      peace: Number(sessionData.peace) || 5,
      fun: Number(sessionData.fun) || 5,
      effort: Number(sessionData.effort) || 3,
      timestamp: Date.now()
    };
    hobby.sessionHistory.unshift(entry);
    if (sessionData.notes) {
      hobby.notes = sessionData.notes;
    }
    this.data.hobbiesUpdatedAt = Date.now();
    this.saveData();
    return { hobby, entry, completedTarget: (hobby.sessionsLogged >= (hobby.targetSessions || 4)) };
  }

  saveHobby(hobbyData) {
    if (!hobbyData) return null;
    const hobbies = this.getHobbies();
    let existing = hobbies.find(h => h.id === hobbyData.id);
    if (existing) {
      Object.assign(existing, hobbyData);
    } else {
      const newHobby = {
        id: hobbyData.id || `hby-${Date.now()}`,
        name: (hobbyData.name || '').trim(),
        category: hobbyData.category || 'creative',
        stage: hobbyData.stage || 'want',
        icon: hobbyData.icon || '✨',
        desc: hobbyData.desc || '',
        tags: hobbyData.tags || [],
        targetSessions: Number(hobbyData.targetSessions) || 4,
        sessionsLogged: Number(hobbyData.sessionsLogged) || 0,
        daysElapsed: Number(hobbyData.daysElapsed) || 1,
        maxDays: Number(hobbyData.maxDays) || 30,
        createdAt: Date.now()
      };
      hobbies.unshift(newHobby);
      existing = newHobby;
    }
    this.data.hobbiesUpdatedAt = Date.now();
    this.saveData();
    return existing;
  }

  deleteHobby(hobbyId) {
    const hobbies = this.getHobbies();
    const idx = hobbies.findIndex(h => h.id === hobbyId);
    if (idx !== -1) {
      hobbies.splice(idx, 1);
      this.data.hobbiesUpdatedAt = Date.now();
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Hobby Shortlist Methods (0 of 3 picked) ---
  getHobbyShortlist() {
    if (!Array.isArray(this.data.hobbyShortlist)) {
      this.data.hobbyShortlist = [];
      this.saveData();
    }
    return this.data.hobbyShortlist;
  }

  toggleHobbyShortlist(hobbyName) {
    const list = this.getHobbyShortlist();
    const idx = list.indexOf(hobbyName);
    if (idx !== -1) {
      list.splice(idx, 1);
    } else {
      if (list.length >= 3) {
        list.shift(); // keep max 3 slots
      }
      list.push(hobbyName);
    }
    this.data.hobbiesUpdatedAt = Date.now();
    this.saveData();
    return list;
  }

  removeFromHobbyShortlist(hobbyName) {
    const list = this.getHobbyShortlist();
    const idx = list.indexOf(hobbyName);
    if (idx !== -1) {
      list.splice(idx, 1);
      this.data.hobbiesUpdatedAt = Date.now();
      this.saveData();
    }
    return list;
  }

  /* ==========================================================================
     Kitchen Sanctuary & Saturday Meal Ritual Methods
     ========================================================================== */
  normalizeKitchenWeekDays(weekList) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const list = Array.isArray(weekList) ? [...weekList] : [];
    const toArr = (slot) => {
      if (!slot) return [];
      if (Array.isArray(slot)) return slot.filter(i => i && i.meal);
      if (slot.meal) return [slot];
      return [];
    };

    while (list.length < 7) {
      const idx = list.length;
      const dayName = dayNames[idx];
      list.push({
        day: dayName,
        date: '',
        meal: '',
        source: (dayName === 'Fri' || dayName === 'Sat') ? 'out' : 'fresh',
        icon: (dayName === 'Fri') ? 'takeout' : (dayName === 'Sat' ? 'bistro' : 'chicken'),
        recipeUrl: '',
        favoriteId: null,
        meals: { brunch: [], lunch: [], dinner: [], dessert: [] }
      });
    }

    list.forEach((d, idx) => {
      if (!d.day) d.day = dayNames[idx] || 'Day';
      const meals = (d.meals && typeof d.meals === 'object') ? d.meals : {};
      const dinnerArr = toArr(meals.dinner);
      // Migrate legacy single meal to dinner slot if dinner is empty
      if (dinnerArr.length === 0 && d.meal) {
        dinnerArr.push({
          meal: d.meal,
          source: d.source || 'fresh',
          icon: d.icon || 'chicken',
          recipeUrl: d.recipeUrl || '',
          favoriteId: d.favoriteId || null
        });
      }
      d.meals = {
        brunch: toArr(meals.brunch),
        lunch: toArr(meals.lunch),
        dinner: dinnerArr,
        dessert: toArr(meals.dessert)
      };

      // Keep legacy fields in sync with primary dinner entry
      if (dinnerArr.length > 0) {
        d.meal = dinnerArr[0].meal;
        d.source = dinnerArr[0].source || 'fresh';
        d.icon = dinnerArr[0].icon || 'chicken';
        d.recipeUrl = dinnerArr[0].recipeUrl || '';
      }
    });
    return list;
  }

  getCurrentSundayIso() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun
    const sun = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
    const yr = sun.getFullYear();
    const mo = String(sun.getMonth() + 1).padStart(2, '0');
    const da = String(sun.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${da}`;
  }

  makeEmptyKitchenWeek() {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames.map(dayName => ({
      day: dayName,
      date: '',
      meal: '',
      source: (dayName === 'Fri' || dayName === 'Sat') ? 'out' : 'fresh',
      icon: (dayName === 'Fri') ? 'takeout' : (dayName === 'Sat' ? 'bistro' : 'chicken'),
      recipeUrl: '',
      favoriteId: null,
      meals: { brunch: [], lunch: [], dinner: [], dessert: [] }
    }));
  }

  checkAndRolloverKitchenWeek() {
    if (!this.data.kitchenData || typeof this.data.kitchenData !== 'object') {
      this.data.kitchenData = this.getDefaultKitchenData();
    }
    const kd = this.data.kitchenData;
    const curSunIso = this.getCurrentSundayIso();

    const hasMeals = (schedule) => {
      if (!Array.isArray(schedule)) return false;
      return schedule.some(d => {
        if (d.meal && d.meal.trim() !== '') return true;
        if (d.meals && typeof d.meals === 'object') {
          return ['brunch', 'lunch', 'dinner', 'dessert'].some(t => {
            const slots = d.meals[t];
            if (Array.isArray(slots)) return slots.some(s => s && s.meal && s.meal.trim() !== '');
            return Boolean(slots && slots.meal && slots.meal.trim() !== '');
          });
        }
        return false;
      });
    };

    let changed = false;

    if (!kd.currentWeekSundayIso) {
      // First run with automatic rollover tracking
      if (hasMeals(kd.followingWeekSchedule)) {
        // Meals were planned in upcoming week; promote them to this week
        kd.previousWeekSchedule = JSON.parse(JSON.stringify(kd.weekSchedule || []));
        kd.weekSchedule = JSON.parse(JSON.stringify(kd.followingWeekSchedule));
        kd.followingWeekSchedule = this.makeEmptyKitchenWeek();
        kd.activeWeekOffset = 0;
        changed = true;
      }
      kd.currentWeekSundayIso = curSunIso;
      changed = true;
    } else if (kd.currentWeekSundayIso !== curSunIso) {
      const prevSun = new Date(kd.currentWeekSundayIso + 'T00:00:00');
      const curSun = new Date(curSunIso + 'T00:00:00');
      const diffMs = curSun.getTime() - prevSun.getTime();
      const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));

      if (diffWeeks === 1) {
        kd.previousWeekSchedule = JSON.parse(JSON.stringify(kd.weekSchedule || []));
        kd.weekSchedule = JSON.parse(JSON.stringify(kd.followingWeekSchedule || this.makeEmptyKitchenWeek()));
        kd.followingWeekSchedule = this.makeEmptyKitchenWeek();
        kd.activeWeekOffset = 0;
        kd.currentWeekSundayIso = curSunIso;
        changed = true;
      } else if (diffWeeks > 1) {
        kd.previousWeekSchedule = JSON.parse(JSON.stringify(kd.weekSchedule || []));
        kd.weekSchedule = this.makeEmptyKitchenWeek();
        kd.followingWeekSchedule = this.makeEmptyKitchenWeek();
        kd.activeWeekOffset = 0;
        kd.currentWeekSundayIso = curSunIso;
        changed = true;
      } else {
        kd.currentWeekSundayIso = curSunIso;
        changed = true;
      }
    }

    if (changed) {
      this.data.kitchenUpdatedAt = Date.now();
      this.saveData();
    }
    return changed;
  }

  rolloverKitchenWeekNow() {
    if (!this.data.kitchenData || typeof this.data.kitchenData !== 'object') {
      this.data.kitchenData = this.getDefaultKitchenData();
    }
    const kd = this.data.kitchenData;
    const now = new Date();
    const day = now.getDay();
    // If manual rollover is done on Friday or Saturday, it targets the upcoming Sunday week
    let targetSun;
    if (day === 5 || day === 6) {
      targetSun = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - day));
    } else {
      targetSun = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
    }
    const yr = targetSun.getFullYear();
    const mo = String(targetSun.getMonth() + 1).padStart(2, '0');
    const da = String(targetSun.getDate()).padStart(2, '0');
    const targetSunIso = `${yr}-${mo}-${da}`;

    kd.previousWeekSchedule = JSON.parse(JSON.stringify(kd.weekSchedule || []));
    kd.weekSchedule = JSON.parse(JSON.stringify(kd.followingWeekSchedule || this.makeEmptyKitchenWeek()));
    kd.followingWeekSchedule = this.makeEmptyKitchenWeek();
    kd.currentWeekSundayIso = targetSunIso;
    kd.activeWeekOffset = 0;
    this.data.kitchenUpdatedAt = Date.now();
    this.saveData();
    return kd;
  }

  getDefaultKitchenData() {
    return {
      currentWeekSundayIso: this.getCurrentSundayIso(),
      stashItems: [],
      eatOutTarget: 1,
      selectedHopperIngredients: [],
      weekSchedule: this.makeEmptyKitchenWeek(),
      followingWeekSchedule: this.makeEmptyKitchenWeek(),
      activeWeekOffset: 0,
      activeMealFilter: 'all',
      vaultFilter: 'all',
      favoriteRecipes: [
        {
          id: 'r-buffalo-jack-salad',
          title: 'Buffalo Jack Salad',
          icon: 'salad',
          course: 'main',
          tags: ['custom'],
          recipeUrl: '',
          ingredients: 'Romaine lettuce, breaded buffalo chicken, pepper jack cheese, seasoned croutons, beets, chickpeas & chipotle aioli (no tomatoes)',
          stashMatch: null
        },
        {
          id: 'r-kale-salad',
          title: 'Kale Salad',
          icon: 'salad',
          course: 'side',
          tags: [],
          recipeUrl: '',
          ingredients: 'Shredded kale, carrots & red cabbage tossed with Granny Smith apples, croutons, chickpeas, bacon, sunflower seeds, red onions, Grana Padano cheese & an apple cider vinaigrette',
          stashMatch: null
        },
        {
          id: 'r-salmon-broccoli',
          title: 'Roasted Salmon with Broccoli',
          icon: 'salmon',
          course: 'main',
          tags: [],
          recipeUrl: 'https://cooking.nytimes.com/recipes/1020083-sheet-pan-salmon',
          ingredients: 'Salmon fillets, broccoli, sweet potatoes, olive oil, lemon',
          stashMatch: 'Salmon fillets'
        },
        {
          id: 'r-taco-bowls',
          title: 'Turkey & Black Bean Taco Bowls',
          icon: 'taco',
          course: 'main',
          tags: [],
          recipeUrl: 'https://pinchofyum.com/turkey-taco-bowls',
          ingredients: 'Ground turkey, black beans, salsa, tortillas, avocado, cilantro',
          stashMatch: 'Ground Turkey'
        },
        {
          id: 'r-parmesan-risotto',
          title: 'Creamy Parmesan Risotto',
          icon: 'risotto',
          course: 'side',
          tags: [],
          recipeUrl: 'https://www.seriouseats.com/pressure-cooker-mushroom-risotto-recipe',
          ingredients: 'Arborio rice, bone broth, parmesan wedge, baby spinach',
          stashMatch: 'Arborio risotto rice'
        },
        {
          id: 'r-sheet-pan-chicken',
          title: 'Sheet Pan Herb Chicken',
          icon: 'chicken',
          course: 'main',
          tags: [],
          recipeUrl: 'https://www.eatwell101.com/sheet-pan-lemon-herb-chicken',
          ingredients: 'Chicken breasts, bell peppers, zucchini, lemon, oregano',
          stashMatch: null
        },
        {
          id: 'r-raos-penne',
          title: 'Rao\'s Penne with Spinach',
          icon: 'pasta',
          course: 'main',
          tags: [],
          recipeUrl: 'https://raos.com/blogs/recipes/penne-alla-vodka',
          ingredients: 'Penne pasta, Rao\'s marinara, baby spinach, parmesan',
          stashMatch: 'Rao\'s Marinara & Penne'
        },
        {
          id: 'r-spanish-rice',
          title: 'Spanish Rice',
          icon: 'risotto',
          course: 'side',
          tags: [],
          recipeUrl: '',
          ingredients: 'Rice, tomato sauce, diced tomatoes, onion, garlic, broth, cumin & taco spices',
          stashMatch: null
        },
        {
          id: 'r-homemade-pizza',
          title: 'Homemade Pizza with Salami',
          icon: 'pizza',
          course: 'main',
          tags: [],
          recipeUrl: '',
          ingredients: 'Pizza dough, pizza sauce, mozzarella cheese, sliced salami',
          stashMatch: null
        },
        {
          id: 'r-friday-pizza',
          title: 'Friday Night Pizza / Takeout',
          icon: 'pizza',
          course: 'main',
          tags: [],
          recipeUrl: '',
          ingredients: 'Local pizzeria or favorite takeout Thai / Ramen',
          stashMatch: null
        },
        {
          id: 'r-weekend-pancakes',
          title: 'Fluffy Weekend Pancakes & Berries',
          icon: 'brunch',
          course: 'brunch',
          tags: [],
          recipeUrl: '',
          ingredients: 'Flour, eggs, milk, butter, pure maple syrup, fresh blueberries & strawberries',
          stashMatch: null
        },
        {
          id: 'r-berry-crumble',
          title: 'Warm Berry Crumble',
          icon: 'dessert',
          course: 'dessert',
          tags: [],
          recipeUrl: '',
          ingredients: 'Blueberries, blackberries, rolled oats, butter, brown sugar, cinnamon, vanilla ice cream',
          stashMatch: null
        }
      ],
      newRecipes: [
        {
          id: 'r-new-chickpea-wrap',
          title: 'Crispy Chickpea & Avocado Wrap',
          icon: 'salad',
          course: 'main',
          tags: [],
          recipeUrl: '',
          ingredients: 'Tortillas, roasted seasoned chickpeas, mashed avocado, cucumbers, microgreens, tahini drizzle',
          stashMatch: null
        }
      ],
      groceries: [
        { id: 'g-hashbrowns', text: 'Hash browns', checked: false }
      ]
    };
  }

  getKitchenData() {
    if (!this.data.kitchenData || typeof this.data.kitchenData !== 'object') {
      this.data.kitchenData = this.getDefaultKitchenData();
      this.saveData();
    } else {
      // Auto rollover check whenever kitchen data is retrieved
      this.checkAndRolloverKitchenWeek();

      const kd = this.data.kitchenData;
      // Ensure multi-meal schedule & following week support
      kd.weekSchedule = this.normalizeKitchenWeekDays(kd.weekSchedule);
      kd.followingWeekSchedule = this.normalizeKitchenWeekDays(kd.followingWeekSchedule);
      if (typeof kd.activeWeekOffset !== 'number') kd.activeWeekOffset = 0;
      if (!kd.activeMealFilter) kd.activeMealFilter = 'all';
      if (!kd.vaultFilter) kd.vaultFilter = 'all';
      if (!Array.isArray(kd.newRecipes)) kd.newRecipes = [];

      // Update eat-out target to 1x per week
      if (!this.data.kitchenEatOutTargetV1Updated) {
        kd.eatOutTarget = 1;
        this.data.kitchenEatOutTargetV1Updated = true;
        this.saveData();
      }

      // Ensure recipes have course property (main, side, brunch, dessert) and clean duplicate course tags
      const detectCourse = (r) => {
        if (r.course) return r.course;
        const text = `${r.title || ''} ${(r.tags || []).join(' ')} ${r.ingredients || ''}`.toLowerCase();
        if (text.includes('brunch') || text.includes('pancake') || text.includes('waffle') || text.includes('omelet') || text.includes('crepe') || text.includes('french toast') || text.includes('scramble') || text.includes('quiche')) return 'brunch';
        if (text.includes('dessert') || text.includes('cake') || text.includes('cookie') || text.includes('pie') || text.includes('ice cream') || text.includes('tart') || text.includes('brownie') || text.includes('sweet') || text.includes('parfait')) return 'dessert';
        if (text.includes('side') || text.includes('salad') || text.includes('slaw') || text.includes('rice') || text.includes('potato') || text.includes('greens') || text.includes('veggie') || text.includes('dip')) return 'side';
        return 'main';
      };

      const cleanCourseTags = (r) => {
        if (Array.isArray(r.tags)) {
          r.tags = r.tags.filter(t => !['main', 'side', 'brunch', 'dessert', 'favorite'].includes(t.toLowerCase()));
        }
      };

      if (Array.isArray(kd.favoriteRecipes)) {
        kd.favoriteRecipes.forEach(r => {
          if (!r.course) r.course = detectCourse(r);
          cleanCourseTags(r);
        });
      }
      if (Array.isArray(kd.newRecipes)) {
        kd.newRecipes.forEach(r => {
          if (!r.course) r.course = detectCourse(r);
          cleanCourseTags(r);
        });
      }

      // Migrate aracula/arugula, strawberry, blueberry to fridge (one-time preserved)
      if (Array.isArray(kd.stashItems)) {
        const fridgeTargets = new Set(['aracula', 'arugula', 'strawberry', 'strawberries', 'blueberry', 'blueberries']);
        let foundBlueberry = false;
        kd.stashItems.forEach(item => {
          const n = (item.name || '').toLowerCase().trim();
          if (fridgeTargets.has(n) && !item.manuallySet) {
            item.type = 'fridge';
            item.badge = 'Fridge';
          }
          if (n === 'blueberry' || n === 'blueberries') {
            foundBlueberry = true;
          }
        });
        if (!foundBlueberry && !this.data.kitchenBlueberryAdded) {
          kd.stashItems.push({
            id: 's-' + Date.now(),
            type: 'fridge',
            name: 'blueberry',
            badge: 'Fridge',
            used: false
          });
          this.data.kitchenBlueberryAdded = true;
          this.saveData();
        }

        // Move the second broccoli to freezer while keeping first in fridge
        if (!this.data.kitchenSecondBroccoliFreezerV1) {
          let broccoliIdx = 0;
          kd.stashItems.forEach(item => {
            const n = (item.name || '').toLowerCase().trim();
            if (n === 'broccoli') {
              broccoliIdx++;
              if (broccoliIdx >= 2) {
                item.type = 'freezer';
                item.badge = 'Freezer';
              } else {
                item.type = 'fridge';
                item.badge = 'Fridge';
              }
            }
          });
          this.data.kitchenSecondBroccoliFreezerV1 = true;
          this.saveData();
        }
      }

      // Sanitize meals: remove legacy pantry source tag from meals (e.g. Leftovers)
      const sanitizeMealSources = (schedule) => {
        if (!Array.isArray(schedule)) return;
        schedule.forEach(d => {
          if (d.source === 'pantry') d.source = 'fresh';
          if (d.meals) {
            ['brunch', 'lunch', 'dinner', 'dessert'].forEach(t => {
              if (Array.isArray(d.meals[t])) {
                d.meals[t].forEach(item => {
                  if (item && item.source === 'pantry') item.source = 'fresh';
                });
              } else if (d.meals[t] && d.meals[t].source === 'pantry') {
                d.meals[t].source = 'fresh';
              }
            });
          }
        });
      };
      sanitizeMealSources(kd.weekSchedule);
      sanitizeMealSources(kd.followingWeekSchedule);

      // Purge any legacy sample/placeholder records if still present in storage
      if (!this.data.kitchenSampleClearedV3) {
        const sampleStashIds = new Set(['s1', 's2', 's3', 's4', 's5', 's6']);
        const sampleFavIds = new Set(['r1', 'r2', 'r3', 'r4', 'r5', 'r7']);
        const sampleMeals = new Set([
          'roasted salmon with sweet potatoes & broccoli',
          'ground turkey & black bean taco bowls',
          'creamy mushroom & parmesan risotto',
          'sheet pan lemon herb chicken & veggies',
          'rao\'s penne pasta with spinach & ricotta',
          'friday night takeout (wood-fired pizza / thai)',
          'neighborhood bistro or date night out'
        ]);

        if (Array.isArray(kd.stashItems)) {
          kd.stashItems = kd.stashItems.filter(i => {
            const n = (i.name || '').toLowerCase().trim();
            return !sampleStashIds.has(i.id) && !n.includes('salmon fillets') && !n.includes('chick pea') && !n.includes('chickpea');
          });
        }
        if (Array.isArray(kd.favoriteRecipes)) {
          kd.favoriteRecipes = kd.favoriteRecipes.filter(r => {
            const t = (r.title || '').toLowerCase().trim();
            return !sampleFavIds.has(r.id) && t !== 'noodles' && !t.includes('chick pea') && !t.includes('chickpea') && !t.includes('roasted salmon with broccoli');
          });
        }
        if (Array.isArray(kd.groceries)) {
          kd.groceries = kd.groceries.filter(g => {
            const t = (g.text || '').toLowerCase().trim();
            return !t.includes('chick pea') && !t.includes('chickpea');
          });
        }
        if (Array.isArray(kd.weekSchedule)) {
          kd.weekSchedule.forEach(d => {
            const m = (d.meal || '').toLowerCase().trim();
            if (sampleMeals.has(m) || sampleFavIds.has(d.favoriteId) || m.includes('chick pea') || m.includes('chickpea')) {
              d.meal = '';
              d.recipeUrl = '';
              d.favoriteId = null;
              if (d.meals) d.meals.dinner = null;
            }
          });
        }
        kd.selectedHopperIngredients = [];
        if (!Array.isArray(kd.groceries)) kd.groceries = [];
        this.data.kitchenSampleClearedV3 = true;
        this.saveData();
      }

      // Ensure Hash browns is seeded in the grocery list
      if (!this.data.kitchenHashBrownAdded) {
        if (!Array.isArray(kd.groceries)) kd.groceries = [];
        const exists = kd.groceries.some(g => (g.text || '').toLowerCase().includes('hash brown'));
        if (!exists) {
          kd.groceries.push({
            id: 'g-hashbrowns-' + Date.now(),
            text: 'Hash browns',
            checked: false
          });
          this.data.kitchenUpdatedAt = Date.now();
        }
        this.data.kitchenHashBrownAdded = true;
        this.saveData();
      }

      // Seed this week's dinners and shopping list
      if (!this.data.kitchenDinnersNov2026Seeded) {
        const plannedWeek = [
          {
            day: 'Sun',
            meal: 'Spanish rice',
            source: 'fresh',
            icon: 'risotto',
            recipeUrl: '',
            favoriteId: null,
            meals: {
              brunch: [],
              lunch: [],
              dinner: [{ meal: 'Spanish rice', source: 'fresh', icon: 'risotto', recipeUrl: '', favoriteId: null }],
              dessert: []
            }
          },
          {
            day: 'Mon',
            meal: 'Home made pizza with salami',
            source: 'fresh',
            icon: 'pizza',
            recipeUrl: '',
            favoriteId: null,
            meals: {
              brunch: [],
              lunch: [],
              dinner: [{ meal: 'Home made pizza with salami', source: 'fresh', icon: 'pizza', recipeUrl: '', favoriteId: null }],
              dessert: []
            }
          },
          {
            day: 'Tue',
            meal: 'Tacos soft Shell with shredded lettuce and ground turkey',
            source: 'fresh',
            icon: 'taco',
            recipeUrl: '',
            favoriteId: null,
            meals: {
              brunch: [],
              lunch: [],
              dinner: [{ meal: 'Tacos soft Shell with shredded lettuce and ground turkey', source: 'fresh', icon: 'taco', recipeUrl: '', favoriteId: null }],
              dessert: []
            }
          },
          {
            day: 'Wed',
            meal: 'Salad with grilled chicken and cucumbers, tomatoes, chickpeas, bacon',
            source: 'fresh',
            icon: 'salad',
            recipeUrl: '',
            favoriteId: null,
            meals: {
              brunch: [],
              lunch: [],
              dinner: [{ meal: 'Salad with grilled chicken and cucumbers, tomatoes, chickpeas, bacon', source: 'fresh', icon: 'salad', recipeUrl: '', favoriteId: null }],
              dessert: []
            }
          },
          {
            day: 'Thu',
            meal: 'Chicken nuggets, veggies, stuff from freezer and pantry',
            source: 'freezer',
            icon: 'chicken',
            recipeUrl: '',
            favoriteId: null,
            meals: {
              brunch: [],
              lunch: [],
              dinner: [{ meal: 'Chicken nuggets, veggies, stuff from freezer and pantry', source: 'freezer', icon: 'chicken', recipeUrl: '', favoriteId: null }],
              dessert: []
            }
          },
          {
            day: 'Fri',
            meal: 'Takeout / Eat Out',
            source: 'out',
            icon: 'takeout',
            recipeUrl: '',
            favoriteId: null,
            meals: {
              brunch: [],
              lunch: [],
              dinner: [{ meal: 'Takeout / Eat Out', source: 'out', icon: 'takeout', recipeUrl: '', favoriteId: null }],
              dessert: []
            }
          },
          {
            day: 'Sat',
            meal: '',
            source: 'fresh',
            icon: 'chicken',
            recipeUrl: '',
            favoriteId: null,
            meals: { brunch: [], lunch: [], dinner: [], dessert: [] }
          }
        ];

        kd.weekSchedule = JSON.parse(JSON.stringify(plannedWeek));
        kd.followingWeekSchedule = JSON.parse(JSON.stringify(plannedWeek));

        kd.groceries = [
          { id: 'g-peas', text: 'Peas', checked: false },
          { id: 'g-edamame', text: 'Edamame', checked: false },
          { id: 'g-rice', text: 'Rice (for Spanish rice)', checked: false },
          { id: 'g-tomatoes-sauce', text: 'Tomato sauce / diced tomatoes', checked: false },
          { id: 'g-pizzadough', text: 'Pizza dough', checked: false },
          { id: 'g-pizzasauce', text: 'Pizza sauce', checked: false },
          { id: 'g-mozzarella', text: 'Mozzarella cheese', checked: false },
          { id: 'g-salami', text: 'Salami', checked: false },
          { id: 'g-tacoshells', text: 'Soft taco shells', checked: false },
          { id: 'g-groundturkey', text: 'Ground turkey', checked: false },
          { id: 'g-tacoseasoning', text: 'Taco seasoning', checked: false },
          { id: 'g-shreddedlettuce', text: 'Shredded lettuce', checked: false },
          { id: 'g-chickenbreast', text: 'Chicken breasts', checked: false },
          { id: 'g-saladgreens', text: 'Salad greens / romaine', checked: false },
          { id: 'g-cucumbers', text: 'Cucumbers', checked: false },
          { id: 'g-tomatoes', text: 'Tomatoes', checked: false },
          { id: 'g-chickpeas', text: 'Chickpeas', checked: false },
          { id: 'g-bacon', text: 'Bacon', checked: false },
          { id: 'g-chickennuggets', text: 'Chicken nuggets', checked: false },
          { id: 'g-veggies', text: 'Veggies (freezer/pantry)', checked: false }
        ];

        this.data.kitchenDinnersNov2026Seeded = true;
        this.data.kitchenUpdatedAt = Date.now();
        this.saveData();
      }

      // Ensure Kale Salad is seeded in Favorites Vault
      if (!this.data.kitchenKaleSaladSeeded) {
        if (!Array.isArray(kd.favoriteRecipes)) kd.favoriteRecipes = [];
        const exists = kd.favoriteRecipes.some(r => (r.title || '').toLowerCase().includes('kale salad'));
        if (!exists) {
          kd.favoriteRecipes.unshift({
            id: 'r-kale-salad-' + Date.now(),
            title: 'Kale Salad',
            icon: 'salad',
            course: 'side',
            tags: [],
            recipeUrl: '',
            ingredients: 'Shredded kale, carrots & red cabbage tossed with Granny Smith apples, croutons, chickpeas, bacon, sunflower seeds, red onions, Grana Padano cheese & an apple cider vinaigrette',
            stashMatch: null
          });
          this.data.kitchenUpdatedAt = Date.now();
        }
        this.data.kitchenKaleSaladSeeded = true;
        this.saveData();
      }

      // Ensure Buffalo Jack Salad is seeded in Favorites Vault
      if (!this.data.kitchenBuffaloJackSeeded) {
        if (!Array.isArray(kd.favoriteRecipes)) kd.favoriteRecipes = [];
        const exists = kd.favoriteRecipes.some(r => (r.title || '').toLowerCase().includes('buffalo jack'));
        if (!exists) {
          kd.favoriteRecipes.unshift({
            id: 'r-buffalo-jack-' + Date.now(),
            title: 'Buffalo Jack Salad',
            icon: 'salad',
            course: 'main',
            tags: ['custom'],
            recipeUrl: '',
            ingredients: 'Romaine lettuce, breaded buffalo chicken, pepper jack cheese, seasoned croutons, beets, chickpeas & chipotle aioli (no tomatoes)',
            stashMatch: null
          });
          this.data.kitchenUpdatedAt = Date.now();
        }
        this.data.kitchenBuffaloJackSeeded = true;
        this.saveData();
      }

      // Restore all permanent household favorites and queue
      if (!this.data.kitchenPermanentVaultRestoredV1) {
        if (!Array.isArray(kd.favoriteRecipes)) kd.favoriteRecipes = [];

        const permanentRecipes = [
          {
            id: 'r-buffalo-jack-salad',
            title: 'Buffalo Jack Salad',
            icon: 'salad',
            course: 'main',
            tags: ['custom'],
            recipeUrl: '',
            ingredients: 'Romaine lettuce, breaded buffalo chicken, pepper jack cheese, seasoned croutons, beets, chickpeas & chipotle aioli (no tomatoes)',
            stashMatch: null
          },
          {
            id: 'r-kale-salad',
            title: 'Kale Salad',
            icon: 'salad',
            course: 'side',
            tags: [],
            recipeUrl: '',
            ingredients: 'Shredded kale, carrots & red cabbage tossed with Granny Smith apples, croutons, chickpeas, bacon, sunflower seeds, red onions, Grana Padano cheese & an apple cider vinaigrette',
            stashMatch: null
          },
          {
            id: 'r-salmon-broccoli',
            title: 'Roasted Salmon with Broccoli',
            icon: 'salmon',
            course: 'main',
            tags: [],
            recipeUrl: 'https://cooking.nytimes.com/recipes/1020083-sheet-pan-salmon',
            ingredients: 'Salmon fillets, broccoli, sweet potatoes, olive oil, lemon',
            stashMatch: 'Salmon fillets'
          },
          {
            id: 'r-taco-bowls',
            title: 'Turkey & Black Bean Taco Bowls',
            icon: 'taco',
            course: 'main',
            tags: [],
            recipeUrl: 'https://pinchofyum.com/turkey-taco-bowls',
            ingredients: 'Ground turkey, black beans, salsa, tortillas, avocado, cilantro',
            stashMatch: 'Ground Turkey'
          },
          {
            id: 'r-parmesan-risotto',
            title: 'Creamy Parmesan Risotto',
            icon: 'risotto',
            course: 'side',
            tags: [],
            recipeUrl: 'https://www.seriouseats.com/pressure-cooker-mushroom-risotto-recipe',
            ingredients: 'Arborio rice, bone broth, parmesan wedge, baby spinach',
            stashMatch: 'Arborio risotto rice'
          },
          {
            id: 'r-sheet-pan-chicken',
            title: 'Sheet Pan Herb Chicken',
            icon: 'chicken',
            course: 'main',
            tags: [],
            recipeUrl: 'https://www.eatwell101.com/sheet-pan-lemon-herb-chicken',
            ingredients: 'Chicken breasts, bell peppers, zucchini, lemon, oregano',
            stashMatch: null
          },
          {
            id: 'r-raos-penne',
            title: 'Rao\'s Penne with Spinach',
            icon: 'pasta',
            course: 'main',
            tags: [],
            recipeUrl: 'https://raos.com/blogs/recipes/penne-alla-vodka',
            ingredients: 'Penne pasta, Rao\'s marinara, baby spinach, parmesan',
            stashMatch: 'Rao\'s Marinara & Penne'
          },
          {
            id: 'r-spanish-rice',
            title: 'Spanish Rice',
            icon: 'risotto',
            course: 'side',
            tags: [],
            recipeUrl: '',
            ingredients: 'Rice, tomato sauce, diced tomatoes, onion, garlic, broth, cumin & taco spices',
            stashMatch: null
          },
          {
            id: 'r-homemade-pizza',
            title: 'Homemade Pizza with Salami',
            icon: 'pizza',
            course: 'main',
            tags: [],
            recipeUrl: '',
            ingredients: 'Pizza dough, pizza sauce, mozzarella cheese, sliced salami',
            stashMatch: null
          },
          {
            id: 'r-friday-pizza',
            title: 'Friday Night Pizza / Takeout',
            icon: 'pizza',
            course: 'main',
            tags: [],
            recipeUrl: '',
            ingredients: 'Local pizzeria or favorite takeout Thai / Ramen',
            stashMatch: null
          },
          {
            id: 'r-weekend-pancakes',
            title: 'Fluffy Weekend Pancakes & Berries',
            icon: 'brunch',
            course: 'brunch',
            tags: [],
            recipeUrl: '',
            ingredients: 'Flour, eggs, milk, butter, pure maple syrup, fresh blueberries & strawberries',
            stashMatch: null
          },
          {
            id: 'r-berry-crumble',
            title: 'Warm Berry Crumble',
            icon: 'dessert',
            course: 'dessert',
            tags: [],
            recipeUrl: '',
            ingredients: 'Blueberries, blackberries, rolled oats, butter, brown sugar, cinnamon, vanilla ice cream',
            stashMatch: null
          }
        ];

        permanentRecipes.forEach(rec => {
          const exists = kd.favoriteRecipes.some(r => (r.title || '').toLowerCase().trim() === rec.title.toLowerCase().trim());
          if (!exists) {
            kd.favoriteRecipes.push(rec);
          }
        });

        // Also ensure New Recipes Queue has ready-to-test favorite
        if (!Array.isArray(kd.newRecipes)) kd.newRecipes = [];
        const queueItems = [
          {
            id: 'r-new-chickpea-wrap',
            title: 'Crispy Chickpea & Avocado Wrap',
            icon: 'salad',
            course: 'main',
            tags: [],
            recipeUrl: '',
            ingredients: 'Tortillas, roasted seasoned chickpeas, mashed avocado, cucumbers, microgreens, tahini drizzle',
            stashMatch: null
          }
        ];
        queueItems.forEach(q => {
          const exists = kd.newRecipes.some(r => (r.title || '').toLowerCase().trim() === q.title.toLowerCase().trim());
          if (!exists) {
            kd.newRecipes.push(q);
          }
        });

        this.data.kitchenPermanentVaultRestoredV1 = true;
        this.data.kitchenUpdatedAt = Date.now();
        this.saveData();
      }
    }
    return this.data.kitchenData;
  }

  saveKitchenData(kitchenData) {
    this.data.kitchenData = kitchenData;
    this.data.kitchenUpdatedAt = Date.now();
    this.saveData();
  }

  resetToDefaults() {
    this.data = this.getDefaultState();
    this.saveData();
  }
}

const storage = new StorageManager();

