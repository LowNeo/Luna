// Type du suivi des nuits (table public.nuits)
// Une nuit = la nuit précédant une journée donnée.

export interface Nuit {
  id: string
  date: string
  qualite: number | null // 0 → 5
  reveils_nocturnes: number | null // nombre de réveils
  heure_coucher: string | null // endormissement (HH:MM)
  heure_reveil: string | null // réveil (HH:MM)
  note: string | null
  cree_le: string
}

// Données modifiables d'une nuit
export type NuitSaisie = Pick<
  Nuit,
  'qualite' | 'reveils_nocturnes' | 'heure_coucher' | 'heure_reveil' | 'note'
>
