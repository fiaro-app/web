import { LOANS_TEXT } from '@/content/loans';
import { LOAN_REQUESTS_TEXT } from '@/content/loan-requests';
import { EMPTY_LOOKUP, UNKNOWN_COLLECTOR, type SettlementLookup } from '@/features/dashboard/dashboard-view-model';
import type { LoanRequest, LoanRequestStatus } from '@/features/loan-requests/endpoints';
import { formatCop } from '@/lib/amount';
import { formatBusinessDate } from '@/lib/dates';
import type { FigureTone } from '@/lib/tone';

/** Nombre que se muestra cuando no se pudo traer el del cliente. */
export const UNKNOWN_CLIENT = 'Cliente';

/** Color del estado: pendiente en ámbar, aceptada en musgo y rechazada en grana. */
const STATUS_TONE: Record<LoanRequestStatus, FigureTone> = { PENDING: 'warning', APPROVED: 'good', REJECTED: 'bad' };

/** Una solicitud lista para pintar, con la solicitud original para el formulario de revisión. */
export interface LoanRequestRow {
  readonly id: string;
  readonly request: LoanRequest;
  readonly collectorName: string;
  /** Nombre y cédula del cliente (el del cliente nuevo, o el del cliente del negocio si se pudo traer). */
  readonly clientLabel: string;
  readonly isNewClient: boolean;
  /** «$500.000 en 20 cuotas diarias de $30.000». */
  readonly summary: string;
  readonly startsOn: string;
  readonly status: string;
  readonly statusTone: FigureTone;
  /** Solo una solicitud pendiente se puede resolver. */
  readonly reviewable: boolean;
  readonly rejectionReason: string | null;
  /** Ruta del préstamo creado, o `null` si la solicitud no se aceptó. */
  readonly loanHref: string | null;
}

export interface LoanRequestsViewModel {
  readonly rows: readonly LoanRequestRow[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  /** Estado por el que se filtra, o `null` para ver todas. */
  readonly status: LoanRequestStatus | null;
}

function toRow(request: LoanRequest, lookup: SettlementLookup, clientNames: ReadonlyMap<string, string>): LoanRequestRow {
  const name = request.newClient?.fullName ?? (request.clientId === null ? undefined : clientNames.get(request.clientId)) ?? UNKNOWN_CLIENT;
  return {
    id: request.id,
    request,
    collectorName: lookup.collectorNames.get(request.requestedByMembershipId) ?? UNKNOWN_COLLECTOR,
    clientLabel: `${name} · ${request.nationalId}`,
    isNewClient: request.newClient !== null,
    summary: LOAN_REQUESTS_TEXT.card.summary(
      formatCop(request.principalAmount),
      request.installmentCount,
      formatCop(request.installmentValue),
      LOANS_TEXT.frequency[request.frequency],
    ),
    startsOn: formatBusinessDate(request.startDate),
    status: LOAN_REQUESTS_TEXT.status[request.status],
    statusTone: STATUS_TONE[request.status],
    reviewable: request.status === 'PENDING',
    rejectionReason: request.rejectionReason,
    loanHref: request.loanId === null ? null : `/prestamos/${request.loanId}`,
  };
}

/** Convierte una página de solicitudes de la API en filas listas para pintar. */
export function toLoanRequestsViewModel(
  requests: readonly LoanRequest[],
  pageInfo: { readonly total: number; readonly page: number; readonly pageSize: number },
  status: LoanRequestStatus | null,
  lookup: SettlementLookup = EMPTY_LOOKUP,
  clientNames: ReadonlyMap<string, string> = new Map(),
): LoanRequestsViewModel {
  return { rows: requests.map((request) => toRow(request, lookup, clientNames)), ...pageInfo, status };
}
