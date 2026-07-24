import type { PhaseLune } from '../lib/lune'
import { libelleLuneCourt } from '../lib/lune'

// Petit « astre » lumineux affiché dans l'en-tête, avec son libellé.
// Décoratif : l'ombre du croissant suit approximativement l'illumination.
export function MoonBadge({ phase }: { phase: PhaseLune }) {
  const R = 26
  // Décalage de l'ombre : centrée = pleine lune, très décalée = nouvelle lune.
  const decal = (1 - phase.illumination) * R * 1.9
  const ombreCx = 50 + (phase.croissante ? decal : -decal)

  return (
    <div className="lune-badge">
      <svg viewBox="0 0 100 100" width="56" height="56" aria-hidden="true">
        <defs>
          <radialGradient id="orbe" cx="38%" cy="34%" r="72%">
            <stop offset="0%" stopColor="#dff6f0" />
            <stop offset="45%" stopColor="#9fe0d3" />
            <stop offset="100%" stopColor="#3f8b81" />
          </radialGradient>
          <filter id="flou">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        {/* halo */}
        <circle cx="50" cy="50" r={R + 6} fill="#55b3a4" opacity="0.18" filter="url(#flou)" />
        {/* astre */}
        <circle cx="50" cy="50" r={R} fill="url(#orbe)" />
        {/* ombre du croissant */}
        <circle cx={ombreCx} cy="50" r={R} fill="#0a1112" opacity="0.82" />
        {/* liseré */}
        <circle cx="50" cy="50" r={R} fill="none" stroke="#dff6f0" strokeOpacity="0.25" />
      </svg>
      <span className="lune-badge__label">{libelleLuneCourt(phase)}</span>
    </div>
  )
}
