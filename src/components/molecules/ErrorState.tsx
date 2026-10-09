import { StateIcon } from '@/components/atoms/StateIcon';
import { Button } from '@/components/atoms/Button';
import { EmptyState } from '@/components/molecules/EmptyState';

export interface ErrorStateProps {
  /** Reintenta lo que falló. */
  readonly onRetry: () => void;
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
}

/**
 * Pantalla de error genérica con "Reintentar". No muestra el mensaje técnico del error: puede
 * traer datos internos y a la persona no le sirve. Solo presentación.
 */
export function ErrorState({
  onRetry,
  title = 'Algo salió mal',
  description = 'No pudimos cargar esta pantalla. Inténtalo de nuevo en un momento.',
  className,
}: Readonly<ErrorStateProps>) {
  return (
    <EmptyState
      className={className}
      icon={<StateIcon name="alert" />}
      tone="error"
      title={title}
      description={description}
      action={<Button onClick={onRetry}>Reintentar</Button>}
    />
  );
}
