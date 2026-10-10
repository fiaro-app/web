import { collectorEndpoints, type DeactivateCollectorBody } from '@/features/collectors/endpoints';
import { membershipEndpoints } from '@/features/memberships/endpoints';
import { toInviteCollectorBody, type CollectorValues } from '@/features/collectors/collector-schemas';
import type { Role } from '@fiaro-app/contracts';
import { callEndpoint } from '@/lib/api';

/** Registra un cobrador. Si la persona no tenía cuenta, la respuesta trae su contraseña temporal. */
export function inviteCollector(values: CollectorValues) {
  return callEndpoint(membershipEndpoints.invite, { body: toInviteCollectorBody(values) });
}

/**
 * Da de baja al cobrador: quita su acceso de inmediato y pasa cada uno de sus préstamos activos al cobrador
 * indicado, en una sola operación (D-97). Su historial se conserva.
 */
export function deactivateCollector(collectorId: string, reassignments: DeactivateCollectorBody['reassignments']) {
  return callEndpoint(collectorEndpoints.deactivate, { params: { id: collectorId }, body: { reassignments } });
}

/** Genera una contraseña temporal nueva para el cobrador (se muestra una sola vez). */
export function resetCollectorPassword(membershipId: string) {
  return callEndpoint(membershipEndpoints.resetPassword, { params: { id: membershipId } });
}

/**
 * Cambia la cartera de un cobrador. La API reemplaza los roles completos, así que se reenvían los
 * que ya tenía: mandar solo `COLLECTOR` le quitaría, por ejemplo, el rol de administrador.
 */
export function changeCollectorPortfolio(membershipId: string, roles: readonly Role[], portfolioId: string) {
  return callEndpoint(membershipEndpoints.changeRoles, {
    params: { id: membershipId },
    body: { roles: [...roles], portfolioId },
  });
}
