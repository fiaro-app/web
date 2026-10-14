import 'server-only';
import { MAX_PAGE_SIZE } from '@fiaro-app/contracts';
import { clientEndpoints } from '@/features/clients/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/** Un cliente elegible al registrar un préstamo. */
export interface ClientOption {
  readonly id: string;
  /** Nombre y cédula, para distinguir homónimos en el desplegable. */
  readonly label: string;
}

const toOption = (client: { readonly id: string; readonly fullName: string; readonly nationalId: string }): ClientOption => ({
  id: client.id,
  label: `${client.fullName} · ${client.nationalId}`,
});

/**
 * Nombre de un cliente para el detalle de un préstamo. Si no se puede traer, la pantalla sigue con un
 * nombre de respaldo en vez de romperse.
 */
export async function getClientName(clientId: string): Promise<string | undefined> {
  try {
    return (await callEndpointAsUser(clientEndpoints.get, { params: { id: clientId } })).fullName;
  } catch (error) {
    if (isApiRequestError(error)) return undefined;
    throw error;
  }
}

/**
 * Clientes para el desplegable del formulario de préstamo: la primera página (la más grande que
 * permite la API) y, si se llegó desde la ficha de un cliente, ese cliente aunque no esté en ella.
 *
 * shortcut: con más de 50 clientes, los demás solo se eligen entrando desde su ficha («Nuevo préstamo»); cambiar a un buscador cuando un negocio lo necesite.
 */
export async function getClientOptions(initialClientId: string | null = null): Promise<readonly ClientOption[]> {
  const { data } = await callEndpointAsUser(clientEndpoints.list, { body: { page: 1, pageSize: MAX_PAGE_SIZE } });
  const options = data.map(toOption);
  if (initialClientId === null || options.some((option) => option.id === initialClientId)) return options;
  try {
    return [toOption(await callEndpointAsUser(clientEndpoints.get, { params: { id: initialClientId } })), ...options];
  } catch (error) {
    if (isApiRequestError(error)) return options;
    throw error;
  }
}
