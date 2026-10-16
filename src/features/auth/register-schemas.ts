import {
  BusinessNameSchema,
  NationalIdSchema,
  PersonNameSchema,
  normalizeNationalId,
} from '@fiaro-app/contracts';
import { z } from 'zod';
import { newPasswordSchema } from '@/features/auth/password-schemas';
import { phoneField } from '@/features/auth/phone-field';

/**
 * Esquemas del registro. Cada campo repite la regla del contrato (`PersonNameSchema`,
 * `MobilePhoneSchema`, `NationalIdSchema`…) detrás de una comprobación con mensaje propio: la
 * persona ve un texto claro en español y el contrato sigue siendo quien decide qué es válido.
 */

const fullName = z
  .string()
  .trim()
  .min(2, 'Escribe tu nombre completo.')
  .max(120, 'El nombre es demasiado largo.')
  .pipe(PersonNameSchema);

const nationalId = z
  .string()
  .trim()
  .min(1, 'Escribe tu cédula.')
  .transform(normalizeNationalId)
  .pipe(NationalIdSchema);

/** El correo es opcional: vacío se omite; si se escribe, debe ser un correo. */
const contactEmail = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .pipe(z.email('Escribe un correo válido, por ejemplo tu@correo.com.').optional());

const businessName = z
  .string()
  .trim()
  .min(2, 'Escribe el nombre de tu financiera.')
  .max(120, 'El nombre es demasiado largo.')
  .pipe(BusinessNameSchema);

/** Paso 1: la persona (será Owner, Lender y cobrador de su propio negocio). */
export const AccountStepSchema = z.object({ fullName, phone: phoneField, nationalId, contactEmail, password: newPasswordSchema });

/** Paso 2: el negocio. */
export const CompanyStepSchema = z.object({ businessName });

export type RegisterFormInput = {
  readonly fullName: string;
  readonly phone: string;
  readonly nationalId: string;
  readonly contactEmail: string;
  readonly password: string;
  readonly businessName: string;
};
export type RegisterField = keyof RegisterFormInput;
export type AccountValues = z.output<typeof AccountStepSchema>;
export type CompanyValues = z.output<typeof CompanyStepSchema>;

/** Campos de cada paso, en el orden en que se muestran. */
export const REGISTER_STEP_FIELDS = {
  account: ['fullName', 'phone', 'nationalId', 'contactEmail', 'password'],
  company: ['businessName'],
} as const satisfies Record<string, readonly RegisterField[]>;
export type RegisterStep = keyof typeof REGISTER_STEP_FIELDS;
export const REGISTER_STEPS: readonly RegisterStep[] = ['account', 'company'];

/** Lo que se marca al registrarse: las tres primeras son obligatorias; las novedades son opcionales. */
export interface RegisterConsents {
  readonly terms: boolean;
  readonly privacy: boolean;
  readonly responsibility: boolean;
  readonly marketing: boolean;
}

export const EMPTY_CONSENTS: RegisterConsents = { terms: false, privacy: false, responsibility: false, marketing: false };

/** Casillas obligatorias que faltan por marcar. */
export function missingConsents(consents: RegisterConsents): readonly ('terms' | 'privacy' | 'responsibility')[] {
  return (['terms', 'privacy', 'responsibility'] as const).filter((key) => !consents[key]);
}
