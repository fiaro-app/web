import { defineEndpoint } from '@fiaro-app/contracts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { ApiRequestError, CLIENT_ERROR_CODES } from './api-error';
import { API_BASE_PATH, API_VERSION, callEndpoint, callEndpointForFile } from './call-endpoint';

const getThing = defineEndpoint({
  method: 'GET',
  path: '/things/:id',
  summary: 'Una cosa.',
  response: z.object({ name: z.string() }),
});

const createThing = defineEndpoint({
  method: 'POST',
  path: '/things',
  summary: 'Crea una cosa.',
  body: z.object({ name: z.string() }),
  response: z.object({ id: z.string() }),
});

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

const API_ERROR = {
  statusCode: 409,
  code: 'PHONE_ALREADY_REGISTERED',
  message: 'Ya existe una cuenta con ese celular.',
  path: '/register',
  timestamp: '2026-10-09T12:00:00.000Z',
  issues: null,
};

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

describe('callEndpoint', () => {
  it('builds the URL from the path params and sends the API headers', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ name: 'Una' }));

    const result = await callEndpoint(getThing, { params: { id: 'a b' } });

    expect(result).toEqual({ name: 'Una' });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe(`${API_BASE_PATH}/things/a%20b`);
    expect(init).toMatchObject({ method: 'GET', credentials: 'same-origin', body: undefined });
    expect(init?.headers).toMatchObject({
      Accept: 'application/json',
      'Accept-Language': 'es',
      'API-Version': API_VERSION,
    });
    expect(init?.headers).not.toHaveProperty('Content-Type');
  });

  it('sends the body as JSON', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: '1' }, { status: 201 }));

    await callEndpoint(createThing, { body: { name: 'Nueva' } });

    const [, init] = fetchMock.mock.calls[0]!;
    expect(init?.body).toBe('{"name":"Nueva"}');
    expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
  });

  it('uses the given base URL, for server components', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ name: 'x' }));

    await callEndpoint(getThing, { params: { id: '1' }, baseUrl: 'https://api.fiaro.co' });

    expect(fetchMock.mock.calls[0]![0]).toBe('https://api.fiaro.co/things/1');
  });

  it('adds the extra headers, for example the forwarded session cookie', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ name: 'x' }));

    await callEndpoint(getThing, { params: { id: '1' }, headers: { Cookie: 'fiaro.session_token=abc' } });

    expect(fetchMock.mock.calls[0]![1]?.headers).toMatchObject({
      Cookie: 'fiaro.session_token=abc',
      Accept: 'application/json',
    });
  });

  it('turns an ApiError body into an ApiRequestError with its code, issues and Retry-After', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { ...API_ERROR, statusCode: 429, code: 'SIGN_IN_LOCKED', issues: [{ path: ['phone'], message: 'm' }] },
        { status: 429, headers: { 'Retry-After': '300' } },
      ),
    );

    const error = await callEndpoint(createThing, { body: { name: 'x' } }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error).toMatchObject({
      statusCode: 429,
      code: 'SIGN_IN_LOCKED',
      retryAfterSeconds: 300,
      issues: [{ path: ['phone'], message: 'm' }],
    });
  });

  it('ignores a Retry-After that is not a number', async () => {
    fetchMock.mockResolvedValue(jsonResponse(API_ERROR, { status: 409, headers: { 'Retry-After': 'pronto' } }));

    const error = await callEndpoint(createThing, { body: { name: 'x' } }).catch((e: unknown) => e);

    expect(error).toMatchObject({ code: 'PHONE_ALREADY_REGISTERED', retryAfterSeconds: null });
  });

  it('reports UNKNOWN_ERROR when the error body is not an ApiError', async () => {
    fetchMock.mockResolvedValue(new Response('<html>Bad Gateway</html>', { status: 502, statusText: 'Bad Gateway' }));

    const error = await callEndpoint(createThing, { body: { name: 'x' } }).catch((e: unknown) => e);

    expect(error).toMatchObject({ statusCode: 502, code: CLIENT_ERROR_CODES.unknown, message: 'Bad Gateway' });
  });

  it('reports NETWORK_ERROR when the request cannot be made', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    const error = await callEndpoint(getThing, { params: { id: '1' } }).catch((e: unknown) => e);

    expect(error).toMatchObject({ statusCode: 0, code: CLIENT_ERROR_CODES.network });
  });

  it('lets an aborted request fail with its own error, not as a network problem', async () => {
    const controller = new AbortController();
    const abortError = new DOMException('Aborted', 'AbortError');
    fetchMock.mockImplementation(() => {
      controller.abort();
      return Promise.reject(abortError);
    });

    await expect(callEndpoint(getThing, { params: { id: '1' }, signal: controller.signal })).rejects.toBe(abortError);
  });

  it('reports INVALID_RESPONSE when the success body does not match the contract', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ nombre: 'sin contrato' }));

    const error = await callEndpoint(getThing, { params: { id: '1' } }).catch((e: unknown) => e);

    expect(error).toMatchObject({ code: CLIENT_ERROR_CODES.invalidResponse });
  });

  it('reports INVALID_RESPONSE when the success body is empty or not JSON', async () => {
    fetchMock.mockResolvedValueOnce(new Response('', { status: 200 }));
    fetchMock.mockResolvedValueOnce(new Response('no es json', { status: 200 }));

    await expect(callEndpoint(getThing, { params: { id: '1' } })).rejects.toMatchObject({
      code: CLIENT_ERROR_CODES.invalidResponse,
    });
    await expect(callEndpoint(getThing, { params: { id: '1' } })).rejects.toMatchObject({
      code: CLIENT_ERROR_CODES.invalidResponse,
    });
  });
});

const exportThing = defineEndpoint({
  method: 'QUERY',
  path: '/things/export',
  summary: 'Exporta las cosas a un archivo.',
  body: z.object({ format: z.literal('pdf') }),
  response: z.unknown(),
});

describe('callEndpointForFile', () => {
  it('asks for the file type and returns the content with the name the API suggests', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('%PDF-1.7', {
        status: 200,
        headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="estadisticas-2026-10-01-a-2026-10-09.pdf"' },
      }),
    );

    const file = await callEndpointForFile(exportThing, { body: { format: 'pdf' } });

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe(`${API_BASE_PATH}/things/export`);
    expect(init).toMatchObject({ method: 'QUERY', headers: expect.objectContaining({ Accept: 'application/pdf', 'API-Version': API_VERSION }) });
    expect(await file.blob.text()).toBe('%PDF-1.7');
    expect(file.filename).toBe('estadisticas-2026-10-01-a-2026-10-09.pdf');
  });

  it('has no filename when the API does not suggest one', async () => {
    fetchMock.mockResolvedValueOnce(new Response('x', { status: 200 }));
    expect((await callEndpointForFile(exportThing, { body: { format: 'pdf' } })).filename).toBeNull();
  });

  it('throws the contract error when the API refuses', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ...API_ERROR, statusCode: 403, code: 'FORBIDDEN' }, { status: 403 }));
    await expect(callEndpointForFile(exportThing, { body: { format: 'pdf' } })).rejects.toMatchObject({ code: 'FORBIDDEN', statusCode: 403 });
  });

  it('reports NETWORK_ERROR when there is no connection', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    const error = await callEndpointForFile(exportThing, { body: { format: 'pdf' } }).catch((failure: unknown) => failure);
    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error).toMatchObject({ code: CLIENT_ERROR_CODES.network });
  });
});
