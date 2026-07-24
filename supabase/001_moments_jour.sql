-- LUNA — Tranche 1 : table des moments de la journée
-- À coller dans l'éditeur SQL de Supabase (SQL Editor > New query > Run).
--
-- Un « moment » = une saisie pour matin / après-midi / soir d'une date donnée.
-- On y note : humeur, énergie, confort digestif et le repas associé.

create table if not exists public.moments_jour (
  id             uuid primary key default gen_random_uuid(),
  date           date not null,
  moment         text not null check (moment in ('matin', 'apres_midi', 'soir')),
  heure          time,
  humeur         text check (humeur in ('lumineuse', 'douce', 'sensible', 'agitee', 'basse')),
  energie        smallint check (energie between 0 and 5),
  confort_niveau smallint check (confort_niveau between 0 and 5),
  confort_label  text,
  repas_note     text,
  cree_le        timestamptz not null default now(),
  -- Un seul enregistrement par (date, moment)
  unique (date, moment)
);

-- Index pour charger rapidement une journée
create index if not exists idx_moments_jour_date on public.moments_jour (date);

-- RLS : application mono-utilisateur SANS authentification pour l'instant.
-- On active RLS puis on autorise la clé anonyme.
-- ⚠️ À durcir dès que l'authentification sera ajoutée (remplacer par un
--    filtre sur auth.uid() et une colonne user_id).
alter table public.moments_jour enable row level security;

drop policy if exists "acces_anon_temporaire" on public.moments_jour;
create policy "acces_anon_temporaire"
  on public.moments_jour
  for all
  to anon
  using (true)
  with check (true);
