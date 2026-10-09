import { describe, expect, it } from 'vitest';
import { NO_STORE_HEADER, NO_STORE_SOURCES, buildContentSecurityPolicy, buildSecurityHeaders } from './security-headers';

const directive = (csp: string, name: string) => csp.split('; ').find((entry) => entry.startsWith(`${name} `) || entry === name);

describe('buildContentSecurityPolicy', () => {
  const production = buildContentSecurityPolicy({ isDevelopment: false });
  const development = buildContentSecurityPolicy({ isDevelopment: true });

  it('only allows its own origin by default', () => {
    expect(directive(production, 'default-src')).toBe("default-src 'self'");
    expect(directive(production, 'connect-src')).toBe("connect-src 'self'");
  });

  it('cannot be framed, cannot load plugins and only submits forms to itself', () => {
    expect(directive(production, 'frame-ancestors')).toBe("frame-ancestors 'none'");
    expect(directive(production, 'object-src')).toBe("object-src 'none'");
    expect(directive(production, 'form-action')).toBe("form-action 'self'");
    expect(directive(production, 'base-uri')).toBe("base-uri 'self'");
  });

  it('forbids eval and upgrades insecure requests in production', () => {
    expect(directive(production, 'script-src')).not.toContain('unsafe-eval');
    expect(directive(production, 'upgrade-insecure-requests')).toBe('upgrade-insecure-requests');
  });

  it('relaxes only what development tooling needs', () => {
    expect(directive(development, 'script-src')).toContain("'unsafe-eval'");
    expect(directive(development, 'connect-src')).toContain('ws:');
    expect(development).not.toContain('upgrade-insecure-requests');
  });
});

describe('buildSecurityHeaders', () => {
  const headers = Object.fromEntries(buildSecurityHeaders({ isDevelopment: false }).map((h) => [h.key, h.value]));

  it('sets the hardening headers', () => {
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['Cross-Origin-Opener-Policy']).toBe('same-origin');
    expect(headers['Strict-Transport-Security']).toContain('max-age=63072000');
    expect(headers['Permissions-Policy']).toContain('camera=()');
    expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
  });
});

describe('no-store routes', () => {
  it('cover the panel and the access pages', () => {
    expect(NO_STORE_SOURCES).toEqual(expect.arrayContaining(['/resumen/:path*', '/login', '/registro']));
    expect(NO_STORE_HEADER).toEqual({ key: 'Cache-Control', value: 'private, no-store' });
  });
});
