import { describe, expect, it } from 'vitest';
import { resolveContactHref } from './landing';

describe('resolveContactHref', () => {
  it('uses a mailto when a valid contact email is configured', () => {
    expect(resolveContactHref(' ventas@fiaro.co ')).toBe('mailto:ventas@fiaro.co');
  });

  it.each([undefined, '', '   ', 'no-es-correo', 'a@b'])('falls back to the FAQ section for %s', (email) => {
    expect(resolveContactHref(email)).toBe('#preguntas');
  });
});
