import 'server-only';
import type { Role } from '@fiaro-app/contracts';
import { cache } from 'react';
import { roleLabel, canCollectPayments, canManageBusiness } from '@/features/app-shell/role-label';
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

/** La membresía propia (`GET /memberships/me`, D-124): sirve a cualquier rol, también al cobrador. */
async function loadOwnMembership(): Promise<OwnMembership> {
  try {
    const own = await callEndpointAsUser(membershipEndpoints.me, {});
    return { roles: own.roles, membershipId: own.id };
  } catch (error) {
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
 * de quedar inservible. Se memoiza por petición
 * para que el layout y una página que también necesite el rol no repitan las consultas.
 */
export const getShellContext = cache(async (): Promise<ShellContext> => {
  const [{ businessName, brandColor }, own, unreadNotifications] = await Promise.all([
    loadLenderBranding(),
    loadOwnMembership(),
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
