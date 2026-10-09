import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatTile } from './StatTile';

describe('StatTile', () => {
  it('shows the label and the value in ink by default', () => {
    render(<StatTile label="Cartera total" value="$18.4M" />);

    expect(screen.getByText('Cartera total')).toBeInTheDocument();
    expect(screen.getByText('$18.4M')).toHaveClass('text-foreground');
  });

  it.each([
    ['good', 'text-success'],
    ['warning', 'text-warning'],
    ['bad', 'text-destructive'],
  ] as const)('colors the value for the %s tone', (tone, colorClass) => {
    render(<StatTile label="X" value="1" tone={tone} />);

    expect(screen.getByText('1')).toHaveClass(colorClass);
  });
});
