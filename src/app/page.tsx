import { JsonLd } from '@/components/atoms/JsonLd';
import { CtaBand } from '@/components/organisms/CtaBand';
import { DashboardPreview } from '@/components/organisms/DashboardPreview';
import { FaqSection } from '@/components/organisms/FaqSection';
import { FeaturesSection } from '@/components/organisms/FeaturesSection';
import { HeroSection } from '@/components/organisms/HeroSection';
import { HowItWorksSection } from '@/components/organisms/HowItWorksSection';
import { LandingFooter } from '@/components/organisms/LandingFooter';
import { LandingNav } from '@/components/organisms/LandingNav';
import { PricingSection } from '@/components/organisms/PricingSection';
import { LandingTemplate } from '@/components/templates/LandingTemplate';
import { faqJsonLd, organizationJsonLd, softwareApplicationJsonLd, websiteJsonLd } from '@/lib/seo/json-ld';
import {
  CTA_BAND,
  FAQ,
  FEATURES,
  FOOTER_LINKS,
  HERO,
  HOW_IT_WORKS,
  LANDING_ROUTES,
  LANDING_SECTION_IDS,
  NAV_LINKS,
  PREVIEW_BARS,
  PREVIEW_CHART_TITLE,
  PREVIEW_KPIS,
  PRICING,
} from '@/content/landing';

/** Landing pública de Fiaro (`Screen / Web / Landing` en Penpot). */
export default function Home() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(), softwareApplicationJsonLd(PRICING.plans), faqJsonLd(FAQ.items)]} />
      <LandingTemplate
        nav={<LandingNav links={NAV_LINKS} loginHref={LANDING_ROUTES.login} signupHref={LANDING_ROUTES.signup} />}
        footer={
          <LandingFooter
            links={FOOTER_LINKS}
            copyright={`© ${new Date().getFullYear()} Fiaro. Todos los derechos reservados.`}
          />
        }
      >
        <HeroSection
          {...HERO}
          visual={<DashboardPreview kpis={PREVIEW_KPIS} chartTitle={PREVIEW_CHART_TITLE} bars={PREVIEW_BARS} />}
        />
        <FeaturesSection id={LANDING_SECTION_IDS.product} title={FEATURES.title} subtitle={FEATURES.subtitle} features={FEATURES.items} />
        <HowItWorksSection id={LANDING_SECTION_IDS.howItWorks} {...HOW_IT_WORKS} />
        <PricingSection id={LANDING_SECTION_IDS.pricing} {...PRICING} />
        <FaqSection id={LANDING_SECTION_IDS.faq} {...FAQ} />
        <CtaBand {...CTA_BAND} />
      </LandingTemplate>
    </>
  );
}
