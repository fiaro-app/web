import { NationalIdSchema, PersonNameSchema, normalizeNationalId } from '@fiaro-app/contracts';
import { z } from 'zod';
import { phoneField } from '@/features/auth/phone-field';
import type { InviteMembershipBodySchema } from '@/features/memberships/endpoints';

/** Formulario "Invitar administrador". Cada campo repite la regla del contrato detrás de un mensaje en español. */
export const AdminFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Escribe el nombre completo.').max(120, 'El nombre es demasiado largo.').pipe(PersonNameSchema),
  nationalId: z.string().trim().min(1, 'Escribe la cédula.').transform(normalizeNationalId).pipe(NationalIdSchema),
  phone: phoneField,
  contactEmail: z
    .string()
    .trim()
    .min(1, 'Escribe el correo del administrador: ahí le llegan su contraseña y los avisos.')
    .pipe(z.email('Escribe un correo válido, por ejemplo admin@correo.com.')),
});

export type AdminFormInput = { readonly fullName: string; readonly nationalId: string; readonly phone: string; readonly contactEmail: string };
export type AdminField = keyof AdminFormInput;
export type AdminValues = z.output<typeof AdminFormSchema>;

/** Arma el cuerpo de `POST /memberships` para alguien que solo administra (sin cartera: no cobra). */
export function toInviteAdminBody(values: AdminValues): z.input<typeof InviteMembershipBodySchema> {
  return { phone: values.phone, fullName: values.fullName, nationalId: values.nationalId, contactEmail: values.contactEmail, roles: ['LENDER'] };
}
