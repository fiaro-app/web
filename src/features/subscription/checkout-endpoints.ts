import { defineEndpoint } from '@fiaro-app/contracts';
import { z } from 'zod';

/** Los planes que se pueden pagar: todos menos la prueba. */
export const PURCHASABLE_PLAN_CODES = ['INDIVIDUAL', 'PRO', 'TEAM'] as const;

/** Código de un plan de {@link PURCHASABLE_PLAN_CODES}. */
export type PurchasablePlanCode = (typeof PURCHASABLE_PLAN_CODES)[number];

/** Cuerpo de `POST /subscription/checkout`: solo el plan; el monto lo pone el servidor. */
export const CheckoutBodySchema = z.strictObject({ planCode: z.enum(PURCHASABLE_PLAN_CODES) });

/** Respuesta de `POST /subscription/checkout`: la orden y los campos que se mandan a la página de pago de Wompi. */
export const CheckoutSchema = z.object({
  reference: z.string(),
  planCode: z.enum(PURCHASABLE_PLAN_CODES),
  months: z.int(),
  checkout: z.object({
    url: z.url(),
    publicKey: z.string(),
    currency: z.string(),
    amountInCents: z.int(),
    reference: z.string(),
    signatureIntegrity: z.string(),
    redirectUrl: z.url(),
  }),
});
export type Checkout = z.infer<typeof CheckoutSchema>;

/** Cómo va una orden de pago: `PENDING` hasta que Wompi avisa a la API. */
export const CHECKOUT_STATUSES = ['PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR'] as const;

/** Respuesta de `GET /subscription/checkout/:reference`. */
export const CheckoutStatusSchema = z.object({
  reference: z.string(),
  planCode: z.enum(PURCHASABLE_PLAN_CODES),
  status: z.enum(CHECKOUT_STATUSES),
  amountInCents: z.int(),
  currency: z.string(),
  createdAt: z.iso.datetime({ offset: true }),
  resolvedAt: z.iso.datetime({ offset: true }).nullable(),
  periodEndsAt: z.iso.datetime({ offset: true }).nullable(),
});
export type CheckoutStatus = z.infer<typeof CheckoutStatusSchema>;

/** Una orden del historial: lo de {@link CheckoutStatusSchema} más los meses y el medio de pago. */
export const PaymentHistoryItemSchema = CheckoutStatusSchema.extend({
  months: z.int(),
  paymentMethodType: z.string().nullable(),
});
export type PaymentHistoryItem = z.infer<typeof PaymentHistoryItemSchema>;

/** Respuesta de `GET /subscription/payments`: de la orden más reciente a la más vieja. */
export const PaymentHistorySchema = z.object({ items: z.array(PaymentHistoryItemSchema) });

/**
 * Pago de la suscripción con Wompi (D-149 de la API). `@fiaro-app/contracts` aún no publica estos
 * endpoints: se declaran aquí (mismo plan de migración que `subscriptionEndpoints`).
 */
export const checkoutEndpoints = {
  create: defineEndpoint({
    method: 'POST',
    path: '/subscription/checkout',
    summary: 'Crea la orden de pago de un mes del plan (solo Owner) y devuelve los campos del checkout de Wompi.',
    body: CheckoutBodySchema,
    response: CheckoutSchema,
  }),
  status: defineEndpoint({
    method: 'GET',
    path: '/subscription/checkout/:reference',
    summary: 'En qué quedó una orden de pago (solo Owner).',
    params: z.object({ reference: z.string().min(1) }),
    response: CheckoutStatusSchema,
  }),
  payments: defineEndpoint({
    method: 'GET',
    path: '/subscription/payments',
    summary: 'El historial de pagos del plan (solo Owner), de la orden más reciente a la más vieja.',
    response: PaymentHistorySchema,
  }),
} as const;
