import { MobilePhoneSchema, toColombianE164 } from '@fiaro-app/contracts';
import { z } from 'zod';

/** Aviso cuando no se dejó ni celular ni correo: se muestra bajo el celular y hace falta uno de los dos. */
export const CONTACT_METHOD_REQUIRED = 'Déjanos tu celular o tu correo para poder responderte.';

const optionalPhone = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : (toColombianE164(value) ?? value)))
  .pipe(MobilePhoneSchema.optional());

const optionalEmail = z
  .string()
  .trim()
  .pipe(z.union([z.literal(''), z.email('Escribe un correo válido.')]))
  .transform((value) => (value === '' ? undefined : value));

/** Formulario «Contactar ventas»: nombre y mensaje obligatorios, y al menos un medio para responder. */
export const ContactFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Escribe tu nombre.').max(120, 'El nombre es demasiado largo.'),
    phone: optionalPhone,
    email: optionalEmail,
    message: z.string().trim().min(10, 'Cuéntanos un poco más (al menos 10 caracteres).').max(2000, 'El mensaje es demasiado largo.'),
  })
  .refine((values) => values.phone !== undefined || values.email !== undefined, { message: CONTACT_METHOD_REQUIRED, path: ['phone'] });
export type ContactFormValues = z.output<typeof ContactFormSchema>;
export type ContactField = 'name' | 'phone' | 'email' | 'message';
