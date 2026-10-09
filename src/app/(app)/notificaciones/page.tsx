import type { Metadata } from 'next';
import { NotificationsView } from '@/components/organisms/NotificationsView';
import { getNotifications } from '@/features/notifications/get-notifications.server';
import { parseUnreadFilter } from '@/features/notifications/unread-filter';
import { parsePageParam } from '@/lib/pagination';

export const metadata: Metadata = { title: 'Notificaciones' };

/** Notificaciones: trae la página y el filtro pedidos en el servidor y los pinta. */
export default async function NotificationsPage({ searchParams }: PageProps<'/notificaciones'>) {
  const { pagina, filtro } = await searchParams;
  return <NotificationsView notifications={await getNotifications(parsePageParam(pagina), parseUnreadFilter(filtro))} />;
}
