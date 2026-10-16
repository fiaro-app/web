'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { describeAuthError } from '@/features/auth/error-messages';
import { clearNotifications, deleteNotification } from '@/features/notifications/notifications-api';
import { isApiRequestError } from '@/lib/api';

/** Mensaje de un error al borrar; `NOT_FOUND` significa que ya no existe (otra pantalla la borró). */
function describeDeleteError(error: unknown): string {
  if (isApiRequestError(error) && error.hasCode('NOT_FOUND')) {
    return 'Esa notificación ya no existe. Actualiza la página.';
  }
  return describeAuthError(error).message;
}

/**
 * Lógica de borrar notificaciones, sin diseño: una (`remove`) o varias de una vez (`clear`: solo las leídas, o todas). Una sola
 * acción a la vez; si sale bien refresca la página para traer la lista nueva y si falla deja el mensaje en `error`.
 */
export function useDeleteNotifications() {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (operation: () => Promise<unknown>, start: () => void, finish: () => void) => {
    start();
    setError(null);
    try {
      await operation();
      router.refresh();
    } catch (failure) {
      setError(describeDeleteError(failure));
    } finally {
      finish();
    }
  };

  const remove = async (id: string) => {
    if (pendingId || isClearing) return;
    await run(
      () => deleteNotification(id),
      () => setPendingId(id),
      () => setPendingId(null),
    );
  };

  const clear = async (onlyRead: boolean) => {
    if (pendingId || isClearing) return;
    await run(
      () => clearNotifications(onlyRead),
      () => setIsClearing(true),
      () => setIsClearing(false),
    );
  };

  return { pendingId, isClearing, error, remove, clear };
}
