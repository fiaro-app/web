import { callEndpoint } from '@/lib/api';
import { authEndpoints } from '@/features/auth/endpoints';
import type { SignInFormValues } from '@/features/auth/schemas';

/** Inicia sesión. La API deja la sesión en la cookie; devuelve la persona autenticada. */
export async function signIn({ phone, password }: SignInFormValues) {
  const { user } = await callEndpoint(authEndpoints.signIn, { body: { phoneNumber: phone, password } });
  return user;
}

/** Cierra la sesión de este navegador. */
export async function signOut(): Promise<void> {
  await callEndpoint(authEndpoints.signOut, {});
}
