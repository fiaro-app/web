'use client';

import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { issueFieldErrors } from '@/features/auth/error-messages';
import { CollectorFormSchema, type CollectorField } from '@/features/collectors/collector-schemas';
import { inviteCollector } from '@/features/collectors/collectors-api';
import { describeCollectorError } from '@/features/collectors/error-messages';
import type { InvitedMembership } from '@/features/memberships/endpoints';
import { fieldInput } from '@/lib/phone-input';
import { toFieldErrors, type FieldErrors } from '@/lib/forms';

const EMPTY_VALUES: Record<CollectorField, string> = {
  fullName: '',
  nationalId: '',
  phone: '',
  contactEmail: '',
  portfolioId: '',
};

/**
 * Lógica de "Registrar cobrador", sin diseño. Al salir bien guarda lo que devolvió la API en
 * `invited`: ahí viene la contraseña temporal, que solo se muestra una vez.
 */
export function useCollectorForm() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<CollectorField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invited, setInvited] = useState<InvitedMembership | null>(null);

  const setField = (field: CollectorField) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues((current) => ({ ...current, [field]: fieldInput(field, event.target.value) }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const fail = (error: unknown) => {
    const { message, field } = describeCollectorError(error);
    const errors: FieldErrors<CollectorField> = {};
    for (const [issueField, text] of Object.entries(issueFieldErrors(error))) {
      if (issueField in EMPTY_VALUES) errors[issueField as CollectorField] = text;
    }
    if (field && field in EMPTY_VALUES) errors[field as CollectorField] = message;
    setFieldErrors(errors);
    setFormError(Object.keys(errors).length === 0 ? message : null);
    setIsSubmitting(false);
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const parsed = CollectorFormSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors<CollectorField>(parsed.error));
      setFormError('Revisa los campos marcados en rojo antes de continuar.');
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);
    try {
      setInvited(await inviteCollector(parsed.data));
    } catch (error) {
      fail(error);
      return;
    }
    setIsSubmitting(false);
  };

  return { values, fieldErrors, formError, isSubmitting, invited, setField, submit };
}
