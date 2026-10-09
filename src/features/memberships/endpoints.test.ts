import { describe, expect, it } from 'vitest';
import {
  ChangeMembershipRolesBodySchema,
  InviteMembershipBodySchema,
  ListMembershipsBodySchema,
  membershipEndpoints,
} from './endpoints';

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

  it('declares the write actions with the API paths', () => {
    expect(membershipEndpoints.invite).toMatchObject({ method: 'POST', path: '/memberships' });
    expect(membershipEndpoints.changeRoles).toMatchObject({ method: 'PATCH', path: '/memberships/:id/roles' });
    expect(membershipEndpoints.deactivate).toMatchObject({ method: 'POST', path: '/memberships/:id/deactivate' });
    expect(membershipEndpoints.resetPassword).toMatchObject({
      method: 'POST',
      path: '/memberships/:id/reset-password',
    });
  });

  it('requires an E.164 phone and at least one role to invite', () => {
    const valid = { phone: '+573109998877', fullName: 'Luis Gómez', roles: ['COLLECTOR'] };
    expect(InviteMembershipBodySchema.safeParse(valid).success).toBe(true);
    expect(InviteMembershipBodySchema.safeParse({ ...valid, phone: '3109998877' }).success).toBe(false);
    expect(InviteMembershipBodySchema.safeParse({ ...valid, roles: [] }).success).toBe(false);
    expect(InviteMembershipBodySchema.safeParse({ ...valid, extra: 1 }).success).toBe(false);
  });

  it('requires at least one role to change roles', () => {
    expect(ChangeMembershipRolesBodySchema.safeParse({ roles: [] }).success).toBe(false);
    expect(ChangeMembershipRolesBodySchema.safeParse({ roles: ['LENDER'] }).success).toBe(true);
  });
});
