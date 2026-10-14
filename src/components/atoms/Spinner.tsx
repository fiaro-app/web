import { cn } from '@/lib/cn';

export type SpinnerSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: 'size-4 border-2',
  md: 'size-5 border-2',
  lg: 'size-8 border-[3px]',
};

export interface SpinnerProps {
  readonly size?: SpinnerSize;
  readonly className?: string;
  /**
   * Set when nesting inside an already-labeled control (e.g. `Button`'s own `loading` state,
   * which sets `aria-busy` on the button itself): without this, the spinner's own `aria-label`
   * merges into that control's accessible name instead of announcing on its own.
   */
  readonly decorative?: boolean;
}

/** A loading indicator; inherits `currentColor` so it matches whatever text color surrounds it. */
export function Spinner({ size = 'md', className, decorative = false }: SpinnerProps) {
  return (
    <span
      role={decorative ? undefined : 'status'}
      aria-label={decorative ? undefined : 'Cargando'}
      aria-hidden={decorative || undefined}
      className={cn(
        'inline-block animate-spin rounded-full border-current border-t-transparent',
        SIZE_CLASSES[size],
        className,
      )}
    />
  );
}
