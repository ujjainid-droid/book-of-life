/* ==========================================================================
   Book of Life / Life OS - Tasks & Horizon Page Renderer (Simplified)
   ========================================================================== */

function renderTasksPage() {
  const container = document.getElementById('page-tasks');
  if (!container) return;

  const tasks = storage.data.tasks || [];

  // Focus tasks (max 3)
  const focusTasks = tasks.filter(t => t.isFocus);

  // Group tasks by horizon
  const todayTasks = tasks.filter(t => t.dueDate === 'Today' || t.isFocus);
  const weekTasks = tasks.filter(t => (t.dueDate === 'This Week' || t.dueDate === 'Next Week' || t.dueDate === 'Tomorrow') && !t.isFocus && t.dueDate !== 'Today');
  const laterTasks = tasks.filter(t => t.dueDate === 'Later' && !t.isFocus);

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-text">
        <h2>Tasks & Horizon</h2>
        <p>Know your next move, not the whole roadmap. Focus on the high-impact 3.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary btn-sm" onclick="showAddTaskModal()">
          <i data-lucide="plus"></i> Add Task
        </button>
      </div>
    </div>

    <!-- Quick Inline Task Capture Form -->
    <form class="task-quick-add-form" onsubmit="submitQuickTask(event)">
      <input type="text" class="task-quick-input" id="quick-task-title" placeholder="What's your next move?" required>
      <select class="task-quick-select" id="quick-task-horizon">
        <option value="Today" selected>Today</option>
        <option value="This Week">This Week</option>
        <option value="Later">Later</option>
      </select>
      <select class="task-quick-select" id="quick-task-bucket">
        <option value="O" selected>O — Organize</option>
        <option value="M">M — Move</option>
        <option value="A">A — Aesthetic</option>
        <option value="R">R — Reflect</option>
        <option value="G">G — Grow</option>
      </select>
      <button type="submit" class="btn btn-primary btn-sm">+ Add</button>
    </form>

    <!-- Top 3 Primary Focus Slots (ADHD Anchor) -->
    <div class="focus-three-board">
      <div class="focus-three-header">
        <h3>
          <i data-lucide="target" style="color: var(--margo-o);"></i>
          Today's Rule of 3 (Primary Focus)
        </h3>
        <span style="font-size: 0.8rem; color: var(--text-muted);">
          Win the day with these 3
        </span>
      </div>

      <div class="focus-three-grid">
        ${[0, 1, 2].map(idx => {
          const task = focusTasks[idx];
          if (task) {
            return `
              <div class="focus-slot-card ${task.completed ? 'completed' : ''}" onclick="toggleTask('${task.id}')">
                <div>
                  <div class="focus-slot-badge">FOCUS 0${idx + 1}</div>
                  <div class="focus-title">${task.title}</div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                  <span class="margo-tag margo-tag-${task.bucket.toLowerCase()}">${task.bucket}</span>
                  <div class="custom-checkbox ${task.completed ? 'checked' : ''}">
                    ${task.completed ? '✓' : ''}
                  </div>
                </div>
              </div>
            `;
          } else {
            return `
              <div class="focus-slot-card empty" onclick="showAddTaskModal(true)">
                <i data-lucide="plus-circle" style="width: 20px; height: 20px; margin-bottom: 4px;"></i>
                <span>Assign Focus Slot 0${idx + 1}</span>
              </div>
            `;
          }
        }).join('')}
      </div>
    </div>

    <!-- Horizon Group 1: Today's Tasks -->
    <div class="horizon-section">
      <div class="horizon-section-header">
        <h4 class="horizon-section-title">
          <i data-lucide="sun" style="width: 16px; height: 16px; color: var(--margo-m);"></i>
          Today
        </h4>
        <span class="horizon-badge-count">${todayTasks.length}</span>
      </div>
      <div class="task-list">
        ${todayTasks.map(t => renderTaskRow(t)).join('')}
        ${todayTasks.length === 0 ? `
          <div style="color: var(--text-muted); font-size: 0.85rem; padding: 12px; background: var(--bg-surface); border-radius: var(--radius-md);">
            No tasks set for Today.
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Horizon Group 2: This Week / Upcoming -->
    <div class="horizon-section">
      <div class="horizon-section-header">
        <h4 class="horizon-section-title">
          <i data-lucide="calendar" style="width: 16px; height: 16px; color: var(--margo-o);"></i>
          This Week / Next Up
        </h4>
        <span class="horizon-badge-count">${weekTasks.length}</span>
      </div>
      <div class="task-list">
        ${weekTasks.map(t => renderTaskRow(t)).join('')}
        ${weekTasks.length === 0 ? `
          <div style="color: var(--text-muted); font-size: 0.85rem; padding: 12px; background: var(--bg-surface); border-radius: var(--radius-md);">
            No upcoming tasks scheduled for this week.
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Horizon Group 3: Later / Parking Lot -->
    <div class="horizon-section">
      <div class="horizon-section-header">
        <h4 class="horizon-section-title">
          <i data-lucide="clock" style="width: 16px; height: 16px; color: var(--text-muted);"></i>
          Later / Someday
        </h4>
        <span class="horizon-badge-count">${laterTasks.length}</span>
      </div>
      <div class="task-list">
        ${laterTasks.map(t => renderTaskRow(t)).join('')}
        ${laterTasks.length === 0 ? `
          <div style="color: var(--text-muted); font-size: 0.85rem; padding: 12px; background: var(--bg-surface); border-radius: var(--radius-md);">
            Nothing parked in Later.
          </div>
        ` : ''}
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function renderTaskRow(t) {
  return `
    <div class="task-row ${t.completed ? 'completed' : ''}">
      <div class="task-left" onclick="toggleTask('${t.id}')" style="cursor: pointer; flex: 1;">
        <div class="custom-checkbox ${t.completed ? 'checked' : ''}">
          ${t.completed ? '✓' : ''}
        </div>
        <div>
          <span class="task-text">${t.title}</span>
        </div>
      </div>

      <div class="task-right">
        <span class="margo-tag margo-tag-${t.bucket.toLowerCase()}">${t.bucket}</span>
        <span class="task-due">${t.dueDate}</span>
        <button class="task-star-btn ${t.isFocus ? 'starred' : ''}" title="${t.isFocus ? 'Remove from Top 3' : 'Pin to Top 3 Focus'}" onclick="toggleFocusTask('${t.id}')">
          <i data-lucide="star" style="width: 16px; height: 16px;"></i>
        </button>
        <button class="table-action-btn" title="Delete Task" onclick="deleteTask('${t.id}')">
          <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
        </button>
      </div>
    </div>
  `;
}

function submitQuickTask(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('quick-task-title');
  if (!input) return;
  const title = input.value.trim();
  if (!title) return;

  const dueDate = document.getElementById('quick-task-horizon').value || 'Today';
  const bucket = document.getElementById('quick-task-bucket').value || 'O';

  const newTask = {
    id: `t-${Date.now()}`,
    title,
    bucket,
    projectId: null,
    dueDate,
    isFocus: false,
    completed: false
  };

  storage.data.tasks.unshift(newTask);
  storage.saveData();
  input.value = '';
  showToast('Task added.');
  renderTasksPage();
  if (activePage === 'cover') renderCoverPage();
}

function toggleTask(taskId) {
  const task = storage.data.tasks.find(t => t.id === taskId);
  if (!task) return;
  task.completed = !task.completed;
  storage.saveData();
  renderTasksPage();
  if (activePage === 'cover') renderCoverPage();
}

function toggleFocusTask(taskId) {
  const task = storage.data.tasks.find(t => t.id === taskId);
  if (!task) return;
  
  const currentFocusCount = storage.data.tasks.filter(t => t.isFocus).length;
  if (!task.isFocus && currentFocusCount >= 3) {
    showToast('You already have 3 primary focus tasks set. Keep the priority tight!');
    return;
  }

  task.isFocus = !task.isFocus;
  storage.saveData();
  renderTasksPage();
  if (activePage === 'cover') renderCoverPage();
}

function deleteTask(taskId) {
  storage.data.tasks = storage.data.tasks.filter(t => t.id !== taskId);
  storage.saveData();
  renderTasksPage();
  if (activePage === 'cover') renderCoverPage();
  showToast('Task removed.');
}
