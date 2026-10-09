import type { NotificationEntityType } from '@fiaro-app/contracts';

/** Pantalla que corresponde a cada tipo de entidad; `null` si todavía no existe en la web. */
const ENTITY_ROUTES: Record<NotificationEntityType, string | null> = {
  DAILY_SETTLEMENT: '/cuadres',
  LOAN: '/prestamos',
  CLIENT: '/clientes',
  MEMBERSHIP: '/cobradores',
  SUBSCRIPTION: null,
};

/**
 * Dirección a la que lleva una notificación al abrirla, o `null` si no lleva a ninguna parte (no
 * tiene entidad, o su pantalla aún no existe). El id viene de la API pero va a una ruta: solo se
 * acepta con forma de UUID para que un valor raro no arme una dirección distinta.
 */
export function notificationHref(entityType: NotificationEntityType | null, entityId: string | null): string | null {
  if (entityType === null || entityId === null) return null;
  const base = ENTITY_ROUTES[entityType];
  if (base === null || !/^[0-9a-f-]{36}$/i.test(entityId)) return null;
  return `${base}/${entityId}`;
}
