// Types du suivi corporel (table public.mesures_corps)

export interface MesureCorps {
  id: string
  date: string
  poids: number | null
  tour_taille: number | null
  tour_hanches: number | null
  tour_poitrine: number | null
  tour_cuisse: number | null
  tour_bras: number | null
  cree_le: string
}

// Champs de mensuration (tout sauf le poids)
export type ChampMensuration =
  | 'tour_taille'
  | 'tour_hanches'
  | 'tour_poitrine'
  | 'tour_cuisse'
  | 'tour_bras'

// Configuration d'affichage des mensurations (ordre + libellés)
export const MENSURATIONS: { champ: ChampMensuration; label: string }[] = [
  { champ: 'tour_taille', label: 'Tour de taille' },
  { champ: 'tour_hanches', label: 'Tour de hanches' },
  { champ: 'tour_poitrine', label: 'Tour de poitrine' },
  { champ: 'tour_cuisse', label: 'Tour de cuisse' },
  { champ: 'tour_bras', label: 'Tour de bras' },
]

// Valeurs modifiables d'une mesure
export type MesureSaisie = Partial<Pick<MesureCorps, 'poids'>> &
  Partial<Record<ChampMensuration, number | null>>
