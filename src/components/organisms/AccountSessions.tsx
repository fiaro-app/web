'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { StatePill } from '@/components/atoms/StatePill';
import { Alert } from '@/components/molecules/Alert';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { ACCOUNT_TEXT } from '@/content/account';
import { useSessionActions } from '@/features/account/use-session-actions';
import type { SessionRow } from '@/features/account/sessions-view-model';

export interface AccountSessionsProps {
  /** Las sesiones abiertas; vacía si no se pudieron traer (quedan los botones de cerrar). */
  readonly sessions?: readonly SessionRow[];
}

/** Sesiones abiertas de la persona, con la opción de cerrar una, las demás o todas. Lógica en `useSessionActions`. */
export function AccountSessions({ sessions = [] }: Readonly<AccountSessionsProps>) {
  const text = ACCOUNT_TEXT.sessions;
  const { isBusy, error, notice, closeOne, closeOthers, closeAll } = useSessionActions();
  // Cerrar sesiones es una decisión importante: se pide confirmar antes de hacerlo.
  const [confirming, setConfirming] = useState<{ readonly kind: 'one'; readonly sessionId: string } | { readonly kind: 'others' | 'all' } | null>(null);
  const dialog = confirming ? text.confirm[confirming.kind] : null;

  const confirm = () => {
    const pending = confirming;
    setConfirming(null);
    if (pending?.kind === 'one') void closeOne(pending.sessionId);
    else if (pending?.kind === 'others') void closeOthers();
    else if (pending?.kind === 'all') void closeAll();
  };

  return (
    <div className="flex flex-col gap-4">
      {sessions.length > 0 && (
        <ul aria-label={text.listLabel} className="flex flex-col divide-y divide-foreground/8 overflow-hidden rounded-md bg-surface">
          {sessions.map((session) => (
            <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-label">
              <div className="flex flex-col">
                <span className="flex items-center gap-2 font-medium">
                  {session.device}
                  {session.isCurrent && <StatePill tone="success">{text.current}</StatePill>}
                </span>
                <span className="text-small text-foreground/70">{session.detail}</span>
              </div>
              {!session.isCurrent && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isBusy}
                  aria-label={text.closeOne(session.device)}
                  onClick={() => setConfirming({ kind: 'one', sessionId: session.id })}
                >
                  {text.close}
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
      {error && <Alert tone="error">{error}</Alert>}
      {notice && <Alert tone="success">{notice}</Alert>}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" disabled={isBusy} onClick={() => setConfirming({ kind: 'others' })}>
          {text.closeOthers}
        </Button>
        <Button variant="text" disabled={isBusy} onClick={() => setConfirming({ kind: 'all' })}>
          {text.closeAll}
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
