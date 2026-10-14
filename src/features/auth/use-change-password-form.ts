'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { changePassword } from '@/features/auth/auth-api';
import { describeAuthError, issueFieldErrors } from '@/features/auth/error-messages';
import { ChangePasswordFormSchema } from '@/features/auth/password-schemas';
import { toFieldErrors, type FieldErrors } from '@/lib/forms';

export type ChangePasswordField = 'currentPassword' | 'newPassword' | 'confirmPassword';

const EMPTY_VALUES: Record<ChangePasswordField, string> = { currentPassword: '', newPassword: '', confirmPassword: '' };

/**
 * Lógica de cambiar la contraseña con la sesión abierta (p. ej. cuentas que entran con una
 * temporal), sin diseño. Al salir bien la API deja una sesión nueva en la cookie y se sigue a
 * `redirectTo`, o, si se da `onSuccess`, se queda en la pantalla y lo llama.
 */
export function useChangePasswordForm({ redirectTo, onSuccess }: { readonly redirectTo?: string; readonly onSuccess?: () => void }) {
  const router = useRouter();
  const [values, setValues] = useState(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ChangePasswordField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (field: ChangePasswordField) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const fail = (error: unknown) => {
    const { message, field } = describeAuthError(error);
    const errors: FieldErrors<ChangePasswordField> = {};
    for (const [issueField, text] of Object.entries(issueFieldErrors(error))) {
      if (issueField in EMPTY_VALUES) errors[issueField as ChangePasswordField] = text;
    }
    // `PASSWORD_TOO_WEAK` y el largo se llaman `password` en la API: aquí son la contraseña nueva.
    const mapped = field === 'password' ? 'newPassword' : field;
    if (mapped && mapped in EMPTY_VALUES) errors[mapped as ChangePasswordField] = message;
    setFieldErrors(errors);
    setFormError(Object.keys(errors).length === 0 ? message : null);
    setIsSubmitting(false);
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const parsed = ChangePasswordFormSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors<ChangePasswordField>(parsed.error));
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);
    try {
      await changePassword({ currentPassword: parsed.data.currentPassword, newPassword: parsed.data.newPassword });
    } catch (error) {
      fail(error);
      return;
    }
    if (onSuccess) {
      // Se queda en la misma pantalla (la cuenta): limpia el formulario y avisa.
      setValues(EMPTY_VALUES);
      setIsSubmitting(false);
      onSuccess();
      return;
    }
    if (redirectTo) router.replace(redirectTo);
    router.refresh();
  };

  return { values, fieldErrors, formError, isSubmitting, setField, submit };
}
