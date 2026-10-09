import { cn } from '@/lib/cn';

export interface StepperProps {
  readonly steps: readonly string[];
  /** Índice (desde 0) del paso actual; los pasos anteriores y el actual se rellenan. */
  readonly current: number;
  readonly className?: string;
}

/** Indicador de progreso de un flujo de varios pasos (registro, alta de préstamo). */
export function Stepper({ steps, current, className }: Readonly<StepperProps>) {
  return (
    <ol className={cn('flex items-center', className)}>
      {steps.map((label, index) => {
        const reached = index <= current;
        return (
          <li
            key={label}
            aria-current={index === current ? 'step' : undefined}
            className="flex items-center"
          >
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  'grid size-7 place-items-center rounded-full font-mono text-caption font-medium',
                  reached
                    ? 'bg-primary text-primary-foreground'
                    : 'border-[1.5px] border-foreground bg-surface text-foreground/60',
                )}
              >
                {index + 1}
              </span>
              <span className={cn('text-caption font-medium', !reached && 'text-foreground/70')}>
                {label}
              </span>
            </span>
            {index < steps.length - 1 && (
              <span aria-hidden="true" className="mx-2 h-px w-10 bg-foreground/20" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
