/**
 * Número de página a partir del parámetro `?pagina=` de la URL. Cualquier valor que no sea un
 * entero positivo (texto, negativos, decimales, repetidos) cae en la primera página.
 */
export function parsePageParam(value: string | string[] | undefined): number {
  if (typeof value !== 'string' || !/^\d{1,6}$/.test(value)) return 1;
  const page = Number(value);
  return page >= 1 ? page : 1;
}

/** Longitud máxima de un texto de búsqueda en la URL. */
export const MAX_SEARCH_LENGTH = 80;

/**
 * Texto de búsqueda a partir del parámetro `?q=`: sin espacios sobrantes y acotado. Un valor
 * ausente o repetido es una búsqueda vacía.
 */
export function parseSearchParam(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value.trim().slice(0, MAX_SEARCH_LENGTH) : '';
}

/** Dirección de una página de un listado, conservando la búsqueda activa. */
export function pageHref(path: string, page: number, search = ''): string {
  const params = new URLSearchParams();
  if (page > 1) params.set('pagina', String(page));
  if (search !== '') params.set('q', search);
  const query = params.toString();
  return query === '' ? path : `${path}?${query}`;
}
