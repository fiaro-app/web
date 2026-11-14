import { describe, expect, it } from 'vitest';
import { ChangePasswordFormSchema, RequestResetFormSchema, ResetPasswordFormSchema, verificationCodeSchema } from './password-schemas';

const messages = (result: { error?: { issues: { path: PropertyKey[]; message: string }[] } }) =>
  Object.fromEntries((result.error?.issues ?? []).map((issue) => [String(issue.path[0]), issue.message]));

describe('RequestResetFormSchema', () => {
  it('normalises the phone like every other form', () => {
    const result = RequestResetFormSchema.safeParse({ phone: '300 123 4567' });

    expect(result.success && result.data.phone).toBe('+573001234567');
  });

  it('asks for the phone', () => {
    expect(messages(RequestResetFormSchema.safeParse({ phone: '' }))).toEqual({ phone: 'Escribe tu celular.' });
  });
});

describe('verificationCodeSchema', () => {
  it.each(['048213', ' 048 213 '])('accepts the 6-digit code %j, ignoring spaces', (code) => {
    expect(verificationCodeSchema.parse(code)).toBe('048213');
  });

  it.each(['', '12345', '1234567', 'abcdef'])('rejects %j', (code) => {
    expect(verificationCodeSchema.safeParse(code).success).toBe(false);
  });
});

describe('ResetPasswordFormSchema', () => {
  const VALID = { code: '048213', newPassword: 'nueva-clave-segura-1', confirmPassword: 'nueva-clave-segura-1' };

  it('accepts a code and a confirmed password', () => {
    expect(ResetPasswordFormSchema.safeParse(VALID).success).toBe(true);
  });

  it('flags the confirmation when the passwords differ', () => {
    expect(messages(ResetPasswordFormSchema.safeParse({ ...VALID, confirmPassword: 'otra' }))).toEqual({
      confirmPassword: 'Las contraseñas no coinciden.',
    });
  });

  it('applies the password length of the API', () => {
    expect(messages(ResetPasswordFormSchema.safeParse({ ...VALID, newPassword: 'corta', confirmPassword: 'corta' }))).toMatchObject({
      newPassword: 'Usa al menos 15 caracteres.',
    });
  });
});

describe('ChangePasswordFormSchema', () => {
  const VALID = { currentPassword: 'temporal-1', newPassword: 'nueva-clave-segura-1', confirmPassword: 'nueva-clave-segura-1' };

  it('accepts a different, confirmed password', () => {
    expect(ChangePasswordFormSchema.safeParse(VALID).success).toBe(true);
  });

  it('asks for the current password', () => {
    expect(messages(ChangePasswordFormSchema.safeParse({ ...VALID, currentPassword: '' }))).toMatchObject({
      currentPassword: 'Escribe tu contraseña actual.',
    });
  });

  it('does not accept the same password again', () => {
    const same = { currentPassword: 'misma-clave-segura-1', newPassword: 'misma-clave-segura-1', confirmPassword: 'misma-clave-segura-1' };

    expect(messages(ChangePasswordFormSchema.safeParse(same))).toEqual({
      newPassword: 'La contraseña nueva debe ser distinta de la actual.',
    });
  });
});
