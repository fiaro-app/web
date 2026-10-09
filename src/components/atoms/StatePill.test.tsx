import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatePill } from './StatePill';

describe('StatePill', () => {
  it('shows the state text in the tone of its intention', () => {
    render(<StatePill tone="success">Activo</StatePill>);

    expect(screen.getByText('Activo')).toHaveClass('bg-success/12', 'text-success');
  });

  it('has a muted tone for states that are over (Inactivo, Anulado)', () => {
    render(<StatePill tone="muted">Inactivo</StatePill>);

    expect(screen.getByText('Inactivo')).toHaveClass('text-foreground/70');
  });
});
