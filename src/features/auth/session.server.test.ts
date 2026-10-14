import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
vi.mock('react', async (importOriginal) => ({ ...(await importOriginal<typeof import('react')>()), cache: <T,>(fn: T) => fn }));

const { cookieString, callEndpointAsUser } = vi.hoisted(() => ({
  cookieString: vi.fn<() => string>(),
  callEndpointAsUser: vi.fn(),
}));

vi.mock('next/headers', () => ({ cookies: async () => ({ toString: cookieString }) }));
vi.mock('next/navigation', () => ({
  redirect: (to: string) => {
    throw new Error(`NEXT_REDIRECT:${to}`);
  },
}));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

const USER = { id: 'u1', name: 'Ana', phoneNumber: '+573001234567', contactEmail: null, mustChangePassword: false };

beforeEach(() => {
  vi.clearAllMocks();
  cookieString.mockReturnValue('fiaro.session_token=abc');
});

async function load() {
  return import('./session.server');
}

describe('getCurrentUser', () => {
  it('returns null without calling the API when there is no cookie', async () => {
    cookieString.mockReturnValue('');
    const { getCurrentUser } = await load();

    await expect(getCurrentUser()).resolves.toBeNull();
    expect(callEndpointAsUser).not.toHaveBeenCalled();
  });

  it('asks the API on behalf of the visitor and returns its user', async () => {
    callEndpointAsUser.mockResolvedValue({ session: { id: 's1' }, user: USER });
    const { getCurrentUser } = await load();

    await expect(getCurrentUser()).resolves.toEqual(USER);
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/auth/get-session' }), {});
  });

  it('returns null when the API says there is no session', async () => {
    callEndpointAsUser.mockResolvedValue(null);
    const { getCurrentUser } = await load();

    await expect(getCurrentUser()).resolves.toBeNull();
  });

  it('returns null on 401, but does not hide other failures as a missing session', async () => {
    const { getCurrentUser } = await load();

    callEndpointAsUser.mockRejectedValueOnce(new ApiRequestError({ statusCode: 401, code: 'UNAUTHENTICATED', message: 'x' }));
    await expect(getCurrentUser()).resolves.toBeNull();

    const outage = new ApiRequestError({ statusCode: 503, code: 'MAINTENANCE', message: 'x' });
    callEndpointAsUser.mockRejectedValueOnce(outage);
    await expect(getCurrentUser()).rejects.toBe(outage);
  });
});

describe('requireUser', () => {
  it('returns the user when there is a session', async () => {
    callEndpointAsUser.mockResolvedValue({ session: { id: 's1' }, user: USER });
    const { requireUser } = await load();

    await expect(requireUser()).resolves.toEqual(USER);
  });

  it('sends the person to login when there is none', async () => {
    callEndpointAsUser.mockResolvedValue(null);
    const { requireUser } = await load();

    await expect(requireUser()).rejects.toThrow('NEXT_REDIRECT:/login');
  });
});
