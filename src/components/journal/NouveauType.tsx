import { useState } from 'react'
import type { ChampDef, KindChamp } from '../../types/journalTypes'
import { LABEL_KIND, slug } from '../../types/journalTypes'

interface Ligne {
  label: string
  kind: KindChamp
  unite: string
}

const KINDS: KindChamp[] = ['texte', 'zone', 'nombre', 'echelle', 'booleen', 'chrono']

// Formulaire de création d'un type personnalisé (nom + champs).
export function NouveauType({
  onCreer,
  onAnnuler,
}: {
  onCreer: (label: string, champs: ChampDef[]) => Promise<boolean>
  onAnnuler: () => void
}) {
  const [label, setLabel] = useState('')
  const [lignes, setLignes] = useState<Ligne[]>([{ label: '', kind: 'texte', unite: '' }])
  const [enCours, setEnCours] = useState(false)

  function majLigne(i: number, patch: Partial<Ligne>) {
    setLignes((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)))
  }

  async function creer() {
    if (label.trim() === '') return
    // On ne garde que les champs nommés
    const champs: ChampDef[] = lignes
      .filter((l) => l.label.trim() !== '')
      .map((l) => ({
        cle: slug(l.label),
        label: l.label.trim(),
        kind: l.kind,
        ...(l.kind === 'nombre' && l.unite.trim() ? { unite: l.unite.trim() } : {}),
      }))

    setEnCours(true)
    const ok = await onCreer(label, champs)
    setEnCours(false)
    if (ok) onAnnuler()
  }

  return (
    <div className="card form-mesure">
      <div className="edit__champ">
        <p className="eyebrow">Nom du type</p>
        <input
          type="text"
          className="champ-heure"
          placeholder="ex. Migraine, Prise de poids…"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>

      <div className="edit__champ">
        <p className="eyebrow">Champs à renseigner</p>
        <div className="type-champs">
          {lignes.map((l, i) => (
            <div className="type-champ" key={i}>
              <input
                type="text"
                className="champ-heure"
                placeholder="Nom du champ"
                value={l.label}
                onChange={(e) => majLigne(i, { label: e.target.value })}
              />
              <select
                className="champ-heure"
                value={l.kind}
                onChange={(e) => majLigne(i, { kind: e.target.value as KindChamp })}
              >
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {LABEL_KIND[k]}
                  </option>
                ))}
              </select>
              {lignes.length > 1 && (
                <button
                  type="button"
                  className="lien-mini"
                  aria-label="Retirer ce champ"
                  onClick={() => setLignes((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="lien-mini"
          onClick={() =>
            setLignes((prev) => [...prev, { label: '', kind: 'texte', unite: '' }])
          }
        >
          + Ajouter un champ
        </button>
        <p className="texte-dim" style={{ fontSize: 12, margin: '8px 0 0' }}>
          L'heure est demandée automatiquement pour chaque type.
        </p>
      </div>

      <div className="edit__actions">
        <button type="button" className="btn btn--fantome" onClick={onAnnuler}>
          Annuler
        </button>
        <button
          type="button"
          className="btn btn--plein"
          onClick={creer}
          disabled={enCours || label.trim() === ''}
        >
          {enCours ? 'Création…' : 'Créer le type'}
        </button>
      </div>
    </div>
  )
}
