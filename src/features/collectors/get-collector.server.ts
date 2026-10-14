import 'server-only';
import type { Role } from '@fiaro-app/contracts';
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
 * Trae un cobrador por id (`GET /memberships/:id`, D-106). 404 es un estado de la pantalla, igual que
 * una membresía que no sea de un cobrador; 403, que la persona no administra el negocio.
 */
export async function getCollector(id: string): Promise<CollectorResult> {
  try {
    const entry = await callEndpointAsUser(membershipEndpoints.get, { params: { id } });
    if (!entry.roles.includes('COLLECTOR')) return { status: 'not-found' };
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
    if (isApiRequestError(error)) {
      if (error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
      if (error.hasCode('NOT_FOUND')) return { status: 'not-found' };
    }
    throw error;
  }
}
