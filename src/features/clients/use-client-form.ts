'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { issueFieldErrors } from '@/features/auth/error-messages';
import { ClientFormSchema, toClientChanges, type ClientField, type ClientFormInput } from '@/features/clients/client-schemas';
import { createClient, updateClient } from '@/features/clients/clients-api';
import type { ClientResponse } from '@/features/clients/endpoints';
import { describeClientError } from '@/features/clients/error-messages';
import { fieldInput } from '@/lib/phone-input';
import { toFieldErrors, type FieldErrors } from '@/lib/forms';

const EMPTY_VALUES: ClientFormInput = { fullName: '', nationalId: '', phone: '', occupation: '', address: '' };
const FIELDS = Object.keys(EMPTY_VALUES);

/**
 * Lógica del formulario de cliente, sin diseño. Sin `client` da de alta; con `client` edita y
 * manda a la API solo lo que cambió. Al salir bien sigue a `/clientes`.
 */
export function useClientForm({ client }: { readonly client?: ClientResponse } = {}) {
  const router = useRouter();
  const [values, setValues] = useState<ClientFormInput>(
    client
      ? { fullName: client.fullName, nationalId: client.nationalId, phone: client.phone, occupation: client.occupation, address: client.address }
      : EMPTY_VALUES,
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ClientField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (field: ClientField) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: fieldInput(field, event.target.value) }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const fail = (error: unknown) => {
    const { message, field } = describeClientError(error);
    const errors: FieldErrors<ClientField> = {};
    for (const [issueField, text] of Object.entries(issueFieldErrors(error))) {
      if (FIELDS.includes(issueField)) errors[issueField as ClientField] = text;
    }
    if (field && FIELDS.includes(field)) errors[field as ClientField] = message;
    setFieldErrors(errors);
    setFormError(Object.keys(errors).length === 0 ? message : null);
    setIsSubmitting(false);
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const parsed = ClientFormSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors<ClientField>(parsed.error));
      setFormError('Revisa los campos marcados en rojo antes de continuar.');
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);
    try {
      if (client) {
        const changes = toClientChanges(parsed.data, ClientFormSchema.parse(client));
        if (changes) await updateClient(client.id, changes);
      } else {
        await createClient(parsed.data);
      }
    } catch (error) {
      fail(error);
      return;
    }
    router.replace('/clientes');
    router.refresh();
  };

  return { values, fieldErrors, formError, isSubmitting, isEditing: client !== undefined, setField, submit };
}
