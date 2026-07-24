-- LUNA — Tranche 4 : entrées de journal (timeline narrative du jour)
-- À coller dans l'éditeur SQL de Supabase (SQL Editor > New query > Run).

-- Entrées libres de la timeline : réveil, rêve, ressenti, humeur du soir…
-- (Les repas viennent de moments_jour et sont fusionnés côté app.)
create table if not exists public.entrees_journal (
  id        uuid primary key default gen_random_uuid(),
  date      date not null,
  heure     time,
  type      text not null default 'note'
            check (type in ('reveil', 'reve', 'humeur', 'confort', 'repas', 'note')),
  titre     text,
  texte     text,
  recurrent boolean not null default false, -- ex. rêve récurrent
  cree_le   timestamptz not null default now()
);

create index if not exists idx_entrees_journal_date on public.entrees_journal (date);

alter table public.entrees_journal enable row level security;
drop policy if exists "acces_anon_temporaire" on public.entrees_journal;
create policy "acces_anon_temporaire" on public.entrees_journal
  for all to anon using (true) with check (true);
