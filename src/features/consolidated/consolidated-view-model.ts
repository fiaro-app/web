import type { Consolidated } from '@/features/consolidated/endpoints';
import { formatCop, formatPercent } from '@/lib/amount';

/** Una fila de «Todos tus negocios», ya formateada. */
export interface ConsolidatedRow {
  readonly id: string;
  readonly name: string;
  readonly portfolio: string;
  readonly atRisk: string;
  readonly arrears: string;
  readonly collected: string;
  readonly effectiveness: string;
}

/** Los negocios y el total, listos para pintar. */
export interface ConsolidatedView {
  readonly rows: readonly ConsolidatedRow[];
  readonly total: ConsolidatedRow;
}

const toRow = (id: string, name: string, figures: Consolidated['totals']): ConsolidatedRow => ({
  id,
  name,
  portfolio: formatCop(figures.totalPortfolio),
  atRisk: formatCop(figures.portfolioAtRisk),
  arrears: formatPercent(figures.arrearsRate),
  collected: formatCop(figures.collectedAmount),
  effectiveness: formatPercent(figures.effectiveness),
});

/**
 * Convierte el consolidado de la API en filas. Con un solo negocio devuelve `null`: la vista sería
 * idéntica a Estadísticas y solo estorbaría.
 */
export function toConsolidatedView(consolidated: Consolidated, totalLabel: string): ConsolidatedView | null {
  if (consolidated.lenders.length < 2) return null;
  return {
    rows: consolidated.lenders.map((lender) => toRow(lender.lenderId, lender.name, lender)),
    total: toRow('total', totalLabel, consolidated.totals),
  };
}
