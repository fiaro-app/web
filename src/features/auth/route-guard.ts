/** A dónde va una persona con sesión cuando entra a una página que solo es para quien no la tiene. */
export const DEFAULT_AUTHENTICATED_PATH = '/resumen';
export const LOGIN_PATH = '/login';
export const REGISTER_PATH = '/registro';
export const CHANGE_PASSWORD_PATH = '/cambiar-contrasena';

/** Páginas abiertas a cualquiera, con o sin sesión. Todo lo demás exige sesión. */
const PUBLIC_PATHS: readonly string[] = ['/', '/contacto', '/recuperar-contrasena', '/design-system'];

/** Páginas que solo tienen sentido sin sesión: con una, se manda a la persona a su panel. */
const GUEST_ONLY_PATHS: readonly string[] = [LOGIN_PATH, REGISTER_PATH];

export type AccessDecision =
  | { readonly action: 'next' }
  | { readonly action: 'redirect'; readonly to: string };

function matches(pathname: string, paths: readonly string[]): boolean {
  return paths.some((path) => pathname === path || (path !== '/' && pathname.startsWith(`${path}/`)));
}

/** Origen ficticio contra el que se resuelve un `next` para comprobar que no se sale del sitio. */
const PROBE_ORIGIN = 'https://fiaro.invalid';

/** Espacios, tabuladores, saltos de línea y otros caracteres de control: los navegadores los ignoran al navegar y permiten `/\t/host`. */
const CONTROL_OR_SPACE = /[\u0000-\u0020\u007f-\u009f]/;

/**
 * Deja un `next` solo si es una ruta interna (`/clientes?x=1`): rechaza URLs absolutas, `//host`, `\` y
 * cualquier espacio o carácter de control (`/%09/evil.com` se vuelve `//evil.com` en el navegador) y, como
 * última barrera, comprueba que resuelto contra el propio sitio siga en su mismo origen.
 */
export function sanitizeNextPath(candidate: string | null | undefined): string | null {
  if (!candidate?.startsWith('/') || candidate.startsWith('//') || candidate.includes('\\') || CONTROL_OR_SPACE.test(candidate)) {
    return null;
  }
  try {
    return new URL(candidate, PROBE_ORIGIN).origin === PROBE_ORIGIN ? candidate : null;
  } catch {
    return null;
  }
}

/**
 * Decide qué hacer con una petición de página según haya o no cookie de sesión. Es un chequeo
 * optimista (evita mostrar una pantalla privada a quien no tiene sesión); la autorización real
 * la hace la API en cada llamada.
 *
 * @param pathname - Ruta pedida, sin dominio.
 * @param search - Query string de la petición, con `?` o vacío; se conserva en `next`.
 */
export function resolveAccess({
  pathname,
  search = '',
  hasSession,
}: {
  readonly pathname: string;
  readonly search?: string;
  readonly hasSession: boolean;
}): AccessDecision {
  if (matches(pathname, PUBLIC_PATHS)) {
    return { action: 'next' };
  }
  if (matches(pathname, GUEST_ONLY_PATHS)) {
    return hasSession ? { action: 'redirect', to: DEFAULT_AUTHENTICATED_PATH } : { action: 'next' };
  }
  if (hasSession) {
    return { action: 'next' };
  }
  const next = sanitizeNextPath(`${pathname}${search}`);
  return {
    action: 'redirect',
    to: next ? `${LOGIN_PATH}?next=${encodeURIComponent(next)}` : LOGIN_PATH,
  };
}
