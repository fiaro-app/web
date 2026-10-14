import { NextResponse, type NextRequest } from 'next/server';
import { resolveAccess } from '@/features/auth/route-guard';
import { SESSION_COOKIE_NAMES } from '@/features/auth/session-cookie';

/** Chequeo optimista de sesión antes de servir una página (ver `route-guard.ts`). */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const decision = resolveAccess({
    pathname,
    search,
    hasSession: SESSION_COOKIE_NAMES.some((name) => request.cookies.has(name)),
  });

  if (decision.action === 'redirect') {
    return NextResponse.redirect(new URL(decision.to, request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Páginas: no pasan por aquí la API (`/api`), archivos de Next, recursos de metadatos/iconos ni estáticos (con punto).
  matcher: [
    '/((?!api|_next/static|_next/image|favicon[.]ico|icon|apple-icon|opengraph-image|twitter-image|manifest[.]webmanifest|.*[.].*).*)',
  ],
};
