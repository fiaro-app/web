import { EMPTY_LOOKUP, NO_PORTFOLIO, effectivenessTone, type SettlementLookup } from '@/features/dashboard/dashboard-view-model';
import type { LenderStats } from '@/features/stats/endpoints';
import { formatCop, formatCopCompact, formatPercent } from '@/lib/amount';
import { formatBusinessDate } from '@/lib/dates';
import { pointsTrend, relativeTrend, type Trend } from '@/lib/trend';
import type { FigureTone } from '@/lib/tone';

/** Desde qué proporción de cartera en mora el número deja de ser sano (ámbar) o preocupante (grana). */
export const ARREARS_RATE_WARNING_FROM = 0.1;
export const ARREARS_RATE_BAD_FROM = 0.2;

const BUCKET_LABELS: Record<LenderStats['arrearsByAge'][number]['label'], string> = {
  '0-7': '0–7 días',
  '8-15': '8–15 días',
  '16-30': '16–30 días',
  '30+': 'Más de 30 días',
};

export interface StatsKpi {
  readonly id: 'portfolio' | 'atRisk' | 'arrearsRate' | 'collected' | 'effectiveness';
  readonly label: string;
  readonly value: string;
  readonly tone: FigureTone;
  /** Cambio frente al período anterior; `null` si no hay con qué comparar. */
  readonly trend: Trend | null;
}

export interface ArrearsBucketView {
  readonly label: string;
  readonly amount: string;
  readonly clients: string;
  /** Ancho de la barra respecto al tramo más grande (0–100). */
  readonly barPercent: number;
}

export interface TopArrearsView {
  readonly clientId: string;
  readonly name: string;
  readonly days: string;
  readonly amount: string;
}

export interface CollectorPerformanceView {
  readonly collectorId: string;
  readonly name: string;
  readonly portfolioName: string;
  readonly effectiveness: string;
  readonly effectivenessTone: FigureTone;
  readonly overdue: string;
}

export interface StatsViewModel {
  /** "01/10/2026 – 09/10/2026". */
  readonly period: string;
  readonly kpis: readonly StatsKpi[];
  readonly arrearsByAge: readonly ArrearsBucketView[];
  readonly topArrears: readonly TopArrearsView[];
  readonly collectors: readonly CollectorPerformanceView[];
  /** Sin cartera ni cobradores en el período: para pintar un estado vacío. */
  readonly isEmpty: boolean;
}

function arrearsRateTone(rate: number | null): FigureTone {
  if (rate === null) return 'neutral';
  if (rate >= ARREARS_RATE_BAD_FROM) return 'bad';
  return rate >= ARREARS_RATE_WARNING_FROM ? 'warning' : 'good';
}

function plural(count: number, singular: string, pluralForm: string): string {
  return `${String(count)} ${count === 1 ? singular : pluralForm}`;
}

/**
 * Convierte la respuesta de estadísticas en lo que muestra la pantalla: cifras ya formateadas con
 * su tono y, si la API trajo el período anterior, su tendencia. Función pura: la vista no formatea ni
 * decide nada.
 */
export function toStatsViewModel(stats: LenderStats, lookup: SettlementLookup = EMPTY_LOOKUP): StatsViewModel {
  const largest = Math.max(0, ...stats.arrearsByAge.map((bucket) => bucket.amount));
  const previous = stats.previous;
  return {
    period: `${formatBusinessDate(stats.from)} – ${formatBusinessDate(stats.to)}`,
    kpis: [
      {
        id: 'portfolio',
        label: 'Cartera total',
        value: formatCopCompact(stats.totalPortfolio),
        tone: 'neutral',
        trend: relativeTrend(stats.totalPortfolio, previous?.totalPortfolio, 'neutral'),
      },
      {
        id: 'atRisk',
        label: 'Cartera en riesgo',
        value: formatCopCompact(stats.portfolioAtRisk),
        tone: stats.portfolioAtRisk > 0 ? 'bad' : 'neutral',
        trend: relativeTrend(stats.portfolioAtRisk, previous?.portfolioAtRisk, 'lower-is-better'),
      },
      {
        id: 'arrearsRate',
        label: '% en mora',
        value: formatPercent(stats.arrearsRate),
        tone: arrearsRateTone(stats.arrearsRate),
        trend: pointsTrend(stats.arrearsRate, previous?.arrearsRate, 'lower-is-better'),
      },
      {
        id: 'collected',
        label: 'Cobrado en el período',
        value: formatCopCompact(stats.collectedAmount),
        tone: 'good',
        trend: relativeTrend(stats.collectedAmount, previous?.collectedAmount, 'higher-is-better'),
      },
      {
        id: 'effectiveness',
        label: 'Efectividad',
        value: formatPercent(stats.effectiveness),
        tone: effectivenessTone(stats.effectiveness),
        trend: pointsTrend(stats.effectiveness, previous?.effectiveness, 'higher-is-better'),
      },
    ],
    arrearsByAge: stats.arrearsByAge.map((bucket) => ({
      label: BUCKET_LABELS[bucket.label],
      amount: formatCop(bucket.amount),
      clients: plural(bucket.clientsCount, 'cliente', 'clientes'),
      barPercent: largest === 0 ? 0 : Math.round((bucket.amount / largest) * 100),
    })),
    topArrears: stats.topArrears.map((entry) => ({
      clientId: entry.clientId,
      name: entry.clientFullName,
      days: `${plural(entry.overdueDays, 'día', 'días')} en mora`,
      amount: formatCop(entry.overdueAmount),
    })),
    collectors: stats.collectorPerformance.map((collector) => ({
      collectorId: collector.collectorMembershipId,
      name: collector.fullName,
      portfolioName: lookup.collectorPortfolioNames.get(collector.collectorMembershipId) ?? NO_PORTFOLIO,
      effectiveness: formatPercent(collector.effectiveness),
      effectivenessTone: effectivenessTone(collector.effectiveness),
      overdue: formatCop(collector.overdueAmount),
    })),
    isEmpty: stats.totalPortfolio === 0 && stats.collectorPerformance.length === 0,
  };
}
