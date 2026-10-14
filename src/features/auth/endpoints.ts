import {
  BusinessNameSchema,
  IdSchema,
  MobilePhoneSchema,
  NationalIdSchema,
  PersonNameSchema,
  TurnstileTokenSchema,
  defineEndpoint,
} from '@fiaro-app/contracts';
import { z } from 'zod';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, VERIFICATION_CODE_LENGTH } from '@/features/auth/password-policy';

/**
 * Endpoints de autenticación y registro que consume la web.
 *
 * @remarks
 * `@fiaro-app/contracts` 0.6.0 todavía no publica estos endpoints (solo `system`): sus schemas
 * viven en la API (`modules/auth` y `modules/tenants`). Se declaran aquí con el mismo
 * `defineEndpoint` y los mismos primitivos del contrato (celular, cédula, nombres) para que, cuando
 * pasen al paquete, el cambio sea borrar este archivo y apuntar `authEndpoints` a `endpoints.auth`.
 */

/** Persona autenticada: solo los campos que usa la web; el resto de la respuesta se ignora. */
export const AuthUserSchema = z.looseObject({
  id: IdSchema,
  name: z.string(),
  phoneNumber: MobilePhoneSchema,
  contactEmail: z.email().nullable(),
  /** Si el correo de contacto se verificó con el código (la API lo manda siempre; opcional para no romper sesiones viejas). */
  contactEmailVerified: z.boolean().optional(),
  mustChangePassword: z.boolean(),
});
export type AuthUser = z.infer<typeof AuthUserSchema>;

/** Cuerpo de `POST /auth/sign-in/phone-number`. */
export const SignInBodySchema = z.strictObject({
  phoneNumber: MobilePhoneSchema,
  password: z.string().min(1).max(PASSWORD_MAX_LENGTH),
  rememberMe: z.boolean().optional(),
});

/** Cuerpo de `POST /register`. */
export const RegisterBodySchema = z.strictObject({
  phone: MobilePhoneSchema,
  fullName: PersonNameSchema,
  password: z.string().min(1).max(PASSWORD_MAX_LENGTH),
  nationalId: NationalIdSchema,
  businessName: BusinessNameSchema,
  contactEmail: z.email().optional(),
  turnstileToken: TurnstileTokenSchema.optional(),
});

/** Sesión vigente y su persona. `null` (cuerpo `null`) cuando no hay sesión. */
export const SessionSchema = z
  .object({ session: z.looseObject({ id: IdSchema }), user: AuthUserSchema })
  .nullable();

/** Cuerpo de `POST /auth/request-password-reset`. */
export const RequestPasswordResetBodySchema = z.strictObject({
  phoneNumber: MobilePhoneSchema,
  turnstileToken: TurnstileTokenSchema.optional(),
});

/** Cuerpo de `POST /auth/reset-password`. */
export const ResetPasswordBodySchema = z.strictObject({
  phoneNumber: MobilePhoneSchema,
  code: z.string().regex(new RegExp(String.raw`^\d{${String(VERIFICATION_CODE_LENGTH)}}$`)),
  newPassword: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});

/** Cuerpo de `POST /auth/change-password`. */
export const ChangePasswordBodySchema = z.strictObject({
  currentPassword: z.string().min(1).max(PASSWORD_MAX_LENGTH),
  newPassword: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});

const StatusSchema = z.object({ status: z.literal(true) });

export const authEndpoints = {
  requestPasswordReset: defineEndpoint({
    method: 'POST',
    path: '/auth/request-password-reset',
    summary: 'Manda un código al correo de contacto; responde igual exista o no la cuenta.',
    body: RequestPasswordResetBodySchema,
    response: StatusSchema,
  }),
  resetPassword: defineEndpoint({
    method: 'POST',
    path: '/auth/reset-password',
    summary: 'Canjea el código por una contraseña nueva y cierra todas las sesiones de la persona.',
    body: ResetPasswordBodySchema,
    response: StatusSchema,
  }),
  changePassword: defineEndpoint({
    method: 'POST',
    path: '/auth/change-password',
    summary: 'Cambia la contraseña con la sesión abierta (la temporal es la actual).',
    body: ChangePasswordBodySchema,
    response: z.object({ user: AuthUserSchema }),
  }),
  getSession: defineEndpoint({
    method: 'GET',
    path: '/auth/get-session',
    summary: 'Sesión de la cookie y su persona, o null si no hay sesión vigente.',
    response: SessionSchema,
  }),
  signIn: defineEndpoint({
    method: 'POST',
    path: '/auth/sign-in/phone-number',
    summary: 'Inicia sesión con celular y contraseña; la sesión viaja en una cookie.',
    body: SignInBodySchema,
    response: z.object({ user: AuthUserSchema }),
  }),
  signOut: defineEndpoint({
    method: 'POST',
    path: '/auth/sign-out',
    summary: 'Cierra la sesión de la cookie.',
    response: z.object({ success: z.literal(true) }),
  }),
  register: defineEndpoint({
    method: 'POST',
    path: '/register',
    summary: 'Registra a un dueño y su negocio. No abre sesión: hay que iniciarla después.',
    body: RegisterBodySchema,
    response: z.looseObject({
      user: z.looseObject({ id: IdSchema, phone: MobilePhoneSchema }),
      tenant: z.looseObject({ id: IdSchema, name: z.string() }),
    }),
  }),
} as const;
