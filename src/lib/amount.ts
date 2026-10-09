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
