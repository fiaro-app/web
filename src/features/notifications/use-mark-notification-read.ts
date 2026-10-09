'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { describeAuthError } from '@/features/auth/error-messages';
import { markAllNotificationsRead, markNotificationRead } from '@/features/notifications/notifications-api';
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
 *
 * `markAllRead` marca todas las de la persona con una sola llamada (`POST /notifications/read-all`).
 */
export function useMarkNotificationRead() {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const markRead = async (id: string) => {
    if (pendingId || isMarkingAll) return;
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

  const markAllRead = async () => {
    if (pendingId || isMarkingAll) return;
    setIsMarkingAll(true);
    setError(null);
    try {
      await markAllNotificationsRead();
      router.refresh();
    } catch (failure) {
      setError(describeAuthError(failure).message);
    } finally {
      setIsMarkingAll(false);
    }
  };

  return { pendingId, error, isMarkingAll, markRead, markAllRead };
}
