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

      <!-- 3. Active Campaigns & Life Architecture Dashboard + Collapsed Domain Matrix -->
      <div class="cover-card active-campaigns-dashboard" id="section-active-campaigns">
        <div class="card-title-row">
          <div class="title-with-desc">
            <div class="campaigns-badge-row">
              <span class="campaigns-eyebrow"><i data-lucide="compass" style="width: 14px; height: 14px;"></i> EXECUTIVE COMMAND CENTER</span>
              <span class="campaigns-count-badge">7 Domains Mapped</span>
            </div>
            <h3 class="campaigns-main-title">Active Campaigns &amp; Life Architecture</h3>
            <span class="card-sub-muted">Executive 10,000-ft visibility &bull; One home for each stream &bull; Zero fragmented friction</span>
          </div>
        </div>

        <!-- Tier 1: High-Stakes Campaigns -->
        <div class="campaigns-tier-header">
          <div class="tier-indicator tier-high-stakes">
            <span class="tier-symbol">🏛️</span>
            <div>
              <h4 class="tier-title">High-Stakes Campaigns</h4>
              <span class="tier-subtitle">Active execution, waiting-on radar, and single-strike momentum</span>
            </div>
          </div>
        </div>

        <div class="campaigns-cards-grid">
          <!-- Card 1: School Admissions -->
          <div class="campaign-card" id="card-campaign-school">
            <div class="campaign-card-header">
              <div class="campaign-card-domain">
                <span class="campaign-icon">🏫</span>
                <div>
                  <h5 class="campaign-name">Z: School Admissions &amp; OOD Placement</h5>
                  <span class="campaign-target-meta">Out-of-District Search &amp; Placement</span>
                </div>
              </div>
              <span class="campaign-phase-pill phase-school">Phase 2: Tours &amp; Intake</span>
            </div>

            <div class="campaign-card-body">
              <div class="campaign-strike-box" onclick="copyThingsStrike('📞 Call Windsor admissions re: tour')" title="Click to copy strike to clipboard">
                <div class="strike-box-label">
                  <span class="strike-tag-badge">⚡ ACTIVE STRIKE (THINGS 3)</span>
                  <span class="strike-sub-hint">Max 1 physical move</span>
                </div>
                <div class="strike-box-content">
                  <span class="strike-text">📞 Call Windsor admissions re: tour</span>
                  <i data-lucide="copy" class="strike-copy-icon"></i>
                </div>
              </div>

              <div class="campaign-radar-box">
                <div class="radar-box-header">
                  <span class="radar-tag-badge"><i data-lucide="radar" style="width: 12px; height: 12px;"></i> WAITING-ON RADAR</span>
                  <span class="radar-tag-date">Follow-up: Oct 8</span>
                </div>
                <p class="radar-box-content">
                  Waiting on Dr. K for updated neuropsych addendum &amp; PWN packet.
                </p>
              </div>

              <div class="campaign-launchers-strip">
                <span class="launchers-label">🔗 Quick Launchers:</span>
                <div class="launchers-buttons">
                  <button type="button" class="launcher-btn launcher-notes" onclick="copyAppleNoteLauncher('# SCHOOL 01_BATTLE PLAN')" title="Copy Apple Note title to search/open">
                    <span class="btn-icon">📝</span>
                    <span class="btn-text"># SCHOOL 01_BATTLE PLAN</span>
                  </button>
                  <button type="button" class="launcher-btn launcher-drive" onclick="openDriveFolder('Z Records')" title="Open Google Drive folder">
                    <span class="btn-icon">📁</span>
                    <span class="btn-text">📁 Z Records (PWNs, IEPs)</span>
                  </button>
                  <button type="button" class="launcher-btn launcher-gmail" onclick="openGmailLabel('OOD-Placement')" title="Open Gmail label">
                    <span class="btn-icon">✉️</span>
                    <span class="btn-text">Label: OOD-Placement</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 2: Out-of-Network Claims -->
          <div class="campaign-card" id="card-campaign-claims">
            <div class="campaign-card-header">
              <div class="campaign-card-domain">
                <span class="campaign-icon">⚖️</span>
                <div>
                  <h5 class="campaign-name">Out-of-Network Insurance Claims</h5>
                  <span class="campaign-target-meta">Superbills, Reimbursements &amp; Included Health</span>
                </div>
              </div>
              <span class="campaign-phase-pill phase-claims">Phase 1: Claim Filing</span>
            </div>

            <div class="campaign-card-body">
              <div class="campaign-strike-box" onclick="copyThingsStrike('📄 Upload superbills for Sept sessions')" title="Click to copy strike to clipboard">
                <div class="strike-box-label">
                  <span class="strike-tag-badge">⚡ ACTIVE STRIKE (THINGS 3)</span>
                  <span class="strike-sub-hint">Max 1 physical move</span>
                </div>
                <div class="strike-box-content">
                  <span class="strike-text">📄 Upload superbills for Sept sessions</span>
                  <i data-lucide="copy" class="strike-copy-icon"></i>
                </div>
              </div>

              <div class="campaign-radar-box">
                <div class="radar-box-header">
                  <span class="radar-tag-badge"><i data-lucide="radar" style="width: 12px; height: 12px;"></i> WAITING-ON RADAR</span>
                  <span class="radar-tag-date">Follow-up: Oct 12</span>
                </div>
                <p class="radar-box-content">
                  Waiting on Aetna for claim #8921 adjudication &amp; check issuance.
                </p>
              </div>

              <div class="campaign-launchers-strip">
                <span class="launchers-label">🔗 Quick Launchers:</span>
                <div class="launchers-buttons">
                  <button type="button" class="launcher-btn launcher-notes" onclick="copyAppleNoteLauncher('# CLAIMS 01_TRACKER')" title="Copy Apple Note title">
                    <span class="btn-icon">📝</span>
                    <span class="btn-text"># CLAIMS 01_TRACKER</span>
                  </button>
                  <button type="button" class="launcher-btn launcher-drive" onclick="openDriveFolder('Superbills & EOBs')" title="Open Google Drive folder">
                    <span class="btn-icon">📁</span>
                    <span class="btn-text">📁 Superbills &amp; EOBs</span>
                  </button>
                  <button type="button" class="launcher-btn launcher-gmail" onclick="openGmailLabel('OON-Claims')" title="Open Gmail label">
                    <span class="btn-icon">✉️</span>
                    <span class="btn-text">Label: OON-Claims</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 3: Personal Finance -->
          <div class="campaign-card" id="card-campaign-finance">
            <div class="campaign-card-header">
              <div class="campaign-card-domain">
                <span class="campaign-icon">💳</span>
                <div>
                  <h5 class="campaign-name">Personal Finance &amp; Tax Prep</h5>
                  <span class="campaign-target-meta">Cashflow Burn, Invoicing &amp; Quarterly Taxes</span>
                </div>
              </div>
              <span class="campaign-phase-pill phase-finance">Quarterly Review</span>
            </div>

            <div class="campaign-card-body">
              <div class="campaign-strike-box" onclick="copyThingsStrike('📊 Categorize Sept business & personal expenses')" title="Click to copy strike to clipboard">
                <div class="strike-box-label">
                  <span class="strike-tag-badge">⚡ ACTIVE STRIKE (THINGS 3)</span>
                  <span class="strike-sub-hint">Max 1 physical move</span>
                </div>
                <div class="strike-box-content">
                  <span class="strike-text">📊 Categorize Sept business &amp; personal expenses</span>
                  <i data-lucide="copy" class="strike-copy-icon"></i>
                </div>
              </div>

              <div class="campaign-radar-box">
                <div class="radar-box-header">
                  <span class="radar-tag-badge"><i data-lucide="radar" style="width: 12px; height: 12px;"></i> WAITING-ON RADAR</span>
                  <span class="radar-tag-date">Pending Response</span>
                </div>
                <p class="radar-box-content">
                  Waiting on CPA for Q3 estimated tax voucher &amp; payroll reconciliation.
                </p>
              </div>

              <div class="campaign-launchers-strip">
                <span class="launchers-label">🔗 Quick Launchers:</span>
                <div class="launchers-buttons">
                  <button type="button" class="launcher-btn launcher-notes" onclick="copyAppleNoteLauncher('# FINANCE 01_OVERVIEW')" title="Copy Apple Note title">
                    <span class="btn-icon">📝</span>
                    <span class="btn-text"># FINANCE 01_OVERVIEW</span>
                  </button>
                  <button type="button" class="launcher-btn launcher-drive" onclick="openDriveFolder('Tax Docs 2026')" title="Open Google Drive folder">
                    <span class="btn-icon">📁</span>
                    <span class="btn-text">📁 Tax Docs 2026</span>
                  </button>
                  <button type="button" class="launcher-btn launcher-sheet" onclick="openDriveFolder('Cashflow Master')" title="Open Spreadsheet">
                    <span class="btn-icon">📊</span>
                    <span class="btn-text">📊 Cashflow Master</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 4: Home Decluttering -->
          <div class="campaign-card" id="card-campaign-home">
            <div class="campaign-card-header">
              <div class="campaign-card-domain">
                <span class="campaign-icon">📦</span>
                <div>
                  <h5 class="campaign-name">Home Decluttering &amp; Zone Reset</h5>
                  <span class="campaign-target-meta">Orderly Environment &bull; 1 Zone at a Time</span>
                </div>
              </div>
              <span class="campaign-phase-pill phase-home">Zone 2: Primary Closet</span>
            </div>

            <div class="campaign-card-body">
              <div class="campaign-strike-box" onclick="copyThingsStrike('📦 Bag 5 donation items from top shelf')" title="Click to copy strike to clipboard">
                <div class="strike-box-label">
                  <span class="strike-tag-badge">⚡ ACTIVE STRIKE (THINGS 3)</span>
                  <span class="strike-sub-hint">Max 1 physical move</span>
                </div>
                <div class="strike-box-content">
                  <span class="strike-text">📦 Bag 5 donation items from top shelf</span>
                  <i data-lucide="copy" class="strike-copy-icon"></i>
                </div>
              </div>

              <div class="campaign-radar-box">
                <div class="radar-box-header">
                  <span class="radar-tag-badge"><i data-lucide="radar" style="width: 12px; height: 12px;"></i> RADAR STATUS</span>
                  <span class="radar-tag-date">Zero Blockers</span>
                </div>
                <p class="radar-box-content">
                  All clear &bull; Self-paced momentum &bull; Next donation run scheduled Oct 15.
                </p>
              </div>

              <div class="campaign-launchers-strip">
                <span class="launchers-label">🔗 Quick Launchers:</span>
                <div class="launchers-buttons">
                  <button type="button" class="launcher-btn launcher-notes" onclick="copyAppleNoteLauncher('# HOME 01_ZONES')" title="Copy Apple Note title">
                    <span class="btn-icon">📝</span>
                    <span class="btn-text"># HOME 01_ZONES</span>
                  </button>
                  <button type="button" class="launcher-btn launcher-photos" onclick="copyAppleNoteLauncher('# HOME 01_PHOTOS')" title="Photo Tracker">
                    <span class="btn-icon">📷</span>
                    <span class="btn-text">📷 Before &amp; After Album</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tier 2: Personal Protocols -->
        <div class="campaigns-tier-header" style="margin-top: 24px;">
          <div class="tier-indicator tier-protocols">
            <span class="tier-symbol">🌿</span>
            <div>
              <h4 class="tier-title">Personal Protocols (Maintenance &amp; Flow)</h4>
              <span class="tier-subtitle">Daily rituals &amp; wardrobe rotations &bull; Kept separate to preserve focus</span>
            </div>
          </div>
        </div>

        <div class="protocols-grid">
          <!-- Protocol 1: Skincare -->
          <div class="protocol-card">
            <div class="protocol-card-header">
              <span class="protocol-icon">🧴</span>
              <div>
                <h5 class="protocol-name">Skincare Routine</h5>
                <span class="protocol-current">Evening Barrier Repair Protocol</span>
              </div>
            </div>
            <div class="protocol-details">
              <div class="protocol-meta-item">
                <span class="meta-label">Anchor:</span>
                <span class="meta-val">Daily Checkpoint #2 (Vitality)</span>
              </div>
              <div class="protocol-meta-item">
                <span class="meta-label">Next Refill:</span>
                <span class="meta-val">Ceramide Barrier Cream (~2 wks)</span>
              </div>
            </div>
            <div class="protocol-action-row">
              <button type="button" class="protocol-btn" onclick="copyAppleNoteLauncher('# BEAUTY 01_SKINCARE')">
                <span>📝 Open Skincare Protocol</span>
              </button>
            </div>
          </div>

          <!-- Protocol 2: Haircare -->
          <div class="protocol-card">
            <div class="protocol-card-header">
              <span class="protocol-icon">🌿</span>
              <div>
                <h5 class="protocol-name">Haircare Rituals</h5>
                <span class="protocol-current">Scalp oiling &amp; bonding treatment</span>
              </div>
            </div>
            <div class="protocol-details">
              <div class="protocol-meta-item">
                <span class="meta-label">Anchor:</span>
                <span class="meta-val">Daily Checkpoint #4 (Haircare)</span>
              </div>
              <div class="protocol-meta-item">
                <span class="meta-label">Deep Mask:</span>
                <span class="meta-val">Sunday evening ritual</span>
              </div>
            </div>
            <div class="protocol-action-row">
              <button type="button" class="protocol-btn" onclick="jumpToHaircareCheckpoint()">
                <span>☀️ Jump to Haircare Checkpoint</span>
              </button>
            </div>
          </div>

          <!-- Protocol 3: Wardrobe -->
          <div class="protocol-card">
            <div class="protocol-card-header">
              <span class="protocol-icon">👗</span>
              <div>
                <h5 class="protocol-name">Capsule Wardrobe</h5>
                <span class="protocol-current">Fall Seasonal Rotation (24 pieces)</span>
              </div>
            </div>
            <div class="protocol-details">
              <div class="protocol-meta-item">
                <span class="meta-label">Strike:</span>
                <span class="meta-val">Pull winter knits from storage bin</span>
              </div>
              <div class="protocol-meta-item">
                <span class="meta-label">Lookbook:</span>
                <span class="meta-val">12 core outfits documented</span>
              </div>
            </div>
            <div class="protocol-action-row">
              <button type="button" class="protocol-btn" onclick="copyAppleNoteLauncher('# STYLE 01_CAPSULE')">
                <span>📝 View Lookbook Note</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Tier 3: Collapsible Detailed Domain Matrix (Collapsed by default) -->
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
                      <div class="cell-main-highlight">Radar Card: Phase 2 (Tours)</div>
                      <div class="cell-desc-text">Waiting-On tracker, Direct links to Notes &amp; Drive</div>
                    </td>
                    <td class="col-content-cell cell-notes">
                      <code class="note-code-badge"># SCHOOL 01_BATTLE PLAN</code>
                      <div class="cell-desc-text">School profiles, intake notes, incident timeline</div>
                    </td>
                    <td class="col-content-cell cell-drive">
                      <div class="cell-main-highlight">📁 Z Records:</div>
                      <div class="cell-desc-text">IEP PDFs, Neuropsych evals, PWNs</div>
                    </td>
                    <td class="col-content-cell cell-things">
                      <div class="cell-main-highlight">📞 Call Windsor admissions re: tour</div>
                      <div class="cell-desc-sub muted">(Max 1 active task)</div>
                    </td>
                    <td class="col-content-cell cell-gmail">
                      <span class="gmail-label-pill">Label: OOD-Placement</span>
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

