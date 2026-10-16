/** «1 día» o «N días». */
function daysLabel(days: number): string {
  return days === 1 ? '1 día' : `${String(days)} días`;
}

/** Textos del plan del negocio (aviso del panel y bloque «Tu plan» de Configuración). */
export const SUBSCRIPTION_TEXT = {
  plan: { TRIAL: 'Prueba gratis', INDIVIDUAL: 'Individual', PRO: 'Pro', TEAM: 'Team' },
  status: { ACTIVE: 'Activo', GRACE_PERIOD: 'En gracia', READ_ONLY: 'Solo lectura' },
  banner: {
    /** Se avisa cuando faltan estos días o menos. */
    warnFromDays: 7,
    trialEnding: (days: number) => (days === 0 ? 'Tu prueba gratis termina hoy.' : `Tu prueba gratis termina en ${daysLabel(days)}.`),
    grace: (days: number) => `Tu prueba terminó. Tienes ${daysLabel(days)} para activar tu plan antes de pasar a solo lectura.`,
    paidEnding: (days: number) => (days === 0 ? 'Tu plan vence hoy.' : `Tu plan vence en ${daysLabel(days)}.`),
    paidGrace: (days: number) => `Tu plan venció. Tienes ${daysLabel(days)} para renovarlo antes de pasar a solo lectura.`,
    readOnly: 'Tu negocio está en modo de solo lectura: puedes consultar tus datos y seguir registrando cobros y cuadres, pero no hacer otros cambios.',
    action: 'Contactar ventas',
    actionHref: '/contacto',
  },
  /** Qué tope del plan se alcanzó al crear algo (`PLAN_LIMIT_REACHED`). */
  limitReached: {
    collectors: 'Tu plan ya no tiene cupos de cobrador. Da de baja a uno o mejora tu plan.',
    admins: 'Tu plan ya no tiene cupos de administrador (tú cuentas como uno). Desactiva a otro o mejora tu plan.',
    loans: 'Tu plan llegó al máximo de préstamos activos. Espera a que se cierre alguno o mejora tu plan. Cobrar los que ya tienes no se bloquea.',
    portfolios: 'Tu negocio ya tiene el máximo de carteras de tu plan. Borra una que no uses o mejora tu plan.',
    generic: 'Tu plan llegó a uno de sus límites. Libera un cupo o mejora tu plan.',
  },
  panel: {
    title: 'Tu plan',
    description: 'Hasta cuándo tienes Fiaro y cuánto del plan estás usando.',
    plan: 'Plan',
    status: 'Estado',
    endsOn: 'Vence el',
    remaining: 'Días restantes',
    collectors: 'Cobradores activos',
    admins: 'Administradores',
    loans: 'Préstamos activos',
    portfolios: 'Carteras',
    usage: (used: number, max: number) => `${String(used)} de ${String(max)}`,
    unlimitedUsage: (used: number) => `${String(used)} (sin tope)`,
    upTo: (max: number) => `Hasta ${String(max)}`,
    contact: 'Hablar con ventas',
  },
} as const;
