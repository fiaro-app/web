import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
vi.mock('react', async (importOriginal) => ({ ...(await importOriginal<typeof import('react')>()), cache: <T,>(fn: T) => fn }));

const { cookieString, callEndpoint } = vi.hoisted(() => ({
  cookieString: vi.fn<() => string>(),
  callEndpoint: vi.fn(),
}));

vi.mock('next/headers', () => ({ cookies: async () => ({ toString: cookieString }) }));
vi.mock('next/navigation', () => ({
  redirect: (to: string) => {
    throw new Error(`NEXT_REDIRECT:${to}`);
  },
}));
vi.mock('@/lib/api', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/api')>()), callEndpoint }));

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
    expect(callEndpoint).not.toHaveBeenCalled();
  });

  it('forwards the cookie to the API and returns its user', async () => {
    callEndpoint.mockResolvedValue({ session: { id: 's1' }, user: USER });
    const { getCurrentUser } = await load();

    await expect(getCurrentUser()).resolves.toEqual(USER);
    expect(callEndpoint).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/auth/get-session' }),
      expect.objectContaining({ baseUrl: 'http://localhost:3000', headers: { Cookie: 'fiaro.session_token=abc' } }),
    );
  });

  it('returns null when the API says there is no session', async () => {
    callEndpoint.mockResolvedValue(null);
    const { getCurrentUser } = await load();

    await expect(getCurrentUser()).resolves.toBeNull();
  });

  it('returns null on 401, but does not hide other failures as a missing session', async () => {
    const { getCurrentUser } = await load();

    callEndpoint.mockRejectedValueOnce(new ApiRequestError({ statusCode: 401, code: 'UNAUTHENTICATED', message: 'x' }));
    await expect(getCurrentUser()).resolves.toBeNull();

    const outage = new ApiRequestError({ statusCode: 503, code: 'MAINTENANCE', message: 'x' });
    callEndpoint.mockRejectedValueOnce(outage);
    await expect(getCurrentUser()).rejects.toBe(outage);
  });
});

describe('requireUser', () => {
  it('returns the user when there is a session', async () => {
    callEndpoint.mockResolvedValue({ session: { id: 's1' }, user: USER });
    const { requireUser } = await load();

    await expect(requireUser()).resolves.toEqual(USER);
  });

  it('sends the person to login when there is none', async () => {
    callEndpoint.mockResolvedValue(null);
    const { requireUser } = await load();

    await expect(requireUser()).rejects.toThrow('NEXT_REDIRECT:/login');
  });
});
