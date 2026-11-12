# Text-to-Handwriting & Notes Engine Specification (P2-6)

## 1. Overview & Pedagogical Purpose
Students often learn better and retain memory when reviewing handwritten assignments and revision sheets. In addition, teachers and students frequently request handwritten notes for submissions and offline study. 

The **StemEdu Text-to-Handwriting & Notes Engine** provides:
1. **Realistic Handwritten Page Rendering**: Transforms digital CBSE lesson notes, typed answers, or markdown formulas into authentic handwritten notebook pages.
2. **Organic Human Handwriting Simulation**: Incorporates micro-variations (jitter, baseline shifts, character rotation, stroke weight fluctuations).
3. **Paper & Ink Customisation**: Ruled school lines, vertical margin line, graph paper, plain white, and vintage legal pad; black ballpoint, blue gel, red correction ink, and pencil.
4. **Export Capabilities**: Single-page PNG export and multi-page PDF generation.
5. **AI Handwritten OCR**: Vision-based extraction of photographed physical handwritten notes directly into student notes and CBSE RAG retrieval.

---

## 2. Rendering Architecture (HTML5 Canvas)

### Why HTML5 Canvas?
- **Zero Latency & Client-Side Execution**: Runs entirely in the student's browser with no GPU server requirement.
- **Offline Capable**: Works without an internet connection using cached web fonts.
- **Pixel-Accurate Export**: Direct export to high-resolution PNG (`canvas.toDataURL('image/png')`) and vector-wrapped PDF (`jsPDF`).

### Google Fonts with Open Font License (OFL)
We exclusively utilize fonts licensed under the SIL Open Font License:
1. **Caveat** (Semi-cursive, relaxed, widely used for school notes)
2. **Patrick Hand** (Neat school-student print handwriting)
3. **Homemade Apple** (Authentic cursive script)
4. **Kalam** (South Asian / Devanagari handwriting aesthetic)
5. **Indie Flower** (Clean, playful handwritten lettering)

---

## 3. Human Realism Simulation Algorithms

### 3.1 Baseline Fluctuation (Vertical Jitter)
Human handwriting does not stick to a perfectly flat line. For each word $w_i$, a pseudo-random baseline displacement $\delta y \in [-1.5, +1.5]\text{ px}$ is applied:
$$y_{\text{render}} = y_{\text{line}} + \delta y$$

### 3.2 Rotational Slant Jitter
Every character or word has a slight tilt variation $\theta \in [-0.5^\circ, +0.5^\circ]$:
$$\theta = (\text{hash}(i) \pmod{100} - 50) \times 0.01^\circ$$

### 3.3 Dynamic Line Spacing & Notebook Ruling
- Standard ruled paper: Light blue horizontal lines spaced at $28\text{ px}$.
- Vertical margin line: Crimson red line at $x = 65\text{ px}$.
- Page pagination: Automatic page breaks when line cursor exceeds page height minus bottom margin.

---

## 4. OCR for Photographed Notes (P2-6.6)
- **Model**: Gemini 1.5 Flash Vision (`generateContent` with base64 image part).
- **Prompt**: Specifically instructs the vision model to transcribe handwritten English/Hindi STEM notes verbatim, preserving mathematical equations, bullet points, and chemical symbols.
- **Student Review UI**: Transcribed text is displayed in a split-screen editor where students can make corrections before saving.
- **RAG Integration**: Once confirmed, the note is ingested into `public.chunks` with metadata `{ sourceType: 'handwritten_note', userId: student.id }`, allowing Saarthi to retrieve it during doubt solving!
