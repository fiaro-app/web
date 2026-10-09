import { ClientListItemSchema, ClientSchema, IdSchema, defineEndpoint, paginated, PageQuerySchema, PhoneSchema } from '@fiaro-app/contracts';
import { z } from 'zod';

/** Cliente tal como lo devuelve la API: el contrato sin `updatedAt`, que la respuesta no incluye. */
export const ClientResponseSchema = ClientSchema.omit({ updatedAt: true });
export type ClientResponse = z.infer<typeof ClientResponseSchema>;

// Fila de la lista con saldo y mora (D-113): vive en `@fiaro-app/contracts`.
export { ClientListItemSchema, type ClientListItem } from '@fiaro-app/contracts';

/** Cuerpo de `POST /clients`: la API valida y normaliza cédula y textos. */
export const CreateClientBodySchema = z.strictObject({
  nationalId: z.string().min(1),
  fullName: z.string().min(1),
  occupation: z.string().min(1),
  phone: PhoneSchema,
  address: z.string().min(1),
});

/** Cuerpo de `PATCH /clients/:id`: un campo ausente no se toca y debe venir al menos uno. */
export const UpdateClientBodySchema = CreateClientBodySchema.partial().refine(
  (body) => Object.values(body).some((value) => value !== undefined),
  { message: 'Debes enviar al menos un campo para actualizar.' },
);

/** Cuerpo de `QUERY /clients`: página y búsqueda opcional por nombre o cédula. */
export const ListClientsBodySchema = PageQuerySchema.extend({
  search: z.string().trim().min(1).optional(),
});

const ClientParamsSchema = z.object({ id: IdSchema });

/**
 * Clientes del prestamista. `@fiaro-app/contracts` publica `ClientSchema` pero no los endpoints:
 * se declaran aquí (mismo plan de migración que `features/memberships/endpoints.ts`).
 */
export const clientEndpoints = {
  create: defineEndpoint({
    method: 'POST',
    path: '/clients',
    summary: 'Da de alta un cliente (solo Owner y Lender).',
    body: CreateClientBodySchema,
    response: ClientResponseSchema,
  }),
  get: defineEndpoint({
    method: 'GET',
    path: '/clients/:id',
    summary: 'Un cliente del prestamista de la sesión.',
    params: ClientParamsSchema,
    response: ClientResponseSchema,
  }),
  list: defineEndpoint({
    method: 'QUERY',
    path: '/clients',
    summary: 'Lista paginada de clientes con saldo y mora, con búsqueda por nombre o cédula.',
    body: ListClientsBodySchema,
    response: paginated(ClientListItemSchema),
  }),
  update: defineEndpoint({
    method: 'PATCH',
    path: '/clients/:id',
    summary: 'Actualiza los campos enviados de un cliente (solo Owner y Lender).',
    params: ClientParamsSchema,
    body: UpdateClientBodySchema,
    response: ClientResponseSchema,
  }),
} as const;
