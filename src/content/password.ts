/** Textos de recuperar la contraseña y del cambio obligatorio de la temporal. */
export const RECOVERY_CONTENT = {
  nav: { prompt: '¿Ya la recordaste?', linkLabel: 'Inicia sesión', linkHref: '/login' },
  panel: {
    eyebrow: 'Recupera tu acceso',
    title: 'Vuelve a tu cartera en un minuto',
    description: 'Te enviamos un código al correo de contacto de tu cuenta para que elijas una contraseña nueva.',
  },
  request: {
    title: 'Recupera tu contraseña',
    subtitle: 'Escribe tu celular y te enviamos un código.',
    phone: { label: 'Celular', placeholder: '300 123 4567' },
    submit: 'Enviar código',
    note: 'Si tu cuenta tiene un correo de contacto, el código llegará ahí. Si no lo tiene, pídele a quien administra tu negocio que te genere una contraseña temporal.',
  },
  reset: {
    title: 'Elige una contraseña nueva',
    subtitle: 'Escribe el código que te enviamos y tu contraseña nueva.',
    code: { label: 'Código', placeholder: '123456', hint: 'Son 6 dígitos.' },
    newPassword: { label: 'Contraseña nueva', hint: 'Mínimo 8 caracteres.' },
    confirmPassword: { label: 'Repite la contraseña nueva' },
    submit: 'Cambiar contraseña',
    resend: 'Reenviar código',
    resent: 'Te enviamos un código nuevo; el anterior ya no sirve.',
    changePhone: 'Cambiar celular',
  },
  done: {
    title: 'Contraseña cambiada',
    subtitle: 'Ya puedes iniciar sesión con tu contraseña nueva. Cerramos tus otras sesiones por seguridad.',
    action: 'Iniciar sesión',
  },
} as const;

export const CHANGE_PASSWORD_CONTENT = {
  panel: {
    eyebrow: 'Un último paso',
    title: 'Elige tu propia contraseña',
    description: 'Ingresaste con una contraseña temporal. Cámbiala por una que solo tú conozcas para seguir.',
  },
  form: {
    title: 'Cambia tu contraseña',
    subtitle: 'Es obligatorio antes de entrar al panel.',
    currentPassword: { label: 'Contraseña temporal' },
    newPassword: { label: 'Contraseña nueva', hint: 'Mínimo 8 caracteres.' },
    confirmPassword: { label: 'Repite la contraseña nueva' },
    submit: 'Guardar y continuar',
  },
} as const;
