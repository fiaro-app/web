import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AssignCollectorForm } from './AssignCollectorForm';

const { useAssignCollector } = vi.hoisted(() => ({ useAssignCollector: vi.fn() }));
vi.mock('@/features/loans/use-assign-collector', () => ({ useAssignCollector }));

const submit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
const state = (overrides = {}) => ({ collectorId: '', isSubmitting: false, error: null, notice: null, changeCollector: vi.fn(), submit, ...overrides });
const COLLECTORS = [{ id: 'm1', name: 'Luis Gómez' }];

beforeEach(() => {
  vi.clearAllMocks();
  useAssignCollector.mockReturnValue(state());
});

describe('AssignCollectorForm', () => {
  it('lists the collectors and submits through the hook', async () => {
    render(<AssignCollectorForm loanId="l1" collectors={COLLECTORS} />);
    expect(useAssignCollector).toHaveBeenCalledWith('l1');
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Luis Gómez' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('option', { name: 'Luis Gómez' }));
    await userEvent.click(screen.getByRole('button', { name: 'Asignar cobrador' }));
    expect(submit).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('shows errors and notices', () => {
    useAssignCollector.mockReturnValue(state({ error: 'Elige el cobrador.', notice: 'Cobrador asignado.' }));
    render(<AssignCollectorForm loanId="l1" collectors={COLLECTORS} />);
    expect(screen.getByText('Elige el cobrador.')).toBeInTheDocument();
    expect(screen.getByText('Cobrador asignado.')).toBeInTheDocument();
  });

  it('explains there is nobody to assign when there are no collectors', () => {
    render(<AssignCollectorForm loanId="l1" collectors={[]} />);
    expect(screen.getByText(/Todavía no tienes cobradores/)).toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
});
