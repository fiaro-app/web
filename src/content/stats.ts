/** Textos del módulo Estadísticas. */
export const STATS_TEXT = {
  title: 'Estadísticas',
  forbidden: {
    title: 'No tienes acceso a esta sección',
    description: 'Solo quienes administran el negocio pueden ver las estadísticas.',
  },
  filters: {
    label: 'Filtros de estadísticas',
    from: 'Desde',
    to: 'Hasta',
    collector: 'Cobrador',
    allCollectors: 'Todos los cobradores',
    portfolio: 'Cartera',
    allPortfolios: 'Todas las carteras',
    apply: 'Aplicar',
    clear: 'Limpiar filtros',
    periodHint: 'Sin fechas se muestra el mes actual.',
  },
  period: (period: string) => `Período: ${period}`,
  export: { action: 'Exportar reporte (PDF)', busy: 'Generando…' },
  sections: {
    arrears: 'Mora por antigüedad',
    topArrears: 'Clientes con mayor mora',
    collectors: 'Desempeño por cobrador',
  },
  empty: {
    title: 'Todavía no hay datos',
    description: 'Cuando tengas préstamos y cobradores, aquí verás la cartera en riesgo y la mora.',
  },
  noTopArrears: 'Ningún cliente en mora en este período.',
  noCollectors: 'No hay cobradores para los filtros elegidos.',
  collectorLine: (portfolio: string, effectiveness: string) => `${portfolio} · ${effectiveness} efectividad`,
  collectorOverdue: (amount: string) => `${amount} en mora`,
} as const;
