import 'server-only';
import { MAX_PAGE_SIZE } from '@fiaro-app/contracts';
import { loanEndpoints } from '@/features/loans/endpoints';
import { membershipEndpoints } from '@/features/memberships/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/** Un préstamo activo que hay que pasarle a otro cobrador antes de dar de baja al actual. */
export interface HandoverLoan {
  readonly id: string;
  readonly clientName: string;
}

/** A quién se le pueden pasar los préstamos: otros cobradores activos. */
export interface HandoverDestination {
  readonly id: string;
  readonly name: string;
}

export interface CollectorHandover {
  readonly loans: readonly HandoverLoan[];
  readonly destinations: readonly HandoverDestination[];
}

/** Tope de páginas que se recorren (50 × 50 = 2.500 préstamos de un cobrador): evita un ciclo sin fin. */
const MAX_LOAN_PAGES = 50;

/** Préstamos activos que el cobrador tiene asignados hoy: la API los filtra y trae el nombre del cliente. */
async function loadActiveLoans(collectorId: string): Promise<readonly HandoverLoan[]> {
  const loans: HandoverLoan[] = [];
  for (let page = 1; page <= MAX_LOAN_PAGES; page += 1) {
    const result = await callEndpointAsUser(loanEndpoints.list, {
      body: { page, pageSize: MAX_PAGE_SIZE, status: 'ACTIVE', collectorMembershipId: collectorId },
    });
    for (const loan of result.data) loans.push({ id: loan.id, clientName: loan.clientFullName === '' ? '—' : loan.clientFullName });
    if (page * MAX_PAGE_SIZE >= result.meta.total) break;
  }
  return loans;
}

/**
 * Lo que hace falta para dar de baja a un cobrador sin dejar préstamos sin cobrador (D-97): sus préstamos
 * activos y los cobradores activos que pueden recibirlos. `null` si la API no respondió: la pantalla lo avisa
 * y no ofrece la baja a ciegas.
 */
export async function getCollectorHandover(collectorId: string): Promise<CollectorHandover | null> {
  try {
    const [loans, collectors] = await Promise.all([
      loadActiveLoans(collectorId),
      callEndpointAsUser(membershipEndpoints.list, { body: { page: 1, pageSize: MAX_PAGE_SIZE, role: 'COLLECTOR', status: 'ACTIVE' } }),
    ]);
    return {
      loans,
      destinations: collectors.data.filter((entry) => entry.id !== collectorId).map((entry) => ({ id: entry.id, name: entry.fullName })),
    };
  } catch (error) {
    if (isApiRequestError(error)) return null;
    throw error;
  }
}
