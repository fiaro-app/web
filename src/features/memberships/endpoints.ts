import {
  IdSchema,
  MembershipSchema,
  MobilePhoneSchema,
  PageQuerySchema,
  RoleSchema,
  MembershipStatusSchema,
  defineEndpoint,
  paginated,
} from '@fiaro-app/contracts';
import { z } from 'zod';

/** Una membresía con el nombre y el celular de la persona (lo que devuelve el listado). */
export const MembershipListEntrySchema = MembershipSchema.extend({
  fullName: z.string(),
  phone: z.string(),
});
export type MembershipListEntry = z.infer<typeof MembershipListEntrySchema>;

/** Cuerpo de `QUERY /memberships`: página y filtros opcionales por estado y rol. */
export const ListMembershipsBodySchema = PageQuerySchema.extend({
  status: MembershipStatusSchema.optional(),
  role: RoleSchema.optional(),
});

/** Cuerpo de `POST /memberships`: solo el celular se valida estricto; el resto lo decide el caso de uso. */
export const InviteMembershipBodySchema = z.strictObject({
  phone: MobilePhoneSchema,
  fullName: z.string().min(1),
  nationalId: z.string().min(1).optional(),
  contactEmail: z.email().optional(),
  roles: z.array(RoleSchema).min(1),
  portfolioId: IdSchema.optional(),
});

/** Cuerpo de `PATCH /memberships/:id/roles`. */
export const ChangeMembershipRolesBodySchema = z.strictObject({
  roles: z.array(RoleSchema).min(1),
  portfolioId: IdSchema.optional(),
});

/**
 * Respuesta de invitar: la membresía y, solo si la persona no tenía cuenta, la contraseña
 * temporal en claro. Se muestra una sola vez (la API no la vuelve a entregar).
 */
export const InvitedMembershipSchema = z.object({
  membership: MembershipSchema,
  tempPassword: z.string().nullable(),
});
export type InvitedMembership = z.infer<typeof InvitedMembershipSchema>;

/** Respuesta de `POST /memberships/:id/reset-password`. */
export const ResetMembershipPasswordSchema = z.object({ tempPassword: z.string() });

const MembershipParamsSchema = z.object({ id: IdSchema });

/**
 * Colaboradores del prestamista (D-92). El listado solo lo puede ver quien edita (Owner o Lender);
 * un cobrador recibe 403. Los schemas son del contrato; los endpoints se declaran aquí hasta que el paquete los publique.
 */
export const membershipEndpoints = {
  me: defineEndpoint({
    method: 'GET',
    path: '/memberships/me',
    summary: 'La membresía de quien llama, con sus roles; la puede pedir cualquier rol (D-124).',
    response: MembershipSchema,
  }),
  list: defineEndpoint({
    method: 'QUERY',
    path: '/memberships',
    summary: 'Lista paginada de colaboradores, con filtros por estado y rol.',
    body: ListMembershipsBodySchema,
    response: paginated(MembershipListEntrySchema),
  }),
  get: defineEndpoint({
    method: 'GET',
    path: '/memberships/:id',
    summary: 'Detalle de un colaborador, con la misma forma que una fila del listado (solo Owner y Lender).',
    params: MembershipParamsSchema,
    response: MembershipListEntrySchema,
  }),
  invite: defineEndpoint({
    method: 'POST',
    path: '/memberships',
    summary: 'Invita a una persona con sus roles; devuelve la contraseña temporal si no tenía cuenta.',
    body: InviteMembershipBodySchema,
    response: InvitedMembershipSchema,
  }),
  changeRoles: defineEndpoint({
    method: 'PATCH',
    path: '/memberships/:id/roles',
    summary: 'Cambia los roles (y la cartera) de un colaborador.',
    params: MembershipParamsSchema,
    body: ChangeMembershipRolesBodySchema,
    response: MembershipSchema,
  }),
  deactivate: defineEndpoint({
    method: 'POST',
    path: '/memberships/:id/deactivate',
    summary: 'Quita el acceso de inmediato y conserva todo el historial.',
    params: MembershipParamsSchema,
    response: MembershipSchema,
  }),
  reactivate: defineEndpoint({
    method: 'POST',
    path: '/memberships/:id/reactivate',
    summary: 'Devuelve el acceso con los mismos roles y cartera; si cobra, ocupa un cupo del plan (D-116).',
    params: MembershipParamsSchema,
    response: MembershipSchema,
  }),
  remove: defineEndpoint({
    method: 'DELETE',
    path: '/memberships/:id',
    summary: 'Borra un registro por error: solo sin asignaciones, visitas ni cuadres (D-116).',
    params: MembershipParamsSchema,
    response: z.undefined(),
  }),
  resetPassword: defineEndpoint({
    method: 'POST',
    path: '/memberships/:id/reset-password',
    summary: 'Genera una contraseña temporal nueva para el colaborador.',
    params: MembershipParamsSchema,
    response: ResetMembershipPasswordSchema,
  }),
} as const;
