import { accountEndpoints } from '@/features/account/endpoints';
import { callEndpoint } from '@/lib/api';

/** Cambia el nombre y/o el correo de contacto (`null` quita el correo). Devuelve el perfil resultante. */
export function updateProfile(changes: { readonly fullName?: string; readonly contactEmail?: string | null }) {
  return callEndpoint(accountEndpoints.updateProfile, { body: changes });
}

/** Manda un código de verificación al correo de contacto. */
export function requestContactEmailVerification() {
  return callEndpoint(accountEndpoints.requestContactEmailVerification, {});
}

/** Verifica el correo de contacto con el código recibido. */
export function verifyContactEmail(code: string) {
  return callEndpoint(accountEndpoints.verifyContactEmail, { body: { code } });
}

/** Desactiva la cuenta; la contraseña actual confirma la acción. */
export function deactivateAccount(password: string) {
  return callEndpoint(accountEndpoints.deactivate, { body: { password } });
}

/** Cierra las demás sesiones de la persona y deja la de este navegador. */
export function revokeOtherSessions() {
  return callEndpoint(accountEndpoints.revokeOtherSessions, {});
}

/** Cierra todas las sesiones, incluida la de este navegador. */
export function revokeAllSessions() {
  return callEndpoint(accountEndpoints.revokeSessions, {});
}

/** Cierra una sesión puntual de la persona (distinta de la actual). */
export function revokeSession(id: string) {
  return callEndpoint(accountEndpoints.revokeSession, { params: { id } });
}
