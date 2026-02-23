-- Allow break rows (no song attached)
alter table setlist_songs alter column song_id drop not null;

-- Label shown on the break divider (e.g. "15 min intermission", "Set 2")
alter table setlist_songs add column if not exists break_label text;
