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
 * que el navegador nunca habla directo con otro dominio. La única excepción es el almacenamiento de
 * archivos (`STORAGE_ORIGIN`): el logo se sube directo con una URL firmada y se muestra desde ahí.
 */
export function buildContentSecurityPolicy({
  isDevelopment,
  storageOrigin = null,
}: {
  readonly isDevelopment: boolean;
  /** Origen del almacenamiento de archivos (logos): se permite para mostrar las imágenes y subirlas. */
  readonly storageOrigin?: string | null;
}): string {
  const directives: Record<string, readonly string[]> = {
    'default-src': ["'self'"],
    // React usa eval para reconstruir errores del servidor en desarrollo; en producción no hace falta.
    'script-src': ["'self'", "'unsafe-inline'", ...(isDevelopment ? ["'unsafe-eval'"] : [])],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', ...(storageOrigin ? [storageOrigin] : [])],
    'font-src': ["'self'"],
    // El recargado en caliente de desarrollo usa WebSocket.
    'connect-src': ["'self'", ...(storageOrigin ? [storageOrigin] : []), ...(isDevelopment ? ['ws:', 'wss:'] : [])],
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
export function buildSecurityHeaders({
  isDevelopment,
  storageOrigin = null,
}: {
  readonly isDevelopment: boolean;
  readonly storageOrigin?: string | null;
}): readonly HeaderEntry[] {
  return [
    { key: 'Content-Security-Policy', value: buildContentSecurityPolicy({ isDevelopment, storageOrigin }) },
    // Solo HTTPS durante 2 años, subdominios incluidos; en desarrollo sobre HTTP se omite para evitar advertencias del navegador.
    ...(isDevelopment
      ? []
      : [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]),
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    // Nadie más puede incrustar los recursos de la web (scripts, imágenes, datos) desde otro sitio.
    { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
    // La web no usa ninguna de estas capacidades: se cierran para que ningún script las pida.
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  ];
}

/** Rutas con datos de la persona: ni el navegador ni un proxy deben guardarlas. */
export const NO_STORE_SOURCES: readonly string[] = [
  '/resumen/:path*',
  '/cobradores/:path*',
  '/clientes/:path*',
  '/prestamos/:path*',
  '/cobros/:path*',
  '/cuadres/:path*',
  '/notificaciones/:path*',
  '/estadisticas/:path*',
  '/configuracion/:path*',
  '/cuenta/:path*',
  '/cambiar-contrasena',
  '/login',
  '/registro',
  '/recuperar-contrasena',
];

export const NO_STORE_HEADER: HeaderEntry = { key: 'Cache-Control', value: 'private, no-store' };

/** Equipos locales: el único caso donde se admite `http:` (un almacenamiento de pruebas). */
const LOCAL_HOSTS: readonly string[] = ['localhost', '127.0.0.1', '[::1]'];

/**
 * Origen válido de `STORAGE_ORIGIN` (`https://cdn.fiaro.co`): `https` y sin ruta; `http` solo para un equipo
 * local. Cualquier otro valor (vacío, mal escrito, otro protocolo, `http` hacia internet) se ignora para no
 * abrir la CSP a algo inesperado ni permitir imágenes por un canal sin cifrar.
 */
export function parseStorageOrigin(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const secure = url.protocol === 'https:';
    const local = url.protocol === 'http:' && LOCAL_HOSTS.includes(url.hostname);
    return secure || local ? url.origin : null;
  } catch {
    return null;
  }
}
