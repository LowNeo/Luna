-- LUNA — Tranche 3 : suivi du corps (poids & mensurations)
-- À coller dans l'éditeur SQL de Supabase (SQL Editor > New query > Run).

-- Une mesure = un relevé daté. Tous les champs sont optionnels : on peut
-- consigner seulement le poids un jour, seulement des mensurations un autre.
create table if not exists public.mesures_corps (
  id             uuid primary key default gen_random_uuid(),
  date           date not null unique,
  poids          numeric(5, 1),  -- kg
  tour_taille    numeric(5, 1),  -- cm
  tour_hanches   numeric(5, 1),
  tour_poitrine  numeric(5, 1),
  tour_cuisse    numeric(5, 1),
  tour_bras      numeric(5, 1),
  cree_le        timestamptz not null default now()
);

create index if not exists idx_mesures_corps_date on public.mesures_corps (date);

alter table public.mesures_corps enable row level security;
drop policy if exists "acces_anon_temporaire" on public.mesures_corps;
create policy "acces_anon_temporaire" on public.mesures_corps
  for all to anon using (true) with check (true);
