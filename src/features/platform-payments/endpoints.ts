import { defineEndpoint } from '@fiaro-app/contracts';
import { z } from 'zod';

/** Cómo se devuelve un pago: anulándolo en Wompi (solo tarjeta) o registrando una devolución hecha por otro lado. */
export const REFUND_MODES = ['WOMPI_VOID', 'MANUAL'] as const;
export type RefundMode = (typeof REFUND_MODES)[number];

const STATUSES = ['PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR', 'REFUNDED'] as const;

/** Un pago del plan de cualquier negocio, con su nombre (D-156 de la API). */
export const PlatformPaymentSchema = z.object({
  reference: z.string(),
  tenantName: z.string(),
  planCode: z.string(),
  months: z.int(),
  amountInCents: z.int(),
  currency: z.string(),
  status: z.enum(STATUSES),
  paymentMethodType: z.string().nullable(),
  createdAt: z.iso.datetime({ offset: true }),
  resolvedAt: z.iso.datetime({ offset: true }).nullable(),
  periodEndsAt: z.iso.datetime({ offset: true }).nullable(),
  refundedAt: z.iso.datetime({ offset: true }).nullable(),
  refundMode: z.enum(REFUND_MODES).nullable(),
});
export type PlatformPayment = z.infer<typeof PlatformPaymentSchema>;

/** Cuerpo de `POST /admin/subscription-payments/:reference/refund`. */
export const RefundBodySchema = z.strictObject({
  mode: z.enum(REFUND_MODES),
  reference: z.string().trim().min(1).max(120).optional(),
  reason: z.string().trim().min(1, 'Escribe el motivo.').max(500),
});
export type RefundBody = z.infer<typeof RefundBodySchema>;

/**
 * Pagos del plan de todos los negocios y su reembolso: solo quien opera la plataforma (D-156 de la API).
 * `@fiaro-app/contracts` aún no publica estos endpoints: se declaran aquí.
 */
export const platformPaymentEndpoints = {
  list: defineEndpoint({
    method: 'GET',
    path: '/admin/subscription-payments',
    summary: 'Los últimos 50 pagos del plan de todos los negocios (solo quien opera la plataforma).',
    response: z.object({ items: z.array(PlatformPaymentSchema) }),
  }),
  refund: defineEndpoint({
    method: 'POST',
    path: '/admin/subscription-payments/:reference/refund',
    summary: 'Devuelve por completo un pago aprobado y le resta sus meses al plan.',
    params: z.object({ reference: z.string().min(1) }),
    body: RefundBodySchema,
    response: z.object({ reference: z.string(), status: z.enum(STATUSES) }).passthrough(),
  }),
} as const;
