# Compte de démonstration LUNA

Jeu de données prêt à présenter à un client : persona **« Camille », 34 ans**,
**90 jours** de suivi (12 mai → 9 août 2026), **3 cycles complets** (~28 j).
Les données sont corrélées au cycle **et** aux phases lunaires réelles, donc les
écrans **Schémas** et **Rappels** affichent de vraies tendances.

Contenu généré (`seed_demo.sql`) :
- **moments_jour** — humeur (émotions + nuances), énergie, confort digestif, repas
- **nuits** — qualité, réveils, heures de coucher/lever (pire en SPM, mieux en folliculaire)
- **suivi_jour** — libido (pic à l'ovulation, creux en SPM)
- **mesures_corps** — poids (rétention d'eau en lutéale) + quelques mensurations
- **regles** — 4 débuts de règles (3 cycles complets)
- **entrees_journal** — rêves, ressentis, activités physiques, grignotages, méditations
- **journal_types** — un type personnalisé « Méditation » (démo de la fonctionnalité)

---

## Identifiants à transmettre au client

| Champ | Valeur |
|-------|--------|
| **URL** | l'app en production (Netlify) ou `npm run dev` |
| **E-mail** | `demo.luna@exemple.fr` |
| **Mot de passe** | `LunaDemo2026!` |

> Tu peux changer l'e-mail/mot de passe : adapte alors la ligne `demo_email` en
> tête de `seed_demo.sql` pour qu'elle corresponde à l'e-mail du compte créé.

---

## Étape 0 — Rendre le schéma multi-comptes (OBLIGATOIRE, à faire une fois)

Les contraintes d'unicité d'origine (`unique (date, moment)`, `date unique`…)
sont **globales** : elles empêchent deux comptes de partager une date et font
échouer le seed (`duplicate key … moments_jour_date_moment_key`). La migration
[`010_uniques_par_user.sql`](010_uniques_par_user.sql) les remplace par des
uniques **par utilisateur**.

Cette migration va de pair avec une mise à jour des hooks (`onConflict:
'user_id,…'`, déjà faite dans le code). **Ordre à respecter** (dev et prod
partagent le même Supabase) :

1. **Coller `010_uniques_par_user.sql`** dans SQL Editor → Run.
2. **Déployer le nouveau code** : commit + merge `develop` → `main` (Netlify
   redéploie). Fais-le juste après la migration ; évite de saisir une entrée
   dans l'app pendant les ~2-3 min de build (l'ancien code ne saurait plus faire
   ses `upsert`).

> Sans cette étape, le seed s'arrête sur l'erreur de clé dupliquée — **sans rien
> supprimer ni insérer** (tout le bloc est annulé).

---

## Étape 1 — Créer le compte démo

### Option A — via le dashboard Supabase (recommandé)

1. Supabase → **Authentication** → **Users** → **Add user** → **Create new user**.
2. **Email** : `demo.luna@exemple.fr` — **Password** : `LunaDemo2026!`.
3. Coche **Auto Confirm User** (sinon la connexion sera bloquée par la vérification e-mail).
4. **Create user**.

### Option B — tout en SQL (si tu préfères)

À coller dans **SQL Editor** *avant* le seed. ⚠️ Dépend de la version de GoTrue ;
si la connexion échoue ensuite, utilise plutôt l'option A.

```sql
-- Nécessite l'extension pgcrypto (souvent déjà active sur Supabase)
insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password,
   email_confirmed_at, created_at, updated_at,
   raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-000000000000', gen_random_uuid(),
   'authenticated', 'authenticated', 'demo.luna@exemple.fr',
   crypt('LunaDemo2026!', gen_salt('bf')),
   now(), now(), now(),
   '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb);

-- Ligne d'identité nécessaire à la connexion par e-mail
insert into auth.identities
  (id, user_id, provider_id, identity_data, provider,
   last_sign_in_at, created_at, updated_at)
select
  gen_random_uuid(), u.id, u.id::text,
  jsonb_build_object('sub', u.id::text, 'email', u.email),
  'email', now(), now(), now()
from auth.users u
where u.email = 'demo.luna@exemple.fr';
```

## Étape 2 — Charger les données

1. Ouvre **SQL Editor** → **New query**.
2. Colle tout le contenu de [`seed_demo.sql`](seed_demo.sql) → **Run**.
3. Message attendu : `Démo LUNA : données insérées pour demo.luna@exemple.fr`.
   - Si tu vois `Utilisateur démo introuvable`, l'étape 1 n'a pas été faite (ou
     l'e-mail ne correspond pas à `demo_email`).

Le script est **idempotent** : tu peux le relancer, il **purge d'abord** les
données de ce compte puis réinsère. Tu peux aussi le rejouer pour « réinitialiser »
la démo avant chaque présentation.

## Étape 3 — Vérifier

Connecte-toi avec les identifiants ci-dessus et vérifie :
- **Jour** : la journée du 9 août est remplie (humeur, énergie, repas).
- **Lune** : la corolle est colorée par l'humeur dominante.
- **Schémas** : plusieurs corrélations détectées (humeur × lune, confort × cycle,
  énergie × cycle, poids × cycle).
- **Rappels** : conseils générés à partir de la prévision de cycle + lune.

## Nettoyer après la démo

Pour tout supprimer sans toucher aux autres comptes, relance le bloc de `delete`
en tête de `seed_demo.sql`, ou supprime l'utilisateur démo depuis le dashboard
(**Authentication → Users**) — la suppression en cascade (`on delete cascade`)
efface toutes ses données.

---

> ⚠️ Rappel : dev et prod **partagent le même projet Supabase**. Ce compte démo
> sera donc visible dans les deux environnements. Ce n'est pas gênant (chaque
> compte est isolé par la RLS), mais garde-le en tête.
