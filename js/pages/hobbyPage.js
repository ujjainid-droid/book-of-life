/* ==========================================================================
   margo. — Hobby Page: Serene & Minimalist (Stripped-Back Architecture)
   Color Scheme: Nordic Ceramic Rose & Terracotta Blush
   Visually distinct from Today (Violet), Compass (Slate), Z Hub (Cyan), Money (Green)
   Strict Rule: Zero Yellow / Amber, Zero Dartboard Target Icons
   ========================================================================== */

let activeHobbyViewMode = 'tasting'; // 'tasting' | 'catalog' | 'shelved'
let activeLoggingHobbyId = null;

function setHobbyViewMode(mode) {
  activeHobbyViewMode = mode;
  renderHobbyPage();
}
window.setHobbyViewMode = setHobbyViewMode;

function cycleHobbyStage(hobbyId) {
  if (typeof storage === 'undefined') return;
  const hobby = storage.getHobby(hobbyId);
  if (!hobby) return;

  // Simple cycle: want -> trial -> active -> shelved -> want
  const nextStageMap = {
    want: 'trial',
    trial: 'active',
    active: 'shelved',
    shelved: 'want'
  };
  const newStage = nextStageMap[hobby.stage] || 'want';
  const updated = storage.updateHobbyStage(hobbyId, newStage);

  if (updated && typeof showToast === 'function') {
    const labels = {
      want: 'moved to Wishlist',
      trial: 'started in 30-Day Tasting',
      active: 'promoted to Active Rhythm',
      shelved: 'shelved gracefully'
    };
    showToast(`${updated.icon || '✨'} ${updated.name}: ${labels[newStage]}`);
  }

  renderHobbyPage();
}
window.cycleHobbyStage = cycleHobbyStage;

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
            colors: ['#FB7185', '#E11D48', '#FDA4AF']
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

  const trialHobbies = allHobbies.filter(h => h.stage === 'trial');
  const activeHobbies = allHobbies.filter(h => h.stage === 'active');
  const shelvedHobbies = allHobbies.filter(h => h.stage === 'shelved');

  let html = `
    <div class="hobby-page-container">
      
      <!-- Minimalist Header -->
      <header class="hobby-header-simple">
        <div class="hobby-title-group">
          <h1>
            <span>🏺</span> Hobby
            <span class="hobby-title-tag">Ceramic Rose</span>
          </h1>
          <p>Curiosity-driven somatic &amp; creative tasting runways.</p>
        </div>

        <!-- 3-Segment Clean Control -->
        <div class="hobby-segmented-bar" role="tablist">
          <button type="button" class="hobby-segment-btn ${activeHobbyViewMode === 'tasting' ? 'active' : ''}" onclick="setHobbyViewMode('tasting')">
            Tastings (${trialHobbies.length})
          </button>
          <button type="button" class="hobby-segment-btn ${activeHobbyViewMode === 'catalog' ? 'active' : ''}" onclick="setHobbyViewMode('catalog')">
            Catalog (${allHobbies.length})
          </button>
          <button type="button" class="hobby-segment-btn ${activeHobbyViewMode === 'shelved' ? 'active' : ''}" onclick="setHobbyViewMode('shelved')">
            Shelved (${shelvedHobbies.length})
          </button>
        </div>
      </header>
  `;

  // VIEW 1: ACTIVE TASTINGS (DEFAULT)
  if (activeHobbyViewMode === 'tasting') {
    html += `
      <section class="hobby-tastings-list">
    `;

    if (trialHobbies.length === 0) {
      html += `
        <div style="padding: 32px 20px; text-align: center; background: var(--card); border: 1px dashed var(--line); border-radius: 16px; color: var(--muted); font-size: 13.5px;">
          No active tastings running right now. Open the <strong>Catalog</strong> tab to start a 30-day runway.
        </div>
      `;
    } else {
      trialHobbies.forEach(h => {
        const isPottery = h.id === 'hby-pottery';
        const target = h.targetSessions || 4;
        const logged = h.sessionsLogged || 0;

        html += `
          <div class="tasting-row-card ${isPottery ? 'featured' : ''}">
            <div class="tasting-info-left">
              <div class="tasting-name-row">
                <span style="font-size: 1.15rem;">${h.icon || '✨'}</span>
                <h3 class="tasting-row-name">${escapeHtml(h.name)}</h3>
                <span class="tasting-row-progress-text">${logged} of ${target} sessions</span>
              </div>
              <p class="tasting-row-desc">${escapeHtml(h.desc || h.notes || '')}</p>
            </div>

            <div class="tasting-actions-right">
              <button type="button" class="btn-quiet-log" onclick="openLogHobbyModal('${h.id}')">
                + Log Session
              </button>
              <button type="button" class="btn-quiet-opt" onclick="cycleHobbyStage('${h.id}')" title="Click to rotate stage">
                Next Stage →
              </button>
            </div>
          </div>
        `;
      });
    }

    html += `
      </section>
    `;
  }

  // VIEW 2: CLEAN DIRECTORY (CATALOG)
  else if (activeHobbyViewMode === 'catalog') {
    const pillars = [
      { key: 'sports', label: '🏃 Sports & Somatic Movement' },
      { key: 'creative', label: '🎨 Creative Flow & Craft' },
      { key: 'technical', label: '💻 Technical Craft' },
      { key: 'misc', label: '🔮 Horizons & Miscellaneous' }
    ];

    html += `
      <section class="hobby-directory-wrap">
    `;

    pillars.forEach(p => {
      const items = allHobbies.filter(h => h.category === p.key);
      if (items.length === 0) return;

      html += `
        <div class="pillar-section-group">
          <div class="pillar-header-clean">${p.label} (${items.length})</div>
      `;

      items.forEach(h => {
        const stageLabels = {
          want: 'Wishlist',
          trial: 'In Tasting (30d)',
          active: 'Active Rhythm',
          shelved: 'Shelved'
        };
        const stageLabel = stageLabels[h.stage] || 'Wishlist';
        const stageClass = `status-${h.stage || 'want'}`;

        html += `
          <div class="clean-item-row">
            <div class="clean-item-title">
              <span>${h.icon || '✨'}</span>
              <span>${escapeHtml(h.name)}</span>
            </div>
            <button type="button" class="status-chip-btn ${stageClass}" onclick="cycleHobbyStage('${h.id}')" title="Tap to cycle status">
              ${stageLabel}
            </button>
          </div>
        `;
      });

      html += `
        </div>
      `;
    });

    html += `
      </section>
    `;
  }

  // VIEW 3: SHELVED WITH ZERO GUILT
  else if (activeHobbyViewMode === 'shelved') {
    html += `
      <section class="hobby-tastings-list">
    `;

    if (shelvedHobbies.length === 0) {
      html += `
        <div style="padding: 32px 20px; text-align: center; background: var(--card); border: 1px dashed var(--line); border-radius: 16px; color: var(--muted); font-size: 13.5px;">
          No shelved hobbies yet. When you pause a hobby, it rests here peacefully with zero guilt.
        </div>
      `;
    } else {
      shelvedHobbies.forEach(h => {
        html += `
          <div class="tasting-row-card">
            <div class="tasting-info-left">
              <div class="tasting-name-row">
                <span style="font-size: 1.15rem;">${h.icon || '✨'}</span>
                <h3 class="tasting-row-name">${escapeHtml(h.name)}</h3>
                <span style="font-size: 12px; color: var(--muted);">Paused</span>
              </div>
              <p class="tasting-row-desc">${escapeHtml(h.desc || h.notes || '')}</p>
            </div>

            <div class="tasting-actions-right">
              <button type="button" class="btn-quiet-log" onclick="cycleHobbyStage('${h.id}')">
                Taste Again →
              </button>
            </div>
          </div>
        `;
      });
    }

    html += `
      </section>
    `;
  }

  // Footer Action: Quiet Add Custom Hobby Button
  html += `
      <footer class="hobby-footer-actions">
        <button type="button" class="btn-add-minimal" onclick="openAddHobbyModal()">
          + Add Custom Hobby
        </button>
      </footer>

    </div> <!-- /.hobby-page-container -->
  `;

  container.innerHTML = html;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
window.renderHobbyPage = renderHobbyPage;
