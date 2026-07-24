import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MomentCard } from '../components/moment/MomentCard'
import { MoonBadge } from '../components/MoonBadge'
import { useMomentsJour } from '../hooks/useMomentsJour'
import { aujourdhuiISO, libelleEntete } from '../lib/dates'
import { phaseLune } from '../lib/lune'
import { MOMENTS } from '../types/journal'
import '../styles/aujourdhui.css'

export function Aujourdhui() {
  const navigate = useNavigate()
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

      {/* Accès aux rappels du jour (conseils générés selon phase & schémas) */}
      <button
        type="button"
        className="card conseil"
        onClick={() => navigate('/rappels')}
      >
        <div>
          <p className="eyebrow eyebrow--teal">Pour toi · {phase.nom}</p>
          <p className="conseil__texte">Vois tes rappels du jour</p>
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
