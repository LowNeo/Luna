// Générateur de rappels (conseils) de LUNA.
// Combine la prévision du cycle, celle de la lune et les schémas détectés pour
// proposer des conseils doux et actionnables. Ce sont des suggestions de
// bien-être, pas des conseils médicaux.

import type { InfoCycle } from './cycle'
import type { Quadrant, Schema } from './schemas'

export type SectionRappel = 'maintenant' | 'surveiller'

export interface Rappel {
  cle: string
  section: SectionRappel
  contexte: string // libellé en capitales (eyebrow)
  titre: string
  texte: string
  action: boolean // affiche « Noté / Plus tard »
}

export interface EntreeRappels {
  date: string
  cycle: InfoCycle
  joursAvantRegles: number | null
  quadrant: Quadrant
  joursAvantNouvelle: number
  soirsTendus: number // nb de soirs « agitée » / « basse » sur 7 jours
  schemas: Schema[]
}

function schemaPresent(schemas: Schema[], id: string): Schema | undefined {
  return schemas.find((s) => s.id === id && s.niveau !== 'faible')
}

export function genererRappels(e: EntreeRappels): Rappel[] {
  const out: Rappel[] = []
  const d = e.date

  // --- EN CE MOMENT ---

  // SPM / phase lutéale imminente
  if (e.joursAvantRegles != null && e.joursAvantRegles >= 1 && e.joursAvantRegles <= 6) {
    out.push({
      cle: `spm-${d}`,
      section: 'maintenant',
      contexte: `Phase lutéale · dans ${e.joursAvantRegles} j`,
      titre: 'Le SPM approche',
      texte: 'Pense au magnésium et lève le pied sur le café cette semaine.',
      action: true,
    })
  }

  // Fenêtre ovulatoire : énergie au plus haut
  if (e.cycle.phase === 'ovulatoire') {
    out.push({
      cle: `ovulation-${d}`,
      section: 'maintenant',
      contexte: 'Phase ovulatoire',
      titre: "Fenêtre d'énergie",
      texte: 'Énergie souvent au plus haut — bon jour pour un effort intense.',
      action: true,
    })
  }

  // Soirées tendues récentes
  if (e.soirsTendus >= 3) {
    out.push({
      cle: `soirees-${d}`,
      section: 'maintenant',
      contexte: `Schéma · ${e.soirsTendus} soirs tendus`,
      titre: 'Apaise tes soirées',
      texte:
        "Une tisane camomille-mélisse et moins d'écran avant le coucher pourraient aider.",
      action: true,
    })
  }

  // --- À SURVEILLER ---

  // Humeur plus basse autour de la nouvelle lune
  const humeurLune = schemaPresent(e.schemas, 'humeur-lune')
  if (humeurLune) {
    out.push({
      cle: `humeur-lune-${d}`,
      section: 'surveiller',
      contexte: `Humeur · nouvelle lune dans ${e.joursAvantNouvelle} j`,
      titre: 'Période plus sensible',
      texte: `${humeurLune.description} Prévois des moments doux.`,
      action: false,
    })
  }

  // Confort digestif en 2e moitié de cycle
  const confortCycle = schemaPresent(e.schemas, 'confort-cycle')
  if (confortCycle) {
    out.push({
      cle: `confort-${d}`,
      section: 'surveiller',
      contexte: 'Confort · 2e moitié de cycle',
      titre: 'Allège les dîners',
      texte: `${confortCycle.description} Des repas légers le soir peuvent soulager.`,
      action: false,
    })
  }

  return out
}
