import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { proxy } from './proxy';

function request(path: string, cookie?: string) {
  return new NextRequest(`http://localhost:3001${path}`, { headers: cookie ? { cookie } : {} });
}

describe('proxy', () => {
  it('redirects a guest from a private page to login, remembering the page', () => {
    const response = proxy(request('/resumen'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3001/login?next=%2Fresumen');
  });

  it.each(['fiaro.session_token=abc', '__Secure-fiaro.session_token=abc'])('lets in someone with the session cookie (%s)', (cookie) => {
    const response = proxy(request('/resumen', cookie));

    expect(response.headers.get('location')).toBeNull();
  });

  it('sends a signed-in person away from login', () => {
    const response = proxy(request('/login', 'fiaro.session_token=abc'));

    expect(response.headers.get('location')).toBe('http://localhost:3001/resumen');
  });

  it('does not treat any other cookie as a session', () => {
    const response = proxy(request('/resumen', 'otra=abc'));

    expect(response.headers.get('location')).toContain('/login');
  });
});
