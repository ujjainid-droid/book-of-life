/* ==========================================================================
   Book of Life / Life OS — Single Daily Sheet App Controller
   ========================================================================== */

let editingHabitId = null;
let currentView = 'sanctuary'; // 'sanctuary' | 'cover' | 'zlog' | 'finance' | 'podcasts'

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme
  let initialTheme = 'dark';
  try {
    const saved = localStorage.getItem('margo-theme') || (typeof storage !== 'undefined' && storage.data && storage.data.theme) || localStorage.getItem('margo-zhub-theme');
    if (saved === 'light' || saved === 'dark') {
      initialTheme = saved;
    }
  } catch (e) {}
  setTheme(initialTheme, false);

  // Restore saved view (or URL hash)
  function parseHashRoute() {
    const rawHash = (window.location.hash || '').replace(/^#\/?/, '').trim();
    if (!rawHash) {
      const saved = localStorage.getItem('BOL_ACTIVE_VIEW') || 'sanctuary';
      let sub = null;
      if (saved === 'finance' || saved === 'claims') {
        sub = localStorage.getItem('BOL_FINANCE_ACTIVE_SUBTAB') || 'burn';
      } else if (saved === 'zlog' || saved === 'zhub') {
        sub = localStorage.getItem('BOL_ZLOG_ACTIVE_SUBTAB') || 'timeline';
      }
      return { view: saved, subView: sub };
    }

    if (rawHash.startsWith('zhub') || rawHash.startsWith('zlog')) {
      const parts = rawHash.split(/[\/\-_?]/);
      const sub = (parts.length > 1 && parts[1]) ? parts[1].replace('tab=', '') : (localStorage.getItem('BOL_ZLOG_ACTIVE_SUBTAB') || 'timeline');
      return { view: 'zlog', subView: sub };
    }
    if (rawHash.startsWith('finance') || rawHash.startsWith('claims') || rawHash.startsWith('money') || rawHash.startsWith('budget')) {
      const parts = rawHash.split(/[\/\-_?]/);
      let sub = (parts.length > 1 && parts[1]) ? parts[1].replace('tab=', '') : (rawHash.startsWith('claims') ? 'claims' : (rawHash.startsWith('budget') ? 'budget' : (localStorage.getItem('BOL_FINANCE_ACTIVE_SUBTAB') || 'burn')));
      if (sub === 'cash') sub = 'burn';
      else if (sub === 'cards') sub = 'subscriptions';
      else if (sub === 'worth') sub = 'runway';
      else if (sub === 'med') sub = 'claims';
      else if (sub === 'plan') sub = 'budget';
      return { view: 'finance', subView: sub };
    }
    if (rawHash.startsWith('podcasts')) return { view: 'podcasts', subView: null };
    if (rawHash.startsWith('hobby') || rawHash.startsWith('hobbies')) return { view: 'hobby', subView: null };
    if (rawHash.startsWith('cover') || rawHash.startsWith('compass')) return { view: 'cover', subView: null };
    if (rawHash.startsWith('sanctuary') || rawHash.startsWith('today')) return { view: 'sanctuary', subView: null };
    return { view: rawHash, subView: null };
  }

  const initialRoute = parseHashRoute();
  switchAppView(initialRoute.view, initialRoute.subView);
  updateEnergyDialUI();

  // Refresh header badges
  refreshAppBadges();

  // Hash change listener for browser forward/back buttons
  window.addEventListener('hashchange', () => {
    const r = parseHashRoute();
    const isZLogSubChange = (r.view === 'zlog' && r.subView && typeof activeZLogSubTab !== 'undefined' && r.subView !== activeZLogSubTab);
    const isFinanceSubChange = (r.view === 'finance' && r.subView && typeof activeFinanceSubTab !== 'undefined' && r.subView !== activeFinanceSubTab);
    if (r.view !== currentView || isZLogSubChange || isFinanceSubChange) {
      switchAppView(r.view, r.subView);
    }
  });

  // Keyboard: Escape closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
});

/* --------------------------------------------------------------------------
   Domain & View Switching (Sanctuary vs Z Hub vs Finance)
   -------------------------------------------------------------------------- */
function switchDomain(domain) {
  if (domain === 'zhub' || domain === 'zlog') {
    const lastSub = localStorage.getItem('BOL_ZLOG_ACTIVE_SUBTAB') || 'timeline';
    switchAppView('zlog', lastSub);
  } else if (domain === 'finance' || domain === 'claims') {
    const lastSub = localStorage.getItem('BOL_FINANCE_ACTIVE_SUBTAB') || 'burn';
    switchAppView('finance', lastSub);
  } else {
    // Return to last sanctuary view (cover or sanctuary)
    const lastSanctuary = localStorage.getItem('BOL_LAST_SANCTUARY_VIEW') || 'sanctuary';
    switchAppView(lastSanctuary);
  }
}
window.switchDomain = switchDomain;

function switchAppView(viewName, subViewName) {
  if (viewName && typeof viewName === 'string' && viewName.includes('/')) {
    const parts = viewName.split('/');
    viewName = parts[0];
    if (!subViewName) subViewName = parts[1];
  }

  if (viewName === 'claims' || viewName === 'finance' || viewName === 'budget') {
    currentView = 'finance';
    if (viewName === 'budget' && !subViewName) subViewName = 'budget';
  } else if (viewName === 'zlog' || viewName === 'zhub' || viewName === 'bunker') {
    currentView = 'zlog';
  } else if (viewName === 'podcasts') {
    currentView = 'podcasts';
  } else if (viewName === 'cover' || viewName === 'compass') {
    currentView = 'cover';
    localStorage.setItem('BOL_LAST_SANCTUARY_VIEW', 'cover');
  } else if (viewName === 'hobby' || viewName === 'hobbies') {
    currentView = 'hobby';
  } else {
    currentView = 'sanctuary';
    localStorage.setItem('BOL_LAST_SANCTUARY_VIEW', 'sanctuary');
  }

  // Determine subview for zlog if provided
  if (currentView === 'zlog') {
    if (subViewName && ['timeline', 'calendar', 'titration', 'insights'].includes(subViewName)) {
      try { localStorage.setItem('BOL_ZLOG_ACTIVE_SUBTAB', subViewName); } catch (e) {}
      if (typeof activeZLogSubTab !== 'undefined') activeZLogSubTab = subViewName;
    }
  } else if (currentView === 'finance') {
    const validTabs = ['burn', 'budget', 'subscriptions', 'runway', 'claims', 'cash', 'cards', 'worth', 'med', 'plan'];
    if (subViewName && validTabs.includes(subViewName)) {
      const normalized = (subViewName === 'cash' ? 'burn' : (subViewName === 'cards' ? 'subscriptions' : (subViewName === 'worth' ? 'runway' : (subViewName === 'med' ? 'claims' : (subViewName === 'plan' ? 'budget' : subViewName)))));
      try { localStorage.setItem('BOL_FINANCE_ACTIVE_SUBTAB', normalized); } catch (e) {}
      if (typeof activeFinanceSubTab !== 'undefined') activeFinanceSubTab = normalized;
    }
  }

  try {
    localStorage.setItem('BOL_ACTIVE_VIEW', currentView);
    let targetHash = '';
    if (currentView === 'cover') {
      targetHash = 'compass';
    } else if (currentView === 'hobby') {
      targetHash = 'hobby';
    } else if (currentView === 'zlog') {
      const zTab = subViewName || (typeof activeZLogSubTab !== 'undefined' ? activeZLogSubTab : localStorage.getItem('BOL_ZLOG_ACTIVE_SUBTAB')) || 'timeline';
      targetHash = (zTab && zTab !== 'timeline') ? `zhub/${zTab}` : 'zhub';
    } else if (currentView === 'finance') {
      const finTab = subViewName || (typeof activeFinanceSubTab !== 'undefined' ? activeFinanceSubTab : localStorage.getItem('BOL_FINANCE_ACTIVE_SUBTAB')) || 'burn';
      const normalized = (finTab === 'cash' ? 'burn' : (finTab === 'cards' ? 'subscriptions' : (finTab === 'worth' ? 'runway' : (finTab === 'med' ? 'claims' : finTab))));
      targetHash = (normalized && normalized !== 'burn') ? `finance/${normalized}` : 'finance';
    } else if (currentView === 'podcasts') {
      targetHash = 'podcasts';
    } else if (currentView === 'sanctuary') {
      targetHash = '';
    }

    const currentHash = window.location.hash.replace(/^#\/?/, '');
    if (currentHash !== targetHash) {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', targetHash ? `#${targetHash}` : window.location.pathname + window.location.search);
      } else {
        window.location.hash = targetHash;
      }
    }
  } catch (e) {}

  const todayBtn = document.getElementById('nav-btn-today');
  const coverBtn = document.getElementById('nav-btn-cover');
  const hobbyBtn = document.getElementById('nav-btn-hobby');
  const zhubBtn = document.getElementById('nav-btn-zhub');
  const financeBtn = document.getElementById('nav-btn-finance');
  const budgetBtn = document.getElementById('nav-btn-budget');

  // Update unified nav active states (stable across all pages)
  const updateNavBtn = (btn, isActive) => {
    if (!btn) return;
    btn.classList.toggle('active', isActive);
    btn.classList.toggle('on', isActive);
    if (isActive) {
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.removeAttribute('aria-current');
    }
  };
  const isBudgetActive = currentView === 'finance' && (subViewName === 'budget' || (typeof activeFinanceSubTab !== 'undefined' && activeFinanceSubTab === 'budget'));
  updateNavBtn(todayBtn, currentView === 'sanctuary');
  updateNavBtn(coverBtn, currentView === 'cover');
  updateNavBtn(hobbyBtn, currentView === 'hobby');
  updateNavBtn(zhubBtn, currentView === 'zlog');
  updateNavBtn(budgetBtn, isBudgetActive);
  updateNavBtn(financeBtn, currentView === 'finance');

  // Also support old element IDs if referenced
  const domainBtnSanctuary = document.getElementById('domain-btn-sanctuary');
  const domainBtnZHub = document.getElementById('domain-btn-zhub');
  const domainBtnFinance = document.getElementById('domain-btn-finance');
  if (domainBtnSanctuary) domainBtnSanctuary.classList.toggle('active', currentView === 'sanctuary' || currentView === 'cover');
  if (domainBtnZHub) domainBtnZHub.classList.toggle('active', currentView === 'zlog');
  if (domainBtnFinance) domainBtnFinance.classList.toggle('active', currentView === 'finance');

  updateEnergyDialUI();

  // Clean up view-specific container classes
  const sheetContainer = document.getElementById('daily-sheet-container');
  if (sheetContainer && currentView !== 'finance') {
    sheetContainer.classList.remove('has-mm-shell');
  }

  // Render view directly into the daily sheet container
  if (currentView === 'zlog') {
    if (typeof renderZLogPage === 'function') renderZLogPage(subViewName);
  } else if (currentView === 'finance') {
    if (typeof renderFinancePage === 'function') {
      renderFinancePage(subViewName);
    } else if (typeof renderClaimsPage === 'function') {
      renderClaimsPage();
    }
  } else if (currentView === 'podcasts') {
    if (typeof renderPodcastAgentView === 'function') renderPodcastAgentView();
  } else if (currentView === 'cover') {
    if (typeof renderCoverHubPage === 'function') renderCoverHubPage();
  } else if (currentView === 'hobby') {
    if (typeof renderHobbyPage === 'function') renderHobbyPage();
  } else {
    if (typeof renderDailySheet === 'function') renderDailySheet();
  }

  refreshAppBadges();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Backward compatibility alias
function toggleAdultingBunker() {
  if (currentView === 'sanctuary' || currentView === 'cover') {
    switchDomain('zhub');
  } else {
    switchDomain('sanctuary');
  }
}

function renderAdultingBunkerShell(subView, zlogSubTab) {
  if (subView === 'zlog') {
    if (typeof renderZLogPage === 'function') renderZLogPage(zlogSubTab);
  } else {
    if (typeof renderClaimsPage === 'function') renderClaimsPage();
  }
}

function setAppEnergyMode(mode) {
  if (typeof storage !== 'undefined' && typeof storage.setEnergyMode === 'function') {
    storage.setEnergyMode(mode);
  }
  updateEnergyDialUI();
  if (typeof renderDailySheet === 'function') {
    renderDailySheet();
  }
  if (typeof showToast === 'function') {
    if (mode === 'maint') {
      showToast('🛡️ Maintenance Mode: Protecting Move & Stand baseline (Zero Guilt)');
    } else {
      showToast('⚡ Power Mode: Ready to conquer');
    }
  }
}

function updateEnergyDialUI() {
  const mode = (typeof storage !== 'undefined' && typeof storage.getEnergyMode === 'function') 
    ? storage.getEnergyMode() 
    : 'power';
  const btnPower = document.getElementById('dial-btn-power');
  const btnMaint = document.getElementById('dial-btn-maint');
  if (btnPower && btnMaint) {
    if (mode === 'maint') {
      btnPower.classList.remove('active');
      btnMaint.classList.add('active');
    } else {
      btnMaint.classList.remove('active');
      btnPower.classList.add('active');
    }
  }
}

function shuffleDailyAffirmation() {
  if (typeof customAffirmationOffset !== 'undefined') {
    customAffirmationOffset++;
  }
  if (typeof renderDailySheet === 'function') {
    renderDailySheet();
  }
}

function openJournalEntryModal(dateStr) {
  const entry = (typeof storage !== 'undefined' && typeof storage.getJournal === 'function') 
    ? storage.getJournal(dateStr) 
    : null;
  if (!entry) return;

  const modal = document.getElementById('modal-journal-view');
  const title = document.getElementById('journal-modal-title');
  const subtitle = document.getElementById('journal-modal-subtitle');
  const content = document.getElementById('journal-modal-content');
  const jumpBtn = document.getElementById('journal-modal-jump-btn');

  const dateObj = (typeof parseDateIso === 'function') ? parseDateIso(dateStr) : new Date(dateStr);
  const formatted = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const healthLevel = (typeof storage.getHealthLevel === 'function') ? storage.getHealthLevel(dateStr) : null;
  const healthMeta = (healthLevel && typeof HEALTH_LEVELS !== 'undefined') ? HEALTH_LEVELS[healthLevel] : null;

  if (title) title.textContent = `Reflection — ${formatted}`;
  if (subtitle) {
    subtitle.textContent = `${entry.wordCount || 0} words • ${healthMeta ? `${healthMeta.emoji} ${healthMeta.label}` : 'Personal Entry'}`;
  }
  if (content) content.textContent = entry.text;

  if (jumpBtn) {
    jumpBtn.onclick = () => {
      closeAllModals();
      if (typeof jumpToTrackingDate === 'function') {
        jumpToTrackingDate(dateStr);
      }
    };
  }

  if (modal) modal.classList.add('active');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderCurrentView() {
  const active = currentView || localStorage.getItem('BOL_ACTIVE_VIEW') || 'sanctuary';
  let sub = null;
  if (active === 'zlog' || active === 'zhub') {
    sub = (typeof activeZLogSubTab !== 'undefined') ? activeZLogSubTab : (localStorage.getItem('BOL_ZLOG_ACTIVE_SUBTAB') || 'timeline');
  } else if (active === 'finance' || active === 'claims' || active === 'money') {
    sub = (typeof activeFinanceSubTab !== 'undefined') ? activeFinanceSubTab : (localStorage.getItem('BOL_FINANCE_ACTIVE_SUBTAB') || 'burn');
  }
  switchAppView(active, sub);
}
window.renderCurrentView = renderCurrentView;

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
function getActiveTheme() {
  const rootTheme = document.documentElement.getAttribute('data-theme');
  if (rootTheme === 'light' || rootTheme === 'dark') return rootTheme;
  try {
    const saved = localStorage.getItem('margo-theme') || (typeof storage !== 'undefined' && storage.data && storage.data.theme) || localStorage.getItem('margo-zhub-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {}
  return 'dark';
}

function toggleTheme() {
  const current = getActiveTheme();
  const next = (current === 'light') ? 'dark' : 'light';
  setTheme(next);
}

function setTheme(theme, save = true) {
  const t = (theme === 'light') ? 'light' : 'dark';
  const isLight = (t === 'light');

  document.documentElement.setAttribute('data-theme', t);

  // Sync any active Z Hub containers
  const zhubSanctuary = document.querySelector('.zhub-sanctuary');
  if (zhubSanctuary) zhubSanctuary.setAttribute('data-theme', t);
  const zhubWrap = document.querySelector('.zhub-sanctuary-wrap');
  if (zhubWrap) zhubWrap.setAttribute('data-theme', t);

  // Sync any active Money containers
  const mmShell = document.querySelector('.mm-shell');
  if (mmShell) mmShell.setAttribute('data-theme', t);

  if (save) {
    try {
      localStorage.setItem('margo-theme', t);
      localStorage.setItem('margo-zhub-theme', t);
    } catch (e) {}
    if (typeof storage !== 'undefined' && storage.data) {
      storage.data.theme = t;
      if (typeof storage.saveData === 'function') {
        storage.saveData();
      }
    }
  }

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.content = isLight ? '#F2F3FC' : '#0F1020';
  }

  updateThemeIcon();
}

function updateThemeIcon() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';

  // Global Floating Switcher
  const globalBtn = document.getElementById('globalThemeBtn') || document.getElementById('themeBtn');
  const globalIc = document.getElementById('globalThemeIc') || document.getElementById('themeIc');

  if (globalBtn) {
    globalBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    const label = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    globalBtn.setAttribute('aria-label', label);
    globalBtn.setAttribute('title', label);
  }

  if (globalIc) {
    // When in light mode, show the Moon icon to switch to dark.
    // When in dark mode, show the Sun icon to switch to light.
    if (isLight) {
      globalIc.innerHTML = '<path d="M20 14.5A8 8 0 0 1 9.500 4 8 8 0 1 0 20 14.500z"/>';
    } else {
      globalIc.innerHTML = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
    }
  }

  // Z Hub top header theme button (if rendered)
  const zhubBtn = document.querySelector('.zhub-sanctuary #themeBtn');
  if (zhubBtn) {
    zhubBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    zhubBtn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    const txt = zhubBtn.querySelector('.t');
    if (txt) txt.textContent = isLight ? 'Dark' : 'Light';
  }

  // Money sidebar & mobile top bar theme buttons (if rendered)
  const themeD = document.getElementById('themeD');
  const themeM = document.getElementById('themeM');
  const moonSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.500A8 8 0 0 1 9.500 4 8 8 0 1 0 20 14.500z"/></svg>';
  const sunSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  if (themeD) {
    themeD.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    themeD.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    themeD.innerHTML = `<span class="ic">${isLight ? moonSvg : sunSvg}</span> ${isLight ? 'Dark mode' : 'Light mode'}`;
  }
  if (themeM) {
    themeM.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    themeM.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    themeM.innerHTML = `<span class="ic">${isLight ? moonSvg : sunSvg}</span>`;
  }

  // Compass tactile theme button
  const mcThemeBtn = document.querySelector('.mc-theme-btn');
  if (mcThemeBtn) {
    mcThemeBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    mcThemeBtn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    mcThemeBtn.innerHTML = `${isLight ? moonSvg : sunSvg} <span>${isLight ? 'Dark mode' : 'Light mode'}</span>`;
  }

  // Legacy header icon if present
  const icon = document.getElementById('header-theme-icon');
  if (icon) {
    icon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
    if (window.lucide) lucide.createIcons();
  }
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

function forceReloadFresh() {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('v_t', Date.now().toString());
    window.location.replace(url.toString());
  } catch (e) {
    window.location.reload(true);
  }
}
window.forceReloadFresh = forceReloadFresh;

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
          <span class="help-title">⚙️ 1-Minute Firebase Setup (100% Free):</span>
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
        <p class="settings-desc">Force reload the app and bust standalone iOS cache on mobile.</p>
        <button class="btn btn-secondary btn-sm" style="margin-top:10px;" onclick="forceReloadFresh()">
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
    showToast('🚀 Goal crushed!');
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
      colors: ['#5CE1F0', '#FF8FD0', '#7DB8FF', '#2EBF91', '#B5ABFF']
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

