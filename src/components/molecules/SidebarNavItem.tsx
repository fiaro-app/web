import NextLink from 'next/link';
import { cn } from '@/lib/cn';

export interface SidebarNavItemProps {
  readonly label: string;
  readonly href: string;
  /** Sección actual: fondo suave, color de marca y `aria-current="page"`. */
  readonly active?: boolean;
  /** Módulo aún no disponible: se muestra apagado y sin enlace. */
  readonly disabled?: boolean;
}

const BASE = 'flex rounded-sm px-3 py-2.5 text-label';

/** Una opción de la barra lateral (14px): activa, normal o apagada si el módulo todavía no existe. */
export function SidebarNavItem({ label, href, active = false, disabled = false }: Readonly<SidebarNavItemProps>) {
  if (disabled) {
    return (
      <span aria-disabled="true" title="Próximamente" className={cn(BASE, 'cursor-not-allowed text-foreground/40')}>
        {label}
      </span>
    );
  }

  return (
    <NextLink
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        BASE,
        'transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        active ? 'bg-surface-2 font-semibold text-primary' : 'text-foreground hover:bg-surface-2',
      )}
    >
      {label}
    </NextLink>
  );
}
