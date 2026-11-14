import 'server-only';
import { platformPaymentEndpoints, type PlatformPayment } from '@/features/platform-payments/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/** Lo que trae la pantalla: los pagos, o que la persona no opera la plataforma (403). */
export type PlatformPaymentsResult =
  | { readonly status: 'ok'; readonly payments: readonly PlatformPayment[] }
  | { readonly status: 'forbidden' };

/** Los pagos del plan de todos los negocios. Un 403 es un estado de la pantalla; cualquier otra falla va al `error.tsx`. */
export async function getPlatformPayments(): Promise<PlatformPaymentsResult> {
  try {
    return { status: 'ok', payments: (await callEndpointAsUser(platformPaymentEndpoints.list, {})).items };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
