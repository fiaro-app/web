import type { VisitOutcome } from '@fiaro-app/contracts';

/** Textos del historial de cobros de un préstamo (`Detalle de préstamo — Historial de cobros`). */
export const VISITS_TEXT = {
  title: 'Historial de cobros',
  caption: 'Visitas de cobro del préstamo',
  headers: ['Fecha', 'Cobrador', 'Resultado', 'Esperado', 'Cobrado', 'Medio'] as const,
  empty: 'Este préstamo todavía no tiene visitas de cobro.',
  outcome: {
    PAID: 'Pagó',
    NOT_FOUND: 'No encontrado',
    REFUSED: 'Se negó a pagar',
    RESCHEDULED: 'Reprogramado',
  } satisfies Record<VisitOutcome, string>,
  method: { CASH: 'Efectivo', NEQUI: 'Nequi', TRANSFER: 'Transferencia' },
  reversed: 'Revertido',
  promised: (date: string) => `Prometió pagar el ${date}`,
  reversal: (reason: string) => `Motivo: ${reason}`,
  reverse: {
    action: 'Revertir pago',
    title: 'Revertir el pago',
    description: 'El pago deja de contar en el saldo del préstamo. No se borra: queda registrado con su motivo. Esta acción no se deshace.',
    reason: { label: 'Motivo', placeholder: 'Ej: El cobrador registró el monto equivocado.' },
    submit: 'Revertir pago',
    cancel: 'Cancelar',
    done: 'Pago revertido.',
  },
} as const;
