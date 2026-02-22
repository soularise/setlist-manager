create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  bio text,
  avatar_url text,
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "own profile read" on profiles
  for select using (auth.uid() = id);

create policy "own profile write" on profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
