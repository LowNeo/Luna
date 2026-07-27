// Définition des types d'entrées du Journal (intégrés + personnalisés).
// Chaque type possède une liste de champs ; l'heure est gérée à part
// (commune à tous les types, sert au tri de la timeline).

export type KindChamp = 'texte' | 'zone' | 'nombre' | 'echelle' | 'booleen'

export interface ChampDef {
  cle: string
  label: string
  kind: KindChamp
  unite?: string // ex. « min »
}

export interface TypeJournal {
  cle: string
  label: string
  couleur: string
  champs: ChampDef[]
  perso?: boolean // true si défini par l'utilisateur
}

// Libellés des natures de champ (pour le créateur de type)
export const LABEL_KIND: Record<KindChamp, string> = {
  texte: 'Texte court',
  zone: 'Texte long',
  nombre: 'Nombre',
  echelle: 'Échelle 1-5',
  booleen: 'Oui / non',
}

// Types intégrés (d'après le fichier de suivi)
export const TYPES_BUILTIN: TypeJournal[] = [
  {
    cle: 'activite_physique',
    label: 'Activité physique',
    couleur: '#78d6c5',
    champs: [
      { cle: 'type', label: 'Type', kind: 'texte' },
      { cle: 'duree', label: 'Durée', kind: 'nombre', unite: 'min' },
      { cle: 'intensite', label: 'Intensité', kind: 'echelle' },
      { cle: 'energie', label: 'Énergie', kind: 'echelle' },
    ],
  },
  {
    cle: 'grignotage',
    label: 'Grignotage',
    couleur: '#dcae82',
    champs: [
      { cle: 'contenu', label: 'Contenu', kind: 'texte' },
      { cle: 'emotions', label: 'Émotions', kind: 'texte' },
      { cle: 'raison', label: 'Raison', kind: 'texte' },
    ],
  },
  {
    cle: 'collation',
    label: 'Collation',
    couleur: '#86c08f',
    champs: [
      { cle: 'contenu', label: 'Contenu', kind: 'texte' },
      { cle: 'faim', label: 'Niveau de faim (avant)', kind: 'echelle' },
    ],
  },
  {
    cle: 'sieste',
    label: 'Sieste',
    couleur: '#8bb6dd',
    champs: [
      { cle: 'duree', label: 'Durée', kind: 'nombre', unite: 'min' },
      { cle: 'raison', label: 'Raison', kind: 'texte' },
      { cle: 'commentaires', label: 'Commentaires', kind: 'zone' },
    ],
  },
  {
    cle: 'selles',
    label: 'Selles',
    couleur: '#b08968',
    champs: [
      { cle: 'consistance', label: 'Consistance', kind: 'texte' },
      { cle: 'odorante', label: 'Odorante', kind: 'booleen' },
    ],
  },
  {
    cle: 'bouffee_chaleur',
    label: 'Bouffée de chaleur',
    couleur: '#cf7d7d',
    champs: [
      { cle: 'duree', label: 'Durée', kind: 'nombre', unite: 'min' },
      { cle: 'contexte', label: 'Contexte', kind: 'texte' },
    ],
  },
  {
    cle: 'autre',
    label: 'Autre',
    couleur: '#9fb0af',
    champs: [{ cle: 'commentaires', label: 'Commentaires', kind: 'zone' }],
  },
]

// Palette pour colorer les types personnalisés (choisie via le hash de la clé)
const PALETTE_PERSO = ['#78d6c5', '#8bb6dd', '#b3a3df', '#dcae82', '#86c08f', '#cf7d7d']

export function couleurPerso(cle: string): string {
  let h = 0
  for (let i = 0; i < cle.length; i++) h = (h * 31 + cle.charCodeAt(i)) >>> 0
  return PALETTE_PERSO[h % PALETTE_PERSO.length]
}

// Slug ASCII à partir d'un libellé (pour la clé d'un type ou d'un champ)
export function slug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

// Formate une valeur de champ pour l'affichage (null = à masquer)
export function formatValeur(champ: ChampDef, v: unknown): string | null {
  if (v === null || v === undefined || v === '') return null
  switch (champ.kind) {
    case 'echelle':
      return `${v}/5`
    case 'nombre':
      return champ.unite ? `${v} ${champ.unite}` : String(v)
    case 'booleen':
      return v ? 'oui' : null
    default:
      return String(v)
  }
}
