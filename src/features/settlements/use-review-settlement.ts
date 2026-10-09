'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent } from 'react';
import { SETTLEMENTS_TEXT } from '@/content/settlements';
import { describeSettlementError } from '@/features/settlements/error-messages';
import { approveSettlement, rejectSettlement } from '@/features/settlements/settlements-api';

type ReviewDecision = 'approve' | 'reject';

/**
 * Lógica de revisar un cuadre (aprobar o rechazar con un comentario opcional), sin diseño. Si
 * sale bien refresca la página para traer el estado nuevo; si la API lo rechaza (p. ej. otro
 * administrador ya lo revisó) deja el mensaje en `error`.
 */
export function useReviewSettlement(settlementId: string) {
  const router = useRouter();
  const [note, setNote] = useState('');
  const [pending, setPending] = useState<ReviewDecision | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const changeNote = (event: ChangeEvent<HTMLTextAreaElement>) => setNote(event.target.value);

  const review = async (decision: ReviewDecision) => {
    if (pending) return;
    setPending(decision);
    setError(null);
    setNotice(null);
    try {
      await (decision === 'approve' ? approveSettlement : rejectSettlement)(settlementId, note);
      setNotice(decision === 'approve' ? SETTLEMENTS_TEXT.reviewForm.approved : SETTLEMENTS_TEXT.reviewForm.rejected);
      router.refresh();
    } catch (failure) {
      setError(describeSettlementError(failure).message);
    } finally {
      setPending(null);
    }
  };

  return {
    note,
    changeNote,
    pending,
    error,
    notice,
    approve: () => review('approve'),
    reject: () => review('reject'),
  };
}
