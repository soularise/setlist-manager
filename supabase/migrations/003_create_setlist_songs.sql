create table setlist_songs (
  id uuid primary key default gen_random_uuid(),
  setlist_id uuid references setlists(id) on delete cascade not null,
  song_id uuid references songs(id) on delete cascade not null,
  position integer not null,
  notes text,
  unique(setlist_id, position)
);

alter table setlist_songs enable row level security;

-- Access is granted if the parent setlist belongs to the current user
create policy "own setlist_songs" on setlist_songs
  using (
    exists (
      select 1 from setlists
      where id = setlist_songs.setlist_id
      and user_id = auth.uid()
    )
  );

create policy "own setlist_songs insert" on setlist_songs
  for insert with check (
    exists (
      select 1 from setlists
      where id = setlist_songs.setlist_id
      and user_id = auth.uid()
    )
  );

create policy "own setlist_songs update" on setlist_songs
  for update using (
    exists (
      select 1 from setlists
      where id = setlist_songs.setlist_id
      and user_id = auth.uid()
    )
  );

create policy "own setlist_songs delete" on setlist_songs
  for delete using (
    exists (
      select 1 from setlists
      where id = setlist_songs.setlist_id
      and user_id = auth.uid()
    )
  );
