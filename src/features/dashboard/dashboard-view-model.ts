import { describeDifference } from '@/features/settlements/difference';
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
  /** Período de las cifras de cobro: «Hoy · 09/10/2026», «El 05/10/2026» o «Del 01/10/2026 al 09/10/2026». */
  readonly periodLabel: string;
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

/** Tono con el que se pinta una efectividad: bien, aceptable (ámbar), baja (grana) o sin dato. */
export function effectivenessTone(ratio: number | null): FigureTone {
  return LEVEL_TONE[effectivenessLevel(ratio)];
}

function toSettlementView(settlement: DashboardSettlement, lookup: SettlementLookup): PendingSettlementView {
  const difference = describeDifference(settlement.expectedAmount, settlement.collectedAmount);
  const id = settlement.collectorMembershipId;
  return {
    id: settlement.id,
    collectorName: lookup.collectorNames.get(id) ?? UNKNOWN_COLLECTOR,
    portfolioName: lookup.collectorPortfolioNames.get(id) ?? NO_PORTFOLIO,
    date: formatBusinessDate(settlement.date),
    expected: formatCop(settlement.expectedAmount),
    collected: formatCop(settlement.collectedAmount),
    difference: difference.text,
    differenceTone: difference.tone,
    note: settlement.collectorNote,
  };
}

const DASHBOARD_TEXT = {
  collectedToday: 'Cobrado hoy',
  collectedInPeriod: 'Cobrado en el período',
  effectivenessToday: 'Efectividad de hoy',
  effectivenessInPeriod: 'Efectividad del período',
} as const;

/** Texto del período de las cifras de cobro: hoy (sin filtro), un día o un rango. */
function describePeriod(period: LenderDashboard['period'], filtered: boolean): string {
  const from = formatBusinessDate(period.from);
  if (!filtered) return `Hoy · ${from}`;
  return period.from === period.to ? `El ${from}` : `Del ${from} al ${formatBusinessDate(period.to)}`;
}

/**
 * Convierte la respuesta de la API en lo que muestra la pantalla: cifras ya formateadas con su
 * tono, y los cuadres con nombres. Es una función pura: la vista no formatea ni decide nada.
 */
export function toDashboardViewModel(
  dashboard: LenderDashboard,
  lookup: SettlementLookup = EMPTY_LOOKUP,
  periodFiltered = false,
): DashboardViewModel {
  const text = DASHBOARD_TEXT;
  return {
    periodLabel: describePeriod(dashboard.period, periodFiltered),
    kpis: [
      { id: 'portfolio', label: 'Cartera total', value: formatCopCompact(dashboard.totalPortfolio), tone: 'neutral' },
      {
        id: 'collectedToday',
        label: periodFiltered ? text.collectedInPeriod : text.collectedToday,
        value: formatCopCompact(periodFiltered ? dashboard.collectedInPeriod : dashboard.collectedToday),
        tone: 'good',
      },
      {
        id: 'collectors',
        label: 'Cobradores activos',
        value: `${String(dashboard.activeCollectors)} / ${String(dashboard.totalCollectors)}`,
        tone: 'neutral',
      },
      {
        id: 'effectiveness',
        label: periodFiltered ? text.effectivenessInPeriod : text.effectivenessToday,
        value: formatPercent(periodFiltered ? dashboard.effectivenessInPeriod : dashboard.effectivenessToday),
        tone: effectivenessTone(periodFiltered ? dashboard.effectivenessInPeriod : dashboard.effectivenessToday),
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
