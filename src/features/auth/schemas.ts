import { MobilePhoneSchema, toColombianE164 } from '@fiaro-app/contracts';
import { z } from 'zod';
import { PASSWORD_MAX_LENGTH } from '@/features/auth/password-policy';

/**
 * Datos del formulario de inicio de sesión. El celular se escribe como la gente lo escribe
 * (`300 123 4567`) y sale en E.164 (`+573001234567`), validado con `MobilePhoneSchema` del
 * contrato. La contraseña solo exige no estar vacía: su política se aplica al crearla, no al
 * usarla, para no revelarla a quien prueba contraseñas.
 */
export const SignInFormSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, 'Escribe tu celular.')
    .transform((value) => toColombianE164(value) ?? value)
    .pipe(MobilePhoneSchema),
  password: z
    .string()
    .min(1, 'Escribe tu contraseña.')
    .max(PASSWORD_MAX_LENGTH, 'La contraseña es demasiado larga.'),
});
export type SignInFormInput = z.input<typeof SignInFormSchema>;
export type SignInFormValues = z.output<typeof SignInFormSchema>;
export type SignInField = keyof SignInFormInput;
