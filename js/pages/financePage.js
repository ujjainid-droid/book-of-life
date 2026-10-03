/* ==========================================================================
   Book of Life / Life OS - Personal Finance Page Controller
   ========================================================================== */

function getInitialFinanceSubTab() {
  try {
    const rawHash = (window.location.hash || '').replace(/^#\/?/, '').trim();
    if (rawHash.startsWith('finance/') || rawHash.startsWith('finance-') || rawHash.startsWith('finance?')) {
      const parts = rawHash.split(/[\/\-_?]/);
      if (parts[1] && ['burn', 'subscriptions', 'claims', 'runway'].includes(parts[1])) {
        return parts[1];
      }
    }
    if (rawHash.startsWith('claims')) return 'claims';
    const saved = localStorage.getItem('BOL_FINANCE_ACTIVE_SUBTAB');
    if (saved && ['burn', 'subscriptions', 'claims', 'runway'].includes(saved)) {
      return saved;
    }
  } catch (e) {}
  return 'burn';
}

let activeFinanceSubTab = getInitialFinanceSubTab();
let financeTxSearchQuery = '';
let financeTxCategoryFilter = 'all';

function renderFinancePage(targetSubTab) {
  const container = document.getElementById('daily-sheet-container') || document.getElementById('bunker-subview-frame');
  if (!container) return;

  if (targetSubTab && ['burn', 'subscriptions', 'claims', 'runway'].includes(targetSubTab)) {
    activeFinanceSubTab = targetSubTab;
  } else if (!activeFinanceSubTab) {
    activeFinanceSubTab = getInitialFinanceSubTab();
  }

  // Get stats for badges
  const claimsStats = (typeof storage !== 'undefined' && typeof storage.getClaimsStats === 'function')
    ? storage.getClaimsStats()
    : { actionNeededCount: 0 };

  container.innerHTML = `
    <div class="finance-page-container">
      
      <!-- Sub-Navigation Bar -->
      <div class="finance-subnav-bar">
        <div class="finance-subnav-pills">
          <button class="finance-subnav-btn ${activeFinanceSubTab === 'burn' ? 'active' : ''}" onclick="switchFinanceSubTab('burn')">
            <span>🔥</span>
            <span>Monthly Burn &amp; Cash Flow</span>
          </button>
          <button class="finance-subnav-btn ${activeFinanceSubTab === 'subscriptions' ? 'active' : ''}" onclick="switchFinanceSubTab('subscriptions')">
            <span>🔁</span>
            <span>Subscriptions &amp; Recurring</span>
          </button>
          <button class="finance-subnav-btn ${activeFinanceSubTab === 'claims' ? 'active' : ''}" onclick="switchFinanceSubTab('claims')">
            <span>🧾</span>
            <span>Medical Reimbursements</span>
            ${claimsStats.actionNeededCount > 0 ? `
              <span class="zlog-ood-badge" style="background: #FEE2E2; color: #991B1B; font-size: 0.68rem; padding: 2px 6px;">
                ${claimsStats.actionNeededCount}
              </span>
            ` : ''}
          </button>
          <button class="finance-subnav-btn ${activeFinanceSubTab === 'runway' ? 'active' : ''}" onclick="switchFinanceSubTab('runway')">
            <span>🏦</span>
            <span>Accounts &amp; Runway</span>
          </button>
        </div>

        <div style="display: flex; gap: 8px; align-items: center;">
          ${activeFinanceSubTab === 'burn' ? `
            <button class="btn btn-secondary" onclick="openAdjustBudgetsModal()" style="font-size: 0.78rem; padding: 5px 12px;">
              <i data-lucide="sliders" style="width: 14px; height: 14px;"></i>
              <span>Adjust Budgets</span>
            </button>
          ` : ''}
          ${activeFinanceSubTab === 'subscriptions' ? `
            <button class="btn btn-secondary" onclick="openAddSubscriptionModal()" style="font-size: 0.78rem; padding: 5px 12px;">
              <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
              <span>Add Subscription</span>
            </button>
          ` : ''}
          ${activeFinanceSubTab === 'runway' ? `
            <button class="btn btn-secondary" onclick="openUpdateBalancesModal()" style="font-size: 0.78rem; padding: 5px 12px;">
              <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
              <span>Update Balances</span>
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Dynamic Sub-view Container -->
      <div id="finance-subview-container"></div>
    </div>
  `;

  if (activeFinanceSubTab === 'burn') {
    renderFinanceBurn();
  } else if (activeFinanceSubTab === 'subscriptions') {
    renderFinanceSubscriptions();
  } else if (activeFinanceSubTab === 'claims') {
    renderFinanceClaims();
  } else if (activeFinanceSubTab === 'runway') {
    renderFinanceRunway();
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function switchFinanceSubTab(subTab) {
  if (['burn', 'subscriptions', 'claims', 'runway'].includes(subTab)) {
    activeFinanceSubTab = subTab;
    try {
      localStorage.setItem('BOL_FINANCE_ACTIVE_SUBTAB', subTab);
      const targetHash = (subTab === 'burn') ? 'finance' : `finance/${subTab}`;
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', `#${targetHash}`);
      } else {
        window.location.hash = targetHash;
      }
    } catch (e) {}
  }
  renderFinancePage(subTab);
}

/* ==========================================================================
   Sub-View 1: Monthly Burn & Cash Flow (with Monarch Dropzone & High Spend Flags)
   ========================================================================== */
function renderFinanceBurn() {
  const container = document.getElementById('finance-subview-container');
  if (!container) return;

  const fin = storage.getFinanceData();
  const categories = fin.categories || [];
  const transactions = fin.transactions || [];
  const monthlyTarget = fin.monthlyTarget || 9500;

  // Calendar info for pacing calculations
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthNum = now.getMonth() + 1;
  const currentMonthStr = `${currentYear}-${String(currentMonthNum).padStart(2, '0')}`;
  const daysInMonth = new Date(currentYear, currentMonthNum, 0).getDate();
  const dayOfMonth = now.getDate();
  const daysRemaining = Math.max(1, daysInMonth - dayOfMonth + 1);
  const monthPercentElapsed = (dayOfMonth / daysInMonth);

  // Compute spend per category for current month
  const categorySpendMap = {};
  categories.forEach(c => { categorySpendMap[c.name] = 0; });

  let totalMonthSpend = 0;
  const currentMonthTxs = transactions.filter(t => {
    if (!t || !t.date) return false;
    return t.date.startsWith(currentMonthStr) || t.date.startsWith('2026-10'); // Default to Oct 2026 for demo consistency
  });

  currentMonthTxs.forEach(t => {
    const amt = parseFloat(t.amount) || 0;
    // Categorize
    const catName = t.category || 'Discretionary';
    if (categorySpendMap[catName] === undefined) {
      categorySpendMap[catName] = 0;
    }
    categorySpendMap[catName] += amt;
    totalMonthSpend += amt;
  });

  // Calculate High-Spend Flags
  const flags = [];
  categories.forEach(cat => {
    const spent = categorySpendMap[cat.name] || 0;
    const budget = cat.budget || 0;
    const ratio = budget > 0 ? (spent / budget) : 0;
    const isOverBudget = spent > budget;
    const isPacingHot = ratio >= 0.85 && monthPercentElapsed < 0.85;

    if (isOverBudget) {
      flags.push({
        catId: cat.id,
        category: cat.name,
        type: 'danger',
        label: `🚨 Over Budget by $${(spent - budget).toFixed(2)}`,
        spent,
        budget,
        ratio
      });
    } else if (isPacingHot) {
      flags.push({
        catId: cat.id,
        category: cat.name,
        type: 'warning',
        label: `⚠️ Pacing Hot (${Math.round(ratio * 100)}% spent on Day ${dayOfMonth})`,
        spent,
        budget,
        ratio
      });
    }
  });

  // Safe daily spend allowance
  const remainingBudget = Math.max(0, monthlyTarget - totalMonthSpend);
  const safeDailySpend = (remainingBudget / daysRemaining).toFixed(2);
  const burnPercent = Math.round((totalMonthSpend / monthlyTarget) * 100);

  // Filter transactions for ledger
  let filteredTxs = transactions;
  if (financeTxCategoryFilter !== 'all') {
    filteredTxs = filteredTxs.filter(t => t.category === financeTxCategoryFilter);
  }
  if (financeTxSearchQuery) {
    const q = financeTxSearchQuery.toLowerCase();
    filteredTxs = filteredTxs.filter(t => {
      return (t.merchant || '').toLowerCase().includes(q) ||
             (t.notes || '').toLowerCase().includes(q) ||
             (t.tags || '').toLowerCase().includes(q) ||
             (t.account || '').toLowerCase().includes(q);
    });
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- 1. Hero KPI Cards -->
      <div class="finance-hero-card">
        <div class="finance-hero-header">
          <div>
            <h2 class="finance-hero-title">
              <span>💳</span>
              <span>Monthly Burn &amp; Cash Flow</span>
            </h2>
            <p class="finance-hero-sub">
              Target: $${monthlyTarget.toLocaleString()} / month &bull; ${daysRemaining} days remaining in cycle
            </p>
          </div>
          <span class="zlog-ood-badge" style="background: ${burnPercent > 100 ? '#FEE2E2' : '#D1FAE5'}; color: ${burnPercent > 100 ? '#991B1B' : '#065F46'}; font-size: 0.82rem; padding: 4px 12px;">
            ${burnPercent}% of Target Burned
          </span>
        </div>

        <div class="finance-kpis-grid">
          <div class="finance-kpi-card">
            <span class="finance-kpi-label"><i data-lucide="flame" style="width: 13px; height: 13px; color: #EF4444;"></i> Spent this Month</span>
            <span class="finance-kpi-value" style="color: ${totalMonthSpend > monthlyTarget ? '#DC2626' : 'var(--text-primary)'};">
              $${totalMonthSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span class="finance-kpi-sub">Target: $${monthlyTarget.toLocaleString()}</span>
          </div>

          <div class="finance-kpi-card">
            <span class="finance-kpi-label"><i data-lucide="shield-alert" style="width: 13px; height: 13px; color: ${flags.length > 0 ? '#DC2626' : '#059669'};"></i> High-Spend Flags</span>
            <span class="finance-kpi-value" style="color: ${flags.length > 0 ? '#DC2626' : '#059669'};">
              ${flags.length} Category ${flags.length === 1 ? 'Alert' : 'Alerts'}
            </span>
            <span class="finance-kpi-sub">${flags.filter(f => f.type === 'danger').length} over budget, ${flags.filter(f => f.type === 'warning').length} pacing hot</span>
          </div>

          <div class="finance-kpi-card">
            <span class="finance-kpi-label"><i data-lucide="compass" style="width: 13px; height: 13px; color: #059669;"></i> Safe Daily Allowance</span>
            <span class="finance-kpi-value" style="color: #059669;">
              $${safeDailySpend} / day
            </span>
            <span class="finance-kpi-sub">Remaining balance: $${remainingBudget.toFixed(2)}</span>
          </div>

          <div class="finance-kpi-card">
            <span class="finance-kpi-label"><i data-lucide="file-spreadsheet" style="width: 13px; height: 13px; color: #2563EB;"></i> Monarch Sync</span>
            <span class="finance-kpi-value" style="font-size: 1.15rem; color: #2563EB;">
              ${transactions.length} Transactions
            </span>
            <span class="finance-kpi-sub">1-Click CSV dropzone active</span>
          </div>
        </div>
      </div>

      <!-- 2. High-Spend Flags Alert Banner (Rendered when flags exist) -->
      ${flags.length > 0 ? `
        <div class="finance-flags-banner">
          <div class="finance-flags-header">
            <div class="finance-flags-title">
              <i data-lucide="alert-triangle" style="width: 16px; height: 16px;"></i>
              <span>High-Spend Category Flags Detected</span>
            </div>
            <span style="font-size: 0.76rem; color: #7F1D1D;">Review unbudgeted transactions before cycle close</span>
          </div>
          <div class="finance-flags-list">
            ${flags.map(f => `
              <div class="finance-flag-pill ${f.type}">
                <strong>${escapeHtml(f.category)}:</strong>
                <span>${f.label}</span>
                <span style="opacity: 0.8; font-size: 0.7rem;">($${f.spent.toFixed(2)} / $${f.budget.toFixed(2)})</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- 3. Monarch Money 1-Click CSV Dropzone -->
      <div class="monarch-dropzone" id="monarch-dropzone-el" onclick="triggerMonarchFileInput()">
        <div class="monarch-dropzone-icon">
          <i data-lucide="upload-cloud" style="width: 22px; height: 22px;"></i>
        </div>
        <h3 class="monarch-dropzone-title">Drop Monarch Money CSV Here</h3>
        <p class="monarch-dropzone-desc">
          Drag &amp; drop your Monarch <code>transactions.csv</code> export, or click to browse. Automatically aggregates category spend, calculates pacing, and highlights high-spend flags.
        </p>
        <div class="monarch-dropzone-actions" onclick="event.stopPropagation()">
          <button class="btn btn-secondary" onclick="triggerMonarchFileInput()" style="font-size: 0.78rem; padding: 5px 12px;">
            <i data-lucide="folder-open" style="width: 13px; height: 13px;"></i>
            <span>Browse CSV File</span>
          </button>
          <button class="btn btn-secondary" onclick="loadSampleMonarchData()" style="font-size: 0.78rem; padding: 5px 12px;">
            <i data-lucide="sparkles" style="width: 13px; height: 13px; color: #059669;"></i>
            <span>Load Sample Monarch CSV</span>
          </button>
        </div>
        <input type="file" id="monarch-file-input" accept=".csv" style="display: none;" onchange="handleMonarchFileSelected(event)">
      </div>

      <!-- 4. Category Budget Matrix & Dual Progress Bars -->
      <div class="finance-section-box">
        <div class="finance-section-header">
          <div>
            <h3 class="finance-section-title">
              <i data-lucide="pie-chart" style="width: 18px; height: 18px; color: #059669;"></i>
              <span>Category Budgets &amp; Pacing</span>
            </h3>
            <span style="font-size: 0.78rem; color: var(--text-muted);">Real-time budget utilization compared to days elapsed</span>
          </div>
          <button class="btn btn-secondary" onclick="openAdjustBudgetsModal()" style="font-size: 0.78rem; padding: 4px 10px;">
            <i data-lucide="sliders" style="width: 13px; height: 13px;"></i>
            <span>Edit Budgets</span>
          </button>
        </div>

        <div class="finance-categories-grid">
          ${categories.map(cat => {
            const spent = categorySpendMap[cat.name] || 0;
            const budget = cat.budget || 1;
            const ratio = spent / budget;
            const percent = Math.min(100, Math.round(ratio * 100));
            const isOver = spent > budget;
            const isHot = ratio >= 0.85 && monthPercentElapsed < 0.85;

            let statusClass = '';
            let pillHtml = `<span class="finance-flag-pill safe" style="font-size: 0.68rem; padding: 2px 7px;">${percent}%</span>`;
            let barClass = '';

            if (isOver) {
              statusClass = 'overbudget';
              barClass = 'danger';
              pillHtml = `<span class="finance-flag-pill danger" style="font-size: 0.68rem; padding: 2px 7px;">Over +$${(spent - budget).toFixed(0)}</span>`;
            } else if (isHot) {
              statusClass = 'warning';
              barClass = 'warning';
              pillHtml = `<span class="finance-flag-pill warning" style="font-size: 0.68rem; padding: 2px 7px;">Pacing Hot</span>`;
            }

            return `
              <div class="finance-cat-card ${statusClass}">
                <div class="finance-cat-top">
                  <div class="finance-cat-name">
                    <span>${escapeHtml(cat.name)}</span>
                  </div>
                  ${pillHtml}
                </div>
                <div class="finance-cat-amounts">
                  <span class="finance-cat-spent ${isOver ? 'danger' : ''}">$${spent.toFixed(2)}</span>
                  <span class="finance-cat-budget">Target: $${cat.budget.toLocaleString()}</span>
                </div>
                <div class="finance-prog-track">
                  <div class="finance-prog-fill ${barClass}" style="width: ${percent}%;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 5. Monarch Transactions Ledger -->
      <div class="finance-section-box">
        <div class="finance-section-header">
          <div>
            <h3 class="finance-section-title">
              <i data-lucide="receipt" style="width: 18px; height: 18px; color: #059669;"></i>
              <span>Monarch Transactions Ledger</span>
            </h3>
            <span style="font-size: 0.78rem; color: var(--text-muted);">${filteredTxs.length} items logged</span>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <input type="text" placeholder="Search merchant, tag, or note..." value="${escapeHtml(financeTxSearchQuery)}" oninput="handleFinanceTxSearch(this.value)" class="form-control" style="font-size: 0.78rem; padding: 4px 8px; width: 200px;">
            <select class="form-control" style="font-size: 0.78rem; padding: 4px 8px;" onchange="handleFinanceCatFilter(this.value)">
              <option value="all" ${financeTxCategoryFilter === 'all' ? 'selected' : ''}>All Categories</option>
              ${categories.map(c => `
                <option value="${escapeHtml(c.name)}" ${financeTxCategoryFilter === c.name ? 'selected' : ''}>${escapeHtml(c.name)}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="finance-table-wrapper">
          <table class="finance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Category</th>
                <th>Account</th>
                <th>Tags</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTxs.length === 0 ? `
                <tr>
                  <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">
                    No transactions match the selected filter.
                  </td>
                </tr>
              ` : filteredTxs.map(t => `
                <tr>
                  <td style="white-space: nowrap; font-family: var(--font-mono); font-size: 0.76rem;">${escapeHtml(t.date || '')}</td>
                  <td><strong>${escapeHtml(t.merchant || 'Unknown')}</strong></td>
                  <td><span class="zlog-ood-badge" style="font-size: 0.7rem;">${escapeHtml(t.category || 'General')}</span></td>
                  <td style="color: var(--text-secondary); font-size: 0.74rem;">${escapeHtml(t.account || 'Checking')}</td>
                  <td>
                    ${t.tags ? `<span class="finance-flag-pill ${t.tags.includes('High-Spend') ? 'danger' : 'safe'}" style="font-size: 0.66rem; padding: 1px 6px;">${escapeHtml(t.tags)}</span>` : '<span style="color: var(--text-muted);">&mdash;</span>'}
                  </td>
                  <td class="finance-amount-cell ${t.amount > 500 ? 'danger' : ''}">
                    $${(parseFloat(t.amount) || 0).toFixed(2)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  // Attach Drag and Drop handlers to Monarch dropzone
  setupMonarchDropzoneListeners();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ==========================================================================
   Sub-View 2: Subscriptions & Recurring Commitments
   ========================================================================== */
function renderFinanceSubscriptions() {
  const container = document.getElementById('finance-subview-container');
  if (!container) return;

  const fin = storage.getFinanceData();
  const subs = fin.subscriptions || [];

  const monthlyTotal = subs.reduce((sum, s) => {
    const cost = parseFloat(s.cost) || 0;
    if (s.cadence === 'annual') return sum + (cost / 12);
    if (s.cadence === 'lifetime') return sum;
    return sum + cost;
  }, 0);

  const annualTotal = monthlyTotal * 12;
  const underReviewCount = subs.filter(s => s.status === 'under_review').length;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Hero Card -->
      <div class="finance-hero-card">
        <div class="finance-hero-header">
          <div>
            <h2 class="finance-hero-title">
              <span>🔁</span>
              <span>Subscriptions &amp; Recurring Commitments</span>
            </h2>
            <p class="finance-hero-sub">
              Software, memberships, and ongoing services audit
            </p>
          </div>
          <button class="btn btn-secondary" onclick="openAddSubscriptionModal()" style="font-size: 0.78rem; padding: 5px 12px;">
            <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
            <span>Add Subscription</span>
          </button>
        </div>

        <div class="finance-kpis-grid">
          <div class="finance-kpi-card">
            <span class="finance-kpi-label"><i data-lucide="calendar" style="width: 13px; height: 13px; color: #059669;"></i> Monthly Burn</span>
            <span class="finance-kpi-value" style="color: #059669;">$${monthlyTotal.toFixed(2)}</span>
            <span class="finance-kpi-sub">${subs.length} active recurring commitments</span>
          </div>

          <div class="finance-kpi-card">
            <span class="finance-kpi-label"><i data-lucide="trending-up" style="width: 13px; height: 13px; color: #2563EB;"></i> Annualized Cost</span>
            <span class="finance-kpi-value">$${annualTotal.toFixed(2)}</span>
            <span class="finance-kpi-sub">Total annualized baseline commit</span>
          </div>

          <div class="finance-kpi-card">
            <span class="finance-kpi-label"><i data-lucide="scissors" style="width: 13px; height: 13px; color: ${underReviewCount > 0 ? '#D97706' : '#059669'};"></i> Audit Queue</span>
            <span class="finance-kpi-value" style="color: ${underReviewCount > 0 ? '#D97706' : '#059669'};">
              ${underReviewCount} Under Review
            </span>
            <span class="finance-kpi-sub">Flagged for potential cancellation</span>
          </div>
        </div>
      </div>

      <!-- Subscriptions Grid -->
      <div class="finance-section-box">
        <div class="finance-section-header">
          <h3 class="finance-section-title">
            <i data-lucide="list-checks" style="width: 18px; height: 18px; color: #059669;"></i>
            <span>Active Commitments</span>
          </h3>
        </div>

        <div class="finance-subs-grid">
          ${subs.map(s => `
            <div class="finance-sub-card ${s.status === 'under_review' ? 'under-review' : ''}">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <strong style="font-size: 0.92rem; color: var(--text-primary);">${escapeHtml(s.name)}</strong>
                  <div style="font-size: 0.74rem; color: var(--text-muted);">${escapeHtml(s.category || 'General')} &bull; ${escapeHtml(s.cadence || 'monthly')}</div>
                </div>
                <span class="finance-amount-cell" style="font-size: 1rem; color: #059669;">
                  $${(parseFloat(s.cost) || 0).toFixed(2)}
                </span>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.74rem; margin-top: 4px; padding-top: 4px; border-top: 1px dashed var(--border-color, #E2E8F0);">
                <span style="color: var(--text-secondary);">Renews: <strong>${escapeHtml(s.nextRenewal || 'Monthly')}</strong></span>
                <div style="display: flex; gap: 6px;">
                  <button type="button" class="btn btn-secondary" onclick="toggleSubscriptionAudit('${s.id}')" style="font-size: 0.68rem; padding: 2px 7px;" title="Flag for cancellation audit">
                    ${s.status === 'under_review' ? '⚠️ Under Review' : 'Flag'}
                  </button>
                  <button type="button" class="btn-text-danger" onclick="deleteSubscriptionItem('${s.id}')" style="background: none; border: none; font-size: 0.68rem; color: var(--text-muted); cursor: pointer;" title="Remove subscription">
                    <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
                  </button>
                </div>
              </div>
              ${s.notes ? `<div style="font-size: 0.72rem; color: var(--text-muted); font-style: italic;">${escapeHtml(s.notes)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ==========================================================================
   Sub-View 3: Medical Reimbursements (Seamless ClaimsPage Integration)
   ========================================================================== */
function renderFinanceClaims() {
  const container = document.getElementById('finance-subview-container');
  if (!container) return;

  if (typeof renderClaimsPage === 'function') {
    renderClaimsPage(container);
  } else {
    container.innerHTML = `<div style="padding: 20px; color: var(--text-muted);">Medical Claims engine initializing...</div>`;
  }
}

/* ==========================================================================
   Sub-View 4: Accounts & Runway Calculator
   ========================================================================== */
function renderFinanceRunway() {
  const container = document.getElementById('finance-subview-container');
  if (!container) return;

  const fin = storage.getFinanceData();
  const accounts = fin.accounts || [];
  const monthlyTarget = fin.monthlyTarget || 9500;

  const totalLiquid = accounts.reduce((sum, a) => sum + (parseFloat(a.balance) || 0), 0);
  const runwayMonths = monthlyTarget > 0 ? (totalLiquid / monthlyTarget).toFixed(1) : '—';

  let runwayBadgeClass = 'safe';
  let runwayStatusLabel = 'Healthy Runway (Secure)';
  if (parseFloat(runwayMonths) < 3) {
    runwayBadgeClass = 'danger';
    runwayStatusLabel = 'Critical Runway (< 3 months)';
  } else if (parseFloat(runwayMonths) < 6) {
    runwayBadgeClass = 'warning';
    runwayStatusLabel = 'Moderate Runway (3–6 months)';
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Runway Hero Banner -->
      <div class="finance-runway-hero">
        <div>
          <span style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">
            Cash Runway Calculator
          </span>
          <div class="finance-runway-stat">${runwayMonths} Months</div>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">
            Based on $${monthlyTarget.toLocaleString()} monthly burn target across $${totalLiquid.toLocaleString('en-US', { minimumFractionDigits: 2 })} liquid reserves.
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
          <span class="finance-flag-pill ${runwayBadgeClass}" style="font-size: 0.82rem; padding: 6px 14px;">
            ✓ ${runwayStatusLabel}
          </span>
          <button class="btn btn-secondary" onclick="openUpdateBalancesModal()" style="font-size: 0.78rem; padding: 5px 12px;">
            <i data-lucide="edit-2" style="width: 13px; height: 13px;"></i>
            <span>Update Balances</span>
          </button>
        </div>
      </div>

      <!-- Accounts Grid -->
      <div class="finance-section-box">
        <div class="finance-section-header">
          <div>
            <h3 class="finance-section-title">
              <i data-lucide="wallet" style="width: 18px; height: 18px; color: #059669;"></i>
              <span>Liquid &amp; Cash Accounts</span>
            </h3>
            <span style="font-size: 0.78rem; color: var(--text-muted);">Checking, High-Yield Savings, FSA &amp; Sinking Funds</span>
          </div>
        </div>

        <div class="finance-accounts-grid">
          ${accounts.map(acc => `
            <div class="finance-acc-card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <strong style="font-size: 0.92rem; color: var(--text-primary);">${escapeHtml(acc.name)}</strong>
                  <div style="font-size: 0.74rem; color: var(--text-muted);">${escapeHtml(acc.institution)} &bull; ${escapeHtml(acc.type.toUpperCase())}</div>
                </div>
                ${acc.apy ? `<span class="zlog-ood-badge funded" style="font-size: 0.68rem;">APY ${escapeHtml(acc.apy)}</span>` : ''}
              </div>
              <div class="finance-kpi-value" style="font-size: 1.35rem; color: #059669; margin: 8px 0 4px 0;">
                $${(parseFloat(acc.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">
                Updated: ${escapeHtml(acc.updated || 'Recently')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ==========================================================================
   Monarch CSV Drag & Drop and Parser Logic
   ========================================================================== */
function setupMonarchDropzoneListeners() {
  const dropzone = document.getElementById('monarch-dropzone-el');
  if (!dropzone) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      processMonarchCSVFile(files[0]);
    }
  }, false);
}

function triggerMonarchFileInput() {
  const input = document.getElementById('monarch-file-input');
  if (input) input.click();
}

function handleMonarchFileSelected(event) {
  const file = event.target.files && event.target.files[0];
  if (file) {
    processMonarchCSVFile(file);
  }
}

function processMonarchCSVFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    parseAndLoadMonarchCSV(text);
  };
  reader.readAsText(file);
}

function loadSampleMonarchData() {
  if (typeof DEFAULT_FINANCE_DATA !== 'undefined' && DEFAULT_FINANCE_DATA.sampleMonarchCsv) {
    parseAndLoadMonarchCSV(DEFAULT_FINANCE_DATA.sampleMonarchCsv);
  }
}

function parseAndLoadMonarchCSV(csvText) {
  try {
    const rows = parseCSVString(csvText);
    if (rows.length < 2) {
      alert('The uploaded file does not contain enough transaction rows.');
      return;
    }

    const headers = rows[0].map(h => h.trim().toLowerCase());
    const dateIdx = headers.findIndex(h => h.includes('date'));
    const merchantIdx = headers.findIndex(h => h.includes('merchant') || h.includes('description') || h.includes('payee'));
    const categoryIdx = headers.findIndex(h => h.includes('category'));
    const accountIdx = headers.findIndex(h => h.includes('account'));
    const amountIdx = headers.findIndex(h => h.includes('amount'));
    const tagsIdx = headers.findIndex(h => h.includes('tag'));

    if (amountIdx === -1) {
      alert('Could not locate an "Amount" column in this CSV file.');
      return;
    }

    const newTransactions = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0 || !row[dateIdx]) continue;

      let rawAmount = row[amountIdx] || '0';
      rawAmount = rawAmount.replace(/[\$,]/g, '').trim();
      let amountNum = parseFloat(rawAmount) || 0;
      // In Monarch, expenses are typically negative (-$240). Convert to positive expense for burn tracking.
      amountNum = Math.abs(amountNum);

      const categoryName = (categoryIdx !== -1 && row[categoryIdx]) ? row[categoryIdx].trim() : 'Discretionary';
      const merchantName = (merchantIdx !== -1 && row[merchantIdx]) ? row[merchantIdx].trim() : 'Transaction';
      const accountName = (accountIdx !== -1 && row[accountIdx]) ? row[accountIdx].trim() : 'Account';
      const tagsVal = (tagsIdx !== -1 && row[tagsIdx]) ? row[tagsIdx].trim() : '';

      newTransactions.push({
        id: 'tx-m-' + Date.now() + '-' + i,
        date: row[dateIdx].trim(),
        merchant: merchantName,
        category: categoryName,
        account: accountName,
        amount: amountNum,
        tags: tagsVal
      });
    }

    storage.saveMonarchTransactions(newTransactions);
    if (typeof showToast === 'function') {
      showToast(`Successfully imported ${newTransactions.length} Monarch transactions!`, 'success');
    } else {
      alert(`Successfully imported ${newTransactions.length} Monarch transactions!`);
    }
    renderFinancePage('burn');
  } catch (err) {
    console.error('Error parsing Monarch CSV:', err);
    alert('Failed to parse Monarch CSV file. Please ensure it is a standard CSV.');
  }
}

/**
 * Standard CSV Parser handling quotes and commas
 */
function parseCSVString(text) {
  const lines = text.split(/\r\n|\n/);
  const result = [];
  for (let line of lines) {
    if (!line.trim()) continue;
    const row = [];
    let inQuotes = false;
    let currentField = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentField += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentField);
        currentField = '';
      } else {
        currentField += char;
      }
    }
    row.push(currentField);
    result.push(row);
  }
  return result;
}

function handleFinanceTxSearch(q) {
  financeTxSearchQuery = q;
  renderFinanceBurn();
}

function handleFinanceCatFilter(cat) {
  financeTxCategoryFilter = cat;
  renderFinanceBurn();
}

/* Modals & Actions for Finance */
function toggleSubscriptionAudit(id) {
  const fin = storage.getFinanceData();
  const sub = fin.subscriptions?.find(s => s.id === id);
  if (sub) {
    sub.status = (sub.status === 'under_review') ? 'active' : 'under_review';
    storage.saveFinanceData(fin);
    renderFinanceSubscriptions();
  }
}

function deleteSubscriptionItem(id) {
  if (confirm('Delete this subscription?')) {
    storage.deleteFinanceSubscription(id);
    renderFinanceSubscriptions();
  }
}

function openAddSubscriptionModal() {
  let modal = document.getElementById('modal-add-subscription');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-add-subscription';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-card" style="max-width: 460px;">
      <div class="modal-header">
        <h3 class="modal-title">Add Recurring Subscription</h3>
        <button class="modal-close-btn" onclick="closeAddSubscriptionModal()">&times;</button>
      </div>
      <form onsubmit="submitAddSubscriptionModal(event)">
        <div class="modal-body" style="display: flex; flex-direction: column; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Service / Name</label>
            <input type="text" id="sub-modal-name" class="form-control" placeholder="e.g. Netflix, ChatGPT Plus" required>
          </div>
          <div class="form-group">
            <label class="form-label">Cost ($)</label>
            <input type="number" step="0.01" id="sub-modal-cost" class="form-control" placeholder="19.99" required>
          </div>
          <div class="form-group">
            <label class="form-label">Cadence</label>
            <select id="sub-modal-cadence" class="form-control">
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Category</label>
            <input type="text" id="sub-modal-category" class="form-control" placeholder="Productivity, Fitness, Entertainment">
          </div>
          <div class="form-group">
            <label class="form-label">Next Renewal Date</label>
            <input type="date" id="sub-modal-renewal" class="form-control">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeAddSubscriptionModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Subscription</button>
        </div>
      </form>
    </div>
  `;

  modal.classList.add('active');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function submitAddSubscriptionModal(e) {
  e.preventDefault();
  const sub = {
    name: document.getElementById('sub-modal-name').value.trim(),
    cost: parseFloat(document.getElementById('sub-modal-cost').value) || 0,
    cadence: document.getElementById('sub-modal-cadence').value,
    category: document.getElementById('sub-modal-category').value.trim() || 'General',
    nextRenewal: document.getElementById('sub-modal-renewal').value
  };
  storage.addFinanceSubscription(sub);
  closeAddSubscriptionModal();
  renderFinanceSubscriptions();
}

function closeAddSubscriptionModal() {
  const m = document.getElementById('modal-add-subscription');
  if (m) m.classList.remove('active');
}

function openAdjustBudgetsModal() {
  let modal = document.getElementById('modal-adjust-budgets');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-adjust-budgets';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const fin = storage.getFinanceData();
  const cats = fin.categories || [];

  modal.innerHTML = `
    <div class="modal-card" style="max-width: 500px; max-height: 85vh; overflow-y: auto;">
      <div class="modal-header">
        <h3 class="modal-title">Adjust Category Budgets</h3>
        <button class="modal-close-btn" onclick="closeAdjustBudgetsModal()">&times;</button>
      </div>
      <form onsubmit="submitAdjustBudgetsModal(event)">
        <div class="modal-body" style="display: flex; flex-direction: column; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Total Monthly Burn Target ($)</label>
            <input type="number" id="budget-modal-monthly-target" class="form-control" value="${fin.monthlyTarget || 9500}" required>
          </div>
          <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 6px 0;">
          <h4 style="font-size: 0.82rem; font-weight: 700; color: #059669; margin: 0;">Category Targets ($)</h4>
          ${cats.map(c => `
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
              <span style="font-size: 0.82rem; color: var(--text-primary); flex: 1;">${escapeHtml(c.name)}</span>
              <input type="number" id="cat-budget-${c.id}" class="form-control" value="${c.budget}" style="width: 110px; font-family: var(--font-mono); font-size: 0.82rem;">
            </div>
          `).join('')}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeAdjustBudgetsModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Budgets</button>
        </div>
      </form>
    </div>
  `;

  modal.classList.add('active');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function submitAdjustBudgetsModal(e) {
  e.preventDefault();
  const fin = storage.getFinanceData();
  fin.monthlyTarget = parseFloat(document.getElementById('budget-modal-monthly-target').value) || 9500;
  if (Array.isArray(fin.categories)) {
    fin.categories.forEach(c => {
      const input = document.getElementById(`cat-budget-${c.id}`);
      if (input) c.budget = parseFloat(input.value) || 0;
    });
  }
  storage.saveFinanceData(fin);
  closeAdjustBudgetsModal();
  renderFinanceBurn();
}

function closeAdjustBudgetsModal() {
  const m = document.getElementById('modal-adjust-budgets');
  if (m) m.classList.remove('active');
}

function openUpdateBalancesModal() {
  let modal = document.getElementById('modal-update-balances');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-update-balances';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const fin = storage.getFinanceData();
  const accs = fin.accounts || [];

  modal.innerHTML = `
    <div class="modal-card" style="max-width: 480px;">
      <div class="modal-header">
        <h3 class="modal-title">Update Account Balances</h3>
        <button class="modal-close-btn" onclick="closeUpdateBalancesModal()">&times;</button>
      </div>
      <form onsubmit="submitUpdateBalancesModal(event)">
        <div class="modal-body" style="display: flex; flex-direction: column; gap: 12px;">
          ${accs.map(a => `
            <div class="form-group">
              <label class="form-label">${escapeHtml(a.name)} (${escapeHtml(a.institution)})</label>
              <input type="number" step="0.01" id="acc-bal-${a.id}" class="form-control" value="${a.balance}" required>
            </div>
          `).join('')}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeUpdateBalancesModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Balances</button>
        </div>
      </form>
    </div>
  `;

  modal.classList.add('active');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function submitUpdateBalancesModal(e) {
  e.preventDefault();
  const fin = storage.getFinanceData();
  if (Array.isArray(fin.accounts)) {
    fin.accounts.forEach(a => {
      const input = document.getElementById(`acc-bal-${a.id}`);
      if (input) {
        a.balance = parseFloat(input.value) || 0;
        a.updated = (typeof formatDateIso === 'function') ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0];
      }
    });
  }
  storage.saveFinanceData(fin);
  closeUpdateBalancesModal();
  renderFinanceRunway();
}

function closeUpdateBalancesModal() {
  const m = document.getElementById('modal-update-balances');
  if (m) m.classList.remove('active');
}
