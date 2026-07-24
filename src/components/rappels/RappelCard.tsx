import type { Rappel } from '../../lib/rappels'

// Carte d'un rappel : contexte, titre, texte, et actions optionnelles.
export function RappelCard({
  rappel,
  onMarquer,
}: {
  rappel: Rappel
  onMarquer: (cle: string, etat: 'note' | 'plus_tard') => void
}) {
  return (
    <section className="card rappel">
      <p className="eyebrow eyebrow--teal">{rappel.contexte}</p>
      <h3 className="rappel__titre">{rappel.titre}</h3>
      <p className="rappel__texte">{rappel.texte}</p>

      {rappel.action && (
        <div className="rappel__actions">
          <button
            type="button"
            className="btn btn--plein rappel__btn"
            onClick={() => onMarquer(rappel.cle, 'note')}
          >
            Noté
          </button>
          <button
            type="button"
            className="btn btn--fantome rappel__btn"
            onClick={() => onMarquer(rappel.cle, 'plus_tard')}
          >
            Plus tard
          </button>
        </div>
      )}
    </section>
  )
}
