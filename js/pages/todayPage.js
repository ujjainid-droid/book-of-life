/* ==========================================================================
   margo · Simplified Today Page & Sunday Ritual Architecture
   Modular ES6+ Implementation adhering to Margo Design Specs:
   - 1. Today (5 daily habits, 10k steps sheet, progress bar, streak chip)
   - 2. Minimum Day (Low-energy 2-item fallback: Skin & Walk, streak safe)
   - 3. Sunday Review (Weekly 2-min audit, 7 day dots, five stats, weigh-in)
   - 4. Parking Lot (Mid-week brain dump shelf, Sunday promote rule)
   - 5. Steps Sheet (10k step logging & automatic month/week averaging)
   ========================================================================== */

let todaySubView = 'today'; // 'today' | 'sunday-review' | 'parking-lot'
let isStepsSheetOpen = false;

/**
 * Main rendering router for Today / Sanctuary
 */
function renderTodayPage() {
  const container = document.getElementById('daily-sheet-container');
  if (!container) return;

  const activeDate = (typeof activeTrackingDate !== 'undefined' && activeTrackingDate)
    ? activeTrackingDate
    : (typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0]);

  // Sync hash routing if specified
  const currentHash = window.location.hash.replace(/^#\/?/, '');
  if (currentHash === 'today/review' || currentHash === 'sunday-review' || currentHash === 'review') {
    todaySubView = 'sunday-review';
  } else if (currentHash === 'today/parking' || currentHash === 'parking-lot' || currentHash === 'parking') {
    todaySubView = 'parking-lot';
  } else if (currentHash === '' || currentHash === 'today' || currentHash === 'sanctuary') {
    todaySubView = 'today';
  }

  // Check if Minimum Day toggle is enabled for this active date
  const isMinimumDay = isDayMinimumDay(activeDate);

  let contentHtml = '';
  if (todaySubView === 'sunday-review') {
    contentHtml = renderSundayReviewHtml(activeDate);
  } else if (todaySubView === 'parking-lot') {
    contentHtml = renderParkingLotHtml(activeDate);
  } else {
    // Normal Today or Minimum Day
    contentHtml = isMinimumDay
      ? renderMinimumDayHtml(activeDate)
      : renderNormalTodayHtml(activeDate);
  }

  container.innerHTML = `
    <div class="margo-screen-wrap">
      ${contentHtml}
    </div>
    ${renderStepsSheetModalHtml(activeDate)}
  `;

  // Attach focus listeners or setup dynamic UI
  if (isStepsSheetOpen) {
    setTimeout(() => {
      const inp = document.getElementById('margo-steps-modal-input');
      if (inp) inp.focus();
    }, 50);
  }

  updatePrimaryNavTodayState();
}
window.renderTodayPage = renderTodayPage;
window.renderDailySheet = renderTodayPage;

/**
 * --------------------------------------------------------------------------
 * 1. Today View HTML
 * --------------------------------------------------------------------------
 */
function renderNormalTodayHtml(dateStr) {
  const dateObj = parseSafeDate(dateStr);
  const weekdayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDayName = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const isSunday = (dateObj.getDay() === 0);

  const streak = calculateMargoStreak(dateStr);
  const habitsState = getDayHabitsState(dateStr);

  // Five habits definition
  const habits = [
    { id: 'h-move', label: 'Move', sub: 'Any walk or workout', isSteps: false },
    { id: 'h-steps', label: '10k steps', sub: getStepsSubLabel(dateStr), isSteps: true },
    { id: 'h-eat', label: 'Eat well', sub: 'One protein-forward meal', isSteps: false },
    { id: 'h-skin', label: 'Skin', sub: 'Morning or evening', isSteps: false },
    { id: 'h-hair', label: 'Hair', sub: "Today's scalp or hair step", isSteps: false }
  ];

  let completedCount = 0;
  habits.forEach(h => {
    if (isHabitDone(h.id, dateStr)) completedCount++;
  });

  const progressPct = Math.round((completedCount / habits.length) * 100);
  const isAllDone = (completedCount === habits.length);
  const encouragement = isAllDone
    ? 'All five. Done for today.'
    : 'No catching up. Just check what you do.';

  return `
    <!-- 1. Header: Day name over Month & Day + Streak Chip -->
    <header class="margo-header-row" role="banner">
      <div>
        <div class="margo-date-day">${weekdayName}</div>
        <h1 class="margo-date-title">${monthDayName}</h1>
      </div>
      <button type="button" class="margo-streak-chip" onclick="navigateToTodaySubView('sunday-review')" aria-label="${streak} day streak. Open Sunday Review">
        <span>${streak} day streak ›</span>
      </button>
    </header>

    <!-- 2. Sunday Banner (Only on Sundays) -->
    ${isSunday ? `
      <button type="button" class="margo-sunday-banner" onclick="navigateToTodaySubView('sunday-review')" aria-label="Open weekly review">
        <span>It's Sunday. Weekly review →</span>
      </button>
    ` : ''}

    <!-- 3. Minimum Day Toggle Card (68px, white, 50x30 switch) -->
    <div class="margo-min-toggle-card" onclick="toggleMinimumDayMode('${dateStr}')" role="button" tabindex="0" aria-label="Toggle Minimum Day">
      <div class="min-text-wrap">
        <span class="min-title">Minimum Day</span>
        <span class="min-sub">Low energy? Just two things.</span>
      </div>
      <div class="margo-switch" role="switch" aria-checked="false">
        <div class="margo-switch-knob"></div>
      </div>
    </div>

    <!-- 4. Progress: 8px bar + N of 5 -->
    <div class="margo-progress-row" aria-label="Progress: ${completedCount} of 5 completed">
      <div class="margo-progress-track">
        <div class="margo-progress-fill" style="width: ${progressPct}%;"></div>
      </div>
      <span class="margo-progress-label">${completedCount} of 5</span>
    </div>

    <!-- 5. Five Habit Rows (10px gap, 68px tall, 30px checkbox) -->
    <section class="margo-habits-list" aria-label="Daily habits">
      ${habits.map(h => renderHabitRowHtml(h, dateStr, false)).join('')}
    </section>

    <!-- 6. Encouragement line -->
    <p class="margo-encouragement">${encouragement}</p>

    <!-- 7. + Park an idea text link -->
    <button type="button" class="margo-park-link" onclick="navigateToTodaySubView('parking-lot')" aria-label="Open Parking Lot">
      + Park an idea
    </button>
  `;
}

/**
 * --------------------------------------------------------------------------
 * 2. Minimum Day View HTML
 * --------------------------------------------------------------------------
 */
function renderMinimumDayHtml(dateStr) {
  const dateObj = parseSafeDate(dateStr);
  const weekdayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDayName = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const streak = calculateMargoStreak(dateStr);

  const minHabits = [
    { id: 'h-skin', label: 'Skin', sub: 'Morning or evening, either counts', isSteps: false },
    { id: 'h-walk', label: 'Walk', sub: 'Just 10 minutes', isSteps: false }
  ];

  let doneCount = 0;
  minHabits.forEach(h => {
    if (isHabitDone(h.id, dateStr)) doneCount++;
  });

  const isFullWin = (doneCount === 2);
  const message = isFullWin
    ? 'A full win. Rest up, see you tomorrow.'
    : `${doneCount} of 2 done.`;

  return `
    <!-- Header: Same as Today -->
    <header class="margo-header-row" role="banner">
      <div>
        <div class="margo-date-day">${weekdayName}</div>
        <h1 class="margo-date-title">${monthDayName}</h1>
      </div>
      <button type="button" class="margo-streak-chip" onclick="navigateToTodaySubView('sunday-review')" aria-label="${streak} day streak. Open Sunday Review">
        <span>${streak} day streak ›</span>
      </button>
    </header>

    <!-- Minimum Day Toggle Card (Switch is ON) -->
    <div class="margo-min-toggle-card" onclick="toggleMinimumDayMode('${dateStr}')" role="button" tabindex="0" aria-label="Minimum Day is On. Tap to return to normal day">
      <div class="min-text-wrap">
        <span class="min-title">Minimum Day</span>
        <span class="min-sub">Low energy? Just two things.</span>
      </div>
      <div class="margo-switch on" role="switch" aria-checked="true">
        <div class="margo-switch-knob"></div>
      </div>
    </div>

    <!-- Heading Block: Just two things -->
    <div class="margo-min-heading">
      <h2>Just two things.</h2>
      <p>That is a full win and your streak stays safe. Everything else can wait.</p>
    </div>

    <!-- Two rows: Skin & Walk (76px tall, 32px checkbox, 18px label) -->
    <section class="margo-habits-list" aria-label="Minimum day habits">
      ${minHabits.map(h => renderHabitRowHtml(h, dateStr, true)).join('')}
    </section>

    <!-- Message -->
    <p class="margo-encouragement">${message}</p>

    <!-- + Park an idea text link -->
    <button type="button" class="margo-park-link" onclick="navigateToTodaySubView('parking-lot')" aria-label="Open Parking Lot">
      + Park an idea
    </button>
  `;
}

/**
 * Render single habit row button
 */
function renderHabitRowHtml(habit, dateStr, isMinDay) {
  const isDone = isHabitDone(habit.id, dateStr);
  const clickHandler = habit.isSteps
    ? `openStepsSheetModal('${dateStr}')`
    : `toggleHabitClick('${habit.id}', '${dateStr}')`;

  return `
    <button type="button"
      class="margo-habit-row ${isMinDay ? 'margo-row-min' : ''} ${isDone ? 'checked' : ''}"
      onclick="${clickHandler}"
      aria-pressed="${isDone ? 'true' : 'false'}"
      aria-label="${habit.label}: ${habit.sub}">
      <span class="margo-habit-checkbox" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
      <span class="margo-habit-content">
        <span class="margo-habit-label">${escapeHtml(habit.label)}</span>
        <span class="margo-habit-sub">${escapeHtml(habit.sub)}</span>
      </span>
    </button>
  `;
}

/**
 * --------------------------------------------------------------------------
 * 3. Sunday Review View HTML
 * --------------------------------------------------------------------------
 */
function renderSundayReviewHtml(dateStr) {
  const dateObj = parseSafeDate(dateStr);
  const monthDayName = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  // Calculate current week Monday to Sunday
  const weekData = getWeekAuditData(dateStr);
  const daysActiveCount = weekData.days.filter(d => d.status === 'full' || d.status === 'min').length;

  // Habits statistics for the week
  const habitStats = getWeekHabitStats(dateStr);

  // Weight info
  const weightStats = getWeighInInfo(dateStr);

  // Parking Lot ideas count
  const parkingIdeas = getParkingLotIdeas();

  return `
    <!-- Top Back Link -->
    <button type="button" class="margo-back-link" onclick="navigateToTodaySubView('today')" aria-label="Back to Today">
      ← Today
    </button>

    <!-- Header Block -->
    <div>
      <div class="margo-date-day">${monthDayName}</div>
      <h1 class="margo-page-title">Weekly review</h1>
      <p class="margo-page-sub">Two minutes. This is the only day goals can change.</p>
    </div>

    <!-- 1. This week card (24 radius, 20 padding): 7 day dots with letters M-S below -->
    <div class="margo-card-block">
      <div class="margo-card-header">
        <span class="margo-card-title">This week</span>
        <span class="margo-card-meta">${daysActiveCount} of 7 days</span>
      </div>

      <div class="margo-week-dots-grid">
        ${weekData.days.map(d => `
          <div class="margo-dot-item">
            <div class="margo-dot dot-${d.status}" title="${d.dayLetter}: ${d.statusLabel}"></div>
            <span class="margo-dot-letter">${d.dayLetter}</span>
          </div>
        `).join('')}
      </div>

      <div class="margo-legend-row">
        <span class="margo-legend-item"><span class="margo-legend-dot leg-full"></span> Full day</span>
        <span class="margo-legend-item"><span class="margo-legend-dot leg-min"></span> Minimum day</span>
        <span class="margo-legend-item"><span class="margo-legend-dot leg-skip"></span> Free skip</span>
      </div>
    </div>

    <!-- 2. Your five card (8px bars, 92px label, 56px value) -->
    <div class="margo-card-block">
      <div class="margo-card-header">
        <span class="margo-card-title">Your five</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 14px;">
        <!-- Move -->
        <div class="margo-stat-row">
          <span class="margo-stat-label">Move</span>
          <div class="margo-progress-track">
            <div class="margo-progress-fill" style="width: ${habitStats.move.pct}%;"></div>
          </div>
          <span class="margo-stat-val">${habitStats.move.count}/7 days</span>
        </div>

        <!-- 10k steps -->
        <div class="margo-stat-row">
          <span class="margo-stat-label">10k steps</span>
          <div class="margo-progress-track">
            <div class="margo-progress-fill" style="width: ${habitStats.steps.pct}%;"></div>
          </div>
          <span class="margo-stat-val">avg ${habitStats.steps.avgK}</span>
        </div>

        <!-- Eat well -->
        <div class="margo-stat-row">
          <span class="margo-stat-label">Eat well</span>
          <div class="margo-progress-track">
            <div class="margo-progress-fill" style="width: ${habitStats.eat.pct}%;"></div>
          </div>
          <span class="margo-stat-val">${habitStats.eat.count}/7 days</span>
        </div>

        <!-- Skin -->
        <div class="margo-stat-row">
          <span class="margo-stat-label">Skin</span>
          <div class="margo-progress-track">
            <div class="margo-progress-fill" style="width: ${habitStats.skin.pct}%;"></div>
          </div>
          <span class="margo-stat-val">${habitStats.skin.count}/7 days</span>
        </div>

        <!-- Hair -->
        <div class="margo-stat-row">
          <span class="margo-stat-label">Hair</span>
          <div class="margo-progress-track">
            <div class="margo-progress-fill" style="width: ${habitStats.hair.pct}%;"></div>
          </div>
          <span class="margo-stat-val">${habitStats.hair.count}/7 days</span>
        </div>
      </div>
    </div>

    <!-- 3. Weigh-in card: Last week X · Target 110 -->
    <div class="margo-card-block">
      <div class="margo-card-header">
        <span class="margo-card-title">Weigh-in</span>
        <span style="font-size: 13px; font-weight: 600; color: var(--margo-muted);">
          Last week ${weightStats.lastWeekStr} · Target ${weightStats.target}
        </span>
      </div>

      <input type="number" step="0.1"
        class="margo-input-clean"
        value="${weightStats.currentWeight !== null ? weightStats.currentWeight : ''}"
        placeholder="Enter weight (e.g. 112.5)"
        onchange="saveSundayWeight(this.value, '${dateStr}')">

      <div style="display: flex; flex-direction: column; gap: 8px;">
        <span style="font-size: 14px; font-weight: 700; color: var(--margo-ink);">What worked?</span>
        <input type="text"
          class="margo-input-clean"
          value="${escapeHtml(weightStats.reflectionText)}"
          placeholder="One line is plenty"
          onchange="saveSundayReflection(this.value, '${dateStr}')">
      </div>
    </div>

    <!-- 4. Parking Lot link: #E9E3FA, 68px -->
    <button type="button" class="margo-parking-card-link" onclick="navigateToTodaySubView('parking-lot')" aria-label="Review your Parking Lot">
      <div>
        <div class="p-title">Review your Parking Lot</div>
        <div class="p-sub">${parkingIdeas.length} ${parkingIdeas.length === 1 ? 'idea' : 'ideas'} waiting. Pick one, let the rest go.</div>
      </div>
      <span style="font-size: 20px; color: var(--margo-accent); font-weight: 700;">›</span>
    </button>
  `;
}

/**
 * --------------------------------------------------------------------------
 * 4. Parking Lot View HTML
 * --------------------------------------------------------------------------
 */
function renderParkingLotHtml(dateStr) {
  const ideas = getParkingLotIdeas();

  return `
    <!-- Top Back Link -->
    <button type="button" class="margo-back-link" onclick="navigateToTodaySubView('today')" aria-label="Back to Today">
      ← Today
    </button>

    <!-- Header Block -->
    <div>
      <h1 class="margo-page-title">Parking Lot</h1>
      <p class="margo-page-sub">Got a new idea or goal mid-week? Park it here. Decide on Sunday.</p>
    </div>

    <!-- Add Row: 56px input + 56px accent "+" button -->
    <form class="margo-park-add-row" onsubmit="event.preventDefault(); submitNewParkedIdea();">
      <input type="text" id="margo-park-input-el"
        class="margo-park-input"
        placeholder="Park an idea or goal..."
        required>
      <button type="submit" class="margo-park-add-btn" aria-label="Add idea to parking lot">
        +
      </button>
    </form>

    <!-- Idea List: White rows, 64px min, text 16px/700, sub "Parked [Day]", 44px circle-less X -->
    <div class="margo-park-list" role="list" aria-label="Parked ideas">
      ${ideas.length === 0 ? `
        <div class="margo-park-empty">
          Nothing parked. Your head is clear.
        </div>
      ` : ideas.map(item => `
        <div class="margo-park-row" role="listitem">
          <div class="margo-park-item-content">
            <span class="margo-park-item-text">${escapeHtml(item.text)}</span>
            <span class="margo-park-item-sub">${escapeHtml(item.dayLabel || 'Parked Today')}</span>
          </div>
          <button type="button"
            class="margo-park-remove-btn"
            onclick="removeParkedIdea('${item.id}')"
            aria-label="Let go of ${escapeHtml(item.text)}"
            title="Let it go">
            ✕
          </button>
        </div>
      `).join('')}
    </div>

    <!-- Footer Callout: #E9E3FA, 22 radius -->
    <div class="margo-park-footer-callout">
      Sunday rule: Promote one idea to next week. Let the rest go. Nothing changes before then.
    </div>
  `;
}

/**
 * --------------------------------------------------------------------------
 * 5. Steps Sheet Modal HTML
 * --------------------------------------------------------------------------
 */
function renderStepsSheetModalHtml(dateStr) {
  const currentLogged = getDayLoggedSteps(dateStr);

  return `
    <div class="margo-sheet-overlay ${isStepsSheetOpen ? 'active' : ''}"
      id="margo-steps-sheet-overlay"
      onclick="if(event.target === this) closeStepsSheetModal()">
      <div class="margo-steps-sheet" onclick="event.stopPropagation()">
        <div>
          <h2 class="margo-sheet-title">Today's steps</h2>
          <p class="margo-sheet-sub">Hit 10,000 and it checks itself off.</p>
        </div>

        <input type="number" id="margo-steps-modal-input"
          class="margo-steps-input"
          value="${currentLogged > 0 ? currentLogged : ''}"
          placeholder="e.g. 10250"
          onkeydown="if(event.key === 'Enter'){ event.preventDefault(); saveStepsFromModal('${dateStr}'); }">

        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
          <button type="button" class="margo-sheet-save-btn" onclick="saveStepsFromModal('${dateStr}')">
            Save
          </button>
          <button type="button" class="margo-sheet-cancel-btn" onclick="closeStepsSheetModal()">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
}



/**
 * --------------------------------------------------------------------------
 * Interactive Actions & State Updates
 * --------------------------------------------------------------------------
 */

function navigateToTodaySubView(subView) {
  todaySubView = subView;
  try {
    if (subView === 'sunday-review') {
      window.location.hash = 'today/review';
    } else if (subView === 'parking-lot') {
      window.location.hash = 'today/parking';
    } else {
      window.location.hash = 'today';
    }
  } catch (e) {}
  renderTodayPage();
}
window.navigateToTodaySubView = navigateToTodaySubView;

function toggleMinimumDayMode(dateStr) {
  if (!storage.data.todayMinimumDays) storage.data.todayMinimumDays = {};
  const current = !!storage.data.todayMinimumDays[dateStr];
  storage.data.todayMinimumDays[dateStr] = !current;
  storage.saveData();
  renderTodayPage();
}
window.toggleMinimumDayMode = toggleMinimumDayMode;

function isDayMinimumDay(dateStr) {
  if (!storage.data || !storage.data.todayMinimumDays) return false;
  return !!storage.data.todayMinimumDays[dateStr];
}

function toggleHabitClick(habitId, dateStr) {
  if (!storage.data.habitsState) storage.data.habitsState = {};
  if (!storage.data.habitsState[dateStr]) storage.data.habitsState[dateStr] = {};

  const current = !!storage.data.habitsState[dateStr][habitId];
  const nextVal = !current;
  storage.data.habitsState[dateStr][habitId] = nextVal;

  if (nextVal && typeof confetti === 'function') {
    // Check if this action completed all 5 habits or both min habits
    const isMin = isDayMinimumDay(dateStr);
    const targetHabits = isMin ? ['h-skin', 'h-walk'] : ['h-move', 'h-steps', 'h-eat', 'h-skin', 'h-hair'];
    const allCompleted = targetHabits.every(id => id === habitId ? nextVal : isHabitDone(id, dateStr));
    if (allCompleted) {
      triggerMargoConfetti();
    }
  }

  // XP Points adjustment
  if (typeof storage.addPoints === 'function') {
    storage.addPoints(nextVal ? 10 : -10);
  }

  storage.saveData();
  renderTodayPage();
}
window.toggleHabitClick = toggleHabitClick;

function isHabitDone(habitId, dateStr) {
  if (!storage.data) return false;

  // 10k steps exception
  if (habitId === 'h-steps') {
    const steps = getDayLoggedSteps(dateStr);
    if (steps >= 10000) return true;
    const hState = storage.data.habitsState && storage.data.habitsState[dateStr];
    return !!(hState && (hState['h-steps'] === true || hState['h-steps'] === 1));
  }

  // Move exception: check if aurora moveCal or standard habit is set
  if (habitId === 'h-move') {
    const hState = storage.data.habitsState && storage.data.habitsState[dateStr];
    if (hState && (hState['h-move'] === true || hState['h-move'] === 1)) return true;
    const auroraDay = storage.data.auroraDailyState && storage.data.auroraDailyState[dateStr];
    if (auroraDay && ((auroraDay.moveCal && auroraDay.moveCal >= 300) || (auroraDay.anch && auroraDay.anch.move === 4))) return true;
    return false;
  }

  // Normal habits: check habitsState
  const hState = storage.data.habitsState && storage.data.habitsState[dateStr];
  if (hState && (hState[habitId] === true || hState[habitId] === 1)) return true;
  return false;
}

/**
 * Steps Sheet Actions
 */
function openStepsSheetModal(dateStr) {
  isStepsSheetOpen = true;
  renderTodayPage();
}
window.openStepsSheetModal = openStepsSheetModal;

function closeStepsSheetModal() {
  isStepsSheetOpen = false;
  renderTodayPage();
}
window.closeStepsSheetModal = closeStepsSheetModal;

function saveStepsFromModal(dateStr) {
  const inp = document.getElementById('margo-steps-modal-input');
  if (!inp) return;
  const val = Math.max(0, parseInt(inp.value, 10) || 0);

  // Save steps into storage
  if (!storage.data.stepLogs) storage.data.stepLogs = {};
  storage.data.stepLogs[dateStr] = val;

  if (typeof storage.saveAuroraDayState === 'function') {
    storage.saveAuroraDayState(dateStr, {
      steps: val,
      anch: {
        steps: val >= 10000 ? 4 : (val >= 7500 ? 3 : (val >= 5000 ? 2 : (val >= 2500 ? 1 : 0)))
      }
    });
  }

  if (!storage.data.habitsState) storage.data.habitsState = {};
  if (!storage.data.habitsState[dateStr]) storage.data.habitsState[dateStr] = {};

  const wasChecked = isHabitDone('h-steps', dateStr);
  const nowChecked = (val >= 10000);
  storage.data.habitsState[dateStr]['h-steps'] = nowChecked;

  if (!wasChecked && nowChecked && typeof confetti === 'function') {
    triggerMargoConfetti();
  }

  storage.saveData();
  isStepsSheetOpen = false;
  renderTodayPage();
}
window.saveStepsFromModal = saveStepsFromModal;

function getDayLoggedSteps(dateStr) {
  if (!storage.data) return 0;
  if (storage.data.stepLogs && storage.data.stepLogs[dateStr] !== undefined) {
    return Number(storage.data.stepLogs[dateStr]) || 0;
  }
  const aurora = storage.data.auroraDailyState && storage.data.auroraDailyState[dateStr];
  if (aurora && aurora.steps !== undefined && aurora.steps !== null) {
    return Number(aurora.steps) || 0;
  }
  const pg = Array.isArray(storage.data.periodGoals) ? storage.data.periodGoals.find(g => g && g.id === 'pg-oct-steps') : null;
  if (pg && pg.logs && pg.logs[dateStr]) {
    return Number(pg.logs[dateStr]) || 0;
  }
  return 0;
}

function getStepsSubLabel(dateStr) {
  const logged = getDayLoggedSteps(dateStr);
  const monthAvg = getMonthAverageSteps(dateStr);
  const avgFormatted = formatStepK(monthAvg);

  if (logged > 0) {
    return `Today ${logged.toLocaleString()} · Avg ${avgFormatted}`;
  }
  return `Avg ${avgFormatted} this month`;
}

function getMonthAverageSteps(dateStr) {
  const d = parseSafeDate(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth();
  let total = 0;
  let count = 0;

  // Tally all days up to dateStr in this month
  for (let day = 1; day <= 31; day++) {
    const curDate = new Date(year, month, day);
    if (curDate.getMonth() !== month) break;
    const curIso = formatDateIsoSafe(curDate);
    if (curIso > dateStr) break;
    const st = getDayLoggedSteps(curIso);
    if (st > 0) {
      total += st;
      count++;
    }
  }

  if (count === 0) return 9500;
  return Math.round(total / count);
}

function formatStepK(num) {
  if (!num || isNaN(num)) return '9.5k';
  const k = (num / 1000).toFixed(1);
  return `${k}k`;
}

/**
 * --------------------------------------------------------------------------
 * Parking Lot Operations
 * --------------------------------------------------------------------------
 */
function getParkingLotIdeas() {
  if (!storage.data) return [];
  if (!Array.isArray(storage.data.parkingLot)) {
    storage.data.parkingLot = [];
  }
  return storage.data.parkingLot;
}

function submitNewParkedIdea() {
  const inp = document.getElementById('margo-park-input-el');
  if (!inp) return;
  const text = (inp.value || '').trim();
  if (!text) return;

  const todayIso = typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0];
  const ideas = getParkingLotIdeas();

  const newIdea = {
    id: `park-${Date.now()}`,
    text,
    date: todayIso,
    dayLabel: 'Parked Today',
    createdAt: Date.now()
  };

  ideas.unshift(newIdea);
  storage.data.parkingLot = ideas;
  storage.saveData();

  inp.value = '';
  renderTodayPage();
}
window.submitNewParkedIdea = submitNewParkedIdea;

function removeParkedIdea(id) {
  if (!storage.data || !Array.isArray(storage.data.parkingLot)) return;
  storage.data.parkingLot = storage.data.parkingLot.filter(item => item.id !== id);
  storage.saveData();
  renderTodayPage();
}
window.removeParkedIdea = removeParkedIdea;

/**
 * --------------------------------------------------------------------------
 * Sunday Review Data & Actions
 * --------------------------------------------------------------------------
 */
function getWeekAuditData(dateStr) {
  const cur = parseSafeDate(dateStr);
  // Find Monday of the current week (assuming Monday is start of habit tracking week)
  const dayOfWeek = cur.getDay(); // 0 is Sunday, 1 is Monday
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + diffToMonday);

  const days = [];
  const letters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  let skippedFound = false;

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const dIso = formatDateIsoSafe(d);
    const isMin = isDayMinimumDay(dIso);
    const hasAnyBox = isMin
      ? (isHabitDone('h-skin', dIso) && isHabitDone('h-walk', dIso))
      : ['h-move', 'h-steps', 'h-eat', 'h-skin', 'h-hair'].some(id => isHabitDone(id, dIso));

    let status = 'empty';
    let statusLabel = 'Unchecked';

    if (hasAnyBox) {
      if (isMin) {
        status = 'min';
        statusLabel = 'Minimum day';
      } else {
        status = 'full';
        statusLabel = 'Full day';
      }
    } else {
      // Check for free skip (one per week)
      if (!skippedFound && dIso <= dateStr) {
        status = 'skip';
        statusLabel = 'Free skip';
        skippedFound = true;
      }
    }

    days.push({
      dateIso: dIso,
      dayLetter: letters[i],
      status,
      statusLabel
    });
  }

  return { days };
}

function getWeekHabitStats(dateStr) {
  const cur = parseSafeDate(dateStr);
  const dayOfWeek = cur.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + diffToMonday);

  const tallies = { move: 0, stepsTotal: 0, stepsCount: 0, eat: 0, skin: 0, hair: 0 };

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const dIso = formatDateIsoSafe(d);

    if (isHabitDone('h-move', dIso)) tallies.move++;
    if (isHabitDone('h-eat', dIso)) tallies.eat++;
    if (isHabitDone('h-skin', dIso)) tallies.skin++;
    if (isHabitDone('h-hair', dIso)) tallies.hair++;

    const st = getDayLoggedSteps(dIso);
    if (st > 0) {
      tallies.stepsTotal += st;
      tallies.stepsCount++;
    }
  }

  const avgSteps = tallies.stepsCount > 0 ? Math.round(tallies.stepsTotal / tallies.stepsCount) : 9500;

  return {
    move: { count: tallies.move, pct: Math.round((tallies.move / 7) * 100) },
    steps: { avgK: formatStepK(avgSteps), pct: Math.min(100, Math.round((avgSteps / 10000) * 100)) },
    eat: { count: tallies.eat, pct: Math.round((tallies.eat / 7) * 100) },
    skin: { count: tallies.skin, pct: Math.round((tallies.skin / 7) * 100) },
    hair: { count: tallies.hair, pct: Math.round((tallies.hair / 7) * 100) }
  };
}

function getWeighInInfo(dateStr) {
  let target = 110;
  if (typeof storage.getWeightTarget === 'function') {
    target = storage.getWeightTarget() || 110;
  }

  let currentWeight = null;
  if (typeof storage.getWeight === 'function') {
    currentWeight = storage.getWeight(dateStr);
  }

  // Get last week's weight
  const d = parseSafeDate(dateStr);
  const prevDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7);
  const prevIso = formatDateIsoSafe(prevDate);
  let lastWeekWeight = null;

  if (storage.data.weightLogs) {
    if (storage.data.weightLogs[prevIso]) {
      lastWeekWeight = Number(storage.data.weightLogs[prevIso]);
    } else {
      // Find latest logged weight before this week
      const entries = Object.entries(storage.data.weightLogs)
        .filter(([dt, w]) => dt < dateStr && w !== null && !isNaN(Number(w)))
        .sort((a, b) => b[0].localeCompare(a[0]));
      if (entries.length > 0) {
        lastWeekWeight = Number(entries[0][1]);
      }
    }
  }

  const lastWeekStr = lastWeekWeight ? `${lastWeekWeight.toFixed(1)}` : '114.2';

  // Sunday reflection
  let reflectionText = '';
  if (storage.data.sundayReflections && storage.data.sundayReflections[dateStr]) {
    reflectionText = storage.data.sundayReflections[dateStr];
  }

  return {
    target,
    currentWeight,
    lastWeekStr,
    reflectionText
  };
}

function saveSundayWeight(val, dateStr) {
  const num = parseFloat(val);
  if (!isNaN(num) && typeof storage.setWeight === 'function') {
    storage.setWeight(num, dateStr);
  }
}
window.saveSundayWeight = saveSundayWeight;

function saveSundayReflection(val, dateStr) {
  if (!storage.data.sundayReflections) storage.data.sundayReflections = {};
  storage.data.sundayReflections[dateStr] = (val || '').trim();
  storage.saveData();
}
window.saveSundayReflection = saveSundayReflection;

/**
 * --------------------------------------------------------------------------
 * Streak Engine adhering to:
 * - Streak counts any day with at least one box checked (or Minimum Day done)
 * - One free skip per week allowed
 * - Does not break if today has 0 boxes yet
 * --------------------------------------------------------------------------
 */
function calculateMargoStreak(referenceDateStr) {
  if (!storage.data) return 0;
  const todayIso = typeof formatDateIso === 'function' ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0];
  const refDate = parseSafeDate(referenceDateStr || todayIso);

  let streak = 0;
  let skipsUsedInCurrentWeek = 0;
  let lastEvaluatedWeekNumber = null;

  for (let i = 0; i < 365; i++) {
    const cur = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate() - i);
    const dIso = formatDateIsoSafe(cur);

    // Week tracking (Monday to Sunday)
    const weekNum = getWeekNumber(cur);
    if (weekNum !== lastEvaluatedWeekNumber) {
      lastEvaluatedWeekNumber = weekNum;
      skipsUsedInCurrentWeek = 0;
    }

    const isMin = isDayMinimumDay(dIso);
    let isDayDone = false;
    if (isMin) {
      isDayDone = isHabitDone('h-skin', dIso) && isHabitDone('h-walk', dIso);
    } else {
      isDayDone = ['h-move', 'h-steps', 'h-eat', 'h-skin', 'h-hair'].some(id => isHabitDone(id, dIso));
    }

    if (isDayDone) {
      streak++;
    } else {
      // If evaluating today and 0 habits are done yet, don't break the streak
      if (i === 0 && dIso === todayIso) {
        continue;
      }
      // Check if eligible for free skip (1 per week)
      if (skipsUsedInCurrentWeek === 0) {
        skipsUsedInCurrentWeek = 1;
        streak++; // Free skip preserves streak
      } else {
        // Streak ends here
        break;
      }
    }
  }

  return streak;
}

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

/**
 * --------------------------------------------------------------------------
 * Navigation & "More" Drawer Management
 * --------------------------------------------------------------------------
 */
function toggleMoreNavSheet() {
  const overlay = document.getElementById('margo-more-sheet-overlay');
  if (!overlay) return;
  overlay.classList.toggle('active');
}
window.toggleMoreNavSheet = toggleMoreNavSheet;

function closeMoreNavSheet() {
  const overlay = document.getElementById('margo-more-sheet-overlay');
  if (!overlay) return;
  overlay.classList.remove('active');
}
window.closeMoreNavSheet = closeMoreNavSheet;

function updatePrimaryNavTodayState() {
  const todayBtn = document.getElementById('nav-btn-today');
  const coverBtn = document.getElementById('nav-btn-cover');
  const kitchenBtn = document.getElementById('nav-btn-kitchen');
  const zhubBtn = document.getElementById('nav-btn-zhub');
  const moreBtn = document.getElementById('nav-btn-more');

  const cur = (typeof currentView !== 'undefined') ? currentView : 'sanctuary';

  if (todayBtn) {
    todayBtn.classList.toggle('active', cur === 'sanctuary');
    todayBtn.classList.toggle('on', cur === 'sanctuary');
  }
  if (coverBtn) {
    coverBtn.classList.toggle('active', cur === 'cover');
    coverBtn.classList.toggle('on', cur === 'cover');
  }
  if (kitchenBtn) {
    kitchenBtn.classList.toggle('active', cur === 'kitchen');
    kitchenBtn.classList.toggle('on', cur === 'kitchen');
  }
  if (zhubBtn) {
    zhubBtn.classList.toggle('active', cur === 'zlog');
    zhubBtn.classList.toggle('on', cur === 'zlog');
  }
  if (moreBtn) {
    const isMoreActive = (cur === 'finance' || cur === 'hobby');
    moreBtn.classList.toggle('active', isMoreActive);
    moreBtn.classList.toggle('on', isMoreActive);
  }
}

/**
 * Confetti Celebration
 */
function triggerMargoConfetti() {
  if (typeof confetti !== 'function') return;
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#5B3FD9', '#A592EC', '#E9E3FA', '#1E1B3A'],
    disableForReducedMotion: true
  });
}

/**
 * Date and String Utilities
 */
function parseSafeDate(dStr) {
  if (!dStr) return new Date();
  const parts = dStr.split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }
  return new Date(dStr);
}

function formatDateIsoSafe(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDayHabitsState(dateStr) {
  if (!storage.data || !storage.data.habitsState) return {};
  return storage.data.habitsState[dateStr] || {};
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
