import { callEndpoint } from '@/lib/api';
import { authEndpoints } from '@/features/auth/endpoints';
import type { AccountValues, CompanyValues } from '@/features/auth/register-schemas';
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

/**
 * Registra a un dueño y su negocio. No abre sesión (la API lo deja así a propósito): quien llama
 * inicia sesión después con el mismo celular y contraseña.
 */
export async function registerOwner({ phone, fullName, password, nationalId, contactEmail }: AccountValues, { businessName }: CompanyValues) {
  return callEndpoint(authEndpoints.register, {
    body: { phone, fullName, password, nationalId, businessName, ...(contactEmail && { contactEmail }) },
  });
}
