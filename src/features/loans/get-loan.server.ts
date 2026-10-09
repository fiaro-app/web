import 'server-only';
import { getClientNames } from '@/features/loans/get-client-names.server';
import { loanEndpoints } from '@/features/loans/endpoints';
import { toLoanDetailView, type LoanDetailView } from '@/features/loans/loans-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

export type LoanResult =
  | { readonly status: 'ok'; readonly loan: LoanDetailView }
  | { readonly status: 'not-found' }
  | { readonly status: 'forbidden' };

/** Trae un préstamo por id. 404 y 403 son estados de la pantalla; cualquier otra falla se propaga. */
export async function getLoan(id: string): Promise<LoanResult> {
  try {
    const [loan, names] = await Promise.all([callEndpointAsUser(loanEndpoints.get, { params: { id } }), getClientNames()]);
    return { status: 'ok', loan: toLoanDetailView(loan, names.get(loan.clientId)) };
  } catch (error) {
    if (isApiRequestError(error)) {
      if (error.hasCode('NOT_FOUND')) return { status: 'not-found' };
      if (error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    }
    throw error;
  }
}
