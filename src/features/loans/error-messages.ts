import { describeAuthError, type AuthErrorView } from '@/features/auth/error-messages';
import { describePlanLimit } from '@/features/subscription/plan-limit-message';
import { isApiRequestError } from '@/lib/api';

/**
 * Mensaje de un error al crear o anular un préstamo. Reutiliza los generales (red, límite de
 * solicitudes…) y agrega los propios de préstamos.
 */
export function describeLoanError(error: unknown): AuthErrorView {
  if (isApiRequestError(error)) {
    switch (error.code) {
      case 'LOAN_NOT_CANCELABLE':
        return { message: 'Este préstamo ya no se puede anular porque dejó de estar activo.', field: null };
      case 'FORBIDDEN':
        return { message: 'No tienes permiso para administrar préstamos.', field: null };
      case 'PLAN_LIMIT_REACHED':
        return { message: describePlanLimit(error.errorCode ?? 'L004A'), field: null };
      case 'SUBSCRIPTION_READ_ONLY':
        return { message: 'Tu suscripción está en modo de solo lectura. Renuévala para hacer cambios.', field: null };
      case 'NOT_FOUND':
        return { message: 'Ese préstamo, su cliente o el cobrador ya no existe. Actualiza la página.', field: null };
      default:
        break;
    }
  }
  return describeAuthError(error);
}
