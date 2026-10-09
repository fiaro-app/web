import { formatCop, formatPercent } from '@/lib/amount';
import type { DashboardSettlement, LenderDashboard } from '@/features/dashboard/endpoints';

/** Desde qué proporción cobrada la efectividad del día se considera buena o aceptable. */
export const EFFECTIVENESS_GOOD_FROM = 0.9;
export const EFFECTIVENESS_ACCEPTABLE_FROM = 0.7;

export type EffectivenessLevel = 'good' | 'acceptable' | 'low' | 'none';

export interface DashboardKpi {
  readonly id: 'portfolio' | 'collectedToday' | 'collectors' | 'clientsInArrears';
  readonly label: string;
  readonly value: string;
  /** Texto de apoyo bajo la cifra, si lo hay. */
  readonly detail?: string;
}

export interface PendingSettlementView {
  readonly id: string;
  readonly date: string;
  readonly expected: string;
  readonly collected: string;
  /** Diferencia cobrado − esperado ya formateada; `null` si cuadra. */
  readonly difference: string | null;
  readonly note: string | null;
}

export interface DashboardViewModel {
  readonly kpis: readonly DashboardKpi[];
  readonly effectiveness: { readonly value: string; readonly level: EffectivenessLevel };
  readonly alerts: readonly string[];
  readonly pendingSettlements: readonly PendingSettlementView[];
  /** Si no hay nada que mostrar todavía (sin cartera, sin cobradores): para pintar un estado vacío. */
  readonly isEmpty: boolean;
}

/** Nivel de la efectividad del día según los umbrales de arriba; `none` si no había nada esperado. */
export function effectivenessLevel(ratio: number | null): EffectivenessLevel {
  if (ratio === null) return 'none';
  if (ratio >= EFFECTIVENESS_GOOD_FROM) return 'good';
  if (ratio >= EFFECTIVENESS_ACCEPTABLE_FROM) return 'acceptable';
  return 'low';
}

function toSettlementView(settlement: DashboardSettlement): PendingSettlementView {
  const difference = settlement.collectedAmount - settlement.expectedAmount;
  return {
    id: settlement.id,
    date: settlement.date,
    expected: formatCop(settlement.expectedAmount),
    collected: formatCop(settlement.collectedAmount),
    difference: difference === 0 ? null : formatCop(difference),
    note: settlement.collectorNote,
  };
}

/**
 * Convierte la respuesta de la API en lo que muestra la pantalla: cifras ya formateadas, nivel de
 * efectividad y cuadres listos para pintar. Es una función pura: la vista no formatea nada.
 */
export function toDashboardViewModel(dashboard: LenderDashboard): DashboardViewModel {
  return {
    kpis: [
      { id: 'portfolio', label: 'Cartera total', value: formatCop(dashboard.totalPortfolio) },
      { id: 'collectedToday', label: 'Cobrado hoy', value: formatCop(dashboard.collectedToday) },
      {
        id: 'collectors',
        label: 'Cobradores activos',
        value: String(dashboard.activeCollectors),
        detail: `de ${String(dashboard.totalCollectors)}`,
      },
      { id: 'clientsInArrears', label: 'Clientes en mora', value: String(dashboard.clientsInArrears) },
    ],
    effectiveness: {
      value: formatPercent(dashboard.effectivenessToday),
      level: effectivenessLevel(dashboard.effectivenessToday),
    },
    alerts: dashboard.alerts,
    pendingSettlements: dashboard.pendingSettlements.map(toSettlementView),
    isEmpty: dashboard.totalPortfolio === 0 && dashboard.totalCollectors === 0,
  };
}
