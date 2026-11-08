/* ==========================================================================
   margo · Kitchen Sanctuary & Saturday Meal Ritual Page
   Streamlined 4-Step Linear Workflow with Architecture Palette
   ========================================================================== */

const KITCHEN_ICONS = {
  takeout: `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#FFD7A7" opacity="0.35"/>
      <circle cx="20" cy="20" r="18" stroke="#F87C71" stroke-width="1.5"/>
      <path d="M12 16 L15 30 H25 L28 16 Z" fill="#F87C71"/>
      <path d="M12 16 L20 13 L28 16" stroke="#1F2A44" stroke-width="1.5" fill="#FFE5D0"/>
      <path d="M14 16 Q20 9 26 16" stroke="#1F2A44" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <line x1="17" y1="21" x2="23" y2="21" stroke="#FFF" stroke-width="2" stroke-linecap="round"/>
      <line x1="20" y1="18" x2="20" y2="26" stroke="#FFF" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  pizza: `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#FFD7A7" opacity="0.35"/>
      <circle cx="20" cy="20" r="18" stroke="#F87C71" stroke-width="1.5"/>
      <path d="M20 9 L29 28 C23 31 17 31 11 28 Z" fill="#FFD7A7" stroke="#1F2A44" stroke-width="1.5"/>
      <path d="M11 28 C17 31 23 31 29 28" stroke="#F87C71" stroke-width="4" stroke-linecap="round"/>
      <circle cx="20" cy="18" r="2.5" fill="#F87C71"/>
      <circle cx="16" cy="24" r="2.5" fill="#F87C71"/>
      <circle cx="24" cy="23" r="2" fill="#F87C71"/>
      <circle cx="20" cy="25" r="1.5" fill="#1D71B8"/>
    </svg>
  `,
  salmon: `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#A9D1D1" opacity="0.35"/>
      <circle cx="20" cy="20" r="18" stroke="#1D71B8" stroke-width="1.5"/>
      <path d="M12 24 C14 15, 26 15, 28 24 C24 27, 16 27, 12 24 Z" fill="#F87C71"/>
      <path d="M14 22 C17 19, 23 19, 26 22" stroke="#FFD7A7" stroke-width="2" stroke-linecap="round"/>
      <circle cx="27" cy="14" r="4.5" fill="#E0DFAC"/>
      <path d="M13 14 C15 12, 17 16, 19 14" stroke="#1D71B8" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  taco: `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#FFD7A7" opacity="0.35"/>
      <circle cx="20" cy="20" r="18" stroke="#1D71B8" stroke-width="1.5"/>
      <path d="M10 25 C10 14, 30 14, 30 25 Z" fill="#FFD7A7" stroke="#1F2A44" stroke-width="1.5"/>
      <path d="M13 23 C15 18, 25 18, 27 23" fill="#F87C71"/>
      <circle cx="16" cy="20" r="2" fill="#E0DFAC"/>
      <circle cx="20" cy="18" r="2.5" fill="#1D71B8"/>
      <circle cx="24" cy="20" r="2" fill="#A9D1D1"/>
    </svg>
  `,
  risotto: `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#A9D1D1" opacity="0.35"/>
      <circle cx="20" cy="20" r="18" stroke="#1D71B8" stroke-width="1.5"/>
      <path d="M11 20 C11 28, 29 28, 29 20 Z" fill="#1D71B8"/>
      <ellipse cx="20" cy="19" rx="9" ry="4" fill="#E0DFAC"/>
      <path d="M18 18 C18 16, 22 16, 22 18 Z" fill="#1F2A44"/>
      <circle cx="16" cy="19" r="1.5" fill="#F87C71"/>
      <circle cx="24" cy="19" r="1.5" fill="#A9D1D1"/>
    </svg>
  `,
  chicken: `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#FFD7A7" opacity="0.35"/>
      <circle cx="20" cy="20" r="18" stroke="#1D71B8" stroke-width="1.5"/>
      <circle cx="19" cy="20" r="11" fill="#1F2A44"/>
      <rect x="28" y="18" width="6" height="4" rx="2" fill="#475569"/>
      <ellipse cx="19" cy="20" rx="7" ry="5" fill="#F87C71"/>
      <path d="M16 23 C19 21, 21 24, 23 22" stroke="#E0DFAC" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  pasta: `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#E0DFAC" opacity="0.35"/>
      <circle cx="20" cy="20" r="18" stroke="#1D71B8" stroke-width="1.5"/>
      <ellipse cx="20" cy="24" rx="12" ry="6" fill="#1F2A44"/>
      <path d="M13 22 C15 16, 25 16, 27 22" stroke="#FFD7A7" stroke-width="3" stroke-linecap="round"/>
      <path d="M15 19 C18 15, 22 15, 25 19" stroke="#F87C71" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="20" cy="15" r="2.5" fill="#A9D1D1"/>
    </svg>
  `,
  dumplings: `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#A9D1D1" opacity="0.35"/>
      <circle cx="20" cy="20" r="18" stroke="#1D71B8" stroke-width="1.5"/>
      <rect x="10" y="16" width="20" height="12" rx="4" fill="#A9D1D1" opacity="0.4"/>
      <rect x="10" y="16" width="20" height="12" rx="4" stroke="#1F2A44" stroke-width="1.5"/>
      <path d="M14 24 C14 18, 26 18, 26 24 Z" fill="#FFF" stroke="#1F2A44" stroke-width="1.5"/>
      <path d="M17 19 L18 21 M20 18 L20 21 M23 19 L22 21" stroke="#1F2A44" stroke-width="1" stroke-linecap="round"/>
    </svg>
  `,
  bistro: `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#F87C71" opacity="0.25"/>
      <circle cx="20" cy="20" r="18" stroke="#F87C71" stroke-width="1.5"/>
      <circle cx="16" cy="22" r="7" fill="#FFF" stroke="#1F2A44" stroke-width="1.5"/>
      <path d="M26 14 C26 18, 30 18, 30 14 Z" fill="#F87C71"/>
      <path d="M28 18 V26 M26 26 H30" stroke="#1F2A44" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `,
  salad: `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#E0DFAC" opacity="0.35"/>
      <circle cx="20" cy="20" r="18" stroke="#1D71B8" stroke-width="1.5"/>
      <path d="M11 20 C11 28, 29 28, 29 20 Z" fill="#1D71B8"/>
      <circle cx="16" cy="18" r="3.5" fill="#E0DFAC"/>
      <circle cx="22" cy="17" r="3" fill="#A9D1D1"/>
      <circle cx="20" cy="19" r="2.5" fill="#F87C71"/>
    </svg>
  `,
  brunch: `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#FFD7A7" opacity="0.35"/>
      <circle cx="20" cy="20" r="18" stroke="#1D71B8" stroke-width="1.5"/>
      <ellipse cx="20" cy="23" rx="11" ry="8" fill="#FFF" stroke="#1F2A44" stroke-width="1.5"/>
      <circle cx="20" cy="22" r="4.5" fill="#F87C71"/>
      <path d="M12 14 C15 11 25 11 28 14" stroke="#1D71B8" stroke-width="2" stroke-linecap="round"/>
      <circle cx="20" cy="22" r="2" fill="#FFE5D0"/>
    </svg>
  `,
  dessert: `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#F87C71" opacity="0.25"/>
      <circle cx="20" cy="20" r="18" stroke="#F87C71" stroke-width="1.5"/>
      <path d="M14 26 L16 32 H24 L26 26 Z" fill="#FFE5D0" stroke="#1F2A44" stroke-width="1.5"/>
      <ellipse cx="20" cy="24" rx="9" ry="4" fill="#E0DFAC" stroke="#1F2A44" stroke-width="1.5"/>
      <circle cx="20" cy="18" r="6" fill="#F87C71"/>
      <circle cx="21" cy="15" r="2.5" fill="#8B5CF6"/>
      <path d="M21 12.5 C22 10 24 10 25 11" stroke="#1D71B8" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `
};

let activeKitchenEditIdx = null;
let activeKitchenMealType = 'dinner'; // 'brunch', 'lunch', 'dinner', 'dessert'
let activeKitchenItemIdx = null; // index of item within d.meals[t], or null when adding new item
const kExpandedDayExtras = new Set();

function kGetScheduleForWeekOffset(data, offset) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const makeBlankWeek = () => dayNames.map(day => ({
    day,
    date: '',
    meal: '',
    source: 'fresh',
    icon: 'chicken',
    recipeUrl: '',
    favoriteId: null,
    meals: { brunch: [], lunch: [], dinner: [], dessert: [] }
  }));

  if (offset === 0) {
    if (!Array.isArray(data.weekSchedule)) data.weekSchedule = makeBlankWeek();
    return data.weekSchedule;
  }
  if (offset === 1) {
    if (!Array.isArray(data.followingWeekSchedule)) data.followingWeekSchedule = makeBlankWeek();
    return data.followingWeekSchedule;
  }
  if (offset === -1) {
    if (!Array.isArray(data.previousWeekSchedule)) {
      data.previousWeekSchedule = (data.extraWeekSchedules && Array.isArray(data.extraWeekSchedules['-1'])) ? data.extraWeekSchedules['-1'] : makeBlankWeek();
    }
    return data.previousWeekSchedule;
  }
  if (!data.extraWeekSchedules || typeof data.extraWeekSchedules !== 'object') {
    data.extraWeekSchedules = {};
  }
  const key = String(offset);
  if (!Array.isArray(data.extraWeekSchedules[key])) {
    data.extraWeekSchedules[key] = makeBlankWeek();
  }
  return data.extraWeekSchedules[key];
}

function kSetWeekOffset(offset) {
  const data = storage.getKitchenData();
  data.activeWeekOffset = offset;
  storage.saveKitchenData(data);
  renderKitchenPage();
}
window.kSetWeekOffset = kSetWeekOffset;

function kSetMealFilter(filter) {
  const data = storage.getKitchenData();
  data.activeMealFilter = filter;
  storage.saveKitchenData(data);
  renderKitchenPage();
}
window.kSetMealFilter = kSetMealFilter;

// Helper to get today's ISO date string
function getTodayIso() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getSourcePillLabel(source, dayName, mealType) {
  if (source === 'freezer') return 'Freezer 🧊';
  if (source === 'fridge') return 'Fridge 🥬';
  if (source === 'out') {
    if (dayName === 'Fri' && mealType === 'dinner') return 'Friday Takeout 🥡';
    if (dayName === 'Sat') return 'Dining Out 🍷';
    return 'Takeout / Out 🥡';
  }
  return '';
}

function kRenderAssignSelectOptions() {
  return `
    <option value="">Assign to...</option>
    <optgroup label="📅 This Week · Dinners">
      <option value="0:0:dinner">Sun Dinner</option>
      <option value="0:1:dinner">Mon Dinner</option>
      <option value="0:2:dinner">Tue Dinner</option>
      <option value="0:3:dinner">Wed Dinner</option>
      <option value="0:4:dinner">Thu Dinner</option>
      <option value="0:5:dinner">Fri Dinner (Takeout)</option>
      <option value="0:6:dinner">Sat Dinner</option>
    </optgroup>
    <optgroup label="🥗 This Week · Lunches">
      <option value="0:0:lunch">Sun Lunch</option>
      <option value="0:1:lunch">Mon Lunch</option>
      <option value="0:2:lunch">Tue Lunch</option>
      <option value="0:3:lunch">Wed Lunch</option>
      <option value="0:4:lunch">Thu Lunch</option>
      <option value="0:5:lunch">Fri Lunch</option>
      <option value="0:6:lunch">Sat Lunch</option>
    </optgroup>
    <optgroup label="☕ This Week · Brunch &amp; Desserts">
      <option value="0:0:brunch">Sun Brunch</option>
      <option value="0:6:brunch">Sat Brunch</option>
      <option value="0:0:dessert">Sun Dessert</option>
      <option value="0:1:dessert">Mon Dessert</option>
      <option value="0:2:dessert">Tue Dessert</option>
      <option value="0:3:dessert">Wed Dessert</option>
      <option value="0:4:dessert">Thu Dessert</option>
      <option value="0:5:dessert">Fri Dessert</option>
      <option value="0:6:dessert">Sat Dessert</option>
    </optgroup>
    <optgroup label="⏩ Upcoming Week · Dinners">
      <option value="1:0:dinner">Upcoming Sun Dinner</option>
      <option value="1:1:dinner">Upcoming Mon Dinner</option>
      <option value="1:2:dinner">Upcoming Tue Dinner</option>
      <option value="1:3:dinner">Upcoming Wed Dinner</option>
      <option value="1:4:dinner">Upcoming Thu Dinner</option>
      <option value="1:5:dinner">Upcoming Fri Dinner (Takeout)</option>
      <option value="1:6:dinner">Upcoming Sat Dinner</option>
    </optgroup>
    <optgroup label="🥗 Upcoming Week · Lunches">
      <option value="1:0:lunch">Upcoming Sun Lunch</option>
      <option value="1:1:lunch">Upcoming Mon Lunch</option>
      <option value="1:2:lunch">Upcoming Tue Lunch</option>
      <option value="1:3:lunch">Upcoming Wed Lunch</option>
      <option value="1:4:lunch">Upcoming Thu Lunch</option>
      <option value="1:5:lunch">Upcoming Fri Lunch</option>
      <option value="1:6:lunch">Upcoming Sat Lunch</option>
    </optgroup>
    <optgroup label="☕ Upcoming Week · Brunch &amp; Desserts">
      <option value="1:0:brunch">Upcoming Sun Brunch</option>
      <option value="1:6:brunch">Upcoming Sat Brunch</option>
      <option value="1:0:dessert">Upcoming Sun Dessert</option>
      <option value="1:1:dessert">Upcoming Mon Dessert</option>
      <option value="1:2:dessert">Upcoming Tue Dessert</option>
      <option value="1:3:dessert">Upcoming Wed Dessert</option>
      <option value="1:4:dessert">Upcoming Thu Dessert</option>
      <option value="1:5:dessert">Upcoming Fri Dessert</option>
      <option value="1:6:dessert">Upcoming Sat Dessert</option>
    </optgroup>
  `;
}
window.kRenderAssignSelectOptions = kRenderAssignSelectOptions;

window.kSetActiveTab = function(tabName) {
  localStorage.setItem('BOL_KITCHEN_ACTIVE_TAB', tabName);
  renderKitchenPage();
};

window.kToggleWeekDropdown = function() {
  const menu = document.getElementById('k-week-dropdown-menu');
  if (menu) menu.classList.toggle('active');
};

window.kToggleDayExtras = function(dayIdx) {
  if (kExpandedDayExtras.has(dayIdx)) {
    kExpandedDayExtras.delete(dayIdx);
  } else {
    kExpandedDayExtras.add(dayIdx);
  }
  const el = document.getElementById(`k-day-extras-${dayIdx}`);
  const arrow = document.getElementById(`k-day-arrow-${dayIdx}`);
  if (el) {
    const isHidden = !kExpandedDayExtras.has(dayIdx);
    if (isHidden) {
      el.classList.add('is-hidden');
    } else {
      el.classList.remove('is-hidden');
    }
    if (arrow) arrow.textContent = isHidden ? '▾' : '▴';
  }
};

if (!window._kWeekDropdownListenerAttached) {
  window._kWeekDropdownListenerAttached = true;
  document.addEventListener('click', function(e) {
    const wrap = document.getElementById('k-week-dropdown-wrap');
    const menu = document.getElementById('k-week-dropdown-menu');
    if (wrap && menu && !wrap.contains(e.target)) {
      menu.classList.remove('active');
    }
  });
}

function kGetPlannedInfoForItem(itemName, schedule) {
  if (!itemName || !Array.isArray(schedule)) return null;
  const norm = String(itemName).toLowerCase().trim();
  if (!norm) return null;
  for (const d of schedule) {
    if (!d || !d.meals) continue;
    for (const mType of ['brunch', 'lunch', 'dinner', 'dessert']) {
      const slots = Array.isArray(d.meals[mType]) ? d.meals[mType] : (d.meals[mType] && d.meals[mType].meal ? [d.meals[mType]] : []);
      for (const s of slots) {
        if (s && s.meal) {
          const mealText = String(s.meal).toLowerCase();
          if (mealText.includes(norm) || (norm.length >= 5 && mealText.includes(norm.slice(0, -1)))) {
            return { day: d.day, date: d.date, meal: s.meal };
          }
        }
      }
    }
  }
  return null;
}
window.kGetPlannedInfoForItem = kGetPlannedInfoForItem;

function kRenderStashItem(item, schedule) {
  const plannedInfo = kGetPlannedInfoForItem(item.name, schedule);
  const isPlanned = item.planned === true || (item.planned !== false && Boolean(plannedInfo));
  const isImmediate = Boolean(item.immediate);

  return `
    <div class="k-stash-kanban-item ${item.used ? 'is-used' : ''} ${isImmediate ? 'is-immediate' : ''} ${isPlanned ? 'is-planned' : ''}">
      <div class="k-stash-item-main">
        <button type="button" class="k-stash-item-check-btn" onclick="kToggleStashUsed('${item.id}', event)" title="${item.used ? 'Mark active' : 'Mark used'}">
          ${item.used ? '✓' : ''}
        </button>
        <span class="k-stash-item-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
        ${isImmediate ? `
          <button type="button" class="k-stash-badge-immediate" onclick="kToggleStashImmediate('${item.id}', event)" title="Immediate use (priority sort on top) · Tap to toggle">
            ⚡ Now
          </button>
        ` : ''}
        ${isPlanned ? `
          <button type="button" class="k-stash-badge-planned" onclick="kToggleStashPlanned('${item.id}', event)" title="${plannedInfo ? `Planned for ${plannedInfo.day} (${escapeHtml(plannedInfo.meal)})` : 'Planned for this week'} · Tap to toggle">
            🗓️ ${plannedInfo ? plannedInfo.day : 'Planned'}
          </button>
        ` : ''}
      </div>
      <div class="k-stash-item-actions">
        <button type="button" class="k-stash-item-immediate-btn ${isImmediate ? 'is-active' : ''}" onclick="kToggleStashImmediate('${item.id}', event)" title="${isImmediate ? 'Remove immediate use' : 'Mark for immediate use (sorts to top)'}">
          ⚡
        </button>
        <button type="button" class="k-stash-item-plan-btn ${isPlanned ? 'is-active' : ''}" onclick="kToggleStashPlanned('${item.id}', event)" title="${isPlanned ? (plannedInfo ? `Planned on ${plannedInfo.day} · Tap to unmark` : 'Planned for this week · Tap to unmark') : 'Mark as planned for this week'}">
          🗓️
        </button>
        <button type="button" class="k-stash-item-cycle-btn" onclick="kCycleStashType('${item.id}', event)" title="Move to next zone (Freezer → Fridge → Pantry)">
          ⇄
        </button>
        <button type="button" class="k-stash-item-del-btn" onclick="kDeleteStash('${item.id}')" title="Delete">
          ×
        </button>
      </div>
    </div>
  `;
}
window.kRenderStashItem = kRenderStashItem;

function renderKitchenPage() {
  const container = document.getElementById('daily-sheet-container');
  if (!container) return;

  storage.checkAndRolloverKitchenWeek();
  const data = storage.getKitchenData();
  const stashItems = data.stashItems || [];
  const favoriteRecipes = data.favoriteRecipes || [];
  const newRecipes = data.newRecipes || [];
  const groceryItems = data.groceries || [];
  const activeTab = localStorage.getItem('BOL_KITCHEN_ACTIVE_TAB') || 'meals';

  const todayIso = getTodayIso();

  // Dynamic week calculation
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sun
  const baseSun = new Date(now);
  baseSun.setDate(now.getDate() - dayOfWeek);

  const weekOffset = (typeof data.activeWeekOffset === 'number') ? data.activeWeekOffset : 0;
  const activeSun = new Date(baseSun);
  activeSun.setDate(baseSun.getDate() + (weekOffset * 7));

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(activeSun);
    d.setDate(activeSun.getDate() + i);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    weekDates.push({
      iso: `${yr}-${mo}-${da}`,
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }

  const thisWeekEnd = new Date(baseSun);
  thisWeekEnd.setDate(baseSun.getDate() + 6);
  const nextWeekSun = new Date(baseSun);
  nextWeekSun.setDate(baseSun.getDate() + 7);
  const nextWeekEnd = new Date(baseSun);
  nextWeekEnd.setDate(baseSun.getDate() + 13);

  const thisWeekLabel = `${baseSun.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${thisWeekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  const nextWeekLabel = `${nextWeekSun.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${nextWeekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  const weekRangeLabel = `${weekDates[0].dateLabel} – ${weekDates[6].dateLabel}`;

  const toMealItems = (slot) => {
    if (!slot) return [];
    if (Array.isArray(slot)) return slot.filter(i => i && i.meal);
    if (slot.meal) return [slot];
    return [];
  };

  const rawSchedule = kGetScheduleForWeekOffset(data, weekOffset);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullWeekSchedule = dayNames.map((dayName, idx) => {
    const existing = rawSchedule.find(s => s.day === dayName) || rawSchedule[idx] || {};
    const meals = existing.meals || {};
    const dinnerArr = toMealItems(meals.dinner);
    if (dinnerArr.length === 0 && existing.meal) {
      dinnerArr.push({
        meal: existing.meal,
        source: existing.source || (dayName === 'Fri' || dayName === 'Sat' ? 'out' : 'fresh'),
        icon: existing.icon || (dayName === 'Fri' ? 'takeout' : (dayName === 'Sat' ? 'bistro' : 'chicken')),
        recipeUrl: existing.recipeUrl || '',
        favoriteId: existing.favoriteId || null
      });
    }

    return {
      day: dayName,
      date: weekDates[idx].dateLabel,
      iso: weekDates[idx].iso,
      meal: dinnerArr[0]?.meal || existing.meal || '',
      source: dinnerArr[0]?.source || existing.source || 'fresh',
      icon: dinnerArr[0]?.icon || existing.icon || 'chicken',
      recipeUrl: dinnerArr[0]?.recipeUrl || existing.recipeUrl || '',
      favoriteId: dinnerArr[0]?.favoriteId || existing.favoriteId || null,
      meals: {
        brunch: toMealItems(meals.brunch),
        lunch: toMealItems(meals.lunch),
        dinner: dinnerArr,
        dessert: toMealItems(meals.dessert)
      }
    };
  });

  const vaultFilter = data.vaultFilter || 'all';
  const favMainCount = favoriteRecipes.filter(r => (r.course || 'main') === 'main').length;
  const favSideCount = favoriteRecipes.filter(r => r.course === 'side').length;
  const favBrunchCount = favoriteRecipes.filter(r => r.course === 'brunch').length;
  const favDessertCount = favoriteRecipes.filter(r => r.course === 'dessert').length;

  const filteredFavs = favoriteRecipes.filter(r => {
    if (vaultFilter === 'all') return true;
    return (r.course || 'main') === vaultFilter;
  });
  const courseOrder = { main: 1, side: 2, brunch: 3, dessert: 4 };
  filteredFavs.sort((a, b) => {
    const ca = courseOrder[a.course || 'main'] || 9;
    const cb = courseOrder[b.course || 'main'] || 9;
    if (ca !== cb) return ca - cb;
    return (a.title || '').localeCompare(b.title || '');
  });

  const sortStashItems = (items) => {
    return [...items].sort((a, b) => {
      // 1. Used items go to the very bottom
      if (Boolean(a.used) !== Boolean(b.used)) return a.used ? 1 : -1;
      // 2. Immediate use items go to the very top!
      if (Boolean(a.immediate) !== Boolean(b.immediate)) return a.immediate ? -1 : 1;
      // 3. Planned items next
      const aPlanned = a.planned === true || (a.planned !== false && Boolean(kGetPlannedInfoForItem(a.name, fullWeekSchedule)));
      const bPlanned = b.planned === true || (b.planned !== false && Boolean(kGetPlannedInfoForItem(b.name, fullWeekSchedule)));
      if (aPlanned !== bPlanned) return aPlanned ? -1 : 1;
      // 4. Alphabetical by name
      return (a.name || '').localeCompare(b.name || '');
    });
  };

  const freezerItems = sortStashItems(stashItems.filter(i => i.type === 'freezer'));
  const fridgeItems = sortStashItems(stashItems.filter(i => i.type === 'fridge'));
  const pantryItems = sortStashItems(stashItems.filter(i => i.type !== 'freezer' && i.type !== 'fridge'));
  const uncheckedGroceriesCount = groceryItems.filter(g => !g.checked).length;

  container.innerHTML = `
    <div class="kitchen-workflow-wrap">

      <!-- TOP NAVIGATION HUB CARD (MIDNIGHT OBSIDIAN & ROSE) -->
      <header class="k-hub-nav-card">
        <nav class="k-hub-tabs-list" aria-label="Kitchen Workflows">
          <button type="button" class="k-hub-tab-btn ${activeTab === 'meals' ? 'active' : ''}" onclick="kSetActiveTab('meals')">
            <span>🗓️</span>
            <span>Weekly Board</span>
          </button>
          <button type="button" class="k-hub-tab-btn ${activeTab === 'stash' ? 'active' : ''}" onclick="kSetActiveTab('stash')">
            <span>🥫</span>
            <span>Stash</span>
            ${stashItems.length > 0 ? `<span class="k-hub-tab-count">${stashItems.length}</span>` : ''}
          </button>
          <button type="button" class="k-hub-tab-btn ${activeTab === 'vault' ? 'active' : ''}" onclick="kSetActiveTab('vault')">
            <span>📖</span>
            <span>Recipe Vault</span>
            <span class="k-hub-tab-count">${favoriteRecipes.length}</span>
          </button>
          <button type="button" class="k-hub-tab-btn ${activeTab === 'want' ? 'active' : ''}" onclick="kSetActiveTab('want')">
            <span>✨</span>
            <span>Want to Try</span>
            <span class="k-hub-tab-count want-badge">${newRecipes.length} new</span>
          </button>
        </nav>

        <!-- Interactive Week Selector Dropdown -->
        <div class="k-week-dropdown-wrap" id="k-week-dropdown-wrap">
          <button type="button" class="k-week-dropdown-trigger" onclick="kToggleWeekDropdown()" aria-haspopup="true">
            <span>${weekOffset === 0 ? `This Week (${thisWeekLabel})` : (weekOffset === 1 ? `Next Week (${nextWeekLabel})` : `Week (${weekRangeLabel})`)}</span>
            <span style="font-size:10px;">▾</span>
          </button>

          <div class="k-week-dropdown-menu" id="k-week-dropdown-menu">
            <button type="button" class="k-week-dropdown-item ${weekOffset === 0 ? 'active' : ''}" onclick="kSetWeekOffset(0); kToggleWeekDropdown();">
              <div>
                <div class="k-week-dropdown-item-title">This Week</div>
                <div class="k-week-dropdown-item-sub">${escapeHtml(thisWeekLabel)} (Active)</div>
              </div>
              ${weekOffset === 0 ? `<span style="font-size:12px; font-weight:800; color:var(--k-coral);">✓</span>` : ''}
            </button>
            <button type="button" class="k-week-dropdown-item ${weekOffset === 1 ? 'active' : ''}" onclick="kSetWeekOffset(1); kToggleWeekDropdown();">
              <div>
                <div class="k-week-dropdown-item-title">Next Week</div>
                <div class="k-week-dropdown-item-sub">${escapeHtml(nextWeekLabel)} (Advance Plan)</div>
              </div>
              ${weekOffset === 1 ? `<span style="font-size:12px; font-weight:800; color:var(--k-coral);">✓</span>` : ''}
            </button>
            <div class="k-week-dropdown-divider"></div>
            <button type="button" class="k-week-dropdown-rollover" onclick="kManualWeekRollover(); kToggleWeekDropdown();">
              <span>↻</span>
              <span>Roll Next Week into Current</span>
            </button>
          </div>
        </div>
      </header>

      <!-- SUB-HEADER INFORMATION STRIP (WITH WEEK NAV ARROWS) -->
      <div class="k-hub-subbar">
        <div class="k-subbar-week-nav">
          <button type="button" class="k-subbar-nav-arrow" onclick="kSetWeekOffset(${weekOffset - 1})" title="Previous week" aria-label="Previous week">‹</button>
          <span class="k-subbar-viewing-label">Viewing: <strong class="k-hub-subbar-date">${escapeHtml(weekRangeLabel)}</strong></span>
          <button type="button" class="k-subbar-nav-arrow" onclick="kSetWeekOffset(${weekOffset + 1})" title="Next week" aria-label="Next week">›</button>
          ${weekOffset !== 0 ? `<button type="button" class="k-subbar-reset-today" onclick="kSetWeekOffset(0)" title="Return to current week">Today</button>` : ''}
        </div>
      </div>

      <!-- ===================================================================== -->
      <!-- TAB 1: WEEKLY BOARD                                                   -->
      <!-- ===================================================================== -->
      ${activeTab === 'meals' ? `
        <div class="k-board-grid">
          ${fullWeekSchedule.map((d, idx) => {
            const isToday = (weekOffset === 0 && d.iso === todayIso);
            const dinnerArr = d.meals.dinner || [];
            const brunchArr = d.meals.brunch || [];
            const lunchArr = d.meals.lunch || [];
            const dessertArr = d.meals.dessert || [];
            const daytimeCount = brunchArr.length + lunchArr.length + dessertArr.length;
            const isDaytimeExpanded = kExpandedDayExtras.has(idx) || (daytimeCount > 0 && !kExpandedDayExtras.has(`closed_${idx}`));

            const sourceLabels = {
              fresh: 'Fresh Cook',
              leftover: 'Leftovers',
              out: 'Takeout',
              prep: 'Batch Prep',
              custom: 'Homemade'
            };
            const isMealInVault = (mealTitle) => {
              if (!mealTitle) return false;
              const norm = mealTitle.toLowerCase().trim();
              return favoriteRecipes.some(r => (r.title || '').toLowerCase().trim() === norm);
            };

            return `
              <div class="k-board-day-card ${isToday ? 'is-today' : ''}">
                <div class="k-day-header-row">
                  <div class="k-day-title-group">
                    <span class="k-day-name">${d.day}</span>
                    <span class="k-day-date">${d.date}</span>
                  </div>
                  ${isToday ? `<span class="k-badge-today">Today</span>` : ''}
                </div>

                <!-- Dinner Section (Supports multiple entries) -->
                <div class="k-dinner-section">
                  ${dinnerArr.length > 0 ? `
                    <div class="k-dinner-list">
                      ${dinnerArr.map((dish, dIdx) => {
                        const isFav = isMealInVault(dish.meal);
                        const sLabel = sourceLabels[dish.source] || 'Fresh Cook';
                        return `
                          <div class="k-hero-dinner-box ${dIdx > 0 ? 'k-extra-dinner-box' : ''}" onclick="kOpenMealPicker(${idx}, 'dinner', ${dIdx})" title="Click to view or edit dish">
                            <div class="k-hero-dinner-tag-row">
                              <span class="k-dinner-tag-label">${dIdx === 0 ? '🍽️ Dinner' : '➕ Side / Course'}</span>
                              <span class="k-hero-source-pill source-${dish.source || 'fresh'}">${sLabel}</span>
                            </div>
                            <div class="k-hero-dinner-main">
                              <span class="k-hero-dinner-name">${escapeHtml(dish.meal)}</span>
                              <span class="k-hero-dinner-actions" onclick="event.stopPropagation()">
                                <button type="button" class="k-meal-fav-btn ${isFav ? 'is-fav' : ''}" onclick="kToggleFavSlot(${idx}, 'dinner', ${dIdx}, event)" title="${isFav ? 'Saved in Recipe Vault (tap to remove)' : 'Save recipe to Vault'}" aria-label="Save recipe to Vault">
                                  ${isFav ? '♥' : '♡'}
                                </button>
                                <button type="button" class="k-meal-copy-btn" onclick="kOpenCopyMoveModal(${idx}, 'dinner', ${dIdx}, event)" title="Copy or Move to another date" aria-label="Copy or Move to another date">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
                                </button>
                                <button type="button" class="k-meal-del-btn" onclick="kDeleteMealItem(${idx}, 'dinner', ${dIdx}, event)" title="Remove dish" aria-label="Remove dish">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                                <span class="k-hero-dinner-edit-hint">✎</span>
                              </span>
                            </div>
                            ${dish.recipeUrl ? `
                              <a href="${escapeHtml(dish.recipeUrl)}" target="_blank" rel="noopener noreferrer" class="k-recipe-card-link" onclick="event.stopPropagation()">
                                <span>🔗 Recipe link</span>
                              </a>
                            ` : ''}
                          </div>
                        `;
                      }).join('')}
                    </div>
                    <button type="button" class="k-add-extra-dish-btn" onclick="kOpenMealPicker(${idx}, 'dinner', null)" title="Add another dish to ${d.day} Dinner">
                      <span>＋ Add Another Dish to Dinner</span>
                    </button>
                  ` : `
                    <button type="button" class="k-hero-dinner-empty" onclick="kOpenMealPicker(${idx}, 'dinner', null)">
                      <span class="k-hero-dinner-empty-plus">＋</span>
                      <span class="k-hero-dinner-empty-text">Plan ${d.day} Dinner</span>
                      <span class="k-hero-dinner-empty-sub">Pick from Vault</span>
                    </button>
                  `}
                </div>

                <!-- Collapsible Daytime Slots Accordion (Supports multiple entries per type) -->
                <div class="k-daytime-accordion">
                  <button type="button" class="k-daytime-toggle-btn" onclick="kToggleDayExtras(${idx})">
                    <span>${daytimeCount > 0 ? `+ Daytime Meals (${daytimeCount} Planned)` : '+ Add Daytime Meals'}</span>
                    <span id="k-day-arrow-${idx}">${isDaytimeExpanded ? '▴' : '▾'}</span>
                  </button>

                  <div class="k-daytime-expandable-body ${isDaytimeExpanded ? '' : 'is-hidden'}" id="k-day-extras-${idx}">
                    ${[
                      { key: 'brunch', icon: '🥞', label: 'Brunch' },
                      { key: 'lunch', icon: '🥗', label: 'Lunch' },
                      { key: 'dessert', icon: '🍨', label: 'Dessert' }
                    ].map(slotConfig => {
                      const items = d.meals[slotConfig.key] || [];
                      return `
                        <div class="k-daytime-category-block">
                          <div class="k-daytime-category-head">
                            <span class="k-daytime-category-title">
                              ${slotConfig.icon} ${slotConfig.label}
                              ${items.length > 0 ? `<span class="k-daytime-badge">${items.length}</span>` : ''}
                            </span>
                            <button type="button" class="k-daytime-slot-add-btn" onclick="kOpenMealPicker(${idx}, '${slotConfig.key}', null)" title="Add dish to ${slotConfig.label}">
                              ＋ Add
                            </button>
                          </div>

                          ${items.length === 0 ? `
                            <div class="k-daytime-empty-row" onclick="kOpenMealPicker(${idx}, '${slotConfig.key}', null)">
                              <span>Empty · tap + to plan</span>
                            </div>
                          ` : `
                            <div class="k-daytime-items-list">
                              ${items.map((slot, sIdx) => {
                                const isFav = isMealInVault(slot.meal);
                                return `
                                  <div class="k-daytime-slot-row" onclick="kOpenMealPicker(${idx}, '${slotConfig.key}', ${sIdx})" title="Click to edit dish">
                                    <div class="k-daytime-slot-main">
                                      <span class="k-daytime-dish-name">${escapeHtml(slot.meal)}</span>
                                      ${slot.source === 'out' ? `<span class="k-hero-source-pill source-out" style="padding:1px 6px; font-size:10px;">Takeout</span>` : ''}
                                      ${slot.recipeUrl ? `
                                        <a href="${escapeHtml(slot.recipeUrl)}" target="_blank" rel="noopener noreferrer" class="k-recipe-mini-link" onclick="event.stopPropagation()">🔗</a>
                                      ` : ''}
                                    </div>
                                    <span class="k-hero-dinner-actions" onclick="event.stopPropagation()">
                                      <button type="button" class="k-meal-fav-btn ${isFav ? 'is-fav' : ''}" onclick="kToggleFavSlot(${idx}, '${slotConfig.key}', ${sIdx}, event)" title="${isFav ? 'Saved in Recipe Vault (tap to remove)' : 'Save recipe to Vault'}">
                                        ${isFav ? '♥' : '♡'}
                                      </button>
                                      <button type="button" class="k-meal-copy-btn" onclick="kOpenCopyMoveModal(${idx}, '${slotConfig.key}', ${sIdx}, event)" title="Copy or Move to another date" aria-label="Copy or Move to another date">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
                                      </button>
                                      <button type="button" class="k-meal-del-btn" onclick="kDeleteMealItem(${idx}, '${slotConfig.key}', ${sIdx}, event)" title="Remove dish" aria-label="Remove dish">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                      </button>
                                      <span class="k-hero-dinner-edit-hint">✎</span>
                                    </span>
                                  </div>
                                `;
                              }).join('')}
                            </div>
                          `}
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- ===================================================================== -->
      <!-- TAB 2: SHOP YOUR STASH (3-COLUMN KANBAN)                              -->
      <!-- ===================================================================== -->
      ${activeTab === 'stash' ? `
        <!-- Shop Your Stash First -->
        <div class="k-panel-card">
          <div class="k-panel-header" style="align-items:flex-start;">
            <div class="k-panel-title-group">
              <h3 class="k-panel-title">
                <span>🥫</span>
                <span>Shop Your Stash First</span>
              </h3>
              <span class="k-panel-desc">Prioritize items on hand before purchasing new groceries</span>
            </div>
            <div class="k-stash-summary-pill">
              <span>${stashItems.length} item${stashItems.length === 1 ? '' : 's'} on hand</span>
            </div>
          </div>

          <!-- Icon Legend Strip -->
          <div class="k-stash-legend-strip">
            <div class="k-stash-legend-pill">
              <span class="legend-ic legend-zap">⚡</span>
              <span><strong>Immediate Use</strong> (sorted to top)</span>
            </div>
            <div class="k-stash-legend-pill">
              <span class="legend-ic legend-plan">🗓️</span>
              <span><strong>Planned</strong> (on week's schedule)</span>
            </div>
            <div class="k-stash-legend-pill">
              <span class="legend-ic legend-cycle">⇄</span>
              <span><strong>Move Zone</strong> (Freezer ⇄ Fridge ⇄ Pantry)</span>
            </div>
            <div class="k-stash-legend-pill">
              <span class="legend-ic legend-check">✓</span>
              <span><strong>Mark Used</strong></span>
            </div>
          </div>

          <!-- 3-Column Kanban Grid -->
          <div class="k-stash-kanban-grid">
            <!-- Col 1: Freezer -->
            <div class="k-stash-kanban-col">
              <div class="k-stash-kanban-col-header">
                <div class="k-stash-kanban-col-title">
                  <span>🧊</span>
                  <span>Freezer</span>
                </div>
                <div class="k-stash-col-header-actions">
                  <span class="k-stash-kanban-col-count">${freezerItems.length}</span>
                  <button type="button" class="k-stash-col-add-btn" id="k-stash-add-btn-freezer" onclick="kToggleColAdd('freezer')" title="Add item to Freezer" aria-label="Add item to Freezer">＋</button>
                </div>
              </div>
              <div class="k-stash-kanban-items">
                <div class="k-stash-col-add-row" id="k-stash-add-row-freezer" style="display:none;">
                  <input type="text" class="k-clean-input" id="k-stash-inline-input-freezer" name="k_stash_item_freezer" placeholder="Add to Freezer..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-form-type="other" onkeydown="if(event.key==='Enter'||event.keyCode===13){event.preventDefault();kSubmitColAdd('freezer');}else if(event.key==='Escape'){kToggleColAdd('freezer');}">
                  <button type="button" class="k-btn-stash-add" onclick="kSubmitColAdd('freezer')">Add</button>
                  <button type="button" class="k-stash-inline-cancel-btn" onclick="kToggleColAdd('freezer')" title="Cancel">×</button>
                </div>
                ${freezerItems.length > 0 ? freezerItems.map(item => kRenderStashItem(item, fullWeekSchedule)).join('') : `
                  <button type="button" class="k-stash-kanban-empty-btn" onclick="kToggleColAdd('freezer')">
                    <span>＋ Add to Freezer</span>
                  </button>
                `}
              </div>
            </div>

            <!-- Col 2: Fridge -->
            <div class="k-stash-kanban-col">
              <div class="k-stash-kanban-col-header">
                <div class="k-stash-kanban-col-title">
                  <span>🥦</span>
                  <span>Refrigerator</span>
                </div>
                <div class="k-stash-col-header-actions">
                  <span class="k-stash-kanban-col-count">${fridgeItems.length}</span>
                  <button type="button" class="k-stash-col-add-btn" id="k-stash-add-btn-fridge" onclick="kToggleColAdd('fridge')" title="Add item to Refrigerator" aria-label="Add item to Refrigerator">＋</button>
                </div>
              </div>
              <div class="k-stash-kanban-items">
                <div class="k-stash-col-add-row" id="k-stash-add-row-fridge" style="display:none;">
                  <input type="text" class="k-clean-input" id="k-stash-inline-input-fridge" name="k_stash_item_fridge" placeholder="Add to Refrigerator..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-form-type="other" onkeydown="if(event.key==='Enter'||event.keyCode===13){event.preventDefault();kSubmitColAdd('fridge');}else if(event.key==='Escape'){kToggleColAdd('fridge');}">
                  <button type="button" class="k-btn-stash-add" onclick="kSubmitColAdd('fridge')">Add</button>
                  <button type="button" class="k-stash-inline-cancel-btn" onclick="kToggleColAdd('fridge')" title="Cancel">×</button>
                </div>
                ${fridgeItems.length > 0 ? fridgeItems.map(item => kRenderStashItem(item, fullWeekSchedule)).join('') : `
                  <button type="button" class="k-stash-kanban-empty-btn" onclick="kToggleColAdd('fridge')">
                    <span>＋ Add to Refrigerator</span>
                  </button>
                `}
              </div>
            </div>

            <!-- Col 3: Pantry -->
            <div class="k-stash-kanban-col">
              <div class="k-stash-kanban-col-header">
                <div class="k-stash-kanban-col-title">
                  <span>🌾</span>
                  <span>Pantry</span>
                </div>
                <div class="k-stash-col-header-actions">
                  <span class="k-stash-kanban-col-count">${pantryItems.length}</span>
                  <button type="button" class="k-stash-col-add-btn" id="k-stash-add-btn-pantry" onclick="kToggleColAdd('pantry')" title="Add item to Pantry" aria-label="Add item to Pantry">＋</button>
                </div>
              </div>
              <div class="k-stash-kanban-items">
                <div class="k-stash-col-add-row" id="k-stash-add-row-pantry" style="display:none;">
                  <input type="text" class="k-clean-input" id="k-stash-inline-input-pantry" name="k_stash_item_pantry" placeholder="Add to Pantry..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-form-type="other" onkeydown="if(event.key==='Enter'||event.keyCode===13){event.preventDefault();kSubmitColAdd('pantry');}else if(event.key==='Escape'){kToggleColAdd('pantry');}">
                  <button type="button" class="k-btn-stash-add" onclick="kSubmitColAdd('pantry')">Add</button>
                  <button type="button" class="k-stash-inline-cancel-btn" onclick="kToggleColAdd('pantry')" title="Cancel">×</button>
                </div>
                ${pantryItems.length > 0 ? pantryItems.map(item => kRenderStashItem(item, fullWeekSchedule)).join('') : `
                  <button type="button" class="k-stash-kanban-empty-btn" onclick="kToggleColAdd('pantry')">
                    <span>＋ Add to Pantry</span>
                  </button>
                `}
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- ===================================================================== -->
      <!-- TAB 3: RECIPE VAULT (HOUSEHOLD FAVORITES)                              -->
      <!-- ===================================================================== -->
      ${activeTab === 'vault' ? `
        <div class="k-panel-card">
          <div class="k-vault-filter-bar">
            <div class="k-course-filter-chips">
              <button type="button" class="k-course-chip ${vaultFilter === 'all' ? 'active' : ''}" onclick="kSetVaultFilter('all')">
                All (${favoriteRecipes.length})
              </button>
              <button type="button" class="k-course-chip ${vaultFilter === 'main' ? 'active' : ''}" onclick="kSetVaultFilter('main')">
                Mains (${favMainCount})
              </button>
              <button type="button" class="k-course-chip ${vaultFilter === 'side' ? 'active' : ''}" onclick="kSetVaultFilter('side')">
                Sides &amp; Salads (${favSideCount})
              </button>
              <button type="button" class="k-course-chip ${vaultFilter === 'brunch' ? 'active' : ''}" onclick="kSetVaultFilter('brunch')">
                Brunch (${favBrunchCount})
              </button>
              <button type="button" class="k-course-chip ${vaultFilter === 'dessert' ? 'active' : ''}" onclick="kSetVaultFilter('dessert')">
                Dessert (${favDessertCount})
              </button>
            </div>

            <button type="button" class="k-btn-add-recipe" onclick="kOpenAddFavModal('vault')">
              <span>＋</span>
              <span>Add Recipe to Vault</span>
            </button>
          </div>

          <div class="k-recipe-cards-grid">
            ${filteredFavs.length > 0 ? filteredFavs.map(r => {
              const courseLabel = { main: 'Main 🍲', side: 'Side 🥗', brunch: 'Brunch ☕', dessert: 'Dessert 🍨' }[r.course || 'main'] || 'Main 🍲';
              return `
                <div class="k-recipe-card" onclick="kOpenViewRecipeModal('${r.id}', 'vault', event)" title="Click to view full recipe">
                  <div class="k-recipe-card-header">
                    <span class="k-recipe-card-title">${escapeHtml(r.title)}</span>
                    <span class="k-recipe-course-badge">${courseLabel}</span>
                  </div>

                  ${r.ingredients ? `
                    <p class="k-recipe-card-ingredients">${escapeHtml(r.ingredients)}</p>
                  ` : '<p class="k-recipe-card-ingredients" style="opacity:0.5; font-style:italic;">No ingredients listed</p>'}

                  ${r.recipeUrl ? `
                    <div>
                      <a href="${escapeHtml(r.recipeUrl)}" target="_blank" rel="noopener noreferrer" class="k-recipe-card-link" onclick="event.stopPropagation()">
                        <span>🔗 View original recipe</span>
                      </a>
                    </div>
                  ` : ''}

                  <div class="k-recipe-card-actions" onclick="event.stopPropagation()">
                    <button type="button" class="k-btn-plan-recipe" onclick="kOpenAssignModal('${r.id}', 'vault')">
                      + Plan to Day
                    </button>
                    <div class="k-recipe-secondary-actions">
                      <button type="button" class="k-btn-promote-vault" onclick="kOpenViewRecipeModal('${r.id}', 'vault', event)">View recipe</button>
                      <button type="button" class="k-btn-del-recipe" onclick="kDeleteFavorite('${r.id}', event)">Delete</button>
                    </div>
                  </div>
                </div>
              `;
            }).join('') : `
              <div style="grid-column:1/-1; padding:30px; text-align:center; color:var(--k-text-muted); font-size:13px;">
                No recipes found for this filter. Tap "Add Recipe to Vault" to add one!
              </div>
            `}
          </div>
        </div>
      ` : ''}

      <!-- ===================================================================== -->
      <!-- TAB 4: WANT TO TRY RECIPES (TEST KITCHEN QUEUE)                        -->
      <!-- ===================================================================== -->
      ${activeTab === 'want' ? `
        <div class="k-panel-card">
          <div class="k-vault-filter-bar">
            <div>
              <h3 class="k-panel-title">
                <span>✨</span>
                <span>Test Kitchen &amp; "Want to Try" Queue</span>
              </h3>
              <span class="k-panel-desc">Test new culinary ideas. Once tested and loved, promote them to your Vault with 1 tap.</span>
            </div>

            <button type="button" class="k-btn-add-recipe" onclick="kOpenAddFavModal('new')">
              <span>＋</span>
              <span>Add Recipe to Test</span>
            </button>
          </div>

          <div class="k-recipe-cards-grid">
            ${newRecipes.length > 0 ? newRecipes.map(r => {
              const courseLabel = { main: 'Main 🍲', side: 'Side 🥗', brunch: 'Brunch ☕', dessert: 'Dessert 🍨' }[r.course || 'main'] || 'Main 🍲';
              return `
                <div class="k-recipe-card" onclick="kOpenViewRecipeModal('${r.id}', 'new', event)" title="Click to view full recipe">
                  <div class="k-recipe-card-header">
                    <span class="k-recipe-card-title">${escapeHtml(r.title)}</span>
                    <span class="k-recipe-course-badge want">Want to Try</span>
                  </div>

                  ${r.ingredients ? `
                    <p class="k-recipe-card-ingredients">${escapeHtml(r.ingredients)}</p>
                  ` : '<p class="k-recipe-card-ingredients" style="opacity:0.5; font-style:italic;">No ingredients listed</p>'}

                  ${r.recipeUrl ? `
                    <div>
                      <a href="${escapeHtml(r.recipeUrl)}" target="_blank" rel="noopener noreferrer" class="k-recipe-card-link" onclick="event.stopPropagation()">
                        <span>🔗 View recipe link</span>
                      </a>
                    </div>
                  ` : ''}

                  <div class="k-recipe-card-actions" onclick="event.stopPropagation()">
                    <button type="button" class="k-btn-plan-recipe" onclick="kOpenAssignModal('${r.id}', 'new')">
                      Plan to Day ＋
                    </button>
                    <div class="k-recipe-secondary-actions">
                      <button type="button" class="k-btn-promote-vault" onclick="kMoveNewRecipeToVault('${r.id}')">
                        <span>💠</span>
                        <span>Promote to Vault</span>
                      </button>
                      <button type="button" class="k-btn-del-recipe" onclick="kDeleteNewRecipe('${r.id}', event)">Remove</button>
                    </div>
                  </div>
                </div>
              `;
            }).join('') : `
              <div style="grid-column:1/-1; padding:30px; text-align:center; color:var(--k-text-muted); font-size:13px;">
                Your "Want to Try" queue is empty. Tap "Add Recipe to Test" to queue up exciting new dishes!
              </div>
            `}
          </div>
        </div>
      ` : ''}

    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ==========================================================================
   ACTIONS & EVENT HANDLERS
   ========================================================================== */

function kToggleStashUsed(id, event) {
  if (event) event.stopPropagation();
  const data = storage.getKitchenData();
  const item = (data.stashItems || []).find(i => i.id === id);
  if (!item) return;

  item.used = !item.used;
  storage.saveKitchenData(data);
  renderKitchenPage();

  if (typeof showToast === 'function') {
    showToast(item.used ? `Crossed off "${item.name}" as used! ✨` : `Restored "${item.name}"`);
  }
}

function kDeleteStash(id) {
  const data = storage.getKitchenData();
  data.stashItems = (data.stashItems || []).filter(i => i.id !== id);
  storage.saveKitchenData(data);
  renderKitchenPage();
  if (typeof showToast === 'function') showToast('Removed stash item');
}

// 3 Separate Buttons: Pantry (default on Enter), Fridge, and Freezer
function kAddStashWithSource(sourceType = 'pantry') {
  const input = document.getElementById('k-stash-entry-input') || document.getElementById('k-stash-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    input.focus();
    return;
  }

  const badgeName = sourceType === 'freezer' ? 'Freezer' : (sourceType === 'fridge' ? 'Fridge' : 'Pantry');

  const data = storage.getKitchenData();
  if (!data.stashItems) data.stashItems = [];
  data.stashItems.push({
    id: 's-' + Date.now(),
    type: sourceType,
    name: val,
    badge: badgeName,
    used: false
  });
  storage.saveKitchenData(data);
  input.value = '';
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Added "${val}" to ${badgeName}!`);
}
window.kAddStashWithSource = kAddStashWithSource;

function kToggleColAdd(type) {
  const row = document.getElementById(`k-stash-add-row-${type}`);
  if (!row) return;
  const isCurrentlyOpen = row.style.display !== 'none';

  ['freezer', 'fridge', 'pantry'].forEach(t => {
    const r = document.getElementById(`k-stash-add-row-${t}`);
    const b = document.getElementById(`k-stash-add-btn-${t}`);
    if (r) {
      if (t === type && !isCurrentlyOpen) {
        r.style.display = 'flex';
        if (b) b.classList.add('active');
        const inp = document.getElementById(`k-stash-inline-input-${t}`);
        if (inp) {
          setTimeout(() => {
            inp.focus();
            inp.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 40);
        }
      } else {
        r.style.display = 'none';
        if (b) b.classList.remove('active');
      }
    }
  });
}
window.kToggleColAdd = kToggleColAdd;

function kSubmitColAdd(type) {
  const input = document.getElementById(`k-stash-inline-input-${type}`);
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    input.focus();
    return;
  }
  const badgeName = type === 'freezer' ? 'Freezer' : (type === 'fridge' ? 'Fridge' : 'Pantry');
  const data = storage.getKitchenData();
  if (!data.stashItems) data.stashItems = [];
  data.stashItems.push({
    id: 's-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    type: type,
    name: val,
    badge: badgeName,
    used: false
  });
  storage.saveKitchenData(data);
  renderKitchenPage();

  // Keep the add row open and focus the input for rapid multi-item entry
  const newRow = document.getElementById(`k-stash-add-row-${type}`);
  const newInp = document.getElementById(`k-stash-inline-input-${type}`);
  const newBtn = document.getElementById(`k-stash-add-btn-${type}`);
  if (newRow && newInp) {
    newRow.style.display = 'flex';
    if (newBtn) newBtn.classList.add('active');
    newInp.value = '';
    setTimeout(() => {
      newInp.focus();
    }, 40);
  }

  if (typeof showToast === 'function') showToast(`Added "${val}" to ${badgeName}! ✨`);
}
window.kSubmitColAdd = kSubmitColAdd;

function kCycleStashType(id, event) {
  if (event) event.stopPropagation();
  const data = storage.getKitchenData();
  const item = (data.stashItems || []).find(i => i.id === id);
  if (!item) return;

  const cycle = ['freezer', 'fridge', 'pantry'];
  const curIdx = cycle.indexOf(item.type);
  const nextType = cycle[(curIdx + 1) % cycle.length];
  item.type = nextType;
  item.badge = nextType === 'freezer' ? 'Freezer' : (nextType === 'fridge' ? 'Fridge' : 'Pantry');

  storage.saveKitchenData(data);
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Updated "${item.name}" to ${item.badge}`);
}
window.kCycleStashType = kCycleStashType;

function kToggleStashImmediate(id, event) {
  if (event) event.stopPropagation();
  const data = storage.getKitchenData();
  if (!Array.isArray(data.stashItems)) return;
  const item = data.stashItems.find(i => i.id === id);
  if (!item) return;

  item.immediate = !item.immediate;
  storage.saveKitchenData(data);
  renderKitchenPage();
  if (typeof showToast === 'function') {
    showToast(item.immediate ? `Marked "${item.name}" for immediate use! ⚡ (Moved to top)` : `Removed immediate use for "${item.name}"`);
  }
}
window.kToggleStashImmediate = kToggleStashImmediate;

function kToggleStashPlanned(id, event) {
  if (event) event.stopPropagation();
  const data = storage.getKitchenData();
  if (!Array.isArray(data.stashItems)) return;
  const item = data.stashItems.find(i => i.id === id);
  if (!item) return;

  const weekOffset = data.activeWeekOffset || 0;
  const schedule = kGetScheduleForWeekOffset(data, weekOffset);
  const autoPlanned = Boolean(kGetPlannedInfoForItem(item.name, schedule));

  if (item.planned === true) {
    item.planned = false;
  } else if (item.planned === false) {
    item.planned = true;
  } else {
    item.planned = !autoPlanned;
  }

  storage.saveKitchenData(data);
  renderKitchenPage();
  if (typeof showToast === 'function') {
    showToast(item.planned ? `Marked "${item.name}" as Planned for this week! 🗓️` : `Unmarked "${item.name}" from Planned`);
  }
}
window.kToggleStashPlanned = kToggleStashPlanned;

function kAssignStashDirect(name, type) {
  const data = storage.getKitchenData();
  if (Array.isArray(data.stashItems)) {
    const item = data.stashItems.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (item && !item.planned) {
      item.planned = true;
      storage.saveKitchenData(data);
    }
  }
  kOpenMealPicker(0, 'dinner');
  const nameEl = document.getElementById('k-modal-custom-name');
  if (nameEl) nameEl.value = name;
  const sourceEl = document.getElementById('k-modal-custom-source');
  if (sourceEl) sourceEl.value = type === 'freezer' ? 'freezer' : (type === 'fridge' ? 'fridge' : 'fresh');
}

function kCycleDaySource(dayIdx) {
  kCycleSlotSource(dayIdx, 'dinner');
}

function extractRecipeTitleFromUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return '';
  try {
    var clean = urlStr.trim();
    var path = clean.replace(/^[a-zA-Z]+:\/\/[^\/]+/, '');
    path = path.replace(/^[^\/]+\.[a-zA-Z]{2,}\//, '');
    path = path.split('?')[0].split('#')[0];
    path = path.replace(/\/+$/, '');
    var segments = path.split('/').filter(Boolean);
    if (!segments.length) return '';

    var slug = segments[segments.length - 1];
    if (/^\d+$/.test(slug) || /^(recipe|recipes|index|view|post)$/i.test(slug)) {
      if (segments.length > 1) slug = segments[segments.length - 2];
    }

    slug = slug.replace(/\.(html?|php|aspx)$/i, '');
    slug = slug.replace(/^\d+[-_]/, '');
    slug = slug.replace(/[-_]\d+$/, '');
    slug = slug.replace(/[-_]recipe$/i, '');

    var words;
    try {
      words = decodeURIComponent(slug).replace(/[-_+]/g, ' ').split(/\s+/).filter(Boolean);
    } catch (e) {
      words = slug.replace(/[-_+]/g, ' ').split(/\s+/).filter(Boolean);
    }
    if (!words.length) return '';

    var minorWords = { 'and':1, 'with':1, 'in':1, 'on':1, 'at':1, 'to':1, 'for':1, 'a':1, 'an':1, 'the':1, 'of':1, 'or':1, 'de':1 };
    return words.map(function(w, idx) {
      var lower = w.toLowerCase();
      if (idx > 0 && minorWords[lower]) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join(' ');
  } catch (e) {
    return '';
  }
}

function detectRecipeIcon(title, mealType = 'dinner') {
  const t = (title || '').toLowerCase();
  if (t.includes('dessert') || t.includes('cake') || t.includes('pie') || t.includes('tart') || t.includes('cookie') || t.includes('ice cream') || t.includes('brownie') || t.includes('pudding') || t.includes('crumble') || t.includes('chocolate') || t.includes('berry') || t.includes('parfait') || t.includes('mousse')) return 'dessert';
  if (t.includes('pancake') || t.includes('waffle') || t.includes('egg') || t.includes('omelet') || t.includes('frittata') || t.includes('toast') || t.includes('oat') || t.includes('granola') || t.includes('bagel') || t.includes('benedict') || t.includes('crepe') || t.includes('french toast') || t.includes('brunch')) return 'brunch';
  if (t.includes('salmon') || t.includes('fish') || t.includes('shrimp') || t.includes('tuna') || t.includes('cod') || t.includes('seafood') || t.includes('halibut') || t.includes('trout')) return 'salmon';
  if (t.includes('taco') || t.includes('burrito') || t.includes('fajita') || t.includes('mexican') || t.includes('enchilada') || t.includes('quesadilla')) return 'taco';
  if (t.includes('chicken') || t.includes('turkey') || t.includes('poultry') || t.includes('wing') || t.includes('thigh') || t.includes('roast chicken')) return 'chicken';
  if (t.includes('pasta') || t.includes('noodle') || t.includes('spaghetti') || t.includes('penne') || t.includes('ramen') || t.includes('lasagna') || t.includes('fettuccine') || t.includes('orzo')) return 'pasta';
  if (t.includes('risotto') || t.includes('stew') || t.includes('soup') || t.includes('chili') || t.includes('curry') || t.includes('dal') || t.includes('chowder')) return 'risotto';
  if (t.includes('dumpling') || t.includes('gyoza') || t.includes('wonton') || t.includes('potsticker') || t.includes('bao')) return 'dumplings';
  if (t.includes('pizza') || t.includes('flatbread')) return 'pizza';
  if (t.includes('salad') || t.includes('greens') || t.includes('slaw') || t.includes('caesar') || t.includes('broccoli') || t.includes('veggie') || t.includes('chip')) return 'salad';
  if (t.includes('takeout') || t.includes('thai') || t.includes('chinese') || t.includes('sushi') || t.includes('bento')) return 'takeout';
  if (mealType === 'dessert') return 'dessert';
  if (mealType === 'brunch') return 'brunch';
  if (mealType === 'lunch') return 'salad';
  return 'chicken';
}

function kOnRecipeUrlInput(val) {
  const titleInput = document.getElementById('k-new-fav-title');
  const hintEl = document.getElementById('k-title-hint');
  if (!titleInput) return;

  const extracted = extractRecipeTitleFromUrl(val);
  if (extracted) {
    titleInput.value = extracted;
    if (hintEl) hintEl.textContent = '(auto-pulled from URL ✨)';
  } else if (!val.trim()) {
    if (hintEl) hintEl.textContent = '(only for recipes without URL - otherwise auto-pulled)';
  }
}
window.kOnRecipeUrlInput = kOnRecipeUrlInput;

function kOpenMealPicker(dayIdx, mealType = 'dinner', itemIdx = null) {
  activeKitchenEditIdx = dayIdx;
  activeKitchenMealType = mealType;
  activeKitchenItemIdx = (typeof itemIdx === 'number' && itemIdx >= 0) ? itemIdx : null;

  if (mealType !== 'dinner') {
    kExpandedDayExtras.add(dayIdx);
    kExpandedDayExtras.delete(`closed_${dayIdx}`);
  }

  kSetModalMealType(mealType, false);

  const modal = document.getElementById('k-fast-meal-modal');
  if (modal) modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}
window.kOpenMealPicker = kOpenMealPicker;

function kSetModalMealType(newType, reFocus = true) {
  const isTypeChange = (newType !== activeKitchenMealType);
  activeKitchenMealType = newType;
  if (isTypeChange) {
    activeKitchenItemIdx = null;
  }
  const hiddenTypeEl = document.getElementById('k-modal-meal-type');
  if (hiddenTypeEl) hiddenTypeEl.value = newType;

  ['brunch', 'lunch', 'dinner', 'dessert'].forEach(t => {
    const btn = document.getElementById(`k-mtype-${t}`);
    if (btn) {
      if (t === newType) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  const data = storage.getKitchenData();
  const weekOffset = data.activeWeekOffset || 0;
  const schedule = kGetScheduleForWeekOffset(data, weekOffset);
  const d = (activeKitchenEditIdx !== null && schedule && schedule[activeKitchenEditIdx]) ? schedule[activeKitchenEditIdx] : { day: 'Day', date: '', meals: {} };
  const rawSlot = (d.meals && d.meals[newType]) ? d.meals[newType] : null;
  const items = Array.isArray(rawSlot) ? rawSlot : (rawSlot && rawSlot.meal ? [rawSlot] : []);
  const slot = (activeKitchenItemIdx !== null && items[activeKitchenItemIdx]) ? items[activeKitchenItemIdx] : null;

  const typeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
  const label = typeLabels[newType] || 'Meal';

  const titleEl = document.getElementById('k-fast-modal-title');
  if (titleEl) {
    const weekNote = weekOffset === 1 ? ' (Upcoming Week)' : '';
    const actionLabel = slot ? 'Edit' : 'Add';
    titleEl.textContent = `${actionLabel} ${label} · ${d.day}${d.date ? ` (${d.date})` : ''}${weekNote}`;
  }

  const nameEl = document.getElementById('k-modal-custom-name');
  if (nameEl) nameEl.value = slot ? (slot.meal || '') : '';

  const urlEl = document.getElementById('k-modal-custom-url');
  if (urlEl) urlEl.value = slot ? (slot.recipeUrl || '') : '';

  const sourceEl = document.getElementById('k-modal-custom-source');
  if (sourceEl) sourceEl.value = (slot && slot.source === 'out') ? 'out' : 'fresh';

  const submitBtn = document.getElementById('k-modal-submit-btn');
  if (submitBtn) submitBtn.textContent = slot ? `Update ${label}` : `Add to ${label}`;

  const clearBtn = document.getElementById('k-modal-clear-btn');
  if (clearBtn) {
    clearBtn.textContent = 'Delete Dish';
    clearBtn.style.display = slot ? 'inline-block' : 'none';
  }

  const copyMoveBtn = document.getElementById('k-modal-copy-move-btn');
  if (copyMoveBtn) {
    copyMoveBtn.style.display = slot ? 'inline-block' : 'none';
  }

  // Populate favorites picker items
  const favsContainer = document.getElementById('k-modal-favs-list');
  if (favsContainer) {
    const favs = data.favoriteRecipes || [];
    if (favs.length > 0) {
      favsContainer.innerHTML = favs.map(r => `
        <div class="k-modal-pick-item" onclick="kSelectFavForMeal('${r.id}')">
          <div style="font-weight:600; color:var(--text-primary);">${escapeHtml(r.title)}</div>
          <span style="font-size:11px; color:var(--text-muted);">${escapeHtml((() => {
            const courseLabel = { main: 'Main 🍲', side: 'Side 🥗', brunch: 'Brunch ☕', dessert: 'Dessert 🍨' }[r.course || 'main'] || 'Main';
            const extra = (r.tags || []).filter(t => !['main', 'side', 'brunch', 'dessert', 'favorite'].includes(String(t).toLowerCase()));
            return [courseLabel, ...extra].join(' · ');
          })())}</span>
        </div>
      `).join('');
    } else {
      favsContainer.innerHTML = `<div style="font-size:12px; color:var(--text-muted); padding:6px 0;">No saved favorites yet.</div>`;
    }
  }

  if (reFocus && nameEl) nameEl.focus();
}
window.kSetModalMealType = kSetModalMealType;

function kSubmitCustomMeal() {
  if (activeKitchenEditIdx === null) return;
  const name = document.getElementById('k-modal-custom-name').value.trim();
  const url = document.getElementById('k-modal-custom-url').value.trim();
  const source = document.getElementById('k-modal-custom-source').value;
  const mealType = activeKitchenMealType || 'dinner';

  const data = storage.getKitchenData();
  const weekOffset = data.activeWeekOffset || 0;
  const schedule = kGetScheduleForWeekOffset(data, weekOffset);

  if (!Array.isArray(schedule) || !schedule[activeKitchenEditIdx]) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    while (schedule.length < 7) {
      const idx = schedule.length;
      schedule.push({ day: dayNames[idx], date: '', meal: '', source: 'fresh', icon: 'chicken', meals: { brunch: [], lunch: [], dinner: [], dessert: [] } });
    }
  }
  const d = schedule[activeKitchenEditIdx];
  if (!d.meals) d.meals = { brunch: [], lunch: [], dinner: [], dessert: [] };
  ['brunch', 'lunch', 'dinner', 'dessert'].forEach(t => {
    if (!Array.isArray(d.meals[t])) {
      d.meals[t] = (d.meals[t] && d.meals[t].meal) ? [d.meals[t]] : [];
    }
  });

  const typeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
  const label = typeLabels[mealType] || 'Meal';

  if (name) {
    const icon = source === 'out' ? (mealType === 'dessert' ? 'dessert' : (d.day === 'Sat' ? 'bistro' : 'takeout')) : detectRecipeIcon(name, mealType);
    const newDish = {
      meal: name,
      recipeUrl: url,
      source: source,
      icon: icon,
      favoriteId: null
    };

    if (activeKitchenItemIdx !== null && activeKitchenItemIdx >= 0 && activeKitchenItemIdx < d.meals[mealType].length) {
      if (d.meals[mealType][activeKitchenItemIdx].favoriteId) {
        newDish.favoriteId = d.meals[mealType][activeKitchenItemIdx].favoriteId;
      }
      d.meals[mealType][activeKitchenItemIdx] = newDish;
    } else {
      d.meals[mealType].push(newDish);
    }

    if (mealType === 'dinner' && d.meals.dinner.length > 0) {
      d.meal = d.meals.dinner[0].meal;
      d.recipeUrl = d.meals.dinner[0].recipeUrl || '';
      d.source = d.meals.dinner[0].source || 'fresh';
      d.icon = d.meals.dinner[0].icon || 'chicken';
    }
  } else if (activeKitchenItemIdx !== null && activeKitchenItemIdx >= 0 && activeKitchenItemIdx < d.meals[mealType].length) {
    d.meals[mealType].splice(activeKitchenItemIdx, 1);
    if (mealType === 'dinner') {
      if (d.meals.dinner.length > 0) {
        d.meal = d.meals.dinner[0].meal;
        d.recipeUrl = d.meals.dinner[0].recipeUrl || '';
        d.source = d.meals.dinner[0].source || 'fresh';
        d.icon = d.meals.dinner[0].icon || 'chicken';
      } else {
        d.meal = '';
        d.recipeUrl = '';
      }
    }
  }

  storage.saveKitchenData(data);
  kCloseModal();
  renderKitchenPage();
  if (typeof showToast === 'function') {
    showToast(name ? `Saved ${d.day} ${label}! ✨` : `Removed dish from ${d.day} ${label}`);
  }
}
window.kSubmitCustomMeal = kSubmitCustomMeal;

function kClearCurrentMealSlot() {
  if (activeKitchenEditIdx === null) return;
  const mealType = activeKitchenMealType || 'dinner';
  const data = storage.getKitchenData();
  const weekOffset = data.activeWeekOffset || 0;
  const schedule = kGetScheduleForWeekOffset(data, weekOffset);
  const d = schedule[activeKitchenEditIdx];

  if (d && d.meals) {
    ['brunch', 'lunch', 'dinner', 'dessert'].forEach(t => {
      if (!Array.isArray(d.meals[t])) {
        d.meals[t] = (d.meals[t] && d.meals[t].meal) ? [d.meals[t]] : [];
      }
    });

    if (activeKitchenItemIdx !== null && activeKitchenItemIdx >= 0 && activeKitchenItemIdx < d.meals[mealType].length) {
      d.meals[mealType].splice(activeKitchenItemIdx, 1);
    } else {
      d.meals[mealType] = [];
    }

    if (mealType === 'dinner') {
      if (d.meals.dinner.length > 0) {
        d.meal = d.meals.dinner[0].meal;
        d.recipeUrl = d.meals.dinner[0].recipeUrl || '';
        d.source = d.meals.dinner[0].source || 'fresh';
        d.icon = d.meals.dinner[0].icon || 'chicken';
      } else {
        d.meal = '';
        d.recipeUrl = '';
      }
    }
  }

  const typeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
  const label = typeLabels[mealType] || 'Meal';

  storage.saveKitchenData(data);
  kCloseModal();
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Removed dish from ${d.day} ${label}`);
}
window.kClearCurrentMealSlot = kClearCurrentMealSlot;

function kDeleteMealItem(dayIdx, mealType, itemIdx, event) {
  if (event) event.stopPropagation();
  const data = storage.getKitchenData();
  const weekOffset = data.activeWeekOffset || 0;
  const schedule = kGetScheduleForWeekOffset(data, weekOffset);
  const d = schedule[dayIdx];
  if (!d || !d.meals) return;

  if (!Array.isArray(d.meals[mealType])) {
    d.meals[mealType] = (d.meals[mealType] && d.meals[mealType].meal) ? [d.meals[mealType]] : [];
  }

  const removed = d.meals[mealType].splice(itemIdx, 1);
  if (mealType === 'dinner') {
    if (d.meals.dinner.length > 0) {
      d.meal = d.meals.dinner[0].meal;
      d.recipeUrl = d.meals.dinner[0].recipeUrl || '';
      d.source = d.meals.dinner[0].source || 'fresh';
      d.icon = d.meals.dinner[0].icon || 'chicken';
    } else {
      d.meal = '';
      d.recipeUrl = '';
    }
  }

  storage.saveKitchenData(data);
  renderKitchenPage();
  const removedName = (removed && removed[0] && removed[0].meal) ? `"${removed[0].meal}"` : 'Dish';
  if (typeof showToast === 'function') showToast(`Removed ${removedName} from ${d.day}`);
}
window.kDeleteMealItem = kDeleteMealItem;

function kSelectStashForMeal(name, type) {
  if (activeKitchenEditIdx === null) return;
  const mealType = activeKitchenMealType || 'dinner';
  const data = storage.getKitchenData();
  const weekOffset = data.activeWeekOffset || 0;
  const schedule = kGetScheduleForWeekOffset(data, weekOffset);
  const d = schedule[activeKitchenEditIdx];
  if (!d) return;
  if (!d.meals) d.meals = { brunch: [], lunch: [], dinner: [], dessert: [] };
  ['brunch', 'lunch', 'dinner', 'dessert'].forEach(t => {
    if (!Array.isArray(d.meals[t])) {
      d.meals[t] = (d.meals[t] && d.meals[t].meal) ? [d.meals[t]] : [];
    }
  });

  const icon = type === 'freezer' ? 'salmon' : 'risotto';
  const effectiveSource = 'fresh';
  const newDish = {
    meal: name,
    source: effectiveSource,
    icon: icon,
    recipeUrl: '',
    favoriteId: null
  };

  if (activeKitchenItemIdx !== null && activeKitchenItemIdx >= 0 && activeKitchenItemIdx < d.meals[mealType].length) {
    d.meals[mealType][activeKitchenItemIdx] = newDish;
  } else {
    d.meals[mealType].push(newDish);
  }

  if (Array.isArray(data.stashItems)) {
    const sItem = data.stashItems.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (sItem && !sItem.planned) {
      sItem.planned = true;
    }
  }

  if (mealType === 'dinner' && d.meals.dinner.length > 0) {
    d.meal = d.meals.dinner[0].meal;
    d.source = d.meals.dinner[0].source || 'fresh';
    d.icon = d.meals.dinner[0].icon || icon;
    d.recipeUrl = '';
  }

  storage.saveKitchenData(data);
  kCloseModal();
  renderKitchenPage();
  const typeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
  if (typeof showToast === 'function') showToast(`Assigned ${name} to ${d.day} ${typeLabels[mealType] || 'Meal'}! ✨`);
}
window.kSelectStashForMeal = kSelectStashForMeal;

function kSelectFavForMeal(favId) {
  if (activeKitchenEditIdx === null) return;
  const mealType = activeKitchenMealType || 'dinner';
  const data = storage.getKitchenData();
  const fav = (data.favoriteRecipes || []).find(r => r.id === favId);
  if (!fav) return;

  const weekOffset = data.activeWeekOffset || 0;
  const schedule = kGetScheduleForWeekOffset(data, weekOffset);
  const d = schedule[activeKitchenEditIdx];
  if (!d) return;
  if (!d.meals) d.meals = { brunch: [], lunch: [], dinner: [], dessert: [] };
  ['brunch', 'lunch', 'dinner', 'dessert'].forEach(t => {
    if (!Array.isArray(d.meals[t])) {
      d.meals[t] = (d.meals[t] && d.meals[t].meal) ? [d.meals[t]] : [];
    }
  });

  const source = (fav.tags || []).some(t => t.includes('Takeout')) ? 'out' : 'fresh';
  const newDish = {
    meal: fav.title,
    icon: fav.icon || detectRecipeIcon(fav.title, mealType),
    recipeUrl: fav.recipeUrl || '',
    source: source,
    favoriteId: fav.id
  };

  if (activeKitchenItemIdx !== null && activeKitchenItemIdx >= 0 && activeKitchenItemIdx < d.meals[mealType].length) {
    d.meals[mealType][activeKitchenItemIdx] = newDish;
  } else {
    d.meals[mealType].push(newDish);
  }

  if (mealType === 'dinner' && d.meals.dinner.length > 0) {
    d.meal = d.meals.dinner[0].meal;
    d.icon = d.meals.dinner[0].icon;
    d.recipeUrl = d.meals.dinner[0].recipeUrl || '';
    d.source = d.meals.dinner[0].source || 'fresh';
  }

  storage.saveKitchenData(data);
  kCloseModal();
  renderKitchenPage();
  const typeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
  if (typeof showToast === 'function') showToast(`Assigned ${fav.title} to ${d.day} ${typeLabels[mealType] || 'Meal'}! ✨`);
}
window.kSelectFavForMeal = kSelectFavForMeal;

function kCycleSlotSource(dayIdx, mealType, itemIdx = 0, event) {
  if (event) event.stopPropagation();
  const data = storage.getKitchenData();
  const weekOffset = data.activeWeekOffset || 0;
  const schedule = kGetScheduleForWeekOffset(data, weekOffset);
  const d = schedule[dayIdx];
  if (!d || !d.meals) return;

  const items = Array.isArray(d.meals[mealType]) ? d.meals[mealType] : (d.meals[mealType] && d.meals[mealType].meal ? [d.meals[mealType]] : []);
  const slot = items[itemIdx];
  if (!slot) return;

  const cycle = ['fresh', 'out'];
  const curIdx = cycle.indexOf(slot.source);
  const nextSource = cycle[(curIdx + 1) % cycle.length];
  slot.source = nextSource;

  if (nextSource === 'out') {
    slot.icon = (mealType === 'dessert') ? 'dessert' : (d.day === 'Sat' ? 'bistro' : 'takeout');
  } else {
    slot.icon = detectRecipeIcon(slot.meal, mealType);
  }

  if (mealType === 'dinner' && itemIdx === 0) {
    d.source = slot.source;
    d.icon = slot.icon;
  }

  storage.saveKitchenData(data);
  renderKitchenPage();
}
window.kCycleSlotSource = kCycleSlotSource;

function kToggleFavSlot(dayIdx, mealType, itemIdx = 0, event) {
  if (event) event.stopPropagation();
  const data = storage.getKitchenData();
  const weekOffset = data.activeWeekOffset || 0;
  const schedule = kGetScheduleForWeekOffset(data, weekOffset);
  const d = schedule[dayIdx];
  const items = (d && d.meals && Array.isArray(d.meals[mealType])) ? d.meals[mealType] : (d && d.meals && d.meals[mealType] && d.meals[mealType].meal ? [d.meals[mealType]] : []);
  const slot = items[itemIdx] || (mealType === 'dinner' && d && d.meal ? { meal: d.meal, source: d.source || 'fresh', icon: d.icon || 'chicken', recipeUrl: d.recipeUrl || '' } : null);

  if (!slot || !slot.meal) {
    kOpenMealPicker(dayIdx, mealType, null);
    return;
  }

  const normMeal = slot.meal.toLowerCase().trim();
  const favIdx = (data.favoriteRecipes || []).findIndex(r => (r.title || '').toLowerCase().trim() === normMeal);
  if (favIdx !== -1) {
    data.favoriteRecipes.splice(favIdx, 1);
    storage.saveKitchenData(data);
    renderKitchenPage();
    if (typeof showToast === 'function') showToast(`Removed "${slot.meal}" from Recipe Vault`);
  } else {
    if (!data.favoriteRecipes) data.favoriteRecipes = [];
    const course = (mealType === 'dessert') ? 'dessert' : (mealType === 'brunch' ? 'brunch' : 'main');
    data.favoriteRecipes.push({
      id: 'r-' + Date.now(),
      title: slot.meal,
      icon: slot.icon || (slot.source === 'out' ? 'takeout' : 'chicken'),
      course: course,
      tags: [],
      recipeUrl: slot.recipeUrl || '',
      ingredients: '',
      stashMatch: null
    });
    storage.saveKitchenData(data);
    renderKitchenPage();
    if (typeof showToast === 'function') showToast(`Saved "${slot.meal}" to Recipe Vault! 💜`);
    if (typeof confetti === 'function') {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 }, colors: ['#8B5CF6', '#6D28D9', '#0D98BA', '#C084FC'] });
    }
  }
}
window.kToggleFavSlot = kToggleFavSlot;

function kToggleFavoriteDayMeal(dayIdx) {
  kToggleFavSlot(dayIdx, 'dinner', 0);
}
window.kToggleFavoriteDayMeal = kToggleFavoriteDayMeal;

function kAssignFavToMeal(favId, targetStr) {
  if (!targetStr) return;
  const parts = targetStr.split(':');
  let weekOffset = 0;
  let dayIdx = 0;
  let mealType = 'dinner';

  if (parts.length === 3) {
    weekOffset = parseInt(parts[0], 10);
    dayIdx = parseInt(parts[1], 10);
    mealType = parts[2] || 'dinner';
  } else {
    dayIdx = parseInt(parts[0], 10);
    mealType = parts[1] || 'dinner';
    const curData = storage.getKitchenData();
    weekOffset = curData.activeWeekOffset || 0;
  }

  const data = storage.getKitchenData();
  const fav = (data.favoriteRecipes || []).find(r => r.id === favId);
  if (!fav) return;

  const schedule = kGetScheduleForWeekOffset(data, weekOffset);
  const d = schedule[dayIdx];
  if (!d) return;
  if (!d.meals) d.meals = { brunch: [], lunch: [], dinner: [], dessert: [] };
  ['brunch', 'lunch', 'dinner', 'dessert'].forEach(t => {
    if (!Array.isArray(d.meals[t])) {
      d.meals[t] = (d.meals[t] && d.meals[t].meal) ? [d.meals[t]] : [];
    }
  });

  const source = (fav.tags || []).some(t => t.includes('Takeout')) ? 'out' : 'fresh';

  const newDish = {
    meal: fav.title,
    source: source,
    icon: fav.icon || detectRecipeIcon(fav.title, mealType),
    recipeUrl: fav.recipeUrl || '',
    favoriteId: fav.id
  };
  d.meals[mealType].push(newDish);

  if (mealType === 'dinner' && d.meals.dinner.length > 0) {
    d.meal = d.meals.dinner[0].meal;
    d.source = d.meals.dinner[0].source || 'fresh';
    d.icon = d.meals.dinner[0].icon;
    d.recipeUrl = d.meals.dinner[0].recipeUrl || '';
    d.favoriteId = d.meals.dinner[0].favoriteId;
  }

  data.activeWeekOffset = weekOffset;
  storage.saveKitchenData(data);
  renderKitchenPage();
  const label = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' }[mealType] || 'Meal';
  const weekLabel = weekOffset === 1 ? ' (Upcoming Week)' : '';
  if (typeof showToast === 'function') showToast(`Assigned "${fav.title}" to ${d.day} ${label}${weekLabel}! ✨`);
}
window.kAssignFavToMeal = kAssignFavToMeal;

function kAssignFavToDay(favId, dayIdxStr) {
  kAssignFavToMeal(favId, `${dayIdxStr}:dinner`);
}
window.kAssignFavToDay = kAssignFavToDay;

function kDeleteFavorite(favId, event) {
  if (event) event.stopPropagation();
  const data = storage.getKitchenData();
  const fav = (data.favoriteRecipes || []).find(r => r.id === favId);
  const title = fav ? fav.title : 'recipe';
  data.favoriteRecipes = (data.favoriteRecipes || []).filter(r => r.id !== favId);
  storage.saveKitchenData(data);
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Removed "${title}" from Favorites`);
}
window.kDeleteFavorite = kDeleteFavorite;

function kSetVaultFilter(filter) {
  const data = storage.getKitchenData();
  data.vaultFilter = filter;
  storage.saveKitchenData(data);
  renderKitchenPage();
}
window.kSetVaultFilter = kSetVaultFilter;

function kSetRecipeCourse(course) {
  const hiddenEl = document.getElementById('k-new-recipe-course');
  if (hiddenEl) hiddenEl.value = course;
  ['main', 'side', 'brunch', 'dessert'].forEach(c => {
    const btn = document.getElementById(`k-rcourse-${c}`);
    if (btn) {
      if (c === course) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
}
window.kSetRecipeCourse = kSetRecipeCourse;

function kSetRecipeDest(dest) {
  const hiddenEl = document.getElementById('k-new-recipe-dest');
  if (hiddenEl) hiddenEl.value = dest;
  ['vault', 'new'].forEach(d => {
    const btn = document.getElementById(`k-rdest-${d}`);
    if (btn) {
      if (d === dest) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
  const submitBtn = document.getElementById('k-add-recipe-submit-btn');
  if (submitBtn) {
    submitBtn.textContent = dest === 'new' ? 'Save to New Recipes Queue' : 'Save Recipe to Vault';
  }
}
window.kSetRecipeDest = kSetRecipeDest;

function kOpenAddFavModal(preselectedDest = 'vault') {
  const urlEl = document.getElementById('k-new-fav-url');
  const titleEl = document.getElementById('k-new-fav-title');
  const notesEl = document.getElementById('k-new-fav-ingredients');
  const hintEl = document.getElementById('k-title-hint');

  if (urlEl) urlEl.value = '';
  if (titleEl) titleEl.value = '';
  if (notesEl) notesEl.value = '';
  if (hintEl) hintEl.textContent = '(only for recipes without URL - otherwise auto-pulled)';

  kSetRecipeCourse('main');
  kSetRecipeDest(preselectedDest);

  const modal = document.getElementById('k-add-fav-modal');
  if (modal) modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}
window.kOpenAddFavModal = kOpenAddFavModal;

function kSubmitNewFavorite() {
  const urlEl = document.getElementById('k-new-fav-url');
  const titleEl = document.getElementById('k-new-fav-title');
  const notesEl = document.getElementById('k-new-fav-ingredients');
  const courseEl = document.getElementById('k-new-recipe-course');
  const destEl = document.getElementById('k-new-recipe-dest');

  const url = urlEl ? urlEl.value.trim() : '';
  let title = titleEl ? titleEl.value.trim() : '';
  const notes = notesEl ? notesEl.value.trim() : '';
  const course = (courseEl ? courseEl.value : '') || 'main';
  const dest = (destEl ? destEl.value : '') || 'vault';

  if (!title && url) {
    title = extractRecipeTitleFromUrl(url);
  }

  if (!title && !url) {
    if (typeof showToast === 'function') showToast('Please enter a recipe URL or Title');
    if (titleEl) titleEl.focus();
    return;
  }

  if (!title) {
    try {
      let clean = url;
      if (!/^https?:\/\//i.test(clean)) clean = 'https://' + clean;
      const u = new URL(clean);
      title = 'Recipe from ' + u.hostname.replace(/^www\./, '');
    } catch (e) {
      title = 'Saved Recipe';
    }
  }

  const icon = detectRecipeIcon(title, course === 'dessert' ? 'dessert' : (course === 'brunch' ? 'brunch' : 'dinner'));
  const data = storage.getKitchenData();

  const newEntry = {
    id: 'r-' + Date.now(),
    title: title,
    icon: icon,
    course: course,
    tags: [],
    recipeUrl: url,
    ingredients: notes,
    stashMatch: null
  };

  if (dest === 'new') {
    if (!Array.isArray(data.newRecipes)) data.newRecipes = [];
    data.newRecipes.push(newEntry);
    storage.saveKitchenData(data);
    kCloseAddFavModal();
    renderKitchenPage();
    if (typeof showToast === 'function') showToast(`Added "${title}" to New Recipes Queue! 🧪`);
  } else {
    if (!Array.isArray(data.favoriteRecipes)) data.favoriteRecipes = [];
    data.favoriteRecipes.push(newEntry);
    storage.saveKitchenData(data);
    kCloseAddFavModal();
    renderKitchenPage();
    if (typeof showToast === 'function') showToast(`Added "${title}" to Favorites Vault! 💜`);
    if (typeof confetti === 'function') {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 }, colors: ['#8B5CF6', '#6D28D9', '#0D98BA', '#C084FC'] });
    }
  }
}
window.kSubmitNewFavorite = kSubmitNewFavorite;

function kMoveNewRecipeToVault(id) {
  const data = storage.getKitchenData();
  if (!Array.isArray(data.newRecipes)) data.newRecipes = [];
  const idx = data.newRecipes.findIndex(r => r.id === id);
  if (idx === -1) return;

  const item = data.newRecipes.splice(idx, 1)[0];
  if (!Array.isArray(data.favoriteRecipes)) data.favoriteRecipes = [];
  data.favoriteRecipes.push(item);

  storage.saveKitchenData(data);
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Moved "${item.title}" to Favorites Vault! 💜`);
  if (typeof confetti === 'function') {
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 }, colors: ['#8B5CF6', '#6D28D9', '#0D98BA', '#C084FC'] });
  }
}
window.kMoveNewRecipeToVault = kMoveNewRecipeToVault;

function kDeleteNewRecipe(id, event) {
  if (event) event.stopPropagation();
  const data = storage.getKitchenData();
  if (!Array.isArray(data.newRecipes)) return;
  const item = data.newRecipes.find(r => r.id === id);
  const title = item ? item.title : 'recipe';
  data.newRecipes = data.newRecipes.filter(r => r.id !== id);
  storage.saveKitchenData(data);
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Deleted "${title}" from New Recipes`);
}
window.kDeleteNewRecipe = kDeleteNewRecipe;

function kAssignNewRecipeToMeal(id, targetStr) {
  if (!targetStr) return;
  const parts = targetStr.split(':');
  let weekOffset = 0;
  let dayIdx = 0;
  let mealType = 'dinner';

  if (parts.length === 3) {
    weekOffset = parseInt(parts[0], 10);
    dayIdx = parseInt(parts[1], 10);
    mealType = parts[2] || 'dinner';
  } else {
    dayIdx = parseInt(parts[0], 10);
    mealType = parts[1] || 'dinner';
    const curData = storage.getKitchenData();
    weekOffset = curData.activeWeekOffset || 0;
  }

  const data = storage.getKitchenData();
  const item = (data.newRecipes || []).find(r => r.id === id);
  if (!item) return;

  const schedule = kGetScheduleForWeekOffset(data, weekOffset);
  const d = schedule[dayIdx];
  if (!d) return;
  if (!d.meals) d.meals = { brunch: [], lunch: [], dinner: [], dessert: [] };
  ['brunch', 'lunch', 'dinner', 'dessert'].forEach(t => {
    if (!Array.isArray(d.meals[t])) {
      d.meals[t] = (d.meals[t] && d.meals[t].meal) ? [d.meals[t]] : [];
    }
  });

  const newDish = {
    meal: item.title,
    source: 'fresh',
    icon: item.icon || detectRecipeIcon(item.title, mealType),
    recipeUrl: item.recipeUrl || '',
    favoriteId: null
  };
  d.meals[mealType].push(newDish);

  if (mealType === 'dinner' && d.meals.dinner.length > 0) {
    d.meal = d.meals.dinner[0].meal;
    d.source = 'fresh';
    d.icon = d.meals.dinner[0].icon;
    d.recipeUrl = item.recipeUrl || '';
  }

  data.activeWeekOffset = weekOffset;
  storage.saveKitchenData(data);
  renderKitchenPage();
  const label = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' }[mealType] || 'Meal';
  const weekLabel = weekOffset === 1 ? ' (Upcoming Week)' : '';
  if (typeof showToast === 'function') showToast(`Assigned "${item.title}" to ${d.day} ${label}${weekLabel}! ✨`);
}
window.kAssignNewRecipeToMeal = kAssignNewRecipeToMeal;

function kCycleRecipeCourse(id, collection, event) {
  if (event) event.stopPropagation();
  const data = storage.getKitchenData();
  const list = collection === 'new' ? data.newRecipes : data.favoriteRecipes;
  if (!Array.isArray(list)) return;
  const r = list.find(item => item.id === id);
  if (!r) return;

  const cycle = ['main', 'side', 'brunch', 'dessert'];
  const curIdx = cycle.indexOf(r.course || 'main');
  r.course = cycle[(curIdx + 1) % cycle.length];

  if (Array.isArray(r.tags)) {
    r.tags = r.tags.filter(t => !['main', 'side', 'brunch', 'dessert', 'favorite'].includes(String(t).toLowerCase()));
  }

  storage.saveKitchenData(data);
  renderKitchenPage();
  const labels = { main: 'Main 🍲', side: 'Side 🥗', brunch: 'Brunch ☕', dessert: 'Dessert 🍨' };
  if (typeof showToast === 'function') showToast(`Updated "${r.title}" to ${labels[r.course]}`);
}
window.kCycleRecipeCourse = kCycleRecipeCourse;

function kCloseModal() {
  const m = document.getElementById('k-fast-meal-modal');
  if (m) m.classList.remove('active');
}

function kCloseAddFavModal() {
  const m = document.getElementById('k-add-fav-modal');
  if (m) m.classList.remove('active');
}

/* ==========================================================================
   Quick Assign Recipe Modal Controller (Interactive 1-Tap Scheduling)
   ========================================================================== */
let assignModalRecipeId = null;
let assignModalCollection = 'vault';
let assignModalWeekOffset = 0;
let assignModalMealType = 'dinner';

function kOpenAssignModal(recipeId, collection = 'vault') {
  assignModalRecipeId = recipeId;
  assignModalCollection = collection;

  const data = storage.getKitchenData();
  assignModalWeekOffset = data.activeWeekOffset || 0;

  const list = collection === 'new' ? (data.newRecipes || []) : (data.favoriteRecipes || []);
  const recipe = list.find(r => r.id === recipeId);
  if (!recipe) return;

  // Auto-pick appropriate meal type based on recipe course
  if (recipe.course === 'dessert') {
    assignModalMealType = 'dessert';
  } else if (recipe.course === 'brunch') {
    assignModalMealType = 'brunch';
  } else if (recipe.course === 'side') {
    assignModalMealType = 'dinner';
  } else {
    assignModalMealType = 'dinner';
  }

  const titleEl = document.getElementById('k-assign-modal-title');
  if (titleEl) titleEl.textContent = `Assign "${recipe.title}"`;

  const subEl = document.getElementById('k-assign-modal-subtitle');
  if (subEl) subEl.textContent = `Choose week & meal slot, then tap a day`;

  kSyncAssignModalToggles();
  kRenderAssignModalDays();

  const modal = document.getElementById('k-assign-recipe-modal');
  if (modal) modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}
window.kOpenAssignModal = kOpenAssignModal;

function kCloseAssignModal() {
  const modal = document.getElementById('k-assign-recipe-modal');
  if (modal) modal.classList.remove('active');
  assignModalRecipeId = null;
}
window.kCloseAssignModal = kCloseAssignModal;

function kSetAssignModalWeek(offset) {
  assignModalWeekOffset = offset;
  kSyncAssignModalToggles();
  kRenderAssignModalDays();
}
window.kSetAssignModalWeek = kSetAssignModalWeek;

function kSetAssignModalMealType(type) {
  assignModalMealType = type;
  kSyncAssignModalToggles();
  kRenderAssignModalDays();
}
window.kSetAssignModalMealType = kSetAssignModalMealType;

function kSyncAssignModalToggles() {
  [0, 1].forEach(w => {
    const btn = document.getElementById(`k-assign-week-${w}`);
    if (btn) {
      if (w === assignModalWeekOffset) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  ['dinner', 'lunch', 'brunch', 'dessert'].forEach(t => {
    const btn = document.getElementById(`k-assign-mtype-${t}`);
    if (btn) {
      if (t === assignModalMealType) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
}

function kRenderAssignModalDays() {
  const container = document.getElementById('k-assign-days-grid');
  if (!container) return;

  const data = storage.getKitchenData();
  const schedule = kGetScheduleForWeekOffset(data, assignModalWeekOffset);

  const now = new Date();
  const dayOfWeek = now.getDay();
  const baseSun = new Date(now);
  baseSun.setDate(now.getDate() - dayOfWeek);
  const targetSun = new Date(baseSun);
  targetSun.setDate(baseSun.getDate() + (assignModalWeekOffset * 7));

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cardsHtml = dayNames.map((name, idx) => {
    const d = new Date(targetSun);
    d.setDate(targetSun.getDate() + idx);
    const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const dayObj = schedule.find(s => s.day === name) || schedule[idx] || {};
    const rawSlot = (dayObj.meals && dayObj.meals[assignModalMealType]) ? dayObj.meals[assignModalMealType] : null;
    const items = Array.isArray(rawSlot) ? rawSlot.filter(i => i && i.meal) : (rawSlot && rawSlot.meal ? [rawSlot] : []);
    if (items.length === 0 && assignModalMealType === 'dinner' && dayObj.meal) {
      items.push({ meal: dayObj.meal });
    }
    const hasMeal = items.length > 0;

    let summaryText = '+ Open slot';
    if (items.length === 1) {
      summaryText = escapeHtml(items[0].meal);
    } else if (items.length > 1) {
      summaryText = `${items.length} dishes (${escapeHtml(items[0].meal)}, +${items.length - 1})`;
    }

    return `
      <button type="button" class="k-assign-day-card" onclick="kConfirmAssignFromModal(${idx})">
        <div class="day-head">
          <span class="day-name">${name}</span>
          <span class="day-date">${dateLabel}</span>
        </div>
        <div class="day-current ${hasMeal ? '' : 'empty'}">
          ${summaryText}
        </div>
      </button>
    `;
  }).join('');

  container.innerHTML = cardsHtml;
}

function kConfirmAssignFromModal(dayIdx) {
  if (!assignModalRecipeId) return;
  const targetStr = `${assignModalWeekOffset}:${dayIdx}:${assignModalMealType}`;
  if (assignModalCollection === 'new') {
    kAssignNewRecipeToMeal(assignModalRecipeId, targetStr);
  } else {
    kAssignFavToMeal(assignModalRecipeId, targetStr);
  }
  kCloseAssignModal();
}
window.kConfirmAssignFromModal = kConfirmAssignFromModal;

/* ==========================================================================
   Copy or Move Meal Controller (1-Tap Rescheduling & Duplicating)
   ========================================================================== */
let copyMoveState = {
  sourceWeekOffset: 0,
  sourceDayIdx: 0,
  sourceMealType: 'dinner',
  sourceItemIdx: 0,
  sourceDish: null,
  action: 'move', // 'move', 'copy', 'swap'
  targetWeekOffset: 0,
  targetMealType: 'dinner'
};

function kOpenCopyMoveModal(dayIdx, mealType = 'dinner', itemIdx = 0, event = null) {
  if (event) event.stopPropagation();

  const data = storage.getKitchenData();
  const weekOffset = (typeof data.activeWeekOffset === 'number') ? data.activeWeekOffset : 0;
  const schedule = kGetScheduleForWeekOffset(data, weekOffset);
  const dayObj = schedule[dayIdx];
  if (!dayObj) return;

  const rawSlot = (dayObj.meals && dayObj.meals[mealType]) ? dayObj.meals[mealType] : null;
  let items = Array.isArray(rawSlot) ? rawSlot.filter(i => i && i.meal) : (rawSlot && rawSlot.meal ? [rawSlot] : []);
  if (items.length === 0 && mealType === 'dinner' && dayObj.meal) {
    items = [{
      meal: dayObj.meal,
      source: dayObj.source || 'fresh',
      icon: dayObj.icon || 'chicken',
      recipeUrl: dayObj.recipeUrl || '',
      favoriteId: dayObj.favoriteId || null
    }];
  }

  const effectiveIdx = (typeof itemIdx === 'number' && itemIdx >= 0 && itemIdx < items.length) ? itemIdx : 0;
  const dish = items[effectiveIdx];
  if (!dish || !dish.meal) return;

  copyMoveState = {
    sourceWeekOffset: weekOffset,
    sourceDayIdx: dayIdx,
    sourceMealType: mealType,
    sourceItemIdx: effectiveIdx,
    sourceDish: dish,
    action: 'move',
    targetWeekOffset: weekOffset,
    targetMealType: mealType
  };

  const nameEl = document.getElementById('k-copymove-dish-name');
  if (nameEl) nameEl.textContent = dish.meal;

  const typeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
  const fromEl = document.getElementById('k-copymove-from-label');
  if (fromEl) {
    const weekNote = weekOffset === 1 ? ' (Upcoming)' : '';
    fromEl.textContent = `${dayObj.day} · ${typeLabels[mealType] || 'Dinner'}${weekNote}`;
  }

  kSyncCopyMoveToggles();
  kRenderCopyMoveDays();

  const modal = document.getElementById('k-copy-move-modal');
  if (modal) modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}
window.kOpenCopyMoveModal = kOpenCopyMoveModal;

function kCloseCopyMoveModal() {
  const modal = document.getElementById('k-copy-move-modal');
  if (modal) modal.classList.remove('active');
}
window.kCloseCopyMoveModal = kCloseCopyMoveModal;

function kOpenCopyMoveFromFastModal() {
  if (activeKitchenEditIdx === null) return;
  const dayIdx = activeKitchenEditIdx;
  const mealType = activeKitchenMealType || 'dinner';
  const itemIdx = (typeof activeKitchenItemIdx === 'number') ? activeKitchenItemIdx : 0;
  kCloseModal();
  kOpenCopyMoveModal(dayIdx, mealType, itemIdx);
}
window.kOpenCopyMoveFromFastModal = kOpenCopyMoveFromFastModal;

function kSetCopyMoveAction(action) {
  copyMoveState.action = action;
  kSyncCopyMoveToggles();
  kRenderCopyMoveDays();
}
window.kSetCopyMoveAction = kSetCopyMoveAction;

function kSetCopyMoveWeek(offset) {
  copyMoveState.targetWeekOffset = offset;
  kSyncCopyMoveToggles();
  kRenderCopyMoveDays();
}
window.kSetCopyMoveWeek = kSetCopyMoveWeek;

function kSetCopyMoveMealType(type) {
  copyMoveState.targetMealType = type;
  kSyncCopyMoveToggles();
  kRenderCopyMoveDays();
}
window.kSetCopyMoveMealType = kSetCopyMoveMealType;

function kSyncCopyMoveToggles() {
  ['copy', 'move', 'swap'].forEach(act => {
    const btn = document.getElementById(`k-cm-action-${act}`);
    if (btn) {
      if (act === copyMoveState.action) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  const descEl = document.getElementById('k-cm-action-desc');
  if (descEl) {
    const schedule = kGetScheduleForWeekOffset(storage.getKitchenData(), copyMoveState.sourceWeekOffset);
    const srcDayName = (schedule[copyMoveState.sourceDayIdx] && schedule[copyMoveState.sourceDayIdx].day) || 'selected day';
    if (copyMoveState.action === 'copy') {
      descEl.textContent = `📋 Duplicating keeps this dish on ${srcDayName} and also schedules it on the target date.`;
    } else if (copyMoveState.action === 'move') {
      descEl.textContent = `🚚 Moving transfers this dish to the target date and clears it from ${srcDayName}.`;
    } else {
      descEl.textContent = `⇄ Swapping exchanges meals between ${srcDayName} and the target date.`;
    }
  }

  [0, 1].forEach(w => {
    const btn = document.getElementById(`k-cm-week-${w}`);
    if (btn) {
      if (w === copyMoveState.targetWeekOffset) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  ['dinner', 'lunch', 'brunch', 'dessert'].forEach(t => {
    const btn = document.getElementById(`k-cm-mtype-${t}`);
    if (btn) {
      if (t === copyMoveState.targetMealType) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
}

function kRenderCopyMoveDays() {
  const container = document.getElementById('k-copymove-days-grid');
  if (!container) return;

  const data = storage.getKitchenData();
  const schedule = kGetScheduleForWeekOffset(data, copyMoveState.targetWeekOffset);

  const now = new Date();
  const dayOfWeek = now.getDay();
  const baseSun = new Date(now);
  baseSun.setDate(now.getDate() - dayOfWeek);
  const targetSun = new Date(baseSun);
  targetSun.setDate(baseSun.getDate() + (copyMoveState.targetWeekOffset * 7));

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cardsHtml = dayNames.map((name, idx) => {
    const d = new Date(targetSun);
    d.setDate(targetSun.getDate() + idx);
    const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const isSameSlot = (
      copyMoveState.sourceWeekOffset === copyMoveState.targetWeekOffset &&
      copyMoveState.sourceDayIdx === idx &&
      copyMoveState.sourceMealType === copyMoveState.targetMealType
    );

    const dayObj = schedule.find(s => s.day === name) || schedule[idx] || {};
    const rawSlot = (dayObj.meals && dayObj.meals[copyMoveState.targetMealType]) ? dayObj.meals[copyMoveState.targetMealType] : null;
    const items = Array.isArray(rawSlot) ? rawSlot.filter(i => i && i.meal) : (rawSlot && rawSlot.meal ? [rawSlot] : []);
    if (items.length === 0 && copyMoveState.targetMealType === 'dinner' && dayObj.meal) {
      items.push({ meal: dayObj.meal });
    }
    const hasMeal = items.length > 0;

    let summaryText = '+ Open slot';
    let summaryClass = 'empty';
    if (isSameSlot) {
      summaryText = 'Current location';
      summaryClass = 'current';
    } else if (hasMeal) {
      summaryText = (copyMoveState.action === 'swap' ? '⇄ Swap with: ' : 'Replace: ') + escapeHtml(items[0].meal) + (items.length > 1 ? ` (+${items.length - 1})` : '');
      summaryClass = 'occupied';
    } else {
      summaryText = (copyMoveState.action === 'copy' ? '📋 Copy here' : '🚚 Move here');
    }

    if (isSameSlot) {
      return `
        <div class="k-assign-day-card is-current-day">
          <div class="day-head">
            <span class="day-name">${name}</span>
            <span class="day-date">${dateLabel}</span>
          </div>
          <div class="day-current" style="color:var(--k-text-muted); font-style:italic;">
            ${summaryText}
          </div>
        </div>
      `;
    }

    return `
      <button type="button" class="k-assign-day-card" onclick="kConfirmCopyMove(${idx})">
        <div class="day-head">
          <span class="day-name">${name}</span>
          <span class="day-date">${dateLabel}</span>
        </div>
        <div class="day-current ${summaryClass}">
          ${summaryText}
        </div>
      </button>
    `;
  }).join('');

  container.innerHTML = cardsHtml;
}

function kConfirmCopyMove(targetDayIdx) {
  if (!copyMoveState.sourceDish) return;

  const data = storage.getKitchenData();
  const srcWeek = copyMoveState.sourceWeekOffset;
  const srcDayIdx = copyMoveState.sourceDayIdx;
  const srcMealType = copyMoveState.sourceMealType;
  const srcItemIdx = copyMoveState.sourceItemIdx;

  const targetWeek = copyMoveState.targetWeekOffset;
  const targetMealType = copyMoveState.targetMealType;
  const action = copyMoveState.action;

  const srcSchedule = kGetScheduleForWeekOffset(data, srcWeek);
  const targetSchedule = kGetScheduleForWeekOffset(data, targetWeek);

  const srcDay = srcSchedule[srcDayIdx];
  const targetDay = targetSchedule[targetDayIdx];
  if (!srcDay || !targetDay) return;

  ['brunch', 'lunch', 'dinner', 'dessert'].forEach(t => {
    if (!srcDay.meals) srcDay.meals = { brunch: [], lunch: [], dinner: [], dessert: [] };
    if (!Array.isArray(srcDay.meals[t])) {
      srcDay.meals[t] = (srcDay.meals[t] && srcDay.meals[t].meal) ? [srcDay.meals[t]] : [];
    }
    if (!targetDay.meals) targetDay.meals = { brunch: [], lunch: [], dinner: [], dessert: [] };
    if (!Array.isArray(targetDay.meals[t])) {
      targetDay.meals[t] = (targetDay.meals[t] && targetDay.meals[t].meal) ? [targetDay.meals[t]] : [];
    }
  });

  const srcDish = copyMoveState.sourceDish;
  const clonedSrcDish = {
    meal: srcDish.meal,
    source: srcDish.source || 'fresh',
    icon: srcDish.icon || 'chicken',
    recipeUrl: srcDish.recipeUrl || '',
    favoriteId: srcDish.favoriteId || null
  };

  let targetExistingDish = null;
  const rawTargetSlot = targetDay.meals[targetMealType];
  if (Array.isArray(rawTargetSlot) && rawTargetSlot.length > 0 && rawTargetSlot[0].meal) {
    targetExistingDish = { ...rawTargetSlot[0] };
  } else if (targetMealType === 'dinner' && targetDay.meal) {
    targetExistingDish = {
      meal: targetDay.meal,
      source: targetDay.source || 'fresh',
      icon: targetDay.icon || 'chicken',
      recipeUrl: targetDay.recipeUrl || '',
      favoriteId: targetDay.favoriteId || null
    };
  }

  if (action === 'copy') {
    targetDay.meals[targetMealType].push(clonedSrcDish);
    if (targetMealType === 'dinner') {
      targetDay.meal = targetDay.meals.dinner[0]?.meal || '';
      targetDay.source = targetDay.meals.dinner[0]?.source || 'fresh';
      targetDay.icon = targetDay.meals.dinner[0]?.icon || 'chicken';
      targetDay.recipeUrl = targetDay.meals.dinner[0]?.recipeUrl || '';
      targetDay.favoriteId = targetDay.meals.dinner[0]?.favoriteId || null;
    }
  } else if (action === 'move') {
    if (srcMealType === 'dinner') {
      if (srcDay.meals.dinner.length > 1 && typeof srcItemIdx === 'number' && srcItemIdx >= 0 && srcItemIdx < srcDay.meals.dinner.length) {
        srcDay.meals.dinner.splice(srcItemIdx, 1);
        srcDay.meal = srcDay.meals.dinner[0]?.meal || '';
        srcDay.source = srcDay.meals.dinner[0]?.source || 'fresh';
        srcDay.icon = srcDay.meals.dinner[0]?.icon || 'chicken';
        srcDay.recipeUrl = srcDay.meals.dinner[0]?.recipeUrl || '';
        srcDay.favoriteId = srcDay.meals.dinner[0]?.favoriteId || null;
      } else {
        srcDay.meals.dinner = [];
        srcDay.meal = '';
        srcDay.recipeUrl = '';
        srcDay.favoriteId = null;
      }
    } else {
      if (srcDay.meals[srcMealType].length > 1 && typeof srcItemIdx === 'number' && srcItemIdx >= 0 && srcItemIdx < srcDay.meals[srcMealType].length) {
        srcDay.meals[srcMealType].splice(srcItemIdx, 1);
      } else {
        srcDay.meals[srcMealType] = [];
      }
    }

    targetDay.meals[targetMealType].push(clonedSrcDish);
    if (targetMealType === 'dinner') {
      targetDay.meal = targetDay.meals.dinner[0]?.meal || '';
      targetDay.source = targetDay.meals.dinner[0]?.source || 'fresh';
      targetDay.icon = targetDay.meals.dinner[0]?.icon || 'chicken';
      targetDay.recipeUrl = targetDay.meals.dinner[0]?.recipeUrl || '';
      targetDay.favoriteId = targetDay.meals.dinner[0]?.favoriteId || null;
    }
  } else if (action === 'swap') {
    if (targetExistingDish) {
      srcDay.meals[srcMealType] = [targetExistingDish];
      if (srcMealType === 'dinner') {
        srcDay.meal = targetExistingDish.meal;
        srcDay.source = targetExistingDish.source;
        srcDay.icon = targetExistingDish.icon;
        srcDay.recipeUrl = targetExistingDish.recipeUrl;
        srcDay.favoriteId = targetExistingDish.favoriteId;
      }
    } else {
      srcDay.meals[srcMealType] = [];
      if (srcMealType === 'dinner') {
        srcDay.meal = '';
        srcDay.recipeUrl = '';
        srcDay.favoriteId = null;
      }
    }

    targetDay.meals[targetMealType] = [clonedSrcDish];
    if (targetMealType === 'dinner') {
      targetDay.meal = clonedSrcDish.meal;
      targetDay.source = clonedSrcDish.source;
      targetDay.icon = clonedSrcDish.icon;
      targetDay.recipeUrl = clonedSrcDish.recipeUrl;
      targetDay.favoriteId = clonedSrcDish.favoriteId;
    }
  }

  data.activeWeekOffset = targetWeek;
  storage.saveKitchenData(data);

  kCloseCopyMoveModal();
  renderKitchenPage();

  const typeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
  const targetTypeLabel = typeLabels[targetMealType] || 'Dinner';
  const targetWeekNote = targetWeek === 1 ? ' (Upcoming Week)' : '';

  if (action === 'copy') {
    if (typeof showToast === 'function') showToast(`Copied "${clonedSrcDish.meal}" to ${targetDay.day} ${targetTypeLabel}${targetWeekNote}! 📋`);
  } else if (action === 'move') {
    if (typeof showToast === 'function') showToast(`Moved "${clonedSrcDish.meal}" to ${targetDay.day} ${targetTypeLabel}${targetWeekNote}! 🚚`);
  } else {
    if (typeof showToast === 'function') showToast(`Swapped meals between ${srcDay.day} and ${targetDay.day}! ⇄`);
  }
}
window.kConfirmCopyMove = kConfirmCopyMove;

/* ==========================================================================
   View & Edit Full Recipe Modal Controller
   ========================================================================== */
let viewedRecipeId = null;
let viewedRecipeCollection = 'vault';

function kOpenViewRecipeModal(recipeId, collection = 'vault', event = null) {
  if (event) event.stopPropagation();
  viewedRecipeId = recipeId;
  viewedRecipeCollection = collection;

  const data = storage.getKitchenData();
  const list = collection === 'new' ? (data.newRecipes || []) : (data.favoriteRecipes || []);
  const recipe = list.find(r => r.id === recipeId);
  if (!recipe) return;

  const titleEl = document.getElementById('k-view-recipe-title');
  if (titleEl) titleEl.textContent = recipe.title || 'Recipe';

  const badgeEl = document.getElementById('k-view-recipe-course-badge');
  if (badgeEl) {
    const courseLabel = { main: 'Main 🍲', side: 'Side 🥗', brunch: 'Brunch ☕', dessert: 'Dessert 🍨' }[recipe.course || 'main'] || 'Main 🍲';
    badgeEl.textContent = collection === 'new' ? `Want to Try · ${courseLabel}` : courseLabel;
  }

  const displayEl = document.getElementById('k-view-recipe-notes-display');
  const editEl = document.getElementById('k-view-recipe-notes-edit');
  const editBtn = document.getElementById('k-view-recipe-edit-btn');
  const saveBtn = document.getElementById('k-view-recipe-save-btn');

  if (displayEl) {
    displayEl.style.display = 'block';
    displayEl.textContent = recipe.ingredients && recipe.ingredients.trim()
      ? recipe.ingredients
      : 'No ingredients or notes added yet. Tap "✎ Edit Notes" below to add them.';
  }
  if (editEl) {
    editEl.style.display = 'none';
    editEl.value = recipe.ingredients || '';
  }
  if (editBtn) editBtn.style.display = 'inline-flex';
  if (saveBtn) saveBtn.style.display = 'none';

  const linkWrap = document.getElementById('k-view-recipe-link-wrap');
  const linkEl = document.getElementById('k-view-recipe-link');
  if (linkWrap && linkEl) {
    if (recipe.recipeUrl && recipe.recipeUrl.trim()) {
      linkWrap.style.display = 'block';
      linkEl.href = recipe.recipeUrl.trim();
    } else {
      linkWrap.style.display = 'none';
    }
  }

  const modal = document.getElementById('k-view-recipe-modal');
  if (modal) modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}
window.kOpenViewRecipeModal = kOpenViewRecipeModal;

function kCloseViewRecipeModal() {
  const modal = document.getElementById('k-view-recipe-modal');
  if (modal) modal.classList.remove('active');
  viewedRecipeId = null;
}
window.kCloseViewRecipeModal = kCloseViewRecipeModal;

function kToggleEditViewedRecipe() {
  const displayEl = document.getElementById('k-view-recipe-notes-display');
  const editEl = document.getElementById('k-view-recipe-notes-edit');
  const editBtn = document.getElementById('k-view-recipe-edit-btn');
  const saveBtn = document.getElementById('k-view-recipe-save-btn');

  if (displayEl) displayEl.style.display = 'none';
  if (editEl) {
    editEl.style.display = 'block';
    editEl.focus();
  }
  if (editBtn) editBtn.style.display = 'none';
  if (saveBtn) saveBtn.style.display = 'inline-flex';
}
window.kToggleEditViewedRecipe = kToggleEditViewedRecipe;

function kSaveViewedRecipeEdits() {
  if (!viewedRecipeId) return;
  const editEl = document.getElementById('k-view-recipe-notes-edit');
  if (!editEl) return;

  const data = storage.getKitchenData();
  const list = viewedRecipeCollection === 'new' ? (data.newRecipes || []) : (data.favoriteRecipes || []);
  const recipe = list.find(r => r.id === viewedRecipeId);
  if (!recipe) return;

  recipe.ingredients = editEl.value.trim();
  storage.saveKitchenData(data);

  const displayEl = document.getElementById('k-view-recipe-notes-display');
  const editBtn = document.getElementById('k-view-recipe-edit-btn');
  const saveBtn = document.getElementById('k-view-recipe-save-btn');

  if (displayEl) {
    displayEl.textContent = recipe.ingredients || 'No ingredients or notes added yet.';
    displayEl.style.display = 'block';
  }
  editEl.style.display = 'none';
  if (editBtn) editBtn.style.display = 'inline-flex';
  if (saveBtn) saveBtn.style.display = 'none';

  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Updated notes for "${recipe.title}"! ✨`);
}
window.kSaveViewedRecipeEdits = kSaveViewedRecipeEdits;

function kPlanFromViewRecipeModal() {
  const id = viewedRecipeId;
  const col = viewedRecipeCollection;
  kCloseViewRecipeModal();
  if (id) kOpenAssignModal(id, col);
}
window.kPlanFromViewRecipeModal = kPlanFromViewRecipeModal;

// Grocery List Item Toggle (Checked items will be excluded from Things 3 export)
function kToggleGroceryItem(el) {
  el.classList.toggle('checked');
}

function kAddExtraGroceryItem() {
  const input = document.getElementById('k-add-extra-grocery');
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    input.focus();
    return;
  }

  const data = storage.getKitchenData();
  if (!Array.isArray(data.groceries)) data.groceries = [];
  data.groceries.push({
    id: 'g-' + Date.now(),
    text: val,
    checked: false
  });
  storage.saveKitchenData(data);
  input.value = '';
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Added "${val}" to grocery list`);
}
window.kAddExtraGroceryItem = kAddExtraGroceryItem;

function kToggleGroceryItemPersist(id) {
  const data = storage.getKitchenData();
  if (!Array.isArray(data.groceries)) return;
  const item = data.groceries.find(g => g.id === id);
  if (!item) return;
  item.checked = !item.checked;
  storage.saveKitchenData(data);
  renderKitchenPage();
}
window.kToggleGroceryItemPersist = kToggleGroceryItemPersist;

function kDeleteGroceryItem(id) {
  const data = storage.getKitchenData();
  if (!Array.isArray(data.groceries)) return;
  data.groceries = data.groceries.filter(g => g.id !== id);
  storage.saveKitchenData(data);
  renderKitchenPage();
  if (typeof showToast === 'function') showToast('Removed grocery item');
}
window.kDeleteGroceryItem = kDeleteGroceryItem;

function kClearAllGroceries() {
  const data = storage.getKitchenData();
  data.groceries = [];
  storage.saveKitchenData(data);
  renderKitchenPage();
  if (typeof showToast === 'function') showToast('Cleared grocery list');
}
window.kClearAllGroceries = kClearAllGroceries;

// 1-Tap Native Things 3 URL Scheme Integration
function kOpenThings3() {
  const data = storage.getKitchenData();
  const weekOffset = data.activeWeekOffset || 0;
  const schedule = kGetScheduleForWeekOffset(data, weekOffset);
  const weekTitle = weekOffset === 1 ? 'Upcoming Week' : 'This Week';

  const groceries = (data.groceries || []).filter(g => !g.checked);
  const rawItems = groceries.map(g => g.text).filter(Boolean);

  const mealLines = [];
  const typeOrder = ['brunch', 'lunch', 'dinner', 'dessert'];
  const typeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
  (schedule || []).forEach(d => {
    const m = d.meals || {};
    typeOrder.forEach(t => {
      const rawSlot = m[t];
      const items = Array.isArray(rawSlot) ? rawSlot : (rawSlot && rawSlot.meal ? [rawSlot] : []);
      items.forEach(slot => {
        if (slot && slot.meal) {
          mealLines.push(`• ${d.day} ${typeLabels[t]}: ${slot.meal} (${slot.source === 'out' ? 'Takeout 🥡' : (slot.source === 'freezer' ? 'Freezer 🧊' : (slot.source === 'fridge' ? 'Fridge 🥬' : (slot.source === 'pantry' ? 'Pantry 🥫' : 'Fresh 🛒')))})`);
        }
      });
    });
  });

  const notes = `Planned in margo (${weekTitle}):\n${mealLines.length ? mealLines.join('\n') : '(No meals planned yet)'}\n\nEat Out Target: ${data.eatOutTarget || 1}x`;
  const thingsUrl = `things:///add-project?title=${encodeURIComponent(`Weekly Groceries (${weekTitle})`)}&to-dos=${encodeURIComponent(rawItems.join('\n'))}&notes=${encodeURIComponent(notes)}`;

  // Also copy to clipboard as convenience backup
  const clipboardText = `Weekly Groceries (${weekTitle})\n${rawItems.length ? rawItems.map(i => `[ ] ${i}`).join('\n') : '(No grocery items entered)'}\n\n${notes}`;
  navigator.clipboard.writeText(clipboardText).catch(() => {});

  // Trigger Things 3 via deep link
  window.location.href = thingsUrl;

  if (typeof showToast === 'function') {
    showToast(`✓ Opened Things 3 with ${rawItems.length} grocery items! ✨`);
  }
  if (typeof confetti === 'function') {
    confetti({ particleCount: 45, spread: 60, origin: { y: 0.8 }, colors: ['#8B5CF6', '#6D28D9', '#0D98BA', '#C084FC'] });
  }
}
window.kOpenThings3 = kOpenThings3;

// Copy ONLY active, verified (unchecked) grocery items to clipboard
function kExportVerifiedThings3() {
  const data = storage.getKitchenData();
  const weekOffset = data.activeWeekOffset || 0;
  const schedule = kGetScheduleForWeekOffset(data, weekOffset);
  const weekTitle = weekOffset === 1 ? 'Upcoming Week' : 'This Week';

  const groceries = (data.groceries || []).filter(g => !g.checked);
  const items = groceries.map(g => `[ ] ${g.text}`).filter(Boolean);

  const mealLines = [];
  const typeOrder = ['brunch', 'lunch', 'dinner', 'dessert'];
  const typeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
  (schedule || []).forEach(d => {
    const m = d.meals || {};
    typeOrder.forEach(t => {
      const rawSlot = m[t];
      const items = Array.isArray(rawSlot) ? rawSlot : (rawSlot && rawSlot.meal ? [rawSlot] : []);
      items.forEach(slot => {
        if (slot && slot.meal) {
          mealLines.push(`• ${d.day} ${typeLabels[t]}: ${slot.meal} (${slot.source === 'out' ? 'Takeout 🥡' : (slot.source === 'freezer' ? 'Freezer 🧊' : (slot.source === 'fridge' ? 'Fridge 🥬' : (slot.source === 'pantry' ? 'Pantry 🥫' : 'Fresh 🛒')))})`);
        }
      });
    });
  });

  const text = `Weekly Groceries (${weekTitle})\n${items.length ? items.join('\n') : '(No groceries entered)'}\n\nMeals Planned in margo:\n${mealLines.length ? mealLines.join('\n') : '(No meals planned)'}\n\nEat Out: ${data.eatOutTarget || 1}x target`;

  navigator.clipboard.writeText(text).then(() => {
    if (typeof showToast === 'function') showToast(`✓ Copied ${items.length} verified grocery items for Things 3!`);
    if (typeof confetti === 'function') {
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.8 }, colors: ['#8B5CF6', '#6D28D9', '#0D98BA', '#C084FC'] });
    }
  }).catch(() => {
    if (typeof showToast === 'function') showToast('✓ Ready for Things 3');
  });
}
window.kExportVerifiedThings3 = kExportVerifiedThings3;

// Manual rollover action for on-demand week promotion
function kManualWeekRollover() {
  const confirmed = confirm("Roll over Upcoming Week to This Week?\n\n• Upcoming meals will become This Week's plan\n• Upcoming Week will reset to a clean template for future planning\n\nContinue?");
  if (!confirmed) return;
  storage.rolloverKitchenWeekNow();
  renderKitchenPage();
  if (typeof showToast === 'function') {
    showToast("Rolled over to This Week! Fresh plan ready 🍳");
  }
  if (typeof confetti === 'function') {
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 }, colors: ['#8B5CF6', '#6D28D9', '#0D98BA'] });
  }
}
window.kManualWeekRollover = kManualWeekRollover;

// Toggle collapsible Step 1 (Shop Your Stash First) - Stays collapsed by default
function kToggleKitchenStep1() {
  const current = localStorage.getItem('BOL_KITCHEN_STEP1_COLLAPSED');
  const isCollapsed = current === null ? true : (current === 'true');
  localStorage.setItem('BOL_KITCHEN_STEP1_COLLAPSED', String(!isCollapsed));
  renderKitchenPage();
}
window.kToggleKitchenStep1 = kToggleKitchenStep1;
