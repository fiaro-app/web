import { DateRangeSchema, IdSchema, defineEndpoint } from '@fiaro-app/contracts';
import { z } from 'zod';

/** Cuerpo de `QUERY /lenders/me/stats`: todos los filtros son opcionales (sin período, el mes actual). */
export const LenderStatsBodySchema = z.strictObject({
  dateRange: DateRangeSchema.optional(),
  collectorMembershipId: IdSchema.optional(),
  portfolioId: IdSchema.optional(),
  /** Si es `true`, la respuesta trae también el período anterior de la misma duración (`previous`). */
  includePrevious: z.boolean().optional(),
});
export type LenderStatsBody = z.infer<typeof LenderStatsBodySchema>;

/** Cuerpo de `QUERY /lenders/me/stats/export`: los mismos filtros y el formato (por ahora solo PDF). */
export const LenderStatsExportBodySchema = LenderStatsBodySchema.extend({ format: z.literal('pdf') });

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

/** El período inmediatamente anterior, de la misma duración, para calcular tendencias (D-111). */
const PreviousPeriodSchema = z.object({
  from: z.iso.date(),
  to: z.iso.date(),
  /** Cartera total al cierre de ese período. */
  totalPortfolio: z.int().nonnegative(),
  portfolioAtRisk: z.int().nonnegative(),
  arrearsRate: z.number().min(0).nullable(),
  expectedAmount: z.int().nonnegative(),
  collectedAmount: z.int().nonnegative(),
  effectiveness: z.number().min(0).nullable(),
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
  /** Lo que vencía en el período, entre los cobradores que cumplen los filtros. */
  expectedAmount: z.int().nonnegative(),
  /** Lo que esos cobradores cobraron en el período, sin los pagos reversados. */
  collectedAmount: z.int().nonnegative(),
  /** `collectedAmount / expectedAmount`; `null` si no había nada esperado. */
  effectiveness: z.number().min(0).nullable(),
  /** El período anterior; `null` si la petición no pidió `includePrevious`. */
  previous: PreviousPeriodSchema.nullable().default(null),
});
export type LenderStats = z.infer<typeof LenderStatsSchema>;

/**
 * Estadísticas del prestamista. `@fiaro-app/contracts` 0.6.0 no las publica (la API las define en
 * `modules/dashboard`): mismo plan de migración que W-13. El PDF (`/lenders/me/stats/export`)
 * devuelve un archivo, no JSON, así que se llama con `callEndpointForFile`.
 */
export const statsEndpoints = {
  get: defineEndpoint({
    method: 'QUERY',
    path: '/lenders/me/stats',
    summary: 'Estadísticas del período: cartera en riesgo, mora por antigüedad y desempeño por cobrador.',
    body: LenderStatsBodySchema,
    response: LenderStatsSchema,
  }),
  exportPdf: defineEndpoint({
    method: 'QUERY',
    path: '/lenders/me/stats/export',
    summary: 'Las mismas estadísticas en un PDF descargable.',
    body: LenderStatsExportBodySchema,
    // La respuesta es un archivo, no JSON: se lee con `callEndpointForFile`.
    response: z.unknown(),
  }),
} as const;
