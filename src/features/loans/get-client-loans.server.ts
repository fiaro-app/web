import 'server-only';
import { loanEndpoints } from '@/features/loans/endpoints';
import { toLoansViewModel, type LoanRow } from '@/features/loans/loans-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/** Cuántos préstamos de un cliente se muestran en su ficha. */
export const CLIENT_LOANS_LIMIT = 20;

/**
 * Préstamos de un cliente (los más recientes primero según la API), con su saldo. Es información
 * de apoyo de la ficha del cliente: si la API falla, la ficha sigue sin ella en vez de romperse.
 */
export async function getClientLoans(clientId: string, clientName: string): Promise<readonly LoanRow[]> {
  try {
    const page = await callEndpointAsUser(loanEndpoints.list, { body: { page: 1, pageSize: CLIENT_LOANS_LIMIT, clientId } });
    return toLoansViewModel(page.data, new Map([[clientId, clientName]]), page.meta, null).rows;
  } catch (error) {
    if (isApiRequestError(error)) return [];
    throw error;
  }
}
