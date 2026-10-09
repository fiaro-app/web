import { membershipEndpoints } from '@/features/memberships/endpoints';
import { toInviteCollectorBody, type CollectorValues } from '@/features/collectors/collector-schemas';
import { callEndpoint } from '@/lib/api';

/** Registra un cobrador. Si la persona no tenía cuenta, la respuesta trae su contraseña temporal. */
export function inviteCollector(values: CollectorValues) {
  return callEndpoint(membershipEndpoints.invite, { body: toInviteCollectorBody(values) });
}

/** Quita el acceso del cobrador de inmediato; su historial se conserva. */
export function deactivateCollector(membershipId: string) {
  return callEndpoint(membershipEndpoints.deactivate, { params: { id: membershipId } });
}

/** Genera una contraseña temporal nueva para el cobrador (se muestra una sola vez). */
export function resetCollectorPassword(membershipId: string) {
  return callEndpoint(membershipEndpoints.resetPassword, { params: { id: membershipId } });
}
