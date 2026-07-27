import { useEffect, useRef, useState } from 'react'

// Champ « chronomètre » : mesure une durée (démarrer / pause / réinitialiser).
// La valeur stockée est le nombre de secondes écoulées.
export function ChronoField({
  valeur,
  onChange,
}: {
  valeur: unknown
  onChange: (v: unknown) => void
}) {
  const secondes = typeof valeur === 'number' ? valeur : 0
  const [actif, setActif] = useState(false)

  // Ref sur la dernière valeur pour que l'intervalle lise toujours l'état à jour
  const secRef = useRef(secondes)
  secRef.current = secondes

  useEffect(() => {
    if (!actif) return
    const id = window.setInterval(() => onChange(secRef.current + 1), 1000)
    return () => window.clearInterval(id)
    // onChange est stable (useCallback côté parent) ; on ne dépend que de `actif`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actif])

  const m = Math.floor(secondes / 60)
  const s = secondes % 60

  return (
    <div className="chrono">
      <span className="chrono__temps">
        {m}:{String(s).padStart(2, '0')}
      </span>
      <button
        type="button"
        className={`btn ${actif ? 'btn--fantome' : 'btn--plein'} chrono__btn`}
        onClick={() => setActif((a) => !a)}
      >
        {actif ? 'Pause' : secondes > 0 ? 'Reprendre' : 'Démarrer'}
      </button>
      {secondes > 0 && (
        <button
          type="button"
          className="lien-mini"
          onClick={() => {
            setActif(false)
            onChange(0)
          }}
        >
          Réinitialiser
        </button>
      )}
    </div>
  )
}
