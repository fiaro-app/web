import { describe, expect, it } from 'vitest';
import { AdminFormSchema, toInviteAdminBody } from './admin-schemas';

const VALID = { fullName: 'Lucía Pardo', nationalId: '1.030.405.060', phone: '310 999 8877', contactEmail: 'lucia@correo.com' };

describe('AdminFormSchema', () => {
  it('normalizes the national id and the phone', () => {
    const parsed = AdminFormSchema.parse(VALID);
    expect(parsed).toMatchObject({ nationalId: '1030405060', phone: '+573109998877' });
  });

  it('asks for every field', () => {
    const result = AdminFormSchema.safeParse({ fullName: '', nationalId: '', phone: '', contactEmail: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0]).sort()).toEqual(['contactEmail', 'fullName', 'nationalId', 'phone']);
  });

  it('rejects an invalid email', () => {
    expect(AdminFormSchema.safeParse({ ...VALID, contactEmail: 'no-es-correo' }).success).toBe(false);
  });
});

describe('toInviteAdminBody', () => {
  it('invites with only the administrator role and no portfolio', () => {
    const body = toInviteAdminBody(AdminFormSchema.parse(VALID));
    expect(body.roles).toEqual(['LENDER']);
    expect(body).not.toHaveProperty('portfolioId');
  });
});
