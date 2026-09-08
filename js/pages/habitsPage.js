/* ==========================================================================
   Book of Life / Life OS - Habits & Daily Tracker Page Renderer
   ========================================================================== */

let selectedTrackingDate = formatDateIso(new Date());

function renderHabitsPage() {
  const container = document.getElementById('page-habits');
  if (!container) return;

  const todayIso = formatDateIso(new Date());
  const selectedDateObj = parseDateIso(selectedTrackingDate);
  const sundayOfSelectedWeek = getSundayOfWeek(selectedDateObj);
  const weekDates = getWeekDates(sundayOfSelectedWeek);

  const habits = storage.getHabits();
  const dayHabitsState = storage.data.habitsState[selectedTrackingDate] || {};

  // Compute selected day completion rate
  let completedTodayCount = 0;
  habits.forEach(h => {
    if (h.cadence === 'daily') {
      if (dayHabitsState[h.id]) completedTodayCount++;
    } else {
      if (Number(dayHabitsState[h.id] || 0) > 0 || dayHabitsState[h.id]) completedTodayCount++;
    }
  });
  const totalHabits = habits.length;
  const dayPercent = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;

  // Calculate Weekly Stats for Sunday-start week
  const weeklyStats = calculateWeeklyStats(sundayOfSelectedWeek, habits, storage.data.habitsState);

  // Top streak and current streak
  let maxStreak = 0;
  let moveStreak = storage.data.habitStreaks['h-move'] || 0;
  habits.forEach(h => {
    const s = storage.data.habitStreaks[h.id] || 0;
    if (s > maxStreak) maxStreak = s;
  });

  // Day-Specific Goals for Selected Date
  const dateDayGoals = storage.getDayGoals(selectedTrackingDate);

  // Good Choices for Selected Date
  const dateChoices = storage.getChoices(selectedTrackingDate);
  const totalChoices = (dateChoices.good || 0) + (dateChoices.not || 0);
  const goodRatio = totalChoices > 0 ? Math.round((dateChoices.good / totalChoices) * 100) : 100;
  const goodBarWidth = totalChoices > 0 ? Math.round((dateChoices.good / totalChoices) * 100) : 100;
  const notBarWidth = totalChoices > 0 ? 100 - goodBarWidth : 0;

  container.innerHTML = `
    <!-- Header -->
    <div class="page-header">
      <div class="page-header-text">
        <h2>Habits & Daily</h2>
        <p>Simple execution starting with <strong>Move</strong>. Low friction, zero guilt momentum.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary btn-sm" onclick="showAddHabitModal()">
          <i data-lucide="plus"></i> Add Habit
        </button>
      </div>
    </div>

    <!-- Integrated Simple Streak Tracker (Replaces Weekly Results Hub) -->
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
          <span class="streak-rate-label">Week Consistency (${weeklyStats.perfectDaysCount} perfect days)</span>
        </div>
      </div>

      <!-- 7-Day Mini Consistency Strip (Sun–Sat) -->
      <div class="week-mini-strip">
        ${weeklyStats.days.map(d => {
          const isAllDone = d.totalHabits > 0 && d.completedCount >= d.totalHabits;
          const isPartDone = d.completedCount > 0 && !isAllDone;
          return `
            <div class="mini-day-dot ${d.isToday ? 'is-today' : ''}" title="${d.dayFullName} (${d.dateStr}): ${d.completedCount}/${d.totalHabits} done">
              <div class="mini-dot-circle ${isAllDone ? 'all-done' : (isPartDone ? 'part-done' : '')}">
                ${isAllDone ? '✓' : (d.completedCount > 0 ? d.completedCount : '')}
              </div>
              <span>${d.dayName}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Sunday-to-Saturday Interactive Week Strip -->
    <div class="week-strip-card">
      <div class="week-strip-header">
        <div class="week-strip-title">
          <i data-lucide="calendar" style="color: var(--margo-m);"></i>
          <span>Week of ${formatWeekRange(sundayOfSelectedWeek)} <small style="color: var(--text-muted); font-size: 0.78rem;">(Sunday–Saturday)</small></span>
        </div>
        <div class="week-strip-actions">
          <button class="btn btn-secondary btn-xs" onclick="navigateTrackingWeek(-7)">← Prev Week</button>
          <button class="btn ${selectedTrackingDate === todayIso ? 'btn-primary' : 'btn-secondary'} btn-xs" onclick="selectTrackingDate('${todayIso}')">Today</button>
          <button class="btn btn-secondary btn-xs" onclick="navigateTrackingWeek(7)">Next Week →</button>
        </div>
      </div>

      <div class="week-strip-days">
        ${weekDates.map(dObj => {
          const dStr = formatDateIso(dObj);
          const dayIndex = dObj.getDay();
          const dState = storage.data.habitsState[dStr] || {};
          const doneCount = habits.filter(h => !!dState[h.id]).length;
          const isAllDone = habits.length > 0 && doneCount >= habits.length;
          const isSelected = (dStr === selectedTrackingDate);
          const isToday = (dStr === todayIso);

          return `
            <div class="strip-day-btn ${isSelected ? 'active' : ''} ${isToday ? 'is-today' : ''} ${isAllDone ? 'all-done' : (doneCount > 0 ? 'part-done' : '')}"
                 onclick="selectTrackingDate('${dStr}')">
              <span class="strip-day-name">${DAY_NAMES_SUNDAY_START[dayIndex]}</span>
              <span class="strip-day-num">${dObj.getDate()}</span>
              <span class="strip-day-status">
                ${isAllDone ? '✓' : (doneCount > 0 ? `${doneCount}/${habits.length}` : '—')}
              </span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="habits-grid">
      
      <!-- Left Column: Active Habits Checklist -->
      <div>
        <div class="stack-section-title">
          <div>
            <h3>
              ${selectedTrackingDate === todayIso ? "Today's Active Habits" : `Habits for ${selectedDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`}
            </h3>
            <span style="font-size: 0.8rem; color: var(--text-muted);">
              ${completedTodayCount} of ${totalHabits} completed (${dayPercent}%)
            </span>
          </div>
          <button class="btn btn-secondary btn-xs" onclick="showAddHabitModal()">
            <i data-lucide="plus"></i> Add Habit
          </button>
        </div>

        <div class="active-stack-list">
          ${habits.map((h, idx) => {
            const isDone = !!dayHabitsState[h.id];
            const streak = storage.data.habitStreaks[h.id] || 0;
            const isWeekly = (h.cadence === 'weekly');
            const weeklyCount = typeof dayHabitsState[h.id] === 'number' ? dayHabitsState[h.id] : (isDone ? 1 : 0);
            const b = MARGO_BUCKETS[h.bucket] || MARGO_BUCKETS.M;

            return `
              <div class="habit-card ${isDone ? 'completed' : ''}">
                <div class="habit-main" onclick="${isWeekly ? '' : `toggleHabitDaily('${h.id}', event)`}">
                  <div class="custom-checkbox ${isDone ? 'checked' : ''}" onclick="toggleHabitDaily('${h.id}', event)">
                    ${isDone ? '✓' : ''}
                  </div>
                  <div class="habit-details">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span class="habit-title">${h.name}</span>
                      ${idx === 0 ? `<span class="anchor-badge" title="Primary Anchor Habit">Anchor #1</span>` : ''}
                    </div>
                    <div class="habit-meta">
                      <span class="margo-tag margo-tag-${h.bucket.toLowerCase()}">${h.bucket} — ${b.name}</span>
                      <span>• ${isWeekly ? `${h.target}x / week` : 'Daily'}</span>
                      ${h.description ? `<span style="color: var(--text-muted);">• ${h.description}</span>` : ''}
                    </div>
                  </div>
                </div>

                <div class="habit-actions">
                  ${isWeekly ? `
                    <div class="weekly-counter-pill">
                      <button class="counter-btn" onclick="updateWeeklyCounterDaily('${h.id}', -1, event)">-</button>
                      <span style="font-size: 0.8rem; font-weight: 700;">${weeklyCount}/${h.target}</span>
                      <button class="counter-btn" onclick="updateWeeklyCounterDaily('${h.id}', 1, event)">+</button>
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

          ${habits.length === 0 ? `
            <div style="text-align: center; padding: 36px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-light);">
              <p style="color: var(--text-secondary); margin-bottom: 12px;">No active habits yet. Start with Move!</p>
              <button class="btn btn-primary btn-sm" onclick="showAddHabitModal()">+ Add Move Habit</button>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Right Column: Day-Specific Goals & Good Choices Tracker -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Day-Specific Goals Card -->
        <div class="cover-card">
          <div class="card-title-row">
            <div>
              <h3>
                <i data-lucide="zap" style="color: var(--warning);"></i>
                Day-Specific Goals
              </h3>
              <span style="font-size: 0.78rem; color: var(--text-muted);">
                ${selectedTrackingDate === todayIso ? "Today's one-off targets" : `Targets for ${selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              </span>
            </div>
          </div>

          <div class="day-goals-card">
            <!-- Goals List -->
            <div class="day-goals-list">
              ${dateDayGoals.map(g => `
                <div class="day-goal-item ${g.completed ? 'done' : ''}">
                  <div class="day-goal-left" onclick="toggleDayGoalAction('${g.id}', '${selectedTrackingDate}')">
                    <div class="custom-checkbox ${g.completed ? 'checked' : ''}">
                      ${g.completed ? '✓' : ''}
                    </div>
                    <span class="day-goal-text">${g.text}</span>
                  </div>
                  <button class="day-goal-delete-btn" title="Delete goal" onclick="deleteDayGoalAction('${g.id}', '${selectedTrackingDate}')">
                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                  </button>
                </div>
              `).join('')}

              ${dateDayGoals.length === 0 ? `
                <div style="text-align: center; color: var(--text-muted); padding: 14px; font-size: 0.85rem; background: var(--bg-surface); border-radius: var(--radius-md);">
                  No day-specific goals for this day.
                </div>
              ` : ''}
            </div>

            <!-- Inline Add Form (Below List) -->
            <form class="day-goal-form" onsubmit="submitAddDayGoalInline(event, '${selectedTrackingDate}', 'habits-day-goal-input')">
              <input type="text" class="day-goal-input" id="habits-day-goal-input" placeholder="e.g. 12k steps today..." required>
              <button type="submit" class="btn btn-primary btn-sm">+ Add</button>
            </form>
          </div>
        </div>

        <!-- Good Choices (vs Not) Tracker Card -->
        <div class="cover-card">
          <div class="card-title-row">
            <div>
              <h3>
                <i data-lucide="check-circle-2" style="color: var(--margo-m);"></i>
                Good Choices (vs Not)
              </h3>
              <span style="font-size: 0.78rem; color: var(--text-muted);">
                ${selectedTrackingDate === todayIso ? "Today's conscious choices" : `Choices for ${selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              </span>
            </div>
          </div>

          <div class="good-choices-card">
            <div class="choice-buttons-row">
              <div class="choice-action-btn btn-good" onclick="recordChoiceAction('good', 1, '${selectedTrackingDate}')">
                <span class="choice-btn-title">+ Good Choice</span>
                <span class="choice-btn-count">${dateChoices.good || 0}</span>
              </div>
              <div class="choice-action-btn btn-not" onclick="recordChoiceAction('not', 1, '${selectedTrackingDate}')">
                <span class="choice-btn-title">+ Not-so-good</span>
                <span class="choice-btn-count">${dateChoices.not || 0}</span>
              </div>
            </div>

            <!-- Ratio bar & undo -->
            <div class="choice-controls-row">
              <span>
                ${totalChoices > 0 ? `<strong>${goodRatio}%</strong> good choices (${dateChoices.good} vs ${dateChoices.not})` : 'No choices logged yet'}
              </span>
              <div class="choice-undo-group">
                ${dateChoices.good > 0 ? `<button class="choice-undo-btn" title="Undo 1 good choice" onclick="recordChoiceAction('good', -1, '${selectedTrackingDate}')">- Good</button>` : ''}
                ${dateChoices.not > 0 ? `<button class="choice-undo-btn" title="Undo 1 not choice" onclick="recordChoiceAction('not', -1, '${selectedTrackingDate}')">- Not</button>` : ''}
              </div>
            </div>

            <div class="choice-ratio-bar">
              <div class="choice-bar-good" style="width: ${goodBarWidth}%;"></div>
              <div class="choice-bar-not" style="width: ${notBarWidth}%;"></div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- Recommended Habits Preset Shelf -->
    <div class="presets-section">
      <div class="presets-header">
        <div>
          <h3>
            <i data-lucide="sparkles" style="color: var(--margo-g);"></i>
            Recommended Habit Stacks
          </h3>
          <p>1-Click add to your active stack whenever you are ready to expand.</p>
        </div>
      </div>

      <div class="presets-grid">
        ${RECOMMENDED_HABIT_PRESETS.map((preset, pIdx) => {
          const alreadyAdded = habits.some(h => h.name.toLowerCase() === preset.name.toLowerCase());
          return `
            <div class="preset-card ${alreadyAdded ? 'added' : ''}">
              <div class="preset-top">
                <span class="margo-tag margo-tag-${preset.bucket.toLowerCase()}">${preset.bucket}</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${preset.cadence === 'weekly' ? `${preset.target}x/wk` : 'Daily'}</span>
              </div>
              <div class="preset-title">${preset.name}</div>
              <div class="preset-desc">${preset.description}</div>
              <button class="preset-add-btn ${alreadyAdded ? 'disabled' : ''}" 
                      ${alreadyAdded ? 'disabled' : ''}
                      onclick="addPresetHabit(${pIdx})">
                ${alreadyAdded ? '✓ Stacked' : '+ Add Habit'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

/**
 * Interactive Date Switcher
 */
function selectTrackingDate(dateStr) {
  selectedTrackingDate = dateStr;
  renderHabitsPage();
}

function navigateTrackingWeek(offsetDays) {
  const current = parseDateIso(selectedTrackingDate);
  current.setDate(current.getDate() + offsetDays);
  selectedTrackingDate = formatDateIso(current);
  renderHabitsPage();
}

/**
 * Toggle Habit for Selected Date
 */
function toggleHabitDaily(habitId, event) {
  if (event) event.stopPropagation();

  const nextVal = storage.toggleHabit(habitId, selectedTrackingDate);
  renderHabitsPage();
  if (activePage === 'cover') renderCoverPage();

  // Check if all habits done for today -> Confetti!
  const habits = storage.getHabits();
  const dayState = storage.data.habitsState[selectedTrackingDate] || {};
  const allDone = habits.length > 0 && habits.every(h => !!dayState[h.id]);

  if (allDone && nextVal) {
    triggerConfetti();
    showToast('🎉 All habits completed! Momentum locked in.');
  }
}

function updateWeeklyCounterDaily(habitId, delta, event) {
  if (event) event.stopPropagation();

  const dayState = storage.data.habitsState[selectedTrackingDate] || {};
  const currentVal = Number(dayState[habitId] || 0);
  const habit = storage.getHabit(habitId);
  const maxTarget = habit ? habit.target : 3;

  const newVal = Math.max(0, Math.min(maxTarget, currentVal + delta));
  storage.setWeeklyHabitCount(habitId, selectedTrackingDate, newVal >= maxTarget ? true : newVal);

  renderHabitsPage();
  if (activePage === 'cover') renderCoverPage();
}

/**
 * Add Habit from Presets Shelf
 */
function addPresetHabit(presetIndex) {
  const preset = RECOMMENDED_HABIT_PRESETS[presetIndex];
  if (!preset) return;

  storage.addHabit(preset);
  showToast(`Added "${preset.name}" to your habit tracker!`);
  renderHabitsPage();
  if (activePage === 'cover') renderCoverPage();
}

