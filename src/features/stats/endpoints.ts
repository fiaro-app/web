import { DateRangeSchema, IdSchema, LenderPeriodStatsSchema, defineEndpoint } from '@fiaro-app/contracts';

// Estadísticas del período (con tendencias, D-111): viven en `@fiaro-app/contracts`.
export {
  ARREARS_BUCKET_LABELS,
  LenderPeriodStatsSchema as LenderStatsSchema,
  type LenderPeriodStats as LenderStats,
} from '@fiaro-app/contracts';
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
    response: LenderPeriodStatsSchema,
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
