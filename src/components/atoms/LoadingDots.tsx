import { cn } from '@/lib/cn';

const DOT_DELAY_MS = 150;

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
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="size-1.5 rounded-full bg-current motion-safe:animate-pulse"
          style={{ animationDelay: `${index * DOT_DELAY_MS}ms` }}
        />
      ))}
    </span>
  );
}
