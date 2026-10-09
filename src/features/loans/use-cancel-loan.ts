'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { describeLoanError } from '@/features/loans/error-messages';
import { cancelLoan } from '@/features/loans/loans-api';

/**
 * Lógica de anular un préstamo, sin diseño. Si sale bien refresca la página para traer el estado
 * nuevo (`Anulado`); si la API lo rechaza (p. ej. ya recibió pagos) deja el mensaje en `error`.
 */
export function useCancelLoan(loanId: string) {
  const router = useRouter();
  const [isCanceling, setIsCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancel = async () => {
    if (isCanceling) return;
    setIsCanceling(true);
    setError(null);
    try {
      await cancelLoan(loanId);
      router.refresh();
    } catch (failure) {
      setError(describeLoanError(failure).message);
    } finally {
      setIsCanceling(false);
    }
  };

  return { isCanceling, error, cancel };
}
