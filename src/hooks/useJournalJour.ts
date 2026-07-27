import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { EntreeJournal, EntreeSaisie } from '../types/journalEntree'
import type { ChampDef, TypeJournal } from '../types/journalTypes'
import { couleurPerso, formatValeur, slug, TYPES_BUILTIN } from '../types/journalTypes'
import type { MomentJour } from '../types/journal'
import { LABEL_REPAS } from '../types/journal'

// Une valeur affichée dans la timeline
export interface ChampAffiche {
  label: string
  valeur: string
}

// Un élément de la timeline (entrée typée OU repas dérivé d'un moment)
export interface ItemTimeline {
  cle: string
  heure: string | null // HH:MM
  typeLabel: string
  couleur: string
  champs: ChampAffiche[]
  source: 'journal' | 'moment'
  id?: string
}

function hhmm(heure: string | null): string | null {
  return heure ? heure.slice(0, 5) : null
}

function cleTri(heure: string | null): string {
  return heure ? heure.slice(0, 5) : '99:99'
}

export function useJournalJour(date: string) {
  const [items, setItems] = useState<ItemTimeline[]>([])
  const [types, setTypes] = useState<TypeJournal[]>(TYPES_BUILTIN)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)

  const charger = useCallback(async () => {
    setChargement(true)
    setErreur(null)

    const [rEntrees, rMoments, rTypes] = await Promise.all([
      supabase.from('entrees_journal').select('*').eq('date', date),
      supabase.from('moments_jour').select('*').eq('date', date),
      supabase.from('journal_types').select('*'),
    ])

    const err = rEntrees.error || rMoments.error || rTypes.error
    if (err) {
      setErreur(err.message)
      setItems([])
      setChargement(false)
      return
    }

    // Types : intégrés + personnalisés
    const perso: TypeJournal[] = (rTypes.data ?? []).map((t) => ({
      cle: t.cle as string,
      label: t.label as string,
      couleur: couleurPerso(t.cle as string),
      champs: (t.champs as ChampDef[]) ?? [],
      perso: true,
    }))
    const tousTypes = [...TYPES_BUILTIN, ...perso]
    const parCle = new Map(tousTypes.map((t) => [t.cle, t]))
    setTypes(tousTypes)

    // Entrées typées
    const libres: ItemTimeline[] = (rEntrees.data as EntreeJournal[]).map((e) => {
      const def = parCle.get(e.type)
      let champs: ChampAffiche[] = []
      if (def) {
        champs = def.champs
          .map((c) => {
            const v = formatValeur(c, (e.donnees ?? {})[c.cle])
            return v == null ? null : { label: c.label, valeur: v }
          })
          .filter((x): x is ChampAffiche => x !== null)
      }
      // repli pour les anciennes entrées libres
      if (champs.length === 0 && e.texte) champs = [{ label: '', valeur: e.texte }]

      return {
        cle: `j-${e.id}`,
        heure: hhmm(e.heure),
        typeLabel: def?.label ?? e.titre ?? e.type,
        couleur: def?.couleur ?? '#9fb0af',
        champs,
        source: 'journal',
        id: e.id,
      }
    })

    // Repas dérivés des moments
    const repas: ItemTimeline[] = (rMoments.data as MomentJour[])
      .filter((m) => m.repas_note || m.repas_remarque)
      .map((m) => {
        const champs: ChampAffiche[] = []
        if (m.repas_note) champs.push({ label: '', valeur: m.repas_note })
        if (m.repas_remarque) champs.push({ label: 'Remarque', valeur: m.repas_remarque })
        return {
          cle: `m-${m.id}`,
          heure: hhmm(m.heure),
          typeLabel: LABEL_REPAS[m.moment],
          couleur: '#86c08f',
          champs,
          source: 'moment',
        }
      })

    const tous = [...libres, ...repas].sort((a, b) =>
      cleTri(a.heure).localeCompare(cleTri(b.heure)),
    )
    setItems(tous)
    setChargement(false)
  }, [date])

  useEffect(() => {
    charger()
  }, [charger])

  // Ajoute une entrée typée
  const ajouter = useCallback(
    async (saisie: EntreeSaisie) => {
      const { error } = await supabase.from('entrees_journal').insert({
        date,
        type: saisie.type,
        heure: saisie.heure,
        donnees: saisie.donnees,
      })
      if (error) {
        setErreur(error.message)
        return false
      }
      await charger()
      return true
    },
    [date, charger],
  )

  // Supprime une entrée
  const supprimer = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('entrees_journal').delete().eq('id', id)
      if (error) {
        setErreur(error.message)
        return false
      }
      await charger()
      return true
    },
    [charger],
  )

  // Crée un type personnalisé
  const creerType = useCallback(
    async (label: string, champs: ChampDef[]) => {
      const cle = slug(label)
      if (!cle) {
        setErreur('Nom de type invalide.')
        return false
      }
      const { error } = await supabase
        .from('journal_types')
        .insert({ cle, label: label.trim(), champs })
      if (error) {
        setErreur(
          /duplicate|unique/i.test(error.message)
            ? 'Ce type existe déjà.'
            : error.message,
        )
        return false
      }
      await charger()
      return true
    },
    [charger],
  )

  return { items, types, chargement, erreur, recharger: charger, ajouter, supprimer, creerType }
}
