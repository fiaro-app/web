import { PaymentMethodSchema, VisitOutcomeSchema } from '@fiaro-app/contracts';
import { z } from 'zod';
import { VISITS_TEXT } from '@/content/visits';

const errors = VISITS_TEXT.collect.errors;

/** Formulario «Registrar cobro»: el monto solo aplica si pagó y la fecha prometida solo si reprogramó. */
export const CollectionFormSchema = z
  .object({
    outcome: VisitOutcomeSchema,
    amount: z.number().int().positive().nullable(),
    method: PaymentMethodSchema,
    promisedDate: z.string(),
  })
  .superRefine((values, context) => {
    if (values.outcome === 'PAID' && values.amount === null) context.addIssue({ code: 'custom', path: ['amount'], message: errors.amount });
    if (values.outcome === 'RESCHEDULED' && !/^\d{4}-\d{2}-\d{2}$/.test(values.promisedDate)) {
      context.addIssue({ code: 'custom', path: ['promisedDate'], message: errors.promisedDate });
    }
  });
export type CollectionFormInput = z.input<typeof CollectionFormSchema>;
export type CollectionField = 'amount' | 'promisedDate';
