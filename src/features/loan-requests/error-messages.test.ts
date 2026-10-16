import { describe, expect, it } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { describeLoanRequestError } from './error-messages';

const apiError = (code: string) => new ApiRequestError({ statusCode: 400, code, message: 'x' } as never);

describe('describeLoanRequestError', () => {
  it.each([
    ['CONFLICT', /ya fue resuelta/],
    ['FORBIDDEN', /No tienes permiso/],
    ['SUBSCRIPTION_READ_ONLY', /solo lectura/],
    ['NOT_FOUND', /ya no existe/],
    ['VALIDATION_FAILED', /Revisa los datos/],
  ])('explains %s', (code, message) => {
    expect(describeLoanRequestError(apiError(code)).message).toMatch(message);
  });

  it('falls back to the general messages for any other failure', () => {
    expect(describeLoanRequestError(new Error('boom')).message).toEqual(expect.any(String));
    expect(describeLoanRequestError(apiError('SOMETHING_ELSE')).message).toEqual(expect.any(String));
  });
});
