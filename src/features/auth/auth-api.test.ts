import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerOwner, signIn, signOut } from './auth-api';

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

describe('registerOwner', () => {
  const ACCOUNT = { fullName: 'Ana Pérez', phone: '+573001234567', nationalId: '1020304050', contactEmail: undefined, password: 'una-contraseña' };
  const CREATED = {
    user: { id: USER.id, phone: '+573001234567' },
    tenant: { id: '0192f0a4-7c3e-7000-8000-000000000002', name: 'Préstamos Ana' },
  };

  it('posts the account and the business to /register, leaving out an empty email', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify(CREATED), { status: 201 }));

    await registerOwner(ACCOUNT, { businessName: 'Préstamos Ana' });

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('/api/register');
    expect(JSON.parse(init?.body as string)).toEqual({
      phone: '+573001234567',
      fullName: 'Ana Pérez',
      password: 'una-contraseña',
      nationalId: '1020304050',
      businessName: 'Préstamos Ana',
    });
  });

  it('sends the email when there is one', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify(CREATED), { status: 201 }));

    await registerOwner({ ...ACCOUNT, contactEmail: 'ana@correo.com' }, { businessName: 'X Y' });

    expect(JSON.parse(fetchMock.mock.calls[0]![1]?.body as string)).toMatchObject({ contactEmail: 'ana@correo.com' });
  });
});
