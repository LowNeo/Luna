// Référentiel des émotions (« Tableau des nuances des émotions »).
// 8 groupes, chacun avec sa couleur, sa valence (pour les schémas) et ses nuances.

export interface GroupeEmotion {
  cle: string
  label: string
  couleur: string
  valence: number // score d'humeur 1 (bas) → 5 (haut), pour « humeur × lune »
  nuances: string[]
}

export const GROUPES: GroupeEmotion[] = [
  {
    cle: 'joie',
    label: 'Joie',
    couleur: '#e6c25e',
    valence: 5,
    nuances: [
      'amusé', 'heureux', 'encouragé', 'aimé', 'léger', 'libre', 'motivé',
      'rassuré', 'amoureux', 'joyeux', 'content', 'comblé', 'ébloui',
      'enthousiaste', 'émerveillé', 'reconnaissant', "plein d'énergie", 'fier',
      'gai', 'radieux', 'rayonnant', 'lumineux', 'vivant', 'ravi', 'passionné',
      'excité', 'exalté', 'satisfait',
    ],
  },
  {
    cle: 'confiance',
    label: 'Confiance',
    couleur: '#6ea8dd',
    valence: 4,
    nuances: [
      'calme', 'serein', 'apaisé', 'confiant', 'cool', 'détendu', 'en paix',
      'équilibré', 'inspiré', 'optimiste', 'accepté', 'admiratif',
      "tranquille d'esprit",
    ],
  },
  {
    cle: 'surprise',
    label: 'Surprise',
    couleur: '#5ec2b1',
    valence: 3,
    nuances: [
      'incertain', 'alerté', 'choqué', 'bluffé', 'abasourdi', 'déconcerté',
      'désorienté', 'dérangé', 'embarrassé', 'étonné', 'interloqué',
      'impressionné', 'perplexe', 'troublé', 'indécis', 'stupéfait', 'intéressé',
    ],
  },
  {
    cle: 'peur',
    label: 'Peur',
    couleur: '#a89adf',
    valence: 2,
    nuances: [
      'affolé', 'alarmé', 'apeuré', 'anxieux', 'angoissé', 'craintif',
      'effrayé', 'inquiet', 'hésitant', 'méfiant', 'intimidé', 'préoccupé',
      'soucieux', 'paniqué', 'terrifié', 'terrorisé', 'épouvanté', 'vulnérable',
      'pessimiste', 'diminué',
    ],
  },
  {
    cle: 'colere',
    label: 'Colère',
    couleur: '#d9776b',
    valence: 2,
    nuances: [
      'mécontent', 'agacé', 'contrarié', 'tendu', 'excédé', 'exaspéré',
      'énervé', 'fâché', 'grincheux', 'nerveux', 'révolté', 'susceptible',
      'vexé', 'impuissant', 'impatient', 'enragé', 'furieux', 'furax', 'irrité',
      'en rage', 'en furie', 'frustré', 'sur les nerfs', 'hors de soi',
      'ulcéré', 'haineux', 'scandalisé',
    ],
  },
  {
    cle: 'tristesse',
    label: 'Tristesse',
    couleur: '#7c93a6',
    valence: 1,
    nuances: [
      'blessé', 'bouleversé', 'découragé', 'déprimé', 'désespéré', 'éteint',
      'abattu', 'anéanti', 'malheureux', 'peiné', 'vide', 'seul', 'perdu',
      'résigné', 'chagriné', 'déçu', 'las', 'accablé', 'mélancolique',
      'désenchanté', 'en détresse',
    ],
  },
  {
    cle: 'degout',
    label: 'Dégoût',
    couleur: '#86c08f',
    valence: 1,
    nuances: [
      "mal à l'aise", 'écoeuré', 'dégoûté', 'repoussé', 'rebuté', 'répugné',
      'trahi', 'ennuyé', 'nauséeux',
    ],
  },
  {
    cle: 'honte',
    label: 'Honte',
    couleur: '#c58bb0',
    valence: 1,
    nuances: [
      'fautif', 'plein de remords', 'plein de mépris', 'humilié', 'déshonoré',
      'discrédité', 'indigné', 'intimidé', 'confus', 'gêné', 'embarrassé',
      'rabaissé', 'affaibli',
    ],
  },
]

export const GROUPE_PAR_CLE = new Map(GROUPES.map((g) => [g.cle, g]))

// Retrouve le groupe d'une nuance (pour la colorer à l'affichage)
export const GROUPE_PAR_NUANCE = new Map<string, GroupeEmotion>()
for (const g of GROUPES) for (const n of g.nuances) GROUPE_PAR_NUANCE.set(n, g)

// Score d'humeur d'un jour : moyenne des valences des groupes choisis (null si aucun)
export function scoreGroupes(cles: string[]): number | null {
  const vals = cles
    .map((c) => GROUPE_PAR_CLE.get(c)?.valence)
    .filter((v): v is number => v != null)
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
}
