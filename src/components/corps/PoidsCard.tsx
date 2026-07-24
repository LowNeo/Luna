import type { PointPoids, Variation } from '../../hooks/useMesuresCorps'
import { libelleJourMois } from '../../lib/dates'
import { fmtNombre } from '../../lib/format'
import { DeltaBadge } from './DeltaBadge'

// Carte du poids : valeur actuelle, variation sur 7 jours, mini-courbe en barres.
export function PoidsCard({
  serie,
  actuel,
  variation,
}: {
  serie: PointPoids[]
  actuel: PointPoids | null
  variation: Variation | null
}) {
  // On affiche au plus les 8 dernières pesées
  const recents = serie.slice(-8)

  return (
    <section className="card poids">
      <div className="poids__tete">
        <p className="eyebrow">Poids</p>
        {variation && (
          <DeltaBadge delta={variation.delta} suffixe={`${variation.jours} j`} />
        )}
      </div>

      {actuel ? (
        <>
          <p className="poids__valeur">
            {fmtNombre(actuel.valeur)} <span>kg</span>
          </p>

          <MiniBarres points={recents} />

          {recents.length >= 2 && (
            <div className="poids__dates">
              <span>{libelleJourMois(recents[0].date)}</span>
              <span>{libelleJourMois(recents.at(-1)!.date)}</span>
            </div>
          )}
        </>
      ) : (
        <p className="texte-dim" style={{ margin: '12px 0 0', fontSize: 14 }}>
          Ajoute ta première pesée ci-dessous.
        </p>
      )}
    </section>
  )
}

// Mini graphique en barres, hauteur normalisée sur la plage min→max.
function MiniBarres({ points }: { points: PointPoids[] }) {
  if (points.length === 0) return null
  const valeurs = points.map((p) => p.valeur)
  const min = Math.min(...valeurs)
  const max = Math.max(...valeurs)
  const etendue = max - min || 1

  return (
    <div className="poids__barres">
      {points.map((p) => {
        // hauteur entre 28% et 100%
        const h = 28 + ((p.valeur - min) / etendue) * 72
        return (
          <span
            key={p.date}
            className="poids__barre"
            style={{ height: `${h}%` }}
            title={`${libelleJourMois(p.date)} · ${fmtNombre(p.valeur)} kg`}
          />
        )
      })}
    </div>
  )
}
