/* ==========================================================================
   Book of Life / Life OS - MARGO Framework & Sunday-Start Habit Engine
   ========================================================================== */

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
    description: 'Skincare AM/PM, signature outfits, grooming'
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
  { name: 'Workout x3/week', bucket: 'M', cadence: 'weekly', target: 3, icon: 'dumbbell', description: 'Dedicated workout session 3x per week' },
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
    emoji: '🔴',
    defaultAction: 'Request itemized superbill from provider',
    actor: 'You'
  },
  ready_to_send: {
    id: 'ready_to_send',
    label: 'Send to Included Health',
    emoji: '🟡',
    defaultAction: 'Upload superbill to Included Health app',
    actor: 'You'
  },
  with_included_health: {
    id: 'with_included_health',
    label: 'With Included Health',
    emoji: '🔵',
    defaultAction: 'Waiting on Included Health / Insurance review',
    actor: 'Included Health'
  },
  check_due: {
    id: 'check_due',
    label: 'Check / Deposit Due',
    emoji: '🟢',
    defaultAction: 'Watch Monarch / Bank for reimbursement deposit',
    actor: 'Monarch'
  },
  settled: {
    id: 'settled',
    label: 'Settled & Reconciled',
    emoji: '⚪',
    defaultAction: 'Reconciled in Monarch — All set!',
    actor: 'Done'
  }
};

function getDefaultNextAction(stage) {
  return CLAIM_STAGES[stage] ? CLAIM_STAGES[stage].defaultAction : '';
}

