/* ==========================================================================
   Book of Life / Life OS - Medical Claims & Recovery Tracker Page
   Theme: Nordic Serene (Sea Glass Teal & Cool Lavender)
   Focus: Zero-Clutter, Immediate Clarity & Simple Fast Logging
   ========================================================================== */

let activeClaimsFilter = (() => {
  try {
    const s = localStorage.getItem('BOL_CLAIMS_FILTER');
    if (s) return s;
  } catch (e) {}
  return 'all';
})();

let isClaimsSettledOpen = false;
let editingClaimId = null;

function quickFillVisit(provider, amount, submissionType) {
  const pInput = document.getElementById('claim-provider-input');
  const aInput = document.getElementById('claim-amount-input');
  if (pInput) pInput.value = provider;
  if (aInput) aInput.value = amount.toFixed(2);
  const form = document.getElementById('quick-add-claim-form');
  if (form) form.dataset.submissionType = submissionType;
  if (pInput) pInput.focus();
}

function toggleClaimsSettledAccordion() {
  isClaimsSettledOpen = !isClaimsSettledOpen;
  renderClaimsPage();
}

function setClaimsFilter(filter) {
  activeClaimsFilter = filter;
  try {
    localStorage.setItem('BOL_CLAIMS_FILTER', filter);
  } catch (e) {}
  renderClaimsPage();
}

function renderClaimsPage(targetContainer) {
  const container = targetContainer || document.getElementById('finance-subview-container') || document.getElementById('bunker-subview-frame') || document.getElementById('daily-sheet-container');
  if (!container) return;

  const stats = storage.getClaimsStats();
  const allClaims = storage.getClaims();

  const activeClaimsList = allClaims.filter(c => c.stage !== 'settled');
  const settledClaimsList = allClaims.filter(c => c.stage === 'settled');

  const counts = {
    allActive: activeClaimsList.length,
    readyToSend: activeClaimsList.filter(c => c.stage === 'ready_to_send').length,
    missingDeposit: activeClaimsList.filter(c => c.stage === 'check_due').length,
    inFlight: activeClaimsList.filter(c => c.stage === 'with_included_health').length,
    settled: settledClaimsList.length
  };

  updateClaimsHeaderBadge(counts.allActive);

  let displayedActive = activeClaimsList;
  if (activeClaimsFilter === 'ready_to_send') {
    displayedActive = activeClaimsList.filter(c => c.stage === 'ready_to_send');
  } else if (activeClaimsFilter === 'check_due') {
    displayedActive = activeClaimsList.filter(c => c.stage === 'check_due');
  } else if (activeClaimsFilter === 'with_included_health') {
    displayedActive = activeClaimsList.filter(c => c.stage === 'with_included_health');
  }

  const todayIso = formatDateIso(new Date());

  container.innerHTML = `
    <div class="claims-container" style="max-width: 860px; margin: 0 auto; gap: 14px;">
      
      <!-- 1. Minimal Header -->
      <div class="claims-header-row">
        <div>
          <h2 class="claims-title">Medical Claims</h2>
          <p class="claims-subtitle">Track out-of-pocket visits from receipt to bank deposit.</p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="claims-copy-btn" onclick="openIncludedHealthExportModal()" title="Copy formatted summary of unfiled visits for Included Health">
            <i data-lucide="copy" style="width:13px;height:13px;"></i>
            <span>Copy for Included Health</span>
          </button>
          <button class="claims-copy-btn" onclick="storage.exportClaimsCSV();showToast('CSV downloaded!')" title="Export claims CSV">
            <i data-lucide="download" style="width:13px;height:13px;"></i>
            <span>Export</span>
          </button>
        </div>
      </div>

      <!-- 2. The 3 Dedicated Metric Widgets (Requested by User) -->
      <div class="claims-widgets-grid">
        
        <!-- Widget a: $ Pending Reimbursement -->
        <div class="claims-widget-card highlight">
          <div class="claims-widget-header">
            <span class="claims-widget-label">Pending Reimbursement</span>
            <span class="claims-widget-badge">Floating</span>
          </div>
          <div class="claims-widget-value">$${stats.totalPendingRecovery.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div class="claims-widget-sub">$${stats.totalFloatingSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} paid out-of-pocket</div>
        </div>

        <!-- Widget b: Number of Open Claims -->
        <div class="claims-widget-card" onclick="setClaimsFilter('all')" style="cursor: pointer;" title="Click to view all open claims">
          <div class="claims-widget-header">
            <span class="claims-widget-label">Open Claims</span>
            <span class="claims-widget-badge" style="background:rgba(139, 92, 246, 0.12); color:#7C3AED;">${counts.allActive} Active</span>
          </div>
          <div class="claims-widget-value" style="color:var(--text-primary);">${counts.allActive}</div>
          <div class="claims-widget-sub">Awaiting filing, review, or deposit</div>
        </div>

        <!-- Widget c: To File, Missing Deposits, In Flight -->
        <div class="claims-widget-card">
          <div class="claims-widget-header">
            <span class="claims-widget-label">Action Breakdown</span>
            <span class="claims-widget-sub" style="margin:0; font-size:0.7rem;">Click to filter</span>
          </div>
          <div class="claims-breakdown-row">
            <button type="button" class="claims-breakdown-chip ${activeClaimsFilter === 'ready_to_send' ? 'active' : ''}" onclick="setClaimsFilter('ready_to_send')">
              <span>📤 To File</span>
              <span class="chip-count" style="font-weight:700; color:var(--primary);">${counts.readyToSend}</span>
            </button>
            <button type="button" class="claims-breakdown-chip ${activeClaimsFilter === 'check_due' ? 'active' : ''}" onclick="setClaimsFilter('check_due')">
              <span style="color:#E11D48;"><i data-lucide="alert-circle" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:2px;"></i> Missing Deposits</span>
              <span class="chip-count" style="font-weight:700; color:#E11D48;">${counts.missingDeposit}</span>
            </button>
            <button type="button" class="claims-breakdown-chip ${activeClaimsFilter === 'with_included_health' ? 'active' : ''}" onclick="setClaimsFilter('with_included_health')">
              <span>⏳ In Flight</span>
              <span class="chip-count" style="font-weight:700; color:var(--text-secondary);">${counts.inFlight}</span>
            </button>
          </div>
        </div>

      </div>

      <!-- 3. Fast Log Visit (1-line + Quick Chips) -->
      <div class="claims-log-card">
        <div class="claims-log-header">
          <span class="claims-log-label">Log Future Visit</span>
          <div class="claims-quick-chips">
            <button type="button" class="quick-chip" onclick="quickFillVisit('Dr. Michael Barness', 300, 'self')">Dr. Barness ($300)</button>
            <button type="button" class="quick-chip" onclick="quickFillVisit('Mindsoother Therapy', 225, 'provider')">Mindsoother ($225)</button>
            <button type="button" class="quick-chip" onclick="quickFillVisit('Roseland Psychotherapy', 255, 'provider')">Roseland ($255)</button>
          </div>
        </div>
        <form class="claims-log-form" id="quick-add-claim-form" onsubmit="handleQuickAddClaim(event)">
          <input type="date" id="claim-date-input" value="${todayIso}" required>
          <input type="text" id="claim-provider-input" placeholder="Provider (e.g. Dr. Michael Barness)" required>
          <input type="number" step="0.01" min="0" id="claim-amount-input" placeholder="Amount ($)" required>
          <button type="submit" class="claims-submit-btn">
            <i data-lucide="plus" style="width:14px;height:14px;"></i>
            <span>Log Visit</span>
          </button>
        </form>
      </div>

      <!-- 4. Needs Resolution (Active Claims) -->
      <div style="display:flex; align-items:center; justify-content:space-between; margin-top:6px; flex-wrap:wrap; gap:8px;">
        <span style="font-size:0.86rem; font-weight:700; color:var(--text-primary);">
          Action Items &amp; In-Flight (${counts.allActive})
        </span>
        <div class="claims-filter-tabs">
          <button class="claims-filter-tab ${activeClaimsFilter === 'all' ? 'active' : ''}" onclick="setClaimsFilter('all')">
            All (${counts.allActive})
          </button>
          <button class="claims-filter-tab ${activeClaimsFilter === 'ready_to_send' ? 'active' : ''}" onclick="setClaimsFilter('ready_to_send')">
            📤 To File (${counts.readyToSend})
          </button>
          <button class="claims-filter-tab ${activeClaimsFilter === 'check_due' ? 'active' : ''}" onclick="setClaimsFilter('check_due')">
            <i data-lucide="alert-circle" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:2px;color:#E11D48;"></i> Missing Deposit (${counts.missingDeposit})
          </button>
          <button class="claims-filter-tab ${activeClaimsFilter === 'with_included_health' ? 'active' : ''}" onclick="setClaimsFilter('with_included_health')">
            ⏳ In-Flight (${counts.inFlight})
          </button>
        </div>
      </div>

      <!-- Active Claims Structured Cell Table -->
      <div class="claims-table-card">
        <div class="claims-table-wrapper">
          <table class="claims-cell-table">
            <thead>
              <tr>
                <th style="width:105px;">Date</th>
                <th>Provider</th>
                <th>Status / Next Move</th>
                <th class="text-right" style="width:90px;">Billed</th>
                <th class="text-right" style="width:110px;">Est. Recovery</th>
                <th class="text-right" style="width:130px;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${displayedActive.length === 0 ? `
                <tr>
                  <td colspan="6" style="text-align:center; padding:32px 16px; color:var(--text-muted); font-size:0.82rem;">
                    ✓ All clear in this view! No action items pending.
                  </td>
                </tr>
              ` : displayedActive.map(claim => renderClaimRowCellHtml(claim)).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 5. Quiet Resolved Accordion (Collapsed by Default) -->
      <div class="claims-resolved-accordion">
        <div class="claims-resolved-header" onclick="toggleClaimsSettledAccordion()">
          <div class="claims-resolved-title">
            <i data-lucide="${isClaimsSettledOpen ? 'chevron-down' : 'chevron-right'}" style="width:14px;height:14px;color:var(--primary);"></i>
            <span>Past Resolved Visits</span>
            <span class="resolved-count-pill">${counts.settled} claims &bull; $${stats.totalSettled.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} deposited</span>
          </div>
          <span class="resolved-toggle-text">${isClaimsSettledOpen ? 'Hide' : 'Show All (' + counts.settled + ')'}</span>
        </div>

        ${isClaimsSettledOpen ? `
          <div class="claims-table-wrapper" style="border:none; border-top:1px solid var(--border-subtle); border-radius:0; max-height:420px; overflow-y:auto;">
            <table class="claims-cell-table" style="border:none; border-radius:0; box-shadow:none;">
              <thead>
                <tr>
                  <th style="width:105px;">Date</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th class="text-right" style="width:90px;">Billed</th>
                  <th class="text-right" style="width:110px;">Deposited</th>
                  <th class="text-right" style="width:70px;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${settledClaimsList.map(c => renderSettledClaimRowCellHtml(c)).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}
      </div>

    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function renderClaimRowCellHtml(claim) {
  const dStr = formatDateShort(claim.date);
  const expRec = (claim.expectedRecovery !== undefined ? claim.expectedRecovery : (claim.amountPaid * 0.7)).toFixed(2);
  const isReady = (claim.stage === 'ready_to_send');
  const isMissingDeposit = (claim.stage === 'check_due');

  let statusBadgeHtml = '';
  let actionBtnHtml = '';

  if (isReady) {
    statusBadgeHtml = `<span class="status-pill status-ready">📤 To File &bull; Receipt ready</span>`;
    actionBtnHtml = `<button class="claims-pill-btn" onclick="quickAdvanceClaim('${claim.id}')">Mark Filed</button>`;
  } else if (isMissingDeposit) {
    const eobText = claim.eobPlanPaid ? ` ($${claim.eobPlanPaid.toFixed(2)})` : '';
    statusBadgeHtml = `<span class="status-pill status-check"><i data-lucide="alert-circle" style="width:11px;height:11px;"></i> Check Missing${eobText}</span>`;
    actionBtnHtml = `<button class="claims-pill-btn btn-settle" onclick="quickSettleClaim('${claim.id}')">Received $</button>`;
  } else {
    statusBadgeHtml = `<span class="status-pill status-inflight">⏳ In Review &bull; Awaiting payment</span>`;
    actionBtnHtml = `<button class="claims-pill-btn btn-settle" onclick="quickSettleClaim('${claim.id}')">Received $</button>`;
  }

  const patientNote = claim.patient || (claim.notes && !claim.notes.includes('Demo') ? claim.notes : '');

  return `
    <tr id="claim-row-${claim.id}">
      <td class="cell-date">${dStr}</td>
      <td>
        <div class="cell-provider-name">${escapeHtml(claim.provider)}</div>
        ${patientNote ? `<div class="cell-patient-sub">${escapeHtml(patientNote)}</div>` : ''}
      </td>
      <td>${statusBadgeHtml}</td>
      <td class="text-right cell-amount-mono">$${(claim.amountPaid || 0).toFixed(2)}</td>
      <td class="text-right cell-recovery-mono">+$${expRec}</td>
      <td class="text-right">
        <div class="cell-actions-flex">
          ${actionBtnHtml}
          <button class="claims-icon-btn" onclick="openEditClaimModal('${claim.id}')" title="Edit Claim">
            <i data-lucide="edit-3" style="width:12px;height:12px;"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

function renderSettledClaimRowCellHtml(c) {
  const dStr = formatDateShort(c.date);
  const depositedAmt = (parseFloat(c.reimbursedAmount) || c.amountPaid).toFixed(2);
  const billedAmt = (c.amountPaid || 0).toFixed(2);

  return `
    <tr id="claim-row-${c.id}">
      <td class="cell-date">${dStr}</td>
      <td>
        <div class="cell-provider-name">${escapeHtml(c.provider)}</div>
        ${c.claimNumber ? `<div class="cell-patient-sub" style="font-family:var(--font-mono);">#${escapeHtml(c.claimNumber)}</div>` : ''}
      </td>
      <td>
        <span class="status-pill status-settled">
          <i data-lucide="check" style="width:11px;height:11px;"></i> Reconciled &amp; Deposited
        </span>
      </td>
      <td class="text-right cell-amount-mono" style="color:var(--text-muted); font-size:0.8rem;">$${billedAmt}</td>
      <td class="text-right cell-recovery-mono">+$${depositedAmt}</td>
      <td class="text-right">
        <div class="cell-actions-flex">
          <button class="claims-icon-btn" onclick="openEditClaimModal('${c.id}')" title="Edit Claim">
            <i data-lucide="edit-3" style="width:12px;height:12px;"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

function formatDateShort(isoDate) {
  try {
    const d = parseDateIso(isoDate);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return isoDate;
  }
}

function quickAdvanceClaim(claimId) {
  const claim = storage.getClaim(claimId);
  if (!claim) return;
  storage.updateClaim(claimId, {
    stage: 'with_included_health',
    inPortal: true,
    nextAction: 'Submitted to Included Health — in review'
  });
  if (typeof showToast === 'function') showToast('✓ Marked as submitted to Included Health');
  renderClaimsPage();
}

function quickSettleClaim(claimId) {
  const claim = storage.getClaim(claimId);
  if (!claim) return;
  const defaultAmt = (claim.eobPlanPaid || claim.expectedRecovery || claim.amountPaid * 0.7).toFixed(2);
  const promptVal = prompt(`Deposit amount received for ${claim.provider}:`, defaultAmt);
  if (promptVal === null) return;
  const reimbursed = parseFloat(promptVal) || parseFloat(defaultAmt);

  storage.updateClaim(claimId, {
    stage: 'settled',
    inBank: true,
    inPortal: true,
    superbillStatus: 'have',
    reimbursedAmount: reimbursed,
    nextAction: `Reconciled in bank ($${reimbursed.toFixed(2)} deposited)`
  });

  if (typeof triggerConfetti === 'function') triggerConfetti();
  if (typeof showToast === 'function') showToast(`🎉 Deposited $${reimbursed.toFixed(2)}! Settled.`);
  renderClaimsPage();
}

function handleQuickAddClaim(e) {
  e.preventDefault();
  const date = document.getElementById('claim-date-input')?.value;
  const provider = document.getElementById('claim-provider-input')?.value.trim();
  const amountPaid = parseFloat(document.getElementById('claim-amount-input')?.value);
  const form = document.getElementById('quick-add-claim-form');
  const submissionType = form?.dataset?.submissionType || (provider.toLowerCase().includes('barness') ? 'self' : 'provider');

  if (!provider || isNaN(amountPaid) || amountPaid <= 0) {
    if (typeof showToast === 'function') showToast('Please enter provider and amount');
    return;
  }

  const expectedRecovery = amountPaid * 0.7;
  const stage = (submissionType === 'provider') ? 'with_included_health' : 'ready_to_send';
  const nextAction = (submissionType === 'provider')
    ? 'Provider filing claim — check portal'
    : 'Upload superbill to Included Health app';

  storage.addClaim({
    date,
    provider,
    patient: 'Xavier Healy',
    amountPaid,
    expectedRecovery,
    submissionType,
    payoutMethod: 'direct_deposit',
    superbillStatus: 'have',
    stage,
    nextAction,
    inPortal: (submissionType === 'provider'),
    inBank: false
  });

  document.getElementById('claim-provider-input').value = '';
  document.getElementById('claim-amount-input').value = '';
  if (form) delete form.dataset.submissionType;

  if (typeof showToast === 'function') showToast(`Visit for "${provider}" logged! (+5 XP)`);
  if (typeof storage.addPoints === 'function') storage.addPoints(5);
  renderClaimsPage();
}

function openIncludedHealthExportModal() {
  const claims = storage.getClaims();
  const unfiled = claims.filter(c => c.stage === 'ready_to_send');
  const targetClaims = unfiled.length > 0 ? unfiled : claims.filter(c => c.stage !== 'settled');

  let formattedText = generateIncludedHealthSummary(targetClaims);

  const modal = document.getElementById('modal-export-claims');
  if (!modal) return;

  const body = document.getElementById('export-claims-body');
  if (body) {
    body.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <p style="font-size:0.82rem;color:var(--text-secondary);margin:0;">
          Copy and paste this formatted summary directly into your Included Health care team chat:
        </p>
        <textarea class="export-text-preview" id="export-claims-textarea" readonly style="min-height:220px;font-size:0.8rem;line-height:1.45;">${escapeHtml(formattedText)}</textarea>
        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <button class="btn btn-secondary" onclick="closeAllModals()">Close</button>
          <button class="btn btn-primary" onclick="copyIncludedHealthText()">
            <i data-lucide="copy" style="width:14px;height:14px;"></i>
            <span>Copy to Clipboard</span>
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
  text += `Here is the list of unfiled out-of-network sessions ready for claim submission:\n\n`;

  claimsList.forEach((c, idx) => {
    const dStr = formatDateShort(c.date);
    text += `${idx + 1}. Provider: ${c.provider} (Patient: ${c.patient || 'Xavier Healy'})\n`;
    text += `   - Date: ${dStr}\n`;
    text += `   - Amount Paid: $${(c.amountPaid || 0).toFixed(2)}\n`;
    text += `   - Est. 70% Reimbursement: $${(c.expectedRecovery || (c.amountPaid * 0.7)).toFixed(2)}\n`;
    text += `   - Superbill / Invoice: Attached\n\n`;
  });

  text += `Total Out-of-Pocket: $${totalBilled.toFixed(2)}\n`;
  text += `Expected Reimbursement: $${totalExpected.toFixed(2)}\n\n`;
  text += `Please confirm receipt and let me know if you need any additional records. Thank you!`;

  return text;
}

function copyIncludedHealthText() {
  const textarea = document.getElementById('export-claims-textarea');
  if (!textarea) return;
  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(() => {
    if (typeof showToast === 'function') showToast('📋 Formatted brief copied to clipboard!');
    closeAllModals();
  }).catch(() => {
    document.execCommand('copy');
    if (typeof showToast === 'function') showToast('📋 Copied!');
    closeAllModals();
  });
}

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
