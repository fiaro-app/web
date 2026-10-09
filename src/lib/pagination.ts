/**
 * Número de página a partir del parámetro `?pagina=` de la URL. Cualquier valor que no sea un
 * entero positivo (texto, negativos, decimales, repetidos) cae en la primera página.
 */
export function parsePageParam(value: string | string[] | undefined): number {
  if (typeof value !== 'string' || !/^\d{1,6}$/.test(value)) return 1;
  const page = Number(value);
  return page >= 1 ? page : 1;
}
