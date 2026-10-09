import { MobilePhoneSchema } from '@fiaro-app/contracts';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { toFieldErrors } from './forms';

describe('toFieldErrors', () => {
  const schema = z.object({
    phone: MobilePhoneSchema,
    name: z.string().min(1, 'Escribe tu nombre.'),
  });

  it('translates contract message keys and keeps plain Spanish messages', () => {
    const result = schema.safeParse({ phone: '123', name: '' });

    expect(result.success).toBe(false);
    expect(toFieldErrors(result.error!)).toEqual({
      phone: 'Ingresa un celular colombiano válido de 10 dígitos.',
      name: 'Escribe tu nombre.',
    });
  });

  it('keeps only the first message of each field', () => {
    const result = z
      .object({ password: z.string().min(8, 'Muy corta.').regex(/\d/, 'Falta un número.') })
      .safeParse({ password: 'a' });

    expect(toFieldErrors(result.error!)).toEqual({ password: 'Muy corta.' });
  });

  it('ignores issues that are not about a field', () => {
    const result = z.string().safeParse(1);

    expect(toFieldErrors(result.error!)).toEqual({});
  });
});
