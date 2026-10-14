import { cn } from '@/lib/cn';
import { formatAmount } from '@/lib/amount';
import { TONE_TEXT_CLASSES, type Tone } from '@/lib/tone';

export interface HistoryRowProps {
  /** Fecha ya formateada (p. ej. "12 sep 2026"). */
  readonly date: string;
  /** Medio de pago (Efectivo, Nequi…). */
  readonly method: string;
  readonly amount: number;
  readonly statusLabel: string;
  readonly statusTone: Tone;
  readonly className?: string;
}

/** Fila del historial de pagos: fecha y medio a la izquierda; monto en mono y estado a la derecha. */
export function HistoryRow({
  date,
  method,
  amount,
  statusLabel,
  statusTone,
  className,
}: Readonly<HistoryRowProps>) {
  return (
    <div className={cn('flex items-center justify-between gap-4 bg-surface px-4 py-3', className)}>
      <div className="flex flex-col">
        <span className="text-label font-medium">{date}</span>
        <span className="text-caption">{method}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-mono text-body font-medium">${formatAmount(amount)}</span>
        <span className={cn('text-caption font-medium', TONE_TEXT_CLASSES[statusTone])}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
}
