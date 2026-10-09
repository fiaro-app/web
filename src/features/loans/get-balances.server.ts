import 'server-only';
import { loanEndpoints, type LoanBalance } from '@/features/loans/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/**
 * Consulta el saldo de un préstamo. Si la API responde con error devuelve `null`: el saldo es un
 * dato de apoyo y no debe tumbar la pantalla; una falla que no sea de la API sí se propaga.
 */
export async function getLoanBalance(loanId: string): Promise<LoanBalance | null> {
  try {
    return await callEndpointAsUser(loanEndpoints.balance, { params: { loanId } });
  } catch (error) {
    if (isApiRequestError(error)) return null;
    throw error;
  }
}
