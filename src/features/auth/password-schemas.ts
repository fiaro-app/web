import { z } from 'zod';
import { phoneField } from '@/features/auth/phone-field';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, VERIFICATION_CODE_LENGTH } from '@/features/auth/password-policy';

/**
 * Contraseña **nueva** (al crearla o cambiarla): solo la longitud que exige la API. Que no sea de
 * las más usadas o deducible del celular lo decide la API (`PASSWORD_TOO_WEAK`), no la web.
 */
export const newPasswordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Usa al menos ${String(PASSWORD_MIN_LENGTH)} caracteres.`)
  .max(PASSWORD_MAX_LENGTH, 'La contraseña es demasiado larga.');

/** Código de recuperación: solo dígitos, tal como llega por correo (se aceptan espacios al pegarlo). */
export const verificationCodeSchema = z
  .string()
  .trim()
  .transform((value) => value.replaceAll(/\s/g, ''))
  .pipe(
    z
      .string()
      .min(1, 'Escribe el código que te enviamos.')
      .regex(new RegExp(String.raw`^\d{${String(VERIFICATION_CODE_LENGTH)}}$`), `El código tiene ${String(VERIFICATION_CODE_LENGTH)} dígitos.`),
  );

/** Pide repetir la contraseña nueva: el error se muestra en el campo de confirmación. */
export const CONFIRMATION_MISMATCH = 'Las contraseñas no coinciden.';
export function passwordsMatch<T extends { newPassword: string; confirmPassword: string }>(values: T): boolean {
  return values.newPassword === values.confirmPassword;
}
const confirmation = { message: CONFIRMATION_MISMATCH, path: ['confirmPassword'] };

/** Paso 1 de recuperar: a qué celular se manda el código. */
export const RequestResetFormSchema = z.object({ phone: phoneField });

/** Paso 2 de recuperar: el código y la contraseña nueva (repetida). */
export const ResetPasswordFormSchema = z
  .object({
    code: verificationCodeSchema,
    newPassword: newPasswordSchema,
    confirmPassword: z.string().min(1, 'Repite la contraseña.'),
  })
  .refine(passwordsMatch, confirmation);

/** Cambio de contraseña con sesión (la temporal es la actual). */
export const ChangePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Escribe tu contraseña actual.').max(PASSWORD_MAX_LENGTH, 'La contraseña es demasiado larga.'),
    newPassword: newPasswordSchema,
    confirmPassword: z.string().min(1, 'Repite la contraseña.'),
  })
  .refine(passwordsMatch, confirmation)
  .refine((values) => values.currentPassword !== values.newPassword, {
    message: 'La contraseña nueva debe ser distinta de la actual.',
    path: ['newPassword'],
  });
