import type { SettlementStatus } from '@fiaro-app/contracts';

/** Textos del módulo Cuadres. */
export const SETTLEMENTS_TEXT = {
  title: 'Cuadres',
  tableCaption: 'Cuadres de los cobradores',
  headers: ['Cobrador', 'Cartera', 'Fecha', 'Esperado', 'Cobrado', 'Diferencia', 'Estado'] as const,
  review: 'Revisar',
  view: 'Ver',
  status: {
    PENDING: 'Pendiente',
    APPROVED: 'Aprobado',
    REJECTED: 'Rechazado',
  } satisfies Record<SettlementStatus, string>,
  filters: { all: 'Todos', label: 'Filtrar por estado' },
  empty: {
    title: 'Aún no hay cuadres',
    description: 'Cuando tus cobradores cierren el día, sus cuadres aparecerán aquí para que los revises.',
  },
  emptyFiltered: {
    title: 'Sin cuadres en este estado',
    description: 'Prueba con otro filtro para ver los demás cuadres.',
  },
  forbidden: {
    title: 'No tienes acceso a esta sección',
    description: 'Tu cuenta no tiene un negocio activo desde el que ver cuadres.',
  },
  notFound: { title: 'No encontramos el cuadre', description: 'Puede que ya no exista. Vuelve a la lista y elige otro.' },
  pagination: {
    summary: (page: number, pages: number, total: number) =>
      `Página ${String(page)} de ${String(pages)} · ${String(total)} cuadres`,
  },
  detail: {
    back: '← Volver a cuadres',
    title: (collector: string) => `Cuadre de ${collector}`,
    rows: {
      collector: 'Cobrador',
      portfolio: 'Cartera',
      date: 'Fecha',
      expected: 'Esperado',
      collected: 'Cobrado',
      difference: 'Diferencia',
      cash: 'Efectivo',
      nequi: 'Nequi',
      transfer: 'Transferencia',
      status: 'Estado',
      submittedAt: 'Enviado el',
      reviewedAt: 'Revisado el',
    },
    collectorNote: 'Nota del cobrador',
    reviewNote: 'Comentario del prestamista',
    balanced: 'Cuadra',
  },
  reviewForm: {
    noteLabel: 'Comentario (opcional)',
    notePlaceholder: 'Ej: Falta el recibo de la Calle 45',
    approve: 'Aprobar cuadre',
    reject: 'Rechazar cuadre',
    approved: 'Cuadre aprobado.',
    rejected: 'Cuadre rechazado.',
  },
} as const;
