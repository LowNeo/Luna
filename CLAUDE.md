# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Contexte projet
Projet : LUNA — client : Laurence (app mono-utilisateur).
Journal de suivi personnel permettant de retracer des habitudes et de faire émerger des schémas récurrents, pour mieux appréhender les moments de « down » (humeur, cycle menstruel ↔ lunaire, libido, sommeil, corps). Les maquettes viennent de Claude Design (screenshots reproduits en code).

# Commandes
- `npm run dev` — serveur de dev Vite (port 5173)
- `npm run build` — `tsc -b && vite build` (le build échoue si le typage échoue)
- `npx tsc -b` — vérification de types seule (à lancer après chaque changement)
- `npm run lint` — ESLint
- `npm run preview` — sert le build de prod
- **Pas de tests** dans ce repo (aucun framework de test installé).

# Stack
React 19 + TypeScript (strict) + Vite · Supabase (PostgreSQL + Auth + RLS) · React Router DOM · CSS maison (pas de librairie UI).

# Base de données (contrainte forte)
Le front n'a QUE la clé Supabase **anon** (`.env.local`, `VITE_SUPABASE_*`). On ne peut donc pas créer de tables par le code : **toute évolution de schéma est un fichier `supabase/00X_*.sql`** (create + `enable row level security` + policy) que l'utilisateur colle manuellement dans le SQL Editor Supabase. Les migrations sont idempotentes (`if not exists`, `drop … if exists`, `add column if not exists`).

**Auth & RLS** : `App.tsx` monte `useSession` et affiche `Connexion` tant qu'il n'y a pas de session. Chaque table porte `user_id uuid default auth.uid()` + une policy `"proprietaire"` (`using/with check (user_id = auth.uid())`). Les `insert`/`upsert` ne renseignent PAS `user_id` (le défaut de colonne le remplit) — ne pas l'ajouter côté client.

# Architecture (le « big picture »)
Flux de données en couches :
`table Supabase` → `un hook par entité` (`src/hooks/use*.ts`, gère loading/error/empty + CRUD) → `page`/`composant`. Les **types** des lignes sont dans `src/types`, la **logique pure sans React** dans `src/lib`.

Points structurants (nécessitent de lire plusieurs fichiers) :

- **Moteur d'analyse (le cœur de LUNA)** — `src/lib/schemas.ts` transforme les lignes brutes en `JourAnalyse[]` via `construitJoursAnalyse` (source unique partagée par `useSchemas` ET `useRappels`). `construitSchemas` en déduit des corrélations (humeur×lune, confort×cycle, énergie×cycle, poids×cycle) avec une « force » heuristique. `src/lib/rappels.ts` génère les conseils à partir de la prévision du cycle + lune + schémas. **Ces écrans LISENT les tables existantes — ils ne créent pas de données.**

- **Calculé, jamais stocké** — la phase de lune (`src/lib/lune.ts`) et la phase/prévision de cycle (`src/lib/cycle.ts`, à partir des débuts de règles de la table `regles`) sont recalculées côté client à partir des dates.

- **Journal typé** — `entrees_journal` a une colonne `type` (slug) + `donnees` (jsonb) pour des champs variables selon le type. Les types intégrés sont définis en code (`src/types/journalTypes.ts`, avec des natures de champ dont un `chrono`) ; les types personnalisés sont en base (`journal_types`). La timeline (`useJournalJour`) fusionne ces entrées avec les repas dérivés de `moments_jour` — pas de double saisie.

- **Humeur = émotions** — `src/types/emotions.ts` : 8 groupes (couleur, `valence`, nuances). Un moment stocke `humeur_groupes`/`humeur_nuances` (jsonb, ≤2 / ≤5). La `valence` alimente le score d'humeur des schémas ; la couleur du groupe dominant colore le ruban de l'écran Lune.

# Écrans (routes)
Jour `/` · Journal `/journal` · Lune `/lune` (corolle SVG) · Corps `/corps` (sous « profil », bouton barre haute) · Schémas `/schemas` · Rappels `/rappels`. Nav basse : Jour · Journal · [+] · Lune · Schémas.

# Conventions
- Commenter et nommer en **français**.
- Un hook par entité Supabase ; toujours gérer loading / error / empty.
- `verbatimModuleSyntax` actif → `import type` pour les imports de types uniquement.
- Toutes les pages sont importées statiquement dans `App.tsx` : **chaque `import '../styles/xxx.css'` est donc chargé globalement**. Des classes définies dans le CSS d'un écran (`.btn`, `.card`, `.champ-heure`, `.form-mesure`…) sont réutilisées partout. Les tokens (variables CSS, thème sombre) sont dans `src/index.css`.

# Vérification (piège)
L'app est derrière l'auth : le navigateur de preview n'a pas de session, donc on ne peut souvent vérifier que l'écran `Connexion` + une compilation propre. S'appuyer sur `npx tsc -b` et sur l'absence d'erreurs serveur Vite. Les erreurs console « [vite] Failed to reload » pendant l'écriture de plusieurs fichiers sont transitoires (import d'un fichier pas encore créé).

# Branches & déploiement
Travail sur `develop` ; **`main` = branche de production Netlify** (config `netlify.toml` : build Vite → `dist`, fallback SPA). Publier = merge fast-forward `develop` → `main` (Netlify redéploie). Les variables `VITE_SUPABASE_*` doivent être définies dans Netlify (injectées au **build**). Comme dev et prod partagent le même projet Supabase, une migration passée une fois vaut pour les deux.
