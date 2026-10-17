/* ==========================================================================
   margo. — Hobby Page: "Find my hobby" Pixel-Accurate Implementation
   Matches user screenshot layout, typography, pill cloud, and dark shortlist card
   Categories: Sports (14), Creative (15 incl. Pottery), Technical (2), Misc (9)
   Strict Rule: Zero Yellow / Amber, Zero Dartboard Target Icons
   ========================================================================== */

const HOBBY_DATA = {
  sports: {
    title: 'SPORTS',
    dotClass: 'dot-sports',
    items: [
      'Tennis',
      'Pickleball',
      'Padel',
      'Squash',
      'Kickboxing',
      'Yoga',
      'Jazzercise',
      'Zumba',
      'Barre',
      'Pilates',
      'Martial arts',
      'Hiking',
      'Running',
      'Cycling'
    ]
  },
  creative: {
    title: 'CREATIVE',
    dotClass: 'dot-creative',
    items: [
      'Pottery & Wheel Throwing',
      'Chess',
      'Book club',
      'Drawing',
      'Painting',
      'Reading',
      'Writing',
      'Journaling',
      'Cooking',
      'Baking',
      'Photography',
      'Piano',
      'Knitting',
      'Crochet',
      'Calligraphy'
    ]
  },
  technical: {
    title: 'TECHNICAL',
    dotClass: 'dot-technical',
    items: [
      'Coding',
      'Web design'
    ]
  },
  misc: {
    title: 'MISCELLANEOUS',
    dotClass: 'dot-misc',
    items: [
      'Planning',
      'Organizing',
      'Graphic design',
      'Public speaking',
      'Storytelling',
      'Fashion',
      'Traveling',
      'Explore new cuisines',
      'Volunteer'
    ]
  }
};

function getAllHobbyItems() {
  const all = [];
  Object.values(HOBBY_DATA).forEach(cat => {
    all.push(...cat.items);
  });
  return all;
}

function handleHobbyPillClick(name) {
  if (typeof storage === 'undefined') return;
  const current = storage.getHobbyShortlist();
  const exists = current.includes(name);

  if (!exists && current.length >= 3) {
    if (typeof showToast === 'function') {
      showToast(`Shortlist is full (3/3). Replaced "${current[0]}" with "${name}".`);
    }
  }

  storage.toggleHobbyShortlist(name);
  renderHobbyPage();
}
window.handleHobbyPillClick = handleHobbyPillClick;

function handleRemoveSlot(name, event) {
  if (event) event.stopPropagation();
  if (typeof storage === 'undefined') return;
  storage.removeFromHobbyShortlist(name);
  renderHobbyPage();
}
window.handleRemoveSlot = handleRemoveSlot;

function handleSurpriseMe() {
  if (typeof storage === 'undefined') return;
  const current = storage.getHobbyShortlist();
  const all = getAllHobbyItems();
  const unpicked = all.filter(item => !current.includes(item));
  const pool = unpicked.length > 0 ? unpicked : all;

  const pick = pool[Math.floor(Math.random() * pool.length)];
  storage.toggleHobbyShortlist(pick);

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 35,
      spread: 55,
      origin: { y: 0.2 },
      colors: ['#7C3AED', '#6D28D9', '#B5ABFF', '#E15B45']
    });
  }

  if (typeof showToast === 'function') {
    showToast(`✨ Surprise pick: "${pick}" added to your shortlist!`);
  }

  renderHobbyPage();
}
window.handleSurpriseMe = handleSurpriseMe;

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

  const shortlist = (typeof storage !== 'undefined') ? storage.getHobbyShortlist() : [];

  let html = `
    <div class="find-hobby-container">
      
      <!-- Header matching screenshot -->
      <header class="find-hobby-header">
        <div class="find-hobby-title-wrap">
          <h1 class="find-hobby-title">
            <span>Find my hobby</span>
            <span class="find-hobby-fire">🔥</span>
          </h1>
          <p class="find-hobby-sub">
            Browse the ideas, pick up to 3 to try. Start with one.
          </p>
        </div>

        <button type="button" class="btn-surprise-me" onclick="handleSurpriseMe()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 3 21 3 21 8"></polyline>
            <line x1="4" y1="20" x2="21" y2="3"></line>
            <polyline points="21 16 21 21 16 21"></polyline>
            <line x1="15" y1="15" x2="21" y2="21"></line>
            <line x1="4" y1="4" x2="9" y2="9"></line>
          </svg>
          <span>Surprise me</span>
        </button>
      </header>

      <!-- Main Layout: Bento Categories on Left + MY SHORTLIST on Right -->
      <div class="find-hobby-grid">

        <!-- Left Bento Grid (4 Category Cards) -->
        <div class="categories-bento-grid">

          <!-- Card 1: SPORTS -->
          <div class="category-card">
            <div class="category-card-header">
              <span class="category-dot dot-sports"></span>
              <span>SPORTS</span>
              <span class="category-count">${HOBBY_DATA.sports.items.length}</span>
            </div>
            <div class="pills-cloud">
              ${HOBBY_DATA.sports.items.map(item => {
                const isSelected = shortlist.includes(item);
                return `<button type="button" class="hobby-pill ${isSelected ? 'selected' : ''}" onclick="handleHobbyPillClick('${escapeHtml(item)}')">${escapeHtml(item)}</button>`;
              }).join('')}
            </div>
          </div>

          <!-- Card 2: CREATIVE (Featuring Pottery & Wheel Throwing) -->
          <div class="category-card">
            <div class="category-card-header">
              <span class="category-dot dot-creative"></span>
              <span>CREATIVE</span>
              <span class="category-count">${HOBBY_DATA.creative.items.length}</span>
            </div>
            <div class="pills-cloud">
              ${HOBBY_DATA.creative.items.map(item => {
                const isSelected = shortlist.includes(item);
                return `<button type="button" class="hobby-pill ${isSelected ? 'selected' : ''}" onclick="handleHobbyPillClick('${escapeHtml(item)}')">${escapeHtml(item)}</button>`;
              }).join('')}
            </div>
          </div>

          <!-- Card 3: TECHNICAL -->
          <div class="category-card">
            <div class="category-card-header">
              <span class="category-dot dot-technical"></span>
              <span>TECHNICAL</span>
              <span class="category-count">${HOBBY_DATA.technical.items.length}</span>
            </div>
            <div class="pills-cloud">
              ${HOBBY_DATA.technical.items.map(item => {
                const isSelected = shortlist.includes(item);
                return `<button type="button" class="hobby-pill ${isSelected ? 'selected' : ''}" onclick="handleHobbyPillClick('${escapeHtml(item)}')">${escapeHtml(item)}</button>`;
              }).join('')}
            </div>
          </div>

          <!-- Card 4: MISCELLANEOUS -->
          <div class="category-card">
            <div class="category-card-header">
              <span class="category-dot dot-misc"></span>
              <span>MISCELLANEOUS</span>
              <span class="category-count">${HOBBY_DATA.misc.items.length}</span>
            </div>
            <div class="pills-cloud">
              ${HOBBY_DATA.misc.items.map(item => {
                const isSelected = shortlist.includes(item);
                return `<button type="button" class="hobby-pill ${isSelected ? 'selected' : ''}" onclick="handleHobbyPillClick('${escapeHtml(item)}')">${escapeHtml(item)}</button>`;
              }).join('')}
            </div>
          </div>

        </div> <!-- /.categories-bento-grid -->

        <!-- Right Column: MY SHORTLIST Card -->
        <aside class="shortlist-sidebar-card">
          <div class="shortlist-card-header">
            <h3 class="shortlist-card-title">MY SHORTLIST</h3>
            <span class="shortlist-card-counter">${shortlist.length} of 3 picked</span>
          </div>

          <div class="shortlist-slots-col">
            ${[0, 1, 2].map(slotIdx => {
              const pickedItem = shortlist[slotIdx];
              if (pickedItem) {
                return `
                  <div class="shortlist-slot filled">
                    <div class="slot-inner-left">
                      <span class="slot-number">${slotIdx + 1}</span>
                      <span class="slot-label" title="${escapeHtml(pickedItem)}">${escapeHtml(pickedItem)}</span>
                    </div>
                    <button type="button" class="btn-remove-slot" onclick="handleRemoveSlot('${escapeHtml(pickedItem)}', event)" title="Remove from shortlist">✕</button>
                  </div>
                `;
              } else {
                return `
                  <div class="shortlist-slot empty">
                    <div class="slot-inner-left">
                      <span class="slot-number">${slotIdx + 1}</span>
                      <span class="slot-label">Open slot</span>
                    </div>
                  </div>
                `;
              }
            }).join('')}
          </div>
        </aside>

      </div> <!-- /.find-hobby-grid -->

    </div> <!-- /.find-hobby-container -->
  `;

  container.innerHTML = html;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
window.renderHobbyPage = renderHobbyPage;
