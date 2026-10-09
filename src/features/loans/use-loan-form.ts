'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { issueFieldErrors } from '@/features/auth/error-messages';
import { suggestTotalPayable, todayBusinessDate } from '@/features/loans/loan-calculations';
import { LoanFormSchema, type LoanField, type LoanFormInput } from '@/features/loans/loan-schemas';
import { describeLoanError } from '@/features/loans/error-messages';
import { createLoan } from '@/features/loans/loans-api';
import { toFieldErrors, type FieldErrors } from '@/lib/forms';

const FIELDS: readonly LoanField[] = ['clientId', 'principalAmount', 'installmentCount', 'installmentValue', 'totalPayable', 'frequency', 'startDate'];

function emptyValues(): LoanFormInput {
  return {
    clientId: '',
    principalAmount: null,
    installmentCount: '',
    installmentValue: null,
    totalPayable: null,
    frequency: '',
    startDate: todayBusinessDate(),
  };
}

/**
 * Lógica del formulario de préstamo, sin diseño. El total a pagar se sugiere (cuotas × valor)
 * mientras la persona no lo haya tocado; en cuanto lo edita, se respeta lo que pactó. Al salir
 * bien sigue a `/prestamos`.
 */
export function useLoanForm() {
  const router = useRouter();
  const [values, setValues] = useState<LoanFormInput>(emptyValues);
  const [totalEdited, setTotalEdited] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoanField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearError = (field: LoanField) => setFieldErrors((current) => ({ ...current, [field]: undefined }));

  /** Aplica un cambio y, si el total no se editó a mano, lo vuelve a sugerir. */
  const update = (field: LoanField, patch: Partial<LoanFormInput>, edited = totalEdited) => {
    setValues((current) => {
      const next = { ...current, ...patch };
      if (edited) return next;
      const count = /^\d+$/.test(next.installmentCount) ? Number(next.installmentCount) : null;
      return { ...next, totalPayable: suggestTotalPayable(count, next.installmentValue) };
    });
    clearError(field);
  };

  const setText = (field: 'clientId' | 'installmentCount' | 'frequency' | 'startDate') => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    update(field, { [field]: event.target.value });

  const setAmount = (field: 'principalAmount' | 'installmentValue') => (value: number | null) => update(field, { [field]: value });

  const setTotalPayable = (value: number | null) => {
    setTotalEdited(true);
    update('totalPayable', { totalPayable: value }, true);
  };

  const fail = (error: unknown) => {
    const { message, field } = describeLoanError(error);
    const errors: FieldErrors<LoanField> = {};
    for (const [issueField, text] of Object.entries(issueFieldErrors(error))) {
      if (FIELDS.includes(issueField as LoanField)) errors[issueField as LoanField] = text;
    }
    if (field && FIELDS.includes(field as LoanField)) errors[field as LoanField] = message;
    setFieldErrors(errors);
    setFormError(Object.keys(errors).length === 0 ? message : null);
    setIsSubmitting(false);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const parsed = LoanFormSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors<LoanField>(parsed.error));
      setFormError('Revisa los campos marcados en rojo antes de continuar.');
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);
    try {
      await createLoan(parsed.data);
    } catch (error) {
      fail(error);
      return;
    }
    router.replace('/prestamos');
    router.refresh();
  };

  return { values, fieldErrors, formError, isSubmitting, setText, setAmount, setTotalPayable, submit };
}
