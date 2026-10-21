import 'server-only';
import { cache } from 'react';
import { checkoutEndpoints, type PaymentHistoryItem } from '@/features/subscription/checkout-endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/**
 * El historial de pagos del plan. Es un complemento de «Plan y pagos»: si la API falla, la pantalla
 * abre igual sin la lista (`null`); un fallo que no sea de la API sí se propaga.
 */
export const getPayments = cache(async (): Promise<readonly PaymentHistoryItem[] | null> => {
  try {
    return (await callEndpointAsUser(checkoutEndpoints.payments, {})).items;
  } catch (error) {
    if (isApiRequestError(error)) return null;
    throw error;
  }
});
