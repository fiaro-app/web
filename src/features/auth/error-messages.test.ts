import { describe, expect, it } from 'vitest';
import { ApiRequestError, CLIENT_ERROR_CODES } from '@/lib/api';
import { describeAuthError, issueFieldErrors } from './error-messages';

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
    ['PASSWORD_RESET_CODE_INVALID', 'code'],
    ['PASSWORD_RESET_CODE_EXPIRED', 'code'],
    ['INVALID_PASSWORD', 'currentPassword'],
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

describe('issueFieldErrors', () => {
  it('maps the issues of a VALIDATION_FAILED to the fields, translating contract messages', () => {
    const error = new ApiRequestError({
      statusCode: 400,
      code: 'VALIDATION_FAILED',
      message: 'x',
      issues: [
        { path: ['phone'], message: 'contracts.phone.invalid_mobile' },
        { path: ['phone'], message: 'segundo mensaje, se ignora' },
        { path: ['nationalId'], message: 'Cédula inválida.' },
        { path: ['campoDesconocido'], message: 'se ignora' },
        { path: [], message: 'sin campo' },
      ],
    });

    expect(issueFieldErrors(error)).toEqual({
      phone: 'Ingresa un celular colombiano válido de 10 dígitos.',
      nationalId: 'Cédula inválida.',
    });
  });

  it('returns nothing for other errors', () => {
    expect(issueFieldErrors(errorWith('PASSWORD_TOO_WEAK'))).toEqual({});
    expect(issueFieldErrors(new Error('x'))).toEqual({});
  });
});
