/* ==========================================================================
   Book of Life / Life OS - Personal Finance Data & Monarch Money Models
   ========================================================================== */

const DEFAULT_FINANCE_DATA = {
  "seedVersion": 14,
  "monthlyTarget": 18200,
  "savingsTarget": 3000,
  "wealthSweepPot": 4258.3,
  "alertSpendRatio": 0.85,
  "categoryBaselines": {
    "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3": 370.83,
    "Camp": 379.38,
    "Cash & ATM": 266.94,
    "Cell Phone": 20.0,
    "Charity": 68.0,
    "Child Activities": 958.14,
    "Child Care": 450.0,
    "Clothing, Shoes, Jewelry": 477.56,
    "Credit Card + Financial Fees": 764.17,
    "Eating out": 1404.63,
    "Entertainment & Recreation": 17.33,
    "Fitness": 128.0,
    "Gas & Electric": 1000.0,
    "Groceries": 1519.34,
    "Home Improvement": 158.77,
    "Home Security": 24.51,
    "Home maintenance": 1639.88,
    "Insurance": 350.0,
    "Internet & Cable": 79.99,
    "Medical + Dentist": 1400.0,
    "Mocha": 500.0,
    "Mortgage": 5933.22,
    "School stuff + Education": 189.28,
    "Self care + Grooming": 329.58,
    "Shopping": 1812.11,
    "Subscriptions": 85.0,
    "Transportation": 400.0,
    "Travel & Vacation": 1450.02,
    "Water": 296.34
  },
  "monthlySummaries": [
    {
      "month": "2026-10",
      "income": 14515.7,
      "outflow": 10589.9
    },
    {
      "month": "2026-09",
      "income": 21923.76,
      "outflow": 19871.24
    },
    {
      "month": "2026-08",
      "income": 21150.46,
      "outflow": 23829.98
    },
    {
      "month": "2026-07",
      "income": 29843.38,
      "outflow": 25850.62
    },
    {
      "month": "2026-06",
      "income": 21386.52,
      "outflow": 25848.87
    },
    {
      "month": "2026-05",
      "income": 21318.19,
      "outflow": 22710.8
    },
    {
      "month": "2026-04",
      "income": 23037.22,
      "outflow": 25060.5
    },
    {
      "month": "2026-03",
      "income": 57411.57,
      "outflow": 62214.31
    },
    {
      "month": "2026-02",
      "income": 24851.56,
      "outflow": 24739.92
    },
    {
      "month": "2026-01",
      "income": 23040.91,
      "outflow": 22217.97
    },
    {
      "month": "2025-12",
      "income": 36490.85,
      "outflow": 30763.68
    },
    {
      "month": "2025-11",
      "income": 22756.38,
      "outflow": 26019.01
    },
    {
      "month": "2025-10",
      "income": -456.65,
      "outflow": 10375.4
    },
    {
      "month": "2025-09",
      "income": 18.02,
      "outflow": 7928.99
    },
    {
      "month": "2025-08",
      "income": 20.0,
      "outflow": 14756.52
    },
    {
      "month": "2025-07",
      "income": -450.07,
      "outflow": 19119.3
    },
    {
      "month": "2025-06",
      "income": 179.66,
      "outflow": 13085.52
    },
    {
      "month": "2025-05",
      "income": 20.0,
      "outflow": 29735.21
    },
    {
      "month": "2025-04",
      "income": 20.0,
      "outflow": 13142.71
    },
    {
      "month": "2025-03",
      "income": 30.0,
      "outflow": 10922.59
    },
    {
      "month": "2025-02",
      "income": 20.0,
      "outflow": 5197.17
    },
    {
      "month": "2025-01",
      "income": 229.82,
      "outflow": 7966.1
    },
    {
      "month": "2024-12",
      "income": 20.0,
      "outflow": 13341.76
    },
    {
      "month": "2024-11",
      "income": 20.0,
      "outflow": 3790.86
    },
    {
      "month": "2024-10",
      "income": 0.0,
      "outflow": 6383.54
    },
    {
      "month": "2024-09",
      "income": 0.0,
      "outflow": 5892.76
    },
    {
      "month": "2024-08",
      "income": 0.0,
      "outflow": 1583.11
    },
    {
      "month": "2024-07",
      "income": 18.99,
      "outflow": 3450.63
    },
    {
      "month": "2024-06",
      "income": 8.0,
      "outflow": 2330.52
    },
    {
      "month": "2024-05",
      "income": 0.0,
      "outflow": 1544.47
    },
    {
      "month": "2024-04",
      "income": 0.0,
      "outflow": 9.99
    },
    {
      "month": "2024-03",
      "income": 0.0,
      "outflow": 9.99
    },
    {
      "month": "2024-02",
      "income": 0.0,
      "outflow": 9.99
    },
    {
      "month": "2024-01",
      "income": 0.0,
      "outflow": 22.02
    },
    {
      "month": "2023-12",
      "income": 0.0,
      "outflow": 68.62
    },
    {
      "month": "2023-11",
      "income": 0.0,
      "outflow": 33.99
    },
    {
      "month": "2023-10",
      "income": 0.0,
      "outflow": 9.99
    },
    {
      "month": "2023-09",
      "income": 0.0,
      "outflow": 58.8
    },
    {
      "month": "2023-08",
      "income": 0.0,
      "outflow": 35.57
    },
    {
      "month": "2023-07",
      "income": 0.0,
      "outflow": 9.99
    },
    {
      "month": "2023-06",
      "income": 0.0,
      "outflow": 9.99
    },
    {
      "month": "2023-05",
      "income": 0.0,
      "outflow": 9.99
    },
    {
      "month": "2023-04",
      "income": 0.0,
      "outflow": 53.16
    },
    {
      "month": "2023-03",
      "income": 0.0,
      "outflow": 12.98
    },
    {
      "month": "2023-02",
      "income": 0.0,
      "outflow": 12.98
    },
    {
      "month": "2023-01",
      "income": 0.0,
      "outflow": 19.37
    },
    {
      "month": "2022-12",
      "income": 0.0,
      "outflow": 12.98
    },
    {
      "month": "2022-11",
      "income": 0.0,
      "outflow": 11.32
    },
    {
      "month": "2022-10",
      "income": 0.0,
      "outflow": 12.98
    },
    {
      "month": "2022-09",
      "income": 0.0,
      "outflow": 42.82
    },
    {
      "month": "2022-08",
      "income": 0.0,
      "outflow": 12.98
    },
    {
      "month": "2022-07",
      "income": 0.0,
      "outflow": 12.98
    },
    {
      "month": "2022-06",
      "income": 0.0,
      "outflow": 12.98
    },
    {
      "month": "2022-05",
      "income": 0.0,
      "outflow": 12.98
    },
    {
      "month": "2022-04",
      "income": 0.0,
      "outflow": 16.17
    },
    {
      "month": "2022-03",
      "income": 0.0,
      "outflow": 40.54
    },
    {
      "month": "2022-02",
      "income": 0.0,
      "outflow": 12.98
    },
    {
      "month": "2022-01",
      "income": 0.0,
      "outflow": 12.98
    },
    {
      "month": "2021-12",
      "income": 0.0,
      "outflow": 12.98
    },
    {
      "month": "2021-11",
      "income": 0.0,
      "outflow": 12.98
    },
    {
      "month": "2021-10",
      "income": 0.0,
      "outflow": 14.36
    },
    {
      "month": "2021-09",
      "income": 0.0,
      "outflow": 12.98
    },
    {
      "month": "2021-08",
      "income": 0.0,
      "outflow": 216.03
    },
    {
      "month": "2021-07",
      "income": 0.0,
      "outflow": 218.51
    },
    {
      "month": "2021-06",
      "income": 0.0,
      "outflow": 35.91
    },
    {
      "month": "2021-05",
      "income": 0.0,
      "outflow": 58.91
    },
    {
      "month": "2021-04",
      "income": 0.0,
      "outflow": 49.1
    },
    {
      "month": "2021-03",
      "income": 0.0,
      "outflow": 12.98
    },
    {
      "month": "2021-02",
      "income": 0.0,
      "outflow": 85.97
    },
    {
      "month": "2021-01",
      "income": 0.0,
      "outflow": 60.48
    },
    {
      "month": "2020-12",
      "income": 0.0,
      "outflow": 259.14
    },
    {
      "month": "2020-11",
      "income": 0.0,
      "outflow": 1502.82
    }
  ],
  "categories": [
    {
      "id": "cat-mortgage",
      "name": "Mortgage",
      "budget": 5933,
      "baseline": 5933.22,
      "classification": "Fixed Baseline",
      "icon": "home"
    },
    {
      "id": "cat-shopping",
      "name": "Shopping",
      "budget": 600,
      "baseline": 1812.11,
      "classification": "Discretionary",
      "icon": "shopping-bag"
    },
    {
      "id": "cat-home-maintenance",
      "name": "Home maintenance",
      "budget": 1600,
      "baseline": 1639.88,
      "classification": "Discretionary",
      "icon": "wrench"
    },
    {
      "id": "cat-groceries",
      "name": "Groceries",
      "budget": 800,
      "baseline": 1519.34,
      "classification": "Essential",
      "icon": "shopping-cart"
    },
    {
      "id": "cat-travel---vacation",
      "name": "Travel & Vacation",
      "budget": 750,
      "baseline": 1450.02,
      "classification": "Discretionary",
      "icon": "plane"
    },
    {
      "id": "cat-eating-out",
      "name": "Eating out",
      "budget": 800,
      "baseline": 1404.63,
      "classification": "Discretionary",
      "icon": "utensils"
    },
    {
      "id": "cat-medical---dentist",
      "name": "Medical + Dentist",
      "budget": 1400,
      "baseline": 1400.0,
      "classification": "Healthcare",
      "icon": "heart-pulse"
    },
    {
      "id": "cat-gas---electric",
      "name": "Gas & Electric",
      "budget": 1000,
      "baseline": 1000.0,
      "classification": "Fixed Baseline",
      "icon": "zap"
    },
    {
      "id": "cat-child-activities",
      "name": "Child Activities",
      "budget": 950,
      "baseline": 958.14,
      "classification": "Enrichment",
      "icon": "book-open"
    },
    {
      "id": "cat-credit-card---financial-fees",
      "name": "Credit Card + Financial Fees",
      "budget": 0,
      "baseline": 764.17,
      "classification": "Discretionary",
      "icon": "tag"
    },
    {
      "id": "cat-mocha",
      "name": "Mocha",
      "budget": 500,
      "baseline": 500.0,
      "classification": "Fixed Baseline",
      "icon": "paw-print"
    },
    {
      "id": "cat-clothing--shoes--jewelry",
      "name": "Clothing, Shoes, Jewelry",
      "budget": 400,
      "baseline": 477.56,
      "classification": "Discretionary",
      "icon": "tag"
    },
    {
      "id": "cat-child-care",
      "name": "Child Care",
      "budget": 450,
      "baseline": 450.0,
      "classification": "Fixed Baseline",
      "icon": "baby"
    },
    {
      "id": "cat-transportation",
      "name": "Transportation",
      "budget": 400,
      "baseline": 400.0,
      "classification": "Fixed Baseline",
      "icon": "car"
    },
    {
      "id": "cat-camp",
      "name": "Camp",
      "budget": 350,
      "baseline": 379.38,
      "classification": "Enrichment",
      "icon": "sun"
    },
    {
      "id": "cat-c-mas--bday--india-gifts",
      "name": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
      "budget": 350,
      "baseline": 370.83,
      "classification": "Discretionary",
      "icon": "gift"
    },
    {
      "id": "cat-insurance",
      "name": "Insurance",
      "budget": 350,
      "baseline": 350.0,
      "classification": "Fixed Baseline",
      "icon": "shield-check"
    },
    {
      "id": "cat-self-care---grooming",
      "name": "Self care + Grooming",
      "budget": 300,
      "baseline": 329.58,
      "classification": "Self Care",
      "icon": "sparkles"
    },
    {
      "id": "cat-fitness",
      "name": "Fitness",
      "budget": 130,
      "baseline": 128.0,
      "classification": "Self Care",
      "icon": "activity"
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
      "id": "cat-subscriptions",
      "name": "Subscriptions",
      "budget": 85,
      "baseline": 85.0,
      "classification": "Fixed Baseline",
      "icon": "repeat"
    },
    {
      "id": "cat-cash---atm",
      "name": "Cash & ATM",
      "budget": 200,
      "baseline": 266.94,
      "classification": "Discretionary",
      "icon": "tag"
    },
    {
      "id": "cat-school-stuff---education",
      "name": "School stuff + Education",
      "budget": 175,
      "baseline": 189.28,
      "classification": "Fixed Baseline",
      "icon": "graduation-cap"
    },
    {
      "id": "cat-home-improvement",
      "name": "Home Improvement",
      "budget": 150,
      "baseline": 158.77,
      "classification": "Discretionary",
      "icon": "home"
    },
    {
      "id": "cat-internet---cable",
      "name": "Internet & Cable",
      "budget": 80,
      "baseline": 79.99,
      "classification": "Fixed Baseline",
      "icon": "wifi"
    },
    {
      "id": "cat-charity",
      "name": "Charity",
      "budget": 50,
      "baseline": 68.0,
      "classification": "Discretionary",
      "icon": "heart"
    },
    {
      "id": "cat-home-security",
      "name": "Home Security",
      "budget": 25,
      "baseline": 24.51,
      "classification": "Fixed Baseline",
      "icon": "shield"
    },
    {
      "id": "cat-cell-phone",
      "name": "Cell Phone",
      "budget": 20,
      "baseline": 20.0,
      "classification": "Fixed Baseline",
      "icon": "smartphone"
    },
    {
      "id": "cat-entertainment---recreation",
      "name": "Entertainment & Recreation",
      "budget": 50,
      "baseline": 17.33,
      "classification": "Discretionary",
      "icon": "film"
    }
  ],
  "transactions": [
    {
      "id": "257916196640805328",
      "date": "2026-10-16",
      "merchant": "Shake Shack",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 20.39,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257911424677336059",
      "date": "2026-10-16",
      "merchant": "Bombay Heritage",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 118.25,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257883301489430600",
      "date": "2026-10-16",
      "merchant": "Advisor Fee",
      "category": "Credit Card + Financial Fees",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 590.48,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257883301489430599",
      "date": "2026-10-16",
      "merchant": "Sweep Out",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 590.48,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257883301229384636",
      "date": "2026-10-16",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 2.82,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257883301229384635",
      "date": "2026-10-16",
      "merchant": "Sweep Out",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 349.91,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257883301229384634",
      "date": "2026-10-16",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 2.82,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257883301229384633",
      "date": "2026-10-16",
      "merchant": "Advisor Fee",
      "category": "Credit Card + Financial Fees",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 349.91,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257883300987163564",
      "date": "2026-10-16",
      "merchant": "Sweep Out",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 415.85,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257883300987163563",
      "date": "2026-10-16",
      "merchant": "Advisor Fee",
      "category": "Credit Card + Financial Fees",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 415.85,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257805044288082236",
      "date": "2026-10-16",
      "merchant": "Carrie DiStefano",
      "category": "Mocha",
      "account": "Primary Checking ...002 (....002)",
      "amount": 50.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257805044288082235",
      "date": "2026-10-16",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 532.73,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257805044288082234",
      "date": "2026-10-16",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 3134.29,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257805044288082233",
      "date": "2026-10-16",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 4705.52,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257730895342490106",
      "date": "2026-10-16",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257916196640805327",
      "date": "2026-10-15",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257853064752943904",
      "date": "2026-10-15",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 590.17,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257853063926665879",
      "date": "2026-10-15",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 365.07,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257853063670813328",
      "date": "2026-10-15",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 415.87,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257825252669149589",
      "date": "2026-10-15",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U CFF (...2344) due 15th",
      "amount": 532.73,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257825251509424788",
      "date": "2026-10-15",
      "merchant": "Livingston Dental",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 187.46,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257825251509424787",
      "date": "2026-10-15",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U CSP (...8373) due 15th",
      "amount": 4705.52,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257820421795631872",
      "date": "2026-10-15",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "T CSP 5914 due 15th ",
      "amount": 3134.29,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257765950368534745",
      "date": "2026-10-15",
      "merchant": "Sell",
      "category": "Sell",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 590.17,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257765949677523075",
      "date": "2026-10-15",
      "merchant": "Sell",
      "category": "Sell",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 64.31,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257765949677523074",
      "date": "2026-10-15",
      "merchant": "Sell",
      "category": "Sell",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 300.76,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257765949315764340",
      "date": "2026-10-15",
      "merchant": "Sell",
      "category": "Sell",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 415.87,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257693445733765547",
      "date": "2026-10-15",
      "merchant": "Erco Lig",
      "category": "Paychecks",
      "account": "Primary Checking ...002 (....002)",
      "amount": 5477.13,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257730895342490108",
      "date": "2026-10-14",
      "merchant": "Miga Sushi",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 72.45,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257730895342490107",
      "date": "2026-10-14",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257637436409532924",
      "date": "2026-10-14",
      "merchant": "Mindsoother",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 225.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257626544678654774",
      "date": "2026-10-14",
      "merchant": "Excel Martial Arts",
      "category": "Child Activities",
      "account": "Primary Checking ...002 (....002)",
      "amount": 357.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257632538115724266",
      "date": "2026-10-13",
      "merchant": "Play It Again Sports",
      "category": "Shopping",
      "account": "T CSP 5914 due 15th ",
      "amount": 30.89,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257632538115724265",
      "date": "2026-10-13",
      "merchant": "Caputos Homemade Ice Cream",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 15.75,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257632538115724264",
      "date": "2026-10-13",
      "merchant": "New Portugalo",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 17.06,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257632538115724263",
      "date": "2026-10-13",
      "merchant": "Excel Martial Arts",
      "category": "Child Activities",
      "account": "T CSP 5914 due 15th ",
      "amount": 40.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257545910303085016",
      "date": "2026-10-13",
      "merchant": "Mindful Medicine",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 300.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257544671931683324",
      "date": "2026-10-13",
      "merchant": "Venmo",
      "category": "Self care + Grooming",
      "account": "Primary Checking ...002 (....002)",
      "amount": 40.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257540920663625763",
      "date": "2026-10-13",
      "merchant": "McDonald's",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 22.55,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257545910303085017",
      "date": "2026-10-12",
      "merchant": "Dairy Queen",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 6.64,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257545909197886068",
      "date": "2026-10-12",
      "merchant": "E-ZPass",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 50.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257451311238762532",
      "date": "2026-10-12",
      "merchant": "Erco Lighting Inc",
      "category": "Other Income (incl cc reward credits)",
      "account": "Primary Checking ...002 (....002)",
      "amount": 1687.53,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257545911284551733",
      "date": "2026-10-11",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF (...2344) due 15th",
      "amount": 12.78,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257395824901247042",
      "date": "2026-10-11",
      "merchant": "Regional Womens Health",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 25.12,
      "isIncome": false,
      "tags": "Receipt Import"
    },
    {
      "id": "257395824901247041",
      "date": "2026-10-11",
      "merchant": "Deshe Landscaping",
      "category": "Home maintenance",
      "account": "U CSP (...8373) due 15th",
      "amount": 459.04,
      "isIncome": false,
      "tags": "Receipt Import"
    },
    {
      "id": "257384656326382244",
      "date": "2026-10-11",
      "merchant": "The Hanover Insurance Group",
      "category": "Insurance",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 4158.67,
      "isIncome": false,
      "tags": "Receipt Import"
    },
    {
      "id": "257363950156927050",
      "date": "2026-10-11",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 88.33,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927049",
      "date": "2026-10-11",
      "merchant": "CVS",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 13.64,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257327965255782683",
      "date": "2026-10-11",
      "merchant": "the YMCA",
      "category": "Child Care",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 107.1,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927046",
      "date": "2026-10-10",
      "merchant": "SimpliSafe",
      "category": "Home Security",
      "account": "U CSP (...8373) due 15th",
      "amount": 24.51,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927035",
      "date": "2026-10-10",
      "merchant": "DUPI STUDIO",
      "category": "Self care + Grooming",
      "account": "U CSP (...8373) due 15th",
      "amount": 398.94,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257359392802362135",
      "date": "2026-10-10",
      "merchant": "Soft N' Yummy",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 16.89,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927044",
      "date": "2026-10-09",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927033",
      "date": "2026-10-09",
      "merchant": "A2B Indian Veg Rest",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 82.65,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257276304808235330",
      "date": "2026-10-09",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "Primary Checking ...002 (....002)",
      "amount": 5351.94,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257234231327478480",
      "date": "2026-10-09",
      "merchant": "Source to Source/Fund to Fund Transfer In",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257234231327478479",
      "date": "2026-10-09",
      "merchant": "Plan Contribution",
      "category": "Buy",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 2115.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257234231327478478",
      "date": "2026-10-09",
      "merchant": "Source to Source/Fund to Fund Transfer Out",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257201690789826635",
      "date": "2026-10-09",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "360 Performance Savings (...4275)",
      "amount": 35.18,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257201690789826634",
      "date": "2026-10-09",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "360 Performance Savings (...4275)",
      "amount": 100.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257363950156927043",
      "date": "2026-10-08",
      "merchant": "Chewy",
      "category": "Mocha",
      "account": "U CSP (...8373) due 15th",
      "amount": 134.72,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927039",
      "date": "2026-10-08",
      "merchant": "Chewy",
      "category": "Mocha",
      "account": "U CSP (...8373) due 15th",
      "amount": 54.82,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927032",
      "date": "2026-10-08",
      "merchant": "Harrison Nj Garage Flash",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257232426027733779",
      "date": "2026-10-08",
      "merchant": "Dividend Received Invesco QQQ Tr Unit Ser 1 (Qqq) (Cash)",
      "category": "Dividends & Capital Gains",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 0.75,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257232426027733778",
      "date": "2026-10-08",
      "merchant": "Purchase Into Core Account Cash (315994103) (Cash)",
      "category": "Buy",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 0.75,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257154287002997457",
      "date": "2026-10-08",
      "merchant": "Verizon",
      "category": "Internet & Cable",
      "account": "Primary Checking ...002 (....002)",
      "amount": 79.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257146873400807846",
      "date": "2026-10-08",
      "merchant": "Withholding",
      "category": "Credit Card + Financial Fees",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.32,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257146873400807845",
      "date": "2026-10-08",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 1.34,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257146873400807844",
      "date": "2026-10-08",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 1.34,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257146873400807843",
      "date": "2026-10-08",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 1.81,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257146873400807842",
      "date": "2026-10-08",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 2.13,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257363950156927057",
      "date": "2026-10-07",
      "merchant": "Thesaladhouse",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 45.7,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927053",
      "date": "2026-10-07",
      "merchant": "Mindsoother",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 225.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927047",
      "date": "2026-10-07",
      "merchant": "CVS",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 5.94,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927040",
      "date": "2026-10-07",
      "merchant": "CVS",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 5.94,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927034",
      "date": "2026-10-07",
      "merchant": "Summit Medical Group",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 30.0,
      "isIncome": false,
      "tags": "Receipt Import"
    },
    {
      "id": "257271936617828941",
      "date": "2026-10-07",
      "merchant": "American Express",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 3.69,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257067662747128467",
      "date": "2026-10-07",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 0.34,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257067662365446773",
      "date": "2026-10-07",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 77.28,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257067662365446772",
      "date": "2026-10-07",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 77.28,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257067662081282656",
      "date": "2026-10-07",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
      "amount": 0.02,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257043245912576100",
      "date": "2026-10-07",
      "merchant": "Merck & Co Inc New Com Dividend Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Individual Brokerage -9148 (...9148)",
      "amount": 513.44,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257043196657815874",
      "date": "2026-10-07",
      "merchant": "The New York Times",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 4.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257001298575512172",
      "date": "2026-10-07",
      "merchant": "Anthem",
      "category": "Medical + Dentist",
      "account": "Primary Checking ...002 (....002)",
      "amount": 157.5,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257001298575512171",
      "date": "2026-10-07",
      "merchant": "American Express",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 38.37,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257001298575512170",
      "date": "2026-10-07",
      "merchant": "American Express",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 1119.16,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257001298575512169",
      "date": "2026-10-07",
      "merchant": "Karina Oliveira De Araujo",
      "category": "Home maintenance",
      "account": "Primary Checking ...002 (....002)",
      "amount": 175.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927048",
      "date": "2026-10-06",
      "merchant": "CVS",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 32.47,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927031",
      "date": "2026-10-06",
      "merchant": "Harrison Nj Garage Flash",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257037317701129088",
      "date": "2026-10-06",
      "merchant": "Sweep Out",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 651.95,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257037317701129087",
      "date": "2026-10-06",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 0.34,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257037317382361965",
      "date": "2026-10-06",
      "merchant": "Sweep Out",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 888.59,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257037317074080591",
      "date": "2026-10-06",
      "merchant": "Sweep Out",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
      "amount": 43.49,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257037317074080590",
      "date": "2026-10-06",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
      "amount": 0.02,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257037316801450810",
      "date": "2026-10-06",
      "merchant": "Sweep Out",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 785.82,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257001298575512174",
      "date": "2026-10-06",
      "merchant": "Anthem",
      "category": "Medical + Dentist",
      "account": "Primary Checking ...002 (....002)",
      "amount": 157.5,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257001298575512173",
      "date": "2026-10-06",
      "merchant": "Livingston Public",
      "category": "School stuff + Education",
      "account": "Primary Checking ...002 (....002)",
      "amount": 50.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256985572661809898",
      "date": "2026-10-06",
      "merchant": "American Express",
      "category": "Credit Card Payment",
      "account": "U Amex EveryDay 3003 due 5th",
      "amount": 38.37,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256985571734868599",
      "date": "2026-10-06",
      "merchant": "American Express",
      "category": "Credit Card Payment",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 1119.16,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256949808555118890",
      "date": "2026-10-06",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 651.95,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256949807848378607",
      "date": "2026-10-06",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 888.59,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256949807421608138",
      "date": "2026-10-06",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
      "amount": 43.49,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256949806977011890",
      "date": "2026-10-06",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 171.16,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256949806977011888",
      "date": "2026-10-06",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 172.94,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256949806977011887",
      "date": "2026-10-06",
      "merchant": "Sell",
      "category": "Sell",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 888.61,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256949806977011885",
      "date": "2026-10-06",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 972.44,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256949806977011884",
      "date": "2026-10-06",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 124.4,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256949806977011883",
      "date": "2026-10-06",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 93.64,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256949806977011880",
      "date": "2026-10-06",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 139.85,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927051",
      "date": "2026-10-05",
      "merchant": "FirstEnergy",
      "category": "Gas & Electric",
      "account": "U CSP (...8373) due 15th",
      "amount": 440.32,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256985571734868598",
      "date": "2026-10-05",
      "merchant": "American Express",
      "category": "Other Income (incl cc reward credits)",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 21.31,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256949808555118891",
      "date": "2026-10-05",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 342.02,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256949808555118889",
      "date": "2026-10-05",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 342.02,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256949808555118888",
      "date": "2026-10-05",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 601.79,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256949808555118887",
      "date": "2026-10-05",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 601.79,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256949806977011889",
      "date": "2026-10-05",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 241.88,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256949806977011886",
      "date": "2026-10-05",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 241.88,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256949806977011882",
      "date": "2026-10-05",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 154.31,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256949806977011881",
      "date": "2026-10-05",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 154.31,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256870096022557374",
      "date": "2026-10-05",
      "merchant": "Disney",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 21.31,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256856440858759520",
      "date": "2026-10-05",
      "merchant": "E-ZPass",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 50.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927056",
      "date": "2026-10-04",
      "merchant": "Donut Basket",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 22.5,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927055",
      "date": "2026-10-04",
      "merchant": "The Milkshake Factor",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 22.5,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927028",
      "date": "2026-10-04",
      "merchant": "Cookie Cutters Haircuts",
      "category": "Self care + Grooming",
      "account": "U CSP (...8373) due 15th",
      "amount": 5.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256699451207864827",
      "date": "2026-10-04",
      "merchant": "the YMCA",
      "category": "Child Care",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 107.1,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927052",
      "date": "2026-10-03",
      "merchant": "Dianas Nail & Spa",
      "category": "Self care + Grooming",
      "account": "U CSP (...8373) due 15th",
      "amount": 117.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927041",
      "date": "2026-10-03",
      "merchant": "lake pajamas",
      "category": "Clothing, Shoes, Jewelry",
      "account": "U CSP (...8373) due 15th",
      "amount": 88.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927036",
      "date": "2026-10-03",
      "merchant": "Trader Joe's",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 118.25,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256862139604029774",
      "date": "2026-10-03",
      "merchant": "Miscellaneous Credits/Adjustment",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 1.33,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256812401937634235",
      "date": "2026-10-03",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 13.81,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256712655098105860",
      "date": "2026-10-03",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "T CSP 5914 due 15th ",
      "amount": 7.3,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256643752672121829",
      "date": "2026-10-03",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 19.04,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256643752672121828",
      "date": "2026-10-03",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 13.81,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927058",
      "date": "2026-10-02",
      "merchant": "Tino\u2019s Artisan Pizza",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 100.64,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256622143623156674",
      "date": "2026-10-02",
      "merchant": "Main Street Wine Cell",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 14.97,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927037",
      "date": "2026-10-01",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256531346023273173",
      "date": "2026-10-01",
      "merchant": "Industry Squares",
      "category": "Shopping",
      "account": "T CSP 5914 due 15th ",
      "amount": 16.82,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256505890317291678",
      "date": "2026-10-01",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 22.55,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505890317291675",
      "date": "2026-10-01",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 22.55,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256471772275692037",
      "date": "2026-10-01",
      "merchant": "the YMCA",
      "category": "Child Care",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 101.7,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256413955463336710",
      "date": "2026-10-01",
      "merchant": "Scholastic",
      "category": "Shopping",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 55.4,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927054",
      "date": "2026-09-30",
      "merchant": "Harrison Nj Garage Flash",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927045",
      "date": "2026-09-30",
      "merchant": "IlPoom",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 127.94,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927030",
      "date": "2026-09-30",
      "merchant": "Mindsoother",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 225.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256511316114035429",
      "date": "2026-09-30",
      "merchant": "Interest Earned Cash (315994103) (Cash)",
      "category": "Interest",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 12.88,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256511316114035428",
      "date": "2026-09-30",
      "merchant": "Reinvestment Cash (315994103) (Cash)",
      "category": "Dividends & Capital Gains",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 12.88,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505891041857798",
      "date": "2026-09-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 268.98,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505891041857797",
      "date": "2026-09-30",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 216.94,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505891041857796",
      "date": "2026-09-30",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 0.41,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505891041857795",
      "date": "2026-09-30",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 268.98,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505891041857794",
      "date": "2026-09-30",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 436.61,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505891041857793",
      "date": "2026-09-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 436.61,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505891041857792",
      "date": "2026-09-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 0.41,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505891041857791",
      "date": "2026-09-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 216.94,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505890668564691",
      "date": "2026-09-30",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.17,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505890668564690",
      "date": "2026-09-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 639.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505890668564689",
      "date": "2026-09-30",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 860.11,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505890668564688",
      "date": "2026-09-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.17,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505890668564687",
      "date": "2026-09-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 6.54,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505890668564686",
      "date": "2026-09-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 152.39,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505890668564685",
      "date": "2026-09-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 62.18,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505890317291677",
      "date": "2026-09-30",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 1.62,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505890317291676",
      "date": "2026-09-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 1.62,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505890089750601",
      "date": "2026-09-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
      "amount": 0.01,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505890089750600",
      "date": "2026-09-30",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
      "amount": 0.01,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505889755254840",
      "date": "2026-09-30",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 0.33,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505889755254839",
      "date": "2026-09-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 486.45,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505889755254838",
      "date": "2026-09-30",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 194.78,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505889755254837",
      "date": "2026-09-30",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 486.45,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505889755254836",
      "date": "2026-09-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 194.78,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505889755254835",
      "date": "2026-09-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 0.33,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505889755254834",
      "date": "2026-09-30",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 115.68,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256505889755254833",
      "date": "2026-09-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 115.68,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256477224452510527",
      "date": "2026-09-30",
      "merchant": "Capital One",
      "category": "Interest",
      "account": "360 Checking (...5441)",
      "amount": 0.09,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256477224170443558",
      "date": "2026-09-30",
      "merchant": "Capital One",
      "category": "Interest",
      "account": "360 Performance Savings (...4275)",
      "amount": 529.77,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256477223885230868",
      "date": "2026-09-30",
      "merchant": "Capital One",
      "category": "Interest",
      "account": "Kids Savings Account (...8421)",
      "amount": 0.28,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256446625554649871",
      "date": "2026-09-30",
      "merchant": "Erco Lig",
      "category": "Paychecks",
      "account": "Primary Checking ...002 (....002)",
      "amount": 5079.3,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256446625554649870",
      "date": "2026-09-30",
      "merchant": "Charles Schwab",
      "category": "Other Income (incl cc reward credits)",
      "account": "Primary Checking ...002 (....002)",
      "amount": 4.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256446625554649869",
      "date": "2026-09-30",
      "merchant": "Charles Schwab",
      "category": "Interest",
      "account": "Primary Checking ...002 (....002)",
      "amount": 0.15,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256437509704667600",
      "date": "2026-09-30",
      "merchant": "PM Pediatrics",
      "category": "Medical + Dentist",
      "account": "T CSP 5914 due 15th ",
      "amount": 30.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256418529874038855",
      "date": "2026-09-30",
      "merchant": "Miscellaneous Forfeiture Debit",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 803.28,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927029",
      "date": "2026-09-29",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 11.02,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256409386286076029",
      "date": "2026-09-29",
      "merchant": "Dividend Received as of 2026 09 28 Vanguard Morningstar Total St MKT In... (Vtsax) (Cash)",
      "category": "Dividends & Capital Gains",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 10.08,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256409386286076028",
      "date": "2026-09-29",
      "merchant": "Purchase Into Core Account Cash (315994103) (Cash)",
      "category": "Buy",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 10.08,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256330806468301750",
      "date": "2026-09-29",
      "merchant": "Miscellaneous Credit to Forfeiture Account",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 1.33,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256330806168408994",
      "date": "2026-09-29",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
      "amount": 43.45,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256330806168408993",
      "date": "2026-09-29",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
      "amount": 43.45,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256295771522486657",
      "date": "2026-09-29",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "360 Performance Savings (...4275)",
      "amount": 100.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256285747292165064",
      "date": "2026-09-29",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "Primary Checking ...002 (....002)",
      "amount": 710.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256267217540764353",
      "date": "2026-09-29",
      "merchant": "Restricted Stock Deposit",
      "category": "Dividends & Capital Gains",
      "account": "Google Equity Awards (...ards)",
      "amount": 0.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256267217540764352",
      "date": "2026-09-29",
      "merchant": "Restricted Stock Deposit",
      "category": "Dividends & Capital Gains",
      "account": "Google Equity Awards (...ards)",
      "amount": 0.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256267217540764351",
      "date": "2026-09-29",
      "merchant": "Restricted Stock Deposit",
      "category": "Dividends & Capital Gains",
      "account": "Google Equity Awards (...ards)",
      "amount": 0.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "257363950156927042",
      "date": "2026-09-28",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256251685955457937",
      "date": "2026-09-28",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 2.65,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256251685955457936",
      "date": "2026-09-28",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 2.65,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256251685955457935",
      "date": "2026-09-28",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 49.71,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256251685955457934",
      "date": "2026-09-28",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 49.71,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256185341276868908",
      "date": "2026-09-28",
      "merchant": "Google",
      "category": "Shopping",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 92.94,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256184608625283798",
      "date": "2026-09-28",
      "merchant": "Anthem",
      "category": "Medical + Dentist",
      "account": "Primary Checking ...002 (....002)",
      "amount": 472.5,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "257363950156927038",
      "date": "2026-09-27",
      "merchant": "Excel Martial Arts",
      "category": "Child Activities",
      "account": "U CSP (...8373) due 15th",
      "amount": 100.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256159700906168601",
      "date": "2026-09-27",
      "merchant": "Monster Mini Golf",
      "category": "Entertainment & Recreation",
      "account": "T CSP 5914 due 15th ",
      "amount": 10.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256159700906168600",
      "date": "2026-09-27",
      "merchant": "Monster Mini Golf",
      "category": "Entertainment & Recreation",
      "account": "T CSP 5914 due 15th ",
      "amount": 31.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256072495879705529",
      "date": "2026-09-27",
      "merchant": "the YMCA",
      "category": "Child Care",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 107.1,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256121660683867111",
      "date": "2026-09-26",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U Amazon 9598 due 15th",
      "amount": 6.39,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256121660683867110",
      "date": "2026-09-26",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U Amazon 9598 due 15th",
      "amount": 25.39,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256121660683867109",
      "date": "2026-09-26",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U Amazon 9598 due 15th",
      "amount": 37.26,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256121660683867108",
      "date": "2026-09-26",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U Amazon 9598 due 15th",
      "amount": 8.5,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256069527218442423",
      "date": "2026-09-26",
      "merchant": "Bombay Heritage",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 110.81,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256033431269953674",
      "date": "2026-09-26",
      "merchant": "CB Pet Market",
      "category": "Mocha",
      "account": "U CSP (...8373) due 15th",
      "amount": 175.6,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256033431269953673",
      "date": "2026-09-26",
      "merchant": "La Vida Salon",
      "category": "Self care + Grooming",
      "account": "U CSP (...8373) due 15th",
      "amount": 109.65,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256221449497891026",
      "date": "2026-09-25",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 61.95,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256221449497891025",
      "date": "2026-09-25",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 61.95,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256221449203241159",
      "date": "2026-09-25",
      "merchant": "Plan Contribution",
      "category": "Buy",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 2925.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256221449203241158",
      "date": "2026-09-25",
      "merchant": "Source to Source/Fund to Fund Transfer In",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256221449203241157",
      "date": "2026-09-25",
      "merchant": "Source to Source/Fund to Fund Transfer Out",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255960167796461689",
      "date": "2026-09-25",
      "merchant": "Uber Eats",
      "category": "Eating out",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 61.12,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255960167796461688",
      "date": "2026-09-25",
      "merchant": "Uber Eats",
      "category": "Eating out",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 12.7,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255932002303759350",
      "date": "2026-09-25",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "360 Performance Savings (...4275)",
      "amount": 100.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255912395211821192",
      "date": "2026-09-25",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "Primary Checking ...002 (....002)",
      "amount": 4541.95,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255912395211821191",
      "date": "2026-09-25",
      "merchant": "Karina Oliveira De Araujo",
      "category": "Home maintenance",
      "account": "Primary Checking ...002 (....002)",
      "amount": 175.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255953003749069163",
      "date": "2026-09-24",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.31,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255953003749069162",
      "date": "2026-09-24",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.31,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255886521118773903",
      "date": "2026-09-24",
      "merchant": "Shake Shack",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 45.54,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255886521118773902",
      "date": "2026-09-24",
      "merchant": "Shake Shack",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 15.79,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255821240958734614",
      "date": "2026-09-24",
      "merchant": "Livingston Public",
      "category": "School stuff + Education",
      "account": "Primary Checking ...002 (....002)",
      "amount": 50.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255789873199862084",
      "date": "2026-09-24",
      "merchant": "the YMCA",
      "category": "Fitness",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 128.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255667151865139609",
      "date": "2026-09-24",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255821240958734615",
      "date": "2026-09-23",
      "merchant": "Randi Goldstein",
      "category": "Transfer",
      "account": "Primary Checking ...002 (....002)",
      "amount": 100.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255758340530393740",
      "date": "2026-09-23",
      "merchant": "Mindsoother",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 225.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255758340530393739",
      "date": "2026-09-23",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256121661254291467",
      "date": "2026-09-22",
      "merchant": "E-ZPass",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 50.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255849554856398910",
      "date": "2026-09-22",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255721504510595692",
      "date": "2026-09-22",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 218.39,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255721504510595691",
      "date": "2026-09-22",
      "merchant": "Columbia Bank",
      "category": "Credit Card + Financial Fees",
      "account": "Primary Checking ...002 (....002)",
      "amount": 64.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255690452100469089",
      "date": "2026-09-22",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 372.46,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255690452100469088",
      "date": "2026-09-22",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 372.46,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255690451730321722",
      "date": "2026-09-22",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 298.15,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255690451730321721",
      "date": "2026-09-22",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 298.15,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "256121666967982904",
      "date": "2026-09-21",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF 6579 due 15th",
      "amount": 5.63,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256121661254291468",
      "date": "2026-09-21",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U WOH.6581 due 21st",
      "amount": 218.39,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255575992410067706",
      "date": "2026-09-21",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF (...2344) due 15th",
      "amount": 5.63,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255568691816059576",
      "date": "2026-09-21",
      "merchant": "Charles Schwab",
      "category": "Transfer",
      "account": "360 Performance Savings (...4275)",
      "amount": 750.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255549765498458131",
      "date": "2026-09-21",
      "merchant": "Public Service Enterprise Group",
      "category": "Gas & Electric",
      "account": "Primary Checking ...002 (....002)",
      "amount": 25.37,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255549765498458130",
      "date": "2026-09-21",
      "merchant": "Charles Schwab",
      "category": "Transfer",
      "account": "Primary Checking ...002 (....002)",
      "amount": 600.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256121666967982907",
      "date": "2026-09-20",
      "merchant": "Google One",
      "category": "Subscriptions",
      "account": "U CFF 6579 due 15th",
      "amount": 10.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256121666967982906",
      "date": "2026-09-20",
      "merchant": "G1ai101a",
      "category": "Subscriptions",
      "account": "U CFF 6579 due 15th",
      "amount": 199.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256121666967982905",
      "date": "2026-09-20",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF 6579 due 15th",
      "amount": 30.25,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256121666967982903",
      "date": "2026-09-20",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF 6579 due 15th",
      "amount": 123.39,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "256121666967982902",
      "date": "2026-09-20",
      "merchant": "GoFundMe",
      "category": "Charity",
      "account": "U CFF 6579 due 15th",
      "amount": 102.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255758338781368635",
      "date": "2026-09-20",
      "merchant": "Google One",
      "category": "Subscriptions",
      "account": "U CFF (...2344) due 15th",
      "amount": 10.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255575992410067708",
      "date": "2026-09-20",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF (...2344) due 15th",
      "amount": 123.39,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255575992410067707",
      "date": "2026-09-20",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF (...2344) due 15th",
      "amount": 30.25,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255521328934178904",
      "date": "2026-09-20",
      "merchant": "Woofz Petcare",
      "category": "Shopping",
      "account": "T CSP 5914 due 15th ",
      "amount": 6.93,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255521328934178903",
      "date": "2026-09-20",
      "merchant": "Woofz Petcare",
      "category": "Shopping",
      "account": "T CSP 5914 due 15th ",
      "amount": 9.79,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255505056695603589",
      "date": "2026-09-20",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 40.97,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255505056695603588",
      "date": "2026-09-20",
      "merchant": "Disney",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 2.42,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675639031",
      "date": "2026-09-20",
      "merchant": "Summit Medical Group PA",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 20.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591196",
      "date": "2026-09-20",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 23.82,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580408",
      "date": "2026-09-20",
      "merchant": "G1ai101a",
      "category": "Subscriptions",
      "account": "U CFF (...2344) due 15th",
      "amount": 199.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580290",
      "date": "2026-09-20",
      "merchant": "GoFundMe",
      "category": "Charity",
      "account": "U CFF (...2344) due 15th",
      "amount": 102.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255469414452318305",
      "date": "2026-09-20",
      "merchant": "Costco",
      "category": "Groceries",
      "account": "Costco Visa 3744 due 17th",
      "amount": 176.49,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255449055474766620",
      "date": "2026-09-20",
      "merchant": "the YMCA",
      "category": "Child Care",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 107.1,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987970",
      "date": "2026-09-18",
      "merchant": "Apple",
      "category": "Subscriptions",
      "account": "U CSP (...8373) due 15th",
      "amount": 9.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580462",
      "date": "2026-09-18",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF (...2344) due 15th",
      "amount": 42.15,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580431",
      "date": "2026-09-18",
      "merchant": "Otter",
      "category": "Eating out",
      "account": "U CFF (...2344) due 15th",
      "amount": 52.17,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580421",
      "date": "2026-09-18",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF (...2344) due 15th",
      "amount": 17.05,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255414732603282178",
      "date": "2026-09-18",
      "merchant": "Dividend Received Ishares Core S&p Mid Cap Etf (Ijh) (Cash)",
      "category": "Dividends & Capital Gains",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 111.8,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255414732603282177",
      "date": "2026-09-18",
      "merchant": "Dividend Received Ishares Core S&p Small Cap E (Ijr) (Cash)",
      "category": "Dividends & Capital Gains",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 124.3,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255414732603282176",
      "date": "2026-09-18",
      "merchant": "Purchase Into Core Account Cash (315994103) (Cash)",
      "category": "Dividends & Capital Gains",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 236.1,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255389878127711033",
      "date": "2026-09-18",
      "merchant": "Capital One",
      "category": "Interest",
      "account": "CD (...2555)",
      "amount": 95.38,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255364326780064493",
      "date": "2026-09-18",
      "merchant": "Electronic Withdrawal",
      "category": "Transfer",
      "account": "Primary Checking ...002 (....002)",
      "amount": 750.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255337236051546196",
      "date": "2026-09-18",
      "merchant": "Scream Truck",
      "category": "Eating out",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 18.55,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255335029144047738",
      "date": "2026-09-18",
      "merchant": "Meyer Depew",
      "category": "Home maintenance",
      "account": "T CSP 5914 due 15th ",
      "amount": 39.94,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255334331011584054",
      "date": "2026-09-18",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF 6579 due 15th",
      "amount": 42.15,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255334331011584053",
      "date": "2026-09-18",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF 6579 due 15th",
      "amount": 17.05,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255334331011584052",
      "date": "2026-09-18",
      "merchant": "OTTER* BERGEN MUNCH",
      "category": "Eating out",
      "account": "U CFF 6579 due 15th",
      "amount": 52.17,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580463",
      "date": "2026-09-17",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CFF (...2344) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580396",
      "date": "2026-09-17",
      "merchant": "Tony Boy's Sandwich House",
      "category": "Eating out",
      "account": "U CFF (...2344) due 15th",
      "amount": 63.63,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255307737475862700",
      "date": "2026-09-17",
      "merchant": "Autopay",
      "category": "Credit Card Payment",
      "account": "Costco Visa 3744 due 17th",
      "amount": 208.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255255304571737074",
      "date": "2026-09-17",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 3.32,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255255304571737073",
      "date": "2026-09-17",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 3.32,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255237583518847892",
      "date": "2026-09-17",
      "merchant": "PM Pediatrics",
      "category": "Medical + Dentist",
      "account": "T CSP 5914 due 15th ",
      "amount": 30.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255237583518847890",
      "date": "2026-09-17",
      "merchant": "CVS",
      "category": "Medical + Dentist",
      "account": "T CSP 5914 due 15th ",
      "amount": 22.38,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255236929260901344",
      "date": "2026-09-17",
      "merchant": "Tony Boys Sandwich",
      "category": "Eating out",
      "account": "U CFF 6579 due 15th",
      "amount": 63.63,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255194941766521788",
      "date": "2026-09-17",
      "merchant": "PennyMac",
      "category": "Mortgage",
      "account": "Primary Checking ...002 (....002)",
      "amount": 5933.22,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255194941766521787",
      "date": "2026-09-17",
      "merchant": "Citi",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 208.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675639080",
      "date": "2026-09-16",
      "merchant": "Mindsoother",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 225.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580455",
      "date": "2026-09-16",
      "merchant": "Harrison Nj Garage Fla",
      "category": "Transportation",
      "account": "U CFF (...2344) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255236929260901345",
      "date": "2026-09-16",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CFF 6579 due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255225045877019458",
      "date": "2026-09-16",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.59,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255225045877019457",
      "date": "2026-09-16",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.59,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255194941766521792",
      "date": "2026-09-16",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 36.78,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255194941766521791",
      "date": "2026-09-16",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 726.55,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255194941766521790",
      "date": "2026-09-16",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 743.74,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255194941766521789",
      "date": "2026-09-16",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 5369.38,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255146416523465512",
      "date": "2026-09-16",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "T CSP 5914 due 15th ",
      "amount": 27.86,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255145805147034171",
      "date": "2026-09-16",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CFF 6579 due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591072",
      "date": "2026-09-15",
      "merchant": "Mindful Medicine",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 300.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988237",
      "date": "2026-09-15",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U CSP (...8373) due 15th",
      "amount": 5369.38,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580384",
      "date": "2026-09-15",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U CFF (...2344) due 15th",
      "amount": 743.74,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255146416523465511",
      "date": "2026-09-15",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "T CSP 5914 due 15th ",
      "amount": 726.55,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255145805147034172",
      "date": "2026-09-15",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U CFF 6579 due 15th",
      "amount": 743.74,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255145803352920532",
      "date": "2026-09-15",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U Amazon 9598 due 15th",
      "amount": 36.78,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255137596665516420",
      "date": "2026-09-15",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 4.26,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255137596665516419",
      "date": "2026-09-15",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 4.26,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255054827470999572",
      "date": "2026-09-15",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255009508552101929",
      "date": "2026-09-15",
      "merchant": "Erco Lig",
      "category": "Paychecks",
      "account": "Primary Checking ...002 (....002)",
      "amount": 4816.91,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255484189674591216",
      "date": "2026-09-14",
      "merchant": "Mindsoother",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 225.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580375",
      "date": "2026-09-14",
      "merchant": "Hui Tou Xiang",
      "category": "Eating out",
      "account": "U CFF (...2344) due 15th",
      "amount": 124.91,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255049994542272696",
      "date": "2026-09-14",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 44.99,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255049994542272695",
      "date": "2026-09-14",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 15.66,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255049994542272694",
      "date": "2026-09-14",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 60.65,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254982281026360233",
      "date": "2026-09-14",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Google Equity Awards (...ards)",
      "amount": 302.51,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254981856717984316",
      "date": "2026-09-14",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 37.95,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254981856717984315",
      "date": "2026-09-14",
      "merchant": "Barnes & Noble",
      "category": "Shopping",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 41.56,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254981856717984314",
      "date": "2026-09-14",
      "merchant": "the YMCA",
      "category": "Child Care",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 107.1,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254947408738800034",
      "date": "2026-09-14",
      "merchant": "Hui Tou Xiang",
      "category": "Eating out",
      "account": "U CFF 6579 due 15th",
      "amount": 124.91,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254869324394156425",
      "date": "2026-09-13",
      "merchant": "Deshe Landscaping",
      "category": "Home maintenance",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 459.04,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254869324394156423",
      "date": "2026-09-13",
      "merchant": "Excel Martial Arts",
      "category": "Child Activities",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 100.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254766698143962089",
      "date": "2026-09-12",
      "merchant": "China Chalet",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 104.61,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254766698143962088",
      "date": "2026-09-12",
      "merchant": "Turtle Back Zoo",
      "category": "Entertainment & Recreation",
      "account": "T CSP 5914 due 15th ",
      "amount": 26.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254766698143962087",
      "date": "2026-09-12",
      "merchant": "McDonald's",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 15.55,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254766698143962086",
      "date": "2026-09-12",
      "merchant": "The Milkshake Factor",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 24.5,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254694321623158800",
      "date": "2026-09-11",
      "merchant": "Plan Contribution",
      "category": "Buy",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 2115.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254694321623158799",
      "date": "2026-09-11",
      "merchant": "Source to Source/Fund to Fund Transfer In",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254694321623158798",
      "date": "2026-09-11",
      "merchant": "Source to Source/Fund to Fund Transfer Out",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254675752004899735",
      "date": "2026-09-11",
      "merchant": "Domino's",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 26.94,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254652116626853955",
      "date": "2026-09-11",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "360 Performance Savings (...4275)",
      "amount": 35.16,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254652116626853954",
      "date": "2026-09-11",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "360 Performance Savings (...4275)",
      "amount": 100.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254650403701412757",
      "date": "2026-09-11",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "Primary Checking ...002 (....002)",
      "amount": 5351.95,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254650403701412756",
      "date": "2026-09-11",
      "merchant": "Excel Martial Arts",
      "category": "Child Activities",
      "account": "Primary Checking ...002 (....002)",
      "amount": 357.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254650403701412755",
      "date": "2026-09-11",
      "merchant": "Karina Oliveira De Araujo",
      "category": "Transfer",
      "account": "Primary Checking ...002 (....002)",
      "amount": 175.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591071",
      "date": "2026-09-10",
      "merchant": "SimpliSafe",
      "category": "Home Security",
      "account": "U CSP (...8373) due 15th",
      "amount": 24.51,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580334",
      "date": "2026-09-10",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF (...2344) due 15th",
      "amount": 47.82,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254688501430767794",
      "date": "2026-09-10",
      "merchant": "Dividend Received Microsoft Corp (Msft) (Cash)",
      "category": "Dividends & Capital Gains",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 0.55,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254688501430767793",
      "date": "2026-09-10",
      "merchant": "Purchase Into Core Account Cash (315994103) (Cash)",
      "category": "Dividends & Capital Gains",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 0.55,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254606747562955528",
      "date": "2026-09-10",
      "merchant": "Organon & Co Dividend Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Individual Brokerage -9148 (...9148)",
      "amount": 0.08,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254606363032309925",
      "date": "2026-09-10",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 5.26,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254606363032309924",
      "date": "2026-09-10",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 5.26,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254606363032309923",
      "date": "2026-09-10",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 3.25,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254606363032309922",
      "date": "2026-09-10",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 3.25,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254606362750242946",
      "date": "2026-09-10",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 63.2,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254606362750242945",
      "date": "2026-09-10",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 63.2,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254583535279034720",
      "date": "2026-09-10",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF 6579 due 15th",
      "amount": 47.82,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638915",
      "date": "2026-09-09",
      "merchant": "Mindsoother",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 225.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254493016785965400",
      "date": "2026-09-09",
      "merchant": "ShopRite",
      "category": "Groceries",
      "account": "T CSP 5914 due 15th ",
      "amount": 25.13,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254476721322479620",
      "date": "2026-09-09",
      "merchant": "The New York Times",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 4.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254476721322479618",
      "date": "2026-09-09",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254464212899221877",
      "date": "2026-09-09",
      "merchant": "Verizon",
      "category": "Internet & Cable",
      "account": "Primary Checking ...002 (....002)",
      "amount": 79.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254439245821267974",
      "date": "2026-09-09",
      "merchant": "Fee",
      "category": "Credit Card + Financial Fees",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 1.25,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254588978092069592",
      "date": "2026-09-08",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254439245287543776",
      "date": "2026-09-08",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 52.22,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254439245287543775",
      "date": "2026-09-08",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 52.22,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254439245287543774",
      "date": "2026-09-08",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 62.68,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254439245287543773",
      "date": "2026-09-08",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 62.68,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254420109557780491",
      "date": "2026-09-08",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254373053342437897",
      "date": "2026-09-08",
      "merchant": "Venmo",
      "category": "Self care + Grooming",
      "account": "Primary Checking ...002 (....002)",
      "amount": 151.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254373053342437896",
      "date": "2026-09-08",
      "merchant": "American Express",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 2299.03,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254373053342437895",
      "date": "2026-09-08",
      "merchant": "Xoom",
      "category": "Travel & Vacation",
      "account": "Primary Checking ...002 (....002)",
      "amount": 803.09,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638885",
      "date": "2026-09-07",
      "merchant": "Deshe Landscaping",
      "category": "Home maintenance",
      "account": "U CSP (...8373) due 15th",
      "amount": 623.76,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988279",
      "date": "2026-09-07",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 31.53,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580353",
      "date": "2026-09-07",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF (...2344) due 15th",
      "amount": 43.16,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254476721322479619",
      "date": "2026-09-07",
      "merchant": "American Express",
      "category": "Other Income (incl cc reward credits)",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 100.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254373053342437899",
      "date": "2026-09-07",
      "merchant": "Charles Schwab",
      "category": "Home maintenance",
      "account": "Primary Checking ...002 (....002)",
      "amount": 25.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254373053342437898",
      "date": "2026-09-07",
      "merchant": "Lidiya Rothstein",
      "category": "Child Activities",
      "account": "Primary Checking ...002 (....002)",
      "amount": 25.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254310067036770903",
      "date": "2026-09-07",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF 6579 due 15th",
      "amount": 43.16,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254310066067886627",
      "date": "2026-09-07",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 31.53,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254310066067886626",
      "date": "2026-09-07",
      "merchant": "Deshe Landscaping",
      "category": "Home maintenance",
      "account": "U CSP 9369 due 15th",
      "amount": 623.76,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254289201750102701",
      "date": "2026-09-07",
      "merchant": "Kids Savings Account",
      "category": "Transfer",
      "account": "360 Performance Savings (...4275)",
      "amount": 25.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254289200143684203",
      "date": "2026-09-07",
      "merchant": "Capital One",
      "category": "Interest",
      "account": "Kids Savings Account (...8421)",
      "amount": 25.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255484187761988320",
      "date": "2026-09-06",
      "merchant": "the YMCA",
      "category": "Child Care",
      "account": "U CSP (...8373) due 15th",
      "amount": 107.1,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254252240485241568",
      "date": "2026-09-06",
      "merchant": "Agricola",
      "category": "Eating out",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 223.17,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254220190024749153",
      "date": "2026-09-06",
      "merchant": "Costco",
      "category": "Groceries",
      "account": "T CSP 5914 due 15th ",
      "amount": 33.97,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254220190024749152",
      "date": "2026-09-06",
      "merchant": "Target",
      "category": "Shopping",
      "account": "T CSP 5914 due 15th ",
      "amount": 28.64,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254220190024749151",
      "date": "2026-09-06",
      "merchant": "Dehart Garage",
      "category": "Transportation",
      "account": "T CSP 5914 due 15th ",
      "amount": 3.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254220190024749150",
      "date": "2026-09-06",
      "merchant": "Costco",
      "category": "Groceries",
      "account": "T CSP 5914 due 15th ",
      "amount": 1492.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254219345883320635",
      "date": "2026-09-06",
      "merchant": "the YMCA",
      "category": "Child Care",
      "account": "U CSP 9369 due 15th",
      "amount": 107.1,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580385",
      "date": "2026-09-05",
      "merchant": "Google One",
      "category": "Subscriptions",
      "account": "U CFF (...2344) due 15th",
      "amount": 18.84,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580364",
      "date": "2026-09-05",
      "merchant": "Google One",
      "category": "Subscriptions",
      "account": "U CFF (...2344) due 15th",
      "amount": 19.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254310067036770902",
      "date": "2026-09-05",
      "merchant": "Google One",
      "category": "Subscriptions",
      "account": "U CFF 6579 due 15th",
      "amount": 18.84,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254308230343709320",
      "date": "2026-09-05",
      "merchant": "American Express",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 3.69,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254197356848239031",
      "date": "2026-09-05",
      "merchant": "American Express",
      "category": "Credit Card Payment",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 2299.03,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254141939227055014",
      "date": "2026-09-05",
      "merchant": "Disney",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 8.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254141938989028251",
      "date": "2026-09-05",
      "merchant": "Disney",
      "category": "Subscriptions",
      "account": "U Amex EveryDay 3003 due 5th",
      "amount": 38.37,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254129635781530087",
      "date": "2026-09-05",
      "merchant": "Dunkin'",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 8.39,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254128836986819556",
      "date": "2026-09-05",
      "merchant": "Google One",
      "category": "Subscriptions",
      "account": "U CFF 6579 due 15th",
      "amount": 19.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988238",
      "date": "2026-09-04",
      "merchant": "The Great Greek",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 70.33,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988108",
      "date": "2026-09-04",
      "merchant": "HARRISON NJ GARAGE",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254197356848239032",
      "date": "2026-09-04",
      "merchant": "American Express",
      "category": "Credit Card Payment",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 209.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254086673298117522",
      "date": "2026-09-04",
      "merchant": "Livingston Public",
      "category": "School stuff + Education",
      "account": "Primary Checking ...002 (....002)",
      "amount": 50.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254038905749787296",
      "date": "2026-09-04",
      "merchant": "Veterinary Medical Center",
      "category": "Mocha",
      "account": "T CSP 5914 due 15th ",
      "amount": 87.49,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254038905749787295",
      "date": "2026-09-04",
      "merchant": "Smile Perfection",
      "category": "Medical + Dentist",
      "account": "T CSP 5914 due 15th ",
      "amount": 448.4,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254038035275469529",
      "date": "2026-09-04",
      "merchant": "The Great Greek",
      "category": "Eating out",
      "account": "U CSP 9369 due 15th",
      "amount": 70.33,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254038035275469528",
      "date": "2026-09-04",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CSP 9369 due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254030762687877551",
      "date": "2026-09-04",
      "merchant": "Clear",
      "category": "Credit Card Payment",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 209.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988197",
      "date": "2026-09-03",
      "merchant": "Chewy",
      "category": "Mocha",
      "account": "U CSP (...8373) due 15th",
      "amount": 69.08,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988019",
      "date": "2026-09-03",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987971",
      "date": "2026-09-03",
      "merchant": "FirstEnergy",
      "category": "Gas & Electric",
      "account": "U CSP (...8373) due 15th",
      "amount": 488.56,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254052929334956109",
      "date": "2026-09-03",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 610.26,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254052929334956108",
      "date": "2026-09-03",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 610.26,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254052929334956107",
      "date": "2026-09-03",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 360.91,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254052929334956106",
      "date": "2026-09-03",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 360.91,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254052928713150484",
      "date": "2026-09-03",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.08,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254052928441569280",
      "date": "2026-09-03",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 52.98,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254052928440521727",
      "date": "2026-09-03",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 52.98,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254052927976002525",
      "date": "2026-09-03",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 245.28,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254052927976002524",
      "date": "2026-09-03",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 245.28,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254052927976002523",
      "date": "2026-09-03",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 162.83,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254052927976002522",
      "date": "2026-09-03",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 162.83,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "254038035973821212",
      "date": "2026-09-03",
      "merchant": "E-ZPass",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 50.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254038035275469527",
      "date": "2026-09-03",
      "merchant": "Chewy",
      "category": "Mocha",
      "account": "U CSP 9369 due 15th",
      "amount": 69.08,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253947716906275078",
      "date": "2026-09-03",
      "merchant": "McDonald's",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 36.52,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253946838711292610",
      "date": "2026-09-03",
      "merchant": "FirstEnergy",
      "category": "Gas & Electric",
      "account": "U CSP 9369 due 15th",
      "amount": 488.56,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591217",
      "date": "2026-09-02",
      "merchant": "US Postal Service",
      "category": "Shopping",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.09,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988321",
      "date": "2026-09-02",
      "merchant": "Mindsoother",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 225.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254141939227055015",
      "date": "2026-09-02",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 13.81,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "254030762687877552",
      "date": "2026-09-02",
      "merchant": "American Express",
      "category": "Other Income (incl cc reward credits)",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 21.31,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253965020909031643",
      "date": "2026-09-02",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 2.33,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253965020909031642",
      "date": "2026-09-02",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 2.33,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253965020909031641",
      "date": "2026-09-02",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.08,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253946840494920554",
      "date": "2026-09-02",
      "merchant": "Riker Hill",
      "category": "Child Activities",
      "account": "U WOH.6581 due 21st",
      "amount": 26.03,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253917791835934865",
      "date": "2026-09-02",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 13.81,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253861582525190602",
      "date": "2026-09-02",
      "merchant": "Disney",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 21.31,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253856665871864757",
      "date": "2026-09-02",
      "merchant": "Dunkin'",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 5.84,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253855768564486672",
      "date": "2026-09-02",
      "merchant": "Mindsoother",
      "category": "Medical + Dentist",
      "account": "U CSP 9369 due 15th",
      "amount": 225.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253855768564486671",
      "date": "2026-09-02",
      "merchant": "US Postal Service",
      "category": "Shopping",
      "account": "U CSP 9369 due 15th",
      "amount": 18.09,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638914",
      "date": "2026-09-01",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591176",
      "date": "2026-09-01",
      "merchant": "16 Handles",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 25.81,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253946838711292609",
      "date": "2026-09-01",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CSP 9369 due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253789746988864174",
      "date": "2026-09-01",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 3.42,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253789746988864173",
      "date": "2026-09-01",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 3.42,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253764474127274762",
      "date": "2026-09-01",
      "merchant": "Harrison Garage",
      "category": "Transportation",
      "account": "U CSP 9369 due 15th",
      "amount": 18.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253764474127274761",
      "date": "2026-09-01",
      "merchant": "16 Handles",
      "category": "Eating out",
      "account": "U CSP 9369 due 15th",
      "amount": 25.81,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253741591663498197",
      "date": "2026-09-01",
      "merchant": "Anthem",
      "category": "Medical + Dentist",
      "account": "Primary Checking ...002 (....002)",
      "amount": 157.5,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591119",
      "date": "2026-08-31",
      "merchant": "Apple",
      "category": "Subscriptions",
      "account": "U CSP (...8373) due 15th",
      "amount": 3.19,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253789747976622876",
      "date": "2026-08-31",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 439.84,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253789747976622875",
      "date": "2026-08-31",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 439.84,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253789747976622874",
      "date": "2026-08-31",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 273.8,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253789747976622873",
      "date": "2026-08-31",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 273.8,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253789746988864176",
      "date": "2026-08-31",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.07,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253789746988864175",
      "date": "2026-08-31",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.07,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253789746414244454",
      "date": "2026-08-31",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 1.53,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253789746414244453",
      "date": "2026-08-31",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 1.53,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253789745816556054",
      "date": "2026-08-31",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 196.22,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253789745816556053",
      "date": "2026-08-31",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 196.22,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253789745816556052",
      "date": "2026-08-31",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 117.75,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253789745816556051",
      "date": "2026-08-31",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 117.75,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253744994208732128",
      "date": "2026-08-31",
      "merchant": "Capital One",
      "category": "Interest",
      "account": "360 Checking (...5441)",
      "amount": 0.1,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253744992860262992",
      "date": "2026-08-31",
      "merchant": "Capital One",
      "category": "Interest",
      "account": "360 Performance Savings (...4275)",
      "amount": 527.91,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253744991465657339",
      "date": "2026-08-31",
      "merchant": "Capital One",
      "category": "Interest",
      "account": "Kids Savings Account (...8421)",
      "amount": 0.25,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253741591663498199",
      "date": "2026-08-31",
      "merchant": "Erco Lig",
      "category": "Paychecks",
      "account": "Primary Checking ...002 (....002)",
      "amount": 4787.55,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253741591663498198",
      "date": "2026-08-31",
      "merchant": "Charles Schwab",
      "category": "Interest",
      "account": "Primary Checking ...002 (....002)",
      "amount": 0.18,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253692726208909907",
      "date": "2026-08-31",
      "merchant": "Interest Earned Cash (315994103) (Cash)",
      "category": "Interest",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 12.79,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253692726208909906",
      "date": "2026-08-31",
      "merchant": "Reinvestment Cash (315994103) (Cash)",
      "category": "Buy",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 12.79,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253673220476522579",
      "date": "2026-08-31",
      "merchant": "Apple",
      "category": "Subscriptions",
      "account": "U CSP 9369 due 15th",
      "amount": 3.19,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638982",
      "date": "2026-08-30",
      "merchant": "NJ Psychiatric Group",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 20.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638789",
      "date": "2026-08-30",
      "merchant": "Center Court",
      "category": "Child Activities",
      "account": "U CSP (...8373) due 15th",
      "amount": 35.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988156",
      "date": "2026-08-30",
      "merchant": "Costco",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 250.53,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988039",
      "date": "2026-08-30",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 52.3,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987922",
      "date": "2026-08-30",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 10.66,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987921",
      "date": "2026-08-30",
      "merchant": "the YMCA",
      "category": "Child Care",
      "account": "U CSP (...8373) due 15th",
      "amount": 107.1,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987853",
      "date": "2026-08-30",
      "merchant": "CenterCourt Chatham",
      "category": "Child Activities",
      "account": "U CSP (...8373) due 15th",
      "amount": 35.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253765318111416817",
      "date": "2026-08-30",
      "merchant": "Annual Hotel",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 100.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253673220476522580",
      "date": "2026-08-30",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 10.66,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253582217369375052",
      "date": "2026-08-30",
      "merchant": "Costco",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 250.53,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253582217369375051",
      "date": "2026-08-30",
      "merchant": "Center Court",
      "category": "Child Activities",
      "account": "U CSP 9369 due 15th",
      "amount": 35.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253582217369375050",
      "date": "2026-08-30",
      "merchant": "NJ Psychiatric Group",
      "category": "Medical + Dentist",
      "account": "U CSP 9369 due 15th",
      "amount": 20.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253582217369375049",
      "date": "2026-08-30",
      "merchant": "the YMCA",
      "category": "Child Care",
      "account": "U CSP 9369 due 15th",
      "amount": 107.1,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253582217369375048",
      "date": "2026-08-30",
      "merchant": "Center Court",
      "category": "Child Activities",
      "account": "U CSP 9369 due 15th",
      "amount": 35.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253582217369375047",
      "date": "2026-08-30",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 52.3,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675639059",
      "date": "2026-08-29",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 13.6,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638983",
      "date": "2026-08-29",
      "merchant": "Grubhub",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 97.85,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591120",
      "date": "2026-08-29",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 39.23,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987991",
      "date": "2026-08-29",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 27.69,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580315",
      "date": "2026-08-29",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF (...2344) due 15th",
      "amount": 83.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253491752762626538",
      "date": "2026-08-29",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF 6579 due 15th",
      "amount": 83.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253491751849316763",
      "date": "2026-08-29",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 13.6,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253491751849316762",
      "date": "2026-08-29",
      "merchant": "Grubhub",
      "category": "Eating out",
      "account": "U CSP 9369 due 15th",
      "amount": 97.85,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253491751849316761",
      "date": "2026-08-29",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 39.23,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253491751849316760",
      "date": "2026-08-29",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 27.69,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253492543752786659",
      "date": "2026-08-28",
      "merchant": "BJ's Restaurant",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 40.78,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253492543752786658",
      "date": "2026-08-28",
      "merchant": "Ford Motor Company",
      "category": "Transportation",
      "account": "T CSP 5914 due 15th ",
      "amount": 24.09,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253441908927910793",
      "date": "2026-08-28",
      "merchant": "Source to Source/Fund to Fund Transfer Out",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253441908927910792",
      "date": "2026-08-28",
      "merchant": "Source to Source/Fund to Fund Transfer In",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253441908927910791",
      "date": "2026-08-28",
      "merchant": "Plan Contribution",
      "category": "Buy",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 2115.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253441908554617718",
      "date": "2026-08-28",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 43.63,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253441908554617717",
      "date": "2026-08-28",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 43.63,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253401821500428595",
      "date": "2026-08-28",
      "merchant": "Stop & Shop",
      "category": "Groceries",
      "account": "T CSP 5914 due 15th ",
      "amount": 4.49,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253401821500428593",
      "date": "2026-08-28",
      "merchant": "Chase",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 251.85,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253401065597719471",
      "date": "2026-08-28",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253383136309170751",
      "date": "2026-08-28",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "360 Performance Savings (...4275)",
      "amount": 100.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253365384828703312",
      "date": "2026-08-28",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "Primary Checking ...002 (....002)",
      "amount": 5351.95,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253375970108002969",
      "date": "2026-08-27",
      "merchant": "Restricted Stock Deposit",
      "category": "Transfer",
      "account": "Google Equity Awards (...ards)",
      "amount": 0.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253375970108002968",
      "date": "2026-08-27",
      "merchant": "Restricted Stock Deposit",
      "category": "Dividends & Capital Gains",
      "account": "Google Equity Awards (...ards)",
      "amount": 0.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253375970108002967",
      "date": "2026-08-27",
      "merchant": "Restricted Stock Deposit",
      "category": "Dividends & Capital Gains",
      "account": "Google Equity Awards (...ards)",
      "amount": 0.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253309514823520580",
      "date": "2026-08-27",
      "merchant": "Miga Sushi",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 101.25,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253308753223897354",
      "date": "2026-08-27",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638845",
      "date": "2026-08-26",
      "merchant": "Donut Basket",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 21.7,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253217482505474884",
      "date": "2026-08-26",
      "merchant": "Donut Basket",
      "category": "Eating out",
      "account": "U CSP 9369 due 15th",
      "amount": 21.7,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675639060",
      "date": "2026-08-25",
      "merchant": "Domino's",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 34.27,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988176",
      "date": "2026-08-25",
      "merchant": "The Week Junior",
      "category": "School stuff + Education",
      "account": "U CSP (...8373) due 15th",
      "amount": 59.95,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253236801822019895",
      "date": "2026-08-25",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 1.19,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253236801822019894",
      "date": "2026-08-25",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 1.19,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "253126221467505414",
      "date": "2026-08-25",
      "merchant": "The Week Junior",
      "category": "School stuff + Education",
      "account": "U CSP 9369 due 15th",
      "amount": 59.95,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253126221467505413",
      "date": "2026-08-25",
      "merchant": "Domino's",
      "category": "Eating out",
      "account": "U CSP 9369 due 15th",
      "amount": 34.27,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987893",
      "date": "2026-08-24",
      "merchant": "the YMCA",
      "category": "Fitness",
      "account": "U CSP (...8373) due 15th",
      "amount": 128.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253075806757606072",
      "date": "2026-08-24",
      "merchant": "Venmo",
      "category": "Child Activities",
      "account": "Primary Checking ...002 (....002)",
      "amount": 15.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253075806757606071",
      "date": "2026-08-24",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 112.26,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253035074126631874",
      "date": "2026-08-24",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "253035072524407629",
      "date": "2026-08-24",
      "merchant": "the YMCA",
      "category": "Fitness",
      "account": "U CSP 9369 due 15th",
      "amount": 128.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988088",
      "date": "2026-08-23",
      "merchant": "Etsy",
      "category": "Shopping",
      "account": "U CSP (...8373) due 15th",
      "amount": 29.86,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987854",
      "date": "2026-08-23",
      "merchant": "Etsy",
      "category": "Shopping",
      "account": "U CSP (...8373) due 15th",
      "amount": 253.51,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252994613850689545",
      "date": "2026-08-23",
      "merchant": "Carrie DiStefano",
      "category": "Mocha",
      "account": "Primary Checking ...002 (....002)",
      "amount": 340.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252944810450112855",
      "date": "2026-08-23",
      "merchant": "AFC South",
      "category": "Medical + Dentist",
      "account": "T CSP 5914 due 15th ",
      "amount": 30.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252944810450112854",
      "date": "2026-08-23",
      "merchant": "CVS",
      "category": "Medical + Dentist",
      "account": "T CSP 5914 due 15th ",
      "amount": 15.66,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252944014067127265",
      "date": "2026-08-23",
      "merchant": "Etsy",
      "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
      "account": "U CSP 9369 due 15th",
      "amount": 29.86,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252944014067127264",
      "date": "2026-08-23",
      "merchant": "Etsy",
      "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
      "account": "U CSP 9369 due 15th",
      "amount": 253.51,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638954",
      "date": "2026-08-22",
      "merchant": "Trader Joe's",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 166.15,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988259",
      "date": "2026-08-22",
      "merchant": "Lavana Reflexology & Day",
      "category": "Self care + Grooming",
      "account": "U CSP (...8373) due 15th",
      "amount": 74.64,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988068",
      "date": "2026-08-22",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 45.63,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252854434784629511",
      "date": "2026-08-22",
      "merchant": "Play It Again Sports",
      "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
      "account": "T CSP 5914 due 15th ",
      "amount": 85.26,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252853570168706017",
      "date": "2026-08-22",
      "merchant": "Trader Joe's",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 166.15,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252853570168706016",
      "date": "2026-08-22",
      "merchant": "Lavana Reflexology & Day",
      "category": "Self care + Grooming",
      "account": "U CSP 9369 due 15th",
      "amount": 74.64,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252853570168706015",
      "date": "2026-08-22",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 45.63,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988196",
      "date": "2026-08-21",
      "merchant": "Mindful Medicine",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 300.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580302",
      "date": "2026-08-21",
      "merchant": "Namkeen - Chatham",
      "category": "Eating out",
      "account": "U CFF (...2344) due 15th",
      "amount": 55.8,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252929491202495042",
      "date": "2026-08-21",
      "merchant": "Charles Schwab",
      "category": "Transfer",
      "account": "360 Performance Savings (...4275)",
      "amount": 750.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252853573179166908",
      "date": "2026-08-21",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U WOH.6581 due 21st",
      "amount": 112.26,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252763156576227858",
      "date": "2026-08-21",
      "merchant": "Staples",
      "category": "Shopping",
      "account": "T CSP 5914 due 15th ",
      "amount": 5.67,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252762371980283997",
      "date": "2026-08-21",
      "merchant": "Namkeen",
      "category": "Eating out",
      "account": "U CFF 6579 due 15th",
      "amount": 55.8,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252762369819169729",
      "date": "2026-08-21",
      "merchant": "Mindful Medicine",
      "category": "Medical + Dentist",
      "account": "U CSP 9369 due 15th",
      "amount": 300.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252731450551980498",
      "date": "2026-08-21",
      "merchant": "Public Service Enterprise Group",
      "category": "Gas & Electric",
      "account": "Primary Checking ...002 (....002)",
      "amount": 29.76,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987840",
      "date": "2026-08-20",
      "merchant": "Subway",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 9.95,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580297",
      "date": "2026-08-20",
      "merchant": "Nayax",
      "category": "Transportation",
      "account": "U CFF (...2344) due 15th",
      "amount": 4.48,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252853572172533810",
      "date": "2026-08-20",
      "merchant": "Nayax",
      "category": "Transportation",
      "account": "U CFF 6579 due 15th",
      "amount": 4.48,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252763156576227857",
      "date": "2026-08-20",
      "merchant": "Nayax",
      "category": "Transportation",
      "account": "T CSP 5914 due 15th ",
      "amount": 21.14,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252762369819169730",
      "date": "2026-08-20",
      "merchant": "Subway",
      "category": "Eating out",
      "account": "U CSP 9369 due 15th",
      "amount": 9.95,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252731450551980500",
      "date": "2026-08-20",
      "merchant": "Charles Schwab",
      "category": "Transfer",
      "account": "Primary Checking ...002 (....002)",
      "amount": 750.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252731450551980499",
      "date": "2026-08-20",
      "merchant": "Charles Schwab",
      "category": "Transfer",
      "account": "Primary Checking ...002 (....002)",
      "amount": 600.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252671972856058517",
      "date": "2026-08-20",
      "merchant": "McDonald's",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 10.91,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252671972856058516",
      "date": "2026-08-20",
      "merchant": "Dunkin'",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 18.83,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252671972856058515",
      "date": "2026-08-20",
      "merchant": "Panera Bread",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 6.48,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252671972856058514",
      "date": "2026-08-20",
      "merchant": "Seed Bagel Shop",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 47.24,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252622287356318316",
      "date": "2026-08-19",
      "merchant": "Charles Schwab",
      "category": "Water",
      "account": "Primary Checking ...002 (....002)",
      "amount": 889.01,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252580963866399710",
      "date": "2026-08-19",
      "merchant": "Seven Presidents Park",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 30.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638996",
      "date": "2026-08-18",
      "merchant": "Well Bred",
      "category": "Mocha",
      "account": "U CSP (...8373) due 15th",
      "amount": 9.59,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638833",
      "date": "2026-08-18",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 40.32,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988045",
      "date": "2026-08-18",
      "merchant": "Apple",
      "category": "Subscriptions",
      "account": "U CSP (...8373) due 15th",
      "amount": 9.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987880",
      "date": "2026-08-18",
      "merchant": "CRAVE AND CO RESTAURANT",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 55.25,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252568135222710947",
      "date": "2026-08-18",
      "merchant": "Capital One",
      "category": "Interest",
      "account": "CD (...2555)",
      "amount": 95.07,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "252537392253653337",
      "date": "2026-08-18",
      "merchant": "Anthem",
      "category": "Medical + Dentist",
      "account": "Primary Checking ...002 (....002)",
      "amount": 157.5,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252537392253653336",
      "date": "2026-08-18",
      "merchant": "Zelle",
      "category": "School stuff + Education",
      "account": "Primary Checking ...002 (....002)",
      "amount": 100.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252489829963026510",
      "date": "2026-08-18",
      "merchant": "Essex Golf",
      "category": "Entertainment & Recreation",
      "account": "T CSP 5914 due 15th ",
      "amount": 10.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252489829963026509",
      "date": "2026-08-18",
      "merchant": "Meyerdpew",
      "category": "Home maintenance",
      "account": "T CSP 5914 due 15th ",
      "amount": 39.9,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252489829963026508",
      "date": "2026-08-18",
      "merchant": "ShopRite",
      "category": "Groceries",
      "account": "T CSP 5914 due 15th ",
      "amount": 2.81,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252489106165617439",
      "date": "2026-08-18",
      "merchant": "Well Bred",
      "category": "Mocha",
      "account": "U CSP 9369 due 15th",
      "amount": 9.59,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252489106165617438",
      "date": "2026-08-18",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 40.32,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252489106165617437",
      "date": "2026-08-18",
      "merchant": "Apple",
      "category": "Subscriptions",
      "account": "U CSP 9369 due 15th",
      "amount": 9.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252489106165617436",
      "date": "2026-08-18",
      "merchant": "CRAVE AND CO RESTAURANT",
      "category": "Eating out",
      "account": "U CSP 9369 due 15th",
      "amount": 55.25,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638949",
      "date": "2026-08-17",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 68.33,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988158",
      "date": "2026-08-17",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 25.98,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988079",
      "date": "2026-08-17",
      "merchant": "the YMCA",
      "category": "Child Activities",
      "account": "U CSP (...8373) due 15th",
      "amount": 22.32,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252499606954857082",
      "date": "2026-08-17",
      "merchant": "Costco Credit Card",
      "category": "Credit Card Payment",
      "account": "Costco Visa 3744 due 17th",
      "amount": 611.14,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252461203333862017",
      "date": "2026-08-17",
      "merchant": "Venmo",
      "category": "Camp",
      "account": "Primary Checking ...002 (....002)",
      "amount": 25.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252461203333862016",
      "date": "2026-08-17",
      "merchant": "Venmo",
      "category": "Camp",
      "account": "Primary Checking ...002 (....002)",
      "amount": 50.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252461203333862015",
      "date": "2026-08-17",
      "merchant": "Venmo",
      "category": "Camp",
      "account": "Primary Checking ...002 (....002)",
      "amount": 75.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252461203333862014",
      "date": "2026-08-17",
      "merchant": "Venmo",
      "category": "Camp",
      "account": "Primary Checking ...002 (....002)",
      "amount": 75.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252461203333862013",
      "date": "2026-08-17",
      "merchant": "Citi",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 611.14,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252461203333862012",
      "date": "2026-08-17",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 920.85,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252461203333862011",
      "date": "2026-08-17",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 1279.49,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252461203333862010",
      "date": "2026-08-17",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 5271.18,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252461203333862009",
      "date": "2026-08-17",
      "merchant": "PennyMac",
      "category": "Mortgage",
      "account": "Primary Checking ...002 (....002)",
      "amount": 5933.22,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252397009643262131",
      "date": "2026-08-17",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 25.98,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252397009643262130",
      "date": "2026-08-17",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 68.33,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252397009643262128",
      "date": "2026-08-17",
      "merchant": "the YMCA",
      "category": "Child Activities",
      "account": "U CSP 9369 due 15th",
      "amount": 22.32,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675639062",
      "date": "2026-08-16",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 35.81,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580480",
      "date": "2026-08-16",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF (...2344) due 15th",
      "amount": 63.94,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252397011474076167",
      "date": "2026-08-16",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF 6579 due 15th",
      "amount": 63.94,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252305058520650228",
      "date": "2026-08-16",
      "merchant": "Walmart",
      "category": "Shopping",
      "account": "U CSP 9369 due 15th",
      "amount": 35.81,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988277",
      "date": "2026-08-15",
      "merchant": "Wayfair",
      "category": "Shopping",
      "account": "U CSP (...8373) due 15th",
      "amount": 81.02,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580449",
      "date": "2026-08-15",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF (...2344) due 15th",
      "amount": 298.54,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252397006556255220",
      "date": "2026-08-15",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U Amazon 9598 due 15th",
      "amount": 36.78,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252305060209906495",
      "date": "2026-08-15",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF 6579 due 15th",
      "amount": 298.54,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252305058520650229",
      "date": "2026-08-15",
      "merchant": "Wayfair",
      "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
      "account": "U CSP 9369 due 15th",
      "amount": 81.02,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252215112201949804",
      "date": "2026-08-15",
      "merchant": "The Home Depot",
      "category": "Home maintenance",
      "account": "T CSP 5914 due 15th ",
      "amount": 182.02,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987864",
      "date": "2026-08-14",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U CSP (...8373) due 15th",
      "amount": 5271.18,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580499",
      "date": "2026-08-14",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U CFF (...2344) due 15th",
      "amount": 920.85,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580426",
      "date": "2026-08-14",
      "merchant": "Google One",
      "category": "Subscriptions",
      "account": "U CFF (...2344) due 15th",
      "amount": 19.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252420815658177416",
      "date": "2026-08-14",
      "merchant": "Source to Source/Fund to Fund Transfer Out",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252420815658177415",
      "date": "2026-08-14",
      "merchant": "Source to Source/Fund to Fund Transfer In",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252420815658177414",
      "date": "2026-08-14",
      "merchant": "Plan Contribution",
      "category": "Buy",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 2115.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252215112201949805",
      "date": "2026-08-14",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "T CSP 5914 due 15th ",
      "amount": 1279.49,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252214253697127016",
      "date": "2026-08-14",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U CFF 6579 due 15th",
      "amount": 920.85,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252214253697127015",
      "date": "2026-08-14",
      "merchant": "Google One",
      "category": "Subscriptions",
      "account": "U CFF 6579 due 15th",
      "amount": 19.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252214252241703170",
      "date": "2026-08-14",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U CSP 9369 due 15th",
      "amount": 5271.18,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252156360839942908",
      "date": "2026-08-14",
      "merchant": "Uber Eats",
      "category": "Eating out",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 112.25,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252122709038224352",
      "date": "2026-08-14",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252115122988274005",
      "date": "2026-08-14",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "360 Performance Savings (...4275)",
      "amount": 35.17,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "252115122988274004",
      "date": "2026-08-14",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "360 Performance Savings (...4275)",
      "amount": 100.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "252093113305682272",
      "date": "2026-08-14",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "Primary Checking ...002 (....002)",
      "amount": 5351.94,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "252093113305682271",
      "date": "2026-08-14",
      "merchant": "Zelle",
      "category": "Home maintenance",
      "account": "Primary Checking ...002 (....002)",
      "amount": 175.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252093113305682270",
      "date": "2026-08-14",
      "merchant": "ERCO",
      "category": "Paychecks",
      "account": "Primary Checking ...002 (....002)",
      "amount": 4787.55,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "252045500347863225",
      "date": "2026-08-14",
      "merchant": "Nest",
      "category": "Subscriptions",
      "account": "Costco Visa 3744 due 17th",
      "amount": 100.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252154752584405019",
      "date": "2026-08-13",
      "merchant": "Dividend Received Apple Inc (Aapl) (Cash)",
      "category": "Dividends & Capital Gains",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 0.3,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "252154752584405018",
      "date": "2026-08-13",
      "merchant": "Purchase Into Core Account Cash (315994103) (Cash)",
      "category": "Dividends & Capital Gains",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 0.3,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "252152966866817503",
      "date": "2026-08-13",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 282.63,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "252152966866817502",
      "date": "2026-08-13",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 282.63,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255484187761988104",
      "date": "2026-08-12",
      "merchant": "Mindsoother",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 225.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252210537217675810",
      "date": "2026-08-12",
      "merchant": "American Express",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 3.56,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252122709038224351",
      "date": "2026-08-12",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "252026150200037642",
      "date": "2026-08-12",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251935856524808518",
      "date": "2026-08-12",
      "merchant": "New York Times",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 4.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251931693794480797",
      "date": "2026-08-12",
      "merchant": "Mindsoother",
      "category": "Medical + Dentist",
      "account": "U CSP 9369 due 15th",
      "amount": 225.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988183",
      "date": "2026-08-11",
      "merchant": "Shake Shack",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 30.85,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251931693794480798",
      "date": "2026-08-11",
      "merchant": "Shake Shack",
      "category": "Eating out",
      "account": "U CSP 9369 due 15th",
      "amount": 30.85,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251898111317267333",
      "date": "2026-08-11",
      "merchant": "Excel Martial Arts",
      "category": "Child Activities",
      "account": "Primary Checking ...002 (....002)",
      "amount": 357.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251898111317267332",
      "date": "2026-08-11",
      "merchant": "Zelle",
      "category": "School stuff + Education",
      "account": "Primary Checking ...002 (....002)",
      "amount": 100.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251842549896466478",
      "date": "2026-08-11",
      "merchant": "Charles Schwab",
      "category": "Transfer",
      "account": "360 Performance Savings (...4275)",
      "amount": 15000.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675639026",
      "date": "2026-08-10",
      "merchant": "SimpliSafe",
      "category": "Home Security",
      "account": "U CSP (...8373) due 15th",
      "amount": 24.51,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987966",
      "date": "2026-08-10",
      "merchant": "The Milkshake Factor",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 19.72,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580398",
      "date": "2026-08-10",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF (...2344) due 15th",
      "amount": 48.95,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251837125830923160",
      "date": "2026-08-10",
      "merchant": "Amazon",
      "category": "Shopping",
      "account": "U CFF 6579 due 15th",
      "amount": 48.95,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251837124310487855",
      "date": "2026-08-10",
      "merchant": "The Milkshake Factor",
      "category": "Eating out",
      "account": "U CSP 9369 due 15th",
      "amount": 19.72,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251749507845870572",
      "date": "2026-08-10",
      "merchant": "Charles Schwab",
      "category": "Transfer",
      "account": "Primary Checking ...002 (....002)",
      "amount": 15000.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251749507845870571",
      "date": "2026-08-10",
      "merchant": "Verizon",
      "category": "Internet & Cable",
      "account": "Primary Checking ...002 (....002)",
      "amount": 79.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251749507845870570",
      "date": "2026-08-10",
      "merchant": "Livingston Public",
      "category": "School stuff + Education",
      "account": "Primary Checking ...002 (....002)",
      "amount": 12.95,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251744913748152739",
      "date": "2026-08-10",
      "merchant": "Livingston",
      "category": "Credit Card Payment",
      "account": "T CSP 5914 due 15th ",
      "amount": 10.3,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251743977536508430",
      "date": "2026-08-10",
      "merchant": "SimpliSafe",
      "category": "Home Security",
      "account": "U CSP 9369 due 15th",
      "amount": 24.51,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638852",
      "date": "2026-08-09",
      "merchant": "Cookie Cutters Livings",
      "category": "Self care + Grooming",
      "account": "U CSP (...8373) due 15th",
      "amount": 5.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591199",
      "date": "2026-08-09",
      "merchant": "RS Berkeley",
      "category": "Child Activities",
      "account": "U CSP (...8373) due 15th",
      "amount": 59.69,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591188",
      "date": "2026-08-09",
      "merchant": "Target",
      "category": "Shopping",
      "account": "U CSP (...8373) due 15th",
      "amount": 41.51,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591085",
      "date": "2026-08-09",
      "merchant": "CenterCourt Chatham",
      "category": "Child Activities",
      "account": "U CSP (...8373) due 15th",
      "amount": 525.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591066",
      "date": "2026-08-09",
      "merchant": "the YMCA",
      "category": "Camp",
      "account": "U CSP (...8373) due 15th",
      "amount": 456.57,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988218",
      "date": "2026-08-09",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 65.61,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251749507845870573",
      "date": "2026-08-09",
      "merchant": "Charles Schwab",
      "category": "Medical + Dentist",
      "account": "Primary Checking ...002 (....002)",
      "amount": 200.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251743977536508429",
      "date": "2026-08-09",
      "merchant": "CenterCourt Chatham",
      "category": "Child Activities",
      "account": "U CSP 9369 due 15th",
      "amount": 525.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251743977536508428",
      "date": "2026-08-09",
      "merchant": "Target",
      "category": "Shopping",
      "account": "U CSP 9369 due 15th",
      "amount": 41.51,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251743977536508427",
      "date": "2026-08-09",
      "merchant": "RS Berkeley",
      "category": "Child Activities",
      "account": "U CSP 9369 due 15th",
      "amount": 59.69,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251662289743663718",
      "date": "2026-08-09",
      "merchant": "Deshe Landscaping",
      "category": "Home maintenance",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 459.04,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251652696973004882",
      "date": "2026-08-09",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 65.61,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251652696973004881",
      "date": "2026-08-09",
      "merchant": "Cookie Cutters",
      "category": "Self care + Grooming",
      "account": "U CSP 9369 due 15th",
      "amount": 5.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251652696973004879",
      "date": "2026-08-09",
      "merchant": "the YMCA",
      "category": "Camp",
      "account": "U CSP 9369 due 15th",
      "amount": 456.57,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484190328901961",
      "date": "2026-08-08",
      "merchant": "Mangiabene",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 50.11,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251744913748152740",
      "date": "2026-08-08",
      "merchant": "Known Traveler",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 120.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251653633247564218",
      "date": "2026-08-08",
      "merchant": "CVS",
      "category": "Medical + Dentist",
      "account": "T CSP 5914 due 15th ",
      "amount": 5.48,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251653633247564217",
      "date": "2026-08-08",
      "merchant": "US Customs Trusted Traveler",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 120.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251653633247564216",
      "date": "2026-08-08",
      "merchant": "Nordstrom Rack",
      "category": "Shopping",
      "account": "T CSP 5914 due 15th ",
      "amount": 119.97,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251653633247564215",
      "date": "2026-08-08",
      "merchant": "AFC South",
      "category": "Medical + Dentist",
      "account": "T CSP 5914 due 15th ",
      "amount": 30.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251653633247564214",
      "date": "2026-08-08",
      "merchant": "ON Inc",
      "category": "Shopping",
      "account": "T CSP 5914 due 15th ",
      "amount": 115.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251653633247564213",
      "date": "2026-08-08",
      "merchant": "Burlington",
      "category": "Shopping",
      "account": "T CSP 5914 due 15th ",
      "amount": 49.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251652696973004880",
      "date": "2026-08-08",
      "merchant": "Mangiabene",
      "category": "Eating out",
      "account": "U CSP 9369 due 15th",
      "amount": 50.11,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638872",
      "date": "2026-08-07",
      "merchant": "Culligan Water",
      "category": "Home maintenance",
      "account": "U CSP (...8373) due 15th",
      "amount": 585.37,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988304",
      "date": "2026-08-07",
      "merchant": "Chewy",
      "category": "Mocha",
      "account": "U CSP (...8373) due 15th",
      "amount": 124.05,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988294",
      "date": "2026-08-07",
      "merchant": "PM Pediatrics",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 30.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580429",
      "date": "2026-08-07",
      "merchant": "Indian Kitchen & Grill",
      "category": "Eating out",
      "account": "U CFF (...2344) due 15th",
      "amount": 162.55,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251780718343508288",
      "date": "2026-08-07",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 1.51,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251780718343508287",
      "date": "2026-08-07",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 1.51,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251780718343508286",
      "date": "2026-08-07",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 1.77,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251780718343508285",
      "date": "2026-08-07",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 1.77,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251563105074041855",
      "date": "2026-08-07",
      "merchant": "Veterinary Medical Center",
      "category": "Mocha",
      "account": "T CSP 5914 due 15th ",
      "amount": 98.79,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251562160376270967",
      "date": "2026-08-07",
      "merchant": "Indian Kitchen & Grill",
      "category": "Eating out",
      "account": "U CFF 6579 due 15th",
      "amount": 162.55,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251562158090375513",
      "date": "2026-08-07",
      "merchant": "Chewy",
      "category": "Mocha",
      "account": "U CSP 9369 due 15th",
      "amount": 124.05,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251471674914394362",
      "date": "2026-08-07",
      "merchant": "American Express",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 1537.26,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251469516887315270",
      "date": "2026-08-07",
      "merchant": "PM Pediatrics",
      "category": "Medical + Dentist",
      "account": "U CSP 9369 due 15th",
      "amount": 30.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251469516887315269",
      "date": "2026-08-07",
      "merchant": "Culligan Water",
      "category": "Home maintenance",
      "account": "U CSP 9369 due 15th",
      "amount": 585.37,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638933",
      "date": "2026-08-06",
      "merchant": "West Essex OBGYN",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 30.87,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988214",
      "date": "2026-08-06",
      "merchant": "McDonald's",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 4.88,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251491968846680811",
      "date": "2026-08-06",
      "merchant": "American Express",
      "category": "Credit Card Payment",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 1537.26,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251469516887315272",
      "date": "2026-08-06",
      "merchant": "West Essex OBGYN",
      "category": "Medical + Dentist",
      "account": "U CSP 9369 due 15th",
      "amount": 30.87,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251469516887315271",
      "date": "2026-08-06",
      "merchant": "McDonald's",
      "category": "Eating out",
      "account": "U CSP 9369 due 15th",
      "amount": 4.88,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988243",
      "date": "2026-08-05",
      "merchant": "Tony Boys Sandwich House",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 55.46,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988125",
      "date": "2026-08-05",
      "merchant": "Mindsoother",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 225.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251562158090375512",
      "date": "2026-08-05",
      "merchant": "Mindsoother",
      "category": "Medical + Dentist",
      "account": "U CSP 9369 due 15th",
      "amount": 225.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251424601856824004",
      "date": "2026-08-05",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 604.94,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251424601856824003",
      "date": "2026-08-05",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 604.94,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251424601856824002",
      "date": "2026-08-05",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 353.75,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251424601856824001",
      "date": "2026-08-05",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 353.75,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251424601225581204",
      "date": "2026-08-05",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 243.14,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251424601225581203",
      "date": "2026-08-05",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 243.14,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251424601225581202",
      "date": "2026-08-05",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 159.6,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251424601225581201",
      "date": "2026-08-05",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 159.6,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251374137659379761",
      "date": "2026-08-05",
      "merchant": "Tony Boys Sandwich House",
      "category": "Eating out",
      "account": "U CSP 9369 due 15th",
      "amount": 55.46,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251374139396870634",
      "date": "2026-08-04",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251198643932517295",
      "date": "2026-08-04",
      "merchant": "Public Service Enterprise Group",
      "category": "Gas & Electric",
      "account": "Primary Checking ...002 (....002)",
      "amount": 45.56,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988324",
      "date": "2026-08-03",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 105.48,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988028",
      "date": "2026-08-03",
      "merchant": "FirstEnergy",
      "category": "Gas & Electric",
      "account": "U CSP (...8373) due 15th",
      "amount": 465.03,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251280224461279974",
      "date": "2026-08-03",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251198643932517299",
      "date": "2026-08-03",
      "merchant": "Venmo",
      "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
      "account": "Primary Checking ...002 (....002)",
      "amount": 25.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251198643932517298",
      "date": "2026-08-03",
      "merchant": "Venmo",
      "category": "Self care + Grooming",
      "account": "Primary Checking ...002 (....002)",
      "amount": 33.6,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251198643932517297",
      "date": "2026-08-03",
      "merchant": "Livingston Public",
      "category": "School stuff + Education",
      "account": "Primary Checking ...002 (....002)",
      "amount": 35.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251198643932517296",
      "date": "2026-08-03",
      "merchant": "TARGET CARD SRVC PAYMENT",
      "category": "Shopping",
      "account": "Primary Checking ...002 (....002)",
      "amount": 191.43,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251186776080142838",
      "date": "2026-08-03",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251186776080142837",
      "date": "2026-08-03",
      "merchant": "E-ZPass",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 50.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251186773501694025",
      "date": "2026-08-03",
      "merchant": "Walmart",
      "category": "Shopping",
      "account": "U CSP 9369 due 15th",
      "amount": 105.48,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251139449793564672",
      "date": "2026-08-03",
      "merchant": "AAA",
      "category": "Transportation",
      "account": "Costco Visa 3744 due 17th",
      "amount": 108.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251093557126386666",
      "date": "2026-08-03",
      "merchant": "FirstEnergy",
      "category": "Gas & Electric",
      "account": "U CSP 9369 due 15th",
      "amount": 465.03,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638896",
      "date": "2026-08-02",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 53.62,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591159",
      "date": "2026-08-02",
      "merchant": "the YMCA",
      "category": "Child Activities",
      "account": "U CSP (...8373) due 15th",
      "amount": 91.69,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987984",
      "date": "2026-08-02",
      "merchant": "DoorDash",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 80.26,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251327441938174611",
      "date": "2026-08-02",
      "merchant": "Walmart",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 13.81,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251197560212443658",
      "date": "2026-08-02",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 13.81,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251197560212443657",
      "date": "2026-08-02",
      "merchant": "American Express",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 21.31,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251186773501694027",
      "date": "2026-08-02",
      "merchant": "the YMCA",
      "category": "Child Activities",
      "account": "U CSP 9369 due 15th",
      "amount": 91.69,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251186773501694026",
      "date": "2026-08-02",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 53.62,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251142447388184613",
      "date": "2026-08-02",
      "merchant": "Disney",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 21.31,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251093557126386667",
      "date": "2026-08-02",
      "merchant": "DOUGH DASH",
      "category": "Eating out",
      "account": "U CSP 9369 due 15th",
      "amount": 80.26,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591225",
      "date": "2026-08-01",
      "merchant": "Chewy",
      "category": "Mocha",
      "account": "U CSP (...8373) due 15th",
      "amount": 153.34,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580362",
      "date": "2026-08-01",
      "merchant": "Barnabas Health",
      "category": "Medical + Dentist",
      "account": "U CFF (...2344) due 15th",
      "amount": 17.82,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251197560212443659",
      "date": "2026-08-01",
      "merchant": "American Express",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 0.13,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251187760564032491",
      "date": "2026-08-01",
      "merchant": "Ike's Bagel Cafe",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 19.92,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251142447388184614",
      "date": "2026-08-01",
      "merchant": "Disney",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 0.13,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251093560411574612",
      "date": "2026-08-01",
      "merchant": "Barnabas Health",
      "category": "Medical + Dentist",
      "account": "U CFF 6579 due 15th",
      "amount": 17.82,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251055236455092956",
      "date": "2026-08-01",
      "merchant": "Auto Payment   Thanks",
      "category": "Credit Card Payment",
      "account": "Target Circle Card (...9620) due 1st",
      "amount": 191.43,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251002791914918902",
      "date": "2026-08-01",
      "merchant": "Chewy",
      "category": "Mocha",
      "account": "U CSP 9369 due 15th",
      "amount": 153.34,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591116",
      "date": "2026-07-31",
      "merchant": "J. Crew",
      "category": "Clothing, Shoes, Jewelry",
      "account": "U CSP (...8373) due 15th",
      "amount": 34.5,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987997",
      "date": "2026-07-31",
      "merchant": "European Wax Center",
      "category": "Self care + Grooming",
      "account": "U CSP (...8373) due 15th",
      "amount": 5.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987938",
      "date": "2026-07-31",
      "merchant": "Apple",
      "category": "Subscriptions",
      "account": "U CSP (...8373) due 15th",
      "amount": 3.19,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580395",
      "date": "2026-07-31",
      "merchant": "Miga Sushi",
      "category": "Eating out",
      "account": "U CFF (...2344) due 15th",
      "amount": 90.4,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251147014228169720",
      "date": "2026-07-31",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 0.17,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147014228169719",
      "date": "2026-07-31",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 0.17,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147014228169718",
      "date": "2026-07-31",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 436.09,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147014228169717",
      "date": "2026-07-31",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 436.09,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147014228169716",
      "date": "2026-07-31",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 272.94,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147014228169715",
      "date": "2026-07-31",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 272.94,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147014033134543",
      "date": "2026-07-31",
      "merchant": "Source to Source/Fund to Fund Transfer Out",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251147014033134542",
      "date": "2026-07-31",
      "merchant": "Source to Source/Fund to Fund Transfer In",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251147014033134541",
      "date": "2026-07-31",
      "merchant": "Plan Contribution",
      "category": "Buy",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 2115.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251147013871653817",
      "date": "2026-07-31",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.7,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147013871653816",
      "date": "2026-07-31",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.7,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147013664035729",
      "date": "2026-07-31",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 227.78,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147013664035728",
      "date": "2026-07-31",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 227.78,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147013664035727",
      "date": "2026-07-31",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 1.51,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147013664035726",
      "date": "2026-07-31",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 1.51,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147013452223344",
      "date": "2026-07-31",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 193.88,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147013452223343",
      "date": "2026-07-31",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 193.88,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147013452223342",
      "date": "2026-07-31",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 0.87,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147013452223341",
      "date": "2026-07-31",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 0.87,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147013452223340",
      "date": "2026-07-31",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 117.19,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251147013452223339",
      "date": "2026-07-31",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 117.19,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "251093560411574611",
      "date": "2026-07-31",
      "merchant": "Miga Sushi",
      "category": "Eating out",
      "account": "U CFF 6579 due 15th",
      "amount": 90.4,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251093557126386672",
      "date": "2026-07-31",
      "merchant": "Apple",
      "category": "Subscriptions",
      "account": "U CSP 9369 due 15th",
      "amount": 3.19,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251093557126386671",
      "date": "2026-07-31",
      "merchant": "J. Crew",
      "category": "Clothing, Shoes, Jewelry",
      "account": "U CSP 9369 due 15th",
      "amount": 34.5,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "251093557126386670",
      "date": "2026-07-31",
      "merchant": "European Wax Center",
      "category": "Self care + Grooming",
      "account": "U CSP 9369 due 15th",
      "amount": 5.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250952938792964252",
      "date": "2026-07-31",
      "merchant": "Interest Earned Cash (315994103) (Cash)",
      "category": "Interest",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 12.77,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250952938792964251",
      "date": "2026-07-31",
      "merchant": "Reinvestment Cash (315994103) (Cash)",
      "category": "Dividends & Capital Gains",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 12.77,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250935604744311030",
      "date": "2026-07-31",
      "merchant": "Capital One",
      "category": "Interest",
      "account": "360 Checking (...5441)",
      "amount": 0.1,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250935603471339600",
      "date": "2026-07-31",
      "merchant": "Capital One",
      "category": "Interest",
      "account": "360 Performance Savings (...4275)",
      "amount": 514.34,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250935602153280369",
      "date": "2026-07-31",
      "merchant": "Capital One",
      "category": "Interest",
      "account": "Kids Savings Account (...8421)",
      "amount": 0.25,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250915538952803150",
      "date": "2026-07-31",
      "merchant": "Charles Schwab",
      "category": "Interest",
      "account": "Primary Checking ...002 (....002)",
      "amount": 0.21,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250845421873156779",
      "date": "2026-07-31",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "360 Performance Savings (...4275)",
      "amount": 100.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250821758727770231",
      "date": "2026-07-31",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "Primary Checking ...002 (....002)",
      "amount": 5372.68,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250821758727770230",
      "date": "2026-07-31",
      "merchant": "ERCO",
      "category": "Paychecks",
      "account": "Primary Checking ...002 (....002)",
      "amount": 4787.55,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255484187761988154",
      "date": "2026-07-30",
      "merchant": "Path",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 3.25,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580466",
      "date": "2026-07-30",
      "merchant": "CVS",
      "category": "Medical + Dentist",
      "account": "U CFF (...2344) due 15th",
      "amount": 28.13,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250912672729027020",
      "date": "2026-07-30",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250912671599710559",
      "date": "2026-07-30",
      "merchant": "CVS",
      "category": "Medical + Dentist",
      "account": "U CFF 6579 due 15th",
      "amount": 28.13,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250912669528773571",
      "date": "2026-07-30",
      "merchant": "Path",
      "category": "Transportation",
      "account": "U CSP 9369 due 15th",
      "amount": 3.25,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250878521726489456",
      "date": "2026-07-30",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 7.99,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250878521726489455",
      "date": "2026-07-30",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 7.99,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250821758727770232",
      "date": "2026-07-30",
      "merchant": "Zelle",
      "category": "Home maintenance",
      "account": "Primary Checking ...002 (....002)",
      "amount": 175.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580454",
      "date": "2026-07-29",
      "merchant": "Bubba's",
      "category": "Eating out",
      "account": "U CFF (...2344) due 15th",
      "amount": 58.88,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250913585780773833",
      "date": "2026-07-29",
      "merchant": "The Home Depot",
      "category": "Home maintenance",
      "account": "T CSP 5914 due 15th ",
      "amount": 6.15,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250820515358855769",
      "date": "2026-07-29",
      "merchant": "CityMD",
      "category": "Medical + Dentist",
      "account": "T CSP 5914 due 15th ",
      "amount": 30.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250819553371115865",
      "date": "2026-07-29",
      "merchant": "Bubba's",
      "category": "Eating out",
      "account": "U CFF 6579 due 15th",
      "amount": 58.88,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250734569680556247",
      "date": "2026-07-29",
      "merchant": "Restricted Stock Deposit",
      "category": "Dividends & Capital Gains",
      "account": "Google Equity Awards (...ards)",
      "amount": 0.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250734569680556246",
      "date": "2026-07-29",
      "merchant": "Restricted Stock Deposit",
      "category": "Dividends & Capital Gains",
      "account": "Google Equity Awards (...ards)",
      "amount": 0.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250734569680556245",
      "date": "2026-07-29",
      "merchant": "Restricted Stock Deposit",
      "category": "Dividends & Capital Gains",
      "account": "Google Equity Awards (...ards)",
      "amount": 0.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255484189675639052",
      "date": "2026-07-28",
      "merchant": "Walgreens",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 6.13,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250725537308758751",
      "date": "2026-07-28",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250725533480407325",
      "date": "2026-07-28",
      "merchant": "Walgreens",
      "category": "Medical + Dentist",
      "account": "U CSP 9369 due 15th",
      "amount": 6.13,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250633652787499068",
      "date": "2026-07-27",
      "merchant": "Walgreens",
      "category": "Medical + Dentist",
      "account": "T CSP 5914 due 15th ",
      "amount": 10.12,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250632613037363739",
      "date": "2026-07-27",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675639007",
      "date": "2026-07-26",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 196.18,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638972",
      "date": "2026-07-26",
      "merchant": "PM Pediatrics",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 30.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638828",
      "date": "2026-07-26",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 66.16,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638803",
      "date": "2026-07-26",
      "merchant": "Kam Man Supermarket",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 6.48,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591147",
      "date": "2026-07-26",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 12.76,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987909",
      "date": "2026-07-26",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 9.56,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987832",
      "date": "2026-07-26",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 72.74,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250633652787499067",
      "date": "2026-07-26",
      "merchant": "The Home Depot",
      "category": "Home maintenance",
      "account": "T CSP 5914 due 15th ",
      "amount": 21.94,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250632611373273495",
      "date": "2026-07-26",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 12.76,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250632611373273494",
      "date": "2026-07-26",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 9.56,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250632611373273493",
      "date": "2026-07-26",
      "merchant": "P M Pediatrics",
      "category": "Medical + Dentist",
      "account": "U CSP 9369 due 15th",
      "amount": 30.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250540688525513033",
      "date": "2026-07-26",
      "merchant": "Kam Man Supermarket",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 6.48,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250540688525513032",
      "date": "2026-07-26",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 72.74,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250540688525513031",
      "date": "2026-07-26",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 196.18,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250540688525513029",
      "date": "2026-07-26",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 66.16,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988155",
      "date": "2026-07-25",
      "merchant": "ShopRite",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 40.05,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988050",
      "date": "2026-07-25",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 46.9,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580379",
      "date": "2026-07-25",
      "merchant": "Amazon Kids+",
      "category": "Subscriptions",
      "account": "U CFF (...2344) due 15th",
      "amount": 37.32,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250541705091633573",
      "date": "2026-07-25",
      "merchant": "Ike's Bagel Cafe",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 1.82,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250540688525513030",
      "date": "2026-07-25",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 46.9,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250494180366242470",
      "date": "2026-07-25",
      "merchant": "Best Buy",
      "category": "Shopping",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 1727.3,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250448889688641693",
      "date": "2026-07-25",
      "merchant": "Aldi",
      "category": "Groceries",
      "account": "T CSP 5914 due 15th ",
      "amount": 10.84,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250447969907134698",
      "date": "2026-07-25",
      "merchant": "Amazon Kids+",
      "category": "Subscriptions",
      "account": "U CFF 6579 due 15th",
      "amount": 37.32,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250447967053959656",
      "date": "2026-07-25",
      "merchant": "ShopRite",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 40.05,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250355499140666362",
      "date": "2026-07-25",
      "merchant": "Kearny Bank",
      "category": "Cash & ATM",
      "account": "Primary Checking ...002 (....002)",
      "amount": 800.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591160",
      "date": "2026-07-24",
      "merchant": "the YMCA",
      "category": "Fitness",
      "account": "U CSP (...8373) due 15th",
      "amount": 128.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987996",
      "date": "2026-07-24",
      "merchant": "Starbucks",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 6.18,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987939",
      "date": "2026-07-24",
      "merchant": "Uber",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 71.25,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250447967053959660",
      "date": "2026-07-24",
      "merchant": "the YMCA",
      "category": "Fitness",
      "account": "U CSP 9369 due 15th",
      "amount": 128.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250447967053959658",
      "date": "2026-07-24",
      "merchant": "Uber",
      "category": "Transportation",
      "account": "U CSP 9369 due 15th",
      "amount": 71.25,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250447967053959657",
      "date": "2026-07-24",
      "merchant": "Starbucks",
      "category": "Eating out",
      "account": "U CSP 9369 due 15th",
      "amount": 6.18,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675639051",
      "date": "2026-07-23",
      "merchant": "Uber",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 1.04,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638895",
      "date": "2026-07-23",
      "merchant": "McDonald's",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 8.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591146",
      "date": "2026-07-23",
      "merchant": "Uber",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 15.84,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250447967053959659",
      "date": "2026-07-23",
      "merchant": "McDonald's",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 8.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250268066952794901",
      "date": "2026-07-23",
      "merchant": "Swiggy",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 11.9,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250267243902423453",
      "date": "2026-07-23",
      "merchant": "Uber",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 1.04,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250267243902423452",
      "date": "2026-07-23",
      "merchant": "Uber",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 15.84,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250200648728465780",
      "date": "2026-07-23",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 287.1,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638971",
      "date": "2026-07-22",
      "merchant": "Uber",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 1.84,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638804",
      "date": "2026-07-22",
      "merchant": "Uber",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 2.19,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987910",
      "date": "2026-07-22",
      "merchant": "Uber",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 4.7,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250176509549498510",
      "date": "2026-07-22",
      "merchant": "Swiggy",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 6.27,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250175620088615847",
      "date": "2026-07-22",
      "merchant": "Uber",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 4.7,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250175620088615846",
      "date": "2026-07-22",
      "merchant": "Uber",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 1.84,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250175620088615845",
      "date": "2026-07-22",
      "merchant": "Uber",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 2.19,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250157709589500416",
      "date": "2026-07-22",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.93,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250157709589500415",
      "date": "2026-07-22",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.93,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250157709589500414",
      "date": "2026-07-22",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 8.6,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250157709589500413",
      "date": "2026-07-22",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 8.6,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250157709303239144",
      "date": "2026-07-22",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 39.93,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250157709303239143",
      "date": "2026-07-22",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 39.93,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250120633510810019",
      "date": "2026-07-22",
      "merchant": "American Express",
      "category": "Credit Card + Financial Fees",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 895.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675639008",
      "date": "2026-07-21",
      "merchant": "Uber",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 1.74,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987833",
      "date": "2026-07-21",
      "merchant": "Uber",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 4.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250176509549498509",
      "date": "2026-07-21",
      "merchant": "Swiggy",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 0.02,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250083589738746155",
      "date": "2026-07-21",
      "merchant": "Swiggy",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 5.89,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250083589738746154",
      "date": "2026-07-21",
      "merchant": "Swiggy",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 0.02,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250082666375304136",
      "date": "2026-07-21",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U WOH.6581 due 21st",
      "amount": 287.1,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250082665090798413",
      "date": "2026-07-21",
      "merchant": "Uber",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 4.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250082665090798412",
      "date": "2026-07-21",
      "merchant": "Uber",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 1.74,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249937126685692766",
      "date": "2026-07-21",
      "merchant": "Charles Schwab",
      "category": "Transfer",
      "account": "360 Performance Savings (...4275)",
      "amount": 750.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591115",
      "date": "2026-07-20",
      "merchant": "Hilton Manyata",
      "category": "Travel & Vacation",
      "account": "U CSP (...8373) due 15th",
      "amount": 752.85,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250540688525513028",
      "date": "2026-07-20",
      "merchant": "Hilton",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 752.85,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249990220830233467",
      "date": "2026-07-20",
      "merchant": "Meyer Depew",
      "category": "Home maintenance",
      "account": "T CSP 5914 due 15th ",
      "amount": 39.94,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249990220830233466",
      "date": "2026-07-20",
      "merchant": "Bombay Brassiere",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 55.49,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249895689433666474",
      "date": "2026-07-20",
      "merchant": "Advisor Fee",
      "category": "Credit Card + Financial Fees",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 336.72,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249895689433666473",
      "date": "2026-07-20",
      "merchant": "Sweep Out",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 336.72,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "249895689237582749",
      "date": "2026-07-20",
      "merchant": "Sweep Out",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 586.66,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "249895689237582748",
      "date": "2026-07-20",
      "merchant": "Advisor Fee",
      "category": "Credit Card + Financial Fees",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 586.66,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249895688905184136",
      "date": "2026-07-20",
      "merchant": "Advisor Fee",
      "category": "Credit Card + Financial Fees",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 408.57,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249895688905184135",
      "date": "2026-07-20",
      "merchant": "Sweep Out",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 408.57,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "249839505472246269",
      "date": "2026-07-20",
      "merchant": "Charles Schwab",
      "category": "Transfer",
      "account": "Primary Checking ...002 (....002)",
      "amount": 750.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249839505472246268",
      "date": "2026-07-20",
      "merchant": "Charles Schwab",
      "category": "Transfer",
      "account": "Primary Checking ...002 (....002)",
      "amount": 600.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638827",
      "date": "2026-07-18",
      "merchant": "Taj Madikeri Resort And",
      "category": "Travel & Vacation",
      "account": "U CSP (...8373) due 15th",
      "amount": 56.33,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988175",
      "date": "2026-07-18",
      "merchant": "Taj Madikeri Resort And",
      "category": "Travel & Vacation",
      "account": "U CSP (...8373) due 15th",
      "amount": 43.63,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987883",
      "date": "2026-07-18",
      "merchant": "Apple",
      "category": "Subscriptions",
      "account": "U CSP (...8373) due 15th",
      "amount": 9.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249804766116860314",
      "date": "2026-07-18",
      "merchant": "Taj Madikeri Resort And",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 56.33,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249804766116860313",
      "date": "2026-07-18",
      "merchant": "Taj Madikeri Resort And",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 43.63,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249804766116860312",
      "date": "2026-07-18",
      "merchant": "Apple",
      "category": "Subscriptions",
      "account": "U CSP 9369 due 15th",
      "amount": 9.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249756335829701001",
      "date": "2026-07-18",
      "merchant": "Capital One",
      "category": "Interest",
      "account": "CD (...2555)",
      "amount": 91.72,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "250704062062285394",
      "date": "2026-07-17",
      "merchant": "Source to Source/Fund to Fund Transfer Out",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250704062062285393",
      "date": "2026-07-17",
      "merchant": "Source to Source/Fund to Fund Transfer In",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250704062062285392",
      "date": "2026-07-17",
      "merchant": "Plan Contribution",
      "category": "Buy",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 2115.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250513720956441445",
      "date": "2026-07-17",
      "merchant": "Source to Source/Fund to Fund Transfer Out",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250513720956441444",
      "date": "2026-07-17",
      "merchant": "Source to Source/Fund to Fund Transfer In",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "250513720956441443",
      "date": "2026-07-17",
      "merchant": "Plan Contribution",
      "category": "Buy",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 2115.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249664960220123608",
      "date": "2026-07-17",
      "merchant": "Credit Card Payment",
      "category": "Credit Card Payment",
      "account": "Costco Visa 3744 due 17th",
      "amount": 25.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249627397660889193",
      "date": "2026-07-17",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 2.45,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "249627397660889192",
      "date": "2026-07-17",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 2.45,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "249627397660889191",
      "date": "2026-07-17",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 357.41,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "249627397487874132",
      "date": "2026-07-17",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 585.96,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "249627397346316346",
      "date": "2026-07-17",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 408.58,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "249627397183787056",
      "date": "2026-07-17",
      "merchant": "Source to Source/Fund to Fund Transfer Out",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249627397183787055",
      "date": "2026-07-17",
      "merchant": "Source to Source/Fund to Fund Transfer In",
      "category": "Transfer",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 900.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249627397183787054",
      "date": "2026-07-17",
      "merchant": "Plan Contribution",
      "category": "Buy",
      "account": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "amount": 2115.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249573391147225103",
      "date": "2026-07-17",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "360 Performance Savings (...4275)",
      "amount": 100.0,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "249573391147225102",
      "date": "2026-07-17",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "360 Performance Savings (...4275)",
      "amount": 35.17,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "249561866896429739",
      "date": "2026-07-17",
      "merchant": "Google",
      "category": "Paychecks",
      "account": "Primary Checking ...002 (....002)",
      "amount": 5351.94,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "249561866896429738",
      "date": "2026-07-17",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 924.39,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249561866896429737",
      "date": "2026-07-17",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 3666.65,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249561866896429736",
      "date": "2026-07-17",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 5339.57,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249561866896429735",
      "date": "2026-07-17",
      "merchant": "PennyMac",
      "category": "Mortgage",
      "account": "Primary Checking ...002 (....002)",
      "amount": 5933.22,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249561866896429734",
      "date": "2026-07-17",
      "merchant": "Citi",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 25.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249548529521414328",
      "date": "2026-07-17",
      "merchant": "Sell",
      "category": "Sell",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 68.95,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249548529521414327",
      "date": "2026-07-17",
      "merchant": "Sell",
      "category": "Sell",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 288.46,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249548529283388002",
      "date": "2026-07-17",
      "merchant": "Sell",
      "category": "Sell",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 585.96,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249548529012855343",
      "date": "2026-07-17",
      "merchant": "Sell",
      "category": "Sell",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 408.58,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249623736663692122",
      "date": "2026-07-16",
      "merchant": "Uber",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 2.34,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249623736663692121",
      "date": "2026-07-16",
      "merchant": "Uber",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 2.88,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988077",
      "date": "2026-07-15",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U CSP (...8373) due 15th",
      "amount": 5339.57,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988049",
      "date": "2026-07-15",
      "merchant": "Hilton",
      "category": "Travel & Vacation",
      "account": "U CSP (...8373) due 15th",
      "amount": 330.9,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580383",
      "date": "2026-07-15",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U CFF (...2344) due 15th",
      "amount": 924.39,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249804766116860315",
      "date": "2026-07-15",
      "merchant": "Hilton Manyata",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 330.9,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249579131685589435",
      "date": "2026-07-15",
      "merchant": "New York Times",
      "category": "Subscriptions",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 4.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249530583913877930",
      "date": "2026-07-15",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "T CSP 5914 due 15th ",
      "amount": 3666.65,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249530062608028482",
      "date": "2026-07-15",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U CFF 6579 due 15th",
      "amount": 924.39,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249530061603492569",
      "date": "2026-07-15",
      "merchant": "Chase",
      "category": "Credit Card Payment",
      "account": "U CSP 9369 due 15th",
      "amount": 5339.57,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249451250809590511",
      "date": "2026-07-15",
      "merchant": "ERCO",
      "category": "Paychecks",
      "account": "Primary Checking ...002 (....002)",
      "amount": 4787.55,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255484187761987858",
      "date": "2026-07-14",
      "merchant": "Apple",
      "category": "Subscriptions",
      "account": "U CSP (...8373) due 15th",
      "amount": 31.98,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249530583913877936",
      "date": "2026-07-14",
      "merchant": "VIOLOGIKO_CHORIO_MITRP",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 10.65,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249530583913877935",
      "date": "2026-07-14",
      "merchant": "Homed ID Polyiatrio PC",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 114.47,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249530583913877934",
      "date": "2026-07-14",
      "merchant": "Ssp Hellas",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 15.11,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249530583913877933",
      "date": "2026-07-14",
      "merchant": "Filippeou F Co EE",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 108.75,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249530583913877932",
      "date": "2026-07-14",
      "merchant": "Ergon Bake House",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 39.49,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249530583913877931",
      "date": "2026-07-14",
      "merchant": "FARMakeio Konstantinou",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 16.94,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249438654322725778",
      "date": "2026-07-14",
      "merchant": "Hercules Greek Sou",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 19.46,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249438654322725777",
      "date": "2026-07-14",
      "merchant": "Uber",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 3.01,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249438654322725776",
      "date": "2026-07-14",
      "merchant": "Uber",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 47.96,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249438654322725775",
      "date": "2026-07-14",
      "merchant": "Uber",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 5.01,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249438654322725774",
      "date": "2026-07-14",
      "merchant": "Uber",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 65.18,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249438102974124837",
      "date": "2026-07-14",
      "merchant": "Apple",
      "category": "Subscriptions",
      "account": "U CSP 9369 due 15th",
      "amount": 31.98,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249277858917666957",
      "date": "2026-07-14",
      "merchant": "Charles Schwab",
      "category": "Transfer",
      "account": "360 Performance Savings (...4275)",
      "amount": 15000.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638938",
      "date": "2026-07-13",
      "merchant": "KOKKINI PIPERIA MARKOP",
      "category": "Travel & Vacation",
      "account": "U CSP (...8373) due 15th",
      "amount": 8.02,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988274",
      "date": "2026-07-13",
      "merchant": "KOKKINI PIPERIA MARKOP",
      "category": "Travel & Vacation",
      "account": "U CSP (...8373) due 15th",
      "amount": 33.7,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761987968",
      "date": "2026-07-13",
      "merchant": "Avolta",
      "category": "Travel & Vacation",
      "account": "U CSP (...8373) due 15th",
      "amount": 13.64,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249438654322725773",
      "date": "2026-07-13",
      "merchant": "Detto Travel",
      "category": "Travel & Vacation",
      "account": "T CSP 5914 due 15th ",
      "amount": 202.65,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249438102974124839",
      "date": "2026-07-13",
      "merchant": "KOKKINI PIPERIA MARKOP",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 8.02,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249438102974124838",
      "date": "2026-07-13",
      "merchant": "KOKKINI PIPERIA MARKOP",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 33.7,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249332873879376255",
      "date": "2026-07-13",
      "merchant": "Avolta",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 13.64,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249295953769025930",
      "date": "2026-07-13",
      "merchant": "Uber",
      "category": "Travel & Vacation",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 66.98,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249223151555727426",
      "date": "2026-07-13",
      "merchant": "Charles Schwab",
      "category": "Transfer",
      "account": "Primary Checking ...002 (....002)",
      "amount": 15000.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249223151555727425",
      "date": "2026-07-13",
      "merchant": "Excel Martial Arts",
      "category": "Child Activities",
      "account": "Primary Checking ...002 (....002)",
      "amount": 357.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249223151555727424",
      "date": "2026-07-13",
      "merchant": "Venmo",
      "category": "Self care + Grooming",
      "account": "Primary Checking ...002 (....002)",
      "amount": 10.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675639016",
      "date": "2026-07-12",
      "merchant": "Deshe Landscaping",
      "category": "Home maintenance",
      "account": "U CSP (...8373) due 15th",
      "amount": 459.04,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591179",
      "date": "2026-07-12",
      "merchant": "A. Saily",
      "category": "Travel & Vacation",
      "account": "U CSP (...8373) due 15th",
      "amount": 23.24,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988186",
      "date": "2026-07-12",
      "merchant": "Ulta Beauty",
      "category": "Shopping",
      "account": "U CSP (...8373) due 15th",
      "amount": 71.44,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988094",
      "date": "2026-07-12",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 34.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580338",
      "date": "2026-07-12",
      "merchant": "CVS",
      "category": "Medical + Dentist",
      "account": "U CFF (...2344) due 15th",
      "amount": 21.67,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249333385825636501",
      "date": "2026-07-12",
      "merchant": "Jersey Reserve",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 7.76,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249332873879376257",
      "date": "2026-07-12",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 34.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249332873879376256",
      "date": "2026-07-12",
      "merchant": "Ulta Beauty",
      "category": "Shopping",
      "account": "U CSP 9369 due 15th",
      "amount": 71.44,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249241106945429716",
      "date": "2026-07-12",
      "merchant": "CVS",
      "category": "Medical + Dentist",
      "account": "U CFF 6579 due 15th",
      "amount": 21.67,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249241104035632008",
      "date": "2026-07-12",
      "merchant": "Deshe Landscaping",
      "category": "Home Improvement",
      "account": "U CSP 9369 due 15th",
      "amount": 459.04,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249241104035632007",
      "date": "2026-07-12",
      "merchant": "a.saily",
      "category": "Travel & Vacation",
      "account": "U CSP 9369 due 15th",
      "amount": 23.24,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675639083",
      "date": "2026-07-11",
      "merchant": "Donut Basket",
      "category": "Eating out",
      "account": "U CSP (...8373) due 15th",
      "amount": 26.2,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638856",
      "date": "2026-07-11",
      "merchant": "Dianas Nail & Spa",
      "category": "Self care + Grooming",
      "account": "U CSP (...8373) due 15th",
      "amount": 38.3,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591061",
      "date": "2026-07-11",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 27.68,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988229",
      "date": "2026-07-11",
      "merchant": "European Wax Center",
      "category": "Self care + Grooming",
      "account": "U CSP (...8373) due 15th",
      "amount": 25.8,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580369",
      "date": "2026-07-11",
      "merchant": "CVS",
      "category": "Medical + Dentist",
      "account": "U CFF (...2344) due 15th",
      "amount": 17.07,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580354",
      "date": "2026-07-11",
      "merchant": "CVS",
      "category": "Medical + Dentist",
      "account": "U CFF (...2344) due 15th",
      "amount": 5.32,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249362915261960263",
      "date": "2026-07-11",
      "merchant": "China Chalet",
      "category": "Eating out",
      "account": "Costco Visa 3744 due 17th",
      "amount": 94.33,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249241104035632006",
      "date": "2026-07-11",
      "merchant": "Dianas Nail & Spa",
      "category": "Self care + Grooming",
      "account": "U CSP 9369 due 15th",
      "amount": 38.3,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249241104035632005",
      "date": "2026-07-11",
      "merchant": "Donut Basket",
      "category": "Eating out",
      "account": "U CSP 9369 due 15th",
      "amount": 26.2,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249241104035632002",
      "date": "2026-07-11",
      "merchant": "European Wax Center",
      "category": "Self care + Grooming",
      "account": "U CSP 9369 due 15th",
      "amount": 25.8,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249241104035632001",
      "date": "2026-07-11",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP 9369 due 15th",
      "amount": 27.68,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249149949875868297",
      "date": "2026-07-11",
      "merchant": "CVS",
      "category": "Medical + Dentist",
      "account": "U CFF 6579 due 15th",
      "amount": 5.32,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249149949875868296",
      "date": "2026-07-11",
      "merchant": "CVS",
      "category": "Medical + Dentist",
      "account": "U CFF 6579 due 15th",
      "amount": 17.07,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249119035827442057",
      "date": "2026-07-11",
      "merchant": "Costco",
      "category": "C'mas, Bday, India gifts \ud83c\udf84 \ud83c\udf82 \ud83c\uddee\ud83c\uddf3",
      "account": "Costco Visa 3744 due 17th",
      "amount": 319.86,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591202",
      "date": "2026-07-10",
      "merchant": "La Vida Salon",
      "category": "Self care + Grooming",
      "account": "U CSP (...8373) due 15th",
      "amount": 193.5,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591078",
      "date": "2026-07-10",
      "merchant": "SimpliSafe",
      "category": "Home Security",
      "account": "U CSP (...8373) due 15th",
      "amount": 24.51,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249241515354247239",
      "date": "2026-07-10",
      "merchant": "The Milkshake Factor",
      "category": "Eating out",
      "account": "T CSP 5914 due 15th ",
      "amount": 35.38,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249241104035632004",
      "date": "2026-07-10",
      "merchant": "SimpliSafe",
      "category": "Home Security",
      "account": "U CSP 9369 due 15th",
      "amount": 24.51,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249241104035632003",
      "date": "2026-07-10",
      "merchant": "La Vida Salon",
      "category": "Self care + Grooming",
      "account": "U CSP 9369 due 15th",
      "amount": 193.5,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249034180698592011",
      "date": "2026-07-10",
      "merchant": "Dividend Received Invesco QQQ Tr Unit Ser 1 (Qqq) (Cash)",
      "category": "Dividends & Capital Gains",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 0.81,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "249034180698592010",
      "date": "2026-07-10",
      "merchant": "Purchase Into Core Account Cash (315994103) (Cash)",
      "category": "Cash & ATM",
      "account": "Joint WROS - TOD (...3919)",
      "amount": 0.81,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249031710878486900",
      "date": "2026-07-10",
      "merchant": "Uber Eats",
      "category": "Eating out",
      "account": "U AMEX Plat 1003 due 6th",
      "amount": 21.73,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248999632987247238",
      "date": "2026-07-10",
      "merchant": "Zelle",
      "category": "Other Income (incl cc reward credits)",
      "account": "Primary Checking ...002 (....002)",
      "amount": 266.6,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "255484189675638918",
      "date": "2026-07-09",
      "merchant": "J. Crew",
      "category": "Clothing, Shoes, Jewelry",
      "account": "U CSP (...8373) due 15th",
      "amount": 96.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484117813580389",
      "date": "2026-07-09",
      "merchant": "Miga Sushi",
      "category": "Eating out",
      "account": "U CFF (...2344) due 15th",
      "amount": 98.9,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "249149948370113010",
      "date": "2026-07-09",
      "merchant": "J. Crew",
      "category": "Clothing, Shoes, Jewelry",
      "account": "U CSP 9369 due 15th",
      "amount": 96.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248968068861547306",
      "date": "2026-07-09",
      "merchant": "Miga Sushi",
      "category": "Eating out",
      "account": "U CFF 6579 due 15th",
      "amount": 98.9,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248914296014656264",
      "date": "2026-07-09",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 2.12,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "248914296014656263",
      "date": "2026-07-09",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 1.8,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "248914296014656262",
      "date": "2026-07-09",
      "merchant": "Withholding",
      "category": "Credit Card + Financial Fees",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 0.32,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248906041937907856",
      "date": "2026-07-09",
      "merchant": "Anthem",
      "category": "Medical + Dentist",
      "account": "Primary Checking ...002 (....002)",
      "amount": 157.5,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248906041937907855",
      "date": "2026-07-09",
      "merchant": "Zelle",
      "category": "Home maintenance",
      "account": "Primary Checking ...002 (....002)",
      "amount": 175.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248818070831255624",
      "date": "2026-07-09",
      "merchant": "Merck & Co Inc Com Merck & Co Inc Com Move 3.787 Shares From Retail to Stock Plan  Memo",
      "category": "Transfer",
      "account": "Individual Brokerage -9148 (...9148)",
      "amount": 0.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189675638879",
      "date": "2026-07-08",
      "merchant": "JP Boden Svcs",
      "category": "Shopping",
      "account": "U CSP (...8373) due 15th",
      "amount": 109.4,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988293",
      "date": "2026-07-08",
      "merchant": "Mindful Medicine",
      "category": "Medical + Dentist",
      "account": "U CSP (...8373) due 15th",
      "amount": 300.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248968070112498645",
      "date": "2026-07-08",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248968066335527323",
      "date": "2026-07-08",
      "merchant": "JP Boden Svcs Inc",
      "category": "Clothing, Shoes, Jewelry",
      "account": "U CSP 9369 due 15th",
      "amount": 109.4,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248968066335527322",
      "date": "2026-07-08",
      "merchant": "Mindful Medicine",
      "category": "Medical + Dentist",
      "account": "U CSP 9369 due 15th",
      "amount": 300.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248883985112387678",
      "date": "2026-07-08",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 0.72,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "248883984959295558",
      "date": "2026-07-08",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 76.77,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "248883984959295557",
      "date": "2026-07-08",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "amount": 76.77,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "248883984245215280",
      "date": "2026-07-08",
      "merchant": "Sweep In",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
      "amount": 0.03,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "248795351497593819",
      "date": "2026-07-08",
      "merchant": "Merck & Co Inc New Com Dividend Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Individual Brokerage -9148 (...9148)",
      "amount": 510.1,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "248730380544790780",
      "date": "2026-07-08",
      "merchant": "Zelle",
      "category": "School stuff + Education",
      "account": "Primary Checking ...002 (....002)",
      "amount": 100.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248730380544790779",
      "date": "2026-07-08",
      "merchant": "Verizon",
      "category": "Internet & Cable",
      "account": "Primary Checking ...002 (....002)",
      "amount": 79.99,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988307",
      "date": "2026-07-07",
      "merchant": "Dollar Tree",
      "category": "Shopping",
      "account": "U CSP (...8373) due 15th",
      "amount": 2.58,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248874956096033210",
      "date": "2026-07-07",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U WOH.6581 due 21st",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248874946037043646",
      "date": "2026-07-07",
      "merchant": "Dollar Tree",
      "category": "Shopping",
      "account": "U CSP 9369 due 15th",
      "amount": 2.58,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248797165694505830",
      "date": "2026-07-07",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 0.72,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "248797165694505829",
      "date": "2026-07-07",
      "merchant": "Sweep Out",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 1221.84,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "248797165498422059",
      "date": "2026-07-07",
      "merchant": "Sweep Out",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 970.37,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "248797165134566164",
      "date": "2026-07-07",
      "merchant": "Sweep Out",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 1273.34,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "248797164916462328",
      "date": "2026-07-07",
      "merchant": "Sweep Out",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
      "amount": 46.74,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "248797164916462327",
      "date": "2026-07-07",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
      "amount": 0.03,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "248730380544790782",
      "date": "2026-07-07",
      "merchant": "American Express",
      "category": "Credit Card Payment",
      "account": "Primary Checking ...002 (....002)",
      "amount": 203.26,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248730380544790781",
      "date": "2026-07-07",
      "merchant": "Venmo",
      "category": "Shopping",
      "account": "Primary Checking ...002 (....002)",
      "amount": 2.0,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248705401161798415",
      "date": "2026-07-07",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 1221.84,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248705400560964101",
      "date": "2026-07-07",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "amount": 970.37,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248705400315597289",
      "date": "2026-07-07",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
      "amount": 46.74,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248705399824863653",
      "date": "2026-07-07",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 803.65,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248705399824863652",
      "date": "2026-07-07",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 146.12,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248705399824863651",
      "date": "2026-07-07",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 193.5,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248705399824863650",
      "date": "2026-07-07",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 482.11,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248705399824863649",
      "date": "2026-07-07",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 378.56,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248705399824863648",
      "date": "2026-07-07",
      "merchant": "Sell",
      "category": "Sell",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 970.38,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248705399824863647",
      "date": "2026-07-07",
      "merchant": "Buy",
      "category": "Buy",
      "account": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "amount": 239.78,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484189674591220",
      "date": "2026-07-06",
      "merchant": "FirstEnergy",
      "category": "Gas & Electric",
      "account": "U CSP (...8373) due 15th",
      "amount": 584.93,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988240",
      "date": "2026-07-06",
      "merchant": "Walmart",
      "category": "Groceries",
      "account": "U CSP (...8373) due 15th",
      "amount": 70.34,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "255484187761988208",
      "date": "2026-07-06",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U CSP (...8373) due 15th",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248783459386413828",
      "date": "2026-07-06",
      "merchant": "LAZ Parking",
      "category": "Transportation",
      "account": "U CSP 9369 due 15th",
      "amount": 18.71,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248783459386413823",
      "date": "2026-07-06",
      "merchant": "FirstEnergy",
      "category": "Gas & Electric",
      "account": "U CSP 9369 due 15th",
      "amount": 584.93,
      "isIncome": false,
      "tags": ""
    },
    {
      "id": "248705401161798419",
      "date": "2026-07-06",
      "merchant": "Dividend",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 585.95,
      "isIncome": true,
      "tags": ""
    },
    {
      "id": "248705401161798418",
      "date": "2026-07-06",
      "merchant": "Reinvestment",
      "category": "Dividends & Capital Gains",
      "account": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "amount": 585.95,
      "isIncome": true,
      "tags": ""
    }
  ]
};

const DEFAULT_REAL_CLAIMS = [
  {
    "id": "claim-barness-2026-10-13",
    "date": "2026-10-13",
    "provider": "Mindful Medicine (Dr. Barness)",
    "patient": "Xavier Healy",
    "amountPaid": 300.0,
    "expectedRecovery": 210.0,
    "reimbursedAmount": 0.0,
    "submissionType": "self",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "with_included_health",
    "inPortal": true,
    "inBank": false,
    "claimNumber": "",
    "nextAction": "Submitted to Anthem with Receipt #006190 — in review ($210.00 expected)",
    "notes": "Medication Management (CPT: 99214, Diagnosis: F90.0). Billed Rate: $300.00. Submitted directly to Anthem for reimbursement (Receipt #006190 attached)."
  },
  {
    "id": "claim-ms-2026-10-14",
    "date": "2026-10-14",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 0.0,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "with_included_health",
    "inPortal": true,
    "inBank": false,
    "claimNumber": "",
    "nextAction": "Submitted to Anthem — in review ($157.50 expected)",
    "notes": "Therapy session. Paid $225 via U CSP ...8373 on 2026-10-14. Submitted directly to Anthem for reimbursement."
  },
  {
    "id": "claim-barness-2026-09-15",
    "date": "2026-09-15",
    "provider": "Mindful Medicine (Dr. Barness)",
    "patient": "Xavier Healy",
    "amountPaid": 300.0,
    "expectedRecovery": 210.0,
    "reimbursedAmount": 0.0,
    "submissionType": "self",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "with_included_health",
    "inPortal": true,
    "inBank": false,
    "claimNumber": "",
    "nextAction": "Submitted to Anthem with Receipt #005834 — in review ($210.00 expected)",
    "notes": "Medication Management (CPT: 99214, Diagnosis: F90.0). Billed Rate: $300.00. Submitted directly to Anthem for reimbursement (Receipt #005834 attached)."
  },
  {
    "id": "claim-barness-2026-08-21",
    "date": "2026-08-21",
    "provider": "Mindful Medicine (Dr. Barness)",
    "patient": "Xavier Healy",
    "amountPaid": 300.0,
    "expectedRecovery": 210.0,
    "reimbursedAmount": 0.0,
    "submissionType": "self",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "with_included_health",
    "inPortal": true,
    "inBank": false,
    "claimNumber": "",
    "nextAction": "Submitted to Anthem — in review ($210.00 expected)",
    "notes": "Medication Management (CPT: 99214, Diagnosis: F90.0). Billed Rate: $300.00. Submitted directly to Anthem for reimbursement."
  },
  {
    "id": "claim-barness-2026-07-08",
    "date": "2026-07-08",
    "provider": "Mindful Medicine (Dr. Barness)",
    "patient": "Xavier Healy",
    "amountPaid": 300.0,
    "expectedRecovery": 210.0,
    "reimbursedAmount": 0.0,
    "submissionType": "self",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "need_superbill",
    "stage": "ready_to_send",
    "inPortal": false,
    "inBank": false,
    "claimNumber": "",
    "nextAction": "Waiting for copy of invoice from Dr. Barness to submit to Anthem ($210.00 recovery)",
    "notes": "Medication Management (CPT: 99214, Diagnosis: F90.0). Billed Rate: $300.00. Waiting for copy of invoice so claim can be submitted to Anthem."
  },
  {
    "id": "claim-barness-2026-06-01",
    "date": "2026-06-01",
    "provider": "Mindful Medicine (Dr. Barness)",
    "patient": "Xavier Healy",
    "amountPaid": 300.0,
    "expectedRecovery": 210.0,
    "reimbursedAmount": 0.0,
    "submissionType": "self",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "with_included_health",
    "inPortal": true,
    "inBank": false,
    "claimNumber": "",
    "nextAction": "Submitted to Anthem — in review ($210.00 expected)",
    "notes": "Medication Management (CPT: 99214, Diagnosis: F90.0). Billed Rate: $300.00. Submitted directly to Anthem for reimbursement."
  },
  {
    "id": "claim-barness-2026-05-04",
    "date": "2026-05-04",
    "provider": "Mindful Medicine (Dr. Barness)",
    "patient": "Xavier Healy",
    "amountPaid": 300.0,
    "expectedRecovery": 210.0,
    "reimbursedAmount": 0.0,
    "submissionType": "self",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "with_included_health",
    "inPortal": true,
    "inBank": false,
    "claimNumber": "",
    "nextAction": "Submitted to Anthem — in review ($210.00 expected)",
    "notes": "Medication Management (CPT: 99214, Diagnosis: F90.0). Billed Rate: $300.00. Submitted directly to Anthem for reimbursement."
  },
  {
    "id": "claim-barness-2026-03-13",
    "date": "2026-03-13",
    "provider": "Mindful Medicine (Dr. Barness)",
    "patient": "Xavier Healy",
    "amountPaid": 300.0,
    "expectedRecovery": 210.0,
    "reimbursedAmount": 0.0,
    "submissionType": "self",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "with_included_health",
    "inPortal": true,
    "inBank": false,
    "claimNumber": "",
    "nextAction": "Submitted to Anthem — in review ($210.00 expected)",
    "notes": "Medication Management (CPT: 99214, Diagnosis: F90.0). Billed Rate: $300.00. Submitted directly to Anthem for reimbursement."
  },
  {
    "id": "claim-barness-2026-03-02",
    "date": "2026-03-02",
    "provider": "Mindful Medicine (Dr. Barness)",
    "patient": "Xavier Healy",
    "amountPaid": 300.0,
    "expectedRecovery": 210.0,
    "reimbursedAmount": 0.0,
    "submissionType": "self",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "with_included_health",
    "inPortal": true,
    "inBank": false,
    "claimNumber": "",
    "nextAction": "Submitted to Anthem — in review ($210.00 expected)",
    "notes": "Medication Management (CPT: 99214, Diagnosis: F90.0). Billed Rate: $300.00. Submitted directly to Anthem for reimbursement."
  },
  {
    "id": "claim-neuro-2025-10-15",
    "date": "2025-10-15",
    "provider": "Dr. Koffman (North Jersey Neuropsychology)",
    "patient": "Xavier Healy",
    "amountPaid": 2375.0,
    "expectedRecovery": 1457.76,
    "reimbursedAmount": 0.0,
    "submissionType": "provider",
    "payoutMethod": "check",
    "superbillStatus": "have",
    "stage": "check_due",
    "reissueRequested": true,
    "inPortal": true,
    "inBank": false,
    "claimNumber": "20253272A0969",
    "eobPlanPaid": 1457.76,
    "nextAction": "Anthem form submitted for missing check ($1,457.76) — Claim Tracking ID: 20253272A0969",
    "notes": "Evaluation. Billed $5,000, Plan Paid $1,457.76. Filled out Anthem form re missing check ($1,457.76). Claim Tracking ID: 20253272A0969."
  },
  {
    "id": "claim-barness-2026-02-02",
    "date": "2026-02-02",
    "provider": "Mindful Medicine (Dr. Barness)",
    "patient": "Xavier Healy",
    "amountPaid": 300.0,
    "expectedRecovery": 210.0,
    "reimbursedAmount": 0.0,
    "submissionType": "self",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "check_due",
    "reissueRequested": true,
    "inPortal": true,
    "inBank": false,
    "claimNumber": "20260462A0745",
    "eobPlanPaid": 210.0,
    "nextAction": "Anthem inquiry active re missing check ($210.00) — Claim #20260462A0745",
    "notes": "Missing Reimbursement Check/Payment — Claim #20260462A0745. Subscriber: Ujjaini Dasgupta, Patient: Xavier Healy, Provider: Michael Barness, MD (Mindful Medicine). Date of Service: February 2, 2026. Billed $300.00, Plan Paid $210.00 according to EOB (processed in late February with $210.00 approved to subscriber). Inquiry filed with Anthem re missing check."
  },
  {
    "id": "claim-ms-2026-01-28",
    "date": "2026-01-28",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 70.0,
    "reimbursedAmount": 0.0,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "check_due",
    "reissueRequested": true,
    "inPortal": true,
    "inBank": false,
    "claimNumber": "2026036ML5580",
    "eobPlanPaid": 70.0,
    "nextAction": "Anthem form submitted for missing check ($70.00) — Claim Tracking ID: 2026036ML5580",
    "notes": "Partial adjustment of $70 approved to meet $800 deductible cap. Filled out Anthem form re missing check ($70.00). Claim Tracking ID: 2026036ML5580."
  },
  {
    "id": "claim-ms-2026-10-07",
    "date": "2026-10-07",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": false,
    "inBank": true,
    "claimNumber": "",
    "eobPlanPaid": 0.0,
    "nextAction": "Reconciled in bank ($157.50 deposited on 2026-10-07)",
    "notes": "Therapy session. Paid CC. Expected 70% recovery: $157.50."
  },
  {
    "id": "claim-ms-2026-09-30",
    "date": "2026-09-30",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": false,
    "inBank": true,
    "claimNumber": "",
    "eobPlanPaid": 0.0,
    "nextAction": "Reconciled in bank ($157.50 deposited on 2026-10-06)",
    "notes": "Therapy session. Paid CC. Expected 70% recovery: $157.50."
  },
  {
    "id": "claim-ms-2026-09-23",
    "date": "2026-09-23",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 0.0,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "with_included_health",
    "inPortal": true,
    "inBank": false,
    "claimNumber": "2026274MM5322",
    "eobPlanPaid": 157.5,
    "nextAction": "Approved 10/01 by Anthem ($157.50) \u2014 awaiting direct deposit batch",
    "notes": "Therapy session. Paid CC. Expected 70% recovery: $157.50."
  },
  {
    "id": "claim-ms-2026-09-16",
    "date": "2026-09-16",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 0.0,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "with_included_health",
    "inPortal": true,
    "inBank": false,
    "claimNumber": "2026273871371",
    "eobPlanPaid": 157.5,
    "nextAction": "Approved 09/30 by Anthem ($157.50) \u2014 awaiting direct deposit batch",
    "notes": "Therapy session. Paid CC. Expected 70% recovery: $157.50."
  },
  {
    "id": "claim-ms-2026-09-14",
    "date": "2026-09-14",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 0.0,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "with_included_health",
    "inPortal": true,
    "inBank": false,
    "claimNumber": "2026265875264",
    "eobPlanPaid": 157.5,
    "nextAction": "Approved 09/22 by Anthem ($157.50) \u2014 awaiting direct deposit batch",
    "notes": "Therapy session. Paid CC. Expected 70% recovery: $157.50."
  },
  {
    "id": "claim-bock-2026-04-29",
    "date": "2026-04-29",
    "provider": "Roseland Psychotherapy (Maxine Bock)",
    "patient": "Ujjaini Dasgupta",
    "amountPaid": 245.0,
    "expectedRecovery": 0.0,
    "reimbursedAmount": 0.0,
    "submissionType": "self",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026125MJ9570",
    "eobPlanPaid": 0.0,
    "nextAction": "Reconciled \u2014 applied 100% to annual out-of-network deductible",
    "notes": "Invoice S278565. Billed $245.00. Applied to deductible ($0 paid by plan)."
  },
  {
    "id": "claim-bock-2026-04-15",
    "date": "2026-04-15",
    "provider": "Roseland Psychotherapy (Maxine Bock)",
    "patient": "Ujjaini Dasgupta",
    "amountPaid": 245.0,
    "expectedRecovery": 0.0,
    "reimbursedAmount": 0.0,
    "submissionType": "self",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026108MB4822",
    "eobPlanPaid": 0.0,
    "nextAction": "Reconciled \u2014 applied 100% to annual out-of-network deductible",
    "notes": "Invoice S278565. Billed $245.00. Applied to deductible ($0 paid by plan)."
  },
  {
    "id": "claim-bock-2026-04-08",
    "date": "2026-04-08",
    "provider": "Roseland Psychotherapy (Maxine Bock)",
    "patient": "Ujjaini Dasgupta",
    "amountPaid": 275.0,
    "expectedRecovery": 0.0,
    "reimbursedAmount": 0.0,
    "submissionType": "self",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026104MD4194",
    "eobPlanPaid": 0.0,
    "nextAction": "Reconciled \u2014 applied 100% to annual out-of-network deductible",
    "notes": "Invoice S278565. Billed $275.00. Applied to deductible ($0 paid by plan)."
  },
  {
    "id": "claim-barness-2026-01-05",
    "date": "2026-01-05",
    "provider": "Mindful Medicine (Dr. Barness)",
    "patient": "Xavier Healy",
    "amountPaid": 300.0,
    "expectedRecovery": 210.0,
    "reimbursedAmount": 210.0,
    "submissionType": "self",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "20260112A0709",
    "eobPlanPaid": 210.0,
    "nextAction": "Reconciled in bank ($210.00 deposited on 2026-03-05)",
    "notes": "Medication Management. Reimbursed $210.00 directly into primary checking."
  },
  {
    "id": "claim-barness-2025-12-08",
    "date": "2025-12-08",
    "provider": "Mindful Medicine (Dr. Barness)",
    "patient": "Xavier Healy",
    "amountPaid": 600.0,
    "expectedRecovery": 328.88,
    "reimbursedAmount": 328.88,
    "submissionType": "self",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "20253482A1115",
    "eobPlanPaid": 328.88,
    "nextAction": "Reconciled in bank ($328.88 deposited on 2026-03-18)",
    "notes": "Medication Management. Reimbursed $328.88 directly into primary checking."
  },
  {
    "id": "claim-ms-2026-09-09",
    "date": "2026-09-09",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026262MO3192",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-09-02",
    "date": "2026-09-02",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026262ML6150",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-08-12",
    "date": "2026-08-12",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026238MA8126",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-08-05",
    "date": "2026-08-05",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026224875853",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-06-24",
    "date": "2026-06-24",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026183MD4710",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-06-17",
    "date": "2026-06-17",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026175MC3470",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-06-10",
    "date": "2026-06-10",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026169MH5524",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-06-08",
    "date": "2026-06-08",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026164MI1665",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-06-03",
    "date": "2026-06-03",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026158MI6330",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-05-27",
    "date": "2026-05-27",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026151088166",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-05-13",
    "date": "2026-05-13",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026137488542",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-05-11",
    "date": "2026-05-11",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026136ME2063",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-05-06",
    "date": "2026-05-06",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026130MB5245",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-04-29",
    "date": "2026-04-29",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026123MA5213",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-04-27",
    "date": "2026-04-27",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026121MN5640",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-04-15",
    "date": "2026-04-15",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026112493307",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-04-10",
    "date": "2026-04-10",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026106MB7627",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-04-08",
    "date": "2026-04-08",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026102MA3556",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-04-01",
    "date": "2026-04-01",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026095494159",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-03-25",
    "date": "2026-03-25",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026088474542",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-03-20",
    "date": "2026-03-20",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026085MQ8647",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-03-18",
    "date": "2026-03-18",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026084MA4369",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-03-11",
    "date": "2026-03-11",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026077MK9442",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-03-04",
    "date": "2026-03-04",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026071498593",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-02-25",
    "date": "2026-02-25",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026071089189",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-02-18",
    "date": "2026-02-18",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026053MD3909",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-02-11",
    "date": "2026-02-11",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026046482714",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2026-02-04",
    "date": "2026-02-04",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026043MB1674",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2025-12-31",
    "date": "2025-12-31",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2026007MK5033",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  },
  {
    "id": "claim-ms-2025-12-17",
    "date": "2025-12-17",
    "provider": "Mindsoother Therapy",
    "patient": "Xavier Healy",
    "amountPaid": 225.0,
    "expectedRecovery": 157.5,
    "reimbursedAmount": 157.5,
    "submissionType": "provider",
    "payoutMethod": "direct_deposit",
    "superbillStatus": "have",
    "stage": "settled",
    "inPortal": true,
    "inBank": true,
    "claimNumber": "2025355MA1909",
    "eobPlanPaid": 157.5,
    "nextAction": "Reconciled in bank ($157.50 deposited)",
    "notes": "Therapy session. Reimbursed at 70% ($157.50 deposited in checking)."
  }
];

const DEFAULT_NET_WORTH_DATA = {
  "asOfDate": "2026-10-11",
  "totalAssets": 6506243.67,
  "totalLiabilities": 290484.68,
  "netWorth": 6215758.99,
  "liquidCash": 275755.25,
  "accounts": [
    {
      "id": "acc-39565205",
      "name": "5 Stonewall Dr Livingston NJ 07039",
      "balance": 1339700.0,
      "assetClass": "realestate",
      "subType": "Primary Residence",
      "institution": "Livingston NJ",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-43602709",
      "name": "Tom\u2019s ERCO 401k",
      "balance": 799987.53,
      "assetClass": "retirement",
      "subType": "401(k) Plan",
      "institution": "Google / ERCO",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-33558366",
      "name": "Ujjaini Dasgupta - Traditional IRA Brokerage Account - ****7008 (Managed) (...7008)",
      "balance": 790651.59,
      "assetClass": "retirement",
      "subType": "IRA (Trad / Roth)",
      "institution": "Schwab",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-86772609",
      "name": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****8042 (Self-Managed) (...8042)",
      "balance": 674725.44,
      "assetClass": "brokerage",
      "subType": "Taxable Brokerage",
      "institution": "Schwab",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-16454974",
      "name": "Thomas L Healy - Traditional IRA Brokerage Account - ****8017 (Managed) (...8017)",
      "balance": 561153.11,
      "assetClass": "retirement",
      "subType": "IRA (Trad / Roth)",
      "institution": "Schwab",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-13943549",
      "name": "Google Equity Awards (...ards)",
      "balance": 502033.37,
      "assetClass": "equity",
      "subType": "Company Stock / RSUs",
      "institution": "Google / Morgan Stanley",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-29439402",
      "name": "Ujjaini Dasgupta, Thomas L Healy - Brokerage Account - ****0093 (Managed) (...0093)",
      "balance": 443186.65,
      "assetClass": "brokerage",
      "subType": "Taxable Brokerage",
      "institution": "Schwab",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-16954342",
      "name": "GOOGLE LLC 401(K) SAVINGS PLAN (Self-Managed) - **3926 (...3926)",
      "balance": 410089.0,
      "assetClass": "retirement",
      "subType": "401(k) Plan",
      "institution": "Google / ERCO",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-86716765",
      "name": "Joint WROS - TOD (...3919)",
      "balance": 400748.17,
      "assetClass": "brokerage",
      "subType": "Taxable Brokerage",
      "institution": "Schwab",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-60246289",
      "name": "360 Performance Savings (...4275)",
      "balance": 217743.44,
      "assetClass": "cash",
      "subType": "High-Yield Savings & CD",
      "institution": "Capital One",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-62515658",
      "name": "Schwab 529 Plan ...-01 (....-01)",
      "balance": 112223.74,
      "assetClass": "education",
      "subType": "529 College Savings",
      "institution": "Schwab",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-38969274",
      "name": "Stock Plan (MRK) -9148 (...9148)",
      "balance": 84873.73,
      "assetClass": "equity",
      "subType": "Company Stock / RSUs",
      "institution": "Google / Morgan Stanley",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-70667186",
      "name": "Thomas L Healy - Roth IRA Brokerage Account - ****3746 (Managed) (...3746)",
      "balance": 36865.85,
      "assetClass": "retirement",
      "subType": "IRA (Trad / Roth)",
      "institution": "Schwab",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-63925421",
      "name": "2023 Ford Mustang MACH-E GT",
      "balance": 36401.3,
      "assetClass": "vehicle",
      "subType": "Vehicle Equity",
      "institution": "Vehicle",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-35211830",
      "name": "2024 Audi Q4 Etron Premium Plus",
      "balance": 33939.15,
      "assetClass": "vehicle",
      "subType": "Vehicle Equity",
      "institution": "Vehicle",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-70598831",
      "name": "CD (...2555)",
      "balance": 29402.92,
      "assetClass": "cash",
      "subType": "High-Yield Savings & CD",
      "institution": "Capital One",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-41346781",
      "name": "Primary Checking ...002 (....002)",
      "balance": 27265.58,
      "assetClass": "cash",
      "subType": "Checking & Cash",
      "institution": "Schwab / Apple",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-77658014",
      "name": "Individual Brokerage -9148 (...9148)",
      "balance": 3733.3,
      "assetClass": "brokerage",
      "subType": "Taxable Brokerage",
      "institution": "Schwab",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-19412290",
      "name": "360 Checking (...5441)",
      "balance": 1133.63,
      "assetClass": "cash",
      "subType": "Checking & Cash",
      "institution": "Schwab / Apple",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-56942867",
      "name": "Costco Visa 3744 due 17th",
      "balance": 176.49,
      "assetClass": "liability",
      "subType": "Revolving Credit",
      "institution": "Citi",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-32595898",
      "name": "Kids Savings Account (...8421)",
      "balance": 142.62,
      "assetClass": "cash",
      "subType": "High-Yield Savings & CD",
      "institution": "Capital One",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-20885884",
      "name": "Apple Cash",
      "balance": 67.06,
      "assetClass": "cash",
      "subType": "Checking & Cash",
      "institution": "Schwab / Apple",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-21431657",
      "name": "Apple Card due 27th",
      "balance": 0.0,
      "assetClass": "liability",
      "subType": "Revolving Credit",
      "institution": "Apple",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-71014830",
      "name": "Target Circle Card (...9620) due 1st",
      "balance": 0.0,
      "assetClass": "liability",
      "subType": "Revolving Credit",
      "institution": "Credit Card",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-16358273",
      "name": "T AMEX HH 1006 due 4th",
      "balance": 0.0,
      "assetClass": "liability",
      "subType": "Revolving Credit",
      "institution": "Amex",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-47001079",
      "name": "T Amex Everyday 1002 due 5th",
      "balance": 0.0,
      "assetClass": "liability",
      "subType": "Revolving Credit",
      "institution": "Amex",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-83011538",
      "name": "U Amex EveryDay 3003 due 5th",
      "balance": 0.0,
      "assetClass": "liability",
      "subType": "Revolving Credit",
      "institution": "Amex",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-62616546",
      "name": "U AMEX HH 2000 due 13th",
      "balance": 0.0,
      "assetClass": "liability",
      "subType": "Revolving Credit",
      "institution": "Amex",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-76589782",
      "name": "U Amazon 9598 due 15th",
      "balance": -77.54,
      "assetClass": "liability",
      "subType": "Revolving Credit",
      "institution": "Chase",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-38088401",
      "name": "U WOH.6581 due 21st",
      "balance": -232.16,
      "assetClass": "liability",
      "subType": "Revolving Credit",
      "institution": "Chase",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-74621296",
      "name": "U AMEX Plat 1003 due 6th",
      "balance": -685.41,
      "assetClass": "liability",
      "subType": "Revolving Credit",
      "institution": "Amex",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-81702020",
      "name": "U CFF (...2344) due 15th",
      "balance": -1105.36,
      "assetClass": "liability",
      "subType": "Revolving Credit",
      "institution": "Chase",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-47751417",
      "name": "T CSP 5914 due 15th",
      "balance": -3473.18,
      "assetClass": "liability",
      "subType": "Revolving Credit",
      "institution": "Chase",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-57195158",
      "name": "U CSP (...8373) due 15th",
      "balance": -7768.78,
      "assetClass": "liability",
      "subType": "Revolving Credit",
      "institution": "Chase",
      "updated": "2026-10-11"
    },
    {
      "id": "acc-59100196",
      "name": "Mortgage (...1331) due 16th",
      "balance": -277142.25,
      "assetClass": "liability",
      "subType": "Mortgage",
      "institution": "Chase / Loan",
      "updated": "2026-10-11"
    }
  ],
  "milestones": [
    {
      "date": "2026-05-02",
      "assets": 5327881.29,
      "liabilities": 309278.64,
      "netWorth": 5018602.65
    },
    {
      "date": "2026-06-01",
      "assets": 6371633.2,
      "liabilities": 297536.72,
      "netWorth": 6074096.48
    },
    {
      "date": "2026-07-01",
      "assets": 6385018.36,
      "liabilities": 297264.72,
      "netWorth": 6087753.64
    },
    {
      "date": "2026-08-01",
      "assets": 6404934.99,
      "liabilities": 293896.9,
      "netWorth": 6111038.09
    },
    {
      "date": "2026-09-01",
      "assets": 6482553.33,
      "liabilities": 289515.88,
      "netWorth": 6193037.45
    },
    {
      "date": "2026-10-01",
      "assets": 6534663.09,
      "liabilities": 289674.48,
      "netWorth": 6244988.61
    },
    {
      "date": "2026-10-11",
      "assets": 6506243.67,
      "liabilities": 290484.68,
      "netWorth": 6215758.99
    }
  ]
};

const DEFAULT_FINANCE_CARDS_ROI = [
  {
    id: 'amex-plat',
    name: 'The Platinum Card® from American Express',
    shortName: 'Amex Platinum',
    accountName: 'U AMEX Plat 1003',
    accountMatch: '1003',
    annualFee: 895,
    network: 'American Express',
    theme: 'violet',
    color: '#7C3AED',
    renewalMonth: 'October',
    lastUpdated: '10/16/2026',
    benefits: [
      {
        id: 'amex-uber',
        category: 'Monthly',
        name: 'Uber Cash',
        maxVal: 200,
        cadence: 'Monthly',
        notes: '$15/mo ($35 in Dec) [Wallet / Uber Balance / Transaction History]',
        trackType: 'monthly',
        periods: { Jan: true, Feb: false, Mar: true, Apr: false, May: false, Jun: true, Jul: true, Aug: true, Sep: true, Oct: false, Nov: false, Dec: false },
        periodValues: { Jan: 15, Feb: 15, Mar: 15, Apr: 15, May: 15, Jun: 15, Jul: 15, Aug: 15, Sep: 15, Oct: 15, Nov: 15, Dec: 35 },
        realized: true,
        realizedValue: 100,
        matchKeywords: ['uber', 'uber eats'],
        redemptions: []
      },
      {
        id: 'amex-ent',
        category: 'Monthly',
        name: 'Digital Entertainment',
        maxVal: 300,
        cadence: 'Monthly',
        notes: '$25/mo auto-pay',
        trackType: 'monthly',
        periods: { Jan: true, Feb: true, Mar: true, Apr: true, May: true, Jun: true, Jul: true, Aug: true, Sep: false, Oct: true, Nov: false, Dec: false },
        periodValues: { Jan: 25, Feb: 25, Mar: 25, Apr: 25, May: 25, Jun: 25, Jul: 25, Aug: 25, Sep: 25, Oct: 25, Nov: 25, Dec: 25 },
        realized: true,
        realizedValue: 200,
        matchKeywords: ['disney', 'hulu', 'new york times', 'peacock', 'audible', 'espn'],
        redemptions: []
      },
      {
        id: 'amex-walmart',
        category: 'Monthly',
        name: 'Walmart+',
        maxVal: 155,
        cadence: 'Monthly',
        notes: 'Covers membership fee',
        trackType: 'monthly',
        periods: { Jan: true, Feb: true, Mar: true, Apr: true, May: true, Jun: true, Jul: true, Aug: true, Sep: false, Oct: true, Nov: false, Dec: false },
        periodValues: { Jan: 12.95, Feb: 12.95, Mar: 12.95, Apr: 12.95, May: 12.95, Jun: 12.95, Jul: 12.95, Aug: 12.95, Sep: 12.95, Oct: 12.95, Nov: 12.95, Dec: 12.95 },
        realized: true,
        realizedValue: 103,
        matchKeywords: ['walmart', 'walmart+'],
        redemptions: []
      },
      {
        id: 'amex-resy',
        category: 'Quarterly',
        name: 'Resy Dining',
        maxVal: 400,
        cadence: 'Quarterly',
        notes: '$100 per quarter',
        trackType: 'quarterly',
        periods: { Q1: true, Q2: true, Q3: true, Q4: false },
        periodValues: { Q1: 100, Q2: 100, Q3: 100, Q4: 100 },
        realized: true,
        realizedValue: 300,
        matchKeywords: ['resy', 'dining', 'restaurant'],
        redemptions: []
      },
      {
        id: 'amex-lulu',
        category: 'Quarterly',
        name: 'Lululemon',
        maxVal: 300,
        cadence: 'Quarterly',
        notes: '$75 per quarter',
        trackType: 'quarterly',
        periods: { Q1: true, Q2: false, Q3: false, Q4: false },
        periodValues: { Q1: 75, Q2: 75, Q3: 75, Q4: 75 },
        realized: true,
        realizedValue: 75,
        matchKeywords: ['lululemon'],
        redemptions: []
      },
      {
        id: 'amex-hotel',
        category: 'Semi-Annual',
        name: 'Hotel Credit',
        maxVal: 600,
        cadence: 'Semi-Annual',
        notes: '$300 Jan-Jun / $300 Jul-Dec',
        trackType: 'semi-annual',
        periods: { H1: false, H2: false },
        periodValues: { H1: 300, H2: 300 },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['fhr', 'fine hotels', 'hotel collection'],
        redemptions: []
      },
      {
        id: 'amex-airline',
        category: 'Annual',
        name: 'Airline Fee Credit',
        maxVal: 200,
        cadence: 'Annual',
        notes: 'Once per calendar year',
        trackType: 'annual',
        periods: { annual: false },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['airline', 'delta', 'united', 'baggage', 'seat'],
        redemptions: []
      },
      {
        id: 'amex-clear',
        category: 'Annual',
        name: 'CLEAR® Plus',
        maxVal: 209,
        cadence: 'Annual',
        notes: 'Once per calendar year (renew Sept 4)',
        trackType: 'annual',
        periods: { annual: true },
        realized: true,
        realizedValue: 209,
        matchKeywords: ['clear', 'clearme'],
        redemptions: []
      },
      {
        id: 'amex-equinox',
        category: 'Annual',
        name: 'Equinox',
        maxVal: 300,
        cadence: 'Annual',
        notes: 'Once per calendar year',
        trackType: 'annual',
        periods: { annual: false },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['equinox'],
        redemptions: []
      },
      {
        id: 'amex-oura',
        category: 'Annual',
        name: 'Oura Ring',
        maxVal: 200,
        cadence: 'Annual',
        notes: 'Once per calendar year',
        trackType: 'annual',
        periods: { annual: false },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['oura'],
        redemptions: []
      },
      {
        id: 'amex-uber-one',
        category: 'Annual',
        name: 'Uber One',
        maxVal: 120,
        cadence: 'Annual',
        notes: 'Once per calendar year (renew Dec)',
        trackType: 'annual',
        periods: { annual: false },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['uber one', 'uberone'],
        redemptions: []
      },
      {
        id: 'amex-ge',
        category: '4 years',
        name: 'Global Entry / TSA PreCheck (4-yr cycle)',
        maxVal: 120,
        cadence: '4 years',
        notes: 'Once per 4 years',
        trackType: 'multi-year',
        periods: { claim: false },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['global entry', 'tsa precheck', 'nexus'],
        redemptions: []
      }
    ]
  },
  {
    id: 'csp-u',
    name: 'Chase Sapphire Preferred® (U)',
    shortName: 'Sapphire Preferred (U)',
    accountName: 'U CSP (...8373)',
    accountMatch: '8373',
    annualFee: 95,
    network: 'Chase',
    theme: 'indigo',
    color: '#4F46E5',
    renewalMonth: 'March 18',
    lastUpdated: '10/16/2026',
    benefits: [
      {
        id: 'csp-u-hotel',
        category: 'Annual',
        name: 'Chase Travel Hotel Credit',
        maxVal: 100,
        cadence: 'Annual',
        notes: 'Resets on anniversary date 3/18',
        trackType: 'annual',
        periods: { annual: false },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['chase travel', 'hotel'],
        redemptions: []
      },
      {
        id: 'csp-u-apple',
        category: 'Annual',
        name: 'Apple TV Subscription',
        maxVal: 156,
        cadence: 'Annual',
        notes: '1 year complimentary (Activate by 12/31/26)',
        trackType: 'annual',
        periods: { annual: false },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['apple tv', 'apple.com/bill'],
        redemptions: []
      },
      {
        id: 'csp-u-ge',
        category: '4 Years',
        name: 'Global Entry / TSA / NEXUS',
        maxVal: 120,
        cadence: '4 Years',
        notes: 'Reimbursed fee once every 4 years',
        trackType: 'multi-year',
        periods: { claim: false },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['global entry', 'tsa precheck', 'nexus'],
        redemptions: []
      },
      {
        id: 'csp-u-dash-promo',
        category: 'Monthly',
        name: 'DashPass Grocery/Retail Promo',
        maxVal: 120,
        cadence: 'Monthly',
        notes: '$10 promo/mo for grocery or retail orders',
        trackType: 'quarterly',
        periods: { 'Jan-Mar': false, 'Apr-Jun': false, 'Jul-Sep': false, 'Oct-Dec': false },
        periodValues: { 'Jan-Mar': 30, 'Apr-Jun': 30, 'Jul-Sep': 30, 'Oct-Dec': 30 },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['doordash', 'dashpass'],
        redemptions: []
      },
      {
        id: 'csp-u-dash-sub',
        category: 'Annual',
        name: 'DashPass Membership',
        maxVal: 120,
        cadence: 'Annual',
        notes: 'Complimentary membership (Waived delivery fees)',
        trackType: 'quarterly',
        periods: { 'Jan-Mar': false, 'Apr-Jun': false, 'Jul-Sep': false, 'Oct-Dec': false },
        periodValues: { 'Jan-Mar': 30, 'Apr-Jun': 30, 'Jul-Sep': 30, 'Oct-Dec': 30 },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['doordash', 'dashpass'],
        redemptions: []
      }
    ]
  },
  {
    id: 'csp-t',
    name: 'Chase Sapphire Preferred® (T)',
    shortName: 'Sapphire Preferred (T)',
    accountName: 'T CSP 5914',
    accountMatch: '5914',
    annualFee: 95,
    network: 'Chase',
    theme: 'sky',
    color: '#0284C7',
    renewalMonth: 'May 1',
    lastUpdated: '10/16/2026',
    benefits: [
      {
        id: 'csp-t-hotel',
        category: 'Annual',
        name: 'Chase Travel Hotel Credit',
        maxVal: 100,
        cadence: 'Annual',
        notes: 'Resets on anniversary date May 1',
        trackType: 'annual',
        periods: { annual: true },
        realized: true,
        realizedValue: 100,
        matchKeywords: ['chase travel', 'hotel'],
        redemptions: []
      },
      {
        id: 'csp-t-apple',
        category: 'Annual',
        name: 'Apple TV Subscription',
        maxVal: 156,
        cadence: 'Annual',
        notes: '1 year complimentary (Activate by 12/31/26)',
        trackType: 'annual',
        periods: { annual: false },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['apple tv', 'apple.com/bill'],
        redemptions: []
      },
      {
        id: 'csp-t-ge',
        category: '4 Years',
        name: 'Global Entry / TSA / NEXUS',
        maxVal: 120,
        cadence: '4 Years',
        notes: 'Reimbursed fee once every 4 years',
        trackType: 'multi-year',
        periods: { claim: true },
        realized: true,
        realizedValue: 120,
        matchKeywords: ['global entry', 'tsa precheck', 'nexus'],
        redemptions: []
      },
      {
        id: 'csp-t-dash-promo',
        category: 'Monthly',
        name: 'DashPass Grocery/Retail Promo',
        maxVal: 120,
        cadence: 'Monthly',
        notes: '$10 promo/mo for grocery or retail orders',
        trackType: 'quarterly',
        periods: { 'Jan-Mar': false, 'Apr-Jun': false, 'Jul-Sep': false, 'Oct-Dec': false },
        periodValues: { 'Jan-Mar': 30, 'Apr-Jun': 30, 'Jul-Sep': 30, 'Oct-Dec': 30 },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['doordash', 'dashpass'],
        redemptions: []
      },
      {
        id: 'csp-t-dash-sub',
        category: 'Annual',
        name: 'DashPass Membership',
        maxVal: 120,
        cadence: 'Annual',
        notes: 'Complimentary membership (Waived delivery fees)',
        trackType: 'quarterly',
        periods: { 'Jan-Mar': false, 'Apr-Jun': false, 'Jul-Sep': false, 'Oct-Dec': false },
        periodValues: { 'Jan-Mar': 30, 'Apr-Jun': 30, 'Jul-Sep': 30, 'Oct-Dec': 30 },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['doordash', 'dashpass'],
        redemptions: []
      }
    ]
  },
  {
    id: 'hyatt-card',
    name: 'The World of Hyatt Credit Card',
    shortName: 'World of Hyatt (U)',
    accountName: 'U WOH.6581',
    accountMatch: '6581',
    annualFee: 95,
    network: 'Chase / Hyatt',
    theme: 'teal',
    color: '#0D98BA',
    renewalMonth: 'Annual',
    lastUpdated: '10/16/2026',
    benefits: [
      {
        id: 'hyatt-fnc',
        category: 'Annual',
        name: 'Anniversary Free Night (Cat 1-4)',
        maxVal: 250,
        cadence: 'Annual',
        notes: 'Valid for 1 year from issuance',
        trackType: 'annual',
        periods: { annual: false },
        status: 'Redeemed',
        realized: false,
        realizedValue: 0,
        matchKeywords: ['hyatt', 'world of hyatt'],
        redemptions: []
      },
      {
        id: 'hyatt-spend-fnc',
        category: 'Milestone',
        name: '$15k Spend Free Night (Cat 1-4)',
        maxVal: 250,
        cadence: 'Milestone',
        notes: 'Earned after $15k spend in calendar year',
        trackType: 'milestone',
        periods: { claim: false },
        status: 'In Progress',
        realized: false,
        realizedValue: 0,
        matchKeywords: ['hyatt'],
        redemptions: []
      },
      {
        id: 'hyatt-discoverist',
        category: 'Status',
        name: 'Automatic Discoverist Status',
        maxVal: 50,
        cadence: 'Status',
        notes: 'Covers 2 PM late checkout & bottled water',
        trackType: 'status',
        periods: { claim: false },
        status: 'Active',
        realized: false,
        realizedValue: 0,
        matchKeywords: ['discoverist', 'hyatt'],
        redemptions: []
      },
      {
        id: 'hyatt-doordash',
        category: 'Quarterly',
        name: 'DoorDash Non-Restaurant Promo',
        maxVal: 40,
        cadence: 'Quarterly',
        notes: 'Up to $10 off grocery/retail per quarter',
        trackType: 'quarterly',
        periods: { Q1: false, Q2: false, Q3: false, Q4: false },
        periodValues: { Q1: 10, Q2: 10, Q3: 10, Q4: 10 },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['doordash'],
        redemptions: []
      },
      {
        id: 'hyatt-tier-nights',
        category: 'Spend Tracking',
        name: 'Elite Night Credits ($5k increments)',
        maxVal: 0,
        cadence: 'Spend Tracking',
        notes: '2 Elite Nights per $5k spent on card; no assigned cash value, map path toward the major WOH Milestones (like the Milestone rewards at 20, 30, and 60 nights).',
        trackType: 'spend-milestone',
        periods: { '$5k': false, '$10k': false, '$15k': false, '$20k': false },
        periodValues: { '$5k': 0, '$10k': 0, '$15k': 0, '$20k': 0 },
        realized: false,
        realizedValue: 0,
        matchKeywords: ['hyatt'],
        redemptions: []
      }
    ]
  }
];

const DEFAULT_FINANCE_SUBSCRIPTIONS = [
  {
    id: 'sub-disney',
    name: 'Disney+ & Hulu Bundle',
    cost: 21.31,
    cadence: 'monthly',
    category: 'Entertainment',
    card: 'Amex Platinum',
    cardPerk: 'Covered by $20/mo Amex Ent Credit',
    nextRenewal: '2026-10-24',
    status: 'active',
    notes: 'Net out-of-pocket: $1.31/mo after $20 monthly statement credit'
  },
  {
    id: 'sub-nyt',
    name: 'The New York Times',
    cost: 4.00,
    cadence: 'monthly',
    category: 'News & Editorial',
    card: 'Amex Platinum',
    cardPerk: '100% Covered by Amex Ent Credit',
    nextRenewal: '2026-10-28',
    status: 'active',
    notes: 'Billed to Amex Plat and fully reimbursed via Ent Credit'
  },
  {
    id: 'sub-google',
    name: 'Google One (AI Premium & 2TB)',
    cost: 19.99,
    cadence: 'monthly',
    category: 'Productivity & AI',
    card: 'Chase Sapphire (U)',
    cardPerk: 'Earns 3x Points',
    nextRenewal: '2026-10-21',
    status: 'active',
    notes: 'Gemini Advanced, 2TB cloud storage & family sharing'
  },
  {
    id: 'sub-apple',
    name: 'Apple Services & iCloud+',
    cost: 9.99,
    cadence: 'monthly',
    category: 'Cloud & Storage',
    card: 'Apple Card',
    cardPerk: '3% Daily Cash',
    nextRenewal: '2026-10-18',
    status: 'active',
    notes: 'iCloud 2TB family backup storage'
  },
  {
    id: 'sub-nest',
    name: 'Nest Aware (Home Cam Security)',
    cost: 12.00,
    cadence: 'monthly',
    category: 'Home Security',
    card: 'Chase Sapphire (T)',
    cardPerk: 'Billed monthly',
    nextRenewal: '2026-10-15',
    status: 'active',
    notes: 'Whole-home video event history & smart alerts'
  },
  {
    id: 'sub-amazon',
    name: 'Amazon Kids+',
    cost: 4.99,
    cadence: 'monthly',
    category: 'Family & Kids',
    card: 'Chase Amazon',
    cardPerk: '5% Cash Back',
    nextRenewal: '2026-11-02',
    status: 'active',
    notes: 'Books, educational apps & parent controls'
  },
  {
    id: 'sub-walmart',
    name: 'Walmart+ Membership',
    cost: 12.95,
    cadence: 'monthly',
    category: 'Groceries & Delivery',
    card: 'Amex Platinum',
    cardPerk: '100% Covered by Amex Platinum',
    nextRenewal: '2026-11-10',
    status: 'active',
    notes: '$12.95/mo statement credit automatically offsets cost'
  }
];

DEFAULT_FINANCE_DATA.netWorth = DEFAULT_NET_WORTH_DATA;
DEFAULT_FINANCE_DATA.cardsROI = DEFAULT_FINANCE_CARDS_ROI;
DEFAULT_FINANCE_DATA.subscriptions = DEFAULT_FINANCE_SUBSCRIPTIONS;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_FINANCE_DATA, DEFAULT_REAL_CLAIMS, DEFAULT_FINANCE_CARDS_ROI, DEFAULT_FINANCE_SUBSCRIPTIONS };
}
