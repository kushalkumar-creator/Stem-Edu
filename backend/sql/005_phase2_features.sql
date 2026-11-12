-- ============================================================================
-- 005_phase2_features.sql: Virtual Learning & Upgraded Summaries (P2-4 & P2-8)
-- ============================================================================

-- 1. Virtual Topics Table (P2-8.0.2)
create table if not exists public.virtual_topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  subject text not null,
  class_level int not null default 10,
  board text not null default 'CBSE',
  title text not null,
  title_hindi text,
  description text not null,
  description_hindi text,
  type text not null default '3d' check (type in ('3d', 'graph', 'molecule')),
  config jsonb not null default '{}'::jsonb,
  thumbnail text,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists virtual_topics_filter_idx on public.virtual_topics(subject, class_level, board);

-- 2. Topic Progress Table (P2-8.0.2)
create table if not exists public.topic_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id uuid not null references public.virtual_topics(id) on delete cascade,
  completed boolean not null default false,
  score int default 0,
  completed_at timestamptz default now(),
  unique (user_id, topic_id)
);

create index if not exists topic_progress_user_idx on public.topic_progress(user_id);

-- 3. Summaries & Flashcards Table (P2-4.4)
create table if not exists public.summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null check (source in ('lesson', 'chapter', 'notes', 'custom')),
  source_id text,
  title text not null,
  options jsonb not null default '{}'::jsonb,
  text text not null,
  flashcards jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists summaries_user_idx on public.summaries(user_id);

-- ============================================================================
-- Row Level Security (RLS) Configuration
-- ============================================================================

alter table public.virtual_topics enable row level security;
alter table public.topic_progress enable row level security;
alter table public.summaries enable row level security;

-- Virtual topics: Publicly readable for students
drop policy if exists "public virtual topics select" on public.virtual_topics;
create policy "public virtual topics select" on public.virtual_topics for select using (true);

drop policy if exists "admin virtual topics all" on public.virtual_topics;
create policy "admin virtual topics all" on public.virtual_topics for all using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

-- Topic progress: Students can only view and update their own progress
drop policy if exists "own topic progress select" on public.topic_progress;
create policy "own topic progress select" on public.topic_progress for select using (auth.uid() = user_id);

drop policy if exists "own topic progress insert" on public.topic_progress;
create policy "own topic progress insert" on public.topic_progress for insert with check (auth.uid() = user_id);

drop policy if exists "own topic progress update" on public.topic_progress;
create policy "own topic progress update" on public.topic_progress for update using (auth.uid() = user_id);

-- Summaries: Students can only view and manage their own summaries
drop policy if exists "own summaries select" on public.summaries;
create policy "own summaries select" on public.summaries for select using (auth.uid() = user_id);

drop policy if exists "own summaries insert" on public.summaries;
create policy "own summaries insert" on public.summaries for insert with check (auth.uid() = user_id);

drop policy if exists "own summaries delete" on public.summaries;
create policy "own summaries delete" on public.summaries for delete using (auth.uid() = user_id);
