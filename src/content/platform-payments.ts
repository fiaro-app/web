/** Textos de «Pagos de la plataforma» y del reembolso (D-156 de la API). */
export const PLATFORM_PAYMENTS_TEXT = {
  title: 'Pagos de la plataforma',
  description: 'Los últimos pagos del plan de todos los negocios. Devolver un pago le resta al negocio los meses que ese pago había sumado.',
  forbidden: {
    title: 'No tienes acceso a esta sección',
    description: 'Solo quien opera la plataforma puede ver los pagos de todos los negocios.',
  },
  empty: 'Todavía no hay pagos.',
  columns: { date: 'Fecha', business: 'Negocio', plan: 'Plan', amount: 'Valor', method: 'Medio', status: 'Estado', action: 'Acción' },
  status: { PENDING: 'En proceso', APPROVED: 'Pagado', DECLINED: 'Rechazado', VOIDED: 'Anulado', ERROR: 'Con error', REFUNDED: 'Reembolsado' },
  refund: {
    open: 'Reembolsar',
    title: (business: string) => `Reembolsar el pago de ${business}`,
    mode: 'Cómo se devuelve',
    modes: {
      MANUAL: 'Ya lo devolví por otro lado (solo registrar)',
      WOMPI_VOID: 'Anular la transacción en Wompi (solo tarjeta)',
    },
    reference: 'Referencia de la devolución (opcional)',
    reason: 'Motivo',
    submit: 'Registrar reembolso',
    cancel: 'Cancelar',
  },
  errors: {
    notRefundable: 'Ese pago ya no se puede reembolsar: solo los pagos aprobados que no se han devuelto.',
    methodUnsupported: 'Ese pago no se puede anular en Wompi (solo tarjeta, con las llaves configuradas). Regístralo como devolución manual.',
    gateway: 'Wompi no aceptó la anulación. Inténtalo de nuevo o regístrala como devolución manual.',
    forbidden: 'No tienes permiso para reembolsar pagos.',
    network: 'No pudimos hablar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
  },
} as const;
