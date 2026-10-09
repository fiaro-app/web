import NextLink from 'next/link';
import { Link } from '@/components/atoms/Link';

export interface AuthNavProps {
  /** Pregunta a la izquierda del enlace ("¿No tienes cuenta?"). */
  readonly prompt: string;
  readonly linkLabel: string;
  readonly linkHref: string;
  readonly brandName?: string;
}

/** Barra superior de las pantallas de acceso: marca y un enlace a la pantalla hermana (login ↔ registro). */
export function AuthNav({ prompt, linkLabel, linkHref, brandName = 'Fiaro' }: Readonly<AuthNavProps>) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-foreground/8 bg-surface px-6 lg:px-12">
      <NextLink
        href="/"
        className="rounded-sm font-display text-[22px] font-bold text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {brandName}
      </NextLink>
      <p className="flex items-center gap-1.5 text-small">
        <span className="text-foreground/70">{prompt}</span>
        <Link href={linkHref} className="font-semibold">
          {linkLabel}
        </Link>
      </p>
    </header>
  );
}
