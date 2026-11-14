import type { Role } from '@fiaro-app/contracts';
import { toInviteAdminBody, type AdminValues } from '@/features/admins/admin-schemas';
import { membershipEndpoints } from '@/features/memberships/endpoints';
import { callEndpoint } from '@/lib/api';

/** Invita a un administrador nuevo. Si la persona no tenía cuenta, la respuesta trae su contraseña temporal. */
export function inviteAdmin(values: AdminValues) {
  return callEndpoint(membershipEndpoints.invite, { body: toInviteAdminBody(values) });
}

/** Suma el rol de administrador a un colaborador. La API reemplaza los roles completos, así que se reenvían los que ya tenía. */
export function promoteToAdmin(membershipId: string, roles: readonly Role[]) {
  return callEndpoint(membershipEndpoints.changeRoles, { params: { id: membershipId }, body: { roles: [...new Set<Role>([...roles, 'LENDER'])] } });
}

/** Quita el rol de administrador y deja los demás (la API exige al menos un rol). */
export function demoteAdmin(membershipId: string, roles: readonly Role[]) {
  return callEndpoint(membershipEndpoints.changeRoles, { params: { id: membershipId }, body: { roles: roles.filter((role) => role !== 'LENDER') } });
}

/** Quita el acceso de quien solo administraba; conserva su historial. */
export function removeAdminAccess(membershipId: string) {
  return callEndpoint(membershipEndpoints.deactivate, { params: { id: membershipId } });
}
