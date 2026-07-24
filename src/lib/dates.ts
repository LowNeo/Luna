// Utilitaires de date en français

// Renvoie la date du jour au format AAAA-MM-JJ (heure locale)
export function aujourdhuiISO(): string {
  return versISO(new Date())
}

// Convertit un Date en chaîne AAAA-MM-JJ (locale, sans décalage UTC)
export function versISO(d: Date): string {
  const an = d.getFullYear()
  const mois = String(d.getMonth() + 1).padStart(2, '0')
  const jour = String(d.getDate()).padStart(2, '0')
  return `${an}-${mois}-${jour}`
}

// Convertit AAAA-MM-JJ en Date locale (midi pour éviter les effets de fuseau)
export function depuisISO(iso: string): Date {
  const [an, mois, jour] = iso.split('-').map(Number)
  return new Date(an, mois - 1, jour, 12)
}

// Ex. « MER. 22 JUIN » (en capitales, pour l'en-tête)
export function libelleEntete(iso: string): string {
  const d = depuisISO(iso)
  const txt = d.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  })
  return txt.toUpperCase().replace(/\./g, '.')
}

// Décale une date ISO de n jours
export function decaleJours(iso: string, n: number): string {
  const d = depuisISO(iso)
  d.setDate(d.getDate() + n)
  return versISO(d)
}

// Nombre de jours entre deux dates ISO (b - a, en jours entiers)
export function diffJours(isoA: string, isoB: string): number {
  const ms = depuisISO(isoB).getTime() - depuisISO(isoA).getTime()
  return Math.round(ms / 86_400_000)
}

// Toutes les dates ISO d'un mois donné (mois0 = 0 pour janvier)
export function joursDansMois(annee: number, mois0: number): string[] {
  const n = new Date(annee, mois0 + 1, 0).getDate()
  return Array.from({ length: n }, (_, i) => versISO(new Date(annee, mois0, i + 1)))
}

const NOMS_MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

// Nom du mois (mois0 = 0 pour janvier)
export function nomMois(mois0: number): string {
  return NOMS_MOIS[mois0]
}

// Libellé court « 30 mai », « 22 juin » (sans point)
export function libelleJourMois(iso: string): string {
  return depuisISO(iso)
    .toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    .replace('.', '')
}
