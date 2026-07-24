import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { EntreeJournal, EntreeSaisie, TypeEntree } from '../types/journalEntree'
import { LABEL_TYPE_ENTREE } from '../types/journalEntree'
import type { MomentJour } from '../types/journal'
import { LABEL_REPAS } from '../types/journal'

// Un élément de la timeline (entrée libre OU repas dérivé d'un moment)
export interface ItemTimeline {
  cle: string
  heure: string | null // HH:MM
  type: TypeEntree
  titre: string
  texte: string | null
  recurrent: boolean
  source: 'journal' | 'moment' // 'moment' = dérivé (repas), non éditable ici
  id?: string // id de l'entrée journal (pour suppression)
}

function hhmm(heure: string | null): string | null {
  return heure ? heure.slice(0, 5) : null
}

// Clé de tri : les heures nulles vont en fin de journée
function cleTri(heure: string | null): string {
  return heure ? heure.slice(0, 5) : '99:99'
}

// Charge et fusionne la timeline d'une journée.
export function useJournalJour(date: string) {
  const [items, setItems] = useState<ItemTimeline[]>([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)

  const charger = useCallback(async () => {
    setChargement(true)
    setErreur(null)

    const [rEntrees, rMoments] = await Promise.all([
      supabase.from('entrees_journal').select('*').eq('date', date),
      supabase.from('moments_jour').select('*').eq('date', date),
    ])

    const err = rEntrees.error || rMoments.error
    if (err) {
      setErreur(err.message)
      setItems([])
      setChargement(false)
      return
    }

    // Entrées libres
    const libres: ItemTimeline[] = (rEntrees.data as EntreeJournal[]).map((e) => ({
      cle: `j-${e.id}`,
      heure: hhmm(e.heure),
      type: e.type,
      titre: e.titre?.trim() || LABEL_TYPE_ENTREE[e.type],
      texte: e.texte,
      recurrent: e.recurrent,
      source: 'journal',
      id: e.id,
    }))

    // Repas dérivés des moments (uniquement ceux qui ont une note)
    const repas: ItemTimeline[] = (rMoments.data as MomentJour[])
      .filter((m) => m.repas_note)
      .map((m) => ({
        cle: `m-${m.id}`,
        heure: hhmm(m.heure),
        type: 'repas',
        titre: LABEL_REPAS[m.moment],
        texte: m.repas_note,
        recurrent: false,
        source: 'moment',
      }))

    const tous = [...libres, ...repas].sort((a, b) =>
      cleTri(a.heure).localeCompare(cleTri(b.heure)),
    )

    setItems(tous)
    setChargement(false)
  }, [date])

  useEffect(() => {
    charger()
  }, [charger])

  // Ajoute une entrée libre
  const ajouter = useCallback(
    async (saisie: EntreeSaisie) => {
      const { error } = await supabase
        .from('entrees_journal')
        .insert({ date, ...saisie })
      if (error) {
        setErreur(error.message)
        return false
      }
      await charger()
      return true
    },
    [date, charger],
  )

  // Supprime une entrée libre
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

  return { items, chargement, erreur, recharger: charger, ajouter, supprimer }
}
