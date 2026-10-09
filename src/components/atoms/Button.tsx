import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/lib/cn';
import { LoadingDots } from '@/components/atoms/LoadingDots';
import { buttonClasses, type ButtonSize, type ButtonVariant } from '@/components/atoms/button-styles';

export type { ButtonSize, ButtonVariant };

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  /** Reemplaza el contenido por tres puntos y deshabilita el botón, sin cambiar su tamaño. */
  readonly loading?: boolean;
  readonly leftIcon?: ReactNode;
  readonly rightIcon?: ReactNode;
  readonly ref?: Ref<HTMLButtonElement>;
}

/**
 * La acción principal del producto, en los tres estilos del diseño (`primary`, `outline`,
 * `text`) más `inverse` para fondos de marca y sus cuatro estados: reposo, hover/pressed (opacidad), disabled (40%) y loading
 * (puntos). El hover usa opacidad y no un color derivado, así sigue al color de marca que
 * `useThemeStore` cambie en tiempo de ejecución.
 */
export function Button({
  ref,
  type = 'button',
  variant = 'primary',
  size = 'md',
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
        buttonClasses(variant, size),
        'enabled:hover:opacity-85 enabled:active:opacity-70',
        loading ? 'cursor-wait' : 'disabled:cursor-not-allowed disabled:opacity-40',
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
