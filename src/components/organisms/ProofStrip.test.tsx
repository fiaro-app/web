import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProofStrip } from './ProofStrip';

describe('ProofStrip', () => {
  it('shows each figure with its label', () => {
    render(<ProofStrip items={[{ value: '5 min', label: 'para empezar' }, { value: '1 toque', label: 'por visita' }]} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('5 min')).toBeInTheDocument();
    expect(screen.getByText('por visita')).toBeInTheDocument();
  });
});
