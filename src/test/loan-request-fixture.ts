import type { LoanRequest } from '@/features/loan-requests/endpoints';

/** Una solicitud pendiente con un cliente nuevo, para las pruebas. */
export const NEW_CLIENT_REQUEST: LoanRequest = {
  id: '0196f3a0-0000-7000-8000-000000000001',
  status: 'PENDING',
  requestedByMembershipId: '0196f3a0-0000-7000-8000-0000000000aa',
  clientId: null,
  nationalId: '51234567',
  newClient: { fullName: 'Rosa Pardo', occupation: 'Tendera', phone: '+573001112233', address: 'Carrera 7 # 8-9' },
  principalAmount: 500_000,
  installmentCount: 20,
  installmentValue: 30_000,
  totalPayable: 600_000,
  frequency: 'DAILY',
  startDate: '2026-12-01',
  resolvedAt: null,
  rejectionReason: null,
  loanId: null,
  createdAt: '2026-10-15T12:00:00.000Z',
};

/** Una solicitud para un cliente que el negocio ya tenía. */
export const EXISTING_CLIENT_REQUEST: LoanRequest = {
  ...NEW_CLIENT_REQUEST,
  id: '0196f3a0-0000-7000-8000-000000000002',
  clientId: '0196f3a0-0000-7000-8000-0000000000cc',
  newClient: null,
};
