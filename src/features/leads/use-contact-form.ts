'use client';

import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { describeAuthError, issueFieldErrors } from '@/features/auth/error-messages';
import { ContactFormSchema, type ContactField } from '@/features/leads/lead-schemas';
import { sendLead } from '@/features/leads/leads-api';
import { toFieldErrors, type FieldErrors } from '@/lib/forms';

const EMPTY_VALUES: Record<ContactField, string> = { name: '', phone: '', email: '', message: '' };

function isContactField(field: string | null): field is ContactField {
  return field !== null && field in EMPTY_VALUES;
}

/**
 * Lógica del formulario «Contactar ventas», sin diseño. Valida en el navegador, manda el contacto
 * a `POST /leads` y, si queda recibido, deja `isSent` en `true`. El campo señuelo `website` (que un
 * robot llena y una persona no ve) viaja solo si alguien lo llenó, y entonces la API descarta el contacto.
 */
export function useContactForm() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ContactField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const setField = (field: ContactField) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const fail = (error: unknown) => {
    const { message, field } = describeAuthError(error);
    const errors: FieldErrors<ContactField> = {};
    for (const [issueField, text] of Object.entries(issueFieldErrors(error))) {
      if (isContactField(issueField)) errors[issueField] = text;
    }
    if (isContactField(field)) errors[field] = message;
    setFieldErrors(errors);
    setFormError(Object.keys(errors).length === 0 ? message : null);
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const parsed = ContactFormSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors<ContactField>(parsed.error));
      setFormError(null);
      return;
    }
    setFieldErrors({});
    setFormError(null);
    setIsSubmitting(true);
    // Señuelo: una persona nunca lo ve ni lo llena; un robot que rellena el formulario sí, y la API descarta el contacto.
    const decoy = new FormData(event.currentTarget).get('website');
    try {
      await sendLead({
        name: parsed.data.name,
        message: parsed.data.message,
        ...(parsed.data.phone && { phone: parsed.data.phone }),
        ...(parsed.data.email && { email: parsed.data.email }),
        ...(typeof decoy === 'string' && decoy !== '' && { website: decoy }),
      });
      setIsSent(true);
    } catch (error) {
      fail(error);
    }
    setIsSubmitting(false);
  };

  return { values, fieldErrors, formError, isSubmitting, isSent, setField, submit };
}
