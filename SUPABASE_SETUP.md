# SUPABASE_SETUP.md: Switch from MongoDB to Supabase (database + login auth)

Applies to: Phase 2 `Tasks.md` (STEM platform, CBSE Class 10 and 12).
Supabase gives you three things in one project: **Postgres database**, **Auth (login)** and **pgvector** (vector search for RAG). It replaces MongoDB Atlas, Atlas Vector Search and your own JWT login code.

---

## 1. What changes

| Before (MongoDB) | After (Supabase) |
|---|---|
| MongoDB Atlas + Mongoose models | Supabase Postgres tables (SQL) |
| Atlas Vector Search index | `pgvector` extension + `match_chunks` SQL function |
| Own JWT login (`JWT_SECRET`, bcrypt, `User` model) | Supabase Auth (email/password, optional Google) |
| `userId` filter in code | `user_id` column + Row Level Security (RLS) |
| Migration script + compound indexes | SQL migration file + Postgres indexes |
| `MONGODB_URI`, `JWT_SECRET` | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |

Naming note: Postgres tables use `snake_case`, and `class` is renamed `class_level` to avoid keyword trouble.

---

## 2. Keys you need

| # | What | Needed for | Where |
|---|---|---|---|
| 1 | **Supabase Project URL** | Everything | Supabase Dashboard → Project Settings → API |
| 2 | **Anon / publishable key** | Frontend login (safe to be public) | Same page |
| 3 | **service_role / secret key** | Backend only. Bypasses RLS. **Never put it in frontend code** | Same page |
| 4 | **Gemini API key** | RAG, Saarthi, summary, MCQ, OCR | aistudio.google.com |
| 5 | Cloudinary (cloud name, key, secret) | Videos (P2-10) | cloudinary.com |
| 6 | Discord webhook URL and invite link | Community (P2-11) | Discord server settings |
| 7 | Optional: Discord bot token, Sentry DSN, Android keystore | Later | |

Supabase has recently renamed keys to "publishable" and "secret" in some dashboards. The old names (`anon`, `service_role`) still work the same way. Use whichever your dashboard shows.

No longer needed: `MONGODB_URI`, `JWT_SECRET`, MongoDB Atlas account.

---

## 3. Create the Supabase project (step by step)

1. Go to supabase.com, sign in, click **New project**.
2. Pick a name, set a strong **database password** (save it), choose the region closest to you (for India, Mumbai if available), click **Create**.
3. Wait for the project to finish setting up.
4. Open **Project Settings → API** and copy: Project URL, anon/publishable key, service_role/secret key.
5. Open **Authentication → Providers**: make sure **Email** is enabled.
6. For development, open **Authentication → Sign In / Providers (Email)** and turn off "Confirm email" so you can test fast. Turn it back on before going live.
7. Open **Authentication → URL Configuration**:
   - Site URL: `http://localhost:5173`
   - Add redirect URLs: `http://localhost:5173/**` and your deployed frontend URL (add after deployment).
8. Optional Google login: **Authentication → Providers → Google**, then paste a Google OAuth client ID and secret from Google Cloud Console.

Free-tier note: check the current limits on Supabase pricing (database size, auth users, and pausing of inactive projects). Write them in `Design.md` (P2-0.4).

---

## 4. Run the SQL (database tables)

Open **Supabase Dashboard → SQL Editor → New query**, paste this whole block, click **Run**.
Also save it in your project as `backend/sql/001_init.sql` so it is version controlled.

```sql
-- 1. Extensions
create extension if not exists vector;

-- 2. Profiles (one row per login user; replaces the old User model)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('student','admin','mentor')),
  board text not null default 'CBSE',
  class_level int check (class_level in (10, 12)),
  preferred_language text not null default 'en',
  saarthi_memory_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. Auto-create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. RAG chunks (CBSE shared chunks have user_id = null; student notes have user_id set)
-- Vector size 768: set the same value when you call the Gemini embedding model.
create table public.chunks (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  content_hash text not null unique,
  embedding vector(768),
  embedding_model text,
  board text not null default 'CBSE',
  class_level int,
  subject text,
  chapter text,
  page int,
  language text not null default 'en',
  source text,
  type text not null default 'textbook' check (type in ('textbook','notes','question','video')),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index chunks_filter_idx on public.chunks (board, class_level, subject, language);
create index chunks_user_idx on public.chunks (user_id);
create index chunks_embedding_idx on public.chunks using hnsw (embedding vector_cosine_ops);

-- 5. Retrieval function (call it from the backend with the service key)
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

-- 6. Row Level Security
alter table public.profiles enable row level security;
alter table public.chunks enable row level security;

create policy "own profile read" on public.profiles
  for select using (auth.uid() = id);
create policy "own profile update" on public.profiles
  for update using (auth.uid() = id);

create policy "read shared or own chunks" on public.chunks
  for select using (user_id is null or user_id = auth.uid());
create policy "insert own chunks" on public.chunks
  for insert with check (user_id = auth.uid());
create policy "delete own chunks" on public.chunks
  for delete using (user_id = auth.uid());
```

Other tables (`chapters`, `lessons`, `mcqs`, `videos`, `labs`, `virtual_topics`, `chat_sessions`, `chat_messages`, `memory_facts`, `summaries`, `attempts`, `translation_strings`) follow the same pattern. For every table that holds personal data:
- add a `user_id uuid references auth.users(id) on delete cascade` column,
- run `alter table ... enable row level security;`,
- add a policy `using (user_id = auth.uid())`.

Ask Antigravity to generate these, one table per task, as new files `backend/sql/002_*.sql`, and run each in the SQL Editor.

---

## 5. Install packages (Windows Command Prompt)

Backend:
```
cd backend
npm uninstall mongoose bcryptjs jsonwebtoken
npm install @supabase/supabase-js
```

Frontend:
```
cd frontend
npm install @supabase/supabase-js
```

If your Phase 1 code still imports `mongoose`, `bcryptjs` or `jsonwebtoken` somewhere, the agent must remove those imports.

---

## 6. Environment files

**`backend/.env`**
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=paste_anon_or_publishable_key
SUPABASE_SERVICE_ROLE_KEY=paste_service_role_or_secret_key

GEMINI_API_KEY=paste_key
GEMINI_CHAT_MODEL=check_current_name_in_docs
GEMINI_EMBEDDING_MODEL=check_current_name_in_docs
GEMINI_EMBEDDING_DIM=768

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

DISCORD_WEBHOOK_URL=
DISCORD_INVITE_URL=

# optional / later
DISCORD_BOT_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=
SENTRY_DSN=
```

**`backend/.env.example`**: same file with every value empty. Safe to commit.

**`frontend/.env`** (public values only; never put the service key here)
```
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=paste_anon_or_publishable_key
VITE_DISCORD_INVITE_URL=
VITE_DISCORD_SERVER_ID=
```

Protect secrets (run from project root in Command Prompt):
```
echo backend\.env>> .gitignore
echo frontend\.env>> .gitignore
echo content/>> .gitignore
git rm --cached backend/.env
```
The last command may show an error if `.env` was never committed. That is fine. If the service role key ever reaches GitHub, reset it in the Supabase dashboard immediately.

On your host (Vercel / Render), add the same variables in **Environment Variables**. `.env` files are not deployed.

---

## 7. Code to paste

These assume ES modules (`"type": "module"` in `package.json`). If your backend uses `require`, ask the agent to convert the syntax.

**`frontend/src/lib/supabaseClient.js`**
```js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

**Frontend login usage (examples)**
```js
// Sign up
await supabase.auth.signUp({
  email, password,
  options: { data: { full_name } }
});

// Log in
await supabase.auth.signInWithPassword({ email, password });

// Log out
await supabase.auth.signOut();

// Get the access token to send to your backend
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
// fetch(`${import.meta.env.VITE_API_URL}/api/mentor/sessions`, {
//   headers: { Authorization: `Bearer ${token}` }
// });
```

**`backend/src/lib/supabaseAdmin.js`**
```js
import { createClient } from '@supabase/supabase-js';

// Service role: backend only. Bypasses RLS, so always filter by the verified user id.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
```

**`backend/src/middleware/requireAuth.js`**
```js
import { supabaseAdmin } from '../lib/supabaseAdmin.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: 'Invalid token' });

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  req.user = data.user;      // auth user (id, email)
  req.profile = profile;     // board, class_level, preferred_language, role
  next();
}

export function requireAdmin(req, res, next) {
  if (req.profile?.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  next();
}
```

**Using it in a route (example)**
```js
import { requireAuth } from '../middleware/requireAuth.js';

router.get('/sessions', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('chat_sessions')
    .select('*')
    .eq('user_id', req.user.id)   // always filter by the verified user
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
```

**Calling retrieval from Node (P2-2.5)**
```js
const { data, error } = await supabaseAdmin.rpc('match_chunks', {
  query_embedding: embedding,          // array of 768 numbers
  match_count: 5,
  min_similarity: 0.6,
  p_board: req.profile.board,
  p_class: req.profile.class_level,
  p_subject: subject ?? null,
  p_language: req.profile.preferred_language,
  p_user_id: req.user.id
});
```

Make your first admin: sign up normally, then in the SQL Editor run
```sql
update public.profiles set role = 'admin' where id = 'PASTE_YOUR_USER_UUID';
```
(Find your UUID in **Authentication → Users**.)

---

## 8. Edits to `Tasks.md` (replace these items)

| Task ID | Old | New |
|---|---|---|
| P2-0.2 | Vector storage: MongoDB Atlas Vector Search | **Database + Auth: Supabase. Vector storage: pgvector (in Supabase)** |
| P2-0.3 | New models (`Chunk`, `Document`, ...) | New **tables** with the same names in `snake_case`; `/api/*` routes stay the same |
| P2-0.4 | Gemini key only in backend `.env` | Also: `SUPABASE_SERVICE_ROLE_KEY` only in backend `.env`. Check the Supabase free-tier limits and note them in `Design.md` |
| P2-0.5 | Folder additions | Add `backend/sql/` for migration files |
| P2-1.1 | Add fields to models; migration script; compound indexes | Add columns to tables; write a **SQL migration** (`backend/sql/00x_*.sql`) that tags old data `board = 'CBSE'`, `language = 'en'`; add Postgres indexes on `(board, class_level, subject, language)` |
| P2-1.3 | Profile stores board, class, language | `profiles` table columns `board`, `class_level`, `preferred_language` (already in the SQL above) |
| P2-2.4 | Choose vector store (default Atlas); create vector index | **pgvector** in Supabase; HNSW index created in `001_init.sql`; keep 3 reasons and one alternative (Chroma, Qdrant) in `Design.md`; embedding dimension must match `vector(768)` |
| P2-2.5 | `retrieve()` runs vector search | `retrieve()` calls the `match_chunks` SQL function via `supabaseAdmin.rpc(...)` |
| P2-2.7 | `userId` in metadata; privacy test | `user_id` column + RLS policies; test that user A can never get user B's chunks (through the API and through RLS with an anon-key client) |
| P2-3.2 | `ChatSession`, `ChatMessage`, `MemoryFact` models | Tables `chat_sessions`, `chat_messages`, `memory_facts`, each with `user_id` and RLS |
| P2-3.3 | Auth required on all routes | Use the `requireAuth` middleware above |
| P2-15.1 | User data isolation tests | Add: RLS enabled on every user table; service role key not in the frontend bundle |
| P2-15.2 | "Delete my data" removes chats, memories, notes, chunks, vectors | `on delete cascade` handles most of it; the button deletes the auth user (`supabaseAdmin.auth.admin.deleteUser(id)`) |
| P2-15.6 | Check Atlas Vector Search index on production | Run the SQL files on the production Supabase project (or use the same project); check auth redirect URLs include the deployed domain |
| Appendix B | Atlas storage limits | Supabase free-tier limits (database size, bandwidth, project pausing when inactive) |

Also update Phase 1 references: login, register, profile and admin-check code must move to Supabase Auth and the `profiles` table (see "Phase 1 migration" below).

---

## 9. Phase 1 migration (important)

- Existing MongoDB users **cannot keep their passwords** (the hashes cannot be imported easily). For a college or demo project, simply ask users to register again.
- Seed data (chapters, lessons, MCQs) must be exported from MongoDB (JSON) and imported into the new tables. Ask the agent to write a one-time script `backend/scripts/migrateFromMongo.js` (run once, then delete it, along with the old `MONGODB_URI`).
- Do this **before** starting Section 1 of Phase 2, on a new git branch, and tag it `v1.1-supabase`.

---

## 10. Security checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` exists only in `backend/.env` and host environment variables
- [ ] Frontend `.env` has only the URL and the anon key
- [ ] RLS is enabled on every table with user data
- [ ] Every backend query with the service key filters by `req.user.id`
- [ ] Email confirmation is turned back on before going live
- [ ] Redirect URLs in Supabase include the deployed frontend URL

---

## 11. Prompt to paste into Antigravity

```
We are replacing MongoDB with Supabase (Postgres + Auth + pgvector). Read SUPABASE_SETUP.md first.
Rules:
- Read all secrets from process.env (backend) or import.meta.env (frontend). Variable names are in backend/.env.example. Never print or hardcode key values.
- The service role key is used only in backend code. Never import it in the frontend.
- Remove mongoose, bcryptjs and jsonwebtoken; replace login/register/profile with Supabase Auth and the profiles table.
- Replace every Mongoose model with a Supabase table, using SQL files in backend/sql/.
- Task 1: do the Phase 1 migration described in section 9, then tell me what to run in the Supabase SQL Editor.
After that I will give you Phase 2 task IDs one at a time (for example P2-1.1).
```