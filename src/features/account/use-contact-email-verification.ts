'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { requestContactEmailVerification, verifyContactEmail } from '@/features/account/account-api';
import { EmailCodeFormSchema } from '@/features/account/account-schemas';
import { describeAccountError } from '@/features/account/error-messages';

/** Lógica de verificar el correo de contacto con el código que llega por correo, sin diseño. */
export function useContactEmailVerification() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const changeCode = (event: ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
    setCodeError(undefined);
  };

  const resend = async () => {
    if (isBusy) return;
    setIsBusy(true);
    setFormError(null);
    setNotice(null);
    try {
      await requestContactEmailVerification();
      setNotice('Te enviamos un código nuevo; el anterior ya no sirve.');
    } catch (error) {
      setFormError(describeAccountError(error).message);
    }
    setIsBusy(false);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;
    const parsed = EmailCodeFormSchema.safeParse({ code });
    if (!parsed.success) {
      setCodeError(parsed.error.issues[0]?.message);
      return;
    }
    setIsBusy(true);
    setFormError(null);
    setNotice(null);
    try {
      await verifyContactEmail(parsed.data.code);
    } catch (error) {
      const { message, field } = describeAccountError(error);
      if (field === 'code') setCodeError(message);
      else setFormError(message);
      setIsBusy(false);
      return;
    }
    setIsBusy(false);
    router.refresh();
  };

  return { code, codeError, formError, notice, isBusy, changeCode, resend, submit };
}
