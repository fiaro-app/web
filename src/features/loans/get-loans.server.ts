import 'server-only';
import type { LoanStatus } from '@fiaro-app/contracts';
import { getClientNames } from '@/features/loans/get-client-names.server';
import { getLoanBalances } from '@/features/loans/get-balances.server';
import { loanEndpoints } from '@/features/loans/endpoints';
import { toLoansViewModel, type LoansViewModel } from '@/features/loans/loans-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

export type LoansResult =
  | { readonly status: 'ok'; readonly loans: LoansViewModel }
  /** La persona no tiene un negocio activo con el que ver préstamos (403). */
  | { readonly status: 'forbidden' };

/** Trae una página de préstamos, con filtro opcional por estado, y los nombres de sus clientes. */
export async function getLoans(page: number, status: LoanStatus | null): Promise<LoansResult> {
  try {
    const [result, names] = await Promise.all([
      callEndpointAsUser(loanEndpoints.list, { body: { page, pageSize: 20, ...(status && { status }) } }),
      getClientNames(),
    ]);
    const balances = await getLoanBalances(result.data);
    return { status: 'ok', loans: toLoansViewModel(result.data, names, result.meta, status, balances) };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
