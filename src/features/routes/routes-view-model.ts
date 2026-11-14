import { ROUTES_TEXT } from '@/content/routes';
import type { RouteFilters } from '@/features/routes/route-filters';
import type { RoutesPage } from '@/features/routes/endpoints';
import { formatCop } from '@/lib/amount';
import { formatBusinessDate, formatInstantTime } from '@/lib/dates';
import { pageHref } from '@/lib/pagination';

/** Una fila del registro: lo que hizo un cobrador en un día, lista para pintar. */
export interface RouteRow {
  readonly key: string;
  readonly date: string;
  readonly collectorName: string;
  readonly startedAt: string;
  readonly endedAt: string;
  readonly visits: number;
  readonly paid: number;
  /** «$90.000 de $120.000». */
  readonly collected: string;
  /** Hacia «Cobros del día» filtrado por ese día y ese cobrador. */
  readonly visitsHref: string;
}

export interface RoutesViewModel {
  readonly rows: readonly RouteRow[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly rangeFrom: string;
  readonly rangeTo: string;
}

/** Convierte la página de la API en filas; el enlace lleva a las visitas de ese cobrador ese día. */
export function toRoutesViewModel(page: RoutesPage): RoutesViewModel {
  return {
    rows: page.data.map((route) => ({
      key: `${route.date}|${route.collector.membershipId}`,
      date: formatBusinessDate(route.date),
      collectorName: route.collector.fullName,
      startedAt: formatInstantTime(route.startedAt),
      endedAt: formatInstantTime(route.endedAt),
      visits: route.visitsCount,
      paid: route.paidCount,
      collected: ROUTES_TEXT.collectedOf(formatCop(route.collectedAmount), formatCop(route.expectedAmount)),
      visitsHref: pageHref('/cobros', 1, { desde: route.date, hasta: route.date, cobrador: route.collector.membershipId }),
    })),
    total: page.meta.total,
    page: page.meta.page,
    pageSize: page.meta.pageSize,
    rangeFrom: formatBusinessDate(page.range.from),
    rangeTo: formatBusinessDate(page.range.to),
  };
}

/** Texto del rango que la API resolvió: hoy, un día o un período. */
export function describeRouteRange(view: Pick<RoutesViewModel, 'rangeFrom' | 'rangeTo'>, filters: RouteFilters): string {
  if (filters.from === '') return ROUTES_TEXT.rangeToday(view.rangeFrom);
  return view.rangeFrom === view.rangeTo ? ROUTES_TEXT.rangeDay(view.rangeFrom) : ROUTES_TEXT.range(view.rangeFrom, view.rangeTo);
}
