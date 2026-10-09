import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CollectionDaysForm } from './CollectionDaysForm';

const { useCollectionDaysForm } = vi.hoisted(() => ({ useCollectionDaysForm: vi.fn() }));
vi.mock('@/features/lender/use-settings-forms', () => ({ useCollectionDaysForm }));

const toggleDay = vi.fn();
const toggleHolidays = vi.fn();
const state = (overrides = {}) => ({
  weekdays: ['SUNDAY'],
  skipHolidays: true,
  isSubmitting: false,
  error: null,
  notice: null,
  toggleDay: (day: string) => (event: unknown) => toggleDay(day, event),
  toggleHolidays,
  submit: vi.fn((event: { preventDefault: () => void }) => event.preventDefault()),
  ...overrides,
});
const PROPS = { nonWorkingWeekdays: ['SUNDAY' as const], skipNationalHolidays: true };

beforeEach(() => {
  vi.clearAllMocks();
  useCollectionDaysForm.mockReturnValue(state());
});

describe('CollectionDaysForm', () => {
  it('lists the seven days Monday first with the saved ones checked', () => {
    render(<CollectionDaysForm {...PROPS} canEdit />);
    const days = screen.getAllByRole('checkbox', { name: /^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)$/ });
    expect(days.map((day) => day.getAttribute('value'))).toEqual(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);
    expect(screen.getByRole('checkbox', { name: 'Domingo' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Lunes' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: /festivos nacionales/ })).toBeChecked();
  });

  it('reports a toggled day and the holidays flag through the hook', async () => {
    render(<CollectionDaysForm {...PROPS} canEdit />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Sábado' }));
    expect(toggleDay).toHaveBeenCalledWith('SATURDAY', expect.anything());
    await userEvent.click(screen.getByRole('checkbox', { name: /festivos nacionales/ }));
    expect(toggleHolidays).toHaveBeenCalledTimes(1);
  });

  it('groups the days in a labelled fieldset and disables everything without permission', () => {
    render(<CollectionDaysForm {...PROPS} canEdit={false} />);
    expect(screen.getByRole('group', { name: 'Días de la semana sin cobro' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Guardar días' })).not.toBeInTheDocument();
  });

  it('shows errors and notices', () => {
    useCollectionDaysForm.mockReturnValue(state({ error: 'Falló', notice: 'Listo' }));
    render(<CollectionDaysForm {...PROPS} canEdit />);
    expect(screen.getByText('Falló')).toBeInTheDocument();
    expect(screen.getByText('Listo')).toBeInTheDocument();
  });
});
