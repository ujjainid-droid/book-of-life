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

let activeProviderFilter = (() => {
  try {
    const s = localStorage.getItem('BOL_CLAIMS_PROVIDER_FILTER');
    if (s) return s;
  } catch (e) {}
  return 'all';
})();

let editingClaimId = null;

function getProviderKey(provider) {
  const p = (provider || '').toLowerCase();
  if (p.includes('barness') || p.includes('mindful medicine')) return 'barness';
  if (p.includes('mindsoother')) return 'mindsoother';
  if (p.includes('neuro')) return 'neuropsych';
  if (p.includes('roseland') || p.includes('bock')) return 'roseland';
  return p.replace(/[^a-z0-9]/g, '-');
}

function getProviderDisplayName(raw) {
  const p = (raw || '').toLowerCase();
  if (p.includes('barness') || p.includes('mindful medicine')) return 'Dr. Michael Barness';
  if (p.includes('mindsoother')) return 'Mindsoother Therapy';
  if (p.includes('neuro')) return 'North Jersey Neuropsychology';
  if (p.includes('roseland') || p.includes('bock')) return 'Roseland Psychotherapy';
  return raw;
}

function getDistinctProviders(claims) {
  const map = new Map();
  claims.forEach(c => {
    const raw = (c.provider || '').trim();
    if (!raw) return;
    const key = getProviderKey(raw);
    if (!map.has(key)) {
      map.set(key, {
        key,
        name: getProviderDisplayName(raw),
        count: 0,
        billed: 0,
        deposited: 0,
        pending: 0,
        settledCount: 0,
        pendingCount: 0
      });
    }
    const item = map.get(key);
    item.count++;
    const amt = c.amountPaid || 0;
    item.billed += amt;
    if (c.stage === 'settled') {
      item.settledCount++;
      item.deposited += (parseFloat(c.reimbursedAmount) || amt);
    } else {
      item.pendingCount++;
      item.pending += (c.eobPlanPaid || c.expectedRecovery || (amt * 0.7));
    }
  });

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

function quickFillVisit(provider, amount, submissionType) {
  const pInput = document.getElementById('claim-provider-input');
  const aInput = document.getElementById('claim-amount-input');
  if (pInput) pInput.value = provider;
  if (aInput) aInput.value = amount.toFixed(2);
  const form = document.getElementById('quick-add-claim-form');
  if (form) form.dataset.submissionType = submissionType;
  if (pInput) pInput.focus();
}

function setProviderFilter(providerKey) {
  activeProviderFilter = providerKey;
  try {
    localStorage.setItem('BOL_CLAIMS_PROVIDER_FILTER', providerKey);
  } catch (e) {}
  renderClaimsPage();
}

function setClaimsFilter(filter) {
  activeClaimsFilter = filter;
  try {
    localStorage.setItem('BOL_CLAIMS_FILTER', filter);
  } catch (e) {}
  renderClaimsPage();
}

function resetClaimsFilters() {
  activeProviderFilter = 'all';
  activeClaimsFilter = 'all';
  try {
    localStorage.setItem('BOL_CLAIMS_PROVIDER_FILTER', 'all');
    localStorage.setItem('BOL_CLAIMS_FILTER', 'all');
  } catch (e) {}
  renderClaimsPage();
}

function renderClaimsPage(targetContainer) {
  const container = targetContainer || document.getElementById('finance-subview-container') || document.getElementById('bunker-subview-frame') || document.getElementById('daily-sheet-container');
  if (!container) return;

  const allClaims = storage.getClaims();
  const distinctProviders = getDistinctProviders(allClaims);

  // 1. Filter by Provider
  const providerClaims = (activeProviderFilter === 'all')
    ? allClaims
    : allClaims.filter(c => getProviderKey(c.provider) === activeProviderFilter);

  // 2. Compute dynamic metrics for the selected provider (or all providers)
  let totalBilled = 0;
  let totalDeposited = 0;
  let totalPending = 0;
  let totalFloatingSpend = 0;
  let settledCount = 0;
  let pendingCount = 0;
  let inFlightCount = 0;
  let checkDueCount = 0;
  let readyCount = 0;

  providerClaims.forEach(c => {
    const amt = c.amountPaid || 0;
    totalBilled += amt;
    if (c.stage === 'settled') {
      settledCount++;
      totalDeposited += (parseFloat(c.reimbursedAmount) || amt);
    } else {
      pendingCount++;
      totalFloatingSpend += amt;
      totalPending += (c.eobPlanPaid || c.expectedRecovery || (amt * 0.7));
      if (c.stage === 'check_due') checkDueCount++;
      else if (c.stage === 'ready_to_send') readyCount++;
      else inFlightCount++;
    }
  });

  updateClaimsHeaderBadge(pendingCount);

  // 3. Filter by Status Tab
  let displayedClaims = providerClaims;
  if (activeClaimsFilter === 'pending') {
    displayedClaims = providerClaims.filter(c => c.stage === 'with_included_health' || c.stage === 'check_due');
  } else if (activeClaimsFilter === 'ready_to_send') {
    displayedClaims = providerClaims.filter(c => c.stage === 'ready_to_send');
  } else if (activeClaimsFilter === 'check_due') {
    displayedClaims = providerClaims.filter(c => c.stage === 'check_due');
  } else if (activeClaimsFilter === 'with_included_health') {
    displayedClaims = providerClaims.filter(c => c.stage === 'with_included_health');
  } else if (activeClaimsFilter === 'settled') {
    displayedClaims = providerClaims.filter(c => c.stage === 'settled');
  }

  // 4. Sort chronological descending (newest visit first)
  displayedClaims.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  // 5. Calculate summary metrics for the currently displayed view
  let filterBilled = 0;
  let filterDeposited = 0;
  let filterPending = 0;
  displayedClaims.forEach(c => {
    const amt = c.amountPaid || 0;
    filterBilled += amt;
    if (c.stage === 'settled') {
      filterDeposited += (parseFloat(c.reimbursedAmount) || amt);
    } else {
      filterPending += (c.eobPlanPaid || c.expectedRecovery || (amt * 0.7));
    }
  });

  const activeProviderObj = distinctProviders.find(p => p.key === activeProviderFilter);
  const activeProviderName = (activeProviderFilter === 'all') ? 'All Providers' : (activeProviderObj?.name || 'Selected Provider');
  const todayIso = formatDateIso(new Date());

  container.innerHTML = `
    <div class="claims-container" style="max-width: 880px; margin: 0 auto; gap: 14px;">
      
      <!-- 1. Header with Export & Copy Actions -->
      <div class="claims-header-row">
        <div>
          <h2 class="claims-title">Medical Claims &amp; Reimbursements</h2>
          <p class="claims-subtitle">Track out-of-pocket visits from receipt to bank deposit with Anthem.</p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="claims-copy-btn" onclick="openIncludedHealthExportModal()" title="Copy formatted summary of visits for Anthem claim filing">
            <i data-lucide="copy" style="width:13px;height:13px;"></i>
            <span>Copy Claims Summary</span>
          </button>
          <button class="claims-copy-btn" onclick="storage.exportClaimsCSV();showToast('CSV downloaded!')" title="Export claims CSV">
            <i data-lucide="download" style="width:13px;height:13px;"></i>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <!-- 2. The 3 Dedicated Metric Cards (Instant Paid vs Pending Clarity) -->
      <div class="claims-widgets-grid">
        
        <!-- Card 1: Paid & Deposited -->
        <div class="claims-widget-card card-paid" onclick="setClaimsFilter('settled')" title="Click to view all paid & deposited visits">
          <div class="claims-widget-header">
            <span class="claims-widget-label">Received in Bank</span>
            <span class="claims-widget-badge" style="background:rgba(13, 148, 136, 0.1); color:#0D9488; border-color:rgba(13, 148, 136, 0.3);">
              ${settledCount} Settled
            </span>
          </div>
          <div class="claims-widget-value">$${totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div class="claims-widget-sub">Reconciled &amp; deposited in account</div>
        </div>

        <!-- Card 2: Pending Reimbursement -->
        <div class="claims-widget-card card-pending" onclick="setClaimsFilter('pending')" title="Click to view visits pending insurer payout">
          <div class="claims-widget-header">
            <span class="claims-widget-label">Pending Payment</span>
            <span class="claims-widget-badge" style="background:rgba(139, 92, 246, 0.12); color:#7C3AED; border-color:rgba(139, 92, 246, 0.3);">
              ${pendingCount} Open
            </span>
          </div>
          <div class="claims-widget-value">$${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div class="claims-widget-sub">$${totalFloatingSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} spent out-of-pocket</div>
        </div>

        <!-- Card 3: Total Out-of-Pocket Spend -->
        <div class="claims-widget-card card-total" onclick="setClaimsFilter('all')" title="Click to view all visits">
          <div class="claims-widget-header">
            <span class="claims-widget-label">Total Billed Spend</span>
            <span class="claims-widget-badge" style="background:rgba(100, 116, 139, 0.1); color:var(--text-secondary); border-color:var(--border-subtle);">
              ${providerClaims.length} Visits
            </span>
          </div>
          <div class="claims-widget-value" style="color:var(--text-primary);">$${totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div class="claims-widget-sub">${activeProviderFilter === 'all' ? 'All historical out-of-pocket charges' : activeProviderName}</div>
        </div>

      </div>

      <!-- 3. Fast Log Visit Form -->
      <div class="claims-log-card">
        <div class="claims-log-header">
          <span class="claims-log-label">Log Future Visit</span>
          <div class="claims-quick-chips">
            <button type="button" class="quick-chip" onclick="quickFillVisit('Dr. Michael Barness', 300, 'self')">Dr. Barness ($300)</button>
            <button type="button" class="quick-chip" onclick="quickFillVisit('Mindsoother Therapy', 225, 'provider')">Mindsoother ($225)</button>
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

      <!-- 4. Two-Tier Filter Controls: Provider Filter & Payment Status Filter -->
      <div class="claims-controls-card">
        
        <!-- Tier A: Provider Filter -->
        <div class="claims-filter-row">
          <div class="filter-row-label">
            <i data-lucide="user" style="width:13px;height:13px;"></i>
            <span>Provider</span>
          </div>
          <div class="claims-filter-pills-scroll">
            <button type="button" class="claims-provider-pill ${activeProviderFilter === 'all' ? 'active' : ''}" onclick="setProviderFilter('all')">
              <span>All Providers</span>
              <span class="pill-badge">${allClaims.length}</span>
            </button>
            ${distinctProviders.map(p => `
              <button type="button" class="claims-provider-pill ${activeProviderFilter === p.key ? 'active' : ''}" onclick="setProviderFilter('${p.key}')">
                <span>${escapeHtml(p.name)}</span>
                <span class="pill-badge">${p.count}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Tier B: Payment Status Filter -->
        <div class="claims-filter-row" style="padding-top:8px; border-top:1px solid var(--border-subtle);">
          <div class="filter-row-label">
            <i data-lucide="layers" style="width:13px;height:13px;"></i>
            <span>Status</span>
          </div>
          <div class="claims-filter-pills-scroll">
            <button type="button" class="claims-status-pill ${activeClaimsFilter === 'all' ? 'active' : ''}" onclick="setClaimsFilter('all')">
              <span>All Visits</span>
              <span class="pill-badge">${providerClaims.length}</span>
            </button>
            <button type="button" class="claims-status-pill pill-pending ${activeClaimsFilter === 'pending' ? 'active' : ''}" onclick="setClaimsFilter('pending')" title="Visits awaiting payment from insurer">
              <span>⏳ Pending Payment</span>
              <span class="pill-badge">${pendingCount - readyCount}</span>
            </button>
            ${checkDueCount > 0 ? `
              <button type="button" class="claims-status-pill pill-alert ${activeClaimsFilter === 'check_due' ? 'active' : ''}" onclick="setClaimsFilter('check_due')" title="Visits with missing check inquiries">
                <i data-lucide="alert-circle" style="width:11px;height:11px;"></i>
                <span>Missing Check</span>
                <span class="pill-badge">${checkDueCount}</span>
              </button>
            ` : ''}
            ${readyCount > 0 ? `
              <button type="button" class="claims-status-pill ${activeClaimsFilter === 'ready_to_send' ? 'active' : ''}" onclick="setClaimsFilter('ready_to_send')" title="Visits awaiting invoice / ready to file">
                <span>📤 To File</span>
                <span class="pill-badge">${readyCount}</span>
              </button>
            ` : ''}
            <button type="button" class="claims-status-pill pill-settled ${activeClaimsFilter === 'settled' ? 'active' : ''}" onclick="setClaimsFilter('settled')" title="Visits that have been reimbursed and deposited in bank">
              <span>✅ Paid &amp; Deposited</span>
              <span class="pill-badge">${settledCount}</span>
            </button>
          </div>
        </div>

      </div>

      <!-- 5. Active View Financial Summary Banner -->
      <div class="claims-summary-banner">
        <div class="summary-banner-left">
          <span class="summary-banner-title">${escapeHtml(activeProviderName)}</span>
          <span class="summary-banner-dot">&bull;</span>
          <span class="summary-banner-sub">
            ${displayedClaims.length} ${displayedClaims.length === 1 ? 'visit' : 'visits'} displayed
          </span>
        </div>
        <div class="summary-banner-metrics">
          <span class="metric-item"><strong>$${filterBilled.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> billed</span>
          <span class="metric-sep">&bull;</span>
          <span class="metric-item teal"><strong>+$${filterDeposited.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> deposited</span>
          <span class="metric-sep">&bull;</span>
          <span class="metric-item violet"><strong>+$${filterPending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> pending</span>
        </div>
      </div>

      <!-- 6. Scannable Financial Data Grid Table -->
      <div class="claims-table-card">
        <div class="claims-table-wrapper">
          <table class="claims-cell-table">
            <thead>
              <tr>
                <th style="width:105px;">Date</th>
                <th>Provider &amp; Details</th>
                <th style="width:190px;">Payment Status</th>
                <th class="text-right" style="width:95px;">Billed</th>
                <th class="text-right" style="width:125px;">Reimbursement</th>
                <th class="text-right" style="width:115px;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${displayedClaims.length === 0 ? `
                <tr>
                  <td colspan="6" style="text-align:center; padding:36px 16px; color:var(--text-muted); font-size:0.84rem;">
                    <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
                      <i data-lucide="filter" style="width:22px;height:22px;opacity:0.35;"></i>
                      <span>No visits match the selected provider &amp; status filters.</span>
                      <button class="btn btn-secondary" style="font-size:0.75rem; padding:4px 10px; margin-top:4px;" onclick="resetClaimsFilters()">Reset Filters</button>
                    </div>
                  </td>
                </tr>
              ` : displayedClaims.map(claim => renderClaimRowCellHtml(claim)).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

function renderClaimRowCellHtml(claim) {
  const dStr = formatDateShort(claim.date);
  const isSettled = (claim.stage === 'settled');
  const isReady = (claim.stage === 'ready_to_send');
  const isMissingDeposit = (claim.stage === 'check_due');
  const billedAmt = (claim.amountPaid || 0).toFixed(2);
  const expRec = (claim.expectedRecovery !== undefined ? claim.expectedRecovery : (claim.eobPlanPaid !== undefined ? claim.eobPlanPaid : claim.amountPaid * 0.7)).toFixed(2);
  const depositedAmt = (parseFloat(claim.reimbursedAmount) || claim.amountPaid || 0).toFixed(2);

  let statusBadgeHtml = '';
  let actionBtnHtml = '';
  let reimburseHtml = '';
  let rowClass = isSettled ? 'claims-row-settled' : 'claims-row-pending';

  if (isSettled) {
    statusBadgeHtml = `<span class="status-pill status-settled"><i data-lucide="check-circle-2" style="width:11px;height:11px;"></i> Paid &bull; Deposited</span>`;
    reimburseHtml = `<div class="cell-recovery-mono" style="color:#0D9488;">+$${depositedAmt}</div><span class="reimburse-type deposited">Deposited</span>`;
    actionBtnHtml = `
      <button class="claims-icon-btn" onclick="openEditClaimModal('${claim.id}')" title="Edit Claim">
        <i data-lucide="edit-3" style="width:12px;height:12px;"></i>
      </button>
    `;
  } else if (isReady) {
    statusBadgeHtml = `<span class="status-pill status-ready" title="${escapeHtml(claim.nextAction || '')}"><i data-lucide="file-text" style="width:11px;height:11px;"></i> To File &bull; Need Invoice</span>`;
    reimburseHtml = `<div class="cell-recovery-mono" style="color:#7C3AED;">+$${expRec}</div><span class="reimburse-type pending">Est. Recovery</span>`;
    actionBtnHtml = `
      <button class="claims-pill-btn" onclick="quickAdvanceClaim('${claim.id}')">Mark Filed</button>
      <button class="claims-icon-btn" onclick="openEditClaimModal('${claim.id}')" title="Edit Claim">
        <i data-lucide="edit-3" style="width:12px;height:12px;"></i>
      </button>
    `;
  } else if (isMissingDeposit) {
    const badgeText = claim.claimNumber ? `Check Missing #${claim.claimNumber}` : 'Check Missing';
    statusBadgeHtml = `<span class="status-pill status-check" title="${escapeHtml(claim.nextAction || '')}"><i data-lucide="alert-circle" style="width:11px;height:11px;"></i> ${escapeHtml(badgeText)}</span>`;
    reimburseHtml = `<div class="cell-recovery-mono" style="color:#E11D48;">+$${expRec}</div><span class="reimburse-type missing">Approved Check</span>`;
    actionBtnHtml = `
      <button class="claims-pill-btn btn-settle" onclick="quickSettleClaim('${claim.id}')">Received $</button>
      <button class="claims-icon-btn" onclick="openEditClaimModal('${claim.id}')" title="Edit Claim">
        <i data-lucide="edit-3" style="width:12px;height:12px;"></i>
      </button>
    `;
  } else {
    // In Review / In Flight with Anthem
    statusBadgeHtml = `<span class="status-pill status-inflight" title="${escapeHtml(claim.nextAction || '')}"><i data-lucide="clock" style="width:11px;height:11px;"></i> In Review &bull; Anthem</span>`;
    reimburseHtml = `<div class="cell-recovery-mono" style="color:#7C3AED;">+$${expRec}</div><span class="reimburse-type pending">Pending Payout</span>`;
    actionBtnHtml = `
      <button class="claims-pill-btn btn-settle" onclick="quickSettleClaim('${claim.id}')">Received $</button>
      <button class="claims-icon-btn" onclick="openEditClaimModal('${claim.id}')" title="Edit Claim">
        <i data-lucide="edit-3" style="width:12px;height:12px;"></i>
      </button>
    `;
  }

  // Detail Subtitle: patient, claim/receipt numbers, diagnosis
  let detailSubs = [];
  if (claim.patient) detailSubs.push(escapeHtml(claim.patient));
  if (claim.claimNumber && !isMissingDeposit) detailSubs.push(`Claim #${escapeHtml(claim.claimNumber)}`);
  if (claim.notes && !claim.notes.includes('Demo')) {
    if (claim.notes.includes('Receipt #')) {
      const match = claim.notes.match(/Receipt\s*#\d+/i);
      if (match) detailSubs.push(escapeHtml(match[0]));
    } else if (claim.notes.includes('Tracking ID:')) {
      const match = claim.notes.match(/Tracking\s*ID:\s*[\w\d]+/i);
      if (match) detailSubs.push(escapeHtml(match[0]));
    }
  }

  return `
    <tr id="claim-row-${claim.id}" class="${rowClass}">
      <td class="cell-date">${dStr}</td>
      <td>
        <div class="cell-provider-name">${escapeHtml(claim.provider)}</div>
        ${detailSubs.length > 0 ? `<div class="cell-patient-sub">${detailSubs.join(' &bull; ')}</div>` : ''}
      </td>
      <td>${statusBadgeHtml}</td>
      <td class="text-right cell-amount-mono">$${billedAmt}</td>
      <td class="text-right">${reimburseHtml}</td>
      <td class="text-right">
        <div class="cell-actions-flex">
          ${actionBtnHtml}
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
    nextAction: 'Submitted to Anthem — in review'
  });
  if (typeof showToast === 'function') showToast('✓ Marked as submitted to Anthem');
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
    : 'Upload superbill to Anthem portal';

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
          Copy and paste this formatted summary directly into your Anthem portal claim filing or message:
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
  if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
}

function generateIncludedHealthSummary(claimsList) {
  let totalBilled = 0;
  let totalExpected = 0;
  claimsList.forEach(c => {
    totalBilled += (c.amountPaid || 0);
    totalExpected += (c.expectedRecovery !== undefined ? c.expectedRecovery : (c.amountPaid * 0.7));
  });

  let text = `Out-of-Network Medical Claims Filing Summary\n`;
  text += `Subscriber: Ujjaini Dasgupta | Patient: Xavier Healy | Insurer: Anthem\n\n`;
  text += `Here is the list of out-of-network sessions for claim filing and reimbursement tracking:\n\n`;

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
  text += `Please let me know if any additional records or invoices are needed. Thank you!`;

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
  if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
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
  if (badge && badge.style) badge.style.display = 'none';
}
