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

function renderCoverPage() {
  renderDailySheet();
}

function renderDailySheet() {
  const container = document.getElementById('daily-sheet-container') || document.getElementById('page-cover');
  if (!container) return;

  const todayIso = formatDateIso(new Date());
  const selectedDateObj = parseDateIso(activeTrackingDate);
  const isToday = (activeTrackingDate === todayIso);
  const energyMode = (typeof storage !== 'undefined' && typeof storage.getEnergyMode === 'function')
    ? storage.getEnergyMode()
    : 'power';
  const isMaintenance = (energyMode === 'maint');

  // Update Header Date Label
  const headerDateLabel = document.getElementById('header-date-label');
  if (headerDateLabel) {
    if (isToday) {
      const formatted = selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      headerDateLabel.textContent = `Today, ${formatted}`;
      headerDateLabel.classList.remove('is-past-date');
    } else {
      const formatted = selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      headerDateLabel.textContent = `📅 ${formatted}`;
      headerDateLabel.classList.add('is-past-date');
    }
  }

  // Active Habits & State for this date
  const habits = storage.getHabits();
  const dayHabitsState = storage.data.habitsState[activeTrackingDate] || {};

  // Look up Move and Stand habits & 3-stage state (0: off, 0.5: 50% floor, 1: 100% closed)
  const moveHabit = habits.find(h => h && (h.id === 'h-move' || h.name.toLowerCase().trim() === 'move'));
  const standHabit = habits.find(h => h && (h.id === 'h-stand' || h.name.toLowerCase().trim() === 'stand' || h.name.toLowerCase().trim() === 'stand ring'));
  const moveId = moveHabit ? moveHabit.id : 'h-move';
  const standId = standHabit ? standHabit.id : 'h-stand';

  const rawMove = dayHabitsState[moveId];
  const moveStage = (rawMove === 1 || rawMove === true) ? 1 : (rawMove === 0.5 ? 0.5 : 0);
  const rawStand = dayHabitsState[standId];
  const standStage = (rawStand === 1 || rawStand === true) ? 1 : (rawStand === 0.5 ? 0.5 : 0);
  const isMoveDone = moveStage > 0;
  const isStandDone = standStage > 0;

  let completedTodayCount = 0;
  habits.forEach(h => {
    if (h.cadence === 'daily') {
      if (dayHabitsState[h.id]) completedTodayCount++;
    } else {
      if (Number(dayHabitsState[h.id] || 0) > 0 || dayHabitsState[h.id]) completedTodayCount++;
    }
  });

  // Calculate Sunday-start Weekly Stats for streak strip
  const sundayOfSelectedWeek = getSundayOfWeek(selectedDateObj);
  const weeklyStats = calculateWeeklyStats(sundayOfSelectedWeek, habits, storage.data.habitsState);

  // Streak calculation
  let maxStreak = 0;
  let moveStreak = storage.data.habitStreaks[moveId] || 0;
  let standStreak = storage.data.habitStreaks[standId] || 0;
  habits.forEach(h => {
    const s = storage.data.habitStreaks[h.id] || 0;
    if (s > maxStreak) maxStreak = s;
  });

  // Day-Specific Bonus Goals for this date
  const dateDayGoals = storage.getDayGoals(activeTrackingDate);

  // Good Choices for this date
  const dateChoices = storage.getChoices(activeTrackingDate);
  const totalChoices = (dateChoices.good || 0) + (dateChoices.not || 0);
  const goodRatio = totalChoices > 0 ? Math.round((dateChoices.good / totalChoices) * 100) : 100;
  const goodBarWidth = totalChoices > 0 ? Math.round((dateChoices.good / totalChoices) * 100) : 100;
  const notBarWidth = totalChoices > 0 ? 100 - goodBarWidth : 0;

  // Running Weekly Good vs Bad Tally (Sun to Sat) & All-Time Running Total
  const weeklyChoices = storage.getWeeklyChoices(sundayOfSelectedWeek);
  const runningChoices = storage.getRunningChoices();

  // Health & Vitality Check-in for this date
  const currentHealthLevel = storage.getHealthLevel(activeTrackingDate);
  const currentHealthMeta = (currentHealthLevel && typeof HEALTH_LEVELS !== 'undefined') ? HEALTH_LEVELS[currentHealthLevel] : null;
  const weeklyHealth = storage.getWeeklyHealth(sundayOfSelectedWeek);
  const runningHealth = storage.getRunningHealth();

  // Gamification: Sassy Status & Rewards
  const currentPoints = storage.getPoints();
  const statusInfo = getSassyStatus(currentPoints);

  // Daily Sassy Affirmation with rotating visual
  const dailyAff = (typeof getDailyAffirmation === 'function')
    ? getDailyAffirmation(activeTrackingDate, customAffirmationOffset)
    : { emoji: '🥔', text: "You actually got vertical today. Society thanks you for the bare minimum." };

  // Sanctuary Journal entry for this date
  const journalEntry = (typeof storage.getJournal === 'function')
    ? storage.getJournal(activeTrackingDate)
    : null;
  const allJournals = (typeof storage.getAllJournals === 'function')
    ? storage.getAllJournals()
    : [];

  // Active Habits without Move and Stand (which have dedicated Momentum Anchors)
  const additionalHabits = habits.filter(h => 
    h && 
    h.id !== moveId && 
    h.id !== standId && 
    h.name.toLowerCase().trim() !== 'move' && 
    h.name.toLowerCase().trim() !== 'stand' && 
    h.name.toLowerCase().trim() !== 'stand ring'
  );


  // Visual Breadcrumbs: Checkpoints Status Calculations
  const hasChoice = (dateChoices.good || 0) + (dateChoices.not || 0) > 0;
  const hasHealth = !!currentHealthLevel;
  const anchorsDone = (moveStage === 1 && standStage === 1);
  const anchorsFloor = (moveStage > 0 || standStage > 0);
  const hairCareState = (typeof storage !== 'undefined' && typeof storage.getHairCareState === 'function')
    ? storage.getHairCareState(activeTrackingDate)
    : {};
  const isHairCompleted = !!hairCareState.completed;
  const isHairSkipped = !!hairCareState.skipped;
  const hasHairCare = isHairCompleted || isHairSkipped;
  const hasJournal = !!(journalEntry && journalEntry.text && journalEntry.text.trim().length > 0);
  const totalDayGoals = dateDayGoals.length;
  const completedDayGoals = dateDayGoals.filter(g => g && g.completed).length;
  const hasGoals = totalDayGoals > 0;
  const goalsDone = hasGoals && (completedDayGoals === totalDayGoals);

  const totalRequired = hasGoals ? 6 : 5;
  let completedCheckpoints = 0;
  if (hasChoice) completedCheckpoints++;
  if (hasHealth) completedCheckpoints++;
  if (anchorsFloor) completedCheckpoints++;
  if (hasHairCare) completedCheckpoints++;
  if (hasJournal) completedCheckpoints++;
  if (hasGoals && goalsDone) completedCheckpoints++;
  const allCheckpointsDone = (completedCheckpoints >= totalRequired);

  // Z Log status for active tracking date
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

  // Clean up any previously auto-populated dummy goals from storage
  const dummyTexts = new Set([
    'morning mobility',
    'stretch session',
    'post-dinner walk',
    'take breaks',
    'stand and stretch',
    'desk stand offs'
  ]);
  let storedGoals = storage.getDayGoals(activeTrackingDate) || [];
  const cleanedGoals = storedGoals.filter(g => !dummyTexts.has((g.text || '').toLowerCase().trim()));
  if (cleanedGoals.length !== storedGoals.length) {
    storage.data.dayGoals[activeTrackingDate] = cleanedGoals;
    storage.saveData();
  }
  const displayGoals = cleanedGoals;

  const GOOD_CHIPS = [
    { label: 'Hydrated', type: 'good' },
    { label: 'Ate Whole Foods', type: 'good' },
    { label: 'Slept well', type: 'good' },
    { label: 'Meditated', type: 'good' },
    { label: 'Walked More', type: 'good' },
    { label: 'Focus Work', type: 'good' },
    { label: 'Avoided Sugar', type: 'good' },
    { label: 'Took Breaks', type: 'good' }
  ];

  const NOT_GOOD_CHIPS = [
    { label: 'Ate dessert', type: 'not' },
    { label: 'Junk food', type: 'not' },
    { label: 'Skipped meals', type: 'not' },
    { label: 'Late Screen Time', type: 'not' }
  ];

  const formattedDateLong = selectedDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const currentStreak = Math.max(moveStreak, standStreak, maxStreak, 7);

  container.innerHTML = `
    <div class="today-mockup-wrapper">
      ${!isToday ? `
        <!-- Past Date Return Banner -->
        <div class="past-date-banner" style="margin-bottom: 0;">
          <div class="past-date-info">
            <span class="past-date-icon">🕒</span>
            <div>
              <div class="past-date-title">Viewing Past Date: <strong>${selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</strong></div>
              <div class="past-date-sub">Any habits, journal entries, or good choices checked off will be saved to this date.</div>
            </div>
          </div>
          <div class="past-date-actions">
            <button class="btn btn-secondary btn-xs" onclick="navigateDate(-1)" title="Previous Day">← Previous Day</button>
            <button class="btn btn-primary btn-xs" onclick="resetToToday()">↩ Return to Today</button>
            <button class="btn btn-secondary btn-xs" onclick="navigateDate(1)" title="Next Day">Next Day →</button>
          </div>
        </div>
      ` : ''}

      <!-- Floating Center HUD Pill: Exactly like Mockup -->
      <div class="today-floating-hud">
        <button class="hud-nav-btn" onclick="navigateDate(-1)" title="Previous Day">‹</button>
        <div class="hud-date-pill" onclick="triggerHeaderDatePicker()" style="cursor: pointer;" title="Active Date — Tap to pick a specific date">
          <span class="hud-cal-icon">📅</span>
          <span class="hud-date-text">${formattedDateLong}</span>
        </div>
        <div class="hud-divider"></div>
        <div class="hud-streak-pill" title="Anchor Streak">
          <span class="hud-fire-icon">🔥</span>
          <span class="hud-streak-text">${currentStreak}d Streak</span>
        </div>
        <button class="hud-nav-btn" onclick="navigateDate(1)" title="Next Day">›</button>
        ${!isToday ? `<button class="hud-today-btn" onclick="resetToToday()">Today</button>` : ''}
      </div>

      <!-- Vibrant Nordic Daily Roast Banner (No Points) -->
      <div class="today-daily-roast-banner">
        <div class="roast-badge-pill" onclick="rotateDailyRoast()" title="Tap to shuffle daily roast">
          <span class="roast-badge-sparkle">✨</span>
          <span class="roast-badge-label">Daily Roast</span>
          <span class="roast-badge-shuffle">↻</span>
        </div>
        <div class="roast-quote-content">
          <span class="roast-icon">${dailyAff.emoji || '☕'}</span>
          <span class="roast-text">"${escapeHtml(dailyAff.text)}"</span>
        </div>
        <div class="roast-actions">
          <button type="button" class="roast-reward-btn" onclick="claimSassyReward('${statusInfo.currentTier.title.replace(/'/g, "\\'")}')" title="${statusInfo.currentTier.reward}">
            🎁 Treat Yourself
          </button>
        </div>
      </div>

      <!-- 1. Anchors & Goals Card -->
      <div class="today-section-block">
        <h2 class="today-section-title">1. Anchors &amp; Goals</h2>
        
        <div class="today-card today-card-anchors-goals">
          <!-- Left Column: Move Anchor & Stand Ring -->
          <div class="anchors-col">
            <!-- Move Anchor -->
            <div class="anchor-track-group">
              <div class="anchor-label">Move Anchor</div>
              <div class="mockup-track-container">
                <button type="button" class="mockup-seg-btn seg-off ${moveStage === 0 ? 'is-active' : ''}" onclick="setAnchorStageAction('${moveId}', 0, '${activeTrackingDate}')">
                  Off
                </button>
                <button type="button" class="mockup-seg-btn seg-floor ${moveStage === 0.5 ? 'is-active' : ''}" onclick="setAnchorStageAction('${moveId}', 0.5, '${activeTrackingDate}')">
                  50%
                </button>
                <button type="button" class="mockup-seg-btn seg-closed ${moveStage === 1 ? 'is-active' : ''}" onclick="setAnchorStageAction('${moveId}', 1, '${activeTrackingDate}')">
                  100%
                </button>
              </div>
            </div>

            <!-- Stand Ring -->
            <div class="anchor-track-group">
              <div class="anchor-label">Stand Ring</div>
              <div class="mockup-track-container">
                <button type="button" class="mockup-seg-btn seg-off ${standStage === 0 ? 'is-active' : ''}" onclick="setAnchorStageAction('${standId}', 0, '${activeTrackingDate}')">
                  Off
                </button>
                <button type="button" class="mockup-seg-btn seg-floor ${standStage === 0.5 ? 'is-active' : ''}" onclick="setAnchorStageAction('${standId}', 0.5, '${activeTrackingDate}')">
                  50%
                </button>
                <button type="button" class="mockup-seg-btn seg-closed ${standStage === 1 ? 'is-active' : ''}" onclick="setAnchorStageAction('${standId}', 1, '${activeTrackingDate}')">
                  100%
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column: Goals Checklist -->
          <div class="goals-col">
            <div class="mockup-goals-list">
              ${displayGoals.map(g => `
                <div class="mockup-goal-item ${g.completed ? 'is-completed' : ''}">
                  <div class="mockup-goal-checkbox" onclick="toggleDayGoalAction('${g.id}', '${activeTrackingDate}')" title="${g.completed ? 'Mark pending' : 'Mark done'}">
                    ${g.completed ? '✓' : ''}
                  </div>
                  <span class="mockup-goal-label" onclick="toggleDayGoalAction('${g.id}', '${activeTrackingDate}')">${escapeHtml(g.text)}</span>
                  <button class="goal-del-btn" onclick="deleteDayGoalAction('${g.id}', '${activeTrackingDate}')" title="Delete goal">×</button>
                </div>
              `).join('')}
            </div>

            <!-- Minimal Inline Add Row -->
            <form class="mockup-goal-add-form" onsubmit="submitAddDayGoalInline(event, '${activeTrackingDate}', 'mockup-goal-input')">
              <span class="goal-add-icon">＋</span>
              <input type="text" id="mockup-goal-input" class="mockup-goal-add-input" placeholder="Add custom move..." required />
            </form>
          </div>
        </div>
      </div>

      <!-- Row 2: 2. Good Choices & 3. Evening Check-in & Journal (Side-by-side) -->
      <div class="today-row-2">
        <!-- 2. Good Choices -->
        <div class="today-col-left">
          <h2 class="today-section-title">2. Good Choices</h2>
          <div class="today-card today-card-choices" id="section-good-choices">
            <!-- 1. Top Tally Widgets & Steppers -->
            <div class="choices-tally-header">
              <div class="choices-tally-grid">
                <!-- Good Choice Counter Card -->
                <div class="choice-counter-box counter-good">
                  <div class="counter-box-info">
                    <span class="counter-box-label">Good Choices</span>
                    <span class="counter-box-num">${dateChoices.good || 0}</span>
                  </div>
                  <div class="counter-box-steppers">
                    <button type="button" class="stepper-btn stepper-minus" onclick="recordChoiceAction('good', -1, '${activeTrackingDate}')" title="Subtract 1 Good Choice" ${dateChoices.good <= 0 ? 'disabled' : ''}>−</button>
                    <button type="button" class="stepper-btn stepper-plus" onclick="recordChoiceAction('good', 1, '${activeTrackingDate}')" title="Add 1 Good Choice">＋</button>
                  </div>
                </div>

                <!-- Not-so-good Counter Card -->
                <div class="choice-counter-box counter-not">
                  <div class="counter-box-info">
                    <span class="counter-box-label">Not-so-good</span>
                    <span class="counter-box-num">${dateChoices.not || 0}</span>
                  </div>
                  <div class="counter-box-steppers">
                    <button type="button" class="stepper-btn stepper-minus" onclick="recordChoiceAction('not', -1, '${activeTrackingDate}')" title="Subtract 1 Not-so-good" ${dateChoices.not <= 0 ? 'disabled' : ''}>−</button>
                    <button type="button" class="stepper-btn stepper-plus" onclick="recordChoiceAction('not', 1, '${activeTrackingDate}')" title="Add 1 Not-so-good">＋</button>
                  </div>
                </div>
              </div>

              <!-- Ratio & Reset Bar -->
              <div class="mockup-choice-ratio-info">
                <span class="ratio-text">${totalChoices > 0 ? `<strong>${goodRatio}% Good</strong> (${dateChoices.good} vs ${dateChoices.not})` : 'Tap chips or steppers to log daily momentum'}</span>
                ${totalChoices > 0 ? `
                  <button class="choice-mini-undo" onclick="resetChoicesAction('${activeTrackingDate}')" title="Reset both counts to 0">↺ Reset</button>
                ` : ''}
              </div>

              <div class="mockup-ratio-bar">
                <div class="ratio-bar-good" style="width: ${goodBarWidth}%;"></div>
                <div class="ratio-bar-not" style="width: ${notBarWidth}%;"></div>
              </div>
            </div>

            <!-- Option 1: Horizontal Streamlined Momentum Ribbon -->
            <div class="choices-momentum-ribbon">
              <!-- Left: Circular Net Pill & Label -->
              <div class="ribbon-net-group">
                <div class="ribbon-net-badge ${runningChoices.net >= 0 ? 'is-pos' : 'is-neg'}" title="Net Good Choices (All-Time)">
                  <span class="ribbon-net-num">${runningChoices.net >= 0 ? `+${runningChoices.net}` : runningChoices.net}</span>
                  <span class="ribbon-net-sub">Net</span>
                </div>
                <div class="ribbon-title-col">
                  <div class="ribbon-title-text">Running Momentum</div>
                  <div class="ribbon-ratio-text"><strong>${runningChoices.total > 0 ? runningChoices.ratio : 100}%</strong> Positive Choices</div>
                </div>
              </div>

              <!-- Right: Clean Inline Split Stats -->
              <div class="ribbon-stats-group">
                <div class="ribbon-stat-item">
                  <span class="ribbon-stat-label">This Week</span>
                  <div class="ribbon-stat-values">
                    <span class="ribbon-val-good">${weeklyChoices.totalGood}</span>
                    <span class="ribbon-val-sep">/</span>
                    <span class="ribbon-val-not">${weeklyChoices.totalNot}</span>
                  </div>
                </div>

                <div class="ribbon-stat-divider"></div>

                <div class="ribbon-stat-item">
                  <span class="ribbon-stat-label">All-Time</span>
                  <div class="ribbon-stat-values">
                    <span class="ribbon-val-good">${runningChoices.totalGood}</span>
                    <span class="ribbon-val-sep">/</span>
                    <span class="ribbon-val-not">${runningChoices.totalNot}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Choice Options (Smaller Chips) -->
            <div class="choices-options-section">
              <div class="choices-options-group">
                <div class="choices-group-label label-good">Good choices</div>
                <div class="mockup-chips-cloud">
                  ${GOOD_CHIPS.map(chip => `
                    <button type="button" class="mockup-chip chip-cyan" onclick="recordChoiceChip('${chip.label}', 'good', '${activeTrackingDate}')">
                      ${escapeHtml(chip.label)}
                    </button>
                  `).join('')}
                </div>
              </div>

              <div class="choices-options-group" style="margin-top: 10px;">
                <div class="choices-group-label label-not">Not-so-good</div>
                <div class="mockup-chips-cloud" style="margin-bottom: 0;">
                  ${NOT_GOOD_CHIPS.map(chip => `
                    <button type="button" class="mockup-chip chip-rose" onclick="recordChoiceChip('${chip.label}', 'not', '${activeTrackingDate}')">
                      ${escapeHtml(chip.label)}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Evening Check-in & Journal -->
        <div class="today-col-right">
          <div class="today-section-header-row">
            <h2 class="today-section-title" style="margin-bottom: 0;">3. Evening Check-in &amp; Journal</h2>
            <div class="journal-tab-pill-switcher">
              <button type="button" class="journal-tab-pill ${sanctuaryJournalTab === 'today' ? 'active' : ''}" onclick="setSanctuaryJournalTab('today')">
                ✍️ Today
              </button>
              <button type="button" class="journal-tab-pill ${sanctuaryJournalTab === 'archive' ? 'active' : ''}" onclick="setSanctuaryJournalTab('archive')">
                📚 Archive (${allJournals.length})
              </button>
            </div>
          </div>

          <div class="today-card today-card-journal" id="section-sanctuary-journal">
            ${sanctuaryJournalTab === 'archive' ? `
              <!-- ARCHIVE VIEW: Where to see saved journal entries -->
              <div class="journal-archive-pane">
                <div class="archive-filter-row" style="margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;">
                  <div class="archive-filter-pills">
                    <button type="button" class="archive-filter-btn ${sanctuaryArchiveFilter === 'all' ? 'active' : ''}" onclick="setSanctuaryArchiveFilter('all')">All (${allJournals.length})</button>
                    <button type="button" class="archive-filter-btn ${sanctuaryArchiveFilter === 'last_week' ? 'active' : ''}" onclick="setSanctuaryArchiveFilter('last_week')">Last Week</button>
                    <button type="button" class="archive-filter-btn ${sanctuaryArchiveFilter === 'this_month' ? 'active' : ''}" onclick="setSanctuaryArchiveFilter('this_month')">This Month</button>
                  </div>
                  <button type="button" class="journal-back-today-btn" onclick="setSanctuaryJournalTab('today')">✍️ Back to Today</button>
                </div>

                <!-- SQUARE CARDS GRID -->
                <div class="journal-square-grid">
                  ${renderJournalSquareGrid(allJournals, sanctuaryArchiveFilter)}
                </div>
              </div>
            ` : `
              <!-- TODAY VIEW: Vibrant Vitality & Evening Reflection -->
              <div class="mockup-subhead" style="color: #7C3AED;">How Healthy Do I Feel?</div>
              
              <!-- Previous Vitality Level Options: 5 (Thriving) to 1 (Zombie) with custom pastel colors -->
              <div class="health-buttons-grid" style="margin-bottom: 12px;">
                ${[5, 4, 3, 2, 1].map(lvl => {
                  const meta = (typeof HEALTH_LEVELS !== 'undefined') ? HEALTH_LEVELS[lvl] : { emoji: '✨', label: `Lvl ${lvl}`, desc: '', sassy: '' };
                  const isSelected = (currentHealthLevel === lvl);
                  return `
                    <button type="button" 
                            class="health-btn ${isSelected ? 'active' : ''}" 
                            data-lvl="${lvl}"
                            onclick="recordHealthLevelAction(${lvl}, '${activeTrackingDate}')"
                            title="${meta.label}: ${meta.desc}">
                      <span class="health-btn-emoji">${meta.emoji}</span>
                      <span class="health-btn-label">${meta.label}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- Sassy Saying / Insight -->
              ${currentHealthMeta ? `
                <div class="health-sassy-quote" style="margin-bottom: 16px;">
                  <span class="quote-icon">${currentHealthMeta.emoji}</span>
                  <div>
                    <strong>${currentHealthMeta.label}:</strong> <em>"${currentHealthMeta.sassy}"</em>
                  </div>
                </div>
              ` : ''}

              <div class="journal-subhead-row">
                <div class="mockup-subhead" style="color: #4F46E5; margin-bottom: 0;">How did your day feel?</div>
                ${allJournals.length > 0 ? `
                  <button type="button" class="journal-view-archive-link" onclick="setSanctuaryJournalTab('archive')">
                    📚 View Archive (${allJournals.length}) →
                  </button>
                ` : ''}
              </div>

              <!-- Journal Box with Color & Polish -->
              <div class="mockup-journal-box">
                <textarea 
                  class="mockup-journal-textarea" 
                  id="mockup-journal-input" 
                  placeholder="Type your evening reflections, wins, or brain dump here..."
                  oninput="handleSanctuaryJournalInput('${activeTrackingDate}', this.value)"
                >${escapeHtml(journalEntry ? journalEntry.text : '')}</textarea>
                
                <div class="mockup-journal-bottom">
                  <span class="journal-autosave-note" id="journal-autosave-status">
                    ${journalEntry && journalEntry.text ? `✓ Auto-saved (${journalEntry.wordCount || 0} words)` : 'Auto-saves as you type'}
                  </span>
                  <button type="button" class="mockup-journal-save-btn" onclick="saveMockupJournalAction('${activeTrackingDate}')">
                    <span>✏️</span>
                    <span>Save Journal</span>
                  </button>
                </div>
              </div>

              <!-- Sleek Quick Access Badges (Haircare & Z Log) with Rich Colors and Quick-Check -->
              <div class="mockup-quick-utilities">
                <div class="util-badge-item badge-haircare ${isHairCompleted ? 'is-done' : ''}">
                  <button type="button" class="util-badge-btn-main" onclick="toggleMockupHaircare()" title="View Abbey Yung Hair Care Protocol">
                    <span>🧴</span>
                    <span>Haircare: <strong>${isHairCompleted ? 'Done ✓' : (isHairSkipped ? 'Skipped' : 'Pending')}</strong></span>
                  </button>
                  <button type="button" class="util-badge-quick-check ${isHairCompleted ? 'checked' : ''}" onclick="toggleHairCareDayAction('${activeTrackingDate}')" title="${isHairCompleted ? 'Mark Pending' : 'Check off routine (+10 XP)'}">
                    ${isHairCompleted ? '✓' : '○'}
                  </button>
                </div>

                <div class="util-badge-item badge-zlog">
                  <button type="button" class="util-badge-btn-main" onclick="openZLogEntryModal('${activeTrackingDate}')" title="Z Log Daily Regulation">
                    <span>🌱</span>
                    <span>Z Log: <strong>${isZLogLogged ? (zlogRatingObj ? zlogRatingObj.shortLabel : 'Done ✓') : 'Log +10 XP'}</strong></span>
                  </button>
                </div>
              </div>
            `}
          </div>
        </div>
      </div>

      <!-- Collapsible Abbey Yung Hair Care Card (When tapped) -->
      ${mockupHaircareExpanded ? `
        <div style="margin-top: 4px;">
          ${renderHairCareCard(activeTrackingDate, isToday)}
        </div>
      ` : ''}
    </div>
  `;

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
  const status = document.getElementById('journal-autosave-status');
  if (status) {
    status.innerHTML = '<span style="color: var(--warning);">● Saving...</span>';
  }

  clearTimeout(journalAutoSaveTimer);
  journalAutoSaveTimer = setTimeout(() => {
    storage.saveJournal(dateStr, value);
    if (status) {
      status.innerHTML = '<span style="color: var(--success); font-weight: 600;">✓ Auto-saved</span>';
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
window.claimSassyReward = claimSassyReward;
window.rotateDailyRoast = rotateDailyRoast;

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
  const input = document.getElementById('mockup-journal-input');
  if (input) {
    const val = input.value.trim();
    storage.saveJournal(dateStr, val);
    showToast('✓ Evening Journal Saved to Sanctuary (+10 XP)');
    renderDailySheet();
  }
}
window.saveMockupJournalAction = saveMockupJournalAction;

/**
 * Health Level Action
 */
function recordHealthLevelAction(level, dateStr) {
  storage.setHealthLevel(dateStr, level);
  renderDailySheet();
  const meta = (typeof HEALTH_LEVELS !== 'undefined') ? HEALTH_LEVELS[level] : null;
  if (meta) {
    showToast(`${meta.emoji} Logged: ${meta.label} (+5 XP)`);
  }
}

/**
 * Day Goals Actions
 */
function toggleDayGoalAction(goalId, dateStr) {
  storage.toggleDayGoal(dateStr, goalId);
  renderDailySheet();
}

function deleteDayGoalAction(goalId, dateStr) {
  storage.deleteDayGoal(dateStr, goalId);
  renderDailySheet();
}

function submitAddDayGoalInline(event, dateStr, inputId) {
  event.preventDefault();
  const input = document.getElementById(inputId);
  if (!input || !input.value.trim()) return;

  storage.addDayGoal(dateStr, input.value.trim());
  input.value = '';
  renderDailySheet();
  showToast('✓ Day-Specific Goal Added (+15 XP when completed)');
}

function resetToToday() {
  activeTrackingDate = formatDateIso(new Date());
  renderDailySheet();
}

function navigateDate(offset) {
  const d = parseDateIso(activeTrackingDate);
  d.setDate(d.getDate() + offset);
  activeTrackingDate = formatDateIso(d);
  renderDailySheet();
}

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

  if (nextStage === 1) {
    showToast(`✓ "${hName}" 100% Closed (+10 XP)`);
  } else if (nextStage === 0.5) {
    showToast(`🛡️ "${hName}" 50% Floor Defended (+5 XP, streak protected)`);
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
    badge: '💧 Regular Wash',
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
    badge: '🛌 Scalp Rest Day',
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
    badge: '🛌 Scalp Rest Day',
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
    badge: '🌿 Scalp Clarifying Reset',
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
    badge: '🛌 Scalp Rest Day',
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
    badge: '💧 Regular Wash',
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

