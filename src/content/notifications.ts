/** Textos del módulo Notificaciones. */
export const NOTIFICATIONS_TEXT = {
  title: 'Notificaciones',
  filters: { label: 'Filtrar notificaciones', all: 'Todas', unread: 'No leídas' },
  listLabel: 'Lista de notificaciones',
  unreadBadge: 'Sin leer',
  markRead: 'Marcar como leída',
  markAll: 'Marcar todas como leídas',
  view: 'Ver',
  empty: {
    title: 'No tienes notificaciones',
    description: 'Aquí te avisaremos de cuadres por revisar, moras y otros movimientos de tu negocio.',
  },
  emptyUnread: {
    title: 'Estás al día',
    description: 'No tienes notificaciones sin leer.',
  },
  pagination: {
    summary: (page: number, pages: number, total: number) =>
      `Página ${String(page)} de ${String(pages)} · ${String(total)} notificaciones`,
  },
} as const;
