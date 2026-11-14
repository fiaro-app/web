import { formatCop } from '@/lib/amount';
import { formatInstantTime } from '@/lib/dates';
import type { Tone } from '@/lib/tone';
import type { CollectorsToday, RouteStatus } from '@/features/collectors-today/endpoints';

const STATUS_LABEL: Record<RouteStatus, string> = {
  NOT_STARTED: 'Sin iniciar',
  IN_PROGRESS: 'En ruta',
  FINISHED: 'Terminó',
  NO_ROUTE: 'Sin ruta',
};

const STATUS_TONE: Record<RouteStatus, Tone | 'muted'> = {
  NOT_STARTED: 'warning',
  IN_PROGRESS: 'info',
  FINISHED: 'success',
  NO_ROUTE: 'muted',
};

const SETTLEMENT_LABEL = { PENDING: 'Por revisar', APPROVED: 'Aprobado', REJECTED: 'Rechazado' } as const;

/** Una fila de «Rutas de hoy», ya con el texto que se pinta. */
export interface CollectorTodayRow {
  readonly id: string;
  readonly fullName: string;
  readonly statusLabel: string;
  readonly statusTone: Tone | 'muted';
  /** `2 de 5` visitados. */
  readonly progress: string;
  readonly pending: number;
  /** `$40.000 de $100.000`. */
  readonly collected: string;
  /** Hora de la primera visita, o `—` si aún no empieza. */
  readonly startedAt: string;
  readonly settlement: string;
}

/** Los totales por estado y las filas de «Rutas de hoy». */
export interface CollectorsTodayViewModel {
  readonly summary: string;
  readonly notStarted: number;
  readonly rows: readonly CollectorTodayRow[];
}

function summaryText(counts: CollectorsToday['counts']): string {
  const active = counts.NOT_STARTED + counts.IN_PROGRESS + counts.FINISHED;
  if (active === 0) return 'Ningún cobrador tiene ruta hoy.';
  return `${String(counts.IN_PROGRESS + counts.FINISHED)} de ${String(active)} cobradores ya iniciaron su ruta · ${String(counts.FINISHED)} la terminaron`;
}

/** Convierte lo que responde la API en lo que pinta la sección. */
export function toCollectorsTodayViewModel(today: CollectorsToday): CollectorsTodayViewModel {
  return {
    summary: summaryText(today.counts),
    notStarted: today.counts.NOT_STARTED,
    rows: today.collectors.map((collector) => ({
      id: collector.membershipId,
      fullName: collector.fullName,
      statusLabel: STATUS_LABEL[collector.status],
      statusTone: STATUS_TONE[collector.status],
      progress: `${String(collector.visitedLoans)} de ${String(collector.routeLoans)}`,
      pending: collector.pendingLoans,
      collected: `${formatCop(collector.collectedAmount)} de ${formatCop(collector.expectedAmount)}`,
      startedAt: collector.firstVisitAt === null ? '—' : formatInstantTime(collector.firstVisitAt),
      settlement: collector.settlementStatus === null ? 'Sin enviar' : SETTLEMENT_LABEL[collector.settlementStatus],
    })),
  };
}
