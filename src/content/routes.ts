/** Textos del registro de rutas. */
export const ROUTES_TEXT = {
  title: 'Registro de rutas',
  subtitle: 'Lo que hizo cada cobrador cada día: cuándo empezó y terminó su ruta, cuántas visitas hizo y cuánto cobró.',
  tableCaption: 'Rutas de los cobradores, un renglón por cobrador y día',
  headers: ['Día', 'Cobrador', 'Empezó', 'Terminó', 'Visitas', 'Pagaron', 'Cobrado'] as const,
  hint: 'La ruta empieza con la primera visita del día y termina con la última. Abre «Ver visitas» para ver el detalle de cada una.',
  viewVisits: 'Ver visitas',
  viewVisitsFor: (collector: string, date: string) => `Ver las visitas de ${collector} del ${date}`,
  collectedOf: (collected: string, expected: string) => `${collected} de ${expected}`,
  rangeToday: (date: string) => `Hoy · ${date}`,
  rangeDay: (date: string) => `El ${date}`,
  range: (from: string, to: string) => `Del ${from} al ${to}`,
  filters: {
    label: 'Filtrar rutas',
    from: 'Desde',
    to: 'Hasta',
    collector: 'Cobrador',
    allCollectors: 'Todos los cobradores',
    apply: 'Aplicar',
    clear: 'Limpiar filtros',
    periodHint: 'Sin fechas se muestra solo hoy. Con una sola fecha, ese día. Hasta 93 días, sin fechas futuras.',
  },
  empty: {
    title: 'Todavía no hay rutas hoy',
    description: 'Cuando un cobrador registre su primera visita del día, su ruta aparecerá aquí. Elige otras fechas para ver días anteriores.',
  },
  emptyFiltered: {
    title: 'Sin rutas con estos filtros',
    description: 'Prueba con otras fechas u otro cobrador, o quita los filtros.',
  },
  forbidden: {
    title: 'No tienes acceso a esta sección',
    description: 'Solo quien administra el negocio puede ver el registro de rutas.',
  },
  pagination: {
    summary: (page: number, pages: number, total: number) => `Página ${String(page)} de ${String(pages)} · ${String(total)} rutas`,
  },
} as const;
