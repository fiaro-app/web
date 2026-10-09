import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface FormFieldsetProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/** Agrupa los campos de un paso con el mismo espaciado en todos los formularios. */
export function FormFieldset({ children, className }: Readonly<FormFieldsetProps>) {
  return <div className={cn('flex flex-col gap-5', className)}>{children}</div>;
}
