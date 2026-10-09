import type { LandingNavLink } from '@/components/organisms/LandingNav';
import type { PreviewBar, PreviewKpi } from '@/components/organisms/DashboardPreview';
import type { FeatureItem } from '@/components/organisms/FeaturesSection';
import type { StepItem } from '@/components/organisms/HowItWorksSection';
import type { PlanCardProps } from '@/components/molecules/PlanCard';
import type { FaqItem } from '@/components/organisms/FaqSection';

/** Ids de las secciones, usados como ancla por la navegación. */
export const LANDING_SECTION_IDS = {
  product: 'producto',
  howItWorks: 'como-funciona',
  pricing: 'precios',
  faq: 'preguntas',
} as const;

/** Rutas a las que apunta la landing. */
export const LANDING_ROUTES = {
  login: '/login',
  signup: '/registro',
  contact: '/contacto',
} as const;

export const NAV_LINKS: readonly LandingNavLink[] = [
  { label: 'Producto', href: `#${LANDING_SECTION_IDS.product}` },
  { label: 'Cómo funciona', href: `#${LANDING_SECTION_IDS.howItWorks}` },
  { label: 'Precios', href: `#${LANDING_SECTION_IDS.pricing}` },
  { label: 'Preguntas', href: `#${LANDING_SECTION_IDS.faq}` },
];

export const FOOTER_LINKS: readonly LandingNavLink[] = [
  { label: 'Producto', href: `#${LANDING_SECTION_IDS.product}` },
  { label: 'Precios', href: `#${LANDING_SECTION_IDS.pricing}` },
  { label: 'Contacto', href: LANDING_ROUTES.contact },
];

export const HERO = {
  eyebrow: 'Software para prestamistas informales',
  title: 'El control de tu cartera que tu cuaderno nunca te va a dar',
  description:
    'Fiaro le da a cada prestamista la visibilidad que hoy le falta: mora en tiempo real, efectividad por cobrador y el cuadre del día sin depender de una hoja de Excel.',
  primaryCta: { label: 'Comenzar gratis', href: LANDING_ROUTES.signup },
  secondaryCta: { label: 'Ver cómo funciona →', href: `#${LANDING_SECTION_IDS.howItWorks}` },
  footnote: 'Sin tarjeta de crédito · Configura tu financiera en 5 minutos',
} as const;

export const PREVIEW_KPIS: readonly PreviewKpi[] = [
  { label: 'Cartera total', value: '$18.4M' },
  { label: 'Cobrado hoy', value: '$3.2M', valueClassName: 'text-success' },
  { label: 'En mora', value: '18%', valueClassName: 'text-destructive' },
];

export const PREVIEW_BARS: readonly PreviewBar[] = [
  { label: '1 a 5 días', widthClassName: 'w-full', colorClassName: 'bg-[#f0b429]' },
  { label: '6 a 15 días', widthClassName: 'w-3/5', colorClassName: 'bg-[#d9720a]' },
  { label: 'Más de 15 días', widthClassName: 'w-[35%]', colorClassName: 'bg-[#b8451f]' },
];

export const PREVIEW_CHART_TITLE = 'Mora por antigüedad';

export const FEATURES = {
  title: 'Todo lo que tu cuaderno no te puede mostrar',
  subtitle:
    'El valor de Fiaro no es prestar dinero — es la visibilidad sobre tu cartera que hoy no tienes.',
  items: [
    {
      icon: '⏱',
      tone: 'error',
      title: 'Mora en tiempo real',
      description:
        'Sabe exactamente qué clientes están atrasados, hace cuánto y cuánto dinero representan — sin esperar al cierre de mes.',
    },
    {
      icon: '✓',
      tone: 'success',
      title: 'Efectividad por cobrador',
      description:
        'Compara el desempeño de cada cobrador y detecta a tiempo quién necesita apoyo o supervisión.',
    },
    {
      icon: '▦',
      tone: 'info',
      title: 'Cuadre diario sin Excel',
      description:
        'Cada cobrador cierra su ruta desde el celular; tú apruebas o rechazas el cuadre en segundos.',
    },
    {
      icon: '◈',
      tone: 'warning',
      title: 'Reportes para tu contador',
      description:
        'Estadísticas y exportes en PDF que le dan a tu negocio la seriedad que un cuaderno nunca tuvo.',
    },
  ],
} satisfies { title: string; subtitle: string; items: readonly FeatureItem[] };

export const HOW_IT_WORKS = {
  title: 'Empieza a ver tu cartera en 3 pasos',
  steps: [
    {
      title: 'Registra tu financiera',
      description: 'Crea tu cuenta y dale nombre a tu negocio en menos de 5 minutos.',
    },
    {
      title: 'Da de alta a tus cobradores',
      description:
        'Cada cobrador recibe una contraseña temporal que tú le entregas y empieza a cobrar desde el celular.',
    },
    {
      title: 'Ve tu cartera en tiempo real',
      description:
        'Mora, efectividad y cuadres del día, sin esperar al fin de mes para saber cómo va tu negocio.',
    },
  ],
} satisfies { title: string; steps: readonly StepItem[] };

export const PRICING = {
  eyebrow: 'Precios',
  title: 'Un plan para cada tamaño de negocio',
  note: 'Precios de referencia — se confirman antes del lanzamiento.',
  plans: [
    {
      name: 'Básico',
      price: '$79.000',
      period: '/mes',
      description: 'Para prestamistas con 1 financiera y hasta 3 cobradores.',
      features: ['1 financiera', 'Hasta 3 cobradores', 'App móvil de cobro', 'Cuadre diario'],
      ctaLabel: 'Comenzar gratis',
      ctaHref: LANDING_ROUTES.signup,
    },
    {
      name: 'Profesional',
      price: '$149.000',
      period: '/mes',
      description: 'Para negocios que ya necesitan estadísticas y varios cobradores.',
      features: [
        '1 financiera',
        'Hasta 10 cobradores',
        'Estadísticas y mora por antigüedad',
        'Exportes en PDF',
        'Soporte prioritario',
      ],
      ctaLabel: 'Comenzar gratis',
      ctaHref: LANDING_ROUTES.signup,
      highlighted: true,
    },
    {
      name: 'Empresarial',
      price: 'Hablemos',
      description: 'Para quienes operan varias financieras o carteras grandes.',
      features: [
        'Financieras ilimitadas',
        'Cobradores ilimitados',
        'Soporte dedicado',
        'Onboarding asistido',
      ],
      ctaLabel: 'Contactar ventas',
      ctaHref: LANDING_ROUTES.contact,
    },
  ],
} satisfies { eyebrow: string; title: string; note: string; plans: readonly PlanCardProps[] };

export const CTA_BAND = {
  title: '¿Listo para dejar de perseguir cobros en un cuaderno?',
  description: 'Configura tu financiera hoy y ve tu primer cuadre mañana mismo.',
  ctaLabel: 'Comenzar gratis',
  ctaHref: LANDING_ROUTES.signup,
} as const;

export const FAQ = {
  eyebrow: 'Preguntas frecuentes',
  title: 'Lo que suelen preguntarnos antes de empezar',
  items: [
    {
      question: '¿Fiaro presta dinero o cobra a mis clientes?',
      answer:
        'No. Fiaro es el software con el que controlas tu cartera: tú prestas, tus cobradores cobran y Fiaro te muestra la mora, la efectividad y el cuadre del día.',
    },
    {
      question: '¿Necesito tarjeta de crédito para empezar?',
      answer: 'No. Creas tu cuenta y configuras tu financiera en unos 5 minutos, sin tarjeta.',
    },
    {
      question: '¿Cómo entran mis cobradores?',
      answer:
        'Desde Fiaro les das de alta con su celular y recibes una contraseña temporal que tú les entregas. La cambian al ingresar por primera vez y cobran desde su celular.',
    },
    {
      question: '¿Puedo saber qué cobrador no ha salido a cobrar?',
      answer:
        'Sí. Recibes alertas en tu panel, ves el cuadre de cada día para aprobarlo o rechazarlo y revisas la efectividad de cada cobrador.',
    },
    {
      question: '¿Mis datos y los de mis clientes están separados de los de otros negocios?',
      answer:
        'Sí. Cada financiera ve únicamente su propia cartera, y la información viaja por conexiones cifradas.',
    },
  ],
} satisfies { eyebrow: string; title: string; items: readonly FaqItem[] };
