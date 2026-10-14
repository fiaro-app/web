/** Valor de `?filtro=` que pide solo las no leídas. */
export const UNREAD_FILTER = 'no-leidas';

/** `true` si `?filtro=` pide solo las no leídas; cualquier otro valor equivale a "todas". */
export function parseUnreadFilter(value: string | string[] | undefined): boolean {
  return value === UNREAD_FILTER;
}
