import { describe, expect, it } from 'vitest';
import { ApiRequestError, CLIENT_ERROR_CODES, isApiRequestError } from './api-error';

describe('ApiRequestError', () => {
  it('keeps the contract data and defaults the optional ones', () => {
    const error = new ApiRequestError({ statusCode: 409, code: 'PHONE_ALREADY_REGISTERED', message: 'Ya existe.' });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ApiRequestError');
    expect(error.statusCode).toBe(409);
    expect(error.message).toBe('Ya existe.');
    expect(error.issues).toEqual([]);
    expect(error.retryAfterSeconds).toBeNull();
  });

  it('carries validation issues and the Retry-After wait', () => {
    const error = new ApiRequestError({
      statusCode: 429,
      code: 'SIGN_IN_LOCKED',
      message: 'Bloqueado.',
      issues: [{ path: ['phone'], message: 'x' }],
      retryAfterSeconds: 120,
    });

    expect(error.issues).toHaveLength(1);
    expect(error.retryAfterSeconds).toBe(120);
  });

  it('tells whether it has one of several codes', () => {
    const error = new ApiRequestError({ statusCode: 400, code: 'PASSWORD_TOO_WEAK', message: 'x' });

    expect(error.hasCode('PASSWORD_TOO_WEAK', 'INVALID_PASSWORD_LENGTH')).toBe(true);
    expect(error.hasCode('SIGN_IN_LOCKED')).toBe(false);
  });

  it('is recognised by the type guard only when it is one', () => {
    expect(isApiRequestError(new ApiRequestError({ statusCode: 0, code: CLIENT_ERROR_CODES.network, message: 'x' }))).toBe(true);
    expect(isApiRequestError(new Error('x'))).toBe(false);
    expect(isApiRequestError(null)).toBe(false);
  });
});
