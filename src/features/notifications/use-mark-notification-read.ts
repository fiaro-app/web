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
 *
 * `markAllRead` marca las de la página una por una (la API no tiene «todas»): sigue con las demás
 * si una falla y avisa al final cuántas no se pudieron marcar.
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

  const markAllRead = async (ids: readonly string[]) => {
    if (pendingId || isMarkingAll || ids.length === 0) return;
    setIsMarkingAll(true);
    setError(null);
    let failed = 0;
    for (const id of ids) {
      try {
        await markNotificationRead(id);
      } catch {
        failed += 1;
      }
    }
    if (failed > 0) {
      setError(
        failed === ids.length
          ? 'No pudimos marcar las notificaciones. Inténtalo de nuevo.'
          : `No pudimos marcar ${String(failed)} de ${String(ids.length)} notificaciones. Inténtalo de nuevo.`,
      );
    }
    setIsMarkingAll(false);
    router.refresh();
  };

  return { pendingId, error, isMarkingAll, markRead, markAllRead };
}
