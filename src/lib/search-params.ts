import { IdSchema, boundedDateRange, type DateRangeLimits } from '@fiaro-app/contracts';

/** Parámetros de búsqueda de una página, tal como los entrega Next. */
export type SearchParams = Readonly<Record<string, string | string[] | undefined>>;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** El valor de un parámetro; vacío si falta o viene repetido. */
export function singleParam(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value : '';
}

/** ¿Es una fecha de calendario real (`2026-02-30` no lo es)? */
export function isCalendarDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/** Un id (UUID) tal cual viene en la URL, o vacío si no lo es: así la URL nunca produce una consulta que la API rechace. */
export function idParam(value: string | string[] | undefined): string {
  const text = singleParam(value);
  return IdSchema.safeParse(text).success ? text : '';
}

/**
 * Cuántos días puede abarcar el período de cada pantalla: los mismos topes de la API (D-117). El
 * reporte de cobros recorre una fila por visita, por eso es más corto.
 */
export const DATE_RANGE_LIMITS = {
  visits: { maxDays: 93 },
  history: { maxDays: 366 },
} as const satisfies Record<string, DateRangeLimits>;

/**
 * Período de `?desde=&hasta=`. Con una sola fecha válida se usa para ambas (un solo día). El rango
 * debe estar en orden, no pasar de hoy y no ser más largo que `limits`: si algo no cuadra devuelve
 * el período vacío (`''`), así la URL nunca produce una consulta que la API rechace.
 */
export function dateRangeParams(
  params: SearchParams,
  limits: DateRangeLimits = DATE_RANGE_LIMITS.history,
): { readonly from: string; readonly to: string } {
  const rawFrom = singleParam(params.desde);
  const rawTo = singleParam(params.hasta);
  const validTo = isCalendarDate(rawTo) ? rawTo : '';
  const from = isCalendarDate(rawFrom) ? rawFrom : validTo;
  const to = validTo === '' ? from : validTo;
  return from !== '' && boundedDateRange(limits).safeParse({ from, to }).success ? { from, to } : { from: '', to: '' };
}
