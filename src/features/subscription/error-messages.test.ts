import { describe, expect, it } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { describeCheckoutError } from './error-messages';

const apiError = (code: string) => new ApiRequestError({ statusCode: 403, code, message: 'x' } as never);

describe('describeCheckoutError', () => {
  it.each([
    ['FORBIDDEN', /dueña/],
    ['BILLING_UNAVAILABLE', /no está disponible/],
  ])('explains %s', (code, message) => {
    expect(describeCheckoutError(apiError(code)).message).toMatch(message);
  });

  it('falls back to the general messages', () => {
    expect(describeCheckoutError(new Error('boom')).message).toEqual(expect.any(String));
    expect(describeCheckoutError(apiError('SOMETHING_ELSE')).message).toEqual(expect.any(String));
  });
});
