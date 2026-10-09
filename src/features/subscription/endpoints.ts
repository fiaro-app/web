import { SubscriptionDetailsSchema, defineEndpoint } from '@fiaro-app/contracts';

// Respuesta de `GET /subscription` (D-115): vive en `@fiaro-app/contracts`. Solo informa.
export { SubscriptionDetailsSchema as SubscriptionSchema, type SubscriptionDetails as Subscription } from '@fiaro-app/contracts';

/** Suscripción del negocio. `@fiaro-app/contracts` publica el schema pero no el endpoint: se declara aquí (mismo plan de migración que W-13). */
export const subscriptionEndpoints = {
  get: defineEndpoint({
    method: 'GET',
    path: '/subscription',
    summary: 'El plan del negocio: estado, fechas, topes y uso (cualquier rol con membresía activa).',
    response: SubscriptionDetailsSchema,
  }),
} as const;
