/** Textos de la página pública «Contactar ventas» (`/contacto`). */
export const CONTACT_CONTENT = {
  metadata: {
    title: 'Contactar ventas',
    description: 'Cuéntanos cómo manejas hoy tu cartera y te ayudamos a probar Fiaro con tus cobradores. Respondemos por celular o correo.',
  },
  eyebrow: 'Contactar ventas',
  title: 'Hablemos de tu cartera',
  subtitle: 'Cuéntanos cuántos cobradores y clientes manejas. Te respondemos por el medio que prefieras, sin compromiso.',
  steps: {
    title: '¿Qué pasa después?',
    items: [
      'Recibimos tu mensaje y lo lee una persona de ventas, no un robot.',
      'Te escribimos o te llamamos para entender cómo cobras hoy.',
      'Te mostramos Fiaro con tus números y, si te sirve, creas tu cuenta gratis.',
    ],
    tip: { title: 'Mientras tanto', body: '¿Prefieres explorar solo? Crea tu cuenta gratis y prueba Fiaro con tu cartera cuando quieras.' },
    signup: 'Comenzar gratis',
  },
  form: {
    label: 'Contactar ventas',
    name: { label: 'Nombre', placeholder: 'Ej: Ana Pérez' },
    phone: { label: 'Celular', hint: 'Escribe el celular o el correo (o los dos).', placeholder: '300 123 4567' },
    email: { label: 'Correo', placeholder: 'ana@ejemplo.co' },
    message: { label: 'Cuéntanos', placeholder: 'Ej: Tengo 3 cobradores y unos 200 clientes. Quiero dejar el cuaderno.' },
    submit: 'Enviar mensaje',
  },
  sent: {
    title: '¡Recibimos tu mensaje!',
    description: 'Ventas te responderá por el medio que dejaste, normalmente el mismo día hábil.',
    home: 'Volver al inicio',
    signup: 'Crear mi cuenta gratis',
  },
  back: '← Volver al inicio',
} as const;
