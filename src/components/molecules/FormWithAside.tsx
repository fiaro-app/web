import type { ReactNode } from 'react';
import { FormAside, type FormAsideProps } from '@/components/molecules/FormAside';

/** Formulario a la izquierda y panel informativo a la derecha (solo desde `lg`). */
export function FormWithAside({ children, aside }: Readonly<{ children: ReactNode; aside: FormAsideProps }>) {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,32rem)_minmax(0,26rem)]">
      {children}
      <FormAside {...aside} />
    </div>
  );
}
