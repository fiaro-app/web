import { describe, expect, it } from 'vitest';
import { AccountStepSchema, CompanyStepSchema } from './register-schemas';

const VALID_ACCOUNT = {
  fullName: '  Ana Pérez ',
  phone: '300 123 4567',
  nationalId: '1.020.304.050',
  contactEmail: '',
  password: 'una-contraseña',
};

function messages(result: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } }) {
  return Object.fromEntries((result.error?.issues ?? []).map((issue) => [String(issue.path[0]), issue.message]));
}

describe('AccountStepSchema', () => {
  it('normalises what the person typed into what the API expects', () => {
    const result = AccountStepSchema.safeParse(VALID_ACCOUNT);

    expect(result.success && result.data).toEqual({
      fullName: 'Ana Pérez',
      phone: '+573001234567',
      nationalId: '1020304050',
      contactEmail: undefined,
      password: 'una-contraseña',
    });
  });

  it('keeps a typed email', () => {
    const result = AccountStepSchema.safeParse({ ...VALID_ACCOUNT, contactEmail: ' ana@correo.com ' });

    expect(result.success && result.data.contactEmail).toBe('ana@correo.com');
  });

  it('asks for every required field when empty', () => {
    const result = AccountStepSchema.safeParse({ fullName: '', phone: '', nationalId: '', contactEmail: '', password: '' });

    expect(messages(result)).toMatchObject({
      fullName: 'Escribe tu nombre completo.',
      phone: 'Escribe tu celular.',
      nationalId: 'Escribe tu cédula.',
      password: 'Usa al menos 8 caracteres.',
    });
    expect(messages(result)).not.toHaveProperty('contactEmail');
  });

  it('rejects a bad phone, national id and email with the contract or a clear message', () => {
    const result = AccountStepSchema.safeParse({
      ...VALID_ACCOUNT,
      phone: '12345',
      nationalId: 'abc',
      contactEmail: 'no-es-correo',
    });

    expect(messages(result)).toMatchObject({
      phone: 'contracts.phone.invalid_mobile',
      nationalId: 'contracts.national_id.invalid',
      contactEmail: 'Escribe un correo válido, por ejemplo tu@correo.com.',
    });
  });

  it('bounds the password length like the API does', () => {
    expect(AccountStepSchema.safeParse({ ...VALID_ACCOUNT, password: 'a'.repeat(7) }).success).toBe(false);
    expect(AccountStepSchema.safeParse({ ...VALID_ACCOUNT, password: 'a'.repeat(8) }).success).toBe(true);
    expect(AccountStepSchema.safeParse({ ...VALID_ACCOUNT, password: 'a'.repeat(129) }).success).toBe(false);
  });
});

describe('CompanyStepSchema', () => {
  it('trims the business name', () => {
    const result = CompanyStepSchema.safeParse({ businessName: '  Préstamos Ana ' });

    expect(result.success && result.data.businessName).toBe('Préstamos Ana');
  });

  it('asks for the name when it is too short', () => {
    expect(messages(CompanyStepSchema.safeParse({ businessName: ' a ' }))).toEqual({
      businessName: 'Escribe el nombre de tu financiera.',
    });
  });
});
