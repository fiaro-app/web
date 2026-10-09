import { describeAuthError, type AuthErrorView } from '@/features/auth/error-messages';
import { isApiRequestError } from '@/lib/api';

/**
 * Mensaje de un error al cambiar la configuración del negocio o crear una cartera. Reutiliza los
 * generales (red, límite de solicitudes…) y agrega los propios de la configuración.
 */
export function describeSettingsError(error: unknown): AuthErrorView {
  if (isApiRequestError(error)) {
    switch (error.code) {
      case 'CONFLICT':
        return { message: 'Ya tienes una cartera con ese nombre.', field: null };
      case 'FORBIDDEN':
        return { message: 'No tienes permiso para cambiar la configuración del negocio.', field: null };
      case 'SUBSCRIPTION_READ_ONLY':
        return { message: 'Tu suscripción está en modo de solo lectura. Renuévala para hacer cambios.', field: null };
      default:
        break;
    }
  }
  return describeAuthError(error);
}
