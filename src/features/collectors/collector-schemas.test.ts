import { describe, expect, it } from 'vitest';
import { InviteMembershipBodySchema } from '@/features/memberships/endpoints';
import { CollectorFormSchema, toInviteCollectorBody } from './collector-schemas';

const PORTFOLIO_ID = '3f2b8c1e-7d4a-4e9b-8a61-5c0d2f9e1b77';
const valid = {
  fullName: 'Luis Gómez',
  nationalId: '1.030.405.060',
  phone: '310 999 8877',
  contactEmail: '',
  portfolioId: PORTFOLIO_ID,
};

describe('CollectorFormSchema', () => {
  it('normalizes the phone to E.164 and the national id to digits', () => {
    const result = CollectorFormSchema.parse(valid);
    expect(result.phone).toBe('+573109998877');
    expect(result.nationalId).toBe('1030405060');
    expect(result.contactEmail).toBeUndefined();
  });

  it('reports a message per invalid field', () => {
    const result = CollectorFormSchema.safeParse({ ...valid, fullName: '', nationalId: '', portfolioId: '' });
    expect(result.success).toBe(false);
    const fields = result.error?.issues.map((issue) => issue.path[0]);
    expect(fields).toEqual(expect.arrayContaining(['fullName', 'nationalId', 'portfolioId']));
  });

  it('rejects a malformed email but accepts a real one', () => {
    expect(CollectorFormSchema.safeParse({ ...valid, contactEmail: 'no-es-correo' }).success).toBe(false);
    expect(CollectorFormSchema.parse({ ...valid, contactEmail: ' a@b.co ' }).contactEmail).toBe('a@b.co');
  });
});

describe('toInviteCollectorBody', () => {
  it('builds a body the API contract accepts, with only the COLLECTOR role', () => {
    const body = toInviteCollectorBody(CollectorFormSchema.parse(valid));
    expect(body.roles).toEqual(['COLLECTOR']);
    expect(InviteMembershipBodySchema.safeParse(body).success).toBe(true);
    expect('contactEmail' in body).toBe(false);
  });

  it('includes the email when given', () => {
    const body = toInviteCollectorBody(CollectorFormSchema.parse({ ...valid, contactEmail: 'a@b.co' }));
    expect(body.contactEmail).toBe('a@b.co');
  });
});
