import { describeAuthError, type AuthErrorView } from '@/features/auth/error-messages';
import { isApiRequestError } from '@/lib/api';

/**
 * Mensaje de un error al cambiar los datos de la cuenta, verificar el correo o cerrar sesiones.
 * Agrega los códigos propios de la cuenta a los generales de `describeAuthError`.
 */
export function describeAccountError(error: unknown): AuthErrorView {
  if (isApiRequestError(error)) {
    switch (error.code) {
      case 'CONTACT_EMAIL_NOT_SET':
        return { message: 'Primero agrega un correo de contacto.', field: 'contactEmail' };
      case 'CONTACT_EMAIL_ALREADY_VERIFIED':
        return { message: 'Tu correo ya está verificado.', field: null };
      case 'CONTACT_EMAIL_VERIFICATION_CODE_INVALID':
        return { message: 'El código no es correcto. Revísalo e inténtalo de nuevo.', field: 'code' };
      case 'CONTACT_EMAIL_VERIFICATION_CODE_EXPIRED':
        return { message: 'El código venció. Pide uno nuevo.', field: 'code' };
      default:
        break;
    }
  }
  return describeAuthError(error);
}
