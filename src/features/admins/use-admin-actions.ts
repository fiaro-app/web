'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent } from 'react';
import { ADMINS_TEXT } from '@/content/admins';
import { demoteAdmin, promoteToAdmin, removeAdminAccess } from '@/features/admins/admins-api';
import type { AdminRow, PromotableOption } from '@/features/admins/admins-view-model';
import { describeAdminError } from '@/features/admins/error-messages';

/**
 * Lógica de administrar a los administradores (subir de rango, quitar el rol o quitar el acceso), sin diseño. Cada acción
 * reporta su error en `error` y, si sale bien, refresca la página para traer el estado nuevo.
 */
export function useAdminActions(promotable: readonly PromotableOption[]) {
  const router = useRouter();
  const [selected, setSelected] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const run = async (operation: () => Promise<unknown>, success: string) => {
    if (pending) return;
    setPending(true);
    setError(null);
    setNotice(null);
    try {
      await operation();
      setNotice(success);
      router.refresh();
    } catch (failure) {
      setError(describeAdminError(failure).message);
    } finally {
      setPending(false);
    }
  };

  const select = (event: ChangeEvent<HTMLSelectElement>) => setSelected(event.target.value);

  const promote = async () => {
    const option = promotable.find((candidate) => candidate.id === selected);
    if (!option) {
      setError(ADMINS_TEXT.promote.placeholder);
      return;
    }
    await run(() => promoteToAdmin(option.id, option.roles), ADMINS_TEXT.promote.done(option.label.split(' · ')[0] ?? ''));
    setSelected('');
  };

  const demote = (row: AdminRow) => run(() => demoteAdmin(row.id, row.roles), ADMINS_TEXT.row.demoteDone(row.fullName));
  const remove = (row: AdminRow) => run(() => removeAdminAccess(row.id), ADMINS_TEXT.row.removeDone(row.fullName));

  return { selected, select, pending, error, notice, promote, demote, remove };
}
