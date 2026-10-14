import {
  BusinessDateSchema,
  IdSchema,
  LoanInstallmentsSchema,
  LoanListItemSchema,
  LoanFrequencySchema,
  LoanSchema,
  LoanStatusSchema,
  PageQuerySchema,
  PositiveCopAmountSchema,
  defineEndpoint,
  paginated,
} from '@fiaro-app/contracts';
import { z } from 'zod';

// Schemas del calendario y de la lista con saldo y mora (D-103, D-113): viven en `@fiaro-app/contracts`.
export {
  InstallmentStatusSchema,
  LoanInstallmentSchema,
  LoanInstallmentsSchema,
  LoanListItemSchema,
  type InstallmentStatus,
  type LoanInstallment,
  type LoanListItem,
} from '@fiaro-app/contracts';

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
  /** Solo los préstamos que este cobrador tiene asignados hoy (D-117). */
  collectorMembershipId: IdSchema.optional(),
});

const LoanParamsSchema = z.object({ id: IdSchema });
const LoanIdParamsSchema = z.object({ loanId: IdSchema });

/** Saldo de un préstamo al día de hoy (`GET /loans/:loanId/balance`). */
export const LoanBalanceSchema = z.object({
  loanId: IdSchema,
  asOf: z.iso.date(),
  /** Lo pactado menos lo pagado; nunca baja de cero. */
  balance: z.int().nonnegative(),
  totalExpectedToDate: z.int().nonnegative(),
  /** Lo esperado hasta hoy que sigue sin pagar; cero si está al día. */
  overdueAmount: z.int().nonnegative(),
  /** Días desde la cuota impaga más antigua; cero si está al día o ya cerró. */
  overdueDays: z.int().nonnegative(),
  nextDueDate: z.iso.date().nullable(),
  firstOverdueDate: z.iso.date().nullable(),
});
export type LoanBalance = z.infer<typeof LoanBalanceSchema>;

/** Quién cobra un préstamo y durante qué fechas (`/loans/:loanId/collection-assignments`). */
export const CollectionAssignmentSchema = z.object({
  id: IdSchema,
  loanId: IdSchema,
  collectorMembershipId: IdSchema,
  effectiveFrom: z.iso.date(),
  /** `null`: sin fecha de fin. Igual a `effectiveFrom`: reemplazo de un solo día. */
  effectiveTo: z.iso.date().nullable(),
  createdAt: z.iso.datetime({ offset: true }),
});
export type CollectionAssignment = z.infer<typeof CollectionAssignmentSchema>;

/** Cuerpo de `POST /loans/:loanId/collection-assignments`: sin `effectiveTo` es permanente. */
export const CreateAssignmentBodySchema = z.strictObject({
  collectorMembershipId: IdSchema,
  effectiveFrom: BusinessDateSchema,
  effectiveTo: BusinessDateSchema.nullable().optional(),
});

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
    summary: 'Lista paginada de préstamos con saldo y mora, con filtros por cliente y estado.',
    body: ListLoansBodySchema,
    response: paginated(LoanListItemSchema),
  }),
  cancel: defineEndpoint({
    method: 'POST',
    path: '/loans/:id/cancel',
    summary: 'Anula un préstamo ACTIVE (error de registro, antes de recibir pagos).',
    params: LoanParamsSchema,
    response: LoanResponseSchema,
  }),
  balance: defineEndpoint({
    method: 'GET',
    path: '/loans/:loanId/balance',
    summary: 'Saldo, mora y próxima cuota de un préstamo, al día de hoy.',
    params: LoanIdParamsSchema,
    response: LoanBalanceSchema,
  }),
  installments: defineEndpoint({
    method: 'GET',
    path: '/loans/:loanId/installments',
    summary: 'Calendario de cuotas de un préstamo, con lo pagado y el estado de cada una.',
    params: LoanIdParamsSchema,
    response: LoanInstallmentsSchema,
  }),
  assignments: defineEndpoint({
    method: 'GET',
    path: '/loans/:loanId/collection-assignments',
    summary: 'Historial de cobradores asignados a un préstamo.',
    params: LoanIdParamsSchema,
    response: z.array(CollectionAssignmentSchema),
  }),
  assign: defineEndpoint({
    method: 'POST',
    path: '/loans/:loanId/collection-assignments',
    summary: 'Asigna un cobrador a un préstamo (solo Owner y Lender).',
    params: LoanIdParamsSchema,
    body: CreateAssignmentBodySchema,
    response: CollectionAssignmentSchema,
  }),
} as const;
