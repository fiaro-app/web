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

/**
 * Mensaje de un error al borrar una cartera: `CONFLICT` aquí no es un nombre repetido, sino que la
 * cartera es la de por defecto o todavía tiene cobradores activos.
 */
export function describePortfolioDeleteError(error: unknown): AuthErrorView {
  if (isApiRequestError(error)) {
    if (error.hasCode('CONFLICT')) {
      return {
        message: 'No se puede borrar: es la cartera por defecto o todavía tiene cobradores activos. Reasígnalos y vuelve a intentarlo.',
        field: null,
      };
    }
    if (error.hasCode('NOT_FOUND')) return { message: 'Esa cartera ya no existe. Actualiza la página.', field: null };
  }
  return describeSettingsError(error);
}
