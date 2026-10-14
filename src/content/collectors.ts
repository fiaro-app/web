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
  emptyFiltered: {
    title: 'Sin cobradores con este estado',
    description: 'Prueba con otro estado para ver a los demás cobradores.',
  },
  statusFilter: {
    label: 'Filtrar cobradores por estado',
    activos: 'Activos',
    inactivos: 'Inactivos',
    todos: 'Todos',
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
  form: {
    aside: {
      title: '¿Qué pasa después?',
      steps: [
        'Creamos su acceso a Fiaro con su celular.',
        'Te mostramos una contraseña temporal, una sola vez.',
        'Al ingresar, la cambia y ya ve su ruta de cobro.',
      ],
      tip: {
        title: 'Un consejo',
        body: 'Entrégale la contraseña en persona; si la pierde, puedes generar otra desde su ficha.',
      },
    },
    title: 'Registrar cobrador',
    subtitle: 'Crea su acceso a Fiaro. Le entregarás una contraseña temporal que deberá cambiar al ingresar.',
    submit: 'Registrar cobrador',
    cancel: 'Cancelar',
    fullName: { label: 'Nombre completo', placeholder: 'Ej: Luis Gómez' },
    nationalId: {
      label: 'Cédula',
      hint: 'Solo números, sin puntos.',
      placeholder: 'Ej: 1030405060',
    },
    phone: {
      label: 'Celular',
      hint: 'Con este celular iniciará sesión.',
      placeholder: '300 123 4567',
    },
    contactEmail: {
      label: 'Correo electrónico',
      hint: 'Ahí le llegan su contraseña temporal y los avisos de la app.',
      placeholder: 'cobrador@correo.com',
    },
    portfolio: { label: 'Cartera asignada', placeholder: 'Elige una cartera' },
  },
  invited: {
    title: 'Cobrador registrado',
    withPassword: (name: string) => `${name} ya puede ingresar a Fiaro. Entrégale esta contraseña temporal: solo se muestra una vez.`,
    existingAccount: (name: string) =>
      `${name} ya tenía una cuenta en Fiaro y ahora trabaja con tu negocio. Ingresa con su contraseña de siempre.`,
    passwordLabel: 'Contraseña temporal',
    done: 'Volver a cobradores',
  },
  performance: {
    title: 'Desempeño del mes',
    period: (range: string) => `Del ${range}`,
    effectiveness: 'Efectividad',
    collected: 'Cobrado',
    expected: 'Esperado',
    visits: 'Visitas',
    overdue: 'Mora de su cartera',
  },
  manage: {
    title: 'Gestionar cobrador',
    back: '← Volver a cobradores',
    manage: 'Gestionar',
    notFound: {
      title: 'No encontramos al cobrador',
      description: 'Puede que ya no exista. Vuelve a la lista y elige otro.',
    },
    portfolio: { save: 'Guardar cartera' },
    resetPassword: {
      action: 'Restablecer contraseña',
      confirmTitle: '¿Restablecer la contraseña?',
      confirmDescription: 'Se genera una contraseña temporal nueva y la anterior deja de servir.',
      confirmLabel: 'Restablecer',
      result: 'Contraseña temporal nueva',
    },
    deactivate: {
      action: 'Desactivar cobrador',
      confirmTitle: '¿Desactivar al cobrador?',
      confirmDescription: 'Pierde el acceso de inmediato. Su historial de cobros se conserva.',
      confirmLabel: 'Desactivar',
      inactiveNotice: 'Este cobrador está desactivado y no puede ingresar.',
      handoverIntro: (count: number) =>
        count === 1
          ? 'Tiene 1 préstamo activo. Pásalo a otro cobrador: ningún préstamo puede quedar sin cobrador.'
          : `Tiene ${String(count)} préstamos activos. Pásalos a otro cobrador: ningún préstamo puede quedar sin cobrador.`,
      destinationLabel: 'Pasar sus préstamos a',
      destinationPlaceholder: 'Elige un cobrador',
      noDestinations: 'No hay otro cobrador activo que pueda recibir sus préstamos. Registra o activa uno antes de darlo de baja.',
      handoverUnavailable: 'No pudimos revisar los préstamos de este cobrador. Recarga la página para intentarlo de nuevo.',
    },
    reactivate: {
      action: 'Reactivar cobrador',
      confirmTitle: '¿Reactivar al cobrador?',
      confirmDescription: 'Vuelve a ingresar con su misma cartera y ocupa un cupo de tu plan. Sus préstamos se le asignan aparte.',
      confirmLabel: 'Reactivar',
      done: 'Cobrador reactivado.',
    },
    remove: {
      action: 'Borrar cobrador',
      confirmTitle: '¿Borrar al cobrador?',
      confirmDescription: 'Solo se puede si nunca tuvo préstamos asignados, cobros ni cuadres (un registro por error). No se puede deshacer.',
      confirmLabel: 'Borrar',
    },
  },
} as const;
