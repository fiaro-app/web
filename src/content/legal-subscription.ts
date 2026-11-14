import type { LegalDocument } from '@/content/legal';

/** Marcador de los datos de la empresa que aún no existen; se llena antes de salir a producción. */
const COMPANY = '[RAZÓN SOCIAL, NIT Y DOMICILIO DE FIARO — pendiente]';

/** Cómo se contrata, se paga y vence un plan. */
export const SUBSCRIPTION_TERMS: LegalDocument = {
  path: '/suscripcion',
  title: 'Condiciones de Suscripción y Pagos',
  description: 'Cómo funcionan los planes de Fiaro: prueba gratis, precios con IVA incluido, pago con Wompi, vencimiento y modo de solo lectura.',
  intro:
    'Estas condiciones complementan los Términos y Condiciones y explican cómo se contrata y se paga un plan de Fiaro. La información de esta página cumple el deber de informar antes de contratar a distancia (Ley 1480 de 2011).',
  sections: [
    {
      heading: '1. Quién te vende el servicio',
      paragraphs: [`El servicio lo presta ${COMPANY}. Los datos de contacto están en el formulario de contacto de este sitio.`],
    },
    {
      heading: '2. Prueba gratis y planes',
      items: [
        'Al crear tu cuenta empiezas con una prueba gratis de 30 días, sin tarjeta y con topes más bajos que los de un plan de pago.',
        'Los planes de pago son Individual, Pro y Team. Cada uno tiene límites de administradores, cobradores, carteras y préstamos activos que ves antes de pagar, en «Plan y pagos» y en la página de precios.',
        'Puedes pasar de un plan a otro cuando quieras; si te sobraban días del plan anterior, se suman.',
      ],
    },
    {
      heading: '3. Precios e impuestos',
      paragraphs: [
        'Los precios están en pesos colombianos, son por mes y se muestran con el IVA incluido. Lo que ves en la página de pago de Wompi es el total que se te cobra: no se suma ningún impuesto ni costo adicional de Fiaro.',
        'Cuando el pago se confirma, te enviamos un recibo por correo. La factura electrónica se emite conforme a la normativa de la DIAN una vez Fiaro cumpla los requisitos de facturación [pendiente de confirmar con un contador].',
      ],
    },
    {
      heading: '4. Cómo se paga',
      items: [
        'El pago se hace en la página segura de Wompi, con tarjeta, PSE, Nequi o transferencia Bancolombia. Fiaro no recibe ni guarda los datos de tu tarjeta ni de tu cuenta.',
        'Pagas un mes a la vez. No hay cobro automático ni renovación sin que tú la hagas: cada pago activa o extiende tu plan por un mes.',
        'Wompi aplica sus propios términos y su política de privacidad al procesar el pago. Si un pago es rechazado, no se te cobra nada.',
        'Te recordamos por correo y en la aplicación cuando tu plan está por vencer.',
      ],
    },
    {
      heading: '5. Qué pasa cuando el plan vence',
      items: [
        'Tienes 7 días de gracia en los que todo sigue funcionando igual.',
        'Pasados esos días, la cuenta pasa a modo de solo lectura: puedes ver tus datos, exportarlos y pagar, pero no registrar nuevos préstamos, cobros ni cuadres hasta renovar.',
        'No borramos tus datos por vencimiento. Se conservan el tiempo que indica la Política de Privacidad.',
      ],
    },
    {
      heading: '6. Cambios de precio y de condiciones',
      paragraphs: [
        'Si cambiamos un precio o un límite de un plan, lo publicamos con anticipación razonable y no afecta el mes que ya pagaste. Si no estás de acuerdo con el cambio, no renuevas y tu cuenta sigue en solo lectura.',
      ],
    },
    {
      heading: '7. Devoluciones y reclamos',
      paragraphs: [
        'Las devoluciones, el retracto y la reversión del pago se explican en la Política de Devolución de Dinero. Los reclamos sobre un cobro se atienden como indica la página de Peticiones, Quejas y Reclamos.',
      ],
    },
  ],
};

/** Retracto, reversión del pago y devoluciones de la suscripción (Ley 1480 de 2011). */
export const REFUND_POLICY: LegalDocument = {
  path: '/devoluciones',
  title: 'Política de Devolución de Dinero y Cancelación',
  description: 'Cuándo y cómo puedes pedir que te devolvamos un pago de tu plan, tu derecho de retracto y la reversión del pago según la ley colombiana.',
  intro:
    'Esta política aplica a los pagos de planes de Fiaro. Se apoya en el Estatuto del Consumidor (Ley 1480 de 2011) y sus decretos reglamentarios, que reconocen tu derecho de retracto en compras a distancia y la reversión del pago.',
  sections: [
    {
      heading: '1. Qué se paga y qué no está cubierto',
      paragraphs: [
        'Solo se paga la suscripción mensual a Fiaro. Fiaro no presta, no recibe ni mueve el dinero de los préstamos de tus clientes, así que esas sumas nunca pasan por Fiaro y no hay devoluciones sobre ellas.',
      ],
    },
    {
      heading: '2. Derecho de retracto (compras a distancia)',
      paragraphs: [
        'Al contratar por internet puedes retractarte dentro de los 5 días hábiles siguientes a la contratación, sin dar razones y sin penalidad (artículo 47 de la Ley 1480 de 2011).',
        'La ley exceptúa los servicios cuya prestación ya comenzó con tu acuerdo. Como tu plan se activa en el momento del pago porque así lo pides, el retracto no es automático una vez usas el plan. Aun así, como compromiso comercial de Fiaro, te devolvemos el pago si lo pides dentro de los 5 días hábiles siguientes y todavía no has registrado operación real en la cuenta (préstamos, cobros o cuadres) [decisión comercial por confirmar].',
        'Para ejercerlo escribe por el formulario de contacto con el correo de tu cuenta y la fecha del pago.',
      ],
    },
    {
      heading: '3. Cuándo devolvemos el dinero sin discusión',
      items: [
        'Te cobramos dos veces el mismo mes por un error de Fiaro o de la pasarela.',
        'Pagaste y el plan no se activó, y no podemos activarlo en un plazo razonable.',
        'Hubo un cobro que tú no autorizaste.',
        'El servicio estuvo caído por causas nuestras durante un tiempo que afecte de forma grave el mes pagado; en ese caso devolvemos la parte proporcional o la compensamos con días adicionales, a tu elección.',
      ],
    },
    {
      heading: '4. Reversión del pago',
      paragraphs: [
        'Si pagaste con tarjeta o con otro instrumento de pago electrónico y fue una operación fraudulenta, no solicitada, o el servicio no se prestó, puedes pedir la reversión del pago a tu banco o emisor. Debes pedirlo dentro de los 5 días hábiles siguientes a que te enteraste de la operación (artículo 51 de la Ley 1480 de 2011 y Decreto 587 de 2016). Avísanos también para que te ayudemos con la documentación.',
      ],
    },
    {
      heading: '5. Qué no devolvemos',
      items: [
        'Meses ya usados en los que registraste operación en tu cuenta, salvo los casos de la sección 3.',
        'Cobros de tu banco o medio de pago ajenos a Fiaro (cuota de manejo, comisiones, diferencias de cambio).',
        'Suspensiones o cierres por incumplimiento de los Términos y Condiciones o de la ley.',
      ],
    },
    {
      heading: '6. Cómo y cuándo te devolvemos',
      items: [
        'Respondemos tu solicitud en máximo 5 días hábiles.',
        'Si procede, devolvemos el valor por el mismo medio con el que pagaste, en máximo 30 días calendario desde que aceptamos la solicitud, como indica la ley para el retracto. El tiempo en que el banco refleja el dinero depende de él.',
        'Al devolverte un pago, el plan vuelve al estado que tenía antes de ese pago.',
      ],
    },
    {
      heading: '7. Cancelar',
      paragraphs: [
        'No hay renovación automática, así que no tienes nada que cancelar: si no pagas el siguiente mes, el plan simplemente vence. Si quieres cerrar tu cuenta y pedir la supresión de tus datos, escríbenos por el formulario de contacto; lo tratamos como indica la Política de Privacidad (Ley 1581 de 2012). Los días que ya pagaste no se devuelven por cerrar la cuenta, salvo los casos de la sección 3.',
      ],
    },
    {
      heading: '8. Si no estás conforme',
      paragraphs: [
        'Puedes acudir a la Superintendencia de Industria y Comercio (SIC), que vigila la protección del consumidor, sin perjuicio de tus derechos ante la justicia.',
      ],
    },
  ],
};

/** Canal y plazos para peticiones, quejas, reclamos y consultas de datos. */
export const CLAIMS_POLICY: LegalDocument = {
  path: '/pqr',
  title: 'Peticiones, Quejas y Reclamos',
  description: 'Cómo presentar una petición, queja, reclamo o consulta sobre datos personales a Fiaro y en cuánto tiempo la respondemos.',
  intro:
    'Esta página te dice cómo contactarnos y qué plazos cumplimos. Atiende el deber de dar un canal de reclamos al consumidor (Ley 1480 de 2011) y los términos para consultas y reclamos sobre datos personales (Ley 1581 de 2012).',
  sections: [
    {
      heading: '1. Cómo presentarla',
      paragraphs: [
        `Escríbenos por el formulario de contacto de este sitio. Indica tu nombre, cédula o NIT, el correo de tu cuenta, y qué pides o qué pasó. Quien responde es ${COMPANY}.`,
      ],
    },
    {
      heading: '2. Plazos',
      items: [
        'Reclamos sobre el servicio o un cobro: respuesta en máximo 15 días hábiles. Si necesitamos más tiempo, te avisamos el motivo y la nueva fecha.',
        'Consultas sobre tus datos personales: máximo 10 días hábiles, prorrogables 5 más.',
        'Reclamos para corregir, actualizar o suprimir tus datos, o revocar tu autorización: máximo 15 días hábiles, prorrogables 8 más.',
        'Si tu solicitud está incompleta, te pedimos lo que falta; el plazo empieza cuando la completes.',
      ],
    },
    {
      heading: '3. Si eres cliente de un prestamista',
      paragraphs: [
        'Los datos de tus préstamos, pagos y cobros los maneja el prestamista que usa Fiaro (es el responsable de tus datos). Dirígete primero a él; nosotros lo ayudamos a atenderte con las herramientas del servicio. Fiaro no cobra, no presta ni reporta a centrales de riesgo.',
      ],
    },
    {
      heading: '4. Si no te respondemos bien',
      items: [
        'Consumo y cobros: Superintendencia de Industria y Comercio, www.sic.gov.co.',
        'Datos personales: Superintendencia de Industria y Comercio, Delegatura para la Protección de Datos Personales, una vez hayas agotado el trámite con nosotros.',
      ],
    },
  ],
};
