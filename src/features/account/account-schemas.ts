import { z } from 'zod';
import { verificationCodeSchema } from '@/features/auth/password-schemas';
import { PASSWORD_MAX_LENGTH } from '@/features/auth/password-policy';

/** Formulario del perfil: el nombre y el correo de contacto (vacío = sin correo). */
export const ProfileFormSchema = z.object({
  fullName: z.string().trim().min(1, 'Escribe tu nombre completo.').max(120, 'El nombre es demasiado largo.'),
  contactEmail: z
    .string()
    .trim()
    .max(254, 'El correo es demasiado largo.')
    .refine((value) => value === '' || z.email().safeParse(value).success, 'Escribe un correo válido.'),
});
export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

/**
 * Lo que cambió respecto al perfil actual, listo para `PATCH /account/profile`; `null` si nada cambió.
 * Un correo vacío se manda como `null` (quitarlo).
 */
export function toProfileChanges(
  values: ProfileFormValues,
  current: { readonly fullName: string; readonly contactEmail: string | null },
): { fullName?: string; contactEmail?: string | null } | null {
  const changes: { fullName?: string; contactEmail?: string | null } = {};
  if (values.fullName !== current.fullName) changes.fullName = values.fullName;
  const email = values.contactEmail === '' ? null : values.contactEmail;
  if (email !== current.contactEmail) changes.contactEmail = email;
  return Object.keys(changes).length === 0 ? null : changes;
}

/** Código de verificación del correo (6 dígitos, se aceptan espacios al pegarlo). */
export const EmailCodeFormSchema = z.object({ code: verificationCodeSchema });

/** Confirmación para desactivar la cuenta: la contraseña actual. */
export const DeactivateFormSchema = z.object({
  password: z.string().min(1, 'Escribe tu contraseña para confirmar.').max(PASSWORD_MAX_LENGTH, 'La contraseña es demasiado larga.'),
});
