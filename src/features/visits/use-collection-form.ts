'use client';

import { useRouter } from 'next/navigation';
import type { PaymentMethod, VisitOutcome } from '@fiaro-app/contracts';
import { useState, type FormEvent } from 'react';
import { VISITS_TEXT } from '@/content/visits';
import { describeAuthError } from '@/features/auth/error-messages';
import { CollectionFormSchema, type CollectionField } from '@/features/visits/collection-schemas';
import { createVisit } from '@/features/visits/visits-api';
import { isApiRequestError } from '@/lib/api';
import { formatCop } from '@/lib/amount';
import { toFieldErrors, type FieldErrors } from '@/lib/forms';
import { uuidv7 } from '@/lib/uuid';

const errors = VISITS_TEXT.collect.errors;

/** Mensaje de un error al registrar un cobro. */
function describeCollectionError(error: unknown): string {
  if (isApiRequestError(error)) {
    if (error.hasCode('FORBIDDEN')) return errors.forbidden;
    if (error.hasCode('NOT_FOUND')) return errors.notFound;
    if (error.hasCode('VALIDATION_FAILED')) return errors.invalid;
  }
  return describeAuthError(error).message;
}

/**
 * Lógica de «Registrar cobro» desde la web, sin diseño. El `id` de la visita se genera una sola vez por
 * formulario y se reutiliza en cada reintento: si la respuesta se pierde, reenviar no duplica el pago
 * (la API es idempotente por ese id). Al salir bien refresca el préstamo y deja el formulario listo para otro cobro.
 */
export function useCollectionForm({ loanId, installmentValue }: { readonly loanId: string; readonly installmentValue: number }) {
  const router = useRouter();
  const [visitId, setVisitId] = useState(() => uuidv7());
  const [outcome, setOutcome] = useState<VisitOutcome>('PAID');
  const [amount, setAmount] = useState<number | null>(installmentValue);
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [promisedDate, setPromisedDate] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<CollectionField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const chooseOutcome = (next: VisitOutcome) => {
    setOutcome(next);
    setFieldErrors({});
    setNotice(null);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const parsed = CollectionFormSchema.safeParse({ outcome, amount, method, promisedDate });
    if (!parsed.success) {
      setFieldErrors(toFieldErrors<CollectionField>(parsed.error));
      return;
    }
    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);
    setNotice(null);
    const { data } = parsed;
    try {
      await createVisit(loanId, {
        id: visitId,
        outcome: data.outcome,
        occurredAt: new Date().toISOString(),
        ...(data.outcome === 'RESCHEDULED' && { promisedDate: data.promisedDate }),
        ...(data.outcome === 'PAID' && { payment: { amount: data.amount!, method: data.method } }),
      });
    } catch (failure) {
      setFormError(describeCollectionError(failure));
      setIsSubmitting(false);
      return;
    }
    // Visita nueva: otro id para el próximo cobro.
    setVisitId(uuidv7());
    setNotice(VISITS_TEXT.collect.done);
    setPromisedDate('');
    setIsSubmitting(false);
    router.refresh();
  };

  const confirmation = outcome === 'PAID' ? VISITS_TEXT.collect.confirm.PAID(formatCop(amount ?? 0)) : VISITS_TEXT.collect.confirm.other;

  return { outcome, amount, method, promisedDate, fieldErrors, formError, notice, isSubmitting, confirmation, chooseOutcome, setAmount, setMethod, setPromisedDate, submit };
}
