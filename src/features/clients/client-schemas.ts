import {
  AddressSchema,
  NationalIdSchema,
  OccupationSchema,
  PersonNameSchema,
  PhoneSchema,
  normalizeNationalId,
  toColombianE164,
} from '@fiaro-app/contracts';
import { z } from 'zod';

/**
 * Formulario de cliente (alta y edición). Cada campo repite la regla del contrato detrás de un
 * mensaje en español. El teléfono acepta celular o fijo (`PhoneSchema`), a diferencia del de las
 * cuentas de la app, que siempre es celular.
 */
export const ClientFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Escribe el nombre completo.').max(120, 'El nombre es demasiado largo.').pipe(PersonNameSchema),
  nationalId: z.string().trim().min(1, 'Escribe la cédula.').transform(normalizeNationalId).pipe(NationalIdSchema),
  phone: z
    .string()
    .trim()
    .min(1, 'Escribe el teléfono.')
    .transform((value) => toColombianE164(value) ?? value)
    .pipe(PhoneSchema),
  occupation: z.string().trim().min(1, 'Escribe el oficio.').pipe(OccupationSchema),
  address: z.string().trim().min(1, 'Escribe la dirección.').pipe(AddressSchema),
});

export type ClientFormInput = {
  readonly fullName: string;
  readonly nationalId: string;
  readonly phone: string;
  readonly occupation: string;
  readonly address: string;
};
export type ClientField = keyof ClientFormInput;
export type ClientValues = z.output<typeof ClientFormSchema>;

/**
 * Cuerpo de `PATCH /clients/:id` con solo lo que cambió respecto al cliente guardado (la API deja
 * intacto lo que no se envía). `null` si no hay ningún cambio.
 */
export function toClientChanges(values: ClientValues, current: ClientValues): Partial<ClientValues> | null {
  const changes: Partial<ClientValues> = {};
  for (const field of Object.keys(values) as ClientField[]) {
    if (values[field] !== current[field]) changes[field] = values[field];
  }
  return Object.keys(changes).length > 0 ? changes : null;
}
