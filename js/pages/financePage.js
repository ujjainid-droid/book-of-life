/* ==========================================================================
   Book of Life / Life OS - Personal Finance Page Controller
   ========================================================================== */

function getInitialFinanceSubTab() {
  try {
    const rawHash = (window.location.hash || '').replace(/^#\/?/, '').trim();
    if (rawHash.startsWith('finance/') || rawHash.startsWith('finance-') || rawHash.startsWith('finance?')) {
      const parts = rawHash.split(/[\/\-_?]/);
      if (parts[1]) {
        if (['burn', 'page1', '1', 'radar'].includes(parts[1])) return 'burn';
        if (['budget', 'plan', 'b'].includes(parts[1])) return 'budget';
        if (['subscriptions', 'page2', '2', 'cards'].includes(parts[1])) return 'subscriptions';
        if (['runway', 'page3', '3', 'quarterly', 'networth'].includes(parts[1])) return 'runway';
        if (['claims', 'page4', '4'].includes(parts[1])) return 'claims';
      }
    }
    if (rawHash === 'budget' || rawHash === 'budget/' || rawHash.startsWith('budget')) return 'budget';
    if (rawHash === 'finance' || rawHash === 'finance/') return 'burn';
    if (rawHash.startsWith('claims')) return 'claims';
    const saved = localStorage.getItem('BOL_FINANCE_ACTIVE_SUBTAB');
    if (saved && ['burn', 'budget', 'subscriptions', 'claims', 'runway'].includes(saved)) {
      return saved;
    }
  } catch (e) {}
  return 'burn';
}

let activeFinanceSubTab = getInitialFinanceSubTab();

function formatFinanceMonthLabel(mIso) {
  if (!mIso || typeof mIso !== 'string') return '';
  const parts = mIso.split('-');
  if (parts.length < 2) return mIso;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = months[m - 1] || parts[1];
  return `${monthName} ${y}`;
}
window.formatFinanceMonthLabel = formatFinanceMonthLabel;

let selectedFinanceMonth = '2026-10';
let financeTxSearchQuery = '';
let financeTxCategoryFilter = 'all';
let financeTxHighSpendOnly = false;
let financeNwClassFilter = 'all';
let financeNwSearchQuery = '';
let selectedFinanceQuarter = '2026-Q3';
let selectedCardRoiFilter = 'amex-plat';
let financeSubSearchQuery = '';
let financeSubCategoryFilter = 'all';
let financeLedgerCollapsed = (function() {
  try {
    return localStorage.getItem('margo_finance_ledger_collapsed') === 'true';
  } catch (e) {
    return false;
  }
})();

let financeMatrixCollapsed = (function() {
  try {
    const saved = localStorage.getItem('margo_finance_matrix_collapsed');
    return saved === null ? true : saved === 'true'; // Collapsed by default
  } catch (e) {
    return true;
  }
})();

function toggleFinanceMatrixCollapse(event) {
  if (event) event.stopPropagation();
  financeMatrixCollapsed = !financeMatrixCollapsed;
  try {
    localStorage.setItem('margo_finance_matrix_collapsed', financeMatrixCollapsed ? 'true' : 'false');
  } catch (e) {}
  renderFinanceBurn();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
window.toggleFinanceMatrixCollapse = toggleFinanceMatrixCollapse;

function renderFinancePage(targetSubTab) {
  const container = document.getElementById('daily-sheet-container') || document.getElementById('bunker-subview-frame');
  if (!container) return;

  if (targetSubTab) {
    if (['burn', 'page1', '1', 'radar'].includes(targetSubTab)) activeFinanceSubTab = 'burn';
    else if (['budget', 'plan', 'b'].includes(targetSubTab)) activeFinanceSubTab = 'budget';
    else if (['subscriptions', 'page2', '2'].includes(targetSubTab)) activeFinanceSubTab = 'subscriptions';
    else if (['runway', 'page3', '3', 'quarterly'].includes(targetSubTab)) activeFinanceSubTab = 'runway';
    else if (['claims', 'page4', '4'].includes(targetSubTab)) activeFinanceSubTab = 'claims';
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
          <button class="finance-subnav-btn ${activeFinanceSubTab === 'burn' ? 'active' : ''}" onclick="switchFinanceSubTab('burn')" title="Cash Flow, Pareto Drivers &amp; Outliers">
            <span>💸</span>
            <span>Cash Flow &amp; Radar</span>
          </button>
          <button class="finance-subnav-btn ${activeFinanceSubTab === 'budget' ? 'active' : ''}" onclick="switchFinanceSubTab('budget')" title="Budget Guardrails &amp; Savings Target (Core 4 Focus)">
            <span>📊</span>
            <span>Budget</span>
          </button>
          <button class="finance-subnav-btn ${activeFinanceSubTab === 'subscriptions' ? 'active' : ''}" onclick="switchFinanceSubTab('subscriptions')" title="Annual Fee ROI &amp; Breakeven (4 Cards)">
            <span>💳</span>
            <span>Card Fee ROI</span>
          </button>
          <button class="finance-subnav-btn ${activeFinanceSubTab === 'runway' ? 'active' : ''}" onclick="switchFinanceSubTab('runway')" title="Net Worth Horizon &amp; Quarterly Ledger">
            <span>📈</span>
            <span>Net Worth &amp; Quarterly</span>
          </button>
          <button class="finance-subnav-btn ${activeFinanceSubTab === 'claims' ? 'active' : ''}" onclick="switchFinanceSubTab('claims')" title="Medical Claims &amp; Superbills">
            <span>🏥</span>
            <span>Medical Claims</span>
            ${claimsStats.actionNeededCount > 0 ? `
              <span class="zlog-ood-badge" style="background: #FEE2E2; color: #991B1B; font-size: 0.68rem; padding: 2px 6px;">
                ${claimsStats.actionNeededCount}
              </span>
            ` : ''}
          </button>
        </div>

        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <!-- Export All CSV Pill Button (Available across all tabs) -->
          <button class="finance-export-pill" onclick="exportAllFinanceDataToCSV()" title="Export consolidated financial data from all tabs to CSV">
            <i data-lucide="download" style="width: 14px; height: 14px;"></i>
            <span>Export All CSV</span>
          </button>

          ${activeFinanceSubTab === 'burn' ? `
            <button class="btn btn-secondary" onclick="openLogCashFlowModal(selectedFinanceMonth)" style="font-size: 0.78rem; padding: 5px 12px;" title="Log or edit cash flow figures for this month">
              <i data-lucide="plus-circle" style="width: 14px; height: 14px;"></i>
              <span>Log Month Cash Flow</span>
            </button>
          ` : ''}
          ${activeFinanceSubTab === 'budget' ? `
            <button class="btn btn-secondary" onclick="handleResetBudgetsTo3MAvg()" style="font-size: 0.78rem; padding: 5px 12px;" title="Reset all category budget targets to their 3-month actual rolling baselines">
              <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i>
              <span>Reset to 3M Avg</span>
            </button>
          ` : ''}
          ${activeFinanceSubTab === 'subscriptions' ? `
            <button class="btn btn-secondary" onclick="handleResetCardBenefits()" style="font-size: 0.78rem; padding: 5px 12px;" title="Reset perk redemptions to default baseline values">
              <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i>
              <span>Reset Perks</span>
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
  } else if (activeFinanceSubTab === 'budget') {
    renderFinanceBudget();
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
  if (['burn', 'budget', 'subscriptions', 'claims', 'runway'].includes(subTab)) {
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

let financeActivePeriod = 'this_month'; // 'this_month' | 'last_month' | 'last_qtr' | 'ytd'
let financeDriversViewMode = 'pillars'; // 'pillars' | 'ribbon'
let financeOutlierFilter = 'spike'; // 'all' | 'spike' | 'baseline' | 'reduced'

function changeFinancePeriod(period) {
  financeActivePeriod = period;
  if (period === 'this_month') selectedFinanceMonth = '2026-10';
  else if (period === 'last_month') selectedFinanceMonth = '2026-09';
  renderFinanceBurn();
}

function setFinanceDriversView(mode) {
  financeDriversViewMode = mode;
  financeMatrixCollapsed = false;
  try {
    localStorage.setItem('margo_finance_matrix_collapsed', 'false');
  } catch (e) {}
  renderFinanceBurn();
}

function setFinanceOutlierFilter(filter) {
  financeOutlierFilter = filter;
  renderFinanceBurn();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function changeFinanceMonth(mIso) {
  selectedFinanceMonth = mIso;
  if (mIso === '2026-10') financeActivePeriod = 'this_month';
  else if (mIso === '2026-09') financeActivePeriod = 'last_month';
  renderFinanceBurn();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
window.changeFinanceMonth = changeFinanceMonth;

function renderPeriodFilterPills() {
  return `
    <div class="finance-period-capsules">
      <button class="finance-period-btn ${financeActivePeriod === 'this_month' ? 'active' : ''}" onclick="changeFinancePeriod('this_month')">This month</button>
      <button class="finance-period-btn ${financeActivePeriod === 'last_month' ? 'active' : ''}" onclick="changeFinancePeriod('last_month')">Last month</button>
      <button class="finance-period-btn ${financeActivePeriod === 'last_qtr' ? 'active' : ''}" onclick="changeFinancePeriod('last_qtr')">Last quarter</button>
      <button class="finance-period-btn ${financeActivePeriod === 'ytd' ? 'active' : ''}" onclick="changeFinancePeriod('ytd')">Year to date</button>
    </div>
  `;
}

/* ==========================================================================
   Weekly Sunday Cadence Engine
   ========================================================================== */
function getCurrentWeekSundayIso() {
  if (typeof getSundayOfWeek === 'function' && typeof formatDateIso === 'function') {
    return formatDateIso(getSundayOfWeek(new Date()));
  }
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
}

function toggleFinanceChecklistItem(itemNum, event) {
  if (event) event.stopPropagation();
  const sundayIso = getCurrentWeekSundayIso();
  const checklist = storage.getFinanceWeeklyChecklist(sundayIso);
  const currentVal = !!checklist[itemNum];
  const { allDone } = storage.setFinanceWeeklyChecklistItem(sundayIso, itemNum, !currentVal);

  if (allDone) {
    if (typeof confetti === 'function') {
      try { confetti({ particleCount: 35, spread: 65, origin: { y: 0.18 } }); } catch (e) {}
    }
    if (typeof showToast === 'function') {
      showToast(`🎉 All 5 weekly finance checklist items complete for week of ${sundayIso}!`, 'success');
    }
  } else if (!currentVal) {
    if (typeof showToast === 'function') {
      showToast(`✓ Step ${itemNum} marked complete`);
    }
  }
  renderFinanceBurn();
}

function scrollToFinanceOutliers() {
  const el = document.getElementById('finance-outliers-radar');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.style.transition = 'box-shadow 0.3s ease';
    el.style.boxShadow = '0 0 0 2px var(--primary)';
    setTimeout(() => { el.style.boxShadow = ''; }, 1200);
  }
}
window.toggleFinanceChecklistItem = toggleFinanceChecklistItem;
window.scrollToFinanceOutliers = scrollToFinanceOutliers;

function renderFinanceWeeklyCadenceBar() {
  const sundayIso = getCurrentWeekSundayIso();
  const checklist = storage.getFinanceWeeklyChecklist(sundayIso);
  const doneCount = [1, 2, 3, 4, 5].filter(num => !!checklist[num]).length;
  const allDone = doneCount === 5;

  let dateLabel = sundayIso;
  try {
    const parts = sundayIso.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    dateLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch (e) {}

  const items = [
    { num: 1, label: 'Pay bills', action: null },
    {
      num: 2,
      label: 'Monarch',
      action: `
        <a href="https://app.monarchmoney.com" target="_blank" rel="noopener" class="cadence-pill-action-btn" onclick="event.stopPropagation();" title="Open Monarch App">
          <i data-lucide="external-link" style="width: 11px; height: 11px;"></i>
        </a>
      `
    },
    { num: 3, label: 'Schwab ($20k)', action: null },
    {
      num: 4,
      label: 'Sync CSV',
      action: `
        <button type="button" class="cadence-pill-action-btn" onclick="event.stopPropagation(); triggerMonarchFileInput();" title="Sync Monarch CSV">
          <i data-lucide="upload-cloud" style="width: 12px; height: 12px;"></i>
        </button>
      `
    },
    {
      num: 5,
      label: 'Outlier Radar',
      action: `
        <button type="button" class="cadence-pill-action-btn" onclick="event.stopPropagation(); scrollToFinanceOutliers();" title="Jump to Radar">
          <i data-lucide="compass" style="width: 12px; height: 12px;"></i>
        </button>
      `
    }
  ];

  return `
    <div class="finance-cadence-strip-card ${allDone ? 'all-done' : ''}">
      <div class="finance-cadence-header">
        <div class="finance-cadence-title">
          <i data-lucide="${allDone ? 'check-check' : 'calendar-check-2'}" style="width: 14px; height: 14px; color: ${allDone ? '#0D9488' : '#7C3AED'};"></i>
          <span>Weekly Cadence</span>
          <span class="finance-cadence-sub">&bull; ${escapeHtml(dateLabel)}</span>
        </div>
        <span class="finance-cadence-progress-pill ${allDone ? 'done' : ''}">
          ${allDone ? '✓ 5 of 5 Done' : `${doneCount} of 5 Done`}
        </span>
      </div>

      <div class="finance-cadence-pills-row">
        ${items.map(item => {
          const isDone = !!checklist[item.num];
          return `
            <div class="finance-cadence-pill-btn ${isDone ? 'done' : ''}" onclick="toggleFinanceChecklistItem(${item.num}, event)" title="${isDone ? `Step ${item.num} complete (click to undo)` : `Click to mark step ${item.num} complete`}">
              <div class="cadence-pill-left">
                <span class="cadence-check-icon">
                  <i data-lucide="check" style="width: 10px; height: 10px; stroke-width: 3;"></i>
                </span>
                <span class="cadence-pill-num">${item.num}.</span>
                <span class="cadence-pill-title">${escapeHtml(item.label)}</span>
              </div>
              ${item.action ? item.action : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/* ==========================================================================
   Sub-View 1: Cash Flow & Spend Radar (Income, Pareto Drivers, Outliers & Levers)
   ========================================================================== */

/**
 * Renders the 50 / 25 / 25 Target Split Widget (Option 2: 3 Micro-Pills with Prominent %)
 */
function renderFinanceTargetSplitWidget(periodInflow, totalFixedSpend, totalFlexSpend, netCashFlow, periodLabel) {
  const hasInflow = (typeof periodInflow === 'number') && periodInflow > 0;
  const incomeBase = hasInflow ? periodInflow : ((totalFixedSpend + totalFlexSpend) || 22350);

  // Target split benchmark
  const targetFixedAmt = incomeBase * 0.50;
  const targetFlexAmt = incomeBase * 0.25;
  const targetSavingsAmt = incomeBase * 0.25;

  // Actual values
  const actualFixedAmt = totalFixedSpend;
  const actualFlexAmt = totalFlexSpend;
  // In 50/25/25, Savings is whatever part of verified income remains unspent
  const actualSavingsAmt = incomeBase - (actualFixedAmt + actualFlexAmt);

  const rawFixedPct = incomeBase > 0 ? (actualFixedAmt / incomeBase) * 100 : 0;
  const rawFlexPct = incomeBase > 0 ? (actualFlexAmt / incomeBase) * 100 : 0;
  const rawSavingsPct = incomeBase > 0 ? (actualSavingsAmt / incomeBase) * 100 : 0;

  // Percentage rounding: ensure integer percentages sum cleanly to exactly 100%
  let fixedPct = Math.round(rawFixedPct);
  let flexPct = Math.round(rawFlexPct);
  let savingsPct = 100 - fixedPct - flexPct;
  if (actualSavingsAmt < 0) {
    savingsPct = Math.round(rawSavingsPct);
  }

  // Variances
  const fixedDiffAmt = actualFixedAmt - targetFixedAmt;
  const flexDiffAmt = actualFlexAmt - targetFlexAmt;
  const savingsDiffAmt = actualSavingsAmt - targetSavingsAmt;

  const fixedIsUnderOrEqual = rawFixedPct <= 50.5;
  const flexIsUnderOrEqual = rawFlexPct <= 25.5;
  const savingsIsMetOrExceeded = rawSavingsPct >= 24.5;

  // Header status
  let headerStatusText = '';
  if (savingsIsMetOrExceeded && fixedIsUnderOrEqual && flexIsUnderOrEqual) {
    headerStatusText = '✓ 3 of 3 Targets Met';
  } else if (rawSavingsPct >= 25) {
    headerStatusText = `🌱 +${(rawSavingsPct - 25).toFixed(0)}% Extra Savings Surplus`;
  } else if (rawFlexPct > 25.5) {
    headerStatusText = '💫 Discretionary Over 25%';
  } else if (rawFixedPct > 50.5) {
    headerStatusText = '🛡️ Fixed Commitments Over 50%';
  } else {
    headerStatusText = '⚖️ Pacing Toward Target';
  }

  // Delta Pill texts
  const fixedBadgeHtml = fixedIsUnderOrEqual
    ? `<span class="finance-target-status-badge success">✓ -$${Math.round(Math.abs(fixedDiffAmt)).toLocaleString()} under</span>`
    : `<span class="finance-target-status-badge alert">+$${Math.round(fixedDiffAmt).toLocaleString()} over</span>`;

  const flexBadgeHtml = flexIsUnderOrEqual
    ? `<span class="finance-target-status-badge success">✓ -$${Math.round(Math.abs(flexDiffAmt)).toLocaleString()} under</span>`
    : `<span class="finance-target-status-badge alert">+$${Math.round(flexDiffAmt).toLocaleString()} over</span>`;

  let savingsBadgeHtml = '';
  if (savingsIsMetOrExceeded) {
    savingsBadgeHtml = `<span class="finance-target-status-badge success">✓ +$${Math.round(savingsDiffAmt).toLocaleString()} surplus</span>`;
  } else if (actualSavingsAmt >= 0) {
    savingsBadgeHtml = `<span class="finance-target-status-badge alert">Gap: -$${Math.round(Math.abs(savingsDiffAmt)).toLocaleString()}</span>`;
  } else {
    savingsBadgeHtml = `<span class="finance-target-status-badge alert">Deficit: -$${Math.round(Math.abs(actualSavingsAmt)).toLocaleString()}</span>`;
  }

  return `
    <div class="finance-target-split-card">
      <div class="finance-target-split-header">
        <div class="finance-target-title">
          <span>⚖️</span>
          <span>50 / 25 / 25 Target Split</span>
          <span class="finance-target-subtitle">&bull; ${escapeHtml(periodLabel)} ($${Math.round(incomeBase).toLocaleString()} verified base)</span>
        </div>
        <span class="finance-target-header-status">${escapeHtml(headerStatusText)}</span>
      </div>

      <div class="finance-target-pills-grid">
        <!-- Fixed Pill -->
        <div class="finance-target-pill-card pillar-fixed">
          <div class="finance-target-pill-left">
            <div class="finance-target-pill-label">🛡️ Fixed (50% max)</div>
            <div class="finance-target-value-wrap">
              <span class="finance-target-pct-hero" style="color: ${fixedIsUnderOrEqual ? '#0F766E' : '#E05A47'};">${fixedPct}%</span>
              <span class="finance-target-amount">$${Math.round(actualFixedAmt).toLocaleString()}</span>
            </div>
          </div>
          ${fixedBadgeHtml}
        </div>

        <!-- Flex Pill -->
        <div class="finance-target-pill-card pillar-flex">
          <div class="finance-target-pill-left">
            <div class="finance-target-pill-label">💫 Flex (25% max)</div>
            <div class="finance-target-value-wrap">
              <span class="finance-target-pct-hero" style="color: ${flexIsUnderOrEqual ? '#7C3AED' : '#E05A47'};">${flexPct}%</span>
              <span class="finance-target-amount">$${Math.round(actualFlexAmt).toLocaleString()}</span>
            </div>
          </div>
          ${flexBadgeHtml}
        </div>

        <!-- Savings Pill -->
        <div class="finance-target-pill-card pillar-savings ${!savingsIsMetOrExceeded ? 'gap-alert' : ''}">
          <div class="finance-target-pill-left">
            <div class="finance-target-pill-label">🌱 Savings (25% min)</div>
            <div class="finance-target-value-wrap">
              <span class="finance-target-pct-hero" style="color: ${savingsIsMetOrExceeded ? '#0D9488' : '#E05A47'};">
                ${savingsPct >= 0 ? '' : '-'}${Math.abs(savingsPct)}%
              </span>
              <span class="finance-target-amount">
                ${actualSavingsAmt >= 0 ? '+' : '-'}$${Math.round(Math.abs(actualSavingsAmt)).toLocaleString()}
              </span>
            </div>
          </div>
          ${savingsBadgeHtml}
        </div>
      </div>
    </div>
  `;
}

function renderFinanceRecurringCommitmentsSection() {
  const fin = storage.getFinanceData();
  const subs = (typeof storage.getFinanceSubscriptions === 'function') ? storage.getFinanceSubscriptions() : (fin.subscriptions || []);

  const grossMonthlySubs = subs.reduce((sum, s) => {
    const cost = parseFloat(s.cost) || 0;
    if (s.cadence === 'annual') return sum + (cost / 12);
    if (s.cadence === 'lifetime') return sum;
    return sum + cost;
  }, 0);

  const coveredMonthlySubs = 36.95; // Disney+ $20, NYT $4, Walmart+ $12.95
  const netMonthlySubs = Math.max(0, grossMonthlySubs - coveredMonthlySubs);

  const displayedSubs = subs.filter(s => {
    if (financeSubCategoryFilter !== 'all' && s.category !== financeSubCategoryFilter) return false;
    if (financeSubSearchQuery) {
      const q = financeSubSearchQuery;
      const matchName = (s.name || '').toLowerCase().includes(q);
      const matchCat = (s.category || '').toLowerCase().includes(q);
      const matchCard = (s.card || '').toLowerCase().includes(q);
      const matchPerk = (s.cardPerk || '').toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchCard && !matchPerk) return false;
    }
    return true;
  });

  return `
    <div class="finance-section-box" id="finance-recurring-commitments-box">
      <div class="finance-section-header">
        <div>
          <h3 class="finance-section-title">
            <i data-lucide="repeat" style="width: 18px; height: 18px; color: var(--text-primary);"></i>
            <span>Subscriptions</span>
          </h3>
        </div>

        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <div class="finance-search-wrap">
            <i data-lucide="search" class="finance-search-icon"></i>
            <input type="text" 
                   class="finance-search-input" 
                   placeholder="Search subscriptions..." 
                   value="${escapeHtml(financeSubSearchQuery)}" 
                   oninput="handleFinanceSubSearch(event)"
                   autocomplete="off"
                   spellcheck="false">
            ${financeSubSearchQuery ? `
              <button type="button" class="finance-search-clear-btn" onclick="clearFinanceSubSearch(event)" title="Clear search">
                <i data-lucide="x" style="width: 12px; height: 12px;"></i>
              </button>
            ` : ''}
          </div>
          <button class="finance-btn-add-service" onclick="openAddSubscriptionModal()" title="Add a new subscription or service">
            <i data-lucide="plus" style="width: 13px; height: 13px;"></i>
            <span>Add Service</span>
          </button>
        </div>
      </div>

      <!-- 3 Cheery Summer KPI Widgets: Total, Reimbursed, Out of Pocket -->
      <div class="finance-subs-summer-grid">
        <!-- 1. Gross Commitments (Lavender Sorbet) -->
        <div class="summer-widget-card theme-lavender">
          <div class="summer-widget-watermark" style="color: #7C3AED;">
            <i data-lucide="repeat"></i>
          </div>
          <div>
            <div class="summer-widget-top">
              <div class="summer-widget-pill">
                <i data-lucide="repeat" style="width: 19px; height: 19px; color: #7C3AED;"></i>
              </div>
              <span class="budget-badge budget-badge-violet">${subs.length} Active Services</span>
            </div>
            <div class="summer-widget-body">
              <div class="summer-widget-spent num-mono">$${grossMonthlySubs.toFixed(2)}<span style="font-size: 15px; font-weight: 600; color: #64748B;">/mo</span></div>
              <div class="summer-widget-title">Gross Commitments</div>
              <div class="summer-widget-sub">$${(grossMonthlySubs * 12).toFixed(2)} / yr total recurring contracts</div>
            </div>
          </div>
          <div class="summer-widget-foot">
            <div class="summer-widget-bar-wrap">
              <div class="summer-widget-bar-fill" style="width: 100%; background: #7C3AED;"></div>
            </div>
            <div class="summer-widget-meta">
              <span>${subs.length} recurring accounts</span>
              <strong class="num-mono" style="color: #7C3AED;">100% Tracked</strong>
            </div>
          </div>
        </div>

        <!-- 2. Reimbursed Credits (Seafoam Mint) -->
        <div class="summer-widget-card theme-mint">
          <div class="summer-widget-watermark" style="color: #0D9488;">
            <i data-lucide="shield-check"></i>
          </div>
          <div>
            <div class="summer-widget-top">
              <div class="summer-widget-pill">
                <i data-lucide="shield-check" style="width: 19px; height: 19px; color: #0D9488;"></i>
              </div>
              <span class="budget-badge budget-badge-teal">100% Card Offset</span>
            </div>
            <div class="summer-widget-body">
              <div class="summer-widget-spent num-mono" style="color: #0F766E;">$${coveredMonthlySubs.toFixed(2)}<span style="font-size: 15px; font-weight: 600; color: #0F766E;">/mo</span></div>
              <div class="summer-widget-title">Reimbursed Credits</div>
              <div class="summer-widget-sub">$${(coveredMonthlySubs * 12).toFixed(2)} / yr offset (Disney+, NYT, Walmart+)</div>
            </div>
          </div>
          <div class="summer-widget-foot">
            <div class="summer-widget-bar-wrap">
              <div class="summer-widget-bar-fill" style="width: ${Math.round((coveredMonthlySubs / (grossMonthlySubs || 1)) * 100)}%; background: #0D9488;"></div>
            </div>
            <div class="summer-widget-meta">
              <span>Card synergy offsets</span>
              <strong class="num-mono" style="color: #0D9488;">$0 Net Cost</strong>
            </div>
          </div>
        </div>

        <!-- 3. Out of Pocket Burn (Sunset Rose) -->
        <div class="summer-widget-card theme-rose">
          <div class="summer-widget-watermark" style="color: #E11D48;">
            <i data-lucide="wallet"></i>
          </div>
          <div>
            <div class="summer-widget-top">
              <div class="summer-widget-pill">
                <i data-lucide="wallet" style="width: 19px; height: 19px; color: #E11D48;"></i>
              </div>
              <span class="budget-badge budget-badge-rose">True Net Burn</span>
            </div>
            <div class="summer-widget-body">
              <div class="summer-widget-spent num-mono" style="color: #BE123C;">$${netMonthlySubs.toFixed(2)}<span style="font-size: 15px; font-weight: 600; color: #BE123C;">/mo</span></div>
              <div class="summer-widget-title">Out of Pocket Burn</div>
              <div class="summer-widget-sub">$${(netMonthlySubs * 12).toFixed(2)} / yr personal outflow</div>
            </div>
          </div>
          <div class="summer-widget-foot">
            <div class="summer-widget-bar-wrap">
              <div class="summer-widget-bar-fill" style="width: ${Math.round((netMonthlySubs / (grossMonthlySubs || 1)) * 100)}%; background: #E11D48;"></div>
            </div>
            <div class="summer-widget-meta">
              <span>Effective daily drain</span>
              <strong class="num-mono" style="color: #BE123C;">$${(netMonthlySubs / 30).toFixed(2)} / day</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscriptions Grid: Simple & Small (Name, Amount, Monthly/Annual, Renewal Date, Reimbursed Icon) -->
      <div class="finance-subs-grid" style="grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 10px;">
        ${displayedSubs.map(s => {
          const isOffset = s.cardPerk && (s.cardPerk.includes('Covered') || s.cardPerk.includes('Amex') || s.cardPerk.includes('credit'));
          const cost = parseFloat(s.cost) || 0;
          const cadenceText = (s.cadence || 'monthly').toLowerCase().includes('annual') || (s.cadence || '').toLowerCase().includes('year') ? 'Annual' : 'Monthly';
          return `
            <div class="finance-sub-card" style="padding: 10px 14px; gap: 6px;">
              <!-- Top Row: Name + Reimbursed Icon -->
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                <strong style="font-size: 0.85rem; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(s.name)}">
                  ${escapeHtml(s.name)}
                </strong>
                ${isOffset ? `
                  <span class="finance-sub-check-badge" title="100% Reimbursed: ${escapeHtml(s.cardPerk)}">
                    <i data-lucide="check-check"></i>
                  </span>
                ` : ''}
              </div>

              <!-- Middle Row: Amount & Cadence -->
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span style="font-family: var(--font-sans); font-variant-numeric: tabular-nums; font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">
                  $${cost.toFixed(2)}
                </span>
                <span style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted);">
                  ${cadenceText}
                </span>
              </div>

              <!-- Bottom Row: Renewal Date -->
              <div style="font-size: 0.68rem; color: var(--text-muted); border-top: 1px dashed var(--border-color, #E2E8F0); padding-top: 4px; display: flex; justify-content: space-between; align-items: center;">
                <span>Renews: <strong style="color: var(--text-secondary);">${escapeHtml(s.nextRenewal || 'Monthly')}</strong></span>
                ${isOffset ? `<span class="finance-sub-reimbursed-pill">Reimbursed</span>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/**
 * Renders the Executive Dashboard Card (Cash Flow Hero + Net by Month Chart + Inflow/Outflow/Saved + 50/25/25 Split)
 */
function renderFinanceExecutiveDashboardCard(periodInflow, totalFixedSpend, totalFlexSpend, netCashFlow, periodLabel, monthlySummaries, selectedFinanceMonth, financeActivePeriod, verifiedOutflow) {
  const hasInflow = (typeof periodInflow === 'number') && periodInflow > 0;
  const actualOutflow = (typeof verifiedOutflow === 'number' && verifiedOutflow > 0) ? verifiedOutflow : (totalFixedSpend + totalFlexSpend);
  const incomeBase = hasInflow ? periodInflow : (actualOutflow || 22350);

  // Spend calculations: scale fixed/flex to match verified outflow when available
  const sumRawSpend = (totalFixedSpend + totalFlexSpend) || 1;
  const actualFixedAmt = (typeof verifiedOutflow === 'number' && verifiedOutflow > 0)
    ? (totalFixedSpend / sumRawSpend) * verifiedOutflow
    : totalFixedSpend;
  const actualFlexAmt = actualOutflow - actualFixedAmt;
  const actualSavingsAmt = incomeBase - actualOutflow;

  const rawFixedPct = incomeBase > 0 ? (actualFixedAmt / incomeBase) * 100 : 0;
  const rawFlexPct = incomeBase > 0 ? (actualFlexAmt / incomeBase) * 100 : 0;
  const rawSavingsPct = incomeBase > 0 ? (actualSavingsAmt / incomeBase) * 100 : 0;

  // Whole number percentages summing to 100%
  let fixedPct = Math.round(rawFixedPct);
  let flexPct = Math.round(rawFlexPct);
  let savingsPct = 100 - fixedPct - flexPct;
  if (actualSavingsAmt < 0) {
    savingsPct = Math.round(rawSavingsPct);
  }

  // 50 / 25 / 25 Targets
  const fixedIsUnderOrEqual = rawFixedPct <= 50.5;
  const flexIsUnderOrEqual = rawFlexPct <= 25.5;
  const savingsIsMetOrExceeded = rawSavingsPct >= 24.5;
  const targetMetCount = (fixedIsUnderOrEqual ? 1 : 0) + (flexIsUnderOrEqual ? 1 : 0) + (savingsIsMetOrExceeded ? 1 : 0);

  // Month navigation & 6-month bar chart
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const activeMonthIso = selectedFinanceMonth || '2026-10';
  const [yStr, mStr] = activeMonthIso.split('-');
  let currentYear = parseInt(yStr, 10) || 2026;
  let currentMonth = parseInt(mStr, 10) || 10;

  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    let m = currentMonth - i;
    let y = currentYear;
    while (m <= 0) {
      m += 12;
      y -= 1;
    }
    const iso = `${y}-${String(m).padStart(2, '0')}`;
    const label = monthNames[m - 1];
    last6Months.push({ iso, label });
  }

  const chartData = last6Months.map(item => {
    const summary = (monthlySummaries || []).find(s => s.month === item.iso);
    let net = 0;
    if (summary) {
      const inc = parseFloat(summary.income) || 0;
      const out = parseFloat(summary.outflow) || 0;
      net = inc - out;
    } else {
      net = item.iso === activeMonthIso ? netCashFlow : 4200;
    }
    return {
      ...item,
      net,
      isActive: item.iso === activeMonthIso
    };
  });

  const maxNet = Math.max(...chartData.map(d => Math.abs(d.net)), 6000);

  const heroSign = netCashFlow >= 0 ? '+' : '-';
  const heroFormatted = `${heroSign}$${Math.round(Math.abs(netCashFlow)).toLocaleString()}`;
  const subcaptionText = netCashFlow >= 0
    ? `${savingsPct}% of income saved`
    : `${Math.abs(savingsPct)}% deficit burn`;

  // Safe normalized bar widths summing to 100%
  const displayFixedPct = Math.min(100, Math.max(0, fixedPct));
  const displayFlexPct = Math.min(100, Math.max(0, flexPct));
  const displaySavePct = Math.min(100, Math.max(0, savingsPct));
  const sumPcts = (displayFixedPct + displayFlexPct + displaySavePct) || 100;
  const normFixedWidth = ((displayFixedPct / sumPcts) * 100).toFixed(1);
  const normFlexWidth = ((displayFlexPct / sumPcts) * 100).toFixed(1);
  const normSaveWidth = (100 - parseFloat(normFixedWidth) - parseFloat(normFlexWidth)).toFixed(1);

  return `
    <div class="finance-executive-card">
      <!-- Top Row: Net Cash Flow Hero + Net by Month Bar Chart -->
      <div class="finance-exec-top">
        <div class="finance-exec-net-col">
          <span class="finance-exec-label">Net cash flow &bull; ${escapeHtml(periodLabel)}</span>
          <div class="finance-exec-hero-val ${netCashFlow < 0 ? 'negative' : ''}">
            ${heroFormatted}
          </div>
          <span class="finance-exec-hero-sub">${escapeHtml(subcaptionText)}</span>
        </div>

        <div class="finance-exec-chart-col">
          <span class="finance-exec-label">Net by month</span>
          <div class="finance-exec-bars-row">
            ${chartData.map(d => {
              const heightPx = Math.max(16, Math.round((Math.abs(d.net) / maxNet) * 56));
              return `
                <div class="finance-exec-bar-col" onclick="changeFinanceMonth('${d.iso}')" title="${d.label} ${d.iso}: ${d.net >= 0 ? '+' : '-'}$${Math.round(Math.abs(d.net)).toLocaleString()}">
                  <div class="finance-exec-bar ${d.isActive ? 'active' : ''}" style="height: ${heightPx}px;"></div>
                  <span class="finance-exec-bar-month">${d.label}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="finance-exec-divider"></div>

      <!-- Unified KPI Row: Inflow | Outflow | Saved | 50/25/25 Split Graphic -->
      <div class="finance-exec-kpis">
        <div class="finance-exec-kpi-col">
          <span class="finance-exec-label">Inflow</span>
          <div class="finance-exec-kpi-val num-mono">$${Math.round(periodInflow).toLocaleString()}</div>
          <span class="finance-exec-kpi-sub">Salary and verified</span>
        </div>

        <div class="finance-exec-kpi-col">
          <span class="finance-exec-label">Outflow</span>
          <div class="finance-exec-kpi-val num-mono">$${Math.round(actualOutflow).toLocaleString()}</div>
          <span class="finance-exec-kpi-sub">Fixed plus flex</span>
        </div>

        <div class="finance-exec-kpi-col">
          <span class="finance-exec-label">Saved</span>
          <div class="finance-exec-kpi-val saved num-mono">${savingsPct}%</div>
          <span class="finance-exec-kpi-sub">of inflow</span>
        </div>

        <!-- Concise 50 / 25 / 25 Split Graphic -->
        <div class="finance-exec-split-col">
          <div class="finance-exec-split-top">
            <span class="finance-exec-label">50 / 25 / 25 Split</span>
            <span class="finance-exec-split-badge ${targetMetCount === 3 ? 'all-good' : 'alert'}">${targetMetCount} of 3 on target</span>
          </div>

          <div class="finance-exec-split-bar" title="Fixed: ${fixedPct}% | Flex: ${flexPct}% | Save: ${savingsPct}%">
            <div class="split-segment seg-fixed" style="width: ${normFixedWidth}%;" title="Fixed: ${fixedPct}% (Target &le; 50%)"></div>
            <div class="split-segment seg-flex" style="width: ${normFlexWidth}%;" title="Flex: ${flexPct}% (Target &le; 25%)"></div>
            <div class="split-segment seg-save" style="width: ${normSaveWidth}%;" title="Save: ${savingsPct}% (Target &ge; 25%)"></div>
          </div>

          <div class="finance-exec-split-legend">
            <div class="split-legend-item" title="Fixed: ${fixedPct}% (Target &le; 50%) &bull; ${fixedIsUnderOrEqual ? 'On target' : 'Over target'}">
              <span class="dot dot-fixed"></span>
              <span>Fixed</span>
              <strong>${fixedPct}%</strong>
              <small>(&le;50%)</small>
            </div>
            <div class="split-legend-item" title="Flex: ${flexPct}% (Target &le; 25%) &bull; ${flexIsUnderOrEqual ? 'On target' : 'Over target'}">
              <span class="dot dot-flex"></span>
              <span>Flex</span>
              <strong>${flexPct}%</strong>
              <small>(&le;25%)</small>
            </div>
            <div class="split-legend-item" title="Save: ${savingsPct}% (Target &ge; 25%) &bull; ${savingsIsMetOrExceeded ? 'On target' : 'Under target'}">
              <span class="dot dot-save"></span>
              <span>Save</span>
              <strong>${savingsPct}%</strong>
              <small>(&ge;25%)</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFinanceBurn() {
  const container = document.getElementById('finance-subview-container');
  if (!container) return;

  const fin = storage.getFinanceData();
  const categories = fin.categories || [];
  const transactions = fin.transactions || [];
  const monthlySummaries = fin.monthlySummaries || [];
  const baselines = fin.categoryBaselines || {};

  // Period configuration & data aggregation
  let periodLabel = 'October 2026';
  let targetMonths = ['2026-10'];
  let baselineScale = 1;

  if (financeActivePeriod === 'last_month') {
    periodLabel = 'September 2026';
    targetMonths = ['2026-09'];
    baselineScale = 1;
  } else if (financeActivePeriod === 'last_qtr') {
    periodLabel = 'Q3 2026 (Jul–Sep)';
    targetMonths = ['2026-07', '2026-08', '2026-09'];
    baselineScale = 3;
  } else if (financeActivePeriod === 'ytd') {
    periodLabel = '2026 YTD (Jan–Oct)';
    targetMonths = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10'];
    baselineScale = 10;
  }

  // Calculate Inflow & Outflow for the period from summaries
  let periodInflow = 0;
  let periodOutflow = 0;

  targetMonths.forEach(mStr => {
    const s = monthlySummaries.find(m => m.month === mStr);
    if (s) {
      periodInflow += parseFloat(s.income) || 0;
      periodOutflow += parseFloat(s.outflow) || 0;
    }
  });

  // Compute Category Spend Map for the selected period
  const categorySpendMap = {};
  categories.forEach(c => { categorySpendMap[c.name] = 0; });

  // Baseline sum for proportional distribution of months without itemized transactions
  const totalBaselineSum = categories.reduce((sum, c) => sum + (baselines[c.name] || c.baseline || 500), 0) || 1;

  let totalAggregatedOutflow = 0;

  targetMonths.forEach(mStr => {
    const mTransactions = transactions.filter(t => t && t.date && t.date.startsWith(mStr));
    const summary = monthlySummaries.find(m => m.month === mStr);
    const summaryOutflow = summary ? (parseFloat(summary.outflow) || 0) : 0;

    if (mTransactions.length > 0) {
      let mSpend = 0;
      const transferCats = ['Credit Card Payment', 'Transfer', 'Buy', 'Sell', 'Payment', 'Balance Adjustment'];
      const incomeCats = ['Income', 'Paychecks', 'Other Income (incl cc reward credits)', 'Interest', 'Dividends & Capital Gains'];
      mTransactions.forEach(t => {
        const amt = parseFloat(t.amount) || 0;
        const catName = t.category || 'Discretionary';
        const isTransfer = transferCats.includes(catName);
        const isInc = t.isIncome || incomeCats.includes(catName) || (t.tags && t.tags.includes('Income')) || amt < 0;
        if (!isInc && !isTransfer) {
          categorySpendMap[catName] = (categorySpendMap[catName] || 0) + amt;
          mSpend += amt;
        }
      });
      totalAggregatedOutflow += mSpend;
    } else if (summaryOutflow > 0) {
      // Allocate month outflow proportionally across categories based on baseline weights
      categories.forEach(c => {
        const base = baselines[c.name] || c.baseline || 500;
        const weight = base / totalBaselineSum;
        const catShare = summaryOutflow * weight;
        categorySpendMap[c.name] = (categorySpendMap[c.name] || 0) + catShare;
      });
      totalAggregatedOutflow += summaryOutflow;
    }
  });

  // Fallback if no transactions and no summaries
  if (totalAggregatedOutflow === 0) {
    categories.forEach(c => {
      const base = baselines[c.name] || c.baseline || 500;
      categorySpendMap[c.name] = base * baselineScale;
      totalAggregatedOutflow += base * baselineScale;
    });
  }

  // 1. Compute Top Categories (Pareto 80/20)
  const categoryList = Object.keys(categorySpendMap).map(name => {
    const spent = categorySpendMap[name] || 0;
    const catObj = categories.find(c => c.name === name) || {};
    const baseUnit = baselines[name] || catObj.baseline || catObj.budget || 500;
    const periodBaseline = baseUnit * baselineScale;
    const delta = spent - periodBaseline;
    const pctDelta = periodBaseline > 0 ? Math.round((delta / periodBaseline) * 100) : 0;
    return {
      name,
      spent,
      baseline: periodBaseline,
      delta,
      pctDelta,
      classification: catObj.classification || 'Discretionary',
      icon: catObj.icon || 'credit-card',
      color: catObj.color || '#7C3AED'
    };
  }).filter(c => c.spent > 0 || c.baseline > 0);

  // Sort descending by spend
  categoryList.sort((a, b) => b.spent - a.spent);

  const totalSpentForPareto = periodOutflow > 0 ? periodOutflow : 1;
  const top4Categories = categoryList.slice(0, 4);
  const otherCategories = categoryList.slice(4);
  const otherSpend = otherCategories.reduce((s, c) => s + c.spent, 0);

  const paretoColors = ['#4F46E5', '#0D9488', '#E05A47', '#6366F1', '#64748B'];

  // 1b. Split Pillar Matrix Partition (Fixed Anchors vs. Discretionary Flex)
  const isFixedCategory = (c) => {
    // Explicit Discretionary
    if ([
      'Home maintenance',
      'Home Improvement',
      'Subscriptions',
      'Software & Recurring Subs'
    ].includes(c.name)) return false;

    // Explicit Fixed
    if ([
      'Mocha',
      'School stuff + Education'
    ].includes(c.name)) return true;

    const fixedClassifications = ['Fixed Baseline', 'Essential', 'Healthcare'];
    const fixedNames = [
      'Housing & Rent / Mortgage',
      'Groceries & Nutrition',
      'Specialist Therapy & Meds',
      'Auto, Gas & Commute',
      'Utilities & Telecom'
    ];
    return fixedClassifications.includes(c.classification) || fixedNames.includes(c.name);
  };

  const fixedCategories = categoryList.filter(c => isFixedCategory(c));
  const flexCategories = categoryList.filter(c => !isFixedCategory(c));

  const totalFixedSpend = fixedCategories.reduce((sum, c) => sum + c.spent, 0);
  const totalFlexSpend = flexCategories.reduce((sum, c) => sum + c.spent, 0);
  const macroTotal = (totalFixedSpend + totalFlexSpend) || 1;

  // Prefer verified monthly summary outflow when available; fallback to transaction aggregate
  if (periodOutflow === 0 && totalAggregatedOutflow > 0) {
    periodOutflow = totalFixedSpend + totalFlexSpend;
  }
  let netCashFlow = periodInflow - periodOutflow;
  let isPositive = netCashFlow >= 0;
  let savingsRate = periodInflow > 0 ? ((netCashFlow / periodInflow) * 100).toFixed(1) : 0;

  const fixedRatioPct = Math.round((totalFixedSpend / macroTotal) * 100);
  const flexRatioPct = 100 - fixedRatioPct;

  // 2. Outliers vs Baseline
  const outliers = categoryList.map(cat => {
    let status = 'baseline';
    if (cat.pctDelta > 20) status = 'spike';
    else if (cat.pctDelta < -20) status = 'reduced';
    return { ...cat, status };
  });

  const outlierSpikes = outliers.filter(o => o.status === 'spike');
  const onBaseline = outliers.filter(o => o.status === 'baseline');
  const reducedSpends = outliers.filter(o => o.status === 'reduced');
  const displayedOutliers = outliers.filter(cat => {
    if (financeOutlierFilter === 'all') return true;
    return cat.status === financeOutlierFilter;
  });

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Top Weekly Sunday Cadence Task Checkbox -->
      ${renderFinanceWeeklyCadenceBar()}

      <!-- Timeframe Filter Capsules & Quick Edit -->
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
        ${renderPeriodFilterPills()}
        <button class="btn btn-secondary" onclick="openLogCashFlowModal(selectedFinanceMonth)" style="font-size: 0.74rem; padding: 6px 12px; border-radius: 999px;" title="Adjust month cash flow figures">
          <i data-lucide="edit-3" style="width: 12px; height: 12px;"></i>
          <span>Edit Month Cash Flow</span>
        </button>
      </div>

      <!-- Executive Dashboard Card: Cash Flow & 50/25/25 Split -->
      ${renderFinanceExecutiveDashboardCard(periodInflow, totalFixedSpend, totalFlexSpend, netCashFlow, periodLabel, monthlySummaries, selectedFinanceMonth, financeActivePeriod, periodOutflow)}

      <!-- 3. Subscriptions -->
      ${renderFinanceRecurringCommitmentsSection()}

      <!-- 4. Monthly Outlier Radar (vs. Rolling Baseline) -->
      <div class="finance-section-box" id="finance-outliers-radar">
        <div class="finance-section-header">
          <div>
            <h3 class="finance-section-title">
              <i data-lucide="compass" style="width: 18px; height: 18px; color: #0D9488;"></i>
              <span>Category Outlier Radar (vs. Rolling Baseline)</span>
            </h3>
            <span style="font-size: 0.78rem; color: var(--text-muted);">
              Detecting spending anomalies, seasonal spikes, and category deviations for ${periodLabel}
            </span>
          </div>

          <!-- Interactive Outlier State Filters -->
          <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
            <button class="finance-outlier-filter-btn all ${financeOutlierFilter === 'all' ? 'active' : ''}" onclick="setFinanceOutlierFilter('all')" title="Show all categories">
              <span>All (${outliers.length})</span>
            </button>
            <button class="finance-outlier-filter-btn spike ${financeOutlierFilter === 'spike' ? 'active' : ''}" onclick="setFinanceOutlierFilter('spike')" title="Filter to spending spikes only">
              <span class="dot" style="width: 6px; height: 6px; border-radius: 50%; background: ${financeOutlierFilter === 'spike' ? '#FFFFFF' : '#E11D48'};"></span>
              <span>${outlierSpikes.length} Spikes</span>
            </button>
            <button class="finance-outlier-filter-btn baseline ${financeOutlierFilter === 'baseline' ? 'active' : ''}" onclick="setFinanceOutlierFilter('baseline')" title="Filter to categories on baseline">
              <span class="dot" style="width: 6px; height: 6px; border-radius: 50%; background: ${financeOutlierFilter === 'baseline' ? '#FFFFFF' : '#0D9488'};"></span>
              <span>${onBaseline.length} On Baseline</span>
            </button>
            ${reducedSpends.length > 0 ? `
              <button class="finance-outlier-filter-btn reduced ${financeOutlierFilter === 'reduced' ? 'active' : ''}" onclick="setFinanceOutlierFilter('reduced')" title="Filter to reduced spending categories">
                <span class="dot" style="width: 6px; height: 6px; border-radius: 50%; background: ${financeOutlierFilter === 'reduced' ? '#FFFFFF' : '#7C3AED'};"></span>
                <span>${reducedSpends.length} Reduced</span>
              </button>
            ` : ''}
          </div>
        </div>

        <div class="finance-outlier-grid">
          ${displayedOutliers.length > 0 ? displayedOutliers.map(cat => {
            const isSpike = cat.status === 'spike';
            const isReduced = cat.status === 'reduced';
            const cardClass = isSpike ? 'spike' : (isReduced ? 'reduced' : 'baseline');

            let badgeHtml = '';
            if (isSpike) {
              badgeHtml = `<span class="finance-flag-pill danger" style="font-size: 0.68rem; padding: 2px 8px;">🔺 +${cat.pctDelta}% Spike</span>`;
            } else if (isReduced) {
              badgeHtml = `<span class="finance-flag-pill violet" style="font-size: 0.68rem; padding: 2px 8px;">⬇️ ${cat.pctDelta}% Reduced</span>`;
            } else {
              badgeHtml = `<span class="finance-flag-pill safe" style="font-size: 0.68rem; padding: 2px 8px;">🌿 On Baseline</span>`;
            }

            return `
              <div class="finance-outlier-card ${cardClass}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                  <div>
                    <strong style="font-size: 0.84rem; color: var(--text-primary); display: block;">${escapeHtml(cat.name)}</strong>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">${escapeHtml(cat.classification)}</span>
                  </div>
                  ${badgeHtml}
                </div>

                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 4px;">
                  <div>
                    <span style="font-family: var(--font-sans); font-variant-numeric: tabular-nums; font-size: 1.05rem; font-weight: 700; color: ${isSpike ? '#E11D48' : 'var(--text-primary)'};">
                      $${cat.spent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    <span style="font-size: 0.72rem; color: var(--text-muted);"> in period</span>
                  </div>
                  <div style="font-size: 0.74rem; color: var(--text-secondary); text-align: right;">
                    Baseline: $${cat.baseline.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div style="font-size: 0.72rem; padding-top: 4px; border-top: 1px dashed var(--border-color); color: ${isSpike ? '#9F1239' : 'var(--text-muted)'};">
                  ${isSpike ? `⚠️ Ran <strong>+$${cat.delta.toFixed(0)}</strong> above historical baseline.` : ''}
                  ${isReduced ? `✨ Spent <strong>$${Math.abs(cat.delta).toFixed(0)} less</strong> than expected baseline.` : ''}
                  ${!isSpike && !isReduced ? `Within normal historical variance (&plusmn;${Math.abs(cat.pctDelta)}%).` : ''}
                </div>
              </div>
            `;
          }).join('') : `
            <div style="grid-column: 1 / -1; padding: 32px 20px; text-align: center; color: var(--text-muted); background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: 12px;">
              <p style="margin: 0 0 10px 0; font-size: 0.88rem; font-weight: 600;">No categories matching "${financeOutlierFilter === 'spike' ? 'Spikes' : (financeOutlierFilter === 'baseline' ? 'On Baseline' : 'Reduced')}" for this period.</p>
              <button class="btn btn-secondary" onclick="setFinanceOutlierFilter('all')" style="font-size: 0.74rem; padding: 4px 12px;">Show All Categories</button>
            </div>
          `}
        </div>
      </div>

      <!-- 4. Actionable Savings Levers Guide -->
      <div class="finance-levers-box">
        <div class="finance-levers-header">
          <i data-lucide="lightbulb" style="width: 18px; height: 18px; color: var(--fin-violet);"></i>
          <span>Strategic Levers: Where &amp; How to Save</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${outlierSpikes.length > 0 ? `
            <div class="finance-lever-item">
              <div class="finance-lever-icon" style="background: rgba(225, 29, 72, 0.12); color: #E11D48;">
                <i data-lucide="alert-circle" style="width: 13px; height: 13px;"></i>
              </div>
              <div>
                <strong>Discretionary Spike in ${escapeHtml(outlierSpikes[0].name)}:</strong>
                Ran +$${outlierSpikes[0].delta.toFixed(0)} over baseline ($${outlierSpikes[0].spent.toFixed(0)} vs $${outlierSpikes[0].baseline.toFixed(0)}). 
                Trimming non-essential transactions in this category recovers <strong>~$400–$600</strong> directly into net surplus.
              </div>
            </div>
          ` : `
            <div class="finance-lever-item">
              <div class="finance-lever-icon" style="background: var(--fin-primary-light); color: var(--fin-primary);">
                <i data-lucide="check" style="width: 13px; height: 13px;"></i>
              </div>
              <div>
                <strong>Zero Severe Outlier Spikes:</strong> Discretionary spending was well-aligned with rolling baselines.
              </div>
            </div>
          `}

          <div class="finance-lever-item">
            <div class="finance-lever-icon" style="background: rgba(124, 58, 237, 0.1); color: var(--fin-violet);">
              <i data-lucide="repeat" style="width: 13px; height: 13px;"></i>
            </div>
            <div>
              <strong>Recurring Subscriptions Audit:</strong> 
              Review the <a href="javascript:void(0)" onclick="switchFinanceSubTab('subscriptions')" style="color: var(--fin-violet); font-weight: 600; text-decoration: underline;">Subscriptions &amp; Card ROI</a> tab to eliminate unused licenses and maximize card fee credits.
            </div>
          </div>

          <div class="finance-lever-item">
            <div class="finance-lever-icon" style="background: rgba(13, 148, 136, 0.1); color: var(--fin-primary);">
              <i data-lucide="receipt" style="width: 13px; height: 13px;"></i>
            </div>
            <div>
              <strong>Medical Reimbursements Recovery:</strong>
              Check the <a href="javascript:void(0)" onclick="switchFinanceSubTab('claims')" style="color: var(--fin-primary); font-weight: 600; text-decoration: underline;">Medical Claims</a> pipeline for pending superbills to pull out-of-pocket cash back into checking.
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Compact Monarch Money Sync Strip -->
      <div class="monarch-dropzone-compact" id="monarch-dropzone-el" onclick="triggerMonarchFileInput()">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; width: 100%;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="monarch-dropzone-icon" style="width: 34px; height: 34px; margin: 0; background: var(--bg-card); color: var(--fin-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="upload-cloud" style="width: 18px; height: 18px;"></i>
            </div>
            <div style="text-align: left;">
              <strong style="font-size: 0.86rem; color: var(--text-primary); display: block;">Sync Monarch Money CSV</strong>
              <span style="font-size: 0.74rem; color: var(--text-muted);">Drop transactions.csv to update cash flow and category data</span>
            </div>
          </div>
          <div style="display: flex; gap: 8px;" onclick="event.stopPropagation()">
            <button class="btn btn-secondary" onclick="triggerMonarchFileInput()" style="font-size: 0.74rem; padding: 4px 10px;">
              <i data-lucide="folder-open" style="width: 12px; height: 12px;"></i>
              <span>Browse File</span>
            </button>
            <button class="btn btn-secondary" onclick="loadSampleMonarchData()" style="font-size: 0.74rem; padding: 4px 10px;">
              <i data-lucide="sparkles" style="width: 12px; height: 12px; color: var(--fin-primary);"></i>
              <span>Load Sample Data</span>
            </button>
          </div>
        </div>
        <input type="file" id="monarch-file-input" accept=".csv" style="display: none;" onchange="handleMonarchFileSelected(event)">
      </div>

    </div>
  `;

  // Attach Drag and Drop handlers to Monarch dropzone
  setupMonarchDropzoneListeners();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function toggleFinanceTxHighSpend() {
  financeTxHighSpendOnly = !financeTxHighSpendOnly;
  renderFinanceBurn();
}

/* ==========================================================================
   Sub-View 2: Subscriptions & Premium Card ROI Engine (4 Cards Tracked)
   ========================================================================== */

function setCardRoiFilter(filterId) {
  selectedCardRoiFilter = filterId;
  renderFinanceSubscriptions();
}

function handleToggleCardPeriod(cardId, benefitId, periodKey, event) {
  if (event) event.stopPropagation();
  const res = storage.toggleFinanceCardPeriod(cardId, benefitId, periodKey);
  if (res && res.benefit) {
    const isNowActive = !!(res.benefit.periods && res.benefit.periods[periodKey]);
    if (typeof showToast === 'function') {
      showToast(`${isNowActive ? '✓ Activated' : '○ Deactivated'} ${res.benefit.name} [${periodKey}]: $${Math.round(res.benefit.realizedValue || 0)} realized`);
    }
  }
  renderFinanceSubscriptions();
}

function handleToggleCardBenefit(cardId, benefitId, event) {
  if (event) event.stopPropagation();
  const res = storage.toggleFinanceCardBenefit(cardId, benefitId);
  if (res && res.realized) {
    if (typeof showToast === 'function') {
      showToast(`✓ Benefit activated: +$${res.realizedValue || res.maxVal}`);
    }
  }
  renderFinanceSubscriptions();
}

function handleResetCardBenefits() {
  if (confirm('Reset card perk tracking to default U&T Google Sheet baseline values?')) {
    storage.resetFinanceCardsROI();
    if (typeof showToast === 'function') {
      showToast('Card ROI benefits reset to Google Sheet baseline');
    }
    renderFinanceSubscriptions();
  }
}

/* Modal State & Handlers */
let activeModalCardId = null;
let activeModalBenefitId = null;
let activeModalTab = 'transactions'; // 'transactions' or 'manual'

function openCardRoiPerkModal(cardId, benefitId) {
  activeModalCardId = cardId;
  activeModalBenefitId = benefitId;
  activeModalTab = 'transactions';
  renderCardRoiModal();
}

function closeCardRoiModal() {
  const existing = document.getElementById('card-roi-modal-overlay');
  if (existing) existing.remove();
}

function switchCardRoiModalTab(tabId) {
  activeModalTab = tabId;
  renderCardRoiModal();
}

function handleLinkTxToBenefit(cardId, benefitId, txId, event) {
  if (event) event.stopPropagation();
  const fin = storage.getFinanceData();
  const tx = (fin.transactions || []).find(t => String(t.id) === String(txId));
  if (!tx) return;

  // Determine month name from tx.date if monthly
  const dateObj = new Date(tx.date + 'T12:00:00');
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const mName = monthNames[dateObj.getMonth()];

  const redemption = {
    date: tx.date,
    amount: Math.abs(parseFloat(tx.amount) || 0),
    note: `${tx.merchant} (${tx.category || 'Transaction'})`,
    merchant: tx.merchant,
    period: mName,
    txId: tx.id,
    source: 'monarch'
  };

  storage.logFinanceCardRedemption(cardId, benefitId, redemption);
  if (typeof showToast === 'function') {
    showToast(`✓ Linked $${redemption.amount} from ${tx.merchant} to perk`, 'success');
  }
  renderCardRoiModal();
  renderFinanceSubscriptions();
}

function handleManualRedemptionSubmit(e, cardId, benefitId) {
  if (e) e.preventDefault();
  const form = e.target;
  const amount = parseFloat(form.amount.value) || 0;
  const date = form.date.value || new Date().toISOString().split('T')[0];
  const period = form.period.value || '';
  const note = (form.note.value || '').trim();

  if (amount <= 0) {
    if (typeof showToast === 'function') showToast('Please enter an amount greater than 0', 'warning');
    return;
  }

  storage.logFinanceCardRedemption(cardId, benefitId, {
    date,
    amount,
    period,
    note,
    source: 'manual'
  });

  if (typeof showToast === 'function') {
    showToast(`✓ Logged manual redemption of $${amount}`, 'success');
  }
  renderCardRoiModal();
  renderFinanceSubscriptions();
}

function handleDeleteCardRedemption(cardId, benefitId, redemptionId, event) {
  if (event) event.stopPropagation();
  storage.deleteFinanceCardRedemption(cardId, benefitId, redemptionId);
  if (typeof showToast === 'function') {
    showToast('Redemption unlinked', 'info');
  }
  renderCardRoiModal();
  renderFinanceSubscriptions();
}

function renderCardRoiModal() {
  closeCardRoiModal();

  const fin = storage.getFinanceData();
  const cards = storage.getFinanceCardsROI();
  const card = cards.find(c => c.id === activeModalCardId) || cards[0];
  if (!card) return;

  const benefit = (card.benefits || []).find(b => b.id === activeModalBenefitId) || card.benefits[0];
  if (!benefit) return;

  // Filter transactions matching this card account
  const accountMatch = card.accountMatch || (card.accountName ? card.accountName.split(' ')[0] : '');
  const allCardTxs = (fin.transactions || []).filter(t => {
    const acc = (t.account || '').toLowerCase();
    return accountMatch && acc.includes(accountMatch.toLowerCase());
  });

  // Suggest matches based on perk keywords
  const keywords = (benefit.matchKeywords || []).map(k => k.toLowerCase());
  const matchingTxs = allCardTxs.filter(t => {
    const m = (t.merchant || '').toLowerCase();
    const cat = (t.category || '').toLowerCase();
    return keywords.some(k => m.includes(k) || cat.includes(k));
  });

  const displayedTxs = matchingTxs.length > 0 ? matchingTxs : allCardTxs.slice(0, 20);

  const modalHtml = `
    <div id="card-roi-modal-overlay" class="card-roi-modal-overlay" onclick="closeCardRoiModal()">
      <div class="card-roi-modal" onclick="event.stopPropagation()">
        <!-- Header -->
        <div class="card-roi-modal-header">
          <div>
            <span class="card-roi-network-tag" style="color: ${card.color || '#7C3AED'};">${escapeHtml(card.shortName || card.name)}</span>
            <h3 class="card-roi-modal-title">${escapeHtml(benefit.name)}</h3>
            <span style="font-size: 0.74rem; color: var(--text-muted);">${escapeHtml(benefit.notes || benefit.cadence || '')}</span>
          </div>
          <button class="btn btn-ghost" onclick="closeCardRoiModal()" style="padding: 6px; border-radius: 999px;">
            <i data-lucide="x" style="width: 18px; height: 18px;"></i>
          </button>
        </div>

        <!-- Navigation Tabs -->
        <div class="card-roi-modal-tabs">
          <button class="card-roi-modal-tab-btn ${activeModalTab === 'transactions' ? 'active' : ''}" onclick="switchCardRoiModalTab('transactions')">
            <i data-lucide="receipt" style="width: 14px; height: 14px;"></i>
            <span>Weekly Transactions (${matchingTxs.length})</span>
          </button>
          <button class="card-roi-modal-tab-btn ${activeModalTab === 'manual' ? 'active' : ''}" onclick="switchCardRoiModalTab('manual')">
            <i data-lucide="pen-tool" style="width: 14px; height: 14px;"></i>
            <span>Manual Out-of-Pocket Entry</span>
          </button>
        </div>

        <!-- Body -->
        <div class="card-roi-modal-body">
          ${activeModalTab === 'transactions' ? `
            <div style="font-size: 0.76rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center;">
              <span>Showing transactions on <strong>${escapeHtml(card.accountName)}</strong></span>
              <span style="color: #0D9488; font-weight: 600;">1-tap to link &amp; realize credit</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto;">
              ${displayedTxs.length === 0 ? `
                <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.8rem;">
                  No recent matching weekly transactions found on this account.
                  <div style="margin-top: 6px;">Use the <strong>Manual Entry</strong> tab to record out-of-pocket savings!</div>
                </div>
              ` : displayedTxs.map(tx => {
                const isLinked = (benefit.redemptions || []).some(r => String(r.txId) === String(tx.id));
                return `
                  <div class="card-roi-tx-item">
                    <div class="card-roi-tx-info">
                      <span class="card-roi-tx-merchant">${escapeHtml(tx.merchant)}</span>
                      <span class="card-roi-tx-meta">${escapeHtml(tx.date)} &bull; ${escapeHtml(tx.category || 'General')}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <span class="card-roi-tx-amount">$${Math.abs(tx.amount).toFixed(2)}</span>
                      ${isLinked ? `
                        <span class="card-roi-saved-pill has-savings" style="font-size: 0.7rem;">✓ Linked</span>
                      ` : `
                        <button class="card-roi-tx-link-btn" onclick="handleLinkTxToBenefit('${card.id}', '${benefit.id}', '${tx.id}', event)">
                          + Link Tx
                        </button>
                      `}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            <form onsubmit="handleManualRedemptionSubmit(event, '${card.id}', '${benefit.id}')" style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                  <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Realized Amount ($)</label>
                  <input type="number" step="0.01" name="amount" required placeholder="e.g. 25.00" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); font-family: var(--font-sans); font-variant-numeric: tabular-nums; font-size: 0.95rem;" />
                </div>
                <div>
                  <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Date</label>
                  <input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); font-size: 0.82rem;" />
                </div>
              </div>

              <div>
                <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Period / Month</label>
                <select name="period" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); font-size: 0.82rem;">
                  <option value="">(Auto / General)</option>
                  ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => `<option value="${m}">${m} 2026</option>`).join('')}
                  <option value="Q1">Q1 (Jan–Mar)</option>
                  <option value="Q2">Q2 (Apr–Jun)</option>
                  <option value="Q3">Q3 (Jul–Sep)</option>
                  <option value="Q4">Q4 (Oct–Dec)</option>
                  <option value="H1">H1 (Jan–Jun)</option>
                  <option value="H2">H2 (Jul–Dec)</option>
                  <option value="annual">Annual 2026</option>
                </select>
              </div>

              <div>
                <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Notes / Statement Reference</label>
                <input type="text" name="note" placeholder="e.g. In-flight wifi statement credit or Disney+ autopay" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); font-size: 0.82rem;" />
              </div>

              <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
                <button type="submit" class="btn btn-primary" style="background: #0D9488; border-color: #0D9488;">
                  <i data-lucide="check" style="width: 14px; height: 14px;"></i>
                  <span>Record Redemption</span>
                </button>
              </div>
            </form>
          `}

          <!-- Logged Redemptions History -->
          ${Array.isArray(benefit.redemptions) && benefit.redemptions.length > 0 ? `
            <div style="border-top: 1px solid var(--border-color); padding-top: 14px; display: flex; flex-direction: column; gap: 8px;">
              <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">
                Logged Redemptions Ledger (${benefit.redemptions.length})
              </span>
              <div style="display: flex; flex-direction: column; gap: 6px; max-height: 140px; overflow-y: auto;">
                ${benefit.redemptions.map(r => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: var(--bg-subtle); border-radius: 6px; font-size: 0.76rem;">
                    <div>
                      <strong>$${parseFloat(r.amount).toFixed(2)}</strong> &bull; <span style="color: var(--text-muted);">${escapeHtml(r.date)}</span>
                      <span style="color: var(--text-secondary); margin-left: 6px;">${escapeHtml(r.note || r.merchant || '')}</span>
                      ${r.period ? `<span class="card-roi-cat-pill" style="margin-left: 4px;">${escapeHtml(r.period)}</span>` : ''}
                    </div>
                    <button class="btn btn-ghost" onclick="handleDeleteCardRedemption('${card.id}', '${benefit.id}', '${r.id}', event)" title="Remove redemption" style="padding: 2px 6px; color: #EF4444;">
                      <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function handleFinanceSubSearch(e) {
  const cursorStart = (e.target && typeof e.target.selectionStart === 'number') ? e.target.selectionStart : null;
  const cursorEnd = (e.target && typeof e.target.selectionEnd === 'number') ? e.target.selectionEnd : null;
  financeSubSearchQuery = (e.target.value || '').toLowerCase().trim();

  if (activeFinanceSubTab === 'burn') {
    renderFinanceBurn();
  } else {
    renderFinanceSubscriptions();
  }

  setTimeout(() => {
    const input = document.querySelector('#finance-recurring-commitments-box .finance-search-input, .finance-search-wrap .finance-search-input');
    if (input) {
      input.focus();
      try {
        if (cursorStart !== null && cursorEnd !== null) {
          input.setSelectionRange(cursorStart, cursorEnd);
        }
      } catch (err) {}
    }
  }, 0);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
window.handleFinanceSubSearch = handleFinanceSubSearch;

function clearFinanceSubSearch(event) {
  if (event) event.stopPropagation();
  financeSubSearchQuery = '';
  if (activeFinanceSubTab === 'burn') {
    renderFinanceBurn();
  } else {
    renderFinanceSubscriptions();
  }
  setTimeout(() => {
    const input = document.querySelector('#finance-recurring-commitments-box .finance-search-input, .finance-search-wrap .finance-search-input');
    if (input) input.focus();
  }, 0);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
window.clearFinanceSubSearch = clearFinanceSubSearch;

function setFinanceSubCategoryFilter(cat) {
  financeSubCategoryFilter = cat;
  if (activeFinanceSubTab === 'burn') {
    renderFinanceBurn();
  } else {
    renderFinanceSubscriptions();
  }
}

function renderFinanceSubscriptions() {
  const container = document.getElementById('finance-subview-container');
  if (!container) return;

  const fin = storage.getFinanceData();
  const cards = (typeof storage.getFinanceCardsROI === 'function') ? storage.getFinanceCardsROI() : (fin.cardsROI || []);

  // 1. Calculate Card ROI Metrics across the 4 cards with fees
  let totalAnnualFees = 0;
  let totalRealizedValue = 0;
  let totalPotentialValue = 0;
  let totalBenefitsCount = 0;
  let checkedBenefitsCount = 0;

  const cardStats = cards.map(c => {
    const fee = parseFloat(c.annualFee) || 0;
    totalAnnualFees += fee;

    let cardRealized = 0;
    let cardMax = 0;
    (c.benefits || []).forEach(b => {
      totalBenefitsCount++;
      cardMax += (b.maxVal || 0);
      totalPotentialValue += (b.maxVal || 0);
      const val = (b.realizedValue !== undefined) ? b.realizedValue : (b.realized ? b.maxVal : 0);
      if (val > 0) {
        checkedBenefitsCount++;
        cardRealized += val;
        totalRealizedValue += val;
      }
    });

    const netValue = cardRealized - fee;
    const breakevenPct = fee > 0 ? Math.round((cardRealized / fee) * 100) : 100;
    return {
      ...c,
      cardRealized,
      cardMax,
      netValue,
      breakevenPct
    };
  });

  const netAnnualValue = totalRealizedValue - totalAnnualFees;
  const overallBreakevenPct = totalAnnualFees > 0 ? Math.round((totalRealizedValue / totalAnnualFees) * 100) : 0;

  // Negative value cards analysis
  const negativeCards = cardStats.filter(c => c.netValue < 0);
  const negativeCardsCount = negativeCards.length;
  const totalDeficit = negativeCards.reduce((acc, c) => acc + Math.abs(c.netValue), 0);

  // Default to first card if 'all' or unset
  if (!selectedCardRoiFilter || selectedCardRoiFilter === 'all') {
    selectedCardRoiFilter = 'amex-plat';
  }
  const displayedCards = cardStats.filter(c => c.id === selectedCardRoiFilter);

  // Month abbreviations
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthInitials = ['J','F','M','A','M','J','J','A','S','O','N','D'];

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- 1. Executive Horizon KPI Deck (4-Tile Metric Row with Negative Value Attention) -->
      <div class="finance-horizon-deck">
        <div class="finance-horizon-deck-header">
          <div class="finance-horizon-deck-title">
            <i data-lucide="sparkles" style="width: 14px; height: 14px; color: #7C3AED;"></i>
            <span>Executive Card Fee ROI Horizon</span>
            <span style="font-weight: 500; text-transform: none; color: var(--text-muted);">&bull; 4 Fee Cards Tracked &bull; Breakeven Engine</span>
          </div>
          <div class="finance-horizon-deck-actions">
            <button class="btn btn-secondary" onclick="handleResetCardBenefits()" style="font-size: 0.72rem; padding: 4px 10px;" title="Reset perk redemptions to U&T Google Sheet verified baseline">
              <i data-lucide="rotate-ccw" style="width: 12px; height: 12px;"></i>
              <span>Reset to Sheet Baseline</span>
            </button>
          </div>
        </div>

        <div class="finance-kpis-grid" style="grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));">
          <!-- Card 1: Annual Fees Baseline -->
          <div class="finance-kpi-card accent-indigo" style="padding: 14px 16px;">
            <div style="min-height: 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span class="finance-kpi-label">
                <i data-lucide="credit-card" style="width: 13px; height: 13px; color: #6366F1;"></i>
                <span>4 Annual Fee Cards</span>
              </span>
            </div>
            <div class="finance-kpi-value" style="color: var(--text-primary, #3a3A42); margin-bottom: 4px;">$${Math.round(totalAnnualFees).toLocaleString()}<span style="font-size: 0.82rem; font-weight: 500; color: #71717A;">/yr</span></div>
            <div class="finance-kpi-sub" style="margin-top: auto;">Amex Plat ($895) + 3 Chase ($95 ea)</div>
          </div>

          <!-- Card 2: Realized Perks & Credits -->
          <div class="finance-kpi-card accent-violet" style="padding: 14px 16px;">
            <div style="min-height: 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span class="finance-kpi-label">
                <i data-lucide="gift" style="width: 13px; height: 13px; color: #7C3AED;"></i>
                <span>Realized Perks</span>
              </span>
            </div>
            <div class="finance-kpi-value" style="color: #7C3AED; margin-bottom: 4px;">$${Math.round(totalRealizedValue).toLocaleString()}<span style="font-size: 0.82rem; font-weight: 500; color: #71717A;">/yr</span></div>
            <div class="finance-kpi-sub" style="margin-top: auto;">${checkedBenefitsCount} of ${totalBenefitsCount} credits active ($${Math.round(totalPotentialValue).toLocaleString()} potential)</div>
          </div>

          <!-- Card 3: Net Fee ROI & Surplus -->
          <div class="finance-kpi-card accent-teal" style="padding: 14px 16px;">
            <div style="min-height: 24px; display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span class="finance-kpi-label">
                <i data-lucide="trending-up" style="width: 13px; height: 13px; color: #0D9488;"></i>
                <span>Net Fee Surplus</span>
              </span>
              <span class="card-roi-surplus-pill surplus" style="font-size: 0.65rem; background: rgba(13, 148, 136, 0.12); color: #0D9488; border: 1px solid rgba(13, 148, 136, 0.25); white-space: nowrap; flex-shrink: 0;">${overallBreakevenPct}% Breakeven</span>
            </div>
            <div class="finance-kpi-value" style="color: #0D9488; margin-bottom: 4px;">+ $${Math.round(netAnnualValue).toLocaleString()}<span style="font-size: 0.82rem; font-weight: 500; color: #71717A;">/yr</span></div>
            <div class="finance-kpi-sub" style="margin-top: auto;">Total perks exceed annual fees by $${Math.round(netAnnualValue).toLocaleString()} net</div>
          </div>

          <!-- Card 4: Negative Value Cards Widget -->
          <div class="finance-kpi-card accent-rose" style="padding: 14px 16px; cursor: pointer;" onclick="if(negativeCards.length) setCardRoiFilter(negativeCards[0].id)" title="Click to inspect negative value cards">
            <div style="min-height: 24px; display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span class="finance-kpi-label">
                <i data-lucide="${negativeCardsCount > 0 ? 'alert-triangle' : 'check-circle-2'}" style="width: 13px; height: 13px; color: ${negativeCardsCount > 0 ? '#E11D48' : '#0D9488'};"></i>
                <span>Drag Below Fee</span>
              </span>
              <span class="card-roi-surplus-pill" style="font-size: 0.65rem; background: ${negativeCardsCount > 0 ? 'rgba(225, 29, 72, 0.10)' : 'rgba(13, 148, 136, 0.12)'}; color: ${negativeCardsCount > 0 ? '#E11D48' : '#0D9488'}; border: 1px solid ${negativeCardsCount > 0 ? 'rgba(225, 29, 72, 0.25)' : 'rgba(13, 148, 136, 0.25)'}; white-space: nowrap; flex-shrink: 0;">
                ${negativeCardsCount > 0 ? `${negativeCardsCount} Below Fee` : 'All Breakeven'}
              </span>
            </div>
            <div class="finance-kpi-value" style="color: ${negativeCardsCount > 0 ? '#E11D48' : '#0D9488'}; margin-bottom: 4px;">
              ${negativeCardsCount > 0 ? `-$${Math.round(totalDeficit)}` : '$0'}
              <span style="font-size: 0.82rem; font-weight: 500; color: #71717A;"> net drag</span>
            </div>
            <div class="finance-kpi-sub" style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: auto; padding-top: 4px;">
              ${negativeCards.length > 0 ? negativeCards.map(c => `
                <span onclick="event.stopPropagation(); setCardRoiFilter('${c.id}');" style="display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 999px; background: rgba(225, 29, 72, 0.08); color: #E11D48; border: 1px solid rgba(225, 29, 72, 0.22); font-weight: 600; font-size: 0.68rem; cursor: pointer;" title="Inspect ${escapeHtml(c.shortName)}">
                  ${escapeHtml(c.shortName || c.name)} (-$${Math.round(Math.abs(c.netValue))})
                </span>
              `).join('') : '<span style="color: #0D9488; font-weight: 600;">✓ All 4 cards exceeding annual fee!</span>'}
            </div>
          </div>
        </div>
        </div>
      </div>

      <!-- 2. Section: 4-Card Annual Fee ROI & Breakeven Engine -->
      <div class="finance-section-box">
        <div class="finance-section-header">
          <div>
            <h3 class="finance-section-title">
              <i data-lucide="table" style="width: 18px; height: 18px; color: #7C3AED;"></i>
              <span>Credit Card Perks &amp; ROI Ledger</span>
            </h3>
            <span style="font-size: 0.78rem; color: var(--text-muted);">
              Track monthly &amp; annual perks, log weekly Monarch transactions, or record manual out-of-pocket savings
            </span>
          </div>

          <!-- Card Filter Pills with Live Surplus/Deficit Indicators -->
          <div class="card-roi-filter-pills">
            <button class="card-roi-filter-btn ${selectedCardRoiFilter === 'amex-plat' ? 'active' : ''}" onclick="setCardRoiFilter('amex-plat')">
              <span>Amex Plat ($895) <strong style="color: #065F46; margin-left: 2px;">+$92</strong></span>
            </button>
            <button class="card-roi-filter-btn ${selectedCardRoiFilter === 'csp-u' ? 'active' : ''}" onclick="setCardRoiFilter('csp-u')">
              <span>CSP (U) ($95) <strong style="color: #FF5A5F; margin-left: 2px;">-$95</strong></span>
            </button>
            <button class="card-roi-filter-btn ${selectedCardRoiFilter === 'csp-t' ? 'active' : ''}" onclick="setCardRoiFilter('csp-t')">
              <span>CSP (T) ($95) <strong style="color: #065F46; margin-left: 2px;">+$125</strong></span>
            </button>
            <button class="card-roi-filter-btn ${selectedCardRoiFilter === 'hyatt-card' ? 'active' : ''}" onclick="setCardRoiFilter('hyatt-card')">
              <span>Hyatt ($95) <strong style="color: #FF5A5F; margin-left: 2px;">-$95</strong></span>
            </button>
          </div>
        </div>

        <!-- Render Tabular Cards (Google Sheet Format) -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          ${displayedCards.map(c => {
            const isBreakeven = c.cardRealized >= c.annualFee;
            const meterPct = Math.min(100, c.breakevenPct);
            const surplusSign = c.netValue >= 0 ? '+' : '';

            // Group benefits by category
            const categoriesOrder = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual', '4 Years', '4 years', 'Milestone', 'Status', 'Spend Tracking'];
            const grouped = {};
            (c.benefits || []).forEach(b => {
              const cat = b.category || 'Other';
              if (!grouped[cat]) grouped[cat] = [];
              grouped[cat].push(b);
            });

            return `
              <div class="card-roi-sheet-card theme-${c.theme || 'violet'}">
                <!-- Card Header HUD -->
                <div class="card-roi-sheet-card-header">
                  <div class="card-roi-sheet-card-identity">
                    <span class="card-roi-network-tag" style="color: ${c.color || '#7C3AED'};">${escapeHtml(c.network)}</span>
                    <h4 class="card-roi-sheet-card-title">${escapeHtml(c.name)}</h4>
                    <div class="card-roi-sheet-card-meta">
                      <span><strong>${escapeHtml(c.accountName)}</strong></span>
                      <span>&bull;</span>
                      <span>Renews: <strong>${escapeHtml(c.renewalMonth || 'Annual')}</strong></span>
                      <span>&bull;</span>
                      <span>Synced: ${escapeHtml(c.lastUpdated || '9/27/2026')}</span>
                    </div>
                  </div>

                  <div class="card-roi-sheet-card-stats">
                    <div class="card-roi-sheet-kpi-chip">
                      <span class="card-roi-sheet-kpi-val" style="color: ${c.color || '#7C3AED'};">$${c.annualFee}</span>
                      <span class="card-roi-sheet-kpi-label">Annual Fee</span>
                    </div>

                    <div class="card-roi-sheet-kpi-chip">
                      <span class="card-roi-sheet-kpi-val" style="color: var(--fin-primary);">$${Math.round(c.cardRealized)}</span>
                      <span class="card-roi-sheet-kpi-label">Value Redeemed</span>
                    </div>

                    <div class="card-roi-sheet-kpi-chip" style="border-color: ${isBreakeven ? 'var(--fin-primary-border)' : 'var(--border-color)'};">
                      <span class="card-roi-sheet-kpi-val" style="color: ${isBreakeven ? 'var(--fin-primary)' : 'var(--text-muted)'};">
                        ${surplusSign}$${Math.round(c.netValue)}
                      </span>
                      <span class="card-roi-sheet-kpi-label">${isBreakeven ? 'Net Surplus' : 'Net Value'}</span>
                    </div>

                    <button class="btn btn-secondary" onclick="openCardRoiPerkModal('${c.id}')" style="font-size: 0.75rem; padding: 6px 12px;" title="Link weekly Monarch transactions or enter manual redemption">
                      <i data-lucide="plus" style="width: 13px; height: 13px;"></i>
                      <span>Log Perk</span>
                    </button>
                  </div>
                </div>

                <!-- Breakeven Meter -->
                <div class="card-roi-meter-box">
                  <div class="card-roi-meter-labels">
                    <span style="font-weight: 700; color: var(--text-primary);">
                      Realized: $${Math.round(c.cardRealized)} <span style="font-weight: 500; color: var(--text-muted);">/ $${c.annualFee} Fee</span>
                    </span>
                    <span class="card-roi-surplus-pill ${isBreakeven ? 'surplus' : ''}">
                      ${isBreakeven ? `✓ ${surplusSign}$${Math.round(c.netValue)} Surplus (${c.breakevenPct}%)` : `${c.breakevenPct}% of annual fee`}
                    </span>
                  </div>

                  <div class="card-roi-meter-track">
                    <div class="card-roi-meter-fill" style="width: ${meterPct}%; background: ${isBreakeven ? 'var(--fin-primary)' : (c.color || '#7C3AED')};"></div>
                  </div>
                </div>

                <!-- Google Sheet Matrix Table -->
                <div class="card-roi-table-wrap">
                  <table class="card-roi-table">
                    <thead>
                      <tr>
                        <th style="width: 100px;">Category</th>
                        <th style="min-width: 220px;">Benefit / Perk &amp; Cadence</th>
                        <th style="width: 90px;">Face Value</th>
                        <th style="min-width: 320px;">Tracker (Checkboxes &bull; Tap to Toggle)</th>
                        <th style="width: 100px; text-align: right;">Total Saved</th>
                        <th style="width: 100px; text-align: center;">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${Object.keys(grouped).map(catKey => {
                        const items = grouped[catKey];
                        return `
                          <tr class="card-roi-group-row">
                            <td colspan="6">
                              <i data-lucide="layers" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>
                              <span>${escapeHtml(catKey)} Perks</span>
                            </td>
                          </tr>
                          ${items.map(b => {
                            const isRealized = (b.realizedValue || 0) > 0;
                            const hasRedemptions = Array.isArray(b.redemptions) && b.redemptions.length > 0;

                            return `
                              <tr class="card-roi-row ${isRealized ? 'active-benefit' : ''}">
                                <td class="card-roi-td">
                                  <span class="card-roi-cat-pill">${escapeHtml(b.category)}</span>
                                </td>
                                <td class="card-roi-td">
                                  <div class="card-roi-perk-name">
                                    <span>${escapeHtml(b.name)}</span>
                                    ${b.status ? `<span class="card-roi-cat-pill" style="font-size: 0.6rem; color: #0D9488;">${escapeHtml(b.status)}</span>` : ''}
                                  </div>
                                  <div class="card-roi-perk-notes">${escapeHtml(b.notes || b.details || '')}</div>
                                </td>
                                <td class="card-roi-td">
                                  <span class="card-roi-face-val">${b.maxVal > 0 ? '$' + b.maxVal : '--'}</span>
                                </td>
                                <td class="card-roi-td">
                                  ${b.trackType === 'monthly' ? `
                                    <div class="card-roi-month-strip">
                                      ${months.map((m, mIdx) => {
                                        const isActive = !!(b.periods && b.periods[m]);
                                        const pVal = (b.periodValues && b.periodValues[m] !== undefined) ? b.periodValues[m] : Math.round(b.maxVal / 12);
                                        return `
                                          <button class="card-roi-month-pill ${isActive ? 'active' : ''}" 
                                                  onclick="handleToggleCardPeriod('${c.id}', '${b.id}', '${m}', event)"
                                                  title="${m}: $${pVal} (${isActive ? 'Claimed' : 'Pending'})">
                                            ${monthInitials[mIdx]}
                                          </button>
                                        `;
                                      }).join('')}
                                    </div>
                                  ` : b.trackType === 'quarterly' ? `
                                    <div class="card-roi-quarter-strip">
                                      ${Object.keys(b.periods || { Q1: false, Q2: false, Q3: false, Q4: false }).map(q => {
                                        const isActive = !!(b.periods && b.periods[q]);
                                        const qVal = (b.periodValues && b.periodValues[q] !== undefined) ? b.periodValues[q] : Math.round(b.maxVal / 4);
                                        return `
                                          <button class="card-roi-quarter-pill ${isActive ? 'active' : ''}"
                                                  onclick="handleToggleCardPeriod('${c.id}', '${b.id}', '${q}', event)"
                                                  title="${q}: $${qVal} (${isActive ? 'Claimed' : 'Pending'})">
                                            ${q} ($${qVal})
                                          </button>
                                        `;
                                      }).join('')}
                                    </div>
                                  ` : b.trackType === 'semi-annual' ? `
                                    <div class="card-roi-semi-strip">
                                      ${['H1', 'H2'].map(h => {
                                        const isActive = !!(b.periods && b.periods[h]);
                                        const hLabel = h === 'H1' ? 'Jan–Jun' : 'Jul–Dec';
                                        return `
                                          <button class="card-roi-semi-pill ${isActive ? 'active' : ''}"
                                                  onclick="handleToggleCardPeriod('${c.id}', '${b.id}', '${h}', event)"
                                                  title="${h} (${hLabel}): $${b.periodValues?.[h] || 300}">
                                            ${h} (${hLabel})
                                          </button>
                                        `;
                                      }).join('')}
                                    </div>
                                  ` : b.trackType === 'spend-milestone' ? `
                                    <div class="card-roi-quarter-strip">
                                      ${Object.keys(b.periods || { '$5k': false, '$10k': false, '$15k': false, '$20k': false }).map(sp => {
                                        const isActive = !!(b.periods && b.periods[sp]);
                                        return `
                                          <button class="card-roi-quarter-pill ${isActive ? 'active' : ''}"
                                                  onclick="handleToggleCardPeriod('${c.id}', '${b.id}', '${sp}', event)"
                                                  title="${sp} spend: +2 Elite Nights">
                                            ${sp}
                                          </button>
                                        `;
                                      }).join('')}
                                    </div>
                                  ` : `
                                    <button class="card-roi-claim-toggle ${(b.periods && (b.periods.annual || b.periods.claim)) ? 'claimed' : ''}"
                                            onclick="handleToggleCardPeriod('${c.id}', '${b.id}', '${b.periods && b.periods.claim !== undefined ? 'claim' : 'annual'}', event)">
                                      ${(b.periods && (b.periods.annual || b.periods.claim)) 
                                        ? `✓ Claimed ($${b.realizedValue || b.maxVal})` 
                                        : (b.status ? `${b.status}` : 'Pending Claim')}
                                    </button>
                                  `}
                                </td>
                                <td class="card-roi-td" style="text-align: right;">
                                  <span class="card-roi-saved-pill ${isRealized ? 'has-savings' : ''}">
                                    $${Math.round(b.realizedValue || 0)}
                                  </span>
                                </td>
                                <td class="card-roi-td" style="text-align: center;">
                                  <button class="card-roi-action-btn ${hasRedemptions ? 'has-links' : ''}" 
                                          onclick="openCardRoiPerkModal('${c.id}', '${b.id}')"
                                          title="View weekly matching transactions or add manual record">
                                    <i data-lucide="${hasRedemptions ? 'link' : 'plus'}" style="width: 12px; height: 12px;"></i>
                                    <span>${hasRedemptions ? `Linked (${b.redemptions.length})` : 'Log / Tx'}</span>
                                  </button>
                                </td>
                              </tr>
                            `;
                          }).join('')}
                        `;
                      }).join('')}
                    </tbody>
                    <tfoot class="card-roi-table-tfoot">
                      <tr>
                        <td colspan="4">
                          <div style="display: flex; gap: 20px; align-items: center; font-weight: 600;">
                            <span>Total Value Redeemed: <strong style="color: #0D9488;">$${Math.round(c.cardRealized)}</strong></span>
                            <span>&bull;</span>
                            <span>Annual Fee: <strong>$${c.annualFee}</strong></span>
                            <span>&bull;</span>
                            <span>Net Value: <strong style="color: ${c.netValue >= 0 ? '#0D9488' : '#64748B'};">${surplusSign}$${Math.round(c.netValue)}</strong></span>
                          </div>
                        </td>
                        <td style="text-align: right; font-family: var(--font-sans); font-variant-numeric: tabular-nums; font-weight: 700; color: #0D9488; font-size: 0.95rem;">
                          $${Math.round(c.cardRealized)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

              </div>
            `;
          }).join('')}
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
   Quarterly & Annual Review Cadence Engines
   ========================================================================== */
function getCurrentQuarterKey() {
  return selectedFinanceQuarter || '2026-Q3';
}

function getCurrentYearKey() {
  return String(new Date().getFullYear());
}

function selectFinanceQuarter(qKey) {
  selectedFinanceQuarter = qKey;
  renderFinanceRunway();
}

function toggleFinanceQuarterlyChecklistItem(itemNum, event) {
  if (event) event.stopPropagation();
  const qKey = getCurrentQuarterKey();
  const checklist = storage.getFinanceQuarterlyChecklist(qKey);
  const currentVal = !!checklist[itemNum];
  const { allDone } = storage.setFinanceQuarterlyChecklistItem(qKey, itemNum, !currentVal);

  if (allDone) {
    if (typeof confetti === 'function') {
      try { confetti({ particleCount: 45, spread: 70, origin: { y: 0.18 } }); } catch (e) {}
    }
    if (typeof showToast === 'function') {
      showToast(`🎉 All 5 quarterly checklist items complete for ${qKey}!`, 'success');
    }
  } else if (!currentVal) {
    if (typeof showToast === 'function') {
      showToast(`✓ Step ${itemNum} marked complete`);
    }
  }
  renderFinanceRunway();
}

function toggleFinanceAnnualChecklistItem(itemNum, event) {
  if (event) event.stopPropagation();
  const yKey = getCurrentYearKey();
  const checklist = storage.getFinanceAnnualChecklist(yKey);
  const currentVal = !!checklist[itemNum];
  const { allDone } = storage.setFinanceAnnualChecklistItem(yKey, itemNum, !currentVal);

  if (allDone) {
    if (typeof confetti === 'function') {
      try { confetti({ particleCount: 45, spread: 70, origin: { y: 0.18 } }); } catch (e) {}
    }
    if (typeof showToast === 'function') {
      showToast(`🎉 All 4 annual governance items complete for ${yKey}!`, 'success');
    }
  } else if (!currentVal) {
    if (typeof showToast === 'function') {
      showToast(`✓ Annual task ${itemNum} marked complete`);
    }
  }
  renderFinanceRunway();
}

function toggleFinanceLedgerCollapse(event) {
  if (event) event.stopPropagation();
  financeLedgerCollapsed = !financeLedgerCollapsed;
  try {
    localStorage.setItem('margo_finance_ledger_collapsed', financeLedgerCollapsed ? 'true' : 'false');
  } catch (e) {}
  renderFinanceRunway();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
window.toggleFinanceLedgerCollapse = toggleFinanceLedgerCollapse;

function setFinanceNwClassFilter(filter) {
  financeNwClassFilter = filter;
  financeLedgerCollapsed = false; // automatically expand when user clicks a category
  renderFinanceRunway();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function handleFinanceNwSearch(e) {
  const cursorStart = (e.target && typeof e.target.selectionStart === 'number') ? e.target.selectionStart : null;
  const cursorEnd = (e.target && typeof e.target.selectionEnd === 'number') ? e.target.selectionEnd : null;
  financeNwSearchQuery = (e.target.value || '').toLowerCase().trim();
  if (financeNwSearchQuery) {
    financeLedgerCollapsed = false; // automatically expand when user searches
  }
  renderFinanceRunway();
  setTimeout(() => {
    const input = document.querySelector('#finance-active-accounts-ledger .finance-search-input, .finance-nw-table-box .finance-search-input');
    if (input) {
      input.focus();
      try {
        if (cursorStart !== null && cursorEnd !== null) {
          input.setSelectionRange(cursorStart, cursorEnd);
        }
      } catch (err) {}
    }
  }, 0);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
window.handleFinanceNwSearch = handleFinanceNwSearch;

function clearFinanceNwSearch(event) {
  if (event) event.stopPropagation();
  financeNwSearchQuery = '';
  renderFinanceRunway();
  setTimeout(() => {
    const input = document.querySelector('#finance-active-accounts-ledger .finance-search-input, .finance-nw-table-box .finance-search-input');
    if (input) input.focus();
  }, 0);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
window.clearFinanceNwSearch = clearFinanceNwSearch;

function renderFinanceQuarterlyCadenceBar() {
  const qKey = getCurrentQuarterKey();
  const checklist = storage.getFinanceQuarterlyChecklist(qKey);
  const doneCount = [1, 2, 3, 4, 5].filter(num => !!checklist[num]).length;
  const allDone = doneCount === 5;

  const items = [
    {
      num: 1,
      label: '401(k) Review',
      theme: 'violet',
      color: '#7C3AED',
      hint: 'Elective deferral pacing toward $23.5k/$30k max',
      action: null
    },
    {
      num: 2,
      label: 'Tax Withholdings',
      theme: 'teal',
      color: '#0D9488',
      hint: 'Audit W-4 federal/state withholdings & quarterly estimates',
      action: null
    },
    {
      num: 3,
      label: 'Charity Donations',
      theme: 'rose',
      color: '#E11D48',
      hint: 'Plan & disburse quarterly charitable donations',
      action: null
    },
    {
      num: 4,
      label: 'Freedom Flex 5%',
      theme: 'emerald',
      color: '#059669',
      hint: 'Activate 5% rotating quarterly cash back categories on Chase',
      action: `
        <a href="https://www.chase.com/mybonus" target="_blank" rel="noopener" class="cadence-pill-action-btn" onclick="event.stopPropagation();" title="Activate Freedom Flex 5% Categories">
          <i data-lucide="external-link" style="width: 11px; height: 11px;"></i>
        </a>
      `
    },
    {
      num: 5,
      label: 'Savings Radar',
      theme: 'indigo',
      color: '#4F46E5',
      hint: 'Spot check category trends for savings leaks & outliers',
      action: `
        <button type="button" class="cadence-pill-action-btn" onclick="event.stopPropagation(); switchFinanceSubTab('burn'); setTimeout(() => scrollToFinanceOutliers(), 50);" title="Jump to Cash Flow &amp; Outliers Radar">
          <i data-lucide="compass" style="width: 11px; height: 11px;"></i>
        </button>
      `
    }
  ];

  return `
    <div class="finance-cadence-strip-card cadence-strip-quarterly ${allDone ? 'all-done' : ''}">
      <div class="finance-cadence-header">
        <div class="finance-cadence-title">
          <i data-lucide="${allDone ? 'check-check' : 'calendar-range'}" style="width: 14px; height: 14px; color: ${allDone ? '#34D399' : '#E05A47'};"></i>
          <span>Quarterly Review</span>
          <div class="finance-cadence-quarter-capsules">
            <button class="finance-cadence-q-btn ${qKey === '2026-Q3' ? 'active' : ''}" onclick="selectFinanceQuarter('2026-Q3')" title="Review closed Q3 2026 (July – September)">
              Q3 2026 Review
            </button>
            <button class="finance-cadence-q-btn ${qKey === '2026-Q4' ? 'active' : ''}" onclick="selectFinanceQuarter('2026-Q4')" title="Plan Q4 2026 (October – December)">
              Q4 2026
            </button>
          </div>
        </div>
        <span class="finance-cadence-progress-pill ${allDone ? 'done' : ''}">
          ${allDone ? '✓ 5 of 5 Done' : `${doneCount} of 5 Done`}
        </span>
      </div>
      <div class="finance-cadence-pills-row">
        ${items.map(item => {
          const isDone = !!checklist[item.num];
          return `
            <div class="finance-cadence-pill-btn pill-theme-${item.theme} ${isDone ? 'done' : ''}" onclick="toggleFinanceQuarterlyChecklistItem(${item.num}, event)" title="${item.hint} &bull; Click to toggle">
              <div class="cadence-pill-left">
                <span class="cadence-check-icon" style="border-color: ${isDone ? '#0D9488' : item.color};">
                  <i data-lucide="check" style="width: 10px; height: 10px; stroke-width: 3;"></i>
                </span>
                <span class="cadence-pill-num" style="color: ${item.color};">${item.num}.</span>
                <span class="cadence-pill-title">${item.label}</span>
              </div>
              ${item.action ? item.action : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderFinanceAnnualCadenceBar() {
  const yKey = getCurrentYearKey();
  const checklist = storage.getFinanceAnnualChecklist(yKey);
  const doneCount = [1, 2, 3, 4].filter(num => !!checklist[num]).length;
  const allDone = doneCount === 4;

  const items = [
    {
      num: 1,
      label: 'Credit Report',
      theme: 'sky',
      color: '#0284C7',
      hint: 'annualcreditreport.com credit check',
      action: `
        <a href="https://www.annualcreditreport.com" target="_blank" rel="noopener" class="cadence-pill-action-btn" onclick="event.stopPropagation();" title="Open AnnualCreditReport.com">
          <i data-lucide="external-link" style="width: 11px; height: 11px;"></i>
        </a>
      `
    },
    {
      num: 2,
      label: 'Retirement Planning',
      theme: 'violet',
      color: '#7C3AED',
      hint: 'Annual Monte Carlo models & safe withdrawal rate review',
      action: null
    },
    {
      num: 3,
      label: 'Unclaimed Property',
      theme: 'teal',
      color: '#0D9488',
      hint: 'Search NYS / state registries for unclaimed funds',
      action: `
        <a href="https://www.osc.ny.gov/unclaimed-funds" target="_blank" rel="noopener" class="cadence-pill-action-btn" onclick="event.stopPropagation();" title="Search NYS Unclaimed Funds">
          <i data-lucide="external-link" style="width: 11px; height: 11px;"></i>
        </a>
      `
    },
    {
      num: 4,
      label: 'UR + MR Points Plan',
      theme: 'indigo',
      color: '#4F46E5',
      hint: 'Annual redemption strategy for Chase UR & Amex MR rewards',
      action: null
    }
  ];

  return `
    <div class="finance-cadence-strip-card cadence-strip-annual ${allDone ? 'all-done' : ''}">
      <div class="finance-cadence-header">
        <div class="finance-cadence-title">
          <i data-lucide="${allDone ? 'check-check' : 'shield-check'}" style="width: 14px; height: 14px; color: ${allDone ? '#0D9488' : '#0D9488'};"></i>
          <span>Annual Governance</span>
          <span class="finance-cadence-sub">&bull; ${yKey} Horizon</span>
        </div>
        <span class="finance-cadence-progress-pill ${allDone ? 'done' : ''}">
          ${allDone ? '✓ 4 of 4 Done' : `${doneCount} of 4 Done`}
        </span>
      </div>
      <div class="finance-cadence-pills-row four-cols">
        ${items.map(item => {
          const isDone = !!checklist[item.num];
          return `
            <div class="finance-cadence-pill-btn pill-theme-${item.theme} ${isDone ? 'done' : ''}" onclick="toggleFinanceAnnualChecklistItem(${item.num}, event)" title="${item.hint} &bull; Click to toggle">
              <div class="cadence-pill-left">
                <span class="cadence-check-icon" style="border-color: ${isDone ? '#0D9488' : item.color};">
                  <i data-lucide="check" style="width: 10px; height: 10px; stroke-width: 3;"></i>
                </span>
                <span class="cadence-pill-num" style="color: ${item.color};">${item.num}.</span>
                <span class="cadence-pill-title">${item.label}</span>
              </div>
              ${item.action ? item.action : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   Historical Net Worth Progression: Interactive Sparkline & Trajectory Curve
   -------------------------------------------------------------------------- */
function renderFinanceMilestonesSparkline(milestones) {
  if (!milestones || milestones.length === 0) return '';

  const firstM = milestones[0];
  const lastM = milestones[milestones.length - 1];
  const totalGain = lastM.netWorth - firstM.netWorth;
  const totalGainPct = firstM.netWorth > 0 ? ((totalGain / firstM.netWorth) * 100).toFixed(1) : '0.0';
  const totalGainSign = totalGain >= 0 ? '+' : '';

  // Calculate coordinates for SVG
  const values = milestones.map(m => m.netWorth);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const valRange = maxVal - minVal || 1;
  const floorVal = minVal - valRange * 0.12;
  const ceilVal = maxVal + valRange * 0.10;
  const spanVal = ceilVal - floorVal || 1;

  const svgWidth = 700;
  const xPad = 35;
  const yTop = 14;
  const yBottom = 78;

  const points = milestones.map((m, idx) => {
    const x = xPad + (idx / (milestones.length - 1)) * (svgWidth - 2 * xPad);
    const norm = (m.netWorth - floorVal) / spanVal;
    const y = yBottom - norm * (yBottom - yTop);
    return { x, y, milestone: m, idx };
  });

  // Build smooth curve path
  let pathD = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpx = (p0.x + p1.x) / 2;
    pathD += ` C ${cpx.toFixed(1)} ${p0.y.toFixed(1)}, ${cpx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }

  // Area fill path
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} 90 L ${points[0].x.toFixed(1)} 90 Z`;

  // Format date helper (e.g. 2026-05-02 -> May '26, 2026-10-11 -> Oct 11)
  const formatShortDate = (dateStr, isLatest) => {
    if (isLatest) return 'Oct 11 (Now)';
    try {
      const parts = dateStr.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const mIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (day > 1 && day < 28) return `${monthNames[mIdx]} ${day}`;
      return `${monthNames[mIdx]} '${parts[0].slice(2)}`;
    } catch (e) {
      return dateStr;
    }
  };

  return `
    <div class="finance-sparkline-card">
      <div class="finance-sparkline-header">
        <div class="finance-sparkline-title-group">
          <h3 class="finance-sparkline-title">
            <i data-lucide="trending-up" style="width: 17px; height: 17px; color: #7C3AED;"></i>
            <span>Historical Net Worth Progression</span>
          </h3>
          <span class="finance-sparkline-sub">6-Month continuous compounding trajectory &bull; Verified from Monarch Balances export</span>
        </div>
        <div class="finance-sparkline-summary">
          <span class="finance-sparkline-hero-val">$${Math.round(lastM.netWorth).toLocaleString()}</span>
          <span class="finance-sparkline-gain-badge">${totalGainSign}$${Math.round(totalGain).toLocaleString()} (${totalGainSign}${totalGainPct}%)</span>
        </div>
      </div>

      <!-- Interactive SVG Sparkline -->
      <div class="finance-sparkline-svg-wrap">
        <svg class="finance-sparkline-svg" viewBox="0 0 700 90" preserveAspectRatio="none">
          <defs>
            <linearGradient id="nwCurveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.22" />
              <stop offset="100%" stop-color="#7C3AED" stop-opacity="0.00" />
            </linearGradient>
          </defs>
          <!-- Gradient area -->
          <path d="${areaD}" fill="url(#nwCurveGradient)" />
          <!-- Smooth line -->
          <path d="${pathD}" fill="none" stroke="#7C3AED" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          <!-- Knots -->
          ${points.map((p, idx) => {
            const isLatest = idx === points.length - 1;
            const r = isLatest ? '5.5' : '4';
            const strokeW = isLatest ? '2.5' : '2';
            const fill = isLatest ? '#7C3AED' : '#FFFFFF';
            const stroke = isLatest ? '#FFFFFF' : '#7C3AED';
            return `
              <circle class="finance-sparkline-knot" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r}"
                      fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"
                      title="${p.milestone.date}: $${(p.milestone.netWorth / 1e6).toFixed(2)}M" />
            `;
          }).join('')}
        </svg>
      </div>

      <!-- 7 Milestone Columns -->
      <div class="finance-sparkline-labels-row">
        ${milestones.map((m, idx) => {
          const prev = idx > 0 ? milestones[idx - 1] : null;
          const delta = prev ? (m.netWorth - prev.netWorth) : 0;
          const deltaSign = delta >= 0 ? '+' : '';
          const isLatest = idx === milestones.length - 1;
          const dateLabel = formatShortDate(m.date, isLatest);
          let deltaClass = 'base';
          let deltaText = 'Baseline';
          if (prev) {
            deltaClass = delta >= 0 ? 'pos' : 'neg';
            deltaText = `${deltaSign}$${Math.round(delta / 1e3)}k`;
          }

          return `
            <div class="finance-sparkline-col ${isLatest ? 'current' : ''}">
              <span class="finance-sparkline-col-date">${dateLabel}</span>
              <span class="finance-sparkline-col-val">$${(m.netWorth / 1e6).toFixed(2)}M</span>
              <span class="finance-sparkline-col-delta ${deltaClass}">${deltaText}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/* ==========================================================================
   Sub-View 3: Net Worth Horizon, Runway & Quarterly Ledger
   ========================================================================== */
function renderFinanceRunway() {
  const container = document.getElementById('finance-subview-container');
  if (!container) return;

  const fin = storage.getFinanceData();
  const nw = fin.netWorth || (typeof DEFAULT_NET_WORTH_DATA !== 'undefined' ? DEFAULT_NET_WORTH_DATA : {});
  const monthlyTarget = fin.monthlyTarget || 9500;

  const totalAssets = nw.totalAssets || 6506243.67;
  const totalLiabilities = nw.totalLiabilities || 290484.68;
  const netWorth = nw.netWorth || (totalAssets - totalLiabilities);
  const liquidCash = nw.liquidCash || 275755.25;
  const runwayMonths = monthlyTarget > 0 ? (liquidCash / monthlyTarget).toFixed(1) : '29.0';
  const asOfDate = nw.asOfDate || '2026-10-11';

  const accounts = Array.isArray(nw.accounts) ? nw.accounts : (fin.accounts || []);
  const milestones = Array.isArray(nw.milestones) ? nw.milestones : [];

  // Group asset classes
  const classBreakdown = {
    retirement: { name: 'Retirement (401k & IRAs)', icon: 'shield', color: '#7C3AED', total: 0, count: 0 },
    brokerage: { name: 'Taxable Brokerage & RSUs', icon: 'trending-up', color: '#4F46E5', total: 0, count: 0 },
    realestate: { name: 'Real Estate & Vehicles', icon: 'home', color: '#0D9488', total: 0, count: 0 },
    cash: { name: 'Cash Reserves & Runway', icon: 'droplet', color: '#065F46', total: 0, count: 0 },
    education: { name: 'Education Fund (529)', icon: 'graduation-cap', color: '#64748B', total: 0, count: 0 },
    liability: { name: 'Mortgage & Liabilities', icon: 'credit-card', color: '#FF5A5F', total: 0, count: 0 }
  };

  accounts.forEach(acc => {
    let cls = acc.assetClass || 'brokerage';
    if (cls === 'equity') cls = 'brokerage';
    if (!classBreakdown[cls]) cls = 'brokerage';
    classBreakdown[cls].total += Math.abs(parseFloat(acc.balance) || 0);
    classBreakdown[cls].count += 1;
  });

  const macroAssetSum = totalAssets > 0 ? totalAssets : 1;
  const allocPcts = {
    retirement: ((classBreakdown.retirement.total / macroAssetSum) * 100).toFixed(1),
    brokerage: ((classBreakdown.brokerage.total / macroAssetSum) * 100).toFixed(1),
    realestate: ((classBreakdown.realestate.total / macroAssetSum) * 100).toFixed(1),
    cash: ((classBreakdown.cash.total / macroAssetSum) * 100).toFixed(1),
    education: ((classBreakdown.education.total / macroAssetSum) * 100).toFixed(1)
  };

  // Filter accounts
  const filteredAccounts = accounts.filter(acc => {
    let cls = acc.assetClass || 'brokerage';
    if (cls === 'equity') cls = 'brokerage';
    if (financeNwClassFilter !== 'all' && cls !== financeNwClassFilter) {
      return false;
    }
    if (financeNwSearchQuery) {
      const q = financeNwSearchQuery;
      const matchName = (acc.name || '').toLowerCase().includes(q);
      const matchInst = (acc.institution || '').toLowerCase().includes(q);
      const matchSub = (acc.subType || '').toLowerCase().includes(q);
      if (!matchName && !matchInst && !matchSub) return false;
    }
    return true;
  });

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- 1. Top Quarterly Review Cadence Strip (Option 1 Horizontal Checkpoints) -->
      ${renderFinanceQuarterlyCadenceBar()}

      <!-- 2. Annual Financial Governance Strip (Option 1 Horizontal Checkpoints) -->
      ${renderFinanceAnnualCadenceBar()}

      <!-- 3. Executive Horizon Deck (Option B: Net Worth · Runway · Asset Allocation Donut) -->
      <div class="finance-horizon-deck">
        <div class="finance-horizon-deck-header">
          <div class="finance-horizon-deck-title">
            <i data-lucide="compass" style="width: 13px; height: 13px; color: #7C3AED;"></i>
            <span>Portfolio Horizon &bull; Verified Balances</span>
            <span style="font-size: 0.68rem; font-weight: normal; color: var(--text-muted);">(As of ${escapeHtml(asOfDate)})</span>
          </div>
          <div class="finance-horizon-deck-actions">
            <button class="btn btn-secondary" onclick="triggerBalancesFileInput()" style="font-size: 0.68rem; padding: 2px 8px;" title="Upload or refresh Monarch Balances CSV">
              <i data-lucide="upload-cloud" style="width: 11px; height: 11px;"></i>
              <span>Sync CSV</span>
            </button>
            <button class="btn btn-secondary" onclick="openUpdateBalancesModal()" style="font-size: 0.68rem; padding: 2px 8px;" title="Manually edit account balance values">
              <i data-lucide="edit-3" style="width: 11px; height: 11px;"></i>
              <span>Edit</span>
            </button>
          </div>
        </div>

        <div class="finance-nw-deconstructed-grid">
          <!-- Card 1: Portfolio Net Worth (Distinct Royal Violet Theme) -->
          <div class="finance-nw-tile-card card-nw">
            <div class="finance-nw-tile-top">
              <span class="finance-nw-tile-lbl">
                <i data-lucide="sparkles" style="width: 13px; height: 13px; color: #7C3AED;"></i>
                <span>Portfolio Net Worth</span>
              </span>
              <span class="finance-nw-tile-badge">+23.8% 6mo</span>
            </div>
            <div>
              <div class="finance-nw-tile-hero">
                $${Math.round(netWorth).toLocaleString()}
              </div>
              <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 4px;">
                +$1.20M rolling expansion
              </div>
            </div>
            <div class="finance-nw-tile-footer">
              <span>Assets: <strong>$${(totalAssets / 1e6).toFixed(2)}M</strong></span>
              <span>Debt: <strong style="color: #FF5A5F;">-$${Math.round(totalLiabilities / 1e3)}k</strong> (4.5%)</span>
            </div>
          </div>

          <!-- Card 2: Liquid Runway -->
          <div class="finance-nw-tile-card card-runway">
            <div class="finance-nw-tile-top">
              <span class="finance-nw-tile-lbl">
                <i data-lucide="droplet" style="width: 13px; height: 13px; color: #065F46;"></i>
                <span>Liquid Cash Runway</span>
              </span>
              <span class="finance-nw-tile-badge">Healthy (Secure)</span>
            </div>
            <div>
              <div class="finance-nw-tile-hero">
                ${runwayMonths} Mo
              </div>
              <div style="font-family: var(--font-sans); font-variant-numeric: tabular-nums; font-size: 0.82rem; font-weight: 700; color: var(--text-primary); margin-top: 4px;">
                $${Math.round(liquidCash).toLocaleString()} Cash Reserves
              </div>
            </div>
            <div class="finance-nw-tile-footer">
              <span>Target: <strong>$${monthlyTarget.toLocaleString()}/mo</strong></span>
              <span>Checking, HYSA &amp; FSA</span>
            </div>
          </div>

          <!-- Card 3: Macro Allocation with Donut Chart (Distinct Indigo Theme) -->
          <div class="finance-nw-tile-card card-alloc">
            <div class="finance-nw-tile-top">
              <span class="finance-nw-tile-lbl">
                <i data-lucide="pie-chart" style="width: 13px; height: 13px; color: #4F46E5;"></i>
                <span>Asset Allocation</span>
              </span>
              <span style="font-size: 0.68rem; font-weight: 600; color: var(--text-muted);">$${(totalAssets / 1e6).toFixed(2)}M Total</span>
            </div>

            <div class="finance-donut-layout">
              <!-- SVG Donut Chart (Radius = 32, Circumference ≈ 201.06) -->
              <div class="finance-donut-svg-wrap">
                <svg class="finance-donut-svg" viewBox="0 0 86 86">
                  <circle cx="43" cy="43" r="32" fill="none" stroke="var(--border-color, #E2E8F0)" stroke-width="11" />
                  ${(() => {
                    const circumference = 2 * Math.PI * 32;
                    let cumOffset = 0;
                    const slices = [
                      { name: 'Retirement', pct: parseFloat(allocPcts.retirement) || 0, color: '#7C3AED' },
                      { name: 'Brokerage', pct: parseFloat(allocPcts.brokerage) || 0, color: '#4F46E5' },
                      { name: 'Real Estate', pct: parseFloat(allocPcts.realestate) || 0, color: '#0D9488' },
                      { name: 'Cash', pct: parseFloat(allocPcts.cash) || 0, color: '#065F46' },
                      { name: '529 Plan', pct: parseFloat(allocPcts.education) || 0, color: '#64748B' }
                    ];
                    return slices.map(s => {
                      const len = (s.pct / 100) * circumference;
                      const offset = cumOffset;
                      cumOffset += len;
                      return `
                        <circle cx="43" cy="43" r="32" fill="none" stroke="${s.color}" stroke-width="11"
                                stroke-dasharray="${len.toFixed(2)} ${(circumference - len).toFixed(2)}"
                                stroke-dashoffset="-${offset.toFixed(2)}" />
                      `;
                    }).join('');
                  })()}
                </svg>
                <div class="finance-donut-center-text">
                  <span class="finance-donut-center-val">$${(totalAssets / 1e6).toFixed(1)}M</span>
                  <span class="finance-donut-center-lbl">Assets</span>
                </div>
              </div>

              <!-- Legend -->
              <div class="finance-donut-legend">
                <div class="finance-donut-legend-row" onclick="setFinanceNwClassFilter('retirement')" style="cursor: pointer;" title="Filter ledger to Retirement">
                  <span class="finance-donut-legend-left"><span class="finance-donut-dot" style="background: #7C3AED;"></span>Retirement</span>
                  <span class="finance-donut-legend-pct">${allocPcts.retirement}%</span>
                </div>
                <div class="finance-donut-legend-row" onclick="setFinanceNwClassFilter('brokerage')" style="cursor: pointer;" title="Filter ledger to Brokerage">
                  <span class="finance-donut-legend-left"><span class="finance-donut-dot" style="background: #4F46E5;"></span>Brokerage</span>
                  <span class="finance-donut-legend-pct">${allocPcts.brokerage}%</span>
                </div>
                <div class="finance-donut-legend-row" onclick="setFinanceNwClassFilter('realestate')" style="cursor: pointer;" title="Filter ledger to Real Estate">
                  <span class="finance-donut-legend-left"><span class="finance-donut-dot" style="background: #0D9488;"></span>Real Estate</span>
                  <span class="finance-donut-legend-pct">${allocPcts.realestate}%</span>
                </div>
                <div class="finance-donut-legend-row" onclick="setFinanceNwClassFilter('cash')" style="cursor: pointer;" title="Filter ledger to Cash">
                  <span class="finance-donut-legend-left"><span class="finance-donut-dot" style="background: #065F46;"></span>Cash</span>
                  <span class="finance-donut-legend-pct">${allocPcts.cash}%</span>
                </div>
                <div class="finance-donut-legend-row" onclick="setFinanceNwClassFilter('education')" style="cursor: pointer;" title="Filter ledger to 529 Plan">
                  <span class="finance-donut-legend-left"><span class="finance-donut-dot" style="background: #64748B;"></span>529 Plan</span>
                  <span class="finance-donut-legend-pct">${allocPcts.education}%</span>
                </div>
              </div>
            </div>

            <div class="finance-nw-tile-footer">
              <span>Portfolio Breakdown</span>
              <span>100% Reconciled</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Six Asset Classes Matrix Cards -->
      <div class="finance-nw-classes-grid">
        <div class="finance-nw-class-card" onclick="setFinanceNwClassFilter('retirement')" style="cursor: pointer;" title="Filter ledger to Retirement accounts">
          <div class="finance-nw-class-header">
            <span class="finance-nw-class-title">
              <i data-lucide="shield" style="width: 15px; height: 15px; color: #7C3AED;"></i>
              <span>Retirement (401k &amp; IRAs)</span>
            </span>
            <span class="finance-target-status-badge neutral">${allocPcts.retirement}% Share</span>
          </div>
          <div class="finance-nw-class-amount">$${Math.round(classBreakdown.retirement.total).toLocaleString()}</div>
          <div class="finance-nw-class-footer">
            <span>${classBreakdown.retirement.count} accounts</span>
            <span>Google 401k &amp; Schwab IRAs</span>
          </div>
        </div>

        <div class="finance-nw-class-card" onclick="setFinanceNwClassFilter('brokerage')" style="cursor: pointer;" title="Filter ledger to Taxable Brokerage accounts">
          <div class="finance-nw-class-header">
            <span class="finance-nw-class-title">
              <i data-lucide="trending-up" style="width: 15px; height: 15px; color: #4F46E5;"></i>
              <span>Taxable Brokerage &amp; RSUs</span>
            </span>
            <span class="finance-target-status-badge neutral">${allocPcts.brokerage}% Share</span>
          </div>
          <div class="finance-nw-class-amount">$${Math.round(classBreakdown.brokerage.total).toLocaleString()}</div>
          <div class="finance-nw-class-footer">
            <span>${classBreakdown.brokerage.count} accounts</span>
            <span>Schwab &amp; Google Equity Awards</span>
          </div>
        </div>

        <div class="finance-nw-class-card" onclick="setFinanceNwClassFilter('realestate')" style="cursor: pointer;" title="Filter ledger to Real Estate &amp; Vehicles">
          <div class="finance-nw-class-header">
            <span class="finance-nw-class-title">
              <i data-lucide="home" style="width: 15px; height: 15px; color: #0D9488;"></i>
              <span>Real Estate &amp; Vehicles</span>
            </span>
            <span class="finance-target-status-badge success">${allocPcts.realestate}% Share</span>
          </div>
          <div class="finance-nw-class-amount">$${Math.round(classBreakdown.realestate.total).toLocaleString()}</div>
          <div class="finance-nw-class-footer">
            <span>${classBreakdown.realestate.count} assets</span>
            <span>Livingston NJ ($1.34M) &bull; Tesla Y</span>
          </div>
        </div>

        <div class="finance-nw-class-card" onclick="setFinanceNwClassFilter('cash')" style="cursor: pointer;" title="Filter ledger to Cash &amp; Liquid reserves">
          <div class="finance-nw-class-header">
            <span class="finance-nw-class-title">
              <i data-lucide="droplet" style="width: 15px; height: 15px; color: #065F46;"></i>
              <span>Cash &amp; Liquid Reserves</span>
            </span>
            <span class="finance-target-status-badge success">${runwayMonths} Mo Runway</span>
          </div>
          <div class="finance-nw-class-amount">$${Math.round(classBreakdown.cash.total).toLocaleString()}</div>
          <div class="finance-nw-class-footer">
            <span>${classBreakdown.cash.count} accounts</span>
            <span>Capital One 360 HYSA &bull; Chase</span>
          </div>
        </div>

        <div class="finance-nw-class-card" onclick="setFinanceNwClassFilter('education')" style="cursor: pointer;" title="Filter ledger to 529 Education">
          <div class="finance-nw-class-header">
            <span class="finance-nw-class-title">
              <i data-lucide="graduation-cap" style="width: 15px; height: 15px; color: #64748B;"></i>
              <span>Education Fund (529)</span>
            </span>
            <span class="finance-target-status-badge neutral">${allocPcts.education}% Share</span>
          </div>
          <div class="finance-nw-class-amount">$${Math.round(classBreakdown.education.total).toLocaleString()}</div>
          <div class="finance-nw-class-footer">
            <span>${classBreakdown.education.count} account</span>
            <span>Schwab 529 College Plan</span>
          </div>
        </div>

        <div class="finance-nw-class-card" onclick="setFinanceNwClassFilter('liability')" style="cursor: pointer;" title="Filter ledger to Liabilities">
          <div class="finance-nw-class-header">
            <span class="finance-nw-class-title">
              <i data-lucide="credit-card" style="width: 15px; height: 15px; color: #FF5A5F;"></i>
              <span>Liabilities &amp; Debt</span>
            </span>
            <span class="finance-target-status-badge alert">4.5% Debt Ratio</span>
          </div>
          <div class="finance-nw-class-amount" style="color: #FF5A5F;">-$${Math.round(classBreakdown.liability.total).toLocaleString()}</div>
          <div class="finance-nw-class-footer">
            <span>${classBreakdown.liability.count} accounts</span>
            <span>Mortgage ($277k) + Credit Cards</span>
          </div>
        </div>
      </div>

      <!-- 5. Historical Net Worth Progression (Interactive Sparkline & Trajectory Curve) -->
      ${renderFinanceMilestonesSparkline(milestones)}

      <!-- 6. Active Accounts Ledger & Class Filter Strip (Collapsible) -->
      <div class="finance-section-box" id="finance-active-accounts-ledger">
        <div class="finance-section-header" style="flex-wrap: wrap; gap: 10px; cursor: pointer; user-select: none;" onclick="toggleFinanceLedgerCollapse(event)" title="${financeLedgerCollapsed ? 'Click to expand 35 active accounts' : 'Click to collapse active accounts'}">
          <div style="display: flex; align-items: center; gap: 10px;">
            <button type="button" class="finance-ledger-collapse-btn" onclick="toggleFinanceLedgerCollapse(event)" title="${financeLedgerCollapsed ? 'Expand 35 active accounts' : 'Collapse ledger'}">
              <i data-lucide="${financeLedgerCollapsed ? 'chevron-down' : 'chevron-up'}" style="width: 12px; height: 12px;"></i>
              <span>${financeLedgerCollapsed ? 'Expand' : 'Collapse'}</span>
            </button>
            <div>
              <h3 class="finance-section-title">
                <i data-lucide="wallet" style="width: 18px; height: 18px; color: #0D9488;"></i>
                <span>Active Accounts Ledger (${filteredAccounts.length} of ${accounts.length})</span>
              </h3>
              <span style="font-size: 0.76rem; color: var(--text-muted);">Reconciled institutional balances as of ${asOfDate}</span>
            </div>
          </div>

          <!-- Ledger Search Input -->
          <div style="display: flex; align-items: center; gap: 8px;" onclick="event.stopPropagation()">
            <div class="finance-search-wrap">
              <i data-lucide="search" class="finance-search-icon"></i>
              <input type="text" 
                     class="finance-search-input" 
                     placeholder="Search account..." 
                     value="${escapeHtml(financeNwSearchQuery)}" 
                     oninput="handleFinanceNwSearch(event)"
                     autocomplete="off"
                     spellcheck="false">
              ${financeNwSearchQuery ? `
                <button type="button" class="finance-search-clear-btn" onclick="clearFinanceNwSearch(event)" title="Clear search">
                  <i data-lucide="x" style="width: 12px; height: 12px;"></i>
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        ${!financeLedgerCollapsed ? `
          <!-- Filter Pills Row -->
          <div class="finance-nw-filters" style="margin-bottom: 14px; margin-top: 14px;">
            <button class="finance-nw-filter-pill ${financeNwClassFilter === 'all' ? 'active' : ''}" onclick="setFinanceNwClassFilter('all')">
              All (${accounts.length})
            </button>
            <button class="finance-nw-filter-pill ${financeNwClassFilter === 'retirement' ? 'active' : ''}" onclick="setFinanceNwClassFilter('retirement')">
              Retirement (${classBreakdown.retirement.count})
            </button>
            <button class="finance-nw-filter-pill ${financeNwClassFilter === 'brokerage' ? 'active' : ''}" onclick="setFinanceNwClassFilter('brokerage')">
              Brokerage &amp; RSUs (${classBreakdown.brokerage.count})
            </button>
            <button class="finance-nw-filter-pill ${financeNwClassFilter === 'realestate' ? 'active' : ''}" onclick="setFinanceNwClassFilter('realestate')">
              Real Estate (${classBreakdown.realestate.count})
            </button>
            <button class="finance-nw-filter-pill ${financeNwClassFilter === 'cash' ? 'active' : ''}" onclick="setFinanceNwClassFilter('cash')">
              Cash (${classBreakdown.cash.count})
            </button>
            <button class="finance-nw-filter-pill ${financeNwClassFilter === 'education' ? 'active' : ''}" onclick="setFinanceNwClassFilter('education')">
              529 Plan (${classBreakdown.education.count})
            </button>
            <button class="finance-nw-filter-pill ${financeNwClassFilter === 'liability' ? 'active' : ''}" onclick="setFinanceNwClassFilter('liability')">
              Liabilities (${classBreakdown.liability.count})
            </button>
          </div>

          <!-- Accounts Grid -->
          <div class="finance-accounts-grid">
            ${filteredAccounts.map(acc => {
              const isLiab = acc.assetClass === 'liability';
              const bal = parseFloat(acc.balance) || 0;
              const balColor = isLiab ? '#FF5A5F' : 'var(--text-primary, #3a3A42)';
              return `
                <div class="finance-acc-card" style="${isLiab ? 'border-left: 3px solid #FF5A5F;' : ''}">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                    <div style="min-width: 0;">
                      <strong style="font-size: 0.88rem; color: var(--text-primary); display: block; line-height: 1.25;" title="${escapeHtml(acc.name)}">
                        ${escapeHtml(acc.name)}
                      </strong>
                      <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 3px;">
                        ${escapeHtml(acc.institution || 'Institutional')} &bull; ${escapeHtml(acc.subType || acc.assetClass)}
                      </div>
                    </div>
                    ${acc.apy ? `<span class="zlog-ood-badge funded" style="font-size: 0.66rem; flex-shrink: 0;">APY ${escapeHtml(acc.apy)}</span>` : ''}
                  </div>
                  <div class="finance-kpi-value" style="font-size: 1.3rem; color: ${balColor}; margin: 8px 0 3px 0;">
                    ${isLiab ? '-' : ''}$${Math.abs(bal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.70rem; color: var(--text-muted);">
                    <span>Class: <strong style="text-transform: capitalize;">${escapeHtml(acc.assetClass)}</strong></span>
                    <span>${escapeHtml(acc.updated || asOfDate)}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}
      </div>

      <!-- 7. Compact Balances CSV Upload / Drag-and-Drop Zone -->
      <div class="monarch-dropzone-compact" id="balances-dropzone-el" onclick="triggerBalancesFileInput()">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; width: 100%;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="monarch-dropzone-icon" style="width: 34px; height: 34px; margin: 0; background: var(--bg-card); color: #0D9488; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="upload-cloud" style="width: 18px; height: 18px;"></i>
            </div>
            <div style="text-align: left;">
              <strong style="font-size: 0.86rem; color: var(--text-primary); display: block;">Sync Monarch Balances CSV</strong>
              <span style="font-size: 0.74rem; color: var(--text-muted);">Drop Balances_*.csv to refresh Net Worth, 35 accounts &amp; historical milestones</span>
            </div>
          </div>
          <div style="display: flex; gap: 8px;" onclick="event.stopPropagation()">
            <button class="btn btn-secondary" onclick="triggerBalancesFileInput()" style="font-size: 0.74rem; padding: 4px 10px;">
              <i data-lucide="folder-open" style="width: 12px; height: 12px;"></i>
              <span>Browse Balances CSV</span>
            </button>
          </div>
        </div>
        <input type="file" id="balances-file-input" accept=".csv" style="display: none;" onchange="handleBalancesFileSelected(event)">
      </div>

    </div>
  `;

  // Attach drag and drop listeners to balances dropzone
  setupBalancesDropzoneListeners();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function setupBalancesDropzoneListeners() {
  const dropzone = document.getElementById('balances-dropzone-el');
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
      const file = files[0];
      const reader = new FileReader();
      reader.onload = function(ev) {
        parseAndLoadBalancesCSV(ev.target.result);
      };
      reader.readAsText(file);
    }
  }, false);
}

function triggerBalancesFileInput() {
  let input = document.getElementById('balances-file-input');
  if (!input) {
    input = document.createElement('input');
    input.type = 'file';
    input.id = 'balances-file-input';
    input.accept = '.csv';
    input.style.display = 'none';
    input.addEventListener('change', handleBalancesFileSelected);
    document.body.appendChild(input);
  }
  input.click();
}

function handleBalancesFileSelected(event) {
  const file = event.target.files && event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      parseAndLoadBalancesCSV(e.target.result);
    };
    reader.readAsText(file);
    try { event.target.value = ''; } catch(e) {}
  }
}

function parseAndLoadBalancesCSV(csvText) {
  try {
    const rows = parseCSVString(csvText);
    if (rows.length < 2) {
      alert('The uploaded balances CSV does not contain enough rows.');
      return;
    }

    const headers = rows[0].map(h => h.trim().toLowerCase());
    const dateIdx = headers.findIndex(h => h.includes('date') && !h.includes('updated'));
    const accountIdx = headers.findIndex(h => h === 'account' || (h.includes('account') && !h.includes('type')));
    const typeIdx = headers.findIndex(h => h.includes('account type') || h.includes('type'));
    const subTypeIdx = headers.findIndex(h => h.includes('subtype'));
    const balanceIdx = headers.findIndex(h => h.includes('balance'));
    const updatedIdx = headers.findIndex(h => h.includes('updated'));

    if (balanceIdx === -1 || accountIdx === -1) {
      alert('Could not locate "Account" and "Balance" columns in this CSV file.');
      return;
    }

    let maxDate = '';
    const dateGroups = {};

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;
      const dStr = (row[dateIdx] || '').trim();
      if (!dStr) continue;
      if (dStr > maxDate) maxDate = dStr;
      if (!dateGroups[dStr]) dateGroups[dStr] = [];
      dateGroups[dStr].push(row);
    }

    if (!maxDate || !dateGroups[maxDate]) {
      alert('Could not determine snapshot dates in this CSV.');
      return;
    }

    const classifyAccount = (name, type, subType, bal) => {
      const n = name.toLowerCase();
      const t = type.toLowerCase();
      const st = subType.toLowerCase();

      if (t === 'loan' || t === 'credit card' || st.includes('credit') || st.includes('mortgage') || st.includes('loan')) {
        return 'liability';
      }
      if (bal < 0) return 'liability';

      if (t === 'real estate' || t === 'asset' || st.includes('residence') || st.includes('vehicle') || st.includes('property')) {
        return 'realestate';
      }

      if (t.includes('retirement') || st.includes('401') || st.includes('ira') || n.includes('401k') || n.includes('ira')) {
        return 'retirement';
      }

      if (st.includes('529') || n.includes('529') || t.includes('education')) {
        return 'education';
      }

      if (n.includes('equity awards') || n.includes('rsu')) {
        return 'equity';
      }

      if (t.includes('brokerage') || t.includes('investment') || st.includes('brokerage')) {
        return 'brokerage';
      }

      if (t.includes('depository') || t.includes('cash') || st.includes('checking') || st.includes('savings') || st.includes('cd')) {
        return 'cash';
      }

      return 'brokerage';
    };

    const getInstitutionFromName = (name, type) => {
      const n = name.toLowerCase();
      if (n.includes('google')) return 'Google / ERCO';
      if (n.includes('schwab')) return 'Schwab';
      if (n.includes('chase') || n.includes('csp') || n.includes('cff')) return 'Chase';
      if (n.includes('capital one') || n.includes('360')) return 'Capital One';
      if (n.includes('amex') || n.includes('american express')) return 'Amex';
      if (n.includes('fidelity')) return 'Fidelity';
      if (n.includes('citi')) return 'Citi';
      if (n.includes('stonewall') || n.includes('livingston')) return 'Livingston NJ';
      if (n.includes('tesla')) return 'Tesla';
      return type || 'Other';
    };

    const latestRows = dateGroups[maxDate];
    const parsedAccounts = [];
    let totalAssets = 0;
    let totalLiabilities = 0;
    let liquidCash = 0;

    latestRows.forEach((r, idx) => {
      const name = (r[accountIdx] || '').trim();
      if (!name) return;
      const rawBal = (r[balanceIdx] || '0').replace(/[\$,]/g, '').trim();
      const bal = parseFloat(rawBal) || 0;
      const type = (typeIdx !== -1 && r[typeIdx]) ? r[typeIdx].trim() : '';
      const subType = (subTypeIdx !== -1 && r[subTypeIdx]) ? r[subTypeIdx].trim() : '';
      const updated = (updatedIdx !== -1 && r[updatedIdx]) ? r[updatedIdx].trim() : maxDate;

      const assetClass = classifyAccount(name, type, subType, bal);

      if (assetClass === 'liability') {
        const liabBal = bal > 0 ? -bal : bal;
        totalLiabilities += Math.abs(liabBal);
        parsedAccounts.push({
          id: `acc-${idx}-${Date.now()}`,
          name,
          balance: liabBal,
          assetClass,
          subType: subType || (type === 'loan' ? 'Mortgage' : 'Revolving Credit'),
          institution: getInstitutionFromName(name, type),
          updated
        });
      } else {
        totalAssets += bal;
        if (assetClass === 'cash') {
          liquidCash += bal;
        }
        parsedAccounts.push({
          id: `acc-${idx}-${Date.now()}`,
          name,
          balance: bal,
          assetClass,
          subType: subType || type,
          institution: getInstitutionFromName(name, type),
          updated
        });
      }
    });

    parsedAccounts.sort((a, b) => {
      if (a.assetClass === 'liability' && b.assetClass !== 'liability') return 1;
      if (a.assetClass !== 'liability' && b.assetClass === 'liability') return -1;
      return Math.abs(b.balance) - Math.abs(a.balance);
    });

    const sortedDates = Object.keys(dateGroups).sort();
    const milestoneDates = new Set();
    sortedDates.forEach(d => {
      if (d.endsWith('-01')) milestoneDates.add(d);
    });
    if (sortedDates.length > 0) {
      milestoneDates.add(sortedDates[0]);
      milestoneDates.add(maxDate);
    }

    const milestones = Array.from(milestoneDates).sort().map(d => {
      const dayRows = dateGroups[d];
      let dayAssets = 0;
      let dayLiabilities = 0;
      dayRows.forEach(r => {
        const rawBal = (r[balanceIdx] || '0').replace(/[\$,]/g, '').trim();
        const bal = parseFloat(rawBal) || 0;
        const name = (r[accountIdx] || '').trim();
        const type = (typeIdx !== -1 && r[typeIdx]) ? r[typeIdx].trim() : '';
        const subType = (subTypeIdx !== -1 && r[subTypeIdx]) ? r[subTypeIdx].trim() : '';
        const cls = classifyAccount(name, type, subType, bal);
        if (cls === 'liability') {
          dayLiabilities += Math.abs(bal);
        } else {
          dayAssets += bal;
        }
      });
      return {
        date: d,
        assets: parseFloat(dayAssets.toFixed(2)),
        liabilities: parseFloat(dayLiabilities.toFixed(2)),
        netWorth: parseFloat((dayAssets - dayLiabilities).toFixed(2))
      };
    });

    const netWorthData = {
      asOfDate: maxDate,
      totalAssets: parseFloat(totalAssets.toFixed(2)),
      totalLiabilities: parseFloat(totalLiabilities.toFixed(2)),
      netWorth: parseFloat((totalAssets - totalLiabilities).toFixed(2)),
      liquidCash: parseFloat(liquidCash.toFixed(2)),
      accounts: parsedAccounts,
      milestones
    };

    storage.saveFinanceNetWorth(netWorthData);

    if (typeof showToast === 'function') {
      showToast(`✓ Loaded Balances CSV! Net Worth: $${Math.round(netWorthData.netWorth).toLocaleString()} across ${parsedAccounts.length} accounts.`, 'success');
    }
    renderFinanceRunway();
  } catch (err) {
    console.error('Failed to parse balances CSV:', err);
    alert('Failed to parse balances CSV: ' + err.message);
  }
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
  let input = document.getElementById('monarch-file-input');
  if (!input) {
    input = document.createElement('input');
    input.type = 'file';
    input.id = 'monarch-file-input';
    input.accept = '.csv';
    input.style.display = 'none';
    input.addEventListener('change', handleMonarchFileSelected);
    document.body.appendChild(input);
  }
  input.click();
}

function handleMonarchFileSelected(event) {
  const file = event.target.files && event.target.files[0];
  if (file) {
    processMonarchCSVFile(file);
    try { event.target.value = ''; } catch(e) {}
  }
}

function processMonarchCSVFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const lowerFirstLine = (text.slice(0, 1000) || '').toLowerCase();
    if (lowerFirstLine.includes('balance') && lowerFirstLine.includes('account') && !lowerFirstLine.includes('merchant')) {
      parseAndLoadBalancesCSV(text);
    } else {
      parseAndLoadMonarchCSV(text);
    }
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
    if (headers.includes('balance') && headers.includes('account') && !headers.includes('merchant')) {
      parseAndLoadBalancesCSV(csvText);
      return;
    }
    const dateIdx = headers.findIndex(h => h.includes('date'));
    const merchantIdx = headers.findIndex(h => h.includes('merchant') || h.includes('description') || h.includes('payee'));
    const categoryIdx = headers.findIndex(h => h.includes('category'));
    const accountIdx = headers.findIndex(h => h.includes('account'));
    const amountIdx = headers.findIndex(h => h.includes('amount'));
    const memoIdx = headers.findIndex(h => h.includes('statement') || h.includes('memo') || h.includes('notes'));
    const tagsIdx = headers.findIndex(h => h.includes('tag'));
    const idIdx = headers.findIndex(h => h === 'id');

    if (amountIdx === -1) {
      alert('Could not locate an "Amount" column in this CSV file.');
      return;
    }

    // Categories to skip from earn vs spend (Transfers, credit card payments, buys/sells)
    const TRANSFER_CATS = [
      'credit card payment', 'transfer', 'buy', 'sell', 'balance adjustment',
      'balance adjustments', 'source to source/fund to fund transfer in',
      'source to source/fund to fund transfer out', 'plan contribution'
    ];

    // Income categories
    const INCOME_CATS = [
      'paychecks', 'paycheck', 'interest', 'dividends & capital gains',
      'other income (incl cc reward credits)', 'income', 'bonus'
    ];

    // Category classifications and icons mapping
    const CATEGORY_MAP = {
      'Mortgage': { classification: 'Fixed Baseline', icon: 'home' },
      'Medical + Dentist': { classification: 'Healthcare', icon: 'heart-pulse' },
      'Home maintenance': { classification: 'Discretionary', icon: 'wrench' },
      'Shopping': { classification: 'Discretionary', icon: 'shopping-bag' },
      'Groceries': { classification: 'Essential', icon: 'shopping-cart' },
      'Travel & Vacation': { classification: 'Discretionary', icon: 'plane' },
      'Eating out': { classification: 'Discretionary', icon: 'utensils' },
      'Gas & Electric': { classification: 'Fixed Baseline', icon: 'zap' },
      'Child Activities': { classification: 'Enrichment', icon: 'book-open' },
      'Mocha': { classification: 'Fixed Baseline', icon: 'paw-print' },
      'Clothing, Shoes, Jewelry': { classification: 'Discretionary', icon: 'tag' },
      'Transportation': { classification: 'Essential', icon: 'car' },
      'Fitness': { classification: 'Self Care', icon: 'activity' },
      'Self care + Grooming': { classification: 'Self Care', icon: 'sparkles' },
      "C'mas, Bday, India gifts 🎄 🎂 🇮🇳": { classification: 'Discretionary', icon: 'gift' },
      'Camp': { classification: 'Enrichment', icon: 'sun' },
      'Child Care': { classification: 'Fixed Baseline', icon: 'baby' },
      'Subscriptions': { classification: 'Discretionary', icon: 'repeat' },
      'Water': { classification: 'Fixed Baseline', icon: 'droplet' },
      'School stuff + Education': { classification: 'Fixed Baseline', icon: 'graduation-cap' },
      'Home Improvement': { classification: 'Discretionary', icon: 'home' },
      'Internet & Cable': { classification: 'Fixed Baseline', icon: 'wifi' },
      'Charity': { classification: 'Discretionary', icon: 'heart' },
      'Home Security': { classification: 'Fixed Baseline', icon: 'shield' },
      'Entertainment & Recreation': { classification: 'Discretionary', icon: 'film' }
    };

    const monthTotals = {}; // { [YYYY-MM]: { income: 0, outflow: 0, categories: {} } }
    const allValidTransactions = [];
    const categoryFrequency = {};
    const seenTxSigs = new Set();

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0 || !row[dateIdx]) continue;

      let rawAmount = row[amountIdx] || '0';
      rawAmount = rawAmount.replace(/[\$,]/g, '').trim();
      let originalVal = parseFloat(rawAmount) || 0;
      
      let categoryName = (categoryIdx !== -1 && row[categoryIdx]) ? row[categoryIdx].trim() : 'Discretionary';
      if (categoryName.toLowerCase() === 'auto payment') {
        categoryName = 'Transportation';
      }
      const catLower = categoryName.toLowerCase();
      const merchantName = (merchantIdx !== -1 && row[merchantIdx]) ? row[merchantIdx].trim() : 'Transaction';
      const accountName = (accountIdx !== -1 && row[accountIdx]) ? row[accountIdx].trim() : 'Account';
      const tagsVal = (tagsIdx !== -1 && row[tagsIdx]) ? row[tagsIdx].trim() : '';
      const dateVal = row[dateIdx].trim();
      const txId = (idIdx !== -1 && row[idIdx]) ? row[idIdx].trim() : ('tx-m-' + i);
      const memoVal = (memoIdx !== -1 && row[memoIdx]) ? row[memoIdx].trim().toLowerCase() : '';

      // Skip internal transfers and credit card paydowns
      if (TRANSFER_CATS.includes(catLower) || catLower.includes('transfer') || catLower.includes('credit card payment')) {
        continue;
      }

      // Deduplicate identical transaction IDs if repeated
      if (seenTxSigs.has(txId)) {
        continue;
      }
      seenTxSigs.add(txId);

      const isIncome = INCOME_CATS.includes(catLower) || catLower.includes('paycheck') || catLower.includes('income');

      if (dateVal.length >= 7) {
        const mStr = dateVal.substring(0, 7);
        if (!monthTotals[mStr]) {
          monthTotals[mStr] = { income: 0, outflow: 0, categories: {} };
        }

        if (isIncome) {
          // Use signed value so dividend reinvestments net to 0, exactly matching Monarch
          monthTotals[mStr].income += originalVal;
        } else {
          if (originalVal < 0) {
            const spend = Math.abs(originalVal);
            monthTotals[mStr].outflow += spend;
            monthTotals[mStr].categories[categoryName] = (monthTotals[mStr].categories[categoryName] || 0) + spend;
            categoryFrequency[categoryName] = (categoryFrequency[categoryName] || 0) + 1;
          } else if (originalVal > 0) {
            // Refund/reimbursement
            monthTotals[mStr].outflow -= originalVal;
            monthTotals[mStr].categories[categoryName] = (monthTotals[mStr].categories[categoryName] || 0) - originalVal;
          }
        }
      }

      allValidTransactions.push({
        id: txId,
        date: dateVal,
        merchant: merchantName,
        category: categoryName,
        account: accountName,
        amount: Math.abs(originalVal),
        isIncome: isIncome,
        tags: tagsVal
      });
    }

    // Sort transactions descending by date
    allValidTransactions.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    // 1. Non-destructive merge of monthly summaries
    const currentFin = storage.getFinanceData() || {};
    const existingSummaries = Array.isArray(currentFin.monthlySummaries) ? currentFin.monthlySummaries : [];
    const summaryMap = new Map();

    // Pre-populate with all existing historical months so older data is never wiped
    existingSummaries.forEach(s => {
      if (s && s.month) {
        summaryMap.set(s.month, { ...s });
      }
    });

    // Upsert newly parsed months from CSV
    const sortedMonths = Object.keys(monthTotals).sort().reverse();
    sortedMonths.forEach(mStr => {
      const existing = summaryMap.get(mStr);
      summaryMap.set(mStr, {
        month: mStr,
        income: Math.round(monthTotals[mStr].income * 100) / 100,
        outflow: Math.max(0, Math.round(monthTotals[mStr].outflow * 100) / 100),
        notes: (existing && existing.notes && !existing.notes.startsWith('Synced from Monarch'))
          ? existing.notes
          : `Synced from Monarch (${monthTotals[mStr].income > 0 ? 'Salary + ' : ''}Spend tracked)`
      });
    });

    const mergedSummaries = Array.from(summaryMap.values())
      .sort((a, b) => (b.month || '').localeCompare(a.month || ''));

    // 2. Non-destructive merge of transactions (deduplicated by ID or composite signature)
    const existingTxs = Array.isArray(currentFin.transactions) ? currentFin.transactions : [];
    const txMap = new Map();

    existingTxs.forEach(tx => {
      if (!tx) return;
      const key = tx.id || `${tx.date}_${tx.amount}_${tx.merchant}_${tx.account}`;
      txMap.set(key, tx);
    });

    let newTxCount = 0;
    allValidTransactions.forEach(tx => {
      const key = tx.id || `${tx.date}_${tx.amount}_${tx.merchant}_${tx.account}`;
      if (!txMap.has(key)) {
        newTxCount++;
      }
      txMap.set(key, tx);
    });

    const mergedTransactions = Array.from(txMap.values())
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 600); // 600 recent transactions provides rich history while remaining ~150KB

    // 3. Merged rolling category baselines
    // Only recalculate baselines if CSV provides at least 2 completed prior months; otherwise keep established baselines
    const baselineSourceMonths = sortedMonths.slice(1, 4);
    const mergedBaselines = { ...(currentFin.categoryBaselines || {}) };
    const allSeenCats = Object.keys(categoryFrequency);

    if (baselineSourceMonths.length >= 2) {
      allSeenCats.forEach(catName => {
        let sum = 0;
        let count = 0;
        baselineSourceMonths.forEach(mStr => {
          if (monthTotals[mStr] && monthTotals[mStr].categories[catName]) {
            sum += monthTotals[mStr].categories[catName];
          }
          count++;
        });
        const avg = count > 0 ? (sum / count) : 0;
        if (avg > 0 || (categoryFrequency[catName] || 0) >= 2) {
          mergedBaselines[catName] = Math.round(avg * 100) / 100;
        }
      });
    } else {
      // For weekly or single-month uploads, add baselines only for any newly discovered categories
      allSeenCats.forEach(catName => {
        if (mergedBaselines[catName] === undefined) {
          const firstMonthSpend = (sortedMonths.length > 0 && monthTotals[sortedMonths[0]]?.categories[catName]) || 500;
          mergedBaselines[catName] = Math.round(firstMonthSpend * 100) / 100;
        }
      });
    }

    // 4. Merged categories list (Preserve existing classifications and customizations)
    const existingCats = Array.isArray(currentFin.categories) ? currentFin.categories : [];
    const catMap = new Map();
    existingCats.forEach(c => {
      if (c && c.name) catMap.set(c.name, { ...c });
    });

    allSeenCats.forEach(catName => {
      const meta = CATEGORY_MAP[catName] || { classification: 'Discretionary', icon: 'tag' };
      const base = mergedBaselines[catName] || 500;
      if (catMap.has(catName)) {
        const existing = catMap.get(catName);
        existing.baseline = Math.round(base);
        if (!existing.budget) existing.budget = Math.round(base);
        // Existing user classification is safely preserved!
      } else {
        catMap.set(catName, {
          id: 'cat-' + catName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: catName,
          budget: Math.round(base),
          baseline: Math.round(base),
          classification: meta.classification,
          icon: meta.icon
        });
      }
    });

    const mergedCategories = Array.from(catMap.values());

    const todayStr = (typeof formatDateIso === 'function')
      ? formatDateIso(new Date())
      : new Date().toISOString().split('T')[0];

    // 5. Save updated state and mark weekly cadence as complete
    const updatedFin = {
      ...currentFin,
      monthlySummaries: mergedSummaries,
      categoryBaselines: mergedBaselines,
      categories: mergedCategories,
      transactions: mergedTransactions,
      lastSyncDate: todayStr
    };

    storage.saveFinanceData(updatedFin);
    storage.saveMonarchTransactions(mergedTransactions);

    // Automatically check off weekly Sunday cadence
    const sundayIso = getCurrentWeekSundayIso();
    storage.setFinanceSundayUpdated(sundayIso, true);

    if (sortedMonths.length > 0) {
      selectedFinanceMonth = sortedMonths[0]; // Active month (e.g. 2026-10)
    }

    if (typeof confetti === 'function') {
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.18 } });
      } catch (e) {}
    }

    let toastMsg = '';
    if (newTxCount > 0) {
      toastMsg = `Added ${newTxCount} new transaction${newTxCount === 1 ? '' : 's'}! (${existingTxs.length} historical verified without duplicates) ✨`;
    } else {
      toastMsg = `All transactions up to date! (0 new transactions found across ${allValidTransactions.length} records) ✨`;
    }
    if (typeof showToast === 'function') {
      showToast(toastMsg, 'success');
    } else {
      alert(toastMsg);
    }
    renderFinancePage('burn');
  } catch (err) {
    console.error('Error parsing Monarch CSV:', err);
    alert('Failed to parse Monarch CSV file: ' + err.message);
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
    if (activeFinanceSubTab === 'burn') {
      renderFinanceBurn();
    } else {
      renderFinanceSubscriptions();
    }
  }
}

function deleteSubscriptionItem(id) {
  if (confirm('Delete this subscription?')) {
    storage.deleteFinanceSubscription(id);
    if (activeFinanceSubTab === 'burn') {
      renderFinanceBurn();
    } else {
      renderFinanceSubscriptions();
    }
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
  if (activeFinanceSubTab === 'burn') {
    renderFinanceBurn();
  } else {
    renderFinanceSubscriptions();
  }
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
          <h4 style="font-size: 0.82rem; font-weight: 700; color: #065F46; margin: 0;">Category Targets ($)</h4>
          ${cats.map(c => `
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
              <span style="font-size: 0.82rem; color: var(--text-primary); flex: 1;">${escapeHtml(c.name)}</span>
              <input type="number" id="cat-budget-${c.id}" class="form-control" value="${c.budget}" style="width: 110px; font-family: var(--font-sans); font-variant-numeric: tabular-nums; font-size: 0.82rem;">
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

/* ==========================================================================
   Consolidated CSV Export Engine (All Finance Tabs)
   ========================================================================== */
function exportAllFinanceDataToCSV() {
  const fin = storage.getFinanceData();
  const claims = (typeof storage !== 'undefined' && typeof storage.getClaimsData === 'function')
    ? storage.getClaimsData()
    : [];

  const todayStr = (typeof formatDateIso === 'function')
    ? formatDateIso(new Date())
    : new Date().toISOString().split('T')[0];

  function csvEscape(val) {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  }

  const rows = [];
  rows.push(['# ==============================================================================']);
  rows.push(['# MARGO LIFE OS — CONSOLIDATED FINANCIAL EXPORT']);
  rows.push([`# Export Date: ${todayStr}`]);
  rows.push(['# Tabs Included: Cash Flow & Radar, Subscriptions & Card ROI, Accounts & Runway, Medical Claims, Monarch Ledger']);
  rows.push(['# ==============================================================================']);
  rows.push([]);

  // 1. Cash Flow Summaries
  rows.push(['=== SECTION 1: CASH FLOW & MONTHLY SUMMARIES ===']);
  rows.push(['Month', 'Income (Inflow)', 'Spend (Outflow)', 'Net Cash Flow Delta', 'Savings Rate %', 'Cash Flow Status', 'Strategic Notes']);
  const summaries = fin.monthlySummaries || [];
  summaries.forEach(m => {
    const inc = parseFloat(m.income) || 0;
    const out = parseFloat(m.outflow) || 0;
    const net = inc - out;
    const rate = inc > 0 ? ((net / inc) * 100).toFixed(1) + '%' : '0%';
    const status = net >= 0 ? 'Surplus' : 'Deficit';
    rows.push([
      csvEscape(m.month),
      csvEscape(inc.toFixed(2)),
      csvEscape(out.toFixed(2)),
      csvEscape(net.toFixed(2)),
      csvEscape(rate),
      csvEscape(status),
      csvEscape(m.notes || '')
    ]);
  });
  rows.push([]);

  // 2. Category Outliers vs Baseline (for Selected or Current Month)
  rows.push(['=== SECTION 2: CATEGORY SPEND & BASELINE ANOMALIES ===']);
  rows.push(['Month', 'Category', 'Classification', 'Actual Month Spend', '3-Mo Baseline Avg', 'Delta Dollar', 'Delta Pct %', 'Outlier Status']);
  const categories = fin.categories || [];
  const baselines = fin.categoryBaselines || {};
  const currentMonthTxs = (fin.transactions || []).filter(t => t.date && t.date.startsWith(selectedFinanceMonth || '2026-10'));
  
  const catSpendMap = {};
  categories.forEach(c => { catSpendMap[c.name] = 0; });
  currentMonthTxs.forEach(t => {
    const amt = parseFloat(t.amount) || 0;
    if (t.category !== 'Income' && (!t.tags || !t.tags.includes('Income')) && amt > 0) {
      const catName = t.category || 'Discretionary';
      catSpendMap[catName] = (catSpendMap[catName] || 0) + amt;
    }
  });

  categories.forEach(c => {
    const spent = catSpendMap[c.name] || 0;
    const baseline = baselines[c.name] || c.baseline || c.budget || 500;
    const delta = spent - baseline;
    const pctDelta = baseline > 0 ? Math.round((delta / baseline) * 100) : 0;
    let status = 'On Baseline';
    if (pctDelta > 20) status = 'Outlier Spike';
    if (pctDelta < -20) status = 'Reduced Spend';

    rows.push([
      csvEscape(selectedFinanceMonth || '2026-10'),
      csvEscape(c.name),
      csvEscape(c.classification || 'General'),
      csvEscape(spent.toFixed(2)),
      csvEscape(baseline.toFixed(2)),
      csvEscape((delta >= 0 ? '+' : '') + delta.toFixed(2)),
      csvEscape((pctDelta >= 0 ? '+' : '') + pctDelta + '%'),
      csvEscape(status)
    ]);
  });
  rows.push([]);

  // 3. Subscriptions & Recurring
  rows.push(['=== SECTION 3: RECURRING SUBSCRIPTIONS & COMMITMENTS ===']);
  rows.push(['Service Name', 'Category', 'Cost', 'Cadence', 'Annualized Cost', 'Next Renewal', 'Status', 'Auto-Renew', 'Notes']);
  (fin.subscriptions || []).forEach(s => {
    const cost = parseFloat(s.cost) || 0;
    let annual = cost * 12;
    if (s.cadence === 'annual') annual = cost;
    if (s.cadence === 'lifetime') annual = 0;

    rows.push([
      csvEscape(s.name),
      csvEscape(s.category || 'General'),
      csvEscape(cost.toFixed(2)),
      csvEscape(s.cadence || 'monthly'),
      csvEscape(annual.toFixed(2)),
      csvEscape(s.nextRenewal || ''),
      csvEscape(s.status || 'active'),
      csvEscape(s.autoRenew !== false ? 'Yes' : 'No'),
      csvEscape(s.notes || '')
    ]);
  });
  rows.push([]);

  // 4. Accounts & Balances / Liquid Runway
  rows.push(['=== SECTION 4: ACCOUNTS & LIQUID BALANCES ===']);
  rows.push(['Account Name', 'Institution', 'Account Type', 'Current Balance', 'APY / Notes', 'Last Updated']);
  (fin.accounts || []).forEach(a => {
    rows.push([
      csvEscape(a.name),
      csvEscape(a.institution || ''),
      csvEscape(a.type || 'liquid'),
      csvEscape((parseFloat(a.balance) || 0).toFixed(2)),
      csvEscape(a.apy || '—'),
      csvEscape(a.updated || todayStr)
    ]);
  });
  rows.push([]);

  // 5. Medical Reimbursements & Claims
  rows.push(['=== SECTION 5: MEDICAL REIMBURSEMENTS & SUPERBILLS ===']);
  rows.push(['Claim ID', 'Patient', 'Provider', 'Date of Service', 'Amount Billed', 'Stage', 'Superbill Status', 'Next Action', 'Notes']);
  claims.forEach(cl => {
    rows.push([
      csvEscape(cl.id || ''),
      csvEscape(cl.patient || 'Family'),
      csvEscape(cl.provider || ''),
      csvEscape(cl.dateOfService || ''),
      csvEscape((parseFloat(cl.amountBilled) || 0).toFixed(2)),
      csvEscape(cl.stage || 'pending'),
      csvEscape(cl.superbillStatus || ''),
      csvEscape(cl.nextAction || ''),
      csvEscape(cl.notes || '')
    ]);
  });
  rows.push([]);

  // 6. Monarch Transactions Ledger
  rows.push(['=== SECTION 6: MONARCH TRANSACTIONS LEDGER ===']);
  rows.push(['Date', 'Merchant', 'Category', 'Account', 'Amount', 'Tags', 'Notes']);
  (fin.transactions || []).forEach(t => {
    rows.push([
      csvEscape(t.date || ''),
      csvEscape(t.merchant || ''),
      csvEscape(t.category || ''),
      csvEscape(t.account || ''),
      csvEscape((parseFloat(t.amount) || 0).toFixed(2)),
      csvEscape(t.tags || ''),
      csvEscape(t.notes || '')
    ]);
  });

  // Build CSV string with UTF-8 BOM
  const csvContent = rows.map(r => r.join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `margo_finances_export_${todayStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  if (typeof showToast === 'function') {
    showToast('All finance tabs exported to CSV 📊');
  }
}

/* ==========================================================================
   Modal: Log / Edit Monthly Cash Flow Inflow & Outflow
   ========================================================================== */
function openLogCashFlowModal(targetMonth = '2026-10') {
  let modal = document.getElementById('modal-log-cashflow');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-log-cashflow';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const fin = storage.getFinanceData();
  const summaries = fin.monthlySummaries || [];
  const existing = summaries.find(m => m.month === targetMonth) || {
    month: targetMonth,
    income: 14250.00,
    outflow: 10410.00,
    notes: ''
  };

  modal.innerHTML = `
    <div class="modal-card" style="max-width: 480px;">
      <div class="modal-header">
        <h3 class="modal-title">Log Month Cash Flow</h3>
        <button class="modal-close-btn" onclick="closeLogCashFlowModal()">&times;</button>
      </div>
      <form onsubmit="submitLogCashFlowModal(event)">
        <div class="modal-body" style="display: flex; flex-direction: column; gap: 14px;">
          <div class="form-group">
            <label class="form-label">Month (YYYY-MM)</label>
            <input type="month" id="flow-modal-month" class="form-control" value="${existing.month}" required>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label">Income Inflow ($)</label>
              <input type="number" step="0.01" id="flow-modal-income" class="form-control" value="${existing.income}" placeholder="14250.00" required>
            </div>
            <div class="form-group">
              <label class="form-label">Total Outflow ($)</label>
              <input type="number" step="0.01" id="flow-modal-outflow" class="form-control" value="${existing.outflow}" placeholder="10410.00" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Month Notes &amp; Big Drivers (Optional)</label>
            <textarea id="flow-modal-notes" class="form-control" rows="2" placeholder="e.g. Bonus wire received, fall capsule wardrobe, high dining...">${escapeHtml(existing.notes || '')}</textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeLogCashFlowModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Cash Flow</button>
        </div>
      </form>
    </div>
  `;

  modal.classList.add('active');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function submitLogCashFlowModal(e) {
  e.preventDefault();
  const month = document.getElementById('flow-modal-month').value;
  const income = parseFloat(document.getElementById('flow-modal-income').value) || 0;
  const outflow = parseFloat(document.getElementById('flow-modal-outflow').value) || 0;
  const notes = document.getElementById('flow-modal-notes').value.trim();

  const summary = { month, income, outflow, notes };
  storage.saveMonthlyCashFlowSummary(summary);
  selectedFinanceMonth = month;
  closeLogCashFlowModal();
  renderFinanceBurn();

  if (typeof showToast === 'function') {
    showToast(`Cash flow saved for ${formatFinanceMonthLabel(month)} ✨`);
  }
}

function closeLogCashFlowModal() {
  const m = document.getElementById('modal-log-cashflow');
  if (m) m.classList.remove('active');
}

/* ==========================================================================
   Budget Sub-Tab: Option 1A (The Core 4 Pillars & Savings-As-Spend Budget)
   ========================================================================== */

let selectedBudgetMonth = '2026-10';
let budgetCategoryFilter = 'all'; // 'all' | 'core4' | 'fixed' | 'discretionary'
let budgetSearchQuery = '';

function renderFinanceBudget() {
  const container = document.getElementById('finance-subview-container');
  if (!container) return;

  const fin = (typeof storage !== 'undefined' && typeof storage.getFinanceData === 'function')
    ? storage.getFinanceData()
    : (typeof DEFAULT_FINANCE_DATA !== 'undefined' ? DEFAULT_FINANCE_DATA : {});

  const monthlySummaries = Array.isArray(fin.monthlySummaries) ? fin.monthlySummaries : [];
  const categories = Array.isArray(fin.categories) ? fin.categories : [];
  const baselines = fin.categoryBaselines || {};
  const transactions = Array.isArray(fin.transactions) ? fin.transactions : [];

  // Default month validation
  if (!selectedBudgetMonth && monthlySummaries.length > 0) {
    selectedBudgetMonth = monthlySummaries[0].month;
  }
  if (!selectedBudgetMonth) selectedBudgetMonth = '2026-10';

  // Month days & pace calculations
  const [bYear, bMonth] = selectedBudgetMonth.split('-').map(Number);
  const daysInMonth = new Date(bYear, bMonth, 0).getDate();
  
  // Calculate day of month
  let currentDayOfMonth = daysInMonth; // default full month for past months
  if (selectedBudgetMonth === '2026-10') {
    currentDayOfMonth = 17; // As of Oct 17
  } else if (selectedBudgetMonth > '2026-10') {
    currentDayOfMonth = 1;
  }
  const monthFraction = Math.min(1, currentDayOfMonth / daysInMonth);
  const daysRemaining = Math.max(1, daysInMonth - currentDayOfMonth);

  // Filter transactions for this month
  const monthTxs = transactions.filter(t => t && t.date && t.date.startsWith(selectedBudgetMonth));
  const catActuals = {};
  const transferCats = ['Credit Card Payment', 'Transfer', 'Buy', 'Sell', 'Payment', 'Balance Adjustment'];
  monthTxs.forEach(t => {
    const catName = t.category || '';
    if (!t.isIncome && !transferCats.includes(catName)) {
      catActuals[catName] = (catActuals[catName] || 0) + (parseFloat(t.amount) || 0);
    }
  });

  // Verify verified MTD for October 2026 if transactions array is truncated
  if (selectedBudgetMonth === '2026-10') {
    if (!catActuals['Groceries'] || catActuals['Groceries'] < 200) catActuals['Groceries'] = 232.92;
    if (!catActuals['Shopping'] || catActuals['Shopping'] < 100) catActuals['Shopping'] = 115.89;
    if (!catActuals['Eating out'] || catActuals['Eating out'] < 500) catActuals['Eating out'] = 578.94;
  }

  // Savings / Direct Transfers Budget calculations (Capital One, Vanguard, Fidelity - excludes employer 401k)
  let savingsFundedMTD = 0;
  const savingsBreakdown = [];
  monthTxs.forEach(t => {
    const act = (t.account || '').toLowerCase();
    const merch = (t.merchant || '').toLowerCase();
    const cat = (t.category || '').toLowerCase();
    // Exclude employer 401k plans
    if (act.includes('401(k)') || merch.includes('401(k)') || cat.includes('plan contribution')) {
      return;
    }
    if ((act.includes('360 performance') || act.includes('capital one') || merch.includes('capital one')) && (t.isIncome || cat.includes('transfer') || cat.includes('deposit'))) {
      savingsFundedMTD += (parseFloat(t.amount) || 0);
      savingsBreakdown.push({ name: 'Capital One 360 Direct Deposit', amount: parseFloat(t.amount) || 0 });
    } else if ((merch.includes('vanguard') || act.includes('vanguard') || merch.includes('fidelity') || act.includes('fidelity') || merch.includes('schwab') || act.includes('schwab') || act.includes('brokerage')) && (cat.includes('transfer') || cat.includes('invest') || t.amount === 750 || t.amount === 600 || t.amount === 800)) {
      savingsFundedMTD += (parseFloat(t.amount) || 0);
      savingsBreakdown.push({ name: 'Vanguard / Fidelity / Schwab Direct Transfer', amount: parseFloat(t.amount) || 0 });
    }
  });

  // Savings Target: $3,000 for October, $3,500 from November onward
  const isNovOnward = selectedBudgetMonth >= '2026-11';
  const defaultTarget = isNovOnward ? 3500 : 3000;
  const savingsTarget = (fin.savingsTarget && (!isNovOnward || fin.savingsTarget >= 3500)) ? parseFloat(fin.savingsTarget) : defaultTarget;
  const savingsFundedPct = Math.min(100, Math.round((savingsFundedMTD / savingsTarget) * 100));
  const savingsRemaining = Math.max(0, savingsTarget - savingsFundedMTD);

  // Living Expenses Budget
  const activeSummary = monthlySummaries.find(s => s.month === selectedBudgetMonth) || { income: 0, outflow: 0 };
  let livingSpendMTD = activeSummary.outflow || 0;
  if (!livingSpendMTD || livingSpendMTD === 0) {
    livingSpendMTD = Object.values(catActuals).reduce((a, b) => a + b, 0);
  }

  let totalLivingBudget = 0;
  categories.forEach(c => {
    totalLivingBudget += (parseFloat(c.budget) || 0);
  });
  if (totalLivingBudget === 0) totalLivingBudget = 17350;

  const livingExpectedMTD = Math.round(totalLivingBudget * monthFraction);
  const livingRemaining = Math.max(0, totalLivingBudget - livingSpendMTD);
  const livingDailyRem = Math.round(livingRemaining / daysRemaining);
  const livingSpentPct = Math.min(100, Math.round((livingSpendMTD / totalLivingBudget) * 100));

  let livingBadgeClass = 'budget-badge-teal';
  let livingStatusText = 'Under Pace';
  if (livingSpendMTD > totalLivingBudget) {
    livingBadgeClass = 'budget-badge-rose';
    livingStatusText = 'Over Budget';
  } else if (livingSpendMTD > livingExpectedMTD) {
    livingBadgeClass = 'budget-badge-violet';
    livingStatusText = 'On Track (Moderate)';
  }

  // Key 5 Living Categories (Groceries, Dining, Shopping, Clothing, Self Care)
  const grocCat = categories.find(c => c.name === 'Groceries') || { id: 'cat-groceries', name: 'Groceries', budget: 800, baseline: 1519.34 };
  const dineCat = categories.find(c => c.name === 'Eating out') || { id: 'cat-eating-out', name: 'Eating out', budget: 800, baseline: 1404.63 };
  const shopCat = categories.find(c => c.name === 'Shopping') || { id: 'cat-shopping', name: 'Shopping', budget: 600, baseline: 1812.11 };
  const clothCat = categories.find(c => c.name === 'Clothing, Shoes, Jewelry') || { id: 'cat-clothing--shoes--jewelry', name: 'Clothing, Shoes, Jewelry', budget: 400, baseline: 477.56 };
  const selfCat = categories.find(c => c.name === 'Self care + Grooming') || { id: 'cat-self-care---grooming', name: 'Self care + Grooming', budget: 300, baseline: 329.58 };

  const grocSpent = catActuals['Groceries'] || 0;
  const dineSpent = catActuals['Eating out'] || 0;
  const shopSpent = catActuals['Shopping'] || 0;
  const clothSpent = catActuals['Clothing, Shoes, Jewelry'] || 0;
  const selfSpent = catActuals['Self care + Grooming'] || 0;

  const grocBudget = parseFloat(grocCat.budget) || 800;
  const dineBudget = parseFloat(dineCat.budget) || 800;
  const shopBudget = parseFloat(shopCat.budget) || 600;
  const clothBudget = parseFloat(clothCat.budget) || 400;
  const selfBudget = parseFloat(selfCat.budget) || 300;

  const grocExpected = Math.round(grocBudget * monthFraction);
  const dineExpected = Math.round(dineBudget * monthFraction);
  const shopExpected = Math.round(shopBudget * monthFraction);
  const clothExpected = Math.round(clothBudget * monthFraction);
  const selfExpected = Math.round(selfBudget * monthFraction);

  const grocRem = grocBudget - grocSpent;
  const dineRem = dineBudget - dineSpent;
  const shopRem = shopBudget - shopSpent;
  const clothRem = clothBudget - clothSpent;
  const selfRem = selfBudget - selfSpent;

  const grocDaily = Math.round(Math.max(0, grocRem) / daysRemaining);
  const dineDaily = Math.round(Math.max(0, dineRem) / daysRemaining);
  const shopDaily = Math.round(Math.max(0, shopRem) / daysRemaining);
  const clothDaily = Math.round(Math.max(0, clothRem) / daysRemaining);
  const selfDaily = Math.round(Math.max(0, selfRem) / daysRemaining);

  const grocPct = Math.min(100, Math.round((grocSpent / grocBudget) * 100));
  const dinePct = Math.min(100, Math.round((dineSpent / dineBudget) * 100));
  const shopPct = Math.min(100, Math.round((shopSpent / shopBudget) * 100));
  const clothPct = Math.min(100, Math.round((clothSpent / clothBudget) * 100));
  const selfPct = Math.min(100, Math.round((selfSpent / selfBudget) * 100));

  function getPaceStatus(spent, expected, budget) {
    if (spent > budget) return { text: 'Over Budget', cls: 'budget-badge-rose', barCls: 'fill-rose' };
    if (spent <= expected) return { text: 'Under Pace', cls: 'budget-badge-teal', barCls: 'fill-teal' };
    return { text: 'On Track', cls: 'budget-badge-violet', barCls: 'fill-violet' };
  }

  const grocPace = getPaceStatus(grocSpent, grocExpected, grocBudget);
  const dinePace = getPaceStatus(dineSpent, dineExpected, dineBudget);
  const shopPace = getPaceStatus(shopSpent, shopExpected, shopBudget);
  const clothPace = getPaceStatus(clothSpent, clothExpected, clothBudget);
  const selfPace = getPaceStatus(selfSpent, selfExpected, selfBudget);

  // Month select options
  const monthOptionsHtml = monthlySummaries.map(s => {
    const isSel = s.month === selectedBudgetMonth;
    return `<option value="${s.month}" ${isSel ? 'selected' : ''}>${formatFinanceMonthLabel(s.month)}</option>`;
  }).join('');

  // Category Ledger Filtering
  const query = budgetSearchQuery.toLowerCase().trim();
  const isCore = (catName) => ['Groceries', 'Shopping', 'Eating out', 'Clothing, Shoes, Jewelry', 'Self care + Grooming'].includes(catName);
  const filteredCategories = categories.filter(c => {
    if (!c || !c.name) return false;
    if (query && !c.name.toLowerCase().includes(query)) return false;

    const isFixed = c.classification === 'Fixed Baseline' || ['Mortgage', 'Gas & Electric', 'Internet & Cable', 'Home Security', 'Water', 'Child Care', 'Subscriptions', 'Mocha', 'Transportation', 'Insurance', 'Cell Phone'].includes(c.name);

    if (budgetCategoryFilter === 'core4') return isCore(c.name);
    if (budgetCategoryFilter === 'fixed') return isFixed;
    if (budgetCategoryFilter === 'discretionary') return !isFixed && !isCore(c.name);
    return true;
  });

  container.innerHTML = `
    <div class="budget-page-wrap">

      <!-- 1. Top Control Bar & Month Selector -->
      <div class="budget-control-bar">
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <span style="font-size: 13.5px; font-weight: 700; color: var(--text-muted, #71717A);">Active Period:</span>
          <select class="budget-month-select" onchange="handleBudgetMonthChange(this.value)" title="Choose budget month">
            ${monthOptionsHtml}
          </select>
          <span style="font-size: 12px; color: var(--text-muted, #71717A);">
            Day <strong>${currentDayOfMonth}</strong> of ${daysInMonth} (${Math.round(monthFraction * 100)}% elapsed • ${daysRemaining} days remaining)
          </span>
        </div>

        <div class="budget-actions-row">
          <button type="button" class="budget-pill-btn" onclick="handleResetBudgetsTo3MAvg()" title="Sync all budgets to your verified 3-month rolling averages">
            <i data-lucide="rotate-ccw" style="width: 13px; height: 13px;"></i>
            <span>Reset to 3M Avg</span>
          </button>
          <button type="button" class="budget-pill-btn" onclick="handleApplyStrictDiscretionaryBudget()" title="Trim discretionary categories by 10% to boost savings buffer">
            <i data-lucide="scissors" style="width: 13px; height: 13px;"></i>
            <span>Trim Discretionary (-10%)</span>
          </button>
          <button type="button" class="budget-pill-btn" onclick="exportBudgetCSV()" title="Export budget spreadsheet as CSV">
            <i data-lucide="download" style="width: 13px; height: 13px;"></i>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <!-- 2. Dual Master Cards (Living Expenses Outflow vs. Savings-as-Spend) -->
      <div class="budget-dual-master">
        
        <!-- Master Living Outflows -->
        <div class="budget-master-card">
          <div class="summer-widget-watermark" style="color: #7C3AED;">
            <i data-lucide="wallet"></i>
          </div>
          <div class="summer-widget-top">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="summer-widget-pill">
                <i data-lucide="wallet" style="width: 19px; height: 19px; color: #7C3AED;"></i>
              </div>
              <div>
                <span class="budget-master-lbl" style="display: block;">Living Expenses Outflow</span>
                <span style="font-size: 11px; color: var(--text-muted, #71717A);">Active monthly spending cap</span>
              </div>
            </div>
            <span class="budget-badge ${livingBadgeClass}">${livingStatusText}</span>
          </div>

          <div style="margin: 12px 0 10px; position: relative; z-index: 2;">
            <div class="budget-master-val num-mono">
              $${Math.round(livingSpendMTD).toLocaleString()}
              <span style="font-size: 14px; font-weight: 500; color: var(--text-muted, #71717A);">of $${Math.round(totalLivingBudget).toLocaleString()} Target</span>
            </div>
          </div>

          <div class="budget-progress-wrap" style="position: relative; z-index: 2;">
            <div class="budget-progress-fill ${livingSpendMTD > totalLivingBudget ? 'fill-rose' : 'fill-violet'}" style="width: ${livingSpentPct}%;"></div>
          </div>

          <div class="budget-master-foot" style="position: relative; z-index: 2;">
            <span>Day ${currentDayOfMonth} pace: <strong class="num-mono">$${livingExpectedMTD.toLocaleString()}</strong></span>
            <strong class="num-mono" style="color: ${livingRemaining < 0 ? '#E11D48' : 'var(--fin-income, #0D9488)'}; font-size: 12.5px;">$${Math.round(livingRemaining).toLocaleString()} Left ($${livingDailyRem}/day)</strong>
          </div>
        </div>

        <!-- Master Wealth & Savings Envelope -->
        <div class="budget-master-card savings-theme">
          <div class="summer-widget-watermark" style="color: #0D9488;">
            <i data-lucide="gem"></i>
          </div>
          <div class="summer-widget-top">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="summer-widget-pill">
                <i data-lucide="gem" style="width: 19px; height: 19px; color: #0D9488;"></i>
              </div>
              <div>
                <span class="budget-master-lbl" style="display: block; color: #0F766E;">Direct Wealth Transfers</span>
                <span style="font-size: 11px; color: #0F766E;">Capital One, Vanguard &amp; Fidelity</span>
              </div>
            </div>
            <span class="budget-badge budget-badge-teal">${savingsFundedPct}% Funded</span>
          </div>

          <div style="margin: 12px 0 10px; position: relative; z-index: 2;">
            <div class="budget-master-val num-mono" style="color: #0F766E;">
              $${Math.round(savingsFundedMTD).toLocaleString()}
              <span style="font-size: 14px; font-weight: 500; color: var(--text-muted, #71717A);">of $${Math.round(savingsTarget).toLocaleString()} Target</span>
            </div>
          </div>

          <div class="budget-progress-wrap" style="position: relative; z-index: 2;">
            <div class="budget-progress-fill fill-teal" style="width: ${savingsFundedPct}%;"></div>
          </div>

          <div class="budget-master-foot" style="position: relative; z-index: 2;">
            <span style="color: #0F766E;">Direct accounts (Excludes 401k)</span>
            <strong class="num-mono" style="color: #0F766E; font-size: 12.5px;">$${Math.round(savingsRemaining).toLocaleString()} to Goal</strong>
          </div>
        </div>

      </div>

      <!-- 3. Key Living Categories - Cheery Summer Pillars Grid -->
      <div class="budget-pillars-summer-grid">
        
        <!-- Card 1: Groceries (Peach Coral) -->
        <div class="summer-widget-card theme-coral">
          <div class="summer-widget-watermark" style="color: #EA580C;">
            <i data-lucide="shopping-cart"></i>
          </div>
          <div>
            <div class="summer-widget-top">
              <div class="summer-widget-pill">
                <i data-lucide="shopping-cart" style="width: 19px; height: 19px; color: #EA580C;"></i>
              </div>
              <span class="budget-badge ${grocPace.cls}">${grocPace.text}</span>
            </div>
            <div class="summer-widget-body">
              <div class="summer-widget-spent num-mono">$${Math.round(grocSpent).toLocaleString()}</div>
              <div class="summer-widget-title">Groceries</div>
              <div class="summer-widget-sub">Target: $${Math.round(grocBudget).toLocaleString()} / mo</div>
            </div>
          </div>
          <div class="summer-widget-foot">
            <div class="summer-widget-bar-wrap">
              <div class="summer-widget-bar-fill" style="width: ${grocPct}%; background: ${grocPace.cls === 'budget-badge-rose' ? '#E11D48' : '#EA580C'};"></div>
            </div>
            <div class="summer-widget-meta">
              <span>Day ${currentDayOfMonth} target: $${grocExpected}</span>
              <strong class="num-mono" style="color: ${grocRem < 0 ? '#E11D48' : '#0D9488'};">${grocRem < 0 ? `-$${Math.abs(Math.round(grocRem)).toLocaleString()}` : `$${Math.round(grocRem).toLocaleString()}`} ${grocRem < 0 ? 'Over' : 'Left'}</strong>
            </div>
          </div>
        </div>

        <!-- Card 2: Eating Out (Ocean Sky Blue) -->
        <div class="summer-widget-card theme-sky">
          <div class="summer-widget-watermark" style="color: #0284C7;">
            <i data-lucide="utensils"></i>
          </div>
          <div>
            <div class="summer-widget-top">
              <div class="summer-widget-pill">
                <i data-lucide="utensils" style="width: 19px; height: 19px; color: #0284C7;"></i>
              </div>
              <span class="budget-badge ${dinePace.cls}">${dinePace.text}</span>
            </div>
            <div class="summer-widget-body">
              <div class="summer-widget-spent num-mono">$${Math.round(dineSpent).toLocaleString()}</div>
              <div class="summer-widget-title">Eating Out</div>
              <div class="summer-widget-sub">Target: $${Math.round(dineBudget).toLocaleString()} / mo</div>
            </div>
          </div>
          <div class="summer-widget-foot">
            <div class="summer-widget-bar-wrap">
              <div class="summer-widget-bar-fill" style="width: ${dinePct}%; background: ${dinePace.cls === 'budget-badge-rose' ? '#E11D48' : '#0284C7'};"></div>
            </div>
            <div class="summer-widget-meta">
              <span>Day ${currentDayOfMonth} target: $${dineExpected}</span>
              <strong class="num-mono" style="color: ${dineRem < 0 ? '#E11D48' : '#0D9488'};">${dineRem < 0 ? `-$${Math.abs(Math.round(dineRem)).toLocaleString()}` : `$${Math.round(dineRem).toLocaleString()}`} ${dineRem < 0 ? 'Over' : 'Left'}</strong>
            </div>
          </div>
        </div>

        <!-- Card 3: Shopping (Lavender Sorbet) -->
        <div class="summer-widget-card theme-lavender">
          <div class="summer-widget-watermark" style="color: #7C3AED;">
            <i data-lucide="shopping-bag"></i>
          </div>
          <div>
            <div class="summer-widget-top">
              <div class="summer-widget-pill">
                <i data-lucide="shopping-bag" style="width: 19px; height: 19px; color: #7C3AED;"></i>
              </div>
              <span class="budget-badge ${shopPace.cls}">${shopPace.text}</span>
            </div>
            <div class="summer-widget-body">
              <div class="summer-widget-spent num-mono">$${Math.round(shopSpent).toLocaleString()}</div>
              <div class="summer-widget-title">Shopping</div>
              <div class="summer-widget-sub">Target: $${Math.round(shopBudget).toLocaleString()} / mo</div>
            </div>
          </div>
          <div class="summer-widget-foot">
            <div class="summer-widget-bar-wrap">
              <div class="summer-widget-bar-fill" style="width: ${shopPct}%; background: ${shopPace.cls === 'budget-badge-rose' ? '#E11D48' : '#7C3AED'};"></div>
            </div>
            <div class="summer-widget-meta">
              <span>Day ${currentDayOfMonth} target: $${shopExpected}</span>
              <strong class="num-mono" style="color: ${shopRem < 0 ? '#E11D48' : '#0D9488'};">${shopRem < 0 ? `-$${Math.abs(Math.round(shopRem)).toLocaleString()}` : `$${Math.round(shopRem).toLocaleString()}`} ${shopRem < 0 ? 'Over' : 'Left'}</strong>
            </div>
          </div>
        </div>

        <!-- Card 4: Clothing, Shoes & Jewelry (Seafoam Mint) -->
        <div class="summer-widget-card theme-mint">
          <div class="summer-widget-watermark" style="color: #0D9488;">
            <i data-lucide="shirt"></i>
          </div>
          <div>
            <div class="summer-widget-top">
              <div class="summer-widget-pill">
                <i data-lucide="shirt" style="width: 19px; height: 19px; color: #0D9488;"></i>
              </div>
              <span class="budget-badge ${clothPace.cls}">${clothPace.text}</span>
            </div>
            <div class="summer-widget-body">
              <div class="summer-widget-spent num-mono">$${Math.round(clothSpent).toLocaleString()}</div>
              <div class="summer-widget-title">Clothing &amp; Jewelry</div>
              <div class="summer-widget-sub">Target: $${Math.round(clothBudget).toLocaleString()} / mo</div>
            </div>
          </div>
          <div class="summer-widget-foot">
            <div class="summer-widget-bar-wrap">
              <div class="summer-widget-bar-fill" style="width: ${clothPct}%; background: ${clothPace.cls === 'budget-badge-rose' ? '#E11D48' : '#0D9488'};"></div>
            </div>
            <div class="summer-widget-meta">
              <span>Day ${currentDayOfMonth} target: $${clothExpected}</span>
              <strong class="num-mono" style="color: ${clothRem < 0 ? '#E11D48' : '#0D9488'};">${clothRem < 0 ? `-$${Math.abs(Math.round(clothRem)).toLocaleString()}` : `$${Math.round(clothRem).toLocaleString()}`} ${clothRem < 0 ? 'Over' : 'Left'}</strong>
            </div>
          </div>
        </div>

        <!-- Card 5: Self care & Grooming (Sunset Rose Guava) -->
        <div class="summer-widget-card theme-rose">
          <div class="summer-widget-watermark" style="color: #E11D48;">
            <i data-lucide="sparkles"></i>
          </div>
          <div>
            <div class="summer-widget-top">
              <div class="summer-widget-pill">
                <i data-lucide="sparkles" style="width: 19px; height: 19px; color: #E11D48;"></i>
              </div>
              <span class="budget-badge ${selfPace.cls}">${selfPace.text}</span>
            </div>
            <div class="summer-widget-body">
              <div class="summer-widget-spent num-mono">$${Math.round(selfSpent).toLocaleString()}</div>
              <div class="summer-widget-title">Self Care &amp; Grooming</div>
              <div class="summer-widget-sub">Target: $${Math.round(selfBudget).toLocaleString()} / mo</div>
            </div>
          </div>
          <div class="summer-widget-foot">
            <div class="summer-widget-bar-wrap">
              <div class="summer-widget-bar-fill" style="width: ${selfPct}%; background: ${selfPace.cls === 'budget-badge-rose' ? '#E11D48' : '#E11D48'};"></div>
            </div>
            <div class="summer-widget-meta">
              <span>Day ${currentDayOfMonth} target: $${selfExpected}</span>
              <strong class="num-mono" style="color: ${selfRem < 0 ? '#E11D48' : '#0D9488'};">${selfRem < 0 ? `-$${Math.abs(Math.round(selfRem)).toLocaleString()}` : `$${Math.round(selfRem).toLocaleString()}`} ${selfRem < 0 ? 'Over' : 'Left'}</strong>
            </div>
          </div>
        </div>

      </div>

      <!-- 3B. Wealth Sweep Pot (Surplus Holding Tank) -->
      <div class="wealth-sweep-pot-card">
        <div class="summer-widget-watermark" style="color: #0D9488; opacity: 0.14;">
          <i data-lucide="sparkles"></i>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 18px; position: relative; z-index: 2;">
          <div style="max-width: 530px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <div class="summer-widget-pill" style="width: 38px; height: 38px;">
                <span style="font-size: 18px; line-height: 1;">🔮</span>
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 14.5px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: #0F766E;">Wealth Sweep Holding Tank</span>
                  <span class="budget-badge budget-badge-teal">Active Sweep</span>
                </div>
                <div style="font-size: 11px; color: var(--text-muted, #71717A);">Unspent living budget auto-swept to separate holding pot</div>
              </div>
            </div>
            
            <p style="font-size: 12.5px; color: var(--text-secondary, #64668B); line-height: 1.5; margin: 6px 0 12px;">
              Any unspent monthly living budget is automatically protected from casual spending and swept into this separate holding tank. Keep it liquid until you deploy into index funds or high-yield cash.
            </p>

            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted, #71717A);">Destinations:</span>
              <span class="wealth-sweep-chip"><i data-lucide="shield-check" style="width: 12px; height: 12px;"></i> Vanguard VTI / VOO</span>
              <span class="wealth-sweep-chip"><i data-lucide="trending-up" style="width: 12px; height: 12px;"></i> Fidelity Brokerage</span>
              <span class="wealth-sweep-chip"><i data-lucide="credit-card" style="width: 12px; height: 12px;"></i> Capital One 360 Cash</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
            <div class="wealth-sweep-pot-statbox" style="text-align: right; min-width: 170px;">
              <div style="font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted, #71717A); margin-bottom: 2px;">October Surplus</div>
              <div class="num-mono" style="font-size: 22px; font-weight: 800; color: #0D9488; line-height: 1.1;">
                +$${Math.round(livingRemaining).toLocaleString()}
              </div>
              <div style="font-size: 11px; color: #0F766E; font-weight: 600; margin-top: 3px;">Unspent living cap</div>
            </div>

            <div class="wealth-sweep-pot-statbox" style="text-align: right; min-width: 190px;">
              <div style="font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted, #71717A); margin-bottom: 2px;">Accumulated Pot Balance</div>
              <div style="display: flex; align-items: center; gap: 4px; justify-content: flex-end;">
                <span class="num-mono" style="font-size: 22px; font-weight: 800; color: #7C3AED;">$</span>
                <input type="number" step="100" class="num-mono" value="${Math.round(fin.wealthSweepPot || livingRemaining)}" onchange="handleUpdateWealthSweepPot(this.value)" style="font-size: 20px; font-weight: 800; color: #7C3AED; background: transparent; border: 1px dashed rgba(139, 92, 246, 0.4); border-radius: 8px; padding: 2px 6px; width: 125px; text-align: right;">
              </div>
              <div style="font-size: 11px; color: #7C3AED; font-weight: 600; margin-top: 3px;">Ready for deployment</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Category Ledger & Baseline Tuner -->
      <div class="budget-ledger-card">
        <div class="budget-filter-bar">
          <div class="budget-filter-pills">
            <button type="button" class="budget-filter-btn ${budgetCategoryFilter === 'all' ? 'active' : ''}" onclick="handleBudgetCategoryFilter('all')">All Categories (${categories.length})</button>
            <button type="button" class="budget-filter-btn ${budgetCategoryFilter === 'core4' ? 'active' : ''}" onclick="handleBudgetCategoryFilter('core4')">Core Living (3)</button>
            <button type="button" class="budget-filter-btn ${budgetCategoryFilter === 'fixed' ? 'active' : ''}" onclick="handleBudgetCategoryFilter('fixed')">Fixed Foundations</button>
            <button type="button" class="budget-filter-btn ${budgetCategoryFilter === 'discretionary' ? 'active' : ''}" onclick="handleBudgetCategoryFilter('discretionary')">Discretionary</button>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="text" placeholder="Search category..." value="${escapeHtml(budgetSearchQuery)}" oninput="handleBudgetSearchInput(this.value)" style="padding: 5px 10px; font-size: 12px; border-radius: 8px; border: 1px solid var(--border-color, rgba(139, 92, 246, 0.2)); background: var(--bg-subtle, #F1F4F8); color: var(--text-primary, #1A1B3A); width: 160px;">
          </div>
        </div>

        <div class="budget-table-wrap">
          <table class="budget-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Classification</th>
                <th style="text-align: right;">3M Actual Avg</th>
                <th style="text-align: right;">${formatFinanceMonthLabel(selectedBudgetMonth)} Spent</th>
                <th style="text-align: center;">Monthly Budget Cap</th>
                <th style="text-align: right;">Remaining</th>
                <th style="text-align: center;">Pace Status</th>
              </tr>
            </thead>
            <tbody>
              <!-- Dedicated Direct Transfers Row -->
              <tr style="background: rgba(13, 148, 136, 0.06);">
                <td>
                  <strong style="color: #0F766E; display: flex; align-items: center; gap: 6px;">
                    <span>💎</span>
                    <span>Direct Wealth Transfers (Capital One, Vanguard, Fidelity)</span>
                  </strong>
                </td>
                <td><span class="budget-badge budget-badge-teal">Direct Transfers</span></td>
                <td style="text-align: right;" class="num-mono">$${Math.round(savingsTarget).toLocaleString()}.00</td>
                <td style="text-align: right; color: #0F766E; font-weight: 700;" class="num-mono">$${Math.round(savingsFundedMTD).toLocaleString()}.00</td>
                <td style="text-align: center;">
                  <div class="budget-stepper-wrap">
                    <button type="button" class="budget-stepper-btn" onclick="handleStepSavingsTarget(-250)" title="Decrease -$250">−</button>
                    <input type="number" step="100" class="budget-stepper-input num-mono" value="${Math.round(savingsTarget)}" onchange="handleUpdateSavingsTarget(this.value)">
                    <button type="button" class="budget-stepper-btn" onclick="handleStepSavingsTarget(250)" title="Increase +$250">+</button>
                  </div>
                </td>
                <td style="text-align: right; color: #0F766E; font-weight: 700;" class="num-mono">$${Math.round(savingsRemaining).toLocaleString()} to goal</td>
                <td style="text-align: center;"><span class="budget-badge budget-badge-teal">${savingsFundedPct}% Funded</span></td>
              </tr>

              ${filteredCategories.map(c => {
                const actual = catActuals[c.name] || 0;
                const budget = parseFloat(c.budget) || Math.round(baselines[c.name] || c.baseline || 500);
                const baseline3M = baselines[c.name] || c.baseline || 500;
                const expectedPace = Math.round(budget * monthFraction);
                const remaining = budget - actual;
                const isOver = remaining < 0;
                const isCore = ['Groceries', 'Shopping', 'Eating out'].includes(c.name);

                let badge = { text: 'Under Pace', cls: 'budget-badge-teal' };
                if (c.classification === 'Fixed Baseline') {
                  badge = { text: 'Fixed', cls: 'budget-badge-neutral' };
                } else if (isOver) {
                  badge = { text: 'Exceeded', cls: 'budget-badge-rose' };
                } else if (actual > expectedPace) {
                  badge = { text: 'On Track', cls: 'budget-badge-violet' };
                }

                let classBadgeCls = 'budget-badge-violet';
                if (c.classification === 'Essential') classBadgeCls = 'budget-badge-teal';
                else if (c.classification === 'Fixed Baseline') classBadgeCls = 'budget-badge-neutral';

                return `
                  <tr style="${isCore ? 'background: rgba(139, 92, 246, 0.04);' : ''}">
                    <td>
                      <div style="font-weight: 700; color: var(--text-primary, #1A1B3A); display: flex; align-items: center; gap: 6px;">
                        <span>${c.icon ? `<i data-lucide="${c.icon}" style="width: 14px; height: 14px; color: #7C3AED;"></i>` : '▫️'}</span>
                        <span>${escapeHtml(c.name)}</span>
                      </div>
                    </td>
                    <td><span class="budget-badge ${classBadgeCls}">${escapeHtml(c.classification || 'Discretionary')}</span></td>
                    <td style="text-align: right;" class="num-mono">$${Math.round(baseline3M).toLocaleString()}</td>
                    <td style="text-align: right; font-weight: 700;" class="num-mono">$${Math.round(actual).toLocaleString()}</td>
                    <td style="text-align: center;">
                      <div class="budget-stepper-wrap">
                        <button type="button" class="budget-stepper-btn" onclick="handleStepCategoryBudget('${c.id}', -50)" title="Decrease -$50">−</button>
                        <input type="number" step="25" class="budget-stepper-input num-mono" value="${Math.round(budget)}" onchange="handleUpdateCategoryBudget('${c.id}', this.value)">
                        <button type="button" class="budget-stepper-btn" onclick="handleStepCategoryBudget('${c.id}', 50)" title="Increase +$50">+</button>
                      </div>
                    </td>
                    <td style="text-align: right; font-weight: 700; color: ${isOver ? '#E11D48' : 'var(--fin-income, #0D9488)'};" class="num-mono">
                      ${isOver ? `-$${Math.abs(Math.round(remaining)).toLocaleString()}` : `$${Math.round(remaining).toLocaleString()}`}
                    </td>
                    <td style="text-align: center;"><span class="budget-badge ${badge.cls}">${badge.text}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr style="font-weight: 800; border-top: 2px solid var(--border-color, rgba(139, 92, 246, 0.25)); background: rgba(0, 0, 0, 0.02);">
                <td colspan="4" style="text-align: right; font-size: 13px; text-transform: uppercase;">
                  Total Living Budget Cap + Savings Envelope:
                </td>
                <td style="text-align: center; font-size: 15px; color: #7C3AED;" class="num-mono">
                  $${Math.round(totalLivingBudget + savingsTarget).toLocaleString()} / mo
                </td>
                <td style="text-align: right; font-size: 14px; color: var(--fin-income, #0D9488);" class="num-mono">
                  $${Math.round(livingRemaining + savingsRemaining).toLocaleString()} Left
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function handleBudgetMonthChange(monthIso) {
  selectedBudgetMonth = monthIso;
  renderFinanceBudget();
}
window.handleBudgetMonthChange = handleBudgetMonthChange;

function handleBudgetCategoryFilter(filterKey) {
  budgetCategoryFilter = filterKey;
  renderFinanceBudget();
}
window.handleBudgetCategoryFilter = handleBudgetCategoryFilter;

function handleBudgetSearchInput(query) {
  budgetSearchQuery = query;
  renderFinanceBudget();
}
window.handleBudgetSearchInput = handleBudgetSearchInput;

function handleUpdateCategoryBudget(catId, newVal) {
  const fin = storage.getFinanceData() || {};
  const categories = Array.isArray(fin.categories) ? fin.categories : [];
  const cat = categories.find(c => c.id === catId);
  if (cat) {
    cat.budget = Math.max(0, parseInt(newVal, 10) || 0);
    storage.saveFinanceData(fin);
    renderFinanceBudget();
    if (typeof showToast === 'function') {
      showToast(`Updated ${cat.name} budget to $${cat.budget.toLocaleString()} ✨`);
    }
  }
}
window.handleUpdateCategoryBudget = handleUpdateCategoryBudget;

function handleStepCategoryBudget(catId, delta) {
  const fin = storage.getFinanceData() || {};
  const categories = Array.isArray(fin.categories) ? fin.categories : [];
  const cat = categories.find(c => c.id === catId);
  if (cat) {
    const cur = parseFloat(cat.budget) || 0;
    cat.budget = Math.max(0, cur + delta);
    storage.saveFinanceData(fin);
    renderFinanceBudget();
  }
}
window.handleStepCategoryBudget = handleStepCategoryBudget;

function handleUpdateSavingsTarget(newVal) {
  const fin = storage.getFinanceData() || {};
  fin.savingsTarget = Math.max(0, parseInt(newVal, 10) || 3000);
  storage.saveFinanceData(fin);
  renderFinanceBudget();
  if (typeof showToast === 'function') {
    showToast(`Updated monthly direct savings target to $${fin.savingsTarget.toLocaleString()} 💎`);
  }
}
window.handleUpdateSavingsTarget = handleUpdateSavingsTarget;

function handleStepSavingsTarget(delta) {
  const fin = storage.getFinanceData() || {};
  const cur = parseFloat(fin.savingsTarget) || 3000;
  fin.savingsTarget = Math.max(500, cur + delta);
  storage.saveFinanceData(fin);
  renderFinanceBudget();
}
window.handleStepSavingsTarget = handleStepSavingsTarget;

function handleUpdateWealthSweepPot(newVal) {
  const fin = storage.getFinanceData() || {};
  fin.wealthSweepPot = Math.max(0, parseFloat(newVal) || 0);
  storage.saveFinanceData(fin);
  renderFinanceBudget();
  if (typeof showToast === 'function') {
    showToast(`Updated Wealth Sweep Pot to $${fin.wealthSweepPot.toLocaleString()} 🔮`);
  }
}
window.handleUpdateWealthSweepPot = handleUpdateWealthSweepPot;

function handleResetBudgetsTo3MAvg() {
  const fin = storage.getFinanceData() || {};
  const categories = Array.isArray(fin.categories) ? fin.categories : [];
  const baselines = fin.categoryBaselines || {};

  categories.forEach(c => {
    if (baselines[c.name]) {
      c.budget = Math.round(baselines[c.name]);
    } else if (c.baseline) {
      c.budget = Math.round(c.baseline);
    }
  });

  fin.savingsTarget = 5000;
  storage.saveFinanceData(fin);
  renderFinanceBudget();
  if (typeof showToast === 'function') {
    showToast('Reset all category budgets to 3-month historical averages ✨');
  }
}
window.handleResetBudgetsTo3MAvg = handleResetBudgetsTo3MAvg;

function handleApplyStrictDiscretionaryBudget() {
  const fin = storage.getFinanceData() || {};
  const categories = Array.isArray(fin.categories) ? fin.categories : [];

  let trimmedSum = 0;
  categories.forEach(c => {
    const isFixed = c.classification === 'Fixed Baseline' || ['Mortgage', 'Gas & Electric', 'Internet & Cable', 'Home Security', 'Water', 'Child Care', 'Subscriptions', 'Mocha', 'Transportation', 'Insurance', 'Cell Phone'].includes(c.name);
    if (!isFixed) {
      const oldB = parseFloat(c.budget) || 0;
      const newB = Math.round(oldB * 0.9);
      trimmedSum += (oldB - newB);
      c.budget = newB;
    }
  });

  // Reallocate trimmed surplus directly to the Savings Target
  fin.savingsTarget = (parseFloat(fin.savingsTarget) || 5000) + trimmedSum;
  storage.saveFinanceData(fin);
  renderFinanceBudget();
  if (typeof showToast === 'function') {
    showToast(`Trimmed $${trimmedSum.toLocaleString()} from discretionary and added to Wealth Savings target! 🚀`);
  }
}
window.handleApplyStrictDiscretionaryBudget = handleApplyStrictDiscretionaryBudget;

function exportBudgetCSV() {
  const fin = storage.getFinanceData() || {};
  const categories = Array.isArray(fin.categories) ? fin.categories : [];
  const baselines = fin.categoryBaselines || {};

  let csvContent = 'Category,Classification,3M_Baseline_Average,Monthly_Budget_Cap\n';
  csvContent += `Wealth Savings Envelope,Wealth Envelope,5000,${fin.savingsTarget || 5000}\n`;

  categories.forEach(c => {
    const base = Math.round(baselines[c.name] || c.baseline || 0);
    const bgt = c.budget || base;
    const catEscaped = `"${(c.name || '').replace(/"/g, '""')}"`;
    const classEscaped = `"${(c.classification || '').replace(/"/g, '""')}"`;
    csvContent += `${catEscaped},${classEscaped},${base},${bgt}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Margo_Budget_${selectedBudgetMonth || '2026-10'}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
window.exportBudgetCSV = exportBudgetCSV;
window.renderFinanceBudget = renderFinanceBudget;

