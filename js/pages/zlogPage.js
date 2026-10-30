/* ==========================================================================
   Book of Life / margo — Z's Care Sanctuary (Midnight Aurora, Dark + Light)
   Exact DOM & styling per margo-zhub.html + Meds & Protocol + Patterns & Insights
   Zero-data-loss controller backed by storage.data.zlogEntries & titrationHistory
   ========================================================================== */

/* --------------------------------------------------------------------------
   Inline SVG Icons (Exact paths from margo-zhub.html, Zero Emojis)
   -------------------------------------------------------------------------- */
const ZHUB_SVG_PATHS = {
  paw: '<circle cx="8" cy="8.500" r="2.200"/><circle cx="16" cy="8.500" r="2.200"/><circle cx="4.800" cy="13.500" r="2"/><circle cx="19.200" cy="13.500" r="2"/><path d="M12 12.500c3.200 0 5.300 3 5.300 5.500 0 1.600-1.100 2.200-2.600 2.200-1 0-1.600-.5-2.700-.5s-1.700.5-2.700.5C8.100 20.200 6.700 19.600 6.700 18c0-2.500 2.100-5.500 5.300-5.500z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.300 5.700M20 5v6h-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  chevL: '<path d="M15 6l-6 6 6 6"/>',
  chevR: '<path d="M9 6l6 6-6 6"/>',
  cal: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.900 4.900l1.400 1.400M17.700 17.700l1.400 1.400M2 12h2M20 12h2M4.900 19.100l1.400-1.400M17.700 6.300l1.400-1.400"/>',
  file: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>'
};

function zhubSvg(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${ZHUB_SVG_PATHS[name] || ''}</svg>`;
}

function zhubIcon(name) {
  return `<span class="ic" aria-hidden="true">${zhubSvg(name)}</span>`;
}

/* --------------------------------------------------------------------------
   4 Rating Levels — Color + Text (Strict Semantic Rating Tokens)
   -------------------------------------------------------------------------- */
const ZHUB_RATE = {
  great:  { l: 'Great day',    short: 'Great',        c: 'var(--cyan)',   v: 5 },
  almost: { l: 'Almost Good',  short: 'Almost Good',  c: 'var(--blue)',   v: 4 },
  okay:   { l: 'Okay day',     short: 'Okay',         c: 'var(--violet)', v: 3 },
  tough:  { l: 'Big feelings', short: 'Big feelings', c: 'var(--rose)',   v: 2 }
};

/* --------------------------------------------------------------------------
   Medication Definitions (Matching margo-zhub.html chip colors)
   -------------------------------------------------------------------------- */
const ZHUB_MED_DEFS = [
  { key: 'z',   n: 'Zoloft',        fullName: 'Sertraline (Zoloft)', defaultDose: '75mg',      schedule: 'Morning daily',          prescriber: 'Dr. Barness', c: 'var(--blue)' },
  { key: 'g',   n: 'Guanfacine XR', fullName: 'Guanfacine XR',       defaultDose: '2mg',       schedule: 'Morning daily',          prescriber: 'Dr. Barness', c: 'var(--cyan)' },
  { key: 'rit', n: 'Ritalin',       fullName: 'Ritalin IR',          defaultDose: '15 + 10mg', schedule: '7:30 AM + 11:00 AM',     prescriber: 'Dr. Barness', c: 'var(--rose)' },
  { key: 'mag', n: 'Magnesium',     fullName: 'Magnesium Glycinate', defaultDose: 'Daily',     schedule: 'Evening calming support', prescriber: 'Protocol',    c: 'var(--green)' },
  { key: 'mel', n: 'Melatonin',     fullName: 'Melatonin',           defaultDose: 'Bedtime',   schedule: 'Bedtime sleep support',   prescriber: 'Protocol',    c: 'var(--violet)' },
  { key: 'ris', n: 'Risperidone',   fullName: 'Risperdal (PRN)',     defaultDose: '0.25mg',    schedule: 'PRN / Stopped regular',   prescriber: 'Dr. Barness', c: 'var(--rose)' }
];

const ZHUB_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const ZHUB_SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/* --------------------------------------------------------------------------
   Tap-to-Select Checkpoint Capsule Definitions (Symmetrical, Nordic Palette)
   -------------------------------------------------------------------------- */
const ZHUB_CHECKPOINT_SECTIONS = [
  {
    title: 'Morning & Wake',
    theme: 'theme-blue',
    color: '#2E6FD0',
    items: [
      { id: 'm-wake',  label: '🌅 Smooth wake',     text: 'Woke up in a good mood' },
      { id: 'm-drop',  label: '🎒 Smooth drop-off', text: 'Good morning and smooth drop off' },
      { id: 'm-slow',  label: '🥱 Slow / groggy',   text: 'Slow morning and hard to wake up' },
      { id: 'm-antsy', label: '⚡ Antsy / hyper',    text: 'Very hyper and antsy in the morning' }
    ]
  },
  {
    title: 'School & Pickup',
    theme: 'theme-lavender',
    color: '#5B3FD9',
    items: [
      { id: 's-good',  label: '🏫 Great school day', text: 'Had a good day in school' },
      { id: 's-pick',  label: '🚗 Good pickup',      text: 'Was in good mood at pickup' },
      { id: 's-bump',  label: '🔄 Transition bump',  text: 'Minor friction during transition' },
      { id: 's-call',  label: '📞 School call',      text: 'Call / incident report from school' }
    ]
  },
  {
    title: 'Activities & Somatic Play',
    theme: 'theme-green',
    color: '#18935F',
    items: [
      { id: 'a-mocha', label: '🐶 Mocha play',    text: 'Played with Mocha' },
      { id: 'a-arts',  label: '🥋 Martial arts',  text: 'Did really well in martial arts' },
      { id: 'a-swim',  label: '🏊 Swimming',      text: 'Went to swim class' },
      { id: 'a-bike',  label: '🚲 Bike ride',     text: 'Went for bike ride with Mocha' },
      { id: 'a-lego',  label: '🧱 LEGOs',         text: 'Played LEGOs calmly' },
      { id: 'a-tv',    label: '📺 TV / Kindle',   text: 'Watched TV / Kindle' }
    ]
  },
  {
    title: 'Friction & Triggers',
    theme: 'theme-rose',
    color: '#C92B86',
    items: [
      { id: 'f-screen', label: '🛑 Screen limit',   text: 'Protested screen time cutoff' },
      { id: 'f-food',   label: '🍽️ Food pushback',  text: 'Complained about dinner options' },
      { id: 'f-bored',  label: '🥱 Boredom whine',  text: 'Whiny complaining about being bored' },
      { id: 'f-melt',   label: '💥 Meltdown',       text: 'Full escalation: screaming and kicking' }
    ]
  },
  {
    title: 'Evening & Bedtime',
    theme: 'theme-green',
    color: '#18935F',
    items: [
      { id: 'e-din',   label: '🍲 Dinner smooth',  text: 'Good about dinner' },
      { id: 'e-bath',  label: '🛁 Bath taken',     text: 'Took bath smoothly' },
      { id: 'e-sleep', label: '🌙 Asleep on time', text: 'Asleep on time around 8:30pm' },
      { id: 'e-late',  label: '⏰ Late sleep',     text: 'Bedtime resistance; fell asleep late' }
    ]
  }
];

let zhubSelectedCapsules = new Set();

/* --------------------------------------------------------------------------
   View State
   -------------------------------------------------------------------------- */
function getInitialZLogSubTab() {
  try {
    const rawHash = (window.location.hash || '').replace(/^#\/?/, '').trim();
    if (rawHash.startsWith('zlog')) {
      const parts = rawHash.split(/[\/\-_?]/);
      if (parts.length > 1) {
        const sub = parts[1].replace('tab=', '').toLowerCase();
        if (['timeline', 'calendar', 'titration', 'meds', 'insights', 'patterns'].includes(sub)) {
          if (sub === 'meds') return 'titration';
          if (sub === 'patterns') return 'insights';
          return sub;
        }
      }
    }
    const saved = localStorage.getItem('BOL_ZLOG_ACTIVE_SUBTAB');
    if (saved && ['timeline', 'calendar', 'titration', 'insights'].includes(saved)) {
      return saved;
    }
  } catch (e) {}
  return 'timeline';
}

let activeZLogSubTab = getInitialZLogSubTab();
let zhubRatingFilter = 'all'; // 'all' | 'great' | 'almost' | 'okay' | 'tough'
let zlogSearchQuery = '';
let zlogExpandedMonths = {};
let zhubMedOpen = {};
let zhubEvOpen = {};

let zhubMedsViewMode = (() => {
  try {
    const s = localStorage.getItem('BOL_ZHUB_MEDS_VIEW_MODE');
    if (s && ['both', 'by-med', 'chrono'].includes(s)) return s;
  } catch (e) {}
  return 'both';
})();

let zhubMedsCollapsed = (() => {
  try {
    const s = localStorage.getItem('BOL_ZHUB_MEDS_COLLAPSED_V2');
    if (s) {
      const parsed = JSON.parse(s);
      return {
        byMed: !!parsed.byMed,
        chrono: !!parsed.chrono
      };
    }
  } catch (e) {}
  return { byMed: false, chrono: false };
})();

let zhubMedHistoryOpen = {};

let zhubRatingMixFilter = (() => {
  try {
    const s = localStorage.getItem('BOL_ZHUB_RATING_MIX_FILTER');
    if (s && ['3m', '6m', '12m', 'all'].includes(s)) return s;
  } catch (e) {}
  return 'all';
})();

let zhubWeekdayFilter = (() => {
  try {
    const s = localStorage.getItem('BOL_ZHUB_WEEKDAY_FILTER');
    if (s && ['3m', '6m', '12m', 'all'].includes(s)) return s;
  } catch (e) {}
  return 'all';
})();

let zlogCalendarYear = (() => {
  try {
    const savedY = parseInt(localStorage.getItem('BOL_ZLOG_CAL_YEAR'), 10);
    if (!isNaN(savedY) && savedY >= 2024 && savedY <= 2030) return savedY;
  } catch (e) {}
  return 2026;
})();

let zlogCalendarMonth = (() => {
  try {
    const savedM = parseInt(localStorage.getItem('BOL_ZLOG_CAL_MONTH'), 10);
    if (!isNaN(savedM) && savedM >= 1 && savedM <= 12) return savedM;
  } catch (e) {}
  return 10;
})();

let zhubCalSelDate = null; // ISO date string e.g. '2026-10-02' or null
let zhubHeatYear = '2026';
let zhubToastTimer = null;
let zhubUndoFn = null;
let currentModalAttachments = [];
let zhubDialogRating = 'great';
let zhubEditingDate = null;

/* --------------------------------------------------------------------------
   Theme Management (margo-zhub-theme)
   -------------------------------------------------------------------------- */
function getZHubTheme() {
  try {
    const saved = localStorage.getItem('margo-zhub-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {}
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch (e) {}
  return 'dark';
}

function applyZHubTheme(theme) {
  if (typeof setTheme === 'function') {
    setTheme(theme, true);
    return;
  }
  const t = (theme === 'light') ? 'light' : 'dark';
  try {
    localStorage.setItem('margo-zhub-theme', t);
    localStorage.setItem('margo-theme', t);
  } catch (e) {}
  document.documentElement.setAttribute('data-theme', t);
  const root = document.querySelector('.zhub-sanctuary');
  if (root) root.setAttribute('data-theme', t);
  const wrap = document.querySelector('.zhub-sanctuary-wrap');
  if (wrap) wrap.setAttribute('data-theme', t);
  const btn = document.getElementById('themeBtn');
  if (btn) {
    btn.setAttribute('aria-pressed', t === 'light' ? 'true' : 'false');
    btn.setAttribute('aria-label', t === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    const txt = btn.querySelector('.t');
    if (txt) txt.textContent = (t === 'light') ? 'Dark' : 'Light';
  }
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.content = (t === 'light') ? '#F2F3FC' : '#0F1020';
  if (typeof updateThemeIcon === 'function') updateThemeIcon();
}

function toggleZHubTheme() {
  if (typeof toggleTheme === 'function') {
    toggleTheme();
  } else {
    const next = (getZHubTheme() === 'light') ? 'dark' : 'light';
    applyZHubTheme(next);
  }
}

/* --------------------------------------------------------------------------
   Lossless Data Helpers & Mapping
   -------------------------------------------------------------------------- */
function stripEmojisForSanctuary(str) {
  if (!str) return '';
  return String(str)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function getEntryCareRatingKey(entry) {
  if (!entry) return 'okay';
  if (entry.careRating && ZHUB_RATE[entry.careRating]) {
    return entry.careRating;
  }
  const r = Number(entry.rating);
  const raw = (entry.ratingRaw || '').toLowerCase();

  if (entry.aggression || r === 1 || r === 2) {
    if (r >= 4 && !entry.aggression) return 'almost';
    return 'tough';
  }
  if (r === 5) return 'great';
  if (r === 4) {
    if (raw.includes('almost')) return 'almost';
    return 'great';
  }
  if (r === 3) {
    if (raw.includes('almost')) return 'almost';
    return 'okay';
  }
  if (raw.includes('great') || raw.includes('good')) return 'great';
  if (raw.includes('almost')) return 'almost';
  if (raw.includes('rough') || raw.includes('difficult') || raw.includes('tough')) return 'tough';
  return 'okay';
}

function getEntryEventsList(entry) {
  if (!entry || !entry.notes || !entry.notes.trim()) return [];
  const raw = entry.notes.trim();
  const chunks = raw.split(/[;\n]+/);
  const events = [];
  for (let c of chunks) {
    let cleaned = stripEmojisForSanctuary(c).replace(/^[-•*●▪\s]+/, '').trim();
    if (cleaned.length > 0) {
      events.push(cleaned);
    }
  }
  return events;
}

function getEntryMedsPills(entry) {
  const m = (entry && entry.meds) ? entry.meds : {};
  const list = [];
  if (m.z) list.push({ key: 'z', n: 'Zoloft', d: String(m.zDose || '75mg'), c: 'var(--blue)' });
  if (m.g) list.push({ key: 'g', n: 'Guanfacine XR', d: String(m.gDose || '2mg'), c: 'var(--cyan)' });
  if (m.rit) {
    const dVal = String(m.ritDose || (typeof m.rit === 'string' ? m.rit : '15 + 10mg'));
    list.push({ key: 'rit', n: 'Ritalin', d: dVal, c: 'var(--rose)' });
  }
  if (m.mag) list.push({ key: 'mag', n: 'Magnesium', d: String(m.magDose || 'Daily'), c: 'var(--green)' });
  if (m.mel) list.push({ key: 'mel', n: 'Melatonin', d: String(m.melDose || 'Bedtime'), c: 'var(--violet)' });
  if (m.ris) list.push({ key: 'ris', n: 'Risperidone', d: String(m.risDose || '0.25mg'), c: 'var(--rose)' });
  return list;
}

function formatCareDayLabel(dateIso) {
  if (!dateIso) return '';
  try {
    const parts = dateIso.split('-').map(Number);
    const dt = new Date(parts[0], parts[1] - 1, parts[2]);
    return dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  } catch (e) {
    return dateIso;
  }
}

function syncSanctuaryLocalStorageMirror() {
  try {
    const entries = storage.getAllZLogEntries();
    localStorage.setItem('margo-zhub-v1', JSON.stringify(entries.slice(0, 120)));
    const tit = storage.getTitrationHistory();
    localStorage.setItem('margo-meds-v1', JSON.stringify(tit));
  } catch (e) {}
}

/* --------------------------------------------------------------------------
   Main Page Entry Point
   -------------------------------------------------------------------------- */
function renderZLogPage(targetSubTab) {
  const container = document.getElementById('bunker-subview-frame') || document.getElementById('daily-sheet-container') || document.getElementById('page-cover');
  if (!container) return;

  if (targetSubTab && ['timeline', 'calendar', 'titration', 'meds', 'insights', 'patterns'].includes(targetSubTab)) {
    if (targetSubTab === 'meds') activeZLogSubTab = 'titration';
    else if (targetSubTab === 'patterns') activeZLogSubTab = 'insights';
    else activeZLogSubTab = targetSubTab;
  } else if (!activeZLogSubTab) {
    activeZLogSubTab = getInitialZLogSubTab();
  }

  // Structural lossless auto-repair check
  const currentStats = storage.getZLogStats();
  const currentTitration = storage.getTitrationHistory();
  const hasTit35 = currentTitration.some(t => t && (t.id === 'tit-35' || (t.date === '2026-09-19' && t.medication && t.medication.includes('Risperdal'))));
  const isStaleCorrupted = !storage.data.zlogSeedVersion ||
    storage.data.zlogSeedVersion < 15 ||
    !storage.data.titrationSeedVersion ||
    storage.data.titrationSeedVersion < 7 ||
    currentTitration.length < 35 ||
    !hasTit35 ||
    currentStats.goodDays > 300 ||
    !storage.data.zlogEntries;

  if (isStaleCorrupted) {
    if (typeof DEFAULT_ZLOG_ENTRIES !== 'undefined') {
      const cleanDefaults = { ...DEFAULT_ZLOG_ENTRIES };
      if (storage.data.zlogEntries && typeof storage.data.zlogEntries === 'object') {
        for (const [d, entry] of Object.entries(storage.data.zlogEntries)) {
          if (entry) {
            const defEntry = cleanDefaults[d] || {};
            cleanDefaults[d] = {
              ...defEntry,
              ...entry,
              notes: (entry.notes !== undefined && entry.notes !== '') ? entry.notes : (defEntry.notes || ''),
              rating: (entry.rating !== undefined && entry.rating !== null) ? entry.rating : (defEntry.rating || null),
              attachments: (Array.isArray(entry.attachments) && entry.attachments.length > 0) ? entry.attachments : (defEntry.attachments || [])
            };
          }
        }
      }
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('ZLOG_ENTRY_BACKUP_')) {
            const dKey = key.replace('ZLOG_ENTRY_BACKUP_', '');
            const bVal = JSON.parse(localStorage.getItem(key));
            if (bVal && ((bVal.notes && bVal.notes.trim()) || bVal.rating !== null)) {
              cleanDefaults[dKey] = { ...(cleanDefaults[dKey] || {}), ...bVal };
            }
          }
        }
      } catch (e) {}

      for (const targetDate of ['2026-09-30', '2026-10-01', '2026-10-02']) {
        if (cleanDefaults[targetDate]) {
          const defaultAtts = (DEFAULT_ZLOG_ENTRIES[targetDate] && DEFAULT_ZLOG_ENTRIES[targetDate].attachments) || [];
          const existingAtts = cleanDefaults[targetDate].attachments || [];
          const mergedAtts = [...existingAtts];
          for (const defAtt of defaultAtts) {
            if (!mergedAtts.some(a => a && (a.id === defAtt.id || a.name === defAtt.name))) {
              mergedAtts.push(defAtt);
            }
          }
          cleanDefaults[targetDate].attachments = mergedAtts;
        }
      }
      storage.data.zlogEntries = cleanDefaults;
      storage.data.zlogSeedVersion = 15;
    }
    if (typeof DEFAULT_TITRATION_HISTORY !== 'undefined') {
      const existing = Array.isArray(storage.data.titrationHistory) ? storage.data.titrationHistory : [];
      const tit35Exists = existing.some(t => t && (t.id === 'tit-35' || (t.date === '2026-09-19' && t.medication && t.medication.includes('Risperdal'))));
      if (!tit35Exists) {
        const tit35 = DEFAULT_TITRATION_HISTORY.find(t => t.id === 'tit-35');
        if (tit35) {
          existing.push(JSON.parse(JSON.stringify(tit35)));
          storage.data.titrationHistory = existing;
        } else {
          storage.data.titrationHistory = JSON.parse(JSON.stringify(DEFAULT_TITRATION_HISTORY));
        }
      }
      storage.data.titrationSeedVersion = 7;
    }
    storage.saveData();
    if (typeof syncManager !== 'undefined' && syncManager.isConfigured && syncManager.isConfigured()) {
      syncManager.pushToCloud();
    }
  }

  syncSanctuaryLocalStorageMirror();

  const theme = getZHubTheme();
  document.documentElement.setAttribute('data-theme', theme);

  const allEntries = storage.getAllZLogEntries();
  const totalLogged = allEntries.length;

  // Compute Care Sanctuary ratings breakdown
  let greatCount = 0;
  let almostCount = 0;
  let okayCount = 0;
  let toughCount = 0;
  let scoreSum = 0;

  allEntries.forEach(e => {
    const rk = getEntryCareRatingKey(e);
    if (rk === 'great') { greatCount++; scoreSum += 5; }
    else if (rk === 'almost') { almostCount++; scoreSum += 4; }
    else if (rk === 'okay') { okayCount++; scoreSum += 3; }
    else { toughCount++; scoreSum += 2; }
  });

  const brightCount = greatCount + almostCount;
  const brightPct = totalLogged > 0 ? Math.round((brightCount / totalLogged) * 100) : 0;
  const avgRhythm = totalLogged > 0 ? (scoreSum / totalLogged).toFixed(1) : '—';

  // 30 most recent days for the Last 30 days strip (chronological left-to-right)
  const last30 = allEntries.slice(0, 30).reverse();
  const last30Good = last30.filter(e => {
    const rk = getEntryCareRatingKey(e);
    return rk === 'great' || rk === 'almost';
  }).length;
  const last30GoodPct = last30.length > 0 ? Math.round((last30Good / last30.length) * 100) : 0;

  const sanctuaryEl = document.querySelector('.zhub-sanctuary');
  if (sanctuaryEl) {
    setTab(activeZLogSubTab || 'timeline');
    renderAll();
    return;
  }

  container.innerHTML = `
    <div class="zhub-sanctuary-wrap" data-theme="${theme}">
      <div class="zhub-sanctuary" data-theme="${theme}">

        <!-- Header (.hd.glass per margo-zhub.html) -->
        <header class="hd glass">
          <div class="brand">
            <div class="logo" aria-hidden="true">${zhubSvg('paw')}</div>
            <div>
              <h1>Z's Care Sanctuary <span class="badge">Care journal</span></h1>
              <p id="sub">Safe harbor &middot; daily regulation &middot; ${totalLogged} days of care</p>
            </div>
          </div>
          <div class="acts">
            <button type="button" class="btn primary" id="logBtn" aria-label="Log day" onclick="openZLogEntryModal()">
              ${zhubIcon('plus')}<span class="t">Log day</span>
            </button>
            <button type="button" class="btn" id="csvBtn" aria-label="Export CSV" onclick="exportZLogData()">
              ${zhubIcon('download')}<span class="t">Export CSV</span>
            </button>
            <button type="button" class="btn" id="syncBtn" aria-label="Sync" onclick="forceSyncZLogDefaults()">
              ${zhubIcon('refresh')}<span class="t">Sync</span>
            </button>
          </div>
        </header>

        <!-- Layout: Sticky 340px Rail | Main Content -->
        <div class="layout">
          <aside class="rail" aria-label="Summary">
            <div class="stats" id="stats">
              <div class="stat glass">
                <span class="l">Days of care</span>
                <b style="color:var(--text)">${totalLogged}</b>
                <small>Documented entries</small>
              </div>
              <div class="stat glass">
                <span class="l">Bright days</span>
                <b style="color:var(--cyan)">${brightPct}%</b>
                <small>${brightCount} calm &amp; regulated days</small>
              </div>
              <div class="stat glass">
                <span class="l">Big feelings</span>
                <b style="color:var(--rose)">${toughCount}</b>
                <small>Tough days held with care</small>
              </div>
              <div class="stat glass">
                <span class="l">Rhythm rating</span>
                <b style="color:var(--blue)">${avgRhythm}<i> / 5</i></b>
                <small>${totalLogged} rated entries &middot; steady flow</small>
              </div>
            </div>

            <section class="ribbon glass" aria-labelledby="rbT">
              <div class="t">
                <h2 id="rbT">Last 30 days</h2>
                <span class="hint" id="rbHint">${last30GoodPct}% good</span>
              </div>
              <div class="strip" id="strip" role="img" aria-label="Daily rating for the last 30 days">
                ${last30.map(e => {
                  const rk = getEntryCareRatingKey(e);
                  const r = ZHUB_RATE[rk] || ZHUB_RATE.okay;
                  return `<i title="${escapeHtml(formatCareDayLabel(e.date) + ': ' + r.l)}" style="background:${r.c};cursor:pointer;" onclick="jumpToSanctuaryEntry('${e.date}')"></i>`;
                }).join('')}
              </div>
            </section>
          </aside>

          <section class="main">
            <div class="tabs" role="tablist" aria-label="Care journal views" id="tabs">
              <button type="button" role="tab" aria-selected="${activeZLogSubTab === 'timeline' ? 'true' : 'false'}" data-t="timeline" onclick="setTab('timeline')">Behavior timeline</button>
              <button type="button" role="tab" aria-selected="${activeZLogSubTab === 'calendar' ? 'true' : 'false'}" data-t="calendar" onclick="setTab('calendar')">Monthly calendar</button>
              <button type="button" role="tab" aria-selected="${activeZLogSubTab === 'titration' ? 'true' : 'false'}" data-t="meds" onclick="setTab('meds')">Meds &amp; protocol</button>
              <button type="button" role="tab" aria-selected="${activeZLogSubTab === 'insights' ? 'true' : 'false'}" data-t="patterns" onclick="setTab('patterns')">Patterns &amp; insights</button>
            </div>

            <div id="pTimeline" role="tabpanel" style="display:${activeZLogSubTab === 'timeline' ? 'flex' : 'none'};flex-direction:column;gap:14px">
              <label class="search glass">
                ${zhubIcon('search')}
                <input type="search" id="q" placeholder="Search logs (camp, calming, dinner, sleep...)" aria-label="Search logs" value="${escapeHtml(zlogSearchQuery)}" oninput="onZLogSearch(this.value)">
              </label>
              <div class="row" id="rf" role="group" aria-label="Filter by day rating">
                <button type="button" class="fchip" data-r="all" aria-pressed="${zhubRatingFilter === 'all' ? 'true' : 'false'}" onclick="setZHubRatingFilter('all')">All</button>
                <button type="button" class="fchip" data-r="great" aria-pressed="${zhubRatingFilter === 'great' ? 'true' : 'false'}" style="--c:var(--cyan)" onclick="setZHubRatingFilter('great')"><i></i>Great</button>
                <button type="button" class="fchip" data-r="almost" aria-pressed="${zhubRatingFilter === 'almost' ? 'true' : 'false'}" style="--c:var(--blue)" onclick="setZHubRatingFilter('almost')"><i></i>Almost Good</button>
                <button type="button" class="fchip" data-r="okay" aria-pressed="${zhubRatingFilter === 'okay' ? 'true' : 'false'}" style="--c:var(--violet)" onclick="setZHubRatingFilter('okay')"><i></i>Okay</button>
                <button type="button" class="fchip" data-r="tough" aria-pressed="${zhubRatingFilter === 'tough' ? 'true' : 'false'}" style="--c:var(--rose)" onclick="setZHubRatingFilter('tough')"><i></i>Big feelings</button>
                <div class="sp">
                  <button type="button" class="small" id="expAll" onclick="expandAllMonths()">Expand</button>
                  <button type="button" class="small" id="colAll" onclick="collapseAllMonths()">Collapse</button>
                </div>
              </div>
              <div id="groups"></div>
            </div>

            <div id="pCal" role="tabpanel" style="display:${activeZLogSubTab === 'calendar' ? 'flex' : 'none'};flex-direction:column;gap:14px"></div>

            <div id="pMeds" role="tabpanel" style="display:${activeZLogSubTab === 'titration' ? 'flex' : 'none'};flex-direction:column;gap:14px"></div>

            <div id="pPatterns" role="tabpanel" style="display:${activeZLogSubTab === 'insights' ? 'flex' : 'none'};flex-direction:column;gap:14px"></div>
          </section>
        </div>

        <!-- Dialog: Log / Edit Day (#dlg per margo-zhub.html) -->
        <dialog id="dlg" class="zhub-dlg" aria-labelledby="dT">
          <form id="form" onsubmit="submitZLogEntryModal(event)" novalidate>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
              <h2 id="dT" style="margin:0;">Log day</h2>
              <span id="zlog-date-status-badge" class="zhub-date-status-badge"></span>
            </div>

            <!-- Date Row -->
            <div class="fld zhub-modal-date-fld">
              <div class="zhub-modal-date-picker-row">
                <input type="date" id="fDate" name="fDate" class="zhub-modal-date-input" required onchange="onZLogModalDateChange(this.value)">
                <div class="zhub-modal-date-presets" role="group" aria-label="Quick date options">
                  <button type="button" class="zhub-date-preset-btn" id="zlog-preset-today" onclick="setZLogModalDate('today')">Today</button>
                  <button type="button" class="zhub-date-preset-btn" id="zlog-preset-yesterday" onclick="setZLogModalDate('yesterday')">Yesterday</button>
                  <button type="button" class="zhub-date-preset-btn" id="zlog-preset-2days" onclick="setZLogModalDate('2days')">2d ago</button>
                  <button type="button" class="zhub-date-preset-btn" id="zlog-preset-picker" onclick="triggerZLogDatePicker()" title="Choose any date from calendar">Pick Date 📅</button>
                </div>
              </div>
              <div id="zlog-already-logged-banner" class="zhub-already-logged-banner" style="display:none;"></div>
            </div>

            <!-- 1. Rating Row (Symmetrical 4 Pills) -->
            <div class="fld">
              <span class="l">How did the day feel?</span>
              <div class="zhub-rating-capsule-row" id="fRate" role="group" aria-label="Day rating">
                <button type="button" class="rating-capsule" data-r="great" onclick="selectZHubDialogRating('great')"><i></i>Great</button>
                <button type="button" class="rating-capsule" data-r="almost" onclick="selectZHubDialogRating('almost')"><i></i>Almost</button>
                <button type="button" class="rating-capsule" data-r="okay" onclick="selectZHubDialogRating('okay')"><i></i>Okay</button>
                <button type="button" class="rating-capsule" data-r="tough" onclick="selectZHubDialogRating('tough')"><i></i>Tough</button>
              </div>
            </div>

            <!-- 2. Routine Medications (Soft Pastel Capsule Row from user reference) -->
            <div class="fld">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
                <span class="l" style="margin:0;">Routine Medications</span>
                <button type="button" onclick="toggleZLogMedDrawer()" style="background:none;border:none;color:var(--zlog-lavender-text,#5B3FD9);font-size:12px;font-weight:700;cursor:pointer;padding:0;">
                  Adjust / PRN ▾
                </button>
              </div>

              <div class="zlog-med-pill-row">
                <button type="button" id="zlog-btn-med-z" class="zlog-med-pill pill-blue" onclick="toggleZLogMedButton('z')" title="Tap to toggle taken/skipped">
                  <span class="med-p-name">Zoloft</span>
                  <span class="med-p-dose" id="zlog-disp-med-z-dose">75mg</span>
                </button>
                <button type="button" id="zlog-btn-med-g" class="zlog-med-pill pill-green" onclick="toggleZLogMedButton('g')" title="Tap to toggle taken/skipped">
                  <span class="med-p-name">Guanfacine XR</span>
                  <span class="med-p-dose" id="zlog-disp-med-g-dose">2mg</span>
                </button>
                <button type="button" id="zlog-btn-med-rit" class="zlog-med-pill pill-rose" onclick="toggleZLogMedButton('rit')" title="Tap to toggle taken/skipped">
                  <span class="med-p-name">Ritalin</span>
                  <span class="med-p-dose" id="zlog-disp-med-rit-dose">15mg</span>
                </button>
              </div>

              <!-- PRN / Adjust Drawer -->
              <div id="zlog-med-drawer" class="zlog-med-drawer" style="display:none;">
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:6px;">
                  ${ZHUB_MED_DEFS.map(m => `
                    <label style="display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:14px;border:1px solid var(--chip);background:var(--card);cursor:pointer;font-size:12px;color:var(--text);">
                      <input type="checkbox" id="zlog-m-${m.key}" style="width:15px;height:15px;accent-color:var(--pri);" />
                      <span style="width:8px;height:8px;border-radius:50%;background:${m.c};flex:none;"></span>
                      <span style="font-weight:700;flex:1;">${m.n}</span>
                      <input type="text" id="zlog-m-${m.key}-dose" value="${m.defaultDose}" style="width:64px;min-height:24px;height:24px;padding:0 4px;border-radius:6px;border:1px solid var(--chip);background:transparent;font-size:11px;text-align:right;" onclick="event.stopPropagation()" />
                    </label>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- 3. Checkpoints (Symmetrical 2-Column Grid) -->
            <div class="fld" style="gap:12px;">
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <span class="l" style="margin:0;">Tap Checkpoints (15s Selection)</span>
                <span id="zlog-modal-pill-count" style="font-size:11px;font-weight:700;color:var(--zlog-lavender-text,#5B3FD9);">0 selected</span>
              </div>

              ${ZHUB_CHECKPOINT_SECTIONS.map(sec => `
                <div style="display:flex;flex-direction:column;gap:6px;">
                  <span style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:${sec.color};">
                    ${sec.title}
                  </span>
                  <div class="zhub-checkpoint-grid">
                    ${sec.items.map(item => `
                      <button type="button" class="capsule-pill ${sec.theme}" data-capsule-text="${escapeHtml(item.text)}" onclick="toggleZLogCapsule('${escapeHtml(item.text)}', this)">
                        <span class="bold-tag">${item.label}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- 4. Optional 1-line Unique Note -->
            <div class="fld">
              <span class="l">Unique Note (Optional · 1 Line)</span>
              <input type="text" id="zlog-custom-note" class="zlog-custom-note-input" placeholder="Add unique observation or detail..." oninput="updateZLogLivePreview()" />
            </div>

            <!-- 5. Live Auto-Generated Bullet Notes Preview -->
            <div class="fld">
              <div class="zlog-preview-box">
                <div class="preview-header">
                  <span>Live Generated Bullet Notes</span>
                  <span style="font-weight:600;opacity:0.8;">Auto-formatted</span>
                </div>
                <div id="zlog-notes-preview" class="zlog-preview-content"></div>
              </div>
            </div>

            <!-- Hidden compatibility textarea -->
            <textarea id="fNotes" name="fNotes" style="display:none;"></textarea>

            <!-- Attachments -->
            <div class="fld">
              <span class="l">Daily report PDF</span>
              <div class="row">
                <input type="file" id="zlog-modal-pdf-input" accept="application/pdf" style="display:none;" onchange="handleModalPdfFileSelect(event)" />
                <button type="button" class="small" onclick="document.getElementById('zlog-modal-pdf-input').click()">
                  ${zhubIcon('file')} Attach PDF
                </button>
              </div>
              <div id="zlog-modal-attachments-container" style="display:flex;flex-direction:column;gap:6px;margin-top:4px;"></div>
            </div>

            <!-- Actions -->
            <div class="dact">
              <button type="button" class="rm" id="rmBtn" style="display:none" onclick="deleteZLogEntryWithUndo()">Delete</button>
              <button type="button" class="cancel" id="cancel" onclick="closeZLogModal()">Cancel</button>
              <button type="submit" class="go">Save Day</button>
            </div>
          </form>
        </dialog>

        <!-- Dialog: Log Protocol / Dose Change -->
        <dialog id="zhub-med-dlg" class="zhub-dlg" aria-labelledby="zhub-med-dlg-title">
          <form onsubmit="submitTitrationModal(event)" novalidate>
            <h2 id="zhub-med-dlg-title">Log dose change</h2>
            <div class="fld">
              <label for="tit-modal-date">Date of change</label>
              <input id="tit-modal-date" type="date" value="${typeof formatDateIso === 'function' ? formatDateIso(new Date()) : '2026-10-15'}" required />
            </div>
            <div class="fld">
              <label for="tit-modal-med">Medication</label>
              <input id="tit-modal-med" type="text" placeholder="e.g. Sertraline (Zoloft), Guanfacine XR, Ritalin IR" required />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div class="fld">
                <label for="tit-modal-dose">Dosage</label>
                <input id="tit-modal-dose" type="text" placeholder="e.g. 75 mg" required />
              </div>
              <div class="fld">
                <label for="tit-modal-action">Action</label>
                <select id="tit-modal-action">
                  <option value="Started">Started</option>
                  <option value="Increased">Increased</option>
                  <option value="Decreased">Decreased</option>
                  <option value="Changed">Changed</option>
                  <option value="Stopped">Stopped</option>
                </select>
              </div>
            </div>
            <div class="fld">
              <label for="tit-modal-prescriber">Prescriber</label>
              <select id="tit-modal-prescriber">
                <option value="Dr Barness" selected>Dr Barness</option>
                <option value="Tara Gleeson">Tara Gleeson</option>
                <option value="GAP">GAP</option>
              </select>
            </div>
            <div class="fld">
              <label for="tit-modal-notes">Notes</label>
              <textarea id="tit-modal-notes" placeholder="Reason for change, school feedback, or target symptom..."></textarea>
            </div>
            <div class="dact">
              <button type="button" class="cancel" onclick="closeTitrationModal()">Cancel</button>
              <button type="submit" class="go">Save</button>
            </div>
          </form>
        </dialog>

        <!-- Toast (#toast matching #toast in margo-zhub.html) -->
        <div id="toast" class="zhub-toast" role="status" aria-live="polite">
          <span id="toastMsg"></span>
          <button type="button" id="toastUndo" onclick="triggerZHubUndo()">Undo</button>
        </div>

      </div>
    </div>
  `;

  setTab(activeZLogSubTab || 'timeline');
  renderAll();
}

/* --------------------------------------------------------------------------
   Sub-Tab Switching (Exact setTab(t) per margo-zhub.html)
   -------------------------------------------------------------------------- */
function setTab(t) {
  let normalized = t;
  if (t === 'titration') normalized = 'meds';
  if (t === 'insights') normalized = 'patterns';

  activeZLogSubTab = (normalized === 'meds') ? 'titration' : (normalized === 'patterns' ? 'insights' : normalized);
  try {
    localStorage.setItem('BOL_ZLOG_ACTIVE_SUBTAB', activeZLogSubTab);
    const targetHash = (activeZLogSubTab === 'timeline') ? 'zhub' : `zhub/${activeZLogSubTab}`;
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', `#${targetHash}`);
    }
  } catch (e) {}

  document.querySelectorAll('#tabs button').forEach(b => {
    b.setAttribute('aria-selected', (b.dataset.t === normalized || b.dataset.t === t) ? 'true' : 'false');
  });

  const pTimeline = document.getElementById('pTimeline');
  const pCal = document.getElementById('pCal');
  const pMeds = document.getElementById('pMeds');
  const pPatterns = document.getElementById('pPatterns');

  if (pTimeline) pTimeline.style.display = normalized === 'timeline' ? 'flex' : 'none';
  if (pCal) {
    pCal.style.display = normalized === 'calendar' ? 'flex' : 'none';
    if (normalized === 'calendar') renderCal();
  }
  if (pMeds) {
    pMeds.style.display = normalized === 'meds' ? 'flex' : 'none';
    if (normalized === 'meds') renderMeds();
  }
  if (pPatterns) {
    pPatterns.style.display = normalized === 'patterns' ? 'flex' : 'none';
    if (normalized === 'patterns') renderPatterns();
  }
}

function switchZLogSubTab(subTab) {
  setTab(subTab);
}

function renderRail() {
  const allEntries = storage.getAllZLogEntries();
  const n = allEntries.length;
  let greatCount = 0, almostCount = 0, okayCount = 0, toughCount = 0, sum = 0;
  allEntries.forEach(e => {
    const rk = getEntryCareRatingKey(e);
    if (rk === 'great') { greatCount++; sum += 5; }
    else if (rk === 'almost') { almostCount++; sum += 4; }
    else if (rk === 'okay') { okayCount++; sum += 3; }
    else { toughCount++; sum += 2; }
  });

  const good = greatCount + almostCount;
  const goodPct = n > 0 ? Math.round((good / n) * 100) : 0;
  const avg = n > 0 ? (sum / n).toFixed(1) : '—';

  const st = document.getElementById('stats');
  if (st) {
    st.innerHTML = `
      <div class="stat glass">
        <span class="l">Days of care</span>
        <b style="color:var(--text)">${n}</b>
        <small>Documented entries</small>
      </div>
      <div class="stat glass">
        <span class="l">Bright days</span>
        <b style="color:var(--cyan)">${goodPct}%</b>
        <small>${good} calm &amp; regulated days</small>
      </div>
      <div class="stat glass">
        <span class="l">Big feelings</span>
        <b style="color:var(--rose)">${toughCount}</b>
        <small>Tough days held with care</small>
      </div>
      <div class="stat glass">
        <span class="l">Rhythm rating</span>
        <b style="color:var(--blue)">${avg}<i> / 5</i></b>
        <small>${n} rated entries &middot; steady flow</small>
      </div>
    `;
  }

  const sub = document.getElementById('sub');
  if (sub) {
    sub.innerHTML = `Safe harbor &middot; daily regulation &middot; ${n} days of care`;
  }

  const last30 = allEntries.slice(0, 30).reverse();
  const sp = document.getElementById('strip');
  if (sp) {
    sp.innerHTML = last30.map(e => {
      const rk = getEntryCareRatingKey(e);
      const r = ZHUB_RATE[rk] || ZHUB_RATE.okay;
      return `<i title="${escapeHtml(formatCareDayLabel(e.date) + ': ' + r.l)}" style="background:${r.c};cursor:pointer;" onclick="jumpToSanctuaryEntry('${e.date}')"></i>`;
    }).join('');
  }

  const gCount = last30.filter(e => {
    const rk = getEntryCareRatingKey(e);
    return rk === 'great' || rk === 'almost';
  }).length;
  const rbHint = document.getElementById('rbHint');
  if (rbHint) {
    rbHint.textContent = `${last30.length > 0 ? Math.round((gCount / last30.length) * 100) : 0}% good`;
  }
}

function renderAll() {
  renderRail();
  renderGroups();
  if (activeZLogSubTab === 'calendar') renderCal();
  else if (activeZLogSubTab === 'titration') renderMeds();
  else if (activeZLogSubTab === 'insights') renderPatterns();
}

/* --------------------------------------------------------------------------
   Shared Entry Card Renderer (Exact entryCard(e, solo) from margo-zhub.html)
   -------------------------------------------------------------------------- */
function toggleSanctuaryMedOpen(dateStr) {
  zhubMedOpen[dateStr] = !zhubMedOpen[dateStr];
  if (activeZLogSubTab === 'calendar') renderZLogCalendar();
  else renderZLogTimeline();
}

function toggleSanctuaryEvOpen(dateStr) {
  zhubEvOpen[dateStr] = !zhubEvOpen[dateStr];
  if (activeZLogSubTab === 'calendar') renderZLogCalendar();
  else renderZLogTimeline();
}

function renderSanctuaryEntryCard(entry, solo = false) {
  const rk = getEntryCareRatingKey(entry);
  const r = ZHUB_RATE[rk] || ZHUB_RATE.okay;
  const dayLabel = formatCareDayLabel(entry.date);
  const allMeds = getEntryMedsPills(entry);
  const showAllMeds = !!zhubMedOpen[entry.date];
  const shownMeds = showAllMeds ? allMeds : allMeds.slice(0, 3);

  const allEvents = getEntryEventsList(entry);
  const showAllEvs = !!zhubEvOpen[entry.date];
  const shownEvs = showAllEvs ? allEvents : allEvents.slice(0, 3);

  const attachments = Array.isArray(entry.attachments) ? entry.attachments : [];

  return `
    <article class="en glass${solo ? ' solo' : ''}" style="--c:${r.c}" id="e-${entry.date}">
      <span class="nd" aria-hidden="true"></span>
      <div class="eh">
        <div class="d">
          <h3>${escapeHtml(dayLabel)}</h3>
          <span class="rate"><i></i>${r.l}</span>
        </div>
        <button type="button" class="iconbtn" aria-label="Edit ${escapeHtml(dayLabel)}" onclick="openZLogEntryModal('${entry.date}')">
          ${zhubIcon('edit')}
        </button>
      </div>

      ${allMeds.length > 0 ? `
        <div class="meds">
          ${shownMeds.map(m => `<span class="mc" style="--c:${m.c}"><b>${escapeHtml(m.n)}</b><span>${escapeHtml(m.d)}</span></span>`).join('')}
          ${allMeds.length > 3 ? `
            <button type="button" class="more" aria-expanded="${showAllMeds ? 'true' : 'false'}" onclick="toggleSanctuaryMedOpen('${entry.date}')">
              ${showAllMeds ? 'Show fewer' : `+${allMeds.length - 3} more`}
            </button>
          ` : ''}
        </div>
      ` : ''}

      <ul class="ev">
        ${shownEvs.length > 0
          ? shownEvs.map(t => `<li>${escapeHtml(t)}</li>`).join('')
          : `<li style="color:var(--muted)">No notes</li>`}
      </ul>

      ${allEvents.length > 3 ? `
        <button type="button" class="more" style="align-self:flex-start;padding-left:0" aria-expanded="${showAllEvs ? 'true' : 'false'}" onclick="toggleSanctuaryEvOpen('${entry.date}')">
          ${showAllEvs ? 'Show fewer events' : `+ Show ${allEvents.length - 3} more events`}
        </button>
      ` : ''}

      ${attachments.length > 0 ? `
        <div class="att">
          <span class="l">${zhubIcon('file')}Daily report (${attachments.length})</span>
          ${attachments.map(f => `
            <div class="file">
              <span>${escapeHtml(f.name)}</span>
              <code>${escapeHtml(f.size || 'PDF')}</code>
              <button type="button" aria-label="View ${escapeHtml(f.name)}" title="View" onclick="viewZLogPdf('${escapeHtml(f.id)}', '${escapeHtml(f.name)}')">${zhubIcon('eye')}</button>
              <button type="button" aria-label="Download ${escapeHtml(f.name)}" title="Download" onclick="downloadZLogPdf('${escapeHtml(f.id)}', '${escapeHtml(f.name)}')">${zhubIcon('download')}</button>
              <button type="button" class="del" aria-label="Remove ${escapeHtml(f.name)}" title="Remove" onclick="deleteZLogPdfEntryAttachment('${escapeHtml(f.id)}', '${entry.date}')">${zhubIcon('trash')}</button>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </article>
  `;
}

function jumpToSanctuaryEntry(dateIso) {
  if (!dateIso) return;
  const monthKey = dateIso.slice(0, 7);
  zlogExpandedMonths[monthKey] = true;
  if (activeZLogSubTab !== 'timeline') {
    activeZLogSubTab = 'timeline';
    renderZLogPage('timeline');
  } else {
    renderZLogTimeline();
  }
  setTimeout(() => {
    const el = document.getElementById('e-' + dateIso);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.animate([
        { boxShadow: '0 0 0 0 var(--pri)' },
        { boxShadow: '0 0 0 3px var(--pri)' },
        { boxShadow: '0 0 0 0 transparent' }
      ], { duration: 1100 });
    }
  }, 60);
}

/* --------------------------------------------------------------------------
   TAB 1: Behavior Timeline (#pTimeline per margo-zhub.html)
   -------------------------------------------------------------------------- */
function matchesSanctuaryFilter(entry, qLower) {
  const rk = getEntryCareRatingKey(entry);
  if (zhubRatingFilter !== 'all' && rk !== zhubRatingFilter) return false;
  if (!qLower) return true;
  const r = ZHUB_RATE[rk] || ZHUB_RATE.okay;
  const medsStr = getEntryMedsPills(entry).map(m => `${m.n} ${m.d}`).join(' ');
  const filesStr = (entry.attachments || []).map(a => a.name).join(' ');
  const hay = `${formatCareDayLabel(entry.date)} ${entry.date} ${r.l} ${entry.notes || ''} ${medsStr} ${filesStr}`.toLowerCase();
  return qLower.split(/\s+/).every(w => hay.indexOf(w) > -1);
}

function renderGroups() {
  const root = document.getElementById('groups');
  if (!root) return;

  const allEntries = storage.getAllZLogEntries();
  const qLower = zlogSearchQuery.trim().toLowerCase();
  const filtering = !!qLower || zhubRatingFilter !== 'all';

  // Group all entries by month (YYYY-MM)
  const byMonth = {};
  allEntries.forEach(e => {
    const k = e.date.slice(0, 7);
    if (!byMonth[k]) byMonth[k] = [];
    byMonth[k].push(e);
  });

  const keys = Object.keys(byMonth).sort().reverse();

  // Default newest month to open if none set yet
  if (Object.keys(zlogExpandedMonths).length === 0 && keys.length > 0) {
    zlogExpandedMonths[keys[0]] = true;
  }

  const groupsHtml = [];

  keys.forEach(k => {
    const allInMonth = byMonth[k];
    const shown = allInMonth.filter(e => matchesSanctuaryFilter(e, qLower));
    if (filtering && shown.length === 0) return;

    const open = (zlogExpandedMonths[k] !== undefined) ? !!zlogExpandedMonths[k] : filtering;
    const cnt = { great: 0, almost: 0, okay: 0, tough: 0 };
    allInMonth.forEach(e => {
      const rk = getEntryCareRatingKey(e);
      cnt[rk] = (cnt[rk] || 0) + 1;
    });

    const totalM = allInMonth.length || 1;
    const goodPct = Math.round(((cnt.great + cnt.almost) / totalM) * 100);
    const parts = k.split('-');
    const monthTitle = `${ZHUB_MONTH_NAMES[parseInt(parts[1], 10) - 1] || parts[1]} ${parts[0]}`;
    const cntText = filtering ? `${shown.length} of ${allInMonth.length}` : `${allInMonth.length} entries`;

    groupsHtml.push(`
      <section aria-label="${escapeHtml(monthTitle)}">
        <div class="mh glass">
          <button type="button" class="tg" aria-expanded="${open ? 'true' : 'false'}" onclick="toggleMonthAccordion('${k}')">
            ${zhubIcon('chev')}
            <h2>${escapeHtml(monthTitle)}</h2>
            <span class="cnt">${escapeHtml(cntText)}</span>
            <span class="mstat">
              <span class="dist" aria-hidden="true">
                <i style="width:${(cnt.great / totalM) * 100}%;background:var(--cyan)"></i>
                <i style="width:${(cnt.almost / totalM) * 100}%;background:var(--blue)"></i>
                <i style="width:${(cnt.okay / totalM) * 100}%;background:var(--violet)"></i>
                <i style="width:${(cnt.tough / totalM) * 100}%;background:var(--rose)"></i>
              </span>
              <span class="gd">${goodPct}% good</span>
              <span class="bolt"><span>${zhubSvg('bolt')}</span>${cnt.tough}</span>
            </span>
          </button>
          <button type="button" class="calbtn" aria-label="Open ${escapeHtml(monthTitle)} in calendar" onclick="openMonthInCalendar('${k}')">
            ${zhubIcon('cal')}
          </button>
        </div>
        ${open ? `
          <div class="mb">
            ${shown.map(e => renderSanctuaryEntryCard(e, false)).join('')}
          </div>
        ` : ''}
      </section>
    `);
  });

  root.innerHTML = groupsHtml.length > 0
    ? groupsHtml.join('')
    : `<div class="glass empty">No entries match. Try a different word or filter.</div>`;
}

function renderZLogTimeline() {
  const groupsEl = document.getElementById('groups');
  if (groupsEl) {
    renderGroups();
    return;
  }
}

function toggleMonthAccordion(monthKey) {
  zlogExpandedMonths[monthKey] = !zlogExpandedMonths[monthKey];
  renderZLogTimeline();
}

function expandAllMonths() {
  storage.getAllZLogEntries().forEach(e => {
    zlogExpandedMonths[e.date.slice(0, 7)] = true;
  });
  renderZLogTimeline();
}

function collapseAllMonths() {
  storage.getAllZLogEntries().forEach(e => {
    zlogExpandedMonths[e.date.slice(0, 7)] = false;
  });
  renderZLogTimeline();
}

function onZLogSearch(query) {
  const cursorPos = (() => {
    const el = document.getElementById('q');
    return el ? el.selectionStart : null;
  })();
  zlogSearchQuery = query;
  renderZLogTimeline();
  const el = document.getElementById('q');
  if (el) {
    el.focus();
    if (cursorPos !== null) {
      try { el.setSelectionRange(cursorPos, cursorPos); } catch (e) {}
    }
  }
}

function clearZLogSearch() {
  zlogSearchQuery = '';
  renderZLogTimeline();
}

function setZHubRatingFilter(filterKey) {
  zhubRatingFilter = filterKey;
  renderZLogTimeline();
}

/* --------------------------------------------------------------------------
   TAB 2: Monthly Calendar (#pCal per margo-zhub.html)
   -------------------------------------------------------------------------- */
function openMonthInCalendar(monthKey) {
  if (monthKey && monthKey.includes('-')) {
    const parts = monthKey.split('-');
    zlogCalendarYear = parseInt(parts[0], 10);
    zlogCalendarMonth = parseInt(parts[1], 10);
    zhubCalSelDate = null;
    try {
      localStorage.setItem('BOL_ZLOG_CAL_YEAR', zlogCalendarYear);
      localStorage.setItem('BOL_ZLOG_CAL_MONTH', zlogCalendarMonth);
    } catch (e) {}
  }
  switchZLogSubTab('calendar');
}

function navigateZLogCalendarMonth(delta) {
  let m = zlogCalendarMonth + delta;
  let y = zlogCalendarYear;
  if (m > 12) { m = 1; y++; }
  else if (m < 1) { m = 12; y--; }
  zlogCalendarMonth = m;
  zlogCalendarYear = y;
  zhubCalSelDate = null;
  try {
    localStorage.setItem('BOL_ZLOG_CAL_YEAR', zlogCalendarYear);
    localStorage.setItem('BOL_ZLOG_CAL_MONTH', zlogCalendarMonth);
  } catch (e) {}
  renderZLogCalendar();
}

function selectZHubCalendarDate(dateIso) {
  zhubCalSelDate = (zhubCalSelDate === dateIso) ? null : dateIso;
  renderZLogCalendar();
}

function renderZLogCalendar() {
  const container = document.getElementById('pCal') || document.getElementById('zlog-subview-container');
  if (!container) return;

  const year = zlogCalendarYear || 2026;
  const month = zlogCalendarMonth || 10;
  const monthLabel = `${ZHUB_MONTH_NAMES[month - 1]} ${year}`;
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDow = new Date(year, month - 1, 1).getDay();

  const byDate = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const rawEntry = storage.data.zlogEntries ? storage.data.zlogEntries[dateStr] : null;
    if (rawEntry && (rawEntry.rating || (rawEntry.notes && rawEntry.notes.trim()) || (rawEntry.attachments && rawEntry.attachments.length))) {
      byDate[dateStr] = rawEntry;
    }
  }

  const dowHeadersHtml = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    .map(d => `<div class="dow" aria-hidden="true">${d}</div>`)
    .join('');

  let cellsHtml = '';
  for (let i = 0; i < firstDow; i++) {
    cellsHtml += `<div></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateIso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const e = byDate[dateIso];
    const isSel = (zhubCalSelDate === dateIso);
    if (e) {
      const rk = getEntryCareRatingKey(e);
      const r = ZHUB_RATE[rk] || ZHUB_RATE.okay;
      cellsHtml += `
        <button type="button" class="cell has${isSel ? ' sel' : ''}" aria-label="${escapeHtml(formatCareDayLabel(dateIso) + ': ' + r.l)}" style="--c:${r.c}" onclick="selectZHubCalendarDate('${dateIso}')">${day}</button>
      `;
    } else {
      cellsHtml += `
        <button type="button" class="cell${isSel ? ' sel' : ''}" data-empty="1" aria-label="${escapeHtml(formatCareDayLabel(dateIso) + ': no entry')}" onclick="selectZHubCalendarDate('${dateIso}')">${day}</button>
      `;
    }
  }

  let detailHtml = '';
  if (zhubCalSelDate) {
    const selEntry = byDate[zhubCalSelDate];
    if (selEntry) {
      detailHtml = renderSanctuaryEntryCard(selEntry, true);
    } else {
      detailHtml = `
        <div class="glass empty">
          <p style="margin:0 0 12px">No entry for ${escapeHtml(formatCareDayLabel(zhubCalSelDate))}.</p>
          <button type="button" class="btn primary" onclick="openZLogEntryModal('${zhubCalSelDate}')">
            ${zhubIcon('plus')}<span>Log this day</span>
          </button>
        </div>
      `;
    }
  } else {
    detailHtml = `<div class="glass empty">Tap a day to see its entry.</div>`;
  }

  const calInnerHtml = `
    <div class="glass">
      <div class="calhead">
        <button type="button" class="iconbtn" id="calPrev" aria-label="Previous month" onclick="navigateZLogCalendarMonth(-1)">${zhubIcon('chevL')}</button>
        <h2 id="calTitle">${escapeHtml(monthLabel)}</h2>
        <button type="button" class="iconbtn" id="calNext" aria-label="Next month" onclick="navigateZLogCalendarMonth(1)">${zhubIcon('chevR')}</button>
      </div>
      <div class="calgrid" id="calGrid">
        ${dowHeadersHtml}
        ${cellsHtml}
      </div>
      <div class="legend">
        <span style="--c:var(--cyan)"><i></i>Great day</span>
        <span style="--c:var(--blue)"><i></i>Almost good</span>
        <span style="--c:var(--violet)"><i></i>Okay</span>
        <span style="--c:var(--rose)"><i></i>Big feelings</span>
      </div>
    </div>
    <div id="calDetail">
      ${detailHtml}
    </div>
  `;

  if (container.id === 'pCal') {
    container.innerHTML = calInnerHtml;
  } else {
    container.innerHTML = `<div id="pCal" role="tabpanel" style="display:flex;flex-direction:column;gap:14px">${calInnerHtml}</div>`;
  }
}

const renderCal = renderZLogCalendar;

/* --------------------------------------------------------------------------
   TAB 3: Meds & Protocol
   - One glass card per medication with color dot, name, dose pill & 7-day dose grid
   - Current-regimen list
   - Change log on the same spine (start, dose change, stop)
   -------------------------------------------------------------------------- */
function toggleMed7DayDose(dateStr, medKey, defaultDose) {
  const entry = storage.getZLogEntry(dateStr);
  const meds = entry.meds || {};
  const currentlyTaken = !!meds[medKey];
  storage.setZLogMedStatus(dateStr, medKey, !currentlyTaken, meds[medKey + 'Dose'] || defaultDose);
  syncSanctuaryLocalStorageMirror();
  renderZLogTitration();
}

function deleteTitrationWithUndo(recordId) {
  const list = storage.getTitrationHistory();
  const idx = list.findIndex(r => r && r.id === recordId);
  if (idx === -1) return;
  const removed = list[idx];
  list.splice(idx, 1);
  storage.saveData();
  syncSanctuaryLocalStorageMirror();
  renderZLogTitration();

  showZHubUndoToast(`Removed ${removed.medication} (${removed.date})`, () => {
    const cur = storage.getTitrationHistory();
    cur.splice(idx, 0, removed);
    storage.saveData();
    syncSanctuaryLocalStorageMirror();
    if (activeZLogSubTab === 'titration') renderZLogTitration();
  });
}

function getMedKeyForRecord(record) {
  if (!record || !record.medication) return 'other';
  const name = record.medication.toLowerCase();
  if (name.includes('sertraline') || name.includes('zoloft')) return 'z';
  if (name.includes('guanfacine') || name.includes('intuniv')) return 'g';
  if (name.includes('ritalin') || name.includes('methylphenidate')) return 'rit';
  if (name.includes('risper') || name.includes('risperdal') || name.includes('risperidone')) return 'ris';
  if (name.includes('magnes')) return 'mag';
  if (name.includes('melaton')) return 'mel';
  return 'other';
}

function setZHubMedsViewMode(mode) {
  if (['both', 'by-med', 'chrono'].includes(mode)) {
    zhubMedsViewMode = mode;
    try { localStorage.setItem('BOL_ZHUB_MEDS_VIEW_MODE', mode); } catch (e) {}
    renderZLogTitration();
  }
}
window.setZHubMedsViewMode = setZHubMedsViewMode;

function toggleZHubMedsSection(section) {
  if (section === 'byMed' || section === 'chrono') {
    zhubMedsCollapsed[section] = !zhubMedsCollapsed[section];
    try { localStorage.setItem('BOL_ZHUB_MEDS_COLLAPSED_V2', JSON.stringify(zhubMedsCollapsed)); } catch (e) {}
    renderZLogTitration();
  }
}
window.toggleZHubMedsSection = toggleZHubMedsSection;

function toggleZHubMedCardHistory(medKey) {
  zhubMedHistoryOpen[medKey] = !zhubMedHistoryOpen[medKey];
  renderZLogTitration();
}
window.toggleZHubMedCardHistory = toggleZHubMedCardHistory;

function renderZLogTitration() {
  const container = document.getElementById('pMeds') || document.getElementById('zlog-subview-container');
  if (!container) return;

  const allEntries = storage.getAllZLogEntries();
  const last7Dates = allEntries.slice(0, 7).map(e => e.date).reverse();

  let titrationList = storage.getTitrationHistory();
  if (!Array.isArray(titrationList) || titrationList.length === 0) {
    titrationList = (typeof DEFAULT_TITRATION_HISTORY !== 'undefined') ? [...DEFAULT_TITRATION_HISTORY] : [];
  }

  const sortedTitration = [...titrationList].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  // Separate records mapped to known meds vs other
  const otherChanges = sortedTitration.filter(r => getMedKeyForRecord(r) === 'other');

  const showByMed = (zhubMedsViewMode === 'both' || zhubMedsViewMode === 'by-med');
  const showChrono = (zhubMedsViewMode === 'both' || zhubMedsViewMode === 'chrono');

  const medsInnerHtml = `
      <div class="sec-title-row">
        <div>
          <span class="sec-sub">Active Regimen &middot; Protocol Architecture</span>
          <h2 class="sec-title">Meds &amp; Protocol</h2>
        </div>
        <div class="row">
          <button type="button" class="btn" onclick="exportTitrationCSV()" aria-label="Export protocol CSV">
            ${zhubIcon('download')}<span class="t">Export CSV</span>
          </button>
          <button type="button" class="btn primary" onclick="openTitrationModal()" aria-label="Log dose change">
            ${zhubIcon('plus')}<span class="t">Log dose change</span>
          </button>
        </div>
      </div>

      <!-- Two-View Switcher Bar -->
      <div class="meds-view-switcher" role="group" aria-label="Meds & Protocol View Switcher">
        <button type="button" class="fchip" data-v="both" aria-pressed="${zhubMedsViewMode === 'both'}" onclick="setZHubMedsViewMode('both')">
          <span>✨ Show Both</span>
        </button>
        <button type="button" class="fchip" data-v="by-med" aria-pressed="${zhubMedsViewMode === 'by-med'}" onclick="setZHubMedsViewMode('by-med')">
          <span>💊 By Medicine (${ZHUB_MED_DEFS.length})</span>
        </button>
        <button type="button" class="fchip" data-v="chrono" aria-pressed="${zhubMedsViewMode === 'chrono'}" onclick="setZHubMedsViewMode('chrono')">
          <span>⏱️ Chronological (${sortedTitration.length})</span>
        </button>
      </div>

      <!-- VIEW 1: By Medicine (Collapsible) -->
      ${showByMed ? `
        <div class="meds-view-section" id="sec-by-med">
          <div class="meds-sec-header" onclick="toggleZHubMedsSection('byMed')" role="button" tabindex="0" aria-expanded="${!zhubMedsCollapsed.byMed}">
            <div class="meds-sec-header-left">
              <div class="meds-sec-icon-badge">💊</div>
              <div class="meds-sec-header-info">
                <span class="sec-sub">Individual Profiles &middot; 7-Day Adherence &middot; Drug History</span>
                <h3 class="sec-title">By Medicine <span class="meds-count-badge">${ZHUB_MED_DEFS.length} active</span></h3>
              </div>
            </div>
            <button type="button" class="meds-toggle-btn" aria-label="${zhubMedsCollapsed.byMed ? 'Expand By Medicine view' : 'Collapse By Medicine view'}" onclick="event.stopPropagation(); toggleZHubMedsSection('byMed')">
              ${zhubMedsCollapsed.byMed ? zhubIcon('chevR') + ' Expand' : zhubIcon('chev') + ' Collapse'}
            </button>
          </div>

          ${zhubMedsCollapsed.byMed ? `
            <div class="meds-collapsed-card glass" onclick="toggleZHubMedsSection('byMed')" role="button" tabindex="0">
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:16px;">💊</span>
                <span><b>${ZHUB_MED_DEFS.length} Medications Tracked</b> &middot; 7-day adherence dot grids &amp; drug-specific dose histories tucked away</span>
              </div>
              <span class="meds-toggle-btn">${zhubIcon('chevR')} Expand view</span>
            </div>
          ` : `
            <!-- Medication Cards Grid -->
            <div class="meds-regimen-grid">
              ${ZHUB_MED_DEFS.map(med => {
                let takenCount = 0;
                const dotsHtml = last7Dates.map(dStr => {
                  const entry = storage.getZLogEntry(dStr);
                  const mObj = (entry && entry.meds) ? entry.meds : {};
                  const taken = !!mObj[med.key];
                  if (taken) takenCount++;
                  const parts = dStr.split('-').map(Number);
                  const dt = new Date(parts[0], parts[1] - 1, parts[2]);
                  const dowShort = dt.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
                  return `
                    <button
                      type="button"
                      class="dose-day"
                      style="--c:${med.c}"
                      aria-pressed="${taken ? 'true' : 'false'}"
                      aria-label="${med.n} on ${formatCareDayLabel(dStr)}: ${taken ? 'Taken' : 'Missed'}"
                      title="${formatCareDayLabel(dStr)} · ${taken ? 'Taken' : 'Missed'} (tap to toggle)"
                      onclick="toggleMed7DayDose('${dStr}', '${med.key}', '${med.defaultDose}')"
                    >
                      <span>${dowShort}</span>
                      <span class="dose-dot${taken ? ' taken' : ''}"></span>
                    </button>
                  `;
                }).join('');

                const medChanges = sortedTitration.filter(r => getMedKeyForRecord(r) === med.key);
                const isHistoryOpen = !!zhubMedHistoryOpen[med.key];

                return `
                  <article class="med-card glass" style="--c:${med.c}">
                    <div class="med-card-top">
                      <div class="med-card-name">
                        <span class="med-dot"></span>
                        <span>${escapeHtml(med.n)}</span>
                      </div>
                      <span class="med-dose-pill">${escapeHtml(med.defaultDose)}</span>
                    </div>
                    <div class="med-meta">${escapeHtml(med.schedule)} &middot; ${takenCount}/${last7Dates.length} taken this week</div>
                    <div class="dose-7d" role="group" aria-label="${escapeHtml(med.n)} 7-day dose grid">
                      ${dotsHtml}
                    </div>

                    <!-- Drug-specific Titration History Drawer -->
                    <button
                      type="button"
                      class="med-history-drawer-toggle"
                      onclick="toggleZHubMedCardHistory('${med.key}')"
                      aria-expanded="${isHistoryOpen}"
                      aria-label="Toggle dose history for ${escapeHtml(med.n)}"
                    >
                      <span style="display:flex;align-items:center;gap:6px;">
                        <span>📜 Dose History</span>
                        <span class="meds-count-badge" style="font-size:10px;padding:1px 6px;">${medChanges.length}</span>
                      </span>
                      <span class="ic">${isHistoryOpen ? zhubSvg('chev') : zhubSvg('chevR')}</span>
                    </button>

                    ${isHistoryOpen ? `
                      <div class="med-history-drawer">
                        ${medChanges.length === 0 ? `
                          <div style="font-size:11.5px;color:var(--muted);padding:8px 4px;font-style:italic;">No logged dose changes for this medicine yet.</div>
                        ` : medChanges.map(r => {
                          const act = (r.action || 'Changed').toLowerCase();
                          let actColor = 'var(--blue)';
                          let actLabel = r.action || 'Changed';
                          if (act.includes('start')) { actColor = 'var(--cyan)'; actLabel = 'Started'; }
                          else if (act.includes('increase')) { actColor = 'var(--blue)'; actLabel = 'Increased'; }
                          else if (act.includes('decrease') || act.includes('drop')) { actColor = 'var(--violet)'; actLabel = 'Decreased'; }
                          else if (act.includes('stop')) { actColor = 'var(--rose)'; actLabel = 'Stopped'; }

                          const dayFmt = formatCareDayLabel(r.date);

                          return `
                            <div class="med-history-item" style="--c:${actColor}">
                              <div class="med-history-item-top">
                                <span class="med-history-item-date">${escapeHtml(dayFmt)}, ${(r.date || '').slice(0, 4)}</span>
                                <div style="display:flex;align-items:center;gap:6px;">
                                  <span class="rate" style="font-size:10.5px;padding:2px 8px;--c:${actColor}"><i></i>${escapeHtml(actLabel)}</span>
                                  <button type="button" class="iconbtn" style="min-height:28px;min-width:28px;padding:0;" aria-label="Remove change" onclick="deleteTitrationWithUndo('${escapeHtml(r.id)}')">
                                    ${zhubIcon('trash')}
                                  </button>
                                </div>
                              </div>
                              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                                <span class="med-history-item-dose">${escapeHtml(r.dosage)}</span>
                                ${r.prescriber ? `<span style="font-size:11px;color:var(--muted);">&middot; ${escapeHtml(r.prescriber)}</span>` : ''}
                              </div>
                              ${(r.notes || r.snapshot) ? `
                                <ul class="med-history-item-notes">
                                  ${r.notes ? `<li>${escapeHtml(stripEmojisForSanctuary(r.notes))}</li>` : ''}
                                  ${r.snapshot ? `<li style="opacity:0.8;">Snapshot: ${escapeHtml(stripEmojisForSanctuary(r.snapshot))}</li>` : ''}
                                </ul>
                              ` : ''}
                            </div>
                          `;
                        }).join('')}
                      </div>
                    ` : ''}
                  </article>
                `;
              }).join('')}

              ${otherChanges.length > 0 ? `
                <article class="med-card glass" style="--c:var(--violet)">
                  <div class="med-card-top">
                    <div class="med-card-name">
                      <span class="med-dot"></span>
                      <span>Other Protocol Changes</span>
                    </div>
                    <span class="med-dose-pill">${otherChanges.length} entries</span>
                  </div>
                  <div class="med-meta">Historical &middot; past medication changes</div>

                  <button
                    type="button"
                    class="med-history-drawer-toggle"
                    onclick="toggleZHubMedCardHistory('other')"
                    aria-expanded="${!!zhubMedHistoryOpen['other']}"
                    aria-label="Toggle other protocol changes"
                  >
                    <span style="display:flex;align-items:center;gap:6px;">
                      <span>📜 Dose History</span>
                      <span class="meds-count-badge" style="font-size:10px;padding:1px 6px;">${otherChanges.length}</span>
                    </span>
                    <span class="ic">${zhubMedHistoryOpen['other'] ? zhubSvg('chev') : zhubSvg('chevR')}</span>
                  </button>

                  ${zhubMedHistoryOpen['other'] ? `
                    <div class="med-history-drawer">
                      ${otherChanges.map(r => {
                        const act = (r.action || 'Changed').toLowerCase();
                        let actColor = 'var(--blue)';
                        let actLabel = r.action || 'Changed';
                        if (act.includes('start')) { actColor = 'var(--cyan)'; actLabel = 'Started'; }
                        else if (act.includes('increase')) { actColor = 'var(--blue)'; actLabel = 'Increased'; }
                        else if (act.includes('decrease') || act.includes('drop')) { actColor = 'var(--violet)'; actLabel = 'Decreased'; }
                        else if (act.includes('stop')) { actColor = 'var(--rose)'; actLabel = 'Stopped'; }

                        const dayFmt = formatCareDayLabel(r.date);

                        return `
                          <div class="med-history-item" style="--c:${actColor}">
                            <div class="med-history-item-top">
                              <span class="med-history-item-date">${escapeHtml(dayFmt)}, ${(r.date || '').slice(0, 4)}</span>
                              <div style="display:flex;align-items:center;gap:6px;">
                                <span class="rate" style="font-size:10.5px;padding:2px 8px;--c:${actColor}"><i></i>${escapeHtml(actLabel)}</span>
                                <button type="button" class="iconbtn" style="min-height:28px;min-width:28px;padding:0;" aria-label="Remove change" onclick="deleteTitrationWithUndo('${escapeHtml(r.id)}')">
                                  ${zhubIcon('trash')}
                                </button>
                              </div>
                            </div>
                            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                              <span class="med-history-item-dose"><b>${escapeHtml(r.medication)}:</b> ${escapeHtml(r.dosage)}</span>
                              ${r.prescriber ? `<span style="font-size:11px;color:var(--muted);">&middot; ${escapeHtml(r.prescriber)}</span>` : ''}
                            </div>
                            ${(r.notes || r.snapshot) ? `
                              <ul class="med-history-item-notes">
                                ${r.notes ? `<li>${escapeHtml(stripEmojisForSanctuary(r.notes))}</li>` : ''}
                                ${r.snapshot ? `<li style="opacity:0.8;">Snapshot: ${escapeHtml(stripEmojisForSanctuary(r.snapshot))}</li>` : ''}
                              </ul>
                            ` : ''}
                          </div>
                        `;
                      }).join('')}
                    </div>
                  ` : ''}
                </article>
              ` : ''}
            </div>

            <!-- Current Regimen Schedule Glass Card -->
            <div class="regimen-list-card glass">
              <div class="sec-title-row">
                <div>
                  <span class="sec-sub">Prescriber: Dr. Barness</span>
                  <h3 class="sec-title" style="font-size:20px;">Current Regimen Schedule</h3>
                </div>
              </div>
              <div class="regimen-row">
                <span class="regimen-slot">Morning (7:30a)</span>
                <div class="meds" style="flex:1">
                  <span class="mc" style="--c:var(--blue)"><b>Zoloft</b><span>75mg</span></span>
                  <span class="mc" style="--c:var(--cyan)"><b>Guanfacine XR</b><span>2mg</span></span>
                  <span class="mc" style="--c:var(--rose)"><b>Ritalin IR</b><span>15mg</span></span>
                </div>
              </div>
              <div class="regimen-row">
                <span class="regimen-slot">School (11:00a)</span>
                <div class="meds" style="flex:1">
                  <span class="mc" style="--c:var(--rose)"><b>Ritalin IR Booster</b><span>10mg</span></span>
                </div>
              </div>
              <div class="regimen-row">
                <span class="regimen-slot">Evening / Bed</span>
                <div class="meds" style="flex:1">
                  <span class="mc" style="--c:var(--green)"><b>Magnesium</b><span>Daily</span></span>
                  <span class="mc" style="--c:var(--violet)"><b>Melatonin</b><span>Bedtime</span></span>
                  <span class="mc" style="--c:var(--rose)"><b>Risperidone</b><span>PRN only (0mg daily)</span></span>
                </div>
              </div>
            </div>
          `}
        </div>
      ` : ''}

      <!-- VIEW 2: Chronological Timeline (Collapsible) -->
      ${showChrono ? `
        <div class="meds-view-section" id="sec-chrono">
          <div class="meds-sec-header" onclick="toggleZHubMedsSection('chrono')" role="button" tabindex="0" aria-expanded="${!zhubMedsCollapsed.chrono}">
            <div class="meds-sec-header-left">
              <div class="meds-sec-icon-badge">⏱️</div>
              <div class="meds-sec-header-info">
                <span class="sec-sub">Unified Protocol Spine &middot; Reverse Chronological Log</span>
                <h3 class="sec-title">Chronological Timeline <span class="meds-count-badge">${sortedTitration.length} entries</span></h3>
              </div>
            </div>
            <button type="button" class="meds-toggle-btn" aria-label="${zhubMedsCollapsed.chrono ? 'Expand Chronological view' : 'Collapse Chronological view'}" onclick="event.stopPropagation(); toggleZHubMedsSection('chrono')">
              ${zhubMedsCollapsed.chrono ? zhubIcon('chevR') + ' Expand' : zhubIcon('chev') + ' Collapse'}
            </button>
          </div>

          ${zhubMedsCollapsed.chrono ? `
            <div class="meds-collapsed-card glass" onclick="toggleZHubMedsSection('chrono')" role="button" tabindex="0">
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:16px;">⏱️</span>
                <span><b>${sortedTitration.length} Protocol Changes Logged</b> &middot; Master chronological spine across all medications tucked away</span>
              </div>
              <span class="meds-toggle-btn">${zhubIcon('chevR')} Expand view</span>
            </div>
          ` : `
            <div class="mb">
              ${sortedTitration.map(record => {
                const act = (record.action || 'Changed').toLowerCase();
                let actColor = 'var(--blue)';
                let actLabel = record.action || 'Changed';
                if (act.includes('start')) { actColor = 'var(--cyan)'; actLabel = 'Started'; }
                else if (act.includes('increase')) { actColor = 'var(--blue)'; actLabel = 'Increased'; }
                else if (act.includes('decrease') || act.includes('drop')) { actColor = 'var(--violet)'; actLabel = 'Decreased'; }
                else if (act.includes('stop')) { actColor = 'var(--rose)'; actLabel = 'Stopped'; }

                const dayFmt = formatCareDayLabel(record.date);

                return `
                  <article class="en glass" style="--c:${actColor}">
                    <span class="nd" aria-hidden="true"></span>
                    <div class="eh">
                      <div class="d">
                        <h3>${escapeHtml(dayFmt)}, ${escapeHtml((record.date || '').slice(0, 4))}</h3>
                        <span class="rate"><i></i>${escapeHtml(actLabel)}</span>
                      </div>
                      <button type="button" class="iconbtn" aria-label="Remove ${escapeHtml(record.medication)} change" onclick="deleteTitrationWithUndo('${escapeHtml(record.id)}')">
                        ${zhubIcon('trash')}
                      </button>
                    </div>
                    <div class="meds">
                      <span class="mc" style="--c:${actColor}"><b>${escapeHtml(record.medication)}</b><span>${escapeHtml(record.dosage)}</span></span>
                      ${record.prescriber ? `<span class="mc" style="--c:var(--violet)"><b>Prescriber</b><span>${escapeHtml(record.prescriber)}</span></span>` : ''}
                    </div>
                    ${(record.notes || record.snapshot) ? `
                      <ul class="ev">
                        ${record.notes ? `<li>${escapeHtml(stripEmojisForSanctuary(record.notes))}</li>` : ''}
                        ${record.snapshot ? `<li style="color:var(--muted)">Snapshot: ${escapeHtml(stripEmojisForSanctuary(record.snapshot))}</li>` : ''}
                      </ul>
                    ` : ''}
                  </article>
                `;
              }).join('')}
            </div>
          `}
        </div>
      ` : ''}
  `;

  if (container.id === 'pMeds') {
    container.innerHTML = medsInnerHtml;
  } else {
    container.innerHTML = `<div role="tabpanel" style="display:flex;flex-direction:column;gap:14px">${medsInnerHtml}</div>`;
  }
}

const renderMeds = renderZLogTitration;

/* --------------------------------------------------------------------------
   TAB 4: Patterns & Insights
   - Four insight cards with Fraunces serif headline number & plain-language line
   - Larger version of the month rating-mix bar with direct labels & takeaway title
   - Year heat calendar (one square per day in the 4 rating colors, empty in track)
   - Weekday strip showing which days run toughest with direct labels
   -------------------------------------------------------------------------- */
function setZHubHeatYear(yr) {
  zhubHeatYear = String(yr);
  renderZLogInsights();
}

function filterEntriesByPeriod(entries, period) {
  if (!entries || !Array.isArray(entries) || entries.length === 0 || period === 'all') {
    return entries || [];
  }
  const valid = entries.filter(e => e && e.date && /^\d{4}-\d{2}-\d{2}$/.test(e.date));
  if (valid.length === 0) return entries || [];

  const sorted = [...valid].sort((a, b) => a.date.localeCompare(b.date));
  const latestIso = sorted[sorted.length - 1].date;
  const [ly, lm, ld] = latestIso.split('-').map(Number);

  const monthsBack = period === '3m' ? 3 : period === '6m' ? 6 : period === '12m' ? 12 : 0;
  if (!monthsBack) return valid;

  const cutoffDate = new Date(ly, lm - 1 - monthsBack, ld);
  const cy = cutoffDate.getFullYear();
  const cm = String(cutoffDate.getMonth() + 1).padStart(2, '0');
  const cd = String(cutoffDate.getDate()).padStart(2, '0');
  const cutoffIso = `${cy}-${cm}-${cd}`;

  return valid.filter(e => e.date >= cutoffIso);
}

function getEntriesTimeFrameMeta(entries, period = 'all') {
  const periodLabel = period === '3m' ? 'Last 3 months' : period === '6m' ? 'Last 6 months' : period === '12m' ? 'Last 12 months' : 'All time';
  const valid = (entries || []).filter(e => e && e.date && /^\d{4}-\d{2}-\d{2}$/.test(e.date));
  const total = valid.length;
  if (total === 0) {
    return {
      text: 'No entries',
      short: 'No entries',
      total: 0,
      label: periodLabel
    };
  }
  const sorted = [...valid].sort((a, b) => a.date.localeCompare(b.date));
  const earliestIso = sorted[0].date;
  const latestIso = sorted[total - 1].date;
  const eParts = earliestIso.split('-').map(Number);
  const lParts = latestIso.split('-').map(Number);
  const eDate = new Date(eParts[0], eParts[1] - 1, eParts[2]);
  const lDate = new Date(lParts[0], lParts[1] - 1, lParts[2]);
  const eFmt = eDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const lFmt = lDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const eMY = eDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  const lMY = lDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  const text = `${eFmt} – ${lFmt}`;
  const short = (eMY === lMY) ? eMY : `${eMY} – ${lMY}`;
  return {
    text,
    short,
    total,
    label: periodLabel
  };
}

function setZHubRatingMixFilter(period) {
  if (!['3m', '6m', '12m', 'all'].includes(period)) return;
  zhubRatingMixFilter = period;
  try {
    localStorage.setItem('BOL_ZHUB_RATING_MIX_FILTER', period);
  } catch (e) {}
  renderZLogInsights();
}

function setZHubWeekdayFilter(period) {
  if (!['3m', '6m', '12m', 'all'].includes(period)) return;
  zhubWeekdayFilter = period;
  try {
    localStorage.setItem('BOL_ZHUB_WEEKDAY_FILTER', period);
  } catch (e) {}
  renderZLogInsights();
}

window.setZHubRatingMixFilter = setZHubRatingMixFilter;
window.setZHubWeekdayFilter = setZHubWeekdayFilter;

function renderZLogInsights() {
  const container = document.getElementById('pPatterns') || document.getElementById('zlog-subview-container');
  if (!container) return;

  const allEntries = storage.getAllZLogEntries();
  const total = allEntries.length;

  const monthBuckets = {};
  allEntries.forEach(e => {
    const rk = getEntryCareRatingKey(e);
    const mKey = (e.date || '').slice(0, 7);
    if (mKey) {
      if (!monthBuckets[mKey]) {
        monthBuckets[mKey] = { key: mKey, total: 0, great: 0, almost: 0, okay: 0, tough: 0 };
      }
      monthBuckets[mKey].total++;
      monthBuckets[mKey][rk]++;
    }
  });

  // Best stretch month
  let bestMonth = { shortMonth: 'June', pctGood: 73, total: 30 };
  Object.values(monthBuckets).forEach(mb => {
    if (mb.total >= 10) {
      const pct = Math.round(((mb.great + mb.almost) / mb.total) * 100);
      if (pct > bestMonth.pctGood) {
        const parts = mb.key.split('-');
        const mName = ZHUB_MONTH_NAMES[parseInt(parts[1], 10) - 1] || parts[1];
        bestMonth = { shortMonth: mName, pctGood: pct, total: mb.total };
      }
    }
  });

  // Recent 30 days
  const recent30 = allEntries.slice(0, 30);
  const recent30Good = recent30.filter(e => {
    const rk = getEntryCareRatingKey(e);
    return rk === 'great' || rk === 'almost';
  }).length;
  const recent30Pct = recent30.length > 0 ? Math.round((recent30Good / recent30.length) * 100) : 0;

  // Longest calm streak without big feelings
  const chronological = [...allEntries].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  let maxCalmStreak = 0;
  let curStreak = 0;
  chronological.forEach(e => {
    const rk = getEntryCareRatingKey(e);
    if (rk !== 'tough') {
      curStreak++;
      if (curStreak > maxCalmStreak) maxCalmStreak = curStreak;
    } else {
      curStreak = 0;
    }
  });

  // Overall Toughest weekday for top insight card
  const dowNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dowFull = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
  const allDowBuckets = Array.from({ length: 7 }, (_, i) => ({
    idx: i,
    short: dowNames[i],
    full: dowFull[i],
    total: 0,
    great: 0,
    almost: 0,
    okay: 0,
    tough: 0
  }));

  allEntries.forEach(e => {
    if (!e.date) return;
    const parts = e.date.split('-').map(Number);
    const dt = new Date(parts[0], parts[1] - 1, parts[2]);
    const d = dt.getDay();
    const rk = getEntryCareRatingKey(e);
    allDowBuckets[d].total++;
    allDowBuckets[d][rk]++;
  });

  let overallToughestDow = allDowBuckets[6];
  let overallCalmestDow = allDowBuckets[2];
  allDowBuckets.forEach(b => {
    if (b.total > 0) {
      const bToughPct = (b.tough / b.total) * 100;
      const curToughPct = overallToughestDow.total > 0 ? (overallToughestDow.tough / overallToughestDow.total) * 100 : 0;
      if (bToughPct > curToughPct) overallToughestDow = b;

      const bGoodPct = ((b.great + b.almost) / b.total) * 100;
      const curGoodPct = overallCalmestDow.total > 0 ? ((overallCalmestDow.great + overallCalmestDow.almost) / overallCalmestDow.total) * 100 : 0;
      if (bGoodPct > curGoodPct) overallCalmestDow = b;
    }
  });
  const overallToughestDowPct = overallToughestDow.total > 0 ? Math.round((overallToughestDow.tough / overallToughestDow.total) * 100) : 0;
  const overallCalmestDowPct = overallCalmestDow.total > 0 ? Math.round(((overallCalmestDow.great + overallCalmestDow.almost) / overallCalmestDow.total) * 100) : 0;

  // Filter Rating Mix entries based on zhubRatingMixFilter
  const ratingMixEntries = filterEntriesByPeriod(allEntries, zhubRatingMixFilter);
  const mixMeta = getEntriesTimeFrameMeta(ratingMixEntries, zhubRatingMixFilter);
  const mixTotal = ratingMixEntries.length;

  const mix = { great: 0, almost: 0, okay: 0, tough: 0 };
  const mixMonthBuckets = {};

  ratingMixEntries.forEach(e => {
    const rk = getEntryCareRatingKey(e);
    mix[rk] = (mix[rk] || 0) + 1;
    const mKey = (e.date || '').slice(0, 7);
    if (mKey) {
      if (!mixMonthBuckets[mKey]) {
        mixMonthBuckets[mKey] = { key: mKey, total: 0, great: 0, almost: 0, okay: 0, tough: 0 };
      }
      mixMonthBuckets[mKey].total++;
      mixMonthBuckets[mKey][rk]++;
    }
  });

  const pctGreat = mixTotal > 0 ? Math.round((mix.great / mixTotal) * 100) : 0;
  const pctAlmost = mixTotal > 0 ? Math.round((mix.almost / mixTotal) * 100) : 0;
  const pctOkay = mixTotal > 0 ? Math.round((mix.okay / mixTotal) * 100) : 0;
  const pctTough = mixTotal > 0 ? Math.max(0, 100 - (pctGreat + pctAlmost + pctOkay)) : 0;

  const visibleMixMonths = Object.keys(mixMonthBuckets).sort().reverse().slice(0, zhubRatingMixFilter === 'all' ? 8 : 12);

  // Filter Weekday Strip entries based on zhubWeekdayFilter
  const weekdayEntries = filterEntriesByPeriod(allEntries, zhubWeekdayFilter);
  const weekdayMeta = getEntriesTimeFrameMeta(weekdayEntries, zhubWeekdayFilter);
  const weekdayTotal = weekdayEntries.length;

  const dowBuckets = Array.from({ length: 7 }, (_, i) => ({
    idx: i,
    short: dowNames[i],
    full: dowFull[i],
    total: 0,
    great: 0,
    almost: 0,
    okay: 0,
    tough: 0
  }));

  weekdayEntries.forEach(e => {
    if (!e.date) return;
    const parts = e.date.split('-').map(Number);
    const dt = new Date(parts[0], parts[1] - 1, parts[2]);
    const d = dt.getDay();
    const rk = getEntryCareRatingKey(e);
    dowBuckets[d].total++;
    dowBuckets[d][rk]++;
  });

  let toughestDow = dowBuckets[6];
  let calmestDow = dowBuckets[2];
  dowBuckets.forEach(b => {
    if (b.total > 0) {
      const bToughPct = (b.tough / b.total) * 100;
      const curToughPct = toughestDow.total > 0 ? (toughestDow.tough / toughestDow.total) * 100 : 0;
      if (bToughPct > curToughPct) toughestDow = b;

      const bGoodPct = ((b.great + b.almost) / b.total) * 100;
      const curGoodPct = calmestDow.total > 0 ? ((calmestDow.great + calmestDow.almost) / calmestDow.total) * 100 : 0;
      if (bGoodPct > curGoodPct) calmestDow = b;
    }
  });

  const toughestDowPct = (toughestDow && toughestDow.total > 0) ? Math.round((toughestDow.tough / toughestDow.total) * 100) : 0;
  const calmestDowPct = (calmestDow && calmestDow.total > 0) ? Math.round(((calmestDow.great + calmestDow.almost) / calmestDow.total) * 100) : 0;

  // Year Heat Calendar (52-week x 7-day grid for selected year)
  const heatYearNum = parseInt(zhubHeatYear, 10) || 2026;
  const entryLookup = {};
  allEntries.forEach(e => {
    if (e.date && e.date.startsWith(zhubHeatYear)) {
      entryLookup[e.date] = e;
    }
  });

  const jan1 = new Date(heatYearNum, 0, 1);
  const startOffset = jan1.getDay();
  const daysInYear = ((heatYearNum % 4 === 0 && heatYearNum % 100 !== 0) || (heatYearNum % 400 === 0)) ? 366 : 365;
  const heatCells = [];

  for (let i = 0; i < startOffset; i++) {
    heatCells.push(`<span class="heat-cell" style="opacity:0.25" aria-hidden="true"></span>`);
  }

  for (let dayOfYear = 0; dayOfYear < daysInYear; dayOfYear++) {
    const dt = new Date(heatYearNum, 0, 1 + dayOfYear);
    const iso = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    const ent = entryLookup[iso];
    if (ent) {
      const rk = getEntryCareRatingKey(ent);
      const r = ZHUB_RATE[rk] || ZHUB_RATE.okay;
      heatCells.push(`<button type="button" class="heat-cell has" style="--c:${r.c}" title="${escapeHtml(formatCareDayLabel(iso) + ': ' + r.l)}" aria-label="${escapeHtml(formatCareDayLabel(iso) + ': ' + r.l)}" onclick="jumpToSanctuaryEntry('${iso}')"></button>`);
    } else {
      heatCells.push(`<span class="heat-cell" title="${escapeHtml(formatCareDayLabel(iso) + ': no entry')}"></span>`);
    }
  }

  const patternsInnerHtml = `
      <!-- 4 Insight Cards with Serif Headline Numbers -->
      <div class="insights-grid">
        <article class="insight-card glass">
          <span class="insight-kicker">Best stretch</span>
          <div class="insight-num" style="color:var(--cyan)">${escapeHtml(bestMonth.shortMonth)}, ${bestMonth.pctGood}% good</div>
          <div class="insight-line">Peak regulation across ${bestMonth.total} logged days with morning Guanfacine XR + 11:00 AM Ritalin school booster.</div>
        </article>

        <article class="insight-card glass">
          <span class="insight-kicker">Recent 30-day rhythm</span>
          <div class="insight-num" style="color:var(--blue)">${recent30Pct}% bright</div>
          <div class="insight-line">${recent30Good} of the last ${recent30.length} logged days were Great or Almost Good.</div>
        </article>

        <article class="insight-card glass">
          <span class="insight-kicker">Longest calm stretch</span>
          <div class="insight-num" style="color:var(--violet)">${maxCalmStreak} days</div>
          <div class="insight-line">Longest continuous run of regulated days without a Big feelings incident.</div>
        </article>

        <article class="insight-card glass">
          <span class="insight-kicker">Toughest weekday</span>
          <div class="insight-num" style="color:var(--rose)">${escapeHtml(overallToughestDow.full)}, ${overallToughestDowPct}%</div>
          <div class="insight-line">Unstructured weekend transitions run toughest; ${escapeHtml(overallCalmestDow.full)} (${overallCalmestDowPct}% bright) run calmest.</div>
        </article>
      </div>

      <!-- Larger Rating-Mix Bar with Direct Labels & Takeaway Title -->
      <section class="chart-card glass">
        <div class="sec-title-row">
          <div>
            <span class="sec-sub">Rating Mix &middot; ${escapeHtml(mixMeta.label)} (${mixMeta.short} &middot; ${mixTotal} Logged Days)</span>
            <h3 class="chart-takeaway">${mixTotal > 0 ? `${pctGreat + pctAlmost}% of recorded days in this period land in Great or Almost Good` : 'No entries recorded in this time frame'}</h3>
          </div>
          <div class="row" style="align-items:center;">
            <span class="meds-count-badge" style="font-size:12px;padding:6px 12px;" title="Time frame: ${escapeHtml(mixMeta.text)}">📅 ${escapeHtml(mixMeta.short)}</span>
            <button type="button" class="small" onclick="copyDoctorBrief()">Copy Dr. Barness brief</button>
          </div>
        </div>

        <!-- Rating Mix Filters -->
        <div class="chart-filter-row" role="group" aria-label="Rating mix time frame filter">
          ${[
            { id: '3m', label: 'Last 3 months' },
            { id: '6m', label: 'Last 6 months' },
            { id: '12m', label: 'Last 12 months' },
            { id: 'all', label: 'All time' }
          ].map(f => `
            <button type="button" class="fchip sm" aria-pressed="${zhubRatingMixFilter === f.id ? 'true' : 'false'}" onclick="setZHubRatingMixFilter('${f.id}')">${f.label}</button>
          `).join('')}
        </div>

        <div class="mix-bar-lg" role="img" aria-label="Rating mix: ${pctGreat}% Great, ${pctAlmost}% Almost Good, ${pctOkay}% Okay, ${pctTough}% Big feelings">
          <i style="width:${pctGreat}%;background:var(--cyan)"></i>
          <i style="width:${pctAlmost}%;background:var(--blue)"></i>
          <i style="width:${pctOkay}%;background:var(--violet)"></i>
          <i style="width:${pctTough}%;background:var(--rose)"></i>
        </div>

        <div class="mix-timeframe-sub">
          <span><b>Time Frame:</b> ${escapeHtml(mixMeta.text)} (${mixTotal} logged days &middot; ${escapeHtml(mixMeta.label)})</span>
          <span>Care Distribution</span>
        </div>

        <div class="mix-direct-labels">
          <div class="mix-direct-item" style="--c:var(--cyan)">
            <span>Great day</span>
            <b>${pctGreat}% <small>(${mix.great}d)</small></b>
          </div>
          <div class="mix-direct-item" style="--c:var(--blue)">
            <span>Almost Good</span>
            <b>${pctAlmost}% <small>(${mix.almost}d)</small></b>
          </div>
          <div class="mix-direct-item" style="--c:var(--violet)">
            <span>Okay day</span>
            <b>${pctOkay}% <small>(${mix.okay}d)</small></b>
          </div>
          <div class="mix-direct-item" style="--c:var(--rose)">
            <span>Big feelings</span>
            <b>${pctTough}% <small>(${mix.tough}d)</small></b>
          </div>
        </div>

        <div class="month-mix-rows">
          ${visibleMixMonths.map(mKey => {
            const mb = mixMonthBuckets[mKey];
            const n = mb.total || 1;
            const gPct = Math.round(((mb.great + mb.almost) / n) * 100);
            const parts = mKey.split('-');
            const mLabel = `${ZHUB_SHORT_MONTHS[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
            return `
              <div class="month-mix-row" style="cursor:pointer" onclick="openMonthInCalendar('${mKey}')" title="Open ${mLabel} in calendar">
                <span style="font-weight:700;color:var(--text)">${mLabel}</span>
                <div class="month-mix-bar">
                  <i style="width:${(mb.great / n) * 100}%;background:var(--cyan)"></i>
                  <i style="width:${(mb.almost / n) * 100}%;background:var(--blue)"></i>
                  <i style="width:${(mb.okay / n) * 100}%;background:var(--violet)"></i>
                  <i style="width:${(mb.tough / n) * 100}%;background:var(--rose)"></i>
                </div>
                <span style="font-weight:700;color:var(--muted);text-align:right">${gPct}% good</span>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Year Heat Calendar -->
      <section class="chart-card glass">
        <div class="sec-title-row">
          <div>
            <span class="sec-sub">Year Heat Calendar &middot; ${escapeHtml(zhubHeatYear)}</span>
            <h3 class="chart-takeaway">Every day of ${escapeHtml(zhubHeatYear)} in the four rating colors — tap a square to view entry</h3>
          </div>
          <div class="row" role="group" aria-label="Select year">
            ${['2026', '2025', '2024'].map(yr => `
              <button type="button" class="fchip" aria-pressed="${zhubHeatYear === yr ? 'true' : 'false'}" onclick="setZHubHeatYear('${yr}')">${yr}</button>
            `).join('')}
          </div>
        </div>

        <div class="heat-scroll">
          <div class="heat-months" aria-hidden="true">
            ${ZHUB_SHORT_MONTHS.map(m => `<span>${m}</span>`).join('')}
          </div>
          <div class="heat-grid">
            ${heatCells.join('')}
          </div>
        </div>
      </section>

      <!-- Weekday Strip Showing Which Days Run Toughest -->
      <section class="chart-card glass">
        <div class="sec-title-row">
          <div>
            <span class="sec-sub">Weekday Strip &middot; ${escapeHtml(weekdayMeta.label)} (${weekdayMeta.short} &middot; ${weekdayTotal} Logged Days)</span>
            <h3 class="chart-takeaway">${weekdayTotal > 0 ? `${escapeHtml(toughestDow.full)} run toughest (${toughestDowPct}% big feelings), while ${escapeHtml(calmestDow.full)} run calmest (${calmestDowPct}% bright)` : 'No entries recorded in this time frame'}</h3>
          </div>
          <div class="row" style="align-items:center;">
            <span class="meds-count-badge" style="font-size:12px;padding:6px 12px;" title="Time frame: ${escapeHtml(weekdayMeta.text)}">📅 ${escapeHtml(weekdayMeta.short)}</span>
          </div>
        </div>

        <!-- Weekday Strip Filters -->
        <div class="chart-filter-row" role="group" aria-label="Weekday strip time frame filter">
          ${[
            { id: '3m', label: 'Last 3 months' },
            { id: '6m', label: 'Last 6 months' },
            { id: '12m', label: 'Last 12 months' },
            { id: 'all', label: 'All time' }
          ].map(f => `
            <button type="button" class="fchip sm" aria-pressed="${zhubWeekdayFilter === f.id ? 'true' : 'false'}" onclick="setZHubWeekdayFilter('${f.id}')">${f.label}</button>
          `).join('')}
        </div>

        <div class="mix-timeframe-sub">
          <span><b>Time Frame:</b> ${escapeHtml(weekdayMeta.text)} (${weekdayTotal} logged days &middot; ${escapeHtml(weekdayMeta.label)})</span>
          <span>Day-of-Week Rhythm</span>
        </div>

        <div class="weekday-strip">
          ${[1, 2, 3, 4, 5, 6, 0].map(dIdx => {
            const b = dowBuckets[dIdx];
            const toughPct = b.total > 0 ? Math.round((b.tough / b.total) * 100) : 0;
            const goodPct = b.total > 0 ? Math.round(((b.great + b.almost) / b.total) * 100) : 0;
            const isToughest = (b.idx === toughestDow.idx && b.total > 0);
            const isCalmest = (b.idx === calmestDow.idx && b.total > 0);
            const cls = isToughest ? 'toughest' : (isCalmest ? 'calmest' : '');

            return `
              <div class="weekday-col ${cls}">
                <span class="weekday-name">${b.short}</span>
                <span class="weekday-val" style="color:${isToughest ? 'var(--rose)' : isCalmest ? 'var(--cyan)' : 'var(--text)'}">${toughPct}%</span>
                <span class="weekday-sub">big feelings</span>
                <span class="weekday-sub" style="font-weight:700;color:var(--blue)">${goodPct}% good</span>
              </div>
            `;
          }).join('')}
        </div>
      </section>
  `;

  if (container.id === 'pPatterns') {
    container.innerHTML = patternsInnerHtml;
  } else {
    container.innerHTML = `<div role="tabpanel" style="display:flex;flex-direction:column;gap:14px">${patternsInnerHtml}</div>`;
  }
}

const renderPatterns = renderZLogInsights;

/* --------------------------------------------------------------------------
   Dialog: Log / Edit Daily Entry (<dialog id="dlg" class="zhub-dlg">)
   -------------------------------------------------------------------------- */
function selectZHubDialogRating(rKey) {
  zhubDialogRating = ZHUB_RATE[rKey] ? rKey : 'great';
  document.querySelectorAll('#fRate .rating-capsule, #fRate .fchip').forEach(btn => {
    const isAct = btn.dataset.r === zhubDialogRating;
    btn.setAttribute('aria-pressed', isAct ? 'true' : 'false');
    btn.classList.toggle('active', isAct);
  });
}
window.selectZHubDialogRating = selectZHubDialogRating;

function toggleZLogCapsule(text, btnEl) {
  if (zhubSelectedCapsules.has(text)) {
    zhubSelectedCapsules.delete(text);
    if (btnEl) btnEl.classList.remove('active');
  } else {
    zhubSelectedCapsules.add(text);
    if (btnEl) btnEl.classList.add('active');
  }
  updateZLogLivePreview();
}
window.toggleZLogCapsule = toggleZLogCapsule;

function toggleZLogMedButton(key) {
  const btn = document.getElementById(`zlog-btn-med-${key}`);
  const chk = document.getElementById(`zlog-m-${key}`);
  if (!btn) return;
  const isSkipped = btn.classList.toggle('skipped');
  if (chk) chk.checked = !isSkipped;
}
window.toggleZLogMedButton = toggleZLogMedButton;

function toggleZLogMedDrawer() {
  const drawer = document.getElementById('zlog-med-drawer');
  if (!drawer) return;
  drawer.style.display = (drawer.style.display === 'none' || !drawer.style.display) ? 'block' : 'none';
}
window.toggleZLogMedDrawer = toggleZLogMedDrawer;

function updateZLogLivePreview() {
  const previewEl = document.getElementById('zlog-notes-preview');
  const countEl = document.getElementById('zlog-modal-pill-count');
  const hiddenNotes = document.getElementById('fNotes');
  const customNoteInput = document.getElementById('zlog-custom-note');

  const customText = customNoteInput ? customNoteInput.value.trim() : '';
  const bullets = Array.from(zhubSelectedCapsules);
  if (customText) {
    customText.split(/[;\n]+/).map(s => s.trim()).filter(Boolean).forEach(s => bullets.push(s));
  }

  if (countEl) countEl.textContent = `${bullets.length} selected`;

  if (hiddenNotes) {
    hiddenNotes.value = bullets.length > 0 ? bullets.map(b => `• ${b}`).join('\n') : '';
  }

  if (previewEl) {
    if (bullets.length === 0) {
      previewEl.innerHTML = '<span style="color:var(--muted);font-style:italic;">Tap pills above to automatically generate daily notes...</span>';
    } else {
      previewEl.innerHTML = bullets.map(b => `<div style="margin-bottom:3px;">• ${escapeHtml(b)}</div>`).join('');
    }
  }
}
window.updateZLogLivePreview = updateZLogLivePreview;

function loadZLogModalForDate(dateStr) {
  const todayIso = (typeof formatDateIso === 'function') ? formatDateIso(new Date()) : '2026-10-15';
  if (!dateStr) dateStr = todayIso;
  zhubEditingDate = dateStr;

  const dateInput = document.getElementById('fDate') || document.getElementById('zlog-modal-date');
  if (dateInput) {
    dateInput.value = dateStr;
    dateInput.disabled = false; // Always allow changing date!
  }

  const entry = storage.getZLogEntry(dateStr);
  const meds = entry.meds || {};
  const hasAnyMedLogged = !!(meds.z || meds.g || meds.rit || meds.mag || meds.mel || meds.ris);
  const isExistingEntry = !!(entry.rating || (entry.notes && entry.notes.trim()) || hasAnyMedLogged || (entry.attachments && entry.attachments.length));

  currentModalAttachments = Array.isArray(entry.attachments) ? [...entry.attachments] : [];
  zhubDialogRating = isExistingEntry ? getEntryCareRatingKey(entry) : 'great';

  const titleEl = document.getElementById('dT');
  if (titleEl) {
    titleEl.textContent = isExistingEntry ? `Edit ${formatCareDayLabel(dateStr)}` : `Log day · ${formatCareDayLabel(dateStr)}`;
  }

  const badgeEl = document.getElementById('zlog-date-status-badge');
  if (badgeEl) {
    badgeEl.textContent = isExistingEntry ? 'Existing Entry · Editing' : '+ New Date Entry';
    badgeEl.className = 'zhub-date-status-badge ' + (isExistingEntry ? 'is-existing' : 'is-new');
  }

  const bannerEl = document.getElementById('zlog-already-logged-banner');
  if (bannerEl) {
    if (dateStr === todayIso && isExistingEntry) {
      const yesterdayD = new Date();
      yesterdayD.setDate(yesterdayD.getDate() - 1);
      const yesterdayIso = (typeof formatDateIso === 'function') ? formatDateIso(yesterdayD) : '2026-10-16';
      bannerEl.innerHTML = `
        <div class="zhub-banner-inner">
          <span>Today is already logged. Tap to log another date:</span>
          <div class="zhub-banner-actions">
            <button type="button" class="zhub-banner-btn" onclick="setZLogModalDate('yesterday')">Log Yesterday</button>
            <button type="button" class="zhub-banner-btn" onclick="triggerZLogDatePicker()">Choose Date 📅</button>
          </div>
        </div>
      `;
      bannerEl.style.display = 'block';
    } else {
      bannerEl.style.display = 'none';
      bannerEl.innerHTML = '';
    }
  }

  // Update preset buttons active state
  const btnToday = document.getElementById('zlog-preset-today');
  const btnYest = document.getElementById('zlog-preset-yesterday');
  const btn2Days = document.getElementById('zlog-preset-2days');
  const yesterdayD = new Date();
  yesterdayD.setDate(yesterdayD.getDate() - 1);
  const yesterdayIso = (typeof formatDateIso === 'function') ? formatDateIso(yesterdayD) : '2026-10-16';
  const twoDaysD = new Date();
  twoDaysD.setDate(twoDaysD.getDate() - 2);
  const twoDaysIso = (typeof formatDateIso === 'function') ? formatDateIso(twoDaysD) : '2026-10-15';

  if (btnToday) btnToday.classList.toggle('active', dateStr === todayIso);
  if (btnYest) btnYest.classList.toggle('active', dateStr === yesterdayIso);
  if (btn2Days) btn2Days.classList.toggle('active', dateStr === twoDaysIso);

  const rmBtn = document.getElementById('rmBtn');
  if (rmBtn) {
    rmBtn.style.display = isExistingEntry ? 'inline-block' : 'none';
  }

  selectZHubDialogRating(zhubDialogRating);

  // Reset selected capsules
  zhubSelectedCapsules.clear();

  // Reset custom note input
  const customNoteInput = document.getElementById('zlog-custom-note');
  if (customNoteInput) customNoteInput.value = '';

  // Parse existing entry notes into pills + leftover custom note
  if (isExistingEntry && entry.notes) {
    const events = getEntryEventsList(entry);
    const leftoverEvents = [];
    
    // Flat array of known item texts
    const allKnownItems = [];
    ZHUB_CHECKPOINT_SECTIONS.forEach(sec => {
      sec.items.forEach(it => allKnownItems.push(it.text));
    });

    events.forEach(ev => {
      const cleanEv = ev.replace(/^[•\*\-\s]+/, '').trim();
      if (!cleanEv) return;

      const matched = allKnownItems.find(known => {
        return known.toLowerCase() === cleanEv.toLowerCase() ||
               cleanEv.toLowerCase().includes(known.toLowerCase()) ||
               known.toLowerCase().includes(cleanEv.toLowerCase());
      });

      if (matched) {
        zhubSelectedCapsules.add(matched);
      } else {
        leftoverEvents.push(cleanEv);
      }
    });

    if (customNoteInput && leftoverEvents.length > 0) {
      customNoteInput.value = leftoverEvents.join('; ');
    }
  }

  // Update capsule buttons DOM state
  document.querySelectorAll('.capsule-pill[data-capsule-text]').forEach(btn => {
    const text = btn.getAttribute('data-capsule-text');
    const isAct = zhubSelectedCapsules.has(text);
    btn.classList.toggle('active', isAct);
  });

  // Sync Routine Med Buttons (z, g, rit)
  ['z', 'g', 'rit'].forEach(k => {
    const btn = document.getElementById(`zlog-btn-med-${k}`);
    const isChecked = isExistingEntry ? !!meds[k] : true;
    if (btn) btn.classList.toggle('skipped', !isChecked);
    
    const chk = document.getElementById(`zlog-m-${k}`);
    if (chk) chk.checked = isChecked;

    const doseSpan = document.getElementById(`zlog-disp-med-${k}-dose`);
    if (doseSpan) {
      if (k === 'rit') {
        doseSpan.textContent = isExistingEntry ? String(meds.ritDose || (typeof meds.rit === 'string' && meds.rit ? meds.rit : '15mg')) : '15mg';
      } else {
        doseSpan.textContent = isExistingEntry ? String(meds[k + 'Dose'] || (k === 'z' ? '75mg' : '2mg')) : (k === 'z' ? '75mg' : '2mg');
      }
    }
  });

  // Sync Drawer Meds (mag, mel, ris)
  ['mag', 'mel', 'ris'].forEach(mKey => {
    const chk = document.getElementById(`zlog-m-${mKey}`);
    const doseIn = document.getElementById(`zlog-m-${mKey}-dose`);
    if (chk) {
      if (isExistingEntry) {
        chk.checked = !!meds[mKey];
      } else {
        chk.checked = (mKey !== 'ris'); // default daily active meds
      }
    }
    if (doseIn) {
      doseIn.value = isExistingEntry ? String(meds[mKey + 'Dose'] || (mKey === 'ris' ? '0.25mg' : mKey === 'mel' ? 'Bedtime' : 'Daily')) : (mKey === 'ris' ? '0.25mg' : mKey === 'mel' ? 'Bedtime' : 'Daily');
    }
  });

  updateZLogLivePreview();
  renderModalAttachmentsList();
}
window.loadZLogModalForDate = loadZLogModalForDate;

function onZLogModalDateChange(newDateStr) {
  if (!newDateStr) return;
  loadZLogModalForDate(newDateStr);
}
window.onZLogModalDateChange = onZLogModalDateChange;

function setZLogModalDate(preset) {
  const d = new Date();
  let targetIso;
  if (preset === 'yesterday') {
    d.setDate(d.getDate() - 1);
    targetIso = (typeof formatDateIso === 'function') ? formatDateIso(d) : '2026-10-16';
  } else if (preset === '2days') {
    d.setDate(d.getDate() - 2);
    targetIso = (typeof formatDateIso === 'function') ? formatDateIso(d) : '2026-10-15';
  } else {
    targetIso = (typeof formatDateIso === 'function') ? formatDateIso(d) : '2026-10-17';
  }
  loadZLogModalForDate(targetIso);
}
window.setZLogModalDate = setZLogModalDate;

function triggerZLogDatePicker() {
  const input = document.getElementById('fDate');
  if (!input) return;
  if (typeof input.showPicker === 'function') {
    try {
      input.showPicker();
      return;
    } catch (e) {}
  }
  input.focus();
}
window.triggerZLogDatePicker = triggerZLogDatePicker;

function openZLogEntryModal(targetDate = null) {
  let dialogEl = document.getElementById('dlg') || document.getElementById('zhub-dlg');
  if (!dialogEl) {
    renderZLogPage();
    dialogEl = document.getElementById('dlg') || document.getElementById('zhub-dlg');
  }
  if (!dialogEl) return;

  const todayIso = (typeof formatDateIso === 'function') ? formatDateIso(new Date()) : '2026-10-17';
  let dateStr = targetDate;

  // If user clicked "+ Log day" without specifying a date:
  if (!dateStr) {
    const todayEntry = (typeof storage !== 'undefined' && typeof storage.getZLogEntry === 'function')
      ? storage.getZLogEntry(todayIso)
      : null;
    const isTodayLogged = !!(todayEntry && (todayEntry.rating || (todayEntry.notes && todayEntry.notes.trim()) || (todayEntry.meds && Object.values(todayEntry.meds).some(Boolean))));

    if (isTodayLogged) {
      // Today is already logged! Look for the most recent unlogged day (starting with yesterday)
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const yesterdayIso = (typeof formatDateIso === 'function') ? formatDateIso(d) : '2026-10-16';
      dateStr = yesterdayIso;
    } else {
      dateStr = (typeof activeTrackingDate !== 'undefined' && activeTrackingDate) || todayIso;
    }
  }

  loadZLogModalForDate(dateStr);

  if (typeof dialogEl.showModal === 'function') {
    if (!dialogEl.open) dialogEl.showModal();
  } else {
    dialogEl.setAttribute('open', '');
  }

  const customInput = document.getElementById('zlog-custom-note');
  if (customInput) customInput.focus();
}
window.openZLogEntryModal = openZLogEntryModal;

function closeZLogModal() {
  const dlg = document.getElementById('dlg') || document.getElementById('zhub-dlg');
  if (dlg) {
    if (typeof dlg.close === 'function' && dlg.open) dlg.close();
    else dlg.removeAttribute('open');
  }
}

function submitZLogEntryModal(event) {
  if (event) event.preventDefault();
  const dateInput = document.getElementById('fDate') || document.getElementById('zlog-modal-date');
  const dateStr = (dateInput && dateInput.value) ? dateInput.value : (zhubEditingDate || '2026-10-15');
  if (!dateStr) {
    showZHubUndoToast('Pick a date');
    return;
  }

  const rMeta = ZHUB_RATE[zhubDialogRating] || ZHUB_RATE.great;

  // Collect selected bullets + custom 1-line note
  const bulletLines = Array.from(zhubSelectedCapsules);
  const customNoteInput = document.getElementById('zlog-custom-note');
  const customVal = customNoteInput ? customNoteInput.value.trim() : '';
  if (customVal) {
    customVal.split(/[;\n]+/).map(s => s.trim()).filter(Boolean).forEach(s => {
      bulletLines.push(s);
    });
  }

  const notesRaw = bulletLines.length > 0 
    ? bulletLines.map(b => `• ${b}`).join('\n')
    : 'No notes';

  // Read med pill toggle states
  const zChecked = !document.getElementById('zlog-btn-med-z')?.classList.contains('skipped');
  const zDose = (document.getElementById('zlog-m-z-dose')?.value || '75mg').trim();
  const gChecked = !document.getElementById('zlog-btn-med-g')?.classList.contains('skipped');
  const gDose = (document.getElementById('zlog-m-g-dose')?.value || '2mg').trim();
  const ritChecked = !document.getElementById('zlog-btn-med-rit')?.classList.contains('skipped');
  const ritDose = (document.getElementById('zlog-m-rit-dose')?.value || '15mg').trim();

  // Read drawer meds
  const magChecked = !!document.getElementById('zlog-m-mag')?.checked;
  const magDose = (document.getElementById('zlog-m-mag-dose')?.value || 'Daily').trim();
  const melChecked = !!document.getElementById('zlog-m-mel')?.checked;
  const melDose = (document.getElementById('zlog-m-mel-dose')?.value || 'Bedtime').trim();
  const risChecked = !!document.getElementById('zlog-m-ris')?.checked;
  const risDose = (document.getElementById('zlog-m-ris-dose')?.value || '0.25mg').trim();

  const existing = storage.getZLogEntry(dateStr);

  const entryData = {
    ...existing,
    date: dateStr,
    careRating: zhubDialogRating,
    rating: rMeta.v,
    ratingRaw: rMeta.l,
    aggression: (zhubDialogRating === 'tough'),
    notes: notesRaw,
    attachments: currentModalAttachments,
    meds: {
      z: zChecked,
      zDose,
      g: gChecked,
      gDose,
      rit: ritChecked ? ritDose : '',
      ritDose,
      mag: magChecked,
      magDose,
      mel: melChecked,
      melDose,
      ris: risChecked,
      risDose
    }
  };

  storage.saveZLogEntry(dateStr, entryData);
  syncSanctuaryLocalStorageMirror();

  const monthKey = dateStr.slice(0, 7);
  zlogExpandedMonths[monthKey] = true;

  closeZLogModal();
  renderZLogPage(activeZLogSubTab);
  showZHubUndoToast(`Saved ${formatCareDayLabel(dateStr)}`);
}

function deleteZLogEntryWithUndo() {
  const dateInput = document.getElementById('fDate') || document.getElementById('zlog-modal-date');
  const dateStr = (dateInput && dateInput.value) ? dateInput.value : zhubEditingDate;
  if (!dateStr || !storage.data.zlogEntries || !storage.data.zlogEntries[dateStr]) return;

  const backupEntry = JSON.parse(JSON.stringify(storage.data.zlogEntries[dateStr]));
  delete storage.data.zlogEntries[dateStr];
  try {
    localStorage.removeItem('ZLOG_ENTRY_BACKUP_' + dateStr);
  } catch (e) {}
  storage.saveData();
  syncSanctuaryLocalStorageMirror();

  closeZLogModal();
  renderZLogPage(activeZLogSubTab);

  showZHubUndoToast(`Deleted ${formatCareDayLabel(dateStr)}`, () => {
    storage.saveZLogEntry(dateStr, backupEntry);
    syncSanctuaryLocalStorageMirror();
    renderZLogPage(activeZLogSubTab);
  });
}

/* --------------------------------------------------------------------------
   Dialog: Add Protocol / Titration Event (<dialog id="zhub-med-dlg">)
   -------------------------------------------------------------------------- */
function openTitrationModal() {
  const dlg = document.getElementById('zhub-med-dlg');
  if (!dlg) return;
  const dateIn = document.getElementById('tit-modal-date');
  if (dateIn && !dateIn.value) {
    dateIn.value = (typeof formatDateIso === 'function') ? formatDateIso(new Date()) : '2026-10-15';
  }
  if (typeof dlg.showModal === 'function') {
    if (!dlg.open) dlg.showModal();
  } else {
    dlg.setAttribute('open', '');
  }
}

function closeTitrationModal() {
  const dlg = document.getElementById('zhub-med-dlg');
  if (dlg) {
    if (typeof dlg.close === 'function' && dlg.open) dlg.close();
    else dlg.removeAttribute('open');
  }
}

function submitTitrationModal(event) {
  if (event) event.preventDefault();
  const eventData = {
    date: document.getElementById('tit-modal-date')?.value || '2026-10-15',
    medication: (document.getElementById('tit-modal-med')?.value || '').trim(),
    dosage: (document.getElementById('tit-modal-dose')?.value || '').trim(),
    action: document.getElementById('tit-modal-action')?.value || 'Changed',
    prescriber: (document.getElementById('tit-modal-prescriber')?.value || 'Dr Barness').trim(),
    notes: (document.getElementById('tit-modal-notes')?.value || '').trim()
  };

  if (!eventData.medication || !eventData.dosage) return;
  storage.addTitrationEvent(eventData);
  syncSanctuaryLocalStorageMirror();
  closeTitrationModal();
  renderZLogPage('titration');
  showZHubUndoToast(`Saved ${eventData.medication} (${eventData.dosage})`);
}

/* --------------------------------------------------------------------------
   Toast with Undo (#toast matching #toast in margo-zhub.html)
   -------------------------------------------------------------------------- */
function showZHubUndoToast(msg, onUndo = null) {
  const t = document.getElementById('toast') || document.getElementById('zhub-toast');
  const m = document.getElementById('toastMsg') || document.getElementById('zhub-toast-msg');
  const u = document.getElementById('toastUndo') || document.getElementById('zhub-toast-undo');
  if (!t || !m) return;
  m.textContent = msg;
  zhubUndoFn = onUndo || null;
  if (u) u.style.display = onUndo ? 'inline-block' : 'none';
  t.style.display = 'flex';
  clearTimeout(zhubToastTimer);
  zhubToastTimer = setTimeout(() => {
    t.style.display = 'none';
    zhubUndoFn = null;
  }, 5000);
}

function triggerZHubUndo() {
  if (typeof zhubUndoFn === 'function') {
    const fn = zhubUndoFn;
    zhubUndoFn = null;
    fn();
  }
  const t = document.getElementById('toast') || document.getElementById('zhub-toast');
  if (t) t.style.display = 'none';
}

/* --------------------------------------------------------------------------
   Daily Report PDF Attachments (Preview, Upload, Download & Undo Delete)
   -------------------------------------------------------------------------- */
function renderModalAttachmentsList() {
  const container = document.getElementById('zlog-modal-attachments-container');
  if (!container) return;
  if (!currentModalAttachments || currentModalAttachments.length === 0) {
    container.innerHTML = '';
    return;
  }
  container.innerHTML = currentModalAttachments.map(att => `
    <div class="file">
      <span>${escapeHtml(att.name)}</span>
      <code>${escapeHtml(att.size || 'PDF')}</code>
      <button type="button" aria-label="View ${escapeHtml(att.name)}" onclick="viewZLogPdf('${escapeHtml(att.id)}', '${escapeHtml(att.name)}')">${zhubIcon('eye')}</button>
      <button type="button" class="del" aria-label="Remove ${escapeHtml(att.name)}" onclick="removeModalAttachment('${escapeHtml(att.id)}')">${zhubIcon('trash')}</button>
    </div>
  `).join('');
}

async function handleModalPdfFileSelect(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  await processPdfUpload(file);
  event.target.value = '';
}

async function processPdfUpload(file) {
  if (file.type && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    showZHubUndoToast('Please select a PDF file');
    return;
  }
  const dateInput = document.getElementById('fDate') || document.getElementById('zlog-modal-date');
  const dateStr = (dateInput && dateInput.value) ? dateInput.value : (zhubEditingDate || '2026-10-15');

  try {
    const meta = await pdfStore.savePdf(dateStr, file);
    currentModalAttachments.push(meta);
    renderModalAttachmentsList();
  } catch (err) {
    console.error('Failed to save PDF attachment:', err);
  }
}

function removeModalAttachment(id) {
  currentModalAttachments = currentModalAttachments.filter(a => a.id !== id);
  renderModalAttachmentsList();
}

function deleteZLogPdfEntryAttachment(id, dateStr) {
  const entry = storage.getZLogEntry(dateStr);
  if (!entry || !Array.isArray(entry.attachments)) return;
  const idx = entry.attachments.findIndex(a => a && a.id === id);
  if (idx === -1) return;
  const removed = entry.attachments.splice(idx, 1)[0];
  storage.saveZLogEntry(dateStr, entry);
  syncSanctuaryLocalStorageMirror();

  if (activeZLogSubTab === 'calendar') renderZLogCalendar();
  else renderZLogTimeline();

  showZHubUndoToast(`Removed ${removed.name}`, () => {
    const cur = storage.getZLogEntry(dateStr);
    if (!cur.attachments) cur.attachments = [];
    cur.attachments.splice(idx, 0, removed);
    storage.saveZLogEntry(dateStr, cur);
    syncSanctuaryLocalStorageMirror();
    if (activeZLogSubTab === 'calendar') renderZLogCalendar();
    else renderZLogTimeline();
  });
}

async function viewZLogPdf(id, name) {
  try {
    let pdfUrl = null;
    let sizeStr = '';

    const allEntries = (typeof storage !== 'undefined' && storage.data && storage.data.zlogEntries) ? storage.data.zlogEntries : {};
    for (const entry of Object.values(allEntries)) {
      if (entry && Array.isArray(entry.attachments)) {
        const found = entry.attachments.find(a => a && a.id === id);
        if (found) {
          if (found.url) pdfUrl = found.url;
          if (found.size) sizeStr = found.size;
          break;
        }
      }
    }

    if (!pdfUrl && typeof pdfStore !== 'undefined' && pdfStore) {
      const record = await pdfStore.getPdf(id);
      if (record && record.url) {
        pdfUrl = record.url;
        sizeStr = record.size || sizeStr;
      }
    }

    if (!pdfUrl) {
      showZHubUndoToast('PDF file not found in local store');
      return;
    }

    let modal = document.getElementById('modal-zlog-pdf-viewer');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-zlog-pdf-viewer';
      modal.className = 'modal-overlay';
      modal.onclick = (e) => { if (e.target === modal) closePdfViewerModal(); };
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-card zlog-pdf-viewer-card">
        <div class="modal-header" style="margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px; overflow: hidden;">
            ${zhubIcon('file')}
            <h3 style="margin: 0; font-size: 0.96rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(name)}</h3>
            <span style="font-size: 0.74rem; color: var(--text-muted); padding: 2px 6px; border-radius: 4px;">${escapeHtml(sizeStr || '')}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn" style="min-height:36px;padding:0 12px;font-size:12px;text-decoration:none;">
              <span>Open in new tab</span>
            </a>
            <button type="button" class="btn" onclick="downloadZLogPdf('${escapeHtml(id)}', '${escapeHtml(name)}')" style="min-height:36px;padding:0 12px;font-size:12px;">
              ${zhubIcon('download')}<span>Download</span>
            </button>
            <button type="button" class="iconbtn" onclick="closePdfViewerModal()" aria-label="Close preview">&times;</button>
          </div>
        </div>
        <div style="flex: 1; width: 100%; height: 100%; min-height: 440px; border-radius: 12px; overflow: hidden; background: #181a33;">
          <iframe src="${pdfUrl}" style="width: 100%; height: 100%; min-height: 440px; border: none;" title="${escapeHtml(name)}"></iframe>
        </div>
      </div>
    `;

    modal.classList.add('active');
  } catch (err) {
    console.error('Error opening PDF viewer:', err);
  }
}

function closePdfViewerModal() {
  const modal = document.getElementById('modal-zlog-pdf-viewer');
  if (modal) {
    modal.classList.remove('active');
    const iframe = modal.querySelector('iframe');
    if (iframe) iframe.src = 'about:blank';
  }
}

async function downloadZLogPdf(id, name) {
  try {
    let pdfUrl = null;
    const allEntries = (typeof storage !== 'undefined' && storage.data && storage.data.zlogEntries) ? storage.data.zlogEntries : {};
    for (const entry of Object.values(allEntries)) {
      if (entry && Array.isArray(entry.attachments)) {
        const found = entry.attachments.find(a => a && a.id === id);
        if (found && found.url) {
          pdfUrl = found.url;
          break;
        }
      }
    }

    if (!pdfUrl && typeof pdfStore !== 'undefined' && pdfStore) {
      const record = await pdfStore.getPdf(id);
      if (record && record.url) pdfUrl = record.url;
    }

    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = name || 'Daily_Report.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error('Error downloading PDF:', err);
  }
}

/* --------------------------------------------------------------------------
   Sync, CSV Export & Doctor Brief Helpers
   -------------------------------------------------------------------------- */
function forceSyncZLogDefaults() {
  if (typeof DEFAULT_ZLOG_ENTRIES !== 'undefined') {
    const cleanDefaults = { ...DEFAULT_ZLOG_ENTRIES };
    if (storage.data.zlogEntries && typeof storage.data.zlogEntries === 'object') {
      for (const [d, entry] of Object.entries(storage.data.zlogEntries)) {
        if (entry && ((entry.notes && entry.notes.trim()) || entry.rating || entry.updatedAt || (entry.attachments && entry.attachments.length))) {
          cleanDefaults[d] = { ...(cleanDefaults[d] || {}), ...entry };
        }
      }
    }
    storage.data.zlogEntries = cleanDefaults;
    storage.data.zlogSeedVersion = 15;
  }
  if (typeof DEFAULT_TITRATION_HISTORY !== 'undefined') {
    const existing = Array.isArray(storage.data.titrationHistory) ? storage.data.titrationHistory : [];
    if (existing.length < DEFAULT_TITRATION_HISTORY.length) {
      storage.data.titrationHistory = JSON.parse(JSON.stringify(DEFAULT_TITRATION_HISTORY));
    }
    storage.data.titrationSeedVersion = 7;
  }
  storage.saveData();
  syncSanctuaryLocalStorageMirror();
  if (typeof syncManager !== 'undefined' && syncManager.isConfigured && syncManager.isConfigured()) {
    syncManager.pushToCloud();
  }
  renderZLogPage(activeZLogSubTab);
  showZHubUndoToast('Synced all care journal entries');
}

function exportZLogData() {
  if (activeZLogSubTab === 'titration') {
    exportTitrationCSV();
    return;
  }
  const entries = storage.getAllZLogEntries();
  const q = s => `"${String(s || '').replace(/"/g, '""')}"`;
  const rows = [['date', 'rating', 'events', 'meds', 'reports']];
  entries.forEach(e => {
    const rk = getEntryCareRatingKey(e);
    const r = ZHUB_RATE[rk] || ZHUB_RATE.okay;
    const evs = getEntryEventsList(e).join(' | ');
    const meds = getEntryMedsPills(e).map(m => `${m.n} ${m.d}`).join(' | ');
    const files = (e.attachments || []).map(f => f.name).join(' | ');
    rows.push([e.date, r.l, evs, meds, files]);
  });
  const csv = rows.map(r => r.map(q).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'care-journal.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  showZHubUndoToast(`Exported ${entries.length} entries`);
}

function exportTitrationCSV() {
  if (typeof storage !== 'undefined' && typeof storage.exportTitrationCSV === 'function') {
    const list = storage.getTitrationHistory();
    storage.exportTitrationCSV(list);
  }
}

function copyDoctorBrief() {
  const allEntries = storage.getAllZLogEntries();
  const titrationList = storage.getTitrationHistory();
  const sortedEntriesByDate = [...allEntries].filter(e => e && e.date).sort((a, b) => a.date.localeCompare(b.date));
  const earliestIso = sortedEntriesByDate.length > 0 ? sortedEntriesByDate[0].date : '';
  const latestIso = sortedEntriesByDate.length > 0 ? sortedEntriesByDate[sortedEntriesByDate.length - 1].date : '';
  const rangeStr = (earliestIso && latestIso) ? `${earliestIso} to ${latestIso}` : 'All-Time';

  let great = 0, almost = 0, okay = 0, tough = 0;
  allEntries.forEach(e => {
    const rk = getEntryCareRatingKey(e);
    if (rk === 'great') great++;
    else if (rk === 'almost') almost++;
    else if (rk === 'okay') okay++;
    else tough++;
  });
  const total = allEntries.length || 1;
  const goodPct = Math.round(((great + almost) / total) * 100);
  const toughPct = Math.round((tough / total) * 100);

  const briefText = `Z'S CARE SANCTUARY — CLINICAL BRIEF (Dr. Barness)
Dataset Time Frame: ${rangeStr} (${allEntries.length} Daily Logs | ${titrationList.length} Protocol Adjustments)
Overall Mix: ${goodPct}% Bright Days (${great} Great, ${almost} Almost Good) · ${okay} Okay · ${tough} Big feelings (${toughPct}%)

1. CURRENT DAILY REGIMEN:
- Sertraline (Zoloft): 75 mg AM
- Guanfacine XR: 2 mg XR AM
- Methylphenidate (Ritalin IR): 15 mg AM + 10 mg 11:00 AM School Booster
- Risperidone: Discontinued regular daily dose 9/19 (PRN only)

2. KEY LONGITUDINAL PATTERNS:
- Best stretch: June 2026 (73% good days, 13% big feelings) with full morning Guanfacine XR + 11:00 AM Ritalin school booster.
- Midday booster prevents the 12:45 PM classroom focus drop.
- Saturdays run toughest due to open-ended structure; pre-dismissal 2:30 PM protein snack + 30m solitary LEGO/audio decompression after school reliably protect afternoon transitions.`;

  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(briefText).then(() => {
      showZHubUndoToast('Copied Dr. Barness brief to clipboard');
    });
  }
}
