import { COULEUR_PHASE } from '../../lib/cycle'
import type { JourSuivi } from '../../hooks/useMoisSuivi'

// La « corolle du mois » : une fleur radiale où chaque pétale = un jour.
//   longueur du pétale = libido · couleur = phase du cycle
//   couronne extérieure = phase de lune du jour
//   centre = jour de cycle courant
const TAILLE = 320
const C = TAILLE / 2
const R_INT = 48 // départ des pétales
const R_PETALE_MAX = 116 // pétale le plus long (libido = 5)
const R_LUNE = 142 // couronne des lunes

// Coordonnées polaires : 0° = haut, sens horaire
function polaire(r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180
  return { x: C + r * Math.sin(a), y: C - r * Math.cos(a) }
}

// Niveau de gris d'une lune selon sa fraction éclairée
function grisLune(illum: number): string {
  const v = Math.round(38 + illum * 205)
  return `rgb(${v}, ${v + 6}, ${v + 4})`
}

export function Corolle({
  jours,
  indexCourant,
  jourCycleCentre,
}: {
  jours: JourSuivi[]
  indexCourant: number // index du jour à mettre en évidence (-1 si aucun)
  jourCycleCentre: number | null
}) {
  const n = jours.length || 1

  return (
    <svg
      viewBox={`0 0 ${TAILLE} ${TAILLE}`}
      className="corolle"
      role="img"
      aria-label="Corolle du mois : cycle, lune, libido et humeur"
    >
      {/* cercle guide de la couronne */}
      <circle cx={C} cy={C} r={R_LUNE} fill="none" stroke="rgba(150,180,178,0.08)" />

      {jours.map((j, i) => {
        const angle = (i / n) * 360
        const courant = i === indexCourant

        // --- pétale (libido × phase) ---
        const longueur = R_INT + (j.libido / 5) * (R_PETALE_MAX - R_INT)
        const a = polaire(R_INT, angle)
        const b = polaire(Math.max(longueur, R_INT + 3), angle)
        const couleur = j.cycle.phase ? COULEUR_PHASE[j.cycle.phase] : '#3a4746'

        // --- lune de la couronne ---
        const p = polaire(R_LUNE, angle)

        return (
          <g key={j.date}>
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={couleur}
              strokeWidth={courant ? 6 : 4}
              strokeLinecap="round"
              opacity={j.libido > 0 ? (courant ? 1 : 0.85) : 0.28}
            />
            {courant && (
              <circle cx={p.x} cy={p.y} r={7.5} fill="none" stroke="#eef4f3" strokeWidth="1.2" />
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={courant ? 4.5 : 3.6}
              fill={grisLune(j.lune.illumination)}
            />
          </g>
        )
      })}

      {/* centre : jour de cycle */}
      <circle cx={C} cy={C} r={30} fill="#0c1516" stroke="rgba(120,214,197,0.35)" />
      <circle cx={C} cy={C} r={30} fill="url(#glowCentre)" />
      <text x={C} y={C + 6} textAnchor="middle" className="corolle__centre">
        {jourCycleCentre != null ? `J${jourCycleCentre}` : '—'}
      </text>

      <defs>
        <radialGradient id="glowCentre" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="rgba(120,214,197,0.28)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  )
}
