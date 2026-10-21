import { defineEndpoint } from '@fiaro-app/contracts';
import { z } from 'zod';

/** Cuántas filas admite la API por petición (D-152 de la API). */
export const IMPORT_CHUNK_SIZE = 200;

export const IMPORT_FREQUENCIES = ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY'] as const;
export type ImportFrequency = (typeof IMPORT_FREQUENCIES)[number];

/** El préstamo en curso de una fila: solo lo que falta. */
export const ImportLoanSchema = z.object({
  remainingInstallments: z.number(),
  installmentValue: z.number(),
  frequency: z.enum(IMPORT_FREQUENCIES),
  nextInstallmentDate: z.string(),
  pendingCapital: z.number().nullable().optional(),
  collectorPhone: z.string().nullable().optional(),
});

/** Una fila de la hoja: un cliente y, si lo tiene, su préstamo en curso. */
export const ImportRowSchema = z.object({
  nationalId: z.string(),
  fullName: z.string(),
  occupation: z.string(),
  phone: z.string(),
  address: z.string(),
  loan: ImportLoanSchema.nullable().optional(),
});
export type ImportRow = z.infer<typeof ImportRowSchema>;

export const ImportBodySchema = z.object({ dryRun: z.boolean(), rows: z.array(ImportRowSchema).min(1).max(IMPORT_CHUNK_SIZE) });

export const IMPORT_ROW_STATUSES = ['READY', 'INVALID', 'IMPORTED', 'FAILED'] as const;
export type ImportRowStatus = (typeof IMPORT_ROW_STATUSES)[number];

export const ImportRowResultSchema = z.object({
  row: z.int(),
  status: z.enum(IMPORT_ROW_STATUSES),
  client: z.enum(['NEW', 'EXISTING']).nullable(),
  loan: z.boolean(),
  issues: z.array(z.object({ field: z.string(), message: z.string() })),
});
export type ImportRowResult = z.infer<typeof ImportRowResultSchema>;

export const ImportResponseSchema = z.object({
  dryRun: z.boolean(),
  summary: z.object({ rows: z.int(), ok: z.int(), invalid: z.int(), failed: z.int(), newClients: z.int(), loans: z.int() }),
  rows: z.array(ImportRowResultSchema),
});
export type ImportResponse = z.infer<typeof ImportResponseSchema>;

/**
 * Importar clientes y préstamos en curso (D-152 de la API). `@fiaro-app/contracts` aún no publica este
 * endpoint: se declara aquí (mismo plan de migración que `checkoutEndpoints`).
 */
export const importEndpoints = {
  run: defineEndpoint({
    method: 'POST',
    path: '/imports',
    summary: 'Revisa (dryRun) o crea hasta 200 filas de clientes y préstamos en curso (Owner o Lender, plan Pro o Team).',
    body: ImportBodySchema,
    response: ImportResponseSchema,
  }),
} as const;
