alter table public.profiles
add column terms_accepted_at timestamp with time zone default timezone('utc'::text, now());
