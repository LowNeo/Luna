// Formatage des nombres en français (virgule décimale)
export function fmtNombre(n: number, decimales = 1): string {
  return n.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimales,
  })
}
