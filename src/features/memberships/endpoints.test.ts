import { describe, expect, it } from 'vitest';
import { ListMembershipsBodySchema, membershipEndpoints } from './endpoints';

describe('membership endpoints', () => {
  it('declares the list as a QUERY with a body, as the API does', () => {
    expect(membershipEndpoints.list).toMatchObject({ method: 'QUERY', path: '/memberships' });
  });

  it('defaults the page and accepts the status and role filters', () => {
    expect(ListMembershipsBodySchema.parse({})).toEqual({ page: 1, pageSize: 20 });
    expect(ListMembershipsBodySchema.parse({ role: 'COLLECTOR', status: 'ACTIVE', pageSize: 100 })).toMatchObject({
      role: 'COLLECTOR',
      status: 'ACTIVE',
    });
  });

  it('rejects an unknown role and a page size above the API maximum', () => {
    expect(ListMembershipsBodySchema.safeParse({ role: 'ADMIN' }).success).toBe(false);
    expect(ListMembershipsBodySchema.safeParse({ pageSize: 101 }).success).toBe(false);
  });
});
