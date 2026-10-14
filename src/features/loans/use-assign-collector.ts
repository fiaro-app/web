'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { describeLoanError } from '@/features/loans/error-messages';
import { assignCollector } from '@/features/loans/loans-api';

/**
 * Lógica de asignar (o cambiar) el cobrador de un préstamo, sin diseño. Si sale bien refresca la
 * página para traer el cobrador nuevo; si la API lo rechaza deja el mensaje en `error`.
 */
export function useAssignCollector(loanId: string) {
  const router = useRouter();
  const [collectorId, setCollectorId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const changeCollector = (event: ChangeEvent<HTMLSelectElement>) => {
    setCollectorId(event.target.value);
    setError(null);
    setNotice(null);
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (collectorId === '') {
      setError('Elige el cobrador.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setNotice(null);
    try {
      await assignCollector(loanId, collectorId);
    } catch (failure) {
      setError(describeLoanError(failure).message);
      setIsSubmitting(false);
      return;
    }
    setNotice('Cobrador asignado.');
    setCollectorId('');
    setIsSubmitting(false);
    router.refresh();
  };

  return { collectorId, isSubmitting, error, notice, changeCollector, submit };
}
