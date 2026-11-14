import type { MembershipListEntry } from '@/features/memberships/endpoints';

/** Una membresía activa del listado, para las pruebas; `overrides` cambia lo que haga falta. */
export function membership(overrides: Partial<MembershipListEntry> = {}): MembershipListEntry {
  return {
    id: '0196f3a0-0000-7000-8000-000000000001',
    userId: '0196f3a0-0000-7000-8000-0000000000f1',
    lenderId: '0196f3a0-0000-7000-8000-0000000000e1',
    roles: ['COLLECTOR'],
    status: 'ACTIVE',
    portfolioId: '0196f3a0-0000-7000-8000-0000000000aa',
    createdAt: '2026-10-01T00:00:00.000Z',
    deactivatedAt: null,
    fullName: 'Luis Gómez',
    phone: '+573109998877',
    ...overrides,
  } as MembershipListEntry;
}
