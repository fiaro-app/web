import { ToneIcon } from '@/components/atoms/ToneIcon';
import { cn } from '@/lib/cn';
import type { Tone } from '@/lib/tone';

export interface ToastProps {
  readonly message: string;
  /** Texto de la acción (p. ej. "Reintentar"); solo se muestra si también hay `onAction`. */
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  /** Intención del aviso: pone su icono (por defecto, info). */
  readonly tone?: Tone;
  readonly className?: string;
}

/**
 * Aviso temporal oscuro (snackbar) con icono, sombra en capas y una acción opcional a la derecha;
 * entra con un fundido. Se anuncia con cortesía (`role="status"`, `aria-live="polite"`). Es solo la pieza
 * visual: quién la monta, dónde y por cuánto tiempo lo decide quien la use.
 */
export function Toast({ message, actionLabel, onAction, tone = 'info', className }: Readonly<ToastProps>) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pop-in flex items-center justify-between gap-4 rounded-md bg-foreground px-4 py-3.5 text-body font-medium text-surface shadow-lift',
        className,
      )}
    >
      <span className="flex items-center gap-3">
        <ToneIcon tone={tone} className="size-5 shrink-0 text-warning-soft" />
        {message}
      </span>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-sm font-semibold text-warning-soft focus-visible:ring-2 focus-visible:ring-surface focus-visible:outline-none"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
