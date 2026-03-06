alter table public.profiles
  add column if not exists learning_mode text;

alter table public.profiles
  alter column learning_mode drop not null;

alter table public.profiles
  alter column learning_mode drop default;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'profiles_learning_mode_check'
  ) then
    alter table public.profiles
      drop constraint profiles_learning_mode_check;
  end if;
end $$;

alter table public.profiles
  add constraint profiles_learning_mode_check
  check (learning_mode is null or learning_mode in ('guided', 'free'));
