import { useMemo, useState } from 'react'
import { Corolle } from '../components/lune/Corolle'
import { RubanHumeurs } from '../components/lune/RubanHumeurs'
import { ReglagesLune } from '../components/lune/ReglagesLune'
import { MoonBadge } from '../components/MoonBadge'
import { useMoisSuivi } from '../hooks/useMoisSuivi'
import { aujourdhuiISO, nomMois } from '../lib/dates'
import { phaseLune } from '../lib/lune'
import '../styles/lune.css'

export function Lune() {
  const maintenant = new Date()
  const [annee, setAnnee] = useState(maintenant.getFullYear())
  const [mois0, setMois0] = useState(maintenant.getMonth())

  const {
    jours,
    reglesStarts,
    longueurCycle,
    chargement,
    erreur,
    ajouterRegle,
    supprimerRegle,
    definirLibido,
  } = useMoisSuivi(annee, mois0)

  const auj = aujourdhuiISO()
  const indexCourant = jours.findIndex((j) => j.date === auj)
  const jourCentre = indexCourant >= 0 ? jours[indexCourant] : jours[jours.length - 1]
  const libidoAuj = indexCourant >= 0 ? jours[indexCourant].libido : 0

  // Lune affichée dans l'en-tête : celle du jour courant (ou du milieu du mois)
  const luneEntete = useMemo(
    () => phaseLune(jourCentre?.date ?? auj),
    [jourCentre?.date, auj],
  )

  function changerMois(delta: number) {
    const d = new Date(annee, mois0 + delta, 1)
    setAnnee(d.getFullYear())
    setMois0(d.getMonth())
  }

  return (
    <>
      <header className="jour-entete">
        <div>
          <p className="eyebrow">{annee}</p>
          <div className="lune-titre">
            <button
              type="button"
              className="lune-nav"
              aria-label="Mois précédent"
              onClick={() => changerMois(-1)}
            >
              ‹
            </button>
            <h1 className="titre titre--xl">{nomMois(mois0)}</h1>
            <button
              type="button"
              className="lune-nav"
              aria-label="Mois suivant"
              onClick={() => changerMois(1)}
            >
              ›
            </button>
          </div>
        </div>
        <MoonBadge phase={luneEntete} />
      </header>

      <p className="texte-dim lune-sous">
        La corolle du mois — cycle, lune, libido & humeur.
      </p>

      {erreur && <p className="etat etat--erreur">Erreur : {erreur}</p>}

      {chargement ? (
        <p className="etat">Chargement…</p>
      ) : (
        <>
          <Corolle
            jours={jours}
            indexCourant={indexCourant}
            jourCycleCentre={jourCentre?.cycle.jourCycle ?? null}
          />

          <p className="lune-cycle-info">
            {reglesStarts.length > 0
              ? `Cycle moyen estimé · ${longueurCycle} jours`
              : 'Renseigne tes règles ci-dessous pour révéler les phases.'}
          </p>

          {/* Légende de la corolle */}
          <div className="card legende">
            <p className="legende__item">
              <span className="legende__trait" />
              pétale · longueur = libido, couleur = phase
            </p>
            <p className="legende__item">
              <span className="legende__lune" />
              couronne ext. · lune
            </p>
            <p className="legende__item">
              <span className="legende__ruban" />
              ruban ci-dessous · récap des humeurs
            </p>
          </div>

          <RubanHumeurs jours={jours} />

          <p className="section-label">Saisie</p>
          <ReglagesLune
            reglesStarts={reglesStarts}
            libidoAujourdhui={libidoAuj}
            onAjouterRegle={ajouterRegle}
            onSupprimerRegle={supprimerRegle}
            onDefinirLibido={definirLibido}
          />
        </>
      )}
    </>
  )
}
