import { describe, expect, it } from 'vitest';
import { EXISTING_CLIENT_REQUEST, NEW_CLIENT_REQUEST } from '@/test/loan-request-fixture';
import { toLoanRequestsViewModel } from './loan-requests-view-model';

const PAGE = { total: 2, page: 1, pageSize: 10 };
const LOOKUP = { collectorNames: new Map([[NEW_CLIENT_REQUEST.requestedByMembershipId, 'Luis Gómez']]), collectorPortfolioNames: new Map() };

describe('toLoanRequestsViewModel', () => {
  it('describes a pending request for a new client', () => {
    const { rows } = toLoanRequestsViewModel([NEW_CLIENT_REQUEST], PAGE, 'PENDING', LOOKUP);

    expect(rows[0]).toMatchObject({
      id: NEW_CLIENT_REQUEST.id,
      collectorName: 'Luis Gómez',
      clientLabel: 'Rosa Pardo · 51234567',
      isNewClient: true,
      status: 'Pendiente',
      statusTone: 'warning',
      reviewable: true,
      loanHref: null,
    });
    expect(rows[0]?.summary).toContain('20 cuotas');
    expect(rows[0]?.summary).toContain('diarias');
  });

  it('uses the name of the existing client when it is known, and a fallback when it is not', () => {
    const names = new Map([[EXISTING_CLIENT_REQUEST.clientId ?? '', 'Marta Ríos']]);

    expect(toLoanRequestsViewModel([EXISTING_CLIENT_REQUEST], PAGE, null, LOOKUP, names).rows[0]).toMatchObject({
      clientLabel: 'Marta Ríos · 51234567',
      isNewClient: false,
    });
    expect(toLoanRequestsViewModel([EXISTING_CLIENT_REQUEST], PAGE, null).rows[0]?.clientLabel).toBe('Cliente · 51234567');
  });

  it('links an approved request to its loan and shows a rejection reason', () => {
    const approved = { ...NEW_CLIENT_REQUEST, status: 'APPROVED' as const, loanId: '0196f3a0-0000-7000-8000-0000000000dd' };
    const rejected = { ...NEW_CLIENT_REQUEST, status: 'REJECTED' as const, rejectionReason: 'Está en mora' };

    const rows = toLoanRequestsViewModel([approved, rejected], PAGE, null).rows;

    expect(rows[0]).toMatchObject({ reviewable: false, statusTone: 'good', loanHref: '/prestamos/0196f3a0-0000-7000-8000-0000000000dd' });
    expect(rows[1]).toMatchObject({ reviewable: false, statusTone: 'bad', rejectionReason: 'Está en mora' });
  });

  it('falls back to an unknown collector name', () => {
    expect(toLoanRequestsViewModel([NEW_CLIENT_REQUEST], PAGE, null).rows[0]?.collectorName).toBe('Cobrador sin nombre');
  });
});
