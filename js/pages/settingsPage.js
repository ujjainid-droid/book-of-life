/* ==========================================================================
   Book of Life / Life OS - Settings & Archives Page Renderer
   ========================================================================== */

function renderSettingsPage() {
  const container = document.getElementById('page-settings');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-text">
        <h2>Settings & Data Vault</h2>
        <p>100% private, offline-first. Manage your MARGO preferences and data backups.</p>
      </div>
    </div>

    <div class="settings-section-grid">
      <!-- General Preferences -->
      <div class="settings-card">
        <div class="settings-card-header">
          <i data-lucide="sliders" style="color: var(--margo-o);"></i>
          <h3>Operating Preferences</h3>
        </div>

        <div class="form-group">
          <label class="form-label">Personal Life Motto / Executive Statement</label>
          <input type="text" class="form-input" id="setting-motto-input" value="${storage.data.motto}" onchange="updateMotto(this.value)">
        </div>

        <div class="form-group">
          <label class="form-label">Program Stacking Start Date</label>
          <input type="date" class="form-input" id="setting-startdate-input" value="${storage.data.programStartDate || ''}" onchange="updateStartDate(this.value)">
        </div>

        <div class="form-group">
          <label class="form-label">Appearance & Theme</label>
          <div style="display: flex; gap: 10px; margin-top: 6px;">
            <button class="btn ${document.documentElement.getAttribute('data-theme') !== 'dark' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="setTheme('light')">
              <i data-lucide="sun"></i> Nordic Light
            </button>
            <button class="btn ${document.documentElement.getAttribute('data-theme') === 'dark' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="setTheme('dark')">
              <i data-lucide="moon"></i> Midnight Slate
            </button>
          </div>
        </div>
      </div>

      <!-- MARGO Color System Reference -->
      <div class="settings-card">
        <div class="settings-card-header">
          <i data-lucide="palette" style="color: var(--margo-a);"></i>
          <h3>MARGO Palette Reference</h3>
        </div>
        <p class="settings-desc">Five buckets, five letters, one seamless life operating system.</p>

        <div class="palette-swatches">
          ${Object.keys(MARGO_BUCKETS).map(key => {
            const b = MARGO_BUCKETS[key];
            return `
              <div class="swatch-item">
                <div class="swatch-circle" style="background: ${b.colorHex};"></div>
                <span class="swatch-label">${key}</span>
              </div>
            `;
          }).join('')}
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px;">
          ${Object.keys(MARGO_BUCKETS).map(key => {
            const b = MARGO_BUCKETS[key];
            return `
              <div style="display: flex; align-items: baseline; gap: 8px; font-size: 0.8rem;">
                <span class="margo-tag margo-tag-${key.toLowerCase()}">${key}</span>
                <strong>${b.name}:</strong>
                <span style="color: var(--text-secondary);">${b.description}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Data Backup & Portability -->
      <div class="settings-card">
        <div class="settings-card-header">
          <i data-lucide="hard-drive" style="color: var(--margo-m);"></i>
          <h3>Backup & Data Portability</h3>
        </div>
        <p class="settings-desc">
          Your margo data lives directly in your browser. Export anytime to guarantee zero data loss.
        </p>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-secondary btn-sm" onclick="exportDataJSON()">
            <i data-lucide="download"></i> Backup to JSON
          </button>
          <label class="btn btn-secondary btn-sm" style="cursor: pointer;">
            <i data-lucide="upload"></i> Restore from JSON
            <input type="file" accept=".json" style="display: none;" onchange="importDataJSON(event)">
          </label>
        </div>
      </div>

      <!-- System Reset -->
      <div class="settings-card danger-zone">
        <div class="settings-card-header">
          <i data-lucide="alert-triangle" style="color: var(--danger);"></i>
          <h3>Reset & Storage Maintenance</h3>
        </div>
        <p class="settings-desc" style="color: var(--text-secondary);">
          Re-seed sample data for exploration or purge stored data.
        </p>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary btn-sm" onclick="resetToDemoData()">
            <i data-lucide="refresh-cw"></i> Reset to Sample Data
          </button>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function updateMotto(val) {
  storage.data.motto = val;
  storage.saveData();
  renderCoverPage();
  showToast('Life motto updated.');
}

function updateStartDate(val) {
  storage.data.programStartDate = val;
  storage.saveData();
  showToast('Program start date updated.');
}

function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  storage.data.theme = theme;
  storage.saveData();
  renderSettingsPage();
}

function exportDataJSON() {
  storage.exportJSON();
  showToast('Downloaded JSON backup file.');
}

function importDataJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const success = storage.importJSON(e.target.result);
    if (success) {
      showToast('Data successfully restored!');
      switchPage('cover');
    } else {
      showToast('Failed to restore data. Please check JSON format.');
    }
  };
  reader.readAsText(file);
}

function resetToDemoData() {
  if (confirm('Are you sure you want to reset margo to default sample data?')) {
    storage.resetToDefaults();
    showToast('Reset to default sample data.');
    switchPage('cover');
  }
}
