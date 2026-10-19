/* ==========================================================================
   Book of Life / Life OS - Cover Page (Executive Index & System Compass)
   Operating Philosophy: [simple] → [visible] → [next step] → [done]
   ========================================================================== */

let editingTopicAuditId = null;
let compassUndoState = null;
let compassToastTimer = null;

function getCompassLens() {
  try {
    return localStorage.getItem('BOL_COMPASS_LENS') || 'visible';
  } catch (e) {
    return 'visible';
  }
}

function setCompassLens(lens) {
  try {
    localStorage.setItem('BOL_COMPASS_LENS', lens);
  } catch (e) {}
  renderCoverHubPage();
}
window.setCompassLens = setCompassLens;

function isCompassFwOpen() {
  try {
    const raw = localStorage.getItem('BOL_COMPASS_FW_OPEN');
    return raw === null ? true : raw === 'true';
  } catch (e) {
    return true;
  }
}

function toggleCompassFramework() {
  const next = !isCompassFwOpen();
  try {
    localStorage.setItem('BOL_COMPASS_FW_OPEN', String(next));
  } catch (e) {}
  renderCoverHubPage();
}
window.toggleCompassFramework = toggleCompassFramework;

const COMPASS_PILLARS = [
  { k: 'M', n: 'Move', c: ['10k steps', 'Close rings', 'Calorie deficit', 'Cardio', 'Yoga', 'Weights'] },
  { k: 'A', n: 'Aesthetic', c: ['Skincare', 'Signature outfits', 'Hair health', 'Footcare', 'Makeup'] },
  { k: 'R', n: 'Reflect', c: ['Meditate', 'Journal', 'Me time'] },
  { k: 'G', n: 'Grow', c: ['Hobbies', 'Learning'] },
  { k: 'O', n: 'Organize', c: ['Home projects', 'Finances', 'Travel', 'Everyday chores'] }
];

const COMPASS_MAIL_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 8l9 6 9-6"/></svg>';

function renderCoverHubPage() {
  currentView = 'cover';
  try {
    localStorage.setItem('BOL_ACTIVE_VIEW', 'cover');
    if (window.location.hash !== '#compass' && window.location.hash !== '#cover') {
      window.location.hash = 'compass';
    }
  } catch (e) {}

  const coverTab = document.getElementById('nav-btn-cover');
  const todayTab = document.getElementById('nav-btn-today');
  const zhubTab = document.getElementById('nav-btn-zhub');
  const financeTab = document.getElementById('nav-btn-finance');

  if (coverTab) { coverTab.classList.add('active', 'on'); coverTab.setAttribute('aria-current', 'page'); }
  if (todayTab) { todayTab.classList.remove('active', 'on'); todayTab.removeAttribute('aria-current'); }
  if (zhubTab) { zhubTab.classList.remove('active', 'on'); zhubTab.removeAttribute('aria-current'); }
  if (financeTab) { financeTab.classList.remove('active', 'on'); financeTab.removeAttribute('aria-current'); }

  const container = document.getElementById('daily-sheet-container');
  if (!container) return;

  const campaignsData = (typeof storage !== 'undefined' && typeof storage.getCoverCampaigns === 'function')
    ? storage.getCoverCampaigns()
    : { now: [], later: [] };

  const habits = (typeof storage !== 'undefined' && typeof storage.getHabits === 'function')
    ? storage.getHabits()
    : [];

  const seasonTheme = (typeof localStorage !== 'undefined' && localStorage.getItem('BOL_COVER_SEASON_FOCUS')) || 'Calm Mastery, Health Baseline & Vitality';
  const activeLens = getCompassLens();
  const fwOpen = isCompassFwOpen();

  let standPresetDisabled = false;
  try {
    standPresetDisabled = localStorage.getItem('BOL_COMPASS_STAND_PRESET_OFF') === 'true';
  } catch (e) {}

  let isWorkflowWide = false;
  try {
    isWorkflowWide = localStorage.getItem('BOL_COMPASS_WF_WIDE') === 'true';
  } catch (e) {}

  container.innerHTML = `
    <div class="mc-app ${activeLens === 'simple' ? 'simple' : ''}" id="mc-app">

      <div class="mc-lens" id="lens" role="group" aria-label="View">
        <button type="button" aria-pressed="${activeLens === 'simple' ? 'true' : 'false'}" data-lens="simple" onclick="setCompassLens('simple')">simple</button>
        <button type="button" aria-pressed="${activeLens === 'visible' ? 'true' : 'false'}" data-lens="visible" onclick="setCompassLens('visible')">visible</button>
        <button type="button" aria-pressed="${activeLens === 'next' ? 'true' : 'false'}" data-lens="next" onclick="setCompassLens('next')">next step</button>
        <button type="button" aria-pressed="${activeLens === 'done' ? 'true' : 'false'}" data-lens="done" onclick="setCompassLens('done')">done</button>
      </div>

      <section class="mc-banner" aria-label="Focus theme">
        <div class="mc-bt">
          <svg width="64" height="70" viewBox="0 0 104 112" role="img" aria-label="Bed Potato mascot" style="flex:none;cursor:pointer" onclick="switchAppView('sanctuary')" title="Tap to view Today">
            <ellipse cx="50" cy="48" rx="34" ry="30" fill="#E0AE70"/>
            <path d="M36 46 q6 6 12 0 M56 46 q6 6 12 0" stroke="#5a3b17" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="34" cy="58" r="5" fill="#F0A0A0" opacity=".7"/>
            <circle cx="66" cy="58" r="5" fill="#F0A0A0" opacity=".7"/>
            <rect x="14" y="68" width="72" height="34" rx="10" fill="#7B6CFF"/>
          </svg>
          <div class="mc-txt">
            <p class="mc-quote" id="cover-season-focus-text" onclick="promptEditSeasonFocus()" style="cursor:pointer" title="Tap to edit season focus">“${escapeHtml(seasonTheme)}”</p>
          </div>
        </div>
        <div class="mc-stats">
          <div class="mc-stat"><b id="sActive">${campaignsData.now.length}</b><span>Active focus</span></div>
          <div class="mc-stat"><b id="sDeck">${campaignsData.later.length}</b><span>On deck</span></div>
          <div class="mc-stat"><b>5</b><span>Pillars</span></div>
        </div>
      </section>

      <section class="mc-board" id="board" aria-labelledby="bT">
        <div class="mc-sechead">
          <h2 id="bT">Life architecture &amp; focus board</h2>
        </div>

        <div class="mc-lane-head">
          <div class="l">
            <span class="mc-lane-tag now">🐾 NOW</span>
            <span class="mc-muted">Active focus · in flight, ball in court or tracked</span>
          </div>
          <button type="button" class="mc-add" id="addNow" onclick="promptAddCampaignItem('now')">+ Add focus</button>
        </div>
        <div class="mc-focus-grid" id="nowList">
          ${campaignsData.now.length > 0
            ? campaignsData.now.map(camp => renderUnifiedCampaignCard(camp, 'now')).join('')
            : `<div class="mc-empty">Nothing active. Pull something in from Later.</div>`
          }
        </div>

        <div class="mc-divider"></div>

        <div class="mc-lane-head">
          <div class="l">
            <span class="mc-lane-tag later">🧊 LATER</span>
            <span class="mc-muted">On deck &amp; parking lot · next in queue once bandwidth opens</span>
          </div>
          <button type="button" class="mc-add" id="addLater" onclick="promptAddCampaignItem('later')">+ Add to later</button>
        </div>
        <div class="mc-later-grid" id="laterList">
          ${campaignsData.later.length > 0
            ? campaignsData.later.map(camp => renderUnifiedCampaignCard(camp, 'later')).join('')
            : `<div class="mc-empty">Parking lot is empty.</div>`
          }
        </div>
      </section>

      <div class="mc-side">

        <section class="mc-panel mc-workflow-panel ${isWorkflowWide ? 'is-wide' : ''}" aria-labelledby="tT" id="section-architecture-blueprint">
          <div class="mc-panel-head">
            <h2 id="tT">System compass</h2>
          </div>

          <!-- Modern Bento Grid Architecture (Native Interactive UI) -->
          <div class="mc-bento-grid">
            <!-- 1. margo -->
            <div class="mc-bento-card mc-bento-hero" onclick="switchAppView('sanctuary')" title="margo (Tap to open Daily Sheet)">
              <div class="mc-bento-top-row">
                <div class="mc-bento-brand">
                  <span class="mc-tb m">m</span>
                  <span class="mc-bento-name">margo</span>
                </div>
                <span class="mc-bento-badge cmd">COMMAND &amp; CONTROL</span>
              </div>
            </div>

            <!-- 2. Things 3 -->
            <div class="mc-bento-card mc-bento-things" title="Things 3">
              <div class="mc-bento-top-row" onclick="openThings3Query('')">
                <div class="mc-bento-brand">
                  <span class="mc-tb T3">T3</span>
                  <span class="mc-bento-name">Things 3</span>
                </div>
                <span class="mc-bento-badge exec">EXECUTION</span>
              </div>
              <div class="mc-bento-tags">
                <span class="mc-bento-tag high" onclick="openThings3Query('🌶️ #high priority')" title="Open 🌶️ High Priority in Things 3">🌶️ High Priority</span>
                <span class="mc-bento-tag active" onclick="openThings3Query('🐾 #active')" title="Open 🐾 Active in Things 3">🐾 Active</span>
                <span class="mc-bento-tag later" onclick="openThings3Query('🧊 #later')" title="Open 🧊 Later in Things 3">🧊 Later</span>
              </div>
            </div>

            <!-- 3. Gmail -->
            <div class="mc-bento-card" onclick="window.open('https://mail.google.com', '_blank')" title="Gmail (Tap to open)">
              <div class="mc-bento-top-row">
                <span class="mc-tb mail">${COMPASS_MAIL_SVG}</span>
                <span class="mc-bento-badge inflow">INFLOW</span>
              </div>
              <span class="mc-bento-name">Gmail</span>
            </div>

            <!-- 4. Apple Notes -->
            <div class="mc-bento-card" onclick="copyAppleNoteLauncher('')" title="Apple Notes (Tap to open)">
              <div class="mc-bento-top-row">
                <span class="mc-tb N">N</span>
                <span class="mc-bento-badge notes">MASTER NOTES</span>
              </div>
              <span class="mc-bento-name">Apple Notes</span>
            </div>

            <!-- 5. Google Drive -->
            <div class="mc-bento-card mc-bento-vault" onclick="window.open('https://drive.google.com', '_blank')" title="Google Drive (Tap to open)">
              <div class="mc-bento-top-row">
                <div class="mc-bento-brand">
                  <span class="mc-tb G">G</span>
                  <span class="mc-bento-name">Google Drive</span>
                </div>
                <span class="mc-bento-badge vault">MASTER VAULT</span>
              </div>
            </div>
          </div>
        </section>

        <section class="mc-panel" aria-labelledby="fT" id="section-framework-shelf">
          <div class="mc-fw-head">
            <div>
              <h2 id="fT">MARGO framework</h2>
              <span class="mc-muted">Daily intentional design buckets &amp; core focus areas</span>
            </div>
            <button type="button" id="fwBtn" aria-expanded="${fwOpen ? 'true' : 'false'}" aria-controls="pillars" onclick="toggleCompassFramework()">${fwOpen ? 'Collapse' : 'Expand'}</button>
          </div>
          <div class="mc-pillars" id="pillars" style="display:${fwOpen ? 'grid' : 'none'}">
            ${COMPASS_PILLARS.map(p => `
              <article class="mc-pl ${p.k}">
                <div class="hd">
                  <span class="ltr" aria-hidden="true">${p.k}</span>
                  <h3>${escapeHtml(p.n)}</h3>
                </div>
                <div class="cs">
                  ${p.c.map(chip => `<span>${escapeHtml(chip)}</span>`).join('')}
                </div>
              </article>
            `).join('')}
          </div>
        </section>

        <section class="mc-panel" aria-labelledby="pT" id="section-presets-shelf">
          <h2 id="pT">Habit presets</h2>
          <span class="mc-muted">Tap a preset to add it to your daily tracking stack</span>
          <div class="mc-presets" id="presets">
            ${RECOMMENDED_HABIT_PRESETS.map((preset, pIdx) => {
              const pName = preset.name.toLowerCase().trim();
              const isStand = (pName === 'stand ring' || pName === 'stand');
              const isAdded = isStand
                ? !standPresetDisabled
                : habits.some(h => h && h.name.toLowerCase().trim() === pName);
              return `
                <button type="button"
                        aria-pressed="${isAdded ? 'true' : 'false'}"
                        data-n="${escapeHtml(preset.name)}"
                        onclick="addHabitFromPresetCover(${pIdx})">${isAdded ? '✓ ' : '+ '}${escapeHtml(preset.name)}</button>
              `;
            }).join('')}
          </div>
        </section>

      </div>

      <div id="mc-toast" role="status" aria-live="polite" style="display:${compassUndoState ? 'flex' : 'none'}">
        <span id="mcToastMsg">${compassUndoState ? escapeHtml(compassUndoState.message) : ''}</span>
        <button type="button" id="mcToastUndo" onclick="undoCompassRemove()">Undo</button>
      </div>

    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}
window.renderCoverHubPage = renderCoverHubPage;

function promptEditSeasonFocus() {
  const current = (typeof localStorage !== 'undefined' && localStorage.getItem('BOL_COVER_SEASON_FOCUS')) || 'Calm Mastery, Health Baseline & Vitality';
  const updated = prompt('Focus theme', current);
  if (updated && updated.trim()) {
    try {
      localStorage.setItem('BOL_COVER_SEASON_FOCUS', updated.trim());
    } catch (e) {}
    renderCoverHubPage();
  }
}
window.promptEditSeasonFocus = promptEditSeasonFocus;

/* --------------------------------------------------------------------------
   Unified Life Architecture Card Renderer & Handlers
   -------------------------------------------------------------------------- */
function getDomainThemeClass(camp) {
  const meta = getCampaignCategoryMeta(camp);
  return meta.theme;
}
window.getDomainThemeClass = getDomainThemeClass;

function getCampaignCategoryMeta(camp) {
  const t = (camp.title || camp.id || '').toLowerCase();
  if (t.includes('school') || t.includes('iep') || t.includes('ood') || t.includes('windsor')) {
    return {
      tag: 'ED',
      name: 'School & IEP',
      theme: 'ED',
      dotColor: '#B5ABFF',
      summerTheme: 'theme-lavender',
      accentColor: '#7C3AED',
      icon: 'graduation-cap',
      badgeClass: 'budget-badge-violet'
    };
  }
  if (t.includes('surgery') || t.includes('health') || t.includes('doctor') || t.includes('clinic')) {
    return {
      tag: 'HEALTH',
      name: 'Health & Surgery',
      theme: 'HEALTH',
      dotColor: '#7DB8FF',
      summerTheme: 'theme-sky',
      accentColor: '#0284C7',
      icon: 'heart-pulse',
      badgeClass: 'budget-badge-sky'
    };
  }
  if (t.includes('oon') || t.includes('reimb') || t.includes('claim') || t.includes('superbill') || t.includes('finan') || t.includes('money') || t.includes('tax') || t.includes('budget')) {
    return {
      tag: 'FIN',
      name: 'Finance & Claims',
      theme: 'FIN',
      dotColor: '#62D6B3',
      summerTheme: 'theme-mint',
      accentColor: '#0D98BA',
      icon: 'receipt',
      badgeClass: 'budget-badge-teal'
    };
  }
  if (t.includes('home') || t.includes('declutter') || t.includes('room') || t.includes('closet')) {
    return {
      tag: 'HOME',
      name: 'Home Declutter',
      theme: 'HOME',
      dotColor: '#62D6B3',
      summerTheme: 'theme-mint',
      accentColor: '#0D98BA',
      icon: 'home',
      badgeClass: 'budget-badge-teal'
    };
  }
  if (t.includes('food') || t.includes('nutri') || t.includes('meal') || t.includes('diet') || t.includes('cook') || t.includes('grow')) {
    return {
      tag: 'GROW',
      name: 'Growth & Nutrition',
      theme: 'GROW',
      dotColor: '#B5ABFF',
      summerTheme: 'theme-coral',
      accentColor: '#EA580C',
      icon: 'sprout',
      badgeClass: 'budget-badge-violet'
    };
  }
  if (camp.cat && ['ED', 'HEALTH', 'FIN', 'HOME', 'CARE', 'GROW'].includes(camp.cat)) {
    const catMap = {
      ED: { name: 'Education & IEP', summerTheme: 'theme-lavender', accentColor: '#7C3AED', icon: 'graduation-cap', badgeClass: 'budget-badge-violet', dotColor: '#B5ABFF' },
      HEALTH: { name: 'Health & Wellness', summerTheme: 'theme-sky', accentColor: '#0284C7', icon: 'heart-pulse', badgeClass: 'budget-badge-sky', dotColor: '#7DB8FF' },
      FIN: { name: 'Finance & Claims', summerTheme: 'theme-mint', accentColor: '#0D98BA', icon: 'receipt', badgeClass: 'budget-badge-teal', dotColor: '#62D6B3' },
      HOME: { name: 'Home & Space', summerTheme: 'theme-mint', accentColor: '#0D98BA', icon: 'home', badgeClass: 'budget-badge-teal', dotColor: '#62D6B3' },
      GROW: { name: 'Growth & Learning', summerTheme: 'theme-coral', accentColor: '#EA580C', icon: 'sprout', badgeClass: 'budget-badge-violet', dotColor: '#B5ABFF' },
      CARE: { name: 'Self Care & Routine', summerTheme: 'theme-rose', accentColor: '#E11D48', icon: 'sparkles', badgeClass: 'budget-badge-rose', dotColor: '#FF8FD0' }
    };
    const m = catMap[camp.cat] || catMap.CARE;
    return { tag: camp.cat, theme: camp.cat, ...m };
  }
  return {
    tag: 'CARE',
    name: 'Self Care & Routine',
    theme: 'CARE',
    dotColor: '#FF8FD0',
    summerTheme: 'theme-rose',
    accentColor: '#E11D48',
    icon: 'sparkles',
    badgeClass: 'budget-badge-rose'
  };
}
window.getCampaignCategoryMeta = getCampaignCategoryMeta;

function resolveCampaignTools(camp) {
  const tools = camp.tools || {};
  const isArr = Array.isArray(tools);
  const findInArr = (fn) => isArr ? tools.find(fn) : null;
  const campTitle = camp.title || '';

  let margoAction = 'margo';
  let margoLabel = campTitle;
  if (!isArr && tools.margo) {
    margoAction = tools.margo.action || 'margo';
    margoLabel = tools.margo.label || campTitle;
  } else if (isArr) {
    const m = findInArr(t => t.action || t.isRoadmap || String(t.label || t).toLowerCase().includes('margo') || String(t.label || t).toLowerCase().includes('checkpoint'));
    if (m) {
      margoAction = m.action || (m.isRoadmap ? 'school-plan' : 'margo');
      margoLabel = m.label || campTitle;
    }
  }

  let noteQuery = `# ${campTitle.toUpperCase().replace(/[^A-Z0-9_ ]/g, '')}`;
  if (!isArr && tools.apple && tools.apple.noteQuery) {
    noteQuery = tools.apple.noteQuery;
  } else if (isArr) {
    const a = findInArr(t => t.noteQuery || String(t.label || t).toLowerCase().includes('note'));
    if (a && a.noteQuery) noteQuery = a.noteQuery;
  }

  let driveFolder = campTitle;
  if (!isArr && tools.google && tools.google.folder) {
    driveFolder = tools.google.folder;
  } else if (isArr) {
    const g = findInArr(t => t.folder || String(t.label || t).toLowerCase().includes('drive'));
    if (g && g.folder) driveFolder = g.folder;
  }

  let thingsQuery = campTitle;
  if (!isArr && tools.things && tools.things.query) {
    thingsQuery = tools.things.query;
  } else if (isArr) {
    const t = findInArr(t => t.query || String(t.label || t).toLowerCase().includes('things'));
    if (t && t.query) thingsQuery = t.query;
  }

  let emailQuery = campTitle;
  if (!isArr && tools.email && tools.email.emailQuery) {
    emailQuery = tools.email.emailQuery;
  } else if (isArr) {
    const e = findInArr(t => t.emailQuery || String(t.label || t).toLowerCase().includes('gmail') || String(t.label || t).toLowerCase().includes('email'));
    if (e && e.emailQuery) emailQuery = e.emailQuery;
  }

  return {
    margoAction,
    margoLabel,
    noteQuery,
    driveFolder,
    thingsQuery,
    emailQuery
  };
}
window.resolveCampaignTools = resolveCampaignTools;

function renderUnifiedCampaignCard(camp, tier) {
  const isNow = tier === 'now';
  const isHaircare = (camp.id === 'camp-haircare' || (camp.title || '').toLowerCase().trim() === 'haircare');
  const isSurgery = (camp.id === 'camp-surgery' || (camp.title || '').toLowerCase().trim() === 'surgery');
  const isOon = (camp.id === 'camp-oon' || (camp.title || '').toLowerCase().includes('oon') || (camp.title || '').toLowerCase().includes('reimburse'));
  const catMeta = getCampaignCategoryMeta(camp);

  // Normalize display title for Z school & oon to match Compass design cleanly while preserving custom titles
  let displayTitle = camp.title || '';
  if (camp.id === 'camp-school' && displayTitle.toLowerCase().includes('z school')) {
    displayTitle = 'Z school & IEP';
  } else if (camp.id === 'camp-oon' || displayTitle.toLowerCase().includes('reimb') || displayTitle.toLowerCase() === 'oon reimbrsement') {
    displayTitle = 'oon';
  }

  // Normalize status: IP, Maintain, NS
  let statusKey = String(camp.status || (isHaircare ? 'Maintain' : (isNow ? 'IP' : 'NS'))).trim();
  if (isHaircare && (!camp.status || camp.status === 'IP')) statusKey = 'Maintain';
  else if (statusKey === 'strike' || statusKey.toLowerCase() === 'ip' || statusKey === 'active') statusKey = 'IP';
  else if (statusKey === 'ondeck' || statusKey === 'waiting' || statusKey.toLowerCase() === 'ns') statusKey = 'NS';
  else if (statusKey === 'review' || statusKey.toLowerCase() === 'maintain') statusKey = 'Maintain';
  else if (!['IP', 'NS', 'Maintain'].includes(statusKey)) statusKey = isNow ? 'IP' : 'NS';

  const statusNames = { IP: 'In progress', Maintain: 'Maintain', NS: 'Not started' };
  const statusLabel = statusKey === 'Maintain' ? 'Maintain' : statusKey;
  const statusBtnHtml = `
    <button type="button"
            class="mc-status ${statusKey}"
            aria-label="Status: ${statusNames[statusKey] || statusKey}. Tap to change"
            onclick="cycleCampaignStatus('${camp.id}', event)">
      <i></i>${statusLabel}
    </button>
  `;

  const escapedTitleForJs = escapeHtml((camp.title || '').replace(/'/g, "\\'"));
  const xBtnHtml = `
    <button type="button"
            class="mc-x"
            aria-label="Remove ${escapeHtml(displayTitle)}"
            onclick="deleteCampaignAction('${camp.id}', '${tier}')">×</button>
  `;

  if (!isNow) {
    return `
      <div class="mc-lr ${catMeta.tag}">
        <span class="mc-dot" aria-hidden="true"></span>
        <span class="mc-nm" onclick="promptEditCampaignTitle('${camp.id}', '${escapedTitleForJs}')" title="Tap to edit title" style="cursor:pointer">${escapeHtml(displayTitle)}</span>
        ${statusBtnHtml}
        <button type="button" class="mc-mv" aria-label="Move ${escapeHtml(displayTitle)} to now" onclick="moveCampaignAction('${camp.id}', 'later', 'now')">← 🐾 Now</button>
        ${xBtnHtml}
      </div>
    `;
  }

  // Resolve tool badges: m, N, G, T3, mail
  const { margoAction, margoLabel, noteQuery, driveFolder, thingsQuery, emailQuery } = resolveCampaignTools(camp);

  let showMargo = true;
  let showApple = true;
  let showGoogle = true;
  let showThings = true;
  let showEmail = true;

  if (Array.isArray(camp.visibleTools)) {
    showMargo = camp.visibleTools.includes('margo') || camp.visibleTools.includes('m');
    showApple = camp.visibleTools.includes('apple') || camp.visibleTools.includes('N');
    showGoogle = camp.visibleTools.includes('google') || camp.visibleTools.includes('g') || camp.visibleTools.includes('G');
    showThings = camp.visibleTools.includes('things') || camp.visibleTools.includes('things3') || camp.visibleTools.includes('t3') || camp.visibleTools.includes('T3');
    showEmail = camp.visibleTools.includes('email') || camp.visibleTools.includes('gmail') || camp.visibleTools.includes('mail');
  } else if (camp.tools && typeof camp.tools === 'object' && !Array.isArray(camp.tools)) {
    showMargo = camp.tools.margo !== undefined ? Boolean(camp.tools.margo) : true;
    showApple = camp.tools.apple !== undefined ? Boolean(camp.tools.apple) : true;
    showGoogle = camp.tools.google !== undefined ? Boolean(camp.tools.google) : true;
    showThings = camp.tools.things !== undefined ? Boolean(camp.tools.things) : true;
    showEmail = camp.tools.email !== undefined ? Boolean(camp.tools.email) : true;
  }

  if (isHaircare) {
    showMargo = true;
    showApple = true;
    showGoogle = false;
    showThings = false;
    showEmail = false;
  }
  if (isSurgery) {
    showMargo = false;
    showApple = true;
    showGoogle = false;
    showThings = true;
    showEmail = false;
  }
  if (isOon) {
    showMargo = true;
    showApple = false;
    showGoogle = true;
    showThings = true;
    showEmail = true;
  }

  const toolBadges = [];
  if (showMargo) {
    toolBadges.push(`<button type="button" class="mc-tb m" title="margo: ${escapeHtml(margoLabel)}" aria-label="margo" onclick="handleMargoToolClick('${camp.id}', '${margoAction}', '${escapedTitleForJs}')">m</button>`);
  }
  if (showApple) {
    toolBadges.push(`<button type="button" class="mc-tb N" title="Apple Notes: ${escapeHtml(noteQuery)}" aria-label="Apple Notes" onclick="copyAppleNoteLauncher('${escapeHtml(noteQuery.replace(/'/g, "\\'"))}')">N</button>`);
  }
  if (showGoogle) {
    toolBadges.push(`<button type="button" class="mc-tb G" title="Google Drive: ${escapeHtml(driveFolder)}" aria-label="Google Drive" onclick="openDriveFolder('${escapeHtml(driveFolder.replace(/'/g, "\\'"))}')">G</button>`);
  }
  if (showThings) {
    toolBadges.push(`<button type="button" class="mc-tb T3" title="Things 3: ${escapeHtml(thingsQuery)}" aria-label="Things 3" onclick="openThings3Query('${escapeHtml(thingsQuery.replace(/'/g, "\\'"))}')">T3</button>`);
  }
  if (showEmail) {
    toolBadges.push(`<button type="button" class="mc-tb mail" title="Gmail: ${escapeHtml(emailQuery)}" aria-label="Gmail" onclick="openGmailLabel('${escapeHtml(emailQuery.replace(/'/g, "\\'"))}')">${COMPASS_MAIL_SVG}</button>`);
  }

  return `
    <article class="mc-fc summer-widget-card ${catMeta.tag} ${catMeta.summerTheme}">
      <div class="summer-widget-watermark" style="color: ${catMeta.accentColor};">
        <i data-lucide="${catMeta.icon}"></i>
      </div>
      <div class="summer-widget-top">
        <div class="mc-fc-head-left">
          <div class="summer-widget-pill">
            <i data-lucide="${catMeta.icon}" style="width: 16px; height: 16px; color: ${catMeta.accentColor};"></i>
          </div>
          <span class="budget-badge ${catMeta.badgeClass}">${catMeta.tag}</span>
          <h3 class="summer-widget-title" onclick="promptEditCampaignTitle('${camp.id}', '${escapedTitleForJs}')" title="Tap to edit title" style="cursor:pointer">${escapeHtml(displayTitle)}</h3>
        </div>
        <div class="mc-top-actions">
          ${statusBtnHtml}
          <span class="mc-sep" aria-hidden="true"></span>
          <button type="button" class="mc-mv" aria-label="Move ${escapeHtml(displayTitle)} to later" onclick="moveCampaignAction('${camp.id}', 'now', 'later')">🧊 Later →</button>
        </div>
      </div>
      <div class="bot summer-widget-foot">
        <div class="mc-tools">${toolBadges.join('')}</div>
      </div>
    </article>
  `;
}
window.renderUnifiedCampaignCard = renderUnifiedCampaignCard;

function cycleCampaignStatus(campId, event) {
  if (event) event.stopPropagation();
  if (typeof storage === 'undefined') return;
  const campaigns = storage.getCoverCampaigns();
  let camp = campaigns.now.find(x => x.id === campId) || campaigns.later.find(x => x.id === campId);
  if (!camp) return;

  const statusNext = { IP: 'Maintain', Maintain: 'NS', NS: 'IP' };
  let currentKey = camp.status || 'IP';
  if (currentKey === 'strike' || currentKey === 'active') currentKey = 'IP';
  else if (currentKey === 'ondeck' || currentKey === 'waiting') currentKey = 'NS';
  else if (currentKey === 'review') currentKey = 'Maintain';

  const nextStatus = statusNext[currentKey] || 'IP';
  storage.updateCoverCampaignStatus(campId, nextStatus);
  renderCoverHubPage();
}
window.cycleCampaignStatus = cycleCampaignStatus;

function moveCampaignAction(campId, fromTier, toTier) {
  if (typeof storage !== 'undefined') {
    storage.moveCoverCampaign(campId, fromTier, toTier);
    renderCoverHubPage();
  }
}
window.moveCampaignAction = moveCampaignAction;

function deleteCampaignAction(campId, tier) {
  if (typeof storage !== 'undefined') {
    const campaigns = storage.getCoverCampaigns();
    const arr = campaigns[tier] || [];
    const idx = arr.findIndex(x => x.id === campId);
    if (idx !== -1) {
      const removedItem = JSON.parse(JSON.stringify(arr[idx]));
      storage.deleteCoverCampaign(campId, tier);
      let displayTitle = removedItem.title || '';
      if (removedItem.id === 'camp-school' && displayTitle.toLowerCase().includes('z school')) displayTitle = 'Z school & IEP';
      else if (removedItem.id === 'camp-oon' || displayTitle.toLowerCase().includes('reimb') || displayTitle.toLowerCase() === 'oon reimbrsement') displayTitle = 'oon';

      compassUndoState = {
        tier,
        index: idx,
        item: removedItem,
        message: `Removed "${displayTitle}"`
      };
      clearTimeout(compassToastTimer);
      compassToastTimer = setTimeout(() => {
        compassUndoState = null;
        const toastEl = document.getElementById('mc-toast');
        if (toastEl) toastEl.style.display = 'none';
      }, 6000);
      renderCoverHubPage();
    }
  }
}
window.deleteCampaignAction = deleteCampaignAction;

function undoCompassRemove() {
  if (!compassUndoState || typeof storage === 'undefined') return;
  const { tier, index, item } = compassUndoState;
  const campaigns = storage.getCoverCampaigns();
  if (!campaigns[tier]) campaigns[tier] = [];
  campaigns[tier].splice(Math.min(index, campaigns[tier].length), 0, item);
  storage.data.coverUpdatedAt = Date.now();
  storage.saveData();
  compassUndoState = null;
  clearTimeout(compassToastTimer);
  renderCoverHubPage();
}
window.undoCompassRemove = undoCompassRemove;

function promptAddCampaignItem(tier) {
  const title = prompt(tier === 'now' ? 'New focus' : 'Add to later');
  if (title && title.trim().length > 0 && typeof storage !== 'undefined') {
    storage.addCoverCampaign(tier, {
      title: title.trim(),
      cat: 'GROW',
      status: tier === 'now' ? 'IP' : 'NS',
      visibleTools: [],
      tools: {}
    });
    renderCoverHubPage();
  }
}
window.promptAddCampaignItem = promptAddCampaignItem;

function promptEditCampaignTitle(campId, currentTitle) {
  const newTitle = prompt('Edit focus title:', currentTitle);
  if (newTitle && newTitle.trim().length > 0 && typeof storage !== 'undefined') {
    const campaigns = storage.getCoverCampaigns();
    let camp = campaigns.now.find(x => x.id === campId) || campaigns.later.find(x => x.id === campId);
    if (camp) {
      camp.title = newTitle.trim();
      storage.data.coverUpdatedAt = Date.now();
      storage.saveData();
      renderCoverHubPage();
    }
  }
}
window.promptEditCampaignTitle = promptEditCampaignTitle;

/* --------------------------------------------------------------------------
   Where Info Lives Event Handlers & Modal
   -------------------------------------------------------------------------- */
function openTopicAuditModal(editId = null) {
  editingTopicAuditId = editId;
  let audit = null;
  if (editId && typeof storage !== 'undefined') {
    const list = storage.getCoverTopicAudits();
    audit = list.find(x => x.id === editId);
  }

  let modal = document.getElementById('modal-topic-audit');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-topic-audit';
    modal.className = 'modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) closeTopicAuditModal(); };
    document.body.appendChild(modal);
  }

  const topicVal = audit ? audit.topic : '';
  const toolsVal = audit && Array.isArray(audit.tools) ? audit.tools.join(', ') : '';
  const statusVal = audit ? audit.status : 'in_progress';

  modal.innerHTML = `
    <div class="modal-card" style="max-width: 480px;">
      <div class="modal-header">
        <h3>${audit ? '✏️ Edit Topic' : '🌿 Add Topic'}</h3>
        <button class="icon-btn" onclick="closeTopicAuditModal()"><i data-lucide="x"></i></button>
      </div>

      <form onsubmit="submitTopicAuditModal(event)">
        <div class="form-group">
          <label class="form-label">Topic / Life Area</label>
          <input type="text" class="form-input" id="audit-form-topic" placeholder="e.g. Skincare, Kids Health, Wardrobe, Home Logistics..." value="${escapeHtml(topicVal)}" required>
        </div>

        <div class="form-group">
          <label class="form-label">Where It Lives Currently</label>
          <div style="margin-bottom: 8px;">
            <span style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-bottom: 6px;">
              Potential Sources (tap to toggle):
            </span>
            <div class="source-picker-pills" id="source-picker-pills">
              ${(typeof POTENTIAL_INFO_SOURCES !== 'undefined' ? POTENTIAL_INFO_SOURCES : [
                { id: 'margo', label: 'margo' },
                { id: 'icloud', label: 'iCloud' },
                { id: 'drive', label: 'Google Drive' },
                { id: 'things', label: 'Things 3' },
                { id: 'email', label: 'emails' },
                { id: 'notes', label: 'Apple notes' }
              ]).map(src => {
                const currentArr = audit && Array.isArray(audit.tools) ? audit.tools : [];
                const isSelected = currentArr.some(t => t.toLowerCase() === src.label.toLowerCase());
                return `
                  <button type="button" 
                          class="source-toggle-pill ${isSelected ? 'selected' : ''}" 
                          onclick="toggleSourcePickerPill('${escapeHtml(src.label)}', this)">
                    ${isSelected ? '✓ ' : '+ '}${escapeHtml(src.label)}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
          <input type="text" class="form-input" id="audit-form-tools" placeholder="e.g. margo, Apple notes, Google Drive..." value="${escapeHtml(toolsVal)}" required>
          <span style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px; display: block;">
            Tap chips above or type custom comma-separated sources
          </span>
        </div>

        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" id="audit-form-status">
            <option value="in_progress" ${statusVal === 'in_progress' ? 'selected' : ''}>🔄 In Progress (Untangling &amp; organizing)</option>
            <option value="streamlined" ${statusVal === 'streamlined' ? 'selected' : ''}>✅ Organized (Clear &amp; simplified)</option>
            <option value="disorganized" ${statusVal === 'disorganized' ? 'selected' : ''}>⚠️ Cluttered (Needs cleanup)</option>
          </select>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px;">
          <button type="button" class="btn btn-secondary" onclick="closeTopicAuditModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" style="background: #3D5A45; border-color: #3D5A45;">${audit ? 'Save Changes' : 'Add Topic'}</button>
        </div>
      </form>
    </div>
  `;

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}
window.openTopicAuditModal = openTopicAuditModal;

function toggleSourcePickerPill(sourceName, btn) {
  const input = document.getElementById('audit-form-tools');
  if (!input) return;
  let currentList = input.value.split(',').map(s => s.trim()).filter(Boolean);
  const idx = currentList.findIndex(s => s.toLowerCase() === sourceName.toLowerCase());
  if (idx !== -1) {
    currentList.splice(idx, 1);
    if (btn) {
      btn.classList.remove('selected');
      btn.textContent = '+ ' + sourceName;
    }
  } else {
    currentList.push(sourceName);
    if (btn) {
      btn.classList.add('selected');
      btn.textContent = '✓ ' + sourceName;
    }
  }
  input.value = currentList.join(', ');
}
window.toggleSourcePickerPill = toggleSourcePickerPill;

function closeTopicAuditModal() {
  const modal = document.getElementById('modal-topic-audit');
  if (modal) modal.classList.remove('active');
  editingTopicAuditId = null;
}
window.closeTopicAuditModal = closeTopicAuditModal;

function submitTopicAuditModal(event) {
  event.preventDefault();
  const topic = document.getElementById('audit-form-topic').value.trim();
  const tools = document.getElementById('audit-form-tools').value.split(',').map(s => s.trim()).filter(Boolean);
  const status = document.getElementById('audit-form-status').value;

  if (typeof storage !== 'undefined') {
    if (editingTopicAuditId) {
      storage.updateCoverTopicAudit(editingTopicAuditId, { topic, tools, status });
      if (typeof showToast === 'function') showToast(`Updated "${topic}"`);
    } else {
      storage.addCoverTopicAudit({ topic, tools, status });
      if (typeof showToast === 'function') showToast(`Added "${topic}"`);
    }
  }

  closeTopicAuditModal();
  renderCoverHubPage();
}
window.submitTopicAuditModal = submitTopicAuditModal;

function editTopicAuditAction(id) {
  openTopicAuditModal(id);
}
window.editTopicAuditAction = editTopicAuditAction;

function deleteTopicAuditAction(id) {
  if (confirm('Delete this topic from Where Info Lives?')) {
    if (typeof storage !== 'undefined') {
      storage.deleteCoverTopicAudit(id);
      renderCoverHubPage();
      if (typeof showToast === 'function') showToast('Topic removed');
    }
  }
}
window.deleteTopicAuditAction = deleteTopicAuditAction;

function addHabitFromPresetCover(presetIndex) {
  const preset = RECOMMENDED_HABIT_PRESETS[presetIndex];
  if (!preset || typeof storage === 'undefined') return;

  const pName = preset.name.toLowerCase().trim();
  if (pName === 'stand ring' || pName === 'stand') {
    try {
      const currentOff = localStorage.getItem('BOL_COMPASS_STAND_PRESET_OFF') === 'true';
      localStorage.setItem('BOL_COMPASS_STAND_PRESET_OFF', String(!currentOff));
    } catch (e) {}
    renderCoverHubPage();
    return;
  }

  const existing = storage.getHabits().find(h => h && h.name.toLowerCase().trim() === pName);
  if (existing && existing.id !== 'h-move' && existing.id !== 'h-stand') {
    storage.deleteHabit(existing.id);
  } else if (!existing) {
    storage.addHabit(preset);
  }
  renderCoverHubPage();
}
window.addHabitFromPresetCover = addHabitFromPresetCover;

/* --------------------------------------------------------------------------
   Active Campaigns & Life Architecture Interactive Helpers
   -------------------------------------------------------------------------- */
function copyAppleNoteLauncher(noteTitle) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(noteTitle).then(() => {
      if (typeof showToast === 'function') {
        showToast(`📋 Copied "${noteTitle}" — paste or search in Apple Notes`);
      }
    }).catch(() => {
      if (typeof showToast === 'function') showToast(`Apple Note: ${noteTitle}`);
    });
  } else if (typeof showToast === 'function') {
    showToast(`Apple Note: ${noteTitle}`);
  }
}
window.copyAppleNoteLauncher = copyAppleNoteLauncher;

function copyThingsStrike(strikeText) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(strikeText).then(() => {
      if (typeof showToast === 'function') {
        showToast(`⚡ Copied strike to clipboard: "${strikeText}"`);
      }
    }).catch(() => {
      if (typeof showToast === 'function') showToast(`Strike: ${strikeText}`);
    });
  } else if (typeof showToast === 'function') {
    showToast(`Strike: ${strikeText}`);
  }
}
window.copyThingsStrike = copyThingsStrike;

function openDriveFolder(folderName) {
  const url = 'https://drive.google.com/drive/search?q=' + encodeURIComponent(folderName);
  window.open(url, '_blank', 'noopener,noreferrer');
  if (typeof showToast === 'function') {
    showToast(`📁 Opening Google Drive search for "${folderName}"`);
  }
}
window.openDriveFolder = openDriveFolder;

function openGmailLabel(labelName) {
  const url = 'https://mail.google.com/mail/u/0/#search/label%3A' + encodeURIComponent(labelName);
  window.open(url, '_blank', 'noopener,noreferrer');
  if (typeof showToast === 'function') {
    showToast(`✉️ Opening Gmail for label "${labelName}"`);
  }
}
window.openGmailLabel = openGmailLabel;

function jumpToHaircareCheckpoint() {
  if (typeof switchAppView === 'function') {
    switchAppView('sanctuary');
  }
  setTimeout(() => {
    const el = document.getElementById('checkpoint-haircare') || 
               document.querySelector('[data-checkpoint="haircare"]') || 
               document.getElementById('section-haircare');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (typeof showToast === 'function') {
      showToast('🗓️ Jumped to Sanctuary for Haircare Checkpoint');
    }
  }, 120);
}
window.jumpToHaircareCheckpoint = jumpToHaircareCheckpoint;

function jumpToSanctuaryCheckpoint(checkpointKey) {
  if (typeof switchAppView === 'function') {
    switchAppView('sanctuary');
  }
  setTimeout(() => {
    const el = document.getElementById(`checkpoint-${checkpointKey}`) ||
               document.querySelector(`[data-checkpoint="${checkpointKey}"]`) ||
               document.getElementById(`section-${checkpointKey}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 120);
}
window.jumpToSanctuaryCheckpoint = jumpToSanctuaryCheckpoint;

function handleMargoToolClick(campId, action, title) {
  const lower = (title || '').toLowerCase();
  if (action === 'school-plan' || lower.includes('school') || lower.includes('iep') || lower.includes('ood')) {
    openSchoolBattlePlanModal();
  } else if (action === 'haircare' || lower.includes('hair')) {
    jumpToHaircareCheckpoint();
  } else if (action === 'vitality' || lower.includes('surg')) {
    jumpToSanctuaryCheckpoint('vitality');
  } else if (action === 'claims' || lower.includes('reimb') || lower.includes('claim')) {
    if (typeof switchDomain === 'function') switchDomain('finance');
    if (typeof activeFinanceSubTab !== 'undefined') activeFinanceSubTab = 'claims';
  } else if (action === 'finance' || lower.includes('finan') || lower.includes('money')) {
    if (typeof switchDomain === 'function') switchDomain('finance');
  } else if (action === 'choices' || lower.includes('food')) {
    jumpToSanctuaryCheckpoint('choices');
  } else {
    if (typeof showToast === 'function') {
      showToast(`🌿 margo: Focused on ${title}`);
    }
  }
}
window.handleMargoToolClick = handleMargoToolClick;

function openThings3Query(query) {
  const clean = encodeURIComponent(query || '');
  const url = `things:///show?query=${clean}`;
  try {
    window.location.href = url;
  } catch (e) {}
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(query);
  }
  if (typeof showToast === 'function') {
    showToast(`⚡ Things 3: Opened & copied "${query}"`);
  }
}
window.openThings3Query = openThings3Query;

/* --------------------------------------------------------------------------
   School Admissions & OOD Placement Battle Plan Modal & Setup Helpers
   -------------------------------------------------------------------------- */
function jumpToZHubDailyLogs() {
  closeAllModals();
  if (typeof switchDomain === 'function') {
    switchDomain('zhub');
  }
  if (typeof showToast === 'function') {
    showToast('🌱 Opened Z Hub: Behavior Logs & PDF Attachments');
  }
}
window.jumpToZHubDailyLogs = jumpToZHubDailyLogs;

function copySchoolBattlePlanTemplate() {
  const template = `# 🏛️ Z: SCHOOL ADMISSIONS & OOD PLACEMENT
*Battle Plan & Operating System*

## 📌 CURRENT STATUS
- Phase: Phase 2 (School Selection & Admissions Tours)
- Target: Secure admissions seat and finalize transfer
- Parallel: Hold district accountable for IEP non-compliance & police incident

## ⏳ WAITING ON RADAR
- [ ] Windsor admissions tour date confirmation (Ping Oct 8)
- [ ] District records transmittal packet (Ping Oct 10)

## ⚡ NEXT STRIKES IN THINGS 3
- [ ] 📞 Call Windsor admissions re: tour
- [ ] 📄 Request copy of police incident report from precinct

## 🗺️ PHASE ROADMAP
### Phase 1: District OOD Agreement [COMPLETE ✅]
- [x] Secured formal district consensus for out-of-district specialized placement

### Phase 2: School Selection & Admissions [ACTIVE 📌]
- [x] Compile candidate school list (Windsor School, etc.)
- [ ] Tour candidate schools & intake interviews
- [ ] Submit application packet & neuropsych evaluations
- [ ] Receive acceptance letter & seat confirmation

### Phase 3: Transfer & IEP Transition [UP NEXT ⏳]
- [ ] District-funded transportation coordination
- [ ] Transfer IEP accommodations & therapist hours (OT/Speech)
- [ ] First day orientation & student transition

### Phase 4: District Accountability & Police Incident [PARALLEL ⚖️]
- [ ] Obtain police incident report from precinct
- [ ] Document non-compliance timeline vs PWN records
- [ ] Formal district follow-through

## 📁 EVIDENCE & RECORDS (Google Drive)
- Folder: Z Records / IEP Docs
- Files: Neuropsych eval, Signed IEPs, Prior Written Notices (PWNs), Incident records`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(template).then(() => {
      if (typeof showToast === 'function') {
        showToast('📋 Copied Battle Plan Template to clipboard!');
      }
    }).catch(() => {
      if (typeof showToast === 'function') showToast('Template copied');
    });
  } else if (typeof showToast === 'function') {
    showToast('Template copied');
  }
}
window.copySchoolBattlePlanTemplate = copySchoolBattlePlanTemplate;

function openSchoolBattlePlanModal() {
  let modal = document.getElementById('modal-school-battleplan');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'modal-school-battleplan';
    modal.onclick = function(e) {
      if (e.target === this) closeAllModals();
    };
    modal.innerHTML = `
      <div class="modal-card modal-school-card">
        <div class="school-modal-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.25rem;">🏛️</span>
              <h3 class="school-modal-title">Z: School Admissions &amp; OOD Placement</h3>
            </div>
            <span class="school-modal-sub">Multi-Phase Roadmap &bull; Tool-by-Tool Operating Blueprint</span>
          </div>
          <button class="icon-btn" onclick="closeAllModals()" title="Close"><i data-lucide="x"></i></button>
        </div>

        <div class="school-modal-body">
          <!-- Current Phase Status Banner -->
          <div class="school-phase-banner">
            <div>
              <span class="banner-phase-label">Current Phase: Phase 2 of 4</span>
              <div class="banner-phase-focus">School Selection &amp; Admissions Tours</div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
              <span style="font-size: 0.72rem; font-weight: 700; color: #2D5A3C; background: #E8F2EC; padding: 2px 8px; border-radius: 9999px;">Radar: Windsor Oct 8</span>
              <span style="font-size: 0.68rem; color: #64748B;">Parallel: District PWN &amp; Police incident</span>
            </div>
          </div>

          <!-- Step-by-Step Sequence -->
          <div class="school-steps-block">
            <div class="school-block-heading">
              <span>📋 Ordered Milestones (Only 1–2 Active Strikes in Things 3)</span>
            </div>

            <!-- Phase 1 -->
            <div class="school-step-card is-done">
              <span class="step-card-status-badge status-badge-done">Phase 1 &bull; Done</span>
              <div class="step-card-content">
                <h5 class="step-card-title">Out-of-District (OOD) Placement Agreement</h5>
                <p class="step-card-desc">Formal consensus secured with school district that an out-of-district specialized placement is necessary and funded.</p>
              </div>
            </div>

            <!-- Phase 2 (Active) -->
            <div class="school-step-card is-active">
              <span class="step-card-status-badge status-badge-active">Phase 2 &bull; Active</span>
              <div class="step-card-content">
                <h5 class="step-card-title">School Selection &amp; Admissions Tours (Current Focus)</h5>
                <p class="step-card-desc">Tour approved candidate schools (e.g. Windsor School), conduct intake interviews, and secure placement seat.</p>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px;">
                  <span class="step-things-strike" onclick="copyThingsStrike('📞 Call Windsor admissions re: tour')" title="Copy to Things 3">
                    ⚡ Things 3: 📞 Call Windsor admissions re: tour
                  </span>
                  <span class="step-things-strike" onclick="copyThingsStrike('📅 Confirm tour date with admissions team')" title="Copy to Things 3">
                    ⚡ Things 3: 📅 Confirm tour date
                  </span>
                </div>
              </div>
            </div>

            <!-- Phase 3 -->
            <div class="school-step-card">
              <span class="step-card-status-badge status-badge-next">Phase 3 &bull; Up Next</span>
              <div class="step-card-content">
                <h5 class="step-card-title">Transfer Execution &amp; IEP Accommodation Transition</h5>
                <p class="step-card-desc">Coordinate district transportation routes, transfer specialist service hours (OT/Speech), and schedule student transition day.</p>
              </div>
            </div>

            <!-- Phase 4 (Parallel Track) -->
            <div class="school-step-card is-active" style="border-left: 3px solid #C26344;">
              <span class="step-card-status-badge status-badge-active" style="background: #2D5A3C;">Phase 4 &bull; Parallel</span>
              <div class="step-card-content">
                <h5 class="step-card-title">District Accountability &amp; Police Incident Documentation</h5>
                <p class="step-card-desc">Hold district accountable for non-compliance timeline and document the police incident with precision.</p>
                <div style="margin-top: 6px;">
                  <span class="step-things-strike" onclick="copyThingsStrike('📄 Request copy of police incident report from precinct')" title="Copy to Things 3">
                    ⚡ Things 3: 📄 Request police incident report from precinct
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Where Everything Lives (Tool-by-Tool Guide) -->
          <div class="school-steps-block">
            <div class="school-block-heading">
              <span>🗂️ What Lives Where (Zero Duplicate Clutter)</span>
            </div>
            <div class="school-tools-map-grid">
              <div class="tool-map-box">
                <div class="tool-map-box-title" style="display: flex; align-items: center; gap: 6px;">
                  <span class="tool-symbol symbol-m" style="font-family:'Newsreader',Georgia,serif; font-style:italic; font-weight:700; color:#7C3AED; font-size:0.95rem; line-height:1;">m</span>
                  <span>margo</span>
                </div>
                <div class="tool-map-box-desc">Cover Page Radar (10,000-ft phase horizon) + Z Hub Behavior Log (Daily PDF report attachments).</div>
              </div>
              <div class="tool-map-box">
                <div class="tool-map-box-title" style="display: flex; align-items: center; gap: 6px;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tool-apple-svg" style="width:13px; height:13px;"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>
                  <span>Apple Notes</span>
                </div>
                <div class="tool-map-box-desc"><strong># SCHOOL 01_BATTLE PLAN</strong>: School profiles, live impressions, tour observations, incident notes.</div>
              </div>
              <div class="tool-map-box">
                <div class="tool-map-box-title" style="display: flex; align-items: center; gap: 6px;">
                  <span class="tool-symbol symbol-google" style="font-weight:800; color:#1D4ED8; font-size:0.76rem; line-height:1;">G</span>
                  <span>Google Drive</span>
                </div>
                <div class="tool-map-box-desc"><strong>📁 Z Records</strong>: Static evidence, signed IEP PDFs, neuropsych evaluations, police report PDFs, PWNs.</div>
              </div>
              <div class="tool-map-box">
                <div class="tool-map-box-title" style="display: flex; align-items: center; gap: 6px;">
                  <span class="tool-symbol symbol-things" style="font-weight:800; color:#0284C7; font-size:0.68rem; letter-spacing:-0.04em; line-height:1;">T3</span>
                  <span>Things 3 &amp;</span>
                  <i data-lucide="mail" style="width:12px; height:12px; color:#E11D48;"></i>
                  <span>Gmail</span>
                </div>
                <div class="tool-map-box-desc"><strong>Things 3</strong>: Next 1–2 physical strikes only.<br><strong>Gmail</strong>: Label <code>OOD-Placement</code> for all school correspondence.</div>
              </div>
            </div>
          </div>
        </div>

        <div class="school-modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" onclick="copySchoolBattlePlanTemplate()" title="Copy Markdown template for Apple Notes">
            📋 Copy Apple Notes Battle Plan Template
          </button>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="jumpToZHubDailyLogs()">🌱 Z Hub Logs</button>
            <button type="button" class="btn btn-primary btn-sm" onclick="closeAllModals()">Done</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  openModal('modal-school-battleplan');
  if (window.lucide) lucide.createIcons();
}
window.openSchoolBattlePlanModal = openSchoolBattlePlanModal;

function openCompassDiagramModal() {
  let modal = document.getElementById('modal-compass-diagram');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-compass-diagram';
    modal.className = 'modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) closeAllModals(); };
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-card modal-card-wide" style="max-width: 820px; padding: 18px 20px;">
      <div class="modal-header" style="margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.2rem;">🧭</span>
          <h3>System Compass Architecture</h3>
        </div>
        <button class="icon-btn" onclick="closeAllModals()" aria-label="Close"><i data-lucide="x"></i></button>
      </div>
      <div style="border-radius: 18px; overflow: hidden; border: 1px solid var(--line); background: #FFFFFF; box-shadow: 0 4px 16px rgba(0,0,0,0.06); margin-bottom: 14px;">
        <img src="assets/system-compass-architecture.svg?v=9.0.8" alt="System Compass Architecture Graphic" style="width: 100%; height: auto; display: block;">
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <a href="system-compass-graphic.html" target="_blank" class="btn btn-secondary btn-sm" style="text-decoration: none;">↗ Open Full Viewer</a>
        <button type="button" class="btn btn-primary btn-sm" onclick="closeAllModals()">Done</button>
      </div>
    </div>
  `;
  if (typeof openModal === 'function') {
    openModal('modal-compass-diagram');
  } else {
    modal.classList.add('active');
  }
  if (window.lucide) lucide.createIcons();
}
window.openCompassDiagramModal = openCompassDiagramModal;

function toggleWorkflowPanelWidth(e) {
  if (e) e.stopPropagation();
  let currentWide = false;
  try {
    currentWide = localStorage.getItem('BOL_COMPASS_WF_WIDE') === 'true';
  } catch (err) {}
  const nextWide = !currentWide;
  try {
    localStorage.setItem('BOL_COMPASS_WF_WIDE', String(nextWide));
  } catch (err) {}
  const panel = document.getElementById('section-architecture-blueprint');
  if (panel) {
    panel.classList.toggle('is-wide', nextWide);
    const label = document.getElementById('wf-expand-text');
    if (label) label.textContent = nextWide ? '⇤ Sidebar' : '⤢ Wide';
  }
}
window.toggleWorkflowPanelWidth = toggleWorkflowPanelWidth;




