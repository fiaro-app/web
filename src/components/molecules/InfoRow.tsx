import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface InfoRowProps {
  readonly label: string;
  readonly value: ReactNode;
  readonly className?: string;
}

/** Fila de detalle "etiqueta … valor" (14px; el valor en medium) para fichas de cliente o préstamo. */
export function InfoRow({ label, value, className }: Readonly<InfoRowProps>) {
  return (
    <div
      className={cn(
        'flex h-11 items-center justify-between gap-4 bg-surface px-4 text-label',
        className,
      )}
    >
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
