import {
  ApiErrorSchema,
  buildPath,
  type EndpointDefinition,
  type EndpointParams,
  type EndpointRequestBody,
  type EndpointResponse,
} from '@fiaro-app/contracts';
import { ApiRequestError, CLIENT_ERROR_CODES } from '@/lib/api/api-error';
import { traceHeaders } from '@/lib/api/trace-headers';

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
    /**
     * Parámetros de la URL (`?from=…&to=…`) de los `GET` con query. El contrato aún no los tipa:
     * los valores `undefined` o vacíos no se envían.
     */
    readonly query?: Readonly<Record<string, string | undefined>>;
    readonly signal?: AbortSignal;
    /** Origen de la API; por defecto {@link API_BASE_PATH}. Un componente de servidor pasa la URL absoluta. */
    readonly baseUrl?: string;
    /** Cabeceras extra; un componente de servidor reenvía aquí la cookie de la persona (`Cookie`). */
    readonly headers?: Readonly<Record<string, string>>;
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

function textField(body: unknown, key: string): string | null {
  if (typeof body !== 'object' || body === null) return null;
  const value = (body as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : null;
}

async function toRequestError(response: Response): Promise<ApiRequestError> {
  const json = await readJson(response);
  const parsed = ApiErrorSchema.safeParse(json);
  const errorCode = textField(json, 'errorCode');
  const requestId = textField(json, 'requestId');
  const retryAfterSeconds = parseRetryAfter(response.headers.get('Retry-After'));

  if (parsed.success) {
    const { statusCode, code, message, issues } = parsed.data;
    return new ApiRequestError({ statusCode, code, message, issues, retryAfterSeconds, errorCode, requestId });
  }
  return new ApiRequestError({
    statusCode: response.status,
    code: CLIENT_ERROR_CODES.unknown,
    message: response.statusText || 'La API respondió con un error inesperado.',
    retryAfterSeconds,
  });
}

type RawInput = {
  params?: Record<string, string>;
  body?: unknown;
  query?: Record<string, string | undefined>;
  signal?: AbortSignal;
  baseUrl?: string;
  headers?: Record<string, string>;
};

/** `?a=1&b=2` con los parámetros que traen valor; vacío si no hay ninguno. */
function buildQueryString(query: Readonly<Record<string, string | undefined>> | undefined): string {
  const search = new URLSearchParams();
  for (const [name, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== '') search.set(name, value);
  }
  const text = search.toString();
  return text === '' ? '' : `?${text}`;
}

/**
 * Envía la petición y devuelve la respuesta cruda si salió bien. Aquí viven las cabeceras comunes y
 * la traducción de las fallas (sin red, o la API respondió con error) a {@link ApiRequestError}.
 */
async function sendRequest(endpoint: EndpointDefinition, input: RawInput, accept: string): Promise<Response> {
  const { params, body, query, signal, baseUrl = API_BASE_PATH, headers } = input;
  const hasBody = body !== undefined;

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${buildPath(endpoint.path, params ?? {})}${buildQueryString(query)}`, {
      method: endpoint.method,
      headers: {
        Accept: accept,
        'Accept-Language': API_LANGUAGE,
        'API-Version': API_VERSION,
        ...traceHeaders(),
        ...(hasBody && { 'Content-Type': 'application/json' }),
        ...headers,
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
  return response;
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
  const response = await sendRequest(endpoint, input as RawInput, 'application/json');

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

/** Un archivo que devolvió la API, con el nombre que sugirió (`Content-Disposition`), si lo hizo. */
export interface DownloadedFile {
  readonly blob: Blob;
  readonly filename: string | null;
}

const FILENAME_PATTERN = /filename="?([^";]+)"?/i;

/**
 * Igual que {@link callEndpoint}, pero para los endpoints que devuelven un archivo (p. ej. un PDF)
 * en vez de JSON: no valida la respuesta contra un schema, devuelve el contenido y su nombre.
 *
 * @throws {@link ApiRequestError} Igual que `callEndpoint` si la API responde con error o no hay red.
 */
export async function callEndpointForFile<const TEndpoint extends EndpointDefinition>(
  endpoint: TEndpoint,
  input: CallEndpointInput<TEndpoint>,
  accept = 'application/pdf',
): Promise<DownloadedFile> {
  const response = await sendRequest(endpoint, input as RawInput, accept);
  const disposition = response.headers.get('Content-Disposition');
  return { blob: await response.blob(), filename: disposition?.match(FILENAME_PATTERN)?.[1] ?? null };
}
