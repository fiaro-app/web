import { NationalIdSchema, PersonNameSchema, IdSchema, normalizeNationalId } from '@fiaro-app/contracts';
import { z } from 'zod';
import { phoneField } from '@/features/auth/phone-field';
import { InviteMembershipBodySchema } from '@/features/memberships/endpoints';

/**
 * Formulario "Registrar cobrador". Cada campo repite la regla del contrato detrás de un mensaje en
 * español; el contrato sigue decidiendo qué es válido.
 */
export const CollectorFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Escribe el nombre completo.')
    .max(120, 'El nombre es demasiado largo.')
    .pipe(PersonNameSchema),
  nationalId: z
    .string()
    .trim()
    .min(1, 'Escribe la cédula.')
    .transform(normalizeNationalId)
    .pipe(NationalIdSchema),
  phone: phoneField,
  /** Obligatorio (D-120): es por donde le llegan su contraseña temporal y los avisos. */
  contactEmail: z
    .string()
    .trim()
    .min(1, 'Escribe el correo del cobrador: ahí le llegan su contraseña y los avisos.')
    .pipe(z.email('Escribe un correo válido, por ejemplo cobrador@correo.com.')),
  portfolioId: z.string().min(1, 'Elige la cartera del cobrador.').pipe(IdSchema),
});

export type CollectorFormInput = {
  readonly fullName: string;
  readonly nationalId: string;
  readonly phone: string;
  readonly contactEmail: string;
  readonly portfolioId: string;
};
export type CollectorField = keyof CollectorFormInput;
export type CollectorValues = z.output<typeof CollectorFormSchema>;

/** Arma el cuerpo de `POST /memberships` para un colaborador que solo cobra. */
export function toInviteCollectorBody(values: CollectorValues): z.input<typeof InviteMembershipBodySchema> {
  return {
    phone: values.phone,
    fullName: values.fullName,
    nationalId: values.nationalId,
    contactEmail: values.contactEmail,
    roles: ['COLLECTOR'],
    portfolioId: values.portfolioId,
  };
}
