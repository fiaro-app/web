/** Textos del módulo Notificaciones. */
export const NOTIFICATIONS_TEXT = {
  title: 'Notificaciones',
  filters: { label: 'Filtrar notificaciones', all: 'Todas', unread: 'No leídas' },
  listLabel: 'Lista de notificaciones',
  unreadBadge: 'Sin leer',
  markRead: 'Marcar como leída',
  markAll: 'Marcar todas como leídas',
  view: 'Ver',
  remove: 'Borrar',
  removeFor: (title: string) => `Borrar la notificación: ${title}`,
  clearRead: 'Borrar las leídas',
  clearAll: 'Borrar todas',
  confirm: {
    clearRead: {
      confirmTitle: '¿Borrar las notificaciones leídas?',
      confirmDescription: 'Las que siguen sin leer se conservan. No se puede deshacer.',
      confirmLabel: 'Sí, borrar las leídas',
    },
    clearAll: {
      confirmTitle: '¿Borrar todas las notificaciones?',
      confirmDescription: 'Se borran también las que no has leído. No se puede deshacer.',
      confirmLabel: 'Sí, borrar todas',
    },
  },
  retention: 'Las notificaciones de más de 90 días se borran solas.',
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
