import { describe, expect, it } from 'vitest';
import { CONTACT_METHOD_REQUIRED, ContactFormSchema } from './lead-schemas';

const BASE = { name: ' Ana Pérez ', phone: '', email: '', message: 'Quiero probar Fiaro con mis cobradores.' };

describe('ContactFormSchema', () => {
  it('accepts a phone alone and normalizes it to E.164', () => {
    const result = ContactFormSchema.parse({ ...BASE, phone: '300 123 4567' });

    expect(result).toMatchObject({ name: 'Ana Pérez', phone: '+573001234567', email: undefined });
  });

  it('accepts an email alone', () => {
    expect(ContactFormSchema.parse({ ...BASE, email: 'ana@ejemplo.co' })).toMatchObject({ phone: undefined, email: 'ana@ejemplo.co' });
  });

  it('needs at least one way to answer, and says so under the phone', () => {
    const result = ContactFormSchema.safeParse(BASE);

    expect(result.error?.issues[0]).toMatchObject({ message: CONTACT_METHOD_REQUIRED, path: ['phone'] });
  });

  it('requires the name and a message with some substance', () => {
    const result = ContactFormSchema.safeParse({ ...BASE, name: '  ', phone: '3001234567', message: 'hola' });

    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(['name', 'message']);
  });

  it('rejects an invalid phone or email instead of sending it', () => {
    expect(ContactFormSchema.safeParse({ ...BASE, phone: '123' }).success).toBe(false);
    expect(ContactFormSchema.safeParse({ ...BASE, email: 'no-es-correo' }).error?.issues[0]?.message).toBe('Escribe un correo válido.');
  });
});
