import { platformPaymentEndpoints, type RefundBody } from '@/features/platform-payments/endpoints';
import { callEndpoint } from '@/lib/api';

/** Devuelve por completo un pago aprobado. */
export function refundPayment(reference: string, body: RefundBody) {
  return callEndpoint(platformPaymentEndpoints.refund, { params: { reference }, body });
}
