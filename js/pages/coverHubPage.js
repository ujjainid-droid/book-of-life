/* ==========================================================================
   Book of Life / Life OS - Cover Page (Executive Index & System Compass)
   Operating Philosophy: [simple] → [visible] → [next step] → [done]
   ========================================================================== */

let editingTopicAuditId = null;
let compassUndoState = null;
let compassToastTimer = null;

function getCompassLens() {
  try {
    return localStorage.getItem('BOL_COMPASS_LENS') || 'visible';
  } catch (e) {
    return 'visible';
  }
}

function setCompassLens(lens) {
  try {
    localStorage.setItem('BOL_COMPASS_LENS', lens);
  } catch (e) {}
  renderCoverHubPage();
}
window.setCompassLens = setCompassLens;

function isCompassFwOpen() {
  try {
    const raw = localStorage.getItem('BOL_COMPASS_FW_OPEN');
    return raw === null ? true : raw === 'true';
  } catch (e) {
    return true;
  }
}

function toggleCompassFramework() {
  const next = !isCompassFwOpen();
  try {
    localStorage.setItem('BOL_COMPASS_FW_OPEN', String(next));
  } catch (e) {}
  renderCoverHubPage();
}
window.toggleCompassFramework = toggleCompassFramework;

const COMPASS_PILLARS = [
  { k: 'M', n: 'Move', c: ['10k steps', 'Close rings', 'Calorie deficit', 'Cardio', 'Yoga', 'Weights'] },
  { k: 'A', n: 'Aesthetic', c: ['Skincare', 'Signature outfits', 'Hair health', 'Footcare', 'Makeup'] },
  { k: 'R', n: 'Reflect', c: ['Meditate', 'Journal', 'Me time'] },
  { k: 'G', n: 'Grow', c: ['Hobbies', 'Learning'] },
  { k: 'O', n: 'Organize', c: ['Home projects', 'Finances', 'Travel', 'Everyday chores'] }
];

const COMPASS_MAIL_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 8l9 6 9-6"/></svg>';

function renderCoverHubPage() {
  currentView = 'cover';
  try {
    localStorage.setItem('BOL_ACTIVE_VIEW', 'cover');
    if (window.location.hash !== '#compass' && window.location.hash !== '#cover') {
      window.location.hash = 'compass';
    }
  } catch (e) {}

  const coverTab = document.getElementById('nav-btn-cover');
  const todayTab = document.getElementById('nav-btn-today');
  const zhubTab = document.getElementById('nav-btn-zhub');
  const financeTab = document.getElementById('nav-btn-finance');

  if (coverTab) { coverTab.classList.add('active', 'on'); coverTab.setAttribute('aria-current', 'page'); }
  if (todayTab) { todayTab.classList.remove('active', 'on'); todayTab.removeAttribute('aria-current'); }
  if (zhubTab) { zhubTab.classList.remove('active', 'on'); zhubTab.removeAttribute('aria-current'); }
  if (financeTab) { financeTab.classList.remove('active', 'on'); financeTab.removeAttribute('aria-current'); }

  const container = document.getElementById('daily-sheet-container');
  if (!container) return;

  const campaignsData = (typeof storage !== 'undefined' && typeof storage.getCoverCampaigns === 'function')
    ? storage.getCoverCampaigns()
    : { now: [], later: [] };

  const habits = (typeof storage !== 'undefined' && typeof storage.getHabits === 'function')
    ? storage.getHabits()
    : [];

  const seasonTheme = (typeof localStorage !== 'undefined' && localStorage.getItem('BOL_COVER_SEASON_FOCUS')) || 'Calm Mastery, Health Baseline & Vitality';
  const activeLens = getCompassLens();
  const fwOpen = isCompassFwOpen();

  let standPresetDisabled = false;
  try {
    standPresetDisabled = localStorage.getItem('BOL_COMPASS_STAND_PRESET_OFF') === 'true';
  } catch (e) {}

  let isWorkflowWide = false;
  try {
    isWorkflowWide = localStorage.getItem('BOL_COMPASS_WF_WIDE') === 'true';
  } catch (e) {}

  const isMaintainCamp = (camp) => {
    if (!camp) return false;
    const isHc = (camp.id === 'camp-haircare' || (camp.title || '').toLowerCase().trim() === 'haircare');
    const raw = String(camp.status || (isHc ? 'Maintain' : 'IP')).trim().toLowerCase();
    return raw === 'maintain' || raw === 'review';
  };
  const nowPrimary = campaignsData.now.filter(c => !isMaintainCamp(c));
  const nowMaintain = campaignsData.now.filter(c => isMaintainCamp(c));

  container.innerHTML = `
    <div class="mc-app ${activeLens === 'simple' ? 'simple' : ''}" id="mc-app">

      <div class="mc-lens" id="lens" role="group" aria-label="View">
        <button type="button" aria-pressed="${activeLens === 'simple' ? 'true' : 'false'}" data-lens="simple" onclick="setCompassLens('simple')">simple</button>
        <button type="button" aria-pressed="${activeLens === 'visible' ? 'true' : 'false'}" data-lens="visible" onclick="setCompassLens('visible')">visible</button>
        <button type="button" aria-pressed="${activeLens === 'next' ? 'true' : 'false'}" data-lens="next" onclick="setCompassLens('next')">next step</button>
        <button type="button" aria-pressed="${activeLens === 'done' ? 'true' : 'false'}" data-lens="done" onclick="setCompassLens('done')">done</button>
      </div>

      <section class="mc-banner" aria-label="Focus theme">
        <div class="mc-bt">
          <!-- Sassy Cartoon Avatar -->
          <svg width="68" height="74" viewBox="0 0 104 112" role="img" aria-label="Sassy cartoon avatar" style="flex:none;cursor:pointer;transition:transform 0.18s ease;" onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'" onclick="switchAppView('sanctuary')" title="Tap to view Today" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="avatarHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#2D2235"/>
                <stop offset="50%" stop-color="#1A1320"/>
                <stop offset="100%" stop-color="#120D17"/>
              </linearGradient>
              <linearGradient id="avatarSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ECC095"/>
                <stop offset="100%" stop-color="#D99E6C"/>
              </linearGradient>
              <linearGradient id="avatarSweaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#7C3AED"/>
                <stop offset="100%" stop-color="#5B21B6"/>
              </linearGradient>
              <linearGradient id="avatarLipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#E75480"/>
                <stop offset="100%" stop-color="#BE185D"/>
              </linearGradient>
              <filter id="avatarGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#7C3AED" flood-opacity="0.18"/>
              </filter>
            </defs>

            <!-- Ambient Glow -->
            <circle cx="52" cy="54" r="46" fill="#8B5CF6" opacity="0.12"/>

            <!-- Back Hair (Flowing waves) -->
            <path d="M 24 44 C 20 62 21 82 28 98 C 30 102 34 102 36 96 C 33 80 32 62 35 48 Z" fill="url(#avatarHairGrad)"/>
            <path d="M 80 44 C 84 62 83 82 76 98 C 74 102 70 102 68 96 C 71 80 72 62 69 48 Z" fill="url(#avatarHairGrad)"/>
            <ellipse cx="52" cy="40" rx="34" ry="32" fill="url(#avatarHairGrad)"/>

            <!-- Chic Violet Turtleneck Sweater -->
            <path d="M 23 112 C 23 88 35 83 52 83 C 69 83 81 88 81 112 Z" fill="url(#avatarSweaterGrad)" filter="url(#avatarGlow)"/>
            <!-- Ribbed Neckline -->
            <rect x="35" y="74" width="34" height="15" rx="6" fill="#8B5CF6" stroke="#6D28D9" stroke-width="1.2"/>
            <line x1="42" y1="75" x2="42" y2="88" stroke="#7C3AED" stroke-width="1" opacity="0.6"/>
            <line x1="48" y1="75" x2="48" y2="88" stroke="#7C3AED" stroke-width="1" opacity="0.6"/>
            <line x1="54" y1="75" x2="54" y2="88" stroke="#7C3AED" stroke-width="1" opacity="0.6"/>
            <line x1="60" y1="75" x2="60" y2="88" stroke="#7C3AED" stroke-width="1" opacity="0.6"/>

            <!-- Neck -->
            <path d="M 44 68 L 44 76 C 44 79 60 79 60 76 L 60 68 Z" fill="#D39665"/>

            <!-- Head Base -->
            <ellipse cx="52" cy="49" rx="23" ry="24" fill="url(#avatarSkinGrad)"/>

            <!-- Ears & Gold Hoops -->
            <circle cx="29" cy="50" r="5" fill="#DC9F6D"/>
            <circle cx="28" cy="55" r="4.5" fill="none" stroke="#F59E0B" stroke-width="1.8"/>
            <circle cx="75" cy="50" r="5" fill="#DC9F6D"/>
            <circle cx="76" cy="55" r="4.5" fill="none" stroke="#F59E0B" stroke-width="1.8"/>

            <!-- Soft Rosy Cheeks -->
            <ellipse cx="38" cy="55" rx="5" ry="3" fill="#F472B6" opacity="0.55"/>
            <ellipse cx="66" cy="55" rx="5" ry="3" fill="#F472B6" opacity="0.55"/>

            <!-- Sassy Eyebrows -->
            <path d="M 36 39 Q 42 34 47 37" fill="none" stroke="#1A1320" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M 57 35 Q 63 30 69 35" fill="none" stroke="#1A1320" stroke-width="2.6" stroke-linecap="round"/>

            <!-- Sassy Winged Eyeliner & Playful Wink -->
            <!-- Left Eye (Confident winged gaze) -->
            <path d="M 37 45 Q 42 41 47 45" fill="none" stroke="#120D17" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M 47 45 L 49 43.5" stroke="#120D17" stroke-width="2.2" stroke-linecap="round"/>
            <circle cx="43" cy="46" r="3.2" fill="#261710"/>
            <circle cx="44.2" cy="45" r="1.1" fill="#FFFFFF"/>
            <path d="M 38 48 Q 42 50 46 48" fill="none" stroke="#120D17" stroke-width="0.8" opacity="0.4"/>

            <!-- Right Eye (Playful Sassy Wink) -->
            <path d="M 57 46 Q 62 41 68 45" fill="none" stroke="#120D17" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M 68 45 L 71 43" stroke="#120D17" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M 67 47 L 70 47" stroke="#120D17" stroke-width="1.8" stroke-linecap="round"/>

            <!-- Cute Refined Nose -->
            <path d="M 51 49 Q 53 54 50 54" fill="none" stroke="#B87D4E" stroke-width="1.8" stroke-linecap="round"/>

            <!-- Sassy Smirk (Coral Rose Lips #E75480) -->
            <path d="M 46 61 Q 53 64 60 59" fill="none" stroke="url(#avatarLipGrad)" stroke-width="2.8" stroke-linecap="round"/>
            <path d="M 59 60 Q 61 58 62 55" fill="none" stroke="url(#avatarLipGrad)" stroke-width="2.2" stroke-linecap="round"/>
            <ellipse cx="53" cy="63.5" rx="3.5" ry="1.2" fill="#FDA4AF" opacity="0.8"/>

            <!-- Voluminous Side-Swept Dark Hair -->
            <path d="M 26 38 C 28 22 45 14 62 17 C 76 19 82 28 80 40 C 76 34 71 31 63 31 C 47 31 36 39 33 48 C 30 42 27 40 26 38 Z" fill="url(#avatarHairGrad)"/>
            <path d="M 32 46 C 30 54 30 64 33 70 C 34 72 35 70 34 66 C 32 60 32 52 34 46 Z" fill="#241B2B"/>
            <path d="M 72 44 C 74 52 74 62 72 68 C 71 70 70 69 71 65 C 72 58 72 50 71 44 Z" fill="#241B2B"/>
            <!-- Glossy Highlight -->
            <path d="M 44 20 Q 56 17 68 22" fill="none" stroke="#5E486D" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>

            <!-- Sassy Perched Sunglasses on Head -->
            <g transform="translate(32, 14)">
              <rect x="0" y="2" width="18" height="12" rx="4" fill="#0F172A" stroke="#475569" stroke-width="1.2"/>
              <line x1="3" y1="4" x2="8" y2="12" stroke="#A78BFA" stroke-width="1.2" opacity="0.8" stroke-linecap="round"/>
              <path d="M 17 6 Q 20 4 23 6" fill="none" stroke="#475569" stroke-width="1.8"/>
              <rect x="22" y="2" width="18" height="12" rx="4" fill="#0F172A" stroke="#475569" stroke-width="1.2"/>
              <line x1="25" y1="4" x2="30" y2="12" stroke="#A78BFA" stroke-width="1.2" opacity="0.8" stroke-linecap="round"/>
            </g>

            <!-- Sparkle of Confidence -->
            <path d="M 85 24 Q 86 19 91 18 Q 86 17 85 12 Q 84 17 79 18 Q 84 19 85 24 Z" fill="#8B5CF6"/>
            <circle cx="89" cy="27" r="1.2" fill="#0D98BA"/>
          </svg>
          <div class="mc-txt">
            <p class="mc-quote" id="cover-season-focus-text" onclick="promptEditSeasonFocus()" style="cursor:pointer" title="Tap to edit season focus">“${escapeHtml(seasonTheme)}”</p>
          </div>
        </div>
        <div class="mc-stats">
          <div class="mc-stat" onclick="document.getElementById('nowSublaneIp')?.scrollIntoView({behavior:'smooth'})" title="In Progress (IP) strikes · Active focus">
            <b id="sIp">${nowPrimary.length}</b>
            <span>In Progress</span>
          </div>
          <div class="mc-stat" onclick="document.getElementById('nowSublaneMaintain')?.scrollIntoView({behavior:'smooth'})" title="Maintain · Steady background routines">
            <b id="sMaintain">${nowMaintain.length}</b>
            <span>Maintain</span>
          </div>
          <div class="mc-stat" onclick="document.getElementById('laterLaneHead')?.scrollIntoView({behavior:'smooth'})" title="On deck · Queued in Later">
            <b id="sDeck">${campaignsData.later.length}</b>
            <span>On deck</span>
          </div>
          <div class="mc-stat" onclick="document.getElementById('section-architecture-blueprint')?.scrollIntoView({behavior:'smooth'})" title="5 Core Pillars (Care, Grow, Home, Finance, School)">
            <b>5</b>
            <span>Pillars</span>
          </div>
        </div>
      </section>

      <section class="mc-board" id="board" aria-labelledby="bT">
        <div class="mc-sechead">
          <h2 id="bT">Life architecture &amp; focus board</h2>
        </div>

        <div class="mc-lane-head">
          <div class="l">
            <span class="mc-lane-tag now">
              <svg class="mc-lane-paw" viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                <ellipse cx="6.5" cy="5" rx="1.5" ry="2" transform="rotate(-12 6.5 5)"/>
                <ellipse cx="10.8" cy="4.8" rx="1.5" ry="2" transform="rotate(10 10.8 4.8)"/>
                <ellipse cx="3.5" cy="8.2" rx="1.3" ry="1.7" transform="rotate(-25 3.5 8.2)"/>
                <ellipse cx="13.5" cy="8" rx="1.3" ry="1.7" transform="rotate(25 13.5 8)"/>
                <path d="M8.5 8.5c2.2 0 3.8 2 3.8 3.8 0 1.1-.8 1.6-1.8 1.6-.7 0-1.1-.4-2-.4s-1.3.4-2 .4c-1 0-1.8-.5-1.8-1.6 0-1.8 1.6-3.8 3.8-3.8z"/>
                <g transform="translate(8.5, 7.5) scale(0.72)">
                  <ellipse cx="6.5" cy="5" rx="1.5" ry="2" transform="rotate(-12 6.5 5)"/>
                  <ellipse cx="10.8" cy="4.8" rx="1.5" ry="2" transform="rotate(10 10.8 4.8)"/>
                  <ellipse cx="3.5" cy="8.2" rx="1.3" ry="1.7" transform="rotate(-25 3.5 8.2)"/>
                  <ellipse cx="13.5" cy="8" rx="1.3" ry="1.7" transform="rotate(25 13.5 8)"/>
                  <path d="M8.5 8.5c2.2 0 3.8 2 3.8 3.8 0 1.1-.8 1.6-1.8 1.6-.7 0-1.1-.4-2-.4s-1.3.4-2 .4c-1 0-1.8-.5-1.8-1.6 0-1.8 1.6-3.8 3.8-3.8z"/>
                </g>
              </svg>
              <span>NOW</span>
            </span>
            <span class="mc-muted">Active focus · in flight, ball in court or tracked</span>
          </div>
          <button type="button" class="mc-add" id="addNow" onclick="promptAddCampaignItem('now')">+ Add focus</button>
        </div>
        ${(() => {
          const isMaintainItem = (camp) => {
            if (!camp) return false;
            const isHc = (camp.id === 'camp-haircare' || (camp.title || '').toLowerCase().trim() === 'haircare');
            const raw = String(camp.status || (isHc ? 'Maintain' : 'IP')).trim().toLowerCase();
            return raw === 'maintain' || raw === 'review';
          };
          const nowPrimary = campaignsData.now.filter(c => !isMaintainItem(c));
          const nowMaintain = campaignsData.now.filter(c => isMaintainItem(c));
          if (campaignsData.now.length === 0) {
            return `<div class="mc-focus-grid" id="nowList"><div class="mc-empty">Nothing active. Pull something in from Later.</div></div>`;
          }
          return `
            ${nowPrimary.length > 0 ? `
              <div class="mc-sublane-section ip-section" id="nowSublaneIp">
                ${nowMaintain.length > 0 ? `
                  <div class="mc-sublane-head in-flight">
                    <div class="mc-sublane-title-wrap">
                      <span class="mc-sublane-tag in-flight">
                        <span class="pulse-dot"></span>
                        <span>IN PROGRESS</span>
                      </span>
                      <span class="mc-sublane-desc">Active strikes &bull; focused bandwidth</span>
                    </div>
                    <span class="mc-sublane-count-badge in-flight">${nowPrimary.length} active</span>
                  </div>
                ` : ''}
                <div class="mc-focus-grid" id="nowList">
                  ${nowPrimary.map(camp => renderUnifiedCampaignCard(camp, 'now')).join('')}
                </div>
              </div>
            ` : ''}
            ${nowMaintain.length > 0 ? `
              <div class="mc-sublane-section maintain-section" id="nowSublaneMaintain">
                <div class="mc-sublane-divider"></div>
                <div class="mc-sublane-head maintain">
                  <div class="mc-sublane-title-wrap">
                    <span class="mc-sublane-tag maintain">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      <span>MAINTAIN</span>
                    </span>
                    <span class="mc-sublane-desc">Steady state &bull; background routines &amp; cadence</span>
                  </div>
                  <span class="mc-sublane-count-badge maintain">${nowMaintain.length} steady</span>
                </div>
                <div class="mc-focus-grid mc-maintain-grid" id="nowMaintainList">
                  ${nowMaintain.map(camp => renderUnifiedCampaignCard(camp, 'now')).join('')}
                </div>
              </div>
            ` : ''}
          `;
        })()}

        <div class="mc-divider"></div>

        <div class="mc-lane-head" id="laterLaneHead">
          <div class="l">
            <span class="mc-lane-tag later">🧊 LATER</span>
            <span class="mc-muted">On deck &amp; parking lot · next in queue once bandwidth opens</span>
          </div>
          <button type="button" class="mc-add" id="addLater" onclick="promptAddCampaignItem('later')">+ Add to later</button>
        </div>
        ${(() => {
          const isMaintainItem = (camp) => {
            if (!camp) return false;
            const isHc = (camp.id === 'camp-haircare' || (camp.title || '').toLowerCase().trim() === 'haircare');
            const raw = String(camp.status || (isHc ? 'Maintain' : 'NS')).trim().toLowerCase();
            return raw === 'maintain' || raw === 'review';
          };
          const laterPrimary = campaignsData.later.filter(c => !isMaintainItem(c));
          const laterMaintain = campaignsData.later.filter(c => isMaintainItem(c));
          if (campaignsData.later.length === 0) {
            return `<div class="mc-later-grid" id="laterList"><div class="mc-empty">Parking lot is empty.</div></div>`;
          }
          return `
            ${laterPrimary.length > 0 ? `
              <div class="mc-later-grid" id="laterList">
                ${laterPrimary.map(camp => renderUnifiedCampaignCard(camp, 'later')).join('')}
              </div>
            ` : ''}
            ${laterMaintain.length > 0 ? `
              <div class="mc-later-grid mc-maintain-row" id="laterMaintainList">
                ${laterMaintain.map(camp => renderUnifiedCampaignCard(camp, 'later')).join('')}
              </div>
            ` : ''}
          `;
        })()}
      </section>

      <div class="mc-side">

        <section class="mc-panel mc-workflow-panel ${isWorkflowWide ? 'is-wide' : ''}" aria-labelledby="tT" id="section-architecture-blueprint">
          <div class="mc-panel-head">
            <h2 id="tT">System compass</h2>
          </div>

          <!-- Modern Bento Grid Architecture (Native Interactive UI) -->
          <div class="mc-bento-grid">
            <!-- 1. margo -->
            <div class="mc-bento-card mc-bento-hero" onclick="switchAppView('sanctuary')" title="margo (Tap to open Daily Sheet)">
              <div class="mc-bento-top-row">
                <div class="mc-bento-brand">
                  <span class="mc-tb m">m</span>
                  <span class="mc-bento-name">margo</span>
                </div>
                <span class="mc-bento-badge cmd">COMMAND &amp; CONTROL</span>
              </div>
            </div>

            <!-- 2. Things 3 -->
            <div class="mc-bento-card mc-bento-things" title="Things 3">
              <div class="mc-bento-top-row" onclick="openThings3Query('')">
                <div class="mc-bento-brand">
                  <span class="mc-tb T3">T3</span>
                  <span class="mc-bento-name">Things 3</span>
                </div>
                <span class="mc-bento-badge exec">EXECUTION</span>
              </div>
              <div class="mc-bento-tags">
                <span class="mc-bento-tag high" onclick="openThings3Query('🌶️ #high priority')" title="Open 🌶️ High Priority in Things 3">🌶️ High Priority</span>
                <span class="mc-bento-tag active" onclick="openThings3Query('🐾 #active')" title="Open 🐾 Active in Things 3">🐾 Active</span>
                <span class="mc-bento-tag later" onclick="openThings3Query('🧊 #later')" title="Open 🧊 Later in Things 3">🧊 Later</span>
              </div>
            </div>

            <!-- 3. Gmail -->
            <div class="mc-bento-card" onclick="window.open('https://mail.google.com', '_blank')" title="Gmail (Tap to open)">
              <div class="mc-bento-top-row">
                <span class="mc-tb mail">${COMPASS_MAIL_SVG}</span>
                <span class="mc-bento-badge inflow">INFLOW</span>
              </div>
              <span class="mc-bento-name">Gmail</span>
            </div>

            <!-- 4. Apple Notes -->
            <div class="mc-bento-card" onclick="copyAppleNoteLauncher('')" title="Apple Notes (Tap to open)">
              <div class="mc-bento-top-row">
                <span class="mc-tb N">N</span>
                <span class="mc-bento-badge notes">MASTER NOTES</span>
              </div>
              <span class="mc-bento-name">Apple Notes</span>
            </div>

            <!-- 5. Google Drive -->
            <div class="mc-bento-card mc-bento-vault" onclick="window.open('https://drive.google.com', '_blank')" title="Google Drive (Tap to open)">
              <div class="mc-bento-top-row">
                <div class="mc-bento-brand">
                  <span class="mc-tb G">G</span>
                  <span class="mc-bento-name">Google Drive</span>
                </div>
                <span class="mc-bento-badge vault">MASTER VAULT</span>
              </div>
            </div>
          </div>
        </section>

        <section class="mc-panel" aria-labelledby="fT" id="section-framework-shelf">
          <div class="mc-fw-head">
            <div>
              <h2 id="fT">MARGO framework</h2>
              <span class="mc-muted">Daily intentional design buckets &amp; core focus areas</span>
            </div>
            <button type="button" id="fwBtn" aria-expanded="${fwOpen ? 'true' : 'false'}" aria-controls="pillars" onclick="toggleCompassFramework()">${fwOpen ? 'Collapse' : 'Expand'}</button>
          </div>
          <div class="mc-pillars" id="pillars" style="display:${fwOpen ? 'grid' : 'none'}">
            ${COMPASS_PILLARS.map(p => `
              <article class="mc-pl ${p.k}">
                <div class="hd">
                  <span class="ltr" aria-hidden="true">${p.k}</span>
                  <h3>${escapeHtml(p.n)}</h3>
                </div>
                <div class="cs">
                  ${p.c.map(chip => `<span>${escapeHtml(chip)}</span>`).join('')}
                </div>
              </article>
            `).join('')}
          </div>
        </section>

        <section class="mc-panel" aria-labelledby="pT" id="section-presets-shelf">
          <h2 id="pT">Habit presets</h2>
          <span class="mc-muted">Tap a preset to add it to your daily tracking stack</span>
          <div class="mc-presets" id="presets">
            ${RECOMMENDED_HABIT_PRESETS.map((preset, pIdx) => {
              const pName = preset.name.toLowerCase().trim();
              const isStand = (pName === 'stand ring' || pName === 'stand');
              const isAdded = isStand
                ? !standPresetDisabled
                : habits.some(h => h && h.name.toLowerCase().trim() === pName);
              return `
                <button type="button"
                        aria-pressed="${isAdded ? 'true' : 'false'}"
                        data-n="${escapeHtml(preset.name)}"
                        onclick="addHabitFromPresetCover(${pIdx})">${isAdded ? '✓ ' : '+ '}${escapeHtml(preset.name)}</button>
              `;
            }).join('')}
          </div>
        </section>

      </div>

      <div id="mc-toast" role="status" aria-live="polite" style="display:${compassUndoState ? 'flex' : 'none'}">
        <span id="mcToastMsg">${compassUndoState ? escapeHtml(compassUndoState.message) : ''}</span>
        <button type="button" id="mcToastUndo" onclick="undoCompassRemove()">Undo</button>
      </div>

    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}
window.renderCoverHubPage = renderCoverHubPage;

function promptEditSeasonFocus() {
  const current = (typeof localStorage !== 'undefined' && localStorage.getItem('BOL_COVER_SEASON_FOCUS')) || 'Calm Mastery, Health Baseline & Vitality';
  const updated = prompt('Focus theme', current);
  if (updated && updated.trim()) {
    try {
      localStorage.setItem('BOL_COVER_SEASON_FOCUS', updated.trim());
    } catch (e) {}
    renderCoverHubPage();
  }
}
window.promptEditSeasonFocus = promptEditSeasonFocus;

/* --------------------------------------------------------------------------
   Unified Life Architecture Card Renderer & Handlers
   -------------------------------------------------------------------------- */
function getDomainThemeClass(camp) {
  const meta = getCampaignCategoryMeta(camp);
  return meta.theme;
}
window.getDomainThemeClass = getDomainThemeClass;

function getCampaignCategoryMeta(camp) {
  const t = (camp.title || camp.id || '').toLowerCase();
  if (t.includes('school') || t.includes('iep') || t.includes('ood') || t.includes('windsor')) {
    return {
      tag: 'ED',
      name: 'School & IEP',
      theme: 'ED',
      dotColor: '#8B7FD6',
      summerTheme: 'theme-lavender',
      accentColor: '#6C2E7B',
      icon: 'graduation-cap',
      badgeClass: 'budget-badge-violet'
    };
  }
  if (t.includes('surgery') || t.includes('health') || t.includes('doctor') || t.includes('clinic')) {
    return {
      tag: 'HEALTH',
      name: 'Health & Surgery',
      theme: 'HEALTH',
      dotColor: '#7DB8FF',
      summerTheme: 'theme-sky',
      accentColor: '#0D3B66',
      icon: 'heart-pulse',
      badgeClass: 'budget-badge-sky'
    };
  }
  if (t.includes('oon') || t.includes('reimb') || t.includes('claim') || t.includes('superbill') || t.includes('finan') || t.includes('money') || t.includes('tax') || t.includes('budget')) {
    return {
      tag: 'FIN',
      name: 'Finance & Claims',
      theme: 'FIN',
      dotColor: '#E75480',
      summerTheme: 'theme-rose',
      accentColor: '#E75480',
      icon: 'receipt',
      badgeClass: 'budget-badge-rose'
    };
  }
  if (t.includes('home') || t.includes('declutter') || t.includes('room') || t.includes('closet')) {
    return {
      tag: 'HOME',
      name: 'Home Declutter',
      theme: 'HOME',
      dotColor: '#FF8A5B',
      summerTheme: 'theme-coral',
      accentColor: '#FF8A5B',
      icon: 'home',
      badgeClass: 'budget-badge-coral'
    };
  }
  if (t.includes('food') || t.includes('nutri') || t.includes('meal') || t.includes('diet') || t.includes('cook') || t.includes('grow')) {
    return {
      tag: 'GROW',
      name: 'Growth & Nutrition',
      theme: 'GROW',
      dotColor: '#FF8A5B',
      summerTheme: 'theme-coral',
      accentColor: '#FF8A5B',
      icon: 'sprout',
      badgeClass: 'budget-badge-coral'
    };
  }
  if (camp.cat && ['ED', 'HEALTH', 'FIN', 'HOME', 'CARE', 'GROW'].includes(camp.cat)) {
    const catMap = {
      ED: { name: 'Education & IEP', summerTheme: 'theme-lavender', accentColor: '#6C2E7B', icon: 'graduation-cap', badgeClass: 'budget-badge-violet', dotColor: '#8B7FD6' },
      HEALTH: { name: 'Health & Wellness', summerTheme: 'theme-sky', accentColor: '#0D3B66', icon: 'heart-pulse', badgeClass: 'budget-badge-sky', dotColor: '#7DB8FF' },
      FIN: { name: 'Finance & Claims', summerTheme: 'theme-rose', accentColor: '#E75480', icon: 'receipt', badgeClass: 'budget-badge-rose', dotColor: '#E75480' },
      HOME: { name: 'Home & Space', summerTheme: 'theme-coral', accentColor: '#FF8A5B', icon: 'home', badgeClass: 'budget-badge-coral', dotColor: '#FF8A5B' },
      GROW: { name: 'Growth & Learning', summerTheme: 'theme-coral', accentColor: '#FF8A5B', icon: 'sprout', badgeClass: 'budget-badge-coral', dotColor: '#FF8A5B' },
      CARE: { name: 'Self Care & Routine', summerTheme: 'theme-rose', accentColor: '#E75480', icon: 'sparkles', badgeClass: 'budget-badge-rose', dotColor: '#E75480' }
    };
    const m = catMap[camp.cat] || catMap.CARE;
    return { tag: camp.cat, theme: camp.cat, ...m };
  }
  return {
    tag: 'CARE',
    name: 'Self Care & Routine',
    theme: 'CARE',
    dotColor: '#E75480',
    summerTheme: 'theme-rose',
    accentColor: '#E75480',
    icon: 'sparkles',
    badgeClass: 'budget-badge-rose'
  };
}
window.getCampaignCategoryMeta = getCampaignCategoryMeta;

function resolveCampaignTools(camp) {
  const tools = camp.tools || {};
  const isArr = Array.isArray(tools);
  const findInArr = (fn) => isArr ? tools.find(fn) : null;
  const campTitle = camp.title || '';

  let margoAction = 'margo';
  let margoLabel = campTitle;
  if (!isArr && tools.margo) {
    margoAction = tools.margo.action || 'margo';
    margoLabel = tools.margo.label || campTitle;
  } else if (isArr) {
    const m = findInArr(t => t.action || t.isRoadmap || String(t.label || t).toLowerCase().includes('margo') || String(t.label || t).toLowerCase().includes('checkpoint'));
    if (m) {
      margoAction = m.action || (m.isRoadmap ? 'school-plan' : 'margo');
      margoLabel = m.label || campTitle;
    }
  }

  let noteQuery = `# ${campTitle.toUpperCase().replace(/[^A-Z0-9_ ]/g, '')}`;
  if (!isArr && tools.apple && tools.apple.noteQuery) {
    noteQuery = tools.apple.noteQuery;
  } else if (isArr) {
    const a = findInArr(t => t.noteQuery || String(t.label || t).toLowerCase().includes('note'));
    if (a && a.noteQuery) noteQuery = a.noteQuery;
  }

  let driveFolder = campTitle;
  if (!isArr && tools.google && tools.google.folder) {
    driveFolder = tools.google.folder;
  } else if (isArr) {
    const g = findInArr(t => t.folder || String(t.label || t).toLowerCase().includes('drive'));
    if (g && g.folder) driveFolder = g.folder;
  }

  let thingsQuery = campTitle;
  if (!isArr && tools.things && tools.things.query) {
    thingsQuery = tools.things.query;
  } else if (isArr) {
    const t = findInArr(t => t.query || String(t.label || t).toLowerCase().includes('things'));
    if (t && t.query) thingsQuery = t.query;
  }

  let emailQuery = campTitle;
  if (!isArr && tools.email && tools.email.emailQuery) {
    emailQuery = tools.email.emailQuery;
  } else if (isArr) {
    const e = findInArr(t => t.emailQuery || String(t.label || t).toLowerCase().includes('gmail') || String(t.label || t).toLowerCase().includes('email'));
    if (e && e.emailQuery) emailQuery = e.emailQuery;
  }

  return {
    margoAction,
    margoLabel,
    noteQuery,
    driveFolder,
    thingsQuery,
    emailQuery
  };
}
window.resolveCampaignTools = resolveCampaignTools;

function renderUnifiedCampaignCard(camp, tier) {
  const isNow = tier === 'now';
  const isHaircare = (camp.id === 'camp-haircare' || (camp.title || '').toLowerCase().trim() === 'haircare');
  const isSurgery = (camp.id === 'camp-surgery' || (camp.title || '').toLowerCase().trim() === 'surgery');
  const isOon = (camp.id === 'camp-oon' || (camp.title || '').toLowerCase().includes('oon') || (camp.title || '').toLowerCase().includes('reimburse'));
  const catMeta = getCampaignCategoryMeta(camp);

  // Normalize display title for Z school & oon to match Compass design cleanly while preserving custom titles
  let displayTitle = camp.title || '';
  if (camp.id === 'camp-school' && displayTitle.toLowerCase().includes('z school')) {
    displayTitle = 'Z school & IEP';
  } else if (camp.id === 'camp-oon' || displayTitle.toLowerCase().includes('reimb') || displayTitle.toLowerCase() === 'oon reimbrsement') {
    displayTitle = 'oon';
  }

  // Normalize status: IP, Maintain, NS
  let statusKey = String(camp.status || (isHaircare ? 'Maintain' : (isNow ? 'IP' : 'NS'))).trim();
  if (isHaircare && (!camp.status || camp.status === 'IP')) statusKey = 'Maintain';
  else if (statusKey === 'strike' || statusKey.toLowerCase() === 'ip' || statusKey === 'active') statusKey = 'IP';
  else if (statusKey === 'ondeck' || statusKey === 'waiting' || statusKey.toLowerCase() === 'ns') statusKey = 'NS';
  else if (statusKey === 'review' || statusKey.toLowerCase() === 'maintain') statusKey = 'Maintain';
  else if (!['IP', 'NS', 'Maintain'].includes(statusKey)) statusKey = isNow ? 'IP' : 'NS';

  const statusNames = { IP: 'In progress', Maintain: 'Maintain', NS: 'Not started' };
  const statusLabel = statusKey === 'Maintain' ? 'Maintain' : statusKey;
  const statusBtnHtml = `
    <button type="button"
            class="mc-status ${statusKey}"
            aria-label="Status: ${statusNames[statusKey] || statusKey}. Tap to change"
            onclick="cycleCampaignStatus('${camp.id}', event)">
      <i></i>${statusLabel}
    </button>
  `;

  const escapedTitleForJs = escapeHtml((camp.title || '').replace(/'/g, "\\'"));
  const xBtnHtml = `
    <button type="button"
            class="mc-x"
            aria-label="Remove ${escapeHtml(displayTitle)}"
            onclick="deleteCampaignAction('${camp.id}', '${tier}')">×</button>
  `;

  if (!isNow) {
    return `
      <div class="mc-lr ${catMeta.tag} ${statusKey === 'Maintain' ? 'is-maintain' : ''}">
        <span class="mc-dot" aria-hidden="true" style="background: ${catMeta.dotColor || '#E75480'}"></span>
        <span class="mc-nm" onclick="promptEditCampaignTitle('${camp.id}', '${escapedTitleForJs}')" title="Tap to edit title" style="cursor:pointer">${escapeHtml(displayTitle)}</span>
        <button type="button" class="mc-mv" aria-label="Move ${escapeHtml(displayTitle)} to now" onclick="moveCampaignAction('${camp.id}', 'later', 'now')">+ Now</button>
        ${xBtnHtml}
      </div>
    `;
  }

  return `
    <article class="mc-fc ${catMeta.tag} ${catMeta.summerTheme} ${statusKey === 'Maintain' ? 'is-maintain' : ''}">
      <div class="mc-fc-top">
        <div class="mc-fc-head-left">
          <span class="budget-badge ${catMeta.badgeClass}">${catMeta.tag}</span>
          <h3 class="mc-fc-title" onclick="promptEditCampaignTitle('${camp.id}', '${escapedTitleForJs}')" title="Tap to edit title" style="cursor:pointer">${escapeHtml(displayTitle)}</h3>
        </div>
        <div class="mc-top-actions">
          ${statusBtnHtml}
          <span class="mc-sep" aria-hidden="true"></span>
          <button type="button" class="mc-mv" aria-label="Move ${escapeHtml(displayTitle)} to later" onclick="moveCampaignAction('${camp.id}', 'now', 'later')">Later →</button>
        </div>
      </div>
    </article>
  `;
}
window.renderUnifiedCampaignCard = renderUnifiedCampaignCard;

function cycleCampaignStatus(campId, event) {
  if (event) event.stopPropagation();
  if (typeof storage === 'undefined') return;
  const campaigns = storage.getCoverCampaigns();
  let camp = campaigns.now.find(x => x.id === campId) || campaigns.later.find(x => x.id === campId);
  if (!camp) return;

  const statusNext = { IP: 'Maintain', Maintain: 'NS', NS: 'IP' };
  let currentKey = camp.status || 'IP';
  if (currentKey === 'strike' || currentKey === 'active') currentKey = 'IP';
  else if (currentKey === 'ondeck' || currentKey === 'waiting') currentKey = 'NS';
  else if (currentKey === 'review') currentKey = 'Maintain';

  const nextStatus = statusNext[currentKey] || 'IP';
  storage.updateCoverCampaignStatus(campId, nextStatus);
  renderCoverHubPage();
}
window.cycleCampaignStatus = cycleCampaignStatus;

function moveCampaignAction(campId, fromTier, toTier) {
  if (typeof storage !== 'undefined') {
    storage.moveCoverCampaign(campId, fromTier, toTier);
    renderCoverHubPage();
  }
}
window.moveCampaignAction = moveCampaignAction;

function deleteCampaignAction(campId, tier) {
  if (typeof storage !== 'undefined') {
    const campaigns = storage.getCoverCampaigns();
    const arr = campaigns[tier] || [];
    const idx = arr.findIndex(x => x.id === campId);
    if (idx !== -1) {
      const removedItem = JSON.parse(JSON.stringify(arr[idx]));
      storage.deleteCoverCampaign(campId, tier);
      let displayTitle = removedItem.title || '';
      if (removedItem.id === 'camp-school' && displayTitle.toLowerCase().includes('z school')) displayTitle = 'Z school & IEP';
      else if (removedItem.id === 'camp-oon' || displayTitle.toLowerCase().includes('reimb') || displayTitle.toLowerCase() === 'oon reimbrsement') displayTitle = 'oon';

      compassUndoState = {
        tier,
        index: idx,
        item: removedItem,
        message: `Removed "${displayTitle}"`
      };
      clearTimeout(compassToastTimer);
      compassToastTimer = setTimeout(() => {
        compassUndoState = null;
        const toastEl = document.getElementById('mc-toast');
        if (toastEl) toastEl.style.display = 'none';
      }, 6000);
      renderCoverHubPage();
    }
  }
}
window.deleteCampaignAction = deleteCampaignAction;

function undoCompassRemove() {
  if (!compassUndoState || typeof storage === 'undefined') return;
  const { tier, index, item } = compassUndoState;
  const campaigns = storage.getCoverCampaigns();
  if (!campaigns[tier]) campaigns[tier] = [];
  campaigns[tier].splice(Math.min(index, campaigns[tier].length), 0, item);
  storage.data.coverUpdatedAt = Date.now();
  storage.saveData();
  compassUndoState = null;
  clearTimeout(compassToastTimer);
  renderCoverHubPage();
}
window.undoCompassRemove = undoCompassRemove;

function promptAddCampaignItem(tier) {
  const title = prompt(tier === 'now' ? 'New focus' : 'Add to later');
  if (title && title.trim().length > 0 && typeof storage !== 'undefined') {
    storage.addCoverCampaign(tier, {
      title: title.trim(),
      cat: 'GROW',
      status: tier === 'now' ? 'IP' : 'NS',
      visibleTools: [],
      tools: {}
    });
    renderCoverHubPage();
  }
}
window.promptAddCampaignItem = promptAddCampaignItem;

function promptEditCampaignTitle(campId, currentTitle) {
  const newTitle = prompt('Edit focus title:', currentTitle);
  if (newTitle && newTitle.trim().length > 0 && typeof storage !== 'undefined') {
    const campaigns = storage.getCoverCampaigns();
    let camp = campaigns.now.find(x => x.id === campId) || campaigns.later.find(x => x.id === campId);
    if (camp) {
      camp.title = newTitle.trim();
      storage.data.coverUpdatedAt = Date.now();
      storage.saveData();
      renderCoverHubPage();
    }
  }
}
window.promptEditCampaignTitle = promptEditCampaignTitle;

/* --------------------------------------------------------------------------
   Where Info Lives Event Handlers & Modal
   -------------------------------------------------------------------------- */
function openTopicAuditModal(editId = null) {
  editingTopicAuditId = editId;
  let audit = null;
  if (editId && typeof storage !== 'undefined') {
    const list = storage.getCoverTopicAudits();
    audit = list.find(x => x.id === editId);
  }

  let modal = document.getElementById('modal-topic-audit');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-topic-audit';
    modal.className = 'modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) closeTopicAuditModal(); };
    document.body.appendChild(modal);
  }

  const topicVal = audit ? audit.topic : '';
  const toolsVal = audit && Array.isArray(audit.tools) ? audit.tools.join(', ') : '';
  const statusVal = audit ? audit.status : 'in_progress';

  modal.innerHTML = `
    <div class="modal-card" style="max-width: 480px;">
      <div class="modal-header">
        <h3>${audit ? '✏️ Edit Topic' : '🌿 Add Topic'}</h3>
        <button class="icon-btn" onclick="closeTopicAuditModal()"><i data-lucide="x"></i></button>
      </div>

      <form onsubmit="submitTopicAuditModal(event)">
        <div class="form-group">
          <label class="form-label">Topic / Life Area</label>
          <input type="text" class="form-input" id="audit-form-topic" placeholder="e.g. Skincare, Kids Health, Wardrobe, Home Logistics..." value="${escapeHtml(topicVal)}" required>
        </div>

        <div class="form-group">
          <label class="form-label">Where It Lives Currently</label>
          <div style="margin-bottom: 8px;">
            <span style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-bottom: 6px;">
              Potential Sources (tap to toggle):
            </span>
            <div class="source-picker-pills" id="source-picker-pills">
              ${(typeof POTENTIAL_INFO_SOURCES !== 'undefined' ? POTENTIAL_INFO_SOURCES : [
                { id: 'margo', label: 'margo' },
                { id: 'icloud', label: 'iCloud' },
                { id: 'drive', label: 'Google Drive' },
                { id: 'things', label: 'Things 3' },
                { id: 'email', label: 'emails' },
                { id: 'notes', label: 'Apple notes' }
              ]).map(src => {
                const currentArr = audit && Array.isArray(audit.tools) ? audit.tools : [];
                const isSelected = currentArr.some(t => t.toLowerCase() === src.label.toLowerCase());
                return `
                  <button type="button" 
                          class="source-toggle-pill ${isSelected ? 'selected' : ''}" 
                          onclick="toggleSourcePickerPill('${escapeHtml(src.label)}', this)">
                    ${isSelected ? '✓ ' : '+ '}${escapeHtml(src.label)}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
          <input type="text" class="form-input" id="audit-form-tools" placeholder="e.g. margo, Apple notes, Google Drive..." value="${escapeHtml(toolsVal)}" required>
          <span style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px; display: block;">
            Tap chips above or type custom comma-separated sources
          </span>
        </div>

        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" id="audit-form-status">
            <option value="in_progress" ${statusVal === 'in_progress' ? 'selected' : ''}>🔄 In Progress (Untangling &amp; organizing)</option>
            <option value="streamlined" ${statusVal === 'streamlined' ? 'selected' : ''}>✅ Organized (Clear &amp; simplified)</option>
            <option value="disorganized" ${statusVal === 'disorganized' ? 'selected' : ''}>⚠️ Cluttered (Needs cleanup)</option>
          </select>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px;">
          <button type="button" class="btn btn-secondary" onclick="closeTopicAuditModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" style="background: #6C2E7B; border-color: #6C2E7B; color: #FFFFFF;">${audit ? 'Save Changes' : 'Add Topic'}</button>
        </div>
      </form>
    </div>
  `;

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}
window.openTopicAuditModal = openTopicAuditModal;

function toggleSourcePickerPill(sourceName, btn) {
  const input = document.getElementById('audit-form-tools');
  if (!input) return;
  let currentList = input.value.split(',').map(s => s.trim()).filter(Boolean);
  const idx = currentList.findIndex(s => s.toLowerCase() === sourceName.toLowerCase());
  if (idx !== -1) {
    currentList.splice(idx, 1);
    if (btn) {
      btn.classList.remove('selected');
      btn.textContent = '+ ' + sourceName;
    }
  } else {
    currentList.push(sourceName);
    if (btn) {
      btn.classList.add('selected');
      btn.textContent = '✓ ' + sourceName;
    }
  }
  input.value = currentList.join(', ');
}
window.toggleSourcePickerPill = toggleSourcePickerPill;

function closeTopicAuditModal() {
  const modal = document.getElementById('modal-topic-audit');
  if (modal) modal.classList.remove('active');
  editingTopicAuditId = null;
}
window.closeTopicAuditModal = closeTopicAuditModal;

function submitTopicAuditModal(event) {
  event.preventDefault();
  const topic = document.getElementById('audit-form-topic').value.trim();
  const tools = document.getElementById('audit-form-tools').value.split(',').map(s => s.trim()).filter(Boolean);
  const status = document.getElementById('audit-form-status').value;

  if (typeof storage !== 'undefined') {
    if (editingTopicAuditId) {
      storage.updateCoverTopicAudit(editingTopicAuditId, { topic, tools, status });
      if (typeof showToast === 'function') showToast(`Updated "${topic}"`);
    } else {
      storage.addCoverTopicAudit({ topic, tools, status });
      if (typeof showToast === 'function') showToast(`Added "${topic}"`);
    }
  }

  closeTopicAuditModal();
  renderCoverHubPage();
}
window.submitTopicAuditModal = submitTopicAuditModal;

function editTopicAuditAction(id) {
  openTopicAuditModal(id);
}
window.editTopicAuditAction = editTopicAuditAction;

function deleteTopicAuditAction(id) {
  if (confirm('Delete this topic from Where Info Lives?')) {
    if (typeof storage !== 'undefined') {
      storage.deleteCoverTopicAudit(id);
      renderCoverHubPage();
      if (typeof showToast === 'function') showToast('Topic removed');
    }
  }
}
window.deleteTopicAuditAction = deleteTopicAuditAction;

function addHabitFromPresetCover(presetIndex) {
  const preset = RECOMMENDED_HABIT_PRESETS[presetIndex];
  if (!preset || typeof storage === 'undefined') return;

  const pName = preset.name.toLowerCase().trim();
  if (pName === 'stand ring' || pName === 'stand') {
    try {
      const currentOff = localStorage.getItem('BOL_COMPASS_STAND_PRESET_OFF') === 'true';
      localStorage.setItem('BOL_COMPASS_STAND_PRESET_OFF', String(!currentOff));
    } catch (e) {}
    renderCoverHubPage();
    return;
  }

  const existing = storage.getHabits().find(h => h && h.name.toLowerCase().trim() === pName);
  if (existing && existing.id !== 'h-move' && existing.id !== 'h-stand') {
    storage.deleteHabit(existing.id);
  } else if (!existing) {
    storage.addHabit(preset);
  }
  renderCoverHubPage();
}
window.addHabitFromPresetCover = addHabitFromPresetCover;

/* --------------------------------------------------------------------------
   Active Campaigns & Life Architecture Interactive Helpers
   -------------------------------------------------------------------------- */
function copyAppleNoteLauncher(noteTitle) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(noteTitle).then(() => {
      if (typeof showToast === 'function') {
        showToast(`📋 Copied "${noteTitle}" — paste or search in Apple Notes`);
      }
    }).catch(() => {
      if (typeof showToast === 'function') showToast(`Apple Note: ${noteTitle}`);
    });
  } else if (typeof showToast === 'function') {
    showToast(`Apple Note: ${noteTitle}`);
  }
}
window.copyAppleNoteLauncher = copyAppleNoteLauncher;

function copyThingsStrike(strikeText) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(strikeText).then(() => {
      if (typeof showToast === 'function') {
        showToast(`⚡ Copied strike to clipboard: "${strikeText}"`);
      }
    }).catch(() => {
      if (typeof showToast === 'function') showToast(`Strike: ${strikeText}`);
    });
  } else if (typeof showToast === 'function') {
    showToast(`Strike: ${strikeText}`);
  }
}
window.copyThingsStrike = copyThingsStrike;

function openDriveFolder(folderName) {
  const url = 'https://drive.google.com/drive/search?q=' + encodeURIComponent(folderName);
  window.open(url, '_blank', 'noopener,noreferrer');
  if (typeof showToast === 'function') {
    showToast(`📁 Opening Google Drive search for "${folderName}"`);
  }
}
window.openDriveFolder = openDriveFolder;

function openGmailLabel(labelName) {
  const url = 'https://mail.google.com/mail/u/0/#search/label%3A' + encodeURIComponent(labelName);
  window.open(url, '_blank', 'noopener,noreferrer');
  if (typeof showToast === 'function') {
    showToast(`✉️ Opening Gmail for label "${labelName}"`);
  }
}
window.openGmailLabel = openGmailLabel;

function jumpToHaircareCheckpoint() {
  if (typeof switchAppView === 'function') {
    switchAppView('sanctuary');
  }
  setTimeout(() => {
    const el = document.getElementById('checkpoint-haircare') || 
               document.querySelector('[data-checkpoint="haircare"]') || 
               document.getElementById('section-haircare') ||
               document.getElementById('hair');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (typeof showToast === 'function') {
      showToast('🗓️ Jumped to Sanctuary for Haircare Checkpoint');
    }
  }, 120);
}
window.jumpToHaircareCheckpoint = jumpToHaircareCheckpoint;

function jumpToSkinCareCheckpoint() {
  if (typeof switchAppView === 'function') {
    switchAppView('sanctuary');
  }
  setTimeout(() => {
    const el = document.getElementById('checkpoint-skincare') || 
               document.querySelector('[data-checkpoint="skincare"]') || 
               document.getElementById('section-skincare') ||
               document.getElementById('skincareTile');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (typeof openSkinCareLogModal === 'function') {
      openSkinCareLogModal();
    }
  }, 120);
}
window.jumpToSkinCareCheckpoint = jumpToSkinCareCheckpoint;

function jumpToSanctuaryCheckpoint(checkpointKey) {
  if (typeof switchAppView === 'function') {
    switchAppView('sanctuary');
  }
  setTimeout(() => {
    const el = document.getElementById(`checkpoint-${checkpointKey}`) ||
               document.querySelector(`[data-checkpoint="${checkpointKey}"]`) ||
               document.getElementById(`section-${checkpointKey}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 120);
}
window.jumpToSanctuaryCheckpoint = jumpToSanctuaryCheckpoint;

function handleMargoToolClick(campId, action, title) {
  const lower = (title || '').toLowerCase();
  if (action === 'school-plan' || lower.includes('school') || lower.includes('iep') || lower.includes('ood')) {
    openSchoolBattlePlanModal();
  } else if (action === 'haircare' || lower.includes('hair')) {
    jumpToHaircareCheckpoint();
  } else if (action === 'skincare' || lower.includes('skin')) {
    jumpToSkinCareCheckpoint();
  } else if (action === 'vitality' || lower.includes('surg')) {
    jumpToSanctuaryCheckpoint('vitality');
  } else if (action === 'claims' || lower.includes('reimb') || lower.includes('claim')) {
    if (typeof switchDomain === 'function') switchDomain('finance');
    if (typeof activeFinanceSubTab !== 'undefined') activeFinanceSubTab = 'claims';
  } else if (action === 'finance' || lower.includes('finan') || lower.includes('money')) {
    if (typeof switchDomain === 'function') switchDomain('finance');
  } else if (action === 'choices' || lower.includes('food')) {
    jumpToSanctuaryCheckpoint('choices');
  } else {
    if (typeof showToast === 'function') {
      showToast(`🌿 margo: Focused on ${title}`);
    }
  }
}
window.handleMargoToolClick = handleMargoToolClick;

function openThings3Query(query) {
  const clean = encodeURIComponent(query || '');
  const url = `things:///show?query=${clean}`;
  try {
    window.location.href = url;
  } catch (e) {}
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(query);
  }
  if (typeof showToast === 'function') {
    showToast(`⚡ Things 3: Opened & copied "${query}"`);
  }
}
window.openThings3Query = openThings3Query;

/* --------------------------------------------------------------------------
   School Admissions & OOD Placement Battle Plan Modal & Setup Helpers
   -------------------------------------------------------------------------- */
function jumpToZHubDailyLogs() {
  closeAllModals();
  if (typeof switchDomain === 'function') {
    switchDomain('zhub');
  }
  if (typeof showToast === 'function') {
    showToast('🌱 Opened Z Hub: Behavior Logs & PDF Attachments');
  }
}
window.jumpToZHubDailyLogs = jumpToZHubDailyLogs;

function copySchoolBattlePlanTemplate() {
  const template = `# 🏛️ Z: SCHOOL ADMISSIONS & OOD PLACEMENT
*Battle Plan & Operating System*

## 📌 CURRENT STATUS
- Phase: Phase 2 (School Selection & Admissions Tours)
- Target: Secure admissions seat and finalize transfer
- Parallel: Hold district accountable for IEP non-compliance & police incident

## ⏳ WAITING ON RADAR
- [ ] Windsor admissions tour date confirmation (Ping Oct 8)
- [ ] District records transmittal packet (Ping Oct 10)

## ⚡ NEXT STRIKES IN THINGS 3
- [ ] 📞 Call Windsor admissions re: tour
- [ ] 📄 Request copy of police incident report from precinct

## 🗺️ PHASE ROADMAP
### Phase 1: District OOD Agreement [COMPLETE ✅]
- [x] Secured formal district consensus for out-of-district specialized placement

### Phase 2: School Selection & Admissions [ACTIVE 📌]
- [x] Compile candidate school list (Windsor School, etc.)
- [ ] Tour candidate schools & intake interviews
- [ ] Submit application packet & neuropsych evaluations
- [ ] Receive acceptance letter & seat confirmation

### Phase 3: Transfer & IEP Transition [UP NEXT ⏳]
- [ ] District-funded transportation coordination
- [ ] Transfer IEP accommodations & therapist hours (OT/Speech)
- [ ] First day orientation & student transition

### Phase 4: District Accountability & Police Incident [PARALLEL ⚖️]
- [ ] Obtain police incident report from precinct
- [ ] Document non-compliance timeline vs PWN records
- [ ] Formal district follow-through

## 📁 EVIDENCE & RECORDS (Google Drive)
- Folder: Z Records / IEP Docs
- Files: Neuropsych eval, Signed IEPs, Prior Written Notices (PWNs), Incident records`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(template).then(() => {
      if (typeof showToast === 'function') {
        showToast('📋 Copied Battle Plan Template to clipboard!');
      }
    }).catch(() => {
      if (typeof showToast === 'function') showToast('Template copied');
    });
  } else if (typeof showToast === 'function') {
    showToast('Template copied');
  }
}
window.copySchoolBattlePlanTemplate = copySchoolBattlePlanTemplate;

function openSchoolBattlePlanModal() {
  let modal = document.getElementById('modal-school-battleplan');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'modal-school-battleplan';
    modal.onclick = function(e) {
      if (e.target === this) closeAllModals();
    };
    modal.innerHTML = `
      <div class="modal-card modal-school-card">
        <div class="school-modal-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.25rem;">🏛️</span>
              <h3 class="school-modal-title">Z: School Admissions &amp; OOD Placement</h3>
            </div>
            <span class="school-modal-sub">Multi-Phase Roadmap &bull; Tool-by-Tool Operating Blueprint</span>
          </div>
          <button class="icon-btn" onclick="closeAllModals()" title="Close"><i data-lucide="x"></i></button>
        </div>

        <div class="school-modal-body">
          <!-- Current Phase Status Banner -->
          <div class="school-phase-banner">
            <div>
              <span class="banner-phase-label">Current Phase: Phase 2 of 4</span>
              <div class="banner-phase-focus">School Selection &amp; Admissions Tours</div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
              <span style="font-size: 0.72rem; font-weight: 700; color: #0D3B66; background: rgba(13, 59, 102, 0.1); padding: 2px 8px; border-radius: 9999px;">Radar: Windsor Oct 8</span>
              <span style="font-size: 0.68rem; color: #64748B;">Parallel: District PWN &amp; Police incident</span>
            </div>
          </div>

          <!-- Step-by-Step Sequence -->
          <div class="school-steps-block">
            <div class="school-block-heading">
              <span>📋 Ordered Milestones (Only 1–2 Active Strikes in Things 3)</span>
            </div>

            <!-- Phase 1 -->
            <div class="school-step-card is-done">
              <span class="step-card-status-badge status-badge-done">Phase 1 &bull; Done</span>
              <div class="step-card-content">
                <h5 class="step-card-title">Out-of-District (OOD) Placement Agreement</h5>
                <p class="step-card-desc">Formal consensus secured with school district that an out-of-district specialized placement is necessary and funded.</p>
              </div>
            </div>

            <!-- Phase 2 (Active) -->
            <div class="school-step-card is-active">
              <span class="step-card-status-badge status-badge-active">Phase 2 &bull; Active</span>
              <div class="step-card-content">
                <h5 class="step-card-title">School Selection &amp; Admissions Tours (Current Focus)</h5>
                <p class="step-card-desc">Tour approved candidate schools (e.g. Windsor School), conduct intake interviews, and secure placement seat.</p>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px;">
                  <span class="step-things-strike" onclick="copyThingsStrike('📞 Call Windsor admissions re: tour')" title="Copy to Things 3">
                    ⚡ Things 3: 📞 Call Windsor admissions re: tour
                  </span>
                  <span class="step-things-strike" onclick="copyThingsStrike('📅 Confirm tour date with admissions team')" title="Copy to Things 3">
                    ⚡ Things 3: 📅 Confirm tour date
                  </span>
                </div>
              </div>
            </div>

            <!-- Phase 3 -->
            <div class="school-step-card">
              <span class="step-card-status-badge status-badge-next">Phase 3 &bull; Up Next</span>
              <div class="step-card-content">
                <h5 class="step-card-title">Transfer Execution &amp; IEP Accommodation Transition</h5>
                <p class="step-card-desc">Coordinate district transportation routes, transfer specialist service hours (OT/Speech), and schedule student transition day.</p>
              </div>
            </div>

            <!-- Phase 4 (Parallel Track) -->
            <div class="school-step-card is-active" style="border-left: 3px solid #E75480;">
              <span class="step-card-status-badge status-badge-active" style="background: #0D3B66;">Phase 4 &bull; Parallel</span>
              <div class="step-card-content">
                <h5 class="step-card-title">District Accountability &amp; Police Incident Documentation</h5>
                <p class="step-card-desc">Hold district accountable for non-compliance timeline and document the police incident with precision.</p>
                <div style="margin-top: 6px;">
                  <span class="step-things-strike" onclick="copyThingsStrike('📄 Request copy of police incident report from precinct')" title="Copy to Things 3">
                    ⚡ Things 3: 📄 Request police incident report from precinct
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Where Everything Lives (Tool-by-Tool Guide) -->
          <div class="school-steps-block">
            <div class="school-block-heading">
              <span>🗂️ What Lives Where (Zero Duplicate Clutter)</span>
            </div>
            <div class="school-tools-map-grid">
              <div class="tool-map-box">
                <div class="tool-map-box-title" style="display: flex; align-items: center; gap: 6px;">
                  <span class="tool-symbol symbol-m" style="font-family:'Newsreader',Georgia,serif; font-style:italic; font-weight:700; color:#6C2E7B; font-size:0.95rem; line-height:1;">m</span>
                  <span>margo</span>
                </div>
                <div class="tool-map-box-desc">Cover Page Radar (10,000-ft phase horizon) + Z Hub Behavior Log (Daily PDF report attachments).</div>
              </div>
              <div class="tool-map-box">
                <div class="tool-map-box-title" style="display: flex; align-items: center; gap: 6px;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#E75480" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tool-apple-svg" style="width:13px; height:13px;"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>
                  <span>Apple Notes</span>
                </div>
                <div class="tool-map-box-desc"><strong># SCHOOL 01_BATTLE PLAN</strong>: School profiles, live impressions, tour observations, incident notes.</div>
              </div>
              <div class="tool-map-box">
                <div class="tool-map-box-title" style="display: flex; align-items: center; gap: 6px;">
                  <span class="tool-symbol symbol-google" style="font-weight:800; color:#0D3B66; font-size:0.76rem; line-height:1;">G</span>
                  <span>Google Drive</span>
                </div>
                <div class="tool-map-box-desc"><strong>📁 Z Records</strong>: Static evidence, signed IEP PDFs, neuropsych evaluations, police report PDFs, PWNs.</div>
              </div>
              <div class="tool-map-box">
                <div class="tool-map-box-title" style="display: flex; align-items: center; gap: 6px;">
                  <span class="tool-symbol symbol-things" style="font-weight:800; color:#0D3B66; font-size:0.68rem; letter-spacing:-0.04em; line-height:1;">T3</span>
                  <span>Things 3 &amp;</span>
                  <i data-lucide="mail" style="width:12px; height:12px; color:#E75480;"></i>
                  <span>Gmail</span>
                </div>
                <div class="tool-map-box-desc"><strong>Things 3</strong>: Next 1–2 physical strikes only.<br><strong>Gmail</strong>: Label <code>OOD-Placement</code> for all school correspondence.</div>
              </div>
            </div>
          </div>
        </div>

        <div class="school-modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" onclick="copySchoolBattlePlanTemplate()" title="Copy Markdown template for Apple Notes">
            📋 Copy Apple Notes Battle Plan Template
          </button>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="jumpToZHubDailyLogs()">🌱 Z Hub Logs</button>
            <button type="button" class="btn btn-primary btn-sm" onclick="closeAllModals()">Done</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  openModal('modal-school-battleplan');
  if (window.lucide) lucide.createIcons();
}
window.openSchoolBattlePlanModal = openSchoolBattlePlanModal;

function openCompassDiagramModal() {
  let modal = document.getElementById('modal-compass-diagram');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-compass-diagram';
    modal.className = 'modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) closeAllModals(); };
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-card modal-card-wide" style="max-width: 820px; padding: 18px 20px;">
      <div class="modal-header" style="margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.2rem;">🧭</span>
          <h3>System Compass Architecture</h3>
        </div>
        <button class="icon-btn" onclick="closeAllModals()" aria-label="Close"><i data-lucide="x"></i></button>
      </div>
      <div style="border-radius: 18px; overflow: hidden; border: 1px solid var(--line); background: #FFFFFF; box-shadow: 0 4px 16px rgba(0,0,0,0.06); margin-bottom: 14px;">
        <img src="assets/system-compass-architecture.svg?v=9.0.8" alt="System Compass Architecture Graphic" style="width: 100%; height: auto; display: block;">
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <a href="system-compass-graphic.html" target="_blank" class="btn btn-secondary btn-sm" style="text-decoration: none;">↗ Open Full Viewer</a>
        <button type="button" class="btn btn-primary btn-sm" onclick="closeAllModals()">Done</button>
      </div>
    </div>
  `;
  if (typeof openModal === 'function') {
    openModal('modal-compass-diagram');
  } else {
    modal.classList.add('active');
  }
  if (window.lucide) lucide.createIcons();
}
window.openCompassDiagramModal = openCompassDiagramModal;

function toggleWorkflowPanelWidth(e) {
  if (e) e.stopPropagation();
  let currentWide = false;
  try {
    currentWide = localStorage.getItem('BOL_COMPASS_WF_WIDE') === 'true';
  } catch (err) {}
  const nextWide = !currentWide;
  try {
    localStorage.setItem('BOL_COMPASS_WF_WIDE', String(nextWide));
  } catch (err) {}
  const panel = document.getElementById('section-architecture-blueprint');
  if (panel) {
    panel.classList.toggle('is-wide', nextWide);
    const label = document.getElementById('wf-expand-text');
    if (label) label.textContent = nextWide ? '⇤ Sidebar' : '⤢ Wide';
  }
}
window.toggleWorkflowPanelWidth = toggleWorkflowPanelWidth;




