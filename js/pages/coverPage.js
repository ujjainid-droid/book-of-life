/* ==========================================================================
   Book of Life / Life OS - margo Sanctuary Daily Sheet Renderer
   ========================================================================== */

let activeTrackingDate = formatDateIso(new Date());
let sanctuaryJournalTab = 'today'; // 'today' | 'archive'
let sanctuaryJournalEditing = false;
let sanctuaryArchiveFilter = 'all'; // 'all' | 'last_week' | 'this_month'

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

  // Quick Thoughts Inbox
  const activeThoughts = (typeof storage.getQuickThoughts === 'function') 
    ? storage.getQuickThoughts('active') 
    : [];
  const triagedThoughts = (typeof storage.getQuickThoughts === 'function') 
    ? storage.getQuickThoughts('triaged') 
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

  // Confidante Radical Candor Synthesis (Move & Stand + Vitality + Choices)
  let confidanteStance = '⚠️ Baseline Breached';
  let confidanteQuote = '';
  let confidanteNextStep = '';

  const bothClosed = (moveStage === 1 && standStage === 1);
  const floorDefended = (moveStage > 0 || standStage > 0) && !bothClosed;
  const zeroDefended = (moveStage === 0 && standStage === 0);

  if (bothClosed) {
    confidanteStance = '🔥 Ruthless Execution';
    if (currentHealthLevel && currentHealthLevel <= 2) {
      confidanteQuote = `"Vitality was only ${currentHealthLevel}/5 today, yet you closed both Move & Stand 100%. That is uncompromising discipline. Respect the physiological reality—bank your rest early tonight."`;
    } else if (currentHealthLevel && currentHealthLevel >= 4) {
      confidanteQuote = `"High vitality (${currentHealthLevel}/5) paired with 100% closed rings. Textbook execution today. Zero excuses tolerated, none made."`;
    } else {
      confidanteQuote = `"Both Move and Stand rings 100% closed. Zero friction, zero negotiation with your baseline. Momentum locked in."`;
    }
    confidanteNextStep = '👉 Next Move: Bank the XP and recharge for tomorrow.';
  } else if (floorDefended) {
    confidanteStance = '🛡️ Floor Defended';
    if (currentHealthLevel && currentHealthLevel <= 2) {
      confidanteQuote = `"Low energy day (${currentHealthLevel}/5), but you defended your 50% floor instead of taking a zero. Defending the baseline when you don't feel like it is what creates real long-term identity."`;
    } else {
      confidanteQuote = `"You defended your baseline. If you still have fuel left, take 15–20 minutes to close to 100%. If not, streak is secured."`;
    }
    confidanteNextStep = (moveStage === 0.5 || standStage === 0.5) 
      ? '👉 Next Move: 15 more minutes pushes you to 100%, or rest knowing your streak is protected.' 
      : '👉 Next Move: Defend the remaining anchor or bank your protected day.';
  } else {
    confidanteStance = '⚠️ Baseline Breached';
    if (currentHealthLevel && currentHealthLevel <= 2) {
      confidanteQuote = `"You're feeling low energy (${currentHealthLevel}/5), but doing 0% is surrendering to total inertia. Don't do a full session—defend the 50% floor with a 15-minute walk right now."`;
    } else {
      confidanteQuote = `"Zero movement logged today. You are negotiating with friction. Put your phone down and move for 15 minutes before the day slips."`;
    }
    confidanteNextStep = '👉 Next Move: Put on shoes. 15-minute walk right now to defend the 50% floor.';
  }

  // Visual Breadcrumbs: Checkpoints Status Calculations
  const hasChoice = (dateChoices.good || 0) + (dateChoices.not || 0) > 0;
  const hasHealth = !!currentHealthLevel;
  const anchorsDone = (moveStage === 1 && standStage === 1);
  const anchorsFloor = (moveStage > 0 || standStage > 0);
  const hasJournal = !!(journalEntry && journalEntry.text && journalEntry.text.trim().length > 0);
  const totalDayGoals = dateDayGoals.length;
  const completedDayGoals = dateDayGoals.filter(g => g && g.completed).length;
  const hasGoals = totalDayGoals > 0;
  const goalsDone = hasGoals && (completedDayGoals === totalDayGoals);

  const totalRequired = hasGoals ? 5 : 4;
  let completedCheckpoints = 0;
  if (hasChoice) completedCheckpoints++;
  if (hasHealth) completedCheckpoints++;
  if (anchorsFloor) completedCheckpoints++;
  if (hasJournal) completedCheckpoints++;
  if (hasGoals && goalsDone) completedCheckpoints++;
  const allCheckpointsDone = (completedCheckpoints >= totalRequired);

  container.innerHTML = `
    ${!isToday ? `
      <!-- Past Date Navigation & Action Banner -->
      <div class="past-date-banner">
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

    <!-- Slim Section of Daily Reminder (Core Principles) -->
    <div class="daily-reminders-section">
      <div class="daily-reminders-grid">
        <div class="reminder-pill-card reminder-pill-simple" title="simplest thing that works. ship it.">
          <div class="reminder-word">simple</div>
        </div>
        <div class="reminder-pill-card reminder-pill-visible" title="can't see it at a glance? fix the display.">
          <div class="reminder-word">visible</div>
        </div>
        <div class="reminder-pill-card reminder-pill-next-step" title="know your next move, not the whole map.">
          <div class="reminder-word">next step</div>
        </div>
        <div class="reminder-pill-card reminder-pill-done" title="rough and shipped beats pretty and stuck.">
          <div class="reminder-word">done</div>
        </div>
      </div>
    </div>

    <!-- Visual Breadcrumbs: Today's Daily Checkpoints -->
    <div class="daily-breadcrumbs-bar">
      <div class="breadcrumbs-header">
        <div class="breadcrumbs-title-group">
          <span class="breadcrumbs-icon">🧭</span>
          <span class="breadcrumbs-title">Daily Checkpoints</span>
          <span class="breadcrumbs-sub">Tap to jump &amp; log</span>
        </div>
        <div class="breadcrumbs-progress-pill ${allCheckpointsDone ? 'all-done' : ''}">
          ${allCheckpointsDone ? '🎉 All Complete' : `⏳ ${completedCheckpoints}/${totalRequired} Complete`}
        </div>
      </div>

      <div class="breadcrumbs-trail">
        <!-- 1. Good Choice -->
        <button type="button" class="breadcrumb-chip ${hasChoice ? 'done' : 'pending'}" onclick="scrollToDailySection('section-good-choices')" title="Jump to Good Choices">
          <span class="chip-status-icon">${hasChoice ? '✓' : '○'}</span>
          <span class="chip-label">Choices</span>
        </button>

        <span class="breadcrumb-separator">›</span>

        <!-- 2. How Healthy Do I Feel -->
        <button type="button" class="breadcrumb-chip ${hasHealth ? 'done' : 'pending'}" onclick="scrollToDailySection('section-health-vitality')" title="Jump to Vitality Check">
          <span class="chip-status-icon">${hasHealth ? '✓' : '○'}</span>
          <span class="chip-label">Vitality</span>
        </button>

        <span class="breadcrumb-separator">›</span>

        <!-- 3. Daily Anchors -->
        <button type="button" class="breadcrumb-chip ${anchorsDone ? 'done' : (anchorsFloor ? 'floor' : 'pending')}" onclick="scrollToDailySection('section-momentum-anchors')" title="Jump to Daily Anchors">
          <span class="chip-status-icon">${anchorsDone ? '✓' : (anchorsFloor ? '🛡️' : '○')}</span>
          <span class="chip-label">Anchors</span>
        </button>

        <span class="breadcrumb-separator">›</span>

        <!-- 4. Sanctuary Journal -->
        <button type="button" class="breadcrumb-chip ${hasJournal ? 'done' : 'pending'}" onclick="scrollToDailySection('section-sanctuary-journal')" title="Jump to Sanctuary Journal">
          <span class="chip-status-icon">${hasJournal ? '✓' : '○'}</span>
          <span class="chip-label">Journal</span>
        </button>

        <span class="breadcrumb-separator">›</span>

        <!-- 5. Day Specific Goals -->
        <button type="button" class="breadcrumb-chip ${hasGoals ? (goalsDone ? 'done' : 'pending') : 'optional'}" onclick="scrollToDailySection('section-day-goals')" title="Jump to Day Goals">
          <span class="chip-status-icon">${hasGoals ? (goalsDone ? '✓' : '○') : '⚡'}</span>
          <span class="chip-label">Goals</span>
        </button>
      </div>
    </div>

    <!-- 1. Daily Sassy Self-Deprecating Affirmation Banner -->
    <div class="sassy-affirmation-card">
      <div class="affirmation-main-group">
        <div class="affirmation-emoji-box" id="daily-aff-emoji">
          ${dailyAff.emoji}
        </div>
        <div class="affirmation-content">
          <div class="affirmation-meta-row">
            <span class="affirmation-badge">Daily Truth Bomb</span>
            <span class="affirmation-hint">Rotates each midnight</span>
          </div>
          <p class="affirmation-quote" id="daily-aff-text">
            "${escapeHtml(dailyAff.text)}"
          </p>
        </div>
      </div>
      <button class="affirmation-shuffle-btn" onclick="shuffleDailyAffirmation()" title="Shuffle sassy affirmation">
        <span>🎲</span>
        <span class="shuffle-btn-text">Next</span>
      </button>
    </div>

    <!-- 2. Sassy Gamification Status & Rewards Shelf -->
    <div class="sassy-status-card">
      <div class="sassy-status-top">
        <div class="sassy-badge-pill">
          <span class="sassy-badge-icon">${statusInfo.currentTier.badge}</span>
          <div>
            <div class="sassy-rank-name">${statusInfo.currentTier.title}</div>
            <div class="sassy-flavor-text">"${statusInfo.currentTier.flavor}"</div>
          </div>
        </div>

        <div class="sassy-points-group">
          <button class="sassy-audit-btn" onclick="recalculatePointsAction()" title="Audit & recalculate XP from all completed history">
            ↺ Audit XP
          </button>
          <div class="sassy-points-badge" onclick="promptEditPoints()" title="Click to adjust your XP points directly">
            <span class="sassy-points-val">${currentPoints}</span>
            <span class="sassy-points-lbl">XP ✎</span>
          </div>
        </div>
      </div>

      <!-- Sassy Progress to Next Rank -->
      ${statusInfo.nextTier ? `
        <div class="sassy-progress-row">
          <div class="sassy-bar-wrap">
            <div class="sassy-bar-fill" style="width: ${statusInfo.progressPercent}%;"></div>
          </div>
          <span class="sassy-next-hint">${statusInfo.pointsToNext} pts to <strong>${statusInfo.nextTier.title}</strong> ${statusInfo.nextTier.badge}</span>
        </div>
      ` : `
        <div class="sassy-max-rank">★ Maximum Menace Level Achieved ★</div>
      `}

      <!-- Self-Reward Box -->
      <div class="sassy-reward-box">
        <div class="sassy-reward-left">
          <span class="sassy-gift-icon">🎁</span>
          <span class="sassy-reward-title">Unlocked:</span>
          <span class="sassy-reward-desc" title="${statusInfo.currentTier.reward}">${statusInfo.currentTier.reward}</span>
        </div>
        <button class="sassy-claim-btn" onclick="claimSassyReward('${statusInfo.currentTier.title.replace(/'/g, "\\'")}')">
          Treat Yourself
        </button>
      </div>
    </div>

    <!-- 2b. Simple Streak Tracker & 7-Day Interactive Consistency Strip -->
    <div class="simple-streak-tracker">
      <div class="streak-stat-group">
        <div class="streak-main-pill">
          <span class="streak-fire-icon">🔥</span>
          <span class="streak-num">${Math.max(moveStreak, standStreak, maxStreak)}d</span>
          <span class="streak-label">Anchor Streak</span>
        </div>

        <div class="streak-rate-col">
          <span class="streak-rate-val">${weeklyStats.overallCompletionRate}%</span>
          <span class="streak-rate-label">Week Consistency</span>
        </div>
      </div>

      <!-- 7-Day Interactive Mini Consistency Strip (Sun–Sat) & Catch-Up Button -->
      <div class="streak-tracker-right">
        <div class="week-mini-strip">
          ${weeklyStats.days.map(d => {
            const isAllDone = d.totalHabits > 0 && d.completedCount >= d.totalHabits;
            const isPartDone = d.completedCount > 0 && !isAllDone;
            const isSelected = (d.dateStr === activeTrackingDate);
            return `
              <button class="mini-day-dot ${d.isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" 
                      onclick="jumpToTrackingDate('${d.dateStr}')" 
                      title="${d.dayFullName} (${d.dateStr}): ${d.completedCount}/${d.totalHabits} habits done — Click to view & check off">
                <div class="mini-dot-circle ${isAllDone ? 'all-done' : (isPartDone ? 'part-done' : '')}">
                  ${isAllDone ? '✓' : (d.completedCount > 0 ? d.completedCount : '·')}
                </div>
                <span>${d.dayName}</span>
              </button>
            `;
          }).join('')}
        </div>
        <button class="catchup-trigger-btn" onclick="openPastDaysModal()" title="Quickly check off habits across past days">
          <i data-lucide="calendar-check-2" style="width: 13px; height: 13px;"></i>
          <span>Catch-Up</span>
        </button>
      </div>
    </div>

    <!-- Maintenance Mode Banner (Visible when active) -->
    ${isMaintenance ? `
      <div class="maintenance-mode-alert">
        <div class="maintenance-alert-left">
          <span class="maint-icon">🛡️</span>
          <div>
            <div class="maint-title">Maintenance Mode Active</div>
            <div class="maint-desc">Low-drive day? Perfect. Just protect your Move + Stand baseline. Zero guilt.</div>
          </div>
        </div>
        <button class="maint-resume-btn" onclick="setAppEnergyMode('power')">Switch to Power Mode ⚡</button>
      </div>
    ` : ''}

    <!-- 3. Conscious Check-in: Good Choices & How Healthy Do I Feel? (MOVED UP ABOVE PROGRESS) -->
    <div class="daily-widgets-grid">
      
      <!-- Good Choices (vs Not) Tracker Card -->
      <div class="cover-card" id="section-good-choices">
        <div class="card-title-row">
          <div>
            <h3>
              <i data-lucide="check-circle-2" style="color: var(--margo-m);"></i>
              Good Choices (vs Not)
            </h3>
            <span class="card-sub-muted">
              Week: <strong style="color:var(--primary);">+${weeklyChoices.totalGood}</strong> vs <strong style="color:#EF4444;">${weeklyChoices.totalNot}</strong> • Running: <strong style="color:var(--primary);">+${runningChoices.totalGood}</strong>
            </span>
          </div>
        </div>

        <div class="good-choices-card">
          <div class="choice-buttons-row">
            <div class="choice-action-btn btn-good" onclick="recordChoiceAction('good', 1, '${activeTrackingDate}')">
              <span class="choice-btn-title">+ Good Choice</span>
              <span class="choice-btn-count">${dateChoices.good || 0}</span>
            </div>
            <div class="choice-action-btn btn-not" onclick="recordChoiceAction('not', 1, '${activeTrackingDate}')">
              <span class="choice-btn-title">+ Not-so-good</span>
              <span class="choice-btn-count">${dateChoices.not || 0}</span>
            </div>
          </div>

          <div class="choice-controls-row">
            <span>
              ${totalChoices > 0 ? `<strong>${goodRatio}%</strong> today (${dateChoices.good} vs ${dateChoices.not})` : 'No choices logged today'}
            </span>
            <div class="choice-undo-group">
              ${(dateChoices.good > 0 || dateChoices.not > 0) ? `
                <button class="choice-undo-btn" style="color: var(--text-muted); font-weight: 500;" title="Reset choices to 0" onclick="resetChoicesAction('${activeTrackingDate}')">↺ 0</button>
              ` : ''}
              ${dateChoices.good > 0 ? `<button class="choice-undo-btn" title="Undo 1 good" onclick="recordChoiceAction('good', -1, '${activeTrackingDate}')">- Good</button>` : ''}
              ${dateChoices.not > 0 ? `<button class="choice-undo-btn" title="Undo 1 not" onclick="recordChoiceAction('not', -1, '${activeTrackingDate}')">- Not</button>` : ''}
            </div>
          </div>

          <div class="choice-ratio-bar">
            <div class="choice-bar-good" style="width: ${goodBarWidth}%;"></div>
            <div class="choice-bar-not" style="width: ${notBarWidth}%;"></div>
          </div>
        </div>
      </div>

      <!-- How Healthy Do I Feel? Widget -->
      <div class="cover-card" id="section-health-vitality">
        <div class="card-title-row">
          <div>
            <h3>
              <i data-lucide="heart-pulse" style="color: var(--danger);"></i>
              How Healthy Do I Feel?
            </h3>
            <span class="card-sub-muted">
              ${weeklyHealth.totalDays > 0 ? `Week Avg: <strong style="color:var(--primary);">${weeklyHealth.avgScore}/5</strong> (${weeklyHealth.totalDays}d) • Running: <strong style="color:var(--primary);">${runningHealth.avgScore || '—'}/5</strong>` : 'Tap to log daily vitality'}
            </span>
          </div>
        </div>

        <div class="health-choices-card">
          <div class="health-buttons-grid">
            ${[5, 4, 3, 2, 1].map(lvl => {
              const meta = (typeof HEALTH_LEVELS !== 'undefined') ? HEALTH_LEVELS[lvl] : { emoji: '✨', label: `Lvl ${lvl}`, desc: '', sassy: '' };
              const isSelected = (currentHealthLevel === lvl);
              return `
                <button type="button" 
                        class="health-btn ${isSelected ? 'active' : ''}" 
                        onclick="recordHealthLevelAction(${lvl}, '${activeTrackingDate}')"
                        title="${meta.label}: ${meta.desc}">
                  <span class="health-btn-emoji">${meta.emoji}</span>
                  <span class="health-btn-label">${meta.label}</span>
                </button>
              `;
            }).join('')}
          </div>

          ${currentHealthMeta ? `
            <div class="health-sassy-quote">
              <span class="quote-icon">${currentHealthMeta.emoji}</span>
              <div>
                <strong>${currentHealthMeta.label}:</strong> <em>"${currentHealthMeta.sassy}"</em>
              </div>
            </div>
          ` : `
            <div class="health-prompt-box">
              <span>Check in with your body today for <strong>+5 XP</strong>.</span>
            </div>
          `}
        </div>
      </div>

    </div>

    <!-- 4. Tactile Segmented Pill Track & Confidante Momentum Deck -->
    <div class="momentum-deck-card" id="section-momentum-anchors">
      <div class="momentum-deck-header">
        <div class="momentum-header-left">
          <span class="momentum-header-badge">Daily Anchors</span>
          <h3 class="momentum-title">Momentum Anchors</h3>
        </div>
        <div class="momentum-streak-pill">
          🔥 ${Math.max(moveStreak, standStreak, maxStreak)}d Momentum Streak
        </div>
      </div>

      <!-- Option C: Tactile Segmented Pill Track (Direction 2: Nordic Monochromatic Lavender) -->
      <div class="anchor-tracks-grid">
        
        <!-- Move Pill Track -->
        <div class="track-card">
          <div class="track-top">
            <div class="track-title-left">
              <span class="track-name">🏃 Move</span>
              <span class="track-streak-badge">🔥 ${moveStreak}d</span>
            </div>
            <span class="track-status-tag ${moveStage === 0.5 ? 'floor' : (moveStage === 1 ? 'closed' : '')}">
              ${moveStage === 0.5 ? '🛡️ Floor Defended (+5 XP)' : (moveStage === 1 ? '✓ Closed Today (+10 XP)' : 'Pending (0 XP)')}
            </span>
          </div>
          <div class="segmented-track">
            <button type="button" class="seg-step ${moveStage === 0 ? 'active' : ''}" onclick="setAnchorStageAction('${moveId}', 0, '${activeTrackingDate}')">Off</button>
            <button type="button" class="seg-step ${moveStage === 0.5 ? 'active floor-active' : ''}" onclick="setAnchorStageAction('${moveId}', 0.5, '${activeTrackingDate}')">50% Floor</button>
            <button type="button" class="seg-step ${moveStage === 1 ? 'active closed-active' : ''}" onclick="setAnchorStageAction('${moveId}', 1, '${activeTrackingDate}')">100% Closed</button>
          </div>
        </div>

        <!-- Stand Pill Track -->
        <div class="track-card">
          <div class="track-top">
            <div class="track-title-left">
              <span class="track-name">🧍 Stand</span>
              <span class="track-streak-badge">🔥 ${standStreak}d</span>
            </div>
            <span class="track-status-tag ${standStage === 0.5 ? 'floor' : (standStage === 1 ? 'closed' : '')}">
              ${standStage === 0.5 ? '🛡️ Floor Defended (+5 XP)' : (standStage === 1 ? '✓ Closed Today (+10 XP)' : 'Pending (0 XP)')}
            </span>
          </div>
          <div class="segmented-track">
            <button type="button" class="seg-step ${standStage === 0 ? 'active' : ''}" onclick="setAnchorStageAction('${standId}', 0, '${activeTrackingDate}')">Off</button>
            <button type="button" class="seg-step ${standStage === 0.5 ? 'active floor-active' : ''}" onclick="setAnchorStageAction('${standId}', 0.5, '${activeTrackingDate}')">50% Floor</button>
            <button type="button" class="seg-step ${standStage === 1 ? 'active closed-active' : ''}" onclick="setAnchorStageAction('${standId}', 1, '${activeTrackingDate}')">100% Closed</button>
          </div>
        </div>

      </div>

      <!-- The Confidante (Radical Candor Audit Card) -->
      <div class="confidante-card">
        <div class="conf-header">
          <div class="conf-title-group">
            <div class="conf-dot"></div>
            <span class="conf-title">The Confidante</span>
            <span class="conf-subtitle">· Radical Candor Audit</span>
          </div>
          <span class="conf-badge" id="conf-stance-tag">${confidanteStance}</span>
        </div>

        <div class="candor-body">
          <p class="candor-quote" id="conf-quote">
            ${confidanteQuote}
          </p>
          <p class="candor-next-step" id="conf-next-step">
            ${confidanteNextStep}
          </p>
        </div>

        <!-- Private Confidante Reality Check Input (Zero Clutter / Direct Accountability) -->
        <form class="conf-input-row" onsubmit="askConfidanteAction(event)">
          <input type="text" class="conf-input" id="conf-input" placeholder="Stuck or rationalizing? Tell the confidante...">
          <button class="conf-send-btn" type="submit">Reality Check</button>
        </form>
      </div>

      <!-- Additional Staged Habits (If user adds Skincare, Me time, etc.) -->
      ${additionalHabits.length > 0 ? `
        <div class="additional-habits-tray">
          <div class="tray-header">
            <span class="tray-label">Additional Staged Habits</span>
          </div>
          <div class="active-stack-list">
            ${additionalHabits.map(h => {
              const isDone = !!dayHabitsState[h.id];
              const streak = storage.data.habitStreaks[h.id] || 0;
              const isWeekly = (h.cadence === 'weekly');
              const weeklyCount = typeof dayHabitsState[h.id] === 'number' ? dayHabitsState[h.id] : (isDone ? 1 : 0);

              return `
                <div class="habit-card ${isDone ? 'completed' : ''}">
                  <div class="habit-main" onclick="${isWeekly ? '' : `toggleHabitInSheet('${h.id}')`}">
                    <div class="custom-checkbox ${isDone ? 'checked' : ''}">
                      ${isDone ? '✓' : ''}
                    </div>
                    <div class="habit-details">
                      <span class="habit-title">${escapeHtml(h.name)}</span>
                      <div class="habit-meta">
                        <span class="margo-tag margo-tag-${h.bucket.toLowerCase()}">${h.bucket}</span>
                        <span>• ${isWeekly ? `${h.target}x / week` : 'Daily'}</span>
                        ${h.description ? `<span style="color: var(--text-muted);">• ${escapeHtml(h.description)}</span>` : ''}
                      </div>
                    </div>
                  </div>

                  <div class="habit-actions">
                    ${isWeekly ? `
                      <div class="weekly-counter-pill">
                        <button class="counter-btn" onclick="updateWeeklyCounterInSheet('${h.id}', -1, event)">-</button>
                        <span style="font-size: 0.8rem; font-weight: 700;">${weeklyCount}/${h.target}</span>
                        <button class="counter-btn" onclick="updateWeeklyCounterInSheet('${h.id}', 1, event)">+</button>
                      </div>
                    ` : ''}
                    <div class="streak-badge">🔥 ${streak}d</div>
                    <button class="habit-more-btn" title="Edit Habit" onclick="showEditHabitModal('${h.id}', event)">
                      <i data-lucide="more-horizontal" style="width: 16px; height: 16px;"></i>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Quick Presets Shelf (Matching 12 Habit Stack Presets) -->
      <div class="quick-presets-container">
        <div class="quick-presets-header">
          <span class="quick-presets-sparkle">✨</span>
          <span class="quick-presets-title">Quick Presets</span>
          <span class="quick-presets-subtitle">Tap to add:</span>
        </div>
        <div class="quick-presets-pills">
          ${RECOMMENDED_HABIT_PRESETS.map((preset, pIdx) => {
            const pName = preset.name.toLowerCase().trim();
            const isAnchor = (pName === 'stand ring' || pName === 'stand' || pName === 'move');
            const isAlreadyAdded = isAnchor || habits.some(h => 
              h && h.name.toLowerCase().trim() === pName
            );
            if (isAlreadyAdded) {
              const tooltip = isAnchor 
                ? (pName === 'move' ? 'Move is your Hero Anchor #1' : 'Stand is your Hero Anchor #2') 
                : `${escapeHtml(preset.name)} is already in your active stack`;
              return `
                <span class="preset-pill-item added" title="${tooltip}">
                  <span class="preset-pill-symbol">✓</span>
                  <span class="preset-pill-label">${escapeHtml(preset.name)}</span>
                </span>
              `;
            } else {
              return `
                <button class="preset-pill-item" onclick="addHabitFromPreset(${pIdx})" title="Add ${escapeHtml(preset.name)}: ${escapeHtml(preset.description)}">
                  <span class="preset-pill-symbol plus">+</span>
                  <span class="preset-pill-label">${escapeHtml(preset.name)}</span>
                </button>
              `;
            }
          }).join('')}
        </div>
      </div>
    </div>

    <!-- 5. Day-Specific Bonus Goals Card (One-off daily targets) -->
    <div class="cover-card day-goals-card-wrapper" id="section-day-goals">
      <div class="card-title-row">
        <div>
          <h3>
            <i data-lucide="zap" style="color: var(--warning);"></i>
            Day-Specific Bonus Goals
          </h3>
          <span class="card-sub-muted">
            One-off targets for today only (no ongoing habit pressure)
          </span>
        </div>
      </div>

      <div class="day-goals-card">
        <div class="day-goals-list">
          ${dateDayGoals.map(g => `
            <div class="day-goal-item ${g.completed ? 'done' : ''}">
              <div class="day-goal-left" onclick="toggleDayGoalAction('${g.id}', '${activeTrackingDate}')">
                <div class="custom-checkbox ${g.completed ? 'checked' : ''}">
                  ${g.completed ? '✓' : ''}
                </div>
                <span class="day-goal-text">${escapeHtml(g.text)}</span>
              </div>
              <button class="day-goal-delete-btn" title="Delete goal" onclick="deleteDayGoalAction('${g.id}', '${activeTrackingDate}')">
                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
          `).join('')}

          ${dateDayGoals.length === 0 ? `
            <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 12px; font-size: 0.84rem; background: var(--bg-surface); border-radius: var(--radius-md);">
              No bonus goals logged today. Add any one-off moves below!
            </div>
          ` : ''}
        </div>

        <!-- Inline Add Form -->
        <form class="day-goal-form" onsubmit="submitAddDayGoalInline(event, '${activeTrackingDate}', 'sheet-day-goal-input')">
          <input type="text" class="day-goal-input" id="sheet-day-goal-input" placeholder="+ e.g. 12k steps today, no iced matcha after 2 PM..." required>
          <button type="submit" class="btn btn-primary btn-sm">+ Add</button>
        </form>
      </div>
    </div>

    <!-- 6. Quick Thoughts & Idea Inbox (To Triage Later) -->
    <div class="cover-card quick-thoughts-card">
      <div class="card-title-row">
        <div class="thoughts-title-group">
          <span class="thoughts-header-icon">💭</span>
          <div>
            <h3>Quick Thoughts &amp; Brain Dump</h3>
            <span class="card-sub-muted">Capture fleeting ideas, links &amp; reminders now. Triage whenever you have bandwidth.</span>
          </div>
        </div>
        <span class="thoughts-count-pill">${activeThoughts.length} untriaged</span>
      </div>

      <!-- Inline Fast Capture Form -->
      <form class="quick-thought-form" onsubmit="submitQuickThoughtInline(event)">
        <input type="text" id="quick-thought-input" class="quick-thought-input" placeholder="+ Jot down a thought, link, or random idea (Press Enter)..." autocomplete="off" required>
        <button type="submit" class="btn btn-primary btn-sm">Capture</button>
      </form>

      <!-- Active Untriaged Stream -->
      <div class="quick-thoughts-list">
        ${activeThoughts.length > 0 ? activeThoughts.map(t => `
          <div class="thought-item">
            <div class="thought-content">
              <span class="thought-bullet">●</span>
              <span class="thought-text">${escapeHtml(t.text)}</span>
              <span class="thought-time">${formatThoughtTime(t.createdAt)}</span>
            </div>
            <div class="thought-triage-actions">
              <button class="triage-action-btn btn-triage-done" onclick="toggleQuickThoughtTriageAction('${t.id}')" title="Mark Triaged (+5 XP)">
                ✓ Triage
              </button>
              <button class="triage-action-btn btn-triage-goal" onclick="convertThoughtToGoalAction('${t.id}', '${activeTrackingDate}')" title="Convert to today's Bonus Goal (+10 XP)">
                ⚡ Goal
              </button>
              <button class="triage-action-btn btn-triage-journal" onclick="convertThoughtToJournalAction('${t.id}', '${activeTrackingDate}')" title="Append to today's Sanctuary Journal (+10 XP)">
                ✍️ Journal
              </button>
              <button class="triage-action-btn btn-triage-delete" onclick="deleteQuickThoughtAction('${t.id}')" title="Delete thought">
                ✕
              </button>
            </div>
          </div>
        `).join('') : `
          <div class="thoughts-empty-state">
            <span>✨</span>
            <p>Your thought inbox is clean and clear. Jot down any random ideas above to store them safely!</p>
          </div>
        `}
      </div>

      <!-- Collapsible Triaged Drawer -->
      ${triagedThoughts.length > 0 ? `
        <div class="thoughts-archive-drawer">
          <button class="thoughts-toggle-archive-btn" type="button" onclick="toggleShowTriagedThoughts()">
            ${showTriagedThoughts ? 'Hide Triaged Thoughts ▴' : `View ${triagedThoughts.length} Triaged Thoughts ▾`}
          </button>
          ${showTriagedThoughts ? `
            <div class="triaged-thoughts-list">
              ${triagedThoughts.map(t => `
                <div class="thought-item triaged">
                  <div class="thought-content">
                    <span class="thought-bullet done">✓</span>
                    <span class="thought-text done">${escapeHtml(t.text)}</span>
                    <span class="thought-time">${formatThoughtTime(t.triagedAt || t.createdAt)}</span>
                  </div>
                  <div class="thought-triage-actions">
                    <button class="triage-action-btn btn-triage-undo" onclick="toggleQuickThoughtTriageAction('${t.id}')" title="Restore to active inbox">
                      ↺ Restore
                    </button>
                    <button class="triage-action-btn btn-triage-delete" onclick="deleteQuickThoughtAction('${t.id}')" title="Delete">
                      ✕
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      ` : ''}
    </div>

    <!-- 7. Unstructured Sanctuary Daily Journal & Brain Dump with Square Cards Archive -->
    <div class="cover-card sanctuary-journal-card" id="section-sanctuary-journal">
      <div class="journal-card-header">
        <div class="journal-header-left">
          <span class="journal-header-icon">✍️</span>
          <div>
            <h3>Daily Sanctuary Journal &amp; Brain Dump</h3>
            <span class="card-sub-muted">Unstructured raw thoughts, evening reflections &amp; memories</span>
          </div>
        </div>

        <div class="journal-view-toggle">
          <button class="journal-toggle-btn ${sanctuaryJournalTab === 'today' ? 'active' : ''}" onclick="setSanctuaryJournalTab('today')">
            Today's Entry
          </button>
          <button class="journal-toggle-btn ${sanctuaryJournalTab === 'archive' ? 'active' : ''}" onclick="setSanctuaryJournalTab('archive')">
            <span>📚 Past Archive</span>
            <span class="journal-count-pill">${allJournals.length}</span>
          </button>
        </div>
      </div>

      <!-- VIEW A: TODAY'S ENTRY -->
      ${sanctuaryJournalTab === 'today' ? `
        <div class="journal-today-pane">
          ${journalEntry && journalEntry.text && !sanctuaryJournalEditing ? `
            <!-- COMPLETED JOURNAL CARD (Editorial & Serene) -->
            <div class="journal-completed-card">
              <div class="journal-completed-meta">
                <span>Logged for <strong>${selectedDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong></span>
                <span class="journal-meta-right">
                  ${currentHealthMeta ? `${currentHealthMeta.emoji} ${currentHealthMeta.label} • ` : ''}
                  <span class="journal-word-pill">${journalEntry.wordCount || 0} words</span>
                </span>
              </div>

              <div class="journal-completed-text">${escapeHtml((journalEntry.text || '').trim())}</div>

              <div class="journal-completed-footer">
                <span class="journal-saved-hint">✓ Saved to your personal sanctuary vault</span>
                <button class="btn btn-secondary btn-xs" onclick="toggleSanctuaryJournalEdit()">
                  ✎ Edit / Append Entry
                </button>
              </div>
            </div>
          ` : `
            <!-- EDITING / ACTIVE TEXTAREA -->
            <div class="journal-edit-pane">
              <textarea 
                class="journal-textarea" 
                id="sanctuary-journal-input" 
                rows="4" 
                placeholder="What's taking up mental bandwidth today? Clear your head here with zero formatting pressure..."
                oninput="handleSanctuaryJournalInput('${activeTrackingDate}', this.value)"
              >${escapeHtml(journalEntry ? journalEntry.text : '')}</textarea>

              <div class="journal-edit-controls">
                <span class="journal-autosave-indicator" id="journal-autosave-status">
                  ${journalEntry ? '✓ Auto-saved' : 'Auto-saves continuously as you type'}
                </span>
                ${journalEntry && journalEntry.text ? `
                  <button class="btn btn-primary btn-xs" onclick="toggleSanctuaryJournalEdit()">
                    Done Editing
                  </button>
                ` : ''}
              </div>
            </div>
          `}
        </div>
      ` : `
        <!-- VIEW B: PAST ENTRIES ARCHIVE (SQUARE CARDS GRID) -->
        <div class="journal-archive-pane">
          <div class="archive-filter-row">
            <div class="archive-filter-pills">
              <button class="archive-filter-btn ${sanctuaryArchiveFilter === 'all' ? 'active' : ''}" onclick="setSanctuaryArchiveFilter('all')">All Entries</button>
              <button class="archive-filter-btn ${sanctuaryArchiveFilter === 'last_week' ? 'active' : ''}" onclick="setSanctuaryArchiveFilter('last_week')">Last Week</button>
              <button class="archive-filter-btn ${sanctuaryArchiveFilter === 'this_month' ? 'active' : ''}" onclick="setSanctuaryArchiveFilter('this_month')">This Month</button>
            </div>
            <span class="archive-count-label">${allJournals.length} reflections recorded</span>
          </div>

          <!-- SQUARE CARD GRID -->
          <div class="journal-square-grid">
            ${renderJournalSquareGrid(allJournals, sanctuaryArchiveFilter)}
          </div>
        </div>
      `}
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
  if (delta > 0) {
    if (type === 'good') {
      showToast(`+1 Good Choice! Ratio: ${Math.round((updated.good / (updated.good + updated.not)) * 100)}% (+5 XP)`);
    } else {
      showToast(`Logged choice. Focus on your next move!`);
    }
  } else if (delta < 0) {
    showToast(`Undo choice (${updated.good} good / ${updated.not} not)`);
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
   Quick Thoughts Action Handlers
   -------------------------------------------------------------------------- */
let showTriagedThoughts = false;

function toggleShowTriagedThoughts() {
  showTriagedThoughts = !showTriagedThoughts;
  renderDailySheet();
}

function formatThoughtTime(isoStr) {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function submitQuickThoughtInline(event) {
  event.preventDefault();
  const input = document.getElementById('quick-thought-input');
  if (!input || !input.value.trim()) return;

  const item = storage.addQuickThought(input.value.trim());
  input.value = '';
  renderDailySheet();
  showToast('💭 Thought captured! Triage whenever you have bandwidth.');
}

function toggleQuickThoughtTriageAction(id) {
  const isTriaged = storage.toggleTriageThought(id);
  renderDailySheet();
  if (isTriaged) {
    showToast('✓ Thought triaged (+5 XP)');
  } else {
    showToast('Restored thought to active inbox');
  }
}

function deleteQuickThoughtAction(id) {
  storage.deleteQuickThought(id);
  renderDailySheet();
}

function convertThoughtToGoalAction(id, dateStr) {
  storage.convertThoughtToGoal(id, dateStr);
  renderDailySheet();
  showToast('⚡ Converted into today\'s Bonus Goal (+10 XP)!');
}

function convertThoughtToJournalAction(id, dateStr) {
  storage.convertThoughtToJournal(id, dateStr);
  renderDailySheet();
  showToast('✍️ Appended to today\'s Sanctuary Journal (+10 XP)!');
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

/* --------------------------------------------------------------------------
   Tactile Segmented Pill Track & Radical Candor Confidante Actions
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

function askConfidanteAction(event) {
  if (event && event.preventDefault) event.preventDefault();
  const inputEl = document.getElementById('conf-input');
  if (!inputEl) return;
  const val = inputEl.value.trim();
  if (!val) return;

  const quoteEl = document.getElementById('conf-quote');
  const nextEl = document.getElementById('conf-next-step');
  const stanceEl = document.getElementById('conf-stance-tag');

  const lower = val.toLowerCase();
  let responseQuote = '';
  let responseNext = '';

  if (lower.includes('tired') || lower.includes('exhaust') || lower.includes('sleep') || lower.includes('drain') || lower.includes('sick')) {
    responseQuote = `"Fatigue is physiological, but inertia is mental. You don't need a grueling workout. Strip expectation to zero and defend the 50% floor with 10–15 gentle minutes. Then shut down completely."`;
    responseNext = '👉 Next Move: 10-minute floor walk right now, then bed.';
  } else if (lower.includes('tomorrow') || lower.includes('later') || lower.includes('tonight') || lower.includes('busy') || lower.includes('time')) {
    responseQuote = `"Tomorrow is where consistency goes to die. If you have 5 minutes to negotiate with yourself, you have 10 minutes to move. Take action immediately."`;
    responseNext = '👉 Next Move: Start a 10-minute timer and move. Zero negotiation.';
  } else if (lower.includes('eat') || lower.includes('food') || lower.includes('binge') || lower.includes('sugar') || lower.includes('snack') || lower.includes('diet')) {
    responseQuote = `"A sub-optimal choice is just one data point, not a ruined week. Don't spiral or rationalize a bad streak. Drink 16oz of water and make the very next choice a clean one."`;
    responseNext = '👉 Next Move: Drink a tall glass of water. Next choice is clean.';
  } else if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('anxi') || lower.includes('stuck') || lower.includes('freeze')) {
    responseQuote = `"Overthinking magnifies friction. Action cures anxiety. Disconnect your eyes from screens, stand up, and finish one physical micro-loop."`;
    responseNext = '👉 Next Move: Stand up, stretch, and walk for 5 minutes.';
  } else {
    responseQuote = `"${val}" is your brain rationalizing friction. Strip the task down to the 50% floor (10–15 minutes) and execute without negotiating.`;
    responseNext = '👉 Next Move: 10-minute action timer right now.';
  }

  if (quoteEl) quoteEl.textContent = responseQuote;
  if (nextEl) nextEl.textContent = responseNext;
  if (stanceEl) stanceEl.textContent = '🛡️ Reality Check';

  if (typeof storage.addQuickThought === 'function') {
    storage.addQuickThought(`Confidante Check: "${val}" -> ${responseQuote}`, 'confidante');
  }

  inputEl.value = '';
}
window.askConfidanteAction = askConfidanteAction;

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
