import { useNavigate } from 'react-router-dom'
import { RappelCard } from '../components/rappels/RappelCard'
import { useRappels } from '../hooks/useRappels'
import '../styles/rappels.css'

export function Rappels() {
  const navigate = useNavigate()
  const { rappels, chargement, erreur, marquer } = useRappels()

  const maintenant = rappels.filter((r) => r.section === 'maintenant')
  const surveiller = rappels.filter((r) => r.section === 'surveiller')

  return (
    <>
      <button type="button" className="retour" onClick={() => navigate('/')}>
        ‹ Aujourd'hui
      </button>

      <header className="jour-entete">
        <div>
          <p className="eyebrow">Pour toi</p>
          <h1 className="titre titre--xl">Rappels</h1>
        </div>
      </header>

      <p className="texte-dim lune-sous">
        Conseils selon ton humeur, ta phase & tes schémas.
      </p>

      {erreur && <p className="etat etat--erreur">Erreur : {erreur}</p>}

      {chargement ? (
        <p className="etat">Chargement…</p>
      ) : rappels.length === 0 ? (
        <div className="card schemas-vide">
          <p className="schemas-vide__titre">Rien à signaler</p>
          <p className="texte-dim" style={{ fontSize: 14, margin: '8px 0 0' }}>
            Aucun rappel pour aujourd'hui. Continue à noter tes journées : les
            conseils s'affinent avec ton cycle, la lune et tes schémas.
          </p>
        </div>
      ) : (
        <>
          {maintenant.length > 0 && (
            <>
              <p className="section-label">En ce moment</p>
              <div className="rappels-liste">
                {maintenant.map((r) => (
                  <RappelCard key={r.cle} rappel={r} onMarquer={marquer} />
                ))}
              </div>
            </>
          )}

          {surveiller.length > 0 && (
            <>
              <p className="section-label">À surveiller</p>
              <div className="rappels-liste">
                {surveiller.map((r) => (
                  <RappelCard key={r.cle} rappel={r} onMarquer={marquer} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
