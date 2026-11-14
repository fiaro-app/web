import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getCollectorsToday } from './get-collectors-today.server';

beforeEach(() => {
  callEndpointAsUser.mockReset();
});

describe('getCollectorsToday', () => {
  it('convierte la respuesta de la API a lo que pinta la sección', async () => {
    callEndpointAsUser.mockResolvedValue({
      date: '2026-10-15',
      counts: { NO_ROUTE: 0, NOT_STARTED: 2, IN_PROGRESS: 0, FINISHED: 0 },
      collectors: [],
    });

    const view = await getCollectorsToday();

    expect(view?.notStarted).toBe(2);
  });

  it('si la API falla, devuelve null para que el resumen se pinte igual', async () => {
    callEndpointAsUser.mockRejectedValue(new Error('caída'));

    await expect(getCollectorsToday()).resolves.toBeNull();
  });
});
