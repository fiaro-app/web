import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ClientRow } from './ClientRow';

describe('ClientRow', () => {
  it('shows name, initials, balance and status', () => {
    render(<ClientRow name="Marta Gómez" balance={420000} status="current" />);

    expect(screen.getByText('Marta Gómez')).toBeInTheDocument();
    expect(screen.getByText('MG')).toBeInTheDocument();
    expect(screen.getByText('Saldo $420.000')).toBeInTheDocument();
    expect(screen.getByText('AL DÍA')).toBeInTheDocument();
  });

  it('shows days late only when there are some, with singular/plural', () => {
    const { rerender } = render(<ClientRow name="Marta" balance={1} status="late" />);
    expect(screen.queryByText(/días?$/)).not.toBeInTheDocument();

    rerender(<ClientRow name="Marta" balance={1} status="late" daysLate={1} />);
    expect(screen.getByText('1 día')).toBeInTheDocument();

    rerender(<ClientRow name="Marta" balance={1} status="delinquent" daysLate={12} />);
    expect(screen.getByText('12 días')).toBeInTheDocument();
  });

  it('is informative (no button) without onClick', () => {
    render(<ClientRow name="Marta Gómez" balance={1} status="paid" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('becomes a button when it has onClick', async () => {
    const onClick = vi.fn();
    render(<ClientRow name="Marta Gómez" balance={1} status="paid" onClick={onClick} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
