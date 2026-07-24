-- LUNA — Tranche 6 : état des rappels (conseils traités / reportés)
-- À coller dans l'éditeur SQL de Supabase (SQL Editor > New query > Run).
--
-- Les rappels sont GÉNÉRÉS chaque jour côté app (à partir du cycle, de la lune
-- et des schémas). Cette table mémorise seulement ceux que tu as marqués
-- « Noté » ou « Plus tard », pour ne plus les réafficher ce jour-là.

create table if not exists public.rappels_etat (
  id      uuid primary key default gen_random_uuid(),
  cle     text not null, -- identifiant du rappel (stable pour une date)
  date    date not null,
  etat    text not null check (etat in ('note', 'plus_tard')),
  cree_le timestamptz not null default now(),
  unique (cle, date)
);

create index if not exists idx_rappels_etat_date on public.rappels_etat (date);

alter table public.rappels_etat enable row level security;
drop policy if exists "acces_anon_temporaire" on public.rappels_etat;
create policy "acces_anon_temporaire" on public.rappels_etat
  for all to anon using (true) with check (true);
