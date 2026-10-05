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

  const topMind = (typeof storage !== 'undefined' && typeof storage.getCoverTopMind === 'function')
    ? storage.getCoverTopMind()
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

      <!-- 2. Top of Mind: "Now vs. Later" Scratchpad -->
      <div class="cover-card top-mind-card" id="section-top-mind">
        <div class="card-title-row">
          <div class="title-with-desc">
            <h3>
              <i data-lucide="pin" style="color: #3D5A45; width: 17px; height: 17px;"></i>
              Top of Mind Scratchpad
            </h3>
            <span class="card-sub-muted">Low-friction mental capture &bull; Split into Active Focus vs. Parking Lot</span>
          </div>
        </div>

        <div class="top-mind-pads-grid">
          
          <!-- PAD 1: NOW (Active Focus) -->
          <div class="top-mind-pad pad-now">
            <div class="pad-header">
              <div class="pad-title-group">
                <span class="pad-badge badge-now">📌 NOW</span>
                <span class="pad-subtitle">Active Focus (Max 3–5 items)</span>
              </div>
              <span class="pad-count-pill">${topMind.now.length}</span>
            </div>

            <!-- Inline Add Form -->
            <form class="pad-add-form" onsubmit="submitAddTopMind(event, 'now')">
              <input type="text" id="input-top-mind-now" class="pad-input" placeholder="+ Add something holding mental space..." required autocomplete="off" />
              <button type="submit" class="pad-add-btn">+ Add</button>
            </form>

            <!-- Items List -->
            <div class="pad-items-list">
              ${topMind.now.map(item => `
                <div class="pad-item" id="item-${item.id}">
                  <span class="pad-item-bullet">&bull;</span>
                  <div class="pad-item-text" onclick="promptEditTopMind('${item.id}', 'now', '${escapeHtml(item.text.replace(/'/g, "\\'"))}')" title="Click to edit">
                    ${escapeHtml(item.text)}
                  </div>
                  <div class="pad-item-actions">
                    <button type="button" class="pad-shift-btn" onclick="moveTopMindAction('${item.id}', 'now', 'later')" title="Move to Later (Parking Lot)">
                      <span>Later &rarr;</span>
                    </button>
                    <button type="button" class="pad-delete-btn" onclick="deleteTopMindAction('${item.id}', 'now')" title="Delete item">
                      <i data-lucide="x" style="width: 13px; height: 13px;"></i>
                    </button>
                  </div>
                </div>
              `).join('')}

              ${topMind.now.length === 0 ? `
                <div class="pad-empty-state">
                  <span>Nothing on your immediate plate. Enjoy the headspace!</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- PAD 2: LATER (On Deck / Parking Lot) -->
          <div class="top-mind-pad pad-later">
            <div class="pad-header">
              <div class="pad-title-group">
                <span class="pad-badge badge-later">⏳ LATER</span>
                <span class="pad-subtitle">On Deck &amp; Parking Lot</span>
              </div>
              <span class="pad-count-pill">${topMind.later.length}</span>
            </div>

            <!-- Inline Add Form -->
            <form class="pad-add-form" onsubmit="submitAddTopMind(event, 'later')">
              <input type="text" id="input-top-mind-later" class="pad-input" placeholder="+ Add ideas or future projects..." required autocomplete="off" />
              <button type="submit" class="pad-add-btn">+ Add</button>
            </form>

            <!-- Items List -->
            <div class="pad-items-list">
              ${topMind.later.map(item => `
                <div class="pad-item" id="item-${item.id}">
                  <span class="pad-item-bullet">&bull;</span>
                  <div class="pad-item-text" onclick="promptEditTopMind('${item.id}', 'later', '${escapeHtml(item.text.replace(/'/g, "\\'"))}')" title="Click to edit">
                    ${escapeHtml(item.text)}
                  </div>
                  <div class="pad-item-actions">
                    <button type="button" class="pad-shift-btn shift-back" onclick="moveTopMindAction('${item.id}', 'later', 'now')" title="Move to Now (Active Focus)">
                      <span>&larr; Now</span>
                    </button>
                    <button type="button" class="pad-delete-btn" onclick="deleteTopMindAction('${item.id}', 'later')" title="Delete item">
                      <i data-lucide="x" style="width: 13px; height: 13px;"></i>
                    </button>
                  </div>
                </div>
              `).join('')}

              ${topMind.later.length === 0 ? `
                <div class="pad-empty-state">
                  <span>No parked thoughts. Add ideas you want to tackle next!</span>
                </div>
              ` : ''}
            </div>
          </div>

        </div>
      </div>

      <!-- 3. What Tools for What Work (Tool Architecture Blueprint) -->
      <div class="cover-card blueprint-map-card" id="section-architecture-blueprint">
        <div class="blueprint-card-header">
          <div class="blueprint-title-row">
            <span class="blueprint-icon">🧭</span>
            <div>
              <h3 class="blueprint-title">What Tools for What Work</h3>
              <span class="blueprint-sub" style="font-size: 0.74rem; color: #64748B;">Clear boundaries &bull; Zero tool confusion &bull; Every tool has one exact purpose</span>
            </div>
          </div>
          <span class="blueprint-badge">Tool Blueprint</span>
        </div>

        <!-- 5-Tool Architecture Grid -->
        <div class="tools-work-grid-5">
          
          <!-- 1. margo -->
          <div class="tool-work-card tool-card-margo">
            <div class="tool-work-header">
              <span class="tool-work-symbol">🌿</span>
              <h4 class="tool-work-name">margo</h4>
            </div>
            <span class="tool-work-badge badge-margo">Central command + analytics</span>
            <p class="tool-work-desc">
              10,000-ft executive radar, habit momentum, waiting-on horizon, and 1-tap launchers.
            </p>
            <div class="tool-work-example">
              <strong>Example:</strong> Radar card for School admissions + Oct 8 tour ping.
            </div>
          </div>

          <!-- 2. Apple Notes -->
          <div class="tool-work-card tool-card-notes">
            <div class="tool-work-header">
              <span class="tool-work-symbol">📝</span>
              <h4 class="tool-work-name">Apple Notes</h4>
            </div>
            <span class="tool-work-badge badge-notes">Master notes + Master tasks</span>
            <p class="tool-work-desc">
              Deep working notes, strategy synthesis, project roadmaps, and complete master task lists.
            </p>
            <div class="tool-work-example">
              <strong>Example:</strong> <code># SCHOOL 01_BATTLE PLAN</code> master checklist.
            </div>
          </div>

          <!-- 3. Google Drive -->
          <div class="tool-work-card tool-card-drive">
            <div class="tool-work-header">
              <span class="tool-work-symbol">📁</span>
              <h4 class="tool-work-name">Google Drive</h4>
            </div>
            <span class="tool-work-badge badge-drive">Digital files</span>
            <p class="tool-work-desc">
              Static evidence vault: signed IEP PDFs, neuropsych evaluations, official incident records, spreadsheets.
            </p>
            <div class="tool-work-example">
              <strong>Example:</strong> Folder <code>📁 Z Records</code> with official PDFs.
            </div>
          </div>

          <!-- 4. Things 3 -->
          <div class="tool-work-card tool-card-things">
            <div class="tool-work-header">
              <span class="tool-work-symbol">⚡</span>
              <h4 class="tool-work-name">Things 3</h4>
            </div>
            <span class="tool-work-badge badge-things">Immediate to do</span>
            <p class="tool-work-desc">
              The execution trigger chamber &mdash; only the next 1–2 physical strikes sitting in Today. Zero task bloat.
            </p>
            <div class="tool-work-example">
              <strong>Example:</strong> <code>📞 Call Windsor admissions re: tour</code>.
            </div>
          </div>

          <!-- 5. Gmail -->
          <div class="tool-work-card tool-card-gmail">
            <div class="tool-work-header">
              <span class="tool-work-symbol">✉️</span>
              <h4 class="tool-work-name">Gmail</h4>
            </div>
            <span class="tool-work-badge badge-gmail">Email comms</span>
            <p class="tool-work-desc">
              Inbound and outbound communications, dedicated domain labels, zero inbox clutter.
            </p>
            <div class="tool-work-example">
              <strong>Example:</strong> Filter <code>label:OOD-Placement</code>.
            </div>
          </div>

        </div>

        <!-- The Golden Rule Banner -->
        <div class="workflow-loop-strip">
          <div class="loop-strip-left">
            <span class="loop-strip-tag">The Golden Rule</span>
            <span class="loop-strip-formula">
              Master lists stay in <span class="formula-highlight">Apple Notes</span> &bull; Files stay in <span class="formula-highlight">Google Drive</span> &bull; Only today's 1–2 strikes enter <span class="formula-highlight">Things 3</span> &bull; Status tracked in <span class="formula-highlight">margo</span>
            </span>
          </div>
        </div>
      </div>

      <!-- 4. Active Campaigns & Life Architecture (White & Shadow Card) -->
      <div class="active-campaigns-section" id="section-active-campaigns">
        <!-- Prominent Headline (Direct from Sample) -->
        <div class="campaigns-hero-heading">
          <h2 class="campaigns-hero-title">Active Campaigns &amp; Life Architecture</h2>
          <span class="campaigns-hero-sub">Executive 10,000-ft visibility &bull; One home for each stream &bull; Zero fragmented friction</span>
        </div>

        <!-- Big Elevated White Card Container (Matching Sample) -->
        <div class="campaigns-white-card">
          <div class="white-card-brand">margo</div>

          <!-- High-Stakes Campaigns -->
          <div class="campaigns-tier-title">High-Stakes Campaigns</div>

          <div class="campaigns-grid-2x2">
            <!-- 1. School Admissions & OOD Placement -->
            <div class="campaign-sample-card">
              <div class="sample-card-top">
                <h4 class="sample-domain-title">Z: School Admissions &amp; OOD Placement</h4>
                <span class="sample-phase-pill pill-state-strike" title="Ball in your court — 1 active strike in Things 3">⚡ Active Strike</span>
              </div>
              <div class="sample-strike-line" onclick="copyThingsStrike('📞 Call Windsor admissions re: tour')" title="Click to copy strike to Things 3">
                <span class="strike-prefix">next in Things 3:</span>
                <span class="strike-action">📞 Call Windsor admissions re: tour</span>
              </div>
              <div class="sample-strike-line" onclick="copyThingsStrike('📄 Request police incident report from precinct')" title="Click to copy strike to Things 3" style="margin-top: -3px;">
                <span class="strike-prefix">parallel strike:</span>
                <span class="strike-action">📄 Request police incident report</span>
              </div>
              <div class="sample-card-bottom">
                <div class="sample-radar-pill" title="Waiting on tour confirmation from Windsor admissions">
                  <span class="radar-dot"></span>
                  <span class="radar-label">waiting-on radar</span>
                  <span class="radar-sub-date">Oct 8 &bull; Windsor Tour</span>
                </div>
                <div class="sample-launchers-group">
                  <button type="button" class="sample-launch-btn" onclick="copyAppleNoteLauncher('# SCHOOL 01_BATTLE PLAN')" title="Copy Apple Note title">Apple Note</button>
                  <button type="button" class="sample-launch-btn" onclick="openDriveFolder('Z Records')" title="Open Google Drive folder">Google Drive</button>
                  <button type="button" class="sample-launch-btn" onclick="openGmailLabel('OOD-Placement')" title="Open Gmail label">Gmail</button>
                  <button type="button" class="sample-roadmap-trigger" onclick="openSchoolBattlePlanModal()" title="View complete step-by-step roadmap">🗺️ Roadmap</button>
                </div>
              </div>
            </div>

            <!-- 2. Out-of-network claims -->
            <div class="campaign-sample-card">
              <div class="sample-card-top">
                <h4 class="sample-domain-title">Out-of-network claims</h4>
                <span class="sample-phase-pill pill-state-waiting" title="Ball in insurer's court — waiting on EOB reimbursement">⏳ Waiting On</span>
              </div>
              <div class="sample-strike-line" onclick="copyThingsStrike('📄 Upload superbills for Sept sessions')" title="Click to copy strike to Things 3">
                <span class="strike-prefix">next in Things 3:</span>
                <span class="strike-action">📄 Upload superbills for Sept sessions</span>
              </div>
              <div class="sample-card-bottom">
                <div class="sample-radar-pill">
                  <span class="radar-dot"></span>
                  <span class="radar-label">waiting-on radar</span>
                  <span class="radar-sub-date">Oct 12 &bull; EOB</span>
                </div>
                <div class="sample-launchers-group">
                  <button type="button" class="sample-launch-btn" onclick="copyAppleNoteLauncher('# CLAIMS 01_TRACKER')" title="Copy Apple Note title">Apple Note</button>
                  <button type="button" class="sample-launch-btn" onclick="openDriveFolder('Superbills & EOBs')" title="Open Google Drive folder">Google Drive</button>
                  <button type="button" class="sample-launch-btn" onclick="openGmailLabel('OON-Claims')" title="Open Gmail label">Gmail</button>
                </div>
              </div>
            </div>

            <!-- 3. Personal finance -->
            <div class="campaign-sample-card">
              <div class="sample-card-top">
                <h4 class="sample-domain-title">Personal finance</h4>
                <span class="sample-phase-pill pill-state-review" title="Scheduled monthly/quarterly checkpoint">🔍 Periodic Review</span>
              </div>
              <div class="sample-strike-line" onclick="copyThingsStrike('📊 Categorize Sept business & personal expenses')" title="Click to copy strike to Things 3">
                <span class="strike-prefix">next in Things 3:</span>
                <span class="strike-action">📊 Categorize Sept expenses</span>
              </div>
              <div class="sample-card-bottom">
                <div class="sample-action-pill">
                  <span class="action-arrow">&rarr;</span>
                  <span class="action-label">quick action</span>
                  <span class="action-sub-note">CPA Q3</span>
                </div>
                <div class="sample-launchers-group">
                  <button type="button" class="sample-launch-btn" onclick="copyAppleNoteLauncher('# FINANCE 01_OVERVIEW')" title="Copy Apple Note title">Apple Note</button>
                  <button type="button" class="sample-launch-btn" onclick="openDriveFolder('Tax Docs 2026')" title="Open Google Drive folder">Google Drive</button>
                  <button type="button" class="sample-launch-btn" onclick="openDriveFolder('Cashflow Master')" title="Open Spreadsheet">Spreadsheet</button>
                </div>
              </div>
            </div>

            <!-- 4. Home decluttering -->
            <div class="campaign-sample-card">
              <div class="sample-card-top">
                <h4 class="sample-domain-title">Home decluttering</h4>
                <span class="sample-phase-pill pill-state-strike" title="Ball in your court — 1 active strike in Things 3">⚡ Active Strike</span>
              </div>
              <div class="sample-strike-line" onclick="copyThingsStrike('📦 Bag 5 donation items from top shelf')" title="Click to copy strike to Things 3">
                <span class="strike-prefix">next in Things 3:</span>
                <span class="strike-action">📦 Bag 5 donation items</span>
              </div>
              <div class="sample-card-bottom">
                <div class="sample-action-pill">
                  <span class="action-arrow">&rarr;</span>
                  <span class="action-label">quick action</span>
                  <span class="action-sub-note">Pickup Oct 15</span>
                </div>
                <div class="sample-launchers-group">
                  <button type="button" class="sample-launch-btn" onclick="copyAppleNoteLauncher('# HOME 01_ZONES')" title="Copy Apple Note title">Apple Note</button>
                  <button type="button" class="sample-launch-btn" onclick="copyAppleNoteLauncher('# HOME 01_PHOTOS')" title="Photo Tracker">Photos</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Personal Protocols -->
          <div class="campaigns-tier-title" style="margin-top: 24px;">Personal Protocols</div>

          <div class="protocols-grid-3">
            <div class="protocol-sample-card">
              <div class="protocol-sample-name">Skincare</div>
              <span class="protocol-sample-sub">Evening Barrier Repair</span>
              <button type="button" class="protocol-sample-btn" onclick="copyAppleNoteLauncher('# BEAUTY 01_SKINCARE')">Apple Note</button>
            </div>

            <div class="protocol-sample-card">
              <div class="protocol-sample-name">Haircare</div>
              <span class="protocol-sample-sub">Scalp Oiling &amp; Bonding</span>
              <button type="button" class="protocol-sample-btn" onclick="jumpToHaircareCheckpoint()">Today's Checkpoint</button>
            </div>

            <div class="protocol-sample-card">
              <div class="protocol-sample-name">Capsule Wardrobe</div>
              <span class="protocol-sample-sub">Fall Rotation (24 pcs)</span>
              <button type="button" class="protocol-sample-btn" onclick="copyAppleNoteLauncher('# STYLE 01_CAPSULE')">View Lookbook</button>
            </div>
          </div>
        </div>

        <!-- Collapsible Detailed Domain Matrix -->
        <div class="domain-matrix-accordion-wrap">
          <details class="domain-matrix-details" id="domain-matrix-details">
            <summary class="domain-matrix-summary">
              <div class="summary-left">
                <div class="summary-title-row">
                  <span class="matrix-pill-badge">Expanded Tool Guide</span>
                  <h4 class="summary-title">📋 Detailed Domain Matrix</h4>
                </div>
                <span class="summary-sub">Tap to view complete tool-by-tool breakdown across margo, Apple Notes, Google Drive, Things 3, and Gmail</span>
              </div>
              <div class="summary-toggle-indicator">
                <span class="toggle-status-text">View Matrix</span>
                <i data-lucide="chevron-down" class="matrix-chevron"></i>
              </div>
            </summary>

            <div class="domain-matrix-table-container">
              <table class="domain-matrix-table">
                <thead>
                  <tr>
                    <th class="th-num">#</th>
                    <th class="th-domain">Domain / Life Project</th>
                    <th class="th-tool"><span class="tool-head-pill pill-margo">🌿 margo</span></th>
                    <th class="th-tool"><span class="tool-head-pill pill-notes">📝 Apple Notes</span></th>
                    <th class="th-tool"><span class="tool-head-pill pill-drive">📁 Google Drive / Docs</span></th>
                    <th class="th-tool"><span class="tool-head-pill pill-things">⚡ Things 3</span></th>
                    <th class="th-tool"><span class="tool-head-pill pill-gmail">✉️ Gmail</span></th>
                  </tr>
                </thead>
                <tbody>
                  <!-- 1. School (Populated) -->
                  <tr class="row-populated">
                    <td class="col-num">01</td>
                    <td class="col-domain-cell">
                      <div class="domain-title">Z: School Admissions &amp; OOD Placement</div>
                      <span class="domain-status-tag status-active">Active Campaign</span>
                    </td>
                    <td class="col-content-cell cell-margo">
                      <div class="cell-main-highlight">Radar Card: Phase 2 (Selection &amp; Tours)</div>
                      <div class="cell-desc-text">Waiting-On radar (Windsor Oct 8, Packet Oct 10)</div>
                      <div class="cell-desc-sub muted" style="margin-top: 3px;">🌱 Z Hub: Behavior Log + Daily Report PDFs</div>
                    </td>
                    <td class="col-content-cell cell-notes">
                      <code class="note-code-badge"># SCHOOL 01_BATTLE PLAN</code>
                      <div class="cell-desc-text">School profiles, visit checklists, raw meeting thoughts, non-compliance log</div>
                    </td>
                    <td class="col-content-cell cell-drive">
                      <div class="cell-main-highlight">📁 Z Records:</div>
                      <div class="cell-desc-text">Official IEP PDFs, Neuropsych evals, PWNs, Police incident reports</div>
                    </td>
                    <td class="col-content-cell cell-things">
                      <div class="cell-main-highlight">📞 Call Windsor admissions re: tour</div>
                      <div class="cell-desc-text" style="color: #C26344; font-weight: 600;">📄 Request police incident report</div>
                      <div class="cell-desc-sub muted">(Max 1–2 active strikes)</div>
                    </td>
                    <td class="col-content-cell cell-gmail">
                      <span class="gmail-label-pill">Label: OOD-Placement</span>
                      <div class="cell-desc-sub muted" style="margin-top: 3px;">Auto-filed district &amp; school correspondence</div>
                    </td>
                  </tr>

                  <!-- 2. Out-of-Network Claims (Unpopulated) -->
                  <tr class="row-pending">
                    <td class="col-num">02</td>
                    <td class="col-domain-cell">
                      <div class="domain-title">Out-of-Network Claims</div>
                      <span class="domain-status-tag status-pending">Pending Fill</span>
                    </td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                  </tr>

                  <!-- 3. Personal Finance (Unpopulated) -->
                  <tr class="row-pending">
                    <td class="col-num">03</td>
                    <td class="col-domain-cell">
                      <div class="domain-title">Personal Finance</div>
                      <span class="domain-status-tag status-pending">Pending Fill</span>
                    </td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                  </tr>

                  <!-- 4. Home Decluttering (Unpopulated) -->
                  <tr class="row-pending">
                    <td class="col-num">04</td>
                    <td class="col-domain-cell">
                      <div class="domain-title">Home Decluttering</div>
                      <span class="domain-status-tag status-pending">Pending Fill</span>
                    </td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                  </tr>

                  <!-- 5. Skincare (Unpopulated) -->
                  <tr class="row-pending">
                    <td class="col-num">05</td>
                    <td class="col-domain-cell">
                      <div class="domain-title">Skincare</div>
                      <span class="domain-status-tag status-pending">Pending Fill</span>
                    </td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                  </tr>

                  <!-- 6. Haircare (Unpopulated) -->
                  <tr class="row-pending">
                    <td class="col-num">06</td>
                    <td class="col-domain-cell">
                      <div class="domain-title">Haircare</div>
                      <span class="domain-status-tag status-pending">Pending Fill</span>
                    </td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                  </tr>

                  <!-- 7. Outfits & Wardrobe (Unpopulated) -->
                  <tr class="row-pending">
                    <td class="col-num">07</td>
                    <td class="col-domain-cell">
                      <div class="domain-title">Outfits &amp; Wardrobe</div>
                      <span class="domain-status-tag status-pending">Pending Fill</span>
                    </td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                    <td class="col-content-cell cell-empty">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
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
   Top of Mind Event Handlers
   -------------------------------------------------------------------------- */
function submitAddTopMind(event, targetList) {
  event.preventDefault();
  const input = document.getElementById(`input-top-mind-${targetList}`);
  if (!input) return;
  const val = input.value.trim();
  if (val && typeof storage !== 'undefined') {
    storage.addCoverTopMindItem(targetList, val);
    input.value = '';
    renderCoverHubPage();
    if (typeof showToast === 'function') {
      showToast(`Added to ${targetList === 'now' ? 'Active Focus (Now)' : 'Parking Lot (Later)'}`);
    }
  }
}
window.submitAddTopMind = submitAddTopMind;

function moveTopMindAction(id, fromList, toList) {
  if (typeof storage !== 'undefined') {
    storage.moveCoverTopMindItem(id, fromList, toList);
    renderCoverHubPage();
    if (typeof showToast === 'function') {
      showToast(`Moved to ${toList === 'now' ? 'Now (Active Focus)' : 'Later (Parking Lot)'}`);
    }
  }
}
window.moveTopMindAction = moveTopMindAction;

function deleteTopMindAction(id, listName) {
  if (typeof storage !== 'undefined') {
    storage.deleteCoverTopMindItem(id, listName);
    renderCoverHubPage();
    if (typeof showToast === 'function') {
      showToast('Item removed from scratchpad');
    }
  }
}
window.deleteTopMindAction = deleteTopMindAction;

function promptEditTopMind(id, listName, currentText) {
  const newText = prompt('Edit scratchpad item:', currentText);
  if (newText !== null && newText.trim().length > 0 && typeof storage !== 'undefined') {
    storage.updateCoverTopMindItem(id, listName, newText.trim());
    renderCoverHubPage();
  }
}
window.promptEditTopMind = promptEditTopMind;

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


