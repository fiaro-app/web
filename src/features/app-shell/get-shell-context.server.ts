import 'server-only';
import { MAX_PAGE_SIZE } from '@fiaro-app/contracts';
import { roleLabel, COLLECTOR_LABEL } from '@/features/app-shell/role-label';
import type { AuthUser } from '@/features/auth/endpoints';
import { lenderEndpoints } from '@/features/lender/endpoints';
import { membershipEndpoints } from '@/features/memberships/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

export interface ShellContext {
  readonly businessName: string;
  /** Rol que se muestra bajo el nombre; `null` si no se pudo saber. */
  readonly roleLabel: string | null;
}

/** Texto que se muestra si el nombre del negocio no se pudo traer: el panel debe abrir igual. */
export const FALLBACK_BUSINESS_NAME = 'Mi financiera';

async function loadRoleLabel(user: AuthUser): Promise<string | null> {
  try {
    const { data } = await callEndpointAsUser(membershipEndpoints.list, {
      body: { page: 1, pageSize: MAX_PAGE_SIZE, status: 'ACTIVE' },
    });
    const own = data.find((membership) => membership.userId === user.id);
    return own ? roleLabel(own.roles) : null;
  } catch (error) {
    // Solo quien edita puede listar colaboradores: un 403 significa que es cobrador.
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return COLLECTOR_LABEL;
    if (isApiRequestError(error)) return null;
    throw error;
  }
}

async function loadBusinessName(): Promise<string> {
  try {
    return (await callEndpointAsUser(lenderEndpoints.get, {})).name;
  } catch (error) {
    if (isApiRequestError(error)) return FALLBACK_BUSINESS_NAME;
    throw error;
  }
}

/**
 * Lo que necesita la barra lateral además de la persona: el nombre del negocio y su rol. Es un
 * adorno de la pantalla: si la API falla al traerlos, el panel abre con valores de respaldo en vez
 * de quedar inservible.
 */
export async function getShellContext(user: AuthUser): Promise<ShellContext> {
  const [businessName, role] = await Promise.all([loadBusinessName(), loadRoleLabel(user)]);
  return { businessName, roleLabel: role };
}
