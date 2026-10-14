import 'server-only';
import { MAX_PAGE_SIZE, type LoanStatus } from '@fiaro-app/contracts';
import { clientEndpoints } from '@/features/clients/endpoints';
import { getClientNames } from '@/features/loans/get-client-names.server';
import { loanEndpoints, type LoanListItem } from '@/features/loans/endpoints';
import { toLoansViewModel, type LoansViewModel } from '@/features/loans/loans-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

export type LoansResult =
  | { readonly status: 'ok'; readonly loans: LoansViewModel }
  /** La persona no tiene un negocio activo con el que ver préstamos (403). */
  | { readonly status: 'forbidden' };

const PAGE_SIZE = 20;

/** A cuántos clientes que coinciden con la búsqueda se les traen los préstamos. */
const MAX_SEARCH_CLIENTS = 10;

/**
 * Préstamos de los clientes cuyo nombre o cédula coincide con la búsqueda. La API de préstamos
 * solo filtra por cliente, así que se buscan primero los clientes y luego sus préstamos (los más
 * recientes primero). No se pagina: son los de pocos clientes.
 */
async function searchLoans(search: string, status: LoanStatus | null): Promise<readonly LoanListItem[]> {
  const { data: clients } = await callEndpointAsUser(clientEndpoints.list, { body: { page: 1, pageSize: MAX_SEARCH_CLIENTS, search } });
  const pages = await Promise.all(
    clients.map((client) =>
      callEndpointAsUser(loanEndpoints.list, { body: { page: 1, pageSize: MAX_PAGE_SIZE, clientId: client.id, ...(status && { status }) } }),
    ),
  );
  return pages.flatMap((page) => page.data).sort((a, b) => b.startDate.localeCompare(a.startDate));
}

/**
 * Trae una página de préstamos con su saldo y mora (los calcula la API), con filtro opcional por
 * estado y búsqueda opcional por cliente, y los nombres de sus clientes.
 */
export async function getLoans(page: number, status: LoanStatus | null, search = ''): Promise<LoansResult> {
  try {
    if (search !== '') {
      const [loans, names] = await Promise.all([searchLoans(search, status), getClientNames()]);
      const pageInfo = { total: loans.length, page: 1, pageSize: Math.max(PAGE_SIZE, loans.length) };
      return { status: 'ok', loans: toLoansViewModel(loans, names, pageInfo, status, search) };
    }
    const [result, names] = await Promise.all([
      callEndpointAsUser(loanEndpoints.list, { body: { page, pageSize: PAGE_SIZE, ...(status && { status }) } }),
      getClientNames(),
    ]);
    return { status: 'ok', loans: toLoansViewModel(result.data, names, result.meta, status) };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
