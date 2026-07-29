import { GROUPE_PAR_CLE, GROUPES } from '../../types/emotions'

const MAX_GROUPES = 2
const MAX_NUANCES = 5

// Sélecteur d'humeur en deux temps : 1 à 2 groupes, puis jusqu'à 5 nuances.
export function HumeurSelecteur({
  groupes,
  nuances,
  onChange,
}: {
  groupes: string[]
  nuances: string[]
  onChange: (groupes: string[], nuances: string[]) => void
}) {
  function toggleGroupe(cle: string) {
    if (groupes.includes(cle)) {
      // on retire le groupe et ses nuances
      const g = GROUPE_PAR_CLE.get(cle)
      onChange(
        groupes.filter((c) => c !== cle),
        nuances.filter((n) => !g?.nuances.includes(n)),
      )
    } else if (groupes.length < MAX_GROUPES) {
      onChange([...groupes, cle], nuances)
    }
  }

  function toggleNuance(n: string) {
    if (nuances.includes(n)) {
      onChange(groupes, nuances.filter((x) => x !== n))
    } else if (nuances.length < MAX_NUANCES) {
      onChange(groupes, [...nuances, n])
    }
  }

  const complet = nuances.length >= MAX_NUANCES

  return (
    <div className="humeur-sel">
      <div className="humeur-compte">
        {groupes.length}/{MAX_GROUPES} groupes · {nuances.length}/{MAX_NUANCES} nuances
      </div>

      {/* Étape 1 : groupes */}
      <div className="humeur-groupes">
        {GROUPES.map((g) => {
          const on = groupes.includes(g.cle)
          return (
            <button
              key={g.cle}
              type="button"
              className={`humeur-grp ${on ? 'on' : ''}`}
              style={on ? { borderColor: g.couleur, color: g.couleur } : undefined}
              onClick={() => toggleGroupe(g.cle)}
            >
              <span className="humeur-pastille" style={{ background: g.couleur }} />
              {g.label}
            </button>
          )
        })}
      </div>

      {/* Étape 2 : nuances des groupes choisis */}
      {groupes.map((cle) => {
        const g = GROUPE_PAR_CLE.get(cle)
        if (!g) return null
        return (
          <div className="humeur-nuances" key={cle}>
            <p className="humeur-nuances__titre" style={{ color: g.couleur }}>
              {g.label}
            </p>
            <div className="humeur-chips">
              {g.nuances.map((n) => {
                const on = nuances.includes(n)
                const bloque = complet && !on
                return (
                  <button
                    key={n}
                    type="button"
                    className={`humeur-chip ${on ? 'on' : ''}`}
                    style={on ? { borderColor: g.couleur, color: g.couleur } : undefined}
                    disabled={bloque}
                    onClick={() => toggleNuance(n)}
                  >
                    {n}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
