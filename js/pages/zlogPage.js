/* ==========================================================================
   Book of Life / Life OS - Z Log View Page Controller
   Dedicated Behavior Timeline, 5-Star Ratings, Aggression Tracker & Titration
   ========================================================================== */

function getInitialZLogSubTab() {
  try {
    const rawHash = (window.location.hash || '').replace(/^#\/?/, '').trim();
    if (rawHash.startsWith('zlog')) {
      const parts = rawHash.split(/[\/\-_?]/);
      if (parts.length > 1) {
        const sub = parts[1].replace('tab=', '').toLowerCase();
        if (['timeline', 'calendar', 'titration', 'insights'].includes(sub)) {
          return sub;
        }
      }
    }
    const saved = localStorage.getItem('BOL_ZLOG_ACTIVE_SUBTAB');
    if (saved && ['timeline', 'calendar', 'titration', 'insights'].includes(saved)) {
      return saved;
    }
  } catch (e) {}
  return 'timeline';
}

let activeZLogSubTab = getInitialZLogSubTab();
let zlogRatingFilter = 'all'; // 'all' | 5 | 4 | 3 | 2 | 1
let zlogPeriodFilter = 'all'; // 'all' | '2026' | '2025' | '2024'
let zlogAggressionFilter = false; // true | false
let zlogSearchQuery = '';
let zlogTimelineLimit = 50;
let zlogExpandedMonths = {};
let zlogCalendarYear = (() => {
  try {
    const savedY = parseInt(localStorage.getItem('BOL_ZLOG_CAL_YEAR'), 10);
    if (!isNaN(savedY) && savedY >= 2024 && savedY <= 2030) return savedY;
  } catch (e) {}
  return (typeof new Date === 'function') ? new Date().getFullYear() : 2026;
})();
let zlogCalendarMonth = (() => {
  try {
    const savedM = parseInt(localStorage.getItem('BOL_ZLOG_CAL_MONTH'), 10);
    if (!isNaN(savedM) && savedM >= 1 && savedM <= 12) return savedM;
  } catch (e) {}
  return (typeof new Date === 'function') ? (new Date().getMonth() + 1) : 9;
})();
let zlogCalendarRatingFilter = (() => {
  try {
    const savedF = localStorage.getItem('BOL_ZLOG_CAL_FILTER');
    if (savedF) return savedF;
  } catch (e) {}
  return 'all';
})();

function renderZLogPage(targetSubTab) {
  const container = document.getElementById('bunker-subview-frame') || document.getElementById('daily-sheet-container') || document.getElementById('page-cover');
  if (!container) return;

  if (targetSubTab && ['timeline', 'calendar', 'titration', 'insights'].includes(targetSubTab)) {
    activeZLogSubTab = targetSubTab;
  } else if (!activeZLogSubTab) {
    activeZLogSubTab = getInitialZLogSubTab();
  }

  // Unconditional auto-repair check: if storage has old seed version, < 35 titrations, old defaulted >300 good days, or missing 2026-09-19 entry
  const currentStats = storage.getZLogStats();
  const currentTitration = storage.getTitrationHistory();
  const hasTit35 = currentTitration.some(t => t && (t.id === 'tit-35' || (t.date === '2026-09-19' && t.medication && t.medication.includes('Risperdal'))));
  const isStaleCorrupted = !storage.data.zlogSeedVersion ||
    storage.data.zlogSeedVersion < 6 ||
    !storage.data.titrationSeedVersion ||
    storage.data.titrationSeedVersion < 7 ||
    currentTitration.length < 35 ||
    !hasTit35 ||
    currentStats.goodDays > 300 ||
    !storage.data.zlogEntries ||
    !storage.data.zlogEntries['2026-09-12'];

  if (isStaleCorrupted) {
    if (typeof DEFAULT_ZLOG_ENTRIES !== 'undefined') {
      const cleanDefaults = { ...DEFAULT_ZLOG_ENTRIES };
      if (storage.data.zlogEntries && typeof storage.data.zlogEntries === 'object') {
        for (const [d, entry] of Object.entries(storage.data.zlogEntries)) {
          if (d >= '2026-09-12' && entry && (entry.notes || entry.rating || entry.updatedAt)) {
            cleanDefaults[d] = entry;
          }
        }
      }
      storage.data.zlogEntries = cleanDefaults;
      storage.data.zlogSeedVersion = 6;
    }
    if (typeof DEFAULT_TITRATION_HISTORY !== 'undefined') {
      const existing = Array.isArray(storage.data.titrationHistory) ? storage.data.titrationHistory : [];
      const tit35Exists = existing.some(t => t && (t.id === 'tit-35' || (t.date === '2026-09-19' && t.medication && t.medication.includes('Risperdal'))));
      if (!tit35Exists) {
        const tit35 = DEFAULT_TITRATION_HISTORY.find(t => t.id === 'tit-35');
        if (tit35) {
          existing.push(JSON.parse(JSON.stringify(tit35)));
          storage.data.titrationHistory = existing;
        } else {
          storage.data.titrationHistory = JSON.parse(JSON.stringify(DEFAULT_TITRATION_HISTORY));
        }
      }
      storage.data.titrationSeedVersion = 7;
    }
    storage.saveData();
    if (typeof sync !== 'undefined' && sync.isConfigured && sync.isConfigured()) {
      sync.pushToCloud();
    }
  }

  const stats = storage.getZLogStats();

  container.innerHTML = `
    <div class="zlog-page-container">
      <!-- Top Title & Stats Banner -->
      <div class="zlog-page-header">
        <div class="zlog-page-title-group">
          <h2>
            <span>🌱 Z log</span>
            <span class="zlog-badge-tag">Care OS</span>
          </h2>
          <div class="zlog-page-subtitle">Behavior history, daily regulation log, and medication titration timeline</div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn btn-secondary" onclick="forceSyncZLogDefaults()" title="Force synchronize verified 424 days and 35 titration events" style="font-size: 0.8rem; padding: 6px 12px; color: #2563EB; border-color: rgba(37, 99, 235, 0.3);">
            <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
            <span>Sync Data</span>
          </button>
          <button class="btn btn-secondary" onclick="exportZLogData()" title="Export all Z log entries as CSV" style="font-size: 0.8rem; padding: 6px 12px;">
            <i data-lucide="download" style="width: 14px; height: 14px;"></i>
            <span>Export CSV</span>
          </button>
          <button class="btn btn-primary" onclick="openZLogEntryModal()" style="font-size: 0.8rem; padding: 6px 14px; background: #2563EB; border-color: #1D4ED8;">
            <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
            <span>Log Entry</span>
          </button>
        </div>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="zlog-stats-strip">
        <div class="zlog-stat-card">
          <div class="zlog-stat-label">Total Logged</div>
          <div class="zlog-stat-val">${stats.totalLogged}</div>
          <div class="zlog-stat-sub">Historical Days</div>
        </div>
        <div class="zlog-stat-card">
          <div class="zlog-stat-label">Good Days</div>
          <div class="zlog-stat-val" style="color: #4E8765;">${stats.percentGood}%</div>
          <div class="zlog-stat-sub">${stats.goodDays} rated ≥ 4</div>
        </div>
        <div class="zlog-stat-card">
          <div class="zlog-stat-label">Aggression Alert</div>
          <div class="zlog-stat-val" style="color: ${stats.aggressionDays > 0 ? '#E06D53' : 'var(--text-primary)'};">${stats.aggressionDays}</div>
          <div class="zlog-stat-sub">Reported events</div>
        </div>
        <div class="zlog-stat-card">
          <div class="zlog-stat-label">Average Rating</div>
          <div class="zlog-stat-val" style="color: #2563EB;">${stats.avgRating} <span style="font-size: 0.85rem;">/ 5</span></div>
          <div class="zlog-stat-sub">${stats.totalRated} rated entries</div>
        </div>
      </div>

      <!-- Sub-Navigation Switcher -->
      <div class="zlog-subnav-bar">
        <div class="zlog-subnav-pills">
          <button class="zlog-subnav-btn ${activeZLogSubTab === 'timeline' ? 'active' : ''}" onclick="switchZLogSubTab('timeline')">
            📖 Behavior Timeline
          </button>
          <button class="zlog-subnav-btn ${activeZLogSubTab === 'calendar' ? 'active' : ''}" onclick="switchZLogSubTab('calendar')">
            🗓️ Monthly Calendar
          </button>
          <button class="zlog-subnav-btn ${activeZLogSubTab === 'titration' ? 'active' : ''}" onclick="switchZLogSubTab('titration')">
            💊 Meds &amp; Protocol
          </button>
          <button class="zlog-subnav-btn ${activeZLogSubTab === 'insights' ? 'active' : ''}" onclick="switchZLogSubTab('insights')">
            📊 Patterns &amp; Insights
          </button>
        </div>

        ${activeZLogSubTab === 'titration' ? `
          <button class="btn btn-secondary" onclick="openTitrationModal()" style="font-size: 0.78rem; padding: 4px 10px;">
            <i data-lucide="plus-circle" style="width: 14px; height: 14px;"></i>
            <span>Add Dosage Change</span>
          </button>
        ` : ''}
      </div>

      <!-- Dynamic Sub-view Content -->
      <div id="zlog-subview-container"></div>
    </div>
  `;

  if (activeZLogSubTab === 'timeline') {
    renderZLogTimeline();
  } else if (activeZLogSubTab === 'calendar') {
    renderZLogCalendar();
  } else if (activeZLogSubTab === 'titration') {
    renderZLogTitration();
  } else if (activeZLogSubTab === 'insights') {
    renderZLogInsights();
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function switchZLogSubTab(subTab) {
  if (['timeline', 'calendar', 'titration', 'insights'].includes(subTab)) {
    activeZLogSubTab = subTab;
    try {
      localStorage.setItem('BOL_ZLOG_ACTIVE_SUBTAB', subTab);
      const targetHash = (subTab === 'timeline') ? 'zlog' : `zlog/${subTab}`;
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', `#${targetHash}`);
      } else {
        window.location.hash = targetHash;
      }
    } catch (e) {}
  }
  renderZLogPage(subTab);
}

/* --------------------------------------------------------------------------
   Structured Note Formatting: Converts raw blobs into scannable micro-events
   -------------------------------------------------------------------------- */
function formatStructuredNotes(rawNotes, entryDate) {
  if (!rawNotes || !rawNotes.trim()) {
    return `<div class="zlog-entry-narrative"><em style="color: var(--text-muted);">No narrative written for this day.</em></div>`;
  }

  // 1. Separate school/teacher notes if present
  let homePart = rawNotes;
  let schoolPart = null;

  const schoolMarker = '🏫 School / Teacher Notes:';
  const schoolIdx = rawNotes.indexOf(schoolMarker);
  if (schoolIdx !== -1) {
    homePart = rawNotes.substring(0, schoolIdx).trim();
    schoolPart = rawNotes.substring(schoolIdx + schoolMarker.length).trim();
  }

  // 2. Format Home narrative into chronological bullet items
  let events = [];
  if (homePart) {
    // Split primarily on semicolons or newlines
    let rawChunks = homePart.split(/[;\n]+/);

    // If only 1 chunk was found and it contains sentence periods, split on sentences
    if (rawChunks.length === 1 && rawChunks[0].includes('. ')) {
      const sentenceChunks = rawChunks[0].split(/(?<=[.!?])\s+/);
      if (sentenceChunks.length > 1) {
        rawChunks = sentenceChunks;
      }
    }

    for (let chunk of rawChunks) {
      let cleaned = chunk.trim().replace(/^[-•*●▪\s]+/, '').trim();
      if (cleaned.length > 0) {
        events.push(cleaned);
      }
    }
  }

  let homeHtml = '';
  if (events.length > 0) {
    const visibleLimit = 3;
    const hasMore = events.length > visibleLimit;
    const safeId = (entryDate ? entryDate.replace(/[^a-zA-Z0-9]/g, '_') : 'entry') + '_' + Math.random().toString(36).substring(2, 7);

    const eventItems = events.map((ev, idx) => {
      const isHidden = hasMore && idx >= visibleLimit;
      return `<div class="zlog-event-item ${isHidden ? 'zlog-ev-hidden' : ''}"><span class="zlog-ev-bullet"></span><span class="zlog-ev-text">${escapeHtml(ev)}</span></div>`;
    }).join('');

    homeHtml = `<div class="zlog-event-timeline" id="ev-list-${safeId}">${eventItems}</div>` +
      (hasMore ? `<button type="button" class="zlog-expand-notes-btn" onclick="toggleExpandNotes('ev-list-${safeId}', this)">+ Show ${events.length - visibleLimit} more events</button>` : '');
  }

  // 3. Format School / Teacher notes into dedicated callout card
  let schoolHtml = '';
  if (schoolPart) {
    // Extract Dojo score if present: e.g. "Today I earned 21 Dojo Points."
    let dojoBadge = '';
    const dojoMatch = schoolPart.match(/(?:Today\s*I\s*earned\s*|earned\s*)(?:__)?(\d+)(?:__)?\s*Dojo\s*Points/i);
    if (dojoMatch) {
      dojoBadge = `<span class="zlog-dojo-badge">🏅 ${escapeHtml(dojoMatch[1])} Dojo Points</span>`;
    }

    // Split school lines by newline or bullet characters
    const rawSchoolLines = schoolPart.split(/\n+/);
    let cleanSchoolItems = [];
    for (let line of rawSchoolLines) {
      line = line.trim();
      if (!line) continue;
      if (line.includes('●') || line.includes('•') || line.includes('▪')) {
        const parts = line.split(/[●•▪]+/).map(p => p.trim()).filter(p => p.length > 0);
        cleanSchoolItems.push(...parts);
      } else {
        cleanSchoolItems.push(line.replace(/^[-*]\s*/, '').trim());
      }
    }

    const schoolItemsHtml = cleanSchoolItems.map(item => `<div class="zlog-school-item"><span class="zlog-school-bullet">▪</span><span class="zlog-school-text">${escapeHtml(item)}</span></div>`).join('');

    schoolHtml = `<div class="zlog-school-callout"><div class="zlog-school-callout-header"><span class="zlog-school-tag">🏫 School / Teacher Note</span>${dojoBadge}</div><div class="zlog-school-callout-body">${schoolItemsHtml}</div></div>`;
  }

  return `<div class="zlog-entry-narrative">${homeHtml}${schoolHtml}</div>`;
}

function toggleExpandNotes(containerId, btnEl) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const isExpanded = container.classList.contains('is-expanded');
  if (isExpanded) {
    container.classList.remove('is-expanded');
    const hiddenCount = container.querySelectorAll('.zlog-ev-hidden').length;
    btnEl.innerHTML = `+ Show ${hiddenCount} more events`;
  } else {
    container.classList.add('is-expanded');
    btnEl.innerHTML = `&minus; Show fewer events`;
  }
}

/* --------------------------------------------------------------------------
   Month Navigation & Accordion Controls
   -------------------------------------------------------------------------- */
function toggleMonthAccordion(monthKey) {
  zlogExpandedMonths[monthKey] = !zlogExpandedMonths[monthKey];
  const header = document.getElementById('month-header-' + monthKey);
  const body = document.getElementById('month-body-' + monthKey);
  const pill = document.getElementById('jump-pill-' + monthKey);

  if (header && body) {
    if (zlogExpandedMonths[monthKey]) {
      header.classList.add('expanded');
      body.classList.add('open');
      if (pill) pill.classList.add('active');
    } else {
      header.classList.remove('expanded');
      body.classList.remove('open');
      if (pill) pill.classList.remove('active');
    }
  } else {
    renderZLogTimeline();
  }
}

function jumpToMonth(monthKey) {
  const parts = monthKey.split('-');
  const yr = parts[0];
  if (zlogPeriodFilter !== 'all' && zlogPeriodFilter !== yr) {
    zlogPeriodFilter = yr;
  }
  zlogExpandedMonths[monthKey] = true;
  renderZLogTimeline();
  setTimeout(() => {
    const groupEl = document.getElementById('month-group-' + monthKey);
    if (groupEl) {
      groupEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 60);
}

function expandAllMonths() {
  const headers = document.querySelectorAll('.zlog-month-header');
  const bodies = document.querySelectorAll('.zlog-month-body');
  const pills = document.querySelectorAll('.zlog-month-chip, .zlog-jump-pill');

  headers.forEach(h => h.classList.add('expanded'));
  bodies.forEach(b => {
    b.classList.add('open');
    const key = b.id.replace('month-body-', '');
    zlogExpandedMonths[key] = true;
  });
  pills.forEach(p => p.classList.add('active'));
}

function collapseAllMonths() {
  const headers = document.querySelectorAll('.zlog-month-header');
  const bodies = document.querySelectorAll('.zlog-month-body');
  const pills = document.querySelectorAll('.zlog-month-chip, .zlog-jump-pill');

  headers.forEach(h => h.classList.remove('expanded'));
  bodies.forEach(b => {
    b.classList.remove('open');
    const key = b.id.replace('month-body-', '');
    zlogExpandedMonths[key] = false;
  });
  pills.forEach(p => p.classList.remove('active'));
}

/* --------------------------------------------------------------------------
   Sub-Tab 1: Behavior Timeline & Log Archive (Grouped by Month/Year)
   -------------------------------------------------------------------------- */
function renderZLogTimeline() {
  const container = document.getElementById('zlog-subview-container');
  if (!container) return;

  const allEntries = storage.getAllZLogEntries();

  // Year counts
  const count2026 = allEntries.filter(e => e.date.startsWith('2026')).length;
  const count2025 = allEntries.filter(e => e.date.startsWith('2025')).length;
  const count2024 = allEntries.filter(e => e.date.startsWith('2024')).length;

  // Apply filters
  const filtered = allEntries.filter(entry => {
    // Year filter
    if (zlogPeriodFilter !== 'all') {
      if (!entry.date.startsWith(zlogPeriodFilter)) return false;
    }

    // Rating filter
    if (zlogRatingFilter !== 'all') {
      if (Number(entry.rating) !== Number(zlogRatingFilter)) return false;
    }
    // Aggression filter
    if (zlogAggressionFilter && !entry.aggression) {
      return false;
    }
    // Keyword search
    if (zlogSearchQuery.trim()) {
      const q = zlogSearchQuery.toLowerCase();
      const text = `${entry.date} ${entry.notes || ''} ${entry.ratingRaw || ''}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });

  // Group filtered entries by Month (YYYY-MM)
  const monthMap = {};
  const monthKeysOrder = [];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const shortMonthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  filtered.forEach(entry => {
    const key = entry.date.slice(0, 7); // e.g. "2026-09"
    if (!monthMap[key]) {
      const parts = key.split('-');
      const yStr = parts[0];
      const mNum = parseInt(parts[1], 10);
      const mIdx = mNum - 1;
      monthMap[key] = {
        key: key,
        year: yStr,
        month: parts[1],
        shortMonth: shortMonthNames[mIdx] || parts[1],
        label: `${monthNames[mIdx] || parts[1]} ${yStr}`,
        shortLabel: `${shortMonthNames[mIdx] || parts[1]} '${yStr.slice(2)}`,
        entries: [],
        goodCount: 0,
        aggressionCount: 0,
        totalCount: 0
      };
      monthKeysOrder.push(key);
    }
    monthMap[key].entries.push(entry);
    monthMap[key].totalCount++;
    if (Number(entry.rating) >= 4) {
      monthMap[key].goodCount++;
    }
    if (entry.aggression) {
      monthMap[key].aggressionCount++;
    }
  });

  const monthGroups = monthKeysOrder.map(k => monthMap[k]);

  // Group month groups by year for the jump bar
  const yearGroups = {};
  monthGroups.forEach(mg => {
    if (!yearGroups[mg.year]) yearGroups[mg.year] = [];
    yearGroups[mg.year].push(mg);
  });
  const sortedYears = Object.keys(yearGroups).sort().reverse();

  // Expansion logic:
  // If search query or rating/aggression filter is active, auto-expand all months with matches
  const hasActiveFilterOrSearch = !!zlogSearchQuery.trim() || zlogRatingFilter !== 'all' || zlogAggressionFilter;
  if (hasActiveFilterOrSearch) {
    monthGroups.forEach(mg => {
      zlogExpandedMonths[mg.key] = true;
    });
  } else if (Object.keys(zlogExpandedMonths).length === 0 && monthGroups.length > 0) {
    // Default newest month to expanded
    zlogExpandedMonths[monthGroups[0].key] = true;
  }

  // 12 Months: Jan to Dec matrix across years 2026, 2025, 2024
  const allMonthShorts = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const allMonthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Map counts across all entries for all years
  const allEntriesMonthMap = {};
  allEntries.forEach(e => {
    const key = e.date.slice(0, 7);
    allEntriesMonthMap[key] = (allEntriesMonthMap[key] || 0) + 1;
  });

  const now = new Date();
  const currentY = now.getFullYear(); // 2026
  const currentM = now.getMonth(); // Current month index

  // Option 1: Clean Dual Dropdowns (Year Filter + Jump to Month)
  const candidateYears = (zlogPeriodFilter === 'all') 
    ? sortedYears 
    : [zlogPeriodFilter];

  const monthOptionsList = [];
  candidateYears.forEach(yr => {
    for (let m = 12; m >= 1; m--) {
      const mStr = String(m).padStart(2, '0');
      const mKey = `${yr}-${mStr}`;
      const count = allEntriesMonthMap[mKey] || 0;
      if (count > 0) {
        const isCurrent = (Number(yr) === currentY && (m - 1) === currentM);
        const label = (zlogPeriodFilter === 'all') 
          ? `${allMonthShorts[m - 1]} '${yr.slice(2)}` 
          : allMonthNames[m - 1];

        monthOptionsList.push(`
          <option value="${mKey}">
            ${label} (${count})${isCurrent ? ' • Current' : ''}
          </option>
        `);
      }
    }
  });

  // Render Dual Dropdown Controls (Option 1)
  const jumpBarHtml = `
    <div class="zlog-month-nav-card zlog-dual-dropdown-card">
      <div class="zlog-dropdown-controls">
        <div class="zlog-dropdown-item">
          <label class="zlog-dropdown-label" for="zlog-year-picker">Year:</label>
          <select class="zlog-picker-select" id="zlog-year-picker" onchange="setZLogPeriodFilter(this.value)">
            <option value="all" ${zlogPeriodFilter === 'all' ? 'selected' : ''}>All (${allEntries.length})</option>
            <option value="2026" ${zlogPeriodFilter === '2026' ? 'selected' : ''}>2026 (${count2026})</option>
            <option value="2025" ${zlogPeriodFilter === '2025' ? 'selected' : ''}>2025 (${count2025})</option>
            <option value="2024" ${zlogPeriodFilter === '2024' ? 'selected' : ''}>2024 (${count2024})</option>
          </select>
        </div>

        <div class="zlog-dropdown-item">
          <label class="zlog-dropdown-label" for="zlog-month-picker">Month:</label>
          <select class="zlog-picker-select" id="zlog-month-picker" onchange="if(this.value) jumpToMonth(this.value)">
            <option value="" disabled selected>Month...</option>
            ${monthOptionsList.join('')}
          </select>
        </div>
      </div>

      <div class="zlog-nav-actions">
        <button type="button" class="zlog-nav-action-btn" onclick="expandAllMonths()" title="Expand all month accordions">
          Expand
        </button>
        <button type="button" class="zlog-nav-action-btn" onclick="collapseAllMonths()" title="Collapse all month accordions">
          Collapse
        </button>
      </div>
    </div>
  `;

  container.innerHTML = `
    <!-- Search Toolbar -->
    <div class="zlog-toolbar" style="margin-bottom: 12px;">
      <div class="zlog-search-row">
        <i data-lucide="search" style="width: 16px; height: 16px; color: var(--primary);"></i>
        <input 
          type="text" 
          class="zlog-search-input" 
          id="zlog-search-box"
          placeholder="Search logs (e.g. camp, calming, sleep study, arcade, LEGO, dinner, Dojo, Emily)..." 
          value="${escapeHtml(zlogSearchQuery)}"
          oninput="onZLogSearch(this.value)"
        >
        ${zlogSearchQuery ? `
          <button class="icon-btn" onclick="clearZLogSearch()" style="width: 24px; height: 24px;">
            <i data-lucide="x" style="width: 14px; height: 14px;"></i>
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Quick Month Jump Bar (Option 2) -->
    ${jumpBarHtml}

    <!-- Timeline Entries Grouped By Month -->
    <div class="zlog-timeline-list">
      ${filtered.length === 0 ? `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
          <i data-lucide="inbox" style="width: 32px; height: 32px; margin-bottom: 8px; opacity: 0.5;"></i>
          <p style="font-weight: 600; font-size: 0.9rem;">No matching entries found</p>
          <p style="font-size: 0.78rem; margin-top: 4px;">Try clearing filters or search query.</p>
        </div>
      ` : monthGroups.map(group => {
        const isExpanded = !!zlogExpandedMonths[group.key];
        const goodPct = group.totalCount > 0 ? Math.round((group.goodCount / group.totalCount) * 100) : 0;

        return `
          <div class="zlog-month-group" id="month-group-${group.key}">
            <div 
              class="zlog-month-header ${isExpanded ? 'expanded' : ''}" 
              id="month-header-${group.key}" 
              onclick="toggleMonthAccordion('${group.key}')"
              role="button"
              tabindex="0"
            >
              <div class="zlog-month-title-area">
                <i data-lucide="chevron-down" class="zlog-month-chevron"></i>
                <span class="zlog-month-title">${group.label}</span>
                <span class="zlog-month-badge">${group.totalCount} ${group.totalCount === 1 ? 'entry' : 'entries'}</span>
              </div>

              <div class="zlog-month-meta">
                <div class="zlog-month-stats">
                  <span style="color: #4E8765; font-weight: 600;">${goodPct}% Good</span>
                  ${group.aggressionCount > 0 ? `
                    <span style="border-left: 1px solid var(--border-light); height: 12px; margin: 0 4px;"></span>
                    <span style="color: #E06D53; font-weight: 700;">⚡ ${group.aggressionCount} Aggression</span>
                  ` : ''}
                </div>
                <button 
                  type="button" 
                  class="btn btn-secondary" 
                  onclick="event.stopPropagation(); openMonthInCalendar('${group.key}')" 
                  title="Open ${group.label} in Monthly Calendar" 
                  style="font-size: 0.70rem; padding: 2px 7px; margin-left: 6px;"
                >
                  <i data-lucide="calendar" style="width: 12px; height: 12px;"></i>
                  <span>Calendar</span>
                </button>
              </div>
            </div>

            <div class="zlog-month-body ${isExpanded ? 'open' : ''}" id="month-body-${group.key}">
              ${group.entries.map(entry => renderZLogEntryCard(entry)).join('')}
            </div>
          </div>
        `;
      }).join('')}

      ${filtered.length > 0 ? `
        <div style="text-align: center; padding: 1.5rem 0; font-size: 0.78rem; color: var(--text-muted);">
          ✓ Showing all ${filtered.length} entries organized across ${monthGroups.length} month groups
        </div>
      ` : ''}
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderZLogEntryCard(entry) {
  const ratingMeta = (entry.rating && typeof ZLOG_RATINGS !== 'undefined') ? ZLOG_RATINGS[entry.rating] : null;
  const meds = entry.meds || {};

  // Formatted date string
  let dateFormatted = entry.date;
  try {
    const d = parseDateIso(entry.date);
    dateFormatted = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {}

  // Build condensed medication chip
  const medParts = [];
  if (meds.z) medParts.push(`Z: ${escapeHtml(String(meds.zDose || '75mg'))}`);
  if (meds.g) medParts.push(`G: ${escapeHtml(String(meds.gDose || '2mg'))}`);
  if (meds.rit) medParts.push(`Rit: ${escapeHtml(String(meds.ritDose || (typeof meds.rit === 'string' ? meds.rit : '5mg')))}`);
  if (meds.mag) medParts.push(`Mag${meds.magDose ? `: ${escapeHtml(String(meds.magDose))}` : ''}`);
  if (meds.mel) medParts.push(`Mel${meds.melDose ? `: ${escapeHtml(String(meds.melDose))}` : ''}`);
  if (meds.ris) medParts.push(`Ris${meds.risDose ? `: ${escapeHtml(String(meds.risDose))}` : ''}`);

  const medsHtml = medParts.length > 0 ? `
    <span class="zlog-condensed-meds" title="Active Medications: ${medParts.join(', ')}">
      <span class="zlog-med-pill-icon">💊</span>
      <span>${medParts.join(' • ')}</span>
    </span>
  ` : '';

  return `
    <div class="zlog-entry-card ${entry.aggression ? 'has-aggression' : ''}">
      <div class="zlog-entry-card-header">
        <div class="zlog-entry-header-left">
          <span class="zlog-entry-date">${dateFormatted}</span>

          ${ratingMeta ? `
            <span class="zlog-rating-pill level-${ratingMeta.level}">
              <span>${ratingMeta.emoji}</span>
              <span>${ratingMeta.label}</span>
            </span>
          ` : (entry.ratingRaw ? `<span class="zlog-rating-pill" style="background: var(--bg-surface);">${escapeHtml(entry.ratingRaw)}</span>` : `
            <button type="button" class="zlog-rating-pill unrated" onclick="openZLogEntryModal('${entry.date}')" title="Click to rate this day">
              <span>⚪</span>
              <span>Unrated</span>
            </button>
          `)}

          ${entry.aggression ? `
            <span class="zlog-aggression-pill">⚠️ Aggression Reported</span>
          ` : ''}

          ${medsHtml}
        </div>

        <div class="zlog-entry-header-actions">
          <button type="button" class="btn btn-secondary zlog-entry-edit-btn" onclick="openZLogEntryModal('${entry.date}')" title="Edit entry for ${dateFormatted}">
            <i data-lucide="edit-3" style="width: 12px; height: 12px;"></i>
            <span>Edit</span>
          </button>
        </div>
      </div>

      <!-- Structured Narrative Content -->
      ${formatStructuredNotes(entry.notes, entry.date)}
    </div>
  `;
}

function onZLogSearch(query) {
  zlogSearchQuery = query;
  renderZLogTimeline();
}

function clearZLogSearch() {
  zlogSearchQuery = '';
  renderZLogTimeline();
}

function setZLogPeriodFilter(period) {
  zlogPeriodFilter = period;
  renderZLogTimeline();
}

function setZLogRatingFilter(rating) {
  zlogRatingFilter = rating;
  renderZLogTimeline();
}

function toggleZLogAggressionFilter() {
  zlogAggressionFilter = !zlogAggressionFilter;
  renderZLogTimeline();
}

function loadMoreZLogEntries() {
  renderZLogTimeline();
}

/* --------------------------------------------------------------------------
   Sub-Tab 2: Monthly Calendar showing Day Ratings
   -------------------------------------------------------------------------- */
function openMonthInCalendar(monthKey) {
  if (monthKey && monthKey.includes('-')) {
    const parts = monthKey.split('-');
    zlogCalendarYear = parseInt(parts[0], 10);
    zlogCalendarMonth = parseInt(parts[1], 10);
    try {
      localStorage.setItem('BOL_ZLOG_CAL_YEAR', zlogCalendarYear);
      localStorage.setItem('BOL_ZLOG_CAL_MONTH', zlogCalendarMonth);
    } catch (e) {}
  }
  switchZLogSubTab('calendar');
}

function navigateZLogCalendarMonth(delta) {
  let m = zlogCalendarMonth + delta;
  let y = zlogCalendarYear;
  if (m > 12) {
    m = 1;
    y++;
  } else if (m < 1) {
    m = 12;
    y--;
  }
  zlogCalendarMonth = m;
  zlogCalendarYear = y;
  try {
    localStorage.setItem('BOL_ZLOG_CAL_YEAR', zlogCalendarYear);
    localStorage.setItem('BOL_ZLOG_CAL_MONTH', zlogCalendarMonth);
  } catch (e) {}
  renderZLogCalendar();
}

function jumpZLogCalendarToday() {
  const now = new Date();
  zlogCalendarYear = now.getFullYear();
  zlogCalendarMonth = now.getMonth() + 1;
  try {
    localStorage.setItem('BOL_ZLOG_CAL_YEAR', zlogCalendarYear);
    localStorage.setItem('BOL_ZLOG_CAL_MONTH', zlogCalendarMonth);
  } catch (e) {}
  renderZLogCalendar();
}

function setZLogCalendarMonth(m) {
  zlogCalendarMonth = parseInt(m, 10);
  try { localStorage.setItem('BOL_ZLOG_CAL_MONTH', zlogCalendarMonth); } catch (e) {}
  renderZLogCalendar();
}

function setZLogCalendarYear(y) {
  zlogCalendarYear = parseInt(y, 10);
  try { localStorage.setItem('BOL_ZLOG_CAL_YEAR', zlogCalendarYear); } catch (e) {}
  renderZLogCalendar();
}

function setZLogCalendarFilter(filterVal) {
  if (['1', '2', '3', '4', '5'].includes(String(filterVal))) {
    zlogCalendarRatingFilter = parseInt(filterVal, 10);
  } else {
    zlogCalendarRatingFilter = filterVal;
  }
  try { localStorage.setItem('BOL_ZLOG_CAL_FILTER', zlogCalendarRatingFilter); } catch (e) {}
  renderZLogCalendar();
}

function renderZLogCalendar() {
  const container = document.getElementById('zlog-subview-container');
  if (!container) return;

  const now = new Date();
  const currentY = now.getFullYear();
  const currentM = now.getMonth() + 1;
  const todayIso = (typeof formatDateIso === 'function') ? formatDateIso(now) : now.toISOString().split('T')[0];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const shortMonthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const year = zlogCalendarYear;
  const month = zlogCalendarMonth;
  const monthKey = `${year}-${String(month).padStart(2, '0')}`;
  const monthLabel = `${monthNames[month - 1]} ${year}`;

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  const prevMonthDays = new Date(year, month - 1, 0).getDate();

  // Aggregate stats for this month
  let count5 = 0;
  let count4 = 0;
  let count3 = 0;
  let count2 = 0;
  let count1 = 0;
  let countUnrated = 0;
  let countAggression = 0;
  let totalRatingSum = 0;
  let totalRatedDays = 0;
  let totalDaysWithData = 0;

  const monthEntriesByDay = {};

  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const entry = storage.getZLogEntry(dStr);
    monthEntriesByDay[d] = { dateStr: dStr, entry: entry };

    const hasNotes = !!(entry.notes && entry.notes.trim());
    const hasMeds = entry.meds && (entry.meds.z || entry.meds.g || entry.meds.rit || entry.meds.mag || entry.meds.mel || entry.meds.ris);
    const hasRating = !!entry.rating;

    if (hasRating || hasNotes || hasMeds) {
      totalDaysWithData++;
    }

    if (entry.rating) {
      const r = Number(entry.rating);
      totalRatedDays++;
      totalRatingSum += r;
      if (r === 5) count5++;
      else if (r === 4) count4++;
      else if (r === 3) count3++;
      else if (r === 2) count2++;
      else if (r === 1) count1++;
    } else {
      countUnrated++;
    }

    if (entry.aggression) {
      countAggression++;
    }
  }

  const goodDaysCount = count5 + count4;
  const avgRating = totalRatedDays > 0 ? (totalRatingSum / totalRatedDays).toFixed(1) : '—';
  const percentGood = totalRatedDays > 0 ? Math.round((goodDaysCount / totalRatedDays) * 100) : 0;
  const percentAgg = totalDaysWithData > 0 ? Math.round((countAggression / totalDaysWithData) * 100) : 0;

  // Spectrum widths (% of days in month)
  const pct5 = Math.round((count5 / daysInMonth) * 100);
  const pct4 = Math.round((count4 / daysInMonth) * 100);
  const pct3 = Math.round((count3 / daysInMonth) * 100);
  const pct2 = Math.round((count2 / daysInMonth) * 100);
  const pct1 = Math.round((count1 / daysInMonth) * 100);
  const pctUnrated = Math.max(0, 100 - (pct5 + pct4 + pct3 + pct2 + pct1));

  // Available years list (e.g. 2026, 2025, 2024)
  const availableYears = [2026, 2025, 2024];
  if (!availableYears.includes(year)) availableYears.push(year);
  availableYears.sort().reverse();

  // Days grid construction:
  // 1. Previous month trailing days
  let gridHtml = '';
  for (let i = 0; i < firstDayOfWeek; i++) {
    const prevDayNum = prevMonthDays - firstDayOfWeek + 1 + i;
    gridHtml += `
      <div class="zlog-cal-day other-month">
        <div class="zlog-cal-day-top">
          <span class="zlog-cal-day-num">${prevDayNum}</span>
        </div>
      </div>
    `;
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dayData = monthEntriesByDay[d];
    const dStr = dayData.dateStr;
    const entry = dayData.entry;
    const isToday = (dStr === todayIso);
    const ratingMeta = entry.rating ? ZLOG_RATINGS[entry.rating] : null;

    // Filter match check
    let matchesFilter = true;
    if (zlogCalendarRatingFilter !== 'all') {
      if (zlogCalendarRatingFilter === 'aggression') {
        matchesFilter = !!entry.aggression;
      } else if (zlogCalendarRatingFilter === 'unrated') {
        matchesFilter = !entry.rating;
      } else if (zlogCalendarRatingFilter === 'good') {
        matchesFilter = Number(entry.rating) >= 4;
      } else {
        matchesFilter = (Number(entry.rating) === Number(zlogCalendarRatingFilter));
      }
    }

    const levelClass = entry.rating ? `level-${entry.rating}` : 'unrated';
    const aggClass = entry.aggression ? 'has-aggression' : '';
    const todayClass = isToday ? 'today' : '';
    const dimmedClass = !matchesFilter ? 'dimmed' : '';

    // Active Meds preview
    const meds = entry.meds || {};
    let medsHtml = '';
    const medTags = [];
    if (meds.z) medTags.push(`<span class="zlog-cal-med-tag med-z" title="Zoloft (${escapeHtml(String(meds.zDose || '75mg'))})">Z</span>`);
    if (meds.g) medTags.push(`<span class="zlog-cal-med-tag med-g" title="Guanfacine (${escapeHtml(String(meds.gDose || '2mg'))})">G</span>`);
    if (meds.rit) medTags.push(`<span class="zlog-cal-med-tag med-rit" title="Ritalin (${escapeHtml(String(meds.ritDose || '15+10'))})">Rit</span>`);
    if (meds.ris) medTags.push(`<span class="zlog-cal-med-tag med-ris" title="Risperidone (${escapeHtml(String(meds.risDose || '0.25mg'))})">Ris</span>`);
    if (meds.mag) medTags.push(`<span class="zlog-cal-med-tag" title="Magnesium">Mag</span>`);
    if (meds.mel) medTags.push(`<span class="zlog-cal-med-tag" title="Melatonin">Mel</span>`);

    if (medTags.length > 0) {
      medsHtml = `<div class="zlog-cal-meds-strip">${medTags.join('')}</div>`;
    }

    // Clean notes snippet
    let notesPreview = '';
    if (entry.notes && entry.notes.trim()) {
      const cleanNote = entry.notes.trim().replace(/^[-•*●▪\s]+/, '');
      notesPreview = `<div class="zlog-cal-notes-preview" title="${escapeHtml(entry.notes)}">${escapeHtml(cleanNote)}</div>`;
    }

    gridHtml += `
      <div 
        class="zlog-cal-day ${levelClass} ${aggClass} ${todayClass} ${dimmedClass}"
        onclick="openZLogEntryModal('${dStr}')"
        title="Click to view or edit ${dStr}${entry.rating ? ' (' + ratingMeta.label + ')' : ''}"
        role="button"
        tabindex="0"
      >
        <div class="zlog-cal-day-top">
          <span class="zlog-cal-day-num">${d}</span>
          <div style="display: flex; align-items: center; gap: 3px;">
            ${isToday ? `<span class="zlog-cal-today-badge">Today</span>` : ''}
            ${entry.aggression ? `<span class="zlog-cal-agg-icon" title="Aggression Reported">⚡</span>` : ''}
          </div>
        </div>

        ${ratingMeta ? `
          <div class="zlog-cal-rating-pill level-${entry.rating}">
            <span>${ratingMeta.emoji}</span>
            <span>${ratingMeta.shortLabel}</span>
            <span class="rating-score">${entry.rating}★</span>
          </div>
        ` : `
          <div class="zlog-cal-rating-pill unrated">
            <span>⚪</span>
            <span>Unrated</span>
          </div>
        `}

        ${entry.aggression ? `
          <div class="zlog-cal-agg-strip">
            <span>⚡ Aggression</span>
          </div>
        ` : ''}

        ${medsHtml}
        ${notesPreview}
      </div>
    `;
  }

  // 3. Next month leading days to round out the 7-col grid
  const totalCells = firstDayOfWeek + daysInMonth;
  const nextMonthCells = (totalCells % 7 === 0) ? 0 : (7 - (totalCells % 7));
  for (let n = 1; n <= nextMonthCells; n++) {
    gridHtml += `
      <div class="zlog-cal-day other-month">
        <div class="zlog-cal-day-top">
          <span class="zlog-cal-day-num">${n}</span>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="zlog-calendar-container">
      <!-- Calendar Controls Header -->
      <div class="zlog-cal-header-card">
        <div class="zlog-cal-top-bar">
          <div class="zlog-cal-nav-group">
            <button type="button" class="zlog-cal-nav-btn" onclick="navigateZLogCalendarMonth(-1)" title="Previous Month">
              <i data-lucide="chevron-left" style="width: 16px; height: 16px;"></i>
            </button>
            <div class="zlog-cal-title-wrap">
              <span class="zlog-cal-month-title">${monthLabel}</span>
              ${(year !== currentY || month !== currentM) ? `
                <button type="button" class="zlog-cal-today-btn" onclick="jumpZLogCalendarToday()" title="Jump to Current Month">
                  Current Month
                </button>
              ` : `
                <span class="zlog-badge-tag" style="font-size: 0.64rem;">Current Month</span>
              `}
            </div>
            <button type="button" class="zlog-cal-nav-btn" onclick="navigateZLogCalendarMonth(1)" title="Next Month">
              <i data-lucide="chevron-right" style="width: 16px; height: 16px;"></i>
            </button>
          </div>

          <!-- Selectors and Actions -->
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <div class="zlog-cal-selectors">
              <select class="zlog-cal-select" onchange="setZLogCalendarMonth(this.value)" title="Select Month">
                ${monthNames.map((mName, idx) => `
                  <option value="${idx + 1}" ${(idx + 1 === month) ? 'selected' : ''}>${mName}</option>
                `).join('')}
              </select>

              <select class="zlog-cal-select" onchange="setZLogCalendarYear(this.value)" title="Select Year">
                ${availableYears.map(y => `
                  <option value="${y}" ${(y === year) ? 'selected' : ''}>${y}</option>
                `).join('')}
              </select>
            </div>

            <button type="button" class="btn btn-secondary" onclick="switchZLogSubTab('timeline')" style="font-size: 0.76rem; padding: 5px 10px;" title="Switch to chronological timeline">
              <i data-lucide="list" style="width: 13px; height: 13px;"></i>
              <span>Timeline View</span>
            </button>
            <button type="button" class="btn btn-primary" onclick="openZLogEntryModal()" style="font-size: 0.76rem; padding: 5px 12px;" title="Log day entry">
              <i data-lucide="plus" style="width: 13px; height: 13px;"></i>
              <span>Log Day</span>
            </button>

            <select class="zlog-cal-select zlog-cal-filter-select ${zlogCalendarRatingFilter !== 'all' ? 'is-filtered' : ''}" onchange="setZLogCalendarFilter(this.value)" title="Filter by Day Rating">
              <option value="all" ${zlogCalendarRatingFilter === 'all' ? 'selected' : ''}>Filter: All Days (${daysInMonth})</option>
              <option value="5" ${(zlogCalendarRatingFilter === 5 || zlogCalendarRatingFilter === '5') ? 'selected' : ''}>🌟 Great (5) (${count5})</option>
              <option value="4" ${(zlogCalendarRatingFilter === 4 || zlogCalendarRatingFilter === '4') ? 'selected' : ''}>🟢 Good (4) (${count4})</option>
              <option value="3" ${(zlogCalendarRatingFilter === 3 || zlogCalendarRatingFilter === '3') ? 'selected' : ''}>🌊 Almost Good (3) (${count3})</option>
              <option value="2" ${(zlogCalendarRatingFilter === 2 || zlogCalendarRatingFilter === '2') ? 'selected' : ''}>🟠 Difficult (2) (${count2})</option>
              <option value="1" ${(zlogCalendarRatingFilter === 1 || zlogCalendarRatingFilter === '1') ? 'selected' : ''}>🔴 Rough (1) (${count1})</option>
              <option value="aggression" ${zlogCalendarRatingFilter === 'aggression' ? 'selected' : ''}>⚡ Aggression (${countAggression})</option>
              ${countUnrated > 0 ? `
                <option value="unrated" ${zlogCalendarRatingFilter === 'unrated' ? 'selected' : ''}>⚪ Unrated (${countUnrated})</option>
              ` : ''}
            </select>
          </div>
        </div>
      </div>

      <!-- Month KPIs Strip -->
      <div class="zlog-cal-kpi-row">
        <div class="zlog-cal-kpi-card" style="border-left: 3px solid #7C5CFC;">
          <div class="zlog-cal-kpi-label">Monthly Average Rating</div>
          <div class="zlog-cal-kpi-val" style="color: #7C5CFC;">
            ${avgRating} <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted);">/ 5</span>
          </div>
          <div class="zlog-cal-kpi-sub">${totalRatedDays} rated of ${daysInMonth} days</div>
        </div>

        <div class="zlog-cal-kpi-card" style="border-left: 3px solid #10B981;">
          <div class="zlog-cal-kpi-label">Good Days (≥ 4)</div>
          <div class="zlog-cal-kpi-val" style="color: #10B981;">${percentGood}%</div>
          <div class="zlog-cal-kpi-sub">${goodDaysCount} good or great days</div>
        </div>

        <div class="zlog-cal-kpi-card" style="border-left: 3px solid ${countAggression > 0 ? '#DC2626' : 'var(--border-light)'};">
          <div class="zlog-cal-kpi-label">Aggression Incidents</div>
          <div class="zlog-cal-kpi-val" style="color: ${countAggression > 0 ? '#DC2626' : 'var(--text-primary)'};">
            ${countAggression}
          </div>
          <div class="zlog-cal-kpi-sub">${percentAgg}% of logged days</div>
        </div>

        <div class="zlog-cal-kpi-card" style="border-left: 3px solid #0284C7;">
          <div class="zlog-cal-kpi-label">Month Logging Coverage</div>
          <div class="zlog-cal-kpi-val" style="color: #0284C7;">
            ${totalDaysWithData} <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted);">/ ${daysInMonth}d</span>
          </div>
          <div class="zlog-cal-kpi-sub">${Math.round((totalDaysWithData / daysInMonth) * 100)}% days recorded</div>
        </div>
      </div>

      <!-- Rating Spectrum Bar -->
      <div class="zlog-cal-spectrum-card">
        <div class="zlog-cal-spectrum-header">
          <span>Day Rating Distribution (${monthLabel})</span>
          <span style="font-family: var(--font-mono); font-size: 0.70rem;">
            🌟 ${count5} &middot; 🟢 ${count4} &middot; 🟡 ${count3} &middot; 🟠 ${count2} &middot; 🔴 ${count1}
          </span>
        </div>
        <div class="zlog-cal-spectrum-bar" title="5★: ${count5}d (${pct5}%) | 4★: ${count4}d (${pct4}%) | 3★: ${count3}d (${pct3}%) | 2★: ${count2}d (${pct2}%) | 1★: ${count1}d (${pct1}%) | Unrated: ${countUnrated}d">
          ${pct5 > 0 ? `<div class="zlog-cal-spec-seg seg-5" style="width: ${pct5}%;"></div>` : ''}
          ${pct4 > 0 ? `<div class="zlog-cal-spec-seg seg-4" style="width: ${pct4}%;"></div>` : ''}
          ${pct3 > 0 ? `<div class="zlog-cal-spec-seg seg-3" style="width: ${pct3}%;"></div>` : ''}
          ${pct2 > 0 ? `<div class="zlog-cal-spec-seg seg-2" style="width: ${pct2}%;"></div>` : ''}
          ${pct1 > 0 ? `<div class="zlog-cal-spec-seg seg-1" style="width: ${pct1}%;"></div>` : ''}
          ${pctUnrated > 0 ? `<div class="zlog-cal-spec-seg seg-unrated" style="width: ${pctUnrated}%;"></div>` : ''}
        </div>
      </div>

      <!-- Main Calendar Grid Card -->
      <div class="zlog-cal-board">
        <!-- Weekdays Header (Strict Sunday to Saturday Start) -->
        <div class="zlog-cal-weekdays">
          <div class="zlog-cal-weekday-col weekend">Sun</div>
          <div class="zlog-cal-weekday-col">Mon</div>
          <div class="zlog-cal-weekday-col">Tue</div>
          <div class="zlog-cal-weekday-col">Wed</div>
          <div class="zlog-cal-weekday-col">Thu</div>
          <div class="zlog-cal-weekday-col">Fri</div>
          <div class="zlog-cal-weekday-col weekend">Sat</div>
        </div>

        <!-- 7-Column Days Grid -->
        <div class="zlog-cal-grid">
          ${gridHtml}
        </div>
      </div>

      <!-- Rating System Legend Card -->
      <div class="zlog-cal-legend-card">
        <div class="zlog-cal-legend-title">Day Rating Levels &amp; Behavioral Key</div>
        <div class="zlog-cal-legend-grid">
          <div class="zlog-cal-legend-item">
            <span class="zlog-rating-pill level-5">🌟 Level 5</span>
            <div class="zlog-cal-legend-text">
              <strong>Great Day:</strong> <span>Peak calm, collaborative &amp; high momentum</span>
            </div>
          </div>
          <div class="zlog-cal-legend-item">
            <span class="zlog-rating-pill level-4">🟢 Level 4</span>
            <div class="zlog-cal-legend-text">
              <strong>Good Day:</strong> <span>Solid standard positive day, smooth routines</span>
            </div>
          </div>
          <div class="zlog-cal-legend-item">
            <span class="zlog-rating-pill level-3">🌊 Level 3</span>
            <div class="zlog-cal-legend-text">
              <strong>Almost Good:</strong> <span>Minor bumps or whiny, recovered well</span>
            </div>
          </div>
          <div class="zlog-cal-legend-item">
            <span class="zlog-rating-pill level-2">🟠 Level 2</span>
            <div class="zlog-cal-legend-text">
              <strong>Difficult:</strong> <span>Behavioral resistance, noticeable friction</span>
            </div>
          </div>
          <div class="zlog-cal-legend-item">
            <span class="zlog-rating-pill level-1">🔴 Level 1</span>
            <div class="zlog-cal-legend-text">
              <strong>Rough Day:</strong> <span>Severe escalation, meltdowns, or crisis</span>
            </div>
          </div>
          <div class="zlog-cal-legend-item">
            <span class="zlog-aggression-pill">⚡ Aggression</span>
            <div class="zlog-cal-legend-text">
              <strong>Meltdown / Aggression:</strong> <span>Acute physical aggression or meltdown incident reported</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

let zlogTitrationSortOrder = 'desc';
let zlogTitrationDisplayMode = 'table'; // 'table' or 'cards'
let zlogTitrationGroupBy = 'medication'; // 'medication' | 'timeline' | 'year'
let zlogTitrationMedFilter = 'all'; // 'all', 'guanfacine', 'sertraline', 'ritalin', 'risperdal'
let zlogTitrationYearFilter = 'all'; // 'all', '2026', '2025'
let zlogTitrationSearchQuery = '';

const TITRATION_MEDS_CONFIG = {
  guanfacine: {
    key: 'guanfacine',
    name: 'Guanfacine',
    fullName: 'Guanfacine XR & IR',
    color: '#7979B8',
    bgLight: 'rgba(121, 121, 184, 0.12)',
    currentDose: '2 mg XR (Active)',
    statusLabel: 'Active Prescribed',
    statusClass: 'status-active',
    statusColor: '#7979B8'
  },
  sertraline: {
    key: 'sertraline',
    name: 'Sertraline',
    fullName: 'Sertraline (Zoloft)',
    color: '#4E8765',
    bgLight: 'rgba(78, 135, 101, 0.12)',
    currentDose: '75 mg (Active)',
    statusLabel: 'Active Prescribed',
    statusClass: 'status-active',
    statusColor: '#4E8765'
  },
  ritalin: {
    key: 'ritalin',
    name: 'Ritalin',
    fullName: 'Methylphenidate (Ritalin IR)',
    color: '#7C5CFC',
    bgLight: 'rgba(124, 92, 252, 0.12)',
    currentDose: '15 mg AM + 10 mg School (Active)',
    statusLabel: 'Active Prescribed',
    statusClass: 'status-active',
    statusColor: '#7C5CFC'
  },
  risperdal: {
    key: 'risperdal',
    name: 'Risperdal',
    fullName: 'Risperdal (risperidone)',
    color: '#D97768',
    bgLight: 'rgba(217, 119, 104, 0.12)',
    currentDose: 'PRN (0 mg regular daily)',
    statusLabel: 'Discontinued regular 9/19 (PRN)',
    statusClass: 'status-prn',
    statusColor: '#94A3B8'
  }
};

function getTitrationMedKey(medName) {
  const m = (medName || '').toLowerCase();
  if (m.includes('guanfacine')) return 'guanfacine';
  if (m.includes('sertraline') || m.includes('zoloft')) return 'sertraline';
  if (m.includes('ritalin') || m.includes('methylphenidate')) return 'ritalin';
  if (m.includes('risperdal') || m.includes('risperidone')) return 'risperdal';
  return 'other';
}

function onTitrationRowActionChange(recordId, newAction) {
  if (typeof storage !== 'undefined' && typeof storage.updateTitrationEvent === 'function') {
    storage.updateTitrationEvent(recordId, { action: newAction });
  }
  renderZLogTitration();
  if (typeof showToast === 'function') showToast(`Updated Action to ${newAction}`, 'success');
}

function onTitrationRowPrescriberChange(recordId, newPrescriber) {
  if (typeof storage !== 'undefined' && typeof storage.updateTitrationEvent === 'function') {
    storage.updateTitrationEvent(recordId, { prescriber: newPrescriber });
  }
  renderZLogTitration();
  if (typeof showToast === 'function') showToast(`Updated Prescriber to ${newPrescriber}`, 'success');
}

function toggleTitrationSortOrder() {
  zlogTitrationSortOrder = (zlogTitrationSortOrder === 'desc') ? 'asc' : 'desc';
  renderZLogTitration();
}

function setTitrationDisplayMode(mode) {
  zlogTitrationDisplayMode = mode;
  renderZLogTitration();
}

function setTitrationGroupBy(mode) {
  zlogTitrationGroupBy = mode;
  renderZLogTitration();
}

function setTitrationMedFilter(medKey) {
  zlogTitrationMedFilter = (zlogTitrationMedFilter === medKey) ? 'all' : medKey;
  renderZLogTitration();
}

function setTitrationYearFilter(year) {
  zlogTitrationYearFilter = (zlogTitrationYearFilter === year) ? 'all' : year;
  renderZLogTitration();
}

function setTitrationSearchQuery(q) {
  zlogTitrationSearchQuery = q;
  renderZLogTitration();
  const input = document.getElementById('zlog-titration-search-box');
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

let zlogTitrationAllNotesOpen = false;

function toggleTitrationNote(drawerId, btnEl) {
  const el = document.getElementById(drawerId);
  if (!el) return;
  const isHidden = (el.style.display === 'none' || !el.style.display);
  el.style.display = isHidden ? (el.tagName === 'TR' ? 'table-row' : 'block') : 'none';
  if (btnEl) {
    btnEl.classList.toggle('active', isHidden);
  }
}

function toggleAllTitrationNotes() {
  zlogTitrationAllNotesOpen = !zlogTitrationAllNotesOpen;
  document.querySelectorAll('.zlog-titration-note-drawer-target').forEach(el => {
    el.style.display = zlogTitrationAllNotesOpen ? (el.tagName === 'TR' ? 'table-row' : 'block') : 'none';
  });
  document.querySelectorAll('.zlog-note-btn').forEach(btn => {
    btn.classList.toggle('active', zlogTitrationAllNotesOpen);
  });
  const label = document.getElementById('zlog-toggle-all-notes-btn-text');
  if (label) {
    label.textContent = zlogTitrationAllNotesOpen ? 'Hide All Notes' : 'Expand All Notes';
  }
}

function clearTitrationSearch() {
  zlogTitrationSearchQuery = '';
  renderZLogTitration();
}

function sortTitrationRecords(records, order = 'desc') {
  return [...records].sort((a, b) => {
    const dComp = (b.date || '').localeCompare(a.date || '');
    if (dComp !== 0) return (order === 'desc') ? dComp : -dComp;
    const idA = parseInt((a.id || '').replace(/\D/g, ''), 10) || 0;
    const idB = parseInt((b.id || '').replace(/\D/g, ''), 10) || 0;
    return (order === 'desc') ? (idB - idA) : (idA - idB);
  });
}

function renderTitrationActionSelect(record) {
  let actionClassSuffix = 'started';
  const a = (record.action || '').toLowerCase();
  if (a.includes('increase')) actionClassSuffix = 'increased';
  else if (a.includes('decrease') || a.includes('drop')) actionClassSuffix = 'decreased';
  else if (a.includes('change')) actionClassSuffix = 'changed';
  else if (a.includes('stop')) actionClassSuffix = 'stopped';

  return `
    <select class="zlog-table-select action-${actionClassSuffix}" onchange="onTitrationRowActionChange('${record.id}', this.value)" title="Change Action for ${escapeHtml(record.medication)} (${record.date})">
      <option value="Started" ${record.action === 'Started' ? 'selected' : ''}>✨ Started</option>
      <option value="Increased" ${record.action === 'Increased' ? 'selected' : ''}>▲ Increased</option>
      <option value="Decreased" ${record.action === 'Decreased' ? 'selected' : ''}>▼ Decreased</option>
      <option value="Changed" ${record.action === 'Changed' ? 'selected' : ''}>🔄 Changed</option>
      <option value="Stopped" ${record.action === 'Stopped' ? 'selected' : ''}>⏹ Stopped</option>
    </select>
  `;
}

function renderTitrationPrescriberSelect(record) {
  return `
    <select class="zlog-table-select prescriber-select" onchange="onTitrationRowPrescriberChange('${record.id}', this.value)" title="Prescriber">
      <option value="Dr Barness" ${record.prescriber && record.prescriber.includes('Barness') ? 'selected' : ''}>Dr Barness</option>
      <option value="Tara Gleeson" ${record.prescriber && record.prescriber.includes('Gleeson') ? 'selected' : ''}>Tara Gleeson</option>
      <option value="GAP" ${record.prescriber === 'GAP' ? 'selected' : ''}>GAP</option>
      ${(!record.prescriber || (!record.prescriber.includes('Barness') && !record.prescriber.includes('Gleeson') && record.prescriber !== 'GAP')) ? `<option value="${escapeHtml(record.prescriber || '')}" selected>${escapeHtml(record.prescriber || 'Select...')}</option>` : ''}
    </select>
  `;
}

function renderTitrationMedBadge(medName) {
  const medKey = getTitrationMedKey(medName);
  const cfg = TITRATION_MEDS_CONFIG[medKey] || {
    name: medName,
    color: 'var(--primary)',
    bgLight: 'rgba(124, 92, 252, 0.08)'
  };

  let subTag = '';
  if (medName.includes('XR')) subTag = '<span class="zlog-med-badge-sub">XR</span>';
  else if (medName.includes('IR')) subTag = '<span class="zlog-med-badge-sub">IR</span>';

  return `
    <span class="zlog-med-badge" style="border-left: 3px solid ${cfg.color};" title="${escapeHtml(medName)}">
      <span class="zlog-med-dot" style="background: ${cfg.color};"></span>
      <span>${escapeHtml(cfg.name)}</span>
      ${subTag}
    </span>
  `;
}

function renderTitrationDosePill(record) {
  const isStopped = (record.action === 'Stopped' || record.dosage === '0 mg');
  return `<span class="zlog-tit-dose-pill ${isStopped ? 'is-stopped' : ''}">${escapeHtml(record.dosage)}</span>`;
}

function buildTitrationTableHtml(records) {
  if (records.length === 0) {
    return `<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.80rem;">No adjustments match the active filters.</div>`;
  }
  return `
    <div style="width: 100%; overflow: hidden;">
      <table class="zlog-titration-table">
        <colgroup>
          <col style="width: 13%;">
          <col style="width: 19%;">
          <col style="width: 16%;">
          <col style="width: 22%;">
          <col style="width: 14%;">
          <col style="width: 16%;">
        </colgroup>
        <thead>
          <tr>
            <th style="cursor: pointer; user-select: none;" onclick="toggleTitrationSortOrder()" title="Click to reverse sort order">Date ${zlogTitrationSortOrder === 'desc' ? '▾' : '▴'}</th>
            <th>Medication</th>
            <th>Action</th>
            <th>Dosage</th>
            <th style="text-align: center;">Clinical Note</th>
            <th>Prescriber</th>
          </tr>
        </thead>
        <tbody>
          ${records.map(record => {
            const hasNotes = !!((record.notes && record.notes.trim()) || record.snapshot);
            return `
              <tr>
                <td style="font-family: var(--font-mono); font-size: 0.70rem; font-weight: 600;">${record.date}</td>
                <td>${renderTitrationMedBadge(record.medication)}</td>
                <td>${renderTitrationActionSelect(record)}</td>
                <td>${renderTitrationDosePill(record)}</td>
                <td style="text-align: center;">
                  ${hasNotes ? `
                    <button type="button" class="zlog-note-btn ${zlogTitrationAllNotesOpen ? 'active' : ''}" onclick="toggleTitrationNote('tit-note-${record.id}', this)" title="Click to view clinical note">
                      💬 Note
                    </button>
                  ` : `<span style="color: var(--text-muted); font-size: 0.70rem;">—</span>`}
                </td>
                <td>${renderTitrationPrescriberSelect(record)}</td>
              </tr>
              ${hasNotes ? `
                <tr id="tit-note-${record.id}" class="zlog-titration-note-row zlog-titration-note-drawer-target" style="display: ${zlogTitrationAllNotesOpen ? 'table-row' : 'none'};">
                  <td colspan="6" style="padding: 0 12px 10px 12px; border-bottom: 1px solid var(--border-light);">
                    <div class="zlog-titration-note-drawer">
                      <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
                        <span style="font-weight: 700; color: var(--primary); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.04em;">
                          Clinical Rationale &middot; ${record.date} &middot; ${escapeHtml(record.medication)} (${escapeHtml(record.dosage)})
                        </span>
                        <button type="button" onclick="toggleTitrationNote('tit-note-${record.id}', null)" style="background: none; border: none; font-size: 0.85rem; line-height: 1; color: var(--text-muted); cursor: pointer; padding: 0 4px;" title="Close note">&times;</button>
                      </div>
                      ${record.notes ? `
                        <div style="margin-top: 4px; color: var(--text-primary); font-size: 0.74rem; line-height: 1.45;">
                          ${escapeHtml(record.notes)}
                        </div>
                      ` : ''}
                      ${record.snapshot ? `
                        <div class="note-snapshot">
                          📷 Snapshot: ${escapeHtml(record.snapshot)}
                        </div>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              ` : ''}
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function buildTitrationCardsHtml(records) {
  if (records.length === 0) {
    return `<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.80rem;">No adjustments match the active filters.</div>`;
  }
  return `
    <div class="zlog-titration-cards-list">
      ${records.map(record => {
        const hasNotes = !!((record.notes && record.notes.trim()) || record.snapshot);
        return `
          <div class="zlog-titration-event-card">
            <div class="zlog-titration-event-header">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span class="zlog-tit-date" style="cursor: pointer;" onclick="toggleTitrationSortOrder()" title="Click to reverse sort order">
                  ${record.date}
                </span>
                ${renderTitrationMedBadge(record.medication)}
                ${renderTitrationDosePill(record)}
                ${hasNotes ? `
                  <button type="button" class="zlog-note-btn ${zlogTitrationAllNotesOpen ? 'active' : ''}" onclick="toggleTitrationNote('card-note-${record.id}', this)" title="Click to view clinical note">
                    💬 Note
                  </button>
                ` : ''}
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                ${renderTitrationActionSelect(record)}
                ${renderTitrationPrescriberSelect(record)}
              </div>
            </div>
            ${hasNotes ? `
              <div id="card-note-${record.id}" class="zlog-titration-note-drawer-target" style="display: ${zlogTitrationAllNotesOpen ? 'block' : 'none'}; margin-top: 6px; padding: 8px 10px; background: var(--bg-hover); border-left: 3px solid var(--primary); border-radius: var(--radius-sm);">
                ${record.notes ? `<div style="font-size: 0.74rem; line-height: 1.45; color: var(--text-primary);">${escapeHtml(record.notes)}</div>` : ''}
                ${record.snapshot ? `
                  <div style="font-size: 0.66rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 4px; border-top: 1px dashed var(--border-light); padding-top: 4px;">
                    📷 ${escapeHtml(record.snapshot)}
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function buildTitrationByMedicationHtml(records) {
  const medKeys = ['guanfacine', 'sertraline', 'ritalin', 'risperdal'];
  const displayKeys = (zlogTitrationMedFilter !== 'all') ? [zlogTitrationMedFilter] : medKeys;

  const cardsHtml = displayKeys.map(key => {
    const cfg = TITRATION_MEDS_CONFIG[key];
    if (!cfg) return '';
    const medRecords = records.filter(r => getTitrationMedKey(r.medication) === key);
    if (medRecords.length === 0 && zlogTitrationMedFilter === 'all') return '';

    const sortedMedRecords = sortTitrationRecords(medRecords, zlogTitrationSortOrder);
    const oldestDate = medRecords.length > 0 ? [...medRecords].sort((a,b)=>(a.date||'').localeCompare(b.date||''))[0].date : '—';
    const latestDate = medRecords.length > 0 ? [...medRecords].sort((a,b)=>(b.date||'').localeCompare(a.date||''))[0].date : '—';
    const prescribers = Array.from(new Set(medRecords.map(r => r.prescriber).filter(Boolean))).join(', ');

    return `
      <div class="zlog-med-group-card" style="border-left: 4px solid ${cfg.color};">
        <div class="zlog-med-group-header">
          <div class="zlog-med-group-title-area">
            <span class="zlog-med-dot" style="background: ${cfg.color}; width: 9px; height: 9px;"></span>
            <span class="zlog-med-group-title">${escapeHtml(cfg.fullName)}</span>
            <span class="zlog-med-group-status" style="background: ${cfg.bgLight}; color: ${cfg.color}; border: 1px solid ${cfg.color}35;">
              ${escapeHtml(cfg.currentDose)}
            </span>
          </div>
          <div class="zlog-med-group-meta">
            <strong>${medRecords.length}</strong> adjustments &middot; ${oldestDate} &rarr; ${latestDate} &middot; Prescribers: ${escapeHtml(prescribers || 'Dr Barness')}
          </div>
        </div>

        <div class="zlog-med-ladder">
          ${sortedMedRecords.map((record, idx) => {
            const stepNum = (zlogTitrationSortOrder === 'desc') ? (sortedMedRecords.length - idx) : (idx + 1);
            const hasNotes = !!((record.notes && record.notes.trim()) || record.snapshot);

            return `
              <div class="zlog-ladder-step">
                <div class="zlog-ladder-step-num" title="Adjustment #${stepNum}">#${stepNum}</div>
                <div class="zlog-ladder-step-date">${record.date}</div>
                <div class="zlog-ladder-step-action">${renderTitrationActionSelect(record)}</div>
                <div class="zlog-ladder-step-dose">${renderTitrationDosePill(record)}</div>
                <div class="zlog-ladder-step-note">
                  ${hasNotes ? `
                    <button type="button" class="zlog-note-btn ${zlogTitrationAllNotesOpen ? 'active' : ''}" onclick="toggleTitrationNote('med-note-${record.id}', this)" title="Click to view notes">
                      💬 Note
                    </button>
                  ` : `<span style="color: var(--text-muted); font-size: 0.70rem;">—</span>`}
                </div>
                <div class="zlog-ladder-step-prescriber">${renderTitrationPrescriberSelect(record)}</div>
              </div>
              ${hasNotes ? `
                <div id="med-note-${record.id}" class="zlog-med-note-drawer zlog-titration-note-drawer-target" style="display: ${zlogTitrationAllNotesOpen ? 'block' : 'none'};">
                  <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
                    <span style="font-weight: 700; color: var(--primary); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.04em;">
                      Clinical Rationale &middot; ${record.date}
                    </span>
                    <button type="button" onclick="toggleTitrationNote('med-note-${record.id}', null)" style="background: none; border: none; font-size: 0.85rem; line-height: 1; color: var(--text-muted); cursor: pointer; padding: 0 4px;" title="Close note">&times;</button>
                  </div>
                  ${record.notes ? `
                    <div style="margin-top: 3px; color: var(--text-primary); font-size: 0.74rem; line-height: 1.45;">
                      ${escapeHtml(record.notes)}
                    </div>
                  ` : ''}
                  ${record.snapshot ? `
                    <div class="note-snapshot">
                      📷 Snapshot: ${escapeHtml(record.snapshot)}
                    </div>
                  ` : ''}
                </div>
              ` : ''}
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).filter(Boolean).join('');

  if (!cardsHtml) {
    return `<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.80rem;">No adjustments found for the selected medication and filters.</div>`;
  }

  return `<div class="zlog-med-group-list">${cardsHtml}</div>`;
}

function buildTitrationByYearHtml(records) {
  const years = ['2026', '2025'];
  const displayYears = (zlogTitrationYearFilter !== 'all') ? [zlogTitrationYearFilter] : years;

  const yearsHtml = displayYears.map(year => {
    const yearRecords = records.filter(r => (r.date || '').startsWith(year));
    if (yearRecords.length === 0 && zlogTitrationYearFilter === 'all') return '';

    const sortedYearRecords = sortTitrationRecords(yearRecords, zlogTitrationSortOrder);
    const counts = { guanfacine: 0, sertraline: 0, ritalin: 0, risperdal: 0 };
    yearRecords.forEach(r => {
      const k = getTitrationMedKey(r.medication);
      if (counts[k] !== undefined) counts[k]++;
    });
    const breakdown = [
      counts.guanfacine > 0 ? `Guanfacine (${counts.guanfacine})` : null,
      counts.sertraline > 0 ? `Sertraline (${counts.sertraline})` : null,
      counts.ritalin > 0 ? `Ritalin (${counts.ritalin})` : null,
      counts.risperdal > 0 ? `Risperdal (${counts.risperdal})` : null
    ].filter(Boolean).join(' &middot; ');

    return `
      <div class="zlog-titration-table-card" style="margin-bottom: 1.25rem;">
        <div class="zlog-titration-table-header" style="background: var(--bg-surface); padding: 10px 14px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.90rem; font-weight: 800; color: var(--text-primary);">${year} Adjustments</span>
            <span class="zlog-chip-count" style="font-size: 0.70rem; padding: 2px 7px;">${yearRecords.length} changes</span>
          </div>
          <div style="font-size: 0.70rem; color: var(--text-muted);">
            ${breakdown}
          </div>
        </div>
        ${zlogTitrationDisplayMode === 'table' ? buildTitrationTableHtml(sortedYearRecords) : buildTitrationCardsHtml(sortedYearRecords)}
      </div>
    `;
  }).filter(Boolean).join('');

  if (!yearsHtml) {
    return `<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.80rem;">No adjustments found for the selected year and filters.</div>`;
  }

  return `<div>${yearsHtml}</div>`;
}

/* --------------------------------------------------------------------------
   Sub-Tab 2: Meds & Titration Protocol
   -------------------------------------------------------------------------- */
function renderZLogTitration() {
  const container = document.getElementById('zlog-subview-container');
  if (!container) return;

  let titrationList = storage.getTitrationHistory();
  if (!Array.isArray(titrationList) || titrationList.length === 0) {
    titrationList = (typeof DEFAULT_TITRATION_HISTORY !== 'undefined') ? [...DEFAULT_TITRATION_HISTORY] : [];
  }

  // Pre-calculate counts for filter chips
  const medCounts = { all: titrationList.length, guanfacine: 0, sertraline: 0, ritalin: 0, risperdal: 0 };
  const yearCounts = { all: titrationList.length, '2026': 0, '2025': 0 };
  titrationList.forEach(r => {
    const k = getTitrationMedKey(r.medication);
    if (medCounts[k] !== undefined) medCounts[k]++;
    const y = (r.date || '').substring(0, 4);
    if (yearCounts[y] !== undefined) yearCounts[y]++;
  });

  // Filter records
  const filteredList = titrationList.filter(record => {
    if (zlogTitrationMedFilter !== 'all') {
      const k = getTitrationMedKey(record.medication);
      if (k !== zlogTitrationMedFilter) return false;
    }
    if (zlogTitrationYearFilter !== 'all') {
      const y = (record.date || '').substring(0, 4);
      if (y !== zlogTitrationYearFilter) return false;
    }
    if (zlogTitrationSearchQuery.trim()) {
      const q = zlogTitrationSearchQuery.toLowerCase().trim();
      const hay = `${record.date} ${record.medication} ${record.dosage} ${record.action} ${record.notes || ''} ${record.prescriber || ''} ${record.snapshot || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const sortedFilteredList = sortTitrationRecords(filteredList, zlogTitrationSortOrder);

  container.innerHTML = `
    <!-- Current Active Prescriptions (Click to Filter) -->
    <div style="margin-bottom: 1.25rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted);">
          Current Active Regimen
        </span>
        <span style="font-size: 0.68rem; color: var(--text-muted);">
          Click card to isolate medication
        </span>
      </div>
      <div class="zlog-regimen-grid">
        <div 
          class="zlog-stat-card zlog-regimen-card ${zlogTitrationMedFilter === 'guanfacine' ? 'is-active-filter' : ''}" 
          style="border-left: 4px solid #7979B8;" 
          onclick="setTitrationMedFilter('guanfacine')"
          title="Click to filter titration history to Guanfacine"
        >
          <div class="zlog-stat-label">Active Prescribed</div>
          <div class="zlog-regimen-name" title="Guanfacine XR">Guanfacine XR</div>
          <div class="zlog-regimen-dose" style="color: #7979B8;">2 mg (Active)</div>
          <div class="zlog-regimen-meta" title="Prescriber: Dr. Barness">Prescriber: Dr. Barness</div>
        </div>

        <div 
          class="zlog-stat-card zlog-regimen-card ${zlogTitrationMedFilter === 'sertraline' ? 'is-active-filter' : ''}" 
          style="border-left: 4px solid #4E8765;" 
          onclick="setTitrationMedFilter('sertraline')"
          title="Click to filter titration history to Sertraline"
        >
          <div class="zlog-stat-label">Active Prescribed</div>
          <div class="zlog-regimen-name" title="Sertraline (Zoloft)">Sertraline (Zoloft)</div>
          <div class="zlog-regimen-dose" style="color: #4E8765;">75 mg (Active)</div>
          <div class="zlog-regimen-meta" title="Prescriber: Dr. Barness">Prescriber: Dr. Barness</div>
        </div>

        <div 
          class="zlog-stat-card zlog-regimen-card ${zlogTitrationMedFilter === 'ritalin' ? 'is-active-filter' : ''}" 
          style="border-left: 4px solid #7C5CFC;" 
          onclick="setTitrationMedFilter('ritalin')"
          title="Click to filter titration history to Ritalin"
        >
          <div class="zlog-stat-label">Active Prescribed</div>
          <div class="zlog-regimen-name" title="Ritalin">Ritalin</div>
          <div class="zlog-regimen-dose" style="color: #7C5CFC;">15 mg + 10 mg</div>
          <div class="zlog-regimen-meta" title="Prescriber: Dr. Barness">Prescriber: Dr. Barness</div>
        </div>

        <div 
          class="zlog-stat-card zlog-regimen-card is-discontinued ${zlogTitrationMedFilter === 'risperdal' ? 'is-active-filter' : ''}" 
          style="border-left: 4px solid #94A3B8; opacity: 0.75; background: var(--bg-surface);" 
          onclick="setTitrationMedFilter('risperdal')"
          title="Click to filter titration history to Risperdal"
        >
          <div class="zlog-stat-label" style="color: var(--text-muted);">As Needed / PRN</div>
          <div class="zlog-regimen-name" style="color: var(--text-secondary);" title="Risperdal (risperidone)">Risperdal</div>
          <div class="zlog-regimen-dose" style="color: #64748B;">PRN (0 mg regular)</div>
          <div class="zlog-regimen-meta" title="Prescriber: Dr. Barness (Stopped regular 9/19)">Stopped regular 9/19</div>
        </div>
      </div>
    </div>

    <!-- Titration Control Deck: Grouping, Search & Filter Toolbar -->
    <div class="zlog-titration-deck">
      <!-- Top Row: Title, Notes Toggle & Group By Selector -->
      <div class="zlog-titration-deck-top">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">
            Dosage Adjustment History
          </span>
          <span class="zlog-chip-count">
            ${filteredList.length} of ${titrationList.length} shown
          </span>
          <button 
            type="button" 
            class="zlog-note-btn ${zlogTitrationAllNotesOpen ? 'active' : ''}" 
            onclick="toggleAllTitrationNotes()" 
            title="Expand or hide all clinical notes across all rows"
            style="margin-left: 4px;"
          >
            <i data-lucide="message-square" style="width: 11px; height: 11px;"></i>
            <span id="zlog-toggle-all-notes-btn-text">${zlogTitrationAllNotesOpen ? 'Hide All Notes' : 'Expand All Notes'}</span>
          </button>
        </div>

        <!-- 3-Way Group By Selector -->
        <div style="display: flex; align-items: center; gap: 4px; background: var(--bg-hover); padding: 3px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
          <span style="font-size: 0.66rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin: 0 4px 0 2px;">Group By</span>
          <button 
            type="button" 
            class="btn ${zlogTitrationGroupBy === 'medication' ? 'btn-primary' : 'btn-ghost'}" 
            onclick="setTitrationGroupBy('medication')" 
            style="font-size: 0.70rem; padding: 2px 8px; height: 24px; border-radius: var(--radius-sm);" 
            title="Group by individual drug with chronological step ladders"
          >
            <span>💊 By Medication</span>
          </button>
          <button 
            type="button" 
            class="btn ${zlogTitrationGroupBy === 'timeline' ? 'btn-primary' : 'btn-ghost'}" 
            onclick="setTitrationGroupBy('timeline')" 
            style="font-size: 0.70rem; padding: 2px 8px; height: 24px; border-radius: var(--radius-sm);" 
            title="Continuous chronological timeline of all adjustments"
          >
            <span>📅 Timeline</span>
          </button>
          <button 
            type="button" 
            class="btn ${zlogTitrationGroupBy === 'year' ? 'btn-primary' : 'btn-ghost'}" 
            onclick="setTitrationGroupBy('year')" 
            style="font-size: 0.70rem; padding: 2px 8px; height: 24px; border-radius: var(--radius-sm);" 
            title="Group adjustments by Year (2026 vs 2025)"
          >
            <span>🗓 By Year</span>
          </button>
        </div>
      </div>

      <!-- Bottom Row: Search, Medication Chips & Year Chips -->
      <div class="zlog-titration-deck-bottom">
        <!-- Search Input -->
        <div class="zlog-titration-search">
          <i data-lucide="search" class="zlog-titration-search-icon"></i>
          <input 
            type="text" 
            id="zlog-titration-search-box" 
            placeholder="Search notes, dose, doctor..." 
            value="${escapeHtml(zlogTitrationSearchQuery)}"
            oninput="setTitrationSearchQuery(this.value)"
          >
          ${zlogTitrationSearchQuery ? `
            <button type="button" onclick="clearTitrationSearch()" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 0.8rem; padding: 0 4px;">&times;</button>
          ` : ''}
        </div>

        <!-- Filter Chips: Meds -->
        <div class="zlog-titration-chip-group">
          <button type="button" class="zlog-titration-chip ${zlogTitrationMedFilter === 'all' ? 'active' : ''}" onclick="setTitrationMedFilter('all')">
            <span>All Meds</span>
            <span class="zlog-chip-count">${medCounts.all}</span>
          </button>
          <button type="button" class="zlog-titration-chip ${zlogTitrationMedFilter === 'guanfacine' ? 'active' : ''}" onclick="setTitrationMedFilter('guanfacine')">
            <span class="zlog-med-dot" style="background: #7979B8;"></span>
            <span>Guanfacine</span>
            <span class="zlog-chip-count">${medCounts.guanfacine}</span>
          </button>
          <button type="button" class="zlog-titration-chip ${zlogTitrationMedFilter === 'sertraline' ? 'active' : ''}" onclick="setTitrationMedFilter('sertraline')">
            <span class="zlog-med-dot" style="background: #4E8765;"></span>
            <span>Sertraline</span>
            <span class="zlog-chip-count">${medCounts.sertraline}</span>
          </button>
          <button type="button" class="zlog-titration-chip ${zlogTitrationMedFilter === 'ritalin' ? 'active' : ''}" onclick="setTitrationMedFilter('ritalin')">
            <span class="zlog-med-dot" style="background: #7C5CFC;"></span>
            <span>Ritalin</span>
            <span class="zlog-chip-count">${medCounts.ritalin}</span>
          </button>
          <button type="button" class="zlog-titration-chip ${zlogTitrationMedFilter === 'risperdal' ? 'active' : ''}" onclick="setTitrationMedFilter('risperdal')">
            <span class="zlog-med-dot" style="background: #D97768;"></span>
            <span>Risperdal</span>
            <span class="zlog-chip-count">${medCounts.risperdal}</span>
          </button>
        </div>

        <!-- Filter Chips: Years & View Toggle -->
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <div class="zlog-titration-chip-group">
            <button type="button" class="zlog-titration-chip ${zlogTitrationYearFilter === 'all' ? 'active' : ''}" onclick="setTitrationYearFilter('all')">
              <span>All Years</span>
            </button>
            <button type="button" class="zlog-titration-chip ${zlogTitrationYearFilter === '2026' ? 'active' : ''}" onclick="setTitrationYearFilter('2026')">
              <span>2026</span>
              <span class="zlog-chip-count">${yearCounts['2026']}</span>
            </button>
            <button type="button" class="zlog-titration-chip ${zlogTitrationYearFilter === '2025' ? 'active' : ''}" onclick="setTitrationYearFilter('2025')">
              <span>2025</span>
              <span class="zlog-chip-count">${yearCounts['2025']}</span>
            </button>
          </div>

          <!-- Table vs Cards Toggle (Available in Timeline & Year views) -->
          ${zlogTitrationGroupBy !== 'medication' ? `
            <div style="display: flex; align-items: center; gap: 2px; background: var(--bg-hover); padding: 2px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
              <button type="button" class="btn ${zlogTitrationDisplayMode === 'table' ? 'btn-primary' : 'btn-ghost'}" onclick="setTitrationDisplayMode('table')" style="font-size: 0.68rem; padding: 2px 7px; height: 22px; border-radius: var(--radius-sm);" title="Compact Table">
                <i data-lucide="table" style="width: 11px; height: 11px;"></i>
                <span>Table</span>
              </button>
              <button type="button" class="btn ${zlogTitrationDisplayMode === 'cards' ? 'btn-primary' : 'btn-ghost'}" onclick="setTitrationDisplayMode('cards')" style="font-size: 0.68rem; padding: 2px 7px; height: 22px; border-radius: var(--radius-sm);" title="Event Cards">
                <i data-lucide="layout-list" style="width: 11px; height: 11px;"></i>
                <span>Cards</span>
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    </div>

    <!-- View Mode Container -->
    ${zlogTitrationGroupBy === 'medication' ? `
      ${buildTitrationByMedicationHtml(filteredList)}
    ` : (zlogTitrationGroupBy === 'year' ? `
      ${buildTitrationByYearHtml(filteredList)}
    ` : `
      <div class="zlog-titration-table-card">
        ${zlogTitrationDisplayMode === 'table' ? buildTitrationTableHtml(sortedFilteredList) : buildTitrationCardsHtml(sortedFilteredList)}
      </div>
    `)}
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* --------------------------------------------------------------------------
   Sub-Tab 3: Patterns, Triangulation & "What Works" Playbook
   -------------------------------------------------------------------------- */
let zlogInsightsTimeframe = (() => {
  try {
    const s = localStorage.getItem('BOL_ZLOG_INSIGHTS_TIMEFRAME');
    if (s && ['all', '3m', '6m', '12m'].includes(s)) return s;
  } catch (e) {}
  return '3m'; // '3m' default (focus on last 3 months for rapid developmental pace), '6m', '12m', 'all'
})();
let zlogInsightsCompareMode = (() => {
  try {
    const s = localStorage.getItem('BOL_ZLOG_INSIGHTS_COMPARE');
    if (s && ['none', 'prev', 'baseline'].includes(s)) return s;
  } catch (e) {}
  return 'none'; // 'none', 'prev', 'baseline'
})();
let zlogInsightsCocktailA = 'cocktail_peak';
let zlogInsightsCocktailB = 'cocktail_sertraline_boost';

const CLINICAL_COCKTAILS = [
  {
    id: 'cocktail_peak',
    rank: 1,
    title: '4-Pillar Synergy (Early Summer)',
    dates: 'Jun 2 – Jul 10, 2026',
    start: '2026-06-02',
    end: '2026-07-10',
    meds: [
      { name: 'Zoloft', dose: '50mg', type: 'zoloft' },
      { name: 'Guanfacine XR', dose: '2mg', type: 'guan' },
      { name: 'Ritalin IR', dose: '25mg (15+10)', type: 'rit' },
      { name: 'Risperdal', dose: '0.125mg', type: 'ris' }
    ],
    statusTag: '🌟 #1 Peak Behavioral Regulation',
    border: '#10B981',
    summary: 'Full executive & emotional coverage. Daytime focus boosted with 11 AM school booster; low-dose Risperdal safety floor prevented explosive reactivity.',
    clinicalNote: 'Produced the lowest aggression rate (15%) and highest good days (72%) of the 2-year history.'
  },
  {
    id: 'cocktail_spring_focus',
    rank: 2,
    title: 'Daytime Focus Escalation (Spring 2026)',
    dates: 'May 9 – Jun 1, 2026',
    start: '2026-05-09',
    end: '2026-06-01',
    meds: [
      { name: 'Zoloft', dose: '50mg', type: 'zoloft' },
      { name: 'Guanfacine XR', dose: '2mg', type: 'guan' },
      { name: 'Ritalin IR', dose: '5–15mg AM', type: 'rit' },
      { name: 'Risperdal', dose: '0.25mg', type: 'ris' }
    ],
    statusTag: '#2 Solid School Focus',
    border: '#0D9488',
    summary: 'Initial addition of Ritalin IR to stabilized Guanfacine/Risperdal base. Supported classroom tasks with minimal rebound friction.',
    clinicalNote: '64% good days with 26% aggression rate. Showed strong tolerance to morning stimulant.'
  },
  {
    id: 'cocktail_baseline_floor',
    rank: 3,
    title: 'Dual Pillar Stabilizing Floor (Winter/Spring)',
    dates: 'Dec 20, 2025 – May 8, 2026',
    start: '2025-12-20',
    end: '2026-05-08',
    meds: [
      { name: 'Zoloft', dose: '25–50mg', type: 'zoloft' },
      { name: 'Guanfacine XR', dose: '2mg', type: 'guan' },
      { name: 'Risperdal', dose: '0.25mg', type: 'ris' },
      { name: 'Ritalin', dose: 'None (Pre-Stimulant)', type: 'none' }
    ],
    statusTag: '#3 Established Emotional Floor',
    border: '#8B5CF6',
    summary: 'Shifted full Guanfacine XR to mornings with daily 0.25mg Risperdal floor before any stimulant was introduced.',
    clinicalNote: 'Maintained 56% good days across 140 days. Reduced baseline aggression from 48% to 32%, but child still struggled with midday executive fatigue.'
  },
  {
    id: 'cocktail_sertraline_boost',
    rank: 4,
    title: 'High Sertraline / Stimulant (Risperdal Stopped)',
    dates: 'Aug 15 – Sep 11, 2026',
    start: '2026-08-15',
    end: '2026-09-11',
    meds: [
      { name: 'Zoloft', dose: '50–75mg', type: 'zoloft' },
      { name: 'Guanfacine XR', dose: '2mg', type: 'guan' },
      { name: 'Ritalin IR', dose: '25mg (15+10)', type: 'rit' },
      { name: 'Risperdal', dose: '0mg (Stopped)', type: 'stopped' }
    ],
    statusTag: '#4 Vulnerable to Demand Spikes',
    border: '#F97316',
    summary: 'Attempted to stop daily Risperidone under high school demands while increasing Sertraline to 75mg.',
    clinicalNote: 'Good days held at 54% when calm, but removing the Risperdal brake caused severe after-care refusals and the acute Sep 11 meltdown crisis.'
  },
  {
    id: 'cocktail_early_baseline',
    rank: 5,
    title: 'Early Liquid Titration (Pre-Risperdal)',
    dates: 'Apr 9 – Nov 20, 2025',
    start: '2025-04-09',
    end: '2025-11-20',
    meds: [
      { name: 'Sertraline', dose: '5–20mg liquid', type: 'zoloft' },
      { name: 'Guanfacine IR', dose: '0.5–1mg', type: 'guan' },
      { name: 'Risperdal', dose: 'None', type: 'none' },
      { name: 'Ritalin', dose: 'None', type: 'none' }
    ],
    statusTag: '#5 High Baseline Reactivity',
    border: '#EF4444',
    summary: 'Early titration phase before establishing the 4-pillar regimen. Single daily short-acting doses without behavioral brake.',
    clinicalNote: 'Lowest efficacy: 46% good days, 48% aggression rate across 121 monitored days.'
  }
];

// Backward-compatible alias
const CLINICAL_ERAS = CLINICAL_COCKTAILS;

function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length < 3) return null;
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
}

function formatDateStr(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatPrettyDate(dateStr) {
  if (!dateStr) return '';
  const d = parseLocalDate(dateStr);
  if (!d) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function computePeriodStats(list) {
  if (!list || list.length === 0) {
    return { total: 0, goodDays: 0, pctGood: 0, aggDays: 0, pctAgg: 0, avgRating: '0.0', rawAvg: 0, ratedCount: 0 };
  }
  let goodDays = 0;
  let aggDays = 0;
  let ratingSum = 0;
  let ratedCount = 0;

  list.forEach(e => {
    const isAgg = (e.tags && (e.tags.includes('aggression') || e.tags.includes('meltdown'))) ||
                  (e.indicators && (e.indicators.includes('aggression') || e.indicators.includes('meltdown'))) ||
                  Boolean(e.aggression);
    if (isAgg) aggDays++;

    const isGood = (e.rating && e.rating >= 4) ||
                   (e.tags && (e.tags.includes('calm') || e.tags.includes('happy') || e.tags.includes('focused')));
    if (isGood) goodDays++;

    if (e.rating && typeof e.rating === 'number' && e.rating > 0) {
      ratingSum += e.rating;
      ratedCount++;
    }
  });

  const pctGood = Math.round((goodDays / list.length) * 100);
  const pctAgg = Math.round((aggDays / list.length) * 100);
  const rawAvg = ratedCount > 0 ? (ratingSum / ratedCount) : 0;
  const avgRating = ratedCount > 0 ? rawAvg.toFixed(2) : 'N/A';

  return { total: list.length, goodDays, pctGood, aggDays, pctAgg, avgRating, rawAvg, ratedCount };
}

function formatDeltaBadge(currVal, prevVal, isHigherBetter = true, suffix = '%') {
  if (prevVal === undefined || prevVal === null || isNaN(prevVal) || isNaN(currVal)) return '';
  const diff = Number((currVal - prevVal).toFixed(1));
  if (diff === 0) {
    return `<span class="zlog-delta-tag neutral">0${suffix}</span>`;
  }
  const isPositive = diff > 0;
  const isGood = isHigherBetter ? isPositive : !isPositive;
  const sign = isPositive ? '+' : '';
  const cls = isGood ? 'good' : 'bad';
  return `<span class="zlog-delta-tag ${cls}">${sign}${diff}${suffix}</span>`;
}

function getInsightsFilteredData(allEntries, timeframe, compareMode) {
  if (!allEntries || allEntries.length === 0) {
    return {
      currentEntries: [],
      compareEntries: null,
      currentRangeLabel: 'No data',
      compareLabel: null
    };
  }

  const sorted = [...allEntries].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const latestDateStr = sorted[sorted.length - 1].date || '2026-09-13';
  const latestDate = parseLocalDate(latestDateStr);

  let currentStart = null;
  let currentEnd = latestDateStr;
  let compareStart = null;
  let compareEnd = null;
  let currentRangeLabel = '';
  let compareLabel = null;

  if (timeframe === '3m') {
    const dStart = new Date(latestDate.getTime() - 91 * 86400000);
    currentStart = formatDateStr(dStart);
    currentRangeLabel = `${formatPrettyDate(currentStart)} – ${formatPrettyDate(currentEnd)}`;

    if (compareMode === 'prev') {
      const dCmpEnd = new Date(dStart.getTime() - 86400000);
      const dCmpStart = new Date(dCmpEnd.getTime() - 91 * 86400000);
      compareStart = formatDateStr(dCmpStart);
      compareEnd = formatDateStr(dCmpEnd);
      compareLabel = `Prior 3 Months (${formatPrettyDate(compareStart)} – ${formatPrettyDate(compareEnd)})`;
    } else if (compareMode === 'baseline') {
      compareLabel = 'All-Time Baseline (426 days)';
    }
  } else if (timeframe === '6m') {
    const dStart = new Date(latestDate.getTime() - 182 * 86400000);
    currentStart = formatDateStr(dStart);
    currentRangeLabel = `${formatPrettyDate(currentStart)} – ${formatPrettyDate(currentEnd)}`;

    if (compareMode === 'prev') {
      const dCmpEnd = new Date(dStart.getTime() - 86400000);
      const dCmpStart = new Date(dCmpEnd.getTime() - 182 * 86400000);
      compareStart = formatDateStr(dCmpStart);
      compareEnd = formatDateStr(dCmpEnd);
      compareLabel = `Prior 6 Months (${formatPrettyDate(compareStart)} – ${formatPrettyDate(compareEnd)})`;
    } else if (compareMode === 'baseline') {
      compareLabel = 'All-Time Baseline (426 days)';
    }
  } else if (timeframe === '12m') {
    const dStart = new Date(latestDate.getTime() - 365 * 86400000);
    currentStart = formatDateStr(dStart);
    currentRangeLabel = `${formatPrettyDate(currentStart)} – ${formatPrettyDate(currentEnd)}`;

    if (compareMode === 'prev') {
      const dCmpEnd = new Date(dStart.getTime() - 86400000);
      const dCmpStart = new Date(dCmpEnd.getTime() - 365 * 86400000);
      compareStart = formatDateStr(dCmpStart);
      compareEnd = formatDateStr(dCmpEnd);
      compareLabel = `Prior 12 Months (${formatPrettyDate(compareStart)} – ${formatPrettyDate(compareEnd)})`;
    } else if (compareMode === 'baseline') {
      compareLabel = 'All-Time Baseline (426 days)';
    }
  } else {
    // 'all'
    const earliestDateStr = sorted[0].date || '2024-09-24';
    currentRangeLabel = `Sep 2024 – Sep 2026 (Full 2-Year Dataset)`;
    if (compareMode === 'prev') {
      const dMid = new Date(latestDate.getTime() - 365 * 86400000);
      currentStart = formatDateStr(dMid);
      compareEnd = formatDateStr(new Date(dMid.getTime() - 86400000));
      compareStart = earliestDateStr;
      currentRangeLabel = `Past 12 Months (${formatPrettyDate(currentStart)} – ${formatPrettyDate(currentEnd)})`;
      compareLabel = `Prior Year Baseline (${formatPrettyDate(compareStart)} – ${formatPrettyDate(compareEnd)})`;
    } else if (compareMode === 'baseline') {
      compareLabel = 'Full Historical Baseline';
    }
  }

  const currentEntries = currentStart 
    ? allEntries.filter(e => e.date && e.date >= currentStart && e.date <= currentEnd)
    : allEntries;

  let compareEntries = null;
  if (compareMode === 'baseline') {
    compareEntries = allEntries;
  } else if (compareMode === 'prev' && compareStart && compareEnd) {
    compareEntries = allEntries.filter(e => e.date && e.date >= compareStart && e.date <= compareEnd);
  }

  return {
    currentEntries,
    compareEntries,
    currentRangeLabel,
    compareLabel
  };
}

function computeDowStats(list) {
  const dows = [
    { name: 'Sunday', key: 0, highlight: false },
    { name: 'Monday', key: 1, highlight: 'agg', label: 'School Re-entry' },
    { name: 'Tuesday', key: 2, highlight: 'good', label: 'Peak' },
    { name: 'Wednesday', key: 3, highlight: false },
    { name: 'Thursday', key: 4, highlight: false },
    { name: 'Friday', key: 5, highlight: false },
    { name: 'Saturday', key: 6, highlight: 'agg', label: 'Weekly Spike' }
  ];

  const counts = Array.from({ length: 7 }, () => ({ total: 0, good: 0, agg: 0 }));

  list.forEach(e => {
    if (!e.date) return;
    const dt = parseLocalDate(e.date);
    if (!dt) return;
    const day = dt.getDay();
    counts[day].total++;

    const isAgg = (e.tags && (e.tags.includes('aggression') || e.tags.includes('meltdown'))) ||
                  (e.indicators && (e.indicators.includes('aggression') || e.indicators.includes('meltdown'))) ||
                  Boolean(e.aggression);
    if (isAgg) counts[day].agg++;

    const isGood = (e.rating && e.rating >= 4) ||
                   (e.tags && (e.tags.includes('calm') || e.tags.includes('happy') || e.tags.includes('focused')));
    if (isGood) counts[day].good++;
  });

  return dows.map(d => {
    const c = counts[d.key];
    const pctGood = c.total > 0 ? Math.round((c.good / c.total) * 100) : 0;
    const pctAgg = c.total > 0 ? Math.round((c.agg / c.total) * 100) : 0;
    return {
      name: d.name,
      dayIndex: d.key,
      total: c.total,
      good: c.good,
      agg: c.agg,
      pctGood,
      pctAgg,
      highlight: d.highlight,
      label: d.label
    };
  });
}

function getCocktailComparisonNarrative(cA, cB) {
  if (cA.id === cB.id) {
    return `Both selectors are set to <strong>${cA.title}</strong>. Select two distinct combinations to compare efficacy and behavioral deltas.`;
  }
  if ((cA.id === 'cocktail_peak' && cB.id === 'cocktail_sertraline_boost') || (cA.id === 'cocktail_sertraline_boost' && cB.id === 'cocktail_peak')) {
    return `<strong>Clinical Takeaway (Risperdal Floor vs High Sertraline Alone):</strong> Removing the low-dose Risperdal floor (0.125mg) while boosting Sertraline to 75mg caused Good Days to drop from <strong>72% down to 54% (-18%)</strong> and precipitated severe school transition crises. This confirms that Sertraline alone cannot replace the dopamine-serotonin behavioral brake provided by low-dose Risperidone during high-friction school days.`;
  }
  if ((cA.id === 'cocktail_baseline_floor' && cB.id === 'cocktail_peak') || (cA.id === 'cocktail_peak' && cB.id === 'cocktail_baseline_floor')) {
    return `<strong>Clinical Takeaway (Impact of Adding Ritalin Booster):</strong> Adding the structured Ritalin protocol (15mg AM + 10mg School Booster) to the Guanfacine/Risperdal base boosted Good Days from <strong>56% to 72% (+16%)</strong> and halved the aggression rate from <strong>32% to 15% (-17%)</strong>. The 11 AM midday booster prevented the midday cognitive exhaustion crash that previously triggered afternoon meltdowns.`;
  }
  if ((cA.id === 'cocktail_early_baseline' && cB.id === 'cocktail_peak') || (cA.id === 'cocktail_peak' && cB.id === 'cocktail_early_baseline')) {
    return `<strong>Clinical Takeaway (2-Year Evolution):</strong> Evolving from the early 2025 liquid titration up to the optimized 4-pillar cocktail improved Good Days by <strong>+26% (46% &rarr; 72%)</strong> and reduced aggression by <strong>-33% (48% &rarr; 15%)</strong>, reflecting comprehensive coverage across anxiety, hyperactivity, and impulse regulation.`;
  }
  const goodDiff = cB.pctGood - cA.pctGood;
  const aggDiff = cB.pctAgg - cA.pctAgg;
  const signGood = goodDiff >= 0 ? '+' : '';
  const signAgg = aggDiff >= 0 ? '+' : '';
  return `Comparing <strong>${cA.title}</strong> against <strong>${cB.title}</strong> shows a ${signGood}${goodDiff}% change in Good Days and a ${signAgg}${aggDiff}% change in Aggression frequency across ${cA.total + cB.total} total monitored days.`;
}

function setInsightsTimeframe(val) {
  zlogInsightsTimeframe = val;
  try { localStorage.setItem('BOL_ZLOG_INSIGHTS_TIMEFRAME', val); } catch (e) {}
  renderZLogInsights();
}

function setInsightsCompareMode(val) {
  zlogInsightsCompareMode = val;
  try { localStorage.setItem('BOL_ZLOG_INSIGHTS_COMPARE', val); } catch (e) {}
  renderZLogInsights();
}

function setInsightsCocktailComparison(valA, valB) {
  if (valA) zlogInsightsCocktailA = valA;
  if (valB) zlogInsightsCocktailB = valB;
  renderZLogInsights();
}

function selectInsightsCocktailCard(cocktailId) {
  if (zlogInsightsCocktailA === cocktailId) return;
  if (zlogInsightsCocktailB === cocktailId) {
    const temp = zlogInsightsCocktailA;
    zlogInsightsCocktailA = zlogInsightsCocktailB;
    zlogInsightsCocktailB = temp;
  } else {
    zlogInsightsCocktailB = cocktailId;
  }
  renderZLogInsights();
}

let zlogRegimenContextFilter = (() => {
  try {
    const s = localStorage.getItem('BOL_ZLOG_REGIMEN_CONTEXT');
    if (s && ['all', 'school', 'home'].includes(s)) return s;
  } catch (e) {}
  return 'all'; // 'all', 'school', 'home'
})();
let zlogExpandedRegimenId = null;

function isSchoolDay(e) {
  if (!e || !e.date) return false;
  const parts = e.date.split('-').map(Number);
  if (parts.length < 3) return false;
  const dt = new Date(parts[0], parts[1] - 1, parts[2]);
  const day = dt.getDay();
  if (day === 0 || day === 6) return false;

  const dateStr = e.date;
  const notesLower = (e.notes || '').toLowerCase();
  if (notesLower.includes('no school') || notesLower.includes('spring break') || notesLower.includes('winter break') || notesLower.includes('thanksgiving')) {
    return false;
  }

  if ((dateStr >= '2025-06-25' && dateStr <= '2025-08-31') || 
      (dateStr >= '2026-06-19' && dateStr <= '2026-08-31')) {
    return false;
  }

  return true;
}

function computeRegimenMetrics(list) {
  const total = list.length;
  if (total === 0) {
    return {
      total: 0,
      aggDays: 0,
      pctAgg: 0,
      goodDays: 0,
      pctGood: 0,
      schoolTotal: 0,
      schoolAgg: 0,
      pctSchoolAgg: 0,
      homeTotal: 0,
      homeAgg: 0,
      pctHomeAgg: 0,
      avgRating: '0.0',
      rawAvg: 0
    };
  }

  let aggDays = 0;
  let goodDays = 0;
  let ratingSum = 0;
  let ratedCount = 0;

  let schoolTotal = 0;
  let schoolAgg = 0;
  let homeTotal = 0;
  let homeAgg = 0;

  list.forEach(e => {
    const isAgg = (e.tags && (e.tags.includes('aggression') || e.tags.includes('meltdown'))) ||
                  (e.indicators && (e.indicators.includes('aggression') || e.indicators.includes('meltdown'))) ||
                  Boolean(e.aggression);
    if (isAgg) aggDays++;

    const isGood = (e.rating && e.rating >= 4) ||
                   (e.tags && (e.tags.includes('calm') || e.tags.includes('happy') || e.tags.includes('focused')));
    if (isGood) goodDays++;

    if (e.rating && typeof e.rating === 'number' && e.rating > 0) {
      ratingSum += e.rating;
      ratedCount++;
    }

    if (isSchoolDay(e)) {
      schoolTotal++;
      if (isAgg) schoolAgg++;
    } else {
      homeTotal++;
      if (isAgg) homeAgg++;
    }
  });

  const pctAgg = Math.round((aggDays / total) * 100);
  const pctGood = Math.round((goodDays / total) * 100);
  const pctSchoolAgg = schoolTotal > 0 ? Math.round((schoolAgg / schoolTotal) * 100) : 0;
  const pctHomeAgg = homeTotal > 0 ? Math.round((homeAgg / homeTotal) * 100) : 0;
  const rawAvg = ratedCount > 0 ? (ratingSum / ratedCount) : 0;
  const avgRating = ratedCount > 0 ? rawAvg.toFixed(2) : 'N/A';

  return {
    total,
    aggDays,
    pctAgg,
    goodDays,
    pctGood,
    schoolTotal,
    schoolAgg,
    pctSchoolAgg,
    homeTotal,
    homeAgg,
    pctHomeAgg,
    avgRating,
    rawAvg
  };
}

function setRegimenContextFilter(filter) {
  zlogRegimenContextFilter = filter;
  renderZLogInsights();
}

function toggleRegimenDrawer(id) {
  zlogExpandedRegimenId = zlogExpandedRegimenId === id ? null : id;
  renderZLogInsights();
}

// Backward-compatible aliases
const getEraComparisonNarrative = getCocktailComparisonNarrative;
const setInsightsEraComparison = setInsightsCocktailComparison;
const selectInsightsEraCard = selectInsightsCocktailCard;

// Attach to window for inline HTML handlers
window.setInsightsTimeframe = setInsightsTimeframe;
window.setInsightsCompareMode = setInsightsCompareMode;
window.setInsightsCocktailComparison = setInsightsCocktailComparison;
window.selectInsightsCocktailCard = selectInsightsCocktailCard;
window.setInsightsEraComparison = setInsightsEraComparison;
window.selectInsightsEraCard = selectInsightsEraCard;
window.setRegimenContextFilter = setRegimenContextFilter;
window.toggleRegimenDrawer = toggleRegimenDrawer;

function renderZLogInsights() {
  const container = document.getElementById('zlog-subview-container');
  if (!container) return;

  const allEntries = storage.getAllZLogEntries();
  const titrationList = storage.getTitrationHistory();

  // Filter current & comparison sets
  const filteredData = getInsightsFilteredData(allEntries, zlogInsightsTimeframe, zlogInsightsCompareMode);
  const curEntries = filteredData.currentEntries;
  const cmpEntries = filteredData.compareEntries;

  const curStats = computePeriodStats(curEntries);
  const cmpStats = cmpEntries ? computePeriodStats(cmpEntries) : null;

  // Day-of-week stats
  const curDowStats = computeDowStats(curEntries);
  const cmpDowStats = cmpEntries ? computeDowStats(cmpEntries) : null;
  const dowShortNames = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
  const orderedDowDays = [1, 2, 3, 4, 5, 6, 0].map(key => curDowStats.find(d => d.dayIndex === key)).filter(Boolean);
  const minDowAggDay = [...curDowStats].sort((a, b) => a.pctAgg - b.pctAgg)[0];
  const maxDowAggDay = [...curDowStats].sort((a, b) => b.pctAgg - a.pctAgg)[0];

  // Cocktail stats with school day metrics & aggression-weighted sorting
  const rawCocktailList = CLINICAL_COCKTAILS.map(c => {
    const cEntries = allEntries.filter(e => e.date && e.date >= c.start && e.date <= c.end);
    const pStats = computeRegimenMetrics(cEntries);
    return { ...c, ...pStats };
  });

  // Sort cocktails: Lowest School Aggression Rate is #1
  const rankedCocktailList = [...rawCocktailList].sort((a, b) => {
    if (zlogRegimenContextFilter === 'school') {
      return a.pctSchoolAgg - b.pctSchoolAgg;
    } else if (zlogRegimenContextFilter === 'home') {
      return a.pctHomeAgg - b.pctHomeAgg;
    } else {
      const scoreA = a.pctSchoolAgg * 0.7 + a.pctAgg * 0.3;
      const scoreB = b.pctSchoolAgg * 0.7 + b.pctAgg * 0.3;
      return scoreA - scoreB;
    }
  });

  container.innerHTML = `
    <div class="zlog-insights-container">

      <!-- Dynamic Timeframe & Comparison Toolbar -->
      <div class="zlog-insights-toolbar">
        <div class="zlog-insights-controls">
          <div class="zlog-insights-control-item">
            <span class="zlog-insights-control-label">
              <i data-lucide="filter" style="width: 13px; height: 13px;"></i>
              Timeframe:
            </span>
            <select class="zlog-insights-select" onchange="setInsightsTimeframe(this.value)">
              <option value="all" ${zlogInsightsTimeframe === 'all' ? 'selected' : ''}>All Time (Full 2-Year Dataset)</option>
              <option value="3m" ${zlogInsightsTimeframe === '3m' ? 'selected' : ''}>Past 3 Months</option>
              <option value="6m" ${zlogInsightsTimeframe === '6m' ? 'selected' : ''}>Past 6 Months</option>
              <option value="12m" ${zlogInsightsTimeframe === '12m' ? 'selected' : ''}>Past 12 Months</option>
            </select>
          </div>

          <div class="zlog-insights-control-item">
            <span class="zlog-insights-control-label">
              <i data-lucide="git-compare" style="width: 13px; height: 13px;"></i>
              Compare:
            </span>
            <select class="zlog-insights-select" onchange="setInsightsCompareMode(this.value)">
              <option value="none" ${zlogInsightsCompareMode === 'none' ? 'selected' : ''}>None (Standard View)</option>
              <option value="prev" ${zlogInsightsCompareMode === 'prev' ? 'selected' : ''}>vs. Previous Period (Same Length)</option>
              <option value="baseline" ${zlogInsightsCompareMode === 'baseline' ? 'selected' : ''}>vs. All-Time Baseline (426d)</option>
            </select>
          </div>
        </div>

        <div class="zlog-insights-range-badge">
          <i data-lucide="calendar" style="width: 13px; height: 13px; color: var(--primary);"></i>
          <span><strong>Active Window:</strong> ${filteredData.currentRangeLabel} (${curStats.total} logs)</span>
          ${filteredData.compareLabel ? `<span style="opacity: 0.8; font-size: 0.68rem; margin-left: 4px;">· <em>vs. ${filteredData.compareLabel}</em></span>` : ''}
        </div>
      </div>

      <!-- Top Clinical Pulse Strip -->
      <div class="zlog-insights-card" style="background: linear-gradient(135deg, rgba(124, 92, 252, 0.05), rgba(78, 135, 101, 0.05));">
        <div class="zlog-insights-header">
          <div>
            <div class="zlog-insights-title">
              <i data-lucide="brain-circuit" style="color: var(--primary); width: 18px; height: 18px;"></i>
              <span>Behavioral Triangulation &amp; Clinical Insights</span>
            </div>
            <div class="zlog-insights-subtitle">
              Analyzing ${curStats.total} daily log entries in selected window across ${titrationList.length} titration milestones.
            </div>
          </div>
          <button type="button" class="btn btn-secondary" onclick="copyDoctorBrief()" style="font-size: 0.72rem; padding: 4px 10px;" title="Copy clean summary for Dr. Barness consultation">
            <i data-lucide="clipboard-copy" style="width: 13px; height: 13px;"></i>
            <span>Copy Dr. Barness Brief</span>
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; margin-top: 10px;">
          <div style="background: var(--bg-card); border: 1px solid var(--border-light); padding: 8px 10px; border-radius: var(--radius-sm);">
            <div style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Logged Days</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: baseline; gap: 6px;">
              <span>${curStats.total}</span>
              ${cmpStats ? `<span style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted);">vs ${cmpStats.total}</span>` : ''}
            </div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">${filteredData.currentRangeLabel}</div>
          </div>

          <div style="background: var(--bg-card); border: 1px solid var(--border-light); padding: 8px 10px; border-radius: var(--radius-sm);">
            <div style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: #10B981;">Good / Great Days</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #10B981; display: flex; align-items: center; gap: 6px;">
              <span>${curStats.pctGood}%</span>
              ${cmpStats ? formatDeltaBadge(curStats.pctGood, cmpStats.pctGood, true) : ''}
            </div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">${curStats.goodDays} of ${curStats.total} days ${cmpStats ? `(vs ${cmpStats.pctGood}%)` : ''}</div>
          </div>

          <div style="background: var(--bg-card); border: 1px solid var(--border-light); padding: 8px 10px; border-radius: var(--radius-sm);">
            <div style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: #EF4444;">Aggression Days</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #EF4444; display: flex; align-items: center; gap: 6px;">
              <span>${curStats.pctAgg}%</span>
              ${cmpStats ? formatDeltaBadge(curStats.pctAgg, cmpStats.pctAgg, false) : ''}
            </div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">${curStats.aggDays} of ${curStats.total} days ${cmpStats ? `(vs ${cmpStats.pctAgg}%)` : ''}</div>
          </div>

          <div style="background: var(--bg-card); border: 1px solid var(--border-light); padding: 8px 10px; border-radius: var(--radius-sm);">
            <div style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: var(--primary);">Avg Day Rating</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
              <span>${curStats.avgRating} <span style="font-size: 0.72rem; font-weight: 500; color: var(--text-muted);">/ 5.0</span></span>
              ${cmpStats ? formatDeltaBadge(Number(curStats.rawAvg), Number(cmpStats.rawAvg), true, '') : ''}
            </div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">${curStats.ratedCount} rated days ${cmpStats ? `(vs ${cmpStats.avgRating})` : ''}</div>
          </div>
        </div>
      </div>

      <!-- SECTION 1: Monthly Aggression & Meltdown Trendline (2025 - 2026) -->
      ${buildMonthlyTrendlineSection(allEntries)}

      <!-- SECTION 2: Medication Combination Scorecard (Ranked by Behavior Control) -->
      <div class="zlog-insights-card">
        <div class="zlog-insights-header" style="margin-bottom: 8px;">
          <div>
            <div class="zlog-insights-title">
              <i data-lucide="layers" style="color: #2563EB; width: 18px; height: 18px;"></i>
              <span>Medication Regimen Scorecard &amp; Efficacy</span>
            </div>
            <div class="zlog-insights-subtitle">
              Ranked primarily by <strong>lowest Aggression &amp; Meltdown Rate</strong>, factoring in high-demand <strong>School Days</strong> vs. Weekends &amp; Breaks.
            </div>
          </div>
          <span style="font-size: 0.70rem; font-weight: 700; color: #1D4ED8; background: #DBEAFE; padding: 3px 10px; border-radius: var(--radius-full); border: 1px solid #BFDBFE;">
            5 Regimens Tested
          </span>
        </div>

        <!-- Filter Context Pills (All vs School vs Home) -->
        <div class="zlog-context-toggle-bar">
          <div style="font-size: 0.72rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
            <span>Ranking Focus:</span>
          </div>
          <div class="zlog-context-pills">
            <button type="button" class="zlog-context-pill ${zlogRegimenContextFilter === 'all' ? 'active' : ''}" onclick="setRegimenContextFilter('all')">
              ⚖️ Weighted (70% School + 30% Overall)
            </button>
            <button type="button" class="zlog-context-pill ${zlogRegimenContextFilter === 'school' ? 'active' : ''}" onclick="setRegimenContextFilter('school')">
              🏫 School Days Only (Primary)
            </button>
            <button type="button" class="zlog-context-pill ${zlogRegimenContextFilter === 'home' ? 'active' : ''}" onclick="setRegimenContextFilter('home')">
              🏡 Weekends &amp; Breaks
            </button>
          </div>
        </div>

        <!-- Option 1: Minimalist Regimen Row Cards -->
        <div class="zlog-regimen-list">
          ${rankedCocktailList.map((c, idx) => {
            const isExpanded = zlogExpandedRegimenId === c.id;
            const schoolVal = c.pctSchoolAgg;
            const heroColorCls = schoolVal <= 15 ? 'low' : (schoolVal <= 30 ? 'med' : 'high');
            
            // Clean status tag
            let statusTagHtml = '';
            if (idx === 0) {
              statusTagHtml = `<span style="font-size: 0.68rem; font-weight: 700; color: #059669; background: rgba(16, 185, 129, 0.12); padding: 2px 8px; border-radius: var(--radius-full);">★ Best Regulation</span>`;
            } else if (c.id === 'cocktail_spring_focus') {
              statusTagHtml = `<span style="font-size: 0.68rem; font-weight: 700; color: #0D9488; background: rgba(13, 148, 136, 0.12); padding: 2px 8px; border-radius: var(--radius-full);">Solid Focus</span>`;
            } else if (c.id === 'cocktail_baseline_floor') {
              statusTagHtml = `<span style="font-size: 0.68rem; font-weight: 700; color: #1E40AF; background: #DBEAFE; padding: 2px 8px; border-radius: var(--radius-full); border: 1px solid #BFDBFE;">Baseline Floor</span>`;
            } else if (c.id === 'cocktail_sertraline_boost') {
              statusTagHtml = `<span style="font-size: 0.68rem; font-weight: 700; color: #DC2626; background: rgba(239, 68, 68, 0.10); padding: 2px 8px; border-radius: var(--radius-full);">⚠️ Crisis Risk (Sep 11)</span>`;
            } else if (c.id === 'cocktail_early_baseline') {
              statusTagHtml = `<span style="font-size: 0.68rem; font-weight: 700; color: #DC2626; background: rgba(239, 68, 68, 0.10); padding: 2px 8px; border-radius: var(--radius-full);">Unbuffered</span>`;
            }

            // Clean formula string
            const formulaStr = c.meds.map(m => `${m.name} ${m.dose}`).join(' · ');

            return `
              <div class="zlog-regimen-card ${idx === 0 ? 'is-best' : ''}" onclick="toggleRegimenDrawer('${c.id}')">
                <div class="zlog-regimen-card-main">
                  <div class="zlog-regimen-card-left">
                    <div class="zlog-rank-circle ${idx === 0 ? 'best' : ''}">
                      #${idx + 1}
                    </div>
                    <div class="zlog-regimen-info-col">
                      <div class="zlog-regimen-title-row">
                        <span class="zlog-regimen-title">${c.title}</span>
                        ${statusTagHtml}
                      </div>
                      <div class="zlog-regimen-formula-text" title="${formulaStr}">
                        ${formulaStr} <span style="color: var(--text-muted); font-size: 0.68rem;">(${c.dates})</span>
                      </div>
                    </div>
                  </div>

                  <div class="zlog-regimen-card-right">
                    <div class="zlog-regimen-stat-block">
                      <div class="zlog-regimen-stat-val ${heroColorCls}">
                        ${schoolVal}%
                      </div>
                      <div class="zlog-regimen-stat-label">School Meltdowns</div>
                      <div class="zlog-regimen-stat-sub">${c.schoolAgg} of ${c.schoolTotal} school days</div>
                    </div>
                    <div class="zlog-regimen-chevron ${isExpanded ? 'open' : ''}">
                      <i data-lucide="chevron-down" style="width: 16px; height: 16px;"></i>
                    </div>
                  </div>
                </div>

                ${isExpanded ? `
                  <div class="zlog-regimen-card-drawer" onclick="event.stopPropagation()">
                    <div class="zlog-drawer-grid">
                      <div class="zlog-drawer-stat-pill">
                        <div class="zlog-drawer-stat-pill-label">🏫 School Aggression</div>
                        <div class="zlog-drawer-stat-pill-val" style="color: ${schoolVal <= 15 ? '#059669' : (schoolVal <= 30 ? '#7C5CFC' : '#DC2626')};">
                          ${c.pctSchoolAgg}% <span style="font-size: 0.68rem; font-weight: 500; color: var(--text-muted);">(${c.schoolAgg}/${c.schoolTotal}d)</span>
                        </div>
                      </div>
                      <div class="zlog-drawer-stat-pill">
                        <div class="zlog-drawer-stat-pill-label">🏡 Home &amp; Breaks</div>
                        <div class="zlog-drawer-stat-pill-val" style="color: ${c.pctHomeAgg <= 15 ? '#059669' : (c.pctHomeAgg <= 30 ? '#7C5CFC' : '#DC2626')};">
                          ${c.pctHomeAgg}% <span style="font-size: 0.68rem; font-weight: 500; color: var(--text-muted);">(${c.homeAgg}/${c.homeTotal}d)</span>
                        </div>
                      </div>
                      <div class="zlog-drawer-stat-pill">
                        <div class="zlog-drawer-stat-pill-label">☀️ Good Days (≥4★)</div>
                        <div class="zlog-drawer-stat-pill-val" style="color: #059669;">
                          ${c.pctGood}% <span style="font-size: 0.68rem; font-weight: 500; color: var(--text-muted);">(${c.goodDays}/${c.total}d)</span>
                        </div>
                      </div>
                      <div class="zlog-drawer-stat-pill">
                        <div class="zlog-drawer-stat-pill-label">📊 Days Tested</div>
                        <div class="zlog-drawer-stat-pill-val">
                          ${c.total} days <span style="font-size: 0.68rem; font-weight: 500; color: var(--text-muted);">(Avg: ${c.avgRating}★)</span>
                        </div>
                      </div>
                    </div>
                    <div style="font-size: 0.74rem; line-height: 1.45; color: var(--text-secondary); margin-top: 4px;">
                      <strong>Clinical Context:</strong> ${c.summary}
                    </div>
                    <div style="font-size: 0.73rem; line-height: 1.4; color: var(--primary); font-weight: 600; margin-top: 4px;">
                      💡 ${c.clinicalNote}
                    </div>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>


      </div>

      <!-- SECTION 3: Day-of-Week Meltdown Volatility (Option 1: 7-Day Strip) -->
      <div class="zlog-insights-card">
        <div class="zlog-insights-header">
          <div>
            <div class="zlog-insights-title">
              <i data-lucide="calendar" style="color: #3B82F6; width: 18px; height: 18px;"></i>
              <span>Day-of-Week Meltdown Volatility</span>
            </div>
            <div class="zlog-insights-subtitle">
              Weekly distribution across days in <strong>${filteredData.currentRangeLabel}</strong>${cmpStats ? ` compared to <em>${filteredData.compareLabel}</em>` : ''}.
            </div>
          </div>
        </div>

        <div class="zlog-dow-strip">
          ${orderedDowDays.map(d => {
            const cmpD = cmpDowStats ? cmpDowStats.find(c => c.dayIndex === d.dayIndex) : null;
            const shortName = dowShortNames[d.dayIndex] || d.name.substring(0, 3);
            const isCalmest = minDowAggDay && d.dayIndex === minDowAggDay.dayIndex && d.pctAgg <= 15;
            const isSpike = maxDowAggDay && d.dayIndex === maxDowAggDay.dayIndex && d.pctAgg >= 30;

            let tagText = 'Steady';
            let tagCls = 'neutral';
            if (isCalmest) {
              tagText = '★ Calm';
              tagCls = 'good';
            } else if (isSpike) {
              tagText = '⚠️ Spike';
              tagCls = 'risk';
            } else if (d.dayIndex === 1) { // Monday
              tagText = 'Re-entry';
              tagCls = 'risk';
            } else if (d.dayIndex === 4 && d.pctAgg >= 30) { // Thursday
              tagText = 'Fatigue';
              tagCls = 'risk';
            } else if (d.dayIndex === 0) { // Sunday
              tagText = 'Reset';
              tagCls = 'neutral';
            } else if (d.highlight === 'good') {
              tagCls = 'good';
            } else if (d.highlight === 'agg') {
              tagCls = 'risk';
            }

            const heroCls = d.pctAgg <= 15 ? 'low' : (d.pctAgg <= 30 ? 'med' : 'high');
            const cardCls = isCalmest ? 'is-calmest' : (isSpike ? 'is-spike' : '');

            return `
              <div class="zlog-dow-card ${cardCls}">
                <div class="zlog-dow-day-title">${shortName}</div>
                <div class="zlog-dow-pill-tag ${tagCls}">${tagText}</div>
                <div class="zlog-dow-hero-stat ${heroCls}">${d.pctAgg}%</div>
                <div class="zlog-dow-hero-label">Meltdowns</div>
                <div class="zlog-dow-sub-stat">
                  <strong style="color: #059669;">${d.pctGood}%</strong> Good
                  <div style="font-size: 0.62rem; color: var(--text-muted); margin-top: 1px;">${d.agg} of ${d.total}d</div>
                </div>
                ${cmpD ? `
                  <div class="zlog-dow-sub-cmp">
                    vs cmp: ${formatDeltaBadge(d.pctAgg, cmpD.pctAgg, false)}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- SECTION 4: Evidence-Based Playbook ("What the Data Shows Works") -->
      <div class="zlog-insights-card" style="border-left: 4px solid #10B981;">
        <div class="zlog-insights-header">
          <div>
            <div class="zlog-insights-title" style="color: #059669;">
              <i data-lucide="check-check" style="width: 18px; height: 18px;"></i>
              <span>Evidence-Based Playbook: What the Data Shows Works</span>
            </div>
            <div class="zlog-insights-subtitle">
              Actionable interventions and proactive habits proven by recent behavioral patterns and longitudinal logs to prevent meltdowns and support regulation.
            </div>
          </div>
          <span style="font-size: 0.70rem; font-weight: 700; color: #059669; background: rgba(16, 185, 129, 0.1); padding: 2px 8px; border-radius: var(--radius-full);">
            8 Core Strategies
          </span>
        </div>

        <div class="zlog-playbook-grid">
          <!-- Item 1: Bridge Snack -->
          <div class="zlog-playbook-item">
            <div class="zlog-playbook-top">
              <span class="zlog-playbook-tag tag-food">Glucose &amp; Appetite</span>
              <span class="zlog-playbook-proof">Hunger Crash Trigger</span>
            </div>
            <div class="zlog-playbook-title">1. The 2:30 PM Pre-Dismissal "Bridge Snack"</div>
            <div class="zlog-playbook-desc">
              Stimulants suppress midday appetite (e.g. Sep 11: <em>"only had some grapes for lunch"</em>). By 3:30 PM dismissal, low blood sugar converges with medication wear-off, stripping away emotional reserve.
            </div>
            <div class="zlog-playbook-action">
              <strong>Action:</strong> Mandate a high-calorie protein shake, smoothie pouch, or preferred snack at 2:30 PM before dismissal so he never enters after-care in a hypoglycemic state.
            </div>
          </div>

          <!-- Item 2: Transitional Anchor -->
          <div class="zlog-playbook-item">
            <div class="zlog-playbook-top">
              <span class="zlog-playbook-tag tag-transition">Transitions</span>
              <span class="zlog-playbook-proof">#1 Crisis Setting (148 Days)</span>
            </div>
            <div class="zlog-playbook-title">2. After-Care "Transitional Anchor" Protocol</div>
            <div class="zlog-playbook-desc">
              Moving from school into after-care or the car is the most common setting for acute refusals. Unannounced staff changes or sudden verbal orders to leave trigger panic and freeze/flight.
            </div>
            <div class="zlog-playbook-action">
              <strong>Action:</strong> Provide a designated comfort object in hand ("Baby Bear" or book) + a 10-minute visual countdown timer. Allow checking in with a familiar adult (Michelle) instead of abrupt exits.
            </div>
          </div>

          <!-- Item 3: 11 AM Ritalin Booster -->
          <div class="zlog-playbook-item">
            <div class="zlog-playbook-top">
              <span class="zlog-playbook-tag tag-med">Med Timing</span>
              <span class="zlog-playbook-proof">Teacher Log: 12:45 PM Drop</span>
            </div>
            <div class="zlog-playbook-title">3. The 11:00 AM Ritalin Booster Timing</div>
            <div class="zlog-playbook-desc">
              Teacher feedback pinpoints a consistent dip: <em>"Around 12:45 there tends to be a shift in his mood and focus and he requires more redirection."</em>
            </div>
            <div class="zlog-playbook-action">
              <strong>Action:</strong> Maintain the 11:00 AM school booster (10mg) to bridge through early afternoon classes and prevent the afternoon cognitive rebound crash.
            </div>
          </div>

          <!-- Item 4: Saturday Structure -->
          <div class="zlog-playbook-item">
            <div class="zlog-playbook-top">
              <span class="zlog-playbook-tag tag-sensory">Weekend Rhythm</span>
              <span class="zlog-playbook-proof">Saturday Aggression: 47%</span>
            </div>
            <div class="zlog-playbook-title">4. Saturday Morning Structured Heavy Work</div>
            <div class="zlog-playbook-desc">
              Saturdays have the highest aggression rate of the entire week (47%) due to the abrupt loss of the school timetable and open-ended screen negotiations.
            </div>
            <div class="zlog-playbook-action">
              <strong>Action:</strong> Establish a visual Saturday morning schedule: Breakfast &amp; Meds &rarr; Ninja/park physical heavy work &rarr; LEGO building &rarr; Screen time block.
            </div>
          </div>

          <!-- Item 5: Solitary Decompression Flow -->
          <div class="zlog-playbook-item">
            <div class="zlog-playbook-top">
              <span class="zlog-playbook-tag tag-transition">Decompression</span>
              <span class="zlog-playbook-proof">54% of Great Days</span>
            </div>
            <div class="zlog-playbook-title">5. Post-School Solitary Flow State</div>
            <div class="zlog-playbook-desc">
              After 6+ hours of cognitive and social masking at school, verbal questions (<em>"How was school? Did you do homework?"</em>) immediately trigger defensive pushback.
            </div>
            <div class="zlog-playbook-action">
              <strong>Action:</strong> Protect 30–45 minutes of zero-demand solitary flow upon arriving home: LEGO building, reading, or listening to <em>Greeking Out</em> with Mocha.
            </div>
          </div>

          <!-- Item 6: Proprioceptive Heavy Work -->
          <div class="zlog-playbook-item">
            <div class="zlog-playbook-top">
              <span class="zlog-playbook-tag tag-sensory">Sensory Grounding</span>
              <span class="zlog-playbook-proof">Consistent Stabilizer</span>
            </div>
            <div class="zlog-playbook-title">6. Proprioceptive Resistance (Ninja &amp; Pool)</div>
            <div class="zlog-playbook-desc">
              Deep muscle and joint input discharges physical tension, lowers cortisol, and calms central nervous system arousal.
            </div>
            <div class="zlog-playbook-action">
              <strong>Action:</strong> Maintain martial arts/Ninja sessions and swimming as non-negotiable weekly regulators, especially following challenging school days.
            </div>
          </div>

          <!-- Item 7: Screen-Off Runway -->
          <div class="zlog-playbook-item">
            <div class="zlog-playbook-top">
              <span class="zlog-playbook-tag tag-screen">Boundaries</span>
              <span class="zlog-playbook-proof">192 Days / 39% Agg</span>
            </div>
            <div class="zlog-playbook-title">7. Screen-Off Runway &amp; Tactile Replacement</div>
            <div class="zlog-playbook-desc">
              Conflict almost never happens while playing screens; it occurs when screens are abruptly turned off without a dopamine replacement.
            </div>
            <div class="zlog-playbook-action">
              <strong>Action:</strong> Use a visual sand timer (5m &amp; 2m warnings) paired with an immediate tactile replacement: <em>"When the timer rings, let's open the new LEGO bag or take Mocha outside."</em>
            </div>
          </div>

          <!-- Item 8: Proactive Food Outings -->
          <div class="zlog-playbook-item">
            <div class="zlog-playbook-top">
              <span class="zlog-playbook-tag tag-food">De-escalation</span>
              <span class="zlog-playbook-proof">Rapid Reset in Logs</span>
            </div>
            <div class="zlog-playbook-title">8. Proactive Dopamine &amp; Glucose Resets</div>
            <div class="zlog-playbook-desc">
              Outings to Tokyo Sushi, pizza, or Dunkin' consistently reset his mood after high-friction days by combining glucose restoration with a pleasant, non-demanding sensory space.
            </div>
            <div class="zlog-playbook-action">
              <strong>Action:</strong> Proactively schedule food outings on high-stress days (e.g. IEP meetings, doctor visits) before dysregulation peaks.
            </div>
          </div>
        </div>
      </div>

    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}


function copyDoctorBrief() {
  const allEntries = storage.getAllZLogEntries();
  const titrationList = storage.getTitrationHistory();
  const filtered = getInsightsFilteredData(allEntries, zlogInsightsTimeframe, zlogInsightsCompareMode);
  const curStats = computePeriodStats(filtered.currentEntries);

  const windowHeader = zlogInsightsTimeframe !== 'all'
    ? `Active Focus Window: ${filtered.currentRangeLabel} (${curStats.total} Logs | Good: ${curStats.pctGood}% | Aggression: ${curStats.pctAgg}% | Avg: ${curStats.avgRating}/5.0)\nFull Historical Dataset: ${allEntries.length} Daily Logs (Sep 2024 - Sep 2026) | ${titrationList.length} Titration Events`
    : `Analyzed Dataset: ${allEntries.length} Daily Logs (Sep 2024 - Sep 2026) | ${titrationList.length} Titration Events\nLongitudinal Rate: Good/Great Days: ${curStats.pctGood}% | Aggression Rate: ${curStats.pctAgg}% | Avg Rating: ${curStats.avgRating}/5.0`;

  const briefText = `Z LOG CLINICAL APPOINTMENT BRIEF (Dr. Barness)
${windowHeader}

1. TOP MEDICATION COMBINATION FINDINGS (COCKTAIL LEADERBOARD):
- #1 Peak Efficacy (72% Good Days · 15% Aggression): 4-Pillar Synergy (Zoloft 50mg + Guanfacine 2mg XR + Ritalin 25mg [15 AM + 10 School] + Risperdal 0.125mg). Proves optimal stability when midday executive focus is paired with a low-dose emotional brake floor.
- Midday Ritalin Booster Impact: Adding the 11:00 AM school booster (10mg) lifted Good Days from 56% to 72% (+16%) and cut aggression from 32% to 15% by eliminating the 12:45 PM focus collapse.
- Stopping Risperdal Under School Demands: Removing the daily 0.125-0.25mg brake (even with Sertraline increased to 75mg) precipitated severe after-care refusals and the Sep 11 crisis, showing Sertraline cannot substitute for the behavioral impulse brake.
- Early Monotherapy Baseline: Initial Sertraline + Guanfacine IR yielded only 46% Good Days and 48% aggression frequency.

2. TOP ANTECEDENTS & TRIGGERS:
- #1 Setting for Crisis: After-care & dismissal transitions (cognitive fatigue + unfamiliar staff).
- Midday Hunger Crash: Stimulant appetite suppression leaves child with near-zero lunch ("only grapes"). By 3:30pm wear-off, severe hypoglycemia triggers meltdowns.
- Saturday Spike: Saturdays exhibit 47% aggression rate (vs 32% weekday average) due to loss of external school structure and screen boundary conflicts.

3. EVIDENCE-BASED PROVEN PROTECTIVE PROTOCOLS:
- 2:30 PM Pre-Dismissal Bridge Snack (protein shake/pouch) to eliminate hypoglycemia.
- Visual Transitional Anchor ("Baby Bear" or book) + 10-minute timer for after-care dismissals.
- 30-minute solitary decompression (LEGOs, Greeking Out audiobooks) immediately after school.
- Structured Saturday morning physical heavy work (Ninja/swimming) before screens.`;

  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(briefText).then(() => {
      if (typeof showToast === 'function') showToast("Copied Dr. Barness Clinical Brief to clipboard!", "success");
    }).catch(() => {
      prompt("Copy Dr. Barness Brief:", briefText);
    });
  } else {
    prompt("Copy Dr. Barness Brief:", briefText);
  }
}

let zlogShowMonthlyTable = false;

function toggleMonthlyBreakdownTable() {
  zlogShowMonthlyTable = !zlogShowMonthlyTable;
  const container = document.getElementById('zlog-monthly-table-container');
  const btnText = document.getElementById('zlog-toggle-table-btn-text');
  const icon = document.getElementById('zlog-toggle-table-icon');
  if (container) {
    container.style.display = zlogShowMonthlyTable ? 'block' : 'none';
  }
  if (btnText) {
    btnText.textContent = zlogShowMonthlyTable ? 'Hide Monthly Table' : 'View Full Monthly Breakdown Table';
  }
  if (icon) {
    icon.style.transform = zlogShowMonthlyTable ? 'rotate(180deg)' : 'rotate(0deg)';
  }
}

function buildMonthlyTrendlineSection(entries) {
  // Aggregate all entries by month
  const monthMap = {};
  entries.forEach(e => {
    if (!e.date) return;
    const m = e.date.substring(0, 7);
    if (!monthMap[m]) {
      monthMap[m] = {
        monthKey: m,
        total: 0,
        agg: 0,
        good: 0,
        ratingSum: 0,
        ratedCount: 0
      };
    }
    monthMap[m].total++;
    if (e.aggression) monthMap[m].agg++;
    if (e.rating) {
      monthMap[m].ratingSum += e.rating;
      monthMap[m].ratedCount++;
      if (e.rating >= 4) monthMap[m].good++;
    }
  });

  const displayMonths = Object.keys(monthMap)
    .filter(m => m >= '2025-04' && m <= '2026-09')
    .sort();

  const monthNames = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
    '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
  };

  const milestones = {
    '2025-04': { label: "Sertraline Start", note: "Sertraline liquid started (.25ml/5mg)", tag: "Trial Start" },
    '2025-08': { label: "Guanfacine Added", note: "Guanfacine added to regimen", tag: "Med Added" },
    '2025-09': { label: "67% Peak Crisis", note: "School year start; 20 incident days out of 30", tag: "🚨 Peak Crisis", isPeak: true },
    '2025-10': { label: "Guanfacine Titration", note: "Guanfacine titrated to 2mg", tag: "Titration" },
    '2025-11': { label: "Risperdal Started", note: "Risperdal started Nov 24; stabilizing floor begins", tag: "💊 Risperdal Started", isKey: true },
    '2025-12': { label: "Winter Dysregulation", note: "Holiday disruption & winter break", tag: "Holiday Dip" },
    '2026-01': { label: "Ritalin Added", note: "Ritalin IR added for midday school focus", tag: "⚡ Ritalin Added", isKey: true },
    '2026-02': { label: "Stabilization Drop", note: "Aggression drops from 42% to 29%", tag: "Stabilization" },
    '2026-03': { label: "Consistent Floor", note: "Stable 26% aggression rate", tag: "Stable" },
    '2026-04': { label: "Consistent Floor", note: "Stable 27% aggression rate", tag: "Stable" },
    '2026-05': { label: "Consistent Floor", note: "Stable 26% aggression rate; high school momentum", tag: "Stable" },
    '2026-06': { label: "13% Annual Low", note: "Lowest aggression of the year (only 4 incidents)", tag: "🌟 Annual Low", isBest: true },
    '2026-07': { label: "Travel Transitions", note: "Summer camp & travel schedule friction (35% agg)", tag: "Travel Friction" },
    '2026-08': { label: "Risperdal Weaned", note: "Halved and then stopped Aug 15", tag: "Weaned" },
    '2026-09': { label: "Re-entry Crisis", note: "After-care crisis without med buffer -> restarted 0.25mg", tag: "🔄 Restart 0.25mg", isKey: true }
  };

  const chartW = 920;
  const chartH = 220;
  const padX = 46;
  const padYTop = 50;
  const padYBot = 42;
  const plotW = chartW - 2 * padX;
  const plotH = chartH - padYTop - padYBot;
  const n = displayMonths.length;
  const maxRate = 80;

  const points = [];
  const barsSvg = [];
  const nodesSvg = [];
  const labelsSvg = [];
  const xLabelsSvg = [];
  const flagsSvg = [];

  displayMonths.forEach((mKey, i) => {
    const m = monthMap[mKey];
    const aggPct = m.total > 0 ? Math.round((m.agg / m.total) * 100) : 0;
    const goodPct = m.total > 0 ? Math.round((m.good / m.total) * 100) : 0;
    const avgRating = m.ratedCount > 0 ? (m.ratingSum / m.ratedCount).toFixed(1) : '—';
    const parts = mKey.split('-');
    const yr = parts[0].slice(2);
    const mo = monthNames[parts[1]] || parts[1];
    const xLabel = (parts[1] === '01' || parts[1] === '09' || i === 0 || i === n - 1) ? `${mo} '${yr}` : mo;

    const x = padX + (i / (n - 1)) * plotW;
    const y = padYTop + (1.0 - (aggPct / maxRate)) * plotH;
    points.push({ x, y, mKey, aggPct, agg: m.agg, total: m.total });

    // Bar for raw incident count (max scale 22)
    const barW = Math.max(16, Math.floor(plotW / n) - 12);
    const barH = Math.max(4, (m.agg / 22) * plotH);
    const barX = x - barW / 2;
    const barY = padYTop + plotH - barH;

    const ms = milestones[mKey];
    const barFill = ms && ms.isPeak ? 'rgba(239, 68, 68, 0.42)' : (ms && ms.isBest ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.16)');
    const barStroke = ms && ms.isPeak ? '#DC2626' : (ms && ms.isBest ? '#059669' : 'rgba(239, 68, 68, 0.38)');

    barsSvg.push(`
      <rect class="zlog-trendline-bar" x="${barX.toFixed(1)}" y="${barY.toFixed(1)}" width="${barW}" height="${barH.toFixed(1)}" rx="3"
            fill="${barFill}" stroke="${barStroke}" stroke-width="1">
        <title>${mo} 20${yr}: ${m.agg} incident days (${aggPct}% of logged days)\nTotal days: ${m.total} | Good days: ${goodPct}% | Avg rating: ${avgRating}${ms ? '\nNote: ' + ms.note : ''}</title>
      </rect>
      <text x="${x.toFixed(1)}" y="${(barY - 3).toFixed(1)}" font-size="8.5" font-family="monospace" fill="var(--text-muted)" text-anchor="middle">
        ${m.agg}d
      </text>
    `);

    // Trendline Node circle
    const nodeStroke = ms && ms.isPeak ? '#991B1B' : (ms && ms.isBest ? '#065F46' : '#DC2626');
    const nodeFill = ms && ms.isPeak ? '#EF4444' : (ms && ms.isBest ? '#10B981' : '#FFFFFF');
    nodesSvg.push(`
      <circle class="zlog-trendline-node" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(ms && (ms.isPeak || ms.isBest)) ? 6.5 : 4.5}"
              fill="${nodeFill}" stroke="${nodeStroke}" stroke-width="2.5">
        <title>${mo} 20${yr}: ${aggPct}% Aggression Rate (${m.agg}/${m.total} days)</title>
      </circle>
    `);

    // Data label %
    const labelY = y < padYTop + 14 ? y + 14 : y - 8;
    labelsSvg.push(`
      <text x="${x.toFixed(1)}" y="${labelY.toFixed(1)}" font-size="9.5" font-weight="800" font-family="var(--font-mono, monospace)"
            fill="${ms && ms.isPeak ? '#DC2626' : (ms && ms.isBest ? '#059669' : 'var(--text-primary)')}" text-anchor="middle">
        ${aggPct}%
      </text>
    `);

    // X-axis label
    xLabelsSvg.push(`
      <text x="${x.toFixed(1)}" y="${(padYTop + plotH + 18).toFixed(1)}" font-size="9" font-weight="${(parts[1] === '01' || parts[1] === '09') ? '700' : '500'}"
            fill="${(parts[1] === '01' || parts[1] === '09') ? 'var(--text-primary)' : 'var(--text-muted)'}" text-anchor="middle">
        ${xLabel}
      </text>
    `);

    // Milestone flag badge
    if (ms && (ms.isPeak || ms.isBest || ms.isKey)) {
      const flagColor = ms.isPeak ? '#DC2626' : (ms.isBest ? '#059669' : '#7C5CFC');
      const flagBg = ms.isPeak ? '#FEE2E2' : (ms.isBest ? '#D1FAE5' : '#EDE9FE');
      const flagText = ms.tag;
      const tagW = flagText.length * 5.8 + 12;
      flagsSvg.push(`
        <g transform="translate(${x.toFixed(1)}, ${padYTop - 28})">
          <line x1="0" y1="14" x2="0" y2="${(y - (padYTop - 28)).toFixed(1)}" stroke="${flagColor}" stroke-dasharray="2,2" stroke-width="1.2" opacity="0.65"/>
          <rect x="${-tagW / 2}" y="-2" width="${tagW}" height="16" rx="8" fill="${flagBg}" stroke="${flagColor}" stroke-width="0.8"/>
          <text x="0" y="9.5" font-size="8" font-weight="700" fill="${flagColor}" text-anchor="middle">${flagText}</text>
        </g>
      `);
    }
  });

  const polyPoints = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPoints = `${points[0].x.toFixed(1)},${(padYTop + plotH).toFixed(1)} ${polyPoints} ${points[points.length - 1].x.toFixed(1)},${(padYTop + plotH).toFixed(1)}`;

  // Table rows HTML
  const tableRowsHtml = displayMonths.map(mKey => {
    const m = monthMap[mKey];
    const aggPct = m.total > 0 ? Math.round((m.agg / m.total) * 100) : 0;
    const goodPct = m.total > 0 ? Math.round((m.good / m.total) * 100) : 0;
    const avgRating = m.ratedCount > 0 ? (m.ratingSum / m.ratedCount).toFixed(1) : '—';
    const parts = mKey.split('-');
    const yr = parts[0];
    const mo = monthNames[parts[1]] || parts[1];
    const ms = milestones[mKey];

    return `
      <tr>
        <td style="font-weight: 700; white-space: nowrap;">
          ${mo} ${yr}
          ${ms ? `<span style="font-size: 0.65rem; padding: 1px 6px; border-radius: 4px; margin-left: 4px; ${ms.isPeak ? 'background: #FEE2E2; color: #DC2626;' : (ms.isBest ? 'background: #D1FAE5; color: #059669;' : 'background: #EDE9FE; color: #7C5CFC;')} font-weight: 600;">${ms.tag}</span>` : ''}
        </td>
        <td style="font-family: monospace;">${m.total}d</td>
        <td>
          <div class="zlog-monthly-bar-track">
            <div class="zlog-monthly-bar-fill-agg" style="width: ${aggPct}%;"></div>
          </div>
          <span style="font-weight: 700; color: ${aggPct >= 40 ? '#DC2626' : (aggPct <= 20 ? '#059669' : 'var(--text-primary)')}; font-family: monospace;">
            ${m.agg}d (${aggPct}%)
          </span>
        </td>
        <td>
          <div class="zlog-monthly-bar-track">
            <div class="zlog-monthly-bar-fill-good" style="width: ${goodPct}%;"></div>
          </div>
          <span style="font-family: monospace; color: #059669; font-weight: 600;">${goodPct}%</span>
        </td>
        <td style="font-family: monospace; font-weight: 600;">${avgRating}</td>
        <td style="color: var(--text-secondary); font-size: 0.72rem;">${ms ? ms.note : 'Standard school/home routine'}</td>
      </tr>
    `;
  }).reverse().join('');

  return `
    <div class="zlog-insights-card" style="border-left: 4px solid #EF4444;">
      <div class="zlog-insights-header">
        <div>
          <div class="zlog-insights-title" style="color: #DC2626;">
            <i data-lucide="trending-down" style="width: 18px; height: 18px;"></i>
            <span>Monthly Aggression &amp; Meltdown Trendline (2025 – 2026)</span>
          </div>
          <div class="zlog-insights-subtitle">
            Longitudinal monthly progression of aggression/meltdown incident days and rate (%) against clinical medication milestones.
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 0.70rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
            <span style="display: inline-block; width: 10px; height: 10px; background: rgba(239, 68, 68, 0.25); border: 1px solid #EF4444; border-radius: 2px;"></span>
            Bar = Incident Days
          </span>
          <span style="font-size: 0.70rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
            <span style="display: inline-block; width: 12px; height: 2px; background: #EF4444;"></span>
            Line = Volatility %
          </span>
        </div>
      </div>

      <!-- Trendline KPI Strip -->
      <div class="zlog-trendline-kpi-grid">
        <div class="zlog-trendline-kpi" style="border-left: 3px solid #DC2626;">
          <div class="zlog-trendline-kpi-label">Peak Crisis Month</div>
          <div class="zlog-trendline-kpi-val" style="color: #DC2626;">67%</div>
          <div class="zlog-trendline-kpi-sub">Sep 2025 (20 incident days)</div>
        </div>
        <div class="zlog-trendline-kpi" style="border-left: 3px solid #7C5CFC;">
          <div class="zlog-trendline-kpi-label">Stabilization Window</div>
          <div class="zlog-trendline-kpi-val" style="color: #7C5CFC;">26%</div>
          <div class="zlog-trendline-kpi-sub">Feb – Jun 2026 (Risperdal Active)</div>
        </div>
        <div class="zlog-trendline-kpi" style="border-left: 3px solid #059669;">
          <div class="zlog-trendline-kpi-label">Annual Low Month</div>
          <div class="zlog-trendline-kpi-val" style="color: #059669;">13%</div>
          <div class="zlog-trendline-kpi-sub">Jun 2026 (4 incident days)</div>
        </div>
        <div class="zlog-trendline-kpi" style="border-left: 3px solid #D97768;">
          <div class="zlog-trendline-kpi-label">Current Month</div>
          <div class="zlog-trendline-kpi-val" style="color: #D97768;">27%</div>
          <div class="zlog-trendline-kpi-sub">Sep 2026 (3/11d &middot; Restarted 0.25mg)</div>
        </div>
      </div>

      <!-- Responsive SVG Chart -->
      <div class="zlog-trendline-svg-wrap">
        <svg class="zlog-trendline-svg" viewBox="0 0 ${chartW} ${chartH}">
          <defs>
            <linearGradient id="zlogAggLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#DC2626" />
              <stop offset="60%" stop-color="#EF4444" />
              <stop offset="100%" stop-color="#F87171" />
            </linearGradient>
            <linearGradient id="zlogAggAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(239, 68, 68, 0.25)" />
              <stop offset="100%" stop-color="rgba(239, 68, 68, 0.00)" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid Lines -->
          <line x1="${padX}" y1="${padYTop}" x2="${chartW - padX}" y2="${padYTop}" stroke="var(--border-light)" stroke-dasharray="2,2" stroke-width="1" />
          <text x="${padX - 8}" y="${padYTop + 3}" font-size="8" fill="var(--text-muted)" text-anchor="end">80%</text>

          <line x1="${padX}" y1="${(padYTop + plotH * 0.25).toFixed(1)}" x2="${chartW - padX}" y2="${(padYTop + plotH * 0.25).toFixed(1)}" stroke="var(--border-light)" stroke-dasharray="2,2" stroke-width="1" />
          <text x="${padX - 8}" y="${(padYTop + plotH * 0.25 + 3).toFixed(1)}" font-size="8" fill="var(--text-muted)" text-anchor="end">60%</text>

          <line x1="${padX}" y1="${(padYTop + plotH * 0.50).toFixed(1)}" x2="${chartW - padX}" y2="${(padYTop + plotH * 0.50).toFixed(1)}" stroke="var(--border-light)" stroke-dasharray="2,2" stroke-width="1" />
          <text x="${padX - 8}" y="${(padYTop + plotH * 0.50 + 3).toFixed(1)}" font-size="8" fill="var(--text-muted)" text-anchor="end">40%</text>

          <line x1="${padX}" y1="${(padYTop + plotH * 0.75).toFixed(1)}" x2="${chartW - padX}" y2="${(padYTop + plotH * 0.75).toFixed(1)}" stroke="var(--border-light)" stroke-dasharray="2,2" stroke-width="1" />
          <text x="${padX - 8}" y="${(padYTop + plotH * 0.75 + 3).toFixed(1)}" font-size="8" fill="var(--text-muted)" text-anchor="end">20%</text>

          <line x1="${padX}" y1="${(padYTop + plotH).toFixed(1)}" x2="${chartW - padX}" y2="${(padYTop + plotH).toFixed(1)}" stroke="var(--border-color)" stroke-width="1.2" />
          <text x="${padX - 8}" y="${(padYTop + plotH + 3).toFixed(1)}" font-size="8" fill="var(--text-muted)" text-anchor="end">0%</text>

          <!-- Milestone Flag Pins -->
          ${flagsSvg.join('')}

          <!-- Incident Bars -->
          ${barsSvg.join('')}

          <!-- Area Under Curve -->
          <polygon points="${areaPoints}" fill="url(#zlogAggAreaGrad)" />

          <!-- Trendline Polyline -->
          <polyline points="${polyPoints}" fill="none" stroke="url(#zlogAggLineGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

          <!-- Circle Nodes -->
          ${nodesSvg.join('')}

          <!-- Percentage Labels -->
          ${labelsSvg.join('')}

          <!-- X-Axis Labels -->
          ${xLabelsSvg.join('')}
        </svg>
      </div>

      <!-- Toggle Button for Full Table -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
        <span style="font-size: 0.70rem; color: var(--text-muted);">
          💡 <em>Tip: Hover over any bar or node to see exact incident count, good days %, and clinical events.</em>
        </span>
        <button type="button" class="btn btn-secondary" onclick="toggleMonthlyBreakdownTable()" style="font-size: 0.72rem; padding: 4px 10px;">
          <i data-lucide="chevron-down" id="zlog-toggle-table-icon" style="width: 12px; height: 12px; transition: transform 0.2s;"></i>
          <span id="zlog-toggle-table-btn-text">View Full Monthly Breakdown Table</span>
        </button>
      </div>

      <!-- Collapsible Detailed Monthly Table -->
      <div id="zlog-monthly-table-container" class="zlog-monthly-table-wrap" style="display: none;">
        <div style="overflow-x: auto;">
          <table class="zlog-monthly-table">
            <thead>
              <tr>
                <th>Month &amp; Year</th>
                <th>Days Logged</th>
                <th>Aggression / Meltdowns</th>
                <th>Good Days (≥4)</th>
                <th>Avg Rating</th>
                <th>Clinical Regimen &amp; Notes</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function forceSyncZLogDefaults() {
  if (typeof DEFAULT_ZLOG_ENTRIES !== 'undefined') {
    const cleanDefaults = { ...DEFAULT_ZLOG_ENTRIES };
    if (storage.data.zlogEntries && typeof storage.data.zlogEntries === 'object') {
      for (const [d, entry] of Object.entries(storage.data.zlogEntries)) {
        if (d >= '2026-09-12' && entry && (entry.notes || entry.rating || entry.updatedAt)) {
          cleanDefaults[d] = entry;
        }
      }
    }
    storage.data.zlogEntries = cleanDefaults;
    storage.data.zlogSeedVersion = 6;
  }
  if (typeof DEFAULT_TITRATION_HISTORY !== 'undefined') {
    storage.data.titrationHistory = JSON.parse(JSON.stringify(DEFAULT_TITRATION_HISTORY));
    storage.data.titrationSeedVersion = 7;
  }
  storage.saveData();
  if (typeof sync !== 'undefined' && sync.isConfigured && sync.isConfigured()) {
    sync.pushToCloud();
  }
  renderZLogPage();
  if (typeof showToast === 'function') {
    showToast('Verified historical dataset synchronized!', 'success');
  }
}

/* --------------------------------------------------------------------------
   CSV Export
   -------------------------------------------------------------------------- */
function exportZLogData() {
  if (typeof storage !== 'undefined' && typeof storage.exportZLogCSV === 'function') {
    storage.exportZLogCSV();
  }
}

/* --------------------------------------------------------------------------
   Modal: Log or Edit Daily Entry
   -------------------------------------------------------------------------- */
function openZLogEntryModal(targetDate = null) {
  const dateStr = targetDate || activeTrackingDate || formatDateIso(new Date());
  const entry = storage.getZLogEntry(dateStr);
  const meds = entry.meds || {};

  let modal = document.getElementById('modal-zlog-entry');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-zlog-entry';
    modal.className = 'modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) closeZLogModal(); };
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-card" style="max-width: 520px;">
      <div class="modal-header">
        <h3>🌱 Z Log Entry</h3>
        <button class="icon-btn" onclick="closeZLogModal()"><i data-lucide="x"></i></button>
      </div>

      <form onsubmit="submitZLogEntryModal(event)">
        <!-- Date Selector -->
        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="date" class="form-input" id="zlog-modal-date" value="${dateStr}" required>
        </div>

        <!-- 5-Part Day Rating -->
        <div class="form-group">
          <label class="form-label">Day Rating (1 to 5)</label>
          <div class="zlog-rating-row" id="zlog-modal-rating-row">
            ${[5, 4, 3, 2, 1].map(lvl => {
              const r = ZLOG_RATINGS[lvl];
              const isActive = (Number(entry.rating) === lvl);
              return `
                <button 
                  type="button" 
                  class="zlog-rate-btn ${isActive ? 'active' : ''}" 
                  data-level="${lvl}"
                  onclick="selectModalRating(${lvl})"
                >
                  <span class="rate-emoji">${r.emoji}</span>
                  <span class="rate-title">${r.shortLabel}</span>
                </button>
              `;
            }).join('')}
          </div>
          <input type="hidden" id="zlog-modal-rating-val" value="${entry.rating || ''}">
        </div>

        <!-- Aggression Toggle Button -->
        <div class="form-group">
          <label class="form-label">Aggression Incident</label>
          <button 
            type="button" 
            id="zlog-modal-aggression-btn" 
            class="zlog-aggression-toggle-btn ${entry.aggression ? 'active' : ''}"
            onclick="toggleModalAggression()"
          >
            <span>⚡ Report Aggression for this Date</span>
            <span class="zlog-aggression-pill" id="zlog-modal-aggression-badge" style="display: ${entry.aggression ? 'inline-block' : 'none'};">⚠️ Aggression Reported</span>
          </button>
          <input type="hidden" id="zlog-modal-aggression-val" value="${entry.aggression ? '1' : '0'}">
        </div>

        <!-- Meds Given -->
        <div class="form-group">
          <label class="form-label">Medications Administered</label>
          <div class="zlog-meds-grid">
            <label class="zlog-med-pill ${meds.z ? 'checked' : ''}">
              <input type="checkbox" id="zlog-m-z" ${meds.z ? 'checked' : ''} onchange="this.closest('.zlog-med-pill').classList.toggle('checked', this.checked)">
              <span class="zlog-med-code" style="color: #4E8765;">Z</span>
              <span class="zlog-med-label">Zoloft</span>
              <input type="text" class="zlog-med-dose-input" id="zlog-m-z-dose" placeholder="75mg" value="${escapeHtml(String(meds.zDose || '75mg'))}" onclick="event.stopPropagation()">
            </label>
            <label class="zlog-med-pill ${meds.g ? 'checked' : ''}">
              <input type="checkbox" id="zlog-m-g" ${meds.g ? 'checked' : ''} onchange="this.closest('.zlog-med-pill').classList.toggle('checked', this.checked)">
              <span class="zlog-med-code" style="color: #7979B8;">G</span>
              <span class="zlog-med-label">Guanfacine</span>
              <input type="text" class="zlog-med-dose-input" id="zlog-m-g-dose" placeholder="2mg" value="${escapeHtml(String(meds.gDose || '2mg'))}" onclick="event.stopPropagation()">
            </label>
            <label class="zlog-med-pill ${meds.rit ? 'checked' : ''}">
              <input type="checkbox" id="zlog-m-rit" ${meds.rit ? 'checked' : ''} onchange="this.closest('.zlog-med-pill').classList.toggle('checked', this.checked)">
              <span class="zlog-med-code" style="color: #7C5CFC;">Rit</span>
              <span class="zlog-med-label">Ritalin</span>
              <input type="text" class="zlog-med-dose-input" id="zlog-m-rit-dose" placeholder="5mg" value="${escapeHtml(String(meds.ritDose || (typeof meds.rit === 'string' ? meds.rit : '5mg')))}" onclick="event.stopPropagation()">
            </label>
            <label class="zlog-med-pill ${meds.mag ? 'checked' : ''}">
              <input type="checkbox" id="zlog-m-mag" ${meds.mag ? 'checked' : ''} onchange="this.closest('.zlog-med-pill').classList.toggle('checked', this.checked)">
              <span class="zlog-med-code" style="color: #D49B35;">Mag</span>
              <span class="zlog-med-label">Magnesium</span>
              <input type="text" class="zlog-med-dose-input" id="zlog-m-mag-dose" placeholder="Daily" value="${escapeHtml(String(meds.magDose || 'Daily'))}" onclick="event.stopPropagation()">
            </label>
            <label class="zlog-med-pill ${meds.mel ? 'checked' : ''}">
              <input type="checkbox" id="zlog-m-mel" ${meds.mel ? 'checked' : ''} onchange="this.closest('.zlog-med-pill').classList.toggle('checked', this.checked)">
              <span class="zlog-med-code" style="color: #3E5C76;">Mel</span>
              <span class="zlog-med-label">Melatonin</span>
              <input type="text" class="zlog-med-dose-input" id="zlog-m-mel-dose" placeholder="Bedtime" value="${escapeHtml(String(meds.melDose || 'Bedtime'))}" onclick="event.stopPropagation()">
            </label>
            <label class="zlog-med-pill ${meds.ris ? 'checked' : ''}">
              <input type="checkbox" id="zlog-m-ris" ${meds.ris ? 'checked' : ''} onchange="this.closest('.zlog-med-pill').classList.toggle('checked', this.checked)">
              <span class="zlog-med-code" style="color: #D97768;">Ris</span>
              <span class="zlog-med-label">Risperidone</span>
              <input type="text" class="zlog-med-dose-input wide-dose" id="zlog-m-ris-dose" placeholder="As needed" value="${escapeHtml(String(meds.risDose || 'As needed'))}" onclick="event.stopPropagation()">
            </label>
          </div>
        </div>

        <!-- Narrative Log -->
        <div class="form-group">
          <label class="form-label">Narrative Log &amp; Calming Notes</label>
          <textarea class="form-input" id="zlog-modal-notes" rows="4" placeholder="How did the day go? Calm techniques used, meals, arcade/activities, triggers, bedtime...">${escapeHtml(entry.notes || '')}</textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn btn-secondary" onclick="closeZLogModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Entry</button>
        </div>
      </form>
    </div>
  `;

  modal.classList.add('active');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function selectModalRating(lvl) {
  const hiddenInput = document.getElementById('zlog-modal-rating-val');
  const current = Number(hiddenInput.value);
  const newVal = (current === lvl) ? '' : lvl;
  hiddenInput.value = newVal;

  document.querySelectorAll('#zlog-modal-rating-row .zlog-rate-btn').forEach(btn => {
    if (Number(btn.dataset.level) === newVal) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function toggleModalAggression() {
  const hidden = document.getElementById('zlog-modal-aggression-val');
  const btn = document.getElementById('zlog-modal-aggression-btn');
  const badge = document.getElementById('zlog-modal-aggression-badge');
  const isNowActive = (hidden.value !== '1');
  hidden.value = isNowActive ? '1' : '0';

  if (isNowActive) {
    btn.classList.add('active');
    badge.style.display = 'inline-block';
  } else {
    btn.classList.remove('active');
    badge.style.display = 'none';
  }
}

function submitZLogEntryModal(event) {
  event.preventDefault();
  const dateStr = document.getElementById('zlog-modal-date').value;
  const ratingVal = document.getElementById('zlog-modal-rating-val').value;
  const aggressionVal = (document.getElementById('zlog-modal-aggression-val').value === '1');
  const notes = document.getElementById('zlog-modal-notes').value;

  const zChecked = document.getElementById('zlog-m-z').checked;
  const zDose = document.getElementById('zlog-m-z-dose').value.trim() || '75mg';
  const gChecked = document.getElementById('zlog-m-g').checked;
  const gDose = document.getElementById('zlog-m-g-dose').value.trim() || '2mg';
  const ritChecked = document.getElementById('zlog-m-rit').checked;
  const ritDose = document.getElementById('zlog-m-rit-dose').value.trim() || '5mg';
  const magChecked = document.getElementById('zlog-m-mag').checked;
  const magDose = document.getElementById('zlog-m-mag-dose').value.trim() || 'Daily';
  const melChecked = document.getElementById('zlog-m-mel').checked;
  const melDose = document.getElementById('zlog-m-mel-dose').value.trim() || 'Bedtime';
  const risChecked = document.getElementById('zlog-m-ris').checked;
  const risDose = document.getElementById('zlog-m-ris-dose').value.trim() || 'As needed';

  const entryData = {
    date: dateStr,
    rating: ratingVal ? Number(ratingVal) : null,
    aggression: aggressionVal,
    notes: notes,
    meds: {
      z: zChecked,
      zDose: zDose,
      g: gChecked,
      gDose: gDose,
      rit: ritChecked ? ritDose : '',
      ritDose: ritDose,
      mag: magChecked,
      magDose: magDose,
      mel: melChecked,
      melDose: melDose,
      ris: risChecked,
      risDose: risDose
    }
  };

  storage.saveZLogEntry(dateStr, entryData);
  closeZLogModal();

  if (typeof showToast === 'function') {
    showToast(`🌱 Z Log saved for ${dateStr}`);
  }

  if (currentView === 'zlog') {
    renderZLogPage();
  } else if (currentView === 'sanctuary' || currentView === 'daily') {
    renderDailySheet();
  } else if (typeof renderDailySheet === 'function') {
    renderDailySheet();
  }
}

function closeZLogModal() {
  const modal = document.getElementById('modal-zlog-entry');
  if (modal) modal.classList.remove('active');
}

/* --------------------------------------------------------------------------
   Modal: Add Titration Event
   -------------------------------------------------------------------------- */
function openTitrationModal() {
  let modal = document.getElementById('modal-titration-add');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-titration-add';
    modal.className = 'modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) closeTitrationModal(); };
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-card" style="max-width: 480px;">
      <div class="modal-header">
        <h3>💊 Add Titration Adjustment</h3>
        <button class="icon-btn" onclick="closeTitrationModal()"><i data-lucide="x"></i></button>
      </div>

      <form onsubmit="submitTitrationModal(event)">
        <div class="form-group">
          <label class="form-label">Date of Change</label>
          <input type="date" class="form-input" id="tit-modal-date" value="${formatDateIso(new Date())}" required>
        </div>

        <div class="form-group">
          <label class="form-label">Medication</label>
          <input type="text" class="form-input" id="tit-modal-med" placeholder="e.g. Sertraline, Guanfacine IR, Ritalin..." required>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label class="form-label">New Dosage</label>
            <input type="text" class="form-input" id="tit-modal-dose" placeholder="e.g. .50 ml (10mg)" required>
          </div>
          <div class="form-group">
            <label class="form-label">Action</label>
            <select class="form-select" id="tit-modal-action">
              <option value="Started">Started</option>
              <option value="Increased">Increased</option>
              <option value="Decreased">Decreased</option>
              <option value="Changed">Changed</option>
              <option value="Stopped">Stopped</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Prescriber</label>
          <select class="form-select" id="tit-modal-prescriber">
            <option value="Dr Barness" selected>Dr Barness</option>
            <option value="Tara Gleeson">Tara Gleeson</option>
            <option value="GAP">GAP</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Reason / Clinical Notes</label>
          <input type="text" class="form-input" id="tit-modal-notes" placeholder="e.g. Adjusted based on behavior feedback, school routine...">
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn btn-secondary" onclick="closeTitrationModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Adjustment</button>
        </div>
      </form>
    </div>
  `;

  modal.classList.add('active');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function submitTitrationModal(event) {
  event.preventDefault();
  const eventData = {
    date: document.getElementById('tit-modal-date').value,
    medication: document.getElementById('tit-modal-med').value.trim(),
    dosage: document.getElementById('tit-modal-dose').value.trim(),
    action: document.getElementById('tit-modal-action').value,
    prescriber: document.getElementById('tit-modal-prescriber').value.trim(),
    notes: document.getElementById('tit-modal-notes').value.trim()
  };

  storage.addTitrationEvent(eventData);
  closeTitrationModal();
  renderZLogPage();
}

function closeTitrationModal() {
  const modal = document.getElementById('modal-titration-add');
  if (modal) modal.classList.remove('active');
}
