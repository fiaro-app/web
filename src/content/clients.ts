/** Textos del módulo Clientes. */
export const CLIENTS_TEXT = {
  title: 'Clientes',
  newClient: '+ Nuevo cliente',
  tableCaption: 'Clientes del negocio',
  headers: ['Nombre', 'Cédula', 'Teléfono', 'Oficio'] as const,
  edit: 'Editar',
  search: { placeholder: 'Buscar por nombre o cédula...', submit: 'Buscar', clear: 'Limpiar búsqueda' },
  empty: {
    title: 'Aún no tienes clientes',
    description: 'Registra a tu primer cliente para poder darle un préstamo.',
  },
  noResults: (search: string) => ({
    title: 'Sin resultados',
    description: `No encontramos clientes que coincidan con «${search}». Revisa el nombre o la cédula.`,
  }),
  forbidden: {
    title: 'No tienes acceso a esta sección',
    description: 'Tu cuenta no tiene un negocio activo desde el que ver clientes.',
  },
  notFound: { title: 'No encontramos al cliente', description: 'Puede que ya no exista. Vuelve a la lista y elige otro.' },
  pagination: {
    summary: (page: number, pages: number, total: number) =>
      `Página ${String(page)} de ${String(pages)} · ${String(total)} clientes`,
  },
  form: {
    createTitle: 'Registrar cliente',
    editTitle: 'Editar cliente',
    createSubtitle: 'Guarda los datos de la persona a la que le vas a prestar.',
    editSubtitle: 'Cambia los datos que necesites; el resto se queda igual.',
    submitCreate: 'Registrar cliente',
    submitEdit: 'Guardar cambios',
    cancel: 'Cancelar',
    fullName: { label: 'Nombre completo', placeholder: 'Ej: Carlos Andrés Gómez' },
    nationalId: { label: 'Cédula', hint: 'Solo números, sin puntos.', placeholder: 'Ej: 1020304050' },
    phone: { label: 'Teléfono', hint: 'Celular o fijo.', placeholder: '300 123 4567' },
    occupation: { label: 'Oficio', placeholder: 'Ej: Vendedor ambulante' },
    address: { label: 'Dirección', hint: 'De residencia o de cobro.', placeholder: 'Ej: Calle 45 # 12-30, Bogotá' },
  },
} as const;
