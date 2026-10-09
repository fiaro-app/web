import 'server-only';
import { toClientsViewModel, type ClientsViewModel } from '@/features/clients/clients-view-model';
import { clientEndpoints } from '@/features/clients/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

export type ClientsResult =
  | { readonly status: 'ok'; readonly clients: ClientsViewModel }
  /** La persona no tiene un negocio activo con el que ver clientes (403). */
  | { readonly status: 'forbidden' };

/** Trae una página de clientes, con búsqueda opcional por nombre o cédula. */
export async function getClients(page: number, search: string): Promise<ClientsResult> {
  try {
    const result = await callEndpointAsUser(clientEndpoints.list, {
      body: { page, pageSize: 20, ...(search !== '' && { search }) },
    });
    return { status: 'ok', clients: toClientsViewModel(result.data, result.meta, search) };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
