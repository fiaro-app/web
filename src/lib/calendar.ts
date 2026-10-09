/**
 * Utilidades del calendario del selector de fechas. Todo trabaja con fechas ISO `AAAA-MM-DD` y
 * aritmética en UTC, así el día no se corre por la zona horaria del navegador.
 */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Letras de los días, de lunes a domingo (como en Colombia). */
export const WEEKDAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const;

const MONTH_FORMAT = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const DAY_FORMAT = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Fecha ISO a objeto `Date` en UTC; `null` si no es una fecha de calendario real (p. ej. `2026-02-30`). */
export function parseIsoDate(value: string): Date | null {
  const match = ISO_DATE.exec(value);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  const sameDay = date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return sameDay ? date : null;
}

/** `Date` en UTC a `AAAA-MM-DD`. */
export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Suma (o resta) días a una fecha ISO. */
export function addDays(value: string, days: number): string {
  const date = parseIsoDate(value) ?? new Date(0);
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date);
}

/** Suma (o resta) meses conservando el día; si el mes destino es más corto, queda su último día. */
export function addMonths(value: string, months: number): string {
  const date = parseIsoDate(value) ?? new Date(0);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return toIsoDate(date);
}

/** Primer día (`AAAA-MM-01`) del mes de una fecha. */
export function startOfMonth(value: string): string {
  return `${value.slice(0, 7)}-01`;
}

/**
 * Las seis semanas (42 días) que pinta el calendario de un mes, empezando en lunes. Incluye los días
 * del mes anterior y del siguiente que completan la primera y la última fila.
 */
export function monthGrid(monthStart: string): readonly string[] {
  const first = parseIsoDate(startOfMonth(monthStart)) ?? new Date(0);
  const offset = (first.getUTCDay() + 6) % 7; // lunes = 0
  const start = toIsoDate(first);
  return Array.from({ length: 42 }, (_, index) => addDays(start, index - offset));
}

/** «octubre de 2026». */
export function monthLabel(value: string): string {
  const date = parseIsoDate(value);
  return date ? MONTH_FORMAT.format(date) : '';
}

/** «9 de octubre de 2026», para el nombre accesible de un día. */
export function dayLabel(value: string): string {
  const date = parseIsoDate(value);
  return date ? DAY_FORMAT.format(date) : '';
}

/** `2026-10-09` → `09/10/2026`; vacío si no es una fecha válida. */
export function formatDisplayDate(value: string): string {
  if (!parseIsoDate(value)) return '';
  return `${value.slice(8, 10)}/${value.slice(5, 7)}/${value.slice(0, 4)}`;
}
