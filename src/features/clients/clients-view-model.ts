import type { ClientResponse } from '@/features/clients/endpoints';

/** Una fila de la tabla de clientes, lista para pintar. */
export interface ClientRow {
  readonly id: string;
  readonly fullName: string;
  readonly nationalId: string;
  /** Teléfono tal como lo guarda la API (E.164). */
  readonly phone: string;
  readonly occupation: string;
}

export interface ClientsViewModel {
  readonly rows: readonly ClientRow[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  /** Texto de búsqueda activo, para mostrarlo en el campo y en el estado vacío. */
  readonly search: string;
}

/** Convierte una página de clientes de la API en filas de la tabla. */
export function toClientsViewModel(
  clients: readonly ClientResponse[],
  pageInfo: { readonly total: number; readonly page: number; readonly pageSize: number },
  search: string,
): ClientsViewModel {
  const rows = clients.map<ClientRow>(({ id, fullName, nationalId, phone, occupation }) => ({
    id,
    fullName,
    nationalId,
    phone,
    occupation,
  }));
  return { rows, ...pageInfo, search };
}
