import { cn } from '@/lib/cn';

/** Desfase de cada punto; clases literales para que Tailwind las detecte. */
const DOT_DELAY_CLASSES = ['', '[animation-delay:150ms]', '[animation-delay:300ms]'] as const;

export interface LoadingDotsProps {
  readonly className?: string;
}

/**
 * Los tres puntos del estado `loading` de `Button`; heredan `currentColor`. Es decorativo: el
 * control que lo contiene anuncia su propio estado (`aria-busy`). Para una carga independiente
 * usar `Spinner`.
 */
export function LoadingDots({ className }: Readonly<LoadingDotsProps>) {
  return (
    <span aria-hidden="true" className={cn('inline-flex items-center gap-1.5', className)}>
      {DOT_DELAY_CLASSES.map((delay) => (
        <span
          key={delay}
          className={cn('size-1.5 rounded-full bg-current motion-safe:animate-pulse', delay)}
        />
      ))}
    </span>
  );
}
