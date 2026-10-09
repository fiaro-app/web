'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { deactivateAccount } from '@/features/account/account-api';
import { DeactivateFormSchema } from '@/features/account/account-schemas';
import { describeAccountError } from '@/features/account/error-messages';

/** Lógica de desactivar la cuenta: pide la contraseña y, si sale bien, vuelve al inicio de sesión. Sin diseño. */
export function useDeactivateAccount() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setPasswordError(undefined);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const parsed = DeactivateFormSchema.safeParse({ password });
    if (!parsed.success) {
      setPasswordError(parsed.error.issues[0]?.message);
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      await deactivateAccount(parsed.data.password);
    } catch (error) {
      const { message, field } = describeAccountError(error);
      if (field === 'currentPassword') setPasswordError(message);
      else setFormError(message);
      setIsSubmitting(false);
      return;
    }
    router.replace('/login');
    router.refresh();
  };

  return { password, passwordError, formError, isSubmitting, changePassword, submit };
}
