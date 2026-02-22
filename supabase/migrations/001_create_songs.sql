create table songs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  artist text,
  bpm integer,
  duration_seconds integer,
  created_at timestamptz default now()
);

alter table songs enable row level security;

create policy "own songs" on songs
  using (auth.uid() = user_id);

create policy "own songs insert" on songs
  for insert with check (auth.uid() = user_id);

create policy "own songs update" on songs
  for update using (auth.uid() = user_id);

create policy "own songs delete" on songs
  for delete using (auth.uid() = user_id);
