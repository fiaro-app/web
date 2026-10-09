import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InfoRow } from './InfoRow';

describe('InfoRow', () => {
  it('shows the label and the value', () => {
    render(<InfoRow label="Teléfono" value="300 123 4567" />);

    expect(screen.getByText('Teléfono')).toBeInTheDocument();
    expect(screen.getByText('300 123 4567')).toHaveClass('font-medium');
  });
});
