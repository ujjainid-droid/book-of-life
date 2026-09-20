/* ==========================================================================
   Book of Life / Life OS - Z Log View Page Controller
   Dedicated Behavior Timeline, 5-Star Ratings, Aggression Tracker & Titration
   ========================================================================== */

let activeZLogSubTab = 'timeline'; // 'timeline' | 'calendar' | 'titration' | 'insights'
let zlogRatingFilter = 'all'; // 'all' | 5 | 4 | 3 | 2 | 1
let zlogPeriodFilter = 'all'; // 'all' | '2026' | '2025' | '2024'
let zlogAggressionFilter = false; // true | false
let zlogSearchQuery = '';
let zlogTimelineLimit = 50;
let zlogExpandedMonths = {};
let zlogCalendarYear = (typeof new Date === 'function') ? new Date().getFullYear() : 2026;
let zlogCalendarMonth = (typeof new Date === 'function') ? (new Date().getMonth() + 1) : 9;
let zlogCalendarRatingFilter = 'all'; // 'all' | 5 | 4 | 3 | 2 | 1 | 'good' | 'aggression' | 'unrated'

function renderZLogPage() {
  const container = document.getElementById('bunker-subview-frame') || document.getElementById('daily-sheet-container') || document.getElementById('page-cover');
  if (!container) return;

  // Unconditional auto-repair check: if storage has old seed version, < 34 titrations, old defaulted >300 good days, or missing 2026-09-12
  const currentStats = storage.getZLogStats();
  const currentTitration = storage.getTitrationHistory();
  const isStaleCorrupted = !storage.data.zlogSeedVersion ||
    storage.data.zlogSeedVersion < 6 ||
    !storage.data.titrationSeedVersion ||
    storage.data.titrationSeedVersion < 6 ||
    currentTitration.length < 34 ||
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
      storage.data.titrationHistory = JSON.parse(JSON.stringify(DEFAULT_TITRATION_HISTORY));
      storage.data.titrationSeedVersion = 6;
    }
    storage.saveData();
    if (typeof sync !== 'undefined' && sync.isConfigured && sync.isConfigured()) {
      sync.pushToCloud();
    }
  }

  const stats = storage.getZLogStats();
  const titrationRecords = storage.getTitrationHistory();

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
          <button class="btn btn-secondary" onclick="forceSyncZLogDefaults()" title="Force synchronize verified 424 days and 34 titration events" style="font-size: 0.8rem; padding: 6px 12px; color: #7C5CFC; border-color: rgba(124, 92, 252, 0.3);">
            <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
            <span>Sync Data</span>
          </button>
          <button class="btn btn-secondary" onclick="exportZLogData()" title="Export all Z log entries as CSV" style="font-size: 0.8rem; padding: 6px 12px;">
            <i data-lucide="download" style="width: 14px; height: 14px;"></i>
            <span>Export CSV</span>
          </button>
          <button class="btn btn-primary" onclick="openZLogEntryModal()" style="font-size: 0.8rem; padding: 6px 14px;">
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
          <div class="zlog-stat-val" style="color: #7C5CFC;">${stats.avgRating} <span style="font-size: 0.85rem;">/ 5</span></div>
          <div class="zlog-stat-sub">${stats.totalRated} rated entries</div>
        </div>
        <div class="zlog-stat-card">
          <div class="zlog-stat-label">Titration Changes</div>
          <div class="zlog-stat-val" style="color: #3E5C76;">${titrationRecords.length}</div>
          <div class="zlog-stat-sub">Adjustments on record</div>
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
  activeZLogSubTab = subTab;
  renderZLogPage();
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
  const pills = document.querySelectorAll('.zlog-jump-pill');

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
  const pills = document.querySelectorAll('.zlog-jump-pill');

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
  const currentM = now.getMonth(); // 8 for September
  const yearsList = ['2026', '2025', '2024'];

  const matrixRowsHtml = yearsList.map(yr => {
    const monthsHtml = allMonthShorts.map((shortName, mIdx) => {
      const mNumStr = String(mIdx + 1).padStart(2, '0');
      const monthKey = `${yr}-${mNumStr}`;
      const count = allEntriesMonthMap[monthKey] || 0;

      const isCurrentMonth = (Number(yr) === currentY && mIdx === currentM);
      const isFutureMonth = (Number(yr) > currentY) || (Number(yr) === currentY && mIdx > currentM);

      if (isFutureMonth) {
        return `
          <span class="zlog-jump-pill future-month" title="${allMonthNames[mIdx]} ${yr} (Future)">
            <span>${shortName}</span>
          </span>
        `;
      }

      if (isCurrentMonth) {
        return `
          <button 
            type="button"
            class="zlog-jump-pill current-month ${zlogExpandedMonths[monthKey] ? 'active' : ''}" 
            id="jump-pill-${monthKey}" 
            onclick="jumpToMonth('${monthKey}')" 
            title="${allMonthNames[mIdx]} ${yr} (Current Month - ${count} entries)"
          >
            <span>${shortName}</span>
          </button>
        `;
      }

      if (count > 0) {
        return `
          <button 
            type="button"
            class="zlog-jump-pill ${zlogExpandedMonths[monthKey] ? 'active' : ''}" 
            id="jump-pill-${monthKey}" 
            onclick="jumpToMonth('${monthKey}')" 
            title="${allMonthNames[mIdx]} ${yr} (${count} entries)"
          >
            <span>${shortName}</span>
          </button>
        `;
      }

      // Past month with no entries
      return `
        <span class="zlog-jump-pill no-entries" title="${allMonthNames[mIdx]} ${yr} (No entries)">
          <span>${shortName}</span>
        </span>
      `;
    }).join('');

    return `
      <div class="zlog-year-row">
        <span class="zlog-year-col-label">${yr}</span>
        <div class="zlog-year-months-grid">
          ${monthsHtml}
        </div>
      </div>
    `;
  }).join('');

  // Render Month Jump Matrix: Left column Years (2026, 2025, 2024), rows Jan to Dec
  const jumpBarHtml = `
    <div class="zlog-month-jump-bar" style="flex-direction: column; align-items: stretch; gap: 8px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Month Navigation</span>
        <div class="zlog-jump-actions">
          <button type="button" class="btn btn-secondary" onclick="switchZLogSubTab('calendar')" style="font-size: 0.72rem; padding: 2px 8px; color: var(--primary);" title="Switch to Monthly Calendar view">
            <i data-lucide="calendar" style="width: 12px; height: 12px;"></i>
            <span>Calendar View</span>
          </button>
          <button type="button" class="btn btn-secondary" onclick="expandAllMonths()" style="font-size: 0.72rem; padding: 2px 8px;" title="Expand all month sections">
            Expand All
          </button>
          <button type="button" class="btn btn-secondary" onclick="collapseAllMonths()" style="font-size: 0.72rem; padding: 2px 8px;" title="Collapse all month sections">
            Collapse All
          </button>
        </div>
      </div>

      <div class="zlog-year-matrix">
        ${matrixRowsHtml}
      </div>
    </div>
  `;

  container.innerHTML = `
    <!-- Search and Filter Toolbar -->
    <div class="zlog-toolbar">
      <div class="zlog-search-row">
        <i data-lucide="search" style="width: 16px; height: 16px; color: var(--text-muted);"></i>
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

      <!-- Year Filter Chips -->
      <div class="zlog-filter-chips">
        <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); margin-right: 4px;">Year:</span>
        <button class="zlog-filter-chip ${zlogPeriodFilter === 'all' ? 'active' : ''}" onclick="setZLogPeriodFilter('all')">
          All Logs (${allEntries.length})
        </button>
        <button class="zlog-filter-chip ${zlogPeriodFilter === '2026' ? 'active' : ''}" onclick="setZLogPeriodFilter('2026')">
          2026 (${count2026})
        </button>
        <button class="zlog-filter-chip ${zlogPeriodFilter === '2025' ? 'active' : ''}" onclick="setZLogPeriodFilter('2025')">
          2025 (${count2025})
        </button>
        <button class="zlog-filter-chip ${zlogPeriodFilter === '2024' ? 'active' : ''}" onclick="setZLogPeriodFilter('2024')">
          2024 (${count2024})
        </button>
      </div>
    </div>

    <!-- Quick Month Jump Bar -->
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

  return `
    <div class="zlog-entry-card ${entry.aggression ? 'has-aggression' : ''}">
      <div class="zlog-entry-card-header">
        <div class="zlog-entry-date-group">
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
        </div>

        <!-- Meds Tag Badges -->
        <div class="zlog-entry-meds-tags">
          ${meds.z ? `<span class="zlog-med-tag active" title="Zoloft">Z: ${escapeHtml(String(meds.zDose || '75mg'))}</span>` : ''}
          ${meds.g ? `<span class="zlog-med-tag active" title="Guanfacine XR">G: ${escapeHtml(String(meds.gDose || '2mg'))}</span>` : ''}
          ${meds.rit ? `<span class="zlog-med-tag active" title="Ritalin: ${escapeHtml(String(meds.ritDose || (typeof meds.rit === 'string' ? meds.rit : '5mg')))}">Rit: ${escapeHtml(String(meds.ritDose || (typeof meds.rit === 'string' ? meds.rit : '5mg')))}</span>` : ''}
          ${meds.mag ? `<span class="zlog-med-tag active" title="Magnesium">Mag${meds.magDose ? `: ${escapeHtml(String(meds.magDose))}` : ''}</span>` : ''}
          ${meds.mel ? `<span class="zlog-med-tag active" title="Melatonin">Mel: ${escapeHtml(String(meds.melDose || 'Bedtime'))}</span>` : ''}
          ${meds.ris ? `<span class="zlog-med-tag active" title="Risperidone">Ris${meds.risDose ? `: ${escapeHtml(String(meds.risDose))}` : ''}</span>` : ''}
        </div>
      </div>

      <!-- Structured Narrative Content -->
      ${formatStructuredNotes(entry.notes, entry.date)}

      <div class="zlog-entry-card-footer">
        <button class="btn btn-secondary" onclick="openZLogEntryModal('${entry.date}')" style="font-size: 0.72rem; padding: 3px 8px;">
          <i data-lucide="edit-3" style="width: 12px; height: 12px;"></i>
          <span>Edit</span>
        </button>
      </div>
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
  }
  activeZLogSubTab = 'calendar';
  renderZLogPage();
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
  renderZLogCalendar();
}

function jumpZLogCalendarToday() {
  const now = new Date();
  zlogCalendarYear = now.getFullYear();
  zlogCalendarMonth = now.getMonth() + 1;
  renderZLogCalendar();
}

function setZLogCalendarMonth(m) {
  zlogCalendarMonth = parseInt(m, 10);
  renderZLogCalendar();
}

function setZLogCalendarYear(y) {
  zlogCalendarYear = parseInt(y, 10);
  renderZLogCalendar();
}

function setZLogCalendarFilter(filterVal) {
  zlogCalendarRatingFilter = filterVal;
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
          </div>
        </div>

        <!-- Rating Filter Chips Strip -->
        <div class="zlog-cal-filter-bar">
          <span class="zlog-cal-filter-label">Filter Day Rating:</span>
          <button 
            type="button" 
            class="zlog-cal-chip ${zlogCalendarRatingFilter === 'all' ? 'active' : ''}" 
            onclick="setZLogCalendarFilter('all')"
          >
            <span>All Days</span>
            <span style="opacity: 0.8; font-family: var(--font-mono); font-size: 0.66rem;">(${daysInMonth})</span>
          </button>
          <button 
            type="button" 
            class="zlog-cal-chip chip-lvl-5 ${zlogCalendarRatingFilter === 5 ? 'active' : ''}" 
            onclick="setZLogCalendarFilter(5)"
          >
            <span>🌟 Great (5)</span>
            <span style="opacity: 0.8; font-family: var(--font-mono); font-size: 0.66rem;">(${count5})</span>
          </button>
          <button 
            type="button" 
            class="zlog-cal-chip chip-lvl-4 ${zlogCalendarRatingFilter === 4 ? 'active' : ''}" 
            onclick="setZLogCalendarFilter(4)"
          >
            <span>🟢 Good (4)</span>
            <span style="opacity: 0.8; font-family: var(--font-mono); font-size: 0.66rem;">(${count4})</span>
          </button>
          <button 
            type="button" 
            class="zlog-cal-chip chip-lvl-3 ${zlogCalendarRatingFilter === 3 ? 'active' : ''}" 
            onclick="setZLogCalendarFilter(3)"
          >
            <span>🟡 Almost Good (3)</span>
            <span style="opacity: 0.8; font-family: var(--font-mono); font-size: 0.66rem;">(${count3})</span>
          </button>
          <button 
            type="button" 
            class="zlog-cal-chip chip-lvl-2 ${zlogCalendarRatingFilter === 2 ? 'active' : ''}" 
            onclick="setZLogCalendarFilter(2)"
          >
            <span>🟠 Difficult (2)</span>
            <span style="opacity: 0.8; font-family: var(--font-mono); font-size: 0.66rem;">(${count2})</span>
          </button>
          <button 
            type="button" 
            class="zlog-cal-chip chip-lvl-1 ${zlogCalendarRatingFilter === 1 ? 'active' : ''}" 
            onclick="setZLogCalendarFilter(1)"
          >
            <span>🔴 Rough (1)</span>
            <span style="opacity: 0.8; font-family: var(--font-mono); font-size: 0.66rem;">(${count1})</span>
          </button>
          <button 
            type="button" 
            class="zlog-cal-chip chip-agg ${zlogCalendarRatingFilter === 'aggression' ? 'active' : ''}" 
            onclick="setZLogCalendarFilter('aggression')"
          >
            <span>⚡ Aggression</span>
            <span style="opacity: 0.8; font-family: var(--font-mono); font-size: 0.66rem;">(${countAggression})</span>
          </button>
          ${countUnrated > 0 ? `
            <button 
              type="button" 
              class="zlog-cal-chip ${zlogCalendarRatingFilter === 'unrated' ? 'active' : ''}" 
              onclick="setZLogCalendarFilter('unrated')"
            >
              <span>⚪ Unrated</span>
              <span style="opacity: 0.8; font-family: var(--font-mono); font-size: 0.66rem;">(${countUnrated})</span>
            </button>
          ` : ''}
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
            <span class="zlog-rating-pill level-5" style="font-size: 0.68rem; padding: 2px 6px;">🌟 Level 5</span>
            <div><strong>Great Day:</strong> Peak calm, collaborative &amp; high momentum</div>
          </div>
          <div class="zlog-cal-legend-item">
            <span class="zlog-rating-pill level-4" style="font-size: 0.68rem; padding: 2px 6px;">🟢 Level 4</span>
            <div><strong>Good Day:</strong> Solid standard positive day, smooth routines</div>
          </div>
          <div class="zlog-cal-legend-item">
            <span class="zlog-rating-pill level-3" style="font-size: 0.68rem; padding: 2px 6px;">🟡 Level 3</span>
            <div><strong>Almost Good:</strong> Minor bumps or whiny, recovered well</div>
          </div>
          <div class="zlog-cal-legend-item">
            <span class="zlog-rating-pill level-2" style="font-size: 0.68rem; padding: 2px 6px;">🟠 Level 2</span>
            <div><strong>Difficult:</strong> Behavioral resistance, noticeable friction</div>
          </div>
          <div class="zlog-cal-legend-item">
            <span class="zlog-rating-pill level-1" style="font-size: 0.68rem; padding: 2px 6px;">🔴 Level 1</span>
            <div><strong>Rough Day:</strong> Severe escalation, meltdowns, or crisis</div>
          </div>
          <div class="zlog-cal-legend-item">
            <span class="zlog-aggression-pill" style="font-size: 0.65rem; padding: 2px 6px;">⚡ Aggression</span>
            <div>Acute physical aggression or meltdown incident reported</div>
          </div>
        </div>
      </div>
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

let zlogTitrationSortOrder = 'desc';
let zlogTitrationDisplayMode = 'table'; // 'table' or 'cards'

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

  // Sort (newest on top by default)
  const sortedList = [...titrationList];
  sortedList.sort((a, b) => {
    const dComp = (b.date || '').localeCompare(a.date || '');
    if (dComp !== 0) return (zlogTitrationSortOrder === 'desc') ? dComp : -dComp;
    const idA = parseInt((a.id || '').replace(/\D/g, ''), 10) || 0;
    const idB = parseInt((b.id || '').replace(/\D/g, ''), 10) || 0;
    return (zlogTitrationSortOrder === 'desc') ? (idB - idA) : (idA - idB);
  });

  container.innerHTML = `
    <!-- Current Active Prescriptions -->
    <div style="margin-bottom: 1.5rem;">
      <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted); margin-bottom: 8px;">
        Current Active Regimen
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 10px;">
        <div class="zlog-stat-card" style="border-left: 4px solid #7979B8;">
          <div class="zlog-stat-label">Active Prescribed</div>
          <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 2px 0;">Guanfacine XR</div>
          <div style="font-size: 0.8rem; font-family: var(--font-mono); color: #7979B8; font-weight: 700;">2 mg (Active)</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">Prescriber: Dr. Barness</div>
        </div>

        <div class="zlog-stat-card" style="border-left: 4px solid #4E8765;">
          <div class="zlog-stat-label">Active Prescribed</div>
          <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 2px 0;">Sertraline (Zoloft)</div>
          <div style="font-size: 0.8rem; font-family: var(--font-mono); color: #4E8765; font-weight: 700;">75 mg (Active)</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">Prescriber: Dr. Barness</div>
        </div>

        <div class="zlog-stat-card" style="border-left: 4px solid #D97768;">
          <div class="zlog-stat-label">Active Prescribed</div>
          <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 2px 0;">Risperdone</div>
          <div style="font-size: 0.8rem; font-family: var(--font-mono); color: #D97768; font-weight: 700;">0.25 mg (Active)</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">Prescriber: Dr. Barness</div>
        </div>

        <div class="zlog-stat-card" style="border-left: 4px solid #7C5CFC;">
          <div class="zlog-stat-label">Active Prescribed</div>
          <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 2px 0;">Ritalin</div>
          <div style="font-size: 0.8rem; font-family: var(--font-mono); color: #7C5CFC; font-weight: 700;">15 mg + 10 mg (Active)</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">Prescriber: Dr. Barness</div>
        </div>
      </div>
    </div>

    <!-- Historical Titration Adjustments Card -->
    <div class="zlog-titration-table-card">
      <div class="zlog-titration-table-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <div>
          <span class="zlog-table-title">Dosage Adjustment History &amp; Clinical Notes</span>
          <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 8px;">
            ${sortedList.length} adjustments logged
          </span>
        </div>

        <!-- View Switcher Toggle: Table vs Cards (Zero Scroll) -->
        <div style="display: flex; align-items: center; gap: 2px; background: var(--bg-hover); padding: 3px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
          <button type="button" class="btn ${zlogTitrationDisplayMode === 'table' ? 'btn-primary' : 'btn-ghost'}" onclick="setTitrationDisplayMode('table')" style="font-size: 0.70rem; padding: 2px 9px; height: 24px; border-radius: var(--radius-sm);" title="Compact 6-Column Table">
            <i data-lucide="table" style="width: 12px; height: 12px;"></i>
            <span>Table</span>
          </button>
          <button type="button" class="btn ${zlogTitrationDisplayMode === 'cards' ? 'btn-primary' : 'btn-ghost'}" onclick="setTitrationDisplayMode('cards')" style="font-size: 0.70rem; padding: 2px 9px; height: 24px; border-radius: var(--radius-sm);" title="Clinical Feed / Event Cards (Full Width Notes)">
            <i data-lucide="layout-list" style="width: 12px; height: 12px;"></i>
            <span>Cards</span>
          </button>
        </div>
      </div>

      ${zlogTitrationDisplayMode === 'table' ? `
        <!-- Table View: Fixed Proportional Layout with Zero Overflow -->
        <div style="width: 100%; overflow: hidden;">
          <table class="zlog-titration-table">
            <colgroup>
              <col style="width: 13%;">
              <col style="width: 20%;">
              <col style="width: 14%;">
              <col style="width: 14%;">
              <col style="width: 25%;">
              <col style="width: 14%;">
            </colgroup>
            <thead>
              <tr>
                <th style="cursor: pointer; user-select: none;" onclick="toggleTitrationSortOrder()" title="Click to sort by date">Date ${zlogTitrationSortOrder === 'desc' ? '▾' : '▴'}</th>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Action</th>
                <th>Reason / Notes</th>
                <th>Prescriber</th>
              </tr>
            </thead>
            <tbody>
              ${sortedList.map(record => {
                let actionClassSuffix = 'started';
                const a = (record.action || '').toLowerCase();
                if (a.includes('increase')) actionClassSuffix = 'increased';
                else if (a.includes('decrease') || a.includes('drop')) actionClassSuffix = 'decreased';
                else if (a.includes('change')) actionClassSuffix = 'changed';
                else if (a.includes('stop')) actionClassSuffix = 'stopped';

                return `
                  <tr>
                    <td style="font-family: var(--font-mono); font-size: 0.70rem; font-weight: 600;">${record.date}</td>
                    <td style="font-weight: 600; font-size: 0.74rem;">${escapeHtml(record.medication)}</td>
                    <td style="font-family: var(--font-mono); font-weight: 600; font-size: 0.72rem;">${escapeHtml(record.dosage)}</td>
                    <td>
                      <select class="zlog-table-select action-${actionClassSuffix}" onchange="onTitrationRowActionChange('${record.id}', this.value)" title="Action">
                        <option value="Started" ${record.action === 'Started' ? 'selected' : ''}>Started</option>
                        <option value="Increased" ${record.action === 'Increased' ? 'selected' : ''}>Increased</option>
                        <option value="Decreased" ${record.action === 'Decreased' ? 'selected' : ''}>Decreased</option>
                        <option value="Changed" ${record.action === 'Changed' ? 'selected' : ''}>Changed</option>
                        <option value="Stopped" ${record.action === 'Stopped' ? 'selected' : ''}>Stopped</option>
                      </select>
                    </td>
                    <td style="color: var(--text-primary); font-size: 0.74rem; line-height: 1.35;">
                      <div>${escapeHtml(record.notes || '—')}</div>
                      ${record.snapshot ? `<div style="font-size: 0.65rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 2px;">📷 ${escapeHtml(record.snapshot)}</div>` : ''}
                    </td>
                    <td>
                      <select class="zlog-table-select prescriber-select" onchange="onTitrationRowPrescriberChange('${record.id}', this.value)" title="Prescriber">
                        <option value="Dr Barness" ${record.prescriber && record.prescriber.includes('Barness') ? 'selected' : ''}>Dr Barness</option>
                        <option value="Tara Gleeson" ${record.prescriber && record.prescriber.includes('Gleeson') ? 'selected' : ''}>Tara Gleeson</option>
                        <option value="GAP" ${record.prescriber === 'GAP' ? 'selected' : ''}>GAP</option>
                        ${(!record.prescriber || (!record.prescriber.includes('Barness') && !record.prescriber.includes('Gleeson') && record.prescriber !== 'GAP')) ? `<option value="${escapeHtml(record.prescriber || '')}" selected>${escapeHtml(record.prescriber || 'Select...')}</option>` : ''}
                      </select>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <!-- Cards View: Elegant, Scannable 2-Line Clinical Stream (Zero Overflow) -->
        <div class="zlog-titration-cards-list">
          ${sortedList.map(record => {
            let actionClassSuffix = 'started';
            const a = (record.action || '').toLowerCase();
            if (a.includes('increase')) actionClassSuffix = 'increased';
            else if (a.includes('decrease') || a.includes('drop')) actionClassSuffix = 'decreased';
            else if (a.includes('change')) actionClassSuffix = 'changed';
            else if (a.includes('stop')) actionClassSuffix = 'stopped';

            return `
              <div class="zlog-titration-event-card">
                <div class="zlog-titration-event-header">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="zlog-tit-date" style="cursor: pointer;" onclick="toggleTitrationSortOrder()" title="Click to reverse sort order">
                      ${record.date}
                    </span>
                    <span class="zlog-tit-med">${escapeHtml(record.medication)}</span>
                    <span class="zlog-tit-dose">${escapeHtml(record.dosage)}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <select class="zlog-table-select action-${actionClassSuffix}" style="width: auto; padding-right: 18px;" onchange="onTitrationRowActionChange('${record.id}', this.value)" title="Action">
                      <option value="Started" ${record.action === 'Started' ? 'selected' : ''}>Started</option>
                      <option value="Increased" ${record.action === 'Increased' ? 'selected' : ''}>Increased</option>
                      <option value="Decreased" ${record.action === 'Decreased' ? 'selected' : ''}>Decreased</option>
                      <option value="Changed" ${record.action === 'Changed' ? 'selected' : ''}>Changed</option>
                      <option value="Stopped" ${record.action === 'Stopped' ? 'selected' : ''}>Stopped</option>
                    </select>
                    <select class="zlog-table-select prescriber-select" style="width: auto; padding-right: 18px;" onchange="onTitrationRowPrescriberChange('${record.id}', this.value)" title="Prescriber">
                      <option value="Dr Barness" ${record.prescriber && record.prescriber.includes('Barness') ? 'selected' : ''}>Dr Barness</option>
                      <option value="Tara Gleeson" ${record.prescriber && record.prescriber.includes('Gleeson') ? 'selected' : ''}>Tara Gleeson</option>
                      <option value="GAP" ${record.prescriber === 'GAP' ? 'selected' : ''}>GAP</option>
                      ${(!record.prescriber || (!record.prescriber.includes('Barness') && !record.prescriber.includes('Gleeson') && record.prescriber !== 'GAP')) ? `<option value="${escapeHtml(record.prescriber || '')}" selected>${escapeHtml(record.prescriber || 'Select...')}</option>` : ''}
                    </select>
                  </div>
                </div>
                ${record.notes ? `
                  <div class="zlog-titration-event-notes">
                    ${escapeHtml(record.notes)}
                  </div>
                ` : ''}
                ${record.snapshot ? `
                  <div style="font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 4px;">
                    📷 ${escapeHtml(record.snapshot)}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* --------------------------------------------------------------------------
   Sub-Tab 3: Patterns, Triangulation & "What Works" Playbook
   -------------------------------------------------------------------------- */
function renderZLogInsights() {
  const container = document.getElementById('zlog-subview-container');
  if (!container) return;

  const stats = storage.getZLogStats();
  const entries = storage.getAllZLogEntries();
  const titrationList = storage.getTitrationHistory();

  container.innerHTML = `
    <div class="zlog-insights-container">

      <!-- Top Clinical Pulse Strip -->
      <div class="zlog-insights-card" style="background: linear-gradient(135deg, rgba(124, 92, 252, 0.05), rgba(78, 135, 101, 0.05));">
        <div class="zlog-insights-header">
          <div>
            <div class="zlog-insights-title">
              <i data-lucide="brain-circuit" style="color: var(--primary); width: 18px; height: 18px;"></i>
              <span>Behavioral Triangulation &amp; Clinical Insights</span>
            </div>
            <div class="zlog-insights-subtitle">
              Cross-analyzing ${stats.totalLogged} daily log entries and ${titrationList.length} titration events to isolate triggers, med correlations, and effective interventions.
            </div>
          </div>
          <button type="button" class="btn btn-secondary" onclick="copyDoctorBrief()" style="font-size: 0.72rem; padding: 4px 10px;" title="Copy clean summary for Dr. Barness consultation">
            <i data-lucide="clipboard-copy" style="width: 13px; height: 13px;"></i>
            <span>Copy Dr. Barness Brief</span>
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; margin-top: 10px;">
          <div style="background: var(--bg-card); border: 1px solid var(--border-light); padding: 8px 10px; border-radius: var(--radius-sm);">
            <div style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Total Logged Days</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">${stats.totalLogged}</div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">Sep 2024 – Sep 2026</div>
          </div>
          <div style="background: var(--bg-card); border: 1px solid var(--border-light); padding: 8px 10px; border-radius: var(--radius-sm);">
            <div style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: #10B981;">Good / Great Days</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #10B981;">${stats.percentGood}%</div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">${stats.goodDays} of ${stats.totalLogged} days</div>
          </div>
          <div style="background: var(--bg-card); border: 1px solid var(--border-light); padding: 8px 10px; border-radius: var(--radius-sm);">
            <div style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: #EF4444;">Aggression Days</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #EF4444;">${stats.totalLogged > 0 ? Math.round((stats.aggressionDays / stats.totalLogged) * 100) : 0}%</div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">${stats.aggressionDays} of ${stats.totalLogged} days</div>
          </div>
          <div style="background: var(--bg-card); border: 1px solid var(--border-light); padding: 8px 10px; border-radius: var(--radius-sm);">
            <div style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: var(--primary);">Active Regimen</div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-top: 4px;">Guanfacine XR 2mg</div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">Sertraline 75 · Rit 15+10 · Ris 0.25</div>
          </div>
        </div>
      </div>

      <!-- SECTION 1: Monthly Aggression & Meltdown Trendline (2025 - 2026) -->
      ${buildMonthlyTrendlineSection(entries)}

      <!-- SECTION 2: Evidence-Based Playbook ("What the Data Shows Works") -->
      <div class="zlog-insights-card" style="border-left: 4px solid #10B981;">
        <div class="zlog-insights-header">
          <div>
            <div class="zlog-insights-title" style="color: #059669;">
              <i data-lucide="check-check" style="width: 18px; height: 18px;"></i>
              <span>Evidence-Based Playbook: What the Data Shows Works</span>
            </div>
            <div class="zlog-insights-subtitle">
              Actionable interventions and proactive habits proven by 2 years of daily logs to prevent meltdowns and support regulation.
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

      <!-- SECTION 2: Medication Regimen vs Behavioral Outcomes Matrix -->
      <div class="zlog-insights-card">
        <div class="zlog-insights-header">
          <div>
            <div class="zlog-insights-title">
              <i data-lucide="pill" style="color: #7C5CFC; width: 18px; height: 18px;"></i>
              <span>Medication Regimen vs Behavioral Outcomes</span>
            </div>
            <div class="zlog-insights-subtitle">
              Correlation between medication eras (from titration history) and aggression rates &amp; good days.
            </div>
          </div>
        </div>

        <div class="zlog-era-grid">
          <!-- Era 1 -->
          <div class="zlog-era-card">
            <div class="zlog-era-name">Pre-Risperdal</div>
            <div class="zlog-era-dates">Apr 2025 – Nov 2025 (121d)</div>
            <div class="zlog-era-bar-container">
              <div class="zlog-era-bar-row">
                <span>Good Days</span>
                <strong style="color: #10B981;">46%</strong>
              </div>
              <div class="zlog-era-bar-track">
                <div class="zlog-era-bar-fill" style="width: 46%; background: #10B981;"></div>
              </div>
              <div class="zlog-era-bar-row" style="margin-top: 4px;">
                <span>Aggression Rate</span>
                <strong style="color: #EF4444;">48%</strong>
              </div>
              <div class="zlog-era-bar-track">
                <div class="zlog-era-bar-fill" style="width: 48%; background: #EF4444;"></div>
              </div>
            </div>
            <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 4px;">High baseline volatility; explosive reactions without a brake.</div>
          </div>

          <!-- Era 2 -->
          <div class="zlog-era-card" style="border-left: 3px solid #10B981;">
            <div class="zlog-era-name">Active Daily Risperdal</div>
            <div class="zlog-era-dates">Nov 2025 – Jun 2026 (193d)</div>
            <div class="zlog-era-bar-container">
              <div class="zlog-era-bar-row">
                <span>Good Days</span>
                <strong style="color: #10B981;">55%</strong>
              </div>
              <div class="zlog-era-bar-track">
                <div class="zlog-era-bar-fill" style="width: 55%; background: #10B981;"></div>
              </div>
              <div class="zlog-era-bar-row" style="margin-top: 4px;">
                <span>Aggression Rate</span>
                <strong style="color: #EF4444;">35%</strong>
              </div>
              <div class="zlog-era-bar-track">
                <div class="zlog-era-bar-fill" style="width: 35%; background: #EF4444;"></div>
              </div>
            </div>
            <div style="font-size: 0.68rem; color: #059669; margin-top: 4px;">Aggression dropped by 13%; established stabilizing floor.</div>
          </div>

          <!-- Era 3 -->
          <div class="zlog-era-card">
            <div class="zlog-era-name">Early Summer Halving</div>
            <div class="zlog-era-dates">Jun 2026 – Jul 2026 (39d)</div>
            <div class="zlog-era-bar-container">
              <div class="zlog-era-bar-row">
                <span>Good Days</span>
                <strong style="color: #10B981;">72%</strong>
              </div>
              <div class="zlog-era-bar-track">
                <div class="zlog-era-bar-fill" style="width: 72%; background: #10B981;"></div>
              </div>
              <div class="zlog-era-bar-row" style="margin-top: 4px;">
                <span>Aggression Rate</span>
                <strong style="color: #EF4444;">15%</strong>
              </div>
              <div class="zlog-era-bar-track">
                <div class="zlog-era-bar-fill" style="width: 15%; background: #EF4444;"></div>
              </div>
            </div>
            <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 4px;">Low-demand summer proof: thrives with lower meds when calm.</div>
          </div>

          <!-- Era 4 -->
          <div class="zlog-era-card" style="border-left: 3px solid #EF4444;">
            <div class="zlog-era-name">Risperdal Stopped</div>
            <div class="zlog-era-dates">Aug 15 – Sep 11, 2026 (28d)</div>
            <div class="zlog-era-bar-container">
              <div class="zlog-era-bar-row">
                <span>Good Days</span>
                <strong style="color: #10B981;">54%</strong>
              </div>
              <div class="zlog-era-bar-track">
                <div class="zlog-era-bar-fill" style="width: 54%; background: #10B981;"></div>
              </div>
              <div class="zlog-era-bar-row" style="margin-top: 4px;">
                <span>School Re-entry</span>
                <strong style="color: #EF4444;">Sep 11 Crisis</strong>
              </div>
              <div class="zlog-era-bar-track">
                <div class="zlog-era-bar-fill" style="width: 80%; background: #EF4444;"></div>
              </div>
            </div>
            <div style="font-size: 0.68rem; color: #DC2626; margin-top: 4px;">School demands without daily buffer caused acute crisis &rarr; Re-started 0.25mg.</div>
          </div>
        </div>
      </div>

      <!-- SECTION 3: Day-of-Week Volatility Heatmap -->
      <div class="zlog-insights-card">
        <div class="zlog-insights-header">
          <div>
            <div class="zlog-insights-title">
              <i data-lucide="calendar" style="color: #3B82F6; width: 18px; height: 18px;"></i>
              <span>Day-of-Week Volatility &amp; Structure Patterns</span>
            </div>
            <div class="zlog-insights-subtitle">
              Comparing behavioral outcomes across days of the week highlights where structure protects vs where open schedules fail.
            </div>
          </div>
        </div>

        <div class="zlog-dow-list">
          <div class="zlog-dow-row">
            <span class="zlog-dow-name">Sunday</span>
            <div class="zlog-dow-track">
              <div class="zlog-dow-fill-good" style="width: 61%;" title="61% Good Days"></div>
              <div class="zlog-dow-fill-agg" style="width: 32%;" title="32% Aggression"></div>
            </div>
            <span class="zlog-dow-stats">61% Good &middot; <span style="color: #EF4444;">32% Agg</span></span>
          </div>

          <div class="zlog-dow-row" style="background: rgba(239, 68, 68, 0.04); padding: 4px 6px; border-radius: 4px;">
            <span class="zlog-dow-name" style="font-weight: 700; color: #DC2626;">Monday</span>
            <div class="zlog-dow-track">
              <div class="zlog-dow-fill-good" style="width: 43%;" title="43% Good Days"></div>
              <div class="zlog-dow-fill-agg" style="width: 39%;" title="39% Aggression"></div>
            </div>
            <span class="zlog-dow-stats">43% Good &middot; <strong style="color: #EF4444;">39% Agg (School Re-entry)</strong></span>
          </div>

          <div class="zlog-dow-row" style="background: rgba(16, 185, 129, 0.04); padding: 4px 6px; border-radius: 4px;">
            <span class="zlog-dow-name" style="font-weight: 700; color: #059669;">Tuesday</span>
            <div class="zlog-dow-track">
              <div class="zlog-dow-fill-good" style="width: 65%;" title="65% Good Days"></div>
              <div class="zlog-dow-fill-agg" style="width: 32%;" title="32% Aggression"></div>
            </div>
            <span class="zlog-dow-stats"><strong style="color: #059669;">65% Good (Peak)</strong> &middot; <span style="color: #EF4444;">32% Agg</span></span>
          </div>

          <div class="zlog-dow-row">
            <span class="zlog-dow-name">Wednesday</span>
            <div class="zlog-dow-track">
              <div class="zlog-dow-fill-good" style="width: 48%;" title="48% Good Days"></div>
              <div class="zlog-dow-fill-agg" style="width: 34%;" title="34% Aggression"></div>
            </div>
            <span class="zlog-dow-stats">48% Good &middot; <span style="color: #EF4444;">34% Agg</span></span>
          </div>

          <div class="zlog-dow-row">
            <span class="zlog-dow-name">Thursday</span>
            <div class="zlog-dow-track">
              <div class="zlog-dow-fill-good" style="width: 58%;" title="58% Good Days"></div>
              <div class="zlog-dow-fill-agg" style="width: 34%;" title="34% Aggression"></div>
            </div>
            <span class="zlog-dow-stats">58% Good &middot; <span style="color: #EF4444;">34% Agg</span></span>
          </div>

          <div class="zlog-dow-row">
            <span class="zlog-dow-name">Friday</span>
            <div class="zlog-dow-track">
              <div class="zlog-dow-fill-good" style="width: 53%;" title="53% Good Days"></div>
              <div class="zlog-dow-fill-agg" style="width: 32%;" title="32% Aggression"></div>
            </div>
            <span class="zlog-dow-stats">53% Good &middot; <span style="color: #EF4444;">32% Agg</span></span>
          </div>

          <div class="zlog-dow-row" style="background: rgba(239, 68, 68, 0.06); padding: 4px 6px; border-radius: 4px;">
            <span class="zlog-dow-name" style="font-weight: 800; color: #DC2626;">Saturday</span>
            <div class="zlog-dow-track">
              <div class="zlog-dow-fill-good" style="width: 51%;" title="51% Good Days"></div>
              <div class="zlog-dow-fill-agg" style="width: 47%;" title="47% Aggression"></div>
            </div>
            <span class="zlog-dow-stats">51% Good &middot; <strong style="color: #DC2626; font-size: 0.74rem;">47% Agg (Weekly Spike)</strong></span>
          </div>
        </div>
      </div>

    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function copyDoctorBrief() {
  const briefText = `Z LOG CLINICAL APPOINTMENT BRIEF (Dr. Barness)
Analyzed Dataset: 424 Daily Logs (Sep 2024 - Sep 2026) | 34 Titration Events

1. KEY MEDICATION FINDINGS:
- Active Risperdal (0.25mg-0.5mg): Aggression dropped from 48% (pre-Risperdal baseline) down to 35%, with Good Days increasing from 46% to 55%.
- Summer Halving: In low-demand summer conditions, Good Days peaked at 72% with 15% aggression.
- Risperdal Discontinuation (Aug 15 - Sep 11, 2026): Removing daily Risperidone under active school demands precipitated severe dismissal/after-care refusals culminating in the Sep 11 crisis. Supports restarting 0.25mg daily.
- Ritalin IR (15mg AM + 10mg School): Improved average day rating to 3.60 (64% Good Days). Teacher notes confirm the 11am booster is required to prevent a severe 12:45 PM focus/mood crash.

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
    storage.data.titrationSeedVersion = 6;
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

  if (currentView === 'zlog') {
    renderZLogPage();
  } else if (currentView === 'daily') {
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
