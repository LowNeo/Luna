// Écran générique « à venir » pour les tranches non encore construites.
export function EcranEnAttente({
  eyebrow,
  titre,
  sousTitre,
}: {
  eyebrow: string
  titre: string
  sousTitre: string
}) {
  return (
    <>
      <header className="jour-entete">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="titre titre--xl">{titre}</h1>
        </div>
      </header>
      <p className="texte-dim" style={{ marginTop: 4, fontSize: 14.5 }}>
        {sousTitre}
      </p>
      <div className="card" style={{ marginTop: 24, padding: 24, textAlign: 'center' }}>
        <p className="texte-dim" style={{ margin: 0 }}>
          Cet écran arrive dans une prochaine tranche. ✧
        </p>
      </div>
    </>
  )
}
