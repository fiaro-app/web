import { CollectorPeriodStatsSchema, IdSchema, defineEndpoint } from '@fiaro-app/contracts';

// Desempeño de un cobrador en un período (D-107): vive en `@fiaro-app/contracts`.
export { CollectorPeriodStatsSchema, type CollectorPeriodStats } from '@fiaro-app/contracts';
import { z } from 'zod';

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
