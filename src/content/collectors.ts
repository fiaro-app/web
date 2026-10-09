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
      label: 'Correo electrónico (opcional)',
      hint: 'Sirve para recuperar su contraseña.',
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
    },
  },
} as const;
