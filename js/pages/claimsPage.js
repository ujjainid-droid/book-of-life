/* ==========================================================================
   Book of Life / Life OS - Medical Claims & Recovery Tracker Page
   ========================================================================== */

let activeClaimsFilter = 'all';
let editingClaimId = null;

function renderClaimsPage() {
  const container = document.getElementById('daily-sheet-container');
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
    need_superbill: allClaims.filter(c => c.stage === 'need_superbill').length,
    ready_to_send: allClaims.filter(c => c.stage === 'ready_to_send').length,
    with_included_health: allClaims.filter(c => c.stage === 'with_included_health').length,
    check_due: allClaims.filter(c => c.stage === 'check_due').length,
    settled: allClaims.filter(c => c.stage === 'settled').length
  };

  const todayIso = formatDateIso(new Date());

  container.innerHTML = `
    <div class="claims-container">
      
      <!-- 1. Hero & Summary Header -->
      <div class="claims-hero-card">
        <div class="claims-hero-top">
          <div class="claims-hero-title-group">
            <h2>
              <i data-lucide="receipt" style="color:var(--primary);width:22px;height:22px;"></i>
              Out-of-Network Claims & Recovery
            </h2>
            <p>Personal Finance Sub-system • Track out-of-pocket costs, superbills &amp; Included Health handoffs.</p>
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
            <span class="metric-label">With Advocate / Ins</span>
            <span class="metric-value" style="color:var(--info)">
              ${stats.withIncludedHealthCount + stats.checkDueCount} ${stats.withIncludedHealthCount + stats.checkDueCount === 1 ? 'Claim' : 'Claims'}
            </span>
            <span class="metric-sub">Under review or check pending</span>
          </div>
        </div>
      </div>

      <!-- 2. Quick Add New Claim Card -->
      <div class="claims-add-card">
        <div class="claims-card-header">
          <div class="claims-card-title">
            <i data-lucide="plus-circle" style="color:var(--primary);width:17px;height:17px;"></i>
            <span>Quick Log Medical Service</span>
          </div>
          <span style="font-size:0.75rem;color:var(--text-muted);">Simple. Visible. Next step.</span>
        </div>

        <form id="quick-add-claim-form" onsubmit="handleQuickAddClaim(event)">
          <div class="claims-grid-form">
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:0.75rem;">Date of Service</label>
              <input type="date" class="form-input" id="claim-date-input" value="${todayIso}" required>
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:0.75rem;">Provider / Doctor</label>
              <input type="text" class="form-input" id="claim-provider-input" placeholder="e.g. Dr. Adams, Physical Therapy" required>
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:0.75rem;">Amount Paid ($)</label>
              <input type="number" step="0.01" min="0" class="form-input" id="claim-amount-input" placeholder="250.00" required>
            </div>
          </div>

          <div class="claims-form-row-2">
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:0.75rem;">Superbill Status</label>
              <select class="form-select" id="claim-superbill-select" onchange="handleSuperbillStatusChange(this.value)">
                <option value="have" selected>✅ Have Superbill / Invoice</option>
                <option value="need">❌ Need Superbill from Office</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:0.75rem;">Current Stage</label>
              <select class="form-select" id="claim-stage-select" onchange="handleStageSelectChange(this.value)">
                <option value="ready_to_send" selected>🟡 Send to Included Health</option>
                <option value="need_superbill">🔴 Need Superbill</option>
                <option value="with_included_health">🔵 With Included Health</option>
                <option value="check_due">🟢 Check / Deposit Due</option>
                <option value="settled">⚪ Settled &amp; Reconciled</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:0.75rem;">Next Action (Immediate step)</label>
              <input type="text" class="form-input" id="claim-nextaction-input" value="Upload superbill to Included Health app">
            </div>
          </div>

          <div class="claims-add-btn-wrap">
            <button type="submit" class="btn btn-primary btn-sm">
              <i data-lucide="plus" style="width:14px;height:14px;"></i>
              <span>Add Claim</span>
            </button>
          </div>
        </form>
      </div>

      <!-- 3. Filter Navigation Pills -->
      <div class="claims-filter-bar">
        <button class="claims-filter-pill ${activeClaimsFilter === 'all' ? 'active' : ''}" onclick="setClaimsFilter('all')">
          All (${counts.all})
        </button>
        <button class="claims-filter-pill ${activeClaimsFilter === 'need_superbill' ? 'active' : ''}" onclick="setClaimsFilter('need_superbill')">
          <span>🔴</span> Needs Superbill (${counts.need_superbill})
        </button>
        <button class="claims-filter-pill ${activeClaimsFilter === 'ready_to_send' ? 'active' : ''}" onclick="setClaimsFilter('ready_to_send')">
          <span>🟡</span> Ready to Send (${counts.ready_to_send})
        </button>
        <button class="claims-filter-pill ${activeClaimsFilter === 'with_included_health' ? 'active' : ''}" onclick="setClaimsFilter('with_included_health')">
          <span>🔵</span> With Included Health (${counts.with_included_health})
        </button>
        <button class="claims-filter-pill ${activeClaimsFilter === 'check_due' ? 'active' : ''}" onclick="setClaimsFilter('check_due')">
          <span>🟢</span> Check Due (${counts.check_due})
        </button>
        <button class="claims-filter-pill ${activeClaimsFilter === 'settled' ? 'active' : ''}" onclick="setClaimsFilter('settled')">
          <span>⚪</span> Settled (${counts.settled})
        </button>
      </div>

      <!-- 4. Claims Active Cards List -->
      <div class="claims-list">
        ${filteredClaims.length === 0 ? `
          <div class="claims-empty-card">
            <i data-lucide="inbox" style="width:36px;height:36px;"></i>
            <div style="font-weight:600;color:var(--text-primary);">No claims in this view</div>
            <div style="font-size:0.8rem;max-width:320px;">Use the quick add form above to log an out-of-network service, or switch filters.</div>
          </div>
        ` : filteredClaims.map(claim => renderClaimItemHtml(claim)).join('')}
      </div>

      <!-- 5. Weekly Maintenance Routine Reminder -->
      <div class="claims-routine-card">
        <div class="claims-routine-icon">
          <i data-lucide="calendar-clock" style="width:20px;height:20px;"></i>
        </div>
        <div class="claims-routine-content">
          <h4>The 2-Minute Sunday Review (Tied to Monarch)</h4>
          <p>
            <strong>1.</strong> Any 🔴 <em>Need Superbill</em>? Send quick 1-line email to clinic.<br>
            <strong>2.</strong> Any 🟡 <em>Ready to Send</em>? Tap <strong>Copy for Included Health</strong> and batch-send.<br>
            <strong>3.</strong> Any 🟢 <em>Check Due</em>? Verify the deposit hit Monarch, then click <strong>Mark Settled</strong>.
          </p>
        </div>
      </div>

    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

/**
 * Render single claim card HTML
 */
function renderClaimItemHtml(claim) {
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

  const isSuperbillHave = (claim.superbillStatus === 'have');
  const isSettled = (claim.stage === 'settled');

  return `
    <div class="claim-item-card claim-stage-${claim.stage}" id="claim-card-${claim.id}">
      <!-- Top Row: Provider, Date & Amount -->
      <div class="claim-header-row">
        <div class="claim-provider-info">
          <span class="claim-provider-name">${claim.provider}</span>
          <span class="claim-date-tag">• ${formattedDate}</span>
        </div>
        <div class="claim-amount-badge">
          $${(claim.amountPaid || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      <!-- Meta Row: Badges & Quick Stage Selector -->
      <div class="claim-meta-row">
        <div class="claim-stage-badges">
          <!-- Stage Badge with Dropdown Switcher -->
          <div style="position:relative;display:inline-block;">
            <select class="stage-pill ${claim.stage}" 
                    style="cursor:pointer;outline:none;" 
                    onchange="quickUpdateClaimStage('${claim.id}', this.value)"
                    title="Change stage">
              <option value="need_superbill" ${claim.stage === 'need_superbill' ? 'selected' : ''}>🔴 Need Superbill</option>
              <option value="ready_to_send" ${claim.stage === 'ready_to_send' ? 'selected' : ''}>🟡 Send to Included Health</option>
              <option value="with_included_health" ${claim.stage === 'with_included_health' ? 'selected' : ''}>🔵 With Included Health</option>
              <option value="check_due" ${claim.stage === 'check_due' ? 'selected' : ''}>🟢 Check Due</option>
              <option value="settled" ${claim.stage === 'settled' ? 'selected' : ''}>⚪ Settled</option>
            </select>
          </div>

          <!-- Superbill Tag -->
          <button class="superbill-tag ${isSuperbillHave ? 'have' : 'need'}" 
                  onclick="toggleClaimSuperbill('${claim.id}')"
                  title="Click to toggle superbill status">
            ${isSuperbillHave ? '<i data-lucide="check" style="width:12px;height:12px;"></i> Superbill Attached' : '<i data-lucide="alert-circle" style="width:12px;height:12px;"></i> Need Superbill'}
          </button>

          ${claim.notes ? `
            <span style="font-size:0.75rem;color:var(--text-muted);" title="${claim.notes}">
              💬 ${claim.notes.length > 35 ? claim.notes.substring(0, 32) + '...' : claim.notes}
            </span>
          ` : ''}
        </div>

        <!-- Action Buttons -->
        <div class="claim-actions-group">
          ${!isSettled ? `
            <button class="claim-icon-btn settle-btn" onclick="quickSettleClaim('${claim.id}')" title="Mark Settled &amp; Reconciled">
              <i data-lucide="check-circle-2" style="width:15px;height:15px;"></i>
            </button>
          ` : `
            <button class="claim-icon-btn" onclick="quickUpdateClaimStage('${claim.id}', 'ready_to_send')" title="Reopen Claim">
              <i data-lucide="rotate-ccw" style="width:14px;height:14px;"></i>
            </button>
          `}
          <button class="claim-icon-btn" onclick="openEditClaimModal('${claim.id}')" title="Edit details">
            <i data-lucide="edit-3" style="width:14px;height:14px;"></i>
          </button>
          <button class="claim-icon-btn delete-btn" onclick="confirmDeleteClaim('${claim.id}')" title="Delete claim">
            <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
          </button>
        </div>
      </div>

      <!-- Bottom: The Next Step Callout -->
      <div class="claim-next-step-box">
        <div class="claim-next-step-label">
          <i data-lucide="arrow-right-circle" style="width:14px;height:14px;color:var(--primary);"></i>
          <span>Next Step (${stageMeta.actor}):</span>
        </div>
        <div class="claim-next-step-text">
          ${claim.nextAction || stageMeta.defaultAction}
        </div>
      </div>
    </div>
  `;
}

/**
 * Filter handling
 */
function setClaimsFilter(filter) {
  activeClaimsFilter = filter;
  renderClaimsPage();
}

/**
 * Form changes: auto-fill next action
 */
function handleSuperbillStatusChange(val) {
  const stageSelect = document.getElementById('claim-stage-select');
  const actionInput = document.getElementById('claim-nextaction-input');
  if (val === 'need') {
    if (stageSelect) stageSelect.value = 'need_superbill';
    if (actionInput) actionInput.value = 'Request itemized superbill from provider';
  } else {
    if (stageSelect && stageSelect.value === 'need_superbill') {
      stageSelect.value = 'ready_to_send';
      if (actionInput) actionInput.value = 'Upload superbill to Included Health app';
    }
  }
}

function handleStageSelectChange(val) {
  const actionInput = document.getElementById('claim-nextaction-input');
  if (actionInput && typeof getDefaultNextAction === 'function') {
    actionInput.value = getDefaultNextAction(val);
  }
}

/**
 * Quick Add Claim Handler
 */
function handleQuickAddClaim(e) {
  e.preventDefault();
  const date = document.getElementById('claim-date-input')?.value;
  const provider = document.getElementById('claim-provider-input')?.value.trim();
  const amountPaid = parseFloat(document.getElementById('claim-amount-input')?.value);
  const superbillStatus = document.getElementById('claim-superbill-select')?.value;
  const stage = document.getElementById('claim-stage-select')?.value;
  const nextAction = document.getElementById('claim-nextaction-input')?.value.trim();

  if (!provider || isNaN(amountPaid) || amountPaid <= 0) {
    showToast('Please enter provider and a valid amount');
    return;
  }

  storage.addClaim({
    date,
    provider,
    amountPaid,
    superbillStatus,
    stage,
    nextAction
  });

  // Reset inputs
  document.getElementById('claim-provider-input').value = '';
  document.getElementById('claim-amount-input').value = '';
  document.getElementById('claim-superbill-select').value = 'have';
  document.getElementById('claim-stage-select').value = 'ready_to_send';
  document.getElementById('claim-nextaction-input').value = 'Upload superbill to Included Health app';

  showToast(`Claim for "${provider}" added! (+5 XP)`);
  storage.addPoints(5);
  renderClaimsPage();
}

/**
 * Quick updates on card
 */
function quickUpdateClaimStage(claimId, newStage) {
  const nextAction = (typeof getDefaultNextAction === 'function') ? getDefaultNextAction(newStage) : '';
  storage.updateClaim(claimId, {
    stage: newStage,
    nextAction: nextAction
  });
  if (newStage === 'settled') {
    triggerConfetti();
    showToast('🎉 Claim settled! Money back in the bank.');
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
          Copy this structured summary to message your <strong>Included Health Care Coordinator / Billing Advocate</strong>. They will handle provider follow-ups, claim filing, and insurance appeals.
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
  text += `I have the following out-of-network medical services that I paid out of pocket and need assistance submitting to insurance for reimbursement and claims tracking:\n\n`;

  claimsList.forEach((c, idx) => {
    const dStr = parseDateIso(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const hasSb = (c.superbillStatus === 'have');
    text += `${idx + 1}. Provider: ${c.provider}\n`;
    text += `   - Date of Service: ${dStr}\n`;
    text += `   - Amount Paid: $${(c.amountPaid || 0).toFixed(2)}\n`;
    text += `   - Superbill / Invoice: ${hasSb ? 'Available / Attached' : 'Pending from provider'}\n`;
    text += `   - Current Status: ${CLAIM_STAGES[c.stage]?.label || c.stage}\n`;
    if (c.notes) text += `   - Notes: ${c.notes}\n`;
    text += `\n`;
  });

  text += `Total Out-of-Pocket Value: $${total.toFixed(2)}\n\n`;
  text += `Please let me know once these claims are filed with insurance, and what explanation of benefits (EOB) or documentation you need from me. Thank you!`;

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

  const form = document.getElementById('edit-claim-form');
  if (!form) return;

  document.getElementById('edit-claim-date').value = claim.date;
  document.getElementById('edit-claim-provider').value = claim.provider;
  document.getElementById('edit-claim-amount').value = claim.amountPaid;
  document.getElementById('edit-claim-superbill').value = claim.superbillStatus;
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
  const superbillStatus = document.getElementById('edit-claim-superbill').value;
  const stage = document.getElementById('edit-claim-stage').value;
  const nextAction = document.getElementById('edit-claim-nextaction').value.trim();
  const notes = document.getElementById('edit-claim-notes').value.trim();

  storage.updateClaim(editingClaimId, {
    date,
    provider,
    amountPaid,
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
    badge.textContent = `${count} action`;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}
