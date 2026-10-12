import { describe, expect, it } from 'vitest';
import { DEFAULT_AUTHENTICATED_PATH, resolveAccess, sanitizeNextPath } from './route-guard';

describe('resolveAccess', () => {
  it.each(['/', '/contacto', '/design-system', '/recuperar-contrasena', '/icon', '/opengraph-image'])(
    'lets anyone into the public page %s',
    (pathname) => {
      expect(resolveAccess({ pathname, hasSession: false })).toEqual({ action: 'next' });
      expect(resolveAccess({ pathname, hasSession: true })).toEqual({ action: 'next' });
    },
  );

  it.each(['/login', '/registro', '/registro/empresa'])('lets guests into %s and sends signed-in people to their panel', (pathname) => {
    expect(resolveAccess({ pathname, hasSession: false })).toEqual({ action: 'next' });
    expect(resolveAccess({ pathname, hasSession: true })).toEqual({
      action: 'redirect',
      to: DEFAULT_AUTHENTICATED_PATH,
    });
  });

  it('sends a guest to login keeping where they wanted to go', () => {
    expect(resolveAccess({ pathname: '/clientes', search: '?q=ana', hasSession: false })).toEqual({
      action: 'redirect',
      to: '/login?next=%2Fclientes%3Fq%3Dana',
    });
  });

  it('lets a signed-in person into a private page', () => {
    expect(resolveAccess({ pathname: '/resumen', hasSession: true })).toEqual({ action: 'next' });
  });

  it('protects by default: an unknown page needs a session', () => {
    expect(resolveAccess({ pathname: '/ruta-nueva', hasSession: false })).toMatchObject({ action: 'redirect' });
  });

  it('does not treat a path that only starts with a public name as public', () => {
    expect(resolveAccess({ pathname: '/contactos-privados', hasSession: false })).toMatchObject({ action: 'redirect' });
    expect(resolveAccess({ pathname: '/loginx', hasSession: false })).toMatchObject({ action: 'redirect' });
  });
});

describe('sanitizeNextPath', () => {
  it.each(['/clientes', '/clientes?x=1', '/'])('keeps the internal path %s', (path) => {
    expect(sanitizeNextPath(path)).toBe(path);
  });

  it.each([
    'https://malo.com',
    '//malo.com',
    '/\\malo.com',
    'clientes',
    '',
    null,
    undefined,
    '/\t/malo.com',
    '/\n/malo.com',
    '/\r/malo.com',
    '/ /malo.com',
    '/\u0000/malo.com',
  ])(
    'drops %s so it cannot be an open redirect',
    (candidate) => {
      expect(sanitizeNextPath(candidate)).toBeNull();
    },
  );
});
