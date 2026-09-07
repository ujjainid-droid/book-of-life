/* ==========================================================================
   Book of Life / Life OS - Storage & Data Persistence Manager
   ========================================================================== */

const STORAGE_KEY = 'BOOK_OF_LIFE_DATA_V2';

class StorageManager {
  constructor() {
    this.data = this.loadData();
    this.recalculateAllStreaks();
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
      // Active Habits starting with 'Move'
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
        }
      ],
      // [dateStr (YYYY-MM-DD)]: { [habitId]: boolean or count }
      habitsState: {
        [todayStr]: {
          'h-move': true
        }
      },
      habitStreaks: {
        'h-move': 1
      },
      // Good Choices (vs Not) Tracker: { [dateStr]: { good: number, not: number } }
      choicesState: {
        [todayStr]: { good: 3, not: 0 }
      },
      // Daily Health & Vitality Check-in: { [dateStr]: { level: number, updatedAt: number } }
      healthState: {},
      // Day-Specific Goals (one-off daily targets): { [dateStr]: [ { id, text, completed } ] }
      dayGoals: {
        [todayStr]: [
          { id: 'dg-1', text: 'Reach 12,000 steps today', completed: false }
        ]
      },
      // Sassy Gamification Points & Status
      points: 85,
      claimedRewards: [],
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
      ]
    };
  }

  loadData() {
    try {
      // Try loading V2 first, fallback to V1 if present
      let saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        saved = localStorage.getItem('BOOK_OF_LIFE_DATA_V1');
      }

      if (saved) {
        const parsed = JSON.parse(saved);
        const defaults = this.getDefaultState();
        const merged = { ...defaults, ...parsed };

        // Ensure habits array exists and contains at least 'Move'
        if (!Array.isArray(merged.habits) || merged.habits.length === 0) {
          merged.habits = [...defaults.habits];
        }

        // Check if 'Move' exists, if not prepend it
        const hasMove = merged.habits.some(h => h.name.toLowerCase() === 'move' || h.id === 'h-move');
        if (!hasMove) {
          merged.habits.unshift(defaults.habits[0]);
        }

        // Initialize reflections map if missing
        if (!merged.weeklyReflections || typeof merged.weeklyReflections !== 'object') {
          merged.weeklyReflections = {};
        }

        // Initialize choicesState, healthState and dayGoals if missing
        if (!merged.choicesState || typeof merged.choicesState !== 'object') {
          merged.choicesState = {};
        }
        if (!merged.healthState || typeof merged.healthState !== 'object') {
          merged.healthState = {};
        }
        if (!merged.dayGoals || typeof merged.dayGoals !== 'object') {
          merged.dayGoals = {};
        }

        // Initialize points & activeTerrorizing if missing
        if (typeof merged.points !== 'number') {
          merged.points = 85;
        }
        if (!Array.isArray(merged.activeTerrorizing)) {
          merged.activeTerrorizing = ['10k steps', 'Close rings'];
        }

        // Initialize claims array if missing
        if (!Array.isArray(merged.claims)) {
          merged.claims = [...defaults.claims];
        }

        return merged;
      }
    } catch (e) {
      console.error('Failed to parse saved state, resetting to default', e);
    }
    return this.getDefaultState();
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
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
    this.saveData();
    return choices;
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
    this.saveData();
    return newGoal;
  }

  toggleDayGoal(goalId, dateStr = formatDateIso(new Date())) {
    const goals = this.getDayGoals(dateStr);
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      goal.completed = !goal.completed;
      this.addPoints(goal.completed ? 15 : -15);
      this.saveData();
      return goal.completed;
    }
    return false;
  }

  deleteDayGoal(goalId, dateStr = formatDateIso(new Date())) {
    const goals = this.getDayGoals(dateStr);
    this.data.dayGoals[dateStr] = goals.filter(g => g.id !== goalId);
    this.saveData();
    return true;
  }

  // --- Gamification Points & Sassy Status Methods ---

  addPoints(amount) {
    if (typeof this.data.points !== 'number') this.data.points = 85;
    this.data.points = Math.max(0, this.data.points + amount);
    this.saveData();
    return this.data.points;
  }

  getPoints() {
    if (typeof this.data.points !== 'number') this.data.points = 85;
    return this.data.points;
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

  resetToDefaults() {
    this.data = this.getDefaultState();
    this.saveData();
  }
}

const storage = new StorageManager();

