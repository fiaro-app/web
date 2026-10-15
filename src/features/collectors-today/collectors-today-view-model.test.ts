import { describe, expect, it } from 'vitest';
import { toCollectorsTodayViewModel } from './collectors-today-view-model';
import type { CollectorsToday } from './endpoints';

const ID = '0192f0a4-7c3e-7000-8000-000000000011';

function collector(overrides: Partial<CollectorsToday['collectors'][number]> = {}): CollectorsToday['collectors'][number] {
  return {
    membershipId: ID,
    fullName: 'Ana Pérez',
    status: 'IN_PROGRESS',
    routeLoans: 5,
    visitedLoans: 2,
    pendingLoans: 3,
    expectedAmount: 100000,
    collectedAmount: 40000,
    firstVisitAt: '2026-10-15T13:05:00.000Z',
    lastVisitAt: '2026-10-15T14:00:00.000Z',
    settlementStatus: null,
    ...overrides,
  };
}

const COUNTS = { NO_ROUTE: 0, NOT_STARTED: 1, IN_PROGRESS: 1, FINISHED: 1 };

describe('toCollectorsTodayViewModel', () => {
  it('resume cuántos ya iniciaron y cuántos terminaron', () => {
    const view = toCollectorsTodayViewModel({ date: '2026-10-15', counts: COUNTS, collectors: [] });

    expect(view.summary).toBe('2 de 3 cobradores ya iniciaron su ruta · 1 la terminaron');
    expect(view.notStarted).toBe(1);
  });

  it('sin cobradores con ruta lo dice', () => {
    const view = toCollectorsTodayViewModel({
      date: '2026-10-15',
      counts: { NO_ROUTE: 2, NOT_STARTED: 0, IN_PROGRESS: 0, FINISHED: 0 },
      collectors: [],
    });

    expect(view.summary).toBe('Ningún cobrador tiene ruta hoy.');
  });

  it('arma la fila con el avance, lo cobrado y la hora de inicio en Colombia', () => {
    const [row] = toCollectorsTodayViewModel({ date: '2026-10-15', counts: COUNTS, collectors: [collector()] }).rows;

    expect(row).toMatchObject({
      id: ID,
      statusLabel: 'En ruta',
      statusTone: 'info',
      progress: '2 de 5',
      pending: 3,
      collected: '$40.000 de $100.000',
      settlement: 'Sin enviar',
    });
    expect(row?.startedAt).toMatch(/8:05/);
  });

  it('quien no ha iniciado queda en ámbar y sin hora', () => {
    const [row] = toCollectorsTodayViewModel({
      date: '2026-10-15',
      counts: COUNTS,
      collectors: [collector({ status: 'NOT_STARTED', visitedLoans: 0, pendingLoans: 5, firstVisitAt: null, settlementStatus: 'PENDING' })],
    }).rows;

    expect(row).toMatchObject({ statusLabel: 'Sin iniciar', statusTone: 'warning', startedAt: '—', settlement: 'Por revisar' });
  });
});
