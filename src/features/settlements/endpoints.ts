import {
  DailySettlementSchema,
  IdSchema,
  NoteSchema,
  PageQuerySchema,
  SettlementStatusSchema,
  defineEndpoint,
  paginated,
} from '@fiaro-app/contracts';
import { z } from 'zod';

/** Cuadre tal como lo devuelve la API: coincide con `DailySettlementSchema` del contrato. */
export const SettlementResponseSchema = DailySettlementSchema;
export type SettlementResponse = z.infer<typeof SettlementResponseSchema>;

/** Cuerpo de `QUERY /daily-settlements`: página y filtros opcionales por cobrador y estado. */
export const ListSettlementsBodySchema = PageQuerySchema.extend({
  collectorMembershipId: IdSchema.optional(),
  status: SettlementStatusSchema.optional(),
});

/** Cuerpo de aprobar o rechazar: el comentario del prestamista es opcional. */
export const ReviewSettlementBodySchema = z.strictObject({
  reviewNote: NoteSchema.nullable().optional(),
});

const SettlementParamsSchema = z.object({ id: IdSchema });

/**
 * Cuadres diarios (revisión del prestamista). El envío lo hace el cobrador desde la app móvil, así
 * que aquí solo se declaran leer, listar, aprobar y rechazar. `@fiaro-app/contracts` publica
 * `DailySettlementSchema` pero no los endpoints (mismo plan de migración que W-13).
 */
export const settlementEndpoints = {
  get: defineEndpoint({
    method: 'GET',
    path: '/daily-settlements/:id',
    summary: 'Un cuadre del prestamista de la sesión.',
    params: SettlementParamsSchema,
    response: SettlementResponseSchema,
  }),
  list: defineEndpoint({
    method: 'QUERY',
    path: '/daily-settlements',
    summary: 'Lista paginada de cuadres, con filtros por cobrador y estado.',
    body: ListSettlementsBodySchema,
    response: paginated(SettlementResponseSchema),
  }),
  approve: defineEndpoint({
    method: 'POST',
    path: '/daily-settlements/:id/approve',
    summary: 'Aprueba un cuadre pendiente (solo Owner y Lender).',
    params: SettlementParamsSchema,
    body: ReviewSettlementBodySchema,
    response: SettlementResponseSchema,
  }),
  reject: defineEndpoint({
    method: 'POST',
    path: '/daily-settlements/:id/reject',
    summary: 'Rechaza un cuadre pendiente (solo Owner y Lender).',
    params: SettlementParamsSchema,
    body: ReviewSettlementBodySchema,
    response: SettlementResponseSchema,
  }),
} as const;
