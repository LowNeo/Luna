import { useState } from 'react'
import { aujourdhuiISO, libelleEntete } from '../../lib/dates'

// Panneau de saisie de l'écran Lune : consigner les règles et la libido du jour.
export function ReglagesLune({
  reglesStarts,
  libidoAujourdhui,
  onAjouterRegle,
  onSupprimerRegle,
  onDefinirLibido,
}: {
  reglesStarts: string[]
  libidoAujourdhui: number
  onAjouterRegle: (iso: string) => Promise<boolean>
  onSupprimerRegle: (iso: string) => Promise<boolean>
  onDefinirLibido: (iso: string, n: number) => Promise<boolean>
}) {
  const [dateRegle, setDateRegle] = useState(aujourdhuiISO)
  const derniers = [...reglesStarts].reverse().slice(0, 4)

  return (
    <div className="card reglages">
      {/* Règles */}
      <div className="reglages__bloc">
        <p className="eyebrow">Mes règles</p>
        <div className="reglages__ligne">
          <input
            type="date"
            className="champ-heure"
            value={dateRegle}
            onChange={(e) => setDateRegle(e.target.value)}
          />
          <button
            type="button"
            className="btn btn--plein"
            onClick={() => onAjouterRegle(dateRegle)}
          >
            Ajouter J1
          </button>
        </div>

        {derniers.length > 0 && (
          <ul className="reglages__liste">
            {derniers.map((iso) => (
              <li key={iso}>
                <span>{libelleEntete(iso)}</span>
                <button
                  type="button"
                  className="lien-mini"
                  onClick={() => onSupprimerRegle(iso)}
                >
                  Retirer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Libido du jour */}
      <div className="reglages__bloc">
        <p className="eyebrow">Libido — aujourd'hui</p>
        <div className="reglages__libido">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`libido-pt ${n <= libidoAujourdhui ? 'libido-pt--on' : ''}`}
              aria-label={`Libido ${n} sur 5`}
              onClick={() =>
                onDefinirLibido(aujourdhuiISO(), libidoAujourdhui === n ? 0 : n)
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
