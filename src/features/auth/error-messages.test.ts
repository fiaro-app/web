import { describe, expect, it } from 'vitest';
import { ApiRequestError, CLIENT_ERROR_CODES } from '@/lib/api';
import { describeAuthError } from './error-messages';

function errorWith(code: string, retryAfterSeconds?: number) {
  return new ApiRequestError({ statusCode: 400, code, message: 'texto del servidor', retryAfterSeconds });
}

describe('describeAuthError', () => {
  it('explains bad credentials without saying which one is wrong', () => {
    expect(describeAuthError(errorWith('INVALID_PHONE_NUMBER_OR_PASSWORD'))).toEqual({
      message: 'El celular o la contraseña no son correctos.',
      field: null,
    });
  });

  it.each([
    [30, '1 minuto'],
    [60, '1 minuto'],
    [61, '2 minutos'],
    [900, '15 minutos'],
  ])('tells how long to wait when locked out (%is → %s)', (seconds, text) => {
    expect(describeAuthError(errorWith('SIGN_IN_LOCKED', seconds)).message).toContain(text);
  });

  it('says "unos minutos" when the API does not say how long', () => {
    expect(describeAuthError(errorWith('SIGN_IN_LOCKED')).message).toContain('unos minutos');
    expect(describeAuthError(errorWith('RATE_LIMITED')).message).toContain('unos minutos');
  });

  it.each([
    ['PHONE_ALREADY_REGISTERED', 'phone'],
    ['INVALID_PHONE', 'phone'],
    ['PASSWORD_TOO_WEAK', 'password'],
    ['INVALID_PASSWORD_LENGTH', 'password'],
  ] as const)('points %s at the %s field', (code, field) => {
    expect(describeAuthError(errorWith(code)).field).toBe(field);
  });

  it.each(['ACCOUNT_DEACTIVATED', 'MAINTENANCE', CLIENT_ERROR_CODES.network])('has its own message for %s', (code) => {
    const view = describeAuthError(errorWith(code));

    expect(view.field).toBeNull();
    expect(view.message).not.toMatch(/inténtalo de nuevo en unos minutos\.$/);
  });

  it('falls back to a generic message for unknown codes and unexpected errors, never the server text', () => {
    for (const error of [errorWith('ALGO_NUEVO'), new Error('boom'), 'x']) {
      const view = describeAuthError(error);

      expect(view.field).toBeNull();
      expect(view.message).toContain('No pudimos completar la solicitud');
      expect(view.message).not.toContain('texto del servidor');
    }
  });
});
