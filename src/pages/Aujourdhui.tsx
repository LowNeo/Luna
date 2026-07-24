import { useMemo, useState } from 'react'
import { MomentCard } from '../components/moment/MomentCard'
import { MoonBadge } from '../components/MoonBadge'
import { useMomentsJour } from '../hooks/useMomentsJour'
import { aujourdhuiISO, libelleEntete } from '../lib/dates'
import { phaseLune } from '../lib/lune'
import { MOMENTS } from '../types/journal'
import '../styles/aujourdhui.css'

export function Aujourdhui() {
  // Pour l'instant on reste sur la date du jour (navigation à venir).
  const [date] = useState(aujourdhuiISO)
  const { momentPour, chargement, erreur, enregistrer } = useMomentsJour(date)

  const phase = useMemo(() => phaseLune(date), [date])

  return (
    <>
      <header className="jour-entete">
        <div>
          <p className="eyebrow">{libelleEntete(date)}</p>
          <h1 className="titre titre--xl">Aujourd'hui</h1>
        </div>
        <MoonBadge phase={phase} />
      </header>

      {/* Conseil du jour — statique pour l'instant, alimenté plus tard
          par la détection de schémas. */}
      <button type="button" className="card conseil">
        <div>
          <p className="eyebrow eyebrow--teal">Conseil · {phase.nom}</p>
          <p className="conseil__texte">
            Note tes trois moments pour affiner tes schémas au fil des jours.
          </p>
        </div>
        <span className="conseil__fleche">›</span>
      </button>

      <p className="section-label">Au fil de la journée</p>

      {erreur && (
        <p className="etat etat--erreur">
          Impossible de charger la journée : {erreur}
        </p>
      )}

      {chargement ? (
        <p className="etat">Chargement…</p>
      ) : (
        <div className="jour-moments">
          {MOMENTS.map((m) => (
            <MomentCard
              key={m}
              moment={m}
              data={momentPour(m)}
              onSave={(saisie) => enregistrer(m, saisie)}
            />
          ))}
        </div>
      )}
    </>
  )
}
