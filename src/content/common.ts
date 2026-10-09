/** Textos que comparten varias pantallas. */
export const COMMON_TEXT = {
  signOut: { title: '¿Cerrar sesión?', description: 'Tendrás que volver a iniciar sesión para entrar al panel.', confirmLabel: 'Cerrar sesión' },
  /** Confirmaciones al guardar: lo que se le pregunta a la persona antes de aplicar el cambio. */
  confirm: {
    save: { title: '¿Guardar los cambios?', description: 'Se aplican de inmediato.', confirmLabel: 'Guardar' },
    create: { title: '¿Registrar estos datos?', description: 'Revisa que estén bien antes de continuar.', confirmLabel: 'Registrar' },
    loan: {
      title: '¿Registrar el préstamo?',
      description: 'Revisa el monto, las cuotas y la frecuencia antes de continuar.',
      confirmLabel: 'Sí, registrar',
    },
    password: {
      title: '¿Cambiar tu contraseña?',
      description: 'Desde ahora iniciarás sesión con la contraseña nueva.',
      confirmLabel: 'Cambiar contraseña',
    },
  },
  password: { show: 'Mostrar contraseña', hide: 'Ocultar contraseña' },
} as const;
