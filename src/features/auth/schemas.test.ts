import { describe, expect, it } from 'vitest';
import { SignInFormSchema } from './schemas';

describe('SignInFormSchema', () => {
  it.each(['300 123 4567', '3001234567', '+57 300-123-4567', '573001234567'])(
    'normalises the phone %s to E.164',
    (phone) => {
      const result = SignInFormSchema.safeParse({ phone, password: 'x' });

      expect(result.success && result.data.phone).toBe('+573001234567');
    },
  );

  it('rejects a phone that is not a Colombian mobile', () => {
    const result = SignInFormSchema.safeParse({ phone: '601 234 5678', password: 'x' });

    expect(result.success).toBe(false);
  });

  it('asks for a phone and a password when they are empty', () => {
    const result = SignInFormSchema.safeParse({ phone: '  ', password: '' });

    expect(result.error?.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining(['Escribe tu celular.', 'Escribe tu contraseña.']),
    );
  });

  it('does not enforce the password policy when signing in', () => {
    expect(SignInFormSchema.safeParse({ phone: '3001234567', password: '1' }).success).toBe(true);
  });

  it('rejects a password longer than the API accepts', () => {
    expect(SignInFormSchema.safeParse({ phone: '3001234567', password: 'a'.repeat(129) }).success).toBe(false);
  });
});
