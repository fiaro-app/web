export interface HeaderEntry {
  readonly key: string;
  readonly value: string;
}

/**
 * Política de contenido (CSP). Sin nonce a propósito: un nonce obliga a renderizar cada página en
 * cada petición y las páginas públicas (landing) dejarían de ser estáticas y cacheables. A cambio
 * se permiten los scripts en línea que Next inyecta, pero todo lo demás queda cerrado: sin
 * `eval` en producción, solo recursos propios, sin `<object>`, sin ser embebida (`frame-ancestors`)
 * y formularios solo hacia sí misma.
 *
 * `connect-src 'self'`: la web llama siempre a su propio origen (`/api` se reenvía a la API), así
 * que el navegador nunca habla directo con otro dominio.
 */
export function buildContentSecurityPolicy({ isDevelopment }: { readonly isDevelopment: boolean }): string {
  const directives: Record<string, readonly string[]> = {
    'default-src': ["'self'"],
    // React usa eval para reconstruir errores del servidor en desarrollo; en producción no hace falta.
    'script-src': ["'self'", "'unsafe-inline'", ...(isDevelopment ? ["'unsafe-eval'"] : [])],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:'],
    'font-src': ["'self'"],
    // El recargado en caliente de desarrollo usa WebSocket.
    'connect-src': ["'self'", ...(isDevelopment ? ['ws:', 'wss:'] : [])],
    'manifest-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    ...(isDevelopment ? {} : { 'upgrade-insecure-requests': [] }),
  };

  return Object.entries(directives)
    .map(([name, sources]) => [name, ...sources].join(' '))
    .join('; ');
}

/** Cabeceras de seguridad para todas las respuestas. */
export function buildSecurityHeaders({ isDevelopment }: { readonly isDevelopment: boolean }): readonly HeaderEntry[] {
  return [
    { key: 'Content-Security-Policy', value: buildContentSecurityPolicy({ isDevelopment }) },
    // Solo HTTPS durante 2 años, subdominios incluidos; el navegador ignora esto sobre HTTP.
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    // La web no usa ninguna de estas capacidades: se cierran para que ningún script las pida.
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  ];
}

/** Rutas con datos de la persona: ni el navegador ni un proxy deben guardarlas. */
export const NO_STORE_SOURCES: readonly string[] = ['/resumen/:path*', '/login', '/registro'];

export const NO_STORE_HEADER: HeaderEntry = { key: 'Cache-Control', value: 'private, no-store' };
