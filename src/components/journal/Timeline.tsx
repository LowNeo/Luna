import type { CSSProperties } from 'react'
import type { ItemTimeline } from '../../hooks/useJournalJour'

// Timeline verticale du jour : chaque élément a une heure, un type et ses champs.
export function Timeline({
  items,
  onSupprimer,
}: {
  items: ItemTimeline[]
  onSupprimer: (id: string) => void
}) {
  if (items.length === 0) {
    return (
      <p className="etat">
        Rien dans le journal ce jour-là. Ajoute une activité, une collation, une
        sieste…
      </p>
    )
  }

  return (
    <div className="timeline">
      {items.map((it) => (
        <article key={it.cle} className="tl-item">
          <span className="tl-heure">{it.heure ?? ''}</span>
          <div className="tl-content" style={{ ['--pt']: it.couleur } as CSSProperties}>
            <div className="tl-tete">
              <h3 className="tl-titre">{it.typeLabel}</h3>
              {it.source === 'moment' && <span className="tl-tag">repas du jour</span>}
              {it.source === 'journal' && it.id && (
                <button
                  type="button"
                  className="tl-suppr"
                  aria-label="Supprimer cette entrée"
                  onClick={() => onSupprimer(it.id!)}
                >
                  ✕
                </button>
              )}
            </div>

            {it.champs.length > 0 && (
              <ul className="tl-champs">
                {it.champs.map((c, i) => (
                  <li key={i} className={c.label ? '' : 'tl-champs__libre'}>
                    {c.label && <span className="tl-k">{c.label}</span>}
                    {c.valeur}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
