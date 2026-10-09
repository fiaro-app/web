'use client';

import { useState, type InputHTMLAttributes, type Ref } from 'react';
import { Input } from '@/components/atoms/Input';
import { COMMON_TEXT } from '@/content/common';

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  readonly invalid?: boolean;
  readonly ref?: Ref<HTMLInputElement>;
}

/**
 * Campo de contraseña con el «ojito» para mostrarla u ocultarla. El botón comunica su estado con
 * `aria-pressed` y no cambia el foco del campo; la contraseña vuelve a ocultarse al recargar.
 */
export function PasswordInput({ className, ...props }: Readonly<PasswordInputProps>) {
  const [visible, setVisible] = useState(false);
  const text = COMMON_TEXT.password;

  return (
    <div className="relative">
      <Input {...props} type={visible ? 'text' : 'password'} className={`pr-12 ${className ?? ''}`.trim()} />
      <button
        type="button"
        aria-label={visible ? text.hide : text.show}
        aria-pressed={visible}
        disabled={props.disabled}
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-md text-foreground/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none enabled:hover:text-foreground disabled:opacity-40"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {visible && <path d="M4 4l16 16" />}
        </svg>
      </button>
    </div>
  );
}
