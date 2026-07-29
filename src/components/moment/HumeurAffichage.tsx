import { GROUPE_PAR_CLE, GROUPE_PAR_NUANCE } from '../../types/emotions'

// Affiche l'humeur : seulement les nuances, chacune dans la couleur de son groupe.
// (À défaut de nuances, on montre les groupes choisis, colorés.)
export function HumeurAffichage({
  groupes,
  nuances,
}: {
  groupes: string[]
  nuances: string[]
}) {
  if (nuances.length > 0) {
    return (
      <span className="humeur-aff">
        {nuances.map((n) => (
          <span
            key={n}
            className="humeur-mot"
            style={{ color: GROUPE_PAR_NUANCE.get(n)?.couleur ?? 'var(--text)' }}
          >
            {n}
          </span>
        ))}
      </span>
    )
  }

  if (groupes.length > 0) {
    return (
      <span className="humeur-aff">
        {groupes.map((c) => {
          const g = GROUPE_PAR_CLE.get(c)
          return (
            <span key={c} className="humeur-mot" style={{ color: g?.couleur ?? 'var(--text)' }}>
              {g?.label ?? c}
            </span>
          )
        })}
      </span>
    )
  }

  return <span className="texte-dim">—</span>
}
