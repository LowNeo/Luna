-- LUNA — Tranche 11 : contraintes d'unicité PAR UTILISATEUR
-- À coller dans l'éditeur SQL de Supabase (SQL Editor > New query > Run).
--
-- POURQUOI : les contraintes d'unicité historiques (`unique (date, moment)`,
-- `date unique`, etc.) datent des migrations 001–003, écrites AVANT l'auth
-- (migration 006). Elles supposent un seul utilisateur. Depuis l'auth + RLS,
-- l'app est multi-comptes : deux comptes (p. ex. le compte démo et le tien) qui
-- partagent une même date entraient en collision. On remplace ces uniques
-- globaux par des uniques incluant `user_id`.
--
-- ⚠️ IMPORTANT — ORDRE DE DÉPLOIEMENT : cette migration doit aller de pair avec
--    la mise à jour des hooks (`onConflict: 'user_id,...'`). Applique-la au
--    moment où tu déploies le code correspondant (voir README_DEMO.md).
--
-- Sûr : le nouvel unique (avec user_id) est plus PERMISSIF que l'ancien, donc
-- aucune donnée existante ne peut le violer. Idempotent (drop if exists + add).

alter table public.moments_jour  drop constraint if exists moments_jour_date_moment_key;
alter table public.moments_jour  drop constraint if exists moments_jour_user_date_moment_key;
alter table public.moments_jour  add  constraint moments_jour_user_date_moment_key
  unique (user_id, date, moment);

alter table public.regles         drop constraint if exists regles_date_debut_key;
alter table public.regles         drop constraint if exists regles_user_date_debut_key;
alter table public.regles         add  constraint regles_user_date_debut_key
  unique (user_id, date_debut);

alter table public.suivi_jour     drop constraint if exists suivi_jour_date_key;
alter table public.suivi_jour     drop constraint if exists suivi_jour_user_date_key;
alter table public.suivi_jour     add  constraint suivi_jour_user_date_key
  unique (user_id, date);

alter table public.mesures_corps  drop constraint if exists mesures_corps_date_key;
alter table public.mesures_corps  drop constraint if exists mesures_corps_user_date_key;
alter table public.mesures_corps  add  constraint mesures_corps_user_date_key
  unique (user_id, date);

alter table public.nuits          drop constraint if exists nuits_date_key;
alter table public.nuits          drop constraint if exists nuits_user_date_key;
alter table public.nuits          add  constraint nuits_user_date_key
  unique (user_id, date);

alter table public.rappels_etat   drop constraint if exists rappels_etat_cle_date_key;
alter table public.rappels_etat   drop constraint if exists rappels_etat_user_cle_date_key;
alter table public.rappels_etat   add  constraint rappels_etat_user_cle_date_key
  unique (user_id, cle, date);
