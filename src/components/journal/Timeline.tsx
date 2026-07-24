import type { CSSProperties } from 'react'
import type { ItemTimeline } from '../../hooks/useJournalJour'
import { COULEUR_TYPE_ENTREE } from '../../types/journalEntree'

// Timeline verticale du jour : chaque élément a une heure, un titre et un texte.
// Les rêves sont mis en avant dans une carte dédiée (+ badge « récurrent »).
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
        Rien dans le journal ce jour-là. Ajoute un réveil, un rêve, un ressenti…
      </p>
    )
  }

  return (
    <div className="timeline">
      {items.map((it) => (
        <article key={it.cle} className="tl-item">
          <span className="tl-heure">{it.heure ?? ''}</span>
          <div
            className="tl-content"
            style={{ '--pt': COULEUR_TYPE_ENTREE[it.type] } as CSSProperties}
          >
            <div className="tl-tete">
              <h3 className="tl-titre">{it.titre}</h3>
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

            {it.type === 'reve' ? (
              <div className="reve-card">
                {it.recurrent && <span className="reve-badge">récurrent</span>}
                <p className="reve-texte">{it.texte}</p>
              </div>
            ) : (
              it.texte && (
                <p className={`tl-texte ${it.type === 'repas' ? 'tl-texte--italique' : ''}`}>
                  {it.texte}
                </p>
              )
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
