'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/atoms/Textarea';
import { Alert } from '@/components/molecules/Alert';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { FormField } from '@/components/molecules/FormField';
import { SETTLEMENTS_TEXT } from '@/content/settlements';
import { useReviewSettlement } from '@/features/settlements/use-review-settlement';

/** Aprobar o rechazar un cuadre pendiente, con un comentario opcional. Solo diseño; la lógica vive en `useReviewSettlement`. */
export function SettlementReviewForm({ settlementId }: Readonly<{ settlementId: string }>) {
  const { note, changeNote, pending, error, notice, approve, reject } = useReviewSettlement(settlementId);
  const text = SETTLEMENTS_TEXT.reviewForm;
  const busy = pending !== null;
  const [confirming, setConfirming] = useState<'approve' | 'reject' | null>(null);
  const dialog = confirming ? text.confirm[confirming] : null;

  const confirm = () => {
    const decision = confirming === 'approve' ? approve : reject;
    setConfirming(null);
    void decision();
  };

  return (
    <div className="flex flex-col gap-4">
      {error && <Alert tone="error">{error}</Alert>}
      {notice && <Alert tone="success">{notice}</Alert>}
      <FormField label={text.noteLabel}>
        <Textarea name="reviewNote" placeholder={text.notePlaceholder} value={note} onChange={changeNote} maxLength={500} disabled={busy} />
      </FormField>
      <div className="flex gap-3 max-md:sticky max-md:bottom-0 max-md:-mx-5 max-md:border-t max-md:border-foreground/8 max-md:bg-surface max-md:p-5">
        <Button variant="outline" loading={pending === 'reject'} disabled={busy} onClick={() => setConfirming('reject')} className="flex-1">
          {text.reject}
        </Button>
        <Button loading={pending === 'approve'} disabled={busy} onClick={() => setConfirming('approve')} className="flex-1">
          {text.approve}
        </Button>
      </div>
      <ConfirmDialog
        open={dialog !== null}
        title={dialog?.confirmTitle ?? ''}
        description={dialog?.confirmDescription ?? ''}
        confirmLabel={dialog?.confirmLabel}
        onCancel={() => setConfirming(null)}
        onConfirm={confirm}
      />
    </div>
  );
}
