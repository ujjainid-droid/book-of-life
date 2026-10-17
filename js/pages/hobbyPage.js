/* ==========================================================================
   margo. — Hobby Page: Minimal Tasting Pipeline (Ocean Island Palette)
   Color Palette: Extracted from Ocean Island / Iceberg Photo
     #01374A (Deep Abyssal Teal / Navy)
     #0395A7 (Aegean Marine Cyan)
     #72ADBF (Glacial Mist Blue)
     #5E877D (Nordic Slate Sage)
     #2B5435 (Deep Forest Evergreen)
   Architecture: Option 1 Tasting Pipeline — stripped of all extra sub text
   Strict Rule: Zero Yellow / Amber, Zero Dartboard Target Icons
   ========================================================================== */

let activeHobbyCategoryFilter = 'all';
let activeRoulettePick = null;
let activeLoggingHobbyId = null;

const WEEKEND_ROULETTE_SUGGESTIONS = [
  { title: '🏺 Pottery & Wheel Throwing', hobbyId: 'hby-pottery' },
  { title: '🏹 Archery Range Session', hobbyId: 'hby-archery' },
  { title: '🎻 String Ensemble / Cello Flow', hobbyId: 'hby-cello' },
  { title: '🧗 Bouldering Problem-Solving', hobbyId: 'hby-bouldering' },
  { title: '🏓 Pickleball Doubles Clinic', hobbyId: 'hby-pickleball' },
  { title: '🍜 Exploring Regional Cuisines', hobbyId: 'hby-cuisines' },
  { title: '🧁 Artisan Sourdough Morning', hobbyId: 'hby-baking' }
];

function filterHobbyCategory(cat) {
  activeHobbyCategoryFilter = cat;
  renderHobbyPage();
}
window.filterHobbyCategory = filterHobbyCategory;

function rollWeekendRoulette() {
  const pick = WEEKEND_ROULETTE_SUGGESTIONS[Math.floor(Math.random() * WEEKEND_ROULETTE_SUGGESTIONS.length)];
  activeRoulettePick = pick;
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.25 },
      colors: ['#0395A7', '#72ADBF', '#5E877D', '#2B5435']
    });
  }
  renderHobbyPage();
}
window.rollWeekendRoulette = rollWeekendRoulette;

function dismissRoulette() {
  activeRoulettePick = null;
  renderHobbyPage();
}
window.dismissRoulette = dismissRoulette;

function quickMoveHobbyStage(hobbyId, newStage) {
  if (typeof storage !== 'undefined') {
    const updated = storage.updateHobbyStage(hobbyId, newStage);
    if (updated && typeof showToast === 'function') {
      const stageLabels = {
        want: 'moved to Wishlist',
        trial: 'started in 30-Day Tasting',
        active: 'promoted to Active Rhythm',
        shelved: 'shelved gracefully'
      };
      showToast(`${updated.icon || '✨'} ${updated.name}: ${stageLabels[newStage] || 'stage updated'}`);
    }
  }
  renderHobbyPage();
}
window.quickMoveHobbyStage = quickMoveHobbyStage;

function openLogHobbyModal(hobbyId) {
  activeLoggingHobbyId = hobbyId;
  const hobby = (typeof storage !== 'undefined') ? storage.getHobby(hobbyId) : null;
  if (!hobby) return;

  const modal = document.getElementById('modal-log-hobby');
  if (modal) {
    const titleEl = document.getElementById('log-hobby-modal-title');
    if (titleEl) titleEl.textContent = `${hobby.icon || '✨'} Log Session: ${hobby.name}`;
    const dateInput = document.getElementById('log-hobby-date');
    if (dateInput) {
      dateInput.value = (typeof formatDateIso === 'function') ? formatDateIso(new Date()) : new Date().toISOString().split('T')[0];
    }
    const notesInput = document.getElementById('log-hobby-notes');
    if (notesInput) notesInput.value = '';
    modal.classList.add('active');
  }
}
window.openLogHobbyModal = openLogHobbyModal;

function submitLogHobbySession(event) {
  event.preventDefault();
  if (!activeLoggingHobbyId) return;

  const dateInput = document.getElementById('log-hobby-date');
  const notesInput = document.getElementById('log-hobby-notes');
  const peaceInput = document.querySelector('input[name="hobby-peace"]:checked');

  const sessionData = {
    date: dateInput ? dateInput.value : '',
    notes: notesInput ? notesInput.value.trim() : '',
    peace: peaceInput ? Number(peaceInput.value) : 5
  };

  if (typeof storage !== 'undefined') {
    const res = storage.logHobbySession(activeLoggingHobbyId, sessionData);
    if (res && typeof showToast === 'function') {
      if (res.completedTarget) {
        showToast(`🎉 Goal achieved! ${res.hobby.sessionsLogged}/${res.hobby.targetSessions} sessions complete for ${res.hobby.name}!`);
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 40,
            spread: 50,
            colors: ['#0395A7', '#72ADBF', '#2B5435']
          });
        }
      } else {
        showToast(`✨ Session logged! (${res.hobby.sessionsLogged}/${res.hobby.targetSessions || 4}) for ${res.hobby.name}`);
      }
    }
  }

  closeAllModals();
  activeLoggingHobbyId = null;
  renderHobbyPage();
}
window.submitLogHobbySession = submitLogHobbySession;

function openAddHobbyModal() {
  const modal = document.getElementById('modal-add-hobby');
  if (modal) {
    const nameInput = document.getElementById('add-hobby-name');
    if (nameInput) nameInput.value = '';
    const descInput = document.getElementById('add-hobby-desc');
    if (descInput) descInput.value = '';
    modal.classList.add('active');
  }
}
window.openAddHobbyModal = openAddHobbyModal;

function submitAddHobby(event) {
  event.preventDefault();
  const nameInput = document.getElementById('add-hobby-name');
  const catInput = document.getElementById('add-hobby-category');
  const stageInput = document.getElementById('add-hobby-stage');
  const iconInput = document.getElementById('add-hobby-icon');
  const descInput = document.getElementById('add-hobby-desc');

  if (!nameInput || !nameInput.value.trim()) return;

  const hobbyData = {
    id: `hby-${Date.now()}`,
    name: nameInput.value.trim(),
    category: catInput ? catInput.value : 'creative',
    stage: stageInput ? stageInput.value : 'want',
    icon: iconInput && iconInput.value.trim() ? iconInput.value.trim() : '✨',
    desc: descInput ? descInput.value.trim() : '',
    targetSessions: 4,
    sessionsLogged: 0,
    tags: ['Custom']
  };

  if (typeof storage !== 'undefined') {
    storage.saveHobby(hobbyData);
    if (typeof showToast === 'function') {
      showToast(`Added "${hobbyData.name}"!`);
    }
  }

  closeAllModals();
  renderHobbyPage();
}
window.submitAddHobby = submitAddHobby;

function renderHobbyPage() {
  currentView = 'hobby';
  try {
    localStorage.setItem('BOL_ACTIVE_VIEW', 'hobby');
    if (window.location.hash !== '#hobby') {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', '#hobby');
      } else {
        window.location.hash = 'hobby';
      }
    }
  } catch (e) {}

  const container = document.getElementById('daily-sheet-container');
  if (!container) return;

  const allHobbies = (typeof storage !== 'undefined') ? storage.getHobbies() : [];

  // Filter by category if not 'all'
  const filteredHobbies = (activeHobbyCategoryFilter === 'all')
    ? allHobbies
    : allHobbies.filter(h => h.category === activeHobbyCategoryFilter);

  // Group by stage
  const wantHobbies = filteredHobbies.filter(h => h.stage === 'want');
  const trialHobbies = filteredHobbies.filter(h => h.stage === 'trial');
  const activeHobbies = filteredHobbies.filter(h => h.stage === 'active');
  const shelvedHobbies = filteredHobbies.filter(h => h.stage === 'shelved');

  // Counts for pills
  const totalCount = allHobbies.length;
  const sportsCount = allHobbies.filter(h => h.category === 'sports').length;
  const creativeCount = allHobbies.filter(h => h.category === 'creative').length;
  const techCount = allHobbies.filter(h => h.category === 'technical').length;
  const miscCount = allHobbies.filter(h => h.category === 'misc').length;

  let html = `
    <div class="hobby-page-container">
      
      <!-- Minimal Top Bar -->
      <header class="hobby-header-bar">
        <div class="hobby-brand-group">
          <span class="hobby-brand-badge">Ocean Palette</span>
          <h1 class="hobby-main-title">
            <span>🏺</span> Hobby Tasting Menu
          </h1>
        </div>

        <div class="hobby-top-controls">
          <button type="button" class="btn-roulette-minimal" onclick="rollWeekendRoulette()" title="Suggest a random weekend adventure">
            <span>🎲</span> Surprise Me
          </button>
          <button type="button" class="btn-add-minimal-icon" onclick="openAddHobbyModal()">
            <span>+</span> Add Hobby
          </button>
        </div>
      </header>
  `;

  // Minimal Roulette Banner (if active)
  if (activeRoulettePick) {
    html += `
      <section class="minimal-roulette-banner">
        <div class="roulette-spark-text">
          <span>🎲</span>
          <span>Weekend Spark: <strong>${escapeHtml(activeRoulettePick.title)}</strong></span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button type="button" class="btn-minimal-log" onclick="quickMoveHobbyStage('${activeRoulettePick.hobbyId}', 'trial')">
            Start Trial →
          </button>
          <button type="button" class="minimal-stage-move-btn" onclick="dismissRoulette()" title="Dismiss">✕</button>
        </div>
      </section>
    `;
  }

  // SPOTLIGHT SECTION: Currently In Tasting (30 Days) — Clean & Minimal (No Subtext)
  html += `
    <section class="hobby-spotlight-section">
      <div class="hobby-spotlight-title">
        <span>🧪</span> Active Runways (${trialHobbies.length})
      </div>

      <div class="spotlight-runways-grid">
  `;

  if (trialHobbies.length === 0) {
    html += `
      <div style="grid-column: 1 / -1; padding: 20px; text-align: center; background: var(--hobby-surface-card); border: 1px dashed var(--hobby-border); border-radius: 14px; color: var(--muted); font-size: 13px;">
        No active tastings running right now. Click <strong>"Start Trial →"</strong> on any hobby below.
      </div>
    `;
  } else {
    trialHobbies.forEach(h => {
      const isPottery = h.id === 'hby-pottery';
      const target = h.targetSessions || 4;
      const logged = h.sessionsLogged || 0;
      const days = h.daysElapsed || 12;
      const maxDays = h.maxDays || 30;

      html += `
        <article class="minimal-tasting-widget ${isPottery ? 'featured' : ''}">
          <div class="minimal-widget-top">
            <h4 class="minimal-widget-name">
              <span>${h.icon || '✨'}</span> ${escapeHtml(h.name)}
            </h4>
            <span class="minimal-widget-badge">Session ${logged} of ${target}</span>
          </div>

          <div class="minimal-widget-meta">
            <span>Day ${days} of ${maxDays}</span>
            <span style="color: var(--iceberg-marine); font-weight: 700;">${Math.round((logged / target) * 100)}%</span>
          </div>

          <div class="minimal-widget-actions">
            <button type="button" class="btn-minimal-log" onclick="openLogHobbyModal('${h.id}')">
              + Log Session
            </button>
            <select class="minimal-stage-select" onchange="quickMoveHobbyStage('${h.id}', this.value)">
              <option value="trial" selected>🧪 In Tasting</option>
              <option value="active">⚡ Make Active</option>
              <option value="shelved">📦 Shelve</option>
              <option value="want">📋 Wishlist</option>
            </select>
          </div>
        </article>
      `;
    });
  }

  html += `
      </div>
    </section>
  `;

  // MINIMAL CATEGORY FILTER ROW
  html += `
    <div class="hobby-filter-row">
      <button type="button" class="filter-pill-minimal ${activeHobbyCategoryFilter === 'all' ? 'active' : ''}" onclick="filterHobbyCategory('all')">
        All <span class="filter-pill-count">${totalCount}</span>
      </button>
      <button type="button" class="filter-pill-minimal ${activeHobbyCategoryFilter === 'sports' ? 'active' : ''}" onclick="filterHobbyCategory('sports')">
        🏃 Sports <span class="filter-pill-count">${sportsCount}</span>
      </button>
      <button type="button" class="filter-pill-minimal ${activeHobbyCategoryFilter === 'creative' ? 'active' : ''}" onclick="filterHobbyCategory('creative')">
        🎨 Creative <span class="filter-pill-count">${creativeCount}</span>
      </button>
      <button type="button" class="filter-pill-minimal ${activeHobbyCategoryFilter === 'technical' ? 'active' : ''}" onclick="filterHobbyCategory('technical')">
        💻 Technical <span class="filter-pill-count">${techCount}</span>
      </button>
      <button type="button" class="filter-pill-minimal ${activeHobbyCategoryFilter === 'misc' ? 'active' : ''}" onclick="filterHobbyCategory('misc')">
        🔮 Horizons <span class="filter-pill-count">${miscCount}</span>
      </button>
    </div>
  `;

  // 4-STAGE MINIMAL PIPELINE BOARD (STRIPPED OF ALL EXTRA SUB TEXT)
  html += `
    <section class="minimal-pipeline-board">

      <!-- Col 1: Want to Try -->
      <div class="minimal-stage-col col-want">
        <div class="minimal-stage-header">
          <span class="minimal-stage-title">📋 Want to Try</span>
          <span class="filter-pill-count">${wantHobbies.length}</span>
        </div>
        <div class="minimal-cards-stack">
  `;

  if (wantHobbies.length === 0) {
    html += `<div style="color: var(--muted); font-size: 11.5px; text-align: center; padding: 16px;">Empty</div>`;
  } else {
    wantHobbies.forEach(h => {
      html += renderMinimalHobbyCard(h);
    });
  }

  html += `
        </div>
      </div>

      <!-- Col 2: In Tasting -->
      <div class="minimal-stage-col col-trial">
        <div class="minimal-stage-header">
          <span class="minimal-stage-title">🧪 In Tasting (30d)</span>
          <span class="filter-pill-count">${trialHobbies.length}</span>
        </div>
        <div class="minimal-cards-stack">
  `;

  if (trialHobbies.length === 0) {
    html += `<div style="color: var(--muted); font-size: 11.5px; text-align: center; padding: 16px;">Empty</div>`;
  } else {
    trialHobbies.forEach(h => {
      html += renderMinimalHobbyCard(h);
    });
  }

  html += `
        </div>
      </div>

      <!-- Col 3: Active Rhythm -->
      <div class="minimal-stage-col col-active">
        <div class="minimal-stage-header">
          <span class="minimal-stage-title">⚡ Active Rhythm</span>
          <span class="filter-pill-count">${activeHobbies.length}</span>
        </div>
        <div class="minimal-cards-stack">
  `;

  if (activeHobbies.length === 0) {
    html += `<div style="color: var(--muted); font-size: 11.5px; text-align: center; padding: 16px;">Empty</div>`;
  } else {
    activeHobbies.forEach(h => {
      html += renderMinimalHobbyCard(h);
    });
  }

  html += `
        </div>
      </div>

      <!-- Col 4: Shelved -->
      <div class="minimal-stage-col col-shelved">
        <div class="minimal-stage-header">
          <span class="minimal-stage-title">📦 Shelved (0 Guilt)</span>
          <span class="filter-pill-count">${shelvedHobbies.length}</span>
        </div>
        <div class="minimal-cards-stack">
  `;

  if (shelvedHobbies.length === 0) {
    html += `<div style="color: var(--muted); font-size: 11.5px; text-align: center; padding: 16px;">Empty</div>`;
  } else {
    shelvedHobbies.forEach(h => {
      html += renderMinimalHobbyCard(h);
    });
  }

  html += `
        </div>
      </div>

    </section>

  </div> <!-- /.hobby-page-container -->
  `;

  container.innerHTML = html;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
window.renderHobbyPage = renderHobbyPage;

function renderMinimalHobbyCard(h) {
  const isPottery = h.id === 'hby-pottery';

  let nextActionBtn = '';
  if (h.stage === 'want') {
    nextActionBtn = `<button type="button" class="minimal-stage-move-btn" onclick="quickMoveHobbyStage('${h.id}', 'trial')">Start Trial →</button>`;
  } else if (h.stage === 'trial') {
    nextActionBtn = `<button type="button" class="minimal-stage-move-btn" onclick="quickMoveHobbyStage('${h.id}', 'active')">Make Active ⚡</button>`;
  } else if (h.stage === 'active') {
    nextActionBtn = `<button type="button" class="minimal-stage-move-btn" onclick="quickMoveHobbyStage('${h.id}', 'shelved')">Shelve 📦</button>`;
  } else if (h.stage === 'shelved') {
    nextActionBtn = `<button type="button" class="minimal-stage-move-btn" onclick="quickMoveHobbyStage('${h.id}', 'trial')">Taste Again →</button>`;
  }

  return `
    <article class="minimal-strip-card ${isPottery ? 'is-pottery' : ''}">
      <div class="minimal-card-info">
        <span class="minimal-card-icon">${h.icon || '✨'}</span>
        <div class="minimal-card-text-col">
          <span class="minimal-card-name" title="${escapeHtml(h.name)}">${escapeHtml(h.name)}</span>
          <span class="minimal-card-cat-tag">${h.category}</span>
        </div>
      </div>
      ${nextActionBtn}
    </article>
  `;
}
