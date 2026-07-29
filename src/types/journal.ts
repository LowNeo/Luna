// Types des entités du journal LUNA

// Les 3 moments d'une journée
export type Moment = 'matin' | 'apres_midi' | 'soir'

// Un moment saisi dans la journée (table public.moments_jour)
export interface MomentJour {
  id: string
  date: string // AAAA-MM-JJ
  moment: Moment
  heure: string | null // HH:MM
  humeur_groupes: string[] // ≤ 2 clés de groupes d'émotions
  humeur_nuances: string[] // ≤ 5 nuances
  energie: number | null // 0 → 5
  confort_niveau: number | null // 0 → 5 (position sur l'échelle)
  confort_label: string | null // ex. « léger », « lourd »
  repas_note: string | null // ce que j'ai mangé
  repas_remarque: string | null // ressenti / observation sur le repas
  cree_le: string
}

// Données modifiables d'un moment (ce que le formulaire édite)
export type MomentSaisie = Pick<
  MomentJour,
  | 'humeur_groupes'
  | 'humeur_nuances'
  | 'energie'
  | 'confort_niveau'
  | 'confort_label'
  | 'repas_note'
  | 'repas_remarque'
  | 'heure'
>

// Ordre d'affichage des moments
export const MOMENTS: Moment[] = ['matin', 'apres_midi', 'soir']

// Libellés d'affichage
export const LABEL_MOMENT: Record<Moment, string> = {
  matin: 'Matin',
  apres_midi: 'Après-midi',
  soir: 'Soir',
}

export const LABEL_REPAS: Record<Moment, string> = {
  matin: 'Petit-déjeuner',
  apres_midi: 'Déjeuner',
  soir: 'Dîner',
}

// Étiquettes de confort digestif proposées
export const LABELS_CONFORT = ['très léger', 'léger', 'neutre', 'lourd', 'très lourd']
