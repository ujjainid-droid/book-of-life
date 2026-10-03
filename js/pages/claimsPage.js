/* ==========================================================================
   Book of Life / Life OS - Medical Claims & Recovery Tracker Page
   Theme: Nordic Emerald (Personal Finance)
   Architecture: 3-Way Match (Superbill ➔ Insurance Portal ➔ Bank Deposit)
   ========================================================================== */

let activeClaimsFilter = (() => {
  try {
    const s = localStorage.getItem('BOL_CLAIMS_FILTER');
    if (s) return s;
  } catch (e) {}
  return 'all';
})();

let editingClaimId = null;
let quickAddSubmissionType = 'provider'; // 'provider' | 'self'
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

  // Auto-set clean next action default based on lane
  const nextActionInput = document.getElementById('claim-nextaction-input');
  if (nextActionInput && !nextActionInput.value.trim()) {
    nextActionInput.value = (type === 'provider')
      ? 'Provider filing claim — check portal for confirmation'
      : 'Upload superbill to Included Health';
  }
  saveClaimDraft();
}

function renderClaimsPage(targetContainer) {
  const container = targetContainer || document.getElementById('finance-subview-container') || document.getElementById('bunker-subview-frame') || document.getElementById('daily-sheet-container');
  if (!container) return;

  const stats = storage.getClaimsStats();
  const allClaims = storage.getClaims();

  // Update header badge
  updateClaimsHeaderBadge(stats.actionNeededCount);

  // Filter claims
  let filteredClaims = allClaims;
  if (activeClaimsFilter === 'self') {
    filteredClaims = allClaims.filter(c => c.submissionType === 'self');
  } else if (activeClaimsFilter === 'provider') {
    filteredClaims = allClaims.filter(c => c.submissionType === 'provider' || !c.submissionType);
  } else if (activeClaimsFilter === 'action' || activeClaimsFilter === 'action_needed') {
    filteredClaims = allClaims.filter(c => c.stage === 'need_superbill' || c.stage === 'ready_to_send' || c.stage === 'check_due');
  } else if (activeClaimsFilter === 'settled') {
    filteredClaims = allClaims.filter(c => c.stage === 'settled');
  } else if (activeClaimsFilter !== 'all') {
    filteredClaims = allClaims.filter(c => c.stage === activeClaimsFilter);
  }

  // Calculate counts for filters
  const counts = {
    all: allClaims.length,
    self: allClaims.filter(c => c.submissionType === 'self').length,
    provider: allClaims.filter(c => c.submissionType === 'provider' || !c.submissionType).length,
    actionNeeded: allClaims.filter(c => c.stage === 'need_superbill' || c.stage === 'ready_to_send' || c.stage === 'check_due').length,
    settled: allClaims.filter(c => c.stage === 'settled').length
  };

  const todayIso = formatDateIso(new Date());
  const draft = getClaimDraft();
  const formDate = (draft && draft.date) ? draft.date : todayIso;
  const formProvider = (draft && draft.provider) ? draft.provider : '';
  const formAmount = (draft && draft.amountPaid) ? draft.amountPaid : '';
  if (draft && draft.submissionType) quickAddSubmissionType = draft.submissionType;
  const formPayout = (draft && draft.payoutMethod) ? draft.payoutMethod : 'direct_deposit';
  const formStage = (draft && draft.stage) ? draft.stage : (quickAddSubmissionType === 'provider' ? 'with_included_health' : 'ready_to_send');
  const formSuperbill = (draft && draft.superbillStatus) ? draft.superbillStatus : 'have';
  const formNextAction = (draft && draft.nextAction) ? draft.nextAction : (quickAddSubmissionType === 'provider' ? 'Provider filing claim — check portal for confirmation' : 'Upload superbill to Included Health');

  container.innerHTML = `
    <div class="claims-container">
      
      <!-- 1. Hero Summary Header (Nordic Minimalist) -->
      <div class="claims-hero-card">
        <div class="claims-hero-top">
          <div class="claims-hero-title-group">
            <h2>
              <i data-lucide="shield-check" style="color:var(--primary);width:22px;height:22px;"></i>
              Medical Claims &amp; Reimbursement
            </h2>
            <p>3-Way Match Reconciliation: Superbill &bull; Insurance Portal &bull; Bank Deposit</p>
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

        <!-- 3 Quick-Glance Metric Cards -->
        <div class="claims-metrics-grid">
          <div class="claims-metric-box highlight">
            <span class="metric-label">Pending Recovery</span>
            <span class="metric-value">$${stats.totalPendingRecovery.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span class="metric-sub">Out-of-pocket cash floating</span>
          </div>
          <div class="claims-metric-box">
            <span class="metric-label">Action Needed</span>
            <span class="metric-value" style="color:${counts.actionNeeded > 0 ? '#DC2626' : 'var(--primary)'}">
              ${counts.actionNeeded} ${counts.actionNeeded === 1 ? 'Claim' : 'Claims'}
            </span>
            <span class="metric-sub">Superbill missing or needs filing</span>
          </div>
          <div class="claims-metric-box">
            <span class="metric-label">Reconciled &amp; Paid</span>
            <span class="metric-value" style="color:var(--primary);">
              $${stats.totalSettled.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span class="metric-sub">${counts.settled} claims deposited in bank</span>
          </div>
        </div>
      </div>

      <!-- 2. Streamlined Fast Log Bar (Zero Clutter) -->
      <div class="claims-add-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
          <!-- 2-Way Submission Lane Switcher -->
          <div class="claims-lane-switcher" style="margin-bottom: 0;">
            <button type="button" id="lane-btn-provider" class="claims-lane-btn ${quickAddSubmissionType === 'provider' ? 'active' : ''}" onclick="setQuickAddSubmissionType('provider')">
              🏥 Provider Submits Directly
            </button>
            <button type="button" id="lane-btn-self" class="claims-lane-btn ${quickAddSubmissionType === 'self' ? 'active' : ''}" onclick="setQuickAddSubmissionType('self')">
              📤 I Submit Superbill
            </button>
          </div>
          <span style="font-size:0.74rem; color:var(--text-muted);">
            ${quickAddSubmissionType === 'provider' ? 'Doctor files claim directly to insurer' : 'Pay doctor &bull; Upload superbill to Included Health'}
          </span>
        </div>

        <form id="quick-add-claim-form" onsubmit="handleQuickAddClaim(event)">
          <!-- Clean 1-Row Fast Log -->
          <div class="claims-fast-row">
            <div class="form-group form-group-provider" style="margin-bottom:0;">
              <input type="text" class="form-input" id="claim-provider-input" value="${formProvider}" oninput="saveClaimDraft()" placeholder="Provider / Specialist (e.g. Dr. Barness)" required>
            </div>
            <div class="form-group form-group-amount" style="margin-bottom:0;">
              <input type="number" step="0.01" min="0" class="form-input" id="claim-amount-input" value="${formAmount}" oninput="saveClaimDraft()" placeholder="Amount ($)" required>
            </div>
            <div class="form-group form-group-date" style="margin-bottom:0;">
              <input type="date" class="form-input" id="claim-date-input" value="${formDate}" oninput="saveClaimDraft()" onchange="saveClaimDraft()" required>
            </div>
            <div class="form-group form-group-btn" style="margin-bottom:0;">
              <button type="submit" class="btn btn-primary claims-fast-add-btn">
                <i data-lucide="plus" style="width:14px;height:14px;"></i>
                <span>Log</span>
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

      <!-- 3. Clean Filter Navigation Pills -->
      <div class="claims-filter-bar">
        <button class="claims-filter-pill ${activeClaimsFilter === 'all' ? 'active' : ''}" onclick="setClaimsFilter('all')">
          All Claims (${counts.all})
        </button>
        <button class="claims-filter-pill ${activeClaimsFilter === 'self' ? 'active' : ''}" onclick="setClaimsFilter('self')">
          <span>📤</span> I Submit (${counts.self})
        </button>
        <button class="claims-filter-pill ${activeClaimsFilter === 'provider' ? 'active' : ''}" onclick="setClaimsFilter('provider')">
          <span>🏥</span> Provider Submits (${counts.provider})
        </button>
        <button class="claims-filter-pill ${activeClaimsFilter === 'action' ? 'active' : ''}" onclick="setClaimsFilter('action')">
          <span>⚠️</span> Action Needed (${counts.actionNeeded})
        </button>
        <button class="claims-filter-pill ${activeClaimsFilter === 'settled' ? 'active' : ''}" onclick="setClaimsFilter('settled')">
          <span>✓</span> Reconciled &amp; Paid (${counts.settled})
        </button>
      </div>

      <!-- 4. Scannable 3-Way Match Data Table -->
      <div class="claims-table-card">
        ${filteredClaims.length === 0 ? `
          <div class="claims-empty-card">
            <i data-lucide="inbox" style="width:36px;height:36px;"></i>
            <div style="font-weight:600;color:var(--text-primary);">No claims in this view</div>
            <div style="font-size:0.8rem;max-width:320px;">Use the quick add bar above to log a charge, or switch filters.</div>
          </div>
        ` : `
          <div class="claims-table-wrapper">
            <table class="claims-data-table">
              <thead>
                <tr>
                  <th class="col-claim">Claim &amp; Lane</th>
                  <th class="col-status">3-Way Match Checkpoints</th>
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

  // Determine 3-Way Match States
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
    nextStepText = 'Superbill on hand — submit to Included Health';
  } else if (!inPortal && isProviderSubmits) {
    nextStepText = 'Provider submitted — check portal for claim number';
  } else if (inPortal && !inBank) {
    nextStepText = claim.payoutMethod === 'check' ? 'Claim approved — awaiting check in mail' : 'Claim in review / awaiting direct deposit';
  }

  return `
    <tr class="claim-table-row claim-stage-${claim.stage} ${isSettled ? 'is-settled' : 'is-active'}" id="claim-row-${claim.id}">
      <!-- 1. Claim & Lane -->
      <td class="cell-claim">
        <div class="claim-provider-name">${escapeHtml(claim.provider)}</div>
        <div class="claim-sub-tags">
          <span class="claim-date-text">${formattedDate}</span>
          <span class="claim-sub-dot">•</span>
          <span class="claim-meta-tag ${isProviderSubmits ? 'tag-provider' : 'tag-self'}" style="font-size: 0.66rem; padding: 1px 6px;">
            ${isProviderSubmits ? '🏥 Provider Files' : '📤 I Submit'}
          </span>
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
          <span class="next-action-text" style="color: ${isSettled ? 'var(--text-muted)' : 'var(--primary)'}; font-weight: ${isSettled ? '400' : '600'};">
            ${escapeHtml(nextStepText)}
          </span>
        </div>
      </td>

      <!-- 3. Amount -->
      <td class="cell-amount text-right">
        <span class="claim-amount-mono">$${(claim.amountPaid || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
      patch.nextAction = (claim.submissionType === 'provider') ? 'Provider filed claim — check portal' : 'Upload superbill to Included Health';
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
    // Settle claim
    const promptAmount = prompt(`Deposit received for ${claim.provider}:`, (claim.reimbursedAmount || claim.amountPaid || '0.00'));
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
    if (typeof showToast === 'function') showToast('🎉 Reconciled & deposited in bank!');
  } else {
    // Reopen
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
    : 'Upload superbill to Included Health';

  if (!provider || isNaN(amountPaid) || amountPaid <= 0) {
    if (typeof showToast === 'function') showToast('Please enter provider and a valid amount');
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
    nextAction,
    inPortal: (submissionType === 'provider'),
    inBank: false
  });

  clearClaimDraft();

  // Reset inputs
  document.getElementById('claim-provider-input').value = '';
  document.getElementById('claim-amount-input').value = '';

  if (typeof showToast === 'function') showToast(`Claim for "${provider}" logged! (+5 XP)`);
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
        <p style="font-size:0.84rem;color:var(--text-secondary);margin:0;">
          Below is your formatted claims brief for the Included Health team. Copy and paste this directly into your care team chat or email:
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
  let total = 0;
  claimsList.forEach(c => { total += (c.amountPaid || 0); });

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
    text += `   - Submission Lane: ${isProv ? 'Provider Submitted Directly' : (hasSb ? 'Superbill on Hand (Ready to submit)' : 'Pending Superbill from Provider')}\n`;
    text += `   - Reimbursement: ${isCheck ? 'Mailed Paper Check' : 'Direct Deposit (ACH)'}\n`;
    text += `   - 3-Way Match Status: Superbill [${hasSb ? 'YES' : 'NO'}], In Portal [${c.inPortal ? 'YES' : 'PENDING'}], In Bank [${c.inBank ? 'YES' : 'PENDING'}]\n`;
    if (c.notes) text += `   - Notes: ${c.notes}\n`;
    text += `\n`;
  });

  text += `Total Out-of-Pocket Value: $${total.toFixed(2)}\n\n`;
  text += `Please confirm visibility on the portal claims and let me know if any additional records or CPT codes are needed. Thank you!`;

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
