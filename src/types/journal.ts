// Types des entités du journal LUNA

// Les 3 moments d'une journée
export type Moment = 'matin' | 'apres_midi' | 'soir'

// Palette d'humeurs suivies (cf. légende « Humeurs du mois »)
export type Humeur = 'lumineuse' | 'douce' | 'sensible' | 'agitee' | 'basse'

// Un moment saisi dans la journée (table public.moments_jour)
export interface MomentJour {
  id: string
  date: string // AAAA-MM-JJ
  moment: Moment
  heure: string | null // HH:MM
  humeur: Humeur | null
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
  | 'humeur'
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

export const LABEL_HUMEUR: Record<Humeur, string> = {
  lumineuse: 'Lumineuse',
  douce: 'Douce',
  sensible: 'Sensible',
  agitee: 'Agitée',
  basse: 'Basse',
}

// Ordre des humeurs (du plus haut au plus bas) pour les sélecteurs
export const HUMEURS: Humeur[] = ['lumineuse', 'douce', 'sensible', 'agitee', 'basse']

// Couleurs associées aux humeurs (ruban « Humeurs du mois »)
export const COULEUR_HUMEUR: Record<Humeur, string> = {
  lumineuse: '#78d6c5',
  douce: '#8bb6dd',
  sensible: '#b3a3df',
  agitee: '#dcae82',
  basse: '#63788a',
}

// Étiquettes de confort digestif proposées
export const LABELS_CONFORT = ['très léger', 'léger', 'neutre', 'lourd', 'très lourd']
