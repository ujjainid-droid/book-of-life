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
  `
};

let activeKitchenEditIdx = null;

// Helper to get today's ISO date string
function getTodayIso() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function renderKitchenPage() {
  const container = document.getElementById('daily-sheet-container');
  if (!container) return;

  const data = storage.getKitchenData();
  const stashItems = data.stashItems || [];
  const weekSchedule = data.weekSchedule || [];
  const favoriteRecipes = data.favoriteRecipes || [];
  const groceryItems = data.groceries || [
    { id: 'g1', dept: 'produce', text: 'Broccoli florets & sweet potatoes', checked: false },
    { id: 'g2', dept: 'produce', text: 'Fresh cilantro & 3 limes', checked: false },
    { id: 'g3', dept: 'produce', text: 'Baby spinach (1 tub)', checked: false },
    { id: 'g4', dept: 'produce', text: 'Avocados (3 ripe)', checked: false },
    { id: 'g5', dept: 'dairy', text: 'Greek yogurt (plain 32oz)', checked: false },
    { id: 'g6', dept: 'dairy', text: 'Grated parmesan wedge', checked: false },
    { id: 'g7', dept: 'dry', text: 'Corn tortillas (1 pack)', checked: false }
  ];

  const todayIso = getTodayIso();

  // Ensure dates are attached to days
  // Standard week: Sunday Oct 18 - Saturday Oct 24 (or active week)
  const dayDates = ['2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24'];

  const outCount = weekSchedule.filter(d => d.source === 'out').length;
  const target = data.eatOutTarget || 2;
  const withinTarget = outCount <= target;

  const stashMealCount = weekSchedule.filter(d => d.source === 'freezer' || d.source === 'pantry').length;
  const freshMealCount = weekSchedule.filter(d => d.source === 'fresh').length;

  container.innerHTML = `
    <div class="kitchen-workflow-wrap">

      <!-- HEADER: WEEKLY REALITY CHECK -->
      <header class="k-header-card">
        <div class="k-header-titles">
          <div class="k-header-main-row">
            <h2 class="k-header-title">Kitchen Sanctuary</h2>
            <span class="k-header-week-tag">Sun Oct 18 – Sat Oct 24</span>
          </div>
          <span style="font-size:12px; color:var(--text-muted);">Shop your stash first, dinner on autopilot.</span>
        </div>

        <div class="k-eatout-summary-pill" title="Friday takeout + weekend dining out">
          <span>🥡 Eat-Out Nights:</span>
          <span class="k-eatout-badge">${outCount}x</span>
          <span style="font-size:11px; color:${withinTarget ? '#3B6B35' : 'var(--pal-coral)'}; font-weight:700;">
            ${withinTarget ? `✓ On Target (≤ ${target}x)` : `Over Target (${target}x)`}
          </span>
        </div>
      </header>

      <!-- STEP 1: SHOP THE STASH FIRST (2 Separate Buttons: Freezer & Pantry) -->
      <section class="k-section-box" id="k-sec-stash">
        <div class="k-sec-header">
          <div class="k-sec-title-group">
            <span class="k-step-indicator">STEP 1</span>
            <span class="k-sec-title">Shop Your Stash First</span>
          </div>
          <span class="k-sec-hint">Tap checkbox when used · Tap name to assign to dinner</span>
        </div>

        <!-- Stash Chips -->
        <div class="k-stash-chips-row">
          ${stashItems.map(item => `
            <div class="k-stash-chip ${item.used ? 'is-used' : ''}">
              <span class="k-stash-check" onclick="kToggleStashUsed('${item.id}', event)" title="${item.used ? 'Mark active' : 'Check off as used'}">✓</span>
              <span class="k-stash-text" onclick="kAssignStashDirect('${escapeHtml(item.name)}', '${item.type}')">${escapeHtml(item.name)}</span>
              <span class="k-stash-tag-badge ${item.type}">${item.type === 'freezer' ? 'Freezer' : 'Pantry'}</span>
              <button class="kitchen-stash-del-btn" onclick="event.stopPropagation(); kDeleteStash('${item.id}')">×</button>
            </div>
          `).join('')}
        </div>

        <!-- 2 Separate Buttons (Freezer & Pantry) instead of dropdown -->
        <div class="k-stash-quick-bar">
          <input type="text" class="k-clean-input" id="k-stash-input" placeholder="+ Add stash item to use up (e.g. Salmon, Ground Turkey, Rice)..." onkeydown="if(event.key==='Enter') kAddStashWithSource('freezer')">
          <button type="button" class="k-btn-stash-add freezer" onclick="kAddStashWithSource('freezer')" title="Add directly to Freezer">
            🧊 + Freezer
          </button>
          <button type="button" class="k-btn-stash-add pantry" onclick="kAddStashWithSource('pantry')" title="Add directly to Pantry">
            🥫 + Pantry
          </button>
        </div>
      </section>

      <!-- STEP 2: 7-NIGHT DINNER BOARD (Past days grayed/lightened out) -->
      <section class="k-section-box" id="k-sec-dinners">
        <div class="k-sec-header">
          <div class="k-sec-title-group">
            <span class="k-step-indicator">STEP 2</span>
            <span class="k-sec-title">7-Night Dinner Board</span>
          </div>
          <span class="k-sec-hint">Click ✏️ Edit or meal title to enter dinner</span>
        </div>

        <div class="k-week-list">
          ${weekSchedule.map((d, idx) => {
            const iso = d.iso || dayDates[idx] || '2026-10-24';
            const isPast = iso < todayIso;
            const isToday = iso === todayIso;

            const isFri = (d.day === 'Fri');
            const isOut = (d.source === 'out');
            const iconSvg = KITCHEN_ICONS[d.icon] || (isOut ? KITCHEN_ICONS.takeout : KITCHEN_ICONS.salmon);
            const isFav = favoriteRecipes.some(r => r.title.toLowerCase() === d.meal.toLowerCase());

            let pillLabel = 'Fresh 🛒';
            if (d.source === 'freezer') pillLabel = 'Freezer 🧊';
            else if (d.source === 'pantry') pillLabel = 'Pantry 🥫';
            else if (isFri && isOut) pillLabel = 'Friday Takeout 🥡';
            else if (isOut) pillLabel = 'Dining Out 🍷';

            return `
              <div class="k-day-row ${isOut ? 'is-takeout-row' : ''} ${isPast ? 'is-past-day' : ''} ${isToday ? 'is-today-row' : ''}">
                <div class="k-day-meta">
                  <span class="k-day-name">${d.day}</span>
                  <div class="k-day-date-row">
                    <span class="k-day-date">${d.date}</span>
                    ${isToday ? `<span class="k-badge-day-status today">Today</span>` : (isPast ? `<span class="k-badge-day-status past">Past</span>` : '')}
                  </div>
                </div>

                <div class="k-avatar-icon" onclick="kOpenMealPicker(${idx})" title="Click to edit dinner">
                  ${iconSvg}
                </div>

                <div class="k-meal-center">
                  <div class="k-meal-name-row">
                    <span class="k-meal-title-text" onclick="kOpenMealPicker(${idx})" title="Click to enter/edit dinner">
                      ${escapeHtml(d.meal)}
                    </span>
                    <button type="button" class="k-source-pill ${d.source}" onclick="kCycleDaySource(${idx})" title="Click to flip (Takeout, Freezer, Pantry, Fresh)">
                      ${pillLabel}
                    </button>
                  </div>

                  ${d.recipeUrl ? `
                    <div>
                      <a href="${escapeHtml(d.recipeUrl)}" target="_blank" rel="noopener noreferrer" class="k-recipe-web-link">
                        <i data-lucide="external-link" style="width:11px; height:11px;"></i>
                        <span>Recipe Link</span>
                      </a>
                    </div>
                  ` : ''}
                </div>

                <div class="k-day-actions-box">
                  <button type="button" class="k-btn-edit-dinner" onclick="kOpenMealPicker(${idx})" title="Enter or change dinner for ${d.day}">
                    <span>✏️ Edit</span>
                  </button>
                  <button type="button" class="k-icon-btn ${isFav ? 'is-fav' : ''}" title="${isFav ? 'In Favorites' : 'Save dish to Favorites Vault'}" onclick="kToggleFavoriteDayMeal(${idx})">
                    <i data-lucide="heart" style="width:13px; height:13px;"></i>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- STEP 3: HOUSEHOLD FAVORITES VAULT (Visible list) -->
      <section class="k-section-box" id="k-sec-favorites">
        <div class="k-sec-header">
          <div class="k-sec-title-group">
            <span class="k-step-indicator" style="background:var(--pal-coral-soft); color:var(--pal-coral);">FAVORITES</span>
            <span class="k-sec-title">Household Favorites Vault</span>
            <span style="font-size:11px; font-weight:700; color:var(--text-muted);">(${favoriteRecipes.length} trusted recipes)</span>
          </div>
          <button type="button" class="k-btn-action" onclick="kOpenAddFavModal()">
            <i data-lucide="plus" style="width:13px; height:13px;"></i>
            <span>Add Recipe</span>
          </button>
        </div>

        <div class="k-favs-shelf">
          ${favoriteRecipes.map(r => `
            <div class="k-fav-card">
              <div class="k-fav-top">
                <div class="k-avatar-icon" style="width:32px; height:32px;">
                  ${KITCHEN_ICONS[r.icon] || KITCHEN_ICONS.salmon}
                </div>
                <div style="flex:1; min-width:0;">
                  <div class="k-fav-title">${escapeHtml(r.title)}</div>
                  <div style="display:flex; gap:4px; flex-wrap:wrap; margin-top:2px;">
                    ${(r.tags || []).map(t => `<span style="font-size:9.5px; font-weight:700; padding:1px 5px; border-radius:4px; background:var(--pal-azure-soft); color:var(--pal-azure);">${escapeHtml(t)}</span>`).join('')}
                  </div>
                </div>
              </div>

              <div class="k-fav-ingredients">
                ${escapeHtml(r.ingredients || '')}
              </div>

              <div class="k-fav-footer">
                ${r.recipeUrl ? `
                  <a href="${escapeHtml(r.recipeUrl)}" target="_blank" rel="noopener noreferrer" class="k-recipe-web-link">
                    <i data-lucide="external-link" style="width:10px; height:10px;"></i>
                    <span>Recipe</span>
                  </a>
                ` : `<span></span>`}

                <select class="k-clean-input" style="padding:2px 6px; font-size:11px; width:auto;" onchange="kAssignFavToDay('${r.id}', this.value); this.value='';">
                  <option value="">Assign to...</option>
                  <option value="0">Sun</option>
                  <option value="1">Mon</option>
                  <option value="2">Tue</option>
                  <option value="3">Wed</option>
                  <option value="4">Thu</option>
                  <option value="5">Fri (Takeout)</option>
                  <option value="6">Sat</option>
                </select>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- STEP 4: VISIBLE GROCERY LIST & THINGS 3 EXPORTER -->
      <section class="k-grocery-card" id="k-sec-groceries">
        <div class="k-grocery-top-bar">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="k-step-indicator" style="background:var(--pal-sage-soft); color:#3B6B35;">STEP 3</span>
              <span style="font-size:16px; font-weight:700; color:var(--text-primary);">Verify Grocery List</span>
            </div>
            <span style="font-size:12px; color:var(--text-muted); margin-top:2px; display:block;">
              Check items you already have to exclude them before copying to Things 3.
            </span>
          </div>

          <button type="button" class="k-btn-copy-things" onclick="kExportVerifiedThings3()">
            <i data-lucide="copy" style="width:14px; height:14px;"></i>
            <span>Copy Verified List for Things 3</span>
          </button>
        </div>

        <div class="k-grocery-sections-grid">
          <!-- Produce -->
          <div class="k-dept-box">
            <div class="k-dept-head">
              <span>🥦 Produce &amp; Fresh</span>
              <span>4</span>
            </div>
            <div class="k-grocery-items-list" id="k-grocery-produce-list">
              <div class="k-grocery-row" onclick="kToggleGroceryItem(this)">
                <div style="display:flex; align-items:center;">
                  <span class="k-grocery-check">✓</span>
                  <span>Broccoli florets &amp; sweet potatoes</span>
                </div>
                <button class="k-grocery-del-btn" onclick="event.stopPropagation(); this.parentElement.remove();">×</button>
              </div>
              <div class="k-grocery-row" onclick="kToggleGroceryItem(this)">
                <div style="display:flex; align-items:center;">
                  <span class="k-grocery-check">✓</span>
                  <span>Fresh cilantro &amp; 3 limes</span>
                </div>
                <button class="k-grocery-del-btn" onclick="event.stopPropagation(); this.parentElement.remove();">×</button>
              </div>
              <div class="k-grocery-row" onclick="kToggleGroceryItem(this)">
                <div style="display:flex; align-items:center;">
                  <span class="k-grocery-check">✓</span>
                  <span>Baby spinach (1 tub)</span>
                </div>
                <button class="k-grocery-del-btn" onclick="event.stopPropagation(); this.parentElement.remove();">×</button>
              </div>
              <div class="k-grocery-row" onclick="kToggleGroceryItem(this)">
                <div style="display:flex; align-items:center;">
                  <span class="k-grocery-check">✓</span>
                  <span>Avocados (3 ripe)</span>
                </div>
                <button class="k-grocery-del-btn" onclick="event.stopPropagation(); this.parentElement.remove();">×</button>
              </div>
            </div>
          </div>

          <!-- Dairy & Refrigerated -->
          <div class="k-dept-box">
            <div class="k-dept-head">
              <span>🧀 Dairy &amp; Refrigerated</span>
              <span>2</span>
            </div>
            <div class="k-grocery-items-list" id="k-grocery-dairy-list">
              <div class="k-grocery-row" onclick="kToggleGroceryItem(this)">
                <div style="display:flex; align-items:center;">
                  <span class="k-grocery-check">✓</span>
                  <span>Greek yogurt (plain 32oz)</span>
                </div>
                <button class="k-grocery-del-btn" onclick="event.stopPropagation(); this.parentElement.remove();">×</button>
              </div>
              <div class="k-grocery-row" onclick="kToggleGroceryItem(this)">
                <div style="display:flex; align-items:center;">
                  <span class="k-grocery-check">✓</span>
                  <span>Grated parmesan wedge</span>
                </div>
                <button class="k-grocery-del-btn" onclick="event.stopPropagation(); this.parentElement.remove();">×</button>
              </div>
            </div>
          </div>

          <!-- Bakery & Dry Essentials -->
          <div class="k-dept-box">
            <div class="k-dept-head">
              <span>🌾 Bakery &amp; Pantry Dry</span>
              <span>1</span>
            </div>
            <div class="k-grocery-items-list" id="k-grocery-dry-list">
              <div class="k-grocery-row" onclick="kToggleGroceryItem(this)">
                <div style="display:flex; align-items:center;">
                  <span class="k-grocery-check">✓</span>
                  <span>Corn tortillas (1 pack)</span>
                </div>
                <button class="k-grocery-del-btn" onclick="event.stopPropagation(); this.parentElement.remove();">×</button>
              </div>
            </div>
          </div>

          <!-- Stash Items Saved (Zero Cost) -->
          <div class="k-dept-box" style="background:var(--pal-seafoam-soft); border-color:var(--pal-seafoam);">
            <div class="k-dept-head" style="color:var(--pal-azure);">
              <span>✨ Stash Items Skipped (Saved $)</span>
            </div>
            <div style="font-size:12px; color:var(--text-secondary); line-height:1.5;">
              • Salmon fillets (already in freezer)<br>
              • Ground turkey (already in freezer)<br>
              • Black beans &amp; risotto rice (already in pantry)
            </div>
          </div>
        </div>

        <!-- Add Custom Grocery Item Field -->
        <div style="display:flex; gap:8px; margin-top:4px; align-items:center;">
          <input type="text" class="k-clean-input" id="k-add-extra-grocery" placeholder="+ Add another grocery item (e.g. Oat milk, Coffee beans)..." onkeydown="if(event.key==='Enter') kAddExtraGroceryItem()">
          <button type="button" class="k-btn-action" onclick="kAddExtraGroceryItem()">
            <i data-lucide="plus" style="width:13px; height:13px;"></i>
            <span>Add Item</span>
          </button>
        </div>
      </section>

    </div>

    <!-- MODAL: FAST 1-TAP DINNER ENTRY -->
    <div class="modal-overlay" id="k-fast-meal-modal" onclick="if(event.target===this) kCloseModal()">
      <div class="modal-card" style="max-width: 520px; max-height: 85vh; overflow-y: auto;">
        <div class="modal-header">
          <h3 class="modal-title" id="k-fast-modal-title">Enter Dinner</h3>
          <button class="icon-btn modal-close" onclick="kCloseModal()"><i data-lucide="x"></i></button>
        </div>

        <div style="display:flex; flex-direction:column; gap:14px;">
          <!-- 1. Type or Edit Custom Dish Directly -->
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em;">
              Dish Name &amp; Link:
            </label>
            <div style="display:flex; flex-direction:column; gap:8px; margin-top:6px;">
              <input type="text" class="k-clean-input" id="k-modal-custom-name" placeholder="Dish name (e.g. Lemon Garlic Butter Shrimp Pasta)...">
              <input type="url" class="k-clean-input" id="k-modal-custom-url" placeholder="Recipe URL (e.g. NYT Cooking or Paprika link)...">

              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-top:2px;">
                <div>
                  <label style="font-size:10.5px; font-weight:600; color:var(--text-muted);">Food Icon:</label>
                  <select id="k-modal-custom-icon" class="k-clean-input" style="margin-top:3px; width:100%;">
                    <option value="salmon">🐟 Salmon / Fish</option>
                    <option value="taco">🌮 Taco Bowl</option>
                    <option value="risotto">🍲 Risotto / Stew</option>
                    <option value="chicken">🍗 Skillet Chicken</option>
                    <option value="pasta">🍝 Pasta / Noodles</option>
                    <option value="dumplings">🥟 Dumpling Basket</option>
                    <option value="takeout">🥡 Takeout Box</option>
                    <option value="pizza">🍕 Pizza</option>
                    <option value="bistro">🍷 Dining Out</option>
                    <option value="salad">🥗 Salad</option>
                  </select>
                </div>
                <div>
                  <label style="font-size:10.5px; font-weight:600; color:var(--text-muted);">Source:</label>
                  <select id="k-modal-custom-source" class="k-clean-input" style="margin-top:3px; width:100%;">
                    <option value="fresh">🛒 Fresh Grocery</option>
                    <option value="freezer">🧊 Freezer Stash</option>
                    <option value="pantry">🥫 Pantry Stash</option>
                    <option value="out">🥡 Takeout / Eat Out</option>
                  </select>
                </div>
              </div>

              <button type="button" class="k-btn-action k-btn-submit" onclick="kSubmitCustomMeal()">
                Save Dinner
              </button>
            </div>
          </div>

          <!-- 2. Pick from Stash -->
          <div style="border-top:1px solid var(--border-light, #2E3060); padding-top:12px;">
            <label style="font-size:11px; font-weight:700; color:#8B7FD6; text-transform:uppercase; letter-spacing:0.04em;">
              🧊 Or 1-Tap from Stash:
            </label>
            <div class="k-modal-pick-list" style="margin-top:6px;">
              ${stashItems.filter(i => !i.used).map(i => `
                <div class="k-modal-pick-item" onclick="kSelectStashForMeal('${escapeHtml(i.name)}', '${i.type}')">
                  <div style="font-weight:600; color:var(--text-primary);">${escapeHtml(i.name)}</div>
                  <span class="k-stash-tag-badge ${i.type}">${i.type === 'freezer' ? 'Freezer' : 'Pantry'}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 3. Pick from Favorites -->
          <div style="border-top:1px solid var(--border-light, #2E3060); padding-top:12px;">
            <label style="font-size:11px; font-weight:700; color:#E75480; text-transform:uppercase; letter-spacing:0.04em;">
              💜 Or 1-Tap from Favorites:
            </label>
            <div class="k-modal-pick-list" style="margin-top:6px;">
              ${favoriteRecipes.map(r => `
                <div class="k-modal-pick-item" onclick="kSelectFavForMeal('${r.id}')">
                  <div style="font-weight:600; color:var(--text-primary);">${escapeHtml(r.title)}</div>
                  <span style="font-size:11px; color:var(--text-muted);">${escapeHtml((r.tags || []).join(' · '))}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: ADD TO FAVORITES VAULT -->
    <div class="modal-overlay" id="k-add-fav-modal" onclick="if(event.target===this) kCloseAddFavModal()">
      <div class="modal-card" style="max-width: 520px; max-height: 85vh; overflow-y: auto;">
        <div class="modal-header">
          <h3 class="modal-title">Add to Favorites Vault</h3>
          <button class="icon-btn modal-close" onclick="kCloseAddFavModal()"><i data-lucide="x"></i></button>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em;">Recipe Title:</label>
            <input type="text" class="k-clean-input" id="k-new-fav-title" placeholder="e.g. Crispy Honey Garlic Salmon" style="margin-top:4px; width:100%;">
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
            <div>
              <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em;">Food Icon:</label>
              <select id="k-new-fav-icon" class="k-clean-input" style="margin-top:4px; width:100%;">
                <option value="salmon">🐟 Salmon / Fish</option>
                <option value="taco">🌮 Taco Bowl</option>
                <option value="chicken">🍗 Chicken</option>
                <option value="pasta">🍝 Pasta</option>
                <option value="risotto">🍲 Risotto</option>
                <option value="dumplings">🥟 Dumplings</option>
                <option value="pizza">🍕 Pizza</option>
                <option value="takeout">🥡 Takeout</option>
                <option value="salad">🥗 Salad</option>
              </select>
            </div>
            <div>
              <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em;">Tags:</label>
              <input type="text" class="k-clean-input" id="k-new-fav-tags" placeholder="e.g. ⚡ 20m, 🧊 Freezer" style="margin-top:4px; width:100%;">
            </div>
          </div>

          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em;">Ingredients / Notes:</label>
            <input type="text" class="k-clean-input" id="k-new-fav-ingredients" placeholder="Salmon, garlic, honey, soy sauce, greens" style="margin-top:4px; width:100%;">
          </div>

          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em;">Recipe URL (NYT / Paprika web link):</label>
            <input type="url" class="k-clean-input" id="k-new-fav-url" placeholder="https://..." style="margin-top:4px; width:100%;">
          </div>

          <button type="button" class="k-btn-action k-btn-submit" onclick="kSubmitNewFavorite()">
            Save to Favorites Vault
          </button>
        </div>
      </div>
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

// 2 Separate Buttons: Freezer and Pantry
function kAddStashWithSource(sourceType) {
  const input = document.getElementById('k-stash-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    input.focus();
    return;
  }

  const data = storage.getKitchenData();
  if (!data.stashItems) data.stashItems = [];
  data.stashItems.push({
    id: 's-' + Date.now(),
    type: sourceType,
    name: val,
    badge: sourceType === 'freezer' ? 'Freezer' : 'Pantry',
    used: false
  });
  storage.saveKitchenData(data);
  input.value = '';
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Added "${val}" to ${sourceType === 'freezer' ? 'Freezer' : 'Pantry'}!`);
}

function kAssignStashDirect(name, type) {
  kOpenMealPicker(0);
  document.getElementById('k-modal-custom-name').value = name;
  document.getElementById('k-modal-custom-source').value = type;
  document.getElementById('k-modal-custom-icon').value = (type === 'freezer' ? 'salmon' : 'pasta');
}

function kCycleDaySource(dayIdx) {
  const data = storage.getKitchenData();
  const d = data.weekSchedule[dayIdx];
  const cycle = ['freezer', 'pantry', 'fresh', 'out'];
  const curIdx = cycle.indexOf(d.source);
  const nextSource = cycle[(curIdx + 1) % cycle.length];

  d.source = nextSource;
  if (nextSource === 'out') {
    d.icon = d.day === 'Fri' ? 'takeout' : 'bistro';
    if (!d.meal.toLowerCase().includes('takeout') && !d.meal.toLowerCase().includes('out')) {
      d.meal = d.day === 'Fri' ? 'Friday Night Takeout (Pizza / Thai)' : 'Dinner Out / Takeout';
    }
  } else if (nextSource === 'freezer') {
    d.icon = 'salmon';
  } else if (nextSource === 'pantry') {
    d.icon = 'pasta';
  } else {
    d.icon = 'chicken';
  }

  storage.saveKitchenData(data);
  renderKitchenPage();
}

function kOpenMealPicker(dayIdx) {
  activeKitchenEditIdx = dayIdx;
  const data = storage.getKitchenData();
  const d = data.weekSchedule[dayIdx];

  document.getElementById('k-fast-modal-title').textContent = `Enter Dinner · ${d.day} (${d.date})`;
  document.getElementById('k-modal-custom-name').value = d.meal;
  document.getElementById('k-modal-custom-url').value = d.recipeUrl || '';
  document.getElementById('k-modal-custom-icon').value = d.icon || (d.source === 'out' ? 'takeout' : 'salmon');
  document.getElementById('k-modal-custom-source').value = d.source || 'fresh';

  document.getElementById('k-fast-meal-modal').classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function kSubmitCustomMeal() {
  if (activeKitchenEditIdx === null) return;
  const name = document.getElementById('k-modal-custom-name').value.trim();
  if (!name) return;
  const url = document.getElementById('k-modal-custom-url').value.trim();
  const icon = document.getElementById('k-modal-custom-icon').value;
  const source = document.getElementById('k-modal-custom-source').value;

  const data = storage.getKitchenData();
  const d = data.weekSchedule[activeKitchenEditIdx];
  d.meal = name;
  d.recipeUrl = url;
  d.icon = icon;
  d.source = source;

  storage.saveKitchenData(data);
  kCloseModal();
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Updated ${d.day} dinner! ✨`);
}

function kSelectStashForMeal(name, type) {
  if (activeKitchenEditIdx === null) return;
  const data = storage.getKitchenData();
  const d = data.weekSchedule[activeKitchenEditIdx];

  d.meal = name;
  d.source = type;
  d.icon = type === 'freezer' ? 'salmon' : 'risotto';
  d.recipeUrl = '';

  storage.saveKitchenData(data);
  kCloseModal();
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Assigned ${name} to ${d.day} dinner! ✨`);
}

function kSelectFavForMeal(favId) {
  if (activeKitchenEditIdx === null) return;
  const data = storage.getKitchenData();
  const fav = (data.favoriteRecipes || []).find(r => r.id === favId);
  if (!fav) return;

  const d = data.weekSchedule[activeKitchenEditIdx];
  d.meal = fav.title;
  d.icon = fav.icon || 'chicken';
  d.recipeUrl = fav.recipeUrl || '';
  d.source = (fav.tags || []).some(t => t.includes('Takeout')) ? 'out' : ((fav.tags || []).some(t => t.includes('Freezer')) ? 'freezer' : 'fresh');

  storage.saveKitchenData(data);
  kCloseModal();
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Assigned ${fav.title} to ${d.day} dinner! ✨`);
}

function kToggleFavoriteDayMeal(dayIdx) {
  const data = storage.getKitchenData();
  const meal = data.weekSchedule[dayIdx];
  const favIdx = (data.favoriteRecipes || []).findIndex(r => r.title.toLowerCase() === meal.meal.toLowerCase());

  if (favIdx !== -1) {
    data.favoriteRecipes.splice(favIdx, 1);
    storage.saveKitchenData(data);
    renderKitchenPage();
    if (typeof showToast === 'function') showToast(`Removed "${meal.meal}" from Favorites`);
  } else {
    if (!data.favoriteRecipes) data.favoriteRecipes = [];
    data.favoriteRecipes.push({
      id: 'r-' + Date.now(),
      title: meal.meal,
      icon: meal.icon || (meal.source === 'out' ? 'takeout' : 'chicken'),
      tags: [meal.source === 'out' ? '🥡 Takeout' : 'Favorite'],
      recipeUrl: meal.recipeUrl || '',
      ingredients: 'Trusted favorite recipe',
      stashMatch: null
    });
    storage.saveKitchenData(data);
    renderKitchenPage();
    if (typeof showToast === 'function') showToast(`Saved "${meal.meal}" to Favorites Vault! 💜`);
    if (typeof confetti === 'function') {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 }, colors: ['#1D71B8', '#A9D1D1', '#F87C71', '#FFD7A7'] });
    }
  }
}

function kAssignFavToDay(favId, dayIdxStr) {
  if (!dayIdxStr) return;
  const dayIdx = parseInt(dayIdxStr, 10);
  const data = storage.getKitchenData();
  const fav = (data.favoriteRecipes || []).find(r => r.id === favId);
  if (!fav) return;

  const source = (fav.tags || []).some(t => t.includes('Takeout')) ? 'out' : ((fav.tags || []).some(t => t.includes('Freezer')) ? 'freezer' : (fav.tags || []).some(t => t.includes('Pantry')) ? 'pantry' : 'fresh');

  data.weekSchedule[dayIdx].meal = fav.title;
  data.weekSchedule[dayIdx].source = source;
  data.weekSchedule[dayIdx].icon = fav.icon || 'salmon';
  data.weekSchedule[dayIdx].recipeUrl = fav.recipeUrl || '';

  storage.saveKitchenData(data);
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Assigned "${fav.title}" to ${data.weekSchedule[dayIdx].day} dinner! ✨`);
}

function kOpenAddFavModal() {
  document.getElementById('k-new-fav-title').value = '';
  document.getElementById('k-new-fav-tags').value = '⚡ 20m, 🛒 Fresh';
  document.getElementById('k-new-fav-ingredients').value = '';
  document.getElementById('k-new-fav-url').value = '';
  document.getElementById('k-add-fav-modal').classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function kSubmitNewFavorite() {
  const title = document.getElementById('k-new-fav-title').value.trim();
  if (!title) return;
  const icon = document.getElementById('k-new-fav-icon').value;
  const tagsStr = document.getElementById('k-new-fav-tags').value.trim();
  const ings = document.getElementById('k-new-fav-ingredients').value.trim();
  const url = document.getElementById('k-new-fav-url').value.trim();

  const data = storage.getKitchenData();
  if (!data.favoriteRecipes) data.favoriteRecipes = [];
  data.favoriteRecipes.push({
    id: 'r-' + Date.now(),
    title: title,
    icon: icon,
    tags: tagsStr ? tagsStr.split(',').map(s => s.trim()) : ['Favorite'],
    recipeUrl: url,
    ingredients: ings || 'Custom recipe',
    stashMatch: null
  });

  storage.saveKitchenData(data);
  kCloseAddFavModal();
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Added "${title}" to Favorites Vault! 💜`);
}

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
  if (!val) return;

  const list = document.getElementById('k-grocery-produce-list');
  if (list) {
    const row = document.createElement('div');
    row.className = 'k-grocery-row';
    row.onclick = function() { kToggleGroceryItem(row); };
    row.innerHTML = `
      <div style="display:flex; align-items:center;">
        <span class="k-grocery-check">✓</span>
        <span>${escapeHtml(val)}</span>
      </div>
      <button class="k-grocery-del-btn" onclick="event.stopPropagation(); this.parentElement.remove();">×</button>
    `;
    list.appendChild(row);
    input.value = '';
    if (typeof showToast === 'function') showToast(`Added "${val}" to grocery list`);
  }
}

// Copy ONLY active, verified (unchecked) grocery items to Things 3!
function kExportVerifiedThings3() {
  const data = storage.getKitchenData();
  const rows = document.querySelectorAll('.k-grocery-row:not(.checked)');
  const items = Array.from(rows).map(r => {
    const txt = r.querySelector('span:not(.k-grocery-check)')?.textContent || '';
    return `[ ] ${txt.trim()}`;
  }).filter(Boolean);

  const meals = (data.weekSchedule || []).map(d => `• ${d.day}: ${d.meal} (${d.source === 'out' ? 'Takeout 🥡' : (d.source === 'freezer' ? 'Freezer 🧊' : (d.source === 'pantry' ? 'Pantry 🥫' : 'Fresh 🛒'))})`).join('\n');

  const text = `Weekly Groceries (Oct 18 - 24)
${items.join('\n')}

Dinners Planned in margo:
${meals}

Eat Out: ${data.eatOutTarget || 2}x target`;

  navigator.clipboard.writeText(text).then(() => {
    if (typeof showToast === 'function') showToast(`✓ Copied ${items.length} verified grocery items for Things 3!`);
    if (typeof confetti === 'function') {
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.8 }, colors: ['#1D71B8', '#A9D1D1', '#F87C71', '#FFD7A7'] });
    }
  }).catch(() => {
    if (typeof showToast === 'function') showToast('✓ Ready for Things 3');
  });
}
