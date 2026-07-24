import type { Humeur } from '../../types/journal'
import { HUMEURS, LABEL_HUMEUR } from '../../types/journal'

// Affiche l'humeur sous forme de « chip ».
// Si onChange est fourni, propose la sélection parmi toutes les humeurs.
export function HumeurChip({
  value,
  onChange,
}: {
  value: Humeur | null
  onChange?: (h: Humeur) => void
}) {
  // Mode sélection (édition)
  if (onChange) {
    return (
      <div className="chips">
        {HUMEURS.map((h) => (
          <button
            key={h}
            type="button"
            className={`chip ${value === h ? 'chip--actif' : ''}`}
            onClick={() => onChange(h)}
          >
            {LABEL_HUMEUR[h]}
          </button>
        ))}
      </div>
    )
  }

  // Mode lecture
  if (!value) return <span className="texte-dim">—</span>
  return <span className="chip chip--lecture">{LABEL_HUMEUR[value]}</span>
}
