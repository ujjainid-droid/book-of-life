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
  if (source === 'pantry') return 'Pantry 🥫';
  if (source === 'out') {
    if (dayName === 'Fri' && mealType === 'dinner') return 'Friday Takeout 🥡';
    if (dayName === 'Sat') return 'Dining Out 🍷';
    return 'Takeout / Out 🥡';
  }
  return 'Fresh 🛒';
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
    <optgroup label="⏩ Following Week · Dinners">
      <option value="1:0:dinner">Following Sun Dinner</option>
      <option value="1:1:dinner">Following Mon Dinner</option>
      <option value="1:2:dinner">Following Tue Dinner</option>
      <option value="1:3:dinner">Following Wed Dinner</option>
      <option value="1:4:dinner">Following Thu Dinner</option>
      <option value="1:5:dinner">Following Fri Dinner (Takeout)</option>
      <option value="1:6:dinner">Following Sat Dinner</option>
    </optgroup>
    <optgroup label="🥗 Following Week · Lunches">
      <option value="1:0:lunch">Following Sun Lunch</option>
      <option value="1:1:lunch">Following Mon Lunch</option>
      <option value="1:2:lunch">Following Tue Lunch</option>
      <option value="1:3:lunch">Following Wed Lunch</option>
      <option value="1:4:lunch">Following Thu Lunch</option>
      <option value="1:5:lunch">Following Fri Lunch</option>
      <option value="1:6:lunch">Following Sat Lunch</option>
    </optgroup>
    <optgroup label="☕ Following Week · Brunch &amp; Desserts">
      <option value="1:0:brunch">Following Sun Brunch</option>
      <option value="1:6:brunch">Following Sat Brunch</option>
      <option value="1:0:dessert">Following Sun Dessert</option>
      <option value="1:1:dessert">Following Mon Dessert</option>
      <option value="1:2:dessert">Following Tue Dessert</option>
      <option value="1:3:dessert">Following Wed Dessert</option>
      <option value="1:4:dessert">Following Thu Dessert</option>
      <option value="1:5:dessert">Following Fri Dessert</option>
      <option value="1:6:dessert">Following Sat Dessert</option>
    </optgroup>
  `;
}
window.kRenderAssignSelectOptions = kRenderAssignSelectOptions;

function renderKitchenPage() {
  const container = document.getElementById('daily-sheet-container');
  if (!container) return;

  const data = storage.getKitchenData();
  const stashItems = data.stashItems || [];
  const favoriteRecipes = data.favoriteRecipes || [];
  const groceryItems = data.groceries || [];

  const todayIso = getTodayIso();

  // Dynamic week calculation
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sun
  const baseSun = new Date(now);
  baseSun.setDate(now.getDate() - dayOfWeek);

  const weekOffset = (typeof data.activeWeekOffset === 'number') ? data.activeWeekOffset : 0;
  const activeMealFilter = data.activeMealFilter || 'all';

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

  // Retrieve active week schedule and normalize slots
  const rawSchedule = weekOffset === 1 ? (data.followingWeekSchedule || []) : (data.weekSchedule || []);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullWeekSchedule = dayNames.map((dayName, idx) => {
    const existing = rawSchedule.find(s => s.day === dayName) || rawSchedule[idx] || {};
    const meals = existing.meals || {};
    const dinnerSlot = meals.dinner || (existing.meal ? {
      meal: existing.meal,
      source: existing.source || 'fresh',
      icon: existing.icon || 'chicken',
      recipeUrl: existing.recipeUrl || ''
    } : null);

    return {
      day: dayName,
      date: weekDates[idx].dateLabel,
      iso: weekDates[idx].iso,
      meal: (dinnerSlot && dinnerSlot.meal) || existing.meal || '',
      source: (dinnerSlot && dinnerSlot.source) || existing.source || (dayName === 'Fri' || dayName === 'Sat' ? 'out' : 'fresh'),
      icon: (dinnerSlot && dinnerSlot.icon) || existing.icon || (dayName === 'Fri' ? 'takeout' : (dayName === 'Sat' ? 'bistro' : 'chicken')),
      recipeUrl: (dinnerSlot && dinnerSlot.recipeUrl) || existing.recipeUrl || '',
      favoriteId: existing.favoriteId || null,
      meals: {
        brunch: meals.brunch || null,
        lunch: meals.lunch || null,
        dinner: dinnerSlot,
        dessert: meals.dessert || null
      }
    };
  });

  // Calculate eat-out count across all planned meals for this week
  const outCount = fullWeekSchedule.reduce((cnt, d) => {
    ['brunch', 'lunch', 'dinner', 'dessert'].forEach(t => {
      const slot = d.meals[t];
      if (slot && slot.meal && slot.source === 'out') cnt++;
    });
    return cnt;
  }, 0);
  const target = (typeof data.eatOutTarget === 'number') ? data.eatOutTarget : 1;
  const withinTarget = outCount <= target;

  const newRecipes = data.newRecipes || [];
  const vaultFilter = data.vaultFilter || 'all';

  const favMainCount = favoriteRecipes.filter(r => (r.course || 'main') === 'main').length;
  const favSideCount = favoriteRecipes.filter(r => r.course === 'side').length;
  const favDessertCount = favoriteRecipes.filter(r => r.course === 'dessert').length;

  const filteredFavs = favoriteRecipes.filter(r => {
    if (vaultFilter === 'all') return true;
    return (r.course || 'main') === vaultFilter;
  });
  const courseOrder = { main: 1, side: 2, dessert: 3 };
  filteredFavs.sort((a, b) => {
    const ca = courseOrder[a.course || 'main'] || 9;
    const cb = courseOrder[b.course || 'main'] || 9;
    if (ca !== cb) return ca - cb;
    return (a.title || '').localeCompare(b.title || '');
  });

  container.innerHTML = `
    <div class="kitchen-workflow-wrap">

      <!-- HEADER: WEEKLY REALITY CHECK -->
      <header class="k-header-card">
        <div class="k-header-titles">
          <div class="k-header-main-row">
            <h2 class="k-header-title">Kitchen Sanctuary</h2>
            <div class="k-week-toggle-group">
              <button type="button" class="k-week-toggle-btn ${weekOffset === 0 ? 'active' : ''}" onclick="kSetWeekOffset(0)" title="Current Week (${thisWeekLabel})">
                This Week
              </button>
              <button type="button" class="k-week-toggle-btn ${weekOffset === 1 ? 'active' : ''}" onclick="kSetWeekOffset(1)" title="Following Week (${nextWeekLabel})">
                Following Week
              </button>
            </div>
            <span class="k-header-week-tag">${escapeHtml(weekRangeLabel)}</span>
          </div>
          <span style="font-size:12px; color:var(--text-muted);">Shop your stash first, meals on autopilot.</span>
        </div>

        <div class="k-eatout-summary-pill" title="Target for dining out / takeout meals">
          <span>🥡 Eat-Out:</span>
          <span class="k-eatout-badge">${outCount}x</span>
          <span style="font-size:11px; color:${withinTarget ? '#3B6B35' : 'var(--pal-coral)'}; font-weight:700;">
            ${withinTarget ? `✓ On Target (≤ ${target}x)` : `Over Target (${target}x)`}
          </span>
        </div>
      </header>

      <!-- STEP 1: SHOP THE STASH FIRST (3 Separate Buttons: Pantry, Fridge & Freezer) -->
      <section class="k-section-box" id="k-sec-stash">
        <div class="k-sec-header">
          <div class="k-sec-title-group">
            <span class="k-step-indicator">STEP 1</span>
            <span class="k-sec-title">Shop Your Stash First</span>
          </div>
          <span class="k-sec-hint">Tap checkbox when used · Tap name to assign to meal</span>
        </div>

        <!-- Stash Chips -->
        <div class="k-stash-chips-row">
          ${stashItems.length > 0 ? stashItems.map(item => `
            <div class="k-stash-chip ${item.used ? 'is-used' : ''}">
              <span class="k-stash-check" onclick="kToggleStashUsed('${item.id}', event)" title="${item.used ? 'Mark active' : 'Check off as used'}">✓</span>
              <span class="k-stash-text" onclick="kAssignStashDirect('${escapeHtml(item.name)}', '${item.type}')">${escapeHtml(item.name)}</span>
              <span class="k-stash-tag-badge ${item.type}" onclick="kCycleStashType('${item.id}', event)" title="Click to cycle (Pantry, Fridge, Freezer)" style="cursor:pointer;">${item.type === 'freezer' ? 'Freezer' : (item.type === 'fridge' ? 'Fridge' : 'Pantry')}</span>
              <button class="kitchen-stash-del-btn" onclick="event.stopPropagation(); kDeleteStash('${item.id}')">×</button>
            </div>
          `).join('') : `
            <span style="font-size:12px; color:var(--text-muted); font-style:italic; padding:4px 0;">No stash items saved yet. Use the buttons below to log what's in your pantry, fridge, or freezer.</span>
          `}
        </div>

        <!-- 3 Separate Buttons: Pantry (Default on Enter), Fridge, and Freezer -->
        <div class="k-stash-quick-bar">
          <input type="text" class="k-clean-input" id="k-stash-input" name="k_stash_input_new" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-form-type="other" placeholder="+ Add stash item to use up..." onkeydown="if(event.key==='Enter') kAddStashWithSource('pantry')">
          <button type="button" class="k-btn-stash-add pantry" onclick="kAddStashWithSource('pantry')" title="Add directly to Pantry (Default on Enter)">
            🥫 + Pantry
          </button>
          <button type="button" class="k-btn-stash-add fridge" onclick="kAddStashWithSource('fridge')" title="Add directly to Fridge">
            🥬 + Fridge
          </button>
          <button type="button" class="k-btn-stash-add freezer" onclick="kAddStashWithSource('freezer')" title="Add directly to Freezer">
            🧊 + Freezer
          </button>
        </div>
      </section>

      <!-- STEP 2: WEEKLY MEAL BOARD (Brunch, Lunch, Dinner, Dessert) -->
      <section class="k-section-box" id="k-sec-dinners">
        <div class="k-sec-header">
          <div class="k-sec-title-group">
            <span class="k-step-indicator">STEP 2</span>
            <span class="k-sec-title">Weekly Meal Board</span>
            <div class="k-week-toggle-group" style="margin-left:4px;">
              <button type="button" class="k-week-toggle-btn ${weekOffset === 0 ? 'active' : ''}" onclick="kSetWeekOffset(0)" title="${thisWeekLabel}">
                This Week
              </button>
              <button type="button" class="k-week-toggle-btn ${weekOffset === 1 ? 'active' : ''}" onclick="kSetWeekOffset(1)" title="${nextWeekLabel}">
                Following Week
              </button>
            </div>
          </div>
          <span class="k-sec-hint">Tap any slot or + to plan Brunch, Lunch, Dinner &amp; Dessert</span>
        </div>

        <!-- Filter bar for meal types -->
        <div class="k-meal-filter-bar">
          <button type="button" class="k-meal-filter-chip ${activeMealFilter === 'all' ? 'active' : ''}" onclick="kSetMealFilter('all')">
            All Meals
          </button>
          <button type="button" class="k-meal-filter-chip ${activeMealFilter === 'brunch' ? 'active' : ''}" onclick="kSetMealFilter('brunch')">
            🍳 Brunch
          </button>
          <button type="button" class="k-meal-filter-chip ${activeMealFilter === 'lunch' ? 'active' : ''}" onclick="kSetMealFilter('lunch')">
            🥗 Lunch
          </button>
          <button type="button" class="k-meal-filter-chip ${activeMealFilter === 'dinner' ? 'active' : ''}" onclick="kSetMealFilter('dinner')">
            🍲 Dinner
          </button>
          <button type="button" class="k-meal-filter-chip ${activeMealFilter === 'dessert' ? 'active' : ''}" onclick="kSetMealFilter('dessert')">
            🍨 Dessert
          </button>
        </div>

        <div class="k-week-list">
          ${fullWeekSchedule.map((d, idx) => {
            const isPast = (weekOffset === 0 && d.iso < todayIso);
            const isToday = (weekOffset === 0 && d.iso === todayIso);
            const mealTypes = ['brunch', 'lunch', 'dinner', 'dessert'];
            const mealTypeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
            const mealTypeIcons = { brunch: '🍳', lunch: '🥗', dinner: '🍲', dessert: '🍨' };

            // When a single meal type is filtered
            if (activeMealFilter !== 'all') {
              const t = activeMealFilter;
              const slot = d.meals[t];
              const hasMeal = slot && slot.meal;
              const isOut = hasMeal && slot.source === 'out';
              const iconKey = hasMeal ? (slot.icon || (isOut ? 'takeout' : (t === 'brunch' ? 'brunch' : (t === 'dessert' ? 'dessert' : 'chicken')))) : (t === 'brunch' ? 'brunch' : (t === 'dessert' ? 'dessert' : 'chicken'));
              const iconSvg = KITCHEN_ICONS[iconKey] || (isOut ? KITCHEN_ICONS.takeout : KITCHEN_ICONS.chicken);
              const isFav = hasMeal && favoriteRecipes.some(r => r.title.toLowerCase() === slot.meal.toLowerCase());
              const pillLabel = hasMeal ? getSourcePillLabel(slot.source, d.day, t) : 'Fresh 🛒';

              return `
                <div class="k-day-row ${isOut ? 'is-takeout-row' : ''} ${isPast ? 'is-past-day' : ''} ${isToday ? 'is-today-row' : ''}">
                  <div class="k-day-meta">
                    <span class="k-day-name">${d.day}</span>
                    <div class="k-day-date-row">
                      <span class="k-day-date">${d.date}</span>
                      ${isToday ? `<span class="k-badge-day-status today">Today</span>` : (isPast ? `<span class="k-badge-day-status past">Past</span>` : '')}
                    </div>
                  </div>

                  <div class="k-avatar-icon" onclick="kOpenMealPicker(${idx}, '${t}')" title="Click to enter/edit ${mealTypeLabels[t]}">
                    ${iconSvg}
                  </div>

                  <div class="k-meal-center">
                    <div class="k-meal-name-row">
                      <span class="k-meal-title-text" onclick="kOpenMealPicker(${idx}, '${t}')" title="Click to enter/edit ${mealTypeLabels[t]}">
                        ${hasMeal ? escapeHtml(slot.meal) : `<span style="color:var(--text-muted); font-style:italic; font-size:12.5px; font-weight:400;">+ Add ${mealTypeLabels[t]}...</span>`}
                      </span>
                      ${hasMeal ? `
                        <button type="button" class="k-source-pill ${slot.source}" onclick="kCycleSlotSource(${idx}, '${t}', event)" title="Click to flip (Fresh, Freezer, Pantry, Takeout)">
                          ${pillLabel}
                        </button>
                      ` : ''}
                    </div>

                    ${(hasMeal && slot.recipeUrl) ? `
                      <div>
                        <a href="${escapeHtml(slot.recipeUrl)}" target="_blank" rel="noopener noreferrer" class="k-recipe-web-link">
                          <i data-lucide="external-link" style="width:11px; height:11px;"></i>
                          <span>Recipe Link</span>
                        </a>
                      </div>
                    ` : ''}
                  </div>

                  <div class="k-day-actions-box">
                    <button type="button" class="k-btn-edit-dinner" onclick="kOpenMealPicker(${idx}, '${t}')" title="Enter or change ${mealTypeLabels[t]} for ${d.day}">
                      <span>✏️ Edit</span>
                    </button>
                    ${hasMeal ? `
                      <button type="button" class="k-icon-btn ${isFav ? 'is-fav' : ''}" title="${isFav ? 'In Favorites' : 'Save dish to Favorites Vault'}" onclick="kToggleFavSlot(${idx}, '${t}', event)">
                        <i data-lucide="heart" style="width:13px; height:13px;"></i>
                      </button>
                    ` : ''}
                  </div>
                </div>
              `;
            }

            // All Meals View: shows planned slots + quick-add chips for empty slots
            const plannedSlots = mealTypes.filter(t => d.meals[t] && d.meals[t].meal);
            const emptySlots = mealTypes.filter(t => !d.meals[t] || !d.meals[t].meal);

            return `
              <div class="k-day-row ${isPast ? 'is-past-day' : ''} ${isToday ? 'is-today-row' : ''}" style="grid-template-columns: 80px 1fr; align-items:flex-start;">
                <div class="k-day-meta" style="padding-top:4px;">
                  <span class="k-day-name">${d.day}</span>
                  <div class="k-day-date-row">
                    <span class="k-day-date">${d.date}</span>
                    ${isToday ? `<span class="k-badge-day-status today">Today</span>` : (isPast ? `<span class="k-badge-day-status past">Past</span>` : '')}
                  </div>
                </div>

                <div class="k-day-slots-wrap">
                  ${plannedSlots.map(t => {
                    const slot = d.meals[t];
                    const isOut = slot.source === 'out';
                    const iconKey = slot.icon || (isOut ? 'takeout' : (t === 'brunch' ? 'brunch' : (t === 'dessert' ? 'dessert' : 'chicken')));
                    const iconSvg = KITCHEN_ICONS[iconKey] || (isOut ? KITCHEN_ICONS.takeout : KITCHEN_ICONS.chicken);
                    const isFav = favoriteRecipes.some(r => r.title.toLowerCase() === slot.meal.toLowerCase());
                    const pillLabel = getSourcePillLabel(slot.source, d.day, t);

                    return `
                      <div class="k-slot-row">
                        <span class="k-slot-type-badge ${t}">${mealTypeLabels[t]}</span>
                        <div class="k-avatar-icon-sm" onclick="kOpenMealPicker(${idx}, '${t}')" title="Click to edit">
                          ${iconSvg}
                        </div>
                        <div class="k-slot-info" onclick="kOpenMealPicker(${idx}, '${t}')">
                          <span class="k-slot-title">${escapeHtml(slot.meal)}</span>
                          ${slot.recipeUrl ? `
                            <a href="${escapeHtml(slot.recipeUrl)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="k-recipe-web-link">
                              <i data-lucide="external-link" style="width:10px; height:10px;"></i>
                            </a>
                          ` : ''}
                        </div>
                        <button type="button" class="k-source-pill ${slot.source}" onclick="kCycleSlotSource(${idx}, '${t}', event)" title="Click to cycle source">
                          ${pillLabel}
                        </button>
                        <button type="button" class="k-btn-edit-sm" onclick="kOpenMealPicker(${idx}, '${t}')" title="Edit ${mealTypeLabels[t]}">
                          ✏️
                        </button>
                        <button type="button" class="k-icon-btn-sm ${isFav ? 'is-fav' : ''}" title="${isFav ? 'In Favorites' : 'Add to Favorites'}" onclick="kToggleFavSlot(${idx}, '${t}', event)">
                          <i data-lucide="heart" style="width:12px; height:12px;"></i>
                        </button>
                      </div>
                    `;
                  }).join('')}

                  ${emptySlots.length > 0 ? `
                    <div class="k-slot-empty-row">
                      ${emptySlots.map(t => `
                        <button type="button" class="k-slot-add-chip ${t}" onclick="kOpenMealPicker(${idx}, '${t}')" title="Add ${mealTypeLabels[t]} for ${d.day}">
                          <span>${mealTypeIcons[t]}</span>
                          <span>+ ${mealTypeLabels[t]}</span>
                        </button>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- STEP 3: HOUSEHOLD FAVORITES VAULT -->
      <section class="k-section-box" id="k-sec-favorites">
        <div class="k-sec-header">
          <div class="k-sec-title-group">
            <span class="k-step-indicator" style="background:var(--pal-coral-soft); color:var(--pal-coral);">FAVORITES</span>
            <span class="k-sec-title">Household Favorites Vault</span>
            <span style="font-size:11px; font-weight:700; color:var(--text-muted);">(${favoriteRecipes.length} trusted recipes)</span>
          </div>
          <button type="button" class="k-btn-action" onclick="kOpenAddFavModal('vault')">
            <i data-lucide="plus" style="width:13px; height:13px;"></i>
            <span>Add Recipe</span>
          </button>
        </div>

        <!-- Tags filter bar for Main, Side, Dessert -->
        <div class="k-vault-filter-bar">
          <button type="button" class="k-vault-filter-chip ${vaultFilter === 'all' ? 'active' : ''}" onclick="kSetVaultFilter('all')">
            All (${favoriteRecipes.length})
          </button>
          <button type="button" class="k-vault-filter-chip ${vaultFilter === 'main' ? 'active' : ''}" onclick="kSetVaultFilter('main')">
            🍲 Main (${favMainCount})
          </button>
          <button type="button" class="k-vault-filter-chip ${vaultFilter === 'side' ? 'active' : ''}" onclick="kSetVaultFilter('side')">
            🥗 Side (${favSideCount})
          </button>
          <button type="button" class="k-vault-filter-chip ${vaultFilter === 'dessert' ? 'active' : ''}" onclick="kSetVaultFilter('dessert')">
            🍨 Dessert (${favDessertCount})
          </button>
        </div>

        <div class="k-favs-shelf">
          ${filteredFavs.length > 0 ? filteredFavs.map(r => `
            <div class="k-fav-card">
              <div class="k-fav-top">
                <div class="k-avatar-icon" style="width:32px; height:32px;">
                  ${KITCHEN_ICONS[r.icon] || KITCHEN_ICONS.chicken}
                </div>
                <div style="flex:1; min-width:0;">
                  <div class="k-fav-title">${escapeHtml(r.title)}</div>
                  <div style="display:flex; gap:4px; flex-wrap:wrap; margin-top:3px;">
                    <span class="k-course-badge ${r.course || 'main'}" onclick="kCycleRecipeCourse('${r.id}', 'vault', event)" title="Click to cycle course (Main, Side, Dessert)">
                      ${(r.course || 'main').toUpperCase()}
                    </span>
                    ${(() => {
                      const ignored = ['favorite', 'main', 'side', 'dessert'];
                      const extraTags = (r.tags || []).filter(t => !ignored.includes(String(t).toLowerCase()));
                      return extraTags.map(t => `<span style="font-size:9.5px; font-weight:700; padding:1px 5px; border-radius:4px; background:var(--pal-azure-soft); color:var(--pal-azure);">${escapeHtml(t)}</span>`).join('');
                    })()}
                  </div>
                </div>
                <button class="k-fav-del-btn" onclick="kDeleteFavorite('${r.id}', event)" title="Remove recipe from vault">×</button>
              </div>

              ${(r.ingredients && r.ingredients !== 'Custom recipe' && r.ingredients !== 'Favorite recipe') ? `
                <div class="k-fav-ingredients">
                  ${escapeHtml(r.ingredients)}
                </div>
              ` : ''}

              <div class="k-fav-footer">
                ${r.recipeUrl ? `
                  <a href="${escapeHtml(r.recipeUrl)}" target="_blank" rel="noopener noreferrer" class="k-recipe-web-link">
                    <i data-lucide="external-link" style="width:10px; height:10px;"></i>
                    <span>Recipe</span>
                  </a>
                ` : `<span></span>`}

                <select class="k-assign-select" onchange="kAssignFavToMeal('${r.id}', this.value); this.value='';">
                  ${kRenderAssignSelectOptions()}
                </select>
              </div>
            </div>
          `).join('') : `
            <div style="grid-column: 1 / -1; padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 12.5px; border: 1px dashed var(--border-subtle, rgba(31,42,68,0.12)); border-radius: 12px;">
              No recipes in this vault filter yet. Tap <strong>+ Add Recipe</strong> above to save one! 💜
            </div>
          `}
        </div>
      </section>

      <!-- STEP 4: NEW RECIPES QUEUE (Want to Try) -->
      <section class="k-section-box" id="k-sec-new-recipes">
        <div class="k-sec-header">
          <div class="k-sec-title-group">
            <span class="k-step-indicator" style="background:#EDE9FE; color:#6D28D9;">WANT TO TRY</span>
            <span class="k-sec-title">New Recipes Queue</span>
            <span style="font-size:11px; font-weight:700; color:var(--text-muted);">(${newRecipes.length} to test)</span>
          </div>
          <button type="button" class="k-btn-action" onclick="kOpenAddFavModal('new')">
            <i data-lucide="plus" style="width:13px; height:13px;"></i>
            <span>Add Recipe to Try</span>
          </button>
        </div>

        <div class="k-favs-shelf">
          ${newRecipes.length > 0 ? newRecipes.map(r => `
            <div class="k-fav-card" style="border-left: 3px solid #8B5CF6;">
              <div class="k-fav-top">
                <div class="k-avatar-icon" style="width:32px; height:32px;">
                  ${KITCHEN_ICONS[r.icon] || KITCHEN_ICONS.chicken}
                </div>
                <div style="flex:1; min-width:0;">
                  <div class="k-fav-title">${escapeHtml(r.title)}</div>
                  <div style="display:flex; gap:4px; flex-wrap:wrap; margin-top:3px;">
                    <span class="k-course-badge ${r.course || 'main'}" onclick="kCycleRecipeCourse('${r.id}', 'new', event)" title="Click to cycle course (Main, Side, Dessert)">
                      ${(r.course || 'main').toUpperCase()}
                    </span>
                    ${(() => {
                      const ignored = ['favorite', 'main', 'side', 'dessert'];
                      const extraTags = (r.tags || []).filter(t => !ignored.includes(String(t).toLowerCase()));
                      return extraTags.map(t => `<span style="font-size:9.5px; font-weight:700; padding:1px 5px; border-radius:4px; background:var(--pal-azure-soft); color:var(--pal-azure);">${escapeHtml(t)}</span>`).join('');
                    })()}
                  </div>
                </div>
                <button class="k-fav-del-btn" onclick="kDeleteNewRecipe('${r.id}', event)" title="Delete recipe from queue">×</button>
              </div>

              ${r.ingredients ? `
                <div class="k-fav-ingredients">
                  ${escapeHtml(r.ingredients)}
                </div>
              ` : ''}

              <div class="k-fav-footer" style="flex-wrap:wrap; gap:6px;">
                ${r.recipeUrl ? `
                  <a href="${escapeHtml(r.recipeUrl)}" target="_blank" rel="noopener noreferrer" class="k-recipe-web-link">
                    <i data-lucide="external-link" style="width:10px; height:10px;"></i>
                    <span>Recipe</span>
                  </a>
                ` : `<span></span>`}

                <div style="display:flex; gap:6px; align-items:center;">
                  <button type="button" class="k-btn-move-vault" onclick="kMoveNewRecipeToVault('${r.id}')" title="Love this recipe? Move it to your Household Favorites Vault!">
                    <span>Move to Vault 💜</span>
                  </button>

                  <select class="k-assign-select" onchange="kAssignNewRecipeToMeal('${r.id}', this.value); this.value='';">
                    ${kRenderAssignSelectOptions()}
                  </select>
                </div>
              </div>
            </div>
          `).join('') : `
            <div style="grid-column: 1 / -1; padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 12.5px; border: 1px dashed var(--border-subtle, rgba(31,42,68,0.12)); border-radius: 12px;">
              🧪 No new recipes queued yet. Found an exciting dish to try? Tap <strong>+ Add Recipe to Try</strong> to test it before moving to your Vault!
            </div>
          `}
        </div>
      </section>

      <!-- STEP 5: VISIBLE GROCERY LIST & THINGS 3 EXPORTER -->
      <section class="k-grocery-card" id="k-sec-groceries">
        <div class="k-grocery-top-bar">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="k-step-indicator" style="background:var(--pal-sage-soft); color:#3B6B35;">STEP 5</span>
              <span style="font-size:16px; font-weight:700; color:var(--text-primary);">Verify Grocery List</span>
              <span style="font-size:12px; font-weight:700; color:var(--text-muted);">(${groceryItems.filter(g => !g.checked).length} items needed)</span>
            </div>
            <span style="font-size:12px; color:var(--text-muted); margin-top:2px; display:block;">
              Check items you already have to exclude them before opening Things 3.
            </span>
          </div>

          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <button type="button" class="k-btn-copy-things" onclick="kOpenThings3()" title="Open Things 3 natively and create Grocery project">
              <i data-lucide="external-link" style="width:14px; height:14px;"></i>
              <span>Open in Things 3</span>
            </button>
            <button type="button" class="k-btn-action" onclick="kExportVerifiedThings3()" style="height:36px; padding:0 12px; font-size:12px;" title="Copy markdown checklist to clipboard">
              <i data-lucide="copy" style="width:13px; height:13px;"></i>
              <span>Copy Text</span>
            </button>
          </div>
        </div>

        <div class="k-grocery-items-list" id="k-grocery-items-wrap" style="margin-top:10px;">
          ${groceryItems.length > 0 ? groceryItems.map(item => `
            <div class="k-grocery-row ${item.checked ? 'checked' : ''}" onclick="kToggleGroceryItemPersist('${item.id}')">
              <div style="display:flex; align-items:center;">
                <span class="k-grocery-check">${item.checked ? '✓' : ''}</span>
                <span>${escapeHtml(item.text)}</span>
              </div>
              <button class="k-grocery-del-btn" onclick="event.stopPropagation(); kDeleteGroceryItem('${item.id}')">×</button>
            </div>
          `).join('') : `
            <div style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 12.5px; border: 1px dashed var(--border-subtle, rgba(31,42,68,0.12)); border-radius: 12px;">
              🛒 Your grocery list is empty. Add grocery items below to start your list!
            </div>
          `}
        </div>

        ${stashItems.filter(i => i.used).length > 0 ? `
          <div class="k-dept-box" style="background:var(--pal-seafoam-soft); border-color:var(--pal-seafoam); margin-top:10px;">
            <div class="k-dept-head" style="color:var(--pal-azure);">
              <span>✨ Stash Items Skipped (Saved $)</span>
            </div>
            <div style="font-size:12px; color:var(--text-secondary); line-height:1.5;">
              ${stashItems.filter(i => i.used).map(i => `• ${escapeHtml(i.name)} (${i.type === 'freezer' ? 'freezer' : 'pantry'})`).join('<br>')}
            </div>
          </div>
        ` : ''}

        <!-- Add Custom Grocery Item Field -->
        <div style="display:flex; gap:8px; margin-top:10px; align-items:center;">
          <input type="text" class="k-clean-input" id="k-add-extra-grocery" name="k_extra_grocery_input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-form-type="other" placeholder="+ Add a grocery item (e.g. Oat milk, Lemons, Coffee beans)..." onkeydown="if(event.key==='Enter') kAddExtraGroceryItem()">
          <button type="button" class="k-btn-action" onclick="kAddExtraGroceryItem()">
            <i data-lucide="plus" style="width:13px; height:13px;"></i>
            <span>Add Item</span>
          </button>
        </div>
      </section>

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
  const input = document.getElementById('k-stash-input');
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

function kCycleStashType(id, event) {
  if (event) event.stopPropagation();
  const data = storage.getKitchenData();
  const item = (data.stashItems || []).find(i => i.id === id);
  if (!item) return;

  const cycle = ['pantry', 'fridge', 'freezer'];
  const curIdx = cycle.indexOf(item.type);
  const nextType = cycle[(curIdx + 1) % cycle.length];
  item.type = nextType;
  item.badge = nextType === 'freezer' ? 'Freezer' : (nextType === 'fridge' ? 'Fridge' : 'Pantry');

  storage.saveKitchenData(data);
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Updated "${item.name}" to ${item.badge}`);
}
window.kCycleStashType = kCycleStashType;

function kAssignStashDirect(name, type) {
  kOpenMealPicker(0, 'dinner');
  const nameEl = document.getElementById('k-modal-custom-name');
  if (nameEl) nameEl.value = name;
  const sourceEl = document.getElementById('k-modal-custom-source');
  if (sourceEl) sourceEl.value = type;
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
  if (t.includes('salad') || t.includes('greens') || t.includes('slaw') || t.includes('caesar')) return 'salad';
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

function kOpenMealPicker(dayIdx, mealType = 'dinner') {
  activeKitchenEditIdx = dayIdx;
  activeKitchenMealType = mealType;

  kSetModalMealType(mealType, false);

  const modal = document.getElementById('k-fast-meal-modal');
  if (modal) modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}
window.kOpenMealPicker = kOpenMealPicker;

function kSetModalMealType(newType, reFocus = true) {
  activeKitchenMealType = newType;
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
  const schedule = weekOffset === 1 ? data.followingWeekSchedule : data.weekSchedule;
  const d = (activeKitchenEditIdx !== null && schedule && schedule[activeKitchenEditIdx]) ? schedule[activeKitchenEditIdx] : { day: 'Day', date: '', meals: {} };
  const slot = (d.meals && d.meals[newType]) ? d.meals[newType] : null;

  const typeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
  const label = typeLabels[newType] || 'Meal';

  const titleEl = document.getElementById('k-fast-modal-title');
  if (titleEl) {
    const weekNote = weekOffset === 1 ? ' (Following Week)' : '';
    titleEl.textContent = `Enter ${label} · ${d.day}${d.date ? ` (${d.date})` : ''}${weekNote}`;
  }

  const nameEl = document.getElementById('k-modal-custom-name');
  if (nameEl) nameEl.value = slot ? (slot.meal || '') : '';

  const urlEl = document.getElementById('k-modal-custom-url');
  if (urlEl) urlEl.value = slot ? (slot.recipeUrl || '') : '';

  const sourceEl = document.getElementById('k-modal-custom-source');
  if (sourceEl) sourceEl.value = slot ? (slot.source || 'pantry') : 'pantry';

  const submitBtn = document.getElementById('k-modal-submit-btn');
  if (submitBtn) submitBtn.textContent = `Save ${label}`;

  const clearBtn = document.getElementById('k-modal-clear-btn');
  if (clearBtn) clearBtn.style.display = (slot && slot.meal) ? 'inline-block' : 'none';

  // Populate stash picker items
  const stashContainer = document.getElementById('k-modal-stash-list');
  if (stashContainer) {
    const stashItems = (data.stashItems || []).filter(i => !i.used);
    if (stashItems.length > 0) {
      stashContainer.innerHTML = stashItems.map(i => `
        <div class="k-modal-pick-item" onclick="kSelectStashForMeal('${escapeHtml(i.name)}', '${i.type}')">
          <div style="font-weight:600; color:var(--text-primary);">${escapeHtml(i.name)}</div>
          <span class="k-stash-tag-badge ${i.type}">${i.type === 'freezer' ? 'Freezer' : 'Pantry'}</span>
        </div>
      `).join('');
    } else {
      stashContainer.innerHTML = `<div style="font-size:12px; color:var(--text-muted); padding:6px 0;">No active stash items available.</div>`;
    }
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
            const courseLabel = { main: 'Main 🍲', side: 'Side 🥗', dessert: 'Dessert 🍨' }[r.course || 'main'] || 'Main';
            const extra = (r.tags || []).filter(t => !['main', 'side', 'dessert', 'favorite'].includes(String(t).toLowerCase()));
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
  const schedule = weekOffset === 1 ? data.followingWeekSchedule : data.weekSchedule;

  if (!Array.isArray(schedule) || !schedule[activeKitchenEditIdx]) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    while (schedule.length < 7) {
      const idx = schedule.length;
      schedule.push({ day: dayNames[idx], date: '', meal: '', source: 'pantry', icon: 'pasta', meals: { brunch: null, lunch: null, dinner: null, dessert: null } });
    }
  }
  const d = schedule[activeKitchenEditIdx];
  if (!d.meals) d.meals = { brunch: null, lunch: null, dinner: null, dessert: null };

  const typeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
  const label = typeLabels[mealType] || 'Meal';

  if (name) {
    const icon = source === 'out' ? (mealType === 'dessert' ? 'dessert' : (d.day === 'Sat' ? 'bistro' : 'takeout')) : detectRecipeIcon(name, mealType);
    d.meals[mealType] = {
      meal: name,
      recipeUrl: url,
      source: source,
      icon: icon,
      favoriteId: null
    };
    if (mealType === 'dinner') {
      d.meal = name;
      d.recipeUrl = url;
      d.source = source;
      d.icon = icon;
    }
  } else {
    d.meals[mealType] = null;
    if (mealType === 'dinner') {
      d.meal = '';
      d.recipeUrl = '';
    }
  }

  storage.saveKitchenData(data);
  kCloseModal();
  renderKitchenPage();
  if (typeof showToast === 'function') {
    showToast(name ? `Updated ${d.day} ${label}! ✨` : `Cleared ${d.day} ${label}`);
  }
}
window.kSubmitCustomMeal = kSubmitCustomMeal;

function kClearCurrentMealSlot() {
  if (activeKitchenEditIdx === null) return;
  const mealType = activeKitchenMealType || 'dinner';
  const data = storage.getKitchenData();
  const weekOffset = data.activeWeekOffset || 0;
  const schedule = weekOffset === 1 ? data.followingWeekSchedule : data.weekSchedule;
  const d = schedule[activeKitchenEditIdx];

  if (d && d.meals) {
    d.meals[mealType] = null;
    if (mealType === 'dinner') {
      d.meal = '';
      d.recipeUrl = '';
    }
  }

  const typeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
  const label = typeLabels[mealType] || 'Meal';

  storage.saveKitchenData(data);
  kCloseModal();
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Cleared ${d.day} ${label}`);
}
window.kClearCurrentMealSlot = kClearCurrentMealSlot;

function kSelectStashForMeal(name, type) {
  if (activeKitchenEditIdx === null) return;
  const mealType = activeKitchenMealType || 'dinner';
  const data = storage.getKitchenData();
  const weekOffset = data.activeWeekOffset || 0;
  const schedule = weekOffset === 1 ? data.followingWeekSchedule : data.weekSchedule;
  const d = schedule[activeKitchenEditIdx];
  if (!d.meals) d.meals = { brunch: null, lunch: null, dinner: null, dessert: null };

  const icon = type === 'freezer' ? 'salmon' : 'risotto';
  d.meals[mealType] = {
    meal: name,
    source: type,
    icon: icon,
    recipeUrl: '',
    favoriteId: null
  };

  if (mealType === 'dinner') {
    d.meal = name;
    d.source = type;
    d.icon = icon;
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
  const schedule = weekOffset === 1 ? data.followingWeekSchedule : data.weekSchedule;
  const d = schedule[activeKitchenEditIdx];
  if (!d.meals) d.meals = { brunch: null, lunch: null, dinner: null, dessert: null };

  const source = (fav.tags || []).some(t => t.includes('Takeout')) ? 'out' : ((fav.tags || []).some(t => t.includes('Freezer')) ? 'freezer' : (fav.tags || []).some(t => t.includes('Pantry')) ? 'pantry' : 'fresh');

  d.meals[mealType] = {
    meal: fav.title,
    icon: fav.icon || detectRecipeIcon(fav.title, mealType),
    recipeUrl: fav.recipeUrl || '',
    source: source,
    favoriteId: fav.id
  };

  if (mealType === 'dinner') {
    d.meal = fav.title;
    d.icon = d.meals[mealType].icon;
    d.recipeUrl = fav.recipeUrl || '';
    d.source = source;
  }

  storage.saveKitchenData(data);
  kCloseModal();
  renderKitchenPage();
  const typeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
  if (typeof showToast === 'function') showToast(`Assigned ${fav.title} to ${d.day} ${typeLabels[mealType] || 'Meal'}! ✨`);
}
window.kSelectFavForMeal = kSelectFavForMeal;

function kCycleSlotSource(dayIdx, mealType, event) {
  if (event) event.stopPropagation();
  const data = storage.getKitchenData();
  const weekOffset = data.activeWeekOffset || 0;
  const schedule = weekOffset === 1 ? data.followingWeekSchedule : data.weekSchedule;
  const d = schedule[dayIdx];
  if (!d || !d.meals || !d.meals[mealType]) return;

  const slot = d.meals[mealType];
  const cycle = ['pantry', 'fridge', 'freezer', 'fresh', 'out'];
  const curIdx = cycle.indexOf(slot.source);
  const nextSource = cycle[(curIdx + 1) % cycle.length];
  slot.source = nextSource;

  if (nextSource === 'out') {
    slot.icon = (mealType === 'dessert') ? 'dessert' : (d.day === 'Sat' ? 'bistro' : 'takeout');
  } else {
    slot.icon = detectRecipeIcon(slot.meal, mealType);
  }

  if (mealType === 'dinner') {
    d.source = slot.source;
    d.icon = slot.icon;
  }

  storage.saveKitchenData(data);
  renderKitchenPage();
}
window.kCycleSlotSource = kCycleSlotSource;

function kToggleFavSlot(dayIdx, mealType, event) {
  if (event) event.stopPropagation();
  const data = storage.getKitchenData();
  const weekOffset = data.activeWeekOffset || 0;
  const schedule = weekOffset === 1 ? data.followingWeekSchedule : data.weekSchedule;
  const d = schedule[dayIdx];
  const slot = (d && d.meals) ? d.meals[mealType] : null;

  if (!slot || !slot.meal) {
    kOpenMealPicker(dayIdx, mealType);
    return;
  }

  const favIdx = (data.favoriteRecipes || []).findIndex(r => r.title.toLowerCase() === slot.meal.toLowerCase());
  if (favIdx !== -1) {
    data.favoriteRecipes.splice(favIdx, 1);
    storage.saveKitchenData(data);
    renderKitchenPage();
    if (typeof showToast === 'function') showToast(`Removed "${slot.meal}" from Favorites`);
  } else {
    if (!data.favoriteRecipes) data.favoriteRecipes = [];
    const typeLabel = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' }[mealType] || 'Favorite';
    data.favoriteRecipes.push({
      id: 'r-' + Date.now(),
      title: slot.meal,
      icon: slot.icon || (slot.source === 'out' ? 'takeout' : 'chicken'),
      tags: [slot.source === 'out' ? '🥡 Takeout' : typeLabel],
      recipeUrl: slot.recipeUrl || '',
      ingredients: 'Trusted favorite recipe',
      stashMatch: null
    });
    storage.saveKitchenData(data);
    renderKitchenPage();
    if (typeof showToast === 'function') showToast(`Saved "${slot.meal}" to Favorites Vault! 💜`);
    if (typeof confetti === 'function') {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 }, colors: ['#8B5CF6', '#6D28D9', '#0D98BA', '#C084FC'] });
    }
  }
}
window.kToggleFavSlot = kToggleFavSlot;

function kToggleFavoriteDayMeal(dayIdx) {
  kToggleFavSlot(dayIdx, 'dinner');
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

  const schedule = weekOffset === 1 ? data.followingWeekSchedule : data.weekSchedule;
  const d = schedule[dayIdx];
  if (!d) return;
  if (!d.meals) d.meals = { brunch: null, lunch: null, dinner: null, dessert: null };

  const source = (fav.tags || []).some(t => t.includes('Takeout')) ? 'out' : ((fav.tags || []).some(t => t.includes('Freezer')) ? 'freezer' : (fav.tags || []).some(t => t.includes('Pantry')) ? 'pantry' : 'fresh');

  d.meals[mealType] = {
    meal: fav.title,
    source: source,
    icon: fav.icon || detectRecipeIcon(fav.title, mealType),
    recipeUrl: fav.recipeUrl || '',
    favoriteId: fav.id
  };

  if (mealType === 'dinner') {
    d.meal = fav.title;
    d.source = source;
    d.icon = d.meals[mealType].icon;
    d.recipeUrl = fav.recipeUrl || '';
    d.favoriteId = fav.id;
  }

  data.activeWeekOffset = weekOffset;
  storage.saveKitchenData(data);
  renderKitchenPage();
  const label = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' }[mealType] || 'Meal';
  const weekLabel = weekOffset === 1 ? ' (Following Week)' : '';
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
  ['main', 'side', 'dessert'].forEach(c => {
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

  const icon = detectRecipeIcon(title, course === 'dessert' ? 'dessert' : 'dinner');
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

  const schedule = weekOffset === 1 ? data.followingWeekSchedule : data.weekSchedule;
  const d = schedule[dayIdx];
  if (!d) return;
  if (!d.meals) d.meals = { brunch: null, lunch: null, dinner: null, dessert: null };

  d.meals[mealType] = {
    meal: item.title,
    source: 'fresh',
    icon: item.icon || detectRecipeIcon(item.title, mealType),
    recipeUrl: item.recipeUrl || '',
    favoriteId: null
  };

  if (mealType === 'dinner') {
    d.meal = item.title;
    d.source = 'fresh';
    d.icon = d.meals[mealType].icon;
    d.recipeUrl = item.recipeUrl || '';
  }

  data.activeWeekOffset = weekOffset;
  storage.saveKitchenData(data);
  renderKitchenPage();
  const label = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' }[mealType] || 'Meal';
  const weekLabel = weekOffset === 1 ? ' (Following Week)' : '';
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

  const cycle = ['main', 'side', 'dessert'];
  const curIdx = cycle.indexOf(r.course || 'main');
  r.course = cycle[(curIdx + 1) % cycle.length];

  if (Array.isArray(r.tags)) {
    r.tags = r.tags.filter(t => !['main', 'side', 'dessert', 'favorite'].includes(String(t).toLowerCase()));
  }

  storage.saveKitchenData(data);
  renderKitchenPage();
  const labels = { main: 'Main 🍲', side: 'Side 🥗', dessert: 'Dessert 🍨' };
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

// 1-Tap Native Things 3 URL Scheme Integration
function kOpenThings3() {
  const data = storage.getKitchenData();
  const weekOffset = data.activeWeekOffset || 0;
  const schedule = weekOffset === 1 ? data.followingWeekSchedule : data.weekSchedule;
  const weekTitle = weekOffset === 1 ? 'Following Week' : 'This Week';

  const groceries = (data.groceries || []).filter(g => !g.checked);
  const rawItems = groceries.map(g => g.text).filter(Boolean);

  const mealLines = [];
  const typeOrder = ['brunch', 'lunch', 'dinner', 'dessert'];
  const typeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
  (schedule || []).forEach(d => {
    const m = d.meals || {};
    typeOrder.forEach(t => {
      const slot = m[t];
      if (slot && slot.meal) {
        mealLines.push(`• ${d.day} ${typeLabels[t]}: ${slot.meal} (${slot.source === 'out' ? 'Takeout 🥡' : (slot.source === 'freezer' ? 'Freezer 🧊' : (slot.source === 'pantry' ? 'Pantry 🥫' : 'Fresh 🛒'))})`);
      }
    });
  });

  const notes = `Planned in margo (${weekTitle}):\n${mealLines.length ? mealLines.join('\n') : '(No meals planned yet)'}\n\nEat Out Target: ${data.eatOutTarget || 2}x`;
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
  const schedule = weekOffset === 1 ? data.followingWeekSchedule : data.weekSchedule;
  const weekTitle = weekOffset === 1 ? 'Following Week' : 'This Week';

  const groceries = (data.groceries || []).filter(g => !g.checked);
  const items = groceries.map(g => `[ ] ${g.text}`).filter(Boolean);

  const mealLines = [];
  const typeOrder = ['brunch', 'lunch', 'dinner', 'dessert'];
  const typeLabels = { brunch: 'Brunch', lunch: 'Lunch', dinner: 'Dinner', dessert: 'Dessert' };
  (schedule || []).forEach(d => {
    const m = d.meals || {};
    typeOrder.forEach(t => {
      const slot = m[t];
      if (slot && slot.meal) {
        mealLines.push(`• ${d.day} ${typeLabels[t]}: ${slot.meal} (${slot.source === 'out' ? 'Takeout 🥡' : (slot.source === 'freezer' ? 'Freezer 🧊' : (slot.source === 'pantry' ? 'Pantry 🥫' : 'Fresh 🛒'))})`);
      }
    });
  });

  const text = `Weekly Groceries (${weekTitle})\n${items.length ? items.join('\n') : '(No groceries entered)'}\n\nMeals Planned in margo:\n${mealLines.length ? mealLines.join('\n') : '(No meals planned)'}\n\nEat Out: ${data.eatOutTarget || 2}x target`;

  navigator.clipboard.writeText(text).then(() => {
    if (typeof showToast === 'function') showToast(`✓ Copied ${items.length} verified grocery items for Things 3!`);
    if (typeof confetti === 'function') {
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.8 }, colors: ['#8B5CF6', '#6D28D9', '#0D98BA', '#C084FC'] });
    }
  }).catch(() => {
    if (typeof showToast === 'function') showToast('✓ Ready for Things 3');
  });
}
