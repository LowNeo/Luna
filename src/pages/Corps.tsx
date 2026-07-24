import { useNavigate } from 'react-router-dom'
import { PoidsCard } from '../components/corps/PoidsCard'
import { MensurationsList } from '../components/corps/MensurationsList'
import { AjouterMesure } from '../components/corps/AjouterMesure'
import { useMesuresCorps } from '../hooks/useMesuresCorps'
import '../styles/corps.css'

export function Corps() {
  const navigate = useNavigate()
  const {
    chargement,
    erreur,
    enregistrer,
    seriePoids,
    poidsActuel,
    variationPoids,
    mensurations,
  } = useMesuresCorps()

  return (
    <>
      <button type="button" className="retour" onClick={() => navigate(-1)}>
        ‹ Profil
      </button>

      <header className="jour-entete">
        <div>
          <p className="eyebrow">Suivi</p>
          <h1 className="titre titre--xl">Corps</h1>
        </div>
      </header>

      {erreur && <p className="etat etat--erreur">Erreur : {erreur}</p>}

      {chargement ? (
        <p className="etat">Chargement…</p>
      ) : (
        <>
          <PoidsCard serie={seriePoids} actuel={poidsActuel} variation={variationPoids} />

          <p className="section-label">Mensurations</p>
          <MensurationsList lignes={mensurations} />

          {/* Lien avec le cycle — statique pour l'instant, deviendra une vraie
              corrélation quand la détection de schémas sera en place. */}
          <div className="card relier-cycle">
            <p className="eyebrow eyebrow--teal">À relier au cycle</p>
            <p className="relier-cycle__texte">
              Le poids peut monter d'environ 1 kg en phase lutéale — souvent de la
              rétention d'eau, pas de la masse. LUNA affinera ce lien quand tu auras
              plusieurs cycles de données.
            </p>
          </div>

          <AjouterMesure onEnregistrer={enregistrer} />
        </>
      )}
    </>
  )
}
