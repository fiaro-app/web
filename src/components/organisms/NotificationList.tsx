'use client';

import { Alert } from '@/components/molecules/Alert';
import { NotificationCard } from '@/components/molecules/NotificationCard';
import { NOTIFICATIONS_TEXT } from '@/content/notifications';
import type { NotificationItem } from '@/features/notifications/notifications-view-model';
import { useMarkNotificationRead } from '@/features/notifications/use-mark-notification-read';

/** Lista de notificaciones con la acción de marcarlas como leídas. Solo diseño; la lógica vive en `useMarkNotificationRead`. */
export function NotificationList({ items }: Readonly<{ items: readonly NotificationItem[] }>) {
  const { pendingId, error, markRead } = useMarkNotificationRead();

  return (
    <div className="flex flex-col gap-3">
      {error && <Alert tone="error">{error}</Alert>}
      <ul aria-label={NOTIFICATIONS_TEXT.listLabel} className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <NotificationCard notification={item} onMarkRead={(id) => void markRead(id)} busy={pendingId !== null} />
          </li>
        ))}
      </ul>
    </div>
  );
}
