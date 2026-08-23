/**
 * Versandkosten-Staffel nach Gewicht/Bestellwert. Platzhalterwerte — mit den
 * echten Zahlen in app/versand/page.tsx synchron halten, sobald final.
 */
export function calculateShipping(subtotal: number, totalWeightGrams: number): number {
  if (subtotal >= 60) return 0;
  if (totalWeightGrams <= 1000) return 4.95;
  if (totalWeightGrams <= 5000) return 6.95;
  return 9.95;
}
