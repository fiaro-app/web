import 'server-only';
import type { EndpointDefinition, EndpointResponse } from '@fiaro-app/contracts';
import { cookies } from 'next/headers';
import { resolveApiUrl } from '@/lib/api-url';
import { callEndpoint, type CallEndpointInput } from '@/lib/api/call-endpoint';

/**
 * Llama a la API **desde un componente de servidor, en nombre de quien hace la petición**: va
 * directo al origen de la API y reenvía la cookie de sesión. Es la forma de traer datos privados
 * al renderizar una página.
 *
 * @throws {@link ApiRequestError} Igual que `callEndpoint`; con sesión vencida es un 401.
 */
export async function callEndpointAsUser<const TEndpoint extends EndpointDefinition>(
  endpoint: TEndpoint,
  input: Omit<CallEndpointInput<TEndpoint>, 'baseUrl' | 'headers'>,
): Promise<EndpointResponse<TEndpoint>> {
  const cookieHeader = (await cookies()).toString();
  return callEndpoint(endpoint, {
    ...input,
    baseUrl: resolveApiUrl(),
    headers: { Cookie: cookieHeader },
  } as CallEndpointInput<TEndpoint>);
}
