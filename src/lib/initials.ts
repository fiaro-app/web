/**
 * Saca las iniciales de un nombre para mostrarlas en un `Avatar`: la primera letra de las dos
 * primeras palabras, en mayúscula. Un nombre vacío da una cadena vacía.
 *
 * @example
 * getInitials('Marta Gómez')       // 'MG'
 * getInitials('  juan  pablo  r.') // 'JP'
 * getInitials('Fiaro')             // 'F'
 */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}
