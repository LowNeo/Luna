// Calcul (approché) de la phase de lune pour une date donnée.
// Sert à afficher l'icône et le libellé de lune (ex. « gibbeuse ↑ »).
// Base : approximation du cycle synodique moyen.

import { depuisISO } from './dates'

const CYCLE_SYNODIQUE = 29.530588853 // durée moyenne d'une lunaison (jours)
// Nouvelle lune de référence : 6 janvier 2000, 18h14 UTC
const REF_NOUVELLE_LUNE = Date.UTC(2000, 0, 6, 18, 14)

export interface PhaseLune {
  age: number // jours écoulés depuis la dernière nouvelle lune (0 → ~29,5)
  illumination: number // fraction éclairée, 0 → 1
  nom: string // ex. « Gibbeuse »
  croissante: boolean // true si la lune croît (avant la pleine lune)
  fraction: number // position dans le cycle, 0 → 1
}

export function phaseLune(iso: string): PhaseLune {
  const d = depuisISO(iso)
  const jours = (d.getTime() - REF_NOUVELLE_LUNE) / 86_400_000
  let age = jours % CYCLE_SYNODIQUE
  if (age < 0) age += CYCLE_SYNODIQUE

  const fraction = age / CYCLE_SYNODIQUE
  const illumination = (1 - Math.cos(2 * Math.PI * fraction)) / 2
  const croissante = fraction < 0.5

  return { age, illumination, croissante, fraction, nom: nommePhase(fraction) }
}

function nommePhase(fraction: number): string {
  if (fraction < 0.03 || fraction > 0.97) return 'Nouvelle lune'
  if (fraction < 0.22) return 'Premier croissant'
  if (fraction < 0.28) return 'Premier quartier'
  if (fraction < 0.47) return 'Gibbeuse'
  if (fraction < 0.53) return 'Pleine lune'
  if (fraction < 0.72) return 'Gibbeuse'
  if (fraction < 0.78) return 'Dernier quartier'
  return 'Dernier croissant'
}

// Libellé court pour l'en-tête, ex. « gibbeuse ↑ »
export function libelleLuneCourt(p: PhaseLune): string {
  const base = p.nom.toLowerCase()
  if (base === 'nouvelle lune' || base === 'pleine lune') return base
  return `${base} ${p.croissante ? '↑' : '↓'}`
}
