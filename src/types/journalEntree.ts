// Types des entrées de journal (timeline narrative)

export type TypeEntree = 'reveil' | 'reve' | 'humeur' | 'confort' | 'repas' | 'note'

// Entrée libre stockée dans public.entrees_journal
export interface EntreeJournal {
  id: string
  date: string
  heure: string | null // HH:MM(:SS)
  type: TypeEntree
  titre: string | null
  texte: string | null
  recurrent: boolean
  cree_le: string
}

// Ce que le formulaire d'ajout produit
export type EntreeSaisie = Pick<
  EntreeJournal,
  'heure' | 'type' | 'titre' | 'texte' | 'recurrent'
>

// Libellés par défaut selon le type
export const LABEL_TYPE_ENTREE: Record<TypeEntree, string> = {
  reveil: 'Réveil',
  reve: 'Rêve',
  humeur: 'Humeur du soir',
  confort: 'Confort digestif',
  repas: 'Repas',
  note: 'Note',
}

// Types proposés à la saisie (le repas vient de l'onglet Jour)
export const TYPES_SAISIE: TypeEntree[] = ['reveil', 'reve', 'humeur', 'confort', 'note']

// Couleur de la pastille de timeline selon le type
export const COULEUR_TYPE_ENTREE: Record<TypeEntree, string> = {
  reveil: '#8bb6dd',
  reve: '#b3a3df',
  humeur: '#78d6c5',
  confort: '#dcae82',
  repas: '#86c08f',
  note: '#7c8c8b',
}
