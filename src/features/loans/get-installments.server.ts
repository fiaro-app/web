import 'server-only';
import { loanEndpoints, type LoanInstallment } from '@/features/loans/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/**
 * Calendario de cuotas de un préstamo. Es un dato de apoyo del detalle: si la API falla, el
 * préstamo se muestra sin calendario en vez de romperse; un fallo que no sea de la API sí se propaga.
 */
export async function getLoanInstallments(loanId: string): Promise<readonly LoanInstallment[]> {
  try {
    const { installments } = await callEndpointAsUser(loanEndpoints.installments, { params: { loanId } });
    return installments;
  } catch (error) {
    if (isApiRequestError(error)) return [];
    throw error;
  }
}
