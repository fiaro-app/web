'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { issueFieldErrors } from '@/features/auth/error-messages';
import { suggestTotalPayable, todayBusinessDate } from '@/features/loans/loan-calculations';
import { LoanFormSchema, type LoanField, type LoanFormInput } from '@/features/loans/loan-schemas';
import { describeLoanError } from '@/features/loans/error-messages';
import { assignCollector, createLoan } from '@/features/loans/loans-api';
import { toFieldErrors, type FieldErrors } from '@/lib/forms';

const FIELDS: ReadonlySet<string> = new Set<LoanField>(['clientId', 'principalAmount', 'installmentCount', 'installmentValue', 'totalPayable', 'frequency', 'startDate', 'collectorId']);

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
 * Lógica del formulario de préstamo, sin diseño. El total a pagar no se escribe: se calcula siempre
 * (cuotas × valor de la cuota) y la pantalla solo lo muestra. Al salir bien sigue a `/prestamos`.
 */
export function useLoanForm({ initialClientId = '' }: { readonly initialClientId?: string } = {}) {
  const router = useRouter();
  const [values, setValues] = useState<LoanFormInput>(() => emptyValues(initialClientId));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoanField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  /** Id del préstamo ya creado cuando falló asignar el cobrador: no se puede crear otro por error. */
  const [createdLoanId, setCreatedLoanId] = useState<string | null>(null);

  const clearError = (field: LoanField) => setFieldErrors((current) => ({ ...current, [field]: undefined }));

  /** Aplica un cambio y recalcula el total a pagar. */
  const update = (field: LoanField, patch: Partial<LoanFormInput>) => {
    setValues((current) => {
      const next = { ...current, ...patch };
      const count = /^\d+$/.test(next.installmentCount) ? Number(next.installmentCount) : null;
      return { ...next, totalPayable: suggestTotalPayable(count, next.installmentValue) };
    });
    clearError(field);
  };

  const setText = (field: 'clientId' | 'installmentCount' | 'frequency' | 'startDate' | 'collectorId') => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    update(field, { [field]: event.target.value });

  const setStartDate = (value: string) => update('startDate', { startDate: value });

  const setAmount = (field: 'principalAmount' | 'installmentValue') => (value: number | null) => update(field, { [field]: value });

  const fail = (error: unknown) => {
    const { message, field } = describeLoanError(error);
    const errors: FieldErrors<LoanField> = {};
    for (const [issueField, text] of Object.entries(issueFieldErrors(error))) {
      if (FIELDS.has(issueField)) errors[issueField as LoanField] = text;
    }
    if (field && FIELDS.has(field)) errors[field as LoanField] = message;
    setFieldErrors(errors);
    setFormError(Object.keys(errors).length === 0 ? message : null);
    setIsSubmitting(false);
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
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

  return { values, fieldErrors, formError, isSubmitting, createdLoanId, setText, setAmount, setStartDate, submit };
}
