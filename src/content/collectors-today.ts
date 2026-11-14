/** Textos de «Rutas de hoy» del resumen. */
export const COLLECTORS_TODAY_TEXT = {
  title: 'Rutas de hoy',
  tableCaption: 'Cómo va la ruta de hoy de cada cobrador',
  headers: ['Cobrador', 'Estado', 'Visitados', 'Faltan', 'Cobrado', 'Inició', 'Cuadre'] as const,
  empty: 'No hay cobradores activos con ruta hoy.',
  notStarted: (count: number) =>
    count === 1 ? '1 cobrador aún no ha iniciado su ruta.' : `${String(count)} cobradores aún no han iniciado su ruta.`,
} as const;
