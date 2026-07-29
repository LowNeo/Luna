import type { JourSuivi } from '../../hooks/useMoisSuivi'
import { GROUPES, GROUPE_PAR_CLE } from '../../types/emotions'

// Ruban « Humeurs du mois » : une barre par jour, colorée par le groupe d'émotion
// dominant, suivi d'une légende comptant les jours par groupe.
export function RubanHumeurs({ jours }: { jours: JourSuivi[] }) {
  const comptes = new Map<string, number>()
  for (const j of jours) {
    if (j.groupe) comptes.set(j.groupe, (comptes.get(j.groupe) ?? 0) + 1)
  }
  const presents = GROUPES.filter((g) => comptes.has(g.cle))

  return (
    <div className="card ruban">
      <p className="section-label" style={{ margin: '0 0 12px' }}>
        Humeurs du mois
      </p>

      <div className="ruban__barres">
        {jours.map((j) => {
          const g = j.groupe ? GROUPE_PAR_CLE.get(j.groupe) : undefined
          return (
            <span
              key={j.date}
              className="ruban__barre"
              title={`${j.jour} — ${g?.label ?? 'non noté'}`}
              style={{
                background: g?.couleur ?? 'var(--line)',
                opacity: g ? 1 : 0.5,
              }}
            />
          )
        })}
      </div>

      <div className="ruban__reperes">
        <span>J1</span>
        <span>J{Math.ceil(jours.length / 2)}</span>
        <span>J{jours.length}</span>
      </div>

      {presents.length > 0 ? (
        <div className="ruban__legende">
          {presents.map((g) => (
            <span key={g.cle} className="ruban__item">
              <span className="ruban__pastille" style={{ background: g.couleur }} />
              {g.label} · {comptes.get(g.cle)} j
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
