import { EnergieBar } from '../moment/EnergieBar'
import type { ChampDef } from '../../types/journalTypes'

// Rend le bon contrôle de saisie selon la nature d'un champ.
export function ChampDynamique({
  champ,
  valeur,
  onChange,
}: {
  champ: ChampDef
  valeur: unknown
  onChange: (v: unknown) => void
}) {
  switch (champ.kind) {
    case 'zone':
      return (
        <textarea
          className="champ-texte"
          rows={2}
          value={(valeur as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )

    case 'nombre':
      return (
        <div className="champ-nombre">
          <input
            type="number"
            inputMode="numeric"
            className="champ-heure"
            value={valeur == null ? '' : String(valeur)}
            onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          />
          {champ.unite && <span className="champ-unite">{champ.unite}</span>}
        </div>
      )

    case 'echelle':
      return <EnergieBar value={(valeur as number) ?? 0} onChange={(n) => onChange(n)} />

    case 'booleen':
      return (
        <label className="case-recurrent">
          <input
            type="checkbox"
            checked={Boolean(valeur)}
            onChange={(e) => onChange(e.target.checked)}
          />
          Oui
        </label>
      )

    default: // texte
      return (
        <input
          type="text"
          className="champ-heure"
          value={(valeur as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )
  }
}
