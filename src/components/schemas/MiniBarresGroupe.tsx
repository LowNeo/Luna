import type { BarreGroupe } from '../../lib/schemas'

// Mini graphique en barres pour un schéma : une barre par groupe,
// la barre extrême (celle qui porte la corrélation) est mise en avant.
export function MiniBarresGroupe({ barres }: { barres: BarreGroupe[] }) {
  const valeurs = barres.map((b) => b.valeur)
  const min = Math.min(...valeurs)
  const max = Math.max(...valeurs)
  const etendue = max - min || 1

  return (
    <div className="grp-barres">
      {barres.map((b) => {
        const h = 30 + ((b.valeur - min) / etendue) * 70
        return (
          <div key={b.cle} className="grp-col">
            <div className="grp-piste">
              <span
                className={`grp-barre ${b.extreme ? 'grp-barre--fort' : ''}`}
                style={{ height: `${h}%` }}
              />
            </div>
            <span className={`grp-label ${b.extreme ? 'grp-label--fort' : ''}`}>
              {b.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
