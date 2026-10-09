import {
  BusinessNameSchema,
  IdSchema,
  MobilePhoneSchema,
  NationalIdSchema,
  PersonNameSchema,
  defineEndpoint,
} from '@fiaro-app/contracts';
import { z } from 'zod';
import { PASSWORD_MAX_LENGTH } from '@/features/auth/password-policy';

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
});

/** Sesión vigente y su persona. `null` (cuerpo `null`) cuando no hay sesión. */
export const SessionSchema = z
  .object({ session: z.looseObject({ id: IdSchema }), user: AuthUserSchema })
  .nullable();

export const authEndpoints = {
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
