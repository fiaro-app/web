import { describeAuthError, type AuthErrorView } from '@/features/auth/error-messages';
import { describePlanLimit } from '@/features/subscription/plan-limit-message';
import { isApiRequestError } from '@/lib/api';

/** Mensaje de un error al aceptar o rechazar una solicitud. Reutiliza los generales y agrega los propios. */
export function describeLoanRequestError(error: unknown): AuthErrorView {
  if (isApiRequestError(error)) {
    switch (error.code) {
      case 'CONFLICT':
        return { message: 'Esta solicitud ya fue resuelta, o ya existe un cliente con esa cédula. Actualiza la página.', field: null };
      case 'FORBIDDEN':
        return { message: 'No tienes permiso para resolver solicitudes.', field: null };
      case 'PLAN_LIMIT_REACHED':
        return { message: describePlanLimit(error.errorCode ?? 'L004A'), field: null };
      case 'SUBSCRIPTION_READ_ONLY':
        return { message: 'Tu suscripción está en modo de solo lectura. Renuévala para hacer cambios.', field: null };
      case 'NOT_FOUND':
        return { message: 'Esa solicitud ya no existe. Actualiza la página.', field: null };
      case 'VALIDATION_FAILED':
        return { message: 'Revisa los datos que ajustaste: alguno no es válido.', field: null };
      default:
        break;
    }
  }
  return describeAuthError(error);
}
