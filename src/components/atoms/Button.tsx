import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/lib/cn';
import { Spinner } from '@/components/atoms/Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover disabled:hover:bg-primary',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-border disabled:hover:bg-secondary',
  destructive:
    'bg-destructive text-destructive-foreground hover:opacity-90 disabled:hover:opacity-100',
  ghost:
    'bg-transparent text-foreground hover:bg-secondary disabled:hover:bg-transparent',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  /** Shows a spinner in place of the icon slots and disables the button, without layout shift. */
  readonly loading?: boolean;
  readonly leftIcon?: ReactNode;
  readonly rightIcon?: ReactNode;
  readonly ref?: Ref<HTMLButtonElement>;
}

/**
 * The base clickable action, covering every interactive state a design system needs: hover,
 * focus-visible (keyboard-only ring), active (press), disabled, and loading.
 */
export function Button({
  ref,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: Readonly<ButtonProps>) {
  return (
    <button
      ref={ref}
      disabled={disabled ?? loading}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'active:scale-[0.98]',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      aria-busy={loading}
      {...props}
    >
      {loading ? <Spinner decorative size={size === 'lg' ? 'md' : 'sm'} /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
