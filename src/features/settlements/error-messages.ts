import { describeAuthError, type AuthErrorView } from '@/features/auth/error-messages';
import { isApiRequestError } from '@/lib/api';

/**
 * Mensaje de un error al revisar un cuadre. Reutiliza los generales (red, límite de solicitudes…)
 * y agrega los propios de cuadres.
 */
export function describeSettlementError(error: unknown): AuthErrorView {
  if (isApiRequestError(error)) {
    switch (error.code) {
      case 'CONFLICT':
        return { message: 'Este cuadre ya fue revisado. Actualiza la página para ver su estado.', field: null };
      case 'FORBIDDEN':
        return { message: 'No tienes permiso para revisar cuadres.', field: null };
      case 'SUBSCRIPTION_READ_ONLY':
        return { message: 'Tu suscripción está en modo de solo lectura. Renuévala para hacer cambios.', field: null };
      case 'NOT_FOUND':
        return { message: 'Ese cuadre ya no existe. Vuelve a la lista.', field: null };
      case 'VALIDATION_FAILED':
        return { message: 'El comentario no es válido. Acórtalo e inténtalo de nuevo.', field: null };
      default:
        break;
    }
  }
  return describeAuthError(error);
}
