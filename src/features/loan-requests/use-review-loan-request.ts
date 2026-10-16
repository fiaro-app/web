'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent } from 'react';
import { LOAN_REQUESTS_TEXT } from '@/content/loan-requests';
import type { ApproveLoanRequestBody, LoanRequest } from '@/features/loan-requests/endpoints';
import { describeLoanRequestError } from '@/features/loan-requests/error-messages';
import { approveLoanRequest, rejectLoanRequest } from '@/features/loan-requests/loan-requests-api';

type Decision = 'approve' | 'reject';

/** Lo que el administrador puede ajustar antes de aceptar; arranca con lo que pidió el cobrador. */
export interface ReviewValues {
  readonly fullName: string;
  readonly occupation: string;
  readonly phone: string;
  readonly address: string;
  readonly principalAmount: number | null;
  readonly installmentCount: string;
  readonly installmentValue: number | null;
  readonly totalPayable: number | null;
  readonly frequency: string;
  readonly startDate: string;
}

/** Los valores iniciales del formulario: los de la solicitud. */
export function initialReviewValues(request: LoanRequest): ReviewValues {
  return {
    fullName: request.newClient?.fullName ?? '',
    occupation: request.newClient?.occupation ?? '',
    phone: request.newClient?.phone ?? '',
    address: request.newClient?.address ?? '',
    principalAmount: request.principalAmount,
    installmentCount: String(request.installmentCount),
    installmentValue: request.installmentValue,
    totalPayable: request.totalPayable,
    frequency: request.frequency,
    startDate: request.startDate,
  };
}

/** Solo viaja lo que el administrador cambió: lo demás queda como lo pidió el cobrador. */
export function buildApproveBody(values: ReviewValues, request: LoanRequest): ApproveLoanRequestBody {
  const count = /^\d+$/.test(values.installmentCount) ? Number(values.installmentCount) : request.installmentCount;
  const loan = {
    ...(values.principalAmount !== null && values.principalAmount !== request.principalAmount && { principalAmount: values.principalAmount }),
    ...(count !== request.installmentCount && { installmentCount: count }),
    ...(values.installmentValue !== null && values.installmentValue !== request.installmentValue && { installmentValue: values.installmentValue }),
    ...(values.totalPayable !== null && values.totalPayable !== request.totalPayable && { totalPayable: values.totalPayable }),
    ...(values.frequency !== request.frequency && { frequency: values.frequency as LoanRequest['frequency'] }),
    ...(values.startDate !== request.startDate && { startDate: values.startDate }),
  };
  const original = request.newClient;
  const client =
    original === null
      ? {}
      : {
          ...(values.fullName !== original.fullName && { fullName: values.fullName }),
          ...(values.occupation !== original.occupation && { occupation: values.occupation }),
          ...(values.phone !== original.phone && { phone: values.phone }),
          ...(values.address !== original.address && { address: values.address }),
        };
  return {
    ...(Object.keys(client).length > 0 && { client }),
    ...(Object.keys(loan).length > 0 && { loan }),
  };
}

/**
 * Lógica de resolver una solicitud (aceptar con ajustes o rechazar con un motivo), sin diseño. Si sale
 * bien refresca la página para traer el estado nuevo; si la API lo rechaza (otro administrador ya la
 * resolvió, la cédula ya existe…) deja el mensaje en `error`.
 */
export function useReviewLoanRequest(request: LoanRequest) {
  const router = useRouter();
  const [values, setValues] = useState<ReviewValues>(() => initialReviewValues(request));
  const [reason, setReason] = useState('');
  const [pending, setPending] = useState<Decision | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const setField = <Field extends keyof ReviewValues>(field: Field, value: ReviewValues[Field]) =>
    setValues((current) => ({ ...current, [field]: value }));
  const setText = (field: 'fullName' | 'occupation' | 'phone' | 'address' | 'installmentCount' | 'frequency') =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setField(field, event.target.value);
  const setAmount = (field: 'principalAmount' | 'installmentValue' | 'totalPayable') => (value: number | null) => setField(field, value);
  const setStartDate = (value: string) => setField('startDate', value);
  const changeReason = (event: ChangeEvent<HTMLTextAreaElement>) => setReason(event.target.value);

  const review = async (decision: Decision) => {
    if (pending) return;
    setPending(decision);
    setError(null);
    setNotice(null);
    try {
      await (decision === 'approve' ? approveLoanRequest(request.id, buildApproveBody(values, request)) : rejectLoanRequest(request.id, reason));
      setNotice(decision === 'approve' ? LOAN_REQUESTS_TEXT.review.approved : LOAN_REQUESTS_TEXT.review.rejected);
      router.refresh();
    } catch (error_) {
      setError(describeLoanRequestError(error_).message);
    } finally {
      setPending(null);
    }
  };

  return {
    values,
    reason,
    setText,
    setAmount,
    setStartDate,
    changeReason,
    pending,
    error,
    notice,
    approve: () => review('approve'),
    reject: () => review('reject'),
  };
}
