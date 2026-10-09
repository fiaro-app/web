import { BusinessDateSchema, IdSchema, LoanFrequencySchema, MAX_INSTALLMENT_COUNT, PositiveCopAmountSchema } from '@fiaro-app/contracts';
import { z } from 'zod';

const amount = (missing: string) =>
  z
    .number({ error: missing })
    .nullable()
    .refine((value): value is number => value !== null, missing)
    .pipe(PositiveCopAmountSchema);

/**
 * Formulario de préstamo. El estado del formulario guarda los montos como número (o `null` si el
 * campo está vacío) y el número de cuotas como texto; el esquema los valida con las reglas del
 * contrato y deja mensajes en español.
 */
export const LoanFormSchema = z.object({
  clientId: z.string().min(1, 'Elige el cliente.').pipe(IdSchema),
  principalAmount: amount('Escribe el monto prestado.'),
  installmentCount: z
    .string()
    .trim()
    .regex(/^\d+$/, 'Escribe el número de cuotas.')
    .transform(Number)
    .pipe(z.int().min(1, 'Debe ser al menos 1 cuota.').max(MAX_INSTALLMENT_COUNT, `No puede pasar de ${String(MAX_INSTALLMENT_COUNT)} cuotas.`)),
  installmentValue: amount('Escribe el valor de cada cuota.'),
  totalPayable: amount('Escribe el total a pagar.'),
  frequency: z.string().min(1, 'Elige cada cuánto se cobra.').pipe(LoanFrequencySchema),
  startDate: z.string().min(1, 'Elige la fecha de inicio.').pipe(BusinessDateSchema),
});

export type LoanFormInput = {
  readonly clientId: string;
  readonly principalAmount: number | null;
  readonly installmentCount: string;
  readonly installmentValue: number | null;
  readonly totalPayable: number | null;
  readonly frequency: string;
  readonly startDate: string;
};
export type LoanField = keyof LoanFormInput;
export type LoanValues = z.output<typeof LoanFormSchema>;
