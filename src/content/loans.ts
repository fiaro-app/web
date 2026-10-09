import type { LoanFrequency, LoanStatus } from '@fiaro-app/contracts';

/** Textos del módulo Préstamos. */
export const LOANS_TEXT = {
  title: 'Préstamos',
  newLoan: '+ Nuevo préstamo',
  tableCaption: 'Préstamos del negocio',
  headers: ['Cliente', 'Cobrador', 'Monto prestado', 'Pagadas', 'Saldo', 'Mora', 'Próxima cuota', 'Estado'] as const,
  onTime: 'Al día',
  overdueDays: (days: number) => (days === 1 ? '1 día' : `${String(days)} días`),
  view: 'Ver',
  frequency: {
    DAILY: 'Diaria',
    WEEKLY: 'Semanal',
    BIWEEKLY: 'Quincenal',
    MONTHLY: 'Mensual',
  } satisfies Record<LoanFrequency, string>,
  status: {
    ACTIVE: 'Activo',
    PAID_OFF: 'Pagado',
    CANCELED: 'Anulado',
  } satisfies Record<LoanStatus, string>,
  search: {
    placeholder: 'Buscar por nombre o cédula del cliente...',
    submit: 'Buscar',
    clear: 'Limpiar búsqueda',
    label: 'Buscar préstamos',
  },
  noResults: (search: string) => ({
    title: 'Sin resultados',
    description: `No encontramos préstamos de clientes que coincidan con «${search}». Revisa el nombre o la cédula.`,
  }),
  filters: { all: 'Todos', label: 'Filtrar por estado' },
  unknownClient: 'Cliente no disponible',
  empty: {
    title: 'Aún no tienes préstamos',
    description: 'Registra el primer préstamo de uno de tus clientes para empezar a cobrar.',
  },
  emptyFiltered: {
    title: 'Sin préstamos en este estado',
    description: 'Prueba con otro filtro para ver los demás préstamos.',
  },
  forbidden: {
    title: 'No tienes acceso a esta sección',
    description: 'Tu cuenta no tiene un negocio activo desde el que ver préstamos.',
  },
  notFound: {
    title: 'No encontramos el préstamo',
    description: 'Puede que ya no exista. Vuelve a la lista y elige otro.',
  },
  pagination: {
    summary: (page: number, pages: number, total: number) => `Página ${String(page)} de ${String(pages)} · ${String(total)} préstamos`,
  },
  form: {
    aside: {
      title: '¿Cómo se calcula?',
      steps: [
        'Elige al cliente y el capital que vas a prestar.',
        'Define el número de cuotas, su valor y cada cuánto se cobran.',
        'Fiaro genera el calendario y se lo asigna a un cobrador.',
      ],
      tip: {
        title: 'Un consejo',
        body: 'Revisa que el total a pagar sea la suma de las cuotas: así el saldo siempre cuadra.',
      },
    },
    title: 'Registrar préstamo',
    subtitle: 'Todos los montos los pones tú: Fiaro no calcula intereses.',
    submit: 'Registrar préstamo',
    cancel: 'Cancelar',
    noClients: {
      title: 'Primero registra un cliente',
      description: 'Para dar un préstamo necesitas al menos un cliente.',
      action: 'Registrar cliente',
    },
    client: { label: 'Cliente', placeholder: 'Elige un cliente' },
    principalAmount: { label: 'Monto prestado' },
    installmentCount: { label: 'Número de cuotas', placeholder: 'Ej: 20' },
    installmentValue: { label: 'Valor de cada cuota' },
    totalPayable: {
      label: 'Total a pagar',
      hint: 'Se calcula solo: cuotas × valor de la cuota.',
    },
    frequency: {
      label: 'Frecuencia de cobro',
      placeholder: 'Elige la frecuencia',
    },
    startDate: { label: 'Fecha de inicio' },
    collector: {
      label: 'Cobrador asignado (opcional)',
      placeholder: 'Sin cobrador por ahora',
      hint: 'Puedes asignarlo o cambiarlo después desde el detalle.',
    },
    viewCreated: 'Ver el préstamo creado',
  },
  detail: {
    back: '← Volver a préstamos',
    rows: {
      client: 'Cliente',
      principalAmount: 'Monto prestado',
      installments: 'Cuotas',
      totalPayable: 'Total a pagar',
      frequency: 'Frecuencia',
      startDate: 'Fecha de inicio',
      status: 'Estado',
      closedAt: 'Cerrado el',
      balance: 'Saldo',
      paid: 'Cuotas pagadas',
      overdue: 'Vencido',
      nextDue: 'Próxima cuota',
      collector: 'Cobrador',
    },
    noCollector: 'Sin cobrador asignado',
    collectorSince: (since: string) => `desde ${since}`,
    collectorUntil: (until: string) => `hasta ${until}`,
    assign: {
      title: 'Asignar cobrador',
      label: 'Cobrador',
      placeholder: 'Elige un cobrador',
      hint: 'Cobrará este préstamo desde hoy; la asignación anterior se cierra y queda en el historial.',
      submit: 'Asignar cobrador',
      noCollectors: 'Todavía no tienes cobradores. Registra uno para poder asignarlo.',
    },
    cancel: {
      action: 'Anular préstamo',
      confirmTitle: '¿Anular el préstamo?',
      confirmDescription: 'Solo se puede anular un préstamo que no haya recibido pagos. Esta acción no se deshace.',
      confirmLabel: 'Anular',
      done: 'Préstamo anulado.',
    },
  },
  installments: {
    title: 'Calendario de cuotas',
    caption: 'Cuotas del préstamo, con lo pagado y su estado',
    headers: ['Cuota', 'Vence', 'Esperado', 'Pagado', 'Estado'] as const,
    empty: 'Este préstamo no tiene cuotas por mostrar.',
    summary: (paid: number, total: number, overdue: number) =>
      overdue > 0
        ? `${String(paid)} de ${String(total)} cuotas pagadas · ${String(overdue)} vencidas`
        : `${String(paid)} de ${String(total)} cuotas pagadas`,
    status: { PAID: 'Pagada', PARTIAL: 'Parcial', OVERDUE: 'Vencida', PENDING: 'Pendiente' },
  },
} as const;
