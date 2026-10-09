import { visitEndpoints } from '@/features/visits/endpoints';
import { callEndpoint } from '@/lib/api';

/** Revierte un pago con su motivo. */
export function reversePayment(paymentId: string, reason: string) {
  return callEndpoint(visitEndpoints.reversePayment, { params: { id: paymentId }, body: { reason } });
}
