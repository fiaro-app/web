import type { ReactNode } from 'react';
import { TONE_SURFACE_CLASSES, type Tone } from '@/lib/tone';
import { cn } from '@/lib/cn';

export type StatePillTone = Tone | 'muted';

const MUTED = 'bg-foreground/8 text-foreground/70';

export interface StatePillProps {
  readonly tone: StatePillTone;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Píldora del estado de una fila (Activo, Pendiente, Anulado…): fondo translúcido en el color de la
 * intención y el texto siempre presente, así el estado no depende solo del color.
 */
export function StatePill({ tone, children, className }: Readonly<StatePillProps>) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full px-2.5 text-caption font-semibold whitespace-nowrap',
        tone === 'muted' ? MUTED : TONE_SURFACE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
