/** Textos de «Importar» (D-152 de la API, W-107). */
export const IMPORTS_TEXT = {
  title: 'Importar desde Excel',
  forbidden: {
    title: 'No tienes acceso a esta sección',
    description: 'Importar clientes y préstamos es de quien administra el negocio.',
  },
  upgrade: {
    title: 'Importar desde Excel está en el plan Pro',
    description: 'Con Pro y Team subes de una vez a tus clientes y sus préstamos en curso desde una hoja de Excel o CSV, en lugar de escribirlos uno por uno.',
    action: 'Ver planes',
  },
  intro: {
    description:
      'Sube a tus clientes y los préstamos que ya tienen en curso: lo que les falta por pagar, no el historial. Primero revisamos la hoja y te mostramos qué se importaría; solo se crea cuando confirmas.',
    steps: [
      'Descarga la plantilla y llénala (un cliente por fila; si tiene préstamo, llena las columnas de cuotas, valor, frecuencia y próxima cuota).',
      'Sube el archivo (.xlsx o .csv, hasta 2.000 filas).',
      'Revisa el resultado y confirma.',
    ],
    template: 'Descargar plantilla',
    templateFile: 'plantilla-importar-fiaro.csv',
    pick: 'Elegir archivo',
    pickLabel: 'Archivo de Excel o CSV',
  },
  working: { reading: 'Leyendo la hoja…', reviewing: 'Revisando las filas…', importing: 'Importando…' },
  sheetErrors: {
    format: 'Ese archivo no es un .xlsx ni un .csv.',
    unreadable: 'No pudimos leer el archivo. Revisa que no esté dañado o protegido con contraseña.',
    empty: 'La hoja no tiene filas con datos debajo de los encabezados.',
    tooMany: 'La hoja tiene más de 2.000 filas. Divídela en varios archivos.',
    missing: (columns: readonly string[]) => `Faltan estas columnas en la primera fila: ${columns.join(', ')}.`,
    network: 'No pudimos hablar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
    forbidden: 'Tu plan o tu rol no permite importar.',
  },
  review: {
    title: 'Esto se importaría',
    summary: (clients: number, loans: number) => `${clients} clientes nuevos y ${loans} préstamos`,
    ready: (count: number) => `${count} filas listas`,
    invalid: (count: number) => `${count} filas con errores (no se importan)`,
    confirm: (count: number) => `Importar ${count} filas`,
    cancel: 'Elegir otro archivo',
    nothing: 'Ninguna fila está lista para importar. Corrige la hoja y súbela de nuevo.',
  },
  done: {
    title: 'Importación terminada',
    summary: (imported: number, failed: number) => (failed > 0 ? `Se importaron ${imported} filas y ${failed} fallaron.` : `Se importaron ${imported} filas.`),
    again: 'Importar otra hoja',
    goToClients: 'Ver clientes',
  },
  problems: {
    title: 'Filas con problemas',
    columns: { row: 'Fila', problem: 'Qué pasa' },
  },
} as const;
