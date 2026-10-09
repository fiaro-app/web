/** Textos del módulo Cobradores (`Screen / Web / Cobradores`). */
export const COLLECTORS_TEXT = {
  title: 'Cobradores',
  newCollector: '+ Nuevo cobrador',
  tableCaption: 'Cobradores del negocio',
  headers: ['Nombre', 'Teléfono', 'Cartera', 'Estado'] as const,
  active: 'Activo',
  inactive: 'Inactivo',
  empty: {
    title: 'Aún no tienes cobradores',
    description: 'Registra a tu primer cobrador para asignarle una cartera y empezar a repartir cobros.',
  },
  forbidden: {
    title: 'No tienes acceso a esta sección',
    description: 'Solo quienes administran el negocio pueden ver y registrar cobradores.',
  },
  pagination: {
    previous: 'Anterior',
    next: 'Siguiente',
    summary: (page: number, pages: number, total: number) => `Página ${String(page)} de ${String(pages)} · ${String(total)} cobradores`,
  },
} as const;
