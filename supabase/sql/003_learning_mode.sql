alter table public.profiles
  add column if not exists learning_mode text;

update public.profiles
set learning_mode = 'guided'
where learning_mode is null;

alter table public.profiles
  alter column learning_mode set default 'guided';

alter table public.profiles
  alter column learning_mode set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_learning_mode_check'
  ) then
    alter table public.profiles
      add constraint profiles_learning_mode_check
      check (learning_mode in ('guided', 'free'));
  end if;
end $$;
