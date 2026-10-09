import {
  IdSchema,
  NotificationSchema,
  PageQuerySchema,
  defineEndpoint,
  paginated,
} from '@fiaro-app/contracts';
import { z } from 'zod';

/** Notificación tal como la devuelve la API: el contrato sin `recipientUserId`, que no se envía. */
export const NotificationResponseSchema = NotificationSchema.omit({ recipientUserId: true });
export type NotificationResponse = z.infer<typeof NotificationResponseSchema>;

/**
 * Cuerpo de `QUERY /notifications`: página y filtros opcionales. Sin `lenderId` trae las de todos
 * los negocios de la persona.
 */
export const ListNotificationsBodySchema = PageQuerySchema.extend({
  lenderId: IdSchema.optional(),
  unreadOnly: z.boolean().optional(),
});

const NotificationParamsSchema = z.object({ id: IdSchema });

/**
 * Notificaciones de la persona de la sesión. `@fiaro-app/contracts` publica `NotificationSchema`
 * pero no los endpoints: se declaran aquí (mismo plan de migración que W-13).
 */
export const notificationEndpoints = {
  list: defineEndpoint({
    method: 'QUERY',
    path: '/notifications',
    summary: 'Lista paginada de las notificaciones de la persona, con filtro de no leídas.',
    body: ListNotificationsBodySchema,
    response: paginated(NotificationResponseSchema),
  }),
  markRead: defineEndpoint({
    method: 'POST',
    path: '/notifications/:id/read',
    summary: 'Marca una notificación como leída.',
    params: NotificationParamsSchema,
    response: NotificationResponseSchema,
  }),
} as const;
