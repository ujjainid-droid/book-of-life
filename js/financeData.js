/* ==========================================================================
   Book of Life / Life OS - Personal Finance Data & Monarch Money Models
   ========================================================================== */

const DEFAULT_FINANCE_DATA = {
  monthlyTarget: 9500, // Monthly burn target in dollars
  alertSpendRatio: 0.85, // Flag category when >85% spent early in month
  categories: [
    { id: 'cat-housing', name: 'Housing & Rent / Mortgage', budget: 3200, icon: 'home', alertThreshold: 100 },
    { id: 'cat-groceries', name: 'Groceries & Nutrition', budget: 1200, icon: 'shopping-cart', alertThreshold: 100 },
    { id: 'cat-dining', name: 'Dining Out & Takeout', budget: 800, icon: 'utensils', alertThreshold: 85 },
    { id: 'cat-therapy-meds', name: 'Specialist Therapy & Meds', budget: 1400, icon: 'heart-pulse', alertThreshold: 100 },
    { id: 'cat-school-activities', name: 'Z Activities & Enrichment', budget: 600, icon: 'book-open', alertThreshold: 100 },
    { id: 'cat-shopping', name: 'Shopping & Discretionary', budget: 700, icon: 'shopping-bag', alertThreshold: 85 },
    { id: 'cat-transport', name: 'Auto, Gas & Commute', budget: 450, icon: 'car', alertThreshold: 100 },
    { id: 'cat-utilities', name: 'Utilities & Telecom', budget: 350, icon: 'zap', alertThreshold: 100 },
    { id: 'cat-subscriptions', name: 'Software & Recurring Subs', budget: 300, icon: 'repeat', alertThreshold: 100 },
    { id: 'cat-wellness', name: 'Personal Wellness & Care', budget: 500, icon: 'sparkles', alertThreshold: 100 }
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
    { id: 'tx-m-2', date: '2026-10-01', merchant: 'Whole Foods Market', category: 'Groceries & Nutrition', amount: 248.65, account: 'Amex Gold', tags: 'Groceries' },
    { id: 'tx-m-3', date: '2026-10-02', merchant: 'Equinox Sports Club', category: 'Personal Wellness & Care', amount: 280.00, account: 'Chase Sapphire', tags: 'Subscription' },
    { id: 'tx-m-4', date: '2026-10-02', merchant: 'Dr. Barness Child Psych', category: 'Specialist Therapy & Meds', amount: 300.00, account: 'Chase Checking', tags: 'Superbill' },
    { id: 'tx-m-5', date: '2026-10-02', merchant: 'Trader Joe\'s Store #412', category: 'Groceries & Nutrition', amount: 112.40, account: 'Amex Gold', tags: 'Groceries' },
    { id: 'tx-m-6', date: '2026-10-02', merchant: 'Nobu Downtown Dinner', category: 'Dining Out & Takeout', amount: 365.50, account: 'Amex Gold', tags: 'High-Spend, Dining' },
    { id: 'tx-m-7', date: '2026-10-03', merchant: 'Nordstrom - Fall Outerwear', category: 'Shopping & Discretionary', amount: 620.00, account: 'Chase Sapphire', tags: 'High-Spend, Discretionary' },
    { id: 'tx-m-8', date: '2026-10-03', merchant: 'Sweetgreen Salad', category: 'Dining Out & Takeout', amount: 38.20, account: 'Apple Pay', tags: 'Lunch' },
    { id: 'tx-m-9', date: '2026-10-03', merchant: 'Blue Bottle Coffee', category: 'Dining Out & Takeout', amount: 18.50, account: 'Apple Pay', tags: 'Coffee' },
    { id: 'tx-m-10', date: '2026-10-03', merchant: 'Amazon - Sensory Compression Vest', category: 'Specialist Therapy & Meds', amount: 89.90, account: 'Chase Sapphire', tags: 'Z Care' }
  ],
  sampleMonarchCsv: `Date,Merchant,Category,Account,Original Statement,Notes,Amount,Tags
2026-10-01,Mortgage / Rent Payment,Housing & Rent / Mortgage,Chase Checking,ACH WITHDRAWAL MORTGAGE,Automatic transfer,-3200.00,Fixed
2026-10-01,Whole Foods Market,Groceries & Nutrition,Amex Gold,WHOLEFDS MKT 10291,Weekly organic stock,-248.65,Groceries
2026-10-02,Equinox Sports Club,Personal Wellness & Care,Chase Sapphire,EQUINOX FITNESS CLUB,Monthly dues,-280.00,Subscription
2026-10-02,Dr. Barness Child Psych,Specialist Therapy & Meds,Chase Checking,CHECK #1042 BARNESS,Psychiatry consult,-300.00,Superbill
2026-10-02,Trader Joe's #412,Groceries & Nutrition,Amex Gold,TRADER JOE'S #412,Pantry restocking,-112.40,Groceries
2026-10-02,Nobu Downtown Dinner,Dining Out & Takeout,Amex Gold,NOBU RESTAURANT NYC,Celebratory dinner,-365.50,High-Spend
2026-10-03,Nordstrom Outerwear,Shopping & Discretionary,Chase Sapphire,NORDSTROM 0382,Fall capsule,-620.00,Discretionary
2026-10-03,Sweetgreen,Dining Out & Takeout,Apple Pay,SWEETGREEN #12,Lunch bowl,-38.20,Food
2026-10-03,Blue Bottle Coffee,Dining Out & Takeout,Apple Pay,BLUE BOTTLE COFFEE,Morning drip,-18.50,Coffee
2026-10-03,Amazon,Specialist Therapy & Meds,Chase Sapphire,AMZN Mktp US,Sensory compression vest,-89.90,Z Care`
};
