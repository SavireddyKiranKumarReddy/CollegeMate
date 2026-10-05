-- CollegeMate schema — multi-tenant: colleges -> departments -> memberships -> documents
-- Run in Supabase SQL editor or via management API.

-- extensions
create extension if not exists "uuid-ossp";

-- profiles (linked to auth.users, role-based)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'faculty' check (role in ('super_admin','college_admin','faculty','student')),
  created_at timestamptz default now()
);

-- colleges
create table if not exists public.colleges (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  domain text,
  city text,
  contact_email text not null,
  notes text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  admin_email text,
  created_at timestamptz default now()
);

-- departments
create table if not exists public.departments (
  id uuid primary key default uuid_generate_v4(),
  college_id uuid not null references public.colleges(id) on delete cascade,
  name text not null,
  code text,
  created_at timestamptz default now(),
  unique(college_id, name)
);

-- memberships: email-based so admin can pre-assign before signup
create table if not exists public.memberships (
  id uuid primary key default uuid_generate_v4(),
  college_id uuid not null references public.colleges(id) on delete cascade,
  user_email text not null,
  role text not null check (role in ('college_admin','faculty')),
  department_id uuid references public.departments(id) on delete set null,
  created_at timestamptz default now(),
  unique(college_id, user_email)
);
create index if not exists idx_memberships_email on public.memberships(user_email);
create index if not exists idx_memberships_college on public.memberships(college_id);

-- documents: metadata; files live in storage bucket college-docs
create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  college_id uuid not null references public.colleges(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  uploaded_by text,
  title text,
  file_name text not null,
  file_path text not null,
  file_type text,
  status text not null default 'ready' check (status in ('processing','ready','failed')),
  created_at timestamptz default now()
);
create index if not exists idx_docs_college on public.documents(college_id);
create index if not exists idx_docs_dept on public.documents(department_id);

-- document_chunks: RAG-ready (vectors live in Qdrant; this is metadata + preview for citations)
create table if not exists public.document_chunks (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid not null references public.documents(id) on delete cascade,
  college_id uuid not null references public.colleges(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  chunk_index int not null default 0,
  content_preview text,
  page_no int,
  token_count int,
  qdrant_point_id text,
  created_at timestamptz default now(),
  unique(document_id, chunk_index)
);
create index if not exists idx_chunks_college on public.document_chunks(college_id);
create index if not exists idx_chunks_doc on public.document_chunks(document_id);

-- query_logs: every chat Q/A with citations + confidence (for eval + low-confidence review)
create table if not exists public.query_logs (
  id uuid primary key default uuid_generate_v4(),
  college_id uuid references public.colleges(id) on delete cascade,
  question text not null,
  answer_preview text,
  citations jsonb,
  confidence text,
  created_at timestamptz default now()
);
create index if not exists idx_queries_college on public.query_logs(college_id);

-- storage bucket (idempotent)
insert into storage.buckets (id, name, public)
values ('college-docs', 'college-docs', false)
on conflict (id) do nothing;

-- RLS: enable, permissive for MVP (service_role bypasses RLS; anon/auth via API routes using service key)
alter table public.profiles enable row level security;
alter table public.colleges enable row level security;
alter table public.departments enable row level security;
alter table public.memberships enable row level security;
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.query_logs enable row level security;

-- drop old policies if re-running
drop policy if exists "public read colleges" on public.colleges;
drop policy if exists "allow all for service + anon MVP" on public.colleges;
drop policy if exists "allow all MVP" on public.colleges;
drop policy if exists "allow all MVP" on public.departments;
drop policy if exists "allow all MVP" on public.memberships;
drop policy if exists "allow all MVP" on public.documents;
drop policy if exists "allow all MVP" on public.profiles;
drop policy if exists "allow all MVP" on public.document_chunks;
drop policy if exists "allow all MVP" on public.query_logs;

-- MVP: allow authenticated + anon read/write via API (tighten later with JWT claims)
create policy "allow all MVP" on public.colleges for all using (true) with check (true);
create policy "allow all MVP" on public.departments for all using (true) with check (true);
create policy "allow all MVP" on public.memberships for all using (true) with check (true);
create policy "allow all MVP" on public.documents for all using (true) with check (true);
create policy "allow all MVP" on public.profiles for all using (true) with check (true);
create policy "allow all MVP" on public.document_chunks for all using (true) with check (true);
create policy "allow all MVP" on public.query_logs for all using (true) with check (true);

-- storage policies for college-docs (authenticated can read/write; tighten later)
drop policy if exists "auth read" on storage.objects;
drop policy if exists "auth write" on storage.objects;
drop policy if exists "auth update" on storage.objects;
drop policy if exists "auth delete" on storage.objects;
create policy "auth read" on storage.objects for select using (bucket_id = 'college-docs');
create policy "auth write" on storage.objects for insert with check (bucket_id = 'college-docs');
create policy "auth update" on storage.objects for update using (bucket_id = 'college-docs');
create policy "auth delete" on storage.objects for delete using (bucket_id = 'college-docs');
