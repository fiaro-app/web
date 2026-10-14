import { defineEndpoint } from '@fiaro-app/contracts';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

vi.mock('server-only', () => ({}));

const { cookieString, callEndpoint } = vi.hoisted(() => ({
  cookieString: vi.fn<() => string>(),
  callEndpoint: vi.fn(),
}));
vi.mock('next/headers', () => ({ cookies: async () => ({ toString: cookieString }) }));
vi.mock('@/lib/api/call-endpoint', () => ({ callEndpoint }));

import { callEndpointAsUser } from './server-call';

const thing = defineEndpoint({
  method: 'GET',
  path: '/things',
  summary: 'x',
  response: z.object({ name: z.string() }),
});

beforeEach(() => {
  vi.clearAllMocks();
  cookieString.mockReturnValue('fiaro.session_token=abc');
});

describe('callEndpointAsUser', () => {
  it('goes straight to the API forwarding the visitor cookie', async () => {
    callEndpoint.mockResolvedValue({ name: 'x' });

    const result = await callEndpointAsUser(thing, {});

    expect(result).toEqual({ name: 'x' });
    expect(callEndpoint).toHaveBeenCalledWith(thing, {
      baseUrl: 'http://localhost:3000',
      headers: { Cookie: 'fiaro.session_token=abc' },
    });
  });

  it('keeps the rest of the input (params, body, signal)', async () => {
    callEndpoint.mockResolvedValue({ name: 'x' });
    const signal = new AbortController().signal;

    await callEndpointAsUser(thing, { signal });

    expect(callEndpoint).toHaveBeenCalledWith(thing, expect.objectContaining({ signal }));
  });
});
