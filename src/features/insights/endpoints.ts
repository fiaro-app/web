import { DateRangeSchema, defineEndpoint } from "@fiaro-app/contracts";
import { z } from "zod";

/** Cuerpo de `QUERY /lenders/me/stats/insights`: solo el período (sin él, el mes hasta hoy). */
export const InsightsBodySchema = z.strictObject({
  dateRange: DateRangeSchema.optional(),
});
export type InsightsBody = z.infer<typeof InsightsBodySchema>;

const Money = z.int().nonnegative();
const Rate = z.number().min(0).max(1).nullable();

/** Respuesta de `QUERY /lenders/me/stats/insights` (D-133 de la API). */
export const InsightsSchema = z.object({
  from: z.iso.date(),
  to: z.iso.date(),
  daily: z.array(
    z.object({ date: z.iso.date(), expected: Money, collected: Money }),
  ),
  income: z.object({
    collected: Money,
    byMethod: z.object({ CASH: Money, NEQUI: Money, TRANSFER: Money }),
    interest: Money,
    principalRecovered: Money,
    interestShare: Rate,
  }),
  origination: z.object({
    loansCreated: Money,
    amountLent: Money,
    averageTicket: Money.nullable(),
    agreedInterest: Money,
  }),
  visits: z.object({
    PAID: Money,
    NOT_FOUND: Money,
    REFUSED: Money,
    RESCHEDULED: Money,
    total: Money,
    contactRate: Rate,
    paidRate: Rate,
  }),
  settlements: z.object({
    submitted: Money,
    balanced: Money,
    withDifference: Money,
    shortfall: Money,
    surplus: Money,
  }),
  forecast: z.array(z.object({ date: z.iso.date(), expected: Money })),
  previous: z.object({
    from: z.iso.date(),
    to: z.iso.date(),
    collected: Money,
    interest: Money,
    loansCreated: Money,
    amountLent: Money,
  }),
});
export type Insights = z.infer<typeof InsightsSchema>;

/** `@fiaro-app/contracts` aún no publica este endpoint: mismo patrón que `features/stats/endpoints.ts`. */
export const insightsEndpoints = {
  get: defineEndpoint({
    method: "QUERY",
    path: "/lenders/me/stats/insights",
    summary:
      "Cómo va el negocio: cobro diario, ganancia, colocación, operación de los cobradores y proyección de 7 días.",
    body: InsightsBodySchema,
    response: InsightsSchema,
  }),
} as const;
