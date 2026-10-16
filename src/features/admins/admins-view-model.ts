import type { Role } from '@fiaro-app/contracts';
import { ADMINS_TEXT } from '@/content/admins';
import type { MembershipListEntry } from '@/features/memberships/endpoints';

/** Una fila de la tabla de administradores, lista para pintar. */
export interface AdminRow {
  readonly id: string;
  readonly fullName: string;
  readonly phone: string;
  readonly roleLabel: string;
  readonly roles: readonly Role[];
  readonly isSelf: boolean;
  /** Se le puede quitar el rol de administrador y que siga con otro (cobrador). */
  readonly canDemote: boolean;
  /** Solo administraba: lo único que se puede es quitarle el acceso. */
  readonly canRemove: boolean;
}

/** Un colaborador al que se le puede subir de rango. */
export interface PromotableOption {
  readonly id: string;
  readonly label: string;
  readonly roles: readonly Role[];
}

export interface AdminsViewModel {
  readonly admins: readonly AdminRow[];
  readonly promotable: readonly PromotableOption[];
}

function roleLabelOf(roles: readonly Role[]): string {
  if (roles.includes('OWNER')) return ADMINS_TEXT.roles.owner;
  return roles.includes('COLLECTOR') ? ADMINS_TEXT.roles.adminCollector : ADMINS_TEXT.roles.admin;
}

/**
 * Administradores activos (quien tiene el rol de administrador) y los colaboradores activos a los que se les puede subir
 * de rango. Al dueño y a uno mismo no se les ofrece ninguna acción: la API tampoco las permite.
 */
export function toAdminsViewModel(
  admins: readonly MembershipListEntry[],
  collaborators: readonly MembershipListEntry[],
  selfId: string | null,
): AdminsViewModel {
  return {
    admins: admins.map<AdminRow>((entry) => {
      const isOwner = entry.roles.includes('OWNER');
      const isSelf = entry.id === selfId;
      const actionable = !isOwner && !isSelf;
      const others = entry.roles.filter((role) => role !== 'LENDER');
      return {
        id: entry.id,
        fullName: entry.fullName,
        phone: entry.phone,
        roleLabel: roleLabelOf(entry.roles),
        roles: entry.roles,
        isSelf,
        canDemote: actionable && others.length > 0,
        canRemove: actionable && others.length === 0,
      };
    }),
    promotable: collaborators
      .filter((entry) => !entry.roles.includes('LENDER') && !entry.roles.includes('OWNER'))
      .map((entry) => ({ id: entry.id, label: `${entry.fullName} · ${entry.phone}`, roles: entry.roles })),
  };
}
