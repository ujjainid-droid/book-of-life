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
          <button class="finance-subnav-btn ${activeFinanceSubTab === 'burn' ? 'active' : ''}" onclick="switchFinanceSubTab('burn')" title="Page 1: Earn vs. Spend, Pareto Drivers &amp; Outliers">
            <span>🔥</span>
            <span>Page 1: Cash Flow &amp; Radar</span>
          </button>
          <button class="finance-subnav-btn ${activeFinanceSubTab === 'subscriptions' ? 'active' : ''}" onclick="switchFinanceSubTab('subscriptions')" title="Page 2: Recurring Subscriptions &amp; Annual Fee ROI">
            <span>🔁</span>
            <span>Page 2: Subscriptions &amp; Card ROI</span>
          </button>
          <button class="finance-subnav-btn ${activeFinanceSubTab === 'runway' ? 'active' : ''}" onclick="switchFinanceSubTab('runway')" title="Page 3: Net Worth Horizon &amp; Quarterly Ledger">
            <span>🏦</span>
            <span>Page 3: Net Worth &amp; Quarterly</span>
          </button>
          <button class="finance-subnav-btn ${activeFinanceSubTab === 'claims' ? 'active' : ''}" onclick="switchFinanceSubTab('claims')" title="Page 4: Medical Claims &amp; Superbills">
            <span>🧾</span>
            <span>Page 4: Medical Claims</span>
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

/* ==========================================================================
   Sub-View 1: Cash Flow & Spend Radar (Page 1 — Income, Pareto Drivers, Outliers & Levers)
   ========================================================================== */
function renderFinanceBurn() {
  const container = document.getElementById('finance-subview-container');
  if (!container) return;

  const fin = storage.getFinanceData();
  const categories = fin.categories || [];
  const transactions = fin.transactions || [];
  const monthlySummaries = fin.monthlySummaries || [];
  const baselines = fin.categoryBaselines || {};

  // Available months from summaries or default
  const availableMonths = monthlySummaries.map(m => m.month);
  if (!availableMonths.includes('2026-10')) availableMonths.unshift('2026-10');
  if (!selectedFinanceMonth) selectedFinanceMonth = availableMonths[0] || '2026-10';

  // Find summary for selected month
  let currentSummary = monthlySummaries.find(m => m.month === selectedFinanceMonth);

  // Filter transactions for selected month
  const monthTxs = transactions.filter(t => {
    if (!t || !t.date) return false;
    return t.date.startsWith(selectedFinanceMonth);
  });

  // Calculate category spend map for the selected month
  const categorySpendMap = {};
  categories.forEach(c => { categorySpendMap[c.name] = 0; });

  let computedTxSpend = 0;
  let computedTxIncome = 0;

  monthTxs.forEach(t => {
    const amt = parseFloat(t.amount) || 0;
    if (t.category === 'Income' || (t.tags && t.tags.includes('Income')) || amt < 0) {
      computedTxIncome += Math.abs(amt);
    } else {
      const catName = t.category || 'Discretionary';
      if (categorySpendMap[catName] === undefined) {
        categorySpendMap[catName] = 0;
      }
      categorySpendMap[catName] += amt;
      computedTxSpend += amt;
    }
  });

  // Reconcile Inflow & Outflow figures
  const monthInflow = (currentSummary && currentSummary.income !== undefined) 
    ? parseFloat(currentSummary.income) 
    : (computedTxIncome > 0 ? computedTxIncome : 14250.00);

  const monthOutflow = (currentSummary && currentSummary.outflow !== undefined)
    ? parseFloat(currentSummary.outflow)
    : (computedTxSpend > 0 ? computedTxSpend : 10410.00);

  const netCashFlow = monthInflow - monthOutflow;
  const isPositive = netCashFlow >= 0;
  const savingsRate = monthInflow > 0 ? ((netCashFlow / monthInflow) * 100).toFixed(1) : 0;

  // 1. Compute Top Categories (Pareto 80/20)
  const categoryList = Object.keys(categorySpendMap).map(name => {
    const spent = categorySpendMap[name] || 0;
    const catObj = categories.find(c => c.name === name) || {};
    const baseline = baselines[name] || catObj.baseline || catObj.budget || 500;
    const delta = spent - baseline;
    const pctDelta = baseline > 0 ? Math.round((delta / baseline) * 100) : 0;
    return {
      name,
      spent,
      baseline,
      delta,
      pctDelta,
      classification: catObj.classification || 'Discretionary',
      icon: catObj.icon || 'credit-card',
      color: catObj.color || '#7C3AED'
    };
  }).filter(c => c.spent > 0 || c.baseline > 0);

  // Sort descending by spend
  categoryList.sort((a, b) => b.spent - a.spent);

  const totalSpentForPareto = monthOutflow > 0 ? monthOutflow : 1;
  const top4Categories = categoryList.slice(0, 4);
  const otherCategories = categoryList.slice(4);
  const otherSpend = otherCategories.reduce((s, c) => s + c.spent, 0);

  // Nordic Palette for Pareto segments
  const paretoColors = ['#7C3AED', '#E11D48', '#0D9488', '#4F46E5', '#64748B'];

  // 2. Identify Outliers vs. 3-Month Rolling Baseline
  const outliers = categoryList.map(cat => {
    let status = 'baseline'; // 'spike' | 'reduced' | 'baseline'
    if (cat.pctDelta > 20) {
      status = 'spike';
    } else if (cat.pctDelta < -20) {
      status = 'reduced';
    }
    return { ...cat, status };
  });

  const outlierSpikes = outliers.filter(o => o.status === 'spike');
  const onBaseline = outliers.filter(o => o.status === 'baseline');
  const reducedSpends = outliers.filter(o => o.status === 'reduced');

  // Filter transactions for ledger
  let filteredTxs = transactions;
  if (selectedFinanceMonth) {
    filteredTxs = filteredTxs.filter(t => t.date && t.date.startsWith(selectedFinanceMonth));
  }
  if (financeTxCategoryFilter !== 'all') {
    filteredTxs = filteredTxs.filter(t => t.category === financeTxCategoryFilter);
  }
  if (financeTxHighSpendOnly) {
    filteredTxs = filteredTxs.filter(t => Math.abs(parseFloat(t.amount) || 0) >= 100);
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
      
      <!-- 1. Hero Cash Flow Split & Month Selector -->
      <div class="finance-flow-hero">
        <div class="finance-flow-header">
          <div>
            <h2 class="finance-hero-title">
              <span>💳</span>
              <span>Cash Flow &amp; Spend Radar</span>
            </h2>
            <p class="finance-hero-sub">
              Macro earn vs. burn clarity &bull; Zero budget tracking &bull; Powered by Monarch
            </p>
          </div>

          <!-- Month Selector -->
          <div style="display: flex; gap: 8px; align-items: center;">
            <div class="finance-month-selector">
              <i data-lucide="calendar" style="width: 14px; height: 14px; color: var(--fin-primary);"></i>
              <select class="finance-month-select-input" onchange="changeFinanceActiveMonth(this.value)">
                ${availableMonths.map(m => `
                  <option value="${m}" ${m === selectedFinanceMonth ? 'selected' : ''}>
                    ${formatFinanceMonthLabel(m)}
                  </option>
                `).join('')}
              </select>
            </div>
            <button class="btn btn-secondary" onclick="openLogCashFlowModal('${selectedFinanceMonth}')" style="font-size: 0.74rem; padding: 4px 10px;" title="Adjust this month's Income &amp; Outflow">
              <i data-lucide="edit-3" style="width: 12px; height: 12px;"></i>
              <span>Edit</span>
            </button>
          </div>
        </div>

        <!-- 3-Column Hero Cash Flow Split -->
        <div class="finance-flow-split-grid">
          
          <!-- Column 1: Income Earned -->
          <div class="finance-flow-col">
            <span class="finance-kpi-label">
              <i data-lucide="arrow-down-left" style="width: 13px; height: 13px; color: #0D9488;"></i>
              <span>Total Income Inflow</span>
            </span>
            <span class="finance-kpi-value" style="color: #0F766E;">
              $${monthInflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span class="finance-kpi-sub">Verified salary + distributions</span>
          </div>

          <!-- Column 2: Total Outflow -->
          <div class="finance-flow-col">
            <span class="finance-kpi-label">
              <i data-lucide="arrow-up-right" style="width: 13px; height: 13px; color: #E11D48;"></i>
              <span>Total Spend Outflow</span>
            </span>
            <span class="finance-kpi-value" style="color: var(--text-primary);">
              $${monthOutflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span class="finance-kpi-sub">Fixed commitments + discretionary</span>
          </div>

          <!-- Column 3: Net Cash Flow Surplus / Deficit -->
          <div class="finance-flow-col ${isPositive ? 'surplus-highlight' : 'deficit-highlight'}">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="finance-kpi-label">
                <i data-lucide="sparkles" style="width: 13px; height: 13px; color: ${isPositive ? '#0D9488' : '#E11D48'};"></i>
                <span>Net Cash Flow Delta</span>
              </span>
              ${isPositive ? `
                <span class="finance-flow-badge-pos">
                  <i data-lucide="check" style="width: 12px; height: 12px;"></i>
                  <span>${savingsRate}% Saved</span>
                </span>
              ` : `
                <span class="finance-flow-badge-neg">
                  <i data-lucide="alert-triangle" style="width: 12px; height: 12px;"></i>
                  <span>Deficit</span>
                </span>
              `}
            </div>
            <span class="finance-kpi-value" style="color: ${isPositive ? '#0D9488' : '#E11D48'};">
              ${isPositive ? '+' : '-'}$${Math.abs(netCashFlow).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span class="finance-kpi-sub">
              ${isPositive ? 'Liquid buffer swept to reserves' : 'Burn exceeded inflows this month'}
            </span>
          </div>

        </div>

        ${currentSummary && currentSummary.notes ? `
          <div style="font-size: 0.78rem; color: var(--text-muted); font-style: italic; border-top: 1px dashed var(--border-color); pt-2; margin-top: 4px;">
            📝 <strong>Month Notes:</strong> ${escapeHtml(currentSummary.notes)}
          </div>
        ` : ''}
      </div>

      <!-- 2. Top Spending Drivers (80/20 Pareto Proportional Strip) -->
      <div class="finance-section-box">
        <div class="finance-section-header">
          <div>
            <h3 class="finance-section-title">
              <i data-lucide="bar-chart-3" style="width: 18px; height: 18px; color: var(--fin-violet);"></i>
              <span>Top Spending Drivers (80/20 Pareto Distribution)</span>
            </h3>
            <span style="font-size: 0.78rem; color: var(--text-muted);">
              Where 80% of your capital flowed this month &bull; Sorted from highest to lowest
            </span>
          </div>
        </div>

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
      </div>

      <!-- 3. Monthly Outlier Radar (vs. 3-Month Rolling Baseline) -->
      <div class="finance-section-box">
        <div class="finance-section-header">
          <div>
            <h3 class="finance-section-title">
              <i data-lucide="radar" style="width: 18px; height: 18px; color: #0D9488;"></i>
              <span>Monthly Outlier Radar (vs. 3-Month Rolling Baseline)</span>
            </h3>
            <span style="font-size: 0.78rem; color: var(--text-muted);">
              Detecting spending anomalies, seasonal spikes, and category deviations
            </span>
          </div>
          <div style="display: flex; gap: 6px;">
            <span class="finance-flag-pill danger" style="font-size: 0.7rem;">${outlierSpikes.length} Spikes</span>
            <span class="finance-flag-pill safe" style="font-size: 0.7rem;">${onBaseline.length} On Baseline</span>
            ${reducedSpends.length > 0 ? `
              <span class="finance-flag-pill violet" style="font-size: 0.7rem;">${reducedSpends.length} Reduced</span>
            ` : ''}
          </div>
        </div>

        <div class="finance-outlier-grid">
          ${categoryList.map(cat => {
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
                    <span style="font-size: 0.72rem; color: var(--text-muted);"> this month</span>
                  </div>
                  <div style="font-size: 0.74rem; color: var(--text-secondary); text-align: right;">
                    Baseline: $${cat.baseline.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div style="font-size: 0.72rem; padding-top: 4px; border-top: 1px dashed var(--border-color); color: ${isSpike ? '#9F1239' : 'var(--text-muted)'};">
                  ${isSpike ? `⚠️ Ran <strong>+$${cat.delta.toFixed(0)}</strong> above your 3-month rolling average.` : ''}
                  ${isReduced ? `✨ Spent <strong>$${Math.abs(cat.delta).toFixed(0)} less</strong> than typical baseline.` : ''}
                  ${!isSpike && !isReduced ? `Within normal historical variance (&plusmn;${Math.abs(cat.pctDelta)}%).` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 4. Actionable Savings Levers Guide -->
      <div class="finance-levers-box">
        <div class="finance-levers-header">
          <i data-lucide="lightbulb" style="width: 18px; height: 18px; color: var(--fin-violet);"></i>
          <span>Strategic Levers: Where &amp; How to Save Next Month</span>
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
                Trimming 2 non-essential transactions in this category recovers <strong>~$400–$500</strong> directly into net surplus.
              </div>
            </div>
          ` : `
            <div class="finance-lever-item">
              <div class="finance-lever-icon" style="background: var(--fin-primary-light); color: var(--fin-primary);">
                <i data-lucide="check" style="width: 13px; height: 13px;"></i>
              </div>
              <div>
                <strong>Zero Severe Outlier Spikes:</strong> Discretionary spending was exceptionally well-aligned with rolling baselines this cycle.
              </div>
            </div>
          `}

          <div class="finance-lever-item">
            <div class="finance-lever-icon" style="background: rgba(124, 58, 237, 0.1); color: var(--fin-violet);">
              <i data-lucide="repeat" style="width: 13px; height: 13px;"></i>
            </div>
            <div>
              <strong>Recurring Subscriptions Audit:</strong> 
              Review the <a href="javascript:void(0)" onclick="switchFinanceSubTab('subscriptions')" style="color: var(--fin-violet); font-weight: 600; text-decoration: underline;">Subscriptions &amp; Card ROI</a> tab. 
              Pruning underutilized software licenses and checking credit card annual fee credits will prevent recurring margin leakage.
            </div>
          </div>

          <div class="finance-lever-item">
            <div class="finance-lever-icon" style="background: rgba(13, 148, 136, 0.1); color: var(--fin-primary);">
              <i data-lucide="receipt" style="width: 13px; height: 13px;"></i>
            </div>
            <div>
              <strong>Medical Reimbursements Recovery:</strong>
              Check the <a href="javascript:void(0)" onclick="switchFinanceSubTab('claims')" style="color: var(--fin-primary); font-weight: 600; text-decoration: underline;">Medical Claims</a> pipeline for pending therapy or specialist superbills to pull out-of-pocket cash back into checking.
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Monarch Money 1-Click CSV Dropzone -->
      <div class="monarch-dropzone" id="monarch-dropzone-el" onclick="triggerMonarchFileInput()">
        <div class="monarch-dropzone-icon">
          <i data-lucide="upload-cloud" style="width: 22px; height: 22px;"></i>
        </div>
        <h3 class="monarch-dropzone-title">Drop Monarch Money CSV Here</h3>
        <p class="monarch-dropzone-desc">
          Drag &amp; drop your Monarch <code>transactions.csv</code> export, or click to browse. Automatically aggregates income, outflow, category drivers, and computes outlier spikes against rolling baseline.
        </p>
        <div class="monarch-dropzone-actions" onclick="event.stopPropagation()">
          <button class="btn btn-secondary" onclick="triggerMonarchFileInput()" style="font-size: 0.78rem; padding: 5px 12px;">
            <i data-lucide="folder-open" style="width: 13px; height: 13px;"></i>
            <span>Browse CSV File</span>
          </button>
          <button class="btn btn-secondary" onclick="loadSampleMonarchData()" style="font-size: 0.78rem; padding: 5px 12px;">
            <i data-lucide="sparkles" style="width: 13px; height: 13px; color: var(--fin-primary);"></i>
            <span>Load Sample Monarch CSV</span>
          </button>
        </div>
        <input type="file" id="monarch-file-input" accept=".csv" style="display: none;" onchange="handleMonarchFileSelected(event)">
      </div>

      <!-- 6. Monarch Transactions Ledger with High-Spend Filter -->
      <div class="finance-section-box">
        <div class="finance-section-header">
          <div>
            <h3 class="finance-section-title">
              <i data-lucide="receipt" style="width: 18px; height: 18px; color: var(--fin-primary);"></i>
              <span>Monarch Transactions Ledger</span>
            </h3>
            <span style="font-size: 0.78rem; color: var(--text-muted);">${filteredTxs.length} items logged for ${formatFinanceMonthLabel(selectedFinanceMonth)}</span>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
            <!-- High Spend Toggle -->
            <button class="btn btn-secondary ${financeTxHighSpendOnly ? 'active' : ''}" onclick="toggleFinanceTxHighSpend()" style="font-size: 0.74rem; padding: 4px 10px;">
              <i data-lucide="filter" style="width: 12px; height: 12px;"></i>
              <span>${financeTxHighSpendOnly ? 'All Amounts' : 'High Spend (> $100)'}</span>
            </button>

            <input type="text" placeholder="Search merchant, tag, note..." value="${escapeHtml(financeTxSearchQuery)}" oninput="handleFinanceTxSearch(this.value)" class="form-control" style="font-size: 0.78rem; padding: 4px 8px; width: 180px;">
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
                  <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">
                    No transactions match the selected filter.
                  </td>
                </tr>
              ` : filteredTxs.map(t => {
                const amt = parseFloat(t.amount) || 0;
                const isHighSpend = Math.abs(amt) >= 300;
                return `
                  <tr>
                    <td style="white-space: nowrap; font-family: var(--font-mono); font-size: 0.76rem;">${escapeHtml(t.date || '')}</td>
                    <td><strong>${escapeHtml(t.merchant || 'Unknown')}</strong></td>
                    <td><span class="zlog-ood-badge" style="font-size: 0.7rem;">${escapeHtml(t.category || 'General')}</span></td>
                    <td style="color: var(--text-secondary); font-size: 0.74rem;">${escapeHtml(t.account || 'Checking')}</td>
                    <td>
                      ${t.tags ? `<span class="finance-flag-pill ${t.tags.includes('High-Spend') ? 'danger' : 'safe'}" style="font-size: 0.66rem; padding: 1px 6px;">${escapeHtml(t.tags)}</span>` : '<span style="color: var(--text-muted);">&mdash;</span>'}
                    </td>
                    <td class="finance-amount-cell ${isHighSpend ? 'danger' : ''}">
                      $${amt.toFixed(2)}
                    </td>
                  </tr>
                `;
              }).join('')}
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

/* Helpers for Month Switching & Filters */
function formatFinanceMonthLabel(monthIso) {
  if (!monthIso || !monthIso.includes('-')) return monthIso || '';
  const [yr, mo] = monthIso.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const idx = parseInt(mo, 10) - 1;
  return `${monthNames[idx] || mo} ${yr}`;
}

function changeFinanceActiveMonth(m) {
  selectedFinanceMonth = m;
  renderFinanceBurn();
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
      let originalVal = parseFloat(rawAmount) || 0;
      
      const categoryName = (categoryIdx !== -1 && row[categoryIdx]) ? row[categoryIdx].trim() : 'Discretionary';
      const merchantName = (merchantIdx !== -1 && row[merchantIdx]) ? row[merchantIdx].trim() : 'Transaction';
      const accountName = (accountIdx !== -1 && row[accountIdx]) ? row[accountIdx].trim() : 'Account';
      const tagsVal = (tagsIdx !== -1 && row[tagsIdx]) ? row[tagsIdx].trim() : '';
      const dateVal = row[dateIdx].trim();

      const isIncome = originalVal > 0 || categoryName.toLowerCase().includes('income') || tagsVal.toLowerCase().includes('income');
      const amountNum = Math.abs(originalVal);

      newTransactions.push({
        id: 'tx-m-' + Date.now() + '-' + i,
        date: dateVal,
        merchant: merchantName,
        category: categoryName,
        account: accountName,
        amount: amountNum,
        tags: tagsVal
      });
    }

    storage.saveMonarchTransactions(newTransactions);

    // Auto-compute monthly cash flow totals for the imported transactions
    const monthTotals = {};
    newTransactions.forEach(t => {
      if (!t.date || t.date.length < 7) return;
      const mStr = t.date.substring(0, 7);
      if (!monthTotals[mStr]) monthTotals[mStr] = { income: 0, outflow: 0 };
      const isInc = t.category.toLowerCase().includes('income') || (t.tags && t.tags.toLowerCase().includes('income'));
      if (isInc) {
        monthTotals[mStr].income += t.amount;
      } else {
        monthTotals[mStr].outflow += t.amount;
      }
    });

    Object.keys(monthTotals).forEach(mStr => {
      const summary = {
        month: mStr,
        income: monthTotals[mStr].income > 0 ? monthTotals[mStr].income : 14250.00,
        outflow: monthTotals[mStr].outflow,
        notes: `Auto-synced from Monarch CSV (${newTransactions.length} transactions)`
      };
      storage.saveMonthlyCashFlowSummary(summary);
      selectedFinanceMonth = mStr;
    });

    if (typeof showToast === 'function') {
      showToast(`Imported ${newTransactions.length} Monarch transactions & updated Cash Flow! 📊`, 'success');
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
