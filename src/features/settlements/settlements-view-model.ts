import type { SettlementStatus } from '@fiaro-app/contracts';
import { EMPTY_LOOKUP, NO_PORTFOLIO, UNKNOWN_COLLECTOR, type SettlementLookup } from '@/features/dashboard/dashboard-view-model';
import { describeDifference } from '@/features/settlements/difference';
import type { SettlementResponse } from '@/features/settlements/endpoints';
import { SETTLEMENTS_TEXT } from '@/content/settlements';
import { formatCop } from '@/lib/amount';
import { formatBusinessDate, formatInstantDate } from '@/lib/dates';
import type { FigureTone } from '@/lib/tone';

/** Color del estado: pendiente en ámbar, aprobado en musgo y rechazado en grana. */
const STATUS_TONE: Record<SettlementStatus, FigureTone> = {
  PENDING: 'warning',
  APPROVED: 'good',
  REJECTED: 'bad',
};

/** Una fila de la tabla de cuadres, lista para pintar. */
export interface SettlementRow {
  readonly id: string;
  readonly collectorName: string;
  readonly portfolioName: string;
  readonly date: string;
  readonly expected: string;
  readonly collected: string;
  /** Diferencia cobrado − esperado ya formateada; `null` si cuadra. */
  readonly difference: string | null;
  readonly differenceTone: FigureTone;
  readonly status: string;
  readonly statusTone: FigureTone;
  /** Solo un cuadre pendiente se puede revisar. */
  readonly reviewable: boolean;
}

export interface SettlementsViewModel {
  readonly rows: readonly SettlementRow[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  /** Estado por el que se filtra, o `null` para ver todos. */
  readonly status: SettlementStatus | null;
}

function toRow(settlement: SettlementResponse, lookup: SettlementLookup): SettlementRow {
  const difference = describeDifference(settlement.expectedAmount, settlement.collectedAmount);
  const collector = settlement.collectorMembershipId;
  return {
    id: settlement.id,
    collectorName: lookup.collectorNames.get(collector) ?? UNKNOWN_COLLECTOR,
    portfolioName: lookup.collectorPortfolioNames.get(collector) ?? NO_PORTFOLIO,
    date: formatBusinessDate(settlement.date),
    expected: formatCop(settlement.expectedAmount),
    collected: formatCop(settlement.collectedAmount),
    difference: difference.text,
    differenceTone: difference.tone,
    status: SETTLEMENTS_TEXT.status[settlement.status],
    statusTone: STATUS_TONE[settlement.status],
    reviewable: settlement.status === 'PENDING',
  };
}

/** Convierte una página de cuadres de la API en filas de la tabla. */
export function toSettlementsViewModel(
  settlements: readonly SettlementResponse[],
  lookup: SettlementLookup = EMPTY_LOOKUP,
  pageInfo: { readonly total: number; readonly page: number; readonly pageSize: number },
  status: SettlementStatus | null,
): SettlementsViewModel {
  return { rows: settlements.map((settlement) => toRow(settlement, lookup)), ...pageInfo, status };
}

/** Datos del detalle de un cuadre, listos para pintar. */
export interface SettlementDetailView extends SettlementRow {
  readonly cash: string;
  readonly nequi: string;
  readonly transfer: string;
  readonly collectorNote: string | null;
  readonly reviewNote: string | null;
  readonly submittedAt: string;
  /** Fecha de la revisión, o `null` mientras siga pendiente. */
  readonly reviewedAt: string | null;
}

export function toSettlementDetailView(settlement: SettlementResponse, lookup: SettlementLookup = EMPTY_LOOKUP): SettlementDetailView {
  return {
    ...toRow(settlement, lookup),
    cash: formatCop(settlement.collectedByMethod.CASH),
    nequi: formatCop(settlement.collectedByMethod.NEQUI),
    transfer: formatCop(settlement.collectedByMethod.TRANSFER),
    collectorNote: settlement.collectorNote,
    reviewNote: settlement.reviewNote,
    submittedAt: formatInstantDate(settlement.submittedAt),
    reviewedAt: settlement.reviewedAt === null ? null : formatInstantDate(settlement.reviewedAt),
  };
}
