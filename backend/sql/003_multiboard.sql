-- ============================================================================
-- 003_multiboard.sql: Multi-board and Multi-language Upgrades (Task P2-1.1)
-- Adds board, class_level, and language columns and composite indexes
-- ============================================================================

-- 1. Chapters table upgrades
alter table public.chapters add column if not exists language text not null default 'en';
alter table public.chapters add column if not exists subject_code text;
alter table public.chapters drop constraint if exists chapters_subject_id_chapter_number_key;
alter table public.chapters drop constraint if exists chapters_subject_class_num_key;
alter table public.chapters add constraint chapters_subject_class_num_key unique (subject_id, class_level, chapter_number);

-- 2. Lessons table upgrades
alter table public.lessons add column if not exists board text not null default 'CBSE';
alter table public.lessons add column if not exists class_level int not null default 10;
alter table public.lessons add column if not exists language text not null default 'en';
alter table public.lessons add column if not exists subject_code text;

-- 3. Questions table upgrades
alter table public.questions add column if not exists board text not null default 'CBSE';
alter table public.questions add column if not exists class_level int not null default 10;
alter table public.questions add column if not exists language text not null default 'en';
alter table public.questions add column if not exists subject_code text;

-- 4. Tag Phase 1 seed data with board = 'CBSE' and language = 'en'
update public.chapters set board = 'CBSE', language = 'en' where board is null or language is null;
update public.lessons set board = 'CBSE', language = 'en' where board is null or language is null;
update public.questions set board = 'CBSE', language = 'en' where board is null or language is null;

-- 5. Composite Postgres indexes for fast multi-board, multi-language filtering
create index if not exists chapters_multiboard_idx on public.chapters (board, class_level, language);
create index if not exists lessons_multiboard_idx on public.lessons (board, class_level, language);
create index if not exists questions_multiboard_idx on public.questions (board, class_level, language);
