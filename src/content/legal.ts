/**
 * Versión vigente de los documentos legales: la fecha en que se publicó el texto. Debe ser igual a `CURRENT_LEGAL_VERSION` de la API
 * (si no, el registro responde `P930V`). Al cambiar un texto, se sube aquí, en la API y en la app móvil.
 */
export const LEGAL_VERSION = '2026-10-16';

/** Una parte de un documento legal: su título y sus párrafos o puntos. */
export interface LegalSection {
  readonly heading: string;
  readonly paragraphs?: readonly string[];
  readonly items?: readonly string[];
}

/** Un documento legal publicado en la web. */
export interface LegalDocument {
  readonly path: string;
  readonly title: string;
  readonly description: string;
  readonly intro: string;
  readonly sections: readonly LegalSection[];
}

/** Aviso que acompaña a todos los documentos: son un borrador a la espera de revisión legal. */
export const LEGAL_NOTICE = 'Última actualización: 16 de octubre de 2026.';

export const TERMS: LegalDocument = {
  path: '/terminos',
  title: 'Términos y Condiciones',
  description: 'Las reglas de uso de Fiaro: qué es el servicio, qué te comprometes a cumplir como prestamista y cómo se limita nuestra responsabilidad.',
  intro:
    'Estos términos regulan el uso de Fiaro, el software de gestión de cartera para prestamistas. Al crear tu cuenta marcas que los leíste y los aceptas; esa aceptación electrónica tiene el mismo valor que una firma (Ley 527 de 1999).',
  sections: [
    {
      heading: '1. Qué es Fiaro y qué no es',
      paragraphs: [
        'Fiaro es una herramienta de software para llevar el control de una cartera de préstamos: clientes, préstamos, cuotas, cobros, cuadres y reportes. Fiaro NO presta dinero, NO cobra a tus clientes, NO recibe ni mueve el dinero de los préstamos, NO fija tasas de interés y NO es una entidad vigilada por la Superintendencia Financiera.',
        'Fiaro solo registra lo que tú y tu equipo hacen. Todo préstamo, cobro y decisión es tuyo y de tu negocio.',
      ],
    },
    {
      heading: '2. Quién puede usar el servicio',
      items: [
        'Personas mayores de 18 años con capacidad legal para obligarse, o representantes de una empresa con facultades para aceptar estos términos.',
        'Una sola cuenta de dueño por negocio; tú decides qué personas de tu equipo (administradores y cobradores) acceden y con qué permisos.',
      ],
    },
    {
      heading: '3. Tu cuenta y tu seguridad',
      items: [
        'Eres responsable de la contraseña y de toda actividad que ocurra con tu cuenta y con las de tus cobradores y administradores.',
        'Debes entregar la contraseña temporal de cada cobrador en persona y desactivar su acceso cuando deje de trabajar contigo.',
        'Si sospechas de un uso no autorizado, cambia la contraseña y avísanos de inmediato.',
      ],
    },
    {
      heading: '4. Lo que declaras y te comprometes a cumplir como prestamista',
      paragraphs: ['Al aceptar estos términos declaras, bajo tu responsabilidad, que:'],
      items: [
        'Tienes la autorización previa, expresa e informada de cada cliente para tratar sus datos personales en Fiaro, y le informaste tu política de tratamiento de datos (Ley 1581 de 2012). Fiaro no contacta a tus clientes ni les pide esa autorización.',
        'Tu actividad de crédito y cobranza cumple la ley colombiana, incluidas las reglas de horarios, frecuencia y canales de contacto para la gestión de cobranza (Ley 2300 de 2023), la prohibición de contactar a terceros o referencias del deudor, y el respeto de la dignidad de las personas. No usarás Fiaro para amenazar, acosar ni divulgar la deuda de nadie.',
        'No cobrarás intereses por encima del límite legal (tasa de usura certificada por la Superintendencia Financiera). La usura es un delito y es exclusivamente tu responsabilidad.',
        'No reportarás información a centrales de riesgo crediticio sin ser fuente de información autorizada; Fiaro no hace esos reportes.',
        'El dinero que prestas tiene origen lícito y no usarás Fiaro para lavado de activos, financiación de actividades ilegales ni cobro de deudas inexistentes.',
        'Los datos que registras son ciertos y los mantienes actualizados.',
      ],
    },
    {
      heading: '5. Los datos de tus clientes',
      paragraphs: [
        'Tú eres el Responsable del tratamiento de los datos de tus clientes y Fiaro actúa como Encargado: los trata únicamente por tu cuenta, para prestarte el servicio, siguiendo tus instrucciones y esta cláusula, que hace de contrato de transmisión de datos. Fiaro no vende esos datos, no los usa para otros fines y aplica medidas de seguridad razonables (acceso por roles, sesiones cifradas, archivos privados con enlaces que vencen).',
        'Si un cliente tuyo ejerce un derecho (consultar, corregir o suprimir sus datos), tú respondes; Fiaro te ayuda con las herramientas del servicio. La foto de un cliente es opcional y puede ser dato sensible: súbela solo con autorización expresa. No subas fotos de cédulas.',
      ],
    },
    {
      heading: '6. Uso aceptable',
      items: [
        'No intentes acceder a datos de otros negocios, vulnerar la seguridad, hacer ingeniería inversa ni sobrecargar el servicio.',
        'No uses el servicio para fines ilegales, engañosos o que vulneren derechos de terceros.',
        'No subas contenido que no puedas legalmente subir (por ejemplo, imágenes de terceros sin autorización).',
      ],
    },
    {
      heading: '7. Cálculos, riesgo y reportes son una ayuda, no una garantía',
      paragraphs: [
        'Los saldos, la mora, la efectividad y el puntaje de riesgo se calculan con la información que tú registras. Son una ayuda interna para decidir; no son un reporte crediticio, ni asesoría financiera, legal, contable o tributaria. Verifica siempre lo importante antes de actuar.',
      ],
    },
    {
      heading: '8. Planes y pagos',
      items: [
        'El servicio puede incluir un período de prueba y planes de pago con límites por plan (carteras, cobradores, clientes).',
        'Los precios publicados son de referencia hasta el lanzamiento; te avisaremos con anticipación razonable cualquier cambio que te afecte.',
        'Cuando existan cobros de suscripción, informaremos antes de que aceptes la oferta las condiciones, el medio de pago y, si aplica, tu derecho de retracto según la ley de consumo (Ley 1480 de 2011).',
      ],
    },
    {
      heading: '9. Limitación de responsabilidad',
      paragraphs: [
        'En la máxima medida que permita la ley, Fiaro no responde por: (a) el no pago de tus clientes, pérdidas de cartera o de dinero; (b) decisiones que tomes con base en los reportes; (c) la conducta de tus cobradores o administradores; (d) sanciones, reclamaciones o perjuicios derivados de tu incumplimiento de la ley o de estos términos; (e) interrupciones, errores o pérdida de datos causados por terceros, fallas de internet o de tu dispositivo, o hechos fuera de nuestro control razonable.',
        'Si Fiaro llegara a ser responsable, la indemnización total se limita a lo que hayas pagado por el servicio en los 12 meses anteriores al hecho, salvo dolo, culpa grave o lo que la ley no permita limitar.',
      ],
    },
    {
      heading: '10. Mantenernos indemnes',
      paragraphs: [
        'Te comprometes a mantener indemne a Fiaro frente a reclamaciones, multas, sanciones y costos (incluidos honorarios razonables) que presenten tus clientes, terceros o autoridades por tu actividad de crédito y cobranza, por los datos que registraste sin autorización o por tu incumplimiento de estos términos.',
      ],
    },
    {
      heading: '11. Propiedad intelectual y tus datos',
      paragraphs: [
        'El software, la marca y los diseños de Fiaro son de Fiaro; te damos una licencia limitada, revocable y no exclusiva para usarlos mientras tengas cuenta. Los datos que registras siguen siendo tuyos: puedes pedirnos copia o supresión según la Política de Privacidad.',
      ],
    },
    {
      heading: '12. Suspensión y terminación',
      paragraphs: [
        'Puedes cerrar tu cuenta cuando quieras. Podemos suspender o cerrar una cuenta que incumpla estos términos o la ley, o que ponga en riesgo a otros usuarios, avisándote cuando sea posible. Tras la terminación conservamos los datos solo el tiempo que indica la Política de Privacidad.',
      ],
    },
    {
      heading: '13. Cambios a estos términos',
      paragraphs: [
        'Podemos actualizar estos términos. Publicaremos la nueva versión con su fecha y, si el cambio es sustancial, te pediremos aceptarla de nuevo. Seguir usando el servicio después de un cambio no sustancial significa que lo aceptas.',
      ],
    },
    {
      heading: '14. Ley aplicable y controversias',
      paragraphs: [
        'Estos términos se rigen por las leyes de la República de Colombia. Las controversias se someten a los jueces colombianos competentes, sin perjuicio de los derechos irrenunciables que la ley te reconozca como consumidor o titular de datos y de tu derecho de acudir a la Superintendencia de Industria y Comercio.',
      ],
    },
    {
      heading: '15. Contacto',
      paragraphs: ['Escríbenos por el formulario de contacto de este sitio para cualquier duda sobre estos términos.'],
    },
  ],
};

export const PRIVACY: LegalDocument = {
  path: '/privacidad',
  title: 'Política de Privacidad y Tratamiento de Datos Personales',
  description: 'Qué datos trata Fiaro, para qué, durante cuánto tiempo y cómo puedes conocerlos, corregirlos o pedir que los borremos (Ley 1581 de 2012).',
  intro:
    'Esta política cumple la Ley 1581 de 2012 y sus decretos reglamentarios. Al registrarte la lees y autorizas el tratamiento de tus datos según lo que aquí se explica.',
  sections: [
    {
      heading: '1. Quién es el responsable',
      paragraphs: [
        'Para los datos de tu cuenta (tuyos y de tus cobradores), el Responsable del tratamiento es Fiaro. Puedes contactarnos por el formulario de contacto de este sitio.',
        'Para los datos de los clientes que tú registras, el Responsable eres tú (el prestamista) y Fiaro es solo Encargado: los trata por tu cuenta. Si eres cliente de un prestamista y quieres ejercer tus derechos, dirígete primero a él.',
      ],
    },
    {
      heading: '2. Qué datos tratamos',
      items: [
        'De tu cuenta: nombre, cédula, celular, correo (opcional), contraseña (solo guardamos su huella cifrada), nombre de tu negocio y rol.',
        'De tus clientes, que registras tú: nombre, cédula, celular, dirección, ocupación, foto (opcional), préstamos, pagos, visitas de cobro y puntaje de riesgo calculado.',
        'Comprobantes de pago que adjuntes (capturas de Nequi o transferencias).',
        'Técnicos: dirección IP, tipo de dispositivo, fechas de acceso y registros de seguridad.',
        'Evidencia de tus autorizaciones: qué aceptaste, en qué versión, cuándo y desde qué IP y dispositivo.',
      ],
    },
    {
      heading: '3. Para qué los usamos (finalidades)',
      items: [
        'Crear y administrar tu cuenta y prestarte el servicio de gestión de cartera.',
        'Mantener la seguridad, prevenir fraudes y cumplir obligaciones legales.',
        'Enviarte avisos del servicio (recuperación de contraseña, notificaciones de tu operación).',
        'Con tu autorización opcional: enviarte novedades y ofertas. Puedes revocarla cuando quieras.',
        'Conservar la prueba de tus autorizaciones.',
      ],
    },
    {
      heading: '4. Datos sensibles',
      paragraphs: [
        'Una fotografía puede ser dato sensible (biométrico) cuando sirve para identificar a una persona. La foto del cliente es opcional: nadie está obligado a darla ni a permitirla, y solo debes subirla con su autorización expresa. No pedimos ni guardamos fotos de cédulas.',
      ],
    },
    {
      heading: '5. Tus derechos como titular',
      items: [
        'Conocer, actualizar y rectificar tus datos.',
        'Pedir prueba de la autorización que diste.',
        'Ser informado del uso que se le ha dado a tus datos.',
        'Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley.',
        'Revocar la autorización y pedir la supresión de tus datos, cuando no exista un deber legal o contractual de conservarlos.',
        'Acceder gratuitamente a tus datos.',
      ],
    },
    {
      heading: '6. Cómo ejercer tus derechos',
      paragraphs: [
        'Escríbenos por el formulario de contacto indicando tu nombre, cédula y qué quieres hacer. Atendemos las consultas en máximo 10 días hábiles (prorrogables por 5 más, avisándote el motivo) y los reclamos en máximo 15 días hábiles (prorrogables por 8 más). Para proteger tus datos podemos pedirte acreditar tu identidad.',
      ],
    },
    {
      heading: '7. Con quién compartimos los datos',
      paragraphs: [
        'No vendemos datos personales. Usamos proveedores que tratan datos por nuestra cuenta, dentro de contratos de transmisión: alojamiento y base de datos, almacenamiento de archivos, correo electrónico, verificación antifraude (Cloudflare Turnstile) y servicios de notificación. Algunos pueden estar fuera de Colombia; en ese caso exigimos un nivel adecuado de protección. También podemos entregar datos a autoridades que los soliciten legalmente.',
      ],
    },
    {
      heading: '8. Seguridad',
      paragraphs: [
        'Aplicamos medidas técnicas y organizativas razonables: acceso por roles, contraseñas cifradas, conexiones seguras, archivos privados que se ven con enlaces que vencen y registro de la actividad. Ningún sistema es infalible; si ocurre un incidente que afecte tus datos, actuaremos y te informaremos según la ley.',
      ],
    },
    {
      heading: '9. Cuánto tiempo los conservamos',
      paragraphs: [
        'Mientras tengas cuenta y el tiempo adicional necesario para cumplir obligaciones legales, resolver reclamaciones y conservar la prueba de tus autorizaciones. Después, los suprimimos o anonimizamos.',
      ],
    },
    {
      heading: '10. Menores de edad',
      paragraphs: ['Fiaro es para mayores de 18 años. No tratamos conscientemente datos de menores.'],
    },
    {
      heading: '11. Cambios a esta política',
      paragraphs: ['Si la política cambia de forma sustancial, publicaremos la nueva versión y, cuando la ley lo exija, te pediremos una nueva autorización.'],
    },
  ],
};

export const COOKIES: LegalDocument = {
  path: '/cookies',
  title: 'Política de Cookies',
  description: 'Qué cookies usa Fiaro (solo las estrictamente necesarias), para qué sirven y cómo puedes controlarlas.',
  intro:
    'Una cookie es un pequeño archivo que el sitio guarda en tu dispositivo. En Colombia, las cookies que recogen datos personales se tratan según la Ley 1581 de 2012.',
  sections: [
    {
      heading: '1. Qué cookies usamos',
      items: [
        'Sesión de Fiaro: te mantiene con la sesión abierta mientras usas el panel. Es estrictamente necesaria; sin ella no podrías iniciar sesión.',
        'Verificación de seguridad (Cloudflare Turnstile): comprueba que quien se registra o recupera una contraseña es una persona y no un programa automático. Es necesaria para proteger el servicio.',
        'Almacenamiento local del navegador: recuerda cosas como que ya viste este aviso o el tutorial de bienvenida. No sale de tu dispositivo.',
      ],
    },
    {
      heading: '2. Lo que NO hacemos',
      paragraphs: ['No usamos cookies de publicidad, de seguimiento entre sitios ni de analítica de terceros. Por eso no te pedimos elegir categorías: solo usamos las necesarias.'],
    },
    {
      heading: '3. Cómo controlarlas',
      paragraphs: [
        'Puedes borrar o bloquear las cookies desde la configuración de tu navegador. Si bloqueas las necesarias, no podrás iniciar sesión.',
      ],
    },
    {
      heading: '4. Cambios',
      paragraphs: ['Si algún día usamos cookies opcionales (por ejemplo, analítica), te pediremos tu consentimiento antes de activarlas y actualizaremos esta política.'],
    },
  ],
};

/** Los documentos que se muestran en el registro y el pie de página, en orden. */
export const LEGAL_DOCUMENTS = [TERMS, PRIVACY, COOKIES] as const;

/** Textos de las casillas de aceptación del registro. */
export const CONSENT_TEXT = {
  legend: 'Autorizaciones',
  terms: { before: 'Leí y acepto los ', link: 'Términos y Condiciones', after: '.' },
  privacy: {
    before: 'Autorizo el tratamiento de mis datos personales según la ',
    link: 'Política de Privacidad',
    after: '.',
  },
  responsibility:
    'Declaro que tengo la autorización de mis clientes para tratar sus datos, que mi cobranza cumple la ley (incluida la Ley 2300 de 2023) y que no cobraré por encima de la tasa de usura. Entiendo que Fiaro es solo una herramienta y no presta ni cobra dinero.',
  marketing: 'Quiero recibir novedades y ofertas de Fiaro (opcional).',
  required: 'Debes aceptar esto para crear tu cuenta.',
} as const;

/** Aviso de cookies de la web. */
export const COOKIE_NOTICE = {
  text: 'Usamos solo cookies necesarias para que inicies sesión y para proteger el sitio. No usamos publicidad ni analítica.',
  link: 'Más información',
  accept: 'Entendido',
} as const;
