import type { InputHTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/cn';
import { fieldClasses } from '@/lib/field-styles';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Pone el borde rojo y `aria-invalid`, sin ser dueño del mensaje de error (ver `FormField`). */
  readonly invalid?: boolean;
  readonly ref?: Ref<HTMLInputElement>;
}

/**
 * Campo de texto de una línea con los cuatro estados del diseño: reposo (borde en tinta), foco
 * (borde de 2px en color de marca), error (borde de 2px en rojo) y deshabilitado (40%).
 * Se combina con `Label` y el mensaje de error mediante `FormField`.
 */
export function Input({ ref, invalid = false, className, ...props }: Readonly<InputProps>) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid}
      className={cn(fieldClasses(invalid), 'text-body placeholder:text-foreground/70', className)}
      {...props}
    />
  );
}
