import { ACCOUNT_TEXT } from '@/content/account';
import type { AccountSession } from '@/features/account/endpoints';
import { formatInstantDate } from '@/lib/dates';

/** Una sesión lista para mostrar en la lista de «Mi cuenta». */
export interface SessionRow {
  readonly id: string;
  /** «Chrome en Windows». */
  readonly device: string;
  /** Es la sesión de este navegador: no se puede cerrar desde aquí. */
  readonly isCurrent: boolean;
  /** «IP 190.1.2.3 · Último uso 09/10/2026». */
  readonly detail: string;
}

/** Convierte las sesiones de la API en filas: la actual primero y luego la usada más recientemente. */
export function toSessionRows(sessions: readonly AccountSession[]): SessionRow[] {
  return [...sessions]
    .sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent) || b.lastUsedAt.localeCompare(a.lastUsedAt))
    .map((session) => ({
      id: session.id,
      device: session.device.label,
      isCurrent: session.isCurrent,
      detail: ACCOUNT_TEXT.sessions.detail(session.ipAddress, formatInstantDate(session.lastUsedAt)),
    }));
}
