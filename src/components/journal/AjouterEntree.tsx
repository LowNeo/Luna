import { useState } from 'react'
import { heureMaintenant } from '../../lib/dates'
import type { EntreeSaisie, TypeEntree } from '../../types/journalEntree'
import { LABEL_TYPE_ENTREE, TYPES_SAISIE } from '../../types/journalEntree'

// Formulaire d'ajout d'une entrée libre à la timeline.
export function AjouterEntree({
  onAjouter,
}: {
  onAjouter: (saisie: EntreeSaisie) => Promise<boolean>
}) {
  const [ouvert, setOuvert] = useState(false)
  const [type, setType] = useState<TypeEntree>('note')
  const [heure, setHeure] = useState(heureMaintenant)
  const [texte, setTexte] = useState('')
  const [recurrent, setRecurrent] = useState(false)
  const [enCours, setEnCours] = useState(false)

  function reinit() {
    setType('note')
    setHeure(heureMaintenant())
    setTexte('')
    setRecurrent(false)
  }

  async function enregistrer() {
    if (texte.trim() === '') return
    setEnCours(true)
    const ok = await onAjouter({
      type,
      heure: heure || null,
      titre: null, // libellé par défaut selon le type
      texte: texte.trim(),
      recurrent: type === 'reve' ? recurrent : false,
    })
    setEnCours(false)
    if (ok) {
      reinit()
      setOuvert(false)
    }
  }

  if (!ouvert) {
    return (
      <button
        type="button"
        className="btn btn--plein ajouter-mesure"
        onClick={() => setOuvert(true)}
      >
        + Ajouter au journal
      </button>
    )
  }

  return (
    <div className="card form-mesure">
      <div className="edit__champ">
        <p className="eyebrow">Type</p>
        <div className="chips">
          {TYPES_SAISIE.map((t) => (
            <button
              key={t}
              type="button"
              className={`chip ${type === t ? 'chip--actif' : ''}`}
              onClick={() => setType(t)}
            >
              {LABEL_TYPE_ENTREE[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="edit__champ edit__champ--heure">
        <p className="eyebrow">Heure</p>
        <input
          type="time"
          className="champ-heure"
          value={heure}
          onChange={(e) => setHeure(e.target.value)}
        />
      </div>

      <div className="edit__champ">
        <p className="eyebrow">Note</p>
        <textarea
          className="champ-texte"
          rows={3}
          placeholder="Ce que tu veux garder de ce moment…"
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
        />
      </div>

      {type === 'reve' && (
        <label className="case-recurrent">
          <input
            type="checkbox"
            checked={recurrent}
            onChange={(e) => setRecurrent(e.target.checked)}
          />
          Rêve récurrent
        </label>
      )}

      <div className="edit__actions">
        <button
          type="button"
          className="btn btn--fantome"
          onClick={() => {
            reinit()
            setOuvert(false)
          }}
        >
          Annuler
        </button>
        <button
          type="button"
          className="btn btn--plein"
          onClick={enregistrer}
          disabled={enCours || texte.trim() === ''}
        >
          {enCours ? 'Ajout…' : 'Ajouter'}
        </button>
      </div>
    </div>
  )
}
