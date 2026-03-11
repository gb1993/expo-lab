-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Function to handle new user sign up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable realtime for profiles table
begin;
  -- remove the supabase_realtime publication if it exists
  drop publication if exists supabase_realtime;
  
  -- Create the realtime publication
  create publication supabase_realtime;

  -- Add table to publication
  alter publication supabase_realtime add table profiles;
commit;
