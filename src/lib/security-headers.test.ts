import { describe, expect, it } from 'vitest';
import { NO_STORE_HEADER, NO_STORE_SOURCES, buildContentSecurityPolicy, buildSecurityHeaders, parseStorageOrigin } from './security-headers';

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

  it('allows only Cloudflare Turnstile scripts and frames from outside the app', () => {
    expect(directive(production, 'script-src')).toContain('https://challenges.cloudflare.com');
    expect(directive(production, 'frame-src')).toBe('frame-src https://challenges.cloudflare.com');
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
    expect(headers['Cross-Origin-Resource-Policy']).toBe('same-origin');
    expect(headers['Strict-Transport-Security']).toContain('max-age=63072000');
    expect(headers['Permissions-Policy']).toContain('camera=()');
    expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
  });
});

describe('no-store routes', () => {
  it('cover the panel and the access pages', () => {
    expect(NO_STORE_SOURCES).toEqual(expect.arrayContaining(['/resumen/:path*', '/login', '/registro', '/clientes/:path*', '/prestamos/:path*', '/cuenta/:path*']));
    expect(NO_STORE_HEADER).toEqual({ key: 'Cache-Control', value: 'private, no-store' });
  });
});

describe('storage origin', () => {
  it('is allowed to show images and to receive the upload, and nothing else', () => {
    const csp = buildContentSecurityPolicy({ isDevelopment: false, storageOrigin: 'https://cdn.fiaro.co' });

    expect(directive(csp, 'img-src')).toContain('https://cdn.fiaro.co');
    expect(directive(csp, 'connect-src')).toContain('https://cdn.fiaro.co');
    expect(directive(csp, 'script-src')).not.toContain('cdn.fiaro.co');
  });

  it('is not in the policy when it is not configured', () => {
    expect(buildContentSecurityPolicy({ isDevelopment: false })).not.toContain('cdn');
  });
});

describe('parseStorageOrigin', () => {
  it('keeps only the origin of an https URL, and http only for a local machine', () => {
    expect(parseStorageOrigin('https://pub-1.r2.dev/logos/x.png')).toBe('https://pub-1.r2.dev');
    expect(parseStorageOrigin('http://localhost:9000')).toBe('http://localhost:9000');
    expect(parseStorageOrigin('http://127.0.0.1:9000/x')).toBe('http://127.0.0.1:9000');
  });

  it('refuses http towards the internet', () => {
    expect(parseStorageOrigin('http://cdn.fiaro.co')).toBeNull();
  });

  it.each([undefined, '', 'no es una url', 'ftp://host', 'javascript:alert(1)'])('ignores %s', (raw) => {
    expect(parseStorageOrigin(raw)).toBeNull();
  });
});
