import { CreateLeadRequestSchema, LeadReceivedSchema, defineEndpoint } from '@fiaro-app/contracts';

// Cuerpo de `POST /leads` (D-114, `phone` o `email` y un campo señuelo `website`): vive en `@fiaro-app/contracts`.
export { CreateLeadRequestSchema as CreateLeadBodySchema, type CreateLeadRequest as CreateLeadBody } from '@fiaro-app/contracts';

/**
 * Contacto de ventas: ruta **pública** (sin sesión), con un límite propio de 5 por hora por IP.
 * `@fiaro-app/contracts` 0.6.0 no la publica: se declara aquí (mismo plan de migración que W-13).
 */
export const leadEndpoints = {
  create: defineEndpoint({
    method: 'POST',
    path: '/leads',
    summary: 'Deja un contacto de ventas (público, limitado por IP).',
    body: CreateLeadRequestSchema,
    response: LeadReceivedSchema,
  }),
} as const;
