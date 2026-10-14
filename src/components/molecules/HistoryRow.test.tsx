import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HistoryRow } from './HistoryRow';

describe('HistoryRow', () => {
  it('shows date, method, formatted amount and a colored status', () => {
    render(
      <HistoryRow
        date="12 sep 2026"
        method="Efectivo"
        amount={35000}
        statusLabel="Pagado"
        statusTone="success"
      />,
    );

    expect(screen.getByText('12 sep 2026')).toBeInTheDocument();
    expect(screen.getByText('Efectivo')).toBeInTheDocument();
    expect(screen.getByText('$35.000')).toBeInTheDocument();
    expect(screen.getByText('Pagado')).toHaveClass('text-success');
  });
});
