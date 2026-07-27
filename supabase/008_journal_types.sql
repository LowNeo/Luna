-- LUNA — Tranche 9 : Journal typé + types personnalisés
-- À coller dans l'éditeur SQL de Supabase (SQL Editor > New query > Run).

-- 1. entrees_journal : modèle flexible
--    - on retire l'ancienne contrainte sur `type` (les types sont désormais
--      libres : intégrés OU personnalisés)
--    - `donnees` (jsonb) stocke les valeurs propres à chaque type
alter table public.entrees_journal drop constraint if exists entrees_journal_type_check;
alter table public.entrees_journal
  add column if not exists donnees jsonb not null default '{}'::jsonb;

-- 2. Types personnalisés définis par l'utilisateur
--    `champs` = tableau JSON de { cle, label, kind, unite? }
create table if not exists public.journal_types (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  cle     text not null,
  label   text not null,
  champs  jsonb not null default '[]'::jsonb,
  cree_le timestamptz not null default now(),
  unique (user_id, cle)
);

create index if not exists idx_journal_types_user on public.journal_types (user_id);

alter table public.journal_types enable row level security;
drop policy if exists "proprietaire" on public.journal_types;
create policy "proprietaire" on public.journal_types
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
