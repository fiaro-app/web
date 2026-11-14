import { describeAuthError, type AuthErrorView } from '@/features/auth/error-messages';
import { describePlanLimit } from '@/features/subscription/plan-limit-message';
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
      case 'COLLABORATOR_NATIONAL_ID_TAKEN':
        return { message: 'Ya hay un colaborador con esa cédula en tu negocio.', field: 'nationalId' };
      case 'PLAN_LIMIT_REACHED':
        return { message: describePlanLimit(error.errorCode ?? 'M003A'), field: null };
      case 'COLLECTOR_HAS_HISTORY':
        return { message: 'Este cobrador ya tiene historial: dalo de baja en lugar de borrarlo.', field: null };
      default:
        break;
    }
  }
  return describeAuthError(error);
}
