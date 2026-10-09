import NextLink from 'next/link';
import { Avatar } from '@/components/atoms/Avatar';
import { NavLink } from '@/components/atoms/NavLink';
import { cn } from '@/lib/cn';

export interface TopBarNavItem {
  readonly label: string;
  readonly href: string;
  readonly active?: boolean;
}

export interface TopBarProps {
  readonly navItems: readonly TopBarNavItem[];
  readonly userName: string;
  readonly brandName?: string;
  readonly className?: string;
}

/** Barra superior del panel web: marca y navegación a la izquierda, usuario a la derecha. */
export function TopBar({ navItems, userName, brandName = 'Fiaro', className }: Readonly<TopBarProps>) {
  return (
    <header className={cn('flex h-16 items-center justify-between bg-surface px-8', className)}>
      <div className="flex items-center gap-10">
        <NextLink
          href="/"
          className="rounded-sm font-display text-h3 font-semibold text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {brandName}
        </NextLink>
        <nav aria-label="Principal" className="flex items-center gap-7">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} active={item.active}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2.5">
        <Avatar name={userName} size="sm" />
        <span className="text-label font-medium">{userName}</span>
      </div>
    </header>
  );
}
