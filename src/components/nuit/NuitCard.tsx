import { useState } from 'react'
import { EnergieBar } from '../moment/EnergieBar'
import type { Nuit, NuitSaisie } from '../../types/nuit'

// Carte « Nuit précédente » : qualité du sommeil, réveils nocturnes, heures.
export function NuitCard({
  nuit,
  onSave,
}: {
  nuit: Nuit | null
  onSave: (saisie: NuitSaisie) => Promise<boolean>
}) {
  const [edition, setEdition] = useState(false)
  const rempli = Boolean(nuit)

  return (
    <section className="card moment nuit">
      <header className="moment__tete">
        <span className="nuit__astre" aria-hidden="true">
          ☾
        </span>
        <h3 className="moment__titre">Nuit précédente</h3>
        <div className="moment__droite">
          {!edition && (
            <button type="button" className="lien-mini" onClick={() => setEdition(true)}>
              {rempli ? 'Modifier' : 'Ajouter'}
            </button>
          )}
        </div>
      </header>

      {edition ? (
        <EditeurNuit
          nuit={nuit}
          onAnnuler={() => setEdition(false)}
          onSave={async (s) => {
            const ok = await onSave(s)
            if (ok) setEdition(false)
            return ok
          }}
        />
      ) : rempli ? (
        <VueNuit nuit={nuit!} />
      ) : (
        <p className="moment__vide">Nuit non renseignée.</p>
      )}
    </section>
  )
}

/* ---------- Affichage ---------- */

function VueNuit({ nuit }: { nuit: Nuit }) {
  const heures =
    nuit.heure_coucher || nuit.heure_reveil
      ? `${nuit.heure_coucher?.slice(0, 5) ?? '—'} → ${nuit.heure_reveil?.slice(0, 5) ?? '—'}`
      : null

  return (
    <dl className="moment__lignes">
      <div className="ligne">
        <dt>Qualité</dt>
        <dd>
          {nuit.qualite != null ? (
            <EnergieBar value={nuit.qualite} />
          ) : (
            <span className="texte-dim">—</span>
          )}
        </dd>
      </div>
      <div className="ligne">
        <dt>Réveils</dt>
        <dd>
          {nuit.reveils_nocturnes != null ? (
            `${nuit.reveils_nocturnes} réveil${nuit.reveils_nocturnes > 1 ? 's' : ''}`
          ) : (
            <span className="texte-dim">—</span>
          )}
        </dd>
      </div>
      {heures && (
        <div className="ligne">
          <dt>Sommeil</dt>
          <dd className="nuit__heures">{heures}</dd>
        </div>
      )}
      {nuit.note && (
        <div className="repas" style={{ marginTop: 4 }}>
          <p className="repas__note">{nuit.note}</p>
        </div>
      )}
    </dl>
  )
}

/* ---------- Édition ---------- */

function EditeurNuit({
  nuit,
  onSave,
  onAnnuler,
}: {
  nuit: Nuit | null
  onSave: (saisie: NuitSaisie) => Promise<boolean>
  onAnnuler: () => void
}) {
  const [qualite, setQualite] = useState<number>(nuit?.qualite ?? 0)
  const [reveils, setReveils] = useState<number>(nuit?.reveils_nocturnes ?? 0)
  const [coucher, setCoucher] = useState<string>(nuit?.heure_coucher?.slice(0, 5) ?? '')
  const [reveil, setReveil] = useState<string>(nuit?.heure_reveil?.slice(0, 5) ?? '')
  const [note, setNote] = useState<string>(nuit?.note ?? '')
  const [enCours, setEnCours] = useState(false)

  async function enregistrer() {
    setEnCours(true)
    await onSave({
      qualite: qualite || null,
      reveils_nocturnes: reveils,
      heure_coucher: coucher || null,
      heure_reveil: reveil || null,
      note: note.trim() || null,
    })
    setEnCours(false)
  }

  return (
    <div className="edit">
      <div className="edit__champ">
        <p className="eyebrow">Qualité du sommeil</p>
        <EnergieBar value={qualite} onChange={setQualite} />
      </div>

      <div className="edit__champ">
        <p className="eyebrow">Réveils nocturnes</p>
        <div className="stepper">
          <button
            type="button"
            className="stepper__btn"
            aria-label="Moins"
            onClick={() => setReveils((n) => Math.max(0, n - 1))}
          >
            −
          </button>
          <span className="stepper__val">{reveils}</span>
          <button
            type="button"
            className="stepper__btn"
            aria-label="Plus"
            onClick={() => setReveils((n) => Math.min(9, n + 1))}
          >
            +
          </button>
        </div>
      </div>

      <div className="nuit__heures-edit">
        <div className="edit__champ">
          <p className="eyebrow">Endormissement</p>
          <input
            type="time"
            className="champ-heure"
            value={coucher}
            onChange={(e) => setCoucher(e.target.value)}
          />
        </div>
        <div className="edit__champ">
          <p className="eyebrow">Réveil</p>
          <input
            type="time"
            className="champ-heure"
            value={reveil}
            onChange={(e) => setReveil(e.target.value)}
          />
        </div>
      </div>

      <div className="edit__champ">
        <p className="eyebrow">Note</p>
        <textarea
          className="champ-texte"
          rows={2}
          placeholder="Nuit hachée, rêve marquant…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="edit__actions">
        <button type="button" className="btn btn--fantome" onClick={onAnnuler}>
          Annuler
        </button>
        <button type="button" className="btn btn--plein" onClick={enregistrer} disabled={enCours}>
          {enCours ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}
