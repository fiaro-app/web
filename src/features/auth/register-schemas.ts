import {
  BusinessNameSchema,
  MobilePhoneSchema,
  NationalIdSchema,
  PersonNameSchema,
  normalizeNationalId,
  toColombianE164,
} from '@fiaro-app/contracts';
import { z } from 'zod';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/features/auth/password-policy';

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

const phone = z
  .string()
  .trim()
  .min(1, 'Escribe tu celular.')
  .transform((value) => toColombianE164(value) ?? value)
  .pipe(MobilePhoneSchema);

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

const password = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Usa al menos ${String(PASSWORD_MIN_LENGTH)} caracteres.`)
  .max(PASSWORD_MAX_LENGTH, 'La contraseña es demasiado larga.');

const businessName = z
  .string()
  .trim()
  .min(2, 'Escribe el nombre de tu financiera.')
  .max(120, 'El nombre es demasiado largo.')
  .pipe(BusinessNameSchema);

/** Paso 1: la persona (será Owner, Lender y cobrador de su propio negocio). */
export const AccountStepSchema = z.object({ fullName, phone, nationalId, contactEmail, password });

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
