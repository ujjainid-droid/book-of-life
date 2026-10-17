/* ==========================================================================
   margo. — Hobby Page: The Tasting Menu Pipeline (Option 1)
   Architecture: Zero-guilt somatic and creative exploration with 30-day runways
   Palette: Cool Lavender / Royal Violet foundation + Nordic Sea Glass Teal
   Strict Rule: Zero Yellow / Amber, Zero Dartboard Target Icons
   ========================================================================== */

let activeHobbyCategoryFilter = 'all';
let activeRoulettePick = null;
let activeLoggingHobbyId = null;

const WEEKEND_ROULETTE_SUGGESTIONS = [
  {
    title: '🏺 Pottery & Wheel Throwing',
    desc: 'Spend 2 hours centering wet clay on a wheel with zero screens and deep breath awareness.',
    cat: 'creative',
    hobbyId: 'hby-pottery'
  },
  {
    title: '🏹 Archery Range Session',
    desc: 'Focus on somatic stillness, shoulder alignment, and the quiet rhythm of the arrow release.',
    cat: 'sports',
    hobbyId: 'hby-archery'
  },
  {
    title: '🎻 String Ensemble / Cello Flow',
    desc: 'Acoustic tactile resonance. Revisit a favorite piece or explore an open chamber group.',
    cat: 'creative',
    hobbyId: 'hby-cello'
  },
  {
    title: '🧗 Bouldering Problem-Solving',
    desc: 'Kinetic physical chess. Grab chalk and try 4 route problems with friends.',
    cat: 'sports',
    hobbyId: 'hby-bouldering'
  },
  {
    title: '🏓 Pickleball Doubles Clinic',
    desc: 'Fast, playful kitchen-line dinking. High-dopamine cardio with zero intimidation.',
    cat: 'sports',
    hobbyId: 'hby-pickleball'
  },
  {
    title: '🍜 Exploring Regional Cuisines',
    desc: 'Pick an unfamiliar neighborhood market or eatery and sample authentic regional noodles or dumplings.',
    cat: 'misc',
    hobbyId: 'hby-cuisines'
  },
  {
    title: '🧁 Artisan Sourdough Morning',
    desc: 'Slow fermentation, precise geometric scoring, and the warm aroma of fresh-baked bread.',
    cat: 'creative',
    hobbyId: 'hby-baking'
  }
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
      colors: ['#8B5CF6', '#2EBF91', '#5CE1F0', '#B5ABFF']
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
        trial: 'promoted to 30-Day Tasting Runway 🧪',
        active: 'promoted to Active Rhythm ⚡',
        shelved: 'shelved with zero guilt 📦'
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
        showToast(`🎉 Goal achieved! Logged session ${res.hobby.sessionsLogged} of ${res.hobby.targetSessions} for ${res.hobby.name}!`);
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 50,
            spread: 60,
            colors: ['#8B5CF6', '#2EBF91', '#5CE1F0']
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
      showToast(`Added "${hobbyData.name}" to ${hobbyData.stage === 'trial' ? 'Tasting Runway' : 'Hobby Pipeline'}!`);
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
      
      <!-- Master Hero Header -->
      <section class="hobby-hero-header">
        <div class="hobby-hero-meta">
          <div class="hobby-badge-row">
            <span class="hobby-pill-tag">Option 1 · Tasting Menu</span>
            <span style="font-size: 12px; color: var(--muted); font-weight: 600;">Zero-Guilt LifeOS</span>
          </div>
          <h1 class="hobby-page-title">
            <span>🎨</span> Hobby Tasting Menu
          </h1>
          <p class="hobby-page-subtitle">
            Curiosity-driven exploration with 30-day runways. Try, rotate, and shelve without streak anxiety.
          </p>
        </div>

        <div class="hobby-hero-actions">
          <button type="button" class="btn-roulette" onclick="rollWeekendRoulette()" title="Pick a random adventure for this weekend">
            <span>🎲</span> Surprise Me This Weekend
          </button>
          <button type="button" class="btn-add-hobby" onclick="openAddHobbyModal()">
            <span>+</span> Add Custom Hobby
          </button>
        </div>
      </section>
  `;

  // Roulette Banner if active
  if (activeRoulettePick) {
    html += `
      <section class="roulette-overlay-banner">
        <div class="roulette-banner-text">
          <span class="roulette-dice-icon">🎲</span>
          <div>
            <h4 class="roulette-title">Weekend Tasting Spark: ${escapeHtml(activeRoulettePick.title)}</h4>
            <p class="roulette-desc">${escapeHtml(activeRoulettePick.desc)}</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button type="button" class="btn-log-session" onclick="quickMoveHobbyStage('${activeRoulettePick.hobbyId}', 'trial')">
            Start 30-Day Tasting →
          </button>
          <button type="button" class="btn-roulette-close" onclick="dismissRoulette()" title="Dismiss">✕</button>
        </div>
      </section>
    `;
  }

  // SPOTLIGHT SECTION: Currently In Tasting (30 Days)
  html += `
    <section class="hobby-spotlight-section">
      <div class="hobby-section-header">
        <h3 class="hobby-section-title">
          <span>🧪</span> Currently In Tasting (30-Day Runways)
        </h3>
        <span style="font-size: 12px; color: var(--muted); font-weight: 700;">
          ${trialHobbies.length} Active Runway${trialHobbies.length === 1 ? '' : 's'}
        </span>
      </div>

      <div class="hobby-spotlight-grid">
  `;

  if (trialHobbies.length === 0) {
    html += `
      <div style="grid-column: 1 / -1; padding: 24px; text-align: center; background: var(--card); border: 1px dashed var(--line); border-radius: 16px; color: var(--muted); font-size: 13.5px;">
        No active tastings running right now. Click <strong>"Start Trial →"</strong> on any hobby from the wishlist below!
      </div>
    `;
  } else {
    trialHobbies.forEach(h => {
      const isPottery = h.id === 'hby-pottery';
      const target = h.targetSessions || 4;
      const logged = h.sessionsLogged || 0;
      const progressPercent = Math.min(100, Math.round((logged / target) * 100));
      const days = h.daysElapsed || 12;
      const maxDays = h.maxDays || 30;

      html += `
        <article class="tasting-spotlight-card ${isPottery ? 'featured-card' : ''}">
          <div class="tasting-card-top">
            <div class="tasting-card-heading">
              <span class="tasting-sub-badge">
                <span>${h.icon || '✨'}</span> ${h.category.toUpperCase()}
              </span>
              <h4 class="tasting-hobby-title">${escapeHtml(h.name)}</h4>
            </div>
            <span class="tasting-session-badge">Session ${logged} of ${target}</span>
          </div>

          <p class="tasting-desc">${escapeHtml(h.desc || h.notes || '')}</p>

          <div class="tasting-progress-track">
            <div class="tasting-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>

          <div class="tasting-meta-bar">
            <span>Day ${days} of ${maxDays}</span>
            <span>${progressPercent}% Complete</span>
          </div>

          <div class="tasting-card-controls">
            <button type="button" class="btn-log-session" onclick="openLogHobbyModal('${h.id}')">
              <span>+</span> Log Session
            </button>
            <div style="display: flex; align-items: center; gap: 6px;">
              <select class="stage-select-dropdown" onchange="quickMoveHobbyStage('${h.id}', this.value)">
                <option value="trial" selected>🧪 In Tasting</option>
                <option value="active">⚡ Promote to Active</option>
                <option value="shelved">📦 Shelve (0 Guilt)</option>
                <option value="want">📋 Move to Wishlist</option>
              </select>
            </div>
          </div>
        </article>
      `;
    });
  }

  html += `
      </div>
    </section>
  `;

  // CATEGORY FILTER BAR
  html += `
    <section class="hobby-filter-bar">
      <div class="hobby-category-pills">
        <button type="button" class="hobby-cat-btn ${activeHobbyCategoryFilter === 'all' ? 'active' : ''}" onclick="filterHobbyCategory('all')">
          All Pillars <span class="hobby-stage-pill-count">${totalCount}</span>
        </button>
        <button type="button" class="hobby-cat-btn ${activeHobbyCategoryFilter === 'sports' ? 'active' : ''}" onclick="filterHobbyCategory('sports')">
          🏃 Sports <span class="hobby-stage-pill-count">${sportsCount}</span>
        </button>
        <button type="button" class="hobby-cat-btn ${activeHobbyCategoryFilter === 'creative' ? 'active' : ''}" onclick="filterHobbyCategory('creative')">
          🎨 Creative <span class="hobby-stage-pill-count">${creativeCount}</span>
        </button>
        <button type="button" class="hobby-cat-btn ${activeHobbyCategoryFilter === 'technical' ? 'active' : ''}" onclick="filterHobbyCategory('technical')">
          💻 Technical <span class="hobby-stage-pill-count">${techCount}</span>
        </button>
        <button type="button" class="hobby-cat-btn ${activeHobbyCategoryFilter === 'misc' ? 'active' : ''}" onclick="filterHobbyCategory('misc')">
          🔮 Miscellaneous <span class="hobby-stage-pill-count">${miscCount}</span>
        </button>
      </div>
    </section>
  `;

  // 4-STAGE PIPELINE BOARD
  html += `
    <section class="hobby-pipeline-board">

      <!-- Column 1: Wishlist (Want to Try) -->
      <div class="pipeline-stage-column stage-col-want">
        <div class="stage-column-header">
          <span class="stage-col-name">📋 Want to Try</span>
          <span class="hobby-stage-pill-count">${wantHobbies.length}</span>
        </div>
        <div class="stage-col-cards">
  `;

  if (wantHobbies.length === 0) {
    html += `<div style="color: var(--muted); font-size: 12px; text-align: center; padding: 20px;">No items in wishlist</div>`;
  } else {
    wantHobbies.forEach(h => {
      html += renderHobbyCard(h);
    });
  }

  html += `
        </div>
      </div>

      <!-- Column 2: In Tasting (30d Trials) -->
      <div class="pipeline-stage-column stage-col-trial">
        <div class="stage-column-header">
          <span class="stage-col-name">🧪 In Tasting (30d)</span>
          <span class="hobby-stage-pill-count">${trialHobbies.length}</span>
        </div>
        <div class="stage-col-cards">
  `;

  if (trialHobbies.length === 0) {
    html += `<div style="color: var(--muted); font-size: 12px; text-align: center; padding: 20px;">No active trials</div>`;
  } else {
    trialHobbies.forEach(h => {
      html += renderHobbyCard(h);
    });
  }

  html += `
        </div>
      </div>

      <!-- Column 3: Active Rhythm -->
      <div class="pipeline-stage-column stage-col-active">
        <div class="stage-column-header">
          <span class="stage-col-name">⚡ Active Rhythm</span>
          <span class="hobby-stage-pill-count">${activeHobbies.length}</span>
        </div>
        <div class="stage-col-cards">
  `;

  if (activeHobbies.length === 0) {
    html += `<div style="color: var(--muted); font-size: 12px; text-align: center; padding: 20px;">No active rhythms</div>`;
  } else {
    activeHobbies.forEach(h => {
      html += renderHobbyCard(h);
    });
  }

  html += `
        </div>
      </div>

      <!-- Column 4: Shelved with Zero Guilt -->
      <div class="pipeline-stage-column stage-col-shelved">
        <div class="stage-column-header">
          <span class="stage-col-name">📦 Shelved (0 Guilt)</span>
          <span class="hobby-stage-pill-count">${shelvedHobbies.length}</span>
        </div>
        <div class="stage-col-cards">
  `;

  if (shelvedHobbies.length === 0) {
    html += `<div style="color: var(--muted); font-size: 12px; text-align: center; padding: 20px;">No shelved hobbies</div>`;
  } else {
    shelvedHobbies.forEach(h => {
      html += renderHobbyCard(h);
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

function renderHobbyCard(h) {
  const isPottery = h.id === 'hby-pottery';
  const catClasses = {
    sports: 'hobby-cat-sports',
    creative: 'hobby-cat-creative',
    technical: 'hobby-cat-technical',
    misc: 'hobby-cat-misc'
  };
  const catBadgeClass = catClasses[h.category] || 'hobby-cat-creative';

  let nextActionBtn = '';
  if (h.stage === 'want') {
    nextActionBtn = `<button type="button" class="hobby-quick-move-btn" onclick="quickMoveHobbyStage('${h.id}', 'trial')">Start Trial →</button>`;
  } else if (h.stage === 'trial') {
    nextActionBtn = `<button type="button" class="hobby-quick-move-btn" onclick="quickMoveHobbyStage('${h.id}', 'active')">Make Active ⚡</button>`;
  } else if (h.stage === 'active') {
    nextActionBtn = `<button type="button" class="hobby-quick-move-btn" onclick="quickMoveHobbyStage('${h.id}', 'shelved')">Shelve 📦</button>`;
  } else if (h.stage === 'shelved') {
    nextActionBtn = `<button type="button" class="hobby-quick-move-btn" onclick="quickMoveHobbyStage('${h.id}', 'trial')">Taste Again →</button>`;
  }

  const tagsHtml = (h.tags && h.tags.length > 0)
    ? h.tags.slice(0, 2).map(t => `<span class="hobby-mini-tag">${escapeHtml(t)}</span>`).join('')
    : '';

  return `
    <article class="hobby-item-card ${isPottery ? 'is-pottery' : ''}">
      <div class="hobby-card-header-row">
        <h5 class="hobby-card-title">
          <span>${h.icon || '✨'}</span> ${escapeHtml(h.name)}
        </h5>
        <span class="hobby-cat-badge ${catBadgeClass}">${h.category}</span>
      </div>

      <p class="hobby-card-body">${escapeHtml(h.desc || '')}</p>

      <div class="hobby-card-footer">
        <div class="hobby-tags-group">
          ${tagsHtml}
        </div>
        ${nextActionBtn}
      </div>
    </article>
  `;
}
