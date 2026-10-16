import { describeAuthError, type AuthErrorView } from '@/features/auth/error-messages';
import { describePlanLimit } from '@/features/subscription/plan-limit-message';
import { isApiRequestError } from '@/lib/api';

/** Mensaje de un error al invitar o cambiar a un administrador. Reutiliza los generales y agrega los propios. */
export function describeAdminError(error: unknown): AuthErrorView {
  if (isApiRequestError(error)) {
    switch (error.code) {
      case 'FORBIDDEN':
        return { message: 'No tienes permiso para administrar administradores, o intentaste cambiar tu propio acceso.', field: null };
      case 'PLAN_LIMIT_REACHED':
        return { message: describePlanLimit(error.errorCode ?? 'M007A'), field: null };
      case 'SUBSCRIPTION_READ_ONLY':
        return { message: 'Tu suscripción está en modo de solo lectura. Renuévala para hacer cambios.', field: null };
      case 'NOT_FOUND':
        return { message: 'Esa persona ya no existe. Actualiza la lista.', field: null };
      case 'CONFLICT':
        return { message: 'Esa persona ya trabaja con tu negocio.', field: 'phone' };
      case 'COLLABORATOR_NATIONAL_ID_TAKEN':
        return { message: 'Ya hay un colaborador con esa cédula en tu negocio.', field: 'nationalId' };
      case 'VALIDATION_FAILED':
        return { message: 'No se puede cambiar el acceso del dueño del negocio.', field: null };
      default:
        break;
    }
  }
  return describeAuthError(error);
}
