import { formatBusinessDate } from '@/lib/dates';
import type { FigureTone } from '@/lib/tone';
import { formatCop, formatCopCompact, formatPercent } from '@/lib/amount';
import type { DashboardSettlement, LenderDashboard } from '@/features/dashboard/endpoints';

/** Desde qué proporción cobrada la efectividad del día se considera buena o aceptable. */
export const EFFECTIVENESS_GOOD_FROM = 0.9;
export const EFFECTIVENESS_ACCEPTABLE_FROM = 0.7;

export type EffectivenessLevel = 'good' | 'acceptable' | 'low' | 'none';

export interface DashboardKpi {
  readonly id: 'portfolio' | 'collectedToday' | 'collectors' | 'effectiveness' | 'clientsInArrears';
  readonly label: string;
  readonly value: string;
  readonly tone: FigureTone;
}

/** Nombres con los que se completan los cuadres (la API del resumen solo trae ids). */
export interface SettlementLookup {
  readonly collectorNames: ReadonlyMap<string, string>;
  /** Cartera de cada membresía de cobrador (`membershipId → nombre de la cartera`). */
  readonly collectorPortfolioNames: ReadonlyMap<string, string>;
}

export const EMPTY_LOOKUP: SettlementLookup = { collectorNames: new Map(), collectorPortfolioNames: new Map() };

export const UNKNOWN_COLLECTOR = 'Cobrador sin nombre';
export const NO_PORTFOLIO = '—';

export interface PendingSettlementView {
  readonly id: string;
  readonly collectorName: string;
  readonly portfolioName: string;
  readonly date: string;
  readonly expected: string;
  readonly collected: string;
  /** Diferencia cobrado − esperado ya formateada; `null` si cuadra. */
  readonly difference: string | null;
  /** `bad` cuando faltó dinero, `warning` cuando sobró, `neutral` si cuadra. */
  readonly differenceTone: FigureTone;
  readonly note: string | null;
}

export interface DashboardViewModel {
  readonly kpis: readonly DashboardKpi[];
  readonly alerts: readonly string[];
  readonly pendingSettlements: readonly PendingSettlementView[];
  /** Si no hay nada que mostrar todavía (sin cartera ni cobradores): para pintar un estado vacío. */
  readonly isEmpty: boolean;
}

/** Nivel de la efectividad del día según los umbrales de arriba; `none` si no había nada esperado. */
export function effectivenessLevel(ratio: number | null): EffectivenessLevel {
  if (ratio === null) return 'none';
  if (ratio >= EFFECTIVENESS_GOOD_FROM) return 'good';
  if (ratio >= EFFECTIVENESS_ACCEPTABLE_FROM) return 'acceptable';
  return 'low';
}

const LEVEL_TONE: Record<EffectivenessLevel, FigureTone> = {
  good: 'good',
  acceptable: 'warning',
  low: 'bad',
  none: 'neutral',
};

function differenceTone(difference: number): FigureTone {
  if (difference < 0) return 'bad';
  return difference > 0 ? 'warning' : 'neutral';
}

function toSettlementView(settlement: DashboardSettlement, lookup: SettlementLookup): PendingSettlementView {
  const difference = settlement.collectedAmount - settlement.expectedAmount;
  const id = settlement.collectorMembershipId;
  return {
    id: settlement.id,
    collectorName: lookup.collectorNames.get(id) ?? UNKNOWN_COLLECTOR,
    portfolioName: lookup.collectorPortfolioNames.get(id) ?? NO_PORTFOLIO,
    date: formatBusinessDate(settlement.date),
    expected: formatCop(settlement.expectedAmount),
    collected: formatCop(settlement.collectedAmount),
    difference: difference === 0 ? null : formatCop(difference),
    differenceTone: differenceTone(difference),
    note: settlement.collectorNote,
  };
}

/**
 * Convierte la respuesta de la API en lo que muestra la pantalla: cifras ya formateadas con su
 * tono, y los cuadres con nombres. Es una función pura: la vista no formatea ni decide nada.
 */
export function toDashboardViewModel(dashboard: LenderDashboard, lookup: SettlementLookup = EMPTY_LOOKUP): DashboardViewModel {
  return {
    kpis: [
      { id: 'portfolio', label: 'Cartera total', value: formatCopCompact(dashboard.totalPortfolio), tone: 'neutral' },
      { id: 'collectedToday', label: 'Cobrado hoy', value: formatCopCompact(dashboard.collectedToday), tone: 'good' },
      {
        id: 'collectors',
        label: 'Cobradores activos',
        value: `${String(dashboard.activeCollectors)} / ${String(dashboard.totalCollectors)}`,
        tone: 'neutral',
      },
      {
        id: 'effectiveness',
        label: 'Efectividad de hoy',
        value: formatPercent(dashboard.effectivenessToday),
        tone: LEVEL_TONE[effectivenessLevel(dashboard.effectivenessToday)],
      },
      {
        id: 'clientsInArrears',
        label: 'Clientes en mora',
        value: String(dashboard.clientsInArrears),
        tone: dashboard.clientsInArrears > 0 ? 'bad' : 'neutral',
      },
    ],
    alerts: dashboard.alerts,
    pendingSettlements: dashboard.pendingSettlements.map((settlement) => toSettlementView(settlement, lookup)),
    isEmpty: dashboard.totalPortfolio === 0 && dashboard.totalCollectors === 0,
  };
}
