import { SchemaCard } from '../components/schemas/SchemaCard'
import { StatTile } from '../components/schemas/StatTile'
import { useSchemas } from '../hooks/useSchemas'
import '../styles/schemas.css'

export function Schemas() {
  const { schemas, stats, chargement, erreur } = useSchemas()

  return (
    <>
      <header className="jour-entete">
        <div>
          <p className="eyebrow">{stats.joursNotes} jours de données</p>
          <h1 className="titre titre--xl">Tes schémas</h1>
        </div>
      </header>

      <p className="texte-dim lune-sous">Les corrélations détectées pour toi.</p>

      {erreur && <p className="etat etat--erreur">Erreur : {erreur}</p>}

      {chargement ? (
        <p className="etat">Analyse…</p>
      ) : schemas.length === 0 ? (
        <div className="card schemas-vide">
          <p className="schemas-vide__titre">Pas encore de schéma</p>
          <p className="texte-dim" style={{ fontSize: 14, margin: '8px 0 0' }}>
            Continue à noter tes journées, ton cycle et ton corps. LUNA révèle tes
            corrélations dès qu'il y a assez de données — compte plusieurs semaines
            pour des tendances fiables.
          </p>
        </div>
      ) : (
        <div className="schemas-liste">
          {schemas.map((s, i) => (
            <SchemaCard key={s.id} schema={s} enAvant={i === 0} />
          ))}
        </div>
      )}

      {/* Repères chiffrés */}
      {(stats.cycleMoyen != null || stats.joursNotes > 0) && (
        <div className="stats-grille">
          {stats.cycleMoyen != null && (
            <StatTile valeur={`${stats.cycleMoyen} j`} label="cycle moyen estimé" />
          )}
          <StatTile valeur={`${stats.joursNotes}`} label={`jours notés · ${stats.fenetre} j`} />
        </div>
      )}
    </>
  )
}
