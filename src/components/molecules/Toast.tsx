import { cn } from '@/lib/cn';

export interface ToastProps {
  readonly message: string;
  /** Texto de la acción (p. ej. "Reintentar"); solo se muestra si también hay `onAction`. */
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly className?: string;
}

/**
 * Aviso temporal oscuro (snackbar) con una acción opcional a la derecha. Es solo la pieza
 * visual: quién la monta, dónde y por cuánto tiempo lo decide quien la use.
 */
export function Toast({ message, actionLabel, onAction, className }: Readonly<ToastProps>) {
  return (
    <div
      role="status"
      className={cn(
        'flex items-center justify-between gap-4 rounded-md bg-foreground px-4 py-3.5 text-body font-medium text-surface',
        className,
      )}
    >
      <span>{message}</span>
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
