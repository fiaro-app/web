import { describe, expect, it } from 'vitest';
import { SignInFormSchema } from './schemas';

describe('SignInFormSchema', () => {
  it.each(['300 123 4567', '3001234567', '+57 300-123-4567', '573001234567'])(
    'normalises the phone %s to E.164',
    (phone) => {
      const result = SignInFormSchema.safeParse({ identifier: phone, password: 'x' });

      expect(result.success && result.data.identifier).toBe('+573001234567');
    },
  );

  it('lowercases an email identifier', () => {
    const result = SignInFormSchema.safeParse({ identifier: '  Ana@Correo.COM ', password: 'x' });

    expect(result.success && result.data.identifier).toBe('ana@correo.com');
  });

  it('rejects an identifier with @ that is not an email', () => {
    const result = SignInFormSchema.safeParse({ identifier: 'ana@', password: 'x' });

    expect(result.error?.issues[0]?.message).toBe('Escribe un correo válido, por ejemplo tu@correo.com.');
  });

  it('rejects a phone that is not a Colombian mobile', () => {
    const result = SignInFormSchema.safeParse({ identifier: '601 234 5678', password: 'x' });

    expect(result.success).toBe(false);
  });

  it('asks for an identifier and a password when they are empty', () => {
    const result = SignInFormSchema.safeParse({ identifier: '  ', password: '' });

    expect(result.error?.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining(['Escribe tu correo o celular.', 'Escribe tu contraseña.']),
    );
  });

  it('does not enforce the password policy when signing in', () => {
    expect(SignInFormSchema.safeParse({ identifier: '3001234567', password: '1' }).success).toBe(true);
  });

  it('rejects a password longer than the API accepts', () => {
    expect(SignInFormSchema.safeParse({ identifier: '3001234567', password: 'a'.repeat(129) }).success).toBe(false);
  });
});
