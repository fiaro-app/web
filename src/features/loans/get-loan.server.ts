import 'server-only';
import { currentAssignment, todayBusinessDate } from '@/features/loans/loan-calculations';
import { getLoanBalance } from '@/features/loans/get-balances.server';
import { getClientNames } from '@/features/loans/get-client-names.server';
import { loanEndpoints, type CollectionAssignment } from '@/features/loans/endpoints';
import { toLoanDetailView, type LoanDetailView } from '@/features/loans/loans-view-model';
import { getSettlementLookup } from '@/features/settlements/get-settlement-lookup.server';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/** Un cobrador al que se puede asignar el préstamo. */
export interface CollectorOption {
  readonly id: string;
  readonly name: string;
}

export type LoanResult =
  | { readonly status: 'ok'; readonly loan: LoanDetailView; readonly collectorOptions: readonly CollectorOption[] }
  | { readonly status: 'not-found' }
  | { readonly status: 'forbidden' };

/** Historial de asignaciones; si la API falla, se muestra el préstamo sin cobrador en vez de romperlo. */
async function loadAssignments(loanId: string): Promise<readonly CollectionAssignment[]> {
  try {
    return await callEndpointAsUser(loanEndpoints.assignments, { params: { loanId } });
  } catch (error) {
    if (isApiRequestError(error)) return [];
    throw error;
  }
}

/**
 * Trae un préstamo por id con su saldo, su cobrador de hoy y los cobradores que se pueden asignar.
 * 404 y 403 son estados de la pantalla; cualquier otra falla del préstamo se propaga. El saldo, las
 * asignaciones y los nombres son datos de apoyo: si fallan, la pantalla sigue sin ellos.
 */
export async function getLoan(id: string): Promise<LoanResult> {
  try {
    const [loan, names, balance, assignments, lookup] = await Promise.all([
      callEndpointAsUser(loanEndpoints.get, { params: { id } }),
      getClientNames(),
      getLoanBalance(id),
      loadAssignments(id),
      getSettlementLookup(),
    ]);
    const assignment = currentAssignment(assignments, todayBusinessDate());
    return {
      status: 'ok',
      loan: toLoanDetailView(loan, {
        clientName: names.get(loan.clientId),
        balance,
        assignment,
        collectorName: assignment ? lookup.collectorNames.get(assignment.collectorMembershipId) : null,
      }),
      collectorOptions: [...lookup.collectorNames].map(([collectorId, name]) => ({ id: collectorId, name })),
    };
  } catch (error) {
    if (isApiRequestError(error)) {
      if (error.hasCode('NOT_FOUND')) return { status: 'not-found' };
      if (error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    }
    throw error;
  }
}
