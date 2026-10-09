'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { changeCollectorPortfolio, deactivateCollector, resetCollectorPassword } from '@/features/collectors/collectors-api';
import { describeCollectorError } from '@/features/collectors/error-messages';
import type { CollectorDetail } from '@/features/collectors/get-collector.server';

/** Acción en curso o confirmada: solo una a la vez. */
export type CollectorAction = 'portfolio' | 'deactivate' | 'reset-password';

/**
 * Lógica de gestionar un cobrador (cambiar cartera, restablecer contraseña y desactivar), sin
 * diseño. Cada acción reporta su error en `error` y, si sale bien, refresca la página para traer
 * el estado nuevo; la contraseña temporal queda en `tempPassword` y se muestra una sola vez.
 */
export function useCollectorActions(collector: Pick<CollectorDetail, 'id' | 'roles' | 'portfolioId'>) {
  const router = useRouter();
  const [pending, setPending] = useState<CollectorAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [portfolioId, setPortfolioId] = useState(collector.portfolioId ?? '');
  const [notice, setNotice] = useState<string | null>(null);

  const run = async (action: CollectorAction, operation: () => Promise<void>, success?: string) => {
    if (pending) return;
    setPending(action);
    setError(null);
    setNotice(null);
    try {
      await operation();
      if (success) setNotice(success);
      router.refresh();
    } catch (failure) {
      setError(describeCollectorError(failure).message);
    } finally {
      setPending(null);
    }
  };

  const savePortfolio = () => {
    if (portfolioId === '') {
      setError('Elige la cartera del cobrador.');
      return Promise.resolve();
    }
    return run(
      'portfolio',
      async () => {
        await changeCollectorPortfolio(collector.id, collector.roles, portfolioId);
      },
      'Cartera actualizada.',
    );
  };

  const resetPassword = () =>
    run('reset-password', async () => {
      const result = await resetCollectorPassword(collector.id);
      setTempPassword(result.tempPassword);
    });

  const deactivate = () =>
    run('deactivate', async () => {
      await deactivateCollector(collector.id);
    }, 'Cobrador desactivado.');

  return { pending, error, notice, tempPassword, portfolioId, setPortfolioId, savePortfolio, resetPassword, deactivate };
}
