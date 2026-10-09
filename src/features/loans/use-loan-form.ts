'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { issueFieldErrors } from '@/features/auth/error-messages';
import { suggestTotalPayable, todayBusinessDate } from '@/features/loans/loan-calculations';
import { LoanFormSchema, type LoanField, type LoanFormInput } from '@/features/loans/loan-schemas';
import { describeLoanError } from '@/features/loans/error-messages';
import { assignCollector, createLoan } from '@/features/loans/loans-api';
import { toFieldErrors, type FieldErrors } from '@/lib/forms';

const FIELDS: readonly LoanField[] = ['clientId', 'principalAmount', 'installmentCount', 'installmentValue', 'totalPayable', 'frequency', 'startDate', 'collectorId'];

function emptyValues(initialClientId: string): LoanFormInput {
  return {
    clientId: initialClientId,
    principalAmount: null,
    installmentCount: '',
    installmentValue: null,
    totalPayable: null,
    frequency: '',
    startDate: todayBusinessDate(),
    collectorId: '',
  };
}

/**
 * Lógica del formulario de préstamo, sin diseño. El total a pagar se sugiere (cuotas × valor)
 * mientras la persona no lo haya tocado; en cuanto lo edita, se respeta lo que pactó. Al salir
 * bien sigue a `/prestamos`.
 */
export function useLoanForm({ initialClientId = '' }: { readonly initialClientId?: string } = {}) {
  const router = useRouter();
  const [values, setValues] = useState<LoanFormInput>(() => emptyValues(initialClientId));
  const [totalEdited, setTotalEdited] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoanField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  /** Id del préstamo ya creado cuando falló asignar el cobrador: no se puede crear otro por error. */
  const [createdLoanId, setCreatedLoanId] = useState<string | null>(null);

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

  const setText = (field: 'clientId' | 'installmentCount' | 'frequency' | 'startDate' | 'collectorId') => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
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
    if (isSubmitting || createdLoanId !== null) return;

    const parsed = LoanFormSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors<LoanField>(parsed.error));
      setFormError('Revisa los campos marcados en rojo antes de continuar.');
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);
    const { collectorId, ...loanValues } = parsed.data;
    let loan;
    try {
      loan = await createLoan(loanValues);
    } catch (error) {
      fail(error);
      return;
    }
    if (collectorId !== '') {
      try {
        await assignCollector(loan.id, collectorId);
      } catch {
        // El préstamo ya existe: se avisa y se deja asignar desde su detalle, sin permitir crear otro.
        setCreatedLoanId(loan.id);
        setFormError('El préstamo se creó, pero no pudimos asignarle el cobrador. Asígnalo desde el detalle del préstamo.');
        setIsSubmitting(false);
        return;
      }
    }
    router.replace('/prestamos');
    router.refresh();
  };

  return { values, fieldErrors, formError, isSubmitting, createdLoanId, setText, setAmount, setTotalPayable, submit };
}
