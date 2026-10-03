/* ==========================================================================
   Book of Life / Life OS - Medical Claims & Recovery Tracker Page
   ========================================================================== */

let activeClaimsFilter = (() => {
  try {
    const s = localStorage.getItem('BOL_CLAIMS_FILTER');
    if (s) return s;
  } catch (e) {}
  return 'all';
})();
let editingClaimId = null;
let isClaimOptionsDrawerOpen = false;

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
      amountPaid: document.getElementById('claim-amount-input')?.value || '',
      submissionType: document.getElementById('claim-submission-select')?.value || 'provider',
      payoutMethod: document.getElementById('claim-payout-select')?.value || 'direct_deposit',
      stage: document.getElementById('claim-stage-select')?.value || 'with_included_health',
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

function renderClaimsPage() {
  const container = document.getElementById('bunker-subview-frame') || document.getElementById('daily-sheet-container');
  if (!container) return;

  const stats = storage.getClaimsStats();
  const allClaims = storage.getClaims();

  // Update header badge
  updateClaimsHeaderBadge(stats.actionNeededCount);

  // Filter claims
  let filteredClaims = allClaims;
  if (activeClaimsFilter !== 'all') {
    filteredClaims = allClaims.filter(c => c.stage === activeClaimsFilter);
  }

  // Calculate counts for filters
  const counts = {
    all: allClaims.length,
    with_included_health: allClaims.filter(c => c.stage === 'with_included_health').length,
    check_due: allClaims.filter(c => c.stage === 'check_due').length,
    ready_to_send: allClaims.filter(c => c.stage === 'ready_to_send').length,
    need_superbill: allClaims.filter(c => c.stage === 'need_superbill').length,
    settled: allClaims.filter(c => c.stage === 'settled').length
  };

  const todayIso = formatDateIso(new Date());
  const draft = getClaimDraft();
  const formDate = (draft && draft.date) ? draft.date : todayIso;
  const formProvider = (draft && draft.provider) ? draft.provider : '';
  const formAmount = (draft && draft.amountPaid) ? draft.amountPaid : '';
  const formSubmission = (draft && draft.submissionType) ? draft.submissionType : 'provider';
  const formPayout = (draft && draft.payoutMethod) ? draft.payoutMethod : 'direct_deposit';
  const formStage = (draft && draft.stage) ? draft.stage : 'with_included_health';
  const formSuperbill = (draft && draft.superbillStatus) ? draft.superbillStatus : 'have';
  const formNextAction = (draft && draft.nextAction) ? draft.nextAction : 'Provider submitted claim — waiting on insurance EOB';

  const isDrawerOpen = isClaimOptionsDrawerOpen || formSubmission === 'self' || formStage !== 'with_included_health';

  container.innerHTML = `
    <div class="claims-container">
      
      <!-- 1. Hero & Summary Header -->
      <div class="claims-hero-card">
        <div class="claims-hero-top">
          <div class="claims-hero-title-group">
            <h2>
              <i data-lucide="receipt" style="color:var(--primary);width:22px;height:22px;"></i>
              Out-of-Network Claims &amp; Recovery
            </h2>
            <p>Personal Finance Sub-system • Track out-of-pocket costs, courtesy filings &amp; insurance payouts.</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="claims-hero-btn" onclick="openIncludedHealthExportModal()" title="Copy formatted summary to paste into Included Health">
              <i data-lucide="copy" style="width:14px;height:14px;"></i>
              <span>Copy for Included Health</span>
            </button>
            <button class="claims-hero-btn" style="background:var(--bg-surface);color:var(--text-secondary);border-color:var(--border-light);" onclick="storage.exportClaimsCSV();showToast('CSV downloaded!')" title="Download claims as CSV spreadsheet">
              <i data-lucide="download" style="width:14px;height:14px;"></i>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <!-- 3 Quick Metrics at a Glance -->
        <div class="claims-metrics-grid">
          <div class="claims-metric-box highlight">
            <span class="metric-label">Pending Recovery</span>
            <span class="metric-value">$${stats.totalPendingRecovery.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span class="metric-sub">Total cash floating out-of-pocket</span>
          </div>
          <div class="claims-metric-box">
            <span class="metric-label">Action Needed (You)</span>
            <span class="metric-value" style="color:${stats.actionNeededCount > 0 ? 'var(--warning)' : 'var(--text-primary)'}">
              ${stats.actionNeededCount} ${stats.actionNeededCount === 1 ? 'Claim' : 'Claims'}
            </span>
            <span class="metric-sub">Superbills missing or ready to send</span>
          </div>
          <div class="claims-metric-box">
            <span class="metric-label">In Progress (Ins / Mail)</span>
            <span class="metric-value" style="color:var(--info)">
              ${stats.withIncludedHealthCount + stats.checkDueCount} ${stats.withIncludedHealthCount + stats.checkDueCount === 1 ? 'Claim' : 'Claims'}
            </span>
            <span class="metric-sub">Under review or check in mail/ACH</span>
          </div>
        </div>
      </div>

      <!-- 2. Quick Add New Claim Card (Option 1: Streamlined Fast Log with Smart Defaults) -->
      <div class="claims-add-card">
        <div class="claims-card-header">
          <div class="claims-card-title">
            <i data-lucide="plus-circle" style="color:var(--primary);width:16px;height:16px;"></i>
            <span>Quick Log Medical Service</span>
          </div>
          <span style="font-size:0.75rem;color:var(--text-muted);">Fast, smart defaults.</span>
        </div>

        <form id="quick-add-claim-form" onsubmit="handleQuickAddClaim(event)">
          <!-- Primary 1-Row Grid -->
          <div class="claims-fast-row">
            <div class="form-group form-group-provider" style="margin-bottom:0;">
              <label class="form-label" style="font-size:0.70rem;">Provider / Doctor</label>
              <input type="text" class="form-input" id="claim-provider-input" value="${formProvider}" oninput="saveClaimDraft()" placeholder="e.g. Dr. Adams, Physical Therapy" required>
            </div>
            <div class="form-group form-group-amount" style="margin-bottom:0;">
              <label class="form-label" style="font-size:0.70rem;">Amount ($)</label>
              <input type="number" step="0.01" min="0" class="form-input" id="claim-amount-input" value="${formAmount}" oninput="saveClaimDraft()" placeholder="250.00" required>
            </div>
            <div class="form-group form-group-date" style="margin-bottom:0;">
              <label class="form-label" style="font-size:0.70rem;">Date</label>
              <input type="date" class="form-input" id="claim-date-input" value="${formDate}" oninput="saveClaimDraft()" onchange="saveClaimDraft()" required>
            </div>
            <div class="form-group form-group-btn" style="margin-bottom:0;">
              <button type="submit" class="btn btn-primary claims-fast-add-btn">
                <i data-lucide="plus" style="width:14px;height:14px;"></i>
                <span>Add</span>
              </button>
            </div>
          </div>

          <!-- Discreet Toggle for More Options -->
          <button type="button" class="claims-options-toggle" onclick="toggleClaimOptionsDrawer()" id="claims-options-toggle-btn">
            <span id="claims-options-toggle-text">${isDrawerOpen ? '▴ Hide extra options' : '▾ More options (Filing, Payout, Notes)'}</span>
          </button>

          <!-- Drawer for Advanced Options -->
          <div class="claims-options-drawer ${isDrawerOpen ? 'open' : ''}" id="claims-options-drawer">
            <div class="claims-drawer-grid">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:0.70rem;">Who Submits Claim?</label>
                <select class="form-select" id="claim-submission-select" onchange="handleSubmissionTypeChange(this.value)">
                  <option value="provider" ${formSubmission === 'provider' ? 'selected' : ''}>🏢 Provider Submits (Courtesy)</option>
                  <option value="self" ${formSubmission === 'self' ? 'selected' : ''}>👤 I / Included Health Submit</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:0.70rem;">Expected Payout</label>
                <select class="form-select" id="claim-payout-select" onchange="handlePayoutMethodChange(this.value)">
                  <option value="direct_deposit" ${formPayout === 'direct_deposit' ? 'selected' : ''}>🏦 Direct Deposit (Monarch)</option>
                  <option value="check" ${formPayout === 'check' ? 'selected' : ''}>✉️ Mailed Paper Check</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:0.70rem;">Current Stage</label>
                <select class="form-select" id="claim-stage-select" onchange="handleStageSelectChange(this.value)">
                  <option value="with_included_health" ${formStage === 'with_included_health' ? 'selected' : ''}>🔵 Pending Insurance</option>
                  <option value="check_due" ${formStage === 'check_due' ? 'selected' : ''}>🟢 Check / Deposit Due</option>
                  <option value="ready_to_send" ${formStage === 'ready_to_send' ? 'selected' : ''}>🟡 Send to Included Health</option>
                  <option value="need_superbill" ${formStage === 'need_superbill' ? 'selected' : ''}>🔴 Need Superbill</option>
                  <option value="settled" ${formStage === 'settled' ? 'selected' : ''}>⚪ Settled &amp; Reconciled</option>
                </select>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr;gap:10px;margin-top:10px;">
              <div class="form-group" id="claim-superbill-group" style="display:${formSubmission === 'self' ? 'block' : 'none'};margin-bottom:0;">
                <label class="form-label" style="font-size:0.70rem;">Superbill Status</label>
                <select class="form-select" id="claim-superbill-select" onchange="handleSuperbillStatusChange(this.value)">
                  <option value="have" ${formSuperbill === 'have' ? 'selected' : ''}>✅ Have Superbill / Invoice</option>
                  <option value="need" ${formSuperbill === 'need' ? 'selected' : ''}>❌ Need Superbill from Office</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:0.70rem;">Next Action (Immediate step)</label>
                <input type="text" class="form-input" id="claim-nextaction-input" value="${formNextAction}" oninput="saveClaimDraft()">
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- 3. Weekly Maintenance Routine Reminder -->
      <div class="claims-routine-card">
        <div class="claims-routine-icon">
          <i data-lucide="calendar-clock" style="width:20px;height:20px;"></i>
        </div>
        <div class="claims-routine-content">
          <h4>The 2-Minute Sunday Review (Tied to Monarch)</h4>
          <p>
            <strong>1. Provider Courtesy Claims:</strong> If insurance approved, switch to <em>Check/Deposit Due</em>.<br>
            <strong>2. Direct Deposit (ACH):</strong> Match incoming deposit in Monarch → Click <strong>Mark Settled</strong>.<br>
            <strong>3. Paper Check:</strong> Mobile-deposit check when received in mail → Click <strong>Mark Settled</strong>.<br>
            <strong>4. Self-File / Included Health:</strong> Batch send any superbills via <strong>Copy for Included Health</strong>.
          </p>
        </div>
      </div>

      <!-- 4. Filter Navigation Pills -->
      <div class="claims-filter-bar">
        <button class="claims-filter-pill ${activeClaimsFilter === 'all' ? 'active' : ''}" onclick="setClaimsFilter('all')">
          All (${counts.all})
        </button>
        <button class="claims-filter-pill ${activeClaimsFilter === 'with_included_health' ? 'active' : ''}" onclick="setClaimsFilter('with_included_health')">
          <span>🔵</span> Pending Insurance (${counts.with_included_health})
        </button>
        <button class="claims-filter-pill ${activeClaimsFilter === 'check_due' ? 'active' : ''}" onclick="setClaimsFilter('check_due')">
          <span>🟢</span> Check / Deposit Due (${counts.check_due})
        </button>
        <button class="claims-filter-pill ${activeClaimsFilter === 'ready_to_send' ? 'active' : ''}" onclick="setClaimsFilter('ready_to_send')">
          <span>🟡</span> Ready to Send (${counts.ready_to_send})
        </button>
        <button class="claims-filter-pill ${activeClaimsFilter === 'need_superbill' ? 'active' : ''}" onclick="setClaimsFilter('need_superbill')">
          <span>🔴</span> Needs Superbill (${counts.need_superbill})
        </button>
        <button class="claims-filter-pill ${activeClaimsFilter === 'settled' ? 'active' : ''}" onclick="setClaimsFilter('settled')">
          <span>⚪</span> Settled (${counts.settled})
        </button>
      </div>

      <!-- 5. Claims Scannable Data Table (Option 3) -->
      <div class="claims-table-card">
        ${filteredClaims.length === 0 ? `
          <div class="claims-empty-card">
            <i data-lucide="inbox" style="width:36px;height:36px;"></i>
            <div style="font-weight:600;color:var(--text-primary);">No claims in this view</div>
            <div style="font-size:0.8rem;max-width:320px;">Use the quick add form above to log an out-of-network service, or switch filters.</div>
          </div>
        ` : `
          <div class="claims-table-wrapper">
            <table class="claims-data-table">
              <thead>
                <tr>
                  <th class="col-claim">Claim</th>
                  <th class="col-status">Status &amp; Next Step</th>
                  <th class="col-amount text-right">Amount</th>
                  <th class="col-actions text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filteredClaims.map(claim => renderClaimRowHtml(claim)).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>

    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

/**
 * Render single claim table row HTML (Option 3: Scannable Data Table)
 */
function renderClaimRowHtml(claim) {
  const stageMeta = CLAIM_STAGES[claim.stage] || {
    id: claim.stage,
    label: claim.stage,
    emoji: '⚪',
    defaultAction: '',
    actor: 'Unknown'
  };

  const formattedDate = parseDateIso(claim.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isProviderSubmits = (claim.submissionType === 'provider' || !claim.submissionType);
  const isCheckPayout = (claim.payoutMethod === 'check');
  const isSuperbillHave = (claim.superbillStatus === 'have');
  const isSettled = (claim.stage === 'settled');

  // Determine actor for the Next Step
  let actorName = stageMeta.actor;
  if (claim.stage === 'check_due') {
    actorName = isCheckPayout ? 'Mailbox / Bank' : 'Monarch';
  } else if (claim.stage === 'with_included_health') {
    actorName = isProviderSubmits ? 'Insurance' : 'Included Health';
  }

  const nextStepText = claim.nextAction || (typeof getDefaultNextAction === 'function' 
    ? getDefaultNextAction(claim.stage, claim.payoutMethod, claim.submissionType) 
    : stageMeta.defaultAction);

  return `
    <tr class="claim-table-row claim-stage-${claim.stage} ${isSettled ? 'is-settled' : 'is-active'}" id="claim-row-${claim.id}">
      <!-- 1. Claim (Provider & Date & Badges) -->
      <td class="cell-claim">
        <div class="claim-provider-name">${escapeHtml(claim.provider)}</div>
        <div class="claim-sub-tags">
          <span class="claim-date-text">${formattedDate}</span>
          <span class="claim-sub-dot">•</span>
          <span class="claim-sub-tag">${isProviderSubmits ? '🏢 Provider' : '👤 Included Health'}</span>
          <span class="claim-sub-dot">•</span>
          <span class="claim-sub-tag">${isCheckPayout ? '✉️ Check' : '🏦 ACH'}</span>
          ${!isProviderSubmits ? `
            <span class="claim-sub-dot">•</span>
            <button class="claim-superbill-inline ${isSuperbillHave ? 'have' : 'need'}" onclick="toggleClaimSuperbill('${claim.id}')" title="Toggle superbill">
              ${isSuperbillHave ? '✓ Superbill' : '⚠️ Need Superbill'}
            </button>
          ` : ''}
          ${claim.notes ? `
            <span class="claim-notes-preview" title="${escapeHtml(claim.notes)}">💬 ${escapeHtml(claim.notes.length > 24 ? claim.notes.substring(0, 21) + '...' : claim.notes)}</span>
          ` : ''}
        </div>
      </td>

      <!-- 2. Status & Next Step -->
      <td class="cell-status">
        <div class="stage-select-wrap">
          <select class="stage-pill ${claim.stage}" 
                  onchange="quickUpdateClaimStage('${claim.id}', this.value)"
                  title="Change stage">
            <option value="with_included_health" ${claim.stage === 'with_included_health' ? 'selected' : ''}>🔵 Pending Insurance</option>
            <option value="check_due" ${claim.stage === 'check_due' ? 'selected' : ''}>🟢 Check / Deposit Due</option>
            <option value="ready_to_send" ${claim.stage === 'ready_to_send' ? 'selected' : ''}>🟡 Send to Included Health</option>
            <option value="need_superbill" ${claim.stage === 'need_superbill' ? 'selected' : ''}>🔴 Need Superbill</option>
            <option value="settled" ${claim.stage === 'settled' ? 'selected' : ''}>⚪ Settled</option>
          </select>
        </div>
        ${isSettled ? `
          <div class="settled-reconciled-hint">✓ Reconciled in Monarch</div>
        ` : `
          <div class="active-next-action" title="${escapeHtml(nextStepText)}">
            <span class="next-action-arrow">↳</span>
            <span class="next-action-text">${escapeHtml(nextStepText)}</span>
          </div>
        `}
      </td>

      <!-- 3. Amount -->
      <td class="cell-amount text-right">
        <span class="claim-amount-mono">$${(claim.amountPaid || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </td>

      <!-- 4. Actions -->
      <td class="cell-actions text-right">
        <div class="claim-actions-cluster">
          ${!isSettled ? `
            <button class="claim-row-action-btn btn-settle" onclick="quickSettleClaim('${claim.id}')" title="Mark Settled in Monarch">
              <i data-lucide="check" style="width:13px;height:13px;"></i>
            </button>
          ` : `
            <button class="claim-row-action-btn btn-reopen" onclick="quickUpdateClaimStage('${claim.id}', 'with_included_health')" title="Reopen Claim">
              <i data-lucide="rotate-ccw" style="width:12px;height:12px;"></i>
            </button>
          `}
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
 * Toggle Options Drawer in Quick Add Form
 */
function toggleClaimOptionsDrawer() {
  isClaimOptionsDrawerOpen = !isClaimOptionsDrawerOpen;
  const drawer = document.getElementById('claims-options-drawer');
  const text = document.getElementById('claims-options-toggle-text');
  if (drawer) drawer.classList.toggle('open', isClaimOptionsDrawerOpen);
  if (text) {
    text.innerText = isClaimOptionsDrawerOpen ? '▴ Hide extra options' : '▾ More options (Filing, Payout, Notes)';
  }
}

/**
 * Form changes: auto-fill next action & toggle fields
 */
function handleSubmissionTypeChange(val) {
  const sbGroup = document.getElementById('claim-superbill-group');
  const stageSelect = document.getElementById('claim-stage-select');
  const payoutSelect = document.getElementById('claim-payout-select');
  const actionInput = document.getElementById('claim-nextaction-input');

  const payoutVal = payoutSelect ? payoutSelect.value : 'direct_deposit';

  if (val === 'provider') {
    if (sbGroup) sbGroup.style.display = 'none';
    if (stageSelect) stageSelect.value = 'with_included_health';
    if (actionInput) actionInput.value = getDefaultNextAction('with_included_health', payoutVal, 'provider');
  } else {
    if (sbGroup) sbGroup.style.display = 'block';
    const sbVal = document.getElementById('claim-superbill-select')?.value || 'have';
    const newStage = (sbVal === 'need') ? 'need_superbill' : 'ready_to_send';
    if (stageSelect) stageSelect.value = newStage;
    if (actionInput) actionInput.value = getDefaultNextAction(newStage, payoutVal, 'self');
  }
  saveClaimDraft();
}

function handlePayoutMethodChange(val) {
  const stageSelect = document.getElementById('claim-stage-select');
  const submissionSelect = document.getElementById('claim-submission-select');
  const actionInput = document.getElementById('claim-nextaction-input');
  if (actionInput && typeof getDefaultNextAction === 'function') {
    actionInput.value = getDefaultNextAction(
      stageSelect ? stageSelect.value : 'with_included_health',
      val,
      submissionSelect ? submissionSelect.value : 'provider'
    );
  }
  saveClaimDraft();
}

function handleStageSelectChange(val) {
  const payoutSelect = document.getElementById('claim-payout-select');
  const submissionSelect = document.getElementById('claim-submission-select');
  const actionInput = document.getElementById('claim-nextaction-input');
  if (actionInput && typeof getDefaultNextAction === 'function') {
    actionInput.value = getDefaultNextAction(
      val,
      payoutSelect ? payoutSelect.value : 'direct_deposit',
      submissionSelect ? submissionSelect.value : 'provider'
    );
  }
  saveClaimDraft();
}

function handleSuperbillStatusChange(val) {
  const stageSelect = document.getElementById('claim-stage-select');
  const actionInput = document.getElementById('claim-nextaction-input');
  const payoutSelect = document.getElementById('claim-payout-select');

  const payoutVal = payoutSelect ? payoutSelect.value : 'direct_deposit';

  if (val === 'need') {
    if (stageSelect) stageSelect.value = 'need_superbill';
    if (actionInput) actionInput.value = 'Request itemized superbill from provider';
  } else {
    if (stageSelect && stageSelect.value === 'need_superbill') {
      stageSelect.value = 'ready_to_send';
      if (actionInput) actionInput.value = 'Upload superbill to Included Health app';
    }
  }
  saveClaimDraft();
}

/**
 * Quick Add Claim Handler
 */
function handleQuickAddClaim(e) {
  e.preventDefault();
  const date = document.getElementById('claim-date-input')?.value;
  const provider = document.getElementById('claim-provider-input')?.value.trim();
  const amountPaid = parseFloat(document.getElementById('claim-amount-input')?.value);
  const submissionType = document.getElementById('claim-submission-select')?.value || 'provider';
  const payoutMethod = document.getElementById('claim-payout-select')?.value || 'direct_deposit';
  const superbillStatus = document.getElementById('claim-superbill-select')?.value || 'have';
  const stage = document.getElementById('claim-stage-select')?.value || 'with_included_health';
  const nextAction = document.getElementById('claim-nextaction-input')?.value.trim();

  if (!provider || isNaN(amountPaid) || amountPaid <= 0) {
    showToast('Please enter provider and a valid amount');
    return;
  }

  storage.addClaim({
    date,
    provider,
    amountPaid,
    submissionType,
    payoutMethod,
    superbillStatus,
    stage,
    nextAction
  });

  clearClaimDraft();
  isClaimOptionsDrawerOpen = false;

  // Reset inputs
  document.getElementById('claim-provider-input').value = '';
  document.getElementById('claim-amount-input').value = '';
  document.getElementById('claim-submission-select').value = 'provider';
  document.getElementById('claim-payout-select').value = 'direct_deposit';
  document.getElementById('claim-superbill-select').value = 'have';
  document.getElementById('claim-superbill-group').style.display = 'none';
  document.getElementById('claim-stage-select').value = 'with_included_health';
  document.getElementById('claim-nextaction-input').value = 'Provider submitted claim — waiting on insurance EOB';

  showToast(`Claim for "${provider}" added! (+5 XP)`);
  storage.addPoints(5);
  renderClaimsPage();
}

/**
 * Quick updates on card
 */
function quickUpdateClaimStage(claimId, newStage) {
  const claim = storage.getClaim(claimId);
  const payout = claim ? (claim.payoutMethod || 'direct_deposit') : 'direct_deposit';
  const sub = claim ? (claim.submissionType || 'provider') : 'provider';
  const nextAction = (typeof getDefaultNextAction === 'function') ? getDefaultNextAction(newStage, payout, sub) : '';

  storage.updateClaim(claimId, {
    stage: newStage,
    nextAction: nextAction
  });

  if (newStage === 'settled') {
    triggerConfetti();
    showToast('🎉 Claim settled! Reconciled in Monarch.');
  } else {
    showToast(`Stage updated to ${CLAIM_STAGES[newStage]?.label || newStage}`);
  }
  renderClaimsPage();
}

function toggleClaimSuperbill(claimId) {
  const claim = storage.getClaim(claimId);
  if (!claim) return;

  const nextStatus = (claim.superbillStatus === 'have') ? 'need' : 'have';
  let patch = { superbillStatus: nextStatus };
  if (nextStatus === 'have' && claim.stage === 'need_superbill') {
    patch.stage = 'ready_to_send';
    patch.nextAction = 'Upload superbill to Included Health app';
  } else if (nextStatus === 'need') {
    patch.stage = 'need_superbill';
    patch.nextAction = 'Request itemized superbill from provider';
  }
  storage.updateClaim(claimId, patch);
  showToast(nextStatus === 'have' ? '✅ Superbill marked as attached!' : '❌ Superbill marked as needed');
  renderClaimsPage();
}

function quickSettleClaim(claimId) {
  quickUpdateClaimStage(claimId, 'settled');
}

function confirmDeleteClaim(claimId) {
  const claim = storage.getClaim(claimId);
  if (!claim) return;
  if (confirm(`Delete claim for "${claim.provider}"?`)) {
    storage.deleteClaim(claimId);
    showToast('Claim deleted.');
    renderClaimsPage();
  }
}

/**
 * Included Health Export Modal & Copy
 */
function openIncludedHealthExportModal() {
  const claims = storage.getClaims();
  const actionable = claims.filter(c => c.stage === 'ready_to_send' || c.stage === 'need_superbill' || c.stage === 'with_included_health');
  
  let formattedText = generateIncludedHealthSummary(actionable.length > 0 ? actionable : claims);

  const modal = document.getElementById('modal-export-claims');
  if (!modal) return;

  const body = document.getElementById('export-claims-body');
  if (body) {
    body.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:14px;">
        <p style="font-size:0.84rem;color:var(--text-secondary);line-height:1.45;">
          Copy this structured summary to message your <strong>Included Health Care Coordinator / Billing Advocate</strong>. They can track EOBs, follow up on provider submissions, or file superbills.
        </p>
        <textarea class="export-text-preview" id="export-claims-textarea" readonly>${formattedText}</textarea>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <span style="font-size:0.75rem;color:var(--text-muted);">
            Ready to paste directly into the Included Health app message thread.
          </span>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary btn-sm" onclick="closeAllModals()">Close</button>
            <button class="btn btn-primary btn-sm" onclick="copyClaimsExportToClipboard()">
              <i data-lucide="copy" style="width:14px;height:14px;"></i>
              <span>Copy to Clipboard</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function generateIncludedHealthSummary(claimsList) {
  let total = 0;
  claimsList.forEach(c => total += (c.amountPaid || 0));

  let text = `Hi Included Health Team,\n\n`;
  text += `Here is an update on my current out-of-network medical services for claims tracking and reimbursement assistance:\n\n`;

  claimsList.forEach((c, idx) => {
    const dStr = parseDateIso(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const isProv = (c.submissionType === 'provider');
    const isCheck = (c.payoutMethod === 'check');
    const hasSb = (c.superbillStatus === 'have');

    text += `${idx + 1}. Provider: ${c.provider}\n`;
    text += `   - Date of Service: ${dStr}\n`;
    text += `   - Bill / Charge Amount: $${(c.amountPaid || 0).toFixed(2)}\n`;
    text += `   - Submission: ${isProv ? 'Provider Submitted Directly (Courtesy)' : (hasSb ? 'Superbill Available (Please submit)' : 'Pending Superbill')}\n`;
    text += `   - Expected Reimbursement: ${isCheck ? 'Mailed Paper Check' : 'Direct Deposit (ACH)'}\n`;
    text += `   - Current Stage: ${CLAIM_STAGES[c.stage]?.label || c.stage}\n`;
    if (c.notes) text += `   - Notes: ${c.notes}\n`;
    text += `\n`;
  });

  text += `Total Out-of-Pocket Value: $${total.toFixed(2)}\n\n`;
  text += `Please confirm if you have visibility into the provider-submitted claims on insurance, and let me know if any EOB or documentation is needed. Thank you!`;

  return text;
}

function copyClaimsExportToClipboard() {
  const textarea = document.getElementById('export-claims-textarea');
  if (!textarea) return;
  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(() => {
    showToast('📋 Summary copied to clipboard! Paste into Included Health.');
    closeAllModals();
  }).catch(() => {
    document.execCommand('copy');
    showToast('📋 Summary copied to clipboard!');
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
    submissionType,
    payoutMethod,
    superbillStatus,
    stage,
    nextAction,
    notes
  });

  closeAllModals();
  showToast('Claim updated.');
  renderClaimsPage();
}

/**
 * Helper to update header badge
 */
function updateClaimsHeaderBadge(count) {
  const badge = document.getElementById('header-claims-badge');
  if (!badge) return;
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'inline-flex';
    badge.title = `${count} claims requiring action`;
  } else {
    badge.style.display = 'none';
  }
}
