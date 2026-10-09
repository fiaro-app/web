import { IdSchema } from '@fiaro-app/contracts';

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
 * Período de `?desde=&hasta=`. Con una sola fecha válida se usa para ambas (un solo día); el rango
 * debe estar en orden. Si algo no cuadra devuelve el período vacío (`''`).
 */
export function dateRangeParams(params: SearchParams): { readonly from: string; readonly to: string } {
  const rawFrom = singleParam(params.desde);
  const rawTo = singleParam(params.hasta);
  const from = isCalendarDate(rawFrom) ? rawFrom : isCalendarDate(rawTo) ? rawTo : '';
  const to = isCalendarDate(rawTo) ? rawTo : from;
  return from !== '' && from <= to ? { from, to } : { from: '', to: '' };
}
