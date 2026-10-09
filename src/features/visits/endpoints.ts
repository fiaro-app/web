import {
  DateRangeSchema,
  IdSchema,
  PageQuerySchema,
  PaymentMethodSchema,
  VisitOutcomeSchema,
  defineEndpoint,
  paginated,
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

/** Una visita del reporte «Cobros del día»: con el cliente, el cobrador y el pago, ya resueltos por la API. */
export const VisitReportEntrySchema = z.object({
  visitId: IdSchema,
  occurredAt: InstantSchema,
  outcome: VisitOutcomeSchema,
  expectedAmount: z.int(),
  promisedDate: z.iso.date().nullable(),
  loan: z.object({ id: IdSchema }),
  client: z.object({ id: IdSchema, fullName: z.string() }),
  collector: z.object({ membershipId: IdSchema, fullName: z.string() }),
  payment: z.object({ id: IdSchema, amount: z.int(), method: PaymentMethodSchema, reversed: z.boolean() }).nullable(),
});
export type VisitReportEntry = z.infer<typeof VisitReportEntrySchema>;

/** Cuerpo de `QUERY /collection-visits`: sin `dateRange` la API entrega solo hoy. */
export const VisitReportBodySchema = PageQuerySchema.extend({
  dateRange: DateRangeSchema.optional(),
  collectorMembershipId: IdSchema.optional(),
  portfolioId: IdSchema.optional(),
  outcome: VisitOutcomeSchema.optional(),
});
export type VisitReportBody = z.infer<typeof VisitReportBodySchema>;

/** Respuesta del reporte: la página de visitas y el rango que la API resolvió. */
export const VisitReportSchema = paginated(VisitReportEntrySchema).extend({
  range: z.object({ from: z.iso.date(), to: z.iso.date() }),
});
export type VisitReport = z.infer<typeof VisitReportSchema>;

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
    response: VisitReportSchema,
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
