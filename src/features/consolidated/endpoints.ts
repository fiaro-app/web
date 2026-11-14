import { DateRangeSchema, defineEndpoint } from '@fiaro-app/contracts';
import { z } from 'zod';

/** Cuerpo de `QUERY /lenders/me/consolidated-stats`: solo el período (sin él, el mes hasta hoy). */
export const ConsolidatedBodySchema = z.strictObject({ dateRange: DateRangeSchema.optional() });
export type ConsolidatedBody = z.infer<typeof ConsolidatedBodySchema>;

const Money = z.int().nonnegative();
const Rate = z.number().min(0).max(1).nullable();
const FiguresSchema = z.object({
  totalPortfolio: Money,
  portfolioAtRisk: Money,
  arrearsRate: Rate,
  expectedAmount: Money,
  collectedAmount: Money,
  effectiveness: Rate,
});

/** Respuesta de `QUERY /lenders/me/consolidated-stats` (D-155 de la API). */
export const ConsolidatedSchema = z.object({
  from: z.iso.date(),
  to: z.iso.date(),
  lenders: z.array(FiguresSchema.extend({ lenderId: z.string(), name: z.string() })),
  totals: FiguresSchema,
});
export type Consolidated = z.infer<typeof ConsolidatedSchema>;

/** Las cifras de todos los negocios de la dueña juntas (plan Team). `@fiaro-app/contracts` aún no lo publica: se declara aquí. */
export const consolidatedEndpoints = {
  get: defineEndpoint({
    method: 'QUERY',
    path: '/lenders/me/consolidated-stats',
    summary: 'Cartera, mora y cobro de cada negocio que la persona administra y el total (plan Team).',
    body: ConsolidatedBodySchema,
    response: ConsolidatedSchema,
  }),
} as const;
