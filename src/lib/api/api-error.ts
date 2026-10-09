import type { ValidationIssue } from '@fiaro-app/contracts';

/** Códigos que genera la propia web (la API nunca los envía) cuando no hay una respuesta de error válida. */
export const CLIENT_ERROR_CODES = {
  /** No se pudo llegar a la API: sin internet, servidor caído o petición cancelada por red. */
  network: 'NETWORK_ERROR',
  /** La API respondió bien, pero el cuerpo no cumple el contrato: señal de que las versiones se desfasaron. */
  invalidResponse: 'INVALID_RESPONSE',
  /** La API respondió con un error que no tiene la forma de `ApiError`. */
  unknown: 'UNKNOWN_ERROR',
} as const;

export interface ApiRequestErrorInit {
  readonly statusCode: number;
  readonly code: string;
  readonly message: string;
  readonly issues?: readonly ValidationIssue[] | null;
  readonly retryAfterSeconds?: number | null;
}

/**
 * Error de una llamada a la API. Reúne los datos de `ApiError` (contrato) con lo que viaja en las
 * cabeceras (`Retry-After`), para que la interfaz reaccione siempre al `code` y nunca al texto.
 */
export class ApiRequestError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly issues: readonly ValidationIssue[];
  /** Segundos que pidió esperar la API (`Retry-After`), o `null` si no lo envió. */
  readonly retryAfterSeconds: number | null;

  constructor({ statusCode, code, message, issues, retryAfterSeconds }: ApiRequestErrorInit) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
    this.code = code;
    this.issues = issues ?? [];
    this.retryAfterSeconds = retryAfterSeconds ?? null;
  }

  /** Si el error trae alguno de esos códigos. */
  hasCode(...codes: readonly string[]): boolean {
    return codes.includes(this.code);
  }
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError;
}
