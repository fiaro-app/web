import { checkoutEndpoints, type PurchasablePlanCode } from '@/features/subscription/checkout-endpoints';
import { callEndpoint } from '@/lib/api';

/** Crea la orden de pago de un mes del plan. */
export function createCheckout(planCode: PurchasablePlanCode) {
  return callEndpoint(checkoutEndpoints.create, { body: { planCode } });
}

/** En qué quedó una orden de pago. */
export function fetchCheckoutStatus(reference: string, signal?: AbortSignal) {
  return callEndpoint(checkoutEndpoints.status, { params: { reference }, ...(signal ? { signal } : {}) });
}
