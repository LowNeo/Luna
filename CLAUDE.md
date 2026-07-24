# Contexte projet
Projet : LUNA
Client : Laurence
Description : Journal de suivi personnel permettant de retracer des habitudes et de faire émerger des schémas récurrents, pour mieux appréhender les moments de « down » (humeur, cycle menstruel ↔ lunaire, libido, sommeil, corps).

# Stack technique
- React + TypeScript + Vite
- Supabase (PostgreSQL + RLS)
- React Router DOM pour la navigation
- CSS maison (design system dans `src/index.css` + `src/styles/`) — pas de librairie UI
- **Authentification Supabase** (email + mot de passe). Chaque table porte un `user_id` (défaut `auth.uid()`) et une policy RLS « propriétaire » : on ne voit/écrit que ses propres données. `App.tsx` affiche `Connexion` tant qu'il n'y a pas de session.

# Structure des dossiers
src/components  -> composants réutilisables (regroupés par écran)
src/pages       -> écrans complets
src/hooks       -> logique Supabase réutilisable (un hook par entité/écran)
src/lib         -> config + utilitaires purs (supabaseClient, dates, lune, cycle, schemas, rappels)
src/types       -> types TypeScript des entités
src/styles      -> CSS par écran
supabase        -> migrations SQL versionnées (00X_*.sql) à coller dans le SQL Editor

# Écrans (tous branchés sur Supabase)
- **Jour** (`/`) — 3 moments matin/après-midi/soir : humeur, énergie, confort, repas + phase lunaire calculée
- **Journal** (`/journal`) — timeline du jour (réveil, rêve, ressentis) fusionnée avec les repas du jour
- **Lune** (`/lune`) — la corolle : cycle × lune × libido, ruban des humeurs du mois
- **Corps** (`/corps`) — poids (courbe + variation) et mensurations (deltas)
- **Schémas** (`/schemas`) — corrélations détectées (moteur `src/lib/schemas.ts`, lit les tables existantes)
- **Rappels** (`/rappels`) — conseils générés (cycle + lune + schémas)

# Règles de développement
- Toujours gérer les états loading, error et empty
- Typer toutes les données Supabase dans `src/types`
- Un hook par entité Supabase (ex : `useMomentsJour.ts`)
- Commenter en français
- `tsconfig` strict (`verbatimModuleSyntax` → `import type` pour les types) ; vérifier avec `npx tsc -b`
- Nouvelle table = ajouter une migration `supabase/00X_*.sql` (create + `enable row level security` + policy anon) à coller manuellement dans Supabase
