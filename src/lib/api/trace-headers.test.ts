import { describe, expect, it } from 'vitest';
import { traceHeaders } from '@/lib/api/trace-headers';

describe('traceHeaders', () => {
  it('manda un id de sesión estable y la pantalla sin ids', () => {
    window.history.pushState({}, '', '/loans/123e4567-e89b-12d3-a456-426614174000/pagos');
    const first = traceHeaders();
    expect(first['X-Client-Screen']).toBe('/loans/[id]/pagos');
    expect(first['X-Session-Id']).toMatch(/^[0-9a-f-]{36}$/);
    expect(traceHeaders()['X-Session-Id']).toBe(first['X-Session-Id']);
  });
});
