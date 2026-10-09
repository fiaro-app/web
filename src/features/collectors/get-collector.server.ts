import 'server-only';
import { MAX_PAGE_SIZE, type Role } from '@fiaro-app/contracts';
import { membershipEndpoints } from '@/features/memberships/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/** Un cobrador con lo que necesita la pantalla de gestión. */
export interface CollectorDetail {
  readonly id: string;
  readonly fullName: string;
  readonly phone: string;
  readonly roles: readonly Role[];
  readonly portfolioId: string | null;
  readonly active: boolean;
}

export type CollectorResult =
  | { readonly status: 'ok'; readonly collector: CollectorDetail }
  | { readonly status: 'not-found' }
  | { readonly status: 'forbidden' };

/**
 * Busca un cobrador por id. La API no tiene `GET /memberships/:id`, así que se pide la página más
 * grande del listado y se filtra aquí; alcanza para el tamaño de un negocio de cobro diario, y si
 * la API publica el detalle basta con cambiar esta función.
 */
export async function getCollector(id: string): Promise<CollectorResult> {
  try {
    const { data } = await callEndpointAsUser(membershipEndpoints.list, {
      body: { page: 1, pageSize: MAX_PAGE_SIZE, role: 'COLLECTOR' },
    });
    const entry = data.find((candidate) => candidate.id === id);
    if (!entry) return { status: 'not-found' };
    return {
      status: 'ok',
      collector: {
        id: entry.id,
        fullName: entry.fullName,
        phone: entry.phone,
        roles: entry.roles,
        portfolioId: entry.portfolioId,
        active: entry.status === 'ACTIVE',
      },
    };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
