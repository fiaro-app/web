import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'outline' | 'text' | 'inverse';
export type ButtonSize = 'md' | 'sm';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground',
  outline: 'border-[1.5px] border-primary bg-surface text-primary',
  text: 'bg-transparent text-primary',
  // Para fondos de marca (banda CTA, plan destacado): botón blanco con texto de marca.
  inverse: 'bg-surface text-primary',
};

/** `md` = 48px (estándar); `sm` = 44px (acciones dentro de un modal). */
const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'h-12',
  sm: 'h-11',
};

/** Clases de un botón; las comparten `Button` (acción) y `ButtonLink` (navegación) para verse idénticos. */
export function buttonClasses(variant: ButtonVariant, size: ButtonSize): string {
  return cn(
    'relative inline-flex items-center justify-center rounded-md px-6 text-label font-medium whitespace-nowrap transition-opacity',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
  );
}
