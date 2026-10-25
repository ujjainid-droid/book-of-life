/* ==========================================================================
   Book of Life / Life OS - margo Sanctuary Daily Sheet Renderer
   ========================================================================== */

let activeTrackingDate = formatDateIso(new Date());
let sanctuaryJournalTab = 'today'; // 'today' | 'archive'
let sanctuaryJournalEditing = false;
let sanctuaryArchiveFilter = 'all'; // 'all' | 'last_week' | 'this_month'
let mockupHaircareExpanded = false;

function toggleMockupHaircare() {
  mockupHaircareExpanded = !mockupHaircareExpanded;
  renderDailySheet();
}
window.toggleMockupHaircare = toggleMockupHaircare;

/* --------------------------------------------------------------------------
   Goal Progress Pacers for Move & Stand (Time-of-Day Adaptive Engine)
   Weekdays: 7:00 AM – 9:00 PM (14h)
   Weekends: 9:00 AM – 10:00 PM (13h)
   -------------------------------------------------------------------------- */
function formatHoursMinutes(h) {
  if (h <= 0) return '0m';
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}
window.formatHoursMinutes = formatHoursMinutes;

function getGoalPacerData(targetDateStr = activeTrackingDate) {
  const todayIso = formatDateIso(new Date());
  const isToday = (targetDateStr === todayIso);

  const [y, m, d] = targetDateStr.split('-').map(Number);
  const targetDateObj = new Date(y, m - 1, d);
  const dayOfWeek = targetDateObj.getDay(); // 0 = Sun, 6 = Sat
  const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

  const schedule = (typeof storage !== 'undefined' && typeof storage.getPacerSchedule === 'function')
    ? storage.getPacerSchedule()
    : {
        weekday: { start: 7, end: 21, label: 'Weekday · 7 AM – 9 PM' },
        weekend: { start: 9, end: 22, label: 'Weekend · 9 AM – 10 PM' }
      };

  const activeConfig = isWeekend ? schedule.weekend : schedule.weekday;
  const startHour = Number(activeConfig.start) || (isWeekend ? 9 : 7);
  const endHour = Number(activeConfig.end) || (isWeekend ? 22 : 21);
  const totalWindowHours = Math.max(1, endHour - startHour);

  // Exact 25%, 50%, 75%, 100% quartile benchmark hours
  // Weekday: 7 AM – 9 PM (14h) -> 25% at 10:30 AM, 50% at 2:00 PM, 75% at 5:30 PM, 100% at 9:00 PM
  // Weekend: 9 AM – 10 PM (13h) -> 25% at 12:15 PM, 50% at 3:30 PM, 75% at 6:45 PM, 100% at 10:00 PM
  const q25Hour = startHour + (totalWindowHours * 0.25);
  const q50Hour = startHour + (totalWindowHours * 0.50);
  const q75Hour = startHour + (totalWindowHours * 0.75);
  const q100Hour = endHour;

  const q25TimeStr = isWeekend ? '12:15 PM' : '10:30 AM';
  const q50TimeStr = isWeekend ? '3:30 PM' : '2:00 PM';
  const q75TimeStr = isWeekend ? '6:45 PM' : '5:30 PM';
  const q100TimeStr = isWeekend ? '10:00 PM' : '9:00 PM';
  const startHourStr = isWeekend ? '9:00 AM' : '7:00 AM';
  const endHourStr = isWeekend ? '10:00 PM' : '9:00 PM';

  // Floor midpoint alias
  const floorBenchmarkHour = q50Hour;
  const floorBenchmarkTimeStr = q50TimeStr;

  let currentHourDecimal = 0;
  let isPastDay = false;
  let isFutureDay = false;

  if (isToday) {
    const now = new Date();
    currentHourDecimal = now.getHours() + (now.getMinutes() / 60) + (now.getSeconds() / 3600);
  } else if (targetDateStr < todayIso) {
    isPastDay = true;
    currentHourDecimal = endHour + 1; // Completed past day
  } else {
    isFutureDay = true;
    currentHourDecimal = 0; // Future day
  }

  let dayPhase = 'active'; // 'pre' | 'active' | 'ended'
  let elapsedHours = 0;
  let remainingHours = 0;
  let elapsedPct = 0;

  if (currentHourDecimal < startHour) {
    dayPhase = 'pre';
    elapsedHours = 0;
    remainingHours = totalWindowHours;
    elapsedPct = 0;
  } else if (currentHourDecimal >= endHour) {
    dayPhase = 'ended';
    elapsedHours = totalWindowHours;
    remainingHours = 0;
    elapsedPct = 100;
  } else {
    dayPhase = 'active';
    elapsedHours = currentHourDecimal - startHour;
    remainingHours = Math.max(0, endHour - currentHourDecimal);
    elapsedPct = Math.min(100, Math.max(0, (elapsedHours / totalWindowHours) * 100));
  }

  const targetPct = dayPhase === 'ended' ? 100 : (dayPhase === 'pre' ? 0 : Math.round(elapsedPct));

  return {
    isWeekend,
    isToday,
    isPastDay,
    isFutureDay,
    dayPhase,
    startHour,
    endHour,
    startHourStr,
    endHourStr,
    totalWindowHours,
    q25Hour,
    q50Hour,
    q75Hour,
    q100Hour,
    q25TimeStr,
    q50TimeStr,
    q75TimeStr,
    q100TimeStr,
    floorBenchmarkHour,
    floorBenchmarkTimeStr,
    currentHourDecimal,
    elapsedHours,
    remainingHours,
    elapsedPct,
    targetPct,
    scheduleLabel: activeConfig.label || (isWeekend ? 'Weekend · 9 AM – 10 PM' : 'Weekday · 7 AM – 9 PM')
  };
}
window.getGoalPacerData = getGoalPacerData;

function getMoveAnchorPacer(moveStage, pacerData) {
  const { dayPhase, elapsedPct, remainingHours, q25TimeStr, q50TimeStr, q75TimeStr, q100TimeStr, isToday, isPastDay, endHourStr, startHourStr, targetPct } = pacerData;

  // Move goal = 300 cal (25% = 75, 50% = 150, 75% = 225, 100% = 300)
  const progressVal = Math.round((moveStage || 0) * 100);
  const delta = Math.round(progressVal - targetPct);

  if (moveStage === 1) {
    return {
      statusClass: 'pacer-ahead',
      badgeText: '300/300 Closed ✨',
      sublineLeft: '100% closed (300/300 cal) · Full movement momentum achieved ⚡',
      sublineRight: '<strong>Complete</strong>',
      progressVal: 100,
      delta: 0
    };
  }

  if (moveStage === 0.75) {
    const statusClass = delta >= 5 ? 'pacer-ahead' : (delta >= -5 ? 'pacer-ontrack' : (delta >= -20 ? 'pacer-attention' : 'pacer-behind'));
    const badgeText = delta >= 5 ? `+${delta}% Ahead` : (delta >= -5 ? 'On Track' : `${delta}% Behind`);
    return {
      statusClass,
      badgeText,
      sublineLeft: `75% (225 cal) achieved (+8 XP) · Push for 300 cal before ${q100TimeStr}`,
      sublineRight: `<strong>Target: ${targetPct}%</strong> (${delta >= 0 ? `+${delta}%` : `${delta}%`})`,
      progressVal: 75,
      delta
    };
  }

  if (moveStage === 0.5) {
    const statusClass = delta >= 5 ? 'pacer-ahead' : (delta >= -5 ? 'pacer-ontrack' : (delta >= -20 ? 'pacer-attention' : 'pacer-behind'));
    const badgeText = delta >= 5 ? `+${delta}% Ahead` : (delta >= -5 ? 'On Track' : `${delta}% Behind`);
    return {
      statusClass,
      badgeText,
      sublineLeft: `50% floor (150 cal) locked 🛡️ (+5 XP) · Next: 225 cal by ${q75TimeStr}`,
      sublineRight: `<strong>Target: ${targetPct}%</strong> (${delta >= 0 ? `+${delta}%` : `${delta}%`})`,
      progressVal: 50,
      delta
    };
  }

  if (moveStage === 0.25) {
    const statusClass = delta >= 5 ? 'pacer-ahead' : (delta >= -5 ? 'pacer-ontrack' : (delta >= -20 ? 'pacer-attention' : 'pacer-behind'));
    const badgeText = delta >= 5 ? `+${delta}% Ahead` : (delta >= -5 ? 'On Track' : `${delta}% Behind`);
    return {
      statusClass,
      badgeText,
      sublineLeft: `25% (75 cal) logged (+2 XP) · Reach 150 cal floor before ${q50TimeStr}`,
      sublineRight: `<strong>Target: ${targetPct}%</strong> (${delta >= 0 ? `+${delta}%` : `${delta}%`})`,
      progressVal: 25,
      delta
    };
  }

  // moveStage === 0 (Off)
  if (!isToday && isPastDay) {
    return {
      statusClass: 'pacer-neutral',
      badgeText: 'Missed',
      sublineLeft: 'Anchor was not logged for this past date',
      sublineRight: 'Past Date',
      progressVal: 0,
      delta: 0
    };
  }

  if (dayPhase === 'pre') {
    return {
      statusClass: 'pacer-neutral',
      badgeText: 'Pre-Day',
      sublineLeft: `Day begins at ${startHourStr} · 25% target (75 cal) at ${q25TimeStr}`,
      sublineRight: `Starts ${startHourStr}`,
      progressVal: 0,
      delta: 0
    };
  }

  if (dayPhase === 'ended') {
    return {
      statusClass: 'pacer-behind',
      badgeText: 'Day Concluded',
      sublineLeft: `Active window ended at ${endHourStr} · Rest & reset for tomorrow`,
      sublineRight: 'Concluded',
      progressVal: 0,
      delta: -100
    };
  }

  // Active day (0% progress)
  const statusClass = delta >= -5 ? 'pacer-ontrack' : (delta >= -25 ? 'pacer-attention' : 'pacer-behind');
  const badgeText = delta >= -5 ? 'On Pace' : `${delta}% Behind`;
  let sublineLeft = '';
  if (elapsedPct < 25) {
    sublineLeft = `On pace · 25% milestone (75 cal) at ${q25TimeStr} (Floor: 150 cal by ${q50TimeStr})`;
  } else if (elapsedPct < 50) {
    sublineLeft = `Past ${q25TimeStr} · Secure 50% floor (150 cal, +5 XP) before ${q50TimeStr}`;
  } else if (elapsedPct < 75) {
    sublineLeft = `Past ${q50TimeStr} floor · Lock 150 cal floor soon to protect streak!`;
  } else {
    sublineLeft = `Evening crunch · Reach 150 cal floor to defend streak!`;
  }

  return {
    statusClass,
    badgeText,
    sublineLeft,
    sublineRight: `<strong>Target: ${targetPct}%</strong> (${delta}%)`,
    progressVal: 0,
    delta
  };
}
window.getMoveAnchorPacer = getMoveAnchorPacer;

function getStandRingPacer(standStage, pacerData) {
  const { dayPhase, elapsedPct, remainingHours, q25TimeStr, q50TimeStr, q75TimeStr, q100TimeStr, isToday, isPastDay, endHourStr, startHourStr, targetPct } = pacerData;

  // Stand goal = 12 (25% = 3, 50% = 6, 75% = 9, 100% = 12)
  const progressVal = Math.round((standStage || 0) * 100);
  const delta = Math.round(progressVal - targetPct);

  if (standStage === 1) {
    return {
      statusClass: 'pacer-ahead',
      badgeText: '12/12 Closed ✨',
      sublineLeft: '100% closed (12/12) · Stand ring fully closed ⚡',
      sublineRight: '<strong>Complete</strong>',
      progressVal: 100,
      delta: 0
    };
  }

  if (standStage === 0.75) {
    const statusClass = delta >= 5 ? 'pacer-ahead' : (delta >= -5 ? 'pacer-ontrack' : (delta >= -20 ? 'pacer-attention' : 'pacer-behind'));
    const badgeText = delta >= 5 ? `+${delta}% Ahead` : (delta >= -5 ? 'On Track' : `${delta}% Behind`);
    return {
      statusClass,
      badgeText,
      sublineLeft: `75% (9) logged (+8 XP) · 3 more to close 12/12 before ${q100TimeStr}`,
      sublineRight: `<strong>Target: ${targetPct}%</strong> (${delta >= 0 ? `+${delta}%` : `${delta}%`})`,
      progressVal: 75,
      delta
    };
  }

  if (standStage === 0.5) {
    const statusClass = delta >= 5 ? 'pacer-ahead' : (delta >= -5 ? 'pacer-ontrack' : (delta >= -20 ? 'pacer-attention' : 'pacer-behind'));
    const badgeText = delta >= 5 ? `+${delta}% Ahead` : (delta >= -5 ? 'On Track' : `${delta}% Behind`);
    return {
      statusClass,
      badgeText,
      sublineLeft: `50% floor (6) locked 🛡️ (+5 XP) · Next: 9 by ${q75TimeStr}`,
      sublineRight: `<strong>Target: ${targetPct}%</strong> (${delta >= 0 ? `+${delta}%` : `${delta}%`})`,
      progressVal: 50,
      delta
    };
  }

  if (standStage === 0.25) {
    const statusClass = delta >= 5 ? 'pacer-ahead' : (delta >= -5 ? 'pacer-ontrack' : (delta >= -20 ? 'pacer-attention' : 'pacer-behind'));
    const badgeText = delta >= 5 ? `+${delta}% Ahead` : (delta >= -5 ? 'On Track' : `${delta}% Behind`);
    return {
      statusClass,
      badgeText,
      sublineLeft: `25% (3) logged (+2 XP) · Reach 6 floor before ${q50TimeStr}`,
      sublineRight: `<strong>Target: ${targetPct}%</strong> (${delta >= 0 ? `+${delta}%` : `${delta}%`})`,
      progressVal: 25,
      delta
    };
  }

  // standStage === 0 (Off)
  if (!isToday && isPastDay) {
    return {
      statusClass: 'pacer-neutral',
      badgeText: 'Missed',
      sublineLeft: 'Stand ring was not logged for this past date',
      sublineRight: 'Past Date',
      progressVal: 0,
      delta: 0
    };
  }

  if (dayPhase === 'pre') {
    return {
      statusClass: 'pacer-neutral',
      badgeText: 'Pre-Day',
      sublineLeft: `Day begins at ${startHourStr} · 25% target (3) by ${q25TimeStr}`,
      sublineRight: `Starts ${startHourStr}`,
      progressVal: 0,
      delta: 0
    };
  }

  if (dayPhase === 'ended') {
    return {
      statusClass: 'pacer-behind',
      badgeText: 'Day Concluded',
      sublineLeft: `Active window ended at ${endHourStr} · Rest & reset for tomorrow`,
      sublineRight: 'Concluded',
      progressVal: 0,
      delta: -100
    };
  }

  // Active day (0% progress)
  const statusClass = delta >= -5 ? 'pacer-ontrack' : (delta >= -25 ? 'pacer-attention' : 'pacer-behind');
  const badgeText = delta >= -5 ? 'On Pace' : `${delta}% Behind`;
  let sublineLeft = '';
  if (elapsedPct < 25) {
    sublineLeft = `On pace · 25% milestone (3) by ${q25TimeStr} (Floor: 6 by ${q50TimeStr})`;
  } else if (elapsedPct < 50) {
    sublineLeft = `Past ${q25TimeStr} · Reach 6 floor by ${q50TimeStr}`;
  } else if (elapsedPct < 75) {
    sublineLeft = `Past ${q50TimeStr} floor · Lock 6 now to protect streak!`;
  } else {
    sublineLeft = `Low buffer · Only ${formatHoursMinutes(remainingHours)} left · Stand now to save streak!`;
  }

  return {
    statusClass,
    badgeText,
    sublineLeft,
    sublineRight: `<strong>Target: ${targetPct}%</strong> (${delta}%)`,
    progressVal: 0,
    delta
  };
}
window.getStandRingPacer = getStandRingPacer;

function renderCoverPage() {
  renderDailySheet();
}

const AURORA_GOOD_CHIPS = [
  '🥑 Made a Good Choice',
  '🚶 Outdoor Walk',
  '🏋️ Worked Out',
  '🍎 Fruits',
  '🥦 Vegetables',
  '😴 Slept Well',
  '🛏️ Bed on Time (10p Wk / 12a Wknd)',
  '🍽️ Didn\'t Eat Out'
];
const AURORA_BAD_CHIPS = [
  '🍟 Junk Food',
  '🍭 Too Much Sugar',
  '📱 Doomscrolled',
  '🍩 Late-Night Snacking'
];
/* --------------------------------------------------------------------------
   Bed Potato Daily Roasts Catalog & Day-to-Day Midnight Rotation Engine
   -------------------------------------------------------------------------- */
const BED_POTATO_ROASTS = [
  'The bar was in hell, but look at you contemplating it.',
  'You actually got vertical today. Society thanks you for the bare minimum.',
  'Operating at dangerously low momentum. The mattress has filed for adverse possession.',
  'Overthinking burned exactly zero calories. Put your shoes on.',
  'Look at you prioritizing horizontal living. Your bed sheets are so proud.',
  'Rumor has it you\'re planning to stand up today. Let\'s not start wild rumors.',
  'Your pillows are staging an intervention. They need personal space.',
  'The ceiling fan has seen enough of your face for one morning. Move.',
  'Discipline is remembering what you promised yourself before you met this blanket.',
  'One good choice before 2 PM prevents a full bedtime existential crisis.',
  'You\'ve been in potato mode for 12 hours. Time to sprout, spud.',
  'Netflix just asked if you\'re still alive, not just watching.',
  'Even a sourdough starter has more active fermentation than your morning.',
  'Your Stand ring is sitting at zero crying into its silicon strap.',
  'Gravity didn\'t get stronger overnight. It\'s just you. Up you go.',
  'Your future self sent a postcard from tonight: "Please just do the Move ring."',
  'Horizontal champion of the world. Time to defend your title in an upright stance.',
  'The floor isn\'t going to stand on itself. Give it some company.',
  'Congratulations on breathing. Now let\'s try walking across the room.',
  'You are exactly one vertical movement away from defying biological expectations.',
  'The blanket burrito was majestic, but the kitchen has called last orders.',
  'A 10-minute walk cures about 80% of what\'s currently annoying you.',
  'Don\'t make me poke you again. You know what needs doing today.',
  'Your phone battery has dropped 40% and you haven\'t moved four inches.',
  'If inertia were an Olympic sport, you\'d take home the gold-plated duvet.',
  'The bar wasn\'t lowered, it was buried. Grab a shovel and start stepping.',
  'Rise and shine? How about rise and mildly participate in reality.',
  'Your Apple Watch just buzzed out of sheer boredom. Stand up.',
  'Comfort zones are great, but nothing ever grew in bed except laundry piles.',
  'You survived yesterday. Today\'s targets stand no chance once you actually get up.',
  'Look at you contemplating verticality. We love to see tentative ambition.',
  'The sofa is getting jealous of how much quality time you\'re giving the bed.',
  'You can\'t scroll your way to closed rings. Hands off the glass, feet on the floor.',
  'Energy doesn\'t show up before you move. Move first, motivation second.',
  'Rest is sacred. But whatever you\'re doing right now is legally loitering.'
];

const AURORA_QUOTES = BED_POTATO_ROASTS;
let auroraQuoteIdx = 0;
let potatoPokeOffset = 0;

function getBedPotatoRoast(dateStr = activeTrackingDate, offset = 0) {
  if (!BED_POTATO_ROASTS || BED_POTATO_ROASTS.length === 0) {
    return 'The bar was in hell, but look at you contemplating it.';
  }
  const target = dateStr || activeTrackingDate || (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : '2026-10-17');
  const parts = String(target).split('-').map(Number);
  const year = parts[0] || 2026;
  const month = parts[1] || 1;
  const day = parts[2] || 1;

  // Day-of-year calculation for deterministic rotation
  const dObj = new Date(year, month - 1, day);
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.max(0, Math.floor((dObj - startOfYear) / (1000 * 60 * 60 * 24)));

  const totalIdx = Math.abs(dayOfYear + (year * 7) + offset) % BED_POTATO_ROASTS.length;
  return BED_POTATO_ROASTS[totalIdx];
}
window.getBedPotatoRoast = getBedPotatoRoast;

function getAuroraDayProgress() {
  const d = new Date();
  const m = d.getHours() * 60 + d.getMinutes();
  return Math.max(0, Math.min(1, (m - 420) / 840));
}

function getAuroraPaceText(kind, val, anchIdx) {
  const max = kind === 'move' ? 300 : (kind === 'steps' ? 10000 : 12);
  const unit = kind === 'move' ? 'cal' : (kind === 'steps' ? 'steps' : 'hrs');
  const fmt = (n) => (kind === 'steps' ? Number(n).toLocaleString() : n);
  const TIMES = { 25: '10:30 AM', 50: '2:00 PM', 75: '5:30 PM', 100: '9:00 PM' };
  if (!anchIdx) {
    return `No anchor set · floor ${fmt(max / 2)} ${unit} by 2:00 PM`;
  }
  const pct = [0, 25, 50, 75, 100][anchIdx] || 50;
  const target = (max * pct) / 100;
  const pr = getAuroraDayProgress();
  if (val >= max && pct === 100) {
    return `Closed ✨ · 100% goal (${fmt(max)} ${unit}) achieved!`;
  }
  const status = val >= target ? 'Hit' : (val >= max * pr ? 'On pace' : 'Behind pace');
  return `${status} · ${pct}% milestone (${fmt(target)} ${unit}) by ${TIMES[pct] || '9:00 PM'}`;
}

function auroraStepMoveCal(delta, dateStr = activeTrackingDate) {
  const s = storage.getAuroraDayState(dateStr);
  const nextMove = Math.max(0, Math.min(300, (s.moveCal || 0) + delta));
  storage.saveAuroraDayState(dateStr, { moveCal: nextMove });
  renderDailySheet();
}
window.auroraStepMoveCal = auroraStepMoveCal;

function auroraStepSteps(delta, dateStr = activeTrackingDate) {
  const s = storage.getAuroraDayState(dateStr);
  const nextSteps = Math.max(0, (Number(s.steps) || 0) + delta);
  storage.saveAuroraDayState(dateStr, { steps: nextSteps });
  renderDailySheet();
}
window.auroraStepSteps = auroraStepSteps;

function auroraSetAnchorChip(kind, idx, dateStr = activeTrackingDate) {
  const s = storage.getAuroraDayState(dateStr);
  const nextAnch = { ...(s.anch || { move: 0, stand: 0, steps: 0 }), [kind]: idx };
  const patch = { anch: nextAnch };
  // Quick-setting Move calories
  if (kind === 'move' && idx > 0) {
    const milestoneCal = [0, 75, 150, 225, 300][idx] || 0;
    patch.moveCal = milestoneCal;
  } else if (kind === 'move' && idx === 0) {
    patch.moveCal = 0;
  }

  // Quick-setting Stand hours
  if (kind === 'stand' && idx > 0) {
    const targetHours = [0, 3, 6, 9, 12][idx] || 0;
    patch.hours = Array.from({ length: 12 }, (_, i) => i < targetHours);
  } else if (kind === 'stand' && idx === 0) {
    patch.hours = Array.from({ length: 12 }, () => false);
  }

  // Quick-setting 10K Steps
  if (kind === 'steps' && idx > 0) {
    const targetSteps = [0, 2500, 5000, 7500, 10000][idx] || 0;
    patch.steps = targetSteps;
  } else if (kind === 'steps' && idx === 0) {
    patch.steps = 0;
  }

  storage.saveAuroraDayState(dateStr, patch);
  renderDailySheet();
}
window.auroraSetAnchorChip = auroraSetAnchorChip;

function auroraToggleStandHour(hourIdx, dateStr = activeTrackingDate) {
  const s = storage.getAuroraDayState(dateStr);
  const nextHours = [...(s.hours || [])];
  while (nextHours.length < 12) nextHours.push(false);
  nextHours[hourIdx] = !nextHours[hourIdx];
  storage.saveAuroraDayState(dateStr, { hours: nextHours });
  renderDailySheet();
}
window.auroraToggleStandHour = auroraToggleStandHour;

function auroraToggleQuickChip(name, kind, dateStr = activeTrackingDate) {
  const s = storage.getAuroraDayState(dateStr);
  const nextChips = [...(s.chips || [])];
  const idx = nextChips.indexOf(name);
  if (idx > -1) {
    nextChips.splice(idx, 1);
    storage.recordChoice(kind === 'g' ? 'good' : 'not', -1, dateStr);
  } else {
    nextChips.push(name);
    storage.recordChoice(kind === 'g' ? 'good' : 'not', 1, dateStr);
  }
  storage.saveAuroraDayState(dateStr, { chips: nextChips });
  renderDailySheet();
}
window.auroraToggleQuickChip = auroraToggleQuickChip;

function auroraToggleMood(moodIdx, dateStr = activeTrackingDate) {
  // moodIdx 0..4 maps to HEALTH_LEVELS 5..1 (Thriving=5, Solid=4, Surviving=3, Dragging=2, Zombie=1)
  const targetLvl = 5 - moodIdx;
  const currentLvl = storage.getHealthLevel(dateStr);
  if (currentLvl === targetLvl) {
    storage.clearHealthLevel(dateStr);
  } else {
    storage.setHealthLevel(targetLvl, dateStr);
  }
  renderDailySheet();
}
window.auroraToggleMood = auroraToggleMood;

function auroraPokeMascot() {
  potatoPokeOffset++;
  auroraQuoteIdx = (auroraQuoteIdx + 1) % BED_POTATO_ROASTS.length;
  const roast = getBedPotatoRoast(activeTrackingDate, potatoPokeOffset);
  const qEl = document.getElementById('quote');
  if (qEl) {
    qEl.textContent = roast;
  }
  const mascotSvg = document.querySelector('.aurora-app .mascot svg');
  if (mascotSvg) {
    mascotSvg.classList.remove('mascot-poked');
    void mascotSvg.offsetWidth;
    mascotSvg.classList.add('mascot-poked');
  }
}
window.auroraPokeMascot = auroraPokeMascot;

function auroraPromptCustomMove(dateStr = activeTrackingDate) {
  const name = window.prompt('Name your custom move');
  if (name && name.trim()) {
    storage.addDayGoal(name.trim(), dateStr);
    if (typeof showToast === 'function') {
      showToast(`Saved "${name.trim()}"`);
    }
    renderDailySheet();
  }
}
window.auroraPromptCustomMove = auroraPromptCustomMove;

let letsDoScope = 'today'; // 'today' | 'range'
let letsDoStartDate = '';
let letsDoEndDate = '';

function switchLetsDoScope(scope) {
  letsDoScope = scope;
  const row = document.getElementById('lets-do-range-row');
  const btnToday = document.getElementById('scope-btn-today');
  const btnRange = document.getElementById('scope-btn-range');
  if (btnToday) btnToday.classList.toggle('active', scope === 'today');
  if (btnRange) btnRange.classList.toggle('active', scope === 'range');
  if (row) {
    row.style.display = (scope === 'range') ? 'flex' : 'none';
  }
  const input = document.getElementById('inline-custom-habit-input');
  if (input) {
    input.placeholder = 'Do something fun!';
  }
}
window.switchLetsDoScope = switchLetsDoScope;

function applyLetsDoPreset(days) {
  const startInput = document.getElementById('lets-do-start-date');
  const endInput = document.getElementById('lets-do-end-date');
  const baseIso = (startInput && startInput.value) ? startInput.value : activeTrackingDate;
  const parseFn = (typeof parseDateIso === 'function') ? parseDateIso : (s => new Date(s));
  const formatFn = (typeof formatDateIso === 'function') ? formatDateIso : (d => d.toISOString().split('T')[0]);
  const startD = parseFn(baseIso);
  const endD = new Date(startD);
  endD.setDate(endD.getDate() + (days - 1));
  const endIso = formatFn(endD);
  if (endInput) {
    endInput.value = endIso;
  }
  letsDoEndDate = endIso;
  if (startInput) {
    letsDoStartDate = startInput.value;
  }
}
window.applyLetsDoPreset = applyLetsDoPreset;

function updateLetsDoDates() {
  const startInput = document.getElementById('lets-do-start-date');
  const endInput = document.getElementById('lets-do-end-date');
  if (startInput) letsDoStartDate = startInput.value;
  if (endInput) letsDoEndDate = endInput.value;
}
window.updateLetsDoDates = updateLetsDoDates;

function handleLetsDoKeydown(event, dateStr = activeTrackingDate) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    submitInlineCustomHabit(event, dateStr);
  }
}
window.handleLetsDoKeydown = handleLetsDoKeydown;

function submitInlineCustomHabit(event, dateStr = activeTrackingDate) {
  if (event) event.preventDefault();
  const input = document.getElementById('inline-custom-habit-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;

  if (letsDoScope === 'range') {
    const startInput = document.getElementById('lets-do-start-date');
    const endInput = document.getElementById('lets-do-end-date');
    let startIso = startInput ? startInput.value : dateStr;
    let endIso = endInput ? endInput.value : dateStr;
    if (!startIso) startIso = dateStr;
    if (!endIso) endIso = startIso;
    if (endIso < startIso) {
      const tmp = startIso; startIso = endIso; endIso = tmp;
    }

    const added = storage.addRangeGoal(val, startIso, endIso);
    input.value = '';
    if (typeof showToast === 'function') {
      const parseFn = (typeof parseDateIso === 'function') ? parseDateIso : (s => new Date(s));
      const startObj = parseFn(startIso);
      const endObj = parseFn(endIso);
      const sLbl = startObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const eLbl = endObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const rLbl = (startIso === endIso) ? sLbl : `${sLbl} – ${eLbl}`;
      showToast(`✓ Added "${val}" for ${rLbl} (${added.length} days, +15 XP/day)`);
    }
  } else {
    storage.addDayGoal(val, dateStr);
    input.value = '';
    if (typeof showToast === 'function') {
      const parseFn = (typeof parseDateIso === 'function') ? parseDateIso : (s => new Date(s));
      const dObj = parseFn(dateStr);
      const todayIso = (typeof formatDateIso === 'function') ? formatDateIso(new Date()) : '2026-10-17';
      const dayLabel = (dateStr === todayIso) ? 'Today' : dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      showToast(`✓ Added "${val}" for ${dayLabel} (+15 XP)`);
    }
  }
  renderDailySheet();
}
window.submitInlineCustomHabit = submitInlineCustomHabit;

// --- Weight Tracker Actions ---

function auroraStepWeight(delta, dateStr = activeTrackingDate) {
  if (typeof storage.stepWeight !== 'function') return;
  const updatedWeight = storage.stepWeight(delta, dateStr);
  const stats = storage.getWeightStats(dateStr);
  if (typeof showToast === 'function') {
    if (stats.isAtTarget) {
      showToast(`✓ Weight: ${updatedWeight.toFixed(1)} lbs · Target Met! ✨`);
      if (typeof confetti === 'function') {
        try { confetti({ particleCount: 30, spread: 55, origin: { y: 0.7 } }); } catch (e) {}
      }
    } else {
      const diffText = stats.diff > 0 ? `+${stats.diff.toFixed(1)} lbs over` : `${stats.diff.toFixed(1)} lbs under`;
      showToast(`✓ Weight: ${updatedWeight.toFixed(1)} lbs (${diffText} 110 target)`);
    }
  }
  renderDailySheet();
}
window.auroraStepWeight = auroraStepWeight;

function auroraSaveWeightInput(val, dateStr = activeTrackingDate) {
  if (val === null || val === undefined || String(val).trim() === '') {
    storage.setWeight(null, dateStr);
    if (typeof showToast === 'function') showToast(`Cleared weight entry for ${dateStr}`);
  } else {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
      if (typeof showToast === 'function') showToast('Please enter a valid weight (e.g. 110.0)');
      renderDailySheet();
      return;
    }
    const updatedWeight = storage.setWeight(num, dateStr);
    const stats = storage.getWeightStats(dateStr);
    if (typeof showToast === 'function') {
      if (stats.isAtTarget) {
        showToast(`✓ Weight: ${updatedWeight.toFixed(1)} lbs · Target Met! ✨`);
        if (typeof confetti === 'function') {
          try { confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } }); } catch (e) {}
        }
      } else {
        const diffText = stats.diff > 0 ? `+${stats.diff.toFixed(1)} lbs over` : `${stats.diff.toFixed(1)} lbs under`;
        showToast(`✓ Weight: ${updatedWeight.toFixed(1)} lbs (${diffText} 110 target)`);
      }
    }
  }
  renderDailySheet();
}
window.auroraSaveWeightInput = auroraSaveWeightInput;

function auroraClearWeight(dateStr = activeTrackingDate) {
  if (typeof storage.setWeight !== 'function') return;
  storage.setWeight(null, dateStr);
  if (typeof showToast === 'function') {
    showToast(`Cleared weight log for ${dateStr}`);
  }
  renderDailySheet();
}
window.auroraClearWeight = auroraClearWeight;

let activePeriodGoalId = null;
let periodGoalModalMode = 'log'; // 'log' | 'edit' | 'new'

function selectAuroraPeriodGoal(goalId) {
  activePeriodGoalId = goalId;
  renderDailySheet();
}
window.selectAuroraPeriodGoal = selectAuroraPeriodGoal;

function submitAuroraPeriodGoalDay(goalId, dateStr = activeTrackingDate) {
  const input = document.getElementById(`aurora-pg-input-${goalId}`);
  if (!input) return;
  const raw = input.value.trim();
  const updatedGoal = storage.logPeriodGoalDay(goalId, dateStr, raw);
  if (updatedGoal && typeof showToast === 'function') {
    const stats = storage.getPeriodGoalStats(updatedGoal, dateStr);
    if (raw === '') {
      showToast(`Cleared entry for ${dateStr}`);
    } else {
      showToast(`✓ Logged ${Number(raw).toLocaleString()} ${updatedGoal.unit} · Avg: ${stats.currentAvg.toLocaleString()} (${stats.daysLeft}d left, need ${stats.neededAvgForBalance.toLocaleString()}/d)`);
    }
  }
  renderDailySheet();
}
window.submitAuroraPeriodGoalDay = submitAuroraPeriodGoalDay;

function stepAuroraPeriodGoalDay(goalId, delta, dateStr = activeTrackingDate) {
  const goal = storage.getPeriodGoal(goalId);
  if (!goal) return;
  const currentRaw = (goal.logs && goal.logs[dateStr] !== undefined && goal.logs[dateStr] !== null && goal.logs[dateStr] !== '')
    ? Number(goal.logs[dateStr])
    : 0;
  const nextVal = Math.max(0, currentRaw + delta);
  storage.logPeriodGoalDay(goalId, dateStr, nextVal);
  renderDailySheet();
}
window.stepAuroraPeriodGoalDay = stepAuroraPeriodGoalDay;

function renderAuroraPeriodGoalsWidget(dateStr = activeTrackingDate) {
  if (typeof storage.getPeriodGoals !== 'function') return '';
  const goals = storage.getPeriodGoals();
  if (!goals || goals.length === 0) return '';

  if (!activePeriodGoalId || !goals.some(g => g.id === activePeriodGoalId)) {
    activePeriodGoalId = goals[0].id;
  }
  const goal = storage.getPeriodGoal(activePeriodGoalId);
  if (!goal) return '';

  // Automatically remove October 10k steps goal after Oct 31
  if ((goal.id === 'pg-oct-steps' || (goal.endDate && goal.endDate <= '2026-10-31')) && dateStr > '2026-10-31') {
    return '';
  }

  const stats = storage.getPeriodGoalStats(goal, dateStr);
  const todayIso = formatDateIso(new Date());
  const dObj = parseDateIso(dateStr);
  const shortDayLabel = (dateStr === todayIso)
    ? 'Today'
    : dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const isAheadOrOnTrack = stats.loggedDaysCount > 0 && stats.currentAvg >= stats.targetAvg;
  const barColor = isAheadOrOnTrack
    ? 'var(--good, #2EBF91)'
    : (stats.avgProgressPct >= 75 ? 'var(--accent, #5CE1F0)' : 'var(--violet, #B5ABFF)');

  return `
    <section class="card panel span2 aurora-period-card" aria-labelledby="pgT" id="section-period-goal">
      <div class="between" style="gap:8px;flex-wrap:wrap">
        <div class="aurora-pg-title-row">
          <span class="ttl" id="pgT" style="color:var(--accent)">${escapeHtml(goal.title.toUpperCase())}</span>
          ${goals.length > 1 ? `
            <div class="aurora-pg-tabs">
              ${goals.map(g => `
                <button type="button" class="aurora-pg-tab ${g.id === goal.id ? 'on' : ''}" onclick="selectAuroraPeriodGoal('${g.id}')">${escapeHtml(g.title)}</button>
              `).join('')}
            </div>
          ` : ''}
        </div>
        <div class="row">
          <span class="num" id="pgAvgVal" style="font-size:22px">${stats.currentAvg.toLocaleString()}</span>
          <span class="unit">/ ${stats.targetAvg.toLocaleString()} ${escapeHtml(goal.unit)} avg</span>
        </div>
      </div>

      <div class="aurora-pg-bar-track" title="${stats.avgProgressPct}% of target average">
        <div class="aurora-pg-bar-fill" style="width:${Math.max(stats.loggedDaysCount > 0 ? 4 : 0, stats.avgProgressPct)}%;background:${barColor}"></div>
      </div>

      <div class="between muted" style="font-size:12px;flex-wrap:wrap;gap:4px">
        <span><strong style="color:var(--text)">${stats.daysLeft}d left</strong> · ${stats.loggedDaysCount}/${stats.totalDays} logged</span>
        <span>Balance avg needed: <strong style="color:${stats.neededAvgForBalance <= stats.targetAvg ? 'var(--good-text, #8FE9CB)' : 'var(--accent, #5CE1F0)'}">${stats.daysLeft > 0 ? stats.neededAvgForBalance.toLocaleString() : '0'}</strong>/${escapeHtml(goal.unit === 'steps' ? 'day' : 'd')}</span>
      </div>

      <div class="aurora-pg-inline-entry">
        <span class="aurora-pg-day-tag">${escapeHtml(shortDayLabel)}</span>
        <input type="number"
               id="aurora-pg-input-${goal.id}"
               class="aurora-pg-input"
               min="0"
               placeholder="Enter ${escapeHtml(goal.unit)}…"
               value="${stats.dayValue !== null ? stats.dayValue : ''}"
               onkeydown="if(event.key==='Enter'){event.preventDefault();submitAuroraPeriodGoalDay('${goal.id}','${dateStr}');}">
        <button type="button" class="aurora-pg-save-btn" onclick="submitAuroraPeriodGoalDay('${goal.id}', '${dateStr}')">${stats.dayValue !== null ? 'Update' : 'Log'}</button>
        <button type="button" class="aurora-pg-more-btn" onclick="openPeriodGoalModal('${goal.id}', 'log')" title="All days & goal settings">⋯</button>
      </div>
    </section>
  `;
}
window.renderAuroraPeriodGoalsWidget = renderAuroraPeriodGoalsWidget;

function openPeriodGoalModal(goalId = activePeriodGoalId, mode = 'log') {
  if (goalId) activePeriodGoalId = goalId;
  periodGoalModalMode = mode || 'log';
  renderPeriodGoalModalContent();
  const modal = document.getElementById('modal-period-goal');
  if (modal) modal.classList.add('active');
}
window.openPeriodGoalModal = openPeriodGoalModal;

function switchPeriodGoalModalTab(mode) {
  periodGoalModalMode = mode;
  renderPeriodGoalModalContent();
}
window.switchPeriodGoalModalTab = switchPeriodGoalModalTab;

function savePeriodGoalDayFromModal(goalId, dateStr, val) {
  storage.logPeriodGoalDay(goalId, dateStr, val);
  renderDailySheet();
  renderPeriodGoalModalContent();
}
window.savePeriodGoalDayFromModal = savePeriodGoalDayFromModal;

function submitPeriodGoalConfigForm(event, isNew = false) {
  if (event) event.preventDefault();
  const title = (document.getElementById('pg-form-title')?.value || '').trim();
  const targetAvg = Number(document.getElementById('pg-form-target')?.value || 10000);
  const unit = (document.getElementById('pg-form-unit')?.value || 'steps').trim();
  const startDate = document.getElementById('pg-form-start')?.value || '2026-10-01';
  const endDate = document.getElementById('pg-form-end')?.value || '2026-10-31';

  if (!title) return;
  const saved = storage.savePeriodGoal({
    id: isNew ? `pg-${Date.now()}` : activePeriodGoalId,
    title,
    targetAvg,
    unit,
    startDate,
    endDate
  });
  if (saved) {
    activePeriodGoalId = saved.id;
  }
  periodGoalModalMode = 'log';
  renderDailySheet();
  renderPeriodGoalModalContent();
  if (typeof showToast === 'function') {
    showToast(`✓ Saved period goal: "${title}"`);
  }
}
window.submitPeriodGoalConfigForm = submitPeriodGoalConfigForm;

function deletePeriodGoalFromModal(goalId) {
  const goals = storage.getPeriodGoals();
  if (goals.length <= 1) {
    if (typeof showToast === 'function') showToast('At least one period goal must remain.');
    return;
  }
  if (confirm('Delete this period goal and its logged entries?')) {
    storage.deletePeriodGoal(goalId);
    const remaining = storage.getPeriodGoals();
    activePeriodGoalId = remaining[0]?.id || null;
    periodGoalModalMode = 'log';
    renderDailySheet();
    renderPeriodGoalModalContent();
  }
}
window.deletePeriodGoalFromModal = deletePeriodGoalFromModal;

function renderPeriodGoalModalContent() {
  const body = document.getElementById('period-goal-modal-body');
  if (!body) return;

  const goals = storage.getPeriodGoals();
  const goal = storage.getPeriodGoal(activePeriodGoalId) || goals[0];
  if (!goal) return;

  const stats = storage.getPeriodGoalStats(goal, activeTrackingDate);
  const todayIso = formatDateIso(new Date());

  const tabsHtml = `
    <div class="aurora-pg-modal-tabs">
      <button type="button" class="aurora-pg-modal-tab ${periodGoalModalMode === 'log' ? 'on' : ''}" onclick="switchPeriodGoalModalTab('log')">📅 Daily Log (${stats.loggedDaysCount}/${stats.totalDays})</button>
      <button type="button" class="aurora-pg-modal-tab ${periodGoalModalMode === 'edit' ? 'on' : ''}" onclick="switchPeriodGoalModalTab('edit')">⚙️ Edit Goal</button>
      <button type="button" class="aurora-pg-modal-tab ${periodGoalModalMode === 'new' ? 'on' : ''}" onclick="switchPeriodGoalModalTab('new')">＋ New Period Goal</button>
    </div>
  `;

  if (periodGoalModalMode === 'edit' || periodGoalModalMode === 'new') {
    const isNew = (periodGoalModalMode === 'new');
    const gData = isNew
      ? { title: '', targetAvg: 10000, unit: 'steps', startDate: '2026-10-01', endDate: '2026-10-31' }
      : goal;

    body.innerHTML = `
      ${tabsHtml}
      <form class="aurora-pg-form" onsubmit="submitPeriodGoalConfigForm(event, ${isNew})">
        <div class="form-group">
          <label class="form-label">Goal Title</label>
          <input type="text" id="pg-form-title" class="form-input" placeholder="e.g. 10k Steps · October" value="${escapeHtml(gData.title)}" required>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label class="form-label">Target Daily Average</label>
            <input type="number" id="pg-form-target" class="form-input" min="1" value="${gData.targetAvg}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Unit</label>
            <input type="text" id="pg-form-unit" class="form-input" placeholder="steps, min, pages..." value="${escapeHtml(gData.unit)}" required>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label class="form-label">Start Date</label>
            <input type="date" id="pg-form-start" class="form-input" value="${gData.startDate}" required>
          </div>
          <div class="form-group">
            <label class="form-label">End Date</label>
            <input type="date" id="pg-form-end" class="form-input" value="${gData.endDate}" required>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px">
          ${(!isNew && goals.length > 1) ? `
            <button type="button" class="btn btn-secondary" style="color:var(--bad)" onclick="deletePeriodGoalFromModal('${goal.id}')">Delete Goal</button>
          ` : '<span></span>'}
          <div style="display:flex;gap:10px">
            <button type="button" class="btn btn-secondary" onclick="switchPeriodGoalModalTab('log')">Cancel</button>
            <button type="submit" class="btn btn-primary">${isNew ? 'Create Goal' : 'Save Changes'}</button>
          </div>
        </div>
      </form>
    `;
    return;
  }

  // Daily Log breakdown view
  const rowsHtml = stats.dates.map(dStr => {
    const dObj = parseDateIso(dStr);
    const label = dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const rawVal = (goal.logs && goal.logs[dStr] !== undefined && goal.logs[dStr] !== null && goal.logs[dStr] !== '')
      ? Number(goal.logs[dStr])
      : '';
    const isHit = (rawVal !== '' && rawVal >= stats.targetAvg);
    const isTodayRow = (dStr === todayIso);

    return `
      <div class="aurora-pg-log-row ${isTodayRow ? 'is-today' : ''} ${isHit ? 'is-hit' : ''}">
        <div class="aurora-pg-log-date">
          <strong>${escapeHtml(label)}</strong>
          ${isTodayRow ? `<span class="aurora-hair-today-tag">Today</span>` : ''}
        </div>
        <div class="aurora-pg-log-input-wrap">
          <input type="number"
                 class="aurora-pg-log-input"
                 min="0"
                 placeholder="—"
                 value="${rawVal}"
                 onchange="savePeriodGoalDayFromModal('${goal.id}', '${dStr}', this.value)">
          <span class="muted" style="font-size:12px">${escapeHtml(goal.unit)}</span>
        </div>
      </div>
    `;
  }).join('');

  body.innerHTML = `
    ${tabsHtml}
    <div class="aurora-pg-modal-summary">
      <div>
        <span class="m-lbl">CURRENT AVG</span>
        <strong>${stats.currentAvg.toLocaleString()} / ${stats.targetAvg.toLocaleString()} ${escapeHtml(goal.unit)}</strong>
      </div>
      <div>
        <span class="m-lbl">DAYS LEFT</span>
        <strong>${stats.daysLeft}d (${stats.loggedDaysCount}/${stats.totalDays} logged)</strong>
      </div>
      <div>
        <span class="m-lbl">NEEDED FOR BALANCE</span>
        <strong style="color:var(--accent)">${stats.daysLeft > 0 ? stats.neededAvgForBalance.toLocaleString() : '0'} ${escapeHtml(goal.unit)}/d</strong>
      </div>
    </div>
    <div class="aurora-pg-log-list">
      ${rowsHtml}
    </div>
  `;
}
window.renderPeriodGoalModalContent = renderPeriodGoalModalContent;

/**
 * Smooth 1-Tap Jump to Daily Widget with Serene Target Pulse Highlight
 */
function scrollToDailyWidget(targetId, modalFnName) {
  if (modalFnName && typeof window[modalFnName] === 'function') {
    window[modalFnName](activeTrackingDate);
    return;
  }
  const el = document.getElementById(targetId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('widget-focus-highlight');
    void el.offsetWidth; // trigger reflow for animation restart
    el.classList.add('widget-focus-highlight');
    setTimeout(() => {
      el.classList.remove('widget-focus-highlight');
    }, 1800);

    // If target is the journal check-in, focus textarea
    if (targetId === 'section-sanctuary-journal') {
      const ta = document.getElementById('journal');
      if (ta) ta.focus();
    }
  }
}
window.scrollToDailyWidget = scrollToDailyWidget;

/**
 * Aurora Daily Whisper Tracker — Realtime status ribbon of all daily widgets
 */
function renderAuroraWhisperTracker(dateStr = activeTrackingDate) {
  if (typeof storage === 'undefined') return '';

  const isOctActive = (dateStr <= '2026-10-31');

  // 1. Move
  const auroraState = (typeof storage.getAuroraDayState === 'function') ? storage.getAuroraDayState(dateStr) : {};
  const moveVal = Math.max(0, Math.min(300, Number(auroraState.moveCal) || 0));
  const moveAnchIdx = (auroraState.anch && typeof auroraState.anch.move === 'number') ? auroraState.anch.move : 0;
  const isMovePopulated = (moveVal > 0 || moveAnchIdx > 0);
  const isMoveComplete = (moveVal >= 300 || moveAnchIdx === 4);
  const moveStatusText = isMoveComplete 
    ? '300 cal ✓' 
    : (isMovePopulated ? `${moveVal}/300 cal` : '0/300 cal');

  // 2. Stand
  const hoursArr = auroraState.hours || [];
  const standVal = hoursArr.filter(Boolean).length;
  const standAnchIdx = (auroraState.anch && typeof auroraState.anch.stand === 'number') ? auroraState.anch.stand : 0;
  const isStandPopulated = (standVal > 0 || standAnchIdx > 0);
  const isStandComplete = (standVal >= 12 || standAnchIdx === 4);
  const standStatusText = isStandComplete 
    ? '12 hrs ✓' 
    : (isStandPopulated ? `${standVal}/12 hrs` : '0/12 hrs');

  // 2b. 10K Steps (Daily Tracker)
  const stepsVal = Math.max(0, Number(auroraState.steps) || 0);
  const stepsAnchIdx = (auroraState.anch && typeof auroraState.anch.steps === 'number') ? auroraState.anch.steps : 0;
  const isDailyStepsPopulated = (stepsVal > 0 || stepsAnchIdx > 0);
  const isDailyStepsComplete = (stepsVal >= 10000 || stepsAnchIdx === 4);

  // 3. Good choice / Not so good choice
  const dateChoices = (typeof storage.getChoices === 'function') ? storage.getChoices(dateStr) : { good: 0, not: 0 };
  const activeChips = auroraState.chips || [];
  const goodCount = dateChoices.good || 0;
  const notCount = dateChoices.not || 0;
  const isChoicesPopulated = (goodCount > 0 || notCount > 0 || activeChips.length > 0);
  const isChoicesComplete = isChoicesPopulated;
  const choicesStatusText = isChoicesPopulated 
    ? `+${goodCount} / -${notCount}` 
    : 'Unlogged';

  // 4. Let's do this
  const dummyTexts = new Set([
    'morning mobility',
    'stretch session',
    'post-dinner walk',
    'take breaks',
    'stand and stretch',
    'desk stand offs'
  ]);
  const storedGoals = (typeof storage.getDayGoals === 'function') ? (storage.getDayGoals(dateStr) || []) : [];
  const customHabits = storedGoals.filter(g => g && !dummyTexts.has((g.text || '').toLowerCase().trim()));
  const customHabitsDone = customHabits.filter(g => g.completed).length;
  const isLetsDoPopulated = (customHabits.length > 0);
  const isLetsDoComplete = (customHabits.length > 0 && customHabitsDone === customHabits.length);
  const letsDoStatusText = customHabits.length > 0 
    ? `${customHabitsDone}/${customHabits.length} done` 
    : 'No items';

  // 5. 10k Steps Oct (remove after Oct 31)
  let octStepsItem = null;
  if (isOctActive) {
    const octGoal = (typeof storage.getPeriodGoal === 'function') 
      ? storage.getPeriodGoal('pg-oct-steps') 
      : null;
    const octLogs = (octGoal && octGoal.logs) ? octGoal.logs : {};
    const daySteps = (octLogs[dateStr] !== undefined && octLogs[dateStr] !== null) 
      ? Number(octLogs[dateStr]) 
      : null;
    const isStepsPopulated = (daySteps !== null && daySteps > 0);
    const targetSteps = (octGoal && octGoal.targetAvg) ? octGoal.targetAvg : 10000;
    const isStepsComplete = (daySteps !== null && daySteps >= targetSteps);
    const stepsStatusText = isStepsPopulated 
      ? `${daySteps >= 1000 ? (daySteps / 1000).toFixed(1) + 'k' : daySteps} steps` 
      : 'Unlogged';

    octStepsItem = {
      id: 'oct-steps',
      name: '10k Steps Oct',
      fullName: '10k Steps Oct (Daily Average Target)',
      targetId: 'section-period-goal',
      isPopulated: isStepsPopulated,
      isComplete: isStepsComplete,
      statusText: stepsStatusText
    };
  }

  // 6. Haircare
  const hairCareState = (typeof storage.getHairCareState === 'function')
    ? storage.getHairCareState(dateStr)
    : {};
  const isHairDone = !!(hairCareState.completed || hairCareState.skipped);
  const hairStatusText = hairCareState.completed 
    ? 'Done ✓' 
    : (hairCareState.skipped ? 'Skipped ⏭️' : 'Pending');

  // 6b. Skincare
  const skinCareState = (typeof storage.getSkinCareState === 'function')
    ? storage.getSkinCareState(dateStr)
    : {};
  const isSkinDone = !!(skinCareState.completed || skinCareState.skipped || (skinCareState.am && skinCareState.pm));
  const skinStatusText = skinCareState.completed 
    ? 'Done ✓' 
    : (skinCareState.skipped ? 'Skipped ⏭️' : (skinCareState.am && !skinCareState.pm ? 'AM Done' : (!skinCareState.am && skinCareState.pm ? 'PM Done' : 'Pending')));

  // 7. Journal
  const journalEntry = (typeof storage.getJournal === 'function')
    ? storage.getJournal(dateStr)
    : null;
  const journalText = journalEntry ? journalEntry.text : '';
  const healthLevel = (typeof storage.getHealthLevel === 'function') ? storage.getHealthLevel(dateStr) : null;
  const isJournalPopulated = !!((journalText && journalText.trim().length > 0) || healthLevel);
  const isJournalComplete = !!(journalText && journalText.trim().length > 0);
  const journalStatusText = isJournalComplete 
    ? 'Written ✓' 
    : (healthLevel ? 'Mood logged' : 'Unwritten');

  // 8. Z Log
  const todayZLog = (typeof storage.getZLogEntry === 'function')
    ? storage.getZLogEntry(dateStr)
    : null;
  const isZLogPopulated = !!(todayZLog && (
    (todayZLog.rating !== null && todayZLog.rating !== undefined) ||
    (todayZLog.notes && todayZLog.notes.trim().length > 0) ||
    (todayZLog.aggression) ||
    (todayZLog.updatedAt && todayZLog.meds && (todayZLog.meds.z || todayZLog.meds.g || todayZLog.meds.rit || todayZLog.meds.mag || todayZLog.meds.mel || todayZLog.meds.ris))
  ));
  const zlogRatingObj = (todayZLog && todayZLog.rating && typeof ZLOG_RATINGS !== 'undefined')
    ? ZLOG_RATINGS[todayZLog.rating]
    : null;
  const zlogStatusText = isZLogPopulated 
    ? (zlogRatingObj ? zlogRatingObj.shortLabel : 'Logged ✓') 
    : 'Log entry';

  const items = [
    {
      id: 'move',
      name: 'Move',
      fullName: 'Move Goal (300 cal)',
      targetId: 'section-move-anchor',
      isComplete: isMovePopulated,
      statusText: isMovePopulated ? (isMoveComplete ? '300 cal' : `${moveVal} cal`) : ''
    },
    {
      id: 'stand',
      name: 'Stand',
      fullName: 'Stand Ring (12 hrs)',
      targetId: 'section-stand-anchor',
      isComplete: isStandPopulated,
      statusText: isStandPopulated ? `${standVal} hrs` : ''
    },
    {
      id: 'steps',
      name: '10K Steps',
      fullName: '10K Steps (Daily Goal)',
      targetId: 'section-steps-anchor',
      isComplete: isDailyStepsPopulated,
      statusText: isDailyStepsPopulated ? (isDailyStepsComplete ? '10k steps' : `${stepsVal.toLocaleString()} steps`) : ''
    },
    {
      id: 'choices',
      name: 'Good choice / Not so good choice',
      fullName: 'Good choice / Not so good choice',
      targetId: 'section-good-choices',
      isComplete: isChoicesPopulated,
      statusText: isChoicesPopulated ? `+${goodCount} / -${notCount}` : ''
    },
    {
      id: 'letsdo',
      name: "Let's do this",
      fullName: "Let's do this (Daily Intentions)",
      targetId: 'section-custom-habits',
      isComplete: isLetsDoPopulated && (customHabitsDone > 0 || customHabitsDone === customHabits.length),
      statusText: customHabits.length > 0 ? `${customHabitsDone}/${customHabits.length}` : ''
    }
  ];

  if (octStepsItem) {
    items.push({
      id: 'oct-steps',
      name: '10k Steps Oct',
      fullName: '10k Steps Oct (Daily Average Target)',
      targetId: 'section-period-goal',
      isComplete: octStepsItem.isPopulated,
      statusText: octStepsItem.isPopulated ? octStepsItem.statusText : ''
    });
  }

  items.push(
    {
      id: 'haircare',
      name: 'Haircare',
      fullName: 'AY Haircare Daily Routine',
      targetId: 'hair',
      modalFn: 'openHairCareLogModal',
      isComplete: isHairDone,
      statusText: hairCareState.completed ? 'Done' : (hairCareState.skipped ? 'Skipped' : '')
    },
    {
      id: 'skincare',
      name: 'Skincare',
      fullName: 'Skincare Routine & Daily Tracker',
      targetId: 'skincareTile',
      modalFn: 'openSkinCareLogModal',
      isComplete: isSkinDone,
      statusText: skinCareState.completed ? 'Done' : (skinCareState.skipped ? 'Skipped' : (skinCareState.am && !skinCareState.pm ? 'AM' : (!skinCareState.am && skinCareState.pm ? 'PM' : '')))
    },
    {
      id: 'journal',
      name: 'Journal',
      fullName: 'Evening Check-in & Daily Reflection',
      targetId: 'section-sanctuary-journal',
      isComplete: isJournalPopulated,
      statusText: isJournalComplete ? 'Written' : (healthLevel ? 'Mood' : '')
    },
    {
      id: 'zlog',
      name: 'Z log',
      fullName: 'Z Hub Daily Care & Mood Log',
      targetId: 'zhub',
      modalFn: 'openZLogEntryModal',
      isComplete: isZLogPopulated,
      statusText: isZLogPopulated ? (zlogRatingObj ? zlogRatingObj.shortLabel : 'Logged') : ''
    }
  );

  return `
    <div class="whisper-tracker-row span2" id="section-whisper-tracker" aria-label="Daily Whisper Tracker">
      <div class="whisper-tracker-track">
        ${items.map(it => `
          <button type="button"
                  class="whisper-chip ${it.isComplete ? 'is-complete' : 'is-pending'}"
                  onclick="scrollToDailyWidget('${it.targetId}', ${it.modalFn ? `'${it.modalFn}'` : 'null'})"
                  title="Jump to ${escapeHtml(it.fullName)}">
            <span class="whisper-chip-indicator" aria-hidden="true">${it.isComplete ? '✓' : '○'}</span>
            <span class="whisper-chip-name">${escapeHtml(it.name)}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}
window.renderAuroraWhisperTracker = renderAuroraWhisperTracker;

function submitSanctuaryChallengeSteps(goalId, dateStr = activeTrackingDate) {
  const input = document.getElementById('sanctuary-challenge-steps-input');
  if (!input) return;
  const raw = input.value.trim();
  const updatedGoal = storage.logPeriodGoalDay(goalId, dateStr, raw);
  if (updatedGoal && typeof showToast === 'function') {
    if (raw) showToast(`✓ Logged ${Number(raw).toLocaleString()} steps for today`);
    else showToast('Cleared steps entry');
  }
  renderDailySheet();
}
window.submitSanctuaryChallengeSteps = submitSanctuaryChallengeSteps;

function submitQuickTodayGoal(event, dateStr = activeTrackingDate) {
  if (event) event.preventDefault();
  const input = document.getElementById('s-quick-goal-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  storage.addDayGoal(dateStr, val);
  input.value = '';
  if (typeof showToast === 'function') showToast('Added focus item for today');
  renderDailySheet();
}
window.submitQuickTodayGoal = submitQuickTodayGoal;

let activeHairSkinTab = 'skin'; // 'skin' | 'hair'

function switchHairSkinModalTab(tabName) {
  activeHairSkinTab = tabName;
  renderHairSkinModalContent(activeTrackingDate);
}
window.switchHairSkinModalTab = switchHairSkinModalTab;

function renderHairSkinModalContent(dateStr = activeTrackingDate) {
  const container = document.getElementById('hairskin-modal-body');
  if (!container) return;

  const todayIso = formatDateIso(new Date());
  const isToday = (dateStr === todayIso);
  const dObj = parseDateIso(dateStr);
  const fullFormattedDate = dObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const tabHtml = `
    <div style="display:flex; gap:8px; margin-bottom:14px; border-bottom:1px solid rgba(13, 59, 102, 0.1); padding-bottom:10px;">
      <button type="button" class="s-modal-tab-btn ${activeHairSkinTab === 'skin' ? 'is-active' : ''}" onclick="switchHairSkinModalTab('skin')">
        🧴 Skincare Routine
      </button>
      <button type="button" class="s-modal-tab-btn ${activeHairSkinTab === 'hair' ? 'is-active' : ''}" onclick="switchHairSkinModalTab('hair')">
        💇‍♀️ Haircare Schedule
      </button>
    </div>
  `;

  const navHtml = `
    <div class="aurora-hair-modal-nav" style="margin-bottom:12px;">
      <button type="button" class="aurora-hair-nav-btn" onclick="navigateDate(-1)">‹ Prev Day</button>
      <div class="aurora-hair-nav-date">
        <strong>${escapeHtml(fullFormattedDate)}</strong>
        ${!isToday ? `<button type="button" class="aurora-hair-today-btn" onclick="resetToToday()">Jump to Today</button>` : `<span class="aurora-hair-today-tag">Today</span>`}
      </div>
      <button type="button" class="aurora-hair-nav-btn" onclick="navigateDate(1)">Next Day ›</button>
    </div>
  `;

  const contentHtml = (activeHairSkinTab === 'skin')
    ? renderSkinCareCard(dateStr, isToday)
    : renderHairCareCard(dateStr, isToday);

  container.innerHTML = tabHtml + navHtml + contentHtml;

  if (window.lucide) {
    lucide.createIcons();
  }
}
window.renderHairSkinModalContent = renderHairSkinModalContent;

function openHairSkinModal(dateStr = activeTrackingDate, initialTab = 'skin') {
  if (dateStr) activeTrackingDate = dateStr;
  activeHairSkinTab = initialTab;
  renderHairSkinModalContent(activeTrackingDate);
  const modal = document.getElementById('modal-hairskin-log');
  if (modal) {
    modal.classList.add('active');
  }
}
window.openHairSkinModal = openHairSkinModal;

function renderDailySheet() {
  const container = document.getElementById('daily-sheet-container') || document.getElementById('page-cover');
  if (!container) return;

  const todayIso = formatDateIso(new Date());
  const selectedDateObj = parseDateIso(activeTrackingDate);
  const isToday = (activeTrackingDate === todayIso);

  const habits = storage.getHabits();
  const moveHabit = habits.find(h => h && (h.id === 'h-move' || h.name.toLowerCase().trim() === 'move'));
  const standHabit = habits.find(h => h && (h.id === 'h-stand' || h.name.toLowerCase().trim() === 'stand' || h.name.toLowerCase().trim() === 'stand ring'));
  const stepsHabit = habits.find(h => h && (h.id === 'h-steps' || h.name.toLowerCase().trim() === '10k steps' || h.name.toLowerCase().trim() === 'steps'));
  const moveId = moveHabit ? moveHabit.id : 'h-move';
  const standId = standHabit ? standHabit.id : 'h-stand';
  const stepsId = stepsHabit ? stepsHabit.id : 'h-steps';

  // Ensure all live streaks are freshly computed from logged habit states
  if (typeof storage.recalculateAllStreaks === 'function') {
    storage.recalculateAllStreaks();
  } else if (Array.isArray(habits)) {
    habits.forEach(h => {
      if (typeof storage.recalculateStreak === 'function') storage.recalculateStreak(h.id);
    });
  }

  let moveStreak = (storage.data.habitStreaks && storage.data.habitStreaks[moveId]) || 0;
  let standStreak = (storage.data.habitStreaks && storage.data.habitStreaks[standId]) || 0;
  let stepsStreak = (storage.data.habitStreaks && storage.data.habitStreaks[stepsId]) || 0;
  const currentStreak = (typeof storage.getOverallStreak === 'function')
    ? storage.getOverallStreak()
    : Math.max(0, Math.min(moveStreak, standStreak, stepsStreak));

  // Aurora granular state for activeTrackingDate
  const auroraState = storage.getAuroraDayState(activeTrackingDate);
  const moveVal = Math.max(0, Math.min(300, Number(auroraState.moveCal) || 0));
  const hoursArr = auroraState.hours || [];
  const standVal = hoursArr.filter(Boolean).length;
  const stepsVal = Math.max(0, Number(auroraState.steps) || 0);
  const moveAnchIdx = (auroraState.anch && typeof auroraState.anch.move === 'number') ? auroraState.anch.move : 0;
  const standAnchIdx = (auroraState.anch && typeof auroraState.anch.stand === 'number') ? auroraState.anch.stand : 0;
  const stepsAnchIdx = (auroraState.anch && typeof auroraState.anch.steps === 'number') ? auroraState.anch.steps : 0;
  const activeChips = auroraState.chips || [];

  // Choices & All-Time Momentum
  const dateChoices = storage.getChoices(activeTrackingDate);
  const runningChoices = storage.getRunningChoices();
  // Baseline historical tally 41 good / 25 not so good + running logged
  const totalGoodAllTime = Math.max(41 + (dateChoices.good || 0), runningChoices.totalGood || (41 + (dateChoices.good || 0)));
  const totalBadAllTime = Math.max(25 + (dateChoices.not || 0), runningChoices.totalNot || (25 + (dateChoices.not || 0)));
  const netMomentum = totalGoodAllTime - totalBadAllTime;
  const posPct = (totalGoodAllTime + totalBadAllTime) > 0
    ? Math.round((totalGoodAllTime / (totalGoodAllTime + totalBadAllTime)) * 100)
    : 100;
  const momentumTierClass = (function(p) {
    if (p < 50) return 'momentum-under-50';
    if (p < 75) return 'momentum-50-74';
    if (p < 80) return 'momentum-75-79';
    if (p < 85) return 'momentum-80-84';
    if (p < 90) return 'momentum-85-89';
    if (p < 95) return 'momentum-90-94';
    return 'momentum-95-100';
  })(posPct);

  // Mood / Vitality (5=Thriving -> idx 0, ..., 1=Zombie -> idx 4)
  const currentHealthLevel = storage.getHealthLevel(activeTrackingDate);
  const activeMoodIdx = currentHealthLevel ? (5 - currentHealthLevel) : -1;
  const MOOD_LABELS = ['Thriving', 'Solid', 'Surviving', 'Dragging', 'Zombie'];

  // Journal
  const journalEntry = (typeof storage.getJournal === 'function')
    ? storage.getJournal(activeTrackingDate)
    : null;
  const journalText = journalEntry ? journalEntry.text : '';

  // Haircare
  const hairCareState = (typeof storage !== 'undefined' && typeof storage.getHairCareState === 'function')
    ? storage.getHairCareState(activeTrackingDate)
    : {};
  const isHairDone = !!(hairCareState.completed || hairCareState.skipped);
  const hairRoutine = getHairCareRoutineForDate(activeTrackingDate);

  // Skincare
  const skinCareState = (typeof storage !== 'undefined' && typeof storage.getSkinCareState === 'function')
    ? storage.getSkinCareState(activeTrackingDate)
    : {};
  const isSkinDone = !!(skinCareState.completed || skinCareState.skipped || (skinCareState.am && skinCareState.pm));
  const skinRoutine = (typeof getSkinCareRoutineForDate === 'function')
    ? getSkinCareRoutineForDate(activeTrackingDate)
    : { badge: '🌙 Routine' };

  // Z Hub status
  const todayZLog = (typeof storage !== 'undefined' && typeof storage.getZLogEntry === 'function')
    ? storage.getZLogEntry(activeTrackingDate)
    : null;
  const isZLogLogged = !!(todayZLog && (
    (todayZLog.rating !== null && todayZLog.rating !== undefined) ||
    (todayZLog.notes && todayZLog.notes.trim().length > 0) ||
    (todayZLog.aggression) ||
    (todayZLog.updatedAt && todayZLog.meds && (todayZLog.meds.z || todayZLog.meds.g || todayZLog.meds.rit || todayZLog.meds.mag || todayZLog.meds.mel || todayZLog.meds.ris))
  ));
  const zlogRatingObj = (todayZLog && todayZLog.rating && typeof ZLOG_RATINGS !== 'undefined')
    ? ZLOG_RATINGS[todayZLog.rating]
    : null;

  // Custom moves / day goals
  const dummyTexts = new Set([
    'morning mobility',
    'stretch session',
    'post-dinner walk',
    'take breaks',
    'stand and stretch',
    'desk stand offs'
  ]);
  const storedGoals = storage.getDayGoals(activeTrackingDate) || [];
  const customHabits = storedGoals.filter(g => g && !dummyTexts.has((g.text || '').toLowerCase().trim()));
  const customHabitsDone = customHabits.filter(g => g.completed).length;
  const shortDayName = isToday
    ? 'today'
    : selectedDateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const defaultEndD = new Date(selectedDateObj);
  defaultEndD.setDate(defaultEndD.getDate() + 6);
  const defaultEndIso = formatDateIso(defaultEndD);

  // Day Clock progress
  const pr = isToday ? getAuroraDayProgress() : (activeTrackingDate < todayIso ? 1 : 0);
  const dayPctNum = Math.round(pr * 100);
  const dayFillWidth = Math.max(4, pr * 100);

  const formattedDateHeader = selectedDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // 4-Segment Move widths
  const segWidths = [0, 1, 2, 3].map(i => {
    const w = Math.max(0, Math.min(1, (moveVal - i * 75) / 75));
    return Math.round(w * 100);
  });

  // 4-Segment 10K Steps widths (2,500 per segment)
  const stepsSegWidths = [0, 1, 2, 3].map(i => {
    const w = Math.max(0, Math.min(1, (stepsVal - i * 2500) / 2500));
    return Math.round(w * 100);
  });

  const standNoteText = standVal >= 6 ? 'Floor reached' : `${6 - standVal} to floor by 2 PM`;
  const mvPaceText = getAuroraPaceText('move', moveVal, moveAnchIdx);
  const stPaceText = getAuroraPaceText('stand', standVal, standAnchIdx);
  const stepsPaceText = getAuroraPaceText('steps', stepsVal, stepsAnchIdx);
  const currentQuote = getBedPotatoRoast(activeTrackingDate, potatoPokeOffset);
  const dailyRoastObj = (typeof getDailyAffirmation === 'function')
    ? getDailyAffirmation(activeTrackingDate, typeof customAffirmationOffset === 'number' ? customAffirmationOffset : 0)
    : { text: currentQuote };
  const allJournals = (typeof storage !== 'undefined' && typeof storage.getAllJournals === 'function')
    ? storage.getAllJournals()
    : [];

  // Weight Tracker state (Target: 110 lbs)
  const weightStats = (typeof storage.getWeightStats === 'function')
    ? storage.getWeightStats(activeTrackingDate)
    : { current: null, target: 110, diff: null, isAtTarget: false, latest: null };
  const currentWeight = weightStats.current;
  const targetWeight = weightStats.target || 110;
  const weightDiff = weightStats.diff;
  const isWeightAtTarget = weightStats.isAtTarget;
  const isWeightLogged = (currentWeight !== null);

  // Visual Gauge: 105 lbs (0%) to 115 lbs (100%), so 110 lbs is precisely at the 50% target notch
  let weightBarWidth = 0;
  if (isWeightLogged) {
    weightBarWidth = Math.max(4, Math.min(100, Math.round(((currentWeight - 105) / 10) * 100)));
  }

  const latestWeightEntry = weightStats.latest;
  let weightStatusPillText = 'TARGET 110';
  let weightStatusPillClass = 'idle';
  let weightStatusNote = 'Tap − / + or type to log';

  if (isWeightLogged) {
    if (isWeightAtTarget) {
      weightStatusPillText = '✓ MET';
      weightStatusPillClass = 'met';
      weightStatusNote = `On target (${currentWeight.toFixed(1)} lbs) ✨`;
    } else if (weightDiff > 0) {
      weightStatusPillText = `+${weightDiff.toFixed(1)} LBS`;
      weightStatusPillClass = 'above';
      weightStatusNote = `+${weightDiff.toFixed(1)} lbs over 110 target`;
    } else {
      weightStatusPillText = `${weightDiff.toFixed(1)} LBS`;
      weightStatusPillClass = 'below';
      weightStatusNote = `${weightDiff.toFixed(1)} lbs under 110 target`;
    }
  } else if (latestWeightEntry && latestWeightEntry.weight) {
    weightStatusNote = `Last: ${latestWeightEntry.weight.toFixed(1)} lbs · Tap − / + to log today`;
  }

  // Kitchen Dinner Tonight
  const kData = (typeof storage.getKitchenData === 'function') ? storage.getKitchenData() : null;
  let tonightMeal = 'Plan Week ➔';
  let tonightSource = 'Kitchen';
  let tonightRecipeUrl = '';
  if (kData && Array.isArray(kData.weekSchedule)) {
    const dObj = parseDateIso(activeTrackingDate);
    const dayNameShort = dObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dayMatch = kData.weekSchedule.find(s => s.day === dayNameShort);
    if (dayMatch && dayMatch.meal) {
      tonightMeal = dayMatch.meal;
      tonightRecipeUrl = dayMatch.recipeUrl || '';
      if (dayMatch.source === 'freezer') tonightSource = 'Freezer Stash 🧊';
      else if (dayMatch.source === 'pantry') tonightSource = 'Pantry Stash 🥫';
      else if (dayMatch.source === 'out') tonightSource = 'Dining Out 🍷';
      else tonightSource = 'Fresh Grocery 🛒';
    }
  }

  // Active Challenge (Oct 10K Steps or Current Period Goal)
  const activeChallengeGoal = (typeof storage.getPeriodGoal === 'function')
    ? (storage.getPeriodGoal('pg-oct-steps') || (storage.getPeriodGoals() || [])[0])
    : null;
  const activeChallengeStats = (activeChallengeGoal && typeof storage.getPeriodGoalStats === 'function')
    ? storage.getPeriodGoalStats(activeChallengeGoal, activeTrackingDate)
    : null;
  const todayChallengeLogVal = (activeChallengeGoal && activeChallengeGoal.logs)
    ? (activeChallengeGoal.logs[activeTrackingDate] || '')
    : '';

  container.innerHTML = `
    <div class="sanctuary-stream-wrap">

      <!-- TOP BAR: DATE & STREAK -->
      <header class="s-top-card">
        <div class="s-top-left">
          <div class="s-date-controls">
            <button type="button" class="s-date-btn" onclick="event.stopPropagation();navigateDate(-1)" title="Previous day" aria-label="Previous day">‹</button>
            <span class="s-date-label" onclick="triggerHeaderDatePicker()" title="Tap to pick any date">${escapeHtml(formattedDateHeader)}</span>
            <button type="button" class="s-date-btn" onclick="event.stopPropagation();navigateDate(1)" title="Next day" aria-label="Next day">›</button>
            ${!isToday ? `<button type="button" class="today-return-btn" style="margin-left:6px;" onclick="event.stopPropagation();resetToToday()" title="Return to today">Today</button>` : ''}
          </div>
          <h1 class="aurora-wordmark" aria-label="margo" style="margin:0; font-size:18px;"><span class="today-m-mark aurora-m-mark">m</span><span class="today-argo aurora-argo">argo</span></h1>
        </div>
        <div class="s-streak-badge" title="${currentStreak} day streak">
          <span>🔥 ${currentStreak}</span>
          <span style="font-size:11px; opacity:0.85;">day streak</span>
        </div>
      </header>

      <!-- WIDGET 1: PHYSICAL MOMENTUM (Move & Stand) -->
      <section class="s-widget-card" id="section-core-anchors">
        <div class="s-widget-head">
          <div class="s-widget-title-group">
            <span class="s-step-num">1</span>
            <span class="s-widget-title">Core Momentum Anchors</span>
          </div>
          <span class="s-widget-hint">Floor protects streak</span>
        </div>

        <div class="s-anchors-grid">
          <!-- Move Anchor -->
          <div class="s-anchor-box">
            <div class="s-anchor-meta">
              <span class="s-anchor-name">🏃‍♀️ Move (${moveVal}/300 cal)</span>
              <span class="s-anchor-floor-note move">Floor: 150</span>
            </div>
            <div class="s-seg-track">
              <button type="button" class="s-seg-btn ${moveAnchIdx === 0 ? 'is-active-move' : ''}" onclick="auroraSetAnchorChip('move', 0, '${activeTrackingDate}')">Off</button>
              <button type="button" class="s-seg-btn ${moveAnchIdx === 2 ? 'is-active-move' : ''}" onclick="auroraSetAnchorChip('move', 2, '${activeTrackingDate}')">Floor 50%</button>
              <button type="button" class="s-seg-btn ${moveAnchIdx === 4 ? 'is-active-move' : ''}" onclick="auroraSetAnchorChip('move', 4, '${activeTrackingDate}')">100%</button>
            </div>
          </div>

          <!-- Stand Anchor -->
          <div class="s-anchor-box">
            <div class="s-anchor-meta">
              <span class="s-anchor-name">🧍‍♀️ Stand (${standVal}/12 hrs)</span>
              <span class="s-anchor-floor-note stand">Floor: 6 hrs</span>
            </div>
            <div class="s-seg-track">
              <button type="button" class="s-seg-btn ${standAnchIdx === 0 ? 'is-active-stand' : ''}" onclick="auroraSetAnchorChip('stand', 0, '${activeTrackingDate}')">Off</button>
              <button type="button" class="s-seg-btn ${standAnchIdx === 2 ? 'is-active-stand' : ''}" onclick="auroraSetAnchorChip('stand', 2, '${activeTrackingDate}')">Floor 50%</button>
              <button type="button" class="s-seg-btn ${standAnchIdx === 4 ? 'is-active-stand' : ''}" onclick="auroraSetAnchorChip('stand', 4, '${activeTrackingDate}')">100%</button>
            </div>
          </div>
        </div>
      </section>

      <!-- WIDGET 2: ACTIVE CHALLENGE (10K Steps · October) -->
      ${activeChallengeGoal ? `
        <section class="s-widget-card s-challenge-card" id="section-active-challenge">
          <div class="s-widget-head">
            <div class="s-widget-title-group">
              <span class="s-step-num c-challenge">2</span>
              <span class="s-widget-title" style="color:#312E81;">Active Challenge · ${escapeHtml(activeChallengeGoal.title || '10K Steps (October)')}</span>
            </div>
            <span class="s-widget-hint" style="color:#4338CA;">${activeChallengeStats ? `${activeChallengeStats.daysLeft}d left · ${activeChallengeStats.loggedDays}/${activeChallengeStats.totalDays} logged` : 'Monthly'}</span>
          </div>

          <div class="s-challenge-stats-row">
            <div class="s-challenge-avg">
              <span>${activeChallengeStats ? activeChallengeStats.currentAvg.toLocaleString() : '0'}</span>
              <span style="font-size:12px; font-weight:600; color:var(--text-muted);">/ ${(activeChallengeGoal.targetAvg || 10000).toLocaleString()} ${activeChallengeGoal.unit || 'steps'} avg</span>
            </div>
            ${activeChallengeStats && activeChallengeStats.daysLeft > 0 ? `
              <span class="s-challenge-needed">Needed: ${activeChallengeStats.neededAvgForBalance.toLocaleString()}/d</span>
            ` : ''}
          </div>

          <div class="s-challenge-progress-bar">
            <div class="s-challenge-fill" style="width: ${activeChallengeStats ? Math.min(100, activeChallengeStats.overallPercent) : 0}%;"></div>
          </div>

          <div class="s-challenge-input-row">
            <span style="font-size:11.5px; font-weight:700; color:var(--text-secondary);">Today:</span>
            <input type="number" id="sanctuary-challenge-steps-input" value="${todayChallengeLogVal}" placeholder="Enter steps (e.g. 10250)..." class="s-clean-input" onkeydown="if(event.key==='Enter') submitSanctuaryChallengeSteps('${activeChallengeGoal.id}', '${activeTrackingDate}')">
            <button type="button" class="s-btn-action" onclick="submitSanctuaryChallengeSteps('${activeChallengeGoal.id}', '${activeTrackingDate}')">Log</button>
          </div>
        </section>
      ` : ''}

      <!-- WIDGET 3: DAILY CHOICES & MOMENTUM -->
      <section class="s-widget-card" id="section-daily-choices">
        <div class="s-widget-head">
          <div class="s-widget-title-group">
            <span class="s-step-num c-choices">3</span>
            <span class="s-widget-title">Daily Choices</span>
          </div>
          <span style="font-size:11px; font-weight:800; color:#047857; background:rgba(16,185,129,0.12); padding:3px 9px; border-radius:9999px;">
            ${netMomentum >= 0 ? `+${netMomentum}` : netMomentum} Net (${posPct}% Good)
          </span>
        </div>

        <div class="s-choices-grid">
          <!-- Good Choices -->
          <div class="s-choice-box good">
            <div class="s-choice-label-val">
              <span class="s-choice-label">Good:</span>
              <span class="s-choice-val good">${dateChoices.good || 0}</span>
            </div>
            <div class="s-choice-step-btns">
              <button type="button" class="s-choice-step-btn" onclick="recordChoiceAction('good', -1, '${activeTrackingDate}')">−</button>
              <button type="button" class="s-choice-step-btn plus-good" onclick="recordChoiceAction('good', 1, '${activeTrackingDate}')">+1</button>
            </div>
          </div>

          <!-- Not So Good Choices -->
          <div class="s-choice-box bad">
            <div class="s-choice-label-val">
              <span class="s-choice-label">Not so good:</span>
              <span class="s-choice-val bad">${dateChoices.not || 0}</span>
            </div>
            <div class="s-choice-step-btns">
              <button type="button" class="s-choice-step-btn" onclick="recordChoiceAction('not', -1, '${activeTrackingDate}')">−</button>
              <button type="button" class="s-choice-step-btn plus-bad" onclick="recordChoiceAction('not', 1, '${activeTrackingDate}')">+1</button>
            </div>
          </div>
        </div>

        <div class="s-quick-chips-row">
          <span style="font-size:10.5px; font-weight:700; color:var(--text-muted); margin-right:2px;">Quick:</span>
          ${['Water', 'Protein', 'Walk'].map(c => `
            <button type="button" class="s-quick-chip good ${activeChips.includes(c) ? 'is-active' : ''}" onclick="auroraToggleQuickChip('${c}', 'g', '${activeTrackingDate}')">
              + ${c === 'Water' ? '💧 Water' : (c === 'Protein' ? '🍳 Protein' : '👟 Walk')}
            </button>
          `).join('')}
          ${['Sugar', 'Late Screen'].map(c => `
            <button type="button" class="s-quick-chip bad ${activeChips.includes(c) ? 'is-active' : ''}" onclick="auroraToggleQuickChip('${c}', 'b', '${activeTrackingDate}')">
              + ${c === 'Sugar' ? '🍫 Sugar' : '📱 Screen'}
            </button>
          `).join('')}
        </div>
      </section>

      <!-- WIDGET 4: TODAY'S FOCUS (Max 3 actions) -->
      <section class="s-widget-card" id="section-todays-focus">
        <div class="s-widget-head">
          <div class="s-widget-title-group">
            <span class="s-step-num c-focus">4</span>
            <span class="s-widget-title">Today's Focus (Max 3)</span>
          </div>
          <span class="s-widget-hint">${customHabitsDone}/${customHabits.length} done</span>
        </div>

        <div class="s-focus-list">
          ${customHabits.length === 0 ? `
            <div style="font-size:12px; color:var(--text-muted); padding:4px 0;">No focus actions set for today. Add one below!</div>
          ` : customHabits.map(g => `
            <div class="s-focus-item">
              <label class="s-focus-left" onclick="toggleDayGoalAction('${g.id}', '${activeTrackingDate}')">
                <input type="checkbox" class="s-focus-check" ${g.completed ? 'checked' : ''} onchange="toggleDayGoalAction('${g.id}', '${activeTrackingDate}')">
                <span class="s-focus-text ${g.completed ? 'is-done' : ''}">${escapeHtml(g.text)}</span>
              </label>
              <button type="button" class="s-focus-del-btn" title="Delete" onclick="deleteDayGoalAction('${g.id}', '${activeTrackingDate}')">×</button>
            </div>
          `).join('')}
        </div>

        <form onsubmit="submitQuickTodayGoal(event, '${activeTrackingDate}')" class="s-quick-goal-form">
          <input type="text" id="s-quick-goal-input" placeholder="+ Add today's action (Press Enter)..." class="s-clean-input" required>
          <button type="submit" class="s-btn-action" style="background:#6D28D9;">+</button>
        </form>
      </section>

      <!-- WIDGET 5: VITALITY CHECKPOINTS -->
      <section class="s-widget-card" id="section-vitality-checkpoints">
        <div class="s-widget-head">
          <div class="s-widget-title-group">
            <span class="s-step-num c-vitality">5</span>
            <span class="s-widget-title">Vitality Checkpoints</span>
          </div>
          <span class="s-widget-hint">Tap to edit or view</span>
        </div>

        <div class="s-vitality-grid">
          <!-- Weight (Fillable on tap) -->
          <div class="s-checkpoint-box" onclick="const inp=document.getElementById('s-weight-inline-input'); if(inp){inp.focus();}">
            <div class="s-cp-head">
              <span class="s-cp-label">Weight</span>
              <span class="s-cp-view-link">✎</span>
            </div>
            <div class="s-weight-input-wrap">
              <input type="number" step="0.1" id="s-weight-inline-input" value="${currentWeight !== null ? currentWeight.toFixed(1) : ''}" placeholder="${latestWeightEntry && latestWeightEntry.weight ? latestWeightEntry.weight.toFixed(1) : '--.-'}" class="s-weight-clean-input" onchange="auroraSaveWeightInput(this.value, '${activeTrackingDate}')" onkeydown="if(event.key==='Enter')this.blur();" onclick="event.stopPropagation();">
              <span class="s-weight-unit">lbs</span>
            </div>
            <div class="s-cp-sub" style="color:${isWeightAtTarget ? '#047857' : (weightDiff > 0 ? '#BE123C' : 'var(--text-muted)')}; font-weight:700;">
              ${isWeightLogged ? (isWeightAtTarget ? '✓ On Target' : (weightDiff > 0 ? `+${weightDiff.toFixed(1)} lbs` : `${weightDiff.toFixed(1)} lbs`)) : 'Target: 110.0'}
            </div>
          </div>

          <!-- Hair & Skin (Pops up on tap) -->
          <div class="s-checkpoint-box" onclick="openHairSkinModal('${activeTrackingDate}', 'skin')" title="Tap to view Skincare & Haircare routines">
            <div class="s-cp-head">
              <span class="s-cp-label">Hair &amp; Skin</span>
              <span class="s-cp-view-link">View ↗</span>
            </div>
            <div class="s-cp-val">💇‍♀️ ${escapeHtml(hairRoutine ? hairRoutine.badge : 'Rest Day')}</div>
            <div class="s-cp-sub" style="color:var(--orchid, #6C2E7B); font-weight:700;">🧴 ${escapeHtml(skinRoutine ? skinRoutine.badge : 'Skincare')}</div>
          </div>

          <!-- Z Hub -->
          <div class="s-checkpoint-box" onclick="openZLogEntryModal('${activeTrackingDate}')" title="Tap to open Z Hub log">
            <div class="s-cp-head">
              <span class="s-cp-label">Z Hub</span>
              <span class="s-cp-view-link">Log ↗</span>
            </div>
            <div class="s-cp-val" style="color:var(--stand);">${isZLogLogged ? (zlogRatingObj ? zlogRatingObj.shortLabel : 'Logged ✓') : 'Daily Log'}</div>
            <div class="s-cp-sub">${todayZLog && todayZLog.meds ? 'Meds Logged ✓' : 'Pending'}</div>
          </div>

          <!-- Dinner Tonight -->
          <div class="s-checkpoint-box" onclick="switchAppView('kitchen')" title="Tap to open Kitchen Meal Ritual">
            <div class="s-cp-head">
              <span class="s-cp-label">Dinner Tonight</span>
              ${tonightRecipeUrl ? `
                <a href="${escapeHtml(tonightRecipeUrl)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" style="font-size:10.5px; font-weight:700; color:var(--primary, #8B5CF6); text-decoration:none; padding:1px 6px; border-radius:4px; background:rgba(139, 92, 246, 0.12); display:inline-flex; align-items:center; gap:2px;" title="Open recipe in new tab">
                  Recipe ↗
                </a>
              ` : `<span class="s-cp-view-link">Kitchen ➔</span>`}
            </div>
            <div class="s-cp-val" title="${escapeHtml(tonightMeal)}">${escapeHtml(tonightMeal)}</div>
            <div class="s-cp-sub" style="color:var(--coral-kiss, #E75480); font-weight:700;">${escapeHtml(tonightSource)}</div>
          </div>
        </div>
      </section>

      <!-- WIDGET 6: EVENING REFLECTION (5 Original Options) -->
      <section class="s-widget-card" id="section-evening-reflection">
        <div class="s-widget-head">
          <div class="s-widget-title-group">
            <span class="s-step-num c-reflection">6</span>
            <span class="s-widget-title">Evening Reflection</span>
          </div>
          <button type="button" class="journal-archive-btn" onclick="openJournalArchiveModal()" style="font-size:11px; font-weight:700; color:var(--primary); background:transparent; border:none; cursor:pointer;">
            Archive (${allJournals.length})
          </button>
        </div>

        <!-- 5 ORIGINAL MOOD BUTTONS -->
        <div class="s-moods-row" role="group" aria-label="Vitality Level">
          ${MOOD_LABELS.map((lbl, idx) => `
            <button type="button" class="s-mood-btn ${activeMoodIdx === idx ? 'is-active' : ''}" onclick="auroraToggleMood(${idx}, '${activeTrackingDate}')">
              ${lbl}
            </button>
          `).join('')}
        </div>

        <div class="s-reflection-input-row">
          <input type="text" value="${escapeHtml(journalText)}" placeholder="One win, insight, or how your day felt..." class="s-clean-input" oninput="handleSanctuaryJournalInput('${activeTrackingDate}', this.value)">
        </div>
      </section>

    </div>
  `;


  const hairModal = document.getElementById('modal-haircare-log');
  if (hairModal && hairModal.classList.contains('active') && typeof renderHairCareModalContent === 'function') {
    renderHairCareModalContent(activeTrackingDate);
  }

  const skinModal = document.getElementById('modal-skincare-log');
  if (skinModal && skinModal.classList.contains('active') && typeof renderSkinCareModalContent === 'function') {
    renderSkinCareModalContent(activeTrackingDate);
  }

    const hairSkinModal = document.getElementById('modal-hairskin-log');
  if (hairSkinModal && hairSkinModal.classList.contains('active') && typeof renderHairSkinModalContent === 'function') {
    renderHairSkinModalContent(activeTrackingDate);
  }

  const archiveModal = document.getElementById('modal-journal-archive');
  if (archiveModal && archiveModal.classList.contains('active') && typeof renderJournalArchiveModalContent === 'function') {
    renderJournalArchiveModalContent();
  }

  if (window.lucide) {
    lucide.createIcons();
  }

  if (typeof refreshAppBadges === 'function') {
    refreshAppBadges();
  }
}

/**
 * Render Square Cards Grid for Past Journal Reflections
 */
function renderJournalSquareGrid(allJournals, filter) {
  if (!allJournals || allJournals.length === 0) {
    return `
      <div class="journal-empty-archive">
        <span>✍️</span>
        <p>No past journal entries yet. Start typing your thoughts above to build your personal sanctuary archive!</p>
      </div>
    `;
  }

  const todayIso = formatDateIso(new Date());
  let filtered = allJournals;

  if (filter === 'last_week') {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const minIso = formatDateIso(sevenDaysAgo);
    filtered = allJournals.filter(j => j.date >= minIso);
  } else if (filter === 'this_month') {
    const curMonth = todayIso.substring(0, 7);
    filtered = allJournals.filter(j => j.date.startsWith(curMonth));
  }

  return filtered.map(j => {
    const dateObj = parseDateIso(j.date);
    const dateTitle = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const isToday = (j.date === todayIso);
    const healthLevel = (typeof storage.getHealthLevel === 'function') ? storage.getHealthLevel(j.date) : null;
    const healthMeta = (healthLevel && typeof HEALTH_LEVELS !== 'undefined') ? HEALTH_LEVELS[healthLevel] : null;

    return `
      <div class="journal-square-card" onclick="openJournalEntryModal('${j.date}')" title="Click to view full reflection">
        <div class="square-card-top">
          <span class="square-date-tag">${isToday ? 'Today' : dateTitle}</span>
          ${healthMeta ? `
            <span class="square-health-pill">${healthMeta.emoji} ${healthMeta.label}</span>
          ` : ''}
        </div>

        <div class="square-snippet">
          "${escapeHtml(j.text)}"
        </div>

        <div class="square-card-bottom">
          <span class="square-word-count">${j.wordCount || 0} words</span>
          <span class="square-expand-hint">Expand ↗</span>
        </div>
      </div>
    `;
  }).join('');
}

function setSanctuaryJournalTab(tab) {
  sanctuaryJournalTab = tab;
  renderDailySheet();
}

function setSanctuaryArchiveFilter(filter) {
  sanctuaryArchiveFilter = filter;
  renderDailySheet();
}

let journalArchiveFilter = 'all'; // 'all' | 'last_week' | 'this_month'
let journalArchiveSearch = '';

function openJournalArchiveModal() {
  renderJournalArchiveModalContent();
  const modal = document.getElementById('modal-journal-archive');
  if (modal) {
    modal.classList.add('active');
  }
}
window.openJournalArchiveModal = openJournalArchiveModal;

function setJournalArchiveFilter(filter) {
  journalArchiveFilter = filter;
  renderJournalArchiveModalContent();
}
window.setJournalArchiveFilter = setJournalArchiveFilter;

function handleJournalArchiveSearch(query) {
  journalArchiveSearch = query || '';
  renderJournalArchiveModalContent();
}
window.handleJournalArchiveSearch = handleJournalArchiveSearch;

function renderJournalArchiveModalContent() {
  const body = document.getElementById('journal-archive-modal-body');
  if (!body) return;

  const allJournals = (typeof storage !== 'undefined' && typeof storage.getAllJournals === 'function')
    ? storage.getAllJournals()
    : [];

  const todayIso = formatDateIso(new Date());
  let filtered = allJournals;

  if (journalArchiveFilter === 'last_week') {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const minIso = formatDateIso(sevenDaysAgo);
    filtered = allJournals.filter(j => j.date >= minIso);
  } else if (journalArchiveFilter === 'this_month') {
    const curMonth = todayIso.substring(0, 7);
    filtered = allJournals.filter(j => j.date.startsWith(curMonth));
  }

  if (journalArchiveSearch && journalArchiveSearch.trim()) {
    const q = journalArchiveSearch.toLowerCase().trim();
    filtered = filtered.filter(j => (j.text || '').toLowerCase().includes(q) || (j.date || '').includes(q));
  }

  body.innerHTML = `
    <div class="journal-archive-modal-top">
      <div class="journal-archive-filter-row">
        <div class="journal-archive-filters">
          <button type="button" class="journal-filter-chip ${journalArchiveFilter === 'all' ? 'active' : ''}" onclick="setJournalArchiveFilter('all')">All (${allJournals.length})</button>
          <button type="button" class="journal-filter-chip ${journalArchiveFilter === 'last_week' ? 'active' : ''}" onclick="setJournalArchiveFilter('last_week')">Past 7 Days</button>
          <button type="button" class="journal-filter-chip ${journalArchiveFilter === 'this_month' ? 'active' : ''}" onclick="setJournalArchiveFilter('this_month')">This Month</button>
        </div>
        <div class="journal-archive-search-box">
          <input type="text"
                 class="journal-archive-search-input"
                 placeholder="Search reflections…"
                 value="${escapeHtml(journalArchiveSearch)}"
                 oninput="handleJournalArchiveSearch(this.value)">
        </div>
      </div>
    </div>

    <div class="journal-archive-cards-list">
      ${filtered.length === 0 ? `
        <div class="journal-empty-archive">
          <span>✍️</span>
          <p>${allJournals.length === 0 ? 'No journal entries saved yet. Fill out today’s check-in to start your reflection archive!' : 'No reflections match your search or filter.'}</p>
        </div>
      ` : filtered.map(j => {
        const dateObj = parseDateIso(j.date);
        const dateTitle = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        const isCurrent = (j.date === activeTrackingDate);
        const isToday = (j.date === todayIso);
        const healthLevel = (typeof storage.getHealthLevel === 'function') ? storage.getHealthLevel(j.date) : null;
        const healthMeta = (healthLevel && typeof HEALTH_LEVELS !== 'undefined') ? HEALTH_LEVELS[healthLevel] : null;

        return `
          <div class="journal-archive-entry-card ${isCurrent ? 'is-current-active' : ''}">
            <div class="journal-archive-card-header">
              <div class="journal-archive-header-left">
                <strong>${escapeHtml(dateTitle)}</strong>
                ${isToday ? `<span class="journal-archive-today-tag">Today</span>` : ''}
                ${healthMeta ? `<span class="square-health-pill">${healthMeta.emoji} ${healthMeta.label}</span>` : ''}
              </div>
              <div class="journal-archive-header-right">
                <span class="square-word-count">${j.wordCount || (j.text ? j.text.split(/\\s+/).filter(Boolean).length : 0)} words</span>
                <button type="button" class="journal-archive-jump-btn" onclick="closeAllModals(); jumpToTrackingDate('${j.date}')" title="Jump to full sheet for ${j.date}">Jump 📅</button>
              </div>
            </div>
            <div class="journal-archive-card-text">
              "${escapeHtml(j.text)}"
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}
window.renderJournalArchiveModalContent = renderJournalArchiveModalContent;

function toggleSanctuaryJournalEdit() {
  sanctuaryJournalEditing = !sanctuaryJournalEditing;
  renderDailySheet();
  if (sanctuaryJournalEditing) {
    const input = document.getElementById('sanctuary-journal-input');
    if (input) {
      input.focus();
    }
  }
}

let journalAutoSaveTimer = null;
function handleSanctuaryJournalInput(dateStr, value) {
  const status = document.getElementById('saved') || document.getElementById('journal-autosave-status');
  if (status) {
    if (status.id === 'saved') {
      status.textContent = 'Saving...';
    } else {
      status.innerHTML = '<span style="color: var(--warning);">● Saving...</span>';
    }
  }

  clearTimeout(journalAutoSaveTimer);
  journalAutoSaveTimer = setTimeout(() => {
    storage.saveJournal(dateStr, value);
    if (status) {
      if (status.id === 'saved') {
        status.textContent = 'Saved';
      } else {
        status.innerHTML = '<span style="color: var(--success); font-weight: 600;">✓ Auto-saved</span>';
      }
    }
  }, 400);
}

/**
 * Sassy Gamification Reward Claim
 */
function claimSassyReward(tierTitle) {
  storage.claimReward(tierTitle);
  triggerConfetti();
  const currentPoints = storage.getPoints();
  const statusInfo = getSassyStatus(currentPoints);
  showToast(`🎁 Reward Unlocked: ${statusInfo.currentTier.reward}`);
  renderDailySheet();
}

/**
 * Rotate Daily Roast / Sassy Affirmation
 */
function rotateDailyRoast() {
  if (typeof SASSY_AFFIRMATIONS !== 'undefined' && SASSY_AFFIRMATIONS.length > 0) {
    customAffirmationOffset = (customAffirmationOffset + 1) % SASSY_AFFIRMATIONS.length;
    renderDailySheet();
  }
}

/**
 * Interactive Mascot Poke Action
 */
function pokeSproutAction() {
  if (typeof sproutPokeIndex === 'number') {
    sproutPokeIndex++;
  } else {
    sproutPokeIndex = 1;
  }

  const avatarEl = document.getElementById('sprout-mascot-avatar');
  if (avatarEl) {
    avatarEl.classList.remove('mascot-hop');
    void avatarEl.offsetWidth; // force animation restart
    avatarEl.classList.add('mascot-hop');
  }

  // If anchors are complete, fire extra celebration sparkles
  const dayHabitsState = (typeof storage !== 'undefined' && storage.data && storage.data.habitsState)
    ? (storage.data.habitsState[activeTrackingDate] || {})
    : {};
  const moveVal = dayHabitsState['h-move'];
  const standVal = dayHabitsState['h-stand'];
  const energyMode = (typeof storage !== 'undefined' && typeof storage.getEnergyMode === 'function')
    ? storage.getEnergyMode()
    : 'power';
  const isMaintenance = (energyMode === 'maint');

  if (!isMaintenance && (moveVal === 1 || moveVal === true) && (standVal === 1 || standVal === true)) {
    if (typeof triggerConfetti === 'function') triggerConfetti();
  }

  renderDailySheet();
  if (typeof showToast === 'function') {
    showToast('🥔 Poked Sprout! Sassy wisdom refreshed.');
  }
}

window.claimSassyReward = claimSassyReward;
window.rotateDailyRoast = rotateDailyRoast;
window.pokeSproutAction = pokeSproutAction;

/**
 * Habit Actions for Daily Sheet
 */
function toggleHabitInSheet(habitId) {
  const nextVal = storage.toggleHabit(habitId, activeTrackingDate);
  renderDailySheet();

  const habit = storage.getHabit(habitId);
  const hName = habit ? habit.name : 'Habit';
  const todayIso = formatDateIso(new Date());
  const isToday = (activeTrackingDate === todayIso);

  const habits = storage.getHabits();
  const dayState = storage.data.habitsState[activeTrackingDate] || {};
  const allDone = habits.length > 0 && habits.every(h => !!dayState[h.id]);

  if (allDone && nextVal) {
    triggerConfetti();
    showToast(isToday ? '🎉 All habits completed! Momentum locked in.' : '🎉 All habits completed for this day!');
  } else if (!isToday) {
    const dObj = parseDateIso(activeTrackingDate);
    const shortDate = dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (nextVal) {
      showToast(`✓ Checked "${hName}" for ${shortDate} (+10 XP)`);
    } else {
      showToast(`Unchecked "${hName}" for ${shortDate}`);
    }
  } else {
    if (nextVal) {
      showToast(`✓ Checked "${hName}" (+10 XP)`);
    } else {
      showToast(`Unchecked "${hName}" (0% / Tap to close)`);
    }
  }
}

function updateWeeklyCounterInSheet(habitId, delta, event) {
  if (event) event.stopPropagation();

  const dayState = storage.data.habitsState[activeTrackingDate] || {};
  const currentVal = Number(dayState[habitId] || 0);
  const habit = storage.getHabit(habitId);
  const maxTarget = habit ? habit.target : 3;

  const newVal = Math.max(0, Math.min(maxTarget, currentVal + delta));
  storage.setWeeklyHabitCount(habitId, activeTrackingDate, newVal >= maxTarget ? true : newVal);

  renderDailySheet();
}

function addHabitFromPreset(presetIndex) {
  const preset = RECOMMENDED_HABIT_PRESETS[presetIndex];
  if (!preset) return;

  const pName = preset.name.toLowerCase().trim();
  if (pName === 'stand ring' || pName === 'stand') {
    showToast(`Stand is already active as Anchor #2!`);
    return;
  }
  if (pName === 'move') {
    showToast(`Move is already active as Anchor #1!`);
    return;
  }

  storage.addHabit(preset);
  showToast(`Added "${preset.name}" to your habits!`);
  renderDailySheet();
}

/**
 * Jump Directly to Any Date (Past or Present)
 */
function jumpToTrackingDate(dateStr) {
  activeTrackingDate = dateStr;
  renderDailySheet();
  const todayIso = formatDateIso(new Date());
  if (dateStr === todayIso) {
    showToast('📅 Jumped to Today');
  } else {
    const dObj = parseDateIso(dateStr);
    const formatted = dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    showToast(`📅 Viewing: ${formatted}`);
  }
}

function handleHeaderDateClick() {
  const todayIso = formatDateIso(new Date());
  if (activeTrackingDate !== todayIso) {
    resetToToday();
    showToast('📅 Returned to Today');
  } else {
    triggerHeaderDatePicker();
  }
}

function triggerHeaderDatePicker() {
  const input = document.getElementById('header-date-picker-input');
  if (!input) return;
  input.value = activeTrackingDate;
  if (typeof input.showPicker === 'function') {
    try {
      input.showPicker();
      return;
    } catch (e) {}
  }
  input.click();
}

function onHeaderDatePicked(val) {
  if (val) {
    jumpToTrackingDate(val);
  }
}

/**
 * Catch-Up Past Days Matrix Modal
 */
function openPastDaysModal() {
  const modal = document.getElementById('modal-past-days');
  if (!modal) return;
  renderPastDaysModal();
  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function renderPastDaysModal() {
  const body = document.getElementById('past-days-modal-body');
  if (!body) return;

  const habits = storage.getHabits();
  const selectedDateObj = parseDateIso(activeTrackingDate);
  const sundayOfSelectedWeek = getSundayOfWeek(selectedDateObj);
  const weeklyStats = calculateWeeklyStats(sundayOfSelectedWeek, habits, storage.data.habitsState);

  body.innerHTML = `
    <div class="past-days-modal-content">
      <div class="past-days-modal-desc">
        Check off any habits you completed earlier this week. Your anchor streaks, XP points, and consistency score update in real-time.
      </div>

      <div class="past-days-table-scroll">
        <table class="past-days-table">
          <thead>
            <tr>
              <th class="col-habit">Habit</th>
              ${weeklyStats.days.map(d => `
                <th class="col-day ${d.isToday ? 'col-today' : ''} ${d.dateStr === activeTrackingDate ? 'col-selected' : ''}">
                  <div class="th-day-name">${d.dayName}</div>
                  <div class="th-day-date">${d.dayNum}</div>
                  <button class="th-jump-link" onclick="closeAllModals(); jumpToTrackingDate('${d.dateStr}')" title="Open full sheet for ${d.dayName}">
                    ${d.isToday ? 'Today' : 'Open'}
                  </button>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${habits.map(h => {
              const streak = storage.data.habitStreaks[h.id] || 0;
              return `
                <tr>
                  <td class="col-habit">
                    <div class="modal-habit-info">
                      <span class="margo-tag margo-tag-${h.bucket.toLowerCase()}">${h.bucket}</span>
                      <div class="modal-habit-text">
                        <span class="modal-habit-name">${escapeHtml(h.name)}</span>
                        <span class="modal-habit-cadence">${h.cadence === 'weekly' ? `${h.target}x/wk` : 'Daily'} • 🔥 ${streak}d</span>
                      </div>
                    </div>
                  </td>
                  ${weeklyStats.days.map(d => {
                    const dayState = storage.data.habitsState[d.dateStr] || {};
                    const isDone = h.cadence === 'weekly' 
                      ? (Number(dayState[h.id] || 0) > 0 || !!dayState[h.id])
                      : !!dayState[h.id];
                    const isFuture = d.isFuture;

                    return `
                      <td class="col-day ${d.isToday ? 'col-today' : ''}">
                        ${isFuture ? `
                          <span class="future-dash" title="Future date">—</span>
                        ` : `
                          <button class="past-matrix-btn ${isDone ? 'checked' : ''}" 
                                  onclick="toggleHabitFromMatrix('${h.id}', '${d.dateStr}')"
                                  title="${isDone ? 'Click to uncheck' : 'Click to check off'} for ${d.dayName} (${d.dateStr})">
                            ${isDone ? '✓' : ''}
                          </button>
                        `}
                      </td>
                    `;
                  }).join('')}
                </tr>
              `;
            }).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td class="col-habit" style="font-weight: 700; color: var(--text-secondary);">Daily Completed</td>
              ${weeklyStats.days.map(d => `
                <td class="col-day ${d.isToday ? 'col-today' : ''}">
                  <span class="day-total-badge ${d.isPerfect ? 'perfect' : (d.completedCount > 0 ? 'partial' : '')}">
                    ${d.completedCount}/${d.totalHabits}
                  </span>
                </td>
              `).join('')}
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="past-days-modal-footer">
        <div class="past-days-footer-stats">
          <span>Week Consistency: <strong>${weeklyStats.overallCompletionRate}%</strong></span>
          <span>XP Points: <strong>${storage.getPoints()}</strong></span>
        </div>
        <button class="btn btn-primary" onclick="closeAllModals()">Done</button>
      </div>
    </div>
  `;
}

function toggleHabitFromMatrix(habitId, dateStr) {
  const nextVal = storage.toggleHabit(habitId, dateStr);
  const habit = storage.getHabit(habitId);
  const hName = habit ? habit.name : 'Habit';
  const dObj = parseDateIso(dateStr);
  const formatted = dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  if (nextVal) {
    showToast(`✓ Marked "${hName}" for ${formatted} (+10 XP)`);
  } else {
    showToast(`Unchecked "${hName}" for ${formatted}`);
  }

  renderPastDaysModal();
  renderDailySheet();
}

/**
 * Good Choices Actions
 */
function recordChoiceAction(type, delta, dateStr) {
  const updated = storage.recordChoice(type, delta, dateStr);
  renderDailySheet();
  const total = (updated.good || 0) + (updated.not || 0);
  if (delta > 0) {
    if (type === 'good') {
      const pct = total > 0 ? Math.round((updated.good / total) * 100) : 100;
      showToast(`+1 Good Choice! (${pct}% Good, +5 XP)`);
    } else {
      showToast(`Logged choice: Not-so-good. Momentum continues!`);
    }
  } else if (delta < 0) {
    if (type === 'good') {
      showToast(`-1 Good Choice (${updated.good} good / ${updated.not} not)`);
    } else {
      showToast(`-1 Not-so-good (${updated.good} good / ${updated.not} not)`);
    }
  }
}

/**
 * Reset Good & Not Choices to 0
 */
function resetChoicesAction(dateStr) {
  storage.resetChoices(dateStr);
  renderDailySheet();
  showToast('✓ Good Choices reset to 0');
}

/**
 * Quick-tap choice chip action
 */
function recordChoiceChip(label, type, dateStr = activeTrackingDate) {
  recordChoiceAction(type, 1, dateStr);
  if (type === 'good') {
    showToast(`✨ Logged: "${label}" (+5 XP)`);
  } else {
    showToast(`Logged: "${label}". Give yourself grace!`);
  }
}
window.recordChoiceChip = recordChoiceChip;

/**
 * Save Mockup Journal Action
 */
function saveMockupJournalAction(dateStr = activeTrackingDate) {
  const input = document.getElementById('journal') || document.getElementById('mockup-journal-input');
  if (input) {
    const val = input.value.trim();
    storage.saveJournal(dateStr, val);
    const savedEl = document.getElementById('saved');
    if (savedEl) {
      savedEl.textContent = val ? 'Journal saved' : 'Empty journal';
    }
    showToast(val ? 'Journal saved' : 'Empty journal');
  }
}
window.saveMockupJournalAction = saveMockupJournalAction;

/**
 * Health Level Action
 */
function recordHealthLevelAction(level, dateStr = activeTrackingDate) {
  storage.setHealthLevel(level, dateStr);
  renderDailySheet();
  const meta = (typeof HEALTH_LEVELS !== 'undefined') ? HEALTH_LEVELS[level] : null;
  if (meta) {
    showToast(`${meta.emoji} Logged: ${meta.label} (+5 XP)`);
  }
}

/**
 * Day Goals Actions
 */
function toggleDayGoalAction(goalId, dateStr = activeTrackingDate) {
  storage.toggleDayGoal(goalId, dateStr);
  renderDailySheet();
}

function deleteDayGoalAction(goalId, dateStr = activeTrackingDate) {
  storage.deleteDayGoal(goalId, dateStr);
  renderDailySheet();
}

function submitAddDayGoalInline(event, dateStr = activeTrackingDate, inputId = 'sheet-day-goal-input') {
  if (event) event.preventDefault();
  const input = document.getElementById(inputId);
  if (!input || !input.value.trim()) return;

  storage.addDayGoal(input.value.trim(), dateStr);
  input.value = '';
  renderDailySheet();
  showToast('✓ Day-Specific Goal Added (+15 XP when completed)');
}

function resetToToday() {
  jumpToTrackingDate(formatDateIso(new Date()));
}

function navigateDate(offset) {
  const d = parseDateIso(activeTrackingDate);
  d.setDate(d.getDate() + offset);
  jumpToTrackingDate(formatDateIso(d));
}

window.jumpToTrackingDate = jumpToTrackingDate;
window.triggerHeaderDatePicker = triggerHeaderDatePicker;
window.onHeaderDatePicked = onHeaderDatePicked;
window.resetToToday = resetToToday;
window.navigateDate = navigateDate;

/* --------------------------------------------------------------------------
   Gamification Points Quick Adjuster & Historical Audit
   -------------------------------------------------------------------------- */
function promptEditPoints() {
  const current = storage.getPoints();
  const val = prompt('Update your XP / Gamification Points score:', current);
  if (val !== null) {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      storage.setPoints(parsed);
      renderDailySheet();
      showToast(`✓ XP updated to ${parsed} XP`);
    }
  }
}

function recalculatePointsAction() {
  if (typeof storage.restoreAndMergeAllBackups === 'function') {
    storage.restoreAndMergeAllBackups();
  }
  const pts = storage.recalculatePointsFromHistory();
  renderDailySheet();
  showToast(`↺ All backups merged & XP restored to ${pts} XP!`);
}

function addHabitFromPresetName(name, bucket, cadence, target, icon, desc) {
  const habits = storage.getHabits();
  const already = habits.some(h => h.name.toLowerCase() === name.toLowerCase());
  if (already) {
    showToast(`"${name}" is already in your active stack!`);
    return;
  }

  storage.addHabit({
    name,
    bucket,
    cadence,
    target: target || 1,
    icon: icon || 'sparkles',
    description: desc || ''
  });
  showToast(`✓ Added "${name}" to your active habits stack!`);
  renderDailySheet();
}

let quickPresetsCollapsed = (function() {
  try {
    return localStorage.getItem('margo_quick_presets_collapsed') === 'true';
  } catch(e) {
    return false;
  }
})();

function toggleQuickPresetsCollapse(event) {
  if (event && event.stopPropagation) event.stopPropagation();
  quickPresetsCollapsed = !quickPresetsCollapsed;
  try {
    localStorage.setItem('margo_quick_presets_collapsed', quickPresetsCollapsed ? 'true' : 'false');
  } catch(e) {}

  const container = document.getElementById('quick-presets-container');
  const pills = document.getElementById('quick-presets-pills');
  const text = document.getElementById('quick-presets-toggle-text');
  const bar = document.querySelector('.quick-presets-top-bar');
  const btn = document.getElementById('quick-presets-toggle-btn');

  if (container) {
    container.classList.toggle('is-collapsed', quickPresetsCollapsed);
  }
  if (pills) {
    pills.style.display = quickPresetsCollapsed ? 'none' : 'flex';
  }
  if (text) {
    text.textContent = quickPresetsCollapsed ? 'Expand ▾' : 'Collapse ▴';
  }
  if (bar) {
    bar.title = quickPresetsCollapsed ? 'Expand presets' : 'Collapse presets';
  }
  if (btn) {
    btn.title = quickPresetsCollapsed ? 'Expand presets' : 'Collapse presets';
  }
}
window.toggleQuickPresetsCollapse = toggleQuickPresetsCollapse;

/* --------------------------------------------------------------------------
   Tactile Segmented Pill Track Actions
   -------------------------------------------------------------------------- */
function setAnchorStageAction(habitId, stage, dateStr = activeTrackingDate) {
  const nextStage = storage.setAnchorStage(habitId, stage, dateStr);
  renderDailySheet();

  const habit = storage.getHabit(habitId);
  const hName = habit ? habit.name : (habitId === 'h-move' ? 'Move' : 'Stand');
  const todayIso = formatDateIso(new Date());
  const isToday = (dateStr === todayIso);

  const isMove = (habitId === 'h-move' || (habit && habit.name.toLowerCase() === 'move'));
  const stageDesc = isMove
    ? { 0.25: '25% (75 cal)', 0.5: '50% floor (150 cal)', 0.75: '75% (225 cal)', 1: '100% (300 cal)' }
    : { 0.25: '25% (3)', 0.5: '50% floor (6)', 0.75: '75% (9)', 1: '100% (12)' };

  if (nextStage === 1) {
    const otherId = isMove ? 'h-stand' : 'h-move';
    const dayState = (storage.data && storage.data.habitsState) ? (storage.data.habitsState[dateStr] || {}) : {};
    const otherVal = dayState[otherId];
    const isOtherClosed = (otherVal === 1 || otherVal === true);

    if (isOtherClosed && typeof triggerConfetti === 'function') {
      triggerConfetti();
      showToast(`👑 Anchors 100% Closed! Sprout unlocked Supreme Legend! (+10 XP)`);
    } else {
      showToast(`⚡ "${hName}" ${stageDesc[1]} Closed (+10 XP)`);
    }
  } else if (nextStage === 0.75) {
    showToast(`🌿 "${hName}" ${stageDesc[0.75]} Strong Momentum (+8 XP)`);
  } else if (nextStage === 0.5) {
    showToast(`🛡️ "${hName}" ${stageDesc[0.5]} Defended (+5 XP, streak protected)`);
  } else if (nextStage === 0.25) {
    showToast(`🌱 "${hName}" ${stageDesc[0.25]} Activated (+2 XP)`);
  } else {
    showToast(`"${hName}" set to Off`);
  }
}
window.setAnchorStageAction = setAnchorStageAction;

function scrollToDailySection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('section-highlight-pulse');
    void el.offsetWidth; // trigger reflow to restart animation
    el.classList.add('section-highlight-pulse');
    setTimeout(() => {
      if (el) el.classList.remove('section-highlight-pulse');
    }, 1600);
  }
}
window.scrollToDailySection = scrollToDailySection;

/* ==========================================================================
   Abbey Yung Hair Care Routine & Collapsible Calendar (Fine & Thinning Hair)
   ========================================================================== */

let hairCalendarCollapsed = true;

const HAIR_CARE_SCHEDULE_MAP = {
  1: { // Monday
    type: 'regular',
    badge: '🚿 Regular Wash',
    badgeClass: 'badge-regular',
    title: 'Regular Wash Day',
    subtitle: 'Gentle cleansing, strand protection & weightless root lift',
    steps: [
      { id: 'pre', icon: '🥥', label: 'Pre-Shower Protection', product: 'OGX Argan Oil / Coconut Mist', desc: 'Apply 2–3 drops to dry ends only (15–20 mins; avoid roots to prevent hygral fatigue)' },
      { id: 'wash1', icon: '🫧', label: '1st Shampoo', product: 'Pureology Hydrate Shampoo', desc: 'Dime-sized drop, emulsify in wet palms until frothy, massage scalp thoroughly' },
      { id: 'wash2', icon: '🫧', label: '2nd Shampoo', product: 'Garnier Hair Filler / Pureology', desc: 'Quick second wash for a clean, rich lather (let suds rinse down lengths)' },
      { id: 'cond', icon: '✨', label: 'Conditioner', product: 'Redken Volume Injection Conditioner', desc: 'Nickel-sized amount to mid-lengths/ends only (1–2 mins); weightless filloxane body that rinses 100% clean' },
      { id: 'post', icon: '💨', label: 'Post-Shower Prep (Single Product Only)', product: 'Pantene 10-in-1 (if blow-dry) OR UNITE 7Seconds (if air-dry)', desc: 'Pick ONE only to avoid buildup! Spray 1–2 pumps in palms, apply chin down only. Never spray roots' },
      { id: 'style', icon: '🚀', label: 'Root Lift & Dry', product: 'UNITE BOOSTA Volumizing Spray', desc: 'Spray 2–3 spritzes directly onto damp roots; blow-dry on low/medium heat with nozzle pointing down' }
    ]
  },
  2: { // Tuesday
    type: 'rest',
    badge: '💆‍♀️ Scalp Rest Day',
    badgeClass: 'badge-rest',
    title: 'Scalp Rest Day (Off Day)',
    subtitle: 'Zero wash friction — protect fragile strands & camouflage scalp',
    steps: [
      { id: 'density', icon: '🪄', label: 'Scalp Camouflage (Optional)', product: 'L’Oréal Magic Root Cover Up', desc: 'Lightly mist along part line / hairline for instant visual fullness and scalp shading' },
      { id: 'texture', icon: '✨', label: 'Volume Refresh', product: 'Moroccanoil Dry Texture Spray', desc: 'Spritz crown and mid-lengths on dry hair and tousle for airy grip without clumping' },
      { id: 'sleep', icon: '🌙', label: 'Night Protection', product: 'Satin Pillowcase + Silk Scrunchie', desc: 'Sleep on satin/silk pillowcase; use loose silk scrunchie or claw clip (zero tension)' }
    ]
  },
  3: { // Wednesday
    type: 'bond',
    badge: '🧬 Bond Repair Wash',
    badgeClass: 'badge-bond',
    title: 'Bond Strengthening Wash Day',
    subtitle: 'Rebuilding internal hair bonds & preventing snap breakage',
    steps: [
      { id: 'pre', icon: '🔬', label: 'Pre-Shower Bond Treatment', product: 'Olaplex No. 3 Hair Perfector', desc: 'Dampen lengths/ends & apply nickel-sized amount from chin down (15–20 mins; rebuilds disulfide bonds)' },
      { id: 'wash1', icon: '🫧', label: '1st Shampoo (Rinse Out No. 3)', product: 'L’Oréal EverPure Bond Repair+ Shampoo', desc: 'Rinse No. 3 thoroughly; massage nickel-sized amount of L’Oréal Bond Shampoo into scalp for 60s' },
      { id: 'wash2', icon: '🫧', label: '2nd Shampoo (Cleanse & Citric Bond)', product: 'L’Oréal Bond Repair+ (or Olaplex No. 4)', desc: 'Quick second wash with dime-sized amount to guarantee zero heavy residue on fine roots' },
      { id: 'cond', icon: '✨', label: 'Conditioner', product: 'Redken Volume Injection Conditioner (or Olaplex No. 5)', desc: 'Nickel-sized amount to bottom 2 inches only for 1–2 mins; weightless filloxane body & slip' },
      { id: 'post', icon: '💨', label: 'Post-Shower Protection (Single Product Only)', product: 'Pantene 10-in-1 (if blow-dry) OR UNITE 7Seconds (if air-dry)', desc: 'Pick ONE product only! 1–2 pumps into hands, smooth through ends only to seal bonds without grease' }
    ]
  },
  4: { // Thursday
    type: 'rest',
    badge: '💆‍♀️ Scalp Rest Day',
    badgeClass: 'badge-rest',
    title: 'Scalp Rest Day (Off Day)',
    subtitle: 'Zero wash friction — allow natural scalp sebum balance',
    steps: [
      { id: 'density', icon: '🪄', label: 'Scalp Camouflage (Optional)', product: 'L’Oréal Magic Root Cover Up', desc: 'Light mist on part line to conceal scalp show-through' },
      { id: 'care', icon: '🌿', label: 'Gentle Care', product: 'Soft Scalp Brush', desc: 'No wash today. Gently brush scalp to distribute natural oils if roots need a refresh' },
      { id: 'sleep', icon: '🌙', label: 'Night Protection', product: 'Satin Pillowcase', desc: 'Sleep on a satin/silk pillowcase to protect delicate cuticle layers' }
    ]
  },
  5: { // Friday
    type: 'clarify',
    badge: '🫧 Clarifying Reset',
    badgeClass: 'badge-clarify',
    title: 'Scalp Clarifying Reset Wash Day',
    subtitle: 'Dissolving stubborn product buildup, hard water minerals & oils',
    steps: [
      { id: 'pre', icon: '🥥', label: 'Pre-Shower Protection', product: 'OGX Argan / Coconut Mist', desc: 'Apply 2–3 drops to dry ends only (15–20 mins; shields lengths while clarifying scalp)' },
      { id: 'wash1', icon: '🧼', label: '1st Shampoo (Clarify)', product: 'Garnier Pure Clean Purifying Shampoo', desc: 'Massage scalp for 60 seconds with fingertips to thoroughly detox follicles' },
      { id: 'wash2', icon: '🫧', label: '2nd Shampoo (Hydrate)', product: 'Pureology Hydrate (dime-size)', desc: 'Lightweight second wash so lengths retain moisture without stripping' },
      { id: 'cond', icon: '✨', label: 'Lamellar Rinse (1x/Week Wonder Water)', product: 'L’Oréal 8-Second Wonder Water', desc: 'Apply 1 dose directly to wet ends (chin down); massage 8 secs until warm & silky, rinse thoroughly (replaces heavy conditioner with weightless glass shine!)' },
      { id: 'post', icon: '💨', label: 'Post-Shower Heat & Frizz Shield (Single Product Only)', product: 'Pantene 10-in-1 (if blow-dry) OR UNITE 7Seconds (if air-dry)', desc: 'Pick ONE product only! 1–2 pumps into hands, apply chin down. Keep 100% off roots to preserve clarifying lift' },
      { id: 'style', icon: '🚀', label: 'Root Lift & Volume', product: 'UNITE BOOSTA Volumizing Spray', desc: 'Spray 2–3 pumps directly onto damp roots; blow-dry on low/medium heat for maximum lift' }
    ]
  },
  6: { // Saturday
    type: 'rest',
    badge: '💆‍♀️ Scalp Rest Day',
    badgeClass: 'badge-rest',
    title: 'Scalp Rest Day (Off Day)',
    subtitle: 'Enjoy the lightweight volume from yesterday’s clarifying reset',
    steps: [
      { id: 'texture', icon: '✨', label: 'Volume Refresh', product: 'Moroccanoil Dry Texture Spray', desc: 'Spritz crown and mid-lengths on dry hair for airy, undone volume' },
      { id: 'care', icon: '🌿', label: 'Rest & Style', product: 'Claw Clip / Loose Style', desc: 'No wash today. Keep styling low-heat and low-manipulation' },
      { id: 'sleep', icon: '🌙', label: 'Night Care', product: 'Satin Pillowcase', desc: 'Sleep on satin/silk pillowcase to protect hair ends' }
    ]
  },
  0: { // Sunday
    type: 'regular',
    badge: '🚿 Regular Wash',
    badgeClass: 'badge-regular',
    title: 'Regular Wash Day',
    subtitle: 'Gentle cleansing, strand protection & weightless root lift',
    steps: [
      { id: 'pre', icon: '🥥', label: 'Pre-Shower Protection', product: 'OGX Argan Oil / Coconut Mist', desc: 'Apply 2–3 drops to dry ends only (15–20 mins; avoid roots)' },
      { id: 'wash1', icon: '🫧', label: '1st Shampoo', product: 'Pureology Hydrate Shampoo', desc: 'Dime-sized drop, emulsify in palms, massage scalp thoroughly' },
      { id: 'wash2', icon: '🫧', label: '2nd Shampoo', product: 'Garnier Hair Filler / Pureology', desc: 'Quick second wash for a clean, rich lather' },
      { id: 'cond', icon: '✨', label: 'Conditioner', product: 'Redken Volume Injection Conditioner', desc: 'Apply nickel-sized amount to mid-lengths/ends only; weightless detangling & bouncy body' },
      { id: 'post', icon: '💨', label: 'Post-Shower Prep (Single Product Only)', product: 'Pantene 10-in-1 (if blow-dry) OR UNITE 7Seconds (if air-dry)', desc: 'Pick ONE only! 1–2 pumps into hands, apply chin down to keep fine hair light and bouncy' },
      { id: 'style', icon: '🚀', label: 'Root Lift & Dry', product: 'UNITE BOOSTA Volumizing Spray', desc: 'Spray onto roots; blow-dry on low/medium heat for lift' }
    ]
  }
};

const FOUR_WEEK_SCHEDULE_DATA = [
  { week: 'Week 1 (Sep 28 – Oct 4)', days: [
    { date: '2026-09-28', dayName: 'Mon', num: '28', type: 'regular', badge: 'Regular' },
    { date: '2026-09-29', dayName: 'Tue', num: '29', type: 'rest', badge: 'Rest' },
    { date: '2026-09-30', dayName: 'Wed', num: '30', type: 'bond', badge: 'Bond Repair' },
    { date: '2026-10-01', dayName: 'Thu', num: '1', type: 'rest', badge: 'Rest' },
    { date: '2026-10-02', dayName: 'Fri', num: '2', type: 'clarify', badge: 'Clarify' },
    { date: '2026-10-03', dayName: 'Sat', num: '3', type: 'rest', badge: 'Rest' },
    { date: '2026-10-04', dayName: 'Sun', num: '4', type: 'regular', badge: 'Regular' }
  ]},
  { week: 'Week 2 (Oct 5 – Oct 11)', days: [
    { date: '2026-10-05', dayName: 'Mon', num: '5', type: 'regular', badge: 'Regular' },
    { date: '2026-10-06', dayName: 'Tue', num: '6', type: 'rest', badge: 'Rest' },
    { date: '2026-10-07', dayName: 'Wed', num: '7', type: 'bond', badge: 'Bond Repair' },
    { date: '2026-10-08', dayName: 'Thu', num: '8', type: 'rest', badge: 'Rest' },
    { date: '2026-10-09', dayName: 'Fri', num: '9', type: 'clarify', badge: 'Clarify' },
    { date: '2026-10-10', dayName: 'Sat', num: '10', type: 'rest', badge: 'Rest' },
    { date: '2026-10-11', dayName: 'Sun', num: '11', type: 'regular', badge: 'Regular' }
  ]},
  { week: 'Week 3 (Oct 12 – Oct 18)', days: [
    { date: '2026-10-12', dayName: 'Mon', num: '12', type: 'regular', badge: 'Regular' },
    { date: '2026-10-13', dayName: 'Tue', num: '13', type: 'rest', badge: 'Rest' },
    { date: '2026-10-14', dayName: 'Wed', num: '14', type: 'bond', badge: 'Bond Repair' },
    { date: '2026-10-15', dayName: 'Thu', num: '15', type: 'rest', badge: 'Rest' },
    { date: '2026-10-16', dayName: 'Fri', num: '16', type: 'clarify', badge: 'Clarify' },
    { date: '2026-10-17', dayName: 'Sat', num: '17', type: 'rest', badge: 'Rest' },
    { date: '2026-10-18', dayName: 'Sun', num: '18', type: 'regular', badge: 'Regular' }
  ]},
  { week: 'Week 4 (Oct 19 – Oct 25)', days: [
    { date: '2026-10-19', dayName: 'Mon', num: '19', type: 'regular', badge: 'Regular' },
    { date: '2026-10-20', dayName: 'Tue', num: '20', type: 'rest', badge: 'Rest' },
    { date: '2026-10-21', dayName: 'Wed', num: '21', type: 'bond', badge: 'Bond Repair' },
    { date: '2026-10-22', dayName: 'Thu', num: '22', type: 'rest', badge: 'Rest' },
    { date: '2026-10-23', dayName: 'Fri', num: '23', type: 'clarify', badge: 'Clarify' },
    { date: '2026-10-24', dayName: 'Sat', num: '24', type: 'rest', badge: 'Rest' },
    { date: '2026-10-25', dayName: 'Sun', num: '25', type: 'regular', badge: 'Regular' }
  ]}
];

function getHairCareRoutineForDate(dateStr) {
  const dObj = parseDateIso(dateStr);
  const dayOfWeek = dObj.getDay();
  return HAIR_CARE_SCHEDULE_MAP[dayOfWeek] || HAIR_CARE_SCHEDULE_MAP[1];
}

function toggleHairCalendarCollapse() {
  hairCalendarCollapsed = !hairCalendarCollapsed;
  const drawer = document.getElementById('hair-calendar-drawer');
  const text = document.getElementById('hair-calendar-toggle-text');
  if (drawer) {
    drawer.style.display = hairCalendarCollapsed ? 'none' : 'block';
  }
  if (text) {
    text.textContent = hairCalendarCollapsed ? '▾ View Full Calendar' : '▴ Hide Calendar';
  }
}
window.toggleHairCalendarCollapse = toggleHairCalendarCollapse;

let activeHairSkipDate = null;

function openHairSkipEditor(dateStr) {
  activeHairSkipDate = dateStr;
  renderDailySheet();
  setTimeout(() => {
    const input = document.getElementById('hair-skip-note-input');
    if (input) {
      input.focus();
      input.select();
    }
  }, 60);
}
window.openHairSkipEditor = openHairSkipEditor;

function closeHairSkipEditor() {
  activeHairSkipDate = null;
  renderDailySheet();
}
window.closeHairSkipEditor = closeHairSkipEditor;

function setHairSkipPreset(presetText) {
  const input = document.getElementById('hair-skip-note-input');
  if (input) {
    input.value = presetText;
    input.focus();
  }
}
window.setHairSkipPreset = setHairSkipPreset;

function submitHairCareSkipAction(dateStr) {
  const input = document.getElementById('hair-skip-note-input');
  const note = input ? input.value.trim() : '';
  if (typeof storage !== 'undefined' && typeof storage.recordHairCareSkip === 'function') {
    storage.recordHairCareSkip(dateStr, note);
    if (typeof showToast === 'function') {
      showToast(`⏭️ Skipped routine: "${note || 'Alternative recorded'}" (+5 XP Floor)`);
    }
  }
  activeHairSkipDate = null;
  renderDailySheet();
}
window.submitHairCareSkipAction = submitHairCareSkipAction;

function undoHairCareSkipAction(dateStr) {
  if (typeof storage !== 'undefined' && typeof storage.undoHairCareSkip === 'function') {
    storage.undoHairCareSkip(dateStr);
    if (typeof showToast === 'function') {
      showToast('Hair routine skip removed');
    }
  }
  activeHairSkipDate = null;
  renderDailySheet();
}
window.undoHairCareSkipAction = undoHairCareSkipAction;

function toggleHairCareDayAction(dateStr) {
  if (typeof storage !== 'undefined' && typeof storage.toggleHairCareDay === 'function') {
    const nextVal = storage.toggleHairCareDay(dateStr);
    if (nextVal) {
      if (typeof triggerConfetti === 'function') triggerConfetti();
      if (typeof showToast === 'function') showToast('✨ Hair care routine completed for today! (+10 XP)');
    } else {
      if (typeof showToast === 'function') showToast('Hair care routine marked pending');
    }
  }
  activeHairSkipDate = null;
  renderDailySheet();
}
window.toggleHairCareDayAction = toggleHairCareDayAction;
window.toggleHairCareStepAction = toggleHairCareDayAction; // backward compatibility alias

function renderHairCareCard(dateStr, isToday) {
  const routine = getHairCareRoutineForDate(dateStr);
  const hairCareState = (typeof storage !== 'undefined' && typeof storage.getHairCareState === 'function')
    ? storage.getHairCareState(dateStr)
    : {};
  const isCompleted = !!hairCareState.completed;
  const isSkipped = !!hairCareState.skipped;
  const isEditorOpen = (activeHairSkipDate === dateStr);
  const todayIso = formatDateIso(new Date());

  const dateObj = parseDateIso(dateStr);
  const formattedDay = isToday 
    ? 'Today' 
    : dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const calendarGridHtml = `
    <div class="hair-calendar-grid">
      ${FOUR_WEEK_SCHEDULE_DATA.map(w => `
        <div class="hair-cal-week-row">
          <span class="hair-cal-week-title">${w.week}</span>
          <div class="hair-cal-days-strip">
            ${w.days.map(d => {
              const isSelected = (d.date === dateStr);
              const isTodayCell = (d.date === todayIso);
              const cellRoutine = getHairCareRoutineForDate(d.date);
              const cellState = (typeof storage !== 'undefined' && typeof storage.getHairCareState === 'function')
                ? storage.getHairCareState(d.date)
                : {};
              const cellCompleted = !!cellState.completed;
              const cellSkipped = !!cellState.skipped;

              let badgeText = d.badge;
              let badgeStyleClass = cellRoutine.badgeClass;
              let cellTitle = `${d.dayName}, ${d.date}: ${cellRoutine.title}`;

              if (cellCompleted) {
                badgeText = '✓ Done';
                badgeStyleClass = 'badge-done';
                cellTitle += ' (Completed +10 XP)';
              } else if (cellSkipped) {
                badgeText = '⏭️ Skipped';
                badgeStyleClass = 'badge-skipped';
                cellTitle += ` (Skipped: ${cellState.insteadNote || 'Alternative'} +5 XP)`;
              }

              return `
                <div class="hair-cal-day-cell ${isSelected ? 'is-selected' : ''} ${isTodayCell ? 'is-today' : ''} ${cellSkipped ? 'is-skipped' : ''}" 
                     onclick="jumpToTrackingDate('${d.date}')"
                     title="${escapeHtml(cellTitle)} (Click to jump to this day)">
                  <span class="cal-day-name">${d.dayName}</span>
                  <span class="cal-day-num">${d.num}</span>
                  <span class="cal-day-badge ${badgeStyleClass}">
                    ${badgeText}
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Header status pill
  let headerProgressPill = '1 Checkbox';
  let headerPillClass = '';
  if (isCompleted) {
    headerProgressPill = '🎉 Routine Done (+10 XP)';
    headerPillClass = 'all-done';
  } else if (isSkipped) {
    headerProgressPill = '⏭️ Skipped (+5 XP Floor)';
    headerPillClass = 'floor-done';
  }

  return `
    <!-- Abbey Yung Hair Care Routine Card (Fine & Thinning Hair) -->
    <div class="cover-card hair-care-card" id="section-hair-care">
      <div class="card-title-row">
        <div class="hair-care-title-left">
          <div class="hair-care-title-badge-row">
            <span class="margo-tag margo-tag-a">A — Aesthetic</span>
            <span class="hair-type-tag ${routine.badgeClass}">${routine.badge}</span>
            <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 500;">(${formattedDay})</span>
          </div>
          <h3 class="hair-care-heading" style="display: flex; align-items: center; gap: 8px; font-size: 1.15rem; font-weight: 700; margin-top: 4px;">
            <i data-lucide="sparkles" style="color: var(--margo-a); width: 17px; height: 17px;"></i>
            AY Hair Routine
          </h3>
          <span class="card-sub-muted">${routine.subtitle}</span>
        </div>
        <div class="hair-care-header-right">
          <span class="hair-progress-pill ${headerPillClass}">
            ${headerProgressPill}
          </span>
        </div>
      </div>

      <!-- Daily Tracker: Simple 1 Checkbox + Skip / Alternative Option + Concise Routine -->
      <div class="hair-daily-tracker-box ${isCompleted ? 'is-done' : (isSkipped ? 'is-skipped' : '')}">
        <!-- Master 1-Tap Checkbox Row -->
        <div class="hair-tracker-check-row" onclick="toggleHairCareDayAction('${dateStr}')">
          <div class="custom-checkbox ${isCompleted ? 'checked' : ''}">
            ${isCompleted ? '✓' : ''}
          </div>
          <div class="hair-tracker-check-info">
            <span class="hair-tracker-check-title">${isCompleted ? 'Routine Completed' : (isSkipped ? 'Mark Completed Instead' : 'Complete Today’s Routine')}</span>
            <span class="hair-tracker-check-desc">${routine.badge} · 1 tap to check off full routine (+10 XP)</span>
          </div>
          <span class="hair-tracker-check-pill ${isCompleted ? 'done' : (isSkipped ? 'skipped' : '')}">
            ${isCompleted ? '✓ Done' : (isSkipped ? '⏭️ Skipped' : 'Pending')}
          </span>
        </div>

        <!-- Recorded Alternative Banner (Visible when skipped) -->
        ${isSkipped ? `
          <div class="hair-skip-recorded-banner">
            <div class="hair-skip-recorded-left">
              <span class="hair-skip-badge">⏭️ Routine Skipped</span>
              <div class="hair-skip-note-text">
                <span class="hair-skip-note-label">Instead:</span>
                <span class="hair-skip-note-val">“${escapeHtml(hairCareState.insteadNote || 'Took alternative path')}”</span>
              </div>
            </div>
            <div class="hair-skip-recorded-actions">
              <button type="button" class="hair-skip-action-btn edit-btn" onclick="openHairSkipEditor('${dateStr}')" title="Edit recorded alternative">✏️ Edit</button>
              <button type="button" class="hair-skip-action-btn undo-btn" onclick="undoHairCareSkipAction('${dateStr}')" title="Undo skip and restore pending status">↺ Undo</button>
            </div>
          </div>
        ` : ''}

        <!-- Skip Prompt Row (Visible when not completed and editor not open and not skipped) -->
        ${(!isCompleted && !isSkipped && !isEditorOpen) ? `
          <div class="hair-skip-prompt-row">
            <button type="button" class="hair-skip-btn" onclick="openHairSkipEditor('${dateStr}')">
              <span class="hair-skip-icon">⏭️</span>
              <span class="hair-skip-text">Skipped or did something else today? <strong>Record what you did instead →</strong></span>
            </button>
          </div>
        ` : ''}

        <!-- Inline Skip Drawer / Editor -->
        ${isEditorOpen ? `
          <div class="hair-skip-editor-drawer" id="hair-skip-editor-drawer">
            <div class="hair-skip-editor-header">
              <span class="hair-skip-editor-title">⏭️ Record Alternative for ${formattedDay}</span>
              <span class="hair-skip-editor-hint">+5 XP Floor streak protection</span>
            </div>
            <div class="hair-skip-quick-chips">
              <span class="hair-chips-label">Quick select:</span>
              <button type="button" class="hair-quick-chip" onclick="setHairSkipPreset('Dry shampoo only')">Dry shampoo only</button>
              <button type="button" class="hair-quick-chip" onclick="setHairSkipPreset('Water rinse only')">Water rinse only</button>
              <button type="button" class="hair-quick-chip" onclick="setHairSkipPreset('Slick claw clip bun')">Slick claw clip bun</button>
              <button type="button" class="hair-quick-chip" onclick="setHairSkipPreset('Air dry / low tension')">Air dry / low tension</button>
              <button type="button" class="hair-quick-chip" onclick="setHairSkipPreset('Silk bonnet rest day')">Silk bonnet rest day</button>
            </div>
            <div class="hair-skip-input-group">
              <input type="text" id="hair-skip-note-input" class="hair-skip-note-input" placeholder="What did you do instead? (e.g. Dry shampoo only, claw clip bun...)" value="${escapeHtml(hairCareState.insteadNote || '')}" onkeydown="if(event.key === 'Enter') submitHairCareSkipAction('${dateStr}')" />
              <div class="hair-skip-actions">
                <button type="button" class="hair-skip-save-btn" onclick="submitHairCareSkipAction('${dateStr}')">Save Note (+5 XP)</button>
                <button type="button" class="hair-skip-cancel-btn" onclick="closeHairSkipEditor()">Cancel</button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Concise Routine Sequence Tray -->
        <div class="hair-concise-routine-tray">
          <div class="hair-concise-tray-header">
            <span class="hair-concise-tray-title">Today’s Routine Sequence</span>
            <span class="hair-concise-step-badge">${routine.steps.length} steps</span>
          </div>
          <ul class="hair-concise-steps-list">
            ${routine.steps.map((s, idx) => `
              <li class="hair-concise-step-item">
                <span class="step-num">${idx + 1}</span>
                <span class="step-bullet">${s.icon}</span>
                <div class="step-text">
                  <span class="step-label"><strong>${escapeHtml(s.label)}:</strong></span>
                  <span class="step-product">${escapeHtml(s.product)}</span>
                  <span class="step-desc">— ${escapeHtml(s.desc)}</span>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- Collapsible Full 4-Week Schedule Drawer Toggle -->
      <button type="button" class="hair-calendar-toggle-btn" onclick="toggleHairCalendarCollapse()">
        <span class="toggle-btn-left">
          <i data-lucide="calendar" style="width: 14px; height: 14px; color: var(--margo-a);"></i>
          <span>Full 4-Week Schedule (Sep 28 – Oct 25)</span>
        </span>
        <span class="toggle-btn-right" id="hair-calendar-toggle-text">
          ${hairCalendarCollapsed ? '▾ View Full Calendar' : '▴ Hide Calendar'}
        </span>
      </button>

      <!-- Collapsible Calendar Drawer -->
      <div class="hair-calendar-drawer" id="hair-calendar-drawer" style="display: ${hairCalendarCollapsed ? 'none' : 'block'};">
        ${calendarGridHtml}
      </div>
    </div>
  `;
}
window.renderHairCareCard = renderHairCareCard;

function renderHairCareModalContent(dateStr = activeTrackingDate) {
  const body = document.getElementById('haircare-modal-body');
  if (!body) return;
  const todayIso = formatDateIso(new Date());
  const isToday = (dateStr === todayIso);
  const dateObj = parseDateIso(dateStr);
  const fullFormattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  body.innerHTML = `
    <div class="aurora-hair-modal-nav">
      <button type="button" class="aurora-hair-nav-btn" onclick="navigateDate(-1)">‹ Prev Day</button>
      <div class="aurora-hair-nav-date">
        <strong>${escapeHtml(fullFormattedDate)}</strong>
        ${!isToday ? `<button type="button" class="aurora-hair-today-btn" onclick="resetToToday()">Jump to Today</button>` : `<span class="aurora-hair-today-tag">Today</span>`}
      </div>
      <button type="button" class="aurora-hair-nav-btn" onclick="navigateDate(1)">Next Day ›</button>
    </div>
    ${renderHairCareCard(dateStr, isToday)}
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}
window.renderHairCareModalContent = renderHairCareModalContent;

function openHairCareLogModal(dateStr = activeTrackingDate) {
  if (dateStr) {
    activeTrackingDate = dateStr;
  }
  hairCalendarCollapsed = false;
  renderHairCareModalContent(activeTrackingDate);
  const modal = document.getElementById('modal-haircare-log');
  if (modal) {
    modal.classList.add('active');
  }
}
window.openHairCareLogModal = openHairCareLogModal;

/* ==========================================================================
   Skincare Routine & Daily Tracker (Morning & Evening Schedule + Notes)
   ========================================================================== */

let skinCalendarCollapsed = true;
let activeSkinSkipDate = null;
let activeSkinCareTab = 'evening'; // 'evening' | 'morning' | 'rules'

const NIGHTLY_DOUBLE_CLEANSE = [
  { id: 'prep-1a', icon: '🧴', label: '1A. Oil Cleanse (Dry Skin)', product: 'Prequel Pre-Gleanse Nourishing Oil Cleanser', desc: 'Massage 1–2 pumps onto dry skin for 30s to melt mineral SPF and makeup, emulsify with water & rinse thoroughly.' },
  { id: 'prep-1b', icon: '🫧', label: '1B. Water Cleanse (Wet Skin)', product: 'Vanicream Gentle Facial Cleanser', desc: 'Wash with Vanicream Gentle Facial Cleanser and rinse clean with lukewarm water.' }
];

const SKIN_CARE_SCHEDULE_MAP = {
  1: { // Monday
    type: 'retinoid',
    badge: '🌙 Retinal Night',
    badgeClass: 'badge-retinoid',
    title: 'Retinal Night (Anti-Aging)',
    subtitle: 'Cell turnover & collagen stimulation · Naturium Retinaldehyde 0.05%',
    guardrails: [
      'Apply pea-sized amount on 100% dry skin.',
      'Keep 1 finger-width below lash line. Buffer with moisturizer first if sensitive.',
      'Never combine retinal and lactic acid on the same night (Rule 1).'
    ],
    prepSteps: NIGHTLY_DOUBLE_CLEANSE,
    treatmentSteps: [
      { id: 'treat-1', icon: '🌙', label: 'Retinal (Pea-sized on dry skin)', product: 'Naturium Retinaldehyde Cream Serum 0.05%', desc: 'Wait until skin is completely dry. Apply a pea-sized amount to face and neck. Keep 1 finger-width below lash line.' },
      { id: 'treat-2', icon: '🛡️', label: 'Barrier Seal', product: 'Illiyoon Ceramide Ato Concentrate Cream', desc: 'Seal with rich ceramide cream to lock in moisture and nourish the skin barrier.' }
    ]
  },
  2: { // Tuesday
    type: 'recovery',
    badge: '🛡️ Recovery Night',
    badgeClass: 'badge-recovery',
    title: 'Recovery Night (Hydration & Barrier)',
    subtitle: 'Deep hydration replenishment & peptide matrix repair',
    guardrails: [
      'Apply COSRX Snail Mucin to damp skin, then layer Multi-Peptide + HA.',
      'No acids or retinoids tonight — deep repair mode.'
    ],
    prepSteps: NIGHTLY_DOUBLE_CLEANSE,
    treatmentSteps: [
      { id: 'treat-1', icon: '💧', label: 'Damp-Skin Hydration', product: 'COSRX Advanced Snail 96 Mucin Power Essence', desc: 'Press 1–2 pumps into damp skin for immediate moisture plumping.' },
      { id: 'treat-2', icon: '🧬', label: 'Peptide Infusion', product: 'The Ordinary Multi-Peptide + HA Serum', desc: 'Apply 3–4 drops while skin is still slightly dewy from snail mucin for collagen support.' },
      { id: 'treat-3', icon: '🛡️', label: 'Barrier Seal', product: 'Illiyoon Ceramide Ato Concentrate Cream', desc: 'Seal with Illiyoon Ceramide Ato Concentrate Cream.' }
    ]
  },
  3: { // Wednesday
    type: 'exfoliation',
    badge: '✨ Exfoliate Night',
    badgeClass: 'badge-exfoliation',
    title: 'Exfoliate & Glow Night (Dullness)',
    subtitle: 'Gentle AHA resurfacing & glass-skin hydration · The Ordinary Lactic Acid 5% + HA',
    rampUpNote: '⏳ Ramp-Up Schedule (Rule 2): In Weeks 1–4, swap Wednesday to Recovery (COSRX + Peptides). Add Lactic Acid on Wednesday from Week 4+ once skin is acclimated.',
    guardrails: [
      'Apply Lactic Acid onto 100% dry skin.',
      'Follow with Peach & Lily Glass Skin Serum to soothe and hydrate.',
      'Never combine lactic acid with retinal on the same night (Rule 1).'
    ],
    prepSteps: NIGHTLY_DOUBLE_CLEANSE,
    treatmentSteps: [
      { id: 'treat-1', icon: '✨', label: 'Lactic Acid Exfoliant (Dry Skin)', product: 'The Ordinary Lactic Acid 5% + HA', desc: 'Apply 3–4 drops onto completely dry skin to clear dullness, smooth texture, and draw in hydration.' },
      { id: 'treat-2', icon: '🫧', label: 'Hydrate & Soothe', product: 'Peach & Lily Glass Skin Refining Serum', desc: 'Apply 1–2 pumps to calm, replenish, and illuminate post-exfoliation.' },
      { id: 'treat-3', icon: '🛡️', label: 'Barrier Seal', product: 'Illiyoon Ceramide Ato Concentrate Cream', desc: 'Seal and cushion with ceramide cream.' }
    ]
  },
  4: { // Thursday
    type: 'retinoid',
    badge: '🌙 Retinal Night',
    badgeClass: 'badge-retinoid',
    title: 'Retinal Night (Anti-Aging)',
    subtitle: 'Cell turnover & collagen stimulation · Naturium Retinaldehyde 0.05%',
    guardrails: [
      'Apply pea-sized amount on bone-dry skin.',
      'Keep 1 finger-width below lash line. Buffer with moisturizer if sensitive.'
    ],
    prepSteps: NIGHTLY_DOUBLE_CLEANSE,
    treatmentSteps: [
      { id: 'treat-1', icon: '🌙', label: 'Retinal (Pea-sized on dry skin)', product: 'Naturium Retinaldehyde Cream Serum 0.05%', desc: 'Apply pea-sized amount on bone-dry skin. Keep 1 finger-width below lash line.' },
      { id: 'treat-2', icon: '🛡️', label: 'Barrier Seal', product: 'Illiyoon Ceramide Ato Concentrate Cream', desc: 'Seal with rich ceramide cream.' }
    ]
  },
  5: { // Friday
    type: 'recovery',
    badge: '🛡️ Recovery Night',
    badgeClass: 'badge-recovery',
    title: 'Recovery Night (Hydration & Barrier)',
    subtitle: 'Deep hydration replenishment & peptide matrix repair',
    guardrails: [
      'Layer Multi-Peptide + HA while skin is slightly dewy from Snail Mucin.',
      'Zero acids or retinoids tonight.'
    ],
    prepSteps: NIGHTLY_DOUBLE_CLEANSE,
    treatmentSteps: [
      { id: 'treat-1', icon: '💧', label: 'Damp-Skin Hydration', product: 'COSRX Advanced Snail 96 Mucin Power Essence', desc: 'Press 1–2 pumps into damp skin.' },
      { id: 'treat-2', icon: '🧬', label: 'Peptide Infusion', product: 'The Ordinary Multi-Peptide + HA Serum', desc: 'Apply 3–4 drops while dewy to rebuild collagen and firmness.' },
      { id: 'treat-3', icon: '🛡️', label: 'Barrier Seal', product: 'Illiyoon Ceramide Ato Concentrate Cream', desc: 'Seal with Illiyoon Ceramide Ato Concentrate Cream.' }
    ]
  },
  6: { // Saturday
    type: 'retinoid',
    badge: '🌙 Retinal / Recovery',
    badgeClass: 'badge-retinoid',
    title: 'Retinal Night (or Recovery if Sensitive)',
    subtitle: 'Retinal 3x weekly goal · Flex to Recovery if skin feels sensitive',
    rampUpNote: '⏳ Ramp-Up Schedule (Rule 2): For Weeks 1–4, keep Saturday as Recovery (COSRX + Peptides). Add Saturday Retinal in Week 4+ once Monday and Thursday are well tolerated.',
    guardrails: [
      'If skin feels tight, pink, or sensitive, swap to Recovery tonight.',
      'Apply Retinal pea-sized amount on bone-dry skin.'
    ],
    prepSteps: NIGHTLY_DOUBLE_CLEANSE,
    treatmentSteps: [
      { id: 'treat-1', icon: '🌙', label: 'Retinal (or Recovery if sensitive)', product: 'Naturium Retinaldehyde 0.05% (or COSRX + Peptides)', desc: 'Pea-sized amount of Retinal on dry skin (or switch to COSRX Snail Mucin + Peptides if skin feels sensitive or during Weeks 1–4).' },
      { id: 'treat-2', icon: '🛡️', label: 'Barrier Seal', product: 'Illiyoon Ceramide Ato Concentrate Cream', desc: 'Seal with rich ceramide cream.' }
    ]
  },
  0: { // Sunday
    type: 'glass-skin',
    badge: '🫧 Recovery & Glow',
    badgeClass: 'badge-glass-skin',
    title: 'Recovery: Glass-Skin Reset Night',
    subtitle: 'Deep nourishment cushion · Peach & Lily + Multi-Peptide reset',
    guardrails: [
      'Apply Peach & Lily onto damp skin, then layer Multi-Peptide + HA.',
      'Seal with a generous layer of Illiyoon Ceramide Cream.'
    ],
    prepSteps: NIGHTLY_DOUBLE_CLEANSE,
    treatmentSteps: [
      { id: 'treat-1', icon: '🫧', label: 'Glass-Skin Hydration', product: 'Peach & Lily Glass Skin Refining Serum', desc: 'Apply 1–2 pumps onto slightly damp skin.' },
      { id: 'treat-2', icon: '🧬', label: 'Peptide Matrix Repair', product: 'The Ordinary Multi-Peptide + HA Serum', desc: 'Apply 3–4 drops for deep collagen support and fine-line hydration.' },
      { id: 'treat-3', icon: '🛡️', label: 'Thick Barrier Seal', product: 'Illiyoon Ceramide Ato Concentrate Cream', desc: 'Generous layer of Illiyoon Ceramide Ato Concentrate Cream to reset for the week ahead.' }
    ]
  }
};

const SKIN_CARE_MORNING_ROUTINE = [
  {
    num: 1,
    icon: '🫧',
    title: 'Cleanse or Water Rinse',
    product: 'Vanicream Gentle Facial Cleanser (or Water Rinse)',
    desc: 'Wash with Vanicream cleanser, or simply rinse with lukewarm water if your skin feels dry.'
  },
  {
    num: 2,
    icon: '🧪',
    title: 'Antioxidant (On Dry Skin)',
    product: 'Timeless 20% Vitamin C + E Ferulic Acid Serum',
    desc: 'Apply 1–2 pumps to dry face and neck. Let absorb for 60 seconds to neutralize free radicals and brighten dullness. (Store bottle in refrigerator).'
  },
  {
    num: 3,
    icon: '👁️',
    title: 'De-Puff Under Eyes',
    product: 'The Ordinary Caffeine Solution 5% + EGCG',
    desc: 'Dab 1 small drop lightly under the eyes only along the orbital bone to target puffiness and morning bags.'
  },
  {
    num: 4,
    icon: '✨',
    title: 'Hydrate & Glow',
    product: 'Peach & Lily Glass Skin Refining Serum (or COSRX Snail Mucin)',
    desc: 'Apply 1–2 pumps of Peach & Lily Glass Skin Refining Serum to face and neck (or swap in COSRX Snail Mucin if you prefer a richer dewy layer).'
  },
  {
    num: 5,
    icon: '🛡️',
    title: 'Moisturize + UV Defense',
    product: 'Vanicream Facial Moisturizer Broad Spectrum SPF 30',
    desc: 'Apply a generous 1/4 tsp layer. Tinted moisturizer alone won’t give SPF 30 in a thin layer, so always apply the Vanicream SPF first.'
  },
  {
    num: 6,
    icon: '🪞',
    title: 'Complexion (Optional)',
    product: 'Laura Mercier Tinted Moisturizer Natural Skin Perfector SPF 30',
    desc: 'Smooth on top of the Vanicream SPF for light, natural, perfected coverage.'
  }
];

const SKIN_CARE_RULES = [
  {
    num: 1,
    icon: '🚫',
    title: 'Never Combine Retinal and Lactic Acid on the Same Night',
    rule: 'Never use Naturium Retinaldehyde and The Ordinary Lactic Acid together in the same evening routine. Keep them on separate designated nights (Retinal Mon/Thu/Sat, Lactic Acid Wed).',
    why: 'Combining a potent retinoid with an AHA chemical exfoliant will overwhelm the skin barrier, leading to irritation, peeling, and redness.'
  },
  {
    num: 2,
    icon: '⏳',
    title: 'Ramp Up Slowly (Weeks 1–4 Acclimation)',
    rule: 'Weeks 1–4: Retinal on Monday & Thursday only, and swap Wednesday to Recovery (COSRX + Peptides). Weeks 4+: Add Lactic Acid on Wednesday, then add Saturday Retinal once your skin tolerates it.',
    why: 'Gradual retinization prevents retinoid dermatitis and allows your skin barrier to build tolerance sustainably.'
  },
  {
    num: 3,
    icon: '👁️',
    title: 'Retinal Placement & Buffer Tip',
    rule: 'Keep retinal about a finger-width below the lash line. If your skin is sensitive, apply moisturizer (Illiyoon) first as a buffer before applying retinal.',
    why: 'Under-eye skin is the thinnest on the face and easily irritated by retinoid migration. Buffering slows absorption speed.'
  },
  {
    num: 4,
    icon: '🌿',
    title: 'Skip the Thayers Witch Hazel',
    rule: 'Skip the Thayers toner. It adds little for your goals (anti-aging, hydration, dullness) and can dry skin, especially on retinal and acid nights.',
    why: 'Astringent witch hazel strips natural lipids and counteracts your hydration and barrier-repair goals.'
  },
  {
    num: 5,
    icon: '🧴',
    title: 'Vanicream Moisturizing Cream (Tub)',
    rule: 'Use the Vanicream Moisturizing Cream tub on your body or hands. Illiyoon Ceramide Ato Concentrate Cream covers your face.',
    why: 'Illiyoon contains the optimal encapsulated ceramide, fatty acid, and cholesterol ratio specifically formulated for facial barrier health.'
  },
  {
    num: 6,
    icon: '🛡️',
    title: 'Sunscreen First, Tint Second',
    rule: 'The tinted moisturizer alone will not give you adequate SPF 30 protection in a normal thin cosmetic layer, so always apply a generous 1/4 tsp layer of Vanicream SPF 30 first.',
    why: 'Cosmetic tints are applied too sheerly to achieve labeled SPF ratings; dedicated SPF underneath guarantees full protection.'
  },
  {
    num: 7,
    icon: '🧪',
    title: 'Timeless Vitamin C Storage',
    rule: 'Keep your Timeless Vitamin C refrigerated and replace it if it turns dark orange or brown.',
    why: 'Pure L-ascorbic acid oxidizes rapidly at room temperature. Oxidation turns it into dehydroascorbic acid, causing free-radical stress.'
  }
];

const SKIN_CARE_SHOPPING_ITEMS = [
  {
    id: 'prequel-oil',
    name: 'Prequel Pre-Gleanse Nourishing Oil Cleanser',
    role: 'Nightly Double Cleanse (Step 1A)',
    desc: 'Massage 1–2 pumps onto dry skin for 30s to melt mineral SPF and makeup, emulsify with water & rinse thoroughly.'
  },
  {
    id: 'naturium-retinal',
    name: 'Naturium Retinaldehyde Cream Serum 0.05%',
    role: 'Anti-Aging Active (Mon / Thu / Sat)',
    desc: '1 step closer to retinoic acid than standard retinol; potent collagen support with low irritation.'
  },
  {
    id: 'ordinary-lactic',
    name: 'The Ordinary Lactic Acid 5% + HA',
    role: 'Nighttime Exfoliant (Tue / Fri)',
    desc: 'Gentle AHA chemical exfoliant with hyaluronic acid to clear dullness, smooth texture, and draw in hydration.'
  }
];

const FOUR_WEEK_SKIN_SCHEDULE_DATA = [
  { week: 'Week 1 (Sep 28 – Oct 4)', days: [
    { date: '2026-09-28', dayName: 'Mon', num: '28', type: 'retinoid', badge: 'Retinal' },
    { date: '2026-09-29', dayName: 'Tue', num: '29', type: 'recovery', badge: 'Recovery' },
    { date: '2026-09-30', dayName: 'Wed', num: '30', type: 'recovery', badge: 'Recovery (W1)' },
    { date: '2026-10-01', dayName: 'Thu', num: '1', type: 'retinoid', badge: 'Retinal' },
    { date: '2026-10-02', dayName: 'Fri', num: '2', type: 'recovery', badge: 'Recovery' },
    { date: '2026-10-03', dayName: 'Sat', num: '3', type: 'recovery', badge: 'Recovery (W1)' },
    { date: '2026-10-04', dayName: 'Sun', num: '4', type: 'glass-skin', badge: 'Recovery' }
  ]},
  { week: 'Week 2 (Oct 5 – Oct 11)', days: [
    { date: '2026-10-05', dayName: 'Mon', num: '5', type: 'retinoid', badge: 'Retinal' },
    { date: '2026-10-06', dayName: 'Tue', num: '6', type: 'recovery', badge: 'Recovery' },
    { date: '2026-10-07', dayName: 'Wed', num: '7', type: 'recovery', badge: 'Recovery (W2)' },
    { date: '2026-10-08', dayName: 'Thu', num: '8', type: 'retinoid', badge: 'Retinal' },
    { date: '2026-10-09', dayName: 'Fri', num: '9', type: 'recovery', badge: 'Recovery' },
    { date: '2026-10-10', dayName: 'Sat', num: '10', type: 'recovery', badge: 'Recovery (W2)' },
    { date: '2026-10-11', dayName: 'Sun', num: '11', type: 'glass-skin', badge: 'Recovery' }
  ]},
  { week: 'Week 3 (Oct 12 – Oct 18)', days: [
    { date: '2026-10-12', dayName: 'Mon', num: '12', type: 'retinoid', badge: 'Retinal' },
    { date: '2026-10-13', dayName: 'Tue', num: '13', type: 'recovery', badge: 'Recovery' },
    { date: '2026-10-14', dayName: 'Wed', num: '14', type: 'recovery', badge: 'Recovery (W3)' },
    { date: '2026-10-15', dayName: 'Thu', num: '15', type: 'retinoid', badge: 'Retinal' },
    { date: '2026-10-16', dayName: 'Fri', num: '16', type: 'recovery', badge: 'Recovery' },
    { date: '2026-10-17', dayName: 'Sat', num: '17', type: 'recovery', badge: 'Recovery (W3)' },
    { date: '2026-10-18', dayName: 'Sun', num: '18', type: 'glass-skin', badge: 'Recovery' }
  ]},
  { week: 'Week 4 (Oct 19 – Oct 25)', days: [
    { date: '2026-10-19', dayName: 'Mon', num: '19', type: 'retinoid', badge: 'Retinal' },
    { date: '2026-10-20', dayName: 'Tue', num: '20', type: 'recovery', badge: 'Recovery' },
    { date: '2026-10-21', dayName: 'Wed', num: '21', type: 'exfoliation', badge: 'Lactic 5%' },
    { date: '2026-10-22', dayName: 'Thu', num: '22', type: 'retinoid', badge: 'Retinal' },
    { date: '2026-10-23', dayName: 'Fri', num: '23', type: 'recovery', badge: 'Recovery' },
    { date: '2026-10-24', dayName: 'Sat', num: '24', type: 'retinoid', badge: 'Retinal 3x' },
    { date: '2026-10-25', dayName: 'Sun', num: '25', type: 'glass-skin', badge: 'Recovery' }
  ]}
];

function getSkinCareRoutineForDate(dateStr) {
  const dObj = parseDateIso(dateStr);
  const dayOfWeek = dObj.getDay();
  return SKIN_CARE_SCHEDULE_MAP[dayOfWeek] || SKIN_CARE_SCHEDULE_MAP[1];
}

function setSkinCareTab(tabId) {
  activeSkinCareTab = tabId;
  const modal = document.getElementById('modal-skincare-log');
  if (modal && modal.classList.contains('active')) {
    renderSkinCareModalContent(activeTrackingDate);
  } else {
    renderDailySheet();
  }
}
window.setSkinCareTab = setSkinCareTab;

function toggleSkinCalendarCollapse() {
  skinCalendarCollapsed = !skinCalendarCollapsed;
  const drawer = document.getElementById('skin-calendar-drawer');
  const text = document.getElementById('skin-calendar-toggle-text');
  if (drawer) {
    drawer.style.display = skinCalendarCollapsed ? 'none' : 'block';
  }
  if (text) {
    text.textContent = skinCalendarCollapsed ? '▾ View Full Calendar' : '▴ Hide Calendar';
  }
}
window.toggleSkinCalendarCollapse = toggleSkinCalendarCollapse;

function openSkinSkipEditor(dateStr) {
  activeSkinSkipDate = dateStr;
  const modal = document.getElementById('modal-skincare-log');
  if (modal && modal.classList.contains('active')) {
    renderSkinCareModalContent(dateStr);
  } else {
    renderDailySheet();
  }
  setTimeout(() => {
    const input = document.getElementById('skin-skip-note-input');
    if (input) {
      input.focus();
      input.select();
    }
  }, 60);
}
window.openSkinSkipEditor = openSkinSkipEditor;

function closeSkinSkipEditor() {
  activeSkinSkipDate = null;
  const modal = document.getElementById('modal-skincare-log');
  if (modal && modal.classList.contains('active')) {
    renderSkinCareModalContent(activeTrackingDate);
  } else {
    renderDailySheet();
  }
}
window.closeSkinSkipEditor = closeSkinSkipEditor;

function setSkinSkipPreset(presetText) {
  const input = document.getElementById('skin-skip-note-input');
  if (input) {
    input.value = presetText;
    input.focus();
  }
}
window.setSkinSkipPreset = setSkinSkipPreset;

function submitSkinCareSkipAction(dateStr) {
  const input = document.getElementById('skin-skip-note-input');
  const note = input ? input.value.trim() : '';
  if (typeof storage !== 'undefined' && typeof storage.recordSkinCareSkip === 'function') {
    storage.recordSkinCareSkip(dateStr, note);
    if (typeof showToast === 'function') {
      showToast(`⏭️ Skincare recorded: "${note || 'Alternative routine'}" (+5 XP Floor)`);
    }
  }
  activeSkinSkipDate = null;
  renderDailySheet();
}
window.submitSkinCareSkipAction = submitSkinCareSkipAction;

function undoSkinCareSkipAction(dateStr) {
  if (typeof storage !== 'undefined' && typeof storage.undoSkinCareSkip === 'function') {
    storage.undoSkinCareSkip(dateStr);
    if (typeof showToast === 'function') {
      showToast('Skincare skip removed · pending status restored');
    }
  }
  activeSkinSkipDate = null;
  renderDailySheet();
}
window.undoSkinCareSkipAction = undoSkinCareSkipAction;

function toggleSkinCareDayAction(dateStr) {
  if (typeof storage !== 'undefined' && typeof storage.toggleSkinCareDay === 'function') {
    const nextVal = storage.toggleSkinCareDay(dateStr);
    if (nextVal) {
      if (typeof triggerConfetti === 'function') triggerConfetti();
      if (typeof showToast === 'function') showToast('🫧 Skincare routine completed for today! (+10 XP)');
    } else {
      if (typeof showToast === 'function') showToast('Skincare routine marked pending');
    }
  }
  activeSkinSkipDate = null;
  renderDailySheet();
}
window.toggleSkinCareDayAction = toggleSkinCareDayAction;

function toggleSkinCareSubAction(dateStr, subKey) {
  if (typeof storage !== 'undefined' && typeof storage.toggleSkinCareSubStep === 'function') {
    const updated = storage.toggleSkinCareSubStep(dateStr, subKey);
    const label = subKey === 'am' ? 'Morning Routine' : 'Evening Routine';
    const isDone = !!updated[subKey];
    if (isDone) {
      if (typeof showToast === 'function') {
        showToast(`✨ ${label} completed!`);
      }
      if (updated.completed && typeof triggerConfetti === 'function') {
        triggerConfetti();
      }
    } else {
      if (typeof showToast === 'function') {
        showToast(`${label} marked pending`);
      }
    }
  }
  renderDailySheet();
}
window.toggleSkinCareSubAction = toggleSkinCareSubAction;

function toggleSkinShoppingAction(itemId) {
  if (typeof storage !== 'undefined' && typeof storage.toggleSkinCareShoppingItem === 'function') {
    const isBought = storage.toggleSkinCareShoppingItem(itemId);
    const item = SKIN_CARE_SHOPPING_ITEMS.find(i => i.id === itemId);
    const name = item ? item.name : 'Item';
    if (typeof showToast === 'function') {
      showToast(isBought ? `🛍️ Checked off: ${name}` : `Restored to shopping list: ${name}`);
    }
  }
  const modal = document.getElementById('modal-skincare-log');
  if (modal && modal.classList.contains('active')) {
    renderSkinCareModalContent(activeTrackingDate);
  }
}
window.toggleSkinShoppingAction = toggleSkinShoppingAction;

function renderSkinCareCard(dateStr, isToday) {
  const routine = getSkinCareRoutineForDate(dateStr);
  const skinCareState = (typeof storage !== 'undefined' && typeof storage.getSkinCareState === 'function')
    ? storage.getSkinCareState(dateStr)
    : {};
  const isCompleted = !!skinCareState.completed;
  const isSkipped = !!skinCareState.skipped;
  const isAmDone = !!skinCareState.am;
  const isPmDone = !!skinCareState.pm;
  const isEditorOpen = (activeSkinSkipDate === dateStr);
  const todayIso = formatDateIso(new Date());

  const dateObj = parseDateIso(dateStr);
  const formattedDay = isToday 
    ? 'Today' 
    : dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Header status pill
  let headerProgressPill = '1 Checkbox';
  let headerPillClass = '';
  if (isCompleted) {
    headerProgressPill = '🎉 Skincare Done (+10 XP)';
    headerPillClass = 'all-done';
  } else if (isSkipped) {
    headerProgressPill = '⏭️ Skipped (+5 XP Floor)';
    headerPillClass = 'floor-done';
  } else if (isAmDone && !isPmDone) {
    headerProgressPill = '🌅 AM Done · PM Pending';
    headerPillClass = 'half-done';
  } else if (!isAmDone && isPmDone) {
    headerProgressPill = '🌙 PM Done · AM Pending';
    headerPillClass = 'half-done';
  }

  // Calendar Grid Html
  const calendarGridHtml = `
    <div class="hair-calendar-grid">
      ${FOUR_WEEK_SKIN_SCHEDULE_DATA.map(w => `
        <div class="hair-cal-week-row">
          <span class="hair-cal-week-title">${w.week}</span>
          <div class="hair-cal-days-strip">
            ${w.days.map(d => {
              const isSelected = (d.date === dateStr);
              const isTodayCell = (d.date === todayIso);
              const cellRoutine = getSkinCareRoutineForDate(d.date);
              const cellState = (typeof storage !== 'undefined' && typeof storage.getSkinCareState === 'function')
                ? storage.getSkinCareState(d.date)
                : {};
              const cellCompleted = !!cellState.completed;
              const cellSkipped = !!cellState.skipped;

              let badgeText = d.badge;
              let badgeStyleClass = cellRoutine.badgeClass;
              let cellTitle = `${d.dayName}, ${d.date}: ${cellRoutine.title}`;

              if (cellCompleted) {
                badgeText = '✓ Done';
                badgeStyleClass = 'badge-done';
                cellTitle += ' (Completed +10 XP)';
              } else if (cellSkipped) {
                badgeText = '⏭️ Skipped';
                badgeStyleClass = 'badge-skipped';
                cellTitle += ` (Skipped: ${cellState.insteadNote || 'Alternative'} +5 XP)`;
              }

              return `
                <div class="hair-cal-day-cell ${isSelected ? 'is-selected' : ''} ${isTodayCell ? 'is-today' : ''} ${cellSkipped ? 'is-skipped' : ''}" 
                     onclick="jumpToTrackingDate('${d.date}')"
                     title="${escapeHtml(cellTitle)} (Click to jump to this day)">
                  <span class="cal-day-name">${d.dayName}</span>
                  <span class="cal-day-num">${d.num}</span>
                  <span class="cal-day-badge ${badgeStyleClass}">
                    ${badgeText}
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Tab Content Switcher
  let tabContentHtml = '';

  if (activeSkinCareTab === 'evening') {
    tabContentHtml = `
      <!-- Daily Tracker: Master 1 Checkbox + AM/PM Sub-Toggles + Skip / Alternative + Concise Routine -->
      <div class="hair-daily-tracker-box ${isCompleted ? 'is-done' : (isSkipped ? 'is-skipped' : '')}">
        <!-- Master 1-Tap Checkbox Row -->
        <div class="hair-tracker-check-row" onclick="toggleSkinCareDayAction('${dateStr}')">
          <div class="custom-checkbox ${isCompleted ? 'checked' : ''}">
            ${isCompleted ? '✓' : ''}
          </div>
          <div class="hair-tracker-check-info">
            <span class="hair-tracker-check-title">${isCompleted ? 'Daily Skincare Completed' : (isSkipped ? 'Mark Completed Instead' : 'Complete Today’s Skincare Routine')}</span>
            <span class="hair-tracker-check-desc">${routine.badge} · 1 tap to check off full AM &amp; PM routine (+10 XP)</span>
          </div>
          <span class="hair-tracker-check-pill ${isCompleted ? 'done' : (isSkipped ? 'skipped' : '')}">
            ${isCompleted ? '✓ Done' : (isSkipped ? '⏭️ Skipped' : 'Pending')}
          </span>
        </div>

        <!-- AM / PM Sub-Checkboxes Strip -->
        <div class="skin-subtoggles-row">
          <button type="button" class="skin-subtoggle-btn ${isAmDone ? 'is-done' : ''}" onclick="toggleSkinCareSubAction('${dateStr}', 'am')">
            <span class="subtoggle-ic">${isAmDone ? '✓' : '🌅'}</span>
            <span class="subtoggle-txt">Morning Routine: <strong>${isAmDone ? 'Done' : 'Pending'}</strong></span>
          </button>
          <button type="button" class="skin-subtoggle-btn ${isPmDone ? 'is-done' : ''}" onclick="toggleSkinCareSubAction('${dateStr}', 'pm')">
            <span class="subtoggle-ic">${isPmDone ? '✓' : '🌙'}</span>
            <span class="subtoggle-txt">Evening Routine: <strong>${isPmDone ? 'Done' : 'Pending'}</strong></span>
          </button>
        </div>

        <!-- Recorded Alternative Banner (Visible when skipped) -->
        ${isSkipped ? `
          <div class="hair-skip-recorded-banner">
            <div class="hair-skip-recorded-left">
              <span class="hair-skip-badge">⏭️ Routine Skipped</span>
              <div class="hair-skip-note-text">
                <span class="hair-skip-note-label">Instead:</span>
                <span class="hair-skip-note-val">“${escapeHtml(skinCareState.insteadNote || 'Took alternative path')}”</span>
              </div>
            </div>
            <div class="hair-skip-recorded-actions">
              <button type="button" class="hair-skip-action-btn edit-btn" onclick="openSkinSkipEditor('${dateStr}')" title="Edit recorded alternative">✏️ Edit</button>
              <button type="button" class="hair-skip-action-btn undo-btn" onclick="undoSkinCareSkipAction('${dateStr}')" title="Undo skip and restore pending status">↺ Undo</button>
            </div>
          </div>
        ` : ''}

        <!-- Skip Prompt Row (Visible when not completed and editor not open and not skipped) -->
        ${(!isCompleted && !isSkipped && !isEditorOpen) ? `
          <div class="hair-skip-prompt-row">
            <button type="button" class="hair-skip-btn" onclick="openSkinSkipEditor('${dateStr}')">
              <span class="hair-skip-icon">⏭️</span>
              <span class="hair-skip-text">Low energy or did something else today? <strong>Record what you did instead →</strong></span>
            </button>
          </div>
        ` : ''}

        <!-- Inline Skip Drawer / Editor -->
        ${isEditorOpen ? `
          <div class="hair-skip-editor-drawer" id="skin-skip-editor-drawer">
            <div class="hair-skip-editor-header">
              <span class="hair-skip-editor-title">⏭️ Record Alternative for ${formattedDay}</span>
              <span class="hair-skip-editor-hint">+5 XP Floor streak protection</span>
            </div>
            <div class="hair-skip-quick-chips">
              <span class="hair-chips-label">Quick select:</span>
              <button type="button" class="hair-quick-chip" onclick="setSkinSkipPreset('Gentle wash & moisturizer only')">Gentle wash &amp; moisturizer only</button>
              <button type="button" class="hair-quick-chip" onclick="setSkinSkipPreset('Skipped actives / barrier break')">Skipped actives / barrier break</button>
              <button type="button" class="hair-quick-chip" onclick="setSkinSkipPreset('AM routine only')">AM routine only</button>
              <button type="button" class="hair-quick-chip" onclick="setSkinSkipPreset('PM routine only')">PM routine only</button>
              <button type="button" class="hair-quick-chip" onclick="setSkinSkipPreset('Travel / minimal routine')">Travel / minimal routine</button>
            </div>
            <div class="hair-skip-input-group">
              <input type="text" id="skin-skip-note-input" class="hair-skip-note-input" placeholder="What did you do instead? (e.g. Gentle wash & moisturizer only...)" value="${escapeHtml(skinCareState.insteadNote || '')}" onkeydown="if(event.key === 'Enter') submitSkinCareSkipAction('${dateStr}')" />
              <div class="hair-skip-actions">
                <button type="button" class="hair-skip-save-btn" onclick="submitSkinCareSkipAction('${dateStr}')">Save Note (+5 XP)</button>
                <button type="button" class="hair-skip-cancel-btn" onclick="closeSkinSkipEditor()">Cancel</button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Day-Specific Guardrail Alert Banners -->
        ${routine.rampUpNote ? `
          <div class="skin-guardrail-banner ramp-up">
            <div class="guardrail-icon">⏳</div>
            <div class="guardrail-body">
              <strong>2-Week Ramp-Up Guardrail (Rule 4)</strong>
              <span>${routine.rampUpNote}</span>
            </div>
          </div>
        ` : ''}

        ${routine.guardrails && routine.guardrails.length > 0 ? `
          <div class="skin-guardrails-pill-strip">
            ${routine.guardrails.map(g => `<span class="skin-guardrail-chip">ℹ️ ${escapeHtml(g)}</span>`).join('')}
          </div>
        ` : ''}

        <!-- Concise Evening Sequence Tray -->
        <div class="hair-concise-routine-tray">
          <!-- Nightly Cleanse (Steps 1A & 1B) -->
          <div class="hair-concise-tray-header" style="margin-top: 4px;">
            <span class="hair-concise-tray-title">Every Night First: Double Cleanse</span>
            <span class="hair-concise-step-badge">${routine.prepSteps.length} steps</span>
          </div>
          <ul class="hair-concise-steps-list">
            ${routine.prepSteps.map((s, idx) => `
              <li class="hair-concise-step-item">
                <span class="step-num">${idx + 1}</span>
                <span class="step-bullet">${s.icon}</span>
                <div class="step-text">
                  <span class="step-label"><strong>${escapeHtml(s.label)}:</strong></span>
                  <span class="step-product">${escapeHtml(s.product)}</span>
                  <span class="step-desc">— ${escapeHtml(s.desc)}</span>
                </div>
              </li>
            `).join('')}
          </ul>

          <div class="skin-tray-divider"></div>

          <!-- Nightly Treatment (Steps after cleansing) -->
          <div class="hair-concise-tray-header">
            <span class="hair-concise-tray-title">Steps After Cleansing (${formattedDay})</span>
            <span class="hair-concise-step-badge" style="color: #6D28D9; background: rgba(139, 92, 246, 0.15);">${routine.treatmentSteps.length} steps</span>
          </div>
          <ul class="hair-concise-steps-list">
            ${routine.treatmentSteps.map((s, idx) => `
              <li class="hair-concise-step-item">
                <span class="step-num" style="color: #6D28D9; background: rgba(139, 92, 246, 0.15);">${idx + 1}</span>
                <span class="step-bullet">${s.icon}</span>
                <div class="step-text">
                  <span class="step-label"><strong>${escapeHtml(s.label)}:</strong></span>
                  <span class="step-product" style="color: #6D28D9;">${escapeHtml(s.product)}</span>
                  <span class="step-desc">— ${escapeHtml(s.desc)}</span>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- Collapsible Full 4-Week Schedule Drawer Toggle -->
      <button type="button" class="hair-calendar-toggle-btn" onclick="toggleSkinCalendarCollapse()">
        <span class="toggle-btn-left">
          <i data-lucide="calendar" style="width: 14px; height: 14px; color: var(--margo-a);"></i>
          <span>Full 4-Week Evening Schedule (Sep 28 – Oct 25)</span>
        </span>
        <span class="toggle-btn-right" id="skin-calendar-toggle-text">
          ${skinCalendarCollapsed ? '▾ View Full Calendar' : '▴ Hide Calendar'}
        </span>
      </button>

      <!-- Collapsible Calendar Drawer -->
      <div class="hair-calendar-drawer" id="skin-calendar-drawer" style="display: ${skinCalendarCollapsed ? 'none' : 'block'};">
        ${calendarGridHtml}
      </div>
    `;
  } else if (activeSkinCareTab === 'morning') {
    tabContentHtml = `
      <div class="skin-morning-container">
        <div class="skin-morning-banner">
          <div class="skin-morning-banner-left">
            <span class="skin-morning-tag">Daily Rhythm</span>
            <h4>Morning Routine (Every Day: Monday – Sunday)</h4>
            <p>Antioxidant defense, de-puffing eye care, hydration &amp; SPF 30 broad-spectrum defense</p>
          </div>
          <button type="button" class="skin-quick-action-btn ${isAmDone ? 'is-done' : ''}" onclick="toggleSkinCareSubAction('${dateStr}', 'am')">
            ${isAmDone ? '✓ Morning Done (+5 XP)' : '+ Mark Morning Done (+5 XP)'}
          </button>
        </div>

        <ul class="skin-morning-steps-list">
          ${SKIN_CARE_MORNING_ROUTINE.map(s => `
            <li class="skin-morning-step-card">
              <div class="morning-step-header">
                <span class="morning-step-num">${s.num}</span>
                <span class="morning-step-icon">${s.icon}</span>
                <div class="morning-step-headings">
                  <h5 class="morning-step-title">${escapeHtml(s.title)}</h5>
                  <span class="morning-step-product">${escapeHtml(s.product)}</span>
                </div>
              </div>
              <p class="morning-step-desc">${escapeHtml(s.desc)}</p>
              ${s.hack ? `
                <div class="skin-hack-box">
                  <div class="hack-badge">💠 Extra Puffy Eye Hack</div>
                  <div class="hack-desc">${escapeHtml(s.hack.replace('Extra Puffy Eye Hack: ', ''))}</div>
                </div>
              ` : ''}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  } else if (activeSkinCareTab === 'rules') {
    tabContentHtml = `
      <div class="skin-rules-container">
        <div class="skin-rules-header">
          <h4>7 Essential Rules &amp; Guardrails</h4>
          <p>Scientific guidelines to prevent barrier irritation, peptide degradation, and product conflicts</p>
        </div>
        <div class="skin-rules-grid">
          ${SKIN_CARE_RULES.map(r => `
            <div class="skin-rule-card">
              <div class="rule-card-top">
                <span class="rule-badge">Rule ${r.num}</span>
                <span class="rule-icon">${r.icon}</span>
              </div>
              <h5 class="rule-title">${escapeHtml(r.title)}</h5>
              <p class="rule-text"><strong>Guideline:</strong> ${escapeHtml(r.rule)}</p>
              <div class="rule-why">
                <span class="why-label">Why:</span>
                <span class="why-text">${escapeHtml(r.why)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `
    <!-- Skincare Routine Card -->
    <div class="cover-card skin-care-card" id="section-skin-care">
      <div class="card-title-row">
        <div class="hair-care-title-left">
          <div class="hair-care-title-badge-row">
            <span class="margo-tag margo-tag-a">A — Aesthetic</span>
            <span class="hair-type-tag ${routine.badgeClass}">${routine.badge}</span>
            <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 500;">(${formattedDay})</span>
          </div>
          <h3 class="hair-care-heading" style="display: flex; align-items: center; gap: 8px; font-size: 1.15rem; font-weight: 700; margin-top: 4px;">
            <i data-lucide="sparkles" style="color: var(--margo-a); width: 17px; height: 17px;"></i>
            Skincare Routine &amp; Tracker
          </h3>
          <span class="card-sub-muted">${routine.subtitle}</span>
        </div>
        <div class="hair-care-header-right">
          <span class="hair-progress-pill ${headerPillClass}">
            ${headerProgressPill}
          </span>
        </div>
      </div>

      <!-- Tab Navigation Strip -->
      <div class="skin-tab-nav" role="tablist" aria-label="Skincare Views">
        <button type="button" role="tab" class="skin-tab-btn ${activeSkinCareTab === 'evening' ? 'active' : ''}" onclick="setSkinCareTab('evening')" aria-selected="${activeSkinCareTab === 'evening'}">
          <span class="tab-icon">🌙</span>
          <span>Evening Routine</span>
        </button>
        <button type="button" role="tab" class="skin-tab-btn ${activeSkinCareTab === 'morning' ? 'active' : ''}" onclick="setSkinCareTab('morning')" aria-selected="${activeSkinCareTab === 'morning'}">
          <span class="tab-icon">🌅</span>
          <span>Morning Routine</span>
        </button>
        <button type="button" role="tab" class="skin-tab-btn ${activeSkinCareTab === 'rules' ? 'active' : ''}" onclick="setSkinCareTab('rules')" aria-selected="${activeSkinCareTab === 'rules'}">
          <span class="tab-icon">🛡️</span>
          <span>Rules &amp; Guardrails</span>
        </button>
      </div>

      <!-- Tab Body -->
      <div class="skin-tab-body">
        ${tabContentHtml}
      </div>
    </div>
  `;
}
window.renderSkinCareCard = renderSkinCareCard;

function renderSkinCareModalContent(dateStr = activeTrackingDate) {
  const body = document.getElementById('skincare-modal-body');
  if (!body) return;
  const todayIso = formatDateIso(new Date());
  const isToday = (dateStr === todayIso);
  const dateObj = parseDateIso(dateStr);
  const fullFormattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  body.innerHTML = `
    <div class="aurora-hair-modal-nav">
      <button type="button" class="aurora-hair-nav-btn" onclick="navigateDate(-1)">‹ Prev Day</button>
      <div class="aurora-hair-nav-date">
        <strong>${escapeHtml(fullFormattedDate)}</strong>
        ${!isToday ? `<button type="button" class="aurora-hair-today-btn" onclick="resetToToday()">Jump to Today</button>` : `<span class="aurora-hair-today-tag">Today</span>`}
      </div>
      <button type="button" class="aurora-hair-nav-btn" onclick="navigateDate(1)">Next Day ›</button>
    </div>
    ${renderSkinCareCard(dateStr, isToday)}
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}
window.renderSkinCareModalContent = renderSkinCareModalContent;

function openSkinCareLogModal(dateStr = activeTrackingDate) {
  if (dateStr) {
    activeTrackingDate = dateStr;
  }
  skinCalendarCollapsed = false;
  renderSkinCareModalContent(activeTrackingDate);
  const modal = document.getElementById('modal-skincare-log');
  if (modal) {
    modal.classList.add('active');
  }
}
window.openSkinCareLogModal = openSkinCareLogModal;

/* ==========================================================================
   MARGO Framework 5-Bucket Collapsible Widget
   ========================================================================== */

let margoFrameworkCollapsed = false;

const MARGO_PILLARS_DATA = [
  {
    letter: 'M',
    title: 'Move',
    badgeClass: 'pillar-badge-m',
    tags: ['10k steps', 'Close rings', 'Calorie deficit', 'Cardio', 'Yoga', 'Weights']
  },
  {
    letter: 'A',
    title: 'Aesthetic',
    badgeClass: 'pillar-badge-a',
    tags: ['Skincare', 'Signature outfits', 'Hair health', 'Footcare', 'Makeup']
  },
  {
    letter: 'R',
    title: 'Reflect',
    badgeClass: 'pillar-badge-r',
    tags: ['Meditate', 'Journal', 'Me time']
  },
  {
    letter: 'G',
    title: 'Grow',
    badgeClass: 'pillar-badge-g',
    tags: ['Hobbies', 'Learning']
  },
  {
    letter: 'O',
    title: 'Organize',
    badgeClass: 'pillar-badge-o',
    tags: ['Home projects', 'Finances', 'Travel', 'Everyday chores']
  }
];

function toggleMargoFrameworkCollapse() {
  margoFrameworkCollapsed = !margoFrameworkCollapsed;
  const drawer = document.getElementById('margo-framework-drawer');
  const icon = document.getElementById('framework-toggle-icon');
  if (drawer) {
    drawer.style.display = margoFrameworkCollapsed ? 'none' : 'block';
  }
  if (icon) {
    icon.textContent = margoFrameworkCollapsed ? '▾ View Pillars' : '▴ Collapse';
  }
}
window.toggleMargoFrameworkCollapse = toggleMargoFrameworkCollapse;

function renderMargoFrameworkWidget() {
  const cardsHtml = MARGO_PILLARS_DATA.map(p => `
    <div class="pillar-card pillar-card-${p.letter.toLowerCase()}">
      <div class="pillar-badge ${p.badgeClass}">
        ${p.letter}
      </div>
      <h4 class="pillar-title">${escapeHtml(p.title)}</h4>
      <div class="pillar-tags-list">
        ${p.tags.map(t => `<span class="pillar-tag-pill">${escapeHtml(t)}</span>`).join('')}
      </div>
    </div>
  `).join('');

  return `
    <div class="margo-framework-widget" id="section-margo-framework">
      <div class="framework-header-row" onclick="toggleMargoFrameworkCollapse()">
        <div class="framework-header-left">
          <div class="framework-icon-badge">🧭</div>
          <div class="framework-title-group">
            <h3>
              MARGO Framework
              <span style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); background: var(--bg-surface); padding: 2px 8px; border-radius: var(--radius-full); border: 1px solid var(--border-light);">5 Pillars</span>
            </h3>
            <span class="card-sub-muted">Daily intentional design buckets &amp; core focus areas</span>
          </div>
        </div>
        <button type="button" class="framework-toggle-btn" id="framework-toggle-btn" onclick="event.stopPropagation(); toggleMargoFrameworkCollapse()">
          <span id="framework-toggle-icon">${margoFrameworkCollapsed ? '▾ View Pillars' : '▴ Collapse'}</span>
        </button>
      </div>

      <div class="framework-drawer-container" id="margo-framework-drawer" style="display: ${margoFrameworkCollapsed ? 'none' : 'block'};">
        <div class="margo-pillars-grid">
          ${cardsHtml}
        </div>
      </div>
    </div>
  `;
}
window.renderMargoFrameworkWidget = renderMargoFrameworkWidget;

