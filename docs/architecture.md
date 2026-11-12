# 🏛️ System Architecture & Data Flow (Phase 2)

This document provides a comprehensive technical overview of the STEM Education Platform's architecture, including the RAG pipeline, Saarthi memory loop, Supabase PostgreSQL data schemas, and PWA offline synchronization.

---

## 1. High-Level Architecture Overview

```mermaid
graph TD
    Client["Client Browser / Mobile PWA (React + Vite)"]
    ServiceWorker["Service Worker (sw.js & Cache Storage)"]
    IndexedDB["Client IndexedDB (Dexie: offline questions, notes, syncQueue)"]
    
    ExpressAPI["Backend API Server (Express.js on Node.js)"]
    SupabaseAuth["Supabase Authentication (JWT, GoTrue)"]
    SupabaseDB["Supabase PostgreSQL 15 + pgvector"]
    GeminiAI["Google Gemini 1.5 Flash (LLM & Vision)"]
    GeminiEmbed["Google text-embedding-004 (768-dim)"]

    Client -->|App Shell & Cached Assets| ServiceWorker
    Client -->|Local Questions & Notes| IndexedDB
    Client -->|REST & Bearer Token| ExpressAPI
    Client -->|Auth Signup/Login| SupabaseAuth

    ExpressAPI -->|Verify Tokens & RLS Policies| SupabaseAuth
    ExpressAPI -->|Relational Queries & Vector Similarity| SupabaseDB
    ExpressAPI -->|Embeddings Generation| GeminiEmbed
    ExpressAPI -->|Prompt Completion & Vision OCR| GeminiAI

    ServiceWorker -->|Background Sync on Reconnect| ExpressAPI
```

---

## 2. CBSE RAG (Retrieval-Augmented Generation) Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as React Frontend
    participant Server as Express Backend
    participant Embed as Gemini Embeddings API
    participant PG as Supabase pgvector (chunks)
    participant LLM as Gemini 1.5 Flash

    Student->>UI: Types doubt: "Explain how concave mirrors form real images"
    UI->>Server: POST /api/mentor/chat { message, subject: "physics", classLevel: 10 }
    Server->>Embed: Embed query text -> 768-dim vector
    Embed-->>Server: vector [e0, e1, ..., e767]
    Server->>PG: RPC match_chunks(query_embedding, board='CBSE', class=10, k=5)
    PG-->>Server: Top matching NCERT textbook chunks + citations
    Server->>PG: Select student's long-term memory facts (weak topics)
    PG-->>Server: Memory facts list
    Server->>LLM: System Prompt + Profile + Memories + Context Chunks + Question
    LLM-->>Server: Structured response with step-by-step logic & formulas
    Server->>PG: Asynchronously extract & save new memory facts (if any)
    Server-->>UI: { reply, sources: [{ chapter: "Light", page: 168 }] }
    UI-->>Student: Renders Markdown, KaTeX math & clickable source citations
```

---

## 3. Database Schema Entity-Relationship Diagram

```mermaid
erDiagram
    PROFILES ||--o{ CHAT_SESSIONS : owns
    PROFILES ||--o{ CHAT_MESSAGES : sends
    PROFILES ||--o{ MEMORY_FACTS : has
    PROFILES ||--o{ NOTES : creates
    PROFILES ||--o{ ATTEMPTS : records
    PROFILES ||--o{ LAB_ATTEMPTS : submits
    PROFILES ||--o{ TOPIC_PROGRESS : tracks

    SUBJECTS ||--o{ CHAPTERS : contains
    CHAPTERS ||--o{ LESSONS : contains
    CHAPTERS ||--o{ QUESTIONS : contains
    CHAPTERS ||--o{ VIDEOS : features

    VIRTUAL_TOPICS ||--o{ TOPIC_PROGRESS : logs
    LABS ||--o{ LAB_ATTEMPTS : records

    PROFILES {
        uuid id PK
        text full_name
        text role
        text board
        int class_level
        text preferred_language
        boolean saarthi_memory_enabled
    }

    CHUNKS {
        uuid id PK
        uuid user_id FK
        text content
        vector embedding_768
        text board
        int class_level
        text subject
        text chapter
    }

    MEMORY_FACTS {
        uuid id PK
        uuid user_id FK
        text type
        text text
        text subject
        int importance
    }

    NOTES {
        uuid id PK
        uuid user_id FK
        text title
        text content
        text subject
        jsonb handwriting_config
        text handwriting_image_url
    }

    ATTEMPTS {
        uuid id PK
        uuid user_id FK
        uuid question_id FK
        boolean is_correct
        int time_taken_seconds
    }
```

---

## 4. PWA Offline-First & Sync Architecture

1. **Pre-caching:**
   - App shell (Vite bundles, CSS, Google Fonts, SVG diagram definitions) is precached during Service Worker install.
2. **Offline Data Storage:**
   - Dexie.js (IndexedDB) maintains stores for `questions`, `lessons`, `notes`, and `syncQueue`.
   - Students can download any chapter for 100% offline access.
3. **Offline Diagnostic Engine:**
   - The same scoring algorithm executes client-side during offline MCQ tests, evaluating correct answers and negative marking (-0.25).
4. **Idempotent Background Sync:**
   - When network connectivity is restored (`window.addEventListener('online')`), the Service Worker triggers `syncQueue` processing, replaying test attempts and newly authored notes to Supabase via upsert idempotency keys.
