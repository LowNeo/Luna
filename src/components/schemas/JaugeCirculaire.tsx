// Jauge circulaire affichant un pourcentage (force de corrélation).
export function JaugeCirculaire({ pourcent }: { pourcent: number }) {
  const R = 26
  const circonference = 2 * Math.PI * R
  const rempli = (Math.min(100, Math.max(0, pourcent)) / 100) * circonference

  return (
    <svg viewBox="0 0 64 64" className="jauge" role="img" aria-label={`${pourcent} %`}>
      <circle cx="32" cy="32" r={R} fill="none" stroke="var(--line-fort)" strokeWidth="5" />
      <circle
        cx="32"
        cy="32"
        r={R}
        fill="none"
        stroke="var(--teal-clair)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${rempli} ${circonference}`}
        transform="rotate(-90 32 32)"
      />
      <text x="32" y="37" textAnchor="middle" className="jauge__txt">
        {pourcent}%
      </text>
    </svg>
  )
}
