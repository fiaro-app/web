import { IdSchema, defineEndpoint } from '@fiaro-app/contracts';
import { z } from 'zod';

/** Desempeño de un cobrador en un período (`GET /collectors/:id/stats`, D-107). */
export const CollectorPeriodStatsSchema = z.object({
  from: z.iso.date(),
  to: z.iso.date(),
  /** Lo que el calendario decía que vencía en el período, de su cartera de hoy. */
  expectedAmount: z.int().nonnegative(),
  /** Lo que de verdad cobró, sin los pagos reversados. */
  collectedAmount: z.int().nonnegative(),
  /** `collectedAmount / expectedAmount`; `null` si no había nada que vencer. */
  effectiveness: z.number().min(0).nullable(),
  visitsCount: z.int().nonnegative(),
  /** Lo vencido y sin pagar hoy, de su cartera. */
  overdueAmount: z.int().nonnegative(),
});
export type CollectorPeriodStats = z.infer<typeof CollectorPeriodStatsSchema>;

/**
 * Estadísticas de un cobrador vistas por quien administra. Sin `from` y `to` (que van juntos en la
 * query) el período es el mes actual. Se declara aquí hasta que el contrato lo publique.
 */
export const collectorEndpoints = {
  stats: defineEndpoint({
    method: 'GET',
    path: '/collectors/:id/stats',
    summary: 'Desempeño de un cobrador en un período (solo Owner y Lender).',
    params: z.object({ id: IdSchema }),
    response: CollectorPeriodStatsSchema,
  }),
} as const;
