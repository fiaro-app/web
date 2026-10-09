import { clientEndpoints } from '@/features/clients/endpoints';
import type { ClientValues } from '@/features/clients/client-schemas';
import { callEndpoint } from '@/lib/api';

/** Da de alta un cliente. */
export function createClient(values: ClientValues) {
  return callEndpoint(clientEndpoints.create, { body: values });
}

/** Actualiza solo los campos enviados de un cliente. */
export function updateClient(id: string, changes: Partial<ClientValues>) {
  return callEndpoint(clientEndpoints.update, { params: { id }, body: changes });
}
