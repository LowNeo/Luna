import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { diffJours } from '../lib/dates'
import type {
  ChampMensuration,
  MesureCorps,
  MesureSaisie,
} from '../types/corps'
import { MENSURATIONS } from '../types/corps'

// Un point de la courbe de poids
export interface PointPoids {
  date: string
  valeur: number
}

// Variation d'une métrique
export interface Variation {
  delta: number // valeur signée
  jours?: number // écart en jours (pour le poids)
}

// Convertit une valeur numeric Supabase (parfois renvoyée en texte) en nombre
function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isNaN(n) ? null : n
}

function normaliser(brut: Record<string, unknown>): MesureCorps {
  return {
    id: brut.id as string,
    date: brut.date as string,
    poids: toNum(brut.poids),
    tour_taille: toNum(brut.tour_taille),
    tour_hanches: toNum(brut.tour_hanches),
    tour_poitrine: toNum(brut.tour_poitrine),
    tour_cuisse: toNum(brut.tour_cuisse),
    tour_bras: toNum(brut.tour_bras),
    cree_le: brut.cree_le as string,
  }
}

export function useMesuresCorps() {
  const [mesures, setMesures] = useState<MesureCorps[]>([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)

  const charger = useCallback(async () => {
    setChargement(true)
    setErreur(null)
    const { data, error } = await supabase
      .from('mesures_corps')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      setErreur(error.message)
      setMesures([])
    } else {
      setMesures((data ?? []).map((r) => normaliser(r as Record<string, unknown>)))
    }
    setChargement(false)
  }, [])

  useEffect(() => {
    charger()
  }, [charger])

  // Enregistre (crée ou complète) une mesure à une date.
  // Grâce à l'upsert « merge », seuls les champs fournis sont mis à jour.
  const enregistrer = useCallback(
    async (date: string, saisie: MesureSaisie) => {
      const { error } = await supabase
        .from('mesures_corps')
        .upsert({ date, ...saisie }, { onConflict: 'date' })
      if (error) {
        setErreur(error.message)
        return false
      }
      await charger()
      return true
    },
    [charger],
  )

  // --- Dérivés : courbe de poids ---
  const seriePoids: PointPoids[] = mesures
    .filter((m) => m.poids != null)
    .map((m) => ({ date: m.date, valeur: m.poids as number }))

  const poidsActuel = seriePoids.at(-1) ?? null

  // Variation de poids sur ~7 jours (le point le plus proche de 7 jours avant)
  let variationPoids: Variation | null = null
  if (poidsActuel && seriePoids.length >= 2) {
    const cible = 7
    let meilleur = seriePoids[0]
    for (const p of seriePoids) {
      if (p.date >= poidsActuel.date) continue
      const ecartActuel = Math.abs(diffJours(p.date, poidsActuel.date) - cible)
      const ecartMeilleur = Math.abs(diffJours(meilleur.date, poidsActuel.date) - cible)
      if (ecartActuel <= ecartMeilleur) meilleur = p
    }
    variationPoids = {
      delta: poidsActuel.valeur - meilleur.valeur,
      jours: diffJours(meilleur.date, poidsActuel.date),
    }
  }

  // --- Dérivés : mensurations (dernière valeur + variation) ---
  function derniereMesure(champ: ChampMensuration): {
    valeur: number | null
    variation: Variation | null
  } {
    const points = mesures.filter((m) => m[champ] != null)
    if (points.length === 0) return { valeur: null, variation: null }
    const derniere = points.at(-1)![champ] as number
    const variation =
      points.length >= 2
        ? { delta: derniere - (points.at(-2)![champ] as number) }
        : null
    return { valeur: derniere, variation }
  }

  const mensurations = MENSURATIONS.map((m) => ({
    ...m,
    ...derniereMesure(m.champ),
  }))

  return {
    mesures,
    chargement,
    erreur,
    recharger: charger,
    enregistrer,
    seriePoids,
    poidsActuel,
    variationPoids,
    mensurations,
  }
}
