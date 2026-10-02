/* ==========================================================================
   Book of Life / Life OS - Cover Page (Executive Index & System Compass)
   Operating Philosophy: [simple] → [visible] → [next step] → [done]
   ========================================================================== */

let editingTopicAuditId = null;

function renderCoverHubPage() {
  const container = document.getElementById('daily-sheet-container');
  if (!container) return;

  const topMind = (typeof storage !== 'undefined' && typeof storage.getCoverTopMind === 'function')
    ? storage.getCoverTopMind()
    : { now: [], later: [] };

  const topicAudits = (typeof storage !== 'undefined' && typeof storage.getCoverTopicAudits === 'function')
    ? storage.getCoverTopicAudits()
    : [];

  const habits = (typeof storage !== 'undefined' && typeof storage.getHabits === 'function')
    ? storage.getHabits()
    : [];

  container.innerHTML = `
    <div class="cover-hub-container">
      
      <!-- 1. Operating Mantra Strip (Direct from Screenshot) -->
      <div class="cover-mantra-strip">
        <div class="mantra-pill mantra-simple" title="Simple: Zero duplicate tracking or cognitive bloat">
          <span>simple</span>
        </div>
        <div class="mantra-pill mantra-visible" title="Visible: If it isn't front-and-center, it doesn't happen">
          <span>visible</span>
        </div>
        <div class="mantra-pill mantra-next" title="Next step: Every area has exactly one obvious immediate move">
          <span>next step</span>
        </div>
        <div class="mantra-pill mantra-done" title="Done: Frictionless 1-tap completion without guilt">
          <span>done</span>
        </div>
      </div>

      <!-- Quick Action / Transition to Today Banner -->
      <div class="cover-welcome-banner">
        <div class="welcome-banner-left">
          <div class="welcome-banner-greeting">
            <span class="greeting-symbol">🧭</span>
            <div>
              <h2 class="welcome-title">Executive Cover &amp; System Compass</h2>
              <span class="welcome-subtitle">Macro clarity, top-of-mind focus, and domain streamlining</span>
            </div>
          </div>
        </div>
        <button type="button" class="btn-jump-today" onclick="switchAppView('sanctuary')" title="Jump into today's execution cockpit">
          <span>Today's Daily Cockpit</span>
          <span class="jump-arrow">☀️ &rarr;</span>
        </button>
      </div>

      <!-- 2. Top of Mind: "Now vs. Later" Scratchpad -->
      <div class="cover-card top-mind-card" id="section-top-mind">
        <div class="card-title-row">
          <div class="title-with-desc">
            <h3>
              <i data-lucide="pin" style="color: var(--primary); width: 17px; height: 17px;"></i>
              Top of Mind Scratchpad
            </h3>
            <span class="card-sub-muted">Low-friction mental capture &bull; Split into Active Focus vs. Parking Lot</span>
          </div>
        </div>

        <div class="top-mind-pads-grid">
          
          <!-- PAD 1: NOW (Active Focus) -->
          <div class="top-mind-pad pad-now">
            <div class="pad-header">
              <div class="pad-title-group">
                <span class="pad-badge badge-now">📌 NOW</span>
                <span class="pad-subtitle">Active Focus (Max 3–5 items)</span>
              </div>
              <span class="pad-count-pill">${topMind.now.length}</span>
            </div>

            <!-- Inline Add Form -->
            <form class="pad-add-form" onsubmit="submitAddTopMind(event, 'now')">
              <input type="text" id="input-top-mind-now" class="pad-input" placeholder="+ Add something holding mental space..." required autocomplete="off" />
              <button type="submit" class="pad-add-btn">+ Add</button>
            </form>

            <!-- Items List -->
            <div class="pad-items-list">
              ${topMind.now.map(item => `
                <div class="pad-item" id="item-${item.id}">
                  <span class="pad-item-bullet">&bull;</span>
                  <div class="pad-item-text" onclick="promptEditTopMind('${item.id}', 'now', '${escapeHtml(item.text.replace(/'/g, "\\'"))}')" title="Click to edit">
                    ${escapeHtml(item.text)}
                  </div>
                  <div class="pad-item-actions">
                    <button type="button" class="pad-shift-btn" onclick="moveTopMindAction('${item.id}', 'now', 'later')" title="Move to Later (Parking Lot)">
                      <span>Later &rarr;</span>
                    </button>
                    <button type="button" class="pad-delete-btn" onclick="deleteTopMindAction('${item.id}', 'now')" title="Delete item">
                      <i data-lucide="x" style="width: 13px; height: 13px;"></i>
                    </button>
                  </div>
                </div>
              `).join('')}

              ${topMind.now.length === 0 ? `
                <div class="pad-empty-state">
                  <span>Nothing on your immediate plate. Enjoy the headspace!</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- PAD 2: LATER (On Deck / Parking Lot) -->
          <div class="top-mind-pad pad-later">
            <div class="pad-header">
              <div class="pad-title-group">
                <span class="pad-badge badge-later">⏳ LATER</span>
                <span class="pad-subtitle">On Deck &amp; Parking Lot</span>
              </div>
              <span class="pad-count-pill">${topMind.later.length}</span>
            </div>

            <!-- Inline Add Form -->
            <form class="pad-add-form" onsubmit="submitAddTopMind(event, 'later')">
              <input type="text" id="input-top-mind-later" class="pad-input" placeholder="+ Add ideas or future projects..." required autocomplete="off" />
              <button type="submit" class="pad-add-btn">+ Add</button>
            </form>

            <!-- Items List -->
            <div class="pad-items-list">
              ${topMind.later.map(item => `
                <div class="pad-item" id="item-${item.id}">
                  <span class="pad-item-bullet">&bull;</span>
                  <div class="pad-item-text" onclick="promptEditTopMind('${item.id}', 'later', '${escapeHtml(item.text.replace(/'/g, "\\'"))}')" title="Click to edit">
                    ${escapeHtml(item.text)}
                  </div>
                  <div class="pad-item-actions">
                    <button type="button" class="pad-shift-btn shift-back" onclick="moveTopMindAction('${item.id}', 'later', 'now')" title="Move to Now (Active Focus)">
                      <span>&larr; Now</span>
                    </button>
                    <button type="button" class="pad-delete-btn" onclick="deleteTopMindAction('${item.id}', 'later')" title="Delete item">
                      <i data-lucide="x" style="width: 13px; height: 13px;"></i>
                    </button>
                  </div>
                </div>
              `).join('')}

              ${topMind.later.length === 0 ? `
                <div class="pad-empty-state">
                  <span>No parked thoughts. Add ideas you want to tackle next!</span>
                </div>
              ` : ''}
            </div>
          </div>

        </div>
      </div>

      <!-- 3. Where Info Lives: Domain-by-Domain Streamlining Audit -->
      <div class="cover-card topic-audits-card" id="section-where-info-lives">
        <div class="card-title-row">
          <div class="title-with-desc">
            <h3>
              <i data-lucide="compass" style="color: var(--margo-m); width: 17px; height: 17px;"></i>
              Where Info Lives (Domain Streamlining Hub)
            </h3>
            <span class="card-sub-muted">
              Audit tools across your life areas (Notes, Margo, Drive, Things 3) &bull; Streamline one by one
            </span>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="openTopicAuditModal()" style="font-size: 0.78rem; padding: 5px 12px;">
            <i data-lucide="plus" style="width: 13px; height: 13px;"></i>
            <span>+ Add Domain</span>
          </button>
        </div>

        <div class="topic-audits-grid">
          ${topicAudits.map(audit => {
            let statusBadgeClass = 'status-in-progress';
            let statusLabel = '🟡 In Progress';
            if (audit.status === 'streamlined') {
              statusBadgeClass = 'status-streamlined';
              statusLabel = '✅ Streamlined';
            } else if (audit.status === 'disorganized') {
              statusBadgeClass = 'status-disorganized';
              statusLabel = '⚠️ Disorganized';
            }

            return `
              <div class="topic-audit-card">
                <div class="audit-card-top">
                  <div class="audit-topic-title">${escapeHtml(audit.topic)}</div>
                  <span class="audit-status-tag ${statusBadgeClass}">${statusLabel}</span>
                </div>

                <!-- Tools List -->
                <div class="audit-tools-row">
                  <span class="audit-meta-label">Where it lives:</span>
                  <div class="audit-tools-strip">
                    ${(audit.tools || []).map(tool => {
                      const tLower = tool.toLowerCase();
                      let tClass = 'tool-generic';
                      if (tLower.includes('margo')) tClass = 'tool-margo';
                      else if (tLower.includes('apple') || tLower.includes('notes')) tClass = 'tool-notes';
                      else if (tLower.includes('things')) tClass = 'tool-things';
                      else if (tLower.includes('drive') || tLower.includes('google')) tClass = 'tool-drive';
                      else if (tLower.includes('icloud')) tClass = 'tool-icloud';
                      else if (tLower.includes('photo')) tClass = 'tool-photos';
                      else if (tLower.includes('email')) tClass = 'tool-email';

                      return `<span class="tool-tag ${tClass}">${escapeHtml(tool)}</span>`;
                    }).join('')}
                  </div>
                </div>

                <!-- Goal / Next Step -->
                <div class="audit-goal-block">
                  <span class="audit-meta-label">Streamlining Goal:</span>
                  <p class="audit-goal-text">${escapeHtml(audit.goal || 'No goal set yet.')}</p>
                </div>

                <!-- Footer Actions -->
                <div class="audit-card-footer">
                  <button type="button" class="audit-btn-edit" onclick="editTopicAuditAction('${audit.id}')">
                    <span>✏️ Edit Goal &amp; Tools</span>
                  </button>
                  <button type="button" class="audit-btn-delete" onclick="deleteTopicAuditAction('${audit.id}')" title="Delete domain audit">
                    <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 4. MARGO Framework (5 Pillars) - Relocated permanently to Cover Page -->
      <div class="cover-card margo-framework-shelf" id="section-framework-shelf">
        ${typeof renderMargoFrameworkWidget === 'function' ? renderMargoFrameworkWidget() : ''}
      </div>

      <!-- 5. Habit Presets Repository - Relocated permanently to Cover Page -->
      <div class="cover-card habit-presets-shelf" id="section-presets-shelf">
        <div class="card-title-row">
          <div class="title-with-desc">
            <h3>
              <i data-lucide="sparkles" style="color: var(--margo-a); width: 17px; height: 17px;"></i>
              Habit Presets Repository
            </h3>
            <span class="card-sub-muted">Tap any preset to instantly add it to your daily tracking stack</span>
          </div>
        </div>

        <div class="presets-shelf-pills">
          ${RECOMMENDED_HABIT_PRESETS.map((preset, pIdx) => {
            const pName = preset.name.toLowerCase().trim();
            const isAnchor = (pName === 'stand ring' || pName === 'stand' || pName === 'move');
            const isAlreadyAdded = isAnchor || habits.some(h => 
              h && h.name.toLowerCase().trim() === pName
            );
            if (isAlreadyAdded) {
              const tooltip = isAnchor 
                ? (pName === 'move' ? 'Move is your Hero Anchor #1' : 'Stand is your Hero Anchor #2') 
                : `${escapeHtml(preset.name)} is already active in your daily stack`;
              return `
                <span class="preset-pill-item added" title="${tooltip}">
                  <span class="preset-pill-symbol">✓</span>
                  <span class="preset-pill-label">${escapeHtml(preset.name)}</span>
                </span>
              `;
            } else {
              return `
                <button type="button" class="preset-pill-item" onclick="addHabitFromPresetCover(${pIdx})" title="Add ${escapeHtml(preset.name)}: ${escapeHtml(preset.description)}">
                  <span class="preset-pill-symbol plus">+</span>
                  <span class="preset-pill-label">${escapeHtml(preset.name)}</span>
                </button>
              `;
            }
          }).join('')}
        </div>
      </div>

    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}
window.renderCoverHubPage = renderCoverHubPage;

/* --------------------------------------------------------------------------
   Top of Mind Event Handlers
   -------------------------------------------------------------------------- */
function submitAddTopMind(event, targetList) {
  event.preventDefault();
  const input = document.getElementById(`input-top-mind-${targetList}`);
  if (!input) return;
  const val = input.value.trim();
  if (val && typeof storage !== 'undefined') {
    storage.addCoverTopMindItem(targetList, val);
    input.value = '';
    renderCoverHubPage();
    if (typeof showToast === 'function') {
      showToast(`Added to ${targetList === 'now' ? 'Active Focus (Now)' : 'Parking Lot (Later)'}`);
    }
  }
}
window.submitAddTopMind = submitAddTopMind;

function moveTopMindAction(id, fromList, toList) {
  if (typeof storage !== 'undefined') {
    storage.moveCoverTopMindItem(id, fromList, toList);
    renderCoverHubPage();
    if (typeof showToast === 'function') {
      showToast(`Moved to ${toList === 'now' ? 'Now (Active Focus)' : 'Later (Parking Lot)'}`);
    }
  }
}
window.moveTopMindAction = moveTopMindAction;

function deleteTopMindAction(id, listName) {
  if (typeof storage !== 'undefined') {
    storage.deleteCoverTopMindItem(id, listName);
    renderCoverHubPage();
    if (typeof showToast === 'function') {
      showToast('Item removed from scratchpad');
    }
  }
}
window.deleteTopMindAction = deleteTopMindAction;

function promptEditTopMind(id, listName, currentText) {
  const newText = prompt('Edit scratchpad item:', currentText);
  if (newText !== null && newText.trim().length > 0 && typeof storage !== 'undefined') {
    storage.updateCoverTopMindItem(id, listName, newText.trim());
    renderCoverHubPage();
  }
}
window.promptEditTopMind = promptEditTopMind;

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
  const goalVal = audit ? audit.goal : '';

  modal.innerHTML = `
    <div class="modal-card" style="max-width: 480px;">
      <div class="modal-header">
        <h3>${audit ? '✏️ Edit Domain Audit' : '🧭 Audit New Domain'}</h3>
        <button class="icon-btn" onclick="closeTopicAuditModal()"><i data-lucide="x"></i></button>
      </div>

      <form onsubmit="submitTopicAuditModal(event)">
        <div class="form-group">
          <label class="form-label">Life Domain / Topic</label>
          <input type="text" class="form-input" id="audit-form-topic" placeholder="e.g. Skincare, Finances, Wardrobe, Kids Medical..." value="${escapeHtml(topicVal)}" required>
        </div>

        <div class="form-group">
          <label class="form-label">Tools Used Currently (Comma Separated)</label>
          <input type="text" class="form-input" id="audit-form-tools" placeholder="e.g. Apple Notes, Margo, Google Drive, Things 3..." value="${escapeHtml(toolsVal)}" required>
          <span style="font-size: 0.72rem; color: var(--text-muted); margin-top: 3px; display: block;">
            Examples: Apple Notes, Margo, Things 3, Google Drive, iCloud, Email, Photos
          </span>
        </div>

        <div class="form-group">
          <label class="form-label">Streamlining Status</label>
          <select class="form-select" id="audit-form-status">
            <option value="in_progress" ${statusVal === 'in_progress' ? 'selected' : ''}>🟡 In Progress (Streamlining)</option>
            <option value="streamlined" ${statusVal === 'streamlined' ? 'selected' : ''}>✅ Streamlined (Single source of truth)</option>
            <option value="disorganized" ${statusVal === 'disorganized' ? 'selected' : ''}>⚠️ Disorganized (Needs cleanup)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Streamlining Goal &amp; Next Action</label>
          <textarea class="form-input" id="audit-form-goal" rows="3" placeholder="What is the plan to simplify this? e.g. Consolidate notes into Margo; delete duplicate docs...">${escapeHtml(goalVal)}</textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px;">
          <button type="button" class="btn btn-secondary" onclick="closeTopicAuditModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">${audit ? 'Save Changes' : 'Add Domain'}</button>
        </div>
      </form>
    </div>
  `;

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}
window.openTopicAuditModal = openTopicAuditModal;

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
  const goal = document.getElementById('audit-form-goal').value.trim();

  if (typeof storage !== 'undefined') {
    if (editingTopicAuditId) {
      storage.updateCoverTopicAudit(editingTopicAuditId, { topic, tools, status, goal });
      if (typeof showToast === 'function') showToast(`Updated "${topic}"`);
    } else {
      storage.addCoverTopicAudit({ topic, tools, status, goal });
      if (typeof showToast === 'function') showToast(`Added domain "${topic}"`);
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
  if (confirm('Delete this domain audit from your system compass?')) {
    if (typeof storage !== 'undefined') {
      storage.deleteCoverTopicAudit(id);
      renderCoverHubPage();
      if (typeof showToast === 'function') showToast('Domain removed');
    }
  }
}
window.deleteTopicAuditAction = deleteTopicAuditAction;

function addHabitFromPresetCover(presetIndex) {
  const preset = RECOMMENDED_HABIT_PRESETS[presetIndex];
  if (!preset || typeof storage === 'undefined') return;

  const pName = preset.name.toLowerCase().trim();
  if (pName === 'stand ring' || pName === 'stand' || pName === 'move') {
    if (typeof showToast === 'function') showToast(`${preset.name} is already your Hero Anchor!`);
    return;
  }

  storage.addHabit(preset);
  if (typeof showToast === 'function') showToast(`Added "${preset.name}" to your daily stack!`);
  renderCoverHubPage();
}
window.addHabitFromPresetCover = addHabitFromPresetCover;
