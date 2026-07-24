import type { NiveauCorrelation, Schema } from '../../lib/schemas'
import { JaugeCirculaire } from './JaugeCirculaire'
import { MiniBarresGroupe } from './MiniBarresGroupe'

const LABEL_NIVEAU: Record<NiveauCorrelation, string> = {
  faible: 'Corrélation faible',
  moderee: 'Corrélation modérée',
  forte: 'Corrélation forte',
}

// Carte d'un schéma détecté. `enAvant` = mise en avant (jauge + fond teinté)
// pour la corrélation la plus forte.
export function SchemaCard({ schema, enAvant }: { schema: Schema; enAvant?: boolean }) {
  return (
    <section className={`card schema ${enAvant ? 'schema--avant' : ''}`}>
      <div className="schema__haut">
        {enAvant ? (
          <JaugeCirculaire pourcent={schema.force} />
        ) : (
          <span className="schema__pct">{schema.force}%</span>
        )}
        <div>
          <p className="eyebrow eyebrow--teal">{LABEL_NIVEAU[schema.niveau]}</p>
          <h3 className="schema__titre">{schema.titre}</h3>
        </div>
      </div>

      <p className="schema__desc">{schema.description}</p>

      <MiniBarresGroupe barres={schema.barres} />
    </section>
  )
}
