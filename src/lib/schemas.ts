// Moteur d'analyse des schémas récurrents de LUNA.
// À partir des données quotidiennes, cherche des corrélations entre une métrique
// (humeur, confort, énergie, poids) et un regroupement (phase du cycle / de la lune).
//
// La « force » est un indicateur heuristique (écart entre groupes rapporté à
// l'échelle de la métrique), pas une statistique rigoureuse — elle s'affine avec
// le volume de données.

import type { PhaseCycle } from './cycle'
import { infoCycle, LABEL_PHASE } from './cycle'
import { phaseLune } from './lune'
import type { Humeur, Moment, MomentJour } from '../types/journal'

// Nombre minimum de jours par groupe et de groupes pour oser une corrélation
const MIN_N = 2
const MIN_GROUPES = 2

// --- Regroupements ---

export type Quadrant = 'nouvelle' | 'premier' | 'pleine' | 'dernier'

export const ORDRE_QUADRANTS: { cle: Quadrant; label: string; long: string }[] = [
  { cle: 'nouvelle', label: 'N.lune', long: 'nouvelle lune' },
  { cle: 'premier', label: 'P.Q', long: 'premier quartier' },
  { cle: 'pleine', label: 'P.lune', long: 'pleine lune' },
  { cle: 'dernier', label: 'D.Q', long: 'dernier quartier' },
]

export const ORDRE_PHASES: { cle: PhaseCycle; label: string }[] = [
  { cle: 'menstruelle', label: 'Règles' },
  { cle: 'folliculaire', label: 'Follic.' },
  { cle: 'ovulatoire', label: 'Ovul.' },
  { cle: 'luteale', label: 'Lutéale' },
]

export function quadrantLune(fraction: number): Quadrant {
  if (fraction < 0.125 || fraction >= 0.875) return 'nouvelle'
  if (fraction < 0.375) return 'premier'
  if (fraction < 0.625) return 'pleine'
  return 'dernier'
}

// Humeur → score numérique (haut = mieux)
export const SCORE_HUMEUR: Record<Humeur, number> = {
  lumineuse: 5,
  douce: 4,
  sensible: 3,
  agitee: 2,
  basse: 1,
}

// Moyenne des valeurs non nulles (null si aucune)
function moyenne(vals: (number | null)[]): number | null {
  const ok = vals.filter((v): v is number => v != null)
  return ok.length ? ok.reduce((a, b) => a + b, 0) / ok.length : null
}

// Priorité pour l'humeur dominante d'un jour : le soir prime
const PRIORITE_MOMENT: Moment[] = ['soir', 'apres_midi', 'matin']

// Construit une ligne d'analyse par date à partir des données brutes.
// Partagé par l'écran Schémas et l'écran Rappels (source unique de vérité).
export function construitJoursAnalyse(
  dates: string[],
  momentsParDate: Map<string, MomentJour[]>,
  starts: string[],
  poidsParDate: Map<string, number>,
): JourAnalyse[] {
  return dates.map((date) => {
    const moments = momentsParDate.get(date) ?? []
    let scoreHumeur: number | null = null
    for (const mo of PRIORITE_MOMENT) {
      const t = moments.find((x) => x.moment === mo && x.humeur)
      if (t?.humeur) {
        scoreHumeur = SCORE_HUMEUR[t.humeur]
        break
      }
    }
    return {
      date,
      phaseCycle: infoCycle(starts, date).phase,
      quadrant: quadrantLune(phaseLune(date).fraction),
      scoreHumeur,
      confort: moyenne(moments.map((m) => m.confort_niveau)),
      energie: moyenne(moments.map((m) => m.energie)),
      poids: poidsParDate.get(date) ?? null,
    }
  })
}

// --- Données d'entrée : une ligne par jour analysé ---

export interface JourAnalyse {
  date: string
  phaseCycle: PhaseCycle | null
  quadrant: Quadrant
  scoreHumeur: number | null
  confort: number | null
  energie: number | null
  poids: number | null
}

// --- Résultats ---

export interface BarreGroupe {
  cle: string
  label: string
  valeur: number
  n: number
  extreme: boolean
}

export type NiveauCorrelation = 'faible' | 'moderee' | 'forte'

export interface Schema {
  id: string
  titre: string
  description: string
  force: number // 0 → 100
  niveau: NiveauCorrelation
  barres: BarreGroupe[]
}

function niveauDepuisForce(force: number): NiveauCorrelation {
  if (force >= 68) return 'forte'
  if (force >= 40) return 'moderee'
  return 'faible'
}

// Analyse générique : moyenne d'une métrique par groupe + force de l'écart.
function analyse(
  jours: JourAnalyse[],
  cleGroupe: (j: JourAnalyse) => string | null,
  valeur: (j: JourAnalyse) => number | null,
  ordre: { cle: string; label: string }[],
  sens: 'haut' | 'bas',
  echelle: number,
): { barres: BarreGroupe[]; force: number; extreme: BarreGroupe; ecart: number } | null {
  const acc = new Map<string, { somme: number; n: number }>()
  for (const j of jours) {
    const k = cleGroupe(j)
    const v = valeur(j)
    if (k == null || v == null) continue
    const a = acc.get(k) ?? { somme: 0, n: 0 }
    a.somme += v
    a.n += 1
    acc.set(k, a)
  }

  const barres: BarreGroupe[] = ordre
    .filter((o) => (acc.get(o.cle)?.n ?? 0) >= MIN_N)
    .map((o) => {
      const a = acc.get(o.cle)!
      return { cle: o.cle, label: o.label, valeur: a.somme / a.n, n: a.n, extreme: false }
    })

  if (barres.length < MIN_GROUPES) return null

  const valeurs = barres.map((b) => b.valeur)
  const max = Math.max(...valeurs)
  const min = Math.min(...valeurs)
  const cible = sens === 'haut' ? max : min
  let extreme = barres[0]
  for (const b of barres) {
    if (b.valeur === cible) {
      b.extreme = true
      extreme = b
    }
  }
  const ecart = max - min
  const force = Math.min(100, Math.round((ecart / echelle) * 100))
  return { barres, force, extreme, ecart }
}

function longPhase(cle: string): string {
  return LABEL_PHASE[cle as PhaseCycle]?.toLowerCase() ?? cle
}
function longQuadrant(cle: string): string {
  return ORDRE_QUADRANTS.find((q) => q.cle === cle)?.long ?? cle
}

// Construit la liste des schémas détectés, triés par force décroissante.
export function construitSchemas(jours: JourAnalyse[]): Schema[] {
  const out: Schema[] = []

  // Humeur × phase de lune (on cherche le creux)
  const hl = analyse(jours, (j) => j.quadrant, (j) => j.scoreHumeur, ORDRE_QUADRANTS, 'bas', 4)
  if (hl) {
    out.push({
      id: 'humeur-lune',
      titre: 'Humeur & lune',
      description: `Ton humeur tend à être plus basse autour de la ${longQuadrant(hl.extreme.cle)}.`,
      force: hl.force,
      niveau: niveauDepuisForce(hl.force),
      barres: hl.barres,
    })
  }

  // Confort digestif × cycle (on cherche le pic d'inconfort)
  const cc = analyse(jours, (j) => j.phaseCycle, (j) => j.confort, ORDRE_PHASES, 'haut', 5)
  if (cc) {
    out.push({
      id: 'confort-cycle',
      titre: 'Confort digestif & cycle',
      description: `L'inconfort digestif est le plus marqué en phase ${longPhase(cc.extreme.cle)}.`,
      force: cc.force,
      niveau: niveauDepuisForce(cc.force),
      barres: cc.barres,
    })
  }

  // Énergie × cycle (on cherche le pic)
  const ec = analyse(jours, (j) => j.phaseCycle, (j) => j.energie, ORDRE_PHASES, 'haut', 5)
  if (ec) {
    out.push({
      id: 'energie-cycle',
      titre: 'Énergie & cycle',
      description: `Ton énergie est au plus haut en phase ${longPhase(ec.extreme.cle)}.`,
      force: ec.force,
      niveau: niveauDepuisForce(ec.force),
      barres: ec.barres,
    })
  }

  // Poids × cycle
  const pc = analyse(jours, (j) => j.phaseCycle, (j) => j.poids, ORDRE_PHASES, 'haut', 2.5)
  if (pc) {
    const lut = pc.barres.find((b) => b.cle === 'luteale')
    const fol = pc.barres.find((b) => b.cle === 'folliculaire')
    const description =
      lut && fol
        ? `Ton poids varie d'environ ${Math.abs(lut.valeur - fol.valeur).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} kg entre phase folliculaire et lutéale.`
        : `Ton poids est le plus haut en phase ${longPhase(pc.extreme.cle)}.`
    out.push({
      id: 'poids-cycle',
      titre: 'Poids & cycle',
      description,
      force: pc.force,
      niveau: niveauDepuisForce(pc.force),
      barres: pc.barres,
    })
  }

  return out.sort((a, b) => b.force - a.force)
}
