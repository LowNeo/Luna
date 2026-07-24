// Petite tuile de statistique (valeur + libellé).
export function StatTile({ valeur, label }: { valeur: string; label: string }) {
  return (
    <div className="card stat-tile">
      <p className="stat-tile__valeur">{valeur}</p>
      <p className="stat-tile__label">{label}</p>
    </div>
  )
}
