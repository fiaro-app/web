import { DateRangeSchema, IdSchema, defineEndpoint } from '@fiaro-app/contracts';
import { z } from 'zod';

/** Cuerpo de `QUERY /lenders/me/stats`: todos los filtros son opcionales (sin período, el mes actual). */
export const LenderStatsBodySchema = z.strictObject({
  dateRange: DateRangeSchema.optional(),
  collectorMembershipId: IdSchema.optional(),
  portfolioId: IdSchema.optional(),
});
export type LenderStatsBody = z.infer<typeof LenderStatsBodySchema>;

/** Los cuatro tramos fijos de antigüedad de la mora, siempre en este orden. */
export const ARREARS_BUCKET_LABELS = ['0-7', '8-15', '16-30', '30+'] as const;

const ArrearsBucketSchema = z.object({
  label: z.enum(ARREARS_BUCKET_LABELS),
  amount: z.int().nonnegative(),
  clientsCount: z.int().nonnegative(),
});

const TopArrearsEntrySchema = z.object({
  clientId: IdSchema,
  clientFullName: z.string(),
  overdueDays: z.int().nonnegative(),
  overdueAmount: z.int().nonnegative(),
});

const CollectorPerformanceSchema = z.object({
  collectorMembershipId: IdSchema,
  fullName: z.string(),
  /** Cobrado sobre lo esperado del período; `null` si no había nada esperado. */
  effectiveness: z.number().min(0).nullable(),
  overdueAmount: z.int().nonnegative(),
});

/** Respuesta de `QUERY /lenders/me/stats`. */
export const LenderStatsSchema = z.object({
  from: z.iso.date(),
  to: z.iso.date(),
  totalPortfolio: z.int().nonnegative(),
  /** Saldo de los préstamos con algo vencido y sin pagar hoy. */
  portfolioAtRisk: z.int().nonnegative(),
  /** `portfolioAtRisk / totalPortfolio`; `null` si la cartera es cero. */
  arrearsRate: z.number().min(0).nullable(),
  arrearsByAge: z.array(ArrearsBucketSchema).length(4),
  topArrears: z.array(TopArrearsEntrySchema),
  collectorPerformance: z.array(CollectorPerformanceSchema),
});
export type LenderStats = z.infer<typeof LenderStatsSchema>;

/**
 * Estadísticas del prestamista. `@fiaro-app/contracts` 0.6.0 no las publica (la API las define en
 * `modules/dashboard`): mismo plan de migración que W-13. El PDF (`/lenders/me/stats/export`)
 * devuelve un archivo, no JSON, así que no pasa por `callEndpoint` (ver `stats-export.ts`).
 */
export const statsEndpoints = {
  get: defineEndpoint({
    method: 'QUERY',
    path: '/lenders/me/stats',
    summary: 'Estadísticas del período: cartera en riesgo, mora por antigüedad y desempeño por cobrador.',
    body: LenderStatsBodySchema,
    response: LenderStatsSchema,
  }),
} as const;
