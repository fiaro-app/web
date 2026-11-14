/** Una opción de la barra lateral del panel. */
export interface AppNavItem {
  readonly label: string;
  readonly href: string;
  /** `false` mientras el módulo no exista: se muestra apagado y sin enlace. */
  readonly available: boolean;
  /** `true` si es de administración: quien solo es cobrador no lo ve en el menú (según la matriz de permisos de la API: el resumen, los cobradores, los cobros del día, las estadísticas y la configuración del negocio son de Owner y Lender). */
  readonly adminOnly?: boolean;
}

/**
 * Navegación del panel privado, en el orden del diseño. Al construir un módulo basta con pasar su
 * `available` a `true` (y crear su ruta en `src/app/(app)/<módulo>`).
 */
export const APP_NAV_ITEMS: readonly AppNavItem[] = [
  { label: 'Resumen', href: '/resumen', available: true, adminOnly: true },
  { label: 'Cobradores', href: '/cobradores', available: true, adminOnly: true },
  { label: 'Clientes', href: '/clientes', available: true },
  { label: 'Préstamos', href: '/prestamos', available: true },
  { label: 'Cobros', href: '/cobros', available: true, adminOnly: true },
  { label: 'Solicitudes', href: '/solicitudes', available: true, adminOnly: true },
  { label: 'Rutas', href: '/rutas', available: true, adminOnly: true },
  { label: 'Cuadres', href: '/cuadres', available: true },
  { label: 'Notificaciones', href: '/notificaciones', available: true },
  { label: 'Estadísticas', href: '/estadisticas', available: true, adminOnly: true },
  { label: 'Importar', href: '/importar', available: true, adminOnly: true },
  { label: 'Administradores', href: '/administradores', available: true, adminOnly: true },
  { label: 'Plan y pagos', href: '/plan', available: true, adminOnly: true },
  { label: 'Configuración', href: '/configuracion', available: true, adminOnly: true },
];

/** Ruta de Notificaciones: la opción que lleva la insignia de no leídas. */
export const NOTIFICATIONS_HREF = '/notificaciones';

/** ¿La ruta actual es la de esta opción o una de sus subrutas (`/clientes/123`)? */
export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Las opciones del menú que puede ver esa persona. Quien solo es cobrador no ve las de administración
 * (la API ya le niega esos datos: aquí se evita ofrecerle páginas que solo le dirían «sin permiso»).
 * Si no se sabe el rol, se muestra todo y es la API quien decide.
 */
export function visibleNavItems(isCollector: boolean): readonly AppNavItem[] {
  return APP_NAV_ITEMS.filter((item) => !isCollector || !item.adminOnly);
}
