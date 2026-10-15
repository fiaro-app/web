const SESSION_KEY = 'fiaro.session-id';
const ID_SEGMENT = /^(?:\d+|[0-9a-f]{8}-[0-9a-f-]{27})$/i;

function sessionId(): string | null {
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (id === null) {
      id = crypto.randomUUID();
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

/** La ruta de la pestaña con los ids cambiados por `[id]`: agrupa los logs por pantalla sin llevar datos. */
function screenTemplate(): string {
  return window.location.pathname
    .split('/')
    .map((part) => (ID_SEGMENT.test(part) ? '[id]' : part))
    .join('/');
}

/**
 * Cabeceras con las que el API sigue el recorrido de una persona en sus logs: `X-Session-Id` (un
 * UUID por pestaña) y `X-Client-Screen`. Solo en el navegador; en el servidor no hay pestaña.
 */
export function traceHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const id = sessionId();
  return { ...(id && { 'X-Session-Id': id }), 'X-Client-Screen': screenTemplate() };
}
