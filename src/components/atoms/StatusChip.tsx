import { cn } from '@/lib/cn';
import { Skeleton } from '@/components/atoms/Skeleton';

/** Situación de un crédito: al día, pagado, con atraso o en mora. */
export type ChipStatus = 'current' | 'paid' | 'late' | 'delinquent';

const STATUS_STYLES: Record<ChipStatus, { readonly label: string; readonly classes: string }> = {
  current: { label: 'AL DÍA', classes: 'bg-success text-success-foreground' },
  paid: { label: 'PAGADO', classes: 'bg-success text-success-foreground' },
  late: { label: 'ATRASO', classes: 'bg-warning text-warning-foreground' },
  delinquent: { label: 'MORA', classes: 'bg-destructive text-destructive-foreground' },
};

export interface StatusChipProps {
  readonly status: ChipStatus;
  /** Muestra la píldora gris de carga en lugar del estado. */
  readonly loading?: boolean;
  readonly className?: string;
}

/**
 * Píldora con la situación de un crédito, en el color semántico del diseño (musgo, ámbar o
 * grana). El texto siempre acompaña al color, así el estado no depende solo de distinguirlo.
 */
export function StatusChip({ status, loading = false, className }: Readonly<StatusChipProps>) {
  if (loading) {
    return <Skeleton className={cn('h-[26px] w-14 rounded-full', className)} />;
  }

  const { label, classes } = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        'inline-flex h-[26px] items-center rounded-full px-3 text-caption font-medium whitespace-nowrap',
        classes,
        className,
      )}
    >
      {label}
    </span>
  );
}
