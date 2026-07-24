// Calcul du jour de cycle et de la phase menstruelle à partir des débuts de règles.
// Approche standard : phase lutéale ≈ 14 jours fixes avant les règles suivantes,
// donc l'ovulation tombe autour de (longueur du cycle − 14).

import { diffJours } from './dates'

export type PhaseCycle = 'menstruelle' | 'folliculaire' | 'ovulatoire' | 'luteale'

export interface InfoCycle {
  jourCycle: number | null // J1, J2… ; null si aucune règle connue avant la date
  phase: PhaseCycle | null
  longueurCycle: number // longueur moyenne estimée (jours)
}

// Libellés d'affichage des phases
export const LABEL_PHASE: Record<PhaseCycle, string> = {
  menstruelle: 'Menstruelle',
  folliculaire: 'Folliculaire',
  ovulatoire: 'Ovulatoire',
  luteale: 'Lutéale',
}

// Couleurs des phases (pour les pétales de la corolle)
export const COULEUR_PHASE: Record<PhaseCycle, string> = {
  menstruelle: '#cf7d7d',
  folliculaire: '#86c08f',
  ovulatoire: '#74d6c5',
  luteale: '#a89adf',
}

const DUREE_REGLES = 5 // durée moyenne des règles (jours)

// Longueur moyenne du cycle à partir de l'historique des débuts de règles.
export function longueurMoyenne(startsTries: string[], defaut = 28): number {
  if (startsTries.length < 2) return defaut
  const ecarts: number[] = []
  for (let i = 1; i < startsTries.length; i++) {
    ecarts.push(diffJours(startsTries[i - 1], startsTries[i]))
  }
  const moy = ecarts.reduce((a, b) => a + b, 0) / ecarts.length
  return Math.round(moy)
}

// Info de cycle pour une date, à partir des débuts de règles (triés croissants).
export function infoCycle(startsTries: string[], iso: string): InfoCycle {
  const longueur = longueurMoyenne(startsTries)
  const passes = startsTries.filter((s) => s <= iso)
  if (passes.length === 0) {
    return { jourCycle: null, phase: null, longueurCycle: longueur }
  }
  const dernier = passes[passes.length - 1]
  const jourCycle = diffJours(dernier, iso) + 1 // J1 = jour du début des règles
  return { jourCycle, phase: phasePour(jourCycle, longueur), longueurCycle: longueur }
}

function phasePour(j: number, longueur: number): PhaseCycle {
  const ovulation = longueur - 14
  if (j <= DUREE_REGLES) return 'menstruelle'
  if (j < ovulation - 1) return 'folliculaire'
  if (j <= ovulation + 1) return 'ovulatoire'
  return 'luteale'
}
