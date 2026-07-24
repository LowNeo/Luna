-- LUNA — Tranche 7 : authentification & RLS par utilisateur
-- À coller dans l'éditeur SQL de Supabase (SQL Editor > New query > Run).
--
-- Ce script :
--   1. ajoute une colonne user_id (remplie automatiquement par auth.uid())
--   2. remplace la policy « anon » ouverte par une policy « chaque personne ne
--      voit et n'écrit que SES données »
--   3. supprime les lignes de test créées AVANT l'auth (user_id NULL) — elles
--      seraient invisibles et bloqueraient les upserts. ⚠️ pertes de données de test.
--
-- Après ce script, il faut être CONNECTÉ pour lire/écrire.

-- Fonction utilitaire appliquée à chaque table
do $$
declare
  t text;
  tables text[] := array[
    'moments_jour', 'regles', 'suivi_jour',
    'mesures_corps', 'entrees_journal', 'rappels_etat'
  ];
begin
  foreach t in array tables loop
    -- 1. colonne user_id (par défaut = utilisateur connecté)
    execute format(
      'alter table public.%I add column if not exists user_id uuid
         default auth.uid() references auth.users(id) on delete cascade',
      t
    );
    -- 3. purge des lignes de test antérieures à l'auth
    execute format('delete from public.%I where user_id is null', t);
    -- 2. policies : on remplace l''accès anon par un accès propriétaire
    execute format('drop policy if exists "acces_anon_temporaire" on public.%I', t);
    execute format('drop policy if exists "proprietaire" on public.%I', t);
    execute format(
      'create policy "proprietaire" on public.%I
         for all to authenticated
         using (user_id = auth.uid())
         with check (user_id = auth.uid())',
      t
    );
    -- index pour les requêtes filtrées par utilisateur
    execute format(
      'create index if not exists idx_%I_user on public.%I (user_id)', t, t
    );
  end loop;
end $$;
