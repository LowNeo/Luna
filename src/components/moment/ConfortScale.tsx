import { LABELS_CONFORT } from '../../types/journal'

// Échelle de confort digestif : 5 points (0 → 5) + étiquette.
// En édition, les points sont cliquables et l'étiquette suit la position.
const POINTS = 5

export function ConfortScale({
  niveau,
  label,
  onChange,
}: {
  niveau: number | null
  label: string | null
  onChange?: (niveau: number, label: string) => void
}) {
  const actif = niveau ?? 0

  return (
    <div className="confort">
      <div className="confort__points" role={onChange ? 'group' : undefined}>
        {Array.from({ length: POINTS }, (_, i) => {
          const estActif = i + 1 === actif
          const classe = `confort__pt ${estActif ? 'confort__pt--on' : ''}`
          if (onChange) {
            return (
              <button
                key={i}
                type="button"
                className={classe}
                aria-label={LABELS_CONFORT[i]}
                onClick={() => onChange(i + 1, LABELS_CONFORT[i])}
              />
            )
          }
          return <span key={i} className={classe} />
        })}
      </div>
      <span className="confort__label">{label ?? (onChange ? 'confort' : '—')}</span>
    </div>
  )
}
