// Barre d'énergie en 5 segments (0 → 5).
// Si onChange est fourni, les segments deviennent cliquables.
const SEGMENTS = 5

export function EnergieBar({
  value,
  onChange,
}: {
  value: number | null
  onChange?: (n: number) => void
}) {
  const niveau = value ?? 0

  return (
    <div className="energie" role={onChange ? 'group' : undefined}>
      {Array.from({ length: SEGMENTS }, (_, i) => {
        const rempli = i < niveau
        const classe = `energie__seg ${rempli ? 'energie__seg--on' : ''}`
        if (onChange) {
          return (
            <button
              key={i}
              type="button"
              className={classe}
              aria-label={`Énergie ${i + 1} sur ${SEGMENTS}`}
              // Recliquer sur le dernier segment rempli remet à zéro
              onClick={() => onChange(niveau === i + 1 ? 0 : i + 1)}
            />
          )
        }
        return <span key={i} className={classe} />
      })}
    </div>
  )
}
