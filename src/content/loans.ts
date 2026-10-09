import type { LoanFrequency, LoanStatus } from '@fiaro-app/contracts';

/** Textos del módulo Préstamos. */
export const LOANS_TEXT = {
  title: 'Préstamos',
  newLoan: '+ Nuevo préstamo',
  tableCaption: 'Préstamos del negocio',
  headers: ['Cliente', 'Monto prestado', 'Cuotas', 'Frecuencia', 'Inicio', 'Estado'] as const,
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
  notFound: { title: 'No encontramos el préstamo', description: 'Puede que ya no exista. Vuelve a la lista y elige otro.' },
  pagination: {
    summary: (page: number, pages: number, total: number) =>
      `Página ${String(page)} de ${String(pages)} · ${String(total)} préstamos`,
  },
  form: {
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
    totalPayable: { label: 'Total a pagar', hint: 'Sugerido: cuotas × valor de la cuota. Cámbialo si pactaron otra cosa.' },
    frequency: { label: 'Frecuencia de cobro', placeholder: 'Elige la frecuencia' },
    startDate: { label: 'Fecha de inicio' },
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
    },
    cancel: {
      action: 'Anular préstamo',
      confirmTitle: '¿Anular el préstamo?',
      confirmDescription: 'Solo se puede anular un préstamo que no haya recibido pagos. Esta acción no se deshace.',
      confirmLabel: 'Anular',
      done: 'Préstamo anulado.',
    },
  },
} as const;
