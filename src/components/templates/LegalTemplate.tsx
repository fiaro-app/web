import type { ReactNode } from 'react';
import { LandingFooter } from '@/components/organisms/LandingFooter';
import { LandingNav } from '@/components/organisms/LandingNav';
import { LandingTemplate } from '@/components/templates/LandingTemplate';
import { LEGAL_FOOTER_LINKS, LEGAL_NAV_LINKS } from '@/content/legal-nav';
import { LANDING_ROUTES } from '@/content/landing';

/** El esqueleto de las páginas legales: la misma barra y pie de la landing, con enlaces que vuelven a ella. */
export function LegalTemplate({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <LandingTemplate
      nav={<LandingNav links={LEGAL_NAV_LINKS} loginHref={LANDING_ROUTES.login} signupHref={LANDING_ROUTES.signup} />}
      footer={<LandingFooter links={LEGAL_FOOTER_LINKS} copyright={`© ${String(new Date().getFullYear())} Fiaro. Todos los derechos reservados.`} />}
    >
      {children}
    </LandingTemplate>
  );
}
