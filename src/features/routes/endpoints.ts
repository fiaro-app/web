import { DateRangeSchema, IdSchema, PageQuerySchema, defineEndpoint, paginated } from '@fiaro-app/contracts';
import { z } from 'zod';

/** Lo que hizo un cobrador en un día, tal como lo devuelve la API (D-143 de la API). */
export const RouteDaySchema = z.object({
  date: z.iso.date(),
  collector: z.object({ membershipId: IdSchema, fullName: z.string() }),
  startedAt: z.iso.datetime({ offset: true }),
  endedAt: z.iso.datetime({ offset: true }),
  visitsCount: z.int(),
  paidCount: z.int(),
  expectedAmount: z.int(),
  collectedAmount: z.int(),
});
export type RouteDay = z.infer<typeof RouteDaySchema>;

/** Cuerpo de `QUERY /collection-visits/routes`: sin `dateRange` la API entrega solo hoy. */
export const RoutesBodySchema = PageQuerySchema.extend({
  dateRange: DateRangeSchema.optional(),
  collectorMembershipId: IdSchema.optional(),
});
export type RoutesBody = z.infer<typeof RoutesBodySchema>;

/** Página del registro de rutas con el rango que la API resolvió. */
export const RoutesPageSchema = paginated(RouteDaySchema).extend({ range: DateRangeSchema });
export type RoutesPage = z.infer<typeof RoutesPageSchema>;

/** `@fiaro-app/contracts` aún no publica este endpoint: mismo patrón que `features/risk/endpoints.ts`. */
export const routeEndpoints = {
  list: defineEndpoint({
    method: 'QUERY',
    path: '/collection-visits/routes',
    summary: 'Registro de rutas: un renglón por cobrador y día (solo Owner y Lender).',
    body: RoutesBodySchema,
    response: RoutesPageSchema,
  }),
} as const;
