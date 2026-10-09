import { LenderDashboardSchema, defineEndpoint } from '@fiaro-app/contracts';

// El resumen del negocio y el cuadre pendiente que embebe (D-111): viven en `@fiaro-app/contracts`.
export { DashboardSettlementSchema, LenderDashboardSchema, type DashboardSettlement, type LenderDashboard } from '@fiaro-app/contracts';

/**
 * Endpoints del resumen. `@fiaro-app/contracts` 0.6.0 aún no los publica (la API los define en
 * `modules/dashboard`): mismo patrón y mismo plan de migración que `features/auth/endpoints.ts`.
 */
export const dashboardEndpoints = {
  summary: defineEndpoint({
    method: 'GET',
    path: '/lenders/me/dashboard',
    summary:
      'Resumen del negocio: cartera, cobrado hoy o en un período (`?from&to`), cobradores, mora, alertas y cuadres por revisar.',
    response: LenderDashboardSchema,
  }),
} as const;
