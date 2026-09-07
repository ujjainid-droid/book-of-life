/* ==========================================================================
   Book of Life / Life OS — Single Daily Sheet App Controller
   ========================================================================== */

let editingHabitId = null;
let currentView = 'daily'; // 'daily' | 'claims'

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme
  const savedTheme = storage.data.theme;
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  updateThemeIcon();

  // Restore saved view (or URL hash)
  const hashView = window.location.hash.replace('#', '');
  const savedView = (hashView === 'claims' || hashView === 'daily') 
    ? hashView 
    : (localStorage.getItem('BOL_ACTIVE_VIEW') || 'daily');

  switchAppView(savedView);

  // Refresh header badges
  refreshAppBadges();

  // Keyboard: Escape closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
});

/* --------------------------------------------------------------------------
   View Switching (Daily Sheet vs Medical Claims)
   -------------------------------------------------------------------------- */
function switchAppView(viewName) {
  currentView = (viewName === 'claims') ? 'claims' : 'daily';
  try {
    localStorage.setItem('BOL_ACTIVE_VIEW', currentView);
  } catch (e) {}

  const navDaily = document.getElementById('nav-btn-daily');
  const navClaims = document.getElementById('nav-btn-claims');
  const dateNavContainer = document.getElementById('header-date-nav-container');

  if (currentView === 'claims') {
    if (navDaily) navDaily.classList.remove('active');
    if (navClaims) navClaims.classList.add('active');
    if (dateNavContainer) dateNavContainer.style.display = 'none';
    if (typeof renderClaimsPage === 'function') renderClaimsPage();
  } else {
    if (navClaims) navClaims.classList.remove('active');
    if (navDaily) navDaily.classList.add('active');
    if (dateNavContainer) dateNavContainer.style.display = 'inline-flex';
    if (typeof renderDailySheet === 'function') renderDailySheet();
  }

  refreshAppBadges();
}

function renderCurrentView() {
  if (currentView === 'claims') {
    if (typeof renderClaimsPage === 'function') renderClaimsPage();
  } else {
    if (typeof renderDailySheet === 'function') renderDailySheet();
  }
}

function refreshAppBadges() {
  if (typeof storage !== 'undefined' && typeof storage.getClaimsStats === 'function') {
    const stats = storage.getClaimsStats();
    if (typeof updateClaimsHeaderBadge === 'function') {
      updateClaimsHeaderBadge(stats.actionNeededCount);
    }
  }
}

/* --------------------------------------------------------------------------
   Theme
   -------------------------------------------------------------------------- */
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  setTheme(isDark ? 'light' : 'dark');
}

function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  storage.data.theme = theme;
  storage.saveData();
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.getElementById('header-theme-icon');
  if (!icon) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  if (window.lucide) lucide.createIcons();
}

/* --------------------------------------------------------------------------
   Date Navigation
   -------------------------------------------------------------------------- */
function navigateDate(delta) {
  const d = parseDateIso(activeTrackingDate);
  d.setDate(d.getDate() + delta);
  activeTrackingDate = formatDateIso(d);
  renderDailySheet();
}

function resetToToday() {
  activeTrackingDate = formatDateIso(new Date());
  renderDailySheet();
}

/* --------------------------------------------------------------------------
   Settings Modal (rendered inline)
   -------------------------------------------------------------------------- */
function openSettingsModal() {
  const body = document.getElementById('settings-modal-body');
  if (!body) return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  body.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:20px;">

      <!-- Appearance -->
      <div class="settings-card">
        <div class="settings-card-header">
          <i data-lucide="palette" style="color:var(--margo-a);width:18px;height:18px;"></i>
          <h3>Appearance</h3>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn ${!isDark ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="setTheme('light');renderSettingsModalBody()">
            <i data-lucide="sun" style="width:14px;height:14px;"></i> Light
          </button>
          <button class="btn ${isDark ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="setTheme('dark');renderSettingsModalBody()">
            <i data-lucide="moon" style="width:14px;height:14px;"></i> Dark
          </button>
        </div>
      </div>

      <!-- Motto -->
      <div class="settings-card">
        <div class="settings-card-header">
          <i data-lucide="type" style="color:var(--margo-r);width:18px;height:18px;"></i>
          <h3>Personal Motto</h3>
        </div>
        <input type="text" class="form-input" value="${storage.data.motto || ''}"
          placeholder="Your personal executive statement..."
          onchange="updateMotto(this.value)">
      </div>

      <!-- Instant Cloud Sync (Firebase Realtime) -->
      <div class="settings-card">
        <div class="settings-card-header">
          <div style="display:flex;align-items:center;gap:8px;">
            <i data-lucide="cloud-lightning" style="color:var(--primary);width:18px;height:18px;"></i>
            <h3>Instant Cloud Sync</h3>
          </div>
          <span id="sync-status-indicator" class="sync-status-badge ${typeof syncManager !== 'undefined' && syncManager.isConnected ? 'connected' : (typeof syncManager !== 'undefined' && syncManager.isConfigured() ? 'connecting' : 'offline')}">
            <span class="status-dot ${typeof syncManager !== 'undefined' && syncManager.isConnected ? 'green' : (typeof syncManager !== 'undefined' && syncManager.isConfigured() ? 'yellow' : 'grey')}"></span>
            ${typeof syncManager !== 'undefined' && syncManager.isConnected ? 'Live Sync Active' : (typeof syncManager !== 'undefined' && syncManager.isConfigured() ? 'Connecting...' : 'Offline (Local Only)')}
          </span>
        </div>
        <p class="settings-desc">
          Instant 2-way real-time sync between your Mac and iPhone using your free Firebase Realtime Database. Changes appear in milliseconds.
        </p>

        <div style="display:flex;flex-direction:column;gap:12px;margin-top:12px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:0.75rem;">Firebase Database URL</label>
            <input type="url" class="form-input" id="sync-db-url-input" 
              placeholder="https://your-project-default-rtdb.firebaseio.com" 
              value="${typeof syncManager !== 'undefined' ? (syncManager.dbUrl || '') : ''}">
          </div>

          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:0.75rem;">Sync Passphrase (Secret Key)</label>
            <input type="text" class="form-input" id="sync-passphrase-input" 
              placeholder="e.g. ujj-book-of-life-2026" 
              value="${typeof syncManager !== 'undefined' ? (syncManager.passphrase || '') : ''}">
          </div>

          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:4px;">
            <button class="btn btn-primary btn-sm" onclick="saveSyncSettings()">
              <i data-lucide="check" style="width:14px;height:14px;"></i> Save &amp; Connect
            </button>
            ${typeof syncManager !== 'undefined' && syncManager.isConfigured() ? `
              <button class="btn btn-secondary btn-sm" onclick="openPairingModal()">
                <i data-lucide="smartphone" style="width:14px;height:14px;"></i> 📱 Pair with iPhone (QR Code)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="syncManager.pullFromCloud();showToast('Syncing now...')">
                <i data-lucide="refresh-cw" style="width:14px;height:14px;"></i> Sync Now
              </button>
            ` : ''}
          </div>
        </div>

        <div class="sync-setup-help">
          <span class="help-title">💡 1-Minute Firebase Setup (100% Free):</span>
          <ol style="margin:6px 0 0 16px;padding:0;font-size:0.76rem;color:var(--text-muted);line-height:1.45;">
            <li>Go to <a href="https://console.firebase.google.com" target="_blank" style="color:var(--primary);text-decoration:underline;">console.firebase.google.com</a> (log in with your Google account).</li>
            <li>Click <strong>Create a project</strong> → name it <code>book-of-life</code> → Create.</li>
            <li>In left sidebar: <strong>Build</strong> → <strong>Realtime Database</strong> → <strong>Create Database</strong> → choose <strong>Start in test mode</strong>.</li>
            <li>Copy the database link at the top (e.g. <code>https://...firebaseio.com/</code>) and paste it above!</li>
          </ol>
        </div>
      </div>

      <!-- Backup -->
      <div class="settings-card">
        <div class="settings-card-header">
          <i data-lucide="hard-drive" style="color:var(--margo-m);width:18px;height:18px;"></i>
          <h3>Backup &amp; Data</h3>
        </div>
        <p class="settings-desc">Your data lives 100% in your browser. Export to keep a backup.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">
          <button class="btn btn-secondary btn-sm" onclick="doExportJSON()">
            <i data-lucide="download" style="width:14px;height:14px;"></i> Export JSON
          </button>
          <label class="btn btn-secondary btn-sm" style="cursor:pointer;">
            <i data-lucide="upload" style="width:14px;height:14px;"></i> Import JSON
            <input type="file" accept=".json" style="display:none;" onchange="doImportJSON(event)">
          </label>
        </div>
      </div>

      <!-- App Cache & Reload -->
      <div class="settings-card">
        <div class="settings-card-header">
          <i data-lucide="refresh-cw" style="color:var(--primary);width:18px;height:18px;"></i>
          <h3>App Cache & Updates</h3>
        </div>
        <p class="settings-desc">Force reload the app and clear browser cache on mobile.</p>
        <button class="btn btn-secondary btn-sm" style="margin-top:10px;" onclick="window.location.reload(true)">
          <i data-lucide="refresh-cw" style="width:14px;height:14px;"></i> Force Refresh App
        </button>
      </div>

      <!-- Reset -->
      <div class="settings-card danger-zone">
        <div class="settings-card-header">
          <i data-lucide="alert-triangle" style="color:var(--danger);width:18px;height:18px;"></i>
          <h3>Reset</h3>
        </div>
        <p class="settings-desc">Wipe all data and restore sample defaults.</p>
        <button class="btn btn-secondary btn-sm" style="margin-top:10px;" onclick="doResetDefaults()">
          <i data-lucide="refresh-cw" style="width:14px;height:14px;"></i> Reset to Sample Data
        </button>
      </div>

    </div>
  `;

  openModal('modal-settings');
  if (window.lucide) lucide.createIcons();
}

function renderSettingsModalBody() {
  // Re-render body without opening (used after theme change inside modal)
  openSettingsModal();
}

function updateMotto(val) {
  storage.data.motto = val;
  storage.saveData();
  showToast('Motto updated.');
}

function doExportJSON() {
  storage.exportJSON();
  showToast('Backup downloaded.');
}

function doImportJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const success = storage.importJSON(e.target.result);
    if (success) {
      showToast('Data restored!');
      closeAllModals();
      renderDailySheet();
    } else {
      showToast('Import failed — check JSON format.');
    }
  };
  reader.readAsText(file);
}

function doResetDefaults() {
  if (confirm('Reset all data to sample defaults? This cannot be undone.')) {
    storage.resetToDefaults();
    showToast('Reset to defaults.');
    closeAllModals();
    renderDailySheet();
  }
}

/* --------------------------------------------------------------------------
   Modal Helpers
   -------------------------------------------------------------------------- */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  editingHabitId = null;
}

/* --------------------------------------------------------------------------
   Habit Modals
   -------------------------------------------------------------------------- */
function showAddHabitModal() {
  document.getElementById('habit-name-input').value = '';
  document.getElementById('habit-bucket-select').value = 'M';
  document.getElementById('habit-cadence-select').value = 'daily';
  document.getElementById('habit-target-input').value = '1';
  document.getElementById('habit-target-group').style.display = 'none';
  document.getElementById('habit-desc-input').value = '';
  openModal('modal-add-habit');
  document.getElementById('habit-name-input').focus();
}

function onCadenceChange(val, targetGroupId = 'habit-target-group') {
  const g = document.getElementById(targetGroupId);
  if (g) g.style.display = (val === 'weekly') ? 'block' : 'none';
}

function submitAddHabit(e) {
  e.preventDefault();
  const name = document.getElementById('habit-name-input').value.trim();
  const bucket = document.getElementById('habit-bucket-select').value;
  const cadence = document.getElementById('habit-cadence-select').value;
  const target = cadence === 'weekly'
    ? (parseInt(document.getElementById('habit-target-input').value, 10) || 3)
    : 1;
  const description = document.getElementById('habit-desc-input').value.trim();
  if (!name) return;

  storage.addHabit({ name, bucket, cadence, target, description });
  closeAllModals();
  showToast(`"${name}" added!`);
  renderDailySheet();
}

function showEditHabitModal(habitId, e) {
  if (e) e.stopPropagation();
  const habit = storage.getHabit(habitId);
  if (!habit) return;

  editingHabitId = habitId;
  document.getElementById('edit-habit-name-input').value = habit.name;
  document.getElementById('edit-habit-bucket-select').value = habit.bucket;
  document.getElementById('edit-habit-cadence-select').value = habit.cadence;
  document.getElementById('edit-habit-target-input').value = habit.target || 1;
  document.getElementById('edit-habit-target-group').style.display =
    (habit.cadence === 'weekly') ? 'block' : 'none';
  document.getElementById('edit-habit-desc-input').value = habit.description || '';

  openModal('modal-edit-habit');
  document.getElementById('edit-habit-name-input').focus();
}

function submitEditHabit(e) {
  e.preventDefault();
  if (!editingHabitId) return;

  const name = document.getElementById('edit-habit-name-input').value.trim();
  const bucket = document.getElementById('edit-habit-bucket-select').value;
  const cadence = document.getElementById('edit-habit-cadence-select').value;
  const target = cadence === 'weekly'
    ? (parseInt(document.getElementById('edit-habit-target-input').value, 10) || 3)
    : 1;
  const description = document.getElementById('edit-habit-desc-input').value.trim();
  if (!name) return;

  storage.updateHabit(editingHabitId, {
    name, bucket, cadence, target, description,
    color: MARGO_BUCKETS[bucket]?.colorHex || '#4E8765'
  });
  closeAllModals();
  showToast('Habit updated.');
  renderDailySheet();
}

function deleteCurrentEditingHabit() {
  if (!editingHabitId) return;
  const habit = storage.getHabit(editingHabitId);
  if (!habit) return;

  if (confirm(`Remove "${habit.name}"?`)) {
    storage.deleteHabit(editingHabitId);
    closeAllModals();
    showToast(`"${habit.name}" removed.`);
    renderDailySheet();
  }
}

/* --------------------------------------------------------------------------
   Good Choices Actions
   -------------------------------------------------------------------------- */
function recordChoiceAction(type, delta = 1, dateStr = formatDateIso(new Date())) {
  storage.recordChoice(type, delta, dateStr);
  if (type === 'good' && delta > 0) {
    showToast('✨ Good choice logged!');
  }
  renderDailySheet();
}

/* --------------------------------------------------------------------------
   Health & Vitality Check-in Actions
   -------------------------------------------------------------------------- */
function recordHealthLevelAction(level, dateStr = formatDateIso(new Date())) {
  const current = storage.getHealthLevel(dateStr);
  storage.setHealthLevel(level, dateStr);
  const meta = (typeof HEALTH_LEVELS !== 'undefined') ? HEALTH_LEVELS[level] : null;
  if (meta && current !== level) {
    showToast(`${meta.emoji} Vitality logged: ${meta.label}! (+5 XP)`);
  }
  renderDailySheet();
}

/* --------------------------------------------------------------------------
   Day-Specific Goal Actions
   -------------------------------------------------------------------------- */
function submitAddDayGoalInline(e, dateStr = formatDateIso(new Date()), inputId = 'sheet-day-goal-input') {
  if (e) e.preventDefault();
  const input = document.getElementById(inputId);
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  storage.addDayGoal(text, dateStr);
  input.value = '';
  showToast('Goal added.');
  renderDailySheet();
}

function toggleDayGoalAction(goalId, dateStr = formatDateIso(new Date())) {
  const isDone = storage.toggleDayGoal(goalId, dateStr);
  if (isDone) {
    triggerConfetti();
    showToast('🎯 Goal crushed!');
  }
  renderDailySheet();
}

function deleteDayGoalAction(goalId, dateStr = formatDateIso(new Date())) {
  storage.deleteDayGoal(goalId, dateStr);
  showToast('Goal removed.');
  renderDailySheet();
}

/* --------------------------------------------------------------------------
   Toast & Confetti
   -------------------------------------------------------------------------- */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#4E8765', '#D97768', '#7979B8', '#D49B35', '#3E5C76']
    });
  }
}

/* --------------------------------------------------------------------------
   Cloud Sync Settings & Pairing Handlers
   -------------------------------------------------------------------------- */
function saveSyncSettings() {
  const dbUrl = (document.getElementById('sync-db-url-input')?.value || '').trim();
  const passphrase = (document.getElementById('sync-passphrase-input')?.value || '').trim();

  if (!dbUrl) {
    showToast('Please enter your Firebase Database URL');
    return;
  }
  if (!passphrase) {
    showToast('Please enter a secret Sync Passphrase');
    return;
  }

  if (typeof syncManager !== 'undefined') {
    syncManager.saveConfig(dbUrl, passphrase);
    openSettingsModal();
  }
}

function openPairingModal() {
  if (typeof syncManager === 'undefined' || !syncManager.isConfigured()) {
    showToast('Please configure cloud sync first');
    return;
  }

  const pairUrl = syncManager.getPairingUrl();
  const modal = document.getElementById('modal-sync-pair');
  const body = document.getElementById('sync-pair-modal-body');
  if (!modal || !body) return;

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pairUrl)}`;

  body.innerHTML = `
    <div style="background: white; padding: 12px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: inline-block;">
      <img src="${qrSrc}" alt="Sync Pairing QR Code" width="200" height="200" style="display: block;">
    </div>
    <div style="font-size: 0.84rem; color: var(--text-secondary); max-width: 360px; line-height: 1.45; text-align: center;">
      <strong>Point your iPhone camera</strong> at this QR code to automatically connect your phone to this database. No typing required!
    </div>
    <div style="display: flex; gap: 10px; justify-content: center; width: 100%; flex-wrap: wrap;">
      <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${pairUrl.replace(/'/g, "\\'")}'); showToast('📋 Pairing link copied!')">
        <i data-lucide="copy" style="width: 14px; height: 14px;"></i> Copy Pairing Link
      </button>
      <button class="btn btn-primary btn-sm" onclick="closeAllModals()">
        Done
      </button>
    </div>
  `;

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

