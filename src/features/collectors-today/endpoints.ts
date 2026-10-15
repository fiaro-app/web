import { defineEndpoint, SettlementStatusSchema } from '@fiaro-app/contracts';
import { z } from 'zod';

/** En qué va la ruta de hoy de un cobrador. */
export const RouteStatusSchema = z.enum(['NO_ROUTE', 'NOT_STARTED', 'IN_PROGRESS', 'FINISHED']);
export type RouteStatus = z.infer<typeof RouteStatusSchema>;

const CollectorTodaySchema = z.object({
  membershipId: z.uuid(),
  fullName: z.string(),
  status: RouteStatusSchema,
  routeLoans: z.int().nonnegative(),
  visitedLoans: z.int().nonnegative(),
  pendingLoans: z.int().nonnegative(),
  expectedAmount: z.int().nonnegative(),
  collectedAmount: z.int().nonnegative(),
  firstVisitAt: z.iso.datetime().nullable(),
  lastVisitAt: z.iso.datetime().nullable(),
  settlementStatus: SettlementStatusSchema.nullable(),
});

/** Respuesta de `GET /lenders/me/collectors-today` (D-129 de la API). */
export const CollectorsTodaySchema = z.object({
  date: z.iso.date(),
  counts: z.object({
    NO_ROUTE: z.int().nonnegative(),
    NOT_STARTED: z.int().nonnegative(),
    IN_PROGRESS: z.int().nonnegative(),
    FINISHED: z.int().nonnegative(),
  }),
  collectors: z.array(CollectorTodaySchema),
});
export type CollectorsToday = z.infer<typeof CollectorsTodaySchema>;

/** `@fiaro-app/contracts` aún no publica este endpoint: mismo patrón que `features/dashboard/endpoints.ts`. */
export const collectorsTodayEndpoints = {
  today: defineEndpoint({
    method: 'GET',
    path: '/lenders/me/collectors-today',
    summary: 'Cómo va hoy la ruta de cada cobrador activo: quién empezó, cuántos préstamos faltan, lo esperado y lo cobrado.',
    response: CollectorsTodaySchema,
  }),
} as const;
