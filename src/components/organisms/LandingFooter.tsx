import NextLink from 'next/link';
import type { LandingNavLink } from '@/components/organisms/LandingNav';

export interface LandingFooterProps {
  readonly links: readonly LandingNavLink[];
  readonly copyright: string;
  readonly brandName?: string;
}

/** Pie de la landing: marca, enlaces secundarios y aviso de derechos reservados. */
export function LandingFooter({ links, copyright, brandName = 'Fiaro' }: Readonly<LandingFooterProps>) {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 bg-surface px-6 py-8 sm:flex-row lg:px-16">
      <span className="font-display text-[18px] font-bold text-primary">{brandName}</span>
      <nav aria-label="Pie de página" className="flex items-center gap-6">
        {links.map((link) => (
          <NextLink
            key={link.href}
            href={link.href}
            className="rounded-sm text-small text-foreground/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {link.label}
          </NextLink>
        ))}
      </nav>
      <p className="text-caption text-foreground/50">{copyright}</p>
    </footer>
  );
}
