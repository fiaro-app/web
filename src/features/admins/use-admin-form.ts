'use client';

import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { AdminFormSchema, type AdminField } from '@/features/admins/admin-schemas';
import { inviteAdmin } from '@/features/admins/admins-api';
import { describeAdminError } from '@/features/admins/error-messages';
import { issueFieldErrors } from '@/features/auth/error-messages';
import { toFieldErrors, type FieldErrors } from '@/lib/forms';
import { fieldInput } from '@/lib/phone-input';

const EMPTY_VALUES: Record<AdminField, string> = { fullName: '', nationalId: '', phone: '', contactEmail: '' };

/**
 * Lógica de "Invitar administrador", sin diseño. Al salir bien guarda lo que devolvió la API en `invited`: ahí viene la
 * contraseña temporal, que solo se muestra una vez.
 */
export function useAdminForm() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<AdminField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invited, setInvited] = useState<{ fullName: string; tempPassword: string | null } | null>(null);

  const setField = (field: AdminField) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: fieldInput(field, event.target.value) }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const fail = (error: unknown) => {
    const { message, field } = describeAdminError(error);
    const errors: FieldErrors<AdminField> = {};
    for (const [issueField, text] of Object.entries(issueFieldErrors(error))) {
      if (issueField in EMPTY_VALUES) errors[issueField as AdminField] = text;
    }
    if (field && field in EMPTY_VALUES) errors[field as AdminField] = message;
    setFieldErrors(errors);
    setFormError(Object.keys(errors).length === 0 ? message : null);
    setIsSubmitting(false);
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const parsed = AdminFormSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors<AdminField>(parsed.error));
      setFormError('Revisa los campos marcados en rojo antes de continuar.');
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);
    try {
      const { tempPassword } = await inviteAdmin(parsed.data);
      setInvited({ fullName: parsed.data.fullName, tempPassword });
    } catch (error) {
      fail(error);
      return;
    }
    setIsSubmitting(false);
  };

  return { values, fieldErrors, formError, isSubmitting, invited, setField, submit };
}
