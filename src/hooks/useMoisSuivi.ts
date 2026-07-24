import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { infoCycle, longueurMoyenne } from '../lib/cycle'
import type { InfoCycle } from '../lib/cycle'
import { phaseLune } from '../lib/lune'
import type { PhaseLune } from '../lib/lune'
import { joursDansMois } from '../lib/dates'
import type { Humeur, Moment, MomentJour } from '../types/journal'

// Donnée agrégée pour un jour du mois (corolle + ruban d'humeurs)
export interface JourSuivi {
  date: string
  jour: number // numéro du jour dans le mois (1..31)
  lune: PhaseLune
  cycle: InfoCycle
  libido: number // 0 → 5
  humeur: Humeur | null // humeur dominante du jour
}

// Priorité pour choisir l'humeur « dominante » d'un jour : le soir prime.
const PRIORITE_MOMENT: Moment[] = ['soir', 'apres_midi', 'matin']

function humeurDominante(momentsDuJour: MomentJour[]): Humeur | null {
  for (const m of PRIORITE_MOMENT) {
    const trouve = momentsDuJour.find((x) => x.moment === m && x.humeur)
    if (trouve?.humeur) return trouve.humeur
  }
  return null
}

// Charge tout le suivi d'un mois : règles, libido et humeurs agrégées.
export function useMoisSuivi(annee: number, mois0: number) {
  const [jours, setJours] = useState<JourSuivi[]>([])
  const [reglesStarts, setReglesStarts] = useState<string[]>([])
  const [longueurCycle, setLongueurCycle] = useState(28)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)

  const charger = useCallback(async () => {
    setChargement(true)
    setErreur(null)

    const dates = joursDansMois(annee, mois0)
    const debut = dates[0]
    const fin = dates[dates.length - 1]

    // Trois requêtes en parallèle
    const [rRegles, rLibido, rMoments] = await Promise.all([
      supabase.from('regles').select('date_debut').order('date_debut'),
      supabase.from('suivi_jour').select('date, libido').gte('date', debut).lte('date', fin),
      supabase.from('moments_jour').select('*').gte('date', debut).lte('date', fin),
    ])

    const err = rRegles.error || rLibido.error || rMoments.error
    if (err) {
      setErreur(err.message)
      setJours([])
      setChargement(false)
      return
    }

    const starts = (rRegles.data ?? []).map((r) => r.date_debut as string)
    const libidoParDate = new Map<string, number>()
    for (const l of rLibido.data ?? []) libidoParDate.set(l.date as string, l.libido as number)

    const momentsParDate = new Map<string, MomentJour[]>()
    for (const m of (rMoments.data ?? []) as MomentJour[]) {
      const liste = momentsParDate.get(m.date) ?? []
      liste.push(m)
      momentsParDate.set(m.date, liste)
    }

    const resultat: JourSuivi[] = dates.map((iso, i) => ({
      date: iso,
      jour: i + 1,
      lune: phaseLune(iso),
      cycle: infoCycle(starts, iso),
      libido: libidoParDate.get(iso) ?? 0,
      humeur: humeurDominante(momentsParDate.get(iso) ?? []),
    }))

    setReglesStarts(starts)
    setLongueurCycle(longueurMoyenne(starts))
    setJours(resultat)
    setChargement(false)
  }, [annee, mois0])

  useEffect(() => {
    charger()
  }, [charger])

  // Ajoute un début de règles à une date
  const ajouterRegle = useCallback(
    async (dateIso: string) => {
      const { error } = await supabase
        .from('regles')
        .upsert({ date_debut: dateIso }, { onConflict: 'date_debut' })
      if (error) return setErreur(error.message), false
      await charger()
      return true
    },
    [charger],
  )

  // Supprime un début de règles
  const supprimerRegle = useCallback(
    async (dateIso: string) => {
      const { error } = await supabase.from('regles').delete().eq('date_debut', dateIso)
      if (error) return setErreur(error.message), false
      await charger()
      return true
    },
    [charger],
  )

  // Définit la libido d'un jour (0 → 5)
  const definirLibido = useCallback(
    async (dateIso: string, valeur: number) => {
      const { error } = await supabase
        .from('suivi_jour')
        .upsert({ date: dateIso, libido: valeur }, { onConflict: 'date' })
      if (error) return setErreur(error.message), false
      await charger()
      return true
    },
    [charger],
  )

  return {
    jours,
    reglesStarts,
    longueurCycle,
    chargement,
    erreur,
    recharger: charger,
    ajouterRegle,
    supprimerRegle,
    definirLibido,
  }
}
