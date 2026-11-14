import type { ReactNode } from 'react';
import { FormAside, type FormAsideProps } from '@/components/molecules/FormAside';

export interface FormWithAsideProps {
  readonly children: ReactNode;
  readonly aside: FormAsideProps;
  /** Lo que va en la columna derecha, debajo del panel informativo y visible también bajo `lg`. */
  readonly belowAside?: ReactNode;
}

/** Formulario a la izquierda y panel informativo a la derecha (solo desde `lg`). */
export function FormWithAside({ children, aside, belowAside }: Readonly<FormWithAsideProps>) {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,32rem)_minmax(0,26rem)]">
      {children}
      <div className="flex flex-col gap-6">
        <FormAside {...aside} />
        {belowAside}
      </div>
    </div>
  );
}
