import {
  BusinessDateSchema,
  IdSchema,
  LoanFrequencySchema,
  LoanSchema,
  LoanStatusSchema,
  PageQuerySchema,
  PositiveCopAmountSchema,
  defineEndpoint,
  paginated,
} from '@fiaro-app/contracts';
import { z } from 'zod';

/** Préstamo tal como lo devuelve la API: coincide con `LoanSchema` del contrato. */
export const LoanResponseSchema = LoanSchema;
export type LoanResponse = z.infer<typeof LoanResponseSchema>;

/** Cuerpo de `POST /loans`. Fiaro no calcula intereses: todos los montos los ingresa el prestamista. */
export const CreateLoanBodySchema = z.strictObject({
  clientId: IdSchema,
  principalAmount: PositiveCopAmountSchema,
  installmentCount: z.int().min(1),
  installmentValue: PositiveCopAmountSchema,
  totalPayable: PositiveCopAmountSchema,
  frequency: LoanFrequencySchema,
  startDate: BusinessDateSchema,
});

/** Cuerpo de `QUERY /loans`: página y filtros opcionales por cliente y estado. */
export const ListLoansBodySchema = PageQuerySchema.extend({
  clientId: IdSchema.optional(),
  status: LoanStatusSchema.optional(),
});

const LoanParamsSchema = z.object({ id: IdSchema });

/**
 * Préstamos del prestamista. `@fiaro-app/contracts` publica `LoanSchema` pero no los endpoints:
 * se declaran aquí (mismo plan de migración que `features/clients/endpoints.ts`).
 */
export const loanEndpoints = {
  create: defineEndpoint({
    method: 'POST',
    path: '/loans',
    summary: 'Da de alta un préstamo (solo Owner y Lender).',
    body: CreateLoanBodySchema,
    response: LoanResponseSchema,
  }),
  get: defineEndpoint({
    method: 'GET',
    path: '/loans/:id',
    summary: 'Un préstamo del prestamista de la sesión.',
    params: LoanParamsSchema,
    response: LoanResponseSchema,
  }),
  list: defineEndpoint({
    method: 'QUERY',
    path: '/loans',
    summary: 'Lista paginada de préstamos, con filtros por cliente y estado.',
    body: ListLoansBodySchema,
    response: paginated(LoanResponseSchema),
  }),
  cancel: defineEndpoint({
    method: 'POST',
    path: '/loans/:id/cancel',
    summary: 'Anula un préstamo ACTIVE (error de registro, antes de recibir pagos).',
    params: LoanParamsSchema,
    response: LoanResponseSchema,
  }),
} as const;
