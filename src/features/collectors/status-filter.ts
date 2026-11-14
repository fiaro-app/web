import type { MembershipStatus } from '@fiaro-app/contracts';

/** Filtro de estado de «Cobradores», tal como viaja en `?estado=`. */
export type CollectorStatusFilter = 'activos' | 'inactivos' | 'todos';

/** Las píldoras, en el orden en que se muestran. */
export const COLLECTOR_STATUS_FILTERS: readonly CollectorStatusFilter[] = ['activos', 'inactivos', 'todos'];

/** Sin `?estado=` (o con uno desconocido) se ven los activos, que son con los que se trabaja. */
export function parseCollectorStatusParam(value: string | string[] | undefined): CollectorStatusFilter {
  return value === 'inactivos' || value === 'todos' ? value : 'activos';
}

/** El estado que se le pide a la API (`undefined` son todos). */
export function toMembershipStatus(filter: CollectorStatusFilter): MembershipStatus | undefined {
  if (filter === 'todos') return undefined;
  return filter === 'activos' ? 'ACTIVE' : 'INACTIVE';
}
