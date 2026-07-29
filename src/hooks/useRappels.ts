import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { infoCycle, longueurMoyenne } from '../lib/cycle'
import { joursAvantNouvelleLune, phaseLune } from '../lib/lune'
import { aujourdhuiISO, decaleJours, diffJours } from '../lib/dates'
import { construitJoursAnalyse, construitSchemas, quadrantLune } from '../lib/schemas'
import { genererRappels } from '../lib/rappels'
import type { Rappel } from '../lib/rappels'
import { scoreGroupes } from '../types/emotions'
import type { MomentJour } from '../types/journal'

const FENETRE_JOURS = 90

export function useRappels() {
  const [rappels, setRappels] = useState<Rappel[]>([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)

  const charger = useCallback(async () => {
    setChargement(true)
    setErreur(null)

    const auj = aujourdhuiISO()
    const debut = decaleJours(auj, -(FENETRE_JOURS - 1))

    const [rMoments, rRegles, rCorps, rEtat] = await Promise.all([
      supabase.from('moments_jour').select('*').gte('date', debut).lte('date', auj),
      supabase.from('regles').select('date_debut').order('date_debut'),
      supabase.from('mesures_corps').select('date, poids').gte('date', debut).lte('date', auj),
      supabase.from('rappels_etat').select('cle').eq('date', auj),
    ])

    const err = rMoments.error || rRegles.error || rCorps.error || rEtat.error
    if (err) {
      setErreur(err.message)
      setRappels([])
      setChargement(false)
      return
    }

    const moments = (rMoments.data ?? []) as MomentJour[]
    const starts = (rRegles.data ?? []).map((r) => r.date_debut as string)

    // Schémas (via le builder partagé)
    const dates: string[] = []
    for (let i = FENETRE_JOURS - 1; i >= 0; i--) dates.push(decaleJours(auj, -i))
    const parDate = new Map<string, MomentJour[]>()
    for (const m of moments) {
      const l = parDate.get(m.date) ?? []
      l.push(m)
      parDate.set(m.date, l)
    }
    const poidsParDate = new Map<string, number>()
    for (const c of rCorps.data ?? []) {
      if (c.poids != null) poidsParDate.set(c.date as string, Number(c.poids))
    }
    const schemas = construitSchemas(
      construitJoursAnalyse(dates, parDate, starts, poidsParDate),
    )

    // Prévision du cycle : prochaines règles = dernier début + longueur moyenne
    let joursAvantRegles: number | null = null
    if (starts.length > 0) {
      const dernier = starts[starts.length - 1]
      const prochaines = decaleJours(dernier, longueurMoyenne(starts))
      joursAvantRegles = diffJours(auj, prochaines)
    }

    // Soirs tendus sur les 7 derniers jours (humeur du soir à faible valence)
    const seuil7 = decaleJours(auj, -6)
    const soirsTendus = moments.filter((m) => {
      if (m.date < seuil7 || m.moment !== 'soir') return false
      const score = scoreGroupes(m.humeur_groupes)
      return score != null && score <= 2
    }).length

    const tous = genererRappels({
      date: auj,
      cycle: infoCycle(starts, auj),
      joursAvantRegles,
      quadrant: quadrantLune(phaseLune(auj).fraction),
      joursAvantNouvelle: joursAvantNouvelleLune(auj),
      soirsTendus,
      schemas,
    })

    // Retire ceux déjà traités aujourd'hui
    const traites = new Set((rEtat.data ?? []).map((e) => e.cle as string))
    setRappels(tous.filter((r) => !traites.has(r.cle)))
    setChargement(false)
  }, [])

  useEffect(() => {
    charger()
  }, [charger])

  // Marque un rappel « noté » ou « plus tard » (disparaît pour aujourd'hui)
  const marquer = useCallback(
    async (cle: string, etat: 'note' | 'plus_tard') => {
      // Optimiste : on retire tout de suite
      setRappels((prev) => prev.filter((r) => r.cle !== cle))
      const { error } = await supabase
        .from('rappels_etat')
        .upsert({ cle, date: aujourdhuiISO(), etat }, { onConflict: 'cle,date' })
      if (error) setErreur(error.message)
    },
    [],
  )

  return { rappels, chargement, erreur, recharger: charger, marquer }
}
