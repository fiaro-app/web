import { describeAuthError, type AuthErrorView } from '@/features/auth/error-messages';
import { isApiRequestError } from '@/lib/api';

/** Mensaje de un error al exportar las estadísticas; reutiliza los generales (red, límite de solicitudes…). */
export function describeStatsError(error: unknown): AuthErrorView {
  if (isApiRequestError(error)) {
    switch (error.code) {
      case 'FORBIDDEN':
        return { message: 'No tienes permiso para exportar las estadísticas.', field: null };
      case 'VALIDATION_FAILED':
        return { message: 'El período o los filtros no son válidos. Revísalos e inténtalo de nuevo.', field: null };
      default:
        break;
    }
  }
  return describeAuthError(error);
}
