import { z } from 'zod';
import { phoneField } from '@/features/auth/phone-field';
import { PASSWORD_MAX_LENGTH } from '@/features/auth/password-policy';

/**
 * Quien entra escribe su celular o su correo en un solo campo: con `@` es un correo (sale en
 * minúsculas); si no, es un celular que se escribe como la gente lo escribe (`300 123 4567`) y sale
 * en E.164 (`+573001234567`), validado con `MobilePhoneSchema` del contrato.
 */
const identifier = z
  .string()
  .trim()
  .min(1, 'Escribe tu correo o celular.')
  .transform((value, ctx) => {
    const parsed = value.includes('@') ? z.email('Escribe un correo válido, por ejemplo tu@correo.com.').safeParse(value) : phoneField.safeParse(value);
    if (parsed.success) return value.includes('@') ? value.toLowerCase() : parsed.data;
    ctx.addIssue({ code: 'custom', message: parsed.error.issues[0]?.message ?? 'Escribe un correo o un celular válido.' });
    return z.NEVER;
  });

/**
 * Datos del formulario de inicio de sesión. La contraseña solo exige no estar vacía: su política se aplica al crearla, no al
 * usarla, para no revelarla a quien prueba contraseñas.
 */
export const SignInFormSchema = z.object({
  identifier,
  password: z
    .string()
    .min(1, 'Escribe tu contraseña.')
    .max(PASSWORD_MAX_LENGTH, 'La contraseña es demasiado larga.'),
});
export type SignInFormInput = z.input<typeof SignInFormSchema>;
export type SignInFormValues = z.output<typeof SignInFormSchema>;
export type SignInField = keyof SignInFormInput;
