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
        if (['subscriptions', 'page2', '2', 'cards'].includes(parts[1])) return 'subscriptions';
        if (['runway', 'page3', '3', 'quarterly', 'networth'].includes(parts[1])) return 'runway';
        if (['claims', 'page4', '4'].includes(parts[1])) return 'claims';
      }
    }
    if (rawHash === 'finance' || rawHash === 'finance/') return 'burn';
    if (rawHash.startsWith('claims')) return 'claims';
    const saved = localStorage.getItem('BOL_FINANCE_ACTIVE_SUBTAB');
    if (saved && ['burn', 'subscriptions', 'claims', 'runway'].includes(saved)) {
      return saved;
    }
  } catch (e) {}
  return 'burn';
}

let activeFinanceSubTab = getInitialFinanceSubTab();
let selectedFinanceMonth = '2026-10';
let financeTxSearchQuery = '';
let financeTxCategoryFilter = 'all';
let financeTxHighSpendOnly = false;

function renderFinancePage(targetSubTab) {
  const container = document.getElementById('daily-sheet-container') || document.getElementById('bunker-subview-frame');
  if (!container) return;

  if (targetSubTab) {
    if (['burn', 'page1', '1', 'radar'].includes(targetSubTab)) activeFinanceSubTab = 'burn';
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
          <button class="finance-subnav-btn ${activeFinanceSubTab === 'subscriptions' ? 'active' : ''}" onclick="switchFinanceSubTab('subscriptions')" title="Recurring Subscriptions &amp; Annual Fee ROI">
            <span>🎟️</span>
            <span>Subscriptions &amp; Card ROI</span>
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

let financeActivePeriod = 'this_month'; // 'this_month' | 'last_month' | 'last_qtr' | 'ytd'
let financeDriversViewMode = 'pillars'; // 'pillars' | 'ribbon'
let financeOutlierFilter = 'all'; // 'all' | 'spike' | 'baseline' | 'reduced'

function changeFinancePeriod(period) {
  financeActivePeriod = period;
  if (period === 'this_month') selectedFinanceMonth = '2026-10';
  else if (period === 'last_month') selectedFinanceMonth = '2026-09';
  renderFinanceBurn();
}

function setFinanceDriversView(mode) {
  financeDriversViewMode = mode;
  renderFinanceBurn();
}

function setFinanceOutlierFilter(filter) {
  financeOutlierFilter = filter;
  renderFinanceBurn();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderPeriodFilterPills() {
  return `
    <div class="finance-period-capsules">
      <button class="finance-period-btn ${financeActivePeriod === 'this_month' ? 'active' : ''}" onclick="changeFinancePeriod('this_month')">This Month</button>
      <button class="finance-period-btn ${financeActivePeriod === 'last_month' ? 'active' : ''}" onclick="changeFinancePeriod('last_month')">Last Month</button>
      <button class="finance-period-btn ${financeActivePeriod === 'last_qtr' ? 'active' : ''}" onclick="changeFinancePeriod('last_qtr')">Last Qtr (Q3)</button>
      <button class="finance-period-btn ${financeActivePeriod === 'ytd' ? 'active' : ''}" onclick="changeFinancePeriod('ytd')">YTD (2026)</button>
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

function renderFinanceWeeklyCadenceBar() {
  const sundayIso = getCurrentWeekSundayIso();
  const checklist = storage.getFinanceWeeklyChecklist(sundayIso);
  const doneCount = [1, 2, 3, 4, 5].filter(num => !!checklist[num]).length;
  const allDone = doneCount === 5;

  let dateLabel = sundayIso;
  try {
    const parts = sundayIso.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    dateLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {}

  const items = [
    { num: 1, title: 'Pay bills', action: null },
    {
      num: 2,
      title: 'Review and reconcile transactions in Monarch',
      action: `
        <a href="https://app.monarchmoney.com" target="_blank" rel="noopener" class="finance-checklist-mini-btn" onclick="event.stopPropagation();" title="Open Monarch">
          <i data-lucide="external-link" style="width: 10px; height: 10px;"></i>
          <span>Monarch</span>
        </a>
      `
    },
    { num: 3, title: 'Check Schwab balance (keep $20k)', action: null },
    {
      num: 4,
      title: 'Export CSV to margo',
      action: `
        <button type="button" class="finance-checklist-mini-btn primary" onclick="event.stopPropagation(); triggerMonarchFileInput();" title="Sync Monarch CSV">
          <i data-lucide="upload-cloud" style="width: 10px; height: 10px;"></i>
          <span>Sync CSV</span>
        </button>
      `
    },
    {
      num: 5,
      title: 'Check cashflow and Outlier radar',
      action: `
        <button type="button" class="finance-checklist-mini-btn" onclick="event.stopPropagation(); scrollToFinanceOutliers();" title="Jump to Radar">
          <i data-lucide="compass" style="width: 10px; height: 10px;"></i>
          <span>Radar</span>
        </button>
      `
    }
  ];

  return `
    <div class="finance-weekly-checklist-card ${allDone ? 'all-done' : ''}">
      <div class="checklist-card-header">
        <div class="checklist-title">
          <i data-lucide="${allDone ? 'check-check' : 'list-checks'}" style="width: 15px; height: 15px; color: ${allDone ? '#0D9488' : '#7C3AED'};"></i>
          <span>Weekly Checklist</span>
          <span style="font-size: 0.74rem; font-weight: normal; color: var(--text-muted);">&bull; ${dateLabel}</span>
        </div>
        <span class="checklist-progress-pill ${allDone ? 'done' : ''}">
          ${allDone ? '✓ 5/5 Done' : `${doneCount}/5 Done`}
        </span>
      </div>

      <div class="checklist-items-list">
        ${items.map(item => {
          const isItemDone = !!checklist[item.num];
          return `
            <div class="finance-checklist-item ${isItemDone ? 'checked' : ''}" onclick="toggleFinanceChecklistItem(${item.num}, event)" title="${isItemDone ? 'Click to uncheck' : 'Click to complete'}">
              <div class="checklist-item-left">
                <button type="button" class="finance-checklist-checkbox" aria-label="Toggle ${item.title}">
                  <i data-lucide="check" style="width: 12px; height: 12px; stroke-width: 3;"></i>
                </button>
                <span class="finance-checklist-num">${item.num}.</span>
                <span class="checklist-item-label">${escapeHtml(item.title)}</span>
              </div>
              ${item.action ? `<div class="checklist-item-actions">${item.action}</div>` : ''}
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
    headerStatusText = '⚡ Discretionary Over 25%';
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
              <span class="finance-target-pct-hero" style="color: #0F766E;">${fixedPct}%</span>
              <span class="finance-target-amount">$${Math.round(actualFixedAmt).toLocaleString()}</span>
            </div>
          </div>
          ${fixedBadgeHtml}
        </div>

        <!-- Flex Pill -->
        <div class="finance-target-pill-card pillar-flex">
          <div class="finance-target-pill-left">
            <div class="finance-target-pill-label">⚡ Flex (25% max)</div>
            <div class="finance-target-value-wrap">
              <span class="finance-target-pct-hero" style="color: #6D28D9;">${flexPct}%</span>
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
              <span class="finance-target-pct-hero" style="color: ${savingsIsMetOrExceeded ? '#047857' : '#BE123C'};">
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
      mTransactions.forEach(t => {
        const amt = parseFloat(t.amount) || 0;
        const isInc = t.isIncome || t.category === 'Income' || (t.tags && t.tags.includes('Income')) || amt < 0;
        if (!isInc) {
          const catName = t.category || 'Discretionary';
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

  const paretoColors = ['#7C3AED', '#E11D48', '#0D9488', '#4F46E5', '#64748B'];

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

  let netCashFlow = periodInflow - periodOutflow;
  let isPositive = netCashFlow >= 0;
  let savingsRate = periodInflow > 0 ? ((netCashFlow / periodInflow) * 100).toFixed(1) : 0;

  if (totalAggregatedOutflow > 0) {
    periodOutflow = totalFixedSpend + totalFlexSpend;
    netCashFlow = periodInflow - periodOutflow;
    isPositive = netCashFlow >= 0;
    savingsRate = periodInflow > 0 ? ((netCashFlow / periodInflow) * 100).toFixed(1) : 0;
  }

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

      <!-- 1. Hero Cash Flow Split & Synced Period Selector -->
      <div class="finance-flow-hero">
        <div class="finance-flow-header">
          <div class="finance-flow-header-left">
            <h2 class="finance-hero-title">
              <span>💳</span>
              <span>Cash Flow &amp; Spend Radar</span>
            </h2>
            <p class="finance-hero-sub" title="${escapeHtml(periodLabel)} &bull; Macro earn vs. burn clarity">
              ${periodLabel} &bull; Macro earn vs. burn clarity
            </p>
          </div>

          <!-- Timeframe Filter Capsules (This Month / Last Month / Last Qtr / YTD) -->
          <div class="finance-flow-header-right">
            ${renderPeriodFilterPills()}
            <button class="btn btn-secondary" onclick="openLogCashFlowModal(selectedFinanceMonth)" style="font-size: 0.74rem; padding: 4px 10px;" title="Adjust month cash flow figures">
              <i data-lucide="edit-3" style="width: 12px; height: 12px;"></i>
              <span>Edit</span>
            </button>
          </div>
        </div>

        <!-- 3-Column Hero Cash Flow Split -->
        <div class="finance-flow-split-grid">
          
          <!-- Column 1: Income Earned -->
          <div class="finance-flow-col">
            <div class="finance-flow-col-header">
              <span class="finance-kpi-label">
                <i data-lucide="arrow-down-left" style="width: 13px; height: 13px; color: #0D9488;"></i>
                <span>Total Income Inflow</span>
              </span>
            </div>
            <span class="finance-kpi-value" style="color: #0F766E;">
              $${periodInflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span class="finance-kpi-sub">Verified salary + distributions</span>
          </div>

          <!-- Column 2: Total Outflow -->
          <div class="finance-flow-col">
            <div class="finance-flow-col-header">
              <span class="finance-kpi-label">
                <i data-lucide="arrow-up-right" style="width: 13px; height: 13px; color: #E11D48;"></i>
                <span>Total Spend Outflow</span>
              </span>
            </div>
            <span class="finance-kpi-value" style="color: var(--text-primary);">
              $${periodOutflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span class="finance-kpi-sub">Fixed commitments + discretionary</span>
          </div>

          <!-- Column 3: Net Cash Flow Surplus / Deficit -->
          <div class="finance-flow-col ${isPositive ? 'surplus-highlight' : 'deficit-highlight'}">
            <div class="finance-flow-col-header">
              <span class="finance-kpi-label">
                <i data-lucide="sparkles" style="width: 13px; height: 13px; color: ${isPositive ? '#0D9488' : '#E11D48'};"></i>
                <span>Net Cash Flow Delta</span>
              </span>
              ${isPositive ? `
                <span class="finance-flow-badge-pos">
                  <i data-lucide="check" style="width: 11px; height: 11px;"></i>
                  <span>${savingsRate}% Saved</span>
                </span>
              ` : `
                <span class="finance-flow-badge-neg">
                  <i data-lucide="alert-triangle" style="width: 11px; height: 11px;"></i>
                  <span>Deficit</span>
                </span>
              `}
            </div>
            <span class="finance-kpi-value" style="color: ${isPositive ? '#0D9488' : '#E11D48'};">
              ${isPositive ? '+' : '-'}$${Math.abs(netCashFlow).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span class="finance-kpi-sub">
              ${isPositive ? 'Liquid buffer swept to reserves' : 'Burn exceeded inflows in period'}
            </span>
          </div>

        </div>
      </div>

      <!-- 2. Target Allocation Blueprint: 50 / 25 / 25 Split Benchmark -->
      ${renderFinanceTargetSplitWidget(periodInflow, totalFixedSpend, totalFlexSpend, netCashFlow, periodLabel)}

      <!-- 3. Capital Allocation Matrix / Top Spending Drivers (with Dual View Option) -->
      <div class="finance-section-box">
        <div class="finance-section-header">
          <div>
            <h3 class="finance-section-title">
              <i data-lucide="${financeDriversViewMode === 'pillars' ? 'columns-2' : 'bar-chart-3'}" style="width: 18px; height: 18px; color: var(--fin-violet);"></i>
              <span>${financeDriversViewMode === 'pillars' ? 'Capital Allocation Matrix (Fixed vs. Flex)' : 'Top Spending Drivers (80/20 Pareto Distribution)'}</span>
            </h3>
            <span style="font-size: 0.78rem; color: var(--text-muted);">
              ${financeDriversViewMode === 'pillars' 
                ? `Macro capital split for ${periodLabel} &bull; Non-negotiable floor vs. flexible lifestyle levers` 
                : `Where 80% of capital flowed during ${periodLabel}`}
            </span>
          </div>

          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <!-- View Mode Switcher: Split Pillars vs Ribbon -->
            <div class="finance-view-toggle-capsules">
              <button class="finance-view-toggle-btn ${financeDriversViewMode === 'pillars' ? 'active' : ''}" onclick="setFinanceDriversView('pillars')" title="View side-by-side fixed vs. discretionary pillars">
                <i data-lucide="columns-2" style="width: 12px; height: 12px;"></i>
                <span>Split Pillars</span>
              </button>
              <button class="finance-view-toggle-btn ${financeDriversViewMode === 'ribbon' ? 'active' : ''}" onclick="setFinanceDriversView('ribbon')" title="View proportional ribbon distribution">
                <i data-lucide="bar-chart-3" style="width: 12px; height: 12px;"></i>
                <span>Ribbon</span>
              </button>
            </div>

            <!-- Synced Timeframe Filter Capsules -->
            <div>
              ${renderPeriodFilterPills()}
            </div>
          </div>
        </div>

        ${financeDriversViewMode === 'pillars' ? `
          <!-- Option 5: Split Pillar Matrix Layout -->
          <div class="finance-pillars-wrapper">
            
            <!-- Macro Split Ratio Card -->
            <div class="finance-macro-split-card">
              <div class="finance-macro-split-header">
                <span style="color: var(--text-secondary);">
                  Macro Outflow Split &bull; <strong>$${(totalFixedSpend + totalFlexSpend).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong> Total Capital
                </span>
                <div style="display: flex; gap: 14px; font-size: 0.76rem; flex-wrap: wrap;">
                  <span style="color: #0F766E; font-weight: 700;">
                    🛡️ Fixed Anchors: ${fixedRatioPct}% ($${totalFixedSpend.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })})
                  </span>
                  <span style="color: #7C3AED; font-weight: 700;">
                    ⚡ Discretionary Flex: ${flexRatioPct}% ($${totalFlexSpend.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })})
                  </span>
                </div>
              </div>

              <!-- High-Contrast Two-Tone Split Bar -->
              <div class="finance-macro-bar-container" title="Fixed: ${fixedRatioPct}% | Discretionary: ${flexRatioPct}%">
                <div class="finance-macro-bar-fixed" style="width: ${fixedRatioPct}%;">
                  🛡️ Fixed Anchors ${fixedRatioPct}%
                </div>
                <div class="finance-macro-bar-flex" style="width: ${flexRatioPct}%;">
                  ⚡ Discretionary Flex ${flexRatioPct}%
                </div>
              </div>
            </div>

            <!-- Two-Column Side-by-Side Pillars Grid -->
            <div class="finance-pillars-grid">
              
              <!-- Pillar 1: Fixed Commitments (Non-Negotiable Baseline) -->
              <div class="finance-pillar-card fixed-pillar">
                <div class="finance-pillar-card-header">
                  <div>
                    <div class="finance-pillar-title">
                      <i data-lucide="shield-check" style="width: 17px; height: 17px; color: #0D9488;"></i>
                      <span>Pillar 1: Fixed Commitments</span>
                    </div>
                    <div class="finance-pillar-amount" style="color: #0F766E;">
                      $${totalFixedSpend.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <span class="zlog-ood-badge" style="font-size: 0.7rem; background: rgba(13, 148, 136, 0.12); color: #0F766E; border: 1px solid rgba(13, 148, 136, 0.25);">
                    ${fixedRatioPct}% of spend
                  </span>
                </div>

                <div class="finance-pillar-list">
                  ${fixedCategories.map(c => {
                    const pct = Math.round((c.spent / macroTotal) * 100);
                    return `
                      <div class="finance-pillar-row">
                        <div class="finance-pillar-row-left">
                          <i data-lucide="${c.icon || 'shield'}" style="width: 15px; height: 15px; color: #0D9488; flex-shrink: 0;"></i>
                          <span class="finance-pillar-row-name" title="${escapeHtml(c.name)}">${escapeHtml(c.name)}</span>
                        </div>
                        <div class="finance-pillar-row-right">
                          <span class="finance-pillar-row-amount">$${c.spent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                          <span class="finance-pillar-row-pct">${pct}% of total</span>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>

                <div class="finance-pillar-footer">
                  <i data-lucide="check-circle-2" style="width: 14px; height: 14px; color: #0D9488; flex-shrink: 0;"></i>
                  <span>Shielded baseline floor required to sustain home, health &amp; family.</span>
                </div>
              </div>

              <!-- Pillar 2: Discretionary Levers (Active Lifestyle) -->
              <div class="finance-pillar-card flex-pillar">
                <div class="finance-pillar-card-header">
                  <div>
                    <div class="finance-pillar-title">
                      <i data-lucide="sliders" style="width: 17px; height: 17px; color: #7C3AED;"></i>
                      <span>Pillar 2: Discretionary Levers</span>
                    </div>
                    <div class="finance-pillar-amount" style="color: #6D28D9;">
                      $${totalFlexSpend.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <span class="zlog-ood-badge" style="font-size: 0.7rem; background: rgba(124, 58, 237, 0.12); color: #6D28D9; border: 1px solid rgba(124, 58, 237, 0.25);">
                    ${flexRatioPct}% of spend
                  </span>
                </div>

                <div class="finance-pillar-list">
                  ${flexCategories.map(c => {
                    const pct = Math.round((c.spent / macroTotal) * 100);
                    const isSpike = c.pctDelta > 20;
                    return `
                      <div class="finance-pillar-row">
                        <div class="finance-pillar-row-left">
                          <i data-lucide="${c.icon || 'sparkles'}" style="width: 15px; height: 15px; color: ${isSpike ? '#E11D48' : '#7C3AED'}; flex-shrink: 0;"></i>
                          <div>
                            <span class="finance-pillar-row-name" title="${escapeHtml(c.name)}">${escapeHtml(c.name)}</span>
                            ${isSpike ? `
                              <span class="finance-flag-pill danger" style="font-size: 0.62rem; padding: 1px 6px; margin-left: 6px;">
                                +$${Math.round(c.delta)} spike
                              </span>
                            ` : ''}
                          </div>
                        </div>
                        <div class="finance-pillar-row-right">
                          <span class="finance-pillar-row-amount" style="color: ${isSpike ? '#E11D48' : 'var(--text-primary)'};">$${c.spent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                          <span class="finance-pillar-row-pct">${pct}% of total</span>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>

                <div class="finance-pillar-footer">
                  <i data-lucide="zap" style="width: 14px; height: 14px; color: #7C3AED; flex-shrink: 0;"></i>
                  <span>Actionable dials. Trimming here directly increases monthly savings rate.</span>
                </div>
              </div>

            </div>
          </div>
        ` : `
          <!-- Option 1: Ribbon Proportional Layout -->
          <div class="finance-pareto-bar-wrapper">
            <!-- Stacked Proportional Bar -->
            <div class="finance-pareto-bar" title="Visual category spend distribution">
              ${top4Categories.map((c, i) => {
                const pct = Math.max(2, Math.round((c.spent / totalSpentForPareto) * 100));
                const color = paretoColors[i % paretoColors.length];
                return `
                  <div class="finance-pareto-segment" style="width: ${pct}%; background: ${color};" title="${escapeHtml(c.name)}: $${c.spent.toFixed(0)} (${pct}%)"></div>
                `;
              }).join('')}
              ${otherSpend > 0 ? `
                <div class="finance-pareto-segment" style="width: ${Math.max(2, Math.round((otherSpend / totalSpentForPareto) * 100))}%; background: #94A3B8;" title="Other Categories: $${otherSpend.toFixed(0)}"></div>
              ` : ''}
            </div>

            <!-- Top Drivers Ranked Grid -->
            <div class="finance-pareto-grid">
              ${categoryList.slice(0, 6).map((c, i) => {
                const pct = Math.round((c.spent / totalSpentForPareto) * 100);
                const color = i < paretoColors.length ? paretoColors[i] : '#64748B';
                return `
                  <div class="finance-pareto-item">
                    <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                      <div class="finance-pareto-rank" style="color: ${color};">${i + 1}</div>
                      <div style="min-width: 0;">
                        <strong style="font-size: 0.85rem; color: var(--text-primary); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                          ${escapeHtml(c.name)}
                        </strong>
                        <span class="zlog-ood-badge" style="font-size: 0.66rem; padding: 1px 6px;">
                          ${escapeHtml(c.classification)}
                        </span>
                      </div>
                    </div>
                    <div style="text-align: right; flex-shrink: 0;">
                      <div style="font-family: var(--font-mono); font-size: 0.88rem; font-weight: 700; color: var(--text-primary);">
                        $${c.spent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </div>
                      <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">${pct}% of spend</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `}
      </div>

      <!-- 3. Monthly Outlier Radar (vs. Rolling Baseline) -->
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
                    <span style="font-family: var(--font-mono); font-size: 1.05rem; font-weight: 700; color: ${isSpike ? '#E11D48' : 'var(--text-primary)'};">
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
