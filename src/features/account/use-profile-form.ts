'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { updateProfile } from '@/features/account/account-api';
import { ProfileFormSchema, toProfileChanges, type ProfileFormValues } from '@/features/account/account-schemas';
import { describeAccountError } from '@/features/account/error-messages';
import { toFieldErrors, type FieldErrors } from '@/lib/forms';

type ProfileField = keyof ProfileFormValues;

/** Lógica del formulario de perfil (nombre y correo de contacto), sin diseño. Manda solo lo que cambió. */
export function useProfileForm(current: { readonly fullName: string; readonly contactEmail: string | null }) {
  const router = useRouter();
  const [values, setValues] = useState<ProfileFormValues>({ fullName: current.fullName, contactEmail: current.contactEmail ?? '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ProfileField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (field: ProfileField) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((previous) => ({ ...previous, [field]: event.target.value }));
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }));
    setNotice(null);
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const parsed = ProfileFormSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors<ProfileField>(parsed.error));
      return;
    }
    const changes = toProfileChanges(parsed.data, current);
    if (!changes) {
      setNotice('No hay cambios para guardar.');
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);
    setNotice(null);
    try {
      await updateProfile(changes);
    } catch (error) {
      const { message, field } = describeAccountError(error);
      if (field === 'contactEmail') setFieldErrors({ contactEmail: message });
      else setFormError(message);
      setIsSubmitting(false);
      return;
    }
    setNotice(changes.contactEmail ? 'Guardado. Te enviamos un código para verificar el correo.' : 'Guardado.');
    setIsSubmitting(false);
    router.refresh();
  };

  return { values, fieldErrors, formError, notice, isSubmitting, setField, submit };
}
