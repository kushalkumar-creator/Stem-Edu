# 🎬 5-Minute Evaluation Demo Script (Phase 2)

Use this step-by-step walkthrough script during presentations, viva examinations, and live user demonstrations.

---

### Timing Breakdown

| Time | Feature / Flow | Key Points to Emphasize |
|---|---|---|
| **0:00 - 0:45** | **Login & Personalized CBSE Dashboard** | Supabase Auth, Class 10/12 switcher, bilingual English/Hindi toggle, bottom nav. |
| **0:45 - 1:45** | **Virtual Learning (3D Simulations)** | Ray optics tracer, VSEPR molecules, unit circle trigonometry, heart circulation. |
| **1:45 - 2:45** | **3D Virtual Labs (CBSE Practicals)** | Acid-base titration with live pH curve & endpoint color shift; compound microscope. |
| **2:45 - 3:45** | **Saarthi AI Mentor & Doubt Solver** | Step-by-step NCERT RAG citations, long-term memory modal, photo question upload. |
| **3:45 - 4:30** | **Handwriting Studio & Diagnostic Engine** | Text-to-handwriting canvas with organic jitter; CBSE negative marking & weak topics. |
| **4:30 - 5:00** | **PWA Offline Mode & Security** | Toggle Chrome DevTools Offline mode, offline test taking, Row Level Security verification. |

---

### Step-by-Step Walkthrough

#### Step 1: Login & Bilingual CBSE Settings (0:00 - 0:45)
1. Open `http://localhost:5173/login`.
2. Sign in with student account credentials.
3. Show the Top Navbar:
   - Switch language to **Hindi (हिन्दी)** $\rightarrow$ Notice all UI buttons, headings, and tab titles instantly adapt via `react-i18next`.
   - Toggle back to **English**.
   - Note the Class indicator: **CBSE Class 10 / 12**.

#### Step 2: Virtual Learning Section (0:45 - 1:45)
1. In the navigation bar, click **Simulations** (`/virtual-learning`).
2. Show the 4 subject tabs (**Physics, Chemistry, Biology, Mathematics**) with all 9 published simulations:
   - Click **Light & Optics**: Drag the object slider past $2F$ $\rightarrow$ Observe real-time ray convergence, inverted image formation, and live magnification calculation ($m = -v/u$).
   - Click **Trigonometric Unit Circle**: Drag the angle slider around all 4 quadrants $\rightarrow$ Point out how ASTC rules highlight signs of $\sin$, $\cos$, and $\tan$ and verify $\sin^2\theta + \cos^2\theta = 1$.
   - Click **Human Heart**: Control BPM slider $\rightarrow$ Trace oxygenated vs deoxygenated double circulation pathways.

#### Step 3: 3D Virtual Labs (1:45 - 2:45)
1. Navigate to **Labs** (`/labs`).
2. Select **Acid-Base Titration Lab (HCl vs NaOH)**:
   - Show the interactive burette and stopcock flow slider.
   - Dispense $0.1\text{ M NaOH}$ into the conical flask dropwise.
   - At $25.0\text{ mL}$, observe the sudden indicator transition from colorless to pale pink.
   - Point out the live titration curve ($V$ vs $\text{pH}$) and quantitative molarity calculation ($M_1V_1 = M_2V_2$).
3. Select **Compound Microscope Lab**:
   - Switch specimen slide to *Onion Peel*.
   - Rotate objective turret from $10\times$ to $40\times$.
   - Turn the coarse and fine focus knobs $\rightarrow$ Watch the dynamic optical blur sharpen into high-resolution cellular structures with distinct cell walls and nuclei.

#### Step 4: Saarthi AI Mentor (2:45 - 3:45)
1. Navigate to **Saarthi** (`/mentor`).
2. Click **Memory** $\rightarrow$ Show the list of persistent academic memories (e.g. *"Struggles with Ray Optics"*).
3. Type a doubt: *"Explain Ohm's Law and its mathematical formula"*.
4. Show the response:
   - Point out Markdown formatting and KaTeX rendering ($V = IR$).
   - Point out the official CBSE NCERT textbook source citation card at the bottom.
5. Tap the **Camera Icon** $\rightarrow$ Upload a photo of a textbook question:
   - Show the Gemini Vision OCR card extracting the question into editable text.
   - Click **Ask Saarthi This Question** $\rightarrow$ Show the step-by-step pedagogical solution.

#### Step 5: Handwriting Studio & Diagnostic Engine (3:45 - 4:30)
1. Navigate to **Notes** (`/notes`).
2. Click **Handwriting Studio**:
   - Type or paste a paragraph of textbook notes.
   - Switch paper style to **Ruled Notebook** or **Parchment**.
   - Change font to **Caveat** and ink to **Royal Blue**.
   - Point out organic baseline and rotational jitter on the HTML Canvas.
   - Click **Export PNG** or **Save to My Notes**.
3. Open **Practice** $\rightarrow$ Launch a Mixed Subject Test:
   - Point out the timer, CBSE negative marking alert ($-0.25$ marks for wrong answers), and instant *"Explain with Saarthi"* doubt button.
   - Open Results $\rightarrow$ Show the **Weak Topics Analysis** tab.

#### Step 6: PWA Offline Capabilities & Data Privacy (4:30 - 5:00)
1. Open Chrome DevTools $\rightarrow$ Network tab $\rightarrow$ Set to **Offline**.
2. Refresh the page $\rightarrow$ Show that the App Shell and cached chapter questions load immediately.
3. Open `/privacy` $\rightarrow$ Show the student privacy policy and Row Level Security guarantees.
4. Conclude the demonstration.

