create or replace function check_email_exists(email_to_check text)
returns boolean
language plpgsql
security definer
as $$
declare
  user_exists boolean;
begin
  select exists(
    select 1
    from auth.users
    where email = email_to_check
  ) into user_exists;
  
  return user_exists;
end;
$$;
