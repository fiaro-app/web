import type { PurchasablePlanCode } from '@/features/subscription/checkout-endpoints';

/** Un plan que se puede pagar, tal como se ofrece en la pantalla. El precio que se cobra lo pone la API; este es solo el que se muestra. */
export interface PlanOffer {
  readonly code: PurchasablePlanCode;
  readonly name: string;
  /** Pesos colombianos por mes (D-144 de la API). */
  readonly monthlyPrice: number;
  readonly tagline: string;
  readonly features: readonly string[];
}

/** Planes de pago (D-144 de la API). Si cambia un precio o un tope, cambia también en `PLAN_CATALOG` y `PLAN_PRICE_COP` de la API. */
export const PLAN_OFFERS: readonly PlanOffer[] = [
  {
    code: 'INDIVIDUAL',
    name: 'Individual',
    monthlyPrice: 49_000,
    tagline: 'Para cobrar tú sola o con poco equipo.',
    features: ['1 administrador (tú)', '2 cobradores', '2 carteras', 'Hasta 20 préstamos activos', 'Estadísticas básicas'],
  },
  {
    code: 'PRO',
    name: 'Pro',
    monthlyPrice: 69_000,
    tagline: 'Para un negocio con equipo y varias zonas.',
    features: [
      'Hasta 3 administradores',
      'Hasta 10 cobradores',
      '4 carteras',
      'Préstamos activos sin tope',
      'Estadísticas completas y PDF',
      'Importar desde Excel (próximamente)',
    ],
  },
  {
    code: 'TEAM',
    name: 'Team',
    monthlyPrice: 149_000,
    tagline: 'Para varios negocios bajo una misma cuenta.',
    features: ['Hasta 3 negocios', '3 administradores por negocio', 'Cobradores sin tope', '10 carteras', 'Estadísticas consolidadas', 'Soporte prioritario'],
  },
];

/** Textos de «Plan y pagos» y de la página a la que Wompi devuelve a la persona. */
export const PLANS_TEXT = {
  title: 'Plan y pagos',
  forbidden: {
    title: 'No tienes acceso a esta sección',
    description: 'El plan del negocio lo ve y lo paga quien lo administra.',
  },
  offers: {
    title: 'Elige tu plan',
    description: 'Pagas un mes a la vez, en la página segura de Wompi. Si te sobraban días del plan anterior, se suman.',
    perMonth: '/ mes',
    pay: 'Pagar con Wompi',
    paying: 'Llevándote a Wompi…',
    current: 'Tu plan actual',
    note: 'Aceptamos tarjeta, PSE, Nequi y Bancolombia. Fiaro no guarda los datos de tu tarjeta.',
    help: 'Hablar con ventas',
  },
  result: {
    pending: {
      title: 'Estamos confirmando tu pago',
      description: 'Esto toma unos segundos. No cierres esta página.',
    },
    approved: {
      title: '¡Pago recibido!',
      description: (planName: string, endsOn: string) => `Tu plan ${planName} está activo hasta el ${endsOn}.`,
    },
    notApproved: {
      title: 'El pago no se completó',
      description: 'No se cobró nada. Puedes intentarlo de nuevo con el mismo u otro medio de pago.',
    },
    slow: {
      title: 'Tu pago sigue en proceso',
      description: 'Wompi todavía no nos confirma. Si ya pagaste, tu plan se activa solo en unos minutos: revisa «Plan y pagos» o escríbenos.',
    },
    notFound: {
      title: 'No encontramos ese pago',
      description: 'La orden no existe o es de otro negocio. Empieza de nuevo desde «Plan y pagos».',
    },
    retry: 'Intentar de nuevo',
    back: 'Volver a Plan y pagos',
    goToPanel: 'Ir al panel',
  },
} as const;
