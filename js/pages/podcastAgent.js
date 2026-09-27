/* ==========================================================================
   margo Podcast Agent — Controller & View Renderer
   Zero-dependency Vanilla ES6 module for Book of Life (margo)
   ========================================================================== */

let activeVaultTab = 'completed';
let vaultSearchQuery = '';
let podcastQueueDrawerOpen = false;

function togglePodcastQueueDrawer() {
  podcastQueueDrawerOpen = !podcastQueueDrawerOpen;
  const drawer = document.getElementById('podcast-drawer-contents');
  const btnText = document.getElementById('podcast-drawer-btn-text');
  if (drawer) drawer.style.display = podcastQueueDrawerOpen ? 'block' : 'none';
  if (btnText) btnText.textContent = podcastQueueDrawerOpen ? 'Close Queue ▴' : 'Queue & Vault ▾';
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * Render sleek Podcast Agent Card for Sanctuary Daily Sheet
 */
function renderPodcastAgentCard() {
  const data = (typeof PodcastStore !== 'undefined') ? PodcastStore.load() : INITIAL_PODCAST_STORE;
  const now = data.nowPlaying || {};
  const currentEp = Number(now.currentEpisode || 1);
  const totalEp = Number(now.totalEpisodes || 14);
  const progressPercent = Math.min(100, Math.round((currentEp / totalEp) * 100));

  return `
    <!-- Podcast Sanctuary Shelf Card -->
    <div class="cover-card podcast-agent-card-wrapper" id="section-podcast-agent" style="margin-bottom: 24px;">
      
      <!-- Sleek Audio Deck Widget -->
      <div class="now-spinning-card podcast-lounge-dock">
        <div class="spinning-top-meta">
          <div class="pulse-indicator">
            <span class="audio-equalizer">
              <span class="eq-bar"></span>
              <span class="eq-bar"></span>
              <span class="eq-bar"></span>
              <span class="eq-bar"></span>
            </span>
            Audio Sanctuary • Active Serial
          </div>
          <span class="podcast-genre-pill">
            ${now.genre || 'Investigative'}
          </span>
        </div>

        <div class="podcast-title-row">
          <h1 class="spinning-title">${now.title || 'No Active Serial'}</h1>
          <span class="podcast-ep-bubble">Ep ${currentEp} / ${totalEp}</span>
        </div>
        <div class="spinning-host">Hosted by ${now.host || 'Unknown'}</div>

        <!-- Progress Tracker -->
        <div class="episode-progress-bar-wrap">
          <div class="episode-progress-labels">
            <span>Season Progress</span>
            <span style="font-weight: 700; color: var(--primary);">${progressPercent}%</span>
          </div>
          <div class="progress-track podcast-glowing-track">
            <div class="progress-fill podcast-glowing-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <!-- Controls -->
        <div class="progress-controls podcast-player-controls">
          <div style="display: flex; gap: 6px;">
            <button class="ep-btn podcast-pill-btn" onclick="adjustPodcastEpisode(-1)" title="Previous Episode">
              <i data-lucide="chevron-left" style="width: 14px; height: 14px;"></i> Prev
            </button>
            <button class="ep-btn podcast-pill-btn" onclick="adjustPodcastEpisode(1)" title="Next Episode">
              Next <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="ep-btn podcast-pill-btn" onclick="togglePodcastQueueDrawer()" style="color: var(--primary);">
              <i data-lucide="list-music" style="width: 14px; height: 14px;"></i>
              <span id="podcast-drawer-btn-text">${podcastQueueDrawerOpen ? 'Close Queue ▴' : 'Queue & Vault ▾'}</span>
            </button>
            <button class="ep-btn primary podcast-done-btn" onclick="markCurrentSerialComplete()" title="Finish & Archive">
              <i data-lucide="check" style="width: 14px; height: 14px;"></i> Done
            </button>
          </div>
        </div>
      </div>

      <!-- Expandable Queue & Vault Drawer -->
      <div id="podcast-drawer-contents" style="display: ${podcastQueueDrawerOpen ? 'block' : 'none'}; margin-top: 18px; padding-top: 18px; border-top: 1px dashed var(--border-light);">
        
        <!-- Next Up Recommendations -->
        <div style="margin-bottom: 22px;">
          <div class="podcast-section-header">
            <h3 class="podcast-section-title" style="font-size: 1.05rem;">
              <i data-lucide="sparkles" style="width: 16px; height: 16px; color: var(--primary);"></i>
              Next Up: Curated For You
            </h3>
            <span style="font-size: 0.74rem; color: var(--text-muted);">Matches Bone Valley DNA</span>
          </div>

          <div class="recommendations-card-list">
            ${(data.curatedQueue || []).slice(0, 3).map((show, idx) => `
              <div class="rec-card">
                <div class="rec-card-header">
                  <div class="rec-rank-title-group">
                    <span class="rec-rank-badge">#${idx + 1}</span>
                    <div>
                      <h4 class="rec-title">${show.title}</h4>
                      <div class="rec-hosts">${show.hosts} • ${show.episodes} episodes</div>
                    </div>
                  </div>
                  <div class="rec-action-group">
                    <button class="rec-action-btn skip" onclick="skipPodcastRecommendation('${show.id}')" title="Skip for now">
                      <i data-lucide="skip-forward" style="width: 12px; height: 12px;"></i> Skip
                    </button>
                    <button class="rec-action-btn listened" onclick="markPodcastAlreadyListened('${show.id}')" title="Already listened">
                      <i data-lucide="check" style="width: 12px; height: 12px;"></i> Listened
                    </button>
                    <button class="rec-promote-btn" onclick="promotePodcastToShow('${show.id}')" title="Make this your active primary serial">
                      <i data-lucide="play" style="width: 12px; height: 12px;"></i> Start Next
                    </button>
                  </div>
                </div>
                <div class="rec-reason">${show.recommendationReason}</div>
                <div class="rec-footer">
                  <span class="rec-starter">
                    <i data-lucide="play-circle" style="width: 13px; height: 13px; color: var(--primary);"></i>
                    Start with: <strong>${show.starterEpisode}</strong>
                  </span>
                  <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">${show.genre}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Episodic Buffer -->
        <div style="margin-bottom: 22px;">
          <div class="podcast-section-header">
            <h3 class="podcast-section-title" style="font-size: 1.05rem;">
              <i data-lucide="compass" style="width: 16px; height: 16px; color: var(--margo-g, #0284C7);"></i>
              Daily Episodic Buffer
            </h3>
            <span style="font-size: 0.74rem; color: var(--text-muted);">Short drop-ins</span>
          </div>
          <div class="episodic-grid">
            ${(data.episodicQueue || []).map(ep => `
              <div class="episodic-item-card">
                <div class="episodic-item-title">${ep.title}</div>
                <div class="episodic-item-genre">${ep.genre} • ${ep.frequency}</div>
                <div class="episodic-item-vibe">${ep.vibe}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- The Archive / Vault -->
        <div>
          <div class="podcast-section-header">
            <h3 class="podcast-section-title" style="font-size: 1.05rem;">
              <i data-lucide="archive" style="width: 16px; height: 16px; color: var(--text-muted);"></i>
              The Archive & Vault
            </h3>
          </div>

          <div class="vault-tabs">
            <button class="vault-tab-btn ${activeVaultTab === 'completed' ? 'active' : ''}" onclick="setVaultTab('completed')">
              Done (${(data.completed || []).length})
            </button>
            <button class="vault-tab-btn ${activeVaultTab === 'parked' ? 'active' : ''}" onclick="setVaultTab('parked')">
              Parked (${(data.parkedSerials || []).length})
            </button>
            <button class="vault-tab-btn ${activeVaultTab === 'interested' ? 'active' : ''}" onclick="setVaultTab('interested')">
              Interested (${(data.interested || []).length})
            </button>
            <button class="vault-tab-btn ${activeVaultTab === 'research' ? 'active' : ''}" onclick="setVaultTab('research')">
              Research (${(data.research || []).length})
            </button>
            <button class="vault-tab-btn ${activeVaultTab === 'didNotLove' ? 'active' : ''}" onclick="setVaultTab('didNotLove')">
              Blacklist (${(data.didNotLove || []).length})
            </button>
          </div>

          <input 
            type="text" 
            class="vault-search-box" 
            placeholder="Filter library by title or genre..." 
            value="${vaultSearchQuery}" 
            oninput="handleVaultSearch(this.value)"
          />

          <div id="vault-items-container">
            ${renderVaultItems(data, activeVaultTab, vaultSearchQuery)}
          </div>
        </div>

      </div>
    </div>
  `;
}

function renderPodcastAgentView(targetElementId = 'daily-sheet-container') {
  const container = document.getElementById(targetElementId);
  if (!container) return;
  podcastQueueDrawerOpen = true; // Always expand in full view
  container.innerHTML = `<div class="podcast-agent-container">${renderPodcastAgentCard()}</div>`;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderVaultItems(data, tab, query = '') {
  const q = query.toLowerCase().trim();

  if (tab === 'completed') {
    const list = (data.completed || []).filter(item => !q || item.title.toLowerCase().includes(q) || (item.category && item.category.toLowerCase().includes(q)));
    if (!list.length) return `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No shows match filter.</div>`;
    return list.map(item => `
      <div class="vault-item-row">
        <div>
          <span class="vault-title">${item.title}</span>
          <div class="vault-meta">${item.category || 'Archive'}</div>
        </div>
        <div style="color: #F59E0B; font-size: 0.8rem; letter-spacing: 2px;">
          ${'★'.repeat(item.rating || 5)}
        </div>
      </div>
    `).join('');
  }

  if (tab === 'parked') {
    const list = (data.parkedSerials || []).filter(item => !q || item.title.toLowerCase().includes(q) || (item.notes && item.notes.toLowerCase().includes(q)));
    if (!list.length) return `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No parked shows.</div>`;
    return list.map(item => `
      <div class="vault-item-row">
        <div>
          <span class="vault-title">${item.title}</span>
          <div class="vault-meta">${item.notes || ''}</div>
        </div>
        <span style="font-size: 0.72rem; padding: 2px 8px; border-radius: 6px; background: var(--bg-surface); color: var(--text-muted);">Parked</span>
      </div>
    `).join('');
  }

  if (tab === 'interested') {
    const list = (data.interested || []).filter(item => !q || item.title.toLowerCase().includes(q) || (item.genre && item.genre.toLowerCase().includes(q)));
    if (!list.length) return `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No items match filter.</div>`;
    return list.map(item => `
      <div class="vault-item-row">
        <div>
          <span class="vault-title">${item.title}</span>
          <div class="vault-meta">${item.genre || ''}</div>
        </div>
        <span style="font-size: 0.72rem; padding: 2px 8px; border-radius: 6px; background: var(--primary-light); color: var(--primary); font-weight: 600;">
          ${item.priority || 'Medium'}
        </span>
      </div>
    `).join('');
  }

  if (tab === 'research') {
    const list = (data.research || []).filter(item => !q || item.title.toLowerCase().includes(q) || (item.note && item.note.toLowerCase().includes(q)));
    if (!list.length) return `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No items match filter.</div>`;
    return list.map(item => `
      <div class="vault-item-row">
        <div>
          <span class="vault-title">${item.title}</span>
          <div class="vault-meta">${item.note || ''}</div>
        </div>
        <span style="font-size: 0.72rem; padding: 2px 8px; border-radius: 6px; ${item.status === 'Greenlit' ? 'background: rgba(16, 185, 129, 0.12); color: #059669;' : 'background: var(--bg-surface); color: var(--text-muted);'} font-weight: 600;">
          ${item.status}
        </span>
      </div>
    `).join('');
  }

  if (tab === 'didNotLove') {
    const list = (data.didNotLove || []).filter(item => !q || item.title.toLowerCase().includes(q) || (item.reason && item.reason.toLowerCase().includes(q)));
    if (!list.length) return `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No blacklist items.</div>`;
    return list.map(item => `
      <div class="vault-item-row">
        <div>
          <span class="vault-title" style="text-decoration: line-through; opacity: 0.8;">${item.title}</span>
          <div class="vault-meta" style="color: #EF4444;">${item.reason || 'Not your style'}</div>
        </div>
        <span style="font-size: 0.72rem; padding: 2px 8px; border-radius: 6px; background: rgba(239, 68, 68, 0.1); color: #DC2626;">Blocked</span>
      </div>
    `).join('');
  }

  return '';
}

function refreshPodcastView() {
  if (typeof currentView !== 'undefined' && currentView === 'sanctuary' && typeof renderDailySheet === 'function') {
    renderDailySheet();
  } else if (typeof renderPodcastAgentView === 'function') {
    renderPodcastAgentView();
  }
}

/* Event Handlers */
function adjustPodcastEpisode(delta) {
  const data = PodcastStore.load();
  if (!data.nowPlaying) return;
  let nextEp = Math.max(1, Math.min(Number(data.nowPlaying.totalEpisodes || 20), Number(data.nowPlaying.currentEpisode || 1) + delta));
  PodcastStore.updateProgress(nextEp);
  refreshPodcastView();
}

function markCurrentSerialComplete() {
  const data = PodcastStore.load();
  if (!data.nowPlaying) return;

  const finishedTitle = data.nowPlaying.title;
  if (confirm(`Celebrate finishing "${finishedTitle}" and archive it to your Hall of Fame?`)) {
    if (typeof confetti === 'function') {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    }
    const topRec = (data.curatedQueue && data.curatedQueue[0]) ? data.curatedQueue[0].id : null;
    if (topRec) {
      PodcastStore.promoteToNowPlaying(topRec);
    } else {
      data.completed.unshift({ title: finishedTitle, rating: 5, category: data.nowPlaying.genre });
      data.nowPlaying = null;
      PodcastStore.save(data);
    }
    refreshPodcastView();
  }
}

function promotePodcastToShow(showId) {
  PodcastStore.promoteToNowPlaying(showId);
  refreshPodcastView();
  if (typeof confetti === 'function') {
    confetti({ particleCount: 40, spread: 45, origin: { y: 0.6 } });
  }
}

function skipPodcastRecommendation(showId) {
  PodcastStore.skipRecommendation(showId);
  refreshPodcastView();
}

function markPodcastAlreadyListened(showId) {
  PodcastStore.markRecommendationAlreadyListened(showId, 5);
  refreshPodcastView();
  if (typeof confetti === 'function') {
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
  }
}

function setVaultTab(tab) {
  activeVaultTab = tab;
  const container = document.getElementById('vault-items-container');
  if (container) {
    const data = PodcastStore.load();
    container.innerHTML = renderVaultItems(data, activeVaultTab, vaultSearchQuery);
    // Update active tab buttons
    document.querySelectorAll('.vault-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.toLowerCase().includes(tab.toLowerCase()));
    });
  } else {
    refreshPodcastView();
  }
}

function handleVaultSearch(val) {
  vaultSearchQuery = val;
  const container = document.getElementById('vault-items-container');
  if (container) {
    const data = PodcastStore.load();
    container.innerHTML = renderVaultItems(data, activeVaultTab, vaultSearchQuery);
  }
}
