import type { LandingNavLink } from '@/components/organisms/LandingNav';
import { FOOTER_LINKS, NAV_LINKS } from '@/content/landing';

/** Un enlace de la landing visto desde otra página: el ancla `#precios` pasa a `/#precios`. */
function fromLanding(link: LandingNavLink): LandingNavLink {
  return link.href.startsWith('#') ? { ...link, href: `/${link.href}` } : link;
}

export const LEGAL_NAV_LINKS: readonly LandingNavLink[] = NAV_LINKS.map(fromLanding);
export const LEGAL_FOOTER_LINKS: readonly LandingNavLink[] = FOOTER_LINKS.map(fromLanding);
