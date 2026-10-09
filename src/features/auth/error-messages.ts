import { contractMessage } from '@fiaro-app/contracts';
import { CLIENT_ERROR_CODES, isApiRequestError } from '@/lib/api';

/** Campo del formulario al que pertenece un error de la API, si lo hay. */
export type AuthErrorField = 'phone' | 'password' | 'nationalId' | 'fullName' | 'contactEmail' | 'businessName';

export interface AuthErrorView {
  readonly message: string;
  /** Si el error es de un campo concreto, para marcarlo; `null` si es del formulario completo. */
  readonly field: AuthErrorField | null;
}

const GENERIC_MESSAGE = 'No pudimos completar la solicitud. Inténtalo de nuevo en unos minutos.';

function waitText(seconds: number | null): string {
  if (seconds === null) return 'unos minutos';
  const minutes = Math.ceil(seconds / 60);
  return minutes <= 1 ? '1 minuto' : `${minutes} minutos`;
}

/**
 * Traduce un error de la API al mensaje que ve la persona. Se reacciona al `code` del contrato,
 * nunca al texto que mande el servidor; los códigos que no se conocen caen en un mensaje genérico.
 *
 * @param error - Lo capturado en el `catch` de una llamada a la API.
 */
export function describeAuthError(error: unknown): AuthErrorView {
  if (!isApiRequestError(error)) {
    return { message: GENERIC_MESSAGE, field: null };
  }

  switch (error.code) {
    case 'INVALID_PHONE_NUMBER_OR_PASSWORD':
      return { message: 'El celular o la contraseña no son correctos.', field: null };
    case 'SIGN_IN_LOCKED':
      return {
        message: `Demasiados intentos fallidos. Vuelve a intentarlo en ${waitText(error.retryAfterSeconds)}.`,
        field: null,
      };
    case 'RATE_LIMITED':
      return { message: `Demasiadas solicitudes. Espera ${waitText(error.retryAfterSeconds)} e inténtalo de nuevo.`, field: null };
    case 'ACCOUNT_DEACTIVATED':
      return { message: 'Tu cuenta está desactivada. Comunícate con el administrador de tu negocio.', field: null };
    case 'PHONE_ALREADY_REGISTERED':
      return { message: 'Ya existe una cuenta con ese celular. Inicia sesión o usa otro número.', field: 'phone' };
    case 'INVALID_PHONE':
      return { message: 'Ingresa un celular colombiano válido de 10 dígitos.', field: 'phone' };
    case 'PASSWORD_TOO_WEAK':
      return { message: 'Esa contraseña es muy fácil de adivinar. Elige una más larga o menos común.', field: 'password' };
    case 'INVALID_PASSWORD_LENGTH':
      return { message: 'La contraseña debe tener entre 8 y 128 caracteres.', field: 'password' };
    case 'MAINTENANCE':
      return { message: 'Fiaro está en mantenimiento. Vuelve a intentarlo en un rato.', field: null };
    case CLIENT_ERROR_CODES.network:
      return { message: 'No pudimos conectarnos. Revisa tu internet e inténtalo de nuevo.', field: null };
    default:
      return { message: GENERIC_MESSAGE, field: null };
  }
}

const SERVER_FIELDS: readonly AuthErrorField[] = ['phone', 'password', 'nationalId', 'fullName', 'contactEmail', 'businessName'];

/**
 * Errores de campo que trae un `VALIDATION_FAILED` de la API (`issues[].path[0]`). La API es la
 * última palabra en validación: si algo se le escapa a la web, sale aquí en el campo correcto, con
 * el texto del contrato traducido (`contractMessage`) o el genérico si no se conoce.
 */
export function issueFieldErrors(error: unknown): Partial<Record<AuthErrorField, string>> {
  if (!isApiRequestError(error) || error.code !== 'VALIDATION_FAILED') return {};

  const errors: Partial<Record<AuthErrorField, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    const known = SERVER_FIELDS.find((candidate) => candidate === field);
    if (known && errors[known] === undefined) {
      errors[known] = contractMessage('es', issue.message);
    }
  }
  return errors;
}
