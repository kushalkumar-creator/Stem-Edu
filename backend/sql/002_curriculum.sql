-- ============================================================================
-- 002_curriculum.sql: STEM Curriculum, Content, Quizzes, Diagrams, Labs, Progress
-- Matches Phase 1 Data Models and PRD requirements 100%
-- ============================================================================

-- 1. Subjects table
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_hindi text,
  code text not null unique,
  description text,
  description_hindi text,
  icon text,
  color text,
  class_level int not null default 10 check (class_level in (10, 12)),
  board text not null default 'CBSE',
  order_num int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Chapters table
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  chapter_number int not null,
  title text not null,
  title_hindi text,
  description text,
  description_hindi text,
  class_level int not null default 10 check (class_level in (10, 12)),
  board text not null default 'CBSE',
  order_num int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subject_id, chapter_number)
);

create index if not exists chapters_subject_idx on public.chapters(subject_id);
create index if not exists chapters_filter_idx on public.chapters(board, class_level);

-- 3. Diagrams table (Created before lessons so lessons can reference diagrams)
create table if not exists public.diagrams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_hindi text,
  subject_code text not null,
  svg_viewbox text not null default '0 0 600 400',
  elements jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Lessons table
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  lesson_number int not null,
  title text not null,
  title_hindi text,
  summary text,
  summary_hindi text,
  content_blocks jsonb not null default '[]'::jsonb,
  diagram_id uuid references public.diagrams(id) on delete set null,
  order_num int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (chapter_id, lesson_number)
);

create index if not exists lessons_chapter_idx on public.lessons(chapter_id);

-- 5. Questions (MCQs) table
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  question_text text not null,
  question_text_hindi text,
  options jsonb not null default '[]'::jsonb, -- array of strings ["Option A", "Option B", ...]
  options_hindi jsonb not null default '[]'::jsonb,
  correct_option_index int not null,
  explanation text not null,
  explanation_hindi text,
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  marks int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists questions_chapter_idx on public.questions(chapter_id);

-- 6. Labs table (Interactive 3D Virtual Physics Labs)
create table if not exists public.labs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_hindi text,
  experiment_type text not null unique,
  description text,
  description_hindi text,
  instructions jsonb not null default '[]'::jsonb,
  instructions_hindi jsonb not null default '[]'::jsonb,
  variables jsonb not null default '[]'::jsonb,
  quiz jsonb not null default '[]'::jsonb,
  subject_id uuid references public.subjects(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. Progress table (Student chapter/lesson completion tracking)
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  completed_lessons jsonb not null default '[]'::jsonb,
  total_lessons_count int not null default 0,
  completion_percentage int not null default 0,
  last_accessed_lesson_id uuid references public.lessons(id) on delete set null,
  last_accessed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(user_id, chapter_id)
);

create index if not exists progress_user_idx on public.progress(user_id);
create index if not exists progress_chapter_idx on public.progress(chapter_id);

-- 8. Test Results table (MCQ Quiz scores)
create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  total_questions int not null,
  score int not null,
  percentage float not null,
  answers jsonb not null default '[]'::jsonb,
  time_taken_seconds int default 0,
  created_at timestamptz not null default now()
);

create index if not exists test_results_user_idx on public.test_results(user_id);
create index if not exists test_results_chapter_idx on public.test_results(chapter_id);

-- 9. Lab Results table (Virtual Lab completion & quiz scores)
create table if not exists public.lab_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lab_id uuid not null references public.labs(id) on delete cascade,
  score int not null,
  total_questions int not null,
  percentage float not null,
  passed boolean not null default false,
  answers jsonb not null default '[]'::jsonb,
  simulation_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists lab_results_user_idx on public.lab_results(user_id);
create index if not exists lab_results_lab_idx on public.lab_results(lab_id);

-- ============================================================================
-- Row Level Security (RLS) Configuration
-- ============================================================================

-- Enable RLS on all tables
alter table public.subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.lessons enable row level security;
alter table public.questions enable row level security;
alter table public.diagrams enable row level security;
alter table public.labs enable row level security;
alter table public.progress enable row level security;
alter table public.test_results enable row level security;
alter table public.lab_results enable row level security;

-- Public Curriculum Read Policies (accessible to all authenticated and anonymous clients)
drop policy if exists "public read subjects" on public.subjects;
create policy "public read subjects" on public.subjects for select using (true);

drop policy if exists "public read chapters" on public.chapters;
create policy "public read chapters" on public.chapters for select using (true);

drop policy if exists "public read lessons" on public.lessons;
create policy "public read lessons" on public.lessons for select using (true);

drop policy if exists "public read questions" on public.questions;
create policy "public read questions" on public.questions for select using (true);

drop policy if exists "public read diagrams" on public.diagrams;
create policy "public read diagrams" on public.diagrams for select using (true);

drop policy if exists "public read labs" on public.labs;
create policy "public read labs" on public.labs for select using (true);

-- Personal Progress Policies (scoped strictly to auth.uid())
drop policy if exists "read own progress" on public.progress;
create policy "read own progress" on public.progress for select using (auth.uid() = user_id);

drop policy if exists "insert own progress" on public.progress;
create policy "insert own progress" on public.progress for insert with check (auth.uid() = user_id);

drop policy if exists "update own progress" on public.progress;
create policy "update own progress" on public.progress for update using (auth.uid() = user_id);

drop policy if exists "delete own progress" on public.progress;
create policy "delete own progress" on public.progress for delete using (auth.uid() = user_id);

-- Personal Test Results Policies
drop policy if exists "read own test results" on public.test_results;
create policy "read own test results" on public.test_results for select using (auth.uid() = user_id);

drop policy if exists "insert own test results" on public.test_results;
create policy "insert own test results" on public.test_results for insert with check (auth.uid() = user_id);

drop policy if exists "delete own test results" on public.test_results;
create policy "delete own test results" on public.test_results for delete using (auth.uid() = user_id);

-- Personal Lab Results Policies
drop policy if exists "read own lab results" on public.lab_results;
create policy "read own lab results" on public.lab_results for select using (auth.uid() = user_id);

drop policy if exists "insert own lab results" on public.lab_results;
create policy "insert own lab results" on public.lab_results for insert with check (auth.uid() = user_id);

drop policy if exists "delete own lab results" on public.lab_results;
create policy "delete own lab results" on public.lab_results for delete using (auth.uid() = user_id);
