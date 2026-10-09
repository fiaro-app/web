import { defineEndpoint } from '@fiaro-app/contracts';
import { z } from 'zod';

/**
 * Cuerpo de `POST /leads` (D-114): `phone` o `email` (al menos uno) y un campo señuelo `website`
 * que debe viajar vacío; si trae algo, la API descarta el contacto en silencio.
 */
export const CreateLeadBodySchema = z.strictObject({
  name: z.string().min(1),
  phone: z.string().min(1).optional(),
  email: z.string().min(1).optional(),
  message: z.string().min(1),
  website: z.string().optional(),
});
export type CreateLeadBody = z.infer<typeof CreateLeadBodySchema>;

/**
 * Contacto de ventas: ruta **pública** (sin sesión), con un límite propio de 5 por hora por IP.
 * `@fiaro-app/contracts` 0.6.0 no la publica: se declara aquí (mismo plan de migración que W-13).
 */
export const leadEndpoints = {
  create: defineEndpoint({
    method: 'POST',
    path: '/leads',
    summary: 'Deja un contacto de ventas (público, limitado por IP).',
    body: CreateLeadBodySchema,
    response: z.object({ received: z.literal(true) }),
  }),
} as const;
