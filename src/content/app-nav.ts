import type { TopBarNavItem } from '@/components/organisms/TopBar';

/**
 * Navegación del panel privado. Crece con cada módulo (cobradores, clientes, préstamos, cuadres…);
 * `active` lo marca quien pinta, según la ruta.
 */
export const PRIVATE_NAV_ITEMS: readonly TopBarNavItem[] = [{ label: 'Resumen', href: '/resumen', active: true }];
