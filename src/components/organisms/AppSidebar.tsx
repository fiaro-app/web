'use client';

import { usePathname } from 'next/navigation';
import { SignOutButton } from '@/components/molecules/SignOutButton';
import { Sidebar } from '@/components/organisms/Sidebar';
import { APP_NAV_ITEMS, isNavItemActive } from '@/content/app-nav';

export interface AppSidebarProps {
  readonly businessName: string;
  readonly userName: string;
  readonly roleLabel: string | null;
}

/** La barra lateral del panel con su estado: marca la sección según la ruta y trae "Cerrar sesión". */
export function AppSidebar({ businessName, userName, roleLabel }: Readonly<AppSidebarProps>) {
  const pathname = usePathname();
  const items = APP_NAV_ITEMS.map((item) => ({
    label: item.label,
    href: item.href,
    disabled: !item.available,
    active: item.available && isNavItemActive(pathname, item.href),
  }));

  return <Sidebar businessName={businessName} items={items} userName={userName} roleLabel={roleLabel} actions={<SignOutButton />} />;
}
