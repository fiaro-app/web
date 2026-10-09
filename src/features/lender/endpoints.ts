import { LenderSchema, PortfolioSchema, defineEndpoint } from '@fiaro-app/contracts';
import { z } from 'zod';

/**
 * Datos del prestamista de la sesión. `@fiaro-app/contracts` 0.6.0 publica los schemas
 * (`LenderSchema`, `PortfolioSchema`) pero no los endpoints: se declaran aquí con los mismos
 * schemas (mismo plan de migración que `features/auth/endpoints.ts`).
 */
export const lenderEndpoints = {
  get: defineEndpoint({
    method: 'GET',
    path: '/lender',
    summary: 'Datos públicos del prestamista de la sesión (nombre, logo, días sin cobro).',
    response: LenderSchema,
  }),
  portfolios: defineEndpoint({
    method: 'GET',
    path: '/portfolios',
    summary: 'Todas las carteras del prestamista, sin paginar.',
    response: z.array(PortfolioSchema),
  }),
} as const;
