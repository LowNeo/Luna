import type { Variation } from '../../hooks/useMesuresCorps'
import type { ChampMensuration } from '../../types/corps'
import { fmtNombre } from '../../lib/format'
import { DeltaBadge } from './DeltaBadge'

interface LigneMensuration {
  champ: ChampMensuration
  label: string
  valeur: number | null
  variation: Variation | null
}

// Liste des mensurations : libellé, dernière valeur (cm) et variation.
export function MensurationsList({ lignes }: { lignes: LigneMensuration[] }) {
  return (
    <div className="card mens">
      {lignes.map((l) => (
        <div key={l.champ} className="mens__ligne">
          <span className="mens__nom">{l.label}</span>
          <span className="mens__valeur">
            {l.valeur != null ? (
              <>
                {fmtNombre(l.valeur)} <em>cm</em>
              </>
            ) : (
              <span className="texte-dim">—</span>
            )}
          </span>
          <DeltaBadge delta={l.variation?.delta ?? null} />
        </div>
      ))}
    </div>
  )
}
