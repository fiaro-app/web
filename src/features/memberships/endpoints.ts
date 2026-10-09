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
export const InvitedMembershipSchema = MembershipSchema.extend({
  fullName: z.string(),
  phone: z.string(),
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
  list: defineEndpoint({
    method: 'QUERY',
    path: '/memberships',
    summary: 'Lista paginada de colaboradores, con filtros por estado y rol.',
    body: ListMembershipsBodySchema,
    response: paginated(MembershipListEntrySchema),
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
  resetPassword: defineEndpoint({
    method: 'POST',
    path: '/memberships/:id/reset-password',
    summary: 'Genera una contraseña temporal nueva para el colaborador.',
    params: MembershipParamsSchema,
    response: ResetMembershipPasswordSchema,
  }),
} as const;
