import {
  DateRangeSchema,
  IdSchema,
  PageQuerySchema,
  CollectionVisitReportSchema,
  PaymentMethodSchema,
  VisitOutcomeSchema,
  defineEndpoint,
} from '@fiaro-app/contracts';
import { z } from 'zod';

const InstantSchema = z.iso.datetime({ offset: true });

/** Reversión de un pago (lo anula sin borrarlo). */
export const PaymentReversalSchema = z.object({
  id: IdSchema,
  paymentId: IdSchema,
  reason: z.string(),
  reversedByMembershipId: IdSchema,
  createdAt: InstantSchema,
});

/** Pago generado por una visita; `reversal` es `null` mientras siga vigente. */
export const VisitPaymentSchema = z.object({
  id: IdSchema,
  loanId: IdSchema,
  visitId: IdSchema,
  amount: z.int(),
  method: PaymentMethodSchema,
  occurredAt: InstantSchema,
  createdAt: InstantSchema,
  reversal: PaymentReversalSchema.nullable(),
});

/** Visita de un cobrador a un préstamo, con el pago que generó (si lo hubo). */
export const CollectionVisitSchema = z.object({
  id: IdSchema,
  loanId: IdSchema,
  collectorMembershipId: IdSchema,
  outcome: VisitOutcomeSchema,
  expectedAmount: z.int(),
  promisedDate: z.iso.date().nullable(),
  occurredAt: InstantSchema,
  createdAt: InstantSchema,
  payment: VisitPaymentSchema.nullable(),
});
export type CollectionVisit = z.infer<typeof CollectionVisitSchema>;

/** Cuerpo de `QUERY /collection-visits`: sin `dateRange` la API entrega solo hoy. */
export const VisitReportBodySchema = PageQuerySchema.extend({
  dateRange: DateRangeSchema.optional(),
  collectorMembershipId: IdSchema.optional(),
  portfolioId: IdSchema.optional(),
  outcome: VisitOutcomeSchema.optional(),
});
export type VisitReportBody = z.infer<typeof VisitReportBodySchema>;

// Entrada y página del reporte «Cobros del día» (D-105): viven en `@fiaro-app/contracts`.
export {
  CollectionVisitReportEntrySchema as VisitReportEntrySchema,
  CollectionVisitReportSchema as VisitReportSchema,
  type CollectionVisitReport as VisitReport,
  type CollectionVisitReportEntry as VisitReportEntry,
} from '@fiaro-app/contracts';

/**
 * Cuerpo de `POST /loans/:loanId/collection-visits`. `id` lo genera quien cobra (llave de idempotencia);
 * `payment` solo con `PAID` y `promisedDate` solo con `RESCHEDULED` (lo valida la API).
 */
export const CreateVisitBodySchema = z.strictObject({
  id: IdSchema,
  outcome: VisitOutcomeSchema,
  promisedDate: z.iso.date().nullable().optional(),
  occurredAt: InstantSchema,
  payment: z
    .strictObject({ amount: z.int().positive(), method: PaymentMethodSchema.optional() })
    .nullable()
    .optional(),
});
export type CreateVisitBody = z.infer<typeof CreateVisitBodySchema>;

/**
 * Visitas de cobro y reversión de pagos. `@fiaro-app/contracts` publica los schemas base pero no
 * estos endpoints: se declaran aquí (mismo plan de migración que W-13).
 */
export const visitEndpoints = {
  list: defineEndpoint({
    method: 'GET',
    path: '/loans/:loanId/collection-visits',
    summary: 'Visitas de cobro de un préstamo, con su pago y su reversión.',
    params: z.object({ loanId: IdSchema }),
    response: z.array(CollectionVisitSchema),
  }),
  report: defineEndpoint({
    method: 'QUERY',
    path: '/collection-visits',
    summary: 'Cobros del día: las visitas de todo el negocio, con filtros (solo Owner y Lender).',
    body: VisitReportBodySchema,
    response: CollectionVisitReportSchema,
  }),
  create: defineEndpoint({
    method: 'POST',
    path: '/loans/:loanId/collection-visits',
    summary: 'Registra una visita de cobro con su pago, si lo hubo (rol Collector y préstamo asignado a quien cobra).',
    params: z.object({ loanId: IdSchema }),
    body: CreateVisitBodySchema,
    response: CollectionVisitSchema,
  }),
  reversePayment: defineEndpoint({
    method: 'POST',
    path: '/payments/:id/reversals',
    summary: 'Anula un pago con un motivo (solo el prestamista).',
    params: z.object({ id: IdSchema }),
    body: z.strictObject({ reason: z.string().trim().min(1) }),
    response: PaymentReversalSchema,
  }),
} as const;
