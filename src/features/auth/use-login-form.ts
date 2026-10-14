'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { signIn } from '@/features/auth/auth-api';
import { describeAuthError } from '@/features/auth/error-messages';
import { SignInFormSchema, type SignInField, type SignInFormInput } from '@/features/auth/schemas';
import { toFieldErrors, type FieldErrors } from '@/lib/forms';

const EMPTY_VALUES: SignInFormInput = { phone: '', password: '' };

export interface UseLoginFormOptions {
  /** Ruta interna a la que se va tras iniciar sesión (ya saneada por quien llama). */
  readonly redirectTo: string;
}

/**
 * Lógica del formulario de inicio de sesión, sin nada de diseño: valores, validación con el schema
 * del contrato, llamada a la API, errores por campo o del formulario y redirección. La vista
 * (`LoginForm`) solo pinta lo que devuelve.
 */
export function useLoginForm({ redirectTo }: UseLoginFormOptions) {
  const router = useRouter();
  const [values, setValues] = useState<SignInFormInput>(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<SignInField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (field: SignInField) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    // Corregir un campo le quita su error, sin esperar al siguiente envío.
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const parsed = SignInFormSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors<SignInField>(parsed.error));
      setFormError(null);
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);
    try {
      await signIn(parsed.data);
      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      const { message, field } = describeAuthError(error);
      if (field === 'phone' || field === 'password') {
        setFieldErrors({ [field]: message });
      } else {
        setFormError(message);
      }
      setIsSubmitting(false);
    }
  };

  return { values, fieldErrors, formError, isSubmitting, setField, submit };
}
