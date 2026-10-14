import NextLink from 'next/link';
import { cn } from '@/lib/cn';

export interface SidebarNavItemProps {
  readonly label: string;
  readonly href: string;
  /** Sección actual: fondo suave, color de marca y `aria-current="page"`. */
  readonly active?: boolean;
  /** Módulo aún no disponible: se muestra apagado y sin enlace. */
  readonly disabled?: boolean;
  /** Pendientes por atender; con 1 o más se muestra una insignia (tope visual «99+»). */
  readonly badge?: number;
}

const MAX_BADGE = 99;
const BASE = 'flex items-center justify-between gap-2 rounded-sm px-3 py-[8.5px] text-label';

/** Una opción de la barra lateral (14px): activa, normal o apagada si el módulo todavía no existe. */
export function SidebarNavItem({ label, href, active = false, disabled = false, badge = 0 }: Readonly<SidebarNavItemProps>) {
  if (disabled) {
    return (
      <span aria-disabled="true" title="Próximamente" className={cn(BASE, 'cursor-not-allowed text-foreground/65')}>
        {label}
      </span>
    );
  }

  return (
    <NextLink
      href={href}
      data-tour={`nav${href}`}
      aria-current={active ? 'page' : undefined}
      className={cn(
        BASE,
        'transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        active ? 'bg-surface-2 font-semibold text-primary' : 'text-foreground hover:bg-surface-2',
      )}
    >
      {label}
      {badge > 0 && (
        <span className="min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-center text-[11px] leading-none font-semibold text-primary-foreground">
          <span aria-hidden="true">{badge > MAX_BADGE ? `${String(MAX_BADGE)}+` : badge}</span>
          <span className="sr-only">{`, ${String(badge)} sin leer`}</span>
        </span>
      )}
    </NextLink>
  );
}
