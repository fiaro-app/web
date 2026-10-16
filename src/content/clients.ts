/** Textos del módulo Clientes. */
export const CLIENTS_TEXT = {
  title: 'Clientes',
  newClient: '+ Nuevo cliente',
  tableCaption: 'Clientes del negocio',
  headers: ['Nombre', 'Cédula', 'Teléfono', 'Préstamos activos', 'Saldo', 'Mora'] as const,
  onTime: 'Al día',
  overdueDays: (days: number) => (days === 1 ? '1 día' : `${String(days)} días`),
  edit: 'Editar',
  riskLabel: (level: string) => `Riesgo ${level}`,
  search: {
    placeholder: 'Buscar por nombre o cédula...',
    submit: 'Buscar',
    clear: 'Limpiar búsqueda',
  },
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
  loans: {
    title: 'Préstamos del cliente',
    listLabel: 'Préstamos del cliente',
    empty: 'Este cliente todavía no tiene préstamos.',
    newLoan: '+ Nuevo préstamo',
    view: 'Ver',
    line: (installments: string, balance: string) => `${installments} · saldo ${balance}`,
  },
  notFound: {
    title: 'No encontramos al cliente',
    description: 'Puede que ya no exista. Vuelve a la lista y elige otro.',
  },
  pagination: {
    summary: (page: number, pages: number, total: number) => `Página ${String(page)} de ${String(pages)} · ${String(total)} clientes`,
  },
  form: {
    editAside: {
      title: 'Qué puedes hacer desde aquí',
      steps: [
        'Corrige el celular o la dirección: tus cobradores los ven al instante.',
        'Sube una foto para reconocer al cliente en la calle.',
        'Revisa su riesgo y registra un préstamo nuevo desde sus préstamos.',
      ],
      tip: {
        title: 'Un consejo',
        body: 'La cédula no se cambia: identifica al cliente en todo su historial.',
      },
    },
    aside: {
      title: '¿Qué pasa después?',
      steps: [
        'Guardamos al cliente en tu cartera con sus datos de contacto.',
        'Podrás registrarle un préstamo desde su ficha.',
        'Sus cobros y su historial quedarán en un solo lugar.',
      ],
      tip: {
        title: 'Un consejo',
        body: 'Con el celular y la dirección completos, tu cobrador llega más rápido y sin llamadas de más.',
      },
    },
    createTitle: 'Registrar cliente',
    editTitle: 'Editar cliente',
    createSubtitle: 'Guarda los datos de la persona a la que le vas a prestar.',
    editSubtitle: 'Cambia los datos que necesites; el resto se queda igual.',
    submitCreate: 'Registrar cliente',
    submitEdit: 'Guardar cambios',
    cancel: 'Cancelar',
    fullName: {
      label: 'Nombre completo',
      placeholder: 'Ej: Carlos Andrés Gómez',
    },
    nationalId: {
      label: 'Cédula',
      hint: 'Solo números, sin puntos.',
      placeholder: 'Ej: 1020304050',
    },
    phone: {
      label: 'Teléfono',
      hint: 'Celular o fijo.',
      placeholder: '300 123 4567',
    },
    occupation: { label: 'Oficio', placeholder: 'Ej: Vendedor ambulante' },
    address: {
      label: 'Dirección',
      hint: 'De residencia o de cobro.',
      placeholder: 'Ej: Calle 45 # 12-30, Bogotá',
    },
  },
} as const;
