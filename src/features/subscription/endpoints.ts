import { SubscriptionStatusSchema, defineEndpoint } from '@fiaro-app/contracts';
import { z } from 'zod';

/** Respuesta de `GET /subscription` (D-115): el plan del negocio, sus fechas, topes y uso. Solo informa. */
export const SubscriptionSchema = z.object({
  /** Hoy solo existe `TRIAL`, la prueba inicial de 30 días. */
  planCode: z.literal('TRIAL'),
  /** `ACTIVE`, `GRACE_PERIOD` (venció hace menos de 7 días, todo funciona) o `READ_ONLY`. */
  status: SubscriptionStatusSchema,
  currentPeriodEndsAt: z.iso.datetime({ offset: true }),
  /** Fin del período más la gracia: desde ahí el negocio queda en solo lectura. */
  graceEndsAt: z.iso.datetime({ offset: true }),
  /** Días enteros para el fin del período; 0 si ya venció. */
  daysRemaining: z.int().min(0),
  /** Días enteros de gracia que quedan; 0 fuera de la gracia. */
  graceDaysRemaining: z.int().min(0),
  isReadOnly: z.boolean(),
  limits: z.object({ maxActiveLenders: z.int(), maxCollectors: z.int() }),
  usage: z.object({ activeLenders: z.int(), activeCollectors: z.int() }),
  createdAt: z.iso.datetime({ offset: true }),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;

/** Suscripción del negocio. `@fiaro-app/contracts` 0.6.0 no publica el endpoint: se declara aquí (mismo plan de migración que W-13). */
export const subscriptionEndpoints = {
  get: defineEndpoint({
    method: 'GET',
    path: '/subscription',
    summary: 'El plan del negocio: estado, fechas, topes y uso (cualquier rol con membresía activa).',
    response: SubscriptionSchema,
  }),
} as const;
