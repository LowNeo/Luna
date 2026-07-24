-- LUNA — Tranche 2 : cycle menstruel + suivi journalier (libido)
-- À coller dans l'éditeur SQL de Supabase (SQL Editor > New query > Run).

-- Débuts de règles : chaque ligne = un 1er jour de cycle (J1).
-- Sert à calculer le jour de cycle et la phase pour n'importe quelle date.
create table if not exists public.regles (
  id         uuid primary key default gen_random_uuid(),
  date_debut date not null unique,
  cree_le    timestamptz not null default now()
);

alter table public.regles enable row level security;
drop policy if exists "acces_anon_temporaire" on public.regles;
create policy "acces_anon_temporaire" on public.regles
  for all to anon using (true) with check (true);

-- Suivi journalier (métriques à l'échelle de la journée, pas du moment).
-- Pour l'instant : la libido. On y ajoutera le sommeil, le poids, etc.
create table if not exists public.suivi_jour (
  id      uuid primary key default gen_random_uuid(),
  date    date not null unique,
  libido  smallint check (libido between 0 and 5),
  cree_le timestamptz not null default now()
);

alter table public.suivi_jour enable row level security;
drop policy if exists "acces_anon_temporaire" on public.suivi_jour;
create policy "acces_anon_temporaire" on public.suivi_jour
  for all to anon using (true) with check (true);
