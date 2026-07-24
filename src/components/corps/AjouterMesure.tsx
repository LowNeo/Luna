import { useState } from 'react'
import { aujourdhuiISO } from '../../lib/dates'
import { MENSURATIONS } from '../../types/corps'
import type { MesureSaisie } from '../../types/corps'

// Formulaire d'ajout / mise à jour d'une mesure datée (poids + mensurations).
// Tous les champs sont optionnels : on n'enregistre que ce qui est rempli.
export function AjouterMesure({
  onEnregistrer,
}: {
  onEnregistrer: (date: string, saisie: MesureSaisie) => Promise<boolean>
}) {
  const [ouvert, setOuvert] = useState(false)
  const [date, setDate] = useState(aujourdhuiISO)
  const [poids, setPoids] = useState('')
  const [mens, setMens] = useState<Record<string, string>>({})
  const [enCours, setEnCours] = useState(false)

  function reinit() {
    setPoids('')
    setMens({})
    setDate(aujourdhuiISO())
  }

  // Transforme une saisie texte en nombre (virgule ou point) ou null
  function nombreOuNull(txt: string): number | null {
    const t = txt.trim().replace(',', '.')
    if (t === '') return null
    const n = Number(t)
    return Number.isNaN(n) ? null : n
  }

  async function enregistrer() {
    const saisie: MesureSaisie = {}
    const p = nombreOuNull(poids)
    if (p != null) saisie.poids = p
    for (const m of MENSURATIONS) {
      const v = nombreOuNull(mens[m.champ] ?? '')
      if (v != null) saisie[m.champ] = v
    }
    // Rien de rempli → on ne fait rien
    if (Object.keys(saisie).length === 0) {
      setOuvert(false)
      return
    }
    setEnCours(true)
    const ok = await onEnregistrer(date, saisie)
    setEnCours(false)
    if (ok) {
      reinit()
      setOuvert(false)
    }
  }

  if (!ouvert) {
    return (
      <button type="button" className="btn btn--plein ajouter-mesure" onClick={() => setOuvert(true)}>
        + Ajouter une mesure
      </button>
    )
  }

  return (
    <div className="card form-mesure">
      <div className="edit__champ">
        <p className="eyebrow">Date</p>
        <input
          type="date"
          className="champ-heure"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="edit__champ">
        <p className="eyebrow">Poids (kg)</p>
        <input
          type="text"
          inputMode="decimal"
          className="champ-heure"
          placeholder="ex. 61,2"
          value={poids}
          onChange={(e) => setPoids(e.target.value)}
        />
      </div>

      {MENSURATIONS.map((m) => (
        <div className="edit__champ" key={m.champ}>
          <p className="eyebrow">{m.label} (cm)</p>
          <input
            type="text"
            inputMode="decimal"
            className="champ-heure"
            placeholder="—"
            value={mens[m.champ] ?? ''}
            onChange={(e) => setMens((prev) => ({ ...prev, [m.champ]: e.target.value }))}
          />
        </div>
      ))}

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
        <button type="button" className="btn btn--plein" onClick={enregistrer} disabled={enCours}>
          {enCours ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}
