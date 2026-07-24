-- LUNA — Tranche 8 : remarque de repas + suivi des nuits
-- À coller dans l'éditeur SQL de Supabase (SQL Editor > New query > Run).

-- 1. Remarque spécifique au repas (distincte de la note « ce que j'ai mangé »)
alter table public.moments_jour add column if not exists repas_remarque text;

-- 2. Suivi des nuits : une nuit par date (= la nuit précédant cette journée)
create table if not exists public.nuits (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid default auth.uid() references auth.users(id) on delete cascade,
  date              date not null unique,
  qualite           smallint check (qualite between 0 and 5),
  reveils_nocturnes smallint check (reveils_nocturnes between 0 and 9),
  heure_coucher     time, -- endormissement
  heure_reveil      time,
  note              text,
  cree_le           timestamptz not null default now()
);

create index if not exists idx_nuits_user on public.nuits (user_id);

alter table public.nuits enable row level security;
drop policy if exists "proprietaire" on public.nuits;
create policy "proprietaire" on public.nuits
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
