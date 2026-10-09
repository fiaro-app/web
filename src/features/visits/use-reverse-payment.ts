'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { describeAuthError } from '@/features/auth/error-messages';
import { reversePayment } from '@/features/visits/visits-api';
import { isApiRequestError } from '@/lib/api';

/** Mensaje de un error al revertir un pago. */
function describeReverseError(error: unknown): string {
  if (isApiRequestError(error)) {
    if (error.hasCode('FORBIDDEN')) return 'Solo quien administra el negocio puede revertir pagos.';
    if (error.hasCode('CONFLICT')) return 'Ese pago ya estaba revertido.';
    if (error.hasCode('NOT_FOUND')) return 'No encontramos el pago. Recarga la página.';
  }
  return describeAuthError(error).message;
}

/**
 * Lógica de revertir un pago: pide un motivo y, si sale bien, refresca el detalle del préstamo.
 * Sin diseño.
 */
export function useReversePayment(paymentId: string) {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeReason = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setReason(event.target.value);
    setReasonError(undefined);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const trimmed = reason.trim();
    if (trimmed === '') {
      setReasonError('Escribe el motivo de la reversión.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await reversePayment(paymentId, trimmed);
    } catch (failure) {
      setError(describeReverseError(failure));
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    router.refresh();
  };

  return { reason, reasonError, error, isSubmitting, changeReason, submit };
}
