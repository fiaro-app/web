import { SubscriptionDetailsSchema as ContractSubscriptionSchema, defineEndpoint } from '@fiaro-app/contracts';
import { z } from 'zod';

/**
 * Respuesta de `GET /subscription` (D-115): el schema de `@fiaro-app/contracts` más lo que la API agregó
 * después (`features` y `prioritySupportUrl`, D-151 y D-155); sin ellos en la respuesta quedan vacíos.
 */
export const SubscriptionSchema = ContractSubscriptionSchema.extend({
  features: z.array(z.string()).default([]),
  prioritySupportUrl: z.string().nullable().default(null),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;

/** Suscripción del negocio. `@fiaro-app/contracts` publica el schema pero no el endpoint: se declara aquí (mismo plan de migración que W-13). */
export const subscriptionEndpoints = {
  get: defineEndpoint({
    method: 'GET',
    path: '/subscription',
    summary: 'El plan del negocio: estado, fechas, topes y uso (cualquier rol con membresía activa).',
    response: SubscriptionSchema,
  }),
} as const;
