// Une entrée de journal : un type (intégré ou perso) + des données flexibles.

export interface EntreeJournal {
  id: string
  date: string
  heure: string | null // HH:MM(:SS)
  type: string // clé du type
  donnees: Record<string, unknown>
  titre: string | null // legacy (anciennes entrées libres)
  texte: string | null // legacy
  cree_le: string
}

// Ce que le formulaire d'ajout produit
export interface EntreeSaisie {
  type: string
  heure: string | null
  donnees: Record<string, unknown>
}
