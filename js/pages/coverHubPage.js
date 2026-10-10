/* ==========================================================================
   Book of Life / Life OS - Cover Page (Executive Index & System Compass)
   Operating Philosophy: [simple] → [visible] → [next step] → [done]
   ========================================================================== */

let editingTopicAuditId = null;

function renderCoverHubPage() {
  currentView = 'cover';
  try {
    localStorage.setItem('BOL_ACTIVE_VIEW', 'cover');
    if (window.location.hash !== '#cover') {
      window.location.hash = 'cover';
    }
  } catch (e) {}

  const dateNavContainer = document.getElementById('header-date-nav-container');
  const energyDial = document.getElementById('header-energy-dial');
  const bunkerBtn = document.getElementById('btn-bunker-portal');
  const coverTab = document.getElementById('nav-btn-cover');
  const todayTab = document.getElementById('nav-btn-today');

  if (coverTab) coverTab.classList.add('active');
  if (todayTab) todayTab.classList.remove('active');
  if (dateNavContainer) dateNavContainer.style.display = 'none';
  if (energyDial) energyDial.style.display = 'none';
  if (bunkerBtn) bunkerBtn.classList.remove('active');

  const container = document.getElementById('daily-sheet-container');
  if (!container) return;

  const campaignsData = (typeof storage !== 'undefined' && typeof storage.getCoverCampaigns === 'function')
    ? storage.getCoverCampaigns()
    : { now: [], later: [] };

  const topicAudits = (typeof storage !== 'undefined' && typeof storage.getCoverTopicAudits === 'function')
    ? storage.getCoverTopicAudits()
    : [];

  const habits = (typeof storage !== 'undefined' && typeof storage.getHabits === 'function')
    ? storage.getHabits()
    : [];

  container.innerHTML = `
    <div class="cover-hub-container">
      
      <!-- 1. Operating Mantra Strip (Direct from Screenshot) -->
      <div class="cover-mantra-strip">
        <div class="mantra-pill mantra-simple" title="Simple: Zero duplicate tracking or cognitive bloat">
          <span>simple</span>
        </div>
        <div class="mantra-pill mantra-visible" title="Visible: If it isn't front-and-center, it doesn't happen">
          <span>visible</span>
        </div>
        <div class="mantra-pill mantra-next" title="Next step: Every area has exactly one obvious immediate move">
          <span>next step</span>
        </div>
        <div class="mantra-pill mantra-done" title="Done: Frictionless 1-tap completion without guilt">
          <span>done</span>
        </div>
      </div>

      <!-- Quick Action / Transition to Today Banner -->
      <div class="cover-welcome-banner">
        <div class="welcome-banner-left">
          <div class="welcome-banner-greeting">
            <span class="greeting-symbol">🌿</span>
            <div>
              <h2 class="welcome-title">The Sanctuary Index</h2>
              <span class="welcome-subtitle">Quiet headspace, what's on deck, and where everything lives</span>
            </div>
          </div>
        </div>
        <button type="button" class="btn-jump-today" onclick="switchAppView('sanctuary')" title="Jump into today's sanctuary">
          <span>Today's Sanctuary</span>
          <span class="jump-arrow">☀️ &rarr;</span>
        </button>
      </div>

      <!-- 2. What Tools for What Work (Tool Architecture Blueprint) -->
      <div class="cover-card blueprint-map-card" id="section-architecture-blueprint">
        <div class="blueprint-card-header">
          <div class="blueprint-title-row">
            <span class="blueprint-icon">🧭</span>
            <h3 class="blueprint-title">What Tools for What Work</h3>
          </div>
          <span class="blueprint-badge">Tool Architecture</span>
        </div>

        <!-- 5-Tool Architecture Grid -->
        <div class="tools-work-grid-5">
          
          <!-- margo -->
          <div class="tool-work-card tool-card-margo">
            <div class="tool-work-header">
              <span class="tool-work-symbol">🌿</span>
              <h4 class="tool-work-name">margo</h4>
            </div>
            <span class="tool-work-badge badge-margo">Central command + analytics</span>
            <p class="tool-work-desc">
              10,000-ft executive radar, habit momentum, waiting-on horizon, and 1-tap launchers.
            </p>
          </div>

          <!-- Apple Notes -->
          <div class="tool-work-card tool-card-notes">
            <div class="tool-work-header">
              <span class="tool-work-symbol">📝</span>
              <h4 class="tool-work-name">Apple Notes</h4>
            </div>
            <span class="tool-work-badge badge-notes">Master notes + Master tasks</span>
            <p class="tool-work-desc">
              Deep working notes, strategy synthesis, project roadmaps, and complete master task lists.
            </p>
          </div>

          <!-- Google Drive -->
          <div class="tool-work-card tool-card-drive">
            <div class="tool-work-header">
              <span class="tool-work-symbol">📁</span>
              <h4 class="tool-work-name">Google Drive</h4>
            </div>
            <span class="tool-work-badge badge-drive">Digital files</span>
            <p class="tool-work-desc">
              Permanent digital file vault: signed PDFs, official records, evaluations, and spreadsheets.
            </p>
          </div>

          <!-- Things 3 -->
          <div class="tool-work-card tool-card-things">
            <div class="tool-work-header">
              <span class="tool-work-symbol">⚡</span>
              <h4 class="tool-work-name">Things 3</h4>
            </div>
            <span class="tool-work-badge badge-things">Immediate to do</span>
            <p class="tool-work-desc">
              The execution trigger chamber &mdash; only the next 1–2 physical strikes sitting in Today. Zero task bloat.
            </p>
          </div>

          <!-- Gmail -->
          <div class="tool-work-card tool-card-gmail">
            <div class="tool-work-header">
              <span class="tool-work-symbol">✉️</span>
              <h4 class="tool-work-name">Gmail</h4>
            </div>
            <span class="tool-work-badge badge-gmail">Email comms</span>
            <p class="tool-work-desc">
              Inbound and outbound communications, dedicated domain labels, zero inbox clutter.
            </p>
          </div>

        </div>

      </div>

      <!-- 3. Unified Life Architecture & Focus Board: Now vs. Later (Clean White & Shadow Card) -->
      <div class="active-campaigns-section" id="section-active-campaigns">
        <!-- Hero Header -->
        <div class="campaigns-hero-heading">
          <h2 class="campaigns-hero-title">Life Architecture &amp; Focus Board</h2>
          <span class="campaigns-hero-sub">Executive 10,000-ft visibility &bull; Actions live strictly in Apple Notes &amp; Things 3 &bull; Zero clutter</span>
        </div>

        <!-- Single Elevated White Card Container -->
        <div class="campaigns-white-card unified-board-card">
          <div class="unified-board-header">
            <div class="white-card-brand">margo</div>
            <div class="unified-board-counts">
              <span class="board-count-pill count-now">📌 ${campaignsData.now.length} Active (Now)</span>
              <span class="board-count-pill count-later">⏳ ${campaignsData.later.length} On Deck (Later)</span>
            </div>
          </div>

          <!-- ================= SECTION 1: NOW ================= -->
          <div class="focus-tier-block tier-now-block">
            <div class="focus-tier-header">
              <div class="tier-title-group">
                <span class="focus-tier-badge tier-badge-now">📌 NOW</span>
                <h3 class="focus-tier-heading">Active Focus</h3>
                <span class="focus-tier-sub">In flight &bull; Ball in court or actively tracked</span>
              </div>
              <button type="button" class="btn-tier-add" onclick="promptAddCampaignItem('now')" title="Add item to Active Focus">+ Add Focus</button>
            </div>

            <div class="focus-bento-grid">
              ${campaignsData.now.map(camp => renderUnifiedCampaignCard(camp, 'now')).join('')}
              ${campaignsData.now.length === 0 ? `
                <div class="tier-empty-state">
                  <span>Nothing currently active. Enjoy the mental headspace!</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Divider -->
          <div class="focus-tier-divider"></div>

          <!-- ================= SECTION 2: LATER ================= -->
          <div class="focus-tier-block tier-later-block">
            <div class="focus-tier-header">
              <div class="tier-title-group">
                <span class="focus-tier-badge tier-badge-later">⏳ LATER</span>
                <h3 class="focus-tier-heading">On Deck &amp; Parking Lot</h3>
                <span class="focus-tier-sub">Parked initiatives &bull; Next in queue once bandwidth opens</span>
              </div>
              <button type="button" class="btn-tier-add" onclick="promptAddCampaignItem('later')" title="Add item to Parking Lot">+ Add to Later</button>
            </div>

            <div class="directory-later-grid">
              ${campaignsData.later.map(camp => renderUnifiedCampaignCard(camp, 'later')).join('')}
              ${campaignsData.later.length === 0 ? `
                <div class="tier-empty-state">
                  <span>No parked items. Add initiatives you want to explore later!</span>
                </div>
              ` : ''}
            </div>
          </div>

        </div>
        </div>
      </div>

      <!-- 4. MARGO Framework (5 Pillars) - Relocated permanently to Cover Page -->
      <div class="cover-card margo-framework-shelf" id="section-framework-shelf">
        ${typeof renderMargoFrameworkWidget === 'function' ? renderMargoFrameworkWidget() : ''}
      </div>

      <!-- 5. Habit Presets Repository - Relocated permanently to Cover Page -->
      <div class="cover-card habit-presets-shelf" id="section-presets-shelf">
        <div class="card-title-row">
          <div class="title-with-desc">
            <h3>
              <i data-lucide="sparkles" style="color: #3D5A45; width: 17px; height: 17px;"></i>
              Habit Presets Repository
            </h3>
            <span class="card-sub-muted">Tap any preset to instantly add it to your daily tracking stack</span>
          </div>
        </div>

        <div class="presets-shelf-pills">
          ${RECOMMENDED_HABIT_PRESETS.map((preset, pIdx) => {
            const pName = preset.name.toLowerCase().trim();
            const isAnchor = (pName === 'stand ring' || pName === 'stand' || pName === 'move');
            const isAlreadyAdded = isAnchor || habits.some(h => 
              h && h.name.toLowerCase().trim() === pName
            );
            if (isAlreadyAdded) {
              const tooltip = isAnchor 
                ? (pName === 'move' ? 'Move is your Hero Anchor #1' : 'Stand is your Hero Anchor #2') 
                : `${escapeHtml(preset.name)} is already active in your daily stack`;
              return `
                <span class="preset-pill-item added" title="${tooltip}">
                  <span class="preset-pill-symbol">✓</span>
                  <span class="preset-pill-label">${escapeHtml(preset.name)}</span>
                </span>
              `;
            } else {
              return `
                <button type="button" class="preset-pill-item" onclick="addHabitFromPresetCover(${pIdx})" title="Add ${escapeHtml(preset.name)}: ${escapeHtml(preset.description)}">
                  <span class="preset-pill-symbol plus">+</span>
                  <span class="preset-pill-label">${escapeHtml(preset.name)}</span>
                </button>
              `;
            }
          }).join('')}
        </div>
      </div>

    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}
window.renderCoverHubPage = renderCoverHubPage;

/* --------------------------------------------------------------------------
   Unified Life Architecture Card Renderer & Handlers
   -------------------------------------------------------------------------- */
function getDomainThemeClass(camp) {
  const t = (camp.title || camp.id || '').toLowerCase();
  // Color 1 - Z school ....
  if (t.includes('school') || t.includes('iep') || t.includes('ood') || t.includes('windsor')) {
    return 'theme-cat-school';
  }
  // Color 3 - oon reimbursement, personal finance
  if (t.includes('oon') || t.includes('reimb') || t.includes('claim') || t.includes('finan') || t.includes('money') || t.includes('tax') || t.includes('budget') || t.includes('superbill')) {
    return 'theme-cat-finance';
  }
  // Color 4 - Surgery & Health (Cerulean / Azure Blue)
  if (t.includes('surgery') || t.includes('health') || t.includes('doctor') || t.includes('clinic')) {
    return 'theme-cat-health';
  }
  // Home declutter
  if (t.includes('home') || t.includes('declutter') || t.includes('room') || t.includes('closet')) {
    return 'theme-cat-home';
  }
  // Food
  if (t.includes('food') || t.includes('nutri') || t.includes('meal') || t.includes('diet') || t.includes('cook')) {
    return 'theme-cat-food';
  }
  // Color 2 - Haircare, skin, foot, makeup, outfits, jewelry, under eye... (Personal Care & Aesthetics)
  return 'theme-cat-care';
}
window.getDomainThemeClass = getDomainThemeClass;

function getCampaignCategoryMeta(camp) {
  const t = (camp.title || camp.id || '').toLowerCase();
  if (t.includes('school') || t.includes('iep') || t.includes('ood') || t.includes('windsor')) {
    return { tag: 'ED', name: 'School & IEP', theme: 'theme-cat-school', dotColor: '#7C3AED' };
  }
  if (t.includes('surgery') || t.includes('health') || t.includes('doctor') || t.includes('clinic')) {
    return { tag: 'HEALTH', name: 'Health & Surgery', theme: 'theme-cat-health', dotColor: '#0284C7' };
  }
  if (t.includes('hair')) {
    return { tag: 'CARE', name: 'Haircare', theme: 'theme-cat-care', dotColor: '#E11D48' };
  }
  if (t.includes('oon') || t.includes('reimb') || t.includes('claim') || t.includes('superbill')) {
    return { tag: 'FIN', name: 'Reimbursements', theme: 'theme-cat-finance', dotColor: '#059669' };
  }
  if (t.includes('finan') || t.includes('money') || t.includes('tax') || t.includes('budget')) {
    return { tag: 'FIN', name: 'Personal Finance', theme: 'theme-cat-finance', dotColor: '#059669' };
  }
  if (t.includes('home') || t.includes('declutter') || t.includes('room') || t.includes('closet')) {
    return { tag: 'HOME', name: 'Home Declutter', theme: 'theme-cat-home', dotColor: '#0D9488' };
  }
  if (t.includes('food') || t.includes('nutri') || t.includes('meal') || t.includes('diet') || t.includes('cook')) {
    return { tag: 'FOOD', name: 'Nutrition', theme: 'theme-cat-food', dotColor: '#65A30D' };
  }
  return { tag: 'CARE', name: 'Aesthetics', theme: 'theme-cat-care', dotColor: '#E11D48' };
}
window.getCampaignCategoryMeta = getCampaignCategoryMeta;

function resolveCampaignTools(camp) {
  const tools = camp.tools || {};
  const isArr = Array.isArray(tools);
  const findInArr = (fn) => isArr ? tools.find(fn) : null;
  const campTitle = camp.title || '';

  // 1. Margo tool
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

  // 2. Apple Notes tool
  let noteQuery = `# ${campTitle.toUpperCase().replace(/[^A-Z0-9_ ]/g, '')}`;
  if (!isArr && tools.apple && tools.apple.noteQuery) {
    noteQuery = tools.apple.noteQuery;
  } else if (isArr) {
    const a = findInArr(t => t.noteQuery || String(t.label || t).toLowerCase().includes('note'));
    if (a && a.noteQuery) noteQuery = a.noteQuery;
  }

  // 3. Google Drive tool
  let driveFolder = campTitle;
  if (!isArr && tools.google && tools.google.folder) {
    driveFolder = tools.google.folder;
  } else if (isArr) {
    const g = findInArr(t => t.folder || String(t.label || t).toLowerCase().includes('drive'));
    if (g && g.folder) driveFolder = g.folder;
  }

  // 4. Things 3 tool
  let thingsQuery = campTitle;
  if (!isArr && tools.things && tools.things.query) {
    thingsQuery = tools.things.query;
  } else if (isArr) {
    const t = findInArr(t => t.query || String(t.label || t).toLowerCase().includes('things'));
    if (t && t.query) thingsQuery = t.query;
  }

  // 5. Gmail tool
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
  const oppositeTier = isNow ? 'later' : 'now';
  const shiftBtnLabel = isNow ? '&rarr; Later' : '&larr; Now';

  const isHaircare = (camp.id === 'camp-haircare' || (camp.title || '').toLowerCase().trim() === 'haircare');
  const isSurgery = (camp.id === 'camp-surgery' || (camp.title || '').toLowerCase().trim() === 'surgery');
  const isOon = (camp.id === 'camp-oon' || (camp.title || '').toLowerCase().includes('oon') || (camp.title || '').toLowerCase().includes('reimburse'));
  const catMeta = getCampaignCategoryMeta(camp);
  const themeClass = catMeta.theme;

  // Normalize status: IP, NS, Maintain, Done
  let statusKey = String(camp.status || (isHaircare ? 'Maintain' : (isNow ? 'IP' : 'NS'))).trim();
  if (isHaircare && (!camp.status || camp.status === 'IP')) statusKey = 'Maintain';
  else if (statusKey === 'strike' || statusKey.toLowerCase() === 'ip' || statusKey === 'active') statusKey = 'IP';
  else if (statusKey === 'ondeck' || statusKey === 'waiting' || statusKey.toLowerCase() === 'ns') statusKey = 'NS';
  else if (statusKey === 'review' || statusKey.toLowerCase() === 'maintain') statusKey = 'Maintain';
  else if (statusKey.toLowerCase() === 'done') statusKey = 'Done';
  else if (!['IP', 'NS', 'Maintain', 'Done'].includes(statusKey)) statusKey = isNow ? 'IP' : 'NS';

  let statusBadgeHtml = '';
  if (statusKey === 'IP') {
    statusBadgeHtml = `<button type="button" class="sample-phase-pill pill-status-ip" onclick="cycleCampaignStatus('${camp.id}', event)" title="Status: IP (In Progress) &bull; Tap to change">IP</button>`;
  } else if (statusKey === 'NS') {
    statusBadgeHtml = `<button type="button" class="sample-phase-pill pill-status-ns" onclick="cycleCampaignStatus('${camp.id}', event)" title="Status: NS (Not Started) &bull; Tap to change">NS</button>`;
  } else if (statusKey === 'Maintain') {
    statusBadgeHtml = `<button type="button" class="sample-phase-pill pill-status-maintain" onclick="cycleCampaignStatus('${camp.id}', event)" title="Status: Maintain &bull; Tap to change">Maintain</button>`;
  } else if (statusKey === 'Done') {
    statusBadgeHtml = `<button type="button" class="sample-phase-pill pill-status-done" onclick="cycleCampaignStatus('${camp.id}', event)" title="Status: Done &bull; Tap to change">Done</button>`;
  }

  // Resolve tool launchers: m, 🍎, G, T3, email
  const { margoAction, margoLabel, noteQuery, driveFolder, thingsQuery, emailQuery } = resolveCampaignTools(camp);

  let showMargo = true;
  let showApple = true;
  let showGoogle = true;
  let showThings = true;
  let showEmail = true;

  if (Array.isArray(camp.visibleTools)) {
    showMargo = camp.visibleTools.includes('margo') || camp.visibleTools.includes('m');
    showApple = camp.visibleTools.includes('apple');
    showGoogle = camp.visibleTools.includes('google') || camp.visibleTools.includes('g');
    showThings = camp.visibleTools.includes('things') || camp.visibleTools.includes('things3') || camp.visibleTools.includes('t3');
    showEmail = camp.visibleTools.includes('email') || camp.visibleTools.includes('gmail');
  } else if (camp.tools && typeof camp.tools === 'object' && !Array.isArray(camp.tools)) {
    showMargo = camp.tools.margo !== undefined ? Boolean(camp.tools.margo) : true;
    showApple = camp.tools.apple !== undefined ? Boolean(camp.tools.apple) : true;
    showGoogle = camp.tools.google !== undefined ? Boolean(camp.tools.google) : true;
    showThings = camp.tools.things !== undefined ? Boolean(camp.tools.things) : true;
    showEmail = camp.tools.email !== undefined ? Boolean(camp.tools.email) : true;
  }

  // Haircare is explicitly only m and apple icon
  if (isHaircare) {
    showMargo = true;
    showApple = true;
    showGoogle = false;
    showThings = false;
    showEmail = false;
  }

  // Surgery is explicitly only apple and things3 icons
  if (isSurgery) {
    showMargo = false;
    showApple = true;
    showGoogle = false;
    showThings = true;
    showEmail = false;
  }

  // oon reimbursement is explicitly margo, Google Drive, T3, Gmail
  if (isOon) {
    showMargo = true;
    showApple = false;
    showGoogle = true;
    showThings = true;
    showEmail = true;
  }

  const toolButtons = [];
  if (showMargo) {
    toolButtons.push(`
      <button type="button" class="dock-tool-btn tool-badge-m" onclick="handleMargoToolClick('${camp.id}', '${margoAction}', '${escapeHtml((camp.title || '').replace(/'/g, "\\'"))}')" title="margo: ${escapeHtml(margoLabel)}">
        <span class="tool-symbol symbol-m">m</span>
      </button>
    `);
  }
  if (showApple) {
    toolButtons.push(`
      <button type="button" class="dock-tool-btn tool-badge-apple" onclick="copyAppleNoteLauncher('${escapeHtml(noteQuery.replace(/'/g, "\\'"))}')" title="Apple Notes: ${escapeHtml(noteQuery)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tool-apple-svg"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>
      </button>
    `);
  }
  if (showGoogle) {
    toolButtons.push(`
      <button type="button" class="dock-tool-btn tool-badge-google" onclick="openDriveFolder('${escapeHtml(driveFolder.replace(/'/g, "\\'"))}')" title="Google Drive: ${escapeHtml(driveFolder)}">
        <span class="tool-symbol symbol-google">G</span>
      </button>
    `);
  }
  if (showThings) {
    toolButtons.push(`
      <button type="button" class="dock-tool-btn tool-badge-things" onclick="openThings3Query('${escapeHtml(thingsQuery.replace(/'/g, "\\'"))}')" title="Things 3: ${escapeHtml(thingsQuery)}">
        <span class="tool-symbol symbol-things">T3</span>
      </button>
    `);
  }
  if (showEmail) {
    toolButtons.push(`
      <button type="button" class="dock-tool-btn tool-badge-email" onclick="openGmailLabel('${escapeHtml(emailQuery.replace(/'/g, "\\'"))}')" title="Gmail: ${escapeHtml(emailQuery)}">
        <i data-lucide="mail"></i>
      </button>
    `);
  }
  const dockHtml = toolButtons.join('<span class="dock-divider"></span>');

  if (isNow) {
    return `
      <div class="bento-campaign-card tier-now ${themeClass}">
        <div class="bento-card-top">
          <div class="bento-title-group">
            <span class="bento-cat-tag">${catMeta.tag}</span>
            <h4 class="bento-domain-title" onclick="promptEditCampaignTitle('${camp.id}', '${escapeHtml((camp.title || '').replace(/'/g, "\\'"))}')" title="Click to edit title">${escapeHtml(camp.title || '')}</h4>
          </div>
          <div class="card-status-wrapper">
            ${statusBadgeHtml}
          </div>
        </div>

        <div class="bento-card-bottom">
          <div class="bento-capsule-dock">
            ${dockHtml}
          </div>
          <div class="bento-bottom-actions">
            <button type="button" class="btn-tier-shift shift-tier-now" onclick="moveCampaignAction('${camp.id}', 'now', 'later')" title="Move to Later">
              &rarr; Later
            </button>
            <button type="button" class="btn-camp-delete" onclick="deleteCampaignAction('${camp.id}', 'now')" title="Delete domain">
              <i data-lucide="x" style="width: 11px; height: 11px;"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Later: Option 1 High-Density Directory Item
  return `
    <div class="directory-campaign-item tier-later ${themeClass}">
      <div class="dir-item-left">
        <span class="dir-cat-dot" style="background-color: ${catMeta.dotColor};"></span>
        <h4 class="dir-domain-title" onclick="promptEditCampaignTitle('${camp.id}', '${escapeHtml((camp.title || '').replace(/'/g, "\\'"))}')" title="Click to edit title">${escapeHtml(camp.title || '')}</h4>
      </div>
      <div class="dir-item-right">
        <div class="dir-status-wrap">
          ${statusBadgeHtml}
        </div>
        <div class="dir-actions">
          <button type="button" class="btn-tier-shift shift-tier-later" onclick="moveCampaignAction('${camp.id}', 'later', 'now')" title="Move to Now">
            &larr; Now
          </button>
          <button type="button" class="btn-camp-delete" onclick="deleteCampaignAction('${camp.id}', 'later')" title="Delete domain">
            <i data-lucide="x" style="width: 11px; height: 11px;"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}
window.renderUnifiedCampaignCard = renderUnifiedCampaignCard;

function cycleCampaignStatus(campId, event) {
  if (event) event.stopPropagation();
  if (typeof storage === 'undefined') return;
  const campaigns = storage.getCoverCampaigns();
  let camp = campaigns.now.find(x => x.id === campId) || campaigns.later.find(x => x.id === campId);
  if (!camp) return;

  const cycleOrder = ['IP', 'NS', 'Maintain', 'Done'];
  let currentKey = camp.status || 'IP';
  if (currentKey === 'strike' || currentKey === 'active') currentKey = 'IP';
  else if (currentKey === 'ondeck' || currentKey === 'waiting') currentKey = 'NS';
  else if (currentKey === 'review') currentKey = 'Maintain';

  const currentIdx = cycleOrder.indexOf(currentKey);
  const nextStatus = cycleOrder[(currentIdx + 1) % cycleOrder.length];
  storage.updateCoverCampaignStatus(campId, nextStatus);
  renderCoverHubPage();
  if (typeof showToast === 'function') {
    const labels = {
      IP: '⚡ IP (In Progress)',
      NS: '⏳ NS (Not Started)',
      Maintain: '🌿 Maintain',
      Done: '✅ Done'
    };
    showToast(`Status: ${labels[nextStatus] || nextStatus}`);
  }
}
window.cycleCampaignStatus = cycleCampaignStatus;

function moveCampaignAction(campId, fromTier, toTier) {
  if (typeof storage !== 'undefined') {
    storage.moveCoverCampaign(campId, fromTier, toTier);
    renderCoverHubPage();
    if (typeof showToast === 'function') {
      showToast(`Moved to ${toTier === 'now' ? 'Active Focus (Now)' : 'Parking Lot (Later)'}`);
    }
  }
}
window.moveCampaignAction = moveCampaignAction;

function deleteCampaignAction(campId, tier) {
  if (typeof storage !== 'undefined') {
    storage.deleteCoverCampaign(campId, tier);
    renderCoverHubPage();
    if (typeof showToast === 'function') {
      showToast('Removed domain from board');
    }
  }
}
window.deleteCampaignAction = deleteCampaignAction;

function promptAddCampaignItem(tier) {
  const title = prompt(`Add new ${tier === 'now' ? 'Active Focus (Now)' : 'Parking Lot (Later)'} domain:`);
  if (title && title.trim().length > 0 && typeof storage !== 'undefined') {
    storage.addCoverCampaign(tier, {
      title: title.trim(),
      status: tier === 'now' ? 'IP' : 'NS',
      tools: [
        { label: 'Apple Note', noteQuery: title.trim() }
      ]
    });
    renderCoverHubPage();
    if (typeof showToast === 'function') {
      showToast(`Added to ${tier === 'now' ? 'Active Focus' : 'Parking Lot'}`);
    }
  }
}
window.promptAddCampaignItem = promptAddCampaignItem;

function promptEditCampaignTitle(campId, currentTitle) {
  const newTitle = prompt('Edit domain title:', currentTitle);
  if (newTitle && newTitle.trim().length > 0 && typeof storage !== 'undefined') {
    const campaigns = storage.getCoverCampaigns();
    let camp = campaigns.now.find(x => x.id === campId) || campaigns.later.find(x => x.id === campId);
    if (camp) {
      camp.title = newTitle.trim();
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
            <option value="in_progress" ${statusVal === 'in_progress' ? 'selected' : ''}>🟡 In Progress (Untangling &amp; organizing)</option>
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
  if (pName === 'stand ring' || pName === 'stand' || pName === 'move') {
    if (typeof showToast === 'function') showToast(`${preset.name} is already your Hero Anchor!`);
    return;
  }

  storage.addHabit(preset);
  if (typeof showToast === 'function') showToast(`Added "${preset.name}" to your daily stack!`);
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
      showToast('☀️ Jumped to Sanctuary for Haircare Checkpoint');
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

## 🎯 CURRENT STATUS
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

### Phase 2: School Selection & Admissions [ACTIVE 🎯]
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
                <div class="tool-map-box-title">🌿 margo</div>
                <div class="tool-map-box-desc">Cover Page Radar (10,000-ft phase horizon) + Z Hub Behavior Log (Daily PDF report attachments).</div>
              </div>
              <div class="tool-map-box">
                <div class="tool-map-box-title">📝 Apple Notes</div>
                <div class="tool-map-box-desc"><strong># SCHOOL 01_BATTLE PLAN</strong>: School profiles, live impressions, tour observations, incident notes.</div>
              </div>
              <div class="tool-map-box">
                <div class="tool-map-box-title">📁 Google Drive</div>
                <div class="tool-map-box-desc"><strong>📁 Z Records</strong>: Static evidence, signed IEP PDFs, neuropsych evaluations, police report PDFs, PWNs.</div>
              </div>
              <div class="tool-map-box">
                <div class="tool-map-box-title">⚡ Things 3 &amp; ✉️ Gmail</div>
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


