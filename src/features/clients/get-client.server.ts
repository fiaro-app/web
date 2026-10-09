import 'server-only';
import { clientEndpoints, type ClientResponse } from '@/features/clients/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

export type ClientResult =
  | { readonly status: 'ok'; readonly client: ClientResponse }
  | { readonly status: 'not-found' }
  | { readonly status: 'forbidden' };

/** Trae un cliente por id. 404 y 403 son estados de la pantalla; cualquier otra falla se propaga. */
export async function getClient(id: string): Promise<ClientResult> {
  try {
    return { status: 'ok', client: await callEndpointAsUser(clientEndpoints.get, { params: { id } }) };
  } catch (error) {
    if (isApiRequestError(error)) {
      if (error.hasCode('NOT_FOUND')) return { status: 'not-found' };
      if (error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    }
    throw error;
  }
}
