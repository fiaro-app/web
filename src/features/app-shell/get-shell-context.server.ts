import 'server-only';
import { MAX_PAGE_SIZE, type Role } from '@fiaro-app/contracts';
import { cache } from 'react';
import { roleLabel, canCollectPayments, canManageBusiness } from '@/features/app-shell/role-label';
import type { AuthUser } from '@/features/auth/endpoints';
import { getUnreadCount } from '@/features/notifications/get-unread-count.server';
import { lenderEndpoints } from '@/features/lender/endpoints';
import { membershipEndpoints } from '@/features/memberships/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

export interface ShellContext {
  readonly businessName: string;
  /** Rol que se muestra bajo el nombre; `null` si no se pudo saber. */
  readonly roleLabel: string | null;
  /** Color de marca del negocio (`#RRGGBB`); `null` es el de Fiaro o no se pudo saber. */
  readonly brandColor: string | null;
  /** Roles de la persona en el negocio; `null` si no se pudieron saber (decide la API). */
  readonly roles: readonly Role[] | null;
  /** Id de su membresía; `null` si no se pudo saber (un cobrador no puede listar colaboradores). */
  readonly membershipId: string | null;
  /** Administra el negocio (Owner o Lender): puede crear, editar y revisar. */
  readonly canManage: boolean;
  /** Puede cobrar en campo: registrar visitas y pagos. */
  readonly canCollect: boolean;
  /** Notificaciones sin leer, para la insignia de la barra lateral (0 si no hay o no se pudo saber). */
  readonly unreadNotifications: number;
}

/** Texto que se muestra si el nombre del negocio no se pudo traer: el panel debe abrir igual. */
export const FALLBACK_BUSINESS_NAME = 'Mi financiera';

interface OwnMembership {
  readonly roles: readonly Role[] | null;
  readonly membershipId: string | null;
}

async function loadOwnMembership(user: AuthUser): Promise<OwnMembership> {
  try {
    const { data } = await callEndpointAsUser(membershipEndpoints.list, {
      body: { page: 1, pageSize: MAX_PAGE_SIZE, status: 'ACTIVE' },
    });
    const own = data.find((membership) => membership.userId === user.id);
    return own ? { roles: own.roles, membershipId: own.id } : { roles: null, membershipId: null };
  } catch (error) {
    // Solo quien edita puede listar colaboradores: un 403 significa que es cobrador.
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { roles: ['COLLECTOR'], membershipId: null };
    if (isApiRequestError(error)) return { roles: null, membershipId: null };
    throw error;
  }
}

async function loadLenderBranding(): Promise<{ readonly businessName: string; readonly brandColor: string | null }> {
  try {
    const lender = await callEndpointAsUser(lenderEndpoints.get, {});
    return { businessName: lender.name, brandColor: lender.brandColor ?? null };
  } catch (error) {
    if (isApiRequestError(error)) return { businessName: FALLBACK_BUSINESS_NAME, brandColor: null };
    throw error;
  }
}

/**
 * Lo que necesita la barra lateral además de la persona: el nombre del negocio, su color de marca, su rol y las notificaciones sin leer. Es un
 * adorno de la pantalla: si la API falla al traerlos, el panel abre con valores de respaldo en vez
 * de quedar inservible. Se memoiza por petición (con la misma `user` que devuelve `requireUser`)
 * para que el layout y una página que también necesite el rol no repitan las consultas.
 */
export const getShellContext = cache(async (user: AuthUser): Promise<ShellContext> => {
  const [{ businessName, brandColor }, own, unreadNotifications] = await Promise.all([
    loadLenderBranding(),
    loadOwnMembership(user),
    getUnreadCount(),
  ]);
  return {
    businessName,
    brandColor,
    roleLabel: own.roles ? roleLabel(own.roles) : null,
    roles: own.roles,
    membershipId: own.membershipId,
    canManage: canManageBusiness(own.roles),
    canCollect: canCollectPayments(own.roles),
    unreadNotifications,
  };
});
