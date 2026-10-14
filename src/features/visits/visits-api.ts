import { visitEndpoints, type CreateVisitBody } from '@/features/visits/endpoints';
import { callEndpoint } from '@/lib/api';

/** Revierte un pago con su motivo. */
export function reversePayment(paymentId: string, reason: string) {
  return callEndpoint(visitEndpoints.reversePayment, { params: { id: paymentId }, body: { reason } });
}

/** Registra una visita de cobro (con su pago si lo hubo) en un préstamo. */
export function createVisit(loanId: string, body: CreateVisitBody) {
  return callEndpoint(visitEndpoints.create, { params: { loanId }, body });
}
