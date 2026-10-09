import {
  MembershipSchema,
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

/**
 * Colaboradores del prestamista (D-92). El listado solo lo puede ver quien edita (Owner o Lender);
 * un cobrador recibe 403. Los schemas son del contrato; el endpoint aún no.
 */
export const membershipEndpoints = {
  list: defineEndpoint({
    method: 'QUERY',
    path: '/memberships',
    summary: 'Lista paginada de colaboradores, con filtros por estado y rol.',
    body: ListMembershipsBodySchema,
    response: paginated(MembershipListEntrySchema),
  }),
} as const;
