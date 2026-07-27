import { useState } from 'react'
import { Timeline } from '../components/journal/Timeline'
import { AjouterEntree } from '../components/journal/AjouterEntree'
import { useJournalJour } from '../hooks/useJournalJour'
import { aujourdhuiISO, decaleJours, libelleEntete } from '../lib/dates'
import '../styles/journal.css'

export function Journal() {
  const [date, setDate] = useState(aujourdhuiISO)
  const { items, types, chargement, erreur, ajouter, supprimer, creerType } =
    useJournalJour(date)

  return (
    <>
      <header className="jour-entete">
        <div>
          <p className="eyebrow">{libelleEntete(date)}</p>
          <h1 className="titre titre--xl">Journal</h1>
        </div>
        <div className="jour-nav">
          <button
            type="button"
            className="lune-nav"
            aria-label="Jour précédent"
            onClick={() => setDate((d) => decaleJours(d, -1))}
          >
            ‹
          </button>
          <button
            type="button"
            className="lune-nav"
            aria-label="Jour suivant"
            onClick={() => setDate((d) => decaleJours(d, 1))}
          >
            ›
          </button>
        </div>
      </header>

      <p className="texte-dim lune-sous">
        La timeline du jour — rêves, repas & ressentis.
      </p>

      {erreur && <p className="etat etat--erreur">Erreur : {erreur}</p>}

      {chargement ? (
        <p className="etat">Chargement…</p>
      ) : (
        <>
          <Timeline items={items} onSupprimer={supprimer} />
          <AjouterEntree types={types} onAjouter={ajouter} onCreerType={creerType} />
        </>
      )}
    </>
  )
}
