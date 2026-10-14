import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export interface NavLinkProps extends ComponentProps<typeof NextLink> {
  /** Sección actual: color de marca y `aria-current="page"`. */
  readonly active?: boolean;
  /** Atenúa los enlaces inactivos (tinta al 65%); con `false` van en tinta plena (nav de la landing). */
  readonly muted?: boolean;
}

/** Enlace de navegación (14px medium): de marca si es la sección activa, tinta al 65% si no. */
export function NavLink({ active = false, muted = true, className, ...props }: Readonly<NavLinkProps>) {
  return (
    <NextLink
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex min-h-11 items-center rounded-sm text-label font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        active && 'text-primary',
        !active && (muted ? 'text-foreground/65 hover:text-foreground' : 'text-foreground hover:text-primary'),
        className,
      )}
      {...props}
    />
  );
}
