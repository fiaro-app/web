import { cn } from '@/lib/cn';

export interface DividerProps {
  readonly orientation?: 'horizontal' | 'vertical';
  /** Solo decorativo: lo saca del árbol de accesibilidad en vez de anunciarlo como separador. */
  readonly decorative?: boolean;
  readonly className?: string;
}

/** Línea de 1px en tinta al 12% que separa bloques de contenido. */
export function Divider({
  orientation = 'horizontal',
  decorative = false,
  className,
}: Readonly<DividerProps>) {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        'shrink-0 bg-foreground/12',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch',
        className,
      )}
    />
  );
}
