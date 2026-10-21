import type { LandingNavLink } from '@/components/organisms/LandingNav';
import type { PreviewBar, PreviewKpi } from '@/components/organisms/DashboardPreview';
import type { FeatureItem } from '@/components/organisms/FeaturesSection';
import type { StepItem } from '@/components/organisms/HowItWorksSection';
import type { PlanCardProps } from '@/components/molecules/PlanCard';
import type { FaqItem } from '@/components/organisms/FaqSection';

/** Ids de las secciones, usados como ancla por la navegación. */
export const LANDING_SECTION_IDS = {
  day: 'un-dia',
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
  { label: 'Un día con Fiaro', href: `#${LANDING_SECTION_IDS.day}` },
  { label: 'Producto', href: `#${LANDING_SECTION_IDS.product}` },
  { label: 'Cómo funciona', href: `#${LANDING_SECTION_IDS.howItWorks}` },
  { label: 'Precios', href: `#${LANDING_SECTION_IDS.pricing}` },
  { label: 'Preguntas', href: `#${LANDING_SECTION_IDS.faq}` },
];

export const FOOTER_LINKS: readonly LandingNavLink[] = [
  { label: 'Producto', href: `#${LANDING_SECTION_IDS.product}` },
  { label: 'Precios', href: `#${LANDING_SECTION_IDS.pricing}` },
  { label: 'Contacto', href: LANDING_ROUTES.contact },
  { label: 'Términos', href: '/terminos' },
  { label: 'Privacidad', href: '/privacidad' },
  { label: 'Cookies', href: '/cookies' },
];

export const HERO = {
  eyebrow: 'Software para prestamistas informales',
  title: 'El control de tu cartera que tu cuaderno nunca te va a dar',
  description:
    'Fiaro le da a cada prestamista la visibilidad que hoy le falta: mora en tiempo real, efectividad por cobrador y el cuadre del día sin depender de una hoja de Excel.',
  primaryCta: { label: 'Comenzar gratis', href: LANDING_ROUTES.signup },
  secondaryCta: { label: 'Ver un día de cobro →', href: `#${LANDING_SECTION_IDS.day}` },
  footnote: 'Sin tarjeta de crédito · Configura tu financiera en 5 minutos',
} as const;

/** Tira de pruebas bajo la portada: lo que cambia en la práctica, sin cifras inventadas. */
export const PROOF_STRIP = [
  { value: '5 min', label: 'para dejar tu financiera lista' },
  { value: '1 toque', label: 'para registrar cada visita' },
  { value: '0 Excel', label: 'para saber cuánto te deben hoy' },
] as const;

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

/** «Un día con Fiaro»: el mismo día con el cuaderno y con Fiaro, para ver por qué cambia el negocio. Datos de ejemplo. */
export const DAY_FLOW = {
  title: 'Mira un día de cobro, con y sin Fiaro',
  subtitle: 'Es el mismo negocio y el mismo día. Cambia lo que sabes de tu plata mientras todavía puedes actuar.',
  modes: { notebook: 'Con el cuaderno', fiaro: 'Con Fiaro' },
  notebook: {
    heading: 'Tu cuaderno, a las 7 de la noche',
    lines: [
      { text: 'Don Pedro — ¿pagó? ¿cuánto?', note: 'letra borrosa' },
      { text: 'María — 35.000 (¿o 30.000?)', note: 'sin comprobante' },
      { text: 'Luis — no estaba, volver', note: 'nadie lo recordará mañana' },
    ],
    problems: [
      'No sabes cuánto se cobró hasta que el cobrador regresa.',
      'La mora se descubre cuando ya es tarde para cobrarla.',
      'Si algo no cuadra, no hay a quién ni cómo demostrarle.',
    ],
  },
  stepsLabel: 'Pasos del día con Fiaro',
  steps: [
    {
      tab: 'La ruta',
      title: 'El cobrador sale con la ruta lista',
      description: 'Cada mañana ve a quién visitar y cuánto cobrar, ordenado, desde su celular. Tú no tienes que dictarle nada.',
      mock: {
        heading: 'Ruta de hoy · 3 visitas',
        rows: [
          { name: 'María Pérez', detail: 'Cuota $35.000', tag: 'Pendiente', tone: 'muted' },
          { name: 'Luis Gómez', detail: 'Cuota $20.000', tag: 'Pendiente', tone: 'muted' },
          { name: 'Don Pedro', detail: 'Cuota $50.000', tag: 'Pendiente', tone: 'muted' },
        ],
        footer: { label: 'Por cobrar', value: '$105.000' },
      },
    },
    {
      tab: 'El cobro',
      title: 'Cada visita queda registrada al instante',
      description: 'Pagó, no estaba o prometió pagar otro día: el cobrador lo marca y tú lo ves en tu panel, con la hora y la persona.',
      mock: {
        heading: 'Visitas · en vivo',
        rows: [
          { name: 'María Pérez', detail: 'Efectivo $35.000', tag: 'Pagó', tone: 'success' },
          { name: 'Luis Gómez', detail: 'Promete pagar el viernes', tag: 'Reprogramado', tone: 'warning' },
          { name: 'Don Pedro', detail: 'No estaba', tag: 'No pagó', tone: 'error' },
        ],
        footer: { label: 'Cobrado', value: '$35.000' },
      },
    },
    {
      tab: 'El cuadre',
      title: 'El cuadre se hace solo, tú solo apruebas',
      description: 'Al cerrar, Fiaro compara lo esperado con lo que el cobrador entrega. Si cuadra, lo apruebas en segundos; si no, ves exactamente la diferencia.',
      mock: {
        heading: 'Cuadre del día',
        rows: [
          { name: 'Esperado', detail: 'Según la ruta', tag: '$105.000', tone: 'muted' },
          { name: 'Cobrado', detail: 'Registrado por el cobrador', tag: '$35.000', tone: 'muted' },
          { name: 'Diferencia', detail: 'Visitas sin pago', tag: '$70.000', tone: 'warning' },
        ],
        footer: { label: 'Estado', value: 'Por revisar' },
      },
    },
    {
      tab: 'La decisión',
      title: 'Ves la mora mientras todavía se puede cobrar',
      description: 'Don Pedro lleva días sin pagar y te lo mostramos hoy, no a fin de mes. Decides a quién reforzar, a quién llamar y a quién no prestarle más.',
      mock: {
        heading: 'Mora por antigüedad',
        rows: [
          { name: '1 a 5 días', detail: '4 clientes', tag: '$180.000', tone: 'warning' },
          { name: '6 a 15 días', detail: '2 clientes', tag: '$210.000', tone: 'error' },
          { name: 'Más de 15 días', detail: '1 cliente', tag: '$150.000', tone: 'error' },
        ],
        footer: { label: 'En mora', value: '18%' },
      },
    },
  ],
  cta: { label: 'Probar con mi cartera', href: LANDING_ROUTES.signup },
} as const;

export const FEATURES = {
  title: 'Todo lo que tu cuaderno no te puede mostrar',
  subtitle:
    'El valor de Fiaro no es prestar dinero — es la visibilidad sobre tu cartera que hoy no tienes.',
  items: [
    {
      icon: '⏱',
      title: 'Mora en tiempo real',
      description:
        'Sabe exactamente qué clientes están atrasados, hace cuánto y cuánto dinero representan — sin esperar al cierre de mes.',
    },
    {
      icon: '✓',
      title: 'Efectividad por cobrador',
      description:
        'Compara el desempeño de cada cobrador y detecta a tiempo quién necesita apoyo o supervisión.',
    },
    {
      icon: '▦',
      title: 'Cuadre diario sin Excel',
      description:
        'Cada cobrador cierra su ruta desde el celular; tú apruebas o rechazas el cuadre en segundos.',
    },
    {
      icon: '◈',
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
