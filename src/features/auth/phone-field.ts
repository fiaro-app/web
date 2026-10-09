import { MobilePhoneSchema, toColombianE164 } from '@fiaro-app/contracts';
import { z } from 'zod';

/**
 * Campo "celular" de todos los formularios: se escribe como la gente lo escribe (`300 123 4567`) y
 * sale en E.164 (`+573001234567`), validado con `MobilePhoneSchema` del contrato.
 */
export const phoneField = z
  .string()
  .trim()
  .min(1, 'Escribe tu celular.')
  .transform((value) => toColombianE164(value) ?? value)
  .pipe(MobilePhoneSchema);
