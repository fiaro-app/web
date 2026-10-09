import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/lib/cn';
import { LoadingDots } from '@/components/atoms/LoadingDots';

export type ButtonVariant = 'primary' | 'outline' | 'text';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground',
  outline: 'border-[1.5px] border-primary bg-surface text-primary',
  text: 'bg-transparent text-primary',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  /** Reemplaza el contenido por tres puntos y deshabilita el botón, sin cambiar su tamaño. */
  readonly loading?: boolean;
  readonly leftIcon?: ReactNode;
  readonly rightIcon?: ReactNode;
  readonly ref?: Ref<HTMLButtonElement>;
}

/**
 * La acción principal del producto, en los tres estilos del diseño (`primary`, `outline`,
 * `text`) y sus cuatro estados: reposo, hover/pressed (opacidad), disabled (40%) y loading
 * (puntos). El hover usa opacidad y no un color derivado, así sigue al color de marca que
 * `useThemeStore` cambie en tiempo de ejecución.
 */
export function Button({
  ref,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: Readonly<ButtonProps>) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        'relative inline-flex h-12 items-center justify-center rounded-md px-6 text-label font-medium transition-opacity',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'enabled:hover:opacity-85 enabled:active:opacity-70',
        loading ? 'cursor-wait' : 'disabled:cursor-not-allowed disabled:opacity-40',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {/* El contenido sigue ocupando su espacio (solo se oculta) para que `loading` no cambie el ancho. */}
      <span className={cn('inline-flex items-center gap-2', loading && 'opacity-0')}>
        {leftIcon}
        {children}
        {rightIcon}
      </span>
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <LoadingDots />
        </span>
      )}
    </button>
  );
}
