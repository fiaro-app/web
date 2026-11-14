/** Textos del módulo Administradores. */
export const ADMINS_TEXT = {
  title: 'Administradores',
  subtitle: 'Quienes pueden administrar tu negocio: préstamos, cobradores, cuadres y configuración.',
  tableCaption: 'Administradores del negocio',
  headers: ['Nombre', 'Celular', 'Rol'] as const,
  roles: { owner: 'Dueño', admin: 'Administrador', adminCollector: 'Administrador y cobrador' },
  you: 'Tú',
  promote: {
    title: 'Subir de rango a un colaborador',
    description: 'Un cobrador que ya trabaja contigo pasa a ser también administrador. Sigue cobrando si ya cobraba.',
    label: 'Colaborador',
    placeholder: 'Elige un colaborador',
    action: 'Hacer administrador',
    none: 'Todos tus colaboradores activos ya son administradores.',
    done: (name: string) => `${name} ahora es administrador.`,
  },
  invite: { action: 'Invitar a un administrador nuevo' },
  row: {
    demote: 'Quitar rol de administrador',
    remove: 'Quitar acceso',
    demoteDone: (name: string) => `${name} ya no es administrador.`,
    removeDone: (name: string) => `${name} ya no tiene acceso al negocio.`,
    confirm: {
      demote: {
        confirmTitle: '¿Quitar el rol de administrador?',
        confirmDescription: 'Sigue como cobrador, pero ya no podrá administrar el negocio.',
        confirmLabel: 'Sí, quitar el rol',
      },
      remove: {
        confirmTitle: '¿Quitar el acceso?',
        confirmDescription: 'Pierde el acceso de inmediato. Su historial se conserva.',
        confirmLabel: 'Sí, quitar el acceso',
      },
    },
  },
  forbidden: {
    title: 'No tienes acceso a esta sección',
    description: 'Solo quien administra el negocio puede ver y cambiar a los administradores.',
  },
  form: {
    aside: {
      title: '¿Qué pasa después?',
      steps: [
        'Creamos su acceso a Fiaro con su celular.',
        'Te mostramos una contraseña temporal, una sola vez.',
        'Al ingresar, la cambia y ya administra el negocio contigo.',
      ],
      tip: {
        title: 'Un consejo',
        body: 'Un administrador puede ver y cambiar casi todo, pero no puede quitarle el acceso al dueño.',
      },
    },
    title: 'Invitar a un administrador',
    subtitle: 'Crea su acceso a Fiaro. Le entregarás una contraseña temporal que deberá cambiar al ingresar.',
    submit: 'Invitar administrador',
    cancel: 'Cancelar',
    fullName: { label: 'Nombre completo', placeholder: 'Ej: Lucía Pardo' },
    nationalId: { label: 'Cédula', hint: 'Solo números, sin puntos.', placeholder: 'Ej: 1030405060' },
    phone: { label: 'Celular', hint: 'Con este celular iniciará sesión.', placeholder: '300 123 4567' },
    contactEmail: { label: 'Correo electrónico', hint: 'Ahí le llegan su contraseña temporal y los avisos de la app.', placeholder: 'admin@correo.com' },
  },
  invited: {
    title: 'Administrador invitado',
    withPassword: (name: string) => `${name} ya puede ingresar a Fiaro. Entrégale esta contraseña temporal: solo se muestra una vez.`,
    existingAccount: (name: string) => `${name} ya tenía una cuenta en Fiaro y ahora administra tu negocio. Ingresa con su contraseña de siempre.`,
    passwordLabel: 'Contraseña temporal',
    done: 'Volver a administradores',
  },
} as const;
