import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { Link } from '@/components/atoms/Link';

export interface AuthNavProps {
  /** Pregunta a la izquierda del enlace ("¿No tienes cuenta?"). */
  readonly prompt?: string;
  readonly linkLabel?: string;
  readonly linkHref?: string;
  /** Contenido propio a la derecha en lugar de la pregunta y el enlace (p. ej. "Cerrar sesión"). */
  readonly end?: ReactNode;
  readonly brandName?: string;
}

/** Barra superior de las pantallas de acceso: marca y un enlace a la pantalla hermana (login ↔ registro) o un contenido propio. */
export function AuthNav({ prompt, linkLabel, linkHref, end, brandName = 'Fiaro' }: Readonly<AuthNavProps>) {
  return (
    <header className="flex h-[81px] items-center justify-between border-b border-foreground/8 bg-surface px-6 lg:px-12">
      <NextLink
        href="/"
        className="rounded-sm font-display text-[22px] font-bold text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {brandName}
      </NextLink>
      {end ?? (
        <p className="flex items-center gap-1.5 text-small">
          <span className="text-foreground/70">{prompt}</span>
          {linkHref && linkLabel && (
            <Link href={linkHref} size="small" className="font-semibold">
              {linkLabel}
            </Link>
          )}
        </p>
      )}
    </header>
  );
}
