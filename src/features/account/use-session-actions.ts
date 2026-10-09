'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { revokeAllSessions, revokeOtherSessions, revokeSession } from '@/features/account/account-api';
import { describeAccountError } from '@/features/account/error-messages';

/**
 * Lógica de cerrar sesiones desde la cuenta: una en concreto, las demás (la de este navegador sigue) o todas (esta
 * incluida, y se vuelve al inicio de sesión). Sin diseño.
 */
export function useSessionActions() {
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const run = async (operation: () => Promise<unknown>, onDone: () => void) => {
    if (isBusy) return;
    setIsBusy(true);
    setError(null);
    setNotice(null);
    try {
      await operation();
    } catch (failure) {
      setError(describeAccountError(failure).message);
      setIsBusy(false);
      return;
    }
    onDone();
    setIsBusy(false);
  };

  const closeOne = (id: string) =>
    run(
      () => revokeSession(id),
      () => {
        setNotice('Cerramos esa sesión.');
        router.refresh();
      },
    );
  const closeOthers = () =>
    run(revokeOtherSessions, () => {
      setNotice('Cerramos tus otras sesiones.');
      router.refresh();
    });
  const closeAll = () =>
    run(revokeAllSessions, () => {
      router.replace('/login');
      router.refresh();
    });

  return { isBusy, error, notice, closeOne, closeOthers, closeAll };
}
