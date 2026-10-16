import type { LoanRequestStatus } from '@/features/loan-requests/endpoints';

/** Textos del módulo Solicitudes de préstamo. */
export const LOAN_REQUESTS_TEXT = {
  title: 'Solicitudes',
  subtitle: 'Préstamos que tus cobradores sugieren. Acéptalos para crearlos o recházalos con un motivo.',
  status: { PENDING: 'Pendiente', APPROVED: 'Aceptada', REJECTED: 'Rechazada' } satisfies Record<LoanRequestStatus, string>,
  filters: { all: 'Todas', label: 'Filtrar por estado' },
  card: {
    newClient: 'Cliente nuevo',
    existingClient: 'Cliente del negocio',
    requestedBy: (collector: string) => `Sugerido por ${collector}`,
    startsOn: (date: string) => `Empieza el ${date}`,
    summary: (principal: string, count: number, installment: string, frequency: string) =>
      `${principal} en ${String(count)} cuotas ${frequency.toLowerCase()}s de ${installment}`,
    rejectionReason: 'Motivo del rechazo',
    viewLoan: 'Ver el préstamo',
  },
  review: {
    open: 'Revisar',
    close: 'Cerrar',
    adjust: 'Ajustar antes de aceptar',
    sectionClient: 'Datos del cliente',
    sectionLoan: 'Condiciones del préstamo',
    fullName: 'Nombre completo',
    occupation: 'Oficio',
    phone: 'Celular',
    address: 'Dirección',
    principalAmount: 'Monto prestado',
    installmentCount: 'Número de cuotas',
    installmentValue: 'Valor de cada cuota',
    totalPayable: 'Total a pagar',
    frequency: 'Frecuencia de cobro',
    startDate: 'Fecha de inicio',
    reasonLabel: 'Motivo del rechazo (opcional)',
    reasonPlaceholder: 'Por ejemplo: el cliente todavía debe el préstamo anterior.',
    approve: 'Aceptar',
    reject: 'Rechazar',
    approved: 'Solicitud aceptada: el préstamo ya está creado y asignado al cobrador.',
    rejected: 'Solicitud rechazada: el cobrador recibirá el aviso.',
    confirm: {
      approve: {
        confirmTitle: '¿Aceptar la solicitud?',
        confirmDescription: 'Se crea el préstamo (y el cliente, si es nuevo) y se asigna al cobrador que lo sugirió.',
        confirmLabel: 'Sí, aceptar',
      },
      reject: {
        confirmTitle: '¿Rechazar la solicitud?',
        confirmDescription: 'No se crea nada y el cobrador recibe el aviso con tu motivo.',
        confirmLabel: 'Sí, rechazar',
      },
    },
  },
  empty: {
    title: 'No hay solicitudes por revisar',
    description: 'Cuando un cobrador sugiera un préstamo, te llegará un aviso y aparecerá aquí. Elige «Todas» para ver las ya resueltas.',
  },
  forbidden: {
    title: 'No tienes acceso a esta sección',
    description: 'Tu cuenta no tiene un negocio activo desde el que ver solicitudes.',
  },
  pagination: {
    summary: (page: number, pages: number, total: number) =>
      `Página ${String(page)} de ${String(pages)} · ${String(total)} solicitudes`,
  },
} as const;
