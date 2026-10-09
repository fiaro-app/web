'use client';

import { usePathname } from 'next/navigation';
import { SignOutButton } from '@/components/molecules/SignOutButton';
import { Sidebar } from '@/components/organisms/Sidebar';
import { APP_NAV_ITEMS, NOTIFICATIONS_HREF, isNavItemActive } from '@/content/app-nav';

export interface AppSidebarProps {
  readonly businessName: string;
  readonly userName: string;
  readonly roleLabel: string | null;
  /** Notificaciones sin leer: se muestran como insignia en «Notificaciones». */
  readonly unreadNotifications?: number;
}

/** La barra lateral del panel con su estado: marca la sección según la ruta y trae "Cerrar sesión". */
export function AppSidebar({ businessName, userName, roleLabel, unreadNotifications = 0 }: Readonly<AppSidebarProps>) {
  const pathname = usePathname();
  const items = APP_NAV_ITEMS.map((item) => ({
    label: item.label,
    href: item.href,
    disabled: !item.available,
    active: item.available && isNavItemActive(pathname, item.href),
    badge: item.href === NOTIFICATIONS_HREF ? unreadNotifications : 0,
  }));

  return <Sidebar businessName={businessName} items={items} userName={userName} roleLabel={roleLabel} accountHref="/cuenta" actions={<SignOutButton />} />;
}
