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

  it('shows the trend with the color of its tone and a text for screen readers', () => {
    const trend = { direction: 'up', label: '↑ 4 %', description: 'Sube 4 % frente al período anterior', tone: 'good' } as const;
    render(<StatTile label="Cobrado" value="$4M" trend={trend} />);

    expect(screen.getByText('↑ 4 %')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('↑ 4 %').parentElement).toHaveClass('text-success');
    expect(screen.getByText('Sube 4 % frente al período anterior')).toHaveClass('sr-only');
  });

  it('shows no trend line without one', () => {
    render(<StatTile label="Cobrado" value="$4M" trend={null} />);

    expect(screen.queryByText(/frente al período anterior/)).not.toBeInTheDocument();
  });
});
