# Progressive Web App (PWA) & Offline Architecture (P2-12)

## 1. Executive Summary & Viva Q&A
For school students in rural or intermittent internet areas in India, reliable offline access to CBSE textbook lessons, formula sheets, diagrams, and practice test MCQs is vital. StemEdu is designed as a **Progressive Web App (PWA)** that functions offline without requiring a heavy native Android APK installation.

---

## 2. Core PWA Concepts

### 2.1 Web App Manifest (`manifest.json`)
A JSON metadata file describing how the platform appears when installed on a mobile device or desktop:
- `display: standalone`: Launches full-screen like a native Android/iOS app with no browser address bar.
- `start_url`: Opens directly to `/dashboard`.
- `theme_color`: Sets Android status bar color to `#2563EB`.

### 2.2 Service Worker (`sw.js`)
An event-driven script running in a background thread separate from the webpage:
- Intercepts all outbound network `fetch` requests.
- Implements custom caching strategies (Cache-First vs Network-First).
- Serves precached assets and an offline fallback screen when disconnected.

---

## 3. Caching Strategies (P2-12.3)

| Resource Type | Strategy | Rationale |
|---|---|---|
| **App Shell (HTML, JS, CSS, Fonts)** | **Cache-First (Precache)** | UI loads instantly within 50ms without waiting for cellular network. |
| **Curriculum Lessons & Diagrams** | **Stale-While-Revalidate** | Serves cached lesson content immediately while fetching updates silently in the background. |
| **Practice Test Questions** | **Cache with Manual Download** | Pre-fetches chapter questions into IndexedDB so students can take tests offline. |
| **Supabase Auth & Tokens** | **Network-Only (Never Cached)** | Security requirement: credentials, JWTs, and refresh tokens are never cached in public Service Worker storage. |

---

## 4. Local Database Persistence (`IndexedDB` & `localStorage`) (P2-12.4)
While the Service Worker Cache API stores raw HTTP request/response pairs, structured data is stored locally in client-side storage:
- `stem_offline_lessons`: Full text, summaries, and formula blocks for downloaded chapters.
- `stem_offline_mcqs`: 15+ multiple choice questions per chapter for offline practice test execution.
- `stem_offline_notes`: Student personal notes and rendered handwriting canvas pages.
- `stem_offline_sync_queue`: Test attempts completed while offline, queued to sync back to Supabase once network reconnects (`window.addEventListener('online', ...)`).
