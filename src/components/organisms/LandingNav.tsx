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
    <header className="px-3 py-3 lg:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-foreground/8 bg-surface/85 py-2.5 pr-3 pl-6 shadow-sm backdrop-blur-md">
        <NextLink
          href="/"
          className="rounded-full font-display text-[24px] font-bold text-primary focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-4 focus-visible:outline-ring"
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
        <div className="flex items-center gap-4">
          <Link href={loginHref} className="font-semibold">
            Iniciar sesión
          </Link>
          <span className="hidden sm:block">
            <ButtonLink href={signupHref} className="w-40 rounded-full">
              Comenzar gratis
            </ButtonLink>
          </span>
        </div>
      </div>
    </header>
  );
}
