import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { signIn, signOut } from './auth-api';

const fetchMock = vi.fn<typeof fetch>();

const USER = {
  id: '0192f0a4-7c3e-7000-8000-000000000001',
  name: 'Ana Pérez',
  phoneNumber: '+573001234567',
  contactEmail: null,
  mustChangePassword: false,
  emailVerified: false,
};

beforeEach(() => vi.stubGlobal('fetch', fetchMock));
afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

describe('signIn', () => {
  it('posts the phone and password to the sign-in endpoint and returns the user', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ user: USER }), { status: 200 }));

    const user = await signIn({ phone: '+573001234567', password: 'secreta-123' });

    expect(user).toMatchObject({ name: 'Ana Pérez', phoneNumber: '+573001234567' });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('/api/auth/sign-in/phone-number');
    expect(init).toMatchObject({ method: 'POST' });
    expect(JSON.parse(init?.body as string)).toEqual({ phoneNumber: '+573001234567', password: 'secreta-123' });
  });
});

describe('signOut', () => {
  it('calls the sign-out endpoint without a body', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));

    await signOut();

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('/api/auth/sign-out');
    expect(init?.body).toBeUndefined();
  });
});
