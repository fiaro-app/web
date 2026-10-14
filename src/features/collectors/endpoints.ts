import { CollectorPeriodStatsSchema, IdSchema, defineEndpoint } from '@fiaro-app/contracts';

// Desempeño de un cobrador en un período (D-107): vive en `@fiaro-app/contracts`.
export { CollectorPeriodStatsSchema, type CollectorPeriodStats } from '@fiaro-app/contracts';
import { z } from 'zod';

/** A quién pasa un préstamo activo del cobrador que se da de baja. */
export const CollectorReassignmentSchema = z.strictObject({ loanId: IdSchema, collectorMembershipId: IdSchema });

/** Cuerpo de `POST /collectors/:id/deactivate`: debe cubrir exactamente los préstamos activos que el cobrador tiene asignados hoy. */
export const DeactivateCollectorBodySchema = z.strictObject({ reassignments: z.array(CollectorReassignmentSchema) });
export type DeactivateCollectorBody = z.infer<typeof DeactivateCollectorBodySchema>;

/** Respuesta: la membresía ya dada de baja y cuántos préstamos cambiaron de cobrador. */
export const CollectorDeactivationSchema = z.object({
  id: IdSchema,
  status: z.literal('INACTIVE'),
  reassignedLoans: z.int().nonnegative(),
});

/**
 * La baja de un cobrador vive en `collections` (D-97), no en `memberships`: reasigna sus préstamos y solo
 * después lo desactiva, en una sola transacción; `POST /memberships/:id/deactivate` rechaza a un cobrador.
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
  deactivate: defineEndpoint({
    method: 'POST',
    path: '/collectors/:id/deactivate',
    summary: 'Da de baja a un cobrador reasignando sus préstamos activos (solo Owner y Lender, nunca a sí mismo).',
    params: z.object({ id: IdSchema }),
    body: DeactivateCollectorBodySchema,
    response: CollectorDeactivationSchema,
  }),
} as const;
