import type { Metadata } from 'next';
import { Link } from '@/components/atoms/Link';
import { Text } from '@/components/atoms/Text';
import { FormAside } from '@/components/molecules/FormAside';
import { ContactScreen } from '@/components/organisms/ContactScreen';
import { LandingFooter } from '@/components/organisms/LandingFooter';
import { LandingNav } from '@/components/organisms/LandingNav';
import { LandingTemplate } from '@/components/templates/LandingTemplate';
import { JsonLd } from '@/components/atoms/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { CONTACT_CONTENT } from '@/content/contact';
import { FOOTER_LINKS, LANDING_ROUTES, NAV_LINKS } from '@/content/landing';

const { metadata: pageMetadata } = CONTACT_CONTENT;

export const metadata: Metadata = {
  title: pageMetadata.title,
  description: pageMetadata.description,
  alternates: { canonical: '/contacto' },
  openGraph: { title: pageMetadata.title, description: pageMetadata.description, url: '/contacto' },
};

/** «Contactar ventas»: página pública con el formulario que deja el contacto en la API (`POST /leads`). */
export default function ContactPage() {
  const content = CONTACT_CONTENT;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Inicio', path: '/' },
            { name: 'Contacto', path: '/contacto' },
          ]),
        ]}
      />
      <LandingTemplate
      nav={
        <LandingNav
          links={NAV_LINKS.map((link) => ({ ...link, href: `/${link.href}` }))}
          loginHref={LANDING_ROUTES.login}
          signupHref={LANDING_ROUTES.signup}
        />
      }
      footer={
        <LandingFooter
          links={FOOTER_LINKS.map((link) => ({ ...link, href: link.href.startsWith('#') ? `/${link.href}` : link.href }))}
          copyright={`© ${new Date().getFullYear()} Fiaro. Todos los derechos reservados.`}
        />
      }
    >
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[minmax(0,32rem)_minmax(0,26rem)] lg:justify-center lg:gap-16 lg:py-20">
        <section aria-labelledby="contact-title" className="flex flex-col gap-6">
          <Link href="/">{content.back}</Link>
          <div className="flex flex-col gap-2">
            <Text variant="caption" className="font-semibold tracking-wide text-primary uppercase">
              {content.eyebrow}
            </Text>
            <Text variant="title" as="h1" id="contact-title">
              {content.title}
            </Text>
            <Text variant="body" className="text-foreground/70">
              {content.subtitle}
            </Text>
          </div>
          <ContactScreen signupHref={LANDING_ROUTES.signup} homeHref="/" />
        </section>
        <FormAside title={content.steps.title} steps={content.steps.items} tip={content.steps.tip} />
      </div>
    </LandingTemplate>
  </>
);
}
