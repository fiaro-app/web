import { defineEndpoint } from '@fiaro-app/contracts';
import { z } from 'zod';
import { PASSWORD_MAX_LENGTH, VERIFICATION_CODE_LENGTH } from '@/features/auth/password-policy';

const StatusSchema = z.object({ status: z.literal(true) });

/** Cuerpo de `PATCH /account/profile`: un campo ausente no se toca y debe venir al menos uno. */
export const UpdateProfileBodySchema = z
  .strictObject({
    fullName: z.string().min(1).optional(),
    contactEmail: z.email().nullable().optional(),
  })
  .refine((body) => body.fullName !== undefined || body.contactEmail !== undefined, {
    message: 'Debes enviar al menos un campo para actualizar.',
  });

/** Lo que devuelve `PATCH /account/profile`. */
export const ProfileSchema = z.object({
  fullName: z.string(),
  contactEmail: z.email().nullable(),
  contactEmailVerified: z.boolean(),
});
export type Profile = z.infer<typeof ProfileSchema>;

/** Una sesión abierta de la persona (`GET /account/sessions`); nunca trae el token. */
export const AccountSessionSchema = z.object({
  id: z.uuid(),
  /** Es la sesión desde la que se hizo la consulta. */
  isCurrent: z.boolean(),
  device: z.object({ client: z.string().nullable(), os: z.string().nullable(), label: z.string() }),
  ipAddress: z.string().nullable(),
  createdAt: z.iso.datetime({ offset: true }),
  /** Último uso, con precisión de un día. */
  lastUsedAt: z.iso.datetime({ offset: true }),
  expiresAt: z.iso.datetime({ offset: true }),
});
export type AccountSession = z.infer<typeof AccountSessionSchema>;

/**
 * Endpoints de la cuenta de la persona (perfil, correo de contacto y sesiones). `@fiaro-app/contracts`
 * todavía no los publica: se declaran aquí (mismo plan de migración que W-13).
 */
export const accountEndpoints = {
  updateProfile: defineEndpoint({
    method: 'PATCH',
    path: '/account/profile',
    summary: 'Cambia el nombre y/o el correo de contacto; cambiar el correo reinicia su verificación.',
    body: UpdateProfileBodySchema,
    response: ProfileSchema,
  }),
  requestContactEmailVerification: defineEndpoint({
    method: 'POST',
    path: '/account/contact-email/request-verification',
    summary: 'Manda un código de verificación al correo de contacto.',
    response: StatusSchema,
  }),
  verifyContactEmail: defineEndpoint({
    method: 'POST',
    path: '/account/contact-email/verify',
    summary: 'Verifica el correo de contacto con el código recibido.',
    body: z.strictObject({ code: z.string().regex(new RegExp(String.raw`^\d{${String(VERIFICATION_CODE_LENGTH)}}$`)) }),
    response: StatusSchema,
  }),
  deactivate: defineEndpoint({
    method: 'POST',
    path: '/account/deactivate',
    summary: 'Desactiva la cuenta de la persona, con su contraseña como confirmación.',
    body: z.strictObject({ password: z.string().min(1).max(PASSWORD_MAX_LENGTH) }),
    response: StatusSchema,
  }),
  sessions: defineEndpoint({
    method: 'GET',
    path: '/account/sessions',
    summary: 'Las sesiones vigentes de la persona, con su dispositivo y último uso.',
    response: z.array(AccountSessionSchema),
  }),
  revokeSession: defineEndpoint({
    method: 'DELETE',
    path: '/account/sessions/:id',
    summary: 'Cierra una sesión puntual de la persona; la actual da 409 (para salir existe el cierre de sesión).',
    params: z.object({ id: z.uuid() }),
    response: z.undefined(),
  }),
  revokeOtherSessions: defineEndpoint({
    method: 'POST',
    path: '/auth/revoke-other-sessions',
    summary: 'Cierra todas las sesiones de la persona salvo la de este navegador.',
    response: StatusSchema,
  }),
  revokeSessions: defineEndpoint({
    method: 'POST',
    path: '/auth/revoke-sessions',
    summary: 'Cierra todas las sesiones de la persona, la de este navegador incluida.',
    response: StatusSchema,
  }),
} as const;
