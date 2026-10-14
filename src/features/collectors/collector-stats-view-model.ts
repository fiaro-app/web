import type { CollectorPeriodStats } from '@/features/collectors/endpoints';
import { formatCop, formatPercent } from '@/lib/amount';
import { formatBusinessDate } from '@/lib/dates';
import type { FigureTone } from '@/lib/tone';

/** Desempeño de un cobrador listo para pintar en sus indicadores. */
export interface CollectorStatsView {
  /** Período que cubren las cifras ("01/10/2026 – 09/10/2026"). */
  readonly period: string;
  readonly expected: string;
  readonly collected: string;
  readonly effectiveness: string;
  readonly effectivenessTone: FigureTone;
  readonly visits: string;
  readonly overdue: string;
  readonly overdueTone: FigureTone;
}

/** Efectividad desde la que se considera buena (verde) y por debajo de la cual preocupa (rojo). */
const GOOD_EFFECTIVENESS = 0.9;
const LOW_EFFECTIVENESS = 0.6;

function toneOfEffectiveness(ratio: number | null): FigureTone {
  if (ratio === null) return 'neutral';
  if (ratio >= GOOD_EFFECTIVENESS) return 'good';
  return ratio < LOW_EFFECTIVENESS ? 'bad' : 'warning';
}

/** Convierte las métricas de la API en cifras formateadas; sin nada que vencer la efectividad no se inventa (—). */
export function toCollectorStatsView(stats: CollectorPeriodStats): CollectorStatsView {
  return {
    period: `${formatBusinessDate(stats.from)} – ${formatBusinessDate(stats.to)}`,
    expected: formatCop(stats.expectedAmount),
    collected: formatCop(stats.collectedAmount),
    effectiveness: formatPercent(stats.effectiveness),
    effectivenessTone: toneOfEffectiveness(stats.effectiveness),
    visits: String(stats.visitsCount),
    overdue: formatCop(stats.overdueAmount),
    overdueTone: stats.overdueAmount > 0 ? 'bad' : 'good',
  };
}
