-- ============================================================================
-- 006_phase2_expansion.sql: Attempts, Notes, Community, and Question Expansion
-- ============================================================================

-- 1. Extend questions table with topic and status (P2-5.1, P2-5.2)
alter table public.questions add column if not exists topic text default 'General';
alter table public.questions add column if not exists status text default 'approved' check (status in ('pending', 'approved', 'rejected'));

-- 2. Create attempts table for fine-grained per-question attempt analytics (P2-5.4)
create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid references public.questions(id) on delete set null,
  chapter_id uuid references public.chapters(id) on delete set null,
  topic text default 'General',
  selected_option_index int,
  correct boolean not null default false,
  time_taken int default 0,
  created_at timestamptz not null default now()
);

create index if not exists attempts_user_topic_idx on public.attempts(user_id, topic);
create index if not exists attempts_user_chapter_idx on public.attempts(user_id, chapter_id);

-- 3. Create notes table for student notes and handwritten generator (P2-6.1)
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  subject text default 'General',
  chapter_id uuid references public.chapters(id) on delete set null,
  tags text[] default '{}',
  handwriting_config jsonb default '{}'::jsonb,
  handwriting_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_user_idx on public.notes(user_id);

-- 4. Create community channels and messages for peer study hub (P2-11)
create table if not exists public.community_channels (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  subject text not null,
  description text,
  is_default boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  channel_slug text not null references public.community_channels(slug) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null default 'Student',
  avatar_url text,
  content text not null,
  is_bot boolean default false,
  created_at timestamptz not null default now()
);

create index if not exists community_messages_channel_idx on public.community_messages(channel_slug, created_at);

-- ============================================================================
-- Row Level Security (RLS) Configuration
-- ============================================================================

alter table public.attempts enable row level security;
alter table public.notes enable row level security;
alter table public.community_channels enable row level security;
alter table public.community_messages enable row level security;

-- Policies for attempts
drop policy if exists "own attempts select" on public.attempts;
create policy "own attempts select" on public.attempts for select using (auth.uid() = user_id);

drop policy if exists "own attempts insert" on public.attempts;
create policy "own attempts insert" on public.attempts for insert with check (auth.uid() = user_id);

-- Policies for notes
drop policy if exists "own notes select" on public.notes;
create policy "own notes select" on public.notes for select using (auth.uid() = user_id);

drop policy if exists "own notes insert" on public.notes;
create policy "own notes insert" on public.notes for insert with check (auth.uid() = user_id);

drop policy if exists "own notes update" on public.notes;
create policy "own notes update" on public.notes for update using (auth.uid() = user_id);

drop policy if exists "own notes delete" on public.notes;
create policy "own notes delete" on public.notes for delete using (auth.uid() = user_id);

-- Policies for community channels
drop policy if exists "community channels select" on public.community_channels;
create policy "community channels select" on public.community_channels for select using (true);

-- Policies for community messages
drop policy if exists "community messages select" on public.community_messages;
create policy "community messages select" on public.community_messages for select using (true);

drop policy if exists "community messages insert" on public.community_messages;
create policy "community messages insert" on public.community_messages for insert with check (auth.uid() = user_id);

-- Seed default community study channels
insert into public.community_channels (slug, name, subject, description, is_default)
values
  ('general-chat', 'General Discussion', 'All', 'General study discussion, announcements, and peer queries', true),
  ('physics-lounge', 'Physics Doubts & Concepts', 'Physics', 'Mechanics, Electromagnetism, Optics, and CBSE Class 10/12 discussions', true),
  ('chemistry-lab', 'Chemistry Reactions & Formulas', 'Chemistry', 'Organic, Inorganic, Physical chemistry problem-solving', true),
  ('biology-hub', 'Biology Life Sciences', 'Biology', 'Diagrams, genetics, human physiology, and botanical concepts', true),
  ('maths-den', 'Mathematics Problem Solvers', 'Mathematics', 'Calculus, Vectors, Matrices, and CBSE sample papers', true)
on conflict (slug) do nothing;

