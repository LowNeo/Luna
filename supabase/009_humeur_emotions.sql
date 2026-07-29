-- LUNA — Tranche 10 : humeur détaillée (groupes + nuances d'émotions)
-- À coller dans l'éditeur SQL de Supabase (SQL Editor > New query > Run).

-- On retire l'ancienne contrainte sur `humeur` (valeurs figées) et on ajoute
-- deux colonnes : jusqu'à 2 groupes d'émotions et jusqu'à 5 nuances.
alter table public.moments_jour drop constraint if exists moments_jour_humeur_check;

alter table public.moments_jour
  add column if not exists humeur_groupes jsonb not null default '[]'::jsonb;
alter table public.moments_jour
  add column if not exists humeur_nuances jsonb not null default '[]'::jsonb;
