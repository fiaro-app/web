/** Máximo de dígitos aceptados: mantiene el monto dentro de `Number.MAX_SAFE_INTEGER`. */
const MAX_AMOUNT_DIGITS = 15;

const amountFormatter = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

/**
 * Convierte el texto que escribe el usuario en un monto entero, ignorando todo lo que no sea
 * dígito (separadores de miles, símbolo de moneda, espacios). Devuelve `null` si no hay dígitos.
 *
 * @example
 * parseAmount('$ 1.250.000') // 1250000
 * parseAmount('abc')         // null
 */
export function parseAmount(raw: string): number | null {
  const digits = raw.replaceAll(/\D/g, '').slice(0, MAX_AMOUNT_DIGITS);
  return digits === '' ? null : Number(digits);
}

/**
 * Formatea un monto entero con separador de miles de es-CO; `null` se muestra vacío para que
 * el campo pueda enseñar su placeholder.
 *
 * @example
 * formatAmount(1250000) // '1.250.000'
 * formatAmount(null)    // ''
 */
export function formatAmount(value: number | null): string {
  return value === null ? '' : amountFormatter.format(value);
}

/**
 * Pesos colombianos para mostrar: `$` y separador de miles de es-CO. Acepta valores negativos
 * (`-$5.000`).
 *
 * @example
 * formatCop(18400000) // '$18.400.000'
 */
export function formatCop(value: number): string {
  return value < 0 ? `-$${amountFormatter.format(-value)}` : `$${amountFormatter.format(value)}`;
}

/**
 * Una proporción (0.85) como porcentaje entero para mostrar ("85 %"); `—` cuando no hay dato
 * (`null`), para no mostrar un 0 % que parecería un resultado.
 */
export function formatPercent(ratio: number | null): string {
  return ratio === null ? '—' : `${String(Math.round(ratio * 100))} %`;
}

const MILLION = 1_000_000;

/**
 * Pesos en formato compacto para indicadores grandes: desde un millón, en millones con un decimal
 * (`$18.4M`); por debajo, el valor completo (`$850.000`). Evita que una cifra enorme desborde su
 * tarjeta; el valor exacto se muestra en otro lugar (tablas, detalle).
 *
 * @example
 * formatCopCompact(18400000)    // '$18.4M'
 * formatCopCompact(3000000)     // '$3M'
 * formatCopCompact(1234000000)  // '$1.234M'
 */
export function formatCopCompact(value: number): string {
  if (Math.abs(value) < MILLION) return formatCop(value);
  const millions = Math.round((value / MILLION) * 10) / 10;
  const text = millions >= 1000 || millions <= -1000 ? amountFormatter.format(millions) : String(millions);
  return `${value < 0 ? '-' : ''}$${text.replace(/^-/, '')}M`;
}
