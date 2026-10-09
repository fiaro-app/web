import 'server-only';
import { cache } from 'react';
import { subscriptionEndpoints } from '@/features/subscription/endpoints';
import { toSubscriptionView, type SubscriptionView } from '@/features/subscription/subscription-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/**
 * El plan del negocio, listo para pintar. Es un adorno del panel: si la API falla o el negocio no
 * tiene suscripción (alta caída a medias, 404), el panel abre igual sin aviso de plan; un fallo que
 * no sea de la API sí se propaga. Se memoiza por petición para que el layout y Configuración no repitan la consulta.
 */
export const getSubscription = cache(async (): Promise<SubscriptionView | null> => {
  try {
    return toSubscriptionView(await callEndpointAsUser(subscriptionEndpoints.get, {}));
  } catch (error) {
    if (isApiRequestError(error)) return null;
    throw error;
  }
});
