/* ==========================================================================
   Book of Life / Life OS - Personal Finance Data & Monarch Money Models
   ========================================================================== */

const DEFAULT_FINANCE_DATA = {
  monthlyTarget: 9500, // Historical reference target
  alertSpendRatio: 0.85,
  // 3-Month Rolling Category Baselines (for anomaly & outlier detection)
  categoryBaselines: {
    'Housing & Rent / Mortgage': 3200,
    'Dining Out & Takeout': 1250,
    'Specialist Therapy & Meds': 1400,
    'Groceries & Nutrition': 1200,
    'Shopping & Discretionary': 550,
    'Z Activities & Enrichment': 600,
    'Personal Wellness & Care': 500,
    'Auto, Gas & Commute': 450,
    'Utilities & Telecom': 350,
    'Software & Recurring Subs': 300
  },
  // Monthly Cash Flow Summaries (Income Inflow vs Spend Outflow & Net Savings)
  monthlySummaries: [
    {
      month: '2026-10',
      income: 14250.00,
      outflow: 10410.00,
      notes: 'Bonus split + regular salary. Dining and shopping ran higher than baseline.'
    },
    {
      month: '2026-09',
      income: 13500.00,
      outflow: 9650.00,
      notes: 'Disciplined cadence, healthy +$3,850 surplus swept to HYSA.'
    },
    {
      month: '2026-08',
      income: 13500.00,
      outflow: 10180.00,
      notes: 'Late summer family travel and back-to-school enrichment.'
    },
    {
      month: '2026-07',
      income: 13500.00,
      outflow: 9790.00,
      notes: 'Steady baseline burn, solid +$3,710 savings rate.'
    }
  ],
  categories: [
    { id: 'cat-housing', name: 'Housing & Rent / Mortgage', budget: 3200, baseline: 3200, classification: 'Fixed Baseline', icon: 'home' },
    { id: 'cat-dining', name: 'Dining Out & Takeout', budget: 1250, baseline: 1250, classification: 'Discretionary', icon: 'utensils' },
    { id: 'cat-therapy-meds', name: 'Specialist Therapy & Meds', budget: 1400, baseline: 1400, classification: 'Healthcare', icon: 'heart-pulse' },
    { id: 'cat-groceries', name: 'Groceries & Nutrition', budget: 1200, baseline: 1200, classification: 'Essential', icon: 'shopping-cart' },
    { id: 'cat-shopping', name: 'Shopping & Discretionary', budget: 550, baseline: 550, classification: 'Discretionary', icon: 'shopping-bag' },
    { id: 'cat-school-activities', name: 'Z Activities & Enrichment', budget: 600, baseline: 600, classification: 'Enrichment', icon: 'book-open' },
    { id: 'cat-wellness', name: 'Personal Wellness & Care', budget: 500, baseline: 500, classification: 'Self Care', icon: 'sparkles' },
    { id: 'cat-transport', name: 'Auto, Gas & Commute', budget: 450, baseline: 450, classification: 'Essential', icon: 'car' },
    { id: 'cat-utilities', name: 'Utilities & Telecom', budget: 350, baseline: 350, classification: 'Fixed Baseline', icon: 'zap' },
    { id: 'cat-subscriptions', name: 'Software & Recurring Subs', budget: 300, baseline: 300, classification: 'Recurring', icon: 'repeat' }
  ],
  subscriptions: [
    { id: 'sub-1', name: 'Monarch Money', cost: 14.99, cadence: 'monthly', category: 'Finance', nextRenewal: '2026-10-15', status: 'active', autoRenew: true, notes: 'Primary budget & net worth engine' },
    { id: 'sub-2', name: 'Claude Pro', cost: 20.00, cadence: 'monthly', category: 'Productivity', nextRenewal: '2026-10-18', status: 'active', autoRenew: true, notes: 'AI assistant' },
    { id: 'sub-3', name: 'ChatGPT Plus', cost: 20.00, cadence: 'monthly', category: 'Productivity', nextRenewal: '2026-10-22', status: 'active', autoRenew: true, notes: 'AI research & code' },
    { id: 'sub-4', name: 'iCloud 2TB Family', cost: 9.99, cadence: 'monthly', category: 'Cloud', nextRenewal: '2026-10-05', status: 'active', autoRenew: true, notes: 'Photo sync & device backups' },
    { id: 'sub-5', name: 'Equinox Membership', cost: 280.00, cadence: 'monthly', category: 'Fitness', nextRenewal: '2026-10-01', status: 'active', autoRenew: true, notes: 'Health & conditioning' },
    { id: 'sub-6', name: 'Things 3 Cloud', cost: 0.00, cadence: 'lifetime', category: 'Productivity', nextRenewal: 'Lifetime', status: 'active', autoRenew: false, notes: 'Task execution OS' },
    { id: 'sub-7', name: 'Streaming Bundle (Max/Netflix/AppleTV)', cost: 44.97, cadence: 'monthly', category: 'Entertainment', nextRenewal: '2026-10-12', status: 'active', autoRenew: true, notes: 'Family media bundle' },
    { id: 'sub-8', name: 'Audible Premium Plus', cost: 14.95, cadence: 'monthly', category: 'Learning', nextRenewal: '2026-10-29', status: 'under_review', autoRenew: true, notes: 'Audit: Check unspent credits before renewal' }
  ],
  accounts: [
    { id: 'acc-1', name: 'Primary Checking', institution: 'Chase', type: 'checking', balance: 14250.00, updated: '2026-10-02' },
    { id: 'acc-2', name: 'High-Yield Emergency Fund', institution: 'Marcus by Goldman', type: 'hysa', balance: 68500.00, apy: '4.40%', updated: '2026-10-01' },
    { id: 'acc-3', name: 'Health Savings / FSA Account', institution: 'Optum Bank', type: 'hsa', balance: 4120.00, updated: '2026-10-01' },
    { id: 'acc-4', name: 'Sinking Fund (Taxes & Travel)', institution: 'Ally', type: 'savings', balance: 18400.00, updated: '2026-10-01' }
  ],
  transactions: [
    { id: 'tx-m-1', date: '2026-10-01', merchant: 'Mortgage / Rent Payment', category: 'Housing & Rent / Mortgage', amount: 3200.00, account: 'Chase Checking', tags: 'Fixed' },
    { id: 'tx-m-2', date: '2026-10-01', merchant: 'Whole Foods Market', category: 'Groceries & Nutrition', amount: 312.45, account: 'Amex Gold', tags: 'Groceries' },
    { id: 'tx-m-3', date: '2026-10-02', merchant: 'Equinox Sports Club', category: 'Personal Wellness & Care', amount: 280.00, account: 'Chase Sapphire', tags: 'Subscription' },
    { id: 'tx-m-4', date: '2026-10-02', merchant: 'Dr. Barness Child Psych', category: 'Specialist Therapy & Meds', amount: 450.00, account: 'Chase Checking', tags: 'Superbill' },
    { id: 'tx-m-5', date: '2026-10-02', merchant: 'Trader Joe\'s Store #412', category: 'Groceries & Nutrition', amount: 168.20, account: 'Amex Gold', tags: 'Groceries' },
    { id: 'tx-m-6', date: '2026-10-02', merchant: 'Nobu Downtown Dinner', category: 'Dining Out & Takeout', amount: 485.50, account: 'Amex Gold', tags: 'High-Spend, Dining' },
    { id: 'tx-m-7', date: '2026-10-03', merchant: 'Nordstrom - Fall Outerwear', category: 'Shopping & Discretionary', amount: 620.00, account: 'Chase Sapphire', tags: 'High-Spend, Discretionary' },
    { id: 'tx-m-8', date: '2026-10-03', merchant: 'Gramercy Tavern Dinner', category: 'Dining Out & Takeout', amount: 345.00, account: 'Amex Gold', tags: 'High-Spend, Dining' },
    { id: 'tx-m-9', date: '2026-10-04', merchant: 'Sweetgreen & Lunches', category: 'Dining Out & Takeout', amount: 142.80, account: 'Apple Pay', tags: 'Lunch' },
    { id: 'tx-m-10', date: '2026-10-05', merchant: 'Specialist Speech Therapy', category: 'Specialist Therapy & Meds', amount: 600.00, account: 'Chase Checking', tags: 'Superbill' },
    { id: 'tx-m-11', date: '2026-10-05', merchant: 'Kumon & Chess Enrichment', category: 'Z Activities & Enrichment', amount: 420.00, account: 'Chase Checking', tags: 'Enrichment' },
    { id: 'tx-m-12', date: '2026-10-06', merchant: 'ConEd Power & Gas', category: 'Utilities & Telecom', amount: 285.00, account: 'Chase Checking', tags: 'Utilities' },
    { id: 'tx-m-13', date: '2026-10-07', merchant: 'Bespoke Facial & Grooming', category: 'Personal Wellness & Care', amount: 220.00, account: 'Chase Sapphire', tags: 'Wellness' },
    { id: 'tx-m-14', date: '2026-10-08', merchant: 'Uber & MTA Transit', category: 'Auto, Gas & Commute', amount: 185.00, account: 'Amex Gold', tags: 'Transit' },
    { id: 'tx-m-15', date: '2026-10-09', merchant: 'Osteria Morini Dinner', category: 'Dining Out & Takeout', amount: 280.00, account: 'Amex Gold', tags: 'Dining' }
  ],
  sampleMonarchCsv: `Date,Merchant,Category,Account,Original Statement,Notes,Amount,Tags
2026-10-01,Paycheck / Salary Deposit,Income,Chase Checking,DIRECT DEP EMPLOYER,Monthly take-home,12250.00,Income
2026-10-01,Quarterly Performance Bonus,Income,Chase Checking,BONUS WIRE,Q3 performance sweep,2000.00,Income
2026-10-01,Mortgage / Rent Payment,Housing & Rent / Mortgage,Chase Checking,ACH WITHDRAWAL MORTGAGE,Automatic transfer,-3200.00,Fixed
2026-10-01,Whole Foods Market,Groceries & Nutrition,Amex Gold,WHOLEFDS MKT 10291,Weekly organic stock,-312.45,Groceries
2026-10-02,Equinox Sports Club,Personal Wellness & Care,Chase Sapphire,EQUINOX FITNESS CLUB,Monthly dues,-280.00,Subscription
2026-10-02,Dr. Barness Child Psych,Specialist Therapy & Meds,Chase Checking,CHECK #1042 BARNESS,Psychiatry consult,-450.00,Superbill
2026-10-02,Nobu Downtown Dinner,Dining Out & Takeout,Amex Gold,NOBU RESTAURANT NYC,Celebratory dinner,-485.50,High-Spend
2026-10-03,Nordstrom Outerwear,Shopping & Discretionary,Chase Sapphire,NORDSTROM 0382,Fall capsule,-620.00,Discretionary
2026-10-03,Gramercy Tavern,Dining Out & Takeout,Amex Gold,GRAMERCY TAVERN,Weekend dinner,-345.00,High-Spend
2026-10-05,Specialist Speech Therapy,Specialist Therapy & Meds,Chase Checking,CHECK #1043 SPEECH,Therapy,-600.00,Superbill
2026-10-05,Kumon & Chess,Z Activities & Enrichment,Chase Checking,ACH KUMON,Enrichment,-420.00,Enrichment`
};
