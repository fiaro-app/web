import { CopTotalSchema, DailySettlementSchema, defineEndpoint } from '@fiaro-app/contracts';
import { z } from 'zod';

/**
 * Cuadre `PENDING` tal como lo embebe el resumen: un subconjunto de `DailySettlementSchema` del
 * contrato (sin los campos de revisión, que aún no existen en un cuadre pendiente).
 */
export const DashboardSettlementSchema = DailySettlementSchema.pick({
  id: true,
  collectorMembershipId: true,
  date: true,
  expectedAmount: true,
  collectedAmount: true,
  collectedByMethod: true,
  status: true,
  collectorNote: true,
});
export type DashboardSettlement = z.infer<typeof DashboardSettlementSchema>;

/** Respuesta de `GET /lenders/me/dashboard` (resumen del negocio del prestamista). */
export const LenderDashboardSchema = z.object({
  /** Suma del saldo pendiente de los préstamos activos. */
  totalPortfolio: CopTotalSchema,
  /** Lo cobrado hoy entre todos los cobradores. */
  collectedToday: CopTotalSchema,
  activeCollectors: z.int().nonnegative(),
  totalCollectors: z.int().nonnegative(),
  /** Cobrado sobre lo esperado hoy; `null` si no había nada esperado. */
  effectivenessToday: z.number().min(0).nullable(),
  /** Clientes distintos con al menos un préstamo en mora hoy. */
  clientsInArrears: z.int().nonnegative(),
  /** Alertas de texto ya armadas por la API. */
  alerts: z.array(z.string()),
  pendingSettlements: z.array(DashboardSettlementSchema),
});
export type LenderDashboard = z.infer<typeof LenderDashboardSchema>;

/**
 * Endpoints del resumen. `@fiaro-app/contracts` 0.6.0 aún no los publica (la API los define en
 * `modules/dashboard`): mismo patrón y mismo plan de migración que `features/auth/endpoints.ts`.
 */
export const dashboardEndpoints = {
  summary: defineEndpoint({
    method: 'GET',
    path: '/lenders/me/dashboard',
    summary: 'Resumen del negocio: cartera, cobrado hoy, cobradores, mora, alertas y cuadres por revisar.',
    response: LenderDashboardSchema,
  }),
} as const;
