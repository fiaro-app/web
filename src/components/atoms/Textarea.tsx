import type { Ref, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { fieldClasses } from '@/lib/field-styles';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Pone el borde rojo y `aria-invalid`, sin ser dueño del mensaje de error (ver `FormField`). */
  readonly invalid?: boolean;
  readonly ref?: Ref<HTMLTextAreaElement>;
}

/**
 * Campo de texto de varias líneas (comentarios y notas) con los mismos estados que `Input`:
 * reposo, foco, error y deshabilitado. Crece en vertical y no en horizontal.
 */
export function Textarea({ ref, invalid = false, className, rows = 3, ...props }: Readonly<TextareaProps>) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid}
      className={cn(fieldClasses(invalid, true), 'resize-y text-body placeholder:text-foreground/70', className)}
      {...props}
    />
  );
}
