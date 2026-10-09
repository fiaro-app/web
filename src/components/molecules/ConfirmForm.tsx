'use client';

import { useState, type FormEvent, type FormHTMLAttributes } from 'react';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';

export interface FormConfirmation {
  readonly title: string;
  readonly description: string;
  readonly confirmLabel: string;
}

export interface ConfirmFormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Qué se pregunta antes de guardar. */
  readonly confirmation: FormConfirmation;
  /** El envío de siempre (valida, llama a la API…): solo corre cuando la persona confirma. */
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => unknown;
}

/**
 * Un `<form>` que pide confirmar antes de guardar: al enviarlo abre el modal y solo si la persona
 * lo acepta se ejecuta el `onSubmit` original. Sirve para decisiones que cambian datos del negocio.
 */
export function ConfirmForm({ confirmation, onSubmit, children, ...props }: Readonly<ConfirmFormProps>) {
  const [pending, setPending] = useState<FormEvent<HTMLFormElement> | null>(null);

  const confirm = () => {
    const event = pending;
    setPending(null);
    if (event) void onSubmit(event);
  };

  return (
    <form
      {...props}
      onSubmit={(event) => {
        event.preventDefault();
        setPending(event);
      }}
    >
      {children}
      <ConfirmDialog
        open={pending !== null}
        title={confirmation.title}
        description={confirmation.description}
        confirmLabel={confirmation.confirmLabel}
        onCancel={() => setPending(null)}
        onConfirm={confirm}
      />
    </form>
  );
}
