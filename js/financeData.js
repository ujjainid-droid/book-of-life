/* ==========================================================================
   Book of Life / Life OS - Personal Finance Data & Monarch Money Models
   ========================================================================== */

const DEFAULT_FINANCE_DATA = {
  seedVersion: 5,
  monthlyTarget: 23500, // Historical reference target
  alertSpendRatio: 0.85,
  // 3-Month Rolling Category Baselines (derived from actual Jul–Sep 2026 Monarch spend)
  categoryBaselines: {
    "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3": 404.75,
    "Camp": 379.38,
    "Cash & ATM": 266.94,
    "Charity": 68.0,
    "Child Activities": 1256.39,
    "Child Care": 321.3,
    "Clothing, Shoes, Jewelry": 634.37,
    "Credit Card + Financial Fees": 764.17,
    "Eating out": 1675.17,
    "Entertainment & Recreation": 17.33,
    "Fitness": 553.86,
    "Gas & Electric": 1622.08,
    "Groceries": 1992.19,
    "Home Improvement": 158.77,
    "Home Security": 65.36,
    "Home maintenance": 2195.94,
    "Internet & Cable": 79.99,
    "Medical + Dentist": 2278.41,
    "Mocha": 690.22,
    "Mortgage": 5933.22,
    "School stuff + Education": 209.27,
    "Self care + Grooming": 480.21,
    "Shopping": 2114.2,
    "Subscriptions": 297.43,
    "Transportation": 624.27,
    "Travel & Vacation": 1870.79,
    "Water": 296.34
},
  // Monthly Cash Flow Summaries (Actual 2026 Earn vs. Spend from Monarch)
  monthlySummaries: [
    {
        "month": "2026-10",
        "income": 7365.91,
        "outflow": 4698.0
    },
    {
        "month": "2026-09",
        "income": 21923.76,
        "outflow": 23163.42
    },
    {
        "month": "2026-08",
        "income": 21150.46,
        "outflow": 28906.88
    },
    {
        "month": "2026-07",
        "income": 29843.38,
        "outflow": 29680.76
    },
    {
        "month": "2026-06",
        "income": 21386.52,
        "outflow": 29497.34
    },
    {
        "month": "2026-05",
        "income": 21318.19,
        "outflow": 26924.02
    },
    {
        "month": "2026-04",
        "income": 23037.22,
        "outflow": 18021.76
    },
    {
        "month": "2026-03",
        "income": 57411.57,
        "outflow": 70892.86
    },
    {
        "month": "2026-02",
        "income": 31671.81,
        "outflow": 24962.31
    },
    {
        "month": "2026-01",
        "income": 23040.91,
        "outflow": 24718.45
    }
],
  categories: [
    {
        "id": "cat-mortgage",
        "name": "Mortgage",
        "budget": 5933,
        "baseline": 5933.22,
        "classification": "Fixed Baseline",
        "icon": "home"
    },
    {
        "id": "cat-medical-dentist",
        "name": "Medical + Dentist",
        "budget": 2278,
        "baseline": 2278.41,
        "classification": "Healthcare",
        "icon": "heart-pulse"
    },
    {
        "id": "cat-home-maintenance",
        "name": "Home maintenance",
        "budget": 2195,
        "baseline": 2195.94,
        "classification": "Discretionary",
        "icon": "wrench"
    },
    {
        "id": "cat-shopping",
        "name": "Shopping",
        "budget": 2114,
        "baseline": 2114.2,
        "classification": "Discretionary",
        "icon": "shopping-bag"
    },
    {
        "id": "cat-groceries",
        "name": "Groceries",
        "budget": 1992,
        "baseline": 1992.19,
        "classification": "Essential",
        "icon": "shopping-cart"
    },
    {
        "id": "cat-travel",
        "name": "Travel & Vacation",
        "budget": 1870,
        "baseline": 1870.79,
        "classification": "Discretionary",
        "icon": "plane"
    },
    {
        "id": "cat-eating-out",
        "name": "Eating out",
        "budget": 1675,
        "baseline": 1675.17,
        "classification": "Discretionary",
        "icon": "utensils"
    },
    {
        "id": "cat-gas-electric",
        "name": "Gas & Electric",
        "budget": 1622,
        "baseline": 1622.08,
        "classification": "Fixed Baseline",
        "icon": "zap"
    },
    {
        "id": "cat-child-activities",
        "name": "Child Activities",
        "budget": 1256,
        "baseline": 1256.39,
        "classification": "Enrichment",
        "icon": "book-open"
    },
    {
        "id": "cat-mocha",
        "name": "Mocha",
        "budget": 690,
        "baseline": 690.22,
        "classification": "Fixed Baseline",
        "icon": "paw-print"
    },
    {
        "id": "cat-clothing",
        "name": "Clothing, Shoes, Jewelry",
        "budget": 634,
        "baseline": 634.37,
        "classification": "Discretionary",
        "icon": "tag"
    },
    {
        "id": "cat-transportation",
        "name": "Transportation",
        "budget": 624,
        "baseline": 624.27,
        "classification": "Essential",
        "icon": "car"
    },
    {
        "id": "cat-fitness",
        "name": "Fitness",
        "budget": 553,
        "baseline": 553.86,
        "classification": "Self Care",
        "icon": "activity"
    },
    {
        "id": "cat-self-care",
        "name": "Self care + Grooming",
        "budget": 480,
        "baseline": 480.21,
        "classification": "Self Care",
        "icon": "sparkles"
    },
    {
        "id": "cat-gifts",
        "name": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
        "budget": 404,
        "baseline": 404.75,
        "classification": "Discretionary",
        "icon": "gift"
    },
    {
        "id": "cat-camp",
        "name": "Camp",
        "budget": 379,
        "baseline": 379.38,
        "classification": "Enrichment",
        "icon": "sun"
    },
    {
        "id": "cat-child-care",
        "name": "Child Care",
        "budget": 321,
        "baseline": 321.3,
        "classification": "Fixed Baseline",
        "icon": "baby"
    },
    {
        "id": "cat-subscriptions",
        "name": "Subscriptions",
        "budget": 297,
        "baseline": 297.43,
        "classification": "Discretionary",
        "icon": "repeat"
    },
    {
        "id": "cat-water",
        "name": "Water",
        "budget": 296,
        "baseline": 296.34,
        "classification": "Fixed Baseline",
        "icon": "droplet"
    },
    {
        "id": "cat-school-education",
        "name": "School stuff + Education",
        "budget": 209,
        "baseline": 209.27,
        "classification": "Fixed Baseline",
        "icon": "graduation-cap"
    },
    {
        "id": "cat-home-improvement",
        "name": "Home Improvement",
        "budget": 158,
        "baseline": 158.77,
        "classification": "Discretionary",
        "icon": "home"
    },
    {
        "id": "cat-internet-cable",
        "name": "Internet & Cable",
        "budget": 80,
        "baseline": 79.99,
        "classification": "Fixed Baseline",
        "icon": "wifi"
    },
    {
        "id": "cat-charity",
        "name": "Charity",
        "budget": 68,
        "baseline": 68.0,
        "classification": "Discretionary",
        "icon": "heart"
    },
    {
        "id": "cat-home-security",
        "name": "Home Security",
        "budget": 65,
        "baseline": 65.36,
        "classification": "Fixed Baseline",
        "icon": "shield"
    },
    {
        "id": "cat-entertainment",
        "name": "Entertainment & Recreation",
        "budget": 17,
        "baseline": 17.33,
        "classification": "Discretionary",
        "icon": "film"
    }
],
  subscriptions: [
    { id: 'sub-1', name: 'OpenAI ChatGPT Plus', cost: 20.00, cadence: 'monthly', category: 'Productivity', nextRenewal: '2026-10-15', status: 'active', autoRenew: true },
    { id: 'sub-2', name: 'GitHub Copilot', cost: 10.00, cadence: 'monthly', category: 'Engineering', nextRenewal: '2026-10-22', status: 'active', autoRenew: true },
    { id: 'sub-3', name: 'Equinox Sports Club', cost: 280.00, cadence: 'monthly', category: 'Wellness & Fitness', nextRenewal: '2026-10-02', status: 'active', autoRenew: true },
    { id: 'sub-4', name: 'Claude Pro (Anthropic)', cost: 20.00, cadence: 'monthly', category: 'AI Assistant', nextRenewal: '2026-10-18', status: 'active', autoRenew: true },
    { id: 'sub-5', name: 'Things 3 Cloud Sync', cost: 0.00, cadence: 'lifetime', category: 'Task Architecture', nextRenewal: 'Lifetime', status: 'active', autoRenew: false },
    { id: 'sub-6', name: 'Monarch Money Premium', cost: 99.99, cadence: 'annual', category: 'Finance Aggregator', nextRenewal: '2026-11-20', status: 'active', autoRenew: true },
    { id: 'sub-7', name: 'Apple One Premier', cost: 37.95, cadence: 'monthly', category: 'Media & Storage', nextRenewal: '2026-10-28', status: 'active', autoRenew: true },
    { id: 'sub-8', name: 'Substack Newsletter (Bessel)', cost: 12.00, cadence: 'monthly', category: 'Intellectual', nextRenewal: '2026-10-09', status: 'under_review', autoRenew: true }
  ],
  accounts: [
    { id: 'acc-1', name: 'Primary Checking (...002)', institution: 'Chase', type: 'checking', balance: 18450.00, updated: '2026-10-11' },
    { id: 'acc-2', name: '360 Performance Savings (...4275)', institution: 'Capital One', type: 'hysa', apy: '4.35%', balance: 64200.00, updated: '2026-10-11' },
    { id: 'acc-3', name: 'Emergency Liquidity Vault', institution: 'Marcus', type: 'hysa', apy: '4.40%', balance: 50000.00, updated: '2026-10-11' },
    { id: 'acc-4', name: 'Health Savings Account (HSA)', institution: 'Optum', type: 'hsa', balance: 8350.00, updated: '2026-10-11' }
  ],
  transactions: [
    {
        "id": "tx-257363950156927050",
        "date": "2026-10-11",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 88.33,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927049",
        "date": "2026-10-11",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 13.64,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257327965255782683",
        "date": "2026-10-11",
        "merchant": "the YMCA",
        "category": "Child Care",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 107.1,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927046",
        "date": "2026-10-10",
        "merchant": "SimpliSafe",
        "category": "Home Security",
        "account": "U CSP (...8373) due 15th",
        "amount": 24.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927035",
        "date": "2026-10-10",
        "merchant": "DUPI STUDIO",
        "category": "Self care + Grooming",
        "account": "U CSP (...8373) due 15th",
        "amount": 398.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257359392802362135",
        "date": "2026-10-10",
        "merchant": "Soft N' Yummy",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 16.89,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257315687246615019",
        "date": "2026-10-10",
        "merchant": "SimpliSafe",
        "category": "Home Security",
        "account": "CREDIT CARD (...8373)",
        "amount": 24.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257315687246615018",
        "date": "2026-10-10",
        "merchant": "DUPI STUDIO",
        "category": "Self care + Grooming",
        "account": "CREDIT CARD (...8373)",
        "amount": 398.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927044",
        "date": "2026-10-09",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927033",
        "date": "2026-10-09",
        "merchant": "A2B Indian Veg Rest",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 82.65,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257276304808235330",
        "date": "2026-10-09",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "Primary Checking ...002 (....002)",
        "amount": 5351.94,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257224629647069689",
        "date": "2026-10-09",
        "merchant": "A2B Indian Veg Rest",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 82.65,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257201690789826635",
        "date": "2026-10-09",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "360 Performance Savings (...4275)",
        "amount": 35.18,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257201690789826634",
        "date": "2026-10-09",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "360 Performance Savings (...4275)",
        "amount": 100.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257131439285883362",
        "date": "2026-10-09",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927043",
        "date": "2026-10-08",
        "merchant": "Chewy",
        "category": "Mocha",
        "account": "U CSP (...8373) due 15th",
        "amount": 134.72,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927039",
        "date": "2026-10-08",
        "merchant": "Chewy",
        "category": "Mocha",
        "account": "U CSP (...8373) due 15th",
        "amount": 54.82,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927032",
        "date": "2026-10-08",
        "merchant": "Harrison Nj Garage Flash",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257232426027733779",
        "date": "2026-10-08",
        "merchant": "Dividend Received Invesco QQQ Tr Unit Ser 1 (Qqq) (Cash)",
        "category": "Dividends & Capital Gains",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 0.75,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257224629647069690",
        "date": "2026-10-08",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257154287002997457",
        "date": "2026-10-08",
        "merchant": "Verizon",
        "category": "Internet & Cable",
        "account": "Primary Checking ...002 (....002)",
        "amount": 79.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257146873400807846",
        "date": "2026-10-08",
        "merchant": "Withholding",
        "category": "Credit Card + Financial Fees",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.32,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257146873400807845",
        "date": "2026-10-08",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 1.34,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257146873400807844",
        "date": "2026-10-08",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 1.34,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257146873400807843",
        "date": "2026-10-08",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 1.81,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257146873400807842",
        "date": "2026-10-08",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 2.13,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257131439285883361",
        "date": "2026-10-08",
        "merchant": "Chewy",
        "category": "Mocha",
        "account": "CREDIT CARD (...8373)",
        "amount": 134.72,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257131439285883360",
        "date": "2026-10-08",
        "merchant": "Chewy",
        "category": "Mocha",
        "account": "CREDIT CARD (...8373)",
        "amount": 54.82,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927057",
        "date": "2026-10-07",
        "merchant": "Thesaladhouse",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 45.7,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927053",
        "date": "2026-10-07",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927047",
        "date": "2026-10-07",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 5.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927040",
        "date": "2026-10-07",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 5.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927034",
        "date": "2026-10-07",
        "merchant": "Summit Medical Group",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 30.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257271936617828941",
        "date": "2026-10-07",
        "merchant": "American Express",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 3.69,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257067662747128467",
        "date": "2026-10-07",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 0.34,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257067662365446773",
        "date": "2026-10-07",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 77.28,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257067662365446772",
        "date": "2026-10-07",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 77.28,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257067662081282656",
        "date": "2026-10-07",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
        "amount": 0.02,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257043245912576100",
        "date": "2026-10-07",
        "merchant": "Merck & Co Inc New Com Dividend Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Individual Brokerage -9148 (...9148)",
        "amount": 513.44,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257043196657815874",
        "date": "2026-10-07",
        "merchant": "The New York Times",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 4.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257039858255024956",
        "date": "2026-10-07",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 5.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257039858255024955",
        "date": "2026-10-07",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257039858255024954",
        "date": "2026-10-07",
        "merchant": "The Salad House",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 45.7,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257039858255024953",
        "date": "2026-10-07",
        "merchant": "Summit Medical Group",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 30.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257039858255024952",
        "date": "2026-10-07",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 5.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257001298575512172",
        "date": "2026-10-07",
        "merchant": "Anthem",
        "category": "Medical + Dentist",
        "account": "Primary Checking ...002 (....002)",
        "amount": 157.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257001298575512169",
        "date": "2026-10-07",
        "merchant": "Karina Oliveira De Araujo",
        "category": "Home maintenance",
        "account": "Primary Checking ...002 (....002)",
        "amount": 175.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927048",
        "date": "2026-10-06",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 32.47,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927031",
        "date": "2026-10-06",
        "merchant": "Harrison Nj Garage Flash",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257037317701129088",
        "date": "2026-10-06",
        "merchant": "Sweep Out",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 651.95,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257037317701129087",
        "date": "2026-10-06",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 0.34,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257037317382361965",
        "date": "2026-10-06",
        "merchant": "Sweep Out",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 888.59,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257037317074080591",
        "date": "2026-10-06",
        "merchant": "Sweep Out",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
        "amount": 43.49,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257037317074080590",
        "date": "2026-10-06",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
        "amount": 0.02,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257037316801450810",
        "date": "2026-10-06",
        "merchant": "Sweep Out",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 785.82,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257001298575512174",
        "date": "2026-10-06",
        "merchant": "Anthem",
        "category": "Medical + Dentist",
        "account": "Primary Checking ...002 (....002)",
        "amount": 157.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257001298575512173",
        "date": "2026-10-06",
        "merchant": "Livingston Public",
        "category": "School stuff + Education",
        "account": "Primary Checking ...002 (....002)",
        "amount": 50.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256947686007657143",
        "date": "2026-10-06",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 32.47,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256947686007657142",
        "date": "2026-10-06",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927051",
        "date": "2026-10-05",
        "merchant": "FirstEnergy",
        "category": "Gas & Electric",
        "account": "U CSP (...8373) due 15th",
        "amount": 440.32,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363946806727535",
        "date": "2026-10-05",
        "merchant": "E-ZPass",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 50.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256985571734868598",
        "date": "2026-10-05",
        "merchant": "American Express",
        "category": "Other Income (incl cc reward credits)",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 21.31,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256949808555118891",
        "date": "2026-10-05",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 342.02,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256949808555118889",
        "date": "2026-10-05",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 342.02,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256949808555118888",
        "date": "2026-10-05",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 601.79,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256949808555118887",
        "date": "2026-10-05",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 601.79,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256949806977011889",
        "date": "2026-10-05",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 241.88,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256949806977011886",
        "date": "2026-10-05",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 241.88,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256949806977011882",
        "date": "2026-10-05",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 154.31,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256949806977011881",
        "date": "2026-10-05",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 154.31,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256870096022557374",
        "date": "2026-10-05",
        "merchant": "Disney",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 21.31,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256856441465885103",
        "date": "2026-10-05",
        "merchant": "FirstEnergy",
        "category": "Gas & Electric",
        "account": "CREDIT CARD (...8373)",
        "amount": 440.32,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256856440858759520",
        "date": "2026-10-05",
        "merchant": "E-ZPass",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 50.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927056",
        "date": "2026-10-04",
        "merchant": "Donut Basket",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 22.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927055",
        "date": "2026-10-04",
        "merchant": "The Milkshake Factor",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 22.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927028",
        "date": "2026-10-04",
        "merchant": "Cookie Cutters Haircuts",
        "category": "Self care + Grooming",
        "account": "U CSP (...8373) due 15th",
        "amount": 5.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256765401383850475",
        "date": "2026-10-04",
        "merchant": "The Milkshake Factor",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 22.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256765401383850474",
        "date": "2026-10-04",
        "merchant": "Donut Basket",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 22.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256765401383850473",
        "date": "2026-10-04",
        "merchant": "Cookie Cutters Haircuts",
        "category": "Self care + Grooming",
        "account": "CREDIT CARD (...8373)",
        "amount": 5.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256699451207864827",
        "date": "2026-10-04",
        "merchant": "the YMCA",
        "category": "Child Care",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 107.1,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927052",
        "date": "2026-10-03",
        "merchant": "Dianas Nail & Spa",
        "category": "Self care + Grooming",
        "account": "U CSP (...8373) due 15th",
        "amount": 117.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927041",
        "date": "2026-10-03",
        "merchant": "lake pajamas",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP (...8373) due 15th",
        "amount": 88.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927036",
        "date": "2026-10-03",
        "merchant": "Trader Joe's",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 118.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256812401937634235",
        "date": "2026-10-03",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 13.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256712655098105860",
        "date": "2026-10-03",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "T CSP 5914 due 15th ",
        "amount": 7.3,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256674788469657860",
        "date": "2026-10-03",
        "merchant": "lake pajamas",
        "category": "Clothing, Shoes, Jewelry",
        "account": "CREDIT CARD (...8373)",
        "amount": 88.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256674788469657859",
        "date": "2026-10-03",
        "merchant": "Trader Joe's",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 118.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256674788469657858",
        "date": "2026-10-03",
        "merchant": "Dianas Nail & Spa",
        "category": "Self care + Grooming",
        "account": "CREDIT CARD (...8373)",
        "amount": 117.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256643752672121829",
        "date": "2026-10-03",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 19.04,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256643752672121828",
        "date": "2026-10-03",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 13.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927058",
        "date": "2026-10-02",
        "merchant": "Tino\u2019s Artisan Pizza",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 100.64,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256622143623156674",
        "date": "2026-10-02",
        "merchant": "Main Street Wine Cell",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 14.97,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256583519324099499",
        "date": "2026-10-02",
        "merchant": "Tino\u2019s Artisan Pizza",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 100.64,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927037",
        "date": "2026-10-01",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256531346023273173",
        "date": "2026-10-01",
        "merchant": "Industry Squares",
        "category": "Shopping",
        "account": "T CSP 5914 due 15th ",
        "amount": 16.82,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256505890317291678",
        "date": "2026-10-01",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 22.55,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505890317291675",
        "date": "2026-10-01",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 22.55,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256471772275692037",
        "date": "2026-10-01",
        "merchant": "the YMCA",
        "category": "Child Care",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 101.7,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256413955463336710",
        "date": "2026-10-01",
        "merchant": "Scholastic",
        "category": "Shopping",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 55.4,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927054",
        "date": "2026-09-30",
        "merchant": "Harrison Nj Garage Flash",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927045",
        "date": "2026-09-30",
        "merchant": "IlPoom",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 127.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927030",
        "date": "2026-09-30",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256511316114035429",
        "date": "2026-09-30",
        "merchant": "Interest Earned Cash (315994103) (Cash)",
        "category": "Interest",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 12.88,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256511316114035428",
        "date": "2026-09-30",
        "merchant": "Reinvestment Cash (315994103) (Cash)",
        "category": "Dividends & Capital Gains",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 12.88,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505891041857798",
        "date": "2026-09-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 268.98,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505891041857797",
        "date": "2026-09-30",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 216.94,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505891041857796",
        "date": "2026-09-30",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 0.41,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505891041857795",
        "date": "2026-09-30",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 268.98,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505891041857794",
        "date": "2026-09-30",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 436.61,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505891041857793",
        "date": "2026-09-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 436.61,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505891041857792",
        "date": "2026-09-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 0.41,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505891041857791",
        "date": "2026-09-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 216.94,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505890668564691",
        "date": "2026-09-30",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.17,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505890668564690",
        "date": "2026-09-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 639.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505890668564689",
        "date": "2026-09-30",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 860.11,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505890668564688",
        "date": "2026-09-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.17,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505890668564687",
        "date": "2026-09-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 6.54,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505890668564686",
        "date": "2026-09-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 152.39,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505890668564685",
        "date": "2026-09-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 62.18,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505890317291677",
        "date": "2026-09-30",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 1.62,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505890317291676",
        "date": "2026-09-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 1.62,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505890089750601",
        "date": "2026-09-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
        "amount": 0.01,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505890089750600",
        "date": "2026-09-30",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
        "amount": 0.01,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505889755254840",
        "date": "2026-09-30",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 0.33,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505889755254839",
        "date": "2026-09-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 486.45,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505889755254838",
        "date": "2026-09-30",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 194.78,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505889755254837",
        "date": "2026-09-30",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 486.45,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505889755254836",
        "date": "2026-09-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 194.78,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505889755254835",
        "date": "2026-09-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 0.33,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505889755254834",
        "date": "2026-09-30",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 115.68,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256505889755254833",
        "date": "2026-09-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 115.68,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256490645984137672",
        "date": "2026-09-30",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256477224452510527",
        "date": "2026-09-30",
        "merchant": "Capital One",
        "category": "Interest",
        "account": "360 Checking (...5441)",
        "amount": 0.09,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256477224170443558",
        "date": "2026-09-30",
        "merchant": "Capital One",
        "category": "Interest",
        "account": "360 Performance Savings (...4275)",
        "amount": 529.77,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256477223885230868",
        "date": "2026-09-30",
        "merchant": "Capital One",
        "category": "Interest",
        "account": "Kids Savings Account (...8421)",
        "amount": 0.28,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256446625554649871",
        "date": "2026-09-30",
        "merchant": "Erco Lig",
        "category": "Paychecks",
        "account": "Primary Checking ...002 (....002)",
        "amount": 5079.3,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256446625554649870",
        "date": "2026-09-30",
        "merchant": "Charles Schwab",
        "category": "Other Income (incl cc reward credits)",
        "account": "Primary Checking ...002 (....002)",
        "amount": 4.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256446625554649869",
        "date": "2026-09-30",
        "merchant": "Charles Schwab",
        "category": "Interest",
        "account": "Primary Checking ...002 (....002)",
        "amount": 0.15,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256437509704667600",
        "date": "2026-09-30",
        "merchant": "PM Pediatrics",
        "category": "Medical + Dentist",
        "account": "T CSP 5914 due 15th ",
        "amount": 30.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256396624651637499",
        "date": "2026-09-30",
        "merchant": "IlPoom",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 127.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256396624651637497",
        "date": "2026-09-30",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927029",
        "date": "2026-09-29",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 11.02,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256409386286076029",
        "date": "2026-09-29",
        "merchant": "Dividend Received as of 2026 09 28 Vanguard Morningstar Total St MKT In... (Vtsax) (Cash)",
        "category": "Dividends & Capital Gains",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 10.08,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256330806168408994",
        "date": "2026-09-29",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
        "amount": 43.45,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256330806168408993",
        "date": "2026-09-29",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
        "amount": 43.45,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256304031423026006",
        "date": "2026-09-29",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 11.02,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256295771522486657",
        "date": "2026-09-29",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "360 Performance Savings (...4275)",
        "amount": 100.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256285747292165064",
        "date": "2026-09-29",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "Primary Checking ...002 (....002)",
        "amount": 710.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256267217540764353",
        "date": "2026-09-29",
        "merchant": "Restricted Stock Deposit",
        "category": "Dividends & Capital Gains",
        "account": "Google Equity Awards (...ards)",
        "amount": 0.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256267217540764352",
        "date": "2026-09-29",
        "merchant": "Restricted Stock Deposit",
        "category": "Dividends & Capital Gains",
        "account": "Google Equity Awards (...ards)",
        "amount": 0.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256267217540764351",
        "date": "2026-09-29",
        "merchant": "Restricted Stock Deposit",
        "category": "Dividends & Capital Gains",
        "account": "Google Equity Awards (...ards)",
        "amount": 0.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-257363950156927042",
        "date": "2026-09-28",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256396624651637498",
        "date": "2026-09-28",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256251685955457937",
        "date": "2026-09-28",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 2.65,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256251685955457936",
        "date": "2026-09-28",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 2.65,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256251685955457935",
        "date": "2026-09-28",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 49.71,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256251685955457934",
        "date": "2026-09-28",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 49.71,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256212829597094410",
        "date": "2026-09-28",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256185341276868908",
        "date": "2026-09-28",
        "merchant": "Google",
        "category": "Shopping",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 92.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256184608625283798",
        "date": "2026-09-28",
        "merchant": "Anthem",
        "category": "Medical + Dentist",
        "account": "Primary Checking ...002 (....002)",
        "amount": 472.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-257363950156927038",
        "date": "2026-09-27",
        "merchant": "Excel Martial Arts",
        "category": "Child Activities",
        "account": "U CSP (...8373) due 15th",
        "amount": 100.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256159700906168601",
        "date": "2026-09-27",
        "merchant": "Monster Mini Golf",
        "category": "Entertainment & Recreation",
        "account": "T CSP 5914 due 15th ",
        "amount": 10.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256159700906168600",
        "date": "2026-09-27",
        "merchant": "Monster Mini Golf",
        "category": "Entertainment & Recreation",
        "account": "T CSP 5914 due 15th ",
        "amount": 31.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456738",
        "date": "2026-09-27",
        "merchant": "Excel Martial Arts",
        "category": "Child Activities",
        "account": "CREDIT CARD (...8373)",
        "amount": 100.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256072495879705529",
        "date": "2026-09-27",
        "merchant": "the YMCA",
        "category": "Child Care",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 107.1,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456750",
        "date": "2026-09-26",
        "merchant": "La Vida Salon",
        "category": "Self care + Grooming",
        "account": "CREDIT CARD (...8373)",
        "amount": 109.65,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456733",
        "date": "2026-09-26",
        "merchant": "CB Pet Market",
        "category": "Mocha",
        "account": "CREDIT CARD (...8373)",
        "amount": 175.6,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121660683867111",
        "date": "2026-09-26",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U Amazon 9598 due 15th",
        "amount": 6.39,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121660683867110",
        "date": "2026-09-26",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U Amazon 9598 due 15th",
        "amount": 25.39,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121660683867109",
        "date": "2026-09-26",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U Amazon 9598 due 15th",
        "amount": 37.26,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121660683867108",
        "date": "2026-09-26",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U Amazon 9598 due 15th",
        "amount": 8.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256069527218442423",
        "date": "2026-09-26",
        "merchant": "Bombay Heritage",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 110.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256033431269953674",
        "date": "2026-09-26",
        "merchant": "CB Pet Market",
        "category": "Mocha",
        "account": "U CSP (...8373) due 15th",
        "amount": 175.6,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256033431269953673",
        "date": "2026-09-26",
        "merchant": "La Vida Salon",
        "category": "Self care + Grooming",
        "account": "U CSP (...8373) due 15th",
        "amount": 109.65,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256033430025293857",
        "date": "2026-09-26",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...9598)",
        "amount": 25.39,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256033430025293856",
        "date": "2026-09-26",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...9598)",
        "amount": 8.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256033430025293855",
        "date": "2026-09-26",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...9598)",
        "amount": 37.26,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256033430025293854",
        "date": "2026-09-26",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...9598)",
        "amount": 6.39,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256221449497891026",
        "date": "2026-09-25",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 61.95,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256221449497891025",
        "date": "2026-09-25",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 61.95,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255960167796461689",
        "date": "2026-09-25",
        "merchant": "Uber Eats",
        "category": "Eating out",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 61.12,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255960167796461688",
        "date": "2026-09-25",
        "merchant": "Uber Eats",
        "category": "Eating out",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 12.7,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255932002303759350",
        "date": "2026-09-25",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "360 Performance Savings (...4275)",
        "amount": 100.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255912395211821192",
        "date": "2026-09-25",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "Primary Checking ...002 (....002)",
        "amount": 4541.95,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255912395211821191",
        "date": "2026-09-25",
        "merchant": "Karina Oliveira De Araujo",
        "category": "Home maintenance",
        "account": "Primary Checking ...002 (....002)",
        "amount": 175.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456731",
        "date": "2026-09-24",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255953003749069163",
        "date": "2026-09-24",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.31,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255953003749069162",
        "date": "2026-09-24",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.31,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255886521118773903",
        "date": "2026-09-24",
        "merchant": "Shake Shack",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 45.54,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255886521118773902",
        "date": "2026-09-24",
        "merchant": "Shake Shack",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 15.79,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255821240958734614",
        "date": "2026-09-24",
        "merchant": "Livingston Public",
        "category": "School stuff + Education",
        "account": "Primary Checking ...002 (....002)",
        "amount": 50.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255789873199862084",
        "date": "2026-09-24",
        "merchant": "the YMCA",
        "category": "Fitness",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 128.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255667151865139609",
        "date": "2026-09-24",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456730",
        "date": "2026-09-23",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456723",
        "date": "2026-09-23",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255758340530393740",
        "date": "2026-09-23",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255758340530393739",
        "date": "2026-09-23",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456727",
        "date": "2026-09-22",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121661254291467",
        "date": "2026-09-22",
        "merchant": "E-ZPass",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 50.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255849554856398910",
        "date": "2026-09-22",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255721504510595691",
        "date": "2026-09-22",
        "merchant": "Columbia Bank",
        "category": "Credit Card + Financial Fees",
        "account": "Primary Checking ...002 (....002)",
        "amount": 64.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255690452100469089",
        "date": "2026-09-22",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 372.46,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255690452100469088",
        "date": "2026-09-22",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 372.46,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255690451730321722",
        "date": "2026-09-22",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 298.15,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255690451730321721",
        "date": "2026-09-22",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 298.15,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255667150533447979",
        "date": "2026-09-22",
        "merchant": "E-ZPass",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 50.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121666967982904",
        "date": "2026-09-21",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U CFF 6579 due 15th",
        "amount": 5.63,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255575992410067706",
        "date": "2026-09-21",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...2344)",
        "amount": 5.63,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255549765498458131",
        "date": "2026-09-21",
        "merchant": "Public Service Enterprise Group",
        "category": "Gas & Electric",
        "account": "Primary Checking ...002 (....002)",
        "amount": 25.37,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121666967982907",
        "date": "2026-09-20",
        "merchant": "Google One",
        "category": "Subscriptions",
        "account": "U CFF 6579 due 15th",
        "amount": 10.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121666967982906",
        "date": "2026-09-20",
        "merchant": "G1ai101a",
        "category": "Subscriptions",
        "account": "U CFF 6579 due 15th",
        "amount": 199.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121666967982905",
        "date": "2026-09-20",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U CFF 6579 due 15th",
        "amount": 30.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121666967982903",
        "date": "2026-09-20",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U CFF 6579 due 15th",
        "amount": 123.39,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121666967982902",
        "date": "2026-09-20",
        "merchant": "GoFundMe",
        "category": "Charity",
        "account": "U CFF 6579 due 15th",
        "amount": 102.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456732",
        "date": "2026-09-20",
        "merchant": "Summit Medical Group PA",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 20.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456728",
        "date": "2026-09-20",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 23.82,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255758338781368635",
        "date": "2026-09-20",
        "merchant": "Google One",
        "category": "Subscriptions",
        "account": "CREDIT CARD (...2344)",
        "amount": 10.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255575992410067708",
        "date": "2026-09-20",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...2344)",
        "amount": 123.39,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255575992410067707",
        "date": "2026-09-20",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...2344)",
        "amount": 30.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255521328934178904",
        "date": "2026-09-20",
        "merchant": "Woofz Petcare",
        "category": "Shopping",
        "account": "T CSP 5914 due 15th ",
        "amount": 6.93,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255521328934178903",
        "date": "2026-09-20",
        "merchant": "Woofz Petcare",
        "category": "Shopping",
        "account": "T CSP 5914 due 15th ",
        "amount": 9.79,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255505056695603589",
        "date": "2026-09-20",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 40.97,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255505056695603588",
        "date": "2026-09-20",
        "merchant": "Disney",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 2.42,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675639031",
        "date": "2026-09-20",
        "merchant": "Summit Medical Group PA",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 20.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591196",
        "date": "2026-09-20",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 23.82,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580408",
        "date": "2026-09-20",
        "merchant": "G1ai101a",
        "category": "Subscriptions",
        "account": "CREDIT CARD (...2344)",
        "amount": 199.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580290",
        "date": "2026-09-20",
        "merchant": "GoFundMe",
        "category": "Charity",
        "account": "CREDIT CARD (...2344)",
        "amount": 102.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255469414452318305",
        "date": "2026-09-20",
        "merchant": "Costco",
        "category": "Groceries",
        "account": "Costco Visa 3744 due 17th",
        "amount": 176.49,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255449055474766620",
        "date": "2026-09-20",
        "merchant": "the YMCA",
        "category": "Child Care",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 107.1,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456719",
        "date": "2026-09-18",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "CREDIT CARD (...8373)",
        "amount": 9.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987970",
        "date": "2026-09-18",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "U CSP (...8373) due 15th",
        "amount": 9.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580462",
        "date": "2026-09-18",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...2344)",
        "amount": 42.15,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580431",
        "date": "2026-09-18",
        "merchant": "Otter",
        "category": "Eating out",
        "account": "CREDIT CARD (...2344)",
        "amount": 52.17,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580421",
        "date": "2026-09-18",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...2344)",
        "amount": 17.05,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255414732603282178",
        "date": "2026-09-18",
        "merchant": "Dividend Received Ishares Core S&p Mid Cap Etf (Ijh) (Cash)",
        "category": "Dividends & Capital Gains",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 111.8,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255414732603282177",
        "date": "2026-09-18",
        "merchant": "Dividend Received Ishares Core S&p Small Cap E (Ijr) (Cash)",
        "category": "Dividends & Capital Gains",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 124.3,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255414732603282176",
        "date": "2026-09-18",
        "merchant": "Purchase Into Core Account Cash (315994103) (Cash)",
        "category": "Dividends & Capital Gains",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 236.1,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255389878127711033",
        "date": "2026-09-18",
        "merchant": "Capital One",
        "category": "Interest",
        "account": "CD (...2555)",
        "amount": 95.38,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255337236051546196",
        "date": "2026-09-18",
        "merchant": "Scream Truck",
        "category": "Eating out",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 18.55,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255335029144047738",
        "date": "2026-09-18",
        "merchant": "Meyer Depew",
        "category": "Home maintenance",
        "account": "T CSP 5914 due 15th ",
        "amount": 39.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255334331011584054",
        "date": "2026-09-18",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U CFF 6579 due 15th",
        "amount": 42.15,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255334331011584053",
        "date": "2026-09-18",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U CFF 6579 due 15th",
        "amount": 17.05,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255334331011584052",
        "date": "2026-09-18",
        "merchant": "OTTER* BERGEN MUNCH",
        "category": "Eating out",
        "account": "U CFF 6579 due 15th",
        "amount": 52.17,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580463",
        "date": "2026-09-17",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "CREDIT CARD (...2344)",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580396",
        "date": "2026-09-17",
        "merchant": "Tony Boy's Sandwich House",
        "category": "Eating out",
        "account": "CREDIT CARD (...2344)",
        "amount": 63.63,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255255304571737074",
        "date": "2026-09-17",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 3.32,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255255304571737073",
        "date": "2026-09-17",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 3.32,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255237583518847892",
        "date": "2026-09-17",
        "merchant": "PM Pediatrics",
        "category": "Medical + Dentist",
        "account": "T CSP 5914 due 15th ",
        "amount": 30.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255237583518847890",
        "date": "2026-09-17",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "T CSP 5914 due 15th ",
        "amount": 22.38,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255236929260901344",
        "date": "2026-09-17",
        "merchant": "Tony Boys Sandwich",
        "category": "Eating out",
        "account": "U CFF 6579 due 15th",
        "amount": 63.63,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255194941766521788",
        "date": "2026-09-17",
        "merchant": "PennyMac",
        "category": "Mortgage",
        "account": "Primary Checking ...002 (....002)",
        "amount": 5933.22,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456717",
        "date": "2026-09-16",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675639080",
        "date": "2026-09-16",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580455",
        "date": "2026-09-16",
        "merchant": "Harrison Nj Garage Fla",
        "category": "Transportation",
        "account": "CREDIT CARD (...2344)",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255236929260901345",
        "date": "2026-09-16",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U CFF 6579 due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255225045877019458",
        "date": "2026-09-16",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.59,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255225045877019457",
        "date": "2026-09-16",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.59,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255146416523465512",
        "date": "2026-09-16",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "T CSP 5914 due 15th ",
        "amount": 27.86,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255145805147034171",
        "date": "2026-09-16",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U CFF 6579 due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456739",
        "date": "2026-09-15",
        "merchant": "Mindful Medicine",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 300.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591072",
        "date": "2026-09-15",
        "merchant": "Mindful Medicine",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 300.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255137596665516420",
        "date": "2026-09-15",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 4.26,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255137596665516419",
        "date": "2026-09-15",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 4.26,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255054827470999572",
        "date": "2026-09-15",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255009508552101929",
        "date": "2026-09-15",
        "merchant": "Erco Lig",
        "category": "Paychecks",
        "account": "Primary Checking ...002 (....002)",
        "amount": 4816.91,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256121665035456736",
        "date": "2026-09-14",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591216",
        "date": "2026-09-14",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580375",
        "date": "2026-09-14",
        "merchant": "Hui Tou Xiang",
        "category": "Eating out",
        "account": "CREDIT CARD (...2344)",
        "amount": 124.91,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255049994542272696",
        "date": "2026-09-14",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 44.99,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255049994542272695",
        "date": "2026-09-14",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 15.66,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255049994542272694",
        "date": "2026-09-14",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 60.65,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254982281026360233",
        "date": "2026-09-14",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Google Equity Awards (...ards)",
        "amount": 302.51,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254981856717984316",
        "date": "2026-09-14",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 37.95,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254981856717984315",
        "date": "2026-09-14",
        "merchant": "Barnes & Noble",
        "category": "Shopping",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 41.56,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254981856717984314",
        "date": "2026-09-14",
        "merchant": "the YMCA",
        "category": "Child Care",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 107.1,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254947408738800034",
        "date": "2026-09-14",
        "merchant": "Hui Tou Xiang",
        "category": "Eating out",
        "account": "U CFF 6579 due 15th",
        "amount": 124.91,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254869324394156425",
        "date": "2026-09-13",
        "merchant": "Deshe Landscaping",
        "category": "Home maintenance",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 459.04,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254869324394156423",
        "date": "2026-09-13",
        "merchant": "Excel Martial Arts",
        "category": "Child Activities",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 100.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254766698143962089",
        "date": "2026-09-12",
        "merchant": "China Chalet",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 104.61,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254766698143962088",
        "date": "2026-09-12",
        "merchant": "Turtle Back Zoo",
        "category": "Entertainment & Recreation",
        "account": "T CSP 5914 due 15th ",
        "amount": 26.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254766698143962087",
        "date": "2026-09-12",
        "merchant": "McDonald's",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 15.55,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254766698143962086",
        "date": "2026-09-12",
        "merchant": "The Milkshake Factor",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 24.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254675752004899735",
        "date": "2026-09-11",
        "merchant": "Domino's",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 26.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254652116626853955",
        "date": "2026-09-11",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "360 Performance Savings (...4275)",
        "amount": 35.16,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254652116626853954",
        "date": "2026-09-11",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "360 Performance Savings (...4275)",
        "amount": 100.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254650403701412757",
        "date": "2026-09-11",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "Primary Checking ...002 (....002)",
        "amount": 5351.95,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254650403701412756",
        "date": "2026-09-11",
        "merchant": "Excel Martial Arts",
        "category": "Child Activities",
        "account": "Primary Checking ...002 (....002)",
        "amount": 357.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456715",
        "date": "2026-09-10",
        "merchant": "SimpliSafe",
        "category": "Home Security",
        "account": "CREDIT CARD (...8373)",
        "amount": 24.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591071",
        "date": "2026-09-10",
        "merchant": "SimpliSafe",
        "category": "Home Security",
        "account": "U CSP (...8373) due 15th",
        "amount": 24.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580334",
        "date": "2026-09-10",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...2344)",
        "amount": 47.82,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254688501430767794",
        "date": "2026-09-10",
        "merchant": "Dividend Received Microsoft Corp (Msft) (Cash)",
        "category": "Dividends & Capital Gains",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 0.55,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254688501430767793",
        "date": "2026-09-10",
        "merchant": "Purchase Into Core Account Cash (315994103) (Cash)",
        "category": "Dividends & Capital Gains",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 0.55,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254606747562955528",
        "date": "2026-09-10",
        "merchant": "Organon & Co Dividend Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Individual Brokerage -9148 (...9148)",
        "amount": 0.08,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254606363032309925",
        "date": "2026-09-10",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 5.26,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254606363032309924",
        "date": "2026-09-10",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 5.26,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254606363032309923",
        "date": "2026-09-10",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 3.25,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254606363032309922",
        "date": "2026-09-10",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 3.25,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254606362750242946",
        "date": "2026-09-10",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 63.2,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254606362750242945",
        "date": "2026-09-10",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 63.2,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254583535279034720",
        "date": "2026-09-10",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U CFF 6579 due 15th",
        "amount": 47.82,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456734",
        "date": "2026-09-09",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638915",
        "date": "2026-09-09",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254493016785965400",
        "date": "2026-09-09",
        "merchant": "ShopRite",
        "category": "Groceries",
        "account": "T CSP 5914 due 15th ",
        "amount": 25.13,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254476721322479620",
        "date": "2026-09-09",
        "merchant": "The New York Times",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 4.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254476721322479618",
        "date": "2026-09-09",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254464212899221877",
        "date": "2026-09-09",
        "merchant": "Verizon",
        "category": "Internet & Cable",
        "account": "Primary Checking ...002 (....002)",
        "amount": 79.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254439245821267974",
        "date": "2026-09-09",
        "merchant": "Fee",
        "category": "Credit Card + Financial Fees",
        "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
        "amount": 1.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254588978092069592",
        "date": "2026-09-08",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254439245287543776",
        "date": "2026-09-08",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 52.22,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254439245287543775",
        "date": "2026-09-08",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 52.22,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254439245287543774",
        "date": "2026-09-08",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 62.68,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254439245287543773",
        "date": "2026-09-08",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 62.68,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254420109557780491",
        "date": "2026-09-08",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254373053342437897",
        "date": "2026-09-08",
        "merchant": "Venmo",
        "category": "Self care + Grooming",
        "account": "Primary Checking ...002 (....002)",
        "amount": 151.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254373053342437895",
        "date": "2026-09-08",
        "merchant": "Xoom",
        "category": "Travel & Vacation",
        "account": "Primary Checking ...002 (....002)",
        "amount": 803.09,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456724",
        "date": "2026-09-07",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 31.53,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456718",
        "date": "2026-09-07",
        "merchant": "Deshe Landscaping",
        "category": "Home maintenance",
        "account": "CREDIT CARD (...8373)",
        "amount": 623.76,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638885",
        "date": "2026-09-07",
        "merchant": "Deshe Landscaping",
        "category": "Home maintenance",
        "account": "U CSP (...8373) due 15th",
        "amount": 623.76,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988279",
        "date": "2026-09-07",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 31.53,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580353",
        "date": "2026-09-07",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...2344)",
        "amount": 43.16,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254476721322479619",
        "date": "2026-09-07",
        "merchant": "American Express",
        "category": "Other Income (incl cc reward credits)",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 100.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254373053342437899",
        "date": "2026-09-07",
        "merchant": "Charles Schwab",
        "category": "Home maintenance",
        "account": "Primary Checking ...002 (....002)",
        "amount": 25.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254373053342437898",
        "date": "2026-09-07",
        "merchant": "Lidiya Rothstein",
        "category": "Child Activities",
        "account": "Primary Checking ...002 (....002)",
        "amount": 25.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254310067036770903",
        "date": "2026-09-07",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U CFF 6579 due 15th",
        "amount": 43.16,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254310066067886627",
        "date": "2026-09-07",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 31.53,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254310066067886626",
        "date": "2026-09-07",
        "merchant": "Deshe Landscaping",
        "category": "Home maintenance",
        "account": "U CSP 9369 due 15th",
        "amount": 623.76,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254289200143684203",
        "date": "2026-09-07",
        "merchant": "Capital One",
        "category": "Interest",
        "account": "Kids Savings Account (...8421)",
        "amount": 25.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256121665035456748",
        "date": "2026-09-06",
        "merchant": "the YMCA",
        "category": "Child Care",
        "account": "CREDIT CARD (...8373)",
        "amount": 107.1,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988320",
        "date": "2026-09-06",
        "merchant": "the YMCA",
        "category": "Child Care",
        "account": "U CSP (...8373) due 15th",
        "amount": 107.1,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254252240485241568",
        "date": "2026-09-06",
        "merchant": "Agricola",
        "category": "Eating out",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 223.17,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254220190024749153",
        "date": "2026-09-06",
        "merchant": "Costco",
        "category": "Groceries",
        "account": "T CSP 5914 due 15th ",
        "amount": 33.97,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254220190024749152",
        "date": "2026-09-06",
        "merchant": "Target",
        "category": "Shopping",
        "account": "T CSP 5914 due 15th ",
        "amount": 28.64,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254220190024749151",
        "date": "2026-09-06",
        "merchant": "Dehart Garage",
        "category": "Transportation",
        "account": "T CSP 5914 due 15th ",
        "amount": 3.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254220190024749150",
        "date": "2026-09-06",
        "merchant": "Costco",
        "category": "Groceries",
        "account": "T CSP 5914 due 15th ",
        "amount": 1492.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254219345883320635",
        "date": "2026-09-06",
        "merchant": "the YMCA",
        "category": "Child Care",
        "account": "U CSP 9369 due 15th",
        "amount": 107.1,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580385",
        "date": "2026-09-05",
        "merchant": "Google One",
        "category": "Subscriptions",
        "account": "CREDIT CARD (...2344)",
        "amount": 18.84,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580364",
        "date": "2026-09-05",
        "merchant": "Google One",
        "category": "Subscriptions",
        "account": "CREDIT CARD (...2344)",
        "amount": 19.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254310067036770902",
        "date": "2026-09-05",
        "merchant": "Google One",
        "category": "Subscriptions",
        "account": "U CFF 6579 due 15th",
        "amount": 18.84,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254308230343709320",
        "date": "2026-09-05",
        "merchant": "American Express",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 3.69,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254141939227055014",
        "date": "2026-09-05",
        "merchant": "Disney",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 8.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254141938989028251",
        "date": "2026-09-05",
        "merchant": "Disney",
        "category": "Subscriptions",
        "account": "U Amex EveryDay 3003 due 5th",
        "amount": 38.37,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254129635781530087",
        "date": "2026-09-05",
        "merchant": "Dunkin'",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 8.39,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254128836986819556",
        "date": "2026-09-05",
        "merchant": "Google One",
        "category": "Subscriptions",
        "account": "U CFF 6579 due 15th",
        "amount": 19.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456745",
        "date": "2026-09-04",
        "merchant": "The Great Greek",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 70.33,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456735",
        "date": "2026-09-04",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988238",
        "date": "2026-09-04",
        "merchant": "The Great Greek",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 70.33,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988108",
        "date": "2026-09-04",
        "merchant": "HARRISON NJ GARAGE",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254086673298117522",
        "date": "2026-09-04",
        "merchant": "Livingston Public",
        "category": "School stuff + Education",
        "account": "Primary Checking ...002 (....002)",
        "amount": 50.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254038905749787296",
        "date": "2026-09-04",
        "merchant": "Veterinary Medical Center",
        "category": "Mocha",
        "account": "T CSP 5914 due 15th ",
        "amount": 87.49,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254038905749787295",
        "date": "2026-09-04",
        "merchant": "Smile Perfection",
        "category": "Medical + Dentist",
        "account": "T CSP 5914 due 15th ",
        "amount": 448.4,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254038035275469529",
        "date": "2026-09-04",
        "merchant": "The Great Greek",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 70.33,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254038035275469528",
        "date": "2026-09-04",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U CSP 9369 due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456746",
        "date": "2026-09-03",
        "merchant": "FirstEnergy",
        "category": "Gas & Electric",
        "account": "CREDIT CARD (...8373)",
        "amount": 488.56,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456714",
        "date": "2026-09-03",
        "merchant": "Chewy",
        "category": "Mocha",
        "account": "CREDIT CARD (...8373)",
        "amount": 69.08,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456711",
        "date": "2026-09-03",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988197",
        "date": "2026-09-03",
        "merchant": "Chewy",
        "category": "Mocha",
        "account": "U CSP (...8373) due 15th",
        "amount": 69.08,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988019",
        "date": "2026-09-03",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987971",
        "date": "2026-09-03",
        "merchant": "FirstEnergy",
        "category": "Gas & Electric",
        "account": "U CSP (...8373) due 15th",
        "amount": 488.56,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437909",
        "date": "2026-09-03",
        "merchant": "E-ZPass",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 50.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254052929334956109",
        "date": "2026-09-03",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 610.26,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254052929334956108",
        "date": "2026-09-03",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 610.26,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254052929334956107",
        "date": "2026-09-03",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 360.91,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254052929334956106",
        "date": "2026-09-03",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 360.91,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254052928713150484",
        "date": "2026-09-03",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.08,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254052928441569280",
        "date": "2026-09-03",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 52.98,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254052928440521727",
        "date": "2026-09-03",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 52.98,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254052927976002525",
        "date": "2026-09-03",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 245.28,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254052927976002524",
        "date": "2026-09-03",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 245.28,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254052927976002523",
        "date": "2026-09-03",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 162.83,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254052927976002522",
        "date": "2026-09-03",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 162.83,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-254038035973821212",
        "date": "2026-09-03",
        "merchant": "E-ZPass",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 50.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254038035275469527",
        "date": "2026-09-03",
        "merchant": "Chewy",
        "category": "Mocha",
        "account": "U CSP 9369 due 15th",
        "amount": 69.08,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253947716906275078",
        "date": "2026-09-03",
        "merchant": "McDonald's",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 36.52,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253946838711292610",
        "date": "2026-09-03",
        "merchant": "FirstEnergy",
        "category": "Gas & Electric",
        "account": "U CSP 9369 due 15th",
        "amount": 488.56,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456740",
        "date": "2026-09-02",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456720",
        "date": "2026-09-02",
        "merchant": "US Postal Service",
        "category": "Shopping",
        "account": "CREDIT CARD (...8373)",
        "amount": 18.09,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591217",
        "date": "2026-09-02",
        "merchant": "US Postal Service",
        "category": "Shopping",
        "account": "U CSP (...8373) due 15th",
        "amount": 18.09,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988321",
        "date": "2026-09-02",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437980",
        "date": "2026-09-02",
        "merchant": "Riker Hill",
        "category": "Child Activities",
        "account": "CREDIT CARD (...6581)",
        "amount": 26.03,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254141939227055015",
        "date": "2026-09-02",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 13.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-254030762687877552",
        "date": "2026-09-02",
        "merchant": "American Express",
        "category": "Other Income (incl cc reward credits)",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 21.31,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253965020909031643",
        "date": "2026-09-02",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 2.33,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253965020909031642",
        "date": "2026-09-02",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 2.33,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253965020909031641",
        "date": "2026-09-02",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.08,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253946840494920554",
        "date": "2026-09-02",
        "merchant": "Riker Hill",
        "category": "Child Activities",
        "account": "U WOH.6581 due 21st",
        "amount": 26.03,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253917791835934865",
        "date": "2026-09-02",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 13.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253861582525190602",
        "date": "2026-09-02",
        "merchant": "Disney",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 21.31,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253856665871864757",
        "date": "2026-09-02",
        "merchant": "Dunkin'",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 5.84,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253855768564486672",
        "date": "2026-09-02",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "U CSP 9369 due 15th",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253855768564486671",
        "date": "2026-09-02",
        "merchant": "US Postal Service",
        "category": "Shopping",
        "account": "U CSP 9369 due 15th",
        "amount": 18.09,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456741",
        "date": "2026-09-01",
        "merchant": "16 Handles",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 25.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456725",
        "date": "2026-09-01",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638914",
        "date": "2026-09-01",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591176",
        "date": "2026-09-01",
        "merchant": "16 Handles",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 25.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253946838711292609",
        "date": "2026-09-01",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U CSP 9369 due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253789746988864174",
        "date": "2026-09-01",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 3.42,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253789746988864173",
        "date": "2026-09-01",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 3.42,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253764474127274762",
        "date": "2026-09-01",
        "merchant": "Harrison Garage",
        "category": "Transportation",
        "account": "U CSP 9369 due 15th",
        "amount": 18.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253764474127274761",
        "date": "2026-09-01",
        "merchant": "16 Handles",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 25.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253741591663498197",
        "date": "2026-09-01",
        "merchant": "Anthem",
        "category": "Medical + Dentist",
        "account": "Primary Checking ...002 (....002)",
        "amount": 157.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456713",
        "date": "2026-08-31",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "CREDIT CARD (...8373)",
        "amount": 3.19,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591119",
        "date": "2026-08-31",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "U CSP (...8373) due 15th",
        "amount": 3.19,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253789747976622876",
        "date": "2026-08-31",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 439.84,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253789747976622875",
        "date": "2026-08-31",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 439.84,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253789747976622874",
        "date": "2026-08-31",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 273.8,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253789747976622873",
        "date": "2026-08-31",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 273.8,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253789746988864176",
        "date": "2026-08-31",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.07,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253789746988864175",
        "date": "2026-08-31",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.07,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253789746414244454",
        "date": "2026-08-31",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 1.53,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253789746414244453",
        "date": "2026-08-31",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 1.53,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253789745816556054",
        "date": "2026-08-31",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 196.22,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253789745816556053",
        "date": "2026-08-31",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 196.22,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253789745816556052",
        "date": "2026-08-31",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 117.75,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253789745816556051",
        "date": "2026-08-31",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 117.75,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253744994208732128",
        "date": "2026-08-31",
        "merchant": "Capital One",
        "category": "Interest",
        "account": "360 Checking (...5441)",
        "amount": 0.1,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253744992860262992",
        "date": "2026-08-31",
        "merchant": "Capital One",
        "category": "Interest",
        "account": "360 Performance Savings (...4275)",
        "amount": 527.91,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253744991465657339",
        "date": "2026-08-31",
        "merchant": "Capital One",
        "category": "Interest",
        "account": "Kids Savings Account (...8421)",
        "amount": 0.25,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253741591663498199",
        "date": "2026-08-31",
        "merchant": "Erco Lig",
        "category": "Paychecks",
        "account": "Primary Checking ...002 (....002)",
        "amount": 4787.55,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253741591663498198",
        "date": "2026-08-31",
        "merchant": "Charles Schwab",
        "category": "Interest",
        "account": "Primary Checking ...002 (....002)",
        "amount": 0.18,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253692726208909907",
        "date": "2026-08-31",
        "merchant": "Interest Earned Cash (315994103) (Cash)",
        "category": "Interest",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 12.79,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253673220476522579",
        "date": "2026-08-31",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "U CSP 9369 due 15th",
        "amount": 3.19,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456749",
        "date": "2026-08-30",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 10.66,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456747",
        "date": "2026-08-30",
        "merchant": "Center Court",
        "category": "Child Activities",
        "account": "CREDIT CARD (...8373)",
        "amount": 35.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456744",
        "date": "2026-08-30",
        "merchant": "Costco",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 250.53,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456742",
        "date": "2026-08-30",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 52.3,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456726",
        "date": "2026-08-30",
        "merchant": "NJ Psychiatric Group",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 20.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456722",
        "date": "2026-08-30",
        "merchant": "the YMCA",
        "category": "Child Care",
        "account": "CREDIT CARD (...8373)",
        "amount": 107.1,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456716",
        "date": "2026-08-30",
        "merchant": "Center Court",
        "category": "Child Activities",
        "account": "CREDIT CARD (...8373)",
        "amount": 35.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638982",
        "date": "2026-08-30",
        "merchant": "NJ Psychiatric Group",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 20.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638789",
        "date": "2026-08-30",
        "merchant": "Center Court",
        "category": "Child Activities",
        "account": "U CSP (...8373) due 15th",
        "amount": 35.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988156",
        "date": "2026-08-30",
        "merchant": "Costco",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 250.53,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988039",
        "date": "2026-08-30",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 52.3,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987922",
        "date": "2026-08-30",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 10.66,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987921",
        "date": "2026-08-30",
        "merchant": "the YMCA",
        "category": "Child Care",
        "account": "U CSP (...8373) due 15th",
        "amount": 107.1,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987853",
        "date": "2026-08-30",
        "merchant": "CenterCourt Chatham",
        "category": "Child Activities",
        "account": "U CSP (...8373) due 15th",
        "amount": 35.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253765318111416817",
        "date": "2026-08-30",
        "merchant": "Annual Hotel",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 100.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253673220476522580",
        "date": "2026-08-30",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 10.66,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253582217369375052",
        "date": "2026-08-30",
        "merchant": "Costco",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 250.53,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253582217369375051",
        "date": "2026-08-30",
        "merchant": "Center Court",
        "category": "Child Activities",
        "account": "U CSP 9369 due 15th",
        "amount": 35.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253582217369375050",
        "date": "2026-08-30",
        "merchant": "NJ Psychiatric Group",
        "category": "Medical + Dentist",
        "account": "U CSP 9369 due 15th",
        "amount": 20.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253582217369375049",
        "date": "2026-08-30",
        "merchant": "the YMCA",
        "category": "Child Care",
        "account": "U CSP 9369 due 15th",
        "amount": 107.1,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253582217369375048",
        "date": "2026-08-30",
        "merchant": "Center Court",
        "category": "Child Activities",
        "account": "U CSP 9369 due 15th",
        "amount": 35.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253582217369375047",
        "date": "2026-08-30",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 52.3,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456737",
        "date": "2026-08-29",
        "merchant": "Grubhub",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 97.85,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456729",
        "date": "2026-08-29",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 13.6,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456721",
        "date": "2026-08-29",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 27.69,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121665035456712",
        "date": "2026-08-29",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 39.23,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675639059",
        "date": "2026-08-29",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 13.6,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638983",
        "date": "2026-08-29",
        "merchant": "Grubhub",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 97.85,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591120",
        "date": "2026-08-29",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 39.23,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987991",
        "date": "2026-08-29",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 27.69,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580315",
        "date": "2026-08-29",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...2344)",
        "amount": 83.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253491752762626538",
        "date": "2026-08-29",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U CFF 6579 due 15th",
        "amount": 83.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253491751849316763",
        "date": "2026-08-29",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 13.6,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253491751849316762",
        "date": "2026-08-29",
        "merchant": "Grubhub",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 97.85,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253491751849316761",
        "date": "2026-08-29",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 39.23,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253491751849316760",
        "date": "2026-08-29",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 27.69,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437836",
        "date": "2026-08-28",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253492543752786659",
        "date": "2026-08-28",
        "merchant": "BJ's Restaurant",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 40.78,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253492543752786658",
        "date": "2026-08-28",
        "merchant": "Ford Motor Company",
        "category": "Transportation",
        "account": "T CSP 5914 due 15th ",
        "amount": 24.09,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253441908554617718",
        "date": "2026-08-28",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 43.63,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253441908554617717",
        "date": "2026-08-28",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 43.63,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253401821500428595",
        "date": "2026-08-28",
        "merchant": "Stop & Shop",
        "category": "Groceries",
        "account": "T CSP 5914 due 15th ",
        "amount": 4.49,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253401821500428593",
        "date": "2026-08-28",
        "merchant": "Chase",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 251.85,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253401065597719471",
        "date": "2026-08-28",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253383136309170751",
        "date": "2026-08-28",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "360 Performance Savings (...4275)",
        "amount": 100.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253365384828703312",
        "date": "2026-08-28",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "Primary Checking ...002 (....002)",
        "amount": 5351.95,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-255484134302437885",
        "date": "2026-08-27",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253375970108002968",
        "date": "2026-08-27",
        "merchant": "Restricted Stock Deposit",
        "category": "Dividends & Capital Gains",
        "account": "Google Equity Awards (...ards)",
        "amount": 0.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253375970108002967",
        "date": "2026-08-27",
        "merchant": "Restricted Stock Deposit",
        "category": "Dividends & Capital Gains",
        "account": "Google Equity Awards (...ards)",
        "amount": 0.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253309514823520580",
        "date": "2026-08-27",
        "merchant": "Miga Sushi",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 101.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253308753223897354",
        "date": "2026-08-27",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327911",
        "date": "2026-08-26",
        "merchant": "Donut Basket",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 21.7,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638845",
        "date": "2026-08-26",
        "merchant": "Donut Basket",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 21.7,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253217482505474884",
        "date": "2026-08-26",
        "merchant": "Donut Basket",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 21.7,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328181",
        "date": "2026-08-25",
        "merchant": "Domino's",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 34.27,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199032",
        "date": "2026-08-25",
        "merchant": "The Week Junior",
        "category": "School stuff + Education",
        "account": "CREDIT CARD (...8373)",
        "amount": 59.95,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675639060",
        "date": "2026-08-25",
        "merchant": "Domino's",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 34.27,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988176",
        "date": "2026-08-25",
        "merchant": "The Week Junior",
        "category": "School stuff + Education",
        "account": "U CSP (...8373) due 15th",
        "amount": 59.95,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253236801822019895",
        "date": "2026-08-25",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 1.19,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253236801822019894",
        "date": "2026-08-25",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 1.19,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-253126221467505414",
        "date": "2026-08-25",
        "merchant": "The Week Junior",
        "category": "School stuff + Education",
        "account": "U CSP 9369 due 15th",
        "amount": 59.95,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253126221467505413",
        "date": "2026-08-25",
        "merchant": "Domino's",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 34.27,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328042",
        "date": "2026-08-24",
        "merchant": "the YMCA",
        "category": "Fitness",
        "account": "CREDIT CARD (...8373)",
        "amount": 128.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987893",
        "date": "2026-08-24",
        "merchant": "the YMCA",
        "category": "Fitness",
        "account": "U CSP (...8373) due 15th",
        "amount": 128.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437792",
        "date": "2026-08-24",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253075806757606072",
        "date": "2026-08-24",
        "merchant": "Venmo",
        "category": "Child Activities",
        "account": "Primary Checking ...002 (....002)",
        "amount": 15.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253035074126631874",
        "date": "2026-08-24",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-253035072524407629",
        "date": "2026-08-24",
        "merchant": "the YMCA",
        "category": "Fitness",
        "account": "U CSP 9369 due 15th",
        "amount": 128.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328061",
        "date": "2026-08-23",
        "merchant": "Etsy",
        "category": "Shopping",
        "account": "CREDIT CARD (...8373)",
        "amount": 253.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199301",
        "date": "2026-08-23",
        "merchant": "Etsy",
        "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
        "account": "CREDIT CARD (...8373)",
        "amount": 29.86,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988088",
        "date": "2026-08-23",
        "merchant": "Etsy",
        "category": "Shopping",
        "account": "U CSP (...8373) due 15th",
        "amount": 29.86,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987854",
        "date": "2026-08-23",
        "merchant": "Etsy",
        "category": "Shopping",
        "account": "U CSP (...8373) due 15th",
        "amount": 253.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252994613850689545",
        "date": "2026-08-23",
        "merchant": "Carrie DiStefano",
        "category": "Mocha",
        "account": "Primary Checking ...002 (....002)",
        "amount": 340.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252944810450112855",
        "date": "2026-08-23",
        "merchant": "AFC South",
        "category": "Medical + Dentist",
        "account": "T CSP 5914 due 15th ",
        "amount": 30.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252944810450112854",
        "date": "2026-08-23",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "T CSP 5914 due 15th ",
        "amount": 15.66,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252944014067127265",
        "date": "2026-08-23",
        "merchant": "Etsy",
        "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
        "account": "U CSP 9369 due 15th",
        "amount": 29.86,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252944014067127264",
        "date": "2026-08-23",
        "merchant": "Etsy",
        "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
        "account": "U CSP 9369 due 15th",
        "amount": 253.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328214",
        "date": "2026-08-22",
        "merchant": "Trader Joe's",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 166.15,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199184",
        "date": "2026-08-22",
        "merchant": "Lavana Reflexology & Day",
        "category": "Self care + Grooming",
        "account": "CREDIT CARD (...8373)",
        "amount": 74.64,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383198987",
        "date": "2026-08-22",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 45.63,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638954",
        "date": "2026-08-22",
        "merchant": "Trader Joe's",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 166.15,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988259",
        "date": "2026-08-22",
        "merchant": "Lavana Reflexology & Day",
        "category": "Self care + Grooming",
        "account": "U CSP (...8373) due 15th",
        "amount": 74.64,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988068",
        "date": "2026-08-22",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 45.63,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252854434784629511",
        "date": "2026-08-22",
        "merchant": "Play It Again Sports",
        "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
        "account": "T CSP 5914 due 15th ",
        "amount": 85.26,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252853570168706017",
        "date": "2026-08-22",
        "merchant": "Trader Joe's",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 166.15,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252853570168706016",
        "date": "2026-08-22",
        "merchant": "Lavana Reflexology & Day",
        "category": "Self care + Grooming",
        "account": "U CSP 9369 due 15th",
        "amount": 74.64,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252853570168706015",
        "date": "2026-08-22",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 45.63,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328259",
        "date": "2026-08-21",
        "merchant": "Mindful Medicine",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 300.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988196",
        "date": "2026-08-21",
        "merchant": "Mindful Medicine",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 300.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580302",
        "date": "2026-08-21",
        "merchant": "Namkeen - Chatham",
        "category": "Eating out",
        "account": "CREDIT CARD (...2344)",
        "amount": 55.8,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252763156576227858",
        "date": "2026-08-21",
        "merchant": "Staples",
        "category": "Shopping",
        "account": "T CSP 5914 due 15th ",
        "amount": 5.67,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252762371980283997",
        "date": "2026-08-21",
        "merchant": "Namkeen",
        "category": "Eating out",
        "account": "U CFF 6579 due 15th",
        "amount": 55.8,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252762369819169729",
        "date": "2026-08-21",
        "merchant": "Mindful Medicine",
        "category": "Medical + Dentist",
        "account": "U CSP 9369 due 15th",
        "amount": 300.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252731450551980498",
        "date": "2026-08-21",
        "merchant": "Public Service Enterprise Group",
        "category": "Gas & Electric",
        "account": "Primary Checking ...002 (....002)",
        "amount": 29.76,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199010",
        "date": "2026-08-20",
        "merchant": "Subway",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 9.95,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987840",
        "date": "2026-08-20",
        "merchant": "Subway",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 9.95,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580297",
        "date": "2026-08-20",
        "merchant": "Nayax",
        "category": "Transportation",
        "account": "CREDIT CARD (...2344)",
        "amount": 4.48,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252853572172533810",
        "date": "2026-08-20",
        "merchant": "Nayax",
        "category": "Transportation",
        "account": "U CFF 6579 due 15th",
        "amount": 4.48,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252763156576227857",
        "date": "2026-08-20",
        "merchant": "Nayax",
        "category": "Transportation",
        "account": "T CSP 5914 due 15th ",
        "amount": 21.14,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252762369819169730",
        "date": "2026-08-20",
        "merchant": "Subway",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 9.95,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252671972856058517",
        "date": "2026-08-20",
        "merchant": "McDonald's",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 10.91,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252671972856058516",
        "date": "2026-08-20",
        "merchant": "Dunkin'",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 18.83,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252671972856058515",
        "date": "2026-08-20",
        "merchant": "Panera Bread",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 6.48,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252671972856058514",
        "date": "2026-08-20",
        "merchant": "Seed Bagel Shop",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 47.24,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252622287356318316",
        "date": "2026-08-19",
        "merchant": "Charles Schwab",
        "category": "Water",
        "account": "Primary Checking ...002 (....002)",
        "amount": 889.01,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252580963866399710",
        "date": "2026-08-19",
        "merchant": "Seven Presidents Park",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 30.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328160",
        "date": "2026-08-18",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "CREDIT CARD (...8373)",
        "amount": 9.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199394",
        "date": "2026-08-18",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 40.32,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199306",
        "date": "2026-08-18",
        "merchant": "CRAVE AND CO RESTAURANT",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 55.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199202",
        "date": "2026-08-18",
        "merchant": "Well Bred",
        "category": "Mocha",
        "account": "CREDIT CARD (...8373)",
        "amount": 9.59,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638996",
        "date": "2026-08-18",
        "merchant": "Well Bred",
        "category": "Mocha",
        "account": "U CSP (...8373) due 15th",
        "amount": 9.59,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638833",
        "date": "2026-08-18",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 40.32,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988045",
        "date": "2026-08-18",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "U CSP (...8373) due 15th",
        "amount": 9.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987880",
        "date": "2026-08-18",
        "merchant": "CRAVE AND CO RESTAURANT",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 55.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252568135222710947",
        "date": "2026-08-18",
        "merchant": "Capital One",
        "category": "Interest",
        "account": "CD (...2555)",
        "amount": 95.07,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-252537392253653337",
        "date": "2026-08-18",
        "merchant": "Anthem",
        "category": "Medical + Dentist",
        "account": "Primary Checking ...002 (....002)",
        "amount": 157.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252537392253653336",
        "date": "2026-08-18",
        "merchant": "Zelle",
        "category": "School stuff + Education",
        "account": "Primary Checking ...002 (....002)",
        "amount": 100.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252489829963026510",
        "date": "2026-08-18",
        "merchant": "Essex Golf",
        "category": "Entertainment & Recreation",
        "account": "T CSP 5914 due 15th ",
        "amount": 10.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252489829963026509",
        "date": "2026-08-18",
        "merchant": "Meyerdpew",
        "category": "Home maintenance",
        "account": "T CSP 5914 due 15th ",
        "amount": 39.9,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252489829963026508",
        "date": "2026-08-18",
        "merchant": "ShopRite",
        "category": "Groceries",
        "account": "T CSP 5914 due 15th ",
        "amount": 2.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252489106165617439",
        "date": "2026-08-18",
        "merchant": "Well Bred",
        "category": "Mocha",
        "account": "U CSP 9369 due 15th",
        "amount": 9.59,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252489106165617438",
        "date": "2026-08-18",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 40.32,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252489106165617437",
        "date": "2026-08-18",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "U CSP 9369 due 15th",
        "amount": 9.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252489106165617436",
        "date": "2026-08-18",
        "merchant": "CRAVE AND CO RESTAURANT",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 55.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328236",
        "date": "2026-08-17",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 68.33,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199094",
        "date": "2026-08-17",
        "merchant": "the YMCA",
        "category": "Child Activities",
        "account": "CREDIT CARD (...8373)",
        "amount": 22.32,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199006",
        "date": "2026-08-17",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 25.98,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638949",
        "date": "2026-08-17",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 68.33,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988158",
        "date": "2026-08-17",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 25.98,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988079",
        "date": "2026-08-17",
        "merchant": "the YMCA",
        "category": "Child Activities",
        "account": "U CSP (...8373) due 15th",
        "amount": 22.32,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252461203333862017",
        "date": "2026-08-17",
        "merchant": "Venmo",
        "category": "Camp",
        "account": "Primary Checking ...002 (....002)",
        "amount": 25.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252461203333862016",
        "date": "2026-08-17",
        "merchant": "Venmo",
        "category": "Camp",
        "account": "Primary Checking ...002 (....002)",
        "amount": 50.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252461203333862015",
        "date": "2026-08-17",
        "merchant": "Venmo",
        "category": "Camp",
        "account": "Primary Checking ...002 (....002)",
        "amount": 75.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252461203333862014",
        "date": "2026-08-17",
        "merchant": "Venmo",
        "category": "Camp",
        "account": "Primary Checking ...002 (....002)",
        "amount": 75.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252461203333862009",
        "date": "2026-08-17",
        "merchant": "PennyMac",
        "category": "Mortgage",
        "account": "Primary Checking ...002 (....002)",
        "amount": 5933.22,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252397009643262131",
        "date": "2026-08-17",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 25.98,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252397009643262130",
        "date": "2026-08-17",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 68.33,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252397009643262128",
        "date": "2026-08-17",
        "merchant": "the YMCA",
        "category": "Child Activities",
        "account": "U CSP 9369 due 15th",
        "amount": 22.32,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199220",
        "date": "2026-08-16",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 35.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675639062",
        "date": "2026-08-16",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 35.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580480",
        "date": "2026-08-16",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...2344)",
        "amount": 63.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252397011474076167",
        "date": "2026-08-16",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U CFF 6579 due 15th",
        "amount": 63.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252305058520650228",
        "date": "2026-08-16",
        "merchant": "Walmart",
        "category": "Shopping",
        "account": "U CSP 9369 due 15th",
        "amount": 35.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327958",
        "date": "2026-08-15",
        "merchant": "Wayfair",
        "category": "Shopping",
        "account": "CREDIT CARD (...8373)",
        "amount": 81.02,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988277",
        "date": "2026-08-15",
        "merchant": "Wayfair",
        "category": "Shopping",
        "account": "U CSP (...8373) due 15th",
        "amount": 81.02,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580449",
        "date": "2026-08-15",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...2344)",
        "amount": 298.54,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484106301264365",
        "date": "2026-08-15",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...9598)",
        "amount": 36.78,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252397006556255220",
        "date": "2026-08-15",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U Amazon 9598 due 15th",
        "amount": 36.78,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252305060209906495",
        "date": "2026-08-15",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U CFF 6579 due 15th",
        "amount": 298.54,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252305058520650229",
        "date": "2026-08-15",
        "merchant": "Wayfair",
        "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
        "account": "U CSP 9369 due 15th",
        "amount": 81.02,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252215112201949804",
        "date": "2026-08-15",
        "merchant": "The Home Depot",
        "category": "Home maintenance",
        "account": "T CSP 5914 due 15th ",
        "amount": 182.02,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437722",
        "date": "2026-08-14",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580426",
        "date": "2026-08-14",
        "merchant": "Google One",
        "category": "Subscriptions",
        "account": "CREDIT CARD (...2344)",
        "amount": 19.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252214253697127015",
        "date": "2026-08-14",
        "merchant": "Google One",
        "category": "Subscriptions",
        "account": "U CFF 6579 due 15th",
        "amount": 19.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252156360839942908",
        "date": "2026-08-14",
        "merchant": "Uber Eats",
        "category": "Eating out",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 112.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252122709038224352",
        "date": "2026-08-14",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252115122988274005",
        "date": "2026-08-14",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "360 Performance Savings (...4275)",
        "amount": 35.17,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-252115122988274004",
        "date": "2026-08-14",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "360 Performance Savings (...4275)",
        "amount": 100.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-252093113305682272",
        "date": "2026-08-14",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "Primary Checking ...002 (....002)",
        "amount": 5351.94,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-252093113305682271",
        "date": "2026-08-14",
        "merchant": "Zelle",
        "category": "Home maintenance",
        "account": "Primary Checking ...002 (....002)",
        "amount": 175.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252093113305682270",
        "date": "2026-08-14",
        "merchant": "ERCO",
        "category": "Paychecks",
        "account": "Primary Checking ...002 (....002)",
        "amount": 4787.55,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-252045500347863225",
        "date": "2026-08-14",
        "merchant": "Nest",
        "category": "Subscriptions",
        "account": "Costco Visa 3744 due 17th",
        "amount": 100.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437708",
        "date": "2026-08-13",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252154752584405019",
        "date": "2026-08-13",
        "merchant": "Dividend Received Apple Inc (Aapl) (Cash)",
        "category": "Dividends & Capital Gains",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 0.3,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-252154752584405018",
        "date": "2026-08-13",
        "merchant": "Purchase Into Core Account Cash (315994103) (Cash)",
        "category": "Dividends & Capital Gains",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 0.3,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-252152966866817503",
        "date": "2026-08-13",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 282.63,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-252152966866817502",
        "date": "2026-08-13",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 282.63,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256121714098328276",
        "date": "2026-08-12",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988104",
        "date": "2026-08-12",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437893",
        "date": "2026-08-12",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252210537217675810",
        "date": "2026-08-12",
        "merchant": "American Express",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 3.56,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252122709038224351",
        "date": "2026-08-12",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-252026150200037642",
        "date": "2026-08-12",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251935856524808518",
        "date": "2026-08-12",
        "merchant": "New York Times",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 4.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251931693794480797",
        "date": "2026-08-12",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "U CSP 9369 due 15th",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327862",
        "date": "2026-08-11",
        "merchant": "Shake Shack",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 30.85,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988183",
        "date": "2026-08-11",
        "merchant": "Shake Shack",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 30.85,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251931693794480798",
        "date": "2026-08-11",
        "merchant": "Shake Shack",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 30.85,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251898111317267333",
        "date": "2026-08-11",
        "merchant": "Excel Martial Arts",
        "category": "Child Activities",
        "account": "Primary Checking ...002 (....002)",
        "amount": 357.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251898111317267332",
        "date": "2026-08-11",
        "merchant": "Zelle",
        "category": "School stuff + Education",
        "account": "Primary Checking ...002 (....002)",
        "amount": 100.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327993",
        "date": "2026-08-10",
        "merchant": "The Milkshake Factor",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 19.72,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199367",
        "date": "2026-08-10",
        "merchant": "SimpliSafe",
        "category": "Home Security",
        "account": "CREDIT CARD (...8373)",
        "amount": 24.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675639026",
        "date": "2026-08-10",
        "merchant": "SimpliSafe",
        "category": "Home Security",
        "account": "U CSP (...8373) due 15th",
        "amount": 24.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987966",
        "date": "2026-08-10",
        "merchant": "The Milkshake Factor",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 19.72,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580398",
        "date": "2026-08-10",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...2344)",
        "amount": 48.95,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251837125830923160",
        "date": "2026-08-10",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U CFF 6579 due 15th",
        "amount": 48.95,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251837124310487855",
        "date": "2026-08-10",
        "merchant": "The Milkshake Factor",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 19.72,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251749507845870571",
        "date": "2026-08-10",
        "merchant": "Verizon",
        "category": "Internet & Cable",
        "account": "Primary Checking ...002 (....002)",
        "amount": 79.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251749507845870570",
        "date": "2026-08-10",
        "merchant": "Livingston Public",
        "category": "School stuff + Education",
        "account": "Primary Checking ...002 (....002)",
        "amount": 12.95,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251743977536508430",
        "date": "2026-08-10",
        "merchant": "SimpliSafe",
        "category": "Home Security",
        "account": "U CSP 9369 due 15th",
        "amount": 24.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328143",
        "date": "2026-08-09",
        "merchant": "Cookie Cutters",
        "category": "Self care + Grooming",
        "account": "CREDIT CARD (...8373)",
        "amount": 5.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327844",
        "date": "2026-08-09",
        "merchant": "Target",
        "category": "Shopping",
        "account": "CREDIT CARD (...8373)",
        "amount": 41.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199464",
        "date": "2026-08-09",
        "merchant": "RS Berkeley",
        "category": "Child Activities",
        "account": "CREDIT CARD (...8373)",
        "amount": 59.69,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199415",
        "date": "2026-08-09",
        "merchant": "Center Court",
        "category": "Child Activities",
        "account": "CREDIT CARD (...8373)",
        "amount": 525.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199345",
        "date": "2026-08-09",
        "merchant": "the YMCA",
        "category": "Fitness",
        "account": "CREDIT CARD (...8373)",
        "amount": 456.57,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199240",
        "date": "2026-08-09",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 65.61,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638852",
        "date": "2026-08-09",
        "merchant": "Cookie Cutters Livings",
        "category": "Self care + Grooming",
        "account": "U CSP (...8373) due 15th",
        "amount": 5.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591199",
        "date": "2026-08-09",
        "merchant": "RS Berkeley",
        "category": "Child Activities",
        "account": "U CSP (...8373) due 15th",
        "amount": 59.69,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591188",
        "date": "2026-08-09",
        "merchant": "Target",
        "category": "Shopping",
        "account": "U CSP (...8373) due 15th",
        "amount": 41.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591085",
        "date": "2026-08-09",
        "merchant": "CenterCourt Chatham",
        "category": "Child Activities",
        "account": "U CSP (...8373) due 15th",
        "amount": 525.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591066",
        "date": "2026-08-09",
        "merchant": "the YMCA",
        "category": "Camp",
        "account": "U CSP (...8373) due 15th",
        "amount": 456.57,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988218",
        "date": "2026-08-09",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 65.61,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251749507845870573",
        "date": "2026-08-09",
        "merchant": "Charles Schwab",
        "category": "Medical + Dentist",
        "account": "Primary Checking ...002 (....002)",
        "amount": 200.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251743977536508429",
        "date": "2026-08-09",
        "merchant": "CenterCourt Chatham",
        "category": "Child Activities",
        "account": "U CSP 9369 due 15th",
        "amount": 525.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251743977536508428",
        "date": "2026-08-09",
        "merchant": "Target",
        "category": "Shopping",
        "account": "U CSP 9369 due 15th",
        "amount": 41.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251743977536508427",
        "date": "2026-08-09",
        "merchant": "RS Berkeley",
        "category": "Child Activities",
        "account": "U CSP 9369 due 15th",
        "amount": 59.69,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251662289743663718",
        "date": "2026-08-09",
        "merchant": "Deshe Landscaping",
        "category": "Home maintenance",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 459.04,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251652696973004882",
        "date": "2026-08-09",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 65.61,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251652696973004881",
        "date": "2026-08-09",
        "merchant": "Cookie Cutters",
        "category": "Self care + Grooming",
        "account": "U CSP 9369 due 15th",
        "amount": 5.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251652696973004879",
        "date": "2026-08-09",
        "merchant": "the YMCA",
        "category": "Camp",
        "account": "U CSP 9369 due 15th",
        "amount": 456.57,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328084",
        "date": "2026-08-08",
        "merchant": "Mangiabene",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 50.11,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484190328901961",
        "date": "2026-08-08",
        "merchant": "Mangiabene",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 50.11,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251744913748152740",
        "date": "2026-08-08",
        "merchant": "Known Traveler",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 120.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251653633247564218",
        "date": "2026-08-08",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "T CSP 5914 due 15th ",
        "amount": 5.48,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251653633247564217",
        "date": "2026-08-08",
        "merchant": "US Customs Trusted Traveler",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 120.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251653633247564216",
        "date": "2026-08-08",
        "merchant": "Nordstrom Rack",
        "category": "Shopping",
        "account": "T CSP 5914 due 15th ",
        "amount": 119.97,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251653633247564215",
        "date": "2026-08-08",
        "merchant": "AFC South",
        "category": "Medical + Dentist",
        "account": "T CSP 5914 due 15th ",
        "amount": 30.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251653633247564214",
        "date": "2026-08-08",
        "merchant": "ON Inc",
        "category": "Shopping",
        "account": "T CSP 5914 due 15th ",
        "amount": 115.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251653633247564213",
        "date": "2026-08-08",
        "merchant": "Burlington",
        "category": "Shopping",
        "account": "T CSP 5914 due 15th ",
        "amount": 49.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251652696973004880",
        "date": "2026-08-08",
        "merchant": "Mangiabene",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 50.11,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199468",
        "date": "2026-08-07",
        "merchant": "Culligan Water",
        "category": "Home maintenance",
        "account": "CREDIT CARD (...8373)",
        "amount": 585.37,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199180",
        "date": "2026-08-07",
        "merchant": "P M Pediatrics",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 30.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199123",
        "date": "2026-08-07",
        "merchant": "Chewy",
        "category": "Mocha",
        "account": "CREDIT CARD (...8373)",
        "amount": 124.05,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638872",
        "date": "2026-08-07",
        "merchant": "Culligan Water",
        "category": "Home maintenance",
        "account": "U CSP (...8373) due 15th",
        "amount": 585.37,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988304",
        "date": "2026-08-07",
        "merchant": "Chewy",
        "category": "Mocha",
        "account": "U CSP (...8373) due 15th",
        "amount": 124.05,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988294",
        "date": "2026-08-07",
        "merchant": "PM Pediatrics",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 30.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580429",
        "date": "2026-08-07",
        "merchant": "Indian Kitchen & Grill",
        "category": "Eating out",
        "account": "CREDIT CARD (...2344)",
        "amount": 162.55,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251780718343508288",
        "date": "2026-08-07",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 1.51,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251780718343508287",
        "date": "2026-08-07",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 1.51,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251780718343508286",
        "date": "2026-08-07",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 1.77,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251780718343508285",
        "date": "2026-08-07",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 1.77,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251563105074041855",
        "date": "2026-08-07",
        "merchant": "Veterinary Medical Center",
        "category": "Mocha",
        "account": "T CSP 5914 due 15th ",
        "amount": 98.79,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251562160376270967",
        "date": "2026-08-07",
        "merchant": "Indian Kitchen & Grill",
        "category": "Eating out",
        "account": "U CFF 6579 due 15th",
        "amount": 162.55,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251562158090375513",
        "date": "2026-08-07",
        "merchant": "Chewy",
        "category": "Mocha",
        "account": "U CSP 9369 due 15th",
        "amount": 124.05,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251469516887315270",
        "date": "2026-08-07",
        "merchant": "PM Pediatrics",
        "category": "Medical + Dentist",
        "account": "U CSP 9369 due 15th",
        "amount": 30.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251469516887315269",
        "date": "2026-08-07",
        "merchant": "Culligan Water",
        "category": "Home maintenance",
        "account": "U CSP 9369 due 15th",
        "amount": 585.37,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327953",
        "date": "2026-08-06",
        "merchant": "McDonald's",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 4.88,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199392",
        "date": "2026-08-06",
        "merchant": "West Essex OBGYN",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 30.87,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638933",
        "date": "2026-08-06",
        "merchant": "West Essex OBGYN",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 30.87,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988214",
        "date": "2026-08-06",
        "merchant": "McDonald's",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 4.88,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251469516887315272",
        "date": "2026-08-06",
        "merchant": "West Essex OBGYN",
        "category": "Medical + Dentist",
        "account": "U CSP 9369 due 15th",
        "amount": 30.87,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251469516887315271",
        "date": "2026-08-06",
        "merchant": "McDonald's",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 4.88,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328135",
        "date": "2026-08-05",
        "merchant": "Tony Boys Sandwich House",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 55.46,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328021",
        "date": "2026-08-05",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988243",
        "date": "2026-08-05",
        "merchant": "Tony Boys Sandwich House",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 55.46,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988125",
        "date": "2026-08-05",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437872",
        "date": "2026-08-05",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251562158090375512",
        "date": "2026-08-05",
        "merchant": "Mindsoother",
        "category": "Medical + Dentist",
        "account": "U CSP 9369 due 15th",
        "amount": 225.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251424601856824004",
        "date": "2026-08-05",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 604.94,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251424601856824003",
        "date": "2026-08-05",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 604.94,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251424601856824002",
        "date": "2026-08-05",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 353.75,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251424601856824001",
        "date": "2026-08-05",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 353.75,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251424601225581204",
        "date": "2026-08-05",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 243.14,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251424601225581203",
        "date": "2026-08-05",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 243.14,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251424601225581202",
        "date": "2026-08-05",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 159.6,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251424601225581201",
        "date": "2026-08-05",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 159.6,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251374137659379761",
        "date": "2026-08-05",
        "merchant": "Tony Boys Sandwich House",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 55.46,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437924",
        "date": "2026-08-04",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251374139396870634",
        "date": "2026-08-04",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251198643932517295",
        "date": "2026-08-04",
        "merchant": "Public Service Enterprise Group",
        "category": "Gas & Electric",
        "account": "Primary Checking ...002 (....002)",
        "amount": 45.56,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327903",
        "date": "2026-08-03",
        "merchant": "FirstEnergy",
        "category": "Gas & Electric",
        "account": "CREDIT CARD (...8373)",
        "amount": 465.03,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199074",
        "date": "2026-08-03",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 105.48,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988324",
        "date": "2026-08-03",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 105.48,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988028",
        "date": "2026-08-03",
        "merchant": "FirstEnergy",
        "category": "Gas & Electric",
        "account": "U CSP (...8373) due 15th",
        "amount": 465.03,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437849",
        "date": "2026-08-03",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437691",
        "date": "2026-08-03",
        "merchant": "E-ZPass",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 50.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251280224461279974",
        "date": "2026-08-03",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251198643932517299",
        "date": "2026-08-03",
        "merchant": "Venmo",
        "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
        "account": "Primary Checking ...002 (....002)",
        "amount": 25.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251198643932517298",
        "date": "2026-08-03",
        "merchant": "Venmo",
        "category": "Self care + Grooming",
        "account": "Primary Checking ...002 (....002)",
        "amount": 33.6,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251198643932517297",
        "date": "2026-08-03",
        "merchant": "Livingston Public",
        "category": "School stuff + Education",
        "account": "Primary Checking ...002 (....002)",
        "amount": 35.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251198643932517296",
        "date": "2026-08-03",
        "merchant": "TARGET CARD SRVC PAYMENT",
        "category": "Shopping",
        "account": "Primary Checking ...002 (....002)",
        "amount": 191.43,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251186776080142838",
        "date": "2026-08-03",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251186776080142837",
        "date": "2026-08-03",
        "merchant": "E-ZPass",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 50.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251186773501694025",
        "date": "2026-08-03",
        "merchant": "Walmart",
        "category": "Shopping",
        "account": "U CSP 9369 due 15th",
        "amount": 105.48,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251139449793564672",
        "date": "2026-08-03",
        "merchant": "AAA",
        "category": "Transportation",
        "account": "Costco Visa 3744 due 17th",
        "amount": 108.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251093557126386666",
        "date": "2026-08-03",
        "merchant": "FirstEnergy",
        "category": "Gas & Electric",
        "account": "U CSP 9369 due 15th",
        "amount": 465.03,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328241",
        "date": "2026-08-02",
        "merchant": "the YMCA",
        "category": "Child Activities",
        "account": "CREDIT CARD (...8373)",
        "amount": 91.69,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327913",
        "date": "2026-08-02",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 53.62,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199126",
        "date": "2026-08-02",
        "merchant": "DoorDash",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 80.26,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638896",
        "date": "2026-08-02",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 53.62,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591159",
        "date": "2026-08-02",
        "merchant": "the YMCA",
        "category": "Child Activities",
        "account": "U CSP (...8373) due 15th",
        "amount": 91.69,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987984",
        "date": "2026-08-02",
        "merchant": "DoorDash",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 80.26,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251327441938174611",
        "date": "2026-08-02",
        "merchant": "Walmart",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 13.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251197560212443658",
        "date": "2026-08-02",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 13.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251197560212443657",
        "date": "2026-08-02",
        "merchant": "American Express",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 21.31,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251186773501694027",
        "date": "2026-08-02",
        "merchant": "the YMCA",
        "category": "Child Activities",
        "account": "U CSP 9369 due 15th",
        "amount": 91.69,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251186773501694026",
        "date": "2026-08-02",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 53.62,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251142447388184613",
        "date": "2026-08-02",
        "merchant": "Disney",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 21.31,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251093557126386667",
        "date": "2026-08-02",
        "merchant": "DOUGH DASH",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 80.26,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199284",
        "date": "2026-08-01",
        "merchant": "Chewy",
        "category": "Mocha",
        "account": "CREDIT CARD (...8373)",
        "amount": 153.34,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591225",
        "date": "2026-08-01",
        "merchant": "Chewy",
        "category": "Mocha",
        "account": "U CSP (...8373) due 15th",
        "amount": 153.34,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580362",
        "date": "2026-08-01",
        "merchant": "Barnabas Health",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...2344)",
        "amount": 17.82,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251197560212443659",
        "date": "2026-08-01",
        "merchant": "American Express",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 0.13,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251187760564032491",
        "date": "2026-08-01",
        "merchant": "Ike's Bagel Cafe",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 19.92,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251142447388184614",
        "date": "2026-08-01",
        "merchant": "Disney",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 0.13,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251093560411574612",
        "date": "2026-08-01",
        "merchant": "Barnabas Health",
        "category": "Medical + Dentist",
        "account": "U CFF 6579 due 15th",
        "amount": 17.82,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251002791914918902",
        "date": "2026-08-01",
        "merchant": "Chewy",
        "category": "Mocha",
        "account": "U CSP 9369 due 15th",
        "amount": 153.34,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328182",
        "date": "2026-07-31",
        "merchant": "J. Crew",
        "category": "Clothing, Shoes, Jewelry",
        "account": "CREDIT CARD (...8373)",
        "amount": 34.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328040",
        "date": "2026-07-31",
        "merchant": "European Wax Center",
        "category": "Self care + Grooming",
        "account": "CREDIT CARD (...8373)",
        "amount": 5.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199031",
        "date": "2026-07-31",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "CREDIT CARD (...8373)",
        "amount": 3.19,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591116",
        "date": "2026-07-31",
        "merchant": "J. Crew",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP (...8373) due 15th",
        "amount": 34.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987997",
        "date": "2026-07-31",
        "merchant": "European Wax Center",
        "category": "Self care + Grooming",
        "account": "U CSP (...8373) due 15th",
        "amount": 5.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987938",
        "date": "2026-07-31",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "U CSP (...8373) due 15th",
        "amount": 3.19,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580395",
        "date": "2026-07-31",
        "merchant": "Miga Sushi",
        "category": "Eating out",
        "account": "CREDIT CARD (...2344)",
        "amount": 90.4,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251147014228169720",
        "date": "2026-07-31",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 0.17,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147014228169719",
        "date": "2026-07-31",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 0.17,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147014228169718",
        "date": "2026-07-31",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 436.09,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147014228169717",
        "date": "2026-07-31",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 436.09,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147014228169716",
        "date": "2026-07-31",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 272.94,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147014228169715",
        "date": "2026-07-31",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 272.94,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147013871653817",
        "date": "2026-07-31",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.7,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147013871653816",
        "date": "2026-07-31",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.7,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147013664035729",
        "date": "2026-07-31",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 227.78,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147013664035728",
        "date": "2026-07-31",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 227.78,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147013664035727",
        "date": "2026-07-31",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 1.51,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147013664035726",
        "date": "2026-07-31",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 1.51,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147013452223344",
        "date": "2026-07-31",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 193.88,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147013452223343",
        "date": "2026-07-31",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 193.88,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147013452223342",
        "date": "2026-07-31",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 0.87,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147013452223341",
        "date": "2026-07-31",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 0.87,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147013452223340",
        "date": "2026-07-31",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 117.19,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251147013452223339",
        "date": "2026-07-31",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 117.19,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-251093560411574611",
        "date": "2026-07-31",
        "merchant": "Miga Sushi",
        "category": "Eating out",
        "account": "U CFF 6579 due 15th",
        "amount": 90.4,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251093557126386672",
        "date": "2026-07-31",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "U CSP 9369 due 15th",
        "amount": 3.19,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251093557126386671",
        "date": "2026-07-31",
        "merchant": "J. Crew",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP 9369 due 15th",
        "amount": 34.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-251093557126386670",
        "date": "2026-07-31",
        "merchant": "European Wax Center",
        "category": "Self care + Grooming",
        "account": "U CSP 9369 due 15th",
        "amount": 5.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250952938792964252",
        "date": "2026-07-31",
        "merchant": "Interest Earned Cash (315994103) (Cash)",
        "category": "Interest",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 12.77,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250952938792964251",
        "date": "2026-07-31",
        "merchant": "Reinvestment Cash (315994103) (Cash)",
        "category": "Dividends & Capital Gains",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 12.77,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250935604744311030",
        "date": "2026-07-31",
        "merchant": "Capital One",
        "category": "Interest",
        "account": "360 Checking (...5441)",
        "amount": 0.1,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250935603471339600",
        "date": "2026-07-31",
        "merchant": "Capital One",
        "category": "Interest",
        "account": "360 Performance Savings (...4275)",
        "amount": 514.34,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250935602153280369",
        "date": "2026-07-31",
        "merchant": "Capital One",
        "category": "Interest",
        "account": "Kids Savings Account (...8421)",
        "amount": 0.25,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250915538952803150",
        "date": "2026-07-31",
        "merchant": "Charles Schwab",
        "category": "Interest",
        "account": "Primary Checking ...002 (....002)",
        "amount": 0.21,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250845421873156779",
        "date": "2026-07-31",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "360 Performance Savings (...4275)",
        "amount": 100.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250821758727770231",
        "date": "2026-07-31",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "Primary Checking ...002 (....002)",
        "amount": 5372.68,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250821758727770230",
        "date": "2026-07-31",
        "merchant": "ERCO",
        "category": "Paychecks",
        "account": "Primary Checking ...002 (....002)",
        "amount": 4787.55,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256121714098327816",
        "date": "2026-07-30",
        "merchant": "Path",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 3.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988154",
        "date": "2026-07-30",
        "merchant": "Path",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 3.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437713",
        "date": "2026-07-30",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580466",
        "date": "2026-07-30",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...2344)",
        "amount": 28.13,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250912672729027020",
        "date": "2026-07-30",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250912671599710559",
        "date": "2026-07-30",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "U CFF 6579 due 15th",
        "amount": 28.13,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250912669528773571",
        "date": "2026-07-30",
        "merchant": "Path",
        "category": "Transportation",
        "account": "U CSP 9369 due 15th",
        "amount": 3.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250878521726489456",
        "date": "2026-07-30",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 7.99,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250878521726489455",
        "date": "2026-07-30",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 7.99,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250821758727770232",
        "date": "2026-07-30",
        "merchant": "Zelle",
        "category": "Home maintenance",
        "account": "Primary Checking ...002 (....002)",
        "amount": 175.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580454",
        "date": "2026-07-29",
        "merchant": "Bubba's",
        "category": "Eating out",
        "account": "CREDIT CARD (...2344)",
        "amount": 58.88,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250913585780773833",
        "date": "2026-07-29",
        "merchant": "The Home Depot",
        "category": "Home maintenance",
        "account": "T CSP 5914 due 15th ",
        "amount": 6.15,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250820515358855769",
        "date": "2026-07-29",
        "merchant": "CityMD",
        "category": "Medical + Dentist",
        "account": "T CSP 5914 due 15th ",
        "amount": 30.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250819553371115865",
        "date": "2026-07-29",
        "merchant": "Bubba's",
        "category": "Eating out",
        "account": "U CFF 6579 due 15th",
        "amount": 58.88,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250734569680556247",
        "date": "2026-07-29",
        "merchant": "Restricted Stock Deposit",
        "category": "Dividends & Capital Gains",
        "account": "Google Equity Awards (...ards)",
        "amount": 0.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250734569680556246",
        "date": "2026-07-29",
        "merchant": "Restricted Stock Deposit",
        "category": "Dividends & Capital Gains",
        "account": "Google Equity Awards (...ards)",
        "amount": 0.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250734569680556245",
        "date": "2026-07-29",
        "merchant": "Restricted Stock Deposit",
        "category": "Dividends & Capital Gains",
        "account": "Google Equity Awards (...ards)",
        "amount": 0.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256121713383199175",
        "date": "2026-07-28",
        "merchant": "Walgreens",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 6.13,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675639052",
        "date": "2026-07-28",
        "merchant": "Walgreens",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 6.13,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437755",
        "date": "2026-07-28",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250725537308758751",
        "date": "2026-07-28",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250725533480407325",
        "date": "2026-07-28",
        "merchant": "Walgreens",
        "category": "Medical + Dentist",
        "account": "U CSP 9369 due 15th",
        "amount": 6.13,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437968",
        "date": "2026-07-27",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250633652787499068",
        "date": "2026-07-27",
        "merchant": "Walgreens",
        "category": "Medical + Dentist",
        "account": "T CSP 5914 due 15th ",
        "amount": 10.12,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250632613037363739",
        "date": "2026-07-27",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328138",
        "date": "2026-07-26",
        "merchant": "Kam Man Supermarket",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 6.48,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328022",
        "date": "2026-07-26",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 9.56,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327957",
        "date": "2026-07-26",
        "merchant": "P M Pediatrics",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 30.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327904",
        "date": "2026-07-26",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 196.18,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199283",
        "date": "2026-07-26",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 66.16,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199120",
        "date": "2026-07-26",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 12.76,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199071",
        "date": "2026-07-26",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 72.74,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675639007",
        "date": "2026-07-26",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 196.18,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638972",
        "date": "2026-07-26",
        "merchant": "PM Pediatrics",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 30.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638828",
        "date": "2026-07-26",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 66.16,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638803",
        "date": "2026-07-26",
        "merchant": "Kam Man Supermarket",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 6.48,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591147",
        "date": "2026-07-26",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 12.76,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987909",
        "date": "2026-07-26",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 9.56,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987832",
        "date": "2026-07-26",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 72.74,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250633652787499067",
        "date": "2026-07-26",
        "merchant": "The Home Depot",
        "category": "Home maintenance",
        "account": "T CSP 5914 due 15th ",
        "amount": 21.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250632611373273495",
        "date": "2026-07-26",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 12.76,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250632611373273494",
        "date": "2026-07-26",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 9.56,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250632611373273493",
        "date": "2026-07-26",
        "merchant": "P M Pediatrics",
        "category": "Medical + Dentist",
        "account": "U CSP 9369 due 15th",
        "amount": 30.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250540688525513033",
        "date": "2026-07-26",
        "merchant": "Kam Man Supermarket",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 6.48,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250540688525513032",
        "date": "2026-07-26",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 72.74,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250540688525513031",
        "date": "2026-07-26",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 196.18,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250540688525513029",
        "date": "2026-07-26",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 66.16,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199125",
        "date": "2026-07-25",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 46.9,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383198986",
        "date": "2026-07-25",
        "merchant": "ShopRite",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 40.05,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988155",
        "date": "2026-07-25",
        "merchant": "ShopRite",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 40.05,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988050",
        "date": "2026-07-25",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 46.9,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580379",
        "date": "2026-07-25",
        "merchant": "Amazon Kids+",
        "category": "Subscriptions",
        "account": "CREDIT CARD (...2344)",
        "amount": 37.32,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250541705091633573",
        "date": "2026-07-25",
        "merchant": "Ike's Bagel Cafe",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 1.82,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250540688525513030",
        "date": "2026-07-25",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 46.9,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250494180366242470",
        "date": "2026-07-25",
        "merchant": "Best Buy",
        "category": "Shopping",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 1727.3,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250448889688641693",
        "date": "2026-07-25",
        "merchant": "Aldi",
        "category": "Groceries",
        "account": "T CSP 5914 due 15th ",
        "amount": 10.84,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250447969907134698",
        "date": "2026-07-25",
        "merchant": "Amazon Kids+",
        "category": "Subscriptions",
        "account": "U CFF 6579 due 15th",
        "amount": 37.32,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250447967053959656",
        "date": "2026-07-25",
        "merchant": "ShopRite",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 40.05,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250355499140666362",
        "date": "2026-07-25",
        "merchant": "Kearny Bank",
        "category": "Cash & ATM",
        "account": "Primary Checking ...002 (....002)",
        "amount": 800.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328238",
        "date": "2026-07-24",
        "merchant": "the YMCA",
        "category": "Fitness",
        "account": "CREDIT CARD (...8373)",
        "amount": 128.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328041",
        "date": "2026-07-24",
        "merchant": "Starbucks",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 6.18,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199030",
        "date": "2026-07-24",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 71.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591160",
        "date": "2026-07-24",
        "merchant": "the YMCA",
        "category": "Fitness",
        "account": "U CSP (...8373) due 15th",
        "amount": 128.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987996",
        "date": "2026-07-24",
        "merchant": "Starbucks",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 6.18,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987939",
        "date": "2026-07-24",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 71.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250447967053959660",
        "date": "2026-07-24",
        "merchant": "the YMCA",
        "category": "Fitness",
        "account": "U CSP 9369 due 15th",
        "amount": 128.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250447967053959658",
        "date": "2026-07-24",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "U CSP 9369 due 15th",
        "amount": 71.25,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250447967053959657",
        "date": "2026-07-24",
        "merchant": "Starbucks",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 6.18,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328215",
        "date": "2026-07-23",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 1.04,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327912",
        "date": "2026-07-23",
        "merchant": "McDonald's",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 8.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199182",
        "date": "2026-07-23",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 15.84,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675639051",
        "date": "2026-07-23",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 1.04,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638895",
        "date": "2026-07-23",
        "merchant": "McDonald's",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 8.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591146",
        "date": "2026-07-23",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 15.84,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250447967053959659",
        "date": "2026-07-23",
        "merchant": "McDonald's",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 8.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250268066952794901",
        "date": "2026-07-23",
        "merchant": "Swiggy",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 11.9,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250267243902423453",
        "date": "2026-07-23",
        "merchant": "Uber",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 1.04,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250267243902423452",
        "date": "2026-07-23",
        "merchant": "Uber",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 15.84,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328258",
        "date": "2026-07-22",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 2.19,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328064",
        "date": "2026-07-22",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 4.7,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199303",
        "date": "2026-07-22",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 1.84,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638971",
        "date": "2026-07-22",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 1.84,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638804",
        "date": "2026-07-22",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 2.19,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987910",
        "date": "2026-07-22",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 4.7,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250176509549498510",
        "date": "2026-07-22",
        "merchant": "Swiggy",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 6.27,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250175620088615847",
        "date": "2026-07-22",
        "merchant": "Uber",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 4.7,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250175620088615846",
        "date": "2026-07-22",
        "merchant": "Uber",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 1.84,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250175620088615845",
        "date": "2026-07-22",
        "merchant": "Uber",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 2.19,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250157709589500416",
        "date": "2026-07-22",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.93,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250157709589500415",
        "date": "2026-07-22",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.93,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250157709589500414",
        "date": "2026-07-22",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 8.6,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250157709589500413",
        "date": "2026-07-22",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 8.6,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250157709303239144",
        "date": "2026-07-22",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 39.93,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250157709303239143",
        "date": "2026-07-22",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 39.93,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-250120633510810019",
        "date": "2026-07-22",
        "merchant": "American Express",
        "category": "Credit Card + Financial Fees",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 895.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199203",
        "date": "2026-07-21",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 1.74,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199008",
        "date": "2026-07-21",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 4.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675639008",
        "date": "2026-07-21",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 1.74,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987833",
        "date": "2026-07-21",
        "merchant": "Uber",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 4.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250176509549498509",
        "date": "2026-07-21",
        "merchant": "Swiggy",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 0.02,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250083589738746155",
        "date": "2026-07-21",
        "merchant": "Swiggy",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 5.89,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250083589738746154",
        "date": "2026-07-21",
        "merchant": "Swiggy",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 0.02,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250082665090798413",
        "date": "2026-07-21",
        "merchant": "Uber",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 4.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250082665090798412",
        "date": "2026-07-21",
        "merchant": "Uber",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 1.74,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328183",
        "date": "2026-07-20",
        "merchant": "Hilton",
        "category": "Travel & Vacation",
        "account": "CREDIT CARD (...8373)",
        "amount": 752.85,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591115",
        "date": "2026-07-20",
        "merchant": "Hilton Manyata",
        "category": "Travel & Vacation",
        "account": "U CSP (...8373) due 15th",
        "amount": 752.85,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-250540688525513028",
        "date": "2026-07-20",
        "merchant": "Hilton",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 752.85,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249990220830233467",
        "date": "2026-07-20",
        "merchant": "Meyer Depew",
        "category": "Home maintenance",
        "account": "T CSP 5914 due 15th ",
        "amount": 39.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249990220830233466",
        "date": "2026-07-20",
        "merchant": "Bombay Brassiere",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 55.49,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249895689433666474",
        "date": "2026-07-20",
        "merchant": "Advisor Fee",
        "category": "Credit Card + Financial Fees",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 336.72,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249895689433666473",
        "date": "2026-07-20",
        "merchant": "Sweep Out",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 336.72,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-249895689237582749",
        "date": "2026-07-20",
        "merchant": "Sweep Out",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 586.66,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-249895689237582748",
        "date": "2026-07-20",
        "merchant": "Advisor Fee",
        "category": "Credit Card + Financial Fees",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 586.66,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249895688905184136",
        "date": "2026-07-20",
        "merchant": "Advisor Fee",
        "category": "Credit Card + Financial Fees",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 408.57,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249895688905184135",
        "date": "2026-07-20",
        "merchant": "Sweep Out",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 408.57,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256121713383199395",
        "date": "2026-07-18",
        "merchant": "Taj Madikeri Resort And",
        "category": "Travel & Vacation",
        "account": "CREDIT CARD (...8373)",
        "amount": 56.33,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199307",
        "date": "2026-07-18",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "CREDIT CARD (...8373)",
        "amount": 9.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199004",
        "date": "2026-07-18",
        "merchant": "Taj Madikeri Resort And",
        "category": "Travel & Vacation",
        "account": "CREDIT CARD (...8373)",
        "amount": 43.63,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638827",
        "date": "2026-07-18",
        "merchant": "Taj Madikeri Resort And",
        "category": "Travel & Vacation",
        "account": "U CSP (...8373) due 15th",
        "amount": 56.33,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988175",
        "date": "2026-07-18",
        "merchant": "Taj Madikeri Resort And",
        "category": "Travel & Vacation",
        "account": "U CSP (...8373) due 15th",
        "amount": 43.63,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987883",
        "date": "2026-07-18",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "U CSP (...8373) due 15th",
        "amount": 9.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249804766116860314",
        "date": "2026-07-18",
        "merchant": "Taj Madikeri Resort And",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 56.33,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249804766116860313",
        "date": "2026-07-18",
        "merchant": "Taj Madikeri Resort And",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 43.63,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249804766116860312",
        "date": "2026-07-18",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "U CSP 9369 due 15th",
        "amount": 9.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249756335829701001",
        "date": "2026-07-18",
        "merchant": "Capital One",
        "category": "Interest",
        "account": "CD (...2555)",
        "amount": 91.72,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-249627397660889193",
        "date": "2026-07-17",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 2.45,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-249627397660889192",
        "date": "2026-07-17",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 2.45,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-249627397660889191",
        "date": "2026-07-17",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 357.41,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-249627397487874132",
        "date": "2026-07-17",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 585.96,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-249627397346316346",
        "date": "2026-07-17",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 408.58,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-249573391147225103",
        "date": "2026-07-17",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "360 Performance Savings (...4275)",
        "amount": 100.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-249573391147225102",
        "date": "2026-07-17",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "360 Performance Savings (...4275)",
        "amount": 35.17,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-249561866896429739",
        "date": "2026-07-17",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "Primary Checking ...002 (....002)",
        "amount": 5351.94,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-249561866896429735",
        "date": "2026-07-17",
        "merchant": "PennyMac",
        "category": "Mortgage",
        "account": "Primary Checking ...002 (....002)",
        "amount": 5933.22,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249623736663692122",
        "date": "2026-07-16",
        "merchant": "Uber",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 2.34,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249623736663692121",
        "date": "2026-07-16",
        "merchant": "Uber",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 2.88,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328161",
        "date": "2026-07-15",
        "merchant": "Hilton",
        "category": "Travel & Vacation",
        "account": "CREDIT CARD (...8373)",
        "amount": 330.9,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988049",
        "date": "2026-07-15",
        "merchant": "Hilton",
        "category": "Travel & Vacation",
        "account": "U CSP (...8373) due 15th",
        "amount": 330.9,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249804766116860315",
        "date": "2026-07-15",
        "merchant": "Hilton Manyata",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 330.9,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249579131685589435",
        "date": "2026-07-15",
        "merchant": "New York Times",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 4.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249451250809590511",
        "date": "2026-07-15",
        "merchant": "ERCO",
        "category": "Paychecks",
        "account": "Primary Checking ...002 (....002)",
        "amount": 4787.55,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256121714098328067",
        "date": "2026-07-14",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "CREDIT CARD (...8373)",
        "amount": 31.98,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987858",
        "date": "2026-07-14",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "U CSP (...8373) due 15th",
        "amount": 31.98,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249530583913877936",
        "date": "2026-07-14",
        "merchant": "VIOLOGIKO_CHORIO_MITRP",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 10.65,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249530583913877935",
        "date": "2026-07-14",
        "merchant": "Homed ID Polyiatrio PC",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 114.47,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249530583913877934",
        "date": "2026-07-14",
        "merchant": "Ssp Hellas",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 15.11,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249530583913877933",
        "date": "2026-07-14",
        "merchant": "Filippeou F Co EE",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 108.75,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249530583913877932",
        "date": "2026-07-14",
        "merchant": "Ergon Bake House",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 39.49,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249530583913877931",
        "date": "2026-07-14",
        "merchant": "FARMakeio Konstantinou",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 16.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249438654322725778",
        "date": "2026-07-14",
        "merchant": "Hercules Greek Sou",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 19.46,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249438654322725777",
        "date": "2026-07-14",
        "merchant": "Uber",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 3.01,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249438654322725776",
        "date": "2026-07-14",
        "merchant": "Uber",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 47.96,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249438654322725775",
        "date": "2026-07-14",
        "merchant": "Uber",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 5.01,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249438654322725774",
        "date": "2026-07-14",
        "merchant": "Uber",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 65.18,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249438102974124837",
        "date": "2026-07-14",
        "merchant": "Apple",
        "category": "Subscriptions",
        "account": "U CSP 9369 due 15th",
        "amount": 31.98,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328233",
        "date": "2026-07-13",
        "merchant": "KOKKINI PIPERIA MARKOP",
        "category": "Travel & Vacation",
        "account": "CREDIT CARD (...8373)",
        "amount": 8.02,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327994",
        "date": "2026-07-13",
        "merchant": "Avolta",
        "category": "Travel & Vacation",
        "account": "CREDIT CARD (...8373)",
        "amount": 13.64,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327961",
        "date": "2026-07-13",
        "merchant": "KOKKINI PIPERIA MARKOP",
        "category": "Travel & Vacation",
        "account": "CREDIT CARD (...8373)",
        "amount": 33.7,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638938",
        "date": "2026-07-13",
        "merchant": "KOKKINI PIPERIA MARKOP",
        "category": "Travel & Vacation",
        "account": "U CSP (...8373) due 15th",
        "amount": 8.02,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988274",
        "date": "2026-07-13",
        "merchant": "KOKKINI PIPERIA MARKOP",
        "category": "Travel & Vacation",
        "account": "U CSP (...8373) due 15th",
        "amount": 33.7,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987968",
        "date": "2026-07-13",
        "merchant": "Avolta",
        "category": "Travel & Vacation",
        "account": "U CSP (...8373) due 15th",
        "amount": 13.64,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249438654322725773",
        "date": "2026-07-13",
        "merchant": "Detto Travel",
        "category": "Travel & Vacation",
        "account": "T CSP 5914 due 15th ",
        "amount": 202.65,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249438102974124839",
        "date": "2026-07-13",
        "merchant": "KOKKINI PIPERIA MARKOP",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 8.02,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249438102974124838",
        "date": "2026-07-13",
        "merchant": "KOKKINI PIPERIA MARKOP",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 33.7,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249332873879376255",
        "date": "2026-07-13",
        "merchant": "Avolta",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 13.64,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249295953769025930",
        "date": "2026-07-13",
        "merchant": "Uber",
        "category": "Travel & Vacation",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 66.98,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249223151555727425",
        "date": "2026-07-13",
        "merchant": "Excel Martial Arts",
        "category": "Child Activities",
        "account": "Primary Checking ...002 (....002)",
        "amount": 357.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249223151555727424",
        "date": "2026-07-13",
        "merchant": "Venmo",
        "category": "Self care + Grooming",
        "account": "Primary Checking ...002 (....002)",
        "amount": 10.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328279",
        "date": "2026-07-12",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 34.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327863",
        "date": "2026-07-12",
        "merchant": "Ulta Beauty",
        "category": "Shopping",
        "account": "CREDIT CARD (...8373)",
        "amount": 71.44,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327845",
        "date": "2026-07-12",
        "merchant": "A. Saily",
        "category": "Travel & Vacation",
        "account": "CREDIT CARD (...8373)",
        "amount": 23.24,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199365",
        "date": "2026-07-12",
        "merchant": "Deshe Landscaping",
        "category": "Home maintenance",
        "account": "CREDIT CARD (...8373)",
        "amount": 459.04,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675639016",
        "date": "2026-07-12",
        "merchant": "Deshe Landscaping",
        "category": "Home maintenance",
        "account": "U CSP (...8373) due 15th",
        "amount": 459.04,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591179",
        "date": "2026-07-12",
        "merchant": "A. Saily",
        "category": "Travel & Vacation",
        "account": "U CSP (...8373) due 15th",
        "amount": 23.24,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988186",
        "date": "2026-07-12",
        "merchant": "Ulta Beauty",
        "category": "Shopping",
        "account": "U CSP (...8373) due 15th",
        "amount": 71.44,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988094",
        "date": "2026-07-12",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 34.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580338",
        "date": "2026-07-12",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...2344)",
        "amount": 21.67,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249333385825636501",
        "date": "2026-07-12",
        "merchant": "Jersey Reserve",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 7.76,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249332873879376257",
        "date": "2026-07-12",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 34.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249332873879376256",
        "date": "2026-07-12",
        "merchant": "Ulta Beauty",
        "category": "Shopping",
        "account": "U CSP 9369 due 15th",
        "amount": 71.44,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249241106945429716",
        "date": "2026-07-12",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "U CFF 6579 due 15th",
        "amount": 21.67,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249241104035632008",
        "date": "2026-07-12",
        "merchant": "Deshe Landscaping",
        "category": "Home Improvement",
        "account": "U CSP 9369 due 15th",
        "amount": 459.04,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249241104035632007",
        "date": "2026-07-12",
        "merchant": "a.saily",
        "category": "Travel & Vacation",
        "account": "U CSP 9369 due 15th",
        "amount": 23.24,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328141",
        "date": "2026-07-11",
        "merchant": "Diana's Nail & Spa",
        "category": "Self care + Grooming",
        "account": "CREDIT CARD (...8373)",
        "amount": 38.3,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328087",
        "date": "2026-07-11",
        "merchant": "Donut Basket",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 26.2,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199348",
        "date": "2026-07-11",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 27.68,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199239",
        "date": "2026-07-11",
        "merchant": "European Wax Center",
        "category": "Self care + Grooming",
        "account": "CREDIT CARD (...8373)",
        "amount": 25.8,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675639083",
        "date": "2026-07-11",
        "merchant": "Donut Basket",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 26.2,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638856",
        "date": "2026-07-11",
        "merchant": "Dianas Nail & Spa",
        "category": "Self care + Grooming",
        "account": "U CSP (...8373) due 15th",
        "amount": 38.3,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591061",
        "date": "2026-07-11",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 27.68,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988229",
        "date": "2026-07-11",
        "merchant": "European Wax Center",
        "category": "Self care + Grooming",
        "account": "U CSP (...8373) due 15th",
        "amount": 25.8,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580369",
        "date": "2026-07-11",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...2344)",
        "amount": 17.07,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580354",
        "date": "2026-07-11",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...2344)",
        "amount": 5.32,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249362915261960263",
        "date": "2026-07-11",
        "merchant": "China Chalet",
        "category": "Eating out",
        "account": "Costco Visa 3744 due 17th",
        "amount": 94.33,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249241104035632006",
        "date": "2026-07-11",
        "merchant": "Dianas Nail & Spa",
        "category": "Self care + Grooming",
        "account": "U CSP 9369 due 15th",
        "amount": 38.3,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249241104035632005",
        "date": "2026-07-11",
        "merchant": "Donut Basket",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 26.2,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249241104035632002",
        "date": "2026-07-11",
        "merchant": "European Wax Center",
        "category": "Self care + Grooming",
        "account": "U CSP 9369 due 15th",
        "amount": 25.8,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249241104035632001",
        "date": "2026-07-11",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 27.68,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249149949875868297",
        "date": "2026-07-11",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "U CFF 6579 due 15th",
        "amount": 5.32,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249149949875868296",
        "date": "2026-07-11",
        "merchant": "CVS",
        "category": "Medical + Dentist",
        "account": "U CFF 6579 due 15th",
        "amount": 17.07,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249119035827442057",
        "date": "2026-07-11",
        "merchant": "Costco",
        "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
        "account": "Costco Visa 3744 due 17th",
        "amount": 319.86,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199466",
        "date": "2026-07-10",
        "merchant": "La Vida Salon",
        "category": "Self care + Grooming",
        "account": "CREDIT CARD (...8373)",
        "amount": 193.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199416",
        "date": "2026-07-10",
        "merchant": "SimpliSafe",
        "category": "Home Security",
        "account": "CREDIT CARD (...8373)",
        "amount": 24.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591202",
        "date": "2026-07-10",
        "merchant": "La Vida Salon",
        "category": "Self care + Grooming",
        "account": "U CSP (...8373) due 15th",
        "amount": 193.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591078",
        "date": "2026-07-10",
        "merchant": "SimpliSafe",
        "category": "Home Security",
        "account": "U CSP (...8373) due 15th",
        "amount": 24.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249241515354247239",
        "date": "2026-07-10",
        "merchant": "The Milkshake Factor",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 35.38,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249241104035632004",
        "date": "2026-07-10",
        "merchant": "SimpliSafe",
        "category": "Home Security",
        "account": "U CSP 9369 due 15th",
        "amount": 24.51,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249241104035632003",
        "date": "2026-07-10",
        "merchant": "La Vida Salon",
        "category": "Self care + Grooming",
        "account": "U CSP 9369 due 15th",
        "amount": 193.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249034180698592011",
        "date": "2026-07-10",
        "merchant": "Dividend Received Invesco QQQ Tr Unit Ser 1 (Qqq) (Cash)",
        "category": "Dividends & Capital Gains",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 0.81,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-249034180698592010",
        "date": "2026-07-10",
        "merchant": "Purchase Into Core Account Cash (315994103) (Cash)",
        "category": "Cash & ATM",
        "account": "Joint WROS - TOD (...3919)",
        "amount": 0.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249031710878486900",
        "date": "2026-07-10",
        "merchant": "Uber Eats",
        "category": "Eating out",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 21.73,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248999632987247238",
        "date": "2026-07-10",
        "merchant": "Zelle",
        "category": "Other Income (incl cc reward credits)",
        "account": "Primary Checking ...002 (....002)",
        "amount": 266.6,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256121713383199391",
        "date": "2026-07-09",
        "merchant": "J. Crew",
        "category": "Clothing, Shoes, Jewelry",
        "account": "CREDIT CARD (...8373)",
        "amount": 96.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638918",
        "date": "2026-07-09",
        "merchant": "J. Crew",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP (...8373) due 15th",
        "amount": 96.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580389",
        "date": "2026-07-09",
        "merchant": "Miga Sushi",
        "category": "Eating out",
        "account": "CREDIT CARD (...2344)",
        "amount": 98.9,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-249149948370113010",
        "date": "2026-07-09",
        "merchant": "J. Crew",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP 9369 due 15th",
        "amount": 96.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248968068861547306",
        "date": "2026-07-09",
        "merchant": "Miga Sushi",
        "category": "Eating out",
        "account": "U CFF 6579 due 15th",
        "amount": 98.9,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248914296014656264",
        "date": "2026-07-09",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 2.12,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248914296014656263",
        "date": "2026-07-09",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 1.8,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248914296014656262",
        "date": "2026-07-09",
        "merchant": "Withholding",
        "category": "Credit Card + Financial Fees",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 0.32,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248906041937907856",
        "date": "2026-07-09",
        "merchant": "Anthem",
        "category": "Medical + Dentist",
        "account": "Primary Checking ...002 (....002)",
        "amount": 157.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248906041937907855",
        "date": "2026-07-09",
        "merchant": "Zelle",
        "category": "Home maintenance",
        "account": "Primary Checking ...002 (....002)",
        "amount": 175.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199469",
        "date": "2026-07-08",
        "merchant": "J.P. Boden Services Inc",
        "category": "Shopping",
        "account": "CREDIT CARD (...8373)",
        "amount": 109.4,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199176",
        "date": "2026-07-08",
        "merchant": "Mindful Medicine",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 300.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638879",
        "date": "2026-07-08",
        "merchant": "JP Boden Svcs",
        "category": "Shopping",
        "account": "U CSP (...8373) due 15th",
        "amount": 109.4,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988293",
        "date": "2026-07-08",
        "merchant": "Mindful Medicine",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 300.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437681",
        "date": "2026-07-08",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248968070112498645",
        "date": "2026-07-08",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248968066335527323",
        "date": "2026-07-08",
        "merchant": "JP Boden Svcs Inc",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP 9369 due 15th",
        "amount": 109.4,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248968066335527322",
        "date": "2026-07-08",
        "merchant": "Mindful Medicine",
        "category": "Medical + Dentist",
        "account": "U CSP 9369 due 15th",
        "amount": 300.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248883985112387678",
        "date": "2026-07-08",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 0.72,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248883984959295558",
        "date": "2026-07-08",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 76.77,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248883984959295557",
        "date": "2026-07-08",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
        "amount": 76.77,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248883984245215280",
        "date": "2026-07-08",
        "merchant": "Sweep In",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
        "amount": 0.03,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248795351497593819",
        "date": "2026-07-08",
        "merchant": "Merck & Co Inc New Com Dividend Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Individual Brokerage -9148 (...9148)",
        "amount": 510.1,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248730380544790780",
        "date": "2026-07-08",
        "merchant": "Zelle",
        "category": "School stuff + Education",
        "account": "Primary Checking ...002 (....002)",
        "amount": 100.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248730380544790779",
        "date": "2026-07-08",
        "merchant": "Verizon",
        "category": "Internet & Cable",
        "account": "Primary Checking ...002 (....002)",
        "amount": 79.99,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199118",
        "date": "2026-07-07",
        "merchant": "Dollar Tree",
        "category": "Shopping",
        "account": "CREDIT CARD (...8373)",
        "amount": 2.58,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988307",
        "date": "2026-07-07",
        "merchant": "Dollar Tree",
        "category": "Shopping",
        "account": "U CSP (...8373) due 15th",
        "amount": 2.58,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437945",
        "date": "2026-07-07",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248874956096033210",
        "date": "2026-07-07",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248874946037043646",
        "date": "2026-07-07",
        "merchant": "Dollar Tree",
        "category": "Shopping",
        "account": "U CSP 9369 due 15th",
        "amount": 2.58,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248797165694505830",
        "date": "2026-07-07",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 0.72,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248797165694505829",
        "date": "2026-07-07",
        "merchant": "Sweep Out",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 1221.84,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248797165498422059",
        "date": "2026-07-07",
        "merchant": "Sweep Out",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 970.37,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248797165134566164",
        "date": "2026-07-07",
        "merchant": "Sweep Out",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 1273.34,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248797164916462328",
        "date": "2026-07-07",
        "merchant": "Sweep Out",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
        "amount": 46.74,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248797164916462327",
        "date": "2026-07-07",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
        "amount": 0.03,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248730380544790781",
        "date": "2026-07-07",
        "merchant": "Venmo",
        "category": "Shopping",
        "account": "Primary Checking ...002 (....002)",
        "amount": 2.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328139",
        "date": "2026-07-06",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 70.34,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327956",
        "date": "2026-07-06",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...8373)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199282",
        "date": "2026-07-06",
        "merchant": "FirstEnergy",
        "category": "Gas & Electric",
        "account": "CREDIT CARD (...8373)",
        "amount": 584.93,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591220",
        "date": "2026-07-06",
        "merchant": "FirstEnergy",
        "category": "Gas & Electric",
        "account": "U CSP (...8373) due 15th",
        "amount": 584.93,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988240",
        "date": "2026-07-06",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 70.34,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988208",
        "date": "2026-07-06",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U CSP (...8373) due 15th",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248783459386413828",
        "date": "2026-07-06",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U CSP 9369 due 15th",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248783459386413823",
        "date": "2026-07-06",
        "merchant": "FirstEnergy",
        "category": "Gas & Electric",
        "account": "U CSP 9369 due 15th",
        "amount": 584.93,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248705401161798419",
        "date": "2026-07-06",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 585.95,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248705401161798418",
        "date": "2026-07-06",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 585.95,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248705401161798417",
        "date": "2026-07-06",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 328.38,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248705401161798416",
        "date": "2026-07-06",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
        "amount": 328.38,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248705399824863657",
        "date": "2026-07-06",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 234.38,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248705399824863656",
        "date": "2026-07-06",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 234.38,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248705399824863655",
        "date": "2026-07-06",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 147.44,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248705399824863654",
        "date": "2026-07-06",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
        "amount": 147.44,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248662308112847505",
        "date": "2026-07-06",
        "merchant": "Google",
        "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 174.18,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328237",
        "date": "2026-07-05",
        "merchant": "Ameripath",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 6.82,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327905",
        "date": "2026-07-05",
        "merchant": "Regional Womens Health",
        "category": "Medical + Dentist",
        "account": "CREDIT CARD (...8373)",
        "amount": 20.57,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591173",
        "date": "2026-07-05",
        "merchant": "Ameripath",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 6.82,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988024",
        "date": "2026-07-05",
        "merchant": "Regional Womens Health",
        "category": "Medical + Dentist",
        "account": "U CSP (...8373) due 15th",
        "amount": 20.57,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484117813580316",
        "date": "2026-07-05",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "CREDIT CARD (...2344)",
        "amount": 125.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248968068861547305",
        "date": "2026-07-05",
        "merchant": "Amazon",
        "category": "Shopping",
        "account": "U CFF 6579 due 15th",
        "amount": 125.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248783853890065027",
        "date": "2026-07-05",
        "merchant": "The Home Depot",
        "category": "Home Improvement",
        "account": "T CSP 5914 due 15th ",
        "amount": 17.28,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248783459386413825",
        "date": "2026-07-05",
        "merchant": "Regional Womens Health",
        "category": "Medical + Dentist",
        "account": "U CSP 9369 due 15th",
        "amount": 20.57,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248691700988923917",
        "date": "2026-07-05",
        "merchant": "Ameripath",
        "category": "Medical + Dentist",
        "account": "U CSP 9369 due 15th",
        "amount": 6.82,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248549802624176600",
        "date": "2026-07-05",
        "merchant": "Zelle",
        "category": "Mocha",
        "account": "Primary Checking ...002 (....002)",
        "amount": 100.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248485677390909572",
        "date": "2026-07-05",
        "merchant": "Costco",
        "category": "Groceries",
        "account": "Costco Visa 3744 due 17th",
        "amount": 196.95,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328178",
        "date": "2026-07-04",
        "merchant": "Quince",
        "category": "Clothing, Shoes, Jewelry",
        "account": "CREDIT CARD (...8373)",
        "amount": 144.8,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328045",
        "date": "2026-07-04",
        "merchant": "Sandqvist",
        "category": "Shopping",
        "account": "CREDIT CARD (...8373)",
        "amount": 214.4,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328024",
        "date": "2026-07-04",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 8.52,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199124",
        "date": "2026-07-04",
        "merchant": "Reef.com",
        "category": "Clothing, Shoes, Jewelry",
        "account": "CREDIT CARD (...8373)",
        "amount": 101.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199075",
        "date": "2026-07-04",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "CREDIT CARD (...8373)",
        "amount": 196.18,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199027",
        "date": "2026-07-04",
        "merchant": "Etsy",
        "category": "Clothing, Shoes, Jewelry",
        "account": "CREDIT CARD (...8373)",
        "amount": 21.36,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591098",
        "date": "2026-07-04",
        "merchant": "Quince",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP (...8373) due 15th",
        "amount": 144.8,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988323",
        "date": "2026-07-04",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 196.18,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988115",
        "date": "2026-07-04",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP (...8373) due 15th",
        "amount": 8.52,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988007",
        "date": "2026-07-04",
        "merchant": "Sandqvist",
        "category": "Shopping",
        "account": "U CSP (...8373) due 15th",
        "amount": 214.4,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987988",
        "date": "2026-07-04",
        "merchant": "Reef.com",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP (...8373) due 15th",
        "amount": 101.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987932",
        "date": "2026-07-04",
        "merchant": "Etsy",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP (...8373) due 15th",
        "amount": 21.36,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248783459386413829",
        "date": "2026-07-04",
        "merchant": "Walmart",
        "category": "Shopping",
        "account": "U CSP 9369 due 15th",
        "amount": 8.52,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248783459386413826",
        "date": "2026-07-04",
        "merchant": "Walmart",
        "category": "Shopping",
        "account": "U CSP 9369 due 15th",
        "amount": 196.18,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248783459386413824",
        "date": "2026-07-04",
        "merchant": "Reef.com",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP 9369 due 15th",
        "amount": 101.5,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248768019744444989",
        "date": "2026-07-04",
        "merchant": "lululemon",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 75.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248692050740400341",
        "date": "2026-07-04",
        "merchant": "ON Inc",
        "category": "Clothing, Shoes, Jewelry",
        "account": "T CSP 5914 due 15th ",
        "amount": 115.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248662308112847506",
        "date": "2026-07-04",
        "merchant": "lululemon",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 128.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248600495679623378",
        "date": "2026-07-04",
        "merchant": "Etsy",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP 9369 due 15th",
        "amount": 21.36,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248600495679623377",
        "date": "2026-07-04",
        "merchant": "Quince",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP 9369 due 15th",
        "amount": 144.8,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248600495679623376",
        "date": "2026-07-04",
        "merchant": "Sandqvist",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP 9369 due 15th",
        "amount": 214.4,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098327908",
        "date": "2026-07-03",
        "merchant": "Sephora",
        "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
        "account": "CREDIT CARD (...8373)",
        "amount": 71.9,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383198985",
        "date": "2026-07-03",
        "merchant": "Baublebar",
        "category": "Clothing, Shoes, Jewelry",
        "account": "CREDIT CARD (...8373)",
        "amount": 230.31,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675638898",
        "date": "2026-07-03",
        "merchant": "Sephora",
        "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
        "account": "U CSP (...8373) due 15th",
        "amount": 71.9,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761988153",
        "date": "2026-07-03",
        "merchant": "Baublebar",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP (...8373) due 15th",
        "amount": 230.31,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248783459386413827",
        "date": "2026-07-03",
        "merchant": "Walmart",
        "category": "Groceries",
        "account": "U CSP 9369 due 15th",
        "amount": 70.34,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248600857073438927",
        "date": "2026-07-03",
        "merchant": "ShopRite",
        "category": "Groceries",
        "account": "T CSP 5914 due 15th ",
        "amount": 24.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248600857073438926",
        "date": "2026-07-03",
        "merchant": "RIX POOLS AND SPA",
        "category": "Home maintenance",
        "account": "T CSP 5914 due 15th ",
        "amount": 119.38,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248600857073438925",
        "date": "2026-07-03",
        "merchant": "Bottle King",
        "category": "Groceries",
        "account": "T CSP 5914 due 15th ",
        "amount": 12.78,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248600495679623379",
        "date": "2026-07-03",
        "merchant": "Sephora",
        "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
        "account": "U CSP 9369 due 15th",
        "amount": 71.9,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248600495679623375",
        "date": "2026-07-03",
        "merchant": "Baublebar",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP 9369 due 15th",
        "amount": 230.31,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248400284229325740",
        "date": "2026-07-03",
        "merchant": "Yoga Six",
        "category": "Fitness",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 309.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121714098328063",
        "date": "2026-07-02",
        "merchant": "Rincon Azteca",
        "category": "Eating out",
        "account": "CREDIT CARD (...8373)",
        "amount": 86.13,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484187761987897",
        "date": "2026-07-02",
        "merchant": "BM Rincon Azteca",
        "category": "Eating out",
        "account": "U CSP (...8373) due 15th",
        "amount": 86.13,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248503664239989236",
        "date": "2026-07-02",
        "merchant": "Walmart",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 13.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248419437311972142",
        "date": "2026-07-02",
        "merchant": "Living Smiles Dentistry",
        "category": "Medical + Dentist",
        "account": "T CSP 5914 due 15th ",
        "amount": 240.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248419023269155656",
        "date": "2026-07-02",
        "merchant": "Rincon Azteca",
        "category": "Eating out",
        "account": "U CSP 9369 due 15th",
        "amount": 86.13,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248400284229325743",
        "date": "2026-07-02",
        "merchant": "Walmart",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 13.81,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248400284229325742",
        "date": "2026-07-02",
        "merchant": "American Express",
        "category": "Entertainment & Recreation",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 7.94,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248400284229325741",
        "date": "2026-07-02",
        "merchant": "American Express",
        "category": "Entertainment & Recreation",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 17.06,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248343347641995828",
        "date": "2026-07-02",
        "merchant": "Reinvestment",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 1.34,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248343347641995827",
        "date": "2026-07-02",
        "merchant": "Dividend",
        "category": "Dividends & Capital Gains",
        "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
        "amount": 1.34,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248295745560007462",
        "date": "2026-07-02",
        "merchant": "Disney",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 21.31,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248295745560007461",
        "date": "2026-07-02",
        "merchant": "Disney",
        "category": "Subscriptions",
        "account": "U AMEX Plat 1003 due 6th",
        "amount": 17.06,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248202972361150958",
        "date": "2026-07-02",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "Primary Checking ...002 (....002)",
        "amount": 5351.95,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-248202972361150957",
        "date": "2026-07-02",
        "merchant": "Zelle",
        "category": "Mocha",
        "account": "Primary Checking ...002 (....002)",
        "amount": 25.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248202972361150956",
        "date": "2026-07-02",
        "merchant": "Public Service Enterprise Group",
        "category": "Gas & Electric",
        "account": "Primary Checking ...002 (....002)",
        "amount": 150.0,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248188855103541553",
        "date": "2026-07-02",
        "merchant": "Google",
        "category": "Paychecks",
        "account": "360 Performance Savings (...4275)",
        "amount": 100.0,
        "isIncome": true,
        "tags": ""
    },
    {
        "id": "tx-256121714098328217",
        "date": "2026-07-01",
        "merchant": "Loft",
        "category": "Clothing, Shoes, Jewelry",
        "account": "CREDIT CARD (...8373)",
        "amount": 29.97,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-256121713383199183",
        "date": "2026-07-01",
        "merchant": "Loft",
        "category": "Clothing, Shoes, Jewelry",
        "account": "CREDIT CARD (...8373)",
        "amount": 59.06,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189675639049",
        "date": "2026-07-01",
        "merchant": "Loft",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP (...8373) due 15th",
        "amount": 29.97,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484189674591125",
        "date": "2026-07-01",
        "merchant": "Loft",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP (...8373) due 15th",
        "amount": 59.06,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-255484134302437900",
        "date": "2026-07-01",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "CREDIT CARD (...6581)",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248419023269155658",
        "date": "2026-07-01",
        "merchant": "Loft",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP 9369 due 15th",
        "amount": 29.97,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248419023269155657",
        "date": "2026-07-01",
        "merchant": "Loft",
        "category": "Clothing, Shoes, Jewelry",
        "account": "U CSP 9369 due 15th",
        "amount": 59.06,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248328234879963305",
        "date": "2026-07-01",
        "merchant": "Grill Hub",
        "category": "Eating out",
        "account": "T CSP 5914 due 15th ",
        "amount": 84.16,
        "isIncome": false,
        "tags": ""
    },
    {
        "id": "tx-248327823677739662",
        "date": "2026-07-01",
        "merchant": "LAZ Parking",
        "category": "Transportation",
        "account": "U WOH.6581 due 21st",
        "amount": 18.71,
        "isIncome": false,
        "tags": ""
    }
]
};
