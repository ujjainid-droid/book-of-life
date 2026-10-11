/* ==========================================================================
   Book of Life / Life OS - MARGO Framework & Sunday-Start Habit Engine
   ========================================================================== */

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const MARGO_BUCKETS = {
  M: {
    letter: 'M',
    name: 'Move',
    colorHex: '#4E8765',
    colorClass: 'margo-tag-m',
    icon: 'activity',
    description: 'Daily movement, workouts, 10k steps, activity rings'
  },
  A: {
    letter: 'A',
    name: 'Aesthetic',
    colorHex: '#D97768',
    colorClass: 'margo-tag-a',
    icon: 'sparkles',
    description: 'Skincare, outfits, foot care, hair health, make up, surgery'
  },
  R: {
    letter: 'R',
    name: 'Reflect',
    colorHex: '#7979B8',
    colorClass: 'margo-tag-r',
    icon: 'moon',
    description: 'Meditate, journal, recovery, dedicated me-time'
  },
  G: {
    letter: 'G',
    name: 'Grow',
    colorHex: '#D49B35',
    colorClass: 'margo-tag-g',
    icon: 'book-open',
    description: 'Hobbies, reading, skill-building, podcasts'
  },
  O: {
    letter: 'O',
    name: 'Organize',
    colorHex: '#3E5C76',
    colorClass: 'margo-tag-o',
    icon: 'check-square',
    description: 'Home projects, finances, travel, daily routines'
  }
};

/**
 * Initial Default Habit - Starts with "Move"
 */
const DEFAULT_INITIAL_HABITS = [
  {
    id: 'h-move',
    name: 'Move',
    bucket: 'M',
    cadence: 'daily', // 'daily' | 'weekly'
    target: 1, // 1 per day, or N per week
    color: '#4E8765',
    icon: 'activity',
    description: 'Daily movement, workout, or closing active move ring',
    createdAt: '2026-08-01'
  }
];

/**
 * Recommended Presets for Quick Adding Habits (Habit Stack Options)
 */
const RECOMMENDED_HABIT_PRESETS = [
  { name: 'Stand ring', bucket: 'M', cadence: 'daily', target: 1, icon: 'clock', description: 'Complete 12 hourly stand goals' },
  { name: 'Me time', bucket: 'R', cadence: 'daily', target: 1, icon: 'coffee', description: 'Intentional solo recharge & recovery' },
  { name: 'Close all 3 rings', bucket: 'M', cadence: 'daily', target: 1, icon: 'disc', description: 'Close Move, Exercise, and Stand rings' },
  { name: 'Hit 10k steps', bucket: 'M', cadence: 'daily', target: 1, icon: 'footprints', description: 'Reach 10,000 daily steps' },
  { name: 'Cardio', bucket: 'M', cadence: 'weekly', target: 3, icon: 'heart-pulse', description: 'Cardio / aerobic session' },
  { name: 'Yoga', bucket: 'M', cadence: 'daily', target: 1, icon: 'activity', description: 'Yoga, stretch & mobility flow' },
  { name: 'Weights', bucket: 'M', cadence: 'weekly', target: 3, icon: 'dumbbell', description: 'Strength training & weights session' },
  { name: 'Calorie deficit', bucket: 'M', cadence: 'daily', target: 1, icon: 'flame', description: 'Maintain daily nutrition & energy deficit' }
];

/**
 * 17-Week Habit Stacking Phases (Progression Guide)
 */
const HABIT_STACKING_PHASES = [
  { id: 'phase-1', label: 'Week 1-2: Move Ring Focus', description: 'Establish the physical movement baseline.', targetHabits: ['Move'] },
  { id: 'phase-2', label: 'Week 3-4: Skincare Anchor', description: 'Stack morning/evening self-care onto movement.', targetHabits: ['Move', 'Skincare AM & PM'] },
  { id: 'phase-3', label: 'Week 5-6: Hydration & Stand', description: 'Add posture alerts and 2L daily hydration.', targetHabits: ['Move', 'Skincare AM & PM', 'Hydrate 2L Water'] },
  { id: 'phase-4', label: 'Week 7-8: Dedicated Me Time', description: 'Introduce intentional weekly recovery & reflection.', targetHabits: ['Move', 'Skincare AM & PM', 'Dedicated Me Time'] },
  { id: 'phase-5', label: 'Week 9-10: 10k Steps Daily', description: 'Push daily step count to 10k.', targetHabits: ['Move', '10,000 Steps', 'Skincare AM & PM'] },
  { id: 'phase-6', label: 'Week 11-12: Read & Grow', description: 'Add daily reading to your stack.', targetHabits: ['Move', '10,000 Steps', 'Skincare AM & PM', 'Read 20 Pages'] },
  { id: 'phase-7', label: 'Week 13-14: Outfit Prep Weekly', description: 'Lower weekly cognitive load by curating outfits.', targetHabits: ['Move', '10,000 Steps', 'Skincare AM & PM', 'Curate Weekly Outfits'] },
  { id: 'phase-8', label: 'Week 15-16: Workout 3x/Week', description: 'Incorporate dedicated strength/cardio sessions.', targetHabits: ['Move', '10,000 Steps', 'Workout Session', 'Skincare AM & PM'] },
  { id: 'phase-9', label: 'Week 17+: Full Stack Mastery', description: 'The complete integrated MARGO lifestyle stack.', targetHabits: ['Full Stack'] }
];

/**
 * The "No-Pressure" Backlog Shelf
 */
const DEFAULT_BACKLOG_HABITS = [
  { id: 'b-journal', name: 'Journal', bucket: 'R', description: 'Quick evening reflection / brain dump' },
  { id: 'b-meditate', name: 'Meditate', bucket: 'R', description: '5-10 minutes mindful breathing' },
  { id: 'b-hobbies', name: 'Hobbies & Creative', bucket: 'G', description: 'Painting, crafting, music, cooking' },
  { id: 'b-learning', name: 'Learning & Reading', bucket: 'G', description: 'Books, podcasts, skill development' }
];

/**
 * Default High-Level Projects (Organize)
 */
const DEFAULT_PROJECTS = [
  { id: 'proj-1', name: 'Home Organization Refresh', bucket: 'O', progress: 65, targetDate: '2026-09-15' },
  { id: 'proj-2', name: 'Fall Wardrobe Capsule', bucket: 'A', progress: 40, targetDate: '2026-09-30' },
  { id: 'proj-3', name: 'Annual Financial Audit & Sinking Funds', bucket: 'O', progress: 80, targetDate: '2026-08-31' },
  { id: 'proj-4', name: 'Spring Trip Travel Itinerary', bucket: 'O', progress: 25, targetDate: '2026-10-15' }
];

/**
 * Initial Focus Tasks & Task Board
 */
const DEFAULT_TASKS = [
  { id: 't-1', title: 'Review monthly budget spreadsheet & reconcile receipts', bucket: 'O', projectId: 'proj-3', dueDate: 'Today', isFocus: true, completed: false },
  { id: 't-2', title: 'Curate 5 signature work outfits for the week', bucket: 'A', projectId: 'proj-2', dueDate: 'Today', isFocus: true, completed: false },
  { id: 't-3', title: 'Prep workout gear and water bottle for tomorrow morning', bucket: 'M', projectId: null, dueDate: 'Today', isFocus: true, completed: true },
  { id: 't-4', title: 'Deep clean closet & donate old shoes', bucket: 'O', projectId: 'proj-1', dueDate: 'This Week', isFocus: false, completed: false },
  { id: 't-5', title: 'Research boutique hotels for weekend getaway', bucket: 'O', projectId: 'proj-4', dueDate: 'Next Week', isFocus: false, completed: false },
  { id: 't-6', title: 'Download audio book for daily walk', bucket: 'G', projectId: null, dueDate: 'Tomorrow', isFocus: false, completed: true }
];

/**
 * Initial Financial Ledger & Budget Categories (Google Sheet Style)
 */
const DEFAULT_BUDGET_CATEGORIES = [
  { id: 'cat-housing', name: 'Housing & Rent', monthlyBudget: 2200, bucket: 'O' },
  { id: 'cat-groceries', name: 'Groceries & Nutrition', monthlyBudget: 650, bucket: 'M' },
  { id: 'cat-aesthetic', name: 'Aesthetic & Wardrobe', monthlyBudget: 350, bucket: 'A' },
  { id: 'cat-dining', name: 'Dining Out & Coffee', monthlyBudget: 400, bucket: 'R' },
  { id: 'cat-transport', name: 'Transport & Auto', monthlyBudget: 300, bucket: 'O' },
  { id: 'cat-growth', name: 'Learning & Hobbies', monthlyBudget: 150, bucket: 'G' },
  { id: 'cat-savings', name: 'High-Yield Savings & Sinking Funds', monthlyBudget: 1200, bucket: 'O' }
];

const DEFAULT_TRANSACTIONS = [
  { id: 'tx-1', date: '2026-08-01', description: 'Monthly Salary Deposit', categoryId: 'income', amount: 5500, type: 'income', bucket: 'O' },
  { id: 'tx-2', date: '2026-08-01', description: 'Apartment Rent', categoryId: 'cat-housing', amount: 2200, type: 'expense', bucket: 'O' },
  { id: 'tx-3', date: '2026-08-03', description: 'Whole Foods Grocery Haul', categoryId: 'cat-groceries', amount: 165.40, type: 'expense', bucket: 'M' },
  { id: 'tx-4', date: '2026-08-06', description: 'Skincare Restock (Sunscreen & Cleanser)', categoryId: 'cat-aesthetic', amount: 78.50, type: 'expense', bucket: 'A' },
  { id: 'tx-5', date: '2026-08-10', description: 'Trader Joe\'s Essentials', categoryId: 'cat-groceries', amount: 92.15, type: 'expense', bucket: 'M' },
  { id: 'tx-6', date: '2026-08-12', description: 'Signature Blazer & Pants tailoring', categoryId: 'cat-aesthetic', amount: 140.00, type: 'expense', bucket: 'A' },
  { id: 'tx-7', date: '2026-08-15', description: 'Weekend Brunch with Friends', categoryId: 'cat-dining', amount: 64.20, type: 'expense', bucket: 'R' },
  { id: 'tx-8', date: '2026-08-18', description: 'Auto-Transfer to Emergency Sinking Fund', categoryId: 'cat-savings', amount: 600.00, type: 'expense', bucket: 'O' }
];

/* ==========================================================================
   Sunday-Start Date & Week Calculation Utilities
   ========================================================================== */

const DAY_NAMES_SUNDAY_START = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_FULL_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Format a Date object to YYYY-MM-DD
 */
function formatDateIso(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD into a local Date object safely
 */
function parseDateIso(isoStr) {
  if (!isoStr) return new Date();
  const [year, month, day] = isoStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get the Sunday Date for the week containing `date`
 * (Week strictly starts Sunday: Day 0)
 */
function getSundayOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Mon, ..., 6 is Sat
  const diffToSunday = dayOfWeek; // Subtract this many days to reach Sunday
  d.setDate(d.getDate() - diffToSunday);
  return d;
}

/**
 * Get the 7 dates of the week starting from the given Sunday
 * Returns array of 7 Date objects [Sunday, Monday, ..., Saturday]
 */
function getWeekDates(sundayDate) {
  const sun = new Date(sundayDate);
  sun.setHours(0, 0, 0, 0);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(sun);
    day.setDate(sun.getDate() + i);
    dates.push(day);
  }
  return dates;
}

/**
 * Format a readable week range string (e.g. "Aug 16 – Aug 22, 2026")
 */
function formatWeekRange(sundayDate) {
  const dates = getWeekDates(sundayDate);
  const start = dates[0];
  const end = dates[6];

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} – ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
}

/**
 * Calculate comprehensive Weekly Stats for a given Sunday-start week
 */
function calculateWeeklyStats(sundayDate, habits = [], habitsState = {}) {
  const dates = getWeekDates(sundayDate);
  const todayIso = formatDateIso(new Date());
  const sundayIso = formatDateIso(dates[0]);
  const saturdayIso = formatDateIso(dates[6]);

  const activeHabits = habits.filter(h => !h.archived);

  // Daily stats for the 7 days (Sun -> Sat)
  const days = dates.map((dateObj, dayIndex) => {
    const dateStr = formatDateIso(dateObj);
    const dayHabitState = habitsState[dateStr] || {};
    
    let completedCount = 0;
    activeHabits.forEach(h => {
      if (h.cadence === 'daily') {
        if (dayHabitState[h.id]) completedCount++;
      } else {
        // Weekly habit count on this day
        if (typeof dayHabitState[h.id] === 'number' && dayHabitState[h.id] > 0) {
          completedCount += 1;
        } else if (dayHabitState[h.id]) {
          completedCount += 1;
        }
      }
    });

    const totalHabits = activeHabits.length;
    const percent = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
    const isToday = (dateStr === todayIso);
    const isFuture = (dateStr > todayIso);
    const isPast = (dateStr < todayIso);

    return {
      dateObj,
      dateStr,
      dayIndex, // 0 = Sun, 1 = Mon, ..., 6 = Sat
      dayName: DAY_NAMES_SUNDAY_START[dayIndex],
      dayFullName: DAY_FULL_NAMES[dayIndex],
      dayNum: dateObj.getDate(),
      completedCount,
      totalHabits,
      percent,
      isPerfect: totalHabits > 0 && completedCount >= totalHabits,
      isToday,
      isFuture,
      isPast
    };
  });

  // Per-habit breakdown across the 7 days
  const habitBreakdowns = activeHabits.map(h => {
    const isWeekly = (h.cadence === 'weekly');
    const target = h.target || (isWeekly ? 3 : 1);
    
    // Check completion for each day of the week
    const dailyStatus = dates.map(dateObj => {
      const dateStr = formatDateIso(dateObj);
      const dayHabitState = habitsState[dateStr] || {};
      const val = dayHabitState[h.id];
      return {
        dateStr,
        isDone: isWeekly ? (Number(val || 0) > 0 || !!val) : !!val,
        count: typeof val === 'number' ? val : (val ? 1 : 0)
      };
    });

    let completedDaysCount = 0;
    let totalWeeklyReps = 0;

    dailyStatus.forEach(ds => {
      if (ds.isDone) completedDaysCount++;
      totalWeeklyReps += ds.count;
    });

    let targetMet = false;
    let completionPercent = 0;

    if (isWeekly) {
      targetMet = totalWeeklyReps >= target;
      completionPercent = Math.min(100, Math.round((totalWeeklyReps / target) * 100));
    } else {
      // Daily: target is 7 days
      targetMet = completedDaysCount >= 7;
      completionPercent = Math.round((completedDaysCount / 7) * 100);
    }

    return {
      habit: h,
      id: h.id,
      name: h.name,
      bucket: h.bucket,
      cadence: h.cadence,
      target: target,
      dailyStatus, // array of 7 { dateStr, isDone, count }
      completedDaysCount,
      totalWeeklyReps,
      targetMet,
      completionPercent
    };
  });

  // Summary Metrics
  const pastOrTodayDays = days.filter(d => !d.isFuture);
  const totalPossibleSlots = activeHabits.length * Math.max(1, pastOrTodayDays.length);
  
  let totalCompletions = 0;
  pastOrTodayDays.forEach(d => {
    totalCompletions += d.completedCount;
  });

  const overallCompletionRate = totalPossibleSlots > 0
    ? Math.round((totalCompletions / totalPossibleSlots) * 100)
    : 0;

  const perfectDaysCount = pastOrTodayDays.filter(d => d.isPerfect).length;

  // Best / Top habit
  let topHabit = null;
  if (habitBreakdowns.length > 0) {
    const sorted = [...habitBreakdowns].sort((a, b) => b.completionPercent - a.completionPercent);
    topHabit = sorted[0];
  }

  // Most consistent day of the week
  let bestDay = null;
  const daysWithActivity = pastOrTodayDays.filter(d => d.totalHabits > 0);
  if (daysWithActivity.length > 0) {
    const sortedDays = [...daysWithActivity].sort((a, b) => b.percent - a.percent);
    bestDay = sortedDays[0];
  }

  return {
    sundayIso,
    saturdayIso,
    weekRangeLabel: formatWeekRange(dates[0]),
    days,
    habitBreakdowns,
    overallCompletionRate,
    totalCompletions,
    totalPossibleSlots,
    perfectDaysCount,
    activeHabitsCount: activeHabits.length,
    topHabit,
    bestDay
  };
}

/**
 * Generate a Shareable Markdown / Text Summary for the week
 */
function generateWeeklySummaryText(stats, reflection = {}) {
  let text = `📅 **Weekly Habit Summary: ${stats.weekRangeLabel}** (Sunday–Saturday)\n\n`;
  text += `🎯 **Overall Consistency Rate**: ${stats.overallCompletionRate}%\n`;
  text += `✨ **Perfect Days (100%)**: ${stats.perfectDaysCount} of 7 days\n`;
  text += `⚡ **Total Check-ins**: ${stats.totalCompletions} / ${stats.totalPossibleSlots}\n\n`;
  
  text += `📊 **Habit Breakdown**:\n`;
  stats.habitBreakdowns.forEach(hb => {
    const statusIcons = hb.dailyStatus.map(d => d.isDone ? '🟩' : '⬜').join(' ');
    const countLabel = hb.cadence === 'weekly' 
      ? `${hb.totalWeeklyReps}/${hb.target}x` 
      : `${hb.completedDaysCount}/7d (${hb.completionPercent}%)`;
    text += `• **${hb.name}** [${hb.bucket}]: ${statusIcons} → ${countLabel}\n`;
  });

  if (reflection.wins) {
    text += `\n🌟 **Weekly Wins**: ${reflection.wins}\n`;
  }
  if (reflection.focus) {
    text += `🎯 **Next Week Focus**: ${reflection.focus}\n`;
  }

  return text;
}

/**
 * Sassy Gamification Status Tiers
 */
const SASSY_STATUS_TIERS = [
  {
    minPoints: 0,
    title: "Bed Potato",
    badge: "🥔",
    flavor: "Contemplating breathing. The bar was in hell, but you're thinking about it.",
    reward: "Permission to stare blankly at a wall for 5 minutes without guilt."
  },
  {
    minPoints: 50,
    title: "Slightly Less Useless",
    badge: "🌱",
    flavor: "You actually got vertical. Society thanks you for the bare minimum.",
    reward: "An iced coffee with extra espresso and zero apologies."
  },
  {
    minPoints: 150,
    title: "Functional Menace",
    badge: "⚡",
    flavor: "Rumor has it you have your life together today. Let's not jinx it.",
    reward: "30 minutes of completely uninterrupted, guilt-free doomscrolling."
  },
  {
    minPoints: 300,
    title: "Chief Chaos Officer",
    badge: "👑",
    flavor: "Operating at dangerously high momentum. Someone check on your enemies.",
    reward: "Buy that ridiculous thing sitting in your online shopping cart."
  },
  {
    minPoints: 500,
    title: "Goblin Mode Overachiever",
    badge: "🔥",
    flavor: "Who authorized this much discipline? God complex loading...",
    reward: "Takeout from your favorite place, premium dessert, zero calorie shame."
  },
  {
    minPoints: 800,
    title: "Weapon of Mass Productivity",
    badge: "🚀",
    flavor: "You're terrorizing your goals so hard they're calling customer support.",
    reward: "A spa day, deep tissue massage, or high-end celebratory dinner."
  },
  {
    minPoints: 1200,
    title: "Supreme Living Legend",
    badge: "✨",
    flavor: "You won life. They should build a bronze monument in your living room.",
    reward: "Whatever the hell you want. You run this empire."
  }
];

function getSassyStatus(points = 0) {
  let currentTier = SASSY_STATUS_TIERS[0];
  let nextTier = SASSY_STATUS_TIERS[1];

  for (let i = 0; i < SASSY_STATUS_TIERS.length; i++) {
    if (points >= SASSY_STATUS_TIERS[i].minPoints) {
      currentTier = SASSY_STATUS_TIERS[i];
      nextTier = SASSY_STATUS_TIERS[i + 1] || null;
    }
  }

  let progressPercent = 100;
  let pointsToNext = 0;
  if (nextTier) {
    const range = nextTier.minPoints - currentTier.minPoints;
    const progress = points - currentTier.minPoints;
    progressPercent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
    pointsToNext = nextTier.minPoints - points;
  }

  return {
    currentTier,
    nextTier,
    progressPercent,
    pointsToNext
  };
}

/**
 * Medical Claims & Recovery Pipeline Stages
 */
const CLAIM_STAGES = {
  need_superbill: {
    id: 'need_superbill',
    label: 'Need Superbill',
    emoji: '🧾',
    defaultAction: 'Request itemized superbill from provider',
    actor: 'You'
  },
  ready_to_send: {
    id: 'ready_to_send',
    label: 'Send to Included Health',
    emoji: '📤',
    defaultAction: 'Upload superbill to Included Health app',
    actor: 'You'
  },
  with_included_health: {
    id: 'with_included_health',
    label: 'Pending Insurance',
    emoji: '⏳',
    defaultAction: 'Waiting on Insurance / EOB review',
    actor: 'Insurance'
  },
  check_due: {
    id: 'check_due',
    label: 'Check / Deposit Due',
    emoji: '💰',
    defaultAction: 'Watch Monarch for incoming ACH deposit',
    actor: 'Monarch'
  },
  settled: {
    id: 'settled',
    label: 'Settled & Reconciled',
    emoji: '🎉',
    defaultAction: 'Reconciled in Monarch — All set!',
    actor: 'Done'
  }
};

function getDefaultNextAction(stage, payoutMethod = 'direct_deposit', submissionType = 'self') {
  if (stage === 'check_due') {
    return payoutMethod === 'check'
      ? 'Watch mailbox for physical check & mobile deposit'
      : 'Watch Monarch for incoming ACH direct deposit';
  }
  if (stage === 'with_included_health') {
    return submissionType === 'provider'
      ? 'Provider submitted claim — waiting on insurance EOB'
      : 'Waiting on Included Health & insurance review';
  }
  return CLAIM_STAGES[stage] ? CLAIM_STAGES[stage].defaultAction : '';
}

/* --------------------------------------------------------------------------
   Health & Vitality Check-in Configuration
   -------------------------------------------------------------------------- */
const HEALTH_LEVELS = {
  5: {
    level: 5,
    emoji: '🦄',
    label: 'Thriving',
    desc: 'Peak vitality, invincible, full energy',
    sassy: "Look at you glowing. Try not to intimidate the mere mortals today."
  },
  4: {
    level: 4,
    emoji: '⚡',
    label: 'Solid',
    desc: 'Feeling good, body cooperating, clear head',
    sassy: "Functional and thriving. Let's not ruin this with questionable decisions."
  },
  3: {
    level: 3,
    emoji: '🧋',
    label: 'Surviving',
    desc: 'Baseline okay, fueled by coffee & momentum',
    sassy: "Held together by coffee and sheer willpower, but hey—you're upright."
  },
  2: {
    level: 2,
    emoji: '🪫',
    label: 'Dragging',
    desc: 'Low battery, sluggish, low-power mode',
    sassy: "Battery at 12%. Postpone unnecessary drama and conserve power."
  },
  1: {
    level: 1,
    emoji: '🦥',
    label: 'Zombie',
    desc: 'Under the weather, drained, need recovery',
    sassy: "Official goblin mode. Drink water, crawl under blankets, apologize to nobody."
  }
};

/* --------------------------------------------------------------------------
   Sassy Daily Affirmations Catalog & Midnight Rotation Engine
   -------------------------------------------------------------------------- */
const SASSY_AFFIRMATIONS = [
  { emoji: '🥔', text: "You actually got vertical today. Society thanks you for the bare minimum. Let's close Move and Stand before we celebrate." },
  { emoji: '⚡', text: "Operating at dangerously high momentum. Someone check on your enemies." },
  { emoji: '👑', text: "The bar was in hell, but look at you walking over it like royalty." },
  { emoji: '☕', text: "One good choice before 10 AM prevents an existential crisis at 3 PM." },
  { emoji: '🦁', text: "Discipline is just remembering what you promised yourself when you had energy." },
  { emoji: '🎯', text: "You don't need to conquer the next 6 months today. Just conquer today's Move and Stand." },
  { emoji: '👟', text: "Overthinking burned 0 calories. Put your shoes on and take the first step." },
  { emoji: '🤫', text: "Rumor has it you have your life together today. Let's act like it's totally normal." },
  { emoji: '☕', text: "Your to-do list is trembling in fear. Or maybe that's just your caffeine intake." },
  { emoji: '💧', text: "Drink your water or your organs will file a formal grievance with HR." },
  { emoji: '✨', text: "Look at you prioritizing yourself. Your future self is wiping away a proud tear." },
  { emoji: '🛡️', text: "You cannot control the chaos of the world, but you can definitely control closing these two rings." },
  { emoji: '🚀', text: "Rough and shipped beats polished and stalled. Stop over-planning and take the next move." },
  { emoji: '🧘‍♀️', text: "Self-care isn't just bubble baths; today it's ruthlessly protecting your peace and boundaries." },
  { emoji: '🔥', text: "Be the positive menace your future self will celebrate tonight." },
  { emoji: '💼', text: "Remember: you are the executive of your own life, not an unpaid intern." },
  { emoji: '✈️', text: "If anyone drains your battery today, mentally put them on airplane mode." },
  { emoji: '🥊', text: "You survived 100% of your hardest days so far. Today's targets stand no chance." },
  { emoji: '🧱', text: "Consistency is doing the boring foundation so you can be extraordinary when it counts." },
  { emoji: '🌲', text: "A 20-minute outdoor walk cures about 80% of what's wrong with your mental state right now." },
  { emoji: '⚡', text: "No one is coming to hand you your momentum. Good thing you create your own." },
  { emoji: '🌙', text: "Today's goal: make decisions that tonight-you will thank morning-you for." },
  { emoji: '🌅', text: "Your drive didn't expire overnight. Stand up, shake off the rust, and own the room." },
  { emoji: '📦', text: "Done is better than perfect. Perfect is a myth made by people who never ship." }
];

let customAffirmationOffset = 0;

function getDailyAffirmation(dateStr, offset = 0) {
  if (!SASSY_AFFIRMATIONS || SASSY_AFFIRMATIONS.length === 0) {
    return { emoji: '✨', text: "Simple. Visible. Next step. Done." };
  }
  const dateObj = (typeof parseDateIso === 'function') ? parseDateIso(dateStr) : new Date(dateStr);
  const startOfYear = new Date(dateObj.getFullYear(), 0, 0);
  const diff = dateObj - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = Math.abs((dayOfYear + dateObj.getFullYear() + offset) % SASSY_AFFIRMATIONS.length);
  return SASSY_AFFIRMATIONS[index];
}

/**
 * Where Info Lives: Potential Information Sources
 */
const POTENTIAL_INFO_SOURCES = [
  { id: 'margo', label: 'margo', tagClass: 'tool-margo' },
  { id: 'icloud', label: 'iCloud', tagClass: 'tool-icloud' },
  { id: 'drive', label: 'Google Drive', tagClass: 'tool-drive' },
  { id: 'things', label: 'Things 3', tagClass: 'tool-things' },
  { id: 'email', label: 'emails', tagClass: 'tool-email' },
  { id: 'notes', label: 'Apple notes', tagClass: 'tool-notes' }
];

/* ==========================================================================
   Sprout the Potato — Interactive Mood Companion Engine
   ========================================================================== */

const SPROUT_DIALOGUE = {
  potato: [
    "The bar was in hell, but look at you contemplating it.",
    "Contemplating breathing. Society thanks you for thinking about it.",
    "Bed is cozy. The world is loud. But your Move ring awaits.",
    "Five more minutes? Don't make me roll off the mattress.",
    "You haven't moved yet, but your heart is in the right place. Probably.",
    "Status: Horizontal potato. Next move: Get vertical."
  ],
  vertical: [
    "You actually got vertical today. Society thanks you for the bare minimum.",
    "Held together by coffee and sheer audacity, but hey—you're upright.",
    "First step taken! Now let's protect that 50% floor.",
    "Upright and operational. Let's not ruin this with questionable decisions.",
    "One foot in front of the other. The couch has officially been vacated.",
    "50% floor defended! The streak lives to fight another day."
  ],
  momentum: [
    "Operating at dangerously high momentum. Someone check on your enemies.",
    "Look at you moving with purpose. God complex loading...",
    "Your to-do list is trembling in fear. Or maybe that's caffeine.",
    "Sneakers laced, rings trembling. Finish what you started!",
    "Rumor has it you have your life together today. Act natural.",
    "High-energy discipline mode. We are so back."
  ],
  supreme: [
    "Supreme Living Legend status achieved. Build the bronze monument.",
    "You're terrorizing your goals so hard they're calling customer support.",
    "Both anchors closed! You run this entire empire today.",
    "Look at that glow. Try not to intimidate the mere mortals.",
    "100% closed. Absolute powerhouse behavior. Take your victory lap.",
    "Unbothered, moisturized, in your lane, and fully closed rings."
  ],
  maintenance: [
    "Maintenance mode engaged: 50% floor defended with zero guilt.",
    "Conserving battery like a pro. Sip tea, protect the baseline.",
    "No drama, no guilt. Just steady rhythm and restorative peace.",
    "The baseline is secure. Tomorrow-you is already thankful.",
    "Resting is an executive decision. Recharge the machine."
  ]
};

let sproutPokeIndex = 0;

function getMascotStateInfo(moveStage, standStage, totalChoices = 0, hasHealth = false, isMaintenance = false) {
  if (isMaintenance) {
    const isProtected = (moveStage > 0 || standStage > 0);
    return {
      state: 'maintenance',
      tierTitle: isProtected ? 'Shield Defended' : 'Cozy Maintenance',
      badge: isProtected ? '🛡️' : '🍵',
      subtitle: isProtected ? '50% Floor Protected · Zero Guilt' : 'Conserving Power · Baseline Priority',
      quips: SPROUT_DIALOGUE.maintenance
    };
  }
  if (moveStage === 1 && standStage === 1) {
    return {
      state: 'supreme',
      tierTitle: 'Supreme Legend',
      badge: '👑',
      subtitle: 'Both Anchors 100% Closed · Peak Form',
      quips: SPROUT_DIALOGUE.supreme
    };
  }
  if ((moveStage > 0 && standStage > 0) || moveStage === 1 || standStage === 1) {
    return {
      state: 'momentum',
      tierTitle: 'Functional Momentum',
      badge: '⚡',
      subtitle: 'Hero Anchors Active · Building Speed',
      quips: SPROUT_DIALOGUE.momentum
    };
  }
  if (moveStage > 0 || standStage > 0 || totalChoices > 0 || hasHealth) {
    return {
      state: 'vertical',
      tierTitle: 'Getting Vertical',
      badge: '🌱',
      subtitle: 'First Move Logged · 50% Floor Unlocked',
      quips: SPROUT_DIALOGUE.vertical
    };
  }
  return {
    state: 'potato',
    tierTitle: 'Bed Potato',
    badge: '🥔',
    subtitle: 'Morning Baseline · Awaiting Move Anchor',
    quips: SPROUT_DIALOGUE.potato
  };
}

/**
 * Render crisp vector SVG of Sprout the Potato based on active state
 */
function renderSproutSvg(state = 'potato') {
  if (state === 'supreme') {
    return `
      <svg viewBox="0 0 120 120" class="mascot-svg mascot-supreme" xmlns="http://www.w3.org/2000/svg">
        <!-- Floating Shimmer Sparkles -->
        <path class="mascot-sparkle sparkle-1" d="M22 28 Q24 24 28 22 Q24 20 22 16 Q20 20 16 22 Q20 24 22 28 Z" fill="#8B5CF6"/>
        <path class="mascot-sparkle sparkle-2" d="M98 32 Q100 28 104 26 Q100 24 98 20 Q96 24 92 26 Q96 28 98 32 Z" fill="#0D9488"/>
        <path class="mascot-sparkle sparkle-3" d="M88 88 Q90 85 93 84 Q90 83 88 80 Q86 83 83 84 Q86 85 88 88 Z" fill="#C084FC"/>

        <!-- Little Legs -->
        <path d="M48 98 L48 110" fill="none" stroke="#4A3B32" stroke-width="3" stroke-linecap="round"/>
        <path d="M72 98 L72 110" fill="none" stroke="#4A3B32" stroke-width="3" stroke-linecap="round"/>
        <!-- Golden Shoes -->
        <rect x="42" y="108" width="14" height="6" rx="2" fill="#E6BE8A" stroke="#4A3B32" stroke-width="1.5"/>
        <rect x="66" y="108" width="14" height="6" rx="2" fill="#E6BE8A" stroke="#4A3B32" stroke-width="1.5"/>

        <!-- Hands on Hips -->
        <path d="M30 68 Q18 72 24 82" fill="none" stroke="#4A3B32" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M90 68 Q102 72 96 82" fill="none" stroke="#4A3B32" stroke-width="3.2" stroke-linecap="round"/>

        <!-- Potato Body -->
        <ellipse cx="60" cy="62" rx="34" ry="42" fill="#E8C394" stroke="#4A3B32" stroke-width="3"/>
        <!-- Potato Freckles -->
        <circle cx="48" cy="48" r="1.5" fill="#C49B6A"/>
        <circle cx="74" cy="46" r="1.5" fill="#C49B6A"/>
        <circle cx="50" cy="82" r="1.5" fill="#C49B6A"/>

        <!-- Rosy Cheeks -->
        <ellipse cx="44" cy="68" rx="5" ry="3" fill="#F472B6" opacity="0.65"/>
        <ellipse cx="76" cy="68" rx="5" ry="3" fill="#F472B6" opacity="0.65"/>

        <!-- Chic Dark Sunglasses -->
        <path d="M40 48 L56 50 L56 58 C56 63 44 63 40 58 Z" fill="#1E1B4B" stroke="#0F172A" stroke-width="2"/>
        <path d="M64 50 L80 48 L80 58 C80 63 64 63 64 58 Z" fill="#1E1B4B" stroke="#0F172A" stroke-width="2"/>
        <line x1="56" y1="52" x2="64" y2="52" stroke="#0F172A" stroke-width="2.5"/>
        <!-- Sunglasses Glare -->
        <line x1="43" y1="51" x2="49" y2="59" stroke="#A78BFA" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>
        <line x1="67" y1="53" x2="73" y2="61" stroke="#A78BFA" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>

        <!-- Confident Smirk -->
        <path d="M54 68 Q62 74 68 67" fill="none" stroke="#332720" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Miniature Gold Crown -->
        <path d="M47 25 L51 14 L60 21 L69 14 L73 25 Z" fill="#F59E0B" stroke="#B45309" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="51" cy="14" r="1.5" fill="#EC4899"/>
        <circle cx="60" cy="21" r="1.5" fill="#8B5CF6"/>
        <circle cx="69" cy="14" r="1.5" fill="#0D9488"/>
      </svg>
    `;
  }

  if (state === 'momentum') {
    return `
      <svg viewBox="0 0 120 120" class="mascot-svg mascot-momentum" xmlns="http://www.w3.org/2000/svg">
        <!-- Speed Lines -->
        <path d="M10 62 L22 62" fill="none" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
        <path d="M6 72 L18 72" fill="none" stroke="#0D9488" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>

        <!-- Running Legs with Teal Sneakers -->
        <path d="M48 94 Q40 102 34 105" fill="none" stroke="#4A3B32" stroke-width="3.5" stroke-linecap="round"/>
        <rect x="22" y="103" width="16" height="8" rx="3" fill="#0D9488" stroke="#0F766E" stroke-width="1.5"/>
        <rect x="22" y="108" width="16" height="3" rx="1" fill="#FFFFFF"/>

        <path d="M72 94 Q80 102 88 100" fill="none" stroke="#4A3B32" stroke-width="3.5" stroke-linecap="round"/>
        <rect x="84" y="96" width="16" height="8" rx="3" fill="#0D9488" stroke="#0F766E" stroke-width="1.5"/>
        <rect x="84" y="101" width="16" height="3" rx="1" fill="#FFFFFF"/>

        <!-- Running Arms -->
        <path d="M30 62 Q20 54 22 46" fill="none" stroke="#4A3B32" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="22" cy="46" r="3.5" fill="#E8C394" stroke="#4A3B32" stroke-width="2"/>
        <path d="M86 64 Q96 72 102 66" fill="none" stroke="#4A3B32" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="102" cy="66" r="3.5" fill="#E8C394" stroke="#4A3B32" stroke-width="2"/>

        <!-- Potato Body -->
        <ellipse cx="60" cy="58" rx="34" ry="42" fill="#E8C394" stroke="#4A3B32" stroke-width="3"/>
        <circle cx="48" cy="52" r="1.5" fill="#C49B6A"/>
        <circle cx="74" cy="50" r="1.5" fill="#C49B6A"/>

        <!-- Teal Headband -->
        <rect x="27" y="32" width="66" height="12" rx="4" fill="#0D9488" stroke="#0F766E" stroke-width="2"/>
        <path d="M28 38 Q18 32 14 36" fill="none" stroke="#0D9488" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M28 42 Q16 42 12 48" fill="none" stroke="#0D9488" stroke-width="3.5" stroke-linecap="round"/>

        <!-- Focused Eyes -->
        <circle cx="50" cy="54" r="3.5" fill="#332720"/>
        <circle cx="52" cy="52" r="1.2" fill="#FFFFFF"/>
        <circle cx="70" cy="54" r="3.5" fill="#332720"/>
        <circle cx="72" cy="52" r="1.2" fill="#FFFFFF"/>
        <!-- Eyebrows -->
        <path d="M45 47 L54 50" fill="none" stroke="#332720" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M75 47 L66 50" fill="none" stroke="#332720" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Cheeks -->
        <ellipse cx="44" cy="60" rx="4.5" ry="3" fill="#F472B6" opacity="0.6"/>
        <ellipse cx="76" cy="60" rx="4.5" ry="3" fill="#F472B6" opacity="0.6"/>

        <!-- Grin -->
        <path d="M55 64 Q60 70 65 64" fill="none" stroke="#332720" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `;
  }

  if (state === 'vertical') {
    return `
      <svg viewBox="0 0 120 120" class="mascot-svg mascot-vertical" xmlns="http://www.w3.org/2000/svg">
        <!-- Bed Edge / Shadow -->
        <rect x="24" y="98" width="72" height="6" rx="3" fill="#DDD6FE" opacity="0.5"/>
        <!-- Dangling Legs -->
        <path d="M48 94 L48 106" fill="none" stroke="#4A3B32" stroke-width="3" stroke-linecap="round"/>
        <path d="M68 94 L68 106" fill="none" stroke="#4A3B32" stroke-width="3" stroke-linecap="round"/>
        <circle cx="48" cy="107" r="2.5" fill="#4A3B32"/>
        <circle cx="68" cy="107" r="2.5" fill="#4A3B32"/>

        <!-- Stretching Left Arm -->
        <path d="M30 65 Q18 45 22 38" fill="none" stroke="#4A3B32" stroke-width="3.2" stroke-linecap="round"/>
        <circle cx="22" cy="38" r="3.5" fill="#E8C394" stroke="#4A3B32" stroke-width="2"/>

        <!-- Right Arm Holding Coffee -->
        <path d="M85 68 Q95 68 96 62" fill="none" stroke="#4A3B32" stroke-width="3.2" stroke-linecap="round"/>
        <!-- Coffee Mug with Steam -->
        <rect x="90" y="56" width="16" height="18" rx="3" fill="#FFFFFF" stroke="#0D9488" stroke-width="2"/>
        <path d="M106 60 Q112 65 106 70" fill="none" stroke="#0D9488" stroke-width="2"/>
        <path class="mascot-steam" d="M94 52 Q97 46 95 40" fill="none" stroke="#0D9488" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
        <path class="mascot-steam" d="M100 50 Q103 44 101 38" fill="none" stroke="#8B5CF6" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>

        <!-- Potato Body -->
        <ellipse cx="58" cy="62" rx="34" ry="42" fill="#E8C394" stroke="#4A3B32" stroke-width="3"/>
        <circle cx="46" cy="50" r="1.5" fill="#C49B6A"/>
        <circle cx="70" cy="52" r="1.5" fill="#C49B6A"/>

        <!-- Sleepy Happy Eyes -->
        <path d="M46 54 Q50 50 54 54" fill="none" stroke="#332720" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M64 54 Q68 50 72 54" fill="none" stroke="#332720" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Rosy Cheeks -->
        <ellipse cx="42" cy="62" rx="4.5" ry="3" fill="#F472B6" opacity="0.6"/>
        <ellipse cx="74" cy="62" rx="4.5" ry="3" fill="#F472B6" opacity="0.6"/>

        <!-- Morning Smile -->
        <path d="M54 64 Q59 69 64 64" fill="none" stroke="#332720" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `;
  }

  if (state === 'maintenance') {
    return `
      <svg viewBox="0 0 120 120" class="mascot-svg mascot-maintenance" xmlns="http://www.w3.org/2000/svg">
        <!-- Shield Badge -->
        <path d="M84 28 L94 24 L104 28 C104 38 94 44 94 44 C94 44 84 38 84 28 Z" fill="#0D9488" stroke="#0F766E" stroke-width="1.8"/>
        <path d="M89 34 L93 38 L99 30" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

        <!-- Potato Head -->
        <ellipse cx="60" cy="60" rx="34" ry="42" fill="#E8C394" stroke="#4A3B32" stroke-width="3"/>
        <!-- Peaceful Closed Eyes -->
        <path d="M46 46 Q50 42 54 46" fill="none" stroke="#332720" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M66 46 Q70 42 74 46" fill="none" stroke="#332720" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M56 54 Q60 57 64 54" fill="none" stroke="#332720" stroke-width="2" stroke-linecap="round"/>

        <!-- Cheeks -->
        <ellipse cx="44" cy="52" rx="4.5" ry="3" fill="#F472B6" opacity="0.6"/>
        <ellipse cx="76" cy="52" rx="4.5" ry="3" fill="#F472B6" opacity="0.6"/>

        <!-- Cozy Lavender Knit Sweater -->
        <path d="M26 62 Q60 54 94 62 L97 98 Q60 104 23 98 Z" fill="#8B5CF6" stroke="#6D28D9" stroke-width="2.5"/>
        <rect x="36" y="56" width="48" height="12" rx="6" fill="#A78BFA" stroke="#6D28D9" stroke-width="2"/>
        <line x1="44" y1="58" x2="44" y2="66" stroke="#DDD6FE" stroke-width="1.5"/>
        <line x1="52" y1="58" x2="52" y2="66" stroke="#DDD6FE" stroke-width="1.5"/>
        <line x1="60" y1="58" x2="60" y2="66" stroke="#DDD6FE" stroke-width="1.5"/>
        <line x1="68" y1="58" x2="68" y2="66" stroke="#DDD6FE" stroke-width="1.5"/>
        <line x1="76" y1="58" x2="76" y2="66" stroke="#DDD6FE" stroke-width="1.5"/>

        <!-- Teacup -->
        <rect x="52" y="74" width="16" height="16" rx="3" fill="#FFFFFF" stroke="#0D9488" stroke-width="1.8"/>
        <path d="M68 77 Q74 81 68 85" fill="none" stroke="#0D9488" stroke-width="1.8"/>
        <!-- Teabag tag -->
        <line x1="62" y1="74" x2="60" y2="82" stroke="#0D9488" stroke-width="1"/>
        <rect x="58" y="82" width="5" height="5" fill="#0D9488" rx="1"/>
        <!-- Warm Steam -->
        <path class="mascot-steam" d="M57 70 Q60 64 58 58" fill="none" stroke="#0D9488" stroke-width="1.5" opacity="0.6"/>
      </svg>
    `;
  }

  // Default: Bed Potato
  return `
    <svg viewBox="0 0 120 120" class="mascot-svg mascot-potato" xmlns="http://www.w3.org/2000/svg">
      <!-- Animated Floating Zzz -->
      <g class="mascot-zzz">
        <text x="76" y="40" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#8B5CF6">z</text>
        <text x="86" y="30" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#8B5CF6">Z</text>
        <text x="96" y="18" font-family="'Inter', sans-serif" font-size="17" font-weight="800" fill="#7C3AED">Z</text>
      </g>

      <!-- Soft Pillow -->
      <rect x="22" y="36" width="38" height="26" rx="8" fill="#EDE9FE" stroke="#8B5CF6" stroke-width="2"/>

      <!-- Potato Body nestled in bed -->
      <g transform="rotate(-12 58 66)">
        <ellipse cx="58" cy="64" rx="34" ry="40" fill="#E8C394" stroke="#4A3B32" stroke-width="3"/>
        <circle cx="48" cy="54" r="1.5" fill="#C49B6A"/>
        <circle cx="68" cy="52" r="1.5" fill="#C49B6A"/>

        <!-- Sleepy Closed Eyes -->
        <path d="M46 56 Q50 61 54 56" fill="none" stroke="#332720" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M64 56 Q68 61 72 56" fill="none" stroke="#332720" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Cheeks -->
        <ellipse cx="42" cy="62" rx="4.5" ry="3" fill="#F472B6" opacity="0.6"/>
        <ellipse cx="74" cy="62" rx="4.5" ry="3" fill="#F472B6" opacity="0.6"/>

        <!-- Calm sleeping mouth -->
        <path d="M57 64 Q59 66 61 64" fill="none" stroke="#332720" stroke-width="2" stroke-linecap="round"/>
      </g>

      <!-- Lavender Folded Knitted Blanket -->
      <path d="M22 68 Q58 62 98 68 L98 100 Q58 106 22 100 Z" fill="#8B5CF6" stroke="#6D28D9" stroke-width="2.5"/>
      <!-- Knitted Texture Stitches -->
      <path d="M28 76 Q45 74 60 76 Q75 74 92 76" fill="none" stroke="#DDD6FE" stroke-width="1.8" stroke-dasharray="3,3"/>
      <path d="M28 86 Q45 84 60 86 Q75 84 92 86" fill="none" stroke="#DDD6FE" stroke-width="1.8" stroke-dasharray="3,3"/>
    </svg>
  `;
}



