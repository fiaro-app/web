import { cn } from '@/lib/cn';

/**
 * Clases base de los controles de texto de una línea (`Input`, `Select`): 44px de alto, borde de
 * 1px en tinta, y al enfocar o marcar error el borde pasa visualmente a 2px (borde + `ring-1`,
 * para que el campo no cambie de tamaño). El tamaño de letra lo pone cada control.
 *
 * @param invalid - Borde rojo permanente, que gana sobre el estado de foco.
 * @param multiline - Campo de varias líneas (`Textarea`): alto mínimo en vez de los 44px fijos.
 */
export function fieldClasses(invalid: boolean, multiline = false): string {
  return cn(
    multiline ? 'min-h-24 py-3' : 'h-11',
    'w-full rounded-sm border bg-surface px-4 text-foreground transition-colors',
    'focus:outline-none disabled:cursor-not-allowed disabled:opacity-40',
    invalid
      ? 'border-destructive ring-1 ring-destructive'
      : 'border-foreground focus:border-primary focus:ring-1 focus:ring-primary',
  );
}
