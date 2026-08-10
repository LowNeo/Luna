import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Moment, MomentJour, MomentSaisie } from '../types/journal'

// Hook de gestion des moments d'une journée (une date).
// Charge les moments existants et permet de les enregistrer (upsert).
export function useMomentsJour(date: string) {
  const [moments, setMoments] = useState<MomentJour[]>([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)

  // Charge les moments de la date
  const charger = useCallback(async () => {
    setChargement(true)
    setErreur(null)
    const { data, error } = await supabase
      .from('moments_jour')
      .select('*')
      .eq('date', date)

    if (error) {
      setErreur(error.message)
      setMoments([])
    } else {
      setMoments((data ?? []) as MomentJour[])
    }
    setChargement(false)
  }, [date])

  useEffect(() => {
    charger()
  }, [charger])

  // Enregistre (crée ou met à jour) un moment de la journée
  const enregistrer = useCallback(
    async (moment: Moment, saisie: MomentSaisie) => {
      const ligne = { date, moment, ...saisie }
      const { error } = await supabase
        .from('moments_jour')
        .upsert(ligne, { onConflict: 'user_id,date,moment' })

      if (error) {
        setErreur(error.message)
        return false
      }
      await charger()
      return true
    },
    [date, charger],
  )

  // Renvoie le moment déjà saisi pour un créneau, ou undefined
  const momentPour = useCallback(
    (moment: Moment) => moments.find((m) => m.moment === moment),
    [moments],
  )

  return { moments, momentPour, chargement, erreur, recharger: charger, enregistrer }
}
