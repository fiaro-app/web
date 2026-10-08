import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Label } from './Label';

describe('Label', () => {
  it('renders its text', () => {
    render(<Label htmlFor="phone">Celular</Label>);

    expect(screen.getByText('Celular')).toBeInTheDocument();
  });

  it('adds a visual marker for required fields, hidden from assistive tech', () => {
    render(
      <Label htmlFor="phone" required>
        Celular
      </Label>,
    );

    const marker = screen.getByText('*');
    expect(marker).toHaveAttribute('aria-hidden', 'true');
  });
});
