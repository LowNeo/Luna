import { useState } from 'react'
import { ChampDynamique } from './ChampDynamique'
import { NouveauType } from './NouveauType'
import { heureMaintenant } from '../../lib/dates'
import type { EntreeSaisie } from '../../types/journalEntree'
import type { ChampDef, TypeJournal } from '../../types/journalTypes'

type Etape = 'ferme' | 'type' | 'form' | 'nouveau'

// Ajout d'une entrée : choix du type → formulaire dynamique.
// Permet aussi de définir un nouveau type.
export function AjouterEntree({
  types,
  onAjouter,
  onCreerType,
}: {
  types: TypeJournal[]
  onAjouter: (saisie: EntreeSaisie) => Promise<boolean>
  onCreerType: (label: string, champs: ChampDef[]) => Promise<boolean>
}) {
  const [etape, setEtape] = useState<Etape>('ferme')
  const [type, setType] = useState<TypeJournal | null>(null)
  const [heure, setHeure] = useState(heureMaintenant)
  const [valeurs, setValeurs] = useState<Record<string, unknown>>({})
  const [enCours, setEnCours] = useState(false)

  function choisirType(t: TypeJournal) {
    setType(t)
    setValeurs({})
    setHeure(heureMaintenant())
    setEtape('form')
  }

  function fermer() {
    setEtape('ferme')
    setType(null)
    setValeurs({})
  }

  async function enregistrer() {
    if (!type) return
    setEnCours(true)
    const ok = await onAjouter({ type: type.cle, heure: heure || null, donnees: valeurs })
    setEnCours(false)
    if (ok) fermer()
  }

  // Bouton fermé
  if (etape === 'ferme') {
    return (
      <button
        type="button"
        className="btn btn--plein ajouter-mesure"
        onClick={() => setEtape('type')}
      >
        + Ajouter au journal
      </button>
    )
  }

  // Création d'un nouveau type
  if (etape === 'nouveau') {
    return (
      <NouveauType
        onCreer={onCreerType}
        onAnnuler={() => setEtape('type')}
      />
    )
  }

  // Choix du type
  if (etape === 'type') {
    return (
      <div className="card form-mesure">
        <p className="eyebrow">Quel type d'entrée ?</p>
        <div className="type-grille">
          {types.map((t) => (
            <button
              key={t.cle}
              type="button"
              className="type-btn"
              onClick={() => choisirType(t)}
            >
              <span className="type-pastille" style={{ background: t.couleur }} />
              {t.label}
            </button>
          ))}
          <button
            type="button"
            className="type-btn type-btn--nouveau"
            onClick={() => setEtape('nouveau')}
          >
            + Nouveau type
          </button>
        </div>
        <div className="edit__actions">
          <button type="button" className="btn btn--fantome" onClick={fermer}>
            Annuler
          </button>
        </div>
      </div>
    )
  }

  // Formulaire dynamique du type choisi
  return (
    <div className="card form-mesure">
      <p className="eyebrow">
        <span className="type-pastille" style={{ background: type!.couleur }} />
        {type!.label}
      </p>

      <div className="edit__champ edit__champ--heure">
        <p className="eyebrow">Heure</p>
        <input
          type="time"
          className="champ-heure"
          value={heure}
          onChange={(e) => setHeure(e.target.value)}
        />
      </div>

      {type!.champs.map((champ) => (
        <div className="edit__champ" key={champ.cle}>
          <p className="eyebrow">{champ.label}</p>
          <ChampDynamique
            champ={champ}
            valeur={valeurs[champ.cle]}
            onChange={(v) => setValeurs((prev) => ({ ...prev, [champ.cle]: v }))}
          />
        </div>
      ))}

      <div className="edit__actions">
        <button type="button" className="btn btn--fantome" onClick={() => setEtape('type')}>
          Retour
        </button>
        <button
          type="button"
          className="btn btn--plein"
          onClick={enregistrer}
          disabled={enCours}
        >
          {enCours ? 'Ajout…' : 'Ajouter'}
        </button>
      </div>
    </div>
  )
}
