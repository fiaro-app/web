import {
  ApiErrorSchema,
  buildPath,
  type EndpointDefinition,
  type EndpointParams,
  type EndpointRequestBody,
  type EndpointResponse,
} from '@fiaro-app/contracts';
import { ApiRequestError, CLIENT_ERROR_CODES } from '@/lib/api/api-error';

/**
 * Prefijo bajo el que `next.config.ts` reenvía las peticiones a la API (`rewrites`). Así el
 * navegador habla siempre con el origen de la web: la cookie de sesión es de primera parte y no
 * hay CORS ni cookies de terceros de por medio.
 */
export const API_BASE_PATH = '/api';

/** Versión del contrato HTTP que pide la web (cabecera `API-Version`). */
export const API_VERSION = '1';

const API_LANGUAGE = 'es';

type OptionalWhenEmpty<TKey extends string, TValue> = [TValue] extends [undefined]
  ? { readonly [K in TKey]?: undefined }
  : { readonly [K in TKey]: TValue };

/** Lo que se envía a un endpoint: parámetros de ruta y body solo si el contrato los declara. */
export type CallEndpointInput<TEndpoint extends EndpointDefinition> = OptionalWhenEmpty<
  'params',
  keyof EndpointParams<TEndpoint> extends never ? undefined : EndpointParams<TEndpoint>
> &
  OptionalWhenEmpty<'body', EndpointRequestBody<TEndpoint>> & {
    readonly signal?: AbortSignal;
    /** Origen de la API; por defecto {@link API_BASE_PATH}. Un componente de servidor pasa la URL absoluta. */
    readonly baseUrl?: string;
  };

function parseRetryAfter(header: string | null): number | null {
  if (header === null) return null;
  const seconds = Number.parseInt(header, 10);
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (text === '') return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

async function toRequestError(response: Response): Promise<ApiRequestError> {
  const parsed = ApiErrorSchema.safeParse(await readJson(response));
  const retryAfterSeconds = parseRetryAfter(response.headers.get('Retry-After'));

  if (parsed.success) {
    const { statusCode, code, message, issues } = parsed.data;
    return new ApiRequestError({ statusCode, code, message, issues, retryAfterSeconds });
  }
  return new ApiRequestError({
    statusCode: response.status,
    code: CLIENT_ERROR_CODES.unknown,
    message: response.statusText || 'La API respondió con un error inesperado.',
    retryAfterSeconds,
  });
}

/**
 * Llama a un endpoint declarado con `defineEndpoint` y devuelve su respuesta ya validada con el
 * schema del contrato. Es el único punto por el que la web habla con la API: así método, ruta,
 * cabeceras, errores y validación de la respuesta se resuelven una sola vez.
 *
 * @throws {@link ApiRequestError} Si la API responde con error (`code` del contrato), si no hay
 * conexión (`NETWORK_ERROR`) o si la respuesta no cumple el contrato (`INVALID_RESPONSE`).
 *
 * @example
 * const { user } = await callEndpoint(authEndpoints.signIn, { body: { phoneNumber, password } });
 */
export async function callEndpoint<const TEndpoint extends EndpointDefinition>(
  endpoint: TEndpoint,
  input: CallEndpointInput<TEndpoint>,
): Promise<EndpointResponse<TEndpoint>> {
  const { params, body, signal, baseUrl = API_BASE_PATH } = input as {
    params?: Record<string, string>;
    body?: unknown;
    signal?: AbortSignal;
    baseUrl?: string;
  };
  const hasBody = body !== undefined;

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${buildPath(endpoint.path, params ?? {})}`, {
      method: endpoint.method,
      headers: {
        Accept: 'application/json',
        'Accept-Language': API_LANGUAGE,
        'API-Version': API_VERSION,
        ...(hasBody && { 'Content-Type': 'application/json' }),
      },
      body: hasBody ? JSON.stringify(body) : undefined,
      credentials: 'same-origin',
      signal,
    });
  } catch (cause) {
    if (signal?.aborted) throw cause;
    throw new ApiRequestError({
      statusCode: 0,
      code: CLIENT_ERROR_CODES.network,
      message: 'No se pudo conectar con el servidor.',
    });
  }

  if (!response.ok) {
    throw await toRequestError(response);
  }

  const result = endpoint.response.safeParse(await readJson(response));
  if (!result.success) {
    throw new ApiRequestError({
      statusCode: response.status,
      code: CLIENT_ERROR_CODES.invalidResponse,
      message: 'La respuesta de la API no cumple el contrato.',
    });
  }
  return result.data as EndpointResponse<TEndpoint>;
}
