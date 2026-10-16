import { BusinessDateSchema, IdSchema, LoanFrequencySchema, PageQuerySchema, defineEndpoint, paginated } from '@fiaro-app/contracts';
import { z } from 'zod';

export const LOAN_REQUEST_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const;
export type LoanRequestStatus = (typeof LOAN_REQUEST_STATUSES)[number];

const NewClientSchema = z.object({
  fullName: z.string(),
  occupation: z.string(),
  phone: z.string(),
  address: z.string(),
});

/** Solicitud de préstamo de un cobrador, tal como la devuelve la API (D-138 de la API). */
export const LoanRequestSchema = z.object({
  id: IdSchema,
  status: z.enum(LOAN_REQUEST_STATUSES),
  requestedByMembershipId: IdSchema,
  clientId: IdSchema.nullable(),
  nationalId: z.string(),
  newClient: NewClientSchema.nullable(),
  principalAmount: z.int(),
  installmentCount: z.int(),
  installmentValue: z.int(),
  totalPayable: z.int(),
  frequency: LoanFrequencySchema,
  startDate: BusinessDateSchema,
  resolvedAt: z.string().nullable(),
  rejectionReason: z.string().nullable(),
  loanId: IdSchema.nullable(),
  createdAt: z.string(),
});
export type LoanRequest = z.infer<typeof LoanRequestSchema>;

/** Ajustes que el administrador puede hacer al aceptar: solo viaja lo que cambió. */
export const ApproveLoanRequestBodySchema = z.strictObject({
  client: NewClientSchema.partial().optional(),
  loan: z
    .strictObject({
      principalAmount: z.int(),
      installmentCount: z.int(),
      installmentValue: z.int(),
      totalPayable: z.int(),
      frequency: LoanFrequencySchema,
      startDate: BusinessDateSchema,
    })
    .partial()
    .optional(),
});
export type ApproveLoanRequestBody = z.infer<typeof ApproveLoanRequestBodySchema>;

const ParamsSchema = z.object({ id: IdSchema });

/** `@fiaro-app/contracts` aún no publica estos endpoints: mismo patrón que `features/risk/endpoints.ts`. */
export const loanRequestEndpoints = {
  list: defineEndpoint({
    method: 'QUERY',
    path: '/loan-requests',
    summary: 'Solicitudes de préstamo de los cobradores (las de todos para quien administra).',
    body: PageQuerySchema.extend({ status: z.enum(LOAN_REQUEST_STATUSES).optional() }),
    response: paginated(LoanRequestSchema),
  }),
  approve: defineEndpoint({
    method: 'POST',
    path: '/loan-requests/:id/approve',
    summary: 'Acepta la solicitud: crea el cliente (si era nuevo), el préstamo y su asignación.',
    params: ParamsSchema,
    body: ApproveLoanRequestBodySchema,
    response: LoanRequestSchema,
  }),
  reject: defineEndpoint({
    method: 'POST',
    path: '/loan-requests/:id/reject',
    summary: 'Rechaza la solicitud, con un motivo opcional que ve el cobrador.',
    params: ParamsSchema,
    body: z.strictObject({ reason: z.string().optional() }),
    response: LoanRequestSchema,
  }),
} as const;
