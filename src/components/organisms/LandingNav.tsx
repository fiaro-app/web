import NextLink from 'next/link';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Link } from '@/components/atoms/Link';
import { NavLink } from '@/components/atoms/NavLink';

export interface LandingNavLink {
  readonly label: string;
  readonly href: string;
}

export interface LandingNavProps {
  readonly links: readonly LandingNavLink[];
  readonly loginHref: string;
  readonly signupHref: string;
  readonly brandName?: string;
}

/** Barra superior de la landing: una píldora flotante con la marca, las anclas a las secciones y los accesos a iniciar sesión y registro. */
export function LandingNav({ links, loginHref, signupHref, brandName = 'Fiaro' }: Readonly<LandingNavProps>) {
  return (
    <header className="border-b border-foreground/8 bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-16">
        <NextLink
          href="/"
          className="rounded-sm font-display text-[24px] font-bold text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {brandName}
        </NextLink>
        <nav aria-label="Secciones" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink key={link.label} href={link.href} muted={false}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <Link href={loginHref} className="font-semibold">
            Iniciar sesión
          </Link>
          <span className="hidden sm:block">
            <ButtonLink href={signupHref} className="w-40">
              Comenzar gratis
            </ButtonLink>
          </span>
        </div>
      </div>
    </header>
  );
}
