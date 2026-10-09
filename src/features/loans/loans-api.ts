import { loanEndpoints } from '@/features/loans/endpoints';
import { todayBusinessDate } from '@/features/loans/loan-calculations';
import type { LoanBodyValues } from '@/features/loans/loan-schemas';
import { callEndpoint } from '@/lib/api';

/** Da de alta un préstamo. */
export function createLoan(values: LoanBodyValues) {
  return callEndpoint(loanEndpoints.create, { body: values });
}

/** Anula un préstamo activo que todavía no recibió pagos. */
export function cancelLoan(id: string) {
  return callEndpoint(loanEndpoints.cancel, { params: { id } });
}

/**
 * Asigna un cobrador a un préstamo de forma permanente, desde hoy: la API cierra la asignación
 * anterior, si había una, y deja el historial.
 */
export function assignCollector(loanId: string, collectorMembershipId: string) {
  return callEndpoint(loanEndpoints.assign, {
    params: { loanId },
    body: { collectorMembershipId, effectiveFrom: todayBusinessDate() },
  });
}
