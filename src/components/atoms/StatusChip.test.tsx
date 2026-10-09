import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusChip, type ChipStatus } from './StatusChip';

describe('StatusChip', () => {
  it.each<[ChipStatus, string, string]>([
    ['current', 'AL DÍA', 'bg-success'],
    ['paid', 'PAGADO', 'bg-success'],
    ['late', 'ATRASO', 'bg-warning'],
    ['delinquent', 'MORA', 'bg-destructive'],
  ])('renders %s as "%s" with its semantic color', (status, label, colorClass) => {
    render(<StatusChip status={status} />);

    expect(screen.getByText(label)).toHaveClass(colorClass);
  });

  it('shows a placeholder, with no label, while loading', () => {
    render(<StatusChip status="delinquent" loading />);

    expect(screen.queryByText('MORA')).not.toBeInTheDocument();
  });
});
