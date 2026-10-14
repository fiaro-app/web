import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/lib/cn';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children'> {
  /** Nombre accesible: un botón de solo icono no tiene otro texto que lo describa. */
  readonly label: string;
  /** El icono; es decorativo, el nombre lo da `label`. */
  readonly icon: ReactNode;
  readonly ref?: Ref<HTMLButtonElement>;
}

/** Botón de solo icono con el área táctil de 44px del diseño (`Icon wrapper`). */
export function IconButton({
  ref,
  type = 'button',
  label,
  icon,
  className,
  ...props
}: Readonly<IconButtonProps>) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-sm border border-foreground/15 text-label text-foreground transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'enabled:hover:bg-foreground/6 enabled:active:bg-foreground/10',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="inline-flex">
        {icon}
      </span>
    </button>
  );
}
