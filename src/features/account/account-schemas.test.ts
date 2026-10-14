import { describe, expect, it } from 'vitest';
import { DeactivateFormSchema, EmailCodeFormSchema, ProfileFormSchema, toProfileChanges } from './account-schemas';

const CURRENT = { fullName: 'Ana Pérez', contactEmail: 'ana@correo.com' };

describe('ProfileFormSchema', () => {
  it('accepts a name with an email or with an empty email', () => {
    expect(ProfileFormSchema.safeParse({ fullName: 'Ana', contactEmail: 'ana@correo.com' }).success).toBe(true);
    expect(ProfileFormSchema.safeParse({ fullName: 'Ana', contactEmail: '' }).success).toBe(true);
  });

  it('rejects an empty name and a malformed email', () => {
    const result = ProfileFormSchema.safeParse({ fullName: ' ', contactEmail: 'no-es-correo' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(['fullName', 'contactEmail']);
  });
});

describe('toProfileChanges', () => {
  it('is null when nothing changed', () => {
    expect(toProfileChanges({ fullName: 'Ana Pérez', contactEmail: 'ana@correo.com' }, CURRENT)).toBeNull();
  });

  it('sends only what changed', () => {
    expect(toProfileChanges({ fullName: 'Ana P.', contactEmail: 'ana@correo.com' }, CURRENT)).toEqual({ fullName: 'Ana P.' });
    expect(toProfileChanges({ fullName: 'Ana Pérez', contactEmail: 'otra@correo.com' }, CURRENT)).toEqual({ contactEmail: 'otra@correo.com' });
  });

  it('sends null to remove the email and treats an empty email as no email', () => {
    expect(toProfileChanges({ fullName: 'Ana Pérez', contactEmail: '' }, CURRENT)).toEqual({ contactEmail: null });
    expect(toProfileChanges({ fullName: 'Ana Pérez', contactEmail: '' }, { ...CURRENT, contactEmail: null })).toBeNull();
  });
});

describe('EmailCodeFormSchema and DeactivateFormSchema', () => {
  it('accepts a pasted code with spaces', () => {
    expect(EmailCodeFormSchema.parse({ code: ' 123 456 ' }).code).toBe('123456');
  });

  it('rejects a short code and an empty password', () => {
    expect(EmailCodeFormSchema.safeParse({ code: '123' }).success).toBe(false);
    expect(DeactivateFormSchema.safeParse({ password: '' }).success).toBe(false);
  });
});
