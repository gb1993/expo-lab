-- Insert existing users from auth into profiles to ensure they can login and be managed
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;
