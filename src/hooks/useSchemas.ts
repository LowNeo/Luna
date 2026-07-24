import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { infoCycle, longueurMoyenne } from '../lib/cycle'
import { phaseLune } from '../lib/lune'
import { aujourdhuiISO, decaleJours } from '../lib/dates'
import {
  construitSchemas,
  quadrantLune,
  SCORE_HUMEUR,
} from '../lib/schemas'
import type { JourAnalyse, Schema } from '../lib/schemas'
import type { Moment, MomentJour } from '../types/journal'

const FENETRE_JOURS = 90 // on analyse les 90 derniers jours

export interface StatsSchemas {
  joursNotes: number
  cycleMoyen: number | null
  fenetre: number
}

// Humeur dominante d'un jour : le soir prime
const PRIORITE: Moment[] = ['soir', 'apres_midi', 'matin']

function moyenne(vals: (number | null)[]): number | null {
  const ok = vals.filter((v): v is number => v != null)
  return ok.length ? ok.reduce((a, b) => a + b, 0) / ok.length : null
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

    // Moments regroupés par date
    const parDate = new Map<string, MomentJour[]>()
    for (const m of (rMoments.data ?? []) as MomentJour[]) {
      const l = parDate.get(m.date) ?? []
      l.push(m)
      parDate.set(m.date, l)
    }

    // Poids par date
    const poidsParDate = new Map<string, number>()
    for (const c of rCorps.data ?? []) {
      if (c.poids != null) poidsParDate.set(c.date as string, Number(c.poids))
    }

    // Construit une ligne d'analyse par jour
    const jours: JourAnalyse[] = dates.map((date) => {
      const moments = parDate.get(date) ?? []
      // humeur dominante
      let scoreHumeur: number | null = null
      for (const mo of PRIORITE) {
        const t = moments.find((x) => x.moment === mo && x.humeur)
        if (t?.humeur) {
          scoreHumeur = SCORE_HUMEUR[t.humeur]
          break
        }
      }
      return {
        date,
        phaseCycle: infoCycle(starts, date).phase,
        quadrant: quadrantLune(phaseLune(date).fraction),
        scoreHumeur,
        confort: moyenne(moments.map((m) => m.confort_niveau)),
        energie: moyenne(moments.map((m) => m.energie)),
        poids: poidsParDate.get(date) ?? null,
      }
    })

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
