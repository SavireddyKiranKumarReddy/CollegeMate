-- v15 knowledge layer: structured facts derived from uploads + version history.
-- Run this in the Supabase SQL editor (one time). Code degrades gracefully if absent.

create table if not exists public.knowledge_facts (
  id uuid primary key default uuid_generate_v4(),
  college_id uuid not null references public.colleges(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  question text not null,
  answer text not null,
  topic text,
  source_document_id uuid references public.documents(id) on delete set null,
  source_label text,
  status text not null default 'pending' check (status in ('pending','verified','stale','off')),
  valid_from date,
  valid_to date,
  version int not null default 1,
  created_by text,
  updated_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_facts_college on public.knowledge_facts(college_id);
create index if not exists idx_facts_dept on public.knowledge_facts(department_id);
create index if not exists idx_facts_status on public.knowledge_facts(college_id, status);

create table if not exists public.knowledge_versions (
  id uuid primary key default uuid_generate_v4(),
  fact_id uuid not null references public.knowledge_facts(id) on delete cascade,
  question text not null,
  answer text not null,
  version int not null,
  changed_by text,
  created_at timestamptz default now()
);
create index if not exists idx_versions_fact on public.knowledge_versions(fact_id);

alter table public.knowledge_facts enable row level security;
alter table public.knowledge_versions enable row level security;

drop policy if exists "allow all MVP" on public.knowledge_facts;
create policy "allow all MVP" on public.knowledge_facts for all using (true) with check (true);
drop policy if exists "allow all MVP" on public.knowledge_versions;
create policy "allow all MVP" on public.knowledge_versions for all using (true) with check (true);
