import { describeAuthError, type AuthErrorView } from '@/features/auth/error-messages';
import { isApiRequestError } from '@/lib/api';

/**
 * Mensaje de un error al crear o editar un cliente. Reutiliza los generales (red, límite de
 * solicitudes…) y agrega los propios de clientes.
 */
export function describeClientError(error: unknown): AuthErrorView {
  if (isApiRequestError(error)) {
    switch (error.code) {
      case 'CLIENT_NATIONAL_ID_TAKEN':
        return { message: 'Ya tienes un cliente con esa cédula.', field: 'nationalId' };
      case 'FORBIDDEN':
        return { message: 'No tienes permiso para administrar clientes.', field: null };
      case 'SUBSCRIPTION_READ_ONLY':
        return { message: 'Tu suscripción está en modo de solo lectura. Renuévala para hacer cambios.', field: null };
      case 'NOT_FOUND':
        return { message: 'Ese cliente ya no existe. Actualiza la lista.', field: null };
      default:
        break;
    }
  }
  return describeAuthError(error);
}
