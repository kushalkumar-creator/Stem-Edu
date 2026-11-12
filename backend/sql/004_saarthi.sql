-- ============================================================================
-- 004_saarthi.sql: Saarthi AI Mentor & Doubt Solver Tables (Task P2-3.2)
-- Tables: chat_sessions, chat_messages, memory_facts with RLS & vector embeddings
-- ============================================================================

-- 1. Chat Sessions
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New Conversation',
  mode text not null default 'doubt' check (mode in ('doubt', 'mentor')),
  subject text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chat_sessions_user_idx on public.chat_sessions(user_id);

-- 2. Chat Messages
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  sources jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_session_idx on public.chat_messages(session_id);
create index if not exists chat_messages_user_idx on public.chat_messages(user_id);

-- 3. Memory Facts (Persistent student context across sessions)
create table if not exists public.memory_facts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('weakness', 'strength', 'goal', 'preference')),
  text text not null,
  subject text,
  importance int not null default 1,
  embedding vector(768),
  created_at timestamptz not null default now(),
  last_used_at timestamptz not null default now()
);

create index if not exists memory_facts_user_idx on public.memory_facts(user_id);
create index if not exists memory_facts_embedding_idx on public.memory_facts using hnsw (embedding vector_cosine_ops);

-- ============================================================================
-- Row Level Security (RLS) Configuration
-- ============================================================================

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.memory_facts enable row level security;

-- Chat Sessions RLS Policies
drop policy if exists "own chat sessions select" on public.chat_sessions;
create policy "own chat sessions select" on public.chat_sessions for select using (auth.uid() = user_id);

drop policy if exists "own chat sessions insert" on public.chat_sessions;
create policy "own chat sessions insert" on public.chat_sessions for insert with check (auth.uid() = user_id);

drop policy if exists "own chat sessions update" on public.chat_sessions;
create policy "own chat sessions update" on public.chat_sessions for update using (auth.uid() = user_id);

drop policy if exists "own chat sessions delete" on public.chat_sessions;
create policy "own chat sessions delete" on public.chat_sessions for delete using (auth.uid() = user_id);

-- Chat Messages RLS Policies
drop policy if exists "own chat messages select" on public.chat_messages;
create policy "own chat messages select" on public.chat_messages for select using (auth.uid() = user_id);

drop policy if exists "own chat messages insert" on public.chat_messages;
create policy "own chat messages insert" on public.chat_messages for insert with check (auth.uid() = user_id);

drop policy if exists "own chat messages delete" on public.chat_messages;
create policy "own chat messages delete" on public.chat_messages for delete using (auth.uid() = user_id);

-- Memory Facts RLS Policies
drop policy if exists "own memory facts select" on public.memory_facts;
create policy "own memory facts select" on public.memory_facts for select using (auth.uid() = user_id);

drop policy if exists "own memory facts insert" on public.memory_facts;
create policy "own memory facts insert" on public.memory_facts for insert with check (auth.uid() = user_id);

drop policy if exists "own memory facts update" on public.memory_facts;
create policy "own memory facts update" on public.memory_facts for update using (auth.uid() = user_id);

drop policy if exists "own memory facts delete" on public.memory_facts;
create policy "own memory facts delete" on public.memory_facts for delete using (auth.uid() = user_id);

