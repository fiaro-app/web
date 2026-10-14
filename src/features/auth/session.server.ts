import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { authEndpoints, type AuthUser } from '@/features/auth/endpoints';
import { LOGIN_PATH } from '@/features/auth/route-guard';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/**
 * Persona con sesión vigente, o `null`. Es la comprobación **autoritativa**: reenvía la cookie a la
 * API, que decide si la sesión vale (el `proxy` solo mira que la cookie exista). Se memoiza por
 * petición para que el layout y la página no la pidan dos veces.
 *
 * @throws Cualquier error que no sea "sin sesión" (API caída, respuesta fuera de contrato): no se
 * confunde una falla con una sesión vencida para no mandar a login a quien sí tiene sesión.
 */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const cookieHeader = (await cookies()).toString();
  if (cookieHeader === '') return null;

  try {
    const session = await callEndpointAsUser(authEndpoints.getSession, {});
    return session?.user ?? null;
  } catch (error) {
    if (isApiRequestError(error) && error.statusCode === 401) return null;
    throw error;
  }
});

/** Igual que {@link getCurrentUser}, pero manda a iniciar sesión si no hay una. */
export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect(LOGIN_PATH);
  return user;
}
