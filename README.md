# 🧪 STEM Edu — CBSE Class 10 & 12 Interactive Learning Platform (Phase 2)

> A production-grade, bilingual (English & Hindi) STEM education platform for CBSE Class 10 and Class 12 students across Mathematics, Physics, Chemistry, and Biology. Built on **Supabase** (Postgres + pgvector + Auth) and **Google Gemini 1.5 Flash**, featuring the **Saarthi AI Mentor & 24/7 Doubt Solver**, 9 Virtual Learning 3D simulations, 3D virtual experiments, a Text-to-Handwriting canvas studio with OCR, chapter video lectures, a Discord-style Community Hub, and offline PWA readiness.

[![Release](https://img.shields.io/badge/Release-v2.0--phase2-success?style=flat-square)](./Task2.md)
[![Database](https://img.shields.io/badge/Database-Supabase%20Postgres%20%7C%20pgvector-3ECF8E?style=flat-square)](https://supabase.com)
[![Curriculum](https://img.shields.io/badge/Curriculum-CBSE%20Class%2010%20%26%2012-orange?style=flat-square)](https://cbse.gov.in)
[![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini%201.5%20Flash-4285F4?style=flat-square)](https://ai.google.dev)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready%20%7C%20IndexedDB-brightgreen?style=flat-square)](./docs/pwa.md)

---

## 🌟 What's New in Phase 2

1. **🤖 Saarthi: AI Mentor & 24/7 Doubt Solver (RAG)**
   - Answers STEM questions strictly grounded in NCERT CBSE textbooks with exact chapter and page citations.
   - **Persistent Context Memory:** Remembers historical weak areas, goals, and explanations across sessions via `memory_facts`.
   - **Photo Doubt OCR:** Snap or upload a photo of a textbook question; Gemini Vision transcribes formulas into editable text for instant step-by-step resolution.
2. **🌀 9 Virtual Learning 3D Simulations (All 4 Subjects)**
   - **Physics:** Light & Optics (spherical mirrors & lenses ray tracer), Waves & Sound (harmonic superposition & Web Audio API tone generator), Newton's Laws of Motion ($F=ma$ & momentum recoil).
   - **Chemistry:** 3D Molecular Viewer & VSEPR geometry (Methane, Water, Ammonia, Benzene, $CO_2$).
   - **Biology:** Human Heart & Double Circulation, Breathing & Alveolar Gas Exchange, Human Skeletal Framework & Antagonistic Muscle Flexion.
   - **Mathematics:** Conic Sections (3D cone slicing: circle, ellipse, parabola, hyperbola), Trigonometric Unit Circle (ASTC quadrants & geometric projections).
3. **🥽 3D Virtual Labs (CBSE Practicals)**
   - **Acid-Base Titration Lab:** Burette with stopcock flow rate, phenolphthalein endpoint color transition, live $V$ vs pH curve, and $M_1V_1 = M_2V_2$ molarity calculation.
   - **Compound Microscope Lab:** $10\times, 40\times, 100\times$ objective turret, coarse/fine focus knobs, dynamic optical Gaussian blur, and Onion Peel, Cheek Cell, Amoeba slides.
   - **Simple Pendulum Lab:** Small-angle SHM, variable gravity (Earth, Moon, Jupiter).
4. **✍️ Text-to-Handwriting Canvas Studio & Physical Notes OCR**
   - Renders typed notes into realistic handwritten notebook pages with natural baseline and rotational jitter across 5 Google Fonts (`Caveat`, `Patrick Hand`, `Homemade Apple`, `Kalam`, `Indie Flower`).
   - Export to PNG and multi-page printable PDF.
5. **📝 Upgraded MCQ Diagnostic Engine**
   - 144+ seeded curriculum questions across Class 10 & 12.
   - Mixed subject, chapter, and timed test modes with CBSE negative marking ($-0.25$).
   - Automatic Weak Topics Analysis (< 60% accuracy) synchronized directly to Saarthi's memory facts.
6. **🎥 Video Learning Player & 💬 Community Hub**
   - Chapter video lectures with timestamps, concept checkpoints that pause playback, and timestamped doubts.
   - Discord-style subject study lounges (`#general-chat`, `#physics-lounge`, `#chemistry-lab`, `#biology-hub`, `#maths-den`) with automated `@saarthi` AI bot assistance.
7. **📱 Progressive Web App (PWA) & Offline Capabilities**
   - Web App Manifest, Service Worker caching, and IndexedDB local storage (Dexie.js) allowing offline test taking and note taking with reconnect sync.

---

## 🏗️ Technical Architecture & Stack

- **Frontend:** React 18, Vite, Three.js, Lucide Icons, KaTeX, Canvas Confetti, `react-i18next`.
- **Backend:** Node.js, Express.js, `@supabase/supabase-js`, `@google/generative-ai`.
- **Database & Auth:** Supabase PostgreSQL 15, `pgvector` (768-dim HNSW cosine indexing), Supabase GoTrue Auth, Row Level Security (RLS).
- **Offline Storage:** Service Worker Cache Storage + IndexedDB (`Dexie.js`).

---

## 🚀 Quickstart & Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **Supabase Project**: Free tier at [supabase.com](https://supabase.com)
- **Google Gemini API Key**: Free tier at [aistudio.google.com](https://aistudio.google.com)

### 2. Database Setup (Supabase SQL Editor)
Run the numbered migrations in `backend/sql/` in sequence:
1. `backend/sql/001_init.sql` (Enables `vector`, creates `profiles`, `chunks`, RLS policies)
2. `backend/sql/002_curriculum.sql` (Creates subjects, chapters, lessons, questions)
3. `backend/sql/005_phase2_features.sql` (Creates virtual topics, chat sessions, memories)
4. `backend/sql/006_phase2_expansion.sql` (Creates attempts, notes, community channels)

### 3. Environment Configuration
In `backend/.env`:
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key
GEMINI_API_KEY=your-gemini-api-key
GEMINI_VISION_MODEL=gemini-1.5-flash
```

### 4. Run Development Servers
```bash
# Terminal 1: Backend API Server
cd Stem-Edu/backend
npm install
node server.js

# Terminal 2: Frontend Vite Server
cd Stem-Edu/frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing
Run the automated test suite covering physics formulas, mathematics identities, chemistry titration calculations, and live API endpoints:
```bash
cd Stem-Edu/backend
node test-phase2-complete.js
```

---

## 📚 Documentation Links
- [Phase 2 Tasks Checklist (Task2.md)](./Task2.md)
- [Comprehensive Viva Voce Sheet (25 Q&As)](./docs/viva.md)
- [System Architecture & Data Flows](./docs/architecture.md)
- [5-Minute Evaluator Demo Script](./docs/demo-script.md)
- [PWA & Offline Architecture Guide](./docs/pwa.md)
- [Text-to-Handwriting Engineering Guide](./docs/handwriting.md)
- [Open-Source Licences & Credits](./content/credits.md)

---

## 🌟 Core Features

- **📖 Curriculum-Aligned Lesson Reader**: 4 foundational CBSE Class 10 STEM subjects (Physics, Chemistry, Biology, Mathematics) with rich text, LaTeX/KaTeX scientific formulas, image blocks, and bilingual English & Hindi toggles.
- **⚡ AI Lesson Summarizer**: Powered by the Gemini API (`gemini-1.5-flash`) generating concise bulleted summaries in < 10 seconds, with MongoDB caching returning subsequent calls instantly (~4ms).
- **📝 MCQ Practice & Review Engine**: 10+ questions per chapter with server-side validation; answers are strictly hidden before submission, and itemized step-by-step explanations are provided upon completion.
- **🔬 Interactive SVG Diagrams**: Tappable science diagrams with responsive SVG scaling, element glow on touch, and bilingual explanation drawers:
  - **Biology**: Plant Cell Anatomy (7 interactive organelles)
  - **Chemistry**: Periodic Table Element Groups (5 interactive families)
  - **Physics**: Simple Electric Circuit (6 interactive components)
- **⏱️ 3D Virtual Physics Lab (Three.js)**: Real-time simulation of the Simple Pendulum governed by small-angle Simple Harmonic Motion ($T = 2\pi\sqrt{L/g}$):
  - Interactive sliders for String Length ($0.2\text{ m}$–$2.0\text{ m}$), Bob Mass ($0.05\text{ kg}$–$1.0\text{ kg}$), and Initial Angle ($5^\circ$–$25^\circ$).
  - Preset Gravitational Environments: Earth ($9.80\text{ m/s}^2$), Moon ($1.62\text{ m/s}^2$), and Jupiter ($24.79\text{ m/s}^2$).
  - Live HUD Readout (Period, Cycle Counter, Stopwatch, Instantaneous Deflection Angle).
  - 3-Question Scientific Deduction Quiz with persistent progress scoring.
  - Automatic 2D HTML5 Canvas Fallback for devices without WebGL support.
- **🛡️ Hand-written Admin Panel**: Role-gated (`role: admin`) content manager for Subjects, Chapters, Lessons, MCQs, and Users, featuring **Safe Cascading Deletion** that preserves student progress consistency and recalculates percentages.

---

## 🏗️ Architecture & Folder Structure

```
Stem-Edu/
├── backend/                  # Express.js REST API
│   ├── controllers/          # Hand-written business logic (auth, content, practice, summary, lab, admin)
│   ├── middleware/           # Hand-written requireAuth, requireAdmin, errorHandler
│   ├── models/               # Mongoose Schemas (User, Subject, Chapter, Lesson, Question, Diagram, Lab, Progress, TestResult, LabResult)
│   ├── routes/               # Modular Express routers
│   ├── utils/                # DB connection, JWT helpers, Gemini AI service, Master Seed Scripts
│   └── server.js             # API entrypoint (Port 5000)
│
├── frontend/                 # React 18 SPA (Vite)
│   ├── src/
│   │   ├── components/       # Layout, ProtectedRoute, InteractiveDiagram, PendulumSimulation
│   │   ├── context/          # AuthContext (JWT management & profile state)
│   │   ├── pages/            # Student pages (Landing, Dashboard, Subjects, Chapter, LessonReader, Practice, Results, VirtualLab, Profile)
│   │   │   └── admin/        # Admin pages (AdminDashboard, AdminContent, AdminQuestions, AdminUsers)
│   │   ├── services/         # Single-file API fetch client (services/api.js)
│   │   └── index.css         # PRD Section 6 Design Tokens & Mobile-first CSS
│   └── vite.config.js        # Reverse proxy (/api -> http://localhost:5000)
│
├── Design.md                 # Master Architecture Blueprint (17 Pages, 9 Schemas, Full REST API Specs)
├── PRD.md                    # Product Requirements Document
├── Tasks.md                  # Sequential Phase 0 - 11 Implementation Checklist
└── README.md                 # Setup, Verification & Guided Demo Guide
```

---

## 🚀 Quickstart & Installation

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/stem-edu`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.

### 2. Clone the Repository
```bash
git clone https://github.com/kushalkumar-creator/Stem-Edu.git
cd Stem-Edu/Stem-Edu
```

### 3. Backend Setup
1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in `backend/.env` with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/stem-edu
   JWT_SECRET=super_secret_jwt_key_stem_edu_2026
   GEMINI_API_KEY=your_gemini_api_key_here  # Optional: graceful offline fallback activates if omitted
   ```
3. Run the **Master Seed Script** to populate all demo content idempotently:
   ```bash
   npm run seed
   ```
4. Start the backend API server:
   ```bash
   npm run dev
   # Server runs at http://localhost:5000
   ```

### 4. Frontend Setup
1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd ../frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   # Open browser at http://localhost:5173
   ```

---

## 🔑 Pre-Seeded Demo Accounts

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Student** | `student@stem.edu` | `Password123!` | Read lessons, AI summaries, take MCQs, interactive labs & diagrams |
| **Admin** | `admin@stem.edu` | `Password123!` | Full CRUD for subjects, chapters, lessons, questions, and user management |

---

## 🧪 Automated Verification Test Suites

Every phase of the project has been rigorously verified against zero-console-error and PRD standards. You can run any test suite directly from the `backend/` directory:

```bash
cd backend

# Validate all 11 PRD Section 8 MVP Acceptance Criteria
node test-prd-criteria.js

# Test Three.js 3D Virtual Physics Lab (SHM physics, HUD, & fallback)
node test-phase9.js

# Test Hand-written Admin Panel (CRUD, 403 barriers, & safe deletion)
node test-phase10.js

# Test AI Lesson Summarizer with Gemini & MongoDB caching
node test-phase7.js

# Test Interactive SVG Diagrams (Bio, Chem, Phy)
node test-phase8.js
```

---

## 📱 Guided Walkthrough / Demo Script

1. **Sign Up & Personalization**:
   - Open `http://localhost:5173/signup`.
   - Sign up a new student account, select **Board: CBSE**, **Class: 10**, and **Language: English or हिंदी**.
   - You will land directly on the mobile-optimized student Dashboard.
2. **Read a STEM Lesson with AI Summary**:
   - Go to **Subjects** $\rightarrow$ **Physics** $\rightarrow$ **Chapter 12: Electricity**.
   - Open **Lesson 1: Electric Current and Simple Circuits**.
   - Scroll through the mathematical formula blocks ($I = Q/t$) and interactive circuit schematic.
   - Click the **"Summarise with AI"** button at the bottom: a bottom-sheet modal returns an AI-generated summary in seconds, and subsequent requests return instantly from MongoDB cache.
3. **Explore Interactive Diagrams**:
   - On the same lesson, view the embedded **Interactive Simple Electric Circuit**.
   - Tap on the **Battery**, **Ammeter**, or **Rheostat**: the component glows, and a bottom drawer reveals its physical function in English and Hindi.
4. **Conduct a 3D Virtual Physics Lab**:
   - Navigate to `/labs/simple_pendulum` (or click the featured Virtual Lab card on the Dashboard).
   - Watch the metallic pendulum bob oscillate smoothly in 3D WebGL at 60 FPS.
   - Drag the **String Length ($L$)** slider to observe how $T = 2\pi\sqrt{L/g}$ changes period.
   - Switch Gravity to **Moon ($1.62\text{ m/s}^2$)** to observe low-gravity slow-motion swings.
   - Switch to the **Observation Quiz** tab, submit your deductions, and view immediate scored feedback.
5. **Practice Timed MCQs**:
   - Go to **Chapter 12: Electricity** and click **"Take Chapter Practice Test"**.
   - Answer the 10 board-pattern MCQs. Note that correct answers are never exposed to the client prior to submission.
   - Submit the test: view your scored percentage banner, question breakdown, and step-by-step numerical explanations.
6. **Admin Content Management**:
   - Log in as `admin@stem.edu` (`Password123!`).
   - A red **"Admin"** pill appears in the top header; click it to enter the **Admin Control Center** (`/admin`).
   - Navigate to **Content Manager** $\rightarrow$ Click **"Add New Chapter"** $\rightarrow$ Fill out the form.
   - Switch to student view: the newly created chapter is immediately visible in the student curriculum!
   - Test **Safe Deletion**: Deleting content with student progress triggers a confirmation modal that safely prunes references and updates completion percentages without database corruption.

---

## 🌐 Production Deployment

- **Backend (Render / Railway / Fly.io)**:
  - Root directory: `backend`
  - Build command: `npm install`
  - Start command: `node server.js`
  - Environment variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`.
- **Frontend (Vercel / Netlify / Cloudflare Pages)**:
  - Root directory: `frontend`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `VITE_API_URL=https://<your-backend-domain>/api`

---

## 📜 Academic Reference & Syllabus Baseline

- Central Board of Secondary Education (CBSE) Class 10 Science & Mathematics Syllabus (NCERT Guidelines).
- Physical laws implemented:
  - Ohm's Law: $V = I \times R$
  - Joule's Law of Heating: $H = I^2 \times R \times t$
  - Simple Harmonic Motion: $T = 2\pi\sqrt{\frac{L}{g}}$
  - Fundamental Theorem of Arithmetic: Unique prime factor decomposition.
