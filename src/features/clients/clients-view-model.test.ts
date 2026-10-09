import { describe, expect, it } from 'vitest';
import { toClientsViewModel } from './clients-view-model';

const CLIENT = {
  id: '0192f0a4-7c3e-7000-8000-000000000001',
  nationalId: '1020304050',
  fullName: 'Carlos Gómez',
  occupation: 'Vendedor',
  phone: '+573001234567',
  address: 'Calle 1',
  createdAt: '2026-10-01T10:00:00.000Z',
};

describe('toClientsViewModel', () => {
  it('keeps only what the table shows and carries the page and search', () => {
    const view = toClientsViewModel([CLIENT], { total: 1, page: 1, pageSize: 20 }, 'Gómez');
    expect(view.rows).toEqual([
      { id: CLIENT.id, fullName: 'Carlos Gómez', nationalId: '1020304050', phone: '+573001234567', occupation: 'Vendedor' },
    ]);
    expect(view).toMatchObject({ total: 1, page: 1, pageSize: 20, search: 'Gómez' });
  });
});
