import { useState } from 'react'
import type {
  Humeur,
  Moment,
  MomentJour,
  MomentSaisie,
} from '../../types/journal'
import { LABEL_MOMENT, LABEL_REPAS } from '../../types/journal'
import { HumeurChip } from './HumeurChip'
import { EnergieBar } from './EnergieBar'
import { ConfortScale } from './ConfortScale'

// Carte d'un moment de la journée (matin / après-midi / soir).
// Bascule entre affichage et édition ; enregistre via onSave.
export function MomentCard({
  moment,
  data,
  onSave,
}: {
  moment: Moment
  data: MomentJour | undefined
  onSave: (saisie: MomentSaisie) => Promise<boolean>
}) {
  const [edition, setEdition] = useState(false)
  const rempli = Boolean(data)

  return (
    <section className="card moment">
      <header className="moment__tete">
        <span className={`moment__pastille ${rempli ? 'moment__pastille--on' : ''}`} />
        <h3 className="moment__titre">{LABEL_MOMENT[moment]}</h3>
        <div className="moment__droite">
          {data?.heure && !edition && (
            <span className="moment__heure">{data.heure.slice(0, 5)}</span>
          )}
          {!rempli && !edition && <span className="moment__attente">à venir</span>}
          {!edition && (
            <button
              type="button"
              className="lien-mini"
              onClick={() => setEdition(true)}
            >
              {rempli ? 'Modifier' : 'Ajouter'}
            </button>
          )}
        </div>
      </header>

      {edition ? (
        <EditeurMoment
          moment={moment}
          data={data}
          onAnnuler={() => setEdition(false)}
          onSave={async (saisie) => {
            const ok = await onSave(saisie)
            if (ok) setEdition(false)
            return ok
          }}
        />
      ) : rempli ? (
        <VueMoment moment={moment} data={data!} />
      ) : (
        <p className="moment__vide">Rien de noté pour ce moment.</p>
      )}
    </section>
  )
}

/* ---------- Affichage (lecture seule) ---------- */

function VueMoment({ moment, data }: { moment: Moment; data: MomentJour }) {
  return (
    <>
      <dl className="moment__lignes">
        <div className="ligne">
          <dt>Humeur</dt>
          <dd>
            <HumeurChip value={data.humeur} />
          </dd>
        </div>
        <div className="ligne">
          <dt>Énergie</dt>
          <dd>
            <EnergieBar value={data.energie} />
          </dd>
        </div>
        <div className="ligne">
          <dt>Confort</dt>
          <dd>
            <ConfortScale niveau={data.confort_niveau} label={data.confort_label} />
          </dd>
        </div>
      </dl>

      {data.repas_note && (
        <div className="repas">
          <p className="eyebrow">{LABEL_REPAS[moment]}</p>
          <p className="repas__note">{data.repas_note}</p>
        </div>
      )}

      {data.repas_remarque && (
        <div className="repas repas--remarque">
          <p className="eyebrow">Remarque</p>
          <p className="repas__note">{data.repas_remarque}</p>
        </div>
      )}
    </>
  )
}

/* ---------- Édition ---------- */

function EditeurMoment({
  moment,
  data,
  onSave,
  onAnnuler,
}: {
  moment: Moment
  data: MomentJour | undefined
  onSave: (saisie: MomentSaisie) => Promise<boolean>
  onAnnuler: () => void
}) {
  const [humeur, setHumeur] = useState<Humeur | null>(data?.humeur ?? null)
  const [energie, setEnergie] = useState<number>(data?.energie ?? 0)
  const [confortNiveau, setConfortNiveau] = useState<number>(data?.confort_niveau ?? 0)
  const [confortLabel, setConfortLabel] = useState<string | null>(
    data?.confort_label ?? null,
  )
  const [repas, setRepas] = useState<string>(data?.repas_note ?? '')
  const [remarque, setRemarque] = useState<string>(data?.repas_remarque ?? '')
  const [heure, setHeure] = useState<string>(data?.heure?.slice(0, 5) ?? '')
  const [enCours, setEnCours] = useState(false)

  async function enregistrer() {
    setEnCours(true)
    await onSave({
      humeur,
      energie: energie || null,
      confort_niveau: confortNiveau || null,
      confort_label: confortLabel,
      repas_note: repas.trim() || null,
      repas_remarque: remarque.trim() || null,
      heure: heure || null,
    })
    setEnCours(false)
  }

  return (
    <div className="edit">
      <div className="edit__champ">
        <p className="eyebrow">Humeur</p>
        <HumeurChip value={humeur} onChange={setHumeur} />
      </div>

      <div className="edit__champ">
        <p className="eyebrow">Énergie</p>
        <EnergieBar value={energie} onChange={setEnergie} />
      </div>

      <div className="edit__champ">
        <p className="eyebrow">Confort digestif</p>
        <ConfortScale
          niveau={confortNiveau}
          label={confortLabel}
          onChange={(n, l) => {
            setConfortNiveau(n)
            setConfortLabel(l)
          }}
        />
      </div>

      <div className="edit__champ">
        <p className="eyebrow">{LABEL_REPAS[moment]}</p>
        <textarea
          className="champ-texte"
          rows={2}
          placeholder="Ce que tu as mangé…"
          value={repas}
          onChange={(e) => setRepas(e.target.value)}
        />
      </div>

      <div className="edit__champ">
        <p className="eyebrow">Remarque sur le repas</p>
        <textarea
          className="champ-texte"
          rows={2}
          placeholder="Un ressenti, une observation (ex. un peu lourd après)…"
          value={remarque}
          onChange={(e) => setRemarque(e.target.value)}
        />
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

      <div className="edit__actions">
        <button type="button" className="btn btn--fantome" onClick={onAnnuler}>
          Annuler
        </button>
        <button
          type="button"
          className="btn btn--plein"
          onClick={enregistrer}
          disabled={enCours}
        >
          {enCours ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}
