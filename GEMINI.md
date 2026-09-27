# ⚡ Project Memory & Guidelines: margo

## 🌐 Live Production URL
- **Production App**: `https://ujjainid-droid.github.io/book-of-life/#`
- **Repository**: `ujjainid-droid/book-of-life` (`main` branch)
- **Local Dev Server**: `http://localhost:8000/`

---

## 🧭 Architecture & Core Conventions
1. **Frontend Stack**:
   - Zero-dependency Vanilla JavaScript (ES6+ modular architecture).
   - Custom CSS variables with light and dark mode (`css/nordic-theme.css`, `css/cover.css`).
   - LocalStorage persistence with Firebase Realtime Database sync (`js/storage.js`, `js/sync.js`).
   - External dependencies: Lucide Icons (`lucide@latest`), Canvas Confetti.

2. **Deployment & Cache Busting**:
   - Deployed via **GitHub Pages** from the `main` branch.
   - **Cache Busting**: Whenever modifying JavaScript or CSS files, always bump the cache buster query parameters (`?v=X.X.X`) across all stylesheet and script tags in `index.html`.

3. **Design & Aesthetic Language**:
   - **Nordic Minimalist & Serene**: Cool lavender / royal violet foundation (`#8B5CF6`, `#6D28D9`).
   - **Complementary Accents**: Nordic Sea Glass Teal (`#0D9488` / `#0F766E`) for checkpoint status and accents.
   - **Strict Palette Rule**: **NO yellow or amber** for status indicators or buttons.

4. **Habit & Momentum Engine**:
   - **Hero Anchors**: `Move` (`h-move`) and `Stand` (`h-stand`).
   - **3-State Segmented Pill Tracks**:
     - `Off` (0 XP, pending)
     - `50% Floor` (+5 XP, protects the streak on low-energy days)
     - `100% Closed` (+10 XP)
   - **5 Daily Checkpoints**: `Choices`, `Vitality`, `Anchors`, `Journal`, `Goals` with 1-tap smooth-scrolling to the respective section.

5. **Task Management Philosophy (Church & State)**:
   - **Things 3** handles functional task execution, appointments, errands, and to-do lists.
   - **margo** handles personal identity, physical momentum, vitality, and reflection.
