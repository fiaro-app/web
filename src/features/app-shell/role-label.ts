import type { Role } from '@fiaro-app/contracts';

export const ADMIN_LABEL = 'Administrador';
export const COLLECTOR_LABEL = 'Cobrador';

/**
 * Cómo se llama el rol de la persona en la barra lateral: quien es Owner o Lender administra el
 * negocio; quien solo es cobrador, cobra. Sin roles conocidos no se muestra ninguno.
 */
export function roleLabel(roles: readonly Role[]): string | null {
  if (roles.includes('OWNER') || roles.includes('LENDER')) return ADMIN_LABEL;
  return roles.includes('COLLECTOR') ? COLLECTOR_LABEL : null;
}

/** Quien administra el negocio: Owner o Lender. Con roles desconocidos (`null`) se asume que sí y decide la API. */
export function canManageBusiness(roles: readonly Role[] | null): boolean {
  return roles === null || roles.includes('OWNER') || roles.includes('LENDER');
}

/** Quien puede cobrar en campo (registrar visitas y pagos): tiene el rol Collector. */
export function canCollectPayments(roles: readonly Role[] | null): boolean {
  return roles !== null && roles.includes('COLLECTOR');
}
