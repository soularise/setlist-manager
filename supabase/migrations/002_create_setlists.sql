create table setlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  created_at timestamptz default now()
);

alter table setlists enable row level security;

create policy "own setlists" on setlists
  using (auth.uid() = user_id);

create policy "own setlists insert" on setlists
  for insert with check (auth.uid() = user_id);

create policy "own setlists update" on setlists
  for update using (auth.uid() = user_id);

create policy "own setlists delete" on setlists
  for delete using (auth.uid() = user_id);
