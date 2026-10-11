/* ==========================================================================
   Book of Life / Life OS - Medical Claims & Recovery Tracker Page
   Theme: Nordic Serene (Sea Glass Teal & Cool Lavender)
   Architecture: 3-Way Match (Superbill ➔ Insurance Portal ➔ Bank Deposit)
   ========================================================================== */

let activeClaimsFilter = (() => {
  try {
    const s = localStorage.getItem('BOL_CLAIMS_FILTER');
    if (s) return s;
  } catch (e) {}
  return 'all';
})();

let isClaimsSettledOpen = false;
let settledClaimsSearchQuery = '';
let activePresetKey = null;
let selectedPatientName = 'Xavier Healy';
let editingClaimId = null;
let quickAddSubmissionType = 'provider'; // 'provider' | 'self'

function getClaimDraft() {
  try {
    const raw = localStorage.getItem('BOL_CLAIM_DRAFT') || sessionStorage.getItem('BOL_CLAIM_DRAFT');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveClaimDraft() {
  try {
    const draft = {
      date: document.getElementById('claim-date-input')?.value || '',
      provider: document.getElementById('claim-provider-input')?.value || '',
      patient: selectedPatientName || 'Xavier Healy',
      amountPaid: document.getElementById('claim-amount-input')?.value || '',
      submissionType: quickAddSubmissionType || 'provider',
      payoutMethod: document.getElementById('claim-payout-select')?.value || 'direct_deposit',
      stage: document.getElementById('claim-stage-select')?.value || (quickAddSubmissionType === 'provider' ? 'with_included_health' : 'ready_to_send'),
      superbillStatus: document.getElementById('claim-superbill-select')?.value || 'have',
      nextAction: document.getElementById('claim-nextaction-input')?.value || ''
    };
    localStorage.setItem('BOL_CLAIM_DRAFT', JSON.stringify(draft));
  } catch (e) {}
}

function clearClaimDraft() {
  try {
    localStorage.removeItem('BOL_CLAIM_DRAFT');
    sessionStorage.removeItem('BOL_CLAIM_DRAFT');
  } catch (e) {}
}

function setQuickAddSubmissionType(type) {
  quickAddSubmissionType = type;
  const provBtn = document.getElementById('lane-btn-provider');
  const selfBtn = document.getElementById('lane-btn-self');
  if (provBtn) provBtn.classList.toggle('active', type === 'provider');
  if (selfBtn) selfBtn.classList.toggle('active', type === 'self');
  
  const select = document.getElementById('claim-submission-select');
  if (select) select.value = type;

  const nextActionInput = document.getElementById('claim-nextaction-input');
  if (nextActionInput && !nextActionInput.value.trim()) {
    nextActionInput.value = (type === 'provider')
      ? 'Provider filing claim — check portal for confirmation'
      : 'Upload superbill to Included Health app';
  }
  saveClaimDraft();
}

function setClaimPreset(presetKey) {
  activePresetKey = presetKey;
  const providerInput = document.getElementById('claim-provider-input');
  const amountInput = document.getElementById('claim-amount-input');
  const nextActionInput = document.getElementById('claim-nextaction-input');

  if (presetKey === 'barness') {
    if (providerInput) providerInput.value = 'Dr. Michael Barness';
    if (amountInput) amountInput.value = '300.00';
    setQuickAddSubmissionType('self');
    selectedPatientName = 'Xavier Healy';
    if (nextActionInput) nextActionInput.value = 'Upload superbill to Included Health app';
  } else if (presetKey === 'mindsoother') {
    if (providerInput) providerInput.value = 'Mindsoother Therapy';
    if (amountInput) amountInput.value = '225.00';
    setQuickAddSubmissionType('provider');
    selectedPatientName = 'Xavier Healy';
    if (nextActionInput) nextActionInput.value = 'Provider courtesy filing — check portal';
  } else if (presetKey === 'roseland') {
    if (providerInput) providerInput.value = 'Roseland Psychotherapy';
    if (amountInput) amountInput.value = '255.00';
    setQuickAddSubmissionType('provider');
    selectedPatientName = 'Xavier Healy';
    if (nextActionInput) nextActionInput.value = 'Psychotherapy session';
  } else if (presetKey === 'custom') {
    if (providerInput) providerInput.value = '';
    if (amountInput) amountInput.value = '';
    if (nextActionInput) nextActionInput.value = '';
  }

  saveClaimDraft();
  renderClaimsPage();
}

function setClaimPatient(patientName) {
  selectedPatientName = patientName;
  saveClaimDraft();
  renderClaimsPage();
}

function toggleClaimsSettledAccordion() {
  isClaimsSettledOpen = !isClaimsSettledOpen;
  renderClaimsPage();
}

function handleSettledSearchInput(val) {
  settledClaimsSearchQuery = (val || '').toLowerCase().trim();
  const tbody = document.getElementById('claims-settled-tbody');
  if (!tbody) return;

  const allClaims = storage.getClaims();
  const settledClaims = allClaims.filter(c => c.stage === 'settled');
  const filtered = settledClaims.filter(c => {
    if (!settledClaimsSearchQuery) return true;
    return (c.provider || '').toLowerCase().includes(settledClaimsSearchQuery) ||
           (c.patient || '').toLowerCase().includes(settledClaimsSearchQuery) ||
           (c.claimNumber || '').toLowerCase().includes(settledClaimsSearchQuery) ||
           (c.date || '').toLowerCase().includes(settledClaimsSearchQuery);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:16px;color:var(--text-muted);font-size:0.8rem;">No settled claims matching "${escapeHtml(settledClaimsSearchQuery)}"</td></tr>`;
  } else {
    tbody.innerHTML = filtered.map(c => renderClaimRowHtml(c)).join('');
    if (window.lucide) lucide.createIcons();
  }
}

function renderClaimsPage(targetContainer) {
  const container = targetContainer || document.getElementById('finance-subview-container') || document.getElementById('bunker-subview-frame') || document.getElementById('daily-sheet-container');
  if (!container) return;

  const stats = storage.getClaimsStats();
  const allClaims = storage.getClaims();

  // Active / Needs Resolution items vs Settled items
  const activeClaimsList = allClaims.filter(c => c.stage !== 'settled');
  const settledClaimsList = allClaims.filter(c => c.stage === 'settled');

  // Counts
  const counts = {
    allActive: activeClaimsList.length,
    readyToSend: activeClaimsList.filter(c => c.stage === 'ready_to_send').length,
    missingDeposit: activeClaimsList.filter(c => c.stage === 'check_due').length,
    withInsurance: activeClaimsList.filter(c => c.stage === 'with_included_health').length,
    needSuperbill: activeClaimsList.filter(c => c.stage === 'need_superbill').length,
    settled: settledClaimsList.length
  };

  // Update header badge with actionable count
  updateClaimsHeaderBadge(counts.allActive);

  // Filter Active Claims based on selected subfilter
  let displayedActiveClaims = activeClaimsList;
  if (activeClaimsFilter === 'ready_to_send') {
    displayedActiveClaims = activeClaimsList.filter(c => c.stage === 'ready_to_send');
  } else if (activeClaimsFilter === 'check_due' || activeClaimsFilter === 'missing_deposit') {
    displayedActiveClaims = activeClaimsList.filter(c => c.stage === 'check_due');
  } else if (activeClaimsFilter === 'with_included_health' || activeClaimsFilter === 'in_flight') {
    displayedActiveClaims = activeClaimsList.filter(c => c.stage === 'with_included_health');
  } else if (activeClaimsFilter === 'self') {
    displayedActiveClaims = activeClaimsList.filter(c => c.submissionType === 'self');
  } else if (activeClaimsFilter === 'provider') {
    displayedActiveClaims = activeClaimsList.filter(c => c.submissionType === 'provider' || !c.submissionType);
  }

  // Filter Settled Claims if search active
  const displayedSettledClaims = settledClaimsList.filter(c => {
    if (!settledClaimsSearchQuery) return true;
    return (c.provider || '').toLowerCase().includes(settledClaimsSearchQuery) ||
           (c.patient || '').toLowerCase().includes(settledClaimsSearchQuery) ||
           (c.claimNumber || '').toLowerCase().includes(settledClaimsSearchQuery) ||
           (c.date || '').toLowerCase().includes(settledClaimsSearchQuery);
  });

  const todayIso = formatDateIso(new Date());
  const draft = getClaimDraft();
  const formDate = (draft && draft.date) ? draft.date : todayIso;
  const formProvider = (draft && draft.provider) ? draft.provider : '';
  const formAmount = (draft && draft.amountPaid) ? draft.amountPaid : '';
  if (draft && draft.submissionType) quickAddSubmissionType = draft.submissionType;
  if (draft && draft.patient) selectedPatientName = draft.patient;
  const formPayout = (draft && draft.payoutMethod) ? draft.payoutMethod : 'direct_deposit';
  const formStage = (draft && draft.stage) ? draft.stage : (quickAddSubmissionType === 'provider' ? 'with_included_health' : 'ready_to_send');
  const formSuperbill = (draft && draft.superbillStatus) ? draft.superbillStatus : 'have';
  const formNextAction = (draft && draft.nextAction) ? draft.nextAction : (quickAddSubmissionType === 'provider' ? 'Provider filing claim — check portal for confirmation' : 'Upload superbill to Included Health app');

  container.innerHTML = `
    <div class="claims-container">
      
      <!-- 1. Hero Summary Header (Nordic Minimalist) -->
      <div class="claims-hero-card">
        <div class="claims-hero-top">
          <div class="claims-hero-title-group">
            <h2>
              <i data-lucide="shield-check" style="color:var(--primary);width:22px;height:22px;"></i>
              Medical Claims &amp; Reimbursement Hub
            </h2>
            <p>3-Way Match Reconciliation: Provider Superbill &bull; Insurance Portal &bull; Bank Deposit</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="claims-hero-btn" onclick="openIncludedHealthExportModal()" title="Copy formatted summary of unfiled claims to paste into Included Health">
              <i data-lucide="copy" style="width:14px;height:14px;"></i>
              <span>Copy for Included Health</span>
            </button>
            <button class="claims-hero-btn" style="background:var(--bg-surface);color:var(--text-secondary);border-color:var(--border-light);" onclick="storage.exportClaimsCSV();showToast('CSV downloaded!')" title="Download claims as CSV spreadsheet">
              <i data-lucide="download" style="width:14px;height:14px;"></i>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <!-- 3 Quick-Glance Metric Cards -->
        <div class="claims-metrics-grid">
          <div class="claims-metric-box highlight">
            <span class="metric-label">Pending Recovery</span>
            <span class="metric-value">$${stats.totalPendingRecovery.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span class="metric-sub">${counts.allActive} floating claims ($${stats.totalFloatingSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} billed)</span>
          </div>
          <div class="claims-metric-box">
            <span class="metric-label">Needs Resolution</span>
            <span class="metric-value" style="color:${counts.readyToSend > 0 ? '#E11D48' : 'var(--primary)'}">
              ${counts.readyToSend + counts.missingDeposit} Claims
            </span>
            <span class="metric-sub">${counts.readyToSend} ready to file &bull; ${counts.missingDeposit} uncollected bank deposits</span>
          </div>
          <div class="claims-metric-box">
            <span class="metric-label">Reconciled &amp; Settled</span>
            <span class="metric-value" style="color:var(--primary);">
              $${stats.totalSettled.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span class="metric-sub">${counts.settled} claims deposited in checking</span>
          </div>
        </div>
      </div>

      <!-- 2. Streamlined Fast Log Bar for Future Claims -->
      <div class="claims-add-card">
        <!-- 1-Tap Preset Bar & Patient Selection -->
        <div class="claims-presets-bar">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="claims-presets-label">
              <i data-lucide="zap" style="width:13px;height:13px;color:var(--primary);"></i>
              Quick Presets:
            </span>
            <div class="claims-preset-pills">
              <button type="button" class="claims-preset-chip ${activePresetKey === 'barness' ? 'active' : ''}" onclick="setClaimPreset('barness')">
                Dr. Barness ($300 &bull; Self-File)
              </button>
              <button type="button" class="claims-preset-chip ${activePresetKey === 'mindsoother' ? 'active' : ''}" onclick="setClaimPreset('mindsoother')">
                Mindsoother ($225 &bull; Provider)
              </button>
              <button type="button" class="claims-preset-chip ${activePresetKey === 'roseland' ? 'active' : ''}" onclick="setClaimPreset('roseland')">
                Roseland ($255 &bull; Provider)
              </button>
              <button type="button" class="claims-preset-chip ${activePresetKey === 'custom' ? 'active' : ''}" onclick="setClaimPreset('custom')">
                Custom Provider
              </button>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="claims-presets-label">Patient:</span>
            <div class="claims-patient-chips">
              <button type="button" class="claims-patient-chip ${selectedPatientName === 'Xavier Healy' ? 'active' : ''}" onclick="setClaimPatient('Xavier Healy')">
                Xavier
              </button>
              <button type="button" class="claims-patient-chip ${selectedPatientName === 'Ujjaini' ? 'active' : ''}" onclick="setClaimPatient('Ujjaini')">
                Ujjaini
              </button>
              <button type="button" class="claims-patient-chip ${selectedPatientName === 'Thomas' ? 'active' : ''}" onclick="setClaimPatient('Thomas')">
                Thomas
              </button>
            </div>
          </div>
        </div>

        <!-- 2-Way Submission Lane Switcher -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <div class="claims-lane-switcher" style="margin-bottom: 0;">
            <button type="button" id="lane-btn-provider" class="claims-lane-btn ${quickAddSubmissionType === 'provider' ? 'active' : ''}" onclick="setQuickAddSubmissionType('provider')">
              🏥 Provider Submits Directly
            </button>
            <button type="button" id="lane-btn-self" class="claims-lane-btn ${quickAddSubmissionType === 'self' ? 'active' : ''}" onclick="setQuickAddSubmissionType('self')">
              📤 I Submit Superbill
            </button>
          </div>
          <span style="font-size:0.74rem; color:var(--text-muted);">
            ${quickAddSubmissionType === 'provider' ? 'Doctor files claim directly &bull; verify on Anthem portal' : 'Pay doctor &bull; Upload itemized receipt to Included Health'}
          </span>
        </div>

        <form id="quick-add-claim-form" onsubmit="handleQuickAddClaim(event)">
          <!-- Clean 1-Row Fast Log -->
          <div class="claims-fast-row">
            <div class="form-group form-group-provider" style="margin-bottom:0;">
              <input type="text" class="form-input" id="claim-provider-input" value="${formProvider}" oninput="saveClaimDraft()" placeholder="Provider / Specialist (e.g. Dr. Michael Barness)" required>
            </div>
            <div class="form-group form-group-amount" style="margin-bottom:0;">
              <input type="number" step="0.01" min="0" class="form-input" id="claim-amount-input" value="${formAmount}" oninput="saveClaimDraft()" placeholder="Amount Paid ($)" required>
            </div>
            <div class="form-group form-group-date" style="margin-bottom:0;">
              <input type="date" class="form-input" id="claim-date-input" value="${formDate}" oninput="saveClaimDraft()" onchange="saveClaimDraft()" required>
            </div>
            <div class="form-group form-group-btn" style="margin-bottom:0;">
              <button type="submit" class="btn btn-primary claims-fast-add-btn">
                <i data-lucide="plus" style="width:14px;height:14px;"></i>
                <span>Log Visit</span>
              </button>
            </div>
          </div>

          <!-- Hidden inputs for smart lane defaults -->
          <input type="hidden" id="claim-submission-select" value="${quickAddSubmissionType}">
          <input type="hidden" id="claim-payout-select" value="${formPayout}">
          <input type="hidden" id="claim-stage-select" value="${formStage}">
          <input type="hidden" id="claim-superbill-select" value="${formSuperbill}">
          <input type="hidden" id="claim-nextaction-input" value="${formNextAction}">
        </form>
      </div>

      <!-- 3. Smart Action Alerts for Pending Resolution Items -->
      <div class="claims-action-banners-group">
        ${counts.readyToSend > 0 ? `
          <div class="claims-action-banner">
            <div class="claims-action-banner-content">
              <div class="claims-action-banner-icon">📤</div>
              <div class="claims-action-banner-text">
                <h4>${counts.readyToSend} Unfiled Dr. Barness Superbills ($2,100.00 Paid &bull; $1,470.00 Recovery)</h4>
                <p>These visits were never submitted to insurance. Upload the invoices to Included Health to claim your 70% reimbursement.</p>
              </div>
            </div>
            <button class="claims-banner-btn" onclick="openIncludedHealthExportModal('barness')">
              <i data-lucide="copy" style="width:13px;height:13px;"></i>
              <span>Copy 7 Visits for Included Health</span>
            </button>
          </div>
        ` : ''}

        ${counts.missingDeposit > 0 ? `
          <div class="claims-action-banner banner-alert">
            <div class="claims-action-banner-content">
              <div class="claims-action-banner-icon">⚠️</div>
              <div class="claims-action-banner-text">
                <h4 style="color:#E11D48;">${counts.missingDeposit} Claims Approved by Anthem ($1,737.76) Missing Bank Deposit</h4>
                <p>Anthem portal indicates these claims were paid (North Jersey Neuro $1,457.76, Dr. Barness $210, Mindsoother $70), but no checking deposit was received. Check mail or call Member Services.</p>
              </div>
            </div>
            <button class="claims-banner-btn btn-outline" onclick="setClaimsFilter('check_due')">
              <span>View ${counts.missingDeposit} Missing Claims</span>
            </button>
          </div>
        ` : ''}
      </div>

      <!-- 4. SECTION 1: Needs Resolution & In-Flight Claims (Open by Default) -->
      <div class="claims-table-card">
        <div class="claims-card-header">
          <div class="claims-card-title">
            <i data-lucide="clock" style="width:16px;height:16px;color:var(--primary);"></i>
            <span>Active &bull; Needs Resolution (${counts.allActive})</span>
          </div>
          <!-- Sub-filters for active items -->
          <div class="claims-filter-bar" style="margin-bottom:0;">
            <button class="claims-filter-pill ${activeClaimsFilter === 'all' ? 'active' : ''}" onclick="setClaimsFilter('all')">
              All Active (${counts.allActive})
            </button>
            <button class="claims-filter-pill ${activeClaimsFilter === 'ready_to_send' ? 'active' : ''}" onclick="setClaimsFilter('ready_to_send')">
              📤 Ready to File (${counts.readyToSend})
            </button>
            <button class="claims-filter-pill ${activeClaimsFilter === 'check_due' ? 'active' : ''}" onclick="setClaimsFilter('check_due')">
              ⚠️ Missing Deposit (${counts.missingDeposit})
            </button>
            <button class="claims-filter-pill ${activeClaimsFilter === 'with_included_health' ? 'active' : ''}" onclick="setClaimsFilter('with_included_health')">
              ⏳ In-Flight (${counts.withInsurance})
            </button>
          </div>
        </div>

        ${displayedActiveClaims.length === 0 ? `
          <div class="claims-empty-card">
            <i data-lucide="check-circle" style="width:36px;height:36px;color:var(--primary);"></i>
            <div style="font-weight:600;color:var(--text-primary);">All caught up! No active claims in this filter.</div>
            <div style="font-size:0.8rem;max-width:320px;color:var(--text-secondary);margin-top:4px;">Log new visits using the quick form above, or check past settled claims below.</div>
          </div>
        ` : `
          <div class="claims-table-wrapper">
            <table class="claims-data-table">
              <thead>
                <tr>
                  <th class="col-claim">Claim &bull; Patient &bull; Lane</th>
                  <th class="col-status">3-Way Match Checkpoints</th>
                  <th class="col-amount text-right">Billed / Recovery</th>
                  <th class="col-actions text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${displayedActiveClaims.map(claim => renderClaimRowHtml(claim)).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>

      <!-- 5. SECTION 2: Fully Reconciled & Settled Accordion (Collapsed by Default) -->
      <div class="claims-accordion-card">
        <div class="claims-accordion-header" onclick="toggleClaimsSettledAccordion()">
          <div class="claims-accordion-title-wrap">
            <span class="claims-accordion-toggle-icon ${isClaimsSettledOpen ? 'open' : ''}">▶</span>
            <div>
              <h3 class="claims-accordion-title">
                <span>Fully Reconciled &amp; Settled</span>
                <span class="settled-badge-pill">${counts.settled} Claims &bull; $${stats.totalSettled.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Resolved</span>
              </h3>
              <div class="claims-accordion-sub">Past claims where superbill, insurance portal approval, and bank deposit match 100%.</div>
            </div>
          </div>
          <button type="button" class="claims-accordion-toggle-btn">
            <span>${isClaimsSettledOpen ? 'Collapse' : 'Show Resolved (' + counts.settled + ')'}</span>
            <i data-lucide="${isClaimsSettledOpen ? 'chevron-up' : 'chevron-down'}" style="width:13px;height:13px;"></i>
          </button>
        </div>

        ${isClaimsSettledOpen ? `
          <div class="claims-accordion-body">
            <div class="claims-settled-search-bar">
              <input type="text" class="claims-search-input" placeholder="Search by provider, claim #, or date..." value="${escapeHtml(settledClaimsSearchQuery)}" oninput="handleSettledSearchInput(this.value)">
              <span style="font-size:0.75rem;color:var(--text-muted);">${displayedSettledClaims.length} settled claims found</span>
            </div>

            <div class="claims-table-wrapper">
              <table class="claims-data-table">
                <thead>
                  <tr>
                    <th class="col-claim">Settled Claim &bull; Patient</th>
                    <th class="col-status">Reconciliation Summary</th>
                    <th class="col-amount text-right">Paid / Deposited</th>
                    <th class="col-actions text-right">Actions</th>
                  </tr>
                </thead>
                <tbody id="claims-settled-tbody">
                  ${displayedSettledClaims.length === 0 ? `
                    <tr><td colspan="4" style="text-align:center;padding:16px;color:var(--text-muted);font-size:0.8rem;">No settled claims match the search query</td></tr>
                  ` : displayedSettledClaims.map(claim => renderClaimRowHtml(claim)).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}
      </div>

    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

/**
 * Render single claim row HTML with 3-Way Reconciliation Checkpoints
 */
function renderClaimRowHtml(claim) {
  const formattedDate = parseDateIso(claim.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isProviderSubmits = (claim.submissionType === 'provider' || !claim.submissionType);
  const isSettled = (claim.stage === 'settled');
  const patientName = claim.patient || 'Xavier Healy';

  // 3-Way Match Checkpoint states
  const hasSuperbill = (claim.superbillStatus === 'have');
  const inPortal = !!(claim.inPortal || claim.stage === 'with_included_health' || claim.stage === 'check_due' || claim.stage === 'settled');
  const inBank = !!(claim.inBank || claim.stage === 'settled');

  // Next Step / Status Text
  let nextStepText = claim.nextAction || '';
  if (isSettled) {
    const recAmount = claim.reimbursedAmount ? `$${parseFloat(claim.reimbursedAmount).toFixed(2)}` : `$${parseFloat(claim.amountPaid).toFixed(2)}`;
    nextStepText = `Reconciled in bank (${recAmount} deposited)`;
  } else if (!hasSuperbill && !isProviderSubmits) {
    nextStepText = 'Missing receipt — request superbill from doctor';
  } else if (!inPortal && !isProviderSubmits) {
    nextStepText = 'Superbill on hand — submit to Included Health app';
  } else if (!inPortal && isProviderSubmits) {
    nextStepText = 'Provider submitted — check Anthem portal for claim #';
  } else if (inPortal && !inBank) {
    nextStepText = claim.stage === 'check_due' 
      ? 'Approved on portal — missing bank deposit (follow up)'
      : 'In portal review — awaiting insurer EOB / direct deposit';
  }

  const expectedRec = parseFloat(claim.expectedRecovery !== undefined ? claim.expectedRecovery : (claim.eobPlanPaid !== undefined ? claim.eobPlanPaid : claim.amountPaid * 0.7));

  return `
    <tr class="claim-table-row claim-stage-${claim.stage} ${isSettled ? 'is-settled' : 'is-active'}" id="claim-row-${claim.id}">
      <!-- 1. Claim & Lane -->
      <td class="cell-claim">
        <div style="display:flex;align-items:center;gap:6px;">
          <span class="claim-provider-name">${escapeHtml(claim.provider)}</span>
          <span style="font-size:0.68rem;color:var(--text-muted);font-weight:600;">(${escapeHtml(patientName)})</span>
        </div>
        <div class="claim-sub-tags">
          <span class="claim-date-text">${formattedDate}</span>
          <span class="claim-sub-dot">•</span>
          <span class="claim-meta-tag ${isProviderSubmits ? 'tag-provider' : 'tag-self'}" style="font-size: 0.66rem; padding: 1px 6px;">
            ${isProviderSubmits ? '🏥 Provider Files' : '📤 I Submit'}
          </span>
          ${claim.claimNumber ? `
            <span class="claim-sub-dot">•</span>
            <span style="font-size:0.66rem;color:var(--text-muted);font-family:var(--font-mono);">#${escapeHtml(claim.claimNumber)}</span>
          ` : ''}
          ${claim.notes ? `
            <span class="claim-sub-dot">•</span>
            <span class="claim-notes-preview" title="${escapeHtml(claim.notes)}">💬 ${escapeHtml(claim.notes)}</span>
          ` : ''}
        </div>
      </td>

      <!-- 2. 3-Way Match Checkpoints & Status -->
      <td class="cell-status">
        <div class="claim-match-capsule">
          <!-- Checkpoint 1: Superbill / Receipt -->
          <button type="button" class="match-pill-btn ${hasSuperbill ? 'matched' : 'missing'}" onclick="toggleClaimSuperbillMatch('${claim.id}')" title="1. Superbill on hand? Click to toggle.">
            ${hasSuperbill ? '✓ Superbill' : '○ Need Superbill'}
          </button>

          <!-- Checkpoint 2: Insurance Portal -->
          <button type="button" class="match-pill-btn ${inPortal ? 'matched' : ''}" onclick="toggleClaimPortalMatch('${claim.id}')" title="2. Claim verified in Insurance Portal? Click to toggle.">
            ${inPortal ? '✓ In Portal' : '○ Not in Portal'}
          </button>

          <!-- Checkpoint 3: Bank Deposit -->
          <button type="button" class="match-pill-btn ${inBank ? 'matched' : ''}" onclick="toggleClaimBankMatch('${claim.id}')" title="3. Reimbursed deposit received in bank? Click to toggle.">
            ${inBank ? '✓ Deposited' : '○ In Bank'}
          </button>
        </div>

        <div class="active-next-action" style="margin-top: 4px;" title="${escapeHtml(nextStepText)}">
          <span class="next-action-arrow">${isSettled ? '✓' : '↳'}</span>
          <span class="next-action-text" style="color: ${isSettled ? 'var(--text-muted)' : (claim.stage === 'check_due' ? '#E11D48' : 'var(--primary)')}; font-weight: ${isSettled ? '400' : '600'};">
            ${escapeHtml(nextStepText)}
          </span>
        </div>
      </td>

      <!-- 3. Amount -->
      <td class="cell-amount text-right">
        <div>
          <span class="claim-amount-mono">$${(claim.amountPaid || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        ${isSettled ? `
          <div style="font-size:0.72rem;color:var(--primary);font-weight:700;">
            +$${(parseFloat(claim.reimbursedAmount) || claim.amountPaid).toFixed(2)} deposited
          </div>
        ` : `
          <div style="font-size:0.7rem;color:var(--text-muted);">
            est. +$${expectedRec.toFixed(2)} (70%)
          </div>
        `}
      </td>

      <!-- 4. Actions -->
      <td class="cell-actions text-right">
        <div class="claim-actions-cluster">
          <button class="claim-row-action-btn btn-edit" onclick="openEditClaimModal('${claim.id}')" title="Edit Claim">
            <i data-lucide="edit-3" style="width:12px;height:12px;"></i>
          </button>
          <button class="claim-row-action-btn btn-delete" onclick="confirmDeleteClaim('${claim.id}')" title="Delete Claim">
            <i data-lucide="trash-2" style="width:12px;height:12px;"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

/**
 * Filter handling
 */
function setClaimsFilter(filter) {
  activeClaimsFilter = filter;
  try {
    localStorage.setItem('BOL_CLAIMS_FILTER', filter);
  } catch (e) {}
  renderClaimsPage();
}

/**
 * 3-Way Match Checkpoint Handlers
 */
function toggleClaimSuperbillMatch(claimId) {
  const claim = storage.getClaim(claimId);
  if (!claim) return;
  const isHave = (claim.superbillStatus === 'have');
  const nextStatus = isHave ? 'need' : 'have';
  let patch = { superbillStatus: nextStatus };

  if (nextStatus === 'have') {
    if (claim.stage === 'need_superbill') {
      patch.stage = (claim.submissionType === 'provider') ? 'with_included_health' : 'ready_to_send';
      patch.nextAction = (claim.submissionType === 'provider') ? 'Provider filed claim — check portal' : 'Upload superbill to Included Health app';
    }
  } else {
    patch.stage = 'need_superbill';
    patch.nextAction = 'Missing receipt — request superbill from doctor';
  }

  storage.updateClaim(claimId, patch);
  if (typeof showToast === 'function') showToast(nextStatus === 'have' ? '✓ Superbill marked on hand' : '⚠️ Superbill needed from doctor');
  renderClaimsPage();
}

function toggleClaimPortalMatch(claimId) {
  const claim = storage.getClaim(claimId);
  if (!claim) return;
  const currentInPortal = !!(claim.inPortal || claim.stage === 'with_included_health' || claim.stage === 'check_due' || claim.stage === 'settled');
  const nextInPortal = !currentInPortal;
  let patch = { inPortal: nextInPortal };

  if (nextInPortal) {
    if (claim.stage === 'ready_to_send' || claim.stage === 'need_superbill') {
      patch.stage = 'with_included_health';
      patch.nextAction = 'Claim in portal — awaiting insurer EOB';
    }
  } else {
    if (claim.stage === 'with_included_health' || claim.stage === 'check_due') {
      patch.stage = (claim.superbillStatus === 'have') ? 'ready_to_send' : 'need_superbill';
      patch.nextAction = (claim.superbillStatus === 'have') ? 'Not found in portal — file claim now' : 'Missing superbill';
    }
  }

  storage.updateClaim(claimId, patch);
  if (typeof showToast === 'function') showToast(nextInPortal ? '✓ Claim verified in Insurance Portal' : '○ Claim marked unfiled in portal');
  renderClaimsPage();
}

function toggleClaimBankMatch(claimId) {
  const claim = storage.getClaim(claimId);
  if (!claim) return;
  const currentInBank = !!(claim.inBank || claim.stage === 'settled');

  if (!currentInBank) {
    const defaultRec = (claim.expectedRecovery !== undefined ? claim.expectedRecovery : (claim.amountPaid * 0.7)).toFixed(2);
    const promptAmount = prompt(`Deposit received for ${claim.provider}:`, defaultRec);
    if (promptAmount === null) return;
    const reimbursed = parseFloat(promptAmount) || claim.amountPaid;
    storage.updateClaim(claimId, {
      inBank: true,
      inPortal: true,
      superbillStatus: 'have',
      stage: 'settled',
      reimbursedAmount: reimbursed,
      nextAction: `Reconciled in bank ($${reimbursed.toFixed(2)} deposited)`
    });
    if (typeof triggerConfetti === 'function') triggerConfetti();
    if (typeof showToast === 'function') showToast('🎉 Reconciled & deposited in bank! Moved to settled history.');
  } else {
    storage.updateClaim(claimId, {
      inBank: false,
      stage: 'check_due',
      nextAction: 'Awaiting deposit or check in mail'
    });
    if (typeof showToast === 'function') showToast('Reopened — awaiting deposit');
  }

  renderClaimsPage();
}

/**
 * Quick Add Form Handler
 */
function handleQuickAddClaim(e) {
  e.preventDefault();
  const date = document.getElementById('claim-date-input')?.value;
  const provider = document.getElementById('claim-provider-input')?.value.trim();
  const amountPaid = parseFloat(document.getElementById('claim-amount-input')?.value);
  const submissionType = quickAddSubmissionType || 'provider';
  const payoutMethod = document.getElementById('claim-payout-select')?.value || 'direct_deposit';
  const superbillStatus = 'have';
  const stage = (submissionType === 'provider') ? 'with_included_health' : 'ready_to_send';
  const nextAction = (submissionType === 'provider')
    ? 'Provider filing claim — check portal for confirmation'
    : 'Upload superbill to Included Health app';

  if (!provider || isNaN(amountPaid) || amountPaid <= 0) {
    if (typeof showToast === 'function') showToast('Please enter provider and a valid amount');
    return;
  }

  const expectedRecovery = amountPaid * 0.7;

  storage.addClaim({
    date,
    provider,
    patient: selectedPatientName || 'Xavier Healy',
    amountPaid,
    expectedRecovery,
    submissionType,
    payoutMethod,
    superbillStatus,
    stage,
    nextAction,
    inPortal: (submissionType === 'provider'),
    inBank: false
  });

  clearClaimDraft();

  document.getElementById('claim-provider-input').value = '';
  document.getElementById('claim-amount-input').value = '';
  activePresetKey = null;

  if (typeof showToast === 'function') showToast(`Visit for "${provider}" logged! (+5 XP)`);
  if (typeof storage.addPoints === 'function') storage.addPoints(5);
  renderClaimsPage();
}

function confirmDeleteClaim(claimId) {
  const claim = storage.getClaim(claimId);
  if (!claim) return;
  if (confirm(`Delete claim for "${claim.provider}"?`)) {
    storage.deleteClaim(claimId);
    if (typeof showToast === 'function') showToast('Claim deleted.');
    renderClaimsPage();
  }
}

/**
 * Included Health Export Modal & Copy
 */
function openIncludedHealthExportModal(targetPreset) {
  const claims = storage.getClaims();
  let actionable = claims.filter(c => c.stage === 'ready_to_send' || c.stage === 'need_superbill' || c.stage === 'with_included_health');
  
  if (targetPreset === 'barness') {
    actionable = claims.filter(c => c.provider && c.provider.toLowerCase().includes('barness') && c.stage !== 'settled');
  }

  let formattedText = generateIncludedHealthSummary(actionable.length > 0 ? actionable : claims);

  const modal = document.getElementById('modal-export-claims');
  if (!modal) return;

  const body = document.getElementById('export-claims-body');
  if (body) {
    body.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:14px;">
        <p style="font-size:0.84rem;color:var(--text-secondary);margin:0;">
          Below is your formatted claims brief for the Included Health care team. Copy and paste this directly into your care team chat or email:
        </p>
        <textarea class="export-text-preview" id="export-claims-textarea" readonly>${escapeHtml(formattedText)}</textarea>
        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <button class="btn btn-secondary" onclick="closeAllModals()">Close</button>
          <button class="btn btn-primary" onclick="copyIncludedHealthText()">
            <i data-lucide="copy" style="width:14px;height:14px;"></i>
            <span>Copy Text to Clipboard</span>
          </button>
        </div>
      </div>
    `;
  }

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function generateIncludedHealthSummary(claimsList) {
  let totalBilled = 0;
  let totalExpected = 0;
  claimsList.forEach(c => {
    totalBilled += (c.amountPaid || 0);
    totalExpected += (c.expectedRecovery !== undefined ? c.expectedRecovery : (c.amountPaid * 0.7));
  });

  let text = `Hi Included Health Team,\n\n`;
  text += `Here is an update on my current out-of-network medical services for claims filing and reimbursement assistance:\n\n`;

  claimsList.forEach((c, idx) => {
    const dStr = parseDateIso(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const isProv = (c.submissionType === 'provider');
    const isCheck = (c.payoutMethod === 'check');
    const hasSb = (c.superbillStatus === 'have');

    text += `${idx + 1}. Provider: ${c.provider} (Patient: ${c.patient || 'Xavier Healy'})\n`;
    text += `   - Date of Service: ${dStr}\n`;
    text += `   - Billed Amount: $${(c.amountPaid || 0).toFixed(2)}\n`;
    text += `   - Estimated Recovery (70%): $${(c.expectedRecovery || (c.amountPaid * 0.7)).toFixed(2)}\n`;
    text += `   - Submission Type: ${isProv ? 'Provider Courtesy Filing' : 'Self-Submit (Superbill attached)'}\n`;
    text += `   - Reimbursement Preference: ${isCheck ? 'Mailed Paper Check' : 'Direct Deposit (ACH)'}\n`;
    if (c.claimNumber) text += `   - Anthem Claim #: ${c.claimNumber}\n`;
    if (c.notes) text += `   - Notes: ${c.notes}\n`;
    text += `\n`;
  });

  text += `Total Out-of-Pocket Floating: $${totalBilled.toFixed(2)}\n`;
  text += `Expected 70% Reimbursement: $${totalExpected.toFixed(2)}\n\n`;
  text += `Please confirm receipt and let me know if any additional records, itemized superbills, or diagnostic codes are needed. Thank you!`;

  return text;
}

function copyIncludedHealthText() {
  const textarea = document.getElementById('export-claims-textarea');
  if (!textarea) return;
  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(() => {
    if (typeof showToast === 'function') showToast('📋 Formatted text copied to clipboard!');
    closeAllModals();
  }).catch(() => {
    document.execCommand('copy');
    if (typeof showToast === 'function') showToast('📋 Copied!');
    closeAllModals();
  });
}

/**
 * Edit Claim Modal
 */
function openEditClaimModal(claimId) {
  const claim = storage.getClaim(claimId);
  if (!claim) return;

  editingClaimId = claimId;
  const modal = document.getElementById('modal-edit-claim');
  if (!modal) return;

  document.getElementById('edit-claim-date').value = claim.date;
  document.getElementById('edit-claim-provider').value = claim.provider;
  document.getElementById('edit-claim-amount').value = claim.amountPaid;
  document.getElementById('edit-claim-submission').value = claim.submissionType || 'provider';
  document.getElementById('edit-claim-payout').value = claim.payoutMethod || 'direct_deposit';
  document.getElementById('edit-claim-superbill').value = claim.superbillStatus || 'have';
  document.getElementById('edit-claim-stage').value = claim.stage;
  document.getElementById('edit-claim-nextaction').value = claim.nextAction || '';
  document.getElementById('edit-claim-notes').value = claim.notes || '';

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function submitEditClaim(e) {
  e.preventDefault();
  if (!editingClaimId) return;

  const date = document.getElementById('edit-claim-date').value;
  const provider = document.getElementById('edit-claim-provider').value.trim();
  const amountPaid = parseFloat(document.getElementById('edit-claim-amount').value) || 0;
  const submissionType = document.getElementById('edit-claim-submission').value;
  const payoutMethod = document.getElementById('edit-claim-payout').value;
  const superbillStatus = document.getElementById('edit-claim-superbill').value;
  const stage = document.getElementById('edit-claim-stage').value;
  const nextAction = document.getElementById('edit-claim-nextaction').value.trim();
  const notes = document.getElementById('edit-claim-notes').value.trim();

  storage.updateClaim(editingClaimId, {
    date,
    provider,
    amountPaid,
    expectedRecovery: amountPaid * 0.7,
    submissionType,
    payoutMethod,
    superbillStatus,
    stage,
    nextAction,
    notes,
    inPortal: (stage === 'with_included_health' || stage === 'check_due' || stage === 'settled'),
    inBank: (stage === 'settled')
  });

  closeAllModals();
  if (typeof showToast === 'function') showToast('Claim updated.');
  renderClaimsPage();
}

function updateClaimsHeaderBadge(count) {
  const badge = document.getElementById('domain-claims-badge');
  if (!badge) return;
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}
