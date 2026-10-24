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
  const groceryItems = data.groceries || [];

  const todayIso = getTodayIso();

  // Dynamic current week dates (Sun - Sat)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sun
  const weekDates = [];
  const sunDate = new Date(now);
  sunDate.setDate(now.getDate() - dayOfWeek);

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunDate);
    d.setDate(sunDate.getDate() + i);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    weekDates.push({
      iso: `${yr}-${mo}-${da}`,
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }

  const weekRangeLabel = `${weekDates[0].dateLabel} – ${weekDates[6].dateLabel}`;

  // Ensure full week has 7 days aligned with active week
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullWeekSchedule = dayNames.map((dayName, idx) => {
    const existing = weekSchedule.find(s => s.day === dayName) || {};
    return {
      day: dayName,
      date: weekDates[idx].dateLabel,
      iso: weekDates[idx].iso,
      meal: existing.meal || '',
      source: existing.source || (dayName === 'Fri' || dayName === 'Sat' ? 'out' : 'fresh'),
      icon: existing.icon || (dayName === 'Fri' ? 'takeout' : (dayName === 'Sat' ? 'bistro' : 'chicken')),
      recipeUrl: existing.recipeUrl || '',
      favoriteId: existing.favoriteId || null
    };
  });

  const outCount = fullWeekSchedule.filter(d => d.source === 'out' && d.meal).length;
  const target = data.eatOutTarget || 2;
  const withinTarget = outCount <= target;

  container.innerHTML = `
    <div class="kitchen-workflow-wrap">

      <!-- HEADER: WEEKLY REALITY CHECK -->
      <header class="k-header-card">
        <div class="k-header-titles">
          <div class="k-header-main-row">
            <h2 class="k-header-title">Kitchen Sanctuary</h2>
            <span class="k-header-week-tag">${escapeHtml(weekRangeLabel)}</span>
          </div>
          <span style="font-size:12px; color:var(--text-muted);">Shop your stash first, dinner on autopilot.</span>
        </div>

        <div class="k-eatout-summary-pill" title="Target for dining out / takeout nights">
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
          ${stashItems.length > 0 ? stashItems.map(item => `
            <div class="k-stash-chip ${item.used ? 'is-used' : ''}">
              <span class="k-stash-check" onclick="kToggleStashUsed('${item.id}', event)" title="${item.used ? 'Mark active' : 'Check off as used'}">✓</span>
              <span class="k-stash-text" onclick="kAssignStashDirect('${escapeHtml(item.name)}', '${item.type}')">${escapeHtml(item.name)}</span>
              <span class="k-stash-tag-badge ${item.type}">${item.type === 'freezer' ? 'Freezer' : 'Pantry'}</span>
              <button class="kitchen-stash-del-btn" onclick="event.stopPropagation(); kDeleteStash('${item.id}')">×</button>
            </div>
          `).join('') : `
            <span style="font-size:12px; color:var(--text-muted); font-style:italic; padding:4px 0;">No stash items saved yet. Use the buttons below to log what's in your freezer or pantry.</span>
          `}
        </div>

        <!-- 2 Separate Buttons: Pantry (Default on Enter) and Freezer -->
        <div class="k-stash-quick-bar">
          <input type="text" class="k-clean-input" id="k-stash-input" placeholder="+ Add stash item to use up..." onkeydown="if(event.key==='Enter') kAddStashWithSource('pantry')">
          <button type="button" class="k-btn-stash-add pantry" onclick="kAddStashWithSource('pantry')" title="Add directly to Pantry (Default on Enter)">
            🥫 + Pantry
          </button>
          <button type="button" class="k-btn-stash-add freezer" onclick="kAddStashWithSource('freezer')" title="Add directly to Freezer">
            🧊 + Freezer
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
          ${fullWeekSchedule.map((d, idx) => {
            const isPast = d.iso < todayIso;
            const isToday = d.iso === todayIso;

            const isFri = (d.day === 'Fri');
            const isOut = (d.source === 'out');
            const iconSvg = KITCHEN_ICONS[d.icon] || (isOut ? KITCHEN_ICONS.takeout : KITCHEN_ICONS.chicken);
            const isFav = d.meal && favoriteRecipes.some(r => r.title.toLowerCase() === d.meal.toLowerCase());

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

                <div class="k-avatar-icon" onclick="kOpenMealPicker(${idx})" title="Click to enter/edit dinner">
                  ${iconSvg}
                </div>

                <div class="k-meal-center">
                  <div class="k-meal-name-row">
                    <span class="k-meal-title-text" onclick="kOpenMealPicker(${idx})" title="Click to enter/edit dinner">
                      ${d.meal ? escapeHtml(d.meal) : `<span style="color:var(--text-muted); font-style:italic; font-size:12.5px; font-weight:400;">+ Add dinner...</span>`}
                    </span>
                    <button type="button" class="k-source-pill ${d.source}" onclick="kCycleDaySource(${idx})" title="Click to flip (Fresh, Freezer, Pantry, Takeout)">
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
                  <button type="button" class="k-icon-btn ${isFav ? 'is-fav' : ''}" title="${isFav ? 'In Favorites' : 'Save dish to Favorites Vault'}" onclick="${d.meal ? `kToggleFavoriteDayMeal(${idx})` : `kOpenMealPicker(${idx})`}">
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
          ${favoriteRecipes.length > 0 ? favoriteRecipes.map(r => `
            <div class="k-fav-card">
              <div class="k-fav-top">
                <div class="k-avatar-icon" style="width:32px; height:32px;">
                  ${KITCHEN_ICONS[r.icon] || KITCHEN_ICONS.chicken}
                </div>
                <div style="flex:1; min-width:0;">
                  <div class="k-fav-title">${escapeHtml(r.title)}</div>
                  ${(r.tags && r.tags.length > 0 && !r.tags.every(t => t === 'Favorite')) ? `
                    <div style="display:flex; gap:4px; flex-wrap:wrap; margin-top:2px;">
                      ${r.tags.map(t => `<span style="font-size:9.5px; font-weight:700; padding:1px 5px; border-radius:4px; background:var(--pal-azure-soft); color:var(--pal-azure);">${escapeHtml(t)}</span>`).join('')}
                    </div>
                  ` : ''}
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

                <select class="k-assign-select" onchange="kAssignFavToDay('${r.id}', this.value); this.value='';">
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
          `).join('') : `
            <div style="grid-column: 1 / -1; padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 12.5px; border: 1px dashed var(--border-subtle, rgba(31,42,68,0.12)); border-radius: 12px;">
              No recipes in your vault yet. Tap <strong>+ Add Recipe</strong> above to save a favorite! 💜
            </div>
          `}
        </div>
      </section>

      <!-- STEP 4: VISIBLE GROCERY LIST & THINGS 3 EXPORTER -->
      <section class="k-grocery-card" id="k-sec-groceries">
        <div class="k-grocery-top-bar">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="k-step-indicator" style="background:var(--pal-sage-soft); color:#3B6B35;">STEP 3</span>
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
          <input type="text" class="k-clean-input" id="k-add-extra-grocery" placeholder="+ Add a grocery item (e.g. Oat milk, Lemons, Coffee beans)..." onkeydown="if(event.key==='Enter') kAddExtraGroceryItem()">
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

// 2 Separate Buttons: Pantry (default on Enter) and Freezer
function kAddStashWithSource(sourceType = 'pantry') {
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
    if (!d.meal) {
      d.meal = d.day === 'Fri' ? 'Takeout' : 'Dinner Out';
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

function detectRecipeIcon(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('salmon') || t.includes('fish') || t.includes('shrimp') || t.includes('tuna') || t.includes('cod') || t.includes('seafood') || t.includes('halibut') || t.includes('trout')) return 'salmon';
  if (t.includes('taco') || t.includes('burrito') || t.includes('fajita') || t.includes('mexican') || t.includes('enchilada') || t.includes('quesadilla')) return 'taco';
  if (t.includes('chicken') || t.includes('turkey') || t.includes('poultry') || t.includes('wing') || t.includes('thigh') || t.includes('roast chicken')) return 'chicken';
  if (t.includes('pasta') || t.includes('noodle') || t.includes('spaghetti') || t.includes('penne') || t.includes('ramen') || t.includes('lasagna') || t.includes('fettuccine') || t.includes('orzo')) return 'pasta';
  if (t.includes('risotto') || t.includes('stew') || t.includes('soup') || t.includes('chili') || t.includes('curry') || t.includes('dal') || t.includes('chowder')) return 'risotto';
  if (t.includes('dumpling') || t.includes('gyoza') || t.includes('wonton') || t.includes('potsticker') || t.includes('bao')) return 'dumplings';
  if (t.includes('pizza') || t.includes('flatbread')) return 'pizza';
  if (t.includes('salad') || t.includes('greens') || t.includes('slaw') || t.includes('caesar')) return 'salad';
  if (t.includes('takeout') || t.includes('thai') || t.includes('chinese') || t.includes('sushi') || t.includes('bento')) return 'takeout';
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

function kOpenMealPicker(dayIdx) {
  activeKitchenEditIdx = dayIdx;
  const data = storage.getKitchenData();
  const d = (data.weekSchedule && data.weekSchedule[dayIdx]) ? data.weekSchedule[dayIdx] : { day: 'Dinner', date: '', meal: '', source: 'fresh', icon: 'chicken' };

  const titleEl = document.getElementById('k-fast-modal-title');
  if (titleEl) titleEl.textContent = `Enter Dinner · ${d.day}${d.date ? ` (${d.date})` : ''}`;
  const nameEl = document.getElementById('k-modal-custom-name');
  if (nameEl) nameEl.value = d.meal || '';
  const urlEl = document.getElementById('k-modal-custom-url');
  if (urlEl) urlEl.value = d.recipeUrl || '';
  const iconEl = document.getElementById('k-modal-custom-icon');
  if (iconEl) iconEl.value = d.icon || (d.source === 'out' ? 'takeout' : 'chicken');
  const sourceEl = document.getElementById('k-modal-custom-source');
  if (sourceEl) sourceEl.value = d.source || 'pantry';

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

  const favsContainer = document.getElementById('k-modal-favs-list');
  if (favsContainer) {
    const favs = data.favoriteRecipes || [];
    if (favs.length > 0) {
      favsContainer.innerHTML = favs.map(r => `
        <div class="k-modal-pick-item" onclick="kSelectFavForMeal('${r.id}')">
          <div style="font-weight:600; color:var(--text-primary);">${escapeHtml(r.title)}</div>
          <span style="font-size:11px; color:var(--text-muted);">${escapeHtml((r.tags || []).join(' · '))}</span>
        </div>
      `).join('');
    } else {
      favsContainer.innerHTML = `<div style="font-size:12px; color:var(--text-muted); padding:6px 0;">No saved favorites yet.</div>`;
    }
  }

  const modal = document.getElementById('k-fast-meal-modal');
  if (modal) modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function kSubmitCustomMeal() {
  if (activeKitchenEditIdx === null) return;
  const name = document.getElementById('k-modal-custom-name').value.trim();
  const url = document.getElementById('k-modal-custom-url').value.trim();
  const icon = document.getElementById('k-modal-custom-icon').value;
  const source = document.getElementById('k-modal-custom-source').value;

  const data = storage.getKitchenData();
  if (!Array.isArray(data.weekSchedule) || !data.weekSchedule[activeKitchenEditIdx]) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (!Array.isArray(data.weekSchedule)) data.weekSchedule = [];
    while (data.weekSchedule.length < 7) {
      const idx = data.weekSchedule.length;
      data.weekSchedule.push({ day: dayNames[idx], date: '', meal: '', source: 'fresh', icon: 'chicken' });
    }
  }
  const d = data.weekSchedule[activeKitchenEditIdx];
  d.meal = name;
  d.recipeUrl = url;
  d.icon = icon;
  d.source = source;

  storage.saveKitchenData(data);
  kCloseModal();
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(name ? `Updated ${d.day} dinner! ✨` : `Cleared ${d.day} dinner`);
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
  const meal = (data.weekSchedule && data.weekSchedule[dayIdx]) ? data.weekSchedule[dayIdx] : null;
  if (!meal || !meal.meal) {
    kOpenMealPicker(dayIdx);
    return;
  }
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
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 }, colors: ['#8B5CF6', '#6D28D9', '#0D98BA', '#C084FC'] });
    }
  }
}

function kAssignFavToDay(favId, dayIdxStr) {
  if (!dayIdxStr) return;
  const dayIdx = parseInt(dayIdxStr, 10);
  const data = storage.getKitchenData();
  const fav = (data.favoriteRecipes || []).find(r => r.id === favId);
  if (!fav) return;

  if (!Array.isArray(data.weekSchedule) || !data.weekSchedule[dayIdx]) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (!Array.isArray(data.weekSchedule)) data.weekSchedule = [];
    while (data.weekSchedule.length < 7) {
      const idx = data.weekSchedule.length;
      data.weekSchedule.push({ day: dayNames[idx], date: '', meal: '', source: 'fresh', icon: 'chicken' });
    }
  }

  const source = (fav.tags || []).some(t => t.includes('Takeout')) ? 'out' : ((fav.tags || []).some(t => t.includes('Freezer')) ? 'freezer' : (fav.tags || []).some(t => t.includes('Pantry')) ? 'pantry' : 'fresh');

  data.weekSchedule[dayIdx].meal = fav.title;
  data.weekSchedule[dayIdx].source = source;
  data.weekSchedule[dayIdx].icon = fav.icon || 'salmon';
  data.weekSchedule[dayIdx].recipeUrl = fav.recipeUrl || '';

  storage.saveKitchenData(data);
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Assigned "${fav.title}" to ${data.weekSchedule[dayIdx].day} dinner! ✨`);
}

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

function kOpenAddFavModal() {
  const urlEl = document.getElementById('k-new-fav-url');
  const titleEl = document.getElementById('k-new-fav-title');
  const notesEl = document.getElementById('k-new-fav-ingredients');
  const hintEl = document.getElementById('k-title-hint');

  if (urlEl) urlEl.value = '';
  if (titleEl) titleEl.value = '';
  if (notesEl) notesEl.value = '';
  if (hintEl) hintEl.textContent = '(only for recipes without URL - otherwise auto-pulled)';

  const modal = document.getElementById('k-add-fav-modal');
  if (modal) modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function kSubmitNewFavorite() {
  const urlEl = document.getElementById('k-new-fav-url');
  const titleEl = document.getElementById('k-new-fav-title');
  const notesEl = document.getElementById('k-new-fav-ingredients');

  const url = urlEl ? urlEl.value.trim() : '';
  let title = titleEl ? titleEl.value.trim() : '';
  const notes = notesEl ? notesEl.value.trim() : '';

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

  const icon = detectRecipeIcon(title);
  const data = storage.getKitchenData();
  if (!data.favoriteRecipes) data.favoriteRecipes = [];

  data.favoriteRecipes.push({
    id: 'r-' + Date.now(),
    title: title,
    icon: icon,
    tags: [],
    recipeUrl: url,
    ingredients: notes,
    stashMatch: null
  });

  storage.saveKitchenData(data);
  kCloseAddFavModal();
  renderKitchenPage();
  if (typeof showToast === 'function') showToast(`Added "${title}" to Favorites Vault! 💜`);
  if (typeof confetti === 'function') {
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 }, colors: ['#8B5CF6', '#6D28D9', '#0D98BA', '#C084FC'] });
  }
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
  const groceries = (data.groceries || []).filter(g => !g.checked);
  const rawItems = groceries.map(g => g.text).filter(Boolean);

  const meals = (data.weekSchedule || []).filter(d => d.meal).map(d => `• ${d.day}: ${d.meal} (${d.source === 'out' ? 'Takeout 🥡' : (d.source === 'freezer' ? 'Freezer 🧊' : (d.source === 'pantry' ? 'Pantry 🥫' : 'Fresh 🛒'))})`).join('\n');
  const notes = `Planned in margo:\n${meals || '(None)'}\n\nEat Out Target: ${data.eatOutTarget || 2}x`;

  const thingsUrl = `things:///add-project?title=${encodeURIComponent('Weekly Groceries')}&to-dos=${encodeURIComponent(rawItems.join('\n'))}&notes=${encodeURIComponent(notes)}`;

  // Also copy to clipboard as convenience backup
  const clipboardText = `Weekly Groceries\n${rawItems.length ? rawItems.map(i => `[ ] ${i}`).join('\n') : '(No grocery items entered)'}\n\n${notes}`;
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
  const groceries = (data.groceries || []).filter(g => !g.checked);
  const items = groceries.map(g => `[ ] ${g.text}`).filter(Boolean);

  const meals = (data.weekSchedule || []).filter(d => d.meal).map(d => `• ${d.day}: ${d.meal} (${d.source === 'out' ? 'Takeout 🥡' : (d.source === 'freezer' ? 'Freezer 🧊' : (d.source === 'pantry' ? 'Pantry 🥫' : 'Fresh 🛒'))})`).join('\n');

  const text = `Weekly Groceries
${items.length ? items.join('\n') : '(No groceries entered)'}

Dinners Planned in margo:
${meals || '(No dinners planned)'}

Eat Out: ${data.eatOutTarget || 2}x target`;

  navigator.clipboard.writeText(text).then(() => {
    if (typeof showToast === 'function') showToast(`✓ Copied ${items.length} verified grocery items for Things 3!`);
    if (typeof confetti === 'function') {
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.8 }, colors: ['#8B5CF6', '#6D28D9', '#0D98BA', '#C084FC'] });
    }
  }).catch(() => {
    if (typeof showToast === 'function') showToast('✓ Ready for Things 3');
  });
}
