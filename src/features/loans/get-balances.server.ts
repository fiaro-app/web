import 'server-only';
import { loanEndpoints, type LoanBalance, type LoanResponse } from '@/features/loans/endpoints';
import type { LoanBalances } from '@/features/loans/loans-view-model';
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

/**
 * Saldos de los préstamos activos de una página, pedidos en paralelo (no hay un endpoint que los
 * traiga todos juntos; son como mucho una página, 20). Los cerrados no se consultan: un pagado
 * debe $0 y un anulado no tiene saldo.
 */
export async function getLoanBalances(loans: readonly LoanResponse[]): Promise<LoanBalances> {
  const active = loans.filter((loan) => loan.status === 'ACTIVE');
  const results = await Promise.all(active.map(async (loan) => [loan.id, await getLoanBalance(loan.id)] as const));
  return new Map(results.flatMap(([id, balance]) => (balance ? [[id, balance] as const] : [])));
}
