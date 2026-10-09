import { describeAuthError, type AuthErrorView } from '@/features/auth/error-messages';
import { isApiRequestError } from '@/lib/api';

/**
 * Mensaje de un error al registrar o administrar un cobrador. Reutiliza los de autenticación
 * (celular repetido, celular inválido, red…) y agrega los propios de colaboradores.
 */
export function describeCollectorError(error: unknown): AuthErrorView {
  if (isApiRequestError(error)) {
    switch (error.code) {
      case 'FORBIDDEN':
        return { message: 'No tienes permiso para administrar cobradores.', field: null };
      case 'SUBSCRIPTION_READ_ONLY':
        return { message: 'Tu suscripción está en modo de solo lectura. Renuévala para hacer cambios.', field: null };
      case 'NOT_FOUND':
        return { message: 'Ese cobrador ya no existe. Actualiza la lista.', field: null };
      case 'CONFLICT':
        return { message: 'Esa persona ya trabaja con tu negocio.', field: 'phone' };
      default:
        break;
    }
  }
  return describeAuthError(error);
}
