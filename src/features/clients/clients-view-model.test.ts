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
  balance: 380_000,
  overdueAmount: 60_000,
  overdueDays: 2,
  activeLoans: 1,
};

describe('toClientsViewModel', () => {
  it('keeps what the table shows, with the balance and arrears that the API sums', () => {
    const view = toClientsViewModel([CLIENT], { total: 1, page: 1, pageSize: 20 }, 'Gómez');
    expect(view.rows).toEqual([
      {
        id: CLIENT.id,
        fullName: 'Carlos Gómez',
        nationalId: '1020304050',
        phone: '+573001234567',
        occupation: 'Vendedor',
        activeLoans: '1',
        balance: '$380.000',
        overdue: '2 días',
        overdueAmount: '$60.000',
        isOverdue: true,
      },
    ]);
    expect(view).toMatchObject({ total: 1, page: 1, pageSize: 20, search: 'Gómez' });
  });

  it('shows a client without arrears as up to date, and one day in the singular', () => {
    const [onTime, oneDay] = toClientsViewModel(
      [
        { ...CLIENT, overdueDays: 0, overdueAmount: 0, balance: 0, activeLoans: 0 },
        { ...CLIENT, overdueDays: 1 },
      ],
      { total: 2, page: 1, pageSize: 20 },
      '',
    ).rows;
    expect(onTime).toMatchObject({ overdue: 'Al día', overdueAmount: null, isOverdue: false, balance: '$0', activeLoans: '0' });
    expect(oneDay).toMatchObject({ overdue: '1 día', isOverdue: true });
  });
});
