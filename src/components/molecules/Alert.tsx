import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { TONE_SURFACE_CLASSES, type Tone } from '@/lib/tone';

export interface AlertProps {
  readonly tone?: Tone;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Mensaje en línea con fondo translúcido y texto del color de su intención (éxito, aviso,
 * error, info). Los errores se anuncian de inmediato (`role="alert"`); el resto, con cortesía
 * (`role="status"`).
 *
 * @example
 * <Alert tone="warning">Esta cuota ya tiene 3 días de atraso.</Alert>
 */
export function Alert({ tone = 'info', children, className }: Readonly<AlertProps>) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-md px-4 py-3 text-body font-medium',
        TONE_SURFACE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
