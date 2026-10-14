import 'server-only';
import { MAX_PAGE_SIZE } from '@fiaro-app/contracts';
import { buildSettlementLookup } from '@/features/dashboard/build-lookup';
import { EMPTY_LOOKUP, type SettlementLookup } from '@/features/dashboard/dashboard-view-model';
import { lenderEndpoints } from '@/features/lender/endpoints';
import { membershipEndpoints } from '@/features/memberships/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/**
 * Nombres de cobradores y carteras que completan los cuadres (la API de cuadres solo trae ids).
 * Si no se pueden traer (la persona no puede listar colaboradores, o falló la consulta) devuelve
 * un lookup vacío: la pantalla sigue con sus valores de respaldo en vez de romper.
 */
export async function getSettlementLookup(): Promise<SettlementLookup> {
  try {
    const [collectors, portfolios] = await Promise.all([
      callEndpointAsUser(membershipEndpoints.list, { body: { page: 1, pageSize: MAX_PAGE_SIZE, role: 'COLLECTOR' } }),
      callEndpointAsUser(lenderEndpoints.portfolios, {}),
    ]);
    return buildSettlementLookup(collectors.data, portfolios);
  } catch (error) {
    if (isApiRequestError(error)) return EMPTY_LOOKUP;
    throw error;
  }
}
