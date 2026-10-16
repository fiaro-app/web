/**
 * Textos del tutorial de bienvenida: qué es cada parte del panel y para qué sirve. Cada paso explica
 * el «para qué» (lo que se hace ahí) y el «por qué» (qué gana el negocio con eso).
 */
export const TUTORIAL_TEXT = {
  invite: {
    title: '¡Bienvenido a Fiaro!',
    description: 'Es tu panel para llevar el negocio de préstamos. ¿Quieres un recorrido corto? Te mostramos para qué sirve cada parte, una por una.',
    start: 'Sí, mostrarme',
    skip: 'Ahora no',
  },
  controls: {
    step: (current: number, total: number) => `Paso ${String(current)} de ${String(total)}`,
    next: 'Siguiente',
    previous: 'Anterior',
    finish: 'Terminar',
    skip: 'Omitir tutorial',
  },
  pageGuide: {
    action: 'Guía de esta pantalla',
    intro: (title: string) => `Guía: ${title}`,
    none: 'Esta pantalla no tiene guía propia. Te mostramos el recorrido general.',
  },
  launcher: {
    title: 'Tutorial',
    description: 'Un recorrido corto por el panel: para qué sirve cada parte y por qué te conviene usarla.',
    action: 'Ver el tutorial',
  },
  welcome: {
    title: 'Así se recorre el panel',
    body: 'Te iremos señalando cada opción del menú, y todo lo demás se verá borroso. Puedes avanzar, volver o salir cuando quieras. Dura menos de un minuto.',
  },
  mobileMenu: {
    title: 'El menú',
    body: 'Desde el botón ☰ abres el menú con todas las secciones. En una pantalla grande el menú está siempre a la izquierda; este recorrido te explica cada sección.',
  },
  /** Una explicación por opción del menú, por su ruta. */
  nav: {
    '/resumen': {
      title: 'Resumen',
      body: 'Es la foto del negocio de hoy: cuánto se cobró, cuánto falta, la mora y los cuadres por revisar. Sirve para saber en un vistazo cómo va el día y dónde hay que actuar primero.',
    },
    '/cobradores': {
      title: 'Cobradores',
      body: 'Aquí registras a las personas que cobran, les asignas cartera y les restableces la contraseña. Sirve para que cada cobrador solo vea y cobre lo que le toca, y para dar de baja a alguien sin dejar préstamos huérfanos.',
    },
    '/clientes': {
      title: 'Clientes',
      body: 'Es el directorio de las personas a las que les prestas, con lo que deben y su mora. Sirve para registrar un cliente una sola vez y tener su historial completo al decidir un nuevo préstamo.',
    },
    '/prestamos': {
      title: 'Préstamos',
      body: 'Aquí creas y sigues cada préstamo: cuotas, saldo, mora, cobrador y calendario de pagos. Sirve para que el saldo siempre cuadre y sepas qué cobrar y a quién.',
    },
    '/cobros': {
      title: 'Cobros del día',
      body: 'Muestra todas las visitas de cobro de tu equipo: qué se cobró, qué se reprogramó y quién no pagó. Sirve para vigilar el trabajo en campo en tiempo real y corregir un pago si hubo un error.',
    },
    '/solicitudes': {
      title: 'Solicitudes',
      body: 'Los préstamos que tus cobradores sugieren en campo, con un cliente nuevo o uno que ya tienes. Los aceptas (puedes ajustar los datos) y se crean y se asignan solos, o los rechazas con un motivo. Sirve para que el cobrador proponga sin ver datos que no le tocan.',
    },
    '/rutas': {
      title: 'Registro de rutas',
      body: 'Lo que hizo cada cobrador cada día: cuándo empezó y terminó su ruta, cuántas visitas hizo y cuánto cobró. Desde cada renglón abres el detalle de sus visitas. Sirve para revisar el trabajo en campo día por día.',
    },
    '/cuadres': {
      title: 'Cuadres',
      body: 'Al cerrar el día, cada cobrador entrega su cuadre: lo esperado frente a lo que entrega. Aquí lo revisas y lo apruebas o lo rechazas. Sirve para que el dinero que entra coincida con lo que se cobró.',
    },
    '/notificaciones': {
      title: 'Notificaciones',
      body: 'Te avisa de lo que necesita tu atención, como un cuadre pendiente o un pago atrasado. El número indica cuántas no has leído. Sirve para que nada importante se te pase.',
    },
    '/estadisticas': {
      title: 'Estadísticas',
      body: 'Reportes de cartera en riesgo, mora por antigüedad y desempeño de cada cobrador, que puedes descargar en PDF. Sirve para tomar decisiones con datos: a quién reforzar y dónde está el riesgo.',
    },
    '/administradores': {
      title: 'Administradores',
      body: 'Quiénes administran tu negocio contigo. Puedes subir de rango a un cobrador, invitar a un administrador nuevo o quitarle el rol. Sirve para tener más de una persona al frente sin compartir una sola cuenta.',
    },
    '/configuracion': {
      title: 'Configuración',
      body: 'El nombre y el logo del negocio, el color de marca, los días en que no se cobra y las carteras. Sirve para que Fiaro se vea y funcione como tu negocio.',
    },
  },
  account: {
    title: 'Tu cuenta',
    body: 'Tu nombre y tu rol. Al pulsarlo editas tus datos, cambias la contraseña, ves en qué equipos tienes la sesión abierta y puedes volver a ver este tutorial. Sirve para mantener tu acceso seguro.',
  },
  signOut: {
    title: 'Cerrar sesión',
    body: 'Sal siempre desde aquí cuando uses un equipo que no es tuyo. Sirve para que nadie más vea los datos de tus clientes.',
  },
  done: {
    title: '¡Listo!',
    body: 'Ya conoces el panel. Puedes volver a ver este recorrido cuando quieras desde «Mi cuenta».',
  },
} as const;

export type TutorialNavHref = keyof typeof TUTORIAL_TEXT.nav;
