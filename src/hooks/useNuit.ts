import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Nuit, NuitSaisie } from '../types/nuit'

// Gère la nuit d'une date (chargement + enregistrement).
export function useNuit(date: string) {
  const [nuit, setNuit] = useState<Nuit | null>(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)

  const charger = useCallback(async () => {
    setChargement(true)
    setErreur(null)
    const { data, error } = await supabase
      .from('nuits')
      .select('*')
      .eq('date', date)
      .maybeSingle()

    if (error) {
      setErreur(error.message)
      setNuit(null)
    } else {
      setNuit((data as Nuit) ?? null)
    }
    setChargement(false)
  }, [date])

  useEffect(() => {
    charger()
  }, [charger])

  const enregistrer = useCallback(
    async (saisie: NuitSaisie) => {
      const { error } = await supabase
        .from('nuits')
        .upsert({ date, ...saisie }, { onConflict: 'user_id,date' })
      if (error) {
        setErreur(error.message)
        return false
      }
      await charger()
      return true
    },
    [date, charger],
  )

  return { nuit, chargement, erreur, recharger: charger, enregistrer }
}
