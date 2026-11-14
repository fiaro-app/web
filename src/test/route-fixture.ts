import type { RoutesPage } from '@/features/routes/endpoints';

/** Una página del registro de rutas con un día de un cobrador, para las pruebas. */
export const ROUTES_PAGE: RoutesPage = {
  data: [
    {
      date: '2026-10-14',
      collector: { membershipId: '0196f3a0-0000-7000-8000-0000000000aa', fullName: 'Ana Soto' },
      startedAt: '2026-10-14T13:05:00.000Z',
      endedAt: '2026-10-14T21:30:00.000Z',
      visitsCount: 12,
      paidCount: 9,
      expectedAmount: 360_000,
      collectedAmount: 270_000,
    },
  ],
  meta: { page: 1, pageSize: 10, total: 1 },
  range: { from: '2026-10-14', to: '2026-10-14' },
};
