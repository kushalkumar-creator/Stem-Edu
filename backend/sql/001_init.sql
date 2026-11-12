-- ============================================================================
-- 001_init.sql: Base Extensions, Profiles, Vector Store, RAG chunks & RLS
-- Generated per SUPABASE_SETUP.md Section 4
-- ============================================================================

-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Profiles table (replaces MongoDB User model; references Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('student','admin','mentor')),
  board text not null default 'CBSE',
  class_level int check (class_level in (10, 12)) default 10,
  preferred_language text not null default 'en',
  saarthi_memory_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Auto-create a profile row when a user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'student')
  )
  on conflict (id) do update set
    full_name = excluded.full_name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. RAG chunks (Shared CBSE chunks have user_id = null; student notes have user_id set)
-- Vector dimension 768: matches Google Gemini text-embedding-004
create table if not exists public.chunks (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  content_hash text not null unique,
  embedding vector(768),
  embedding_model text,
  board text not null default 'CBSE',
  class_level int default 10,
  subject text,
  chapter text,
  page int,
  language text not null default 'en',
  source text,
  type text not null default 'textbook' check (type in ('textbook','notes','question','video')),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Compound indexes for fast filtered vector retrieval
create index if not exists chunks_filter_idx on public.chunks (board, class_level, subject, language);
create index if not exists chunks_user_idx on public.chunks (user_id);
create index if not exists chunks_embedding_idx on public.chunks using hnsw (embedding vector_cosine_ops);

-- 5. Retrieval SQL function (called via supabaseAdmin.rpc with service role key)
create or replace function public.match_chunks(
  query_embedding vector(768),
  match_count int,
  min_similarity float,
  p_board text,
  p_class int,
  p_subject text default null,
  p_language text default null,
  p_user_id uuid default null
)
returns table (
  id uuid, content text, chapter text, page int,
  source text, type text, similarity float
)
language sql stable
as $$
  select c.id, c.content, c.chapter, c.page, c.source, c.type,
         1 - (c.embedding <=> query_embedding) as similarity
  from public.chunks c
  where c.board = p_board
    and c.class_level = p_class
    and (p_subject is null or c.subject = p_subject)
    and (p_language is null or c.language = p_language)
    and (c.user_id is null or c.user_id = p_user_id)
    and 1 - (c.embedding <=> query_embedding) >= min_similarity
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

revoke execute on function public.match_chunks from public, anon, authenticated;
grant execute on function public.match_chunks to service_role;

-- 6. Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.chunks enable row level security;

-- Profiles policies
drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles
  for update using (auth.uid() = id);

-- Chunks policies
drop policy if exists "read shared or own chunks" on public.chunks;
create policy "read shared or own chunks" on public.chunks
  for select using (user_id is null or user_id = auth.uid());

drop policy if exists "insert own chunks" on public.chunks;
create policy "insert own chunks" on public.chunks
  for insert with check (user_id = auth.uid());

drop policy if exists "delete own chunks" on public.chunks;
create policy "delete own chunks" on public.chunks
  for delete using (user_id = auth.uid());
