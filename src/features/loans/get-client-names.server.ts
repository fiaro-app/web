import 'server-only';
import { MAX_PAGE_SIZE } from '@fiaro-app/contracts';
import { clientEndpoints } from '@/features/clients/endpoints';
import type { ClientNames } from '@/features/loans/loans-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/** Un cliente elegible al registrar un préstamo. */
export interface ClientOption {
  readonly id: string;
  /** Nombre y cédula, para distinguir homónimos en el desplegable. */
  readonly label: string;
}

/** Página más grande de clientes, que alimenta tanto los nombres del listado como el desplegable. */
async function loadClients() {
  const { data } = await callEndpointAsUser(clientEndpoints.list, { body: { page: 1, pageSize: MAX_PAGE_SIZE } });
  return data;
}

/**
 * Nombres de cliente por id para completar el listado de préstamos. Si no se pueden traer, el
 * listado sigue con un nombre de respaldo en vez de romper la pantalla.
 */
export async function getClientNames(): Promise<ClientNames> {
  try {
    return new Map((await loadClients()).map((client) => [client.id, client.fullName]));
  } catch (error) {
    if (isApiRequestError(error)) return new Map();
    throw error;
  }
}

/** Clientes para el desplegable del formulario de préstamo. */
export async function getClientOptions(): Promise<readonly ClientOption[]> {
  const clients = await loadClients();
  return clients.map((client) => ({ id: client.id, label: `${client.fullName} · ${client.nationalId}` }));
}
