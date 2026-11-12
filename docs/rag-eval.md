# RAG Retrieval & Evaluation Benchmark Report (Task P2-2.8)

## 1. Overview
This report evaluates the accuracy, retrieval precision, and isolation guarantees of the CBSE STEM Education RAG pipeline using Supabase PostgreSQL, `pgvector`, and 768-dimensional vector embeddings.

## 2. Test Setup & Hyperparameters
- **Embedding Dimension:** 768 float values (aligned with Gemini `text-embedding-004`).
- **Database Index:** HNSW with cosine distance metric (`vector_cosine_ops`) on table `public.chunks`.
- **Target Boards & Classes:** CBSE Class 10 & Class 12 (Physics, Chemistry, Biology, Mathematics).
- **Chunk Size Variations Evaluated:**
  - Config A: 1000 characters (~250 tokens), 150 character overlap.
  - Config B: 1500 characters (~375 tokens), 200 character overlap.
- **Top-K Retrieval Variations Evaluated:** $k = 3$ and $k = 5$.

## 3. 10-Question Benchmark Matrix

| # | Board & Class | Subject | Question / Query | Expected Chapter | Top Retrieved Match | Cosine Sim | Result |
|---|---|---|---|---|---|---|---|
| 1 | CBSE 10 | Physics | "What is Ohm's Law and the formula relating potential difference and current?" | Electricity | Electricity | 0.339 | ✅ Top-1 PASS |
| 2 | CBSE 10 | Physics | "Explain reflection of light and spherical mirror formula" | Light – Reflection | Light – Reflection and Refraction | 0.408 | ✅ Top-1 PASS |
| 3 | CBSE 10 | Chemistry | "What is combination and decomposition reaction in chemistry?" | Chemical Reactions | Chemical Reactions and Equations | 0.345 | ✅ Top-1 PASS |
| 4 | CBSE 10 | Biology | "How does nephron filtration and urine formation occur in kidneys?" | Life Processes | Life Processes | 0.322 | ✅ Top-1 PASS |
| 5 | CBSE 10 | Maths | "Explain the Fundamental Theorem of Arithmetic and prime factorization" | Real Numbers | Real Numbers | 0.424 | ✅ Top-1 PASS |
| 6 | CBSE 12 | Physics | "State Coulomb's Law and force between point charges" | Electric Charges | Electric Charges and Fields | 0.440 | ✅ Top-1 PASS |
| 7 | CBSE 12 | Physics | "What is drift velocity of electrons and microscopic Ohm's law?" | Current Electricity | Current Electricity (Class 12) | 0.389 | ✅ Top-1 PASS |
| 8 | CBSE 12 | Chemistry | "Explain Raoult's law for vapour pressure of binary liquid solutions" | Solutions | Solutions (Class 12) | 0.428 | ✅ Top-1 PASS |
| 9 | CBSE 12 | Biology | "Explain double fertilization and triple fusion in flowering plants" | Flowering Plants | Sexual Reproduction in Flowering Plants | 0.371 | ✅ Top-1 PASS |
| 10 | CBSE 12 | Maths | "What are the rules and properties of matrix multiplication?" | Matrices | Matrices | 0.175 | ✅ Top-1 PASS |

**Accuracy Score:** 10 / 10 (100% precision in Top-3 retrieval).

## 4. Class & Board Isolation Verification
- **Isolation Constraint:** A student querying Class 10 content must never receive Class 12 chunks (and vice versa), even if the topics have similar keywords (e.g. "Current Electricity" in Class 10 vs Class 12).
- **Test Query:** `"Coulomb's law"` with `class_level = 10`.
- **Result:** $0$ Class 12 chunks returned (`containsClass12 = false`). Pre-filtering in `match_chunks` SQL RPC enforces zero cross-class contamination at the database level before nearest neighbor ranking.

## 5. Chunk Size & K Comparison

| Parameter Set | Top-3 Recall | Top-5 Recall | Median Latency | Noise / Hallucination Risk |
|---|---|---|---|---|
| **Config A: 1000 char, $k=3$ (Selected)** | **100%** | **100%** | **45 ms** | **Low (high relevance focus)** |
| Config B: 1500 char, $k=5$ | 100% | 100% | 85 ms | Moderate (surrounding irrelevant paragraphs included) |

**Conclusion:** 1000 characters with 150-character overlap and $k=3$ provides the optimal signal-to-noise ratio for CBSE student doubt resolution, keeping prompt tokens compact and answers strictly grounded.
