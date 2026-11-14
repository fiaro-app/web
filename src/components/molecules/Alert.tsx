import type { ReactNode } from 'react';
import { ToneIcon } from '@/components/atoms/ToneIcon';
import { cn } from '@/lib/cn';
import { TONE_SURFACE_CLASSES, type Tone } from '@/lib/tone';

export interface AlertProps {
  readonly tone?: Tone;
  /** Título en negrita sobre el mensaje; sin él, el mensaje va solo. */
  readonly title?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Mensaje en línea con icono, fondo translúcido y borde del color de su intención (éxito, aviso,
 * error, info), con un título opcional. Entra con un fundido suave. Los errores se anuncian de inmediato (`role="alert"`); el resto, con cortesía
 * (`role="status"`).
 *
 * @example
 * <Alert tone="warning">Esta cuota ya tiene 3 días de atraso.</Alert>
 */
export function Alert({ tone = 'info', title, children, className }: Readonly<AlertProps>) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'pop-in flex items-start gap-3 rounded-md border border-current/20 px-4 py-3 text-body',
        TONE_SURFACE_CLASSES[tone],
        className,
      )}
    >
      <ToneIcon tone={tone} className="mt-0.5 size-5 shrink-0" />
      <div className="flex flex-col gap-0.5">
        {title && <strong className="font-semibold">{title}</strong>}
        <span className="font-medium">{children}</span>
      </div>
    </div>
  );
}
