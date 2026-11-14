'use client';

import { useRouter } from 'next/navigation';
import { useState, type SubmitEvent } from 'react';
import { PLATFORM_PAYMENTS_TEXT } from '@/content/platform-payments';
import { RefundBodySchema, type RefundMode } from '@/features/platform-payments/endpoints';
import { refundPayment } from '@/features/platform-payments/refund-api';
import { isApiRequestError } from '@/lib/api';

/** El mensaje de un fallo al devolver: el de la API si es uno de los esperados, o el genérico de red. */
function describeFailure(error: unknown): string {
  const text = PLATFORM_PAYMENTS_TEXT.errors;
  if (isApiRequestError(error)) {
    if (error.hasCode('PAYMENT_NOT_REFUNDABLE')) return text.notRefundable;
    if (error.hasCode('REFUND_METHOD_UNSUPPORTED')) return text.methodUnsupported;
    if (error.hasCode('REFUND_GATEWAY_FAILED')) return text.gateway;
    if (error.hasCode('FORBIDDEN')) return text.forbidden;
  }
  return text.network;
}

/** Lógica de devolver un pago: valida el formulario, llama a la API y refresca la lista. Sin diseño. */
export function useRefund(reference: string) {
  const router = useRouter();
  const [mode, setMode] = useState<RefundMode>('MANUAL');
  const [refundReference, setRefundReference] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const parsed = RefundBodySchema.safeParse({ mode, reason, ...(refundReference.trim() !== '' && { reference: refundReference }) });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? PLATFORM_PAYMENTS_TEXT.errors.network);
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await refundPayment(reference, parsed.data);
      router.refresh();
    } catch (error_) {
      setError(describeFailure(error_));
      setIsSubmitting(false);
    }
  };

  return { mode, setMode, refundReference, setRefundReference, reason, setReason, error, isSubmitting, submit };
}
