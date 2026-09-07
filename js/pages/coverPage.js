/* ==========================================================================
   Book of Life / Life OS - Single Daily Sheet Renderer (Option A)
   ========================================================================== */

let activeTrackingDate = formatDateIso(new Date());

function renderCoverPage() {
  renderDailySheet();
}

function renderDailySheet() {
  const container = document.getElementById('daily-sheet-container') || document.getElementById('page-cover');
  if (!container) return;

  const todayIso = formatDateIso(new Date());
  const selectedDateObj = parseDateIso(activeTrackingDate);
  const isToday = (activeTrackingDate === todayIso);

  // Update Header Date Label
  const headerDateLabel = document.getElementById('header-date-label');
  if (headerDateLabel) {
    if (isToday) {
      const formatted = selectedDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      headerDateLabel.textContent = `Today (${formatted})`;
      headerDateLabel.classList.remove('is-past-date');
    } else {
      const formatted = selectedDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      headerDateLabel.textContent = `📅 ${formatted}`;
      headerDateLabel.classList.add('is-past-date');
    }
  }

  // Active Habits & State for this date
  const habits = storage.getHabits();
  const dayHabitsState = storage.data.habitsState[activeTrackingDate] || {};

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
  let moveStreak = storage.data.habitStreaks['h-move'] || 0;
  habits.forEach(h => {
    const s = storage.data.habitStreaks[h.id] || 0;
    if (s > maxStreak) maxStreak = s;
  });

  // Day-Specific Goals for this date
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

  // Gamification: Sassy Status & Rewards
  const currentPoints = storage.getPoints();
  const statusInfo = getSassyStatus(currentPoints);
  const activeTerrorizing = storage.data.activeTerrorizing || [];

  container.innerHTML = `
    ${!isToday ? `
      <!-- Past Date Navigation & Action Banner -->
      <div class="past-date-banner">
        <div class="past-date-info">
          <span class="past-date-icon">🕒</span>
          <div>
            <div class="past-date-title">Viewing Past Date: <strong>${selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</strong></div>
            <div class="past-date-sub">Any habits, day goals, or good choices you check off below will be recorded for this day.</div>
          </div>
        </div>
        <div class="past-date-actions">
          <button class="btn btn-secondary btn-xs" onclick="navigateDate(-1)" title="Previous Day">← Previous Day</button>
          <button class="btn btn-primary btn-xs" onclick="resetToToday()">↩ Return to Today</button>
          <button class="btn btn-secondary btn-xs" onclick="navigateDate(1)" title="Next Day">Next Day →</button>
        </div>
      </div>
    ` : ''}

    <!-- 1. Daily Reminders Banner (Up Front) -->
    <div class="daily-reminders-card">
      <div class="reminders-header">
        <div class="reminders-badge">
          <i data-lucide="compass" style="width: 14px; height: 14px;"></i>
          <span>Core Principles • Daily Reminders</span>
        </div>
        <span class="reminders-sub">Simplicity First</span>
      </div>
      <div class="reminders-list">
        <div class="reminder-item highlight">
          <span class="reminder-icon">✦</span>
          <span class="reminder-text">Simple. Visible. Next step. Done.</span>
        </div>
        <div class="reminder-item">
          <span class="reminder-bullet">•</span>
          <span class="reminder-text">Build the simplest thing that works.</span>
        </div>
        <div class="reminder-item">
          <span class="reminder-bullet">•</span>
          <span class="reminder-text">If you can't see it at a glance, fix the display, not the data.</span>
        </div>
        <div class="reminder-item">
          <span class="reminder-bullet">•</span>
          <span class="reminder-text">Know your next move, not the whole roadmap.</span>
        </div>
        <div class="reminder-item">
          <span class="reminder-bullet">•</span>
          <span class="reminder-text">Rough and shipped beats polished and stalled.</span>
        </div>
      </div>
    </div>

    <!-- 2. Sassy Gamification Status & Rewards Widget -->
    <div class="sassy-status-card">
      <div class="sassy-status-top">
        <div class="sassy-badge-pill">
          <span class="sassy-badge-icon">${statusInfo.currentTier.badge}</span>
          <div>
            <div class="sassy-rank-name">${statusInfo.currentTier.title}</div>
            <div class="sassy-flavor-text">"${statusInfo.currentTier.flavor}"</div>
          </div>
        </div>

        <div class="sassy-points-badge">
          <span class="sassy-points-val">${currentPoints}</span>
          <span class="sassy-points-lbl">XP Points</span>
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
          <div>
            <div class="sassy-reward-title">Unlocked Status Reward</div>
            <div class="sassy-reward-desc">${statusInfo.currentTier.reward}</div>
          </div>
        </div>
        <button class="sassy-claim-btn" onclick="claimSassyReward('${statusInfo.currentTier.title.replace(/'/g, "\\'")}')">
          Treat Yourself
        </button>
      </div>
    </div>

    <!-- 3. Simple Streak Tracker -->
    <div class="simple-streak-tracker">
      <div class="streak-stat-group">
        <div class="streak-main-pill">
          <span class="streak-fire-icon">🔥</span>
          <div>
            <div class="streak-num">${moveStreak > 0 ? moveStreak : maxStreak} Days</div>
            <div class="streak-label">Anchor Streak</div>
          </div>
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
                      title="${d.dayFullName} (${d.dateStr}): ${d.completedCount}/${d.totalHabits} done — Click to view and check off">
                <div class="mini-dot-circle ${isAllDone ? 'all-done' : (isPartDone ? 'part-done' : '')}">
                  ${isAllDone ? '✓' : (d.completedCount > 0 ? d.completedCount : '·')}
                </div>
                <span>${d.dayName}</span>
              </button>
            `;
          }).join('')}
        </div>
        <button class="catchup-trigger-btn" onclick="openPastDaysModal()" title="Quickly check off habits across past days">
          <i data-lucide="calendar-check-2" style="width: 14px; height: 14px;"></i>
          <span>Catch-Up Past Days</span>
        </button>
      </div>
    </div>

    <!-- 3. Daily Habits Section (Anchored by Move) -->
    <div class="cover-card">
      <div class="card-title-row">
        <div>
          <h3>
            <i data-lucide="activity" style="color: var(--margo-m);"></i>
            Daily Habits
          </h3>
          <span style="font-size: 0.78rem; color: var(--text-muted);">
            Anchor: <strong>Move</strong> • ${completedTodayCount} of ${habits.length} completed
          </span>
        </div>
        <button class="btn btn-secondary btn-xs" onclick="showAddHabitModal()">
          <i data-lucide="plus"></i> Custom Habit
        </button>
      </div>

      <!-- Active Habits Checklist -->
      <div class="active-stack-list">
        ${habits.map((h, idx) => {
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
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="habit-title">${h.name}</span>
                    ${idx === 0 ? `<span class="anchor-badge" title="Physical Foundation">Anchor #1</span>` : ''}
                  </div>
                  <div class="habit-meta">
                    <span class="margo-tag margo-tag-${h.bucket.toLowerCase()}">${h.bucket}</span>
                    <span>• ${isWeekly ? `${h.target}x / week` : 'Daily'}</span>
                    ${h.description ? `<span style="color: var(--text-muted);">• ${h.description}</span>` : ''}
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
                <div class="streak-badge" title="${streak} consecutive days completed">
                  🔥 ${streak}d
                </div>
                <button class="habit-more-btn" title="Edit Habit" onclick="showEditHabitModal('${h.id}', event)">
                  <i data-lucide="more-horizontal" style="width: 16px; height: 16px;"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- 6 Habit Stack Options Shelf (Tap to add anytime) -->
      <div class="stack-shelf">
        <div class="stack-shelf-header">
          <div class="stack-shelf-title">
            <i data-lucide="sparkles" style="color: var(--margo-m); width: 15px; height: 15px;"></i>
            Habit Stack Options
          </div>
          <div class="stack-shelf-sub">Tap any option to add it to your daily habits anytime:</div>
        </div>

        <div class="stack-chips-grid">
          ${RECOMMENDED_HABIT_PRESETS.map((preset, pIdx) => {
            const alreadyAdded = habits.some(h => h.name.toLowerCase() === preset.name.toLowerCase());
            return `
              <button class="stack-chip-btn ${alreadyAdded ? 'stacked' : ''}" 
                      ${alreadyAdded ? 'disabled' : ''}
                      onclick="addHabitFromPreset(${pIdx})"
                      title="${preset.description}">
                <span>${preset.name}</span>
                <span class="stack-chip-plus">${alreadyAdded ? '✓' : '+'}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- 4. Good Choices & Day-Specific Goals Grid (Swapped Order) -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
      
      <!-- Good Choices (vs Not) Tracker Card (FIRST) -->
      <div class="cover-card">
        <div class="card-title-row">
          <div>
            <h3>
              <i data-lucide="check-circle-2" style="color: var(--margo-m);"></i>
              Good Choices (vs Not)
            </h3>
            <span style="font-size: 0.78rem; color: var(--text-muted);">
              Week: <strong style="color:var(--primary);">+${weeklyChoices.totalGood}</strong> vs <strong style="color:#EF4444;">${weeklyChoices.totalNot}</strong> • Running: <strong style="color:var(--primary);">+${runningChoices.totalGood}</strong> vs <strong style="color:#EF4444;">${runningChoices.totalNot}</strong>
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
              ${dateChoices.good > 0 ? `<button class="choice-undo-btn" title="Undo 1 good" onclick="recordChoiceAction('good', -1, '${activeTrackingDate}')">- Good</button>` : ''}
              ${dateChoices.not > 0 ? `<button class="choice-undo-btn" title="Undo 1 not" onclick="recordChoiceAction('not', -1, '${activeTrackingDate}')">- Not</button>` : ''}
            </div>
          </div>

          <div class="choice-ratio-bar">
            <div class="choice-bar-good" style="width: ${goodBarWidth}%;"></div>
            <div class="choice-bar-not" style="width: ${notBarWidth}%;"></div>
          </div>

          <!-- Weekly Count & Running Total Breakdown -->
          <div class="choices-summary-grid">
            <div class="choices-summary-box">
              <div class="summary-box-header">
                <span class="summary-box-title">This Week (Sun–Sat)</span>
                <span class="weekly-tally-pill">${weeklyChoices.total > 0 ? `${weeklyChoices.ratio}%` : '—'}</span>
              </div>
              <div class="summary-box-val">
                <strong class="good-text">+${weeklyChoices.totalGood} Good</strong>
                <span class="tally-vs">vs</span>
                <strong class="not-text">${weeklyChoices.totalNot} Not</strong>
              </div>
              <div class="summary-box-sub">
                ${weeklyChoices.total > 0 ? `${weeklyChoices.total} choices logged this week` : 'No choices logged this week'}
              </div>
            </div>

            <div class="choices-summary-box running">
              <div class="summary-box-header">
                <span class="summary-box-title">Running Total (All Time)</span>
                <span class="weekly-tally-pill" style="background:var(--bg-elevated);color:var(--text-primary);border-color:var(--border-light);">${runningChoices.total > 0 ? `${runningChoices.ratio}%` : '—'}</span>
              </div>
              <div class="summary-box-val">
                <strong class="good-text">+${runningChoices.totalGood} Good</strong>
                <span class="tally-vs">vs</span>
                <strong class="not-text">${runningChoices.totalNot} Not</strong>
              </div>
              <div class="summary-box-sub">
                ${runningChoices.total > 0 ? `${runningChoices.total} all-time • Net: ${runningChoices.net >= 0 ? '+' : ''}${runningChoices.net}` : 'No choices logged yet'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Day-Specific Goals Card (SECOND) -->
      <div class="cover-card">
        <div class="card-title-row">
          <div>
            <h3>
              <i data-lucide="zap" style="color: var(--warning);"></i>
              Day-Specific Goals
            </h3>
            <span style="font-size: 0.78rem; color: var(--text-muted);">
              One-off targets for today only (no ongoing habit pressure)
            </span>
          </div>
        </div>

        <div class="day-goals-card">
          <!-- Inline Add Form -->
          <form class="day-goal-form" onsubmit="submitAddDayGoalInline(event, '${activeTrackingDate}', 'sheet-day-goal-input')">
            <input type="text" class="day-goal-input" id="sheet-day-goal-input" placeholder="e.g. 12k steps today, call doctor..." required>
            <button type="submit" class="btn btn-primary btn-sm">+ Add</button>
          </form>

          <!-- Goals List -->
          <div class="day-goals-list">
            ${dateDayGoals.map(g => `
              <div class="day-goal-item ${g.completed ? 'done' : ''}">
                <div class="day-goal-left" onclick="toggleDayGoalAction('${g.id}', '${activeTrackingDate}')">
                  <div class="custom-checkbox ${g.completed ? 'checked' : ''}">
                    ${g.completed ? '✓' : ''}
                  </div>
                  <span class="day-goal-text">${g.text}</span>
                </div>
                <button class="day-goal-delete-btn" title="Delete goal" onclick="deleteDayGoalAction('${g.id}', '${activeTrackingDate}')">
                  <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                </button>
              </div>
            `).join('')}

            ${dateDayGoals.length === 0 ? `
              <div style="text-align: center; color: var(--text-muted); padding: 12px; font-size: 0.84rem; background: var(--bg-surface); border-radius: var(--radius-md);">
                No day-specific goals yet today.
              </div>
            ` : ''}
          </div>
        </div>
      </div>

    </div>

    <!-- 5. Currently Terrorizing (MARGO Active Projects) -->
    <div class="margo-pillars-shelf">
      <div class="currently-terrorizing-header">
        <div class="terrorizing-title-group">
          <span class="terrorizing-fire">⚡</span>
          <h2 class="terrorizing-title">Currently Terrorizing</h2>
          <span class="terrorizing-count-badge">${activeTerrorizing.length} Active</span>
        </div>
        <span class="terrorizing-subtitle">Click items to mark what projects you are actively conquering</span>
      </div>

      <div class="margo-pillars-grid">
        <!-- Move -->
        <div class="pillar-card">
          <div class="pillar-badge pillar-badge-m">M</div>
          <div class="pillar-title">Move</div>
          <div class="pillar-chips-wrap">
            ${['10k steps', 'Close rings', 'Calorie deficit', 'Workout'].map(item => `
              <span class="pillar-chip ${storage.isTerrorizing(item) ? 'active-terrorizing' : ''}" 
                    onclick="toggleTerrorizingProject('${item}', 'M')" 
                    title="Click to toggle project">
                ${storage.isTerrorizing(item) ? '⚡ ' : ''}${item}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Aesthetic -->
        <div class="pillar-card">
          <div class="pillar-badge pillar-badge-a">A</div>
          <div class="pillar-title">Aesthetic</div>
          <div class="pillar-chips-wrap">
            ${['Skincare', 'Signature outfits'].map(item => `
              <span class="pillar-chip ${storage.isTerrorizing(item) ? 'active-terrorizing' : ''}" 
                    onclick="toggleTerrorizingProject('${item}', 'A')" 
                    title="Click to toggle project">
                ${storage.isTerrorizing(item) ? '⚡ ' : ''}${item}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Reflect -->
        <div class="pillar-card">
          <div class="pillar-badge pillar-badge-r">R</div>
          <div class="pillar-title">Reflect</div>
          <div class="pillar-chips-wrap">
            ${['Meditate', 'Journal', 'Me time'].map(item => `
              <span class="pillar-chip ${storage.isTerrorizing(item) ? 'active-terrorizing' : ''}" 
                    onclick="toggleTerrorizingProject('${item}', 'R')" 
                    title="Click to toggle project">
                ${storage.isTerrorizing(item) ? '⚡ ' : ''}${item}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Grow -->
        <div class="pillar-card">
          <div class="pillar-badge pillar-badge-g">G</div>
          <div class="pillar-title">Grow</div>
          <div class="pillar-chips-wrap">
            ${['Hobbies', 'Learning'].map(item => `
              <span class="pillar-chip ${storage.isTerrorizing(item) ? 'active-terrorizing' : ''}" 
                    onclick="toggleTerrorizingProject('${item}', 'G')" 
                    title="Click to toggle project">
                ${storage.isTerrorizing(item) ? '⚡ ' : ''}${item}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Organize -->
        <div class="pillar-card">
          <div class="pillar-badge pillar-badge-o">O</div>
          <div class="pillar-title">Organize</div>
          <div class="pillar-chips-wrap">
            ${['Home projects', 'Finances', 'Travel', 'Everyday chores'].map(item => `
              <span class="pillar-chip ${storage.isTerrorizing(item) ? 'active-terrorizing' : ''}" 
                    onclick="toggleTerrorizingProject('${item}', 'O')" 
                    title="Click to toggle project">
                ${storage.isTerrorizing(item) ? '⚡ ' : ''}${item}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
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
 * Toggle Project in Currently Terrorizing Shelf
 */
function toggleTerrorizingProject(name, bucket) {
  const isNowActive = storage.toggleTerrorizing(name);
  if (isNowActive) {
    storage.addPoints(5);
    showToast(`⚡ Now Terrorizing: "${name}" (+5 XP)`);
  } else {
    showToast(`🕊️ Paused: "${name}"`);
  }
  renderDailySheet();
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
  const todayIso = formatDateIso(new Date());

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
                        <span class="modal-habit-name">${h.name}</span>
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
