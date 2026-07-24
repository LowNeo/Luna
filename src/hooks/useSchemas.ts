import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { longueurMoyenne } from '../lib/cycle'
import { aujourdhuiISO, decaleJours } from '../lib/dates'
import { construitJoursAnalyse, construitSchemas } from '../lib/schemas'
import type { Schema } from '../lib/schemas'
import type { MomentJour } from '../types/journal'

const FENETRE_JOURS = 90 // on analyse les 90 derniers jours

export interface StatsSchemas {
  joursNotes: number
  cycleMoyen: number | null
  fenetre: number
}

// Liste des dates ISO de la fenêtre (du plus ancien à aujourd'hui)
function datesFenetre(): string[] {
  const fin = aujourdhuiISO()
  const dates: string[] = []
  for (let i = FENETRE_JOURS - 1; i >= 0; i--) dates.push(decaleJours(fin, -i))
  return dates
}

export function useSchemas() {
  const [schemas, setSchemas] = useState<Schema[]>([])
  const [stats, setStats] = useState<StatsSchemas>({
    joursNotes: 0,
    cycleMoyen: null,
    fenetre: FENETRE_JOURS,
  })
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)

  const charger = useCallback(async () => {
    setChargement(true)
    setErreur(null)

    const dates = datesFenetre()
    const debut = dates[0]
    const fin = dates[dates.length - 1]

    const [rMoments, rRegles, rCorps] = await Promise.all([
      supabase.from('moments_jour').select('*').gte('date', debut).lte('date', fin),
      supabase.from('regles').select('date_debut').order('date_debut'),
      supabase.from('mesures_corps').select('date, poids').gte('date', debut).lte('date', fin),
    ])

    const err = rMoments.error || rRegles.error || rCorps.error
    if (err) {
      setErreur(err.message)
      setSchemas([])
      setChargement(false)
      return
    }

    const starts = (rRegles.data ?? []).map((r) => r.date_debut as string)

    const parDate = new Map<string, MomentJour[]>()
    for (const m of (rMoments.data ?? []) as MomentJour[]) {
      const l = parDate.get(m.date) ?? []
      l.push(m)
      parDate.set(m.date, l)
    }

    const poidsParDate = new Map<string, number>()
    for (const c of rCorps.data ?? []) {
      if (c.poids != null) poidsParDate.set(c.date as string, Number(c.poids))
    }

    const jours = construitJoursAnalyse(dates, parDate, starts, poidsParDate)
    const joursNotes = new Set((rMoments.data ?? []).map((m) => (m as MomentJour).date)).size

    setSchemas(construitSchemas(jours))
    setStats({
      joursNotes,
      cycleMoyen: starts.length >= 2 ? longueurMoyenne(starts) : null,
      fenetre: FENETRE_JOURS,
    })
    setChargement(false)
  }, [])

  useEffect(() => {
    charger()
  }, [charger])

  return { schemas, stats, chargement, erreur, recharger: charger }
}
