import { describe, expect, it } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { describeCollectorError } from './error-messages';

const apiError = (code: string, statusCode = 400) =>
  new ApiRequestError({ statusCode, code, message: 'x' } as never);

describe('describeCollectorError', () => {
  it.each([
    ['FORBIDDEN', /permiso/, null],
    ['SUBSCRIPTION_READ_ONLY', /solo lectura/, null],
    ['NOT_FOUND', /ya no existe/, null],
    ['CONFLICT', /ya trabaja/, 'phone'],
    ['PHONE_ALREADY_REGISTERED', /Ya existe una cuenta/, 'phone'],
  ])('maps %s', (code, message, field) => {
    expect(describeCollectorError(apiError(code))).toMatchObject({ message: expect.stringMatching(message), field });
  });

  it('falls back to a generic message for unknown errors', () => {
    expect(describeCollectorError(new Error('boom')).field).toBeNull();
  });
});
