import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { Avatar } from '@/components/atoms/Avatar';
import { Divider } from '@/components/atoms/Divider';
import { SidebarNavItem } from '@/components/molecules/SidebarNavItem';
import { cn } from '@/lib/cn';

export interface SidebarItem {
  readonly label: string;
  readonly href: string;
  readonly active: boolean;
  readonly disabled: boolean;
  /** Cantidad pendiente (notificaciones sin leer); 0 u omitido no muestra insignia. */
  readonly badge?: number;
}

export interface SidebarProps {
  /** Nombre del negocio, bajo la marca. */
  readonly businessName: string;
  readonly items: readonly SidebarItem[];
  readonly userName: string;
  /** Rol de la persona bajo su nombre; se omite si no se sabe. */
  readonly roleLabel?: string | null;
  /** A dónde lleva el bloque del perfil («Mi cuenta»); sin él no es un enlace. */
  readonly accountHref?: string;
  /** Acciones bajo el perfil (cerrar sesión). */
  readonly actions?: ReactNode;
  readonly brandName?: string;
  readonly className?: string;
}

/** Barra lateral del panel (260px): marca y negocio, navegación y perfil de la persona. Solo presentación. */
export function Sidebar({
  businessName,
  items,
  userName,
  roleLabel,
  accountHref,
  actions,
  brandName = 'Fiaro',
  className,
}: Readonly<SidebarProps>) {
  const profile = (
    <>
      <Avatar name={userName} size="base" />
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-small font-semibold">{userName}</span>
        {roleLabel && <span className="text-[11px] text-foreground/70">{roleLabel}</span>}
      </div>
    </>
  );
  const accountLink = accountHref ? (
    <NextLink
      href={accountHref}
      aria-label={`Mi cuenta, ${userName}`}
      className="flex items-center gap-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {profile}
    </NextLink>
  ) : (
    <div className="flex items-center gap-2.5">{profile}</div>
  );

  return (
    <aside className={cn('flex w-65 shrink-0 flex-col justify-between gap-8 overflow-y-auto bg-surface px-6 py-8', className)}>
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-1">
          <span className="font-display text-[22px] font-bold text-primary">{brandName}</span>
          <span className="text-caption text-foreground/70">{businessName}</span>
        </div>
        <nav aria-label="Principal">
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => (
              <li key={item.href}>
                <SidebarNavItem {...item} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex flex-col gap-3">
        <Divider decorative />
        {accountLink}
        {actions}
      </div>
    </aside>
  );
}
