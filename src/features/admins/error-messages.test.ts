import { describe, expect, it } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { describeAdminError } from './error-messages';

const apiError = (code: string) => new ApiRequestError({ statusCode: 400, code, message: 'x' } as never);

describe('describeAdminError', () => {
  it.each([
    ['FORBIDDEN', /No tienes permiso/, null],
    ['SUBSCRIPTION_READ_ONLY', /solo lectura/, null],
    ['PLAN_LIMIT_REACHED', /cupos de administrador/, null],
    ['NOT_FOUND', /ya no existe/, null],
    ['CONFLICT', /ya trabaja/, 'phone'],
    ['COLLABORATOR_NATIONAL_ID_TAKEN', /con esa cédula/, 'nationalId'],
    ['VALIDATION_FAILED', /del dueño/, null],
  ])('explains %s', (code, message, field) => {
    const view = describeAdminError(apiError(code));
    expect(view.message).toMatch(message);
    expect(view.field).toBe(field);
  });

  it('falls back to the general messages', () => {
    expect(describeAdminError(new Error('boom')).message).toEqual(expect.any(String));
    expect(describeAdminError(apiError('SOMETHING_ELSE')).message).toEqual(expect.any(String));
  });
});
