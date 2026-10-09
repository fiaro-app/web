'use client';

import { Alert } from '@/components/molecules/Alert';
import { Button } from '@/components/atoms/Button';
import { ACCOUNT_TEXT } from '@/content/account';
import { useSessionActions } from '@/features/account/use-session-actions';

/** Cerrar las demás sesiones o todas. Lógica en `useSessionActions`. */
export function AccountSessions() {
  const text = ACCOUNT_TEXT.sessions;
  const { isBusy, error, notice, closeOthers, closeAll } = useSessionActions();

  return (
    <div className="flex flex-col gap-3">
      {error && <Alert tone="error">{error}</Alert>}
      {notice && <Alert tone="success">{notice}</Alert>}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" disabled={isBusy} onClick={() => void closeOthers()}>
          {text.closeOthers}
        </Button>
        <Button variant="text" disabled={isBusy} onClick={() => void closeAll()}>
          {text.closeAll}
        </Button>
      </div>
    </div>
  );
}
