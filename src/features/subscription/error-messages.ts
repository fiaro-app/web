import { describeAuthError, type AuthErrorView } from '@/features/auth/error-messages';
import { isApiRequestError } from '@/lib/api';

/** Mensaje de un error al empezar un pago. Reutiliza los generales (red, límite de solicitudes…) y agrega los del pago. */
export function describeCheckoutError(error: unknown): AuthErrorView {
  if (isApiRequestError(error)) {
    switch (error.code) {
      case 'FORBIDDEN':
        return { message: 'Solo la dueña del negocio puede pagar el plan.', field: null };
      case 'BILLING_UNAVAILABLE':
        return { message: 'El pago en línea no está disponible por ahora. Escríbenos y te ayudamos a activar tu plan.', field: null };
      default:
        break;
    }
  }
  return describeAuthError(error);
}
