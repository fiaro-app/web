'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Alert } from '@/components/molecules/Alert';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { NotificationCard } from '@/components/molecules/NotificationCard';
import { NOTIFICATIONS_TEXT } from '@/content/notifications';
import type { NotificationItem } from '@/features/notifications/notifications-view-model';
import { useDeleteNotifications } from '@/features/notifications/use-delete-notifications';
import { useMarkNotificationRead } from '@/features/notifications/use-mark-notification-read';

/** Lista de notificaciones con marcarlas como leídas y borrarlas (una, las leídas o todas). Solo diseño; la lógica vive en `useMarkNotificationRead` y `useDeleteNotifications`. */
export function NotificationList({ items }: Readonly<{ items: readonly NotificationItem[] }>) {
  const mark = useMarkNotificationRead();
  const del = useDeleteNotifications();
  const [confirming, setConfirming] = useState<'clearRead' | 'clearAll' | null>(null);
  const hasUnread = items.some((item) => !item.read);
  const hasRead = items.some((item) => item.read);
  const busy = mark.pendingId !== null || mark.isMarkingAll || del.pendingId !== null || del.isClearing;
  const dialog = confirming ? NOTIFICATIONS_TEXT.confirm[confirming] : null;
  const confirm = () => {
    const current = confirming;
    setConfirming(null);
    if (current) void del.clear(current === 'clearRead');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {hasUnread && (
          <Button variant="outline" loading={mark.isMarkingAll} disabled={busy} onClick={() => void mark.markAllRead()}>
            {NOTIFICATIONS_TEXT.markAll}
          </Button>
        )}
        {hasRead && (
          <Button variant="outline" disabled={busy} onClick={() => setConfirming('clearRead')}>
            {NOTIFICATIONS_TEXT.clearRead}
          </Button>
        )}
        <Button variant="outline" loading={del.isClearing} disabled={busy} onClick={() => setConfirming('clearAll')}>
          {NOTIFICATIONS_TEXT.clearAll}
        </Button>
      </div>
      {(mark.error ?? del.error) && <Alert tone="error">{mark.error ?? del.error}</Alert>}
      <ul aria-label={NOTIFICATIONS_TEXT.listLabel} className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <NotificationCard notification={item} onMarkRead={(id) => void mark.markRead(id)} onDelete={(id) => void del.remove(id)} busy={busy} />
          </li>
        ))}
      </ul>
      <p className="text-caption text-foreground/65">{NOTIFICATIONS_TEXT.retention}</p>
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
