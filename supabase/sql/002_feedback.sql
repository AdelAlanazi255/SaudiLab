create extension if not exists pgcrypto;

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid null references auth.users(id) on delete set null,
  email text null,
  category text not null,
  message text not null,
  page_url text null
);

alter table public.feedback enable row level security;

drop policy if exists "feedback_insert_all" on public.feedback;
drop policy if exists "feedback_insert_authenticated" on public.feedback;
create policy "feedback_insert_authenticated"
on public.feedback
for insert
to authenticated
with check (auth.uid() is not null);

drop policy if exists "feedback_select_admins" on public.feedback;
create policy "feedback_select_admins"
on public.feedback
for select
to authenticated
using (public.is_admin());
