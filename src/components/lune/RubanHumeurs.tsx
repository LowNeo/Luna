import type { JourSuivi } from '../../hooks/useMoisSuivi'
import { COULEUR_HUMEUR, HUMEURS, LABEL_HUMEUR } from '../../types/journal'

// Ruban « Humeurs du mois » : une barre par jour, colorée par l'humeur dominante,
// suivi d'une légende comptant les jours par humeur.
export function RubanHumeurs({ jours }: { jours: JourSuivi[] }) {
  // Comptage des jours par humeur
  const comptes = new Map<string, number>()
  for (const j of jours) {
    if (j.humeur) comptes.set(j.humeur, (comptes.get(j.humeur) ?? 0) + 1)
  }
  const presentes = HUMEURS.filter((h) => comptes.has(h))

  return (
    <div className="card ruban">
      <p className="section-label" style={{ margin: '0 0 12px' }}>
        Humeurs du mois
      </p>

      <div className="ruban__barres">
        {jours.map((j) => (
          <span
            key={j.date}
            className="ruban__barre"
            title={`${j.jour} — ${j.humeur ? LABEL_HUMEUR[j.humeur] : 'non noté'}`}
            style={{
              background: j.humeur ? COULEUR_HUMEUR[j.humeur] : 'var(--line)',
              opacity: j.humeur ? 1 : 0.5,
            }}
          />
        ))}
      </div>

      <div className="ruban__reperes">
        <span>J1</span>
        <span>J{Math.ceil(jours.length / 2)}</span>
        <span>J{jours.length}</span>
      </div>

      {presentes.length > 0 ? (
        <div className="ruban__legende">
          {presentes.map((h) => (
            <span key={h} className="ruban__item">
              <span className="ruban__pastille" style={{ background: COULEUR_HUMEUR[h] }} />
              {LABEL_HUMEUR[h]} · {comptes.get(h)} j
            </span>
          ))}
        </div>
      ) : (
        <p className="texte-dim" style={{ fontSize: 13, margin: '12px 0 0' }}>
          Aucune humeur notée ce mois-ci — remplis tes journées dans l'onglet Jour.
        </p>
      )}
    </div>
  )
}
