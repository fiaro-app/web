import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KpiTile } from './KpiTile';

describe('KpiTile', () => {
  it('shows the label and the value', () => {
    render(<KpiTile label="Cartera" value="$18.4M" />);

    expect(screen.getByText('Cartera')).toBeInTheDocument();
    expect(screen.getByText('$18.4M')).toBeInTheDocument();
  });

  it('colors the value with the given class', () => {
    render(<KpiTile label="Mora" value="18%" valueClassName="text-destructive" />);

    expect(screen.getByText('18%')).toHaveClass('text-destructive');
  });

  it('has a compact version with a readable 12px label and a serif value', () => {
    render(<KpiTile label="Cartera" value="$18.4M" compact />);

    expect(screen.getByText('Cartera')).toHaveClass('text-caption');
    expect(screen.getByText('$18.4M')).toHaveClass('font-display', 'text-label');
  });
});
