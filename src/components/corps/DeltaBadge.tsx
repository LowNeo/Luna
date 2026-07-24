import { fmtNombre } from '../../lib/format'

// Petit badge de variation : flèche + valeur absolue (+ suffixe optionnel).
// delta nul ou absent → tiret.
export function DeltaBadge({
  delta,
  suffixe,
}: {
  delta: number | null
  suffixe?: string
}) {
  if (delta == null || Math.abs(delta) < 0.05) {
    return <span className="delta delta--neutre">—</span>
  }
  const baisse = delta < 0
  return (
    <span className={`delta ${baisse ? 'delta--bas' : 'delta--haut'}`}>
      {baisse ? '↓' : '↑'} {fmtNombre(Math.abs(delta))}
      {suffixe ? ` · ${suffixe}` : ''}
    </span>
  )
}
