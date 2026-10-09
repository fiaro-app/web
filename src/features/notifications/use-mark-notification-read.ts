'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { describeAuthError } from '@/features/auth/error-messages';
import { markNotificationRead } from '@/features/notifications/notifications-api';
import { isApiRequestError } from '@/lib/api';

/** Mensaje de un error al marcar como leída; `NOT_FOUND` significa que ya no existe. */
function describeMarkReadError(error: unknown): string {
  if (isApiRequestError(error) && error.hasCode('NOT_FOUND')) {
    return 'Esa notificación ya no existe. Actualiza la página.';
  }
  return describeAuthError(error).message;
}

/**
 * Lógica de marcar notificaciones como leídas, sin diseño. Solo una a la vez (`pendingId`); si sale
 * bien refresca la página para traer la lista nueva, y si falla deja el mensaje en `error`.
 */
export function useMarkNotificationRead() {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const markRead = async (id: string) => {
    if (pendingId) return;
    setPendingId(id);
    setError(null);
    try {
      await markNotificationRead(id);
      router.refresh();
    } catch (failure) {
      setError(describeMarkReadError(failure));
    } finally {
      setPendingId(null);
    }
  };

  return { pendingId, error, markRead };
}
