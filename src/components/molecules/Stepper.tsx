import { cn } from '@/lib/cn';

export type StepperSize = 'md' | 'sm';

/** `md` = círculos de 28px; `sm` = 24px (formularios de varios pasos). */
const SIZE_CLASSES: Record<StepperSize, { readonly circle: string; readonly gap: string; readonly connector: string }> = {
  md: { circle: 'size-7 text-caption', gap: 'gap-2', connector: 'w-10' },
  sm: { circle: 'size-6 text-[11px]', gap: 'gap-1.5', connector: 'w-4' },
};

export interface StepperProps {
  readonly steps: readonly string[];
  /** Índice (desde 0) del paso actual; los pasos anteriores y el actual se rellenan. */
  readonly current: number;
  readonly size?: StepperSize;
  readonly className?: string;
}

/** Indicador de progreso de un flujo de varios pasos (registro, alta de préstamo). */
export function Stepper({ steps, current, size = 'md', className }: Readonly<StepperProps>) {
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
            <span className={cn('flex items-center', SIZE_CLASSES[size].gap)}>
              <span
                className={cn(
                  'grid place-items-center rounded-full font-mono font-semibold',
                  SIZE_CLASSES[size].circle,
                  reached
                    ? 'bg-primary text-primary-foreground'
                    : 'border-[1.5px] border-foreground/50 bg-surface text-foreground/65',
                )}
              >
                {index + 1}
              </span>
              <span className={cn('text-caption', reached ? 'font-semibold' : 'text-foreground/65')}>
                {label}
              </span>
            </span>
            {index < steps.length - 1 && (
              <span aria-hidden="true" className={cn('mx-2 h-px bg-foreground/20', SIZE_CLASSES[size].connector)} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
