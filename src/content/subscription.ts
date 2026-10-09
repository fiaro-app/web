/** Textos del plan del negocio (aviso del panel y bloque «Tu plan» de Configuración). */
export const SUBSCRIPTION_TEXT = {
  plan: { TRIAL: 'Prueba gratis' },
  status: { ACTIVE: 'Activo', GRACE_PERIOD: 'En gracia', READ_ONLY: 'Solo lectura' },
  banner: {
    /** Se avisa cuando faltan estos días o menos. */
    warnFromDays: 7,
    trialEnding: (days: number) =>
      days === 0 ? 'Tu prueba gratis termina hoy.' : `Tu prueba gratis termina en ${days === 1 ? '1 día' : `${String(days)} días`}.`,
    grace: (days: number) =>
      `Tu prueba terminó. Tienes ${days === 1 ? '1 día' : `${String(days)} días`} para activar tu plan antes de pasar a solo lectura.`,
    readOnly: 'Tu negocio está en modo de solo lectura: puedes consultar tus datos, pero no hacer cambios.',
    action: 'Contactar ventas',
    actionHref: '/contacto',
  },
  panel: {
    title: 'Tu plan',
    description: 'Hasta cuándo tienes Fiaro y cuánto del plan estás usando.',
    plan: 'Plan',
    status: 'Estado',
    endsOn: 'Vence el',
    remaining: 'Días restantes',
    collectors: 'Cobradores activos',
    collectorsUsage: (used: number, max: number) => `${String(used)} de ${String(max)}`,
    contact: 'Hablar con ventas',
  },
} as const;
