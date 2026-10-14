import { cn } from '@/lib/cn';

/** Clases de la píldora de filtro; las comparten `FilterPill` (botón) y `FilterPillLink` (enlace). */
export function filterPillClasses(selected: boolean): string {
  return cn(
    'inline-flex items-center justify-center rounded-full border px-3.5 py-2 text-caption font-medium whitespace-nowrap transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    selected
      ? 'border-primary bg-primary text-primary-foreground hover:opacity-85'
      : 'border-foreground bg-surface text-foreground hover:bg-foreground/6 active:bg-foreground/10',
  );
}
