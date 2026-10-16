import { LEGAL_VERSION } from '@/content/legal';
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
export async function registerOwner(
  { phone, fullName, password, nationalId, contactEmail }: AccountValues,
  { businessName }: CompanyValues,
  marketingConsent: boolean,
  turnstileToken?: string,
) {
  return callEndpoint(authEndpoints.register, {
    body: {
      phone,
      fullName,
      password,
      nationalId,
      businessName,
      acceptedTerms: true,
      acceptedPrivacy: true,
      acceptedDataResponsibility: true,
      marketingConsent,
      legalVersion: LEGAL_VERSION,
      ...(contactEmail && { contactEmail }),
      ...(turnstileToken && { turnstileToken }),
    },
  });
}

/**
 * Pide un código para recuperar la contraseña. La API responde lo mismo exista o no la cuenta y
 * tenga o no correo (no revela qué celulares están registrados), así que un éxito no garantiza que
 * se haya mandado nada.
 */
export async function requestPasswordReset(phone: string, turnstileToken?: string): Promise<void> {
  await callEndpoint(authEndpoints.requestPasswordReset, { body: { phoneNumber: phone, ...(turnstileToken && { turnstileToken }) } });
}

/** Canjea el código por una contraseña nueva. La API cierra todas las sesiones de la persona. */
export async function resetPassword({ phone, code, newPassword }: { phone: string; code: string; newPassword: string }): Promise<void> {
  await callEndpoint(authEndpoints.resetPassword, { body: { phoneNumber: phone, code, newPassword } });
}

/** Cambia la contraseña con la sesión abierta; la API deja una sesión nueva en la cookie. */
export async function changePassword({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) {
  const { user } = await callEndpoint(authEndpoints.changePassword, { body: { currentPassword, newPassword } });
  return user;
}
