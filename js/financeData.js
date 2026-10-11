/* ==========================================================================
   Book of Life / Life OS - Personal Finance Data & Monarch Money Models
   ========================================================================== */

const DEFAULT_FINANCE_DATA = {
  monthlyTarget: 23500, // Historical reference target
  alertSpendRatio: 0.85,
  // 3-Month Rolling Category Baselines (derived from actual Jul–Sep 2026 Monarch spend)
  categoryBaselines: {
    "Auto Payment": 42.0,
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
    "Transportation": 582.27,
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
        "classification": "Fixed Baseline",
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
        "classification": "Family & Pet",
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
        "budget": 582,
        "baseline": 582.27,
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
        "classification": "Recurring",
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
        "classification": "Enrichment",
        "icon": "graduation-cap"
    },
    {
        "id": "cat-home-improvement",
        "name": "Home Improvement",
        "budget": 158,
        "baseline": 158.77,
        "classification": "Fixed Baseline",
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
        "id": "cat-auto-payment",
        "name": "Auto Payment",
        "budget": 42,
        "baseline": 42.0,
        "classification": "Fixed Baseline",
        "icon": "car"
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
        "category": "Auto Payment",
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
        "category": "Auto Payment",
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
        "category": "Auto Payment",
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
    }
]
};
