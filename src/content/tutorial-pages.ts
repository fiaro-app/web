import { ACCOUNT_TEXT } from '@/content/account';
import { LOANS_TEXT } from '@/content/loans';
import { NOTIFICATIONS_TEXT } from '@/content/notifications';
import { SETTINGS_TEXT } from '@/content/settings';
import { VISITS_TEXT } from '@/content/visits';

/** Un paso de la guía de una pantalla: qué elemento se señala (selector CSS) y qué se explica. */
export interface PageGuideStep {
  readonly selector: string;
  readonly title: string;
  readonly body: string;
}

const labeled = (label: string, tag = '') => `#contenido ${tag}[aria-label=${JSON.stringify(label)}]`;
const NEW = (path: string) => `#contenido header a[href="${path}"]`;
const TABLE = '#contenido table';
const SEARCH = '#contenido form[role="search"]';
const FORM = (action: string) => `#contenido form[action="${action}"]`;

/**
 * La guía de cada pantalla: sus controles principales y para qué sirven. Un paso cuyo elemento no está en pantalla (el
 * botón de crear para quien no puede crear, una tabla vacía) se omite al empezar. La clave es la ruta sin ids (`/prestamos/:id`).
 */
export const PAGE_GUIDES: Readonly<Record<string, readonly PageGuideStep[]>> = {
  '/resumen': [
    {
      selector: labeled('Indicadores', 'section'),
      title: 'Los indicadores',
      body: 'Cartera total, lo cobrado hoy, la efectividad, los cobradores activos y los clientes en mora. Sirven para saber en un vistazo cómo va el negocio.',
    },
    {
      selector: FORM('/resumen'),
      title: 'El período',
      body: 'Elige un rango de fechas para ver lo cobrado y lo esperado en ese lapso. Sin fechas se muestra solo hoy. Sirve para comparar días o semanas.',
    },
    {
      selector: '#contenido [aria-labelledby="settlements-title"]',
      title: 'Cuadres pendientes',
      body: 'Los cuadres que los cobradores ya entregaron y esperan tu revisión. Sirve para aprobarlos cuanto antes y que el dinero cuadre.',
    },
  ],
  '/cobradores': [
    { selector: NEW('/cobradores/nuevo'), title: 'Registrar cobrador', body: 'Agrega a una persona que cobrará para ti. Si no tiene cuenta, Fiaro le genera una contraseña temporal que verás una sola vez.' },
    { selector: TABLE, title: 'Tu equipo', body: 'Cada cobrador con su teléfono, cartera y estado. Desde «Gestionar» cambias su cartera, restableces su contraseña o lo das de baja pasando sus préstamos a otro cobrador.' },
  ],
  '/clientes': [
    { selector: NEW('/clientes/nuevo'), title: 'Registrar cliente', body: 'Da de alta a una persona una sola vez. Sirve para poder darle préstamos y tener todo su historial en un lugar.' },
    { selector: SEARCH, title: 'Buscar', body: 'Encuentra un cliente por su nombre o su cédula. Sirve para llegar rápido a su ficha sin recorrer toda la lista.' },
    { selector: TABLE, title: 'Tus clientes', body: 'Con sus préstamos activos, el saldo y la mora de cada uno. Sirve para ver quién te debe y quién va atrasado.' },
  ],
  '/prestamos': [
    { selector: NEW('/prestamos/nuevo'), title: 'Registrar préstamo', body: 'Crea un préstamo: monto, cuotas, valor de la cuota y frecuencia. El total a pagar se calcula solo. Sirve para que el saldo y el calendario de cobro se generen desde el primer día.' },
    { selector: SEARCH, title: 'Buscar por cliente', body: 'Encuentra los préstamos de un cliente por su nombre o cédula.' },
    { selector: labeled(LOANS_TEXT.filters.label, 'nav'), title: 'Filtrar por estado', body: 'Activos, pagados o anulados. Sirve para concentrarte en lo que todavía se está cobrando.' },
    { selector: TABLE, title: 'Tus préstamos', body: 'Cada uno con su saldo, mora y cobrador. Al abrir uno ves el calendario de cuotas, el historial de cobros y puedes registrar un cobro o asignar cobrador.' },
  ],
  '/prestamos/:id': [
    { selector: labeled(VISITS_TEXT.collect.title, 'form'), title: 'Registrar cobro', body: 'Anota qué pasó en la visita: si el cliente pagó (monto y medio), si prometió pagar otro día, si no estaba o si se negó. Un pago solo se corrige revirtiéndolo, por eso pide confirmar.' },
    { selector: '#contenido [aria-labelledby="installments-title"]', title: 'Calendario de cuotas', body: 'Cada cuota con su fecha, lo pagado y su estado. Sirve para saber exactamente qué se debe y desde cuándo.' },
    { selector: '#contenido [aria-labelledby="visits-title"]', title: 'Historial de cobros', body: 'Todas las visitas con su resultado. Si un pago se registró mal, aquí lo reviertes con su motivo.' },
  ],
  '/cobros': [
    { selector: FORM('/cobros'), title: 'Buscar y filtrar', body: 'Busca por cliente o cobrador y filtra por fechas, cobrador o resultado. Pulsa «Aplicar» para ver los cobros que pediste. Sin fechas se muestra solo hoy.' },
    { selector: TABLE, title: 'Cobros de tu equipo', body: 'Las visitas de todos tus cobradores: qué se cobró, qué se reprogramó y quién no pagó. Sirve para vigilar el trabajo en campo.' },
  ],
  '/cuadres': [
    { selector: FORM('/cuadres'), title: 'Filtros', body: 'Filtra los cuadres por fechas, cobrador o cartera. Sirve para encontrar rápido el cuadre que buscas.' },
    { selector: TABLE, title: 'Los cuadres', body: 'Lo esperado frente a lo entregado por cada cobrador. Abre uno para aprobarlo o rechazarlo con un comentario.' },
  ],
  '/notificaciones': [
    { selector: labeled(NOTIFICATIONS_TEXT.filters.label, 'nav'), title: 'Todas o sin leer', body: 'Alterna entre todas tus notificaciones y solo las que no has leído. Sirve para ponerte al día sin perderte lo importante.' },
  ],
  '/estadisticas': [
    { selector: FORM('/estadisticas'), title: 'Período, cobrador y cartera', body: 'Elige las fechas y, si quieres, un cobrador o una cartera. Todo el reporte se recalcula con ese filtro.' },
    { selector: '#contenido header button', title: 'Descargar el reporte', body: 'Baja el reporte en PDF con el filtro que elegiste. Sirve para compartirlo o guardarlo.' },
    { selector: labeled('Indicadores', 'section'), title: 'Los indicadores', body: 'Cartera en riesgo, mora, lo cobrado y la efectividad, comparados con el período anterior. Sirven para saber si vas mejorando.' },
  ],
  '/configuracion': [
    { selector: labeled(SETTINGS_TEXT.business.title, 'form'), title: 'Datos del negocio', body: 'El nombre con el que aparece tu financiera en Fiaro.' },
    { selector: labeled(SETTINGS_TEXT.brand.title, 'form'), title: 'Color de marca', body: 'Elige entre unos pocos colores para los botones y detalles de tu panel. Sirve para que Fiaro se sienta tuyo sin perder su identidad.' },
    { selector: labeled(SETTINGS_TEXT.days.title, 'form'), title: 'Días sin cobro', body: 'Los días de la semana (y los festivos) en que tus cobradores no salen. Las cuotas que caigan en uno pasan al siguiente día de cobro.' },
    { selector: labeled(SETTINGS_TEXT.portfolios.create, 'form'), title: 'Carteras', body: 'Agrupa a tus cobradores por zona o ruta. Cada cobrador pertenece a una cartera.' },
  ],
  '/cuenta': [
    { selector: labeled(ACCOUNT_TEXT.profile.title, 'form'), title: 'Tus datos', body: 'Tu nombre y tu correo de contacto. El correo sirve para recuperar tu contraseña si la olvidas.' },
    { selector: labeled(ACCOUNT_TEXT.password.title, 'form'), title: 'Cambiar la contraseña', body: 'Usa una contraseña que no uses en otro sitio. Cambiarla es la forma más rápida de proteger tu cuenta.' },
    { selector: labeled(ACCOUNT_TEXT.sessions.listLabel, 'ul'), title: 'Sesiones abiertas', body: 'Los equipos donde tienes Fiaro abierto. Si no reconoces alguno, ciérralo.' },
  ],
};

/** Quita las barras finales sin regex (evita el backtracking de `/\/+$/` con entradas largas). */
function withoutTrailingSlashes(path: string): string {
  let end = path.length;
  while (end > 0 && path[end - 1] === '/') end -= 1;
  return path.slice(0, end);
}

/** Clave de guía de una ruta: `/prestamos/abc123` → `/prestamos/:id`; las rutas de «nuevo» no tienen guía propia. */
export function guideKeyFor(pathname: string): string | null {
  const clean = withoutTrailingSlashes(pathname.split('?')[0]) || '/';
  if (clean in PAGE_GUIDES) return clean;
  const detail = /^\/(prestamos)\/(?!nuevo$)[^/]+$/.exec(clean);
  return detail ? `/${detail[1]}/:id` : null;
}
