import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { Text } from '@/components/atoms/Text';
import { NOTIFICATIONS_TEXT } from '@/content/notifications';
import type { NotificationItem } from '@/features/notifications/notifications-view-model';
import { cn } from '@/lib/cn';
import { TONE_FILL_CLASSES } from '@/lib/tone';

export interface NotificationCardProps {
  readonly notification: NotificationItem;
  /** Se llama al pulsar "Marcar como leída"; solo se ofrece mientras no esté leída. */
  readonly onMarkRead: (id: string) => void;
  /** Se llama al pulsar «Borrar»; se ofrece siempre, leída o no. */
  readonly onDelete: (id: string) => void;
  /** Deshabilita las acciones mientras se marca o se borra esta (u otra) notificación. */
  readonly busy?: boolean;
}

/**
 * Una notificación: franja del color de su importancia, título, texto, fecha y acciones. Las
 * no leídas llevan el título en negrita y una etiqueta "Sin leer" (el estado no depende del color).
 */
export function NotificationCard({ notification, onMarkRead, onDelete, busy = false }: Readonly<NotificationCardProps>) {
  const { id, tone, title, body, date, read, href } = notification;

  return (
    <article className="flex overflow-hidden rounded-md bg-surface">
      <span aria-hidden="true" className={cn('w-1.5 shrink-0', TONE_FILL_CLASSES[tone])} />
      <div className="flex flex-1 flex-col gap-2 px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <Text as="h2" variant="body" weight={read ? 'regular' : 'bold'}>
            {title}
          </Text>
          {!read && (
            <span className="rounded-full bg-primary/12 px-2 py-0.5 text-caption font-medium text-primary">
              {NOTIFICATIONS_TEXT.unreadBadge}
            </span>
          )}
          <time className="ml-auto text-caption text-foreground/65">{date}</time>
        </div>
        <Text variant="label" className="text-foreground/75">
          {body}
        </Text>
        <div className="flex items-center gap-4">
          {href !== null && <Link href={href}>{NOTIFICATIONS_TEXT.view}</Link>}
          {!read && (
            <Button variant="text" size="sm" disabled={busy} onClick={() => onMarkRead(id)}>
              {NOTIFICATIONS_TEXT.markRead}
            </Button>
          )}
          <Button variant="text" size="sm" disabled={busy} onClick={() => onDelete(id)} aria-label={NOTIFICATIONS_TEXT.removeFor(title)} className="ml-auto">
            {NOTIFICATIONS_TEXT.remove}
          </Button>
        </div>
      </div>
    </article>
  );
}
