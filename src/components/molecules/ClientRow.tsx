import { Avatar } from '@/components/atoms/Avatar';
import { StatusChip, type ChipStatus } from '@/components/atoms/StatusChip';
import { cn } from '@/lib/cn';
import { formatAmount } from '@/lib/amount';

export interface ClientRowProps {
  readonly name: string;
  /** Saldo pendiente en pesos. */
  readonly balance: number;
  readonly status: ChipStatus;
  /** Días de atraso; se muestra bajo el chip solo si es mayor que 0. */
  readonly daysLate?: number;
  /** Si se pasa, la fila es un botón (hover y pressed); si no, es solo informativa. */
  readonly onClick?: () => void;
  readonly className?: string;
}

const ROW_CLASSES = 'flex w-full items-center gap-3 bg-surface px-4 py-3 text-left';

/** Fila de una lista de clientes: avatar, nombre y saldo a la izquierda; estado y días de atraso a la derecha. */
export function ClientRow({
  name,
  balance,
  status,
  daysLate = 0,
  onClick,
  className,
}: Readonly<ClientRowProps>) {
  const content = (
    <>
      <Avatar name={name} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-body font-medium">{name}</span>
        <span className="font-mono text-caption text-foreground/65">
          Saldo ${formatAmount(balance)}
        </span>
      </span>
      <span className="flex flex-col items-end gap-1">
        <StatusChip status={status} />
        {daysLate > 0 && (
          <span className="font-mono text-caption text-destructive">
            {daysLate} {daysLate === 1 ? 'día' : 'días'}
          </span>
        )}
      </span>
    </>
  );

  if (!onClick) {
    return <div className={cn(ROW_CLASSES, className)}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        ROW_CLASSES,
        'transition-colors hover:bg-foreground/4 active:bg-foreground/8',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset',
        className,
      )}
    >
      {content}
    </button>
  );
}
