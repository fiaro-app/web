/** Una opción de la barra lateral del panel. */
export interface AppNavItem {
  readonly label: string;
  readonly href: string;
  /** `false` mientras el módulo no exista: se muestra apagado y sin enlace. */
  readonly available: boolean;
}

/**
 * Navegación del panel privado, en el orden del diseño. Al construir un módulo basta con pasar su
 * `available` a `true` (y crear su ruta en `src/app/(app)/<módulo>`).
 */
export const APP_NAV_ITEMS: readonly AppNavItem[] = [
  { label: 'Resumen', href: '/resumen', available: true },
  { label: 'Cobradores', href: '/cobradores', available: true },
  { label: 'Clientes', href: '/clientes', available: true },
  { label: 'Préstamos', href: '/prestamos', available: false },
  { label: 'Cuadres', href: '/cuadres', available: false },
  { label: 'Estadísticas', href: '/estadisticas', available: false },
  { label: 'Configuración', href: '/configuracion', available: false },
];

/** ¿La ruta actual es la de esta opción o una de sus subrutas (`/clientes/123`)? */
export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
